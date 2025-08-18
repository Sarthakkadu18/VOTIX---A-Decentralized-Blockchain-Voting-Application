import React from 'react';
import Icon from './Icon';

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
export default VoterInfo;
