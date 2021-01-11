import { ToastService } from 'ng-zorro-antd-mobile';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Router, ActivatedRoute } from "@angular/router"

import { BudgetLevel } from "@shared"
@Component({
    templateUrl: './eco-summary.component.html',
    styleUrls: ['./eco-summary.component.less']
})
export class EcoSummaryComponent implements OnInit, AfterViewInit {
    // 是否打开drawer
    state = {
        open: false
    };
    title;
    // 时间及预算级次选择
    startTime: Date;
    endTime: Date;
    countySelected = true;
    citySelected = false;
    centerSelected = false;

    budgetValue = [];

    height: number = document.documentElement.clientHeight - 145;

    constructor(private http: _HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        private toastSrv: ToastService) {

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        this.startTime = new Date(year, 0);
        this.endTime = new Date(year, month);

    }

    ngOnInit() { }

    ngAfterViewInit() {

    }

    clearBdgValue() {
        this.budgetValue = [];
    }

    currentDateFormat(date, format: string = 'yyyy-mm-dd HH:MM'): any {
        const pad = (n: number): string => (n < 10 ? `0${n}` : n.toString());
        return format
            .replace('yyyy', date.getFullYear())
            .replace('mm', pad(date.getMonth() + 1))
            .replace('dd', pad(date.getDate()))
            .replace('HH', pad(date.getHours()))
            .replace('MM', pad(date.getMinutes()))
            .replace('ss', pad(date.getSeconds()));
    }

    onOk(result: Date) {
        if (this.countySelected || this.citySelected || this.centerSelected) {
            if (this.centerSelected) {
                this.budgetValue.push(BudgetLevel.CENTER);
            }
            if (this.citySelected) {
                this.budgetValue.push(BudgetLevel.CITY);
            }
            if (this.countySelected) {
                this.budgetValue.push(BudgetLevel.COUNTY);
            }

            this.toastSrv.info(this.budgetValue.toLocaleString());


        } else {
            this.toastSrv.info('请选择预算级次！！');
        }
    }
    //专题切换
    nav(e) {
        switch (e.innerText) {
            // case '分税种分析':

            //     break;
            case '分行业分析':
                this.router.navigate(['./hy-summary'], { relativeTo: this.route })
                this.title = '分行业分析';
                break;
            case '分产业分析':
                this.router.navigate(['./cy-summary'], { relativeTo: this.route })
                this.title = '分产业分析';
                break;
            case '财政总收入分析':
                this.router.navigate(['./all-summary'], { relativeTo: this.route })
                this.title = '财政总收入分析';
                break;

            default:
                break;
        }
    }

}
