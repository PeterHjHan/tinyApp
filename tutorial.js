const express = require('express');
const app = express();


//home page
// GET

//see a list of starships
//use GET (not POST) = GET, POST, PUT, PATCH, DELETE
// GET /starships

//see a list of user
//GET /list

//create a starship
// GET  /new_ship
// POST /starshipname = done by clicking a certin button or an eventlistener;

//update a specific starships
//GET /starships/:id/edit
//PATCH /starships/:id

//view a list of starships
//GET /starships/:id    /doesn't matter if the above has the same URL because the methods are different      



//Route Design
// needs a HTTP Method + path
// URLs in the browswer can only get GET methods
// step by step, we are clearing the URL names just like we are doing with the functions
// make sense and and design the routes using RESTful;