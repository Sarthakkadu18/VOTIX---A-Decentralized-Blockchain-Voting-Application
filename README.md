# VOTIX---A-Decentralized-Blockchain-Voting-Application
Votix is a secure, transparent, and decentralized voting application built on the Ethereum blockchain. It leverages smart contracts to ensure the integrity and immutability of votes, providing a trustless environment for conducting elections. 

✨ Features:

Decentralized & Secure: All voting data is stored on the Ethereum blockchain, making it tamper-proof and publicly verifiable.
Admin Control Panel: A secure interface for the election administrator to:
Register eligible voters.
Add candidates to the election.
Set, start, and end the voting period.
Real-time Results: Vote counts are updated live as transactions are confirmed on the blockchain.
Voter Transparency: Users can easily check their registration and voting status.
Wallet Integration: Connects seamlessly with MetaMask for user authentication and transaction signing.
Modern UI/UX: A sleek, dark-themed, and responsive user interface built with React and Tailwind CSS.

🛠️ Tech Stack:

Frontend: React, Ethers.js, Tailwind CSS
Blockchain: Solidity
Development Environment: Hardhat
Wallet: MetaMask
Deployment: Sepolia Testnet

🚀 Getting Started
Follow these instructions to set up and run the project locally.

Prerequisites:
Node.js (v16 or later)

MetaMask browser extension

An Alchemy or Infura account to get an RPC URL.

Sepolia test ETH in your MetaMask wallet. You can get some from a faucet.

Installation & Setup:

Clone the repository:
git clone https://github.com/your-username/votix-app.git
cd votix-app

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the project root and add your Alchemy RPC URL and MetaMask private key.

RPC_URL="YOUR_ALCHEMY_HTTPS_URL"
PRIVATE_KEY="YOUR_METAMASK_PRIVATE_KEY"

Note: Your hardhat.config.js will need to be updated to use these variables.

Usage:

1. Deploy the Smart Contract
Compile the contract:
npx hardhat compile
This creates an artifacts folder in src/ with the contract's ABI.
Deploy to Sepolia:
npx hardhat run scripts/deploy.js --network sepolia
The terminal will output the deployed contract's address. Copy this address.

2. Configure the Frontend
Open the src/App.js file.
Find the contractAddress variable and paste the copied address from the deployment step.

3. Run the Application
Start the React development server:
npm start

📂 Project Structure
<img width="875" height="620" alt="image" src="https://github.com/user-attachments/assets/243fdb41-e803-418e-9856-5fb14f0ee926" />



  
🔐 Security Note
Never commit your .env file or expose your private key in public repositories. The private key provides full control over your wallet. Ensure your .gitignore file includes .env.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
Open your    browser to http://localhost:3000 to see the application live.

📂 Project Structure
