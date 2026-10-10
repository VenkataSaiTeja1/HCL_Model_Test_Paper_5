/**
 * HCL Campus Drive — Model Test Paper 5
 * --------------------------------------------------------------------------
 * A self-contained React component (no external UI libraries) for final-year
 * B.Tech students (CSE, CSM, CAI, CSD, IT, ECE, EEE).
 *
 * Tabs
 *   1. Question Bank – Paper 5: 30 MCQs (A1 Quant 10 · A2 Reasoning 8 · A3 Computer Fundamentals 12)
 *                      + the Section B coding problem, with section chips, filters, search, sort
 *   2. Mock Test     – timed test: full Section A (30 Qs · 60 min) or one section
 *   3. Coding Round  – Section B: Command Auto-Correct (Dynamic programming (edit distance)), Java + Python solutions, extra tests
 *
 * Content
 *   • Questions, options, answers and working are exactly those of the Word paper
 *     HCL_Model_Test_Paper_5.docx and its answer key (unchanged).
 *   • Topic and difficulty tags were added for filtering only.
 *
 * Usage: drop into any React 18+ project (Vite/CRA/Next client component) and
 * render <HCLModelTestPaper5 />. Progress is kept in component state and, where
 * the browser allows it, mirrored to localStorage (safe no-op otherwise).
 */
import { useEffect, useMemo, useRef, useState } from "react";

