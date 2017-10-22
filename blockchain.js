const protobuf = require('protobufjs');
const blockchain = require('mastercard-blockchain');

class Blockchain {
	constructor(protoPath, appId, messageName, config){
		const { consumerKey, keyStorePath, keyAlias, keyPassword} = config;

		const MasterCardAPI = blockchain.MasterCardAPI;
		const authentication = new MasterCardAPI.OAuth(consumerKey, keyStorePath, keyAlias, keyPassword);

		MasterCardAPI.init({
			sandbox: true,
			debug: true,
			authentication: authentication
		});

		this.protoPath = protoPath;
		this.appId = appId;
		this.messageName = messageName;
		this.blockchain = blockchain;
	}

	createEntry(payload){
		protobuf.load(this.protoPath).then((root)=>{
			const messageDef = root.lookupType(`${this.appId}.${this.messageName}`);

			const req = {
	            "app": this.appId,
	            "encoding": 'base64',
	            "value": messageDef.encode(payload).finish().toString('base64')
	        };

			this.blockchain.TransactionEntry.create(req, (err, data)=>{});


		})
		.catch((err)=>{
			console.log(err);
		});
	}

	retrieveEntry(hash){
		const req = { "hash": hash };

		this.blockchain.TransactionEntry.read("",req, ()=>{});
	}

}

module.exports = Blockchain;
