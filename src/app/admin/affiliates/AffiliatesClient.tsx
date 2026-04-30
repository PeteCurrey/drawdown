'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Link2, Plus, ExternalLink, ToggleLeft, ToggleRight,
  Edit2, CheckCircle2, AlertTriangle, Copy, RefreshCw,
  TrendingUp, Search, X, Save, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffiliateLink {
  id: string;
  slug: string;
  display_name: string;
  type: 'broker' | 'prop_firm' | 'tool' | 'other';
  destination_url: string;
  commission_type: string | null;
  commission_detail: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  click_count?: number;
}

const TYPE_BADGES: Record<string, string> = {
  broker: 'bg-accent/15 text-accent border-accent/30',
  prop_firm: 'bg-profit/15 text-profit border-profit/30',
  tool: 'bg-[#a78bfa]/15 text-[#a78bfa] border-[#a78bfa]/30',
  other: 'bg-text-tertiary/15 text-text-tertiary border-text-tertiary/30',
};

interface FormState {
  slug: string;
  display_name: string;
  type: 'broker' | 'prop_firm' | 'tool' | 'other';
  destination_url: string;
  commission_type: string;
  commission_detail: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  slug: '', display_name: '', type: 'broker',
  destination_url: '', commission_type: '', commission_detail: '', notes: '',
};

