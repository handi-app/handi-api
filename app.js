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

  console.log("POST /interactions", body);

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

	console.log("POST /arrived", update);

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
	const findAverage = (oldAverage, newAverage, numAverages) => {
		return ((oldAverage*numAverages) + newAverage) / (numAverages + 1);
	}

	const update = _.pick(req.body, [
	    'customer',
	    'handyperson',
		'endTime'
	]);

	console.log("POST /finished")

	Interaction.findOneAndUpdate(
		{
	      'customer.username': update.customer.username
	    },
	    {
	      $set: {
	      	'endTime': update.endTime,
	      	'handyperson.rating': update.handyperson.rating
	      }
	    },
	    {
	      new: true
	    }
	)
	.then((doc)=>{
		const interaction = _.pick(doc, ["status", "customer", "handyperson", "startTime", "endTime"]);

		LastHash.findOne({username: interaction.handyperson.username}).then((doc)=>{
			if(doc){
				blockchain.retrieveEntry(doc.lastHash).then((entry)=>{
					const newInteraction = {
						...interaction,
						handyperson: {
							username: interaction.handyperson.username,
							rating: findAverage(entry.handyperson.rating, interaction.handyperson.rating, entry.handyperson.numRatings),
							numRatings: entry.handyperson.numRatings+1
						}
					}

					blockchain.createEntry(newInteraction).then((hash)=>{
						
						LastHash.findOneAndUpdate(
							{'username': newInteraction.handyperson.username},
							{ $set: {
									lastHash: hash
								}
							},
							{new: true}
						).then((doc)=>{
							Interaction.findOneAndRemove({'customer.username': newInteraction.customer.username}).then(()=>{
								res.send(newInteraction);
								blockchain.retrieveEntry(doc.lastHash).then((result)=>{
									console.log(result);
								});
							});
						})
					})
				})
			}

			else {
				interaction.handyperson.numRatings = 1;
				blockchain.createEntry(interaction).then((hash)=>{
					const lastHash = new LastHash({username: interaction.handyperson.username, lastHash: hash});
					lastHash.save();
					Interaction.findOneAndRemove({'customer.username': interaction.customer.username}).then(()=>{
						res.send(interaction);
					});
					blockchain.retrieveEntry(hash).then((result)=>{
						console.log(result);
					});
				})
			}
		})
	})
	.catch((err)=>{
		res.send(err);
	});
});

app.listen(app.get('port'), () => {
  console.log(`Listening on port: ${app.get('port')}`);
});