import { useMemo, useState, useEffect } from "react";
import { useFetcher, useSearchParams } from "react-router";
import { displayName } from "../Utilities/formatName";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ITEMS_PER_PAGE = 25;

/* ---------------- GAS PRICE & DISTANCE UTILITIES ---------------- */

const STATE_GAS_PRICES: Record<string, number> = {
  'Alabama': 3.15, 'Alaska': 3.85, 'Arizona': 3.65, 'Arkansas': 3.10,
  'California': 4.95, 'Colorado': 3.45, 'Connecticut': 3.75, 'Delaware': 3.55,
  'Florida': 3.35, 'Georgia': 3.20, 'Hawaii': 4.85, 'Idaho': 3.60,
  'Illinois': 3.80, 'Indiana': 3.50, 'Iowa': 3.25, 'Kansas': 3.20,
  'Kentucky': 3.25, 'Louisiana': 3.15, 'Maine': 3.65, 'Maryland': 3.60,
  'Massachusetts': 3.70, 'Michigan': 3.55, 'Minnesota': 3.30, 'Mississippi': 3.10,
  'Missouri': 3.20, 'Montana': 3.50, 'Nebraska': 3.25, 'Nevada': 4.10,
  'New Hampshire': 3.60, 'New Jersey': 3.65, 'New Mexico': 3.40, 'New York': 3.80,
  'North Carolina': 3.30, 'North Dakota': 3.35, 'Ohio': 3.45, 'Oklahoma': 3.15,
  'Oregon': 4.20, 'Pennsylvania': 3.75, 'Rhode Island': 3.70, 'South Carolina': 3.20,
  'South Dakota': 3.35, 'Tennessee': 3.20, 'Texas': 3.15, 'Utah': 3.75,
  'Vermont': 3.70, 'Virginia': 3.45, 'Washington': 4.30, 'West Virginia': 3.40,
  'Wisconsin': 3.35, 'Wyoming': 3.50,
};

