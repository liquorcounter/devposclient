import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { SaleModel } from './sale.model';
import {FormControl} from '@angular/forms';
import {Observable,Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { saleItem} from './saleitem.model';
import { BillService } from '../bill.service';
import { BillModal } from './bill.model';
import {HotkeysService,Hotkey} from 'angular2-hotkeys';
import { SaleService } from '../sale.service';
import { PrintService, UsbDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';
import { CustomService } from '../custom.service';
import { ActivatedRoute, Params, Router, NavigationEnd  } from '@angular/router';
import {  SSEServiceService} from '../sseservice.service';
import { IfStmt } from '@angular/compiler';
import { PrinterModel } from '../printer.model';
import { configure, getLogger } from "log4js";









@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {

  constructor(private printService: PrintService, private billService :BillService,private _hotkeysService: HotkeysService, private saleService : SaleService,private customService :CustomService,private route : ActivatedRoute, private router : Router,private sseService: SSEServiceService) { 
   
    this.usbPrintDriver = new UsbDriver();

    this.printService.isConnected.subscribe((result) => {
      this.status = result;
      if (result) {
        this.customService.writeLog("Connected to printer!!!");
        console.log("Connected to printer!!!");
      } else {
        this.customService.writeLog("Not connected to printer.");
        console.log("Not connected to printer.");
      }
    });
   
   
  }
  saleModel : SaleModel;
  products : saleItem[];
  holdBills : BillModal[] =[];
  stateCtrl = new FormControl();
  filteredStates: Observable<saleItem[]>;
  mbill :BillModal;
  billProducts : saleItem[];
  qty :number =1;
  totalBill:number;
  searchField :string;
  showCash : boolean = false;
  showCard : boolean = false;
  showCardCash : boolean = false;
  showCredit : boolean = false;
  showUPI : boolean = false;
  holdBillsPopup : boolean =false;
  todayBills : BillModal[];
  showAllBills: boolean = false;
  totalSaleToday : number =0;
  totalCardToday:number =0;
  totalCreditToday:number =0;
  totalCashToday:number=0;
  totalSnacksToday:number=0;
  totalCoversToday:number =0;
  totalUPIToday:number=0;
  cardcash:number;
  cash :number;
  billName:string ='';
  change : number;
  barCodeFromScanner : string ='';
  barCodeInputElementFocus : boolean;
  showTodayBillsbool : boolean = true;
  stockItems : saleItem[];
  searchstock : string;
  terminalName :string;
  showAlert :boolean = false;
  myAlertText :string ="";
  flashBarCode : string ="";
  discountOnBill : number =0;
  totalDiscountToday : number =0;
  show: boolean = false;
  alertText : string ="";
  date: string ="";
  totalBillQty : number =0;
  billRetriveDate: Date;
  holdItemsIcon :boolean = false;
  holdItemsSum : number =0;
  myTempboolean : boolean = false;
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  musbPrinter : PrinterModel;
  printer : PrintDriver;
  printWindowSubscription: Subscription;
  openSnacksVal : boolean = false;
  openSettingsVal : boolean = false;
  openClosingCounterVal : boolean =false;
  cardCharge : number =0;
  stockOrderBy :string = "closing";
  shopName ="POS";
 
  
  @ViewChild('barCodeInput') barCodeInputElement: ElementRef;
  @ViewChild('searchInput') searchInputElement: ElementRef;
  @ViewChild('creditInput') creditInputElement: ElementRef;
  @ViewChild('cashcardInput') cashcardInputElement: ElementRef;
  @ViewChild('changeInput') changeInputElement: ElementRef;
  @ViewChild('discountInput') discountInputElement: ElementRef;
  
  

  

  ngOnInit(): void {
    this.shopName = this.customService.shopUrl;
    this.sseService.getServerSentEvent(this.customService.serverSentEventUrl).subscribe(data => {
      console.log(JSON.parse(data.data).msg);
      if(JSON.parse(data.data).msg){
        this.customService.getSettings().subscribe(data =>{
          if(data.tab == 1 && data.starttab ==0){
           this.updateTerminalStatus();
            this.router.navigate( ['/'],{relativeTo: this.route});
          }
        });
        this.customService.getAllTerminals().subscribe(data =>{
          for(let i=0; i<data.length;i++){
            if(data[i].tid === Number(localStorage.getItem("tname"))){
               if(data[i].status ==0)
               this.router.navigate( ['/'],{relativeTo: this.route});
            }
          }
        });
      }
    });
    this.terminalName = localStorage.getItem("tname");
    
    if(localStorage.getItem("holdItems")!=null){
      this.holdItemsIcon = true;
     this.holdItemsSum = JSON.parse(localStorage.getItem("holdItems")).length;
      this.holdBills = JSON.parse(localStorage.getItem("holdItems"));
    }
    this.fetchStock();
   
     this.billService.billChanged.subscribe((bill : BillModal)=>{
      this.mbill = this.billService.getBillDetails()
        this.billProducts = bill.saleBean;
        this.totalBill = this.billProducts.reduce((a,b) => { return  a + b.totalPrice},0 );
        this.totalBillQty = this.billProducts.reduce((a,b) => { return  a + Number(b.totalSale)},0 );
     });

     this.billService.billsUpdated.subscribe((bills : BillModal[])=>{
      this.todayBills = bills;
      this.totalSaleToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.totalPrice},0 );
      this.totalCashToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.cash},0 );
      this.totalCardToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.card},0 );
      this.totalUPIToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.upi},0 );
      this.totalCreditToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.credit},0 );
      this.totalDiscountToday = this.todayBills.filter(({status}) => status == 1).reduce((a,b) => { return  a + b.discountOnBill},0 );
      this.saleService.fetchSnacks().subscribe(snacksBean => {
        this.totalSnacksToday = snacksBean.filter(({defined}) => defined == 0).reduce((a,b) => { return  a + (b.totalSale*b.unitPrice)},0);
        this.totalCoversToday = snacksBean.filter(({defined}) => defined == 1).reduce((a,b) => { return  a + (b.totalSale*b.unitPrice)},0); 
      });
      });
     
     this._hotkeysService.add(new Hotkey(['f1','f2', 'f3','f4','f9','f7','f6','esc','enter','f8','alt+s',"up","down","alt+d","alt+a","alt+m", "ctrl+d","alt+h","alt+p","alt+u"], (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
    this.customService.writeLog(this.terminalName +" - " +combo +" - KEY PRESSED")
      if(combo==="alt+p" ){
      if(this.showCash)
      this.saveBill((this.totalBill-this.discountOnBill),0,0,0,'',true);
      else if(this.showCard)
      this.saveBill(0,(this.totalBill-this.discountOnBill) + ((this.cardCharge/100)*(this.totalBill-this.discountOnBill)),0,0,'',true);
      else if(this.showCardCash)
      this.saveBill(this.cash,((this.totalBill-this.discountOnBill) - this.cash) + (((this.totalBill-this.discountOnBill) - this.cash)*(this.cardCharge/100)),0,0,'',true);
      else if(this.showCredit)
      this.saveBill(0,0,(this.totalBill-this.discountOnBill),0,this.billName,true);
      else if(this.showUPI)
      this.saveBill(0,0,0,(this.totalBill-this.discountOnBill),'',true);

      this.customService.writeLog(this.terminalName +" - given print for bill " + this.mbill.billID );
    }
    
     if(combo==="alt+h" ){
      this.holdBillItems();
    }

    if(combo==="alt+u" ){
      this.holdBillsPopup = true;
    }
     if(combo==="ctrl+d" ){
       this.discountInputElement.nativeElement.focus();
    }
     
     if(combo==="alt+a" ){
       let mproduct : saleItem = this.billService.getHighlightedProductBill();
      this.onChangeQty(mproduct.totalSale+1,mproduct);
    }
    if(combo==="alt+m"){
      let mproduct : saleItem = this.billService.getHighlightedProductBill();
     this.onChangeQty(mproduct.totalSale -1,mproduct);
   }
    
     if(combo==="alt+d"){
       this.removeProduct(this.billService.getHighlightedProductBill());
       this.changeHighlight(this.billService.bill.saleBean[0]);
     }
     if(combo === "up"){
       this.billService.changeHighlight(this.billService.getHighlightedProduct(1));
     }
     if(combo === "down"){
       this.billService.changeHighlight(this.billService.getHighlightedProduct(2));
     } 
     if(combo === "f8"){
        this.barCodeInputElement.nativeElement.focus();
      }
      if(combo === "f1"){
        this.showUPIpopup();
      }
      if(combo === "f2"){
        this.showCashPopup();
      }
      if(combo === "f3"){
        this.showCardpopup();
      }
      if(combo === "f4"){
        this.showCardCashPopup();
      }
      if(combo === "f9"){
         this.showCreditPopup();
      }
    
      if(combo === "f6"){
        this.refresh();
     }
      if(combo === "f7"){
        this.showAllBillsPopup();
     }
     if(combo === "alt+s"){
       this.searchInputElement.nativeElement.focus();
     }
      if(combo === "enter"){
          if(this.showAlert)
          this.closeMyAlert()
          else if(this.holdBillsPopup)
          this.closeAllPopups();
          else if(this.showCash)
          this.saveBill((this.totalBill-this.discountOnBill),0,0,0,'',false);
          else if(this.showCard)
          this.saveBill(0,(this.totalBill-this.discountOnBill) + ((this.cardCharge/100)*(this.totalBill-this.discountOnBill)),0,0,'',false);
          else if(this.showCardCash)
          this.saveBill(this.cash,((this.totalBill-this.discountOnBill) - this.cash) + (((this.totalBill-this.discountOnBill) - this.cash)*(this.cardCharge/100)),0,0,'',false);
          else if(this.showCredit)
          this.saveBill(0,0,(this.totalBill-this.discountOnBill),0,this.billName,false);
          else if(this.showUPI)
          this.saveBill(0,0,0,(this.totalBill-this.discountOnBill),'',false);
          else{
          if(this.barCodeInputElementFocus){
            if(this.barCodeFromScanner.trim().length>0){
              this.customService.writeLog(this.terminalName +" - PRODUCT SCANNED===>" + this.barCodeFromScanner);
             this.addProductToBill(this.getProductByBarcode(this.barCodeFromScanner));
            }else{
              this.showAlertpopup("please scan again!!!!")
            }
          this.barCodeFromScanner ='';
          this.barCodeInputElement.nativeElement.focus();
          }else{
            if(!this.myTempboolean)
            this.showAlertpopup("press f8 to start scanning");
            this.myTempboolean = false;
          }
        }
      }
      if(combo === "esc"){
        this.closeAllPopups();
      }
      let e: ExtendedKeyboardEvent = event;
      e.returnValue = false; // Prevent bubbling
      return e;
  },['INPUT', 'TEXTAREA', 'SELECT']));
  //  this.requestUsb();
    this.getSettings();
  
   
  }

 

  // fetchStock(){
  //   this.saleService.fetchStock().subscribe(saleBean  =>  {
  //     this.products = saleBean;
  //     this.stockItems = saleBean;
  //     this.date = this.products[0].saleDate;
     
  //     //console.log("shivaproducts==>"+JSON.stringify(this.products));
  //     this.billService.createNewBill(this.date);
  //     this.mbill = this.billService.getBillDetails();
      
  //     this.filteredStates = this.stateCtrl.valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(product => product ? this._filterStates(product) : this.products.slice())
  //     );
  //    // this.billService.getAllBillsfromDB();
  //     });
      
      
  // }

  fetchStock(){
    this.saleService.fetchStock().subscribe(saleBean  =>  {
      this.saleService.fetchSnacks().subscribe(snacksBean => {
        this.customService.writeLog(this.terminalName +" - STOCK LOADED");
        this.products = saleBean.concat(snacksBean);
        this.stockItems = saleBean;
        this.date = this.products[0].saleDate;
        this.billService.createNewBill(this.date);
        this.mbill = this.billService.getBillDetails();
        this.filteredStates = this.stateCtrl.valueChanges
        .pipe(
          startWith(''),
          map(product => product ? this._filterStates(product) : this.products.slice())
        );
      });
      });
  }

  private _filterStates(value: string): saleItem[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => (product.brandName.toLowerCase().indexOf(filterValue) === 0  || product.barCode.toLowerCase().indexOf(filterValue) === 0));
    //return this.products.filter(product => (product.brandName.toLowerCase().indexOf(filterValue) === 0 || product.packType.toLowerCase().indexOf(filterValue) === 0));
  }
  onSelectionChangeProduct(product : saleItem,evt:any){
    this.customService.writeLog(this.terminalName +" - PRODUCT SELECTED FROM SEARCH ===>" + product.brandName + "-"+ product.packQty);
    if (evt.source.selected) {
    this.myTempboolean = true;
    this.addProductToBill(product);
    }
  }

  addProductToBill(product : saleItem){
    this.searchInputElement.nativeElement.value="";
    this.stateCtrl.setValue('');
    
    if(product == undefined){
      this.showAlertpopup("No product found, Please browse");
    }else{
      this.billService.addProduct(product);
    }
    
  }

  onChangeQty(value :number,product : saleItem){
    if(value>0)
    this.billService.updateProductInBill(value,product);
    else
    this.showAlertpopup("Quantity can not be zero");
  }

  removeProduct(product : saleItem){
    this.billService.removeProduct(product);
  }

  showAlertpopup(text :string){
    this.myAlertText = text;
    this.showAlert = true;
  }

  showCashPopup(){
   
    this.customService.getSettings().subscribe(data =>{
      if(data.tab == 1 && data.starttab ==1){
        this.showAlertpopup("TAB Entry is in progress, Please Close TAB");
      }else{
        if(this.billProducts.length>0){
          this.customService.writeLog(this.terminalName +" - OPENED CASH POPUP" );
          this.showCash=true;
          this.change=null;
          this.changeInputElement.nativeElement.value='';
          this.changeInputElement.nativeElement.focus();
        }else{
        this.showAlertpopup("Please add atleast one product");
      }
      }
    });
  }

  showCardpopup(){
     this.customService.getSettings().subscribe(data =>{
    if(data.tab == 1 && data.starttab ==1){
      this.showAlertpopup("TAB Entry is in progress, Please Close TAB");
    }else{
    if(this.billProducts.length>0){
      this.customService.writeLog(this.terminalName +" - OPENED CARD POPUP" );
      this.showCard = true; 
    }
    else
    this.showAlertpopup("Please add atleast one product");
  
}
});
  }
  showCardCashPopup(){
    this.customService.getSettings().subscribe(data =>{
      if(data.tab == 1 && data.starttab ==1){
        this.showAlertpopup("TAB Entry is in progress, Please Close TAB");
      }else{
        this.cash =null;
        if(this.billProducts.length>0){
          this.customService.writeLog(this.terminalName +" - OPENED CARD&CASH POPUP" );
           this.showCardCash = true;
           this.cashcardInputElement.nativeElement.value='';
           this.cashcardInputElement.nativeElement.focus();
        }else
          this.showAlertpopup("Please add atleast one product");
 
  }
    });
  }
  closeMyAlert(){
    this.showAlert=false;
    }

  showUPIpopup(){
    this.customService.getSettings().subscribe(data =>{
      if(data.tab == 1 && data.starttab ==1){
        this.showAlertpopup("TAB Entry is in progress, Please Close TAB");
      }else{
        if(this.billProducts.length>0){
          this.customService.writeLog(this.terminalName +" - OPENED UPI POPUP" );
         this.showUPI = true;
        }else
        this.showAlertpopup("Please add atleast one product");
        }
      });
    }

  showCreditPopup(){
    this.customService.getSettings().subscribe(data =>{
      if(data.tab == 1 && data.starttab ==1){
        this.showAlertpopup("TAB Entry is in progress, Please Close TAB");
      }else{
        this.billName=''
        if(this.billProducts.length>0){
          this.customService.writeLog(this.terminalName +" - OPENED CREDIT POPUP" );
          this.showCredit = true;
          this.creditInputElement.nativeElement.value='';
          this.creditInputElement.nativeElement.focus();
        }else
          this.showAlertpopup("Please add atleast one product");
      }
    });
  }

  showAllBillsPopup(){
    this.customService.writeLog(this.terminalName +" - OPENED BILLS POPUP" );
    this.billRetriveDate = new Date( this.date.split("-")[1]+"/"+ this.date.split("-")[2]+"/"+ this.date.split("-")[0]);
    this.showAllBills = true;
    this.showTodayBillsbool = true;
    this.getBills(this.date);
  }

  saveBill(cash,card,credit,upi,name, print){
    if(print){
      let totalOnBill = cash+card+credit+upi;
      if(this.status){
        this.print(Math.ceil(totalOnBill));
        this.billService.saveBill(cash,card,credit,upi,name, this.totalBill, this.discountOnBill);
        this.closeAllPopups();
       this.discountOnBill=0;
      }else
      this.showAlertpopup("Please Enable printer");
    }else{
      this.billService.saveBill(cash,card,credit,upi,name, this.totalBill, this.discountOnBill);
       this.closeAllPopups();
      this.discountOnBill=0;
    }
  }
  
   getBills(bdate){
    this.billService.getAllBills(bdate);
   }

   refresh(){
     this.billService.createNewBill(this.date);
   }

   closeAllPopups(){
      this.customService.writeLog(this.terminalName +" - closed popup");
        this.showCash=false;
        this.showCard=false;
        this.showCardCash= false;
        this.showCredit = false;
        this.showUPI = false;
        this.showAllBills=false;
        //this.openSnacksVal=false;
        this.openSettingsVal=false;
        this.openClosingCounterVal = false;
        this.holdBillsPopup = false;
        this.closeMyAlert();
        this.barCodeInputElement.nativeElement.focus();
   }

  

   getProductByBarcode(barCode){
       if(this.products.length>0){
        for(const item of this.products){
          const mbarCodes = item.barCode.split(",");
          for(let i=0; i< mbarCodes.length; i++){
            if (mbarCodes[i].trim() == barCode){
              this.customService.writeLog(this.terminalName +" - ITEM FOUND===>" + barCode);
              return item;
            }
          }
          
        }
       }else{
        this.customService.writeLog(this.terminalName +" - ITEM NOT FOUND===>" + barCode)
        this.showAlertpopup("No products found")
       }
   }

   showTodayBills(){
    this.billRetriveDate = new Date( this.date.split("-")[1]+"/"+ this.date.split("-")[2]+"/"+ this.date.split("-")[0]);
    this.showTodayBillsbool=true;
    this.getBills(this.date);
   }
   showCurrentStock(){
     this.showTodayBillsbool=false;
    this.fetchStock();
   }

   changeHighlight(product : saleItem){
     this.billService.changeHighlight(product);
   }

   indianRupeeFormat(val: number) {
    return Math.ceil(Number(val)).toLocaleString('en-IN');
    }

    updateInvoice(){
      this.customService.writeLog(this.terminalName +" - CLICKED SYNC INVOICE")
      this.alertText ="Updating..."
      this.show =true;
      this.saleService.updateInvoice().subscribe( (data) => {
        JSON.parse(JSON.stringify(data),(key,value) =>{
          if(key==="message"){
            this.show=false;
            this.customService.writeLog(this.terminalName +" -" + value);
            this.showAlertpopup(value);
            this.showCurrentStock();
          }
       });
        
    });
    }

    updateOpening(){
      this.customService.writeLog(this.terminalName +" - CLICKED SYNC OPENING")
      this.alertText ="Updating..."
      this.show =true;
      this.saleService.updateOpening().subscribe( (data) => {
        JSON.parse(JSON.stringify(data),(key,value) =>{
          if(key==="message"){
            this.show=false;
            this.customService.writeLog(this.terminalName +" -" + value);
            this.showAlertpopup(value);
            this.showCurrentStock();
          }
       });
        
    });
    }

    submitSale(){
      this.showAlertpopup("Coming Soon..");
    }
    getBillsDate(event){
     let d: Date = new Date(event.value);
     this.getBills(d.getFullYear()+"-"+("0" +Number(Number(d.getMonth())+1)).slice(-2) +"-"+("0" + d.getDate()).slice(-2));
    }

    holdBillItems(){
     // this.holdBillsPopup = true;

      if(this.mbill.saleBean.length>0){
       
       
       this.mbill.totalPrice = this.totalBill;
        this.holdBills.push(this.mbill);
     localStorage.setItem("holdItems", JSON.stringify(this.holdBills));
     this.customService.writeLog(this.terminalName +" - bill kept on hold " + this.mbill.saleBean.map((item) => {return item.brandName+"-"+item.quantity+"-"+item.totalSale}).join(" , ") );
     this.holdItemsSum = JSON.parse(localStorage.getItem("holdItems")).length;
     this.holdItemsIcon = true;
     this.refresh();
     }else{
       this.showAlertpopup("No Items to hold ")
     }

    //   if(!this.holdItemsIcon){
    //     if(this.mbill.saleBean.length>0){
    //       this.holdBills.push(this.mbill);
    //    localStorage.setItem("holdItems", JSON.stringify(this.holdBills));
    //    this.customService.writeLog(this.terminalName +" - bill kept on hold " + this.mbill.saleBean.map((item) => {return item.brandName+"-"+item.quantity+"-"+item.totalSale}).join(" , ") );
    //    this.holdItemsSum = (JSON.parse(localStorage.getItem("holdItems")).saleBean).reduce((a,b) => { return  a + b.totalPrice},0 );
    //    this.holdItemsIcon = true;
    //    this.refresh();
    //    }else{
    //      this.showAlertpopup("No Items to hold ")
    //    }
    //  }else{
    //   this.billService.bill.saleBean = JSON.parse(localStorage.getItem("holdItems")).saleBean;
    //   this.customService.writeLog(this.terminalName +" - bill un hold " + this.billService.bill.saleBean.map((item) => {return item.brandName+"-"+item.quantity+"-"+item.totalSale}).join(" , ") );
    //   this.billService.billChanged.next(this.billService.bill);
    //   localStorage.removeItem("holdItems");
    //   this.holdItemsIcon=false;
    //  }
    
     
    }

    requestUsb() {
      this.customService.writeLog("printer connection requested");
      this.usbPrintDriver.requestUsb().subscribe(
        (result) => {
         // console.log("LCUSBDRIVER"+JSON.stringify(result));
          //vendorId,productID 
          console.log("LCSHIVA"+JSON.stringify(this.usbPrintDriver));
          // this.printService.setDriver(this.usbPrintDriver);
          this.musbPrinter = JSON.parse(JSON.stringify(this.usbPrintDriver));
         this.printService.setDriver(new UsbDriver(this.musbPrinter.vendorId,this.musbPrinter.productId),'ESC/POS');
        },
        (error) => {
          console.log(error);
        }
      );
    }
 

    print(totalOnBill : number) {
      this.customService.writeLog("print bill requested");
      
      let text : string ="";
            text =    "                  "+this.shopName+" WINES                   \n"+
                      "                  GACHBOWLI,HYD                 \n\n"+
                      "No: "+this.mbill.billID+" \t\t\t "+this.getDateTime()+"\n"+
                      "------------------------------------------------\n"+
                      "ITEM\nQTY    -    MRP    -    SALE    -    PRICE\n"+
                      "------------------------------------------------\n";
    
      for(let i=0;i<this.billProducts.length;i++){
        text = text + this.billProducts[i].brandName + "\n" + this.billProducts[i].quantity+ "    -    "  + this.billProducts[i].unitPrice+ "    -    "+ this.billProducts[i].totalSale+ "    -    " + this.billProducts[i].totalPrice+"\n";

      }
      text = text + "------------------------------------------------\n"+
                    " \t\t\tTotal Price : "+ totalOnBill+"\n"+
                    "------------------------------------------------\n"+
                    "               www.liquorcounter.in             \n";
     



     console.log(text);
      this.printService
        .init()
        .setBold(true)
        .writeLine(text)
        .setBold(false)
        .feed(6)
        .cut("full")
        .flush();
    }

    printBill(printBill : BillModal){
     if(this.status){
      let text : string ="";
          text =     "                  "+this.shopName+" WINES                   \n"+
                     "                  GACHBOWLI,HYD                 \n\n"+
                    "No: "+printBill.billID+" \t\t\t "+printBill.date+"\n"+
                    "------------------------------------------------\n"+
                    
                       "ITEM\nQTY    -    MRP    -    SALE    -    PRICE\n"+
                       "------------------------------------------------\n";
     
       for(let i=0;i<printBill.saleBean.length;i++){
         text = text + printBill.saleBean[i].brandName + "\n" + printBill.saleBean[i].quantity+ "    -    "  + printBill.saleBean[i].unitPrice+ "    -    "+ printBill.saleBean[i].totalSale+ "    -    " + printBill.saleBean[i].totalPrice+"\n";
 
       }
       text = text + "------------------------------------------------\n"+
                     " \t\t\tTotal Price : "+ Math.ceil(printBill.card+printBill.cash+printBill.credit)+"\n"+
                     "------------------------------------------------\n"+
                     "               www.liquorcounter.in             \n";
      
 
 
 
       console.log(text);
       this.printService
         .init()
         .setBold(true)
         .writeLine(text)
         .setBold(false)
         .feed(6)
         .cut("full")
         .flush();
    
  
  }else{
    this.showAlertpopup("Please Enable printer");
  }
  
}

