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
		return new Promise((resolve, reject)=>{
			protobuf.load(this.protoPath).then((root)=>{
				const messageDef = root.lookupType(`${this.appId}.${this.messageName}`);

				const req = {
		            "app": this.appId,
		            "encoding": 'base64',
		            "value": messageDef.encode(payload).finish().toString('base64')
		        };

				this.blockchain.TransactionEntry.create(req, (error, data)=>{
					if(error)
						reject(error);

					resolve(data.hash);
				});


			})
			.catch((error)=>{
				reject(error);
			});
		});
	}

	retrieveEntry(hash){
		return new Promise((resolve, reject)=>{
			if(!hash)
				reject({error: "No hash to retrieve"});

			protobuf.load(this.protoPath).then((root)=>{
				const messageDef = root.lookupType(`${this.appId}.${this.messageName}`);

				const req = { "hash": hash };
				this.blockchain.TransactionEntry.read("",req, (error, data)=>{
					if(error)
						reject(error);

					var message = messageDef.decode(new Buffer(data.value, 'hex'));
		            var object = messageDef.toObject(message, {
		                longs: String,
		                enums: String,
		                bytes: String
		            });

		            resolve(object);
				});
			})
			.catch((error)=>{
				reject(error);
			});

		})
	}

	getEntries(fromSlot, toSlot){
		return new Promise((resolve, reject)=>{
			blockchain.Block.list({from: fromSlot, to: toSlot}, (error, data)=>{
				if(error)
					reject(error);

				let entries = [];

				data.forEach((block)=>{
					if(block.partitions.length > 0){
						entries = [...entries, ...block.partitions[0].entries];
					}
				});

				resolve(entries);
			});
		});
	}

	getCurrentBlock(){
		return new Promise((resolve, reject)=>{
			blockchain.Status.query({}, (error, data)=>{
				if(error)
					reject(error);

				resolve(data.current);		
			})
		})
	}

	readBlock(slot){
		return new Promise((resolve, reject)=>{
			blockchain.Block.read(slot, {}, (error, data)=>{
				if(error)
					reject(error);

				resolve(data);
			});
		})
	}

}

module.exports = Blockchain;
