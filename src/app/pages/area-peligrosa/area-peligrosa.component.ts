import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AreaPeligrosaService } from '../../services/area-peligrosa/area-peligrosa.service';
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-area-peligrosa',
  templateUrl: './area-peligrosa.component.html',
  styleUrls: ['./area-peligrosa.component.css']
})
export class AreaPeligrosaComponent implements OnInit {

  modalRef: NgbModalRef;
  public camera: MapCamera = {
    lat: -0.93368927,
    lng: -78.61496687,
    zoom: 16
  };
  public arePeligrosaList: Observable<any>;
  private arePeligrosaSubscription: Subscription;
  circulos:circle[] = [];
  

  constructor(public areaPeligrosaServices: AreaPeligrosaService,
    private modalService: NgbModal ) {

    
  

    
   }

  ngOnInit() {





    this.arePeligrosaSubscription =  this.areaPeligrosaServices.listadeAreasPeligrosas().snapshotChanges()
    .subscribe((item:any)=>{
      
      item.forEach((element, index) => {
        const area:any = element.payload.toJSON();
        
      this.circulos.push(
        {
          lat: area.latitud,
          lng: area.longitud,
          fillColor:"'red'",
          radius: 100
        }
      );
        console.log(area);
      });

    })
  }
  
  mostraModal(modelId) {
    
    this.modalRef = this.modalService.open(modelId, { centered: true, size: 'lg' });
  }
  cerrarModal() {
  
    this.modalRef.close();
    
  }

}
// interfaz para la camara del mapa
interface MapCamera {
  lat: number;
  lng: number;
  zoom: number;
}

// interfaz para marcadores.
interface circle {
  lat:number,
  lng:number,
  fillColor: string,
  radius: number
}