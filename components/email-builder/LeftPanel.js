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
  faArrowsUpDown
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

// ─── Category icons for presets ───
const CATEGORY_ICONS = {
  hero: '🎯',
  product: '🛍️',
  cta: '🔘',
  content: '📝',
  footer: '📋',
};

const CATEGORIES = ['all', 'hero', 'product', 'cta', 'content', 'footer'];

// ─── Preset wireframe previews ───
const PRESET_PREVIEWS = {
  'hero-bold': (
    <div className="space-y-1.5 p-2">
      <div className="h-3 bg-blue-300 rounded w-3/4 mx-auto" />
      <div className="h-1.5 bg-blue-200 rounded w-1/2 mx-auto" />
      <div className="h-5 bg-white rounded w-1/3 mx-auto mt-1" />
    </div>
  ),
  'hero-image': (
    <div className="space-y-1.5 p-2">
      <div className="h-6 bg-gray-300 rounded" />
      <div className="h-3 bg-blue-300 rounded w-3/4 mx-auto" />
      <div className="h-5 bg-blue-400 rounded w-1/3 mx-auto" />
    </div>
  ),
  'hero-minimal': (
    <div className="space-y-1.5 p-3">
      <div className="h-2.5 bg-gray-400 rounded w-2/3 mx-auto" />
      <div className="h-1.5 bg-gray-200 rounded w-4/5 mx-auto" />
    </div>
  ),
  'product-2col': (
    <div className="flex gap-1.5 p-2">
      {[1, 2].map(i => (
        <div key={i} className="flex-1 space-y-1">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-1.5 bg-gray-300 rounded w-3/4" />
          <div className="h-1.5 bg-pink-300 rounded w-1/2" />
          <div className="h-3 bg-pink-400 rounded w-2/3 mx-auto" />
        </div>
      ))}
    </div>
  ),
  'product-3col': (
    <div className="flex gap-1 p-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 space-y-1">
          <div className="h-5 bg-gray-200 rounded" />
          <div className="h-1 bg-gray-300 rounded w-3/4" />
          <div className="h-1 bg-pink-300 rounded w-1/2" />
        </div>
      ))}
    </div>
  ),
  'product-featured': (
    <div className="flex gap-1.5 p-2">
      <div className="flex-1 h-12 bg-gray-200 rounded" />
      <div className="flex-1 space-y-1">
        <div className="h-2 bg-gray-400 rounded w-3/4" />
        <div className="h-1 bg-gray-200 rounded" />
        <div className="h-2 bg-blue-300 rounded w-1/2" />
        <div className="h-3 bg-blue-400 rounded w-2/3" />
      </div>
    </div>
  ),
  'cta-single': (
    <div className="space-y-1.5 p-3">
      <div className="h-2.5 bg-gray-400 rounded w-2/3 mx-auto" />
      <div className="h-1.5 bg-gray-200 rounded w-4/5 mx-auto" />
      <div className="h-5 bg-blue-500 rounded w-1/3 mx-auto mt-1" />
    </div>
  ),
  'cta-dual': (
    <div className="space-y-1.5 p-2">
      <div className="h-2 bg-gray-400 rounded w-2/3 mx-auto" />
      <div className="h-1.5 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="flex gap-1.5 mt-1 justify-center">
        <div className="h-4 bg-blue-500 rounded w-1/4" />
        <div className="h-4 bg-gray-300 rounded w-1/4" />
      </div>
    </div>
  ),
  'content-text-image': (
    <div className="flex gap-1.5 p-2">
      <div className="flex-1 space-y-1">
        <div className="h-2 bg-gray-400 rounded w-3/4" />
        <div className="h-1 bg-gray-200 rounded" />
        <div className="h-1 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="flex-1 h-10 bg-gray-200 rounded" />
    </div>
  ),
  'content-testimonial': (
    <div className="space-y-1.5 p-2">
      <div className="border-l-2 border-blue-400 pl-2 space-y-1">
        <div className="h-1 bg-gray-300 rounded" />
        <div className="h-1 bg-gray-300 rounded w-5/6" />
      </div>
      <div className="h-1 bg-gray-200 rounded w-1/3 ml-3" />
      <div className="h-1 bg-gray-100 rounded w-1/4 ml-3" />
    </div>
  ),
  'content-stats': (
    <div className="flex gap-1.5 p-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex-1 text-center space-y-0.5">
          <div className="h-3 bg-blue-300 rounded w-2/3 mx-auto" />
          <div className="h-1 bg-gray-200 rounded w-4/5 mx-auto" />
        </div>
      ))}
    </div>
  ),
  'content-checklist': (
    <div className="space-y-1 p-2">
      <div className="h-2 bg-gray-400 rounded w-1/2" />
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-sm shrink-0" />
          <div className="h-1 bg-gray-200 rounded flex-1" />
        </div>
      ))}
    </div>
  ),
  'footer-simple': (
    <div className="space-y-1 p-2">
      <div className="h-px bg-gray-300" />
      <div className="h-1 bg-gray-300 rounded w-1/3 mx-auto" />
      <div className="h-1 bg-gray-200 rounded w-2/3 mx-auto" />
      <div className="h-1 bg-blue-200 rounded w-1/4 mx-auto" />
    </div>
  ),
  'footer-social': (
    <div className="space-y-1 p-2">
      <div className="flex gap-1 justify-center">
        {[1, 2, 3].map(i => <div key={i} className="w-3 h-1 bg-blue-300 rounded" />)}
      </div>
      <div className="h-px bg-gray-300" />
      <div className="h-1 bg-gray-300 rounded w-1/3 mx-auto" />
      <div className="h-1 bg-gray-200 rounded w-1/2 mx-auto" />
    </div>
  ),
  'coupon-banner': (
    <div className="space-y-1.5 p-2">
      <div className="h-2 bg-pink-300 rounded w-1/2 mx-auto" />
      <div className="h-4 border border-dashed border-pink-400 rounded flex items-center justify-center">
        <div className="h-1.5 bg-pink-200 rounded w-1/2" />
      </div>
      <div className="h-3 bg-pink-500 rounded w-1/3 mx-auto" />
    </div>
  ),
  'countdown-urgency': (
    <div className="space-y-1.5 p-2">
      <div className="h-2.5 bg-red-400 rounded w-2/3 mx-auto" />
      <div className="h-1.5 bg-red-200 rounded w-4/5 mx-auto" />
      <div className="h-5 bg-red-500 rounded w-1/3 mx-auto mt-1" />
    </div>
  ),
};

// ─── Preset Card ───
function PresetCard({ preset, onInsert }) {
  const preview = PRESET_PREVIEWS[preset.preset_id];
  const bgColors = {
    hero: 'bg-blue-50',
    product: 'bg-amber-50',
    cta: 'bg-indigo-50',
    content: 'bg-emerald-50',
    footer: 'bg-slate-100',
  };

  return (
    <div
      onClick={() => onInsert(preset)}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
    >
      {/* Preview wireframe */}
      <div className={`${bgColors[preset.category] || 'bg-gray-50'} border-b border-gray-100`}>
        {preview || (
          <div className="p-3 space-y-1.5">
            <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto" />
            <div className="h-1.5 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        )}
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
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              category === cat
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200'
            }`}
          >
            {cat === 'all' ? 'All' : `${CATEGORY_ICONS[cat] || ''} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`}
          </button>
        ))}
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
