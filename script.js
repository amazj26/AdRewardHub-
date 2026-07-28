// ===============================
// AdReward Hub - Frontend Demo
// ===============================

const ads = [
  {
    id: 1,
    title: "Watch Promotional Video",
    description: "Watch this short advertisement and earn a reward.",
    reward: 5,
    icon: "🎬"
  },
  {
    id: 2,
    title: "Discover New Product",
    description: "Learn about a new product and earn coins.",
    reward: 8,
    icon: "🛍️"
  },
  {
    id: 3,
    title: "Technology Advertisement",
    description: "Watch this technology advertisement.",
    reward: 10,
    icon: "💻"
  },
  {
    id: 4,
    title: "Mobile App Promotion",
    description: "Discover a new mobile application.",
    reward: 6,
    icon: "📱"
  },
  {
    id: 5,
    title: "Brand Advertisement",
    description: "Watch this brand promotion to earn coins.",
    reward: 7,
    icon: "⭐"
  },
  {
    id: 6,
    title: "Special Offer",
    description: "View this special promotional offer.",
    reward: 12,
    icon: "🎁"
  }
];

let state = JSON.parse(localStorage.getItem("adRewardState")) || {
  username: "User",
  email: "",
  balance: 0,
  totalEarned: 0,
  adsWatched: 0,
  streak: 1,
  dailyAds: 0,
  totalWithdrawn: 0,
  pendingWithdrawals: 0,
  history: []
};

let currentAd = null;
let timer = null;
let timeLeft = 10;

const $ = id => document.getElementById(id);

function saveState() {
  localStorage.setItem("adRewardState", JSON.stringify(state));
}

function formatNumber(number) {
  return Number(number).toFixed(2);
}

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ===============================
// Navigation
// ===============================

const navLinks = document.querySelectorAll(".nav-link");
const pages = document.querySelectorAll(".page");

function openPage(pageName) {

  pages.forEach(page => {
    page.classList.remove("active-page");
  });

  const page = $(pageName);

  if (page) {
    page.classList.add("active-page");
  }

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.dataset.page === pageName) {
      link.classList.add("active");
    }
  });

  const titles = {
    dashboard: "Dashboard",
    watch: "Watch Ads",
    wallet: "Wallet",
    history: "Earning History",
    withdraw: "Withdraw",
    profile: "Profile"
  };

  $("pageTitle").textContent = titles[pageName] || "Dashboard";

  if (window.innerWidth < 800) {
    $("sidebar").classList.remove("open");
  }

  updateUI();
}

navLinks.forEach(link => {

  link.addEventListener("click", event => {

    event.preventDefault();

    openPage(link.dataset.page);

  });

});

document.querySelectorAll("[data-go]").forEach(button => {

  button.addEventListener("click", () => {

    openPage(button.dataset.go);

  });

});

// ===============================
// Render Ads
// ===============================

function renderAds() {

  const containers = [
    $("dashboardAds"),
    $("allAds")
  ];

  containers.forEach(container => {

    if (!container) return;

    container.innerHTML = "";

    ads.forEach(ad => {

      const card = document.createElement("div");

      card.className = "ad-card";

      card.innerHTML = `
        <div class="ad-banner">${ad.icon}</div>

        <div class="ad-content">
          <h3>${ad.title}</h3>

          <p>${ad.description}</p>

          <div class="ad-footer">
            <span class="reward">+${ad.reward} Coins</span>

            <button class="primary-btn watch-btn">
              Watch Ad
            </button>
          </div>
        </div>
      `;

      card.querySelector(".watch-btn")
        .addEventListener("click", () => startAd(ad));

      container.appendChild(card);

    });

  });

}

// ===============================
// Ad Watching Modal
// ===============================

function startAd(ad) {

  currentAd = ad;

  $("modalAdTitle").textContent = ad.title;

  $("adModal").classList.add("show");

  $("claimReward").disabled = true;

  $("claimReward").textContent = "Watching Ad...";

  timeLeft = 10;

  $("adTimer").textContent = timeLeft;

  $("modalProgress").style.width = "0%";

  clearInterval(timer);

  timer = setInterval(() => {

    timeLeft--;

    $("adTimer").textContent = timeLeft;

    const progress = ((10 - timeLeft) / 10) * 100;

    $("modalProgress").style.width = `${progress}%`;

    if (timeLeft <= 0) {

      clearInterval(timer);

      $("claimReward").disabled = false;

      $("claimReward").textContent =
        `Claim +${ad.reward} Coins`;

    }

  }, 1000);

}

$("closeModal").addEventListener("click", closeModal);

$("adModal").addEventListener("click", event => {

  if (event.target === $("adModal")) {
    closeModal();
  }

});

