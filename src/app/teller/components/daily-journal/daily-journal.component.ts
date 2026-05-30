import { Component, OnInit } from '@angular/core';
import { TellerService } from '../../services/teller.service';
import { TellerTransaction } from '../../models/teller.model';

@Component({
  selector: 'app-daily-journal',
  standalone: false,
  templateUrl: './daily-journal.component.html',
  styleUrls: ['./daily-journal.component.scss']
})
export class DailyJournalComponent implements OnInit {
  public transactions: TellerTransaction[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private tellerService: TellerService) {}

  ngOnInit(): void {
    this.fetchJournal();
  }

  public fetchJournal(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.tellerService.getDailyJournal().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load daily journal. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}
