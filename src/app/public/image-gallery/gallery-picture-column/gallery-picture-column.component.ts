import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { GalleryGroupService } from "../gallery-group/gallery-group.service";
import { Subscription } from "rxjs";
import { GalleryPictureColumnService } from "./gallery-picture-column.service";
import { ImageModel } from "../model/image.model";
import { ImageGroupModel, TSelectType } from "../model";
import { ImageGalleryService } from "../image-gallery.service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { cloneDeep } from "lodash";

@Component({
    selector: "app-gallery-picture-column",
    templateUrl: "./gallery-picture-column.component.html",
    styleUrls: ["./gallery-picture-column.component.scss"],
})
export class GalleryPictureColumnComponent implements OnInit, OnDestroy {
    @ViewChild("editInputNameEl", { static: false }) private editInputNameEl: ElementRef;

    // 订阅当前分组的选中变化
    private pictureGroupChenge$: Subscription;

    // 是否显示批量修改分组气泡卡片
    public isVisibleEditGroupPopover: boolean = false;

    // 当前的图片分组
    public get currentPictureGroup(): ImageGroupModel {
        return this.galleryGroupService.currentPictureGroup$.value;
    }

    public get pictureGroupList(): ImageGroupModel[] {
        return this.galleryGroupService.pictureGroupList$.value;
    }

    public get currentPictureList(): ImageModel[] {
        return this.galleryPictureColumnService.currentPictureList$.value;
    }

    public get isNextPage(): boolean {
        return this.galleryPictureColumnService.isNextPage;
    }

    public get isVisibleLoading(): boolean {
        return this.galleryPictureColumnService.isVisibleLoading;
    }

    public get isCheckAll(): boolean {
        return this.galleryPictureColumnService.isCheckAll;
    }

    public get selectType(): TSelectType {
        return this.imageGalleryService.selectType$.value;
    }

    public get isEnterManageMode(): boolean {
        return this.imageGalleryService.isEnterManageMode$.value;
    }

    public get currentCheckImageList(): ImageModel[] {
        return this.imageGalleryService.currentCheckImageList$.value;
    }

    // 是否允许批量删除图片和批量修改分组
    public get isAllowDelOrGroupChecked(): boolean {
        return this.isEnterManageMode && this.currentCheckImageList.length > 0;
    }

