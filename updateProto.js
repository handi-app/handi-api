const fs = require('fs');
const protobuf = require('protobufjs');

const blockchain = require('mastercard-blockchain');
const MasterCardAPI = blockchain.MasterCardAPI;

const { consumerKey, keyStorePath, keyAlias, keyPassword} = require('./config.json');
const DEFAULT_PORT = 3000;

var authentication = new MasterCardAPI.OAuth(consumerKey, keyStorePath, keyAlias, keyPassword);
MasterCardAPI.init({
	sandbox: true,
	debug: true,
	authentication: authentication
});

var requestData = {
  "id": "TM12",
  "name": "TM12",
  "description": "",
  "version": 0,
  "definition": {
    "format": "proto3",
    "encoding": "base64",
    "messages": fs.readFileSync("message.proto").toString("base64")
  }
};
blockchain.App.update(requestData
, function (error, data) {
	if (error) {
		console.error("HttpStatus: "+error.getHttpStatus());
		console.error("Message: "+error.getMessage());
		console.error("ReasonCode: "+error.getReasonCode());
		console.error("Source: "+error.getSource());
		console.error(error);

	}
	else {
	}
});