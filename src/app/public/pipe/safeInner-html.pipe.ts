import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

/**
 * 安全转化innerhtml
 */
@Pipe({ name: "safeInnerHtml" })
export class SafeInnerHtmlPipe implements PipeTransform {
    constructor(private readonly sanitized: DomSanitizer) {}
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
