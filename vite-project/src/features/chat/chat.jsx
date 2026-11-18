import { useState,useEffect} from "react";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import { contacts as initialContacts } from "../../data/mockData";
import {logout} from "../../services/authService";
import { useNavigate } from "react-router";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser, setAccessToken, setRefreshToken, setIsAuthenticated } from "../../redux/slices/authSlice";
import { FetchUsersList } from "../../services/chatService";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState(initialContacts[0]?.id);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const activeContact = contacts?.find((c) => c.id === activeId) ?? contacts[0];

  const handleSend = (text) => {
    console.log("Sending message:", text, "to contact ID:", activeId);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastMessage: text,
              messages: [
                ...c.messages,
                {
                  id: Date.now(),
                  sender: "me",
                  text,
                  time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            }
          : c
      )
    );
  };

  const handleLogout = async() =>
  {
    try
    {
       const response = await logout();
       console.log("Logout response:", response.data.status);
       if(response.data.status)
       {
          dispatch(setUser(""));
          dispatch(setAccessToken(""));
          dispatch(setRefreshToken(""));
          dispatch(setIsAuthenticated(false));
          navigate("/auth");
          toast.success("Logout successful!");
       }
       else
       {
          toast.error(response.data.message || "Logout failed!");
       }
    }
    catch (error)
    {
      console.error("Logout error:", error);
    }
  }

useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = await FetchUsersList();

      if (user?.status) {
        setContacts(user.data);

        if (user.data.length > 0) {
          setActiveId(user.data[0]?._id);
        }
      } else {
        console.log(user);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
    }
  };

  fetchUser();
}, []);

  return (
    <>
     <div className="app">
      <Sidebar
        contacts={contacts}
        activeId={activeId}
        onSelect={setActiveId}
        onLogout={handleLogout}
      />
      <ChatWindow contact={activeContact} onSend={handleSend} />
    </div>
    </>
    
  );
}

export default Chat;
