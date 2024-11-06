import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search, Rocket, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Launch {
  launchNo: string;
  flightNo: string;
  dateTime: string;
  rocket?: string;
  payload?: string;
  orbit?: string;
  launchOutcome?: string;
  launchSite?: string;
  payloadMass?: number;
  payloadMassUnit?: string;
  missionDescription?: string;
  notes?: string;
}

interface LaunchTimelineProps {
  launches: Launch[];
}

const LaunchTimeline: React.FC<LaunchTimelineProps> = ({ launches }) => {
  const [expandedLaunch, setExpandedLaunch] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedRocket, setSelectedRocket] = useState<string>("all");
  const [selectedOrbit, setSelectedOrbit] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all");
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("all");

  // Quick filter definitions
  const quickFilters = [
    { id: "all", label: "All Launches", icon: "🚀" },
    { id: "special", label: "Special Missions", icon: "⭐" },
    { id: "success", label: "Successful Launches", icon: "✅" },
    { id: "tech", label: "Technology Development", icon: "🔬" },
    { id: "comms", label: "Communications", icon: "📡" },
  ];

  const years = useMemo(() => {
    return [
      ...new Set(
        launches.map((launch) =>
          new Date(launch.dateTime.split(" | ")[0]).getFullYear()
        )
      ),
    ].sort((a, b) => b - a);
  }, [launches]);

  const rockets = useMemo(() => {
    return [
      ...new Set(launches.map((launch) => launch.rocket || "Unspecified")),
    ]
      .filter(Boolean)
      .sort();
  }, [launches]);

  const orbits = useMemo(() => {
    return [...new Set(launches.map((launch) => launch.orbit || "Unspecified"))]
      .filter(Boolean)
      .sort();
  }, [launches]);

  const outcomes = useMemo(() => {
    return [
      ...new Set(
        launches.map((launch) => launch.launchOutcome || "Unspecified")
      ),
    ]
      .filter(Boolean)
      .sort();
  }, [launches]);

  const applyQuickFilter = (launch: Launch, filterId: string) => {
    switch (filterId) {
      case "special":
        return (
          launch.missionDescription?.toLowerCase().includes("special") || false
        );
      case "success":
        return launch.launchOutcome?.toLowerCase() === "success";
      case "tech":
        return (
          launch.missionDescription?.toLowerCase().includes("technology") ||
          launch.missionDescription?.toLowerCase().includes("development") ||
          false
        );
      case "comms":
        return (
          launch.missionDescription?.toLowerCase().includes("communication") ||
          launch.payload?.toLowerCase().includes("satellite") ||
          false
        );
      default:
        return true;
    }
  };

  const filteredLaunches = useMemo(() => {
    return launches.filter((launch) => {
      const matchesSearch =
        (launch.payload?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (launch.missionDescription?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (launch.rocket?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesYear =
        selectedYear === "all" ||
        new Date(launch.dateTime.split(" | ")[0]).getFullYear().toString() ===
          selectedYear;

      const matchesRocket =
        selectedRocket === "all" || launch.rocket === selectedRocket;
      const matchesOrbit =
        selectedOrbit === "all" || launch.orbit === selectedOrbit;
      const matchesOutcome =
        selectedOutcome === "all" || launch.launchOutcome === selectedOutcome;
      const matchesQuickFilter = applyQuickFilter(launch, activeQuickFilter);

      return (
        matchesSearch &&
        matchesYear &&
        matchesRocket &&
        matchesOrbit &&
        matchesOutcome &&
        matchesQuickFilter
      );
    });
  }, [
    launches,
    searchTerm,
    selectedYear,
    selectedRocket,
    selectedOrbit,
    selectedOutcome,
    activeQuickFilter,
  ]);

  const formatDate = (dateTime: string): string => {
    const [date, time] = dateTime.split(" | ");
    return (
      new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + (time !== "00:00" ? ` | ${time}` : "")
    );
  };

  const getBadgeStyles = (outcome?: string) => {
    switch (outcome?.toLowerCase()) {
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30";
      case "failure":
        return "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30";
      case "partial success":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/50 hover:bg-slate-500/30";
    }
  };

  const generateStars = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 1 + "px",
          height: Math.random() * 2 + 1 + "px",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
        }}
      />
    ));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-space-dark to-space-darker p-6 overflow-hidden">
      <style jsx global>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        {generateStars(100)}
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-space-gold text-center">
            Space Launch Timeline
          </h1>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {quickFilters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveQuickFilter(filter.id)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-300 ease-in-out
                  backdrop-blur-md border-2
                  flex items-center gap-2
                  transform hover:scale-105
                  ${
                    activeQuickFilter === filter.id
                      ? "bg-space-gold/30 border-space-gold text-white shadow-lg shadow-space-gold/20"
                      : "bg-black/30 border-space-gold/30 text-gray-300 hover:border-space-gold/60 hover:text-white"
                  }
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </motion.button>
            ))}
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-space-gold/20 blur-md group-hover:bg-space-gold/30 transition-all rounded-lg" />
            <Input
              placeholder="Search launches, rockets, or missions..."
              className="pl-8 bg-black/40 border-space-gold/50 text-white placeholder-gray-400 relative"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-space-gold" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                value: selectedYear,
                setValue: setSelectedYear,
                placeholder: "Filter by year",
                items: years,
              },
              {
                value: selectedRocket,
                setValue: setSelectedRocket,
                placeholder: "Filter by rocket",
                items: rockets,
              },
              {
                value: selectedOrbit,
                setValue: setSelectedOrbit,
                placeholder: "Filter by orbit",
                items: orbits,
              },
              {
                value: selectedOutcome,
                setValue: setSelectedOutcome,
                placeholder: "Filter by outcome",
                items: outcomes,
              },
            ].map((filter, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-space-gold/20 blur-md group-hover:bg-space-gold/30 transition-all rounded-lg" />
                <Select value={filter.value} onValueChange={filter.setValue}>
                  <SelectTrigger className="bg-black/40 border-space-gold/50 text-white relative">
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-space-darker border-space-gold/50">
                    <SelectItem value="all" className="text-space-gold">
                      All {filter.placeholder.split(" ")[2]}s
                    </SelectItem>
                    {filter.items.map((item) => (
                      <SelectItem
                        key={item}
                        value={item.toString()}
                        className="text-white hover:text-space-gold"
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[600px] rounded-lg">
          <div className="space-y-4 pr-4">
            {filteredLaunches.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No launches found matching your criteria
              </div>
            ) : (
              filteredLaunches.map((launch, idx) => (
                <motion.div
                  key={launch.launchNo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="bg-black/40 backdrop-blur-lg border border-space-gold/30 hover:border-space-gold/60 transition-all group">
                    <CardContent className="p-6">
                      <motion.div
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedLaunch(expandedLaunch === idx ? null : idx)
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {launch.launchOutcome && (
                                <div
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors border ${getBadgeStyles(
                                    launch.launchOutcome
                                  )}`}
                                >
                                  {launch.launchOutcome}
                                </div>
                              )}
                              {launch.rocket && (
                                <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-space-gold/50 text-space-gold flex items-center gap-1 bg-space-gold/10 hover:bg-space-gold/20 transition-colors">
                                  <Rocket className="w-3 h-3" />
                                  {launch.rocket}
                                </div>
                              )}
                              {launch.orbit && (
                                <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30 transition-colors">
                                  {launch.orbit}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-white group-hover:text-space-gold transition-colors">
                                {launch.payload}
                                {launch.payloadMass && (
                                  <span className="text-sm text-gray-400 ml-2">
                                    ({launch.payloadMass}{" "}
                                    {launch.payloadMassUnit})
                                  </span>
                                )}
                              </h3>
                              <div className="text-sm text-gray-400">
                                {formatDate(launch.dateTime)}
                              </div>
                              {launch.launchSite && (
                                <div className="text-sm text-gray-400 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-space-gold" />
                                  Launch Site: {launch.launchSite}
                                </div>
                              )}
                            </div>
                          </div>
                          <ChevronDown
                            className={`transform transition-transform text-space-gold
                              ${expandedLaunch === idx ? "rotate-180" : ""}`}
                          />
                        </div>

                        <AnimatePresence>
                          {expandedLaunch === idx && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-6 space-y-4"
                            >
                              {launch.missionDescription && (
                                <p className="text-gray-300 leading-relaxed">
                                  {launch.missionDescription}
                                </p>
                              )}
                              {launch.notes && (
                                <p className="text-gray-400 italic border-l-2 border-space-gold/50 pl-4">
                                  {launch.notes}
                                </p>
                              )}
                              <div className="text-sm text-gray-400">
                                Flight No: {launch.flightNo} | Launch No:{" "}
                                {launch.launchNo}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default LaunchTimeline;
