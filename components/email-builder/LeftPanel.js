'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faHeading,
  faSquare,
  faImage,
  faMinus,
  faArrowsUpDown,
  faBullhorn,
  faPhotoFilm,
  faStar,
  faShoppingBag,
  faTableCells,
  faAward,
  faHandPointer,
  faObjectGroup,
  faQuoteLeft,
  faChartSimple,
  faListCheck,
  faShareNodes,
  faTicket,
  faClock,
  faNewspaper,
  faAlignCenter,
} from '@fortawesome/free-solid-svg-icons';
import { BASIC_COMPONENTS, COLUMN_COMPONENTS, CONTAINER_COMPONENTS } from './componentLibrary';
import { loadTemplate } from '@/store/slices/emailBuilderSlice';
import { useSelector } from 'react-redux';

const iconMap = {
  faAlignLeft,
  faHeading,
  faSquare,
  faImage,
  faMinus,
  faArrowsUpDown,
};

// ─── Draggable Component Card ───
function DraggableComponent({ component }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: component.id,
    data: { component, isNew: true },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  const isColumnLayout = component.type === 'row' && component.children;

  if (isColumnLayout) {
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}
        className="component-card bg-white border border-gray-200 rounded-lg p-2 cursor-move hover:border-blue-400 hover:shadow-lg transition-all col-span-3">
        <div className="flex gap-0.5 h-6">
          {component.children.map((col, index) => (
            <div key={index} className="bg-blue-100 border border-blue-300 rounded flex items-center justify-center"
              style={{ flex: `0 0 ${col.defaultProps.width}`, minWidth: 0 }}>
              <span className="text-xs text-blue-600 font-medium">{col.defaultProps.width}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className="component-card bg-white border border-gray-200 rounded-lg p-2 cursor-move hover:border-blue-400 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1.5 aspect-square">
      <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg">
        {iconMap[component.icon] ? (
          <FontAwesomeIcon icon={iconMap[component.icon]} className="text-lg text-blue-600" />
        ) : (
          <span className="text-lg">{component.icon}</span>
        )}
      </div>
      <p className="text-xs font-medium text-gray-700 text-center leading-tight">{component.name}</p>
    </div>
  );
}

// ─── Collapsible Section ───
function ComponentSection({ title, components, bgColor, isOpen, onToggle }) {
  return (
    <div className="mb-4">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <svg className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 p-2 grid grid-cols-3 gap-x-1.5 gap-y-1" style={{ backgroundColor: bgColor }}>
          {components.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category config for presets ───
const CATEGORY_CONFIG = {
  hero: { icon: faBullhorn, label: 'Hero', color: 'text-blue-500', bg: 'bg-blue-50' },
  product: { icon: faShoppingBag, label: 'Product', color: 'text-amber-500', bg: 'bg-amber-50' },
  cta: { icon: faHandPointer, label: 'CTA', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  content: { icon: faNewspaper, label: 'Content', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  footer: { icon: faAlignCenter, label: 'Footer', color: 'text-slate-500', bg: 'bg-slate-100' },
};

const CATEGORIES = ['all', 'hero', 'product', 'cta', 'content', 'footer'];

// ─── Skeleton block previews — mini wireframes showing layout structure ───
function SkeletonPreview({ presetId, category }) {
  const bg = {
    hero: 'bg-blue-50',
    product: 'bg-amber-50',
    cta: 'bg-indigo-50',
    content: 'bg-emerald-50',
    footer: 'bg-slate-50',
  }[category] || 'bg-gray-50';

  const accent = {
    hero: 'bg-blue-300',
    product: 'bg-amber-300',
    cta: 'bg-indigo-300',
    content: 'bg-emerald-300',
    footer: 'bg-slate-300',
  }[category] || 'bg-gray-300';

  const accentDark = {
    hero: 'bg-blue-400',
    product: 'bg-amber-400',
    cta: 'bg-indigo-400',
    content: 'bg-emerald-400',
    footer: 'bg-slate-400',
  }[category] || 'bg-gray-400';

  const skeletons = {
    'hero-bold': (
      <div className={`${bg} p-3 space-y-1.5`}>
        <div className={`h-3.5 ${accentDark} rounded-sm w-3/4 mx-auto`} />
        <div className={`h-1.5 ${accent} rounded-sm w-1/2 mx-auto opacity-60`} />
        <div className="h-1 rounded-sm w-full opacity-0" />
        <div className="h-5 bg-white rounded-md w-2/5 mx-auto shadow-sm" />
      </div>
    ),
    'hero-image': (
      <div className={`${bg} p-2 space-y-1.5`}>
        <div className="h-7 bg-gray-200 rounded-md flex items-center justify-center">
          <FontAwesomeIcon icon={faImage} className="text-gray-300 text-xs" />
        </div>
        <div className={`h-3 ${accentDark} rounded-sm w-3/4 mx-auto`} />
        <div className={`h-1.5 ${accent} rounded-sm w-1/2 mx-auto opacity-60`} />
        <div className={`h-4 ${accentDark} rounded-md w-1/3 mx-auto`} />
      </div>
    ),
    'hero-minimal': (
      <div className={`${bg} p-4 space-y-2`}>
        <div className={`h-2.5 ${accentDark} rounded-sm w-1/2 mx-auto`} />
        <div className={`h-1.5 ${accent} rounded-sm w-3/4 mx-auto opacity-50`} />
        <div className={`h-1.5 ${accent} rounded-sm w-2/3 mx-auto opacity-30`} />
      </div>
    ),
    'product-2col': (
      <div className={`${bg} p-2 flex gap-2`}>
        {[0, 1].map(i => (
          <div key={i} className="flex-1 bg-white rounded-md p-1.5 shadow-sm space-y-1">
            <div className="h-5 bg-gray-100 rounded-sm" />
            <div className={`h-1.5 ${accentDark} rounded-sm w-3/4`} />
            <div className={`h-1.5 ${accent} rounded-sm w-1/2 opacity-60`} />
            <div className={`h-3 ${accentDark} rounded-sm w-4/5 mx-auto`} />
          </div>
        ))}
      </div>
    ),
    'product-3col': (
      <div className={`${bg} p-2 flex gap-1.5`}>
        {[0, 1, 2].map(i => (
          <div key={i} className="flex-1 bg-white rounded-md p-1 shadow-sm space-y-0.5">
            <div className="h-4 bg-gray-100 rounded-sm" />
            <div className={`h-1 ${accentDark} rounded-sm w-3/4`} />
            <div className={`h-1 ${accent} rounded-sm w-1/2 opacity-60`} />
          </div>
        ))}
      </div>
    ),
    'product-featured': (
      <div className={`${bg} p-2 flex gap-2`}>
        <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center">
          <FontAwesomeIcon icon={faImage} className="text-gray-300 text-sm" />
        </div>
        <div className="flex-1 space-y-1.5 py-1">
          <div className={`h-2 ${accentDark} rounded-sm w-3/4`} />
          <div className={`h-1 ${accent} rounded-sm w-full opacity-50`} />
          <div className={`h-1 ${accent} rounded-sm w-5/6 opacity-50`} />
          <div className={`h-2 ${accentDark} rounded-sm w-1/3`} />
          <div className={`h-3.5 ${accentDark} rounded-sm w-2/3`} />
        </div>
      </div>
    ),
    'cta-single': (
      <div className={`${bg} p-3 space-y-1.5`}>
        <div className={`h-2.5 ${accentDark} rounded-sm w-2/3 mx-auto`} />
        <div className={`h-1.5 ${accent} rounded-sm w-4/5 mx-auto opacity-50`} />
        <div className="h-1 opacity-0" />
        <div className={`h-5 ${accentDark} rounded-md w-2/5 mx-auto`} />
      </div>
    ),
    'cta-dual': (
      <div className={`${bg} p-3 space-y-1.5`}>
        <div className={`h-2.5 ${accentDark} rounded-sm w-2/3 mx-auto`} />
        <div className={`h-1.5 ${accent} rounded-sm w-1/2 mx-auto opacity-50`} />
        <div className="h-1 opacity-0" />
        <div className="flex gap-2 justify-center">
          <div className={`h-4 ${accentDark} rounded-md w-1/4`} />
          <div className="h-4 bg-white border border-gray-300 rounded-md w-1/4" />
        </div>
      </div>
    ),
    'content-text-image': (
      <div className={`${bg} p-2 flex gap-2`}>
        <div className="flex-1 space-y-1.5 py-1">
          <div className={`h-2 ${accentDark} rounded-sm w-4/5`} />
          <div className={`h-1 ${accent} rounded-sm w-full opacity-50`} />
          <div className={`h-1 ${accent} rounded-sm w-5/6 opacity-50`} />
          <div className={`h-1 ${accent} rounded-sm w-3/4 opacity-30`} />
        </div>
        <div className="flex-1 bg-gray-100 rounded-md flex items-center justify-center">
          <FontAwesomeIcon icon={faImage} className="text-gray-300 text-sm" />
        </div>
      </div>
    ),
    'content-testimonial': (
      <div className={`${bg} p-3 space-y-2`}>
        <div className={`border-l-3 border-l-2 ${accent.replace('bg-', 'border-')} pl-2.5 space-y-1`}>
          <div className="h-1.5 bg-gray-300 rounded-sm w-full opacity-60" />
          <div className="h-1.5 bg-gray-300 rounded-sm w-5/6 opacity-60" />
          <div className="h-1.5 bg-gray-300 rounded-sm w-2/3 opacity-40" />
        </div>
        <div className="flex items-center gap-2 pl-1">
          <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
          <div className="space-y-0.5">
            <div className={`h-1.5 ${accentDark} rounded-sm w-12`} />
            <div className="h-1 bg-gray-200 rounded-sm w-16" />
          </div>
        </div>
      </div>
    ),
    'content-stats': (
      <div className={`${bg} p-2.5 flex gap-2`}>
        {['99%', '10K+', '24/7'].map((val, i) => (
          <div key={i} className="flex-1 text-center space-y-0.5">
            <div className={`text-[10px] font-bold ${accentDark.replace('bg-', 'text-')}`}>{val}</div>
            <div className="h-1 bg-gray-300 rounded-sm w-4/5 mx-auto opacity-50" />
          </div>
        ))}
      </div>
    ),
    'content-checklist': (
      <div className={`${bg} p-2.5 space-y-1.5`}>
        <div className={`h-2 ${accentDark} rounded-sm w-1/2`} />
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-400 rounded-sm shrink-0 flex items-center justify-center">
              <span className="text-white text-[6px] font-bold">✓</span>
            </div>
            <div className="h-1 bg-gray-300 rounded-sm flex-1 opacity-50" style={{ width: `${70 + i * 5}%` }} />
          </div>
        ))}
      </div>
    ),
    'footer-simple': (
      <div className={`${bg} p-2.5 space-y-1.5`}>
        <div className="h-px bg-gray-300 opacity-60" />
        <div className={`h-1.5 ${accentDark} rounded-sm w-1/3 mx-auto`} />
        <div className="h-1 bg-gray-300 rounded-sm w-2/3 mx-auto opacity-40" />
        <div className="h-1 bg-blue-300 rounded-sm w-1/4 mx-auto opacity-60" />
      </div>
    ),
    'footer-social': (
      <div className={`${bg} p-2.5 space-y-1.5`}>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-px bg-gray-300 opacity-60" />
        <div className={`h-1.5 ${accentDark} rounded-sm w-1/3 mx-auto`} />
        <div className="h-1 bg-gray-300 rounded-sm w-1/2 mx-auto opacity-40" />
      </div>
    ),
    'coupon-banner': (
      <div className={`${bg} p-2.5 space-y-1.5`}>
        <div className={`h-2 ${accentDark} rounded-sm w-1/2 mx-auto`} />
        <div className="h-5 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center mx-2">
          <span className="text-[8px] font-mono font-bold text-gray-500 tracking-widest">CODE</span>
        </div>
        <div className="h-1 bg-gray-300 rounded-sm w-2/5 mx-auto opacity-50" />
        <div className={`h-4 ${accentDark} rounded-md w-1/3 mx-auto`} />
      </div>
    ),
    'countdown-urgency': (
      <div className="bg-red-50 p-3 space-y-1.5">
        <div className="h-3 bg-red-400 rounded-sm w-2/3 mx-auto" />
        <div className="h-1.5 bg-red-200 rounded-sm w-4/5 mx-auto opacity-60" />
        <div className="h-1 opacity-0" />
        <div className="h-5 bg-red-500 rounded-md w-2/5 mx-auto" />
      </div>
    ),
  };

  return skeletons[presetId] || (
    <div className={`${bg} p-3 space-y-1.5`}>
      <div className="h-2.5 bg-gray-300 rounded-sm w-3/4 mx-auto" />
      <div className="h-1.5 bg-gray-200 rounded-sm w-1/2 mx-auto" />
    </div>
  );
}

// ─── Preset Card ───
function PresetCard({ preset, onInsert }) {
  return (
    <div
      onClick={() => onInsert(preset)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
    >
      {/* Skeleton preview */}
      <div className="border-b border-gray-100">
        <SkeletonPreview presetId={preset.preset_id} category={preset.category} />
      </div>

      {/* Info */}
      <div className="p-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-800 truncate">{preset.name}</h4>
          <span className="text-[10px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity font-medium shrink-0 ml-1">
            + Insert
          </span>
        </div>
        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 leading-relaxed">{preset.description}</p>
      </div>
    </div>
  );
}

// ─── Blocks Tab (Presets Browser) ───
function BlocksPanel() {
  const dispatch = useDispatch();
  const components = useSelector((state) => state.emailBuilder.components);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [inserting, setInserting] = useState(null);

  useEffect(() => {
    loadPresets();
  }, []);

  async function loadPresets() {
    try {
      const { listPresets } = await import('@/lib/api');
      const data = await listPresets();
      setPresets(data.presets || data || []);
    } catch (err) {
      console.error('Failed to load presets:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleInsert(preset) {
    setInserting(preset.preset_id);
    try {
      const { getPreset } = await import('@/lib/api');
      const data = await getPreset(preset.preset_id);
      const presetData = data.preset || data;

      // Inject preset into current components using the builder
      const { inject_preset } = await import('@/lib/presetHelper');
      const updatedComponents = inject_preset(components, presetData);

      dispatch(loadTemplate({
        components: updatedComponents,
      }));
    } catch (err) {
      console.error('Failed to inject preset:', err);
    } finally {
      setInserting(null);
    }
  }

  const filtered = category === 'all' ? presets : presets.filter(p => p.category === category);

  return (
    <div className="p-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-4">
        {CATEGORIES.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
              }`}
            >
              {config && <FontAwesomeIcon icon={config.icon} className="text-[10px]" />}
              {cat === 'all' ? 'All' : config?.label || cat}
            </button>
          );
        })}
      </div>

      {/* Preset cards */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-8">No presets in this category</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((preset) => (
            <PresetCard
              key={preset.preset_id}
              preset={preset}
              onInsert={handleInsert}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main LeftPanel with Tabs ───
export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState('components');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState({
    basic: true,
    columns: true,
    containers: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filterComponents = (components) => {
    if (!searchQuery) return components;
    return components.filter((comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 shrink-0">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
            activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
            activeTab === 'blocks'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Blocks
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'components' ? (
          <div className="p-4">
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <ComponentSection
              title="Basic Components"
              components={filterComponents(BASIC_COMPONENTS)}
              bgColor="#F0F7FF"
              isOpen={openSections.basic}
              onToggle={() => toggleSection('basic')}
            />
            <ComponentSection
              title="Column Layouts"
              components={filterComponents(COLUMN_COMPONENTS)}
              bgColor="#F0FDF4"
              isOpen={openSections.columns}
              onToggle={() => toggleSection('columns')}
            />
            <ComponentSection
              title="Containers"
              components={filterComponents(CONTAINER_COMPONENTS)}
              bgColor="#FAF5FF"
              isOpen={openSections.containers}
              onToggle={() => toggleSection('containers')}
            />
          </div>
        ) : (
          <BlocksPanel />
        )}
      </div>
    </div>
  );
}
