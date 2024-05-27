const { Client } = require('pg');
const { Pool } = require('pg'); 
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser'); // submit claim - Import bodyParser module
const path = require('path');
const app = express();
const port = process.env.PORT || 4000;
require('dotenv').config();

//public directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Route to render the page
app.get('/', (req, res) => {
  res.render('login');
});

// Create a PostgreSQL client
const client = new Client({
  connectionString: 'postgres://grants_portal_database_user:YPzjkqyQpYnctnKsvvMzoUplj8rrcTXN@dpg-cp2ukbq1hbls7385ce7g-a.singapore-postgres.render.com/grants_portal_database',
  ssl: {
    rejectUnauthorized: false // Only if your provider requires SSL
  }
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Error connecting to the PostgreSQL database', err));

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // Start the Express server
  app.listen(port, () => console.log(`Server is running on port ${port}`));
  
  
// Define a route to fetch data and render the EJS template
app.get('/', async (req, res) => {
  try {
    // Fetch data from the PostgreSQL database
    const result = await client.query('SELECT * FROM project');
    const projects = result.rows.map(row => ({
        ...row,
        // Format dates
        proj_start_date: formatDate(row.proj_start_date),
        project_end_date: formatDate(row.project_end_date),
        claim_date: formatDate(row.claim_date),
        // Format currency
        proj_app_amt: formatCurrency(row.proj_app_amt),
        proj_amt_uti: formatCurrency(row.proj_amt_uti),
        claim_amount: formatCurrency(row.claim_amount)
    }));

    // Render the EJS template and pass the formatted data
    res.render('index', { projects });
} catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
}
});

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


// Submit claim - Use body-parser middleware to parse incoming request bodies

// Start of submit claim page
// Add a route for rendering the form page
app.get('/submit', (req, res) => {
  res.render('submit'); // Assuming you have a view engine set up to render EJS files
});
// Add a route for handling the form submission
app.post('/submit', async (req, res) => {
  const { proj_id, claim_amount, claim_date, claim_status } = req.body;

  try {
    // Update the submitted data in the PostgreSQL database
    await client.query(
      'UPDATE project SET claim_amount = $1, claim_date = $2, claim_status = $3 WHERE proj_id = $4',
      [claim_amount, claim_date, claim_status, proj_id]
    );

    // Redirect to the homepage after successful submission
    res.redirect('/');
  } catch (error) {
    console.error('Error updating data in database:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the submit form page
app.get('/submit', async (req, res) => {
  try {
    // Fetch projects from the database or any other source
    const result = await client.query('SELECT proj_title FROM project');
    const projects = result.rows.map(row => row.proj_title);

    // Render the submit form page and pass the projects data to the template
    res.render('submit', { projects });
  } catch (error) {
    console.error('Error rendering submit form page:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch project titles

// Route to fetch project details based on project title

app.get('/projects', async (req, res) => {
  try {
    const result = await client.query('SELECT proj_title FROM project');
    const projects = result.rows.map(row => ({ proj_title: row.proj_title }));
    res.json(projects); // Return project titles as JSON
  } catch (error) {
    console.error('Error fetching project titles:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to fetch project details based on title
app.get('/projects/details', async (req, res) => {
  const { title } = req.query;
  try {
    const result = await client.query('SELECT * FROM project WHERE proj_title = $1', [title]);
    const project = result.rows[0];
    if (project) {
      res.json(project);
    } else {
      res.status(404).send('Project not found');
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).send('Internal Server Error');
  }
});

// code to retrieve data from sql server to fill up form
//end of submit claim page
// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'grantopia2024@gmail.com', // Your Gmail email address
    pass: 'evelyntok' // Your Gmail password or app-specific password
  }
});
//function approveClaim(projId, projTitle, claimAmount, projAppAmt, projAmtUti, applicantEmail) 
//start of approve/reject functions
// Approve route
app.post('/approve/:id', async (req, res) => {
  const { id } = req.params;
  const { projTitle, claimAmount, projAppAmt, projAmtUti, applicantEmail } = req.body;
 // Log the request body to see its structure and contents
 console.log('Request Body:', req.body);
  console.log('Raw Claim Amount:', claimAmount);
  console.log('Raw Project Approved Amount:', projAppAmt);
  console.log('Raw Project Amount Utilised:', projAmtUti);

  if (claimAmount <= (projAppAmt - projAmtUti)) {
      console.log('Claim amount is within available grant amount.');

      try {
        console.log('Updating database approve...');
        await client.query('UPDATE project SET proj_amt_uti = proj_amt_uti + $1, claim_amount = 0, claim_status = $2 WHERE proj_id = $3', [claimAmount, 'Approved', id]);
        console.log('Database updated approve.');
         // Send success response to client
      res.json({ success: true, message: 'Claim approved successfully' });  
        // Send email with gmail
      
    } catch (error) {
      console.error('Error updating data in database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' }); // Send error message
    }
  } else {
    console.log('Claim amount exceeds available grant amount.');
    res.json({ success: false, message: 'Project exceeded available grant amount. Please check again.' }); // Send error message
  }
});


// Reject route
app.post('/reject/:id', async (req, res) => {
  const { id } = req.params;
  const { projTitle, reason, applicantEmail } = req.body;

  try {
    console.log('Updating database reject...');
      await client.query('UPDATE project SET claim_status = $1 WHERE proj_id = $2', ['Rejected', id]);
      console.log('Updated database reject...'); 
      

      res.json({ success: true, message: 'Claim rejected successfully' }); // Send success message
  } catch (error) {
      console.error('Error updating data in database:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' }); // Send error message
  }
});


//end of approve/reject functions
// mailgun api code
