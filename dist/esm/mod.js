import {
  isServer,
  createComponent,
  Dynamic,
  mergeProps as mergeProps$1,
  memo,
  Portal,
  insert,
  effect,
  setAttribute,
  template,
  use,
  delegateEvents,
  className,
  spread,
  style,
} from "solid-js/web";
import {
  getOwner,
  onCleanup,
  DEV,
  createEffect,
  createRenderEffect,
  createMemo,
  $TRACK,
  untrack,
  createRoot,
  createSignal,
  mergeProps,
  splitProps,
  createContext,
  onMount,
  on,
  useContext,
  createUniqueId,
  Show,
  Switch,
  Match,
  children,
  For,
  createComputed,
  createComponent as createComponent$1,
} from "solid-js";
import * as TWEEN from "@tweenjs/tween.js";
import { RectCoordsDims, renderChart } from "@jsr/timroberton__panther";
export * from "@jsr/timroberton__panther";

// src/index.ts
var isClient = !isServer;
var isDev = isClient && !!DEV;
function chain(callbacks) {
  return (...args) => {
    for (const callback of callbacks) callback && callback(...args);
  };
}
var access$1 = (v) => (typeof v === "function" && !v.length ? v() : v);
var asArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
function accessWith(valueOrFn, ...args) {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}
var tryOnCleanup = isDev
  ? (fn) => (getOwner() ? onCleanup(fn) : fn)
  : onCleanup;

// src/eventListener.ts
function makeEventListener(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return tryOnCleanup(
    target.removeEventListener.bind(target, type, handler, options)
  );
}
function createEventListener(targets, type, handler, options) {
  if (isServer) return;
  const attachListeners = () => {
    asArray(access$1(targets)).forEach((el) => {
      if (el)
        asArray(access$1(type)).forEach((type2) =>
          makeEventListener(el, type2, handler, options)
        );
    });
  };
  if (typeof targets === "function") createEffect(attachListeners);
  else createRenderEffect(attachListeners);
}

// src/index.ts
var FALLBACK = Symbol("fallback");
function dispose(list) {
  for (const o of list) o.dispose();
}
function keyArray(items, keyFn, mapFn, options = {}) {
  if (isServer) {
    const itemsRef = items();
    let s = [];
    if (itemsRef && itemsRef.length) {
      for (let i = 0, len = itemsRef.length; i < len; i++)
        s.push(
          mapFn(
            () => itemsRef[i],
            () => i
          )
        );
    } else if (options.fallback) s = [options.fallback()];
    return () => s;
  }
  const prev = /* @__PURE__ */ new Map();
  onCleanup(() => dispose(prev.values()));
  return () => {
    const list = items() || [];
    list[$TRACK];
    return untrack(() => {
      if (!list.length) {
        dispose(prev.values());
        prev.clear();
        if (!options.fallback) return [];
        const fb2 = createRoot((dispose2) => {
          prev.set(FALLBACK, {
            dispose: dispose2,
          });
          return options.fallback();
        });
        return [fb2];
      }
      const result = new Array(list.length);
      const fb = prev.get(FALLBACK);
      if (!prev.size || fb) {
        fb?.dispose();
        prev.delete(FALLBACK);
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          const key = keyFn(item, i);
          addNewItem(result, item, i, key);
        }
        return result;
      }
      const prevKeys = new Set(prev.keys());
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const key = keyFn(item, i);
        prevKeys.delete(key);
        const lookup = prev.get(key);
        if (lookup) {
          result[i] = lookup.mapped;
          lookup.setIndex?.(i);
          lookup.setItem(() => item);
        } else addNewItem(result, item, i, key);
      }
      for (const key of prevKeys) {
        prev.get(key)?.dispose();
        prev.delete(key);
      }
      return result;
    });
  };
  function addNewItem(list, item, i, key) {
    createRoot((dispose2) => {
      const [getItem, setItem] = createSignal(item);
      const save = {
        setItem,
        dispose: dispose2,
      };
      if (mapFn.length > 1) {
        const [index, setIndex] = createSignal(i);
        save.setIndex = setIndex;
        save.mapped = mapFn(getItem, index);
      } else save.mapped = mapFn(getItem);
      prev.set(key, save);
      list[i] = save.mapped;
    });
  }
}
function Key(props) {
  const { by } = props;
  return createMemo(
    keyArray(
      () => props.each,
      typeof by === "function" ? by : (v) => v[by],
      props.children,
      "fallback" in props
        ? {
            fallback: () => props.fallback,
          }
        : void 0
    )
  );
}

// src/index.ts
function mergeRefs(...refs) {
  return chain(refs);
}

// src/array.ts
function addItemToArray(array, item, index = -1) {
  if (!(index in array)) {
    return [...array, item];
  }
  return [...array.slice(0, index), item, ...array.slice(index)];
}
function removeItemFromArray(array, item) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}

// src/assertion.ts
function isNumber(value) {
  return typeof value === "number";
}
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isFunction(value) {
  return typeof value === "function";
}

// src/create-generate-id.ts
function createGenerateId(baseId) {
  return (suffix) => `${baseId()}-${suffix}`;
}

// src/dom.ts
function contains$1(parent, child) {
  if (!parent) {
    return false;
  }
  return parent === child || parent.contains(child);
}
function getActiveElement(node, activeDescendant = false) {
  const { activeElement } = getDocument(node);
  if (!activeElement?.nodeName) {
    return null;
  }
  if (isFrame(activeElement) && activeElement.contentDocument) {
    return getActiveElement(
      activeElement.contentDocument.body,
      activeDescendant
    );
  }
  if (activeDescendant) {
    const id = activeElement.getAttribute("aria-activedescendant");
    if (id) {
      const element = getDocument(activeElement).getElementById(id);
      if (element) {
        return element;
      }
    }
  }
  return activeElement;
}
function getWindow$1(node) {
  return getDocument(node).defaultView || window;
}
function getDocument(node) {
  return node ? node.ownerDocument || node : document;
}
function isFrame(element) {
  return element.tagName === "IFRAME";
}

// src/enums.ts
var EventKey = /* @__PURE__ */ ((EventKey2) => {
  EventKey2["Escape"] = "Escape";
  EventKey2["Enter"] = "Enter";
  EventKey2["Tab"] = "Tab";
  EventKey2["Space"] = " ";
  EventKey2["ArrowDown"] = "ArrowDown";
  EventKey2["ArrowLeft"] = "ArrowLeft";
  EventKey2["ArrowRight"] = "ArrowRight";
  EventKey2["ArrowUp"] = "ArrowUp";
  EventKey2["End"] = "End";
  EventKey2["Home"] = "Home";
  EventKey2["PageDown"] = "PageDown";
  EventKey2["PageUp"] = "PageUp";
  return EventKey2;
})(EventKey || {});

// src/platform.ts
function testUserAgent(re) {
  if (typeof window === "undefined" || window.navigator == null) {
    return false;
  }
  return (
    // @ts-ignore
    window.navigator["userAgentData"]?.brands.some((brand) =>
      re.test(brand.brand)
    ) || re.test(window.navigator.userAgent)
  );
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null
    ? // @ts-ignore
      re.test(
        window.navigator["userAgentData"]?.platform || window.navigator.platform
      )
    : false;
}
function isMac() {
  return testPlatform(/^Mac/i);
}
function isIPhone() {
  return testPlatform(/^iPhone/i);
}
function isIPad() {
  return (
    testPlatform(/^iPad/i) ||
    // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
    (isMac() && navigator.maxTouchPoints > 1)
  );
}
function isIOS() {
  return isIPhone() || isIPad();
}
function isAppleDevice() {
  return isMac() || isIOS();
}
function isWebKit$1() {
  return testUserAgent(/AppleWebKit/i) && !isChrome();
}
function isChrome() {
  return testUserAgent(/Chrome/i);
}

// src/events.ts
function callHandler(event, handler) {
  if (handler) {
    if (isFunction(handler)) {
      handler(event);
    } else {
      handler[0](handler[1], event);
    }
  }
  return event?.defaultPrevented;
}
function composeEventHandlers(handlers) {
  return (event) => {
    for (const handler of handlers) {
      callHandler(event, handler);
    }
  };
}
function isCtrlKey(e) {
  if (isMac()) {
    return e.metaKey && !e.ctrlKey;
  }
  return e.ctrlKey && !e.metaKey;
}

// src/focus-without-scrolling.ts
function focusWithoutScrolling(element) {
  if (!element) {
    return;
  }
  if (supportsPreventScroll()) {
    element.focus({
      preventScroll: true,
    });
  } else {
    const scrollableElements = getScrollableElements(element);
    element.focus();
    restoreScrollPosition(scrollableElements);
  }
}
var supportsPreventScrollCached = null;
function supportsPreventScroll() {
  if (supportsPreventScrollCached == null) {
    supportsPreventScrollCached = false;
    try {
      const focusElem = document.createElement("div");
      focusElem.focus({
        get preventScroll() {
          supportsPreventScrollCached = true;
          return true;
        },
      });
    } catch (e) {}
  }
  return supportsPreventScrollCached;
}
function getScrollableElements(element) {
  let parent = element.parentNode;
  const scrollableElements = [];
  const rootScrollingElement =
    document.scrollingElement || document.documentElement;
  while (parent instanceof HTMLElement && parent !== rootScrollingElement) {
    if (
      parent.offsetHeight < parent.scrollHeight ||
      parent.offsetWidth < parent.scrollWidth
    ) {
      scrollableElements.push({
        element: parent,
        scrollTop: parent.scrollTop,
        scrollLeft: parent.scrollLeft,
      });
    }
    parent = parent.parentNode;
  }
  if (rootScrollingElement instanceof HTMLElement) {
    scrollableElements.push({
      element: rootScrollingElement,
      scrollTop: rootScrollingElement.scrollTop,
      scrollLeft: rootScrollingElement.scrollLeft,
    });
  }
  return scrollableElements;
}
function restoreScrollPosition(scrollableElements) {
  for (const { element, scrollTop, scrollLeft } of scrollableElements) {
    element.scrollTop = scrollTop;
    element.scrollLeft = scrollLeft;
  }
}

// src/tabbable.ts
var focusableElements = [
  "input:not([type='hidden']):not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "a[href]",
  "area[href]",
  "[tabindex]",
  "iframe",
  "object",
  "embed",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
];
var tabbableElements = [
  ...focusableElements,
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
];
var FOCUSABLE_ELEMENT_SELECTOR =
  focusableElements.join(":not([hidden]),") +
  ",[tabindex]:not([disabled]):not([hidden])";
var TABBABLE_ELEMENT_SELECTOR = tabbableElements.join(
  ':not([hidden]):not([tabindex="-1"]),'
);
function getAllTabbableIn(container, includeContainer) {
  const elements = Array.from(
    container.querySelectorAll(FOCUSABLE_ELEMENT_SELECTOR)
  );
  const tabbableElements2 = elements.filter(isTabbable);
  if (includeContainer && isTabbable(container)) {
    tabbableElements2.unshift(container);
  }
  tabbableElements2.forEach((element, i) => {
    if (isFrame(element) && element.contentDocument) {
      const frameBody = element.contentDocument.body;
      const allFrameTabbable = getAllTabbableIn(frameBody, false);
      tabbableElements2.splice(i, 1, ...allFrameTabbable);
    }
  });
  return tabbableElements2;
}
function isTabbable(element) {
  return isFocusable(element) && !hasNegativeTabIndex(element);
}
function isFocusable(element) {
  return (
    element.matches(FOCUSABLE_ELEMENT_SELECTOR) && isElementVisible(element)
  );
}
function hasNegativeTabIndex(element) {
  const tabIndex = parseInt(element.getAttribute("tabindex") || "0", 10);
  return tabIndex < 0;
}
function isElementVisible(element, childElement) {
  return (
    element.nodeName !== "#comment" &&
    isStyleVisible(element) &&
    isAttributeVisible(element, childElement) &&
    (!element.parentElement || isElementVisible(element.parentElement, element))
  );
}
function isStyleVisible(element) {
  if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) {
    return false;
  }
  const { display, visibility } = element.style;
  let isVisible =
    display !== "none" && visibility !== "hidden" && visibility !== "collapse";
  if (isVisible) {
    if (!element.ownerDocument.defaultView) {
      return isVisible;
    }
    const { getComputedStyle } = element.ownerDocument.defaultView;
    const { display: computedDisplay, visibility: computedVisibility } =
      getComputedStyle(element);
    isVisible =
      computedDisplay !== "none" &&
      computedVisibility !== "hidden" &&
      computedVisibility !== "collapse";
  }
  return isVisible;
}
function isAttributeVisible(element, childElement) {
  return (
    !element.hasAttribute("hidden") &&
    (element.nodeName === "DETAILS" &&
    childElement &&
    childElement.nodeName !== "SUMMARY"
      ? element.hasAttribute("open")
      : true)
  );
}
function isElementInScope(element, scope) {
  return scope.some((node) => node.contains(element));
}
function getFocusableTreeWalker(root, opts, scope) {
  const selector = opts?.tabbable
    ? TABBABLE_ELEMENT_SELECTOR
    : FOCUSABLE_ELEMENT_SELECTOR;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (opts?.from?.contains(node)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (
        node.matches(selector) &&
        isElementVisible(node) &&
        (!scope || isElementInScope(node, scope)) &&
        (!opts?.accept || opts.accept(node))
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  if (opts?.from) {
    walker.currentNode = opts.from;
  }
  return walker;
}

// src/noop.ts
function noop() {
  return;
}

// src/number.ts
function clamp$1(value, min = -Infinity, max = Infinity) {
  return Math.min(Math.max(value, min), max);
}
function snapValueToStep(value, min, max, step) {
  const remainder = (value - (isNaN(min) ? 0 : min)) % step;
  let snappedValue =
    Math.abs(remainder) * 2 >= step
      ? value + Math.sign(remainder) * (step - Math.abs(remainder))
      : value - remainder;
  if (!isNaN(min)) {
    if (snappedValue < min) {
      snappedValue = min;
    } else if (!isNaN(max) && snappedValue > max) {
      snappedValue = min + Math.floor((max - min) / step) * step;
    }
  } else if (!isNaN(max) && snappedValue > max) {
    snappedValue = Math.floor(max / step) * step;
  }
  const string = step.toString();
  const index = string.indexOf(".");
  const precision = index >= 0 ? string.length - index : 0;
  if (precision > 0) {
    const pow = Math.pow(10, precision);
    snappedValue = Math.round(snappedValue * pow) / pow;
  }
  return snappedValue;
}
function mergeDefaultProps(defaultProps, props) {
  return mergeProps(defaultProps, props);
}

// src/run-after-transition.ts
var transitionsByElement = /* @__PURE__ */ new Map();
var transitionCallbacks = /* @__PURE__ */ new Set();
function setupGlobalEvents() {
  if (typeof window === "undefined") {
    return;
  }
  const onTransitionStart = (e) => {
    if (!e.target) {
      return;
    }
    let transitions = transitionsByElement.get(e.target);
    if (!transitions) {
      transitions = /* @__PURE__ */ new Set();
      transitionsByElement.set(e.target, transitions);
      e.target.addEventListener("transitioncancel", onTransitionEnd);
    }
    transitions.add(e.propertyName);
  };
  const onTransitionEnd = (e) => {
    if (!e.target) {
      return;
    }
    const properties = transitionsByElement.get(e.target);
    if (!properties) {
      return;
    }
    properties.delete(e.propertyName);
    if (properties.size === 0) {
      e.target.removeEventListener("transitioncancel", onTransitionEnd);
      transitionsByElement.delete(e.target);
    }
    if (transitionsByElement.size === 0) {
      for (const cb of transitionCallbacks) {
        cb();
      }
      transitionCallbacks.clear();
    }
  };
  document.body.addEventListener("transitionrun", onTransitionStart);
  document.body.addEventListener("transitionend", onTransitionEnd);
}
if (typeof document !== "undefined") {
  if (document.readyState !== "loading") {
    setupGlobalEvents();
  } else {
    document.addEventListener("DOMContentLoaded", setupGlobalEvents);
  }
}

// src/scroll-into-view.ts
function scrollIntoView(scrollView, element) {
  const offsetX = relativeOffset(scrollView, element, "left");
  const offsetY = relativeOffset(scrollView, element, "top");
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  let x = scrollView.scrollLeft;
  let y = scrollView.scrollTop;
  const maxX = x + scrollView.offsetWidth;
  const maxY = y + scrollView.offsetHeight;
  if (offsetX <= x) {
    x = offsetX;
  } else if (offsetX + width > maxX) {
    x += offsetX + width - maxX;
  }
  if (offsetY <= y) {
    y = offsetY;
  } else if (offsetY + height > maxY) {
    y += offsetY + height - maxY;
  }
  scrollView.scrollLeft = x;
  scrollView.scrollTop = y;
}
function relativeOffset(ancestor, child, axis) {
  const prop = axis === "left" ? "offsetLeft" : "offsetTop";
  let sum = 0;
  while (child.offsetParent) {
    sum += child[prop];
    if (child.offsetParent === ancestor) {
      break;
    } else if (child.offsetParent.contains(ancestor)) {
      sum -= ancestor[prop];
      break;
    }
    child = child.offsetParent;
  }
  return sum;
}

// src/styles.ts
var visuallyHiddenStyles = {
  border: "0",
  clip: "rect(0 0 0 0)",
  "clip-path": "inset(50%)",
  height: "1px",
  margin: "0 -1px -1px 0",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  "white-space": "nowrap",
};

// src/dismissable-layer/layer-stack.tsx
var DATA_TOP_LAYER_ATTR = "data-kb-top-layer";
var originalBodyPointerEvents;
var hasDisabledBodyPointerEvents = false;
var layers = [];
function indexOf(node) {
  return layers.findIndex((layer) => layer.node === node);
}
function find(node) {
  return layers[indexOf(node)];
}
function isTopMostLayer(node) {
  return layers[layers.length - 1].node === node;
}
function getPointerBlockingLayers() {
  return layers.filter((layer) => layer.isPointerBlocking);
}
function getTopMostPointerBlockingLayer() {
  return [...getPointerBlockingLayers()].slice(-1)[0];
}
function hasPointerBlockingLayer() {
  return getPointerBlockingLayers().length > 0;
}
function isBelowPointerBlockingLayer(node) {
  const highestBlockingIndex = indexOf(getTopMostPointerBlockingLayer()?.node);
  return indexOf(node) < highestBlockingIndex;
}
function addLayer(layer) {
  layers.push(layer);
}
function removeLayer(node) {
  const index = indexOf(node);
  if (index < 0) {
    return;
  }
  layers.splice(index, 1);
}
function assignPointerEventToLayers() {
  for (const { node } of layers) {
    node.style.pointerEvents = isBelowPointerBlockingLayer(node)
      ? "none"
      : "auto";
  }
}
function disableBodyPointerEvents(node) {
  if (hasPointerBlockingLayer() && !hasDisabledBodyPointerEvents) {
    const ownerDocument = getDocument(node);
    originalBodyPointerEvents = document.body.style.pointerEvents;
    ownerDocument.body.style.pointerEvents = "none";
    hasDisabledBodyPointerEvents = true;
  }
}
function restoreBodyPointerEvents(node) {
  if (hasPointerBlockingLayer()) {
    return;
  }
  const ownerDocument = getDocument(node);
  ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
  if (ownerDocument.body.style.length === 0) {
    ownerDocument.body.removeAttribute("style");
  }
  hasDisabledBodyPointerEvents = false;
}
var layerStack = {
  layers,
  isTopMostLayer,
  hasPointerBlockingLayer,
  isBelowPointerBlockingLayer,
  addLayer,
  removeLayer,
  indexOf,
  find,
  assignPointerEventToLayers,
  disableBodyPointerEvents,
  restoreBodyPointerEvents,
};

var AUTOFOCUS_ON_MOUNT_EVENT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT_EVENT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = {
  bubbles: false,
  cancelable: true,
};
var focusScopeStack = {
  /** A stack of focus scopes, with the active one at the top */
  stack: [],
  active() {
    return this.stack[0];
  },
  add(scope) {
    if (scope !== this.active()) {
      this.active()?.pause();
    }
    this.stack = removeItemFromArray(this.stack, scope);
    this.stack.unshift(scope);
  },
  remove(scope) {
    this.stack = removeItemFromArray(this.stack, scope);
    this.active()?.resume();
  },
};
function createFocusScope(props, ref) {
  const [isPaused, setIsPaused] = createSignal(false);
  const focusScope = {
    pause() {
      setIsPaused(true);
    },
    resume() {
      setIsPaused(false);
    },
  };
  let lastFocusedElement = null;
  const onMountAutoFocus = (e) => props.onMountAutoFocus?.(e);
  const onUnmountAutoFocus = (e) => props.onUnmountAutoFocus?.(e);
  const ownerDocument = () => getDocument(ref());
  const createSentinel = () => {
    const element = ownerDocument().createElement("span");
    element.setAttribute("data-focus-trap", "");
    element.tabIndex = 0;
    Object.assign(element.style, visuallyHiddenStyles);
    return element;
  };
  const tabbables = () => {
    const container = ref();
    if (!container) {
      return [];
    }
    return getAllTabbableIn(container, true).filter(
      (el) => !el.hasAttribute("data-focus-trap")
    );
  };
  const firstTabbable = () => {
    const items = tabbables();
    return items.length > 0 ? items[0] : null;
  };
  const lastTabbable = () => {
    const items = tabbables();
    return items.length > 0 ? items[items.length - 1] : null;
  };
  const shouldPreventUnmountAutoFocus = () => {
    const container = ref();
    if (!container) {
      return false;
    }
    const activeElement = getActiveElement(container);
    if (!activeElement) {
      return false;
    }
    if (contains$1(container, activeElement)) {
      return false;
    }
    return isFocusable(activeElement);
  };
  createEffect(() => {
    if (isServer) {
      return;
    }
    const container = ref();
    if (!container) {
      return;
    }
    focusScopeStack.add(focusScope);
    const previouslyFocusedElement = getActiveElement(container);
    const hasFocusedCandidate = contains$1(container, previouslyFocusedElement);
    if (!hasFocusedCandidate) {
      const mountEvent = new CustomEvent(
        AUTOFOCUS_ON_MOUNT_EVENT,
        EVENT_OPTIONS
      );
      container.addEventListener(AUTOFOCUS_ON_MOUNT_EVENT, onMountAutoFocus);
      container.dispatchEvent(mountEvent);
      if (!mountEvent.defaultPrevented) {
        setTimeout(() => {
          focusWithoutScrolling(firstTabbable());
          if (getActiveElement(container) === previouslyFocusedElement) {
            focusWithoutScrolling(container);
          }
        }, 0);
      }
    }
    onCleanup(() => {
      container.removeEventListener(AUTOFOCUS_ON_MOUNT_EVENT, onMountAutoFocus);
      setTimeout(() => {
        const unmountEvent = new CustomEvent(
          AUTOFOCUS_ON_UNMOUNT_EVENT,
          EVENT_OPTIONS
        );
        if (shouldPreventUnmountAutoFocus()) {
          unmountEvent.preventDefault();
        }
        container.addEventListener(
          AUTOFOCUS_ON_UNMOUNT_EVENT,
          onUnmountAutoFocus
        );
        container.dispatchEvent(unmountEvent);
        if (!unmountEvent.defaultPrevented) {
          focusWithoutScrolling(
            previouslyFocusedElement ?? ownerDocument().body
          );
        }
        container.removeEventListener(
          AUTOFOCUS_ON_UNMOUNT_EVENT,
          onUnmountAutoFocus
        );
        focusScopeStack.remove(focusScope);
      }, 0);
    });
  });
  createEffect(() => {
    if (isServer) {
      return;
    }
    const container = ref();
    if (!container || !access$1(props.trapFocus) || isPaused()) {
      return;
    }
    const onFocusIn = (event) => {
      const target = event.target;
      if (target?.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
        return;
      }
      if (contains$1(container, target)) {
        lastFocusedElement = target;
      } else {
        focusWithoutScrolling(lastFocusedElement);
      }
    };
    const onFocusOut = (event) => {
      const relatedTarget = event.relatedTarget;
      const target = relatedTarget ?? getActiveElement(container);
      if (target?.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
        return;
      }
      if (!contains$1(container, target)) {
        focusWithoutScrolling(lastFocusedElement);
      }
    };
    ownerDocument().addEventListener("focusin", onFocusIn);
    ownerDocument().addEventListener("focusout", onFocusOut);
    onCleanup(() => {
      ownerDocument().removeEventListener("focusin", onFocusIn);
      ownerDocument().removeEventListener("focusout", onFocusOut);
    });
  });
  createEffect(() => {
    if (isServer) {
      return;
    }
    const container = ref();
    if (!container || !access$1(props.trapFocus) || isPaused()) {
      return;
    }
    const startSentinel = createSentinel();
    container.insertAdjacentElement("afterbegin", startSentinel);
    const endSentinel = createSentinel();
    container.insertAdjacentElement("beforeend", endSentinel);
    function onFocus(event) {
      const first = firstTabbable();
      const last = lastTabbable();
      if (event.relatedTarget === first) {
        focusWithoutScrolling(last);
      } else {
        focusWithoutScrolling(first);
      }
    }
    startSentinel.addEventListener("focusin", onFocus);
    endSentinel.addEventListener("focusin", onFocus);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.previousSibling === endSentinel) {
          endSentinel.remove();
          container.insertAdjacentElement("beforeend", endSentinel);
        }
        if (mutation.nextSibling === startSentinel) {
          startSentinel.remove();
          container.insertAdjacentElement("afterbegin", startSentinel);
        }
      }
    });
    observer.observe(container, {
      childList: true,
      subtree: false,
    });
    onCleanup(() => {
      startSentinel.removeEventListener("focusin", onFocus);
      endSentinel.removeEventListener("focusin", onFocus);
      startSentinel.remove();
      endSentinel.remove();
      observer.disconnect();
    });
  });
}

var DATA_LIVE_ANNOUNCER_ATTR = "data-live-announcer";

function createHideOutside(props) {
  createEffect(() => {
    if (access$1(props.isDisabled)) {
      return;
    }
    onCleanup(ariaHideOutside(access$1(props.targets), access$1(props.root)));
  });
}
var refCountMap = /* @__PURE__ */ new WeakMap();
var observerStack = [];
function ariaHideOutside(targets, root = document.body) {
  const visibleNodes = new Set(targets);
  const hiddenNodes = /* @__PURE__ */ new Set();
  const walk = (root2) => {
    for (const element of root2.querySelectorAll(
      `[${DATA_LIVE_ANNOUNCER_ATTR}], [${DATA_TOP_LAYER_ATTR}]`
    )) {
      visibleNodes.add(element);
    }
    const acceptNode = (node) => {
      if (
        visibleNodes.has(node) ||
        (node.parentElement &&
          hiddenNodes.has(node.parentElement) &&
          node.parentElement.getAttribute("role") !== "row")
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      for (const target of visibleNodes) {
        if (node.contains(target)) {
          return NodeFilter.FILTER_SKIP;
        }
      }
      return NodeFilter.FILTER_ACCEPT;
    };
    const walker = document.createTreeWalker(root2, NodeFilter.SHOW_ELEMENT, {
      acceptNode,
    });
    const acceptRoot = acceptNode(root2);
    if (acceptRoot === NodeFilter.FILTER_ACCEPT) {
      hide(root2);
    }
    if (acceptRoot !== NodeFilter.FILTER_REJECT) {
      let node = walker.nextNode();
      while (node != null) {
        hide(node);
        node = walker.nextNode();
      }
    }
  };
  const hide = (node) => {
    const refCount = refCountMap.get(node) ?? 0;
    if (node.getAttribute("aria-hidden") === "true" && refCount === 0) {
      return;
    }
    if (refCount === 0) {
      node.setAttribute("aria-hidden", "true");
    }
    hiddenNodes.add(node);
    refCountMap.set(node, refCount + 1);
  };
  if (observerStack.length) {
    observerStack[observerStack.length - 1].disconnect();
  }
  walk(root);
  const observer = new MutationObserver((changes) => {
    for (const change of changes) {
      if (change.type !== "childList" || change.addedNodes.length === 0) {
        continue;
      }
      if (
        ![...visibleNodes, ...hiddenNodes].some((node) =>
          node.contains(change.target)
        )
      ) {
        for (const node of change.removedNodes) {
          if (node instanceof Element) {
            visibleNodes.delete(node);
            hiddenNodes.delete(node);
          }
        }
        for (const node of change.addedNodes) {
          if (
            (node instanceof HTMLElement || node instanceof SVGElement) &&
            (node.dataset.liveAnnouncer === "true" ||
              node.dataset.reactAriaTopLayer === "true")
          ) {
            visibleNodes.add(node);
          } else if (node instanceof Element) {
            walk(node);
          }
        }
      }
    }
  });
  observer.observe(root, {
    childList: true,
    subtree: true,
  });
  const observerWrapper = {
    observe() {
      observer.observe(root, {
        childList: true,
        subtree: true,
      });
    },
    disconnect() {
      observer.disconnect();
    },
  };
  observerStack.push(observerWrapper);
  return () => {
    observer.disconnect();
    for (const node of hiddenNodes) {
      const count = refCountMap.get(node);
      if (count == null) {
        return;
      }
      if (count === 1) {
        node.removeAttribute("aria-hidden");
        refCountMap.delete(node);
      } else {
        refCountMap.set(node, count - 1);
      }
    }
    if (observerWrapper === observerStack[observerStack.length - 1]) {
      observerStack.pop();
      if (observerStack.length) {
        observerStack[observerStack.length - 1].observe();
      }
    } else {
      observerStack.splice(observerStack.indexOf(observerWrapper), 1);
    }
  };
}

// src/primitives/create-escape-key-down/create-escape-key-down.ts
function createEscapeKeyDown(props) {
  const handleKeyDown = (event) => {
    if (event.key === EventKey.Escape) {
      props.onEscapeKeyDown?.(event);
    }
  };
  createEffect(() => {
    if (isServer) {
      return;
    }
    if (access$1(props.isDisabled)) {
      return;
    }
    const document = props.ownerDocument?.() ?? getDocument();
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
    });
  });
}

var POINTER_DOWN_OUTSIDE_EVENT = "interactOutside.pointerDownOutside";
var FOCUS_OUTSIDE_EVENT = "interactOutside.focusOutside";
function createInteractOutside(props, ref) {
  let pointerDownTimeoutId;
  let clickHandler = noop;
  const ownerDocument = () => getDocument(ref());
  const onPointerDownOutside = (e) => props.onPointerDownOutside?.(e);
  const onFocusOutside = (e) => props.onFocusOutside?.(e);
  const onInteractOutside = (e) => props.onInteractOutside?.(e);
  const isEventOutside = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    if (target.closest(`[${DATA_TOP_LAYER_ATTR}]`)) {
      return false;
    }
    if (!contains$1(ownerDocument(), target)) {
      return false;
    }
    if (contains$1(ref(), target)) {
      return false;
    }
    return !props.shouldExcludeElement?.(target);
  };
  const onPointerDown = (e) => {
    function handler() {
      const container = ref();
      const target = e.target;
      if (!container || !target || !isEventOutside(e)) {
        return;
      }
      const handler2 = composeEventHandlers([
        onPointerDownOutside,
        onInteractOutside,
      ]);
      target.addEventListener(POINTER_DOWN_OUTSIDE_EVENT, handler2, {
        once: true,
      });
      const pointerDownOutsideEvent = new CustomEvent(
        POINTER_DOWN_OUTSIDE_EVENT,
        {
          bubbles: false,
          cancelable: true,
          detail: {
            originalEvent: e,
            isContextMenu: e.button === 2 || (isCtrlKey(e) && e.button === 0),
          },
        }
      );
      target.dispatchEvent(pointerDownOutsideEvent);
    }
    if (e.pointerType === "touch") {
      ownerDocument().removeEventListener("click", handler);
      clickHandler = handler;
      ownerDocument().addEventListener("click", handler, {
        once: true,
      });
    } else {
      handler();
    }
  };
  const onFocusIn = (e) => {
    const container = ref();
    const target = e.target;
    if (!container || !target || !isEventOutside(e)) {
      return;
    }
    const handler = composeEventHandlers([onFocusOutside, onInteractOutside]);
    target.addEventListener(FOCUS_OUTSIDE_EVENT, handler, {
      once: true,
    });
    const focusOutsideEvent = new CustomEvent(FOCUS_OUTSIDE_EVENT, {
      bubbles: false,
      cancelable: true,
      detail: {
        originalEvent: e,
        isContextMenu: false,
      },
    });
    target.dispatchEvent(focusOutsideEvent);
  };
  createEffect(() => {
    if (isServer) {
      return;
    }
    if (access$1(props.isDisabled)) {
      return;
    }
    pointerDownTimeoutId = window.setTimeout(() => {
      ownerDocument().addEventListener("pointerdown", onPointerDown, true);
    }, 0);
    ownerDocument().addEventListener("focusin", onFocusIn, true);
    onCleanup(() => {
      window.clearTimeout(pointerDownTimeoutId);
      ownerDocument().removeEventListener("click", clickHandler);
      ownerDocument().removeEventListener("pointerdown", onPointerDown, true);
      ownerDocument().removeEventListener("focusin", onFocusIn, true);
    });
  });
}

