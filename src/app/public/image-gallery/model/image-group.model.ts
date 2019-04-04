// 图片分组数据模型
export class ImageGroupModel {
	public id: number = 0;
	public name: string = "";

	// 该分组下的图片总数
	public total: number = 0;

	// 是否允许删除
	public isAllowDel: boolean = false;

	// 是否允许编辑
	public isAllowEdit: boolean = false;

	// 是否进入编辑模式
	public isEnterEdit: boolean = false;

	// 进入编辑模式之前固定的名称
	public fixedName: string = "";

	constructor(data?: Partial<ImageGroupModel>) {
		this.setData(data);
	}

	public setData(data: Partial<ImageGroupModel>): void {
		if (!data) return;

		if ((<Object>data).hasOwnProperty("id")) this.id = data.id;
		if ((<Object>data).hasOwnProperty("name")) this.name = data.name;
		if ((<Object>data).hasOwnProperty("total")) this.total = data.total;
		if ((<Object>data).hasOwnProperty("isAllowDel")) this.isAllowDel = data.isAllowDel;
		if ((<Object>data).hasOwnProperty("isAllowEdit")) this.isAllowEdit = data.isAllowEdit;
		if ((<Object>data).hasOwnProperty("isEnterEdit")) this.isEnterEdit = data.isEnterEdit;
		if ((<Object>data).hasOwnProperty("fixedName")) this.fixedName = data.fixedName;
	}
}
