import { useMemo } from 'react';
import { useSessions } from '../contexts/SessionContext';
// FIX: Removed unused import 'parseISO' which was causing an error.
import { subDays } from 'date-fns';

type Timeframe = '7d' | '30d' | 'all';

function getStartDate(timeframe: Timeframe) {
  if (timeframe === 'all') return new Date(0); // Inizio dell'epoca
  const days = parseInt(timeframe.replace('d', ''));
  return subDays(new Date(), days);
}

export function useWorkoutAnalytics(timeframe: Timeframe = '30d') {
  const { sessions } = useSessions();

  const analyticsData = useMemo(() => {
    const startDate = getStartDate(timeframe);
    
    const filteredSessions = sessions
        .filter(s => s.status === 'completed' && s.endTime && new Date(s.endTime) >= startDate)
        .sort((a, b) => (a.endTime || 0) - (b.endTime || 0));

    const totalVolume = filteredSessions.reduce((sum, s) => sum + (s.aggregatedData?.totalVolume || 0), 0);
    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, s) => sum + (s.aggregatedData?.durationMinutes || 0), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

    const volumeOverTime = filteredSessions.map(s => ({
        date: new Date(s.endTime!).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }),
        Volume: s.aggregatedData?.totalVolume || 0,
    }));

    return { sessions: filteredSessions, totalVolume, volumeOverTime, totalSessions, avgDuration };
  }, [sessions, timeframe]);

  return analyticsData;
}
