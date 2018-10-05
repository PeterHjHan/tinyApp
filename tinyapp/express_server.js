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
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "user2RandomID",
  },
};



const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
}

//username cookies

app.get('/', (req, res) => {
  res.clearCookie('user_id');
  res.render('index');
})

//Login PAGE
app.get('/login', (req, res) => {

  if (!req.cookies.user_id) {
    res.render('user_login');
  } else {
    res.send('You are already logged in');
  }
});

app.post('/login', (req, res) => {
  let emailInput = req.body.email;
  let passwordInput = req.body.password;
  let validation;
  let correctCookie;

  for (let correctUser in users) {
    if (emailInput === users[correctUser].email &&
      passwordInput === users[correctUser].password) {
      validation = true;
      correctCookie = users[correctUser].id;
    }
  }

  if (validation) {
    res.cookie('user_id', correctCookie)
    res.redirect('/urls');
  } else {
    res.send("Your email or password is incorrect");
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

//USER_REGISTER

app.get('/register', (req, res) => {

  if (!req.cookies.user_id) {
    res.render('user_register');
  } else {
    res.redirect('/urls');
  }
})
app.post('/register', (req, res) => {
  let emailInput = req.body.email;
  let passwordInput = req.body.password;
  let randomId = util.generateRandomString();
  let exactEmail = "";

  for (let emails in users) {
    if (emailInput === users[emails].email) {
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
      password: passwordInput,
      userID: randomId,
    }
    res.cookie('user_id', randomId);
    res.redirect('/urls');
  };
});

//Start of the URLS

//Page with all URLS for short and long
app.get('/urls', (req, res) => {

  if (!req.cookies.user_id) {
    res.redirect('/register');
  } else {
    let templateInfo = {
      urlDatabase,
      username: req.cookies.user_id,
      users,
    }
    res.render('url_index', templateInfo);
  }
})

//Page for Adding new URLS
app.get('/urls/new', (req, res) => {


  if(!req.cookies.user_id){
    res.redirect('/login')
  } else {
  let templateInfo = {
    urlDatabase,
    username: req.cookies.user_id,
    users,
  }
    res.render('url_new', templateInfo);
  }
})


//Page when Submit is clicked on /urls/new
app.post('/urls/new', (req, res) => {
  const randomKey = util.generateRandomString();
  const longURL = req.body.longURL;
  console.log(req.cookies.user_id);

  urlDatabase[randomKey] = {
    url: longURL,
    userID: req.cookies.user_id,
  }
  console.log(urlDatabase);
  res.redirect('/urls');
})


//redirecting the short link to the actual page
app.get("/u/:shortURL", (req, res) => {
  let short = req.params.shortURL;
  let longURL = urlDatabase[short].url;
  res.redirect(longURL);
});

//DELETE buttons
app.post('/urls/:id/delete', (req, res) => {
  const objectKey = req.params.id
  const userCookie = req.cookies.user_id;
  const urlDatabaseID = urlDatabase[objectKey].userID

  if(userCookie === urlDatabaseID) {
    delete urlDatabase[objectKey];
    res.redirect('/urls')
  } else {
    res.send("you do not have access to this");
  }
 

})


//Update with POST
app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let newURL = req.body.longURL;
  urlDatabase[shortURL].url = newURL;
  res.redirect('/urls');
})




//Page shows URL individual
app.get('/urls/:id', (req, res) => {
  const objectKey = req.params.id
  const userCookie = req.cookies.user_id;
  const urlDatabaseID = urlDatabase[objectKey].userID

  if(userCookie === urlDatabaseID) {
    let templateInfo = {
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].url,
      username: req.cookies.user_id,
      users,
    };
    res.render('url_show', templateInfo);
  } else {
    res.send("you do not have access to this");
  }
});

app.listen(PORT, () => {
  console.log(`Conneciton to ${PORT} is completed`);
})


function urlsForUser(id){
  
  for(let urls in urlDatabase) {
    if(id === urlDatabase[urls].userID) {
      return urlDatabase;
    }
    else res.send("bye bye");
  }
}