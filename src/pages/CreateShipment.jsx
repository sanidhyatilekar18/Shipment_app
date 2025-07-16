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
    const [senderPhone, setSenderPhone] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
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

        if (!sender || !receiver || !packageSize || !address || !senderPhone || !receiverPhone) {
            setError('Please fill in all fields');
            return;
        }


        const phoneRegex = /^\+?[0-9]{10,15}$/;


        if (!phoneRegex.test(senderPhone)) {
            setError('Sender phone number must be 10 digits and start with 6-9.');
            return;
        }

        if (!phoneRegex.test(receiverPhone)) {
            setError('Receiver phone number must be 10 digits and start with 6-9.');
            return;
        }

        if (otp !== generatedOtp) {
            setError('Invalid OTP. Please check your email and try again.');
            return;
        }
        try {
            const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); 
            await addDoc(collection(db, 'shipments'), {
                sender,
                receiver,
                packageSize,
                address,
                senderPhone,
                receiverPhone,
                status: 'Pending',
                createdAt: serverTimestamp(),
                estimatedDelivery,
                userId: currentUser.uid,
            });

            toast.success('Shipment created successfully!');
            setSender('');
            setReceiver('');
            setPackageSize('');
            setAddress('');
            setSenderPhone('');
            setReceiverPhone('');

            navigate('/shipments');
        } catch (error) {
            console.error("Error creating shipment:", error);
            setError('Failed to create shipment. Please try again.');
        }
    };



    return (
        <div className="flex flex-col min-h-screen  px-4 pt-18 ml-4">

               <h2 className="text-4xl w-full font-bold mb-6 text-start mt-8">Create Shipment</h2>
            <div className="w-full max-w-lg flex flex-col bg-white p-8 rounded shadow-lg mx-auto my-8">
             

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Sender Name"
                        className="w-full p-2 border-2 rounded"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Receiver Name"
                        className="w-full p-2 border-2 rounded"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                    />
                    <select
                        className="w-full p-2 border-2 rounded"
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
                        className="w-full p-2 border-2 rounded"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Phone Number "
                        className="w-full p-2 border-2 rounded"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Receiver Phone Number"
                        className="w-full p-2 border-2 rounded"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                    />
                    {verifying && (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="w-full p-2 border-2 rounded"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    )}
                    {!otpSent && (
                        <button
                            type="button"
                            onClick={generateAndSendOtp}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                        >
                            Send OTP
                        </button>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Submit Shipment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateShipment;