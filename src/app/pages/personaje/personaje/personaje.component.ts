import { Subscription } from 'rxjs/Subscription';
import { Personaje } from '../../../models/personaje.model';
import { Imagenes } from '../../../models/imagenes.model';
import { Cliente } from '../../../models/cliente.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PersonajeService,
  ArchivoService,
  ClienteService
} from '../../../services/service.index';

@Component({
  selector: 'app-personaje',
  templateUrl: './personaje.component.html',
  styleUrls: ['./personaje.component.css']
})
export class PersonajeComponent implements OnInit, OnDestroy {
  // Variables para realizar busqueda
  public estadoInput = 0;
  public start: BehaviorSubject<string | null>;
  public end: BehaviorSubject<string | null>;

  // Variable para paginacion
  public pagina = 1;

  // Variables y Objetos de atractivos
  public listaPersonajes: Personaje[];
  public listaClientes: Cliente[];
  public keyPersonaje: string;
  public haySoloUnPersonaje: boolean;
  private personajesSubscription: Subscription;
  private clienteSubscription: Subscription;

  // Variables del componente
  public estilo: string[] = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];

  constructor(
    private personajeService: PersonajeService,
    private archivoService: ArchivoService,
    private clienteService: ClienteService
  ) {
    this.start = new BehaviorSubject(null);
    this.end = new BehaviorSubject(null);
  }

  ngOnInit() {
    this.personajesSubscription = this.personajeService
      .listarPersonajes(this.start, this.end)
      .subscribe(item => {
        this.listaPersonajes = [];
        item.forEach((element, index) => {
          const datos: any = element.payload.toJSON();
          const personajeTemporal = new Personaje();
          const galeriaTemporal: Imagenes[] = [];
          personajeTemporal.key = element.payload.key;
          personajeTemporal.nombre = datos.nombre;
          personajeTemporal.descripcion = datos.descripcion;
          personajeTemporal.creadorUid = datos.creadorUid;
          personajeTemporal.seleccionado = datos.seleccionado;
          Object.keys(datos.galeria).forEach(key => {
            galeriaTemporal.push(datos.galeria[key] as Imagenes);
          });
          personajeTemporal.galeria = galeriaTemporal;
          this.listaPersonajes.push(personajeTemporal);
        });
      });
  }

  ngOnDestroy() {
    this.personajesSubscription.unsubscribe();
  }

  buscar($event) {
    if ($event.timeStamp - this.estadoInput > 200) {
      const q = $event.target.value;
      this.start.next(q);
      this.end.next(q + '\uf8ff');
    }
    this.estadoInput = $event.timeStamp;
  }

  revisarNumeroPersonaje() {
    if (this.listaPersonajes.length === 1) {
      this.haySoloUnPersonaje = true;
    } else {
      this.haySoloUnPersonaje = false;
    }
    console.log(this.haySoloUnPersonaje + ' : ' + this.listaPersonajes.length);
  }

  eliminar(
    keyPersonaje: string,
    nombrePersonaje: string,
    galeriaPersonaje: any
  ) {
    swal('Warning', 'Desea eliminar el personaje: ' + nombrePersonaje, {
      buttons: {
        cancel: true,
        confirm: true
      }
    }).then(resolve => {
      if (resolve) {
        if (keyPersonaje != null) {
          this.personajeService
            .borrarPersonaje(keyPersonaje)
            .then(res => {
              this.revisarNumeroPersonaje();
              this.cambiarPorPrimerPersonaje(keyPersonaje);
            })
            .catch(err => {
              console.error(err);
            });
          galeriaPersonaje.forEach(element => {
            this.archivoService
              .borrarArchivo(element.pathURL)
              .then(res => {})
              .catch(err => {
                console.error(err);
              });
          });
        }
      }
    });
  }

  // Busca los clientes con el personaje Key y los cambia por el primer personaje de la lista
  cambiarPorPrimerPersonaje(keyPersonaje: string) {
    this.clienteSubscription = this.clienteService
      .obtenerClientesPorPersonajeID(keyPersonaje)
      .snapshotChanges()
      .subscribe(item => {
        this.listaClientes = [];
        item.forEach((element, index) => {
          const key = element.payload.key;
          const datos = { key, ...element.payload.val() };
          this.listaClientes.push(datos as Cliente);
        });
        this.listaClientes.forEach(cliente => {
          this.clienteService
            .actualizarPersonajeID(cliente.key, this.listaPersonajes[0].key)
            .catch(err => {
              console.error(err);
            });
        });
      });
  }
}
