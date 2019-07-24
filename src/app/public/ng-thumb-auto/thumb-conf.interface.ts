export interface IThumbConf {
    // 类型  错误时加载图片还是图标、灰色块
    type?: "ICON" | "IMG" | "PURE";
    // 源图片地址
    imgSrc?: string;
    // type = ICON 时的图标标示
    iconErr?: string;
    // type = IMG 时的图片地址
    imgErr?: string;
    // icon 大小
    iconSize?: number;
    // 图片宽度 默认100%
    imgSize?: number;
    // 图片圆形
    circular?: boolean;
    // 居中是否
    justify?: "left" | "center";
    // 图片是否需要移动上 可预览
    showPreview?: boolean;
    fileUrl?: string;
}
