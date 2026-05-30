import { Component } from '@angular/core';

@Component({
  selector: 'app-currency-exchange',
  standalone: false,
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.scss']
})
export class CurrencyExchangeComponent {
  public cashInTotal: number = 0;
  public cashOutTotal: number = 0;
  public isLoading: boolean = false;
  public successMessage: string | null = null;

  get netDifference(): number {
    return this.cashInTotal - this.cashOutTotal;
  }

  get isValid(): boolean {
    return this.cashInTotal > 0 && this.cashOutTotal > 0 && this.netDifference === 0;
  }

  public onCashInChanged(total: number): void {
    this.cashInTotal = total;
    this.successMessage = null; // Clear success message if user starts typing again
  }

  public onCashOutChanged(total: number): void {
    this.cashOutTotal = total;
    this.successMessage = null;
  }

  public submitExchange(): void {
    if (!this.isValid) return;
    
    this.isLoading = true;
    this.successMessage = null;

    // Simulate API delay for the BFF processing
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Note exchange processed successfully.';
      
      // In a real app, you might route back to the dashboard here or clear the forms.
      // Since we are mocking, we will just show the success message.
    }, 500);
  }
}
