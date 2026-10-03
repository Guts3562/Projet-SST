import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { api } from "../lib/api";

const QUICK_REPLIES = [
  { icon: "bi bi-patch-question", text: "Évaluer mes connaissances" },
  { icon: "bi bi-shield-check", text: "Consulter les EPI" },
  { icon: "bi bi-scale", text: "Législation SST" },
  { icon: "bi bi-telephone", text: "Numéros d'urgence" },
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour. Je suis l’assistant pédagogique SST Tunisie. Je réponds à partir d’un ensemble limité de réponses prédéfinies, déclenchées par des mots-clés. Je ne comprends pas le contexte d’une conversation et mes réponses ne sont pas officielles.",
      type: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text,
      type: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const getAssistantResponse = async () => {
      try {
        const data = await api.chat.sendMessage(text);

        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          type: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.error("Chat error:", error);
        const botMessage = {
          id: Date.now() + 1,
          text: "Le service de réponses prédéfinies est indisponible. Réessayez plus tard ou consultez la rubrique Ressources.",
          type: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }
    };

    getAssistantResponse();
  };

  return (
    <div id="chatbot" className="page active">
      <div className="section-header">
        <span className="section-label blue">Assistant pédagogique</span>
        <h2>Conseiller SST</h2>
        <p>
          Réponses prédéfinies choisies selon les mots-clés de votre question.
          Le service ne mémorise pas le contexte de la conversation et ne remplace
          pas les sources officielles.
        </p>
      </div>

      <div className="chatbot-container">
        <div className="chat-header">
          <div className="bot-avatar"><i className="bi bi-chat-dots"></i></div>
          <div className="header-info">
            <h2>Assistant SST Tunisie</h2>
            <p>Réponses par mots-clés · Pas de mémoire de conversation</p>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-bubble">{msg.text}</div>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="quick-replies">
            {QUICK_REPLIES.map((reply, i) => (
              <button
                key={i}
                className="quick-reply-btn"
                onClick={() => handleSend(reply.text)}
              >
                <i className={reply.icon}></i> {reply.text}
              </button>
            ))}
          </div>
          <form
            className="input-wrapper"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Posez votre question ici..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              className="send-btn"
              type="submit"
              disabled={!input.trim() || isTyping}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
        <div className="chat-disclaimer">
          Assistant virtuel à titre informatif. Consultez un professionnel SST pour toute situation critique.
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
