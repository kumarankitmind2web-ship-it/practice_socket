function MessageList({ messages }) {
  return (
    <div className="message-list">
      {messages?.map((msg) => (
        <div key={msg.id} className={`message ${msg.sender}`}>
          <p>{msg.text}</p>
          <span className="time">{msg.time}</span>
        </div>
      ))}
    </div>
  );
}

export default MessageList;
