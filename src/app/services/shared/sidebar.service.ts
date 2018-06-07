import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {
  menu: any = [
    {
      titulo: 'Principal',
      icon: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Dashboard', url: '/dashboard'},
        {titulo: 'Usuarios', url: '/progress'},
        {titulo: 'Graficas', url: '/grafica'},
        // {titulo: 'Promesas', url:'/promesas'},
        // {titulo: 'Rxjs', url:'/rxjs'}

      ]
    },
    {
      titulo: 'Atractivos',
      icon: 'mdi mdi-burst-mode',
      submenu: [
        {titulo: 'Atractivos', url: '/atractivo'},
        {titulo: 'Registrar', url: '/crear-atractivo'},
      ]
    },
    {
      titulo: 'Servicios',
      icon: 'mdi mdi-buffer',
      submenu: [
        {titulo: 'Servicios', url: '/servicio'},
        {titulo: 'Registrar', url: '/crear-servicio'},
      ]
    },
    {
      titulo: 'Personajes',
      icon: 'mdi mdi-emoticon-excited',
      submenu: [
        {titulo: 'Personajes', url: '/personaje'},
        {titulo: 'Registrar', url: '/crear-personaje'},
      ]
    }
  ];

  constructor() {}
}
