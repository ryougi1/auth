import { User } from "../user";
import { Session } from "./session";
export class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  getUserBySessionId(sessionId: string) {
    const session = this.sessions[sessionId];
    const isSessionValid = session && session.isValid();
    return isSessionValid ? session.user : undefined;
  }
}

export const sessionStore = new SessionStore();
