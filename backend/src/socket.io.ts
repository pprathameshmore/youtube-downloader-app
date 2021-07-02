import { Server, Socket } from "socket.io";
import { Events } from "./utils";

export class SocketInit {
  private static _instance: SocketInit;

  socketIo: Server;

  constructor(io: Server) {
    this.socketIo = io;
    this.socketIo.on("connection", (socket: Socket) => {
      console.log("User connected");
    });
    SocketInit._instance = this;
  }

  public static getInstance(): SocketInit {
    return SocketInit._instance;
  }

  public publishEvent(event: Events, data: any) {
    this.socketIo.emit(event, data);
  }
}
