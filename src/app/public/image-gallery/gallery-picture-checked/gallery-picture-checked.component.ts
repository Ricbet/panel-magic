import { Component, OnInit } from "@angular/core";
import { ImageGalleryService } from "../image-gallery.service";
import { ImageModel } from "../model/image.model";
import { TSelectType, ImageGroupModel } from "../model";
import { AppDataService } from "app/appdata/appdata.service";
import { GalleryGroupService } from "../gallery-group/gallery-group.service";
import { NzMessageService } from "ng-zorro-antd";
import { AppService } from "app/app.service";
import { get } from "lodash";
import { GalleryPictureColumnService } from "../gallery-picture-column/gallery-picture-column.service";

@Component({
    selector: "app-gallery-picture-checked",
    templateUrl: "./gallery-picture-checked.component.html",
    styleUrls: ["./gallery-picture-checked.component.scss"],
})
export class GalleryPictureCheckedComponent implements OnInit {
    public get currentCheckImageList(): ImageModel[] {
        return this.imageGalleryService.currentCheckImageList$.value;
    }

    public get currentPictureGroup(): ImageGroupModel {
        return this.galleryGroupService.currentPictureGroup$.value;
    }

    public get currentPictureList(): ImageModel[] {
        return this.galleryPictureColumnService.currentPictureList$.value;
    }

    public get nzTipText(): string {
        return this.imageGalleryService.nzTipText;
    }

    public get selectType(): TSelectType {
        return this.imageGalleryService.selectType$.value;
    }

    public get appId(): string {
        return this.appDataService.appDataModel.app_id;
    }

    public get isEnterManageMode(): boolean {
        return this.imageGalleryService.isEnterManageMode$.value;
    }

    public get uploadUrl(): string {
        return `api/upload?app_id=${this.appId}${
            this.currentPictureGroup && this.currentPictureGroup.id != null
                ? "&group_id=" + this.currentPictureGroup.id
                : ""
        }`;
    }

    public get pictureGroupList(): ImageGroupModel[] {
        return this.galleryGroupService.pictureGroupList$.value;
    }

    // 请求头
    public nzHeaders: { Authorization: string } = {
        Authorization: "",
    };

    constructor(
        private readonly imageGalleryService: ImageGalleryService,
        private readonly galleryGroupService: GalleryGroupService,
        private readonly nzMessageService: NzMessageService,
        private readonly galleryPictureColumnService: GalleryPictureColumnService,
        private readonly appDataService: AppDataService
    ) {}

    ngOnInit() {}

    /**
     * 上传图片之前的限制
     */
    public beforeUpload = (file: File) => {
        const isLt10M = file.size / 1024 / 1024 < 3;
        if (!isLt10M) {
            this.nzMessageService.error("图片已超过3MB");
        }
        return isLt10M;
    };

    /**
     * 取消已选中的图片
     */
    public acceptDelImage(data: ImageModel): void {
        this.imageGalleryService.toggleCheckCurrentImageList(data);
        this.galleryPictureColumnService.handleCheckAllStatus();
    }

    /**
     * 接收文件上传
     */
    public acceptUploadChanged(data: any): void {
        if (data.type == "success" && get(data, "file.response.status") == 1) {
            // 上传成功后
            this.handleSucceddUpload(data.file.response.data);
        } else if (data.type == "error") {
            this.nzMessageService.error("文件上传失败");
        }
    }

    /**
     * 上传成功后的文件处理
     */
    public handleSucceddUpload(data: any): void {
        this.currentPictureGroup.total += 1;
        const imageModel = new ImageModel(<ImageModel>{
            groupId: this.currentPictureGroup.id || 0,
            id: get(data, "id[0]"),
            name: get(data, "original"),
            fixedName: get(data, "original"),
            url: get(data, "url"),
        });
        if (this.currentPictureGroup.id != null) {
            this.pictureGroupList[0].total += 1;
        }
        this.currentPictureList.unshift(imageModel);
        this.galleryPictureColumnService.chooseImageCard(imageModel);
        this.galleryPictureColumnService.handleCheckAllStatus();
    }

    /**
     * 接收确定按钮
     */
    public acceptOkCheckImage(): void {
        if (this.selectType == "radio") {
            if (this.currentCheckImageList.length > 0) {
                const length = this.currentCheckImageList.length;
                const currentImage = this.currentCheckImageList[length - 1];
                // 计算原始宽高
                currentImage.calcImageSize();
                this.imageGalleryService.nzOk(currentImage);
            }
        } else if (this.selectType == "checkbox") {
            this.imageGalleryService.nzOk(this.currentCheckImageList);
        }
        this.imageGalleryService.close();
    }
}
