/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Save, AlertCircle, CheckCircle2, Plus, Database, ExternalLink, List, Trash2, Edit, ChevronRight, X, Search, LayoutDashboard, FileText, Settings, LogOut, ArrowLeft, Sword, Zap, AlignLeft, Image, MonitorPlay, Upload } from "lucide-react";
import { hiyukiSeedData } from "@/lib/seed-data";
import Link from "next/link";
import { compressImage } from "@/lib/imageHelper";

const ImageUploadInput = ({ value, onChange, placeholder = "https://...", className = "" }: { value: string, onChange: (val: string) => void, placeholder?: string, className?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const base64DataUrl = await compressImage(file);

      // Convert base64 to Blob
      const res = await fetch(base64DataUrl);
      const blob = await res.blob();

      // Create a unique filename
      const ext = 'webp';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

      const { data, error } = await supabase!.storage
        .from('images')
        .upload(filename, blob, {
          contentType: 'image/webp',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error("Supabase storage error:", error);
        // Fallback to base64 if storage fails (e.g. bucket doesn't exist)
        alert(`Storage upload failed, falling back to base64. Ensure an 'images' bucket is created in Supabase and is public. Error: ${error.message}`);
        onChange(base64DataUrl);
      } else if (data) {
        // Get public URL
        const { data: publicUrlData } = supabase!.storage.from('images').getPublicUrl(data.path);
        onChange(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to process or upload image: " + err?.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        title="Image URL"
        className={`${className} flex-1`}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="shrink-0 flex items-center justify-center bg-indigo-600/80 hover:bg-indigo-500 text-white border border-indigo-500/50 rounded-lg px-4 py-2 transition-all text-sm font-semibold h-[42px] disabled:opacity-50"
      >
        <Upload size={16} className="mr-2" />
        {isUploading ? "..." : "Upload"}
      </button>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" title="Upload Image" />
    </div>
  );
};

const CommaArrayInput = ({ value, onChange, placeholder = "", className = "" }: { value: string[] | string | undefined, onChange: (val: string) => void, placeholder?: string, className?: string }) => {
  const [localVal, setLocalVal] = useState<string>(
    Array.isArray(value) ? value.join(', ') : (value || "")
  );

  useEffect(() => {
    // Only update local value from prop if it differs substantially, to avoid ruining cursor
    // when typing spaces. If the parent just echoes our string, we don't need to override.
    const propStr = Array.isArray(value) ? value.join(', ') : (value || "");
    if (propStr !== localVal) {
      // Small sync check: if parent array format matches our string's split structure roughly, skip
      if (Array.isArray(value)) {
        const localArr = localVal.split(',').map(s => s.trim()).filter(Boolean);
        const isSame = JSON.stringify(localArr) === JSON.stringify(value);
        if (isSame) return;
      }
      setLocalVal(propStr);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      value={localVal}
      onChange={handleChange}
      placeholder={placeholder}
      title="Comma separated values"
      className={className}
    />
  );
};

const KeyValueEditor = ({ value, onChange }: { value: any, onChange: (val: any[]) => void }) => {
  // Convert legacy array or object into standard array of {label, value}
  const getItems = () => {
    if (Array.isArray(value)) {
      return value.map(item => {
        if (item.label !== undefined && item.value !== undefined) return item;
        if (item.name !== undefined) return { label: item.name, value: item.value || '' };
        if (item.key !== undefined) return { label: item.key, value: item.value || '' };
        const keys = Object.keys(item).filter(k => k !== 'value' && k !== 'label' && k !== 'id');
        if (keys.length > 0) return { label: keys[0], value: item[keys[0]] };
        return { label: '', value: '' };
      });
    } else if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([k, v]) => ({ label: k, value: String(v) }));
    }
    return [];
  };
  const items = getItems();
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Label (e.g. Skill DMG)"
            title="Label"
            value={typeof item.label === 'object' ? JSON.stringify(item.label) : (item.label || '')}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx] = { ...newItems[idx], label: e.target.value };
              onChange(newItems);
            }}
            className="w-1/2 bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono"
          />
          <input
            type="text"
            placeholder="Value (e.g. 288.00%)"
            title="Value"
            value={typeof item.value === 'object' ? JSON.stringify(item.value) : (item.value || '')}
            onChange={(e) => {
              const newItems = [...items];
              newItems[idx] = { ...newItems[idx], value: e.target.value };
              onChange(newItems);
            }}
            className="w-1/2 bg-[#1e293b] border border-slate-700/50 rounded-lg px-3 py-1.5 text-xs text-amber-400 focus:outline-none focus:border-amber-500/50 font-mono"
          />
          <button
            type="button"
            title="Remove row"
            onClick={() => {
              const newItems = [...items];
              newItems.splice(idx, 1);
              onChange(newItems);
            }}
            className="text-slate-500 hover:text-red-400 transition-colors p-1"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          onChange([...items, { label: '', value: '' }]);
        }}
        className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 hover:text-white transition-colors mt-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-lg w-full justify-center border border-slate-700/50"
      >
        <Plus size={12} /> Add Row
      </button>
    </div>
  );
};

const JsonEditor = ({ value, onChange }: { value: any, onChange: (val: any) => void }) => {
  const [text, setText] = useState(() => JSON.stringify(value || [], null, 2));
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(text);
      if (JSON.stringify(parsed) !== JSON.stringify(value || [])) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setText(JSON.stringify(value || [], null, 2));
        setError(false);
      }
    } catch (e) {
      const isInitialOrEmpty = text === '' || text === '[]';
      if (isInitialOrEmpty && JSON.stringify(value || []) !== '[]') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setText(JSON.stringify(value || [], null, 2));
      }
    }
  }, [value]);

  const handleChange = (e: any) => {
    const val = e.target.value;
    setText(val);
    try {
      const parsed = JSON.parse(val);
      setError(false);
      onChange(parsed);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={handleChange}
        onBlur={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            setText(JSON.stringify(parsed, null, 2));
          } catch (e) { }
        }}
        spellCheck="false"
        title="JSON Content"
        className={'w-full h-32 bg-[#1e293b] border ' + (error ? 'border-red-500/50' : 'border-slate-700/50') + ' rounded-lg px-4 py-2 text-xs text-slate-400 focus:outline-none focus:border-amber-500/50 font-mono shadow-inner'}
      />
      {error && <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] text-red-500 bg-[#1e293b] px-1 rounded">Invalid JSON</span>}
    </div>
  )
};

