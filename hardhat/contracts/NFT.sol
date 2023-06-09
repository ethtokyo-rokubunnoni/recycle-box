// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFT is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply {
    using Strings for uint256;

    uint256 public constant COLLECTION_COUNT = 12;
    string public baseMetadataURIPrefix;
    string public baseMetadataURISuffix;

    // collection ID
    uint256[] public collectionIds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    uint256[] private _allTokens;
    mapping(uint256 => uint256) private _allTokensIndex;

    //metadata updates
    //To refresh token metadata on OpenSea, you can emit on-chain events as defined in EIP-4906:
    event MetadataUpdate(uint256 _tokenId);
    event URIInitialized(string metadataPrefix, string metadataSuffix);
    event PrefixUpdated(string updatedPrefix);
    event NftMinted(
        address reciever,
        uint256 collectionID,
        uint256 numberRecieved
    );

    constructor() ERC1155("") {
        baseMetadataURIPrefix = "https://bafybeidoftie6hxk3tpgndkb2nqemc57folfff5bsfp6hepdgfpaehk4x4.ipfs.dweb.link/"; // ipfs base url, need to create ipfs before deploying
        baseMetadataURISuffix = ".json"; //".json", same as above
        emit URIInitialized(baseMetadataURIPrefix, baseMetadataURISuffix);
    }

    //function to change URI
    //update the URI
    function setBaseURI(string memory newuri) public onlyOwner {
        baseMetadataURIPrefix = newuri;
        emit PrefixUpdated(newuri);
    }

    //for OpenSea
    function uri(uint _tokenId) public view override returns (string memory) {
        return
            string(
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
        uint256 collectionId = _rank();
        _mint(to, collectionId, 1, "");
        _addTokenToAllTokensEnumeration(collectionId);
        emit NftMinted(to, collectionId, 1);
    }

    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "Index out of bounds");
        return _allTokens[index];
    }

    function _rank() internal view returns (uint256 _Rank) {
        uint256 randomness = uint256(
            keccak256(
                abi.encodePacked(block.timestamp, block.difficulty, msg.sender)
            )
        );
        randomness = randomness % 10000;

        uint16[12] memory rarity = [
            6150,
            4050,
            2675,
            1925,
            1225,
            875,
            600,
            350,
            200,
            75,
            25,
            0
        ];

        for (uint i = 0; i < rarity.length; i++) {
            if (randomness > rarity[i]) {
                return uint256(rarity.length - i);
            }
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }
}
