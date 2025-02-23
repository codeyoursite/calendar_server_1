const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const bodyParser = require("body-parser")

const app = express();

app.use(cors())
app.use(bodyParser())

// Read the JSON file
const dataPath = path.join(__dirname, 'events.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(rawData);

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

app.get('/', (req, res) => {
  res.json(data);
});

app.get("/event", (req,res)=>{
  const data = fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8');
  let events = JSON.parse(data);
  res.json(data);
})

app.get("/event/:id", (req, res)=>{
  const id = req.params.id
  const data = fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8');
  let events = JSON.parse(data);
  for (let i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      res.json(events[i]);
      return;
    }
  }
  res.json("err");
});

app.delete("/event", (req, res) => {
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

app.put("/event/:id", (req, res) => {
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

app.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
  
  