const RichTextEditor = ({ value, onChange, placeholder = "", className = "", minHeight = "120px" }: { value: string, onChange: (val: string) => void, placeholder?: string, className?: string, minHeight?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isInternalUpdate = useRef(false);

  // Sync value from prop to editor only when truly changed externally
  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      const currentHtml = editorRef.current.innerHTML;
      const incoming = value || "";
      if (currentHtml !== incoming) {
        editorRef.current.innerHTML = incoming;
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColorPicker]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const execCmd = (command: string, val?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, val);
    handleEditorInput();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const applyFontSize = (size: string) => {
    editorRef.current?.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size;
      range.surroundContents(span);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    handleEditorInput();
  };

  const presetColors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#ffffff', '#94a3b8'];

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-[#0c1322] border border-slate-700/50 border-b-0 rounded-t-lg px-2 py-1.5">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); execCmd('bold'); }} title="Bold" className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all text-sm font-black">B</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); execCmd('italic'); }} title="Italic" className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all text-sm italic font-semibold">I</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); execCmd('underline'); }} title="Underline" className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all text-sm underline font-semibold">U</button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Color picker */}
        <div className="relative" ref={colorPickerRef}>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowColorPicker(!showColorPicker); }} title="Text Color" className="w-7 h-7 flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-slate-700/60 transition-all">
            <span className="text-sm font-bold" style={{ borderBottom: '2.5px solid #f43f5e' }}>A</span>
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-[#0f172a] border border-slate-600/50 rounded-lg p-2 shadow-2xl shadow-black/50 min-w-[160px]">
              <div className="grid grid-cols-5 gap-1.5 mb-2">
                {presetColors.map(color => (
                  <button key={color} type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('foreColor', color); setShowColorPicker(false); }} className="w-6 h-6 rounded-full border-2 border-slate-600 hover:border-white hover:scale-110 transition-all" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-700/50">
                <input type="color" title="Custom Color" onChange={(e) => { execCmd('foreColor', e.target.value); setShowColorPicker(false); }} className="w-6 h-6 cursor-pointer bg-transparent border-none rounded" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">Custom</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Font size */}
        <div className="relative">
          <select title="Font Size" onChange={(e) => { if (e.target.value) applyFontSize(e.target.value); e.target.value = ''; }} defaultValue="" className="bg-transparent border border-slate-700/50 rounded text-[10px] text-slate-400 hover:text-slate-200 px-1.5 py-1 cursor-pointer focus:outline-none appearance-none uppercase tracking-wider font-bold w-[70px]">
            <option value="" disabled>Size</option>
            <option value="0.85em">Small</option>
            <option value="1em">Normal</option>
            <option value="1.25em">Large</option>
            <option value="1.5em">XL</option>
            <option value="2em">2XL</option>
          </select>
        </div>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Clear formatting */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); saveSelection(); execCmd('removeFormat'); }} title="Clear Formatting" className="w-7 h-7 flex items-center justify-center rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <X size={14} />
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleEditorInput}
        onBlur={saveSelection}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        data-placeholder={placeholder}
        className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-b-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm leading-relaxed overflow-y-auto"
        style={{ minHeight, maxHeight: '400px' }}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #475569;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default function AdminDashboard() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSavedSlug, setLastSavedSlug] = useState("");
  const [existingGuides, setExistingGuides] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"dashboard" | "list" | "edit">("dashboard");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    role: "",
    element: "Glacio",
    weapon_type: "Sword",
    rarity: "5"
  });

  // Content state (replaces raw JSON)
  const [contentData, setContentData] = useState<any>(hiyukiSeedData.content);

  const isSupabaseConnected = !!supabase;

  const filteredGuides = existingGuides.filter(guide =>
    guide.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.element?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchGuides = async () => {
    if (!supabase) return;
    const { data, error } = await supabase!.from("guides").select("*").order('created_at', { ascending: false });
    if (!error && data) {
      setExistingGuides(data);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (field: string, value: any) => {
    setContentData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNestedContentChange = (parent: string, field: string | null, value: any) => {
    setContentData((prev: any) => {
      if (field === null) {
        return { ...prev, [parent]: value };
      }
      return {
        ...prev,
        [parent]: { ...(prev[parent] || {}), [field]: value }
      };
    });
  };

  const loadGuide = (guide: any) => {
    setFormData({
      name: guide.name || "",
      slug: guide.slug || "",
      role: guide.role || "",
      element: guide.element || "Glacio",
      weapon_type: guide.weapon_type || "Sword",
      rarity: guide.rarity?.toString() || "5"
    });
    setContentData(guide.content || {
      quote: "", description: "", cardImage: "", foregroundImage: "", faction: "", class: "", images: { splash: "", avatar: "" },
      combatMechanics: [], weapons: [], echoes: {}, skillPriority: [], teams: []
    });
    setStatus("idle");
    setActiveTab("basic");
    setView("edit");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async (slug: string) => {
    if (!supabase) return;

    setStatus("loading");
    try {
      const { error, count } = await supabase!
        .from("guides")
        .delete({ count: 'exact' })
        .eq('slug', slug);

      if (error) throw error;

      if (count === 0) {
        throw new Error("Delete blocked by Supabase! You must add a DELETE policy in your Row Level Security (RLS) settings in the Supabase Dashboard.");
      }

      setStatus("success");
      setErrorMessage(`Guide ${slug} deleted successfully!`);

      if (formData.slug === slug) {
        resetForm();
      }

      setDeletingSlug(null);
      fetchGuides();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to delete guide");
      setDeletingSlug(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", slug: "", role: "", element: "Glacio", weapon_type: "Sword", rarity: "5"
    });
    setContentData({
      quote: "",
      description: "",
      cardImage: "",
      foregroundImage: "",
      faction: "",
      class: "",
      images: {
        splash: "",
        avatar: ""
      },
      combatMechanics: [],
      weapons: [],
      echoes: {},
      skillPriority: [],
      teams: []
    });
    setActiveTab("basic");
  };

  const handleNewGuide = () => {
    resetForm();
    setView("edit");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) return;

    setStatus("loading");

    // Ensure echoes arrays are properly formatted if they are strings
    const processedContent = { ...contentData };
    if (processedContent.roleOverview && typeof processedContent.roleOverview.bestFor === 'string') {
      processedContent.roleOverview.bestFor = processedContent.roleOverview.bestFor.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (processedContent.echoes) {
      const processArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
        return [];
      };
      processedContent.echoes.cost4 = processArray(processedContent.echoes.cost4);
      processedContent.echoes.cost3 = processArray(processedContent.echoes.cost3);
      processedContent.echoes.cost1 = processArray(processedContent.echoes.cost1);
    }

    if (processedContent.echoSets) {
      const processArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
        return [];
      };
      processedContent.echoSets = processedContent.echoSets.map((set: any) => ({
        ...set,
        cost4: processArray(set.cost4),
        cost3: processArray(set.cost3),
        cost1: processArray(set.cost1)
      }));
    }

    const newGuide = {
      name: formData.name,
      slug: formData.slug,
      element: formData.element,
      weapon_type: formData.weapon_type,
      rarity: parseInt(formData.rarity),
      role: formData.role,
      content: processedContent
    };

    try {
      const { error } = await supabase!.from("guides").upsert([newGuide], { onConflict: 'slug' });
      if (error) throw error;
      setStatus("success");
      setErrorMessage("Guide saved/updated successfully!");
      setLastSavedSlug(formData.slug);
      fetchGuides();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to save guide");
    }
  };

  // Dynamic Array Helpers
  const addItem = (field: string, defaultItem: any) => {
    const current = contentData[field] || [];
    handleContentChange(field, [...current, defaultItem]);
  };

  const updateItem = (field: string, index: number, itemField: string, value: any) => {
    const current = [...(contentData[field] || [])];
    current[index] = { ...current[index], [itemField]: value };
    handleContentChange(field, current);
  };

  const removeItem = (field: string, index: number) => {
    const current = [...(contentData[field] || [])];
    current.splice(index, 1);
    handleContentChange(field, current);
  };

  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "content", label: "Content" },
    { id: "mechanics", label: "Mechanics" },
    { id: "weapons", label: "Weapons" },
    { id: "echoes", label: "Echoes" },
    { id: "abilities", label: "Abilities / Kit" },
    { id: "skills", label: "Skill Priority" },
    { id: "teams", label: "Teams" },
    { id: "sequence", label: "Sequence" }
  ];

  return (
    <div className="min-h-screen text-white font-sans flex relative overflow-hidden">
      {/* Full-page background image */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1776670171/wuthering-waves-thumb_vwhrvp.jpg"
          alt="bg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-52 flex flex-col h-screen sticky top-0 shrink-0 bg-black/30 backdrop-blur-xl border-r border-white/10">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/ds6dwbk37/image/upload/v1778159044/8fa2d0fb-caed-43b9-ae62-34280c5fc4e9_th5xnm.png"
            alt="logo"
            className="w-7 h-7 object-contain mix-blend-lighten"
          />
          <span className="text-sm font-semibold tracking-wide font-cinzel">GrimVeil</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
            { id: 'list', label: 'Guides', icon: <FileText size={15} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => item.id === 'list' ? setView('list') : setView('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${(item.id === 'dashboard' && view === 'dashboard') || (item.id === 'list' && (view === 'list' || view === 'edit'))
                ? 'bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                : 'text-white/50 hover:text-white hover:bg-white/8'
                }`}
            >
              {item.icon}
              {item.label}
              {item.id === 'list' && existingGuides.length > 0 && (
                <span className="ml-auto text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded-full">{existingGuides.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/8 transition-colors group cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-700 flex items-center justify-center text-xs font-bold shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">Admin</p>
              <p className="text-[10px] text-white/35 truncate">GrimVeil CMS</p>
            </div>
            <button title="Logout" className="text-white/0 group-hover:text-white/40 transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-12 flex items-center justify-between px-5 border-b border-white/10 bg-black/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {view === 'edit' && (
              <button onClick={() => setView('list')} className="text-white/40 hover:text-white flex items-center gap-2 text-xs transition-colors">
                <ArrowLeft size={14} /> Guides
              </button>
            )}
            {view !== 'edit' && (
              <h2 className="text-xs font-medium text-white/50 capitalize tracking-wide">{view}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {view === 'list' && (
              <button
                onClick={handleNewGuide}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 text-[11px] px-3 py-1.5 rounded-lg transition-all"
              >
                <Plus size={13} /> New Guide
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {status === "success" && (
            <div className="mb-5 bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} />
                <span className="text-xs font-medium">{errorMessage}</span>
              </div>
              <button type="button" title="Close" onClick={() => setStatus("idle")} className="text-emerald-400/50 hover:text-emerald-400 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="mb-5 bg-red-500/8 border border-red-500/15 text-red-400 p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} />
                <span className="text-xs font-medium">{errorMessage}</span>
              </div>
              <button type="button" title="Close" onClick={() => setStatus("idle")} className="text-red-400/50 hover:text-red-400 transition-colors">
                <X size={16} />
              </button>
            </div>
          )}

          {!isSupabaseConnected && (
            <div className="mb-5 bg-amber-500/8 border border-amber-500/15 text-amber-400 p-3.5 rounded-xl flex items-start gap-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-xs mb-1">Supabase Not Connected</h3>
                <p className="text-xs opacity-70">Add your Supabase credentials to .env.local to enable the database.</p>
              </div>
            </div>
          )}

          {view === "dashboard" ? (
            <div className="max-w-5xl mx-auto space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-0.5 font-cinzel">Dashboard</h2>
                <p className="text-xs text-white/30">Welcome back to GrimVeil CMS.</p>
              </div>

              {/* Stat Cards — matching the top strip in the reference */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Total Guides</p>
                    <h3 className="text-3xl font-bold text-white">{existingGuides.length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/8">
                    <FileText size={18} className="text-white/40" />
                  </div>
                </div>

                <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Published</p>
                    <h3 className="text-3xl font-bold text-emerald-300">{existingGuides.filter(g => g.content?.is_published).length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/15">
                    <CheckCircle2 size={18} className="text-emerald-400/60" />
                  </div>
                </div>

                <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Drafts</p>
                    <h3 className="text-3xl font-bold text-amber-300">{existingGuides.filter(g => !g.content?.is_published).length}</h3>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/15">
                    <Edit size={18} className="text-amber-400/60" />
                  </div>
                </div>
              </div>

              {/* Bottom CTA card */}
              <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl p-7 text-center flex flex-col items-center justify-center min-h-[200px] shadow-lg">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/8">
                  <MonitorPlay size={22} className="text-white/30" />
                </div>
                <h3 className="text-sm font-semibold text-white/70 mb-2">Ready to create a guide?</h3>
                <p className="text-white/25 max-w-xs mb-5 text-xs">Jump into the guide manager to create or update character guides.</p>
                <button
                  onClick={() => setView("list")}
                  className="bg-white/10 hover:bg-white/15 border border-white/15 text-white/70 hover:text-white px-5 py-2.5 rounded-xl text-xs font-medium transition-all"
                >
                  Go to Guides
                </button>
              </div>
            </div>
          ) : view === "list" ? (
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-0.5 font-cinzel">Guides</h2>
                  <p className="text-xs text-white/30">Manage character guides and content</p>
                </div>
              </div>

              <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input
                      type="text"
                      placeholder="Search guides..."
                      title="Search guides"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/8 backdrop-blur-md border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white/70 focus:outline-none focus:border-white/25 transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-semibold text-white/25 uppercase tracking-widest border-b border-white/[0.05]">
                        <th className="px-5 py-3 font-medium">Character</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Element</th>
                        <th className="px-5 py-3 font-medium">Weapon</th>
                        <th className="px-5 py-3 font-medium">Rarity</th>
                        <th className="px-5 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredGuides.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-10 text-center text-white/20 text-xs">
                            No guides found.
                          </td>
                        </tr>
                      ) : (
                        filteredGuides.map((guide) => (
                          <tr key={guide.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/8 overflow-hidden shrink-0">
                                  {guide.content?.images?.avatar ? (
                                    <img src={guide.content.images.avatar || undefined} alt={guide.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs font-bold">
                                      {guide.name?.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-white/80">{guide.name}</div>
                                  <div className="text-[10px] text-white/25 font-mono">{guide.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              {guide.content?.is_published ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Draft
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-[10px] text-white/40">{guide.element}</span>
                            </td>
                            <td className="px-5 py-3 text-[10px] text-white/30">
                              {guide.weapon_type}
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs text-amber-400">{guide.rarity}★</span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                  href={`/guides/${guide.slug}`}
                                  target="_blank"
                                  title="View Public Page"
                                  className="p-1.5 text-white/25 hover:text-white/70 hover:bg-white/8 rounded-lg transition-all"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                                <button
                                  onClick={() => loadGuide(guide)}
                                  title="Edit Guide"
                                  className="p-1.5 text-white/25 hover:text-white/70 hover:bg-white/8 rounded-lg transition-all"
                                >
                                  <Edit size={14} />
                                </button>
                                {deletingSlug === guide.slug ? (
                                  <div className="flex items-center gap-1 bg-red-500/10 rounded-lg p-1 border border-red-500/15">
                                    <button onClick={() => confirmDelete(guide.slug)} className="text-[10px] text-red-400 hover:text-red-300 px-2 py-0.5">Confirm</button>
                                    <button onClick={() => setDeletingSlug(null)} className="text-[10px] text-white/30 hover:text-white/60 px-2 py-0.5">Cancel</button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeletingSlug(guide.slug)}
                                    title="Delete Guide"
                                    className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-all"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto pb-20">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-0.5 font-cinzel">
                    {formData.slug ? `Edit: ${formData.name}` : "New Guide"}
                  </h2>
                  <p className="text-xs text-white/25">Configure guide details and build recommendations.</p>
                </div>

                <div className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/60">Published</span>
                    <span className="text-[10px] text-white/25">Visible to public</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    title="Publish toggle"
                    aria-checked={contentData.is_published ? "true" : "false"}
                    onClick={() => handleContentChange("is_published", !(contentData.is_published || false))}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${contentData.is_published ? 'bg-emerald-500' : 'bg-white/10'
                      }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${contentData.is_published ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-white/10 mb-5 hide-scrollbar">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id
                        ? "border-white/60 text-white"
                        : "border-transparent text-white/30 hover:text-white/60"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white/8 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-xl">
                  {/* Basic Info Tab */}
                  {activeTab === "basic" && (
                    <div className="space-y-8">
                      {/* Character Identity */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                          <Users className="text-indigo-400" size={18} />
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Character Identity</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Character Name</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" placeholder="e.g., Jinhsi" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">URL Slug</label>
                            <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="e.g., jinhsi" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Role</label>
                            <input type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="e.g., Main DPS" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Faction</label>
                            <input type="text" value={contentData.faction || ""} onChange={(e) => handleContentChange("faction", e.target.value)} placeholder="e.g., Huanglong" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                          </div>
                          <div className="space-y-2 md:col-span-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class / Title</label>
                            <input type="text" value={contentData.class || ""} onChange={(e) => handleContentChange("class", e.target.value)} placeholder="e.g., Jinzhou Magistrate" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" />
                          </div>
                        </div>
                      </div>

                      {/* Combat Profile */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                          <Sword className="text-rose-400" size={18} />
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Combat Profile</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Element</label>
                            <div className="relative">
                              <select name="element" value={formData.element} onChange={handleInputChange} title="Element" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm appearance-none cursor-pointer">
                                <option value="Glacio">Glacio</option>
                                <option value="Fusion">Fusion</option>
                                <option value="Electro">Electro</option>
                                <option value="Aero">Aero</option>
                                <option value="Spectro">Spectro</option>
                                <option value="Havoc">Havoc</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <ChevronRight className="rotate-90 w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weapon Type</label>
                            <div className="relative">
                              <select name="weapon_type" value={formData.weapon_type} onChange={handleInputChange} title="Weapon Type" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm appearance-none cursor-pointer">
                                <option value="Sword">Sword</option>
                                <option value="Broadblade">Broadblade</option>
                                <option value="Pistols">Pistols</option>
                                <option value="Gauntlets">Gauntlets</option>
                                <option value="Rectifier">Rectifier</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <ChevronRight className="rotate-90 w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rarity</label>
                            <div className="relative">
                              <select name="rarity" value={formData.rarity} onChange={handleInputChange} title="Rarity" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all text-sm appearance-none cursor-pointer font-bold">
                                <option value="5">5 Star</option>
                                <option value="4">4 Star</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                <ChevronRight className="rotate-90 w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md space-y-6">
                        <div className="flex items-center gap-3 mb-2 border-b border-slate-800 pb-4">
                          <AlignLeft className="text-emerald-400" size={18} />
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Biography & Description</h3>
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quote</label>
                          <input type="text" value={contentData.quote || ""} onChange={(e) => handleContentChange("quote", e.target.value)} placeholder="Character's memorable quote..." className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm italic" />
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Trailer URL (YouTube)</label>
                          <input type="url" value={contentData.trailerUrl || ""} onChange={(e) => handleContentChange("trailerUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm font-mono" />
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description / Lore</label>
                          <RichTextEditor value={contentData.description || ""} onChange={(val) => handleContentChange("description", val)} placeholder="Detailed background story..." />
                        </div>
                      </div>

                      {/* Display & Artwork */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md space-y-6">
                        <div className="flex items-center gap-3 mb-2 border-b border-slate-800 pb-4">
                          <Image className="text-amber-400" size={18} />
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Artwork Assets</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Card Image URL</label>
                            <ImageUploadInput value={contentData.cardImage || ""} onChange={(v) => handleContentChange("cardImage", v)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-mono" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Foreground Image (Transparent WebP)</label>
                            <ImageUploadInput value={contentData.foregroundImage || ""} onChange={(v) => handleContentChange("foregroundImage", v)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-mono" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Splash Art URL</label>
                            <ImageUploadInput value={contentData.images?.splash || ""} onChange={(v) => handleNestedContentChange("images", "splash", v)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-mono" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avatar URL</label>
                            <ImageUploadInput value={contentData.images?.avatar || ""} onChange={(v) => handleNestedContentChange("images", "avatar", v)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-mono" />
                          </div>

                          <div className="md:col-span-2">
                            <div className="grid grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">X Pos (%)</label>
                                <input type="number" title="X Position" value={contentData.imageOffset?.x || 0} onChange={(e) => handleNestedContentChange("imageOffset", "x", e.target.value ? parseFloat(e.target.value) : 0)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Y Pos (%)</label>
                                <input type="number" title="Y Position" value={contentData.imageOffset?.y || 0} onChange={(e) => handleNestedContentChange("imageOffset", "y", e.target.value ? parseFloat(e.target.value) : 0)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Scale</label>
                                <input type="number" step="0.1" title="Scale" value={contentData.imageOffset?.scale || 1} onChange={(e) => handleNestedContentChange("imageOffset", "scale", e.target.value ? parseFloat(e.target.value) : 1)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Desktop Scale</label>
                                <input type="number" step="0.1" title="Desktop Scale" value={contentData.imageOffset?.desktopScale || 1.1} onChange={(e) => handleNestedContentChange("imageOffset", "desktopScale", e.target.value ? parseFloat(e.target.value) : 1.1)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Spine Animation */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-2">
                          <div className="flex items-center gap-3">
                            <MonitorPlay className="text-cyan-400" size={18} />
                            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">2D Spine Animation</h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              handleContentChange("spine", {
                                skelUrl: "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_kekcf3.skel",
                                atlasUrl: "https://res.cloudinary.com/ds6dwbk37/raw/upload/v1777173287/Portraits_Feixue_iltaii.atlas",
                                textures: [
                                  { name: "Portraits_Feixue.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777173288/Portraits_Feixue_ihwgwn.webp" },
                                  { name: "Portraits_Feixue_2.webp", url: "https://res.cloudinary.com/ds6dwbk37/image/upload/v1777190831/Portraits_Feixue_2_q8dke1.png" }
                                ],
                                viewport: { padBottom: "15%", padTop: "15%" },
                                offset: { x: 0, y: 0, scale: 1.1 }
                              });
                            }}
                            className="text-[10px] uppercase tracking-wider font-bold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 rounded transition-colors border border-cyan-500/20"
                          >
                            Fill Hiyuki Demos
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Skeleton (.skel) URL</label>
                            <input type="text" title="Skeleton URL" value={contentData.spine?.skelUrl || ""} onChange={(e) => handleNestedContentChange("spine", "skelUrl", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-sm" />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Atlas (.atlas) URL</label>
                            <input type="text" title="Atlas URL" value={contentData.spine?.atlasUrl || ""} onChange={(e) => handleNestedContentChange("spine", "atlasUrl", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-sm" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Animation Options</label>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Animation Name</label>
                                <input type="text" placeholder="e.g. idle" value={contentData.spine?.animation || ""} onChange={(e) => handleNestedContentChange("spine", "animation", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Skin Name</label>
                                <input type="text" placeholder="e.g. default" value={contentData.spine?.skin || ""} onChange={(e) => handleNestedContentChange("spine", "skin", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-sm" />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">X Pos (%)</label>
                                <input type="number" title="Spine X Position" value={contentData.spine?.offset?.x || 0} onChange={(e) => handleNestedContentChange("spine", "offset", { ...(contentData.spine?.offset || {}), x: e.target.value ? parseFloat(e.target.value) : 0 })} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Y Pos (%)</label>
                                <input type="number" title="Spine Y Position" value={contentData.spine?.offset?.y || 0} onChange={(e) => handleNestedContentChange("spine", "offset", { ...(contentData.spine?.offset || {}), y: e.target.value ? parseFloat(e.target.value) : 0 })} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Scale</label>
                                <input type="number" step="0.1" title="Spine Scale" value={contentData.spine?.offset?.scale || 1.1} onChange={(e) => handleNestedContentChange("spine", "offset", { ...(contentData.spine?.offset || {}), scale: e.target.value ? parseFloat(e.target.value) : 1.1 })} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500" />
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Pad L</label>
                                <input type="text" placeholder="15%" value={contentData.spine?.viewport?.padLeft || ""} onChange={(e) => handleNestedContentChange("spine", "viewport", { ...(contentData.spine?.viewport || {}), padLeft: e.target.value })} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Pad R</label>
                                <input type="text" placeholder="15%" value={contentData.spine?.viewport?.padRight || ""} onChange={(e) => handleNestedContentChange("spine", "viewport", { ...(contentData.spine?.viewport || {}), padRight: e.target.value })} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Pad T</label>
                                <input type="text" placeholder="15%" value={contentData.spine?.viewport?.padTop || ""} onChange={(e) => handleNestedContentChange("spine", "viewport", { ...(contentData.spine?.viewport || {}), padTop: e.target.value })} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono" />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Pad B</label>
                                <input type="text" placeholder="15%" value={contentData.spine?.viewport?.padBottom || ""} onChange={(e) => handleNestedContentChange("spine", "viewport", { ...(contentData.spine?.viewport || {}), padBottom: e.target.value })} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Atlas Textures</label>
                              <span className="text-xs font-mono text-slate-500">{(contentData.spine?.textures || []).length} / 4</span>
                            </div>
                            <div className="space-y-3">
                              {(contentData.spine?.textures || []).map((tex: any, idx: number) => (
                                <div key={idx} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                  <div className="flex-1 space-y-2">
                                    <input type="text" value={tex.name || ""} placeholder="Portraits_Feixue.webp" onChange={(e) => {
                                      const newTextures = [...(contentData.spine?.textures || [])];
                                      newTextures[idx] = { ...newTextures[idx], name: e.target.value };
                                      handleNestedContentChange("spine", "textures", newTextures);
                                    }} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
                                    <input type="text" value={tex.url || ""} placeholder="https://..." onChange={(e) => {
                                      const newTextures = [...(contentData.spine?.textures || [])];
                                      newTextures[idx] = { ...newTextures[idx], url: e.target.value };
                                      handleNestedContentChange("spine", "textures", newTextures);
                                    }} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-md px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 font-mono" />
                                  </div>
                                  <button type="button" title="Remove texture" onClick={() => {
                                    const newTextures = [...(contentData.spine?.textures || [])];
                                    newTextures.splice(idx, 1);
                                    handleNestedContentChange("spine", "textures", newTextures);
                                  }} className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"><X size={16} /></button>
                                </div>
                              ))}
                              <button type="button" onClick={() => {
                                const newTextures = [...(contentData.spine?.textures || []), { name: "", url: "" }];
                                handleNestedContentChange("spine", "textures", newTextures);
                              }} className="w-full py-2.5 mt-2 border border-dashed border-cyan-500/30 rounded-lg text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"><Plus size={14} /> Add Texture</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content Tab: Stats, Power Level, Roles, Pros & Cons */}
                  {activeTab === "content" && (
                    <div className="space-y-8">
                      {/* Stats & Power Level */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                            <Zap className="text-cyan-400" size={18} />
                            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Base Stats (Lv. 90)</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base HP</label>
                              <input type="text" value={contentData.stats?.hp || ""} onChange={(e) => handleNestedContentChange("stats", "hp", e.target.value)} placeholder="e.g., 10,825" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" />
                            </div>
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base ATK</label>
                              <input type="text" value={contentData.stats?.atk || ""} onChange={(e) => handleNestedContentChange("stats", "atk", e.target.value)} placeholder="e.g., 412" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" />
                            </div>
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base DEF</label>
                              <input type="text" value={contentData.stats?.def || ""} onChange={(e) => handleNestedContentChange("stats", "def", e.target.value)} placeholder="e.g., 1,238" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" />
                            </div>
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base CRIT Rate</label>
                              <input type="text" value={contentData.stats?.critRate || ""} onChange={(e) => handleNestedContentChange("stats", "critRate", e.target.value)} placeholder="e.g., 5.0%" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" />
                            </div>
                            <div className="space-y-2 relative col-span-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base CRIT DMG</label>
                              <input type="text" value={contentData.stats?.critDmg || ""} onChange={(e) => handleNestedContentChange("stats", "critDmg", e.target.value)} placeholder="e.g., 150.0%" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                            <List className="text-violet-400" size={18} />
                            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Power Level Rating</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier Rank</label>
                              <input type="text" value={contentData.stats?.powerLevel || ""} onChange={(e) => handleNestedContentChange("stats", "powerLevel", e.target.value)} placeholder="e.g., S+" className="w-32 bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-violet-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-2xl font-black text-center uppercase" />
                            </div>
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verdict / Overview</label>
                              <RichTextEditor value={contentData.stats?.powerLevelText || ""} onChange={(val) => handleNestedContentChange("stats", "powerLevelText", val)} placeholder="Explain their tier position here..." minHeight="100px" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pros and Cons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                <Plus size={14} strokeWidth={3} />
                              </div>
                              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Pros</h3>
                            </div>
                            <span className="text-xs font-mono text-slate-500">{(contentData.pros || []).length} / 5</span>
                          </div>
                          <div className="space-y-3">
                            {(contentData.pros || []).map((pro: string, idx: number) => (
                              <div key={idx} className="flex gap-3 group">
                                <input type="text" value={pro} onChange={(e) => { const newPros = [...(contentData.pros || [])]; newPros[idx] = e.target.value; handleContentChange("pros", newPros); }} className="flex-1 bg-[#0f172a]/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" placeholder="e.g. High AoE damage" />
                                <button type="button" title="Remove pro" onClick={() => { const newPros = [...(contentData.pros || [])]; newPros.splice(idx, 1); handleContentChange("pros", newPros); }} className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-slate-800"><X size={16} /></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => handleContentChange("pros", [...(contentData.pros || []), ""])} className="w-full py-2.5 mt-2 border border-dashed border-emerald-500/30 rounded-lg text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"><Plus size={14} /> Add Pro</button>
                          </div>
                        </div>

                        <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                                <Plus className="rotate-45" size={14} strokeWidth={3} />
                              </div>
                              <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Cons</h3>
                            </div>
                            <span className="text-xs font-mono text-slate-500">{(contentData.cons || []).length} / 5</span>
                          </div>
                          <div className="space-y-3">
                            {(contentData.cons || []).map((con: string, idx: number) => (
                              <div key={idx} className="flex gap-3 group">
                                <input type="text" value={con} onChange={(e) => { const newCons = [...(contentData.cons || [])]; newCons[idx] = e.target.value; handleContentChange("cons", newCons); }} className="flex-1 bg-[#0f172a]/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-rose-500" placeholder="e.g. Energy hungry" />
                                <button type="button" title="Remove con" onClick={() => { const newCons = [...(contentData.cons || [])]; newCons.splice(idx, 1); handleContentChange("cons", newCons); }} className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-slate-800"><X size={16} /></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => handleContentChange("cons", [...(contentData.cons || []), ""])} className="w-full py-2.5 mt-2 border border-dashed border-rose-500/30 rounded-lg text-rose-400 hover:text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/5 transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"><Plus size={14} /> Add Con</button>
                          </div>
                        </div>
                      </div>

                      {/* Display Panels & Role details */}
                      <div className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                              <LayoutDashboard className="text-blue-400" size={16} />
                              <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase">Role Overview</h3>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Main Role Title</label>
                                <input type="text" value={contentData.roleOverview?.role || ""} onChange={(e) => handleNestedContentChange("roleOverview", "role", e.target.value)} placeholder="e.g. MAIN DPS" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weapon System text</label>
                                <input type="text" value={contentData.roleOverview?.weapon || ""} onChange={(e) => handleNestedContentChange("roleOverview", "weapon", e.target.value)} placeholder="e.g. LAMENT" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm font-mono" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tags (Comma Separated)</label>
                                <CommaArrayInput value={contentData.roleOverview?.bestFor} onChange={(val) => handleNestedContentChange("roleOverview", "bestFor", val)} placeholder="e.g. Sustained Damage, AoE Damage" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-all text-sm" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                              <Database className="text-pink-400" size={16} />
                              <h3 className="text-xs font-bold text-slate-200 tracking-wide uppercase">HUD Widget Setup</h3>
                            </div>
                            <div className="space-y-4">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Panel Title</label>
                                <input type="text" value={contentData.movablePanel?.title || ""} onChange={(e) => handleNestedContentChange("movablePanel", "title", e.target.value)} placeholder="e.g. SYS.DIAGNOSTICS" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all text-sm font-mono" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Widget Readout / Description</label>
                                <RichTextEditor value={contentData.movablePanel?.description || ""} onChange={(val) => handleNestedContentChange("movablePanel", "description", val)} placeholder="Enter optimization text..." minHeight="100px" />
                              </div>
                              <div className="space-y-2 relative">
                                <div className="flex justify-between items-center mb-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block block">Efficiency Meter</label>
                                  <span className="text-xs font-mono font-bold text-pink-400">{contentData.movablePanel?.percentage || 85}%</span>
                                </div>
                                <input type="range" title="Efficiency Percentage" min="0" max="100" value={contentData.movablePanel?.percentage || 85} onChange={(e) => handleNestedContentChange("movablePanel", "percentage", parseInt(e.target.value) || 0)} className="w-full accent-pink-500" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default X Offset</label>
                                  <input type="number" value={contentData.movablePanel?.x || 0} onChange={(e) => handleNestedContentChange("movablePanel", "x", parseInt(e.target.value) || 0)} placeholder="0" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all text-sm font-mono" />
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Default Y Offset</label>
                                  <input type="number" value={contentData.movablePanel?.y || 0} onChange={(e) => handleNestedContentChange("movablePanel", "y", parseInt(e.target.value) || 0)} placeholder="0" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all text-sm font-mono" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mechanics Tab */}
                  {activeTab === "mechanics" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <MonitorPlay className="text-pink-400" size={20} />
                        <div>
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Combat Mechanics</h3>
                          <p className="text-xs text-slate-500">Define the core, combo, and utility mechanics for the character&apos;s kit.</p>
                        </div>
                      </div>
                      {(contentData.combatMechanics || []).map((mech: any, idx: number) => (
                        <div key={idx} className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md relative group">
                          <button type="button" title="Remove mechanic" onClick={() => removeItem("combatMechanics", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-800">
                            <Trash2 size={16} />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mechanic Name</label>
                              <input type="text" value={mech.title || ""} onChange={(e) => updateItem("combatMechanics", idx, "title", e.target.value)} placeholder="e.g. Intro Skill: ... " className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 font-bold text-sm" />
                            </div>
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</label>
                              <div className="relative">
                                <select value={mech.type || "core"} title="Mechanic Type" onChange={(e) => updateItem("combatMechanics", idx, "type", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider">
                                  <option value="core">Core</option>
                                  <option value="combo">Combo</option>
                                  <option value="utility">Utility</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                  <ChevronRight className="rotate-90 w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Image URL (Fallback/Background)</label>
                                <ImageUploadInput value={mech.imageUrl || ""} onChange={(v) => updateItem("combatMechanics", idx, "imageUrl", v)} placeholder="https://..." className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all font-mono text-sm" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Video URL (MP4 / WebP loop / YouTube)</label>
                                <input type="text" value={mech.videoUrl || ""} onChange={(e) => updateItem("combatMechanics", idx, "videoUrl", e.target.value)} placeholder="https://..." className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all font-mono text-sm" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Video Start Time (seconds, e.g. 15)</label>
                                <input type="number" value={mech.videoStartTime || ""} onChange={(e) => updateItem("combatMechanics", idx, "videoStartTime", e.target.value ? parseInt(e.target.value) : undefined)} placeholder="Start time in seconds" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all font-mono text-sm" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Video End Time (seconds, e.g. 25)</label>
                                <input type="number" value={mech.videoEndTime || ""} onChange={(e) => updateItem("combatMechanics", idx, "videoEndTime", e.target.value ? parseInt(e.target.value) : undefined)} placeholder="End time in seconds" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-pink-500 transition-all font-mono text-sm" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Analysis / Description</label>
                            <RichTextEditor value={mech.description || ""} onChange={(val) => updateItem("combatMechanics", idx, "description", val)} placeholder="Explain the damage ratios, iframes, and combo utility..." />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem("combatMechanics", { title: "", description: "", type: "core", imageUrl: "", videoUrl: "" })} className="w-full py-4 border border-dashed border-pink-500/30 rounded-xl text-pink-400 hover:text-pink-300 hover:border-pink-500/60 hover:bg-pink-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs">
                        <Plus size={16} strokeWidth={3} /> Add Mechanic
                      </button>
                    </div>
                  )}

                  {/* Weapons Tab */}
                  {activeTab === "weapons" && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Sword className="text-amber-400" size={20} />
                        <div>
                          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">Weapon Recommendations</h3>
                          <p className="text-xs text-slate-500">Configure BiS, signature, and alternative weapons for the character.</p>
                        </div>
                      </div>
                      {(contentData.weapons || []).map((weapon: any, idx: number) => (
                        <div key={idx} className="bg-[#131c2c] border border-slate-700/60 rounded-xl p-6 shadow-md relative group">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center justify-center w-7 h-7 rounded-sm bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20">{idx + 1}</span>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-700">
                                  <input type="checkbox" checked={weapon.isSignature || false} onChange={(e) => updateItem("weapons", idx, "isSignature", e.target.checked)} className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-fuchsia-500 focus:ring-fuchsia-500/50" />
                                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Signature Window</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-700">
                                  <input type="checkbox" checked={weapon.isBis || false} onChange={(e) => updateItem("weapons", idx, "isBis", e.target.checked)} className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-amber-500 focus:ring-amber-500/50" />
                                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Best In Slot</span>
                                </label>
                              </div>
                            </div>
                            <button type="button" title="Remove weapon" onClick={() => removeItem("weapons", idx)} className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-800">
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Stats Col */}
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weapon Name</label>
                                  <input type="text" value={weapon.name || ""} onChange={(e) => updateItem("weapons", idx, "name", e.target.value)} placeholder="e.g. Emerald of Genesis" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-bold text-sm" />
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weapon Type</label>
                                  <div className="relative">
                                    <select value={weapon.type || weapon.weaponType || "Sword"} title="Weapon Type" onChange={(e) => {
                                      const current = [...(contentData.weapons || [])];
                                      current[idx] = { ...current[idx], type: e.target.value, weaponType: e.target.value };
                                      handleContentChange("weapons", current);
                                    }} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider">
                                      <option value="Broadblade">Broadblade</option>
                                      <option value="Sword">Sword</option>
                                      <option value="Pistols">Pistols</option>
                                      <option value="Gauntlets">Gauntlets</option>
                                      <option value="Rectifier">Rectifier</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                      <ChevronRight className="rotate-90 w-4 h-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rarity</label>
                                  <div className="relative">
                                    <select value={weapon.rarity || 5} title="Weapon Rarity" onChange={(e) => updateItem("weapons", idx, "rarity", parseInt(e.target.value))} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider">
                                      <option value={5}>5 Star</option>
                                      <option value={4}>4 Star</option>
                                      <option value={3}>3 Star</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                      <ChevronRight className="rotate-90 w-4 h-4" />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tier / Rank</label>
                                  <div className="relative">
                                    <select value={weapon.rank || "S"} title="Weapon Rank" onChange={(e) => updateItem("weapons", idx, "rank", e.target.value)} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer text-sm font-bold uppercase tracking-wider font-mono">
                                      <option value="S+">S+</option>
                                      <option value="S">S</option>
                                      <option value="A">A</option>
                                      <option value="B">B</option>
                                      <option value="C">C</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                                      <ChevronRight className="rotate-90 w-4 h-4" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Base ATK</label>
                                  <input type="number" title="Base ATK" value={weapon.baseAtk || ""} onChange={(e) => updateItem("weapons", idx, "baseAtk", parseInt(e.target.value))} className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-white font-mono text-sm" />
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sec. Stat</label>
                                  <input type="text" value={weapon.secondaryStat || ""} onChange={(e) => updateItem("weapons", idx, "secondaryStat", e.target.value)} placeholder="CRIT RATE" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-white text-sm" />
                                </div>
                                <div className="space-y-2 relative">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stat Value</label>
                                  <input type="text" value={weapon.secondaryStatValue || ""} onChange={(e) => updateItem("weapons", idx, "secondaryStatValue", e.target.value)} placeholder="24.3%" className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-white font-mono text-sm" />
                                </div>
                              </div>
                            </div>

                            {/* Desc Col */}
                            <div className="space-y-6">
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Passive Ability</label>
                                <RichTextEditor value={weapon.passiveDescription || ""} onChange={(val) => updateItem("weapons", idx, "passiveDescription", val)} placeholder="Enter weapon passive effect..." minHeight="90px" />
                              </div>
                              <div className="space-y-2 relative">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Why is this good?</label>
                                <RichTextEditor value={weapon.reasoning || weapon.specialNote || ""} onChange={(val) => updateItem("weapons", idx, "reasoning", val)} placeholder="Explain why it's recommended..." minHeight="90px" />
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-slate-800 space-y-6">
                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Weapon Render Image URL (Transparent PNG/WebP)</label>
                              <ImageUploadInput value={weapon.imageUrl || ""} onChange={(v) => updateItem("weapons", idx, "imageUrl", v)} placeholder="https://..." className="w-full bg-[#0f172a]/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-sm" />
                            </div>

                            <div className="space-y-2 relative">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Display Positioning</label>
                              <div className="grid grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">X Offset (px)</label>
                                  <input type="number" title="Weapon X Offset" value={weapon.imageX || 0} onChange={(e) => updateItem("weapons", idx, "imageX", e.target.value ? parseFloat(e.target.value) : 0)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-white font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Y Offset (px)</label>
                                  <input type="number" title="Weapon Y Offset" value={weapon.imageY || 0} onChange={(e) => updateItem("weapons", idx, "imageY", e.target.value ? parseFloat(e.target.value) : 0)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-white font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Rotate (deg)</label>
                                  <input type="number" title="Weapon Rotation" value={weapon.imageRotate || -12} onChange={(e) => updateItem("weapons", idx, "imageRotate", e.target.value ? parseFloat(e.target.value) : 0)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-white font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Scale</label>
                                  <input type="number" step="0.1" title="Weapon Scale" value={weapon.imageScale || 1} onChange={(e) => updateItem("weapons", idx, "imageScale", e.target.value ? parseFloat(e.target.value) : 1)} className="w-full bg-[#1e293b] border border-slate-700 rounded text-center py-2 text-sm text-slate-200 focus:outline-none focus:border-white font-mono" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem("weapons", { name: "", baseAtk: 0, isBis: false })} className="w-full py-4 border border-dashed border-amber-500/30 rounded-xl text-amber-400 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs">
                        <Plus size={16} strokeWidth={3} /> Add New Weapon
                      </button>
                    </div>
                  )}

                  {/* Echoes Tab */}
                  {activeTab === "echoes" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <h3 className="text-sm font-semibold text-white">Echo Sets Configurations</h3>
                        <button type="button" onClick={() => {
                          const currentSets = contentData.echoSets || (contentData.echoes ? [contentData.echoes] : []);
                          handleNestedContentChange("echoSets", null, [...currentSets, {
                            name: "New Set",
                            pattern: "4-3-3-1-1",
                            mainSet: "",
                            mainSetDescription: "",
                            cost4: [], cost4Name: "",
                            cost3: [], cost3Name: "",
                            cost1: [], cost1Name: "",
                            substats: []
                          }]);
                        }} className="py-1.5 px-3 bg-amber-500/10 text-amber-400 border border-amber-500/50 rounded hover:bg-amber-500/20 transition-all text-xs font-bold flex items-center gap-2">
                          <Plus size={14} /> Add Set
                        </button>
                      </div>

                      {(() => {
                        const echoSets = contentData.echoSets || (contentData.echoes && Object.keys(contentData.echoes).length > 0 ? [contentData.echoes] : []);
                        if (echoSets.length === 0) return <div className="text-slate-500 text-center py-8">No Echo Sets configured.</div>;

                        return echoSets.map((set: any, setIdx: any) => (
                          <div key={setIdx} className="border border-slate-700 rounded-xl p-6 relative bg-[#1e293b]/30 mb-6">
                            {echoSets.length > 1 && (
                              <button type="button" title="Remove set" onClick={() => {
                                const newSets = [...echoSets];
                                newSets.splice(setIdx, 1);
                                handleNestedContentChange("echoSets", null, newSets);
                              }} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-slate-800/80 rounded-lg">
                                <X size={16} />
                              </button>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Set Title (e.g. Best Option)</label>
                                <input type="text" value={set.name || ""} onChange={(e) => {
                                  const newSets = [...echoSets];
                                  newSets[setIdx] = { ...newSets[setIdx], name: e.target.value };
                                  handleNestedContentChange("echoSets", null, newSets);
                                }} placeholder="e.g., Best Option" className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Echo Layout Pattern</label>
                                <input type="text" value={set.pattern || "4-3-3-1-1"} onChange={(e) => {
                                  const newSets = [...echoSets];
                                  newSets[setIdx] = { ...newSets[setIdx], pattern: e.target.value };
                                  handleNestedContentChange("echoSets", null, newSets);
                                }} placeholder="e.g., 4-4-1-1-1" className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50" />
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Set Name (Sonata)</label>
                                <input type="text" value={set.mainSet || ""} onChange={(e) => {
                                  const newSets = [...echoSets];
                                  newSets[setIdx] = { ...newSets[setIdx], mainSet: e.target.value };
                                  handleNestedContentChange("echoSets", null, newSets);
                                }} placeholder="e.g., Freezing Frost" className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Set Description</label>
                                <input type="text" value={set.mainSetDescription || ""} onChange={(e) => {
                                  const newSets = [...echoSets];
                                  newSets[setIdx] = { ...newSets[setIdx], mainSetDescription: e.target.value };
                                  handleNestedContentChange("echoSets", null, newSets);
                                }} placeholder="e.g., 5-Pc: Glacio DMG +10%..." className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono" />
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ER Requirement (Optional)</label>
                                <input type="text" value={set.erRequirement || ""} onChange={(e) => {
                                  const newSets = [...echoSets];
                                  newSets[setIdx] = { ...newSets[setIdx], erRequirement: e.target.value };
                                  handleNestedContentChange("echoSets", null, newSets);
                                }} placeholder="e.g., 120-130% Energy Regeneration" className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono" />
                              </div>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-slate-700/50">
                              <h3 className="text-sm font-semibold text-white mb-2">Echo Priorities & Stats</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-800 pb-4">
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 4 Title</label>
                                    <input type="text" title="Cost 4 Title" value={set.cost4Name || ""} onChange={(e) => {
                                      const newSets = [...echoSets];
                                      newSets[setIdx] = { ...newSets[setIdx], cost4Name: e.target.value };
                                      handleNestedContentChange("echoSets", null, newSets);
                                    }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 4 Skill Description</label>
                                    <RichTextEditor value={set.cost4Description || ""} onChange={(val) => {
                                      const newSets = [...echoSets];
                                      newSets[setIdx] = { ...newSets[setIdx], cost4Description: val };
                                      handleNestedContentChange("echoSets", null, newSets);
                                    }} placeholder="Skill info..." minHeight="60px" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 4 Priority (comma,sep)</label>
                                    <CommaArrayInput value={set.cost4} onChange={(val) => { const newSets = [...echoSets]; newSets[setIdx] = { ...newSets[setIdx], cost4: val }; handleNestedContentChange("echoSets", null, newSets); }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 3 Title</label>
                                    <input type="text" title="Cost 3 Title" value={set.cost3Name || ""} onChange={(e) => {
                                      const newSets = [...echoSets];
                                      newSets[setIdx] = { ...newSets[setIdx], cost3Name: e.target.value };
                                      handleNestedContentChange("echoSets", null, newSets);
                                    }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 3 Priority</label>
                                    <CommaArrayInput value={set.cost3} onChange={(val) => { const newSets = [...echoSets]; newSets[setIdx] = { ...newSets[setIdx], cost3: val }; handleNestedContentChange("echoSets", null, newSets); }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 1 Title</label>
                                    <input type="text" title="Cost 1 Title" value={set.cost1Name || ""} onChange={(e) => {
                                      const newSets = [...echoSets];
                                      newSets[setIdx] = { ...newSets[setIdx], cost1Name: e.target.value };
                                      handleNestedContentChange("echoSets", null, newSets);
                                    }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cost 1 Priority</label>
                                    <CommaArrayInput value={set.cost1} onChange={(val) => { const newSets = [...echoSets]; newSets[setIdx] = { ...newSets[setIdx], cost1: val }; handleNestedContentChange("echoSets", null, newSets); }} className="w-full bg-[#0f172a] border border-slate-700/50 rounded px-3 py-1.5 text-sm text-slate-200" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-700/50">
                              <h3 className="text-sm font-semibold text-white">Substats Priority</h3>
                              {(set.substats || []).map((sub: any, idx: any) => (
                                <div key={idx} className="flex gap-4 items-center">
                                  <input type="text" value={sub.stat || ""} onChange={(e) => {
                                    const newSets = [...echoSets];
                                    const current = [...(set.substats || [])];
                                    current[idx] = { ...current[idx], stat: e.target.value };
                                    newSets[setIdx] = { ...newSets[setIdx], substats: current };
                                    handleNestedContentChange("echoSets", null, newSets);
                                  }} placeholder="Stat Name" className="flex-1 bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200" />
                                  <select value={sub.priority || "high"} title="Substat Priority" onChange={(e) => {
                                    const newSets = [...echoSets];
                                    const current = [...(set.substats || [])];
                                    current[idx] = { ...current[idx], priority: e.target.value };
                                    newSets[setIdx] = { ...newSets[setIdx], substats: current };
                                    handleNestedContentChange("echoSets", null, newSets);
                                  }} className="w-32 bg-[#0f172a] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200">
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                  </select>
                                  <button type="button" title="Remove substat" onClick={() => {
                                    const newSets = [...echoSets];
                                    const current = [...(set.substats || [])];
                                    current.splice(idx, 1);
                                    newSets[setIdx] = { ...newSets[setIdx], substats: current };
                                    handleNestedContentChange("echoSets", null, newSets);
                                  }} className="p-2 text-slate-500 hover:text-red-400">
                                    <X size={20} />
                                  </button>
                                </div>
                              ))}
                              <button type="button" onClick={() => {
                                const newSets = [...echoSets];
                                const current = [...(set.substats || [])];
                                newSets[setIdx] = { ...newSets[setIdx], substats: [...current, { stat: "", priority: "medium" }] };
                                handleNestedContentChange("echoSets", null, newSets);
                              }} className="py-2 px-4 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-amber-400 flex items-center gap-2 text-sm">
                                <Plus size={16} /> Add Substat
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}

                  {/* Abilities & Kit Tab */}
                  {activeTab === "abilities" && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-2">Kit / Abilities</h3>
                        <p className="text-xs text-slate-400">Configure abilities. Skill Info and Level Scaling use JSON arrays of {`{ label: "...", value: "..." }`}</p>

                        {['basicAttack', 'resonanceSkill', 'forteCircuit', 'resonanceLiberation', 'introSkill', 'outroSkill'].map((skillType) => (
                          <div key={skillType} className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-5 space-y-4 shadow-lg overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-500 pl-3 flex items-center justify-between">
                              <span>{skillType.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <div className="flex items-center gap-2 font-mono text-xs font-normal">
                                <span className="text-slate-500">Priority (1-5):</span>
                                <input type="number" min="1" max="5" title="Upgrade Priority" value={contentData.kit?.[skillType]?.upgradePriority || 1} onChange={(e) => {
                                  setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), upgradePriority: parseInt(e.target.value) } } }));
                                }} className="w-16 bg-[#1e293b] border border-slate-700/50 rounded px-2 py-1 text-slate-200 focus:border-amber-500/50 outline-none" />
                              </div>
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Skill Name</label>
                                <input type="text" value={contentData.kit?.[skillType]?.name || ""} onChange={(e) => {
                                  setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), name: e.target.value } } }));
                                }} placeholder="e.g. Basic Attack" className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono shadow-inner" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Icon URL</label>
                                <ImageUploadInput value={contentData.kit?.[skillType]?.icon || ""} onChange={(v) => {
                                  setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), icon: v } } }));
                                }} placeholder="e.g. /icons/skill1.webp" className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono shadow-inner" />
                              </div>
                            </div>

                            <div className="space-y-1 bg-[#162032] p-4 rounded-lg border border-slate-700/30">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2 mb-2">
                                Video Preview
                              </label>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1">
                                  <input type="text" value={contentData.kit?.[skillType]?.video || ""} onChange={(e) => {
                                    setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), video: e.target.value } } }));
                                  }} placeholder="Video URL (WebM, MP4, YouTube)" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono shadow-inner" />
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                  <div className="relative w-1/2 sm:w-24">
                                    <input type="number" value={contentData.kit?.[skillType]?.videoStart || ""} onChange={(e) => {
                                      setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), videoStart: e.target.value } } }));
                                    }} placeholder="Start" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono shadow-inner pr-6" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono pointer-events-none">s</span>
                                  </div>
                                  <div className="relative w-1/2 sm:w-24">
                                    <input type="number" value={contentData.kit?.[skillType]?.videoEnd || ""} onChange={(e) => {
                                      setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), videoEnd: e.target.value } } }));
                                    }} placeholder="End" className="w-full bg-[#0f172a] border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono shadow-inner pr-6" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono pointer-events-none">s</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1 mt-2">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
                              <RichTextEditor value={contentData.kit?.[skillType]?.description || ""} onChange={(val) => {
                                setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), description: val } } }));
                              }} placeholder="Enter skill details..." minHeight="90px" />
                            </div>

                            <div className="space-y-1 mt-2">
                              <label className="text-[10px] font-bold text-amber-500 uppercase tracking-widest pl-1">Quick Tip</label>
                              <input type="text" value={contentData.kit?.[skillType]?.quickTip || ""} onChange={(e) => {
                                setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), quickTip: e.target.value } } }));
                              }} placeholder="Quick pointer..." className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono shadow-inner" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Skill Info</label>
                                <KeyValueEditor value={contentData.kit?.[skillType]?.skillInfo || []} onChange={(parsed) => setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), skillInfo: parsed } } }))} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Level Scaling</label>
                                <KeyValueEditor value={contentData.kit?.[skillType]?.levelScaling || []} onChange={(parsed) => setContentData((prev: any) => ({ ...prev, kit: { ...prev.kit, [skillType]: { ...(prev.kit?.[skillType] || {}), levelScaling: parsed } } }))} />
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      {/* Section Header with live preview */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <Zap size={16} className="text-amber-400" />
                            Skill Upgrade Priority
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded">
                            {(contentData.skillPriority || []).length} skills
                          </span>
                        </div>

                        {/* Live Preview Strip */}
                        {(contentData.skillPriority || []).length > 0 && (
                          <div className="bg-white/5 backdrop-blur border border-slate-700/50 rounded-xl p-3 mb-4">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Live Preview</p>
                            <div className="flex items-center flex-wrap gap-1.5">
                              {(contentData.skillPriority || []).map((skill: any, idx: number) => {
                                const p = skill.priority?.toLowerCase();
                                const isHigh = p === 'high';
                                const isMed = p === 'medium';
                                return (
                                  <span key={idx} className="contents">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold ${isHigh ? "bg-white text-black" : isMed ? "bg-slate-600 text-slate-200" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                                      <span className="font-mono text-[8px] opacity-40">{String(idx + 1).padStart(2, '0')}</span>
                                      <span>{skill.name || '—'}</span>
                                    </div>
                                    {idx < (contentData.skillPriority || []).length - 1 && (
                                      <span className="text-slate-600 text-[10px] font-bold select-none">›</span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Skill Cards */}
                      <div className="space-y-3">
                        {(contentData.skillPriority || []).map((skill: any, idx: number) => {
                          const p = skill.priority?.toLowerCase();
                          const isHigh = p === 'high';
                          const isMed = p === 'medium';
                          const accentColor = isHigh ? 'amber' : isMed ? 'blue' : 'slate';

                          return (
                            <div key={idx} className="relative group">
                              {/* Card */}
                              <div className={`bg-[#0f172a] border rounded-xl overflow-hidden transition-all duration-200 ${isHigh ? "border-amber-500/30 hover:border-amber-500/50" : isMed ? "border-blue-500/20 hover:border-blue-500/40" : "border-slate-700/50 hover:border-slate-600"}`}>
                                {/* Top bar with rank + name inline */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/50">
                                  {/* Rank badge */}
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isHigh ? "bg-amber-500/20 text-amber-400" : isMed ? "bg-blue-500/20 text-blue-400" : "bg-slate-700 text-slate-400"}`}>
                                    {String(idx + 1).padStart(2, '0')}
                                  </div>

                                  {/* Skill name input */}
                                  <input
                                    type="text"
                                    value={skill.name || ""}
                                    onChange={(e) => updateItem("skillPriority", idx, "name", e.target.value)}
                                    placeholder="Skill name..."
                                    aria-label={`Skill ${idx + 1} name`}
                                    className="flex-1 bg-transparent text-sm text-white font-bold focus:outline-none placeholder:text-slate-600"
                                  />

                                  {/* Priority toggle buttons */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    {[
                                      { val: 'high', label: '★', tip: 'Max', cls: 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.3)]' },
                                      { val: 'medium', label: '●', tip: 'High', cls: 'bg-blue-500 text-white shadow-[0_0_6px_rgba(59,130,246,0.3)]' },
                                      { val: 'low', label: '○', tip: 'Norm', cls: 'bg-slate-600 text-slate-300' },
                                    ].map(opt => (
                                      <button
                                        key={opt.val}
                                        type="button"
                                        onClick={() => updateItem("skillPriority", idx, "priority", opt.val)}
                                        title={opt.tip}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all duration-150 ${skill.priority === opt.val ? opt.cls : "bg-slate-800 text-slate-600 hover:text-slate-400 hover:bg-slate-700"}`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => removeItem("skillPriority", idx)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label={`Remove skill ${idx + 1}`}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>

                                {/* Reason textarea — compact */}
                                <div className="px-4 py-2.5">
                                  <textarea
                                    value={skill.reason || ""}
                                    onChange={(e) => updateItem("skillPriority", idx, "reason", e.target.value)}
                                    placeholder="Why prioritize this skill..."
                                    aria-label={`Skill ${idx + 1} reason`}
                                    className="w-full bg-transparent text-[13px] text-slate-400 focus:text-slate-200 focus:outline-none placeholder:text-slate-700 resize-none leading-relaxed transition-colors"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add button */}
                      <button
                        type="button"
                        onClick={() => addItem("skillPriority", { name: "", priority: "medium", reason: "" })}
                        className="w-full py-3.5 border border-dashed border-amber-500/30 rounded-xl text-amber-400 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs"
                      >
                        <Plus size={16} strokeWidth={3} /> Add Skill
                      </button>
                    </div>
                  )}

                  {/* Teams Tab */}
                  {activeTab === "teams" && (
                    <div className="space-y-6">
                      {(contentData.teams || []).map((team: any, idx: number) => (
                        <div key={idx} className="bg-[#0f172a] border border-slate-700 rounded-lg p-5 relative group">
                          <button type="button" title="Remove team" onClick={() => removeItem("teams", idx)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors">
                            <X size={18} />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Name</label>
                              <input type="text" value={team.name || ""} onChange={(e) => updateItem("teams", idx, "name", e.target.value)} placeholder="e.g., Premium Glacio Team" className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Version/Meta Note</label>
                              <input type="text" value={team.version || ""} onChange={(e) => updateItem("teams", idx, "version", e.target.value)} placeholder="e.g., CURRENT META" className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono" />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <input
                              type="checkbox"
                              id={`optimal-${idx}`}
                              checked={team.isOptimal || false}
                              onChange={(e) => updateItem("teams", idx, "isOptimal", e.target.checked)}
                              className="w-4 h-4 rounded border-gray-600 bg-[#1e293b] text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                            />
                            <label htmlFor={`optimal-${idx}`} className="text-sm font-semibold text-amber-400 uppercase tracking-wider cursor-pointer select-none">
                              Mark as Optimal (Best)
                            </label>
                          </div>

                          <div className="space-y-4 mb-4">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Characters</label>
                            {(team.characters || team.members || []).map((char: any, mIdx: number) => (
                              <div key={mIdx} className="flex gap-4 items-start bg-[#1e293b] p-4 rounded-md border border-slate-600">
                                <div className="flex-1 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <input type="text" value={char.name || ""} onChange={(e) => {
                                      const currentTeams = [...(contentData.teams || [])];
                                      const currentChars = [...(currentTeams[idx].characters || currentTeams[idx].members || [])];
                                      currentChars[mIdx] = { ...currentChars[mIdx], name: e.target.value };
                                      currentTeams[idx] = { ...currentTeams[idx], characters: currentChars };
                                      // Remove members if it existed to migrate cleanly
                                      delete currentTeams[idx].members;
                                      handleContentChange("teams", currentTeams);
                                    }} placeholder="Character Name" className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono" />
                                    <input type="text" value={char.role || ""} onChange={(e) => {
                                      const currentTeams = [...(contentData.teams || [])];
                                      const currentChars = [...(currentTeams[idx].characters || currentTeams[idx].members || [])];
                                      currentChars[mIdx] = { ...currentChars[mIdx], role: e.target.value };
                                      currentTeams[idx] = { ...currentTeams[idx], characters: currentChars };
                                      delete currentTeams[idx].members;
                                      handleContentChange("teams", currentTeams);
                                    }} placeholder="Role (e.g., Sub DPS)" className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono" />
                                  </div>
                                  <ImageUploadInput value={char.imageUrl || char.image || ""} onChange={(v) => {
                                    const currentTeams = [...(contentData.teams || [])];
                                    const currentChars = [...(currentTeams[idx].characters || currentTeams[idx].members || [])];
                                    currentChars[mIdx] = { ...currentChars[mIdx], imageUrl: v };
                                    currentTeams[idx] = { ...currentTeams[idx], characters: currentChars };
                                    delete currentTeams[idx].members;
                                    handleContentChange("teams", currentTeams);
                                  }} placeholder="Image URL (imageUrl)" className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono" />
                                </div>
                                <button type="button" title="Remove character" onClick={() => {
                                  const currentTeams = [...(contentData.teams || [])];
                                  const currentChars = [...(currentTeams[idx].characters || currentTeams[idx].members || [])];
                                  currentChars.splice(mIdx, 1);
                                  currentTeams[idx] = { ...currentTeams[idx], characters: currentChars };
                                  delete currentTeams[idx].members;
                                  handleContentChange("teams", currentTeams);
                                }} className="p-2 text-slate-500 hover:text-red-400 transition-colors mt-1">
                                  <X size={18} />
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={() => {
                              const currentTeams = [...(contentData.teams || [])];
                              const currentChars = [...(currentTeams[idx].characters || currentTeams[idx].members || [])];
                              currentTeams[idx] = { ...currentTeams[idx], characters: [...currentChars, { name: "", role: "", imageUrl: "" }] };
                              delete currentTeams[idx].members;
                              handleContentChange("teams", currentTeams);
                            }} className="py-2 px-4 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center gap-2 text-sm font-medium">
                              <Plus size={16} /> Add Character
                            </button>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Synergy Analysis</label>
                            <RichTextEditor value={team.description || ""} onChange={(val) => updateItem("teams", idx, "description", val)} placeholder="Explain why these characters work well together..." minHeight="120px" />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addItem("teams", { name: "", version: "", description: "", characters: [] })} className="w-full py-4 border border-dashed border-amber-500/30 rounded-xl text-amber-400 hover:text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs">
                        <Plus size={16} strokeWidth={3} /> Add Team
                      </button>
                    </div>
                  )}

                  {/* Sequence Tab */}
                  {activeTab === "sequence" && (
                    <div className="space-y-6">
                      <p className="text-sm text-slate-400 mb-4">
                        Define Resonance Chain sequences (S1-S6).
                      </p>
                      {/* S1-S6 Inputs */}
                      {(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}`, name: "", description: "", icon: "" }))).map((seq: any, idx: number) => (
                        <div key={idx} className="bg-[#0f172a] border border-slate-700 rounded-lg p-5">
                          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black">
                              {seq.node || `S${idx + 1}`}
                            </span>
                            Sequence {idx + 1}
                          </h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</label>
                                <input type="text" value={seq.name || ""}
                                  onChange={(e) => {
                                    const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}`, name: "", description: "", icon: "" })))];
                                    currentSecs[idx] = { ...currentSecs[idx], name: e.target.value };
                                    handleContentChange("sequences", currentSecs);
                                  }}
                                  placeholder="Sequence Name"
                                  className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Icon URL</label>
                                <ImageUploadInput value={seq.icon || ""}
                                  onChange={(v) => {
                                    const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}`, name: "", description: "", icon: "" })))];
                                    currentSecs[idx] = { ...currentSecs[idx], icon: v };
                                    handleContentChange("sequences", currentSecs);
                                  }}
                                  placeholder="Image URL"
                                  className="w-full bg-[#1e293b] border border-slate-700/50 rounded flex-1 px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image X Offset (%)</label>
                                <input type="number" title="Image X Offset" value={seq.offsetX || 0}
                                  onChange={(e) => {
                                    const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}` })))];
                                    currentSecs[idx] = { ...currentSecs[idx], offsetX: Number(e.target.value) };
                                    handleContentChange("sequences", currentSecs);
                                  }}
                                  className="w-full bg-[#1e293b] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image Y Offset (%)</label>
                                <input type="number" title="Image Y Offset" value={seq.offsetY || 0}
                                  onChange={(e) => {
                                    const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}` })))];
                                    currentSecs[idx] = { ...currentSecs[idx], offsetY: Number(e.target.value) };
                                    handleContentChange("sequences", currentSecs);
                                  }}
                                  className="w-full bg-[#1e293b] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Image Scale</label>
                                <input type="number" step="0.1" title="Image Scale" value={seq.iconScale || 1}
                                  onChange={(e) => {
                                    const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}` })))];
                                    currentSecs[idx] = { ...currentSecs[idx], iconScale: Number(e.target.value) };
                                    handleContentChange("sequences", currentSecs);
                                  }}
                                  className="w-full bg-[#1e293b] border border-slate-700/50 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                              <RichTextEditor value={seq.description || ""}
                                onChange={(val) => {
                                  const currentSecs = [...(contentData.sequences || Array.from({ length: 6 }, (_, i) => ({ node: `S${i + 1}`, name: "", description: "", icon: "" })))];
                                  currentSecs[idx] = { ...currentSecs[idx], description: val };
                                  handleContentChange("sequences", currentSecs);
                                }}
                                placeholder="Describe the effects of unlocking this sequence."
                                minHeight="90px"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  {formData.slug && (
                    <Link
                      href={`/guides/${formData.slug}`}
                      target="_blank"
                      className="bg-[#1e293b] hover:bg-slate-800 text-white px-6 py-3 rounded font-bold transition-all flex items-center gap-2 tracking-widest uppercase border border-slate-700"
                    >
                      <ExternalLink size={18} />
                      PREVIEW
                    </Link>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading" || !isSupabaseConnected}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.3)] tracking-widest uppercase border border-amber-400/50"
                  >
                    <Save size={18} />
                    {status === "loading" ? "SAVING..." : "SAVE GUIDE"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
