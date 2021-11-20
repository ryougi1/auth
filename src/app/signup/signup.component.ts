import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css", "../common/forms.css"],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  errors: string[] = [];
  errorCodeMessageMap = {
    min: "The minimum length is 10 characters",
    uppercase: "At least one uppercase character",
    lowercase: "At least one lowercase character",
    digits: "At least one numeric character",
    spaces: "Can not contain spaces",
  };

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
      confirm: ["", Validators.required],
    });
  }

  ngOnInit() {}

  signUp() {
    const val = this.form.value;
    if (val.email && val.password && val.password === val.confirm) {
      this.authService.signUp(val.email, val.password).subscribe(
        () => console.log("User created successfully"),
        (response) => (this.errors = response.error.errors)
      );
    }
  }
}
