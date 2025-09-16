
* * *

# 🎨 Frontend – RAG News Chatbot

This frontend provides the **chat interface** for the RAG-powered news chatbot.  
It allows users to start a session, send queries, view responses (streamed or full), and reset sessions.

* * *

## 🚀 Tech Stack

*   **React** → Component-based UI
    
*   **SCSS** → Modular styling
    
*   **TypeScript** → Type safety (can run in JS too)
    
*   **Fetch API / SSE (Server-Sent Events)** → Communicates with backend APIs
    
*   **LocalStorage** → Persists sessionId between reloads
    

* * *

## ⚙️ Features

*   **Chat UI**
    
    *   Displays messages from user & bot in chat bubbles
        
    *   Supports **streaming responses** (typed-out effect) via SSE
        
    *   Shows sources (article links) if provided by backend
        
*   **Session Handling**
    
    *   Each new user = unique session ID (UUID)
        
    *   Session persists in localStorage
        
    *   Reset button clears Redis history & starts new chat
        
*   **Responsive Design**
    
    *   Clean SCSS styles for desktop & mobile
        

* * *

## 📂 Project Structure

    frontend/
    │── src/
    │   ├── App.jsx               # Main entry
    │   ├── components/
    │   │   ├── ChatWindow.jsx    # Chat window with messages
    │   │   ├── MessageBubble.jsx # Individual message
    │   │   ├── MessageInput.jsx  # Input box
    │   │   └── LoadingIndicator.jsx
    │   ├── services/
    │   │   └── ChatService.js    # API calls to backend
    │   ├── utils/
    │   │   └── session.js        # Session ID handling
    │   ├── styles/
    │   │   └── App.scss          # Global styles
    │── package.json
    │── README.md
     

* * *

## 🧩 Frontend Flow

1.  **Session Setup**
    
    *   On load, frontend checks localStorage for `sessionId`.
        
    *   If none → generate UUID & store it.
        
2.  **Sending Messages**
    
    *   User types → message sent via `POST /chat/:sessionId`.
        
    *   UI updates with user message immediately.
        
    *   Bot response is fetched & rendered.
        
    *   If SSE enabled → response streams word-by-word.
        
3.  **Viewing History**
    
    *   On mount → calls `GET /chat/:sessionId/history`.
        
    *   Messages restored into chat window.
        
4.  **Resetting Chat**
    
    *   Calls `DELETE /chat/:sessionId`.
        
    *   Clears localStorage session & Redis history.
        
    *   UI resets to empty chat.
        

* * *

## 📸 Screens (Example)

*   **Chat screen**: Past messages + input box
    
*   **Streaming bot reply**: Messages appear progressively
    
*   **Reset button**: Starts fresh session
    

* * *

## 🔮 Future Improvements

*   Add **dark/light theme toggle**
    
*   Display **article previews** (title, link, thumbnail)
    
*   Add **voice input/output** for accessibility
    
*   Support **multi-turn streaming** like ChatGPT
    

* * *
