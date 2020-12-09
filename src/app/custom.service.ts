import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';

import { SaleModel } from './pos/sale.model';
import { TerminalModel } from './settings/terminal.model';
import { SettingsModel} from './settings/settings.model';
import { ExpenseModal} from '././salesubmit/expense.model';
import { saleItem } from './pos/saleitem.model';
import { ExpenseService } from './salesubmit/expense.service';

@Injectable({
  providedIn: 'root'
})
export class CustomService {

  constructor(private http : HttpClient, private expenseService : ExpenseService) { }
  shopUrl = "POIZIN-DEMO";
 //myLink = "http://localhost:8080/POIZIN/";
  myLink = "http://apps.zambientsystems.com:1723/"+this.shopUrl+"/";
  getExpensesCatUrl = this.myLink + "mobileView/getExpenseCategory";
  getSaleUrl =  this.myLink + "mobileView/getSaleDetailsForClosing";

  localLink : string = "localhost";
  updateSaleProductsurl ="http://"+this.localLink+":3000/updateSaleProducts";
  fetchStockurl ="http://"+this.localLink+":3000/stock";
  fetchSnacksurl = "http://"+this.localLink+":3000/getSnacks";
  updateInvoiceurl ="http://"+this.localLink+":3000/updateRecieving";
  updateOpeningurl = "http://"+this.localLink+":3000/updateOpening";
  getAllBillsfromDBurl ="http://"+this.localLink+":3000/bills";
  getMaxBillNourl ="http://"+this.localLink+":3000/lastBill";
  saveBillurl ="http://"+this.localLink+":3000/addBill";
  cancelBillurl = "http://"+this.localLink+":3000/cancelBill";
  deleteSnackurl = "http://"+this.localLink+":3000/deleteSnackItem";
  addSnackurl = "http://"+this.localLink+":3000/addSnackItem";
  updateTermStatusurl = "http://"+this.localLink+":3000/updateTermStatus";
  getAllTerminalsurl ="http://"+this.localLink+":3000/getAllTerminals";
  getNodeIPurl ="http://"+this.localLink+":3000/getNodeIp";
  getSettingsurl = "http://"+this.localLink+":3000/settings";
  updateSettingsurl = "http://"+this.localLink+":3000/updateSettings";
  updateSettingsstartTab = "http://"+this.localLink+":3000/updateSettingsstartTab";
  writeLogUrl = "http://"+this.localLink+":3000/writeLog";
  postExpensesUrl = this.myLink + "mobileView/saveExpenses";
  postCashCardUrl = this.myLink + "mobileView/saveCardCashSale";
  postSaleUrl = this.myLink + "mobileView/saveSaleDetailsWithClosing";
  checkServerConnectUrl = "mobileView/getCashCardSaleDate";
  serverSentEventUrl ="http://"+this.localLink+":3000/mysse";
 
  updateUrl(){
    this.myLink = "http://localhost:8080/POIZIN/";
   this.myLink = "http://apps.zambientsystems.com:1723/"+this.shopUrl+"/";
    this.updateSaleProductsurl ="http://"+this.localLink+":3000/updateSaleProducts";
  this.fetchStockurl ="http://"+this.localLink+":3000/stock";
  this.updateInvoiceurl ="http://"+this.localLink+":3000/updateRecieving";
  this.updateOpeningurl = "http://"+this.localLink+":3000/updateOpening";
  this.getAllBillsfromDBurl ="http://"+this.localLink+":3000/bills";
  this.saveBillurl ="http://"+this.localLink+":3000/addBill";
 this.cancelBillurl = "http://"+this.localLink+":3000/cancelBill";
  this.getMaxBillNourl ="http://"+this.localLink+":3000/lastBill";
  this.fetchSnacksurl = "http://"+this.localLink+":3000/getSnacks";
  this.deleteSnackurl = "http://"+this.localLink+":3000/deleteSnackItem";
  this.addSnackurl = "http://"+this.localLink+":3000/addSnackItem";
  this.updateTermStatusurl = "http://"+this.localLink+":3000/updateTermStatus";
  this.getAllTerminalsurl ="http://"+this.localLink+":3000/getAllTerminals";
  this.getSettingsurl = "http://"+this.localLink+":3000/settings";
  this.updateSettingsurl = "http://"+this.localLink+":3000/updateSettings";
  this.updateSettingsstartTab = "http://"+this.localLink+":3000/updateSettingsstartTab";
  this.postExpensesUrl = this.myLink + "mobileView/saveExpenses";
  this.postCashCardUrl = this.myLink + "mobileView/saveCardCashSale";
  this.postSaleUrl = this.myLink + "mobileView/saveSaleDetailsWithClosing";
  this.checkServerConnectUrl = this.myLink +"mobileView/getCashCardSaleDate";
  this.writeLogUrl = "http://"+this.localLink+":3000/writeLog";
  this.getNodeIPurl ="http://"+this.localLink+":3000/getNodeIp";
  this.serverSentEventUrl ="http://"+this.localLink+":3000/mysse";
  }

