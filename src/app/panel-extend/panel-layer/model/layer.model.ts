import { PanelWidgetModel } from "../../panel-widget/model";

/**
 * 图层列表数据模型
 */
export class LayerModel {
    // widget组件数据
    public widget: PanelWidgetModel = null;

    // 是否hover
    public isHover: boolean = false;
    // 是否选中
    public isActive: boolean = false;

    // 是否显示下拉标示，只有在组合组件才有
    public isDropDown: boolean = false;

    // 组合组件的content内容widget组件列表,指被包含的组件
    public combinationWidgetList: Array<LayerModel> = [];

    constructor(widget: PanelWidgetModel) {
        this.widget = widget;
    }
}