// src/polymorphic/polymorphic.tsx
function Polymorphic(props) {
  const [local, others] = splitProps(props, ["as"]);
  if (!local.as) {
    throw new Error(
      "[kobalte]: Polymorphic is missing the required `as` prop."
    );
  }
  return (
    // @ts-ignore: Props are valid but not worth calculating
    createComponent(
      Dynamic,
      mergeProps$1(
        {
          get component() {
            return local.as;
          },
        },
        others
      )
    )
  );
}

var DismissableLayerContext = createContext();
function useOptionalDismissableLayerContext() {
  return useContext(DismissableLayerContext);
}

// src/dismissable-layer/dismissable-layer.tsx
function DismissableLayer(props) {
  let ref;
  const parentContext = useOptionalDismissableLayerContext();
  const [local, others] = splitProps(props, [
    "ref",
    "disableOutsidePointerEvents",
    "excludedElements",
    "onEscapeKeyDown",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
    "onDismiss",
    "bypassTopMostLayerCheck",
  ]);
  const nestedLayers = /* @__PURE__ */ new Set([]);
  const registerNestedLayer = (element) => {
    nestedLayers.add(element);
    const parentUnregister = parentContext?.registerNestedLayer(element);
    return () => {
      nestedLayers.delete(element);
      parentUnregister?.();
    };
  };
  const shouldExcludeElement = (element) => {
    if (!ref) {
      return false;
    }
    return (
      local.excludedElements?.some((node) => contains$1(node(), element)) ||
      [...nestedLayers].some((layer) => contains$1(layer, element))
    );
  };
  const onPointerDownOutside = (e) => {
    if (!ref || layerStack.isBelowPointerBlockingLayer(ref)) {
      return;
    }
    if (!local.bypassTopMostLayerCheck && !layerStack.isTopMostLayer(ref)) {
      return;
    }
    local.onPointerDownOutside?.(e);
    local.onInteractOutside?.(e);
    if (!e.defaultPrevented) {
      local.onDismiss?.();
    }
  };
  const onFocusOutside = (e) => {
    local.onFocusOutside?.(e);
    local.onInteractOutside?.(e);
    if (!e.defaultPrevented) {
      local.onDismiss?.();
    }
  };
  createInteractOutside(
    {
      shouldExcludeElement,
      onPointerDownOutside,
      onFocusOutside,
    },
    () => ref
  );
  createEscapeKeyDown({
    ownerDocument: () => getDocument(ref),
    onEscapeKeyDown: (e) => {
      if (!ref || !layerStack.isTopMostLayer(ref)) {
        return;
      }
      local.onEscapeKeyDown?.(e);
      if (!e.defaultPrevented && local.onDismiss) {
        e.preventDefault();
        local.onDismiss();
      }
    },
  });
  onMount(() => {
    if (!ref) {
      return;
    }
    layerStack.addLayer({
      node: ref,
      isPointerBlocking: local.disableOutsidePointerEvents,
      dismiss: local.onDismiss,
    });
    const unregisterFromParentLayer = parentContext?.registerNestedLayer(ref);
    layerStack.assignPointerEventToLayers();
    layerStack.disableBodyPointerEvents(ref);
    onCleanup(() => {
      if (!ref) {
        return;
      }
      layerStack.removeLayer(ref);
      unregisterFromParentLayer?.();
      layerStack.assignPointerEventToLayers();
      layerStack.restoreBodyPointerEvents(ref);
    });
  });
  createEffect(
    on(
      [() => ref, () => local.disableOutsidePointerEvents],
      ([ref2, disableOutsidePointerEvents]) => {
        if (!ref2) {
          return;
        }
        const layer = layerStack.find(ref2);
        if (layer && layer.isPointerBlocking !== disableOutsidePointerEvents) {
          layer.isPointerBlocking = disableOutsidePointerEvents;
          layerStack.assignPointerEventToLayers();
        }
        if (disableOutsidePointerEvents) {
          layerStack.disableBodyPointerEvents(ref2);
        }
        onCleanup(() => {
          layerStack.restoreBodyPointerEvents(ref2);
        });
      },
      {
        defer: true,
      }
    )
  );
  const context = {
    registerNestedLayer,
  };
  return createComponent(DismissableLayerContext.Provider, {
    value: context,
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "div",
            ref(r$) {
              const _ref$ = mergeRefs((el) => (ref = el), local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
          },
          others
        )
      );
    },
  });
}

// src/primitives/create-controllable-signal/create-controllable-signal.ts
function createControllableSignal(props) {
  const [_value, _setValue] = createSignal(props.defaultValue?.());
  const isControlled = createMemo(() => props.value?.() !== void 0);
  const value = createMemo(() => (isControlled() ? props.value?.() : _value()));
  const setValue = (next) => {
    untrack(() => {
      const nextValue = accessWith(next, value());
      if (!Object.is(nextValue, value())) {
        if (!isControlled()) {
          _setValue(nextValue);
        }
        props.onChange?.(nextValue);
      }
      return nextValue;
    });
  };
  return [value, setValue];
}
function createControllableBooleanSignal(props) {
  const [_value, setValue] = createControllableSignal(props);
  const value = () => _value() ?? false;
  return [value, setValue];
}
function createControllableArraySignal(props) {
  const [_value, setValue] = createControllableSignal(props);
  const value = () => _value() ?? [];
  return [value, setValue];
}

function createDisclosureState(props = {}) {
  const [isOpen, setIsOpen] = createControllableBooleanSignal({
    value: () => access$1(props.open),
    defaultValue: () => !!access$1(props.defaultOpen),
    onChange: (value) => props.onOpenChange?.(value),
  });
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };
  const toggle = () => {
    isOpen() ? close() : open();
  };
  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}

// src/primitives/create-tag-name/create-tag-name.ts
function createTagName(ref, fallback) {
  const [tagName, setTagName] = createSignal(stringOrUndefined(fallback?.()));
  createEffect(() => {
    setTagName(ref()?.tagName.toLowerCase() || stringOrUndefined(fallback?.()));
  });
  return tagName;
}
function stringOrUndefined(value) {
  return isString(value) ? value : void 0;
}

var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
    });
};

// src/button/index.tsx
var button_exports = {};
__export(button_exports, {
  Button: () => Button$1,
  Root: () => ButtonRoot,
});

// src/button/is-button.ts
var BUTTON_INPUT_TYPES = [
  "button",
  "color",
  "file",
  "image",
  "reset",
  "submit",
];
function isButton(element) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "button") {
    return true;
  }
  if (tagName === "input" && element.type) {
    return BUTTON_INPUT_TYPES.indexOf(element.type) !== -1;
  }
  return false;
}

// src/button/button-root.tsx
function ButtonRoot(props) {
  let ref;
  const mergedProps = mergeDefaultProps(
    {
      type: "button",
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["ref", "type", "disabled"]);
  const tagName = createTagName(
    () => ref,
    () => "button"
  );
  const isNativeButton = createMemo(() => {
    const elementTagName = tagName();
    if (elementTagName == null) {
      return false;
    }
    return isButton({
      tagName: elementTagName,
      type: local.type,
    });
  });
  const isNativeInput = createMemo(() => {
    return tagName() === "input";
  });
  const isNativeLink = createMemo(() => {
    return tagName() === "a" && ref?.getAttribute("href") != null;
  });
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "button",
        ref(r$) {
          const _ref$ = mergeRefs((el) => (ref = el), local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        get type() {
          return isNativeButton() || isNativeInput() ? local.type : void 0;
        },
        get role() {
          return !isNativeButton() && !isNativeLink() ? "button" : void 0;
        },
        get tabIndex() {
          return !isNativeButton() && !isNativeLink() && !local.disabled
            ? 0
            : void 0;
        },
        get disabled() {
          return isNativeButton() || isNativeInput() ? local.disabled : void 0;
        },
        get ["aria-disabled"]() {
          return !isNativeButton() && !isNativeInput() && local.disabled
            ? true
            : void 0;
        },
        get ["data-disabled"]() {
          return local.disabled ? "" : void 0;
        },
      },
      others
    )
  );
}

// src/button/index.tsx
var Button$1 = ButtonRoot;

// src/primitives/create-register-id/create-register-id.ts
function createRegisterId(setter) {
  return (id) => {
    setter(id);
    return () => setter(void 0);
  };
}

// src/reactivity/lib.ts
var access = (v) => (typeof v === "function" ? v() : v);

var activeStyles = /* @__PURE__ */ new Map();
var createStyle = (props) => {
  createEffect(() => {
    const style = access(props.style) ?? {};
    const properties = access(props.properties) ?? [];
    const originalStyles = {};
    for (const key in style) {
      originalStyles[key] = props.element.style[key];
    }
    const activeStyle = activeStyles.get(props.key);
    if (activeStyle) {
      activeStyle.activeCount++;
    } else {
      activeStyles.set(props.key, {
        activeCount: 1,
        originalStyles,
        properties: properties.map((property) => property.key),
      });
    }
    Object.assign(props.element.style, props.style);
    for (const property of properties) {
      props.element.style.setProperty(property.key, property.value);
    }
    onCleanup(() => {
      const activeStyle2 = activeStyles.get(props.key);
      if (!activeStyle2) return;
      if (activeStyle2.activeCount !== 1) {
        activeStyle2.activeCount--;
        return;
      }
      activeStyles.delete(props.key);
      for (const [key, value] of Object.entries(activeStyle2.originalStyles)) {
        props.element.style[key] = value;
      }
      for (const property of activeStyle2.properties) {
        props.element.style.removeProperty(property);
      }
      if (props.element.style.length === 0) {
        props.element.removeAttribute("style");
      }
      props.cleanup?.();
    });
  });
};
var style_default = createStyle;

// src/scroll/lib.ts
var getScrollDimensions = (element, axis) => {
  switch (axis) {
    case "x":
      return [element.clientWidth, element.scrollLeft, element.scrollWidth];
    case "y":
      return [element.clientHeight, element.scrollTop, element.scrollHeight];
  }
};
var isScrollContainer = (element, axis) => {
  const styles = getComputedStyle(element);
  const overflow = axis === "x" ? styles.overflowX : styles.overflowY;
  return (
    overflow === "auto" ||
    overflow === "scroll" ||
    // The HTML element is a scroll container if it has overflow visible
    (element.tagName === "HTML" && overflow === "visible")
  );
};
var getScrollAtLocation = (location, axis, stopAt) => {
  const directionFactor =
    axis === "x" && window.getComputedStyle(location).direction === "rtl"
      ? -1
      : 1;
  let currentElement = location;
  let availableScroll = 0;
  let availableScrollTop = 0;
  let wrapperReached = false;
  do {
    const [clientSize, scrollOffset, scrollSize] = getScrollDimensions(
      currentElement,
      axis
    );
    const scrolled = scrollSize - clientSize - directionFactor * scrollOffset;
    if (
      (scrollOffset !== 0 || scrolled !== 0) &&
      isScrollContainer(currentElement, axis)
    ) {
      availableScroll += scrolled;
      availableScrollTop += scrollOffset;
    }
    if (currentElement === (stopAt ?? document.documentElement)) {
      wrapperReached = true;
    } else {
      currentElement = currentElement._$host ?? currentElement.parentElement;
    }
  } while (currentElement && !wrapperReached);
  return [availableScroll, availableScrollTop];
};

// src/preventScroll.ts
var [preventScrollStack, setPreventScrollStack] = createSignal([]);
var isActive = (id) =>
  preventScrollStack().indexOf(id) === preventScrollStack().length - 1;
var createPreventScroll = (props) => {
  const defaultedProps = mergeProps(
    {
      element: null,
      enabled: true,
      hideScrollbar: true,
      preventScrollbarShift: true,
      preventScrollbarShiftMode: "padding",
      allowPinchZoom: false,
    },
    props
  );
  const preventScrollId = createUniqueId();
  let currentTouchStart = [0, 0];
  let currentTouchStartAxis = null;
  let currentTouchStartDelta = null;
  createEffect(() => {
    if (!access(defaultedProps.enabled)) return;
    setPreventScrollStack((stack) => [...stack, preventScrollId]);
    onCleanup(() => {
      setPreventScrollStack((stack) =>
        stack.filter((id) => id !== preventScrollId)
      );
    });
  });
  createEffect(() => {
    if (
      !access(defaultedProps.enabled) ||
      !access(defaultedProps.hideScrollbar)
    )
      return;
    const { body } = document;
    const scrollbarWidth = window.innerWidth - body.offsetWidth;
    style_default({
      key: "prevent-scroll-overflow",
      element: body,
      style: {
        overflow: "hidden",
      },
    });
    if (access(defaultedProps.preventScrollbarShift)) {
      const style = {};
      const properties = [];
      if (scrollbarWidth > 0) {
        if (access(defaultedProps.preventScrollbarShiftMode) === "padding") {
          style.paddingRight = `calc(${
            window.getComputedStyle(body).paddingRight
          } + ${scrollbarWidth}px)`;
        } else {
          style.marginRight = `calc(${
            window.getComputedStyle(body).marginRight
          } + ${scrollbarWidth}px)`;
        }
        properties.push({
          key: "--scrollbar-width",
          value: `${scrollbarWidth}px`,
        });
      }
      const offsetTop = window.scrollY;
      const offsetLeft = window.scrollX;
      style_default({
        key: "prevent-scroll-scrollbar",
        element: body,
        style,
        properties,
        cleanup: () => {
          if (scrollbarWidth > 0) {
            window.scrollTo(offsetLeft, offsetTop);
          }
        },
      });
    }
  });
  createEffect(() => {
    if (!isActive(preventScrollId) || !access(defaultedProps.enabled)) return;
    document.addEventListener("wheel", maybePreventWheel, {
      passive: false,
    });
    document.addEventListener("touchstart", logTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", maybePreventTouch, {
      passive: false,
    });
    onCleanup(() => {
      document.removeEventListener("wheel", maybePreventWheel);
      document.removeEventListener("touchstart", logTouchStart);
      document.removeEventListener("touchmove", maybePreventTouch);
    });
  });
  const logTouchStart = (event) => {
    currentTouchStart = getTouchXY(event);
    currentTouchStartAxis = null;
    currentTouchStartDelta = null;
  };
  const maybePreventWheel = (event) => {
    const target = event.target;
    const wrapper = access(defaultedProps.element);
    const delta = getDeltaXY(event);
    const axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? "x" : "y";
    const axisDelta = axis === "x" ? delta[0] : delta[1];
    const resultsInScroll = wouldScroll(target, axis, axisDelta, wrapper);
    let shouldCancel;
    if (wrapper && contains(wrapper, target)) {
      shouldCancel = !resultsInScroll;
    } else {
      shouldCancel = true;
    }
    if (shouldCancel && event.cancelable) {
      event.preventDefault();
    }
  };
  const maybePreventTouch = (event) => {
    const wrapper = access(defaultedProps.element);
    const target = event.target;
    let shouldCancel;
    if (event.touches.length === 2) {
      shouldCancel = !access(defaultedProps.allowPinchZoom);
    } else {
      if (currentTouchStartAxis == null || currentTouchStartDelta === null) {
        const delta = getTouchXY(event).map(
          (touch, i) => currentTouchStart[i] - touch
        );
        const axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? "x" : "y";
        currentTouchStartAxis = axis;
        currentTouchStartDelta = axis === "x" ? delta[0] : delta[1];
      }
      if (target.type === "range") {
        shouldCancel = false;
      } else {
        const wouldResultInScroll = wouldScroll(
          target,
          currentTouchStartAxis,
          currentTouchStartDelta,
          wrapper
        );
        if (wrapper && contains(wrapper, target)) {
          shouldCancel = !wouldResultInScroll;
        } else {
          shouldCancel = true;
        }
      }
    }
    if (shouldCancel && event.cancelable) {
      event.preventDefault();
    }
  };
};
var getDeltaXY = (event) => [event.deltaX, event.deltaY];
var getTouchXY = (event) =>
  event.changedTouches[0]
    ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
    : [0, 0];
var wouldScroll = (target, axis, delta, wrapper) => {
  const targetInWrapper = wrapper !== null && contains(wrapper, target);
  const [availableScroll, availableScrollTop] = getScrollAtLocation(
    target,
    axis,
    targetInWrapper ? wrapper : void 0
  );
  if (delta > 0 && Math.abs(availableScroll) <= 1) {
    return false;
  }
  if (delta < 0 && Math.abs(availableScrollTop) < 1) {
    return false;
  }
  return true;
};
var contains = (wrapper, target) => {
  if (wrapper.contains(target)) return true;
  let currentElement = target;
  while (currentElement) {
    if (currentElement === wrapper) return true;
    currentElement = currentElement._$host ?? currentElement.parentElement;
  }
  return false;
};
var preventScroll_default = createPreventScroll;

// src/index.ts
var src_default$1 = preventScroll_default;

// src/presence.ts
var createPresence = (props) => {
  const refStyles = createMemo(() => {
    const element = access(props.element);
    if (!element) return;
    return getComputedStyle(element);
  });
  const getAnimationName = () => {
    return refStyles()?.animationName ?? "none";
  };
  const [presentState, setPresentState] = createSignal(
    access(props.show) ? "present" : "hidden"
  );
  let animationName = "none";
  createEffect((prevShow) => {
    const show = access(props.show);
    untrack(() => {
      if (prevShow === show) return show;
      const prevAnimationName = animationName;
      const currentAnimationName = getAnimationName();
      if (show) {
        setPresentState("present");
      } else if (
        currentAnimationName === "none" ||
        refStyles()?.display === "none"
      ) {
        setPresentState("hidden");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (prevShow === true && isAnimating) {
          setPresentState("hiding");
        } else {
          setPresentState("hidden");
        }
      }
    });
    return show;
  });
  createEffect(() => {
    const element = access(props.element);
    if (!element) return;
    const handleAnimationStart = (event) => {
      if (event.target === element) {
        animationName = getAnimationName();
      }
    };
    const handleAnimationEnd = (event) => {
      const currentAnimationName = getAnimationName();
      const isCurrentAnimation = currentAnimationName.includes(
        event.animationName
      );
      if (
        event.target === element &&
        isCurrentAnimation &&
        presentState() === "hiding"
      ) {
        setPresentState("hidden");
      }
    };
    element.addEventListener("animationstart", handleAnimationStart);
    element.addEventListener("animationcancel", handleAnimationEnd);
    element.addEventListener("animationend", handleAnimationEnd);
    onCleanup(() => {
      element.removeEventListener("animationstart", handleAnimationStart);
      element.removeEventListener("animationcancel", handleAnimationEnd);
      element.removeEventListener("animationend", handleAnimationEnd);
    });
  });
  return {
    present: () => presentState() === "present" || presentState() === "hiding",
    state: presentState,
  };
};
var presence_default = createPresence;

// src/index.ts
var src_default = presence_default;

// src/dialog/index.tsx
var dialog_exports = {};
__export(dialog_exports, {
  CloseButton: () => DialogCloseButton,
  Content: () => DialogContent,
  Description: () => DialogDescription,
  Dialog: () => Dialog,
  Overlay: () => DialogOverlay,
  Portal: () => DialogPortal,
  Root: () => DialogRoot,
  Title: () => DialogTitle,
  Trigger: () => DialogTrigger,
});
var DialogContext = createContext();
function useDialogContext() {
  const context = useContext(DialogContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useDialogContext` must be used within a `Dialog` component"
    );
  }
  return context;
}

// src/dialog/dialog-close-button.tsx
function DialogCloseButton(props) {
  const context = useDialogContext();
  const [local, others] = splitProps(props, ["aria-label", "onClick"]);
  const onClick = (e) => {
    callHandler(e, local.onClick);
    context.close();
  };
  return createComponent(
    ButtonRoot,
    mergeProps$1(
      {
        get ["aria-label"]() {
          return local["aria-label"] || context.translations().dismiss;
        },
        onClick,
      },
      others
    )
  );
}
function DialogContent(props) {
  let ref;
  const context = useDialogContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("content"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, [
    "ref",
    "onOpenAutoFocus",
    "onCloseAutoFocus",
    "onPointerDownOutside",
    "onFocusOutside",
    "onInteractOutside",
  ]);
  let hasInteractedOutside = false;
  let hasPointerDownOutside = false;
  const onPointerDownOutside = (e) => {
    local.onPointerDownOutside?.(e);
    if (context.modal() && e.detail.isContextMenu) {
      e.preventDefault();
    }
  };
  const onFocusOutside = (e) => {
    local.onFocusOutside?.(e);
    if (context.modal()) {
      e.preventDefault();
    }
  };
  const onInteractOutside = (e) => {
    local.onInteractOutside?.(e);
    if (context.modal()) {
      return;
    }
    if (!e.defaultPrevented) {
      hasInteractedOutside = true;
      if (e.detail.originalEvent.type === "pointerdown") {
        hasPointerDownOutside = true;
      }
    }
    if (contains$1(context.triggerRef(), e.target)) {
      e.preventDefault();
    }
    if (e.detail.originalEvent.type === "focusin" && hasPointerDownOutside) {
      e.preventDefault();
    }
  };
  const onCloseAutoFocus = (e) => {
    local.onCloseAutoFocus?.(e);
    if (context.modal()) {
      e.preventDefault();
      focusWithoutScrolling(context.triggerRef());
    } else {
      if (!e.defaultPrevented) {
        if (!hasInteractedOutside) {
          focusWithoutScrolling(context.triggerRef());
        }
        e.preventDefault();
      }
      hasInteractedOutside = false;
      hasPointerDownOutside = false;
    }
  };
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.modal()),
    targets: () => (ref ? [ref] : []),
  });
  src_default$1({
    element: () => ref ?? null,
    enabled: () => context.isOpen() && context.preventScroll(),
  });
  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.modal(),
      onMountAutoFocus: local.onOpenAutoFocus,
      onUnmountAutoFocus: onCloseAutoFocus,
    },
    () => ref
  );
  createEffect(() => onCleanup(context.registerContentId(others.id)));
  return createComponent(Show, {
    get when() {
      return context.contentPresent();
    },
    get children() {
      return createComponent(
        DismissableLayer,
        mergeProps$1(
          {
            ref(r$) {
              const _ref$ = mergeRefs((el) => {
                context.setContentRef(el);
                ref = el;
              }, local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
            role: "dialog",
            tabIndex: -1,
            get disableOutsidePointerEvents() {
              return memo(() => !!context.modal())() && context.isOpen();
            },
            get excludedElements() {
              return [context.triggerRef];
            },
            get ["aria-labelledby"]() {
              return context.titleId();
            },
            get ["aria-describedby"]() {
              return context.descriptionId();
            },
            get ["data-expanded"]() {
              return context.isOpen() ? "" : void 0;
            },
            get ["data-closed"]() {
              return !context.isOpen() ? "" : void 0;
            },
            onPointerDownOutside,
            onFocusOutside,
            onInteractOutside,
            get onDismiss() {
              return context.close;
            },
          },
          others
        )
      );
    },
  });
}
function DialogDescription(props) {
  const context = useDialogContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["id"]);
  createEffect(() => onCleanup(context.registerDescriptionId(local.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "p",
        get id() {
          return local.id;
        },
      },
      others
    )
  );
}
function DialogOverlay(props) {
  const context = useDialogContext();
  const [local, others] = splitProps(props, ["ref", "style", "onPointerDown"]);
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    if (e.target === e.currentTarget) {
      e.preventDefault();
    }
  };
  return createComponent(Show, {
    get when() {
      return context.overlayPresent();
    },
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "div",
            ref(r$) {
              const _ref$ = mergeRefs(context.setOverlayRef, local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
            get style() {
              return {
                "pointer-events": "auto",
                ...local.style,
              };
            },
            get ["data-expanded"]() {
              return context.isOpen() ? "" : void 0;
            },
            get ["data-closed"]() {
              return !context.isOpen() ? "" : void 0;
            },
            onPointerDown,
          },
          others
        )
      );
    },
  });
}
function DialogPortal(props) {
  const context = useDialogContext();
  return createComponent(Show, {
    get when() {
      return context.contentPresent() || context.overlayPresent();
    },
    get children() {
      return createComponent(Portal, props);
    },
  });
}

// src/dialog/dialog.intl.ts
var DIALOG_INTL_TRANSLATIONS = {
  // `aria-label` of Dialog.CloseButton.
  dismiss: "Dismiss",
};

// src/dialog/dialog-root.tsx
function DialogRoot(props) {
  const defaultId = `dialog-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
      modal: true,
      translations: DIALOG_INTL_TRANSLATIONS,
    },
    props
  );
  const [contentId, setContentId] = createSignal();
  const [titleId, setTitleId] = createSignal();
  const [descriptionId, setDescriptionId] = createSignal();
  const [overlayRef, setOverlayRef] = createSignal();
  const [contentRef, setContentRef] = createSignal();
  const [triggerRef, setTriggerRef] = createSignal();
  const disclosureState = createDisclosureState({
    open: () => mergedProps.open,
    defaultOpen: () => mergedProps.defaultOpen,
    onOpenChange: (isOpen) => mergedProps.onOpenChange?.(isOpen),
  });
  const shouldMount = () => mergedProps.forceMount || disclosureState.isOpen();
  const { present: overlayPresent } = src_default({
    show: shouldMount,
    element: () => overlayRef() ?? null,
  });
  const { present: contentPresent } = src_default({
    show: shouldMount,
    element: () => contentRef() ?? null,
  });
  const context = {
    translations: () => mergedProps.translations ?? DIALOG_INTL_TRANSLATIONS,
    isOpen: disclosureState.isOpen,
    modal: () => mergedProps.modal ?? true,
    preventScroll: () => mergedProps.preventScroll ?? context.modal(),
    contentId,
    titleId,
    descriptionId,
    triggerRef,
    overlayRef,
    setOverlayRef,
    contentRef,
    setContentRef,
    overlayPresent,
    contentPresent,
    close: disclosureState.close,
    toggle: disclosureState.toggle,
    setTriggerRef,
    generateId: createGenerateId(() => mergedProps.id),
    registerContentId: createRegisterId(setContentId),
    registerTitleId: createRegisterId(setTitleId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };
  return createComponent(DialogContext.Provider, {
    value: context,
    get children() {
      return mergedProps.children;
    },
  });
}
function DialogTitle(props) {
  const context = useDialogContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("title"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["id"]);
  createEffect(() => onCleanup(context.registerTitleId(local.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "h2",
        get id() {
          return local.id;
        },
      },
      others
    )
  );
}
function DialogTrigger(props) {
  const context = useDialogContext();
  const [local, others] = splitProps(props, ["ref", "onClick"]);
  const onClick = (e) => {
    callHandler(e, local.onClick);
    context.toggle();
  };
  return createComponent(
    ButtonRoot,
    mergeProps$1(
      {
        ref(r$) {
          const _ref$ = mergeRefs(context.setTriggerRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        "aria-haspopup": "dialog",
        get ["aria-expanded"]() {
          return context.isOpen();
        },
        get ["aria-controls"]() {
          return memo(() => !!context.isOpen())()
            ? context.contentId()
            : void 0;
        },
        get ["data-expanded"]() {
          return context.isOpen() ? "" : void 0;
        },
        get ["data-closed"]() {
          return !context.isOpen() ? "" : void 0;
        },
        onClick,
      },
      others
    )
  );
}

// src/dialog/index.tsx
var Dialog = Object.assign(DialogRoot, {
  CloseButton: DialogCloseButton,
  Content: DialogContent,
  Description: DialogDescription,
  Overlay: DialogOverlay,
  Portal: DialogPortal,
  Title: DialogTitle,
  Trigger: DialogTrigger,
});

function Button(p) {
  return createComponent(Button$1, {
    class:
      "ui-hoverable ui-disabled:ui-disabled ui-focusable inline-flex select-none appearance-none items-center justify-center whitespace-nowrap rounded border border-transparent bg-primary px-4 py-2 align-middle text-base font-400 text-primary-content data-neutral:bg-neutral data-neutral:text-neutral-content data-success:bg-success data-success:text-success-content data-danger:bg-danger data-danger:text-danger-content",
    get onClick() {
      return p.onClick;
    },
    get type() {
      return p.type;
    },
    get disabled() {
      return p.disabled;
    },
    get ["data-intent"]() {
      return p.intent;
    },
    get autofocus() {
      return p.autofocus;
    },
    get form() {
      return p.form;
    },
    get children() {
      return p.children;
    },
  });
}

var FORM_CONTROL_PROP_NAMES = [
  "id",
  "name",
  "validationState",
  "required",
  "disabled",
  "readOnly",
];
function createFormControl(props) {
  const defaultId = `form-control-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
    },
    props
  );
  const [labelId, setLabelId] = createSignal();
  const [fieldId, setFieldId] = createSignal();
  const [descriptionId, setDescriptionId] = createSignal();
  const [errorMessageId, setErrorMessageId] = createSignal();
  const getAriaLabelledBy = (fieldId2, fieldAriaLabel, fieldAriaLabelledBy) => {
    const hasAriaLabelledBy = fieldAriaLabelledBy != null || labelId() != null;
    return (
      [
        fieldAriaLabelledBy,
        labelId(),
        // If there is both an aria-label and aria-labelledby, add the field itself has an aria-labelledby
        hasAriaLabelledBy && fieldAriaLabel != null ? fieldId2 : void 0,
      ]
        .filter(Boolean)
        .join(" ") || void 0
    );
  };
  const getAriaDescribedBy = (fieldAriaDescribedBy) => {
    return (
      [
        descriptionId(),
        // Use aria-describedby for error message because aria-errormessage is unsupported using VoiceOver or NVDA.
        // See https://github.com/adobe/react-spectrum/issues/1346#issuecomment-740136268
        errorMessageId(),
        fieldAriaDescribedBy,
      ]
        .filter(Boolean)
        .join(" ") || void 0
    );
  };
  const dataset = createMemo(() => ({
    "data-valid":
      access$1(mergedProps.validationState) === "valid" ? "" : void 0,
    "data-invalid":
      access$1(mergedProps.validationState) === "invalid" ? "" : void 0,
    "data-required": access$1(mergedProps.required) ? "" : void 0,
    "data-disabled": access$1(mergedProps.disabled) ? "" : void 0,
    "data-readonly": access$1(mergedProps.readOnly) ? "" : void 0,
  }));
  const formControlContext = {
    name: () => access$1(mergedProps.name) ?? access$1(mergedProps.id),
    dataset,
    validationState: () => access$1(mergedProps.validationState),
    isRequired: () => access$1(mergedProps.required),
    isDisabled: () => access$1(mergedProps.disabled),
    isReadOnly: () => access$1(mergedProps.readOnly),
    labelId,
    fieldId,
    descriptionId,
    errorMessageId,
    getAriaLabelledBy,
    getAriaDescribedBy,
    generateId: createGenerateId(() => access$1(mergedProps.id)),
    registerLabel: createRegisterId(setLabelId),
    registerField: createRegisterId(setFieldId),
    registerDescription: createRegisterId(setDescriptionId),
    registerErrorMessage: createRegisterId(setErrorMessageId),
  };
  return {
    formControlContext,
  };
}
var FormControlContext = createContext();
function useFormControlContext() {
  const context = useContext(FormControlContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component"
    );
  }
  return context;
}
function FormControlDescription(props) {
  const context = useFormControlContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );
  createEffect(() => onCleanup(context.registerDescription(mergedProps.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
      },
      () => context.dataset(),
      mergedProps
    )
  );
}
function FormControlErrorMessage(props) {
  const context = useFormControlContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("error-message"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["forceMount"]);
  const isInvalid = () => context.validationState() === "invalid";
  createEffect(() => {
    if (!isInvalid()) {
      return;
    }
    onCleanup(context.registerErrorMessage(others.id));
  });
  return createComponent(Show, {
    get when() {
      return local.forceMount || isInvalid();
    },
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "div",
          },
          () => context.dataset(),
          others
        )
      );
    },
  });
}
function FormControlLabel(props) {
  let ref;
  const context = useFormControlContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["ref"]);
  const tagName = createTagName(
    () => ref,
    () => "label"
  );
  createEffect(() => onCleanup(context.registerLabel(others.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "label",
        ref(r$) {
          const _ref$ = mergeRefs((el) => (ref = el), local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        get ["for"]() {
          return memo(() => tagName() === "label")()
            ? context.fieldId()
            : void 0;
        },
      },
      () => context.dataset(),
      others
    )
  );
}

var FORM_CONTROL_FIELD_PROP_NAMES = [
  "id",
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
];
function createFormControlField(props) {
  const context = useFormControlContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("field"),
    },
    props
  );
  createEffect(() =>
    onCleanup(context.registerField(access$1(mergedProps.id)))
  );
  return {
    fieldProps: {
      id: () => access$1(mergedProps.id),
      ariaLabel: () => access$1(mergedProps["aria-label"]),
      ariaLabelledBy: () =>
        context.getAriaLabelledBy(
          access$1(mergedProps.id),
          access$1(mergedProps["aria-label"]),
          access$1(mergedProps["aria-labelledby"])
        ),
      ariaDescribedBy: () =>
        context.getAriaDescribedBy(access$1(mergedProps["aria-describedby"])),
    },
  };
}

// src/primitives/create-form-reset-listener/create-form-reset-listener.ts
function createFormResetListener(element, handler) {
  createEffect(
    on(element, (element2) => {
      if (element2 == null) {
        return;
      }
      const form = getClosestForm(element2);
      if (form == null) {
        return;
      }
      form.addEventListener("reset", handler, {
        passive: true,
      });
      onCleanup(() => {
        form.removeEventListener("reset", handler);
      });
    })
  );
}
function getClosestForm(element) {
  return isFormElement(element) ? element.form : element.closest("form");
}
function isFormElement(element) {
  return element.matches("textarea, input, select, button");
}

// src/text-field/index.tsx
var text_field_exports = {};
__export(text_field_exports, {
  Description: () => FormControlDescription,
  ErrorMessage: () => FormControlErrorMessage,
  Input: () => TextFieldInput,
  Label: () => FormControlLabel,
  Root: () => TextFieldRoot,
  TextArea: () => TextFieldTextArea,
  TextField: () => TextField,
});
var TextFieldContext = createContext();
function useTextFieldContext() {
  const context = useContext(TextFieldContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useTextFieldContext` must be used within a `TextField` component"
    );
  }
  return context;
}

