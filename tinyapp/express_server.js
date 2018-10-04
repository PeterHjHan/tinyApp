const express = require('express');
const app = express();
const PORT = 8080;
const util = require('./lib/Utilities');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//username cookies

app.post('/login', (req, res) => {
  let userInput = req.body.username;
  res.cookie('username', userInput);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//user_register

app.post('/register', (req, res) => {
  //TODO:
})

//Start of the URLS

//Page with all URLS for short and long
app.get('/urls', (req, res) => {
  let template = {urlDatabase,
  username: req.cookies["username"],
}
  res.render('url_index', template);
})

//Page for Adding new URLS
app.get('/urls/new', (req, res) => {
  let template = {urlDatabase,
  username: req.cookies["username"],
  }
  res.render('url_new', template)
})


//Page when Submit is clicked on /urls/new
app.post('/urls', (req, res) => {
  let templateInfo = {
    urlDatabase,
    username: req.cookies["username"],
  }
  const randomKey = util.generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[randomKey] = longURL;
  res.render('url_index', templateInfo);
})

//redirecting the short link to the actual page
app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let longURL = urlDatabase[short];
  res.redirect(longURL);
});

//DELETE buttons
app.post('/urls/:id/delete', (req, res) => {
  const objectKey = req.params.id
  delete urlDatabase[objectKey];  
  res.redirect('/urls')
})

//Update with POST
app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let newURL = req.body.longURL;
  urlDatabase[shortURL] = newURL;
  res.redirect('/urls');
})




//Page shows URL individual
app.get('/urls/:id', (req, res) => {
  let template = {shortURL: req.params.id,
  longURL : urlDatabase[req.params.id],
  username: req.cookies["username"],
};
  res.render('url_show', template);
});

app.listen(PORT, () => {
  console.log(`Conneciton to ${PORT} is completed`);
})
