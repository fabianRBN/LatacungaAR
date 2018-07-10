import { Component, OnInit } from '@angular/core';
import { AtractivoService, ClienteService } from '../../services/service.index';
import { Subscription } from "rxjs/Subscription";
import { Observable } from 'rxjs/Observable';
import { Atractivo } from '../../models/atractivo.model';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {


  public atractivoSubscription:Subscription; 
  public visitasSubscription:Subscription; 
  public clienteSubscription:Subscription; 
  public visitasClienteSubscription:Subscription; 


  item: Observable<any>;
  public idAtractivoSeleccionado: string="";

  public listatractivos: Atractivo[]= [];
  public listaVisitanteskey: string[]=[];
  public listaVisitantesObject: Cliente[];

    // Variable para paginacion
    public pagina = 1;
    currentRate = 0;

  closeResult: string;

  constructor(
    private atractivoService:AtractivoService,
    private modalService: NgbModal,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {

    this.datosAtractivos();
  }
  datosAtractivos(){

    this.atractivoSubscription =   this.atractivoService.listadeAtractivos().snapshotChanges()
    .subscribe((item:any)=>{
      
      item.forEach((element, index) => {
        const atractivo:any = element.payload.toJSON();
        const atractivoObject = new Atractivo();
        atractivoObject.nombre = atractivo.nombre;
        atractivoObject.rating = atractivo.rating || 0;
        atractivoObject.key = item[index].key;
        this.visitasSubscription = this.atractivoService.visitasAtractivo(atractivoObject.key).snapshotChanges().subscribe((itemHistorial)=>{
          
        if(itemHistorial){
          this.listaVisitanteskey = [];
          atractivoObject.numeroVisitas = itemHistorial.length;
          itemHistorial.forEach((elementHistorial,indexHistorial)=>{
              this.listaVisitanteskey.push(itemHistorial[indexHistorial].key);
          });
          atractivoObject.listaVisitantes = this.listaVisitanteskey;
        }
        });
        this.listatractivos.push(atractivoObject);
      });

 
    })
  }

  informacionVisitantes(listaVisitantes:string[]){
    this.listaVisitantesObject = [];
    listaVisitantes.forEach(keycliente =>{


      this.clienteSubscription =  this.clienteService.datosCliente(keycliente).valueChanges().subscribe((item:any)=>{
        const cliente = new Cliente();
        cliente.nombre = item.nombre;
        cliente.pathImagen = item.pathImagen;  
        cliente.email = item.email;      

        this.visitasClienteSubscription = this.atractivoService.visitasAtractivoCliente(this.idAtractivoSeleccionado,keycliente).snapshotChanges().subscribe(
          item=>{
            cliente.numeroAtractivosVisitados = item.length;
            item.forEach( (elemeto:any)=>{
              const fecha:any = elemeto.payload.toJSON();
              var date = new Date(( fecha.year + 1900 )+"/"+fecha.month+"/"+fecha.date);
              cliente.ultimaVisita = date;
            });
          }
        )

        this.listaVisitantesObject.push(cliente);

      })
      
    });
  }

  //====================================================
  //         Modal code 
  //====================================================

  open(content, listasClientekey, atractivoKey) {
    this.informacionVisitantes(listasClientekey);
    this.idAtractivoSeleccionado = atractivoKey;
    this.modalService.open(content,{ size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
