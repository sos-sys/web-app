import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-open-session',
  standalone: false,
  templateUrl: './open-session.component.html',
  styleUrls: ['./open-session.component.scss']
})
export class OpenSessionComponent {
  public currentTotal: number = 0;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public successMessage: string | null = null;

  constructor(private tellerService: TellerService) {}

  public onTotalChanged(total: number): void {
    this.currentTotal = total;
    // Clear errors if the user changes the amount after a failure
    this.errorMessage = null;
  }

  public openSession(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.tellerService.allocateCash(this.currentTotal).subscribe({
      next: (session) => {
        this.isLoading = false;
        this.successMessage = `Session successfully opened! Allocated Float: ${session.openingBalance} XAF`;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to open session. Please try again.';
      }
    });
  }
}
