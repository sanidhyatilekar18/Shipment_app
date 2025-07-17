import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const q = query(
          collection(db, 'shipments'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShipments(data);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [currentUser]);

  const handleCancel = async (shipment) => {
    const { id, createdAt, status } = shipment;

    if (!canCancel(createdAt)) {
      toast.error("Shipment can only be cancelled within 2 hours of creation.");
      return;
    }

    if (status !== 'Pending') {
      toast.info("Only pending shipments can be cancelled.");
      return;
    }

    try {
      const shipmentRef = doc(db, 'shipments', id);
      await updateDoc(shipmentRef, { status: 'Cancelled' });

      setShipments(prev =>
        prev.map(s => (s.id === id ? { ...s, status: 'Cancelled' } : s))
      );
      toast.success("Shipment cancelled successfully.");
    } catch (error) {
      toast.error("Failed to cancel shipment.");
      console.error(error);
    }
  };


  const canCancel = (createdAt) => {
    if (!createdAt) return false;
    const now = Date.now();
    const createdTime = createdAt.toDate().getTime();
    const diff = now - createdTime;
    return diff <= 2 * 60 * 60 * 1000;
  };

  if (loading) return <p className="text-center mt-10">Loading shipments...</p>;

  return (
    <div className="p-6 max-w-screen mx-auto flex flex-col ">
      <h2 className="text-4xl font-bold mb-4 mt-20 text-start">My Shipments</h2>
      <div className="p-6 max-w-screen mx-auto flex flex-col items-center">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : shipments.length === 0 ? (
          <p className="text-center">
            No shipments found. <Link className="text-blue-600 underline" to="/create-shipment">Create one</Link>.
          </p>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 w-[350px] sm:w-[750px] lg:w-350 mt-6 justify-center">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
              <div className="mb-2">
                <p className="text-sm text-gray-500 font-semibold">Sender:</p>
                <p className="text-lg">{shipment.sender}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500 font-semibold">Receiver:</p>
                <p className="text-lg">{shipment.receiver}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500 font-semibold">Package:</p>
                <p className="text-lg">{shipment.packageSize}</p>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500 font-semibold">Address:</p>
                <p className="text-lg break-words">{shipment.address}</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Sender Phone:</p>
                  <p className="text-md">{shipment.senderPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Receiver Phone:</p>
                  <p className="text-md">{shipment.receiverPhone}</p>
                </div>
              </div>

              <div className="mb-2">
                <p className="text-sm text-gray-500 font-semibold">Status:</p>
                <p className={`text-md font-semibold ${shipment.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {shipment.status}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 font-semibold">Created At:</p>
                <p className="text-md">{shipment.createdAt?.toDate().toLocaleString() || "—"}</p>
              </div>

              <div className="flex justify-between items-center gap-4">
                <Link to={`/shipment/${shipment.id}`}>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Track</button>
                </Link>

                <button
                  onClick={() => handleCancel(shipment)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                  disabled={shipment.status === "Delivered"}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
    </div>
  );
}

export default Shipments;
