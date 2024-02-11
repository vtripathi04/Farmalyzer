  $(document).ready(function() {
    $('.dropdown-item').click(function() {
      var selectedType = $(this).text();
      if (selectedType === 'Admin') {
        window.location.href = '../Admin/index.html'; // Replace 'admin_dashboard.html' with the actual path to your admin dashboard
      } else if (selectedType === 'Farmer') {
        window.location.href = '../Farmers/index.html'; // Replace 'farmer_dashboard.html' with the actual path to your farmer dashboard
      }
    });
  });
