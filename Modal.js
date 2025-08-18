import React from 'react';
import Icon from './Icon';

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
export default Modal;

