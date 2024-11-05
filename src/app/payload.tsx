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
} from "recharts";
import { Rocket, Star, Download, TrendingUp, Calculator } from "lucide-react";

const COLORS = {
  successPayload: "hsl(var(--chart-1))",
  failurePayload: "hsl(var(--chart-2))",
  partialPayload: "hsl(var(--chart-3))",
};

// Statistical calculations helper functions
const calculateStatistics = (data) => {
  const allPayloads = data.flatMap((year) => [
    year.successPayload,
    year.failurePayload,
    year.partialPayload,
  ]);

  const mean =
    allPayloads.reduce((sum, val) => sum + val, 0) / allPayloads.length;
  const sortedPayloads = [...allPayloads].sort((a, b) => a - b);
  const median = sortedPayloads[Math.floor(sortedPayloads.length / 2)];
  const variance =
    allPayloads.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    allPayloads.length;
  const stdDev = Math.sqrt(variance);

  return {
    mean: mean.toFixed(2),
    median: median.toFixed(2),
    stdDev: stdDev.toFixed(2),
    total: allPayloads.reduce((sum, val) => sum + val, 0).toFixed(2),
    successRate: (
      (data.reduce((sum, year) => sum + year.successPayload, 0) /
        data.reduce(
          (sum, year) =>
            sum +
            year.successPayload +
            year.failurePayload +
            year.partialPayload,
          0
        )) *
      100
    ).toFixed(2),
  };
};

// Trend analysis helper function
const calculateTrend = (data) => {
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = data.map((d) => d.successPayload);

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black/40 backdrop-blur-lg p-4 rounded-lg border border-space-gold/30"
    >
      <p className="text-space-gold font-semibold mb-2">{`Year: ${label}`}</p>
      <div className="space-y-1">
        <p className="text-[hsl(var(--chart-1))]">
          {`Successful: ${payload[0]?.value.toLocaleString() || 0} kg`}
        </p>
        <p className="text-[hsl(var(--chart-2))]">
          {`Failed: ${payload[1]?.value.toLocaleString() || 0} kg`}
        </p>
        <p className="text-[hsl(var(--chart-3))]">
          {`Partial: ${payload[2]?.value.toLocaleString() || 0} kg`}
        </p>
        <p className="text-space-gold font-semibold mt-2">
          {`Total: ${(
            (payload[0]?.value || 0) +
            (payload[1]?.value || 0) +
            (payload[2]?.value || 0)
          ).toLocaleString()} kg`}
        </p>
      </div>
      {payload[0]?.payload?.launches && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-2 border-t border-space-gold/20 pt-2"
        >
          <p className="text-sm text-space-gold">Launches:</p>
          {payload[0].payload.launches.map((launch, idx) => (
            <motion.p
              key={idx}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className={`text-xs ${
                launch.launchOutcome === "Success"
                  ? "text-[hsl(var(--chart-1))]"
                  : launch.launchOutcome === "Failure"
                  ? "text-[hsl(var(--chart-2))]"
                  : "text-[hsl(var(--chart-3))]"
              }`}
            >
              • {launch.rocket || "Unknown Rocket"}: {launch.payloadMass}{" "}
              {launch.payloadMassUnit} - {launch.payload}
            </motion.p>
          ))}
        </motion.div>
      )}
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

