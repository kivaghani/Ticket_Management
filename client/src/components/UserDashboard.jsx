import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [complaint, setComplaint] = useState("");
  const [message, setMessage] = useState("");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/user/complaints", {
          headers: {
            'x-auth-token': token,
          },
        });
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      }
    };

    fetchComplaints();
  }, []);

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:3000/complaint", { complaint }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setMessage(response.data.message);
      setComplaints([...complaints, { complaint, response: null }]);
      setComplaint("");
    } catch (error) {
      setMessage("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <form onSubmit={handleComplaintSubmit}>
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Enter your complaint here"
        ></textarea>
        <button type="submit">Submit Complaint</button>
      </form>
      <p>{message}</p>

      <h3>Your Complaints</h3>
      <ul>
        {complaints.map((complaintItem, index) => (
          <li key={index}>
            <p><strong>Complaint:</strong> {complaintItem.text}</p>
            {complaintItem.response && (
              <p><strong>Admin Response:</strong> {complaintItem.response}</p>
            )}
          </li>
        ))}
      </ul>

      <h1>Go to Login</h1>
      <Link to="/login"><button className='mr-2'>Login</button></Link>
      <Link to="/register"><button>Register</button></Link>
    </div>
  );
};

export default UserDashboard;
