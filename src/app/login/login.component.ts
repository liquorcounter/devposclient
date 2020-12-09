import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { CustomService } from '../custom.service';
import { LoginModal } from './login.model';
import { ActivatedRoute, Params, Router, NavigationEnd  } from '@angular/router';
import { TerminalModel} from '../settings/terminal.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginModal : LoginModal[];
  name : number;
  ip : string;
  alertText : string = "";
  constructor(private customService : CustomService,private route : ActivatedRoute, private router : Router) { }
  @ViewChild('connectBtn') connectBtnElement: ElementRef;
  ngOnInit(): void {
    if(localStorage.getItem("tname") !=null){
      this.name = Number(localStorage.getItem("tname"));
    }
    if(localStorage.getItem("tip") !=null){
      this.ip = localStorage.getItem("tip");
    }

  }

  onSubmit(){
      if(this.name.toString().trim().length<=0 || this.ip.trim()=="")
      return alert("Please fill Terminal Name and IP");
      this.alertText="Connecting...";
      this.connectBtnElement.nativeElement.disabled =true;
      this.customService.getconnectivity(this.ip).subscribe( data =>{
        JSON.parse(JSON.stringify(data),(key,value) =>{
          this.connectBtnElement.nativeElement.disabled =false;
          if(key==="message"){
            this.callSettings();
            // this.alertText=value;
            // localStorage.setItem("tname",this.name);
            // this.customService.localLink = this.ip;
            // this.customService.updateUrl()
            // this.router.navigate( ['/pos'],{relativeTo: this.route}); 
          }
       });
      }, error =>{
        this.alertText="Please check connect IP";
        this.connectBtnElement.nativeElement.disabled =false;
          //alert(JSON.stringify(error));
      })
    }

    changeAlert(text :string){
      this.alertText=text;
    }

    callSettings(){
      this.customService.getconnectivitySettings(this.ip).subscribe( data =>{
        //  JSON.parse(JSON.stringify(data),(key,value) =>{
        //    this.connectBtnElement.nativeElement.disabled =false;
        //    if(key==="message"){
        //      console.log(value);
        //      this.alertText="connected";
        //      localStorage.setItem("tname",this.name);
        //      localStorage.setItem("tip",this.ip);
        //      this.customService.localLink = this.ip;
        //      this.customService.updateUrl()
        //      this.router.navigate( ['/pos'],{relativeTo: this.route}); 
             
        //     // setTimeout(() => {this.show=true}, 3000);
        //    }
        // });
        for(let i=0;i<data.length;i++){
            if(this.name == data[i].tid){
              if(data[i].status==0){
              this.alertText="connected";
             localStorage.setItem("tname",this.name.toString());
             localStorage.setItem("tip",this.ip);
             this.customService.localLink = this.ip;
             this.customService.updateUrl()
             this.customService.updateTerminalStatus(Number(localStorage.getItem("tname")),1).subscribe(data =>{
              JSON.parse(JSON.stringify(data),(key,value) =>{
                if(key==="message"){
                console.log(value);
                this.customService.writeLog("logged To  Terminal - "+ localStorage.getItem("tname"));
                this.router.navigate( ['/pos'],{relativeTo: this.route});
                
                }
             });
            }) ;
            

            }else{
              this.alertText="Terminal ID in Use";
              return;
            } 

            }
        }
        this.alertText="Please check Terminal ID";
       }, error =>{
         this.alertText="Please check DB connection";
         this.connectBtnElement.nativeElement.disabled =false;
           //alert(JSON.stringify(error));
       })
    }
}
