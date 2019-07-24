import { Component, OnInit, OnDestroy } from "@angular/core";
import { handlePrepareList, IPrepareOption, TFeaturesSoul } from "./model/handle-prepare-option";
import { TapFeaturesHandlerService } from "./tap-features-handler.service";

@Component({
    selector: "app-tap-features-handler",
    templateUrl: "./tap-features-handler.component.html",
    styleUrls: ["./tap-features-handler.component.scss"],
})
export class TapFeaturesHandlerComponent implements OnInit, OnDestroy {
    // 待选择的功能列表
    public handlePrepareList: IPrepareOption[] = handlePrepareList;

    public get currentFeatures(): TFeaturesSoul {
        return this.tapFeaturesHandlerService.currentFeatures$.value;
    }

    constructor(private readonly tapFeaturesHandlerService: TapFeaturesHandlerService) {}

    ngOnInit() {}

    ngOnDestroy() {}

    /**
     * 接收选中的某一个待功能的事件
     */
    public acceptPrepareCheck(data: IPrepareOption): void {
        this.tapFeaturesHandlerService.currentFeatures$.next(data.type);
        console.log(data);
    }
}
