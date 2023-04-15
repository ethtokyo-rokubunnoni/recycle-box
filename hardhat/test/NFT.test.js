const { expect } = require("chai");

describe("NFT", function () {
  let NFT, nft, owner, addr1, addr2;

  beforeEach(async () => {
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the right base URI", async function () {
      const baseURI = await nft.baseMetadataURIPrefix();
      expect(baseURI).to.equal("https://bafybeidoftie6hxk3tpgndkb2nqemc57folfff5bsfp6hepdgfpaehk4x4.ipfs.dweb.link/");
    });

    it("Should set the right base URI suffix", async function () {
      const suffix = await nft.baseMetadataURISuffix();
      expect(suffix).to.equal(".json");
    });
  });

  describe("Minting", function () {
    it("Should mint a random token to addr1", async function () {
      await nft.connect(addr1).mintRandom(addr1.address);
      const totalSupply = await nft.totalSupply();
      expect(totalSupply).to.equal(1);
    });
  });

  describe("Token URI", function () {
    it("Should return the correct token URI", async function () {
      await nft.connect(addr1).mintRandom(addr1.address);
      const tokenURI = await nft.uri(1);
      expect(tokenURI).to.equal("https://bafybeidoftie6hxk3tpgndkb2nqemc57folfff5bsfp6hepdgfpaehk4x4.ipfs.dweb.link/1.json");
    });
  });

  describe("Setting Base URI", function () {
    it("Should update the base URI", async function () {
      await nft.setBaseURI("https://new-ipfs-base-uri/");
      const newBaseURI = await nft.baseMetadataURIPrefix();
      expect(newBaseURI).to.equal("https://new-ipfs-base-uri/");
    });
  });
});
