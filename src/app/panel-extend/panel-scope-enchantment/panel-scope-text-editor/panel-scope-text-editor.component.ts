import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { PanelScopeEnchantmentService } from "../panel-scope-enchantment.service";
import { PanelScopeTextEditorModel } from "../model";
import { Subscription, fromEvent } from "rxjs";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelWidgetAppearanceService } from "../../panel-widget-appearance/panel-widget-appearance.service";

@Component({
    selector: "app-panel-scope-text-editor",
    templateUrl: "./panel-scope-text-editor.component.html",
    styleUrls: ["./panel-scope-text-editor.component.scss"],
})
export class PanelScopeTextEditorComponent implements OnInit {
    @ViewChild("textEditorEl", { static: false }) public textEditorEl: ElementRef;
    @ViewChild("spanEl", { static: false }) public spanEl: ElementRef;
    private panelTextEditorRX$: Subscription;
    private keyboardEnterRX$: Subscription;
    private insetWidget: PanelWidgetModel;

    public get panelScopeTextEditor(): PanelScopeTextEditorModel {
        return this.panelScopeEnchantmentService.panelScopeTextEditorModel$.value;
    }

    constructor(
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService,
        private readonly zone: NgZone
    ) {
        this.panelTextEditorRX$ = this.panelScopeEnchantmentService.panelScopeTextEditorModel$
            .pipe()
            .subscribe(value => {
                if (value) {
                    // 取消八个拖拽点
                    this.panelScopeEnchantmentService.scopeEnchantmentModel.cornerPinList$.next([]);
                    // 取消八个位置点
                    this.panelScopeEnchantmentService.scopeEnchantmentModel.cornerLocationPinList$.next([]);
                    // 开启键盘监听
                    this.openKeyboardEnter();
                    // 聚焦
                    setTimeout(() => {
                        this.spanEl.nativeElement.focus();
                        // 取消外观设置
                        this.panelWidgetAppearanceService.appearanceModel.isShow$.next(false);
                        // 取消temporary
                        this.panelScopeEnchantmentService.scopeEnchantmentModel.profileTemporary$.next(null);
                    });
                } else {
                    console.log(this.insetWidget, "i");
                    this.insetWidget.isHiddenText = false;
                    this.saveEditorText();
                }
            });
    }

    ngOnInit() {
        const _w = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        this.insetWidget = Array.isArray(_w) && _w.length > 0 ? _w[0] : null;
    }

    ngOnDestroy() {
        if (this.panelTextEditorRX$) this.panelTextEditorRX$.unsubscribe();
        if (this.keyboardEnterRX$) this.keyboardEnterRX$.unsubscribe();
    }

    /**
     * 开启enter键监听，一按下就保存
     */
    public openKeyboardEnter(): void {
        this.keyboardEnterRX$ = fromEvent(document, "keydown").subscribe((event: KeyboardEvent) => {
            this.zone.run(() => {
                if (event.keyCode == 13) {
                    this.saveEditorText();
                    this.exitEditorText();
                } else if (event.keyCode != 46) {
                    // 判断文字是否超出组件宽度
                    setTimeout(() => {
                        this.handleInseWidgetTextWidthLength();
                    });
                }
            });
        });
    }

    /**
     * 判断文字是否超出组件宽度
     */
    public handleInseWidgetTextWidthLength(): void {
        const _span_width = this.spanEl.nativeElement.getBoundingClientRect().width;
        const _is_has_border = this.insetWidget.panelFacadeModel.borderStyle == "none" ? false : true;
        const _widget_width =
            this.insetWidget.conventionSiteModel.width -
            (_is_has_border ? this.insetWidget.panelFacadeModel.borderNumber * 2 : 0);
        let _handle_width = _is_has_border ? _span_width + this.panelScopeTextEditor.borderNumber * 2 : _span_width;
        _handle_width = Math.round(_handle_width);
        if (_span_width > _widget_width) {
            this.insetWidget.profileModel.setData({ width: _handle_width });
            this.insetWidget.addStyleToUltimatelyStyle({ width: _handle_width + "px" });
            this.panelScopeTextEditor.width = _handle_width;
            this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere.width = _handle_width + 2;
        }
    }

    /**
     * 执行保存操作
     */
    public saveEditorText(): void {
        if (this.insetWidget) {
            const _innertext = this.textEditorEl.nativeElement.textContent;
            // this.panelScopeTextEditor.text = _innertext
            this.insetWidget.autoWidget.content = _innertext;
        }
    }

    /**
     * 取消编辑器模式
     */
    public exitEditorText(): void {
        if (this.insetWidget) {
            this.panelScopeEnchantmentService.panelScopeTextEditorModel$.next(null);
            this.panelScopeEnchantmentService.scopeEnchantmentModel.emptyAllProfile();
        }
    }

    /**
     * 点击组件聚焦文本span标签
     */
    public focusSpanEdit(): void {
        this.spanEl.nativeElement.focus();
    }
}
