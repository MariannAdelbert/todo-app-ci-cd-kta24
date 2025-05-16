import React, { useEffect, useState } from 'react';
const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTodos = async () => {
    const response = await fetch(`${apiUrl}/api/todos`);
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    await fetch(`${apiUrl}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    fetchTodos();
  };

  const toggleDone = async (id, done) => {
    await fetch(`${apiUrl}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${apiUrl}/api/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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
            alignItems: 'center',
            animation: 'fadeIn 0.3s ease-in'
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
