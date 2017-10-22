const express = require('express');
const bodyParser = require('body-parser');

const Blockchain = require('./blockchain');

const config = require('./config');

const DEFAULT_PORT = 3000;

const blockchain = new Blockchain('message.proto','TM12','Gig', config);

blockchain.retrieveEntry("5f147a38f83f9dc276980011e46b076a9a2c8f5e27c53ec2d7078847c69a5d36");