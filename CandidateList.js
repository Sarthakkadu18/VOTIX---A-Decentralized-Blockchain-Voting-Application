import React from 'react';

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
export default CandidateList;

