import { Injectable } from "@angular/core";
import { TSelectType, IImageGalleryConfigOptionsable } from "@ng-public/image-gallery/model";
import { BehaviorSubject } from "rxjs";
import { get } from "lodash";
import { ImageModel } from "./model/image.model";

@Injectable()
export class ImageGalleryService {
    // 是否显示图片管理
    public readonly isVisibleImageDrawer$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // 是否进入管理模式
    public readonly isEnterManageMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // 图片选择是单选还是多选
    public readonly selectType$: BehaviorSubject<TSelectType> = new BehaviorSubject<TSelectType>("radio");

    // 按下确定按钮之后的回调函数
    public nzOk: Function;

    // 按下取消按钮之后的回调函数
    public nzCancel: Function;

    // 右侧组件的文案提示语句，默认为空
    public nzTipText = "";

    // 最大数量，默认无限
    public maxCount = Infinity;

    // 当前已选中的图片数据集合
    public readonly currentCheckImageList$: BehaviorSubject<ImageModel[]> = new BehaviorSubject([]);

    // 当前已选中的图片集合Map索引
    private readonly currentCheckImageListMap: Map<number, ImageModel> = new Map();

    constructor() {}

    // 获取已选中的图片Map索引数据
    public get checkImageMap(): Map<number, ImageModel> {
        return this.currentCheckImageListMap;
    }

    /**
     * 增加或删除已选中的图片列表函数
     */
    public toggleCheckCurrentImageList(data: ImageModel): ImageModel[] {
        data.isActive = !data.isActive;
        const checkList: ImageModel[] = this.currentCheckImageList$.value;
        if (data.isActive) {
            this.currentCheckImageListMap.set(data.id, data);
            checkList.push(data);
        } else {
            this.currentCheckImageListMap.delete(data.id);
            for (let i = 0; i < checkList.length; i++) {
                if (checkList[i].id == data.id) {
                    checkList.splice(i, 1);
                    break;
                }
            }
        }
        this.currentCheckImageList$.next(checkList);
        return checkList;
    }

    /**
     * 图片选择管理的调用方法，参数为IImageGalleryConfigOptionsable
     */
    public open(config: IImageGalleryConfigOptionsable): void {
        if (config) {
            this.isVisibleImageDrawer$.next(true);
            this.selectType$.next(get(config, "selectType", "radio"));
            this.nzOk = config.nzOk;
            this.nzCancel = config.nzCancel;
            this.nzTipText = config.nzTipText;
            this.maxCount = config.maxCount;
        }
    }

    /**
     * 关闭窗口并重置所有数据
     */
    public close(): void {
        this.isVisibleImageDrawer$.next(false);
    }
}
