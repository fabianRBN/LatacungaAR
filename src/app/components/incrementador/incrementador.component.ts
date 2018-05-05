import { Component, OnInit, Input, Output , EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {
  @ViewChild('txtprogress') txtprogress: ElementRef;
  @Input() leyenda:String = 'Leyenda';
  @Input() progress: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();
  constructor() { 
  }

  ngOnInit() {
    
  }
  onChanges(newValue:number){
    // let elemntHtlm: any = document.getElementsByName('progress')[0];
    // console.log(elemntHtlm);
  
      if(newValue <= 0){
        this.progress = 0
      }else if(newValue >= 100){
        this.progress = 100
      }else{
        this.progress = newValue;
      }
      this.txtprogress.nativeElement.value = this.progress;
      this.cambioValor.emit(this.progress);

  }
  cambiaValor(valor){
    if(this.progress <= 0 && valor <=0){
      this.progress = 0;
        return;
    }
    if( this.progress >=100 && valor >=0){
      this.progress = 100;
        return;
    }
    this.progress = this.progress + valor;

    this.cambioValor.emit(this.progress);
    this.txtprogress.nativeElement.focus();
  }


}
