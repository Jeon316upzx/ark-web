import React, { useState, useEffect } from "react";
import TalkModal from "./components/TalkModal";
import TalkDetailsModal from "./components/TalkDetailsModal";
import AddAttendeeModal from "./components/AddAttendee";
import axios from "axios";

const TalkList = () => {
  const [talks, setTalks] = useState([]);
  const [selectedTalk, setSelectedTalk] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/talks`);
        setTalks(response.data);
      } catch (error) {
        console.error("Error fetching talks:", error);
      }
    };

    fetchTalks();
  }, []);

  const handleTalkClick = (talk) => {
    setSelectedTalk(talk);
    setIsModalOpen(true);
  };

  const handleAddTalk = (newTalk) => {
    setTalks([...talks, newTalk]);
  };

  const deleteTalk = async (talkId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/talks/${talkId}`);
      setTalks(talks.filter((talk) => talk._id !== talkId));
    } catch (error) {
      console.error("Error deleting talk:", error);
    }
  };

  const handleAddAttendee = (talk) => {
    setSelectedTalk(talk);
    setIsAttendeeModalOpen(true);
  };

  return (
    <div className="p-20">
      <h2 className="text-2xl font-bold mb-4">Available Talks</h2>

      {talks.length > 0 ? (
        <ul className="space-y-4">
          {talks.map((talk) => (
            <li
              key={talk._id}
              className="p-4 bg-gray-100 rounded-lg flex justify-between items-center"
            >
              <span
                className="cursor-pointer"
                onClick={() => handleTalkClick(talk)}
              >
                {talk.title}
              </span>

              <div>
                <button
                  onClick={() => deleteTalk(talk._id)}
                  className="ml-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleAddAttendee(talk)}
                  className="ml-4 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600"
                >
                  Add Attendee
                </button>
              </div>
            </li>
          ))}

          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Talk
          </button>
        </ul>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-lg">No talks available</p>
          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Talk
          </button>
        </div>
      )}

      {isDetailsModalOpen && (
        <TalkDetailsModal
          onClose={() => setIsDetailsModalOpen(false)}
          onAddTalk={handleAddTalk}
        />
      )}

      {isModalOpen && selectedTalk && (
        <TalkModal talk={selectedTalk} onClose={() => setIsModalOpen(false)} />
      )}

      {isAttendeeModalOpen && selectedTalk && (
        <AddAttendeeModal
          talk={selectedTalk}
          onClose={() => setIsAttendeeModalOpen(false)}
          onAttendeeAdded={(newAttendee) => {
            setTalks(
              talks.map((talk) =>
                talk._id === selectedTalk._id
                  ? { ...talk, attendees: [...talk.attendees, newAttendee] }
                  : talk
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default TalkList;