// src/text-field/text-field-input.tsx
function TextFieldInput(props) {
  return createComponent(
    TextFieldInputBase,
    mergeProps$1(
      {
        type: "text",
      },
      props
    )
  );
}
function TextFieldInputBase(props) {
  const formControlContext = useFormControlContext();
  const context = useTextFieldContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );
  const [local, formControlFieldProps, others] = splitProps(
    mergedProps,
    ["onInput"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );
  const { fieldProps } = createFormControlField(formControlFieldProps);
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "input",
        get id() {
          return fieldProps.id();
        },
        get name() {
          return formControlContext.name();
        },
        get value() {
          return context.value();
        },
        get required() {
          return formControlContext.isRequired();
        },
        get disabled() {
          return formControlContext.isDisabled();
        },
        get readonly() {
          return formControlContext.isReadOnly();
        },
        get ["aria-label"]() {
          return fieldProps.ariaLabel();
        },
        get ["aria-labelledby"]() {
          return fieldProps.ariaLabelledBy();
        },
        get ["aria-describedby"]() {
          return fieldProps.ariaDescribedBy();
        },
        get ["aria-invalid"]() {
          return formControlContext.validationState() === "invalid" || void 0;
        },
        get ["aria-required"]() {
          return formControlContext.isRequired() || void 0;
        },
        get ["aria-disabled"]() {
          return formControlContext.isDisabled() || void 0;
        },
        get ["aria-readonly"]() {
          return formControlContext.isReadOnly() || void 0;
        },
        get onInput() {
          return composeEventHandlers([local.onInput, context.onInput]);
        },
      },
      () => formControlContext.dataset(),
      others
    )
  );
}
function TextFieldRoot(props) {
  let ref;
  const defaultId = `textfield-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
    },
    props
  );
  const [local, formControlProps, others] = splitProps(
    mergedProps,
    ["ref", "value", "defaultValue", "onChange"],
    FORM_CONTROL_PROP_NAMES
  );
  const [value, setValue] = createControllableSignal({
    value: () => local.value,
    defaultValue: () => local.defaultValue,
    onChange: (value2) => local.onChange?.(value2),
  });
  const { formControlContext } = createFormControl(formControlProps);
  createFormResetListener(
    () => ref,
    () => setValue(local.defaultValue ?? "")
  );
  const onInput = (e) => {
    if (formControlContext.isReadOnly() || formControlContext.isDisabled()) {
      return;
    }
    const target = e.target;
    setValue(target.value);
    target.value = value() ?? "";
  };
  const context = {
    value,
    generateId: createGenerateId(() => access$1(formControlProps.id)),
    onInput,
  };
  return createComponent(FormControlContext.Provider, {
    value: formControlContext,
    get children() {
      return createComponent(TextFieldContext.Provider, {
        value: context,
        get children() {
          return createComponent(
            Polymorphic,
            mergeProps$1(
              {
                as: "div",
                ref(r$) {
                  const _ref$ = mergeRefs((el) => (ref = el), local.ref);
                  typeof _ref$ === "function" && _ref$(r$);
                },
                role: "group",
                get id() {
                  return access$1(formControlProps.id);
                },
              },
              () => formControlContext.dataset(),
              others
            )
          );
        },
      });
    },
  });
}
function TextFieldTextArea(props) {
  let ref;
  const context = useTextFieldContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("textarea"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, [
    "ref",
    "autoResize",
    "submitOnEnter",
    "onKeyPress",
  ]);
  createEffect(
    on(
      [() => ref, () => local.autoResize, () => context.value()],
      ([ref2, autoResize]) => {
        if (!ref2 || !autoResize) {
          return;
        }
        adjustHeight(ref2);
      }
    )
  );
  const onKeyPress = (event) => {
    if (
      ref &&
      local.submitOnEnter &&
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      if (ref.form) {
        ref.form.requestSubmit();
        event.preventDefault();
      }
    }
  };
  return createComponent(
    TextFieldInputBase,
    mergeProps$1(
      {
        as: "textarea",
        get ["aria-multiline"]() {
          return local.submitOnEnter ? "false" : void 0;
        },
        get onKeyPress() {
          return composeEventHandlers([local.onKeyPress, onKeyPress]);
        },
        ref(r$) {
          const _ref$ = mergeRefs((el) => (ref = el), local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
      },
      others
    )
  );
}
function adjustHeight(el) {
  const prevAlignment = el.style.alignSelf;
  const prevOverflow = el.style.overflow;
  const isFirefox = "MozAppearance" in el.style;
  if (!isFirefox) {
    el.style.overflow = "hidden";
  }
  el.style.alignSelf = "start";
  el.style.height = "auto";
  el.style.height = `${
    el.scrollHeight + (el.offsetHeight - el.clientHeight)
  }px`;
  el.style.overflow = prevOverflow;
  el.style.alignSelf = prevAlignment;
}

// src/text-field/index.tsx
var TextField = Object.assign(TextFieldRoot, {
  Description: FormControlDescription,
  ErrorMessage: FormControlErrorMessage,
  Input: TextFieldInput,
  Label: FormControlLabel,
  TextArea: TextFieldTextArea,
});

function Input(p) {
  return createComponent(TextField, {
    class:
      "inline-flex w-[200px] flex-col align-middle data-[width=true]:w-full",
    get value() {
      return p.value;
    },
    get ["data-width"]() {
      return p.fullWidth;
    },
    get onChange() {
      return p.onChange;
    },
    get children() {
      return [
        createComponent(Show, {
          get when() {
            return p.label;
          },
          keyed: true,
          children: (keyedLabel) => {
            return createComponent(TextField.Label, {
              class: "text-base-content",
              get ["data-intent"]() {
                return p.intent;
              },
              children: keyedLabel,
            });
          },
        }),
        createComponent(TextField.Input, {
          class:
            "ui-focusable inline-flex w-full appearance-none rounded border border-base-300 bg-base-100 px-4 py-2 align-middle text-base text-base-content",
          get ["data-intent"]() {
            return p.intent;
          },
          get autofocus() {
            return p.autofocus;
          },
        }),
      ];
    },
  });
}

var _tmpl$$9 = /*#__PURE__*/ template(
    `<div class="fixed inset-0 z-50 flex items-center justify-center">`
  ),
  _tmpl$2$3 = /*#__PURE__*/ template(`<div class=space-y-3>`),
  _tmpl$3$1 = /*#__PURE__*/ template(`<div class=ui-space-y>`),
  _tmpl$4$1 = /*#__PURE__*/ template(
    `<h2 class="text-lg font-700 leading-6 data-primary:text-primary data-neutral:text-neutral data-success:text-success data-danger:text-danger">`
  ),
  _tmpl$5$1 = /*#__PURE__*/ template(`<p class="">`),
  _tmpl$6$1 = /*#__PURE__*/ template(`<div class="">`),
  _tmpl$7$1 = /*#__PURE__*/ template(`<div class=ui-space-x-sm>`),
  _tmpl$8$1 = /*#__PURE__*/ template(
    `<form id=promptForm class="ui-space-y w-full"><div class=ui-space-x-sm>`
  );

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Inputs ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// States ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function isACPState(alertState) {
  return alertState?.stateType !== "component";
}
function isAlertState(alertState) {
  return alertState?.stateType === "alert";
}
function isConfirmState(alertState) {
  return alertState?.stateType === "confirm";
}
function isPromptState(alertState) {
  return alertState?.stateType === "prompt";
}
function isComponentState(alertState) {
  return alertState?.stateType === "component";
}
const [alertState, setAlertState] = createSignal(undefined);
async function openAlert(v) {
  return new Promise((resolve, reject) => {
    setAlertState({
      ...v,
      stateType: "alert",
      alertResolver: resolve,
    });
  });
}
async function openConfirm(v) {
  return new Promise((resolve, reject) => {
    setAlertState({
      ...v,
      stateType: "confirm",
      confirmResolver: resolve,
    });
  });
}
async function openPrompt(v) {
  return new Promise((resolve, reject) => {
    setAlertState({
      ...v,
      stateType: "prompt",
      promptResolver: resolve,
    });
  });
}
async function openComponent(v) {
  return new Promise((resolve, reject) => {
    setAlertState({
      ...v,
      stateType: "component",
      componentResolver: resolve,
    });
  });
}
function AlertProvider() {
  function cancelAny() {
    const ass = alertState();
    if (isAlertState(ass)) {
      ass.alertResolver();
    }
    if (isConfirmState(ass)) {
      ass.confirmResolver(false);
    }
    if (isPromptState(ass)) {
      ass.promptResolver(undefined);
    }
    if (isComponentState(ass)) {
      ass.componentResolver(undefined);
    }
    setAlertState(undefined);
  }
  return createComponent(Show, {
    get when() {
      return alertState();
    },
    keyed: true,
    children: (keyedAlertState) => {
      return createComponent(Dialog, {
        open: true,
        modal: true,
        onOpenChange: cancelAny,
        get children() {
          return createComponent(Dialog.Portal, {
            get children() {
              return [
                createComponent(Dialog.Overlay, {
                  class: "fixed inset-0 z-50 bg-black bg-opacity-30",
                }),
                (() => {
                  var _el$ = _tmpl$$9();
                  insert(
                    _el$,
                    createComponent(Switch, {
                      get children() {
                        return [
                          createComponent(Match, {
                            get when() {
                              return (
                                isComponentState(keyedAlertState) &&
                                keyedAlertState
                              );
                            },
                            keyed: true,
                            children: (keyedComponentState) => {
                              return createComponent(Dialog.Content, {
                                class:
                                  "ui-never-focusable z-50 rounded bg-base-100 shadow-lg outline-none",
                                get children() {
                                  return createComponent(
                                    Dynamic,
                                    mergeProps$1(
                                      {
                                        get component() {
                                          return keyedComponentState.element;
                                        },
                                        close: (p) => {
                                          keyedComponentState.componentResolver(
                                            p
                                          );
                                          setAlertState(undefined);
                                        },
                                      },
                                      () => keyedComponentState.elementProps
                                    )
                                  );
                                },
                              });
                            },
                          }),
                          createComponent(Match, {
                            get when() {
                              return (
                                isACPState(keyedAlertState) && keyedAlertState
                              );
                            },
                            keyed: true,
                            children: (keyedACPState) => {
                              return createComponent(Dialog.Content, {
                                class:
                                  "ui-pad ui-alert-w ui-never-focusable z-50 rounded bg-base-100 shadow-lg",
                                get children() {
                                  var _el$2 = _tmpl$3$1();
                                  insert(
                                    _el$2,
                                    createComponent(Show, {
                                      get when() {
                                        return (
                                          keyedACPState.title ||
                                          keyedACPState.text
                                        );
                                      },
                                      get children() {
                                        var _el$3 = _tmpl$2$3();
                                        insert(
                                          _el$3,
                                          createComponent(Show, {
                                            get when() {
                                              return keyedACPState.title;
                                            },
                                            keyed: true,
                                            children: (keyedTitle) => {
                                              return (() => {
                                                var _el$4 = _tmpl$4$1();
                                                insert(_el$4, keyedTitle);
                                                effect(() =>
                                                  setAttribute(
                                                    _el$4,
                                                    "data-intent",
                                                    keyedACPState.intent
                                                  )
                                                );
                                                return _el$4;
                                              })();
                                            },
                                          }),
                                          null
                                        );
                                        insert(
                                          _el$3,
                                          createComponent(Show, {
                                            get when() {
                                              return keyedACPState.text;
                                            },
                                            keyed: true,
                                            children: (keyedText) => {
                                              return (() => {
                                                var _el$5 = _tmpl$5$1();
                                                insert(_el$5, keyedText);
                                                return _el$5;
                                              })();
                                            },
                                          }),
                                          null
                                        );
                                        return _el$3;
                                      },
                                    }),
                                    null
                                  );
                                  insert(
                                    _el$2,
                                    createComponent(Switch, {
                                      get children() {
                                        return [
                                          createComponent(Match, {
                                            get when() {
                                              return (
                                                isAlertState(keyedACPState) &&
                                                keyedACPState
                                              );
                                            },
                                            keyed: true,
                                            children: (keyedAlertState) => {
                                              return (() => {
                                                var _el$6 = _tmpl$6$1();
                                                insert(
                                                  _el$6,
                                                  createComponent(Button, {
                                                    onClick: () => {
                                                      keyedAlertState.alertResolver();
                                                      setAlertState(undefined);
                                                    },
                                                    get intent() {
                                                      return keyedAlertState.intent;
                                                    },
                                                    get children() {
                                                      return (
                                                        keyedAlertState.closeButtonLabel ??
                                                        "Close"
                                                      );
                                                    },
                                                  })
                                                );
                                                return _el$6;
                                              })();
                                            },
                                          }),
                                          createComponent(Match, {
                                            get when() {
                                              return (
                                                isConfirmState(keyedACPState) &&
                                                keyedACPState
                                              );
                                            },
                                            keyed: true,
                                            children: (keyedConfirmState) => {
                                              return (() => {
                                                var _el$7 = _tmpl$7$1();
                                                insert(
                                                  _el$7,
                                                  createComponent(Button, {
                                                    onClick: () => {
                                                      keyedConfirmState.confirmResolver(
                                                        true
                                                      );
                                                      setAlertState(undefined);
                                                    },
                                                    get intent() {
                                                      return keyedConfirmState.intent;
                                                    },
                                                    get children() {
                                                      return (
                                                        keyedConfirmState.confirmButtonLabel ??
                                                        "Confirm"
                                                      );
                                                    },
                                                  }),
                                                  null
                                                );
                                                insert(
                                                  _el$7,
                                                  createComponent(Button, {
                                                    onClick: () => {
                                                      keyedConfirmState.confirmResolver(
                                                        false
                                                      );
                                                      setAlertState(undefined);
                                                    },
                                                    intent: "neutral",
                                                    autofocus: true,
                                                    children: "Cancel",
                                                  }),
                                                  null
                                                );
                                                return _el$7;
                                              })();
                                            },
                                          }),
                                          createComponent(Match, {
                                            get when() {
                                              return (
                                                isPromptState(keyedACPState) &&
                                                keyedACPState
                                              );
                                            },
                                            keyed: true,
                                            children: (keyedPromptState) => {
                                              return createComponent(
                                                InnerForPrompt,
                                                {
                                                  get pst() {
                                                    return alertState();
                                                  },
                                                  close: (v) => {
                                                    keyedPromptState.promptResolver(
                                                      v
                                                    );
                                                    setAlertState(undefined);
                                                  },
                                                }
                                              );
                                            },
                                          }),
                                        ];
                                      },
                                    }),
                                    null
                                  );
                                  return _el$2;
                                },
                              });
                            },
                          }),
                        ];
                      },
                    })
                  );
                  return _el$;
                })(),
              ];
            },
          });
        },
      });
    },
  });
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function InnerForPrompt(props) {
  const [promptInput, setPromptInput] = createSignal(
    props.pst.initialInputText
  );
  return (() => {
    var _el$8 = _tmpl$8$1(),
      _el$9 = _el$8.firstChild;
    insert(
      _el$8,
      createComponent(Input, {
        get label() {
          return props.pst.inputLabel;
        },
        get value() {
          return promptInput();
        },
        onChange: (v) => setPromptInput(v),
        autofocus: true,
        fullWidth: true,
      }),
      _el$9
    );
    insert(
      _el$9,
      createComponent(Button, {
        type: "submit",
        form: "promptForm",
        onClick: (evt) => {
          evt.preventDefault();
          props.close(promptInput());
        },
        get intent() {
          return props.pst.intent;
        },
        get children() {
          return props.pst.saveButtonLabel ?? "Confirm";
        },
      }),
      null
    );
    insert(
      _el$9,
      createComponent(Button, {
        type: "button",
        onClick: (evt) => {
          evt.preventDefault();
          props.close(undefined);
        },
        intent: "neutral",
        children: "Cancel",
      }),
      null
    );
    return _el$8;
  })();
}

var _tmpl$$8 = /*#__PURE__*/ template(`<canvas class=w-full width=4000>`);
function ChartHolderAnimated(p) {
  let canvas;
  const fixedCanvasH = p.aspectRatio ? 4000 / p.aspectRatio : 4000;
  const tween = new TWEEN.Tween(p.obj).easing(TWEEN.Easing.Cubic.InOut);
  function render(obj) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rcd =
      p.getChartRcd?.(obj) ??
      new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, p.getChartInputs(obj), rcd);
  }
  createEffect(() => {
    if (tween.isPlaying()) {
      tween.stop();
    }
    tween
      .to(p.obj, 500)
      .onUpdate(function (object) {
        render(object);
      })
      .startFromCurrentValues();
    play();
    render(p.obj);
  });
  function play() {
    if (!tween.isPlaying()) {
      return;
    }
    requestAnimationFrame(play);
    tween.update();
  }
  return (() => {
    var _el$ = _tmpl$$8();
    var _ref$ = canvas;
    typeof _ref$ === "function" ? use(_ref$, _el$) : (canvas = _el$);
    setAttribute(_el$, "height", fixedCanvasH);
    return _el$;
  })();
}

var _tmpl$$7 = /*#__PURE__*/ template(
  `<div class=w-full><canvas class=w-full width=4000 height=0>`
);
function ChartHolderFixedHeight(p) {
  let div;
  let canvas;
  const fixedCanvasW = 4000;
  createEffect(() => {
    const domW = div.getBoundingClientRect().width;
    updateChart$1(canvas, p.chartInputs, fixedCanvasW, domW, p.domH);
  });
  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize && p.chartInputs) {
          const w = entry.contentBoxSize[0].inlineSize;
          updateChart$1(canvas, p.chartInputs, fixedCanvasW, w, p.domH);
        }
      }
    });
    observer.observe(div);
  });
  return (() => {
    var _el$ = _tmpl$$7(),
      _el$2 = _el$.firstChild;
    var _ref$ = div;
    typeof _ref$ === "function" ? use(_ref$, _el$) : (div = _el$);
    var _ref$2 = canvas;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : (canvas = _el$2);
    return _el$;
  })();
}
function updateChart$1(canvas, chartInputs, fixedCanvasW, domW, domH) {
  requestAnimationFrame(() => {
    if (domW === 0) {
      return;
    }
    canvas.height = (fixedCanvasW * domH) / domW;
    const ctx = canvas.getContext("2d");
    const rcd = new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, chartInputs, rcd, fixedCanvasW / domW);
  });
}

var _tmpl$$6 = /*#__PURE__*/ template(
  `<div class="h-full w-full overflow-hidden"><canvas class=h-full width=2000 height=0>`
);
function ChartHolderFlex(p) {
  let div;
  let canvas;
  const fixedCanvasW = 2000;
  createEffect(() => {
    const domW = div.getBoundingClientRect().width;
    const domH = div.getBoundingClientRect().height;
    updateChart(canvas, p.chartInputs, fixedCanvasW, domW, domH);
  });
  onMount(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize && p.chartInputs) {
          const w = entry.contentBoxSize[0].inlineSize;
          const h = entry.contentBoxSize[0].blockSize;
          updateChart(canvas, p.chartInputs, fixedCanvasW, w, h);
        }
      }
    });
    observer.observe(div);
  });
  return (() => {
    var _el$ = _tmpl$$6(),
      _el$2 = _el$.firstChild;
    var _ref$ = div;
    typeof _ref$ === "function" ? use(_ref$, _el$) : (div = _el$);
    var _ref$2 = canvas;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : (canvas = _el$2);
    return _el$;
  })();
}
function updateChart(canvas, chartInputs, fixedCanvasW, domW, domH) {
  requestAnimationFrame(() => {
    if (domW === 0) {
      return;
    }
    canvas.height = (fixedCanvasW * domH) / domW;
    const ctx = canvas.getContext("2d");
    const rcd = new RectCoordsDims([0, 0, canvas.width, canvas.height]);
    renderChart(ctx, chartInputs, rcd, fixedCanvasW / domW);
  });
}

function createToggleState(props = {}) {
  const [isSelected, _setIsSelected] = createControllableBooleanSignal({
    value: () => access$1(props.isSelected),
    defaultValue: () => !!access$1(props.defaultIsSelected),
    onChange: (value) => props.onSelectedChange?.(value),
  });
  const setIsSelected = (value) => {
    if (!access$1(props.isReadOnly) && !access$1(props.isDisabled)) {
      _setIsSelected(value);
    }
  };
  const toggle = () => {
    if (!access$1(props.isReadOnly) && !access$1(props.isDisabled)) {
      _setIsSelected(!isSelected());
    }
  };
  return {
    isSelected,
    setIsSelected,
    toggle,
  };
}

// src/checkbox/index.tsx
var checkbox_exports = {};
__export(checkbox_exports, {
  Checkbox: () => Checkbox$1,
  Control: () => CheckboxControl,
  Description: () => CheckboxDescription,
  ErrorMessage: () => CheckboxErrorMessage,
  Indicator: () => CheckboxIndicator,
  Input: () => CheckboxInput,
  Label: () => CheckboxLabel,
  Root: () => CheckboxRoot,
});
var CheckboxContext = createContext();
function useCheckboxContext() {
  const context = useContext(CheckboxContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useCheckboxContext` must be used within a `Checkbox` component"
    );
  }
  return context;
}

// src/checkbox/checkbox-control.tsx
function CheckboxControl(props) {
  const formControlContext = useFormControlContext();
  const context = useCheckboxContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("control"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["onClick", "onKeyDown"]);
  const onClick = (e) => {
    callHandler(e, local.onClick);
    context.toggle();
    context.inputRef()?.focus();
  };
  const onKeyDown = (e) => {
    callHandler(e, local.onKeyDown);
    if (e.key === EventKey.Space) {
      context.toggle();
      context.inputRef()?.focus();
    }
  };
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
        onClick,
        onKeyDown,
      },
      () => formControlContext.dataset(),
      () => context.dataset(),
      others
    )
  );
}
function CheckboxDescription(props) {
  const context = useCheckboxContext();
  return createComponent(
    FormControlDescription,
    mergeProps$1(() => context.dataset(), props)
  );
}
function CheckboxErrorMessage(props) {
  const context = useCheckboxContext();
  return createComponent(
    FormControlErrorMessage,
    mergeProps$1(() => context.dataset(), props)
  );
}
function CheckboxIndicator(props) {
  const formControlContext = useFormControlContext();
  const context = useCheckboxContext();
  const [ref, setRef] = createSignal();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("indicator"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["ref", "forceMount"]);
  const { present } = src_default({
    show: () =>
      local.forceMount || context.indeterminate() || context.checked(),
    element: () => ref() ?? null,
  });
  return createComponent(Show, {
    get when() {
      return present();
    },
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "div",
            ref(r$) {
              const _ref$ = mergeRefs(setRef, local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
          },
          () => formControlContext.dataset(),
          () => context.dataset(),
          others
        )
      );
    },
  });
}
function CheckboxInput(props) {
  let ref;
  const formControlContext = useFormControlContext();
  const context = useCheckboxContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );
  const [local, formControlFieldProps, others] = splitProps(
    mergedProps,
    ["ref", "style", "onChange", "onFocus", "onBlur"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );
  const { fieldProps } = createFormControlField(formControlFieldProps);
  const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);
  const onChange = (e) => {
    callHandler(e, local.onChange);
    e.stopPropagation();
    if (!isInternalChangeEvent()) {
      const target = e.target;
      context.setIsChecked(target.checked);
      target.checked = context.checked();
    }
    setIsInternalChangeEvent(false);
  };
  const onFocus = (e) => {
    callHandler(e, local.onFocus);
    context.setIsFocused(true);
  };
  const onBlur = (e) => {
    callHandler(e, local.onBlur);
    context.setIsFocused(false);
  };
  createEffect(
    on(
      [() => context.checked(), () => context.value()],
      () => {
        setIsInternalChangeEvent(true);
        ref?.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true,
          })
        );
        ref?.dispatchEvent(
          new Event("change", {
            bubbles: true,
            cancelable: true,
          })
        );
      },
      {
        defer: true,
      }
    )
  );
  createEffect(
    on(
      [() => ref, () => context.indeterminate(), () => context.checked()],
      ([ref2, indeterminate]) => {
        if (ref2) {
          ref2.indeterminate = indeterminate;
        }
      }
    )
  );
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "input",
        ref(r$) {
          const _ref$ = mergeRefs((el) => {
            context.setInputRef(el);
            ref = el;
          }, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        type: "checkbox",
        get id() {
          return fieldProps.id();
        },
        get name() {
          return formControlContext.name();
        },
        get value() {
          return context.value();
        },
        get checked() {
          return context.checked();
        },
        get required() {
          return formControlContext.isRequired();
        },
        get disabled() {
          return formControlContext.isDisabled();
        },
        get readonly() {
          return formControlContext.isReadOnly();
        },
        get style() {
          return {
            ...visuallyHiddenStyles,
            ...local.style,
          };
        },
        get ["aria-label"]() {
          return fieldProps.ariaLabel();
        },
        get ["aria-labelledby"]() {
          return fieldProps.ariaLabelledBy();
        },
        get ["aria-describedby"]() {
          return fieldProps.ariaDescribedBy();
        },
        get ["aria-invalid"]() {
          return formControlContext.validationState() === "invalid" || void 0;
        },
        get ["aria-required"]() {
          return formControlContext.isRequired();
        },
        get ["aria-disabled"]() {
          return formControlContext.isDisabled();
        },
        get ["aria-readonly"]() {
          return formControlContext.isReadOnly();
        },
        onChange,
        onFocus,
        onBlur,
      },
      () => formControlContext.dataset(),
      () => context.dataset(),
      others
    )
  );
}
function CheckboxLabel(props) {
  const context = useCheckboxContext();
  return createComponent(
    FormControlLabel,
    mergeProps$1(() => context.dataset(), props)
  );
}
function CheckboxRoot(props) {
  let ref;
  const defaultId = `checkbox-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      value: "on",
      id: defaultId,
    },
    props
  );
  const [local, formControlProps, others] = splitProps(
    mergedProps,
    [
      "ref",
      "children",
      "value",
      "checked",
      "defaultChecked",
      "indeterminate",
      "onChange",
      "onPointerDown",
    ],
    FORM_CONTROL_PROP_NAMES
  );
  const [inputRef, setInputRef] = createSignal();
  const [isFocused, setIsFocused] = createSignal(false);
  const { formControlContext } = createFormControl(formControlProps);
  const state = createToggleState({
    isSelected: () => local.checked,
    defaultIsSelected: () => local.defaultChecked,
    onSelectedChange: (selected) => local.onChange?.(selected),
    isDisabled: () => formControlContext.isDisabled(),
    isReadOnly: () => formControlContext.isReadOnly(),
  });
  createFormResetListener(
    () => ref,
    () => state.setIsSelected(local.defaultChecked ?? false)
  );
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    if (isFocused()) {
      e.preventDefault();
    }
  };
  const dataset = createMemo(() => ({
    "data-checked": state.isSelected() ? "" : void 0,
    "data-indeterminate": local.indeterminate ? "" : void 0,
  }));
  const context = {
    value: () => local.value,
    dataset,
    checked: () => state.isSelected(),
    indeterminate: () => local.indeterminate ?? false,
    inputRef,
    generateId: createGenerateId(() => access$1(formControlProps.id)),
    toggle: () => state.toggle(),
    setIsChecked: (isChecked) => state.setIsSelected(isChecked),
    setIsFocused,
    setInputRef,
  };
  return createComponent(FormControlContext.Provider, {
    value: formControlContext,
    get children() {
      return createComponent(CheckboxContext.Provider, {
        value: context,
        get children() {
          return createComponent(
            Polymorphic,
            mergeProps$1(
              {
                as: "div",
                ref(r$) {
                  const _ref$ = mergeRefs((el) => (ref = el), local.ref);
                  typeof _ref$ === "function" && _ref$(r$);
                },
                role: "group",
                get id() {
                  return access$1(formControlProps.id);
                },
                onPointerDown,
              },
              () => formControlContext.dataset(),
              dataset,
              others,
              {
                get children() {
                  return createComponent(CheckboxRootChild, {
                    state: context,
                    get children() {
                      return local.children;
                    },
                  });
                },
              }
            )
          );
        },
      });
    },
  });
}
function CheckboxRootChild(props) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
  return memo(resolvedChildren);
}

// src/checkbox/index.tsx
var Checkbox$1 = Object.assign(CheckboxRoot, {
  Control: CheckboxControl,
  Description: CheckboxDescription,
  ErrorMessage: CheckboxErrorMessage,
  Indicator: CheckboxIndicator,
  Input: CheckboxInput,
  Label: CheckboxLabel,
});

var _tmpl$$5 = /*#__PURE__*/ template(
  `<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=3.5 stroke-linecap=round stroke-linejoin=round><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M5 12l5 5l10 -10">`
);
function Checkbox(p) {
  return createComponent(Checkbox$1, {
    class: "flex select-none items-center",
    get checked() {
      return p.checked;
    },
    get onChange() {
      return p.onChange;
    },
    get children() {
      return [
        createComponent(Checkbox$1.Control, {
          class:
            "ui-focusable flex h-5 w-5 flex-none cursor-pointer items-center justify-center rounded border border-base-300 bg-base-100 text-base-content",
          tabIndex: 0,
          get children() {
            return createComponent(Checkbox$1.Indicator, {
              class: "",
              get children() {
                return _tmpl$$5();
              },
            });
          },
        }),
        createComponent(Checkbox$1.Label, {
          class: "flex-1 pl-2 text-base-content",
          get children() {
            return p.label;
          },
        }),
      ];
    },
  });
}

