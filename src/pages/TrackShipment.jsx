import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function TrackShipment() {

    const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchShipment = async () => {
      try {
        const docRef = doc(db, 'shipments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setShipment({ id: docSnap.id, ...docSnap.data() });
        } else {
          setShipment(null);
        }
      } catch (error) {
        console.error('Error fetching shipment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading shipment details...</p>;

  if (!shipment) return <p className="text-center mt-10 text-red-500">Shipment not found.</p>;
   const statusOrder = ['Pending', 'In Transit', 'Delivered'];
  const currentStep = statusOrder.indexOf(shipment.status);
    const estimatedDelivery = shipment.createdAt?.toDate();
  if (estimatedDelivery) {
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); 
  }
  return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Shipment Details</h2>

     
      <div className="flex justify-between mb-6">
        {statusOrder.map((step, idx) => (
          <div key={step} className="flex flex-col items-center w-1/3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold 
                ${idx <= currentStep ? 'bg-green-500' : 'bg-gray-300'}
              `}
            >
              {idx + 1}
            </div>
            <p className={`mt-2 text-sm ${idx <= currentStep ? 'text-green-600' : 'text-gray-500'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>

      <p className="text-lg font-medium mb-4">
        Estimated Delivery:{' '}
        <span className="text-blue-600">
          {estimatedDelivery?.toLocaleString() || 'N/A'}
        </span>
      </p>

      <div className="space-y-3 text-lg">
        <p><strong>Sender:</strong> {shipment.sender}</p>
        <p><strong>Receiver:</strong> {shipment.receiver}</p>
        <p><strong>Package Size:</strong> {shipment.packageSize}</p>
        <p><strong>Address:</strong> {shipment.address}</p>
        <p><strong>Phone:</strong> {shipment.phone}</p>
        <p><strong>Status:</strong> {shipment.status}</p>
        <p><strong>Created:</strong> {shipment.createdAt?.toDate().toLocaleString()}</p>
      </div>

      <div className="text-center mt-6">
        <Link to="/">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}

export default TrackShipment