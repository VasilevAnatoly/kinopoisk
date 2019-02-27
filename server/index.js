var express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var fs = require('fs');
var log = require('./libs/log')(module);
var cookieParser = require('cookie-parser');
var paths = require('./paths.js')
var initExpress = require('./init/express.js');
var initRoutes = require('./routes');
var initSocket = require('../socket');

const port = process.env.PORT || 3000;

function createFolder(path) {
    if (!fs.existsSync(path))
        fs.mkdirSync(path);
}

createFolder(paths.moviePreviewsPath);

initExpress(app);
initRoutes(app);
initSocket(io);

app.use(cookieParser('kinopoisk'));
app.use(express.static(paths.publicPath));
app.use('/static', express.static('public/static'));

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug(req.method + '\n' + res.statusCode + '\n' + req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error(req.method + '\n' + res.statusCode + '\n' + err.message);
    res.json({
        error: err.message
    });
    return;
});

try {
    server.listen(port, function () {
        log.info('Server is up and running on port: ' + port);
    });
} catch (e) {
    log.error('Server \n Не удалось запустить на порту: ' + port +
        ' - он либо используется, либо у вас нет разрешения');
}