var _tmpl$$4 = /*#__PURE__*/ template(
    `<div class="h-full w-full @container"><div class="flex h-full w-full flex-col @[700px]:flex-row"><div class="h-0 w-full flex-1 @[700px]:h-full @[700px]:w-0">`
  ),
  _tmpl$2$2 = /*#__PURE__*/ template(
    `<div class="w-full flex-none @[700px]:h-full @[700px]:w-auto">`
  ),
  _tmpl$3 = /*#__PURE__*/ template(
    `<div class="h-full w-full @container"><div class="@[300px]:ui-space-x h-full w-full @[300px]:flex">`
  ),
  _tmpl$4 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full"><div class="h-full flex-none"></div><div class="h-full w-0 flex-1">`
  ),
  _tmpl$5 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full flex-col"><div class="h-0 w-full flex-1">`
  ),
  _tmpl$6 = /*#__PURE__*/ template(`<div class="w-full flex-none">`),
  _tmpl$7 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full flex-col md:flex-row"><div class="h-0 w-full flex-1 md:h-full md:w-0">`
  ),
  _tmpl$8 = /*#__PURE__*/ template(
    `<div class="w-full flex-none md:h-full md:w-auto">`
  ),
  _tmpl$9 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full flex-col lg:flex-row"><div class="h-0 w-full flex-1 lg:h-full lg:w-0">`
  ),
  _tmpl$10 = /*#__PURE__*/ template(
    `<div class="w-full flex-none lg:h-full lg:w-auto">`
  ),
  _tmpl$11 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full flex-col xl:flex-row"><div class="h-0 w-full flex-1 xl:h-full xl:w-0">`
  ),
  _tmpl$12 = /*#__PURE__*/ template(
    `<div class="w-full flex-none xl:h-full xl:w-auto">`
  ),
  _tmpl$13 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full"><div class="h-full flex-none bg-base-content text-base-300"></div><div class="h-full w-0 flex-1">`
  ),
  _tmpl$14 = /*#__PURE__*/ template(`<div>`),
  _tmpl$15 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full"><div class="h-full flex-none space-y-3 bg-base-200 p-3 text-base-content-lighter"></div><div class="h-full w-0 flex-1">`
  ),
  _tmpl$16 = /*#__PURE__*/ template(
    `<div class="flex h-full w-full flex-col"><div class="flex w-full flex-none bg-base-content-lighter text-base-300"><div class=flex-1></div></div><div class="h-0 w-full flex-1">`
  );
