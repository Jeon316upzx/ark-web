import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_API_URL}`);  

const TalkModal = ({ talk, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [attendees, setAttendees] = useState(talk.attendees || []);

  useEffect(() => {
    if (talk) {
      socket.emit('joinTalk', talk._id);
      socket.on('message', (data) => setMessages((prev) => [...prev, data]));
      socket.on('attendeeUpdate', (newAttendees) => setAttendees(newAttendees));
    }
    return () => {
      socket.emit('leaveTalk', talk._id);
      socket.off('message');
      socket.off('attendeeUpdate');
    };
  }, [talk]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { talkId: talk._id, message });
      setMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-end">
      <div className="bg-white w-96 h-full p-4 overflow-y-auto shadow-xl">
        <h3 className="text-xl font-bold mb-2">{talk.title}</h3>
        <p className="mb-4">{talk.description}</p>
        <h4 className="text-lg font-semibold mb-2">Attendees:</h4>
        <ul className="mb-4">
          {attendees.length > 0 ? (
            attendees.map((attendee, index) => (
              <li key={index} className="mb-1">{attendee.name} ({attendee.email})</li>
            ))
          ) : (
            <li>No attendees yet</li>
          )}
        </ul>

        <h4 className="text-lg font-semibold mb-2">Chat:</h4>
        <div className="border border-gray-300 p-2 h-40 overflow-y-auto mb-2">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.sender ? `${msg.sender}: ${msg.message}` : msg}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="border border-gray-300 rounded-md py-2 px-4 w-full mr-2"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Send
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TalkModal;
