import { Component, OnInit, OnDestroy } from '@angular/core';
import { TellerService } from '../../services/teller.service';
import { TellerSession } from '../../models/teller.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-teller-dashboard',
  standalone: false,
  templateUrl: './teller-dashboard.component.html',
  styleUrls: ['./teller-dashboard.component.scss']
})
export class TellerDashboardComponent implements OnInit, OnDestroy {
  public sessionState: TellerSession | null = null;
  private sub?: Subscription;

  constructor(
    private tellerService: TellerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sub = this.tellerService.activeTeller$.subscribe(session => {
      this.sessionState = session;
      
      if (!session) {
        // Force the user back to the open session screen if no active session
        this.router.navigate(['open'], { relativeTo: this.route });
      } else {
        // Automatically route to Transactions when a session is newly opened,
        // but only if we are currently sitting on the 'open' route.
        const currentUrl = this.router.url;
        if (currentUrl.endsWith('/open') || currentUrl.endsWith('/teller')) {
          this.router.navigate(['workspace/transaction'], { relativeTo: this.route });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  public logout(): void {
    this.tellerService.logout();
    this.router.navigate(['/teller/auth']);
  }
}
