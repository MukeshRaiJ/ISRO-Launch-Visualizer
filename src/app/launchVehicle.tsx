import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

const LaunchVehicles = ({ launches }) => {
  const rocketStats = launches.reduce((acc, launch) => {
    const rocketName = launch.rocket;
    if (!acc[rocketName]) {
      acc[rocketName] = {
        name: rocketName,
        launches: 0,
        totalPayload: 0,
        successRate: 0,
      };
    }
    acc[rocketName].launches++;
    acc[rocketName].totalPayload += parseFloat(launch.payloadMass) || 0;
    acc[rocketName].successRate += launch.launchOutcome === "Success" ? 1 : 0;
    return acc;
  }, {});

  Object.values(rocketStats).forEach((stat) => {
    stat.successRate = (stat.successRate / stat.launches) * 100;
  });

  const pieData = Object.values(rocketStats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-white/5 border-none">
        <CardContent className="pt-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="totalPayload"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-none">
        <CardContent>
          <ScrollArea className="h-[300px]">
            {Object.values(rocketStats).map((rocket, index) => (
              <motion.div
                key={rocket.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{rocket.name}</span>
                  <Badge variant="secondary">{rocket.launches} launches</Badge>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${rocket.successRate}%` }}
                    transition={{ duration: 1 }}
                    className="bg-green-500 h-2 rounded-full"
                  />
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  Success Rate: {rocket.successRate.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchVehicles;