function ContainerFrameSideOrTop_700px(p) {
  const paneChildren = children(() => p.panelChildren);
  const mainChildren = children(() => p.children);
  return (() => {
    var _el$ = _tmpl$$4(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild;
    insert(
      _el$2,
      createComponent(Show, {
        get when() {
          return paneChildren();
        },
        keyed: true,
        children: (panel) => {
          return (() => {
            var _el$4 = _tmpl$2$2();
            insert(_el$4, panel);
            return _el$4;
          })();
        },
      }),
      _el$3
    );
    insert(_el$3, mainChildren);
    return _el$;
  })();
}
function ContainerHorizontalVertival_300px(p) {
  return (() => {
    var _el$5 = _tmpl$3(),
      _el$6 = _el$5.firstChild;
    insert(_el$6, () => p.children);
    return _el$5;
  })();
}
function FrameSide(p) {
  return (() => {
    var _el$7 = _tmpl$4(),
      _el$8 = _el$7.firstChild,
      _el$9 = _el$8.nextSibling;
    insert(_el$8, () => p.panelChildren);
    insert(_el$9, () => p.children);
    return _el$7;
  })();
}
function FrameTop(p) {
  const paneChildren = children(() => p.panelChildren);
  const mainChildren = children(() => p.children);
  return (() => {
    var _el$10 = _tmpl$5(),
      _el$11 = _el$10.firstChild;
    insert(
      _el$10,
      createComponent(Show, {
        get when() {
          return paneChildren();
        },
        keyed: true,
        children: (panel) => {
          return (() => {
            var _el$12 = _tmpl$6();
            insert(_el$12, panel);
            return _el$12;
          })();
        },
      }),
      _el$11
    );
    insert(_el$11, mainChildren);
    return _el$10;
  })();
}
function FrameSideOrTop_Md(p) {
  const paneChildren = children(() => p.panelChildren);
  const mainChildren = children(() => p.children);
  return (() => {
    var _el$13 = _tmpl$7(),
      _el$14 = _el$13.firstChild;
    insert(
      _el$13,
      createComponent(Show, {
        get when() {
          return paneChildren();
        },
        keyed: true,
        children: (panel) => {
          return (() => {
            var _el$15 = _tmpl$8();
            insert(_el$15, panel);
            return _el$15;
          })();
        },
      }),
      _el$14
    );
    insert(_el$14, mainChildren);
    return _el$13;
  })();
}
function FrameSideOrTop_Lg(p) {
  return (() => {
    var _el$16 = _tmpl$9(),
      _el$17 = _el$16.firstChild;
    insert(
      _el$16,
      createComponent(Show, {
        get when() {
          return p.panelChildren;
        },
        keyed: true,
        children: (panel) => {
          return (() => {
            var _el$18 = _tmpl$10();
            insert(_el$18, panel);
            return _el$18;
          })();
        },
      }),
      _el$17
    );
    insert(_el$17, () => p.children);
    return _el$16;
  })();
}
function FrameSideOrTop_Xl(p) {
  return (() => {
    var _el$19 = _tmpl$11(),
      _el$20 = _el$19.firstChild;
    insert(
      _el$19,
      createComponent(Show, {
        get when() {
          return p.panelChildren;
        },
        keyed: true,
        children: (panel) => {
          return (() => {
            var _el$21 = _tmpl$12();
            insert(_el$21, panel);
            return _el$21;
          })();
        },
      }),
      _el$20
    );
    insert(_el$20, () => p.children);
    return _el$19;
  })();
}
function FrameSideMenu(p) {
  return (() => {
    var _el$22 = _tmpl$13(),
      _el$23 = _el$22.firstChild,
      _el$24 = _el$23.nextSibling;
    insert(
      _el$23,
      createComponent(For, {
        get each() {
          return p.tabs;
        },
        children: (tab) => {
          return (() => {
            var _el$25 = _tmpl$14();
            _el$25.$$click = () => p.setter(tab.id);
            insert(_el$25, () => tab.label);
            effect(() =>
              className(
                _el$25,
                `cursor-pointer select-none p-3 ${
                  p.selected === tab.id
                    ? "bg-base-content-focus text-base-100 underline"
                    : "ui-hoverable"
                }`
              )
            );
            return _el$25;
          })();
        },
      })
    );
    insert(_el$24, () => p.children);
    return _el$22;
  })();
}
function FrameSideMenuSecondary(p) {
  return (() => {
    var _el$26 = _tmpl$15(),
      _el$27 = _el$26.firstChild,
      _el$28 = _el$27.nextSibling;
    insert(
      _el$27,
      createComponent(For, {
        get each() {
          return p.tabs;
        },
        children: (tab) => {
          return (() => {
            var _el$29 = _tmpl$14();
            _el$29.$$click = () => p.setter(tab.id);
            insert(_el$29, () => tab.label);
            effect(() =>
              className(
                _el$29,
                `cursor-pointer select-none rounded-full px-3 py-1.5 ${
                  p.selected === tab.id
                    ? "bg-base-300 text-base-content"
                    : "ui-hoverable"
                }`
              )
            );
            return _el$29;
          })();
        },
      })
    );
    insert(_el$28, () => p.children);
    return _el$26;
  })();
}
function FrameTopMenu(p) {
  return (() => {
    var _el$30 = _tmpl$16(),
      _el$31 = _el$30.firstChild,
      _el$32 = _el$31.firstChild,
      _el$33 = _el$31.nextSibling;
    insert(
      _el$31,
      createComponent(For, {
        get each() {
          return p.tabs;
        },
        children: (tab) => {
          return (() => {
            var _el$34 = _tmpl$14();
            _el$34.$$click = () => p.setter(tab.id);
            insert(_el$34, () => tab.label);
            effect(() =>
              className(
                _el$34,
                `cursor-pointer select-none p-3 ${
                  p.selected === tab.id
                    ? "bg-base-content-lighter-focus text-base-100 underline"
                    : "ui-hoverable"
                }`
              )
            );
            return _el$34;
          })();
        },
      }),
      _el$32
    );
    insert(
      _el$31,
      createComponent(For, {
        get each() {
          return p.sideTabs;
        },
        children: (sideTab) => {
          return (() => {
            var _el$35 = _tmpl$14();
            _el$35.$$click = () => p.setter(sideTab.id);
            insert(_el$35, () => sideTab.label);
            effect(() =>
              className(
                _el$35,
                `cursor-pointer select-none p-3 ${
                  p.selected === sideTab.id
                    ? "bg-base-content-lighter-focus text-base-100 underline"
                    : "ui-hoverable"
                }`
              )
            );
            return _el$35;
          })();
        },
      }),
      null
    );
    insert(_el$33, () => p.children);
    return _el$30;
  })();
}
delegateEvents(["click"]);

// src/primitives/create-collection/create-collection.ts
function buildNodes(params) {
  let index = params.startIndex ?? 0;
  const level = params.startLevel ?? 0;
  const nodes = [];
  const getKey = (data) => {
    if (data == null) {
      return "";
    }
    const _getKey = params.getKey ?? "key";
    const dataKey = isString(_getKey) ? data[_getKey] : _getKey(data);
    return dataKey != null ? String(dataKey) : "";
  };
  const getTextValue = (data) => {
    if (data == null) {
      return "";
    }
    const _getTextValue = params.getTextValue ?? "textValue";
    const dataTextValue = isString(_getTextValue)
      ? data[_getTextValue]
      : _getTextValue(data);
    return dataTextValue != null ? String(dataTextValue) : "";
  };
  const getDisabled = (data) => {
    if (data == null) {
      return false;
    }
    const _getDisabled = params.getDisabled ?? "disabled";
    return (
      (isString(_getDisabled) ? data[_getDisabled] : _getDisabled(data)) ??
      false
    );
  };
  const getSectionChildren = (data) => {
    if (data == null) {
      return void 0;
    }
    if (isString(params.getSectionChildren)) {
      return data[params.getSectionChildren];
    }
    return params.getSectionChildren?.(data);
  };
  for (const data of params.dataSource) {
    if (isString(data) || isNumber(data)) {
      nodes.push({
        type: "item",
        rawValue: data,
        key: String(data),
        textValue: String(data),
        disabled: getDisabled(data),
        level,
        index,
      });
      index++;
      continue;
    }
    if (getSectionChildren(data) != null) {
      nodes.push({
        type: "section",
        rawValue: data,
        key: "",
        // not applicable here
        textValue: "",
        // not applicable here
        disabled: false,
        // not applicable here
        level,
        index,
      });
      index++;
      const sectionChildren = getSectionChildren(data) ?? [];
      if (sectionChildren.length > 0) {
        const childNodes = buildNodes({
          dataSource: sectionChildren,
          getKey: params.getKey,
          getTextValue: params.getTextValue,
          getDisabled: params.getDisabled,
          getSectionChildren: params.getSectionChildren,
          startIndex: index,
          startLevel: level + 1,
        });
        nodes.push(...childNodes);
        index += childNodes.length;
      }
    } else {
      nodes.push({
        type: "item",
        rawValue: data,
        key: getKey(data),
        textValue: getTextValue(data),
        disabled: getDisabled(data),
        level,
        index,
      });
      index++;
    }
  }
  return nodes;
}

// src/primitives/create-collection/create-collection.ts
function createCollection(props, deps = []) {
  return createMemo(() => {
    const nodes = buildNodes({
      dataSource: access$1(props.dataSource),
      getKey: access$1(props.getKey),
      getTextValue: access$1(props.getTextValue),
      getDisabled: access$1(props.getDisabled),
      getSectionChildren: access$1(props.getSectionChildren),
    });
    for (let i = 0; i < deps.length; i++) deps[i]();
    return props.factory(nodes);
  });
}

/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */ let $488c6ddbf4ef74c2$var$formatterCache = new Map();
let $488c6ddbf4ef74c2$var$supportsSignDisplay = false;
try {
  // @ts-ignore
  $488c6ddbf4ef74c2$var$supportsSignDisplay =
    new Intl.NumberFormat("de-DE", {
      signDisplay: "exceptZero",
    }).resolvedOptions().signDisplay === "exceptZero";
  // eslint-disable-next-line no-empty
} catch (e) {}
let $488c6ddbf4ef74c2$var$supportsUnit = false;
try {
  // @ts-ignore
  $488c6ddbf4ef74c2$var$supportsUnit =
    new Intl.NumberFormat("de-DE", {
      style: "unit",
      unit: "degree",
    }).resolvedOptions().style === "unit";
  // eslint-disable-next-line no-empty
} catch (e) {}
// Polyfill for units since Safari doesn't support them yet. See https://bugs.webkit.org/show_bug.cgi?id=215438.
// Currently only polyfilling the unit degree in narrow format for ColorSlider in our supported locales.
// Values were determined by switching to each locale manually in Chrome.
const $488c6ddbf4ef74c2$var$UNITS = {
  degree: {
    narrow: {
      default: "\xb0",
      "ja-JP": " \u5EA6",
      "zh-TW": "\u5EA6",
      "sl-SI": " \xb0",
    },
  },
};
class $488c6ddbf4ef74c2$export$cc77c4ff7e8673c5 {
  /** Formats a number value as a string, according to the locale and options provided to the constructor. */ format(
    value
  ) {
    let res = "";
    if (
      !$488c6ddbf4ef74c2$var$supportsSignDisplay &&
      this.options.signDisplay != null
    )
      res = $488c6ddbf4ef74c2$export$711b50b3c525e0f2(
        this.numberFormatter,
        this.options.signDisplay,
        value
      );
    else res = this.numberFormatter.format(value);
    if (this.options.style === "unit" && !$488c6ddbf4ef74c2$var$supportsUnit) {
      var _UNITS_unit;
      let {
        unit: unit,
        unitDisplay: unitDisplay = "short",
        locale: locale,
      } = this.resolvedOptions();
      if (!unit) return res;
      let values =
        (_UNITS_unit = $488c6ddbf4ef74c2$var$UNITS[unit]) === null ||
        _UNITS_unit === void 0
          ? void 0
          : _UNITS_unit[unitDisplay];
      res += values[locale] || values.default;
    }
    return res;
  }
  /** Formats a number to an array of parts such as separators, digits, punctuation, and more. */ formatToParts(
    value
  ) {
    // TODO: implement signDisplay for formatToParts
    // @ts-ignore
    return this.numberFormatter.formatToParts(value);
  }
  /** Formats a number range as a string. */ formatRange(start, end) {
    // @ts-ignore
    if (typeof this.numberFormatter.formatRange === "function")
      // @ts-ignore
      return this.numberFormatter.formatRange(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    // Very basic fallback for old browsers.
    return `${this.format(start)} \u{2013} ${this.format(end)}`;
  }
  /** Formats a number range as an array of parts. */ formatRangeToParts(
    start,
    end
  ) {
    // @ts-ignore
    if (typeof this.numberFormatter.formatRangeToParts === "function")
      // @ts-ignore
      return this.numberFormatter.formatRangeToParts(start, end);
    if (end < start) throw new RangeError("End date must be >= start date");
    let startParts = this.numberFormatter.formatToParts(start);
    let endParts = this.numberFormatter.formatToParts(end);
    return [
      ...startParts.map((p) => ({
        ...p,
        source: "startRange",
      })),
      {
        type: "literal",
        value: " \u2013 ",
        source: "shared",
      },
      ...endParts.map((p) => ({
        ...p,
        source: "endRange",
      })),
    ];
  }
  /** Returns the resolved formatting options based on the values passed to the constructor. */ resolvedOptions() {
    let options = this.numberFormatter.resolvedOptions();
    if (
      !$488c6ddbf4ef74c2$var$supportsSignDisplay &&
      this.options.signDisplay != null
    )
      options = {
        ...options,
        signDisplay: this.options.signDisplay,
      };
    if (!$488c6ddbf4ef74c2$var$supportsUnit && this.options.style === "unit")
      options = {
        ...options,
        style: "unit",
        unit: this.options.unit,
        unitDisplay: this.options.unitDisplay,
      };
    return options;
  }
  constructor(locale, options = {}) {
    this.numberFormatter = $488c6ddbf4ef74c2$var$getCachedNumberFormatter(
      locale,
      options
    );
    this.options = options;
  }
}
function $488c6ddbf4ef74c2$var$getCachedNumberFormatter(locale, options = {}) {
  let { numberingSystem: numberingSystem } = options;
  if (numberingSystem && locale.includes("-nu-")) {
    if (!locale.includes("-u-")) locale += "-u-";
    locale += `-nu-${numberingSystem}`;
  }
  if (options.style === "unit" && !$488c6ddbf4ef74c2$var$supportsUnit) {
    var _UNITS_unit;
    let { unit: unit, unitDisplay: unitDisplay = "short" } = options;
    if (!unit)
      throw new Error('unit option must be provided with style: "unit"');
    if (
      !((_UNITS_unit = $488c6ddbf4ef74c2$var$UNITS[unit]) === null ||
      _UNITS_unit === void 0
        ? void 0
        : _UNITS_unit[unitDisplay])
    )
      throw new Error(
        `Unsupported unit ${unit} with unitDisplay = ${unitDisplay}`
      );
    options = {
      ...options,
      style: "decimal",
    };
  }
  let cacheKey =
    locale +
    (options
      ? Object.entries(options)
          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
          .join()
      : "");
  if ($488c6ddbf4ef74c2$var$formatterCache.has(cacheKey))
    return $488c6ddbf4ef74c2$var$formatterCache.get(cacheKey);
  let numberFormatter = new Intl.NumberFormat(locale, options);
  $488c6ddbf4ef74c2$var$formatterCache.set(cacheKey, numberFormatter);
  return numberFormatter;
}
function $488c6ddbf4ef74c2$export$711b50b3c525e0f2(
  numberFormat,
  signDisplay,
  num
) {
  if (signDisplay === "auto") return numberFormat.format(num);
  else if (signDisplay === "never") return numberFormat.format(Math.abs(num));
  else {
    let needsPositiveSign = false;
    if (signDisplay === "always")
      needsPositiveSign = num > 0 || Object.is(num, 0);
    else if (signDisplay === "exceptZero") {
      if (Object.is(num, -0) || Object.is(num, 0)) num = Math.abs(num);
      else needsPositiveSign = num > 0;
    }
    if (needsPositiveSign) {
      let negative = numberFormat.format(-num);
      let noSign = numberFormat.format(num);
      // ignore RTL/LTR marker character
      let minus = negative.replace(noSign, "").replace(/\u200e|\u061C/, "");
      if ([...minus].length !== 1)
        console.warn(
          "@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case"
        );
      let positive = negative
        .replace(noSign, "!!!")
        .replace(minus, "+")
        .replace("!!!", noSign);
      return positive;
    } else return numberFormat.format(num);
  }
}

// src/i18n/create-collator.ts

// src/i18n/utils.ts
var RTL_SCRIPTS = /* @__PURE__ */ new Set([
  "Avst",
  "Arab",
  "Armi",
  "Syrc",
  "Samr",
  "Mand",
  "Thaa",
  "Mend",
  "Nkoo",
  "Adlm",
  "Rohg",
  "Hebr",
]);
var RTL_LANGS = /* @__PURE__ */ new Set([
  "ae",
  "ar",
  "arc",
  "bcc",
  "bqi",
  "ckb",
  "dv",
  "fa",
  "glk",
  "he",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "ug",
  "ur",
  "yi",
]);
function isRTL$1(locale) {
  if (Intl.Locale) {
    const script = new Intl.Locale(locale).maximize().script ?? "";
    return RTL_SCRIPTS.has(script);
  }
  const lang = locale.split("-")[0];
  return RTL_LANGS.has(lang);
}
function getReadingDirection(locale) {
  return isRTL$1(locale) ? "rtl" : "ltr";
}

// src/i18n/create-default-locale.ts
function getDefaultLocale() {
  let locale =
    (typeof navigator !== "undefined" &&
      // @ts-ignore
      (navigator.language || navigator.userLanguage)) ||
    "en-US";
  return {
    locale,
    direction: getReadingDirection(locale),
  };
}
var currentLocale = getDefaultLocale();
var listeners = /* @__PURE__ */ new Set();
function updateLocale() {
  currentLocale = getDefaultLocale();
  for (const listener of listeners) {
    listener(currentLocale);
  }
}
function createDefaultLocale() {
  const defaultSSRLocale = {
    locale: "en-US",
    direction: "ltr",
  };
  const [defaultClientLocale, setDefaultClientLocale] =
    createSignal(currentLocale);
  const defaultLocale = createMemo(() =>
    isServer ? defaultSSRLocale : defaultClientLocale()
  );
  onMount(() => {
    if (listeners.size === 0) {
      window.addEventListener("languagechange", updateLocale);
    }
    listeners.add(setDefaultClientLocale);
    onCleanup(() => {
      listeners.delete(setDefaultClientLocale);
      if (listeners.size === 0) {
        window.removeEventListener("languagechange", updateLocale);
      }
    });
  });
  return {
    locale: () => defaultLocale().locale,
    direction: () => defaultLocale().direction,
  };
}

// src/i18n/i18n-provider.tsx
var I18nContext = createContext();
function useLocale() {
  const defaultLocale = createDefaultLocale();
  const context = useContext(I18nContext);
  return context || defaultLocale;
}

// src/i18n/create-collator.ts
var cache$1 = /* @__PURE__ */ new Map();
function createCollator(options) {
  const { locale } = useLocale();
  const cacheKey = createMemo(() => {
    return (
      locale() +
      (options
        ? Object.entries(options)
            .sort((a, b) => (a[0] < b[0] ? -1 : 1))
            .join()
        : "")
    );
  });
  return createMemo(() => {
    const key = cacheKey();
    let collator;
    if (cache$1.has(key)) {
      collator = cache$1.get(key);
    }
    if (!collator) {
      collator = new Intl.Collator(locale(), options);
      cache$1.set(key, collator);
    }
    return collator;
  });
}
function createNumberFormatter(options) {
  const { locale } = useLocale();
  return createMemo(
    () =>
      new $488c6ddbf4ef74c2$export$cc77c4ff7e8673c5(locale(), access$1(options))
  );
}

// src/selection/types.ts
var Selection = class _Selection extends Set {
  anchorKey;
  currentKey;
  constructor(keys, anchorKey, currentKey) {
    super(keys);
    if (keys instanceof _Selection) {
      this.anchorKey = anchorKey || keys.anchorKey;
      this.currentKey = currentKey || keys.currentKey;
    } else {
      this.anchorKey = anchorKey;
      this.currentKey = currentKey;
    }
  }
};

// src/selection/create-controllable-selection-signal.ts
function createControllableSelectionSignal(props) {
  const [_value, setValue] = createControllableSignal(props);
  const value = () => _value() ?? new Selection();
  return [value, setValue];
}
function isNonContiguousSelectionModifier(e) {
  return isAppleDevice() ? e.altKey : e.ctrlKey;
}
function isCtrlKeyPressed(e) {
  if (isMac()) {
    return e.metaKey;
  }
  return e.ctrlKey;
}
function convertSelection(selection) {
  return new Selection(selection);
}
function isSameSelection(setA, setB) {
  if (setA.size !== setB.size) {
    return false;
  }
  for (const item of setA) {
    if (!setB.has(item)) {
      return false;
    }
  }
  return true;
}

// src/selection/create-multiple-selection-state.ts
function createMultipleSelectionState(props) {
  const mergedProps = mergeDefaultProps(
    {
      selectionMode: "none",
      selectionBehavior: "toggle",
    },
    props
  );
  const [isFocused, setFocused] = createSignal(false);
  const [focusedKey, setFocusedKey] = createSignal();
  const selectedKeysProp = createMemo(() => {
    const selection = access$1(mergedProps.selectedKeys);
    if (selection != null) {
      return convertSelection(selection);
    }
    return selection;
  });
  const defaultSelectedKeys = createMemo(() => {
    const defaultSelection = access$1(mergedProps.defaultSelectedKeys);
    if (defaultSelection != null) {
      return convertSelection(defaultSelection);
    }
    return new Selection();
  });
  const [selectedKeys, _setSelectedKeys] = createControllableSelectionSignal({
    value: selectedKeysProp,
    defaultValue: defaultSelectedKeys,
    onChange: (value) => mergedProps.onSelectionChange?.(value),
  });
  const [selectionBehavior, setSelectionBehavior] = createSignal(
    access$1(mergedProps.selectionBehavior)
  );
  const selectionMode = () => access$1(mergedProps.selectionMode);
  const disallowEmptySelection = () =>
    access$1(mergedProps.disallowEmptySelection) ?? false;
  const setSelectedKeys = (keys) => {
    if (
      access$1(mergedProps.allowDuplicateSelectionEvents) ||
      !isSameSelection(keys, selectedKeys())
    ) {
      _setSelectedKeys(keys);
    }
  };
  createEffect(() => {
    const selection = selectedKeys();
    if (
      access$1(mergedProps.selectionBehavior) === "replace" &&
      selectionBehavior() === "toggle" &&
      typeof selection === "object" &&
      selection.size === 0
    ) {
      setSelectionBehavior("replace");
    }
  });
  createEffect(() => {
    setSelectionBehavior(access$1(mergedProps.selectionBehavior) ?? "toggle");
  });
  return {
    selectionMode,
    disallowEmptySelection,
    selectionBehavior,
    setSelectionBehavior,
    isFocused,
    setFocused,
    focusedKey,
    setFocusedKey,
    selectedKeys,
    setSelectedKeys,
  };
}
function createTypeSelect(props) {
  const [search, setSearch] = createSignal("");
  const [timeoutId, setTimeoutId] = createSignal(-1);
  const onKeyDown = (e) => {
    if (access$1(props.isDisabled)) {
      return;
    }
    const delegate = access$1(props.keyboardDelegate);
    const manager = access$1(props.selectionManager);
    if (!delegate.getKeyForSearch) {
      return;
    }
    const character = getStringForKey(e.key);
    if (!character || e.ctrlKey || e.metaKey) {
      return;
    }
    if (character === " " && search().trim().length > 0) {
      e.preventDefault();
      e.stopPropagation();
    }
    let newSearch = setSearch((prev) => prev + character);
    let key =
      delegate.getKeyForSearch(newSearch, manager.focusedKey()) ??
      delegate.getKeyForSearch(newSearch);
    if (key == null && isAllSameLetter(newSearch)) {
      newSearch = newSearch[0];
      key =
        delegate.getKeyForSearch(newSearch, manager.focusedKey()) ??
        delegate.getKeyForSearch(newSearch);
    }
    if (key != null) {
      manager.setFocusedKey(key);
      props.onTypeSelect?.(key);
    }
    clearTimeout(timeoutId());
    setTimeoutId(window.setTimeout(() => setSearch(""), 500));
  };
  return {
    typeSelectHandlers: {
      onKeyDown,
    },
  };
}
function getStringForKey(key) {
  if (key.length === 1 || !/^[A-Z]/i.test(key)) {
    return key;
  }
  return "";
}
function isAllSameLetter(search) {
  return search.split("").every((letter) => letter === search[0]);
}
function createSelectableCollection(props, ref, scrollRef) {
  const defaultProps = {
    selectOnFocus: () =>
      access$1(props.selectionManager).selectionBehavior() === "replace",
  };
  const mergedProps = mergeProps(defaultProps, props);
  const finalScrollRef = () => scrollRef?.() ?? ref();
  const { direction } = useLocale();
  let scrollPos = {
    top: 0,
    left: 0,
  };
  createEventListener(
    () => (!access$1(mergedProps.isVirtualized) ? finalScrollRef() : void 0),
    "scroll",
    () => {
      const scrollEl = finalScrollRef();
      if (!scrollEl) {
        return;
      }
      scrollPos = {
        top: scrollEl.scrollTop,
        left: scrollEl.scrollLeft,
      };
    }
  );
  const { typeSelectHandlers } = createTypeSelect({
    isDisabled: () => access$1(mergedProps.disallowTypeAhead),
    keyboardDelegate: () => access$1(mergedProps.keyboardDelegate),
    selectionManager: () => access$1(mergedProps.selectionManager),
  });
  const orientation = () => access$1(mergedProps.orientation) ?? "vertical";
  const onKeyDown = (e) => {
    callHandler(e, typeSelectHandlers.onKeyDown);
    if (e.altKey && e.key === "Tab") {
      e.preventDefault();
    }
    const refEl = ref();
    if (!refEl?.contains(e.target)) {
      return;
    }
    const manager = access$1(mergedProps.selectionManager);
    const selectOnFocus = access$1(mergedProps.selectOnFocus);
    const navigateToKey = (key) => {
      if (key != null) {
        manager.setFocusedKey(key);
        if (e.shiftKey && manager.selectionMode() === "multiple") {
          manager.extendSelection(key);
        } else if (selectOnFocus && !isNonContiguousSelectionModifier(e)) {
          manager.replaceSelection(key);
        }
      }
    };
    const delegate = access$1(mergedProps.keyboardDelegate);
    const shouldFocusWrap = access$1(mergedProps.shouldFocusWrap);
    const focusedKey = manager.focusedKey();
    switch (e.key) {
      case orientation() === "vertical" ? "ArrowDown" : "ArrowRight": {
        if (delegate.getKeyBelow) {
          e.preventDefault();
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyBelow(focusedKey);
          } else {
            nextKey = delegate.getFirstKey?.();
          }
          if (nextKey == null && shouldFocusWrap) {
            nextKey = delegate.getFirstKey?.(focusedKey);
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case orientation() === "vertical" ? "ArrowUp" : "ArrowLeft": {
        if (delegate.getKeyAbove) {
          e.preventDefault();
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyAbove(focusedKey);
          } else {
            nextKey = delegate.getLastKey?.();
          }
          if (nextKey == null && shouldFocusWrap) {
            nextKey = delegate.getLastKey?.(focusedKey);
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case orientation() === "vertical" ? "ArrowLeft" : "ArrowUp": {
        if (delegate.getKeyLeftOf) {
          e.preventDefault();
          const isRTL = direction() === "rtl";
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyLeftOf(focusedKey);
          } else {
            nextKey = isRTL
              ? delegate.getFirstKey?.()
              : delegate.getLastKey?.();
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case orientation() === "vertical" ? "ArrowRight" : "ArrowDown": {
        if (delegate.getKeyRightOf) {
          e.preventDefault();
          const isRTL = direction() === "rtl";
          let nextKey;
          if (focusedKey != null) {
            nextKey = delegate.getKeyRightOf(focusedKey);
          } else {
            nextKey = isRTL
              ? delegate.getLastKey?.()
              : delegate.getFirstKey?.();
          }
          navigateToKey(nextKey);
        }
        break;
      }
      case "Home":
        if (delegate.getFirstKey) {
          e.preventDefault();
          const firstKey = delegate.getFirstKey(
            focusedKey,
            isCtrlKeyPressed(e)
          );
          if (firstKey != null) {
            manager.setFocusedKey(firstKey);
            if (
              isCtrlKeyPressed(e) &&
              e.shiftKey &&
              manager.selectionMode() === "multiple"
            ) {
              manager.extendSelection(firstKey);
            } else if (selectOnFocus) {
              manager.replaceSelection(firstKey);
            }
          }
        }
        break;
      case "End":
        if (delegate.getLastKey) {
          e.preventDefault();
          const lastKey = delegate.getLastKey(focusedKey, isCtrlKeyPressed(e));
          if (lastKey != null) {
            manager.setFocusedKey(lastKey);
            if (
              isCtrlKeyPressed(e) &&
              e.shiftKey &&
              manager.selectionMode() === "multiple"
            ) {
              manager.extendSelection(lastKey);
            } else if (selectOnFocus) {
              manager.replaceSelection(lastKey);
            }
          }
        }
        break;
      case "PageDown":
        if (delegate.getKeyPageBelow && focusedKey != null) {
          e.preventDefault();
          const nextKey = delegate.getKeyPageBelow(focusedKey);
          navigateToKey(nextKey);
        }
        break;
      case "PageUp":
        if (delegate.getKeyPageAbove && focusedKey != null) {
          e.preventDefault();
          const nextKey = delegate.getKeyPageAbove(focusedKey);
          navigateToKey(nextKey);
        }
        break;
      case "a":
        if (
          isCtrlKeyPressed(e) &&
          manager.selectionMode() === "multiple" &&
          access$1(mergedProps.disallowSelectAll) !== true
        ) {
          e.preventDefault();
          manager.selectAll();
        }
        break;
      case "Escape":
        if (!e.defaultPrevented) {
          e.preventDefault();
          if (!access$1(mergedProps.disallowEmptySelection)) {
            manager.clearSelection();
          }
        }
        break;
      case "Tab": {
        if (!access$1(mergedProps.allowsTabNavigation)) {
          if (e.shiftKey) {
            refEl.focus();
          } else {
            const walker = getFocusableTreeWalker(refEl, {
              tabbable: true,
            });
            let next;
            let last;
            do {
              last = walker.lastChild();
              if (last) {
                next = last;
              }
            } while (last);
            if (next && !next.contains(document.activeElement)) {
              focusWithoutScrolling(next);
            }
          }
          break;
        }
      }
    }
  };
  const onFocusIn = (e) => {
    const manager = access$1(mergedProps.selectionManager);
    const delegate = access$1(mergedProps.keyboardDelegate);
    const selectOnFocus = access$1(mergedProps.selectOnFocus);
    if (manager.isFocused()) {
      if (!e.currentTarget.contains(e.target)) {
        manager.setFocused(false);
      }
      return;
    }
    if (!e.currentTarget.contains(e.target)) {
      return;
    }
    manager.setFocused(true);
    if (manager.focusedKey() == null) {
      const navigateToFirstKey = (key) => {
        if (key == null) {
          return;
        }
        manager.setFocusedKey(key);
        if (selectOnFocus) {
          manager.replaceSelection(key);
        }
      };
      const relatedTarget = e.relatedTarget;
      if (
        relatedTarget &&
        e.currentTarget.compareDocumentPosition(relatedTarget) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ) {
        navigateToFirstKey(
          manager.lastSelectedKey() ?? delegate.getLastKey?.()
        );
      } else {
        navigateToFirstKey(
          manager.firstSelectedKey() ?? delegate.getFirstKey?.()
        );
      }
    } else if (!access$1(mergedProps.isVirtualized)) {
      const scrollEl = finalScrollRef();
      if (scrollEl) {
        scrollEl.scrollTop = scrollPos.top;
        scrollEl.scrollLeft = scrollPos.left;
        const element = scrollEl.querySelector(
          `[data-key="${manager.focusedKey()}"]`
        );
        if (element) {
          focusWithoutScrolling(element);
          scrollIntoView(scrollEl, element);
        }
      }
    }
  };
  const onFocusOut = (e) => {
    const manager = access$1(mergedProps.selectionManager);
    if (!e.currentTarget.contains(e.relatedTarget)) {
      manager.setFocused(false);
    }
  };
  const onMouseDown = (e) => {
    if (finalScrollRef() === e.target) {
      e.preventDefault();
    }
  };
  const tryAutoFocus = () => {
    const autoFocus = access$1(mergedProps.autoFocus);
    if (!autoFocus) {
      return;
    }
    const manager = access$1(mergedProps.selectionManager);
    const delegate = access$1(mergedProps.keyboardDelegate);
    let focusedKey;
    if (autoFocus === "first") {
      focusedKey = delegate.getFirstKey?.();
    }
    if (autoFocus === "last") {
      focusedKey = delegate.getLastKey?.();
    }
    const selectedKeys = manager.selectedKeys();
    if (selectedKeys.size) {
      focusedKey = selectedKeys.values().next().value;
    }
    manager.setFocused(true);
    manager.setFocusedKey(focusedKey);
    const refEl = ref();
    if (
      refEl &&
      focusedKey == null &&
      !access$1(mergedProps.shouldUseVirtualFocus)
    ) {
      focusWithoutScrolling(refEl);
    }
  };
  onMount(() => {
    if (mergedProps.deferAutoFocus) {
      setTimeout(tryAutoFocus, 0);
    } else {
      tryAutoFocus();
    }
  });
  createEffect(
    on(
      [
        finalScrollRef,
        () => access$1(mergedProps.isVirtualized),
        () => access$1(mergedProps.selectionManager).focusedKey(),
      ],
      (newValue) => {
        const [scrollEl, isVirtualized, focusedKey] = newValue;
        if (isVirtualized) {
          focusedKey && mergedProps.scrollToKey?.(focusedKey);
        } else {
          if (focusedKey && scrollEl) {
            const element = scrollEl.querySelector(
              `[data-key="${focusedKey}"]`
            );
            if (element) {
              scrollIntoView(scrollEl, element);
            }
          }
        }
      }
    )
  );
  const tabIndex = createMemo(() => {
    if (access$1(mergedProps.shouldUseVirtualFocus)) {
      return void 0;
    }
    return access$1(mergedProps.selectionManager).focusedKey() == null ? 0 : -1;
  });
  return {
    tabIndex,
    onKeyDown,
    onMouseDown,
    onFocusIn,
    onFocusOut,
  };
}
function createSelectableItem(props, ref) {
  const manager = () => access$1(props.selectionManager);
  const key = () => access$1(props.key);
  const shouldUseVirtualFocus = () => access$1(props.shouldUseVirtualFocus);
  const onSelect = (e) => {
    if (manager().selectionMode() === "none") {
      return;
    }
    if (manager().selectionMode() === "single") {
      if (manager().isSelected(key()) && !manager().disallowEmptySelection()) {
        manager().toggleSelection(key());
      } else {
        manager().replaceSelection(key());
      }
    } else if (e?.shiftKey) {
      manager().extendSelection(key());
    } else if (
      manager().selectionBehavior() === "toggle" ||
      isCtrlKeyPressed(e) ||
      ("pointerType" in e && e.pointerType === "touch")
    ) {
      manager().toggleSelection(key());
    } else {
      manager().replaceSelection(key());
    }
  };
  const isSelected = () => manager().isSelected(key());
  const isDisabled = () =>
    access$1(props.disabled) || manager().isDisabled(key());
  const allowsSelection = () => !isDisabled() && manager().canSelectItem(key());
  let pointerDownType = null;
  const onPointerDown = (e) => {
    if (!allowsSelection()) {
      return;
    }
    pointerDownType = e.pointerType;
    if (
      e.pointerType === "mouse" &&
      e.button === 0 &&
      !access$1(props.shouldSelectOnPressUp)
    ) {
      onSelect(e);
    }
  };
  const onPointerUp = (e) => {
    if (!allowsSelection()) {
      return;
    }
    if (
      e.pointerType === "mouse" &&
      e.button === 0 &&
      access$1(props.shouldSelectOnPressUp) &&
      access$1(props.allowsDifferentPressOrigin)
    ) {
      onSelect(e);
    }
  };
  const onClick = (e) => {
    if (!allowsSelection()) {
      return;
    }
    if (
      (access$1(props.shouldSelectOnPressUp) &&
        !access$1(props.allowsDifferentPressOrigin)) ||
      pointerDownType !== "mouse"
    ) {
      onSelect(e);
    }
  };
  const onKeyDown = (e) => {
    if (!allowsSelection() || !["Enter", " "].includes(e.key)) {
      return;
    }
    if (isNonContiguousSelectionModifier(e)) {
      manager().toggleSelection(key());
    } else {
      onSelect(e);
    }
  };
  const onMouseDown = (e) => {
    if (isDisabled()) {
      e.preventDefault();
    }
  };
  const onFocus = (e) => {
    const refEl = ref();
    if (shouldUseVirtualFocus() || isDisabled() || !refEl) {
      return;
    }
    if (e.target === refEl) {
      manager().setFocusedKey(key());
    }
  };
  const tabIndex = createMemo(() => {
    if (shouldUseVirtualFocus() || isDisabled()) {
      return void 0;
    }
    return key() === manager().focusedKey() ? 0 : -1;
  });
  const dataKey = createMemo(() => {
    return access$1(props.virtualized) ? void 0 : key();
  });
  createEffect(
    on(
      [
        ref,
        key,
        shouldUseVirtualFocus,
        () => manager().focusedKey(),
        () => manager().isFocused(),
      ],
      ([refEl, key2, shouldUseVirtualFocus2, focusedKey, isFocused]) => {
        if (
          refEl &&
          key2 === focusedKey &&
          isFocused &&
          !shouldUseVirtualFocus2 &&
          document.activeElement !== refEl
        ) {
          if (props.focus) {
            props.focus();
          } else {
            focusWithoutScrolling(refEl);
          }
        }
      }
    )
  );
  return {
    isSelected,
    isDisabled,
    allowsSelection,
    tabIndex,
    dataKey,
    onPointerDown,
    onPointerUp,
    onClick,
    onKeyDown,
    onMouseDown,
    onFocus,
  };
}

// src/selection/selection-manager.ts
var SelectionManager = class {
  collection;
  state;
  constructor(collection, state) {
    this.collection = collection;
    this.state = state;
  }
  /** The type of selection that is allowed in the collection. */
  selectionMode() {
    return this.state.selectionMode();
  }
  /** Whether the collection allows empty selection. */
  disallowEmptySelection() {
    return this.state.disallowEmptySelection();
  }
  /** The selection behavior for the collection. */
  selectionBehavior() {
    return this.state.selectionBehavior();
  }
  /** Sets the selection behavior for the collection. */
  setSelectionBehavior(selectionBehavior) {
    this.state.setSelectionBehavior(selectionBehavior);
  }
  /** Whether the collection is currently focused. */
  isFocused() {
    return this.state.isFocused();
  }
  /** Sets whether the collection is focused. */
  setFocused(isFocused) {
    this.state.setFocused(isFocused);
  }
  /** The current focused key in the collection. */
  focusedKey() {
    return this.state.focusedKey();
  }
  /** Sets the focused key. */
  setFocusedKey(key) {
    if (key == null || this.collection().getItem(key)) {
      this.state.setFocusedKey(key);
    }
  }
  /** The currently selected keys in the collection. */
  selectedKeys() {
    return this.state.selectedKeys();
  }
  /** Returns whether a key is selected. */
  isSelected(key) {
    if (this.state.selectionMode() === "none") {
      return false;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return false;
    }
    return this.state.selectedKeys().has(retrievedKey);
  }
  /** Whether the selection is empty. */
  isEmpty() {
    return this.state.selectedKeys().size === 0;
  }
  /** Whether all items in the collection are selected. */
  isSelectAll() {
    if (this.isEmpty()) {
      return false;
    }
    const selectedKeys = this.state.selectedKeys();
    return this.getAllSelectableKeys().every((k) => selectedKeys.has(k));
  }
  firstSelectedKey() {
    let first;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection().getItem(key);
      const isItemBeforeFirst =
        item?.index != null && first?.index != null && item.index < first.index;
      if (!first || isItemBeforeFirst) {
        first = item;
      }
    }
    return first?.key;
  }
  lastSelectedKey() {
    let last;
    for (const key of this.state.selectedKeys()) {
      const item = this.collection().getItem(key);
      const isItemAfterLast =
        item?.index != null && last?.index != null && item.index > last.index;
      if (!last || isItemAfterLast) {
        last = item;
      }
    }
    return last?.key;
  }
  /** Extends the selection to the given key. */
  extendSelection(toKey) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single") {
      this.replaceSelection(toKey);
      return;
    }
    const retrievedToKey = this.getKey(toKey);
    if (retrievedToKey == null) {
      return;
    }
    const selectedKeys = this.state.selectedKeys();
    const anchorKey = selectedKeys.anchorKey || retrievedToKey;
    const selection = new Selection(selectedKeys, anchorKey, retrievedToKey);
    for (const key of this.getKeyRange(
      anchorKey,
      selectedKeys.currentKey || retrievedToKey
    )) {
      selection.delete(key);
    }
    for (const key of this.getKeyRange(retrievedToKey, anchorKey)) {
      if (this.canSelectItem(key)) {
        selection.add(key);
      }
    }
    this.state.setSelectedKeys(selection);
  }
  getKeyRange(from, to) {
    const fromItem = this.collection().getItem(from);
    const toItem = this.collection().getItem(to);
    if (fromItem && toItem) {
      if (
        fromItem.index != null &&
        toItem.index != null &&
        fromItem.index <= toItem.index
      ) {
        return this.getKeyRangeInternal(from, to);
      }
      return this.getKeyRangeInternal(to, from);
    }
    return [];
  }
  getKeyRangeInternal(from, to) {
    const keys = [];
    let key = from;
    while (key != null) {
      const item = this.collection().getItem(key);
      if (item && item.type === "item") {
        keys.push(key);
      }
      if (key === to) {
        return keys;
      }
      key = this.collection().getKeyAfter(key);
    }
    return [];
  }
  getKey(key) {
    const item = this.collection().getItem(key);
    if (!item) {
      return key;
    }
    if (!item || item.type !== "item") {
      return null;
    }
    return item.key;
  }
  /** Toggles whether the given key is selected. */
  toggleSelection(key) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single" && !this.isSelected(key)) {
      this.replaceSelection(key);
      return;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return;
    }
    const keys = new Selection(this.state.selectedKeys());
    if (keys.has(retrievedKey)) {
      keys.delete(retrievedKey);
    } else if (this.canSelectItem(retrievedKey)) {
      keys.add(retrievedKey);
      keys.anchorKey = retrievedKey;
      keys.currentKey = retrievedKey;
    }
    if (this.disallowEmptySelection() && keys.size === 0) {
      return;
    }
    this.state.setSelectedKeys(keys);
  }
  /** Replaces the selection with only the given key. */
  replaceSelection(key) {
    if (this.selectionMode() === "none") {
      return;
    }
    const retrievedKey = this.getKey(key);
    if (retrievedKey == null) {
      return;
    }
    const selection = this.canSelectItem(retrievedKey)
      ? new Selection([retrievedKey], retrievedKey, retrievedKey)
      : new Selection();
    this.state.setSelectedKeys(selection);
  }
  /** Replaces the selection with the given keys. */
  setSelectedKeys(keys) {
    if (this.selectionMode() === "none") {
      return;
    }
    const selection = new Selection();
    for (const key of keys) {
      const retrievedKey = this.getKey(key);
      if (retrievedKey != null) {
        selection.add(retrievedKey);
        if (this.selectionMode() === "single") {
          break;
        }
      }
    }
    this.state.setSelectedKeys(selection);
  }
  /** Selects all items in the collection. */
  selectAll() {
    if (this.selectionMode() === "multiple") {
      this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()));
    }
  }
  /**
   * Removes all keys from the selection.
   */
  clearSelection() {
    const selectedKeys = this.state.selectedKeys();
    if (!this.disallowEmptySelection() && selectedKeys.size > 0) {
      this.state.setSelectedKeys(new Selection());
    }
  }
  /**
   * Toggles between select all and an empty selection.
   */
  toggleSelectAll() {
    if (this.isSelectAll()) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }
  select(key, e) {
    if (this.selectionMode() === "none") {
      return;
    }
    if (this.selectionMode() === "single") {
      if (this.isSelected(key) && !this.disallowEmptySelection()) {
        this.toggleSelection(key);
      } else {
        this.replaceSelection(key);
      }
    } else if (
      this.selectionBehavior() === "toggle" ||
      (e && e.pointerType === "touch")
    ) {
      this.toggleSelection(key);
    } else {
      this.replaceSelection(key);
    }
  }
  /** Returns whether the current selection is equal to the given selection. */
  isSelectionEqual(selection) {
    if (selection === this.state.selectedKeys()) {
      return true;
    }
    const selectedKeys = this.selectedKeys();
    if (selection.size !== selectedKeys.size) {
      return false;
    }
    for (const key of selection) {
      if (!selectedKeys.has(key)) {
        return false;
      }
    }
    for (const key of selectedKeys) {
      if (!selection.has(key)) {
        return false;
      }
    }
    return true;
  }
  canSelectItem(key) {
    if (this.state.selectionMode() === "none") {
      return false;
    }
    const item = this.collection().getItem(key);
    return item != null && !item.disabled;
  }
  isDisabled(key) {
    const item = this.collection().getItem(key);
    return !item || item.disabled;
  }
  getAllSelectableKeys() {
    const keys = [];
    const addKeys = (key) => {
      while (key != null) {
        if (this.canSelectItem(key)) {
          const item = this.collection().getItem(key);
          if (!item) {
            continue;
          }
          if (item.type === "item") {
            keys.push(key);
          }
        }
        key = this.collection().getKeyAfter(key);
      }
    };
    addKeys(this.collection().getFirstKey());
    return keys;
  }
};

// src/list/list-collection.ts
var ListCollection = class {
  keyMap = /* @__PURE__ */ new Map();
  iterable;
  firstKey;
  lastKey;
  constructor(nodes) {
    this.iterable = nodes;
    for (const node of nodes) {
      this.keyMap.set(node.key, node);
    }
    if (this.keyMap.size === 0) {
      return;
    }
    let last;
    let index = 0;
    for (const [key, node] of this.keyMap) {
      if (last) {
        last.nextKey = key;
        node.prevKey = last.key;
      } else {
        this.firstKey = key;
        node.prevKey = void 0;
      }
      if (node.type === "item") {
        node.index = index++;
      }
      last = node;
      last.nextKey = void 0;
    }
    this.lastKey = last.key;
  }
  *[Symbol.iterator]() {
    yield* this.iterable;
  }
  getSize() {
    return this.keyMap.size;
  }
  getKeys() {
    return this.keyMap.keys();
  }
  getKeyBefore(key) {
    return this.keyMap.get(key)?.prevKey;
  }
  getKeyAfter(key) {
    return this.keyMap.get(key)?.nextKey;
  }
  getFirstKey() {
    return this.firstKey;
  }
  getLastKey() {
    return this.lastKey;
  }
  getItem(key) {
    return this.keyMap.get(key);
  }
  at(idx) {
    const keys = [...this.getKeys()];
    return this.getItem(keys[idx]);
  }
};
function createListState(props) {
  const selectionState = createMultipleSelectionState(props);
  const factory = (nodes) => {
    return props.filter
      ? new ListCollection(props.filter(nodes))
      : new ListCollection(nodes);
  };
  const collection = createCollection(
    {
      dataSource: () => access$1(props.dataSource),
      getKey: () => access$1(props.getKey),
      getTextValue: () => access$1(props.getTextValue),
      getDisabled: () => access$1(props.getDisabled),
      getSectionChildren: () => access$1(props.getSectionChildren),
      factory,
    },
    [() => props.filter]
  );
  const selectionManager = new SelectionManager(collection, selectionState);
  createComputed(() => {
    const focusedKey = selectionState.focusedKey();
    if (focusedKey != null && !collection().getItem(focusedKey)) {
      selectionState.setFocusedKey(void 0);
    }
  });
  return {
    collection,
    selectionManager: () => selectionManager,
  };
}

var _tmpl$$3 = /* @__PURE__ */ template(`<option>`);
var _tmpl$2$1 = /* @__PURE__ */ template(
  `<div aria-hidden="true"><input type="text"><select tabindex="-1"><option>`
);
function HiddenSelectBase(props) {
  let ref;
  const [local, others] = splitProps(props, [
    "ref",
    "onChange",
    "collection",
    "selectionManager",
    "isOpen",
    "isMultiple",
    "isVirtualized",
    "focusTrigger",
  ]);
  const formControlContext = useFormControlContext();
  const [isInternalChangeEvent, setIsInternalChangeEvent] = createSignal(false);
  const renderOption = (key) => {
    const item = local.collection.getItem(key);
    return createComponent(Show, {
      get when() {
        return item?.type === "item";
      },
      get children() {
        const _el$ = _tmpl$$3();
        _el$.value = key;
        insert(_el$, () => item?.textValue);
        effect(() => (_el$.selected = local.selectionManager.isSelected(key)));
        return _el$;
      },
    });
  };
  createEffect(
    on(
      () => local.selectionManager.selectedKeys(),
      (keys, prevKeys) => {
        if (prevKeys && isSameSelection(keys, prevKeys)) {
          return;
        }
        setIsInternalChangeEvent(true);
        ref?.dispatchEvent(
          new Event("input", {
            bubbles: true,
            cancelable: true,
          })
        );
        ref?.dispatchEvent(
          new Event("change", {
            bubbles: true,
            cancelable: true,
          })
        );
      },
      {
        defer: true,
      }
    )
  );
  return (() => {
    const _el$2 = _tmpl$2$1(),
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.nextSibling;
    _el$3.addEventListener("focus", () => local.focusTrigger());
    _el$3.style.setProperty("font-size", "16px");
    _el$4.addEventListener("change", (e) => {
      callHandler(e, local.onChange);
      if (!isInternalChangeEvent()) {
        local.selectionManager.setSelectedKeys(
          /* @__PURE__ */ new Set([e.target.value])
        );
      }
      setIsInternalChangeEvent(false);
    });
    const _ref$ = mergeRefs((el) => (ref = el), local.ref);
    typeof _ref$ === "function" && use(_ref$, _el$4);
    spread(
      _el$4,
      mergeProps$1(
        {
          get multiple() {
            return local.isMultiple;
          },
          get name() {
            return formControlContext.name();
          },
          get required() {
            return formControlContext.isRequired();
          },
          get disabled() {
            return formControlContext.isDisabled();
          },
          get size() {
            return local.collection.getSize();
          },
          get value() {
            return local.selectionManager.firstSelectedKey() ?? "";
          },
        },
        others
      ),
      false,
      true
    );
    insert(
      _el$4,
      createComponent(Show, {
        get when() {
          return local.isVirtualized;
        },
        get fallback() {
          return createComponent(For, {
            get each() {
              return [...local.collection.getKeys()];
            },
            children: renderOption,
          });
        },
        get children() {
          return createComponent(For, {
            get each() {
              return [...local.selectionManager.selectedKeys()];
            },
            children: renderOption,
          });
        },
      }),
      null
    );
    effect(
      (_p$) => {
        const _v$ = visuallyHiddenStyles,
          _v$2 = local.selectionManager.isFocused() || local.isOpen ? -1 : 0,
          _v$3 = formControlContext.isRequired(),
          _v$4 = formControlContext.isDisabled(),
          _v$5 = formControlContext.isReadOnly();
        _p$._v$ = style(_el$2, _v$, _p$._v$);
        _v$2 !== _p$._v$2 && setAttribute(_el$3, "tabindex", (_p$._v$2 = _v$2));
        _v$3 !== _p$._v$3 && (_el$3.required = _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && (_el$3.disabled = _p$._v$4 = _v$4);
        _v$5 !== _p$._v$5 && (_el$3.readOnly = _p$._v$5 = _v$5);
        return _p$;
      },
      {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0,
        _v$5: void 0,
      }
    );
    return _el$2;
  })();
}

// src/primitives/create-collection/get-item-count.ts
var cache = /* @__PURE__ */ new WeakMap();
function getItemCount(collection) {
  let count = cache.get(collection);
  if (count != null) {
    return count;
  }
  count = 0;
  for (const item of collection) {
    if (item.type === "item") {
      count++;
    }
  }
  cache.set(collection, count);
  return count;
}

// src/list/list-keyboard-delegate.ts
var ListKeyboardDelegate = class {
  collection;
  ref;
  collator;
  constructor(collection, ref, collator) {
    this.collection = collection;
    this.ref = ref;
    this.collator = collator;
  }
  getKeyBelow(key) {
    let keyAfter = this.collection().getKeyAfter(key);
    while (keyAfter != null) {
      const item = this.collection().getItem(keyAfter);
      if (item && item.type === "item" && !item.disabled) {
        return keyAfter;
      }
      keyAfter = this.collection().getKeyAfter(keyAfter);
    }
  }
  getKeyAbove(key) {
    let keyBefore = this.collection().getKeyBefore(key);
    while (keyBefore != null) {
      const item = this.collection().getItem(keyBefore);
      if (item && item.type === "item" && !item.disabled) {
        return keyBefore;
      }
      keyBefore = this.collection().getKeyBefore(keyBefore);
    }
  }
  getFirstKey() {
    let key = this.collection().getFirstKey();
    while (key != null) {
      const item = this.collection().getItem(key);
      if (item && item.type === "item" && !item.disabled) {
        return key;
      }
      key = this.collection().getKeyAfter(key);
    }
  }
  getLastKey() {
    let key = this.collection().getLastKey();
    while (key != null) {
      const item = this.collection().getItem(key);
      if (item && item.type === "item" && !item.disabled) {
        return key;
      }
      key = this.collection().getKeyBefore(key);
    }
  }
  getItem(key) {
    return this.ref?.()?.querySelector(`[data-key="${key}"]`) ?? null;
  }
  // TODO: not working correctly
  getKeyPageAbove(key) {
    const menu = this.ref?.();
    let item = this.getItem(key);
    if (!menu || !item) {
      return;
    }
    const pageY = Math.max(
      0,
      item.offsetTop + item.offsetHeight - menu.offsetHeight
    );
    let keyAbove = key;
    while (keyAbove && item && item.offsetTop > pageY) {
      keyAbove = this.getKeyAbove(keyAbove);
      item = keyAbove != null ? this.getItem(keyAbove) : null;
    }
    return keyAbove;
  }
  // TODO: not working correctly
  getKeyPageBelow(key) {
    const menu = this.ref?.();
    let item = this.getItem(key);
    if (!menu || !item) {
      return;
    }
    const pageY = Math.min(
      menu.scrollHeight,
      item.offsetTop - item.offsetHeight + menu.offsetHeight
    );
    let keyBelow = key;
    while (keyBelow && item && item.offsetTop < pageY) {
      keyBelow = this.getKeyBelow(keyBelow);
      item = keyBelow != null ? this.getItem(keyBelow) : null;
    }
    return keyBelow;
  }
  getKeyForSearch(search, fromKey) {
    const collator = this.collator?.();
    if (!collator) {
      return;
    }
    let key = fromKey != null ? this.getKeyBelow(fromKey) : this.getFirstKey();
    while (key != null) {
      const item = this.collection().getItem(key);
      if (item) {
        const substring = item.textValue.slice(0, search.length);
        if (item.textValue && collator.compare(substring, search) === 0) {
          return key;
        }
      }
      key = this.getKeyBelow(key);
    }
  }
};
function createSelectableList(props, ref, scrollRef) {
  const collator = createCollator({
    usage: "search",
    sensitivity: "base",
  });
  const delegate = createMemo(() => {
    const keyboardDelegate = access$1(props.keyboardDelegate);
    if (keyboardDelegate) {
      return keyboardDelegate;
    }
    return new ListKeyboardDelegate(props.collection, ref, collator);
  });
  return createSelectableCollection(
    {
      selectionManager: () => access$1(props.selectionManager),
      keyboardDelegate: delegate,
      autoFocus: () => access$1(props.autoFocus),
      deferAutoFocus: () => access$1(props.deferAutoFocus),
      shouldFocusWrap: () => access$1(props.shouldFocusWrap),
      disallowEmptySelection: () => access$1(props.disallowEmptySelection),
      selectOnFocus: () => access$1(props.selectOnFocus),
      disallowTypeAhead: () => access$1(props.disallowTypeAhead),
      shouldUseVirtualFocus: () => access$1(props.shouldUseVirtualFocus),
      allowsTabNavigation: () => access$1(props.allowsTabNavigation),
      isVirtualized: () => access$1(props.isVirtualized),
      scrollToKey: (key) => access$1(props.scrollToKey)?.(key),
      orientation: () => access$1(props.orientation),
    },
    ref,
    scrollRef
  );
}

// src/listbox/index.tsx
var listbox_exports = {};
__export(listbox_exports, {
  Item: () => ListboxItem,
  ItemDescription: () => ListboxItemDescription,
  ItemIndicator: () => ListboxItemIndicator,
  ItemLabel: () => ListboxItemLabel,
  Listbox: () => Listbox,
  Root: () => ListboxRoot,
  Section: () => ListboxSection,
});
var ListboxContext = createContext();
function useListboxContext() {
  const context = useContext(ListboxContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useListboxContext` must be used within a `Listbox` component"
    );
  }
  return context;
}
var ListboxItemContext = createContext();
function useListboxItemContext() {
  const context = useContext(ListboxItemContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useListboxItemContext` must be used within a `Listbox.Item` component"
    );
  }
  return context;
}

// src/listbox/listbox-item.tsx
function ListboxItem(props) {
  let ref;
  const listBoxContext = useListboxContext();
  const defaultId = `${listBoxContext.generateId("item")}-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
    },
    props
  );
  const [local, others] = splitProps(mergedProps, [
    "ref",
    "item",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "onPointerMove",
    "onPointerDown",
    "onPointerUp",
    "onClick",
    "onKeyDown",
    "onMouseDown",
    "onFocus",
  ]);
  const [labelId, setLabelId] = createSignal();
  const [descriptionId, setDescriptionId] = createSignal();
  const selectionManager = () => listBoxContext.listState().selectionManager();
  const isHighlighted = () =>
    selectionManager().focusedKey() === local.item.key;
  const selectableItem = createSelectableItem(
    {
      key: () => local.item.key,
      selectionManager,
      shouldSelectOnPressUp: listBoxContext.shouldSelectOnPressUp,
      allowsDifferentPressOrigin: () => {
        return (
          listBoxContext.shouldSelectOnPressUp() &&
          listBoxContext.shouldFocusOnHover()
        );
      },
      shouldUseVirtualFocus: listBoxContext.shouldUseVirtualFocus,
      disabled: () => local.item.disabled,
    },
    () => ref
  );
  const ariaSelected = () => {
    if (selectionManager().selectionMode() === "none") {
      return void 0;
    }
    return selectableItem.isSelected();
  };
  const isNotSafariMacOS = createMemo(() => !(isMac() && isWebKit$1()));
  const ariaLabel = () => (isNotSafariMacOS() ? local["aria-label"] : void 0);
  const ariaLabelledBy = () => (isNotSafariMacOS() ? labelId() : void 0);
  const ariaDescribedBy = () => (isNotSafariMacOS() ? descriptionId() : void 0);
  const ariaPosInSet = () => {
    if (!listBoxContext.isVirtualized()) {
      return void 0;
    }
    const index = listBoxContext
      .listState()
      .collection()
      .getItem(local.item.key)?.index;
    return index != null ? index + 1 : void 0;
  };
  const ariaSetSize = () => {
    if (!listBoxContext.isVirtualized()) {
      return void 0;
    }
    return getItemCount(listBoxContext.listState().collection());
  };
  const onPointerMove = (e) => {
    callHandler(e, local.onPointerMove);
    if (e.pointerType !== "mouse") {
      return;
    }
    if (!selectableItem.isDisabled() && listBoxContext.shouldFocusOnHover()) {
      focusWithoutScrolling(e.currentTarget);
      selectionManager().setFocused(true);
      selectionManager().setFocusedKey(local.item.key);
    }
  };
  const dataset = createMemo(() => ({
    "data-disabled": selectableItem.isDisabled() ? "" : void 0,
    "data-selected": selectableItem.isSelected() ? "" : void 0,
    "data-highlighted": isHighlighted() ? "" : void 0,
  }));
  const context = {
    isSelected: selectableItem.isSelected,
    dataset,
    generateId: createGenerateId(() => others.id),
    registerLabelId: createRegisterId(setLabelId),
    registerDescriptionId: createRegisterId(setDescriptionId),
  };
  return createComponent(ListboxItemContext.Provider, {
    value: context,
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "li",
            ref(r$) {
              const _ref$ = mergeRefs((el) => (ref = el), local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
            role: "option",
            get tabIndex() {
              return selectableItem.tabIndex();
            },
            get ["aria-disabled"]() {
              return selectableItem.isDisabled();
            },
            get ["aria-selected"]() {
              return ariaSelected();
            },
            get ["aria-label"]() {
              return ariaLabel();
            },
            get ["aria-labelledby"]() {
              return ariaLabelledBy();
            },
            get ["aria-describedby"]() {
              return ariaDescribedBy();
            },
            get ["aria-posinset"]() {
              return ariaPosInSet();
            },
            get ["aria-setsize"]() {
              return ariaSetSize();
            },
            get ["data-key"]() {
              return selectableItem.dataKey();
            },
            get onPointerDown() {
              return composeEventHandlers([
                local.onPointerDown,
                selectableItem.onPointerDown,
              ]);
            },
            get onPointerUp() {
              return composeEventHandlers([
                local.onPointerUp,
                selectableItem.onPointerUp,
              ]);
            },
            get onClick() {
              return composeEventHandlers([
                local.onClick,
                selectableItem.onClick,
              ]);
            },
            get onKeyDown() {
              return composeEventHandlers([
                local.onKeyDown,
                selectableItem.onKeyDown,
              ]);
            },
            get onMouseDown() {
              return composeEventHandlers([
                local.onMouseDown,
                selectableItem.onMouseDown,
              ]);
            },
            get onFocus() {
              return composeEventHandlers([
                local.onFocus,
                selectableItem.onFocus,
              ]);
            },
            onPointerMove,
          },
          dataset,
          others
        )
      );
    },
  });
}
function ListboxItemDescription(props) {
  const context = useListboxItemContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("description"),
    },
    props
  );
  createEffect(() => onCleanup(context.registerDescriptionId(mergedProps.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
      },
      () => context.dataset(),
      mergedProps
    )
  );
}
function ListboxItemIndicator(props) {
  const context = useListboxItemContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("indicator"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["forceMount"]);
  return createComponent(Show, {
    get when() {
      return local.forceMount || context.isSelected();
    },
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "div",
            "aria-hidden": "true",
          },
          () => context.dataset(),
          others
        )
      );
    },
  });
}
function ListboxItemLabel(props) {
  const context = useListboxItemContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("label"),
    },
    props
  );
  createEffect(() => onCleanup(context.registerLabelId(mergedProps.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
      },
      () => context.dataset(),
      mergedProps
    )
  );
}
function ListboxRoot(props) {
  let ref;
  const defaultId = `listbox-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      virtualized: false,
    },
    props
  );
  const [local, others] = splitProps(mergedProps, [
    "ref",
    "children",
    "renderItem",
    "renderSection",
    "value",
    "defaultValue",
    "onChange",
    "options",
    "optionValue",
    "optionTextValue",
    "optionDisabled",
    "optionGroupChildren",
    "state",
    "keyboardDelegate",
    "autoFocus",
    "selectionMode",
    "shouldFocusWrap",
    "shouldUseVirtualFocus",
    "shouldSelectOnPressUp",
    "shouldFocusOnHover",
    "allowDuplicateSelectionEvents",
    "disallowEmptySelection",
    "selectionBehavior",
    "selectOnFocus",
    "disallowTypeAhead",
    "allowsTabNavigation",
    "virtualized",
    "scrollToItem",
    "scrollRef",
    "onKeyDown",
    "onMouseDown",
    "onFocusIn",
    "onFocusOut",
  ]);
  const listState = createMemo(() => {
    if (local.state) {
      return local.state;
    }
    return createListState({
      selectedKeys: () => local.value,
      defaultSelectedKeys: () => local.defaultValue,
      onSelectionChange: local.onChange,
      allowDuplicateSelectionEvents: () =>
        access$1(local.allowDuplicateSelectionEvents),
      disallowEmptySelection: () => access$1(local.disallowEmptySelection),
      selectionBehavior: () => access$1(local.selectionBehavior),
      selectionMode: () => access$1(local.selectionMode),
      dataSource: () => local.options ?? [],
      getKey: () => local.optionValue,
      getTextValue: () => local.optionTextValue,
      getDisabled: () => local.optionDisabled,
      getSectionChildren: () => local.optionGroupChildren,
    });
  });
  const selectableList = createSelectableList(
    {
      selectionManager: () => listState().selectionManager(),
      collection: () => listState().collection(),
      autoFocus: () => access$1(local.autoFocus),
      shouldFocusWrap: () => access$1(local.shouldFocusWrap),
      keyboardDelegate: () => local.keyboardDelegate,
      disallowEmptySelection: () => access$1(local.disallowEmptySelection),
      selectOnFocus: () => access$1(local.selectOnFocus),
      disallowTypeAhead: () => access$1(local.disallowTypeAhead),
      shouldUseVirtualFocus: () => access$1(local.shouldUseVirtualFocus),
      allowsTabNavigation: () => access$1(local.allowsTabNavigation),
      isVirtualized: () => local.virtualized,
      scrollToKey: () => local.scrollToItem,
    },
    () => ref,
    () => local.scrollRef?.()
  );
  const context = {
    listState,
    generateId: createGenerateId(() => others.id),
    shouldUseVirtualFocus: () => mergedProps.shouldUseVirtualFocus,
    shouldSelectOnPressUp: () => mergedProps.shouldSelectOnPressUp,
    shouldFocusOnHover: () => mergedProps.shouldFocusOnHover,
    isVirtualized: () => local.virtualized,
  };
  return createComponent(ListboxContext.Provider, {
    value: context,
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "ul",
            ref(r$) {
              const _ref$ = mergeRefs((el) => (ref = el), local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
            role: "listbox",
            get tabIndex() {
              return selectableList.tabIndex();
            },
            get ["aria-multiselectable"]() {
              return listState().selectionManager().selectionMode() ===
                "multiple"
                ? true
                : void 0;
            },
            get onKeyDown() {
              return composeEventHandlers([
                local.onKeyDown,
                selectableList.onKeyDown,
              ]);
            },
            get onMouseDown() {
              return composeEventHandlers([
                local.onMouseDown,
                selectableList.onMouseDown,
              ]);
            },
            get onFocusIn() {
              return composeEventHandlers([
                local.onFocusIn,
                selectableList.onFocusIn,
              ]);
            },
            get onFocusOut() {
              return composeEventHandlers([
                local.onFocusOut,
                selectableList.onFocusOut,
              ]);
            },
          },
          others,
          {
            get children() {
              return createComponent(Show, {
                get when() {
                  return !local.virtualized;
                },
                get fallback() {
                  return local.children?.(listState().collection);
                },
                get children() {
                  return createComponent(Key, {
                    get each() {
                      return [...listState().collection()];
                    },
                    by: "key",
                    children: (item) =>
                      createComponent(Switch, {
                        get children() {
                          return [
                            createComponent(Match, {
                              get when() {
                                return item().type === "section";
                              },
                              get children() {
                                return local.renderSection?.(item());
                              },
                            }),
                            createComponent(Match, {
                              get when() {
                                return item().type === "item";
                              },
                              get children() {
                                return local.renderItem?.(item());
                              },
                            }),
                          ];
                        },
                      }),
                  });
                },
              });
            },
          }
        )
      );
    },
  });
}
function ListboxSection(props) {
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "li",
        role: "presentation",
      },
      props
    )
  );
}

