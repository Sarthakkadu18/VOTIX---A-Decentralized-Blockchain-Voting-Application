// --- hardhat.config.js ---
require("@nomicfoundation/hardhat-toolbox");

// You need to export an object to set up your config
// Go to [https://hardhat.org/config/](https://hardhat.org/config/) to learn more

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './src/artifacts', // Important: this is where the ABI will be generated
  },
  networks: {
    // Configure your testnet here (e.g., Sepolia)
    sepolia: {
      url: "YOUR_ALCHEMY_OR_INFURA_API_URL", // Replace with your RPC URL
      accounts: ["YOUR_METAMASK_PRIVATE_KEY"] // Replace with your wallet's private key
    }
  }
};

// --- tailwind.config.js ---
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
