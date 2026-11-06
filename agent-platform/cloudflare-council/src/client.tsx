import { useState } from "react";
import { createRoot } from "react-dom/client";
import { useAgent } from "agents/react";
import type { CouncilAgent } from "./server";
import "./styles.css";

type Entry = { id: string; speaker: string; stage: string; text: string; createdAt: number };
type State = { status: "idle" | "running" | "complete" | "error"; task: string; entries: Entry[]; finalAnswer: string; updatedAt: number };

function App() {
  const [state, setState] = useState<State>({ status: "idle", task: "", entries: [], finalAnswer: "", updatedAt: Date.now() });
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const agent = useAgent<CouncilAgent, State>({ agent: "CouncilAgent", name: "owner", onStateUpdate: setState });

  async function submit() {
    if (!task.trim() || state.status === "running") return;
    setError("");
    try { await agent.stub.runCouncil(task.trim()); setTask(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось выполнить задачу."); }
  }
  async function clear() {
    setError("");
    try { await agent.stub.clearHistory(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Не удалось очистить историю."); }
  }

  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">N</span><div><b>НАДЁЖНЫЙ ПАРТНЁР</b><small>COUNCIL · AI WORKSPACE</small></div></div><span className={"status status-" + state.status}><i />{state.status === "running" ? "РАБОТАЕТ" : state.status === "complete" ? "ГОТОВО" : state.status === "error" ? "ОШИБКА" : "НА СВЯЗИ"}</span></header>
    <section className="hero"><div className="eyebrow">ОДНА ЗАДАЧА · НЕСКОЛЬКО ВЗГЛЯДОВ · ОДИН РЕЗУЛЬТАТ</div><h1>Думаем вместе.<br /><em>Делаем до конца.</em></h1><p>Архитектор, критик и арбитр разбирают задачу в общем контексте. Ты получаешь единый вывод, а не три разрозненных ответа.</p></section>
    <section className="workspace">
      <div className="workspace-head"><div><span className="eyebrow">РАБОЧАЯ КОМНАТА</span><h2>Совет агентов</h2></div><button className="quiet" onClick={clear} disabled={state.status === "running" || state.entries.length === 0}>Очистить</button></div>
      {state.entries.length === 0 ? <div className="empty"><div className="orbit">✳</div><b>Комната пока пуста</b><p>Опиши задачу. Совет начнёт с независимого анализа, проведёт раунд возражений и соберёт единый план.</p></div> :
        <div className="transcript">{state.entries.map(item => <article className={"entry entry-" + item.speaker} key={item.id}><div className="entry-meta"><b>{item.speaker === "user" ? "ТЫ" : item.speaker === "architect" ? "АРХИТЕКТОР" : item.speaker === "critic" ? "КРИТИК" : item.speaker === "verifier" ? "АРБИТР" : item.speaker === "synthesis" ? "ЕДИНЫЙ ИТОГ" : "СИСТЕМА"}</b><span>{item.stage}</span></div><p>{item.text}</p></article>)}{state.status === "running" && <div className="thinking"><span /><span /><span /> Совет анализирует задачу и сверяет выводы…</div>}</div>}
      {error && <div className="error">{error}</div>}
      <div className="composer"><textarea value={task} onChange={event => setTask(event.target.value)} placeholder="Опиши, что нужно исследовать, спроектировать или сделать…" rows={3} maxLength={8000} /><div className="composer-foot"><span>{task.length}/8000 · История сохраняется в комнате</span><button className="send" onClick={submit} disabled={!task.trim() || state.status === "running"}>{state.status === "running" ? "Работаем…" : "Запустить совет"} <span>↗</span></button></div></div>
    </section>
    <footer>ПРОТОТИП · CLOUDFLARE DURABLE OBJECTS · SQLITE MEMORY · WORKERS AI</footer>
  </main>;
}
createRoot(document.getElementById("root")!).render(<App />);
