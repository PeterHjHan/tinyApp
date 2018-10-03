var express = require('express');
var app = express();
var PORT = 8080;
var util = require('./lib/Utilities');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Start of the URLS

//Page with all URLS for short and long
app.get('/urls', (req, res) => {
  let template = {urlDatabase,}
  res.render('url_index', template);
})

//Page for Adding new URLS
app.get('/urls/new', (req, res) => {
  res.render('url_new')
})
//Page when Submit is clicked on /urls/new
app.post('/urls', (req, res) => {
  var randomKey = util.generateRandomString();
  var longURL = req.body.longURL;
  console.log(longURL);
  urlDatabase[randomKey] = longURL;
  res.render('url_index', {urlDatabase,});
})

//redirecting the short link to the actual page
app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let longURL = urlDatabase[short];
  res.redirect(longURL);
});

//DELETE buttons
app.post('/urls/:id/delete', (req, res) => {
  var objectKey = req.params.id
  delete urlDatabase[objectKey];  
  res.redirect('/urls')
})

//Update with POST

app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;

  console.log(shortURL);
  let newURL = req.body.longURL;
  console.log(newURL);
  urlDatabase[shortURL] = newURL;

  //connect to the input

  res.redirect('/urls');
})




//Page shows URL individual
app.get('/urls/:id', (req, res) => {
  let template = {shortURL: req.params.id,
  longURL : urlDatabase[req.params.id],
};
  res.render('url_show', template);
});

app.listen(PORT, () => {
  console.log(`Conneciton to ${PORT} is completed`);
})
