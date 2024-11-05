import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite } from "lucide-react";

const PayloadStatsCard = ({ launches }) => {
  // Calculate payload statistics
  const payloadStats = launches.reduce(
    (acc, launch) => {
      // Only count successful launches and ensure payloadMass exists
      if (launch.launchOutcome === "Success" && launch.payloadMass) {
        // Convert payload mass to number since it's stored as string in JSON
        const mass = parseFloat(launch.payloadMass);

        // Add to total
        acc.total += mass;

        // Add to specific rocket category
        if (launch.rocket === "PSLV") {
          acc.pslv += mass;
        }
        // Handle GSLV variants
        else if (
          launch.rocket === "GSLV Mk I" ||
          (launch.rocket === "GSLV" && launch.configuration === "Mk I")
        ) {
          acc.gslvMk1 += mass;
        } else if (
          launch.rocket === "GSLV Mk II" ||
          (launch.rocket === "GSLV" && launch.configuration === "Mk II")
        ) {
          acc.gslvMk2 += mass;
        }
        // Handle LVM3/GSLV Mk III
        else if (launch.rocket === "LVM3" || launch.rocket === "GSLV Mk III") {
          acc.gslvMk3 += mass;
        }
      }
      return acc;
    },
    {
      total: 0,
      pslv: 0,
      gslvMk1: 0,
      gslvMk2: 0,
      gslvMk3: 0,
    }
  );

  // Function to format mass with appropriate unit
  const formatMass = (mass) => {
    if (mass >= 1000) {
      return `${(mass / 1000).toFixed(1)} tonnes`;
    }
    return `${Math.round(mass)} kg`;
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-none mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-space-gold">
          <Satellite className="w-6 h-6 text-space-gold" />
          Total Payload Delivered to Orbit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-300">Total Payload</div>
            <div className="text-xl font-bold text-space-gold">
              {formatMass(payloadStats.total)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-300">PSLV</div>
            <div className="text-xl font-bold text-space-gold">
              {formatMass(payloadStats.pslv)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-300">GSLV Mk I</div>
            <div className="text-xl font-bold text-space-gold">
              {formatMass(payloadStats.gslvMk1)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-300">GSLV Mk II</div>
            <div className="text-xl font-bold text-space-gold">
              {formatMass(payloadStats.gslvMk2)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <div className="text-sm text-gray-300">GSLV Mk III/LVM3</div>
            <div className="text-xl font-bold text-space-gold">
              {formatMass(payloadStats.gslvMk3)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayloadStatsCard;
