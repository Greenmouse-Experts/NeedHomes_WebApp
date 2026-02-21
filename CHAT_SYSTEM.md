# Chat System - Frontend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [WebSocket Setup](#websocket-setup)
4. [REST API Endpoints](#rest-api-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Data Structures](#data-structures)
7. [Implementation Examples](#implementation-examples)
8. [Flow Diagrams](#flow-diagrams)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The chat system provides real-time support conversations between users and admins using a hybrid architecture:

- **REST API**: Initial data loading, CRUD operations, fallback
- **WebSocket**: Real-time message delivery, typing indicators, presence

### Key Features
- ✅ Real-time messaging
- ✅ Automated welcome message
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Admin assignment to conversations
- ✅ Conversation status tracking (PENDING → ACTIVE → CLOSED)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                             │
│                                                         │
│  ┌──────────────┐              ┌──────────────┐        │
│  │  REST API    │              │  WebSocket   │        │
│  │  (HTTP)      │              │  (Socket.IO) │        │
│  │              │              │              │        │
│  │ - Load data  │              │ - Real-time  │        │
│  │ - CRUD ops   │              │ - Messages   │        │
│  │ - Fallback   │              │ - Events     │        │
│  └──────┬───────┘              └──────┬───────┘        │
└─────────┼──────────────────────────────┼───────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                              │
│                                                         │
│  ┌──────────────┐              ┌──────────────┐        │
│  │    Chat      │              │    Chat      │        │
│  │  Controller  │◄────────────►│   Gateway    │        │
│  │  (REST)      │              │ (WebSocket)  │        │
│  └──────┬───────┘              └──────┬───────┘        │
│         │                             │                │
│         └─────────────┬───────────────┘                │
│                       ▼                                │
│              ┌────────────────┐                        │
│              │  Chat Service  │                        │
│              │  (Business)    │                        │
│              └────────┬───────┘                        │
│                       ▼                                │
│              ┌────────────────┐                        │
│              │  Repositories  │                        │
│              │  (Database)    │                        │
│              └────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## WebSocket Setup

### 1. Install Socket.IO Client

```bash
npm install socket.io-client
# or
yarn add socket.io-client
```

### 2. Connection Configuration

```typescript
import { io, Socket } from 'socket.io-client';

// Get JWT token from your auth system
const token = localStorage.getItem('authToken');

// Connect to WebSocket server
const socket: Socket = io(import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com', {
  auth: {
    token: token  // Pass JWT token for authentication
  },
  // OR pass in headers
  extraHeaders: {
    Authorization: `Bearer ${token}`
  },
  transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket');
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

// Server confirms connection with user data
socket.on('connected', (data) => {
  console.log('User data:', data);
  // data = { userId, email, role, isAdmin, timestamp }
});
```

### 3. Room Concept

Users are automatically joined to rooms on connection:

| Room Type | Format | Who Joins | Purpose |
|-----------|--------|-----------|---------|
| **Personal Room** | `user:{userId}` | Everyone | Direct messages to specific user |
| **Role Room** | `role:{accountType}` | Everyone | Role-based broadcasts (e.g., `role:tenant`) |
| **Admin Room** | `admin-notifications` | Admins only | Admin alerts (new conversations) |
| **Conversation Room** | `conversation:{conversationId}` | User & assigned admin | Chat messages |

**You don't manually join these rooms** - the backend handles it automatically.

---

## REST API Endpoints

**Base URL**: `https://needhomes-backend-staging.onrender.com/api/chat`

**Development**: `http://localhost:3000/api/chat`

All endpoints require JWT authentication via `Authorization: Bearer {token}` header.

### 1. Get My Conversation

**Endpoint**: `GET /chat/my-conversation`

**Description**: Get user's active conversation (if exists)

**Auth**: User must have `CHAT_READ_OWN` permission

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "id": "conv-123",
    "userId": "user-456",
    "adminId": "admin-789",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastMessageAt": "2024-01-15T10:35:00Z",
    "messages": [
      {
        "id": "msg-1",
        "content": "Hello! Thank you for reaching out...",
        "senderId": "user-456",
        "isSystem": true,
        "isRead": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "sender": {
          "id": "user-456",
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

**Use Case**: Load conversation history on page load

---

### 2. Create Conversation

**Endpoint**: `POST /chat/conversations`

**Description**: Create new conversation or return existing active one

**Auth**: User must have `CHAT_CREATE_OWN` permission

**Request Body**:
```json
{
  "message": "I need help with my booking" // Optional initial message
}
```

**Response**:
```json
{
  "statusCode": 201,
  "message": "Conversation created",
  "data": {
    "conversation": { /* Same structure as above */ },
    "isNew": true  // true if newly created, false if existing
  }
}
```

**Use Case**: User clicks "Start Chat" button

---

### 3. Get Pending Conversations (Admin)

**Endpoint**: `GET /chat/pending`

**Description**: Get all unassigned conversations waiting for admin

**Auth**: Admin with `CHAT_READ_ALL` permission

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "conv-123",
      "userId": "user-456",
      "status": "PENDING",
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user-456",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "accountType": "TENANT"
      },
      "messages": [
        { /* Latest message */ }
      ]
    }
  ]
}
```

**Use Case**: Admin dashboard showing pending support requests

---

### 4. Get Admin's Conversations

**Endpoint**: `GET /chat/my-admin-conversations`

**Description**: Get all conversations assigned to current admin

**Auth**: Admin with `CHAT_READ_ALL` permission

**Response**:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "conv-123",
      "userId": "user-456",
      "adminId": "admin-789",
      "status": "ACTIVE",
      "lastMessageAt": "2024-01-15T10:35:00Z",
      "user": { /* User details */ },
      "messages": [{ /* Latest message */ }]
    }
  ]
}
```

**Use Case**: Admin viewing their assigned conversations

---

### 5. Join Conversation (Admin)

**Endpoint**: `PATCH /chat/conversations/:id/join`

**Description**: Admin claims a pending conversation

**Auth**: Admin with `CHAT_UPDATE_ALL` permission

**Response**:
```json
{
  "statusCode": 200,
  "message": "Joined conversation",
  "data": {
    "success": true
  }
}
```

**Side Effects**:
- Conversation status changes: `PENDING` → `ACTIVE`
- User receives `chat:adminJoined` WebSocket event

**Use Case**: Admin clicks "Accept" on pending conversation

---

### 6. Close Conversation

**Endpoint**: `PATCH /chat/conversations/:id/close`

**Description**: Close an active conversation (user or admin can close)

**Auth**: User with `CHAT_UPDATE_OWN` permission

**Response**:
```json
{
  "statusCode": 200,
  "message": "Conversation closed",
  "data": {
    "success": true
  }
}
```

**Side Effects**:
- Conversation status changes to `CLOSED`
- Other party receives `chat:conversationClosed` WebSocket event

**Use Case**: User/Admin ends the chat

---

## WebSocket Events

### Events Frontend EMITS (Client → Server)

#### 1. `chat:createConversation`

**Description**: Create new conversation (alternative to REST endpoint)

**Emit**:
```typescript
socket.emit('chat:createConversation', {
  message: 'Hello, I need help!'  // Optional
});
```

**Listen for Response**:
```typescript
socket.on('chat:conversationCreated', (data) => {
  console.log('Conversation:', data.conversation);
  console.log('Is new?', data.isNew);
  // data = { conversation: {...}, isNew: boolean }
});
```

**What Happens**:
1. Conversation created in DB
2. Welcome message sent automatically
3. User joins conversation room
4. Admins receive notification

---

#### 2. `chat:sendMessage`

**Description**: Send a message in conversation

**Emit**:
```typescript
socket.emit('chat:sendMessage', {
  conversationId: 'conv-123',
  content: 'My message text'
});
```

**Listen for Response**:
```typescript
socket.on('chat:newMessage', (message) => {
  // This event is received by EVERYONE in the conversation room
  console.log('New message:', message);
  // Add to chat UI
});
```

**What Happens**:
1. Message saved to DB
2. Message emitted to conversation room
3. Both user and admin receive it instantly

---

#### 3. `chat:joinConversation` (Admin)

**Description**: Admin claims a pending conversation

**Emit**:
```typescript
socket.emit('chat:joinConversation', {
  conversationId: 'conv-123'
});
```

**Listen for Response**:
```typescript
socket.on('chat:conversationJoined', (data) => {
  console.log('Joined conversation:', data.conversationId);
  // Redirect admin to chat interface
});
```

**What Happens**:
1. Admin assigned to conversation
2. Status changes: PENDING → ACTIVE
3. Admin joins conversation room
4. User receives `chat:adminJoined` event

---

#### 4. `chat:typing`

**Description**: Broadcast typing indicator

**Emit**:
```typescript
// User starts typing
socket.emit('chat:typing', {
  conversationId: 'conv-123',
  isTyping: true
});

// User stops typing (after 2-3 seconds of inactivity)
socket.emit('chat:typing', {
  conversationId: 'conv-123',
  isTyping: false
});
```

**Listen for Response**:
```typescript
socket.on('chat:userTyping', (data) => {
  // Filter out own typing indicator
  if (data.userId !== currentUserId) {
    if (data.isTyping) {
      showTypingIndicator(data.userName);
    } else {
      hideTypingIndicator();
    }
  }
});
```

**Best Practice**: Debounce typing events (send max once per second)

---

#### 5. `chat:markAsRead`

**Description**: Mark all messages in conversation as read

**Emit**:
```typescript
socket.emit('chat:markAsRead', {
  conversationId: 'conv-123'
});
```

**No Response**: This is a fire-and-forget event (just marks DB records)

**Use Case**: User opens/focuses on conversation

---

#### 6. `ping`

**Description**: Health check / keep-alive

**Emit**:
```typescript
socket.emit('ping');
```

**Listen for Response**:
```typescript
socket.on('pong', (data) => {
  console.log('Connection alive:', data.timestamp);
});
```

**Use Case**: Check if connection is still active

---

### Events Frontend LISTENS (Server → Client)

#### 1. `connected`

**Description**: Server confirms successful connection

**Listen**:
```typescript
socket.on('connected', (data) => {
  console.log('Connected as:', data.email);
  console.log('User ID:', data.userId);
  console.log('Role:', data.role);
  console.log('Is Admin:', data.isAdmin);

  // Store user data
  setCurrentUser(data);
});
```

**Data**:
```typescript
{
  userId: string;
  email: string;
  role: string;  // "TENANT", "LANDLORD", "ADMIN", etc.
  isAdmin: boolean;
  timestamp: string;
}
```

---

#### 2. `chat:newMessage`

**Description**: New message in conversation (real-time)

**Listen**:
```typescript
socket.on('chat:newMessage', (message) => {
  console.log('New message received:', message);

  // Add to chat UI
  appendMessageToChat(message);

  // Play notification sound (if not from current user)
  if (message.senderId !== currentUserId) {
    playNotificationSound();
  }

  // Update unread count
  incrementUnreadCount();
});
```

**Data**:
```typescript
{
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isSystem: boolean;  // true for welcome messages
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
```

**Important**: This event is sent to ALL users in the conversation room (including the sender)

---

#### 3. `chat:conversationCreated`

**Description**: Response to creating conversation

**Listen**:
```typescript
socket.on('chat:conversationCreated', (data) => {
  if (data.isNew) {
    console.log('New conversation created!');
    // Show welcome message
  } else {
    console.log('Existing conversation loaded');
  }

  setConversation(data.conversation);
  setMessages(data.conversation.messages);
});
```

---

#### 4. `chat:adminJoined`

**Description**: Admin has joined the conversation (sent to user)

**Listen**:
```typescript
socket.on('chat:adminJoined', (data) => {
  console.log('Admin joined:', data.adminId);

  // Show notification
  showNotification('An admin has joined the chat');

  // Update UI
  setConversationStatus('ACTIVE');
});
```

**Data**:
```typescript
{
  conversationId: string;
  adminId: string;
}
```

---

#### 5. `chat:newConversation` (Admin Only)

**Description**: New conversation created (sent to all admins)

**Listen**:
```typescript
// Only for admin dashboard
socket.on('chat:newConversation', (data) => {
  console.log('New support request from:', data.user.firstName);

  // Add to pending list
  addToPendingConversations(data);

  // Show notification
  showNotification(`New chat request from ${data.user.firstName}`);

  // Play alert sound
  playAlertSound();

  // Update badge count
  incrementPendingCount();
});
```

**Data**:
```typescript
{
  conversationId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
  };
  createdAt: string;
}
```

---

#### 6. `chat:userTyping`

**Description**: Someone is typing in the conversation

**Listen**:
```typescript
socket.on('chat:userTyping', (data) => {
  // Don't show own typing indicator
  if (data.userId === currentUserId) return;

  if (data.isTyping) {
    showTypingIndicator(`${data.userName} is typing...`);
  } else {
    hideTypingIndicator();
  }
});
```

**Data**:
```typescript
{
  userId: string;
  userName: string;  // "John Doe"
  isTyping: boolean;
}
```

---

#### 7. `chat:conversationClosed`

**Description**: Conversation has been closed

**Listen**:
```typescript
socket.on('chat:conversationClosed', (data) => {
  console.log('Conversation closed:', data.conversationId);

  // Show message
  showNotification('Conversation has been closed');

  // Disable input
  disableChatInput();

  // Update status
  setConversationStatus('CLOSED');
});
```

---

#### 8. `chat:error`

**Description**: Error occurred during chat operation

**Listen**:
```typescript
socket.on('chat:error', (error) => {
  console.error('Chat error:', error.message);

  // Show error toast
  showErrorToast(error.message);

  // Examples:
  // - "Conversation not found"
  // - "Only admins can join conversations"
  // - "You are not part of this conversation"
});
```

---

#### 9. `user:offline`

**Description**: User disconnected (sent to role room)

**Listen**:
```typescript
socket.on('user:offline', (data) => {
  console.log('User went offline:', data.userId);

  // Update user status in UI
  updateUserStatus(data.userId, 'offline');
});
```

---

#### 10. `system:announcement` (Admin Broadcast)

**Description**: System-wide announcement from admin

**Listen**:
```typescript
socket.on('system:announcement', (data) => {
  console.log('System message:', data.message);

  // Show banner/modal based on type
  if (data.type === 'warning') {
    showWarningBanner(data.message);
  } else if (data.type === 'error') {
    showErrorModal(data.message);
  } else {
    showInfoNotification(data.message);
  }
});
```

**Data**:
```typescript
{
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
  from: 'System';
}
```

---

## Data Structures

### Conversation

```typescript
interface Conversation {
  id: string;
  userId: string;
  adminId: string | null;
  status: 'PENDING' | 'ACTIVE' | 'CLOSED';
  createdAt: string;
  lastMessageAt: string | null;
  deletedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
  };
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  messages: Message[];
}
```

### Message

```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isSystem: boolean;  // true for automated messages (welcome message)
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
```

---

## Implementation Examples

### Complete React/TypeScript Example

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatHookReturn {
  socket: Socket | null;
  conversation: Conversation | null;
  messages: Message[];
  isConnected: boolean;
  sendMessage: (content: string) => void;
  createConversation: (initialMessage?: string) => void;
  startTyping: () => void;
  stopTyping: () => void;
}

export function useChat(): ChatHookReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. LOAD EXISTING CONVERSATION (REST)
    async function loadConversation() {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';
        const response = await fetch(`${baseUrl}/api/chat/my-conversation`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setConversation(data.data);
            setMessages(data.data.messages || []);
          }
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    }

    loadConversation();

    // 2. CONNECT WEBSOCKET
    const token = localStorage.getItem('authToken');
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';
    const newSocket = io(backendUrl, {
      auth: { token }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected');
      setIsConnected(false);
    });

    newSocket.on('connected', (data) => {
      console.log('User data:', data);
    });

    // Chat events
    newSocket.on('chat:newMessage', (message: Message) => {
      console.log('New message:', message);
      setMessages(prev => [...prev, message]);

      // Play sound if not from current user
      if (message.senderId !== data.userId) {
        playNotificationSound();
      }
    });

    newSocket.on('chat:conversationCreated', (data) => {
      setConversation(data.conversation);
      setMessages(data.conversation.messages || []);
    });

    newSocket.on('chat:adminJoined', (data) => {
      alert('An admin has joined the chat!');
      setConversation(prev => prev ? { ...prev, status: 'ACTIVE', adminId: data.adminId } : null);
    });

    newSocket.on('chat:userTyping', (data) => {
      // Show typing indicator (implement based on your UI)
      console.log(`${data.userName} is typing:`, data.isTyping);
    });

    newSocket.on('chat:error', (error) => {
      console.error('Chat error:', error);
      alert(error.message);
    });

    setSocket(newSocket);

    // Cleanup
    return () => {
      newSocket.close();
    };
  }, []);

  // Send message
  const sendMessage = (content: string) => {
    if (!socket || !conversation) return;

    socket.emit('chat:sendMessage', {
      conversationId: conversation.id,
      content
    });
  };

  // Create conversation
  const createConversation = (initialMessage?: string) => {
    if (!socket) return;

    socket.emit('chat:createConversation', {
      message: initialMessage
    });
  };

  // Typing indicators
  const startTyping = () => {
    if (!socket || !conversation) return;
    socket.emit('chat:typing', {
      conversationId: conversation.id,
      isTyping: true
    });
  };

  const stopTyping = () => {
    if (!socket || !conversation) return;
    socket.emit('chat:typing', {
      conversationId: conversation.id,
      isTyping: false
    });
  };

  return {
    socket,
    conversation,
    messages,
    isConnected,
    sendMessage,
    createConversation,
    startTyping,
    stopTyping
  };
}

