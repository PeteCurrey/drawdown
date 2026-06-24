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

export function calculateBollingerBands(data: any[], period = 20, multiplier = 2) {
  const bands = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      bands.push({ time: data[i].time, upper: null, middle: null, lower: null });
      continue;
    }
    const window = data.slice(i - period + 1, i + 1);
    const sma = window.reduce((sum, d) => sum + d.close, 0) / period;
    const variance = window.reduce((sum, d) => sum + Math.pow(d.close - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    bands.push({
      time: data[i].time,
      upper: sma + multiplier * stdDev,
      middle: sma,
      lower: sma - multiplier * stdDev
    });
  }
  return bands;
}

export function calculateCCI(data: any[], period = 20) {
  const cci = [];
  const typicalPrices = data.map(d => (d.high + d.low + d.close) / 3);

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      cci.push({ time: data[i].time, value: null });
      continue;
    }
    const windowTP = typicalPrices.slice(i - period + 1, i + 1);
    const smaTP = windowTP.reduce((sum, val) => sum + val, 0) / period;
    const meanDev = windowTP.reduce((sum, val) => sum + Math.abs(val - smaTP), 0) / period;
    
    const value = meanDev === 0 ? 0 : (typicalPrices[i] - smaTP) / (0.015 * meanDev);
    cci.push({ time: data[i].time, value });
  }
  return cci;
}

export function calculateADX(data: any[], period = 14) {
  const adx = [];
  const tr = [];
  const plusDM = [];
  const minusDM = [];

  // 1. Calculate TR, +DM, -DM
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      tr.push(data[0].high - data[0].low);
      plusDM.push(0);
      minusDM.push(0);
      continue;
    }

    const highLow = data[i].high - data[i].low;
    const highClose = Math.abs(data[i].high - data[i - 1].close);
    const lowClose = Math.abs(data[i].low - data[i - 1].close);
    tr.push(Math.max(highLow, highClose, lowClose));

    const upMove = data[i].high - data[i - 1].high;
    const downMove = data[i - 1].low - data[i].low;

    if (upMove > downMove && upMove > 0) {
      plusDM.push(upMove);
    } else {
      plusDM.push(0);
    }

    if (downMove > upMove && downMove > 0) {
      minusDM.push(downMove);
    } else {
      minusDM.push(0);
    }
  }

  // 2. Wilder's Smoothing for TR, +DM, -DM
  let smoothedTR = tr.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedPlusDM = plusDM.slice(0, period).reduce((a, b) => a + b, 0);
  let smoothedMinusDM = minusDM.slice(0, period).reduce((a, b) => a + b, 0);

  const dxList = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      adx.push({ time: data[i].time, value: null });
      dxList.push(null);
      continue;
    }

    if (i > period - 1) {
      smoothedTR = smoothedTR - smoothedTR / period + tr[i];
      smoothedPlusDM = smoothedPlusDM - smoothedPlusDM / period + plusDM[i];
      smoothedMinusDM = smoothedMinusDM - smoothedMinusDM / period + minusDM[i];
    }

    const plusDI = smoothedTR === 0 ? 0 : 100 * (smoothedPlusDM / smoothedTR);
    const minusDI = smoothedTR === 0 ? 0 : 100 * (smoothedMinusDM / smoothedTR);

    const sumDI = plusDI + minusDI;
    const diffDI = Math.abs(plusDI - minusDI);
    const dx = sumDI === 0 ? 0 : 100 * (diffDI / sumDI);
    dxList.push(dx);

    if (i < period * 2 - 2) {
      adx.push({ time: data[i].time, value: null });
    } else if (i === period * 2 - 2) {
      const validDX = dxList.slice(period - 1, period * 2 - 1) as number[];
      const initialADX = validDX.reduce((a, b) => a + b, 0) / period;
      adx.push({ time: data[i].time, value: initialADX });
    } else {
      const prevADX = adx[i - 1].value as number;
      const currentADX = (prevADX * (period - 1) + dx) / period;
      adx.push({ time: data[i].time, value: currentADX });
    }
  }

  return adx;
}
