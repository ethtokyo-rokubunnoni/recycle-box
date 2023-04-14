// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./Pool.sol";

contract PoolFactory is OwnableUpgradeable {
    using ClonesUpgradeable for address;

    Pool public instance;

    //Manage Pool Addresses.
    address[] public pools;

    //Map token address to pool address.
    mapping (address => address) public tokenToPool;

    //See if the pool for specified token address is enabled.
    mapping(address => bool) public isPoolCreated;

    //Event to be emitted when a new pool is created.
    event PoolCreated(address indexed token, address indexed pool);

    function initialize(Pool _instance) public initializer {
        __Ownable_init();

        instance = _instance;
    }

    //Create token pool with this function.
    function createPool(address token) public onlyOwner {
        require(!isPoolCreated[token], "Token pool already exists");

        address proxy = address(instance).clone();

        //Pass the factory address and deployer address upon initialization of the pool contract.
        Pool(proxy).initialize(token, address(this), msg.sender);

        pools.push(proxy);
        isPoolCreated[token] = true;
        tokenToPool[token] = proxy;

        emit PoolCreated(token, proxy);
    }

    //Get the list of all pools created.
    function getPools() public view returns (address[] memory) {
        return pools;
    }
}
