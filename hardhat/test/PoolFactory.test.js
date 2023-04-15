const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

describe("PoolFactory, Pool, and BatchDeposit tests", function () {
  let deployer, address1, pool, poolFactory, batchDeposit, tokenA, tokenB;

  beforeEach(async () => {
    [deployer, address1] = await ethers.getSigners();

    // Deploy ERC20 tokens
    const Token = await ethers.getContractFactory("TestToken");
    tokenA = await Token.deploy("Token A", "TKA");
    tokenB = await Token.deploy("Token B", "TKB");

    // Mint tokens to deployer and address1
    await tokenA.mint(deployer.address, ethers.utils.parseEther("10000"));
    await tokenA.mint(address1.address, ethers.utils.parseEther("10000"));
    await tokenB.mint(deployer.address, ethers.utils.parseEther("10000"));
    await tokenB.mint(address1.address, ethers.utils.parseEther("10000"));

    // Deploy Pool contract
    const Pool = await ethers.getContractFactory("Pool");
    pool = await Pool.deploy();

    // Deploy PoolFactory contract
    const PoolFactory = await ethers.getContractFactory("PoolFactory");
    poolFactory = await PoolFactory.deploy(pool.address);

    // Deploy BatchDeposit contract with PoolFactory address
    const BatchDeposit = await ethers.getContractFactory("BatchDeposit");
    batchDeposit = await BatchDeposit.deploy(poolFactory.address);

    // Create pools using PoolFactory
    await poolFactory.createPool(tokenA.address);
    await poolFactory.createPool(tokenB.address);

    // Approve BatchDeposit contract to spend tokens
    await tokenA.approve(batchDeposit.address, ethers.constants.MaxUint256);
    await tokenB.approve(batchDeposit.address, ethers.constants.MaxUint256);
  });

  it("Should perform batch deposit", async () => {
    const depositAmount = ethers.utils.parseEther("10");

    // Perform batch deposit
    await batchDeposit.deposit(
      [tokenA.address, tokenB.address],
      [depositAmount, depositAmount]
    );

    // Check if deposits were successful
    const poolA = await poolFactory.tokenToPool(tokenA.address);
    const poolB = await poolFactory.tokenToPool(tokenB.address);
    const poolAContract = await ethers.getContractAt("Pool", poolA);
    const poolBContract = await ethers.getContractAt("Pool", poolB);

    expect(await poolAContract.getUserDeposit(deployer.address)).to.equal(
      depositAmount
    );
    expect(await poolBContract.getUserDeposit(deployer.address)).to.equal(
      depositAmount
    );
  });
});
