export function calculateSMA(data: any[], period: number) {
  const sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(null);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
}

export function calculateEMA(data: any[], period: number) {
  const ema = [];
  const k = 2 / (period + 1);
  let prevEma = data[0].close;
  
  for (let i = 0; i < data.length; i++) {
    const currentPrice = data[i].close;
    const currentEma = (currentPrice - prevEma) * k + prevEma;
    ema.push({ time: data[i].time, value: currentEma });
    prevEma = currentEma;
  }
  return ema;
}

export function calculateRSI(data: any[], period: number = 14) {
  const rsi: ({ time: any; value: number } | null)[] = [];

  for (let i = 1; i < data.length; i++) {
    if (i < period) {
      rsi.push(null);
      continue;
    }
    let gains = 0;
    let losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j].close - data[j - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push({ time: data[i].time, value: rsiValue });
  }
  return rsi;
}

export function calculateMACD(data: any[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const fastEma = calculateEMA(data, fastPeriod);
  const slowEma = calculateEMA(data, slowPeriod);
  
  const macdArray = [];
  for (let i = 0; i < data.length; i++) {
    if (fastEma[i] === null || slowEma[i] === null || fastEma[i] === undefined || slowEma[i] === undefined || !fastEma[i].value || !slowEma[i].value) {
      macdArray.push({ time: data[i].time, value: null });
    } else {
      macdArray.push({ time: data[i].time, value: fastEma[i].value - slowEma[i].value, close: fastEma[i].value - slowEma[i].value }); // Include close for EMA calculation
    }
  }

  // To calculate signal, we need an EMA of the MACD values. Filter nulls temporarily to seed the EMA.
  const validMacd = macdArray.filter(d => d.value !== null);
  const signalEma = calculateEMA(validMacd, signalPeriod);
  
  let signalIndex = 0;
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (macdArray[i].value === null) {
      result.push({ time: data[i].time, macd: null, signal: null, histogram: null });
    } else {
      const sigLine = signalIndex < signalEma.length ? signalEma[signalIndex].value : null;
      signalIndex++;
      const hist = sigLine !== null && macdArray[i].value !== null ? (macdArray[i].value as number) - sigLine : null;
      result.push({ 
        time: data[i].time, 
        macd: macdArray[i].value, 
        signal: sigLine, 
        histogram: hist 
      });
    }
  }
  return result;
}

export function calculateStochastic(data: any[], kPeriod = 14, dPeriod = 3) {
  const stochData = [];
  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      stochData.push({ time: data[i].time, k: null, d: null });
      continue;
    }
    const window = data.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...window.map(w => w.high));
    const lowestLow = Math.min(...window.map(w => w.low));
    
    const k = ((data[i].close - lowestLow) / (highestHigh - lowestLow)) * 100;
    stochData.push({ time: data[i].time, k, close: k });
  }

  const validStoch = stochData.filter(d => d.k !== null);
  const dSeries = calculateSMA(validStoch, dPeriod);
  
  let dIndex = 0;
  const result = [];
  for (let i = 0; i < stochData.length; i++) {
    if (stochData[i].k === null) {
      result.push({ time: stochData[i].time, k: null, d: null });
    } else {
      const dVal = dIndex < dSeries.length ? (dSeries[dIndex] as { time: any; value: number } | null)?.value ?? null : null;
      dIndex++;
      result.push({ time: stochData[i].time, k: stochData[i].k, d: dVal });
    }
  }
  return result;
}

export function calculateATR(data: any[], period = 14): { time: any; value: number | null }[] {
  const atrData: { time: any; value: number | null }[] = [{ time: data[0].time, value: null }];
  const tr = [data[0].high - data[0].low];
  
  for (let i = 1; i < data.length; i++) {
    const highLow = data[i].high - data[i].low;
    const highClose = Math.abs(data[i].high - data[i-1].close);
    const lowClose = Math.abs(data[i].low - data[i-1].close);
    tr.push(Math.max(highLow, highClose, lowClose));
  }

  let atrAcc = tr.slice(1, period + 1).reduce((a,b) => a+b, 0) / period;
  for(let i = 1; i < period; i++) {
    atrData.push({ time: data[i].time, value: null });
  }
  
  atrData.push({ time: data[period].time, value: atrAcc });

  for (let i = period + 1; i < data.length; i++) {
    atrAcc = ((atrAcc * (period - 1)) + tr[i]) / period;
    atrData.push({ time: data[i].time, value: atrAcc });
  }
  
  return atrData;
}
