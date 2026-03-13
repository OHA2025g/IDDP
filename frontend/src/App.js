import React, { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MaharashtraMapSection from "./components/MaharashtraMapSection";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import { Button } from "./components/ui/button";
import {
  HeartPulse,
  GraduationCap,
  Sprout,
  Landmark,
  Hammer,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Database,
  LineChart,
  Target,
  Map,
  FileText,
  Activity,
  Clock,
  Info,
} from "lucide-react";

// Scroll-reveal hook: sets visible when element enters viewport
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { threshold = 0.08, rootMargin = "0px 0px -40px 0px" } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);
  return [ref, visible];
};

// Ticker Component
const Ticker = () => {
  const alerts = [
    { type: "critical", text: "Fund exhaustion predicted: Health dept by May 15", category: "Finance", time: "Now" },
    { type: "warning", text: "ToT closing in 3 days - 45 pending certifications", category: "Training", time: "1h ago" },
    { type: "critical", text: "3 blocks need intervention for SDG targets", category: "Aspirational", time: "2h ago" },
    { type: "success", text: "PM-KISAN: 94.7% disbursement completed", category: "Schemes", time: "3h ago" },
    { type: "info", text: "GSDP Q3 estimates updated", category: "Economic", time: "5h ago" },
    { type: "info", text: "Semiconductor training: Batch 1 completes next week", category: "Strategic", time: "6h ago" },
  ];

  const getBadgeClass = (type) => {
    switch (type) {
      case "critical": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "warning": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "success": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      default: return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <div data-testid="ticker-bar" className="ticker-wrap bg-slate-900 py-1.5 overflow-hidden whitespace-nowrap">
      <div className="ticker-content inline-flex">
        {[...alerts, ...alerts].map((alert, idx) => (
          <div key={idx} className="ticker-item inline-flex items-center gap-1 px-3 flex-shrink-0">
            <Badge variant="outline" className={`${getBadgeClass(alert.type)} text-[9px] font-medium px-1.5 py-0.5 leading-none whitespace-nowrap`}>
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </Badge>
            <span className="text-white/90 text-[11px] whitespace-nowrap">{alert.text}</span>
            <span className="text-slate-400 text-[9px] whitespace-nowrap">{alert.category}</span>
            <span className="text-slate-500 text-[9px] whitespace-nowrap">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const menuItems = [
    { label: "Home", href: "#" },
    { label: "Dashboard", href: "#" },
    { label: "Data", href: "#" },
    { label: "Reports", href: "#" },
    { label: "About", href: "#" },
  ];

  return (
    <header data-testid="header" className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 h-16 max-w-full mx-auto">
          {/* Left: logo + text */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="logo-wow w-12 h-12 rounded-full bg-[#fef9e7] flex items-center justify-center border border-amber-200/80 flex-shrink-0">
              <Landmark className="w-6 h-6 text-amber-800" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 tracking-wide">IDDP</div>
              <div className="text-xs text-slate-700">Government of Maharashtra</div>
            </div>
          </div>

          {/* Center: title (true center between left and right) */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 tracking-tight font-['Outfit'] text-center whitespace-nowrap px-4">
            Integrated District Data Portal
          </h1>

          {/* Right: menu + button */}
          <div className="flex items-center justify-end gap-6 flex-wrap min-w-0">
            <nav className="flex items-center gap-5 sm:gap-6" aria-label="Main navigation">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link-wow text-sm font-medium text-slate-600 hover:text-blue-700 whitespace-nowrap"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button
              data-testid="switch-classic-btn"
              variant="outline"
              className="btn-wow border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-md flex-shrink-0"
            >
              SignIn/SignUp
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subValue, trend, trendType, isLive }) => {
  return (
    <Card data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`} className="card-hover-wow bg-white border-slate-200 h-full shadow-md rounded-xl">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</span>
          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
              <span className="text-xs font-medium text-emerald-600">LIVE</span>
            </div>
          )}
          {!isLive && trendType && (
            <Badge variant="outline" className={`text-xs ${trendType === 'positive' ? 'text-emerald-600 border-emerald-200' : 'text-slate-500 border-slate-200'}`}>
              {trendType === 'positive' ? 'T+0' : 'T+1'}
            </Badge>
          )}
        </div>
        <div className="text-3xl font-bold text-slate-900 font-['Outfit']">{value}</div>
        {subValue && <div className="text-sm text-slate-500 mt-1">{subValue}</div>}
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend > 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Hero Section Component  
const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1595123550441-d377e017de6a?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section data-testid="hero-section" className="hero-gradient py-12 md:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Layout: row1 = title | image; row2 = composite card | 4 tiles (same row height for alignment) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Row 1 left: title + description */}
          <div className="flex flex-col justify-center">
            <h2 className="hero-entrance hero-entrance-delay-0 text-4xl md:text-5xl font-bold text-slate-900 font-['Outfit'] tracking-tight leading-tight">
              Integrated District Data Portal
            </h2>
            <p className="hero-entrance hero-entrance-delay-1 mt-4 text-lg text-slate-600 leading-relaxed max-w-lg">
              A comprehensive monitoring and analytics platform designed for district collectors to track financial flows, economic indicators, and development initiatives.
            </p>
          </div>

          {/* Row 1 right: image */}
          <div className="hero-entrance hero-entrance-delay-2 relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/30">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Champion ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  currentImage === idx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImage === idx ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Row 2 left: composite score card - same row as 4 tiles for height alignment */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:col-span-2 lg:grid-rows-1 lg:contents">
            <Card data-testid="composite-score-card" className="hero-entrance hero-entrance-delay-3 composite-score-card flex flex-col h-full min-h-[220px] rounded-xl shadow-md overflow-hidden">
              <CardContent className="p-5 flex-1 flex flex-col justify-between min-h-0">
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-['Outfit']">Composite Score</h4>
                  <p className="text-sm text-slate-500 mt-0.5">September 2025</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-4xl font-bold text-blue-900 font-['Outfit']">77.03%</span>
                    <TrendingUp className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Y.S.R. District - Top Performer</p>
                  <div className="flex items-center gap-2 mt-5">
                    <span className="text-2xl font-bold text-blue-900 font-['Outfit']">41.01%</span>
                    <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Mohla-Manpur-Ambagarh Chowki - Recommendation and Action Items</p>
                </div>
                <div className="mt-5 flex justify-center">
                  <a href="#" className="text-sm font-medium text-blue-600 inline-flex items-center gap-1 hover:underline transition-colors duration-200">
                    Explore <ChevronRight className="link-arrow-wow w-4 h-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Row 2 right: 4 stat tiles - same row as composite so heights align */}
            <div className="hero-entrance hero-entrance-delay-4 grid grid-cols-2 gap-4 h-full min-h-0">
              <StatCard title="TOTAL DISTRICTS" value="33" subValue="100% Coverage" trendType="positive" />
              <StatCard title="ACTIVE SCHEMES" value="156" subValue="+12 this month" />
              <StatCard title="BENEFICIARIES" value="4.2M" trend={15.2} trendType="positive" />
              <StatCard title="COLLECTION RATE" value="94.7%" trend={3.1} isLive={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sector card color variants (health, education, agriculture, finance, infrastructure)
const SECTOR_VARIANTS = {
  health: { card: "bg-rose-50/90 border-rose-200 border-l-4 border-l-rose-500", label: "text-rose-700/90" },
  education: { card: "bg-blue-50/90 border-blue-200 border-l-4 border-l-blue-500", label: "text-blue-700/90" },
  agriculture: { card: "bg-emerald-50/90 border-emerald-200 border-l-4 border-l-emerald-500", label: "text-emerald-700/90" },
  finance: { card: "bg-amber-50/90 border-amber-200 border-l-4 border-l-amber-500", label: "text-amber-700/90" },
  infrastructure: { card: "bg-indigo-50/90 border-indigo-200 border-l-4 border-l-indigo-500", label: "text-indigo-700/90" },
};

const SectorCard = ({ icon: Icon, iconClass, title, topScore, topDistrict, bottomScore, bottomDistrict, topTrend, bottomTrend, compact }) => {
  const v = SECTOR_VARIANTS[iconClass] || SECTOR_VARIANTS.health;
  if (compact) {
    return (
      <Card data-testid={`sector-card-${title.toLowerCase().replace(/\s+/g, '-')}`} className={`sector-card border flex-1 min-h-0 flex ${v.card}`}>
        <CardContent className="p-2.5 flex flex-col justify-center w-full min-w-0">
          <div className="flex items-center justify-between gap-1.5 mb-0.5">
            <span className={`text-[10px] font-medium uppercase tracking-wider truncate ${v.label}`}>{title}</span>
            <div className={`icon-container ${iconClass} w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-3 h-3" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-slate-900 font-['Outfit'] leading-tight">{topScore}</span>
            {topTrend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate">{topDistrict}</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card data-testid={`sector-card-${title.toLowerCase().replace(/\s+/g, '-')}`} className={`sector-card border ${v.card}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${v.label}`}>{title}</span>
          <div className={`card-icon-wow icon-container ${iconClass} w-8 h-8 rounded-lg flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-slate-900 font-['Outfit']">{topScore}</span>
          {topTrend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className="text-sm text-slate-500 mt-1">{topDistrict}</div>
      </CardContent>
    </Card>
  );
};

// Mock sector data for a district (deterministic from district name; replace with API)
const getSectorDataForDistrict = (districtName) => {
  if (!districtName) return null;
  const seed = districtName.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const sectors = [
    { key: "health", icon: HeartPulse, iconClass: "health", title: "Health & Nutrition" },
    { key: "education", icon: GraduationCap, iconClass: "education", title: "Education" },
    { key: "agriculture", icon: Sprout, iconClass: "agriculture", title: "Agriculture & Water Resources" },
    { key: "finance", icon: Landmark, iconClass: "finance", title: "Financial Inclusion & Skill Development" },
    { key: "infrastructure", icon: Hammer, iconClass: "infrastructure", title: "Basic Infrastructure" },
  ];
  return sectors.map((s, i) => {
    const h = (seed + i * 31) % 100;
    const score = (55 + (h % 45)).toFixed(2) + "%";
    const trend = (seed + i) % 3 === 0 ? "down" : "up";
    return {
      ...s,
      topScore: score,
      topDistrict: districtName,
      topTrend: trend,
      bottomScore: "",
      bottomDistrict: "",
      bottomTrend: "up",
    };
  });
};

// State-level label when no district is hovered/selected
const STATE_LABEL = "Maharashtra (State)";

// Map + Sector Performance: map left (2/3), sector cards right (1/3). State data by default; district hover/select shows that district.
const MapAndSectorSection = () => {
  const [ref, visible] = useInView();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const displayDistrict = selectedDistrict || hoveredDistrict || STATE_LABEL;
  const sectorData = getSectorDataForDistrict(displayDistrict);

  const subtitleText = selectedDistrict
    ? `Showing data for ${selectedDistrict} (selected)`
    : hoveredDistrict
      ? `Showing data for ${hoveredDistrict} (hover)`
      : `Showing data for ${STATE_LABEL}`;

  return (
    <section ref={ref} data-testid="map-and-sector-section" className={`py-12 bg-slate-50 transition-all duration-700 ${visible ? 'reveal reveal-visible' : 'reveal'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-['Outfit']">Sector Performance</h2>
            <p className="text-slate-600 mt-1">{subtitleText}</p>
          </div>
          <Badge data-testid="live-indicator" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <Activity className="w-3 h-3 mr-1" /> Live Data
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 h-[640px] min-h-[400px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
            <MaharashtraMapSection
              embedded
              selectedDistrict={selectedDistrict}
              hoveredDistrict={hoveredDistrict}
              onDistrictHover={setHoveredDistrict}
              onDistrictSelect={(d) => setSelectedDistrict((prev) => (prev === d ? null : d))}
            />
          </div>
          <div className="flex flex-col gap-2 h-[640px] min-h-[400px]">
            {sectorData.map((sector, idx) => (
              <div key={idx} className="reveal-item flex-1 min-h-0">
                <SectorCard {...sector} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sectors Grid Section (standalone, used elsewhere if needed)
const SectorsSection = () => {
  const sectors = [
    {
      icon: HeartPulse,
      iconClass: "health",
      title: "Health & Nutrition",
      topScore: "94.96%",
      topDistrict: "Virudhunagar",
      topTrend: "up",
      bottomScore: "62.32%",
      bottomDistrict: "Udalguri",
      bottomTrend: "down",
    },
    {
      icon: GraduationCap,
      iconClass: "education",
      title: "Education",
      topScore: "100.0%",
      topDistrict: "Chhatarpur",
      topTrend: "up",
      bottomScore: "42.86%",
      bottomDistrict: "Mohla-Manpur-Ambagarh Chowki",
      bottomTrend: "down",
    },
    {
      icon: Sprout,
      iconClass: "agriculture",
      title: "Agriculture & Water Resources",
      topScore: "60.44%",
      topDistrict: "Y.S.R.",
      topTrend: "up",
      bottomScore: "0.47%",
      bottomDistrict: "Mohla-Manpur-Ambagarh Chowki",
      bottomTrend: "down",
    },
    {
      icon: Landmark,
      iconClass: "finance",
      title: "Financial Inclusion & Skill Development",
      topScore: "46.91%",
      topDistrict: "Barpeta",
      topTrend: "up",
      bottomScore: "13.13%",
      bottomDistrict: "Soreng",
      bottomTrend: "down",
    },
    {
      icon: Hammer,
      iconClass: "infrastructure",
      title: "Basic Infrastructure",
      topScore: "100.0%",
      topDistrict: "Chandauli",
      topTrend: "up",
      bottomScore: "21.68%",
      bottomDistrict: "Alluri Sitharama Raju",
      bottomTrend: "down",
    },
  ];

  return (
    <section data-testid="sectors-section" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-['Outfit']">Sector Performance</h2>
            <p className="text-slate-600 mt-1">Real-time tracking across key development indicators</p>
          </div>
          <Badge data-testid="live-indicator" className="bg-emerald-100 text-emerald-700 border-emerald-200">
            <Activity className="w-3 h-3 mr-1" /> Live Data
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((sector, idx) => (
            <SectorCard key={idx} {...sector} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Dashboard Module Card – professional color variants
const MODULE_VARIANTS = {
  finance: { card: "bg-amber-50/80 border-amber-200 border-l-4 border-l-amber-500", icon: "bg-amber-100 text-amber-700", label: "text-amber-700/90" },
  economic: { card: "bg-blue-50/80 border-blue-200 border-l-4 border-l-blue-500", icon: "bg-blue-100 text-blue-700", label: "text-blue-700/90" },
  sector: { card: "bg-emerald-50/80 border-emerald-200 border-l-4 border-l-emerald-500", icon: "bg-emerald-100 text-emerald-700", label: "text-emerald-700/90" },
  kpi: { card: "bg-violet-50/80 border-violet-200 border-l-4 border-l-violet-500", icon: "bg-violet-100 text-violet-700", label: "text-violet-700/90" },
  aspirational: { card: "bg-indigo-50/80 border-indigo-200 border-l-4 border-l-indigo-500", icon: "bg-indigo-100 text-indigo-700", label: "text-indigo-700/90" },
  schemes: { card: "bg-rose-50/80 border-rose-200 border-l-4 border-l-rose-500", icon: "bg-rose-100 text-rose-700", label: "text-rose-700/90" },
  strategic: { card: "bg-sky-50/80 border-sky-200 border-l-4 border-l-sky-500", icon: "bg-sky-100 text-sky-700", label: "text-sky-700/90" },
  district: { card: "bg-teal-50/80 border-teal-200 border-l-4 border-l-teal-500", icon: "bg-teal-100 text-teal-700", label: "text-teal-700/90" },
};

const ModuleCard = ({ icon: Icon, title, subtitle, metric, variant = "economic" }) => {
  const v = MODULE_VARIANTS[variant] || MODULE_VARIANTS.economic;
  return (
    <Card data-testid={`module-card-${title.toLowerCase().replace(/\s+/g, '-')}`} className={`card-hover-wow border ${v.card}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium uppercase tracking-wider ${v.label}`}>{title}</span>
          <div className={`card-icon-wow w-8 h-8 rounded-lg flex items-center justify-center ${v.icon}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className="text-right font-bold text-slate-900 font-['Outfit']" style={{ fontSize: '1.0rem' }}>{metric}</div>
        <div className="text-sm text-slate-500 mt-1 text-right">{subtitle}</div>
      </CardContent>
    </Card>
  );
};

// Dashboard Modules Section
const ModulesSection = () => {
  const [ref, visible] = useInView();
  const modules = [
    { icon: Landmark, title: "Finance Flow", subtitle: "Revenue, expenditure & fiscal health", metric: "₹1,247B Tracked", variant: "finance" },
    { icon: LineChart, title: "Economic Growth", subtitle: "GSDP, Macro & Micro indicators", metric: "847 Metrics", variant: "economic" },
    { icon: BarChart3, title: "Sectorial Data", subtitle: "WCD, Agriculture, Education, Health", metric: "2.4M Beneficiaries", variant: "sector" },
    { icon: Target, title: "Sub Sector Performance", subtitle: "Granular performance tracking", metric: "156 KPIs", variant: "kpi" },
    { icon: Map, title: "Aspirational Districts", subtitle: "SDG-aligned block monitoring", metric: "17 SDGs Tracked", variant: "aspirational" },
    { icon: FileText, title: "Key Schemes", subtitle: "Priority schemes watchlist", metric: "5 Active", variant: "schemes" },
    { icon: Database, title: "Strategic Plan", subtitle: "District vision & ecosystem", metric: "12 Projects", variant: "strategic" },
    { icon: Activity, title: "District Dev Index", subtitle: "Comparative district analysis", metric: "33 Districts", variant: "district" },
  ];

  return (
    <section ref={ref} data-testid="modules-section" className={`py-12 bg-white transition-all duration-700 ${visible ? 'reveal reveal-visible' : 'reveal'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 font-['Outfit']">Dashboard Modules</h2>
          <p className="text-slate-600 mt-1">Comprehensive analytics across all governance dimensions</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module, idx) => (
            <ModuleCard key={idx} {...module} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Actions Section - Recommendation and Action Items (alignment and style per reference)
const ActionsSection = () => {
  const [ref, visible] = useInView();
  const actions = [
    { type: "critical", title: "Fund Exhaustion Predicted", description: "Health dept by May 15 at current pace", tag: "Critical" },
    { type: "warning", title: "ToT Closing Soon", description: "45 participants pending certification", tag: "Warning" },
    { type: "info", title: "Collection Started", description: "Q4 collection active in 12 districts", tag: "Info" },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "critical": return AlertCircle;
      case "warning": return Clock;
      default: return Info;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case "critical": return "bg-red-500 text-white";
      case "warning": return "bg-amber-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  const getTagClass = (type) => {
    switch (type) {
      case "critical": return "bg-red-500 text-white text-xs font-medium";
      case "warning": return "bg-amber-500 text-white text-xs font-medium";
      default: return "bg-blue-500 text-white text-xs font-medium";
    }
  };

  return (
    <section ref={ref} data-testid="actions-section" className={`py-8 bg-slate-50 border-y border-slate-200 transition-all duration-700 ${visible ? 'reveal reveal-visible' : 'reveal'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="reveal-heading text-lg font-semibold text-slate-800 mb-6 font-['Outfit']">Recommendation and Action Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {actions.map((action, idx) => {
            const Icon = getIcon(action.type);
            return (
              <Card key={idx} data-testid={`action-card-${idx}`} className="reveal-item card-hover-wow bg-white border-slate-200 shadow-md rounded-xl overflow-hidden">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconBg(action.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-900 font-['Outfit']">{action.title}</span>
                    <span className="text-xs text-slate-600">{action.description}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-md flex-shrink-0 ${getTagClass(action.type)}`}>{action.tag}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const [ref, visible] = useInView({ threshold: 0.1 });
  return (
    <footer ref={ref} data-testid="footer" className={`bg-slate-900 text-white py-8 border-t border-slate-700/50 relative overflow-hidden transition-all duration-700 ${visible ? 'footer-reveal footer-reveal-visible' : 'footer-reveal'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></div>
              <span className="text-sm font-medium text-emerald-400">All systems operational</span>
            </div>
            <div className="text-sm text-slate-400 transition-colors duration-200">
              Last Synced: <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Data Sources:</span>
            {['BEAMS', 'iPAS', 'PFMS'].map((source) => (
              <Badge key={source} variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 transition-transform duration-200 hover:scale-105">
                {source}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-500 transition-opacity duration-200">
            © {new Date().getFullYear()} IDDP, Government of Maharashtra. Integrated District Data Portal.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div data-testid="landing-page" className="min-h-screen bg-slate-900 flex flex-col">
      <Ticker />
      <Header />
      <main className="flex-1 bg-slate-50">
        <HeroSection />
        <ActionsSection />
        <ModulesSection />
        <MapAndSectorSection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
