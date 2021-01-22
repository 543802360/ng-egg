import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * safe管道
 * 将url转换为angular 中 iframe可以识别的安全url链接
 *
 * @export
 * @class SafePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: "iframeSafe"
})
export class IframeSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
