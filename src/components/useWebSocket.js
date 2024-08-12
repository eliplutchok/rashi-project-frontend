// useWebSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (onMessage) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_API_SOCKET_URL, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    socket.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.current.on('message', (data) => {
      console.log('Received message:', data);
      if (onMessage) {
        onMessage(data);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [onMessage]);

  return socket.current;
};

export default useWebSocket;