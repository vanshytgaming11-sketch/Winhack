(function (global) {
  const DONE_KEY = "winhack_done";
  const USER_KEY = "winhack_user";
  const ATTEMPT_KEY = "winhack_attempts";
  const CERT_KEY = "winhack_certificate";
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const PASS_SCORE = 16;

  const LESSONS = [
    { id: "m1-basic", module: 1, href: "module 1/basic.html", title: "Basics" },
    { id: "m1-cf", module: 1, href: "module 1/cf.html", title: "Control Flow" },
    { id: "m1-fn", module: 1, href: "module 1/fn.html", title: "Functions" },
    { id: "m1-as", module: 1, href: "module 1/as.html", title: "Arrays & Strings" },
    { id: "m1-pr", module: 1, href: "module 1/pr.html", title: "Pointers & References" },
    { id: "m2-dm", module: 2, href: "module 2/dm.html", title: "Dynamic Memory" },
    { id: "m2-classobject", module: 2, href: "module 2/classobject.html", title: "Classes & Objects" },
    { id: "m2-co", module: 2, href: "module 2/co.html", title: "Copying Objects" },
    { id: "m2-oop", module: 2, href: "module 2/oop.html", title: "OOP Principles" },
    { id: "m2-advoop", module: 2, href: "module 2/advoop.html", title: "Advanced OOP" },
    { id: "m3-temp", module: 3, href: "module 3/temp.html", title: "Templates" },
    { id: "m3-eh", module: 3, href: "module 3/eh.html", title: "Exception Handling" },
    { id: "m3-fh", module: 3, href: "module 3/fh.html", title: "File Handling" },
    { id: "m3-fp", module: 3, href: "module 3/fp.html", title: "Function Pointers" },
    { id: "m3-ns", module: 3, href: "module 3/ns.html", title: "Namespaces" },
    { id: "m3-tc", module: 3, href: "module 3/tc.html", title: "Type Casting" },
    { id: "m3-oc", module: 3, href: "module 3/oc.html", title: "Other Concepts" },
    { id: "m4-sc", module: 4, href: "module 4/sc.html", title: "Sequence Containers" },
    { id: "m4-u", module: 4, href: "module 4/u.html", title: "Utility" },
    { id: "m4-ac", module: 4, href: "module 4/ac.html", title: "Container Adaptors" },
    { id: "m4-oac", module: 4, href: "module 4/oac.html", title: "Ordered Associative Containers" },
    { id: "m4-uc", module: 4, href: "module 4/uc.html", title: "Unordered Containers" },
    { id: "m4-i", module: 4, href: "module 4/i.html", title: "Iterators" },
    { id: "m4-a", module: 4, href: "module 4/a.html", title: "Algorithms" },
    { id: "m4-ci", module: 4, href: "module 4/ci.html", title: "Complexity & Internals" },
    { id: "m5-td", module: 5, href: "module 5/td.html", title: "Type Deduction" },
    { id: "m5-lf", module: 5, href: "module 5/lf.html", title: "Lambda Functions" },
    { id: "m5-sp", module: 5, href: "module 5/sp.html", title: "Smart Pointers" },
    { id: "m5-ms", module: 5, href: "module 5/ms.html", title: "Move Semantics" },
    { id: "m5-cmr", module: 5, href: "module 5/cmr.html", title: "Copy & Move Rules" },
    { id: "m5-msu", module: 5, href: "module 5/msu.html", title: "Modern STL Usage" },
    { id: "m5-mu", module: 5, href: "module 5/mu.html", title: "Modern Utilities" },
    { id: "m6-ca", module: 6, href: "module 6/ca.html", title: "Complexity Analysis" },
    { id: "m6-as", module: 6, href: "module 6/as.html", title: "Arrays & Strings" },
    { id: "m6-ll", module: 6, href: "module 6/ll.html", title: "Linked Lists" },
    { id: "m6-sq", module: 6, href: "module 6/sq.html", title: "Stack & Queue" },
    { id: "m6-ha", module: 6, href: "module 6/ha.html", title: "Hashing" },
    { id: "m6-t", module: 6, href: "module 6/t.html", title: "Trees" },
    { id: "m6-he", module: 6, href: "module 6/he.html", title: "Heaps" },
    { id: "m6-g", module: 6, href: "module 6/g.html", title: "Graphs" },
    { id: "m6-rb", module: 6, href: "module 6/rb.html", title: "Recursion & Backtracking" },
    { id: "m6-dp", module: 6, href: "module 6/dp.html", title: "Dynamic Programming" },
    { id: "m6-trie", module: 6, href: "module 6/trie.html", title: "Trie" },
    { id: "m6-ufd", module: 6, href: "module 6/ufd.html", title: "Union-Find / DSU" },
    { id: "m6-bm", module: 6, href: "module 6/bm.html", title: "Bit Manipulation" },
    { id: "m6-bsa", module: 6, href: "module 6/bsa.html", title: "Binary Search on Answer" },
    { id: "m7-mps", module: 7, href: "module 7/mps.html", title: "Mixed Practice Set" },
    { id: "m7-mi", module: 7, href: "module 7/mi.html", title: "Mock Interviews" },
    { id: "m7-war", module: 7, href: "module 7/war.html", title: "Weak-Area Review" },
    { id: "m7-sdb", module: 7, href: "module 7/sdb.html", title: "System Design Basics (Optional)" }
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getDone() {
    return read(DONE_KEY, {});
  }

  function setDone(id, value) {
    const done = getDone();
    if (value) done[id] = true;
    else delete done[id];
    write(DONE_KEY, done);
  }

  function isDone(id) {
    return Boolean(getDone()[id]);
  }

  function completedCount() {
    const done = getDone();
    return LESSONS.filter((l) => done[l.id]).length;
  }

  function allComplete() {
    return completedCount() === LESSONS.length;
  }

  function lessonsForModule(n) {
    return LESSONS.filter((l) => l.module === n);
  }

  function moduleComplete(n) {
    return lessonsForModule(n).every((l) => isDone(l.id));
  }

  function setModule(n, value) {
    lessonsForModule(n).forEach((l) => setDone(l.id, value));
  }

  function idFromHref(href) {
    const decoded = decodeURIComponent(href || "");
    const m = decoded.match(/module\s*(\d+)\/([^/?#]+)\.html/i);
    return m ? "m" + m[1] + "-" + m[2] : null;
  }

  function currentLessonId() {
    return idFromHref(location.pathname);
  }

  function rootPrefix() {
    return /module\s*\d+/i.test(decodeURIComponent(location.pathname)) ? "../" : "";
  }

  function getUser() {
    return read(USER_KEY, null);
  }

  function setUser(user) {
    write(USER_KEY, user);
  }

  function attempts() {
    return read(ATTEMPT_KEY, {});
  }

  function lastAttempt(email) {
    const key = String(email || "").trim().toLowerCase();
    return attempts()[key] || 0;
  }

  function recordAttempt(email) {
    const key = String(email || "").trim().toLowerCase();
    const all = attempts();
    all[key] = Date.now();
    write(ATTEMPT_KEY, all);
  }

  function cooldownRemaining(email) {
    const last = lastAttempt(email);
    if (!last) return 0;
    return Math.max(0, WEEK_MS - (Date.now() - last));
  }

  function canTakeExam(email) {
    return cooldownRemaining(email) === 0;
  }

  function formatMs(ms) {
    const d = Math.ceil(ms / (24 * 60 * 60 * 1000));
    if (d <= 1) {
      const h = Math.ceil(ms / (60 * 60 * 1000));
      return h <= 1 ? "less than an hour" : h + " hours";
    }
    return d + " days";
  }

  function getCert() {
    return read(CERT_KEY, null);
  }

  function saveCert(cert) {
    write(CERT_KEY, cert);
  }

  global.Winhack = {
    LESSONS,
    PASS_SCORE,
    getDone,
    setDone,
    isDone,
    completedCount,
    allComplete,
    lessonsForModule,
    moduleComplete,
    setModule,
    idFromHref,
    currentLessonId,
    rootPrefix,
    getUser,
    setUser,
    lastAttempt,
    recordAttempt,
    cooldownRemaining,
    canTakeExam,
    formatMs,
    getCert,
    saveCert
  };
})(window);
