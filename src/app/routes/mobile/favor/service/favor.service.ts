import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { SegmentedControlComponent } from 'ng-zorro-antd-mobile';
import { Subject, Observable } from 'rxjs';
import { _HttpClient } from '@delon/theme';

@Injectable({
  providedIn: 'root'
})
export class FavorService {
  // segment 可观察者对象
  public _segControl: Subject<SegmentedControlComponent> = new Subject();
  public get segControlObservable(): Observable<SegmentedControlComponent> {
    return this._segControl.asObservable();
  }
  // segment 实例
  private _segControlInstance: SegmentedControlComponent;
  public get segControlInstance(): SegmentedControlComponent {
    return this._segControlInstance;
  }

  public set segControlInstance(v: SegmentedControlComponent) {
    this._segControlInstance = v;
  }


  constructor(private http: _HttpClient) {
    //  this._segControl.asObservable().subscribe((e:SegmentedControlComponent)=>{
    //   e.selectedIndex
    //  }) ;

  }

  /**
   * 获取纳税人排名
   * 
   * @param startTime ：开始时间
   * @param endTime ：结束时间
   * @param token ：token
   * @param userid : userid
   * @param kjlx ：口径类型
   * @param num :纳税人名次
   * @param mlmc ：门类名称
   */
  getNsrpm() {


  }


  /**
   * 创建favor
   * 
   * @param name：名称 （集团或企业）
   * @param type ：类型 （枚举）
   * @param userName 
   * @param token ：token
   * @param userid ：userid
   */
  createFavor() {


  }
  /**
   * 删除favor
   * 
   * @param name：名称 （集团或企业）
   * @param type ：类型 （枚举）
   * @param userName 
   * @param token ：token
   * @param userid ：userid
   */
  deleteFavor() {


  }

  /**
   * 获取 favor 数据
   * @param userName 用户名称
   * @param type 类型 （枚举）
   * @param token ：token
   * @param userid ：userid
   */
  getFavorData() {

  }

  /**
   * 
   * @param oldpwd 
   * @param newpwd 
   */
  modifyPwd(oldpwd, newpwd) {

  }

}
