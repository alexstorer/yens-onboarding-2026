/* Fill the student's own GitHub username into the commands on the page.
 *
 * The pages are written with YOUR_GITHUB_USERNAME (and YOUR_USERNAME in the
 * diagrams) as placeholders. Typing a name once rewrites every one of them, so
 * a student can copy a command straight out of the page instead of pasting it
 * and then editing it in the terminal — which is where the typos happen.
 *
 * The original text of every node is kept, so clearing the box puts the
 * placeholders back rather than leaving a half-substituted page. The name is
 * remembered in localStorage (this browser only, never sent anywhere) so the
 * other pages in Part 1 are already filled in when the student reaches them.
 */
(function () {
  'use strict';

  var KEY = 'yens-gh-username';
  var TOKENS = ['YOUR_GITHUB_USERNAME', 'YOUR_USERNAME'];
  var nodes = null;

  // Every text node holding a placeholder — including the <text> elements
  // inside the SVG diagrams, which name the fork too.
  function collect() {
    if (nodes) return nodes;
    nodes = [];
    var root = document.querySelector('.main-content');
    if (!root) return nodes;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var i = 0; i < TOKENS.length; i++) {
          if (n.nodeValue.indexOf(TOKENS[i]) > -1) return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    var n;
    while ((n = walker.nextNode())) nodes.push({ node: n, original: n.nodeValue });
    return nodes;
  }

  // Links whose href names the student's fork — e.g. the repo settings page.
  // Text nodes alone are not enough: substituting the visible label while
  // leaving the href on YOUR_GITHUB_USERNAME would hand them a broken link.
  var links = null;

  function collectLinks() {
    if (links) return links;
    links = [];
    var root = document.querySelector('.main-content');
    if (!root) return links;
    Array.prototype.forEach.call(root.querySelectorAll('a[href]'), function (a) {
      var href = a.getAttribute('href');
      for (var i = 0; i < TOKENS.length; i++) {
        if (href.indexOf(TOKENS[i]) > -1) { links.push({ el: a, original: href }); return; }
      }
    });
    return links;
  }

  function fill(value, name) {
    if (!name) return value;
    TOKENS.forEach(function (t) { value = value.split(t).join(name); });
    return value;
  }

  // A link whose href still holds a placeholder would send the student to a
  // literal YOUR_GITHUB_USERNAME account, so offer no link at all until there is
  // a name to put in it. The text stays; only the href goes.
  var PENDING = 'username-fill-pending';
  var PENDING_HINT = 'Type your GitHub username on Git & GitHub for Research to enable this link';

  function apply(name) {
    collect().forEach(function (rec) {
      rec.node.nodeValue = fill(rec.original, name);
    });
    collectLinks().forEach(function (rec) {
      if (name) {
        rec.el.setAttribute('href', fill(rec.original, name));
        rec.el.removeAttribute('title');
        rec.el.classList.remove(PENDING);
      } else {
        rec.el.removeAttribute('href');
        rec.el.setAttribute('title', PENDING_HINT);
        rec.el.classList.add(PENDING);
      }
    });
  }

  function report(box, name) {
    if (!box) return;
    box.textContent = name ? '\u2713 commands updated' : '';
  }

  var stored = '';
  try { stored = window.localStorage.getItem(KEY) || ''; } catch (e) { /* private mode */ }

  var input = document.getElementById('gh-username');
  var status = document.getElementById('gh-username-status');

  if (input && stored) input.value = stored;

  // Unconditional: with no name this is what strips the placeholder hrefs.
  apply(stored);
  report(status, stored);

  if (!input) return;   // a page with no box still gets the stored name applied

  input.addEventListener('input', function () {
    var name = input.value.trim();
    apply(name);
    report(status, name);
    try {
      if (name) window.localStorage.setItem(KEY, name);
      else window.localStorage.removeItem(KEY);
    } catch (e) { /* private mode — substitution still works for this page */ }
  });
})();
