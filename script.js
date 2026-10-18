
const profiles = [
  {
    id: 1,
    name: "Diya",
    bio: "An art lover who saves every pretty little thing.",
    category: "Art",
    interests: ["Art", "Books"],
    photo: "women.jpg"
  },
  {
    id: 2,
    name: "Akash",
    bio: "Music playlists, rainy days and good conversations.",
    category: "Music",
    interests: ["Music", "Travel"],
    photo: "men.jpg"
  },
  {
    id: 3,
    name: "Nandini",
    bio: "Bookshop explorer and amateur photographer.",
    category: "Books",
    interests: ["Books", "Art"],
    photo: "women1.jpg"
  },
  {
    id: 4,
    name: "Nikhil",
    bio: "Always looking for a new song to love.",
    category: "Music",
    interests: ["Music", "Art"],
    photo: "men1.jpg"
  },
  {
    id: 5,
    name: "Sanya",
    bio: "Dreamy skies, little cafés and creative hobbies.",
    category: "Art",
    interests: ["Art", "Travel"],
    photo: "women2.jpg"
  },
  {
    id: 6,
    name: "Rohan",
    bio: "Sketching ideas and collecting good memories.",
    category: "Travel",
    interests: ["Travel", "Music"],
    photo: "men2.jpg"
  },
  {
    id: 7,
    name: "Ananya",
    bio: "Bookstores, long walks and thoughtful chats.",
    category: "Books",
    interests: ["Books", "Travel"],
    photo: "women3.jpg"
  },
  {
    id: 8,
    name: "Karan",
    bio: "Guitar enthusiast and sunset enthusiast.",
    category: "Music",
    interests: ["Music", "Art"],
    photo: "men3.jpg"
  }
];

let activeCategory = "All";
let activePage = "discover";
let matches = [];
let passed = [];
let messages = [];
let customId = 100;

const profilesContainer = document.getElementById("profiles");
const searchInput = document.getElementById("searchInput");
const matchCount = document.getElementById("matchCount");
const resultsCount = document.getElementById("resultsCount");
const discoverPage = document.getElementById("discoverPage");
const otherPage = document.getElementById("otherPage");
const otherContent = document.getElementById("otherContent");
const pageTitle = document.getElementById("pageTitle");
const profileDialog = document.getElementById("profileDialog");
const messageDialog = document.getElementById("messageDialog");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeImageURL(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.origin === window.location.origin) {
      return url.href;
    }
  } catch (_) {}
  return "";
}

function getVisibleProfiles() {
  const query = searchInput.value.trim().toLowerCase();

  return profiles.filter(profile => {
    const matchesCategory =
      activeCategory === "All" ||
      profile.interests.includes(activeCategory) ||
      profile.category === activeCategory;

    const searchable = [
      profile.name,
      profile.bio,
      profile.category,
      ...profile.interests
    ].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(query);
    const notHandled = !passed.includes(profile.id) &&
      !matches.some(match => match.id === profile.id);

    return matchesCategory && matchesSearch && notHandled;
  });
}

function renderProfiles() {
  const visibleProfiles = getVisibleProfiles();

  resultsCount.textContent = `${visibleProfiles.length} profiles`;

  if (!visibleProfiles.length) {
    profilesContainer.innerHTML = `
      <div class="empty-state">
        <h2>No profiles found ♡</h2>
        <p>Try another search or choose a different vibe.</p>
      </div>`;
    return;
  }

  profilesContainer.innerHTML = visibleProfiles.map(profile => {
    const interests = profile.interests
      .map(interest => `<span>${escapeHTML(interest)}</span>`)
      .join("");

    const imageURL = safeImageURL(profile.photo);

    return `
      <article class="profile-card">
        <div class="profile-image">
          <img
            src="${escapeHTML(imageURL)}"
            alt="Profile photo of ${escapeHTML(profile.name)}"
            loading="lazy"
            onerror="this.onerror=null;this.style.visibility='hidden';this.parentElement.classList.add('image-missing')"
          >
          <span class="profile-badge">ZEA COMMUNITY · DEMO</span>
        </div>
        <div class="profile-info">
          <div class="profile-name-row">
            <h2>${escapeHTML(profile.name)}</h2>
            <span class="sparkle">✦</span>
          </div>
          <p>${escapeHTML(profile.bio)}</p>
          <div class="tags">${interests}</div>
          <div class="card-actions">
            <button class="pass-btn" data-action="pass" data-id="${profile.id}">Pass</button>
            <button class="like-btn" data-action="like" data-id="${profile.id}">♡ Like</button>
          </div>
        </div>
      </article>`;
  }).join("");
}

function updateMatchCount() {
  matchCount.textContent = matches.length;
}

