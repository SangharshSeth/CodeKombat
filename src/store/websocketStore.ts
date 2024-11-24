// useStore.ts (or useStore.js if using JavaScript)
import { create } from 'zustand';
import {Socket} from "socket.io-client";

interface Store {
    webSocket: Socket | null;
    setWebSocket: (socket: Socket) => void;
}

const useStore = create<Store>((set) => ({
    webSocket: null,
    setWebSocket: (socket: Socket) => set({ webSocket: socket }),
}));

export default useStore;
