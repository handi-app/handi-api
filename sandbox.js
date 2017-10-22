const Blockchain = require('./blockchain');
const config = require('./config');
const blockchain = new Blockchain('message.proto','TM12','Gig', config);

// const entry = {
// 	status: 0,
// 	customer: {
// 		username: 'janesmith'
// 	},
// 	handyperson: {
// 		username: 'maxmclau',
// 		rate: 40,
// 		rating: 2.5
// 	},
// 	startTime: 23522352,
// 	endTime: 23562574
// }

blockchain.retrieveEntry('a447aff4eca4a2240c12fefb06ff6183d105e7fa5ab428823ff96a9ac6422154').then((entry)=>{
	console.log(entry);
})

// blockchain.getCurrentBlock().then((currentBlock)=>{
// 	blockchain.getEntries(currentBlock.slot-500, currentBlock.slot).then((entries)=>{
// 		for(let hash in entries){
// 			blockchain.retrieveEntry(hash).then((entry)=>{
// 				if(entry.handyperson.username === 'maxmclau'){
// 					console.log(entry.handyperson.rating);
// 					break;
// 				}
// 			});
// 		}
// 	})
// })
// .catch((error)=>{
// 	console.log(error);
// });