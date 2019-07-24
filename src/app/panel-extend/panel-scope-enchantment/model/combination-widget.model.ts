import { PanelWidgetModel } from "../../panel-widget/model";
import { IFourBearingProportion } from "./profile.model";

/**
 * 组合组件的子集组件
 */
export class CombinationWidgetModel {
    /**
     * 表示是隶属于哪个组合组件的
     */
    public combinationRoom: PanelWidgetModel = null;

    public left: number = null;
    public top: number = null;
    public width: number = null;
    public height: number = null;
    public rotate: number = null;

    /**
     * 该属性是用来记录该组件在组合组件里的位置的比例
     * 分别有四个方位上、右、下、左
     */
    public insetProOuterSphereFourProportion: IFourBearingProportion = null;

    constructor(com: PanelWidgetModel = null) {
        this.combinationRoom = com;
    }

    public setData(data: { left: number; top: number; width: number; height: number; rotate: number }): void {
        if (!data) {
            return;
        }

        if ((<Object>data).hasOwnProperty("left")) {
            this.left = data.left;
        }
        if ((<Object>data).hasOwnProperty("top")) {
            this.top = data.top;
        }
        if ((<Object>data).hasOwnProperty("width")) {
            this.width = data.width;
        }
        if ((<Object>data).hasOwnProperty("height")) {
            this.height = data.height;
        }
        if ((<Object>data).hasOwnProperty("rotate")) {
            this.rotate = data.rotate;
        }
    }

    /**
     * 需要展示在对应的组合组件里的样式，不是轮廓样式
     */

    public get styleContent(): { [key: string]: string } {
        return {
            left: this.left + "px",
            top: this.top + "px",
            width: this.width + "px",
            height: this.height + "px",
            transform: `rotate(${this.rotate}deg)`,
        };
    }

    /**
     * 计算该组件在组合组件里的位置比例
     */
    public recordInsetProOuterSphereFourProportion(): void {
        if (this.combinationRoom) {
            this.insetProOuterSphereFourProportion = {
                left: this.left / this.combinationRoom.profileModel.width,
                top: this.top / this.combinationRoom.profileModel.height,
                right: (this.left + this.width) / this.combinationRoom.profileModel.width,
                bottom: (this.top + this.height) / this.combinationRoom.profileModel.height,
            };
        }
    }

    public removeInsetProOuterSphereFourProportion(): void {
        this.insetProOuterSphereFourProportion = null;
    }
}
