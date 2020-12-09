var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../database.sqlite3');

db.serialize(function() {
  // db.run("CREATE TABLE lorem (info TEXT)");
 
  // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();
  db.each("SELECT date ,billStatus FROM bill_master", function(err, row) {
    console.log("sai");
console.log( ": " + row.billStatus);
});
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    console.log("shiva");
    console.log(row.id + ": " + row.info);
    
});


 
 
});


  
 
// function getBillDetails(){
//     let db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
//         if (err) {
//           console.error(err.message);
//         }
//         console.log('Connected to the chinook database.');
//       });

//     //const db = new require('sqlite3').verbose().Database('./database.sqlite3');
//     db.serialize(() => {
//         db.each("SELECT * FROM bill_master", function(err, row) {
//             console.log(row.billID + ": " + row.billName);
//         });
//       });
    
// }
db.close();