const { Client } = require('pg');
const express = require('express');
const bodyParser = require('body-parser'); // submit claim - Import bodyParser module
const app = express();
const port = process.env.PORT || 3000;

//public directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Submit claim - Use body-parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Define a route to fetch data and render the EJS template
app.get('/', async (req, res) => {
  try {
    // Fetch data from the PostgreSQL database
    const result = await client.query('SELECT * FROM project');
    const projects = result.rows;

    // Render the EJS template and pass the data
    res.render('index', { projects });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the Express server
app.listen(port, () => console.log(`Server is running on port ${port}`));

// Update table
app.get('/projects', async (req, res) => {
  const { status } = req.query;

  try {
      const client = await client.connect();
      const result = await client.query('SELECT * FROM projects WHERE claim_status = $1', [status]);
      const projects = result.rows;
      res.json(projects);
      client.release();
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching projects');
  }
});


// Start of submit claim page
// Add a route for rendering the form page
app.get('/submit', (req, res) => {
  res.render('submit'); // Assuming you have a view engine set up to render EJS files
});

// Add a route for handling the form submission
app.post('/submit', async (req, res) => {
  const { proj_id, proj_title, proj_app_amt, proj_amt_uti, proj_start_date, project_end_date, proj_agency, claim_amount, claim_date, claim_status } = req.body;

  try {
    // Insert the submitted data into the PostgreSQL database
    await client.query('INSERT INTO project (proj_id, proj_title, proj_app_amt, proj_amt_uti, proj_start_date, project_end_date, proj_agency, claim_amount, claim_date, claim_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [proj_id, proj_title, proj_app_amt, proj_amt_uti, proj_start_date, project_end_date, proj_agency, claim_amount, claim_date, claim_status]);
    
    // Redirect to the homepage after successful submission
    res.redirect('/');
  } catch (error) {
    console.error('Error inserting data into database:', error);
    res.status(500).send('Internal Server Error');
  }
});
//end of submit claim page

//Populate dynamic dropdownlist for proj status
