(() => {
  const NAVI_WEB = "https://tt-sensei.github.io/navi-character-/assets/web/characters/";
  const BADGE_KEY = "3nensyakai-social-badges-v1";

  const characters = [
    { id: "riku" },
    { id: "sora" },
    { id: "kai" },
    { id: "saku" },
    { id: "tsuki" },
    { id: "nami" }
  ];

  const unitMeta = {
    1: { title: "わたしたちのまち", short: "地図・方位", guide: "問題の中の大事な言葉と、地図の向きをよく見てみよう。" },
    2: { title: "わたしたちの市", short: "市のようす", guide: "土地の使われ方や交通の広がりを、資料とつないで考えよう。" },
    3: { title: "スーパーのくふう", short: "店のくふう", guide: "お客さんの願いと、お店のくふうがどうつながるか見つけよう。" },
    4: { title: "工場のしごと", short: "工場のくふう", guide: "安全・品質・働く人のくふうに目を向けてみよう。" },
    5: { title: "火事からまちを守る", short: "消防のしくみ", guide: "いざというとき、誰がどのように動くのか順番を考えよう。" },
    6: { title: "事故からまちを守る", short: "安全なくらし", guide: "警察だけでなく、地域の人の協力にも注目してみよう。" },
    7: { title: "まちのうつりかわり", short: "昔と今", guide: "昔と今を比べて、変わった理由と残った知恵を考えよう。" }
  };

  const modes = {
    start: "まずは自分の考えを決めてみよう。選択肢をくらべると、手がかりが見つかるよ。",
    correct: "いい発見！正解の理由までわかると、社会科の力がもっと伸びるよ。",
    retry: "おしい！解説を読んで、どこが手がかりだったか見つけてみよう。",
    complete: "探検完了！見つけたことをノートに一つ残して、次の学びにつなげよう。"
  };

  let currentUnit = 0;
  let currentCharacter = 0;

  function getUnit() {
    const match = location.pathname.match(/unit([1-7])\.html/);
    return match ? Number(match[1]) : 0;
  }

  function imagePath(character, pose) {
    return NAVI_WEB + character.id + "/fullbody/" + pose + ".webp";
  }

  function readBadgeCount() {
    try {
      const data = JSON.parse(localStorage.getItem(BADGE_KEY) || "{}");
      return Array.isArray(data.owned) ? data.owned.length : 0;
    } catch (_) {
      return 0;
    }
  }

  function refreshBadgeCount() {
    const count = readBadgeCount();
    document.querySelectorAll(".edu-kit-badge-count").forEach((el) => {
      el.textContent = "🏅 バッジ " + count + "こ";
    });
  }

  function addTopbar(unit) {
    if (document.querySelector(".edu-kit-topbar")) return;
    const bar = document.createElement("div");
    bar.className = "edu-kit-topbar";
    const title = unit ? "社会科 3年｜" + unitMeta[unit].short : "社会科たんけん";
    bar.innerHTML =
      '<a class="edu-kit-brand" href="index.html" aria-label="社会科たんけんポータルにもどる">' +
        '<span class="edu-kit-brand-mark" aria-hidden="true">社</span>' +
        '<span class="edu-kit-brand-copy"><strong>社会科たんけん</strong><small>' + title + '</small></span>' +
      '</a>' +
      '<span class="edu-kit-topbar-actions">' +
        '<span class="edu-kit-badge-count" aria-label="集めた社会科バッジ">' + "🏅 バッジ " + readBadgeCount() + "こ" + "</span>" +
        (unit ? '<a class="edu-kit-home-link" href="index.html">単元をえらぶ</a>' : "") +
      '</span>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function addImage(parent, className, src, alt, loading) {
    const img = document.createElement("img");
    img.className = className;
    img.src = src;
    img.alt = alt || "";
    if (loading !== false) img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.hidden = true;
    });
    parent.appendChild(img);
    return img;
  }

  function addPortal() {
    const body = document.body;
    body.classList.add("edu-page", "edu-portal-page");
    addTopbar(0);

    const cards = document.querySelectorAll(".mission-card");
    const cardCharacters = [
      ["riku", "pointing"],
      ["sora", "reaching"],
      ["kai", "reading"],
      ["saku", "hands-clasped"],
      ["tsuki", "reaching-out"],
      ["nami", "waving"],
      ["riku", "looking-away"]
    ];
    cards.forEach((card, index) => {
      if (card.querySelector(".mission-navi")) return;
      const selected = cardCharacters[index % cardCharacters.length];
      const character = characters.find((item) => item.id === selected[0]) || characters[0];
      const image = document.createElement("img");
      image.className = "mission-navi";
      image.src = imagePath(character, selected[1]);
      image.alt = "この単元を案内するNAVIキャラ";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => { image.hidden = true; });
      card.insertBefore(image, card.firstElementChild);
    });

    refreshBadgeCount();
  }

  function addCoach(unit) {
    const h1 = document.querySelector("body > h1");
    const lead = h1 && h1.nextElementSibling && h1.nextElementSibling.tagName === "P"
      ? h1.nextElementSibling
      : null;
    if (h1) h1.classList.add("edu-page-title");
    if (lead) lead.classList.add("edu-unit-lead");

    const game = document.getElementById("game-area");
    if (!game || document.querySelector(".edu-coach")) return;

    const coach = document.createElement("section");
    coach.className = "edu-coach";
    coach.setAttribute("aria-label", "NAVIキャラからの学習案内");

    const figure = document.createElement("div");
    figure.className = "edu-coach-figure";
    const character = characters[unit % characters.length];
    const picture = addImage(
      figure,
      "",
      imagePath(character, "waving"),
      "NAVIキャラの案内",
      false
    );
    picture.id = "edu-coach-image";

    const copy = document.createElement("div");
    copy.className = "edu-coach-copy";
    const label = document.createElement("span");
    label.className = "edu-coach-label";
    label.id = "edu-coach-label";
    label.textContent = "学びの案内";
    const speech = document.createElement("p");
    speech.className = "edu-coach-speech";
    speech.id = "edu-coach-speech";
    speech.setAttribute("aria-live", "polite");
    speech.textContent = unitMeta[unit].guide;
    copy.appendChild(label);
    copy.appendChild(speech);

    coach.appendChild(figure);
    coach.appendChild(copy);
    game.insertAdjacentElement("beforebegin", coach);
  }

  function setCoach(mode) {
    const image = document.getElementById("edu-coach-image");
    const label = document.getElementById("edu-coach-label");
    const speech = document.getElementById("edu-coach-speech");
    if (!image || !label || !speech) return;

    if (mode === "correct" || mode === "retry") {
      currentCharacter = (currentCharacter + (mode === "retry" ? 1 : 0)) % characters.length;
    } else if (mode === "complete") {
      currentCharacter = (currentUnit + 2) % characters.length;
    }

    const character = characters[currentCharacter];
    const pose = mode === "correct" ? "correct" :
      mode === "retry" ? "retry" :
      mode === "complete" ? "complete" : "waving";
    image.hidden = false;
    image.src = imagePath(character, pose);
    image.alt = "NAVIキャラの案内";
    label.textContent = "学びの案内";
    speech.textContent = mode === "start" && unitMeta[currentUnit]
      ? unitMeta[currentUnit].guide
      : (modes[mode] || modes.start);
  }

  function playEffect(target, className) {
    if (!target) return;
    if (window.EduEffects && typeof window.EduEffects.play === "function") {
      window.EduEffects.play(target, className);
    } else {
      target.classList.remove(className);
      void target.offsetWidth;
      target.classList.add(className);
    }
  }

  function addEduClasses() {
    const game = document.getElementById("game-area");
    const result = document.getElementById("result-area");
    const question = document.getElementById("question-text");
    const choices = document.getElementById("choices-area");
    const explanation = document.getElementById("explanation-area");
    if (game) game.classList.add("edu-card", "edu-question");
    if (result) result.classList.add("edu-card", "edu-shell-result");
    if (question) question.classList.add("edu-question-text");
    if (choices) choices.classList.add("edu-answer-grid");
    if (explanation) {
      explanation.classList.add("edu-status", "edu-status-info");
      explanation.setAttribute("aria-live", "polite");
    }
  }

  function hookQuiz() {
    if (typeof window.checkAnswer === "function" && !window.checkAnswer.__eduKitWrapped) {
      const originalCheck = window.checkAnswer;
      const wrappedCheck = function(selected, correct, expText, button) {
        const isCorrect = selected === correct;
        const result = originalCheck.apply(this, arguments);
        setCoach(isCorrect ? "correct" : "retry");
        playEffect(button || document.getElementById("question-text"),
          isCorrect ? "effect-correct-ring" : "effect-wrong-shake");
        return result;
      };
      wrappedCheck.__eduKitWrapped = true;
      window.checkAnswer = wrappedCheck;
    }

    if (typeof window.initGame === "function" && !window.initGame.__eduKitWrapped) {
      const originalInit = window.initGame;
      const wrappedInit = function() {
        const result = originalInit.apply(this, arguments);
        setCoach("start");
        return result;
      };
      wrappedInit.__eduKitWrapped = true;
      window.initGame = wrappedInit;
    }

    if (typeof window.showResult === "function" && !window.showResult.__eduKitWrapped) {
      const originalResult = window.showResult;
      const wrappedResult = function() {
        const result = originalResult.apply(this, arguments);
        setCoach("complete");
        const resultArea = document.getElementById("result-area");
        if (resultArea) {
          playEffect(resultArea, "effect-achievement-glow");
          const score = Number((document.getElementById("score") || {}).textContent || 0);
          if (score === 10 && window.EduEffects && typeof window.EduEffects.confetti === "function") {
            window.EduEffects.confetti(resultArea, 16);
          }
        }
        window.setTimeout(refreshBadgeCount, 80);
        return result;
      };
      wrappedResult.__eduKitWrapped = true;
      window.showResult = wrappedResult;
    }
  }

  function init() {
    currentUnit = getUnit();
    if (currentUnit) {
      document.body.classList.add("edu-page", "edu-unit-page");
      addTopbar(currentUnit);
      currentCharacter = currentUnit % characters.length;
      addCoach(currentUnit);
      addEduClasses();
      setCoach("start");
      hookQuiz();
    } else {
      addPortal();
    }
  }

  window.EduKitSocial = {
    refreshBadgeCount: refreshBadgeCount,
    setCoach: setCoach
  };

  document.addEventListener("DOMContentLoaded", init, { once: true });
})();