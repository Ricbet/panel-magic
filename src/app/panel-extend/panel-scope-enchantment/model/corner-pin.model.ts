// 八个位置
export enum ELocation {
	"lt",
	"t",
	"rt",
	"r",
	"rb",
	"b",
	"lb",
	"l"
}
// 对应的手势
export enum ECursor {
	"lt",
	"t",
	"rt",
	"r",
	"rb",
	"b",
	"lb",
	"l"
}
// 对应手势的鼠标样式
export const CCursorStyle = [
	"nw-resize",
	"n-resize",
	"ne-resize",
	"e-resize",
	"se-resize",
	"s-resize",
	"sw-resize",
	"w-resize"
];

/**
 * 八个方位上的边角和角落
 * 用户实现拉伸效果
 */
export class CornerPinModel {
	// 类型分为手势和方位
	// 只有type为手势的才允许实现拖拽
	public type: "cursor" | "location";
	// 所在位置
	public location: string = null;
	// 对应手势
	public cursor: string = null;

	constructor(data: { [key: string]: string | number }) {
		if (data) {
			this.type = data.type == "cursor" ? "cursor" : "location";
			this.location = ELocation[data.location];
			this.cursor = ECursor[data.cursor];
		}
	}
}
