import { Component, OnInit, OnDestroy } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Atractivo } from '../../../models/atractivo.model';
import { Georeferencia } from '../../../models/georeferencia.model';
import { Imagenes } from '../../../models/imagenes.model';
import {
  AtractivoService,
  ArchivoService,
  AuthService
} from '../../../services/service.index';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ValidateDropdown } from '../../../validators/dropdownValidator';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import * as firebase from 'firebase';
import 'sweetalert';
import { GeoAtractivoService } from '../../../services/atractivo/geo-atractivo.service';
@Component({
  selector: 'app-crear-atractivo',
  templateUrl: './crear-atractivo.component.html',
  styleUrls: ['./crear-atractivo.component.css']
})
export class CrearAtractivoComponent implements OnInit, OnDestroy {
  // google maps zoom level
  zoom = 17;

  // initial center position for the map
  lat = -0.9356373;
  lng = -78.6118114;

  // Variables para el cargar imagenes temp y finales
  public labelImagen: string;
  public imagenaSubir = false;
  public imagenTemp: string;
  public archivo: File;
  public imgTemporales: imagen[] = [];
  public marcadorActivado = true;
  public tituloImagen: string;
  public tituloImagenenEdicion: string;

  // variables y  objeto Atractivo - georeferencia
  public atractivo = new Atractivo();
  public atractivoEditable = new Atractivo();
  public georeferencia = new Georeferencia();
  public imagenes = new Imagenes();


  public numeroArchivos = 0;
  public numeroArchivosSubidos = 0;
  public date = new Date();

  public spiner = false;
  // Variables para validar campos
  frmRegistro: FormGroup;


  public idAtractivo: string;
  public modoedicion = false;

  private atractivoSubscription: Subscription;
  private usuarioSubscription: Subscription;
  private inputLatSubcription: Subscription;
  private inputLngSubcription: Subscription;
  public atractivoList: Observable<any>;

  // Variables para enviar al modal
  modalRef: NgbModalRef;
  public imagenaEditar = new Imagenes();
  // ===================================================
  //         Posicion inicial del mapa de google maps
  // ===================================================
  markers: marker = {
    lat: 51.673858,
    lng: 7.815982,
    label: 'A',
    draggable: true
  };
   // Switch
   public checkAR: boolean= false;
   public check360: boolean= true;

  constructor(
    public atractivoService: AtractivoService,
    public archivoService: ArchivoService,
    public authService: AuthService,
    private fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private modalService: NgbModal,
    // private geo:GeoAtractivoService
  ) {
    this.frmRegistro = this.fb.group({
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      categoria: ['', [Validators.required, ValidateDropdown]],
      direccion: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      observacion: ['']
    });
    this.inputLatSubcription = this.frmRegistro.controls['latitud'].valueChanges.subscribe( value => {
      this.markers.lat = value;
    });
    this.inputLngSubcription = this.frmRegistro.controls['longitud'].valueChanges.subscribe( value => {
      this.markers.lng = value;
    });
  }

  formValue(atractivo: Atractivo) {
    this.frmRegistro.setValue({
      nombre: this.atractivoEditable.nombre,
      alias: this.atractivoEditable.alias,
      direccion: this.atractivoEditable.direccion,
      descripcion: this.atractivoEditable.descripcion,
      categoria: this.atractivoEditable.categoria,
      observacion: this.atractivoEditable.observacion || 'ninguna',
      latitud: this.atractivoEditable.posicion.lat,
      longitud: this.atractivoEditable.posicion.lng,
    });

    this.atractivo = this.atractivoEditable;
  }

  // ===================================================
  //         Evento al dar click al markador
  // ===================================================
  clickedMarker() {
    console.log(
      `clicked the marker: lat  ${this.markers.lat}  & lng ${this.markers.lng}`
    );
  }

  // ===================================================
  //         Evento al darle click al mapa
  // ===================================================
  mapClicked($event: MouseEvent) {
    this.markers = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    };
    this.frmRegistro.controls['latitud'].setValue($event.coords.lat);
    this.frmRegistro.controls['longitud'].setValue($event.coords.lng);
    // }else{
    //   swal("Mensaje","Arrastre el marcador para colocar en una nueva posicion","error")
    // }
  }
  // ===================================================
  //         Evento al mover un marcador de google maps
  // ===================================================
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }

  cordenadasMapa() {
    this.markers = {
      lat: this.frmRegistro.value.latitud,
      lng: this.frmRegistro.value.longitud,
      draggable: true
    };
  }

