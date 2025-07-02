import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure this is imported
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
function CreateShipment() {
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');
    const [packageSize, setPackageSize] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate here

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear any previous error before validation and submission attempt
        setError(''); 

        if (!sender || !receiver || !packageSize || !address || !phone) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await addDoc(collection(db, 'shipments'), {
                sender,
                receiver,
                packageSize,
                address,
                phone,
                status: 'Pending',
                createdAt: serverTimestamp(),
                userId: currentUser.uid,
            });

            // On successful addition, clear the form and navigate
            setSender('');
            setReceiver('');
            setPackageSize('');
            setAddress('');
            setPhone('');
            // No need to setError('') here again as we cleared it at the beginning
            // and are navigating away immediately.

            navigate('/dashboard'); // This will redirect the user immediately
        } catch (error) {
            console.error("Error creating shipment:", error); // Log the actual error for debugging
            setError('Failed to create shipment. Please try again.'); // More user-friendly message
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-lg bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Create Shipment</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Sender Name"
                        className="w-full p-2 border rounded"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Receiver Name"
                        className="w-full p-2 border rounded"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                    />
                    <select
                        className="w-full p-2 border rounded"
                        value={packageSize}
                        onChange={(e) => setPackageSize(e.target.value)}
                    >
                        <option value="">Select Package Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Delivery Address"
                        className="w-full p-2 border rounded"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number (Optional)"
                        className="w-full p-2 border rounded"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Submit Shipment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateShipment;