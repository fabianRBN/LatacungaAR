import { Component, OnInit } from "@angular/core";
import { MouseEvent } from "@agm/core";
import { NgModule } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Atractivo } from "../../../models/atractivo.model";
import { Georeferencia } from "../../../models/georeferencia.model";
import { Imagenes } from "../../../models/imagenes.model";
import {
  AtractivoService,
  ArchivoService,
  AuthService
} from "../../../services/service.index";
import { Subscription } from "rxjs/Rx";
import { ValidateDropdown } from "../../../validators/dropdownValidator";
import * as firebase from "firebase";
@Component({
  selector: "app-crear-atractivo",
  templateUrl: "./crear-atractivo.component.html",
  styleUrls: ["./crear-atractivo.component.css"]
})
export class CrearAtractivoComponent implements OnInit {
  // google maps zoom level
  zoom: number = 17;

  // initial center position for the map
  lat: number = -0.9356373;
  lng: number = -78.6118114;

  // Variables para el cargar imagenes temp y finales
  public labelImagen: string;
  public imagenaSubir: boolean = false;
  public imagenTemp: string;
  public archivo: File;
  public imgTemporales: imagen[] = [];
  public marcadorActivado: boolean = true;
  public tituloImagen: string;

  // variables y  objeto Atractivo - georeferencia
  public atractivo = new Atractivo();
  public georeferencia = new Georeferencia();
  public imagenes = new Imagenes();

  public nombreAtractivo: string;
  public categoriaAtractivo: string;
  public descripcionAtractivo: string;
  public observacionAtractivo: string;

  public cargacompleta: boolean = true;
  public numeroArchivos: number = 0;
  public numeroArchivosSubidos: number = 0;
  public date = new Date();

  public spiner: boolean = false;
  // valiables para validar campos
  frmRegistro: FormGroup;

  //====================================================
  //         Posicion inicial del mapa de google maps
  //====================================================
  markers: marker = {
    lat: 51.673858,
    lng: 7.815982,
    label: "A",
    draggable: true
  };

  constructor(
    public atractivoService: AtractivoService,
    public archivoService: ArchivoService,
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.frmRegistro = this.fb.group({
      nombre: ["", Validators.required],
      categoria: ["", [Validators.required, ValidateDropdown]],
      descripcion: ["", [Validators.required, Validators.minLength(20)]],
      observacion: [""]
    });
  }

  //====================================================
  //         Evento al dar click al markador
  //====================================================
  clickedMarker() {
    console.log(
      `clicked the marker: lat  ${this.markers.lat}  & lng ${this.markers.lng}`
    );
  }

