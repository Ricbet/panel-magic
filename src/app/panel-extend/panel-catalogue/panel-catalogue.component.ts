import { Component, OnInit } from "@angular/core";

import { NzNotificationService, NzModalService, NzMessageService } from "ng-zorro-antd";
import { cloneDeep } from "lodash";

import { PanelCatalogueService } from "./panel-catalogue.service";
import { AppDataService } from "../../appdata/appdata.service";
import { CataDataModel, PagesModel, AppDataObjectModel, AppDataModel } from "../../appdata";
import { PanelExtendService } from "../panel-extend.service";
import { TabBarViewService } from "../panel-widget/all-widget-unit/tab-bar-view/tab-bar-view.service";
import { PanelSeniorVesselEditService } from "../panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { NewPageModel, NewGroupModel } from "./model";

@Component({
	selector: "app-panel-catalogue",
	templateUrl: "./panel-catalogue.component.html",
	styleUrls: ["./panel-catalogue.component.scss"]
})
export class PanelCatalogueComponent implements OnInit {
	// 是否显示添加新分组的输入框
	public isNewGroup: boolean = false;

	// 复制出来的新的页面路由
	public copyNewPageRouter: string = "";

	// 是否进入了编辑动态容器模式
	public get isEnterEditVesselCondition(): boolean {
		return this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value;
	}

	public get newPageModel(): NewPageModel {
		return this.panelCatalogueService.newPageModel;
	}

	public get newGroupModel(): NewGroupModel {
		return this.panelCatalogueService.newGroupModel;
	}

	public get appDataModel(): AppDataModel {
		return this.appDataService.appDataModel;
	}

	public get currentPageData(): PagesModel {
		return this.appDataService.currentPageData$.value;
	}

	constructor(
		private readonly panelCatalogueService: PanelCatalogueService,
		private readonly appDataService: AppDataService,
		private readonly panelExtendService: PanelExtendService,
		private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
		private readonly tabBarViewService: TabBarViewService,
		private readonly nzMessageService: NzMessageService,
		private readonly nzModalService: NzModalService,
		private readonly nzNotificationService: NzNotificationService
	) {}

	// 首页router
	public get homeRouter(): string {
		return this.appDataService.appDataModel.app_config.homePageRouter;
	}

	ngOnInit() {}

	OnDestroy() {}

	/**
	 * 选中某一个页面的回调
	 * 切换之前重新计算所有组件的位置
	 */
	public acceptCheckedPage(page: PagesModel): void {
		if (this.appDataService.currentAppDataForinPageData) {
			this.appDataService.currentAppDataForinPageData.eles = this.panelExtendService.handleSaveWidgetToOrientationModelData();
		}
		if (page.router != this.appDataService.currentPageData$.value.router) {
			this.appDataService.setCurrentPageData(page);
		}
	}

	/**
	 * 接收删除按钮的点击事件
	 * 如果页面只剩下一个页面则不允许删除
	 */
	public acceptDeleteOperate(page: CataDataModel, index: number, event: MouseEvent): void {
		event.stopPropagation();
		const cataData = this.appDataService.appDataModel.cata_data;
		if (cataData.length == 1 && cataData[0].pages.length == 1) {
			this.nzMessageService.error("请至少保留一个页面");
		} else {
			this.nzModalService.confirm({
				nzTitle: `是否确认删除页面 <span class="colorff7700">${page.pages[index].name}</span> ?`,
				nzContent: "删除后将取消所有链接到该页面的点击事件",
				nzOkText: "确认",
				nzOkType: "danger",
				nzOnOk: () => {
					this.handleDelPage(page.pages, index);
					page.delPage(index);
				},
				nzCancelText: "取消"
			});
		}
	}

	/**
	 * 接收删除分组的点击事件
	 * 如果只剩一个分组则不允许删除
	 */
	public acceptDeleteGroup(group: CataDataModel, index: number, event: MouseEvent): void {
		event.stopPropagation();
		const cataData = this.appDataService.appDataModel.cata_data;
		if (cataData.length == 1) {
			this.nzMessageService.error("请至少保留一个分组");
		} else {
			this.nzModalService.confirm({
				nzTitle: `是否确认删除分组 <span class="colorff7700">${group.group}</span> ?`,
				nzContent: "删除后将一并删除该分组下所有页面以及所有链接到对应页面的点击事件",
				nzOkText: "确认",
				nzOkType: "danger",
				nzOnOk: () => {
					this.handleDelGroup(group);
					this.appDataService.appDataModel.delGroup(index);
				},
				nzCancelText: "取消"
			});
		}
	}

	/**
	 * 编辑分组或页面的名称，同时把isEdit改为false
	 * 同时修改app_data里的页面名称
	 */
	public editGroupAndPageName(new_str: string, target: CataDataModel | PagesModel, type: "group" | "page"): void {
		if (type == "group") {
			(<CataDataModel>target).group = new_str;
		} else if (type == "page") {
			(<PagesModel>target).name = new_str;
			const page: AppDataObjectModel = this.appDataService.appDataModel.app_data[(<PagesModel>target).router];
			if (page) {
				page.customfeature.name = new_str;
				page.customfeature.title = new_str;
			}
		}
		target.isEdit = false;
	}

