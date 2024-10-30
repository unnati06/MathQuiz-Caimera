// RoomCodeDisplay.js
import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext'; // Import the custom hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

const RoomCodeDisplay = () => {
    const { socket, roomCode } = useSocket(); // Use the context to get the socket and roomCode
    const [inputCode, setInputCode] = useState(''); // Local state for input
    const navigate = useNavigate(); // Get the navigate function

    const handleJoinRoom = (e) => {
        e.preventDefault(); // Prevent default form submission

        if (socket) {
            // Emit the joinRoom event with the input room code and user name
            const userName = 'User'; // You can replace this with actual user data
            socket.emit('joinRoom', { roomCode: inputCode, name: userName });
        }
    };

    // Handle joining the room and listen for events after the socket is initialized
    useEffect(() => {
        if (socket) {
            // Listen for a successful join
            socket.on('userJoined', () => {
                // Navigate to the dashboard when successfully joined
                navigate('/dashboard');
            });

            // Handle invalid room code
            socket.on('error', (error) => {
                alert(error.message); // Display the error message
            });

            // Cleanup: remove listeners on unmount
            return () => {
                socket.off('userJoined');
                socket.off('error');
            };
        }
    }, [socket, navigate]); // Dependency array includes socket and navigate

    return (
        <div>
            <h1>Room Code: {roomCode}</h1>
            <form onSubmit={handleJoinRoom}>
                <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                />
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
};

export default RoomCodeDisplay;
