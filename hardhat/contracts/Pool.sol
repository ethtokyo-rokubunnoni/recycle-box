// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PoolFactory.sol";

contract Pool {
    IERC20 public token;
    address public factory;

    mapping(address => uint256) userDeposit;
    uint256 public totalDeposit;

    event PoolCreated(address indexed _token);
    event Withdrawal(address indexed user, uint256 amount);

    function initialize(address _token, address _factory, address _owner) external {
        token = IERC20(_token);
        factory = _factory;
        _setOwner(_owner);

        emit PoolCreated(_token);
    }

    function deposit(uint256 amount) public returns (bool) {
        address sender = tx.origin;
        require(amount != 0, "Amount must be above ZERO");
        require(token.allowance(sender, address(this)) >= amount, "Insufficient allowance");

        token.transferFrom(sender, address(this), amount);
        totalDeposit += amount;
        userDeposit[sender] += amount;

        return true;
    }

    // The owner of the contract can withdraw tokens
    function withdraw(uint256 amount) public onlyOwner returns (bool) {
        require(
            amount <= userDeposit[msg.sender],
            "Withdrawal amount exceed your balance"
        );
        token.transfer(msg.sender, amount);
        totalDeposit -= amount;
        userDeposit[msg.sender] -= amount;

        emit Withdrawal(msg.sender, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public onlyOwner {
        token.transfer(to, amount);
    }

    function getUserDeposit(address user)
        public
        view
        returns (uint256 depositAmount)
    {
        return userDeposit[user];
    }
}