const PayloadAnalysis = ({ launches }) => {
  const [selectedView, setSelectedView] = useState("bar"); // 'bar' or 'line'

  const parseDate = (dateString) => {
    const [date] = dateString.split(" | ");
    return new Date(date);
  };

  const processedData = useMemo(() => {
    const launchesByYear = launches.reduce((acc, launch) => {
      const year = parseDate(launch.dateTime).getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(launch);
      return acc;
    }, {});

    return Object.entries(launchesByYear)
      .map(([year, yearLaunches]) => {
        const successPayload = yearLaunches
          .filter((l) => l.launchOutcome === "Success")
          .reduce((sum, l) => sum + (parseFloat(l.payloadMass) || 0), 0);

        const failurePayload = yearLaunches
          .filter((l) => l.launchOutcome === "Failure")
          .reduce((sum, l) => sum + (parseFloat(l.payloadMass) || 0), 0);

        const partialPayload = yearLaunches
          .filter((l) => !["Success", "Failure"].includes(l.launchOutcome))
          .reduce((sum, l) => sum + (parseFloat(l.payloadMass) || 0), 0);

        return {
          year,
          successPayload,
          failurePayload,
          partialPayload,
          launches: yearLaunches.map((l) => ({
            rocket: l.rocket,
            payload: l.payload,
            payloadMass: l.payloadMass,
            payloadMassUnit: l.payloadMassUnit,
            launchOutcome: l.launchOutcome,
            launchNo: l.launchNo,
            flightNo: l.flightNo,
          })),
        };
      })
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [launches]);

  const statistics = useMemo(
    () => calculateStatistics(processedData),
    [processedData]
  );
  const trend = useMemo(() => calculateTrend(processedData), [processedData]);

  const handleExportData = () => {
    const csvContent = [
      [
        "Year",
        "Successful Payload (kg)",
        "Failed Payload (kg)",
        "Partial Payload (kg)",
        "Total Payload (kg)",
      ],
      ...processedData.map((data) => [
        data.year,
        data.successPayload,
        data.failurePayload,
        data.partialPayload,
        data.successPayload + data.failurePayload + data.partialPayload,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "payload_analysis.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative space-y-4">
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, index) => (
          <StarParticle key={index} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Statistics Card */}
        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30 mb-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Statistical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Mean Payload", value: `${statistics.mean} kg` },
              { label: "Median Payload", value: `${statistics.median} kg` },
              { label: "Standard Deviation", value: `${statistics.stdDev} kg` },
              { label: "Total Payload", value: `${statistics.total} kg` },
              { label: "Success Rate", value: `${statistics.successRate}%` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-space-gold/10 p-3 rounded-lg"
              >
                <p className="text-space-gold text-sm">{stat.label}</p>
                <p className="text-white font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Main Chart Card */}
        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-space-gold flex items-center gap-2">
                <Rocket className="w-6 h-6" />
                Payload Analysis by Launch Outcome
              </CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedView("bar")}
                  className={`px-3 py-1 rounded ${
                    selectedView === "bar"
                      ? "bg-space-gold text-black"
                      : "text-space-gold"
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setSelectedView("line")}
                  className={`px-3 py-1 rounded ${
                    selectedView === "line"
                      ? "bg-space-gold text-black"
                      : "text-space-gold"
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={handleExportData}
                  className="px-3 py-1 rounded border border-space-gold text-space-gold hover:bg-space-gold hover:text-black transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            <motion.div
              className="flex gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { color: COLORS.successPayload, label: "Successful" },
                { color: COLORS.failurePayload, label: "Failed" },
                { color: COLORS.partialPayload, label: "Partial/Other" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-300">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.div
              className="h-[500px] w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ResponsiveContainer>
                {selectedView === "bar" ? (
                  <BarChart
                    data={processedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 191, 0, 0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="year"
                      stroke="#ffbf00"
                      tick={{ fill: "#ffbf00" }}
                      tickLine={{ stroke: "#ffbf00" }}
                    />
                    <YAxis
                      stroke="#ffbf00"
                      tick={{ fill: "#ffbf00" }}
                      tickLine={{ stroke: "#ffbf00" }}
                      tickFormatter={(value) =>
                        `${(value / 1000).toFixed(1)}k kg`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="successPayload"
                      stackId="a"
                      fill={COLORS.successPayload}
                      name="Successful"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="failurePayload"
                      stackId="a"
                      fill={COLORS.failurePayload}
                      name="Failed"
                    />
                    <Bar
                      dataKey="partialPayload"
                      stackId="a"
                      fill={COLORS.partialPayload}
                      name="Partial/Other"
                      radius={[0, 0, 4, 4]}
                    />
                  </BarChart>
                ) : (
                  <LineChart
                    data={processedData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255, 191, 0, 0.1)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="year"
                      stroke="#ffbf00"
                      tick={{ fill: "#ffbf00" }}
                      tickLine={{ stroke: "#ffbf00" }}
                    />
                    <YAxis
                      stroke="#ffbf00"
                      tick={{ fill: "#ffbf00" }}
                      tickLine={{ stroke: "#ffbf00" }}
                      tickFormatter={(value) =>
                        `${(value / 1000).toFixed(1)}k kg`
                      }
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="successPayload"
                      stroke={COLORS.successPayload}
                      name="Successful"
                      strokeWidth={2}
                      dot={{ fill: COLORS.successPayload }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="failurePayload"
                      stroke={COLORS.failurePayload}
                      name="Failed"
                      strokeWidth={2}
                      dot={{ fill: COLORS.failurePayload }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="partialPayload"
                      stroke={COLORS.partialPayload}
                      name="Partial/Other"
                      strokeWidth={2}
                      dot={{ fill: COLORS.partialPayload }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>

        {/* Trend Analysis Card */}
        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30 mt-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-space-gold flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-space-gold/10 p-4 rounded-lg"
              >
                <p className="text-space-gold text-sm mb-2">Growth Trend</p>
                <p className="text-white">
                  {trend.slope > 0 ? "Positive" : "Negative"} trend with a slope
                  of <span className="font-bold">{trend.slope.toFixed(2)}</span>{" "}
                  kg/year
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-space-gold/10 p-4 rounded-lg"
              >
                <p className="text-space-gold text-sm mb-2">
                  Year-over-Year Change
                </p>
                <p className="text-white">
                  Average yearly change:{" "}
                  <span className="font-bold">
                    {(
                      (trend.slope / processedData[0]?.successPayload) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PayloadAnalysis;
