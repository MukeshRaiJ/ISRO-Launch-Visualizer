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

const SpaceBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
    </div>
  </div>
);

const LaunchVisualizer = () => {
  const launches = launchData.launches;
  const totalLaunches = launches.length;
  const successfulLaunches = launches.filter(
    (l) => l.launchOutcome === "Success"
  ).length;
  const successRate = ((successfulLaunches / totalLaunches) * 100).toFixed(1);

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
        >
          <Card className="bg-white/10 backdrop-blur-lg border-none text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-3xl">
                <Rocket className="w-8 h-8" />
                Space Launch Analytics
              </CardTitle>
              <CardDescription className="text-gray-200">
                Tracking {totalLaunches} launches with {successRate}% success
                rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="payload" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-white/20">
                  <TabsTrigger value="payload">Payload Analysis</TabsTrigger>
                  <TabsTrigger value="rockets">Launch Vehicles</TabsTrigger>
                  <TabsTrigger value="timeline">Launch Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="payload">
                  <PayloadAnalysis launches={launches} />
                </TabsContent>

                <TabsContent value="rockets">
                  <LaunchVehicles launches={launches} />
                </TabsContent>

                <TabsContent value="timeline">
                  <LaunchTimeline launches={launches} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LaunchVisualizer;
