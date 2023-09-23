const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require('./utilities/messages');
const {userJoin, getCurrentUser, getRoomUsers, leaveRoom} = require('./utilities/clients');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Middleware
  //set static folder
app.use(express.static(path.join(__dirname, 'public')));

const bot = "FrameChat bot";

//Run when client connects
io.on('connection', socket => {
  console.log('new ws connection');
  //Joining a room/chat
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    
    //welcome message for joining user
    socket.emit ("message", formatMessage(bot, "Welcome to FrameChat...."));
    
    //Broadcatst to other users
    socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat`));
    
    //get room and users info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });
 
  
  //Listen for txtMsg
  socket.on('chatMessage', (txtMsg) => {
    const user = getCurrentUser(socket.id);
    
    io.to(user.room).emit('message', formatMessage(user.username, txtMsg));
  });
  
  //Disconnecting from chat
  socket.on('disconnect', () => {
    const user = leaveRoom(socket.id);
    
    if (user){
      io.to(user.room).emit('message', formatMessage(bot, `${user.username} has left the chat`));
      
      //get room and users info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  
  });
});


//server
const port = 3000;

server.listen(port, ()=> {
  console.log("Server started at: http://localhost:" + port);
});