import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkoutAnalytics } from '../hooks/useWorkoutAnalytics';
import { VolumeChart } from './analytics/VolumeChart';
import StatCard from './analytics/StatCard';

interface AnalyticsPageProps {
    onOpenSettings: () => void;
}

type Timeframe = '7d' | '30d' | 'all';

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onOpenSettings }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('30d');
    const { totalVolume, volumeOverTime, totalSessions, avgDuration } = useWorkoutAnalytics(timeframe);

    const timeframeOptions: { label: string; value: Timeframe }[] = [
        { label: '7 Giorni', value: '7d' },
        { label: '30 Giorni', value: '30d' },
        { label: 'Sempre', value: 'all' },
    ];

    return (
        <div className="w-full max-w-[600px] mx-auto p-8 sm:p-6 min-h-screen pb-24">
            <motion.header 
              className="flex justify-between items-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
            >
                <div className="flex items-center gap-4">
                    <div className="text-5xl text-primary leading-none">
                        <i className="ph-fill ph-chart-line-up"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Analytics</h1>
                        <p className="text-sm text-muted-foreground font-medium">I tuoi progressi nel tempo</p>
                    </div>
                </div>
                <button onClick={onOpenSettings} className="text-2xl text-muted-foreground p-2 rounded-full transition-colors duration-300 hover:text-foreground hover:bg-card hover:rotate-45">
                    <i className="ph ph-gear-six"></i>
                </button>
            </motion.header>
            
            <main>
                <div className="mb-6">
                    <div className="flex bg-card p-1 rounded-lg border border-border">
                        {timeframeOptions.map(opt => (
                            <button 
                                key={opt.value}
                                onClick={() => setTimeframe(opt.value)}
                                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${timeframe === opt.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div 
                    key={timeframe}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        <StatCard title="Volume Totale" value={totalVolume.toLocaleString('it-IT')} unit="kg" icon={<i className="ph-bold ph-barbell"></i>} />
                        <StatCard title="Sessioni" value={totalSessions} icon={<i className="ph-bold ph-list-checks"></i>} />
                        <StatCard title="Durata Media" value={avgDuration} unit="min" icon={<i className="ph-bold ph-timer"></i>} />
                    </motion.div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">Volume nel Tempo</h2>
                        <VolumeChart data={volumeOverTime} isLoading={false} />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AnalyticsPage;