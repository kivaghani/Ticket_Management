import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [response, setResponse] = useState({});

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/complaints", {
          headers: {
            'x-auth-token': token,
          },
        });
        setComplaints(response.data.complaints);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleResponseSubmit = async (complaintId) => {
    try {
      const token = localStorage.getItem("token");
      const responseText = response[complaintId] || "";
      const responseApi = await axios.post(`http://localhost:3000/complaint/${complaintId}/response`, { response: responseText }, {
        headers: {
          'x-auth-token': token,
        },
      });

      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint._id === complaintId
            ? { ...complaint, response: responseApi.data.response }
            : complaint
        )
      );
    } catch (error) {
      console.error("Failed to send response", error);
    }
  };

  const handleResponseChange = (complaintId, value) => {
    setResponse((prev) => ({
      ...prev,
      [complaintId]: value,
    }));
  };

  return (
    <div>
      <h2 className='font-bold text-center'>Admin Dashboard</h2>
      <ul>
        {complaints.map(complaint => (
          <li key={complaint._id}>
            <p><strong>User:</strong> {complaint.user.username}</p>
            <p><strong>Complaint:</strong> {complaint.text}</p>
            <p><strong>Response:</strong> {complaint.response || "No response yet"}</p>
            <textarea
              value={response[complaint._id] || ""}
              onChange={(e) => handleResponseChange(complaint._id, e.target.value)}
              placeholder="Enter your response"
            ></textarea>
            <button onClick={() => handleResponseSubmit(complaint._id)}>Send Response</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
