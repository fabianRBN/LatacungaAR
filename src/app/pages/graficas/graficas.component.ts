import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas.component.html',
  styles: []
})
export class GraficasComponent implements OnInit {
  public usuarioSubscription: Subscription;
  public contadorUsuario: number ;
  public clienteSubscription: Subscription;
  public contadorcliente: number ;
  graficaUsuarios:graficos;
  constructor(private usuarioService: UsuarioService) { 

    

   
  }

  ngOnInit() {

    this.datosUsuarios();

    this.graficaUsuarios= {
      labels:['Usuario','Administrador'],
      data:[this.contadorUsuario,this.contadorcliente],
      leyenda:'Usuarios',
      type:'doughnut'
    }
    
  }

  datosUsuarios(){
    this.usuarioSubscription =   this.usuarioService.numerodeRegistrosUsuario().snapshotChanges()
    .subscribe(item=>{
      
      this.contadorUsuario = item.length;

      console.log("contador usuario:"+this.contadorUsuario);
    })

    this.clienteSubscription =   this.usuarioService.numerodeRegistrosClientes().snapshotChanges()
    .subscribe(item=>{
      this.contadorcliente = item.length;
      console.log("contador cliente:"+this.contadorcliente);
     
    })
  }
    OnDestroy(){
      if(this.usuarioService){
        this.usuarioSubscription.unsubscribe();
      }
      if(this.clienteSubscription){
        this.clienteSubscription.unsubscribe();
      }
    
  }
    // Doughnut

    leyenda:string = 'hola';
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }

    graficos:any = {
      'grafico1':{
        'labels':['Administradores','Turistas'],
        'data':[12,120],
        'type':'doughnut',
        'leyenda':'Turistas'
      },
      'grafico2':{
        'labels':['Hombre','Mujer'],
        'data':[45000,60000],
        'type':'doughnut',
        'leyenda':'Entrevistados'
      },
      'grafico3':{
        'labels':['Si','No', 'Talvez'],
        'data':[24,30,46],
        'type':'doughnut',
        'leyenda':'Encuesta'
      }
    }
   
}

interface graficos {
  labels:string[],
  data:number[],
  type:string,
  leyenda:string 
}
