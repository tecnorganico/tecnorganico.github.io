const state = {
  content: null,
  currentRoute: "home",
};

const conversation = document.querySelector("[data-conversation]");
const choices = document.querySelector("[data-choices]");
const resetButtons = document.querySelectorAll("[data-reset]");
const themeButtons = document.querySelectorAll("[data-theme-toggle]");

function createMessage(text, type = "received", title = "") {
  const article = document.createElement("article");
  article.className = `message message-${type}`;
  if (title) {
    const heading = document.createElement("h2");
    heading.className = "message-title";
    heading.textContent = title;
    article.append(heading);
  }
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  article.append(paragraph);
  return article;
}

function createLinkMessage(item) {
  const article = document.createElement("article");
  article.className = "message message-received";
  const heading = document.createElement("h2");
  heading.className = "message-title";
  heading.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.summary;
  if (item.address) {
    const address = document.createElement("address");
    const code = document.createElement("code");
    code.textContent = item.address;
    const copy = document.createElement("button");
    copy.className = "copy-button";
    copy.type = "button";
    copy.textContent = "copiar";
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(item.address);
        copy.textContent = "copiado";
      } catch (error) {
        copy.textContent = "selecione para copiar";
        console.error("Falha ao copiar endereço:", error);
      }
    });
    address.append(code, copy);
    article.append(address);
  }
  const link = document.createElement("a");
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = item.label || "Abrir conteúdo";
  article.append(heading, description, link);
  if (item.date) {
    const meta = document.createElement("p");
    meta.className = "message-meta";
    meta.textContent = item.date;
    article.append(meta);
  }
  if (item.primary) article.classList.add("message-primary");
  return article;
}

function createReadingPanel(item) {
  const panel = document.createElement("section");
  panel.className = "reading-panel";
  panel.setAttribute("tabindex", "-1");
  const heading = document.createElement("h2");
  heading.textContent = item.title;
  const paragraph = document.createElement("p");
  paragraph.textContent = item.text;
  const list = document.createElement("ul");
  item.points.forEach((point) => {
    const listItem = document.createElement("li");
    listItem.textContent = point;
    list.append(listItem);
  });
  const back = document.createElement("a");
  back.className = "back-link";
  back.href = "./";
  back.textContent = "Voltar à conversa";
  back.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("home", { focus: true });
  });
  panel.append(heading, paragraph, list, back);
  return panel;
}

function renderHome() {
  conversation.replaceChildren(
    createMessage(state.content.greeting),
    createMessage(state.content.introduction)
  );
  choices.replaceChildren();
  state.content.paths.forEach((path) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = path.label;
    button.addEventListener("click", () => navigate(path.id));
    choices.append(button);
  });
  document.querySelector(".navigation-hint").textContent = "Escolha um caminho para continuar.";
  updateCurrentNavigation("home");
}

function renderPath(path) {
  conversation.replaceChildren(
    createMessage(path.label, "sent"),
    createMessage(path.response),
  );
  if (path.reading) conversation.append(createReadingPanel(path.reading));
  if (path.links) path.links.forEach((item) => conversation.append(createLinkMessage(item)));
  choices.replaceChildren();
  const otherPaths = state.content.paths.filter((item) => item.id !== path.id);
  otherPaths.forEach((item) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = item.label;
    button.addEventListener("click", () => navigate(item.id));
    choices.append(button);
  });
  document.querySelector(".navigation-hint").textContent = "Você pode mudar de assunto a qualquer momento.";
  updateCurrentNavigation(path.id);
  conversation.lastElementChild?.scrollIntoView({ block: "nearest" });
}

function updateCurrentNavigation(id) {
  state.currentRoute = id;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === id) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function routeFromLocation() {
  const route = window.location.hash.slice(1);
  return state.content.paths.some((path) => path.id === route) ? route : "home";
}

function navigate(id, { focus = false, updateUrl = true } = {}) {
  const path = state.content.paths.find((item) => item.id === id);
  if (path) renderPath(path);
  else renderHome();
  if (updateUrl) {
    const url = id === "home" ? `${window.location.pathname}${window.location.search}` : `#${id}`;
    window.history.pushState({ route: id }, "", url);
  }
  document.querySelector("#conversa").scrollIntoView({ block: "start" });
  if (focus) document.querySelector("[data-choices] button")?.focus();
}

function resetConversation(event) {
  event?.preventDefault();
  navigate("home", { focus: true });
}

function cycleTheme() {
  const root = document.documentElement;
  const themes = ["classic", "night", "olive"];
  const next = themes[(themes.indexOf(root.dataset.theme || "classic") + 1) % themes.length];
  root.dataset.theme = next;
  themeButtons.forEach((button) => {
    button.textContent = next === "classic" ? "tema" : next === "night" ? "tema escuro" : "tema oliva";
    button.setAttribute("aria-label", `Tema atual: ${next}. Mudar tema visual`);
  });
}

async function start() {
  try {
    const response = await fetch("content/site.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.content = await response.json();
    document.querySelectorAll("[data-site-name]").forEach((element) => {
      element.textContent = state.content.identity.name;
    });
    document.querySelectorAll("[data-site-signature]").forEach((element) => {
      element.textContent = state.content.identity.signature;
    });
    document.querySelectorAll("[data-site-subtitle]").forEach((element) => {
      element.textContent = state.content.identity.subtitle;
    });
    document.querySelectorAll("[data-site-photo]").forEach((element) => {
      element.src = state.content.photo.src;
      element.alt = state.content.photo.alt;
    });
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(link.dataset.nav, { focus: true });
      });
    });
    renderHome();
    const initialRoute = routeFromLocation();
    if (initialRoute !== "home") navigate(initialRoute, { updateUrl: false });
  } catch (error) {
    conversation.replaceChildren(createMessage("Não foi possível carregar o conteúdo deste protótipo. Verifique se ele está sendo servido por um servidor local."));
    document.querySelector(".navigation-hint").textContent = "Conteúdo indisponível.";
    console.error("Falha ao carregar content/site.json:", error);
  }
}

resetButtons.forEach((button) => button.addEventListener("click", resetConversation));
themeButtons.forEach((button) => button.addEventListener("click", cycleTheme));
window.addEventListener("popstate", () => navigate(routeFromLocation(), { updateUrl: false, focus: true }));
window.addEventListener("hashchange", () => navigate(routeFromLocation(), { updateUrl: false, focus: true }));
start();
