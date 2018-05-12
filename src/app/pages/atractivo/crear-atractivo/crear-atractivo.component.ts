import { Component, OnInit } from '@angular/core';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-crear-atractivo',
  templateUrl: './crear-atractivo.component.html',
  styleUrls: ['./crear-atractivo.component.css']
})
export class CrearAtractivoComponent implements OnInit {
  
  // google maps zoom level
  zoom: number = 17;
  
  // initial center position for the map
  lat: number = -0.9356373;
  lng: number = -78.6118114;

  public marcadorActivado: boolean = true;

  clickedMarker() {
    console.log(`clicked the marker: lat  ${this.markers.lat}  & lng ${this.markers.lng}`)
  }
  
  mapClicked($event: MouseEvent) {
    // if(this.marcadorActivado){
    
      this.markers= {
        lat: $event.coords.lat,
        lng: $event.coords.lng,

        draggable: true
      };
      this.marcadorActivado = false;
    // }else{
    //   swal("Mensaje","Arrastre el marcador para colocar en una nueva posicion","error")
    // }

    
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
  
  markers: marker = 
	  {
		  lat: 51.673858,
		  lng: 7.815982,
		  label: 'A',
		  draggable: true
	  }
  

  ngOnInit() {
  }

}



// just an interface for type safety.
interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}