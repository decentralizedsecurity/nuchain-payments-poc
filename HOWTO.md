# PoC Functionality

The PoC is based on two Node.js scripts and two Solidity smart contracts:
 - nu.js -- NuCypher worker node
 - client.js -- Client who would deploy policies
 - Payment.sol -- Contract to be used as payment wall on any Blockchain
 - NuDummy.sol -- Contract to be used on the NuCypher network

## Running

 1. Clone the repo on you local machine.
 2. Run 'npm install'
 3. Deploy the smart contracts to their respective blockchains
 4. Change the addresses of the contracts and/or private keys on the js files
 5. Run nu.js (node nu.js)
 6. Try to "deploy" a policy running client.js (node client.js)

## Workflow diagram

[![](https://mermaid.ink/img/pako:eNp9kk1PwzAMhv-KFQ0tlbZKfAxQD0gj3ZFpYhx7CY27VrRJSRNQte6_k5JsMA7kkih-Xvu1kz3JlUCSkJ3mbQkvaSbBrSWlrK5QmiiC-fxhuIxhi1JAy_vG3Q7wSDf-CNuGawNMSaN5bqKgH1UwXPGg0_husXM6RteW9W2J-n_h67Ggqqu8B1UU87zklRwgOGQevI5h9THamG48-ewroZie0JT-FF27bqNQK_UpbmJgJeZvv5o7iy9ieOL6FAbege1Q_MVuj5j34SiBba36kWRn5N1fz2kAneWlJ1eUTiZ-9jDch1kUVooOjIJTN5-8rtE5csGd2xcX36bIjDSoG14J9677MWFGTIkNZiRxR-FcZiSTB8fZVnCDK1EZpUlS8LrDGeHWqG0vc5IYbfEIpRV3f6QJ1OELtoCxeA)](https://mermaid.live/edit#pako:eNp9kk1PwzAMhv-KFQ0tlbZKfAxQD0gj3ZFpYhx7CY27VrRJSRNQte6_k5JsMA7kkih-Xvu1kz3JlUCSkJ3mbQkvaSbBrSWlrK5QmiiC-fxhuIxhi1JAy_vG3Q7wSDf-CNuGawNMSaN5bqKgH1UwXPGg0_husXM6RteW9W2J-n_h67Ggqqu8B1UU87zklRwgOGQevI5h9THamG48-ewroZie0JT-FF27bqNQK_UpbmJgJeZvv5o7iy9ieOL6FAbege1Q_MVuj5j34SiBba36kWRn5N1fz2kAneWlJ1eUTiZ-9jDch1kUVooOjIJTN5-8rtE5csGd2xcX36bIjDSoG14J9677MWFGTIkNZiRxR-FcZiSTB8fZVnCDK1EZpUlS8LrDGeHWqG0vc5IYbfEIpRV3f6QJ1OELtoCxeA)
