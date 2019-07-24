export type TSelectType = "radio" | "checkbox";

/**
 * 调用方法的参数定义
 */
export interface IImageGalleryConfigOptionsable {
    selectType: TSelectType;
    nzOk: Function;
    nzTipText?: string;
    maxCount?: number;
    nzCancel?: Function;
}
