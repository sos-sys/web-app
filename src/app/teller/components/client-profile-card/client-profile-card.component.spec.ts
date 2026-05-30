import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProfileCardComponent } from './client-profile-card.component';

describe('ClientProfileCardComponent', () => {
  let component: ClientProfileCardComponent;
  let fixture: ComponentFixture<ClientProfileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientProfileCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    (expect(component) as any).toBeTruthy();
  });
});
