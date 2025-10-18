import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon } from './icons';
import useWorkoutAnalytics from '../hooks/useWorkoutAnalytics';
import StatCard from './analytics/StatCard';
import { VolumeChart } from './analytics/VolumeChart';

interface AnalyticsPageProps {
  onOpenSettings: () => void;
}

type TimeRange = '7d' | '30d' | 'all';

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onOpenSettings }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { stats, volumeByDay, isLoading } = useWorkoutAnalytics(timeRange);
  
  const timeRangeOptions: { value: TimeRange, label: string }[] = [
    { value: '7d', label: '7 Giorni' },
    { value: '30d', label: '30 Giorni' },
    { value: 'all', label: 'Sempre' },
  ];

  return (
    <div className="p-4 pt-8 text-foreground min-h-screen pb-24">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <button onClick={onOpenSettings} className="p-2 rounded-full hover:bg-muted">
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
      </header>

      <div className="flex justify-center mb-6">
        <div className="bg-muted p-1 rounded-lg flex gap-1">
            {timeRangeOptions.map(option => (
                <button 
                    key={option.value}
                    onClick={() => setTimeRange(option.value)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${timeRange === option.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card h-24 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <StatCard title="Sessioni Totali" value={stats.totalSessions} icon={<i className="ph ph-list-checks"></i>} />
          <StatCard title="Volume Totale" value={stats.totalVolume.toLocaleString('it-IT')} unit="kg" icon={<i className="ph ph-barbell"></i>} />
          <StatCard title="Durata Media" value={stats.avgDuration} unit="min" icon={<i className="ph ph-timer"></i>} />
          <StatCard title="Set Totali" value={stats.totalSets} icon={<i className="ph ph-stack"></i>} />
        </motion.div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Volume nel Tempo</h2>
        <VolumeChart data={volumeByDay} isLoading={isLoading} />
      </div>

    </div>
  );
};

export default AnalyticsPage;
