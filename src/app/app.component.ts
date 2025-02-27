import { Component } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from "./auth/signup/signup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [LoginComponent, SignupComponent],
})
export class AppComponent {}
