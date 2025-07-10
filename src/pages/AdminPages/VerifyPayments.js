import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VerifyPayments.css";
import CustomTable from "../../components/CustomTable/CustomTable";

function VerifyPayments() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:8009/payments/all", {
        withCredentials: true,
      });
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to load payments:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8009/payments/status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchPayments();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const columns = [
    {
      field: "userId.name",
      headerName: "User",
      flex: 1,
      valueGetter: ({ row }) => row.userId?.name || "",
    },
    {
      field: "userId.email",
      headerName: "Email",
      flex: 1,
      valueGetter: ({ row }) => row.userId?.email || "",
    },
    {
      field: "userId.phone",
      headerName: "Phone",
      flex: 1,
      valueGetter: ({ row }) => row.userId?.phone || "",
    },
    {
      field: "profileImage",
      headerName: "Profile",
      flex: 1,
      renderCell: ({ row }) =>
        row.userId?.profileImage ? (
          <img
            src={`http://localhost:8009/uploads/${row.userId.profileImage}`}
            alt="profile"
            height={40}
            width={40}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          "N/A"
        ),
    },
    {
      field: "paymentType",
      headerName: "Payment Type",
      flex: 1,
    },
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      valueGetter: ({ row }) =>
        new Date(row.month).toLocaleDateString("en-IN"),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueGetter: ({ row }) => `₹${row.amount}`,
    },
    {
      field: "paymentMode",
      headerName: "Mode",
      flex: 1,
    },
    {
      field: "screenshot",
      headerName: "Screenshot",
      flex: 1,
      renderCell: ({ row }) =>
        row.screenshot ? (
          <a
            href={`http://localhost:8009/uploads/payments/${row.screenshot}`}
            target="_blank"
            rel="noreferrer"
          >
            View
          </a>
        ) : (
          "No Screenshot"
        ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) =>
        row.status === "pending" ? (
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => updateStatus(row._id, "success")}>
              Approve
            </button>
            <button onClick={() => updateStatus(row._id, "rejected")}>
              Reject
            </button>
          </div>
        ) : (
          row.status
        ),
    },
  ];

  return (
    <div className="verify-payments-container">
      <h2>Verify Payments</h2>
      <CustomTable rows={payments} columns={columns} />
    </div>
  );
}

export default VerifyPayments;
