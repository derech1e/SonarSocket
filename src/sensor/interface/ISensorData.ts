export interface ISensorData {
  status: "SUCCESS" | "TIMEOUT" | "TOO_FAR_AWAY";
  datetime: Date;
  distance: number;
  sensor?: { triggerTick: number; echoTick: number; diff: number };
}
