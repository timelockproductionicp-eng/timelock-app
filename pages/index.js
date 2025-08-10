import { useState, useEffect } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [messages, setMessages] = useState([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('timelock_messages') || '[]');
    setMessages(saved);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('timelock_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !releaseTime) return;
    const newMsg = { id: Date.now(), text, releaseTime };
    setMessages([...messages, newMsg]);
    setText('');
    setReleaseTime('');
  };

  const now = new Date();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem' }}>
      <h1>Timelock App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Message:</label><br />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Release Time:</label><br />
          <input
            type="datetime-local"
            value={releaseTime}
            onChange={(e) => setReleaseTime(e.target.value)}
          />
        </div>
        <button type="submit">Schedule Message</button>
      </form>
      <h2>Scheduled Messages</h2>
      {messages.length === 0 && <p>No messages scheduled.</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {messages.map((msg) => {
          const release = new Date(msg.releaseTime);
          const isReleased = release <= now;
          return (
            <li key={msg.id} style={{ marginBottom: '1rem' }}>
              {isReleased ? (
                <div>
                  <strong>Released:</strong> {msg.text}
                </div>
              ) : (
                <div>
                  <strong>Locked until {release.toLocaleString()}:</strong> {msg.text}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
