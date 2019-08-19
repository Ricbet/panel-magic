import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";

/**
 * x滚动条和y滚动条的数据模型
 */
export class TrackModel {
    public x: { width: number; left: number } = {
        width: 33.33,
        left: 33.33,
    };
    public y: { height: number; top: number } = {
        height: 33.33,
        top: 33.33,
    };

    constructor() {}

    public get xScrollBar(): { width: string; left: string } {
        return { width: `${this.x.width}%`, left: `${this.x.left}%` };
    }

    public get yScrollBar(): { height: string; top: string } {
        return { height: `${this.y.height}%`, top: `${this.y.top}%` };
    }

    /**
     * 接收y轴的滚动条移动
     */
    public acceptTrackMoveY(data: DraggablePort): void {
        const top = data.top;
        if (top > 0 && top + this.y.height < 100) this.y.top = top;
    }

    /**
     * 接收x轴的滚动条移动
     */
    public acceptTrackMoveX(data: DraggablePort): void {
        const left = data.left;
        if (left > 0 && left + this.x.width < 100) this.x.left = left;
    }

    /**
     * 重置
     */
    public reset(): void {
        this.x = { width: 33.33, left: 33.33 };
        this.y = { height: 33.33, top: 33.33 };
    }
}
