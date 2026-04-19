import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const navigate = useNavigate();

  // 📍 Get location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => {
        alert("Location access denied");
      }
    );
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (image) {
        formData.append("image", image);
      }

      await API.post("/issues", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Issue created successfully");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create issue");
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Create Issue
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border mb-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="w-full p-2 border mb-3 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image Upload */}
        <input
          type="file"
          className="mb-3"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }}
        />

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover mb-3 rounded"
          />
        )}

        {/* Location Button */}
        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-blue-500 text-white p-2 rounded mb-3"
        >
          Get My Location 📍
        </button>

        {/* Latitude */}
        <input
          type="text"
          placeholder="Latitude"
          className="w-full p-2 border mb-3 rounded"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        {/* Longitude */}
        <input
          type="text"
          placeholder="Longitude"
          className="w-full p-2 border mb-3 rounded"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        {/* Submit */}
        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateIssue;