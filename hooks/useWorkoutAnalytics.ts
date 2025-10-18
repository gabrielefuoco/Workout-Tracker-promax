import { useMemo } from 'react';
import { useSessions } from '../contexts/SessionContext';
// FIX: Changed date-fns imports to use named imports from the main package to fix call signature errors.
// FIX: `startOfDay` is not found in the root module, so it's imported from its submodule.
import { subDays, format } from 'date-fns';
import startOfDay from 'date-fns/startOfDay';
// FIX: `it` locale must be imported as a named export from `date-fns/locale`.
import { it } from 'date-fns/locale';

type TimeRange = '7d' | '30d' | 'all';

const useWorkoutAnalytics = (timeRange: TimeRange) => {
    const { sessions, isLoading } = useSessions();

    const filteredSessions = useMemo(() => {
        if (isLoading) return [];

        const now = new Date();
        let startDate: Date | null = null;
        if (timeRange === '7d') {
            startDate = subDays(now, 7);
        } else if (timeRange === '30d') {
            startDate = subDays(now, 30);
        }

        if (!startDate) return sessions;

        return sessions.filter(s => s.startTime >= startDate!.getTime());
    }, [sessions, timeRange, isLoading]);


    const stats = useMemo(() => {
        const totalSessions = filteredSessions.length;
        if (totalSessions === 0) {
            return {
                totalSessions: 0,
                totalVolume: 0,
                totalSets: 0,
                avgDuration: 0,
            };
        }

        const totalVolume = filteredSessions.reduce((acc, s) => acc + (s.aggregatedData?.totalVolume || 0), 0);
        const totalSets = filteredSessions.reduce((acc, s) => acc + (s.aggregatedData?.totalSets || 0), 0);
        const totalDuration = filteredSessions.reduce((acc, s) => acc + (s.aggregatedData?.durationMinutes || 0), 0);
        const avgDuration = Math.round(totalDuration / totalSessions) || 0;

        return {
            totalSessions,
            totalVolume,
            totalSets,
            avgDuration,
        };
    }, [filteredSessions]);

    const volumeByDay = useMemo(() => {
        if (filteredSessions.length === 0) return [];
        
        // Sort sessions by date to ensure chronological order in the chart
        const sortedSessionsByDate = [...filteredSessions].sort((a, b) => a.startTime - b.startTime);
        
        const volumeMap = new Map<string, number>();

        sortedSessionsByDate.forEach(session => {
            const dateKey = format(startOfDay(new Date(session.startTime)), 'd MMM', { locale: it });
            const currentVolume = volumeMap.get(dateKey) || 0;
            volumeMap.set(dateKey, currentVolume + (session.aggregatedData?.totalVolume || 0));
        });

        return Array.from(volumeMap.entries()).map(([date, volume]) => ({
            date: date,
            Volume: Math.round(volume),
        }));
    }, [filteredSessions]);
    

    return { stats, volumeByDay, isLoading };
};

export default useWorkoutAnalytics;