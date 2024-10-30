// SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const socket = io('http://localhost:3000'); // Backend server URL

export const SocketProvider = ({ children }) => {
    const [roomCode, setRoomCode] = useState('');
    const [question, setQuestion] = useState('');

    useEffect(() => {
        // Listen for room code from the server
        socket.on('roomCode', ({ roomCode }) => {
            setRoomCode(roomCode);
            console.log(roomCode);
        });

        socket.on('newQuestion', ({ question }) => {
            setQuestion(question);
            console.log("Received question:", question);
        });

        return () => {
            socket.off('roomCode');
            socket.off('newQuestion');
        };
    }, []);

    const joinRoom = (roomCode, userName) => {
        socket.emit('joinRoom', { roomCode, name: userName });
    };


    return (
        <SocketContext.Provider value={{ socket, roomCode, question, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
