// Создание сервера
var express = require('express'),
    path = require('path'),
    app = express(),
    port = 4000;

// сокеты
var io = require('socket.io').listen(app.listen(port));

app.set('view engine', 'jade');

// Статика
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index', {admin: false});
});

// админка
app.get('/admin', function (req, res) {
    res.render('index', {admin: true});
});

// Открываем сокет
var present = io.on('connection', function (socket) {

    // Переключение слайдов
    socket.on('change-slide', function (data) {
        present.emit('nav', {hash: data.hash});
    });
});

console.log('Презентация запущена на порту: ' + port);