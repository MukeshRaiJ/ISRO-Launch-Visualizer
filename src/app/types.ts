export interface Launch {
  launchNo: string;
  flightNo: string;
  dateTime: string;
  rocket?: string;
  configuration?: string;
  payload?: string;
  orbit?: string;
  launchOutcome?: string;
  launchSite?: string;
  payloadMass?: number;
  payloadMassUnit?: string;
  missionDescription?: string;
  notes?: string;
}
