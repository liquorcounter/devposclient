import { Component, OnInit } from '@angular/core';
import { SaleService} from '../sale.service';
import { BillModal} from '../pos/bill.model';
import { BillService} from '../bill.service';
import { ExpenseModal} from './expense.model';
import { CustomService } from '../custom.service';
import { ExpenseService } from './expense.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { expensePost } from './expensepost.model';
import { _getShadowRoot } from '@angular/cdk/platform';
import { saleItem } from '../pos/saleitem.model';
import { SSEServiceService } from '../sseservice.service';
import { SettingsModel } from '../settings/settings.model';
import { ActivatedRoute, Params, Router, NavigationEnd  } from '@angular/router';

@Component({
  selector: 'app-salesubmit',
  templateUrl: './salesubmit.component.html',
  styleUrls: ['./salesubmit.component.css']
})
export class SalesubmitComponent implements OnInit {

  totalLiquorSale : number =0;
  date : string ;
  totalSnacksSale : number =0;
  totalCash: number =0;
  totalCard: number =0;
  totalCredit: number =0;
  totalDiscount: number =0;

  expenseModal : ExpenseModal;
 
  categoryId : number;
  amount :number;
  comment : string = "";
  expensesList : expensePost[];
  totalExpenses : number;
  counterCash :number;
  counterCard : number;
  totalShort : number =0;
  invoiceUpdated : boolean = false;
  value =false;
  tabvalue = true;
  onlyPOS = true;
  showLoader = false;
  alertText = "Loading...";
  cardCharge :number =0;
  totalUPI : number =0;
  counterUPI :  number=0;

  constructor(private saleService : SaleService, private billService :BillService, private customService : CustomService,private expenseService :ExpenseService,public fb: FormBuilder,private sseService: SSEServiceService,private route : ActivatedRoute, private router : Router,) { }

  ngOnInit(): void {
   
  
    this.getSaleItems();
    this.getExpenseCategory();

    this.expensesList = this.expenseService.getExpensesList();
    this.expenseService.selectedExpenseEvent.subscribe((mexpense : expensePost[]) =>{
    this.expensesList = mexpense;
    this.totalExpenses = this.expensesList.reduce((a,b) => { return  a + b.amount},0 );
    this.getShort();
    }
    );
    this.totalExpenses = this.expensesList.reduce((a,b) => { return  a + b.amount},0 );
    this.expenseService.eDateEvent.subscribe((mdate : string) =>{
      this.date = mdate;
  
    });

   this.getShort();
   console.log("shivapos");
   this.getSettings();
  }

  getShort(){
    this.totalShort = ((this.totalLiquorSale+this.totalSnacksSale)-(this.totalExpenses+this.totalDiscount+this.totalCredit+this.counterCash+this.counterCard+this.counterUPI));
  }

  getSaleItems(){
    this.saleService.fetchStock().subscribe(saleBean  =>  {
      this.totalLiquorSale = saleBean.reduce((a,b) => { return  a + b.totalPrice},0 );
      this.date = saleBean[0].saleDate;
      this.billService.getAllBills(this.date);
      this.getCardCash();
     this.getInvoiceupdated(saleBean);
      
       
      });
  }

