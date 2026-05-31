/* ============================================================
   support.js — Legacy browser feature detection
   Single Responsibility: probe capabilities, expose them as
   classes on <html> and a JS API. Must run FIRST (before CSS
   relies on the classes and before other modules read them).
   ============================================================ */

(function (global) {
  "use strict";

  var root = document.documentElement;

  /* Swap the no-js guard immediately so reveal content can show. */
  root.classList.remove("no-js");
  root.classList.add("js");

  function cssSupports(prop, value) {
    if (global.CSS && typeof global.CSS.supports === "function") {
      try { return global.CSS.supports(prop, value); } catch (e) { return false; }
    }
    /* manual fallback: probe a detached element's style */
    var el = document.createElement("div");
    var camel = prop.replace(/^--/, "").replace(/-([a-z])/g, function (m, c) {
      return c.toUpperCase();
    });
    return camel in el.style;
  }

  var mq = global.matchMedia ? global.matchMedia.bind(global) : null;

  var features = {
    cssVars:        cssSupports("--a", "0"),
    grid:           cssSupports("display", "grid"),
    flexGap:        cssSupports("gap", "1px"),
    aspectRatio:    cssSupports("aspect-ratio", "1 / 1"),
    backdropFilter: cssSupports("backdrop-filter", "blur(2px)") ||
                    cssSupports("-webkit-backdrop-filter", "blur(2px)"),
    svh:            cssSupports("height", "100svh"),
    clamp:          cssSupports("width", "clamp(1px, 2vw, 3px)"),
    mixBlend:       cssSupports("mix-blend-mode", "multiply"),
    sticky:         cssSupports("position", "sticky") ||
                    cssSupports("position", "-webkit-sticky"),
    objectFit:      cssSupports("object-fit", "cover"),
    intersection:   "IntersectionObserver" in global,
    customEvent:    typeof global.CustomEvent === "function",
    smoothScroll:   "scrollBehavior" in root.style,
    reducedMotion:  !!(mq && mq("(prefers-reduced-motion: reduce)").matches),
    touch:          ("ontouchstart" in global) ||
                    (navigator.maxTouchPoints > 0)
  };

  /* Map detections to CSS hooks used by fallbacks.css */
  function flag(condition, className) {
    if (!condition) { root.classList.add(className); }
  }
  flag(features.flexGap, "no-gap");
  flag(features.mixBlend, "no-blend");
  flag(features.objectFit, "no-objectfit");
  flag(features.sticky, "no-sticky");

  if (features.touch) { root.classList.add("is-touch"); }

  /* ---- Polyfills for very old browsers ---- */

  /* CustomEvent (IE11) */
  if (!features.customEvent) {
    var CE = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
    if (global.Event) { CE.prototype = global.Event.prototype; }
    global.CustomEvent = CE;
  }

  /* Element.matches / closest (IE11) */
  if (Element && !Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }
  if (Element && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;
      do {
        if (el.matches && el.matches(s)) { return el; }
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  /* requestAnimationFrame fallback */
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = function (cb) {
      return global.setTimeout(function () { cb(Date.now()); }, 16);
    };
  }

  global.LTH = global.LTH || {};
  global.LTH.support = features;
})(window);