// src/listbox/index.tsx
var Listbox = Object.assign(ListboxRoot, {
  Item: ListboxItem,
  ItemDescription: ListboxItemDescription,
  ItemIndicator: ListboxItemIndicator,
  ItemLabel: ListboxItemLabel,
  Section: ListboxSection,
});

/**
 * Custom positioning reference element.
 * @see https://floating-ui.com/docs/virtual-elements
 */

const sides = ["top", "right", "bottom", "left"];
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v) => ({
  x: v,
  y: v,
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom",
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start",
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide =
    alignmentAxis === "x"
      ? alignment === (rtl ? "end" : "start")
        ? "right"
        : "left"
      : alignment === "start"
      ? "bottom"
      : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment]
  );
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(
    /left|right|bottom|top/g,
    (side) => oppositeSideMap[side]
  );
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding,
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number"
    ? expandPaddingObject(padding)
    : {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding,
      };
}
function rectToClientRect(rect) {
  const { x, y, width, height } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
  };
}

function computeCoordsFromPlacement(_ref, placement, rtl) {
  let { reference, floating } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height,
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height,
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY,
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY,
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y,
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 *
 * This export does not have any `platform` interface logic. You will need to
 * write one for the platform you are using Floating UI with.
 */
const computePosition$1 = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform,
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform.isRTL == null
    ? void 0
    : platform.isRTL(floating));
  let rects = await platform.getElementRects({
    reference,
    floating,
    strategy,
  });
  let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const { name, fn } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset,
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform,
      elements: {
        reference,
        floating,
      },
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data,
      },
    };
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects =
            reset.rects === true
              ? await platform.getElementRects({
                  reference,
                  floating,
                  strategy,
                })
              : reset.rects;
        }
        ({ x, y } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData,
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const { x, y, platform, rects, elements, strategy } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0,
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(
    await platform.getClippingRect({
      element: (
        (_await$platform$isEle = await (platform.isElement == null
          ? void 0
          : platform.isElement(element))) != null
          ? _await$platform$isEle
          : true
      )
        ? element
        : element.contextElement ||
          (await (platform.getDocumentElement == null
            ? void 0
            : platform.getDocumentElement(elements.floating))),
      boundary,
      rootBoundary,
      strategy,
    })
  );
  const rect =
    elementContext === "floating"
      ? {
          x,
          y,
          width: rects.floating.width,
          height: rects.floating.height,
        }
      : rects.reference;
  const offsetParent = await (platform.getOffsetParent == null
    ? void 0
    : platform.getOffsetParent(elements.floating));
  const offsetScale = (await (platform.isElement == null
    ? void 0
    : platform.isElement(offsetParent)))
    ? (await (platform.getScale == null
        ? void 0
        : platform.getScale(offsetParent))) || {
        x: 1,
        y: 1,
      }
    : {
        x: 1,
        y: 1,
      };
  const elementClientRect = rectToClientRect(
    platform.convertOffsetParentRelativeRectToViewportRelativeRect
      ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements,
          rect,
          offsetParent,
          strategy,
        })
      : rect
  );
  return {
    top:
      (clippingClientRect.top - elementClientRect.top + paddingObject.top) /
      offsetScale.y,
    bottom:
      (elementClientRect.bottom -
        clippingClientRect.bottom +
        paddingObject.bottom) /
      offsetScale.y,
    left:
      (clippingClientRect.left - elementClientRect.left + paddingObject.left) /
      offsetScale.x,
    right:
      (elementClientRect.right -
        clippingClientRect.right +
        paddingObject.right) /
      offsetScale.x,
  };
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow$1 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const { x, y, placement, rects, platform, elements, middlewareData } =
      state;
    // Since `element` is required, we don't Partial<> the type.
    const { element, padding = 0 } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y,
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff =
      rects.reference[length] +
      rects.reference[axis] -
      coords[axis] -
      rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = await (platform.getOffsetParent == null
      ? void 0
      : platform.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (
      !clientSize ||
      !(await (platform.isElement == null
        ? void 0
        : platform.isElement(arrowOffsetParent)))
    ) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding =
      clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min$1 = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center =
      clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min$1, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset =
      !middlewareData.arrow &&
      getAlignment(placement) != null &&
      center !== offset &&
      rects.reference[length] / 2 -
        (center < min$1 ? minPadding : maxPadding) -
        arrowDimensions[length] / 2 <
        0;
    const alignmentOffset = shouldAddOffset
      ? center < min$1
        ? center - min$1
        : center - max
      : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {
          alignmentOffset,
        }),
      },
      reset: shouldAddOffset,
    };
  },
});

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform,
        elements,
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);

      // If a reset by the arrow was caused due to an alignment offset being
      // added, we should skip any logic now since `flip()` has already done its
      // work.
      // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
      if (
        (_middlewareData$arrow = middlewareData.arrow) != null &&
        _middlewareData$arrow.alignmentOffset
      ) {
        return {};
      }
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform.isRTL == null
        ? void 0
        : platform.isRTL(elements.floating));
      const fallbackPlacements =
        specifiedFallbackPlacements ||
        (isBasePlacement || !flipAlignment
          ? [getOppositePlacement(initialPlacement)]
          : getExpandedPlacements(initialPlacement));
      if (
        !specifiedFallbackPlacements &&
        fallbackAxisSideDirection !== "none"
      ) {
        fallbackPlacements.push(
          ...getOppositeAxisPlacements(
            initialPlacement,
            flipAlignment,
            fallbackAxisSideDirection,
            rtl
          )
        );
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData =
        ((_middlewareData$flip = middlewareData.flip) == null
          ? void 0
          : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [
        ...overflowsData,
        {
          placement,
          overflows,
        },
      ];

      // One or more sides is overflowing.
      if (!overflows.every((side) => side <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex =
          (((_middlewareData$flip2 = middlewareData.flip) == null
            ? void 0
            : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          // Try next placement and re-run the lifecycle.
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData,
            },
            reset: {
              placement: nextPlacement,
            },
          };
        }

        // First, find the candidates that fit on the mainAxis side of overflow,
        // then find the placement that fits the best on the main crossAxis side.
        let resetPlacement =
          (_overflowsData$filter = overflowsData
            .filter((d) => d.overflows[0] <= 0)
            .sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null
            ? void 0
            : _overflowsData$filter.placement;

        // Otherwise fallback.
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement =
                (_overflowsData$map$so = overflowsData
                  .map((d) => [
                    d.placement,
                    d.overflows
                      .filter((overflow) => overflow > 0)
                      .reduce((acc, overflow) => acc + overflow, 0),
                  ])
                  .sort((a, b) => a[1] - b[1])[0]) == null
                  ? void 0
                  : _overflowsData$map$so[0];
              if (placement) {
                resetPlacement = placement;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement,
            },
          };
        }
      }
      return {};
    },
  };
};

function getSideOffsets(overflow, rect) {
  return {
    top: overflow.top - rect.height,
    right: overflow.right - rect.width,
    bottom: overflow.bottom - rect.height,
    left: overflow.left - rect.width,
  };
}
function isAnySideFullyClipped(overflow) {
  return sides.some((side) => overflow[side] >= 0);
}
/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "hide",
    options,
    async fn(state) {
      const { rects } = state;
      const { strategy = "referenceHidden", ...detectOverflowOptions } =
        evaluate(options, state);
      switch (strategy) {
        case "referenceHidden": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            elementContext: "reference",
          });
          const offsets = getSideOffsets(overflow, rects.reference);
          return {
            data: {
              referenceHiddenOffsets: offsets,
              referenceHidden: isAnySideFullyClipped(offsets),
            },
          };
        }
        case "escaped": {
          const overflow = await detectOverflow(state, {
            ...detectOverflowOptions,
            altBoundary: true,
          });
          const offsets = getSideOffsets(overflow, rects.floating);
          return {
            data: {
              escapedOffsets: offsets,
              escaped: isAnySideFullyClipped(offsets),
            },
          };
        }
        default: {
          return {};
        }
      }
    },
  };
};

// For type backwards-compatibility, the `OffsetOptions` type was also
// Derivable.

async function convertValueToCoords(state, options) {
  const { placement, platform, elements } = state;
  const rtl = await (platform.isRTL == null
    ? void 0
    : platform.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);

  // eslint-disable-next-line prefer-const
  let { mainAxis, crossAxis, alignmentAxis } =
    typeof rawValue === "number"
      ? {
          mainAxis: rawValue,
          crossAxis: 0,
          alignmentAxis: null,
        }
      : {
          mainAxis: 0,
          crossAxis: 0,
          alignmentAxis: null,
          ...rawValue,
        };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical
    ? {
        x: crossAxis * crossAxisMulti,
        y: mainAxis * mainAxisMulti,
      }
    : {
        x: mainAxis * mainAxisMulti,
        y: crossAxis * crossAxisMulti,
      };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset$1 = function (options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const { x, y, placement, middlewareData } = state;
      const diffCoords = await convertValueToCoords(state, options);

      // If the placement is the same and the arrow caused an alignment offset
      // then we don't need to change the positioning coordinates.
      if (
        placement ===
          ((_middlewareData$offse = middlewareData.offset) == null
            ? void 0
            : _middlewareData$offse.placement) &&
        (_middlewareData$arrow = middlewareData.arrow) != null &&
        _middlewareData$arrow.alignmentOffset
      ) {
        return {};
      }
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: {
          ...diffCoords,
          placement,
        },
      };
    },
  };
};

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const { x, y, placement } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let { x, y } = _ref;
            return {
              x,
              y,
            };
          },
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x,
        y,
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min = mainAxisCoord + overflow[minSide];
        const max = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min, mainAxisCoord, max);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min = crossAxisCoord + overflow[minSide];
        const max = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min, crossAxisCoord, max);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord,
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y,
        },
      };
    },
  };
};

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size$1 = function (options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "size",
    options,
    async fn(state) {
      const { placement, rects, platform, elements } = state;
      const { apply = () => {}, ...detectOverflowOptions } = evaluate(
        options,
        state
      );
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const side = getSide(placement);
      const alignment = getAlignment(placement);
      const isYAxis = getSideAxis(placement) === "y";
      const { width, height } = rects.floating;
      let heightSide;
      let widthSide;
      if (side === "top" || side === "bottom") {
        heightSide = side;
        widthSide =
          alignment ===
          ((await (platform.isRTL == null
            ? void 0
            : platform.isRTL(elements.floating)))
            ? "start"
            : "end")
            ? "left"
            : "right";
      } else {
        widthSide = side;
        heightSide = alignment === "end" ? "top" : "bottom";
      }
      const maximumClippingHeight = height - overflow.top - overflow.bottom;
      const maximumClippingWidth = width - overflow.left - overflow.right;
      const overflowAvailableHeight = min(
        height - overflow[heightSide],
        maximumClippingHeight
      );
      const overflowAvailableWidth = min(
        width - overflow[widthSide],
        maximumClippingWidth
      );
      const noShift = !state.middlewareData.shift;
      let availableHeight = overflowAvailableHeight;
      let availableWidth = overflowAvailableWidth;
      if (isYAxis) {
        availableWidth =
          alignment || noShift
            ? min(overflowAvailableWidth, maximumClippingWidth)
            : maximumClippingWidth;
      } else {
        availableHeight =
          alignment || noShift
            ? min(overflowAvailableHeight, maximumClippingHeight)
            : maximumClippingHeight;
      }
      if (noShift && !alignment) {
        const xMin = max(overflow.left, 0);
        const xMax = max(overflow.right, 0);
        const yMin = max(overflow.top, 0);
        const yMax = max(overflow.bottom, 0);
        if (isYAxis) {
          availableWidth =
            width -
            2 *
              (xMin !== 0 || xMax !== 0
                ? xMin + xMax
                : max(overflow.left, overflow.right));
        } else {
          availableHeight =
            height -
            2 *
              (yMin !== 0 || yMax !== 0
                ? yMin + yMax
                : max(overflow.top, overflow.bottom));
        }
      }
      await apply({
        ...state,
        availableWidth,
        availableHeight,
      });
      const nextDimensions = await platform.getDimensions(elements.floating);
      if (width !== nextDimensions.width || height !== nextDimensions.height) {
        return {
          reset: {
            rects: true,
          },
        };
      }
      return {};
    },
  };
};

function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  // Mocked nodes in testing environments may not be instances of Node. By
  // returning `#document` an infinite loop won't occur.
  // https://github.com/floating-ui/floating-ui/issues/2317
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (
    (node == null || (_node$ownerDocument = node.ownerDocument) == null
      ? void 0
      : _node$ownerDocument.defaultView) || window
  );
}
function getDocumentElement(node) {
  var _ref;
  return (_ref =
    (isNode(node) ? node.ownerDocument : node.document) || window.document) ==
    null
    ? void 0
    : _ref.documentElement;
}
function isNode(value) {
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  return (
    value instanceof HTMLElement ||
    value instanceof getWindow(value).HTMLElement
  );
}
function isShadowRoot(value) {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return (
    value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot
  );
}
function isOverflowElement(element) {
  const { overflow, overflowX, overflowY, display } =
    getComputedStyle$1(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !["inline", "contents"].includes(display)
  );
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const webkit = isWebKit();
  const css = getComputedStyle$1(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== "none" ||
    css.perspective !== "none" ||
    (css.containerType ? css.containerType !== "normal" : false) ||
    (!webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false)) ||
    (!webkit && (css.filter ? css.filter !== "none" : false)) ||
    ["transform", "perspective", "filter"].some((value) =>
      (css.willChange || "").includes(value)
    ) ||
    ["paint", "layout", "strict", "content"].some((value) =>
      (css.contain || "").includes(value)
    )
  );
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset,
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    (isShadowRoot(node) && node.host) ||
    // Fallback.
    getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody =
    scrollableAncestor ===
    ((_node$ownerDocument2 = node.ownerDocument) == null
      ? void 0
      : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
      win.frameElement && traverseIframes
        ? getOverflowAncestors(win.frameElement)
        : []
    );
  }
  return list.concat(
    scrollableAncestor,
    getOverflowAncestors(scrollableAncestor, [], traverseIframes)
  );
}

function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  // In testing environments, the `width` and `height` properties are empty
  // strings for SVG elements, returning NaN. Fallback to `0` in this case.
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback =
    round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback,
  };
}

function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}

function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const { width, height, $ } = getCssDimensions(domElement);
  let x = ($ ? round(rect.width) : rect.width) / width;
  let y = ($ ? round(rect.height) : rect.height) / height;

  // 0, NaN, or Infinity should always fallback to 1.

  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y,
  };
}

const noOffsets = /*#__PURE__*/ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop,
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (
    !floatingOffsetParent ||
    (isFixed && floatingOffsetParent !== getWindow(element))
  ) {
    return false;
  }
  return isFixed;
}

function getBoundingClientRect(
  element,
  includeScale,
  isFixedStrategy,
  offsetParent
) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(
    domElement,
    isFixedStrategy,
    offsetParent
  )
    ? getVisualOffsets(domElement)
    : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin =
      offsetParent && isElement(offsetParent)
        ? getWindow(offsetParent)
        : offsetParent;
    let currentWin = win;
    let currentIFrame = currentWin.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle$1(currentIFrame);
      const left =
        iframeRect.left +
        (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) *
          iframeScale.x;
      const top =
        iframeRect.top +
        (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = currentWin.frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y,
  });
}

const topLayerSelectors = [":popover-open", ":modal"];
function isTopLayer(element) {
  return topLayerSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}

function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let { elements, rect, offsetParent, strategy } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || (topLayer && isFixed)) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0,
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y,
  };
}

function getClientRects(element) {
  return Array.from(element.getClientRects());
}

function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return (
    getBoundingClientRect(getDocumentElement(element)).left +
    getNodeScroll(element).scrollLeft
  );
}

// Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable.
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(
    html.scrollWidth,
    html.clientWidth,
    body.scrollWidth,
    body.clientWidth
  );
  const height = max(
    html.scrollHeight,
    html.clientHeight,
    body.scrollHeight,
    body.clientHeight
  );
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y,
  };
}

function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || (visualViewportBased && strategy === "fixed")) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y,
  };
}

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y,
  };
}
function getClientRectFromClippingAncestor(
  element,
  clippingAncestor,
  strategy
) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (
    parentNode === stopNode ||
    !isElement(parentNode) ||
    isLastTraversableNode(parentNode)
  ) {
    return false;
  }
  return (
    getComputedStyle$1(parentNode).position === "fixed" ||
    hasFixedPositionAncestor(parentNode, stopNode)
  );
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter(
    (el) => isElement(el) && getNodeName(el) !== "body"
  );
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed
      ? !currentNodeIsContaining && !currentContainingBlockComputedStyle
      : (!currentNodeIsContaining &&
          computedStyle.position === "static" &&
          !!currentContainingBlockComputedStyle &&
          ["absolute", "fixed"].includes(
            currentContainingBlockComputedStyle.position
          )) ||
        (isOverflowElement(currentNode) &&
          !currentNodeIsContaining &&
          hasFixedPositionAncestor(element, currentNode));
    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration.
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
function getClippingRect(_ref) {
  let { element, boundary, rootBoundary, strategy } = _ref;
  const elementClippingAncestors =
    boundary === "clippingAncestors"
      ? isTopLayer(element)
        ? []
        : getClippingElementAncestors(element, this._c)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(
      element,
      clippingAncestor,
      strategy
    );
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top,
  };
}

function getDimensions(element) {
  const { width, height } = getCssDimensions(element);
  return {
    width,
    height,
  };
}

function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0,
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(
        offsetParent,
        true,
        isFixed,
        offsetParent
      );
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const x = rect.left + scroll.scrollLeft - offsets.x;
  const y = rect.top + scroll.scrollTop - offsets.y;
  return {
    x,
    y,
    width: rect.width,
    height: rect.height,
  };
}

function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}

function getTrueOffsetParent(element, polyfill) {
  if (
    !isHTMLElement(element) ||
    getComputedStyle$1(element).position === "fixed"
  ) {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}

// Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    isStaticPositioned(offsetParent)
  ) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (
    offsetParent &&
    isLastTraversableNode(offsetParent) &&
    isStaticPositioned(offsetParent) &&
    !isContainingBlock(offsetParent)
  ) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}

const getElementRects = async function (data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(
      data.reference,
      await getOffsetParentFn(data.floating),
      data.strategy
    ),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height,
    },
  };
};

function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}

const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL,
};

// https://samthor.au/2021/observing-dom/
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const { left, top, width, height } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin =
      -insetTop +
      "px " +
      -insetRight +
      "px " +
      -insetBottom +
      "px " +
      -insetLeft +
      "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1,
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          // If the reference is clipped, the ratio is 0. Throttle the refresh
          // to prevent an infinite loop of updates.
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1000);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }

    // Older browsers don't support a `document` as the root and will throw an
    // error.
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument,
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}

/**
 * Automatically updates the position of the floating element when necessary.
 * Should only be called when the floating element is mounted on the DOM or
 * visible on the screen.
 * @returns cleanup function that should be invoked when the floating element is
 * removed from the DOM or hidden from the screen.
 * @see https://floating-ui.com/docs/autoUpdate
 */
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false,
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors =
    ancestorScroll || ancestorResize
      ? [
          ...(referenceEl ? getOverflowAncestors(referenceEl) : []),
          ...getOverflowAncestors(floating),
        ]
      : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll &&
      ancestor.addEventListener("scroll", update, {
        passive: true,
      });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo =
    referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        // Prevent update loops when using the `size` middleware.
        // https://github.com/floating-ui/floating-ui/issues/1740
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null ||
            _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (
      prevRefRect &&
      (nextRefRect.x !== prevRefRect.x ||
        nextRefRect.y !== prevRefRect.y ||
        nextRefRect.width !== prevRefRect.width ||
        nextRefRect.height !== prevRefRect.height)
    ) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null ||
      _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}

/**
 * Modifies the placement by translating the floating element along the
 * specified axes.
 * A number (shorthand for `mainAxis` or distance), or an axes configuration
 * object may be passed.
 * @see https://floating-ui.com/docs/offset
 */
const offset = offset$1;

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
const shift = shift$1;

/**
 * Optimizes the visibility of the floating element by flipping the `placement`
 * in order to keep it in view when the preferred placement(s) will overflow the
 * clipping boundary. Alternative to `autoPlacement`.
 * @see https://floating-ui.com/docs/flip
 */
const flip = flip$1;

/**
 * Provides data that allows you to change the size of the floating element —
 * for instance, prevent it from overflowing the clipping boundary or match the
 * width of the reference element.
 * @see https://floating-ui.com/docs/size
 */
const size = size$1;

/**
 * Provides data to hide the floating element in applicable situations, such as
 * when it is not in the same clipping context as the reference element.
 * @see https://floating-ui.com/docs/hide
 */
const hide = hide$1;

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
const arrow = arrow$1;

/**
 * Computes the `x` and `y` coordinates that will place the floating element
 * next to a given reference element.
 */
const computePosition = (reference, floating, options) => {
  // This caches the expensive `getClippingElementAncestors` function so that
  // multiple lifecycle resets re-use the same result. It only lives for a
  // single call. If other functions become expensive, we can add them as well.
  const cache = new Map();
  const mergedOptions = {
    platform,
    ...options,
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache,
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache,
  });
};

var PopperContext = createContext();
function usePopperContext() {
  const context = useContext(PopperContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `usePopperContext` must be used within a `Popper` component"
    );
  }
  return context;
}

// src/popper/popper-arrow.tsx
var _tmpl$$2 = /* @__PURE__ */ template(
  `<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">`
);
var DEFAULT_SIZE = 30;
var HALF_DEFAULT_SIZE = DEFAULT_SIZE / 2;
var ROTATION_DEG = {
  top: 180,
  right: -90,
  bottom: 0,
  left: 90,
};
function PopperArrow(props) {
  const context = usePopperContext();
  const mergedProps = mergeDefaultProps(
    {
      size: DEFAULT_SIZE,
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["ref", "style", "size"]);
  const dir = () => context.currentPlacement().split("-")[0];
  const contentStyle = createComputedStyle(context.contentRef);
  const fill = () =>
    contentStyle()?.getPropertyValue("background-color") || "none";
  const stroke = () =>
    contentStyle()?.getPropertyValue(`border-${dir()}-color`) || "none";
  const borderWidth = () =>
    contentStyle()?.getPropertyValue(`border-${dir()}-width`) || "0px";
  const strokeWidth = () => {
    return parseInt(borderWidth()) * 2 * (DEFAULT_SIZE / local.size);
  };
  const rotate = () => {
    return `rotate(${
      ROTATION_DEG[dir()]
    } ${HALF_DEFAULT_SIZE} ${HALF_DEFAULT_SIZE}) translate(0 2)`;
  };
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
        ref(r$) {
          const _ref$ = mergeRefs(context.setArrowRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        "aria-hidden": "true",
        get style() {
          return {
            // server side rendering
            position: "absolute",
            "font-size": `${local.size}px`,
            width: "1em",
            height: "1em",
            "pointer-events": "none",
            fill: fill(),
            stroke: stroke(),
            "stroke-width": strokeWidth(),
            ...local.style,
          };
        },
      },
      others,
      {
        get children() {
          const _el$ = _tmpl$$2(),
            _el$2 = _el$.firstChild;
          effect(() => setAttribute(_el$2, "transform", rotate()));
          return _el$;
        },
      }
    )
  );
}
function createComputedStyle(element) {
  const [style, setStyle] = createSignal();
  createEffect(() => {
    const el = element();
    el && setStyle(getWindow$1(el).getComputedStyle(el));
  });
  return style;
}
function PopperPositioner(props) {
  const context = usePopperContext();
  const [local, others] = splitProps(props, ["ref", "style"]);
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
        ref(r$) {
          const _ref$ = mergeRefs(context.setPositionerRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        "data-popper-positioner": "",
        get style() {
          return {
            position: "absolute",
            top: 0,
            left: 0,
            "min-width": "max-content",
            ...local.style,
          };
        },
      },
      others
    )
  );
}