export default function AffiliatesAdminClient({
  initialLinks,
}: {
  initialLinks: AffiliateLink[];
}) {
  const [links, setLinks] = useState<AffiliateLink[]>(initialLinks);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<AffiliateLink | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, startSave] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const filtered = links.filter(l =>
    l.display_name.toLowerCase().includes(search.toLowerCase()) ||
    l.slug.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }
  function openEdit(link: AffiliateLink) {
    setEditTarget(link);
    setForm({
      slug: link.slug,
      display_name: link.display_name,
      type: link.type,
      destination_url: link.destination_url,
      commission_type: link.commission_type ?? '',
      commission_detail: link.commission_detail ?? '',
      notes: link.notes ?? '',
    });
    setShowModal(true);
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleSave() {
    startSave(async () => {
      const res = await fetch('/api/admin/affiliates', {
        method: editTarget ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTarget ? { id: editTarget.id, ...form } : form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFlash({ type: 'err', msg: data.error ?? 'Failed to save' });
        return;
      }
      setLinks(prev =>
        editTarget
          ? prev.map(l => (l.id === editTarget.id ? { ...l, ...form } : l))
          : [{ ...data.link, click_count: 0 }, ...prev]
      );
      setShowModal(false);
      setFlash({ type: 'ok', msg: editTarget ? 'Link updated.' : 'Link created.' });
      setTimeout(() => setFlash(null), 3000);
    });
  }

  async function toggleActive(link: AffiliateLink) {
    await fetch('/api/admin/affiliates', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: link.id, is_active: !link.is_active }),
    });
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l));
  }

  function copySlug(slug: string) {
    navigator.clipboard.writeText(`https://drawdown.trading/go/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  const totalClicks = links.reduce((acc, l) => acc + (l.click_count ?? 0), 0);
  const activeCount = links.filter(l => l.is_active).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Flash */}
      {flash && (
        <div className={cn(
          "flex items-center gap-3 px-6 py-4 border text-sm font-mono",
          flash.type === 'ok'
            ? "bg-profit/10 border-profit/30 text-profit"
            : "bg-loss/10 border-loss/30 text-loss"
        )}>
          {flash.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {flash.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold uppercase mb-1">Affiliate Links</h1>
          <p className="text-xs text-text-tertiary font-mono">
            All /go/[slug] redirects • {activeCount} active • {totalClicks.toLocaleString()} clicks (30d)
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Link
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Links', value: links.length, icon: Link2 },
          { label: 'Active', value: activeCount, icon: CheckCircle2 },
          { label: 'Clicks (30d)', value: totalClicks.toLocaleString(), icon: TrendingUp },
          { label: 'Inactive', value: links.length - activeCount, icon: AlertTriangle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-5 bg-background-surface border border-border-slate flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary">{label}</span>
              <Icon className="w-4 h-4 text-text-tertiary/40" />
            </div>
            <span className="text-2xl font-display font-black">{value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="SEARCH LINKS..."
          className="w-full bg-background-surface border border-border-slate pl-10 pr-4 py-2.5 text-[10px] uppercase font-mono outline-none focus:border-accent"
        />
      </div>

      {/* Table */}
      <div className="bg-background-surface border border-border-slate overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead className="bg-background-primary text-[9px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">
            <tr>
              <th className="px-6 py-4">Partner</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Go URL</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4">Commission</th>
              <th className="px-6 py-4 text-right">Clicks (30d)</th>
              <th className="px-6 py-4 text-right">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-slate/50">
            {filtered.map(link => (
              <tr key={link.id} className="hover:bg-background-elevated/30 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-display font-bold text-sm">{link.display_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border",
                    TYPE_BADGES[link.type]
                  )}>
                    {link.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-tertiary">
                      /go/<span className="text-accent">{link.slug}</span>
                    </span>
                    <button
                      onClick={() => copySlug(link.slug)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy full URL"
                    >
                      {copied === link.slug
                        ? <CheckCircle2 className="w-3 h-3 text-profit" />
                        : <Copy className="w-3 h-3 text-text-tertiary hover:text-accent transition-colors" />
                      }
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-[220px]">
                  <a
                    href={link.destination_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-text-tertiary hover:text-accent transition-colors flex items-center gap-1 truncate"
                    title={link.destination_url}
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{link.destination_url.replace(/^https?:\/\//, '')}</span>
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-mono text-text-secondary">{link.commission_detail ?? '—'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-display font-bold">
                    {(link.click_count ?? 0).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleActive(link)}
                    title={link.is_active ? 'Deactivate' : 'Activate'}
                    className="inline-flex items-center gap-1.5"
                  >
                    {link.is_active
                      ? <ToggleRight className="w-5 h-5 text-profit" />
                      : <ToggleLeft className="w-5 h-5 text-text-tertiary" />
                    }
                    <span className={cn(
                      "text-[9px] font-mono font-bold uppercase",
                      link.is_active ? "text-profit" : "text-text-tertiary"
                    )}>
                      {link.is_active ? 'Active' : 'Off'}
                    </span>
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => openEdit(link)}
                      className="text-[10px] font-mono text-text-tertiary hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <a
                      href={`/go/${link.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-text-tertiary hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Test
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-text-tertiary text-sm font-mono">
                  No links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-background-elevated border border-border-slate w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-border-slate">
              <h2 className="text-lg font-display font-bold uppercase">
                {editTarget ? 'Edit Link' : 'New Affiliate Link'}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-text-tertiary hover:text-text-primary transition-colors" />
              </button>
            </div>
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Display Name *</label>
                  <input
                    value={form.display_name}
                    onChange={e => setForm(f => ({
                      ...f,
                      display_name: e.target.value,
                      slug: editTarget ? f.slug : autoSlug(e.target.value),
                    }))}
                    className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Slug *</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                    placeholder="auto-generated"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Destination URL *</label>
                <input
                  value={form.destination_url}
                  onChange={e => setForm(f => ({ ...f, destination_url: e.target.value }))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                  placeholder="https://"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                    className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                  >
                    <option value="broker">Broker</option>
                    <option value="prop_firm">Prop Firm</option>
                    <option value="tool">Tool</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Commission Type</label>
                  <input
                    value={form.commission_type}
                    onChange={e => setForm(f => ({ ...f, commission_type: e.target.value }))}
                    className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                    placeholder="CPA / IB / Recurring"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Commission Detail</label>
                <input
                  value={form.commission_detail}
                  onChange={e => setForm(f => ({ ...f, commission_detail: e.target.value }))}
                  className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
                  placeholder="e.g. 15% per challenge"
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-tertiary mb-2">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full bg-background-primary border border-border-slate px-4 py-2.5 text-sm font-mono outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-border-slate">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 text-[10px] font-mono uppercase tracking-widest border border-border-slate text-text-tertiary hover:border-text-primary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.slug || !form.display_name || !form.destination_url}
                className="flex items-center gap-2 px-8 py-2.5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                {editTarget ? 'Update Link' : 'Save Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
