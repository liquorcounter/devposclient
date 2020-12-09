import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosComponent } from './pos/pos.component';
import { LoginComponent } from './login/login.component';
import { StockComponent } from './stock/stock.component';
import { SettingsComponent } from './settings/settings.component';
import { SnacksComponent } from './snacks/snacks.component';
import { SalesubmitComponent } from './salesubmit/salesubmit.component';

const routes: Routes = [
  {path : '', redirectTo : '/login', pathMatch: 'full'},
  {path : 'pos', component : PosComponent},
  {path : 'login', component : LoginComponent},
  {path : 'stock', component : StockComponent},
  {path : 'settings', component : SettingsComponent},
  {path : 'snacks', component : SnacksComponent},
  {path : 'saleSubmit', component : SalesubmitComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
