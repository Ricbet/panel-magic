import { CataDataModel } from "./catadata.model";
import { AppDataObjectModel } from "./appdata-object.model";
import { isObject } from "lodash";

import { NewPageModel } from "../panel-extend/panel-catalogue/model";
import { WidgetModel } from "../panel-extend/panel-widget/model/widget.model";

/**
 * 配置项选项
 */
export interface IAppConfigable {
	tabbarWidget: WidgetModel;
	// 首页的router
	homePageRouter: string;
}

export interface IAppDataable {
	app_id: string;
	cata_data: Array<CataDataModel>;
	app_data: { [key: string]: AppDataObjectModel };
	app_config: IAppConfigable;
	app_name: string;
	remark: string;
	thumb: string;
}

export class AppDataModel implements IAppDataable {
	// 应用的id
	public app_id: string;
	// 分组页面对象数据
	public cata_data: Array<CataDataModel>;
	// 数据对象
	public app_data: { [key: string]: AppDataObjectModel };
	// app的配置选项
	public app_config: IAppConfigable;
	// 项目名称
	public app_name: string;
	// 简介
	public remark: string;
	// 缩略图
	public thumb: string;
	//所有表单数据
	public form_data: Array<FormData>;

	constructor() {
		this.initData();
	}

	/**
	 * 初始化数据
	 */
	public initData(): void {
		this.app_id = "";
		this.cata_data = [];
		this.app_data = {};
		this.app_config = {
			tabbarWidget: null,
			homePageRouter: ""
		};
		this.app_name = "";
		this.remark = "";
		this.thumb = "";
	}

	/**
	 * 赋值数据
	 */
	public setData(data: Partial<IAppDataable>): void {
		if (!isObject(data)) return;

		if ((<Object>data).hasOwnProperty("app_id")) this.app_id = data.app_id;
		if ((<Object>data).hasOwnProperty("cata_data") && Array.isArray(data.cata_data)) {
			this.cata_data.length = 0;
			data.cata_data.forEach(_e => this.cata_data.push(new CataDataModel(_e)));
		}
		if ((<Object>data).hasOwnProperty("app_data") && isObject(data.app_data)) {
			for (let e in data.app_data) {
				this.handleCurrentAppDataAllPageData(e, data.app_data[e]);
			}
		}
		if ((<Object>data).hasOwnProperty("app_config") && isObject(data.app_config)) {
			for (let e in data.app_config) {
				if ((e as keyof IAppConfigable) == "tabbarWidget")
					this.app_config.tabbarWidget = new WidgetModel(data.app_config.tabbarWidget);
				if ((e as keyof IAppConfigable) == "homePageRouter")
					this.app_config.homePageRouter = data.app_config.homePageRouter;
			}
		}
		if ((<Object>data).hasOwnProperty("app_name")) this.app_name = data.app_name;
		if ((<Object>data).hasOwnProperty("remark")) this.remark = data.remark;
		if ((<Object>data).hasOwnProperty("thumb")) this.thumb = data.thumb;
	}

	/**
	 * 转化所有页面的数据为AppDataObjectModel数据模型
	 */
	public handleCurrentAppDataAllPageData(page: string, target: AppDataObjectModel): void {
		const appDataObject: AppDataObjectModel = <AppDataObjectModel>{
			router: page,
			eles: [],
			customfeature: {
				title: target.customfeature.title,
				name: target.customfeature.name,
				isHasTabbar: target.customfeature.isHasTabbar,
				isHomePage: target.customfeature.isHomePage,
				bgColor: target.customfeature.bgColor,
				navBgColor: target.customfeature.navBgColor,
				navFrontColor: target.customfeature.navFrontColor,
				pageHeight: target.customfeature.pageHeight
			}
		};
		if (Array.isArray(target.eles) && target.eles.length > 0) {
			target.eles.forEach(_e => {
				const _widget = new WidgetModel(_e);
				appDataObject.eles.push(_widget);
			});
		}
		this.app_data[page] = new AppDataObjectModel(<AppDataObjectModel>appDataObject);
	}

	/**
	 * 添加新页面，同时把新创建的page信息导入到app_data数据当中
	 */
	public addNewPage(data: NewPageModel, index: number = -1): string {
		let router: string = "";
		for (let i: number = 0; i < this.cata_data.length; i++) {
			if (this.cata_data[i].uniqueId == data.groupId) {
				router = this.handleNewPageAppData(data.name);
				this.cata_data[i].newPage(router, data.name, index);
				break;
			}
		}
		return router;
	}

	/**
	 * 处理app_data属性里的数据，当创建成功一个新页面的时候把数据导入进来，同时取该对象的最后一个属性加一之后成为新的page属性
	 * 避免重复
	 * 同时返回该页面的router
	 */
	public handleNewPageAppData(name: string): string {
		let newPage: number;
		for (let e in this.app_data) {
			let number = e.replace(/[^0-9]/gi, "");
			newPage = +number;
		}
		if (newPage == undefined) newPage = 9999;
		// 此时newPage就是最后一条的page
		// 然后我们就可以把新创建的新页面的数据同时创建在这里了;
		const appDataObject: AppDataObjectModel = <AppDataObjectModel>{
			router: `page${newPage + 1}`,
			eles: [],
			customfeature: {
				title: name,
				name: name,
				isHasTabbar: false,
				bgColor: "#ffffff",
				isHomePage: false,
				navBgColor: "#000000",
				navFrontColor: "#ffffff",
				pageHeight: 736
			}
		};
		this.app_data[`page${newPage + 1}`] = new AppDataObjectModel(<AppDataObjectModel>appDataObject);
		return `page${newPage + 1}`;
	}

	/**
	 * 创建新分组
	 */
	public addNewGroup(name: string): void {
		const newCata = new CataDataModel({ group: name });
		this.cata_data.push(newCata);
	}

	/**
	 * 删除分组
	 */
	public delGroup(index: number): void {
		this.cata_data.splice(index, 1);
	}

	/**
	 * 处理当删除某个页面或者删除某个分组的时候，也得把app_data这个属性里的对应的对象也删除喽！
	 */
	public delAppDataPage(pages: string | Array<string>): void {
		const delObj = (attr: string) => {
			if (this.app_data[attr]) delete this.app_data[attr];
		};

		if (Array.isArray(pages))
			Array.from(pages).forEach(_attr => {
				delObj(_attr);
			});
		else delObj(pages.toString());
	}
}
