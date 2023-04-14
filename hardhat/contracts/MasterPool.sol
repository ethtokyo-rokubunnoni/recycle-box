// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MasterPool is OwnableUpgradeable {
    address public deployer;

    // Mapping from token address to the total deposit amount for that token.
    mapping(address => uint256) public totalDeposits;

    // Mapping from user address to token address to the deposit amount for that user and token.
    mapping(address => mapping(address => uint256)) public userDeposits;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);

    function initialize(address _deployer) public initializer {
        __Ownable_init();
        deployer = _deployer;
    }

    function deposit(address token, uint256 amount) public {
        require(amount > 0, "Amount must be above ZERO");
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        totalDeposits[token] += amount;
        userDeposits[msg.sender][token] += amount;

        emit Deposit(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) public {
        require(amount <= userDeposits[msg.sender][token], "Withdrawal amount exceed your balance");

        IERC20(token).transfer(msg.sender, amount);
        totalDeposits[token] -= amount;
        userDeposits[msg.sender][token] -= amount;

        emit Withdrawal(msg.sender, token, amount);
    }
}
