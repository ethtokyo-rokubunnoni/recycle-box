// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";


contract NFT is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using Strings for uint256;

    uint256 public constant COLLECTION_COUNT = 5;
    string public baseMetadataURIPrefix;
    string public baseMetadataURISuffix;

    // collection ID 
    uint256 public constant V0 = 0;
    uint256 public constant V1 = 1;
    uint256 public constant V2 = 2;
    uint256 public constant V3 = 3;
    uint256 public constant V4 = 4;

    //metadata updates
    //To refresh token metadata on OpenSea, you can emit on-chain events as defined in EIP-4906:
    event MetadataUpdate(uint256 _tokenId);

    constructor() ERC1155("") {
        baseMetadataURIPrefix = "https://bafybeietrg6tfezrjg3ytswumcesyli7ymx6w4dsqihdrvsu2on7k5rdem.ipfs.nftstorage.link/"; // ipfs base url, need to create ipfs before deploying
        baseMetadataURISuffix = ".json"; //".json", same as above
    }

    //function to change URI
    //update the URI
    function setBaseURI(string memory newuri) public onlyOwner {
        baseMetadataURIPrefix = newuri;
    }

    //for OpenSea
        function uri(uint _tokenId) override public view returns (string memory){
        return string(
            abi.encodePacked(
                baseMetadataURIPrefix,
                Strings.toString(_tokenId),
                baseMetadataURISuffix
            )
        );
    }

    //Randomly assign collection ID
    // ***** need to restrict address ******, only factory modifier or something
    function mintRandom(address to) external {
        uint256 collectionId = _randomId();
        _mint(to, collectionId, 1, "");
    }

    function _randomId() internal view returns (uint256) {
        uint256 randomness = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
        return randomness % COLLECTION_COUNT;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}

