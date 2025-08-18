import React from 'react';
import Timer from './Timer';

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
export default StatusDashboard;