// ─── QUESTION BANK (Paper 5: 30 MCQs + 1 coding problem) ─────────────────
// MCQ fields: id, paper, no (question number in the paper), cat (quant|reasoning|technical), topic, diff,
//             time (sec), q, code?, lang?, opts[], ans (index), sol
// Coding item (type: "coding", id P5-B) instead carries: pattern, statement, input, output, constraints,
//             samples[{in,out,note}], tests[{in,out}], approach, complexity, marking, java, python
const BANK = [
  {"id": "P5-Q01", "paper": 5, "no": 1, "cat": "quant", "topic": "Profit & Loss", "diff": "Easy", "time": 45, "q": "An article sold for ₹600 gives a 25% loss. To gain 25%, it should be sold for:", "opts": ["₹900", "₹750", "₹1,000", "₹1,100"], "ans": 2, "sol": "CP = 600/0.75 = 800; 800 × 1.25 = 1,000"},
  {"id": "P5-Q02", "paper": 5, "no": 2, "cat": "quant", "topic": "Time & Work", "diff": "Medium", "time": 60, "q": "Pipes A and B fill a tank in 10 and 15 hours. Pipe C empties it in 20 hours. If all three are opened together, the tank fills in:", "opts": ["8 4/7 hours", "7 1/2 hours", "9 hours", "12 hours"], "ans": 0, "sol": "1/10 + 1/15 − 1/20 = 7/60 → 60/7 hours"},
  {"id": "P5-Q03", "paper": 5, "no": 3, "cat": "quant", "topic": "Speed & Distance", "diff": "Medium", "time": 60, "q": "A car covers 300 km. If its speed were 10 km/h more, it would take 1 hour less. Its original speed is:", "opts": ["60 km/h", "40 km/h", "45 km/h", "50 km/h"], "ans": 3, "sol": "300/v − 300/(v + 10) = 1 → v(v + 10) = 3,000 → v = 50"},
  {"id": "P5-Q04", "paper": 5, "no": 4, "cat": "quant", "topic": "Percentages", "diff": "Medium", "time": 60, "q": "A 20% fall in the price of sugar lets a buyer get 5 kg more for ₹600. The reduced price per kg is:", "opts": ["₹24", "₹30", "₹20", "₹25"], "ans": 0, "sol": "Saving = 20% of 600 = 120 buys 5 kg → ₹24/kg"},
  {"id": "P5-Q05", "paper": 5, "no": 5, "cat": "quant", "topic": "Interest", "diff": "Medium", "time": 60, "q": "On a sum, the compound interest for 2 years is ₹2,100 and the simple interest for 2 years is ₹2,000 at the same rate. The rate is:", "opts": ["5%", "12%", "10%", "8%"], "ans": 2, "sol": "SI per year = 1,000; CI − SI = 100 = interest on 1,000 → 10%"},
  {"id": "P5-Q06", "paper": 5, "no": 6, "cat": "quant", "topic": "Problems on Ages", "diff": "Medium", "time": 60, "q": "The ages of A and B are in the ratio 5 : 7. Four years ago the ratio was 3 : 5. A's present age is:", "opts": ["12 years", "14 years", "8 years", "10 years"], "ans": 3, "sol": "(5x − 4)/(7x − 4) = 3/5 → x = 2"},
  {"id": "P5-Q07", "paper": 5, "no": 7, "cat": "quant", "topic": "Permutations & Combinations", "diff": "Easy", "time": 45, "q": "How many diagonals does a polygon with 10 sides have?", "opts": ["45", "30", "35", "40"], "ans": 2, "sol": "n(n − 3)/2 = 10 × 7 / 2"},
  {"id": "P5-Q08", "paper": 5, "no": 8, "cat": "quant", "topic": "Number System", "diff": "Easy", "time": 45, "q": "The sum of the first 20 odd natural numbers is:", "opts": ["420", "380", "441", "400"], "ans": 3, "sol": "Sum of first n odd numbers = n²"},
  {"id": "P5-Q09", "paper": 5, "no": 9, "cat": "quant", "topic": "Number System", "diff": "Easy", "time": 45, "q": "Which of the following fractions is the largest?", "opts": ["3/5", "2/3", "5/8", "7/11"], "ans": 1, "sol": "0.667 > 0.636 > 0.625 > 0.6"},
  {"id": "P5-Q10", "paper": 5, "no": 10, "cat": "quant", "topic": "Probability", "diff": "Medium", "time": 60, "q": "A number is picked at random from 1 to 50. The probability that it is a multiple of 4 or 6 is:", "opts": ["2/5", "7/25", "8/25", "9/25"], "ans": 2, "sol": "12 + 8 − 4 = 16 favourable → 16/50"},
  {"id": "P5-Q11", "paper": 5, "no": 11, "cat": "reasoning", "topic": "Number Series", "diff": "Easy", "time": 45, "q": "Find the next number: 3, 6, 11, 18, 27, ?", "opts": ["36", "38", "39", "40"], "ans": 1, "sol": "n² + 2 for n = 1 … 6"},
  {"id": "P5-Q12", "paper": 5, "no": 12, "cat": "reasoning", "topic": "Letter Series", "diff": "Medium", "time": 60, "q": "Find the next group: ACE, GIK, MOQ, ?", "opts": ["STU", "SUW", "SUV", "RTV"], "ans": 1, "sol": "Each group skips one letter; groups continue from where the last stopped"},
  {"id": "P5-Q13", "paper": 5, "no": 13, "cat": "reasoning", "topic": "Symbol Substitution", "diff": "Easy", "time": 45, "q": "If 'pen' is called 'pencil', 'pencil' is called 'eraser' and 'eraser' is called 'sharpener', what do we use to remove pencil marks?", "opts": ["Eraser", "Pencil", "Pen", "Sharpener"], "ans": 3, "sol": "An eraser removes marks, and eraser is called 'sharpener'"},
  {"id": "P5-Q14", "paper": 5, "no": 14, "cat": "reasoning", "topic": "Blood Relations", "diff": "Medium", "time": 60, "q": "Q's mother is the sister of P and the daughter of M, who is a man. S is the daughter of P and the sister of T. How is M related to T?", "opts": ["Grandfather", "Uncle", "Father", "Brother-in-law"], "ans": 0, "sol": "P is M's child and T is P's child"},
  {"id": "P5-Q15", "paper": 5, "no": 15, "cat": "reasoning", "topic": "Directions", "diff": "Medium", "time": 60, "q": "Facing north, Ajay turns 45° clockwise, then 180° clockwise, then 270° anticlockwise. Which direction is he facing now?", "opts": ["South-West", "North-West", "North-East", "West"], "ans": 1, "sol": "45 + 180 − 270 = −45° → north-west"},
  {"id": "P5-Q16", "paper": 5, "no": 16, "cat": "reasoning", "topic": "Clocks & Calendars", "diff": "Easy", "time": 45, "q": "If 3 March 2026 is a Tuesday, what day of the week is 3 March 2027?", "opts": ["Wednesday", "Tuesday", "Thursday", "Monday"], "ans": 0, "sol": "365 days (no 29 February in between) = 1 odd day"},
  {"id": "P5-Q17", "paper": 5, "no": 17, "cat": "reasoning", "topic": "Seating & Ranking", "diff": "Hard", "time": 90, "q": "In a row, A is 10th from the left and B is 9th from the right. When they swap places, A becomes 15th from the left. How many people are in the row?", "opts": ["24", "23", "22", "25"], "ans": 1, "sol": "B's old spot is 15th from left and 9th from right → 15 + 9 − 1"},
  {"id": "P5-Q18", "paper": 5, "no": 18, "cat": "reasoning", "topic": "Syllogisms", "diff": "Medium", "time": 60, "q": "Statements: No server is slow. Some slow machines are old.\nConclusions: I. Some old machines are not servers. II. No old machine is a server.", "opts": ["Only I follows", "Only II follows", "Both follow", "Neither follows"], "ans": 0, "sol": "The old machines that are slow cannot be servers, so I follows; II goes beyond the data"},
  {"id": "P5-Q19", "paper": 5, "no": 19, "cat": "technical", "topic": "Operating Systems", "diff": "Easy", "time": 45, "q": "SPOOLING stands for:", "opts": ["Sequential Program Operations On-Line", "Simultaneous Process Ordering On-Line", "System Peripheral Output On-Line", "Simultaneous Peripheral Operations On-Line"], "ans": 3, "sol": "Spooling buffers jobs for slow devices such as printers"},
  {"id": "P5-Q20", "paper": 5, "no": 20, "cat": "technical", "topic": "Operating Systems", "diff": "Easy", "time": 45, "q": "Which page replacement algorithm produces the minimum number of page faults?", "opts": ["LRU", "Optimal", "FIFO", "Clock"], "ans": 1, "sol": "It replaces the page not needed for the longest future time"},
  {"id": "P5-Q21", "paper": 5, "no": 21, "cat": "technical", "topic": "Computer Networks", "diff": "Easy", "time": 45, "q": "Which protocol is designed for transferring files between computers?", "opts": ["FTP", "SMTP", "SNMP", "ICMP"], "ans": 0, "sol": "File Transfer Protocol"},
  {"id": "P5-Q22", "paper": 5, "no": 22, "cat": "technical", "topic": "Computer Networks", "diff": "Easy", "time": 45, "q": "The ping command uses which protocol?", "opts": ["TCP", "UDP", "ARP", "ICMP"], "ans": 3, "sol": "Echo request and echo reply messages"},
  {"id": "P5-Q23", "paper": 5, "no": 23, "cat": "technical", "topic": "DBMS & SQL", "diff": "Easy", "time": 45, "q": "Which of the following is a DDL command?", "opts": ["CREATE", "INSERT", "SELECT", "UPDATE"], "ans": 0, "sol": "DDL defines structure: CREATE, ALTER, DROP, TRUNCATE"},
  {"id": "P5-Q24", "paper": 5, "no": 24, "cat": "technical", "topic": "DBMS & SQL", "diff": "Medium", "time": 60, "q": "In the ER model, a weak entity is one that:", "opts": ["Cannot be identified by its own attributes alone", "Has no attributes", "Has only one record", "Has an integer primary key"], "ans": 0, "sol": "It depends on an owner entity for identification"},
  {"id": "P5-Q25", "paper": 5, "no": 25, "cat": "technical", "topic": "Data Structures", "diff": "Medium", "time": 60, "q": "Which data structure efficiently detects a cycle while adding edges to an undirected graph (as in Kruskal's algorithm)?", "opts": ["Stack", "Disjoint Set Union", "Heap", "Trie"], "ans": 1, "sol": "Union-find checks whether two endpoints are already connected"},
  {"id": "P5-Q26", "paper": 5, "no": 26, "cat": "technical", "topic": "Algorithms", "diff": "Hard", "time": 90, "q": "The time complexity of Dijkstra's algorithm using a binary heap is:", "opts": ["O(V²E)", "O(VE)", "O(E)", "O((V + E) log V)"], "ans": 3, "sol": "Each vertex extraction and edge relaxation costs O(log V)"},
  {"id": "P5-Q27", "paper": 5, "no": 27, "cat": "technical", "topic": "Algorithms", "diff": "Medium", "time": 60, "q": "Which sorting algorithm uses divide and conquer and sorts in place with O(n log n) average time?", "opts": ["Merge sort", "Bubble sort", "Quick sort", "Counting sort"], "ans": 2, "sol": "Merge sort needs O(n) extra space"},
  {"id": "P5-Q28", "paper": 5, "no": 28, "cat": "technical", "topic": "OOP & Java", "diff": "Easy", "time": 45, "q": "Which Java collection does not allow duplicate elements?", "opts": ["ArrayList", "LinkedList", "HashSet", "Vector"], "ans": 2, "sol": "Set implementations reject duplicates"},
  {"id": "P5-Q29", "paper": 5, "no": 29, "cat": "technical", "topic": "Output Prediction", "diff": "Hard", "time": 90, "q": "What is the output of the following Python code?", "code": "def f(x, lst=[]):\n    lst.append(x)\n    return len(lst)\n\nf(1)\nf(2)\nprint(f(3))", "lang": "python", "opts": ["1", "3", "2", "Error"], "ans": 1, "sol": "The default list is created once and shared between calls"},
  {"id": "P5-Q30", "paper": 5, "no": 30, "cat": "technical", "topic": "Output Prediction", "diff": "Medium", "time": 60, "q": "What is the output of the following C code?", "code": "char s[] = \"HCL\";\nprintf(\"%zu\", sizeof(s));", "lang": "c", "opts": ["3", "8", "4", "1"], "ans": 2, "sol": "\"HCL\" has 3 characters plus the terminating '\\0'"},
  {"id": "P5-B", "paper": 5, "no": 31, "cat": "coding", "type": "coding", "topic": "Coding: Dynamic programming (edit distance)", "diff": "Medium", "time": 2700, "q": "Command Auto-Correct", "pattern": "Dynamic programming (edit distance)", "statement": "A terminal suggests corrections when a user mistypes a command. To rank suggestions it needs the minimum number of single-character edits — insert, delete or replace — that turn the typed word into a valid command.\n\nPrint the minimum number of edits needed to convert string A into string B.", "input": "Line 1: string A.\nLine 2: string B.\nBoth contain lowercase letters only.", "output": "A single integer: the minimum number of edits.", "constraints": "1 ≤ |A|, |B| ≤ 2000\nExpected time complexity: O(|A| × |B|)", "samples": [{"in": "horse\nros\n", "out": "3\n", "note": "horse → rorse (replace h) → rose (delete r) → ros (delete e)."}, {"in": "intention\nexecution\n", "out": "5\n", "note": ""}, {"in": "gti\ngit\n", "out": "2\n", "note": ""}], "tests": [{"in": "abc\nabc\n", "out": "0\n"}, {"in": "a\nxyz\n", "out": "3\n"}, {"in": "kitten\nsitting\n", "out": "3\n"}], "approach": "Let dp[i][j] be the edits needed to turn the first i characters of A into the first j characters of B, with dp[i][0] = i and dp[0][j] = j. If A[i] = B[j], dp[i][j] = dp[i−1][j−1]; otherwise dp[i][j] = 1 + min(dp[i−1][j−1] replace, dp[i−1][j] delete, dp[i][j−1] insert). Two rows are enough, giving O(|B|) memory and O(|A| × |B|) time.", "complexity": "O(|A| × |B|) time, O(|B|) space", "marking": "Common mistake: comparing characters position by position, which ignores insertions and deletions (\"gti\" → \"git\" needs 2 edits, not 2 replacements counted by luck on every input). Plain recursion without memoisation times out — award at most 6 correctness marks.", "java": "import java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String a = sc.next(), b = sc.next();\n        int n = a.length(), m = b.length();\n        int[] prev = new int[m + 1], cur = new int[m + 1];\n        for (int j = 0; j <= m; j++) prev[j] = j;\n        for (int i = 1; i <= n; i++) {\n            cur[0] = i;\n            for (int j = 1; j <= m; j++) {\n                if (a.charAt(i - 1) == b.charAt(j - 1)) cur[j] = prev[j - 1];\n                else cur[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));\n            }\n            int[] t = prev; prev = cur; cur = t;\n        }\n        System.out.println(prev[m]);\n    }\n}", "python": "a = input().strip(); b = input().strip()\nn, m = len(a), len(b)\nprev = list(range(m + 1))\nfor i in range(1, n + 1):\n    cur = [i] + [0] * m\n    for j in range(1, m + 1):\n        if a[i - 1] == b[j - 1]:\n            cur[j] = prev[j - 1]\n        else:\n            cur[j] = 1 + min(prev[j - 1], prev[j], cur[j - 1])\n    prev = cur\nprint(prev[m])"}
];

