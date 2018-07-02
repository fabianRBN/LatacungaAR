import { Component, OnInit } from '@angular/core';
import { AtractivoService } from '../../services/service.index';
import { Subscription } from "rxjs/Subscription";
import { Atractivo } from '../../models/atractivo.model';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {


  public atractivoSubscription:Subscription; 
  public visitasSubscription:Subscription; 

  public listatractivos: Atractivo[]= [];

  constructor(private atractivoService:AtractivoService) { }

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
          atractivoObject.numeroVisitas = itemHistorial.length;
          console.log(itemHistorial.length);
          itemHistorial.forEach((elementHistorial,index)=>{
              
          });
        }
        });
        this.listatractivos.push(atractivoObject);
        console.log(atractivoObject);
      });

 
    })
  }

}
