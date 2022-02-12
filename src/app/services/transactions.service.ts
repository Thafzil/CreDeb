import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Transaction {
  type: string;
  id: string;
  cost: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  constructor() {}
  allTransactions: Transaction[] = [];
  getDebits = new BehaviorSubject<Transaction[]>([]);
  getCredits = new BehaviorSubject<Transaction[]>([]);
  addTransaction(addObj: Transaction): Observable<string> {
    this.allTransactions.push({
      type: addObj.type,
      id: addObj.id,
      cost: addObj.cost,
    });
    console.log(addObj);
    const debits = this.allTransactions.filter(
      (trans: Transaction) => trans.type.toLowerCase() === 'debit'
    );

    const credits = this.allTransactions.filter(
      (trans: Transaction) => trans.type.toLowerCase() === 'credit'
    );
    addObj.type === 'credit'
      ? this.getCredits.next(credits)
      : this.getDebits.next(debits);
    return of('Transaction added successfully');
  }

  // getDebits(): Observable<Transaction[]> {
  //   const debits = this.allTransactions.filter(
  //     (trans: Transaction) => trans.type.toLowerCase() === 'debit'
  //   );
  //   return of(debits);
  // }

  // getCredits(): Observable<Transaction[]> {
  //   const credits = this.allTransactions.filter(
  //     (trans: Transaction) => trans.type.toLowerCase() === 'credit'
  //   );
  //   return of(credits);
  // }
}
