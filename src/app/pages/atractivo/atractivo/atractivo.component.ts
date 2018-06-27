import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Atractivo } from '../../../models/atractivo.model';
import { Subscription } from "rxjs/Subscription";
import { AtractivoService } from "../../../services/service.index";
import { Imagenes } from "../../../models/imagenes.model";
import { ArchivoService } from '../../../services/archivo/archivo.service';
import { GeoAtractivoService } from '../../../services/atractivo/geo-atractivo.service';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import { ComentariosService } from '../../../services/comentarios/comentarios.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import { identifierModuleUrl } from "@angular/compiler";


@Component({
  selector: "app-atractivo",
  templateUrl: "./atractivo.component.html",
  styleUrls: ["./atractivo.component.css"],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class AtractivoComponent implements OnInit {
  // Variables para realizar busqueda
  public estadoInput = 0;
  public estadoInputRating = 0;
  public start: BehaviorSubject<string | null>;
  public end: BehaviorSubject<string | null>;
  // Variable para paginacion
  public pagina = 1;
  currentRate = 0;
  // Variables y Objetos de atractivos
  public listaAtractivos: Atractivo[];
  public uidAtractivo: string;
  private atractivosSubscription: Subscription = null;
  public atractivoTemp= new Atractivo();
  public valor: number = 0;
  // Definicion de estilos para carrusel dinamico
  public estilo: string[] = ['First slide','Second slide','Third slide','Fourth slide','Fifth slide','Sixth slide'];

  // Subscripcion de comentarios
  public comentariosSubscription: Subscription;

  // Filtro 
  public filtro: string = 'rating';
  // Rating 
  public rating: number = 0;
  // Variable para modal
  modalRef: NgbModalRef;

  // Archivo
  public archivo: File;
  public imagenTemp: string;
  public imagenTemporal: imagen;
  public labelImagen: string;  
  public imagen360 = new Imagenes();
  public progreso360: number = 0;

  // Switch
  public checkAR: boolean= false;
  public check360: boolean= true;

  // id de atractivo seleccionado para AR
  public idAtractivo: string;
  public pathUrl360: string;

  constructor(private atractivoService: AtractivoService, 
    private archivoService: ArchivoService,
    public config: NgbRatingConfig,
    private comentariosService: ComentariosService,
    private modalService: NgbModal
    
    //private geo:GeoAtractivoService
  ) {
    this.start = new BehaviorSubject(null);
    this.end = new BehaviorSubject(null);

    //configuracion de Rating 
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.getAtractivos();
  }

  getAtractivos(){
    
    this.atractivosSubscription = this.atractivoService
    .listarAtractivos(this.start, this.end, this.filtro, this.rating)
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
         atractivoTemp.rating = atractivo.rating;
             

         Object.keys(atractivo.galeria).forEach( key => {
          imgTemp.push(atractivo.galeria[key] as Imagenes);
          });

        if(atractivo.imagen360 === undefined || atractivo.imagen360 === null){
          console.log( "No hay");
          atractivoTemp.pathUrl360 = "";
        }else{
          console.log( "SI hay:");
          atractivoTemp.pathUrl360 = atractivo.imagen360.imagenURL;
        }
        
       
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
  // buscarRating(){
    
  //  console.log("click:"+ this.rating)
  //     //  this.getAtractivos();
   
    

  // }

  // validateDecimal(valor) {
  //   var RE = /^\d*(\.\d{1})?\d{0,1}$/;
  //   if (RE.test(valor)) {
  //       return true;
  //   } else {
  //       return false;
  //   }
//}

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

setFiltro( filtro){
  this.filtro = filtro;
  this.getAtractivos();
}


  // ===================================================
  //         Funcion para cargar imagenes temporales
  // ===================================================
  selecionarArchivo(archivos: FileList) {
    this.archivo = archivos.item(0);
    if (this.archivo.type.indexOf('image') < 0) {
      swal(
        'Solo Imagenes',
        'El archivo seleccionado no es una Imagen',
        'error'
      );
   
      return;
    }

    this.labelImagen = this.archivo.name;

    // Vista previa de imagen
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(this.archivo);
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }

  guardarAR(){
    console.log("Id: "+this.idAtractivo);

    this.imagenTemporal ={
      titulo: "",
      imagenTemp: this.imagenTemp,
      archivo: this.archivo,
      progreso: 0
    };
    this.guardarImgen(this.imagenTemporal);
    
    //let imagen = new Imagenes();
    //this.atractivoService.cargarImagenes360(idAtractivo, imagen);
  }

  guardarImgen(imgTem: imagen) {
    console.log("Guardando")
    let progreso = 0;
    if (imgTem.archivo != null) {
      console.log("Guardando 2")
      const ubicacion =
        'imagen360/atractivos/' +
        this.idAtractivo;
      // Borrar la imagen anterior
      this.archivoService.borrarArchivo(ubicacion).catch(err => {
        if (err.code !== 'storage/object-not-found') {
          console.log(err);
        }
      });
      // Usa el servico para subir la imagen al storage
      const uploadTask = this.archivoService.subirArchivo(
        imgTem.archivo,
        ubicacion
      );
      // Controlamos el proseso de subida de la imagen para ver el progreso
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          progreso = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.imagenTemporal.progreso = progreso;
          this.progreso360 = progreso;
        },
        error => {
          console.log('error:' + error);
        },
        () => {
          if (progreso >= 100) {
            this.imagen360.imagenURL = uploadTask.snapshot.downloadURL;
            this.imagen360.titulo =
            this.imagen360.pathURL =  'imagen360/atractivos/' +  this.idAtractivo; 

            if (
              this.imagen360.imagenURL &&
              this.imagen360.pathURL
            ) {
              console.log('Imagen completa');
            }

            this.atractivoService.cargarImagenes360(
              this.idAtractivo,
              this.imagen360
            );
          }

          this.mensajedeConfirmacion('registrado');

        }
      );
    }
  }
  mensajedeConfirmacion(mensaje: string) {
    swal('', 'Imagen subida exitosamente ', 'success');

  }

//====================================================
//         Modal
//====================================================

mostraModal(modelId, id, pathUrl) {
  this.idAtractivo = id;
  this.imagenTemp = pathUrl;
  if(this.imagenTemp != ""){
    this.check360 = true;
  }else{
    this.check360 = false;
  }
  this.modalRef = this.modalService.open(modelId, { centered: true });
}
cerrarModal() {

  this.modalRef.close();
}



}
interface imagen {
  titulo: string;
  imagenTemp: any;
  archivo: File;
  progreso: number;
}
