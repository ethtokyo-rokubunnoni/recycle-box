// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./PoolFactory.sol";

contract BatchDeposit {

    PoolFactory public poolFactory;
    constructor(PoolFactory _poolFactory) {
        poolFactory = _poolFactory;
    }

    function batchDeposit (uint256[] memory amount, address[] memory tokenAddress) public {
        require (tokenAddress.length == amount.length, "Invalid input");

        for(uint256 i = 0; i < tokenAddress.length; i++){
            address poolAddr = poolFactory.tokenToPool(tokenAddress[i]);
            uint256 depositAmount = amount[i];
            require(poolAddr != address(0), "Pool not found");
            Pool pool = Pool(poolAddr);
            pool.deposit(depositAmount);
        } 
    }      
}
