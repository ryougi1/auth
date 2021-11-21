import { User } from "../user";
import { Session } from "./session";
export class SessionStore {
  private sessions: { [key: string]: Session } = {};

  createSession(sessionId: string, user: User) {
    this.sessions[sessionId] = new Session(sessionId, user);
  }

  getUserBySessionId(sessionId: string) {
    const session = this.sessions[sessionId];
    return this.isSessionValid(session) ? session.user : undefined;
  }

  isSessionValid(sessionId: any): boolean {
    const session = this.sessions[sessionId];
    return session && session.isValid();
  }
}

export const sessionStore = new SessionStore();
