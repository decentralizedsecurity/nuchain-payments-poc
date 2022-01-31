// SPDX-License-Identifier: GPL-3.0
/*
    PoC Contract of Policy deployment (Dummy)
    Author: Lorenzo De Linares <lorenzo.linares@uma.es>
    Licence: GPL-3.0
*/

pragma solidity >=0.7.0 <0.9.0;

contract NuDummy {

    address owner;

    struct Policy {
        address issuer;
        uint time;
        uint threshold;
        uint deployed;
        Networks paymentNet;
        uint paymentNo;
        mapping(address => bool) nodes;
    }

    uint policyCounter = 0;

    enum Networks { XDAI, MATIC }

    mapping(uint => Policy) policies;

    event NewRequest(uint request, address[] nodes);
    event PolicyDeployed(uint policyNo);

    constructor() {
        owner = payable(msg.sender);
    }

    function deployPolicy(uint time, address[] memory nodes, Networks paymentNet, uint paymentNo) public returns (uint policyNum) {
        address sender = msg.sender;
        uint policyNo = policyCounter++;
        Policy storage p = policies[policyNo];
        p.issuer = sender;
        p.time = time;
        for (uint i=0; i<nodes.length; i++) {
            p.nodes[nodes[i]] = true;
        }
        p.threshold = nodes.length;
        p.deployed = 0;
        p.paymentNet = paymentNet;
        p.paymentNo = paymentNo;
        emit NewRequest(policyNo, nodes);
        return policyNo;
    }

    function readPolicy(uint policyNo) public view returns (address issuer, uint time, Networks paymentNet, uint paymentNo){
        Policy storage p = policies[policyNo];
        return(p.issuer, p.time, p.paymentNet, p.paymentNo);
    }

    function policyDeployed(uint policyNo) public {
        address sender = msg.sender;
        Policy storage p = policies[policyNo];
        if(p.nodes[sender]){
            p.deployed++;
            if(p.deployed == p.threshold){
                emit PolicyDeployed(policyNo);
            }
        }else{
            revert("Not a node of the policy.");
        }
    }
}