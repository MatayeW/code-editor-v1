import { useState } from "react";
import Editor from "@monaco-editor/react";
import questions from "./questions";
import "./App.css";

// custom Monaco theme that matches the style guide colours
function setupTheme(monaco) {
  monaco.editor.defineTheme("indigo-night", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8c89a6" },
      { token: "keyword", foreground: "a79cff" },
      { token: "string", foreground: "e8b95e" },
      { token: "number", foreground: "f06ba5" },
    ],
    colors: {
      "editor.background": "#19192d",
      "editor.lineHighlightBackground": "#242237",
      "editorLineNumber.foreground": "#5e5b78",
      "editorCursor.foreground": "#a79cff",
      "editor.selectionBackground": "#46447a",
    },
  });
}

// re-measure character widths once DM Mono has loaded
function handleMount(editor, monaco) {
  document.fonts.load('14px "DM Mono"').then(() => {
    monaco.editor.remeasureFonts();
  });
}

// turn any value into text we can show on screen
function show(value) {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

// [5] becomes "5", [[1, 2]] becomes "[1,2]"
function formatInput(input) {
  return input.map((arg) => show(arg)).join(", ");
}

// run the user's function against a list of tests
function runTests(code, functionName, tests) {
  return tests.map((test) => {
    try {
      const userFunction = new Function(
        code + "\nreturn " + functionName + ";"
      )();
      // copy the input so the user's code can't change our test data
      const input = JSON.parse(JSON.stringify(test.input));
      const got = userFunction(...input);
      const passed = JSON.stringify(got) === JSON.stringify(test.expected);
      return { passed: passed, shown: show(got) };
    } catch (error) {
      return { passed: false, shown: "Error: " + error.message };
    }
  });
}

function App() {
  const [current, setCurrent] = useState(0);
  const [codes, setCodes] = useState(questions.map((q) => q.starterCode));
  const [consoleLines, setConsoleLines] = useState([]);
  const [visibleResults, setVisibleResults] = useState(null);
  const [hiddenResults, setHiddenResults] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const question = questions[current];
  const code = codes[current];

  const visiblePassed = visibleResults
    ? visibleResults.filter((r) => r.passed).length
    : 0;
  const hiddenPassed = hiddenResults
    ? hiddenResults.filter((r) => r.passed).length
    : 0;
  const totalTests = question.visibleTests.length + question.hiddenTests.length;
  const totalPassed = visiblePassed + hiddenPassed;

  function goTo(index) {
    setCurrent(index);
    setConsoleLines([]);
    setVisibleResults(null);
    setHiddenResults(null);
    setShowHint(false);
  }

  function handleCodeChange(value) {
    const newCodes = [...codes];
    newCodes[current] = value;
    setCodes(newCodes);
  }

  function resetCode() {
    const newCodes = [...codes];
    newCodes[current] = question.starterCode;
    setCodes(newCodes);
  }

  // Run: just run the code and show anything it prints
  function runCode() {
    const lines = [];
    const originalLog = console.log;

    console.log = (...args) =>
      lines.push(
        args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ")
      );

    try {
      new Function(code)();
    } catch (error) {
      lines.push("Error: " + error.message);
    }

    console.log = originalLog;
    setConsoleLines(lines.length > 0 ? lines : ["(no output)"]);
  }

  // Run tests: check the visible tests only
  function runVisibleTests() {
    setVisibleResults(runTests(code, question.functionName, question.visibleTests));
  }

  // Submit: check the visible tests AND the hidden tests
  function submit() {
    setVisibleResults(runTests(code, question.functionName, question.visibleTests));
    setHiddenResults(runTests(code, question.functionName, question.hiddenTests));
  }

  return (
    <div>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">JS</span>
          <span>
            Code<span className="brand-accent">Pad</span>
          </span>
        </div>
      </header>

      <main className="page">
        {/* question */}
        <div>
          <p className="breadcrumb">Practice / {question.concept}</p>
          <div className="title-row">
            <h1>{question.title}</h1>
            <span className="tag">{question.concept}</span>
            <span className={"tag diff-" + question.difficulty}>
              {question.difficulty}
            </span>
            <span className="xp">+{question.xp} XP</span>
          </div>
          <p className="description">{question.description}</p>
        </div>

        {/* previous / next */}
        <div className="card nav-card">
          <button
            className="btn btn-ghost"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ← Previous
          </button>
          <span className="counter">
            Question {current + 1} <span>of {questions.length}</span>
          </span>
          <button
            className="btn btn-ghost next"
            onClick={() => goTo(current + 1)}
            disabled={current === questions.length - 1}
          >
            Next →
          </button>
        </div>

        <div className="layout">
          {/* editor */}
          <div className="editor-column">
            <div className="card">
              <div className="editor-header">
                <span className="code file-name">{question.functionName}.js</span>
                <div className="editor-actions">
                  <button className="btn btn-text" onClick={resetCode}>
                    Reset
                  </button>
                  <button className="btn btn-ghost" onClick={runCode}>
                    Run ▶
                  </button>
                  <button className="btn btn-ghost" onClick={runVisibleTests}>
                    Run tests
                  </button>
                  <button className="btn btn-primary" onClick={submit}>
                    Submit
                  </button>
                </div>
              </div>

              <div className="editor-body">
                <Editor
                  height="320px"
                  theme="indigo-night"
                  defaultLanguage="javascript"
                  beforeMount={setupTheme}
                  onMount={handleMount}
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 14,
                    minimap: { enabled: false },
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>

              <div className="console">
                <p className="eyebrow">Console</p>
                <div className="console-lines code">
                  {consoleLines.length === 0 ? (
                    <div>Press Run to see what your code prints</div>
                  ) : (
                    consoleLines.map((line, i) => <div key={i}>&gt; {line}</div>)
                  )}
                </div>
              </div>
            </div>

            {hiddenResults ? (
              <p
                className={
                  "submit-status " + (totalPassed === totalTests ? "pass" : "")
                }
              >
                {totalPassed === totalTests
                  ? "All " + totalTests + " tests passed. Nice work!"
                  : totalPassed +
                    "/" +
                    totalTests +
                    " tests passed. Check the failed tests and try again."}
              </p>
            ) : (
              <p className="submit-status">
                Run tests checks the visible tests. Submit also checks the
                hidden ones.
              </p>
            )}
          </div>

          {/* test results + hint */}
          <div className="side-column">
            <div className="card">
              <div className="side-heading">
                <h2>Test Results</h2>
                <span>
                  {visibleResults
                    ? visiblePassed + "/" + question.visibleTests.length + " passed"
                    : question.visibleTests.length + " tests"}
                </span>
              </div>

              <ul className="test-list">
                {question.visibleTests.map((test, i) => {
                  const result = visibleResults ? visibleResults[i] : null;
                  return (
                    <li className="test-item" key={i}>
                      <span
                        className={
                          "test-mark " +
                          (result ? (result.passed ? "pass" : "fail") : "")
                        }
                      >
                        {result ? (result.passed ? "✓" : "✕") : "○"}
                      </span>
                      <div>
                        <span className="code">
                          {question.functionName}({formatInput(test.input)})
                        </span>
                        <span className="test-detail">
                          Expected {show(test.expected)}
                          {result && !result.passed && ", got " + result.shown}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="side-heading">
                <h2>Hidden tests</h2>
                <span>
                  {hiddenResults
                    ? hiddenPassed + "/" + question.hiddenTests.length + " passed"
                    : question.hiddenTests.length + " tests"}
                </span>
              </div>

              {hiddenResults ? (
                <ul className="test-list">
                  {hiddenResults.map((result, i) => (
                    <li className="test-item" key={i}>
                      <span
                        className={"test-mark " + (result.passed ? "pass" : "fail")}
                      >
                        {result.passed ? "✓" : "✕"}
                      </span>
                      <span>Hidden test {i + 1}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="hidden-note">
                  Hidden tests run when you press Submit. You won't see their
                  inputs.
                </p>
              )}
            </div>

            <div className="card">
              <div className="side-heading">
                <h2>Hint</h2>
              </div>
              <div className="hint-body">
                {showHint ? (
                  <p>{question.hint}</p>
                ) : (
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowHint(true)}
                  >
                    Show hint
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;