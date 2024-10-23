import React, { useState } from "react";
import axios from "axios";

const TalkDetailsModal = ({ onClose, onAddTalk }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !startTime) {
      alert("Please fill out all fields");
      return;
    }

    const newTalk = {
      title,
      description,
      startTime,
      speakers: [],
      attendees: [],
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/talks`, newTalk);
      onAddTalk(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding talk:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white w-2/3 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Talk</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter description"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Talk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TalkDetailsModal;
