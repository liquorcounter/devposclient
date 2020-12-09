import { saleItem } from './saleitem.model';

export class SaleModel{

    public date :string;
    public saleBean : saleItem[];

    constructor(date : string, saleBean : saleItem[]){
        this.date = date;
        this.saleBean=saleBean;
    }
}