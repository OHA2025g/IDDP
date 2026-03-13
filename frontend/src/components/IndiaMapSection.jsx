import React, { useState, useMemo, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent } from "./ui/card";
import { MapPin, Building2, ChevronDown, Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";

// India states GeoJSON (simplified CDN - for production consider hosting a lighter file)
const GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/karthikcs/india-states-geojson@master/india-states.geojson";

// Mock metric values per state (NAME_1) - in real app replace with API/dashboard data
const getStateMetric = (stateName, metricKey) => {
  const seed = stateName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hasData = seed % 3 !== 0; // ~2/3 states have data for demo
  if (!hasData) return null;
  const base = 50 + (seed % 40);
  return Math.min(100, base + (metricKey === "health" ? 10 : 0));
};

const METRIC_OPTIONS = [
  { value: "health", label: "School Health Index" },
  { value: "development", label: "District Development Index" },
  { value: "coverage", label: "Scheme Coverage" },
];

const getColor = (value, showNoData) => {
  if (value == null || !showNoData) return "#f1f5f9"; // no data / light grey
  const intensity = Math.min(1, (value - 40) / 60);
  const r = Math.round(220 - intensity * 120);
  const g = Math.round(60 + intensity * 30);
  const b = Math.round(60 + intensity * 30);
  return `rgb(${r},${g},${b})`;
};

export default function IndiaMapSection() {
  const [metric, setMetric] = useState("health");
  const [showNoData, setShowNoData] = useState(true);
  const [geographyData, setGeographyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(GEOJSON_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setGeographyData(data);
      })
      .catch(() => {
        if (!cancelled) setGeographyData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    if (!geographyData?.features) return { withData: 0, total: 0, avg: 0 };
    const features = geographyData.features;
    const withData = features.filter((f) =>
      getStateMetric(f.properties?.NAME_1 ?? f.properties?.name, metric)
    ).length;
    const values = features
      .map((f) => getStateMetric(f.properties?.NAME_1 ?? f.properties?.name, metric))
      .filter((v) => v != null);
    const avg =
      values.length > 0
        ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
        : "0";
    return {
      withData,
      total: features.length,
      avg,
    };
  }, [geographyData, metric]);

  return (
    <section
      data-testid="india-map-section"
      className="py-12 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              India Map
            </h2>
          </div>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger className="w-[240px] bg-white border-slate-200">
              <SelectValue placeholder="Select metric" />
              <ChevronDown className="w-4 h-4 opacity-50" />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-6 mb-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>
              {stats.withData}/{stats.total} States with Data
            </span>
          </div>
          <div>
            <span>Avg {METRIC_OPTIONS.find((m) => m.value === metric)?.label}: {stats.avg}%</span>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 shadow-sm bg-slate-50/50 rounded-xl">
          <CardContent className="p-0">
            <div className="relative w-full aspect-[5/3] min-h-[320px] max-h-[520px]">
              {loading || !geographyData ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl">
                  {loading ? "Loading map…" : "Unable to load map data."}
                </div>
              ) : (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [78.9629, 22.5937],
                  scale: 1100,
                }}
                width={800}
                height={480}
                style={{ width: "100%", height: "100%", overflow: "visible" }}
                className="rounded-xl"
              >
                <ZoomableGroup center={[78.9629, 22.5937]} zoom={1}>
                  <Geographies geography={geographyData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const name =
                          geo.properties?.NAME_1 ?? geo.properties?.name ?? "";
                        const value = getStateMetric(name, metric);
                        const fill = getColor(value, showNoData);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fill}
                            stroke="#475569"
                            strokeWidth={0.6}
                            style={{
                              default: { outline: "none", transition: "fill 0.15s ease" },
                              hover: {
                                outline: "none",
                                fill: value != null ? "#b91c1c" : "#94a3b8",
                                cursor: "pointer",
                                transition: "fill 0.15s ease",
                              },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Low</span>
                  <div
                    className="w-24 h-3 rounded-full"
                    style={{
                      background: "linear-gradient(to right, #fecaca, #b91c1c)",
                    }}
                  />
                  <span className="text-xs text-slate-500">High</span>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <Checkbox
                    checked={showNoData}
                    onCheckedChange={(c) => setShowNoData(!!c)}
                  />
                  No Data
                </label>
              </div>
              <a
                href="https://schooldashboard.demo.agrayianailabs.com/executive-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                <Info className="w-4 h-4" />
                Click state for details
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