  getSaleDataFromUrl(){
    //alert(this.shopUrl);
    return this.http.get<SaleModel>('assets/sale.json');
    //return this.http.get<SaleModel>(this.getSaleUrl);
   }

    getconnectivity(url :string){
      return this.http.get<string>("http://"+url+":3000/");
 
    }
    getconnectivitySettings(url :string){
      return this.http.get<TerminalModel[]>("http://"+url+":3000/getAllTerminals");
 
    }

    updateTerminalStatus(tid : number,status : number){
      let payload = {"tid" : tid , "status" : status};
      return this.http.post(this.updateTermStatusurl,payload, {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
            })
       });

    }

    getSettings(){
      return this.http.get<SettingsModel>(this.getSettingsurl);
    }

    getStartTabSettings = () =>{
      let result ;
      this.http.get<SettingsModel>(this.getSettingsurl).subscribe( data =>{
        if(data.tab == 1 && data.starttab ==1)
        result = true;
        else
        result =  false;
      });

      return result;
    }
       
      
    

    getExpenseCategory(){
      return this.http.get<ExpenseModal>(this.getExpensesCatUrl);
    }

    getAllTerminals(){
      return this.http.get<TerminalModel[]>(this.getAllTerminalsurl);
    }

    updateSettings(payload){
   
      this.http.post(this.updateSettingsstartTab,payload, {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
            })
       }).subscribe(data =>{
         JSON.parse(JSON.stringify(data),(key,value) =>{
           if(key==="message"){
         // alert(value);
         
           }
        });
       }) 
    }

    writeLog(msg){
      this.http.post(this.writeLogUrl,{"message" : msg , "tid" : localStorage.getItem("tname") }, {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
            })
       }).subscribe(data =>{
         JSON.parse(JSON.stringify(data),(key,value) =>{
           if(key==="message"){
           }
        });
       }) 
    }

    postExpenses(total, edate){
      console.log("shiva"+JSON.parse(JSON.stringify( this.expenseService.getExpensesList())));
      let postData = null;
      if(this.expenseService.getExpensesList().length>0){
        
      postData = {"total" : total,"eDate" : edate, "expenseDetails" : JSON.parse(JSON.stringify( this.expenseService.getExpensesList())) };
      }else{
      postData = {"total" : total,"eDate" : edate, "expenseDetails" : JSON.parse("[{\"categoryId\":4,\"name\":\"Other\",\"amount\":0,\"comment\":\"\"}]") };
      }
      
      console.log("shiva"+JSON.stringify(postData));
     return this.http.post(this.postExpensesUrl,postData, {
       headers: new HttpHeaders({
         'Content-Type':  'text/plain',
           })
      });
    }

    saveCashCard(cash, card, upi, date){
      let postData = {"cardsaleDetails":{"id":-1,"cardSale":card,"cashSale":cash,"chequeSale": upi,"date": date}};
      console.log(postData);
      return this.http.post(this.postCashCardUrl,postData, {
        headers: new HttpHeaders({
            'Content-Type':  'text/plain',
            })
       });
     }

     postSaleData(saleData : saleItem[]){
      // console.log("paload===>"+JSON.stringify(data));
       return this.http.post(this.postSaleUrl,{"date" : saleData[0].saleDate,"saleBean":saleData}, {
         headers: new HttpHeaders({
             'Content-Type':  'text/plain',
             })
        }); 
     }
     checkServerConnectivity(){
      return this.http.get<String>(this.checkServerConnectUrl);
     }
   
}
