import { Component, OnInit, Input, SimpleChanges, Output } from "@angular/core";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import { PanelTextModel } from "../model";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { PanelWidgetModel } from "../../panel-widget/model";

@Component({
    selector: "app-panel-widget-text",
    templateUrl: "./panel-widget-text.component.html",
    styleUrls: ["./panel-widget-text.component.scss"],
})
export class PanelWidgetTextComponent implements OnInit {
    @Input() public widget: PanelWidgetModel;
    @Output() public launchEmitTextValueChange: Subject<PanelTextModel> = new Subject<PanelTextModel>();
    // 文本设置所有值的变化可观察对象
    private panelTextValueChangeRX$: Subscription;
    public get panelText(): PanelTextModel {
        return this.panelWidgetAppearanceService.panelTextModel$.value;
    }
    constructor(private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService) {
        this.panelTextValueChangeRX$ = this.panelText.valueChange$.pipe(debounceTime(10)).subscribe(value => {
            if (value) {
                // 监听所有值的变化修改样式数据 只针对选中一个组件的情况
                this.launchEmitTextValueChange.next(this.panelText);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.panelTextValueChangeRX$) this.panelTextValueChangeRX$.unsubscribe();
    }

    ngOnChanges(change: SimpleChanges) {
        if (change.widget) {
            if (this.widget.panelTextModel) {
                this.panelText.setData(this.widget.panelTextModel.getValue());
            }
        }
    }
}
