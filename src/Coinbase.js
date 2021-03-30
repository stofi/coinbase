require('dotenv').config()

const axios = require('axios')
const forge = require('node-forge')

const { API_SECRET, API_KEY } = process.env
const API_BASE = 'https://api.coinbase.com'
const API_VERSION = '/v2/'

class Coinbase {
  constructor() {
    this.api_secret = API_SECRET
    this.api_key = API_KEY
    this.api_base = API_BASE
    this.version = API_VERSION
  }
  async createRequest(path, body) {
    const method = body ? 'POST' : 'GET'
    const timestamp = Math.floor(new Date().getTime() / 1000)
    const url = `${this.api_base}${this.version}${path}`
    const bodyString = body ? JSON.stringify(body) : ''
    const hmac = forge.hmac.create()
    const message = `${timestamp}${method}${this.version}${path}${bodyString}`
    hmac.start('sha256', this.api_secret)
    hmac.update(message)
    const signature = `${hmac.digest().toHex()}`

    const headers = {
      'Content-Type': 'application/json',
      'CB-VERSION': '2019-11-15',
      'CB-ACCESS-KEY': this.api_key,
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

    return axios(config)
      .then(({ data }) => data?.data)
      .catch((e) => {
        console.error(`Error in request`)
      })
  }
}

module.exports = Coinbase
