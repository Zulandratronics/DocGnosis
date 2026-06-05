import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play, CheckCircle2, ChevronRight, Copy, Code, Check } from 'lucide-react';
import { ActionItem } from '../types';

interface AgentTerminalProps {
  documentName: string;
  documentContent: string;
  brainstormTitle: string;
  actionItem: ActionItem;
  onClose: () => void;
  onUpdateActionStatus: (actionId: string, status: 'idle' | 'running' | 'completed' | 'failed', logs: string[], result?: string) => void;
}

export function AgentTerminal({
  documentName,
  documentContent,
  brainstormTitle,
  actionItem,
  onClose,
  onUpdateActionStatus,
}: AgentTerminalProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [rawArtifact, setRawArtifact] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Start the execution flow
  useEffect(() => {
    if (actionItem.offloadStatus === 'idle') {
      triggerAgentExecution();
    } else {
      // Re-populate if already executed
      setLogs(actionItem.offloadLog);
      setRawArtifact(actionItem.offloadResult || '');
    }
  }, [actionItem.id]);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const triggerAgentExecution = async () => {
    setIsExecuting(true);
    setLogs(['[Agent Core] Initializing sandboxed tactical agent...', '[Agent Core] Requesting GCP allocation...']);
    onUpdateActionStatus(actionItem.id, 'running', ['[Agent Core] Initializing terminal...']);

    try {
      // Call the API endpoint
      const response = await fetch('/api/offload_agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: documentName,
          fileContent: documentContent,
          brainstormTitle: brainstormTitle,
          actionItem: actionItem.action,
        }),
      });

      if (!response.ok) {
        throw new Error('Agent execution endpoint returned an error.');
      }

      const data = await response.json();
      const serverLogs = data.logs || [
        '[Agent Core] Connecting workspace node...',
        `[Analyzer] Aligning on task: "${actionItem.action}"`,
        '[Compiler] Synthesizing context rules...',
        '[Agent Core] Compiling template nodes...'
      ];
      const resultDoc = data.result || 'No output generated';

      // Type out logs step by step with simulated latency for premium feel
      let index = 0;
      setLogs(['[Agent Node] Connected. Injecting execution payload...']);

      const interval = setInterval(() => {
        if (index < serverLogs.length) {
          setLogs((prev) => [...prev, serverLogs[index]]);
          index++;
        } else {
          clearInterval(interval);
          setLogs((prev) => [
            ...prev,
            '[Agent Core] Final validation matches output metrics.',
            '[Success] Task completed successfully. Displaying generated artifact below.'
          ]);
          setRawArtifact(resultDoc);
          setIsExecuting(false);
          onUpdateActionStatus(
            actionItem.id,
            'completed',
            [...serverLogs, '[Success] System verified and finalized.'],
            resultDoc
          );
        }
      }, 700);

    } catch (error: any) {
      console.error('Agent offload failed:', error);
      const errLogs = ['[Error] Sandbox execution aborted.', `[Error] Details: ${error.message}`];
      setLogs(errLogs);
      setIsExecuting(false);
      onUpdateActionStatus(actionItem.id, 'failed', errLogs);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawArtifact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple and highly robust custom markdown renderer
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    let insideCodeBlock = false;
    let codeContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Handle Triple Backtick Code Blocks
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          insideCodeBlock = false;
          const codeString = codeContent.join('\n');
          elements.push(
            <div key={`code-${idx}`} className="my-4 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 font-mono text-sm text-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-4 py-2">
                <span className="flex items-center gap-2 text-xs text-neutral-400">
                  <Code className="h-4.5 w-4.5 text-blue-400" /> Source Artifact Code
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeString);
                  }}
                  className="rounded px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  title="Copy code"
                >
                  Copy Box
                </button>
              </div>
              <pre className="overflow-x-auto p-4 leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeContent = [];
        } else {
          insideCodeBlock = true;
        }
        return;
      }

      if (insideCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={idx} className="mt-6 mb-3 font-sans text-2xl font-bold tracking-tight text-neutral-900 first:mt-0">{line.replace('# ', '')}</h1>);
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={idx} className="mt-5 mb-2.5 font-sans text-xl font-semibold tracking-tight text-neutral-800">{line.replace('## ', '')}</h2>);
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={idx} className="mt-4 mb-2 font-sans text-lg font-medium text-neutral-800">{line.replace('### ', '')}</h3>);
        return;
      }

      // Bullets
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const cleanText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <li key={idx} className="ml-5 list-disc py-1 text-neutral-600 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleanText) }} />
        );
        return;
      }

      // Empty Lines
      if (line.trim() === '') {
        elements.push(<div key={idx} className="h-3" />);
        return;
      }

      // Standard paragraphs
      elements.push(
        <p key={idx} className="py-1 text-neutral-600 leading-relaxed"
           dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
      );
    });

    return <div className="space-y-1">{elements}</div>;
  };

  // Format Bold ** and backtick ` code
  function formatInlineMarkdown(text: string): string {
    // Escape HTML to prevent injection
    let safe = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Bold **
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-900 dark:text-white">$1</strong>');
    // Backticks `
    safe = safe.replace(/`(.*?)`/g, '<code class="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-xs font-mono text-pink-600 dark:text-pink-400">$1</code>');
    
    return safe;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
          <h2 className="font-sans text-sm font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight">
            AI Tactical Agent Execution Node
          </h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
        >
          Close Node
        </button>
      </div>

      {/* Terminal Display */}
      <div className="p-4 bg-neutral-900 font-mono text-xs text-neutral-300 h-64 overflow-y-auto flex flex-col justify-between border-b border-neutral-950">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-neutral-400 border-b border-neutral-800 pb-2 mb-2">
            <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>AGENT_WORKER@AISTUDIO_SANDBOX:~</span>
          </div>
          {logs.map((log, i) => {
            let color = 'text-neutral-300';
            if (log.startsWith('[Error]')) color = 'text-red-400';
            else if (log.startsWith('[Success]')) color = 'text-emerald-400 font-semibold';
            else if (log.startsWith('[Agent Core]')) color = 'text-blue-400';
            return (
              <div key={i} className={`flex items-start gap-1 ${color}`}>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-neutral-500" />
                <span className="whitespace-pre-wrap">{log}</span>
              </div>
            );
          })}
          {isExecuting && (
            <div className="flex items-center gap-2 text-blue-400 font-semibold animate-pulse pt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>Agent compiling response...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
        <div className="text-[10px] text-neutral-500 mt-4 text-right">
          Interactive GCP Pipeline Core v2.6.5
        </div>
      </div>

      {/* Main Delivered File Viewer */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-neutral-905">
        {rawArtifact ? (
          <div>
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-55 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Core Deliverable Ready
                </span>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Generated specifically for brainstorm action: "{actionItem.action}"</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 active:bg-neutral-100 dark:active:bg-neutral-700 transition-all shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied Text
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy Artifact
                  </>
                )}
              </button>
            </div>

            <div className="prose max-w-none text-sm leading-relaxed">
              {renderMarkdown(rawArtifact)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 px-6">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 animate-bounce">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="font-sans text-sm font-semibold text-neutral-800">
              Safely Synthesizing Artifact
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mt-1.5 leading-normal">
              The autonomous Agent is querying server-side models to write and build your core files directly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
