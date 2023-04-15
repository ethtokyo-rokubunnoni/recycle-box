// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./PoolFactory.sol";

contract Pool is Initializable, OwnableUpgradeable, AccessControlUpgradeable {
    IERC20 public token;
    address public factory;

    mapping (address => uint256) userDeposit;
    uint256 public totalDeposit;

    bytes32 public constant DEPLOYER_ROLE = keccak256("DEPLOYER_ROLE");

    modifier onlyFactory() {
        require(msg.sender == factory, "Only Factory can call this function");
        _;
    }

    event PoolCreated (address indexed _token);
    event Deposit (address indexed user, uint256 amount);
    event Withdrawal (address indexed user, uint256 amount);

    function initialize(address _token, address _factory, address _deployer) public initializer onlyFactory {
        __Ownable_init();
        __AccessControl_init();

        token = IERC20(_token);
        factory = _factory;
        _setupRole(DEPLOYER_ROLE, _deployer);

        emit PoolCreated (_token);
    }

    // Add onlyDeployer modifier to functions that require deployer access
    modifier onlyDeployer() {
        require(hasRole(DEPLOYER_ROLE, msg.sender), "Caller is not a deployer");
        _;
    }

    function deposit(uint256 amount) public returns(bool){
        require(amount != 0, "Amount must be above ZERO");
        token.transferFrom(tx.origin, address(this), amount);
        totalDeposit += amount;
        userDeposit[tx.origin] += amount;

        emit Deposit(tx.origin, amount);
        return true;
    }

    //The owner of the contract can withdraw tokens
    function withdraw(uint256 amount) public onlyDeployer returns(bool){
        require(amount <= userDeposit[tx.origin], "Withdrawal amount exceed your balance");
        token.transfer(msg.sender, amount);
        totalDeposit -= amount;
        userDeposit[tx.origin] -= amount;

        emit Withdrawal(tx.origin, amount);
        return true;
    }

    function transfer(address to, uint256 amount) public onlyDeployer {
        token.transfer(to, amount);
    }

    function getUserDeposit(address user) public view returns (uint256 depositAmount) {
        return userDeposit[user];
    }
}
