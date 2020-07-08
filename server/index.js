const { usersOnly } = require('./middleware/authMiddleware');

require('dotenv').config();

const express = require('express'),
       session = require('express-session'),
       massive = require('massive'),
       {SESSION_SECRET, CONNECTION_STRING} = process.env,
       PORT = 4000,
       app = express(),
       ctrl = require('./controllers/authController'),
       treasureCtrl = require('./controllers/treasureController'),
       auth = require('./middleware/authMiddleware');
       
app.use(express.json());


massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then(db => {
  app.set('db', db);
  console.log('db connected');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

app.post('/auth/register', ctrl.register);
app.post('/auth/login', ctrl.login);
app.get('/auth/logout', ctrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));