// ─── STATIC CONTENT ─────────────────────────────────────────────────────────
const CATS = [
  { id: "quant", name: "Quantitative Aptitude", short: "Quant", icon: "∑", color: "#2563EB", section: "A1" },
  { id: "reasoning", name: "Logical Reasoning", short: "Reasoning", icon: "◇", color: "#7C3AED", section: "A2" },
  { id: "technical", name: "Computer Fundamentals", short: "Technical", icon: "</>", color: "#EA580C", section: "A3" },
  { id: "coding", name: "Coding (Section B)", short: "Coding", icon: "{ }", color: "#0D9488", section: "B" },
];
const CAT_BY_ID = Object.fromEntries(CATS.map((c) => [c.id, c]));
const COUNT = Object.fromEntries(CATS.map((c) => [c.id, BANK.filter((q) => q.cat === c.id).length]));
const MCQ_TOTAL = BANK.filter((q) => q.type !== "coding").length;
const CODING_ITEMS = BANK.filter((q) => q.type === "coding");
const PAPERS = [...new Set(BANK.map((q) => q.paper))];
const SINGLE = PAPERS.length === 1;
const DIFF_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
const DIFF_META = {
  Easy: { fg: "#166534", bg: "#DCFCE7" },
  Medium: { fg: "#9A3412", bg: "#FFEDD5" },
  Hard: { fg: "#991B1B", bg: "#FEE2E2" },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const LS_KEY = "hcl-model-paper-5-progress-v1";
function loadProgress() {
  try { return JSON.parse(window.localStorage.getItem(LS_KEY)) || {}; } catch { return {}; }
}
function saveProgress(p) {
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* storage unavailable: keep in memory */ }
}
const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// ─── SMALL UI PIECES ────────────────────────────────────────────────────────
function Pill({ fg, bg, children, title }) {
  return <span className="pill" style={{ color: fg, background: bg }} title={title}>{children}</span>;
}
function CodeBlock({ code, lang }) {
  return (
    <div className="code">
      {lang && <span className="code-lang">{lang.toUpperCase()}</span>}
      <pre><code>{code}</code></pre>
    </div>
  );
}

