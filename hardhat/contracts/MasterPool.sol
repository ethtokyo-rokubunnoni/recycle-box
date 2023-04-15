// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MasterPool is OwnableUpgradeable, ReentrancyGuard {

    address public deployer;
    address[] public depositedTokens;

    // Mapping from token address to the total deposit amount for that token.
    mapping(address => uint256) public totalDeposits;
    mapping(address => bool) public isTokenDeposited;

    // Mapping from user address to token address to the deposit amount for that user and token.
    mapping(address => mapping(address => uint256)) public userDeposits;

    event DepositComplete(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);
    event Initialized (address deployer);

    function initialize(address _deployer) public initializer {
        __Ownable_init();
        deployer = _deployer;
        emit initialized (_deployer);
    }

    function deposit(address token, uint256 amount) public nonReentrant  returns (bool){
        require(amount > 0, "Amount must be above ZERO");
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        totalDeposits[token] += amount;
        userDeposits[msg.sender][token] += amount;

        // Update the list of deposited tokens if this is a new token.
        if (!isTokenDeposited[token]) {
            depositedTokens.push(token);
            isTokenDeposited[token] = true;
        }

        emit DepositComplete(msg.sender, token, amount);
        return true;
    }

    //Withdrawal function.
    function withdraw(address token, uint256 amount) public nonReentrant returns (bool){
        require(amount <= userDeposits[msg.sender][token], "Withdrawal amount exceed your balance");

        IERC20(token).transfer(msg.sender, amount);
        totalDeposits[token] -= amount;
        userDeposits[msg.sender][token] -= amount;

        emit Withdrawal(msg.sender, token, amount);
        return true;
    }

    // View function to return user deposits for all tokens.
    function getDeposits(address user) external view returns (address[] memory tokens, uint256[] memory depositAmounts) {
    uint256 nonZeroDepositsCount = 0;

    for (uint256 i = 0; i < depositedTokens.length; i++) {
        if (userDeposits[user][depositedTokens[i]] > 0) {
            nonZeroDepositsCount++;
        }
    }

    tokens = new address[](nonZeroDepositsCount);
    depositAmounts = new uint256[](nonZeroDepositsCount);
    uint256 index = 0;

    for (uint256 i = 0; i < depositedTokens.length; i++) {
        uint256 depositAmount = userDeposits[user][depositedTokens[i]];
        if (depositAmount > 0) {
            tokens[index] = depositedTokens[i];
            depositAmounts[index] = depositAmount;
            index++;
        }
    }
}

}