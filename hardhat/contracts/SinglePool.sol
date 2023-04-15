// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SingleTokenPool is OwnableUpgradeable, ReentrancyGuard {

    address public deployer;
    IERC20 public token;

    uint256 public totalDeposit;
    mapping(address => uint256) public userDeposits;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event Initialized (address deployer, address token);

    function initialize(address _deployer, address _token) public initializer {
        __Ownable_init();
        deployer = _deployer;
        token = IERC20(_token);
        emit Initialized(_deployer, _token);
    }

    function deposit(address tokenAddress, uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be above ZERO");
        require(tokenAddress == address(token), "Wrong token");
        token.transferFrom(msg.sender, address(this), amount);

        totalDeposit += amount;
        userDeposits[msg.sender] += amount;

        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant {
        require(amount <= userDeposits[msg.sender], "Withdrawal amount exceeds your balance");

        token.transfer(msg.sender, amount);
        totalDeposit -= amount;
        userDeposits[msg.sender] -= amount;

        emit Withdrawal(msg.sender, amount);
    }

    function getDeposit(address user) external view returns (uint256 depositAmount) {
        return userDeposits[user];
    }
}
