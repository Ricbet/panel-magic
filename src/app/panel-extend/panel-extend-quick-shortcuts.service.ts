import { NgZone, Injectable } from "@angular/core";
import { PanelScopeEnchantmentService } from "./panel-scope-enchantment/panel-scope-enchantment.service";
import { ScopeEnchantmentModel, PanelInfoModel } from "./model";
import { PanelExtendService } from "./panel-extend.service";
import { BehaviorSubject, fromEvent, Subscription, Observable } from "rxjs";
import { PanelWidgetModel } from "./panel-widget/model";
import { PanelExtendMoveBackService } from "./panel-extend-move-back.service";
import { PanelAssistArborService } from "./panel-assist-arbor/panel-assist-arbor.service";
import { DraggablePort } from "@ng-public/directive/draggable/draggable.interface";
import { PanelScaleplateService } from "./panel-scaleplate/panel-scaleplate.service";
import { DraggableTensileCursorService } from "./panel-scope-enchantment/draggable-tensile-cursor.service";
import { cloneDeep, get } from "lodash";
import { NzMessageService } from "ng-zorro-antd";
import { map } from "rxjs/operators";
import { ImageModel } from "@ng-public/image-gallery/model";
import { PanelSoulService } from "./panel-soul/panel-soul.service";
import { PanelSeniorVesselEditService } from "./panel-senior-vessel-edit/panel-senior-vessel-edit.service";
import { AppDataService } from "app/appdata/appdata.service";
import { panelWidgetComponentObj } from "./panel-widget/all-widget-container";

@Injectable({
    providedIn: "root",
})
export class PanelExtendQuickShortcutsService {
    // 键盘按下的操作监听
    private listenKeyboardDown$: Subscription;
    // 键盘弹起的操作监听
    private listenKeyboardUp$: Subscription;

    public get widgetList$(): BehaviorSubject<Array<PanelWidgetModel>> {
        return this.panelExtendService.widgetList$;
    }
    public get panelInfo(): PanelInfoModel {
        return this.panelExtendService.panelInfoModel;
    }
    public get scopeEnchantmentModel(): ScopeEnchantmentModel {
        return this.panelScopeEnchantmentService.scopeEnchantmentModel;
    }

    constructor(
        private readonly zone: NgZone,
        private readonly panelExtendService: PanelExtendService,
        private readonly nzMessageService: NzMessageService,
        private readonly draggableTensileCursorService: DraggableTensileCursorService,
        private readonly panelSeniorVesselEditService: PanelSeniorVesselEditService,
        private readonly appDataService: AppDataService,
        private readonly panelScaleplateService: PanelScaleplateService,
        private readonly panelSoulService: PanelSoulService,
        private readonly panelAssistArborService: PanelAssistArborService,
        private readonly panelExtendMoveBackService: PanelExtendMoveBackService,
        private readonly panelScopeEnchantmentService: PanelScopeEnchantmentService
    ) {}

    /**
     * 获取浏览器的粘贴面板数据
     */
    public subClipboardPaste(): Observable<File> {
        return fromEvent(document, "paste").pipe(
            map((res: ClipboardEvent) => {
                if (res.clipboardData && res.clipboardData.items) {
                    for (let i = 0, len = res.clipboardData.items.length; i < len; i++) {
                        let item = res.clipboardData.items[i];
                        if (item.kind === "file") {
                            return item.getAsFile();
                        }
                    }
                } else {
                    return null;
                }
            })
        );
    }

    /**
     * 清空浏览器粘贴板数据
     */
    public clearClipboardPaste(): Observable<boolean> {
        return fromEvent(document, "copy").pipe(
            map((res: ClipboardEvent) => {
                if (res.clipboardData && res.clipboardData.items) {
                    res.clipboardData.setData("file", null);
                    res.preventDefault();
                    return true;
                } else {
                    return false;
                }
            })
        );
    }