function showPage(page) {
  activePage = page;
  discoverPage.hidden = page !== "discover";
  otherPage.hidden = page === "discover";
  document.getElementById("addProfile").hidden = page !== "discover";

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  const titles = {
    discover: "Discover your people",
    matches: "Your matches",
    messages: "Your messages",
    profile: "Your profile"
  };

  pageTitle.textContent = titles[page] || titles.discover;

  if (page === "discover") {
    renderProfiles();
    return;
  }

  if (page === "matches") renderMatches();
  if (page === "messages") renderMessages();
  if (page === "profile") renderMyProfile();
}

function renderMatches() {
  if (!matches.length) {
    otherContent.innerHTML = `
      <div class="empty-state">
        <h2>Your story starts here ♡</h2>
        <p>When you like someone, your demo matches will appear here.</p>
        <button class="primary-button" id="backToDiscover">Explore profiles</button>
      </div>`;
    document.getElementById("backToDiscover").onclick = () => showPage("discover");
    return;
  }

  otherContent.innerHTML = `
    <div class="profiles">
      ${matches.map(profile => `
        <article class="profile-card">
          <div class="profile-image">
            <img src="${escapeHTML(safeImageURL(profile.photo))}" alt="${escapeHTML(profile.name)}">
          </div>
          <div class="profile-info">
            <h2>${escapeHTML(profile.name)}</h2>
            <p>${escapeHTML(profile.bio)}</p>
            <button class="like-btn" data-message="${profile.id}">Say hello ♡</button>
          </div>
        </article>`).join("")}
    </div>`;

  otherContent.querySelectorAll("[data-message]").forEach(button => {
    button.addEventListener("click", () => openMessage(Number(button.dataset.message)));
  });
}

function renderMessages() {
  if (!messages.length) {
    otherContent.innerHTML = `
      <div class="empty-state">
        <h2>It's quiet in here ♡</h2>
        <p>Your demo messages will appear here after you send a hello from a match.</p>
        <button class="primary-button" id="backToMatches">View matches</button>
      </div>`;
    document.getElementById("backToMatches").onclick = () => showPage("matches");
    return;
  }

  otherContent.innerHTML = messages.map(message => `
    <article class="profile-card" style="padding:18px;margin-bottom:12px">
      <h2>${escapeHTML(message.name)}</h2>
      <p>${escapeHTML(message.text)}</p>
      <small style="color:var(--muted)">Demo message · ${escapeHTML(message.time)}</small>
    </article>`).join("");
}

function renderMyProfile() {
  otherContent.innerHTML = `
    <div class="empty-state">
      <h2>Welcome to your little corner ♡</h2>
      <p>This is a frontend demo. Your account and profile aren't connected to a server.</p>
      <button class="primary-button" id="createMyProfile">Add a sample profile</button>
    </div>`;

  document.getElementById("createMyProfile").onclick = () => profileDialog.showModal();
}

profilesContainer.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const profile = profiles.find(item => item.id === id);
  if (!profile) return;

  if (button.dataset.action === "pass") {
    passed.push(id);
  } else if (button.dataset.action === "like") {
    matches.push(profile);
    updateMatchCount();
  }

  renderProfiles();
});

document.getElementById("categories").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll("#categories button").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProfiles();
});

searchInput.addEventListener("input", renderProfiles);

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.getElementById("addProfile").addEventListener("click", () => {
  profileDialog.showModal();
});

document.getElementById("closeDialog").addEventListener("click", () => {
  profileDialog.close();
});

document.getElementById("closeMessage").addEventListener("click", () => {
  messageDialog.close();
});

document.getElementById("profileForm").addEventListener("submit", event => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const bio = String(form.get("bio") || "").trim();
  const photoInput = String(form.get("photo") || "").trim();
  const category = String(form.get("category") || "Art");
  const photo = photoInput ? safeImageURL(photoInput) : "";

  if (!name || !bio) return;

  if (photoInput && !photo) {
    alert("Please use a valid image URL beginning with https://");
    return;
  }

  profiles.unshift({
    id: customId++,
    name,
    bio,
    category,
    interests: [category],
    photo: photo || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85"
  });

  event.currentTarget.reset();
  profileDialog.close();
  activeCategory = "All";

  document.querySelectorAll("#categories button").forEach(button => {
    button.classList.toggle("active", button.dataset.category === "All");
  });

  searchInput.value = "";
  showPage("discover");
});

let currentMessageProfile = null;

function openMessage(id) {
  currentMessageProfile = profiles.find(profile => profile.id === id);
  if (!currentMessageProfile) return;

  document.getElementById("messageTitle").textContent =
    `Say hello to ${currentMessageProfile.name}`;

  document.getElementById("messageDescription").textContent =
    "Send a friendly message in this local demo. Nothing is sent to a real person.";

  document.getElementById("messageText").value = "";
  messageDialog.showModal();
}

document.getElementById("messageForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!currentMessageProfile) return;

  const text = document.getElementById("messageText").value.trim();
  if (!text) return;

  messages.unshift({
    name: currentMessageProfile.name,
    text,
    time: new Date().toLocaleString()
  });

  messageDialog.close();
  currentMessageProfile = null;
  showPage("messages");
});

renderProfiles();
updateMatchCount();
