import { IndividualTrade } from "@/types/dashboard";

export interface ParseResult {
  trades: Partial<IndividualTrade>[];
  platform: 'mt4' | 'mt5' | 'ctrader' | 'unknown';
  errors: string[];
}

export async function parseTradeCSV(csvContent: string): Promise<ParseResult> {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) {
    return { trades: [], platform: 'unknown', errors: ['CSV is empty or missing data.'] };
  }

  const headerLine = lines[0].toLowerCase();
  const platform = detectPlatform(headerLine);
  
  if (platform === 'unknown') {
    return { trades: [], platform: 'unknown', errors: ['Unsupported CSV format. Please use MT4, MT5 or cTrader export.'] };
  }

  const trades: Partial<IndividualTrade>[] = [];
  const errors: string[] = [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length < headers.length) continue;

    try {
      const trade = mapToTrade(headers, values, platform);
      if (trade) trades.push(trade);
    } catch (err) {
      errors.push(`Error parsing line ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return { trades, platform, errors };
}

function detectPlatform(headerLine: string): 'mt4' | 'mt5' | 'ctrader' | 'unknown' {
  if (headerLine.includes('ticket') && headerLine.includes('item') && headerLine.includes('profit')) {
    return 'mt4';
  }
  if (headerLine.includes('position id') || headerLine.includes('symbol') && headerLine.includes('profit')) {
    return 'mt5';
  }
  if (headerLine.includes('positionid') && headerLine.includes('entrytime')) {
    return 'ctrader';
  }
  return 'unknown';
}

function mapToTrade(headers: string[], values: string[], platform: string): Partial<IndividualTrade> | null {
  const data: Record<string, string> = {};
  headers.forEach((h, i) => {
    data[h] = values[i];
  });

  if (platform === 'mt4') {
    const type = data['type']?.toLowerCase() || '';
    if (!['buy', 'sell'].includes(type)) return null; 

    return {
      ticket_number: data['ticket'],
      instrument: data['item'],
      direction: type === 'buy' ? 'long' : 'short',
      lot_size: parseFloat(data['size']),
      entry_price: parseFloat(data['price']),
      entry_time: data['open time'],
      exit_time: data['close time'],
      pnl: parseFloat(data['profit']),
      commission: parseFloat(data['commission']),
      swap: parseFloat(data['swap']),
      net_pnl: parseFloat(data['profit']) + parseFloat(data['commission'] || '0') + parseFloat(data['swap'] || '0'),
    };
  }

  if (platform === 'mt5') {
    return {
      ticket_number: data['position id'] || data['deal'],
      instrument: data['symbol'],
      direction: (data['type']?.toLowerCase().includes('buy') ? 'long' : 'short') as any,
      lot_size: parseFloat(data['volume']),
      entry_price: parseFloat(data['price']),
      entry_time: data['time'],
      exit_time: data['time'], // MT5 export often separates open/close deals
      pnl: parseFloat(data['profit']),
      net_pnl: parseFloat(data['profit']),
    };
  }

  return null;
}
