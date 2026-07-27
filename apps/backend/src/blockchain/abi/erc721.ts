// ERC721_ABI constant defining the standard ABI for ERC-721 tokens
//
// This ABI includes the ownerOf and safeTransferFrom functions commonly
// used in ERC-721 contracts.
//
// Source for ERC-721 detail: https://eips.ethereum.org/EIPS/eip-721
export const ERC721_ABI: string[] = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function ownerOf(uint256 tokenId) public view returns (address owner)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) public",
];
