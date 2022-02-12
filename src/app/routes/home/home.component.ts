import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Transaction,
  TransactionsService,
} from 'src/app/services/transactions.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainForm!: FormGroup;
  debits: Transaction[] = [];
  credits: Transaction[] = [];
  constructor(
    private transaction: TransactionsService,
    private _fb: FormBuilder
  ) {
    this.mainForm = this._fb.group({
      type: ['', Validators.required],
      cost: ['', Validators.min(1)],
    });
  }

  ngOnInit(): void {
    this.transaction.getDebits.subscribe((res: Transaction[]) => {
      this.debits = res;
    });
    this.transaction.getCredits.subscribe((res: Transaction[]) => {
      this.credits = res;
    });
  }
  onSubmit() {
    const addObj: Transaction = {
      type: this.mainForm.controls.type.value,
      cost: this.mainForm.controls.cost.value,
      id: new Date().getMilliseconds().toString(),
    };
    this.transaction.addTransaction(addObj).subscribe((res: string) => {
      console.log(res);
    });
    this.mainForm.reset();
  }
  getTotal(): number {
    return (
      this.credits.reduce((a: any, b: any) => a + b.cost, 0) -
      this.debits.reduce((a: any, b: any) => a + b.cost, 0)
    );
  }
}