getDateTime(){
  let date = new Date();
let day = date.getDate();
let monthIndex = date.getMonth();
let year = date.getFullYear();
let minutes = date.getMinutes();
let hours = date.getHours();
let seconds = date.getSeconds();
let myFormattedDate = day+"-"+(monthIndex+1)+"-"+year+" "+ hours+":"+minutes+":"+seconds;
return myFormattedDate;
}


cancelBill(item: BillModal){
  this.billService.cancelBill(item)
}

openSnacksModal(val : boolean){
  this.customService.writeLog(this.terminalName +" - OPEN SNACKS POPUP - "+val);
  if(!val)
  this.ngOnInit();
  this.openSnacksVal = val;

}

openSettingsModal(val : boolean){
  this.customService.writeLog(this.terminalName +" - OPEN SETTINGS POPUP - "+val);
  this.openSettingsVal = val;

}

openClosingCounterModal(val : boolean){
  this.customService.writeLog(this.terminalName +" - CLICKED CLOSED COUNTER");
   if(this.stockItems.some(value => value.closing<0)){
    this.showAlertpopup("Closing Can't be Negative");
  }else{
    let terminals =[];
    this.customService.getAllTerminals().subscribe( data =>{
      for(let i=0; i<data.length;i++){
        if(Number(localStorage.getItem("tname")) != data[i].tid  && data[i].status==1){
            terminals.push(data[i].tid);
        }
      }
      if(terminals.length>0)
      this.showAlertpopup("Terminals "+terminals.join(", ")+" are loggedIn, Please logOut");
      else{
        this.showAllBills=!val;
        this.openClosingCounterVal = val;
      }
  });
   
  }
 
}



