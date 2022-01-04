import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.retrieveAuthInfoFromUrl();
  }

  signUp() {
    this.authService.signUp();
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
