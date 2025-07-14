import { bcs } from '@mysten/bcs';
import { ethers } from 'ethers';
import { createWalletClient, custom, defineChain } from 'viem';
import { walletActionsL2 } from 'viem/op-stack';
import abi from '../abi/ProposalManager.json';

export const PROPOSAL_MANAGER_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138';

const FUNCTION_SERIALIZER = bcs.enum('SerializableTransactionData', {
  EoaBaseTokenTransfer: null,
  ScriptOrDeployment: null,
  EntryFunction: null,
  L2Contract: null,
  EvmContract: bcs.byteVector(),
});

const serializeFunction = (data: string): `0x${string}` => {
  const code = Uint8Array.from(Buffer.from(data.replace('0x', ''), 'hex'));
  const evmFunction = FUNCTION_SERIALIZER.serialize({ EvmContract: code }).toBytes();
  return ('0x' + Buffer.from(evmFunction).toString('hex')) as `0x${string}`;
};

export const devnet = defineChain({
  id: 42069,
  sourceId: 42069,
  name: 'Umi',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.uminetwork.com'],
    },
  },
});

export const walletClient = () =>
  createWalletClient({
    chain: devnet,
    transport: custom(window.ethereum!),
  }).extend(walletActionsL2());

export const sendProposalTx = async (freelancer: string, details: string) => {
  const contract = new ethers.Contract(PROPOSAL_MANAGER_ADDRESS, abi);
  const tx = await contract.getFunction('sendProposal').populateTransaction(freelancer, details);
  const data = serializeFunction(tx.data!);
  const account = (await window.ethereum!.request({ method: 'eth_requestAccounts' }))[0];
  const hash = await walletClient().sendTransaction({
    account,
    to: PROPOSAL_MANAGER_ADDRESS as `0x${string}`,
    data,
  });
  return hash;
}; 