"use client";
import React, { useMemo, useState } from "react";
import { OverviewSection } from "./OverviewSection";
import { OrbitalAnalysisSection } from "./OrbitalAnalysisSection";
import { MissionAnalysisSection } from "./MissionAnalysisSection";
import { Database, Globe, Rocket } from "lucide-react";
import { Launch } from "./types";

interface LaunchAnalysisDashboardProps {
  launches: Launch[];
}

const LaunchAnalysisDashboard: React.FC<LaunchAnalysisDashboardProps> = ({
  launches,
}) => {
  const [selectedView, setSelectedView] = useState("overview");

  // Statistics calculations
  const stats = useMemo(() => {
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
  }, [launches]);

  // Orbit data calculations
  const orbitData = useMemo(() => {
    const orbitCount = launches.reduce(
      (acc: Record<string, number>, launch) => {
        acc[launch.orbit] = (acc[launch.orbit] || 0) + 1;
        return acc;
      },
      {}
    );

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
  }, [launches]);

  // Mission data calculations
  const missionData = useMemo(() => {
    return launches.map((launch) => ({
      launchNo: parseInt(launch.launchNo),
      date: launch.dateTime.split(" | ")[0],
      payloadMass: parseFloat(launch.payloadMass) || 0,
      success: launch.launchOutcome === "Success",
      rocket: launch.rocket,
    }));
  }, [launches]);

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex gap-2 mb-4">
        {[
          { id: "overview", icon: Database, label: "Overview" },
          { id: "orbital", icon: Globe, label: "Orbital Analysis" },
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

      {/* Conditional rendering of sections */}
      {selectedView === "overview" && (
        <OverviewSection launches={launches} stats={stats} />
      )}
      {selectedView === "orbital" && (
        <OrbitalAnalysisSection orbitData={orbitData} />
      )}
      {selectedView === "mission" && (
        <MissionAnalysisSection launches={launches} missionData={missionData} />
      )}
    </div>
  );
};

export default LaunchAnalysisDashboard;
