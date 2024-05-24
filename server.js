const { Client } = require('pg');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//public directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');


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
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM projects WHERE claim_status = $1', [status]);
      const projects = result.rows;
      res.json(projects);
      client.release();
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching projects');
  }
});


