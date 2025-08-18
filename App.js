import React, { useState, useEffect, useCallback } from 'react';

// This environment has ethers.js and React loaded globally.
// We can access them via the window object, so we remove the direct imports.
const { ethers } = window;

// --- SMART CONTRACT CONFIGURATION ---
const contractABI = [
    "event OwnerChanged(address indexed oldOwner, address indexed newOwner)",
    "event Voted(address indexed voter, uint256 candidateId)",
    "event VoterRegistered(address indexed voter)",
    "event VotingPeriodSet(uint256 startTime, uint256 endTime)",
    "function addCandidate(string memory _name)",
    "function castVote(uint256 _candidateId)",
    "function candidates(uint256) view returns (uint256 id, string name, uint256 voteCount)",
    "function candidatesCount() view returns (uint256)",
    "function endVoting()",
    "function getCandidates() view returns (tuple(uint256 id, string name, uint256 voteCount)[])",
    "function hasVoted(address) view returns (bool)",
    "function isRegistered(address) view returns (bool)",
    "function owner() view returns (address)",
    "function registerVoter(address _voterAddress)",
    "function setVotingPeriod(uint256 _durationInMinutes)",
    "function startVoting()",
    "function transferOwnership(address newOwner)",
    "function votingEnded() view returns (bool)",
    "function votingEndTime() view returns (uint256)",
    "function votingStarted() view returns (bool)",
    "function votingStartTime() view returns (uint256)"
];

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // IMPORTANT: Replace with your deployed contract address

// --- MOCK DATA FOR UI ---
const MOCK_CANDIDATES = [
    { id: 1, name: "Elara Vance", slogan: "A future forged in innovation.", imageUrl: "https://placehold.co/400x400/1a202c/ffffff?text=EV" },
    { id: 2, name: "Kaelen Reed", slogan: "Progress through unity.", imageUrl: "https://placehold.co/400x400/2d3748/ffffff?text=KR" },
    { id: 3, name: "Seraphina Croft", slogan: "Leadership with integrity.", imageUrl: "https://placehold.co/400x400/4a5568/ffffff?text=SC" },
];


// --- UI HELPER COMPONENTS ---

const Icon = ({ path }) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!endTime || endTime === 0) return;
        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const distance = endTime - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (60 * 60 * 24)),
                hours: Math.floor((distance % (60 * 60 * 24)) / (60 * 60)),
                minutes: Math.floor((distance % (60 * 60)) / 60),
                seconds: Math.floor(distance % 60)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <div className="flex space-x-4 text-center">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{String(value).padStart(2, '0')}</span>
                    <span className="text-xs uppercase text-gray-400">{unit}</span>
                </div>
            ))}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 m-4 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <Icon path="M6 18L18 6M6 6l12 12" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

// --- MAIN UI COMPONENTS ---

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

const StatusDashboard = ({ status, endTime }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col justify-center items-center">
            <h4 className="text-sm uppercase text-gray-400 mb-2">Election Status</h4>
            <p className={`text-2xl font-bold ${
                status === 'Live' ? 'text-green-400' : 
                status === 'Ended' ? 'text-red-400' : 'text-yellow-400'
            }`}>{status}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col justify-center items-center md:col-span-2">
            <h4 className="text-sm uppercase text-gray-400 mb-2">
                {status === 'Live' ? 'Time Remaining' : status === 'Ended' ? 'Voting Has Ended' : 'Voting Not Started'}
            </h4>
            {status === 'Live' && <Timer endTime={endTime} />}
        </div>
    </div>
);

