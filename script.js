const state = {
  content: null,
  currentRoute: "home",
  publications: [],
};

function availablePaths() {
  return state.content.paths.filter((path) => !path.requiresPublications || state.publications.length > 0);
}

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
  if (text) {
    paragraph.textContent = text;
    article.append(paragraph);
  }
  return article;
}

function createLinkMessage(item) {
  const article = document.createElement("article");
  article.className = "message message-received";
  const heading = document.createElement("h2");
  heading.className = "message-title";
  heading.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.summary || "";
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
  if (new URL(item.url, location.href).origin !== location.origin) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  link.textContent = item.label || "abrir conteúdo";
  article.append(heading);
  if (item.summary) article.append(description);
  article.append(link);
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
  paragraph.textContent = item.text || "";
  const list = document.createElement("ul");
  (item.points || []).forEach((point) => {
    const listItem = document.createElement("li");
    listItem.textContent = point;
    list.append(listItem);
  });
  const back = document.createElement("a");
  back.className = "back-link";
  back.href = "./";
  back.textContent = "voltar à conversa";
  back.addEventListener("click", (event) => {
    event.preventDefault();
    navigate("home", { focus: true });
  });
  panel.append(heading);
  if (item.text) panel.append(paragraph);
  if (list.childElementCount) panel.append(list);
  panel.append(back);
  return panel;
}

function createTimeline(entries) {
  const section = document.createElement("section");
  section.className = "reading-panel portfolio-panel";
  section.setAttribute("aria-label", "linha do tempo de trabalhos e projetos");
  const heading = document.createElement("h2");
  heading.textContent = "trabalhos e encontros pelo caminho";
  const list = document.createElement("ol");
  list.className = "timeline";
  let undatedHeadingAdded = false;
  entries.forEach((entry) => {
    if (!entry.date && !undatedHeadingAdded) {
      const divider = document.createElement("li");
      divider.className = "timeline-divider";
      const label = document.createElement("h3");
      label.textContent = "outros percursos";
      divider.append(label);
      list.append(divider);
      undatedHeadingAdded = true;
    }
    const item = document.createElement("li");
    const article = document.createElement("article");
    const date = document.createElement("time");
    date.dateTime = entry.date;
    date.textContent = entry.period || entry.date;
    const title = document.createElement("h3");
    title.textContent = entry.title;
    const description = document.createElement("p");
    description.textContent = entry.description;
    if (entry.date) article.append(date);
    article.append(title, description);
    if (entry.image) {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = entry.image;
      image.alt = entry.image_alt || "";
      image.loading = "lazy";
      image.decoding = "async";
      figure.append(image);
      if (entry.caption) {
        const caption = document.createElement("figcaption");
        caption.textContent = entry.caption;
        figure.append(caption);
      }
      article.append(figure);
    }
    const links = document.createElement("div");
    links.className = "timeline-links";
    (entry.links || []).forEach((resource) => {
      const link = document.createElement("a");
      link.href = resource.url;
      link.textContent = resource.label;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      links.append(link);
    });
    if (links.childElementCount) article.append(links);
    item.append(article);
    list.append(item);
  });
  section.append(heading, list);
  return section;
}

function renderHome() {
  conversation.replaceChildren(
    createMessage(state.content.greeting),
    createMessage(state.content.introduction)
  );
  choices.replaceChildren();
  availablePaths().forEach((path) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = path.label;
    button.addEventListener("click", () => navigate(path.id));
    choices.append(button);
  });
  document.querySelector(".navigation-hint").textContent = "escolha um caminho para continuar.";
  updateCurrentNavigation("home");
}

function renderPath(path) {
  conversation.replaceChildren(
    createMessage(path.label, "sent"),
    createMessage(path.response),
  );
  if (path.reading) conversation.append(createReadingPanel(path.reading));
  if (path.timeline?.length) conversation.append(createTimeline(path.timeline));
  if (path.links) path.links.forEach((item) => conversation.append(createLinkMessage(item)));
  choices.replaceChildren();
  const otherPaths = availablePaths().filter((item) => item.id !== path.id);
  otherPaths.forEach((item) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = item.label;
    button.addEventListener("click", () => navigate(item.id));
    choices.append(button);
  });
  document.querySelector(".navigation-hint").textContent = "você pode mudar de assunto a qualquer momento.";
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
  return availablePaths().some((path) => path.id === route) ? route : "home";
}

function navigate(id, { focus = false, updateUrl = true } = {}) {
  const path = availablePaths().find((item) => item.id === id);
  if (path) renderPath(path);
  else renderHome();
  if (updateUrl) {
    const url = !path ? `${window.location.pathname}${window.location.search}` : `#${id}`;
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
    const manifest = await fetch("posts/manifest.json");
    if (!manifest.ok) throw new Error(`Manifesto de publicações: HTTP ${manifest.status}`);
    state.publications = await manifest.json();
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
      if (link.dataset.nav !== "home") {
        const path = availablePaths().find((item) => item.id === link.dataset.nav);
        link.hidden = !path;
        if (path) link.textContent = path.label;
      }
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(link.dataset.nav, { focus: true });
      });
    });
    renderHome();
    const initialRoute = routeFromLocation();
    if (initialRoute !== "home") navigate(initialRoute, { updateUrl: false });
  } catch (error) {
    conversation.replaceChildren(createMessage("não foi possível carregar esta página. tente atualizar ou escreva para raffael@cuidadosdigitais.com.br."));
    document.querySelector(".navigation-hint").textContent = "conteúdo indisponível.";
    console.error("Falha ao carregar content/site.json:", error);
  }
}

resetButtons.forEach((button) => button.addEventListener("click", resetConversation));
themeButtons.forEach((button) => button.addEventListener("click", cycleTheme));
window.addEventListener("popstate", () => navigate(routeFromLocation(), { updateUrl: false, focus: true }));
window.addEventListener("hashchange", () => navigate(routeFromLocation(), { updateUrl: false, focus: true }));
start();
