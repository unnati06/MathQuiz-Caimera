import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const EntryPage = () => {

    const [name, setName] = useState('');
    const { storeTokenInLS, setUser } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        // Send a POST request to the backend
        try {
          const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            storeTokenInLS(data.token);
            navigate('/room'); // Navigate to dashboard on success
          } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            setError("Oops, this one's already taken! Try something else.");
          }
        } catch (error) {
          console.error('Network error:', error);
          setError('Network error occurred. Please try again later.');
        }
      };
      

  return (
    <div style={styles.container}>
            <h2 style={styles.heading}>Welcome! Enter a super cool and fun username</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />

                    <button type="submit" style={styles.button}>Join Room</button>
                    {error && <p style={styles.error}>{error}</p>}
                </form>
          
        </div>
    );
  
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
    },
    label: {
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: { // Style for error message
        color: 'red',
        marginTop: '10px',
        fontSize: '14px',
    },
};


export default EntryPage
