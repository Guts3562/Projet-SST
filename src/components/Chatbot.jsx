import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { api } from "../lib/api";

const PREDEFINED_RESPONSES = [
  {
    keywords: ["bonjour", "salut", "hello"],
    response:
      "Bonjour ! Je suis votre assistant virtuel SST Tunisie. Comment puis-je vous aider aujourd'hui ?",
  },
  {
    keywords: ["quiz", "examen", "test"],
    response:
      'Vous pouvez tester vos connaissances dans la section "Quiz SST". C\'est un excellent moyen de vous auto-évaluer sur les normes de sécurité !',
  },
  {
    keywords: ["cnss", "assurance"],
    response:
      "La CNSS (Caisse Nationale de Sécurité Sociale) gère les accidents du travail et les maladies professionnelles en Tunisie. Elle coordonne aussi les actions de prévention.",
  },
  {
    keywords: ["epi", "protection", "casque", "gants"],
    response:
      "Les Équipements de Protection Individuelle (EPI) sont obligatoires selon la nature du risque. Par exemple, le port du casque est régi par la norme NT 09.02 dans le BTP.",
  },
  {
    keywords: ["loi", "code du travail", "législation"],
    response:
      "Le Code du Travail tunisien (Loi n°66-27) définit les obligations de l'employeur. Le décret n°2000-389 précise les conditions d'hygiène et de sécurité.",
  },
  {
    keywords: ["urgence", "accident", "secours"],
    response:
      "En Tunisie, les numéros d'urgence sont : 198 (Protection Civile), 190 (SAMU) et 71 335 500 (Centre Anti-Poison).",
  },
  {
    keywords: ["merci", "thanks"],
    response:
      "Je vous en prie ! N'oubliez pas : la sécurité au travail est l'affaire de tous.",
  },
  {
    keywords: ["qui", "est", "tu"],
    response:
      "Je suis SST-GPT, une intelligence artificielle spécialisée dans la Santé et Sécurité au Travail en Tunisie. Je peux vous guider sur la législation, les EPI et les bonnes pratiques.",
  },
];

const QUICK_REPLIES = [
  "🎯 Faire le Quiz",
  "🛡️ Infos sur les EPI",
  "⚖️ Loi et Législation",
  "🚨 Numéros d'urgence",
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bienvenue ! Je suis votre assistant expert en Sécurité et Santé au Travail. Posez-moi vos questions sur les normes tunisiennes !",
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

    const getAIResponse = async () => {
      try {
        const history = messages.map((m) => ({
          role: m.type === "bot" ? "assistant" : "user",
          content: m.text,
        }));
        const data = await api.chat.sendMessage(text, history);

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
        // Fallback to local logic if API fails
        const responseText = getBotResponse(text);
        const botMessage = {
          id: Date.now() + 1,
          text: responseText,
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

    getAIResponse();
  };

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();

    for (const item of PREDEFINED_RESPONSES) {
      if (item.keywords.some((kw) => lowerText.includes(kw))) {
        return item.response;
      }
    }

    return "Je ne suis pas sûr de comprendre votre question. Je suis encore en phase d'apprentissage, mais je peux vous renseigner sur la CNSS, les EPI ou le Code du Travail tunisien. Essayez d'utiliser des mots-clés spécifiques !";
  };

  return (
    <div id="chatbot" className="page active">
      <div className="section-header">
        <span className="section-label blue">Assistant IA</span>
        <h2>SST-GPT</h2>
        <p>
          Votre expert virtuel en sécurité disponible 24h/24 pour répondre à vos
          questions réglementaires.
        </p>
      </div>

      <div className="chatbot-container">
        <div className="chat-header">
          <div className="bot-avatar">🤖</div>
          <div className="header-info">
            <h2>Assistant SST Tunisie</h2>
            <p>En ligne · IA Spécialisée</p>
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
                onClick={() => handleSend(reply.split(" ").slice(1).join(" "))}
              >
                {reply}
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
      </div>
    </div>
  );
}

export default Chatbot;
