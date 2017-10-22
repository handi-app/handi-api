const Blockchain = require('./blockchain');
const config = require('./config');
const blockchain = new Blockchain('message.proto','TM12','Gig', config);

const entry = {
	status: 0,
	customer: {
		username: 'janesmith',
		rating: 3
	},
	handyperson: {
		username: 'maxmclau',
		rating: 2.5
	},
	startTime: 23522352,
	endTime: 23562574
}

//blockchain.createEntry(entry);

blockchain.getCurrentBlock().then((currentBlock)=>{
	blockchain.getEntries(currentBlock.slot-500, currentBlock.slot).then((entries)=>{
		for(let hash in entries){
			blockchain.retrieveEntry(hash).then((entry)=>{
				if(entry.handyperson.username === 'maxmclau'){
					console.log(entry.handyperson.rating);
					break;
				}
			});
		}
	})
})
.catch((error)=>{
	console.log(error);
});