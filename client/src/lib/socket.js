import { io } from 'socket.io-client'

export const socket = io('/', { withCredentials: true, autoConnect: false })

export function connectSocket() {
  if (!socket.connected) socket.connect()
}

