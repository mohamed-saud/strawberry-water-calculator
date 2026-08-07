import { useMemo, useState } from "react";
import "./App.css";
/// this app is a calculator for strawberry irrigation needs, it calculates the water needs and the irrigation time based on the farm data and climate data
import { calculateIrrigation } from "./irrigationCalculator";

type AreaUnit = "feddan" | "hectare" | "m2";

const AREA_TO_M2: Record<AreaUnit, number> = {
  feddan: 4200,
  hectare: 10000,
  m2: 1,
};

const KcStages = {
  establishment: 0.4,
  vegetative: 0.7,
  flowering: 0.85,
  fruiting: 0.95,
  lateSeason: 0.8,
};

const stageNames: Record<keyof typeof KcStages, string> = {
  establishment: "مرحلة الشتل والتأسيس",
  vegetative: "النمو الخضري",
  flowering: "التزهير",
  fruiting: "الإثمار والإنتاج",
  lateSeason: "نهاية الموسم",
};

function App() {
  const [area, setArea] = useState(1);

  const [areaUnit, setAreaUnit] = useState<AreaUnit>("feddan");

  const [eto, setEto] = useState(5);

  const [stage, setStage] = useState<keyof typeof KcStages>("flowering");

  const [efficiency, setEfficiency] = useState(90);

  const [rowSpacing, setRowSpacing] = useState(0.4);

  const [plantSpacing, setPlantSpacing] = useState(0.25);

  const [drippersPerPlant, setDrippersPerPlant] = useState(1);

  const [dripperFlow, setDripperFlow] = useState(2);

  const [irrigationCycles, setIrrigationCycles] = useState(5);

  const [numberOfZones, setNumberOfZones] = useState(4);

  const results = useMemo(() => {
    const areaM2 = area * AREA_TO_M2[areaUnit];

    const kc = KcStages[stage];

    return calculateIrrigation({
      areaM2,
      eto,
      kc,
      efficiency,
      rowSpacing,
      plantSpacing,
      drippersPerPlant,
      dripperFlow,
      irrigationCycles,
      numberOfZones,
    });
  }, [
    area,
    areaUnit,
    eto,
    stage,
    efficiency,
    rowSpacing,
    plantSpacing,
    drippersPerPlant,
    dripperFlow,
    irrigationCycles,
    numberOfZones,
  ]);

  const format = (value: number, digits = 2) =>
    value.toLocaleString("ar-EG", {
      maximumFractionDigits: digits,
    });

  return (
    <div className="app" dir="rtl">
      {/* Header */}

      <header className="header">
        <div className="header-content">
          <div className="logo">🍓</div>

          <h1>حاسبة احتياجات ري الفراولة</h1>

          <p>احسب الاحتياجات المائية ومدة تشغيل شبكة الري بطريقة سهلة</p>
        </div>
      </header>

      <main className="container">
        {/* بيانات المزرعة */}

        <section className="card">
          <h2>🌱 بيانات المزرعة</h2>

          <div className="grid">
            <div className="field">
              <label>مساحة الأرض</label>

              <div className="input-group">
                <input
                  type="number"
                  min="0"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                />

                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                >
                  <option value="feddan">فدان</option>

                  <option value="hectare">هكتار</option>

                  <option value="m2">متر مربع</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>المسافة بين الخطوط</label>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={rowSpacing}
                  onChange={(e) => setRowSpacing(Number(e.target.value))}
                />

                <span>متر</span>
              </div>
            </div>

            <div className="field">
              <label>المسافة بين النباتات</label>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={plantSpacing}
                  onChange={(e) => setPlantSpacing(Number(e.target.value))}
                />

                <span>متر</span>
              </div>
            </div>
          </div>
        </section>

        {/* المناخ والمحصول */}

        <section className="card">
          <h2>☀️ بيانات المناخ والمحصول</h2>

          <div className="grid">
            <div className="field">
              <label>البخر-نتح المرجعي (ETo)</label>

              <small className="help">
                كمية الماء المفقودة من سطح مرجعي خلال اليوم
              </small>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={eto}
                  onChange={(e) => setEto(Number(e.target.value))}
                />

                <span>مم/يوم</span>
              </div>
            </div>

            <div className="field">
              <label>مرحلة نمو الفراولة</label>

              <select
                value={stage}
                onChange={(e) =>
                  setStage(e.target.value as keyof typeof KcStages)
                }
              >
                {Object.entries(stageNames).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name} — Kc {KcStages[key as keyof typeof KcStages]}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>كفاءة شبكة الري</label>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                />

                <span>%</span>
              </div>
            </div>
          </div>
        </section>

        {/* شبكة الري */}

        <section className="card">
          <h2>💧 بيانات شبكة الري بالتنقيط</h2>

          <div className="grid">
            <div className="field">
              <label>عدد النقاطات لكل نبات</label>

              <input
                type="number"
                min="1"
                step="1"
                value={drippersPerPlant}
                onChange={(e) => setDrippersPerPlant(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>تصرف النقاط</label>

              <div className="input-with-unit">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={dripperFlow}
                  onChange={(e) => setDripperFlow(Number(e.target.value))}
                />

                <span>لتر/ساعة</span>
              </div>
            </div>

            <div className="field">
              <label>عدد الريات يوميًا</label>

              <input
                type="number"
                min="1"
                step="1"
                value={irrigationCycles}
                onChange={(e) => setIrrigationCycles(Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label>عدد قطاعات الري</label>

              <input
                type="number"
                min="1"
                step="1"
                value={numberOfZones}
                onChange={(e) => setNumberOfZones(Number(e.target.value))}
              />

              <small className="help">عدد القطاعات التي تعمل بالتتابع</small>
            </div>
          </div>
        </section>

        {/* النتائج */}

        <section className="results">
          <h2>📊 النتائج</h2>

          <div className="result-grid">
            <ResultCard
              title="الاستهلاك المحصولي ETc"
              value={`${format(results.etc)} مم/يوم`}
            />

            <ResultCard
              title="عدد النباتات"
              value={format(results.plants, 0)}
            />

            <ResultCard
              title="الاحتياج المائي اليومي"
              value={`${format(results.grossWaterM3)} م³/يوم`}
              important
            />

            <ResultCard
              title="كمية المياه لكل رية"
              value={`${format(results.waterPerIrrigation)} لتر`}
            />
          </div>
        </section>

        {/* التصرف */}

        <section className="card">
          <h2>🚿 تصرف شبكة الري</h2>

          <div className="irrigation-result">
            <div>
              <span>إجمالي عدد النقاطات</span>

              <strong>{format(results.totalDrippers, 0)}</strong>
            </div>

            <div>
              <span>التصرف الكلي للشبكة</span>

              <strong>{format(results.totalSystemFlow)} لتر/ساعة</strong>
            </div>

            <div>
              <span>تصرف القطاع الواحد</span>

              <strong>{format(results.zoneFlow)} لتر/ساعة</strong>
            </div>
          </div>
        </section>

        {/* زمن الري */}

        <section className="card runtime-card">
          <h2>⏱️ زمن تشغيل الري</h2>

          <div className="runtime">
            <div>
              <span>عدد الريات يوميًا</span>

              <strong>{irrigationCycles}</strong>
            </div>

            <div>
              <span>عدد قطاعات الري</span>

              <strong>{numberOfZones}</strong>
            </div>

            <div className="runtime-main">
              <span>زمن تشغيل القطاع في الرية</span>

              <strong>{format(results.runtimeMinutes)} دقيقة</strong>
            </div>

            <div>
              <span>إجمالي تشغيل الشبكة يوميًا</span>

              <strong>{format(results.totalDailyRuntimeMinutes)} دقيقة</strong>
            </div>
          </div>
        </section>

        {/* الحسابات */}

        <section className="card">
          <h2>📐 تفاصيل الحساب</h2>

          <div className="formula">
            <p>
              <strong>الاستهلاك المحصولي: ETc = ETo × Kc</strong>
            </p>

            <p>
              {format(eto)} × {KcStages[stage]}
              {" = "}
              <strong>{format(results.etc)} مم/يوم</strong>
            </p>

            <p>
              <strong>الاحتياج الصافي = ETc × مساحة الأرض</strong>
            </p>

            <p>
              {format(results.etc)} × {format(results.areaM2, 0)}
              {" = "}
              <strong>{format(results.netWaterLiters)} لتر/يوم</strong>
            </p>

            <p>
              <strong>الاحتياج الإجمالي = الاحتياج الصافي ÷ كفاءة الري</strong>
            </p>

            <p>
              {format(results.netWaterLiters)}

              {" ÷ "}

              {efficiency / 100}

              {" = "}

              <strong>{format(results.grossWaterLiters)} لتر/يوم</strong>
            </p>

            <p>
              <strong>
                كمية المياه لكل رية = الاحتياج اليومي ÷ عدد الريات
              </strong>
            </p>

            <p>
              {format(results.grossWaterLiters)}

              {" ÷ "}

              {irrigationCycles}

              {" = "}

              <strong>{format(results.waterPerIrrigation)} لتر/رية</strong>
            </p>

            <p>
              <strong>تصرف القطاع = التصرف الكلي ÷ عدد القطاعات</strong>
            </p>

            <p>
              {format(results.totalSystemFlow)}

              {" ÷ "}

              {numberOfZones}

              {" = "}

              <strong>{format(results.zoneFlow)} لتر/ساعة</strong>
            </p>

            <p>
              <strong>
                زمن تشغيل القطاع = كمية المياه لكل رية ÷ تصرف القطاع × 60
              </strong>
            </p>

            <p>
              {format(results.waterPerIrrigation)}

              {" ÷ "}

              {format(results.zoneFlow)}

              {" × 60 = "}

              <strong>{format(results.runtimeMinutes)} دقيقة</strong>
            </p>
          </div>
        </section>

        {/* تنبيه */}

        <section className="notice">
          <strong>⚠️ تنبيه زراعي</strong>

          <p>
            النتائج تقديرية وتعتمد على دقة بيانات ETo وKc وكفاءة شبكة الري وتصرف
            النقاطات. يجب مقارنة النتائج مع رطوبة التربة والظروف الفعلية في
            المزرعة قبل اعتماد برنامج الري.
          </p>
        </section>
      </main>
    </div>
  );
}

interface ResultCardProps {
  title: string;
  value: string;
  important?: boolean;
}

function ResultCard({ title, value, important = false }: ResultCardProps) {
  return (
    <div className={`result-card ${important ? "important" : ""}`}>
      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

export default App;
