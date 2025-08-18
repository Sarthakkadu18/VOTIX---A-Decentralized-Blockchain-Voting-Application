import React from 'react';

const LandingPage = ({ connectWallet }) => (
    <div className="text-center flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-5xl font-extrabold text-white mb-4">Welcome to <span className="text-indigo-400">Votix</span></h1>
        <p className="text-lg text-gray-300 max-w-2xl mb-8">A secure, transparent, and decentralized voting platform. Connect your wallet to participate.</p>
        <button
            onClick={connectWallet}
            className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105 text-lg"
        >
            Connect Your Wallet
        </button>
    </div>
);
export default LandingPage;
