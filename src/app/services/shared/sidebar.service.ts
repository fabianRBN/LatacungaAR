import { Injectable } from '@angular/core';

@Injectable()
export class SidebarService {

  opcionesUsuario: any =  [
        {titulo: 'Mi Perfil', url: '/perfil'},
        {titulo: 'Dashboard', url: '/dashboard'},
        {titulo: 'Configuración', url: '/accout-settings'},
      
  ]

  menu: any = [
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
    },
    {
      titulo: 'Areas Peligrosas',
      icon: 'mdi mdi-burst-mode',
      submenu: [

        {titulo: 'Áreas Peligrosas', url: '/areas-peligrosas'}
      ]
    }
  ];

  constructor() {}
}
