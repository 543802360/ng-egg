import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NoticeIconList, NoticeIconSelect, NoticeItem } from '@delon/abc/notice-icon';
import { _HttpClient } from '@delon/theme';
import add from 'date-fns/add';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import parse from 'date-fns/parse';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'header-notify',
  template: `
    <notice-icon
      [data]="data"
      [count]="count"
      [loading]="loading"
      btnClass="alain-default__nav-item"
      btnIconClass="alain-default__nav-item-icon"
      (popoverVisibleChange)="loadData()"
    ></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderNotifyComponent {
  data: NoticeItem[] = [
    {
      title: '通知',
      list: [],
      emptyText: '你已查看所有通知',
      // clearText: '清空通知',
    }
  ];
  count = 2;
  loading = false;

  constructor(
    private msg: NzMessageService,
    private http: _HttpClient,
    private nzI18n: NzI18nService,
    private cdr: ChangeDetectorRef) { }

  dzspUpdateTimeUrl = 'util/dzsp/updateDate';
  rhkbUpdateTimeUrl = 'util/rhkb/updateDate';

  private updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach((i) => (i.list = []));

    notices.forEach((item) => {
      const newItem = { ...item };
      if (typeof newItem.datetime === 'string') {
        newItem.datetime = new Date(Date.parse(newItem.datetime)).toLocaleDateString();
      }
      // if (newItem.datetime) {
      //   newItem.datetime = formatDistanceToNow(newItem.datetime as Date, { locale: this.nzI18n.getDateLocale() });
      // }
      if (newItem.extra && newItem.status) {
        newItem.color = ({
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        } as { [key: string]: string | undefined })[newItem.status];
      }
      data.find((w) => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;

    const $dzspStream = this.http.get(this.dzspUpdateTimeUrl);
    const $rhkbStream = this.http.get(this.rhkbUpdateTimeUrl);
    forkJoin([$dzspStream, $rhkbStream]).subscribe(resp => {

      const [dzspRes, rhkbRes] = resp;
      const dzspItem: NoticeIconList = {
        title: '电子税票更新时间',
        // description: dzspRes.data[0].UPDATE_DATE,
        type: '通知',
        datetime: dzspRes.data[0].UPDATE_DATE

      };
      const rhkbItem: NoticeIconList = {
        title: '人行库报更新时间',
        // description: rhkbRes.data[0].UPDATE_DATE,
        type: '通知',
        datetime: rhkbRes.data[0].UPDATE_DATE
      }
      this.data = this.updateNoticeData([
        dzspItem,
        rhkbItem
      ]);

      this.loading = false;
      this.cdr.detectChanges();
    });


  }

  clear(type: string): void {
    this.msg.success(`清空了 ${type}`);
  }

  select(res: NoticeIconSelect): void {
    this.msg.success(`点击了 ${res.title} 的 ${res.item.title}`);
  }
}
