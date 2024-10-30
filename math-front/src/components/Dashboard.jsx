// src/components/Dashboard.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useSocket } from '../contexts/SocketContext';
// import { useAuth } from '../contexts/AuthContext';
import { AuthContext } from '../contexts/AuthContext';
import QuestionDisplay from './QuizQuestions';
const Dashboard = ({ roomId, userName }) => {
    const socket = useSocket();
    const { user } = useContext(AuthContext);

    if (!user) return <p>Loading...</p>;
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState('');

   

    console.log("Usr:", user); 
    return (
        <div>
            <h1>Quiz Room: {roomId}</h1>
            <h2>Hi {user.name}</h2>
            <QuestionDisplay />
            {/* {question && <h2>Question: {question.question}</h2>}
            <form onSubmit={handleAnswerSubmit}>
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Your answer"
                    required
                />
                <button type="submit">Submit Answer</button>
            </form>
            {feedback && <p>{feedback}</p>} */}
        </div>
    );
};

export default Dashboard;
