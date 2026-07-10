const agents = {
  architect: {
    name: "Architect",
    initial: "A",
    color: "plum",
    model: "Claude 3.7 Sonnet",
    description: "Maps requirements and creates implementation plans",
    budget: 8000,
    used: 8200,
  },
  builder: {
    name: "Builder",
    initial: "B",
    color: "cobalt",
    model: "Codex · gpt-5",
    description: "Writes and edits production code",
    budget: 24000,
    used: 11420,
  },
  reviewer: {
    name: "Reviewer",
    initial: "R",
    color: "orange",
    model: "Gemini 2.5 Pro",
    description: "Checks changes for regressions and edge cases",
    budget: 6000,
    used: 0,
  },
  tester: {
    name: "Test runner",
    initial: "T",
    color: "green",
    model: "Local · Qwen 3",
    description: "Runs local checks and summarizes failures",
    budget: 4000,
    used: 0,
  },
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function formatTokens(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function selectAgent(key) {
  const agent = agents[key];
  if (!agent) return;

  $$(".agent-card").forEach((card) => card.classList.toggle("selected", card.dataset.agent === key));
  $("#inspector-title").textContent = agent.name;
  $("#inspector-avatar").textContent = agent.initial;
  $("#inspector-avatar").className = `agent-avatar large ${agent.color}`;
  $("#inspector-model").textContent = agent.model;
  $("#inspector-description").textContent = agent.description;
  $("#budget-value").textContent = formatTokens(agent.budget);
  $("#budget-slider").value = agent.budget;
  updateBudgetSlider(agent.budget, agent.used);
  showToast(`${agent.name} selected`);
}

function updateBudgetSlider(value, used = agents.builder.used) {
  const min = 2000;
  const max = 48000;
  const percent = ((value - min) / (max - min)) * 100;
  const safeUsed = Math.min(used, value);
  $("#budget-slider").style.background = `linear-gradient(90deg, #6a72ed 0%, #6a72ed ${percent}%, #e9ebf1 ${percent}%, #e9ebf1 100%)`;
  $("#budget-value").textContent = formatTokens(value);
  $("#budget-remaining").textContent = `${formatTokens(Math.max(value - safeUsed, 0))} remaining`;
}

function openModal() {
  $("#provider-modal").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#provider-modal").hidden = true;
  document.body.style.overflow = "";
}

$$('[data-toast]').forEach((button) => {
  button.addEventListener("click", () => showToast(button.dataset.toast));
});

$$('[data-agent]').forEach((card) => {
  card.addEventListener("click", () => selectAgent(card.dataset.agent));
});

$$('[data-policy]').forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-policy]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showToast(`${button.dataset.policy} routing enabled`);
  });
});

$("#budget-slider").addEventListener("input", (event) => {
  const value = Number(event.target.value);
  updateBudgetSlider(value);
  showToast(`Builder budget set to ${formatTokens(value)} tokens`);
});

$("#approval-toggle").addEventListener("click", (event) => {
  event.currentTarget.classList.toggle("on");
  showToast(event.currentTarget.classList.contains("on") ? "Approval required before changes" : "Auto-apply enabled for this assignment");
});

$$('[data-view]').forEach((item) => {
  item.addEventListener("click", () => {
    $$('[data-view]').forEach((navItem) => navItem.classList.remove("active"));
    item.classList.add("active");
    $(".breadcrumbs strong").textContent = item.dataset.view;
    showToast(`${item.dataset.view} view selected`);
  });
});

$("#swarm-composer").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = $("#swarm-input");
  const message = input.value.trim();
  if (!message) return;

  const item = document.createElement("div");
  item.className = "activity-item";
  item.innerHTML = `<span class="feed-avatar cobalt">TM</span><div class="activity-copy"><strong>You</strong><span>${message.replace(/[<>]/g, "")}</span><small>just now</small></div><span class="activity-badge plan">NOTE</span>`;
  $("#activity-feed").prepend(item);
  input.value = "";
  showToast("Context added to the active run");
});

$("#new-assignment-button").addEventListener("click", () => showToast("New assignment draft created"));
$("#connect-button").addEventListener("click", openModal);
$("#connect-link").addEventListener("click", openModal);
$("#change-model-button").addEventListener("click", openModal);
$("#model-select").addEventListener("click", openModal);
$("#modal-close").addEventListener("click", closeModal);
$("#provider-modal").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeModal();
});

$$('[data-provider]').forEach((provider) => {
  provider.addEventListener("click", () => {
    closeModal();
    showToast(`${provider.dataset.provider} connection flow started`);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#provider-modal").hidden) closeModal();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    showToast("Command palette coming soon");
  }
});

updateBudgetSlider(24000, agents.builder.used);
