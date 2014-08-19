var express = require('express');
var jwt = require('jwt-simple');
var secret = process.env.SCALEDRONE_SECRET || 'fnrdXD2hu1NdzGFN1c1i8KfrcZbwxdR7';
var channel = process.env.SCALEDRONE_CHANNEL || 'm7LXeWUig7QmXMqW';
var app = express();

function hasChannelAccess(req) {
    return true;
}

app.get('/jwt', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*'); // for developing
    if (hasChannelAccess(req)) {
        console.log(req.query);
        var clientId = req.query.clientId,
            payload = {
                client: clientId, // the client that wants to connect
                channel: channel, // channel that the client want's to connect to
                permissions: [
                    '.*': {
                        publish: true,
                        subscribe: true
                    },
                    'main': {
                        publish: false,
                        subscribe: true
                    },
                    'a*': {
                        publish: false,
                        subscribe: true
                    }
                ],
                exp: Date.now() + 180000 // client can use this token for 3 minutes (UTC0)
            },
            token = jwt.encode(payload, secret, 'HS256');
        res.send(token);
    } else {
        res.send(403, 'Sorry! You are not allowed.');
    }
});

app.listen(1234);
