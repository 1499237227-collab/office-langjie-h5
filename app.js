/**
 * 办公室浪姐人格测试
 * 计分：每题 A/B/C/D 分别对应四种类型 +1
 * 并列优先级：拼命(A) > 直球(B) > 综艺(C) > 清醒(D)
 */

const TYPE_ORDER = ["A", "B", "C", "D"];

const TYPE_META = {
  A: {
    key: "A",
    title: "被确诊为 办公室【拼命小白花姐】",
    image: "./result-1.png",
    lines: [
      "每天最早到、最晚走，方案一版一版抠细节。",
      "领导问这是谁做的？",
      "你：“不假唱、不怯场、不做作，不好听——但我真的尽力了呀！”",
    ],
  },
  B: {
    key: "B",
    title: "被确诊为 办公室【业务直球姐】",
    image: "./result-2.png",
    lines: [
      "别人一听加需求就先叹气，你先问三遍：目标、资源、排期。对不齐，你当场就说：“这个走不通，我们别自欺欺人了。”",
      "会议室需要你，因为没有你，大家都只敢“嗯嗯好”。",
    ],
  },
  C: {
    key: "C",
    title: "被确诊为 办公室【综艺气氛姐】",
    image: "./result-3.png",
    lines: [
      "甲方再离谱，你都能先整一个段子。PPT 改到凌晨，你还能说：“欢迎来到职场生存现场晚会。”",
      "你是全组情绪调节阀：骂归骂，笑归笑，第二天还是会准时来上班。",
    ],
  },
  D: {
    key: "D",
    title: "被确诊为 办公室【清醒算账姐】",
    image: "./result-4.png",
    lines: [
      "别人听到新活儿说“我试试吧”，你先翻日历算时间：“这不在我这条线里，加资源可以谈，不加就先别算我。”",
      "你不是难搞，你只是比谁都清楚——哪些才算自己的舞台。",
    ],
  },
};

const QUESTIONS = [
  {
    id: 1,
    text: "项目临时加需求，你第一反应是？",
    choices: [
      { key: "A", text: "先不说话，默默打开电脑开始改。" },
      { key: "B", text: "先问三遍：到底想要什么？时间、资源给不？" },
      { key: "C", text: "一边答“没问题呢”，一边在心里骂街。" },
      { key: "D", text: "回一句：“这块不在我这条线里吧？”" },
    ],
  },
  {
    id: 2,
    text: "开会时领导问：“这个谁来负责比较合适？”你通常的结局是：",
    choices: [
      { key: "A", text: "眼神飘忽，结果还是你背下来了。" },
      { key: "B", text: "直接说：“这个应该是XX同学的范围，我可以支援。”" },
      { key: "C", text: "正在笑着说段子，笑着笑着就接了。" },
      { key: "D", text: "打开日历：“我这边现在已经全排满了哦。”" },
    ],
  },
  {
    id: 3,
    text: "加班到晚上十点，你最有可能在干嘛？",
    choices: [
      { key: "A", text: "还在改第 N 版方案，顺手把明天的也做了。" },
      { key: "B", text: "跟同事边吐槽边磨，嘴上说不干手上越干越快。" },
      { key: "C", text: "在群里发梗图：“欢迎来到职场生存现场晚会。”" },
      { key: "D", text: "把手头事儿收一收，准备准时关电脑走人。" },
    ],
  },
];

let currentQ = 0;
let pendingLastKey = null;
const scores = { A: 0, B: 0, C: 0, D: 0 };

function $(id) {
  return document.getElementById(id);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.hidden = true;
    el.classList.remove("is-active");
  });
  const next = $(id);
  next.hidden = false;
  next.classList.add("is-active");
}

function pickWinner() {
  let max = -1;
  TYPE_ORDER.forEach((k) => {
    max = Math.max(max, scores[k]);
  });
  for (const k of TYPE_ORDER) {
    if (scores[k] === max) return k;
  }
  return "A";
}

function renderQuiz() {
  pendingLastKey = null;
  const footer = $("quiz-footer");
  const submitBtn = $("btn-view-result");
  submitBtn.disabled = false;
  footer.hidden = true;
  const q = QUESTIONS[currentQ];
  $("quiz-progress").textContent = `第 ${currentQ + 1} / ${QUESTIONS.length} 题`;
  $("quiz-question").textContent = q.text;
  const ul = $("quiz-options");
  ul.innerHTML = "";
  const isLast = currentQ === QUESTIONS.length - 1;
  q.choices.forEach((c) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.key = c.key;
    btn.innerHTML = `<span class="option-key">${c.key}.</span>${c.text}`;
    btn.addEventListener("click", () => {
      if (isLast) {
        pendingLastKey = c.key;
        ul.querySelectorAll(".option-btn").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        footer.hidden = false;
      } else {
        onAnswer(c.key);
      }
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function onAnswer(key) {
  scores[key] += 1;
  currentQ += 1;
  if (currentQ < QUESTIONS.length) {
    renderQuiz();
  } else {
    showResult();
  }
}

function commitLastAnswer() {
  if (!pendingLastKey) return;
  const btn = $("btn-view-result");
  btn.disabled = true;
  scores[pendingLastKey] += 1;
  showResult();
  btn.disabled = false;
}

function showResult() {
  const winner = pickWinner();
  const meta = TYPE_META[winner];
  $("result-title").textContent = meta.title;

  const fig = $("result-figure");
  const alt = meta.title.replace(/\s+/g, " ").trim();
  fig.innerHTML = `<img class="diagnosis__img" src="${meta.image}" width="800" height="600" alt="${alt}" loading="lazy" decoding="async" />`;

  const body = $("result-body");
  body.innerHTML = meta.lines.map((line) => `<p>${line}</p>`).join("");

  showScreen("screen-result");
}

function resetQuiz() {
  scores.A = scores.B = scores.C = scores.D = 0;
  currentQ = 0;
  pendingLastKey = null;
  renderQuiz();
  showScreen("screen-quiz");
}

function goHome() {
  scores.A = scores.B = scores.C = scores.D = 0;
  currentQ = 0;
  pendingLastKey = null;
  showScreen("screen-home");
}

function init() {
  $("btn-start").addEventListener("click", () => {
    resetQuiz();
    showScreen("screen-quiz");
  });
  $("btn-quiz-back").addEventListener("click", goHome);
  $("btn-result-back").addEventListener("click", goHome);
  $("btn-view-result").addEventListener("click", commitLastAnswer);
  $("btn-retry").addEventListener("click", () => {
    resetQuiz();
    showScreen("screen-quiz");
  });
}

init();
