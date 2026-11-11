const CONTACT_EMAIL = "deepakchaudhary954864@gmail.com";
const WHATSAPP_NUMBER = "919548645750";

// Optional EmailJS configuration: load the EmailJS SDK in index.html and replace these placeholders to send via API.
const EMAILJS_CONFIG = {
  serviceId: "YOUR_SERVICE_ID",
  templateId: "YOUR_TEMPLATE_ID",
};

function initTypingAnimation() {
  const typingElement = document.getElementById("typed-text");
  if (!typingElement) return;

  const phrases = [
    "Data Analytics & MIS Specialist",
    "Team Lead & Audit Operations",
    "Power BI, SQL & Excel Analyst",
    "Google Sheets Automation Expert",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
      typingElement.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, 300);
        return;
      }

      setTimeout(tick, 50);
      return;
    }

    charIndex += 1;
    typingElement.textContent = currentPhrase.slice(0, charIndex);

    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(tick, 1200);
      return;
    }

    setTimeout(tick, 95);
  }

  tick();
}

function initDarkMode() {
  const toggleButton = document.getElementById("dark-mode-toggle");
  if (!toggleButton) return;

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    toggleButton.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    toggleButton.setAttribute("aria-pressed", String(isDark));
    toggleButton.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  const savedTheme = localStorage.getItem("theme");
  applyTheme(savedTheme === "dark");

  toggleButton.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (!menuToggle || !navLinks) return;

  function setMenuOpen(isOpen) {
    navLinks.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = !navLinks.classList.contains("is-open");
    setMenuOpen(isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const whatsappBtn = document.getElementById("send-whatsapp-btn");
  if (!contactForm || !statusEl) return;

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = "form-status";
    if (type) {
      statusEl.classList.add(`form-status--${type}`);
    }
  }

  function getValidatedFields() {
    const name = contactForm.elements.name.value.trim();
    const email = contactForm.elements.email.value.trim();
    const message = contactForm.elements.message.value.trim();

    if (!name || !email || !message) {
      setStatus("Please fill in your name, email, and message.", "error");
      return null;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      setStatus("Please enter a valid email address.", "error");
      return null;
    }

    return { name, email, message };
  }

  whatsappBtn?.addEventListener("click", () => {
    const fields = getValidatedFields();
    if (!fields) return;

    const text = encodeURIComponent(
      `Hi Deepak, I am ${fields.name} (${fields.email}).\n\n${fields.message}`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
    setStatus("Opening WhatsApp chat with your message.", "success");
    contactForm.reset();
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = getValidatedFields();
    if (!fields) return;

    const { name, email, message } = fields;

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const isEmailJsConfigured =
      typeof window.emailjs !== "undefined" &&
      EMAILJS_CONFIG.serviceId !== "YOUR_SERVICE_ID" &&
      EMAILJS_CONFIG.templateId !== "YOUR_TEMPLATE_ID";

    if (isEmailJsConfigured) {
      submitButton.disabled = true;
      setStatus("Sending message...", "");

      try {
        await window.emailjs.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          contactForm
        );
        setStatus("Message sent successfully!", "success");
        contactForm.reset();
      } catch (_error) {
        setStatus("Failed to send message. Please try again later.", "error");
      } finally {
        submitButton.disabled = false;
      }
      return;
    }

    const isHostedHttp =
      window.location.protocol.startsWith("http") &&
      !["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (isHostedHttp) {
      submitButton.disabled = true;
      setStatus("Sending message...", "");

      try {
        const formData = new FormData(contactForm);
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(formData).toString(),
        });

        if (response.ok) {
          setStatus("Message sent successfully! Thank you for reaching out.", "success");
          contactForm.reset();
          return;
        }
      } catch (_error) {
        // Fall through to mailto client fallback if form endpoint is unavailable.
      } finally {
        submitButton.disabled = false;
      }
    }

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("Opening your email client to send the message.", "success");
    contactForm.reset();
  });
}

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const statusEl = document.getElementById("project-filter-status");
  if (!filterButtons.length || !projectCards.length) return;

  function applyFilter(selected, activeButton) {
    filterButtons.forEach((btn) => {
      const isActive = btn === activeButton;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    let visibleCount = 0;
    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      const matches = selected === "all" || categories.includes(selected);
      card.hidden = !matches;
      card.classList.toggle("is-hidden", !matches);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount += 1;
    });

    if (statusEl) {
      statusEl.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
    }

    if (typeof window.AOS !== "undefined") {
      window.AOS.refresh();
    }
  }

  filterButtons.forEach((button) => {
    const filterKey = button.dataset.filter;
    const matchCount = Array.from(projectCards).filter((card) => {
      const categories = (card.dataset.category || "").split(/\s+/);
      return filterKey === "all" || categories.includes(filterKey);
    }).length;
    const baseLabel = button.textContent.trim();
    button.textContent = `${baseLabel} (${matchCount})`;

    button.addEventListener("click", () => {
      applyFilter(button.dataset.filter, button);
    });
  });

  applyFilter("all", filterButtons[0]);
}

