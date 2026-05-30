import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DenominationCounterComponent } from './denomination-counter.component';

describe('DenominationCounterComponent', () => {
  let component: DenominationCounterComponent;
  let fixture: ComponentFixture<DenominationCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DenominationCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DenominationCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    (expect(component) as any).toBeTruthy();
  });
});
