import { Component, OnInit, Input, OnDestroy, ViewChild, QueryList } from "@angular/core";
import { PanelWidgetModel } from "../../model";
import { PictureAdModel, ImageItemModel } from "./slideshow-picture-site-view/picture-ad-image-item/model";
import { Subscription } from "rxjs";
import { WidgetModel } from "../../model/widget.model";
import { debounceTime } from "rxjs/operators";
import { NzCarouselContentDirective, NzCarouselComponent } from "ng-zorro-antd";

@Component({
    selector: "app-slideshow-picture-view",
    templateUrl: "./slideshow-picture-view.component.html",
    styleUrls: ["./slideshow-picture-view.component.scss"],
})
export class SlideshowPictureViewComponent implements OnInit, OnDestroy {
    @ViewChild("carouselEl", { static: false }) public carouselEl: NzCarouselComponent;
    // 订阅值变化
    private profileValueChangeRX$: Subscription;

    private _widget: PanelWidgetModel;
    // 默认的基础配置项
    public widgetModel: WidgetModel;
    @Input()
    public get widget(): PanelWidgetModel {
        return this._widget;
    }
    public set widget(v: PanelWidgetModel) {
        if (v.type != "") {
            this._widget = v;
            this.widgetModel = v.autoWidget;
            this.widgetModel.content.pictureAdModel = new PictureAdModel(v.autoWidget.content.pictureAdModel);
            this.widgetModel.content.templateType = 1;
            this.openValueChange();
        }
    }

    public get imageList(): Array<ImageItemModel> {
        return this.widgetModel.content.pictureAdModel.imageList;
    }

    public get carouselHeight(): number {
        return this.widgetModel.content.pictureAdModel.carouselHeight;
    }
    public set carouselHeight(v: number) {
        this.widgetModel.content.pictureAdModel.carouselHeight = v;
    }

    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {
        if (this.profileValueChangeRX$) this.profileValueChangeRX$.unsubscribe();
    }

    /**
     * 开启监听
     */
    public openValueChange(): void {
        if (this.widget) {
            this.profileValueChangeRX$ = this.widget.profileModel.valueChange$
                .pipe(debounceTime(1))
                .subscribe(value => {
                    if (this.carouselEl) {
                        const _profile_width = value.width;
                        const _profile_height = value.height;
                        const _slide_contents: QueryList<NzCarouselContentDirective> = this.carouselEl.carouselContents;
                        _slide_contents.map((e: NzCarouselContentDirective) => {
                            // e.width = _profile_width
                        });
                        this.carouselHeight = _profile_height;
                    }
                });
        }
    }

    /**
     * 重新计算整个表单组件的高度,并且重新计算profile最外层轮廓的高度
     */
    // public calcSlideShowPictureSize(): void {
    // 	const _rect = this.widgetContainer.nativeElement.getBoundingClientRect()
    // 	if (_rect) {
    // 		this.autoWidget.profileModel.setSourceDataNoLaunch({
    // 			rotate: 0,
    // 			opacity: 100,
    // 			width: 414,
    // 			height: _rect.height
    // 		});
    // 		this.autoWidget.addStyleToUltimatelyStyle({
    // 			width: '414px',
    // 			height: _rect.height + 'px'
    // 		});
    // 		this.widgetModel.style.data = this.autoWidget.autoWidget.style.data;
    // 		const _profile_value = this.panelScopeEnchantmentService.scopeEnchantmentModel.valueProfileOuterSphere
    // 		const _profile_length = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.length
    // 		if (_profile_value && _profile_length == 1) {
    // 			_profile_value.setData({ height: _rect.height })
    // 		}

    // 	}
    // }
}
