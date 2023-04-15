import { Button } from '@chakra-ui/react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Write } from './write';
import { Write2 } from './write2';

export const Write3 = ({ tx }) => {
	console.log(tx);
	// tx.map((e,i)=>{
	//   return
	// })
	const { config } = usePrepareContractWrite({
		address: tx[0].address,
		abi: tx[0].abi,
		functionName: tx[0].method,
		args: tx[0].args,
	});
	const { status, data, isLoading, isSuccess, write } = useContractWrite(config);

	return (
		<div>
			<Button onClick={() => write?.()}>{tx[0].method}</Button>
			{status}
			{isLoading && <div>Check Wallet</div>}
			{isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
			{isSuccess && (
				<>
					<Write2 tx={tx[1]} />
				</>
			)}
		</div>
	);
};
