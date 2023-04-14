// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./PoolFactory.sol";

contract Pool is Initializable, OwnableUpgradeable {
    IERC20 public token;
    mapping (address => uint256) userDeposit;
    uint256 public totalDeposit;
    address public factory;

     modifier onlyFactory() {
        require(msg.sender == factory, "Only Factory can call this function");
        _;
    }

    event PoolCreated (address indexed _token);

    function initialize(address _token, address _factory) public initializer onlyFactory{
        __Ownable_init();

        token = IERC20(_token);
        factory = _factory;
        emit PoolCreated (_token);
    }

    function deposit(uint256 amount) public {
        require (amount != 0, "Amount must be above ZERO");
        token.transferFrom(tx.origin, address(this), amount);
        totalDeposit += amount;
        userDeposit[tx.origin] += amount;
    }

    //The owner of the contract can withdraw tokens (for now)
    function withdraw(uint256 amount) public{
        require (amount <= userDeposit[tx.origin], "Withdrawal amount exceed your balance");
        token.transfer(msg.sender, amount);
        totalDeposit -= amount;
        userDeposit[tx.origin] -= amount;
    }

    function transfer(address to, uint256 amount) public onlyOwner {
        token.transfer(to, amount);
    }
}