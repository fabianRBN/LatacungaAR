import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {


  menu:any= [
    {
      titulo: 'Principal',
      icon: 'mdi mdi-gauge',
      submenu:[
        {titulo: 'Dashboard', url:'/dashboard'},
        {titulo: 'Progress', url:'/progress'},
        {titulo: 'Graficas', url:'/grafica'},
        {titulo: 'Promesas', url:'/promesas'},
        {titulo: 'Rxjs', url:'/rxjs'}

      ]
    }
  ]

  constructor() { }

}
