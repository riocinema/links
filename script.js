async function loadContent() {
  try {
    const response = await fetch("content.json");

    if (!response.ok) {
      throw new Error("Could not find content.json");
    }

    const data = await response.json();

    renderFeatured(data.featured || []);
    renderEvents(data.events || []);
    renderMoreLinks(data.moreLinks || []);
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<p style="color:white; font-family:monospace; padding:12px;">
        Content failed to load. Use VS Code Live Server instead of opening index.html directly.
      </p>`
    );
  }
}


function icon(name) {
  return `<span class="material-icons-outlined" aria-hidden="true">${name}</span>`;
}

function renderFeatured(items) {
  const container = document.getElementById("featured-list");
  const activeItems = items.filter(item => item.active !== false);

  container.innerHTML = activeItems.map(item => `
    <a class="featured-link accent-${item.color}" href="${item.url}">
      <span class="featured-icon">
        ${icon(item.icon || "star")}
      </span>

      <span class="featured-copy">
        <span class="label">${item.label}</span>
        <strong>${item.title}</strong>
        ${item.subtitle ? `<small>${item.subtitle}</small>` : ""}
      </span>

      <span class="arrow">${icon("arrow_forward")}</span>
    </a>
  `).join("");
}

function renderEvents(events) {
  const container = document.getElementById("event-list");
  const activeEvents = events.filter(event => event.active !== false);

  container.innerHTML = activeEvents.map(event => `
    <a class="event-link accent-${event.color}" href="${event.url}">
      <span class="calendar">
        <span>${event.day}</span>
        <strong>${event.date}</strong>
        <span>${event.month}</span>
      </span>

      <span class="event-info">
        <span class="label">${event.strand}</span>
        <strong>${event.title}</strong>
        ${event.extra ? `<small>${event.extra}</small>` : ""}
        <em>${event.time}</em>
      </span>

      <span class="arrow">${icon("arrow_forward")}</span>
    </a>
  `).join("");
}

function renderMoreLinks(links) {
  const container = document.getElementById("more-list");
  const activeLinks = links.filter(link => link.active !== false);

  container.innerHTML = activeLinks.map(link => `
    <a class="more-link" href="${link.url}">
      <span class="more-icon">
        ${icon(link.icon || "arrow_forward")}
      </span>
      <strong>${link.title}</strong>
      <span class="arrow">${icon("arrow_forward")}</span>
    </a>
  `).join("");
}

loadContent();