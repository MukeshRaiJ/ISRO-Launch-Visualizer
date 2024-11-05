import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  Rocket,
  Calculator,
  Calendar,
  Globe,
  Database,
  TrendingUp,
  Filter,
  AlertCircle,
  Download,
} from "lucide-react";

const COLORS = {
  success: "hsl(var(--chart-1))",
  failure: "hsl(var(--chart-2))",
  partial: "hsl(var(--chart-3))",
  accent1: "#FFB74D",
  accent2: "#4DD0E1",
  accent3: "#81C784",
};

// Advanced Statistical Analysis Functions
const calculateAdvancedStats = (launches) => {
  const payloads = launches.map((l) => parseFloat(l.payloadMass) || 0);
  const mean = payloads.reduce((a, b) => a + b, 0) / payloads.length;
  const variance =
    payloads.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / payloads.length;
  const stdDev = Math.sqrt(variance);

  return {
    totalLaunches: launches.length,
    successRate: (
      (launches.filter((l) => l.launchOutcome === "Success").length /
        launches.length) *
      100
    ).toFixed(1),
    averagePayload: mean.toFixed(1),
    payloadStdDev: stdDev.toFixed(1),
    heaviestPayload: Math.max(...payloads).toFixed(1),
    totalPayload: payloads.reduce((a, b) => a + b, 0).toFixed(1),
  };
};

