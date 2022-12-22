var app  = require('express')();
var server = require('http').Server(app);

var io = require('socket.io')(server);

server.listen(8080,"0.0.0.0", function() {
    console.log("Server is now running")
}); 

var player1 = null
var player2 = null

io.on('connection', socket => {
    console.log("player connected!");
    setPlayer(socket)

    console.log("socketId" +  socket.id)
    addListenersOn(socket)

 
    socket.on('disconnect', function() {
        console.log("player disconected");
    })

});


function setPlayer (socket) {
    if (player1 == null) {
     player1 = {
        socketId: socket.id,
       // pSocket: socket,
        name: "player1"
  
    }
    socket.emit('playername', player1)
    } else {
        player2 = {
            socketId: socket.id,
           // pSocket: socket,
            name: "player2"
         }
         var player1Start = Math.random() < 0.5;
         var gameStarts = {
            initPlayer: player1Start ? player1.socketId : player2.socketId,
         };
         socket.emit('playername', player2)
         io.emit("gameStarted", gameStarts)
    }
}


function addListenersOn(socket) {

    socket.on('endTurn', function() {
        console.log(socket.id + "endedTurn")
        socket.broadcast.emit('endEnemyTurn')
    })

    socket.on('placeCard', function(resp){
        console.log("player " + socket.id + "placed:" + resp);
        socket.broadcast.emit('enemyCardPlaced', resp);
    
    });
}