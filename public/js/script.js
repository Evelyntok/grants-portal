// Open the default tab when the page loads
window.onload = function() {
    openTab("grant-call");

// script.js

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



