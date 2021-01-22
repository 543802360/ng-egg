import {
  Directive,
  Input,
  Output,
  ElementRef,
  Renderer2,
  OnInit
} from "@angular/core";
import { MapboxService } from "../../services/mapbox/mapbox.service";

@Directive({
  selector: "[mapbox]"
})
export class MapboxDirective implements OnInit {
  @Input() options: any; // map input options

  private container: HTMLElement; // map container
  private defaultOptions: any; // 默认地图配置项

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private mapboxService: MapboxService
  ) { }

  public get Container(): HTMLElement {
    return this.container;
  }

  ngOnInit() {
    this.container = this.el.nativeElement;
    this.defaultOptions = {
      attributionControl: false,
      container: this.container
    };
    this.options = this.options ? Object.assign(this.defaultOptions, this.options) : this.defaultOptions;
    this.mapboxService.init(this.options);
  }
}
