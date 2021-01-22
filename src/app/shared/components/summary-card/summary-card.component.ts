import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  templateUrl: './summary-card.component.html',
  styles: [
  ]
})
export class SummaryCardComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() value;
  @Input() subValue;
  @Input() status;
  constructor() { }

  ngOnInit(): void {
  }

}
