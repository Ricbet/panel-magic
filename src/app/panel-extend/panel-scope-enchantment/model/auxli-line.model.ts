/**
 * 辅助线数据模型
 */
export class AuxliLineModel {
    // 所有竖线数值
    public vLineList: Array<number> = [];
    // 所有横线数值
    public hLineList: Array<number> = [];
    // 竖线中线
    public vcLineList: Array<number> = [];
    // 横线中线
    public hcLineList: Array<number> = [];

    constructor() {}

    /**
     * 执行去重操作
     */
    public handleSetData(): void {
        this.vLineList = Array.from(new Set(this.vLineList));
        this.hLineList = Array.from(new Set(this.hLineList));
        this.vcLineList = Array.from(new Set(this.vcLineList));
        this.hcLineList = Array.from(new Set(this.hcLineList));
    }
}
