import { Component, OnInit, OnDestroy } from "@angular/core";
import { ImageGalleryService } from "./image-gallery.service";
import { Subscription } from "rxjs";
import { GalleryGroupService } from "./gallery-group/gallery-group.service";
import { GalleryPictureColumnService } from "./gallery-picture-column/gallery-picture-column.service";

@Component({
    selector: "app-image-gallery",
    templateUrl: "./image-gallery.component.html",
    styleUrls: ["./image-gallery.component.scss"],
})
export class ImageGalleryComponent implements OnInit, OnDestroy {
    private isVisiableRX$: Subscription;

    // 获取浏览器高度
    public get drawerHeight(): number {
        return window.innerHeight;
    }

    public get isVisibleImageDrawer(): boolean {
        return this.imageGalleryService.isVisibleImageDrawer$.value;
    }

    constructor(
        private readonly imageGalleryService: ImageGalleryService,
        private readonly galleryGroupService: GalleryGroupService,
        private readonly galleryPictureColumnService: GalleryPictureColumnService
    ) {
        this.isVisiableRX$ = this.imageGalleryService.isVisibleImageDrawer$.subscribe(b => {
            if (b) {
                this.galleryGroupService.acquirePictureGroupList().subscribe(list => {
                    this.galleryGroupService.pictureGroupList$.next(list);
                    this.galleryGroupService.currentPictureGroup$.next(list[0]);
                });
            } else {
                this.galleryPictureColumnService.currentPictureList$.next([]);
                this.galleryPictureColumnService.resetPageConditions();
                this.imageGalleryService.selectType$.next("radio");
                this.imageGalleryService.nzOk = null;
                this.imageGalleryService.nzCancel = null;
                this.imageGalleryService.nzTipText = "";
                this.imageGalleryService.maxCount = Infinity;
                this.imageGalleryService.currentCheckImageList$.next([]);
                this.imageGalleryService.isEnterManageMode$.next(false);
                this.imageGalleryService.checkImageMap.clear();
                if (this.imageGalleryService.nzCancel) {
                    this.imageGalleryService.nzCancel();
                }
            }
        });
    }

    ngOnInit() {}

    ngOnDestroy() {
        if (this.isVisiableRX$) {
            this.isVisiableRX$.unsubscribe();
        }
    }

    ngAfterViewInit() {}
}
