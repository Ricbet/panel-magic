import { Injectable } from "@angular/core";
import { HsFileService } from "app/service";
import { Observable, BehaviorSubject, of } from "rxjs";
import { ImageModel } from "../model/image.model";
import { ImageGalleryService } from "../image-gallery.service";
import { NzMessageService } from "ng-zorro-antd";

@Injectable({
    providedIn: "root",
})
export class GalleryPictureColumnService {
    // 当前页码
    public page: number = 1;

    // 是否有下一页
    public isNextPage: boolean = false;

    // 是否显示loading加载效果
    public isVisibleLoading: boolean = false;

    // 是否全选
    public isCheckAll: boolean = false;

    // 当前分组下的图片列表
    public currentPictureList$: BehaviorSubject<ImageModel[]> = new BehaviorSubject([]);

    public get checkImageMap(): Map<number, ImageModel> {
        return this.imageGalleryService.checkImageMap;
    }

    constructor(
        private readonly nzMessageService: NzMessageService,
        private readonly imageGalleryService: ImageGalleryService
    ) {}

    /**
     * 选中某一张图片的事件
     */
    public chooseImageCard(data: ImageModel): void {
        if (this.imageGalleryService.isEnterManageMode$.value) {
            this.imageGalleryService.toggleCheckCurrentImageList(data);
            this.handleCheckAllStatus();
        } else {
            const currentCheckImageList = this.imageGalleryService.currentCheckImageList$.value;
            if (this.imageGalleryService.selectType$.value == "radio") {
                this.imageGalleryService.checkImageMap.forEach(e => e.isActive = false);
                data.isActive = true;
                this.imageGalleryService.checkImageMap.set(data.id, data);
                this.imageGalleryService.currentCheckImageList$.next([data]);
            } else if (this.imageGalleryService.selectType$.value == "checkbox") {
                this.imageGalleryService.toggleCheckCurrentImageList(data);
                // 同时判断是否超出最大数量，是的话则自动过滤旧的数据
                const maxCount = this.imageGalleryService.maxCount;
                if (currentCheckImageList.length > maxCount) {
                    this.nzMessageService.warning(`图片选择已超过${maxCount}张，将自动过滤之前的已选图片`);
                    this.imageGalleryService.toggleCheckCurrentImageList(currentCheckImageList[0]);
                }
            }
        }
    }

    /**
     * 验证全选状态
     */
    public handleCheckAllStatus(): void {
        this.isCheckAll = !this.currentPictureList$.value.some(e => e.isActive === false)
    }

    /**
     * 初始化列表搜索条件如页码等
     */
    public resetPageConditions(): void {
        this.page = 1;
    }

    /**
     * 获取图片列表
     */
    public acquirePictureList(groupId?: number): Observable<ImageModel[]> {
        this.isNextPage = false;
        this.isVisibleLoading = true;
        return of([]);
    }

    /**
     * 修改图片名称
     */
    public editImageName(id: number, name: string): Observable<boolean> {
        return of(false);
    }

    /**
     * 删除图片
     */
    public delImage(ids: number[]): Observable<boolean> {
        return of(false);
    }

    /**
     * 移动图片分组
     * ids是图片id列表
     */
    public moveGroupFormImage(ids: number[], groupId: number): Observable<boolean> {
        return of(false);
    }
}
