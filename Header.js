import React from 'react';

const Header = ({ account, connectWallet }) => (
    <header className="p-4 flex justify-between items-center border-b border-gray-700">
        <div className="text-2xl font-bold text-white tracking-wider">
            <span className="text-indigo-400">V</span>otix
        </div>
        {account ? (
            <div className="bg-gray-700 text-sm text-gray-300 px-4 py-2 rounded-full">
                {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
            </div>
        ) : (
            <button
                onClick={connectWallet}
                className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
                Connect Wallet
            </button>
        )}
    </header>
);
export default Header;
