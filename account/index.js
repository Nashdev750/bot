const { TOPUP, WITHDRAW, ACCOUNT, CHECKBAL, STARTTRADE, STOPTRADE, STAT } = require("../commands");
const { updateBalance } = require("../user");
const { User, Order } = require("../user/usermodel");

const getAccoutMenu = async (bot,msg)=>{
    const user = await User.findOne({userid: msg.chat.id})
    const date = new Date(user?.createdAt);

    // Extract the year, month, and day
    const year = date?.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    
    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;


    const chatId = msg.chat.id;
    const options = {
        
        reply_markup: {
          inline_keyboard: [
            [{
              text: '💲 Top up your balance 💲',
              callback_data: TOPUP
            }],
            [{
              text: '💸 Withdrawal of funds 💸',
              callback_data: WITHDRAW
            }],
            [{
              text: 'CHECK PAYMENT',
              callback_data: CHECKBAL
            }],
          ]
        }
      };
    const message = `💵 Current balance: ${user?.balance?.toFixed(2)} USDT

📅 Date of registration: ${formattedDate}
    
💸 Total withdrawal: ${user?.balance?.toFixed(2)} USDT
    
Language: English`
    bot.sendMessage(chatId, message, options);
}

const getWithrawal = async (bot, msg)=>{
    const chatId = msg.chat.id;
    const user = await User.findOne({userid: msg.chat.id})
    const message = `💸 Withdrawal of funds 💸
    
Please send command, WITHDRAW:ADDRESS:AMOUNT
example; WITHDRAW:XrtyuiGfydycfctyd:20
    
➖➖➖➖➖
💰 Current balance: *${user.balance.toFixed(2)}* USDT
💸 Available for withdrawal: *${user.balance.toFixed(2)}* USDT`
    const options = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Go Back',
            callback_data: ACCOUNT
          }],
        ]
      }
    };
  bot.sendMessage(chatId, message, options);

}
const topUp = async (bot, msg)=>{
    const user = await User.findOne({userid: msg.chat.id})
    const walletAddress = user?.address;
    const chatId = msg.chat.id;
    const message = `💲 Top up your balance 💲

❗️ In order to top up your balance, you need to transfer USDT to a wallet below (the commission for replenishment is 10%). 
The transfer is realized automatically.
    
❗️ The minimum amount for replenishment is 20 USDT
    
➖➖➖➖➖
*Wallet address USDT TRC-20:*
\`${walletAddress}\`
(To copy, click on the wallet👆)`
    const options = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{
              text: 'CHECK PAYMENT',
              callback_data: CHECKBAL
            }],
            [{
              text: 'Go Back',
              callback_data: ACCOUNT
            }],
          ]
        }
      };
    bot.sendMessage(chatId, message, options);
}


const checkBalance = async(bot, msg)=>{
  const user = await User.findOne({userid: msg.chat.id})
  updateBalance(user?.address,user?._id)
  const chatId = msg.chat.id;
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'REFRESH',
          callback_data: CHECKBAL
        }]
      ]
    }
  };
  const message = `💵 Current balance: *${user?.balance?.toFixed(2)}* USDT
If your deposit has not been accepted, please check in 5 minutes`

  bot.sendMessage(chatId, message, options);
}
const startTrade = async(bot, msg,state,up=true)=>{
  const user = await User.findOne({userid: msg.chat.id})
  if(up) await User.findOneAndUpdate({userid: msg.chat.id},{trading:state})
  updateBalance(user?.address,user?._id)
  const chatId = msg.chat.id;
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{
          text: state==0 ? "Stop Trading" :'Start Trading',
          callback_data: state==0 ? STOPTRADE: STARTTRADE
        }],
        [{
          text: 'Trading History',
          callback_data: STAT
        }]
      ]
    }
  };
  const message = `💵 Current balance: *${user?.balance?.toFixed(2)}* USDT. 
  Trading status: *${state==0 ? "Active" :'Stopped'}*`

  bot.sendMessage(chatId, message, options);
}
const botStat = async(bot, msg)=>{
  const orders = await Order.find()
  
  let message = ''
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    message +=`#${i+1}. Symbol: ${order.symbol},Price: ${order.price},Side:${order.side}
    
    `
    
  }
  if(message=='') message = "No trades taken yet"
  bot.sendMessage(msg.chat.id, message);
}

module.exports = {getAccoutMenu, getWithrawal, topUp, checkBalance, startTrade,botStat}