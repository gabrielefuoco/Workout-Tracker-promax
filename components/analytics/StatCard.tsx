import React from 'react';
import { motion, Variants } from 'framer-motion';

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ReactNode;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};


const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon }) => {
    return (
        <motion.div 
            className="bg-card p-4 rounded-xl border border-border flex items-center gap-4"
            variants={cardVariants}
        >
            <div className="text-primary text-3xl bg-primary/10 p-3 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <p className="text-2xl font-bold text-foreground">
                    {value} <span className="text-base font-medium text-muted-foreground">{unit}</span>
                </p>
            </div>
        </motion.div>
    );
};

export default StatCard;