    /**
     * 开启键盘事件监听
     */
    public openKeyboardEvent(): void {
        this.closeKeyboardEvent();
        this.listenKeyboardDown$ = fromEvent(document, "keydown").subscribe((keyboard: KeyboardEvent) => {
            this.zone.run(() => {
                // 如果当前获得的焦点标签是输入框且按下了enter键则自动blur；
                if (document.activeElement.tagName == "INPUT" && keyboard.keyCode == 13) {
                    document.activeElement["blur"]();
                }
                // 如果当前获得的焦点标签不是BODY就关闭键盘事件
                if (document.activeElement.tagName == "BODY") {
                    // 按下了ctr+s 或 command+s 执行保存操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 83) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 83)
                    ) {
                        keyboard.preventDefault();
                    }
                    // 按下了ctr+c 或 command+c 执行复制操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 67) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 67)
                    ) {
                        this.performCopy();
                    }
                    // 按下了ctr+v 或command+v 执行粘贴操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 86) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 86)
                    ) {
                        this.performPaste();
                    }
                    // 按下了ctr+a 或command+a 执行全选
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 65) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 65)
                    ) {
                        this.performCheckAll();
                    }
                    // 按下了ctr+z 或command+z 执行撤销
                    if (
                        (keyboard.metaKey == true && keyboard.shiftKey == false && keyboard.keyCode == 90) ||
                        (keyboard.ctrlKey == true && keyboard.shiftKey == false && keyboard.keyCode == 90)
                    ) {
                        this.panelExtendMoveBackService.acquireBackDBData();
                    }
                    // 按下了ctr+shift+z 或command+shift+z 执行前进
                    if (
                        (keyboard.metaKey == true && keyboard.shiftKey == true && keyboard.keyCode == 90) ||
                        (keyboard.ctrlKey == true && keyboard.shiftKey == true && keyboard.keyCode == 90)
                    ) {
                        this.panelExtendMoveBackService.acquireMoveDBData();
                    }
                    // 按下了ctr+d 或command+d 执行快捷复制粘贴操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 68) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 68)
                    ) {
                        keyboard.preventDefault();
                        this.performCopy();
                        this.performPaste(false);
                    }
                    // 按下了ctr+x 或command+x 执行剪切操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 88) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 88)
                    ) {
                        this.performCutWidget();
                    }
                    // 按下了ctr+g 或command+g 执行组合
                    if (
                        (keyboard.metaKey == true && keyboard.shiftKey == false && keyboard.keyCode == 71) ||
                        (keyboard.ctrlKey == true && keyboard.shiftKey == false && keyboard.keyCode == 71)
                    ) {
                        keyboard.preventDefault();
                        this.panelAssistArborService.launchCreateCombination$.next();
                    }
                    // 按下了ctr+shift+g 或command+shift+g 执行打散组合
                    if (
                        (keyboard.metaKey == true && keyboard.shiftKey == true && keyboard.keyCode == 71) ||
                        (keyboard.ctrlKey == true && keyboard.shiftKey == true && keyboard.keyCode == 71)
                    ) {
                        keyboard.preventDefault();
                        this.panelAssistArborService.launchDisperseCombination$.next();
                    }
                    // 按下了ctr+h 或command+h 执行隐藏或显示标尺辅助线操作
                    if (
                        (keyboard.metaKey == true && keyboard.keyCode == 72) ||
                        (keyboard.ctrlKey == true && keyboard.keyCode == 72)
                    ) {
                        keyboard.preventDefault();
                        this.panelScaleplateService.controlLineShowOrHide();
                    }
                    // 按下上下左右执行移动
                    if ([39, 38, 37, 40].includes(keyboard.keyCode)) {
                        this.performFourOrientation(keyboard);
                    }
                    // 按下了删除键盘
                    if (keyboard.keyCode == 8 || keyboard.keyCode == 46) {
                        this.performDelWidget();
                    }
                    // 按下了alt键盘
                    if (keyboard.keyCode == 18) {
                        this.panelScopeEnchantmentService.isOpenAltCalc$.next(false);
                    }
                    // 按下了shift键盘
                    if (keyboard.keyCode == 16 && keyboard.shiftKey == true) {
                        this.draggableTensileCursorService.isOpenConstrainShift$.next(true);
                    }
                    // 按下了commadn键
                    if (keyboard.keyCode == 91 && keyboard.metaKey == true) {
                        this.panelScaleplateService.isOpenMoveLine$.next(true);
                    }
                    // 按下了ctrl键
                    if (keyboard.keyCode == 17 && keyboard.ctrlKey == true) {
                        this.panelScaleplateService.isOpenMoveLine$.next(true);
                    }
                    // 按下了空格键
                    if (keyboard.keyCode == 32) {
                        this.panelExtendService.isOpenSpacebarMove$.next(true);
                    }
                    // 按下了esc键
                    if (keyboard.keyCode == 27) {
                        // this.panelSeniorVesselEditService.exitRoomVessel()
                    }
                }
            });
        });
        this.listenKeyboardUp$ = fromEvent(document, "keyup").subscribe(() => {
            this.zone.run(() => {
                this.panelScopeEnchantmentService.isOpenAltCalc$.next(true);
                this.panelExtendService.isOpenSpacebarMove$.next(false);
                this.panelScaleplateService.isOpenMoveLine$.next(false);
                this.draggableTensileCursorService.isOpenConstrainShift$.next(false);
                // 如果当前获得的焦点标签不是BODY就关闭键盘事件
                if (document.activeElement.tagName == "BODY") {
                }
            });
        });
    }

    /**
     * 取消所有键盘事件监听
     */
    public closeKeyboardEvent(): void {
        if (this.listenKeyboardDown$) this.listenKeyboardDown$.unsubscribe();
        if (this.listenKeyboardUp$) this.listenKeyboardUp$.unsubscribe();
    }

    /**
     * 执行复制操作
     */
    public performCopy(): void {
        const insetWidget = this.scopeEnchantmentModel.outerSphereInsetWidgetList$.value;
        if (Array.isArray(insetWidget) && insetWidget.length > 0) {
            const clipCopy = this.clearClipboardPaste().subscribe(() => {
                clipCopy.unsubscribe();
            });
            this.panelScopeEnchantmentService.clipboardList$.next(cloneDeep(insetWidget));
        }
    }

    /**
     * 执行粘贴操作
     * isNoneFile参数表示是否不需要粘贴文件,如果为false则直接粘贴组件
     */
    public performPaste(isNoneFile: boolean = true): void {
        const done = () => {
            let posi = { left: 0, top: 0 };
            const outer = this.scopeEnchantmentModel.valueProfileOuterSphere;
            if (outer) {
                posi.left = outer.left + Math.floor(outer.width / 2);
                posi.top = outer.top + outer.height + Math.floor(outer.height / 2);
            } else {
                posi.left = Math.floor(this.panelInfo.width / 2);
                posi.top = Math.floor(this.panelInfo.height / 2);
            }
            this.performPasteWidgetInPanel(posi);
        };
        if (isNoneFile) {
            const clipPaste = this.subClipboardPaste().subscribe(file => {
                if (file && file instanceof File) {
                    // 说明浏览器的粘贴板有图片文件，执行（上传 -> 生成widget组件 -> 选中图片组件）
                    this.handleForClipboardPasteFile();
                } else {
                    done();
                }
                clipPaste.unsubscribe();
            });
        } else {
            done();
        }
    }

    /**
     * 粘贴组件到面板
     * 如果是组合组件则把组合组件的子集也一并复制一份
     * 同时筛选出不是部件或动态容器的数据，因为动态容器只允许粘贴普通组件
     */
    public performPasteWidgetInPanel(position: { left: number; top: number }): void {
        let clipList = this.panelScopeEnchantmentService.clipboardList$.value;
        if (this.panelSeniorVesselEditService.isEnterEditVesselCondition$.value) {
            const allContainerWidgetType = Object.keys(panelWidgetComponentObj);
            clipList = clipList.filter(c => {
                return allContainerWidgetType.includes(c.type) || c.type == "combination";
            });
        }
        if (clipList.length == 0) {
            this.nzMessageService.warning("无粘贴内容");
        } else {
            const copyC = clipList.map(e => new PanelWidgetModel(cloneDeep(e)));
            this.panelExtendService.addPanelWidget(copyC);
            this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(copyC);
            const outerSphere = this.scopeEnchantmentModel.valueProfileOuterSphere;
            const dragIncrement = {
                left: position.left - outerSphere.left - Math.floor(outerSphere.width / 2),
                top: position.top - outerSphere.top - Math.floor(outerSphere.height / 2),
            };
            this.scopeEnchantmentModel.handleProfileOuterSphereLocationInsetWidget(dragIncrement);
            this.scopeEnchantmentModel.handleLocationInsetWidget(dragIncrement);
        }
    }

    /**
     * 执行全选操作
     */
    public performCheckAll(): void {
        this.panelScopeEnchantmentService.pushOuterSphereInsetWidget(this.panelExtendService.valueWidgetList());
    }

    /**
     * 执行上下左右四个键盘事件的回调
     * 对应keyCode如下
     * 右： 39
     * 上： 38
     * 左： 37
     * 下： 40
     */
    public performFourOrientation(key: KeyboardEvent): void {
        const scopeEnchant = this.scopeEnchantmentModel;
        if (scopeEnchant.valueProfileOuterSphere) {
            const keyCode = key.keyCode;
            const isShift: boolean = key.shiftKey;
            const move = (drag: DraggablePort) => {
                const pro = scopeEnchant.valueProfileOuterSphere;
                scopeEnchant.valueProfileOuterSphere.setMouseCoord([pro.left, pro.top]);
                scopeEnchant.outerSphereInsetWidgetList$.value.map(e => {
                    e.profileModel.setMouseCoord([e.profileModel.left, e.profileModel.top]);
                });
                scopeEnchant.handleProfileOuterSphereLocationInsetWidget(drag);
                scopeEnchant.handleLocationInsetWidget(drag);
            };
            const keyObj = {
                "39": { left: isShift ? 10 : 1, top: 0 },
                "38": { left: 0, top: isShift ? -10 : -1 },
                "37": { left: isShift ? -10 : -1, top: 0 },
                "40": { left: 0, top: isShift ? 10 : 1 },
            };
            if (keyObj[keyCode]) move(keyObj[keyCode]);
        }
    }

    /**
     * 删除选中的widget组件
     */
    public performDelWidget(): void {
        const scopeEnchant = this.scopeEnchantmentModel;
        if (scopeEnchant && scopeEnchant.outerSphereInsetWidgetList$.value) {
            const insetWidget = scopeEnchant.outerSphereInsetWidgetList$.value;
            const insetWidgetNrId = insetWidget.map(e => e.uniqueId);
            this.panelExtendService.deletePanelWidget(insetWidgetNrId);
            this.scopeEnchantmentModel.emptyAllProfile();
        }
    }

    /**
     * 执行剪切操作
     */
    public performCutWidget(): void {
        this.performCopy();
        this.performDelWidget();
    }

    /**
     * 执行图片手动上传操作，然后生成对应的图片组件widget，然后再选中
     */
    public handleForClipboardPasteFile(): void {
        // empty
    }

    /**
     * 动态创建图片组件，并自动贴上粘贴上传好的图片路径，并选中
     */
    public handleCreatePictureWidget(data: { id: [number]; original: string; url: string }): void {
        if (data) {
            // 创建图片类
            const picture = new ImageModel(<ImageModel>{
                id: get(data, "id[0]"),
                name: get(data, "original"),
                url: get(data, "url"),
            });
            // 找出图片的原始itemwidget类
            const itemWidget = this.panelSoulService.fixedWidget$.value.find(e => e.type == "picture");
            if (itemWidget) {
                // 创建图片widget组件
                const widget = new PanelWidgetModel(cloneDeep(itemWidget));
                widget.profileModel.setData({
                    left: 30,
                    top: 30,
                });
                widget.autoWidget.content = picture.url;
                // 添加到主视图中
                this.panelExtendService.addPanelWidget([widget]);
                // 选中
                this.panelScopeEnchantmentService.onlyOuterSphereInsetWidget(widget);
            }
        }
    }
}
