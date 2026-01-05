import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

function Profile() {
  const userEmail = localStorage.getItem("userEmail");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();

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

  const handleEdit = () => setEdit(true);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      <Navbar />

      <div className="mx-auto mt-10 max-w-4xl px-4 flex flex-col gap-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 h-28 w-28 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <button
            onClick={handleEdit}
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Edit Form */}
        {edit && (
          <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Change Your Name"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Change Email Address"
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600"
            />
            <button
              onClick={handleSave}
              className="mt-2 rounded-md bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Action Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div
            onClick={() => navigate("/orders")}
            className="cursor-pointer rounded-md bg-blue-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
          >
            Orders
          </div>
          <div
            onClick={() => navigate("/cart")}
            className="cursor-pointer rounded-md bg-yellow-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-yellow-700"
          >
            Cart
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
