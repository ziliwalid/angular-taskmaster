import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      // For demo purposes, we'll simulate a successful login
      // In real app, this would call: this.authService.login(credentials)
      setTimeout(() => {
        this.isLoading = false;
        
        // Simulate successful login
        if (credentials.email === 'admin@taskmaster.com' && credentials.password === 'password') {
          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
        }
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'Email' : 'Mot de passe'} requis`;
      }
      if (field.errors['email']) {
        return 'Format email invalide';
      }
      if (field.errors['minlength']) {
        return 'Mot de passe trop court (min 6 caractères)';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && field.touched);
  }
}