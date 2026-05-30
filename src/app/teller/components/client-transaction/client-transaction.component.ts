import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TellerService } from '../../services/teller.service';
import { debounceTime, distinctUntilChanged, switchMap, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-client-transaction',
  standalone: false,
  templateUrl: './client-transaction.component.html',
  styleUrls: ['./client-transaction.component.scss']
})
export class ClientTransactionComponent implements OnInit {
  public searchControl = new FormControl('');
  public searchResults: any[] = [];
  public selectedClient: any | null = null;
  public selectedAccount: any | null = null;
  public isSearching: boolean = false;

  public transactionType: 'DEPOSIT' | 'WITHDRAWAL' = 'DEPOSIT';
  public transactionAmount: number = 0;
  public isLoading: boolean = false;
  public successMessage: string | null = null;

  constructor(private tellerService: TellerService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(query => {
        if (!query || query.trim() === '') {
          this.searchResults = [];
          this.isSearching = false;
        } else {
          this.isSearching = true;
        }
      }),
      filter(query => !!query && query.trim() !== ''),
      switchMap(query => this.tellerService.searchClients(query!))
    ).subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
    });
  }

  public selectClient(client: any): void {
    this.selectedClient = client;
    this.selectedAccount = null; // Reset account selection whenever a new client is picked
    this.searchResults = []; // Hide dropdown
    this.searchControl.setValue('', { emitEvent: false }); // Clear search bar
  }

  public submitTransaction(): void {
    if (this.transactionAmount <= 0 || !this.selectedClient || !this.selectedAccount) return;
    
    this.isLoading = true;
    this.successMessage = null;

    // Simulate API processing delay
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = `Successfully processed ${this.transactionType} of ${this.transactionAmount} XAF for ${this.selectedClient.name} (Account: ${this.selectedAccount.accountType}).`;
      this.transactionAmount = 0; // Reset form after success
    }, 500);
  }
}
