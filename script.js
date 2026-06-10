const bbfcRatings = {
  "U": "https://images.savoysystems.co.uk/global/images/bbfc/lrg/U.png",
  "PG": "https://images.savoysystems.co.uk/global/images/bbfc/lrg/PG.png",
  "12A": "https://images.savoysystems.co.uk/global/images/bbfc/lrg/12A.png",
  "15": "https://images.savoysystems.co.uk/global/images/bbfc/lrg/15.png",
  "18": "https://images.savoysystems.co.uk/global/images/bbfc/lrg/18.png",
  "NR": "https://mcusercontent.com/bcd2d958958984b82b6f5e110/images/ded7c49d-4c63-2ea6-a7dc-bb9ff9a16346.png"
};

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

function ratingIcon(rating) {
  if (!rating || !bbfcRatings[rating]) return "";

  return `<img
    class="bbfc-icon"
    src="${bbfcRatings[rating]}"
    alt="${rating}"
    loading="lazy"
  >`;
}

function titleWithRating(title, rating) {
  if (!rating || !bbfcRatings[rating]) return title;

  const icon = ratingIcon(rating);

  return title.replace(/(\S+)$/, `<span class="title-lock">$1${icon}</span>`);
}

function getDateParts(eventDate) {
  const date = new Date(`${eventDate}T12:00:00`);

  return {
    day: date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
    date: date.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: date.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()
  };
}

function getEventStart(event) {
  return new Date(`${event.eventDate}T${event.time}:00`);
}

function isEventVisible(event) {
  return event.active !== false && getEventStart(event) > new Date();
}

function sortEvents(a, b) {
  const aPinned = a.pinned === true;
  const bPinned = b.pinned === true;

  if (aPinned && !bPinned) return -1;
  if (!aPinned && bPinned) return 1;

  return getEventStart(a) - getEventStart(b);
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

  const visibleEvents = events
    .filter(isEventVisible)
    .sort(sortEvents);

  container.innerHTML = visibleEvents.map(event => {
    const dateParts = getDateParts(event.eventDate);

    return `
      <a class="event-link accent-${event.color}" href="${event.url}">
        <span class="calendar">
          <span>${dateParts.day}</span>
          <strong>${dateParts.date}</strong>
          <span>${dateParts.month}</span>
        </span>

        <span class="event-info">
          <span class="label">${event.strand}</span>
          <strong>${titleWithRating(event.title, event.rating)}</strong>
          ${event.extra ? `<small>${event.extra}</small>` : ""}
          <em>${event.time}</em>
        </span>

        <span class="arrow">${icon("arrow_forward")}</span>
      </a>
    `;
  }).join("");
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
