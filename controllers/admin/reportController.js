const Order = require("../../models/orderModel");
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');


function getStartDate(period) {
  const now = new Date();
  switch (period) {
    case "1day":
      return new Date(now.setDate(now.getDate() - 1));
    case "1week":
      return new Date(now.setDate(now.getDate() - 7));
    case "1month":
      return new Date(now.setMonth(now.getMonth() - 1));
    case "1year":
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return null;
  }
}

const loadReportPage = async(req, res)=>{
    try {
        res.render("admin/reports")
    } catch (error) {
        console.log(error.message)
    }
}

const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    console.log(startDate,endDate,period);
    
    let query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (period) {
      const start = getStartDate(period);
      if (start) {
        query.date = { $gte: start };
      }
    }

    const orders = await Order.find(query).populate("products.product_id");
    console.log(orders[0].products)

    let salesCount = 0;
    let totalAmount = 0;
    let productNames = [];
    let paymentMethods = [];

    orders.forEach((order) => {
      salesCount++;
      totalAmount += order.total_amount;
      order.products.forEach((product) => {
        productNames.push(product.product_id.productname); // Assuming product schema has a 'name' field
      });
      paymentMethods.push(order.payment_method);
    });

    res.json({ salesCount, totalAmount, productNames, paymentMethods });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const downloadPDFReport = async (req, res) => {
    try {
      const { startDate, endDate, period } = req.query;
  
      let query = {};
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
      } else if (period) {
        const start = getStartDate(period);
        if (start) {
          query.date = { $gte: start };
        }
      }
  
      const orders = await Order.find(query).populate("products.product_id");
  
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      let filename = 'sales_report';
      filename = encodeURIComponent(filename) + '.pdf';
  
      res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
      res.setHeader('Content-type', 'application/pdf');
      doc.pipe(res);
  
      const tableTop = 100;
      const itemCodeX = 50;
      const descriptionX = 200;
      const quantityX = 300;
      const priceX = 370;
      const totalX = 450;
  
      const rowHeight = 30; // Define a consistent row height
  
      const drawTableHeader = () => {
        doc.fontSize(8);
        doc.text('Order ID', itemCodeX, tableTop);
        doc.text('Date', descriptionX, tableTop);
        doc.text('Total Amount', quantityX, tableTop);
        doc.text('Payment Method', priceX, tableTop);
        doc.text('Product Names', totalX, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      };
  
      const drawRow = (order, y) => {
        doc.text(order._id, itemCodeX, y);
        doc.text(order.date.toDateString(), descriptionX, y);
        doc.text(order.total_amount.toFixed(2), quantityX, y);
        doc.text(order.payment_method, priceX, y);
        const productNames = order.products.map(product => product.product_id.productname).join(', ');
        doc.text(productNames, totalX, y, { width: 100 });
      };
  
      let y = tableTop + 30; // Start y position for the first row
      drawTableHeader();
  
      // Draw the rows and manage page breaks
      orders.forEach((order) => {
        // Check if the current position exceeds the page height
        if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
          doc.addPage();
          drawTableHeader(); // Re-draw the header on the new page
          y = tableTop + 30; // Reset y to the start position for the new page
        }
  
        drawRow(order, y);
        y += rowHeight; // Move down for the next row
      });
  
      doc.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const downloadExcelReport = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (period) {
      const start = getStartDate(period);
      if (start) {
        query.date = { $gte: start };
      }
    }

    const orders = await Order.find(query).populate("products.product_id");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Order ID", key: "id", width: 20 },
      { header: "Date", key: "date", width: 15 },
      { header: "Total Amount", key: "totalAmount", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 15 },
      { header: "Product Names", key: "productNames", width: 30 },
    ];

    orders.forEach((order) => {
      const productNames = order.products
        .map((product) => product.product_id.productname)
        .join(", ");
      worksheet.addRow({
        id: order._id,
        date: order.date,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        productNames,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  

module.exports = {
    loadReportPage,
    getSalesReport,
    downloadPDFReport,
    downloadExcelReport
}