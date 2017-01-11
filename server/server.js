// Создание сервера
var express = require('express'),
    path = require('path'),
    app = express(),
    formidable = require('formidable'),
    request = require('request'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    dataPresent = require(__dirname + '/../public/data/presentation.json'),
    port = 4000;

// сокеты
var io = require('socket.io').listen(app.listen(port));

app.set('view engine', 'jade');

// Статика
app.use(express.static(__dirname + '/../public/'));

// bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Логер
app.use(function (req, res, next) {
    console.log('%s', req.method, req.url);
    next();
});

// TEST
app.get('/test', function (req, res) {
    res.send(dataPresent);
});

app.get('/', function (req, res) {
    res.render('index', {admin: false});
});

// админка
app.get('/admin', function (req, res) {
    res.render('index', {admin: true});
});

app.post('/upload', function (req, res, next) {
    var form = new formidable.IncomingForm();

    form.multiples = true;

    form.uploadDir = path.join(__dirname, '/public/assets/img');

    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    form.on('error', function(err) {
        console.log('Ошибка: \n' + err);
    });

    form.on('end', function() {
        res.redirect('/admin');
    });

    form.parse(req);
});

// Открываем сокет
var present = io.on('connection', function (socket) {

    // Переключение слайдов
    socket.on('change-slide', function (data) {
        present.emit('nav', {hash: data.hash});
    });

    // socket.emit('upImages', { image: true, buffer: buf.toString('base64') });

});

console.log('Презентация запущена на порту: ' + port);