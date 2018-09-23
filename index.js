const express = require('express');
const jwt = require('jsonwebtoken');
const log = require('tracer').colorConsole();
const {CHANNEL_ID, CHANNEL_SECRET} = process.env;
const PORT = process.env.PORT || 1234;

if (!CHANNEL_ID) {
  log.error('Please provide a CHANNEL_ID environmental variable');
  process.exit();
}
if (!CHANNEL_SECRET) {
  log.error('Please provide a CHANNEL_SECRET environmental variable');
  process.exit();
}

const app = express();
app.set('view engine', 'ejs'); // EJS is used to inject channelID into the html file
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index', {CHANNEL_ID});
});

app.get('/auth/:clientId', function(req, res) {
  if (hasChannelAccess(req)) {
    const payload = {
      client: req.params.clientId,
      channel: CHANNEL_ID,
      permissions: {
        '^myroom$': {
          publish: true,
          subscribe: true,
        },
      },
      exp: Math.floor(Date.now() / 1000) + 60 * 3 // client has to use this token within 3 minutes
    };
    const token = jwt.sign(payload, CHANNEL_SECRET, {algorithm: 'HS256'});
    res.status(200).end(token);
  } else {
    res.status(403).end('Sorry! You are not allowed.');
  }
});

function hasChannelAccess(req) {
  // Your should implement your own authentication code here.
  // You could query your user from your database and see if they are allowed to
  // connect or give them user-scoped access using JWT permissions
  return true;
}

app.listen(PORT);
log.info(`Server is running on port ${PORT}. Visit http://localhost:${PORT}`);
