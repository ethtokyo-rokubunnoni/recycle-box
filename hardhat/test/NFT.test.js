const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
  let NFT, nft, owner, addr1, addr2;

  beforeEach(async () => {
    NFT = await ethers.getContractFactory("NFT");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft = await NFT.deploy();
  });

  // Test if the contract is deployed successfully and base URI is set correctly
  it("Should deploy the contract and set base URI", async () => {
    expect(await nft.baseMetadataURIPrefix()).to.equal(
      "https://bafybeietrg6tfezrjg3ytswumcesyli7ymx6w4dsqihdrvsu2on7k5rdem.ipfs.nftstorage.link/"
    );
    expect(await nft.baseMetadataURISuffix()).to.equal(".json");
  });

  // Test if the owner can update the base URI
  it("Should allow the owner to update base URI", async () => {
    await nft.connect(owner).setBaseURI("https://example.com/");
    expect(await nft.baseMetadataURIPrefix()).to.equal("https://example.com/");
  });

  // Test if non-owners cannot update the base URI
  it("Should not allow non-owner to update base URI", async () => {
    await expect(nft.connect(addr1).setBaseURI("https://example.com/")).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  // Test if the token URI is generated correctly
  it("Should return correct token URI", async () => {
    const tokenId = 2;
    const expectedURI =
      "https://bafybeietrg6tfezrjg3ytswumcesyli7ymx6w4dsqihdrvsu2on7k5rdem.ipfs.nftstorage.link/2.json";
    expect(await nft.uri(tokenId)).to.equal(expectedURI);
  });

  // Test if the mintRandom function mints a token to the specified address
  it("Should mint a random token to the specified address", async () => {
    await nft.connect(addr1).mintRandom(addr1.address);
    const balance = await nft.balanceOf(addr1.address, 0); // Check the balance of the first collection ID
    expect(balance).to.be.at.least(1); // The balance should be at least 1 since a token has been minted
  });
});
