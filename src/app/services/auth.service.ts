import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from "auth0-js";
import * as moment from "moment";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";

const AUTH_CONFIG = {
  clientID: "y1thKjgqTHhLBoeXLowjZPA2iUJ5eeRP",
  domain: "dev-wno-7lrh.us.auth0.com",
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: "token id_token",
    redirectUri: "https://localhost:4200/lessons",
    scope: "openid email",
  });
  private subject = new BehaviorSubject<User>(undefined);
  user$: Observable<User> = this.subject
    .asObservable()
    .filter((user) => !!undefined);

  constructor(private http: HttpClient, private router: Router) {
    if (this.isLoggedIn()) {
      this.userInfo();
    }
  }

  login() {
    this.auth0.authorize({ mode: "login" });
  }

  signUp() {
    this.auth0.authorize({ mode: "signUp" });
  }

  retrieveAuthInfoFromUrl() {
    this.auth0.parseHash((err, authResult) => {
      if (err) {
        console.log("Could not parse the hash", err);
      } else if (authResult && authResult.idToken) {
        console.log("Authentication successful, authResults:", authResult);
        this.setSession(authResult);
        window.location.hash = "";

        this.userInfo();
      }
    });
  }

  private userInfo() {
    this.http
      .put<User>("/api/userinfo", null)
      .shareReplay()
      .do((user) => {
        this.subject.next(user);
      })
      .subscribe();
  }

  private setSession(authResult: any) {
    const expiresAt = moment().add(authResult.expiresIn, "second");
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.auth0.logout({
      returnTo: "https://localhost:4200/lessons",
      client_id: AUTH_CONFIG.clientID,
    });
  }
}
