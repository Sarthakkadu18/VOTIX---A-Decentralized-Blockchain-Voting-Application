import React, { useState, useEffect } from 'react';

const Timer = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!endTime) return;
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
export default Timer;