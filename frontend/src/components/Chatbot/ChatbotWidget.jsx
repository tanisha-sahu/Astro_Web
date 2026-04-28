import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ChevronLeft, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatbotData from '../../data/chatbotTree.json';
import './ChatbotWidget.css';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentNodeId, setCurrentNodeId] = useState('start');
    const [history, setHistory] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const chatBodyRef = useRef(null);

    const resetChat = () => {
        setCurrentNodeId('start');
        setHistory([]);
        setChatHistory([]);
        showBotMessage('start');
    };

    const showBotMessage = (nodeId) => {
        setIsTyping(true);
        setTimeout(() => {
            const node = chatbotData[nodeId];
            setChatHistory(prev => [...prev, {
                type: 'bot',
                message: node.message,
                nodeId: nodeId
            }]);
            setIsTyping(false);
        }, 1200);
    };

    // Initialize with first message
    useEffect(() => {
        if (chatHistory.length === 0 && chatbotData.start) {
            showBotMessage('start');
        }
    }, []);

    // Scroll to bottom when chat updates
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatHistory, isOpen, isTyping]);

    const handleOptionClick = (option) => {
        // Add user response to chat
        const newUserMessage = {
            type: 'user',
            message: option.label
        };

        setChatHistory(prev => [...prev, newUserMessage]);

        if (option.action === 'redirect') {
            setIsTyping(true);
            setTimeout(() => {
                setChatHistory(prev => [...prev, {
                    type: 'bot',
                    message: "Navigating you now. Blessings on your journey!",
                    nodeId: 'redirecting'
                }]);
                setIsTyping(false);
                setTimeout(() => {
                    navigate(option.url);
                    setIsOpen(false);
                }, 800);
            }, 1000);
            return;
        }

        const nextNodeId = option.next;
        const nextNode = chatbotData[nextNodeId];

        if (nextNode) {
            setHistory(prev => [...prev, currentNodeId]);
            setCurrentNodeId(nextNodeId);
            showBotMessage(nextNodeId);
        }
    };

    return (
        <div className="chatbot-container">
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="header-info">
                            <div className="bot-avatar">
                                <Sparkles size={20} />
                            </div>
                            <div className="header-text">
                                <h3>Astro Guide</h3>
                                <p>Online | Spiritual Assistant</p>
                            </div>
                        </div>
                    </div>

                    <div className="chatbot-body" ref={chatBodyRef}>
                        {chatHistory.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className={`chat-message message-${item.type}`}>
                                    {item.message}
                                </div>
                                {item.type === 'bot' && index === chatHistory.length - 1 && chatbotData[item.nodeId]?.options && !isTyping && (
                                    <div className="options-container">
                                        {chatbotData[item.nodeId].options.map((option, optIdx) => (
                                            <button 
                                                key={optIdx} 
                                                className="option-btn"
                                                onClick={() => handleOptionClick(option)}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                                <div className="typing-dot"></div>
                            </div>
                        )}
                    </div>

                    <div className="chatbot-footer">
                        <button className="footer-reset-btn" onClick={resetChat}>
                            <Send size={14} style={{ transform: 'rotate(-45deg)' }} />
                            <span>New Chat</span>
                        </button>
                        <div className="footer-logo">Astro Sanatani</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotWidget;