//   geoFireAtractivo(atractivoKey: string,lat:number, lng: number ){
//   this.geo.setLocation(atractivoKey , [lat, lng ]);
// }

  ngOnInit() {
    this.usuarioSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.atractivo.creadorUid = auth.uid;
      }
    });
    this.idAtractivo = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.idAtractivo) {
      this.modoedicion = true;
      let imagenTemp = new Imagenes();

      this.atractivoList = this.atractivoService
        .obtenerAtractivoPorKey(this.idAtractivo)
        .snapshotChanges();
      this.atractivoSubscription = this.atractivoList
        .map(item => {
          const key = item[0].payload.key;
          const datos = { key, ...item[0].payload.val() };

          return datos;
        })
        .subscribe(item => {
          const imgTemp: Imagenes[] = [];
          this.atractivoEditable = item as Atractivo;
          this.atractivoEditable.galeriaObject = item.galeria;
          Object.keys(item.galeria).forEach(key => {
            imagenTemp = item.galeria[key] as Imagenes;
            imagenTemp.key = key;
            imgTemp.push(imagenTemp);
          });
          this.atractivoEditable.galeria = imgTemp;

          this.markers = {
            lat: this.atractivoEditable.posicion.lat,
            lng: this.atractivoEditable.posicion.lng,

            draggable: false
          };

          this.formValue(this.atractivo);
        });
    }
  }

  ngOnDestroy(): void {
    this.usuarioSubscription.unsubscribe();
    this.inputLatSubcription.unsubscribe();
    this.inputLngSubcription.unsubscribe();
    if (this.modoedicion) {
      this.atractivoSubscription.unsubscribe();
    }
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
  // ===================================================
  //         Agragar imagenes a un array temporal
  // ===================================================
  agregatImagentemp() {
    if (this.tituloImagen === undefined || this.tituloImagen === '') {
      swal('Alerta', 'Se requiere un titulo para la imagen', 'info');
    } else {
      this.imgTemporales.push({
        titulo: this.tituloImagen,
        imagenTemp: this.imagenTemp,
        archivo: this.archivo,
        progreso: 0
      });
      this.numeroArchivos++;
      this.tituloImagen = '';
      this.imagenTemp = null;
    }
  }

  // ===================================================
  //         Funcion para eliminar un elemento temporal
  // ===================================================
  eliminarImagenTemporal(dato: number) {
    this.imgTemporales.splice(dato, 1);
  }

  // ===================================================
  //         Funcion para guardar atractivo
  // ===================================================
  guardarAtractivo() {
    if (!this.frmRegistro.invalid) {
      this.georeferencia.lat = this.markers.lat;
      this.georeferencia.lng = this.markers.lng;
      this.atractivo.nombre = this.frmRegistro.value.nombre;
      this.atractivo.alias = this.frmRegistro.value.alias;
      this.atractivo.direccion = this.frmRegistro.value.direccion;
      this.atractivo.descripcion = this.frmRegistro.value.descripcion;
      this.atractivo.categoria = this.frmRegistro.value.categoria;
      this.atractivo.observacion =
        this.frmRegistro.value.observacion || 'Ninguna';
      this.atractivo.posicion = this.georeferencia;
      if (this.modoedicion) {
        this.atractivo.key = this.idAtractivo;
        this.atractivoService.actualizarActractivo(this.atractivo);

        if (this.imgTemporales.length > 0) {
          this.guardarImagenes();
        } else {
          this.mensajedeConfirmacion('actualizado');
        }
      } else if (this.imgTemporales.length <= 0) {
        swal(
          'Alerta',
          'Para registrar un atractivo se requiere un Imgen por lo minimo'
        );
      } else {
        this.atractivo.rating = 0;
        this.atractivo.key = this.atractivoService.obtenertKey();
        this.atractivoService.crearAtrativo(this.atractivo);
        // this.geoFireAtractivo(this.atractivo.key, this.atractivo.posicion.lat , this.atractivo.posicion.lng);
        this.spiner = true;
        this.guardarImagenes();
      }
    } else {
      swal('Error', 'Se deben completar los campos requeridos', 'error');
    }
  }

  // ===================================================
  //         Editar Imagen
  // ===================================================

  editarImagen() {
    this.imagenaEditar.titulo = this.tituloImagenenEdicion;
    if (this.imagenTemp) {
      const imagenNueva: imagen = {
        titulo: this.tituloImagenenEdicion,
        imagenTemp: this.imagenTemp,
        archivo: this.archivo,
        progreso: 0
      };

      this.archivoService
        .borrarArchivo(this.imagenaEditar.pathURL)
        .then(relv => {
          console.log('archivo eliminado');
        })
        .catch(err => {
          if (err.code !== 'storage/object-not-found') {
            console.log(err);
          }
        });

      this.subirImagen(this.imagenaEditar);
    }

    this.atractivoService.actualizarImagenes(
      this.atractivo.key,
      this.imagenaEditar
    );

    this.cerrarModal();
  }
  // ===================================================
  //         Cargar Imagenes al servidor
  // ===================================================
  // Se cargan una coleccion de imagenes
  guardarImagenes() {
    this.numeroArchivosSubidos = 0;

    this.imgTemporales.forEach((imgTem, index) => {
      this.guardarImgen(imgTem, index);
    });
  }
  // se carga una unica imagen(Usada para modificar una imagen en especifico)
  guardarImgen(imgTem: imagen, index: number) {
    let progreso = 0;
    if (imgTem.archivo != null) {
      const ubicacion =
        'imagenes/atractivos/' +
        this.atractivo.key +
        '-' +
        index +
        '' +
        this.date.getMilliseconds();
      // Borrar la imagen anterior
      this.archivoService.borrarArchivo(ubicacion).catch(err => {
        if (err.code !== 'storage/object-not-found') {
          console.log(err);
        }
      });

      const sp = null;
      const uploadTask = this.archivoService.subirArchivo(
        imgTem.archivo,
        ubicacion
      );

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          progreso = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          this.imgTemporales[index].progreso = progreso;
        },
        error => {
          console.log('error:' + error);
        },
        () => {
          if (progreso >= 100) {
            this.imagenes.imagenURL = uploadTask.snapshot.downloadURL;
            this.imagenes.titulo =
              this.imgTemporales[index].titulo || 'Imagen ' + index;
            this.imagenes.pathURL =
              'imagenes/atractivos/' +
              this.atractivo.key +
              '-' +
              index +
              '' +
              this.date.getMilliseconds().toString();
            this.numeroArchivosSubidos++;
            if (
              this.imagenes.imagenURL &&
              this.imagenes.pathURL &&
              this.imagenes.titulo
            ) {
              console.log('Imagen completa');
            }

            this.atractivoService.cargarImagenes(
              this.atractivo.key,
              this.imagenes
            );
          }
          if (this.numeroArchivosSubidos >= this.numeroArchivos) {
            if (this.modoedicion) {
              this.mensajedeConfirmacion('actualizado');
            } else {
              this.mensajedeConfirmacion('registrado');
            }

            this.limpiarElementos();
          }
        }
      );
    }
  }

  mensajedeConfirmacion(mensaje: string) {
    swal('', 'Atractivo: ' + this.atractivo.nombre + ' ' + mensaje, 'success');
    this.spiner = false;
  }

  subirImagen(imagenes: Imagenes) {
    // Subir imagen
    const ubicacion =
      'imagenes/atractivos/' +
      this.atractivo.key +
      '-' +
      this.date.getMilliseconds();
    this.archivoService
      .subirArchivo(this.archivo, ubicacion)
      .then(res => {
        imagenes.imagenURL = res.downloadURL;
        imagenes.pathURL = ubicacion;

        // console.log(imagenes.titulo);
        // console.log(imagenes.key);
        this.atractivoService.actualizarImagenes(this.atractivo.key, imagenes);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // =================================================

  limpiarElementos() {
    this.frmRegistro.setValue({
      nombre: '',
      alias: '',
      direccion: '',
      descripcion: '',
      categoria: '',
      observacion: '',
      latitud: '',
      longitud: ''
    });

    this.imgTemporales = [];
    this.numeroArchivos = 0;
    this.numeroArchivosSubidos = 0;
  }

  eliminarImagenAtractivo(imagenKey: string, imagenURl: string) {
    this.atractivoService
      .borrarImagenAtractivo(imagenKey, this.atractivo.key)
      .then(res => {
        this.archivoService.borrarArchivo(imagenURl);
      })
      .catch(err => {
        console.error(err);
      });
  }

  // ===================================================
  //         Modal imagenes
  // ===================================================

  mostraModal(modelId, img: Imagenes) {
    this.imagenTemp = null;
    this.tituloImagenenEdicion = img.titulo;
    this.imagenaEditar = img;
    this.modalRef = this.modalService.open(modelId, { centered: true });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.labelImagen = '';
    this.modalRef.close();
  }
}

// ===================================================
//         Interfaces
// ===================================================
// Interfaz para imagenes temporales
interface imagen {
  titulo: string;
  imagenTemp: any;
  archivo: File;
  progreso: number;
}

// interfaz para marcadores.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
