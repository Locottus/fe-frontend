import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class QualtricsService {

  qualtricsScriptId = '';
  qualtricsContainerId = '';
  qualtricsUrl = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private settingsService: SettingsService
  ) { }

 private activarQualtrics() {
    this.scriptQualtrics(this.qualtricsScriptId, 'assets/scripts/qualtrics.js');
  }

  private scriptQualtrics(id: string, url: string) {
    return new Promise((resolve, reject) => {
      if (id && this.document.getElementById(id)) {
        resolve({ id, loaded: true, status: 'Already Loaded' });
      }
      const body = this.document.body;
      const script = this.document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = '';
      script.src = url;
      script.id = id;
      script.onload = () => {
        resolve({ id, loaded: true, status: 'Loaded' });
      };
      script.onerror = (error: any) => {
        resolve({ id, loaded: false, status: 'Loaded' });
      };
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    });
  }

  activarEncuestaRodados() {
    localStorage.setItem('qualtricsScriptId', this.settingsService.settings?.qualtricsScriptId);
    localStorage.setItem('qualtricsContainerId', this.settingsService.settings?.qualtricsContainerId);
    localStorage.setItem('qualtricsUrl', this.settingsService.settings?.qualtricsUrl);
    this.activarQualtrics();
  }

  public activar() {
    this.configurarScriptQualtrics(document);
  }

  private configurarScriptQualtrics(document: Document) {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((element) => {
      if (element.src.includes('qualtrics')){
        element.remove();
      }
    });
    const body: HTMLBodyElement = document.getElementsByTagName('body')[0];
    const div: HTMLDivElement = document.createElement('div');
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const script: HTMLScriptElement = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = this.cargarQualtrics();
    head.appendChild(script);
    div.id = 'ZN_865MneHh3SgomG2';
    body.appendChild(div);
  }

  private cargarQualtrics() {
    return `(function(){var g=function(e,h,f,g){
      this.get=function(a){for(var a=a+"=",c=document.cookie.split(";"),b=0,e=c.length;b<e;b++){for(var d=c[b];" "==d.charAt(0);)d=d.substring(1,d.length);if(0==d.indexOf(a))return d.substring(a.length,d.length)}return null};
      this.set=function(a,c){var b="",b=new Date;b.setTime(b.getTime()+6048E5);b="; expires="+b.toGMTString();document.cookie=a+"="+c+b+"; path=/; "};
      this.check=function(){var a=this.get(f);if(a)a=a.split(":");else if(100!=e)"v"==h&&(e=Math.random()>=e/100?0:100),a=[h,e,0],this.set(f,a.join(":"));else return!0;var c=a[1];if(100==c)return!0;switch(a[0]){case "v":return!1;case "r":return c=a[2]%Math.floor(100/c),a[2]++,this.set(f,a.join(":")),!c}return!0};
      this.go=function(){if(this.check()){var a=document.createElement("script");a.type="text/javascript";a.src=g;document.body&&document.body.appendChild(a)}};
      this.start=function(){var t=this;"complete"!==document.readyState?window.addEventListener?window.addEventListener("load",function(){t.go()},!1):window.attachEvent&&window.attachEvent("onload",function(){t.go()}):t.go()};};
      try{(new g(100,"r","QSI_S_ZN_865MneHh3SgomG2","${this.settingsService.settings.qualtricsUrlAbandono}")).start()}catch(i){}})();`;
  }

}
