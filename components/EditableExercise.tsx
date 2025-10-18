import React, { useState } from 'react';
import type { Exercise, SetGroup } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface EditableExerciseProps {
  exercise: Exercise;
  onSave: (updatedExercise: Exercise) => void;
  onCancel: () => void;
}

const EditableExercise: React.FC<EditableExerciseProps> = ({ exercise, onSave, onCancel }) => {
  const [name, setName] = useState(exercise.name);
  const [setGroups, setSetGroups] = useState<SetGroup[]>(exercise.setGroups);

  const handleSetGroupChange = (index: number, field: keyof SetGroup, value: string | number | undefined) => {
    const updatedSetGroups = [...setGroups];
    (updatedSetGroups[index] as any)[field] = value;
    setSetGroups(updatedSetGroups);
  };

  const addSetGroup = () => {
    setSetGroups([
      ...setGroups,
      { id: `new-sg-${Date.now()}`, name: 'New Set Group', target: 'N/A', performedSets: [], restSeconds: 90 }
    ]);
  };

  const removeSetGroup = (index: number) => {
    setSetGroups(setGroups.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      ...exercise,
      name,
      setGroups,
    });
  };

  return (
    <div className="text-foreground">
      <div className="mb-4">
        <label htmlFor="exerciseName" className="block text-sm font-medium text-muted-foreground mb-1">Exercise Name</label>
        <input
          id="exerciseName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
        />
      </div>

      <h3 className="text-lg font-semibold mb-2">Set Groups</h3>
      <div className="max-h-64 overflow-y-auto pr-2">
        {setGroups.map((sg, index) => (
          <div key={sg.id} className="mb-4 p-3 border border-border rounded-lg bg-card/50">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={sg.name}
                onChange={(e) => handleSetGroupChange(index, 'name', e.target.value)}
                className="bg-input rounded-md px-2 py-1 text-foreground font-semibold w-2/3"
              />
              <button onClick={() => removeSetGroup(index)} className="text-destructive hover:text-destructive/90">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <div>
                <label className="text-xs text-muted-foreground">Target</label>
                <input
                    type="text"
                    value={sg.target}
                    onChange={(e) => handleSetGroupChange(index, 'target', e.target.value)}
                    className="w-full bg-input rounded-md px-2 py-1 text-foreground text-sm mt-1"
                />
            </div>
            <div className="mt-2">
              <label className="text-xs text-muted-foreground">Rest (seconds)</label>
              <input
                type="number"
                placeholder="90"
                value={sg.restSeconds ?? ''}
                onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    handleSetGroupChange(index, 'restSeconds', value)
                }}
                className="w-full bg-input rounded-md px-2 py-1 text-foreground text-sm mt-1"
              />
          </div>
          </div>
        ))}
      </div>

      <button onClick={addSetGroup} className="flex items-center text-primary hover:text-primary/90 my-4">
        <PlusIcon className="h-5 w-5 mr-1" /> Add Set Group
      </button>

      <div className="flex justify-end space-x-4 border-t border-border pt-4 mt-2">
        <button onClick={onCancel} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80">Cancel</button>
        <button onClick={handleSave} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Save Changes</button>
      </div>
    </div>
  );
};

export default EditableExercise;