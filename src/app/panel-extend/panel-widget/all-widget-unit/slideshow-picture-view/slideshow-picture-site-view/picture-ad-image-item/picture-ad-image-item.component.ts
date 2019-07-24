import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { PictureAdImageItemService } from "./picture-ad-image-item.service";
import { ImageGalleryService } from "@ng-public/image-gallery/image-gallery.service";
import { NzNotificationService } from "ng-zorro-antd";
import { DragulaService } from "ng2-dragula";

import { PictureAdModel, ImageItemModel } from "./model";
import { PanelScopeEnchantmentService } from "../../../../../panel-scope-enchantment/panel-scope-enchantment.service";
import { environment } from "environments/environment";
import { ImageModel } from "@ng-public/image-gallery/model/image.model";

@Component({
    selector: "app-picture-ad-image-item",
    templateUrl: "./picture-ad-image-item.component.html",
    styleUrls: ["./picture-ad-image-item.component.scss"],
})
export class PictureAdImageItemComponent implements OnInit {
    public dragulaRX$: Subscription;

    public currentChangeImgSrcData: ImageItemModel; // 点击更换图片的时候记录要更换的目标对象

    // 图片广告的数据模型
    @Input()
    public set pictureAdModel(v: PictureAdModel) {
        this.pais.pictureAdModel = v;
    }
    public get pictureAdModel(): PictureAdModel {
        return this.pais.pictureAdModel;
    }

    constructor(
        public pais: PictureAdImageItemService,
        private readonly dragulaService: DragulaService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService,
        private readonly nzNotificationService: NzNotificationService,
        private readonly imageGalleryService: ImageGalleryService
    ) {
        // 监听拖拽返回的方法
        this.dragulaRX$ = this.dragulaService.drop.subscribe(res => {
            if (res[0] == "pc-ad-bag") {
                let _first_index = +res[1]["dataset"]["dragindex"];
                let _last_index = +res[4]["dataset"]["dragindex"];
                // 然后开始改变位置
                let _first_data = this.pictureAdModel.imageList[_first_index];
                this.pictureAdModel.imageList.splice(_first_index, 1);
                this.pictureAdModel.imageList.splice(_last_index, 0, _first_data);
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.dragulaRX$) this.dragulaRX$.unsubscribe();
    }

    /**
     * 根据url创建image对象，获取图片的宽和高
     * 设置image对象
     * 用来根据图片的url获取到原始图片的宽和高
     */
    public handleImageStyleContent(url: string): void {
        if (url != "") {
            let _img_obj = new Image();
            _img_obj.src = url;
            this.currentChangeImgSrcData.width = _img_obj.width;
            this.currentChangeImgSrcData.height = _img_obj.height;
        }
    }

    /**
     * 显示选择图片组件
     */
    public showImageGallery(): void {
        this.imageGalleryService.open({
            nzTipText: "轮播图组件最多添加10张图片，超出选择则自动过滤掉之前选择的图片",
            maxCount: 10,
            selectType: "checkbox",
            nzOk: (data: ImageModel[]) => {
                if (Array.isArray(data)) {
                    // 选择完图片之后判断是否超过限制的图片数量，如果超过了则限制张数，同时提示
                    let _other_len: number = 10;
                    let _res_len: number = data.length;
                    if (_res_len > _other_len) {
                        this.nzNotificationService.create(
                            "warning",
                            "警告提示",
                            "您添加的轮播图超过最大值，已经自动删除多余的"
                        );
                        for (let i: number = 0; i < _other_len; i++) {
                            this.pais.addNewImageList(data[i].url);
                        }
                    } else {
                        data.forEach(_e => {
                            this.pais.addNewImageList(_e.url);
                        });
                    }
                }
            },
        });
    }

    /**
     * 更换图片
     */
    public showImageGalleryRadio(target: ImageItemModel = undefined): void {
        this.currentChangeImgSrcData = target;
        this.imageGalleryService.open({
            selectType: "radio",
            nzOk: (data: ImageModel) => {
                if (this.currentChangeImgSrcData) {
                    this.currentChangeImgSrcData.imgSrc = data.url;
                    this.handleImageStyleContent(environment.fileurl + this.currentChangeImgSrcData.imgSrc);
                }
            },
        });
    }

    /**
     * 删除图片列表的某一张
     */
    public handleDelImageList(index: number): void {
        this.pictureAdModel.imageList.splice(index, 1);
    }
}
