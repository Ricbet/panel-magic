import { TapCallHandler } from "./tap-call-handler";
import { TapNavigateHandler } from "./tap-navigate-handler";
import { EventModel } from "./event.model";
import { TapVesselStatusHandler } from "./tap-vessel-status-handler";
import { TapMapHandler } from "./tap-map-handler";
import { TapProductDetailHandler } from "./tap-product-detail-handler";

export * from "./tap-call-handler";
export * from "./tap-navigate-handler";
export * from "./tap-vessel-status-handler";
export * from "./tap-map-handler";
export * from "./tap-product-detail-handler";
export * from "./event.model";

export type TEventHandler =
	| TapCallHandler
	| TapNavigateHandler
	| TapVesselStatusHandler
	| TapMapHandler
	| TapProductDetailHandler
	| EventModel;
