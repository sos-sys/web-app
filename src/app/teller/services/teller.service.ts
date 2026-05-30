import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';
import { TellerSession, TellerTransaction } from '../models/teller.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TellerService {

  // The single source of truth for teller authentication
  private authenticatedUserSubject = new BehaviorSubject<any | null>(null);
  public readonly authenticatedUser$ = this.authenticatedUserSubject.asObservable();

  // The single source of truth for the active teller session
  private activeTellerSubject = new BehaviorSubject<TellerSession | null>(null);

  // Public observable for UI components to subscribe to
  public readonly activeTeller$: Observable<TellerSession | null> = this.activeTellerSubject.asObservable();

  private readonly STORAGE_KEY = 'mifos_teller_session';

  constructor() {
    // Hydrate Authentication State
    const cachedAuth = sessionStorage.getItem('mifos_teller_auth');
    if (cachedAuth) {
      try {
        this.authenticatedUserSubject.next(JSON.parse(cachedAuth));
      } catch (e) {
        console.error('Failed to parse cached auth', e);
      }
    }

    // Hydrate Session State
    const cachedSession = sessionStorage.getItem(this.STORAGE_KEY);
    if (cachedSession) {
      try {
        this.activeTellerSubject.next(JSON.parse(cachedSession));
      } catch (e) {
        console.error('Failed to parse cached teller session', e);
      }
    }
  }

  /**
   * Retrieves a snapshot of the current session state.
   * Useful for synchronous checks in Route Guards.
   */
  public getSession(): TellerSession | null {
    return this.activeTellerSubject.getValue();
  }

  public getAuthUser(): any | null {
    return this.authenticatedUserSubject.getValue();
  }

  /**
   * Simulates a teller authentication login.
   */
  public login(pin: string): Observable<boolean> {
    return of(true).pipe(
      delay(800),
      tap(() => {
        const user = { username: 'cashier_01', branch: 'Main Branch' };
        sessionStorage.setItem('mifos_teller_auth', JSON.stringify(user));
        this.authenticatedUserSubject.next(user);
      })
    );
  }

  /**
   * Simulates a teller authentication logout.
   */
  public logout(): void {
    sessionStorage.removeItem('mifos_teller_auth');
    this.authenticatedUserSubject.next(null);
    this.clearSession(); // Automatically lock the till if they log out
  }

  /**
   * Sets the active session state.
   * @param session The new teller session state
   */
  public setSession(session: TellerSession): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
    this.activeTellerSubject.next(session);
  }

  /**
   * Clears the current session state, effectively locking the workspace.
   */
  public clearSession(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.activeTellerSubject.next(null);
  }

  // =======================================================================
  // BFF API Mocks (Phase 1)
  // =======================================================================

  /**
   * Simulates opening the till and allocating cash.
   */
  public allocateCash(amount: number): Observable<TellerSession> {
    return of(null).pipe(
      delay(800), // Simulate network latency
      switchMap(() => {
        if (amount <= 0 || amount > 1000000) {
          // Simulate 400 Bad Request (Vault constraints or negative amount)
          return throwError(() => new HttpErrorResponse({
            error: { message: 'Allocation amount exceeds vault limits or is invalid.' },
            status: 400,
            statusText: 'Bad Request'
          }));
        }
        
        // Success Mock
        const mockSession: TellerSession = {
          status: 'OPEN',
          openingBalance: amount,
          cashier: { id: 1, tellerId: 10, tellerName: 'Main Till', staffId: 4, staffName: 'Jane Doe', description: 'Front Desk Cashier' },
          teller: { id: 10, officeId: 1, officeName: 'Headquarters', name: 'Main Till', status: 'ACTIVE' }
        };
        
        this.setSession(mockSession);
        return of(mockSession);
      })
    );
  }

  /**
   * Simulates closing the till and settling cash back to the vault.
   */
  public settleCash(countedAmount: number): Observable<{ expectedBalance: number, actualBalance: number, status: string }> {
    return of(null).pipe(
      delay(800),
      switchMap(() => {
        const expectedBalance = 500000; // Mocked expected Fineract balance
        const discrepancy = countedAmount - expectedBalance;

        if (Math.abs(discrepancy) > 5000) {
          // Simulate 403 Forbidden (Requires Manager Override)
          return throwError(() => new HttpErrorResponse({
            error: { message: `Discrepancy too large (${discrepancy} XAF). Manager override required.` },
            status: 403,
            statusText: 'Forbidden'
          }));
        }

        // Success Mock
        this.clearSession();
        return of({
          expectedBalance: expectedBalance,
          actualBalance: countedAmount,
          status: 'CLOSED'
        });
      })
    );
  }

  /**
   * Simulates fetching the daily journal from the BFF.
   */
  public getDailyJournal(): Observable<TellerTransaction[]> {
    const mockTransactions: TellerTransaction[] = [
      { id: 'TX-1001', type: 'DEPOSIT', amount: 50000, clientName: 'John Smith', accountNumber: '001293992', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'TX-1002', type: 'WITHDRAWAL', amount: 15000, clientName: 'Alice Johnson', accountNumber: '001293995', timestamp: new Date(Date.now() - 2400000).toISOString() },
      { id: 'TX-1003', type: 'NOTE_EXCHANGE', amount: 10000, timestamp: new Date(Date.now() - 1200000).toISOString() }
    ];

    return of(mockTransactions).pipe(delay(500));
  }

  /**
   * Simulates a debounced client search hitting the BFF.
   */
  public searchClients(query: string): Observable<any[]> {
    if (!query || query.trim().length === 0) {
      return of([]);
    }

    const mockDatabase = [
      {
        id: 101,
        name: 'Alice Johnson',
        accounts: [
          { accountNo: '001293995', accountType: 'Savings' },
          { accountNo: '001293996', accountType: 'Daily Saving' }
        ],
        signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30" font-family="cursive" font-size="24">Alice Johnson</text></svg>'
      },
      {
        id: 102,
        name: 'Bob Smith',
        accounts: [
          { accountNo: '008928374', accountType: 'Savings' }
        ],
        signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30" font-family="cursive" font-size="24">Bob Smith</text></svg>'
      },
      {
        id: 103,
        name: 'Charlie Davis',
        accounts: [
          { accountNo: '004455667', accountType: 'Savings' },
          { accountNo: '004455668', accountType: 'Njangi' },
          { accountNo: '004455669', accountType: 'Loan Repayment' }
        ],
        signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30" font-family="cursive" font-size="24">Charlie Davis</text></svg>'
      }
    ];

    const lowerQuery = query.toLowerCase();
    const results = mockDatabase.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) || 
      c.id.toString().includes(lowerQuery) ||
      c.accounts.some(acc => acc.accountNo.includes(lowerQuery))
    );

    return of(results).pipe(delay(300));
  }
}
