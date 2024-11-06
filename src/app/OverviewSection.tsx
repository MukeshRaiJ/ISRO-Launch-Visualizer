"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Launch } from "./types";

const COLORS = {
  success: "hsl(var(--chart-1))",
  failure: "hsl(var(--chart-2))",
  partial: "hsl(var(--chart-3))",
};

interface OverviewSectionProps {
  launches: Launch[];
  stats: {
    totalLaunches: number;
    successRate: string;
    averagePayload: string;
    payloadStdDev: string;
    heaviestPayload: string;
    totalPayload: string;
  };
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  launches,
  stats,
}) => {
  return (
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
                <Tooltip />
                <Legend />
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
              <p className="text-2xl font-bold">{stats.averagePayload} kg</p>
            </div>
            <div className="bg-space-gold/10 p-3 rounded">
              <p className="text-space-gold text-sm">Heaviest Payload</p>
              <p className="text-2xl font-bold">{stats.heaviestPayload} kg</p>
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
              launches.reduce((acc: Record<string, number>, launch) => {
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
        <CardContent></CardContent>
      </Card>
    </motion.div>
  );
};
