import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    withCredentials: true,
});

socket.on('connect', () => {
    console.log('Connected to Socket.IO server with ID:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected from Socket.IO server:', reason);
});

function GetNotifications(callback) {
    socket.on("announcement", (notification) => {
        console.log("New announcement received:", notification);
        callback(notification);
    });
}

export { GetNotifications };
