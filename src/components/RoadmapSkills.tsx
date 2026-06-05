import React from 'react';
import { Award, BookOpen, Clock, CheckSquare, Square, Check, ExternalLink } from 'lucide-react';
import { SkillItem, RoadmapMilestone } from '../types';

interface RoadmapSkillsProps {
  skills: SkillItem[];
  roadmap: RoadmapMilestone[];
  onToggleMilestone: (index: number) => void;
}

export function RoadmapSkills({ skills, roadmap, onToggleMilestone }: RoadmapSkillsProps) {
  // Calculate completed milestones percentage
  const completedMilestones = roadmap.filter((r) => r.checked).length;
  const totalMilestones = roadmap.length || 1;
  const progressPercent = Math.round((completedMilestones / totalMilestones) * 100);

  // Return background colors based on category
  const getCategoryColor = (cat: string) => {
    const lowercase = cat.toLowerCase();
    if (lowercase.includes('tech') || lowercase.includes('soft')) {
      return 'bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-900/30';
    }
    if (lowercase.includes('creat') || lowercase.includes('write')) {
      return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
    }
    if (lowercase.includes('leadr') || lowercase.includes('bus') || lowercase.includes('oper')) {
      return 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-900/30';
    }
    return 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-100 dark:border-neutral-700';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Skill Matrix Board */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Skills Acquisition Portfolio
          </span>
          <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
            Gained Skill Matrix
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 leading-normal">
            Real-time competency profiles unlocked from analyzing this document’s intellectual content.
          </p>
        </div>

        {skills && skills.length > 0 ? (
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-850 p-4.5 transition hover:border-neutral-200/60 dark:hover:border-neutral-700"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <span className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {skill.name}
                    </span>
                    <span className={`inline-block ml-2 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500">
                    +{skill.proficiencyGained}%
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full bg-neutral-900 dark:bg-neutral-300 transition-all duration-500"
                    style={{ width: `${skill.proficiencyGained}%` }}
                  />
                </div>

                <p className="text-[11px] text-neutral-550 dark:text-neutral-400 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 p-6 text-center bg-neutral-50/50 dark:bg-neutral-900/40">
            <Award className="mx-auto h-6 w-6 text-neutral-300 dark:text-neutral-700" />
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-550">Analyze a document to populate the skill matrix.</p>
          </div>
        )}
      </div>

      {/* Structured Roadmap */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Interactive Execution Plan
            </span>
            <h3 className="font-sans text-lg font-bold text-neutral-900 dark:text-white tracking-tight mt-1">
              Curated Application Roadmap
            </h3>
          </div>

          {/* Progress gauge */}
          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-850 px-3 py-1.5 rounded-lg border border-neutral-100 dark:border-neutral-800">
            <div className="text-right">
              <div className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">ROADMAP COMPLETE</div>
              <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">{progressPercent}%</div>
            </div>
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
          </div>
        </div>

        {roadmap && roadmap.length > 0 ? (
          <div className="relative border-l border-neutral-205 dark:border-neutral-800 pl-6 ml-3 space-y-8">
            {roadmap.map((stage, index) => (
              <div key={index} className="relative group">
                {/* Node circle on timeline */}
                <button
                  onClick={() => onToggleMilestone(index)}
                  className={`absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300 shadow-xs ${
                    stage.checked
                      ? 'bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100 text-white dark:text-neutral-900'
                      : 'bg-white dark:bg-neutral-850 border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:border-neutral-500 dark:hover:border-neutral-400'
                  }`}
                  title="Mark milestone complete"
                >
                  {stage.checked ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px] font-mono">{index + 1}</span>}
                </button>

                <div className={`rounded-xl border p-5 transition-all ${
                  stage.checked ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/25 dark:bg-neutral-900/10' : 'border-neutral-105 dark:border-neutral-800 bg-white dark:bg-neutral-850'
                }`}>
                  <div className="flex items-start justify-between gap-2.5 mb-2">
                    <div>
                      <span className="font-mono text-[9px] font-bold text-neutral-400 dark:text-neutral-550 uppercase tracking-widest block">
                        {stage.milestone} • {stage.duration}
                      </span>
                      <h4 className={`font-sans text-sm font-semibold tracking-tight transition mt-0.5 ${
                        stage.checked ? 'text-neutral-550 line-through' : 'text-neutral-800 dark:text-neutral-200'
                      }`}>
                        {stage.title}
                      </h4>
                    </div>
                  </div>

                  <p className={`text-xs leading-relaxed mb-4 ${stage.checked ? 'text-neutral-450 dark:text-neutral-500' : 'text-neutral-550 dark:text-neutral-400'}`}>
                    {stage.description}
                  </p>

                  {/* Resource recommendations */}
                  {stage.resources && stage.resources.length > 0 && (
                    <div className="border-t border-neutral-100/60 dark:border-neutral-800 pt-3">
                      <span className="flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 mb-2">
                        <BookOpen className="h-3 w-3" /> STUDY CONTEXT RESOURCES
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {stage.resources.map((link, lIdx) => {
                          const isUrl = link.includes('http://') || link.includes('https://');
                          let displayTitle = link;
                          let cleanUrl = '';

                          if (isUrl) {
                            const urlRegex = /(https?:\/\/[^\s)]+)/;
                            const match = link.match(urlRegex);
                            if (match) {
                              cleanUrl = match[0];
                              displayTitle = link.replace(cleanUrl, '').replace(/[\(\s)at]+$/, '').trim() || 'Official Docs';
                            }
                          }

                          return isUrl ? (
                            <a
                              key={lIdx}
                              href={cleanUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-800 px-2.5 py-1 text-[11px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-950 dark:hover:text-white transition shadow-xs"
                            >
                              <span>{displayTitle}</span>
                              <ExternalLink className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
                            </a>
                          ) : (
                            <span
                              key={lIdx}
                              className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-0.5 text-[11px] text-neutral-500 dark:text-neutral-400"
                            >
                              🔑 {link}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center bg-neutral-50/50 dark:bg-neutral-900/40">
            <CheckSquare className="mx-auto h-6 w-6 text-neutral-300 dark:text-neutral-700" />
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-550">Generate a study roadmap by uploading a document.</p>
          </div>
        )}
      </div>
    </div>
  );
}
