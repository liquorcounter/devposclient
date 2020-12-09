import { categoryItem} from './categoryItem.modal';
export class ExpenseModal{

    public edate :string;
    public total :string;
    public expenseCategoryBean : categoryItem[];

    constructor(edate : string, expenseCategoryBean : categoryItem[]){
        this.edate = edate;
        this.expenseCategoryBean=expenseCategoryBean;
    }
}