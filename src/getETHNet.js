const GetNet = require('./GetNet')

const getETHNet = async (wallet) => {
  const gn = new GetNet(wallet, 'ETH')
  return await gn.getNet()
}

module.exports = getETHNet
