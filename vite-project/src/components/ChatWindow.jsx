import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ contact, onSend }) {
  return (
    <section className="chat-window">
      <header className="chat-header">
        <div className="avatar">{contact?.avatar}</div>
        <div>
          <strong>{contact?.name}</strong>
          <p className={`status ${contact?.status}`}>{contact?.status}</p>
        </div>
      </header>

      <MessageList messages={contact?.messages} />

      <MessageInput onSend={onSend} />
    </section>
  );
}

export default ChatWindow;
