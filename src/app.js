import { challenges, pointsEarned } from './challenges.js';
import { runChallenge } from './runner.js';
const STORAGE_KEY = 'studyforge-progress-v1';
const getStored = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; } catch { return {}; } };
const saved = getStored();
const validIds = new Set(challenges.map(c => c.id));
let completed = new Set(Array.isArray(saved.completed) ? saved.completed.filter(id => validIds.has(id)) : []);
let drafts = saved.drafts && typeof saved.drafts === 'object' && !Array.isArray(saved.drafts) ? Object.fromEntries(Object.entries(saved.drafts).filter(([id, code]) => validIds.has(id) && typeof code === 'string' && code.length < 100000)) : {};
let selectedId = challenges.some(c=>c.id === saved.selectedId) ? saved.selectedId : challenges[0].id;
let filter = 'All';
let topicFilter = 'All';
let query = '';
let running = false;
let lastResult = null;
let showHint = false;
const $ = selector => document.querySelector(selector);
function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({completed:[...completed],drafts,selectedId})); } catch {} }
function safe(text) {return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function current() {return challenges.find(c=>c.id===selectedId);}
function header() {
 const done = completed.size, total = challenges.length;
 return `<header class="top"><a href="#" class="brand" aria-label="StudyForge home"><span class="brandmark">{ }</span><span>study<span class="brand-accent">forge</span></span></a><div class="topright"><span class="toplabel">YOUR LEARNING SPACE</span><span class="avatar">SF</span></div></header>
 <section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="dot"></span> FREE • OPEN SOURCE • MADE FOR LEARNERS</div><h1>Small challenges.<br><em>Big breakthroughs.</em></h1><p>Get better at JavaScript one problem at a time. Write code, run tests, and see how far you've come.</p><a class="hero-link" href="#workspace">Start practicing <span>↗</span></a></div><div class="hero-art" aria-hidden="true"><div class="window"><div class="windowbar"><span></span><span></span><span></span><small>your-next-breakthrough.js</small></div><div class="windowcode"><div><i>01</i><span class="purple">function</span> <span class="blue">keepLearning</span>() {</div><div><i>02</i> &nbsp; <span class="purple">const</span> progress = <span class="green">"every day"</span>;</div><div><i>03</i> &nbsp; <span class="purple">return</span> <span class="yellow">"you've got this!"</span>;</div><div><i>04</i>}</div></div><div class="float-chip">✦ Learn by doing</div></div></section>
 <section class="stats" aria-label="Your progress"><div><span class="stat-icon">◈</span><div><strong>${done}<span class="muted"> / ${total}</span></strong><small>Challenges completed</small></div></div><div><span class="stat-icon">✧</span><div><strong>${pointsEarned([...completed])}</strong><small>Points earned</small></div></div><div><span class="stat-icon">◎</span><div><strong>${Math.round(done/total*100)}%</strong><small>Course progress</small></div></div><div class="stat-progress"><div class="progress-track"><div style="width:${done/total*100}%"></div></div><small>Keep going. Every solution counts.</small></div></section>`;
}
function list() {
 const items = challenges.filter(c=>(filter==='All'||c.level===filter) && (topicFilter==='All'||c.topic===topicFilter) && `${c.title} ${c.topic}`.toLowerCase().includes(query.toLowerCase()));
 return `<aside class="sidebar"><div class="sidebar-head"><div><h2>Challenges</h2><p>Pick a problem to solve</p></div><span class="count">${challenges.length}</span></div><label class="searchbox"><span>⌕</span><input id="search" placeholder="Search challenges..." aria-label="Search challenges" value="${safe(query)}"/></label><div class="filters" aria-label="Filter by difficulty">${['All','Beginner','Intermediate','Advanced'].map(f=>`<button class="filter ${filter===f?'active':''}" data-filter="${f}">${f}</button>`).join('')}</div><label class="topic-label" for="topic-filter">Learning path</label><select id="topic-filter" aria-label="Select learning path">${['All',...new Set(challenges.map(c=>c.topic))].map(t=>`<option value="${safe(t)}" ${topicFilter===t?'selected':''}>${t==='All'?'All learning paths':t}</option>`).join('')}</select><div class="challenge-list">${items.length?items.map(c=>`<button data-select="${c.id}" class="challenge ${c.id===selectedId?'selected':''}"><span class="challenge-check ${completed.has(c.id)?'done':''}">${completed.has(c.id)?'✓':'›'}</span><span class="challenge-info"><strong>${safe(c.title)}</strong><span>${safe(c.topic)} <span class="sep">·</span> <span class="level ${c.level.toLowerCase()}">${c.level}</span></span></span><span class="pts">+${c.points}</span></button>`).join(''):'<p class="empty">No challenges match your search.</p>'}</div><div class="sidebar-foot"><p>Your progress stays on this device.</p><button id="export-progress" class="progress-action">Export progress</button><button id="import-progress" class="progress-action">Import progress</button><input type="file" id="progress-file" accept="application/json,.json" hidden><p id="import-status" role="status" aria-live="polite"></p></div></aside>`;
}
function resultHTML() {
 if (!lastResult) return '<div class="result-empty">Run your code to see test results here.<span>⌘ Enter to run</span></div>';
 if (lastResult.error) return `<div class="result-error">⚠ ${safe(lastResult.error)}</div>`;
 const pass = lastResult.results.filter(r=>r.passed).length;
 return `<div class="result-heading"><strong class="${pass===lastResult.results.length?'success':'warning'}">${pass===lastResult.results.length?'✓ All tests passed!':'◌ Keep trying!'}</strong><span>${pass} of ${lastResult.results.length} passed</span></div><div class="test-grid">${lastResult.results.map(r=>`<div class="test ${r.passed?'pass':'fail'}"><span>${r.passed?'✓':'×'}</span><div><strong>Test ${r.number}</strong>${r.passed?'':`<small>Expected: ${safe(r.expected)}<br>Received: ${safe(r.actual)}</small>`}</div></div>`).join('')}</div>`;
}
function workspace() {
 const c=current(); const code=drafts[c.id]??c.starter;
 return `<section class="workspace" id="workspace"><div class="workspace-top"><div class="workspace-label"><span class="lesson-icon">⌘</span> JAVASCRIPT PRACTICE <span class="slash">/</span> ${safe(c.topic.toUpperCase())}</div><span class="workspace-nr">CHALLENGE ${String(challenges.indexOf(c)+1).padStart(2,'0')} / ${challenges.length}</span></div><div class="problem"><div class="problem-header"><div><span class="difficulty ${c.level.toLowerCase()}">${c.level}</span> <span class="point-label">✦ ${c.points} points</span><h2>${safe(c.title)}</h2></div><span class="completion-tag">${completed.has(c.id)?'✓ Completed':'○ Not completed'}</span></div><p>${safe(c.description)}</p><div class="example"><span>EXAMPLE</span><code>${safe(c.example)}</code></div><button class="hint-toggle" id="hint-toggle">${showHint?'▾ Hide hint':'✧ Need a hint?'}</button>${showHint?`<p class="hint">${safe(c.hint)}</p>`:''}</div><div class="editor-header"><span><span class="green-dot"></span> solution.js</span><span>JavaScript <span class="editor-status">● Ready</span></span></div><div class="editor-wrap"><div class="line-numbers" id="line-numbers" aria-hidden="true"></div><textarea id="code" aria-label="Code editor" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off">${safe(code)}</textarea></div><div class="editor-actions"><button class="reset" id="reset">↺ Reset code</button><button class="run" id="run" ${running?'disabled':''}>${running?'Running…':'▶ Run tests'}</button></div><div class="results"><div class="results-title"><strong>Test results</strong><span>INSTANT FEEDBACK</span></div>${resultHTML()}</div><div class="workspace-bottom"><span>Made for curious minds, one line at a time.</span><button id="next">Next challenge →</button></div></section>`;
}
function render(preserveFocus = false) {
 const active=preserveFocus && document.activeElement?.id==='search';
 const pos=active?document.activeElement.selectionStart:0;
 $('#app').innerHTML=header()+`<main><div class="section-heading"><span>YOUR PRACTICE SPACE</span><h2>Learn it. Code it. <em>Own it.</em></h2><p>No pressure, no shortcuts. Just you, your code, and the next step forward.</p></div><div class="layout">${list()}${workspace()}</div></main><footer><strong>study<span>forge</span></strong><small>Open source learning, built for everyone. © ${new Date().getFullYear()} StudyForge contributors · MIT License</small><a href="https://github.com/Dhanushrajashekar/studyforge" target="_blank" rel="noreferrer">View source ↗</a></footer>`;
 attach(); if(active) { $('#search').focus(); $('#search').setSelectionRange(pos,pos); }
}
function exportProgress() {
 const data = JSON.stringify({format:'studyforge-progress',version:1,completed:[...completed],drafts,selectedId},null,2);
 const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download='studyforge-progress.json';link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importProgress(event) {
 const file=event.target.files?.[0];if(!file)return;
 try {
  if(file.size>1_000_000)throw new Error('The progress file must be smaller than 1 MB.');
  const data=JSON.parse(await file.text());
  if(data.format!=='studyforge-progress'||data.version!==1||!Array.isArray(data.completed)||!data.drafts||typeof data.drafts!=='object'||Array.isArray(data.drafts))throw new Error('Not a valid StudyForge progress file.');
  const ids=new Set(challenges.map(c=>c.id));
  completed=new Set(data.completed.filter(x=>typeof x==='string'&&ids.has(x)));
  drafts=Object.fromEntries(Object.entries(data.drafts).filter(([k,v])=>ids.has(k)&&typeof v==='string'&&v.length<100_000));
  selectedId=ids.has(data.selectedId)?data.selectedId:challenges[0].id;
  lastResult=null;showHint=false;save();render();
  $('#import-status').textContent='Progress imported successfully.';
 }catch(e){$('#import-status').textContent=e.message||'Could not import progress.';}
 event.target.value='';
}
function updateLines() {const code=$('#code'); const n=(code.value.match(/\n/g)||[]).length+1; $('#line-numbers').innerHTML=Array.from({length:Math.max(9,n)},(_,i)=>i+1).join('<br>');}
function attach() {
 document.querySelectorAll('[data-select]').forEach(btn=>btn.addEventListener('click',()=>{selectedId=btn.dataset.select;lastResult=null;showHint=false;save();render();}));
 document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;render();}));
 $('#topic-filter').addEventListener('change',e=>{topicFilter=e.target.value;render();});
 $('#export-progress').addEventListener('click',exportProgress);
 $('#import-progress').addEventListener('click',()=>$('#progress-file').click());
 $('#progress-file').addEventListener('change',importProgress);
 $('#search').addEventListener('input',e=>{query=e.target.value;render(true);});
 $('#hint-toggle').addEventListener('click',()=>{showHint=!showHint;render();});
 $('#code').addEventListener('input',e=>{drafts[selectedId]=e.target.value;save();updateLines();});
 $('#code').addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();let t=e.target,s=t.selectionStart;t.setRangeText('  ',s,t.selectionEnd,'end');t.dispatchEvent(new Event('input'));}if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();execute();}});
 $('#reset').addEventListener('click',()=>{drafts[selectedId]=current().starter;lastResult=null;save();render();});
 $('#run').addEventListener('click',execute);
 $('#next').addEventListener('click',()=>{selectedId=challenges[(challenges.findIndex(c=>c.id===selectedId)+1)%challenges.length].id;lastResult=null;showHint=false;save();render();location.hash='workspace';});
 updateLines();
}
async function execute() {
 if(running)return;
 const c=current(),code=$('#code').value;
 drafts[c.id]=code;save();running=true;render();
 const result=await runChallenge(c,code);
 running=false;
 if(selectedId!==c.id) return;
 lastResult=result;
 if(!result.error&&result.results.length&&result.results.every(r=>r.passed)) completed.add(c.id);
 save();render();
}
render();
