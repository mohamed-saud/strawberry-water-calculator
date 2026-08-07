export interface IrrigationInput {
  // Farm
  areaM2: number;

  // Crop water requirement
  eto: number; // mm/day
  kc: number;
  efficiency: number; // %

  // Planting
  rowSpacing: number; // m
  plantSpacing: number; // m

  // Drip system
  drippersPerPlant: number;
  dripperFlow: number; // L/hour

  // Irrigation scheduling
  irrigationCycles: number; // cycles/day
  numberOfZones: number;
}

export interface IrrigationResult {
  areaM2: number;

  etc: number;

  plants: number;

  netWaterLiters: number;
  grossWaterLiters: number;
  grossWaterM3: number;

  waterPerIrrigation: number;

  totalDrippers: number;

  totalSystemFlow: number;
  zoneFlow: number;

  runtimeHours: number;
  runtimeMinutes: number;

  totalDailyRuntimeMinutes: number;
}

export function calculateIrrigation(data: IrrigationInput): IrrigationResult {
  /*
   * --------------------------------------------------
   * 1. Crop Evapotranspiration
   *
   * ETc = ETo × Kc
   *
   * Result: mm/day
   * --------------------------------------------------
   */

  const etc = data.eto * data.kc;

  /*
   * --------------------------------------------------
   * 2. Net Crop Water Requirement
   *
   * 1 mm of water over 1 m² = 1 liter
   *
   * Net water:
   *
   * ETc × Area
   * --------------------------------------------------
   */

  const netWaterLiters = etc * data.areaM2;

  /*
   * --------------------------------------------------
   * 3. Gross Irrigation Requirement
   *
   * The irrigation system is not 100% efficient.
   *
   * Gross Water =
   * Net Water / Efficiency
   * --------------------------------------------------
   */

  const efficiency = data.efficiency / 100;

  const grossWaterLiters = efficiency > 0 ? netWaterLiters / efficiency : 0;

  /*
   * --------------------------------------------------
   * 4. Convert liters → m³
   * --------------------------------------------------
   */

  const grossWaterM3 = grossWaterLiters / 1000;

  /*
   * --------------------------------------------------
   * 5. Calculate Plant Population
   *
   * Plant area =
   *
   * Row spacing × Plant spacing
   *
   * Plants =
   *
   * Farm area / Plant area
   * --------------------------------------------------
   */

  const plantArea = data.rowSpacing * data.plantSpacing;

  const plants = plantArea > 0 ? data.areaM2 / plantArea : 0;

  /*
   * --------------------------------------------------
   * 6. Water per irrigation cycle
   *
   * Example:
   *
   * Daily water = 20,000 L
   * Cycles = 5
   *
   * Water/cycle = 4,000 L
   * --------------------------------------------------
   */

  const waterPerIrrigation =
    data.irrigationCycles > 0 ? grossWaterLiters / data.irrigationCycles : 0;

  /*
   * --------------------------------------------------
   * 7. Total number of drippers
   * --------------------------------------------------
   */

  const totalDrippers = plants * data.drippersPerPlant;

  /*
   * --------------------------------------------------
   * 8. Total system flow
   *
   * Drippers × Flow per dripper
   *
   * Example:
   *
   * 42,000 drippers × 2 L/hour
   *
   * = 84,000 L/hour
   * --------------------------------------------------
   */

  const totalSystemFlow = totalDrippers * data.dripperFlow;

  /*
   * --------------------------------------------------
   * 9. Flow per irrigation zone
   *
   * IMPORTANT:
   *
   * We don't assume the whole farm operates
   * simultaneously.
   *
   * Example:
   *
   * Total flow = 84,000 L/hour
   * Zones = 4
   *
   * Zone flow = 21,000 L/hour
   * --------------------------------------------------
   */

  const zoneFlow =
    data.numberOfZones > 0 ? totalSystemFlow / data.numberOfZones : 0;

  /*
   * --------------------------------------------------
   * 10. Runtime
   *
   * Runtime (hours) =
   *
   * Water per irrigation /
   * Zone flow
   * --------------------------------------------------
   */

  const runtimeHours = zoneFlow > 0 ? waterPerIrrigation / zoneFlow : 0;

  /*
   * --------------------------------------------------
   * 11. Convert hours → minutes
   * --------------------------------------------------
   */

  const runtimeMinutes = runtimeHours * 60;

  /*
   * --------------------------------------------------
   * 12. Total daily runtime
   *
   * This is the total runtime if zones are operated
   * sequentially for every irrigation cycle.
   *
   * NOTE:
   * This is NOT the runtime of one zone.
   * --------------------------------------------------
   */

  const totalDailyRuntimeMinutes =
    runtimeMinutes * data.irrigationCycles * data.numberOfZones;

  return {
    areaM2: data.areaM2,

    etc,

    plants: Math.round(plants),

    netWaterLiters,

    grossWaterLiters,

    grossWaterM3,

    waterPerIrrigation,

    totalDrippers: Math.round(totalDrippers),

    totalSystemFlow,

    zoneFlow,

    runtimeHours,

    runtimeMinutes,

    totalDailyRuntimeMinutes,
  };
}
