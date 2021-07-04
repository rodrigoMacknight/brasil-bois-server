var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080, function() {
        console.log("server is now running");
});

//configure sockets for two players
io.on('connection', function(socket) {
    console.log("player connected");
    //recebeu um evento de carta colocada do player, manda para outro player o evento de carta
    //colocada
	socket.emit('socketId', {id: socket.id});


    socket.broadcast.emit('newPlayer', {id: socket.id});


    //coloca a carta do player no board do inimigo
    socket.on('placeCard', function(resp){
        console.log(resp);
        socket.broadcast.emit('enemyCardPlaced', resp);
        
    });

    socket.on('endTurn', function(resp) {
        console.log("endTurn: " + resp);
        socket.broadcast.emit('endEnemyTurn')
    });

    socket.on('useMagicCard', function(resp) {
        console.log("useMagicCard: " + resp);
        socket.broadcast.emit('magicCardUsed', resp)
    });

    socket.on('playerFound', function(resp) {
        console.log("playerFound: ");
        socket.broadcast.emit('playerFound');
    });

    socket.on('attackCreature', function(resp){
        console.log(resp);
        socket.broadcast.emit('enemyAttackedCreature', resp);
        
    });
    

    socket.on('attackHp', function(resp){
        console.log(resp);
        socket.broadcast.emit('enemyAttackedHp', resp);
        
    });

    socket.on('disconnect', function() {
        console.log("player disconected");
    })

});