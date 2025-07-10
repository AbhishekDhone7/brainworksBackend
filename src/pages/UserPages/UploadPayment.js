import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import "./AddPayment.css";

function AddPayment() {
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batchId: "",
    paymentType: "",
    month: "",
    amount: "",
    paymentMode: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axiosInstance.get("/batches");
        setBatches(res.data);
      } catch (err) {
        console.error("Error fetching batches:", err);
        setErrorMsg("Failed to load batch list.");
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));

      if (formData.paymentMode === "Online" && screenshot) {
        data.append("screenshot", screenshot);
      }

      await axiosInstance.post("/payments/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg("✅ Payment submitted successfully!");
      setFormData({
        batchId: "",
        paymentType: "",
        month: "",
        amount: "",
        paymentMode: "",
      });
      setScreenshot(null);
    } catch (error) {
      console.error("Error submitting payment:", error);
      setErrorMsg("❌ Failed to submit payment.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-payment-form">
      <h2>Add Payment</h2>

      {successMsg && <p className="success-msg">{successMsg}</p>}
      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <label>Batch Name</label>
      <select name="batchId" value={formData.batchId} onChange={handleChange} required>
        <option value="">Select a batch</option>
        {batches.map((batch) => (
          <option key={batch._id} value={batch._id}>
            {batch.name}
          </option>
        ))}
      </select>

      <label>Payment Type</label>
      <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Before Placement">Before Placement</option>
        <option value="At Placement">At Placement</option>
        <option value="Post Placement">Post Placement</option>
      </select>

      <label>Month</label>
      <input type="date" name="month" value={formData.month} onChange={handleChange} required />

      <label>Amount</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />

      <label>Payment Mode</label>
      <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} required>
        <option value="">Select</option>
        <option value="Cash">Cash</option>
        <option value="Online">Online</option>
      </select>

      {formData.paymentMode === "Online" && (
        <>
          <label>Upload Screenshot</label>
          <input type="file" name="screenshot" accept="image/*" onChange={handleFileChange} />
        </>
      )}

      <button type="submit">Submit</button>
    </form>
  );
}

export default AddPayment;
