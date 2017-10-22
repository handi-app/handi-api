const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./mongo/db/mongoose');
const bcrypt = require('bcryptjs');
const Blockchain = require('./blockchain');
const _ = require('lodash');

// // Models
const { Interaction } = require('./mongo/models/interaction');

const config = require('./config');

const DEFAULT_PORT = 3000;

const app = express();
const blockchain = new Blockchain('message.proto','TM12','Gig', config);

app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/interactions', (req, res) => {
  const body = _.pick(req.body, [
    'customer'
  ]);

  const interaction = new Interaction(body);
  interaction.status = 0;

  interaction.save((err, doc) => {
    if (err)
      return res.send(err);

    res.send(doc);
  });
});

app.post('/arrived', (req, res)=>{
	const update = _.pick(req.body, [
	    'customer',
	    'handyperson',
		'startTime'
	]);

	Interaction.findOneAndUpdate(
		{
	      'customer.username': update.customer.username
	    },
	    {
	      $set: update
	    },
	    {
	      new: true
	    }
	)
	.then((doc)=>{
		res.send(doc);
	})
	.catch((err)=>{
		res.send(err);
	});
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});