const mongoose = require('mongoose');
const { User } = require('./user/usermodel');

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/trader')
    .then( async () => {
        console.log('Connected to MongoDB');
        await User.findOneAndUpdate({address:"0x5a08870974FA7eBa7C89a4D1253b59DffcCaD6F4"},{balance:26})
        console.log(await User.find())
        
        // Update all user balances to 24
        //return User.updateMany({}, { $set: { balance: 24 } });
    })
    .then((result) => {
        console.log(`Updated ${result.nModified} user(s)`);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB or updating balances:', err);
    })
    .finally(() => {
        // Close the connection when done
        mongoose.connection.close();
    });
