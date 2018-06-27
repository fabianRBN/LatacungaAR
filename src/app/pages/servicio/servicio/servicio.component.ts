import { Subscription } from 'rxjs/Subscription';
import { Servicio } from './../../../models/servicio.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicioService } from '../../../services/service.index';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, OnDestroy {
  // Variables para realizar busqueda
  public estadoInput = 0;
  public start: BehaviorSubject<string | null>;
  public end: BehaviorSubject<string | null>;
  public valorDeOrden = 'nombre';

  // Variable para paginacion
  public pagina = 1;

  // Variables y objetos de servicios
  public listaServicios: Servicio[];
  public keyServicio: string;
  private servicioSubscription: Subscription;
  public servicioTemp = new Servicio();
  public valor = 0;

  public estilo: string[] = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];

  constructor(private servicioService: ServicioService) {
    this.start = new BehaviorSubject(null);
    this.end = new BehaviorSubject(null);
  }

  ngOnInit() {
    this.getServicios();
  }

  ngOnDestroy() {
    this.servicioSubscription.unsubscribe();
  }

  getServicios() {
    this.servicioSubscription = this.servicioService
      .listarServicios(this.start, this.end, this.valorDeOrden)
      .subscribe(item => {
        this.listaServicios = [];
        item.forEach((element, index) => {
          const key = element.payload.key;
          const datos = { key, ...element.payload.val() };
          this.listaServicios.push(datos as Servicio);
        });
      });
  }

  buscar($event) {
    if ($event.timeStamp - this.estadoInput > 200) {
      const q = $event.target.value;
      this.start.next(q);
      this.end.next(q + '\uf8ff');
    }
    this.estadoInput = $event.timeStamp;
  }

  eliminar(keyServicio: string, nombreServicio: string) {
    swal('warning', 'Desea eliminar el servicio: ' + nombreServicio, {
      buttons: { cancel: true, confirm: true }
    }).then(resolve => {
      if (resolve) {
        if (keyServicio != null) {
          this.servicioService
            .borrarServicio(keyServicio)
            .then()
            .catch(err => {
              console.error(err);
            });
        }
      }
    });
  }

  cambiarValorDeOrden(valor: string) {
    this.valorDeOrden = valor;
    this.getServicios();
  }
}
