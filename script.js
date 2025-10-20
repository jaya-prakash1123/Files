// ---------- CONFIG: paste your Firebase config here ----------
const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};
// ----------------------------------------------------------------

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();


// Access keys -> directories
const KEYS = { "ECHO":"echo", "XYLUS":"xylus" };
let currentDir = null; // 'echo' or 'xylus' or 'bin'
const BIN_DIR = 'bin';

// DOM
const lockScreen = document.getElementById('lock-screen');
const dashboard = document.getElementById('dashboard');
const unlockBtn = document.getElementById('unlock-btn');
const passInput = document.getElementById('pass-input');
const lockMsg = document.getElementById('lock-msg');

const sidebarItems = document.querySelectorAll('.sidebar-item');
const views = { overview: document.getElementById('overview-view'), dir: document.getElementById('dir-view'), recent: document.getElementById('recent-view'), bin: document.getElementById('bin-view') };
const cards = document.getElementById('cards');
const fileList = document.getElementById('file-list');
const recentList = document.getElementById('recent-list');
const binList = document.getElementById('bin-list');

const addBtn = document.getElementById('add-btn');
const singlePicker = document.getElementById('single-file-picker');
const folderPicker = document.getElementById('file-picker');

const threeMenu = document.getElementById('three-dot-menu');
let menuTarget = null;

const searchInput = document.getElementById('search');
const quota = document.getElementById('quota');

// helpers
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function fmtSize(n){ if(!n) return '0 B'; if(n<1024) return n+' B'; if(n<1024*1024) return (n/1024).toFixed(1)+' KB'; if(n<1024*1024*1024) return (n/1024/1024).toFixed(1)+' MB'; return (n/1024/1024/1024).toFixed(1)+' GB'; }

// UNLOCK
unlockBtn.addEventListener('click', async ()=>{
  const v = (passInput.value||'').trim();
  if(!v) { lockMsg.textContent = 'enter key'; return; }
  const dir = KEYS[v];
  if(!dir){ lockMsg.textContent = 'invalid key'; return; }
  currentDir = dir;
  lockScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
  await initDashboard();
});

// Sidebar nav
sidebarItems.forEach(s => {
  s.addEventListener('click', ()=>{
    sidebarItems.forEach(x=>x.classList.remove('selected'));
    s.classList.add('selected');
    const view = s.dataset.view;
    for(const k in views) views[k].classList.add('hidden');
    views[view].classList.remove('hidden');
    if(view === 'dir') renderFiles(currentDir);
    if(view === 'recent') renderRecent();
    if(view === 'bin') renderBin();
  });
});

// init dashboard: show cards (counts by type)
async function initDashboard(){
  await renderCards();
  renderFiles(currentDir);
  renderRecent();
  renderBin();
  updateQuota();
}

// render top cards (storage by type sample)
async function renderCards(){
  // simple stats from firestore
  const snap = await db.collection('files').get();
  const data = {};
  snap.forEach(d => {
    const it = d.data();
    if(it.folder === BIN_DIR) return;
    const ext = (it.name.split('.').pop()||'file').toLowerCase();
    const key = ext.match(/(jpg|png|jpeg|gif)$/) ? 'Photos' : (ext==='pdf' ? 'Docs' : 'Other');
    data[key] = (data[key]||0) + (it.size || 0);
  });
  cards.innerHTML = '';
  ['Photos','Docs','Other'].forEach(k=>{
    const el = document.createElement('div'); el.className='card';
    el.innerHTML = `<strong>${k}</strong><div style="font-size:12px;color:var(--muted)">${fmtSize(data[k]||0)}</div>`;
    cards.appendChild(el);
  });
}

// RENDER FILES IN CURRENT DIR
async function renderFiles(dir){
  document.getElementById('dir-title').textContent = `Directory: ${dir.toUpperCase()}`;
  fileList.innerHTML = '<div class="muted">Loading...</div>';
  const q = await db.collection('files').where('folder','==',dir).orderBy('createdAt','desc').get();
  const arr = q.docs.map(d=>({id:d.id,...d.data()}));
  fileList.innerHTML = '';
  if(arr.length===0){ fileList.innerHTML = '<div class="muted">No files</div>'; return; }
  arr.forEach(it => {
    const row = document.createElement('div'); row.className='file-row';
    row.innerHTML = `<div class="file-meta"><div class="file-name">${it.name}</div><div class="muted">${fmtSize(it.size)}</div></div>
      <div><button class="three-dot" data-id="${it.id}">⋮</button></div>`;
    fileList.appendChild(row);
    row.querySelector('.three-dot').addEventListener('click',(e)=>{
      menuTarget = it;
      showMenu(e.target);
    });
    row.addEventListener('dblclick', ()=> openFile(it));
  });
}

