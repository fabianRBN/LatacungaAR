import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Atractivo } from '../../../models/atractivo.model';
import { Subscription } from "rxjs/Subscription";
import { AtractivoService } from "../../../services/service.index";
import { Imagenes } from "../../../models/imagenes.model";
import { ArchivoService } from '../../../services/archivo/archivo.service';
import { GeoAtractivoService } from '../../../services/atractivo/geo-atractivo.service';



@Component({
  selector: "app-atractivo",
  templateUrl: "./atractivo.component.html",
  styleUrls: ["./atractivo.component.css"]
})
export class AtractivoComponent implements OnInit {
  // Variables para realizar busqueda
  public estadoInput = 0;
  public start: BehaviorSubject<string | null>;
  public end: BehaviorSubject<string | null>;
  // Variable para paginacion
  public pagina = 1;

  // Variables y Objetos de atractivos
  public listaAtractivos: Atractivo[];
  public uidAtractivo: string;
  private atractivosSubscription: Subscription = null;
  public atractivoTemp= new Atractivo();
  public valor: number = 0;

  public estilo: string[] = ['First slide','Second slide','Third slide','Fourth slide','Fifth slide','Sixth slide'];

  

  constructor(private atractivoService: AtractivoService, 
    private archivoService: ArchivoService
    //private geo:GeoAtractivoService
  ) {
    this.start = new BehaviorSubject(null);
    this.end = new BehaviorSubject(null);
  }

  ngOnInit() {
    this.atractivosSubscription = this.atractivoService
      .listarAtractivos(this.start, this.end)
      .subscribe((item:any) => {
        this.listaAtractivos = [];        
        item.forEach((element, index) => {
           const atractivo:any = element.payload.toJSON();
           const imgTemp: Imagenes[]= [];
           const atractivoTemp= new Atractivo();
           atractivoTemp.key= item[index].key;
           atractivoTemp.nombre = atractivo.nombre;
           atractivoTemp.alias = atractivo.alias;
           atractivoTemp.categoria = atractivo.categoria;
           atractivoTemp.descripcion = atractivo.descripcion;
          
           // Sincronizar cambios de ubicacion en geofire 
          // this.geo.setLocation(atractivoTemp.key, [atractivo.posicion.lat, atractivo.posicion.lng ]);
           

           Object.keys(atractivo.galeria).forEach( key => {
            imgTemp.push(atractivo.galeria[key] as Imagenes);
            });
          atractivoTemp.galeria = imgTemp;


          this.listaAtractivos.push(atractivoTemp);
        });
      });
  }

  buscar($event) {
    if ($event.timeStamp - this.estadoInput > 200) {
      const q = $event.target.value;
      this.start.next(q);
      this.end.next(q + "\uf8ff");
    }
    this.estadoInput = $event.timeStamp;
  }



  eliminar(uidAtractivo: string, nombreAtractivo: string, galeriaAtractivo: any) {

    swal("warning","Desea eliminar el atractivo: "+nombreAtractivo,{
      buttons: {
        cancel: true,
        confirm: true,
      },
    }).then(
      resolve=>{
        if(resolve){
          console.log('eliminar');
          if (uidAtractivo != null) {
            console.log('borrando');
            this.atractivoService.borrarAtractivo(uidAtractivo).then(res => {

              

            }).catch( err => {
              console.error(err);
            });
            //this.geo.borrarGeoAtractivo(uidAtractivo);
            galeriaAtractivo.forEach(element => {
              this.archivoService.borrarArchivo(element.pathURL);
              
            });
          }
          
         
      }
      }
    )

  
}
}