  getCardCash(){
    this.billService.billsUpdated.subscribe((bills : BillModal[])=>{
   
      this.totalCash = bills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.cash},0 );
      this.totalCard = bills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.card},0 );
      this.totalCredit = bills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.credit},0 );
      this.totalDiscount = bills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.discountOnBill},0 );
      this.totalUPI =  bills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.upi},0 );
      this.counterCash = this.totalCash;
      this.counterUPI = this.totalUPI;
      this.counterCard = Math.round((this.totalCard - (this.totalCard*(this.cardCharge/100))));
      this.saleService.fetchSnacks().subscribe(snacksBean => {
        this.totalSnacksSale = snacksBean.reduce((a,b) => { return  a + (b.totalSale*b.unitPrice)},0);
        this.getShort();
        });
      });
     
  }

  getExpenseCategory(){
    this.customService.getExpenseCategory().subscribe(expenseModal =>{
     // console.log(ExpenseModal);
      this.expenseModal=expenseModal;
    
     
     });
  }

 

  deleteExpense(index){
    this.expenseService.deleteCategory(index);
   
  }

  expenseForm = this.fb.group({
    categoryControl : ['', [Validators.required]],
    amount : ['', [Validators.required]],
    comment : ['', [Validators.nullValidator]]
  });

  saveCategory(){
    if((this.expenseForm.get('categoryControl').value).categoryId>0 && this.expenseForm.get('amount').value>=0){
    if(!this.expenseService.checkavailabilty((this.expenseForm.get('categoryControl').value).categoryId)){
 //   alert ((this.expenseForm.get('categoryControl').value).categoryId + "---" + this.expenseForm.get('amount').value + "---" + this.expenseForm.get('comment').value);
    if(this.expenseForm.get('comment').value!=null)
 this.expenseService.addCategory((this.expenseForm.get('categoryControl').value).categoryId,(this.expenseForm.get('categoryControl').value).expenseName,this.expenseForm.get('amount').value,this.expenseForm.get('comment').value);
   else
   this.expenseService.addCategory((this.expenseForm.get('categoryControl').value).categoryId,(this.expenseForm.get('categoryControl').value).expenseName,this.expenseForm.get('amount').value,"");
 
}else{
    alert((this.expenseForm.get('categoryControl').value).expenseName + "  Category already exists!!")
  }
    this.expenseForm.reset();
  }else{
  alert("Please check Category and Amount");
}
  }

  getInvoiceupdated(saleBean : saleItem[]){
    let value = saleBean.reduce((a,b) => { return  a + b.received},0 );
      if(value>0){
        this.customService.writeLog(localStorage.getItem("tname") +" - INVOICE UPDATED");
        this.invoiceUpdated =  true;
      }else{
        this.customService.writeLog(localStorage.getItem("tname") +" - INVOICE NOT UPDATED");
        this.invoiceUpdated = false;
      }
    
   }

   getSettings(){
    this.customService.getSettings().subscribe( data =>{
      this.cardCharge = data.card;
      if(data.tab==0)
        this.onlyPOS = true;
      else
        this.onlyPOS = false;
  });
  }

  updateSettings(){
    if(this.tabvalue)
    this.customService.updateSettings({"starttab" :1});
    // else
    // this.customService.updateSettings({"starttab" :0});
  }
   
  closeCounter(){
    this.customService.writeLog(localStorage.getItem("tname") +" - CLICKED CLOSE COUNTER SUBMIT");
    this.showLoader = true;
    this.customService.checkServerConnectivity().subscribe(data =>{
      JSON.parse(JSON.stringify(data),(key,value) =>{
        if(key==="message"){
          this.alertText = "Updating Sale...";
          this.saleService.fetchStock().subscribe(saleBean  =>  {
            this.customService.postSaleData(saleBean).subscribe(data =>{
              this.customService.writeLog(localStorage.getItem("tname") +" - UPDATED SALE");
              this.alertText = "Updating Expenses ...";
              this.customService.postExpenses(this.totalExpenses,saleBean[0].saleDate).subscribe(data =>{
                this.customService.writeLog(localStorage.getItem("tname") +" - UPDATED EXPENSES");
                this.alertText = "Updating CardCashDetails...";
                this.customService.saveCashCard(this.counterCash,this.counterCard,(this.totalCredit+this.totalDiscount+this.counterUPI),saleBean[0].saleDate).subscribe(data =>{
                  this.customService.writeLog(localStorage.getItem("tname") +" - UPDATED CARD AND CASH");
                  this.alertText = "Updating Opening...";  
                  this.saleService.updateOpening().subscribe(data => {
                      this.alertText = "Great!!!..Happy Sale..."; 
                      setTimeout(() => {
                        this.showLoader=false
                        this.customService.updateTerminalStatus(Number(localStorage.getItem("tname")),0);
                        this.router.navigate( ['/login'],{relativeTo: this.route});
                      }, 3000);
                    });
                });
              });
            });
          });
        }
     });
    }, error =>{
      this.showLoader = false;
      alert("Please check server connectivity");
    });
   
  }

  indianRupeeFormat(val: number) {
    return Math.ceil(Number(val)).toLocaleString('en-IN');
    }



}
