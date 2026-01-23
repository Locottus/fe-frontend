import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente';

@Component({
  selector: 'shared-footer',
  templateUrl: './footer.component.html',
  styleUrls: [
    './footer.component.scss',
  ]
})
export class FooterComponent implements OnInit {

  ultimoLogin: Date;

  constructor() { }

  ngOnInit(): void {
    this.getDatosFooter();
  }

  getDatosFooter() {
    const clienteStr = sessionStorage.getItem('cliente');
    if (clienteStr) {
      const cliente: Cliente = JSON.parse(clienteStr);
      this.ultimoLogin = cliente?.ultimo_login;
    }
  }
}
