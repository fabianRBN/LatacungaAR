import { Imagenes } from './../../../models/imagenes.model';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PersonajeService,
  ArchivoService,
  AuthService
} from '../../../services/service.index';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Personaje } from '../../../models/personaje.model';
import 'sweetalert';
import * as firebase from 'firebase';

@Component({
  selector: 'app-crear-personaje',
  templateUrl: './crear-personaje.component.html',
  styleUrls: ['./crear-personaje.component.css']
})
export class CrearPersonajeComponent implements OnInit, OnDestroy {
  // Variables y objeto Personaje
  private keyPersonaje: string;
  public personaje = new Personaje();
  public personajeEditable = new Personaje();

  // Variables del formulario y validación
  public frmRegistro: FormGroup;

  // Variables del modal
  modalRef: NgbModalRef;

  // Variables de imagenes
  // Variables para el cargar imagenes nuevas
  public tituloImagen: string;
  public imagenTemporal: string; // Se utiliza para la vista previa de la imagen
  public imagenesTemporales: ImagenTemporal[] = [];
  // Varaibles para editar imagen
  public tituloImagenenEdicion: string;
  public imagenAEditar = new Imagenes();

  // Variables de imagen para la interfaz del componente
  public labelImagen: string;
  private archivo: File;
  private date = new Date();
  private numeroDeArchivos: number;
  private numeroDeArchivosSubidos: number;

