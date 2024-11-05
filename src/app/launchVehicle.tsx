import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Rocket, Star } from "lucide-react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

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

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-space-dark to-space-darker p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, index) => (
          <StarParticle key={index} index={index} />
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30 hover:border-space-gold/60 transition-all">
            <CardContent className="pt-6">
              <motion.h3
                className="text-xl font-semibold text-space-gold mb-4 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Rocket className="w-5 h-5" />
                Payload Distribution
              </motion.h3>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000011",
                        border: "1px solid rgba(255, 191, 0, 0.3)",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "#ffbf00" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30 hover:border-space-gold/60 transition-all">
            <CardContent className="pt-6">
              <motion.h3
                className="text-xl font-semibold text-space-gold mb-4 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Star className="w-5 h-5" />
                Launch Success Rates
              </motion.h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-6">
                  {Object.values(rocketStats).map((rocket, index) => (
                    <motion.div
                      key={rocket.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">
                          {rocket.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="border-space-gold/50 text-space-gold bg-space-gold/10"
                        >
                          {rocket.launches} launches
                        </Badge>
                      </div>
                      <div className="w-full bg-black/50 rounded-full h-2.5 border border-space-gold/20">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${rocket.successRate}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full rounded-full"
                          style={{
                            background: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                      <motion.div
                        className="text-sm text-gray-300 mt-2 flex justify-between"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <span>Success Rate</span>
                        <span className="text-space-gold font-medium">
                          {rocket.successRate.toFixed(1)}%
                        </span>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LaunchVehicles;
