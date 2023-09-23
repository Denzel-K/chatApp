const users = [];

//Join room
function userJoin(id, username, room) {
  const user = {id, username, room};
  users.push(user);
  return user;
}

//Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

//Leave room 
function leaveRoom(id) {
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1){
    return users.splice(index, 1)[0];
  }
}

//get room users
function getRoomUsers(room){
  return users.filter(user => user.room === room);
}


module.exports = {userJoin, getCurrentUser, getRoomUsers, leaveRoom};