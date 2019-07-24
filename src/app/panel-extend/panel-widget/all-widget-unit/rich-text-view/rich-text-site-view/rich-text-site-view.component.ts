import { Component, OnInit, Input } from "@angular/core";

import { WidgetModel } from "../../../model/widget.model";
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "app-rich-text-site-view",
    templateUrl: "./rich-text-site-view.component.html",
    styleUrls: ["./rich-text-site-view.component.scss"],
})
export class RichTextSiteViewComponent implements OnInit {
    private _autoWidget: WidgetModel = new WidgetModel();

    public safeQuillThemeCss: SafeResourceUrl = "";

    @Input()
    public get autoWidget(): WidgetModel {
        return this._autoWidget;
    }
    public set autoWidget(v: WidgetModel) {
        this._autoWidget = v;
    }

    constructor(private readonly sanitizer: DomSanitizer) {
        this.safeQuillThemeCss = this.sanitizer.bypassSecurityTrustResourceUrl(`/assets/quill/quill.bubble.css`);
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