// RECENT
async function renderRecent(){
  recentList.innerHTML = '';
  const q = await db.collection('files').orderBy('createdAt','desc').limit(8).get();
  q.forEach(d=>{
    const it = d.data();
    const row = document.createElement('div'); row.className='file-row';
    row.innerHTML = `<div class="file-meta"><div class="file-name">${it.name}</div><div class="muted">${fmtSize(it.size)}</div></div>
      <div><button onclick="void(0)">⋮</button></div>`;
    recentList.appendChild(row);
  });
}

// BIN
async function renderBin(){
  binList.innerHTML = '';
  const q = await db.collection('files').where('folder','==',BIN_DIR).orderBy('createdAt','desc').get();
  q.forEach(d=>{
    const it = d.data();
    const row = document.createElement('div'); row.className='file-row';
    row.innerHTML = `<div class="file-meta"><div class="file-name">${it.name}</div><div class="muted">${fmtSize(it.size)}</div></div>
      <div><button onclick="restore('${d.id}')">Restore</button> <button onclick="permaDelete('${d.id}')">Delete</button></div>`;
    binList.appendChild(row);
  });
}

// show 3-dot menu
function showMenu(btn){
  threeMenu.style.left = (btn.getBoundingClientRect().left - 200) + 'px';
  threeMenu.style.top = (btn.getBoundingClientRect().top + 18) + 'px';
  threeMenu.classList.remove('hidden');
}
document.addEventListener('click', e=>{
  if(!threeMenu.contains(e.target) && !e.target.classList.contains('three-dot')) threeMenu.classList.add('hidden');
});

// menu actions
threeMenu.querySelectorAll('button').forEach(b=>{
  b.addEventListener('click', async ()=>{
    threeMenu.classList.add('hidden');
    const action = b.dataset.action;
    if(!menuTarget) return;
    if(action==='open') openFile(menuTarget);
    if(action==='rename') renameFile(menuTarget);
    if(action==='move') moveFile(menuTarget);
    if(action==='copy') copyFile(menuTarget);
    if(action==='compress') compressFolder(menuTarget);
    if(action==='delete') deleteToBin(menuTarget);
    if(action==='info') infoFile(menuTarget);
  });
});

// OPEN / DOWNLOAD
async function openFile(it){
  const ref = storage.ref(it.storagePath);
  const url = await ref.getDownloadURL();
  window.open(url, '_blank');
}

// RENAME
async function renameFile(it){
  const n = prompt('New name', it.name);
  if(!n || n===it.name) return;
  await db.collection('files').doc(it.id).update({ name:n });
  renderFiles(currentDir);
}

// MOVE: change folder value in firestore; storage path stays the same but we mark folder field
async function moveFile(it){
  const target = prompt('Move to folder (echo/xylus/bin)', currentDir===KEYS.ECHO?KEYS.XYLUS:KEYS.ECHO);
  if(!target) return;
  await db.collection('files').doc(it.id).update({ folder: target });
  renderFiles(currentDir);
}

// COPY: duplicates file in storage and metadata
async function copyFile(it){
  const ref = storage.ref(it.storagePath);
  const url = await ref.getDownloadURL();
  const response = await fetch(url);
  const blob = await response.blob();
  const newPath = `${currentDir}/${uid()}-${it.name}`;
  const newRef = storage.ref(newPath);
  await newRef.put(blob);
  const meta = { name: it.name, folder: currentDir, storagePath: newPath, size: it.size, createdAt: Date.now() };
  await db.collection('files').add(meta);
  renderFiles(currentDir);
}

