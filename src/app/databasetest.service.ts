import { Injectable } from '@angular/core';
import { sqlite3, Database} from 'sqlite3';

@Injectable({
  providedIn: 'root'
})
export class DatabasetestService {
  private _sqlite : sqlite3;
  constructor() { }

  myFunction(){
    alert();
  //  const sqlite3 = require('sqlite3').verbose();
    // let db = new Database('./database.sqlite3', this._sqlite.OPEN_READWRITE, (err) => {
    //   if (err) {
    //     console.error(err.message);
    //   }
    //   console.log('Connected to the chinook database.');
    //   db.serialize(() => {
    //     db.each("SELECT * FROM bill_master", function(err, row) {
    //         console.log(row.billID + ": " + row.billName);
    //     });
    //   });
    // });
  }
}
