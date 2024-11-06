import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Rocket, Star, Activity, TrendingUp } from "lucide-react";

// Type definitions
interface Launch {
  rocket: string;
  launchDate: string;
  payloadMass: string | number;
  launchOutcome: string;
}

interface RocketStat {
  name: string;
  launches: number;
  totalPayload: number;
  successRate: number;
  yearlyData: Record<number, YearlyData>;
  reliability: number;
  value?: number; // For pie chart
}

interface YearlyData {
  year: number;
  launches: number;
}

interface RadialData {
  name: string;
  value: number;
  fill: string;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RocketStat;
  }>;
}

interface LaunchVehiclesProps {
  launches: Launch[];
}

// Constants
const COLORS: string[] = [
  "#00f2fe", // Electric Blue
  "#4facfe", // Bright Blue
  "#7367f0", // Purple
  "#f77062", // Coral
  "#fe5196", // Pink
];

const RADIAN = Math.PI / 180;

// Custom Components
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}: CustomLabelProps): JSX.Element => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={COLORS[index % COLORS.length]}
        fill="none"
      />
      <circle
        cx={ex}
        cy={ey}
        r={2}
        fill={COLORS[index % COLORS.length]}
        stroke="none"
      />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        className="text-xs"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-lg shadow-xl">
        <h3 className="text-white font-bold mb-2">{data.name}</h3>
        <div className="space-y-1">
          <p className="text-gray-300">
            Launches:{" "}
            <span className="text-white font-medium">{data.launches}</span>
          </p>
          <p className="text-gray-300">
            Success Rate:{" "}
            <span className="text-white font-medium">
              {data.successRate.toFixed(1)}%
            </span>
          </p>
          <p className="text-gray-300">
            Payload:{" "}
            <span className="text-white font-medium">
              {data.totalPayload.toFixed(2)} kg
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const LaunchVehicles: React.FC<LaunchVehiclesProps> = ({ launches }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const rocketStats = launches.reduce<Record<string, RocketStat>>(
    (acc, launch) => {
      const rocketName = launch.rocket;
      const year = new Date(launch.launchDate).getFullYear();

      if (!acc[rocketName]) {
        acc[rocketName] = {
          name: rocketName,
          launches: 0,
          totalPayload: 0,
          successRate: 0,
          yearlyData: {},
          reliability: Math.random() * 30 + 70, // Simulated reliability score
        };
      }

      acc[rocketName].launches++;
      acc[rocketName].totalPayload +=
        parseFloat(String(launch.payloadMass)) || 0;
      acc[rocketName].successRate += launch.launchOutcome === "Success" ? 1 : 0;

      if (!acc[rocketName].yearlyData[year]) {
        acc[rocketName].yearlyData[year] = { year, launches: 0 };
      }
      acc[rocketName].yearlyData[year].launches++;

      return acc;
    },
    {}
  );

  Object.values(rocketStats).forEach((stat) => {
    stat.successRate = (stat.successRate / stat.launches) * 100;
    stat.value = stat.totalPayload; // For pie chart
  });

  const pieData = Object.values(rocketStats);
  const radialData: RadialData[] = Object.values(rocketStats).map(
    (stat, index) => ({
      name: stat.name,
      value: stat.reliability,
      fill: COLORS[index % COLORS.length],
    })
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-[#0a192f] to-black p-6">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              opacity: Math.random(),
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-blue-400" />
                Launch Vehicle Performance
              </h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={renderCustomizedLabel}
                      outerRadius={130}
                      innerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Reliability Scores */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-purple-400" />
                Reliability Metrics
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="20%"
                    outerRadius="90%"
                    data={radialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise={true}
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Tooltip />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-4">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                Performance Stats
              </h3>
              <ScrollArea className="h-[740px] pr-4">
                <div className="space-y-6">
                  {Object.values(rocketStats).map((rocket, index) => (
                    <motion.div
                      key={rocket.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-white">
                          {rocket.name}
                        </h4>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/20">
                          {rocket.launches} launches
                        </Badge>
                      </div>

                      {/* Success Rate Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Success Rate</span>
                          <span className="text-white">
                            {rocket.successRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rocket.successRate}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${
                                COLORS[index % COLORS.length]
                              }, ${COLORS[(index + 1) % COLORS.length]})`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Payload Info */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Total Payload</p>
                          <p className="text-white font-medium">
                            {(rocket.totalPayload / 1000).toFixed(1)}t
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Reliability</p>
                          <p className="text-white font-medium">
                            {rocket.reliability.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LaunchVehicles;