// COMPRESS: if passed a file, just zip single file; if folder passed, compress all files in same folder
async function compressFolder(it){
  const folderName = it.folder;
  const snap = await db.collection('files').where('folder','==',folderName).get();
  if(snap.empty){ alert('No files to compress'); return; }
  const zip = new JSZip();
  const promises = [];
  snap.forEach(d=>{
    const f = d.data();
    promises.push((async ()=>{
      const u = await storage.ref(f.storagePath).getDownloadURL();
      const res = await fetch(u);
      const blob = await res.blob();
      zip.file(f.name, blob);
    })());
  });
  await Promise.all(promises);
  const content = await zip.generateAsync({type:'blob'});
  const zipName = `${folderName}-${Date.now()}.zip`;
  const zipPath = `${currentDir}/${uid()}-${zipName}`;
  await storage.ref(zipPath).put(content);
  const meta = { name: zipName, folder: currentDir, storagePath: zipPath, size: content.size, createdAt: Date.now() };
  await db.collection('files').add(meta);
  alert('Folder compressed and uploaded as '+zipName);
  renderFiles(currentDir);
}

// DELETE -> move to bin (update folder)
async function deleteToBin(it){
  await db.collection('files').doc(it.id).update({ folder: BIN_DIR });
  renderFiles(currentDir);
  renderBin();
}

// Restore and perma delete helpers
async function restore(id){
  const doc = await db.collection('files').doc(id).get();
  const it = doc.data();
  await db.collection('files').doc(id).update({ folder: (currentDir||KEYS.ECHO) });
  renderBin();
}
async function permaDelete(id){
  const doc = await db.collection('files').doc(id).get();
  const it = doc.data();
  await storage.ref(it.storagePath).delete().catch(()=>{});
  await db.collection('files').doc(id).delete();
  renderBin();
}

// UPLOAD FLOW
addBtn.addEventListener('click', ()=> {
  // open normal file picker
  singlePicker.click();
});
singlePicker.addEventListener('change', async (e)=>{
  const files = Array.from(e.target.files);
  if(files.length===0) return;
  for(const f of files) await uploadFileToStorage(f, currentDir);
  renderFiles(currentDir);
});

async function uploadFileToStorage(file, folder){
  const path = `${folder}/${uid()}-${file.name}`;
  const ref = storage.ref(path);
  const snap = await ref.put(file);
  const meta = { name: file.name, folder: folder, storagePath: path, size: file.size, type: file.type, createdAt: Date.now() };
  await db.collection('files').add(meta);
}

// INFO
function infoFile(it){
  alert(`Name: ${it.name}\nSize: ${fmtSize(it.size)}\nFolder: ${it.folder}\nUploaded: ${new Date(it.createdAt).toLocaleString()}`);
}

// RECENT utility and quota
async function updateQuota(){
  const snap = await db.collection('files').get();
  let total=0;
  snap.forEach(d=> total += (d.data().size||0));
  quota.textContent = `Used: ${fmtSize(total)}`;
}

// initial listener to auto-refresh basic lists (optional)
db.collection('files').onSnapshot(()=> {
  if(dashboard.classList.contains('hidden')) return;
  renderFiles(currentDir);
  renderRecent();
  renderBin();
  renderCards();
  updateQuota();
});

// search
searchInput.addEventListener('input', async ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q) { renderFiles(currentDir); return; }
  const res = await db.collection('files').where('folder','==',currentDir).get();
  const arr = res.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.name.toLowerCase().includes(q));
  fileList.innerHTML = '';
  arr.forEach(it=>{
    const row = document.createElement('div'); row.className='file-row';
    row.innerHTML = `<div class="file-meta"><div class="file-name">${it.name}</div><div class="muted">${fmtSize(it.size)}</div></div>
      <div><button class="three-dot" data-id="${it.id}">⋮</button></div>`;
    fileList.appendChild(row);
    row.querySelector('.three-dot').addEventListener('click',(e)=>{
      menuTarget = it; showMenu(e.target);
    });
  });
});

// back / home actions
document.getElementById('home-btn').addEventListener('click', ()=> {
  views.overview.classList.remove('hidden');
  views.dir.classList.add('hidden');
  views.recent.classList.add('hidden');
  views.bin.classList.add('hidden');
});
document.getElementById('back-btn').addEventListener('click', ()=> {
  // simple: go to overview
  document.querySelector('.sidebar-item[data-view="overview"]').click();
});

// expose some functions for inline handlers
window.restore = restore;
window.permaDelete = permaDelete;