    constructor(
        private readonly galleryGroupService: GalleryGroupService,
        private readonly imageGalleryService: ImageGalleryService,
        private readonly nzMessageService: NzMessageService,
        private readonly renderer: Renderer2,
        private readonly nzModalService: NzModalService,
        private readonly galleryPictureColumnService: GalleryPictureColumnService
    ) {
        this.pictureGroupChenge$ = this.galleryGroupService.currentPictureGroup$.subscribe(value => {
            if (value) {
                this.galleryPictureColumnService.resetPageConditions();
                this.galleryPictureColumnService.acquirePictureList(value.id).subscribe(value => {
                    this.galleryPictureColumnService.currentPictureList$.next(value);
                    this.galleryPictureColumnService.handleCheckAllStatus();
                });
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.pictureGroupChenge$) this.pictureGroupChenge$.unsubscribe();
    }

    /**
     * 点击加载更多按钮
     */
    public addMorePicture(): void {
        this.galleryPictureColumnService.page += 1;
        this.galleryPictureColumnService.acquirePictureList(this.currentPictureGroup.id).subscribe(value => {
            this.galleryPictureColumnService.currentPictureList$.next(this.currentPictureList.concat(value));
            this.galleryPictureColumnService.handleCheckAllStatus();
        });
    }

    /**
     * 接收全选按钮的改变
     */
    public acceptCheckAll(isAll: boolean): void {
        this.galleryPictureColumnService.isCheckAll = isAll;
        this.currentPictureList.forEach(e => {
            if (isAll) {
                if (e.isActive == false) this.imageGalleryService.toggleCheckCurrentImageList(e);
            } else {
                if (e.isActive == true) this.imageGalleryService.toggleCheckCurrentImageList(e);
            }
        });
    }

    /**
     * 接收选中某一张图片的函数
     */
    public acceptChooseImageCard(data: ImageModel): void {
        this.galleryPictureColumnService.chooseImageCard(data);
    }

    /**
     * 接收点击修改名称的函数
     */
    public acceptEditName(data: ImageModel): void {
        data.isEnterEditName = true;
        setTimeout(() => this.editInputNameEl.nativeElement.focus());
    }

    /**
     * 接收点击管理按钮判断是进入还是退出管理模式
     */
    public acceptChangeManageMode(): void {
        this.imageGalleryService.isEnterManageMode$.next(!this.isEnterManageMode);
        this.galleryPictureColumnService.isCheckAll = false;
        this.imageGalleryService.currentCheckImageList$.next([]);
        this.imageGalleryService.checkImageMap.forEach(e => (e.isActive = false));
        this.imageGalleryService.checkImageMap.clear();
        const asside = document.querySelector("#image-gallery-asside");
        this.renderer.setStyle(asside, "opacity", "0.6");
        setTimeout(() => {
            this.renderer.removeStyle(asside, "opacity");
        }, 300);
    }

    /**
     * 接收修改图片名称的input标签blur事件，判断是否需要请求修改名称接口
     */
    public popEditImageAffirm(data: ImageModel): void {
        data.isEnterEditName = false;
        if (data.name.trim() == "") {
            this.nzMessageService.warning("图片名称不能为空");
            data.name = data.fixedName;
        } else if (data.name != data.fixedName) {
            this.galleryPictureColumnService.editImageName(data.id, data.name).subscribe(b => {
                if (b) {
                    this.nzMessageService.success("修改图片名称成功");
                    data.fixedName = data.name;
                }
            });
        }
    }

    /**
     * 点击删除图片
     */
    public acceptDelImageConfirm(data: ImageModel, index: number): void {
        const pictureGroupMap = this.galleryGroupService.pictureGroupListMap;
        const nzModal = this.nzModalService.confirm({
            nzTitle: `是否确认删除该图片？`,
            nzOkType: "danger",
            nzOnOk: () => {
                nzModal["nzOkLoading"] = true;
                this.galleryPictureColumnService.delImage([data.id]).subscribe(b => {
                    nzModal["nzOkLoading"] = false;
                    if (b) {
                        this.nzMessageService.success("删除成功");
                        data.isActive = true;
                        nzModal.close();
                        this.pictureGroupList[0].total -= 1;
                        if (pictureGroupMap.has(data.groupId)) {
                            pictureGroupMap.get(data.groupId).total -= 1;
                        }
                        this.imageGalleryService.toggleCheckCurrentImageList(data);
                        this.currentPictureList.splice(index, 1);
                    }
                });
                return false;
            },
        });
    }

    /**
     * 批量删除图片
     */
    public acceptDelBatchImage(): void {
        if (this.isAllowDelOrGroupChecked) {
            const picList = cloneDeep(this.currentCheckImageList);
            const pictureGroupMap = this.galleryGroupService.pictureGroupListMap;
            const nzModal = this.nzModalService.confirm({
                nzTitle: `是否确认批量删除所选图片?`,
                nzOkType: "danger",
                nzOnOk: () => {
                    const ids = picList.map(_e => _e.id);
                    nzModal["nzOkLoading"] = true;
                    this.galleryPictureColumnService.delImage(ids).subscribe(b => {
                        nzModal["nzOkLoading"] = false;
                        if (b) {
                            this.nzMessageService.success("删除成功");
                            nzModal.close();
                            picList.forEach(_e => {
                                this.pictureGroupList[0].total -= 1;
                                if (pictureGroupMap.has(_e.groupId)) {
                                    pictureGroupMap.get(_e.groupId).total -= 1;
                                }
                                this.imageGalleryService.toggleCheckCurrentImageList(_e);
                            });
                            // 重新请求当前分组的图片列表
                            this.galleryGroupService.currentPictureGroup$.next(this.currentPictureGroup);
                        }
                    });
                    return false;
                },
            });
        }
    }

    /**
     * 选中要移动的分组
     */
    public acceptCheckMoveGroup(group: ImageGroupModel): void {
        if (group.id != this.currentPictureGroup.id) {
            this.isVisibleEditGroupPopover = false;
            const picList = cloneDeep(this.currentCheckImageList);
            const pictureGroupMap = this.galleryGroupService.pictureGroupListMap;
            const picLen = picList.length;
            const ids = picList.map(e => e.id);
            this.galleryPictureColumnService.moveGroupFormImage(ids, group.id).subscribe(b => {
                if (b) {
                    group.total += picLen;
                    picList.forEach((e, i) => {
                        if (pictureGroupMap.has(e.groupId)) {
                            pictureGroupMap.get(e.groupId).total -= 1;
                        }
                        this.currentCheckImageList[i].groupId = group.id;
                    });
                    this.galleryGroupService.currentPictureGroup$.next(this.currentPictureGroup);
                    this.nzMessageService.success("移动成功");
                }
            });
        }
    }

    /**
     * 退出
     */
    public acceptCloseImageGallery(): void {
        this.imageGalleryService.close();
    }
}
