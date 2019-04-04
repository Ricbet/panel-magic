import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ImageGroupModel } from "../model";
import { GalleryGroupService } from "./gallery-group.service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";

@Component({
	selector: "app-gallery-group",
	templateUrl: "./gallery-group.component.html",
	styleUrls: ["./gallery-group.component.scss"]
})
export class GalleryGroupComponent implements OnInit {
	// 创建分组的loading效果
	public isCreateGroupLoading: boolean = false;

	@ViewChild("editInputEl", { static: false }) public editInputEl: ElementRef;
	public get pictureGroupList(): ImageGroupModel[] {
		return this.galleryGroupService.pictureGroupList$.value;
	}

	public get currentPictureGroup(): ImageGroupModel {
		return this.galleryGroupService.currentPictureGroup$.value;
	}

	constructor(
		private readonly galleryGroupService: GalleryGroupService,
		private readonly nzMessageService: NzMessageService,
		private readonly nzModalService: NzModalService
	) {}

	ngOnInit() {}

	/**
	 * 选中某一个分组
	 */
	public acceptCheckGroup(data: ImageGroupModel): void {
		this.galleryGroupService.currentPictureGroup$.next(data);
	}

	/**
	 * 双击选中某一个分组
	 */
	public acceptDbClickGroup(data: ImageGroupModel): void {
		if (data.isAllowEdit) {
			data.isEnterEdit = true;
			setTimeout(() => {
				this.editInputEl.nativeElement.focus();
			});
		} else {
			this.nzMessageService.warning("系统默认分组不可编辑");
		}
	}

	/**
	 * 退出编辑模式
	 */
	public popEditGroupAffirm(data: ImageGroupModel): void {
		data.isEnterEdit = false;
		if (data.name.trim() == "") {
			this.nzMessageService.warning("分组名称不能为空");
			data.name = data.fixedName;
		} else if (data.name != data.fixedName) {
			this.galleryGroupService.editPictureGroup().subscribe(b => {
				if (b) {
					this.nzMessageService.success("修改分组名称成功");
					data.fixedName = data.name;
				}
			});
		}
	}

	/**
	 * 创建分组
	 */
	public createGroup(): void {
		this.isCreateGroupLoading = true;
		this.galleryGroupService.createPictureGroup().subscribe(() => {
			this.galleryGroupService.acquirePictureGroupList().subscribe(list => {
				this.isCreateGroupLoading = false;
				this.galleryGroupService.pictureGroupList$.next(list);
			});
		});
	}

	/**
	 * 删除分组
	 */
	public deleteGroup(data: ImageGroupModel): void {
		const _modal = this.nzModalService.confirm({
			nzTitle: `是否确认删除分组 <span class="color-f70">${data.name}</span> ？`,
			// nzContent: '删除后该分组下的图片将会转移到 <span class="color-f70">未分组</span> 里',
			nzOnOk: () => {
				_modal["nzOkLoading"] = true;
				this.galleryGroupService.delPictureGroup().subscribe(b => {
					_modal["nzOkLoading"] = false;
					_modal.close();
					if (b) {
						this.nzMessageService.success("删除分组成功");
						this.galleryGroupService.acquirePictureGroupList().subscribe(list => {
							this.galleryGroupService.pictureGroupList$.next(list);
						});
						if (data.id == this.currentPictureGroup.id) {
							this.galleryGroupService.currentPictureGroup$.next(this.pictureGroupList[0]);
						}
					}
				});
				return false;
			}
		});
	}
}