  //====================================================
  //         Evento al darle click al mapa
  //====================================================
  mapClicked($event: MouseEvent) {
    // if(this.marcadorActivado){

    this.markers = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,

      draggable: true
    };
    this.marcadorActivado = false;
    // }else{
    //   swal("Mensaje","Arrastre el marcador para colocar en una nueva posicion","error")
    // }
  }
  //====================================================
  //         Evento al mover un marcador de google maps
  //====================================================
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log("dragEnd", m, $event);
  }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.atractivo.creadorUid = auth.uid;
      }
    });
  }

  //====================================================
  //         Funcion para cargar imagenes temporales
  //====================================================
  selecionarArchivo(archivos: FileList) {
    this.archivo = archivos.item(0);
    if (this.archivo.type.indexOf("image") < 0) {
      swal(
        "Solo Imagenes",
        "El archivo seleccionado no es una Imagen",
        "error"
      );
      this.imagenaSubir = false;
      return;
    }
    this.imagenaSubir = true;
    this.labelImagen = this.archivo.name;

    // Vista previa de imagen
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(this.archivo);
    reader.onloadend = () => {
      this.imagenTemp = reader.result;
    };
  }
  //====================================================
  //         Agragar imagenes a un array temporal
  //====================================================
  agregatImagentemp() {
    if (this.tituloImagen === undefined || this.tituloImagen === "") {
      swal("Alerta", "Se requiere un titulo para la imagen", "info");
    } else {
      this.imgTemporales.push({
        titulo: this.tituloImagen,
        imagenTemp: this.imagenTemp,
        archivo: this.archivo,
        progreso: 0,
        subida: false
      });
      this.numeroArchivos++;
      this.cargacompleta = false;

      this.tituloImagen = "";
      this.imagenTemp = null;
    }
  }
  //====================================================
  //         Funcion para eliminar un elemento temporal
  //====================================================
  imagenConsol(dato: number) {
    this.imgTemporales.splice(dato, 1);
  }

  //====================================================
  //         Funcion para guardar atractivo
  //====================================================

  guardarAtractivo() {
    if (!this.frmRegistro.invalid) {
      this.atractivo.id = this.atractivoService.obtenertKey();
      this.georeferencia.lat = this.markers.lat;
      this.georeferencia.lng = this.markers.lng;

      this.atractivo.nombre = this.frmRegistro.value.nombre;
      this.atractivo.descripcion = this.frmRegistro.value.descripcion;
      this.atractivo.categoria = this.frmRegistro.value.categoria;
      this.atractivo.observacion =
        this.frmRegistro.value.observacion || "Ninguna";
      this.atractivo.posicion = this.georeferencia;

      this.atractivoService.crearAtrativo(this.atractivo);

      this.guardarImagenes();
    } else {
      swal("Error", "Se deben completar los campos requeridos", "error");
    }
    // this.atractivo.id = this.atractivoService.obtenertKey();
    // this.georeferencia.lat = this.markers.lat;
    // this.georeferencia.lng = this.markers.lng;

    // this.atractivo.nombre = this.nombreAtractivo;
    // this.atractivo.descripcion = this.descripcionAtractivo;
    // this.atractivo.categoria = this.categoriaAtractivo;
    // this.atractivo.observacion = this.observacionAtractivo;
    // this.atractivo.posicion = this.georeferencia;

    // this.atractivoService.crearAtrativo(this.atractivo);

    // this.guardarImagenes();
  }

  //====================================================
  //         Cargar Imagenes al servidor
  //====================================================
  guardarImagenes() {
    this.spiner = true;
    this.numeroArchivosSubidos = 0;
    this.imgTemporales.forEach((imgTem, index) => {
      var progreso = 0;
      this.cargacompleta = false;
      if (imgTem.archivo != null) {
        const ubicacion =
          "imagenes/atractivos/" +
          this.atractivo.id +
          "-" +
          index +
          "" +
          this.date.getTime() +
          this.date.getMilliseconds();
        // Borrar la imagen anterior
        this.archivoService.borrarArchivo(ubicacion).catch(err => {
          if (err.code !== "storage/object-not-found") {
            console.log(err);
          }
        });
        // Subir imagen nueva
        // this.archivoService
        //   .subirArchivo(imgTem.archivo, ubicacion)
        //   .then(res => {
        //     this.imagenes.imagenURL = res.downloadURL;
        //     this.imagenes.titulo; this.imgTemporales[index];
        //     // this.authService.updateUserProfile(this.usuario);

        //     // Recargar la pagina para mostrar cambios de imagen
        //     //window.location.reload();
        //     this.imagenesGaleria.push(this.imagenes);
        //     console.log('Archivo '+index+' subido');
        //   })
        //   .catch(err => {

        //     console.log(err);
        //     return false;
        //   });
        var sp = null;
        this.archivoService.subirArchivo(imgTem.archivo, ubicacion).on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            progreso = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            imgTem.progreso = progreso;
            if (progreso >= 100) {
            }
            sp = snapshot;
          },
          error => {
            console.log("error:" + error);
          },
          () => {
            imgTem.subida = true;

            if (progreso >= 100) {
              this.imagenes.imagenURL = sp.downloadURL;
              this.imagenes.titulo =
                this.imgTemporales[index].titulo || "Imagen " + index;
              this.imagenes.pathimg = sp.fullPath;
              this.numeroArchivosSubidos++;
              this.atractivoService.cargarImagenes(
                this.atractivo.id,
                this.imagenes
              );
              console.log(
                "Numero de archivos:" +
                  this.numeroArchivos +
                  " " +
                  this.numeroArchivosSubidos
              );
              if (this.numeroArchivosSubidos >= this.numeroArchivos) {
                this.spiner = false;
                swal(
                  "",
                  "Atractivo: " + this.atractivo.nombre + " registrado",
                  "success"
                );
                this.limpiarElementos();
              }
            }
          }
        );
      }
    });
  }

  limpiarElementos() {
    this.frmRegistro.setValue({
      nombre: "",
      descripcion: "",
      categoria: "",
      observacion: ""
    });

    this.imgTemporales = null;
    this.numeroArchivos = 0;
    this.numeroArchivosSubidos = 0;
  }
}

//====================================================
//         Interfaces
//====================================================
// Interfaz para imagenes temporales
interface imagen {
  titulo: string;
  imagenTemp: any;
  archivo: File;
  progreso: number;
  subida: boolean;
}

// interfaz para marcadores.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
