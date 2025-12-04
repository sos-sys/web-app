import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../core/authentication/authentication.service';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'mifosx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,         // Required for *ngIf
    ReactiveFormsModule,   // Required for [formGroup] and formControlName
    FaIconComponent
  ]
})
export class LoginComponent implements OnInit {
  
  // Variables your HTML is asking for
  loginForm!: FormGroup;
  passwordInputType: string = 'password';
  loading = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Icon Check:', this.faEye); // If this says "undefined", the import path is broken.
    this.createLoginForm();
  }

  /** 
   * 1. Initialize the form group with validators
   */
  private createLoginForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * 2. The Login Action (Triggered by (ngSubmit))
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginForm.disable(); // Disable inputs while loading

    this.authenticationService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.loginForm.enable();
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          // On success, go to home dashboard
          this.router.navigate(['/'], { replaceUrl: true });
        },
        error: (err) => {
          // Optional: Handle login error here (e.g., show a toast)
          console.error('Login failed', err);
        }
      });
  }

  /**
   * 3. Helper for the "Show/Hide Password" button
   */
  togglePasswordVisibility() {
    this.passwordInputType = this.passwordInputType === 'password' ? 'text' : 'password';
  }

  /**
   * 4. Helper for error messages in HTML
   */
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    } else if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.minlength.requiredLength}`;
    }
    return '';
  }
}