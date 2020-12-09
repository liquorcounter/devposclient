export class categoryItem{

    public categoryId : number;
    public expenseName : string;
    public expenseDate : string;
    public expenseAmount : string;
    public total : string;
    public comment : string;
   

    constructor(categoryId : number, expenseName : string){
        this.categoryId=categoryId;
        this.expenseName =expenseName;
    }




}