import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, RefreshCw, FileText, Download, ShieldCheck, Clock, Zap } from 'lucide-react';
import { ApiService } from '../services/api.ts';
import type { TestCaseResult } from '../types/index.ts';

export const CloudTestRunner: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestCaseResult[]>([]);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PASS' | 'FAIL'>('ALL');

  const handleRunTests = async () => {
    setRunning(true);
    try {
      const data = await ApiService.runCloudTests();
      setResults(data.results);
      setSummary({
        total: data.totalTests,
        passed: data.passed,
        failed: data.failed
      });
    } catch (err: any) {
      alert(err?.message || 'Failed to execute test suite');
    } finally {
      setRunning(false);
    }
  };

  const handleExportMarkdown = () => {
    if (results.length === 0) return;

    let md = `# Cloud Computing Project: Automated Test Suite Report
**Project:** AI-Powered Personal Diet Planner with Cloud Storage
**Date:** ${new Date().toISOString()}
**Total Test Cases:** ${summary?.total || results.length}
**Passed:** ${summary?.passed || 0}
**Failed:** ${summary?.failed || 0}
**Pass Rate:** ${summary ? ((summary.passed / summary.total) * 100).toFixed(1) : 0}%

---

| Test ID | Scenario | Input | Expected Result | Actual Result | Status | Latency |
|---------|----------|-------|-----------------|---------------|--------|---------|
`;

    results.forEach(r => {
      md += `| **${r.id}** | ${r.scenario} | \`${r.inputDescription}\` | ${r.expectedResult} | ${r.actualResult} | **${r.status}** (${r.httpStatus}) | ${r.latencyMs}ms |\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cloud_Diet_Planner_Test_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Automated Cloud Test Suite</h1>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                20 Test Cases
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Validates authentication token lifecycle, cross-tenant user isolation, AI error handling, rule-based fallbacks, and cloud database/storage quota integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {results.length > 0 && (
              <button
                onClick={handleExportMarkdown}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Export Report (MD)
              </button>
            )}

            <button
              onClick={handleRunTests}
              disabled={running}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running Cloud Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Run All 20 Tests
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Tests</span>
              <span className="text-xl font-bold text-white mt-0.5">{summary.total}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/50">
              <span className="text-[10px] text-emerald-400 block uppercase font-mono">Passed</span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {summary.passed}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-rose-900/50">
              <span className="text-[10px] text-rose-400 block uppercase font-mono">Failed</span>
              <span className="text-xl font-bold text-rose-400 mt-0.5 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> {summary.failed}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-sky-900/50">
              <span className="text-[10px] text-sky-400 block uppercase font-mono">Pass Rate</span>
              <span className="text-xl font-bold text-sky-300 mt-0.5">
                {((summary.passed / summary.total) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs if results present */}
      {results.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setFilter('PASS')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filter === 'PASS' ? 'bg-emerald-950 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Passed ({summary?.passed})
            </button>
            {summary && summary.failed > 0 && (
              <button
                onClick={() => setFilter('FAIL')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  filter === 'FAIL' ? 'bg-rose-950 text-rose-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                Failed ({summary.failed})
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Live Endpoint: <code className="text-sky-300">POST /api/run-tests</code>
          </span>
        </div>
      )}

      {/* Test Results Table */}
      {results.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Play className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No Test Results Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Run All 20 Tests" above to execute all 20 cloud unit and integration test scenarios against the running full-stack server.
          </p>
          <button
            onClick={handleRunTests}
            className="mt-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            Launch Test Suite
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {filteredResults.map((tc) => (
              <div key={tc.id} className="p-4 sm:p-5 hover:bg-slate-850/50 transition-colors space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-850 px-2 py-0.5 rounded">
                      {tc.id}
                    </span>
                    <span className="text-sm font-bold text-white">{tc.scenario}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tc.latencyMs !== undefined && (
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {tc.latencyMs}ms
                      </span>
                    )}

                    {tc.status === 'PASS' ? (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS ({tc.httpStatus})
                      </span>
                    ) : (
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> FAIL ({tc.httpStatus})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Input / Stimulus</span>
                    <span className="text-slate-300 font-mono text-[11px]">{tc.inputDescription}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Expected Result</span>
                    <span className="text-slate-300">{tc.expectedResult}</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-emerald-400 block uppercase font-mono">Actual Result</span>
                    <span className="text-emerald-300">{tc.actualResult}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
