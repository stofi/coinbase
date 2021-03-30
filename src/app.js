#!/usr/bin/env node

require('dotenv').config()
const express = require('express')
const getBTCNet = require('./getBTCNet')
const getETHNet = require('./getETHNet')

const app = express()
const CACHE_TIME = 1000 * 20 // 20s

const { BTC_WALLET, ETH_WALLET } = process.env

let cache, timestamp

const getTimestamp = () => new Date() / 1

app.get('/', async function (req, res) {
  if (cache && timestamp && timestamp + CACHE_TIME > getTimestamp()) {
    console.log('sending cached')
    res.send(cache)
  } else {
    console.log('sending live')
    const net = {
      net: 0,
    }
    await getBTCNet(BTC_WALLET)
      .then((btc) => {
        net.net += btc.net
        net.btc = btc
      })
      .catch((e) => {
        console.error('Error getting BTC net')
      })
    await getETHNet(ETH_WALLET)
      .then((eth) => {
        net.net += eth.net
        net.eth = eth
      })
      .catch((e) => {
        console.error('Error getting ETH net')
      })

    cache = net
    timestamp = getTimestamp()
    res.send(net)
  }
})

app.listen(8080, () => console.log('Server running at 8080'))
