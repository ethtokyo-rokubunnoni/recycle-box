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
import { useState } from 'react';
import { MakeTx } from './makeTx';
import { ethers } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import { multicall } from '@/helper/multicall';
import { useAccount, useProvider } from 'wagmi';
import { Write } from './write';

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
	constant: false,
	inputs: [
		{ name: '_from', type: 'address' },
		{ name: '_to', type: 'address' },
		{ name: '_value', type: 'uint256' },
	],
	name: 'transferFrom',
	outputs: [{ name: '', type: 'bool' }],
	payable: false,
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

	const [approveTxns, setApproveTxns] = useState([]);
	const [depositTxns, setDepositTxns] = useState([]);

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
		// setRecycleTokens(_recycleTokens);

		const contractCallContext = multicall(_recycleTokens, address);
		const ifallowance = await checkAllowance(contractCallContext, _recycleTokens);
		console.log(ifallowance);

		let _approveTxns = [];
		let _depositTxns = [];

		_recycleTokens.map((e, i) => {
			let _approve_amount = '11579208269983129639935';
			let approve_amount = ethers.utils.parseEther(_approve_amount);
			let tokenaddress = e.balance.contractAddress;
			let tx;
			if (!ifallowance[i]) {
				tx = {
					address: tokenaddress,
					abi: [approveABI],
					method: 'approve',
					args: [pooladdress, approve_amount],
				};
				_approveTxns.push(tx);
			}
			let _amount = Utils.formatUnits(e.balance.tokenBalance);
			let amount = ethers.utils.parseEther(_amount);
			tx = {
				address: tokenaddress,
				abi: [depositABI],
				method: 'transferFrom',
				args: [address, pooladdress, amount],
			};
			_depositTxns.push(tx);
		});

		console.log(_approveTxns);
		setApproveTxns(_approveTxns);
		console.log(_depositTxns);
		setDepositTxns(_depositTxns);
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
													{e.data.symbol}{' '}
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
								{approveTxns.map((tx, i) => {
									return <Write tx={tx} />;
								})}

								{depositTxns.map((tx, i) => {
									return <Write tx={tx} />;
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
