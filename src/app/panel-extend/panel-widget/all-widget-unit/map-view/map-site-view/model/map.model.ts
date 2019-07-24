interface markersable {
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
    public markers: Array<markersable>;

    constructor(data: any = {}) {
        this.initData();
        this.setData(data);
    }

    public setData(data: any): void {
        if (data && Object.keys(data).length > 0) {
            this.text = data["text"];
            this.address = data["address"];
            this.coordinates = data["coordinates"];
            this.height = data["height"];
            this.markers = data["markers"];
        }
    }

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
                desc: this.text,
            },
        ];
    }

    public handleMarkers(): void {
        this.markers = [
            {
                latitude: this.coordinates[1],
                longitude: this.coordinates[0],
                name: this.address,
                desc: this.text,
            },
        ];
    }
}
