import React, { useState } from 'react';
import Icon from './Icon';

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
export default AdminPanel;

