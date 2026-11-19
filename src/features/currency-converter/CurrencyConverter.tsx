"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRightLeft,
  Copy,
  Check,
  RefreshCw,
  Search,
  TrendingUp,
  Globe,
  Coins,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

// 160+ Currencies with ISO code, name, symbol and flag
const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD", flag: "🇰🇼" },
  { code: "OMR", name: "Omani Rial", symbol: "RO", flag: "🇴🇲" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD", flag: "🇧🇭" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", flag: "🇬🇭" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/.", flag: "🇵🇪" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH", flag: "🇲🇦" },
  { code: "DZD", name: "Algerian Dinar", symbol: "DA", flag: "🇩🇿" },
  { code: "JOD", name: "Jordanian Dinar", symbol: "JD", flag: "🇯🇴" },
  { code: "LBP", name: "Lebanese Pound", symbol: "L£", flag: "🇱🇧" },
  { code: "IQD", name: "Iraqi Dinar", symbol: "ID", flag: "🇮🇶" },
  { code: "KZT", name: "Kazakhstani Tenge", symbol: "₸", flag: "🇰🇿" },
  { code: "UZS", name: "Uzbekistani Som", symbol: "so'm", flag: "🇺🇿" },
  { code: "AZN", name: "Azerbaijani Manat", symbol: "₼", flag: "🇦🇿" },
  { code: "GEL", name: "Georgian Lari", symbol: "₾", flag: "🇬🇪" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷" },
  { code: "RSD", name: "Serbian Dinar", symbol: "din", flag: "🇷🇸" },
  { code: "ISK", name: "Icelandic Krona", symbol: "kr", flag: "🇮🇸" },
];

