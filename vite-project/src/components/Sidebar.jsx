import ContactList from "./ContactList";
import React from "react";

function Sidebar({ contacts, activeId, onSelect, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <h3>Contacts</h3>
        <button type="button" className="sign-out-button" onClick={onLogout}>
          Sign out
        </button>
      </div>
      <ContactList contacts={contacts} activeId={activeId} onSelect={onSelect} />
    </aside>
  );
}

export default React.memo(Sidebar);
