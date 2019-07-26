import { Subject } from "rxjs";

export interface ILocation {
    width: number;
    height: number;
    left: number;
    top: number;
}

/**
 *	可选区域内的矩形片段、在该区域内的所有组件呈被选状态
 * 	类比ps里的拖拽选择
 */
export class SelectionRectModel {
    // 发射坐标点
    public launchRectData: Subject<ILocation> = new Subject<ILocation>();

    // 初始坐标点
    public startCoord: [number, number] = [0, 0];
    // 终点坐标点
    public endCoord: [number, number] = [0, 0];

    public width: number = 0;
    public height: number = 0;
    public top: number = 0;
    public left: number = 0;

    constructor() {}

    /**
     * 执行发射数据源
     */
    public nextLaunchRectData(): void {
        this.launchRectData.next({
            width: this.width,
            height: this.height,
            left: this.left,
            top: this.top,
        });
    }

    /**
     * 根据传入的终点坐标点计算矩形的宽高和位置
     */
    public handleCoordShape(coord: [number, number]): void {
        const diffX = coord[0] - this.startCoord[0];
        const diffY = coord[1] - this.startCoord[1];
        this.width = Math.abs(diffX);
        this.height = Math.abs(diffY);
        this.top = diffY > 0 ? this.startCoord[1] : coord[1];
        this.left = diffX > 0 ? this.startCoord[0] : coord[0];
    }

    public get styleContent(): { [key: string]: string } {
        return {
            width: `${this.width}px`,
            height: `${this.height}px`,
            top: `${this.top}px`,
            left: `${this.left}px`,
            "z-index": "100",
        };
    }

    public reset(): void {
        this.startCoord = [0, 0];
        this.endCoord = [0, 0];
        this.width = 0;
        this.height = 0;
        this.left = 0;
        this.top = 0;
    }
}
