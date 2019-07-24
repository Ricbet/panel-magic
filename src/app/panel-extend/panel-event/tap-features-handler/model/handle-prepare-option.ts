/**
 * 预备待选择的功能列表
 */

/**
 * 功能事件类型定义
 * 'Map': 地图功能
 */
export type TFeaturesSoul = "Map";

export interface IPrepareOption {
    icon: string;
    name: string;
    type: TFeaturesSoul;
}

export const handlePrepareList: IPrepareOption[] = [
    {
        icon: "xiaochengxu-ditu1",
        name: "地图",
        type: "Map",
    },
];
