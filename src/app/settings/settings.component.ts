import { Component, OnInit } from '@angular/core';
import { SaleService } from '../sale.service';
import { saleItem} from '../pos/saleitem.model';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { CustomService } from '../custom.service';
import { TerminalModel} from '../settings/terminal.model';
import { SettingsModel} from './settings.model';
//import { localIpV4Address } from '';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private saleService: SaleService,private http : HttpClient,private customService : CustomService) { }
  
   terminals : TerminalModel[];
   card: number =0;
   tabStatus : string;
   tab:number;
   nodeIp : string;
  

  ngOnInit(): void {
    this.getTerminals();
    this.getSettings();
    this.getNodeIp();
  //   localIpV4Address().then(function(ipAddress){
  //     console.log("My IP address is " + ipAddress);
      
  // });
    
  }

  getTerminals(){
    this.http.get<TerminalModel[]>(this.customService.getAllTerminalsurl).subscribe( data =>{
        this.terminals = data;
    });
  }

  getNodeIp(){
    this.http.get<string>(this.customService.getNodeIPurl).subscribe( data =>{
      JSON.parse(JSON.stringify(data),(key,value) =>{
        if(key==="ip"){
          this.nodeIp = value;
        }
     });
  });
  }
  
  getSettings(){
    this.http.get<SettingsModel>(this.customService.getSettingsurl).subscribe( data =>{
      this.card = data.card;
      this.tab = data.tab;
      if(data.tab == 1)
      this.tabStatus = "ENABLED";
      else
      this.tabStatus = "DISABLED";
  });
  }

  updateSettings(){
    if(!(this.card.toString() == "")){
      let payload = {"card" : this.card , "tab" : this.tab};
      this.http.post(this.customService.updateSettingsurl,payload, {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
            })
       }).subscribe(data =>{
         JSON.parse(JSON.stringify(data),(key,value) =>{
           if(key==="message"){
             this.customService.writeLog(localStorage.getItem("tname")+" - "+ value);
          alert(value);
          this.getSettings();
           }
        });
       }) 
    }else{
      alert("please fill Card value");
    }
   
  }


}
