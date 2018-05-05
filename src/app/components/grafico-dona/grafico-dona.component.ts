import { Component, OnInit ,Input} from '@angular/core';



@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styles: []
})


export class GraficoDonaComponent implements OnInit {

  

  @Input() leyenda:string = 'Leyenda';

  constructor() { }

  @Input() doughnutChartLabels:string[] = [];
  @Input() doughnutChartData:number[] = [];
  @Input() doughnutChartType:string = '';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }


  ngOnInit() {
  
  }

}
