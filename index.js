//IMPORT REQUIRED MODULES
const express = require("express");
const path = require("path");
const fs = require("fs"); //file r/w module built-in to Node.js
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

//set up Express object
const app = express(); //app is the Express object
const port = process.env.PORT || "8888";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//CSS and client-side JS are static files
app.use(express.static(path.join(__dirname, "public")));

//test Express to see if it's working
/*app.get("/", (req, res) => {
  res.status(200).send("Hello...");
});*/

app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

//set up some page routes
app.get("/listings", (req, res) => {
    let cityname = req.query["name"];
    displayList(cityname, res);
});

app.get("/details/:num", (req, res) => {
  //console.log(req.params.num);
  let mlsNum = req.params.num;
  displayDetails(mlsNum, res);
});

//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

//function to display cities
function displayList(cname, res) {
    var pageData = {
      title: "List of Available Homes",
      list: null
    };
    axios(
      //the request
      {
        url: "https://sandbox.repliers.io/listings?city=" + cname,
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          'REPLIERS-API-KEY': 'MyApiKey'
        }
      }
    ).then(function (response){
      //on success do stuff
      //console.log(response.data.listings);
      pageData.list = response.data.listings; //store JSON results in pageData.list (previously null)
      res.render("listings", pageData);
    }).catch(function (error){
      console.log(error);
    });
  }

  function displayDetails(mnum, res) {
    var pageData = {
      title: "Details about Home",
      detail: null
    };
    axios(
      //the request
      {
        url: "https://sandbox.repliers.io/listings/" + mnum,
        method: "GET",
        headers: {
          'Content-Type': 'application/json', 
          'REPLIERS-API-KEY': 'MyApiKey'
        }
      }
    ).then(function (response){
      //on success do stuff
      //console.log(response.data);
      pageData.detail = response.data; //store JSON results in pageData.list (previously null)
      res.render("details", pageData);
    }).catch(function (error){
      console.log(error);
    });
  }
