import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-simple',
  templateUrl: './header-simple.component.html',
  styleUrls: ['./header-simple.component.scss']
})
export class HeaderSimpleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cerrar() {
    window.location.href = '/obi/mis-productos';
  }

}
