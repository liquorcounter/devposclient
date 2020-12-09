import { Injectable } from '@angular/core';
import { BillModal } from './pos/bill.model';
import { Subject } from 'rxjs';
import { saleItem } from './pos/saleitem.model';
import { SaleService } from './sale.service';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { BillModalTest } from './pos/billtest.Model';
import { CustomService } from './custom.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  bill : BillModal;
  allBills : BillModal[] = [];
  billsUpdated = new Subject<BillModal[]>();
  billChanged = new Subject<BillModal>();

  constructor( private saleService : SaleService,private http : HttpClient,private customService : CustomService) {
  //   if(localStorage.getItem("myBills")!==null){
  //   this.allBills = JSON.parse(localStorage.getItem("myBills"));
  // }else{
  //   localStorage.setItem("myBills",JSON.stringify([]));
  // }
   }

   getAllBillsfromDB(mdate){
   
   // alert(this.customService.getAllBillsfromDBurl+'/"'+mdate+'"');
    this.http.get<BillModalTest[]>(this.customService.getAllBillsfromDBurl+'/"'+mdate+'"').subscribe( data =>{
     //console.log("mybills"+mdate+"==>"+JSON.stringify(data));
      let terminalIds = data.map(item => item.bill_id.toString()+item.terminal)
    .filter((value, index, self) => self.indexOf(value) === index)
     let billIds = data.map(item => item.bill_id.toString()+"-"+item.terminal)
    //let billIds = data.map(item => item.bill_id.toString())
  .filter((value, index, self) => self.indexOf(value) === index)
  let finalBills = [];
   for(let i=0;i<billIds.length;i++){
        let myBill = {
         "billID" : billIds[i],
         "date" : "",
         "time" : 0,
         "billName" : "",
         "searchName": "",
         "totalPrice" : 0,
         "cash": 0,
         "card":0,
         "credit":0,
         "upi":0,
         "terminal":"",
         "discountOnBill":0,
         "status": 1,
         "saleBean" : []
         };  
         let totalBillprice =0;
      for(let j=0;j<data.length;j++){
        if(billIds[i] == (data[j].bill_id.toString()+"-"+data[j].terminal)){
       // if(billIds[i] == (data[j].bill_id.toString())){
           totalBillprice = totalBillprice+ data[j].price;
            let item ={
              "brandNoPackQty" : data[j].brandNoPackQty,
              "brandNo": data[j].brandNo,
              "brandName" : data[j].brandName,
              "quantity" : data[j].quantity,
              "packType": data[j].packType,
              "totalSale": data[j].sale,
              "totalPrice": data[j].price,
              "barCode": data[j].barCode,
              "unitPrice": data[j].mrp,
              
            };
            myBill.searchName = myBill.searchName + "-"+ data[j].brandName;
            myBill.date = data[j].bill_date;
            myBill.billName = data[j].billName;
            myBill.time = data[j].timeStamp;
            myBill.cash = data[j].cash;
            myBill.card=data[j].card;
            myBill.credit=data[j].credit;
            myBill.upi=data[j].upi;
            myBill.totalPrice = totalBillprice;
            myBill.terminal = data[j].terminal;
            myBill.discountOnBill = data[j].discount;
            myBill.status = data[j].status;
           myBill.saleBean.push(item);
        }
      }
      finalBills.unshift(myBill);
   }
    this.allBills = finalBills;
    this.customService.writeLog(localStorage.getItem("tname") +" - BILLS LOADED" );
    this.billsUpdated.next(this.allBills);
   //console.log("finalBills" + JSON.stringify(finalBills));
    });
    //return this.allBills;
    //return this.http.get<SaleModel>(this.getSaleUrl);
   }
   


  addProduct(product :saleItem){
    this.customService.writeLog(localStorage.getItem("tname")+" - ADD PRODUCT ===>" + product.brandName+"--"+product.quantity);
    let productExist = false;
    for(const item of this.bill.saleBean){
      if(product.barCode == item.barCode){
        console.log("shiva is here");
        productExist = true;
        item.totalSale = item.totalSale+1;
        item.totalPrice = item.totalSale*item.unitPrice;
        item.highlight = true;
        
      }else{
        item.highlight = false;
      }
    }
    if(!productExist){
      console.log("shiva is not here")
    product.totalSale=1;
    product.totalPrice = 1*product.unitPrice;
    product.highlight = true;
    this.bill.saleBean.unshift(product);
   }
    this.billChanged.next(this.bill);
  //  localStorage.setItem("myBills",JSON.stringify(this.allBills))
  }

  getBillDetails(){
    return this.bill;
  }

  getHighlightedProduct(arrow : number){
    //alert(JSON.stringify(this.bill.saleBean));
    //alert(arrow);
    for(let i=0;i<this.bill.saleBean.length;i++){
      if(this.bill.saleBean[i].highlight && arrow==1){
        return this.bill.saleBean[i-1];
      }else if(this.bill.saleBean[i].highlight && arrow==2){
        return this.bill.saleBean[i+1];
      }else{
       // return this.bill.saleBean[i];
      }
    }
    this.billChanged.next(this.bill);
  }

  getHighlightedProductBill(){
    for(let i=0;i<this.bill.saleBean.length;i++){
      if(this.bill.saleBean[i].highlight){
        return this.bill.saleBean[i];
      }
    }
  }

  createNewBill(mdate :string){
    //let sdate = mdate.split("-");
   // alert(Number(sdate[2]+sdate[1]+sdate[0]+"1"));
    //let newBill =Number(sdate[2]+sdate[1]+sdate[0]+"1");
    let newBill =1;
    this.http.get<string>(this.customService.getMaxBillNourl+'/"'+mdate+'"').subscribe( data =>{
      JSON.parse(JSON.stringify(data),(key,value) =>{
        if(key==="max_bill_no"){
            if(value!=null){
            newBill = value+1;
            //alert(newBill);
          }
           this.bill = new BillModal(mdate, newBill,[],0);
           this.customService.writeLog(localStorage.getItem("tname") +" - Created New Bill - "+ this.bill.billID );
           this.billChanged.next(this.bill);
        }
     });
     
    });
  }
  changeHighlight(product : saleItem){
   // alert(product.barCode);
    for(let i=0;i<this.bill.saleBean.length;i++){
      if(product.barCode === this.bill.saleBean[i].barCode){
           this.bill.saleBean[i].highlight = true;
      }else{
        this.bill.saleBean[i].highlight=false;
      }
     
    }
    this.billChanged.next(this.bill);
  }
  updateProductInBill(qty:number,product :saleItem){
    this.customService.writeLog(localStorage.getItem("tname") +" - updating product - "+ product.brandName +"-"+ product.packType + " with qty - "+ qty );
    for(let i=0;i<this.bill.saleBean.length;i++){
      if(product.barCode === this.bill.saleBean[i].barCode){
        this.bill.saleBean[i].totalSale=qty;
        this.bill.saleBean[i].totalPrice= qty*this.bill.saleBean[i].unitPrice;
        this.bill.saleBean[i].highlight = true;
        
        
      // localStorage.setItem("myBills",JSON.stringify(this.allBills));
        //return;
      }else{
        this.bill.saleBean[i].highlight=false;
      }
      this.billChanged.next(this.bill);
    }
    
  }

  removeProduct(product :saleItem){
    this.customService.writeLog(localStorage.getItem("tname") +" - removing product - "+ product.brandName +"-"+ product.quantity );
    for(let i=0;i<this.bill.saleBean.length;i++){
      if(product.barCode === this.bill.saleBean[i].barCode){
       this.bill.saleBean.splice(i,1);
        this.billChanged.next(this.bill);
        return;
      }
    }
   

  }
   
  saveBill(cash,card,credit,upi,name, totalBill, discountOnBill){
    this.bill.cash =cash;
    this.bill.card = card;
    this.bill.credit=credit;
    this.bill.upi=upi;
    this.bill.discountOnBill = discountOnBill;
    this.bill.terminal = localStorage.getItem("tname");
   if(cash!=0 && card!=0 && credit ==0){
    this.bill.bill_mode ="cashcard";
   }else if(cash==0 && card!=0 && credit==0){
     this.bill.bill_mode="card";
   }else if(cash==0 && card==0 && credit!=0){
     this.bill.bill_mode="credit";
   }else if(upi!=0 && cash==0 && card ==0 && credit==0){
     this.bill.bill_mode="upi";
   }else{
      this.bill.bill_mode="cash";
   }
    
    this.bill.billName = name;
    this.bill.totalPrice = totalBill;
    //this.allBills.unshift(this.bill);
   // console.log("payload==>"+JSON.stringify(this.bill));
    this.customService.writeLog(localStorage.getItem("tname") +" - SAVE BILL ===>" + this.bill.billID +" with mode " + this.bill.bill_mode+" with amount "+ this.bill.totalPrice);
     this.http.post(this.customService.saveBillurl,"["+JSON.stringify(this.bill)+"]", {
       headers: new HttpHeaders({
           'Content-Type':  'application/json',
           })
      }).subscribe(data =>{
        JSON.parse(JSON.stringify(data),(key,value) =>{
          if(key==="message"){
            this.saleService.updateStock(this.bill,1);
            this.createNewBill(this.bill.date);
          }
       });
      }) 
 
     
    
  }

  getAllBills(mdate){
    
    return this.getAllBillsfromDB(mdate);
  }
 
  cancelBill(item : BillModal){
    this.customService.writeLog(localStorage.getItem("tname") +" - CANCEL BILL - "+ item.billID );
    let payload = {"billID" : item.billID.toString().split("-")[0] , "date" : item.date,"terminal" : item.terminal};
    console.log("bill Cancel"+item.billID)
    this.http.post(this.customService.cancelBillurl,payload, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          })
     }).subscribe(data =>{
       JSON.parse(JSON.stringify(data),(key,value) =>{
         if(key==="message"){
          this.getAllBillsfromDB(item.date);
          // alert(value);
           this.saleService.updateStock(item,0);
          
         }
      });
     }) 

  }
  

}
