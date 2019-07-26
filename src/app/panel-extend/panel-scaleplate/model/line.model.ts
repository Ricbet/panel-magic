export type lineType = "h" | "v";

// 每一条辅助线断的数据模型
export class LineModel {
    // 类型，h表纵向，v表横向
    public type: lineType = "h";
    // 需要显示在canvas面板的距离
    public inCanvasNum: number = 0;
    // 需要显示在样式当中跟随面板移动的距离
    public inPanelNum: number = 0;
    // 是否允许删除
    public isAllowDel: boolean = false;

    constructor(type: lineType) {
        this.type = type;
    }

    // 设置需要显示在Canvas中的距离
    public setInCanvasNum(n: number): void {
        this.inCanvasNum = Math.round(n);
    }

    // 设置需要显示在面板中的距离
    public setInPanelNum(n: number): void {
        this.inPanelNum = Math.round(n);
    }
}
