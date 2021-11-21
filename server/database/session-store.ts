import { User } from "../user";
import { Session } from "./session";
export class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }
}

export const sessionStore = new SessionStore();
