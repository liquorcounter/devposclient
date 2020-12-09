export class saleItem{

    public productId : number;
    public brandNoPackQty : number;
    public brandNo : number;
    public brandName : string;
    public productType : string;
    public quantity : string;
    public packQty : number;
    public packType : string;
    public saleId : string;
    public salePrimaryKey : string;
    public closing : number;
    public unitPrice : number;
    public totalPrice : number;
    public opening : number;
    public singleBottelPrice : string;
    public totalSale : number;
    public saleDate : string;
    public invoiceId : number;
    public caseQty :string;
    public invoiceDate : string;
    public received : number;
    public bottleSaleMrp : string;
    public cummulativePrice : string;
    public category : string;
    public company : string;
    public color : string;
    public categoryOrder : string;
    public companyOrder : string;
    public noOfReturnsBtl : string;
    public invoiceDateAsCopy : string;
    public target : string;
    public lastMonthSold : string;
    public currentMonthSold : string;
    public conditonVal : boolean;
    public qtyBottels : string;
    public barCode : string;
    public highlight : boolean;
    public defined : number;

    constructor(unitPrice : number, closing : number){
        this.closing=closing;
        this.unitPrice =unitPrice;
    }




}