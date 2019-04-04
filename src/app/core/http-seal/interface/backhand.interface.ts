//后端返回数据 约束 不带分页
export interface IBackHand<T> {
	data: T;
	status: number;
	message: string;
	reasonCode?: any;
}

//后端返回数据 约束 带分页
export interface IBackHandList<T> {
	data: {
		data: T;
		total: number;
	};
	status: number;
	message: string;
	reasonCode?: any;
}
