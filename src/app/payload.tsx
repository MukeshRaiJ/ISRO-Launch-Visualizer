import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

const PayloadAnalysis = ({ launches }) => {
  const parseDate = (dateString) => {
    const [date, time] = dateString.split(" | ");
    return new Date(`${date}T${time}`);
  };

  const launchesByYear = launches.reduce((acc, launch) => {
    const year = parseDate(launch.dateTime).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(launch);
    return acc;
  }, {});

  const payloadData = Object.entries(launchesByYear).map(
    ([year, yearLaunches]) => ({
      year,
      totalPayload: yearLaunches.reduce((sum, launch) => {
        const mass = parseFloat(launch.payloadMass) || 0;
        return sum + mass;
      }, 0),
    })
  );

  return (
    <Card className="bg-white/5 border-none">
      <CardContent className="pt-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payloadData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="year" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "none" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar
                dataKey="totalPayload"
                fill="#4ECDC4"
                animationDuration={1500}
              >
                {payloadData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayloadAnalysis;
