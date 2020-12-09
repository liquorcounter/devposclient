import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  pure: true
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], propertyName: string, order : string): any[] {
    if (propertyName){
        if(order === "desc"){
            return value.sort((a: any, b: any) => {
                if (b[propertyName] > a[propertyName]) {
                    return 1;
                }
            
                if (b[propertyName] < a[propertyName]) {
                    return -1;
                }
            
                return 0;
             });
        }else{
            return value.sort((a: any, b: any) => {
                if (a[propertyName] > b[propertyName]) {
                    return 1;
                }
            
                if (a[propertyName] < b[propertyName]) {
                    return -1;
                }
            
                return 0;
             });
        }
       
    }
     // return value.sort((a: any, b: any) => b[propertyName].toString().localeCompare(a[propertyName]));
    
    else
      return value;
  }

}