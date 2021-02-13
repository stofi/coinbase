#!/usr/bin/env node

const express = require('express')
const getNet = require('./getNet')

const app = express()
const CACHE_TIME = 1000 * 20 // 20s

let cache, timestamp

const getTimestamp = () => new Date() / 1

app.get('/', async function (req, res) {
  if (cache && timestamp && timestamp + CACHE_TIME > getTimestamp()) {
    console.log('sending cached')
    res.send(cache)
  } else {
    console.log('sending live')
    const net = await getNet()
    cache = net
    timestamp = getTimestamp()
    res.send(net)
  }
})

app.listen(8080)
