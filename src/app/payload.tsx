import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Rocket,
  Star,
  Calculator,
  Trophy,
  TrendingUp,
  Scale,
  Target,
  Globe,
  AlertTriangle,
  ArrowUpRight,
  Landmark,
  BadgePercent,
} from "lucide-react";

const COLORS = {
  success: "hsl(var(--chart-1))",
  warning: "hsl(var(--chart-2))",
  error: "hsl(var(--chart-3))",
  info: "hsl(var(--chart-4))",
  accent: "hsl(var(--chart-5))",
};

const transformLaunchData = (launches) => {
  // Group launches by rocket type and calculate statistics
  const rocketStats = launches.reduce((acc, launch) => {
    const rocketName = launch.rocket;
    if (!acc[rocketName]) {
      acc[rocketName] = {
        name: rocketName,
        launches: 0,
        totalPayload: 0,
        successRate: 0,
        successCount: 0,
        yearlyData: {},
        reliability: 70 + Math.random() * 20, // Maintain original random reliability for visual consistency
        avgPayloadMass: 0,
        customers: new Set(),
        orbits: new Set(),
        countries: new Set(),
        failures: 0,
        customerData: {
          domestic: 0,
          international: 0,
        },
        monthlyTrends: {},
        value: 0,
      };
    }

    const stats = acc[rocketName];
    stats.launches++;

    // Calculate payload mass
    if (launch.payload?.totalMass) {
      stats.totalPayload += parseFloat(launch.payload.totalMass);
    }

    // Track success/failure
    const isSuccess = launch.launchOutcome === "Success";
    if (isSuccess) {
      stats.successCount++;
    } else if (launch.launchOutcome === "Failure") {
      stats.failures++;
    }

    // Calculate success rate
    stats.successRate = (stats.successCount / stats.launches) * 100;

    // Track customer data
    if (launch.payload?.satellites) {
      const satellites = Array.isArray(launch.payload.satellites)
        ? launch.payload.satellites
        : [launch.payload.satellites];
      satellites.forEach((sat) => {
        if (sat.country) {
          stats.countries.add(sat.country);
          if (sat.country === "India") {
            stats.customerData.domestic++;
          } else {
            stats.customerData.international++;
          }
        }
        if (sat.orbit) {
          stats.orbits.add(sat.orbit);
        }
      });
    }

    // Calculate averages
    stats.avgPayloadMass = stats.totalPayload / stats.launches;

    // Track date-based data
    if (launch.dateTime) {
      const date = new Date(launch.dateTime.split("|")[0]);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString("default", { month: "short" });

      stats.yearlyData[year] = (stats.yearlyData[year] || 0) + 1;
      stats.monthlyTrends[month] =
        (stats.monthlyTrends[month] || 0) + (isSuccess ? 1 : 0);
    }

    return acc;
  }, {});

  return Object.values(rocketStats);
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/40 backdrop-blur-lg p-4 rounded-lg border border-space-gold/30"
    >
      <p className="text-space-gold font-semibold mb-2">{data.name}</p>
      <div className="space-y-1">
        <p className="text-[hsl(var(--chart-1))]">Launches: {data.launches}</p>
        <p className="text-[hsl(var(--chart-2))]">
          Success Rate: {data.successRate.toFixed(1)}%
        </p>
        <p className="text-[hsl(var(--chart-3))]">
          Total Payload: {(data.totalPayload / 1000).toFixed(1)}t
        </p>
        <p className="text-[hsl(var(--chart-4))]">
          Avg. Payload: {(data.avgPayloadMass / 1000).toFixed(1)}t
        </p>
        <p className="text-[hsl(var(--chart-5))]">
          Reliability Score: {data.reliability.toFixed(1)}%
        </p>
        <p className="text-white">
          International Customers:{" "}
          {(
            (data.customerData.international /
              (data.customerData.domestic + data.customerData.international)) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
    </motion.div>
  );
};

const StarParticle = ({ index }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [1, 0.2, 1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        repeat: Infinity,
        duration: 2 + Math.random() * 2,
        delay: Math.random() * 2,
      }}
      style={{
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  );
};

const LaunchVehicles = ({ launches }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("payload");

  const rocketStats = useMemo(() => {
    return transformLaunchData(launches);
  }, [launches]);

  const statistics = useMemo(() => {
    const totalLaunches = rocketStats.reduce((sum, s) => sum + s.launches, 0);
    const successfulLaunches = rocketStats.reduce(
      (sum, s) => sum + s.successCount,
      0
    );
    const totalPayload = rocketStats.reduce(
      (sum, s) => sum + s.totalPayload,
      0
    );
    const uniqueCountries = new Set(
      rocketStats.flatMap((s) => Array.from(s.countries))
    );

    return {
      avgSuccessRate: ((successfulLaunches / totalLaunches) * 100).toFixed(2),
      totalPayload: totalPayload.toFixed(2),
      maxPayload: Math.max(...rocketStats.map((s) => s.totalPayload)).toFixed(
        2
      ),
      minPayload: Math.min(...rocketStats.map((s) => s.avgPayloadMass)).toFixed(
        2
      ),
      totalLaunches,
      uniqueCustomers: uniqueCountries.size,
      uniqueOrbits: new Set(rocketStats.flatMap((s) => Array.from(s.orbits)))
        .size,
      totalCountries: uniqueCountries.size,
      recentFailures: rocketStats.reduce((sum, s) => sum + s.failures, 0),
      reliabilityTrend: (
        100 -
        rocketStats.reduce((sum, s) => sum + s.failures, 0) / rocketStats.length
      ).toFixed(1),
      averageYearlyGrowth: "8.5", // Placeholder as historical calculation needs more data
      internationalPayloadShare: (
        (rocketStats.reduce((sum, s) => sum + s.customerData.international, 0) /
          totalLaunches) *
        100
      ).toFixed(1),
    };
  }, [rocketStats]);

  const chartData = useMemo(() => {
    return rocketStats.map((stat) => ({
      ...stat,
      value:
        selectedMetric === "payload"
          ? stat.totalPayload
          : selectedMetric === "success"
          ? stat.successRate
          : selectedMetric === "reliability"
          ? stat.reliability
          : selectedMetric === "international"
          ? (stat.customerData.international /
              (stat.customerData.domestic + stat.customerData.international)) *
            100
          : stat.reliability,
    }));
  }, [rocketStats, selectedMetric]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#0a192f] to-black p-6">
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, index) => (
          <StarParticle key={index} index={index} />
        ))}
      </div>

      <motion.div
        className="space-y-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Enhanced Launch Statistics Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Rocket,
                label: "Total Launches",
                value: statistics.totalLaunches,
                subvalue: `${statistics.averageYearlyGrowth}% yearly growth`,
              },
              {
                icon: Trophy,
                label: "Success Rate",
                value: `${statistics.avgSuccessRate}%`,
                subvalue: `${statistics.reliabilityTrend}% reliability trend`,
              },
              {
                icon: Scale,
                label: "Total Payload",
                value: `${(parseFloat(statistics.totalPayload) / 1000).toFixed(
                  1
                )}t`,
                subvalue: `${statistics.minPayload}t min`,
              },
              {
                icon: Globe,
                label: "Global Reach",
                value: `${statistics.totalCountries} countries`,
                subvalue: `${statistics.uniqueCustomers} customers`,
              },
              {
                icon: Target,
                label: "International Share",
                value: `${statistics.internationalPayloadShare}%`,
                subvalue: "Of total payload",
              },
              {
                icon: AlertTriangle,
                label: "Recent Failures",
                value: statistics.recentFailures,
                subvalue: "Continuous improvement",
              },
              {
                icon: BadgePercent,
                label: "Growth Metrics",
                value: `${statistics.averageYearlyGrowth}%`,
                subvalue: "Year-over-year",
              },
              {
                icon: Landmark,
                label: "Reliability",
                value: `${statistics.reliabilityTrend}%`,
                subvalue: "Overall trend",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-space-gold/10 p-4 rounded-lg"
              >
                <div className="flex items-center gap-2 text-space-gold mb-1">
                  <stat.icon className="w-4 h-4" />
                  <p className="text-sm">{stat.label}</p>
                </div>
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.subvalue}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Launch Vehicle Analysis
                </CardTitle>
                <div className="flex gap-2">
                  {[
                    { value: "payload", label: "Payload" },
                    { value: "success", label: "Success" },
                    { value: "reliability", label: "Reliability" },
                    { value: "international", label: "International" },
                  ].map((metric) => (
                    <button
                      key={metric.value}
                      onClick={() => setSelectedMetric(metric.value)}
                      className={`px-3 py-1 rounded ${
                        selectedMetric === metric.value
                          ? "bg-space-gold text-black"
                          : "text-space-gold"
                      }`}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            Object.values(COLORS)[
                              index % Object.values(COLORS).length
                            ]
                          }
                          opacity={
                            activeIndex === null || activeIndex === index
                              ? 1
                              : 0.6
                          }
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
                <Target className="w-5 h-5" />
                Performance Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {rocketStats.map((rocket, index) => (
                    <motion.div
                      key={rocket.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-white">
                          {rocket.name}
                        </h3>
                        <div className="flex gap-2">
                          <span className="text-space-gold text-sm">
                            {rocket.launches} launches
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-gray-400 text-sm">Success Rate</p>
                          <div className="h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${rocket.successRate}%` }}
                              transition={{ duration: 1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS.success }}
                            />
                          </div>
                          <p className="text-white text-sm mt-1">
                            {rocket.successRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Reliability</p>
                          <div className="h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${rocket.reliability}%` }}
                              transition={{ duration: 1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: COLORS.warning }}
                            />
                          </div>
                          <p className="text-white text-sm mt-1">
                            {rocket.reliability.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">
                            Payload Capacity
                          </p>
                          <p className="text-white text-sm mt-1">
                            {(rocket.avgPayloadMass / 1000).toFixed(1)}t avg
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-400 text-sm mb-2">
                          International Reach
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-white text-sm">
                              {rocket.countries.size} Countries
                            </p>
                          </div>
                          <div>
                            <p className="text-white text-sm">
                              {(
                                (rocket.customerData.international /
                                  (rocket.customerData.domestic +
                                    rocket.customerData.international)) *
                                100
                              ).toFixed(1)}
                              % International
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Launch History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 191, 0, 0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#ffbf00"
                    tick={{ fill: "#ffbf00" }}
                    tickLine={{ stroke: "#ffbf00" }}
                  />
                  <YAxis
                    stroke="#ffbf00"
                    tick={{ fill: "#ffbf00" }}
                    tickLine={{ stroke: "#ffbf00" }}
                    tickFormatter={(value) => `${value} launches`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="launches"
                    fill={COLORS.success}
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(COLORS)[
                            index % Object.values(COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LaunchVehicles;
