require('dotenv').config()

const axios = require('axios')
const forge = require('node-forge')

const { API_SECRET, API_KEY, WALLET } = process.env
const API_BASE = 'https://api.coinbase.com'
const API_VERSION = '/v2/'
const PATH = {
  USER: 'user',
  WALLET: `accounts/${WALLET}`,
  RATES: 'exchange-rates?currency=BTC',
}

const createRequest = async (path, body) => {
  const method = body ? 'POST' : 'GET'
  const timestamp = Math.floor(new Date().getTime() / 1000)
  const url = `${API_BASE}${API_VERSION}${path}`
  const bodyString = body ? JSON.stringify(body) : ''
  const hmac = forge.hmac.create()
  const message = `${timestamp}${method}${API_VERSION}${path}${bodyString}`
  hmac.start('sha256', API_SECRET)
  hmac.update(message)
  const signature = `${hmac.digest().toHex()}`

  const headers = {
    'Content-Type': 'application/json',
    'CB-VERSION': '2019-11-15',
    'CB-ACCESS-KEY': API_KEY,
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': `${timestamp}`,
  }

  const config = {
    url,
    method,
    headers,
  }
  if (method === 'POST') {
    config.data = message
  }

  return axios(config).then(({ data }) => data?.data)
}

const getBalance = async () => {
  return createRequest(PATH.WALLET).then(({ balance }) => balance.amount)
}

const getRates = async () => {
  return createRequest(PATH.RATES).then(({ rates }) => rates.CZK)
}

const getNet = async () => {
  const balance = await getBalance()
  const rate = await getRates()
  const net = ~~(balance * rate)
  return {
    balance,
    rate,
    net,
  }
}

module.exports = getNet
