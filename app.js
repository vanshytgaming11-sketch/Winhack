(function () {
  const progress = document.getElementById("progressBar");
  const toTop = document.getElementById("toTop");
  const toggle = document.querySelector(".nav-toggle");
  const navbar = document.querySelector(".navbar");
  const toc = document.getElementById("toc");
  const W = window.Winhack;
  const root = W ? W.rootPrefix() : "";

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const file = href.split("/").pop();
    const here = location.pathname.split("/").pop() || "index.html";
    if (file === here || (here === "" && file === "index.html")) {
      link.classList.add("is-active");
    }
  });

  const nav = document.querySelector(".nav-links");
  if (nav && W && !nav.querySelector('[data-nav="cert"]') && !nav.querySelector('a[href*="certificate.html"]')) {
    const a = document.createElement("a");
    a.href = root + "certificate.html";
    a.textContent = "Certificate";
    a.setAttribute("data-nav", "cert");
    const here = location.pathname.split("/").pop() || "";
    if (here === "certificate.html" || here === "exam.html" || here === "cert.html") {
      a.classList.add("is-active");
    }
    nav.appendChild(a);
  }

  if (document.title.indexOf("Wintor") !== -1 || document.title.indexOf("Winhack") !== -1) {
    document.title = document.title.replace(/Wintor|Winhack/g, "WinHack");
  }

  document.querySelectorAll(".brand").forEach((el) => {
    const t = el.textContent.trim();
    if (t === "Wintor" || t === "Winhack") el.textContent = "WinHack";
  });

  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      const open = navbar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (toTop) toTop.classList.toggle("visible", doc.scrollTop > 420);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement.classList.contains("pre-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "pre-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    wrap.appendChild(btn);

    btn.addEventListener("click", async () => {
      const text = pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const area = document.createElement("textarea");
        area.value = text;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      btn.textContent = "Copied";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 1400);
    });
  });

  document.querySelectorAll("table").forEach((table) => {
    if (table.parentElement.classList.contains("table-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  if (toc) {
    const headings = [...document.querySelectorAll(".lesson h2")];
    if (headings.length) {
      const title = document.createElement("h4");
      title.textContent = "On this page";
      toc.appendChild(title);
      headings.forEach((h, i) => {
        if (!h.id) h.id = "section-" + (i + 1);
        const a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent.replace(/\s+/g, " ").trim();
        toc.appendChild(a);
      });

      const links = [...toc.querySelectorAll("a")];
      const sync = () => {
        let current = headings[0];
        headings.forEach((h) => {
          if (h.getBoundingClientRect().top < 120) current = h;
        });
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + current.id));
      };
      window.addEventListener("scroll", sync, { passive: true });
      sync();
    } else {
      toc.remove();
    }
  }

  function makeBox(id, extraClass) {
    const label = document.createElement("label");
    label.className = "lc-check" + (extraClass ? " " + extraClass : "");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = W.isDone(id);
    input.setAttribute("aria-label", "Mark complete");
    input.addEventListener("change", () => {
      W.setDone(id, input.checked);
      refreshChecks();
    });
    const mark = document.createElement("span");
    mark.className = "lc-box";
    label.appendChild(input);
    label.appendChild(mark);
    return label;
  }

  function refreshChecks() {
    document.querySelectorAll("[data-lesson-id]").forEach((el) => {
      const id = el.getAttribute("data-lesson-id");
      const input = el.querySelector('input[type="checkbox"]');
      if (input) input.checked = W.isDone(id);
    });
    document.querySelectorAll("[data-module-check]").forEach((el) => {
      const n = Number(el.getAttribute("data-module-check"));
      const input = el.querySelector('input[type="checkbox"]');
      if (input) input.checked = W.moduleComplete(n);
    });
    const bar = document.getElementById("trackProgress");
    if (bar) {
      bar.textContent =
        W.completedCount() + " / " + W.LESSONS.length + " topics completed";
    }
    const gate = document.getElementById("certGateNote");
    if (gate) {
      if (W.allComplete()) {
        gate.textContent = "All topics are marked. You can take the certificate test.";
        gate.classList.add("is-ready");
      } else {
        gate.textContent =
          "Check every module and topic like LeetCode before the certificate test unlocks.";
        gate.classList.remove("is-ready");
      }
    }
    const lessonMark = document.getElementById("lessonCompleteLabel");
    if (lessonMark) {
      const id = W.currentLessonId();
      lessonMark.querySelector("input").checked = W.isDone(id);
    }
  }

  if (W) {
    const lessonRoot = document.querySelector(".lesson");
    const lessonId = W.currentLessonId();
    if (lessonRoot && lessonId) {
      const row = document.createElement("label");
      row.className = "lc-check lesson-complete";
      row.id = "lessonCompleteLabel";
      row.setAttribute("data-lesson-id", lessonId);
      row.innerHTML =
        '<input type="checkbox"><span class="lc-box"></span><span class="lc-text">Mark this topic complete</span>';
      const input = row.querySelector("input");
      input.checked = W.isDone(lessonId);
      input.addEventListener("change", () => {
        W.setDone(lessonId, input.checked);
        refreshChecks();
      });
      lessonRoot.insertBefore(row, lessonRoot.firstChild);
    }

    const wrap = document.querySelector(".page-wrap");
    if (wrap && document.querySelector("details a[href*='module']")) {
      const banner = document.createElement("div");
      banner.className = "track-banner";
      banner.innerHTML =
        '<p id="trackProgress"></p><p id="certGateNote"></p>' +
        '<a class="btn" href="certificate.html">Certificate test</a>';
      wrap.insertBefore(banner, wrap.querySelector("details"));

      document.querySelectorAll("details").forEach((block, i) => {
        const summary = block.querySelector("summary");
        if (!summary) return;
        const moduleNum = i + 1;
        const modLabel = document.createElement("label");
        modLabel.className = "lc-check lc-module";
        modLabel.setAttribute("data-module-check", String(moduleNum));
        modLabel.innerHTML = '<input type="checkbox"><span class="lc-box"></span>';
        const modInput = modLabel.querySelector("input");
        modInput.checked = W.moduleComplete(moduleNum);
        modInput.addEventListener("click", (e) => e.stopPropagation());
        modInput.addEventListener("change", () => {
          W.setModule(moduleNum, modInput.checked);
          refreshChecks();
        });
        summary.insertBefore(modLabel, summary.firstChild);

        block.querySelectorAll("p").forEach((p) => {
          const link = p.querySelector("a[href]");
          if (!link) return;
          const id = W.idFromHref(link.getAttribute("href"));
          if (!id) return;
          p.classList.add("lesson-row");
          const box = makeBox(id);
          box.setAttribute("data-lesson-id", id);
          p.insertBefore(box, p.firstChild);
        });
      });
      refreshChecks();
    }

    if (!document.querySelector(".site-footer") && !document.body.classList.contains("exam-page")) {
      const footer = document.createElement("footer");
      footer.className = "site-footer";
      footer.innerHTML =
        "<div class=\"footer-inner\">" +
        "<p class=\"footer-brand\">WinHack</p>" +
        "<p>C++ + DSA interview prep. Made by <strong>Vinit Sharma</strong>.</p>" +
        "<p><a href=\"tel:+919313302407\">+91 9313302407</a> · " +
        "<a href=\"mailto:svinit9889@gmail.com\">svinit9889@gmail.com</a></p>" +
        "<p>Need help with the course or certificate? Call or email. Certificates are issued by WinHack.</p>" +
        "<p class=\"footer-copy\">© 2026 WinHack. All rights reserved.</p>" +
        "</div>";
      document.body.appendChild(footer);
    }

    const certPage = document.getElementById("certLanding");
    if (certPage) {
      const done = W.completedCount();
      const total = W.LESSONS.length;
      document.getElementById("certCount").textContent = done + " / " + total;
      const ready = W.allComplete();
      document.getElementById("certUnlocked").hidden = !ready;
      document.getElementById("startTestBtn").hidden = !ready;
      document.getElementById("certLocked").hidden = ready;
      const user = W.getUser();
      const cert = W.getCert();
      if (user && !W.canTakeExam(user.email)) {
        const wait = document.getElementById("certWait");
        wait.hidden = false;
        wait.textContent =
          "Next attempt for " +
          user.email +
          " opens in " +
          W.formatMs(W.cooldownRemaining(user.email)) +
          ".";
      }
      if (cert) {
        document.getElementById("certExisting").hidden = false;
      }
    }
  }
})();
