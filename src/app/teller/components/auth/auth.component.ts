import { Component } from '@angular/core';
import { TellerService } from '../../services/teller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  public username: string = '';
  public password: string = '';
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(
    private tellerService: TellerService,
    private router: Router
  ) {}

  public doLogin(): void {
    if (!this.username || !this.password) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.tellerService.login(this.username, this.password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          // If successful, route to the dashboard (which will cascade to /open)
          this.router.navigate(['/teller']);
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Incorrect username or password. Please try again.';
      }
    });
  }
}
