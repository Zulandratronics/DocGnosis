import React, { useState, useEffect } from 'react';
import {
  Library,
  Sliders,
  Sparkles,
  Cpu,
  BookOpen,
  Compass,
  CheckCircle2,
  XCircle,
  Info,
  LayoutDashboard,
  FileText,
  Activity,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Terminal,
  Zap,
  Sun,
  Moon,
  Download,
  ChevronDown,
  Settings,
  Flame,
  Layers,
  History,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { PRESET_DOCUMENTS } from './data/presets';
import { INITIAL_ANALYSES } from './data/preloaded';
import { AnalyzedDocument, ActionItem, DocumentAnalysis } from './types';
import { DocumentList } from './components/DocumentList';
import { BrainstormPanel } from './components/BrainstormPanel';
import { RoadmapSkills } from './components/RoadmapSkills';
import { AgentTerminal } from './components/AgentTerminal';

export default function App() {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'brainstorm' | 'skills' | 'roadmap'>('brainstorm');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Custom cycling messages to render during document analysis
  const [analysisStatusIndex, setAnalysisStatusIndex] = useState(0);
  const loadingStages = [
    'Parsing syntactic document blocks...',
    'Extracting primary intellectual themes...',
    'Synthesizing latent competence vectors...',
    'Mapping structured learning milestones...',
    'Generating proactive project initiatives...',
    'Aligning tactical offloadable actions...',
    'Verifying schemas and metrics...'
  ];

  // Active agent terminal state
  const [activeAgentTask, setActiveAgentTask] = useState<{
    brainstormTitle: string;
    actionItem: ActionItem;
    documentName: string;
    documentContent: string;
  } | null>(null);

  // App notification banner state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dark theme control state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });

  // Toggle 'dark' class on parent document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Global settings state parameters
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [offlineSimulationActive, setOfflineSimulationActive] = useState(false);

  // Unorthodox "Out of the box" state parameters
  const [outBoxActive, setOutBoxActive] = useState(false);
  const [isRefreshingBrainstorm, setIsRefreshingBrainstorm] = useState(false);

  // Multi-document Synthesis Blender state parameters
  const [showBlenderModal, setShowBlenderModal] = useState(false);
  const [selectedDocIdsToBlend, setSelectedDocIdsToBlend] = useState<string[]>([]);
  const [blenderMixStyle, setBlenderMixStyle] = useState<string>('balanced');
  const [blenderIsUnorthodox, setBlenderIsUnorthodox] = useState<boolean>(false);
  const [isBlending, setIsBlending] = useState<boolean>(false);
  const [blendingStageIndex, setBlendingStageIndex] = useState(0);

  const blendingStages = [
    'Amalgamating selected source syntax codes...',
    'Analyzing structural cross-sectional discrepancies...',
    'Locating unexpected interdisciplinary overlaps with Gemini AI...',
    'Formulating original hybrid brainstorm models...',
    'Synthesizing compound learning competencies...',
    'Aligning tactical agent action map matrices...'
  ];

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const selectedDoc = documents.find((doc) => doc.id === selectedId);

  // High-fidelity exports
  const handleExportMarkdown = () => {
    if (!selectedDoc || !selectedDoc.analysis) {
      triggerToast('No active parsed document report available to export.', 'error');
      return;
    }
    const analysis = selectedDoc.analysis;
    const content = `# AI Intelligence Report: ${selectedDoc.name}

## Executive Overview
- **Category:** ${analysis.category}
- **Tone Profile:** ${analysis.sentiment}
- **Estimate Complexity:** ${analysis.readTime} minutes read-time

### Synthesis Summary
${analysis.summary}

## Core Extracted Themes
${analysis.keyThemes.map((theme, i) => `${i + 1}. ${theme}`).join('\n')}

## Unlocked Competency Matrices
${analysis.skills.map(skill => `- **${skill.name}** (${skill.category}) [Gained Portfolio: +${skill.proficiencyGained}%]\n  *Application Context:* ${skill.description}`).join('\n')}

## 3-Stage Implementation Map
${analysis.roadmap.map(stage => {
  return `### ${stage.milestone}: ${stage.title} (${stage.duration})\n${stage.description}\n**References:**\n${stage.resources.map(res => `- ${res}`).join('\n')}`;
}).join('\n\n')}