// Usage in component
function ChatComponent() {
  const {
    messages,
    isConnected,
    conversation,
    sendMessage,
    createConversation,
    startTyping,
    stopTyping
  } = useChat();

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (conversation) {
      sendMessage(inputValue);
    } else {
      createConversation(inputValue);
    }

    setInputValue('');
    stopTyping();
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Debounced typing indicator
    startTyping();

    // Stop typing after 2 seconds of inactivity
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  return (
    <div className="chat-container">
      <div className="connection-status">
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={msg.isSystem ? 'system-message' : 'user-message'}>
            <strong>{msg.sender.firstName}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={inputValue}
          onChange={handleTyping}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={conversation ? 'Type a message...' : 'Start a conversation...'}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
```

### Admin Dashboard Example

```typescript
function AdminDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pendingConversations, setPendingConversations] = useState<Conversation[]>([]);
  const [myConversations, setMyConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Load initial data
    async function loadData() {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';

      // Get pending conversations
      const pending = await fetch(`${baseUrl}/api/chat/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPendingConversations(await pending.json());

      // Get my assigned conversations
      const mine = await fetch(`${baseUrl}/api/chat/my-admin-conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyConversations(await mine.json());
    }

    loadData();

    // Connect WebSocket
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';
    const newSocket = io(backendUrl, {
      auth: { token: localStorage.getItem('authToken') }
    });

    // Listen for new conversations (real-time)
    newSocket.on('chat:newConversation', (data) => {
      console.log('New conversation alert!', data);

      // Add to pending list
      setPendingConversations(prev => [data, ...prev]);

      // Show notification
      showNotification(`New chat from ${data.user.firstName}`);
      playAlertSound();
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const joinConversation = async (conversationId: string) => {
    // Use REST for reliability
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';
    const response = await fetch(`${baseUrl}/api/chat/conversations/${conversationId}/join`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      // Remove from pending
      setPendingConversations(prev => prev.filter(c => c.id !== conversationId));

      // Navigate to chat
      router.push(`/admin/chat/${conversationId}`);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Pending Conversations ({pendingConversations.length})</h2>
      <div className="pending-list">
        {pendingConversations.map(conv => (
          <div key={conv.id} className="conversation-card">
            <p><strong>{conv.user.firstName} {conv.user.lastName}</strong></p>
            <p>{conv.messages[0]?.content}</p>
            <button onClick={() => joinConversation(conv.id)}>Accept</button>
          </div>
        ))}
      </div>

      <h2>My Conversations</h2>
      <div className="active-list">
        {myConversations.map(conv => (
          <div key={conv.id} onClick={() => router.push(`/admin/chat/${conv.id}`)}>
            {conv.user.firstName} - {conv.lastMessageAt}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Flow Diagrams

### User Starting a Conversation

```
User                Frontend              Backend              Database
 |                      |                     |                     |
 |--Click "Start Chat"->|                     |                     |
 |                      |                     |                     |
 |                      |--POST /chat/conversations (REST)--------->|
 |                      |                     |                     |
 |                      |                     |--Create conversation->|
 |                      |                     |                     |
 |                      |                     |--Create welcome msg->|
 |                      |                     |                     |
 |                      |                     |<---Conversation-----|
 |                      |                     |                     |
 |                      |<---Conversation-----|                     |
 |                      |                     |                     |
 |<--Show conversation--|                     |                     |
 |                      |                     |                     |
 |                      |--WebSocket connect->|                     |
 |                      |                     |                     |
 |                      |<--'connected'-------|                     |
 |                      |                     |                     |
 |                      |--Join room: conversation:123------------>|
 |                      |                     |                     |
 |                      |<--'chat:newMessage' (welcome)------------|
 |<--Show welcome msg---|                     |                     |
 |                      |                     |                     |
 |                      |                     |--Notify admins----->|
 |                      |                     |   (admin-notifications room)
```

### Sending a Message

```
User                Frontend              Backend              Admin
 |                      |                     |                     |
 |--Type & Send-------->|                     |                     |
 |                      |                     |                     |
 |                      |--emit('chat:sendMessage')--------------->|
 |                      |   { conversationId, content }            |
 |                      |                     |                     |
 |                      |                     |--Save to DB         |
 |                      |                     |                     |
 |                      |                     |--emitToRoom('conversation:123')
 |                      |                     |   'chat:newMessage' |
 |                      |                     |                     |
 |<-----on('chat:newMessage')-----------------|                     |
 |   (shows own message)|                     |                     |
 |                      |                     |                     |
 |                      |                     |------------------->|
 |                      |                     |    (admin receives  |
 |                      |                     |     real-time)      |
```

### Admin Joining Conversation

```
Admin              Frontend              Backend              User
 |                      |                     |                     |
 |--Click "Accept"----->|                     |                     |
 |                      |                     |                     |
 |                      |--PATCH /conversations/123/join (REST)-->|
 |                      |                     |                     |
 |                      |                     |--Assign admin       |
 |                      |                     |--Status: ACTIVE     |
 |                      |                     |                     |
 |                      |<---Success----------|                     |
 |                      |                     |                     |
 |<--Redirect to chat---|                     |                     |
 |                      |                     |                     |
 |                      |--WebSocket joins room----------------->  |
 |                      |   conversation:123  |                     |
 |                      |                     |                     |
 |                      |                     |--emitToUser-------->|
 |                      |                     |   'chat:adminJoined'|
 |                      |                     |                     |
 |                      |                     |                  (User sees
 |                      |                     |                   "Admin joined")
```

---

## Best Practices

### 1. Connection Management

```typescript
// ✅ GOOD: Handle reconnection
socket.on('connect', () => {
  console.log('Connected');
  // Reload conversation data
  loadConversation();
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Show offline indicator
  setIsOnline(false);
});

// ✅ GOOD: Handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error);
  // Show error message
  // Maybe fall back to REST API
});
```

### 2. Message Deduplication

```typescript
// ✅ GOOD: Prevent duplicate messages
const [messages, setMessages] = useState<Message[]>([]);

socket.on('chat:newMessage', (newMessage) => {
  setMessages(prev => {
    // Check if message already exists
    if (prev.some(msg => msg.id === newMessage.id)) {
      return prev;
    }
    return [...prev, newMessage];
  });
});
```

### 3. Typing Indicators (Debounced)

```typescript
// ✅ GOOD: Debounce typing events
let typingTimeout: NodeJS.Timeout;

const handleTyping = () => {
  // Start typing
  socket.emit('chat:typing', { conversationId, isTyping: true });

  // Clear previous timeout
  clearTimeout(typingTimeout);

  // Stop typing after 2 seconds
  typingTimeout = setTimeout(() => {
    socket.emit('chat:typing', { conversationId, isTyping: false });
  }, 2000);
};
```

### 4. Error Handling

```typescript
// ✅ GOOD: Handle errors gracefully
socket.on('chat:error', (error) => {
  console.error('Chat error:', error);

  // Show user-friendly message
  showToast(error.message, 'error');

  // Maybe retry or fall back to REST
  if (error.message.includes('Conversation not found')) {
    // Reload conversation
    loadConversation();
  }
});
```

### 5. Cleanup

```typescript
// ✅ GOOD: Clean up on unmount
useEffect(() => {
  const socket = io(...);

  // Set up listeners
  socket.on('chat:newMessage', handleNewMessage);

  return () => {
    // Clean up
    socket.off('chat:newMessage', handleNewMessage);
    socket.close();
  };
}, []);
```

### 6. Optimistic UI Updates

```typescript
// ✅ GOOD: Show message immediately, update if fails
const sendMessage = (content: string) => {
  const tempMessage = {
    id: `temp-${Date.now()}`,
    content,
    senderId: currentUserId,
    createdAt: new Date().toISOString(),
    // ... other fields
  };

  // Add to UI immediately
  setMessages(prev => [...prev, tempMessage]);

  // Send via socket
  socket.emit('chat:sendMessage', {
    conversationId,
    content
  });

  // When server responds with real message, replace temp
  socket.on('chat:newMessage', (realMessage) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === tempMessage.id ? realMessage : msg
      )
    );
  });
};
```

### 7. Fallback to REST

```typescript
// ✅ GOOD: Use REST as fallback
const sendMessage = async (content: string) => {
  if (socket && socket.connected) {
    // Try WebSocket first
    socket.emit('chat:sendMessage', { conversationId, content });
  } else {
    // Fall back to REST if WebSocket not available
    const baseUrl = import.meta.env.VITE_BACKEND_URL || 'https://needhomes-backend-staging.onrender.com';
    await fetch(`${baseUrl}/api/chat/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversationId, content })
    });
  }
};
```

---

## Troubleshooting

### Connection Issues

**Problem**: Socket not connecting

**Solutions**:
1. Check JWT token is valid
2. Verify backend URL is correct
3. Check CORS settings
4. Try polling transport: `transports: ['polling']`

```typescript
// Debug connection
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  // Common errors:
  // - "xhr poll error" → CORS issue
  // - "websocket error" → WebSocket blocked
  // - "Invalid token" → JWT expired/invalid
});
```

---

### Not Receiving Messages

**Problem**: `chat:newMessage` not firing

**Solutions**:
1. Verify you joined the conversation room (check backend logs)
2. Ensure socket is connected: `socket.connected === true`
3. Check if you're listening before emitting:

```typescript
// ❌ BAD: Listening after emitting
socket.emit('chat:createConversation', { message: 'Hi' });
socket.on('chat:newMessage', handleMessage); // Too late!

// ✅ GOOD: Listen before emitting
socket.on('chat:newMessage', handleMessage);
socket.emit('chat:createConversation', { message: 'Hi' });
```

---

### Duplicate Messages

**Problem**: Receiving same message multiple times

**Solutions**:
1. Remove old listeners before adding new ones:

```typescript
// ✅ GOOD
socket.off('chat:newMessage'); // Remove old listener
socket.on('chat:newMessage', handleMessage); // Add new
```

2. Use message ID to deduplicate:

```typescript
const [seenMessageIds, setSeenMessageIds] = useState(new Set());

socket.on('chat:newMessage', (message) => {
  if (seenMessageIds.has(message.id)) return;

  setSeenMessageIds(prev => new Set([...prev, message.id]));
  addMessage(message);
});
```

---

### Token Expiration

**Problem**: Socket disconnects when JWT expires

**Solution**: Refresh token and reconnect

```typescript
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // Server disconnected (probably token expired)

    // Refresh token
    const newToken = await refreshAuthToken();

    // Reconnect with new token
    socket.auth = { token: newToken };
    socket.connect();
  }
});
```

---

## Environment Variables

Add these to your frontend `.env` file:

```env
# Production (Staging)
VITE_BACKEND_URL=https://needhomes-backend-staging.onrender.com

