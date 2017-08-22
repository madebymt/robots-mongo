const express = require("express")
const MongoClient = require("mongodb")
const app = express()
const mustache = require("mustache-express")
const path = ("path")
const MONGO_URL = "mongodb://127.0.0.1:27017/robots"

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.use( express.static('public'))


///// code from teacher for import data to mongo /////
MongoClient.connect(MONGO_URL, function(err, db) {
  if (err) {
    throw err;
  } else {
    console.log('Successfully connected to the database');
  }
  const data = require("./data");
  for (var i = 0; i < data.users.length; i++) {
    const user = data.users[i];
    db.collection("users").updateOne(
      {id: user.id},
      user,
      {upsert: true}
    )
  }
})
//////----------------------////////
app.get("/", function(req, res) {
  MongoClient.connect(MONGO_URL, function(err, db) {
      console.log("Check robot")
    db.collection("users").find().toArray().then(function(users) {
      res.render("index", {
        users: users
      })
    })
  })
})

app.get("/users/:id", function(req, res) {
  MongoClient.connect(MONGO_URL, function(err, db) {
    db
      .collection("users")
      .findOne({id: parseInt((req.params.id))})
      .then(function(user) {
        res.render("users", {
          user: user
        })
      })
  })
})

///////////---------------------//////

// app.get("/", function(request, response){
//     // const title = ("hello")
//   response.render('index', {
//      data:data.users
//   })
// })


app.listen(3000, function(){
console.log("Express started on port 3000")
})
