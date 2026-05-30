import { Component } from '@angular/core';

@Component({
  selector: 'app-client-transaction',
  standalone: false,
  templateUrl: './client-transaction.component.html',
  styleUrls: ['./client-transaction.component.scss']
})
export class ClientTransactionComponent {
  public transactionType: 'DEPOSIT' | 'WITHDRAWAL' = 'DEPOSIT';
  public transactionAmount: number = 0;
  public isLoading: boolean = false;
  public successMessage: string | null = null;

  // Mock client data to pass into the Profile Card
  public mockClient = {
    name: 'Alice Johnson',
    account: '001293995',
    // Example signature (in a real app this would be a secure Base64 string or URL from the API)
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30" font-family="cursive" font-size="24">Alice Johnson</text></svg>'
  };

  public submitTransaction(): void {
    if (this.transactionAmount <= 0) return;
    
    this.isLoading = true;
    this.successMessage = null;

    // Simulate API processing delay
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = `Successfully processed ${this.transactionType} of ${this.transactionAmount} XAF for ${this.mockClient.name}.`;
      this.transactionAmount = 0; // Reset form after success
    }, 500);
  }
}
