import { Injectable } from "@angular/core";
import { ImageGroupModel } from "../model";
import { BehaviorSubject, Observable, of } from "rxjs";

@Injectable({
	providedIn: "root"
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
		// return this.hsFileService.getFileGroupList().pipe(
		// 	map(res => {
		// 		if (res.status === 1) {
		// 			const _data = res.data;
		// 			const _excess = get(_data, 'excess') || { all: 0, ungrouped: 0 };
		// 			const _data_list = get(_data, 'list') || [];
		// 			let _result: ImageGroupModel[] = [];
		// 			// 先创建全部图片这个分组,并默认选中这个全部图片
		// 			const _all_picture_group = new ImageGroupModel(<ImageGroupModel>{
		// 				id: null,
		// 				name: '全部图片',
		// 				total: _excess.all
		// 			});
		// 			this.pictureGroupListMap.set(_all_picture_group.id, _all_picture_group)
		// 			_result.push(_all_picture_group)
		// 			// 再创建未分组;
		// 			const _none_group = new ImageGroupModel(<ImageGroupModel>{
		// 				id: 0,
		// 				name: '未分组的',
		// 				total: _excess.ungrouped
		// 			})
		// 			this.pictureGroupListMap.set(_e_group)
		// 			_result.push(_none_group)
		// 			// 最后才是自己创建的分组列表
		// 			_data_list.forEach(_e => {
		// 				const _group_model = new ImageGroupModel(<ImageGroupModel>{
		// 					id: get(_e, 'id'),
		// 					name: get(_e, 'name'),
		// 					total: get(_e, 'count'),
		// 					fixedName: get(_e, 'name'),
		// 					isAllowDel: true,
		// 					isAllowEdit: true
		// 				})
		// 				this.pictureGroupListMap.set(_group_model.id, _group_model)
		// 				_result.push(_group_model)
		// 			});
		// 			return _result
		// 		}else {
		// 			return []
		// 		}
		// 	})
		// )
	}

	/**
	 * 创建图片分组
	 */
	public createPictureGroup(): Observable<boolean> {
		return of(false);
		// return this.hsFileService.postFileGroupCreate({
		// 	name: '新分组'
		// }).pipe(
		// 	map(res=>{
		// 		if( res.status === 1 ) {
		// 			return tru		}else {
		// 			return false
		// 		}
		// 	})
		// )
	}

	/**
	 * 修改分组名称
	 */
	public editPictureGroup(): Observable<boolean> {
		return of(false);
		// return this.hsFileService.postFileGroupSave({
		// 	id: id,
		// 	name: name
		// }).pipe(
		// 	map(res=>{
		// 		if( res.status === 1 ) {
		// 			return true
		// 		}else {
		// 			return false
		// 		}
		// 	})
		// )
	}

	/**
	 * 删除分组
	 */
	public delPictureGroup(): Observable<boolean> {
		return of(false);
		// return this.hsFileService.postFileGroupDel({
		// 	id: id
		// }).pipe(
		// 	map(res=>{
		// 		if( res.status === 1 ) {
		// 			return true
		// 		}else {
		// 			this.nzMessageService.error(res.message);
		// 			return false
		// 		}
		// 	})
		// )
	}
}