// src/popper/utils.ts
function createDOMRect(anchorRect) {
  const { x = 0, y = 0, width = 0, height = 0 } = anchorRect ?? {};
  if (typeof DOMRect === "function") {
    return new DOMRect(x, y, width, height);
  }
  const rect = {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
  };
  return {
    ...rect,
    toJSON: () => rect,
  };
}
function getAnchorElement(anchor, getAnchorRect) {
  const contextElement = anchor;
  return {
    contextElement,
    getBoundingClientRect: () => {
      const anchorRect = getAnchorRect(anchor);
      if (anchorRect) {
        return createDOMRect(anchorRect);
      }
      if (anchor) {
        return anchor.getBoundingClientRect();
      }
      return createDOMRect();
    },
  };
}
function isValidPlacement(flip2) {
  return /^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(flip2);
}
var REVERSE_BASE_PLACEMENT = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};
function getTransformOrigin(placement, readingDirection) {
  const [basePlacement, alignment] = placement.split("-");
  const reversePlacement = REVERSE_BASE_PLACEMENT[basePlacement];
  if (!alignment) {
    return `${reversePlacement} center`;
  }
  if (basePlacement === "left" || basePlacement === "right") {
    return `${reversePlacement} ${alignment === "start" ? "top" : "bottom"}`;
  }
  if (alignment === "start") {
    return `${reversePlacement} ${
      readingDirection === "rtl" ? "right" : "left"
    }`;
  }
  return `${reversePlacement} ${readingDirection === "rtl" ? "left" : "right"}`;
}

// src/popper/popper-root.tsx
function PopperRoot(props) {
  const mergedProps = mergeDefaultProps(
    {
      getAnchorRect: (anchor) => anchor?.getBoundingClientRect(),
      placement: "bottom",
      gutter: 0,
      shift: 0,
      flip: true,
      slide: true,
      overlap: false,
      sameWidth: false,
      fitViewport: false,
      hideWhenDetached: false,
      detachedPadding: 0,
      arrowPadding: 4,
      overflowPadding: 8,
    },
    props
  );
  const [positionerRef, setPositionerRef] = createSignal();
  const [arrowRef, setArrowRef] = createSignal();
  const [currentPlacement, setCurrentPlacement] = createSignal(
    mergedProps.placement
  );
  const anchorRef = () =>
    getAnchorElement(mergedProps.anchorRef?.(), mergedProps.getAnchorRect);
  const { direction } = useLocale();
  async function updatePosition() {
    const referenceEl = anchorRef();
    const floatingEl = positionerRef();
    const arrowEl = arrowRef();
    if (!referenceEl || !floatingEl) {
      return;
    }
    const arrowOffset = (arrowEl?.clientHeight || 0) / 2;
    const finalGutter =
      typeof mergedProps.gutter === "number"
        ? mergedProps.gutter + arrowOffset
        : mergedProps.gutter ?? arrowOffset;
    floatingEl.style.setProperty(
      "--kb-popper-content-overflow-padding",
      `${mergedProps.overflowPadding}px`
    );
    referenceEl.getBoundingClientRect();
    const middleware = [
      // https://floating-ui.com/docs/offset
      offset(({ placement }) => {
        const hasAlignment = !!placement.split("-")[1];
        return {
          mainAxis: finalGutter,
          crossAxis: !hasAlignment ? mergedProps.shift : void 0,
          alignmentAxis: mergedProps.shift,
        };
      }),
    ];
    if (mergedProps.flip !== false) {
      const fallbackPlacements =
        typeof mergedProps.flip === "string"
          ? mergedProps.flip.split(" ")
          : void 0;
      if (
        fallbackPlacements !== void 0 &&
        !fallbackPlacements.every(isValidPlacement)
      ) {
        throw new Error("`flip` expects a spaced-delimited list of placements");
      }
      middleware.push(
        flip({
          padding: mergedProps.overflowPadding,
          fallbackPlacements,
        })
      );
    }
    if (mergedProps.slide || mergedProps.overlap) {
      middleware.push(
        shift({
          mainAxis: mergedProps.slide,
          crossAxis: mergedProps.overlap,
          padding: mergedProps.overflowPadding,
        })
      );
    }
    middleware.push(
      size({
        padding: mergedProps.overflowPadding,
        apply({ availableWidth, availableHeight, rects }) {
          const referenceWidth = Math.round(rects.reference.width);
          availableWidth = Math.floor(availableWidth);
          availableHeight = Math.floor(availableHeight);
          floatingEl.style.setProperty(
            "--kb-popper-anchor-width",
            `${referenceWidth}px`
          );
          floatingEl.style.setProperty(
            "--kb-popper-content-available-width",
            `${availableWidth}px`
          );
          floatingEl.style.setProperty(
            "--kb-popper-content-available-height",
            `${availableHeight}px`
          );
          if (mergedProps.sameWidth) {
            floatingEl.style.width = `${referenceWidth}px`;
          }
          if (mergedProps.fitViewport) {
            floatingEl.style.maxWidth = `${availableWidth}px`;
            floatingEl.style.maxHeight = `${availableHeight}px`;
          }
        },
      })
    );
    if (mergedProps.hideWhenDetached) {
      middleware.push(
        hide({
          padding: mergedProps.detachedPadding,
        })
      );
    }
    if (arrowEl) {
      middleware.push(
        arrow({
          element: arrowEl,
          padding: mergedProps.arrowPadding,
        })
      );
    }
    const pos = await computePosition(referenceEl, floatingEl, {
      placement: mergedProps.placement,
      strategy: "absolute",
      middleware,
      platform: {
        ...platform,
        isRTL: () => direction() === "rtl",
      },
    });
    setCurrentPlacement(pos.placement);
    mergedProps.onCurrentPlacementChange?.(pos.placement);
    if (!floatingEl) {
      return;
    }
    floatingEl.style.setProperty(
      "--kb-popper-content-transform-origin",
      getTransformOrigin(pos.placement, direction())
    );
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    let visibility;
    if (mergedProps.hideWhenDetached) {
      visibility = pos.middlewareData.hide?.referenceHidden
        ? "hidden"
        : "visible";
    }
    Object.assign(floatingEl.style, {
      top: "0",
      left: "0",
      transform: `translate3d(${x}px, ${y}px, 0)`,
      visibility,
    });
    if (arrowEl && pos.middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = pos.middlewareData.arrow;
      const dir = pos.placement.split("-")[0];
      Object.assign(arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        [dir]: "100%",
      });
    }
  }
  createEffect(() => {
    const referenceEl = anchorRef();
    const floatingEl = positionerRef();
    if (!referenceEl || !floatingEl) {
      return;
    }
    const cleanupAutoUpdate = autoUpdate(
      referenceEl,
      floatingEl,
      updatePosition,
      {
        // JSDOM doesn't support ResizeObserver
        elementResize: typeof ResizeObserver === "function",
      }
    );
    onCleanup(cleanupAutoUpdate);
  });
  createEffect(() => {
    const positioner = positionerRef();
    const content = mergedProps.contentRef?.();
    if (!positioner || !content) {
      return;
    }
    queueMicrotask(() => {
      positioner.style.zIndex = getComputedStyle(content).zIndex;
    });
  });
  const context = {
    currentPlacement,
    contentRef: () => mergedProps.contentRef?.(),
    setPositionerRef,
    setArrowRef,
  };
  return createComponent(PopperContext.Provider, {
    value: context,
    get children() {
      return mergedProps.children;
    },
  });
}

// src/popper/index.tsx
var Popper = Object.assign(PopperRoot, {
  Arrow: PopperArrow,
  Context: PopperContext,
  usePopperContext,
  Positioner: PopperPositioner,
});

// src/select/index.tsx
var select_exports = {};
__export(select_exports, {
  Arrow: () => PopperArrow,
  Content: () => SelectContent,
  Description: () => FormControlDescription,
  ErrorMessage: () => FormControlErrorMessage,
  HiddenSelect: () => SelectHiddenSelect,
  Icon: () => SelectIcon,
  Item: () => ListboxItem,
  ItemDescription: () => ListboxItemDescription,
  ItemIndicator: () => ListboxItemIndicator,
  ItemLabel: () => ListboxItemLabel,
  Label: () => SelectLabel,
  Listbox: () => SelectListbox,
  Portal: () => SelectPortal,
  Root: () => SelectRoot,
  Section: () => ListboxSection,
  Select: () => Select$1,
  Trigger: () => SelectTrigger,
  Value: () => SelectValue,
});
var SelectContext = createContext();
function useSelectContext() {
  const context = useContext(SelectContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useSelectContext` must be used within a `Select` component"
    );
  }
  return context;
}

// src/select/select-content.tsx
function SelectContent(props) {
  let ref;
  const context = useSelectContext();
  const [local, others] = splitProps(props, [
    "ref",
    "style",
    "onCloseAutoFocus",
    "onFocusOutside",
  ]);
  const onEscapeKeyDown = (e) => {
    context.close();
  };
  const onFocusOutside = (e) => {
    local.onFocusOutside?.(e);
    if (context.isOpen() && context.isModal()) {
      e.preventDefault();
    }
  };
  createHideOutside({
    isDisabled: () => !(context.isOpen() && context.isModal()),
    targets: () => (ref ? [ref] : []),
  });
  src_default$1({
    element: () => ref ?? null,
    enabled: () => context.isOpen() && context.preventScroll(),
  });
  createFocusScope(
    {
      trapFocus: () => context.isOpen() && context.isModal(),
      onMountAutoFocus: (e) => {
        e.preventDefault();
      },
      onUnmountAutoFocus: (e) => {
        local.onCloseAutoFocus?.(e);
        if (!e.defaultPrevented) {
          focusWithoutScrolling(context.triggerRef());
          e.preventDefault();
        }
      },
    },
    () => ref
  );
  return createComponent(Show, {
    get when() {
      return context.contentPresent();
    },
    get children() {
      return createComponent(Popper.Positioner, {
        get children() {
          return createComponent(
            DismissableLayer,
            mergeProps$1(
              {
                ref(r$) {
                  const _ref$ = mergeRefs((el) => {
                    context.setContentRef(el);
                    ref = el;
                  }, local.ref);
                  typeof _ref$ === "function" && _ref$(r$);
                },
                get disableOutsidePointerEvents() {
                  return memo(() => !!context.isModal())() && context.isOpen();
                },
                get excludedElements() {
                  return [context.triggerRef];
                },
                get style() {
                  return {
                    "--kb-select-content-transform-origin":
                      "var(--kb-popper-content-transform-origin)",
                    position: "relative",
                    ...local.style,
                  };
                },
                onEscapeKeyDown,
                onFocusOutside,
                get onDismiss() {
                  return context.close;
                },
              },
              () => context.dataset(),
              others
            )
          );
        },
      });
    },
  });
}
function SelectHiddenSelect(props) {
  const context = useSelectContext();
  return createComponent(
    HiddenSelectBase,
    mergeProps$1(
      {
        get collection() {
          return context.listState().collection();
        },
        get selectionManager() {
          return context.listState().selectionManager();
        },
        get isOpen() {
          return context.isOpen();
        },
        get isMultiple() {
          return context.isMultiple();
        },
        get isVirtualized() {
          return context.isVirtualized();
        },
        focusTrigger: () => context.triggerRef()?.focus(),
      },
      props
    )
  );
}
function SelectIcon(props) {
  const context = useSelectContext();
  const mergedProps = mergeDefaultProps(
    {
      children: "\u25BC",
    },
    props
  );
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "span",
        "aria-hidden": "true",
      },
      () => context.dataset(),
      mergedProps
    )
  );
}
function SelectLabel(props) {
  const context = useSelectContext();
  const [local, others] = splitProps(props, ["onClick"]);
  const onClick = (e) => {
    callHandler(e, local.onClick);
    if (!context.isDisabled()) {
      context.triggerRef()?.focus();
    }
  };
  return createComponent(
    FormControlLabel,
    mergeProps$1(
      {
        as: "span",
        onClick,
      },
      others
    )
  );
}
function SelectListbox(props) {
  const context = useSelectContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("listbox"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["ref", "id", "onKeyDown"]);
  createEffect(() => onCleanup(context.registerListboxId(local.id)));
  const onKeyDown = (e) => {
    callHandler(e, local.onKeyDown);
    if (e.key === "Escape") {
      e.preventDefault();
    }
  };
  return createComponent(
    ListboxRoot,
    mergeProps$1(
      {
        ref(r$) {
          const _ref$ = mergeRefs(context.setListboxRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        get id() {
          return local.id;
        },
        get state() {
          return context.listState();
        },
        get virtualized() {
          return context.isVirtualized();
        },
        get autoFocus() {
          return context.autoFocus();
        },
        shouldSelectOnPressUp: true,
        shouldFocusOnHover: true,
        get shouldFocusWrap() {
          return context.shouldFocusWrap();
        },
        get disallowTypeAhead() {
          return context.disallowTypeAhead();
        },
        get ["aria-labelledby"]() {
          return context.listboxAriaLabelledBy();
        },
        get renderItem() {
          return context.renderItem;
        },
        get renderSection() {
          return context.renderSection;
        },
        onKeyDown,
      },
      others
    )
  );
}
function SelectPortal(props) {
  const context = useSelectContext();
  return createComponent(Show, {
    get when() {
      return context.contentPresent();
    },
    get children() {
      return createComponent(Portal, props);
    },
  });
}
function SelectBase(props) {
  const defaultId = `select-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
      selectionMode: "single",
      disallowEmptySelection: false,
      closeOnSelection: props.selectionMode === "single",
      allowDuplicateSelectionEvents: true,
      gutter: 8,
      sameWidth: true,
      modal: false,
    },
    props
  );
  const [local, popperProps, formControlProps, others] = splitProps(
    mergedProps,
    [
      "itemComponent",
      "sectionComponent",
      "open",
      "defaultOpen",
      "onOpenChange",
      "value",
      "defaultValue",
      "onChange",
      "placeholder",
      "options",
      "optionValue",
      "optionTextValue",
      "optionDisabled",
      "optionGroupChildren",
      "keyboardDelegate",
      "allowDuplicateSelectionEvents",
      "disallowEmptySelection",
      "closeOnSelection",
      "disallowTypeAhead",
      "shouldFocusWrap",
      "selectionBehavior",
      "selectionMode",
      "virtualized",
      "modal",
      "preventScroll",
      "forceMount",
    ],
    [
      "getAnchorRect",
      "placement",
      "gutter",
      "shift",
      "flip",
      "slide",
      "overlap",
      "sameWidth",
      "fitViewport",
      "hideWhenDetached",
      "detachedPadding",
      "arrowPadding",
      "overflowPadding",
    ],
    FORM_CONTROL_PROP_NAMES
  );
  const [triggerId, setTriggerId] = createSignal();
  const [valueId, setValueId] = createSignal();
  const [listboxId, setListboxId] = createSignal();
  const [triggerRef, setTriggerRef] = createSignal();
  const [contentRef, setContentRef] = createSignal();
  const [listboxRef, setListboxRef] = createSignal();
  const [listboxAriaLabelledBy, setListboxAriaLabelledBy] = createSignal();
  const [focusStrategy, setFocusStrategy] = createSignal(true);
  const getOptionValue = (option) => {
    const optionValue = local.optionValue;
    if (optionValue == null) {
      return String(option);
    }
    return String(
      isFunction(optionValue) ? optionValue(option) : option[optionValue]
    );
  };
  const flattenOptions = createMemo(() => {
    const optionGroupChildren = local.optionGroupChildren;
    if (optionGroupChildren == null) {
      return local.options;
    }
    return local.options.flatMap((item) => item[optionGroupChildren] ?? item);
  });
  const flattenOptionKeys = createMemo(() => {
    return flattenOptions().map((option) => getOptionValue(option));
  });
  const getOptionsFromValues = (values) => {
    return [...values]
      .map((value) =>
        flattenOptions().find((option) => getOptionValue(option) === value)
      )
      .filter((option) => option != null);
  };
  const disclosureState = createDisclosureState({
    open: () => local.open,
    defaultOpen: () => local.defaultOpen,
    onOpenChange: (isOpen) => local.onOpenChange?.(isOpen),
  });
  const listState = createListState({
    selectedKeys: () => {
      if (local.value != null) {
        return local.value.map(getOptionValue);
      }
      return local.value;
    },
    defaultSelectedKeys: () => {
      if (local.defaultValue != null) {
        return local.defaultValue.map(getOptionValue);
      }
      return local.defaultValue;
    },
    onSelectionChange: (selectedKeys) => {
      local.onChange?.(getOptionsFromValues(selectedKeys));
      if (local.closeOnSelection) {
        close();
      }
    },
    allowDuplicateSelectionEvents: () =>
      access$1(local.allowDuplicateSelectionEvents),
    disallowEmptySelection: () => access$1(local.disallowEmptySelection),
    selectionBehavior: () => access$1(local.selectionBehavior),
    selectionMode: () => local.selectionMode,
    dataSource: () => local.options ?? [],
    getKey: () => local.optionValue,
    getTextValue: () => local.optionTextValue,
    getDisabled: () => local.optionDisabled,
    getSectionChildren: () => local.optionGroupChildren,
  });
  const selectedOptions = createMemo(() => {
    return getOptionsFromValues(listState.selectionManager().selectedKeys());
  });
  const removeOptionFromSelection = (option) => {
    listState.selectionManager().toggleSelection(getOptionValue(option));
  };
  const { present: contentPresent } = src_default({
    show: () => local.forceMount || disclosureState.isOpen(),
    element: () => contentRef() ?? null,
  });
  const focusListbox = () => {
    const listboxEl = listboxRef();
    if (listboxEl) {
      focusWithoutScrolling(listboxEl);
    }
  };
  const open = (focusStrategy2) => {
    if (local.options.length <= 0) {
      return;
    }
    setFocusStrategy(focusStrategy2);
    disclosureState.open();
    let focusedKey = listState.selectionManager().firstSelectedKey();
    if (focusedKey == null) {
      if (focusStrategy2 === "first") {
        focusedKey = listState.collection().getFirstKey();
      } else if (focusStrategy2 === "last") {
        focusedKey = listState.collection().getLastKey();
      }
    }
    focusListbox();
    listState.selectionManager().setFocused(true);
    listState.selectionManager().setFocusedKey(focusedKey);
  };
  const close = () => {
    disclosureState.close();
    listState.selectionManager().setFocused(false);
    listState.selectionManager().setFocusedKey(void 0);
  };
  const toggle = (focusStrategy2) => {
    if (disclosureState.isOpen()) {
      close();
    } else {
      open(focusStrategy2);
    }
  };
  const { formControlContext } = createFormControl(formControlProps);
  createFormResetListener(triggerRef, () => {
    const defaultSelectedKeys = local.defaultValue
      ? [...local.defaultValue].map(getOptionValue)
      : new Selection();
    listState.selectionManager().setSelectedKeys(defaultSelectedKeys);
  });
  const collator = createCollator({
    usage: "search",
    sensitivity: "base",
  });
  const delegate = createMemo(() => {
    const keyboardDelegate = access$1(local.keyboardDelegate);
    if (keyboardDelegate) {
      return keyboardDelegate;
    }
    return new ListKeyboardDelegate(listState.collection, void 0, collator);
  });
  const renderItem = (item) => {
    return local.itemComponent?.({
      item,
    });
  };
  const renderSection = (section) => {
    return local.sectionComponent?.({
      section,
    });
  };
  createEffect(
    on(
      [flattenOptionKeys],
      ([flattenOptionKeys2]) => {
        const currentSelectedKeys = [
          ...listState.selectionManager().selectedKeys(),
        ];
        const keysToKeep = currentSelectedKeys.filter((key) =>
          flattenOptionKeys2.includes(key)
        );
        listState.selectionManager().setSelectedKeys(keysToKeep);
      },
      {
        defer: true,
      }
    )
  );
  const dataset = createMemo(() => ({
    "data-expanded": disclosureState.isOpen() ? "" : void 0,
    "data-closed": !disclosureState.isOpen() ? "" : void 0,
  }));
  const context = {
    dataset,
    isOpen: disclosureState.isOpen,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    isMultiple: () => access$1(local.selectionMode) === "multiple",
    isVirtualized: () => local.virtualized ?? false,
    isModal: () => local.modal ?? false,
    preventScroll: () => local.preventScroll ?? context.isModal(),
    disallowTypeAhead: () => local.disallowTypeAhead ?? false,
    shouldFocusWrap: () => local.shouldFocusWrap ?? false,
    selectedOptions,
    contentPresent,
    autoFocus: focusStrategy,
    triggerRef,
    listState: () => listState,
    keyboardDelegate: delegate,
    triggerId,
    valueId,
    listboxId,
    listboxAriaLabelledBy,
    setListboxAriaLabelledBy,
    setTriggerRef,
    setContentRef,
    setListboxRef,
    open,
    close,
    toggle,
    placeholder: () => local.placeholder,
    renderItem,
    renderSection,
    removeOptionFromSelection,
    generateId: createGenerateId(() => access$1(formControlProps.id)),
    registerTriggerId: createRegisterId(setTriggerId),
    registerValueId: createRegisterId(setValueId),
    registerListboxId: createRegisterId(setListboxId),
  };
  return createComponent(FormControlContext.Provider, {
    value: formControlContext,
    get children() {
      return createComponent(SelectContext.Provider, {
        value: context,
        get children() {
          return createComponent(
            Popper,
            mergeProps$1(
              {
                anchorRef: triggerRef,
                contentRef,
              },
              popperProps,
              {
                get children() {
                  return createComponent(
                    Polymorphic,
                    mergeProps$1(
                      {
                        as: "div",
                        role: "group",
                        get id() {
                          return access$1(formControlProps.id);
                        },
                      },
                      () => formControlContext.dataset(),
                      dataset,
                      others
                    )
                  );
                },
              }
            )
          );
        },
      });
    },
  });
}

// src/select/select-root.tsx
function SelectRoot(props) {
  const [local, others] = splitProps(props, [
    "value",
    "defaultValue",
    "onChange",
    "multiple",
  ]);
  const value = createMemo(() => {
    if (local.value != null) {
      return local.multiple ? local.value : [local.value];
    }
    return local.value;
  });
  const defaultValue = createMemo(() => {
    if (local.defaultValue != null) {
      return local.multiple ? local.defaultValue : [local.defaultValue];
    }
    return local.defaultValue;
  });
  const onChange = (value2) => {
    if (local.multiple) {
      local.onChange?.(value2);
    } else {
      local.onChange?.(value2[0] ?? null);
    }
  };
  return createComponent(
    SelectBase,
    mergeProps$1(
      {
        get value() {
          return value();
        },
        get defaultValue() {
          return defaultValue();
        },
        onChange,
        get selectionMode() {
          return local.multiple ? "multiple" : "single";
        },
      },
      others
    )
  );
}
function SelectTrigger(props) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("trigger"),
    },
    props
  );
  const [local, formControlFieldProps, others] = splitProps(
    mergedProps,
    [
      "ref",
      "disabled",
      "onPointerDown",
      "onClick",
      "onKeyDown",
      "onFocus",
      "onBlur",
    ],
    FORM_CONTROL_FIELD_PROP_NAMES
  );
  const selectionManager = () => context.listState().selectionManager();
  const keyboardDelegate = () => context.keyboardDelegate();
  const isDisabled = () => local.disabled || context.isDisabled();
  const { fieldProps } = createFormControlField(formControlFieldProps);
  const { typeSelectHandlers } = createTypeSelect({
    keyboardDelegate,
    selectionManager,
    onTypeSelect: (key) => selectionManager().select(key),
  });
  const ariaLabelledBy = () => {
    return (
      [context.listboxAriaLabelledBy(), context.valueId()]
        .filter(Boolean)
        .join(" ") || void 0
    );
  };
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    e.currentTarget.dataset.pointerType = e.pointerType;
    if (!isDisabled() && e.pointerType !== "touch" && e.button === 0) {
      e.preventDefault();
      context.toggle(true);
    }
  };
  const onClick = (e) => {
    callHandler(e, local.onClick);
    if (!isDisabled() && e.currentTarget.dataset.pointerType === "touch") {
      context.toggle(true);
    }
  };
  const onKeyDown = (e) => {
    callHandler(e, local.onKeyDown);
    if (isDisabled()) {
      return;
    }
    callHandler(e, typeSelectHandlers.onKeyDown);
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("first");
        break;
      case "ArrowUp":
        e.stopPropagation();
        e.preventDefault();
        context.toggle("last");
        break;
      case "ArrowLeft": {
        e.preventDefault();
        if (context.isMultiple()) {
          return;
        }
        const firstSelectedKey = selectionManager().firstSelectedKey();
        const key =
          firstSelectedKey != null
            ? keyboardDelegate().getKeyAbove?.(firstSelectedKey)
            : keyboardDelegate().getFirstKey?.();
        if (key != null) {
          selectionManager().select(key);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (context.isMultiple()) {
          return;
        }
        const firstSelectedKey = selectionManager().firstSelectedKey();
        const key =
          firstSelectedKey != null
            ? keyboardDelegate().getKeyBelow?.(firstSelectedKey)
            : keyboardDelegate().getFirstKey?.();
        if (key != null) {
          selectionManager().select(key);
        }
        break;
      }
    }
  };
  const onFocus = (e) => {
    callHandler(e, local.onFocus);
    if (selectionManager().isFocused()) {
      return;
    }
    selectionManager().setFocused(true);
  };
  const onBlur = (e) => {
    callHandler(e, local.onBlur);
    if (context.isOpen()) {
      return;
    }
    selectionManager().setFocused(false);
  };
  createEffect(() => onCleanup(context.registerTriggerId(fieldProps.id())));
  createEffect(() => {
    context.setListboxAriaLabelledBy(
      [
        fieldProps.ariaLabelledBy(),
        fieldProps.ariaLabel() && !fieldProps.ariaLabelledBy()
          ? fieldProps.id()
          : null,
      ]
        .filter(Boolean)
        .join(" ") || void 0
    );
  });
  return createComponent(
    ButtonRoot,
    mergeProps$1(
      {
        ref(r$) {
          const _ref$ = mergeRefs(context.setTriggerRef, local.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        get id() {
          return fieldProps.id();
        },
        get disabled() {
          return isDisabled();
        },
        "aria-haspopup": "listbox",
        get ["aria-expanded"]() {
          return context.isOpen();
        },
        get ["aria-controls"]() {
          return memo(() => !!context.isOpen())()
            ? context.listboxId()
            : void 0;
        },
        get ["aria-label"]() {
          return fieldProps.ariaLabel();
        },
        get ["aria-labelledby"]() {
          return ariaLabelledBy();
        },
        get ["aria-describedby"]() {
          return fieldProps.ariaDescribedBy();
        },
        onPointerDown,
        onClick,
        onKeyDown,
        onFocus,
        onBlur,
      },
      () => context.dataset(),
      () => formControlContext.dataset(),
      others
    )
  );
}
function SelectValue(props) {
  const formControlContext = useFormControlContext();
  const context = useSelectContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("value"),
    },
    props
  );
  const [local, others] = splitProps(mergedProps, ["id", "children"]);
  const selectionManager = () => context.listState().selectionManager();
  const isSelectionEmpty = () => {
    const selectedKeys = selectionManager().selectedKeys();
    if (selectedKeys.size === 1 && selectedKeys.has("")) {
      return true;
    }
    return selectionManager().isEmpty();
  };
  createEffect(() => onCleanup(context.registerValueId(local.id)));
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "span",
        get id() {
          return local.id;
        },
        get ["data-placeholder-shown"]() {
          return isSelectionEmpty() ? "" : void 0;
        },
      },
      () => formControlContext.dataset(),
      others,
      {
        get children() {
          return createComponent(Show, {
            get when() {
              return !isSelectionEmpty();
            },
            get fallback() {
              return context.placeholder();
            },
            get children() {
              return createComponent(SelectValueChild, {
                state: {
                  selectedOption: () => context.selectedOptions()[0],
                  selectedOptions: () => context.selectedOptions(),
                  remove: (option) => context.removeOptionFromSelection(option),
                  clear: () => selectionManager().clearSelection(),
                },
                get children() {
                  return local.children;
                },
              });
            },
          });
        },
      }
    )
  );
}
function SelectValueChild(props) {
  const resolvedChildren = children(() => {
    const body = props.children;
    return isFunction(body) ? body(props.state) : body;
  });
  return memo(resolvedChildren);
}

// src/select/index.tsx
var Select$1 = Object.assign(SelectRoot, {
  Arrow: PopperArrow,
  Content: SelectContent,
  Description: FormControlDescription,
  ErrorMessage: FormControlErrorMessage,
  HiddenSelect: SelectHiddenSelect,
  Icon: SelectIcon,
  Item: ListboxItem,
  ItemDescription: ListboxItemDescription,
  ItemIndicator: ListboxItemIndicator,
  ItemLabel: ListboxItemLabel,
  Label: SelectLabel,
  Listbox: SelectListbox,
  Portal: SelectPortal,
  Section: ListboxSection,
  Trigger: SelectTrigger,
  Value: SelectValue,
});

var _tmpl$$1 = /*#__PURE__*/ template(
    `<svg xmlns=http://www.w3.org/2000/svg class="h-5 w-5 p-0.5"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M8 9l4 -4l4 4"></path><path d="M16 15l-4 4l-4 -4">`
  ),
  _tmpl$2 = /*#__PURE__*/ template(
    `<svg xmlns=http://www.w3.org/2000/svg class="h-4 w-4"viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=3 stroke-linecap=round stroke-linejoin=round><path stroke=none d="M0 0h24v24H0z"fill=none></path><path d="M5 12l5 5l10 -10">`
  );
function Select(p) {
  const selectedValue = () => p.options.find((so) => so.value === p.value);
  const onChangeHandler = (so) => so !== null && p.onChange(so.value);
  return createComponent(Select$1, {
    get value() {
      return selectedValue();
    },
    onChange: onChangeHandler,
    get options() {
      return p.options;
    },
    optionValue: "value",
    optionTextValue: "label",
    get placeholder() {
      return p.placeholder ?? "Unselected";
    },
    class:
      "inline-flex w-[200px] flex-col align-middle text-base-content data-[width=true]:w-full",
    get ["data-width"]() {
      return p.fullWidth;
    },
    itemComponent: (props) =>
      createComponent(Select$1.Item, {
        get item() {
          return props.item;
        },
        class:
          "ui-never-focusable ui-hoverable flex cursor-pointer select-none items-center justify-between rounded bg-base-100 py-2 pl-4 pr-4 text-base font-400 focus-visible:bg-base-200",
        get children() {
          return [
            createComponent(Select$1.ItemLabel, {
              class: "truncate pr-2",
              get children() {
                return props.item.rawValue.label;
              },
            }),
            createComponent(Select$1.ItemIndicator, {
              get children() {
                return _tmpl$2();
              },
            }),
          ];
        },
      }),
    get children() {
      return [
        createComponent(Show, {
          get when() {
            return p.label;
          },
          keyed: true,
          children: (keyedLabel) => {
            return createComponent(Select$1.Label, {
              class: "pb-1 text-sm text-base-content",
              get ["data-intent"]() {
                return p.intent;
              },
              children: keyedLabel,
            });
          },
        }),
        createComponent(Select$1.Trigger, {
          "aria-label": "Fruit",
          class:
            "ui-focusable inline-flex w-full select-none items-center justify-between rounded border border-base-300 bg-base-100 py-2 pl-4 pr-2 align-middle text-base font-400",
          get children() {
            return [
              createComponent(Select$1.Value, {
                class: "truncate pr-2 ui-placeholder-shown:text-danger",
                children: (state) => state.selectedOption().label,
              }),
              createComponent(Select$1.Icon, {
                get children() {
                  return _tmpl$$1();
                },
              }),
            ];
          },
        }),
        createComponent(Select$1.Portal, {
          get children() {
            return createComponent(Select$1.Content, {
              class: "rounded bg-base-100 shadow-lg",
              get children() {
                return createComponent(Select$1.Listbox, {
                  class: "max-h-[300px] overflow-y-auto",
                });
              },
            });
          },
        }),
      ];
    },
  });
}

