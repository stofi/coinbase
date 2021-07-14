#!/usr/bin/env node

require('dotenv').config()

const GetWallets = require('./GetWallets')

const gw = new GetWallets()
gw.getWallets().then(console.log)