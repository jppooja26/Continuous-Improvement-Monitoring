import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../hooks/useAuthContext";
import Loading from "../../../components/Loading/Loading";
import Styles from "./Chat.module.css";
import SendButton from "../../../components/Chat/SendButton/SendButton";
import TextBox from "../../../components/TextBox/TextBox";
import Message from "../../../components/Chat/Message/Message";
import ChatHeader from "../../../components/Chat/ChatHeader/ChatHeader";
const Chat = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const auth = useAuthContext();
  const sendMessage = () => {
    axios
      .post("/api/messages", {
        chat: id,
        sender: auth.user._id,
        message: message,
      })
      .then((res) => {
        res.data.yourMessage = true;
        setMessages([...messages, res.data]);
        setMessage("");
        setSendLoading(false);
      })
      .catch((err) => {
        setSendLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(`/api/messages/${id}`)
      .then((res) => {
        //add extra field yourmessage  to each message
        res.data.forEach((message) => {
          message.yourMessage = message.sender === auth.user._id;
        });
        setMessages(res.data);
        console.log(res.data);
        //get  chat details
        axios
          .get(`/api/chats/${id}`)
          .then((res) => {
            console.log(res.data);
            setChatDetails(res.data);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );
  return (
    <div className={`${Styles.chat} `}>
      <div className={` ${Styles.chatHeader} row `}>
        <ChatHeader data={chatDetails} role={auth.userType} />
      </div>
      <div
        className={` ${Styles.chatContainer} row d-flex flex-column justify-content-start `}
      >
        {messages.map((message) => {
          return (
            <div
              className={
                message.yourMessage
                  ? `d-flex flex-row justify-content-end align-items-center`
                  : `d-flex flex-row justify-content-start align-items-center`
              }
              key={Math.random()}
            >
              <Message
                message={message.message}
                yourMessage={message.yourMessage}
              />
            </div>
          );
        })}
      </div>
      <div className={`${Styles.options} row`}>
        <div className="textBox col-11 ">
          <TextBox message={message} setMessage={setMessage} />
        </div>
        <div className="sendButton col-1">
          <SendButton
            loading={sendLoading}
            onClick={() => {
              setSendLoading(true);
              sendMessage();
              setMessage("");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
