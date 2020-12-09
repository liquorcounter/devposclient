import { Component, OnInit } from '@angular/core';
import { SaleService } from '../sale.service';
import { saleItem} from '../pos/saleitem.model';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { CustomService } from '../custom.service';

@Component({
  selector: 'app-snacks',
  templateUrl: './snacks.component.html',
  styleUrls: ['./snacks.component.css']
})
export class SnacksComponent implements OnInit {

  constructor(private saleService: SaleService,private http : HttpClient,private customService : CustomService) { }
  terminalName : string="";
  snacksItems : saleItem[];
  barCode : string="";
  name : string="";
  costPrice : number=0;
  mrp : number=0;
  cover : boolean= false;

  

  ngOnInit(): void {
    this.terminalName = localStorage.getItem("tname");

   this.getSnacksProducts();
    
  }

  getSnacksProducts(){
    this.saleService.fetchSnacks().subscribe(snacksBean => {
      this.customService.writeLog(this.terminalName +" - SNACKS LOADED");
 
      this.snacksItems = snacksBean.reverse();
      });
  }

  deleteSnackProduct(item : saleItem){
    this.http.post(this.customService.deleteSnackurl,item, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          })
     }).subscribe(data =>{
       JSON.parse(JSON.stringify(data),(key,value) =>{
         if(key==="message"){
         alert(value);
         this.customService.writeLog(this.terminalName +" - DELETED SNACK ITEM - " + item.brandName);
         this.getSnacksProducts();
          
         }
      });
     }) 
  }

  addSnackProduct(){
    let terminals =[];
    this.customService.getAllTerminals().subscribe( data =>{
      for(let i=0; i<data.length;i++){
        if(Number(localStorage.getItem("tname")) != data[i].tid  && data[i].status==1){
            terminals.push(data[i].tid);
        }
      }
      if(terminals.length>0)
      alert("Terminals "+terminals.join(", ")+" are loggedIn, Please logOut");
      else{
        this.proceedAddSnackproduct();
      }
  });


   
  }

  proceedAddSnackproduct(){
    if(this.barCode.trim().length<=0 || this.name.trim().length<=0)
    return alert("Please fill BarCode and Name");
    else if(this.costPrice<=0)
    return alert("Please fill cost price without zero");
    else if(this.mrp<=0)
    return alert("please fill MRP without zero");
   
    let payload = {"barCode" : this.barCode , "brandName" : this.name,"singleBottelPrice": this.costPrice,"unitPrice" : this.mrp, "defined" : this.cover};
   // console.log(payload);
    this.http.post(this.customService.addSnackurl,payload, {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
          })
     }).subscribe(data =>{
       JSON.parse(JSON.stringify(data),(key,value) =>{
         if(key==="message"){
          this.customService.writeLog(this.terminalName +" - ADDED SNACK ITEM - " + this.name);
         alert(value);
         this.barCode="";
         this.name=""
         this.costPrice=0;
         this.mrp=0;
         this.getSnacksProducts();
          
         }
      });
     }) 
  }

}
