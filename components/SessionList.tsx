import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useSessions } from '../contexts/SessionContext';
import { format, formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import type { IWorkoutSession } from '../types';

interface SessionListProps {
    onOpenAnalytics: () => void;
    onOpenSettings: () => void;
}

const SessionList: React.FC<SessionListProps> = ({ onOpenAnalytics, onOpenSettings }) => {
    const { sessions } = useSessions();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        setCurrentDate(`Oggi è il ${format(today, 'd MMMM yyyy', { locale: it })}`);
    }, []);

    const gridVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
    };

    const headerVariants: Variants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    }
    
    const fabVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25, delay: 0.3 } },
    };

    const sortedSessions = [...sessions].sort((a, b) => (b.startTime || 0) - (a.startTime || 0));

    const renderSessionBadge = (session: IWorkoutSession) => {
        switch (session.status) {
            case 'processing':
                return (
                    <div className="text-xs font-semibold text-primary flex items-center gap-1.5 flex-shrink-0 bg-primary/10 px-2 py-1 rounded-md">
                        <i className="ph ph-spinner animate-spin"></i>
                        <span>Elaborazione...</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-xs font-semibold text-destructive-foreground flex items-center gap-1.5 flex-shrink-0 bg-destructive px-2 py-1 rounded-md">
                        <i className="ph-fill ph-warning-circle"></i>
                        <span>Fallito</span>
                    </div>
                );
            case 'completed':
            default:
                 return (
                    <div className="text-xs font-semibold text-accent-gold flex items-center gap-1.5 flex-shrink-0 bg-accent-gold/10 px-2 py-1 rounded-md">
                        <i className="ph-fill ph-clock"></i>
                        <span>
                            {formatDistanceToNow(new Date(session.startTime), { addSuffix: true, locale: it })}
                        </span>
                    </div>
                );
        }
    }

    const renderSessionStatusContent = (session: IWorkoutSession) => {
        switch (session.status) {
            case 'completed':
                return (
                    <div className="flex justify-around text-center">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Volume</p>
                            <p className="font-bold text-foreground">{session.aggregatedData?.totalVolume.toLocaleString('it-IT')} kg</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Durata</p>
                            <p className="font-bold text-foreground">{session.aggregatedData?.durationMinutes} min</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Set</p>
                            <p className="font-bold text-foreground">{session.aggregatedData?.totalSets}</p>
                        </div>
                    </div>
                );
            case 'processing':
                return (
                    <div className="flex items-center justify-center text-center text-muted-foreground h-[41px]">
                        <i className="ph ph-spinner animate-spin text-xl mr-2"></i>
                        <span>Elaborazione in corso...</span>
                    </div>
                );
            case 'failed':
                return (
                    <div className="text-center text-destructive py-1">
                        <p className="font-semibold text-sm">Elaborazione fallita</p>
                        <p className="text-xs break-words">{session.errorMessage}</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="w-full max-w-[600px] mx-auto p-8 sm:p-6 min-h-screen">
            <motion.header 
              className="flex justify-between items-center mb-10"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
            >
                <div className="flex items-center gap-4">
                    <div className="text-5xl text-primary leading-none">
                        <i className="ph-fill ph-user-circle"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">Ciao!</h1>
                        <p className="text-sm text-muted-foreground font-medium">{currentDate}</p>
                    </div>
                </div>
                <button onClick={onOpenSettings} className="text-2xl text-muted-foreground p-2 rounded-full transition-colors duration-300 hover:text-foreground hover:bg-card hover:rotate-45">
                    <i className="ph ph-gear-six"></i>
                </button>
            </motion.header>

            <motion.main 
              className="grid grid-cols-1 gap-5"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
                {sortedSessions.map((session) => (
                    <motion.div key={session.id} variants={cardVariants}>
                        <div className="workout-card-link">
                            <div className="workout-card bg-card border border-border rounded-lg p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-1">{session.name}</h2>
                                        <p className="text-sm font-medium text-muted-foreground capitalize">
                                            {format(new Date(session.startTime), 'eeee, d MMM', { locale: it })}
                                        </p>
                                    </div>
                                    {renderSessionBadge(session)}
                                </div>
                                <div className="border-t border-border pt-4 mt-4">
                                    {renderSessionStatusContent(session)}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.main>
            
            <motion.button
                onClick={onOpenAnalytics}
                className="fixed bottom-6 right-6 w-[60px] h-[60px] bg-gradient-to-br from-primary to-primary-focus rounded-full flex justify-center items-center text-primary-foreground text-3xl shadow-lg"
                style={{ boxShadow: '0 8px 25px -8px hsl(var(--color-primary))' }}
                variants={fabVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1, rotate: -15 }}
                whileTap={{ scale: 0.95 }}
                title="View Analytics"
            >
                <i className="ph ph-chart-line-up"></i>
            </motion.button>
        </div>
    );
};

export default SessionList;