	/**
	 * 如果没有选择分组则不能添加数据
	 * 添加完新的页面之后保存一份到indexDB里面
	 * index表示在指定位置添加新页面，-1表示在末尾添加新数据
	 * 同时当前页面currentPage立即切换到新创建的页面
	 */
	public handleAddNewPage(index: number = -1): void {
		const newPageModel = this.panelCatalogueService.newPageModel;
		if (newPageModel.name == "") {
			this.nzNotificationService.create("error", "错误提示", "请填写页面名称");
		} else if (newPageModel.groupId == 0) {
			this.nzNotificationService.create("error", "错误提示", "请选择分组");
		} else {
			this.copyNewPageRouter = this.appDataService.appDataModel.addNewPage(newPageModel, index);
			this.panelCatalogueService.newPageModel.initData();
		}
	}

	/**
	 * 处理添加新分组，如果没有填写名称则不允许创建新分组
	 */
	public handleAddNewGroup(): void {
		const newGroupModel = this.panelCatalogueService.newGroupModel;
		if (newGroupModel.name == "") {
			this.nzNotificationService.create("error", "错误提示", "请填写分组名称");
		} else {
			this.appDataService.appDataModel.addNewGroup(newGroupModel.name);
			newGroupModel.initData();
		}
	}

	/**
	 * 处理删除分组或页面的情况
	 * 如果是删除页面则把currentPageData设为上一个页面
	 * 如果该分组的页面都删除了，则清空currentPageData
	 * 如果删除了分组则清空currentPageData
	 */

	/**
	 * 删除页面则改变currentPageData
	 */
	public handleDelPage(target: Array<PagesModel>, index: number): void {
		if (Array.isArray(target) && target.length > 0) {
			// 如果删除的是当前的页面才需要切换
			if (target[index].router == this.appDataService.currentPageData$.value.router) {
				const _len = target.length;
				this.appDataService.setCurrentPageData(target[index + 1 >= _len ? 0 : index + 1]);
			}
			// 如果当前被删的页面是主页则替换成别的首页
			if (target[index].router == this.homeRouter) {
				this.appDataService.setAppConfigData(
					"homePageRouter",
					this.appDataService.currentPageData$.value.router
				);
			}
		}
		// 同时处理app_data的对象数据
		this.appDataService.appDataModel.delAppDataPage(target[index].router);
		// 同时清除底部导航的无效事件
		this.clearInvalidEvent();
	}

	/**
	 * 删除分组直接清空选中的当前页面
	 */
	public handleDelGroup(target: CataDataModel): void {
		this.appDataService.emptyCurrentPageData();
		// 同时处理app_data的对象数据
		this.appDataService.appDataModel.delAppDataPage(target.pages.map(_e => _e["router"]));
		this.clearInvalidEvent();
	}

	/**
	 * 默认选中第一个分组
	 */
	public autoChooseNowGroup(): void {
		const cataData = this.appDataService.appDataModel.cata_data;
		if (Array.isArray(cataData) && cataData.length > 0) {
			this.panelCatalogueService.newPageModel.groupId = cataData[0].uniqueId;
		}
	}

	/**
	 * 处理复制页面的函数
	 */
	public handleCopyPageData(page: any, group: any, index: number): void {
		// 首先先在要复制的页面下面新建新页面
		const newName = page.name + " - 副本";
		this.panelCatalogueService.newPageModel.setData({
			name: newName,
			groupId: group.uniqueId
		});
		// 在要复制的页面后面添加新数据
		this.handleAddNewPage(index + 1);
		// 生成完新页面之后把原页面的eles数据复制到新页面
		if (this.appDataService.appDataModel.app_data[this.copyNewPageRouter]) {
			this.appDataService.appDataModel.app_data[this.copyNewPageRouter].eles = cloneDeep(
				this.appDataService.appDataModel.app_data[page.router].eles
			);
		}
		// 然后把旧页面的customfeature信息都给新页面
		this.appDataService.appDataModel.app_data[this.copyNewPageRouter].customfeature = {
			...this.appDataService.appDataModel.app_data[page.router].customfeature
		};
	}

	/**
	 * 检测底部导航组件所有的链接事件是否存在，去除无效的页面链接事件
	 */
	public clearInvalidEvent(): void {
		const pageObj = this.appDataService.appDataModel.app_data;
		const tabbarData = this.tabBarViewService.tabbarWidgetModel;
		if (tabbarData) {
			const navList = tabbarData.autoWidget.content.tabbarModel.navList;
			if (Array.isArray(navList)) {
				navList.forEach(n => {
					if (n.eventHandler && n.eventHandler == "tapNavigateHandler") {
						if (!Object.keys(pageObj).includes(n.eventParams.nav_url)) {
							n.eventHandler = "";
							n.eventParams = null;
						}
					}
				});
			}
		}
	}

	/**
	 * 将该页面设置为主页，同时取消掉其他所有的非主页页面
	 */
	public handleHomePageChange(page: PagesModel, event: MouseEvent): void {
		event.stopPropagation();
		this.appDataService.setAppConfigData("homePageRouter", page.router);
	}
}
