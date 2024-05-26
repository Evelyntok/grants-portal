// Open the default tab when the page loads
window.onload = function() {
    openTab("grant-call");
}
    

document.addEventListener('DOMContentLoaded', function() {
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
                      <td>${row.proj_start_date}</td>
                      <td>${row.project_end_date}</td>
                      <td>${row.proj_app_amt}</td>
                      <td>${row.proj_amt_uti}</td>
                      <td>${row.claim_amount}</td>
                      <td>${row.proj_agency}</td>
                      <td>${row.claim_date}</td>
                      <td>${row.claim_status}</td>
                      <td>${row.applicant_email}</td>
                  `;
                  tbody.appendChild(tr);
              });
          })
          .catch(error => console.error('Error fetching data:', error));
  }

  // Call fetchData function when the DOM is loaded
  fetchData();

  // Function to format date in dd/mm/yyyy format
  function formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
  }

  // Function to format currency with dollar sign
  function formatCurrency(amount) {
      return `$${parseFloat(amount).toFixed(2)}`;
  }
});



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

//Start- Submit claim page
function fetchProjectDetails(projTitle) {
  // Make AJAX request to server to fetch project details
  fetch(`/projects?title=${projTitle}`)
    .then(response => response.json())
    .then(data => {
      // Populate other fields with project details
      document.getElementById('proj_id').value = data.proj_id;
      document.getElementById('proj_app_amt').value = data.proj_app_amt;
      document.getElementById('proj_amt_uti').value = data.proj_amt_uti;
      document.getElementById('proj_start_date').value = data.proj_start_date;
      document.getElementById('project_end_date').value = data.project_end_date;
    })
    .catch(error => console.error('Error fetching project details:', error));
}
//End- Submit claim page


// Approve/reject button functions

document.addEventListener('DOMContentLoaded', function() {
    const approveButtons = document.querySelectorAll('.approve-btn');
    const rejectButtons = document.querySelectorAll('.reject-btn');

    approveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const projId = row.querySelector('.proj-id').textContent;
            const projtitle = row.querySelector('.proj-title').textContent;
            const claimAmountRaw = row.querySelector('.claim-amount').textContent.replace('$', '');
            const projAppAmtRaw = row.querySelector('.proj-app-amt').textContent.replace('$', '');
            const projAmtUtiRaw = row.querySelector('.proj-amt-uti').textContent.replace('$', '');
           
            console.log('Raw Claim Amount:', claimAmountRaw);
            console.log('Raw Project Approved Amount:', projAppAmtRaw);
            console.log('Raw Project Amount Utilised:', projAmtUtiRaw);

            const claimAmount = parseFloat(claimAmountRaw);
            const projAppAmt = parseFloat(projAppAmtRaw);
            const projAmtUti = parseFloat(projAmtUtiRaw);
            const applicantEmail = row.querySelector('.applicant-email').textContent;
            console.log('Project ID:', projId);
            console.log('Project Title:', projtitle);
            console.log('applicantEmail: ', applicantEmail);
            console.log('Claim Amount:', claimAmount);
            console.log('Project Approved Amount:', projAppAmt);
            console.log('Project Amount Utilised:', projAmtUti);
            console.log('Available Amount:', projAppAmt - projAmtUti);

            if (claimAmount <= projAppAmt - projAmtUti) {
                // Approve the claim
                approveClaim(projId, projtitle, claimAmount, projAppAmt, projAmtUti, applicantEmail);
            } else {
                alert("Project exceeded available grant amount. Please check again.");
            }
        });
    });

    rejectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const projId = row.querySelector('.proj-id').textContent;
            const reason = prompt("Enter reason for rejection:");

            if (reason) {
                // Reject the claim
                rejectClaim(projId, reason);
            }
        });
    });

    function approveClaim(projId, projTitle, claimAmount, projAppAmt, projAmtUti, applicantEmail) {
        console.log('projTitle:', projTitle);
        console.log('claimAmount:', claimAmount);
        console.log('projAppAmt:', projAppAmt);
        console.log('projAmtUti:', projAmtUti);
        console.log('applicantEmail:', applicantEmail);
    
        fetch(`/approve/${projId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                projTitle: projTitle,
                claimAmount: claimAmount,
                projAppAmt: projAppAmt,
                projAmtUti: projAmtUti,
                applicantEmail: applicantEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Refresh the page to update the table
        })
        .catch(error => console.error('Error:', error));
    }
    
    function rejectClaim(projId, reason) {
        fetch(`/reject/${projId}`, { // Correct route path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Refresh the page to update the table
        })
        .catch(error => console.error('Error:', error));
    }
    
});


//End of approve/reject function button
