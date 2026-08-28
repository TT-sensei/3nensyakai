(() => {
  const KEY = "3nensyakai-social-badges-v1";
  const ASSET = "https://raw.githubusercontent.com/TT-sensei/edu-assets/main/assets/badges/social/";
  const units = {
    unit1: { title: "まわりの様子", icon: "🗺️", badge: "map-reader" },
    unit2: { title: "市の様子", icon: "🏙️", badge: "local-explorer" },
    unit3: { title: "スーパーのくふう", icon: "🛒", badge: "social-investigator" },
    unit4: { title: "工場ではたらく人", icon: "🏭", badge: "industry" },
    unit5: { title: "火事からまちを守る", icon: "🚒", badge: "society-connection" },
    unit6: { title: "事故からまちを守る", icon: "🚓", badge: "citizens" },
    unit7: { title: "まちのうつりかわり", icon: "⏳", badge: "history-connection" }
  };

  const badges = [
    ...Object.entries(units).map(([id, unit]) => ({
      id: "clear-" + id,
      title: unit.title + "クリア",
      text: "クエストを最後までたんけんした",
      image: unit.badge,
      kind: "clear"
    })),
    { id: "perfect-unit1", title: "地図よみ満点", text: "まわりの様子で10問ぜんぶ正解", image: "social-discovery", kind: "perfect" },
    { id: "perfect-unit2", title: "市のようす満点", text: "市の様子で10問ぜんぶ正解", image: "compare-society", kind: "perfect" },
    { id: "perfect-unit3", title: "お店のくふう満点", text: "スーパーのくふうで10問ぜんぶ正解", image: "source-reader", kind: "perfect" },
    { id: "perfect-unit4", title: "工場はっけん満点", text: "工場ではたらく人で10問ぜんぶ正解", image: "industry", kind: "perfect" },
    { id: "perfect-unit5", title: "消防のしくみ満点", text: "火事からまちを守るで10問ぜんぶ正解", image: "government", kind: "perfect" },
    { id: "perfect-unit6", title: "安全まちづくり満点", text: "事故からまちを守るで10問ぜんぶ正解", image: "citizens", kind: "perfect" },
    { id: "perfect-unit7", title: "昔と今満点", text: "まちのうつりかわりで10問ぜんぶ正解", image: "timeline", kind: "perfect" },
    { id: "combo-3", title: "ひらめきコンボ", text: "3問連続正解した", image: "social-discovery", kind: "combo" },
    { id: "combo-5", title: "連続はっけん名人", text: "5問連続正解した", image: "social-investigator", kind: "combo" },
    { id: "combo-10", title: "ノーミス探検隊長", text: "10問連続正解した", image: "local-explorer", kind: "combo" },
    { id: "clear-3", title: "まちたんけんルーキー", text: "3つのクエストをクリアした", image: "life-and-culture", kind: "collection" },
    { id: "clear-5", title: "社会科リサーチャー", text: "5つのクエストをクリアした", image: "source-reader", kind: "collection" },
    { id: "clear-7", title: "まちのひみつ博士", text: "7つすべてのクエストをクリアした", image: "people-of-history", kind: "collection" },
    { id: "perfect-3", title: "満点トリオ", text: "3つのクエストで満点をとった", image: "compare-society", kind: "collection" },
    { id: "perfect-7", title: "社会科レジェンド", text: "7つすべてのクエストで満点をとった", image: "world-connection", kind: "collection" },
    { id: "skill-unit1", title: "場所と方位の名人", text: "まわりの様子で8問以上正解", image: "location-thinking", kind: "skill" },
    { id: "skill-unit2", title: "市の広がり発見", text: "市の様子で8問以上正解", image: "spatial-pattern", kind: "skill" },
    { id: "skill-unit3", title: "くらべて考える名人", text: "スーパーのくふうで8問以上正解", image: "perspective", kind: "skill" },
    { id: "skill-unit4", title: "つながり調査隊", text: "工場ではたらく人で8問以上正解", image: "interdependence", kind: "skill" },
    { id: "skill-unit5", title: "原因としくみ発見", text: "火事からまちを守るで8問以上正解", image: "social-cause-effect", kind: "skill" },
    { id: "skill-unit6", title: "よりよいまち判断", text: "事故からまちを守るで8問以上正解", image: "social-judgment", kind: "skill" },
    { id: "skill-unit7", title: "変化を見つける名人", text: "まちのうつりかわりで8問以上正解", image: "change-over-time", kind: "skill" },
    { id: "insight-3", title: "特徴発見トリオ", text: "3つのクエストで学びを残した", image: "find-features", kind: "insight" },
    { id: "insight-5", title: "社会の課題に気づく", text: "5つのクエストで学びを残した", image: "social-issues", kind: "insight" },
    { id: "insight-7", title: "未来を考える探検隊", text: "7つすべてのクエストをたんけんした", image: "future-thinking", kind: "insight" }
  ];

  const defaults = () => ({ owned: [], clears: {}, perfects: {}, bestCombo: 0 });

  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || "{}");
      const base = defaults();
      return {
        ...base,
        ...data,
        owned: Array.isArray(data.owned) ? data.owned : [],
        clears: data.clears && typeof data.clears === "object" ? data.clears : {},
        perfects: data.perfects && typeof data.perfects === "object" ? data.perfects : {}
      };
    } catch (_) {
      return defaults();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function image(id) {
    return ASSET + id + "/badge.png";
  }

  function countKeys(object) {
    return Object.keys(object || {}).length;
  }

  function award(data, id, newOnes) {
    if (!data.owned.includes(id)) {
      data.owned.push(id);
      const found = badges.find((badge) => badge.id === id);
      if (found) newOnes.push(found);
    }
  }

  function awardResult(unitId, score, combo) {
    const data = read();
    const fresh = [];
    const scoreNumber = Number(score) || 0;
    const comboNumber = Number(combo) || 0;

    data.clears[unitId] = true;
    data.bestCombo = Math.max(Number(data.bestCombo) || 0, comboNumber);

    award(data, "clear-" + unitId, fresh);
    if (scoreNumber === 10) {
      data.perfects[unitId] = true;
      award(data, "perfect-" + unitId, fresh);
    }
    if (scoreNumber >= 8) award(data, "skill-" + unitId, fresh);
    if (data.bestCombo >= 3) award(data, "combo-3", fresh);
    if (data.bestCombo >= 5) award(data, "combo-5", fresh);
    if (data.bestCombo >= 10) award(data, "combo-10", fresh);

    const clears = countKeys(data.clears);
    const perfects = countKeys(data.perfects);
    if (clears >= 3) award(data, "clear-3", fresh);
    if (clears >= 5) award(data, "clear-5", fresh);
    if (clears >= 7) award(data, "clear-7", fresh);
    if (perfects >= 3) award(data, "perfect-3", fresh);
    if (perfects >= 7) award(data, "perfect-7", fresh);
    if (clears >= 3) award(data, "insight-3", fresh);
    if (clears >= 5) award(data, "insight-5", fresh);
    if (clears >= 7) award(data, "insight-7", fresh);

    save(data);
    if (fresh.length) showNew(fresh);
    showResultProgress();
    if (window.EduKitSocial && typeof window.EduKitSocial.refreshBadgeCount === "function") {
      window.EduKitSocial.refreshBadgeCount();
    }
  }

  function stylesheet() {
    if (document.getElementById("social-badge-style")) return;
    const style = document.createElement("style");
    style.id = "social-badge-style";
    style.textContent =
      ".badge-panel{max-width:1000px;margin:0 auto 26px;background:#fff;border:4px solid #00838f;border-radius:18px;padding:18px;box-shadow:0 6px 0 #b2ebf2}" +
      ".badge-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}" +
      ".badge-head h2{margin:0;color:#006064;font-size:1.35em}" +
      ".badge-count{background:#fff3cd;color:#8a5700;padding:8px 13px;border-radius:999px;font-weight:bold}" +
      ".badge-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:12px;margin-top:15px}" +
      ".badge-card{border:2px solid #d7e6e8;border-radius:12px;padding:8px;background:#f8ffff;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}" +
      ".badge-card.locked{filter:grayscale(1);opacity:.48}" +
      ".badge-card img{width:74px;height:74px;object-fit:contain}" +
      ".badge-card strong{font-size:.79em;margin-top:5px}" +
      ".badge-card small{font-size:.7em;color:#555;margin-top:3px}" +
      ".badge-more{margin-top:14px;border:0;border-radius:999px;padding:10px 18px;background:#00838f;color:white;font-weight:bold;cursor:pointer;min-height:44px}" +
      ".badge-toast{position:fixed;z-index:9999;right:18px;bottom:18px;max-width:350px;background:#fff;border:4px solid #ff9800;border-radius:18px;padding:14px;box-shadow:0 8px 24px rgba(0,0,0,.22)}" +
      ".badge-toast h3{margin:0 0 8px;color:#e65100}" +
      ".badge-toast-item{display:flex;align-items:center;gap:9px;text-align:left;font-weight:bold}" +
      ".badge-toast-item img{width:56px;height:56px;object-fit:contain}" +
      ".result-badge-progress{margin:16px 0;padding:12px;border-radius:12px;background:#e0f7fa;color:#006064;font-weight:bold}";
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  function card(badge, owned) {
    const title = owned ? escapeHtml(badge.title) : "？？？";
    const text = owned ? escapeHtml(badge.text) : "まだ見つかっていないよ";
    return '<div class="badge-card ' + (owned ? "" : "locked") + '">' +
      '<img src="' + image(badge.image) + '" alt="' + (owned ? escapeHtml(badge.title) : "未獲得の社会科バッジ") + '" loading="lazy">' +
      "<strong>" + title + "</strong><small>" + text + "</small></div>";
  }

  function renderPortal(showAll) {
    stylesheet();
    const data = read();
    const panel = document.createElement("section");
    panel.className = "badge-panel";
    panel.id = "badge-collection";
    const visible = showAll
      ? badges
      : badges.filter((badge) => data.owned.includes(badge.id)).slice(-6);

    panel.innerHTML =
      '<div class="badge-head"><h2>🏅 社会科バッジコレクション</h2>' +
      '<span class="badge-count">' + data.owned.length + " / " + badges.length + " こ発見！</span></div>" +
      '<p style="margin:10px 0 0;color:#49666b;">クエストをクリアしたり、満点・連続正解・8問以上正解にちょうせんしたりして集めよう。</p>' +
      '<div class="badge-grid">' +
      (visible.length
        ? visible.map((badge) => card(badge, data.owned.includes(badge.id))).join("")
        : '<p class="badge-empty">はじめのバッジは、クエストをクリアすると手に入るよ！</p>') +
      "</div>" +
      (!showAll ? '<button class="badge-more" type="button">コレクションをぜんぶ見る</button>' : "");

    const target = document.querySelector(".mission-grid");
    if (target) target.parentNode.insertBefore(panel, target);

    const button = panel.querySelector(".badge-more");
    if (button) {
      button.addEventListener("click", () => {
        panel.remove();
        renderPortal(true);
        const collection = document.getElementById("badge-collection");
        if (collection) collection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function showNew(items) {
    stylesheet();
    const toast = document.createElement("div");
    toast.className = "badge-toast effect-badge-unlock";
    toast.setAttribute("role", "status");
    toast.innerHTML =
      '<h3>🎉 新しいバッジを発見！</h3>' +
      items.slice(0, 3).map((badge) =>
        '<div class="badge-toast-item"><img class="effect-badge-icon" src="' + image(badge.image) +
        '" alt=""><span>' + escapeHtml(badge.title) + "<br><small>" +
        escapeHtml(badge.text) + "</small></span></div>"
      ).join("") +
      '<span class="effect-badge-shine" aria-hidden="true"></span>';
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 6000);
  }

  function showResultProgress() {
    const area = document.getElementById("result-area");
    if (!area) return;
    const old = area.querySelector(".result-badge-progress");
    if (old) old.remove();
    const data = read();
    const line = document.createElement("div");
    line.className = "result-badge-progress";
    line.textContent = "🏅 バッジコレクション：" + data.owned.length + " / " + badges.length + " こ発見！";
    const back = area.querySelector(".back-btn");
    if (back) area.insertBefore(line, back);
    else area.appendChild(line);
  }

  function hookResult() {
    if (typeof window.showResult !== "function" || window.showResult.__badges) return;
    const original = window.showResult;
    const wrapped = function() {
      const result = original.apply(this, arguments);
      const unitMatch = location.pathname.match(/unit([1-7])\.html/);
      if (unitMatch) {
        const score = Number((document.getElementById("score") || {}).textContent || 0);
        const combo = Number((document.getElementById("max-combo") || {}).textContent || 0);
        awardResult("unit" + unitMatch[1], score, combo);
      }
      return result;
    };
    wrapped.__badges = true;
    window.showResult = wrapped;
  }

  document.addEventListener("DOMContentLoaded", () => {
    stylesheet();
    if (location.pathname.endsWith("/") || location.pathname.endsWith("/index.html")) {
      renderPortal(false);
    }
    hookResult();
  }, { once: true });

  window.SocialBadges = { awardResult: awardResult, list: badges };
})();