function initToolBreakdowns() {
  const tabButtons = document.querySelectorAll(".breakdown-tab");
  const panels = document.querySelectorAll(".tl-breakdown");
  if (!tabButtons.length || !panels.length) return;

  const panelIds = new Set(Array.from(panels).map((panel) => panel.id));

  function activateBreakdown(targetId) {
    if (!panelIds.has(targetId)) return;

    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.breakdown === targetId;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === targetId);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateBreakdown(button.dataset.breakdown);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const hashId = link.getAttribute("href").slice(1);
    if (!panelIds.has(hashId)) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      activateBreakdown(hashId);
      const container = document.getElementById("tool-breakdowns");
      container?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initScrollFeatures() {
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");
  const navLinks = document.querySelectorAll('#nav-links a[href^="#"]');
  const sections = document.querySelectorAll("main section[id]");

  function updateScrollState() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${pct}%`;
    }
    if (backToTop) {
      backToTop.classList.toggle("is-visible", scrollTop > 400);
    }
  }

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const activeHref = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }
}

function initCopyEmail() {
  const copyBtn = document.getElementById("copy-email-btn");
  if (!copyBtn) return;

  const defaultHtml = copyBtn.innerHTML;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      copyBtn.classList.add("is-copied");
      copyBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Email Copied!';
      setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        copyBtn.innerHTML = defaultHtml;
      }, 2200);
    } catch (_error) {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  });
}

function initSampleDashboard() {
  const buttons = document.querySelectorAll(".dash-filter");
  const recordsEl = document.getElementById("dash-kpi-records");
  const flaggedEl = document.getElementById("dash-kpi-flagged");
  const complianceEl = document.getElementById("dash-kpi-compliance");
  const tatEl = document.getElementById("dash-kpi-tat");
  const barsEl = document.getElementById("dash-bars");
  if (!buttons.length || !recordsEl || !barsEl) return;

  const SAMPLE_CHANNELS = {
    all: {
      records: "1,480",
      flagged: "64",
      compliance: "95.7%",
      tat: "4.2 hrs",
      bars: [
        { label: "Dealership Process Audit", pct: 96 },
        { label: "Inventory Verification", pct: 94 },
        { label: "Discount & Commission Check", pct: 92 },
        { label: "NPS & Onboarding SLA", pct: 97 },
      ],
    },
    sales: {
      records: "620",
      flagged: "28",
      compliance: "95.5%",
      tat: "3.8 hrs",
      bars: [
        { label: "Dealership Billing Accuracy", pct: 96 },
        { label: "Discount Leakage Control", pct: 93 },
        { label: "Commission Verification", pct: 95 },
        { label: "Price List Alignment", pct: 98 },
      ],
    },
    aftersales: {
      records: "490",
      flagged: "24",
      compliance: "95.1%",
      tat: "4.5 hrs",
      bars: [
        { label: "After-Sales Audit Compliance", pct: 95 },
        { label: "Inventory Reconciliation", pct: 93 },
        { label: "Escalation Resolution", pct: 96 },
        { label: "MIS Daily Turnaround", pct: 97 },
      ],
    },
    onboarding: {
      records: "370",
      flagged: "12",
      compliance: "96.8%",
      tat: "3.5 hrs",
      bars: [
        { label: "NPS Management Audit", pct: 97 },
        { label: "Walk-in Onboarding Target", pct: 98 },
        { label: "Installation Scheduling", pct: 95 },
        { label: "Pending Case Closure", pct: 96 },
      ],
    },
  };

  function renderChannel(channelKey) {
    const data = SAMPLE_CHANNELS[channelKey] || SAMPLE_CHANNELS.all;
    recordsEl.textContent = data.records;
    flaggedEl.textContent = data.flagged;
    complianceEl.textContent = data.compliance;
    tatEl.textContent = data.tat;

    barsEl.innerHTML = data.bars
      .map(
        (bar) => `
        <div class="dash-bar-row">
          <span class="dash-bar-label">${bar.label}</span>
          <div class="dash-bar-track" role="progressbar" aria-valuenow="${bar.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${bar.label}">
            <div class="dash-bar-fill" style="width: ${bar.pct}%"></div>
          </div>
          <span class="dash-bar-val">${bar.pct}%</span>
        </div>`
      )
      .join("");
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.channel;
      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
      renderChannel(selected);
    });
  });

  renderChannel("all");
}

function initCaseStudyModal() {
  const modal = document.getElementById("case-study-modal");
  const closeBtn = document.getElementById("modal-close");
  const badgeEl = document.getElementById("modal-badge");
  const titleEl = document.getElementById("modal-title");
  const summaryEl = document.getElementById("modal-summary");
  const problemEl = document.getElementById("modal-problem");
  const approachEl = document.getElementById("modal-approach");
  const pointsEl = document.getElementById("modal-points");
  const reportsEl = document.getElementById("modal-reports");
  const toolsEl = document.getElementById("modal-tools");
  const liveLink = document.getElementById("modal-live-link");
  const expLink = document.getElementById("modal-exp-link");
  const contactLink = document.getElementById("modal-contact-link");
  const triggers = document.querySelectorAll(".case-study-btn");
  if (!modal || !triggers.length) return;

  const CASE_STUDIES = {
    "sales-audit": {
      badge: "AVA Global Alliance • Team Lead & Auditor",
      title: "Sales & After-Sales Audit MIS Dashboards",
      summary:
        "Led dealership audit operations and automated MIS dashboards to strengthen audit controls, data accuracy, and management visibility.",
      problem:
        "Dealership sales and after-sales records involve high transaction volume where manual checks risk missing discount leakage, inventory variances, or commission errors.",
      approach:
        "Standardized audit workflows across the team, ran SQL & Advanced Excel discrepancy audits, and consolidated performance metrics into Power BI, Excel, and Google Sheets dashboards.",
      points: [
        "Managed Sales & After-Sales audit operations covering dealership processes, inventory verification, sales performance, discount leakage, and commission calculations.",
        "Coordinated the audit team, assigned daily tasks, and tracked timely completion with compliance checks.",
        "Identified data discrepancies using Advanced Excel and SQL to improve operational efficiency.",
        "Built automated reporting dashboards and MIS reports in Google Sheets, Excel, and Power BI.",
      ],
      reports: [
        "Sales & After-Sales Audit Report",
        "Discount Leakage & Commission Sheet",
        "Inventory Verification Log",
        "Executive Power BI KPI Dashboard",
      ],
      tools: ["Power BI", "SQL (MySQL)", "Advanced Excel", "Google Sheets", "KPI Tracking"],
    },
    "sheets-automation": {
      badge: "AVA Global Alliance • Process Automation",
      title: "Automated Google Sheets & PPT Workflows",
      summary:
        "Designed Google Sheets and Apps Script automations alongside executive PPT workflows to eliminate repetitive manual reporting tasks.",
      problem:
        "Recurring MIS summaries, project price lists, and management presentations require repetitive manual updates across sheets that can introduce formatting or data errors.",
      approach:
        "Built structured Google Sheets templates paired with Google Apps Script automations to process raw entries, validate price lists, and generate consistent MIS and PPT management outputs.",
      points: [
        "Developed and implemented Google Sheets automations aligned with business workflows to reduce manual effort and improve data accuracy.",
        "Built automated MIS summaries and management reporting decks for leadership reviews.",
        "Prepared executive PowerPoint audit summaries and analytical presentations while maintaining accurate project price lists.",
      ],
      reports: [
        "Automated Google Sheet Tracker",
        "Executive PPT Audit Summaries",
        "Project Price List Master",
        "Management MIS Reports",
      ],
      tools: ["Google Apps Script", "Google Sheets", "PowerPoint", "Automated MIS", "Data Cleaning"],
      liveUrl: "https://docs.google.com/spreadsheets/d/1tnLQ2Wfta2dnkbdS8GAkd81BRdyDZGx-iC4YAuDKxIM/edit?gid=817482066#gid=817482066",
      liveLabel: "Open Google Sheet",
    },
    "nps-ops": {
      badge: "IEnergizer & Urban Company • Operations & Quality",
      title: "NPS Management Audits & Operations Tracking",
      summary:
        "Managed customer onboarding, service quality audits, installation coordination, and daily MIS tracking across field operations.",
      problem:
        "Multi-party installations (Wall/PVC panels and RO water purifiers) require tight coordination across customers, carpenters/field partners, logistics, and daily escalation tracking.",
      approach:
        "Tracked pending cases and installation statuses through daily MIS logs, ran NPS Management Audits for compliance, and prioritized urgent customer escalations.",
      points: [
        "Conducted NPS Management Audits at IEnergizer to review service quality, customer satisfaction, and process compliance for Wall & PVC Panel installations.",
        "Coordinated installations, materials, manpower, and logistics while achieving a daily target of 3 office walk-in onboardings.",
        "Managed RO Water Purifier customer escalations at Urban Company, prioritizing urgent installations with service partners and field teams.",
        "Monitored daily operational records, pending cases, and daily MIS reporting.",
      ],
      reports: [
        "NPS Management Audit Report",
        "Daily Walk-in Onboarding Tracker",
        "Installation & Pending-Case MIS",
        "Escalation Resolution Log",
      ],
      tools: ["NPS Audits", "Operations MIS", "Root Cause Analysis", "KPI Monitoring", "Escalation Handling"],
    },
  };

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function openModal(caseKey) {
    const item = CASE_STUDIES[caseKey];
    if (!item) return;

    badgeEl.textContent = item.badge;
    titleEl.textContent = item.title;
    summaryEl.textContent = item.summary;
    if (problemEl) problemEl.textContent = item.problem;
    if (approachEl) approachEl.textContent = item.approach;
    pointsEl.innerHTML = item.points.map((pt) => `<li>${pt}</li>`).join("");
    if (reportsEl) {
      reportsEl.innerHTML = item.reports.map((rep) => `<span>${rep}</span>`).join("");
    }
    toolsEl.innerHTML = item.tools.map((tool) => `<span>${tool}</span>`).join("");

    if (liveLink) {
      if (item.liveUrl) {
        liveLink.href = item.liveUrl;
        liveLink.textContent = item.liveLabel || "Open Resource";
        liveLink.hidden = false;
      } else {
        liveLink.hidden = true;
      }
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.case));
  });

  closeBtn?.addEventListener("click", closeModal);
  expLink?.addEventListener("click", closeModal);
  contactLink?.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });
}

function initAOS() {
  if (typeof window.AOS === "undefined") return;

  window.AOS.init({
    duration: 800,
    once: true,
    disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

function initFooterYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

initTypingAnimation();
initDarkMode();
initMobileMenu();
initProjectFilters();
initToolBreakdowns();
initSampleDashboard();
initCaseStudyModal();
initScrollFeatures();
initCopyEmail();
initContactForm();
initAOS();
initFooterYear();
