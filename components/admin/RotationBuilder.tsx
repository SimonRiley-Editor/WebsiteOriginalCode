"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, Image as ImageIcon } from "lucide-react";
import type { RotationConfig, TeamRotationEvent } from "@/types/guide";
import { TeamRotationTimeline } from "@/components/ww/TeamRotationTimeline";

interface RotationBuilderProps {
  value: RotationConfig | undefined;
  onChange: (val: RotationConfig) => void;
}

const DEFAULT_CONFIG: RotationConfig = {
  totalDuration: 25,
  slotNames: ["Slot 1 — Main", "Slot 2 — Sub", "Slot 3 — Support"],
  events: [],
};

const EVENT_TYPES = ['intro', 'skill', 'ultimate', 'outro', 'echo'] as const;

export const RotationBuilder: React.FC<RotationBuilderProps> = ({ value, onChange }) => {
  const config = value || DEFAULT_CONFIG;
  const events = config.events || [];
  const slotNames = config.slotNames || DEFAULT_CONFIG.slotNames!;

  const updateConfig = (updates: Partial<RotationConfig>) => {
    onChange({ ...config, ...updates });
  };

  const updateSlotName = (index: 0 | 1 | 2, name: string) => {
    const newNames = [...slotNames] as [string, string, string];
    newNames[index] = name;
    updateConfig({ slotNames: newNames });
  };

  const addEvent = () => {
    const newEvent: TeamRotationEvent = {
      id: Math.random().toString(36).substr(2, 9),
      characterSlot: 1,
      characterName: "Resonator",
      type: "skill",
      startTime: 0,
      duration: 2,
      label: "Skill",
      avatarUrl: "",
    };
    updateConfig({ events: [...events, newEvent].sort((a, b) => a.startTime - b.startTime) });
  };

  const updateEvent = (index: number, updates: Partial<TeamRotationEvent>) => {
    const newEvents = [...events];
    newEvents[index] = { ...newEvents[index], ...updates };
    // Re-sort events by start time when time changes
    if (updates.startTime !== undefined) {
      newEvents.sort((a, b) => a.startTime - b.startTime);
    }
    updateConfig({ events: newEvents });
  };

  const removeEvent = (id: string) => {
    updateConfig({ events: events.filter(e => e.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Global Config */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-amber-400" /> Timeline Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Duration (s)</label>
            <input
              type="number"
              value={config.totalDuration}
              onChange={(e) => updateConfig({ totalDuration: Number(e.target.value) || 10 })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          
          {[0, 1, 2].map((slotIdx) => (
            <div key={slotIdx}>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Slot {slotIdx + 1} Name</label>
              <input
                type="text"
                value={slotNames[slotIdx]}
                onChange={(e) => updateSlotName(slotIdx as 0|1|2, e.target.value)}
                placeholder={`e.g. Slot ${slotIdx + 1}`}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-[#0f172a] p-1 rounded-[2.25rem] border border-slate-700/50 shadow-2xl overflow-hidden" style={ { height: '320px' } }>
        <TeamRotationTimeline config={config} elementColor="#f59e0b" />
      </div>

      {/* Events Editor */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Rotation Events</h3>
          <button
            onClick={addEvent}
            className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-amber-500/30"
          >
            <Plus size={14} /> Add Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm">
            No events added yet. Click &quot;Add Event&quot; to start building the rotation.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((evt, idx) => (
              <div key={evt.id} className="grid grid-cols-12 gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 items-start">
                {/* Slot */}
                <div className="col-span-12 sm:col-span-2">
                  <label className="block text-[10px] uppercase text-slate-500 mb-1">Slot</label>
                  <select
                    value={evt.characterSlot}
                    onChange={(e) => updateEvent(idx, { characterSlot: Number(e.target.value) as 1|2|3 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                  >
                    <option value={1}>1 (Main)</option>
                    <option value={2}>2 (Sub)</option>
                    <option value={3}>3 (Support)</option>
                  </select>
                </div>

                {/* Type & Label */}
                <div className="col-span-12 sm:col-span-3 space-y-2">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Type</label>
                    <select
                      value={evt.type}
                      onChange={(e) => updateEvent(idx, { type: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white capitalize"
                    >
                      {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={evt.label || ""}
                      onChange={(e) => updateEvent(idx, { label: e.target.value })}
                      placeholder="Label (e.g. E)"
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Timing */}
                <div className="col-span-12 sm:col-span-3 space-y-2">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Start (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={evt.startTime}
                      onChange={(e) => updateEvent(idx, { startTime: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-500 mb-1">Duration (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={evt.duration}
                      onChange={(e) => updateEvent(idx, { duration: Number(e.target.value) || 1 })}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="col-span-12 sm:col-span-3">
                  <label className="block text-[10px] uppercase text-slate-500 mb-1 flex items-center gap-1"><ImageIcon size={10} /> Avatar URL</label>
                  <input
                    type="text"
                    value={evt.avatarUrl || ""}
                    onChange={(e) => updateEvent(idx, { avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs text-white"
                  />
                </div>

                {/* Delete */}
                <div className="col-span-12 sm:col-span-1 flex items-end justify-end h-full pt-4">
                  <button
                    onClick={() => removeEvent(evt.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    title="Remove Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
