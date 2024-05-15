let express = require('express');
let app = express();
require('dotenv').config();
var bodyParser = require("body-parser");
let staticpath =__dirname + '/public';
let path = __dirname + '/views/index.html';

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/public', express.static(staticpath));


app.get('/', (req, res) => {
  res.sendFile(path)
})

app.get("/json", (req, res) => {
  let response;
  if (process.env.MESSAGE_STYLE === "uppercase") {
    response = "Hello json".toUpperCase();
  } else {
    response = "Hello json";
  }
  res.json({
    "message": response
  });
});

app.use(function middleware(req, res, next) {
  var string = req.method + " " + req.path + " - " + req.ip;
  console.log(string);
  next();
});

app.get('/now', function(req, res, next) {
  req.time = new Date().toString();  
  next();
}, function(req, res) {
  res.send({
    time: req.time
  });
});


app.get("/:word/echo", (req, res) => {
  const { word } = req.params;
  res.json({
    echo: word
  });
});

app.get("/name", (req, res) => {
  var firstName = req.query.first;
  var lastName = req.query.last;
  var { first: firstName, last: lastName } = req.query;
  res.json({
    name: `${firstName} ${lastName}`
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post("/name", (req, res) => {
  var firstName = req.body.first;
  var lastName = req.body.last;
  res.json({
    name: `${firstName} ${lastName}`
  });
});


 module.exports = app;
