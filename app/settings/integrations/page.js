'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchMe } from '@/store/slices/authSlice';
import Header from '@/components/layout/Header';
import * as api from '@/lib/api';

export default function IntegrationsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, initialized } = useSelector((state) => state.auth);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [testing, setTesting] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // Add form
  const [form, setForm] = useState({ name: '', url: '', description: '', api_key: '' });

  useEffect(() => {
    const token = api.getAccessToken();
    if (!token) { router.push('/auth/login'); return; }
    if (!initialized) dispatch(fetchMe());
  }, [initialized, dispatch, router]);

  useEffect(() => {
    if (user) loadServers();
  }, [user]);

  async function loadServers() {
    try {
      const data = await api.listMCPServers();
      setServers(data.servers || []);
    } catch (err) {
      console.error('Failed to load MCP servers:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) return;
    try {
      const data = await api.addMCPServer({
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        api_key: form.api_key.trim(),
        transport: 'http',
      });
      setServers(prev => [...prev, data.server]);
      setForm({ name: '', url: '', description: '', api_key: '' });
      setShowAdd(false);
    } catch (err) {
      console.error('Failed to add server:', err);
    }
  }

  async function handleTest(id) {
    setTesting(id);
    setTestResult(null);
    try {
      const data = await api.testMCPServer(id);
      setTestResult({ id, ...data });
      if (data.connected) {
        // Refresh server list to get updated tools cache
        loadServers();
      }
    } catch (err) {
      setTestResult({ id, connected: false, error: err.message });
    } finally {
      setTesting(null);
    }
  }

  async function handleToggle(server) {
    try {
      await api.updateMCPServer(server.id, { is_enabled: !server.is_enabled });
      setServers(prev => prev.map(s => s.id === server.id ? { ...s, is_enabled: !s.is_enabled } : s));
    } catch (err) {
      console.error('Failed to toggle server:', err);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this MCP server?')) return;
    try {
      await api.deleteMCPServer(id);
      setServers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Failed to delete server:', err);
    }
  }

  if (!initialized || !user) {
    return (
      <div className="flex items-center justify-center app-shell bg-[#030712]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#030712] text-white flex flex-col noise page-scroll">
      <Header />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Integrations</h2>
            <p className="text-gray-500 text-sm mt-1">Connect MCP servers to extend your AI assistant's capabilities</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-medium transition-all btn-shine shadow-lg shadow-cyan-500/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Server</span>
          </button>
        </div>

        {/* Add Server Form */}
        {showAdd && (
          <form onSubmit={handleAdd} className="glass rounded-2xl p-6 mb-6 animate-fade-in-up" style={{ animationDuration: '0.15s' }}>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Add MCP Server</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Server Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="my-crm"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="CRM tools for contacts and campaigns"
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">MCP Server URL *</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm(f => ({ ...f, url: e.target.value }))}
                  placeholder="https://your-mcp-server.com/mcp"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow font-mono text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">API Key (optional)</label>
                <input
                  type="password"
                  value={form.api_key}
                  onChange={(e) => setForm(f => ({ ...f, api_key: e.target.value }))}
                  placeholder="Bearer token or API key"
                  className="w-full px-4 py-2.5 bg-gray-900/80 border border-gray-700/50 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 input-glow"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-5">
              <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium rounded-xl transition-all btn-shine">
                Add Server
              </button>
            </div>
          </form>
        )}

        {/* Server List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : servers.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">No integrations yet</h3>
            <p className="text-gray-500 text-sm mb-6">Connect an MCP server to give your AI assistant new capabilities.</p>
            <button onClick={() => setShowAdd(true)} className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl text-sm font-medium btn-shine">
              Add Your First Server
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.id} className="glass rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Status dot */}
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                        server.is_enabled
                          ? server.last_connected_at ? 'bg-green-400' : 'bg-yellow-400'
                          : 'bg-gray-600'
                      }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-200">{server.name}</h3>
                          {server.is_system && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold uppercase">System</span>
                          )}
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 font-mono">{server.transport}</span>
                        </div>
                        {server.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{server.description}</p>
                        )}
                        {server.url && (
                          <p className="text-[10px] text-gray-600 mt-1 font-mono truncate max-w-xs sm:max-w-md">{server.url}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!server.is_system && (
                        <>
                          {/* Toggle */}
                          <button
                            onClick={() => handleToggle(server)}
                            className={`relative w-9 h-5 rounded-full transition-colors ${
                              server.is_enabled ? 'bg-cyan-500' : 'bg-gray-700'
                            }`}
                          >
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              server.is_enabled ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(server.id)}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{server.tools_count} tools</span>
                      {server.tools_count > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {(server.tools || []).slice(0, 5).map((t, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800/80 text-gray-500 font-mono">
                              {typeof t === 'string' ? t : t.name}
                            </span>
                          ))}
                          {server.tools_count > 5 && (
                            <span className="text-[9px] text-gray-600">+{server.tools_count - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleTest(server.id)}
                      disabled={testing === server.id}
                      className="text-xs text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      {testing === server.id ? (
                        <>
                          <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Test Connection
                        </>
                      )}
                    </button>
                  </div>

                  {/* Test Result */}
                  {testResult && testResult.id === server.id && (
                    <div className={`mt-3 p-3 rounded-xl text-xs ${
                      testResult.connected
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {testResult.connected ? (
                        <span>Connected — {testResult.tools_count} tools discovered</span>
                      ) : (
                        <span>Failed: {testResult.error}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Last connected */}
                {server.last_connected_at && (
                  <div className="px-5 py-2 bg-gray-900/30 border-t border-gray-800/30">
                    <span className="text-[10px] text-gray-600">
                      Last connected: {new Date(server.last_connected_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
