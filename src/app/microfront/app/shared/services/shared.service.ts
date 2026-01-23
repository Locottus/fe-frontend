import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  navigateToExternalHbi = (queryValue: string = 'prestamos') => { this.redirect('/DefaultObi.aspx?mostrar=' + queryValue); };

  navigateToExternalUrl = (url: string) => { this.redirect(url); };

  private redirect = (url: string) => { window.location.href = url; };
}