const VoterInfo = ({ status }) => (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 mb-8">
        <h3 className="text-lg font-bold text-white mb-3">Your Voting Status</h3>
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
                <Icon path={status.isRegistered ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                <span className={status.isRegistered ? 'text-green-400' : 'text-red-400'}>
                    {status.isRegistered ? 'Registered' : 'Not Registered'}
                </span>
            </div>
             <div className="flex items-center space-x-2">
                <Icon path={status.hasVoted ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                <span className={status.hasVoted ? 'text-blue-400' : 'text-yellow-400'}>
                    {status.hasVoted ? 'Voted' : 'Not Voted'}
                </span>
            </div>
        </div>
    </div>
);

const CandidateList = ({ candidates, status, voterStatus, contract, openModal, refreshData, showNotification }) => {
    const totalVotes = candidates.reduce((acc, c) => acc + c.voteCount, 0);
    const winner = status === 'Ended' && candidates.length > 0
        ? candidates.reduce((prev, current) => (prev.voteCount > current.voteCount) ? prev : current)
        : null;

    const castVote = async (candidateId) => {
        if (!contract || !voterStatus.isRegistered || voterStatus.hasVoted) {
            showNotification("You are not eligible to vote or have already voted.", "error");
            return;
        }
        
        openModal(
            "Confirm Your Vote",
            `You are voting for ${candidates.find(c => c.id === candidateId).name}. This action is irreversible.`,
            async () => {
                const tx = await contract.castVote(candidateId);
                await tx.wait();
                showNotification("Your vote has been cast successfully!", "success");
                refreshData();
            }
        );
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white text-center mb-8">Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {candidates.map(candidate => {
                    const votePercentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
                    const isWinner = winner && winner.id === candidate.id;

                    return (
                        <div key={candidate.id} className={`bg-gray-800 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                            isWinner ? 'border-yellow-400 shadow-yellow-400/20' : 'border-gray-700 hover:border-indigo-500'
                        } transform hover:-translate-y-2`}>
                            <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-56 object-cover" />
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white">{candidate.name}</h3>
                                <p className="text-gray-400 mt-1 italic">"{candidate.slogan}"</p>
                                
                                <div className="mt-4">
                                    <div className="flex justify-between items-center text-sm text-gray-300 mb-1">
                                        <span>Votes: {candidate.voteCount}</span>
                                        <span>{votePercentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${votePercentage}%` }}></div>
                                    </div>
                                </div>

                                {status === 'Live' && (
                                    <button 
                                        onClick={() => castVote(candidate.id)}
                                        disabled={!voterStatus.isRegistered || voterStatus.hasVoted}
                                        className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500"
                                    >
                                        {voterStatus.hasVoted ? 'You Have Voted' : 'Cast Vote'}
                                    </button>
                                )}
                                {isWinner && (
                                    <div className="mt-6 w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg text-center">
                                        WINNER
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AdminPanel = ({ contract, openModal, refreshData, showNotification }) => {
    const [voterAddress, setVoterAddress] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [electionDuration, setElectionDuration] = useState('');

    const handleAdminAction = async (action, ...args) => {
        if (!contract) return;
        
        const actionMap = {
            registerVoter: { func: contract.registerVoter, success: "Voter registered." },
            addCandidate: { func: contract.addCandidate, success: "Candidate added." },
            setVotingPeriod: { func: contract.setVotingPeriod, success: "Voting period set." },
            startVoting: { func: contract.startVoting, success: "Voting started!" },
            endVoting: { func: contract.endVoting, success: "Voting ended." },
        };
        
        const { func, success } = actionMap[action];
        
        openModal(
            `Confirm ${action.replace(/([A-Z])/g, ' $1').trim()}`,
            `This will send a transaction to the blockchain.`,
            async () => {
                const tx = await func(...args);
                await tx.wait();
                showNotification(success, "success");
                refreshData();
            }
        );
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg mt-8">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-600 pb-2 flex items-center">
                <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <span className="ml-2">Admin Control Panel</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Register Voter</label>
                    <div className="flex space-x-2">
                        <input type="text" value={voterAddress} onChange={(e) => setVoterAddress(e.target.value)} placeholder="0x..." className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={() => handleAdminAction('registerVoter', voterAddress)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">Register</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Add Candidate</label>
                    <div className="flex space-x-2">
                        <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} placeholder="Candidate Name" className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={() => handleAdminAction('addCandidate', candidateName)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500">Add</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Set Voting Duration (Minutes)</label>
                    <div className="flex space-x-2">
                        <input type="number" value={electionDuration} onChange={(e) => setElectionDuration(e.target.value)} placeholder="Minutes" className="w-full bg-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button onClick={() => handleAdminAction('setVotingPeriod', electionDuration)} className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500">Set</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-300">Election Control</label>
                    <div className="flex space-x-2">
                        <button onClick={() => handleAdminAction('startVoting')} className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500">Start</button>
                        <button onClick={() => handleAdminAction('endVoting')} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500">End</button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- ROOT APP COMPONENT ---

export default function App() {
    // --- STATE MANAGEMENT ---
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    
    // Election State
    const [candidates, setCandidates] = useState([]);
    const [electionStatus, setElectionStatus] = useState("Not Started");
    const [votingEndTime, setVotingEndTime] = useState(0);
    const [voterStatus, setVoterStatus] = useState({ isRegistered: false, hasVoted: false });

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', body: null });

    // --- NOTIFICATION HANDLER ---
    const showNotification = (message, type = 'success', duration = 5000) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), duration);
    };

    // --- BLOCKCHAIN INTERACTIONS ---

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
                await web3Provider.send("eth_requestAccounts", []);
                const signer = web3Provider.getSigner();
                const address = await signer.getAddress();
                
                setProvider(web3Provider);
                setAccount(address);

                const network = await web3Provider.getNetwork();
                if (network.chainId !== 11155111) { // Sepolia Testnet Chain ID
                    showNotification("Please switch to the Sepolia test network.", "error");
                } else {
                    showNotification("Wallet connected successfully!", "success");
                }
            } catch (error) {
                console.error("Wallet connection failed:", error);
                showNotification("Wallet connection failed. Please try again.", "error");
            }
        } else {
            showNotification("MetaMask is not installed. Please install it to use this app.", "error");
        }
    };
    
    const fetchContractData = useCallback(async () => {
        if (!provider || !account) return;
        setIsLoading(true);
        try {
            const signer = provider.getSigner();
            const votixContract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(votixContract);

            const owner = await votixContract.owner();
            setIsAdmin(owner.toLowerCase() === account.toLowerCase());

            const [
                fetchedCandidates, hasStarted, hasEnded, endTime, isRegistered, hasVoted
            ] = await Promise.all([
                votixContract.getCandidates(),
                votixContract.votingStarted(),
                votixContract.votingEnded(),
                votixContract.votingEndTime(),
                votixContract.isRegistered(account),
                votixContract.hasVoted(account)
            ]);
            
            const formattedCandidates = fetchedCandidates.map((c) => ({
                id: c.id.toNumber(),
                name: c.name,
                voteCount: c.voteCount.toNumber(),
                slogan: MOCK_CANDIDATES.find(mc => mc.name === c.name)?.slogan || "Join the movement.",
                imageUrl: MOCK_CANDIDATES.find(mc => mc.name === c.name)?.imageUrl || `https://placehold.co/400x400/1a202c/ffffff?text=${c.name.charAt(0)}`
            }));
            
            setCandidates(formattedCandidates);

            if (hasEnded) setElectionStatus("Ended");
            else if (hasStarted) setElectionStatus("Live");
            else setElectionStatus("Not Started");
            
            setVotingEndTime(endTime.toNumber());
            setVoterStatus({ isRegistered, hasVoted });

        } catch (error) {
            console.error("Error fetching contract data:", error);
            if (error.message.includes("contract not deployed")) {
                 showNotification("Contract not found. Check address and network.", "error");
            } else {
                 showNotification("Failed to load data from the blockchain.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    }, [provider, account]);

    useEffect(() => {
        if (provider && account) {
            fetchContractData();
        } else {
            setIsLoading(false);
        }
    }, [provider, account, fetchContractData]);
    
    useEffect(() => {
        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            } else {
                setAccount(null);
                setProvider(null);
                setContract(null);
            }
        };
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            }
        }
    }, []);

    const openModalWithTransaction = (title, bodyText, onConfirm) => {
        setModalContent({
            title,
            body: (
                <div className="text-gray-300">
                    <p className="mb-6">{bodyText}</p>
                    <div className="flex justify-end space-x-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
                        <button 
                            onClick={async () => {
                                setIsModalOpen(false);
                                setIsLoading(true);
                                try {
                                    await onConfirm();
                                } catch (error) {
                                    console.error("Transaction failed:", error);
                                    showNotification(error?.data?.message || error.message || "Transaction failed.", "error");
                                } finally {
                                    setIsLoading(false);
                                }
                            }} 
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )
        });
        setIsModalOpen(true);
    };

    // Simple CSS loader to replace BarLoader
    const Loader = () => (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Communicating with the blockchain...</p>
        </div>
    );

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200 font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
            <div className="relative z-10">
                <Header account={account} connectWallet={connectWallet} />
                
                {isLoading && <Loader />}

                {notification.show && (
                    <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {notification.message}
                    </div>
                )}
                
                <main className="container mx-auto px-4 py-8">
                    {!account ? (
                        <LandingPage connectWallet={connectWallet} />
                    ) : (
                        <>
                            <StatusDashboard status={electionStatus} endTime={votingEndTime} />
                            <VoterInfo status={voterStatus} />
                            <CandidateList 
                                candidates={candidates} 
                                status={electionStatus} 
                                voterStatus={voterStatus}
                                contract={contract}
                                openModal={openModalWithTransaction}
                                refreshData={fetchContractData}
                                showNotification={showNotification}
                            />
                            {isAdmin && <AdminPanel 
                                contract={contract}
                                openModal={openModalWithTransaction}
                                refreshData={fetchContractData}
                                showNotification={showNotification}
                            />}
                        </>
                    )}
                </main>
                
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalContent.title}>
                    {modalContent.body}
                </Modal>
            </div>
        </div>
    );
}
