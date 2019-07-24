import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { ImageGalleryService } from "@ng-public/image-gallery/image-gallery.service";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { IImageGalleryConfigOptionsable } from "@ng-public/image-gallery/model";
import { ImageModel } from "@ng-public/image-gallery/model/image.model";

@Component({
    selector: "app-panel-widget-picture",
    templateUrl: "./panel-widget-picture.component.html",
    styleUrls: ["./panel-widget-picture.component.scss"],
})
export class PanelWidgetPictureComponent implements OnInit {
    @Input()
    public widget: PanelWidgetModel;

    constructor(
        private readonly imageGalleryService: ImageGalleryService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
    ) {}

    ngOnInit() {}

    ngOnDestroy() {}

    /**
     * 显示图片管理选择
     */
    public showImageGallery(): void {
        this.imageGalleryService.open(<IImageGalleryConfigOptionsable>{
            selectType: "radio",
            nzOk: (data: ImageModel) => {
                if (data) {
                    this.widget.autoWidget.content = data.url;
                    this.handlePictureProp(data.panelWidth, data.panelHeight);
                }
            },
        });
    }

    /**
     * 一键处理图片原始比例
     */
    public handlePictureProp(width?: number, height?: number): void {
        const insetWidget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (Array.isArray(insetWidget) && insetWidget.length == 1 && insetWidget[0].type == "picture") {
            const picture = insetWidget[0];
            // 获取原始宽高
            if (picture.autoWidget.content) {
                const imgUrl = picture.autoWidget.content;
                const imageObj = new Image();
                imageObj.src = imgUrl;
                // 原始图片的宽度与高度的比例
                const heightProportionWidth = imageObj.height / imageObj.width;
                // 根据当前的宽度与比例重新计算高度
                picture.profileModel.setData({
                    width: width ? width : picture.profileModel.width,
                    height: height ? height : picture.profileModel.width * heightProportionWidth,
                });
                picture.addStyleToUltimatelyStyle({
                    width: (width ? width : picture.profileModel.width) + "px",
                    height: (height ? height : picture.profileModel.width * heightProportionWidth) + "px",
                });
                this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
                    isLaunch: false,
                });
            }
        }
    }
}
