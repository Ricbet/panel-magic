import { Component, OnInit, Input, Output, SimpleChanges } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { PanelWidgetAppearanceService } from "../panel-widget-appearance.service";
import { PanelFilterModel } from "../model";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: "app-panel-widget-filter",
    templateUrl: "./panel-widget-filter.component.html",
    styleUrls: ["./panel-widget-filter.component.scss"],
})
export class PanelWidgetFilterComponent implements OnInit {
    // 订阅滤镜值的变化
    public filterValueChangeRX$: Subscription;

    @Input()
    public widget: PanelWidgetModel;

    @Output()
    public launchEmitFilterValueChange: Subject<PanelFilterModel> = new Subject();

    public get filterModel(): PanelFilterModel {
        return this.panelWidgetAppearanceService.panelFilterModel$.value;
    }

    constructor(private readonly panelWidgetAppearanceService: PanelWidgetAppearanceService) {
        this.filterValueChangeRX$ = this.filterModel.valueChange$.pipe(debounceTime(10)).subscribe(value => {
            this.launchEmitFilterValueChange.next(value);
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.filterValueChangeRX$) this.filterValueChangeRX$.unsubscribe();
    }

    ngOnChanges(change: SimpleChanges) {
        if (change.widget) {
            if (this.widget.panelFilterModel) {
                this.filterModel.setData(this.widget.panelFilterModel.getValue());
            }
        }
    }

    /**
     * 重置滤镜
     */
    public resetFilterData(): void {
        this.filterModel.resetData();
        this.launchEmitFilterValueChange.next(this.filterModel);
    }
}
