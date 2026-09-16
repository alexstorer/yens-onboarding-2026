/* Fill the student's own identifiers into the commands on the page.
 *
 * The pages are written with placeholders — SUNetID for the Stanford account,
 * YOUR_GITHUB_USERNAME (and YOUR_USERNAME in diagrams) for the GitHub one.
 * Typing a value once rewrites every one of them, so a student can copy a
 * command straight out of the page instead of pasting it and then editing it in
 * the terminal, which is where the typos happen.
 *
 * Three rules keep the substitution honest:
 *
 *   1. Only inside code and SVG <text>. Running prose says things like "sign in
 *      with your SUNetID", meaning the term rather than the value; rewriting
 *      those to "sign in with your jdoe" would be nonsense.
 *   2. The original text of every node is kept, so clearing a field puts the
 *      placeholders back rather than leaving a half-substituted page.
 *   3. A link whose href still holds a placeholder loses its href entirely —
 *      pointing at a literal YOUR_GITHUB_USERNAME account is worse than
 *      offering no link. personalize-pending in course.css styles that state.
 *
 * Values live in localStorage (this browser only, never sent anywhere), so the
 * other pages are already filled in when the student reaches them.
 */
(function () {
  'use strict';

  var FIELDS = {
    sunet:  { key: 'yens-sunet',        tokens: ['SUNetID'] },
    // yens-gh-username predates this script; kept so anyone who already typed
    // their GitHub name on Git & GitHub does not have to type it again.
    github: { key: 'yens-gh-username',  tokens: ['YOUR_GITHUB_USERNAME', 'YOUR_USERNAME'] }
  };
  var NAMES = Object.keys(FIELDS);
  var PENDING = 'personalize-pending';

  function read(name) {
    try { return (window.localStorage.getItem(FIELDS[name].key) || '').trim(); }
    catch (e) { return ''; }                       // private mode
  }

  function write(name, value) {
    try {
      if (value) window.localStorage.setItem(FIELDS[name].key, value);
      else window.localStorage.removeItem(FIELDS[name].key);
    } catch (e) { /* private mode — substitution still works for this page */ }
  }

  function values() {
    var v = {};
    NAMES.forEach(function (n) { v[n] = read(n); });
    return v;
  }

  // ── What can be substituted ───────────────────────────────────────────────

  // Text nodes inside code, and SVG <text>. Deliberately not bare prose: see
  // rule 1 above.
  var nodes = null;

  function collect() {
    if (nodes) return nodes;
    nodes = [];
    var root = document.querySelector('.main-content');
    if (!root) return nodes;
    var hosts = root.querySelectorAll('code, pre, svg text, svg tspan');
    Array.prototype.forEach.call(hosts, function (host) {
      // A <code> inside <pre> would otherwise be walked twice.
      if (host.tagName === 'CODE' && host.closest('pre')) return;
      var walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, null);
      var n;
      while ((n = walker.nextNode())) {
        if (hasToken(n.nodeValue)) nodes.push({ node: n, original: n.nodeValue });
      }
    });
    return nodes;
  }

  function hasToken(text) {
    for (var i = 0; i < NAMES.length; i++) {
      var toks = FIELDS[NAMES[i]].tokens;
      for (var j = 0; j < toks.length; j++) {
        if (text.indexOf(toks[j]) > -1) return true;
      }
    }
    return false;
  }

  // Links whose href names the student's fork — the repo settings page, the
  // checkpoint branch. Substituting the visible label while leaving the href on
  // a placeholder would hand them a broken link.
  var links = null;

  function collectLinks() {
    if (links) return links;
    links = [];
    var root = document.querySelector('.main-content');
    if (!root) return links;
    Array.prototype.forEach.call(root.querySelectorAll('a[href]'), function (a) {
      if (hasToken(a.getAttribute('href'))) {
        links.push({ el: a, original: a.getAttribute('href') });
      }
    });
    return links;
  }

  // ── Substitution ──────────────────────────────────────────────────────────

  function fill(text, vals) {
    NAMES.forEach(function (n) {
      if (!vals[n]) return;
      FIELDS[n].tokens.forEach(function (t) { text = text.split(t).join(vals[n]); });
    });
    return text;
  }

  // A token this href needs is still unset, so the link cannot be honoured.
  function hrefIsIncomplete(href, vals) {
    for (var i = 0; i < NAMES.length; i++) {
      var toks = FIELDS[NAMES[i]].tokens;
      for (var j = 0; j < toks.length; j++) {
        if (href.indexOf(toks[j]) > -1 && !vals[NAMES[i]]) return true;
      }
    }
    return false;
  }

  function apply() {
    var vals = values();

    collect().forEach(function (rec) {
      rec.node.nodeValue = fill(rec.original, vals);
    });

    collectLinks().forEach(function (rec) {
      if (hrefIsIncomplete(rec.original, vals)) {
        rec.el.removeAttribute('href');
        rec.el.setAttribute('title', 'Enter your details in the sidebar to enable this link');
        rec.el.classList.add(PENDING);
      } else {
        rec.el.setAttribute('href', fill(rec.original, vals));
        rec.el.removeAttribute('title');
        rec.el.classList.remove(PENDING);
      }
    });

    inputs().forEach(function (input) {
      var name = input.getAttribute('data-personalize');
      if (input !== document.activeElement) input.value = vals[name] || '';
    });

    var filled = NAMES.filter(function (n) { return vals[n]; }).length;
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-personalize-status]'),
      function (box) {
        box.textContent = filled ? '✓ commands updated' : '';
      }
    );
  }

  // ── Inputs ────────────────────────────────────────────────────────────────

  // Every input bound to a field, wherever it lives: the sidebar renders twice
  // (desktop and mobile), and Git & GitHub has one inline in a callout.
  function inputs() {
    return Array.prototype.slice.call(
      document.querySelectorAll('input[data-personalize]')
    );
  }

  inputs().forEach(function (input) {
    input.addEventListener('input', function () {
      var name = input.getAttribute('data-personalize');
      if (!FIELDS[name]) return;
      write(name, input.value.trim());
      apply();
    });
  });

  apply();   // also what strips the placeholder hrefs when nothing is set yet
})();
