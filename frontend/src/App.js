import React, { useEffect, useState } from 'react';

const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://nnairam.me/api'
  : 'http://localhost:3000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState(''); // Tagasiside kasutajale

  // Näide `fetch` päringust Reactis
const fetchTodos = async () => {
  try {
    const response = await fetch(`${apiUrl}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
  }
};

  // Add a new to-do
  const addTodo = async () => {
    if (!title.trim()) return;  // Kui tiitel on tühi, ei lisa midagi
    console.log('Adding todo with title:', title);  // Kontrollige, kas tiitel on õigesti määratud
  
    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
  
      console.log('Server response:', response);  // Kontrollige serveri vastust
  
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
  
      setTitle('');
      fetchTodos();  // Laadige ülesanded uuesti
    } catch (error) {
      console.error('Error adding todo:', error);  // Vea logimine
      setMessage('Error adding task!');
    }
  };
  

  // Toggle the completion status of a to-do
  const toggleDone = async (id, done) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !done }),
      });
      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
      setMessage('Error updating task!');
    }
  };

  // Delete a to-do
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setMessage('Error deleting task!');
    }
  };

  // Fetch the to-dos when the component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  // Kontrollige, et sõnumi kuvamine töötab õigesti
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage('');
      }, 3000); // Peidab sõnumi 3 sekundi pärast
      return () => clearTimeout(timeout);  // Kui komponent eemaldatakse, tühistame timeouti
    }
  }, [message]);

  return (
    <div style={{
      maxWidth: 500,
      margin: '50px auto',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 8,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>📝 To-do App</h1>
      {message && <p>{message}</p>} {/* Kuvada tagasiside */}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task"
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            marginLeft: 10,
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            padding: 10,
            marginBottom: 10,
            backgroundColor: '#f9f9f9',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span
              onClick={() => toggleDone(todo.id, todo.done)}
              style={{
                cursor: 'pointer',
                textDecoration: todo.done ? 'line-through' : 'none'
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#dc3545',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              title="Delete"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
