// ERC20_ABI constant defining the standard ABI for ERC-20 tokens
//
// This ABI includes the balanceOf and transfer functions commonly
// used in ERC-20 contracts.
//
// Source for ERC-20 detail: https://eips.ethereum.org/EIPS/eip-20
export const ERC20_ABI: string[] = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function balanceOf(address owner) public view returns (uint256 balance)",
    "function transfer(address to, uint256 amount) public returns (bool success)",
];
