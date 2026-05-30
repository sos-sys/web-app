import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-client-profile-card',
  standalone: false,
  templateUrl: './client-profile-card.component.html',
  styleUrls: ['./client-profile-card.component.scss']
})
export class ClientProfileCardComponent {
  @Input() clientName?: string;
  @Input() accountNumber?: string;
  @Input() signatureUrl?: string;
}
