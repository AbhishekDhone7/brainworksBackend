import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { jsPDF } from "jspdf";
import "./PaymentSlips.css";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CustomTable from "../../components/CustomTable/CustomTable";
import Spinner from "../../components/Spinner/Spinner";

function PaymentSlips() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuthContext();

  useEffect(() => {
  if (!loading && !isAuthenticated) {
    navigate("/");
  }
}, [loading, isAuthenticated, navigate]);


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosInstance.get("/payments/my-payments");
        setPayments(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch payments. Try again later.");
      }
    };

    if (isAuthenticated) {
      fetchPayments();
    }
  }, [isAuthenticated]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generatePDF = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Payment Slip", 20, 20);
    doc.setFontSize(12);
    doc.text(`Payment Type: ${payment.paymentType}`, 20, 40);
    doc.text(`Month: ${formatDate(payment.month)}`, 20, 50);
    doc.text(`Amount: ₹${payment.amount}`, 20, 60);
    doc.text(`Status: ${payment.status}`, 20, 70);
    doc.text(`Date: ${formatDate(payment.createdAt || payment.date)}`, 20, 80);
    doc.save(`PaymentSlip_${payment._id}.pdf`);
  };

  if (loading) return <Spinner />;

  const columns = [
    {
      field: "paymentType",
      headerName: "Type",
      flex: 1,
    },
    {
      field: "month",
      headerName: "Month",
      flex: 1,
      valueGetter: ({ row }) => formatDate(row.month),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      valueGetter: ({ row }) => `₹${row.amount}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      valueGetter: ({ row }) => formatDate(row.createdAt || row.date),
    },
    {
      field: "download",
      headerName: "Download",
      flex: 1,
      renderCell: ({ row }) => (
        <button className="download-btn" onClick={() => generatePDF(row)}>
          Download PDF
        </button>
      ),
    },
  ];

  return (
    <div className="payment-slips-container">
      <h2>Previous Payments</h2>
      {error && <p className="error-text">{error}</p>}
      <CustomTable rows={payments} columns={columns} />
    </div>
  );
}

export default PaymentSlips;
