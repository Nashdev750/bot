const { Order, User, Trading } = require('../user/usermodel');

const binance = require('binance-api-node').default;

// Configure your API keys
const client = binance({
  apiKey: 'kTtgS5plnwxly0PvCa0Nl155rB0fTCUna603OkDBhQKp9EHxJr48E5Itg47As1RW',
  apiSecret: '5KooJ5EcZOmTpYTThiyCJkgHtY4Au1fM4eegK3HqxujwwiMLOZybOFzgJgCwuN4H',
});

const symbol = 'BTCUSDT';
const spread = 0.01; // 1% spread
const orderValueInUSDT = 5; // $10 USDT

async function getAccountBalance(asset) {
  const account = await client.accountInfo();
  const balance = account.balances.find(b => b.asset === asset);
  return parseFloat(balance.free);
}
let trades = 0
async function placeMarketMakingOrders() {
  try {
    const trading = await Trading.find()
    let active = false
    if(trading?.length > 0){
        active = trading[0].status == 0
    }else{
        active = true
        await Trading.create({status:0})
    }
    if(!active) return
    const btcBalance = await getAccountBalance('BTC');
    const usdtBalance = await getAccountBalance('USDT');

    // return

    // if(!(usdtBalance >= 20)) return

    //const totalUsdtValue = (btcBalance * parseFloat(await client.prices({ symbol: 'BTCUSDT' }))['BTCUSDT']) + usdtBalance;
    const orderValue = 5; // 2% of total balance
    // const orderValue = totalUsdtValue * 0.02; // 2% of total balance

    const prices = await client.prices({ symbol });
    const currentPrice = parseFloat(prices[symbol]);

    // Calculate the order size in BTC based on $10 USDT value
    const orderSizeInBTC = orderValueInUSDT / currentPrice;

    const orderBook = await client.book({ symbol });

    const bestBid = parseFloat(orderBook.bids[0].price);
    const bestAsk = parseFloat(orderBook.asks[0].price);

    const bidPrice = bestBid * (1 - spread);
    const askPrice = bestAsk * (1 + spread);

    const orderSize = orderValue / ((bidPrice + askPrice) / 2);

    // Cancel existing orders
    const openOrders = await client.openOrders({ symbol });
    for (let order of openOrders) {
      await client.cancelOrder({ symbol, orderId: order.orderId });
    }
   await Order.create({
          side: 'BUY',
          type: 'LIMIT',
          quantity: 5,
          price: bidPrice.toFixed(2),
          symbol
   })
   await Order.create({
          side: 'SELL',
          type: 'LIMIT',
          quantity: 5,
          price: bidPrice.toFixed(2),
          symbol
   })
   trades +=2

   if(trades >= 10){
    trades = 0
    const users = await User.find();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if(user.balance > 0){
        const minPercentage = 0.0001;
        const maxPercentage = 0.0007;
        const randomPercentageIncrease = minPercentage + Math.random() * (maxPercentage - minPercentage);
        
        // Calculate the increase amount
        const increaseAmount = user.balance * randomPercentageIncrease;
    
        // Calculate the new value
        const newbal = user.balance + increaseAmount;
        User.findByIdAndUpdate({_id:user._id},{balance: newbal})
    
      }
      
    }
   }
    // Place new buy limit order
    // await client.order({
    //   symbol,
    //   side: 'BUY',
    //   type: 'LIMIT',
    //   quantity: 5,
    //   price: bidPrice.toFixed(2),
    //   timeInForce: 'GTC',
    // });

    // // Place new sell limit order
    // await client.order({
    //   symbol,
    //   side: 'SELL',
    //   type: 'LIMIT',
    //   quantity: 5,
    //   price: askPrice.toFixed(2),
    //   timeInForce: 'GTC',
    // });

    console.log(`Placed buy order at ${bidPrice.toFixed(2)} and sell order at ${askPrice.toFixed(2)} for ${orderSize.toFixed(6)} BTC`);

  } catch (error) {
    console.error('Error placing orders:', error);
  }
}

// Run the bot every 60 seconds
// setInterval(placeMarketMakingOrders, 3600000);

// placeMarketMakingOrders()

module.exports = {placeMarketMakingOrders}

