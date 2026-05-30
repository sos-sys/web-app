import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TellerRoutingModule } from './teller-routing.module';

import { DenominationCounterComponent } from './components/denomination-counter/denomination-counter.component';
import { ClientProfileCardComponent } from './components/client-profile-card/client-profile-card.component';
import { OpenSessionComponent } from './components/open-session/open-session.component';
import { CurrencyExchangeComponent } from './components/currency-exchange/currency-exchange.component';
import { ClientTransactionComponent } from './components/client-transaction/client-transaction.component';
import { DailyJournalComponent } from './components/daily-journal/daily-journal.component';
import { CloseSessionComponent } from './components/close-session/close-session.component';
import { TellerDashboardComponent } from './components/teller-dashboard/teller-dashboard.component';
import { AuthComponent } from './components/auth/auth.component';

@NgModule({
  declarations: [
    DenominationCounterComponent,
    ClientProfileCardComponent,
    OpenSessionComponent,
    CurrencyExchangeComponent,
    ClientTransactionComponent,
    DailyJournalComponent,
    CloseSessionComponent,
    TellerDashboardComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TellerRoutingModule
  ],
  exports: [
    DenominationCounterComponent,
    ClientProfileCardComponent
  ]
})
export class TellerModule { }
