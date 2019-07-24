// 头部标题数据模型
export class NavigationBarModel {
    // 标题字体颜色
    public frontColor: string = "#ffffff";
    // 标题背景颜色
    public bgColor: string = "#000000";

    constructor() {}

    public reset(): void {
        this.frontColor = "#ffffff";
        this.bgColor = "#000000";
    }
}
