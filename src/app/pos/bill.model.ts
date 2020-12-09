import { saleItem } from './saleitem.model';

export class BillModal{

    public date :string;
    
    public totalPrice : number;
    public bill_mode : string;
    public cash : number;
    public card : number;
    public credit : number;
    public upi : number;
    public billStatus : string;
    public saleBean : saleItem[];
    public billID : number;
    public qty : number;
    public billName : string;
    public searchName : string;
    public terminal : string;
    public discountOnBill : number;
    public status :number;

    constructor(date : string,billID : number, product : saleItem[], totalPrice : number){
        this.date = date;
        this.billID = billID;
        this.saleBean=product;
        this.totalPrice = totalPrice;
        
    }
}