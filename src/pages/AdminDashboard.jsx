import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Papa from 'papaparse';


function AdminDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStatuses, setUpdatedStatuses] = useState({});
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');




  useEffect(() => {
    const cleanUpExpiredShipments = async () => {
      try {
        const q = query(collection(db, 'shipments'));
        const snapshot = await getDocs(q);
        const now = new Date();

        const deletions = snapshot.docs.filter(docSnap => {
          const data = docSnap.data();
          const estDate = data.estimatedDelivery?.toDate(); // Check if exists
          return data.status === 'Delivered' || (estDate && estDate < now);
        });

        for (const docSnap of deletions) {
          await deleteDoc(doc(db, 'shipments', docSnap.id));
          console.log(`Deleted shipment: ${docSnap.id}`);
        }

      } catch (error) {
        console.error('Error during auto-deletion:', error);
      } finally {
        fetchShipments();
      }
    };

    cleanUpExpiredShipments();
  }, []);

  const exportToCSV = () => {
    if (shipments.length === 0) {
      toast.warning("No shipments to export");
      return;
    }

    const formattedData = shipments.map((s) => ({
      Sender: s.sender,
      Receiver: s.receiver,
      PackageSize: s.packageSize,
      Address: s.address,
      SenderPhone: s.senderPhone,
      ReceiverPhone: s.receiverPhone,
      Status: s.status,
      CreatedAt: s.createdAt?.toDate().toLocaleString() || '',
      EstimatedDelivery: s.estimatedDelivery?.toDate().toLocaleDateString() || '',
    }));

    const csv = Papa.unparse(formattedData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shipment_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const fetchShipments = async () => {
    try {
      const q = query(collection(db, 'shipments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShipments(data);
    } catch (error) {
      toast.error('Failed to fetch shipments');
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shipmentId) => {
    const newStatus = updatedStatuses[shipmentId];
    if (!newStatus) return;

    try {
      const shipmentRef = doc(db, 'shipments', shipmentId);

      if (newStatus === 'Delivered') {
        await deleteDoc(shipmentRef);
        toast.success('Shipment marked as Delivered and deleted.');
      } else {
        await updateDoc(shipmentRef, {
          status: newStatus
        });
        toast.success('Status updated successfully');
      }

      fetchShipments();
    } catch (error) {
      toast.error('Error updating or deleting shipment');
      console.error('Error updating or deleting shipment:', error);
    }
  };

 const filteredShipments = shipments
  .filter((s) => statusFilter === 'All' || s.status === statusFilter)
  .filter((s) => !startDate || s.createdAt?.toDate() >= new Date(startDate))
  .filter((s) => {
    if (!endDate) return true;
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return s.createdAt?.toDate() <= end;
  })
  .filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.sender?.toLowerCase().includes(term) ||
      s.receiver?.toLowerCase().includes(term) ||
      s.senderPhone?.includes(term) ||
      s.receiverPhone?.includes(term)
    );
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShipments = filteredShipments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);


  if (loading) return <p className="text-center mt-10">Loading shipments...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel - All Shipments</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-1"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
        </select>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded p-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded p-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Search (Name or Phone)</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              placeholder="Search by sender, receiver, or phone"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Export CSV
            </button>
          </div>
        </div>

      </div>

      {currentShipments.length === 0 ? (
        <p className="text-center">No shipments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Sender</th>
                <th className="border p-2">Receiver</th>
                <th className="border p-2">Package</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Sender Phone</th>
                <th className="border p-2">Receiver Phone</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentShipments.map(shipment => (
                <tr key={shipment.id}>
                  <td className="border p-2">{shipment.sender}</td>
                  <td className="border p-2">{shipment.receiver}</td>
                  <td className="border p-2">{shipment.packageSize}</td>
                  <td className="border p-2">{shipment.address}</td>
                  <td className="border p-2">{shipment.senderPhone}</td>
                  <td className="border p-2">{shipment.receiverPhone}</td>
                  <td className="border p-2">
                    <select
                      value={updatedStatuses[shipment.id] || shipment.status}
                      onChange={(e) =>
                        setUpdatedStatuses(prev => ({
                          ...prev,
                          [shipment.id]: e.target.value
                        }))
                      }
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="border p-2">{shipment.createdAt?.toDate().toLocaleString()}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleStatusUpdate(shipment.id)}
                      disabled={
                        !updatedStatuses[shipment.id] ||
                        updatedStatuses[shipment.id] === shipment.status
                      }
                      className={`px-2 py-1 rounded text-white ${updatedStatuses[shipment.id] !== shipment.status
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-400 cursor-not-allowed'
                        }`}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          <div className="flex justify-end mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${pageNum === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-black'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
