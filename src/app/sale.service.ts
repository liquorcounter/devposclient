import { Injectable } from '@angular/core';
import { SaleModel } from './pos/sale.model';
import { Subject } from 'rxjs';
import { BillModal} from './pos/bill.model';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { saleItem } from './pos/saleitem.model';
import { CustomService } from './custom.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

 // private saleModel : SaleModel;
 // saleChanged = new Subject<SaleModel>();
  mbill: BillModal ;

  constructor(private http : HttpClient,private customService : CustomService) { }

  // setsaleData(msaleModel){
    
  //   if(localStorage.getItem("todayssale") ==null){
  //     this.saleModel=msaleModel;
      
  //     localStorage.setItem("todayssale",JSON.stringify(this.saleModel));
  //     this.saleChanged.next(this.saleModel);
  //   }else{
  //     this.saleModel = JSON.parse(localStorage.getItem("todayssale"));
  //     this.postOpeninginDB();
  //   }
   
  // }
  // updateStock(bill : BillModal){
  //   this.mbill = bill;
    
  //    for(let i=0; i< this.mbill.saleBean.length;i++){
  //       for(let j=0;j<this.saleModel.saleBean.length;j++){
  //         if(this.mbill.saleBean[i].brandNoPackQty==this.saleModel.saleBean[j].brandNoPackQty){
  //           console.log("firsttime==>"+this.mbill.saleBean[i].totalSale);
  //            this.saleModel.saleBean[j].totalSale = this.saleModel.saleBean[j].totalSale + this.mbill.saleBean[i].totalSale;
  //            console.log("second==>"+this.mbill.saleBean[i].totalSale);
  //            this.saleModel.saleBean[j].closing= this.saleModel.saleBean[j].opening - this.saleModel.saleBean[j].totalSale;
  //            this.saleModel.saleBean[j].totalPrice = this.saleModel.saleBean[j].totalSale*this.saleModel.saleBean[j].unitPrice;

  //         }
  //       }
  //    }
  //    localStorage.setItem("todayssale",JSON.stringify(this.saleModel));
  // }

  updateStock(bill : BillModal, status : number){
       let saleProducts =[];
       for(let i=0;i<bill.saleBean.length;i++){
            const temp = {
              "barCode" : bill.saleBean[i].barCode,
              "brandNoPackQty" : bill.saleBean[i].brandNoPackQty,
              "sale" : bill.saleBean[i].totalSale,
              "status" : status,
            }
            saleProducts.push(temp);
       }

    this.http.post(this.customService.updateSaleProductsurl,JSON.stringify(saleProducts), {
       headers: new HttpHeaders({
           'Content-Type':  'application/json',
           
           })
      }).subscribe(data =>{
        console.log(data);
      }); 
  }

  postOpeninginDB(){
    // console.log("shiva");
    // this.http.post("http://localhost:3000/openingSale",JSON.stringify(this.saleModel.saleBean), {
    //    headers: new HttpHeaders({
    //        'Content-Type':  'application/json',
    //        })
    //   }).subscribe(data =>{
    //     console.log(data);
    //   }) 
  }

  fetchStock(){
    return this.http.get<saleItem[]>(this.customService.fetchStockurl);
  }

  fetchSnacks(){
    return this.http.get<saleItem[]>(this.customService.fetchSnacksurl);
  }

  updateInvoice(){
    return this.http.get<string>(this.customService.updateInvoiceurl);
  }

  updateOpening(){
    return this.http.get<string>(this.customService.updateOpeningurl);
  }

  

 

}
