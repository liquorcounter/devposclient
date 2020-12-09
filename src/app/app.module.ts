import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import  { HttpClientModule} from '@angular/common/http';
import { CustomService } from './custom.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PosComponent } from './pos/pos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BarecodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import {HotkeyModule} from 'angular2-hotkeys';
import { FilterPipe } from './searchfilter.pipe';
import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import { AutofocusDirective } from './autofocus.directive';
import { StockComponent } from './stock/stock.component';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { ThermalPrintModule } from 'ng-thermal-print';
import { SettingsComponent } from './settings/settings.component';
import { SnacksComponent } from './snacks/snacks.component';
import {MatMenuModule} from '@angular/material/menu';
import { SalesubmitComponent } from './salesubmit/salesubmit.component';
import { ExpenseService } from './salesubmit/expense.service';
import {MatStepperModule} from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { OrderByPipe } from './orderBy.pipe';


@NgModule({
  declarations: [
    AppComponent,
    PosComponent,
    LoginComponent,
    FilterPipe,
    AutofocusDirective,
    StockComponent,
    SettingsComponent,
    SnacksComponent,
    SalesubmitComponent,
    
    OrderByPipe
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    BarecodeScannerLivestreamModule,
    MatIconModule,
    ThermalPrintModule,
    MatMenuModule,
    MatStepperModule,
    MatRadioModule,
    HotkeyModule.forRoot()
   
  
  ],
  providers: [CustomService, ExpenseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
