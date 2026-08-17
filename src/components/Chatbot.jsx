import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { api } from "../lib/api";

const PREDEFINED_RESPONSES = [
  {
    keywords: ["bonjour", "salut", "hello"],
    response:
      "Bonjour. Je suis l'assistant virtuel SST Tunisie. Comment puis-je vous assister aujourd'hui ?",
  },
  {
    keywords: ["quiz", "examen", "test"],
    response:
      "Vous pouvez évaluer vos connaissances via la section « Quiz SST ». Cette évaluation couvre la législation, les urgences, les EPI et les bonnes pratiques tunisiennes.",
  },
  {
    keywords: ["cnss", "assurance"],
    response:
      "La CNSS — Caisse Nationale de Sécurité Sociale — assure la gestion des risques professionnels, des accidents du travail et des maladies professionnelles. Elle coordonne également les actions de prévention en milieu professionnel.",
  },
  {
    keywords: ["epi", "protection", "casque", "gants"],
    response:
      "Les Équipements de Protection Individuelle (EPI) sont réglementés selon la nature du risque. Par exemple, le casque de sécurité est soumis à la norme NT 09.02 dans le secteur du BTP.",
  },
  {
    keywords: ["loi", "code du travail", "législation"],
    response:
      "Le Code du Travail tunisien, fondé sur la Loi n°66-27 du 30 avril 1966, définit les obligations de l'employeur en matière d'hygiène et de sécurité. Le décret n°2000-389 complète ces dispositions.",
  },
  {
    keywords: ["urgence", "accident", "secours"],
    response:
      "Numéros d'urgence en Tunisie :\n• 198 — Protection Civile (pompiers et secours)\n• 190 — SAMU (urgences médicales)\n• 71 335 500 — Centre Anti-Poison",
  },
  {
    keywords: ["merci", "thanks"],
    response:
      "Je vous en prie. La sécurité au travail est l'affaire de tous. N'hésitez pas si vous avez d'autres questions.",
  },
  {
    keywords: ["qui", "est", "tu"],
    response:
      "Je suis l'assistant virtuel officiel de SST Tunisie. Mon rôle est de vous orienter sur la réglementation, les EPI et les procédures de sécurité en vigueur en Tunisie.",
  },
];

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
      text: "Bienvenue sur l'assistant SST Tunisie. Je suis à votre disposition pour toute question relative à la réglementation, aux équipements de protection individuelle ou aux procédures de sécurité au travail.",
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

    return "Je n'ai pas identifié de réponse précise à votre demande. Je peux vous renseigner sur la CNSS, les EPI, le Code du Travail tunisien ou les numéros d'urgence. Veuillez reformuler votre question avec des termes spécifiques.";
  };

  return (
    <div id="chatbot" className="page active">
      <div className="section-header">
        <span className="section-label blue">Assistant IA</span>
        <h2>Conseiller SST</h2>
        <p>
          Assistance virtuelle spécialisée en santé et sécurité au travail.
          Réponses conformes à la réglementation tunisienne en vigueur.
        </p>
      </div>

      <div className="chatbot-container">
        <div className="chat-header">
          <div className="bot-avatar"><i className="bi bi-robot"></i></div>
          <div className="header-info">
            <h2>Assistant SST Tunisie</h2>
            <p>Disponible · Réponse officielle</p>
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
