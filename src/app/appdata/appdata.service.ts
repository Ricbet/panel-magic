import { Injectable } from "@angular/core";

import { AppDataModel, IAppDataable, IAppConfigable } from "./appdata.model";
import { PagesModel } from "./pages.model";
import { AppDataObjectModel } from "./appdata-object.model";
import { BehaviorSubject, Subject } from "rxjs";
import { NewPageModel } from "app/panel-extend/panel-catalogue/model";

@Injectable({
    providedIn: "root",
})
export class AppDataService {
    // 页面内容总数据
    public appDataModel: AppDataModel = new AppDataModel();

    /**
     * 当前选中的页面数据
     * 默认选中的是第一个分组的第一个页面
     * @type {PagesModel}
     */
    public currentPageData$: BehaviorSubject<PagesModel> = new BehaviorSubject(null);

    /*
	返回当前选中页面在app_data里的对应页面数据
	 */
    public get currentAppDataForinPageData(): AppDataObjectModel {
        if (this.currentPageData$.value && this.appDataModel.app_data[this.currentPageData$.value.router]) {
            return this.appDataModel.app_data[this.currentPageData$.value.router];
        } else {
            return new AppDataObjectModel();
        }
    }

    /*
	传递AppDataModel数据
	 */
    public launchAppData$: BehaviorSubject<AppDataModel> = new BehaviorSubject<AppDataModel>(null);

    /*
	传递当前选中的页面数据
	 */
    public launchCurrentPageData$: Subject<PagesModel> = new Subject<PagesModel>();

    constructor() {}

    /**
     * 点击不同的页面替换当前的currentPageData页面数据
     */
    public setCurrentPageData(data: PagesModel): void {
        this.currentPageData$.next(data);
    }

    /**
     * 清空当前选择的页面
     */
    public emptyCurrentPageData(): void {
        this.currentPageData$.next(null);
    }

    /**
     * 手动创建一个首页
     */
    public createPageHome(groupId: number): void {
        const newPage = new NewPageModel();
        newPage.groupId = groupId;
        newPage.name = "首页";
        this.appDataModel.addNewPage(newPage);
    }

    /**
     * 赋值appData的数据
     */
    public setAppData(data: Partial<IAppDataable>): void {
        this.appDataModel.setData(data);
        // 设置当前默认选中的第一个页面，如果一个页面都没有则创建一个首页
        if (Array.isArray(this.appDataModel.cata_data) && this.appDataModel.cata_data.length > 0) {
            let firstGroup = this.appDataModel.cata_data[0];
            if (!(Array.isArray(firstGroup.pages) && firstGroup.pages.length > 0)) {
                firstGroup.pages = [];
                // 说明没有默认页面则创建一个首页
                this.createPageHome(firstGroup.uniqueId);
            }
            this.setCurrentPageData(firstGroup.pages[0]);
        } else {
            this.appDataModel.cata_data = [];
            //  说明没有分组,则创建一个分组和默认首页
            this.appDataModel.addNewGroup("默认组");
            this.createPageHome(this.appDataModel.cata_data[0].uniqueId);
            this.setCurrentPageData(this.appDataModel.cata_data[0].pages[0]);
        }
        // 检测首页page的router,如果没有则默认第一页为首页
        if (data.app_config && data.app_config.homePageRouter)
            this.setAppConfigData("homePageRouter", data.app_config.homePageRouter);
        else this.setAppConfigData("homePageRouter", this.appDataModel.cata_data[0].pages[0].router);

        this.launchAppData$.next(this.appDataModel);
    }

    /**
     * 删除某一个视图容器里的组件的时候，也对应的删除app_data里的eles数据
     */
    public delAppDataElesComponent(index: number): void {
        if (this.appDataModel.app_data[this.currentPageData$.value.router])
            this.appDataModel.app_data[this.currentPageData$.value.router].eles.splice(index, 1);
    }

    /**
     * 赋值配置项数据
     */
    public setAppConfigData(key: keyof IAppConfigable, value: any): void {
        this.appDataModel.app_config[key] = value;
    }
}
