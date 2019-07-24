import { Injectable } from "@angular/core";
import { ImageGroupModel } from "../model";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class GalleryGroupService {
    // 图片分组列表
    public pictureGroupList$: BehaviorSubject<ImageGroupModel[]> = new BehaviorSubject([]);

    // 图片分组列表的Map类
    public pictureGroupListMap: Map<number, ImageGroupModel> = new Map();

    // 当前选中的图片分组
    public currentPictureGroup$: BehaviorSubject<ImageGroupModel> = new BehaviorSubject(null);

    constructor() {}

    /**
     * 从接口获取图片分组列表
     */
    public acquirePictureGroupList(): Observable<ImageGroupModel[]> {
        this.pictureGroupListMap.clear();
        return of([]);
    }

    /**
     * 创建图片分组
     */
    public createPictureGroup(): Observable<boolean> {
        return of(false);
    }

    /**
     * 修改分组名称
     */
    public editPictureGroup(): Observable<boolean> {
        return of(false);
    }

    /**
     * 删除分组
     */
    public delPictureGroup(): Observable<boolean> {
        return of(false);
    }
}
