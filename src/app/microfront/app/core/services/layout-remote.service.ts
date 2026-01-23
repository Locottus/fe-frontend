import { Injectable } from '@angular/core';
import { SettingRemoteLayout } from 'src/app/shared/models/settingRemoteLayout';

@Injectable({
  providedIn: 'root'
})
export class LayoutRemoteService {

  constructor() { }


  ocultarLayout({ ocultarTodo = true, ocultarHeader = false, ocultarMenu = false, ocultarFooter = false }: SettingRemoteLayout) {
    const customEvent = new CustomEvent('eventRemoteLayout', {
      detail: {
        ocultarTodo,
        ocultarHeader,
        ocultarMenu,
        ocultarFooter
      }
    });
    window.dispatchEvent(customEvent);
  }
}
