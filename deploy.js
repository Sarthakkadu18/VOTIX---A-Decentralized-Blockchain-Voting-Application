// This script deploys the Votix.sol contract to the blockchain.
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const Votix = await hre.ethers.getContractFactory("Votix");
  const votix = await Votix.deploy();

  await votix.deployed();

  console.log("Votix contract deployed to:", votix.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
