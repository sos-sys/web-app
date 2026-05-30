import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TellerService } from '../../services/teller.service';

@Component({
  selector: 'app-close-session',
  standalone: false,
  templateUrl: './close-session.component.html',
  styleUrls: ['./close-session.component.scss']
})
export class CloseSessionComponent {
  public physicalTotal: number = 0;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;
  public settlementResult: any = null;

  constructor(private tellerService: TellerService) {}

  public onTotalChanged(total: number): void {
    this.physicalTotal = total;
    this.errorMessage = null;
  }

  public closeSession(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.tellerService.settleCash(this.physicalTotal).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.settlementResult = {
          expectedBalance: result.expectedBalance,
          actualBalance: result.actualBalance,
          discrepancy: result.actualBalance - result.expectedBalance
        };
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to settle cash. Please try again.';
      }
    });
  }
}
