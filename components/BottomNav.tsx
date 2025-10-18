import React from 'react';
import { motion } from 'framer-motion';

type Page = 'workouts' | 'analytics';

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: string, iconFill: string }[] = [
    { page: 'workouts', label: 'Allenamenti', icon: 'ph-barbell', iconFill: 'ph-fill ph-barbell' },
    { page: 'analytics', label: 'Analytics', icon: 'ph-chart-line-up', iconFill: 'ph-fill ph-chart-line-up' }
];

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
    return (
        <motion.div 
            className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border z-40"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
        >
            <div className="flex justify-around items-center h-full max-w-md mx-auto">
                {navItems.map(item => (
                    <button 
                        key={item.page}
                        onClick={() => onNavigate(item.page)}
                        className="flex flex-col items-center justify-center gap-1 w-24 text-muted-foreground transition-colors"
                    >
                        <div className={`text-3xl transition-all duration-300 ${currentPage === item.page ? 'text-primary' : ''}`}>
                             <i className={currentPage === item.page ? item.iconFill : item.icon}></i>
                        </div>
                        <span className={`text-xs font-semibold transition-colors duration-300 ${currentPage === item.page ? 'text-primary' : ''}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

export default BottomNav;