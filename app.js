const express = require('express');
const bodyParser = require('body-parser');

const DEFAULT_PORT = 3000;

const app = express();

app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/me', (req, res) => {
  res.send({msg: 'ok'});
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});