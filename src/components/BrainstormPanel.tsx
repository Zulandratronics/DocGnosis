import React from 'react';
import { Lightbulb, Zap, ArrowRight, User, Cpu, Sparkles, CheckCircle, Clock } from 'lucide-react';
import { BrainstormItem, ActionItem } from '../types';

interface BrainstormPanelProps {
  brainstormItems: BrainstormItem[];
  onLaunchAgent: (brainstormTitle: string, actionItem: ActionItem) => void;
}

export function BrainstormPanel({ brainstormItems, onLaunchAgent }: BrainstormPanelProps) {
  if (!brainstormItems || brainstormItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center bg-neutral-50/50 dark:bg-neutral-900/40">
        <Lightbulb className="mx-auto h-8 w-8 text-neutral-300 dark:text-neutral-700" />
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">No proactive brainstorming has been generated for this file yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-550">
          Proactive AI Brainstorming & Agent Operations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brainstormItems.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-850 p-5 transition-all shadow-xs hover:shadow-md hover:border-neutral-200/80 dark:hover:border-neutral-700"
          >
            <div>
              {/* Header */}
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-neutral-950">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <h4 className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                  {item.title}
                </h4>
              </div>

              {/* Concept */}
              <p className="text-xs text-neutral-500 dark:text-neutral-405 leading-relaxed mb-5">
                {item.concept}
              </p>
            </div>

            {/* Actions Stack */}
            <div className="space-y-3.5 border-t border-neutral-50 dark:border-neutral-800/60 pt-4">
              <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-1">
                EXECUTION PIPELINE
              </span>
              
              {item.actions.map((action) => {
                const isCompleted = action.offloadStatus === 'completed';
                const isRunning = action.offloadStatus === 'running';

                return (
                  <div
                    key={action.id}
                    className={`rounded-lg border p-3 transition ${
                      isCompleted
                        ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-955/10'
                        : isRunning
                        ? 'border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-955/10 animate-pulse'
                        : 'border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-medium text-neutral-700 dark:text-neutral-200 leading-normal">
                        {action.action}
                      </p>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-neutral-100/50 dark:border-neutral-800/50 pt-2 text-[10px]">
                      <span className="flex items-center gap-1 text-neutral-450 dark:text-neutral-500">
                        <Clock className="h-3 w-3" /> {action.timeEstimate}
                      </span>

                      {/* Action trigger button */}
                      {action.offloadable ? (
                        <button
                          onClick={() => onLaunchAgent(item.title, action)}
                          className={`flex items-center gap-1 rounded px-2 py-0.5 font-sans font-medium uppercase tracking-wider transition ${
                            isCompleted
                              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200/80 dark:hover:bg-emerald-900/60'
                              : isRunning
                              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                              : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200'
                          }`}
                        >
                          <Cpu className="h-2.5 w-2.5" />
                          <span>
                            {isCompleted ? 'View Artifact' : isRunning ? 'Offloading...' : 'Offload to Agent'}
                          </span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 text-neutral-500 dark:text-neutral-400 font-sans font-medium uppercase tracking-wider">
                          <User className="h-2.5 w-2.5" /> Human Offline Action
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
