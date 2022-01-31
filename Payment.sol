// SPDX-License-Identifier: GPL-3.0
/*
    PoC Contract of Payment Gateway
    Author: Lorenzo De Linares <lorenzo.linares@uma.es>
    Licence: GPL-3.0
*/

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment {

    address owner;
    address retireAddress;
    uint256 balanceAvailable;

    IERC20 private _token;

    struct Operation {
        address payer;
        uint256 amount;
        bool used;
        uint usedByNo; // Nu nodes that has marked as used (number)
        mapping(address => bool) usedBy; // Nu nodes that has marked as used
        uint authorizedNumber; // Nu nodes (number)
        mapping(address => bool) authorizedNodes; // Nu nodes
        address[] authorizedUsers;
    }

    struct Returnable {
        uint256 amount;
        bool used;
        address[] perms;
    }

    uint operNum = 0;
    mapping(uint => Operation) operations;
    mapping(uint256 => bool) usedNonces;

    event PaymentDone(address sender, uint receiptNo);

    error Forbidden();
    error AlreadyUsed();

    constructor(address USDCContract) {
        owner = payable(msg.sender);
        retireAddress = owner;
        _token = IERC20(USDCContract);
    }


    function payUSDC(address[] memory authorizedNodes) payable public {
        address sender = msg.sender;
        uint operation = operNum++;
        uint256 amount = 10000000; // 10.00 USDC
        require(_token.balanceOf(sender) >= amount, "Not enough funds.");
        require(_token.transferFrom(sender, address(this), amount), "Transfer failed.");
        Operation storage oper = operations[operation];
        oper.payer = sender;
        oper.amount = amount;
        oper.used = false;
        oper.authorizedUsers.push(sender);
        //oper.authorized[sender] = true;
        for(uint i=0; i<authorizedNodes.length; i++){
            oper.authorizedNodes[authorizedNodes[i]] = true;
        }
        oper.authorizedNumber = authorizedNodes.length;
        emit PaymentDone(sender, operation);
    }

    function changePermissions(uint operation, address[] memory users) public {
        address sender = msg.sender;
        if(operations[operation].payer != sender){
            revert Forbidden();
        }else{
            operations[operation].authorizedUsers = users;
            operations[operation].authorizedUsers.push(sender);
        }
    }

    function markedAsUsed(uint operation) public {
        address sender = msg.sender;
        Operation storage op = operations[operation];
        if(op.used){
            revert AlreadyUsed();
        }else{
            if(op.authorizedNodes[sender]){
                op.usedBy[sender] = true;
                op.usedByNo++;
                if(op.usedByNo == op.authorizedNumber){
                    op.used = true;
                    balanceAvailable += op.amount;
                }
            }else{
                revert("Can't mark as used.");
            }
        }
    }

    function retireFundsUSDC() public {
        address sender = msg.sender;
        uint senderFee = (balanceAvailable/100)*5;
        // 5% to sender
        require(_token.transfer(sender, senderFee), "Transfer failed.");
        balanceAvailable -= senderFee;
        // 95% (rest) to pool
        require(_token.transfer(retireAddress, balanceAvailable), "Transfer failed.");
        balanceAvailable = 0;
    }

    function getOperationAndPerm(uint operation) public view returns (Returnable memory){
        uint256 amount = operations[operation].amount;
        bool used = operations[operation].used;
        address[] memory perms = operations[operation].authorizedUsers;
        return Returnable(amount, used, perms);
    }

}