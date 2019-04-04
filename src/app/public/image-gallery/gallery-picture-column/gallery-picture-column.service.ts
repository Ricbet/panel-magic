import { Injectable } from "@angular/core";
import { HsFileService } from "app/service";
import { Observable, BehaviorSubject, of } from "rxjs";
import { ImageModel } from "../model/image.model";
import { ImageGalleryService } from "../image-gallery.service";
import { NzMessageService } from "ng-zorro-antd";

@Injectable({
	providedIn: "root"
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
			const _current_check_image_list = this.imageGalleryService.currentCheckImageList$.value;
			if (this.imageGalleryService.selectType$.value == "radio") {
				this.imageGalleryService.checkImageMap.forEach(_e => {
					_e.isActive = false;
				});
				data.isActive = true;
				this.imageGalleryService.checkImageMap.set(data.id, data);
				this.imageGalleryService.currentCheckImageList$.next([data]);
			} else if (this.imageGalleryService.selectType$.value == "checkbox") {
				this.imageGalleryService.toggleCheckCurrentImageList(data);
				// 同时判断是否超出最大数量，是的话则自动过滤旧的数据
				const _max_count = this.imageGalleryService.maxCount;
				if (_current_check_image_list.length > _max_count) {
					this.nzMessageService.warning(`图片选择已超过${_max_count}张，将自动过滤之前的已选图片`);
					const _unshift_image = _current_check_image_list[0];
					this.imageGalleryService.toggleCheckCurrentImageList(_unshift_image);
				}
			}
		}
	}

	/**
	 * 验证全选状态
	 */
	public handleCheckAllStatus(): void {
		const _check_image = this.currentPictureList$.value;
		this.isCheckAll = false;
		if (!_check_image.some(_e => _e.isActive == false)) {
			this.isCheckAll = true;
		}
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
		const _params = { rows: 20, page: this.page };
		if (groupId != null || groupId != undefined) _params["group_id"] = groupId;
		this.isNextPage = false;
		this.isVisibleLoading = true;
		return of([]);
		// return this.hsFileService.getFileList(_params).pipe(
		// 	map(res=>{
		// 		this.isVisibleLoading = false
		// 		if( res.status === 1 ) {
		// 			let _arr: ImageModel[] = [];
		// 			const _total = res.data.total;
		// 			const _data = res.data.data;
		// 			if( Array.isArray(_data) ) {
		// 				_data.forEach(_e=>{
		// 					const _id = get(_e,'id') * 1;
		// 					let _image = new ImageModel(<ImageModel>{
		// 						groupId: get(_e, 'group_id'),
		// 						id: _id,
		// 						name: get(_e, 'filename'),
		// 						fixedName: get(_e, 'filename'),
		// 						url: get(_e, 'filepath')
		// 					});
		// 					// 同时判断该图片是否存在于已选的图片列表中，是的话从里面取数据
		// 					if (this.checkImageMap.has(_id) ) {
		// 						_image = this.checkImageMap.get(_id)
		// 					}
		// 					_arr.push(_image)
		// 				});
		// 			}
		// 			// 计算是否有下一页
		// 			if (this.page * 20 < _total) this.isNextPage = true;
		// 			return _arr
		// 		}else {
		// 			return [];
		// 		}
		// 	})
		// )
	}

	/**
	 * 修改图片名称
	 */
	public editImageName(id: number, name: string): Observable<boolean> {
		return of(false);
		// return this.hsFileService.postFileEditName({
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
	 * 删除图片
	 */
	public delImage(ids: number[]): Observable<boolean> {
		return of(false);
		// return	this.hsFileService.postFileDel({
		// 	id: ids
		// }).pipe(
		// 	map(res=>{
		// 		if (res.status === 1) {
		// 			return true
		// 		} else {
		// 			return false
		// 		}
		// 	})
		// )
	}

	/**
	 * 移动图片分组
	 * ids是图片id列表
	 */
	public moveGroupFormImage(ids: number[], groupId: number): Observable<boolean> {
		return of(false);
		// return this.hsFileService.postFileGroupMove({
		// 	ids: ids,
		// 	group_id: groupId
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
}
