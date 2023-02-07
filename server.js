const express = require("express");

const socketIO = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require('body-parser');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect("mongodb+srv://User:contrasena123@cluster1.qbnwblu.mongodb.net/labtest01_COMP3133?",
{ useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
  console.log("Successfully connected to the database mongoDB Atlas Server");    
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", userRoutes);
app.use(express.static(__dirname));
//Declare MongoDB Schemas
var Message = mongoose.model('Message',{
  name : String,
  message : String
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/register.html");

});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{ 
    if(err)
    {
      //sendStatus(500);
      console.log(err)
    }

    //Send Message to all users
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', (socket) => {
  console.log(`A NEW user is connected: ${socket.id}`)
  //console.log(socket.rooms);
  //socket.join("room1")
  //console.log(socket.rooms);
})

//user leaves the chat
io.on('disconnect', (socket) => {
  console.log(`A user is disconnected: ${socket.id}`)
})
io.on("clientDisconnect", function() {
  
  res.redirect("/register");
});
   

var server = http.listen(3000, () => {
  console.log("Listening on port 3000");
});