/** A single MCQ card: answer by clicking an option, or reveal the solution. */
function QuestionCard({ q, index, record, onAnswer, showMeta = true, lockReveal = false }) {
  const [open, setOpen] = useState(false);
  const chosen = record?.choice;
  const answered = chosen !== undefined;
  const reveal = !lockReveal && (answered || open);
  const cat = CAT_BY_ID[q.cat];
  return (
    <article className="qcard" style={{ borderLeftColor: cat.color }}>
      <header className="qhead">
        <span className="qid" style={{ color: cat.color }}>Paper {q.paper} · Q{q.no}</span>
        <span className="qtopic">{q.topic}</span>
        <span className="spacer" />
        <Pill {...DIFF_META[q.diff]}>{q.diff}</Pill>
        <span className="qtime" title="Recommended time">⏱ {q.time}s</span>
      </header>
      <p className="qtext">{index !== undefined && <b>{index + 1}. </b>}{q.q}</p>
      {q.code && <CodeBlock code={q.code} lang={q.lang} />}
      <ol className="opts">
        {q.opts.map((o, i) => {
          let cls = "opt";
          if (reveal && i === q.ans) cls += " correct";
          else if (answered && i === chosen && chosen !== q.ans && !lockReveal) cls += " wrong";
          else if (answered && i === chosen) cls += " picked";
          return (
            <li key={i}>
              <button className={cls} onClick={() => onAnswer && onAnswer(q, i)} disabled={!onAnswer || (answered && !lockReveal)}>
                <span className="optkey">{String.fromCharCode(65 + i)}</span>
                <span>{o}</span>
              </button>
            </li>
          );
        })}
      </ol>
      {!lockReveal && (
        <div className="qfoot">
          <button className="link" onClick={() => setOpen((v) => !v)}>{reveal ? "Hide solution" : "Show solution"}</button>
        </div>
      )}
      {reveal && (
        <div className="sol">
          <div><b>Answer: {String.fromCharCode(65 + q.ans)}</b> — {q.opts[q.ans]}</div>
          <p>{q.sol}</p>
        </div>
      )}
      {showMeta && (
        <footer className="qmeta">
          <Pill fg="#1E40AF" bg="#DBEAFE">Model Test Paper {q.paper}</Pill>
          <span className="ref">Section {cat.section} — {cat.name}</span>
        </footer>
      )}
    </article>
  );
}