# Development (Local)
# VITE_BACKEND_URL=http://localhost:3000

# Frontend URL (for CORS reference)
VITE_FRONTEND_URL=https://needhomespdc.com
```

**Note**: The backend is configured to accept requests from `https://needhomespdc.com`

---

## Testing

### Test with Postman (REST Endpoints)

```bash
# Get my conversation
GET https://needhomes-backend-staging.onrender.com/api/chat/my-conversation
Authorization: Bearer YOUR_JWT_TOKEN

# Create conversation
POST https://needhomes-backend-staging.onrender.com/api/chat/conversations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "Hello, I need help!"
}
```

### Test with Socket.IO Client Tool

Use browser console or socket.io-client library:

```javascript
// In browser console
const socket = io('https://needhomes-backend-staging.onrender.com', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connected', console.log);
socket.on('chat:newMessage', console.log);

socket.emit('chat:createConversation', { message: 'Test' });
```

---

## Summary

### When to Use REST:
- ✅ Initial page load (fetching conversation history)
- ✅ CRUD operations (create, close conversation)
- ✅ When WebSocket is not connected
- ✅ Paginated/filtered queries

### When to Use WebSocket:
- ✅ Sending messages (real-time)
- ✅ Receiving messages (real-time)
- ✅ Typing indicators
- ✅ Presence updates
- ✅ Admin notifications

