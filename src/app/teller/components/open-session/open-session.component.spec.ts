import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSessionComponent } from './open-session.component';

describe('OpenSessionComponent', () => {
  let component: OpenSessionComponent;
  let fixture: ComponentFixture<OpenSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenSessionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    (expect(component) as any).toBeTruthy();
  });
});
