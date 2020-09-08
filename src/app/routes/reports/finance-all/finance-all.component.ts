import { Component, OnInit, NgZone } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'finance-all',
  templateUrl: './finance-all.component.html'
})
export class ReportsFinanceAllComponent implements OnInit {

  constructor(private _ngZone: NgZone) { }

  progress = 0;
  label: string;

  ngOnInit() { }
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        this._ngZone.run(() => { console.log('Outside Done!') });
      })
    });

  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 50)
    } else {
      doneCallback();
    }
  }

}
