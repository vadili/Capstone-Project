import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
    withCredentials: true,
});

socket.on('connect', () => { });

socket.on('disconnect', (reason) => { });

function GetNotifications(callback) {
    socket.on("announcement", (notification) => {
        callback(notification);
    });
}

export { GetNotifications };
