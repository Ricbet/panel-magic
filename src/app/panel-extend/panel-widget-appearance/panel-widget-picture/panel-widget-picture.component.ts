import { Component, OnInit, Input } from "@angular/core";
import { PanelWidgetModel } from "../../panel-widget/model";
import { ImageGalleryService } from "@ng-public/image-gallery/image-gallery.service";
import { PanelScopeEnchantmentService } from "../../panel-scope-enchantment/panel-scope-enchantment.service";
import { IImageGalleryConfigOptionsable } from "@ng-public/image-gallery/model";
import { ImageModel } from "@ng-public/image-gallery/model/image.model";

@Component({
	selector: "app-panel-widget-picture",
	templateUrl: "./panel-widget-picture.component.html",
	styleUrls: ["./panel-widget-picture.component.scss"]
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
			}
		});
	}

	/**
	 * 一键处理图片原始比例
	 */
	public handlePictureProp(width?: number, height?: number): void {
		const _inset_widget = this.panelScopeEnchantmentService.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
		if (Array.isArray(_inset_widget) && _inset_widget.length == 1 && _inset_widget[0].type == "picture") {
			const _picture = _inset_widget[0];
			// 获取原始宽高
			if (_picture.autoWidget.content) {
				const _img_url = _picture.autoWidget.content;
				// const _img_url = environment.fileurl + _picture.autoWidget.content
				const _image_obj = new Image();
				_image_obj.src = _img_url;
				// 原始图片的宽度与高度的比例
				const _height_proportion_width = _image_obj.height / _image_obj.width;
				// 根据当前的宽度与比例重新计算高度
				_picture.profileModel.setData({
					width: width ? width : _picture.profileModel.width,
					height: height ? height : _picture.profileModel.width * _height_proportion_width
				});
				_picture.addStyleToUltimatelyStyle({
					width: (width ? width : _picture.profileModel.width) + "px",
					height: (height ? height : _picture.profileModel.width * _height_proportion_width) + "px"
				});
				this.panelScopeEnchantmentService.handleFromWidgetListToProfileOuterSphere({
					isLaunch: false
				});
			}
		}
	}
}
