import React, { useState } from 'react';
import { FileText, Search, PlusCircle, Sparkles, CheckCircle2, ChevronRight, Hash, Trash2, UploadCloud, AlertCircle, Folder, FolderOpen, X, Check, ArrowRight } from 'lucide-react';
import { AnalyzedDocument } from '../types';

interface DocumentListProps {
  documents: AnalyzedDocument[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAnalyze: (id: string) => void;
  onDelete: (id: string) => void;
  onAddCustomDocument: (name: string, content: string) => void;
}

export function DocumentList({
  documents,
  selectedId,
  onSelect,
  onAnalyze,
  onDelete,
  onAddCustomDocument,
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Custom states for view modes and safe delete confirmations
  const [viewMode, setViewMode] = useState<'flat' | 'folders'>('folders');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(query) ||
      doc.analysis?.category?.toLowerCase().includes(query) ||
      doc.analysis?.tags?.some((t) => t.toLowerCase().includes(query));
    return matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    onAddCustomDocument(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const name = file.name;
    const extension = name.split('.').pop()?.toLowerCase() || '';

    // SupportedExtensions
    const supportedExtensions = ['pdf', 'txt', 'md', 'json', 'csv', 'js', 'ts', 'html'];
    if (!supportedExtensions.includes(extension)) {
      setUploadError(`Extension ".${extension}" is unsupported. Choose PDF, Markdown, TXT or code files.`);
      return;
    }

    const reader = new FileReader();
    const sizeBytes = file.size;
    const sizeStr = sizeBytes > 1024 * 1024
      ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : sizeBytes > 1024
        ? `${(sizeBytes / 1024).toFixed(1)} KB`
        : `${sizeBytes} Bytes`;

    reader.onload = (e) => {
      let content = '';
      const result = e.target?.result;

      if (extension === 'pdf') {
        if (typeof result === 'string') {
          // Extract typical plain text paragraphs enclosed inside PDF parentheses
          const textBlocks: string[] = [];
          const regexParen = /\(([^)]+)\)/g;
          let match;
          while ((match = regexParen.exec(result)) !== null) {
            const text = match[1].trim();
            if (text.length > 2 && !text.includes('\\') && /^[a-zA-Z0-9\s.,;:!?@#&%*()_+-]+$/.test(text)) {
              textBlocks.push(text);
            }
          }

          if (textBlocks.length > 5) {
            content = textBlocks.slice(0, 800).join(' ');
          } else {
            // Find printable ASCII blocks
            const asciiMatch = result.match(/[\x20-\x7E]{6,}/g);
            if (asciiMatch) {
              content = asciiMatch
                .filter(line => !line.includes('%PDF') && !line.includes('obj') && !line.includes('endobj') && !line.includes('stream') && line.length > 8)
                .slice(0, 150)
                .join('\n');
            }
          }

          if (!content.trim()) {
            content = `[PDF Document Structural Metadata]\nFile Name: ${name}\nSize: ${sizeStr}\n\n(This is a scanned or compressed binary PDF layout. Our processor logged metadata tags successfully. Please trigger Gemini AI indexing to extract core sections and build strategic project maps dynamically.)`;
          }
        }
      } else {
        content = typeof result === 'string' ? result : '';
      }

      onAddCustomDocument(name, content);
    };

    if (extension === 'pdf') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Grouping logic for Folder view Mode
  const getFoldersData = () => {
    const map: Record<string, AnalyzedDocument[]> = {};
    filteredDocs.forEach((doc) => {
      const folderKey = doc.analysis ? doc.analysis.category : 'Unprocessed Materials';
      if (!map[folderKey]) {
        map[folderKey] = [];
      }
      map[folderKey].push(doc);
    });
    return map;
  };

  const isFolderExpanded = (key: string) => {
    return expandedFolders[key] !== false; // expanded by default
  };

  const toggleFolder = (key: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  const foldersData = getFoldersData();

  // Render a single styled card wrapper for a document
  const renderDocumentCard = (doc: AnalyzedDocument) => {
    const isSelected = doc.id === selectedId;
    const isAnalyzed = !!doc.analysis;
    const isConfirmingDelete = confirmDeleteId === doc.id;

    return (
      <div
        key={doc.id}
        onClick={() => {
          if (!isConfirmingDelete) {
            onSelect(doc.id);
          }
        }}
        className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 shadow-xs'
            : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-2xs'
        }`}
      >
        {isConfirmingDelete ? (
          /* High-Fidelity Mini Deletion Gate */
          <div className="flex flex-col gap-2.5 py-1 text-center animate-pulse" onClick={(e) => e.stopPropagation()}>
            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> Permanent Delete?
            </p>
            <div className="flex items-center gap-2 justify-center">
              <button
                onClick={() => {
                  onDelete(doc.id);
                  setConfirmDeleteId(null);
                }}
                className="flex items-center gap-1 rounded bg-red-650 hover:bg-red-700 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Check className="h-3 w-3" /> Yes
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex items-center gap-1 rounded border border-neutral-250 dark:border-neutral-705 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
              >
                <X className="h-3 w-3" /> No
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header detail */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-250 dark:group-hover:bg-neutral-700 group-hover:text-neutral-900 dark:group-hover:text-white'
                  }`}
                >
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <div>
                  <h4 className="font-sans text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1 group-hover:text-black dark:group-hover:text-white transition">
                    {doc.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    {doc.size} • Last modified
                  </p>
                </div>
              </div>

              {/* Safe Deletion triggers gate */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(doc.id);
                }}
                className="opacity-0 group-hover:opacity-100 rounded p-1 text-neutral-450 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-red-650 transition cursor-pointer"
                title="Delete document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Analysis / Meta Footer */}
            <div className="mt-4 pt-3.5 border-t border-neutral-50/70 dark:border-neutral-800 flex items-center justify-between gap-2">
              {isAnalyzed ? (
                <div className="flex items-center gap-1.5 max-w-[65%]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-sans text-[10px] font-bold text-neutral-500 dark:text-neutral-450 uppercase tracking-wider truncate">
                    {doc.analysis.category}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-450 animate-pulse shrink-0" />
                  <span className="font-sans text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                    Unprocessed
                  </span>
                </div>
              )}

              {!isAnalyzed ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAnalyze(doc.id);
                  }}
                  className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition cursor-pointer"
                >
                  <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                  <span>Analyze</span>
                </button>
              ) : (
                <span className="inline-flex items-center text-emerald-600 dark:text-emerald-450 text-[10px]">
                  <CheckCircle2 className="h-3.5 w-3.5 font-bold" />
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-900 border-r border-neutral-150 dark:border-neutral-800 fill-height select-none transition-colors duration-200">
      {/* Header section */}
      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-800/40">
        <div className="flex items-center justify-between mb-4">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Document Curator
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Pasted Material</span>
          </button>
        </div>

        {/* Drag-and-Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-3.5 text-center transition-all duration-205 group mb-4 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/10'
              : 'border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 hover:bg-neutral-50/50 hover:border-neutral-300 dark:hover:border-neutral-600'
          }`}
        >
          <input
            type="file"
            id="sidebar-file-upload"
            onChange={handleFileChange}
            accept=".pdf,.txt,.md,.json,.csv,.js,.ts,.html"
            className="hidden"
          />
          <label htmlFor="sidebar-file-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <UploadCloud className="h-5 w-5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 transition mb-1" />
            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-200">Drag & Drop Files</span>
            <span className="text-[9px] text-neutral-400 mt-0.5">Supports PDF, MD, TXT, CSV, Code</span>
          </label>
        </div>

        {uploadError && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-2.5 text-[11px] text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="leading-snug">{uploadError}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            placeholder="Search titles, tags, spheres..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 pl-9 pr-4 text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 outline-hidden focus:border-neutral-900 dark:focus:border-neutral-300 transition-all shadow-2xs"
          />
        </div>

        {/* View Layout Mode Toggler */}
        <div className="flex items-center justify-between mt-3.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-150 dark:border-neutral-750">
          <button
            onClick={() => setViewMode('folders')}
            className={`flex-1 text-center py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition duration-150 cursor-pointer ${
              viewMode === 'folders'
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-450 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Category Folders
          </button>
          <button
            onClick={() => setViewMode('flat')}
            className={`flex-1 text-center py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition duration-150 cursor-pointer ${
              viewMode === 'flat'
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-450 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            Flat Stream
          </button>
        </div>
      </div>

      {/* Pop-up-ish Inline paste form */}
      {showAddForm && (
        <div className="p-5 border-b border-yellow-100 dark:border-amber-900/30 bg-amber-50/30 dark:bg-amber-950/10 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-sans text-xs font-bold text-neutral-850 dark:text-neutral-150 uppercase tracking-wider">
              Paste Intellectual Material
            </h4>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                Document Title
              </label>
              <input
                type="text"
                placeholder="e.g. Apollo Guidance specs.txt"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 outline-hidden focus:border-neutral-900 dark:focus:border-neutral-300 transition"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                Text Content
              </label>
              <textarea
                placeholder="Paste the raw text of the document here..."
                rows={5}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-250 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-1.5 text-xs text-neutral-800 dark:text-neutral-200 outline-hidden focus:border-neutral-900 dark:focus:border-neutral-300 transition font-mono leading-relaxed resize-y"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-xs font-semibold text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-xs cursor-pointer"
              >
                Assemble Document
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredDocs.length > 0 ? (
          viewMode === 'flat' ? (
            /* Flat Streaming List Grid */
            filteredDocs.map((doc) => renderDocumentCard(doc))
          ) : (
            /* Collapsible Accordion Folder Layout list */
            Object.keys(foldersData).map((folderKey) => {
              const children = foldersData[folderKey];
              const expanded = isFolderExpanded(folderKey);

              return (
                <div key={folderKey} className="border border-neutral-100 dark:border-neutral-800/80 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 transition-all">
                  {/* Folder Accordion Title Trigger bar */}
                  <div
                    onClick={() => toggleFolder(folderKey)}
                    className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-750 dark:text-neutral-200"
                  >
                    <div className="flex items-center gap-2 max-w-[80%]">
                      {expanded ? (
                        <FolderOpen className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                      ) : (
                        <Folder className="h-4.5 w-4.5 shrink-0 text-amber-500/80" />
                      )}
                      <span className="font-sans text-xs font-bold tracking-tight uppercase truncate">
                        {folderKey}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-neutral-200 dark:bg-neutral-750 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 rounded-full text-neutral-600 dark:text-neutral-300">
                      {children.length}
                    </span>
                  </div>

                  {/* Collapsed files compartment wrapper */}
                  {expanded && (
                    <div className="p-2 space-y-2.5 bg-neutral-50/20 dark:bg-neutral-900/40">
                      {children.map((doc) => renderDocumentCard(doc))}
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 border border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl bg-neutral-50/40 dark:bg-neutral-800/10 animate-fade-in">
            <Search className="h-6 w-6 text-neutral-300 dark:text-neutral-700" />
            <p className="mt-2 text-xs font-medium text-neutral-400">
              No matching records found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
