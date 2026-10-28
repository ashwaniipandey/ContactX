"use client";

import React from "react";
import { Activity, Clock, Zap } from "lucide-react";

export default function DsaHud({ metrics }) {
  if (!metrics) {
    return (
      <div className="dsa-hud">
        <div className="dsa-hud-left">
          <div className="dsa-hud-badge">
            <span className="dsa-hud-pulse" />
            <span>DSA ENGINE READY</span>
          </div>
          <span className="dsa-hud-title">
            Dynamic Vector (std::vector&lt;Contact&gt;) Memory Contiguous
          </span>
        </div>
        <div className="dsa-hud-stats">
          <div className="dsa-hud-metric">
            <Zap size={14} />
            <span>Time Complexity:</span> O(1) / O(N) / O(N log N)
          </div>
        </div>
      </div>
    );
  }

  const actionName = metrics.action || "Active Operation";
  const complexity = metrics.timeComplexity || "O(N)";
  const duration = metrics.durationMs !== undefined ? `${metrics.durationMs}ms` : "< 1ms";
  const comparisons = metrics.comparisons !== undefined ? metrics.comparisons : null;

  return (
    <div className="dsa-hud">
      <div className="dsa-hud-left">
        <div className="dsa-hud-badge">
          <span className="dsa-hud-pulse" />
          <span>DSA ACTIVE</span>
        </div>
        <span className="dsa-hud-title">
          Executing: <strong>{actionName}</strong>
          {metrics.algorithm ? ` (${metrics.algorithm})` : ""}
        </span>
      </div>

      <div className="dsa-hud-stats">
        <div className="dsa-hud-metric">
          <Zap size={14} color="#818cf8" />
          <span>Complexity:</span> {complexity}
        </div>

        <div className="dsa-hud-metric">
          <Clock size={14} color="#34d399" />
          <span>Execution Time:</span> {duration}
        </div>

        {comparisons !== null && (
          <div className="dsa-hud-metric">
            <Activity size={14} color="#fbbf24" />
            <span>Comparisons:</span> {comparisons}
          </div>
        )}
      </div>
    </div>
  );
}
