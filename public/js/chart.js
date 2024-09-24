function renderSalesChart(salesData) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],// Sample months
        datasets: [{
          label: 'Sales',
          data: salesData, // Populate with actual sales data
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        }]
      }
    });
  }
  
  function renderUsersChart(userCount) {
    const ctx = document.getElementById('usersChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Users'],
        datasets: [{
          label: 'Users Count',
          data: [userCount], // Actual number of users
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      }
    });
  }
  
  function renderProductsChart(productsSold) {
    const ctx = document.getElementById('productsChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Products Sold'],
        datasets: [{
          label: 'Products Sold',
          data: [productsSold], // Populate with actual products data
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      }
    });
  }
  