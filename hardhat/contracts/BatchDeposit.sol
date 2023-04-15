// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./PoolFactory.sol";

contract BatchDeposit {

    PoolFactory public poolFactory;

    event Deposit(address indexed _from, uint _value);

    constructor(PoolFactory _poolFactory) {
        poolFactory = _poolFactory;
    }

    function batchDeposit (uint256[] memory amount, address[] memory tokenAddress) public returns(bool) {
        require (tokenAddress.length == amount.length, "Invalid input");

        for(uint256 i = 0; i < tokenAddress.length; i++){
            address poolAddr = poolFactory.tokenToPool(tokenAddress[i]);
            require(poolAddr != address(0), "Pool not found");
            Pool pool = Pool(poolAddr);
            pool.deposit(amount[i], msg.sender);
            emit Deposit (msg.sender, amount[i]);
        } 
        return true;
    }      
}
