import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { LessonsComponent } from "./lessons/lessons.component";
import { RouterModule } from "@angular/router";
import { routesConfig } from "./routes.config";
import { LessonsService } from "./services/lessons.service";
import { ReactiveFormsModule } from "@angular/forms";

import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";
import "rxjs/add/operator/shareReplay";
import "rxjs/add/operator/do";
import "rxjs/add/operator/filter";

import { AuthService } from "./services/auth.service";
import { AuthInterceptor } from "./services/auth.interceptor";

@NgModule({
  declarations: [AppComponent, LessonsComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routesConfig),
    ReactiveFormsModule,
  ],
  providers: [
    LessonsService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
