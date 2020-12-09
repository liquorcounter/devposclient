import { Component, OnInit } from '@angular/core';
import { SaleService } from '../sale.service';
import { saleItem} from '../pos/saleitem.model';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  stockItems : saleItem[];
  searchstock : string;
  saleDate : string;
  show: boolean = false;
  alertText : string ="";
  stockItemsUpdated = new Subject<saleItem[]>();
  constructor(private saleService:SaleService) { }

  ngOnInit(): void {

    this.fetchStock();

  this.stockItemsUpdated.subscribe(data =>{
    this.stockItems=data;
    this.saleDate = this.stockItems[0].saleDate;
  });
  }
  
  fetchStock(){
    this.saleService.fetchStock().subscribe( (data) => {
      console.log(JSON.stringify(data));
      this.stockItems = data;
      this.saleDate = this.stockItems[0].saleDate;
      this.stockItemsUpdated.next(this.stockItems);
  });
  }
  indianRupeeFormat(val: number) {
    return Number(val).toLocaleString('en-IN');
    }

    updateInvoice(){
      this.alertText ="Updating..."
      this.show =true;
      this.saleService.updateInvoice().subscribe( (data) => {
        JSON.parse(JSON.stringify(data),(key,value) =>{
          if(key==="message"){
            this.show=false;
            alert(value);
            this.fetchStock();
          }
       });
        
    });
    }

    updateOpening(){
      this.alertText ="Updating..."
      this.show =true;
      this.saleService.updateOpening().subscribe( (data) => {
        JSON.parse(JSON.stringify(data),(key,value) =>{
          if(key==="message"){
            this.show=false;
            alert(value);
            this.fetchStock();
          }
       });
        
    });
    this.ngOnInit();
    }

    submitSale(){
      let submit = true;
      for(let i=0;i<this.stockItems.length;i++){
        if(this.stockItems[i].closing<0 || this.stockItems[i].totalSale<0){
          submit=false;
          alert("Closing/Sale can't be Negative values");
          return;
        }
      }
      if(submit)
      alert("coming soon..")
     // this.postSaleData();
    }

    // postSaleData(){
    //  this.show=true;
    //   this.saleService.postSaleData(this.stockItems).subscribe((data) =>{
    //     JSON.parse(JSON.stringify(data),(key,value) =>{
    //         if(key==="message"){
    //           console.log(value);
    //           this.alertText=value;
    //          // setTimeout(() => {this.show=true}, 3000);
    //           this.updateOpening();
    //         }
    //      });
         
    //   });
    // }
   

    onChangeQty(value :number,product : saleItem){
      //  this.flashBarCode = product.barCode;
        if(value>0){
          for(let i=0;i<this.stockItems.length;i++){
            if(product.brandNoPackQty === this.stockItems[i].brandNoPackQty){
              this.stockItems[i].closing=value;
              this.stockItems[i].totalSale=(this.stockItems[i].opening+this.stockItems[i].received)-this.stockItems[i].closing;
              this.stockItems[i].totalPrice= this.stockItems[i].totalSale*this.stockItems[i].unitPrice;
            }
            
          }
        }
        this.stockItemsUpdated.next(this.stockItems);
      
      }

}
