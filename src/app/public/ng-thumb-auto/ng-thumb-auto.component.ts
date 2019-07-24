import { Component, OnInit, Input, OnChanges, SimpleChanges } from "@angular/core";
import { environment } from "environments/environment";
import { IThumbConf } from "./thumb-conf.interface";

@Component({
    selector: "ng-thumb-auto",
    template: `
        <div class="thumb" [ngSwitch]="type" [ngStyle]="{ 'justify-content': justify }">
            <ng-template [ngSwitchCase]="'IMG'">
                <nz-popover *ngIf="showPreview" [nzPlacement]="'right'">
                    <div nz-popover>
                        <ng-container [ngTemplateOutlet]="typeImg"></ng-container>
                    </div>
                    <ng-template #nzTemplate>
                        <div>
                            <img
                                class="previewImg"
                                [ngStyle]="{ 'border-radius': circular ? '50%' : '0px' }"
                                src="{{ imgLoadErr ? imgErr : fileUrl + imgSrc }}"
                                (error)="imgLoadErr = true"
                                alt=""
                            />
                        </div>
                    </ng-template>
                </nz-popover>
                <ng-container *ngIf="!showPreview" [ngTemplateOutlet]="typeImg"></ng-container>
            </ng-template>
            <ng-template [ngSwitchCase]="'ICON'">
                <ng-container *ngIf="!imgLoadErr" [ngTemplateOutlet]="typeIconPure"></ng-container>
                <i *ngIf="imgLoadErr" class="{{ iconErr }} color999" [ngStyle]="{ 'font-size': iconSize + 'px' }"></i>
            </ng-template>
            <ng-template [ngSwitchCase]="'PURE'">
                <ng-container *ngIf="!imgLoadErr" [ngTemplateOutlet]="typeIconPure"></ng-container>
                <span
                    *ngIf="imgLoadErr"
                    class="bg999"
                    [ngStyle]="{
                        width: imgSize + 'px',
                        height: imgSize + 'px',
                        'border-radius': circular ? '50%' : '0px'
                    }"
                ></span>
            </ng-template>

            <ng-template #typeImg>
                <div
                    class="imgLayer"
                    [ngStyle]="{
                        width: imgSize + 'px',
                        height: imgSize + 'px',
                        'border-radius': circular ? '50%' : '0px',
                        border: isShowBorder ? '1px solid #e8e8e8' : ''
                    }"
                >
                    <img src="{{ imgLoadErr ? imgErr : fileUrl + imgSrc }}" (error)="imgLoadErr = true" alt="" />
                </div>
            </ng-template>
            <ng-template #typeIconPure>
                <div
                    class="imgLayer"
                    [ngStyle]="{
                        width: imgSize + 'px',
                        height: imgSize + 'px',
                        'border-radius': circular ? '50%' : '0px',
                        border: isShowBorder ? '1px solid #e8e8e8' : ''
                    }"
                >
                    <img *ngIf="!imgLoadErr" src="{{ fileUrl + imgSrc }}" (error)="imgLoadErr = true" alt="" />
                </div>
            </ng-template>
        </div>
    `,
    styleUrls: ["./ng-thumb-auto.component.scss"],
})
export class MgrThumbAutoComponent implements OnInit, OnChanges, IThumbConf {
    private _isDomainUrl = true;
    // 类型  错误时加载图片还是图标、灰色块
    @Input() type: "ICON" | "IMG" | "PURE";
    // 源图片地址
    @Input() imgSrc: string;
    // type = ICON 时的图标标示
    @Input() iconErr: string;
    // type = IMG 时的图片地址
    @Input() imgErr = "/assets/image/default.png";
    // icon 大小
    @Input() iconSize = 50;
    // 图片宽度 默认100%
    @Input() imgSize: number;
    // 图片圆形
    @Input() circular: boolean;
    // 居中是否
    @Input() justify: "left" | "center";
    // 图片是否需要移动上 可预览
    @Input() showPreview: boolean;
    // 是否显示边框
    @Input() isShowBorder: boolean;

    @Input() fileUrl: string;
    // 是否允许线上模式携带home目录
    @Input() isHasHome = true;

    // 是否携带域名
    @Input()
    public set isDomainUrl(v: boolean) {
        this._isDomainUrl = v;
        if (v == false) {
            this.fileUrl = "";
        }
    }
    public get isDomainUrl(): boolean {
        return this._isDomainUrl;
    }

    imgLoadErr: boolean;

    constructor() {
        this.type = "IMG";
        this.justify = "center";
        this.fileUrl = this.isDomainUrl && environment.production ? environment.fileurl : "";
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.imgSrc) {
            this.imgLoadErr = false;
        }
        if (changes.fileUrl) {
            this.fileUrl = this.isDomainUrl
                ? changes.fileUrl.currentValue
                    ? changes.fileUrl.currentValue
                    : environment.fileurl
                : "";
        }
    }
}
