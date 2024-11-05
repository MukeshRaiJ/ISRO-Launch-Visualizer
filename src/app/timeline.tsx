import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search, Rocket } from "lucide-react";
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

type BadgeVariant = "success" | "destructive" | "warning" | "secondary";

const LaunchTimeline: React.FC<LaunchTimelineProps> = ({ launches }) => {
  const [expandedLaunch, setExpandedLaunch] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedRocket, setSelectedRocket] = useState<string>("all");
  const [selectedOrbit, setSelectedOrbit] = useState<string>("all");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("all");

  // Extract unique values for filters
  const years = useMemo<number[]>(() => {
    const uniqueYears = [
      ...new Set(
        launches.map((launch) =>
          new Date(launch.dateTime.split(" | ")[0]).getFullYear()
        )
      ),
    ].sort((a, b) => b - a);
    return uniqueYears;
  }, [launches]);

  const rockets = useMemo<string[]>(() => {
    const uniqueRockets = [
      ...new Set(launches.map((launch) => launch.rocket || "Unspecified")),
    ]
      .filter(Boolean)
      .sort();
    return uniqueRockets;
  }, [launches]);

  const orbits = useMemo<string[]>(() => {
    const uniqueOrbits = [
      ...new Set(launches.map((launch) => launch.orbit || "Unspecified")),
    ]
      .filter(Boolean)
      .sort();
    return uniqueOrbits;
  }, [launches]);

  const outcomes = useMemo<string[]>(() => {
    const uniqueOutcomes = [
      ...new Set(
        launches.map((launch) => launch.launchOutcome || "Unspecified")
      ),
    ]
      .filter(Boolean)
      .sort();
    return uniqueOutcomes;
  }, [launches]);

  // Filter launches based on search term and filters
  const filteredLaunches = useMemo<Launch[]>(() => {
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

      return (
        matchesSearch &&
        matchesYear &&
        matchesRocket &&
        matchesOrbit &&
        matchesOutcome
      );
    });
  }, [
    launches,
    searchTerm,
    selectedYear,
    selectedRocket,
    selectedOrbit,
    selectedOutcome,
  ]);

  // Format date string
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

  const getOutcomeBadgeVariant = (outcome?: string): BadgeVariant => {
    switch (outcome?.toLowerCase()) {
      case "success":
        return "success";
      case "failure":
        return "destructive";
      case "partial success":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search launches, rockets, or missions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRocket} onValueChange={setSelectedRocket}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by rocket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rockets</SelectItem>
              {rockets.map((rocket) => (
                <SelectItem key={rocket} value={rocket}>
                  {rocket}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedOrbit} onValueChange={setSelectedOrbit}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by orbit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orbits</SelectItem>
              {orbits.map((orbit) => (
                <SelectItem key={orbit} value={orbit}>
                  {orbit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              {outcomes.map((outcome) => (
                <SelectItem key={outcome} value={outcome}>
                  {outcome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
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
                <Card className="bg-white/5 border-none hover:bg-white/10 transition-colors">
                  <CardContent className="p-4">
                    <motion.div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedLaunch(expandedLaunch === idx ? null : idx)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {launch.launchOutcome && (
                              <Badge
                                variant={getOutcomeBadgeVariant(
                                  launch.launchOutcome
                                )}
                              >
                                {launch.launchOutcome}
                              </Badge>
                            )}
                            {launch.rocket && (
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Rocket className="w-3 h-3" />
                                {launch.rocket}
                              </Badge>
                            )}
                            {launch.orbit && (
                              <Badge variant="secondary">{launch.orbit}</Badge>
                            )}
                            <span className="text-sm text-gray-300">
                              {formatDate(launch.dateTime)}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-semibold">
                              {launch.payload}
                              {launch.payloadMass && (
                                <span className="text-sm text-gray-400 ml-2">
                                  ({launch.payloadMass} {launch.payloadMassUnit}
                                  )
                                </span>
                              )}
                            </h3>
                            {launch.launchSite && (
                              <div className="text-sm text-gray-400">
                                Launch Site: {launch.launchSite}
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          className={`transform transition-transform ${
                            expandedLaunch === idx ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {expandedLaunch === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4"
                          >
                            {launch.missionDescription && (
                              <p className="text-gray-300">
                                {launch.missionDescription}
                              </p>
                            )}
                            {launch.notes && (
                              <p className="text-gray-400 mt-2 italic">
                                {launch.notes}
                              </p>
                            )}
                            <div className="mt-2 text-sm text-gray-400">
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
  );
};

export default LaunchTimeline;
