import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Socket created outside component so it's not recreated on every render
let socket;

const Chat = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [order, setOrder] = useState(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    fetchConversation();
    setupSocket();

    return () => {
      // Cleanup socket on unmount
      socket?.disconnect();
    };
  }, [orderId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversation = async () => {
    try {
      const [msgRes, orderRes] = await Promise.all([
        api.get(`/messages/${orderId}`),
        api.get(`/orders/${orderId}`),
      ]);
      setMessages(msgRes.data.data);
      setOrder(orderRes.data.data);
    } catch {
      toast.error('Could not load chat');
      navigate('/orders');
    }
  };

  const setupSocket = () => {
    socket = io(import.meta.env.VITE_SOCKET_URL);

    // Register this user
    socket.emit('register', user._id);

    // Join this order's room
    socket.emit('joinRoom', orderId);

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for typing
    socket.on('userTyping', () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;

    // Determine receiver
    const receiverId = order?.clientId?._id === user._id
      ? order?.freelancerId?._id
      : order?.clientId?._id;

    setSending(true);
    try {
      // Save to DB via HTTP
      const { data } = await api.post('/messages', {
        orderId,
        receiverId,
        text: text.trim(),
      });

      // Broadcast via Socket.io to the room
      socket.emit('sendMessage', {
        orderId,
        message: data.data,
      });

      setText('');
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { orderId, userId: user._id });
  };

  const otherPerson = order
    ? order.clientId?._id === user._id
      ? order.freelancerId
      : order.clientId
    : null;

  return (
    <div className="bg-white h-[calc(100vh-64px)] flex flex-col">

      {/* Chat header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-400 hover:text-gray-600 mr-1"
        >
          ←
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          {otherPerson?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {otherPerson?.name}
          </div>
          <div className="text-xs text-gray-400 truncate max-w-xs">
            {order?.title}
          </div>
        </div>
        <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
          { pending: 'bg-yellow-50 text-yellow-700', active: 'bg-blue-50 text-blue-700', completed: 'bg-green-50 text-green-700', cancelled: 'bg-red-50 text-red-700' }[order?.status]
        }`}>
          {order?.status}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-10">
            No messages yet. Say hello!
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderId?._id === user._id ||
                       msg.senderId === user._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <div className={`text-xs text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 px-6 py-4">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3"
        >
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); handleTyping(); }}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 transition-colors"
            disabled={order?.status === 'cancelled'}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending || order?.status === 'cancelled'}
            className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
        {order?.status === 'cancelled' && (
          <p className="text-xs text-gray-400 text-center mt-2">
            This order was cancelled — chat is disabled
          </p>
        )}
      </div>

    </div>
  );
};

export default Chat;