const Coinbase = require('./Coinbase')

class GetNet {
  constructor(wallet, currency) {
    this.cbApi = new Coinbase()
    this.currency = currency
    this.walletPath = `accounts/${wallet}`
    this.ratesPath = `exchange-rates?currency=${this.currency}`
  }
  async getBalance() {
    return this.cbApi
      .createRequest(this.walletPath)
      .then(({ balance }) => balance.amount)
  }
  async getRates() {
    return this.cbApi
      .createRequest(this.ratesPath)
      .then(({ rates }) => rates.CZK)
  }
  async getNet() {
    const balance = await this.getBalance().catch((e) => {
      console.error(`Error getting balance of ${this.currency}`)
      })
    const rate = await this.getRates().catch((e) => {
      console.error(`Error getting rates of ${this.currency}`)
    })
    const net = ~~(balance * rate)
    return {
      balance,
      rate,
      net,
    }
  }
}

module.exports = GetNet
