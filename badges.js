(() => {
  const KEY = '3nensyakai-social-badges-v1';
  const ASSET = 'https://raw.githubusercontent.com/TT-sensei/edu-assets/main/assets/badges/social/';
  const units = {
    unit1: { title: 'まわりの様子', icon: '🗺️', badge: 'map-reader' },
    unit2: { title: '市の様子', icon: '🏙️', badge: 'local-explorer' },
    unit3: { title: 'スーパーのくふう', icon: '🛒', badge: 'social-investigator' },
    unit4: { title: '工場ではたらく人', icon: '🏭', badge: 'industry' },
    unit5: { title: '火事からまちを守る', icon: '🚒', badge: 'society-connection' },
    unit6: { title: '事故からまちを守る', icon: '🚓', badge: 'citizens' },
    unit7: { title: 'まちのうつりかわり', icon: '⏳', badge: 'history-connection' }
  };
  const badges = [
    ...Object.entries(units).map(([id, u]) => ({ id: 'clear-' + id, title: u.title + 'クリア', text: 'クエストを最後までたんけんした', image: u.badge, kind: 'clear' })),
    ...Object.entries(units).map(([id, u]) => ({ id: 'perfect-' + id, title: u.title + 'パーフェクト', text: '10問ぜんぶ正解した', image: id === 'unit1' ? 'social-discovery' : id === 'unit2' ? 'compare-society' : id === 'unit3' ? 'source-reader' : id === 'unit4' ? 'industry' : id === 'unit5' ? 'government' : id === 'unit6' ? 'citizens' : 'timeline', kind: 'perfect' })),
    { id: 'combo-3', title: 'ひらめきコンボ', text: '3問連続正解した', image: 'social-discovery' },
    { id: 'combo-5', title: '連続はっけん名人', text: '5問連続正解した', image: 'social-investigator' },
    { id: 'combo-10', title: 'ノーミス探検隊長', text: '10問連続正解した', image: 'local-explorer' },
    { id: 'clear-3', title: 'まちたんけんルーキー', text: '3つのクエストをクリアした', image: 'life-and-culture' },
    { id: 'clear-5', title: '社会科リサーチャー', text: '5つのクエストをクリアした', image: 'source-reader' },
    { id: 'clear-7', title: 'まちのひみつ博士', text: '7つすべてのクエストをクリアした', image: 'people-of-history' },
    { id: 'perfect-3', title: '満点トリオ', text: '3つのクエストで満点をとった', image: 'compare-society' },
    { id: 'perfect-7', title: '社会科レジェンド', text: '7つすべてのクエストで満点をとった', image: 'world-connection' }
  ];
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { owned: [], clears: {}, perfects: {}, bestCombo: 0 }; } catch (_) { return { owned: [], clears: {}, perfects: {}, bestCombo: 0 }; } };
  const save = data => localStorage.setItem(KEY, JSON.stringify(data));
  const image = id => ASSET + id + '/badge.png';
  const plural = (obj) => Object.keys(obj).length;
  function award(data, id, newOnes) {
    if (!data.owned.includes(id)) { data.owned.push(id); newOnes.push(badges.find(b => b.id === id)); }
  }
  function awardResult(unitId, score, combo) {
    const data = read(), fresh = [];
    data.clears[unitId] = true;
    data.bestCombo = Math.max(data.bestCombo || 0, Number(combo) || 0);
    award(data, 'clear-' + unitId, fresh);
    if (score === 10) { data.perfects[unitId] = true; award(data, 'perfect-' + unitId, fresh); }
    if (data.bestCombo >= 3) award(data, 'combo-3', fresh);
    if (data.bestCombo >= 5) award(data, 'combo-5', fresh);
    if (data.bestCombo >= 10) award(data, 'combo-10', fresh);
    const clears = plural(data.clears), perfects = plural(data.perfects);
    if (clears >= 3) award(data, 'clear-3', fresh);
    if (clears >= 5) award(data, 'clear-5', fresh);
    if (clears >= 7) award(data, 'clear-7', fresh);
    if (perfects >= 3) award(data, 'perfect-3', fresh);
    if (perfects >= 7) award(data, 'perfect-7', fresh);
    save(data);
    if (fresh.length) showNew(fresh);
    showResultProgress();
  }
  function stylesheet() {
    if (document.getElementById('social-badge-style')) return;
    const s = document.createElement('style'); s.id = 'social-badge-style';
    s.textContent = '.badge-panel{max-width:1000px;margin:0 auto 26px;background:#fff;border:4px solid #00838f;border-radius:18px;padding:18px;box-shadow:0 6px 0 #b2ebf2}.badge-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.badge-head h2{margin:0;color:#006064;font-size:1.35em}.badge-count{background:#fff3cd;color:#8a5700;padding:8px 13px;border-radius:999px;font-weight:bold}.badge-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:12px;margin-top:15px}.badge-card{border:2px solid #d7e6e8;border-radius:12px;padding:8px;background:#f8ffff;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}.badge-card.locked{filter:grayscale(1);opacity:.48}.badge-card img{width:74px;height:74px;object-fit:contain}.badge-card strong{font-size:.79em;margin-top:5px}.badge-card small{font-size:.7em;color:#555;margin-top:3px}.badge-more{margin-top:14px;border:0;border-radius:999px;padding:10px 18px;background:#00838f;color:white;font-weight:bold;cursor:pointer}.badge-toast{position:fixed;z-index:9999;right:18px;bottom:18px;max-width:350px;background:#fff;border:4px solid #ff9800;border-radius:18px;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,.22);animation:badgePop .35s ease}.badge-toast h3{margin:0 0 8px;color:#e65100}.badge-toast-item{display:flex;align-items:center;gap:9px;text-align:left;font-weight:bold}.badge-toast-item img{width:56px;height:56px;object-fit:contain}@keyframes badgePop{from{transform:scale(.7) translateY(25px);opacity:0}to{transform:scale(1);opacity:1}}.result-badge-progress{margin:16px 0;padding:12px;border-radius:12px;background:#e0f7fa;color:#006064;font-weight:bold}';
    document.head.appendChild(s);
  }
  function card(b, owned) { return '<div class="badge-card ' + (owned ? '' : 'locked') + '"><img src="' + image(b.image) + '" alt=""><strong>' + (owned ? b.title : '？？？') + '</strong><small>' + (owned ? b.text : 'まだ見つかっていないよ') + '</small></div>'; }
  function renderPortal(all) {
    stylesheet(); const data = read(), count = data.owned.length;
    const visible = all ? badges : badges.filter(b => data.owned.includes(b.id)).slice(-6);
    const panel = document.createElement('section'); panel.className = 'badge-panel'; panel.id = 'badge-collection';
    panel.innerHTML = '<div class="badge-head"><h2>🏅 社会科バッジコレクション</h2><span class="badge-count">' + count + ' / ' + badges.length + ' こ発見！</span></div><p style="margin:10px 0 0;color:#49666b;">クエストをクリアしたり、満点や連続正解にちょうせんしたりして集めよう。</p><div class="badge-grid">' + (visible.length ? visible.map(b => card(b, data.owned.includes(b.id))).join('') : '<p>はじめのバッジは、クエストをクリアすると手に入るよ！</p>') + '</div>' + (!all ? '<button class="badge-more" type="button">コレクションをぜんぶ見る</button>' : '') + '</section>';
    const target = document.querySelector('.mission-grid');
    if (target) target.parentNode.insertBefore(panel, target);
    const button = panel.querySelector('.badge-more'); if (button) button.onclick = () => { panel.remove(); renderPortal(true); document.getElementById('badge-collection').scrollIntoView({behavior:'smooth'}); };
  }
  function showNew(items) {
    stylesheet(); const toast = document.createElement('div'); toast.className = 'badge-toast';
    toast.innerHTML = '<h3>🎉 新しいバッジを発見！</h3>' + items.slice(0,3).map(b => '<div class="badge-toast-item"><img src="' + image(b.image) + '" alt=""><span>' + b.title + '<br><small>' + b.text + '</small></span></div>').join('');
    document.body.appendChild(toast); setTimeout(() => toast.remove(), 6000);
  }
  function showResultProgress() {
    const area = document.getElementById('result-area'); if (!area) return;
    const old = area.querySelector('.result-badge-progress'); if (old) old.remove();
    const data = read(), line = document.createElement('div'); line.className = 'result-badge-progress';
    line.textContent = '🏅 バッジコレクション：' + data.owned.length + ' / ' + badges.length + ' こ発見！';
    const back = area.querySelector('.back-btn'); if (back) area.insertBefore(line, back); else area.appendChild(line);
  }
  function hookResult() {
    if (typeof window.showResult !== 'function' || window.showResult.__badges) return;
    const original = window.showResult;
    const wrapped = function() { original.apply(this, arguments); const unit = location.pathname.match(/unit([1-7])\.html/)?.[1]; if (unit) { let resultScore = 0, resultCombo = 0; try { resultScore = Number(eval('score')) || 0; resultCombo = Number(eval('maxCombo')) || 0; } catch (_) {} awardResult('unit' + unit, resultScore, resultCombo); } };
    wrapped.__badges = true; window.showResult = wrapped;
  }
  document.addEventListener('DOMContentLoaded', () => { stylesheet(); if (location.pathname.endsWith('/') || location.pathname.endsWith('/index.html')) renderPortal(false); hookResult(); });
  window.SocialBadges = { awardResult };
})();