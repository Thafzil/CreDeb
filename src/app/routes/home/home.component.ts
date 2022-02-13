import { animate, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0,0)', opacity: 0 }),
        animate('500ms', style({ transform: 'scale(1,1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate(
          '0ms',
          style({ transform: 'translateY(100%) scale(0,0)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('enterButtonAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0,0)', opacity: 0 }),
        animate('500ms', style({ transform: 'scale(1,1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1,1)', opacity: 1 }),
        animate('500ms', style({ transform: 'scale(0,0)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  mainForm!: FormGroup;
  debits: Transaction[] = [];
  credits: Transaction[] = [];
  openForm: boolean = false;
  constructor(
    private transaction: TransactionsService,
    private _fb: FormBuilder
  ) {
    this.mainForm = this._fb.group({
      type: ['', Validators.required],
      reason: ['', Validators.required],
      cost: ['', [Validators.min(1), Validators.required]],
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
    this.openForm = false;
  }
  getTotal(): number {
    return (
      this.credits.reduce((res: any, current: any) => res + current.cost, 0) -
      this.debits.reduce((res: any, current: any) => res + current.cost, 0)
    );
  }
}