/** A coding problem: statement, I/O spec, samples, then approach / Java / Python / test cases on demand. */
function CodingCard({ q, solved, onToggle }) {
  const [view, setView] = useState(null); // null | "approach" | "java" | "python" | "tests"
  const cat = CAT_BY_ID[q.cat];
  const toggle = (v) => setView((cur) => (cur === v ? null : v));
  return (
    <article className="qcard coding" style={{ borderLeftColor: cat.color }}>
      <header className="qhead">
        <span className="qid" style={{ color: cat.color }}>Paper {q.paper} · Section B</span>
        <span className="qtopic">{q.topic}</span>
        <span className="spacer" />
        <Pill {...DIFF_META[q.diff]}>{q.diff}</Pill>
        <span className="qtime" title="Recommended time">⏱ {Math.round(q.time / 60)} min</span>
      </header>
      <h4 className="ctitle">{q.q}</h4>
      <p className="qtext">{q.statement}</p>
      <dl className="io">
        <dt>Input</dt><dd>{q.input}</dd>
        <dt>Output</dt><dd>{q.output}</dd>
        <dt>Constraints</dt><dd>{q.constraints}</dd>
      </dl>
      {q.samples.map((s, i) => (
        <div key={i} className="sample">
          <div><div className="sample-h">Sample input {q.samples.length > 1 ? i + 1 : ""}</div><pre>{s.in.replace(/\n$/, "")}</pre></div>
          <div><div className="sample-h">Sample output</div><pre>{s.out.replace(/\n$/, "")}</pre></div>
          {s.note && <div className="sample-note">{s.note}</div>}
        </div>
      ))}
      <div className="ctabs">
        <button className={view === "approach" ? "on" : ""} onClick={() => toggle("approach")}>Approach</button>
        <button className={view === "java" ? "on" : ""} onClick={() => toggle("java")}>Java solution</button>
        <button className={view === "python" ? "on" : ""} onClick={() => toggle("python")}>Python solution</button>
        <button className={view === "tests" ? "on" : ""} onClick={() => toggle("tests")}>Extra test cases</button>
        <span className="spacer" />
        <label className="solved"><input type="checkbox" checked={solved} onChange={() => onToggle(q)} /> Solved</label>
      </div>
      {view === "approach" && <div className="sol"><p>{q.approach}</p><p><b>Complexity:</b> {q.complexity}</p><p className="muted">{q.marking}</p></div>}
      {view === "java" && <CodeBlock code={q.java} lang="java" />}
      {view === "python" && <CodeBlock code={q.python} lang="python" />}
      {view === "tests" && q.tests.map((s, i) => (
        <div key={i} className="sample">
          <div><div className="sample-h">Test input {i + 1}</div><pre>{s.in.replace(/\n$/, "")}</pre></div>
          <div><div className="sample-h">Expected output</div><pre>{s.out.replace(/\n$/, "")}</pre></div>
        </div>
      ))}
      <footer className="qmeta">
        <Pill fg="#1E40AF" bg="#DBEAFE">Model Test Paper {q.paper}</Pill>
        <span className="ref">Pattern tested: {q.pattern}</span>
      </footer>
    </article>
  );
}

// ─── TABS ───────────────────────────────────────────────────────────────────
function Sel({ label, value, set, options }) {
  return (
    <label className="sel"><span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  );
}

