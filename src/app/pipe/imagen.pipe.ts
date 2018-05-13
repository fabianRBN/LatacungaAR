import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name:"imagen"
})

export class ImagenPipe implements PipeTransform{
  transform(value:File) : any{
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(value);
    reader.onloadend=()=> {
      return reader.result;
    }
    
  }
}