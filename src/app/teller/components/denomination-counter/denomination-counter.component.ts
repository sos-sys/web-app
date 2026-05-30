import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DenominationBreakdown } from '../../models/teller.model';

@Component({
  selector: 'app-denomination-counter',
  standalone: false,
  templateUrl: './denomination-counter.component.html',
  styleUrls: ['./denomination-counter.component.scss']
})
export class DenominationCounterComponent implements OnInit, OnDestroy {

  @Input() title: string = 'Cash Count';
  @Input() denominations: number[] = [10000, 5000, 2000, 1000, 500, 100, 50, 25, 10, 5];
  
  @Output() totalChanged = new EventEmitter<number>();
  @Output() breakdownChanged = new EventEmitter<DenominationBreakdown[]>();

  public form!: FormGroup;
  public grandTotal: number = 0;
  
  private sub?: Subscription;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private initForm(): void {
    const controls: any = {};
    
    // Create a form control for every denomination, defaulting to 0
    this.denominations.forEach(denom => {
      controls[denom.toString()] = [0]; // default quantity is 0
    });

    this.form = this.fb.group(controls);

    // Reactively calculate totals when any quantity changes
    this.sub = this.form.valueChanges.subscribe(values => {
      this.calculateTotal(values);
    });
  }

  private calculateTotal(values: any): void {
    let total = 0;
    const breakdown: DenominationBreakdown[] = [];

    this.denominations.forEach(denom => {
      const quantity = Number(values[denom.toString()]) || 0;
      total += (denom * quantity);
      
      breakdown.push({
        denomination: denom,
        quantity: quantity
      });
    });

    this.grandTotal = total;
    this.totalChanged.emit(this.grandTotal);
    this.breakdownChanged.emit(breakdown);
  }

  // Helper method for the HTML template to calculate the subtotal of a single row
  public getSubtotal(denom: number): number {
    const qty = Number(this.form.get(denom.toString())?.value) || 0;
    return denom * qty;
  }
}
