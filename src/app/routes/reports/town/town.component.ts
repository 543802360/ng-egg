import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

import { DomSanitizer } from '@angular/platform-browser'
import { environment } from '@env/environment';

@Component({
  template: `
  <iframe [src]="iframe"></iframe>  
   `,
  styles: [
    `
     iframe{
       margin-top:10px;
       height:100%;
       width:100%;
     }`
  ]
})
export class ReportsTownComponent implements OnInit {

  iframe: string;
  targetUrl = environment.reportsUrl.czsr;
  constructor(private sanitizer: DomSanitizer) {
    this.iframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.targetUrl) as any;
  }
  ngOnInit() { }

}
