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
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Launch } from "./types";

const COLORS = {
  accent1: "#FFB74D",
  accent2: "#4DD0E1",
  accent3: "#81C784",
  success: "hsl(var(--chart-1))",
};

interface OrbitData {
  orbit: string;
  count: number;
  successRate: string;
}

interface OrbitalAnalysisSectionProps {
  orbitData: OrbitData[];
}

export const OrbitalAnalysisSection: React.FC<OrbitalAnalysisSectionProps> = ({
  orbitData,
}) => {
  return (
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
                    fill={
                      COLORS[`accent${(index % 3) + 1}` as keyof typeof COLORS]
                    }
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
  );
};
