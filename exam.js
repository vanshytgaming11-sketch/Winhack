(function () {
  const QUESTIONS = [
    {
      q: "C++ source becomes a runnable program mainly through which process?",
      options: ["Interpretation at runtime", "Compilation and linking", "Just-in-time bytecode only", "Markup preprocessing"],
      a: 1
    },
    {
      q: "Which statement about `new` vs `malloc` in C++ is correct?",
      options: [
        "They are identical in every way",
        "`malloc` calls constructors; `new` does not",
        "`new` always returns void*",
        "`new` calls constructors; `malloc` does not"
      ],
      a: 3
    },
    {
      q: "A virtual destructor in a base class is needed so that:",
      options: [
        "The class cannot be copied",
        "Derived destructors run when deleting through a base pointer",
        "Stack allocation is forbidden",
        "Templates become faster"
      ],
      a: 1
    },
    {
      q: "RAII means a resource is tied to:",
      options: ["Object lifetime (constructor and destructor)", "A global registry only", "The preprocessor", "A separate GC thread"],
      a: 0
    },
    {
      q: "`std::unique_ptr` is best described as:",
      options: [
        "Shared ownership with a control block",
        "Exclusive ownership that can be moved, not copied",
        "A raw pointer alias with no destructor",
        "A circular-reference fixer by default"
      ],
      a: 1
    },
    {
      q: "A move constructor typically:",
      options: [
        "Deep-copies every member",
        "Deletes the object immediately",
        "Steals resources from an rvalue and leaves it in a valid state",
        "Converts types with dynamic_cast"
      ],
      a: 2
    },
    {
      q: "Average-case append at the end of `std::vector` is:",
      options: ["O(n)", "O(log n)", "Amortized O(1)", "O(n log n)"],
      a: 2
    },
    {
      q: "`std::map` vs `std::unordered_map` — which is true?",
      options: [
        "map keeps keys ordered; unordered_map is hash-based",
        "map is hash-based; unordered_map is a balanced tree",
        "Both always guarantee O(1) worst-case lookup",
        "unordered_map cannot store custom types even with a hash"
      ],
      a: 0
    },
    {
      q: "Binary search on a sorted array of n elements is:",
      options: ["O(n)", "O(1)", "O(n^2)", "O(log n)"],
      a: 3
    },
    {
      q: "BFS on an unweighted graph is typically used to find:",
      options: [
        "Longest path in a DAG only",
        "Shortest path in number of edges",
        "Minimum spanning tree always",
        "Topological order of any cyclic graph"
      ],
      a: 1
    },
    {
      q: "Dynamic programming is a fit when a problem has:",
      options: [
        "Only greedy local choices with no overlap",
        "No recursive structure",
        "Optimal substructure and overlapping subproblems",
        "Only O(1) extra memory always"
      ],
      a: 2
    },
    {
      q: "In Union-Find, path compression makes `find`:",
      options: ["Always O(n)", "Nearly amortized constant in practice", "Quadratic", "Unable to union two sets"],
      a: 1
    },
    {
      q: "A lambda written `[x, &y]` means:",
      options: [
        "Capture x by reference and y by value",
        "Capture nothing",
        "Capture the whole object by move only",
        "Capture x by value and y by reference"
      ],
      a: 3
    },
    {
      q: "`auto` in C++ mainly:",
      options: [
        "Deduces the type at compile time",
        "Changes runtime types dynamically",
        "Turns variables into variants",
        "Disables type checking"
      ],
      a: 0
    },
    {
      q: "A stack is LIFO. A queue is:",
      options: ["LIFO", "Random access only", "FIFO", "Always sorted"],
      a: 2
    },
    {
      q: "A binary heap is commonly used to implement:",
      options: ["A hash table", "A priority queue", "A circular doubly list only", "BFS layering"],
      a: 1
    },
    {
      q: "A trie is especially useful for:",
      options: ["Sorting integers in O(1)", "Finding MST", "Prefix search over strings", "Cycle detection in undirected graphs only"],
      a: 2
    },
    {
      q: "`try` / `catch` in C++ handles:",
      options: ["Preprocessor errors", "Linker errors only", "Exceptions thrown at runtime", "Syntax errors before compile"],
      a: 2
    },
    {
      q: "A copy constructor is invoked when:",
      options: [
        "An object is initialized from another object of the same type",
        "Only when `new` is used",
        "Only during template instantiation",
        "Never, if a destructor exists"
      ],
      a: 0
    },
    {
      q: "A cycle in a directed graph can be detected with:",
      options: [
        "Binary search on the adjacency list",
        "DFS and a recursion/color stack (gray nodes)",
        "Counting connected components only",
        "A single BFS that ignores back edges"
      ],
      a: 1
    }
  ];

  const W = window.Winhack;
  const total = QUESTIONS.length;
  let index = 0;
  let answers = Array(total).fill(null);
  let started = false;
  let submitted = false;
  let armed = false;
  let pendingFail = false;

  const el = (id) => document.getElementById(id);

  function showError(msg) {
    const box = el("examError");
    box.hidden = false;
    box.querySelector("p").textContent = msg;
  }

  function hideError() {
    el("examError").hidden = true;
  }

  function render() {
    const q = QUESTIONS[index];
    el("qIndex").textContent = "Question " + (index + 1) + " of " + total;
    el("qText").textContent = q.q;
    const opts = el("qOptions");
    opts.innerHTML = "";
    q.options.forEach((text, i) => {
      const id = "opt-" + index + "-" + i;
      const label = document.createElement("label");
      label.className = "exam-option";
      if (answers[index] === i) label.classList.add("is-picked");
      label.innerHTML =
        '<input type="radio" name="answer" value="' +
        i +
        '" id="' +
        id +
        '"><span>' +
        text +
        "</span>";
      const input = label.querySelector("input");
      if (answers[index] === i) input.checked = true;
      input.addEventListener("change", () => {
        answers[index] = i;
        opts.querySelectorAll(".exam-option").forEach((n) => n.classList.remove("is-picked"));
        label.classList.add("is-picked");
        updateNav();
      });
      opts.appendChild(label);
    });
    el("prevBtn").disabled = index === 0;
    el("nextBtn").textContent = index === total - 1 ? "Review" : "Next";
    el("nextBtn").hidden = index === total - 1;
    el("submitBtn").hidden = index !== total - 1;
    const bar = el("examProgress").querySelector("span");
    bar.style.width = ((index + 1) / total) * 100 + "%";
    updateNav();
  }

  function updateNav() {
    const filled = answers.filter((a) => a !== null).length;
    el("answeredMeta").textContent = filled + " / " + total + " answered";
  }

  function score() {
    let s = 0;
    QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.a) s += 1;
    });
    return s;
  }

  function finish(reason) {
    if (submitted) return;
    submitted = true;
    started = false;
    armed = false;
    const user = W.getUser();
    if (user && user.email) W.recordAttempt(user.email);

    const s = reason === "violation" ? 0 : score();
    const passed = s >= W.PASS_SCORE;
    if (passed && user) {
      W.saveCert({
        name: user.name,
        email: user.email,
        score: s,
        total: total,
        date: new Date().toISOString(),
        id: "WH-" + Date.now().toString(36).toUpperCase()
      });
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    hideError();
    el("examStage").hidden = true;
    el("examResult").hidden = false;
    document.body.classList.remove("exam-lock");
    const title = el("resultTitle");
    const body = el("resultBody");
    if (reason === "violation") {
      title.textContent = "Exam ended";
      body.textContent =
        "You left or changed the exam window. The attempt is recorded as 0. This email can try again after one week.";
    } else if (passed) {
      title.textContent = "You passed";
      body.textContent =
        "Score: " + s + " / " + total + ". A light-theme certificate given by WinHack is ready.";
      el("viewCertBtn").hidden = false;
    } else {
      title.textContent = "Not enough to certify";
      body.textContent =
        "Score: " +
        s +
        " / " +
        total +
        ". You need more than 15 correct (at least 16). You may retake after one week.";
    }
  }

  function onLeave() {
    if (!started || submitted || !armed) return;
    pendingFail = true;
    showError(
      "You tried to leave or switch the exam window. This attempt will be closed and scored as 0."
    );
  }

  function enterFullscreen() {
    const root = document.documentElement;
    const req =
      root.requestFullscreen ||
      root.webkitRequestFullscreen ||
      root.msRequestFullscreen;
    if (!req) return Promise.resolve();
    return req.call(root);
  }

  el("startExam").addEventListener("click", async () => {
    const name = el("examName").value.trim();
    const email = el("examEmail").value.trim().toLowerCase();
    if (!name || !email || !email.includes("@")) {
      el("gateMsg").textContent = "Enter your name and a valid email to start.";
      return;
    }
    if (!W.allComplete()) {
      el("gateMsg").textContent = "Mark every module topic complete before the test.";
      return;
    }
    if (!W.canTakeExam(email)) {
      el("gateMsg").textContent =
        "This email already took the test this week. Try again in " +
        W.formatMs(W.cooldownRemaining(email)) +
        ".";
      return;
    }
    W.setUser({ name, email });
    try {
      await enterFullscreen();
    } catch {
      el("gateMsg").textContent = "Allow fullscreen to start the certificate test.";
      return;
    }
    started = true;
    pendingFail = false;
    el("examGate").hidden = true;
    el("examStage").hidden = false;
    document.body.classList.add("exam-lock");
    render();
    setTimeout(() => {
      armed = true;
    }, 900);
  });

  el("prevBtn").addEventListener("click", () => {
    if (index > 0) {
      index -= 1;
      render();
    }
  });

  el("nextBtn").addEventListener("click", () => {
    if (index < total - 1) {
      index += 1;
      render();
    }
  });

  el("submitBtn").addEventListener("click", () => {
    if (answers.some((a) => a === null)) {
      showError("Answer all 20 questions before submitting.");
      pendingFail = false;
      return;
    }
    hideError();
    finish("submit");
  });

  el("dismissError").addEventListener("click", () => {
    hideError();
    if (pendingFail && started && !submitted) {
      finish("violation");
      return;
    }
    if (started && !submitted) {
      enterFullscreen().catch(() => {
        showError("Stay in fullscreen. Switching windows is not allowed.");
        pendingFail = true;
      });
    }
  });

  el("homeBtn").addEventListener("click", () => {
    location.href = "index.html";
  });

  el("viewCertBtn").addEventListener("click", () => {
    location.href = "cert.html";
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) onLeave();
  });
  window.addEventListener("blur", onLeave);
  document.addEventListener("fullscreenchange", () => {
    if (started && !submitted && !document.fullscreenElement) onLeave();
  });

  document.addEventListener("contextmenu", (e) => {
    if (started && !submitted) e.preventDefault();
  });

  window.addEventListener("keydown", (e) => {
    if (!started || submitted) return;
    if (e.key === "Escape" || (e.altKey && e.key === "Tab") || (e.ctrlKey && e.key === "Tab")) {
      e.preventDefault();
      onLeave();
    }
  });
})();
