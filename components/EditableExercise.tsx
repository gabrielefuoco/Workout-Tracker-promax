import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import type { ITemplateExercise } from '../src/contracts/workout.types';
import { TrashIcon } from './icons';

interface EditableExerciseCardProps {
    exercise: ITemplateExercise;
    onUpdate: (field: keyof ITemplateExercise, value: any) => void;
    onDelete: () => void;
}

const EditableExerciseCard: React.FC<EditableExerciseCardProps> = ({ exercise, onUpdate, onDelete }) => {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={exercise}
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring' }}
            className="bg-card rounded-xl border border-border overflow-hidden relative touch-none"
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                    <div onPointerDown={(e) => dragControls.start(e)} className="cursor-grab p-2 -ml-2 text-muted-foreground/50 hover:text-muted-foreground">
                        <i className="ph ph-list-dashes text-2xl"></i>
                    </div>
                    <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        placeholder="Exercise Name"
                        className="w-full bg-transparent text-lg font-semibold text-foreground border-none outline-none focus:ring-0"
                    />
                    <button onClick={onDelete} aria-label={`Delete ${exercise.name}`} className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">SETS</label>
                        <input type="number" value={exercise.targetSets} onChange={(e) => onUpdate('targetSets', parseInt(e.target.value, 10) || 0)} className="w-full bg-input rounded-md px-3 py-2 text-foreground border border-border outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                     <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">REPS</label>
                        <input type="text" value={exercise.targetReps} onChange={(e) => onUpdate('targetReps', e.target.value)} className="w-full bg-input rounded-md px-3 py-2 text-foreground border border-border outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">WEIGHT (kg)</label>
                        <input type="number" placeholder="Optional" value={exercise.targetWeight ?? ''} onChange={(e) => onUpdate('targetWeight', e.target.value === '' ? undefined : parseFloat(e.target.value))} className="w-full bg-input rounded-md px-3 py-2 text-foreground border border-border outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">REST (sec)</label>
                        <input type="number" placeholder="Optional" value={exercise.restSeconds ?? ''} onChange={(e) => onUpdate('restSeconds', e.target.value === '' ? undefined : parseInt(e.target.value, 10))} className="w-full bg-input rounded-md px-3 py-2 text-foreground border border-border outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                </div>

                <div className="mt-3">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">NOTES</label>
                    <textarea 
                        value={exercise.notes ?? ''} 
                        onChange={(e) => onUpdate('notes', e.target.value)} 
                        placeholder="Optional notes for this exercise..."
                        rows={2}
                        className="w-full bg-input rounded-md px-3 py-2 text-foreground border border-border outline-none focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>
            </div>
        </Reorder.Item>
    );
};

export default EditableExerciseCard;