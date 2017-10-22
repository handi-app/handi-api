const express = require('express');
const bodyParser = require('body-parser');

const Blockchain = require('./blockchain');

const config = require('./config');

const DEFAULT_PORT = 3000;

const blockchain = new Blockchain('message.proto','TM12','Gig', config);