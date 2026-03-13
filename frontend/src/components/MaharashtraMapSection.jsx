import React, { useState, useEffect, useMemo } from "react";
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

// Maharashtra district boundaries (aligns with IIT Bombay Maharashtra Census map districts)
// https://www.cse.iitb.ac.in/~pocra/MahaCensus_shapefile_data1.2/MaharashtraCensus.html
const MAHARASHTRA_DISTRICTS_GEOJSON_URL =
  "https://raw.githubusercontent.com/HindustanTimesLabs/shapefiles/master/state_ut/maharashtra/district/maharashtra_district.json";

const IITB_MAHARASHTRA_CENSUS_URL =
  "https://www.cse.iitb.ac.in/~pocra/MahaCensus_shapefile_data1.2/MaharashtraCensus.html";

// Mock metric per district - replace with real API/dashboard data
const getDistrictMetric = (districtName, metricKey) => {
  const seed = (districtName || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 50 + (seed % 45);
  return Math.min(100, base + (metricKey === "health" ? 8 : 0));
};

const METRIC_OPTIONS = [
  { value: "health", label: "School Health Index" },
  { value: "development", label: "District Development Index" },
  { value: "coverage", label: "Scheme Coverage" },
];

const getColor = (value) => {
  if (value == null) return "#f1f5f9";
  const intensity = Math.min(1, (value - 40) / 60);
  const r = Math.round(220 - intensity * 120);
  const g = Math.round(60 + intensity * 30);
  const b = Math.round(60 + intensity * 30);
  return `rgb(${r},${g},${b})`;
};

// Maharashtra center (approximate)
const CENTER = [76.5, 19.5];

// Highlight fill for selected district
const SELECTED_FILL = "#7f1d1d";
const HOVER_FILL = "#b91c1c";

export default function MaharashtraMapSection({
  embedded = false,
  selectedDistrict = null,
  hoveredDistrict = null,
  onDistrictHover,
  onDistrictSelect,
}) {
  const [metric, setMetric] = useState("health");
  const [geographyData, setGeographyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(MAHARASHTRA_DISTRICTS_GEOJSON_URL)
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
      getDistrictMetric(f.properties?.district, metric)
    ).length;
    const values = features
      .map((f) => getDistrictMetric(f.properties?.district, metric))
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

  const renderMap = () => {
    if (loading || !geographyData) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl">
          {loading ? "Loading Maharashtra map…" : "Unable to load map data."}
        </div>
      );
    }
    const activeDistrict = selectedDistrict || hoveredDistrict;
    return (
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: CENTER,
          scale: 2800,
        }}
        width={800}
        height={480}
        style={{ width: "100%", height: "100%", overflow: "visible" }}
        className="rounded-xl"
      >
        <ZoomableGroup center={CENTER} zoom={1}>
          <Geographies geography={geographyData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const district = geo.properties?.district ?? "";
                const isSelected = selectedDistrict === district;
                const isHovered = hoveredDistrict === district;
                const value = getDistrictMetric(district, metric);
                let fill = getColor(value);
                if (isSelected) fill = SELECTED_FILL;
                else if (isHovered) fill = HOVER_FILL;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={isSelected || isHovered ? "#1e293b" : "#475569"}
                    strokeWidth={isSelected || isHovered ? 1.2 : 0.6}
                    style={{
                      default: {
                        outline: "none",
                        transition: "fill 0.15s ease",
                      },
                      hover: {
                        outline: "none",
                        fill: HOVER_FILL,
                        cursor: "pointer",
                        transition: "fill 0.15s ease",
                      },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => onDistrictHover?.(district)}
                    onMouseLeave={() => onDistrictHover?.(null)}
                    onClick={() => onDistrictSelect?.(district)}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    );
  };

  if (embedded) {
    return (
      <div className="relative w-full h-full min-h-[320px] flex items-center justify-center rounded-xl overflow-visible bg-white p-4">
        <div className="w-[93%] h-[82%] min-h-[280px] rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50/50 shadow-inner">
          {renderMap()}
        </div>
      </div>
    );
  }

  return (
    <section
      data-testid="maharashtra-map-section"
      className="py-12 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Maharashtra Census Map
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
              {stats.withData}/{stats.total} Districts with Data
            </span>
          </div>
          <div>
            <span>
              Avg {METRIC_OPTIONS.find((m) => m.value === metric)?.label}: {stats.avg}%
            </span>
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 shadow-sm bg-slate-50/50 rounded-xl">
          <CardContent className="p-0">
            <div className="relative w-full aspect-[5/3] min-h-[320px] max-h-[520px]">
              {renderMap()}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-t border-slate-200 bg-white">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Low</span>
                  <div
                    className="w-24 h-3 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, #fecaca, #b91c1c)",
                    }}
                  />
                  <span className="text-xs text-slate-500">High</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={IITB_MAHARASHTRA_CENSUS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  Maharashtra Census (IIT Bombay)
                </a>
                <a
                  href="https://www.cse.iitb.ac.in/~pocra/MahaCensus_shapefile_data1.2/Boundary.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 hover:underline"
                >
                  District & taluka boundaries
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