### Key Points:
1. **Connect WebSocket on app load**, keep it connected
2. **Use REST for initial data**, WebSocket for real-time updates
3. **Always handle connection errors** and have fallbacks
4. **Deduplicate messages** using message IDs
5. **Clean up listeners** on component unmount
6. **Debounce typing indicators** (max 1 per second)

---

## Support

For issues or questions:
- Check backend logs for errors
- Verify JWT token is valid
- Ensure user has correct permissions
- Check WebSocket connection status

**Backend Logs Location**: Console output when running `npm run start:dev`

---

## Quick Reference

### Essential Events

| Event | Direction | Purpose |
|-------|-----------|---------|
| `chat:sendMessage` | Client → Server | Send message |
| `chat:newMessage` | Server → Client | Receive message |
| `chat:createConversation` | Client → Server | Start chat |
| `chat:conversationCreated` | Server → Client | Chat created |
| `chat:adminJoined` | Server → Client | Admin joined |
| `chat:newConversation` | Server → Admin | New support request |
| `chat:typing` | Client → Server | Typing indicator |
| `chat:userTyping` | Server → Client | Someone typing |
| `chat:error` | Server → Client | Error occurred |

### Essential Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat/my-conversation` | GET | Get user's conversation |
| `/chat/conversations` | POST | Create conversation |
| `/chat/pending` | GET | Get pending (admin) |
| `/chat/conversations/:id/join` | PATCH | Admin join |
| `/chat/conversations/:id/close` | PATCH | Close conversation |

---

**Document Version**: 1.0
**Last Updated**: 2024-01-15
**Backend Version**: Compatible with NestJS chat system v1.0
