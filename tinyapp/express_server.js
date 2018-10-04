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



const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

//username cookies

app.post('/login', (req, res) => {
  let userInput = req.body.username;
  res.cookie("user_id", userInput);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//USER_REGISTER

app.post('/register', (req, res) => {
  let emailInput = req.body.email;
  let passwordInput = req.body.password;
  let randomId = util.generateRandomString();
  let exactEmail = "";

  for(let emails in users) {
    if(emailInput === users[emails].email) {
      exactEmail += users[emails].email;
    }
  }

  if (emailInput.length == 0 || passwordInput.length == 0) {
    res.status(400);
    res.send("YOU SHALL NOT PASS");

  } else if (emailInput === exactEmail) {
    res.status(400);
    res.send("EMAIL already exists");

  } else {
    users[randomId] = {
      id: randomId,
      email: emailInput,
      password: passwordInput
    };
  }
  res.cookie('user_id', randomId);
  res.redirect('/urls')
})



app.get('/register', (req, res) => {

  let templateInfo = {
    users,
  }
  res.render('user_register', templateInfo);
})

//Start of the URLS

//Page with all URLS for short and long
app.get('/urls', (req, res) => {
  let templateInfo = {
    urlDatabase,
    username: req.cookies["username"],
    users,
  }
  res.render('url_index', templateInfo);
})

//Page for Adding new URLS
app.get('/urls/new', (req, res) => {
  let templateInfo = {
    urlDatabase,
    username: req.cookies["username"],
    users,
  }
  res.render('url_new', templateInfo)
})


//Page when Submit is clicked on /urls/new
app.post('/urls', (req, res) => {
  let templateInfo = {
    urlDatabase,
    username: req.cookies["username"],
    users,
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
  let templateInfo = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"],
    users,
  };
  res.render('url_show', templateInfo);
});

app.listen(PORT, () => {
  console.log(`Conneciton to ${PORT} is completed`);
})