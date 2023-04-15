// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SingleTokenPool.sol";

contract BatchDeposit {
    using SafeERC20 for IERC20;

    function batchDeposit(
        address[] memory tokenAddresses,
        SingleTokenPool[] memory poolInstances,
        uint256[] memory amounts
    ) public {
        require(
            tokenAddresses.length == poolInstances.length &&
                poolInstances.length == amounts.length,
            "Mismatch in token addresses, pool instances, and amounts length"
        );

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            IERC20(tokenAddresses[i]).safeTransferFrom(
                msg.sender,
                address(poolInstances[i]),
                amounts[i]
            );
            poolInstances[i].deposit(tokenAddresses[i], amounts[i]);
        }
    }

    function batchApprove(
        address[] memory tokenAddresses,
        uint256[] memory amounts,
        address batchDepositContract
    ) public {
        require(
            tokenAddresses.length == amounts.length,
            "Mismatch in token addresses and amounts length"
        );

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            IERC20(tokenAddresses[i]).safeIncreaseAllowance(
                batchDepositContract,
                amounts[i]
            );
        }
    }
}
