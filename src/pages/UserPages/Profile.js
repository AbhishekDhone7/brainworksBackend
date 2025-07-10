import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CropImage from "../../components/CropImage/CropImage";
import Spinner from "../../components/Spinner/Spinner";
import axiosInstance from "../../utils/axios";

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [aadharPreview, setAadharPreview] = useState("");
  const [panPreview, setPanPreview] = useState("");
  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState(null);

  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/users/valid_user/me");
      const userData = res.data.user || res.data;
      setProfile(userData);
      setFormData(userData);

      if (userData.image)
        setImagePreview(`${process.env.REACT_APP_API_URL}/uploads/${userData.image}`);
      if (userData.aadharImage)
        setAadharPreview(`${process.env.REACT_APP_API_URL}/uploads/${userData.aadharImage}`);
      if (userData.panImage)
        setPanPreview(`${process.env.REACT_APP_API_URL}/uploads/${userData.panImage}`);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempFile(file);
      setCropModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (profileImageFile) data.append("image", profileImageFile);
      if (aadharFile) data.append("aadharImage", aadharFile);
      if (panFile) data.append("panImage", panFile);

      await axiosInstance.put("/users/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Profile updated successfully.");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCropDone = (croppedBlob) => {
    const croppedFile = new File([croppedBlob], tempFile.name, { type: "image/jpeg" });
    setProfileImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedBlob));
    setCropModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="profile-page">
      <h2>Student Profile</h2>

      <div className="profile-card">
        {!editMode && (
          <img
            src={imagePreview || "/default-avatar.png"}
            alt="Profile"
            className="profile-img"
          />
        )}

        {!editMode ? (
          <div className="profile-details">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone}</p>
            <p><strong>WhatsApp No:</strong> {profile.whatsapp}</p>
            <p><strong>Batch:</strong> {profile.batch}</p>
            <p><strong>Aadhaar:</strong> {profile.aadhar}</p>
            <p><strong>PAN:</strong> {profile.pan}</p>
            <p><strong>Permanent Address:</strong> {profile.permanentAddress}</p>
            <p><strong>Current Address:</strong> {profile.currentAddress}</p>
            {aadharPreview && (
              <div>
                <strong>Aadhaar Image:</strong><br />
                <img src={aadharPreview} alt="Aadhaar" className="doc-img" />
              </div>
            )}
            {panPreview && (
              <div>
                <strong>PAN Image:</strong><br />
                <img src={panPreview} alt="PAN" className="doc-img" />
              </div>
            )}
            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSubmit}>
            <label>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Profile Preview" className="doc-img" />
            )}

            <label>Name</label>
            <input name="name" value={formData.name || ""} onChange={handleChange} />

            <label>Phone</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} />

            <label>WhatsApp No</label>
            <input name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} />

            <label>Batch</label>
            <input name="batch" value={formData.batch || ""} onChange={handleChange} />

            <label>Aadhaar</label>
            <input name="aadhar" value={formData.aadhar || ""} onChange={handleChange} />

            <label>PAN</label>
            <input name="pan" value={formData.pan || ""} onChange={handleChange} />

            <label>Permanent Address</label>
            <textarea name="permanentAddress" value={formData.permanentAddress || ""} onChange={handleChange} />

            <label>Current Address</label>
            <textarea name="currentAddress" value={formData.currentAddress || ""} onChange={handleChange} />

            <label>Aadhaar Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setAadharFile, setAadharPreview)} />
            {aadharPreview && <img src={aadharPreview} alt="Aadhaar Preview" className="doc-img" />}

            <label>PAN Image</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setPanFile, setPanPreview)} />
            {panPreview && <img src={panPreview} alt="PAN Preview" className="doc-img" />}

            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </form>
        )}
        {successMsg && <p className="success">{successMsg}</p>}

        {cropModalOpen && (
          <CropImage
            file={tempFile}
            onCropDone={handleCropDone}
            onCancel={() => setCropModalOpen(false)}
            enableResizableCrop={true}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