function closeModal() {

  clearInterval(timer);

  $("adModal").classList.remove("show");

}

// ===============================
// Claim Reward
// ===============================

$("claimReward").addEventListener("click", () => {

  if (!currentAd) return;

  state.balance += currentAd.reward;

  state.totalEarned += currentAd.reward;

  state.adsWatched++;

  state.dailyAds++;

  state.history.unshift({

    activity: currentAd.title,

    date: new Date().toLocaleString(),

    reward: currentAd.reward,

    status: "Completed"

  });

  saveState();

  closeModal();

  showToast(`🎉 +${currentAd.reward} Coins added to your balance!`);

  updateUI();

});

// ===============================
// Update UI
// ===============================

function updateUI() {

  $("balance").textContent = formatNumber(state.balance);

  $("walletBalance").textContent = formatNumber(state.balance);

  $("withdrawBalance").textContent = formatNumber(state.balance);

  $("totalEarned").textContent = formatNumber(state.totalEarned);

  $("walletTotalEarned").textContent =
    `${formatNumber(state.totalEarned)} Coins`;

  $("adsWatched").textContent = state.adsWatched;

  $("dailyAds").textContent = state.dailyAds;

  $("streak").textContent = state.streak;

  $("totalWithdrawn").textContent =
    `${formatNumber(state.totalWithdrawn)} Coins`;

  $("pendingWithdrawals").textContent =
    `${formatNumber(state.pendingWithdrawals)} Coins`;

  $("username").textContent = state.username;

  $("topUsername").textContent = state.username;

  $("profileName").textContent = state.username;

  $("profileUsername").value = state.username;

  $("profileEmail").value = state.email;

  const progress = Math.min((state.dailyAds / 20) * 100, 100);

  $("progressFill").style.width = `${progress}%`;

  renderHistory();

  renderActivity();

}

// ===============================
// History
// ===============================

function renderHistory() {

  const table = $("historyTable");

  table.innerHTML = "";

  if (state.history.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:#7b8494;">
          No earning history yet.
        </td>
      </tr>
    `;

    return;

  }

  state.history.forEach(item => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.activity}</td>
      <td>${item.date}</td>
      <td>+${item.reward} Coins</td>
      <td class="status">${item.status}</td>
    `;

    table.appendChild(row);

  });

}

// ===============================
// Recent Activity
// ===============================

function renderActivity() {

  const box = $("dashboardActivity");

  if (state.history.length === 0) {

    box.innerHTML = `
      <p class="empty-state">
        No activity yet. Start watching ads to earn coins.
      </p>
    `;

    return;

  }

  box.innerHTML = "";

  state.history.slice(0, 5).forEach(item => {

    const div = document.createElement("div");

    div.style.padding = "17px 20px";

    div.style.borderBottom = "1px solid var(--border)";

    div.innerHTML = `
      <strong>${item.activity}</strong>
      <br>
      <small style="color:var(--muted)">
        ${item.date}
      </small>
      <strong style="float:right;color:#18a673">
        +${item.reward} Coins
      </strong>
    `;

    box.appendChild(div);

  });

}

// ===============================
// Withdraw
// ===============================

$("withdrawBtn").addEventListener("click", () => {

  const amount = Number($("withdrawAmount").value);

  const account = $("accountDetails").value.trim();

  if (!account) {

    showToast("Please enter your payment account.");

    return;

  }

  if (!amount || amount <= 0) {

    showToast("Please enter a valid withdrawal amount.");

    return;

  }

  if (amount > state.balance) {

    showToast("Insufficient balance.");

    return;

  }

  state.balance -= amount;

  state.pendingWithdrawals += amount;

  saveState();

  $("withdrawAmount").value = "";

  $("accountDetails").value = "";

  showToast("Withdrawal request submitted successfully.");

  updateUI();

});

// ===============================
// Profile
// ===============================

$("saveProfile").addEventListener("click", () => {

  const username = $("profileUsername").value.trim();

  const email = $("profileEmail").value.trim();

  if (!username) {

    showToast("Username cannot be empty.");

    return;

  }

  state.username = username;

  state.email = email;

  saveState();

  updateUI();

  showToast("Profile updated successfully.");

});

// ===============================
// Dark Mode
// ===============================

$("themeToggle").addEventListener("click", () => {

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark")
  );

});

if (localStorage.getItem("darkMode") === "true") {

  document.body.classList.add("dark");

}

// ===============================
// Mobile Menu
// ===============================

$("menuBtn").addEventListener("click", () => {

  $("sidebar").classList.toggle("open");

});

// ===============================
// Logout Demo
// ===============================

$("logoutBtn").addEventListener("click", () => {

  showToast("Logout functionality requires backend authentication.");

});

// ===============================
// Start App
// ===============================

renderAds();

updateUI();