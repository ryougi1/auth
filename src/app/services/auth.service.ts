import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { User } from "../model/user";

export const ANONYMOUS_USER: User = {
  id: undefined,
  email: "",
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private subject = new BehaviorSubject<User>(undefined);

  user$: Observable<User> = this.subject
    .asObservable()
    .pipe(filter((user) => !!user));
  isLoggedIn$: Observable<boolean> = this.user$.map((user) => !!user.id);
  isLoggedOut$: Observable<boolean> = this.isLoggedIn$.map(
    (isLoggedIn) => !isLoggedIn
  );

  constructor(private http: HttpClient) {
    http
      .get<User>("/api/user")
      .subscribe((user) => this.subject.next(user ? user : ANONYMOUS_USER));
  }

  signUp(email: string, password: string): Observable<User> {
    // shareReplay so it's cached but also retry-able
    return this.http
      .post<User>("/api/signup", { email, password })
      .shareReplay()
      .do((user) => this.subject.next(user));
  }
}