  // Variables del componente
  public modoEdicion = false;
  public spiner = false;
  private personajeSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    private personajeService: PersonajeService,
    private archivoService: ArchivoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.frmRegistro = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.personaje.creadorUid = auth.uid;
      }
    });
    this.keyPersonaje = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.keyPersonaje) {
      this.modoEdicion = true;
      this.personajeSubscription = this.personajeService
        .obtenerPersonajePorKey(this.keyPersonaje)
        .snapshotChanges()
        .map(item => {
          const key = item[0].payload.key;
          const datos = { key, ...item[0].payload.val() };
          return datos;
        })
        .subscribe(item => {
          this.personajeEditable = item as Personaje;
          this.personajeEditable.galeriaObject = item.galeria;
          const galeria: Imagenes[] = [];
          let imagen = new Imagenes();
          Object.keys(item.galeria).forEach(key => {
            imagen = item.galeria[key] as Imagenes;
            imagen.key = key;
            galeria.push(imagen);
          });
          this.personajeEditable.galeria = galeria;
          this.formValue(this.personajeEditable);
        });
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    if (this.modoEdicion) {
      this.personajeSubscription.unsubscribe();
    }
  }

  guardarPersonaje() {
    if (!this.frmRegistro.invalid) {
      this.personaje.key = this.personajeService.obtenerKey();
      this.personaje.nombre = this.frmRegistro.value.nombre;
      this.personaje.descripcion = this.frmRegistro.value.descripcion;
      if (this.modoEdicion) {
        this.personaje.key = this.keyPersonaje;
        this.personajeService.actualizarPersonaje(this.personaje);
        if (this.imagenesTemporales.length > 0) {
          this.guardarImagenes();
        } else {
          this.mensajedeConfirmacion('actualizado');
        }
      } else if (this.imagenesTemporales.length <= 0) {
        swal('Alerta', 'Para registrar un personaje se requiere una imagen');
      } else if (this.imagenesTemporales.length > 1) {
        swal(
          'Alerta',
          'Para registrar un personaje solo se requiere una imagen'
        );
      } else {
        this.personaje.seleccionado = false;
        this.personajeService
          .crearPersonaje(this.personaje)
          .then(res => {
            this.guardarImagenes();
          })
          .catch(err => {
            console.error(err);
          });
      }
    } else {
      swal('Error', 'Se deben completar los campos requeridos', 'error');
    }
  }

  // ====================================================
  // Funciones para el manejo de carga de imagenes al Servidor
  // ====================================================
  // Guardar las imagenes dentro del array ImagenesTemporales
  guardarImagenes() {
    this.numeroDeArchivos = this.imagenesTemporales.length;
    this.numeroDeArchivosSubidos = 0;
    this.imagenesTemporales.forEach((imagen, index) => {
      this.guardarImagen(imagen, index);
    });
  }

  // Guardar una imagen temporal en Storage y en la BDD (Usada para modificar una imagen en especifico)
  guardarImagen(imagenTemporalAGuardar: ImagenTemporal, index: number) {
    let progreso = 0;
    if (imagenTemporalAGuardar.archivo != null) {
      const ubicacion = this.obtenerUbicacion(this.personaje.key, index);
      // Borrar la imagen anterior
      this.archivoService.borrarArchivo(ubicacion).catch(err => {
        if (err.code !== 'storage/object-not-found') {
          console.error(err);
        }
      });
      // Subir la imagen al Storage
      const uploadTask = this.archivoService.subirArchivo(
        imagenTemporalAGuardar.archivo,
        ubicacion
      );
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          progreso = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          imagenTemporalAGuardar.progreso = progreso;
        },
        err => {
          console.error(err);
        },
        () => {
          if (progreso >= 100) {
            // Subir la imagen a la BDD
            const imagenASubir = new Imagenes();
            imagenASubir.imagenURL = uploadTask.snapshot.downloadURL;
            imagenASubir.titulo =
              imagenTemporalAGuardar.titulo || 'Imagen ' + index;
            imagenASubir.pathURL = ubicacion;
            this.personajeService
              .cargarImagenes(this.personaje.key, imagenASubir)
              .then(
                res => {},
                err => {
                  console.error(err);
                }
              );
            this.numeroDeArchivosSubidos++;
            if (this.numeroDeArchivosSubidos === this.numeroDeArchivos) {
              if (this.modoEdicion) {
                this.mensajedeConfirmacion('actualizado');
              } else {
                this.mensajedeConfirmacion('registrado');
              }
            }
          }
        }
      );
    }
  }

  // ====================================================
  // Funciones para el manejo de imagenes
  // ====================================================
  // Obtener la ubicacion en donde guardar la imagen
  obtenerUbicacion(key: string, index?: number) {
    if (index) {
      return (
        'imagenes/personajes/' +
        key +
        '-' +
        index +
        '' +
        this.date.getMilliseconds()
      );
    } else {
      return 'imagenes/personajes/' + key + '-' + this.date.getMilliseconds();
    }
  }

  // Editar imagen
  editarImagen() {
    this.imagenAEditar.titulo = this.tituloImagenenEdicion;
    if (this.imagenTemporal) {
      const imagenNueva: ImagenTemporal = {
        titulo: this.tituloImagenenEdicion,
        imgTemporal: this.imagenTemporal,
        archivo: this.archivo,
        progreso: 0,
        enStorage: false,
        enBDD: false
      };
      this.archivoService // Borar antigua imagen
        .borrarArchivo(this.imagenAEditar.pathURL)
        .then(res => {
          console.log('archivo eliminado');
        })
        .catch(err => {
          if (err.code !== 'storage/object-not-found') {
            console.error(err);
          }
        });
      this.subirImagen(this.imagenAEditar);
    }
    this.personajeService.actualizarImagenes(
      this.personaje.key,
      this.imagenAEditar
    );

    this.cerrarModal();
  }

  // Subir imagen
  subirImagen(imagenes: Imagenes) {
    const ubicacion = this.obtenerUbicacion(this.personaje.key);
    this.archivoService
      .subirArchivo(this.archivo, ubicacion)
      .then(res => {
        imagenes.imagenURL = res.downloadURL;
        imagenes.pathURL = ubicacion;
        this.personajeService.actualizarImagenes(this.personaje.key, imagenes);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Eliminar la imagen guardada
  eliminarImagenPersonaje(imagenKey: string, imagenURl: string) {
    this.personajeService.borrarImagenPersonaje(imagenKey, this.personaje.key).then(res => {
      this.archivoService.borrarArchivo(imagenURl);
    }).catch( err => {
      console.error(err);
    });

  }

  // ====================================================
  // Funciones para el manejo de imagenes temporales
  // ====================================================
  // Funcion para cargar imagenes temporales
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
    // Anadir a imagenTemporal la vista previa de  la imagen
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL(this.archivo);
    reader.onloadend = () => {
      this.imagenTemporal = reader.result;
    };
  }

  // Agragar imagenes temporal al array imagenesTemporales
  agregarImagenTemporal(imagenTemporal?: ImagenTemporal) {
    if (imagenTemporal) {
      this.imagenesTemporales.push(imagenTemporal);
    } else {
      if (this.tituloImagen === undefined || this.tituloImagen === '') {
        swal('Alerta', 'Se requiere un titulo para la imagen', 'info');
      } else {
        this.imagenesTemporales.push({
          titulo: this.tituloImagen,
          imgTemporal: this.imagenTemporal,
          archivo: this.archivo,
          progreso: 0,
          enStorage: false,
          enBDD: false
        });
        this.tituloImagen = '';
        this.imagenTemporal = null;
      }
    }
  }

  // Funcion para eliminar un elemento temporal
  eliminarImagenTemporal(dato: number) {
    this.imagenesTemporales.splice(dato, 1);
  }

  // ====================================================
  // Funciones para manejar el Formulario
  // ====================================================
  // Llenar el formulario con valores
  formValue(personaje: Personaje) {
    this.frmRegistro.setValue({
      nombre: personaje.nombre,
      descripcion: personaje.descripcion
    });
    this.personaje = personaje;
    console.log(this.personaje);
  }

  // Limpiar los campos del formulario
  limpiarElementos() {
    this.frmRegistro.setValue({
      nombre: '',
      descripcion: ''
    });
    this.labelImagen = '';
    this.imagenesTemporales = [];
  }

  // Enviar mensaje de confirmación
  mensajedeConfirmacion(mensaje: string) {
    swal(
      '',
      'Personaje: ' + this.personaje.nombre + ' ' + mensaje,
      'success'
    ).then(result => {
      if (this.modoEdicion) {
        this.router.navigate(['/detalle-personaje', this.personaje.key]);
      } else {
        this.limpiarElementos();
      }
    });
    this.spiner = false;
  }

  // ===================================================
  // Funciones del modal imagenes
  // ===================================================
  // Abrir modal para editar imagen
  mostrarModal(modalId, imagen: Imagenes) {
    this.imagenTemporal = null;
    this.tituloImagenenEdicion = imagen.titulo;
    this.imagenAEditar = imagen;
    this.modalRef = this.modalService.open(modalId, { centered: true });
  }

  // Cerrar modal para editar imagen
  cerrarModal() {
    this.imagenTemporal = null;
    this.labelImagen = '';
    this.modalRef.close();
  }
}

// ====================================================
// Interfaces
// ====================================================
// Interfaz para imagenes temporales
interface ImagenTemporal {
  titulo: string;
  imgTemporal: any;
  archivo: File;
  progreso: number;
  enStorage: boolean; // True - si la imagen esta ya guardada en el storage
  enBDD: boolean; // True - si la imagen esta ya guardada en la BDD
}
