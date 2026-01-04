import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Profile.module.css";
import Navbar from "./Navbar";
import {useNavigate} from 'react-router-dom'
import Orders from "../pages/Orders";

function Profile() {
  const userEmail = localStorage.getItem("userEmail");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const navigate=useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:5000/users?email=${userEmail}`).then((res) => {
      if (res.data.length > 0) {
        setUser(res.data[0]);
        setFormData({
          name: res.data[0].name,
          email: res.data[0].email,
        });
      }
    });
  }, [userEmail]);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        await axios.patch(`http://localhost:5000/users/${user.id}`, {
          image: base64Image,
        });
        setUser((prev) => ({ ...prev, image: base64Image }));
        alert("Profile image updated!");
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const updatedUser = { ...user, ...formData };
      await axios.patch(`http://localhost:5000/users/${user.id}`, updatedUser);
      setUser(updatedUser);
      setEdit(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <>
        <Navbar/>
    
    <div className={styles.container}>
      {/* Profile Section */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {user.image ? (
            <img src={user.image} alt={user.name} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>
        <h3 className={styles.username}>{user.name}</h3>
        <p className={styles.email}>{user.email}</p>
        <button onClick={handleEdit} className={styles.editBtn}>
          Edit
        </button>
      </div>

      {/* Edit Form */}
      {edit && (
        <div className={styles.editForm}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Change Your Name"
          />
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Change Email Address"
          />
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleSave} className={styles.saveBtn}>
            Save Changes
          </button>
        </div>
      )}

      {/* Action Section */}
      <div className={styles.actions}>
        <div className={styles.actionBox} onClick={()=>navigate('/orders')}>ORDERS</div>
        <div className={styles.actionBox} onClick={()=>navigate('/cart')}>CART</div>
      </div>
    </div>
    </>
  );
}

export default Profile;