function Bank({ progress, cat = "all", setCat, paper = "all", setPaper, onAnswer, onSolved, onReset }) {
  const [diff, setDiff] = useState("all");
  const [topic, setTopic] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("id");
  const [query, setQuery] = useState("");

  const topics = useMemo(() => [...new Set(BANK.filter((q) => cat === "all" || q.cat === cat).map((q) => q.topic))].sort(), [cat]);
  useEffect(() => { setTopic("all"); }, [cat]);

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    const r = BANK.filter((q) =>
      (cat === "all" || q.cat === cat) && (paper === "all" || q.paper === Number(paper)) &&
      (diff === "all" || q.diff === diff) && (topic === "all" || q.topic === topic) &&
      (status === "all" || (status === "todo" && !progress[q.id]) || (status === "wrong" && progress[q.id] && !progress[q.id].correct) || (status === "right" && progress[q.id]?.correct)) &&
      (!s || [q.q, q.topic, q.id, q.code || "", q.statement || "", (q.opts || []).join(" ")].join(" ").toLowerCase().includes(s))
    );
    const by = {
      id: (a, b) => BANK.indexOf(a) - BANK.indexOf(b),
      diff: (a, b) => DIFF_ORDER[a.diff] - DIFF_ORDER[b.diff] || BANK.indexOf(a) - BANK.indexOf(b),
      diffDesc: (a, b) => DIFF_ORDER[b.diff] - DIFF_ORDER[a.diff] || BANK.indexOf(a) - BANK.indexOf(b),
      time: (a, b) => a.time - b.time || BANK.indexOf(a) - BANK.indexOf(b),
      topic: (a, b) => a.topic.localeCompare(b.topic) || BANK.indexOf(a) - BANK.indexOf(b),
    }[sort];
    return [...r].sort(by);
  }, [cat, paper, diff, topic, status, sort, query, progress]);

  return (
    <div className="stack">
      {!SINGLE && <div className="chips">
        <button className={`chip ${paper === "all" ? "on" : ""}`} onClick={() => setPaper("all")}>All papers</button>
        {PAPERS.map((p) => <button key={p} className={`chip ${String(paper) === String(p) ? "on" : ""}`} onClick={() => setPaper(String(p))}>Paper {p}</button>)}
      </div>}
      <div className="chips">
        <button className={`chip ${cat === "all" ? "on" : ""}`} onClick={() => setCat("all")}>All sections ({BANK.length})</button>
        {CATS.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? "on" : ""}`} style={cat === c.id ? { background: c.color, borderColor: c.color } : {}} onClick={() => setCat(c.id)}>{c.section} · {c.short} ({COUNT[c.id]})</button>
        ))}
      </div>
      <div className="filters">
        <input className="search" placeholder="Search questions, topics, code…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
        <Sel label="Topic" value={topic} set={setTopic} options={[["all", "All topics"], ...topics.map((t) => [t, t])]} />
        <Sel label="Difficulty" value={diff} set={setDiff} options={[["all", "All"], ["Easy", "Easy"], ["Medium", "Medium"], ["Hard", "Hard"]]} />
        <Sel label="Status" value={status} set={setStatus} options={[["all", "All"], ["todo", "Not attempted"], ["wrong", "Got wrong"], ["right", "Got right"]]} />
        <Sel label="Sort" value={sort} set={setSort} options={[["id", "Paper order"], ["diff", "Easy → Hard"], ["diffDesc", "Hard → Easy"], ["time", "Shortest time"], ["topic", "Topic A–Z"]]} />
      </div>
      <div className="row">
        <span className="muted">{list.length} item{list.length === 1 ? "" : "s"} · est. {Math.round(list.reduce((a, q) => a + q.time, 0) / 60)} min</span>
        <span className="spacer" />
        <button className="link" onClick={onReset}>Reset progress</button>
      </div>
      {list.length === 0 && <div className="card muted">No questions match these filters.</div>}
      {list.map((q) => q.type === "coding"
        ? <CodingCard key={q.id} q={q} solved={!!progress[q.id]} onToggle={onSolved} />
        : <QuestionCard key={q.id} q={q} record={progress[q.id]} onAnswer={onAnswer} />)}
    </div>
  );
}

/** Timed test: a whole paper's Section A (30 questions, 60 min) or one section, in paper order. */
function MockTest() {
  const [paper, setPaper] = useState(PAPERS[0]);
  const [scopeId, setScopeId] = useState("full");
  const [test, setTest] = useState(null); // { qs, answers, start, submitted, paper, scope }
  const [now, setNow] = useState(Date.now());
  const timer = useRef(null);
  const scope = TEST_SCOPES.find((s) => s.id === (test ? test.scope : scopeId));
  const LIMIT = scope.minutes * 60;

  useEffect(() => {
    if (test && !test.submitted) { timer.current = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer.current); }
  }, [test]);
  const left = test ? Math.max(0, LIMIT - Math.floor((now - test.start) / 1000)) : LIMIT;
  useEffect(() => { if (test && !test.submitted && left === 0) setTest((t) => ({ ...t, submitted: true })); }, [left, test]);

  const start = () => {
    const qs = BANK.filter((q) => q.paper === paper && q.type !== "coding" && scope.cats.includes(q.cat));
    setTest({ qs, answers: {}, start: Date.now(), submitted: false, paper, scope: scopeId });
    setNow(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const score = test ? test.qs.filter((q) => test.answers[q.id] === q.ans).length : 0;
  const answeredCount = test ? Object.keys(test.answers).length : 0;

  if (!test) {
    return (
      <div className="stack">
        <section className="card">
          <h3>Timed paper test</h3>
          <p>{SINGLE ? `Take Paper ${PAPERS[0]}'s Section A under exam timing:` : "Take a model paper's Section A under exam timing:"}{" the full 30 questions in 60 minutes, or one section on its own. Questions appear"} in the same order as the printed paper. There is no negative marking, so answer every question. The test submits itself when time runs out.</p>
          {!SINGLE && <>
          <div className="row" style={{ marginTop: 10 }}><b>Paper</b></div>
          <div className="chips">
            {PAPERS.map((p) => <button key={p} className={`chip ${paper === p ? "on" : ""}`} onClick={() => setPaper(p)}>Paper {p}</button>)}
          </div>
          </>}
          <div className="row" style={{ marginTop: 10 }}><b>Scope</b></div>
          <div className="chips">
            {TEST_SCOPES.map((s) => <button key={s.id} className={`chip ${scopeId === s.id ? "on" : ""}`} onClick={() => setScopeId(s.id)}>{s.name} · {s.minutes} min</button>)}
          </div>
          <button className="primary" onClick={start}>Start {TEST_SCOPES.find((s) => s.id === scopeId).minutes}-minute test</button>
        </section>
        <section className="card muted small">Section B (coding, 45 min) is practised in the Coding Round tab.</section>
      </div>
    );
  }
  const bySection = scope.cats.map((cid) => {
    const qs = test.qs.filter((q) => q.cat === cid);
    return { c: CAT_BY_ID[cid], total: qs.length, right: qs.filter((q) => test.answers[q.id] === q.ans).length };
  });
  return (
    <div className="stack">
      <div className="testbar">
        <b>Paper {test.paper} · {scope.name}</b>
        <span className="muted small">{answeredCount}/{test.qs.length} answered</span>
        <span className="spacer" />
        {!test.submitted ? <span className={`clock ${left < 120 ? "low" : ""}`}>⏱ {fmtTime(left)}</span> : <span className={`score ${score / test.qs.length >= 0.7 ? "pass" : "fail"}`}>Score {score}/{test.qs.length} ({Math.round((score / test.qs.length) * 100)}%)</span>}
        {!test.submitted ? <button className="primary" onClick={() => setTest((t) => ({ ...t, submitted: true }))}>Submit</button> : <button className="primary" onClick={() => setTest(null)}>New test</button>}
      </div>
      {test.submitted && (
        <section className="grid4">
          {bySection.map(({ c, total, right }) => (
            <div key={c.id} className="statcard" style={{ borderTopColor: c.color }}>
              <div className="stat-name">{c.section} · {c.name}</div>
              <div className="stat-num">{right}<span>/{total} correct</span></div>
              <div className="bar"><div style={{ width: `${(right / total) * 100}%`, background: c.color }} /></div>
            </div>
          ))}
        </section>
      )}
      {test.qs.map((q, i) => (
        <QuestionCard key={q.id} q={q} index={i} showMeta={test.submitted}
          record={test.answers[q.id] !== undefined ? { choice: test.answers[q.id] } : undefined}
          lockReveal={!test.submitted}
          onAnswer={test.submitted ? null : (qq, c) => setTest((t) => ({ ...t, answers: { ...t.answers, [qq.id]: c } }))} />
      ))}
    </div>
  );
}

