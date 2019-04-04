/**
 * 保留小数点取整，不四舍五入
 */
export const toInteger = (value: number, dig: number = 2): number => {
	if (value != undefined || value != null) {
		return dig == 0 ? Math.floor(value) : Math.floor(value * 10 ** dig) / 10 ** dig;
	}
	return value;
};

/*
根据时间戳获取唯一的id值
参数isStr表示是否返回带nr字符
 */
export const uniqueId = (isStr: boolean = true): string | number =>
	isStr ? `nr${new Date().getTime()}` : new Date().getTime();

/*
验证是否为对象
 */
export const isObject = (value: any): boolean => !!value && (typeof value === "object" || typeof value === "function");
