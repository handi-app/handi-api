const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./mongo/db/mongoose');
const bcrypt = require('bcryptjs');
const Blockchain = require('./blockchain');
const _ = require('lodash');

// // Models
const { Interaction } = require('./mongo/models/interaction');
const { LastHash } = require('./mongo/models/last-hash');

const config = require('./config');

const DEFAULT_PORT = 3000;

const app = express();
const blockchain = new Blockchain('message.proto','TM12','Gig', config);

app.set('port', process.env.PORT || DEFAULT_PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/interactions', (req, res) => {
  const body = _.pick(req.body, [
    'customer',
    'handyperson'
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

app.post('/finished', (req, res)=>{
	const update = _.pick(req.body, [
	    'customer',
	    'handyperson',
		'endTime'
	]);

	Interaction.findOneAndUpdate(
		{
	      'customer.username': update.customer.username
	    },
	    {
	      $set: {
	      	'endTime': update.endTime,
	      	'handyperson.rating': update.handyperson.rating,
	      	'customer.rating': Math.floor(Math.random() * 5)
	      }
	    },
	    {
	      new: true
	    }
	)
	.then((doc)=>{
		const entry = _.pick(doc, ["status", "customer", "handyperson", "startTime", "endTime"]);

		blockchain.createEntry(entry).then((hash)=>{
			blockchain.retrieveEntry(hash).then((entry)=>{
				console.log(entry);
			})
		});

		Interaction.findOneAndRemove({_id: doc._id}, (err, doc)=>{
			res.send(doc);
		});
	})
	.catch((err)=>{
		res.send(err);
	});
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});