var DomCollectionContext = createContext();
function useOptionalDomCollectionContext() {
  return useContext(DomCollectionContext);
}
function useDomCollectionContext() {
  const context = useOptionalDomCollectionContext();
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component"
    );
  }
  return context;
}
function isElementPreceding(a, b) {
  return Boolean(
    b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING
  );
}
function findDOMIndex(items, item) {
  const itemEl = item.ref();
  if (!itemEl) {
    return -1;
  }
  let length = items.length;
  if (!length) {
    return -1;
  }
  while (length--) {
    const currentItemEl = items[length]?.ref();
    if (!currentItemEl) {
      continue;
    }
    if (isElementPreceding(currentItemEl, itemEl)) {
      return length + 1;
    }
  }
  return 0;
}
function sortBasedOnDOMPosition(items) {
  const pairs = items.map((item, index) => [index, item]);
  let isOrderDifferent = false;
  pairs.sort(([indexA, a], [indexB, b]) => {
    const elementA = a.ref();
    const elementB = b.ref();
    if (elementA === elementB) {
      return 0;
    }
    if (!elementA || !elementB) {
      return 0;
    }
    if (isElementPreceding(elementA, elementB)) {
      if (indexA > indexB) {
        isOrderDifferent = true;
      }
      return -1;
    }
    if (indexA < indexB) {
      isOrderDifferent = true;
    }
    return 1;
  });
  if (isOrderDifferent) {
    return pairs.map(([_, item]) => item);
  }
  return items;
}
function setItemsBasedOnDOMPosition(items, setItems) {
  const sortedItems = sortBasedOnDOMPosition(items);
  if (items !== sortedItems) {
    setItems(sortedItems);
  }
}
function getCommonParent(items) {
  const firstItem = items[0];
  const lastItemEl = items[items.length - 1]?.ref();
  let parentEl = firstItem?.ref()?.parentElement;
  while (parentEl) {
    if (lastItemEl && parentEl.contains(lastItemEl)) {
      return parentEl;
    }
    parentEl = parentEl.parentElement;
  }
  return getDocument(parentEl).body;
}
function createTimeoutObserver(items, setItems) {
  createEffect(() => {
    const timeout = setTimeout(() => {
      setItemsBasedOnDOMPosition(items(), setItems);
    });
    onCleanup(() => clearTimeout(timeout));
  });
}
function createSortBasedOnDOMPosition(items, setItems) {
  if (typeof IntersectionObserver !== "function") {
    createTimeoutObserver(items, setItems);
    return;
  }
  let previousItems = [];
  createEffect(() => {
    const callback = () => {
      const hasPreviousItems = !!previousItems.length;
      previousItems = items();
      if (!hasPreviousItems) {
        return;
      }
      setItemsBasedOnDOMPosition(items(), setItems);
    };
    const root = getCommonParent(items());
    const observer = new IntersectionObserver(callback, {
      root,
    });
    for (const item of items()) {
      const itemEl = item.ref();
      if (itemEl) {
        observer.observe(itemEl);
      }
    }
    onCleanup(() => observer.disconnect());
  });
}

// src/primitives/create-dom-collection/create-dom-collection.ts
function createDomCollection(props = {}) {
  const [items, setItems] = createControllableArraySignal({
    value: () => access$1(props.items),
    onChange: (value) => props.onItemsChange?.(value),
  });
  createSortBasedOnDOMPosition(items, setItems);
  const registerItem = (item) => {
    setItems((prevItems) => {
      const index = findDOMIndex(prevItems, item);
      return addItemToArray(prevItems, item, index);
    });
    return () => {
      setItems((prevItems) => {
        const nextItems = prevItems.filter(
          (prevItem) => prevItem.ref() !== item.ref()
        );
        if (prevItems.length === nextItems.length) {
          return prevItems;
        }
        return nextItems;
      });
    };
  };
  const DomCollectionProvider = (props2) => {
    return createComponent$1(DomCollectionContext.Provider, {
      value: {
        registerItem,
      },
      get children() {
        return props2.children;
      },
    });
  };
  return {
    DomCollectionProvider,
  };
}
function createDomCollectionItem(props) {
  const context = useDomCollectionContext();
  const mergedProps = mergeDefaultProps(
    {
      shouldRegisterItem: true,
    },
    props
  );
  createEffect(() => {
    if (!mergedProps.shouldRegisterItem) {
      return;
    }
    const unregister = context.registerItem(mergedProps.getItem());
    onCleanup(unregister);
  });
}

// src/slider/index.tsx
var slider_exports = {};
__export(slider_exports, {
  Description: () => FormControlDescription,
  ErrorMessage: () => FormControlErrorMessage,
  Fill: () => SliderFill,
  Input: () => SliderInput,
  Label: () => FormControlLabel,
  Root: () => SliderRoot,
  Slider: () => Slider$1,
  Thumb: () => SliderThumb,
  Track: () => SliderTrack,
  ValueLabel: () => SliderValueLabel,
});
var SliderContext = createContext();
function useSliderContext() {
  const context = useContext(SliderContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useSliderContext` must be used within a `Slider.Root` component"
    );
  }
  return context;
}

// src/slider/slider-fill.tsx
function SliderFill(props) {
  const context = useSliderContext();
  const [local, others] = splitProps(props, ["style"]);
  const percentages = () => {
    return context.state
      .values()
      .map((value) => context.state.getValuePercent(value) * 100);
  };
  const offsetStart = () => {
    return context.state.values().length > 1 ? Math.min(...percentages()) : 0;
  };
  const offsetEnd = () => {
    return 100 - Math.max(...percentages());
  };
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
        get style() {
          return {
            [context.startEdge()]: `${offsetStart()}%`,
            [context.endEdge()]: `${offsetEnd()}%`,
            ...local.style,
          };
        },
      },
      () => context.dataset(),
      others
    )
  );
}
function SliderThumb(props) {
  let ref;
  const context = useSliderContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId(`thumb-${createUniqueId()}`),
    },
    props
  );
  const [local, formControlFieldProps, others] = splitProps(
    mergedProps,
    [
      "ref",
      "style",
      "onKeyDown",
      "onPointerDown",
      "onPointerMove",
      "onPointerUp",
      "onFocus",
      "onBlur",
    ],
    FORM_CONTROL_FIELD_PROP_NAMES
  );
  const { fieldProps } = createFormControlField(formControlFieldProps);
  createDomCollectionItem({
    getItem: () => ({
      ref: () => ref,
      disabled: context.state.isDisabled(),
      key: fieldProps.id(),
      textValue: "",
      type: "item",
    }),
  });
  const index = () =>
    ref ? context.thumbs().findIndex((v) => v.ref() === ref) : -1;
  const value = () => context.state.getThumbValue(index());
  const position = () => {
    return context.state.getThumbPercent(index());
  };
  const transform = () => {
    return context.state.orientation() === "vertical"
      ? "translateY(50%)"
      : "translateX(-50%)";
  };
  let startPosition = 0;
  const onKeyDown = (e) => {
    callHandler(e, local.onKeyDown);
    context.onStepKeyDown(e, index());
  };
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    const target = e.currentTarget;
    e.preventDefault();
    e.stopPropagation();
    target.setPointerCapture(e.pointerId);
    target.focus();
    startPosition =
      context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    if (value() !== void 0) {
      context.onSlideStart?.(index(), value());
    }
  };
  const onPointerMove = (e) => {
    e.stopPropagation();
    callHandler(e, local.onPointerMove);
    const target = e.currentTarget;
    if (target.hasPointerCapture(e.pointerId)) {
      const delta = {
        deltaX: e.clientX - startPosition,
        deltaY: e.clientY - startPosition,
      };
      context.onSlideMove?.(delta);
      startPosition =
        context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    }
  };
  const onPointerUp = (e) => {
    e.stopPropagation();
    callHandler(e, local.onPointerUp);
    const target = e.currentTarget;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      context.onSlideEnd?.();
    }
  };
  const onFocus = (e) => {
    callHandler(e, local.onFocus);
    context.state.setFocusedThumb(index());
  };
  const onBlur = (e) => {
    callHandler(e, local.onBlur);
    context.state.setFocusedThumb(void 0);
  };
  onMount(() => {
    context.state.setThumbEditable(index(), !context.state.isDisabled());
  });
  return createComponent(ThumbContext.Provider, {
    value: {
      index,
    },
    get children() {
      return createComponent(
        Polymorphic,
        mergeProps$1(
          {
            as: "span",
            ref(r$) {
              const _ref$ = mergeRefs((el) => (ref = el), local.ref);
              typeof _ref$ === "function" && _ref$(r$);
            },
            role: "slider",
            get id() {
              return fieldProps.id();
            },
            get tabIndex() {
              return context.state.isDisabled() ? void 0 : 0;
            },
            get style() {
              return {
                display: value() === void 0 ? "none" : void 0,
                position: "absolute",
                [context.startEdge()]: `calc(${position() * 100}%)`,
                transform: transform(),
                "touch-action": "none",
                ...local.style,
              };
            },
            get ["aria-valuetext"]() {
              return context.state.getThumbValueLabel(index());
            },
            get ["aria-valuemin"]() {
              return context.minValue();
            },
            get ["aria-valuenow"]() {
              return value();
            },
            get ["aria-valuemax"]() {
              return context.maxValue();
            },
            get ["aria-orientation"]() {
              return context.state.orientation();
            },
            get ["aria-label"]() {
              return fieldProps.ariaLabel();
            },
            get ["aria-labelledby"]() {
              return fieldProps.ariaLabelledBy();
            },
            get ["aria-describedby"]() {
              return fieldProps.ariaDescribedBy();
            },
            onKeyDown,
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onFocus,
            onBlur,
          },
          () => context.dataset(),
          others
        )
      );
    },
  });
}
var ThumbContext = createContext();
function useThumbContext() {
  const context = useContext(ThumbContext);
  if (context === void 0) {
    throw new Error(
      "[kobalte]: `useThumbContext` must be used within a `Slider.Thumb` component"
    );
  }
  return context;
}

// src/slider/slider-input.tsx
var _tmpl$ = /* @__PURE__ */ template(`<input type="range">`);
function SliderInput(props) {
  const formControlContext = useFormControlContext();
  const context = useSliderContext();
  const thumb = useThumbContext();
  const mergedProps = mergeDefaultProps(
    {
      id: context.generateId("input"),
    },
    props
  );
  const [local, formControlFieldProps, others] = splitProps(
    mergedProps,
    ["style", "onChange"],
    FORM_CONTROL_FIELD_PROP_NAMES
  );
  const { fieldProps } = createFormControlField(formControlFieldProps);
  const [valueText, setValueText] = createSignal("");
  const onChange = (e) => {
    callHandler(e, local.onChange);
    const target = e.target;
    context.state.setThumbValue(thumb.index(), parseFloat(target.value));
    target.value = String(context.state.values()[thumb.index()]) ?? "";
  };
  createEffect(() => {
    setValueText(
      thumb.index() === -1
        ? ""
        : context.state.getThumbValueLabel(thumb.index())
    );
  });
  return (() => {
    const _el$ = _tmpl$();
    _el$.addEventListener("change", onChange);
    spread(
      _el$,
      mergeProps$1(
        {
          get id() {
            return fieldProps.id();
          },
          get name() {
            return formControlContext.name();
          },
          get tabIndex() {
            return context.state.isDisabled() ? void 0 : -1;
          },
          get min() {
            return context.state.getThumbMinValue(thumb.index());
          },
          get max() {
            return context.state.getThumbMaxValue(thumb.index());
          },
          get step() {
            return context.state.step();
          },
          get value() {
            return context.state.values()[thumb.index()];
          },
          get required() {
            return formControlContext.isRequired();
          },
          get disabled() {
            return formControlContext.isDisabled();
          },
          get readonly() {
            return formControlContext.isReadOnly();
          },
          get style() {
            return {
              ...visuallyHiddenStyles,
              ...local.style,
            };
          },
          get ["aria-orientation"]() {
            return context.state.orientation();
          },
          get ["aria-valuetext"]() {
            return valueText();
          },
          get ["aria-label"]() {
            return fieldProps.ariaLabel();
          },
          get ["aria-labelledby"]() {
            return fieldProps.ariaLabelledBy();
          },
          get ["aria-describedby"]() {
            return fieldProps.ariaDescribedBy();
          },
          get ["aria-invalid"]() {
            return formControlContext.validationState() === "invalid" || void 0;
          },
          get ["aria-required"]() {
            return formControlContext.isRequired() || void 0;
          },
          get ["aria-disabled"]() {
            return formControlContext.isDisabled() || void 0;
          },
          get ["aria-readonly"]() {
            return formControlContext.isReadOnly() || void 0;
          },
        },
        () => context.dataset(),
        others
      ),
      false,
      false
    );
    return _el$;
  })();
}

// src/slider/utils.ts
function getNextSortedValues(prevValues, nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  const closestIndex = distances.indexOf(closestDistance);
  return nextValue < values[closestIndex]
    ? closestIndex
    : distances.lastIndexOf(closestDistance);
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function stopEventDefaultAndPropagation(event) {
  event.preventDefault();
  event.stopPropagation();
}

// src/slider/create-slider-state.ts
function createSliderState(props) {
  let dirty = false;
  const mergedProps = mergeDefaultProps(
    {
      minValue: () => 0,
      maxValue: () => 100,
      step: () => 1,
      minStepsBetweenThumbs: () => 0,
      orientation: () => "horizontal",
      isDisabled: () => false,
    },
    props
  );
  const pageSize = createMemo(() => {
    let calcPageSize = (mergedProps.maxValue() - mergedProps.minValue()) / 10;
    calcPageSize = snapValueToStep(
      calcPageSize,
      0,
      calcPageSize + mergedProps.step(),
      mergedProps.step()
    );
    return Math.max(calcPageSize, mergedProps.step());
  });
  const defaultValue = createMemo(() => {
    return mergedProps.defaultValue() ?? [mergedProps.minValue()];
  });
  const [values, setValues] = createControllableArraySignal({
    value: () => mergedProps.value(),
    defaultValue,
    onChange: (values2) => mergedProps.onChange?.(values2),
  });
  const [isDragging, setIsDragging] = createSignal(
    new Array(values().length).fill(false)
  );
  const [isEditables, setEditables] = createSignal(
    new Array(values().length).fill(false)
  );
  const [focusedIndex, setFocusedIndex] = createSignal(void 0);
  const resetValues = () => {
    setValues(defaultValue());
  };
  const getValuePercent = (value) => {
    return (
      (value - mergedProps.minValue()) /
      (mergedProps.maxValue() - mergedProps.minValue())
    );
  };
  const getThumbMinValue = (index) => {
    return index === 0
      ? props.minValue()
      : values()[index - 1] + props.minStepsBetweenThumbs() * props.step();
  };
  const getThumbMaxValue = (index) => {
    return index === values().length - 1
      ? props.maxValue()
      : values()[index + 1] - props.minStepsBetweenThumbs() * props.step();
  };
  const isThumbEditable = (index) => {
    return isEditables()[index];
  };
  const setThumbEditable = (index) => {
    setEditables((p) => {
      p[index] = true;
      return p;
    });
  };
  const updateValue = (index, value) => {
    if (mergedProps.isDisabled() || !isThumbEditable(index)) return;
    const snappedValue = snapValueToStep(
      value,
      getThumbMinValue(index),
      getThumbMaxValue(index),
      mergedProps.step()
    );
    const nextValues = getNextSortedValues(values(), snappedValue, index);
    if (
      !hasMinStepsBetweenValues(
        nextValues,
        mergedProps.minStepsBetweenThumbs() * mergedProps.step()
      )
    ) {
      return;
    }
    setValues((prev) => [...replaceIndex(prev, index, snappedValue)]);
  };
  const updateDragging = (index, dragging) => {
    if (mergedProps.isDisabled() || !isThumbEditable(index)) return;
    const wasDragging = isDragging()[index];
    setIsDragging((p) => [...replaceIndex(p, index, dragging)]);
    if (wasDragging && !isDragging().some(Boolean)) {
      mergedProps.onChangeEnd?.(values());
    }
  };
  const getFormattedValue = (value) => {
    return mergedProps.numberFormatter.format(value);
  };
  const setThumbPercent = (index, percent) => {
    updateValue(index, getPercentValue(percent));
  };
  const getRoundedValue = (value) => {
    return (
      Math.round((value - mergedProps.minValue()) / mergedProps.step()) *
        mergedProps.step() +
      mergedProps.minValue()
    );
  };
  const getPercentValue = (percent) => {
    const val =
      percent * (mergedProps.maxValue() - mergedProps.minValue()) +
      mergedProps.minValue();
    return clamp$1(
      getRoundedValue(val),
      mergedProps.minValue(),
      mergedProps.maxValue()
    );
  };
  const snapThumbValue = (index, value) => {
    const nextValue = values()[index] + value;
    const nextValues = getNextSortedValues(values(), nextValue, index);
    if (
      hasMinStepsBetweenValues(
        nextValues,
        mergedProps.minStepsBetweenThumbs() * mergedProps.step()
      )
    ) {
      updateValue(
        index,
        snapValueToStep(
          nextValue,
          mergedProps.minValue(),
          mergedProps.maxValue(),
          mergedProps.step()
        )
      );
    }
  };
  const incrementThumb = (index, stepSize = 1) => {
    dirty = true;
    snapThumbValue(index, Math.max(stepSize, props.step()));
  };
  const decrementThumb = (index, stepSize = 1) => {
    dirty = true;
    snapThumbValue(index, -Math.max(stepSize, props.step()));
  };
  return {
    values,
    getThumbValue: (index) => values()[index],
    setThumbValue: updateValue,
    setThumbPercent,
    isThumbDragging: (index) => isDragging()[index],
    setThumbDragging: updateDragging,
    focusedThumb: focusedIndex,
    setFocusedThumb: (index) => {
      if (index === void 0 && dirty) {
        dirty = false;
        mergedProps.onChangeEnd?.(values());
      }
      setFocusedIndex(index);
    },
    getThumbPercent: (index) => getValuePercent(values()[index]),
    getValuePercent,
    getThumbValueLabel: (index) => getFormattedValue(values()[index]),
    getFormattedValue,
    getThumbMinValue,
    getThumbMaxValue,
    getPercentValue,
    isThumbEditable,
    setThumbEditable,
    incrementThumb,
    decrementThumb,
    step: mergedProps.step,
    pageSize,
    orientation: mergedProps.orientation,
    isDisabled: mergedProps.isDisabled,
    setValues,
    resetValues,
  };
}
function replaceIndex(array, index, value) {
  if (array[index] === value) {
    return array;
  }
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
}

// src/slider/slider-root.tsx
function SliderRoot(props) {
  let ref;
  const defaultId = `slider-${createUniqueId()}`;
  const mergedProps = mergeDefaultProps(
    {
      id: defaultId,
      minValue: 0,
      maxValue: 100,
      step: 1,
      minStepsBetweenThumbs: 0,
      orientation: "horizontal",
      disabled: false,
      inverted: false,
      getValueLabel: (params) => params.values.join(", "),
    },
    props
  );
  const [local, formControlProps, others] = splitProps(
    mergedProps,
    [
      "ref",
      "value",
      "defaultValue",
      "onChange",
      "onChangeEnd",
      "inverted",
      "minValue",
      "maxValue",
      "step",
      "minStepsBetweenThumbs",
      "getValueLabel",
      "orientation",
    ],
    FORM_CONTROL_PROP_NAMES
  );
  const { formControlContext } = createFormControl(formControlProps);
  const defaultFormatter = createNumberFormatter(() => ({
    style: "decimal",
  }));
  const { direction } = useLocale();
  const state = createSliderState({
    value: () => local.value,
    defaultValue: () => local.defaultValue ?? [local.minValue],
    maxValue: () => local.maxValue,
    minValue: () => local.minValue,
    minStepsBetweenThumbs: () => local.minStepsBetweenThumbs,
    isDisabled: () => formControlContext.isDisabled() ?? false,
    orientation: () => local.orientation,
    step: () => local.step,
    numberFormatter: defaultFormatter(),
    onChange: local.onChange,
    onChangeEnd: local.onChangeEnd,
  });
  const [thumbs, setThumbs] = createSignal([]);
  const { DomCollectionProvider } = createDomCollection({
    items: thumbs,
    onItemsChange: setThumbs,
  });
  createFormResetListener(
    () => ref,
    () => state.resetValues()
  );
  const isLTR = () => direction() === "ltr";
  const isSlidingFromLeft = () => {
    return (isLTR() && !local.inverted) || (!isLTR() && local.inverted);
  };
  const isSlidingFromBottom = () => !local.inverted;
  const isVertical = () => state.orientation() === "vertical";
  const dataset = createMemo(() => {
    return {
      ...formControlContext.dataset(),
      "data-orientation": local.orientation,
    };
  });
  const [trackRef, setTrackRef] = createSignal();
  let currentPosition = null;
  const onSlideStart = (index, value) => {
    state.setFocusedThumb(index);
    state.setThumbDragging(index, true);
    state.setThumbValue(index, value);
    currentPosition = null;
  };
  const onSlideMove = ({ deltaX, deltaY }) => {
    const active = state.focusedThumb();
    if (active === void 0) {
      return;
    }
    const { width, height } = trackRef().getBoundingClientRect();
    const size = isVertical() ? height : width;
    if (currentPosition === null) {
      currentPosition = state.getThumbPercent(state.focusedThumb()) * size;
    }
    let delta = isVertical() ? deltaY : deltaX;
    if (
      (!isVertical() && local.inverted) ||
      (isVertical() && isSlidingFromBottom())
    ) {
      delta = -delta;
    }
    currentPosition += delta;
    const percent = clamp$1(currentPosition / size, 0, 1);
    const nextValues = getNextSortedValues(
      state.values(),
      currentPosition,
      active
    );
    if (
      hasMinStepsBetweenValues(
        nextValues,
        local.minStepsBetweenThumbs * state.step()
      )
    ) {
      state.setThumbPercent(state.focusedThumb(), percent);
      local.onChange?.(state.values());
    }
  };
  const onSlideEnd = () => {
    const activeThumb = state.focusedThumb();
    if (activeThumb !== void 0) {
      state.setThumbDragging(activeThumb, false);
      thumbs()[activeThumb].ref().focus();
    }
  };
  const onHomeKeyDown = (event) => {
    const focusedThumb = state.focusedThumb();
    if (!formControlContext.isDisabled() && focusedThumb !== void 0) {
      stopEventDefaultAndPropagation(event);
      state.setThumbValue(focusedThumb, state.getThumbMinValue(focusedThumb));
    }
  };
  const onEndKeyDown = (event) => {
    const focusedThumb = state.focusedThumb();
    if (!formControlContext.isDisabled() && focusedThumb !== void 0) {
      stopEventDefaultAndPropagation(event);
      state.setThumbValue(focusedThumb, state.getThumbMaxValue(focusedThumb));
    }
  };
  const onStepKeyDown = (event, index) => {
    if (!formControlContext.isDisabled()) {
      switch (event.key) {
        case "Left":
        case "ArrowLeft":
        case "Down":
        case "ArrowDown":
          stopEventDefaultAndPropagation(event);
          if (!isLTR()) {
            state.incrementThumb(
              index,
              event.shiftKey ? state.pageSize() : state.step()
            );
          } else {
            state.decrementThumb(
              index,
              event.shiftKey ? state.pageSize() : state.step()
            );
          }
          break;
        case "Right":
        case "ArrowRight":
        case "Up":
        case "ArrowUp":
          stopEventDefaultAndPropagation(event);
          if (!isLTR()) {
            state.decrementThumb(
              index,
              event.shiftKey ? state.pageSize() : state.step()
            );
          } else {
            state.incrementThumb(
              index,
              event.shiftKey ? state.pageSize() : state.step()
            );
          }
          break;
        case "Home":
          onHomeKeyDown(event);
          break;
        case "End":
          onEndKeyDown(event);
          break;
        case "PageUp":
          stopEventDefaultAndPropagation(event);
          state.incrementThumb(index, state.pageSize());
          break;
        case "PageDown":
          stopEventDefaultAndPropagation(event);
          state.decrementThumb(index, state.pageSize());
          break;
      }
    }
  };
  const startEdge = createMemo(() => {
    if (isVertical()) {
      return isSlidingFromBottom() ? "bottom" : "top";
    }
    return isSlidingFromLeft() ? "left" : "right";
  });
  const endEdge = createMemo(() => {
    if (isVertical()) {
      return isSlidingFromBottom() ? "top" : "bottom";
    }
    return isSlidingFromLeft() ? "right" : "left";
  });
  const context = {
    dataset,
    state,
    thumbs,
    setThumbs,
    onSlideStart,
    onSlideMove,
    onSlideEnd,
    onStepKeyDown,
    isSlidingFromLeft,
    isSlidingFromBottom,
    trackRef,
    minValue: () => local.minValue,
    maxValue: () => local.maxValue,
    inverted: () => local.inverted,
    startEdge,
    endEdge,
    registerTrack: (ref2) => setTrackRef(ref2),
    generateId: createGenerateId(() => access$1(formControlProps.id)),
    getValueLabel: local.getValueLabel,
  };
  return createComponent(DomCollectionProvider, {
    get children() {
      return createComponent(FormControlContext.Provider, {
        value: formControlContext,
        get children() {
          return createComponent(SliderContext.Provider, {
            value: context,
            get children() {
              return createComponent(
                Polymorphic,
                mergeProps$1(
                  {
                    as: "div",
                    ref(r$) {
                      const _ref$ = mergeRefs((el) => (ref = el), local.ref);
                      typeof _ref$ === "function" && _ref$(r$);
                    },
                    role: "group",
                    get id() {
                      return access$1(formControlProps.id);
                    },
                  },
                  dataset,
                  others
                )
              );
            },
          });
        },
      });
    },
  });
}
function SliderTrack(props) {
  const context = useSliderContext();
  const [local, others] = splitProps(props, [
    "onPointerDown",
    "onPointerMove",
    "onPointerUp",
  ]);
  const [sRect, setRect] = createSignal();
  function getValueFromPointer(pointerPosition) {
    const rect = sRect() || context.trackRef().getBoundingClientRect();
    const input = [
      0,
      context.state.orientation() === "vertical" ? rect.height : rect.width,
    ];
    let output = context.isSlidingFromLeft()
      ? [context.minValue(), context.maxValue()]
      : [context.maxValue(), context.minValue()];
    if (context.state.orientation() === "vertical") {
      output = context.isSlidingFromBottom()
        ? [context.maxValue(), context.minValue()]
        : [context.minValue(), context.maxValue()];
    }
    const value = linearScale(input, output);
    setRect(rect);
    return value(
      pointerPosition -
        (context.state.orientation() === "vertical" ? rect.top : rect.left)
    );
  }
  let startPosition = 0;
  const onPointerDown = (e) => {
    callHandler(e, local.onPointerDown);
    const target = e.target;
    target.setPointerCapture(e.pointerId);
    e.preventDefault();
    const value = getValueFromPointer(
      context.state.orientation() === "horizontal" ? e.clientX : e.clientY
    );
    startPosition =
      context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    const closestIndex = getClosestValueIndex(context.state.values(), value);
    context.onSlideStart?.(closestIndex, value);
  };
  const onPointerMove = (e) => {
    callHandler(e, local.onPointerMove);
    const target = e.target;
    if (target.hasPointerCapture(e.pointerId)) {
      context.onSlideMove?.({
        deltaX: e.clientX - startPosition,
        deltaY: e.clientY - startPosition,
      });
      startPosition =
        context.state.orientation() === "horizontal" ? e.clientX : e.clientY;
    }
  };
  const onPointerUp = (e) => {
    callHandler(e, local.onPointerUp);
    const target = e.target;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
      setRect(void 0);
      context.onSlideEnd?.();
    }
  };
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
        ref(r$) {
          const _ref$ = mergeRefs(context.registerTrack, props.ref);
          typeof _ref$ === "function" && _ref$(r$);
        },
        onPointerDown,
        onPointerMove,
        onPointerUp,
      },
      () => context.dataset(),
      others
    )
  );
}
function SliderValueLabel(props) {
  const context = useSliderContext();
  return createComponent(
    Polymorphic,
    mergeProps$1(
      {
        as: "div",
      },
      () => context.dataset(),
      props,
      {
        get children() {
          return context.getValueLabel?.({
            values: context.state.values(),
            max: context.maxValue(),
            min: context.minValue(),
          });
        },
      }
    )
  );
}

// src/slider/index.tsx
var Slider$1 = Object.assign(SliderRoot, {
  Description: FormControlDescription,
  ErrorMessage: FormControlErrorMessage,
  Fill: SliderFill,
  Input: SliderInput,
  Label: FormControlLabel,
  Thumb: SliderThumb,
  Track: SliderTrack,
  ValueLabel: SliderValueLabel,
});

function Slider(p) {
  return createComponent(Slider$1, {
    class: "flex select-none flex-col",
    get value() {
      return p.value;
    },
    get onChange() {
      return p.onChange;
    },
    get minValue() {
      return p.minValue ?? 0;
    },
    get maxValue() {
      return p.maxValue ?? 1;
    },
    get step() {
      return p.step ?? 0.01;
    },
    get getValueLabel() {
      return p.valFormatter
        ? (params) => params.values.map((v) => p.valFormatter(v)).join(", ")
        : undefined;
    },
    get children() {
      return [
        createComponent(Slider$1.Label, {
          class: "text-base-content",
          get children() {
            return p.label;
          },
        }),
        createComponent(Slider$1.ValueLabel, {
          class: "pb-2 text-base-content",
        }),
        createComponent(Slider$1.Track, {
          class: "relative h-2 w-full cursor-pointer rounded-full bg-base-300",
          get children() {
            return [
              createComponent(Slider$1.Fill, {
                class:
                  "absolute h-full cursor-pointer rounded-full backdrop-brightness-75",
              }),
              createComponent(Slider$1.Thumb, {
                class:
                  "ui-focusable ui-hoverable -top-1 block h-4 w-4 cursor-pointer rounded-full bg-base-content",
                get children() {
                  return createComponent(Slider$1.Input, {});
                },
              }),
            ];
          },
        }),
      ];
    },
  });
}

export {
  AlertProvider,
  Button,
  ChartHolderAnimated,
  ChartHolderFixedHeight,
  ChartHolderFlex,
  Checkbox,
  ContainerFrameSideOrTop_700px,
  ContainerHorizontalVertival_300px,
  FrameSide,
  FrameSideMenu,
  FrameSideMenuSecondary,
  FrameSideOrTop_Lg,
  FrameSideOrTop_Md,
  FrameSideOrTop_Xl,
  FrameTop,
  FrameTopMenu,
  Input,
  Select,
  Slider,
  openAlert,
  openComponent,
  openConfirm,
  openPrompt,
};
//# sourceMappingURL=mod.js.map
