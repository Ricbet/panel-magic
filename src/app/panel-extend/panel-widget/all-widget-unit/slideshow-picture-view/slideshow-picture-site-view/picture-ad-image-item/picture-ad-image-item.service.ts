import { Injectable } from "@angular/core";

import { PictureAdModel, ImageItemModel } from "./model";

// 热区弹窗的数据模型
class HotspotModal {
    isShow: boolean = false;
    // 当前选中的需要编辑热区的图片数据
    currenrImageItemData: ImageItemModel;
}

@Injectable()
export class PictureAdImageItemService {
    // 图片广告的数据模型
    public pictureAdModel: PictureAdModel;

    constructor() {}

    // 点击添加背景图选择某一张图片之后增加一个背景图列表
    public addNewImageList(src: string): void {
        this.pictureAdModel.addImage(src);
    }
}
