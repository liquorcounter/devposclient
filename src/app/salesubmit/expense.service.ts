import { EventEmitter,Injectable } from "@angular/core";
import { expensePost } from './expensepost.model';
import { Subject } from 'rxjs';


@Injectable()
export class ExpenseService{
    
  
    private expenses : expensePost[] = [];
     private eDate : string;
     selectedExpenseEvent = new Subject<expensePost[]>();
     eDateEvent = new Subject<string>();
     
  getExpensesList(){
      
      return this.expenses.slice();
      
  }

  deleteCategory(index : number){
     this.expenses.splice(index,1);
     this.selectedExpenseEvent.next(this.expenses.slice());
  }

  addCategory(id,name,amount,comment){
      this.expenses.push(new expensePost(id,name,amount,comment));
      this.selectedExpenseEvent.next(this.expenses.slice());
  }

  checkavailabilty(id){
     
      for (var i = 0; i < this.expenses.length; i++) {
          if (id == this.expenses[i].categoryId) {
              return true;
          }
      }
      return false;
    
  }

  updateEdate(date){
      this.eDate = date;
      this.eDateEvent.next(this.eDate);
  }

  getEdate(){
      return this.eDate;
  }

}