import { LeafletService } from "../services/leaflet.service";
import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit
} from "@angular/core";
@Directive({
  selector: "[leaflet]"
})
export class LeafletDirective implements OnInit {
  @Input()
  leafletOptions: any;

  map;
  constructor(private el: ElementRef, private leafletService: LeafletService) { }

  // 组件的初始化周期钩子函数
  ngOnInit() {
    this.leafletService.init(this.el.nativeElement, this.leafletOptions);
  }
}
