import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TellerDashboardComponent } from './components/teller-dashboard/teller-dashboard.component';
import { OpenSessionComponent } from './components/open-session/open-session.component';
import { ClientTransactionComponent } from './components/client-transaction/client-transaction.component';
import { CurrencyExchangeComponent } from './components/currency-exchange/currency-exchange.component';
import { DailyJournalComponent } from './components/daily-journal/daily-journal.component';
import { CloseSessionComponent } from './components/close-session/close-session.component';
import { tellerGuard } from './guards/teller.guard';

const routes: Routes = [
  { 
    path: '', 
    component: TellerDashboardComponent,
    children: [
      { path: 'open', component: OpenSessionComponent },
      { 
        path: 'workspace',
        canActivateChild: [tellerGuard],
        children: [
          { path: 'transaction', component: ClientTransactionComponent },
          { path: 'exchange', component: CurrencyExchangeComponent },
          { path: 'journal', component: DailyJournalComponent },
          { path: 'close', component: CloseSessionComponent }
        ]
      },
      { path: '', redirectTo: 'open', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TellerRoutingModule { }
