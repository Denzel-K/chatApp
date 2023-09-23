
//Socket.io
const socket = io();

//Get username & room from URL 
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

//join chatRoom
socket.emit('joinRoom', {username, room});

//get room and users info
socket.on('roomUsers', ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
})

//Render messages
const chatForm = document.querySelector('#chat_form');

socket.on('message', message => {
  console.log(message);
  outputMsg(message);
  
  //autoScroll
  const chatField = document.querySelector('.chats');
  chatField.scrollTop = chatField.scrollHeight;
  });

//Submit text message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const txtMsg = e.target.elements.text.value;
  
  
  // txtMsg = txtMsg.trim();

  // if (!txtMsg) {
  //   return false;
  // }
  socket.emit('chatMessage', txtMsg);

  //clear input
  e.target.elements.text.value = '';
  e.target.elements.text.focus();
});

//output messages function
function outputMsg(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  
  div.innerHTML = `
    <p class="meta">
      <span class="username">${message.username}</span>
      <span class="time">${message.time}</span>
    </p>
    <p class="textMessage">
      ${message.text}
    </p>
  `;
  
  document.querySelector('.chats').appendChild(div);

}

//render room name 
function outputRoom(room) {
  document.querySelector('.roomName').innerText = room;
}

//render room users
function outputUsers(users) {
  document.querySelector('.roomUsers').innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}