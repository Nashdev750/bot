const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        userid:{
            type: String,
            required: true,
            
        },
        balance:{
            type: Number,
            required: false,
            default: 0
        },
        address: {
            type: String,
            required: false,
        },
        privatekey: {
            type: String,
            required: false,
        },
        publickey: {
            type: String,
            required: false,
        },
        trading: {
            type: Number,
            required: false,
            default: 0
        }
        
    },
    {timestamps:true}
);

const withdrawSchema = new Schema(
    {
        userid:{
            type: String,
            required: true,
            unique: true
        },
        address:{
            type: String,
            required: true,
        },
        amount:{
            type: String,
            required: true,
        },
        state:{
            type: Number,
            required: false,
            default: 0
        },
        fund:{
            type: Boolean,
            required: false,
            default: false
        },
        
    },
    {timestamps:true}
);


const balanceSchema = new Schema(
    {
        userid:{
            type: String,
            required: true,
        },
        amount:{
            type: Number,
            required: true,
        }
    },
    {timestamps:true}
);

const orderSchema = new Schema(
    {
        side:{
            type: String,
            required: true,
        },
        type:{
            type: String,
            required: true,
        },
        quantity:{
            type: Number,
            required: true,
        },
        price:{
            type: Number,
            required: true,
        },
        symbol:{
            type: String,
            required: true,
        }
        
    },
    {timestamps:true}
);
const tradingSchema = new Schema(
    {
        status:{
            type: Number,
            default: 0
        }
        
    },
    {timestamps:true}
);


 const User = model('user',userSchema)
 const Withdraw = model('widthdraw',withdrawSchema)
 const Balance = model('balance',balanceSchema)
 const Order = model('order',orderSchema)
 const Trading = model('trading',tradingSchema)

module.exports = {User,Withdraw,Balance,Order, Trading}