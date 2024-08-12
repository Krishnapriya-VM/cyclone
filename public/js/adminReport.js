document.getElementById('reportForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const period = document.getElementById('period').value;
  
    const query = new URLSearchParams({ startDate, endDate, period }).toString();
  
    const response = await fetch(`/admin/report/sales?${query}`);
    const data = await response.json();
  
    const reportResults = document.getElementById('reportResults');
    reportResults.innerHTML = `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Sales Count</th>
            <th>Total Amount</th>
            <th>Product Names</th>
            <th>Payment Methods</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${data.salesCount}</td>
            <td>${data.totalAmount}</td>
            <td>${data.productNames.join(', ')}</td>
            <td>${[...new Set(data.paymentMethods)].join(', ')}</td>
          </tr>
        </tbody>
      </table>
    `;
  });
  
  document.getElementById('downloadPDF').addEventListener('click', function () {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const period = document.getElementById('period').value;
    const query = new URLSearchParams({ startDate, endDate, period }).toString();
    window.location.href = `/admin/report/download/pdf?${query}`;
  });
  
  document.getElementById('downloadExcel').addEventListener('click', function () {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const period = document.getElementById('period').value;
    const query = new URLSearchParams({ startDate, endDate, period }).toString();
    window.location.href = `/admin/report/download/excel?${query}`;
  });
  