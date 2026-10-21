class NetworkManager {
    constructor() {
        this.roomCode = null;
        this.isHost = false;
    }

    createRoom() {
        this.roomCode = Math.random().toString(36.substring(2, 6)).toUpperCase();
        this.isHost = true;
        alert(`Room created successfully! Your Room Code is: ${this.roomCode}`);
        return this.roomCode;
    }

    joinRoom(code) {
        if (!code) {
            alert('Please enter a valid room code.');
            return false;
        }
        this.roomCode = code.toUpperCase();
        this.isHost = false;
        alert(`Joined room: ${this.roomCode}`);
        return true;
    }
}