function getGasPriceByState(state: string): number {
  return STATE_GAS_PRICES[state] || 3.50;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateGasCost(distance: number, gasPrice: number, mpg: number = 25): number {
  return (distance / mpg) * gasPrice;
}

function calculateCarpoolSavings(distance: number, gasPrice: number, passengers: number = 2, mpg: number = 25): number {
  const soloCost = calculateGasCost(distance, gasPrice, mpg);
  const sharedCost = soloCost / passengers;
  return soloCost - sharedCost;
}

/* ---------------- TYPES ---------------- */

interface Ride {
  id: string;
  status: string;
  createdAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  droppedOffAt?: string;
  cancelledAt?: string;
  user?: { id: string; firstName: string; lastName: string };
  driver?: { id: string; firstName: string; lastName: string };
  pickup?: { id: string; name: string; latitude: number; longitude: number };
  dropoff?: { id: string; name: string; latitude: number; longitude: number };
  base?: { name: string; state: string; lat: number; long: number };
}

/* ---------------- ENHANCED METRICS WITH MONEY SAVINGS ---------------- */

function useRideMetrics(rides: Ride[]) {
  return useMemo(() => {
    const completed = rides.filter(r => r.droppedOffAt);
    const cancelled = rides.filter(r => r.cancelledAt);
    const accepted = rides.filter(r => r.acceptedAt);
    const pickedUp = rides.filter(r => r.pickedUpAt);
    const noDriver = rides.filter(r => !r.driver);
    const pending = rides.filter(r => !r.acceptedAt && !r.cancelledAt);
    const inProgress = rides.filter(r => r.acceptedAt && !r.droppedOffAt && !r.cancelledAt);

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    // Timing metrics
    const avgAccept = avg(
      accepted.map(r =>
        new Date(r.acceptedAt!).getTime() - new Date(r.createdAt).getTime()
      )
    ) / 1000;

    const avgPickupDelay = avg(
      pickedUp.map(r =>
        new Date(r.pickedUpAt!).getTime() - new Date(r.acceptedAt!).getTime()
      )
    ) / 60000;

    const avgRideDuration = avg(
      completed.map(r =>
        new Date(r.droppedOffAt!).getTime() - new Date(r.pickedUpAt!).getTime()
      )
    ) / 60000;

    const avgWaitTime = avg(
      pickedUp.map(r =>
        new Date(r.pickedUpAt!).getTime() - new Date(r.createdAt).getTime()
      )
    ) / 60000;

    const onTimePickups = pickedUp.filter(r => {
      const delay = (new Date(r.pickedUpAt!).getTime() - new Date(r.acceptedAt!).getTime()) / 60000;
      return delay <= 15;
    }).length;
    const onTimeRate = pickedUp.length > 0 ? (onTimePickups / pickedUp.length) * 100 : 0;

    // Driver metrics
    const uniqueDrivers = new Set(rides.filter(r => r.driver?.id).map(r => r.driver!.id));
    const activeDrivers = uniqueDrivers.size;
    const driverAcceptanceRate = rides.length > 0 ? (accepted.length / rides.length) * 100 : 0;

    // User engagement
    const userRideCounts = rides.reduce((acc, ride) => {
      const userId = ride.user?.id;
      if (userId) acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueUsers = Object.keys(userRideCounts).length;
    const repeatUsers = Object.values(userRideCounts).filter(count => count > 1).length;
    const repeatUserRate = uniqueUsers > 0 ? (repeatUsers / uniqueUsers) * 100 : 0;
    const avgRidesPerUser = uniqueUsers > 0 ? rides.length / uniqueUsers : 0;

    // Peak time analysis
    const ridesByHour = rides.reduce((acc, ride) => {
      const hour = new Date(ride.createdAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const peakHourData = Object.entries(ridesByHour).sort(([,a], [,b]) => b - a)[0];
    const peakHour = peakHourData ? parseInt(peakHourData[0]) : 0;
    const peakHourRides = peakHourData ? peakHourData[1] : 0;

    const totalRideHours = rides.reduce((sum, ride) => {
      return sum + new Date(ride.createdAt).getHours();
    }, 0);
    const avgUsageHour = rides.length > 0 ? Math.round(totalRideHours / rides.length) : 0;

    // MONEY METRICS - Calculate distances and costs
    const ridesWithDistance = completed.filter(r => 
      r.pickup?.latitude && r.pickup?.longitude && 
      r.dropoff?.latitude && r.dropoff?.longitude &&
      r.base?.state
    ).map(ride => {
      const distance = calculateDistance(
        ride.pickup!.latitude,
        ride.pickup!.longitude,
        ride.dropoff!.latitude,
        ride.dropoff!.longitude
      );
      const gasPrice = getGasPriceByState(ride.base!.state);
      const gasCost = calculateGasCost(distance, gasPrice);
      const carpoolSavings = calculateCarpoolSavings(distance, gasPrice);
      
      return {
        ...ride,
        distance,
        gasPrice,
        gasCost,
        carpoolSavings,
      };
    });

    // Total savings
    const totalDistance = ridesWithDistance.reduce((sum, r) => sum + r.distance, 0);
    const totalGasCost = ridesWithDistance.reduce((sum, r) => sum + r.gasCost, 0);
    const totalCarpoolSavings = ridesWithDistance.reduce((sum, r) => sum + r.carpoolSavings, 0);
    const avgDistance = ridesWithDistance.length > 0 ? totalDistance / ridesWithDistance.length : 0;
    const avgGasCost = ridesWithDistance.length > 0 ? totalGasCost / ridesWithDistance.length : 0;
    const avgCarpoolSavings = ridesWithDistance.length > 0 ? totalCarpoolSavings / ridesWithDistance.length : 0;

    // Savings by state
    const savingsByState = ridesWithDistance.reduce((acc, ride) => {
      const state = ride.base!.state;
      if (!acc[state]) {
        acc[state] = { 
          state, 
          totalSavings: 0, 
          rides: 0, 
          totalDistance: 0,
          gasPrice: ride.gasPrice 
        };
      }
      acc[state].totalSavings += ride.carpoolSavings;
      acc[state].rides += 1;
      acc[state].totalDistance += ride.distance;
      return acc;
    }, {} as Record<string, { state: string; totalSavings: number; rides: number; totalDistance: number; gasPrice: number }>);

    const topSavingsStates = Object.values(savingsByState)
      .sort((a, b) => b.totalSavings - a.totalSavings)
      .slice(0, 5);

    // Savings by base
    const savingsByBase = ridesWithDistance.reduce((acc, ride) => {
      const baseName = ride.base!.name;
      if (!acc[baseName]) {
        acc[baseName] = { 
          base: baseName, 
          state: ride.base!.state,
          totalSavings: 0, 
          rides: 0,
          totalDistance: 0 
        };
      }
      acc[baseName].totalSavings += ride.carpoolSavings;
      acc[baseName].rides += 1;
      acc[baseName].totalDistance += ride.distance;
      return acc;
    }, {} as Record<string, { base: string; state: string; totalSavings: number; rides: number; totalDistance: number }>);

    const topSavingsBases = Object.values(savingsByBase)
      .sort((a, b) => b.totalSavings - a.totalSavings)
      .slice(0, 5);

    const mostActiveBase = Object.values(savingsByBase)
      .sort((a, b) => b.rides - a.rides)[0];

    // Environmental impact (CO2 savings)
    const CO2_PER_GALLON = 19.6; // lbs of CO2 per gallon of gas
    const gallonsSaved = totalDistance / 25; // Assuming 25 MPG
    const co2Saved = gallonsSaved * CO2_PER_GALLON;

    // Day of week distribution
    const ridesByDay = rides.reduce((acc, ride) => {
      const day = new Date(ride.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Trend data
    const dailyTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayRides = rides.filter(r => {
        const rideDate = new Date(r.createdAt);
        return rideDate.toDateString() === date.toDateString();
      });
      const count = dayRides.length;
      
      // Calculate savings for this day
      const daySavings = dayRides
        .filter(r => r.pickup?.latitude && r.dropoff?.latitude && r.base?.state)
        .reduce((sum, r) => {
          const distance = calculateDistance(
            r.pickup!.latitude, r.pickup!.longitude,
            r.dropoff!.latitude, r.dropoff!.longitude
          );
          const gasPrice = getGasPriceByState(r.base!.state);
          return sum + calculateCarpoolSavings(distance, gasPrice);
        }, 0);
      
      return { name: dateStr, rides: count, savings: daySavings };
    });

    const weeklyTrend = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + (3 - i) * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const count = rides.filter(r => {
        const rideDate = new Date(r.createdAt);
        return rideDate >= weekStart && rideDate <= weekEnd;
      }).length;
      
      return { name: `Week ${4 - i}`, rides: count };
    });

    const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthStr = date.toLocaleDateString('en-US', { month: 'short' });
      const count = rides.filter(r => {
        const rideDate = new Date(r.createdAt);
        return rideDate.getMonth() === date.getMonth() && 
               rideDate.getFullYear() === date.getFullYear();
      }).length;
      return { name: monthStr, rides: count };
    });

    const yearsSet = new Set(rides.map(r => new Date(r.createdAt).getFullYear()));
    const years = Array.from(yearsSet).sort();
    const yearlyTrend = years.map(year => {
      const count = rides.filter(r => new Date(r.createdAt).getFullYear() === year).length;
      return { name: year.toString(), rides: count };
    });

    // Popular locations
    const popularPickups = rides.reduce((acc, ride) => {
      const location = ride.pickup?.name;
      if (location) acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPickups = Object.entries(popularPickups)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    const popularDropoffs = rides.reduce((acc, ride) => {
      const location = ride.dropoff?.name;
      if (location) acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topDropoffs = Object.entries(popularDropoffs)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      total: rides.length,
      completed: completed.length,
      cancelled: cancelled.length,
      pending: pending.length,
      inProgress: inProgress.length,
      active: inProgress.length,
      completionRate: rides.length ? (completed.length / rides.length) * 100 : 0,
      cancellationRate: rides.length ? (cancelled.length / rides.length) * 100 : 0,
      noDriverRate: rides.length ? (noDriver.length / rides.length) * 100 : 0,
      avgAccept,
      avgPickupDelay,
      avgRideDuration,
      avgWaitTime,
      onTimeRate,
      activeDrivers,
      driverAcceptanceRate,
      uniqueUsers,
      repeatUsers,
      repeatUserRate,
      avgRidesPerUser,
      peakHour,
      peakHourRides,
      avgUsageHour,
      ridesByDay,
      ridesByHour,
      dailyTrend,
      weeklyTrend,
      monthlyTrend,
      yearlyTrend,
      topPickups,
      topDropoffs,
      // Money metrics
      totalDistance,
      avgDistance,
      totalGasCost,
      avgGasCost,
      totalCarpoolSavings,
      avgCarpoolSavings,
      topSavingsStates,
      topSavingsBases,
      mostActiveBase,
      co2Saved,
    };
  }, [rides]);
}

/* ---------------- CSV ---------------- */

function ridesToCSV(rides: Ride[]) {
  const headers = ["ID", "Passenger", "Driver", "Pickup", "Dropoff", "Status", "Base", "State", "Created", "Completed"];
  const rows = rides.map((r: any) => [
    r.id,
    displayName(r.user?.firstName, r.user?.lastName),
    r.driver ? displayName(r.driver.firstName, r.driver.lastName) : "No Driver",
    r.pickup?.name || "",
    r.dropoff?.name || "",
    r.status,
    r.base?.name || "",
    r.base?.state || "",
    new Date(r.createdAt).toLocaleString(),
    r.droppedOffAt ? new Date(r.droppedOffAt).toLocaleString() : "",
  ]);
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [headers, ...rows].map(r => r.map(esc).join(",")).join("\n");
}

/* ---------------- STAT CARD ---------------- */

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  trend?: { value: number; positive: boolean };
  isMoney?: boolean;
}

function StatCard({ label, value, sublabel, trend, isMoney }: StatCardProps) {
  const displayValue = isMoney && typeof value === 'number' 
    ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
          <p className="text-2xl md:text-3xl font-semibold text-gray-900 mt-2 truncate">{displayValue}</p>
          {sublabel && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">{sublabel}</p>
          )}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.positive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    Completed: { bg: "bg-green-50", text: "text-green-700" },
    Cancelled: { bg: "bg-red-50", text: "text-red-700" },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700" },
    Pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
    default: { bg: "bg-gray-50", text: "text-gray-700" },
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

/* ---------------- CUSTOM TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-sm text-gray-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ---------------- MAIN PAGE ---------------- */

export default function AdminRidesPage({ rides, allDriversCount, activeDrivers, totalCount, totalPages, currentPage }: any) {
  const metrics = useRideMetrics(rides);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [trendView, setTrendView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.rides) {
      const blob = new Blob([ridesToCSV(fetcher.data.rides)], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rides-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [fetcher.data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    searchInput ? p.set("search", searchInput) : p.delete("search");
    p.set("page", "1");
    setSearchParams(p);
  };

  const changePage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", p.toString());
    setSearchParams(params);
  };

  // Chart data
  const statusData = [
    { name: "Completed", value: metrics.completed, fill: "#10b981" },
    { name: "In Progress", value: metrics.inProgress, fill: "#3b82f6" },
    { name: "Pending", value: metrics.pending, fill: "#f59e0b" },
    { name: "Cancelled", value: metrics.cancelled, fill: "#ef4444" },
  ].filter(item => item.value > 0);

  const performanceData = [
    { name: "Accept Time", value: Number(metrics.avgAccept.toFixed(1)), unit: "sec" },
    { name: "Pickup Delay", value: Number(metrics.avgPickupDelay.toFixed(1)), unit: "min" },
    { name: "Ride Duration", value: Number(metrics.avgRideDuration.toFixed(1)), unit: "min" },
  ];

  const waitTimeData = [
    { name: "Total Wait", value: Number(metrics.avgWaitTime.toFixed(1)) },
    { name: "Accept", value: Number((metrics.avgAccept / 60).toFixed(1)) },
    { name: "Pickup", value: Number(metrics.avgPickupDelay.toFixed(1)) },
  ];

  const topPickupsData = metrics.topPickups.map(([location, count]) => ({
    name: location.length > 25 ? location.substring(0, 25) + '...' : location,
    value: count
  }));

  const topDropoffsData = metrics.topDropoffs.map(([location, count]) => ({
    name: location.length > 25 ? location.substring(0, 25) + '...' : location,
    value: count
  }));

  const successMetrics = [
    { name: "Completion", value: metrics.completionRate, fill: "#10b981" },
    { name: "Acceptance", value: metrics.driverAcceptanceRate, fill: "#3b82f6" },
    { name: "On-Time", value: metrics.onTimeRate, fill: "#8b5cf6" },
    { name: "Repeat Users", value: metrics.repeatUserRate, fill: "#f59e0b" },
  ];

  const topSavingsBasesData = metrics.topSavingsBases.map(base => ({
    name: base.base.length > 20 ? base.base.substring(0, 20) + '...' : base.base,
    value: Number(base.totalSavings.toFixed(0))
  }));

  const topSavingsStatesData = metrics.topSavingsStates.map(state => ({
    name: state.state,
    value: Number(state.totalSavings.toFixed(0)),
    rides: state.rides
  }));

  const getTrendData = () => {
    switch (trendView) {
      case 'daily':
        return metrics.dailyTrend;
      case 'weekly':
        return metrics.weeklyTrend;
      case 'monthly':
        return metrics.monthlyTrend;
      case 'yearly':
        return metrics.yearlyTrend;
      default:
        return metrics.dailyTrend;
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ride Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Real-time operational metrics and cost savings insights</p>
          </div>
          <button
            onClick={() => fetcher.submit({}, { method: "post" })}
            disabled={fetcher.state === "submitting"}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium self-start sm:self-auto"
          >
            {fetcher.state === "submitting" ? "Exporting..." : "Export Data"}
          </button>
        </div>

        {/* MONEY SAVINGS METRICS - HERO SECTION */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Cost Savings Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Savings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${metrics.totalCarpoolSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">Through carpooling</p>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Avg Savings Per Ride</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${metrics.avgCarpoolSavings.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Per passenger</p>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Miles Traveled</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {metrics.totalDistance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-500 mt-1">{metrics.avgDistance.toFixed(1)} avg per ride</p>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">CO₂ Reduced</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {(metrics.co2Saved / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-gray-500 mt-1">lbs of CO₂</p>
            </div>
          </div>
        </div>

        {/* MOST ACTIVE BASE */}
        {metrics.mostActiveBase && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Most Active Base</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{metrics.mostActiveBase.base}</p>
                <p className="text-sm text-gray-600 mt-1">{metrics.mostActiveBase.state}</p>
              </div>
              <div className="flex gap-6 sm:gap-8">
                <div className="sm:text-right">
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">{metrics.mostActiveBase.rides}</p>
                  <p className="text-sm text-gray-600 mt-1">rides completed</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                    ${metrics.mostActiveBase.totalSavings.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">total savings</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KEY METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Rides" 
            value={metrics.total.toLocaleString()}
            sublabel="All time"
          />
          <StatCard 
            label="Completed" 
            value={metrics.completed.toLocaleString()}
            sublabel={`${metrics.completionRate.toFixed(1)}% completion rate`}
          />
          <StatCard 
            label="In Progress" 
            value={metrics.inProgress.toLocaleString()}
            sublabel="Currently active"
          />
          <StatCard 
            label="Pending" 
            value={metrics.pending.toLocaleString()}
            sublabel="Awaiting assignment"
          />
        </div>

        {/* USER & DRIVER METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <p className="text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wide">Active Drivers</p>
            <p className="text-2xl md:text-3xl font-semibold text-gray-900 mt-2">{allDriversCount.toLocaleString()}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Providing rides</p>
            {activeDrivers?.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3">
                {activeDrivers.map((driver: any) => (
                  <li key={driver.id} className="text-xs text-gray-700 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                    {displayName(driver.firstName, driver.lastName)}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <StatCard 
            label="Unique Users" 
            value={metrics.uniqueUsers.toLocaleString()}
            sublabel={`${metrics.avgRidesPerUser.toFixed(1)} rides per user`}
          />
          <StatCard 
            label="Peak Hour" 
            value={formatHour(metrics.peakHour)}
            sublabel={`${metrics.peakHourRides} rides`}
          />
          <StatCard 
            label="Avg Usage Hour" 
            value={formatHour(metrics.avgUsageHour)}
            sublabel="Typical ride time"
          />
        </div>

        {/* SAVINGS BY BASE & STATE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TOP SAVINGS BASES */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">💵 Top Bases by Savings</h3>
            {topSavingsBasesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSavingsBasesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    width={120}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
                            <p className="text-sm text-green-600">${payload[0].value} saved</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No savings data available
              </div>
            )}
          </div>

          {/* TOP SAVINGS STATES */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">🗺️ Top States by Savings</h3>
            {topSavingsStatesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSavingsStatesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    width={100}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg">
                            <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
                            <p className="text-sm text-green-600">${payload[0].value} saved</p>
                            <p className="text-sm text-gray-600">{payload[0].payload.rides} rides</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No savings data available
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* STATUS DISTRIBUTION */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PERFORMANCE METRICS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Average Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg">
                          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
                          <p className="text-sm text-gray-600">
                            {payload[0].value} {payload[0].payload.unit}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* SUCCESS METRICS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Success Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {successMetrics.map((metric, index) => (
                <div key={index}>
                  <ResponsiveContainer width="100%" height={90}>
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="60%" 
                      outerRadius="100%" 
                      data={[metric]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-2">
                    <p className="text-xl font-bold text-gray-900">{metric.value.toFixed(1)}%</p>
                    <p className="text-xs text-gray-600">{metric.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TREND ANALYSIS WITH TABS */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ride Trends</h3>
            <div className="flex gap-1 sm:gap-2">
              {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setTrendView(view)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    trendView === view
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTrendData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="rides" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* WAIT TIME BREAKDOWN */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Time Breakdown (minutes)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={waitTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                stroke="#e5e7eb"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-lg">
                        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
                        <p className="text-sm text-gray-600">{payload[0].value} min</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* POPULAR LOCATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TOP PICKUPS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Pickup Locations</h3>
            {topPickupsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPickupsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>

          {/* TOP DROPOFFS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Dropoff Locations</h3>
            {topDropoffsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topDropoffsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#e5e7eb"
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by passenger or driver name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* DATA TABLE - Desktop */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Passenger
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Dropoff
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Base
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rides.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No rides found
                    </td>
                  </tr>
                ) : (
                  rides.map((ride: Ride) => (
                    <tr key={ride.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {displayName(ride.user?.firstName, ride.user?.lastName)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ride.pickup?.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ride.dropoff?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {ride.driver ? (
                          <span className="text-sm font-medium text-gray-900">
                            {displayName(ride.driver.firstName, ride.driver.lastName)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{ride.base?.name || "—"}</div>
                        <div className="text-xs text-gray-500">{ride.base?.state || ""}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={ride.status} />
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(ride.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DATA CARDS - Mobile */}
        <div className="md:hidden space-y-3">
          {rides.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-12 text-center text-gray-500">
              No rides found
            </div>
          ) : (
            rides.map((ride: Ride) => (
              <div key={ride.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {displayName(ride.user?.firstName, ride.user?.lastName)}
                  </span>
                  <StatusBadge status={ride.status} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Pickup</p>
                    <p className="text-gray-900">{ride.pickup?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Dropoff</p>
                    <p className="text-gray-900">{ride.dropoff?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Driver</p>
                    <p className="text-gray-900">
                      {ride.driver
                        ? displayName(ride.driver.firstName, ride.driver.lastName)
                        : "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                    <p className="text-gray-900">
                      {new Date(ride.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                {ride.base?.name && (
                  <p className="text-xs text-gray-500">{ride.base.name}{ride.base.state ? `, ${ride.base.state}` : ""}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 px-4 sm:px-6 py-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span>–
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of{" "}
              <span className="font-medium">{totalCount}</span> results
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Previous
              </button>

              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => changePage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <span className="sm:hidden flex items-center px-2 text-sm text-gray-700 font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}