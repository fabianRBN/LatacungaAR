import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graficas1',
  templateUrl: './graficas1.component.html',
  styles: []
})
export class Graficas1Component implements OnInit {

  constructor() { }

  ngOnInit() {

  }
    // Doughnut
    public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    public doughnutChartData:number[] = [350, 450, 100];
    public doughnutChartType:string = 'doughnut';
    leyenda:string = 'hola';
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }

    graficos:any = {
      'grafico1':{
        'labels':['Con frijoles','Con Natilla', 'con tocino'],
        'data':[24,30,46],
        'type':'doughnut',
        'leyenda':'El pan se come con'
      },
      'grafico2':{
        'labels':['Hombre','Mujer'],
        'data':[45000,60000],
        'type':'doughnut',
        'leyenda':'Entrevistados'
      },
      'grafico3':{
        'labels':['Si','No', 'Talvez'],
        'data':[24,30,46],
        'type':'doughnut',
        'leyenda':'Encuesta'
      }
    }
    graficos2:any[] = [
      {
        'labels':['Con frijoles','Con Natilla', 'con tocino'],
        'data':[24,30,46],
        'type':'doughnut',
        'leyenda':'El pan se come con'
      },
      {
        'labels':['Hombre','Mujer'],
        'data':[45000,60000],
        'type':'doughnut',
        'leyenda':'Entrevistados'
      },
      {
        'labels':['Si','No', 'Talvez'],
        'data':[24,30,46],
        'type':'doughnut',
        'leyenda':'Encuesta'
      }
    ]
}
