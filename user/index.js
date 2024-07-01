const { ethers } = require('ethers');

const { User, Balance, Withdraw } = require('./usermodel');
const { getBalance } = require('./helpers');

const getUser = async (userid)=>{
    return await User.findOne({userid})
}

const createUser = async (userid)=>{
        const user = await User.findOne({userid})
        if(user) return
        const wallet = ethers.Wallet.createRandom();
        privatekey = wallet.privateKey
        publickey = wallet.publicKey
        address = wallet.address

        const balance = 0

        User.create({userid,balance,address,privatekey,publickey})
}


const updateBalance = async (address,id)=>{
    const balance = await getBalance(address)
    if(!parseFloat(balance)>0) return
    const currentbalance = (await Balance.findOne({userid: id}).lean())?.amount
    if(!currentbalance){
       const ch = await Balance.create({userid:id,amount: parseFloat(balance)})
       if(ch){
        const userbal = (await User.findOne({_id:id}).lean()).balance
        await User.findByIdAndUpdate({_id:id},{balance: parseFloat(balance)+userbal})
        await Withdraw.create({userid:id,address,amount:balance,state:2,fund:true})
       }
    }else{
      if(parseFloat(balance) > currentbalance){
        const diff = parseFloat(balance) - currentbalance
        const k = await Balance.findOneAndUpdate({userid:id},{amount:balance})
        if(k){
            const userbal = (await User.findOne({_id:id}).lean()).balance
            await User.findByIdAndUpdate({_id:id},{balance: diff+userbal})
            await Withdraw.create({userid:id,address,amount:diff,state:2,fund:true})
        }
      } 
    }
}

const withdraw = async (userid, address, amount)=>{
  try {
    const currentbalance = (await User.findOne({userid: userid}).lean())?.balance
    if(amount > currentbalance) return `Your current balance is ${currentbalance.toFixed(2)}`
    if(amount < 5) return "Minimum withdrawal is 5 USDT"
    await User.findOneAndUpdate({userid},{balance: currentbalance - amount})
    await Withdraw.create({userid,address,amount,state:2,fund:false})
    return `You request to withdraw ${amount.toFixed(2)} USDT is being processed.`
  } catch (error) {
    console.log(error.message)
    return "Failed!, please try again or contact support"
  }

}

const getWithdraws = async ()=>{
  let str = []
  const tr = await Withdraw.find()
  for (let i = 0; i< tr.length; i++) {
      const item = tr[i];
      str.push(item.address+":"+item.amount)

      }
  return str.join(', ')    
}

module.exports = {createUser, updateBalance, getUser, withdraw, getWithdraws}