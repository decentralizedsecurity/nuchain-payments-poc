/*
    Node for PoC
    Author: Lorenzo De Linares <lorenzo.linares@uma.es>
    Licence: GPL-3.0
*/

const Web3 = require('web3');
const web3 = new Web3(""); // <-- Your "NuCypher" blockchain here
const abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"nodes","type":"address[]"}],"name":"NewRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"PolicyDeployed","type":"event"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"address[]","name":"nodes","type":"address[]"},{"internalType":"enum NuDummy.Networks","name":"paymentNet","type":"uint8"},{"internalType":"uint256","name":"paymentNo","type":"uint256"}],"name":"deployPolicy","outputs":[{"internalType":"uint256","name":"policyNum","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"policyDeployed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"policyNo","type":"uint256"}],"name":"readPolicy","outputs":[{"internalType":"address","name":"issuer","type":"address"},{"internalType":"uint256","name":"time","type":"uint256"},{"internalType":"enum NuDummy.Networks","name":"paymentNet","type":"uint8"},{"internalType":"uint256","name":"paymentNo","type":"uint256"}],"stateMutability":"view","type":"function"}]';
var policiesContract = new web3.eth.Contract(JSON.parse(abi), ''); // <-- Your Policies contract address on the "NuCypher blockchain" here

const abi_payment = '[{"inputs":[{"internalType":"address","name":"USDCContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyUsed","type":"error"},{"inputs":[],"name":"Forbidden","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"receiptNo","type":"uint256"}],"name":"PaymentDone","type":"event"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"},{"internalType":"address[]","name":"users","type":"address[]"}],"name":"changePermissions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"}],"name":"getOperationAndPerm","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"used","type":"bool"},{"internalType":"address[]","name":"perms","type":"address[]"}],"internalType":"struct Payment.Returnable","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"operation","type":"uint256"}],"name":"markedAsUsed","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"authorizedNodes","type":"address[]"}],"name":"payUSDC","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"retireFundsUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
const privatekey = ""; // <-- Private key of the node here

var web3reader;
var paymentContract;
var paymentContractAddress;

var account = web3.eth.accounts.privateKeyToAccount(privatekey);
web3.eth.accounts.wallet.add(account);
console.log("Loaded account: " + account.address);
console.log("Running node...");
policiesContract.events.NewRequest({}, async (err, res) => {
    if(err){
        console.error(err);
    }else{
        let data = res.returnValues;
        if(data.nodes.includes(account.address)){
            // Request received for my node
            console.log('Request: ' + data.request + ' received.');
            // Read policy data
            console.log("[Policy " + data.request + "] Reading policy data.");
            policiesContract.methods.readPolicy(data.request).call().then(async (policyData) => {
                if(true){ // TODO: Change for check for received publicKeys
                     // Check payment on payment blockchain
                     console.log("[Policy " + data.request + "] Checking payment.");

                     if(policyData.paymentNet == 1){
                        paymentContractAddress = ''; // <-- Your payment contract address on the external blockchain here
                        web3reader = new Web3(""); // <-- Your external blockchain RPC here
                        paymentContract = new web3reader.eth.Contract(JSON.parse(abi_payment), paymentContractAddress);
                     }

                     var accountReader = web3reader.eth.accounts.privateKeyToAccount(privatekey);
                     web3reader.eth.accounts.wallet.add(accountReader);
                     paymentContract.methods.getOperationAndPerm(policyData.paymentNo).call().then(async (paymentData) => {
                        console.log("Payment data received. " + paymentData.amount + " Used: " + paymentData.used);
                        console.log("Payment permissions: ");
                        console.log(paymentData.perms);
                        if(paymentData.amount == 10000000 && !paymentData.used && paymentData.perms.includes(policyData.issuer)){ // TODO: Change price (10 USDC now)
                           console.log("Marking as used.");
                           paymentContract.methods.markedAsUsed(policyData.paymentNo).send({from: accountReader.address, gas: 3000000}).then(() => {
                              console.log("Marked as used.");
                              console.log("[Policy " + data.request + "] Deploying policy.");
                              // Valid payment => Deploy policy
                              policiesContract.methods.policyDeployed(data.request).send({from: account.address, gas: 3000000}).then(() => console.log("[Policy " + data.request + "] Policy deployed.")); 
                           });
                        }else{
                            console.log("Payment not valid");
                        }
                     });
                }
            });
        }  
    }
});