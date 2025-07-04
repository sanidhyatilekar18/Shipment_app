import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

function CreateShipment() {
    const [sender, setSender] = useState('');
    const [receiver, setReceiver] = useState('');
    const [packageSize, setPackageSize] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [verifying, setVerifying] = useState(false);

    const navigate = useNavigate();
    const generateAndSendOtp = () => {
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(randomOtp);

        const templateParams = {
            otp: randomOtp,
            to_email: currentUser.email,
        };

        emailjs.send('service_s554lnl', 'template_uwdiwtt', templateParams, 'VctrwKFlDNjdmVapy')
            .then(() => {
                toast.success('OTP sent to your email');
                setOtpSent(true);
                            setVerifying(true);
            })
            .catch((error) => {
                console.error('Failed to send OTP:', error);
                toast.error('Failed to send OTP');
            });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!sender || !receiver || !packageSize || !address || !phone) {
            setError('Please fill in all fields');
            return;
        }

       
        if (otp !== generatedOtp) {
            setError('Invalid OTP. Please check your email and try again.');
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

            toast.success('Shipment created successfully!');
            setSender('');
            setReceiver('');
            setPackageSize('');
            setAddress('');
            setPhone('');


            navigate('/shipments');
        } catch (error) {
            console.error("Error creating shipment:", error);
            setError('Failed to create shipment. Please try again.');
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
                    {verifying && (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-2 border rounded"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    )}
                    {!otpSent && (
                        <button
                            type="button"
                            onClick={generateAndSendOtp}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Send OTP
                        </button>
                    )}

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