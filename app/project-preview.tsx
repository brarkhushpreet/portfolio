"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCheck, Hash, MapPin, Pause, Play, Plus, Radio, RotateCcw, Search, Send, ShieldCheck } from "lucide-react";
import { projectStories, type PreviewId } from "./project-stories";

export function ProjectPreview({ id, active }: { id: PreviewId; active: boolean }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);
  const story = projectStories[id];

  useEffect(() => {
    if (!active || !playing) return;
    const interval = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, 3));
    }, 3600);
    const stopWhenHidden = () => { if (document.hidden) setPlaying(false); };
    document.addEventListener("visibilitychange", stopWhenHidden);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  }, [active, playing, run]);

  useEffect(() => {
    if (!playing || step !== 3) return;
    const timer = window.setTimeout(() => setPlaying(false), 3600);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const go = (next: number) => { setPlaying(false); setStep(next); };
  const restart = () => { setPlaying(false); setStep(0); setRun((current) => current + 1); };
  const togglePlayback = () => {
    if (playing) { setPlaying(false); return; }
    setRun((current) => current + 1);
    setStep(0);
    setPlaying(true);
  };

  return (
    <section className={`project-preview preview-${id}`} aria-label={`${id === "echopass" ? "EchoPass" : id === "chat" ? "Nexus" : id === "movies" ? "Vanta" : "Blog"} interactive preview`}>
      <div className="preview-toolbar">
        <span>Interactive preview <small>Sample data</small></span>
        <div>
          <button type="button" onClick={restart} aria-label="Reset preview"><RotateCcw size={15} /></button>
          <button type="button" onClick={togglePlayback} aria-pressed={playing} className="preview-play">
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Watch walkthrough"}
          </button>
        </div>
      </div>
      <div className="preview-stage" data-playing={active && playing}>
        {id === "echopass" && <AttendancePreview key={run} step={step} go={go} />}
        {id === "chat" && <ChatPreview key={run} step={step} go={go} />}
        {id === "movies" && <MoviePreview key={run} step={step} go={go} />}
        {id === "blog" && <BlogPreview key={run} step={step} go={go} />}
      </div>
      <div className="preview-timeline" aria-label="Walkthrough steps">
        {story.steps.map(([title], index) => (
          <button type="button" key={title} onClick={() => go(index)} aria-current={step === index ? "step" : undefined}>
            <span className="preview-step-rule"><i className={playing && step === index ? "is-running" : ""} /></span>
            <span><small>0{index + 1}</small>{title}</span>
          </button>
        ))}
      </div>
      <p className="preview-explanation" aria-live="polite" key={step}>{story.steps[step][1]}</p>
      <p className="preview-disclaimer">A simplified, interactive demonstration of the product flow. Uses sample data; nothing is sent or saved to the project.</p>
    </section>
  );
}

type SceneProps = { step: number; go: (step: number) => void };

function AttendancePreview({ step, go }: SceneProps) {
  const [method, setMethod] = useState<"signal" | "location">("signal");
  const statuses = ["Ready to open", "Attendance is open", "Presence verified", "Session complete"];
  return (
    <div className="attendance-demo">
      <header className="demo-appbar"><span><Radio size={17} /> ClassPulse</span><span>Classroom / CS-201</span></header>
      <div className="attendance-layout">
        <div className="attendance-teacher">
          <span className="demo-eyebrow">Teacher’s workspace</span>
          <h4>Data Structures</h4>
          <p>One room. One check-in window.</p>
          <div className="attendance-methods" aria-label="Verification method">
            <button type="button" onClick={() => { setMethod("signal"); go(0); }} aria-pressed={method === "signal"}><Radio size={14} />Room signal</button>
            <button type="button" onClick={() => { setMethod("location"); go(0); }} aria-pressed={method === "location"}><MapPin size={14} />Location</button>
          </div>
          <div className="attendance-stats"><span><strong>{step >= 2 ? "1" : "0"}<small> / 1</small></strong>Sample check-in</span><span><strong>{step === 0 ? "—" : step === 3 ? "Ended" : "Open"}</strong>Session status</span></div>
          <button className="demo-primary" type="button" onClick={() => go(step === 3 ? 0 : Math.min(step + 1, 3))}>
            {step === 0 ? "Open attendance" : step === 1 ? "Simulate check-in" : step === 2 ? "End attendance" : "New session"}<ArrowRight size={15} />
          </button>
        </div>
        <div className={`attendance-student attendance-state-${step}`}>
          <div className="signal-diagram" aria-hidden="true">
            <i /><i /><i />
            <span>{step >= 2 ? <ShieldCheck size={31} /> : method === "signal" ? <Radio size={31} /> : <MapPin size={31} />}</span>
          </div>
          <span className="demo-eyebrow">{step === 3 ? "Session receipt" : "Student’s view"}</span>
          <h5 key={step}>{statuses[step]}</h5>
          <p>{step === 0 ? "Waiting for the teacher to begin." : step === 1 ? method === "signal" ? "Listening for the current room signal…" : "Checking presence inside the classroom area…" : step === 2 ? "This check-in belongs to the active session." : "1 check-in · CS-201 · ready for review"}</p>
          <span className="attendance-evidence">{step >= 2 ? <CheckCheck size={15} /> : <span className="signal-mini" />} {step >= 2 ? "Sample attendance recorded" : "Simulation · no sensors accessed"}</span>
        </div>
      </div>
    </div>
  );
}

function ChatPreview({ step, go }: SceneProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [sent, setSent] = useState("The classroom flow is ready for review.");
  const [room, setRoom] = useState("general");
  const send = (event: FormEvent) => {
    event.preventDefault();
    const message = (draft ?? "The classroom flow is ready for review.").trim();
    if (!message) return;
    setSent(message);
    setDraft("");
    go(2);
  };
  return (
    <div className="chat-demo">
      <header className="demo-appbar"><span><span className="nexus-monogram">N</span> Nexus</span><span>Demo workspace</span></header>
      <div className="chat-demo-layout">
        <nav aria-label="Demo rooms"><span>ROOMS</span>{["general", "design", "engineering"].map((name) => <button type="button" key={name} aria-pressed={room === name} onClick={() => { setRoom(name); go(0); }}><Hash size={15} />{name}</button>)}<div className="demo-member"><span>Y</span>You<small>Demo member</small></div></nav>
        <div className="chat-demo-room">
          <div className="chat-demo-heading"><span><Hash size={16} />{room}</span><small>{step === 3 ? "History available" : "Sample conversation"}</small></div>
          <div className="chat-demo-messages" aria-live="polite">
            <p className="chat-day">TODAY</p>
            <div className="demo-message"><span className="message-avatar">N</span><div><b>Workspace note <small>Sample message</small></b><p>{room === "general" ? "A place to share progress and keep the team in the loop." : room === "design" ? "Interface notes, prototypes, and feedback live here." : "Implementation notes and technical decisions live here."}</p></div></div>
            {step >= 2 && <div className="demo-message message-sent" key={sent}><span className="message-avatar message-avatar-you">Y</span><div><b>You <small>Just now</small></b><p>{sent}</p><span className="message-status"><CheckCheck size={14} />{step === 3 ? "In sample history" : "Delivered in preview"}</span></div></div>}
            {step === 1 && <div className="composer-hint"><span /><span /><span /><small>Composing a message</small></div>}
          </div>
          <form className="chat-demo-composer" onSubmit={send}><label className="sr-only" htmlFor="demo-message">Demo message</label><input id="demo-message" value={draft ?? (step === 1 ? "The classroom flow is ready for review." : "")} onChange={(event) => { setDraft(event.target.value); if (step !== 1) go(1); }} placeholder={`Message #${room}`} maxLength={160} autoComplete="off" /><button type="submit" aria-label="Send demo message"><Send size={17} /></button></form>
        </div>
      </div>
    </div>
  );
}

function MoviePreview({ step, go }: SceneProps) {
  const [manualSaved, setManualSaved] = useState<boolean | null>(null);
  const saved = manualSaved ?? step >= 2;
  return (
    <div className="movie-demo">
      <header className="demo-appbar"><span className="vanta-wordmark">VANTA</span><nav aria-label="Demo movie views"><button type="button" aria-pressed={step !== 3} onClick={() => go(saved ? 2 : 0)}>Discover</button><button type="button" aria-pressed={step === 3} onClick={() => { setManualSaved(saved); go(3); }}>My List <small>{saved ? "1" : "0"}</small></button></nav></header>
      <div className={`movie-demo-scene ${step === 3 ? "movie-demo-list" : ""}`}>
        <img src="/projects/movie-details.png" alt="" className="movie-demo-background" loading="lazy" />
        <div className="movie-demo-shade" />
        <div className="movie-demo-copy" key={step === 3 ? "list" : "title"}>
          <span className="demo-eyebrow">{step === 3 ? "Your collection" : step === 0 ? "Featured film" : "Inside the story"}</span>
          <h4>{step === 3 ? "My List" : "Inception"}</h4>
          {step === 3 ? <>
            {saved ? <button className="saved-movie" type="button" onClick={() => go(2)}><span>INCEPTION<small>2010 · Science fiction</small></span><ArrowRight size={22} /></button> : <p>Your list is empty. Find a title to save.</p>}
            <button type="button" className="demo-text-button" onClick={() => go(saved ? 2 : 0)}><ArrowLeft size={14} />Back to discovery</button>
          </> : <>
            <span className="movie-meta">2010 <span>Science fiction</span> 8.4 / 10</span>
            <p>{step === 0 ? "A journey into dreams, with everything at stake." : "A team ventures into layered dreams to plant an idea. Explore the title, then save it for another night."}</p>
            <div className="movie-demo-actions"><button className="demo-primary" type="button" onClick={() => { if (step === 0) go(1); else { setManualSaved(!saved); go(saved ? 1 : 2); } }}>{step === 0 ? <><Plus size={16} />Explore title</> : saved ? <><Check size={16} />In My List</> : <><Plus size={16} />Add to My List</>}</button>{saved && <button className="demo-text-button" type="button" onClick={() => go(3)}>View My List<ArrowRight size={14} /></button>}</div>
            {step >= 2 && saved && <span className="movie-saved-note"><CheckCheck size={14} />Saved in this preview</span>}
          </>}
        </div>
      </div>
    </div>
  );
}

const articles = [
  { topic: "JavaScript", title: "The JavaScript event loop beyond the usual diagram", excerpt: "Move beyond the stack-and-queue diagram by tracing what actually happens between a task, its microtasks, and the browser’s next rendering opportunity." },
  { topic: "Real-time", title: "WebSockets or Server-Sent Events? Choose from failure modes", excerpt: "WebSockets and SSE are easy to compare by features. The better choice appears when you compare how each behaves during disconnects, deploys, and load spikes." },
  { topic: "React", title: "React performance: measure renders before memoizing", excerpt: "Before adding memoization, identify whether the real problem is repeated rendering, expensive rendering, a costly commit, or something outside React entirely." },
];

function BlogPreview({ step, go }: SceneProps) {
  const [topic, setTopic] = useState<string | null>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [selected, setSelected] = useState(articles[1]);
  const activeTopic = topic ?? (step >= 1 ? "Real-time" : "All");
  const search = query ?? (step >= 2 ? "WebSockets" : "");
  const filtered = articles.filter((article) => (activeTopic === "All" || article.topic === activeTopic) && `${article.title} ${article.excerpt}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="blog-demo">
      <header className="demo-appbar"><span>Khushpreet’s notes<span className="blog-period">.</span></span><span>Software, explained.</span></header>
      <div className="blog-demo-page">
        {step === 3 ? <article className="blog-demo-reading">
          <button className="demo-text-button" type="button" onClick={() => go(0)}><ArrowLeft size={14} />Back to articles</button>
          <span className="demo-eyebrow">{selected.topic} / Article excerpt</span>
          <h4>{selected.title}</h4><p>{selected.excerpt}</p><div className="blog-reading-rule" /><span className="blog-reading-note">From the Developer Blog. Explore the screenshots below for the full reading interface.</span>
        </article> : <>
          <span className="demo-eyebrow">The archive</span><h4>Ideas worth understanding.</h4>
          <div className="blog-demo-search"><Search size={16} /><label className="sr-only" htmlFor="demo-article-search">Search demo articles</label><input id="demo-article-search" value={search} onChange={(event) => { setQuery(event.target.value); setTopic(activeTopic); go(2); }} placeholder="Find an idea…" autoComplete="off" /></div>
          <div className="blog-demo-filters" aria-label="Demo article topics">{["All", "JavaScript", "Real-time", "React"].map((name) => <button key={name} type="button" aria-pressed={activeTopic === name} onClick={() => { setTopic(name); setQuery(""); go(1); }}>{name}</button>)}</div>
          <div className="blog-demo-results" aria-live="polite">{filtered.length ? filtered.map((article) => <button type="button" key={article.title} onClick={() => { setSelected(article); go(3); }}><span><small>{article.topic}</small><strong>{article.title}</strong></span><ArrowRight size={16} /></button>) : <p>No matching notes. Try another topic or search.</p>}</div>
        </>}
      </div>
    </div>
  );
}
