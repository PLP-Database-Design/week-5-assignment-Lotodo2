
const express = require('express')
const app = express();
const mysql = require ('mysql2');
const dotenv = require ('dotenv');

app.use(express.json());
dotenv.config()


const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err)=>{
    if(err) return console.log('error connecting to mysql');
    console.log("connected to mysql as id:", db.threadid);
    
    })

// Question 1 goes here
app.get('/get-patients', (req, res) => {
    const getPatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
    db.query(getPatients, (err, results) => {
      if (err) {
        console.error('Error fetching patients:', err.message);
        res.status(500).send('Error fetching patients');
      } 
        res.status(200).send(results);
     
    });
  });

// Question 2 goes here
app.get('/get-providers', (req, res) => {
    const getProviders = 'SELECT first_name,last_name,provider_specialty FROM providers';
    
    db.query(getProviders, (err, results) => {
      if (err) {
        console.error('Error fetching providers:', err.message);
        res.status(500).send('Error fetching providers');
      } 
        res.status(200).send(results);
     
    });
  });

// Question 3 goes here

app.get('/get-patient', (req, res) => {
    const getPatient = 'SELECT  first_name FROM patients';
    
    db.query(getPatient, (err, results) => {
      if (err) {
        console.error('Error fetching patients:', err.message);
        res.status(500).send('Error fetching patients');
      } 
        res.status(200).json(results);
     
    });
  });
// Question 4 goes here

app.get('/get-providers-by-specialty', (req, res) => {
    const getProvidersBySpecialty = "SELECT provider_specialty,GROUP_CONCAT(CONCAT(first_name, ' ', last_name) SEPARATOR ', ') AS provider_name FROM providers GROUP BY provider_specialty ORDER BY provider_specialty";
    const { specialty } = req.query;
    db.query(getProvidersBySpecialty,[specialty] ,(err, results) => {
      if (err) {
        console.error('Error fetching providers:', err.message);
        res.status(500).send('Error fetching providers');
      } 
      if (results.length === 0) {
        return res.status(404).json({ message: 'No providers found for this specialty' });
    }
        res.status(200).json(results);
     
    });
  });


// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runing on http://localhost:${PORT}`)
})
