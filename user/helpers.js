const ethers = require('ethers');

const address = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'


const usdtAbi = [
  // ABI definitions for the USDT contract, you may need to use the actual ABI
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ name: 'to', type: 'address' }, { name: 'value', type: 'uint256' }],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  }
];

// Create a contract instance for USDT



module.exports.getBalance =  async (targetAddress)=>{
    try {
      console.log(targetAddress)
        const provider = new ethers.JsonRpcProvider('https://arb-mainnet.g.alchemy.com/v2/x0clhb1ii8-x5vdQZ6ae3UMYcRef5ZT_');
        const usdtContract = new ethers.Contract(address, usdtAbi, provider);
        // console.log(usdtContract)
        const balance = await usdtContract.balanceOf(targetAddress)
        console.log("bal: ",balance)
        const decimals = await usdtContract.decimals();
        const formattedBalance = ethers.formatUnits(balance, decimals);
        return formattedBalance
    } catch (error) {
        console.log("error",error.message)
        return 0
    }
  
}

const transferUSDT = async () => {
  const toAddress = '0x21e8b99fd454e2fc1876a12aa8ed3dc8ef41a10f';
  const provider = new ethers.JsonRpcProvider('https://arb-mainnet.g.alchemy.com/v2/x0clhb1ii8-x5vdQZ6ae3UMYcRef5ZT_');

  // Set up the wallet using the user's private key
  const wallet = new ethers.Wallet('0xe3f08239d18fbe3dc1359d84185c0caeddc1bd097783175dcdc7c8b4e5fbe587', provider);

  // Connect to the USDT contract
  const usdtContract = new ethers.Contract(address, usdtAbi, wallet);

  try {
    // Verify the user's balance
    const balance = await usdtContract.balanceOf('0x00dba346d2c90E7f29985C7aE942316b5E9E63eD');
    const decimals = await usdtContract.decimals();
    const amount = ethers.parseUnits('20.0', decimals); // Transfer amount in USDT units

    // Check if the user has enough balance
    console.log(balance)
    console.log(amount)
    if (balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Estimate the gas limit
    // const gasLimit = await usdtContract.estimateGas.transfer(toAddress, amount);

    // Create and send the transaction
    const tx = await usdtContract.transfer(toAddress, amount);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log(`Transaction successful with hash: ${tx.hash}`);
  } catch (error) {
    console.error(`Error occurred: ${error.message}`);
  }
}

// transferUSDT()