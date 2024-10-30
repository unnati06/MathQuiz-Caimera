import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const QuestionDisplay = () => {
    const { socket, roomCode } = useSocket();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [submittedAnswers, setSubmittedAnswers] = useState([]);
    const [winner, setWinner] = useState(null);
    const [points, setPoints] = useState(0);
    useEffect(() => {
        // Listen for new questions from the server
        socket.on('newQuestion', ({ question }) => {
            setQuestion(question);
            setWinner(null); // Reset the winner when a new question arrives
            setSubmittedAnswers([]); // Clear previous answers
            console.log(`New question received: ${question}`); // Debug log
        });

        // Listen for answer submissions from other users
        socket.on('answerSubmitted', ({ answer, userName }) => {
            console.log(`${userName} submitted: ${answer}`); // Debug log for answer submission
            setSubmittedAnswers((prevAnswers) => [...prevAnswers, `${userName}: ${answer}`]);
        });

        // Listen for the winner announcement
        socket.on('winner', ({ winner, correctAnswer }) => {
            console.log(`Winner event received: ${JSON.stringify({ winner, correctAnswer })}`); // Debug log
            setWinner({ name: winner, answer: correctAnswer });
        });

        // Clean up listeners on component unmount
        return () => {
            socket.off('newQuestion');
            socket.off('answerSubmitted');
            socket.off('winner');
        };
    }, [socket]);
 

    console.log(winner);
    
    // Handle answer submission
    const submitAnswer = () => {
        if (answer.trim()) {
            const userName = 'YourActualUserName'; // Replace with actual user name
            socket.emit('submitAnswer', { answer, userName });
            console.log(`Submitting answer: ${answer} from user: ${userName}`); // Debug log for submission
            setAnswer(''); // Clear the answer input after submission
        } else {
            console.log('Answer input is empty.'); // Log if the answer is empty
        }
    };

    return (
        <div>
            <h2>Room Code: {roomCode}</h2>
            <h3>Question: {question}</h3>

            {winner ? (
                <div>
                    <h3>Winner: {winner.name}</h3>
                    <p>Correct Answer: {winner.answer}</p>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer"
                    />
                    <button onClick={submitAnswer}>Submit Answer</button>
                </div>
            )}

            <h4>Submitted Answers:</h4>
            <ul>
                {submittedAnswers.map((ans, index) => (
                    <li key={index}>{ans}</li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionDisplay;