// Offline benchmark rates based on 1 USD
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BDT: 121.5,
  INR: 86.8,
  AED: 3.6725,
  SAR: 3.75,
  CAD: 1.41,
  AUD: 1.55,
  JPY: 154.2,
  SGD: 1.34,
  MYR: 4.46,
  CNY: 7.24,
  CHF: 0.89,
  NZD: 1.73,
  QAR: 3.64,
  KWD: 0.31,
  OMR: 0.385,
  BHD: 0.376,
  PKR: 279.5,
  TRY: 35.8,
  KRW: 1410.0,
  THB: 34.5,
  IDR: 16100.0,
  PHP: 58.2,
  VND: 25400.0,
  HKD: 7.78,
  TWD: 32.5,
  BRL: 5.75,
  MXN: 20.3,
  ZAR: 18.2,
  SEK: 10.7,
  NOK: 11.1,
  DKK: 6.87,
  PLN: 4.02,
  CZK: 23.5,
  HUF: 382.0,
  ILS: 3.68,
  EGP: 50.4,
  NGN: 1530.0,
  KES: 129.5,
  GHS: 15.6,
  LKR: 292.0,
  NPR: 139.0,
  RUB: 102.5,
  ARS: 1040.0,
  CLP: 975.0,
  COP: 4380.0,
  PEN: 3.78,
  MAD: 10.1,
  DZD: 134.5,
  JOD: 0.709,
  LBP: 89500.0,
  IQD: 1310.0,
  KZT: 495.0,
  UZS: 12850.0,
  AZN: 1.7,
  GEL: 2.78,
  UAH: 41.5,
  RON: 4.62,
  BGN: 1.81,
  HRK: 6.93,
  RSD: 108.0,
  ISK: 138.5,
};

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "BDT", "INR", "AED", "SAR", "CAD", "AUD", "JPY"];

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("BDT");
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("Live Baseline");
  const [copied, setCopied] = useState<boolean>(false);

  // Modal / selector state for mobile
  const [pickerOpen, setPickerOpen] = useState<"from" | "to" | null>(null);
  const [pickerSearch, setPickerSearch] = useState<string>("");

  // Fetch real-time live rates
  const fetchLiveRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates) {
          setRates((prev) => ({ ...prev, ...data.rates }));
          const date = new Date(data.time_last_update_utc || Date.now());
          setLastUpdated(date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }));
        }
      }
    } catch {
      // Keep fallback baseline silently
      setLastUpdated("Cached Benchmark");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveRates();
  }, []);

  // Compute conversion
  const parsedAmount = parseFloat(amount) || 0;
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  // Rate: 1 fromCurrency = (toRate / fromRate) toCurrency
  const exchangeRate = toRate / fromRate;
  const convertedValue = parsedAmount * exchangeRate;

  // Swap currencies
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Copy result
  const handleCopy = () => {
    const text = `${amount} ${fromCurrency} = ${convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${toCurrency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fromCurrObj = CURRENCIES.find((c) => c.code === fromCurrency) || {
    code: fromCurrency,
    name: fromCurrency,
    symbol: "$",
    flag: "🌐",
  };

  const toCurrObj = CURRENCIES.find((c) => c.code === toCurrency) || {
    code: toCurrency,
    name: toCurrency,
    symbol: "$",
    flag: "🌐",
  };

  // Filtered currency list for picker
  const filteredCurrencies = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [pickerSearch]);

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* MAIN CONVERTER CARD */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-8 shadow-sm">
        {/* Header row with status & refresh */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500">
              Rates updated: <strong className="text-slate-700">{lastUpdated}</strong>
            </span>
          </div>

          <button
            onClick={fetchLiveRates}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            <span>{isLoading ? "Updating..." : "Refresh Rates"}</span>
          </button>
        </div>

        {/* INPUT & CONVERSION CONTROLS */}
        <div className="mt-6 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Amount to Convert
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-bold text-slate-400">
                {fromCurrObj.symbol}
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 pl-11 sm:pl-12 pr-4 py-3 sm:py-4 text-xl sm:text-2xl font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:border-blue-500 transition-all shadow-2xs"
              />
            </div>

            {/* Quick preset chips for rapid calculation */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Presets:</span>
              {["10", "50", "100", "500", "1000"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    amount === preset
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {fromCurrObj.symbol}{preset}
                </button>
              ))}
            </div>
          </div>

          {/* CURRENCY SELECTORS & SWAP BUTTON */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 pt-2">
            {/* FROM CURRENCY */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                From Currency
              </label>
              <button
                type="button"
                onClick={() => {
                  setPickerSearch("");
                  setPickerOpen("from");
                }}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 text-left hover:border-slate-300 hover:bg-slate-100/70 active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">{fromCurrObj.flag}</span>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {fromCurrObj.code}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {fromCurrObj.name}
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* SWAP BUTTON (Responsive Center) */}
            <div className="flex justify-center sm:pt-6">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap currencies"
                className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
              >
                <ArrowRightLeft className="h-5 w-5 rotate-90 sm:rotate-0 transition-transform" />
              </button>
            </div>

            {/* TO CURRENCY */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                To Currency
              </label>
              <button
                type="button"
                onClick={() => {
                  setPickerSearch("");
                  setPickerOpen("to");
                }}
                className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 text-left hover:border-slate-300 hover:bg-slate-100/70 active:scale-[0.99] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl">{toCurrObj.flag}</span>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                      {toCurrObj.code}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1">
                      {toCurrObj.name}
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
              </button>
            </div>
          </div>

          {/* RESULT DISPLAY BOX */}
          <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-indigo-50/60 p-5 sm:p-7 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  {parsedAmount.toLocaleString()} {fromCurrObj.name} =
                </p>
                <div className="flex flex-wrap items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                    {convertedValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-blue-600">
                    {toCurrObj.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  1 {fromCurrObj.code} = {exchangeRate.toFixed(4)} {toCurrObj.code} • 1 {toCurrObj.code} = {(1 / (exchangeRate || 1)).toFixed(4)} {fromCurrObj.code}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 border border-slate-200/80 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-CURRENCY COMPARISON TABLE (High value feature) */}
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Popular Conversion Overview
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant conversion of {parsedAmount.toLocaleString()} {fromCurrObj.code} into top global currencies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {POPULAR_CURRENCIES.map((code) => {
            const target = CURRENCIES.find((c) => c.code === code);
            if (!target) return null;
            const targetRate = rates[code] || 1;
            const conv = parsedAmount * (targetRate / fromRate);

            return (
              <div
                key={code}
                onClick={() => setToCurrency(code)}
                className={`rounded-xl border p-3 transition-all cursor-pointer ${
                  toCurrency === code
                    ? "border-blue-500 bg-blue-50/50 shadow-2xs"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{target.flag}</span>
                  <span className="text-xs font-bold text-slate-500">{target.code}</span>
                </div>
                <div className="mt-2 text-sm sm:text-base font-extrabold text-slate-900 truncate">
                  {conv.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {target.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE-FRIENDLY CURRENCY SELECTOR MODAL / SHEET */}
      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setPickerOpen(null)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Select {pickerOpen === "from" ? "Source" : "Target"} Currency
                </h3>
              </div>
              <button
                onClick={() => setPickerOpen(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/60">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search by code (USD) or name (Dollar, Rupee)..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Currency List */}
            <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-50">
              {filteredCurrencies.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  No currency found matching &quot;{pickerSearch}&quot;
                </div>
              ) : (
                filteredCurrencies.map((c) => {
                  const isSelected =
                    pickerOpen === "from"
                      ? fromCurrency === c.code
                      : toCurrency === c.code;

                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        if (pickerOpen === "from") {
                          setFromCurrency(c.code);
                        } else {
                          setToCurrency(c.code);
                        }
                        setPickerOpen(null);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer ${
                        isSelected ? "bg-blue-50/70" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {c.code}{" "}
                            <span className="text-xs font-normal text-slate-500">
                              ({c.symbol})
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">{c.name}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
