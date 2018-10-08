const express = require('express');
const app = express();
const util = require('./lib/Utilities');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}))
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
};
//================================== HOME PAGE
app.get('/', (req, res) => {
  let userExists = doesTheUserExist(req.session.user_id)
  if (!userExists) {
    res.redirect('/login')
  } else {
    res.redirect('/urls');
  }
});

//================================== Login PAGE
app.get('/login', (req, res) => {
  let userExists = doesTheUserExist(req.session.user_id)

  if (!userExists) {
    let templateInfo = {
      users,
      urlDatabase,
      userCookie: req.session.user_id,
      userExists,
    }
    res.render('user_login', templateInfo);
  } else {
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  let emailInput = req.body.email;
  let passwordInput = req.body.password;
  let validation;

  for (let correctUser in users) {
    if (emailInput === users[correctUser].email &&
      bcrypt.compareSync(passwordInput, users[correctUser].password)) {
      validation = true;
      req.session.user_id = correctUser;
    }
  }
  if (validation) {
    req.session.user_id;
    res.redirect('/urls');
  } else {
    res.send("Your email or password is incorrect");
  }
});
//================================== USER Logout

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

//================================== USER REGISTER

app.get('/register', (req, res) => {

  let userExists = doesTheUserExist(req.session.user_id);

  if (!userExists) {
    let templateInfo = {
      users,
      urlDatabase,
      userCookie: req.session.user_id,
      userExists,
    }
    res.render('user_register', templateInfo);
  } else {
    res.redirect('/urls');
  }
})
app.post('/register', (req, res) => {
  let emailInput = req.body.email;
  let passwordInput = req.body.password;
  let randomId = util.generateRandomString();
  let exactEmail = "";
  req.session.user_id = randomId;

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
      password: bcrypt.hashSync(passwordInput,5),
      userID: randomId,
    };
    req.session.user_id;
    console.log(users);
    res.redirect('/urls');
  };
});
//================================== Page with all shortURL and URLS
app.get('/urls', (req, res) => {
  let userExists = doesTheUserExist(req.session.user_id)
  if (!userExists) {
    res.render('error_login');
  } else {
    let templateInfo = {
      users,
      userCookie: req.session.user_id,
      urlDatabase: urlsForUser(req.session.user_id),
      userExists,
    }
    res.render('url_index', templateInfo);
  }
});
//================================== Page for Adding new URLS
app.get('/urls/new', (req, res) => {
  let userExists = doesTheUserExist(req.session.user_id)
  if (!userExists) {
    res.redirect('/login')
  } else {
    let templateInfo = {
      users,
      urlDatabase,
      userCookie: req.session.user_id,
      userExists,
    }
    res.render('url_new', templateInfo);
  }
});
//================================== SUBMIT button in /urls/new
app.post('/urls/new', (req, res) => {
  const randomKey = util.generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[randomKey] = {
    url: longURL,
    userID: req.session.user_id,
  }
  res.redirect('/urls');
});
//================================== REDIRECT the shortURL to appropriate URL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let correctURL;
  for(let urlKey in urlDatabase) {
    if(shortURL === urlKey) {
      correctURL = shortURL;
    }
  }
  if(correctURL === undefined) {
    res.send(`The ${shortURL} does not exist, check your spelling`);
  } else {
    let longURL = urlDatabase[correctURL].url;
    res.redirect(longURL);
  }

});

//================================== DELETE buttons
app.post('/urls/:id/delete', (req, res) => {
  const objectKey = req.params.id
  const userCookie = req.session.user_id;
  const urlDatabaseID = urlDatabase[objectKey].userID

  if (userCookie === urlDatabaseID) {
    delete urlDatabase[objectKey];
    res.redirect('/urls')
  } else {
    res.send("you do not have access to this");
  }
})


//================================== EDIT Button to update URL

app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  let newURL = req.body.longURL;
  urlDatabase[shortURL].url = newURL;
  res.redirect('/urls');
})

//================================== Page shows URL individual
app.get('/urls/:id', (req, res) => {
  const objectKey = req.params.id
  const userCookie = req.session.user_id;
  const urlDatabaseID = urlDatabase[objectKey].userID
  console.log(userCookie);
  console.log(urlDatabaseID);

  if (userCookie === urlDatabaseID) {
    let templateInfo = {
      users,
      shortURL: req.params.id,
      longURL: urlDatabase[req.params.id].url,
      userCookie: req.session.user_id,
    };
    res.render('url_show', templateInfo);
  } else {
    res.send("you do not have access to this");
  }
});

app.listen(PORT, () => {
  console.log(`Conneciton to ${PORT} is completed`);
})

function urlsForUser(userId) {
  let newUrlDatabase = {};

  for (let urls in urlDatabase) {
    if (userId === urlDatabase[urls].userID) {
      newUrlDatabase[urls] = urlDatabase[urls];
    }
  }
  return newUrlDatabase;
};

function doesTheUserExist(user) {
  let existingUser;
  for (let element in users) {
    if(user === users[element].userID) {
       return existingUser = user;
    }
  }
  return existingUser;
};