updateTerminalStatus(){
  this.customService.updateTerminalStatus(Number(this.terminalName),0).subscribe(data =>{
    JSON.parse(JSON.stringify(data),(key,value) =>{
      if(key==="message"){
      console.log(value);
      this.customService.writeLog(this.terminalName+" - LOGGED OUT");
      this.router.navigate( ['/login'],{relativeTo: this.route});
      }
   });
  }) ;
 
}

unholdItems(position, item){
  
  this.holdBills = JSON.parse(localStorage.getItem("holdItems"));
  if(this.holdBills.length>0){
  this.billService.bill.saleBean = this.holdBills[position].saleBean;
  this.billService
  for(let i=0;i<this.holdBills.length;i++){
    if(i==position)
    this.holdBills.splice(i,1);
  }
  localStorage.setItem("holdItems", JSON.stringify(this.holdBills));
  this.billService.billChanged.next(this.billService.bill);
  this.holdItemsSum = JSON.parse(localStorage.getItem("holdItems")).length;
  this.holdBillsPopup = false;
}else{
  this.showAlertpopup("No Hold Bills")
}
}

getSettings(){
  this.customService.getSettings().subscribe( data =>{
    this.customService.writeLog(this.terminalName+" SETTINGS LOADED");
    this.cardCharge = data.card;
});
}

oncolumnClick(order : string){
 this.stockOrderBy = order;
}

}


