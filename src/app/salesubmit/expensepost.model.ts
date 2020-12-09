export class expensePost{

    public categoryId : number;
    public name : string;
    public amount : number;
    public comment : string;

    constructor(categoryId : number, name : string, amount : number, comment :string ){
        this.categoryId=categoryId;
        this.name=name;
        this.amount=amount;
        this.comment=comment;
    }
}