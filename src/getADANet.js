const GetNet = require('./GetNet')

const getADANet = async (wallet) => {
  const gn = new GetNet(wallet, 'ADA')
  return await gn.getNet()
}

module.exports = getADANet
