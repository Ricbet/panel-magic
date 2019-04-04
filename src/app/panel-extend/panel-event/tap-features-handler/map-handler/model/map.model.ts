export interface IMarkersable {
	latitude: number;
	longitude: number;
	name: string;
	desc: string;
}

export class MapModel {
	// 需要显示的文字
	public text: string;
	// 定位到的地址
	public address: string;
	// 定位到的坐标系
	public coordinates: Array<number>;
	// 高度
	public height: number;
	// markers
	public markers: Array<IMarkersable>;

	constructor(data?: MapModel) {
		this.initData();
		if (data) this.setData(data);
	}

	/**
	 * 赋值数据
	 */
	public setData(data: MapModel): void {
		if ((<Object>data).hasOwnProperty("text")) this.text = data.text;
		if ((<Object>data).hasOwnProperty("address")) this.address = data.address;
		if ((<Object>data).hasOwnProperty("coordinates")) this.coordinates = data.coordinates;
		if ((<Object>data).hasOwnProperty("height")) this.height = data.height;
		if ((<Object>data).hasOwnProperty("markers")) this.markers = data.markers;
	}

	/**
	 * 初始化数据
	 */
	public initData(): void {
		this.text = "广东省深圳市";
		this.address = "";
		this.coordinates = [116.397428, 39.90923]; // 默认在北京
		this.height = 200;
		this.markers = [
			{
				latitude: this.coordinates[1],
				longitude: this.coordinates[0],
				name: this.address,
				desc: this.text
			}
		];
	}

	/**
	 * 处理markers
	 */
	public handleMarkers(): void {
		this.markers = [
			{
				latitude: this.coordinates[1],
				longitude: this.coordinates[0],
				name: this.address,
				desc: this.text
			}
		];
	}
}
