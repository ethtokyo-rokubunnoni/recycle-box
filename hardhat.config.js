require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			chainId: 1337,
		},
		sepolia: {
			url: 'https://eth-sepolia.g.alchemy.com/v2/<key>',
			// accounts: [privateKey1, privateKey2, ...]
		},
		mumbai: {
			url: 'https://polygon-mumbai.g.alchemy.com/v2/<key>',
			// accounts: [privateKey1, privateKey2, ...]
		},
	},
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	paths: {
		sources: './hardhat/contracts',
		tests: './hardhat/test',
		cache: './hardhat/cache',
		artifacts: './src/artifacts',
	},
};
