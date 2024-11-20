// FamilyGroup.js
import React, { useState } from 'react';


const FamilyGroup = () => {
    const [inviteCode, setInviteCode] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateGroup = async () => {
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('access_token');
        
        try {
            const result = await createFamilyGroup(token);
            setMessage(`Your invite code is: ${result.invite_code}`);
        } catch (error) {
            setMessage('Failed to create family group.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGroup = async () => {
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('access_token');

        try {
            const result = await joinFamilyGroup(inviteCode, token);
            setMessage(result.message || result.error);
        } catch (error) {
            setMessage('Failed to join family group.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold mb-4">Family Group</h2>
            <div className="mb-4">
                <button 
                    onClick={handleCreateGroup} 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Family Group'}
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code"
                    className="border rounded p-2 mr-2"
                />
                <button 
                    onClick={handleJoinGroup} 
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Joining...' : 'Join Family Group'}
                </button>
            </div>
            {message && <p className="text-red-500">{message}</p>}
        </div>
    );
};

export default FamilyGroup;
