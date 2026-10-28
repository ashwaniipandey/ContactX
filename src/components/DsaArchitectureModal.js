"use client";

import React from "react";
import { X, Cpu, Code2, CheckCircle2, ArrowRight } from "lucide-react";

export default function DsaArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const dsaMappings = [
    {
      cConcept: "std::vector<Contact> contacts",
      fullStack: "ContactVector (Custom Dynamic Array)",
      timeComplexity: "O(1) amortized append, O(N) shift on erase",
      spaceComplexity: "O(N) contiguous memory",
      desc: "Manages capacity expansion (2x resize) and tracks memory reallocations and element shifting.",
    },
    {
      cConcept: "searchByName(string name)",
      fullStack: "manager.searchByName(query)",
      timeComplexity: "O(N) Time, O(1) Auxiliary Space",
      spaceComplexity: "O(1)",
      desc: "Performs case-insensitive linear scan across all vector elements with comparison counting.",
    },
    {
      cConcept: "searchByPhone(string phone)",
      fullStack: "manager.searchByPhone(phone)",
      timeComplexity: "O(N) Time",
      spaceComplexity: "O(1)",
      desc: "Linear search matching exact or substring digits across contact array.",
    },
    {
      cConcept: "searchByEmail(string email)",
      fullStack: "manager.searchByEmail(email)",
      timeComplexity: "O(N) Time",
      spaceComplexity: "O(1)",
      desc: "Case-insensitive linear search on email field.",
    },
    {
      cConcept: "sortByName() with lambda comparator",
      fullStack: "manager.sortByName(order)",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(log N)",
      desc: "Lexicographical comparator sort supporting ascending and descending orders with comparison metrics.",
    },
    {
      cConcept: "sortByPhone() with lambda comparator",
      fullStack: "manager.sortByPhone(order)",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(log N)",
      desc: "Numeric/string comparator sort by 10-digit phone number.",
    },
    {
      cConcept: "deleteContact(string phone)",
      fullStack: "manager.deleteContact(phone)",
      timeComplexity: "O(N) search + O(N) shift",
      spaceComplexity: "O(1)",
      desc: "Locates index via linear search, then invokes vector::erase shifting subsequent elements left.",
    },
    {
      cConcept: "saveToFile() / loadFromFile()",
      fullStack: "Pipe-delimited contacts.txt Parser",
      timeComplexity: "O(N) file serialization",
      spaceComplexity: "O(N) disk storage",
      desc: "Serializes and deserializes format: name|phone|email|address|favorite|dateAdded.",
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "780px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Cpu size={22} color="#a855f7" />
            <div>
              <h2 className="modal-title">C++ DSA to Full-Stack Architecture</h2>
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Rigorous mapping of Data Structures &amp; Algorithms from terminal C++
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: "20px" }}>
          <div
            style={{
              padding: "14px 16px",
              background: "rgba(99, 102, 241, 0.1)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              fontSize: "13px",
              lineHeight: "1.6",
              color: "#c7d2fe",
            }}
          >
            <strong>Core Architecture Preserved:</strong> All algorithmic principles written in your
            C++ source files (<code>Contact.h</code>, <code>ContactManager.cpp</code>, and <code>main.cpp</code>)
            have been ported into an optimized full-stack engine with live Big-O metrics, validation constraints, and direct disk syncing with <code>contacts.txt</code>.
          </div>

          {/* Mapping Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              className="contacts-table"
              style={{ fontSize: "12px", border: "1px solid var(--border-subtle)" }}
            >
              <thead>
                <tr>
                  <th>Original C++ DSA</th>
                  <th>Full-Stack Equivalent</th>
                  <th>Time Complexity</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {dsaMappings.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <code
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "#38bdf8",
                          fontSize: "11px",
                        }}
                      >
                        {item.cConcept}
                      </code>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: "#fff" }}>
                        {item.fullStack}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "#34d399",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.timeComplexity}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "11px" }}>
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Got it, Back to App
          </button>
        </div>
      </div>
    </div>
  );
}
