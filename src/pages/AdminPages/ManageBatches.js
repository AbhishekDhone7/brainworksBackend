import React, { useState, useEffect } from "react";
import "./ManageBatches.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import CustomTable from "../../components/CustomTable/CustomTable";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

function ManageBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    totalFee: "",
    prePlacementFee: "",
    duringPlacementFee: "",
    postPlacementFee: "",
    keywords: "",
    description: "",
    image: null,
    syllabus: null,
  });

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_BASE}/batches`);
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleKeywordInput = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      setKeywords((prev) => [...prev, e.target.value.trim()]);
      setFormData((prev) => ({ ...prev, keywords: "" }));
    }
  };

  const removeKeyword = (index) => {
    setKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries({ ...formData, keywords: keywords.join(",") }).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post(`${API_BASE}/batches`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBatches((prev) => [...prev, response.data]);
      setFormData({
        name: "",
        startDate: "",
        totalFee: "",
        prePlacementFee: "",
        duringPlacementFee: "",
        postPlacementFee: "",
        keywords: "",
        description: "",
        image: null,
        syllabus: null,
      });
      setKeywords([]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding batch:", error);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this batch?")) return;
    try {
      await axios.delete(`${API_BASE}/batches/${id}`);
      setBatches((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting batch:", error);
    }
  };

  const columns = [
  { field: "name", headerName: "Batch Name" },
  { field: "startDate", headerName: "Start Date", renderCell: ({ row }) => new Date(row.startDate).toLocaleString() },
  { field: "totalFee", headerName: "Total Fee" },
  { field: "prePlacementFee", headerName: "Pre-Placement Fee" },
  { field: "postPlacementFee", headerName: "Post-Placement Fee" },
  {
    field: "keywords",
    headerName: "Keywords",
    renderCell: ({ row }) => (
      <div className="keywords-cell">
        {row.keywords?.map((kw, i) => (
          <span key={i} className="keyword-pill">{kw}</span>
        ))}
      </div>
    ),
  },
  {
    field: "image",
    headerName: "Image",
    renderCell: ({ row }) => (
      row.image ? (
        <img
          src={`${API_BASE}/uploads/${row.image}`}
          alt="Batch"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ) : "No Image"
    ),
  },
  {
    field: "syllabus",
    headerName: "Syllabus",
    renderCell: ({ row }) =>
      row.syllabus ? (
        <a href={`${API_BASE}/uploads/${row.syllabus}`} target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
      ) : "No PDF",
  },
  {
    field: "actions",
    headerName: "Actions",
    renderCell: ({ row }) => (
      <button className="delete-btn" onClick={() => handleRemove(row._id)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    ),
  },
];


  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="manage-batches-container">
      <div className="header">
        <h1>Manage Batches</h1>
        <button className="add-batch-btn" title="Add Batch" onClick={() => setShowForm(!showForm)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {showForm && (
        <form className="batch-form" onSubmit={handleAddBatch} encType="multipart/form-data">
          <label>Batch Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />

          <label>Start Date & Time</label>
          <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} required />

          <label>Total Fee</label>
          <input type="number" name="totalFee" value={formData.totalFee} onChange={handleInputChange} required />

          <label>Pre-Placement Fee</label>
          <input type="number" name="prePlacementFee" value={formData.prePlacementFee} onChange={handleInputChange} />

          <label>During-Placement Fee</label>
          <input type="number" name="duringPlacementFee" value={formData.duringPlacementFee} onChange={handleInputChange} />

          <label>Post-Placement Fee</label>
          <input type="number" name="postPlacementFee" value={formData.postPlacementFee} onChange={handleInputChange} />

          <label>Batch Image</label>
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

          <label>Syllabus PDF</label>
          <input type="file" name="syllabus" accept="application/pdf" onChange={handleFileChange} />

          <label>Syllabus Keywords</label>
          <div className="keyword-input-wrapper">
            <input
              type="text"
              name="keywords"
              placeholder="Type keyword and press Enter"
              value={formData.keywords}
              onChange={handleInputChange}
              onKeyDown={handleKeywordInput}
            />
            <div className="keyword-list">
              {keywords.map((kw, i) => (
                <span key={i} className="keyword-pill">
                  {kw} <FontAwesomeIcon icon={faTimes} onClick={() => removeKeyword(i)} />
                </span>
              ))}
            </div>
          </div>

          <label>Batch Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />

          <button type="submit">Add</button>
        </form>
      )}

      <h2>Active Batches</h2>
      {loading ? <p>Loading batches...</p> : <CustomTable columns={columns} rows={batches} />}
    </div>
  );
}

export default ManageBatches;
