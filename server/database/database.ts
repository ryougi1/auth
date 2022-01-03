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

  findUserById(userId: string): User {
    let user = undefined;
    if (userId) {
      console.log("Looking for userId ", userId);
      const users = _.values(USERS);
      user = _.find(users, (user) => user.id.toString() === userId);
      console.log("User data found:", user);
    }
    return user;
  }

  findUserByEmail(email: string): User {
    console.log("Finding user by email:", email);
    const users = _.values(USERS);
    const user = _.find(users, (user) => user.email === email);
    console.log("user retrieved:", user);
    return user;
  }
}

export const db = new InMemoryDatabase();
