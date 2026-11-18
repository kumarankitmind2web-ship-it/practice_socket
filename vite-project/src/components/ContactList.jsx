function ContactList({ contacts, activeId, onSelect }) {
  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li
          key={contact.id}
          className={`contact-item ${activeId === contact?.id ? "active" : ""}`}
          onClick={() => onSelect(contact?.id)}
        >
          <div className="avatar">{contact?.avatar}</div>
          <div className="contact-info">
            <strong>{contact?.name}</strong>
            <p>{contact?.lastMessage}</p>
          </div>
          <span className={`dot ${contact?.status}`} />
        </li>
      ))}
    </ul>
  );
}

export default ContactList;
