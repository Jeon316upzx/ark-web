import React, { useState } from "react";
import axios from "axios";

const AddAttendeeModal = ({ talk, onClose, onAttendeeAdded }) => {
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");

  const handleAddAttendee = async (e) => {
    e.preventDefault();

    if (!attendeeName || !attendeeEmail) {
      alert("Please fill in all fields.");
      return;
    }

    const newAttendee = {
      name: attendeeName,
      email: attendeeEmail,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/talks/${talk._id}/attendees`,
        newAttendee
      );
      console.log(response.data);
      onAttendeeAdded(response.data);
      onClose();
    } catch (error) {
      console.error("Error adding attendee:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white w-2/3 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add Attendee</h2>
        <form onSubmit={handleAddAttendee}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={attendeeName}
              onChange={(e) => setAttendeeName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
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
              Add Attendee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendeeModal;
