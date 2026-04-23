"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Bell, 
  BellOff, 
  TrendingUp, 
  TrendingDown, 
  Search,
  Activity,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { triggerHaptic } from '@/lib/capacitor';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  id: string;
  symbol: string;
  alerts_enabled: boolean;
  current_price?: number;
  change_percent?: number;
}

export const WatchlistManager = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [alertingItem, setAlertingItem] = useState<WatchlistItem | null>(null);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  
  const supabase = createClient();

  const fetchActiveAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('price_alerts').select('*').eq('user_id', user.id).eq('is_active', true);
    setActiveAlerts(data || []);
  };

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch current prices for these symbols
      if (data && data.length > 0) {
        const symbols = (data as any[]).map(item => item.symbol);
        const priceRes = await fetch(`/api/market/prices?symbols=${symbols.join(',')}`);
        const prices = await priceRes.json();
        
        const combined = (data as any[]).map(item => {
          const priceData = prices.find((p: any) => p.symbol === item.symbol);
          return {
            ...item,
            current_price: priceData?.price,
            change_percent: priceData?.changePercent
          };
        });
        setWatchlist(combined);
      } else {
        setWatchlist([]);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
    fetchActiveAlerts();
  }, []);

  const savePriceAlert = async () => {
    if (!alertingItem || !alertPrice) return;
    triggerHaptic();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          symbol: alertingItem.symbol,
          trigger_price: parseFloat(alertPrice),
          trigger_condition: alertCondition
        });

      if (error) throw error;
      setAlertingItem(null);
      setAlertPrice('');
      fetchActiveAlerts();
    } catch (err) {
      console.error('Error saving alert:', err);
    }
  };

  const addToWatchlist = async () => {
    if (!newSymbol) return;
    setAdding(true);
    triggerHaptic();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_watchlists')
        .insert({
          user_id: user.id,
          symbol: newSymbol.toUpperCase(),
          alerts_enabled: true
        });

      if (error) throw error;
      
      setNewSymbol('');
      fetchWatchlist();
    } catch (err) {
      console.error('Error adding to watchlist:', err);
    } finally {
      setAdding(false);
    }
  };

  const removeFromWatchlist = async (id: string) => {
    triggerHaptic();
    try {
      const { error } = await supabase
        .from('user_watchlists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWatchlist(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  const toggleAlerts = async (item: WatchlistItem) => {
    triggerHaptic();
    try {
      const { error } = await supabase
        .from('user_watchlists')
        .update({ alerts_enabled: !item.alerts_enabled })
        .eq('id', item.id);

      if (error) throw error;
      setWatchlist(prev => prev.map(i => 
        i.id === item.id ? { ...i, alerts_enabled: !i.alerts_enabled } : i
      ));
    } catch (err) {
      console.error('Error toggling alerts:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Symbol Input */}
      <div className="flex gap-2">
        <div className="flex-grow flex items-center gap-3 px-4 py-3 bg-background-surface border border-border-slate focus-within:border-accent transition-colors">
          <Search className="w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="ADD SYMBOL (E.G. BTC/USD)..."
            className="bg-transparent border-none outline-none font-mono text-[10px] uppercase tracking-widest text-text-primary w-full"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
          />
        </div>
        <button 
          onClick={addToWatchlist}
          disabled={adding || !newSymbol}
          className="p-3 bg-accent text-background-primary disabled:opacity-50 hover:bg-accent-hover transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="p-20 text-center animate-pulse border border-dashed border-border-slate">
            <Activity className="w-6 h-6 text-text-tertiary mx-auto mb-4 animate-spin" />
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">Syncing with live markets...</p>
          </div>
        ) : watchlist.length > 0 ? (
          watchlist.map((item) => (
            <div key={item.id} className="group bg-background-surface border border-border-slate p-6 hover:border-accent/40 transition-premium">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold uppercase">{item.symbol}</h3>
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
                    <span className="text-text-primary">${item.current_price?.toLocaleString() || '---'}</span>
                    <span className={cn(
                      "font-bold",
                      (item.change_percent || 0) >= 0 ? "text-profit" : "text-loss"
                    )}>
                      {(item.change_percent || 0) >= 0 ? '+' : ''}{item.change_percent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    {activeAlerts.filter(a => a.symbol === item.symbol).map(alert => (
                      <div key={alert.id} className="flex items-center gap-1 text-[8px] font-mono font-bold uppercase text-accent bg-accent/10 px-1.5 py-0.5 rounded">
                        {alert.trigger_condition === 'above' ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                        ${alert.trigger_price}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setAlertingItem(item);
                      setAlertPrice(item.current_price?.toString() || '');
                    }}
                    className="p-2.5 bg-background-elevated border border-border-slate text-text-tertiary hover:text-accent hover:border-accent transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeFromWatchlist(item.id)}
                    className="p-2.5 bg-background-elevated border border-border-slate text-text-tertiary hover:text-loss hover:border-loss transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center border border-dashed border-border-slate">
            <AlertCircle className="w-6 h-6 text-text-tertiary mx-auto mb-4" />
            <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">Your watchlist is empty.</p>
          </div>
        )}
      </div>

      {/* Alert Modal Overlay */}
      {alertingItem && (
        <div className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-background-surface border border-border-slate w-full max-w-sm p-8 space-y-8 shadow-2xl relative">
            <button 
              onClick={() => setAlertingItem(null)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold uppercase tracking-tight">Set Price Alert</h3>
              <p className="text-text-tertiary font-mono text-[10px] uppercase tracking-widest">
                Symbol: {alertingItem.symbol} // Current: ${alertingItem.current_price}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex border border-border-slate overflow-hidden">
                <button 
                  onClick={() => setAlertCondition('above')}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                    alertCondition === 'above' ? "bg-accent text-background-primary" : "bg-background-elevated text-text-tertiary"
                  )}
                >
                  <ArrowUp className="w-3 h-3" />
                  Above
                </button>
                <button 
                  onClick={() => setAlertCondition('below')}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2",
                    alertCondition === 'below' ? "bg-accent text-background-primary" : "bg-background-elevated text-text-tertiary"
                  )}
                >
                  <ArrowDown className="w-3 h-3" />
                  Below
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Trigger Price ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  className="w-full bg-background-elevated border border-border-slate p-4 text-xl font-display font-bold focus:border-accent outline-none"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                />
              </div>

              <button 
                onClick={savePriceAlert}
                className="w-full py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors shadow-lg"
              >
                Create Push Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
