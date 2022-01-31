/*
    Client for PoC
    Author: Lorenzo De Linares <lorenzo.linares@uma.es>
    Licence: GPL-3.0
*/

const Web3 = require('web3');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const web3 = new Web3(""); // <-- Your "NuCypher" blockchain here
const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"nodes","type":"address[]"}],"name":"NewRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"PolicyDeployed","type":"event"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"address[]","name":"nodes","type":"address[]"},{"internalType":"enum NuDummy.Networks","name":"paymentNet","type":"uint8"},{"internalType":"uint256","name":"paymentNo","type":"uint256"}],"name":"deployPolicy","outputs":[{"internalType":"uint256","name":"policyNum","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"policyDeployed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"readPolicy","outputs":[{"internalType":"address","name":"issuer","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"enum NuDummy.Networks","name":"paymentNet","type":"uint8"},{"internalType":"uint256","name":"paymentNo","type":"uint256"}],"stateMutability":"view","type":"function"}]';
const abi_payment = '[{"inputs":[{"internalType":"address","name":"USDCContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyUsed","type":"error"},{"inputs":[],"name":"Forbidden","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"receiptNo","type":"uint256"}],"name":"PaymentDone","type":"event"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"},{"internalType":"address[]","name":"users","type":"address[]"}],"name":"changePermissions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"}],"name":"getOperationAndPerm","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"},{"internalType":"address[]","name":"perms","type":"address[]"}],"internalType":"struct Payment.Returnable","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"}],"name":"markedAsUsed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"authorizedNodes","type":"address[]"}],"name":"payUSDC","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"retireFundsUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
const ERC20_abi = '[{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]';
var policiesContract = new web3.eth.Contract(JSON.parse(abi), ''); // <-- Your Policies contract address on the "NuCypher blockchain" here

var nodesToDeploy = [];
var policyTime = 0;
var account;

console.log('=============================');
console.log('Payment and Deployment PoC');
console.log('=============================');
rl.question('Enter your private key: ', (pk) => {
    account = web3.eth.accounts.privateKeyToAccount(pk);
    web3.eth.accounts.wallet.add(account);
    console.log("Loaded account: " + account.address);
    getNodesToDeploy();
});

rl.on('close', () => {
    console.log("Closing...");
    process.exit(0);
})

function getNodesToDeploy() {
    rl.question('Enter address of nodes to deploy policy (to finish type 0x0): ', (n) => {
        if(n != "0x0"){
            nodesToDeploy.push(n);
            getNodesToDeploy();
        }else{
            if(nodesToDeploy.length == 0){
                console.log("You need to enter at least one address.");
                getNodesToDeploy();
            }else{
                console.log("Selected nodes:");
                console.log(nodesToDeploy);
                getPolicyDetails();
            }
        }
    })
}

function getPolicyDetails(){
    rl.question('Enter time to keep the policy available: ', (time) => {
        policyTime = time;
        getPaymentDetails();
    })
}

function getPaymentDetails(){
    var paymentWeb3;
    var usdcContract;
    var paymentContract;
    var paymentContractAddress; 
    rl.question('Select blockchain to pay: \n[1] MATIC Mumbai Testnet\n', (blockchain) => {
        if(blockchain == 1){
            paymentContractAddress = ''; // <-- Your payment contract address on the external blockchain here
            console.log("You have selected MATIC Mumbai Testnet blockchain.\nYou are going to pay 10 USDC + gas fees (in MATIC).");
            paymentWeb3 = new Web3(""); // <-- Your external blockchain RPC here
            paymentWeb3.eth.accounts.wallet.add(account);
            paymentContract = new paymentWeb3.eth.Contract(JSON.parse(abi_payment), paymentContractAddress);
            usdcContract = new paymentWeb3.eth.Contract(JSON.parse(ERC20_abi), ''); // <-- USDC contract address on the external blockchain here
            usdcContract.methods.balanceOf(account.address).call().then((balance) => {
                console.log(`Your USDC balance is: ${balance/Math.pow(10, 6)} USDC`);
                if(balance < 10000000){
                    console.log('Balance of USDC too low. Please get some USDC.');
                    rl.close();
                }else{
                    paymentWeb3.eth.getGasPrice().then((gasPrice) => {
                        console.log(`Aproximate gas price: ${web3.utils.fromWei(gasPrice, 'ether')} ETH.`);
                        paymentWeb3.eth.getBalance(account.address).then((balance) => {
                            console.log(`Your ETH balance is: ${web3.utils.fromWei(balance, 'ether')} ETH`);
                            if(balance < gasPrice){
                                console.log('Balance of ETH too low. Please get some USDC.');
                                rl.close();
                            }else{
                                rl.question('You are going to pay 10 USDC + gas price. Do you agree? (Y/N): ', (res) => {
                                    if(res == 'Y' || res == 'y'){
                                        console.log('Paying...');
                                        console.log('Approving allowance of 10 USDC...');
                                        usdcContract.methods.approve(paymentContractAddress, 10000000).send({from: account.address, gas: 3000000}).then((result) => {
                                            console.log("Allowed 10 USDC for payment contract.");
                                            console.log("Sending petition to payment contract...");
                                            paymentContract.methods.payUSDC(nodesToDeploy).send({from: account.address, gas: 3000000})
                                            .then((rec) => {
                                                console.log("Service paid.");
                                                console.log("Sending policy deployment request...");
                                                // TODO. Send the public keys off-chain here.
                                                policiesContract.methods.deployPolicy(policyTime, nodesToDeploy, 1, rec.events.PaymentDone.returnValues.receiptNo).send({from: account.address, gas: 3000000}).then((policy) => {
                                                    console.log(`Policy deployment requested. ${policy.events.NewRequest.returnValues.request} Waiting confirmation of deployment...`);
                                                    console.log('This can take a while...');
                                                    policiesContract.events.PolicyDeployed({}, (err, eventData) => {
                                                        if(eventData.returnValues.policyNo == policy.events.NewRequest.returnValues.request){
                                                            console.log(`Policy ${policy.events.NewRequest.returnValues.request} deployed successfully.`);
                                                            console.log('Process finished. Closing...');
                                                            rl.close();
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    }else{
                                        console.log('Transaction cancelled.');
                                        rl.close();
                                    }
                                })
                            }
                        })
                    })
                }
            });
        }else{
            console.log("Selection not valid.");
            getPaymentDetails();
        }
    })
}