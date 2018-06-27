import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { AtractivoService } from '../../services/atractivo/atractivo.service';
import { ServicioService } from '../../services/servicio/servicio.service';
@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas.component.html',
  styles: []
})
export class GraficasComponent implements OnInit {
  public usuarioSubscription: Subscription;
  public contadorUsuario: number ;
  public clienteSubscription: Subscription;
  public atractivosSubscription: Subscription;
  public serviciosSubscription: Subscription;


  public contArquitectura: number = 0;
  public contMuseo: number = 0;
  public contParque: number = 0;

  public categoriServiciosCont:number[]=[0,0,0,0,0];

  public contadorcliente: number ;
  graficaUsuarios:graficos[] = [];
  public categoriaAtractivos: string[]= ["Arquitectura","Parque","Museo"];
  public categoriaServicios: string[] = [
    'Agencia de viajes',
    'Alojamiento',
    'Comidas y bebidas',
    'Recreación, diversión, esparcimiento',
    'Transporte turístico'
  ];

  constructor(private usuarioService: UsuarioService,
              private atractivoService:AtractivoService,
              private servicioService:ServicioService
  ) { 

    

   
  }

  ngOnInit() {

    this.datosUsuarios();
    this.datosAtractivos();
    this.datosServicios();

   

  }

  datosUsuarios(){
    this.usuarioSubscription =   this.usuarioService.numerodeRegistrosUsuario().snapshotChanges()
    .subscribe(item=>{
      
      this.contadorUsuario = item.length;

      this.clienteSubscription =   this.usuarioService.numerodeRegistrosClientes().snapshotChanges()
      .subscribe(item=>{
        this.contadorcliente = item.length;

        this.graficaUsuarios.push( {
          labels:['Usuario','Administrador'],
          data:[this.contadorUsuario,this.contadorcliente],
          leyenda:'Usuarios',
          type:'doughnut'
        });
 
       
      });

    })

   
  }

  datosAtractivos(){

    this.atractivosSubscription =   this.atractivoService.listadeAtractivos().snapshotChanges()
    .subscribe((item:any)=>{
      
      item.forEach((element, index) => {
        const atractivo:any = element.payload.toJSON();
        if(atractivo.categoria == this.categoriaAtractivos[0]){
          this.contArquitectura ++;
        }else if (atractivo.categoria == this.categoriaAtractivos[1]){
          this.contMuseo ++;
        }else if(atractivo.categoria == this.categoriaAtractivos[2]){
          this.contParque++;
        }

      });

      this.graficaUsuarios.push( {
        labels:this.categoriaAtractivos,
        data:[this.contArquitectura,this.contMuseo,this.contParque],
        leyenda:'Atractivos',
        type:'doughnut'
      });
    })
  }

  datosServicios(){
    this.serviciosSubscription =   this.servicioService.listadeServicios().snapshotChanges()
    .subscribe(item=>{
      
      item.forEach((element, index) => {
        const servicios:any = element.payload.toJSON();
        if(servicios.categoria == this.categoriaServicios[0]){
          this.categoriServiciosCont[0] ++;
        }else if (servicios.categoria == this.categoriaServicios[1]){
          this.categoriServiciosCont[1] ++;
        }else if(servicios.categoria == this.categoriaServicios[2]){
          this.categoriServiciosCont[2] ++;
        }else if (servicios.categoria == this.categoriaServicios[3]){
          this.categoriServiciosCont[3] ++;
        }else if(servicios.categoria == this.categoriaServicios[4]){
          this.categoriServiciosCont[4] ++;
        }
      })

      this.graficaUsuarios.push( {
        labels:this.categoriaServicios,
        data:this.categoriServiciosCont,
        leyenda:'Servicios',
        type:'doughnut'
      });

     
    });


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


   
}

interface graficos {
  labels:string[],
  data:number[],
  type:string,
  leyenda:string 
}
