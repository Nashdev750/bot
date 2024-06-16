const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { getAccoutMenu, getWithrawal, topUp, checkBalance, startTrade, botStat } = require('./account');
const { ACCOUNT, WITHDRAW, TOPUP, CHECKBAL, TRADE, STOPTRADE, STARTTRADE, STAT } = require('./commands');
const { createUser, withdraw } = require('./user');
const { placeMarketMakingOrders } = require('./trading');
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
  
//     // send a message to the chat acknowledging receipt of their message
//     const options = {
//       reply_markup: {
//           inline_keyboard: [
//               [{
//                 text: 'Start Shopping 🛍️',
//                 web_app: { url: 'https://ac986765.store' }  // Replace this with your Mini App URL
//             }]
//           ]
//       }
//   };
//     bot.sendMessage(chatId, 'Click the button below to start shopping 😊',options);
//   });

  // Define the reply keyboard markup
  const keyboard = {
    reply_markup: {
      keyboard: [
        [{ text: '💰 Trading' }, { text: '👤 My Account' }, { text: 'ℹ️ FAQ' }],
      [{ text: '📰 Channel' }, { text: '💬 Chat' }],
      [{ text: '🆘 Support' }]
      ],
      resize_keyboard: true, // Optionally resize the keyboard
      one_time_keyboard: false // Optionally hide the keyboard after a button is pressed
    }
  };
  bot.onText(/\/start/, (msg) => {
   const chatId = msg.chat.id;
   const message = `Great ! All is ready for start.
            
   Before using our service, we strongly recommend you to carefully review the functionality of each trading bot button.
   
   Menu:
   
   "Trading" - here you can see the results of the bot's trading for different periods of time.
   You can also pause or resume the trading bot;
   "Stop trading/Start trading" - starting and stopping the trading bot;
   "Trading Bot statistics" - bot trading statistics for the period: 24 hours, 3 days, 7 days , 1 month, 3 months;
   "Trading Bot Channel" - up-to-date information on bot trading.
   
   "My account" - up-to-date information on the balance and account. Deposit/withdrawal of funds, referral system;
   "Top up your balance" - the ability to replenish the USDT TRC20 wallet to get started (10% commission);
   "Withdrawal of funds" - the ability to withdraw USDT TRC20 to your wallet (10% commission);
   "Balance history" - deposits and withdrawals on your trading account;
   "Referral system" - the reward is 5% from each deposit of the listed users.
   
   "FAQ" - answers to frequently asked questions.
   
   "Channel" - up-to-date information on bot trading and crypto market news.
   
   "Chat" - communication of community members, here you can communicate with other users of our service.
   
   "Support" - online help for any questions (average response time is 2 hours, only in English).
   
   To change the language or restart the bot, press /start.`
   // Send a message with the reply keyboard
   createUser(chatId)
   bot.sendMessage(chatId, message, keyboard);
  });
  // Listen for any kind of message. There are different kinds of messages.
  bot.on('message', (msg) => {
    OnMessage(msg)
  });



// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const data = callbackQuery.data;
    message.text = data
    
    // Delete the original message
    OnMessage(message)
    bot.deleteMessage(chatId, messageId)
    .then(() => {
        // OnMessage(message)
    })
    .catch((err) => {
        console.error('Failed to delete message:', err);
    });

  });




  const OnMessage = async (msg)=>{
    const text = msg.text;
    const wd = text.split(':')
    if(wd.length == 3){
      if(wd[0]=='WITHDRAW'){
        const res = await withdraw(msg.chat.id,wd[1],Number(wd[2]))
        bot.sendMessage(msg.chat.id, res,keyboard);
        return
      }
    }
    
    switch(text){
        case ACCOUNT:
           getAccoutMenu(bot,msg) 
           break;
        case WITHDRAW:
            getWithrawal(bot, msg)   
            break;
        case TOPUP:
            topUp(bot, msg)
            break;
        case CHECKBAL:
            checkBalance(bot, msg)
            break;
        case TRADE:
          startTrade(bot, msg, false)
          break;
        case STOPTRADE:
          startTrade(bot, msg, 1)
          break;
        case STARTTRADE:
          startTrade(bot, msg, 0)
          break;
        case STAT:
          botStat(bot, msg)
          break;
        default:
          bot.sendMessage(msg.chat.id, "Please select valid option", keyboard);  
          break;
    }
  }

  mongoose.connect(`mongodb://127.0.0.1:27017/trader`);

  setInterval(placeMarketMakingOrders, 3600000);