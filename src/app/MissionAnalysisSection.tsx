"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Launch } from "./types";

const COLORS = {
  success: "hsl(var(--chart-1))",
  failure: "hsl(var(--chart-2))",
};

interface MissionData {
  launchNo: number;
  date: string;
  payloadMass: number;
  success: boolean;
  rocket: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-black/90 p-3 rounded-lg border border-space-gold/30">
        <p className="text-space-gold">Launch #{data.launchNo}</p>
        <p className="text-sm">Date: {data.date}</p>
        <p className="text-sm">Rocket: {data.rocket}</p>
        <p className="text-sm">Payload: {data.payloadMass} kg</p>
        <p className="text-sm">
          Status: {data.success ? "Success" : "Failure"}
        </p>
      </div>
    );
  }
  return null;
};

interface MissionAnalysisSectionProps {
  launches: Launch[];
  missionData: MissionData[];
}

export const MissionAnalysisSection: React.FC<MissionAnalysisSectionProps> = ({
  launches,
  missionData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30">
          <CardHeader>
            <CardTitle className="text-xl text-space-gold">
              Payload Mass Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255, 191, 0, 0.1)"
                />
                <XAxis
                  dataKey="launchNo"
                  name="Launch Number"
                  stroke="#ffbf00"
                  label={{
                    value: "Launch Number",
                    position: "bottom",
                    fill: "#ffbf00",
                  }}
                />
                <YAxis
                  dataKey="payloadMass"
                  name="Payload Mass"
                  stroke="#ffbf00"
                  label={{
                    value: "Payload Mass (kg)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#ffbf00",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Scatter
                  name="Successful Launches"
                  data={missionData.filter((d) => d.success)}
                  fill={COLORS.success}
                />
                <Scatter
                  name="Failed Launches"
                  data={missionData.filter((d) => !d.success)}
                  fill={COLORS.failure}
                />
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
              <div className="bg-space-gold/10 p-4 rounded">
                <h3 className="text-space-gold mb-2">Rocket Performance</h3>
                {Object.entries(
                  launches.reduce(
                    (
                      acc: Record<string, { total: number; success: number }>,
                      launch
                    ) => {
                      if (!acc[launch.rocket]) {
                        acc[launch.rocket] = { total: 0, success: 0 };
                      }
                      acc[launch.rocket].total++;
                      if (launch.launchOutcome === "Success") {
                        acc[launch.rocket].success++;
                      }
                      return acc;
                    },
                    {}
                  )
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

              <div className="bg-space-gold/10 p-4 rounded">
                <h3 className="text-space-gold mb-2">
                  Launch Site Performance
                </h3>
                {Object.entries(
                  launches.reduce(
                    (
                      acc: Record<string, { total: number; success: number }>,
                      launch
                    ) => {
                      if (!acc[launch.launchSite]) {
                        acc[launch.launchSite] = { total: 0, success: 0 };
                      }
                      acc[launch.launchSite].total++;
                      if (launch.launchOutcome === "Success") {
                        acc[launch.launchSite].success++;
                      }
                      return acc;
                    },
                    {}
                  )
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
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};