// Orbital Analysis
const analyzeOrbits = (launches) => {
  const orbitCount = launches.reduce((acc, launch) => {
    acc[launch.orbit] = (acc[launch.orbit] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(orbitCount).map(([orbit, count]) => ({
    orbit,
    count,
    successRate: (
      (launches.filter(
        (l) => l.orbit === orbit && l.launchOutcome === "Success"
      ).length /
        count) *
      100
    ).toFixed(1),
  }));
};

// Time Series Analysis
const analyzeTimeSeries = (launches) => {
  const timeData = launches.reduce((acc, launch) => {
    const year = new Date(launch.dateTime.split(" | ")[0]).getFullYear();
    if (!acc[year]) {
      acc[year] = {
        year,
        launches: 0,
        successfulLaunches: 0,
        totalPayload: 0,
        successRate: 0,
      };
    }
    acc[year].launches++;
    if (launch.launchOutcome === "Success") acc[year].successfulLaunches++;
    acc[year].totalPayload += parseFloat(launch.payloadMass) || 0;
    acc[year].successRate = (
      (acc[year].successfulLaunches / acc[year].launches) *
      100
    ).toFixed(1);
    return acc;
  }, {});

  return Object.values(timeData).sort((a, b) => a.year - b.year);
};

// Mission Analysis
const analyzeMissions = (launches) => {
  return launches.map((launch) => ({
    launchNo: launch.launchNo,
    date: launch.dateTime.split(" | ")[0],
    payloadMass: parseFloat(launch.payloadMass) || 0,
    success: launch.launchOutcome === "Success" ? 1 : 0,
    orbit: launch.orbit,
    rocket: launch.rocket,
  }));
};

const LaunchAnalysisDashboard = ({ launches }) => {
  const [selectedView, setSelectedView] = useState("overview");
  const [selectedOrbit, setSelectedOrbit] = useState("all");

  const stats = useMemo(() => calculateAdvancedStats(launches), [launches]);
  const orbitData = useMemo(() => analyzeOrbits(launches), [launches]);
  const timeSeriesData = useMemo(() => analyzeTimeSeries(launches), [launches]);
  const missionData = useMemo(() => analyzeMissions(launches), [launches]);

  const handleExportData = (data, filename) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "overview", icon: Database, label: "Overview" },
          { id: "orbital", icon: Globe, label: "Orbital Analysis" },
          { id: "timeline", icon: Calendar, label: "Timeline Analysis" },
          { id: "mission", icon: Rocket, label: "Mission Analysis" },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              selectedView === view.id
                ? "bg-space-gold text-black"
                : "text-space-gold hover:bg-space-gold/20"
            }`}
          >
            <view.icon className="w-4 h-4" />
            {view.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {selectedView === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Launch Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-space-gold/10 p-3 rounded">
                  <p className="text-space-gold text-sm">Total Launches</p>
                  <p className="text-2xl font-bold">{stats.totalLaunches}</p>
                </div>
                <div className="bg-space-gold/10 p-3 rounded">
                  <p className="text-space-gold text-sm">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
              <div className="mt-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Success",
                          value: parseFloat(stats.successRate),
                        },
                        {
                          name: "Failure",
                          value: 100 - parseFloat(stats.successRate),
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill={COLORS.success} />
                      <Cell fill={COLORS.failure} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Payload Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-space-gold/10 p-3 rounded">
                  <p className="text-space-gold text-sm">Average Payload</p>
                  <p className="text-2xl font-bold">
                    {stats.averagePayload} kg
                  </p>
                </div>
                <div className="bg-space-gold/10 p-3 rounded">
                  <p className="text-space-gold text-sm">Heaviest Payload</p>
                  <p className="text-2xl font-bold">
                    {stats.heaviestPayload} kg
                  </p>
                </div>
                <div className="bg-space-gold/10 p-3 rounded">
                  <p className="text-space-gold text-sm">Total Payload</p>
                  <p className="text-2xl font-bold">{stats.totalPayload} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Launch Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(
                  launches.reduce((acc, launch) => {
                    acc[launch.launchSite] = (acc[launch.launchSite] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([site, count]) => (
                  <div key={site} className="bg-space-gold/10 p-3 rounded">
                    <p className="text-space-gold text-sm">{site}</p>
                    <p className="text-lg font-bold">{count} launches</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Orbital Analysis Section */}
      {selectedView === "orbital" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Orbital Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orbitData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="orbit"
                    label
                  >
                    {orbitData.map((entry, index) => (
                      <Cell
                        key={entry.orbit}
                        fill={COLORS[`accent${(index % 3) + 1}`]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Orbital Success Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orbitData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 191, 0, 0.1)"
                  />
                  <XAxis dataKey="orbit" stroke="#ffbf00" />
                  <YAxis stroke="#ffbf00" />
                  <Tooltip />
                  <Bar
                    dataKey="successRate"
                    fill={COLORS.success}
                    name="Success Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Timeline Analysis Section */}
      {selectedView === "timeline" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Launch Frequency & Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255, 191, 0, 0.1)"
                  />
                  <XAxis dataKey="year" stroke="#ffbf00" />
                  <YAxis yAxisId="left" stroke="#ffbf00" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffbf00" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="launches"
                    stroke={COLORS.accent1}
                    name="Total Launches"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="successRate"
                    stroke={COLORS.success}
                    name="Success Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Mission Analysis Section */}
      {selectedView === "mission" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Mission Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-space-gold/30">
                      <th className="text-left p-2 text-space-gold">
                        Launch No
                      </th>
                      <th className="text-left p-2 text-space-gold">Date</th>
                      <th className="text-left p-2 text-space-gold">Rocket</th>
                      <th className="text-left p-2 text-space-gold">Payload</th>
                      <th className="text-left p-2 text-space-gold">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {launches.map((launch, index) => (
                      <tr
                        key={launch.launchNo}
                        className={`border-b border-space-gold/10 ${
                          index % 2 === 0 ? "bg-space-gold/5" : ""
                        }`}
                      >
                        <td className="p-2">{launch.launchNo}</td>
                        <td className="p-2">
                          {launch.dateTime.split(" | ")[0]}
                        </td>
                        <td className="p-2">{launch.rocket}</td>
                        <td className="p-2">
                          <div className="flex flex-col">
                            <span>{launch.payload}</span>
                            <span className="text-xs text-space-gold">
                              {launch.payloadMass} {launch.payloadMassUnit}
                            </span>
                          </div>
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              launch.launchOutcome === "Success"
                                ? "bg-green-500/20 text-green-400"
                                : launch.launchOutcome === "Failure"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {launch.launchOutcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Mission Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
              <CardHeader>
                <CardTitle className="text-xl text-space-gold">
                  Payload Mass Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 191, 0, 0.1)"
                    />
                    <XAxis
                      dataKey="launchNo"
                      type="number"
                      name="Launch Number"
                      stroke="#ffbf00"
                    />
                    <YAxis
                      dataKey="payloadMass"
                      name="Payload Mass"
                      stroke="#ffbf00"
                      unit=" kg"
                    />
                    <ZAxis dataKey="success" range={[50, 400]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter
                      name="Launches"
                      data={missionData}
                      fill={COLORS.success}
                    >
                      {missionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.success ? COLORS.success : COLORS.failure}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
              <CardHeader>
                <CardTitle className="text-xl text-space-gold">
                  Mission Success Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Rocket Success Rates */}
                  <div className="bg-space-gold/10 p-4 rounded">
                    <h3 className="text-space-gold mb-2">Rocket Performance</h3>
                    {Object.entries(
                      launches.reduce((acc, launch) => {
                        if (!acc[launch.rocket]) {
                          acc[launch.rocket] = {
                            total: 0,
                            success: 0,
                          };
                        }
                        acc[launch.rocket].total++;
                        if (launch.launchOutcome === "Success") {
                          acc[launch.rocket].success++;
                        }
                        return acc;
                      }, {})
                    ).map(([rocket, stats]) => (
                      <div
                        key={rocket}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-sm">{rocket}</span>
                        <span className="text-sm text-space-gold">
                          {((stats.success / stats.total) * 100).toFixed(1)}% (
                          {stats.success}/{stats.total})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Launch Site Analysis */}
                  <div className="bg-space-gold/10 p-4 rounded">
                    <h3 className="text-space-gold mb-2">
                      Launch Site Performance
                    </h3>
                    {Object.entries(
                      launches.reduce((acc, launch) => {
                        if (!acc[launch.launchSite]) {
                          acc[launch.launchSite] = {
                            total: 0,
                            success: 0,
                          };
                        }
                        acc[launch.launchSite].total++;
                        if (launch.launchOutcome === "Success") {
                          acc[launch.launchSite].success++;
                        }
                        return acc;
                      }, {})
                    ).map(([site, stats]) => (
                      <div
                        key={site}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-sm">{site}</span>
                        <span className="text-sm text-space-gold">
                          {((stats.success / stats.total) * 100).toFixed(1)}% (
                          {stats.success}/{stats.total})
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Export Data Button */}
                  <button
                    onClick={() =>
                      handleExportData(missionData, "mission_analysis")
                    }
                    className="w-full mt-4 px-4 py-2 bg-space-gold/20 hover:bg-space-gold/30 text-space-gold rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Mission Data
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission History Timeline */}
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
            <CardHeader>
              <CardTitle className="text-xl text-space-gold">
                Launch History Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-space-gold/20" />
                {launches.map((launch, index) => (
                  <motion.div
                    key={launch.launchNo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="ml-8 mb-4 relative"
                  >
                    <div className="absolute -left-6 top-1/2 w-3 h-3 rounded-full bg-space-gold transform -translate-y-1/2" />
                    <div className="bg-space-gold/10 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-space-gold font-bold">
                          {launch.payload}
                        </h4>
                        <span className="text-sm">
                          {launch.dateTime.split(" | ")[0]}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        Rocket: {launch.rocket} | Mass: {launch.payloadMass}{" "}
                        {launch.payloadMassUnit}
                      </p>
                      <p className="text-sm opacity-70">
                        {launch.missionDescription}
                      </p>
                      {launch.notes && (
                        <p className="text-sm mt-2 text-space-gold/80">
                          {launch.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default LaunchAnalysisDashboard;
