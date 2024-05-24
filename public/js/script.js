// Open the default tab when the page loads
window.onload = function() {
    openTab("grant-call");


// Function to fetch data from the server and update the table
function fetchData() {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => {
        const dataTable = document.getElementById('data-table');
        const tbody = dataTable.querySelector('tbody');
        
        // Clear existing rows
        tbody.innerHTML = '';
  
        // Populate table with fetched data
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.project_id}</td>
            <td>${row.project_title}</td>
            <!-- Add more table data cells as needed -->
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Call fetchData function when the page loads
  window.onload = function() {
    fetchData();
  };
  

};
// Function to show/hide divs based on navigation bar clicks
function openTab(divId) {
  // Get all tab-content divs
  var tabContents = document.getElementsByClassName('tab-content');

  // Loop through tab-content divs
  for (var i = 0; i < tabContents.length; i++) {
    // Hide all tab-content divs
    tabContents[i].style.display = 'none';
  }

  // Show the selected tab-content div
  var selectedDiv = document.getElementById(divId);
  if (selectedDiv) {
    selectedDiv.style.display = 'block';
  }
}

/* Filter table by approved or pending */
document.addEventListener('DOMContentLoaded', function() {
  // Set default selection to 'Pending' after the DOM has loaded
  var claimStatusDropdown = document.getElementById('claimStatus');
  claimStatusDropdown.value = 'pending'; // Set the value of the dropdown directly

  // Manually trigger change event for the dropdown list
  var event = new Event('change');
  claimStatusDropdown.dispatchEvent(event);

  // Event listener for dropdown list change
  claimStatusDropdown.addEventListener('change', function() {
      var status = this.value.toLowerCase(); // Get the selected status
      
      // Get all rows in the table body
      var rows = document.querySelectorAll('.projecttable tbody tr');

      // Loop through each row and show/hide based on selected status
      rows.forEach(function(row) {
          var claimStatusCell = row.querySelector('td:nth-child(10)'); // Assuming claim status is in the 10th column
          var rowStatus = claimStatusCell.innerText.toLowerCase();
          if (status === 'all' || rowStatus === status) {
              row.style.display = ''; // Show row if 'all' is selected or claim status matches selected status
          } else {
              row.style.display = 'none'; // Hide row if claim status doesn't match selected status
          }
      });
  });
});
