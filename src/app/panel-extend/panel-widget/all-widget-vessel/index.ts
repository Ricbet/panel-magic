import { PanelWidgetModel } from "../model";

import { SeniorVesselWidgetComponent } from "./senior-vessel-widget/senior-vessel-widget.component";
import { seniorVesselWidget } from "./senior-vessel-widget/senior-vessel-widget.data";

export const panelWidgetVesselList = [SeniorVesselWidgetComponent];

export const panelWidgetVesselObj = {
	seniorvessel: SeniorVesselWidgetComponent
};

export const panelWidgetFixedVesselLsit: Array<PanelWidgetModel> = [seniorVesselWidget];
