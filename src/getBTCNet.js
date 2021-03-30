const GetNet = require('./GetNet')

const getBTCNet = async (wallet) => {
  const gn = new GetNet(wallet, 'BTC')
  return await gn.getNet()
}

module.exports = getBTCNet
