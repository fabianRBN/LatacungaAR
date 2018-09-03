import { Component, OnInit , OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  //Variable para e uso de unsuscription y manipular la suscricion
  suscription: Subscription;

  constructor() { 

    
    this.suscription =  this.retornarObservador().retry(2) //Retry() sirve para que el observador reintente la ejecucion del codigo 
      .subscribe( 
        // Primera fase de obserbador
        numero=>{console.log('Numero:',numero)},
        // Fase de error
        error=>{console.log('error',error)},
        //Fase de observador completo 
        ()=> {console.log('el observable termino')}
      );
  }



  ngOnInit() {
  }

  ngOnDestroy() {
    
    this.suscription.unsubscribe();
    
  }
  retornarObservador(): Observable<any> {
    return new Observable(observer => {
      let contador = 0;
      
      let intervalo = setInterval(()=>{
        contador += 1;
        let valorM = {
        valor: contador
      };
        observer.next(valorM);

        // if(contador ===3){
        //   clearInterval(intervalo);
        //   observer.complete();
        // }
        // if(contador === 2){
        //   clearInterval(intervalo);
        //   observer.error('error');
        // }
      },500);
    }).map( (valorM:any) => {
        return (valorM.valor);
    }).filter( (valor:any) => {
        if(valor % 2 ===1){
          return true;
        }else{
          return false;
        }
    });
  }
}