function Coding({ progress, onSolved }) {
  return (
    <div className="stack">
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Paper</th><th>Problem</th><th>Pattern</th><th>Difficulty</th><th>Status</th></tr></thead>
            <tbody>{CODING_ITEMS.map((p) => (
              <tr key={p.id}><td>{p.paper}</td><td>{p.q}</td><td>{p.pattern}</td><td><Pill {...DIFF_META[p.diff]}>{p.diff}</Pill></td><td>{progress[p.id] ? "Solved" : "—"}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h3>{SINGLE ? "Section B problem with solutions" : `All ${CODING_ITEMS.length} Section B problems with solutions`}</h3>
        <p className="muted small">{SINGLE ? "This is the paper's Section B question." : "Each problem is the Section B question of its model paper."} Every Java and Python solution was tested on the samples and extra test cases shown, and cross-checked against a brute-force reference on 300 random inputs. Allow 45 minutes per problem.</p>
      </section>
      {CODING_ITEMS.map((q) => <CodingCard key={q.id} q={q} solved={!!progress[q.id]} onToggle={onSolved} />)}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────────────────────
const TABS = [["bank", "Question Bank"], ["mock", "Mock Test"], ["coding", "Coding Round"]];

export default function HCLModelTestPaper5() {
  const [tab, setTab] = useState("bank");
  const [bankCat, setBankCat] = useState("all");
  const [bankPaper, setBankPaper] = useState("all");
  const [progress, setProgress] = useState(loadProgress);
  useEffect(() => saveProgress(progress), [progress]);

  const onAnswer = (q, choice) => setProgress((p) => (p[q.id] ? p : { ...p, [q.id]: { choice, correct: choice === q.ans } }));
  const onSolved = (q) => setProgress((p) => { const n = { ...p }; if (n[q.id]) delete n[q.id]; else n[q.id] = { solved: true, correct: true }; return n; });
  const onReset = () => { if (window.confirm("Clear all attempted answers?")) setProgress({}); };

  const stats = useMemo(() => Object.fromEntries(CATS.map((c) => {
    const ids = BANK.filter((q) => q.cat === c.id).map((q) => q.id);
    return [c.id, { done: ids.filter((id) => progress[id]).length, correct: ids.filter((id) => progress[id]?.correct).length }];
  })), [progress]);
  const totalDone = Object.values(stats).reduce((a, s) => a + s.done, 0);

  return (
    <div className="hcl-root">
      <style>{CSS}</style>
      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">HCL Campus Drive · Final Year B.Tech</div>
          <h1>HCL Model Test Paper 5</h1>
          <p>{MCQ_TOTAL} MCQs across Quantitative Aptitude, Logical Reasoning and Computer Fundamentals, plus {SINGLE ? "a Section B coding problem" : `${CODING_ITEMS.length} Section B coding problems`} with Java and Python solutions.</p>
          <div className="progress"><div style={{ width: `${(totalDone / BANK.length) * 100}%` }} /></div>
          <div className="small">{totalDone}/{BANK.length} attempted</div>
        </div>
        <nav className="tabs" role="tablist">
          {TABS.map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{t}</button>)}
        </nav>
      </header>
      <main className="main">
        {tab === "bank" && <Bank progress={progress} cat={bankCat} setCat={setBankCat} paper={bankPaper} setPaper={setBankPaper} onAnswer={onAnswer} onSolved={onSolved} onReset={onReset} />}
        {tab === "mock" && <MockTest />}
        {tab === "coding" && <Coding progress={progress} onSolved={onSolved} />}
      </main>
    </div>
  );
}

// ─── STYLES (scoped under .hcl-root) ────────────────────────────────────────
const CSS = `
.hcl-root{--ink:#0F172A;--muted:#64748B;--line:#E2E8F0;--bg:#F8FAFC;--card:#FFFFFF;--accent:#4F46E5;
  font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;line-height:1.5}
.hcl-root *{box-sizing:border-box}
.hcl-root h1,.hcl-root h3{margin:0}
.hero{background:linear-gradient(135deg,#0B1220 0%,#1E1B4B 60%,#312E81 100%);color:#fff}
.hero-inner{max-width:960px;margin:0 auto;padding:28px 16px 16px}
.eyebrow{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A5B4FC}
.hero h1{font-size:clamp(24px,4vw,32px);font-weight:800;margin:6px 0}
.hero p{color:#CBD5E1;margin:0 0 14px;max-width:640px;font-size:14px}
.progress{height:6px;background:rgba(255,255,255,.12);border-radius:9px;overflow:hidden;max-width:360px}
.progress>div{height:100%;background:linear-gradient(90deg,#818CF8,#22D3EE);transition:width .3s}
.small{font-size:12px}
.hero .small{color:#94A3B8;margin-top:4px}
.tabs{display:flex;gap:2px;max-width:960px;margin:0 auto;padding:0 8px;overflow-x:auto;scrollbar-width:none}
.tabs button{flex:0 0 auto;background:none;border:0;color:#94A3B8;padding:12px 14px;font-weight:600;font-size:14px;cursor:pointer;border-bottom:2px solid transparent}
.tabs button.on{color:#fff;border-bottom-color:#818CF8}
.main{max-width:960px;margin:0 auto;padding:18px 16px 48px}
.stack{display:flex;flex-direction:column;gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.card h3{font-size:16px;margin-bottom:8px}
.card p{margin:0 0 8px;font-size:14px}
.card ul{margin:0;padding-left:20px;font-size:14px}
.card li{margin:4px 0}
.card.warn{background:#FFFBEB;border-color:#FDE68A}
.note{background:#FEF2F2;border-radius:8px;padding:8px 10px;color:#991B1B;font-size:13px}
.muted{color:var(--muted)}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px;min-width:560px}
th,td{text-align:left;padding:8px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.fact{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
.fact-k{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.fact-v{font-weight:700;margin:2px 0 6px}
.fact-why{font-size:12px;color:var(--muted)}
.legend{display:flex;flex-direction:column;gap:6px;font-size:13px;margin-bottom:10px}
.statcard{background:var(--card);border:1px solid var(--line);border-top:3px solid;border-radius:12px;padding:12px}
.stat-icon{font-weight:800;font-size:18px}
.stat-name{font-size:13px;font-weight:600}
.stat-num{font-size:22px;font-weight:800}
.stat-num span{font-size:12px;font-weight:500;color:var(--muted);margin-left:2px}
.bar{height:5px;background:var(--line);border-radius:9px;overflow:hidden;margin:6px 0}
.bar>div{height:100%}
.sources{font-size:13px}
.sources a{color:var(--accent)}
.pill{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;white-space:nowrap}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer;color:var(--ink)}
.chip.on{background:var(--accent);border-color:var(--accent);color:#fff}
.filters{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}
.search{grid-column:1/-1;border:1px solid var(--line);border-radius:8px;padding:9px 12px;font-size:14px;width:100%}
.sel{display:flex;flex-direction:column;font-size:11px;color:var(--muted);gap:2px;min-width:0}
.sel select{border:1px solid var(--line);border-radius:8px;padding:7px 8px;font-size:13px;background:#fff;color:var(--ink);width:100%}
.row{display:flex;align-items:center;gap:8px;font-size:13px}
.spacer{flex:1}
.link{background:none;border:0;color:var(--accent);font-weight:600;cursor:pointer;font-size:13px;padding:0}
.primary{background:var(--accent);color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:700;cursor:pointer;margin-top:10px}
.testbar .primary{margin-top:0}
.qcard{background:var(--card);border:1px solid var(--line);border-left:4px solid;border-radius:12px;padding:14px 16px}
.qhead{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:12px}
.qid{font-weight:800}
.qtopic{color:var(--muted);font-weight:600}
.qtime{color:var(--muted)}
.qtext{white-space:pre-line;margin:10px 0;font-size:15px}
.passage{margin:10px 0;padding:10px 12px;background:#F1F5F9;border-left:3px solid #94A3B8;border-radius:6px;font-size:13.5px;color:#334155}
.code{position:relative;margin:8px 0}
.code pre{margin:0;background:#0F172A;color:#E2E8F0;border-radius:8px;padding:12px;overflow-x:auto;font-size:12.5px;line-height:1.5}
.code code{font-family:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.code-lang{position:absolute;top:6px;right:8px;font-size:10px;color:#94A3B8;font-weight:700}
.opts{list-style:none;padding:0;margin:0;display:grid;gap:6px}
.opt{width:100%;display:flex;gap:10px;align-items:flex-start;text-align:left;background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:14px;cursor:pointer;color:var(--ink)}
.opt:hover:not(:disabled){border-color:#A5B4FC;background:#EEF2FF}
.opt:disabled{cursor:default}
.optkey{font-weight:800;color:var(--muted);min-width:14px}
.opt.correct{background:#DCFCE7;border-color:#22C55E}
.opt.wrong{background:#FEE2E2;border-color:#EF4444}
.opt.picked{background:#EEF2FF;border-color:#6366F1}
.qfoot{margin-top:8px}
.sol{margin-top:8px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:10px 12px;font-size:14px}
.sol p{margin:4px 0 0}
.qmeta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px;padding-top:8px;border-top:1px dashed var(--line)}
.ref{font-size:11.5px;color:var(--muted)}
.testbar{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;box-shadow:0 4px 12px rgba(15,23,42,.06)}
.clock{font-weight:800;font-variant-numeric:tabular-nums}
.clock.low{color:#DC2626}
.score{font-weight:800}
.score.pass{color:#16A34A}.score.fail{color:#DC2626}
.timeline{display:flex;flex-direction:column;gap:12px}
.tl-item{display:grid;grid-template-columns:110px 1fr;gap:12px}
.tl-when{font-weight:800;color:var(--accent);padding-top:16px;text-align:right}
.ctitle{margin:8px 0 0;font-size:16px}
.io{display:grid;grid-template-columns:max-content 1fr;gap:4px 12px;font-size:13px;margin:6px 0 10px;white-space:pre-line}
.io dt{font-weight:700;color:var(--muted)}.io dd{margin:0}
.sample{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.sample pre{margin:0;background:#F1F5F9;border:1px solid var(--line);border-radius:6px;padding:8px;font-size:12.5px;overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.sample-h{font-size:11px;font-weight:700;color:var(--muted);margin-bottom:2px}
.sample-note{grid-column:1/-1;font-size:12px;color:var(--muted)}
.ctabs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px}
.ctabs button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:6px 10px;font-size:13px;font-weight:600;cursor:pointer;color:var(--ink)}
.ctabs button.on{background:var(--accent);border-color:var(--accent);color:#fff}
.navlink{font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:6px;padding:4px 0;text-decoration:underline;text-underline-offset:3px;text-align:left}
.solved{font-size:13px;font-weight:600;display:flex;gap:6px;align-items:center;cursor:pointer}
@media (max-width:720px){
  .sample{grid-template-columns:1fr}
  .grid4{grid-template-columns:repeat(2,1fr)}
  .grid2{grid-template-columns:1fr}
  .filters{grid-template-columns:repeat(2,1fr)}
  .tl-item{grid-template-columns:1fr;gap:4px}
  .tl-when{text-align:left;padding-top:0}
}
`;
