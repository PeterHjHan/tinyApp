const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 7500;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));


var starships = [
  {id : "1", name: "Galleon", size: "Huge",},
  {id : "2", name: "Roy Ship", size: "Tiny"},
  {id : "3", name: "Enterprise", size: "Massive"},
]

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/starships', (req, res) => {
  let templateVars = {
    starships,
  };
  res.render('starhips/index', templateVars);
})

app.get('/starships/new', (req, res) => {
  res.render('starships/new/', );
})

app.listen(PORT, function() {
  console.log(`Successful connectino to ${PORT}`);
})

//home page
// GET / 

//TODO: see a list of starships
//use GET (not POST) = GET, POST, PUT, PATCH, DELETE
// GET /starships

//TODO:see a list of user
//GET /list

//TODO:create a starship
// GET  /new_ship
// POST /starshipname = done by clicking a certin button or an eventlistener;
app.post('/starships/:id', (req, res) =>{
  
  //grab the form information
  req.body  //refers to the object of the input from the form

  //have a way to get to the database
    //save to the DB
  starships.push(req.body);

  
  res.rendor('index'); // causes refersh errors to add the same thing again, thus use
  res.redirect('/starships');
  // 3. Redirecting does the following
      // 1. Set the stauts to 300 level
      // 2. SEt the locatoin header to the path declared
      // 3. Send the response. 
})

//DELETE
app.post('', (req, res) => {
  //1. Find the target starshipe we want to delete
  let targetId = req.params.id;
  starships.find(function(starhip){
    return starships.id === targetId;
  })
  let targetIndex = starships.indexOf(targetId);
  //2. Delete it
  starships.splice(targetIndex, 1);
  //3. Redirect to the list
  res.redirect();
});


//TODO:update a specific starships
//GET /starships/:id/edit
//PATCH /starships/:id

//TODO:view a list of starships
//GET /starships/:id    /doesn't matter if the above has the same URL because the methods are different      



//Route Design
// needs a HTTP Method + path
// URLs in the browswer can only get GET methods
// step by step, we are clearing the URL names just like we are doing with the functions
// make sense and and design the routes using RESTful;