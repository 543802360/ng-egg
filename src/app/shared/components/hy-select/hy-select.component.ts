import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { NzTreeNode, NzTreeSelectComponent } from 'ng-zorro-antd';

const hyNodes = [{ "title": "农、林、牧、渔业", "key": "A", "parent_id": null, "children": [{ "title": "农业", "key": "01", "parent_id": "A" }, { "title": "林业", "key": "02", "parent_id": "A" }, { "title": "畜牧业", "key": "03", "parent_id": "A" }, { "title": "渔业", "key": "04", "parent_id": "A" }, { "title": "农、林、牧、渔服务业", "key": "05", "parent_id": "A" }] }, { "title": "采矿业", "key": "B", "parent_id": null, "children": [{ "title": "煤炭开采和洗选业", "key": "06", "parent_id": "B" }, { "title": "石油和天然气开采业", "key": "07", "parent_id": "B" }, { "title": "黑色金属矿采选业", "key": "08", "parent_id": "B" }, { "title": "有色金属矿采选业", "key": "09", "parent_id": "B" }, { "title": "非金属矿采选业", "key": "10", "parent_id": "B" }, { "title": "开采辅助活动", "key": "11", "parent_id": "B" }, { "title": "其他采矿业", "key": "12", "parent_id": "B" }] }, { "title": "制造业", "key": "C", "parent_id": null, "children": [{ "title": "农副食品加工业", "key": "13", "parent_id": "C" }, { "title": "食品制造业", "key": "14", "parent_id": "C" }, { "title": "酒、饮料和精制茶制造业", "key": "15", "parent_id": "C" }, { "title": "烟草制品业", "key": "16", "parent_id": "C" }, { "title": "纺织业", "key": "17", "parent_id": "C" }, { "title": "纺织服装、服饰业", "key": "18", "parent_id": "C" }, { "title": "皮革、毛皮、羽毛及其制品和制鞋业", "key": "19", "parent_id": "C" }, { "title": "木材加工和木、竹、藤、棕、草制品业", "key": "20", "parent_id": "C" }, { "title": "家具制造业", "key": "21", "parent_id": "C" }, { "title": "造纸和纸制品业", "key": "22", "parent_id": "C" }, { "title": "印刷和记录媒介复制业", "key": "23", "parent_id": "C" }, { "title": "文教、工美、体育和娱乐用品制造业", "key": "24", "parent_id": "C" }, { "title": "石油加工、炼焦和核燃料加工业", "key": "25", "parent_id": "C" }, { "title": "化学原料和化学制品制造业", "key": "26", "parent_id": "C" }, { "title": "医药制造业", "key": "27", "parent_id": "C" }, { "title": "化学纤维制造业", "key": "28", "parent_id": "C" }, { "title": "橡胶和塑料制品业", "key": "29", "parent_id": "C" }, { "title": "非金属矿物制品业", "key": "30", "parent_id": "C" }, { "title": "黑色金属冶炼和压延加工业", "key": "31", "parent_id": "C" }, { "title": "有色金属冶炼和压延加工业", "key": "32", "parent_id": "C" }, { "title": "金属制品业", "key": "33", "parent_id": "C" }, { "title": "通用设备制造业", "key": "34", "parent_id": "C" }, { "title": "专用设备制造业", "key": "35", "parent_id": "C" }, { "title": "汽车制造业", "key": "36", "parent_id": "C" }, { "title": "铁路、船舶、航空航天和其他运输设备制造业", "key": "37", "parent_id": "C" }, { "title": "电气机械和器材制造业", "key": "38", "parent_id": "C" }, { "title": "计算机、通信和其他电子设备制造业", "key": "39", "parent_id": "C" }, { "title": "仪器仪表制造业", "key": "40", "parent_id": "C" }, { "title": "其他制造业", "key": "41", "parent_id": "C" }, { "title": "废弃资源综合利用业", "key": "42", "parent_id": "C" }, { "title": "金属制品、机械和设备修理业", "key": "43", "parent_id": "C" }] }, { "title": "电力、热力、燃气及水生产和供应业", "key": "D", "parent_id": null, "children": [{ "title": "电力、热力生产和供应业", "key": "44", "parent_id": "D" }, { "title": "燃气生产和供应业", "key": "45", "parent_id": "D" }, { "title": "水的生产和供应业", "key": "46", "parent_id": "D" }] }, { "title": "建筑业", "key": "E", "parent_id": null, "children": [{ "title": "房屋建筑业", "key": "47", "parent_id": "E" }, { "title": "土木工程建筑业", "key": "48", "parent_id": "E" }, { "title": "建筑安装业", "key": "49", "parent_id": "E" }, { "title": "建筑装饰和其他建筑业", "key": "50", "parent_id": "E" }] }, { "title": "批发和零售业", "key": "F", "parent_id": null, "children": [{ "title": "批发业", "key": "51", "parent_id": "F" }, { "title": "零售业", "key": "52", "parent_id": "F" }] }, { "title": "交通运输、仓储和邮政业", "key": "G", "parent_id": null, "children": [{ "title": "铁路运输业", "key": "53", "parent_id": "G" }, { "title": "道路运输业", "key": "54", "parent_id": "G" }, { "title": "水上运输业", "key": "55", "parent_id": "G" }, { "title": "航空运输业", "key": "56", "parent_id": "G" }, { "title": "管道运输业", "key": "57", "parent_id": "G" }, { "title": "装卸搬运和运输代理业", "key": "58", "parent_id": "G" }, { "title": "仓储业", "key": "59", "parent_id": "G" }, { "title": "邮政业", "key": "60", "parent_id": "G" }] }, { "title": "住宿和餐饮业", "key": "H", "parent_id": null, "children": [{ "title": "住宿业", "key": "61", "parent_id": "H" }, { "title": "餐饮业", "key": "62", "parent_id": "H" }] }, { "title": "信息传输、软件和信息技术服务业", "key": "I", "parent_id": null, "children": [{ "title": "电信、广播电视和卫星传输服务", "key": "63", "parent_id": "I" }, { "title": "互联网和相关服务", "key": "64", "parent_id": "I" }, { "title": "软件和信息技术服务业", "key": "65", "parent_id": "I" }] }, { "title": "金融业", "key": "J", "parent_id": null, "children": [{ "title": "货币金融服务", "key": "66", "parent_id": "J" }, { "title": "资本市场服务", "key": "67", "parent_id": "J" }, { "title": "保险业", "key": "68", "parent_id": "J" }, { "title": "其他金融业", "key": "69", "parent_id": "J" }] }, { "title": "房地产业", "key": "K", "parent_id": null, "children": [{ "title": "房地产业", "key": "70", "parent_id": "K" }] }, { "title": "租赁和商务服务业", "key": "L", "parent_id": null, "children": [{ "title": "租赁业", "key": "71", "parent_id": "L" }, { "title": "商务服务业", "key": "72", "parent_id": "L" }] }, { "title": "科学研究和技术服务业", "key": "M", "parent_id": null, "children": [{ "title": "研究和试验发展", "key": "73", "parent_id": "M" }, { "title": "专业技术服务业", "key": "74", "parent_id": "M" }, { "title": "科技推广和应用服务业", "key": "75", "parent_id": "M" }] }, { "title": "水利、环境和公共设施管理业", "key": "N", "parent_id": null, "children": [{ "title": "水利管理业", "key": "76", "parent_id": "N" }, { "title": "生态保护和环境治理业", "key": "77", "parent_id": "N" }, { "title": "公共设施管理业", "key": "78", "parent_id": "N" }] }, { "title": "居民服务、修理和其他服务业", "key": "O", "parent_id": null, "children": [{ "title": "居民服务业", "key": "79", "parent_id": "O" }, { "title": "机动车、电子产品和日用产品修理业", "key": "80", "parent_id": "O" }, { "title": "其他服务业", "key": "81", "parent_id": "O" }] }, { "title": "教育", "key": "P", "parent_id": null, "children": [{ "title": "教育", "key": "82", "parent_id": "P" }] }, { "title": "卫生和社会工作", "key": "Q", "parent_id": null, "children": [{ "title": "卫生", "key": "83", "parent_id": "Q" }, { "title": "社会工作", "key": "84", "parent_id": "Q" }] }, { "title": "文化、体育和娱乐业", "key": "R", "parent_id": null, "children": [{ "title": "新闻和出版业", "key": "85", "parent_id": "R" }, { "title": "广播、电视、电影和影视录音制作业", "key": "86", "parent_id": "R" }, { "title": "文化艺术业", "key": "87", "parent_id": "R" }, { "title": "体育", "key": "88", "parent_id": "R" }, { "title": "娱乐业", "key": "89", "parent_id": "R" }] }, { "title": "公共管理、社会保障和社会组织", "key": "S", "parent_id": null, "children": [{ "title": "中国共产党机关", "key": "90", "parent_id": "S" }, { "title": "国家机构", "key": "91", "parent_id": "S" }, { "title": "人民政协、民主党派", "key": "92", "parent_id": "S" }, { "title": "社会保障", "key": "93", "parent_id": "S" }, { "title": "群众团体、社会团体和其他成员组织", "key": "94", "parent_id": "S" }, { "title": "基层群众自治组织", "key": "95", "parent_id": "S" }] }, { "title": "国际组织", "key": "T", "parent_id": null, "children": [{ "title": "国际组织", "key": "96", "parent_id": "T" }] }, { "title": "税务管理特定行业", "key": "Z", "parent_id": null, "children": [{ "title": "其他税务管理特定行业", "key": "Z9", "parent_id": "Z" }] }];

@Component({
  selector: 'app-hy-select',
  templateUrl: './hy-select.component.html',
  styles: [
  ]
})
export class HySelectComponent implements OnInit {

  @Input() nodes = hyNodes;
  @ViewChild('treeSelect', { static: false }) treeSelect: NzTreeSelectComponent;
  @Output() changed = new EventEmitter<Object>();
  private _selectedHymc: string;

  public set selectedHymc(v: string) {
    this._selectedHymc = v;
  }

  public get selectedHymc(): string {
    return this._selectedHymc;
  }

  constructor() { }

  ngOnInit(): void {
  }
  onChange(e) {
    if (this.treeSelect.getSelectedNodeList().length !== 0) {
      const selectedNode = this.treeSelect.getSelectedNodeList()[0];
      selectedNode.parentNode ?
        this.changed.emit({ hymc: selectedNode.title }) : this.changed.emit({ mlmc: selectedNode.title });

    } else {
      this.changed.emit(null)
    }
  }

}
