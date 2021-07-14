const Coinbase = require('./Coinbase')

class GetWallets {
  constructor(symbols) {
    this.cbApi = new Coinbase()
    this.symbols = symbols
    this.accountsPath = `accounts?limit=100`
  }
  async getWallets() {
    return this.cbApi.createRequest(this.accountsPath)
    // .then(
    //   (wallets) =>
    //     wallets.filter((w) =>
    //       JSON.stringify(w).match(/eth/ig)
    //     )
    //)
      // wallets.filter(({ balance: { amount } }) => Number(amount) > 0)
  }
}

module.exports = GetWallets
