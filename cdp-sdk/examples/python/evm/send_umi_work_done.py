import getpass
import webbrowser
from web3 import Web3

UMI_DEVNET_RPC = "https://devnet.moved.network"
UMI_DEVNET_CHAIN_ID = 42069
BLOCK_EXPLORER_BASE_URL = "https://devnet.explorer.moved.network/transaction/"

SENDER_ADDRESS = "add yours"
RECIPIENT_ADDRESS = "add yours"
AMOUNT_ETH = 0.001
GAS_LIMIT = 25000
MAX_FEE_PER_GAS_GWEI = 2
MAX_PRIORITY_FEE_PER_GAS_GWEI = 1

w3 = Web3(Web3.HTTPProvider(UMI_DEVNET_RPC))

def format_tx_hash(tx_hash):
    """Ensure transaction hash starts with 0x"""
    if isinstance(tx_hash, bytes):
        return '0x' + tx_hash.hex()
    elif isinstance(tx_hash, str):
        return tx_hash if tx_hash.startswith('0x') else '0x' + tx_hash
    return str(tx_hash)

def open_block_explorer(tx_hash):
    """Open the transaction in the block explorer"""
    formatted_hash = format_tx_hash(tx_hash)
    explorer_url = f"{BLOCK_EXPLORER_BASE_URL}{formatted_hash}"
    print(f"Block Explorer URL: {explorer_url}")
    
    try:
        webbrowser.open(explorer_url)
        print("Opening transaction in your default browser...")
    except Exception as e:
        print(f"Could not automatically open browser: {e}")
        print("You can manually copy the URL above to view the transaction.")

if __name__ == "__main__":
    print("Type 'work done' to send payment...")
    while True:
        user_input = input().strip().lower()
        if user_input == "work done":
            break
    
    private_key = getpass.getpass("Enter your main account private key (will not be shown): ").strip()
    
    try:
        sender = w3.eth.account.from_key(private_key)
        if sender.address.lower() != SENDER_ADDRESS.lower():
            print(f"Warning: Private key does not match sender address!\nPrivate key address: {sender.address}\nExpected: {SENDER_ADDRESS}")
     
        balance_wei = w3.eth.get_balance(sender.address)
        balance_eth = w3.from_wei(balance_wei, 'ether')
        print(f"Sender balance: {balance_eth} ETH")
        
        max_fee_per_gas = w3.to_wei(MAX_FEE_PER_GAS_GWEI, 'gwei')
        max_priority_fee_per_gas = w3.to_wei(MAX_PRIORITY_FEE_PER_GAS_GWEI, 'gwei')
        est_gas_cost = GAS_LIMIT * (max_fee_per_gas + max_priority_fee_per_gas)
        total_cost_wei = w3.to_wei(AMOUNT_ETH, 'ether') + est_gas_cost
        
        if balance_wei < total_cost_wei:
            print(f"Warning: Insufficient funds! You need at least {w3.from_wei(total_cost_wei, 'ether')} ETH (including gas)")
            proceed = input("Do you want to continue anyway? (y/N): ").strip().lower()
            if proceed != 'y':
                print("Aborted.")
                exit(0)
        
        nonce = w3.eth.get_transaction_count(sender.address)
        tx = {
            'to': RECIPIENT_ADDRESS,
            'value': w3.to_wei(AMOUNT_ETH, 'ether'),
            'gas': GAS_LIMIT,
            'maxFeePerGas': max_fee_per_gas,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,
            'nonce': nonce,
            'chainId': UMI_DEVNET_CHAIN_ID,
            'type': 2,
        }
        
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        # Format and display transaction hash
        formatted_tx_hash = format_tx_hash(tx_hash)
        print(f"Transaction sent! Hash: {formatted_tx_hash}")
        
        print("Waiting for transaction confirmation...")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Transaction confirmed in block {receipt.blockNumber}")
        print(f"Transaction status: {'Success' if receipt.status == 1 else 'Failed'}")

        if receipt.status == 1:
            print("\n" + "="*50)
            open_block_explorer(formatted_tx_hash)
            print("="*50)
        
    except Exception as e:
        print(f"Error: {e}")