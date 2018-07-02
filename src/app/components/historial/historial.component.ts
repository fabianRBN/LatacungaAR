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

  item: Observable<any>;

  public listatractivos: Atractivo[]= [];
  public listaVisitanteskey: string[]=[];
  public listaVisitantesObject: Cliente[];

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
        atractivoObject.rating = atractivo.rating;
        atractivoObject.key = item[index].key;
        this.visitasSubscription = this.atractivoService.visitasAtractivo(atractivoObject.key).snapshotChanges().subscribe((itemHistorial)=>{
          
        if(itemHistorial){
          this.listaVisitanteskey = [];
          atractivoObject.numeroVisitas = itemHistorial.length;
          console.log(itemHistorial.length);
          itemHistorial.forEach((elementHistorial,indexHistorial)=>{
              this.listaVisitanteskey.push(itemHistorial[indexHistorial].key);
          });
          atractivoObject.listaVisitantes = this.listaVisitanteskey;
        }
        });
        this.listatractivos.push(atractivoObject);
        console.log(atractivoObject);
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
        this.listaVisitantesObject.push(cliente);
      })
      
    });
  }

  //====================================================
  //         Modal code 
  //====================================================

  open(content, listasClientekey) {
    this.informacionVisitantes(listasClientekey);
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
