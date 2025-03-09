const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser")
const serverless = require('serverless-http');

const { Pool } = require('pg');

const app = express();

app.use(cors())
app.use(bodyParser())



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}


/*
const client = new Client ({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
})
*/
// Read the JSON file
//const dataPath = path.join(__dirname, 'events.json');
//const rawData = fs.readFileSync(dataPath, 'utf8');
//const data = JSON.parse(rawData);
// console.log(process.env.DATABASE_URL)


const { floor, random } = Math;

function generateUpperCaseLetter() {
  return randomCharacterFromArray('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
}

function generateNumber() {
  return randomCharacterFromArray('1234567890');
}

function randomCharacterFromArray(array) {
  return array[floor(random() * array.length)];
}

const identifiers = [];

function generateIdentifier() {
  const identifier = [
    ...Array.from({ length: 2 }, generateUpperCaseLetter),
    ...Array.from({ length: 4 }, generateNumber)
  ].join('');

  // This will get slower as the identifiers array grows, and will eventually lead to an infinite loop
  return identifiers.includes(identifier) ? generateIdentifier() : identifiers.push(identifier), identifier;
}

async function getEvents(query){
  // Connect to Database
  const client = await pool.connect();
  try {
    // Get all the events
    const { rows } = await client.query(query);
    return rows;
  } finally {
    client.release();
  }
}

app.get('/api', async(req, res) => {
  let query = "SELECT * FROM events";
  const data = await getEvents(query);
  res.json(data);
});

app.get("/api/event", async (req,res)=>{
  let query = "SELECT * FROM events";
  const data = await getEvents(query)
  res.json(data);
})

app.get("/api/event/:id", (req, res)=>{
  const id = req.params.id
  let query = `SELECT * FROM events WHERE id='${id}'`
  const data = getEvents(query);
  res.json(data[0]);
});

app.delete("/api/event", (req, res) => {
  let eventId = req.body.id
  console.log(`Received: ${req.body.id}`)
  const data = fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8');
  let events = JSON.parse(data);
  console.log("Delete request received!")
  let newEvents = events.filter(item => item.id !== eventId)
  // for (let i = 0; i < events.length; i++) {
  //   if (events[i].id == eventId) {
  //     console.log(events)
  //     events.remove(i);
  //     break;
  //   }
  // }
  fs.writeFileSync(
    path.join(__dirname, 'events.json'),
    JSON.stringify(newEvents, null, 2),
    'utf8'
  );
  res.json("Delete request recieved!")
});

app.put("/api/event/:id", (req, res) => {
  let eventId = req.params.id
  console.log(`Received: ${req.body}`)
  const data = fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8');
  let events = JSON.parse(data);
  console.log("PUT request received!")
  for (let i = 0; i < events.length; i++) {
    if (eventId == events[i].id) {
      events[i] = req.body;
    }
  }
  fs.writeFileSync(
    path.join(__dirname, 'events.json'),
    JSON.stringify(events, null, 2),
    'utf8'
  );
  res.json("PUT request recieved!")
});

app.post("/event", (req, res) => {
    console.log(`Received: ${req.body}`)
    const data = fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8');
    let events = JSON.parse(data);
    req.body.id = generateIdentifier()

    events.push(req.body)
    const writeData = JSON.stringify(events, null, 2);
    fs.writeFileSync(path.join(__dirname, 'events.json'), writeData, 'utf8');
    console.log(events);
    res.json("Post request recieved!")
});


/*app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
*/

// Export the wrapped app so it can run as a serverless function
module.exports = serverless(app);

