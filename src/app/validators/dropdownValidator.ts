import { AbstractControl } from '@angular/forms';

export function ValidateDropdown(control: AbstractControl){
    if(control.value == 0){
        return  {  defaultValue : true  }
    }
    return null;
}