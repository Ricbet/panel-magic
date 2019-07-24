import { Injectable } from "@angular/core";
import {
    ScopeEnchantmentModel,
    AuxliLineModel,
    PanelScopeTextEditorModel,
    ProfileModel,
    OuterSphereHasAuxlModel,
} from "./model";
import { PanelWidgetModel } from "../panel-widget/model";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class PanelScopeEnchantmentService {
    // 是否开启辅助线计算
    public isOpenAltCalc$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    // 订阅鼠标移动偏移量回调
    public launchMouseIncrement$: Subject<DraggablePort> = new Subject<DraggablePort>();
    // 订阅组件的右键事件
    public launchContextmenu$: BehaviorSubject<MouseEvent> = new BehaviorSubject<MouseEvent>(null);

    public scopeEnchantmentModel: ScopeEnchantmentModel = new ScopeEnchantmentModel();
    // 文字编辑器模式数据模型
    public panelScopeTextEditorModel$: BehaviorSubject<PanelScopeTextEditorModel> = new BehaviorSubject<
        PanelScopeTextEditorModel
    >(null);
    // 存储所有辅助线的数据模型
    public auxliLineModel$: BehaviorSubject<AuxliLineModel> = new BehaviorSubject<AuxliLineModel>(new AuxliLineModel());
    // 存储粘贴板的组件内容
    public clipboardList$: BehaviorSubject<Array<PanelWidgetModel>> = new BehaviorSubject([]);

    constructor() {}

    /**
     * 根据传入的widget参数设置鼠标移入的轮廓绘制
     */
    public handleTemporaryProfile(widget: PanelWidgetModel, type: "enter" | "out"): void {
        if (type == "enter") {
            const _pro = widget.profileModel;
            this.scopeEnchantmentModel.profileTemporary$.next(_pro);
        } else if (type == "out") {
            this.scopeEnchantmentModel.resetProfileTemporary$();
        }
    }

    /**
     * 只选中某一个组件传入到列表outerSphereInsetWidgetList$列表中
     */
    public onlyOuterSphereInsetWidget(widget: PanelWidgetModel): void {
        this.scopeEnchantmentModel.resetOuterSphereInsetWidgetList$();
        this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next([widget]);
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 根据传入的outerSphereInsetWidgetList$数组进行处理选中状态
     */
    public pushOuterSphereInsetWidget(widgets: Array<PanelWidgetModel>): void {
        this.scopeEnchantmentModel.resetOuterSphereInsetWidgetList$();
        this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(widgets);
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 如果存在outerSphereInsetWidgetList$列表中就去除否则就增加
     */
    public toggleOuterSphereInsetWidget(widget: PanelWidgetModel): void {
        const _outer_width_list = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        const _arr_uniqueid = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.map(_e => _e.uniqueId);
        if (!_arr_uniqueid.includes(widget.uniqueId)) {
            _outer_width_list.push(widget);
            this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(_outer_width_list);
        } else {
            const _filter = _outer_width_list.filter(_e => _e.uniqueId != widget.uniqueId);
            widget.profileModel.isCheck = false;
            this.scopeEnchantmentModel.outerSphereInsetWidgetList$.next(_filter);
        }
        this.handleFromWidgetListToProfileOuterSphere();
    }

    /**
     * 处理由outerSphereInsetWidgetList$列表内的组件变化来描绘主轮廓
     * isLaunch参数表示是否发送数据源
     */
    public handleFromWidgetListToProfileOuterSphere(
        arg: {
            isLaunch?: boolean;
        } = {
            isLaunch: true,
        }
    ): void {
        const _ori_arr = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value.map(_e => {
            _e.profileModel.isCheck = true;
            // 根据当前位置重新设置mousecoord
            _e.profileModel.setMouseCoord([_e.profileModel.left, _e.profileModel.top]);
            return _e.profileModel;
        });
        if (_ori_arr.length > 0) {
            // 计算出最小的left,最小的top，最大的width和height
            const _obj = this.calcProfileOuterSphereInfo();
            // 如果insetWidget数量大于一个则不允许开启旋转,且旋转角度重置
            if (_ori_arr.length == 1) {
                _obj.isRotate = true;
                _obj.rotate = _ori_arr[0].rotate;
            } else {
                _obj.isRotate = false;
            }
            // 赋值
            this.scopeEnchantmentModel.launchProfileOuterSphere(_obj, arg.isLaunch);
            // 同时生成八个方位坐标点，如果被选组件大于一个则不生成
            this.scopeEnchantmentModel.handleCreateErightCornerPin();
        }
    }

    /**
     * 从被选组件当中计算出主轮廓的大小和位置
     */
    public calcProfileOuterSphereInfo(): OuterSphereHasAuxlModel {
        const _inset_widget = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        let _obj = new OuterSphereHasAuxlModel();
        _obj.setData({ left: Infinity, top: Infinity, width: -Infinity, height: -Infinity, rotate: 0 });
        let _max_width = null;
        let _max_height = null;
        let _min_width_empty = Infinity;
        let _min_height_empty = Infinity;
        _inset_widget.forEach(_e => {
            let _offset_coord = { left: 0, top: 0 };
            if (_e.profileModel.rotate != 0 && _inset_widget.length > 1)
                _offset_coord = this.handleOuterSphereRotateOffsetCoord(_e.profileModel);
            _obj.left = Math.min(_obj.left, _e.profileModel.left + _offset_coord.left);
            _obj.top = Math.min(_obj.top, _e.profileModel.top + _offset_coord.top);
            _max_width = Math.max(_max_width, _e.profileModel.left + _e.profileModel.width + _offset_coord.left * -1);
            _max_height = Math.max(_max_height, _e.profileModel.top + _e.profileModel.height + _offset_coord.top * -1);
            _min_width_empty =
                _e.profileModel.left + _e.profileModel.width < 0
                    ? Math.min(_min_width_empty, Math.abs(_e.profileModel.left) - _e.profileModel.width)
                    : 0;
            _min_height_empty =
                _e.profileModel.top + _e.profileModel.height < 0
                    ? Math.min(_min_height_empty, Math.abs(_e.profileModel.top) - _e.profileModel.height)
                    : 0;
        });
        _obj.width = Math.abs(_max_width - _obj.left) - _min_width_empty;
        _obj.height = Math.abs(_max_height - _obj.top) - _min_height_empty;
        _obj.setMouseCoord([_obj.left, _obj.top]);
        return _obj;
    }

    /**
     * 根据角度计算offsetcoord坐标的增量，用于辅助线计算
     * type 表示计算并返回左上、右上、左下还是右下的坐标点
     */
    public handleOuterSphereRotateOffsetCoord(
        arg: ProfileModel,
        type: "lt" | "rt" | "lb" | "rb" = "lt"
    ): { left: number; top: number } {
        const _four_coord = this.conversionRotateToOffsetLeftTop({
            width: arg.width,
            height: arg.height,
            rotate: arg.rotate,
        });
        if (_four_coord) {
            let _min = Infinity;
            let _max = -Infinity;
            for (let e in _four_coord) {
                _min = Math.min(_min, _four_coord[e][0]);
                _max = Math.max(_max, _four_coord[e][1]);
            }
            let _type_obj = {
                lt: [_min, _max],
                rt: [-_min, _max],
                lb: [_min, -_max],
                rb: [-_min, -_max],
            };
            if (_type_obj[type]) {
                return {
                    left: Math.round(arg.width / 2 + _type_obj[type][0]),
                    top: Math.round(arg.height / 2 - _type_obj[type][1]),
                };
            }
        }
        return;
    }

    /**
     * 计算辅助线的显示与否情况
     * 分为6种情况
     * 辅助线只会显示在主轮廓的4条边以及2条中线
     * 遍历时先寻找离四条边最近的4个数值
     * 参数target表示除了用于计算最外主轮廓以外还能计算其他的辅助线情况，（例如左侧的组件库里的待创建的组件）
     */
    public handleAuxlineCalculate(
        target: OuterSphereHasAuxlModel = this.scopeEnchantmentModel.valueProfileOuterSphere
    ): void {
        const _outer_sphere = target;
        const _offset_amount = _outer_sphere.offsetAmount;
        const _aux = this.auxliLineModel$.value;
        const _mouse_coord = _outer_sphere.mouseCoord;

        // 差量达到多少范围内开始对齐
        const _diff_num: number = 4;

        _outer_sphere.resetAuxl();
        if (_mouse_coord) {
            for (let i: number = 0, l: number = _aux.vLineList.length; i < l; i++) {
                if (Math.abs(_aux.vLineList[i] - _mouse_coord[0] + _offset_amount.left * -1) <= _diff_num) {
                    _outer_sphere.left = _aux.vLineList[i] + _offset_amount.left * -1;
                    _outer_sphere.lLine = true;
                }
                if (
                    Math.abs(_aux.vLineList[i] - (_mouse_coord[0] + _outer_sphere.width) + _offset_amount.left) <=
                    _diff_num
                ) {
                    _outer_sphere.left = _aux.vLineList[i] - _outer_sphere.width + _offset_amount.left;
                    _outer_sphere.rLine = true;
                }
                if (_outer_sphere.lLine == true && _outer_sphere.rLine == true) break;
            }
            for (let i: number = 0, l: number = _aux.hLineList.length; i < l; i++) {
                if (Math.abs(_aux.hLineList[i] - _mouse_coord[1] + _offset_amount.top * -1) <= _diff_num) {
                    _outer_sphere.top = _aux.hLineList[i] + _offset_amount.top * -1;
                    _outer_sphere.tLine = true;
                }
                if (
                    Math.abs(_aux.hLineList[i] - (_mouse_coord[1] + _outer_sphere.height) + _offset_amount.top) <=
                    _diff_num
                ) {
                    _outer_sphere.top = _aux.hLineList[i] - _outer_sphere.height + _offset_amount.top;
                    _outer_sphere.bLine = true;
                }
                if (_outer_sphere.tLine == true && _outer_sphere.bLine == true) break;
            }
            for (let i: number = 0, l: number = _aux.hcLineList.length; i < l; i++) {
                if (Math.abs(_aux.hcLineList[i] - (_mouse_coord[1] + _outer_sphere.height / 2)) <= _diff_num) {
                    _outer_sphere.top = _aux.hcLineList[i] - _outer_sphere.height / 2;
                    _outer_sphere.hcLine = true;
                    break;
                }
            }
            for (let i: number = 0, l: number = _aux.vcLineList.length; i < l; i++) {
                if (Math.abs(_aux.vcLineList[i] - (_mouse_coord[0] + _outer_sphere.width / 2)) <= _diff_num) {
                    _outer_sphere.left = _aux.vcLineList[i] - _outer_sphere.width / 2;
                    _outer_sphere.vcLine = true;
                    break;
                }
            }
        }
    }

    /**
     * 根据传入的角度和转化为横向的偏移量和纵向的偏移量，主要是用来计算旋转到一定角度之后辅助线的计算基线位置偏移
     * 以组件的中心点为坐标圆点，返回四个角的坐标，分别是左上角、右上角、左下角、右下角
     * 转化角公式为
     * _x = x * Math.cos(r) + y * Math.sin(r)
     * _y = y * Math.cos(r) - x * Math.sin(r)
     */
    public conversionRotateToOffsetLeftTop(arg: {
        width: number;
        height: number;
        rotate: number;
    }): {
        lt: number[];
        rt: number[];
        lb: number[];
        rb: number[];
    } {
        // 转化角度使其成0～360的范围
        arg.rotate = this.conversionRotateOneCircle(arg.rotate);
        let _result = {
            lt: [(arg.width / 2) * -1, arg.height / 2],
            rt: [arg.width / 2, arg.height / 2],
            lb: [(arg.width / 2) * -1, (arg.height / 2) * -1],
            rb: [arg.width / 2, (arg.height / 2) * -1],
        };
        let _conv_rotate = this.conversionRotateToMathDegree(arg.rotate);
        let _calc_x = (_x, _y) => <any>(_x * Math.cos(_conv_rotate) + _y * Math.sin(_conv_rotate)) * 1;
        let _calc_y = (_x, _y) => <any>(_y * Math.cos(_conv_rotate) - _x * Math.sin(_conv_rotate)) * 1;
        _result.lt = [_calc_x(_result.lt[0], _result.lt[1]), _calc_y(_result.lt[0], _result.lt[1])];
        _result.rt = [_calc_x(_result.rt[0], _result.rt[1]), _calc_y(_result.rt[0], _result.rt[1])];
        _result.lb = [_result.rt[0] * -1, _result.rt[1] * -1];
        _result.rb = [_result.lt[0] * -1, _result.lt[1] * -1];
        return _result;
    }

    /**
     * 根据传入的坐标转化为度数，度数范围在0～360
     */
    public conversionTwoCoordToRotate(coord: [number, number]): number {
        if (!Array.isArray(coord) || coord.length != 2) return 0;

        const _map: Map<boolean, number> = new Map();
        _map.set(coord[0] >= 0 && coord[1] > 0, this.conversionRotateFromRadian(coord[0] / coord[1]));
        _map.set(coord[0] > 0 && coord[1] <= 0, this.conversionRotateFromRadian((coord[1] / coord[0]) * -1) + 90);
        _map.set(coord[0] <= 0 && coord[1] < 0, this.conversionRotateFromRadian(coord[0] / coord[1]) + 180);
        _map.set(coord[0] < 0 && coord[1] >= 0, this.conversionRotateFromRadian((coord[1] / coord[0]) * -1) + 270);

        return ~~_map.get(true);
    }

    /**
     * 根据传入的角度转化为0～360度的范围
     */
    public conversionRotateOneCircle(rotate: number): number {
        return rotate <= 0
            ? rotate + Math.ceil(Math.abs(rotate / 360)) * 360
            : rotate - Math.floor(Math.abs(rotate / 360)) * 360;
    }

    /**
     * 根据角度计算出在哪个象限里
     */
    public conversionRotateToQuadrant(rotate: number): number {
        rotate = this.conversionRotateOneCircle(rotate);

        const _map: Map<boolean, 1 | 2 | 3 | 4> = new Map();
        _map.set(rotate >= 0 && rotate < 90, 1);
        _map.set(rotate >= 270 && rotate < 360, 2);
        _map.set(rotate >= 180 && rotate < 270, 3);
        _map.set(rotate >= 90 && rotate < 180, 4);

        return ~~_map.get(true);
    }

    /**
     * 根据坐标和角度来计算该坐标旋转到该角度之后的差值增量
     */
    public conversionRotateNewCoordinates(coord: [number, number], rotate: number): { left: number; top: number } {
        const _quard_position = { 1: "rt", 2: "lt", 3: "lb", 4: "rb" };
        const _offset_coord = this.conversionRotateToOffsetLeftTop(<ProfileModel>{
            width: Math.abs(coord[0] * 2),
            height: Math.abs(coord[1] * 2),
            rotate: rotate,
        });
        const _offset_coord_number = _offset_coord[_quard_position[this.conversionCoordinatesToQuadrant(coord)]];
        if (_offset_coord_number) {
            return {
                left: _offset_coord_number[0] - coord[0],
                top: coord[1] - _offset_coord_number[1],
            };
        }
        return;
    }

    // rotate角度转化为数学里要用到的角度
    public conversionRotateToMathDegree = (rotate: number): number => (rotate * Math.PI) / 180;

    // 转弧度为度数
    public conversionRotateFromRadian = (x: number): number => Math.floor((Math.atan(x) * 180) / Math.PI);

    // 根据坐标计算出在哪个象限里
    public conversionCoordinatesToQuadrant = (coord: [number, number]): number =>
        this.conversionRotateToQuadrant(this.conversionTwoCoordToRotate(coord));

    // 根据传入的数值和角度计算对应的sin值
    public calcNumSin = (num: number, rotate: number): number =>
        Math.sin(this.conversionRotateToMathDegree(rotate)) * num;

    // 根据传入的数值和角度计算对应的cos值
    public calcNumCos = (num: number, rotate: number): number =>
        Math.cos(this.conversionRotateToMathDegree(rotate)) * num;
}
