import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AdminProvider } from './context/AdminContext'; 
import { UserAuthProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import { MessageProvider } from './context/MessageContext';

<script src="https://unpkg.com/peerjs@1.5.5/dist/peerjs.min.js"></script>

const root = ReactDOM.createRoot(document.getElementById('root'));
const userToken = localStorage.getItem('userToken');
root.render(
  <React.StrictMode>
    <UserAuthProvider>
      <AdminProvider>
        <SocketProvider token={userToken}>
          <MessageProvider>
                <App />
          </MessageProvider>
        </SocketProvider>
      </AdminProvider>
    </UserAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
