import * as _ from "lodash";
import { LESSONS, USERS } from "./database-data";
import { User } from "../user";

class InMemoryDatabase {
  userCounter = 0;

  readAllLessons() {
    return _.values(LESSONS);
  }

  createUser(email: string, passwordDigest: string) {
    const usersPerEmail = _.keyBy(_.values(USERS), "email");
    if (usersPerEmail[email]) {
      const message = "An user with that email already exist" + email;
      console.error(message);
      throw new Error(message);
    }

    const id = ++this.userCounter;
    const user: User = {
      id,
      email,
      passwordDigest,
    };
    USERS[id] = user;
    return user;
  }
}

export const db = new InMemoryDatabase();