---
*Generated contextually by AI Document Organizer & Sorter. Processed on ${new Date().toISOString().substring(0, 10)}.*`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDoc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_synthesis_report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Markdown report exported successfully!', 'success');
  };

  const handleExportTxt = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedDoc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Source text file exported successfully!', 'success');
  };

  const handleExportWorkspaceJson = () => {
    try {
      const backupData = {
        exportedAt: new Date().toISOString(),
        documentsCount: documents.length,
        documents: documents
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai_document_workspace_backup_${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast('Workspace backups generated context-side successfully!', 'success');
    } catch (err) {
      triggerToast('Workspace backup creation dropped.', 'error');
    }
  };

  // Synchronize Blender cycling interval timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBlending) {
      interval = setInterval(() => {
        setBlendingStageIndex((prev) => (prev + 1) % blendingStages.length);
      }, 1800);
    } else {
      setBlendingStageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isBlending]);

  // Load and hydrate documents from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai_document_organizer_docs');
    if (saved) {
      try {
        const parsedDocs = JSON.parse(saved);
        if (Array.isArray(parsedDocs) && parsedDocs.length > 0) {
          setDocuments(parsedDocs);
          setSelectedId(parsedDocs[0].id);
          setIsLoaded(true);
          return;
        }
      } catch (err) {
        console.error('Error hydrating localStorage document database:', err);
      }
    }

    const formattedDocs: AnalyzedDocument[] = PRESET_DOCUMENTS.map((preset, idx) => {
      const name = preset.name;
      const initialAnalysis = INITIAL_ANALYSES[name];
      
      return {
        id: `preset-${idx}`,
        name: name,
        content: preset.content,
        size: preset.size,
        lastUpdated: '10 mins ago',
        analysis: initialAnalysis,
        ideasArchive: []
      };
    });

    setDocuments(formattedDocs);
    if (formattedDocs.length > 0) {
      setSelectedId(formattedDocs[0].id);
    }
    setIsLoaded(true);
  }, []);

  // Write changes automatically to persistent LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ai_document_organizer_docs', JSON.stringify(documents));
    }
  }, [documents, isLoaded]);

  // Interval timer for cycling analysis terminal messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (analyzingId) {
      interval = setInterval(() => {
        setAnalysisStatusIndex((prev) => (prev + 1) % loadingStages.length);
      }, 2000);
    } else {
      setAnalysisStatusIndex(0);
    }
    return () => clearInterval(interval);
  }, [analyzingId]);

  // Handlers
  const handleSelectDocument = (id: string) => {
    setSelectedId(id);
    setActiveAgentTask(null);
  };

  // Triggers unconventional brainstorm refresh with archive backup
  const handleRefreshBrainstorm = async () => {
    if (!selectedDoc) return;
    setIsRefreshingBrainstorm(true);
    triggerToast(
      outBoxActive 
        ? 'Synthesizing crazy, out-of-the-box brainstorm ideas...' 
        : 'Re-analyzing proactive project brainstorm initiatives...', 
      'info'
    );

    try {
      // Local simulated fallback path if mock mode is turned on in settings
      if (offlineSimulationActive) {
        const fallbackBrainstorms = [
          {
            id: `init-${Date.now()}-1`,
            title: outBoxActive ? "Extreme Quantum Decentralization Focus" : "Automated API Gateway Bridge",
            concept: outBoxActive 
              ? "Re-architect the system context to run on space-time lattice neural channels to bypass physical servers entirely." 
              : "Set up serverless proxy routers that cache structured Gemini answers to reduce API fees dramatically.",
            actions: [
              { id: `act-${Date.now()}-1a`, action: "Build quantum memory grids", timeEstimate: "12 hours", offloadable: true, offloadStatus: "idle" as const },
              { id: `act-${Date.now()}-1b`, action: "Test cellular bandwidth metrics", timeEstimate: "1.5 hours", offloadable: false, offloadStatus: "idle" as const }
            ]
          },
          {
            id: `init-${Date.now()}-2`,
            title: outBoxActive ? "Gamification with Neural Biofeedback Loops" : "Contextual Tag Cloud Generator",
            concept: outBoxActive
              ? "Reward developers with subtle sensory visualizer tones matched directly with cognitive heartbeat patterns."
              : "Incorporate keyword clustering models inside indexing files to auto-render visual category clouds.",
            actions: [
              { id: `act-${Date.now()}-2a`, action: "Integrate biofeedback library", timeEstimate: "6 hours", offloadable: true, offloadStatus: "idle" as const }
            ]
          }
        ];

        const oldBrainstorms = selectedDoc.analysis?.brainstorm || [];
        const archiveItem = {
          refreshedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          outOfTheBox: outBoxActive,
          brainstorm: oldBrainstorms
        };

        const updatedArchive = [archiveItem, ...(selectedDoc.ideasArchive || [])];

        setDocuments(prev => prev.map(doc => {
          if (doc.id === selectedDoc.id) {
            return {
              ...doc,
              analysis: {
                ...doc.analysis!,
                brainstorm: fallbackBrainstorms
              },
              ideasArchive: updatedArchive
            };
          }
          return doc;
        }));

        triggerToast('Inventions refreshed successfully! Saved old items to Idea Archive.', 'success');
        return;
      }

      // Standard remote API server channel call
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedDoc.name,
          content: selectedDoc.content,
          outOfTheBox: outBoxActive
        })
      });

      if (!response.ok) {
        throw new Error('Server analysis refresh failed.');
      }

      const refreshedData: DocumentAnalysis = await response.json();
      const newBrainstorm = refreshedData.brainstorm || [];

      const oldBrainstorms = selectedDoc.analysis?.brainstorm || [];
      const archiveItem = {
        refreshedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
        outOfTheBox: outBoxActive,
        brainstorm: oldBrainstorms
      };

      const updatedArchive = [archiveItem, ...(selectedDoc.ideasArchive || [])];

      setDocuments(prev => prev.map(doc => {
        if (doc.id === selectedDoc.id) {
          return {
            ...doc,
            analysis: {
              ...doc.analysis!,
              brainstorm: newBrainstorm
            },
            ideasArchive: updatedArchive
          };
        }
        return doc;
      }));

      triggerToast('Inventions refreshed successfully! Saved old items to Idea Archive.', 'success');
    } catch (err: any) {
      triggerToast(err.message || 'Could not fetch updated brainstorm.', 'error');
    } finally {
      setIsRefreshingBrainstorm(false);
    }
  };

  // Restore archived idea sets
  const handleRestoreArchiveSet = (archiveIndex: number) => {
    if (!selectedDoc || !selectedDoc.analysis) return;
    const targetSet = selectedDoc.ideasArchive?.[archiveIndex];
    if (!targetSet) return;

    const currentBrainstorms = selectedDoc.analysis.brainstorm;
    const currentActiveArchived = {
      refreshedAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) + ' (Swapped Back)',
      outOfTheBox: false,
      brainstorm: currentBrainstorms
    };

    const newArchive = [...(selectedDoc.ideasArchive || [])];
    newArchive.splice(archiveIndex, 1);
    newArchive.unshift(currentActiveArchived);

    setDocuments(prev => prev.map(doc => {
      if (doc.id === selectedDoc.id) {
        return {
          ...doc,
          analysis: {
            ...doc.analysis!,
            brainstorm: targetSet.brainstorm
          },
          ideasArchive: newArchive
        };
      }
      return doc;
    }));

    triggerToast('Archived brainstorm restored as active project initiatives!', 'success');
  };

  // Multi-document Synthesis Blender pipeline call
  const handleBlendDocuments = async () => {
    if (selectedDocIdsToBlend.length < 2) {
      triggerToast('Surgical alignment requires at least 2 files.', 'error');
      return;
    }

    setIsBlending(true);
    const docsToBlend = documents.filter(d => selectedDocIdsToBlend.includes(d.id));
    const combinedNames = docsToBlend.map(d => d.name);
    
    try {
      const response = await fetch('/api/blend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: docsToBlend.map(d => ({ name: d.name, content: d.content })),
          mixStyle: blenderMixStyle,
          outOfTheBox: blenderIsUnorthodox
        })
      });

      if (!response.ok) {
        throw new Error('Synthesis Blender service error.');
      }

      const blendedAnalysis: DocumentAnalysis = await response.json();

      const combinedSize = docsToBlend.reduce((sum, d) => {
        const parsed = parseFloat(d.size) || 2;
        return sum + parsed;
      }, 0);

      const blendedDoc: AnalyzedDocument = {
        id: `blend-${Date.now()}`,
        name: `Blended: ${combinedNames.join(' ⚭ ')}`,
        content: `Combined Hybrid Strategic Manifest.\nDerived directly from files:\n` + docsToBlend.map(d => `- ${d.name}`).join('\n') + `\n\n=== Collated Contents ===\n` + docsToBlend.map(d => `--- File: ${d.name} ---\n${d.content}`).join('\n\n'),
        size: `${combinedSize.toFixed(1)} KB`,
        lastUpdated: 'Just now',
        analysis: blendedAnalysis,
        ideasArchive: []
      };

      setDocuments(prev => [blendedDoc, ...prev]);
      setSelectedId(blendedDoc.id);
      setShowBlenderModal(false);
      setSelectedDocIdsToBlend([]);
      triggerToast('Hybrid Synthesis complete! Blended report active!', 'success');
      setActiveTab('brainstorm');
    } catch (err: any) {
      triggerToast(err.message || 'Blender algorithm encountered an error.', 'error');
    } finally {
      setIsBlending(false);
    }
  };

  // Triggers server-side call through express model API
  const handleAnalyzeDocument = async (id: string) => {
    const docToAnalyze = documents.find((doc) => doc.id === id);
    if (!docToAnalyze) return;

    setAnalyzingId(id);
    triggerToast(`Initializing deep analytical indexing for "${docToAnalyze.name}"`, 'info');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: docToAnalyze.name,
          content: docToAnalyze.content,
        }),
      });

      if (!response.ok) {
        throw new Error('AI Server analysis failed. Please check payload.');
      }

      const analysisData: DocumentAnalysis = await response.json();
      
      // Update state with newly analyzed object
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === id ? { ...doc, analysis: analysisData } : doc
        )
      );
      
      triggerToast('AI Document indexing successfully aligned!', 'success');
      setActiveTab('brainstorm'); // Jump to main parsed area
    } catch (error: any) {
      console.error('Analysis error:', error);
      triggerToast(error.message || 'Analysis operation dropped. Please retry.', 'error');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id);
    setDocuments(updated);
    if (selectedId === id) {
      setSelectedId(updated.length > 0 ? updated[0].id : '');
    }
    triggerToast('Document removed from current workspace session.', 'info');
  };

  const handleCreateCustomDoc = (name: string, content: string) => {
    // Generate simple size label
    const byteCount = new Blob([content]).size;
    const sizeStr = byteCount > 1024 
      ? `${(byteCount / 1024).toFixed(1)} KB` 
      : `${byteCount} Bytes`;

    const newDoc: AnalyzedDocument = {
      id: `custom-${Date.now()}`,
      name: name,
      content: content,
      size: sizeStr,
      lastUpdated: 'Just now',
      analysis: undefined, // Requires client-triggered analysis
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedId(newDoc.id);
    triggerToast(`"${name}" assembled. Trigger "Analyze" for proactive insights!`, 'success');
  };

  // Triggers slide-out terminal for action
  const handleLaunchAgentTask = (brainstormTitle: string, actionItem: ActionItem) => {
    if (!selectedDoc) return;
    setActiveAgentTask({
      brainstormTitle,
      actionItem,
      documentName: selectedDoc.name,
      documentContent: selectedDoc.content,
    });
  };

  // Update action execution metrics inside state to store delivered output
  const handleUpdateActionStatus = (
    actionId: string,
    status: 'idle' | 'running' | 'completed' | 'failed',
    logs: string[],
    result?: string
  ) => {
    if (!selectedDoc || !selectedDoc.analysis) return;

    const updatedBrainstorm = selectedDoc.analysis.brainstorm.map((b) => {
      const hasAction = b.actions.some((a) => a.id === actionId);
      if (!hasAction) return b;

      return {
        ...b,
        actions: b.actions.map((a) =>
          a.id === actionId
            ? { ...a, offloadStatus: status, offloadLog: logs, offloadResult: result }
            : a
        ),
      };
    });

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDoc.id
          ? {
              ...doc,
              analysis: {
                ...doc.analysis!,
                brainstorm: updatedBrainstorm,
              },
            }
          : doc
      )
    );
  };

  const handleToggleMilestone = (index: number) => {
    if (!selectedDoc || !selectedDoc.analysis) return;

    const updatedRoadmap = selectedDoc.analysis.roadmap.map((milestone, idx) =>
      idx === index ? { ...milestone, checked: !milestone.checked } : milestone
    );

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === selectedDoc.id
          ? {
              ...doc,
              analysis: {
                ...doc.analysis!,
                roadmap: updatedRoadmap,
              },
            }
          : doc
      )
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 flex flex-col text-neutral-800 dark:text-neutral-200 antialiased font-sans transition-colors duration-200">
      
      {/* Dynamic Alert Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-neutral-900 border border-neutral-800 p-4 shadow-xl max-w-sm transition-all duration-300 animate-slide-in">
          {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-450 shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-400 shrink-0" />}
          {toast.type === 'info' && <Info className="h-5 w-5 text-blue-400 shrink-0" />}
          <p className="text-xs font-semibold text-white tracking-wide leading-snug">{toast.message}</p>
        </div>
      )}

      {/* Main Top Header */}
      <header className="border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-40 px-6 py-3.5 shadow-2xs select-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-md">
              <BrainCircuit className="h-5.5 w-5.5 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1">
                AI DOCUMENT ORGANIZER & SORTER
                <span className="rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 px-1.5 py-0.5 text-[8px] font-black text-sky-800 dark:text-sky-355 tracking-normal normal-case">
                  Full Stack Node
                </span>
              </h1>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 tracking-tight mt-0.5">
                Proactive analysis, dynamic skill tracking, and sandbox task offloading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-405 dark:text-neutral-500">
            <span className="hidden md:inline">Workspace Server: Online</span>
            <span className="hidden md:inline">•</span>
            <span className="text-neutral-600 dark:text-neutral-400 bg-neutral-105 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-750 px-2 py-1 rounded font-semibold text-[10px]">
              UTC: 2026-06-05
            </span>

            {/* Document Synthesis Blender Button */}
            <button
              onClick={() => setShowBlenderModal(true)}
              title="Synthesis Blender"
              className="flex h-8 px-2.5 items-center gap-1 text-[11px] font-bold uppercase rounded-lg border border-neutral-200 dark:border-neutral-700 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-850 text-blue-600 dark:text-blue-400 hover:from-blue-105 dark:hover:from-neutral-750 hover:text-blue-700 dark:hover:text-amber-400 transition cursor-pointer self-center"
            >
              <Flame className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
              <span>Blender</span>
            </button>
            
            {/* Workspace Settings gear button */}
            <button
              onClick={() => setShowSettingsModal(true)}
              aria-label="Workspace settings"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer self-center"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Dark & light modes toggle slider icon */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              aria-label="Toggle dark theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-705 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer self-center"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Primary Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white dark:bg-neutral-900 mt-1 border-t border-neutral-150 dark:border-neutral-800">
        
        {/* Left Side Curator Sidebar */}
        <section className="lg:col-span-3 border-r border-neutral-150 dark:border-neutral-800">
          <DocumentList
            documents={documents}
            selectedId={selectedId}
            onSelect={handleSelectDocument}
            onAnalyze={handleAnalyzeDocument}
            onDelete={handleDeleteDocument}
            onAddCustomDocument={handleCreateCustomDoc}
          />
        </section>

        {/* Central Display Pane */}
        <section className="lg:col-span-9 flex flex-col min-h-[calc(100vh-80px)] xl:min-h-0 overflow-y-auto">
          {selectedDoc ? (
            <div className="flex-1 flex flex-col">
              
              {/* Active Document Meta Badge Row */}
              <div className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/20 dark:bg-neutral-900/40 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-600 dark:text-neutral-350 uppercase">
                        {selectedDoc.analysis ? selectedDoc.analysis.category : 'Sphere Pending'}
                      </span>
                      {selectedDoc.analysis?.tags.map((tag, i) => (
                        <span key={i} className="text-neutral-400 dark:text-neutral-550 text-xs font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-sans text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      {selectedDoc.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">READ TIME</div>
                      <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedDoc.analysis ? `${selectedDoc.analysis.readTime} minutes` : '—'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">SENTIMENT TONE</div>
                      <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                        {selectedDoc.analysis ? selectedDoc.analysis.sentiment : 'Pending analysis'}
                      </div>
                    </div>

                    {/* Integrated Export Intelligence Widget */}
                    <div className="relative group/export self-center ml-2">
                      <button className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-750 transition cursor-pointer shadow-3xs">
                        <Download className="h-3.5 w-3.5 text-neutral-450 dark:text-neutral-400" />
                        <span>Export</span>
                        <ChevronDown className="h-3 w-3 opacity-60" />
                      </button>

                      {/* Dropdown popup on hover or focus */}
                      <div className="absolute right-0 mt-1 w-56 origin-top-right rounded-lg border border-neutral-150 dark:border-neutral-750 bg-white dark:bg-neutral-850 p-1.5 shadow-lg opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible focus-within:opacity-100 focus-within:visible transition-all duration-200 z-50">
                        <button
                          onClick={handleExportMarkdown}
                          disabled={!selectedDoc.analysis}
                          className="w-full text-left rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer"
                        >
                          Export Summary (Markdown)
                        </button>
                        <button
                          onClick={handleExportTxt}
                          className="w-full text-left rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                        >
                          Export Raw Source (TXT)
                        </button>
                        <button
                          onClick={handleExportWorkspaceJson}
                          className="w-full text-left rounded-md px-2.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition border-t border-neutral-100 dark:border-neutral-800/60 mt-1 pt-1.5 cursor-pointer"
                        >
                          Export Workspace Backup (JSON)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real Content Analyzer Loader */}
              {analyzingId === selectedDoc.id ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900 border-t border-neutral-50 dark:border-neutral-800">
                  <div className="relative flex items-center justify-center h-16 w-16 mb-6">
                    <div className="absolute h-full w-full rounded-full border-4 border-neutral-100 dark:border-neutral-800 border-t-neutral-900 dark:border-t-white animate-spin" />
                    <Sparkles className="h-6 w-6 text-neutral-900 dark:text-neutral-205 animate-pulse" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-wide uppercase">
                    Synthesizing Intellectual Landscape
                  </h3>
                  <div className="font-mono text-xs text-neutral-450 dark:text-neutral-500 mt-2 p-1.5 bg-neutral-50 dark:bg-neutral-850 rounded border border-neutral-100 dark:border-neutral-750 max-w-sm mx-auto animate-pulse">
                    $ {loadingStages[analysisStatusIndex]}
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs mt-3 leading-normal">
                    Establishing safe context frames with Gemini models. Generative vector maps will compile shortly.
                  </p>
                </div>
              ) : !selectedDoc.analysis ? (
                /* Unanalyzed Empty Area Block */
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/25 dark:bg-neutral-900/40">
                  <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 border border-blue-105 dark:border-blue-900/60 shadow-sm animate-bounce">
                    <Sparkles className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    Unsorted Intellectual Draft Detected
                  </h3>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mt-2 leading-relaxed">
                    This text has not been processed. Triggering our deep AI analyzer compiles thematic keywords, a targeted 3-stage learning roadmap, competence profiles, and tactical agent scripts.
                  </p>
                  <button
                    onClick={() => handleAnalyzeDocument(selectedDoc.id)}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-5 py-2.5 text-xs font-semibold text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition active:scale-98 shadow-md cursor-pointer"
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Process & Index with Gemini AI</span>
                  </button>
                </div>
              ) : (
                /* Full Tab Layout */
                <div className="flex-1 flex flex-col">
                  {/* Tab Navigation selectors */}
                  <div className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 px-6 py-1 select-none flex items-center gap-1">
                    <button
                      onClick={() => setActiveTab('brainstorm')}
                      className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition tracking-wide cursor-pointer ${
                        activeTab === 'brainstorm'
                          ? 'border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-white'
                          : 'border-transparent text-neutral-450 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      <Zap className="h-3.5 w-3.5 shrink-0" />
                      <span>Proactive Brainstorming</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition tracking-wide cursor-pointer ${
                        activeTab === 'skills'
                          ? 'border-neutral-900 dark:border-neutral-200 text-neutral-900 dark:text-white'
                          : 'border-transparent text-neutral-450 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      <Activity className="h-3.5 w-3.5 shrink-0" />
                      <span>Skills Portfolio</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('roadmap')}
                      className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition tracking-wide cursor-pointer ${
                        activeTab === 'roadmap'
                          ? 'border-neutral-900 dark:border-neutral-205 text-neutral-900 dark:text-white'
                          : 'border-transparent text-neutral-450 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      <Compass className="h-3.5 w-3.5 shrink-0" />
                      <span>Learning Roadmap</span>
                    </button>
                  </div>

                  {/* Main Tab Render Grid Split */}
                  <div className="p-6 flex-1 bg-white dark:bg-neutral-900">
                    {activeTab === 'brainstorm' && (
                      <div className="space-y-6">
                        {/* Interactive Brainstorm Command Controls */}
                        <div className="border border-neutral-150 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-850 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-2.5 max-w-sm sm:max-w-md">
                            <Info className="h-4.5 w-4.5 text-neutral-400 dark:text-neutral-550 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                              <strong>Brainstorms & Actions:</strong> Launch Gemini task solvers recursively. Enable out-the-box controls to inject speculative cross-disciplinary inventions into your active files list.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            {/* Unorthodox / Out-Of-The-Box Toggle Switch widget */}
                            <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={outBoxActive}
                                onChange={(e) => setOutBoxActive(e.target.checked)}
                                className="hidden"
                              />
                              <span className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors ${outBoxActive ? 'bg-orange-500' : 'bg-neutral-200 dark:bg-neutral-750'}`}>
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${outBoxActive ? 'translate-x-4' : 'translate-x-1'}`} />
                              </span>
                              <span>Out-the-Box</span>
                            </label>

                            {/* Refresh analysis button */}
                            <button
                              onClick={handleRefreshBrainstorm}
                              disabled={isRefreshingBrainstorm}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer ${
                                isRefreshingBrainstorm
                                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600'
                                  : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-205'
                              }`}
                            >
                              <RotateCcw className={`h-3 w-3 ${isRefreshingBrainstorm ? 'animate-spin' : ''}`} />
                              <span>{isRefreshingBrainstorm ? 'Refreshing...' : 'Refresh Ideas'}</span>
                            </button>
                          </div>
                        </div>

                        {isRefreshingBrainstorm ? (
                          <div className="rounded-2xl border border-dashed border-neutral-150 dark:border-neutral-800 p-12 text-center bg-white dark:bg-neutral-900 flex flex-col items-center justify-center">
                            <div className="relative mb-4 h-9 w-9">
                              <span className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-45" />
                              <span className="absolute inset-1.5 rounded-full border-2 border-orange-500 animate-spin border-t-transparent animate-duration-700" />
                            </div>
                            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-white mb-1.5">
                              Synthesizing Unorthodox Hypotheses
                            </h4>
                            <p className="text-[11px] text-neutral-450 dark:text-neutral-500 max-w-xs leading-relaxed animate-pulse">
                              Consulting alternative cross-disciplinary data clusters with Gemini AI to build non-traditional action pipelines...
                            </p>
                          </div>
                        ) : (
                          <BrainstormPanel
                            brainstormItems={selectedDoc.analysis?.brainstorm || []}
                            onLaunchAgent={(title, action) => handleLaunchAgentTask(title, action)}
                          />
                        )}

                        {/* Collapsible Idea Archive Compartment */}
                        {selectedDoc.ideasArchive && selectedDoc.ideasArchive.length > 0 && (
                          <div className="border border-neutral-150 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-50/20 dark:bg-neutral-950/20">
                            <details className="group">
                              <summary className="flex items-center justify-between px-5 py-3.5 bg-neutral-50 dark:bg-neutral-850 cursor-pointer text-neutral-700 dark:text-neutral-300 select-none">
                                <div className="flex items-center gap-2">
                                  <History className="h-4 w-4 text-amber-500" />
                                  <span className="font-sans text-xs font-bold uppercase tracking-wider">
                                    Idea Discovery Archive ({selectedDoc.ideasArchive.length})
                                  </span>
                                </div>
                                <span className="text-[10px] font-sans text-neutral-400 group-open:hidden transition">Expand Extra Brainstorms</span>
                                <span className="text-[10px] font-sans text-neutral-400 hidden group-open:block transition font-bold">Compress List</span>
                              </summary>
                              
                              <div className="p-5 space-y-4 border-t border-neutral-150 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40">
                                {selectedDoc.ideasArchive.map((archiveSet, sIdx) => (
                                  <div key={sIdx} className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-4 bg-white dark:bg-neutral-850 shadow-2xs">
                                    <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-neutral-50 dark:border-neutral-800/60">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-neutral-450 dark:text-neutral-505 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md font-semibold">
                                          Session: {archiveSet.refreshedAt}
                                        </span>
                                        {archiveSet.outOfTheBox && (
                                          <span className="text-[9px] font-bold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-250/20 px-1.5 py-0.5 rounded-full">
                                            Out-of-the-Box
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleRestoreArchiveSet(sIdx)}
                                        className="flex items-center gap-1 rounded bg-neutral-100 dark:bg-neutral-750 border border-neutral-200 dark:border-neutral-700 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer transition"
                                      >
                                        <RotateCcw className="h-2.5 w-2.5 text-neutral-500" /> Restore Set
                                      </button>
                                    </div>

                                    {/* Small items preview summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                                      {archiveSet.brainstorm.map((conceptItem, cIdx) => (
                                        <div key={cIdx} className="bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-50/70 dark:border-neutral-800 rounded-lg p-2.5">
                                          <h5 className="font-sans text-[11px] font-bold text-neutral-800 dark:text-neutral-200 truncate">
                                            {conceptItem.title}
                                          </h5>
                                          <p className="text-[10px] text-neutral-450 mt-1 line-clamp-2">
                                            {conceptItem.concept}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'skills' && (
                      <RoadmapSkills
                        skills={selectedDoc.analysis.skills}
                        roadmap={selectedDoc.analysis.roadmap}
                        onToggleMilestone={handleToggleMilestone}
                      />
                    )}

                    {activeTab === 'roadmap' && (
                      <RoadmapSkills
                        skills={selectedDoc.analysis.skills}
                        roadmap={selectedDoc.analysis.roadmap}
                        onToggleMilestone={handleToggleMilestone}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Collapsible Original Text Reader section at bottom */}
              <div className="border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/10 dark:bg-neutral-900/30 p-6 select-text mt-auto">
                <details className="group">
                  <summary className="flex items-center justify-between font-sans text-xs font-bold uppercase tracking-wider text-neutral-450 dark:text-neutral-500 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" /> View Original Reference Text
                    </span>
                    <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded group-open:hidden uppercase">Show</span>
                    <span className="text-[10px] bg-neutral-150 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.5 rounded hidden group-open:block uppercase">Hide</span>
                  </summary>
                  <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-neutral-150/70 dark:border-neutral-750 p-4 font-mono text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-850 max-h-60 overflow-y-auto">
                    {selectedDoc.content}
                  </pre>
                </details>
              </div>

            </div>
          ) : (
            /* No selected document state */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-neutral-50/15 dark:bg-neutral-900/40">
              <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-4">
                <Library className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200">No Document Selected</h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-xs mt-1.5 leading-relaxed">
                Choose one of our telemetry, novel, or campaign specs inside the sidebar, or assemble custom text materials instantly.
              </p>
            </div>
          )}
        </section>

        {/* Slidable AI Agent Right Panel Overlay */}
        {activeAgentTask && (
          <aside className="fixed inset-y-0 right-0 z-50 w-full md:w-3/5 xl:w-[45%] bg-white border-l border-neutral-250 shadow-2xl flex flex-col animate-slide-in-right">
            <AgentTerminal
              documentName={activeAgentTask.documentName}
              documentContent={activeAgentTask.documentContent}
              brainstormTitle={activeAgentTask.brainstormTitle}
              actionItem={activeAgentTask.actionItem}
              onClose={() => setActiveAgentTask(null)}
              onUpdateActionStatus={handleUpdateActionStatus}
            />
          </aside>
        )}

        {/* Global settings Modal backdrop layer */}
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setShowSettingsModal(false)}>
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl select-none" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-neutral-650 dark:text-neutral-350" />
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-white">Workspace Configuration</h3>
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450 dark:text-neutral-500 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Fallback configuration switch */}
                <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-850/50 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Local Offline Fallback Simulator</h4>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug mt-0.5">Toggle local client mock analysis logic in case Gemini server experiences timeouts.</p>
                  </div>
                  <label className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-neutral-200 dark:bg-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offlineSimulationActive}
                      onChange={(e) => setOfflineSimulationActive(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-neutral-200 dark:bg-neutral-750 transition-colors peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:h-4 to after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4" />
                  </label>
                </div>

                {/* factory resets indicators */}
                <div className="flex flex-col gap-2 p-3.5 bg-neutral-50 dark:bg-neutral-850/50 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Rehydrate / Empty Sandbox</h4>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-snug">Wipe workspace cache to default values or empty state database.</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        localStorage.removeItem('ai_document_organizer_docs');
                        window.location.reload();
                      }}
                      className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
                    >
                      Restore Presets
                    </button>
                    <button
                      onClick={() => {
                        setDocuments([]);
                        setSelectedId('');
                        localStorage.setItem('ai_document_organizer_docs', JSON.stringify([]));
                        triggerToast('All documents removed from LocalStorage.', 'success');
                        setShowSettingsModal(false);
                      }}
                      className="flex-1 rounded-lg border border-red-200 dark:border-red-950 bg-red-50/30 hover:bg-red-500/20 py-2 text-[10px] font-bold uppercase tracking-wider text-red-650 dark:text-red-400 transition cursor-pointer"
                    >
                      Reset Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Multi-Document Synthesis Blender modal backdrop overlay */}
        {showBlenderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => !isBlending && setShowBlenderModal(false)}>
            <div className="w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-2xl select-none" onClick={(e) => e.stopPropagation()}>
              
              {/* Header block */}
              <div className="flex items-center justify-between pb-4.5 border-b border-neutral-150 dark:border-neutral-800 mb-4.5">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                  <div>
                    <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-white">Synthesis Blender</h3>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">Amalgamate concepts across 2+ documents to construct innovative speculative models.</p>
                  </div>
                </div>
                {!isBlending && (
                  <button onClick={() => setShowBlenderModal(false)} className="rounded p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-450 dark:text-neutral-500 cursor-pointer">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isBlending ? (
                /* Blending Progress Screen */
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-14 w-14">
                    <span className="absolute inset-0 rounded-full border-4 border-dashed border-orange-500 border-t-transparent animate-spin animate-duration-1000" />
                    <span className="absolute inset-2.5 rounded-full border border-neutral-200 dark:border-neutral-750 flex items-center justify-center">
                      <Flame className="h-6 w-6 text-orange-500 animate-pulse" />
                    </span>
                  </div>

                  <div>
                    <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-white">Synthesizing Hybrid Matrices</h4>
                    <p className="text-[11px] text-neutral-450 dark:text-neutral-500 leading-relaxed mt-1.5 active-pulse max-w-xs mx-auto">
                      {blendingStages[blendingStageIndex]}
                    </p>
                  </div>
                </div>
              ) : (
                /* Setup Blender parameters */
                <div className="space-y-4.5">
                  
                  {/* Select sources workspace documents and folders */}
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
                      SELECT SOURCE INTELLECTUAL SPECIFICATIONS (MINIMUM 2)
                    </label>
                    <div className="border border-neutral-150 dark:border-neutral-800 rounded-xl max-h-40 overflow-y-auto p-2 bg-neutral-50/10 dark:bg-neutral-900/40 space-y-1">
                      {documents.length > 0 ? (
                        documents.map((doc) => {
                          const isChecked = selectedDocIdsToBlend.includes(doc.id);
                          return (
                            <label
                              key={doc.id}
                              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                                isChecked
                                  ? 'bg-neutral-100/55 dark:bg-neutral-800 font-medium'
                                  : 'hover:bg-neutral-50/60 dark:hover:bg-neutral-850'
                              }`}
                            >
                              <div className="flex items-center gap-2 max-w-[85%]">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDocIdsToBlend((prev) => [...prev, doc.id]);
                                    } else {
                                      setSelectedDocIdsToBlend((prev) => prev.filter((id) => id !== doc.id));
                                    }
                                  }}
                                  className="rounded border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
                                />
                                <span className="text-xs text-neutral-750 dark:text-neutral-300 truncate">{doc.name}</span>
                              </div>
                              <span className="text-[9px] font-mono text-neutral-400">{doc.size}</span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-xs text-center text-neutral-405 dark:text-neutral-500 py-3">No files in current workspace.</p>
                      )}
                    </div>
                  </div>

                  {/* Choose blending style focus */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">
                        BLENDING TARGET MIX STYLE
                      </label>
                      <select
                        value={blenderMixStyle}
                        onChange={(e) => setBlenderMixStyle(e.target.value)}
                        className="w-full text-xs rounded-lg border border-neutral-200 dark:border-neutral-750 bg-white dark:bg-neutral-850 px-2.5 py-1.5 focus:border-neutral-900 dark:focus:border-neutral-300 outline-hidden tracking-tight text-neutral-750 dark:text-neutral-200"
                      >
                        <option value="balanced">Balanced Synthesis (Logical Overlap)</option>
                        <option value="moonshot">Chaotic Moonshot (Specular Fusion)</option>
                        <option value="disruptive">Disruptive Competency (Integration)</option>
                        <option value="technical">Engineering Matrix (Systems Integration)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-2 border border-neutral-200 dark:border-neutral-750 rounded-lg bg-neutral-50/40 dark:bg-neutral-850">
                      <div>
                        <h4 className="text-[11px] font-bold text-neutral-750 dark:text-neutral-300 uppercase">Speculative Ideas</h4>
                        <p className="text-[9px] text-neutral-400 leading-tight">Incorporate alternative crosscutting speculations.</p>
                      </div>
                      <label className="relative inline-flex h-4.5 w-8 items-center rounded-full bg-neutral-250 dark:bg-neutral-700 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={blenderIsUnorthodox}
                          onChange={(e) => setBlenderIsUnorthodox(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="h-4.5 w-8 rounded-full bg-neutral-200 dark:bg-neutral-750 transition-colors peer-checked:bg-orange-500 after:absolute after:top-[2px] after:left-[2px] after:h-3.5 after:w-3.5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-3.5" />
                      </label>
                    </div>
                  </div>

                  {/* Trigger synthesis */}
                  <div className="pt-3 flex gap-2 justify-end border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowBlenderModal(false)}
                      className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-550 hover:bg-neutral-50 dark:hover:bg-neutral-805 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBlendDocuments}
                      disabled={selectedDocIdsToBlend.length < 2}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold text-white dark:text-neutral-900 transition flex items-center gap-1.5 cursor-pointer ${
                        selectedDocIdsToBlend.length < 2
                          ? 'bg-neutral-150 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600'
                          : 'bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-850 dark:hover:bg-neutral-200 shadow-sm'
                      }`}
                    >
                      <Flame className="h-4 w-4 shrink-0 text-orange-500 animate-pulse" />
                      <span>Commence Fusion Blend</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
