import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VolumeChartProps {
    data: { date: string; Volume: number }[];
    isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 border border-border rounded-lg shadow-lg">
          <p className="label text-sm font-bold">{`${label}`}</p>
          <p className="intro text-popover-foreground">{`Volume: ${payload[0].value.toLocaleString('it-IT')} kg`}</p>
        </div>
      );
    }
    return null;
  };

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, isLoading }) => {

    if (isLoading) return <div className="h-80 w-full animate-pulse bg-card rounded-lg" />;
    if (!data || data.length === 0) return (
        <div className="h-80 w-full flex items-center justify-center bg-card rounded-lg text-muted-foreground">
            Nessun dato da visualizzare per questo periodo.
        </div>
    );

    const primaryColor = 'hsl(var(--color-primary))';
    const textColor = 'hsl(var(--color-muted-foreground))';
    const borderColor = 'hsl(var(--color-border))';

    return (
        <div className="w-full h-80 bg-card rounded-xl border border-border p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} unit="kg" width={50} tickFormatter={(value) => new Intl.NumberFormat('it-IT', {notation: "compact", compactDisplay: "short"}).format(value)} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="Volume" stroke={primaryColor} strokeWidth={2} activeDot={{ r: 8, fill: primaryColor, stroke: 'none' }} dot={{r: 4, fill: primaryColor, stroke: 'none'}}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}