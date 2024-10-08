// NotificationContext.js
import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const NotificationContext = createContext({
    addNotification: ()=>{}
});

const NotificationProvider = ({ children, userId, notifications, setNotifications }) => {
 // const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

    const addNotification=(notificationList)=>{
          setNotifications((prev) => [...prev, notificationList]); // Update notifications
          console.log('Added notification');
    }
    const updateNotifications=(notificationList)=>{
         setNotifications(notificationList);
         console.log('refreshed notifications');
    }

  useEffect(() => {

    const socketIo = io('http://localhost:5000'); // Ensure this matches backend port

    socketIo.on('connect', () => {
      console.log('Connected to WebSocket server');
      socketIo.emit('register', userId); // Replace userId with actual user ID
    });

    socketIo.on('notification', (data) => {
      console.log('Notification received:', data.message);
      setNotifications((prev) => [...prev, data.message]); // Update notifications
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
    });

        return () => {
         if (socketIo) {
             socketIo.off('connect'); // Remove listener
             socketIo.off('notification'); // Remove notification listener
             socketIo.off('disconnect'); // Remove disconnect listener
             socketIo.disconnect(); // Disconnect socket
         }
        };

      }, [userId, setNotifications]); // Add userId as a dependency if needed



  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationProvider, NotificationContext };
