"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Rocket } from "lucide-react";
import LaunchTimeline from "./timeline";
import LaunchVehicles from "./launchVehicle";
import PayloadAnalysis from "./payload";
import launchData from "./launches.json";
import PayloadStatsCard from "./totalpayload";
//import LaunchAnalysisDashboard from "./data";

interface Launch {
  launchOutcome: string;
  // Add other launch properties as needed
  payload?: {
    mass?: number;
    type?: string;
  };
  vehicle?: string;
  date?: string;
}

const SpaceBackground: React.FC = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-space-dark via-space-darker to-space-dark">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
    </div>
  </div>
);

const LaunchVisualizer: React.FC = () => {
  const launches: Launch[] = launchData.launches;
  const totalLaunches: number = launches.length;
  const successfulLaunches: number = launches.filter(
    (launch: Launch) => launch.launchOutcome === "Success"
  ).length;
  const successRate: string = (
    (successfulLaunches / totalLaunches) *
    100
  ).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full"
    >
      <SpaceBackground />
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl text-space-gold">
                <Rocket className="w-8 h-8 text-space-gold" />
                Space Launch Analytics
              </CardTitle>
              <CardDescription className="text-gray-200">
                Tracking {totalLaunches} launches with {successRate}% success
                rate
              </CardDescription>
              <PayloadStatsCard launches={launches} />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payload" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white/20">
                  <TabsTrigger
                    value="payload"
                    className="text-space-gold hover:text-space-gold/80 data-[state=active]:text-space-gold"
                  >
                    Payload Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="rockets"
                    className="text-space-gold hover:text-space-gold/80 data-[state=active]:text-space-gold"
                  >
                    Launch Vehicles
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="text-space-gold hover:text-space-gold/80 data-[state=active]:text-space-gold"
                  >
                    Launch Timeline
                  </TabsTrigger>
                </TabsList>
                <div className="text-space-gold">
                  <TabsContent value="payload">
                    <PayloadAnalysis launches={launches} />
                  </TabsContent>
                  <TabsContent value="rockets">
                    <LaunchVehicles launches={launches} />
                  </TabsContent>
                  <TabsContent value="timeline">
                    <LaunchTimeline launches={launches} />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
            {/* <CardContent>
              <LaunchAnalysisDashboard launches={launches} />
            </CardContent> */}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LaunchVisualizer;
