/**
 * 图片列表里的每一个图片数据的数据模型
 */
export class ImageItemModel {
    // 图片地址
    public imgSrc: string;
    // 标题
    public title: string;
    // 点击图片的时候要跳转的链接
    public link: string;
    // 图片间隙
    public crevice: number;
    // 图片的原始宽度
    public width: number;
    // 图片的原始高度
    public height: number;
    // 显示在容器里的宽度
    public containerWidth: number;
    // 显示在容器里的高度
    public containerHeight: number;
    // 点击事件的头
    public eventHandler: string;
    // 点击事件的链接
    public eventParams: any;

    constructor(data: any = {}) {
        this.initData();
        this.setData(data);
    }

    public initData(): void {
        this.imgSrc = "";
        this.link = "";
        this.title = "";
        this.crevice = 0;
        this.width = 0;
        this.height = 0;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.eventHandler = "";
        this.eventParams = null;
    }

    public setData(obj: any): void {
        if (obj && Object.keys(obj).length > 0) {
            if (obj["imgSrc"]) this.imgSrc = obj["imgSrc"];
            if (obj["link"]) this.link = obj["link"];
            if (obj["title"]) this.title = obj["title"];
            if (obj["crevice"]) this.crevice = obj["crevice"];
            if (obj["width"]) this.width = obj["width"];
            if (obj["height"]) this.height = obj["height"];
            if (obj["containerWidth"]) this.containerWidth = obj["containerWidth"];
            if (obj["containerHeight"]) this.containerHeight = obj["containerHeight"];
            if (obj["eventHandler"]) this.eventHandler = obj["eventHandler"];
            if (obj["eventParams"]) this.eventParams = obj["eventParams"];
        }
    }

    public handleContainerWidth(_height: number): void {
        this.containerWidth = (this.width * _height) / this.height;
    }

    public handleContainerHeight(_height: number): void {
        this.containerHeight = (this.width * _height) / this.width;
    }
}
