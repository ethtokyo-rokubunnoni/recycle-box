import {
	Button,
	Checkbox,
	Stack,
	Box,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Spinner,
	HStack,
} from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import { multicall } from '@/helper/multicall';
import { useAccount, useProvider } from 'wagmi';
import { Write } from './write';
import { Write2 } from './write2';
import { Write3 } from './write3';

const nftaddress = '0x4e445b6f01236d6647F959F06CEebd7C076d387b';
const pooladdress = '0xA48866964ff3fb9A6DF7BF69ef004572e4505F00';

const approveABI = {
	name: 'approve',
	type: 'function',
	inputs: [
		{ name: '_spender', type: 'address' },
		{ name: '_value', type: 'uint256' },
	],
	outputs: [{ name: '', type: 'bool' }],
	constant: false,
	payable: false,
	stateMutability: 'nonpayable',
};
const depositABI = {
	inputs: [
		{
			internalType: 'address',
			name: 'tokenAddress',
			type: 'address',
		},
		{
			internalType: 'uint256',
			name: 'amount',
			type: 'uint256',
		},
	],
	name: 'deposit',
	outputs: [],
	stateMutability: 'nonpayable',
	type: 'function',
};
const nftABI = {
	inputs: [
		{
			internalType: 'address',
			name: 'to',
			type: 'address',
		},
	],
	name: 'mintRandom',
	outputs: [],
	stateMutability: 'nonpayable',
	type: 'function',
};

export function CheckBox({ tokenList }) {
	const checked = [];
	if (tokenList) {
		Object.keys(tokenList).map((keyname, i) => {
			let n = tokenList[keyname].tokens.length;
			checked.push(new Array(n).fill(false));
		});
	}

	const [isRecycled, setIsRecycled] = useState(false);
	const { address } = useAccount();
	const provider = useProvider();

	const checkAllowance = async (contractCallContext, tokens) => {
		let ifallowance = [];
		const _multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
		const results = await _multicall.call(contractCallContext);
		let calls = results.results;
		let allowances = [];
		Object.keys(calls).map((keyname) => {
			allowances.push(calls[keyname].callsReturnContext[0].returnValues[0]);
		});
		tokens.map((e, i) => {
			let amount = Utils.formatUnits(e.balance.tokenBalance, e.data.decimals);
			let allowance = Utils.formatEther(parseInt(allowances[i].hex).toString());
			ifallowance.push(+allowance >= +amount);
		});
		return ifallowance;
	};

	// const [approveTxns, setApproveTxns] = useState([]);
	// const [depositTxns, setDepositTxns] = useState([]);
	// const [nftTxns, setNFTTxns] = useState([]);
	const [txns, setTxns] = useState([]);

	const recycle = async () => {
		// if (!isRecycled) {
		setIsRecycled(true);
		let _recycleTokens = [];

		Object.keys(tokenList).map((keyname, i) => {
			tokenList[keyname].tokens.map((e, j) => {
				if (checked[i][j]) {
					console.log(e);
					_recycleTokens.push(e);
				}
			});
		});

		const contractCallContext = multicall(_recycleTokens, address);
		const ifallowance = await checkAllowance(contractCallContext, _recycleTokens);
		console.log(ifallowance);

		// let _approveTxns = [];
		// let _depositTxns = [];
		// let _nftTxns = [];
		let _txns = [];

		_recycleTokens.map((e, i) => {
			let _approve_amount = '11579208269983129639935';
			let approve_amount = ethers.utils.parseEther(_approve_amount);
			let tokenaddress = e.balance.contractAddress;
			let txs = [];
			let tx;

			if (!ifallowance[i]) {
				tx = {
					address: tokenaddress,
					abi: [approveABI],
					method: 'approve',
					args: [pooladdress, approve_amount],
				};
				// _approveTxns.push(tx);
				txs.push(tx);
			}
			let _amount = Utils.formatUnits(e.balance.tokenBalance);
			let amount = ethers.utils.parseEther(_amount);
			let tx2 = [];
			tx = {
				address: pooladdress,
				abi: [depositABI],
				method: 'deposit',
				args: [tokenaddress, amount],
			};
			// _depositTxns.push(tx);
			tx2.push(tx);

			tx = {
				address: nftaddress,
				abi: [nftABI],
				method: 'mintRandom',
				args: [address],
			};
			// _nftTxns.push(tx);
			tx2.push(tx);
			txs.push(tx2);

			_txns.push(txs);
		});

		// console.log(_approveTxns);
		// setApproveTxns(_approveTxns);
		// console.log(_depositTxns);
		// setDepositTxns(_depositTxns);
		// setNFTTxns(_nftTxns);
		setTxns(_txns);
		setIsOpen(true);
		// }
	};

	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<HStack>
				{tokenList &&
					Object.keys(tokenList).map((keyname, i) => {
						let n = tokenList[keyname].tokens.length;
						const [checkedItems, setCheckedItems] = useState(new Array(n).fill(false));
						const allChecked = checkedItems.every(Boolean);
						const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
						checked[i] = checkedItems;

						return (
							<>
								<Box p={10} minH={'150px'} bg={'gray.500'} rounded={'xl'}>
									<Checkbox
										key={keyname}
										isChecked={allChecked}
										isIndeterminate={isIndeterminate}
										isDisabled={!n}
										onChange={(e) =>
											setCheckedItems([e.target.checked, e.target.checked, e.target.checked])
										}
									>
										{keyname}
									</Checkbox>
									<Stack pl={6} mt={1} spacing={1}>
										{tokenList[keyname].tokens.map((e, j) => {
											return (
												<Checkbox
													key={e.symbol}
													isChecked={checkedItems[j]}
													onChange={(a) => {
														setCheckedItems((checkedItems) => {
															return checkedItems.map((item, k) => {
																return k === j ? a.target.checked : item;
															});
														});
													}}
												>
													{e.data.symbol}
													{Utils.formatUnits(e.balance.tokenBalance, e.data.decimals)}
												</Checkbox>
											);
										})}
									</Stack>
								</Box>
							</>
						);
					})}
			</HStack>

			<Box mt={6}>
				<Button onClick={() => recycle()}>Recycle</Button>
			</Box>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent position='absolute' top='200px'>
					<Box align='center'>
						<ModalHeader>Recycling Now</ModalHeader>
						<ModalCloseButton />
						<Spinner
							thickness='4px'
							speed='0.65s'
							emptyColor='gray.200'
							color='blue.500'
							size='xl'
						/>
						<ModalBody>
							<Text>Wait for a second... </Text>

							<Box>
								{/* {approveTxns.map((tx, i) => {
									return <Write tx={tx} />;
								})}

								{depositTxns.map((tx, i) => {
									return <Write tx={tx} />;
								})}

								{nftTxns.map((tx, i) => {
									return <Write tx={tx} />;
								})} */}
								{txns.map((tx, i) => {
									console.log(tx.length);
									if (tx.length == 1) return <Write2 tx={tx} />;
									return <Write3 tx={tx} />;
								})}
							</Box>
						</ModalBody>
					</Box>
					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
