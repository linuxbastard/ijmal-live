var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var isMobile$2 = {exports: {}};

isMobile$2.exports = isMobile;
isMobile$2.exports.isMobile = isMobile;
isMobile$2.exports.default = isMobile;

var mobileRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;

var tabletRE = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i;

function isMobile (opts) {
  if (!opts) opts = {};
  var ua = opts.ua;
  if (!ua && typeof navigator !== 'undefined') ua = navigator.userAgent;
  if (ua && ua.headers && typeof ua.headers['user-agent'] === 'string') {
    ua = ua.headers['user-agent'];
  }
  if (typeof ua !== 'string') return false

  var result = opts.tablet ? tabletRE.test(ua) : mobileRE.test(ua);

  if (
    !result &&
    opts.tablet &&
    opts.featureDetect &&
    navigator &&
    navigator.maxTouchPoints > 1 &&
    ua.indexOf('Macintosh') !== -1 &&
    ua.indexOf('Safari') !== -1
  ) {
    result = true;
  }

  return result
}

var isMobile$1 = isMobile$2.exports;

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 */

/**
 * Moves focus to an HTML element
 * eg for In-page links, after scroll, focus shifts to content area so that
 * next `tab` is where user expects. Used in bindInPageLinks()
 * eg move focus to a modal that is opened. Used in trapFocus()
 *
 * @param {Element} container - Container DOM element to trap focus inside of
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 */
function forceFocus(element, options) {
  options = options || {};

  var savedTabIndex = element.tabIndex;

  element.tabIndex = -1;
  element.dataset.tabIndex = savedTabIndex;
  element.focus();
  if (typeof options.className !== 'undefined') {
    element.classList.add(options.className);
  }
  element.addEventListener('blur', callback);

  function callback(event) {
    event.target.removeEventListener(event.type, callback);

    element.tabIndex = savedTabIndex;
    delete element.dataset.tabIndex;
    if (typeof options.className !== 'undefined') {
      element.classList.remove(options.className);
    }
  }
}

/**
 * If there's a hash in the url, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - Selector for elements to not include.
 */

function focusHash(options) {
  options = options || {};
  var hash = window.location.hash;
  var element = document.getElementById(hash.slice(1));

  // if we are to ignore this element, early return
  if (element && options.ignore && element.matches(options.ignore)) {
    return false;
  }

  if (hash && element) {
    forceFocus(element, options);
  }
}

/**
 * When an in-page (url w/hash) link is clicked, focus the appropriate element
 * This compensates for older browsers that do not move keyboard focus to anchor links.
 * Recommendation: To be called once the page in loaded.
 *
 * @param {Object} options - Settings unique to your theme
 * @param {string} options.className - Class name to apply to element on focus.
 * @param {string} options.ignore - CSS selector for elements to not include.
 */

function bindInPageLinks(options) {
  options = options || {};
  var links = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  return links.filter(function(link) {
    if (link.hash === '#' || link.hash === '') {
      return false;
    }

    if (options.ignore && link.matches(options.ignore)) {
      return false;
    }

    var element = document.querySelector(link.hash);

    if (!element) {
      return false;
    }

    link.addEventListener('click', function() {
      forceFocus(element, options);
    });

    return true;
  });
}

var SECTION_ID_ATTR$1 = 'data-section-id';

function Section(container, properties) {
  this.container = validateContainerElement(container);
  this.id = container.getAttribute(SECTION_ID_ATTR$1);
  this.extensions = [];

  // eslint-disable-next-line es5/no-es6-static-methods
  Object.assign(this, validatePropertiesObject(properties));

  this.onLoad();
}

Section.prototype = {
  onLoad: Function.prototype,
  onUnload: Function.prototype,
  onSelect: Function.prototype,
  onDeselect: Function.prototype,
  onBlockSelect: Function.prototype,
  onBlockDeselect: Function.prototype,

  extend: function extend(extension) {
    this.extensions.push(extension); // Save original extension

    // eslint-disable-next-line es5/no-es6-static-methods
    var extensionClone = Object.assign({}, extension);
    delete extensionClone.init; // Remove init function before assigning extension properties

    // eslint-disable-next-line es5/no-es6-static-methods
    Object.assign(this, extensionClone);

    if (typeof extension.init === 'function') {
      extension.init.apply(this);
    }
  }
};

function validateContainerElement(container) {
  if (!(container instanceof Element)) {
    throw new TypeError(
      'Theme Sections: Attempted to load section. The section container provided is not a DOM element.'
    );
  }
  if (container.getAttribute(SECTION_ID_ATTR$1) === null) {
    throw new Error(
      'Theme Sections: The section container provided does not have an id assigned to the ' +
        SECTION_ID_ATTR$1 +
        ' attribute.'
    );
  }

  return container;
}

function validatePropertiesObject(value) {
  if (
    (typeof value !== 'undefined' && typeof value !== 'object') ||
    value === null
  ) {
    throw new TypeError(
      'Theme Sections: The properties object provided is not a valid'
    );
  }

  return value;
}

// Object.assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) {
      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

/*
 * @shopify/theme-sections
 * -----------------------------------------------------------------------------
 *
 * A framework to provide structure to your Shopify sections and a load and unload
 * lifecycle. The lifecycle is automatically connected to theme editor events so
 * that your sections load and unload as the editor changes the content and
 * settings of your sections.
 */

var SECTION_TYPE_ATTR = 'data-section-type';
var SECTION_ID_ATTR = 'data-section-id';

window.Shopify = window.Shopify || {};
window.Shopify.theme = window.Shopify.theme || {};
window.Shopify.theme.sections = window.Shopify.theme.sections || {};

var registered = (window.Shopify.theme.sections.registered =
  window.Shopify.theme.sections.registered || {});
var instances = (window.Shopify.theme.sections.instances =
  window.Shopify.theme.sections.instances || []);

function register(type, properties) {
  if (typeof type !== 'string') {
    throw new TypeError(
      'Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered'
    );
  }

  if (typeof registered[type] !== 'undefined') {
    throw new Error(
      'Theme Sections: A section of type "' +
        type +
        '" has already been registered. You cannot register the same section type twice'
    );
  }

  function TypedSection(container) {
    Section.call(this, container, properties);
  }

  TypedSection.constructor = Section;
  TypedSection.prototype = Object.create(Section.prototype);
  TypedSection.prototype.type = type;

  return (registered[type] = TypedSection);
}

function load(types, containers) {
  types = normalizeType(types);

  if (typeof containers === 'undefined') {
    containers = document.querySelectorAll('[' + SECTION_TYPE_ATTR + ']');
  }

  containers = normalizeContainers(containers);

  types.forEach(function(type) {
    var TypedSection = registered[type];

    if (typeof TypedSection === 'undefined') {
      return;
    }

    containers = containers.filter(function(container) {
      // Filter from list of containers because container already has an instance loaded
      if (isInstance(container)) {
        return false;
      }

      // Filter from list of containers because container doesn't have data-section-type attribute
      if (container.getAttribute(SECTION_TYPE_ATTR) === null) {
        return false;
      }

      // Keep in list of containers because current type doesn't match
      if (container.getAttribute(SECTION_TYPE_ATTR) !== type) {
        return true;
      }

      instances.push(new TypedSection(container));

      // Filter from list of containers because container now has an instance loaded
      return false;
    });
  });
}

function unload(selector) {
  var instancesToUnload = getInstances(selector);

  instancesToUnload.forEach(function(instance) {
    var index = instances
      .map(function(e) {
        return e.id;
      })
      .indexOf(instance.id);
    instances.splice(index, 1);
    instance.onUnload();
  });
}

function getInstances(selector) {
  var filteredInstances = [];

  // Fetch first element if its an array
  if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
    var firstElement = selector[0];
  }

  // If selector element is DOM element
  if (selector instanceof Element || firstElement instanceof Element) {
    var containers = normalizeContainers(selector);

    containers.forEach(function(container) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function(instance) {
          return instance.container === container;
        })
      );
    });

    // If select is type string
  } else if (typeof selector === 'string' || typeof firstElement === 'string') {
    var types = normalizeType(selector);

    types.forEach(function(type) {
      filteredInstances = filteredInstances.concat(
        instances.filter(function(instance) {
          return instance.type === type;
        })
      );
    });
  }

  return filteredInstances;
}

function getInstanceById(id) {
  var instance;

  for (var i = 0; i < instances.length; i++) {
    if (instances[i].id === id) {
      instance = instances[i];
      break;
    }
  }
  return instance;
}

function isInstance(selector) {
  return getInstances(selector).length > 0;
}

function normalizeType(types) {
  // If '*' then fetch all registered section types
  if (types === '*') {
    types = Object.keys(registered);

    // If a single section type string is passed, put it in an array
  } else if (typeof types === 'string') {
    types = [types];

    // If single section constructor is passed, transform to array with section
    // type string
  } else if (types.constructor === Section) {
    types = [types.prototype.type];

    // If array of typed section constructors is passed, transform the array to
    // type strings
  } else if (Array.isArray(types) && types[0].constructor === Section) {
    types = types.map(function(TypedSection) {
      return TypedSection.prototype.type;
    });
  }

  types = types.map(function(type) {
    return type.toLowerCase();
  });

  return types;
}

function normalizeContainers(containers) {
  // Nodelist with entries
  if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
    containers = Array.prototype.slice.call(containers);

    // Empty Nodelist
  } else if (
    NodeList.prototype.isPrototypeOf(containers) &&
    containers.length === 0
  ) {
    containers = [];

    // Handle null (document.querySelector() returns null with no match)
  } else if (containers === null) {
    containers = [];

    // Single DOM element
  } else if (!Array.isArray(containers) && containers instanceof Element) {
    containers = [containers];
  }

  return containers;
}

if (window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', function(event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector(
      '[' + SECTION_ID_ATTR + '="' + id + '"]'
    );

    if (container !== null) {
      load(container.getAttribute(SECTION_TYPE_ATTR), container);
    }
  });

  document.addEventListener('shopify:section:unload', function(event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector(
      '[' + SECTION_ID_ATTR + '="' + id + '"]'
    );
    var instance = getInstances(container)[0];

    if (typeof instance === 'object') {
      unload(container);
    }
  });

  document.addEventListener('shopify:section:select', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onSelect(event);
    }
  });

  document.addEventListener('shopify:section:deselect', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onDeselect(event);
    }
  });

  document.addEventListener('shopify:block:select', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockSelect(event);
    }
  });

  document.addEventListener('shopify:block:deselect', function(event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockDeselect(event);
    }
  });
}

function n$2(n,t){return void 0===t&&(t=document),t.querySelector(n)}function t$3(n,t){return void 0===t&&(t=document),[].slice.call(t.querySelectorAll(n))}function c$1(n,t){return Array.isArray(n)?n.forEach(t):t(n)}function r$3(n){return function(t,r,e){return c$1(t,function(t){return t[n+"EventListener"](r,e)})}}function e$3(n,t,c){return r$3("add")(n,t,c),function(){return r$3("remove")(n,t,c)}}function o$2(n){return function(t){var r=arguments;return c$1(t,function(t){var c;return (c=t.classList)[n].apply(c,[].slice.call(r,1))})}}function u$2(n){o$2("add").apply(void 0,[n].concat([].slice.call(arguments,1)));}function i$1(n){o$2("remove").apply(void 0,[n].concat([].slice.call(arguments,1)));}function l(n){o$2("toggle").apply(void 0,[n].concat([].slice.call(arguments,1)));}function a$1(n,t){return n.classList.contains(t)}

var n$1=function(n){if("object"!=typeof(t=n)||Array.isArray(t))throw "state should be an object";var t;},t$2=function(n,t,e,c){return (r=n,r.reduce(function(n,t,e){return n.indexOf(t)>-1?n:n.concat(t)},[])).reduce(function(n,e){return n.concat(t[e]||[])},[]).map(function(n){return n(e,c)});var r;},e$2=a(),c=e$2.on,r$2=e$2.emit,o$1=e$2.hydrate,u$1=e$2.getState;function a(e){void 0===e&&(e={});var c={};return {getState:function(){return Object.assign({},e)},hydrate:function(r){return n$1(r),Object.assign(e,r),function(){var n=["*"].concat(Object.keys(r));t$2(n,c,e);}},on:function(n,t){return (n=[].concat(n)).map(function(n){return c[n]=(c[n]||[]).concat(t)}),function(){return n.map(function(n){return c[n].splice(c[n].indexOf(t),1)})}},emit:function(r,o,u){var a=("*"===r?[]:["*"]).concat(r);(o="function"==typeof o?o(e):o)&&(n$1(o),Object.assign(e,o),a=a.concat(Object.keys(o))),t$2(a,c,e,u);}}}

function HomeSectionModifiers(node) {
  // We only want to enable the transparent header in select
  // situations on the homepage:
  //   - First section is a slideshow
  var handleTransparentCheck = firstSection => {
    if (firstSection.classList.contains('slideshow') || firstSection.classList.contains('video-hero') || firstSection.classList.contains('full-width-image')) {
      u$2(firstSection, 'transparent-section');
    } else {
      i$1(firstSection, 'transparent-section');
    }
  };

  var handleHeaderBorder = firstSection => {
    var header = document.getElementById('header');

    if (firstSection.classList.contains('slideshow') || firstSection.classList.contains('video-hero') || firstSection.classList.contains('full-width-image')) {
      u$2(header, 'header--no-border');
    } else {
      i$1(header, 'header--no-border');
    }
  };

  var handleFirstSection = () => {
    var firstSection = node.firstElementChild.firstElementChild;
    handleTransparentCheck(firstSection);
    handleHeaderBorder(firstSection);
  };

  handleFirstSection();
  c('headerChange', handleFirstSection);
  c('transparentSectionUpdate', handleFirstSection);
  e$3(window, 'shopify:section:reorder', handleFirstSection);
  e$3(window, 'shopify:block:select', handleFirstSection);
}

/*!
* tabbable 5.2.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])', 'details>summary:first-of-type', 'details'];
var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
var matches = typeof Element === 'undefined' ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

var getCandidates = function getCandidates(el, includeContainer, filter) {
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));

  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }

  candidates = candidates.filter(filter);
  return candidates;
};

var isContentEditable = function isContentEditable(node) {
  return node.contentEditable === 'true';
};

var getTabindex = function getTabindex(node) {
  var tabindexAttr = parseInt(node.getAttribute('tabindex'), 10);

  if (!isNaN(tabindexAttr)) {
    return tabindexAttr;
  } // Browsers do not return `tabIndex` correctly for contentEditable nodes;
  // so if they don't have a tabindex attribute specifically set, assume it's 0.


  if (isContentEditable(node)) {
    return 0;
  } // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
  //  `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
  //  yet they are still part of the regular tab order; in FF, they get a default
  //  `tabIndex` of 0; since Chrome still puts those elements in the regular tab
  //  order, consider their tab index to be 0.


  if ((node.nodeName === 'AUDIO' || node.nodeName === 'VIDEO' || node.nodeName === 'DETAILS') && node.getAttribute('tabindex') === null) {
    return 0;
  }

  return node.tabIndex;
};

var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
};

var isInput = function isInput(node) {
  return node.tagName === 'INPUT';
};

var isHiddenInput = function isHiddenInput(node) {
  return isInput(node) && node.type === 'hidden';
};

var isDetailsWithSummary = function isDetailsWithSummary(node) {
  var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
    return child.tagName === 'SUMMARY';
  });
  return r;
};

var getCheckedRadio = function getCheckedRadio(nodes, form) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].checked && nodes[i].form === form) {
      return nodes[i];
    }
  }
};

var isTabbableRadio = function isTabbableRadio(node) {
  if (!node.name) {
    return true;
  }

  var radioScope = node.form || node.ownerDocument;

  var queryRadios = function queryRadios(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };

  var radioSet;

  if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
      return false;
    }
  }

  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};

var isRadio = function isRadio(node) {
  return isInput(node) && node.type === 'radio';
};

var isNonTabbableRadio = function isNonTabbableRadio(node) {
  return isRadio(node) && !isTabbableRadio(node);
};

var isHidden = function isHidden(node, displayCheck) {
  if (getComputedStyle(node).visibility === 'hidden') {
    return true;
  }

  var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;

  if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
    return true;
  }

  if (!displayCheck || displayCheck === 'full') {
    while (node) {
      if (getComputedStyle(node).display === 'none') {
        return true;
      }

      node = node.parentElement;
    }
  } else if (displayCheck === 'non-zero-area') {
    var _node$getBoundingClie = node.getBoundingClientRect(),
        width = _node$getBoundingClie.width,
        height = _node$getBoundingClie.height;

    return width === 0 && height === 0;
  }

  return false;
}; // form fields (nested) inside a disabled fieldset are not focusable/tabbable
//  unless they are in the _first_ <legend> element of the top-most disabled
//  fieldset


var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
  if (isInput(node) || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA' || node.tagName === 'BUTTON') {
    var parentNode = node.parentElement;

    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> as an immediate child of the disabled
        //  <fieldset>: if the node is in that legend, it'll be enabled even
        //  though the fieldset is disabled; otherwise, the node is in a
        //  secondary/subsequent legend, or somewhere else within the fieldset
        //  (however deep nested) and it'll be disabled
        for (var i = 0; i < parentNode.children.length; i++) {
          var child = parentNode.children.item(i);

          if (child.tagName === 'LEGEND') {
            if (child.contains(node)) {
              return false;
            } // the node isn't in the first legend (in doc order), so no matter
            //  where it is now, it'll be disabled


            return true;
          }
        } // the node isn't in a legend, so no matter where it is now, it'll be disabled


        return true;
      }

      parentNode = parentNode.parentElement;
    }
  } // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state


  return false;
};

var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
  if (node.disabled || isHiddenInput(node) || isHidden(node, options.displayCheck) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }

  return true;
};

var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
  if (!isNodeMatchingSelectorFocusable(options, node) || isNonTabbableRadio(node) || getTabindex(node) < 0) {
    return false;
  }

  return true;
};

var tabbable = function tabbable(el, options) {
  options = options || {};
  var regularTabbables = [];
  var orderedTabbables = [];
  var candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  candidates.forEach(function (candidate, i) {
    var candidateTabindex = getTabindex(candidate);

    if (candidateTabindex === 0) {
      regularTabbables.push(candidate);
    } else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        node: candidate
      });
    }
  });
  var tabbableNodes = orderedTabbables.sort(sortOrderedTabbables).map(function (a) {
    return a.node;
  }).concat(regularTabbables);
  return tabbableNodes;
};

var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');

var isFocusable = function isFocusable(node, options) {
  options = options || {};

  if (!node) {
    throw new Error('No node provided');
  }

  if (matches.call(node, focusableCandidateSelector) === false) {
    return false;
  }

  return isNodeMatchingSelectorFocusable(options, node);
};

/*!
* focus-trap 6.7.1
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var activeFocusTraps = function () {
  var trapQueue = [];
  return {
    activateTrap: function activateTrap(trap) {
      if (trapQueue.length > 0) {
        var activeTrap = trapQueue[trapQueue.length - 1];

        if (activeTrap !== trap) {
          activeTrap.pause();
        }
      }

      var trapIndex = trapQueue.indexOf(trap);

      if (trapIndex === -1) {
        trapQueue.push(trap);
      } else {
        // move this existing trap to the front of the queue
        trapQueue.splice(trapIndex, 1);
        trapQueue.push(trap);
      }
    },
    deactivateTrap: function deactivateTrap(trap) {
      var trapIndex = trapQueue.indexOf(trap);

      if (trapIndex !== -1) {
        trapQueue.splice(trapIndex, 1);
      }

      if (trapQueue.length > 0) {
        trapQueue[trapQueue.length - 1].unpause();
      }
    }
  };
}();

var isSelectableInput = function isSelectableInput(node) {
  return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
};

var isEscapeEvent = function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
};

var isTabEvent = function isTabEvent(e) {
  return e.key === 'Tab' || e.keyCode === 9;
};

var delay = function delay(fn) {
  return setTimeout(fn, 0);
}; // Array.find/findIndex() are not supported on IE; this replicates enough
//  of Array.findIndex() for our needs


var findIndex = function findIndex(arr, fn) {
  var idx = -1;
  arr.every(function (value, i) {
    if (fn(value)) {
      idx = i;
      return false; // break
    }

    return true; // next
  });
  return idx;
};
/**
 * Get an option's value when it could be a plain value, or a handler that provides
 *  the value.
 * @param {*} value Option's value to check.
 * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
 * @returns {*} The `value`, or the handler's returned value.
 */


var valueOrHandler = function valueOrHandler(value) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return typeof value === 'function' ? value.apply(void 0, params) : value;
};

var getActualTarget = function getActualTarget(event) {
  // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
  //  shadow host. However, event.target.composedPath() will be an array of
  //  nodes "clicked" from inner-most (the actual element inside the shadow) to
  //  outer-most (the host HTML document). If we have access to composedPath(),
  //  then use its first element; otherwise, fall back to event.target (and
  //  this only works for an _open_ shadow DOM; otherwise,
  //  composedPath()[0] === event.target always).
  return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
};

var createFocusTrap = function createFocusTrap(elements, userOptions) {
  var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;

  var config = _objectSpread2$1({
    returnFocusOnDeactivate: true,
    escapeDeactivates: true,
    delayInitialFocus: true
  }, userOptions);

  var state = {
    // @type {Array<HTMLElement>}
    containers: [],
    // list of objects identifying the first and last tabbable nodes in all containers/groups in
    //  the trap
    // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
    //  is active, but the trap should never get to a state where there isn't at least one group
    //  with at least one tabbable node in it (that would lead to an error condition that would
    //  result in an error being thrown)
    // @type {Array<{ container: HTMLElement, firstTabbableNode: HTMLElement|null, lastTabbableNode: HTMLElement|null }>}
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: false,
    paused: false,
    // timer ID for when delayInitialFocus is true and initial focus in this trap
    //  has been delayed during activation
    delayInitialFocusTimer: undefined
  };
  var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

  var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
    return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
  };

  var containersContain = function containersContain(element) {
    return !!(element && state.containers.some(function (container) {
      return container.contains(element);
    }));
  };
  /**
   * Gets the node for the given option, which is expected to be an option that
   *  can be either a DOM node, a string that is a selector to get a node, `false`
   *  (if a node is explicitly NOT given), or a function that returns any of these
   *  values.
   * @param {string} optionName
   * @returns {undefined | false | HTMLElement | SVGElement} Returns
   *  `undefined` if the option is not specified; `false` if the option
   *  resolved to `false` (node explicitly not given); otherwise, the resolved
   *  DOM node.
   * @throws {Error} If the option is set, not `false`, and is not, or does not
   *  resolve to a node.
   */


  var getNodeForOption = function getNodeForOption(optionName) {
    var optionValue = config[optionName];

    if (typeof optionValue === 'function') {
      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        params[_key2 - 1] = arguments[_key2];
      }

      optionValue = optionValue.apply(void 0, params);
    }

    if (!optionValue) {
      if (optionValue === undefined || optionValue === false) {
        return optionValue;
      } // else, empty string (invalid), null (invalid), 0 (invalid)


      throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
    }

    var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

    if (typeof optionValue === 'string') {
      node = doc.querySelector(optionValue); // resolve to node, or null if fails

      if (!node) {
        throw new Error("`".concat(optionName, "` as selector refers to no known node"));
      }
    }

    return node;
  };

  var getInitialFocusNode = function getInitialFocusNode() {
    var node = getNodeForOption('initialFocus'); // false explicitly indicates we want no initialFocus at all

    if (node === false) {
      return false;
    }

    if (node === undefined) {
      // option not specified: use fallback options
      if (containersContain(doc.activeElement)) {
        node = doc.activeElement;
      } else {
        var firstTabbableGroup = state.tabbableGroups[0];
        var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode; // NOTE: `fallbackFocus` option function cannot return `false` (not supported)

        node = firstTabbableNode || getNodeForOption('fallbackFocus');
      }
    }

    if (!node) {
      throw new Error('Your focus-trap needs to have at least one focusable element');
    }

    return node;
  };

  var updateTabbableNodes = function updateTabbableNodes() {
    state.tabbableGroups = state.containers.map(function (container) {
      var tabbableNodes = tabbable(container);

      if (tabbableNodes.length > 0) {
        return {
          container: container,
          firstTabbableNode: tabbableNodes[0],
          lastTabbableNode: tabbableNodes[tabbableNodes.length - 1]
        };
      }

      return undefined;
    }).filter(function (group) {
      return !!group;
    }); // remove groups with no tabbable nodes
    // throw if no groups have tabbable nodes and we don't have a fallback focus node either

    if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
    ) {
      throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
    }
  };

  var tryFocus = function tryFocus(node) {
    if (node === false) {
      return;
    }

    if (node === doc.activeElement) {
      return;
    }

    if (!node || !node.focus) {
      tryFocus(getInitialFocusNode());
      return;
    }

    node.focus({
      preventScroll: !!config.preventScroll
    });
    state.mostRecentlyFocusedNode = node;

    if (isSelectableInput(node)) {
      node.select();
    }
  };

  var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
    var node = getNodeForOption('setReturnFocus', previousActiveElement);
    return node ? node : node === false ? false : previousActiveElement;
  }; // This needs to be done on mousedown and touchstart instead of click
  // so that it precedes the focus event.


  var checkPointerDown = function checkPointerDown(e) {
    var target = getActualTarget(e);

    if (containersContain(target)) {
      // allow the click since it ocurred inside the trap
      return;
    }

    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      // immediately deactivate the trap
      trap.deactivate({
        // if, on deactivation, we should return focus to the node originally-focused
        //  when the trap was activated (or the configured `setReturnFocus` node),
        //  then assume it's also OK to return focus to the outside node that was
        //  just clicked, causing deactivation, as long as that node is focusable;
        //  if it isn't focusable, then return focus to the original node focused
        //  on activation (or the configured `setReturnFocus` node)
        // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
        //  which will result in the outside click setting focus to the node
        //  that was clicked, whether it's focusable or not; by setting
        //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
        //  on activation (or the configured `setReturnFocus` node)
        returnFocus: config.returnFocusOnDeactivate && !isFocusable(target)
      });
      return;
    } // This is needed for mobile devices.
    // (If we'll only let `click` events through,
    // then on mobile they will be blocked anyways if `touchstart` is blocked.)


    if (valueOrHandler(config.allowOutsideClick, e)) {
      // allow the click outside the trap to take place
      return;
    } // otherwise, prevent the click


    e.preventDefault();
  }; // In case focus escapes the trap for some strange reason, pull it back in.


  var checkFocusIn = function checkFocusIn(e) {
    var target = getActualTarget(e);
    var targetContained = containersContain(target); // In Firefox when you Tab out of an iframe the Document is briefly focused.

    if (targetContained || target instanceof Document) {
      if (targetContained) {
        state.mostRecentlyFocusedNode = target;
      }
    } else {
      // escaped! pull it back in to where it just left
      e.stopImmediatePropagation();
      tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
    }
  }; // Hijack Tab events on the first and last focusable nodes of the trap,
  // in order to prevent focus from escaping. If it escapes for even a
  // moment it can end up scrolling the page and causing confusion so we
  // kind of need to capture the action at the keydown phase.


  var checkTab = function checkTab(e) {
    var target = getActualTarget(e);
    updateTabbableNodes();
    var destinationNode = null;

    if (state.tabbableGroups.length > 0) {
      // make sure the target is actually contained in a group
      // NOTE: the target may also be the container itself if it's tabbable
      //  with tabIndex='-1' and was given initial focus
      var containerIndex = findIndex(state.tabbableGroups, function (_ref) {
        var container = _ref.container;
        return container.contains(target);
      });

      if (containerIndex < 0) {
        // target not found in any group: quite possible focus has escaped the trap,
        //  so bring it back in to...
        if (e.shiftKey) {
          // ...the last node in the last group
          destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
        } else {
          // ...the first node in the first group
          destinationNode = state.tabbableGroups[0].firstTabbableNode;
        }
      } else if (e.shiftKey) {
        // REVERSE
        // is the target the first tabbable node in a group?
        var startOfGroupIndex = findIndex(state.tabbableGroups, function (_ref2) {
          var firstTabbableNode = _ref2.firstTabbableNode;
          return target === firstTabbableNode;
        });

        if (startOfGroupIndex < 0 && state.tabbableGroups[containerIndex].container === target) {
          // an exception case where the target is the container itself, in which
          //  case, we should handle shift+tab as if focus were on the container's
          //  first tabbable node, and go to the last tabbable node of the LAST group
          startOfGroupIndex = containerIndex;
        }

        if (startOfGroupIndex >= 0) {
          // YES: then shift+tab should go to the last tabbable node in the
          //  previous group (and wrap around to the last tabbable node of
          //  the LAST group if it's the first tabbable node of the FIRST group)
          var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
          var destinationGroup = state.tabbableGroups[destinationGroupIndex];
          destinationNode = destinationGroup.lastTabbableNode;
        }
      } else {
        // FORWARD
        // is the target the last tabbable node in a group?
        var lastOfGroupIndex = findIndex(state.tabbableGroups, function (_ref3) {
          var lastTabbableNode = _ref3.lastTabbableNode;
          return target === lastTabbableNode;
        });

        if (lastOfGroupIndex < 0 && state.tabbableGroups[containerIndex].container === target) {
          // an exception case where the target is the container itself, in which
          //  case, we should handle tab as if focus were on the container's
          //  last tabbable node, and go to the first tabbable node of the FIRST group
          lastOfGroupIndex = containerIndex;
        }

        if (lastOfGroupIndex >= 0) {
          // YES: then tab should go to the first tabbable node in the next
          //  group (and wrap around to the first tabbable node of the FIRST
          //  group if it's the last tabbable node of the LAST group)
          var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;

          var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
          destinationNode = _destinationGroup.firstTabbableNode;
        }
      }
    } else {
      // NOTE: the fallbackFocus option does not support returning false to opt-out
      destinationNode = getNodeForOption('fallbackFocus');
    }

    if (destinationNode) {
      e.preventDefault();
      tryFocus(destinationNode);
    } // else, let the browser take care of [shift+]tab and move the focus

  };

  var checkKey = function checkKey(e) {
    if (isEscapeEvent(e) && valueOrHandler(config.escapeDeactivates, e) !== false) {
      e.preventDefault();
      trap.deactivate();
      return;
    }

    if (isTabEvent(e)) {
      checkTab(e);
      return;
    }
  };

  var checkClick = function checkClick(e) {
    if (valueOrHandler(config.clickOutsideDeactivates, e)) {
      return;
    }

    var target = getActualTarget(e);

    if (containersContain(target)) {
      return;
    }

    if (valueOrHandler(config.allowOutsideClick, e)) {
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();
  }; //
  // EVENT LISTENERS
  //


  var addListeners = function addListeners() {
    if (!state.active) {
      return;
    } // There can be only one listening focus trap at a time


    activeFocusTraps.activateTrap(trap); // Delay ensures that the focused element doesn't capture the event
    // that caused the focus trap activation.

    state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
      tryFocus(getInitialFocusNode());
    }) : tryFocus(getInitialFocusNode());
    doc.addEventListener('focusin', checkFocusIn, true);
    doc.addEventListener('mousedown', checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener('touchstart', checkPointerDown, {
      capture: true,
      passive: false
    });
    doc.addEventListener('click', checkClick, {
      capture: true,
      passive: false
    });
    doc.addEventListener('keydown', checkKey, {
      capture: true,
      passive: false
    });
    return trap;
  };

  var removeListeners = function removeListeners() {
    if (!state.active) {
      return;
    }

    doc.removeEventListener('focusin', checkFocusIn, true);
    doc.removeEventListener('mousedown', checkPointerDown, true);
    doc.removeEventListener('touchstart', checkPointerDown, true);
    doc.removeEventListener('click', checkClick, true);
    doc.removeEventListener('keydown', checkKey, true);
    return trap;
  }; //
  // TRAP DEFINITION
  //


  trap = {
    activate: function activate(activateOptions) {
      if (state.active) {
        return this;
      }

      var onActivate = getOption(activateOptions, 'onActivate');
      var onPostActivate = getOption(activateOptions, 'onPostActivate');
      var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');

      if (!checkCanFocusTrap) {
        updateTabbableNodes();
      }

      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = doc.activeElement;

      if (onActivate) {
        onActivate();
      }

      var finishActivation = function finishActivation() {
        if (checkCanFocusTrap) {
          updateTabbableNodes();
        }

        addListeners();

        if (onPostActivate) {
          onPostActivate();
        }
      };

      if (checkCanFocusTrap) {
        checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
        return this;
      }

      finishActivation();
      return this;
    },
    deactivate: function deactivate(deactivateOptions) {
      if (!state.active) {
        return this;
      }

      clearTimeout(state.delayInitialFocusTimer); // noop if undefined

      state.delayInitialFocusTimer = undefined;
      removeListeners();
      state.active = false;
      state.paused = false;
      activeFocusTraps.deactivateTrap(trap);
      var onDeactivate = getOption(deactivateOptions, 'onDeactivate');
      var onPostDeactivate = getOption(deactivateOptions, 'onPostDeactivate');
      var checkCanReturnFocus = getOption(deactivateOptions, 'checkCanReturnFocus');

      if (onDeactivate) {
        onDeactivate();
      }

      var returnFocus = getOption(deactivateOptions, 'returnFocus', 'returnFocusOnDeactivate');

      var finishDeactivation = function finishDeactivation() {
        delay(function () {
          if (returnFocus) {
            tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
          }

          if (onPostDeactivate) {
            onPostDeactivate();
          }
        });
      };

      if (returnFocus && checkCanReturnFocus) {
        checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
        return this;
      }

      finishDeactivation();
      return this;
    },
    pause: function pause() {
      if (state.paused || !state.active) {
        return this;
      }

      state.paused = true;
      removeListeners();
      return this;
    },
    unpause: function unpause() {
      if (!state.paused || !state.active) {
        return this;
      }

      state.paused = false;
      updateTabbableNodes();
      addListeners();
      return this;
    },
    updateContainerElements: function updateContainerElements(containerElements) {
      var elementsAsArray = [].concat(containerElements).filter(Boolean);
      state.containers = elementsAsArray.map(function (element) {
        return typeof element === 'string' ? doc.querySelector(element) : element;
      });

      if (state.active) {
        updateTabbableNodes();
      }

      return this;
    }
  }; // initialize container elements

  trap.updateContainerElements(elements);
  return trap;
};

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Older browsers don't support event options, feature detect it.

// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var hasPassiveEvents = false;
if (typeof window !== 'undefined') {
  var passiveTestOptions = {
    get passive() {
      hasPassiveEvents = true;
      return undefined;
    }
  };
  window.addEventListener('testPassive', null, passiveTestOptions);
  window.removeEventListener('testPassive', null, passiveTestOptions);
}

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);


var locks = [];
var documentListenerAdded = false;
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;

// returns true if `el` should be allowed to receive touchmove events.
var allowTouchMove = function allowTouchMove(el) {
  return locks.some(function (lock) {
    if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
      return true;
    }

    return false;
  });
};

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;

  // For the case whereby consumers adds a touchmove event listener to document.
  // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
  // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
  // the touchmove event on document will break.
  if (allowTouchMove(e.target)) {
    return true;
  }

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) return true;

  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // If previousBodyPaddingRight is already set, don't set it again.
  if (previousBodyPaddingRight === undefined) {
    var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

    if (_reserveScrollBarGap && scrollBarGap > 0) {
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = scrollBarGap + 'px';
    }
  }

  // If previousBodyOverflowSetting is already set, don't set it again.
  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;

    // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
    // can be set again.
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;

    // Restore previousBodyOverflowSetting to undefined
    // so setOverflowHidden knows it can be set again.
    previousBodyOverflowSetting = undefined;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll.
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the bottom of its scroll.
    return preventDefault(event);
  }

  event.stopPropagation();
  return true;
};

var disableBodyScroll = function disableBodyScroll(targetElement, options) {
  // targetElement must be provided
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
    return;
  }

  // disableBodyScroll must not have been called on this targetElement before
  if (locks.some(function (lock) {
    return lock.targetElement === targetElement;
  })) {
    return;
  }

  var lock = {
    targetElement: targetElement,
    options: options || {}
  };

  locks = [].concat(_toConsumableArray(locks), [lock]);

  if (isIosDevice) {
    targetElement.ontouchstart = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = function (event) {
      if (event.targetTouches.length === 1) {
        // detect single touch.
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
};

var enableBodyScroll = function enableBodyScroll(targetElement) {
  if (!targetElement) {
    // eslint-disable-next-line no-console
    console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
    return;
  }

  locks = locks.filter(function (lock) {
    return lock.targetElement !== targetElement;
  });

  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? { passive: false } : undefined);
      documentListenerAdded = false;
    }
  } else if (!locks.length) {
    restoreOverflowSetting();
  }
};

var globalEvents = {
  filters: {
    toggleDrawer: 'filters:toggleFilterDrawer',
    updated: 'filters:updated'
  },
  sort: {
    toggleDrawer: 'sort:toggleSortDrawer',
    updated: 'sort:updated'
  },
  availability: {
    toggleDrawer: 'availability:toggleShowMore'
  }
};

function t$1(){try{return localStorage.setItem("test","test"),localStorage.removeItem("test"),!0}catch(t){return !1}}function e$1(e){if(t$1())return JSON.parse(localStorage.getItem("neon_"+e))}function r$1(e,r){if(t$1())return localStorage.setItem("neon_"+e,r)}

var routes = window.theme.routes.cart || {};
var paths = {
  base: "".concat(routes.base || '/cart', ".js"),
  add: "".concat(routes.add || '/cart/add', ".js"),
  change: "".concat(routes.change || '/cart/change', ".js"),
  clear: "".concat(routes.clear || '/cart/clear', ".js")
}; // Add a `sorted` key that orders line items
// in the order the customer added them if possible

function sortCart(cart) {
  var order = e$1('cart_order') || [];

  if (order.length) {
    cart.sorted = [...cart.items].sort((a, b) => order.indexOf(a.variant_id) - order.indexOf(b.variant_id));
    return cart;
  }

  cart.sorted = cart.items;
  return cart;
}

function addVariant(variant, quantity) {
  var numAvailable = variant.inventory_policy === 'deny' && variant.inventory_management === 'shopify' ? variant.inventory_quantity : null; // null means they can add as many as they want

  return get().then(_ref => {
    var {
      items
    } = _ref;
    var existing = items.filter(item => item.id === variant.id)[0] || {};
    var numRequested = (existing.quantity || 0) + quantity;

    if (numAvailable !== null && numRequested > numAvailable) {
      var err = "There are only ".concat(numAvailable, " of that product available, requested ").concat(numRequested, ".");
      throw new Error(err);
    } else {
      return addItemById(variant.id, quantity);
    }
  });
}

function updateItem(id, quantity) {
  return get().then(_ref2 => {
    var {
      items
    } = _ref2;

    for (var i = 0; i < items.length; i++) {
      if (items[i].variant_id === parseInt(id)) {
        return changeItem(i + 1, quantity); // shopify cart is a 1-based index
      }
    }
  });
}

function changeItem(line, quantity) {
  return fetch(paths.change, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      line,
      quantity
    })
  }).then(res => res.json()).then(cart => {
    r$2('cart:updated', {
      cart: sortCart(cart)
    });
    return sortCart(cart);
  });
}

function addItemById(id, quantity) {
  r$2('cart:updating');
  return fetch(paths.add, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      quantity
    })
  }).then(r => r.json()).then(item => {
    return get().then(cart => {
      var order = e$1('cart_order') || [];
      var newOrder = [item.variant_id, ...order.filter(i => i !== item.variant_id)];
      r$1('cart_order', JSON.stringify(newOrder));
      r$2('cart:updated', {
        cart: sortCart(cart)
      });
      return {
        item,
        cart: sortCart(cart)
      };
    });
  });
}

function get() {
  return fetch(paths.base, {
    method: 'GET',
    credentials: 'include'
  }).then(res => res.json()).then(data => {
    return sortCart(data);
  });
}

function addItem(form) {
  r$2('cart:updating');
  return fetch(paths.add, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: serialize(form)
  }).then(r => r.json()).then(res => {
    if (res.status == '422') {
      var errorMessage = {
        code: 422,
        message: res.description
      };
      throw errorMessage;
    }

    return get().then(cart => {
      var order = e$1('cart_order') || [];
      var newOrder = [res.variant_id, ...order.filter(i => i !== res.variant_id)];
      r$1('cart_order', JSON.stringify(newOrder));
      cart.newProductAdded = true;
      r$2('cart:updated', {
        cart: sortCart(cart)
      });
      return {
        item: res,
        cart: sortCart(cart)
      };
    });
  });
} // !
//  Serialize all form data into a SearchParams string
//  (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
//  @param  {Node}   form The form to serialize
//  @return {String}      The serialized form data
//


function serialize(form) {
  var arr = [];
  Array.prototype.slice.call(form.elements).forEach(function (field) {
    if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) {
      return;
    }

    if (field.type === 'select-multiple') {
      Array.prototype.slice.call(field.options).forEach(function (option) {
        if (!option.selected) return;
        arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(option.value));
      });
      return;
    }

    if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
      return;
    }

    arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
  });
  return arr.join('&');
}

var cart = {
  addItem,
  addItemById,
  addVariant,
  get,
  updateItem,
  sortCart
};

var currency_cjs = {};

Object.defineProperty(currency_cjs, "__esModule", {
  value: true
});
var formatMoney_1 = currency_cjs.formatMoney = formatMoney$1;
/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

var moneyFormat = '${{amount}}';

/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} format - shop money_format setting
 * @return {String} value - formatted value
 */
function formatMoney$1(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || moneyFormat;

  function formatWithDelimiters(number) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var thousands = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split('.');
    var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    var centsAmount = parts[1] ? decimal + parts[1] : '';

    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

var formatMoney = (val => formatMoney_1(val, window.theme.moneyFormat || '${{amount}}'));

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */
/**
 * Find the Shopify image attribute size
 *
 * @param {string} src
 * @returns {null}
 */

function imageSize(src) {
  /* eslint-disable */
  var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
  /* esling-enable */

  if (match) {
    return match[1];
  } else {
    return null;
  }
}
/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */

function getSizedImageUrl(src, size) {
  if (size === null) {
    return src;
  }

  if (size === 'master') {
    return removeProtocol(src);
  }

  var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

  if (match) {
    var prefix = src.split(match[0]);
    var suffix = match[0];
    return removeProtocol(prefix[0] + '_' + size + suffix);
  } else {
    return null;
  }
}
function removeProtocol(path) {
  return path.replace(/http(s)?:/, '');
}

var classes$e = {
  visible: 'is-visible'
};
var selectors$v = {
  closeBtn: '[data-store-availability-close]',
  productTitle: '[data-store-availability-product-title]',
  variantTitle: '[data-store-availability-variant-title]',
  productCard: '[data-store-availability-product]',
  storeListcontainer: '[data-store-list-container]',
  overlay: '[data-overlay]'
};
function storeAvailabilityDrawer(node) {
  var focusTrap = createFocusTrap(node, {
    allowOutsideClick: true
  });
  var productCard = n$2(selectors$v.productCard, node);
  var storeListContainer = n$2(selectors$v.storeListcontainer, node);
  var events = [e$3(n$2(selectors$v.closeBtn, node), 'click', e => {
    e.preventDefault();

    _close();
  }), e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) _close();
  }), e$3(n$2(selectors$v.overlay, node), 'click', () => _close()), c(globalEvents.availability.toggleDrawer, _ref2 => {
    var {
      availabilityOpen,
      product,
      variant,
      storeList
    } = _ref2;

    if (availabilityOpen) {
      productCard.innerHTML = _renderProductCard(product, variant);

      _renderAvailabilityList(storeList);

      _open();
    } else {
      _close();
    }
  })];

  var _renderAvailabilityList = storeList => {
    storeListContainer.innerHTML = '';
    storeListContainer.appendChild(storeList);
  };

  var _renderProductCard = (_ref3, _ref4) => {
    var {
      featured_image: image,
      title
    } = _ref3;
    var {
      title: variant_title,
      featured_image,
      price,
      unit_price,
      unit_price_measurement
    } = _ref4;

    var productImage = _getVariantImage(image, featured_image);

    return "\n      <div class=\"store-availbility-flyout__product-card type-body-regular\">\n        ".concat(productImage ? "\n            <div class='store-availbility-flyout__product-card-image'>\n              <img src='".concat(productImage, "' />\n            </div>\n          ") : '', "\n        <div class='store-availbility-flyout__product-card-details'>\n          <div>\n            <h4 class=\"ma0\">\n              <span>").concat(title, "</span>\n            </h4>\n            <div class=\"store-availbility-flyout__product-price-wrapper type-body-small\">\n              <span class=\"store-availbility-flyout__product-price\">").concat(formatMoney(price), "</span>\n            </div>\n            <div class=\"store-availbility-flyout__product-card-options type-body-small\">\n              ").concat(variant_title, "\n            </div>\n          </div>\n        </div>\n      </div>\n    ");
  };

  var _getVariantImage = (productImage, variantImage) => {
    if (!productImage && !variantImage) return '';

    if (variantImage) {
      return _updateImageSize(variantImage.src);
    }

    return _updateImageSize(productImage);
  };

  var _updateImageSize = imageUrl => {
    return getSizedImageUrl(imageUrl.replace('.' + imageSize(imageUrl), ''), '200x');
  };

  var _open = () => {
    u$2(node, classes$e.visible);
    focusTrap.activate();
    disableBodyScroll(node, {
      allowTouchMove: el => {
        while (el && el !== document.body) {
          if (el.getAttribute('scroll-lock-ignore') !== null) {
            return true;
          }

          el = el.parentNode;
        }
      }
    });
  };

  var _close = () => {
    i$1(node, classes$e.visible);
    o$1({
      availabilityOpen: false
    });
    focusTrap.deactivate();
    enableBodyScroll(node);
  };

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
}

var classes$d = {
  visible: 'is-visible',
  active: 'is-active'
};
var selectors$u = {
  closeBtn: '[data-modal-close]',
  modalContent: '.modal__content',
  overlay: '.modal__overlay',
  modalInner: '.modal__inner'
};
function modal(node) {
  var focusTrap = createFocusTrap(node, {
    allowOutsideClick: true
  });
  var modalContent = n$2(selectors$u.modalContent, node);
  var modalInner = n$2(selectors$u.modalInner, node);
  var events = [e$3(n$2(selectors$u.closeBtn, node), 'click', e => {
    e.preventDefault();

    _close();
  }), e$3(n$2(selectors$u.overlay, node), 'click', () => _close()), e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) _close();
  }), c('modal:open', (state, _ref2) => {
    var {
      modalContent
    } = _ref2;

    _renderModalContent(modalContent);

    _open();
  })];

  var _renderModalContent = content => {
    var clonedContent = content.cloneNode(true);
    modalContent.innerHTML = '';
    modalContent.appendChild(clonedContent);
  };

  var _open = () => {
    u$2(node, classes$d.visible);
    u$2(node, classes$d.active);
    focusTrap.activate();
    disableBodyScroll(modalInner);
  };

  var _close = () => {
    modalContent.innerHTML = '';
    focusTrap.deactivate();
    i$1(node, classes$d.active);
    enableBodyScroll(modalInner);
    setTimeout(() => {
      i$1(node, classes$d.visible);
    }, 400);
  };

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
}

var {
  strings: {
    accessibility: strings$2
  }
} = window.theme;

var handleTab = () => {
  var tabHandler = null;
  var formElments = ['INPUT', 'TEXTAREA', 'SELECT']; // Determine if the user is a mouse or keyboard user

  function handleFirstTab(e) {
    if (e.keyCode === 9 && !formElments.includes(document.activeElement.tagName)) {
      document.body.classList.add('user-is-tabbing');
      tabHandler();
      tabHandler = e$3(window, 'mousedown', handleMouseDownOnce);
    }
  }

  function handleMouseDownOnce() {
    document.body.classList.remove('user-is-tabbing');
    tabHandler();
    tabHandler = e$3(window, 'keydown', handleFirstTab);
  }

  tabHandler = e$3(window, 'keydown', handleFirstTab);
};

var focusFormStatus = node => {
  var formStatus = n$2('.form-status', node);
  if (!formStatus) return;
  var focusElement = n$2('[data-form-status]', formStatus);
  focusElement.focus();
};

function backgroundVideoHandler(container) {
  var pause = n$2('.video-pause', container);
  var video = container.getElementsByTagName('VIDEO')[0];
  if (!pause || !video) return;
  var pauseListener = e$3(pause, 'click', e => {
    e.preventDefault();

    if (video.paused) {
      video.play();
      pause.innerText = strings$2.pause_video;
    } else {
      video.pause();
      pause.innerText = strings$2.play_video;
    }
  });
  return () => pauseListener();
}

var ls_objectFit = {exports: {}};

var lazysizes = {exports: {}};

(function (module) {
(function(window, factory) {
	var lazySizes = factory(window, window.document, Date);
	window.lazySizes = lazySizes;
	if(module.exports){
		module.exports = lazySizes;
	}
}(typeof window != 'undefined' ?
      window : {}, 
/**
 * import("./types/global")
 * @typedef { import("./types/lazysizes-config").LazySizesConfigPartial } LazySizesConfigPartial
 */
function l(window, document, Date) { // Pass in the window Date function also for SSR because the Date class can be lost
	/*jshint eqnull:true */

	var lazysizes,
		/**
		 * @type { LazySizesConfigPartial }
		 */
		lazySizesCfg;

	(function(){
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			fastLoadedClass: 'ls-is-cached',
			iframeLoadMode: 0,
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2,
			loadHidden: true,
			ricTimeout: 0,
			throttleDelay: 125,
		};

		lazySizesCfg = window.lazySizesConfig || window.lazysizesConfig || {};

		for(prop in lazySizesDefaults){
			if(!(prop in lazySizesCfg)){
				lazySizesCfg[prop] = lazySizesDefaults[prop];
			}
		}
	})();

	if (!document || !document.getElementsByClassName) {
		return {
			init: function () {},
			/**
			 * @type { LazySizesConfigPartial }
			 */
			cfg: lazySizesCfg,
			/**
			 * @type { true }
			 */
			noSupport: true,
		};
	}

	var docElem = document.documentElement;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	/**
	 * Update to bind to window because 'this' becomes null during SSR
	 * builds.
	 */
	var addEventListener = window[_addEventListener].bind(window);

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	/**
	 * @param ele {Element}
	 * @param cls {string}
	 */
	var hasClass = function(ele, cls) {
		if(!regClassCache[cls]){
			regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	/**
	 * @param ele {Element}
	 * @param cls {string}
	 */
	var addClass = function(ele, cls) {
		if (!hasClass(ele, cls)){
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	/**
	 * @param ele {Element}
	 * @param cls {string}
	 */
	var removeClass = function(ele, cls) {
		var reg;
		if ((reg = hasClass(ele,cls))) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function(dom, fn, add){
		var action = add ? _addEventListener : 'removeEventListener';
		if(add){
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function(evt){
			dom[action](evt, fn);
		});
	};

	/**
	 * @param elem { Element }
	 * @param name { string }
	 * @param detail { any }
	 * @param noBubbles { boolean }
	 * @param noCancelable { boolean }
	 * @returns { CustomEvent }
	 */
	var triggerEvent = function(elem, name, detail, noBubbles, noCancelable){
		var event = document.createEvent('Event');

		if(!detail){
			detail = {};
		}

		detail.instance = lazysizes;

		event.initEvent(name, !noBubbles, !noCancelable);

		event.detail = detail;

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function (el, full){
		var polyfill;
		if( !supportPicture && ( polyfill = (window.picturefill || lazySizesCfg.pf) ) ){
			if(full && full.src && !el[_getAttribute]('srcset')){
				el.setAttribute('srcset', full.src);
			}
			polyfill({reevaluate: true, elements: [el]});
		} else if(full && full.src){
			el.src = full.src;
		}
	};

	var getCSS = function (elem, style){
		return (getComputedStyle(elem, null) || {})[style];
	};

	/**
	 *
	 * @param elem { Element }
	 * @param parent { Element }
	 * @param [width] {number}
	 * @returns {number}
	 */
	var getWidth = function(elem, parent, width){
		width = width || elem.offsetWidth;

		while(width < lazySizesCfg.minSize && parent && !elem._lazysizesWidth){
			width =  parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = (function(){
		var running, waiting;
		var firstFns = [];
		var secondFns = [];
		var fns = firstFns;

		var run = function(){
			var runFns = fns;

			fns = firstFns.length ? secondFns : firstFns;

			running = true;
			waiting = false;

			while(runFns.length){
				runFns.shift()();
			}

			running = false;
		};

		var rafBatch = function(fn, queue){
			if(running && !queue){
				fn.apply(this, arguments);
			} else {
				fns.push(fn);

				if(!waiting){
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	})();

	var rAFIt = function(fn, simple){
		return simple ?
			function() {
				rAF(fn);
			} :
			function(){
				var that = this;
				var args = arguments;
				rAF(function(){
					fn.apply(that, args);
				});
			}
		;
	};

	var throttle = function(fn){
		var running;
		var lastTime = 0;
		var gDelay = lazySizesCfg.throttleDelay;
		var rICTimeout = lazySizesCfg.ricTimeout;
		var run = function(){
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback && rICTimeout > 49 ?
			function(){
				requestIdleCallback(run, {timeout: rICTimeout});

				if(rICTimeout !== lazySizesCfg.ricTimeout){
					rICTimeout = lazySizesCfg.ricTimeout;
				}
			} :
			rAFIt(function(){
				setTimeout(run);
			}, true)
		;

		return function(isPriority){
			var delay;

			if((isPriority = isPriority === true)){
				rICTimeout = 33;
			}

			if(running){
				return;
			}

			running =  true;

			delay = gDelay - (Date.now() - lastTime);

			if(delay < 0){
				delay = 0;
			}

			if(isPriority || delay < 9){
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function(){
			timeout = null;
			func();
		};
		var later = function() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function() {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	var loader = (function(){
		var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom, isBodyHidden;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = ('onscroll' in window) && !(/(gle|ing)bot/.test(navigator.userAgent));

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function(e){
			isLoading--;
			if(!e || isLoading < 0 || !e.target){
				isLoading = 0;
			}
		};

		var isVisible = function (elem) {
			if (isBodyHidden == null) {
				isBodyHidden = getCSS(document.body, 'visibility') == 'hidden';
			}

			return isBodyHidden || !(getCSS(elem.parentNode, 'visibility') == 'hidden' && getCSS(elem, 'visibility') == 'hidden');
		};

		var isNestedVisible = function(elem, elemExpand){
			var outerRect;
			var parent = elem;
			var visible = isVisible(elem);

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while(visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem){
				visible = ((getCSS(parent, 'opacity') || 1) > 0);

				if(visible && getCSS(parent, 'overflow') != 'visible'){
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left &&
						eLleft < outerRect.right &&
						eLbottom > outerRect.top - 1 &&
						eLtop < outerRect.bottom + 1
					;
				}
			}

			return visible;
		};

		var checkElements = function() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal,
				beforeExpandVal, defaultExpand, preloadExpand, hFac;
			var lazyloadElems = lazysizes.elements;

			if((loadMode = lazySizesCfg.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)){

				i = 0;

				lowRuns++;

				for(; i < eLlen; i++){

					if(!lazyloadElems[i] || lazyloadElems[i]._lazyRace){continue;}

					if(!supportScroll || (lazysizes.prematureUnveil && lazysizes.prematureUnveil(lazyloadElems[i]))){unveilElement(lazyloadElems[i]);continue;}

					if(!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)){
						elemExpand = currentExpand;
					}

					if (!defaultExpand) {
						defaultExpand = (!lazySizesCfg.expand || lazySizesCfg.expand < 1) ?
							docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370 :
							lazySizesCfg.expand;

						lazysizes._defEx = defaultExpand;

						preloadExpand = defaultExpand * lazySizesCfg.expFactor;
						hFac = lazySizesCfg.hFac;
						isBodyHidden = null;

						if(currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden){
							currentExpand = preloadExpand;
							lowRuns = 0;
						} else if(loadMode > 1 && lowRuns > 1 && isLoading < 6){
							currentExpand = defaultExpand;
						} else {
							currentExpand = shrinkExpand;
						}
					}

					if(beforeExpandVal !== elemExpand){
						eLvW = innerWidth + (elemExpand * hFac);
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand &&
						(eLtop = rect.top) <= elvH &&
						(eLright = rect.right) >= elemNegativeExpand * hFac &&
						(eLleft = rect.left) <= eLvW &&
						(eLbottom || eLright || eLleft || eLtop) &&
						(lazySizesCfg.loadHidden || isVisible(lazyloadElems[i])) &&
						((isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4)) || isNestedVisible(lazyloadElems[i], elemExpand))){
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if(isLoading > 9){break;}
					} else if(!loadedSomething && isCompleted && !autoLoadElem &&
						isLoading < 4 && lowRuns < 4 && loadMode > 2 &&
						(preloadElems[0] || lazySizesCfg.preloadAfterLoad) &&
						(preloadElems[0] || (!elemExpandVal && ((eLbottom || eLright || eLleft || eLtop) || lazyloadElems[i][_getAttribute](lazySizesCfg.sizesAttr) != 'auto')))){
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if(autoLoadElem && !loadedSomething){
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function(e){
			var elem = e.target;

			if (elem._lazyCache) {
				delete elem._lazyCache;
				return;
			}

			resetPreloading(e);
			addClass(elem, lazySizesCfg.loadedClass);
			removeClass(elem, lazySizesCfg.loadingClass);
			addRemoveLoadEvents(elem, rafSwitchLoadingClass);
			triggerEvent(elem, 'lazyloaded');
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function(e){
			rafedSwitchLoadingClass({target: e.target});
		};

		var changeIframeSrc = function(elem, src){
			var loadMode = elem.getAttribute('data-load-mode') || lazySizesCfg.iframeLoadMode;

			// loadMode can be also a string!
			if (loadMode == 0) {
				elem.contentWindow.location.replace(src);
			} else if (loadMode == 1) {
				elem.src = src;
			}
		};

		var handleSources = function(source){
			var customMedia;

			var sourceSrcset = source[_getAttribute](lazySizesCfg.srcsetAttr);

			if( (customMedia = lazySizesCfg.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) ){
				source.setAttribute('media', customMedia);
			}

			if(sourceSrcset){
				source.setAttribute('srcset', sourceSrcset);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg){
			var src, srcset, parent, isPicture, event, firesLoad;

			if(!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented){

				if(sizes){
					if(isAuto){
						addClass(elem, lazySizesCfg.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesCfg.srcsetAttr);
				src = elem[_getAttribute](lazySizesCfg.srcAttr);

				if(isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || (('src' in elem) && (srcset || src || isPicture));

				event = {target: elem};

				addClass(elem, lazySizesCfg.loadingClass);

				if(firesLoad){
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if(isPicture){
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if(srcset){
					elem.setAttribute('srcset', srcset);
				} else if(src && !isPicture){
					if(regIframe.test(elem.nodeName)){
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if(isImg && (srcset || isPicture)){
					updatePolyfill(elem, {src: src});
				}
			}

			if(elem._lazyRace){
				delete elem._lazyRace;
			}
			removeClass(elem, lazySizesCfg.lazyClass);

			rAF(function(){
				// Part of this can be removed as soon as this fix is older: https://bugs.chromium.org/p/chromium/issues/detail?id=7731 (2015)
				var isLoaded = elem.complete && elem.naturalWidth > 1;

				if( !firesLoad || isLoaded){
					if (isLoaded) {
						addClass(elem, lazySizesCfg.fastLoadedClass);
					}
					switchLoadingClass(event);
					elem._lazyCache = true;
					setTimeout(function(){
						if ('_lazyCache' in elem) {
							delete elem._lazyCache;
						}
					}, 9);
				}
				if (elem.loading == 'lazy') {
					isLoading--;
				}
			}, true);
		});

		/**
		 *
		 * @param elem { Element }
		 */
		var unveilElement = function (elem){
			if (elem._lazyRace) {return;}
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesCfg.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if( (isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesCfg.errorClass) && hasClass(elem, lazySizesCfg.lazyClass)){return;}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if(isAuto){
				 autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var afterScroll = debounce(function(){
			lazySizesCfg.loadMode = 3;
			throttledCheckElements();
		});

		var altLoadmodeScrollListner = function(){
			if(lazySizesCfg.loadMode == 3){
				lazySizesCfg.loadMode = 2;
			}
			afterScroll();
		};

		var onload = function(){
			if(isCompleted){return;}
			if(Date.now() - started < 999){
				setTimeout(onload, 999);
				return;
			}


			isCompleted = true;

			lazySizesCfg.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', altLoadmodeScrollListner, true);
		};

		return {
			_: function(){
				started = Date.now();

				lazysizes.elements = document.getElementsByClassName(lazySizesCfg.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesCfg.lazyClass + ' ' + lazySizesCfg.preloadClass);

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				addEventListener('pageshow', function (e) {
					if (e.persisted) {
						var loadingElements = document.querySelectorAll('.' + lazySizesCfg.loadingClass);

						if (loadingElements.length && loadingElements.forEach) {
							requestAnimationFrame(function () {
								loadingElements.forEach( function (img) {
									if (img.complete) {
										unveilElement(img);
									}
								});
							});
						}
					}
				});

				if(window.MutationObserver){
					new MutationObserver( throttledCheckElements ).observe( docElem, {childList: true, subtree: true, attributes: true} );
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend'].forEach(function(name){
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if((/d$|^c/.test(document.readyState))){
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if(lazysizes.elements.length){
					checkElements();
					rAF._lsFlush();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement,
			_aLSL: altLoadmodeScrollListner,
		};
	})();


	var autoSizer = (function(){
		var autosizesElems;

		var sizeElement = rAFIt(function(elem, parent, event, width){
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if(regPicture.test(parent.nodeName || '')){
				sources = parent.getElementsByTagName('source');
				for(i = 0, len = sources.length; i < len; i++){
					sources[i].setAttribute('sizes', width);
				}
			}

			if(!event.detail.dataAttr){
				updatePolyfill(elem, event.detail);
			}
		});
		/**
		 *
		 * @param elem {Element}
		 * @param dataAttr
		 * @param [width] { number }
		 */
		var getSizeElement = function (elem, dataAttr, width){
			var event;
			var parent = elem.parentNode;

			if(parent){
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', {width: width, dataAttr: !!dataAttr});

				if(!event.defaultPrevented){
					width = event.detail.width;

					if(width && width !== elem._lazysizesWidth){
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function(){
			var i;
			var len = autosizesElems.length;
			if(len){
				i = 0;

				for(; i < len; i++){
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function(){
				autosizesElems = document.getElementsByClassName(lazySizesCfg.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	})();

	var init = function(){
		if(!init.i && document.getElementsByClassName){
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	setTimeout(function(){
		if(lazySizesCfg.init){
			init();
		}
	});

	lazysizes = {
		/**
		 * @type { LazySizesConfigPartial }
		 */
		cfg: lazySizesCfg,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF,
	};

	return lazysizes;
}
));
}(lazysizes));

(function (module) {
(function(window, factory) {
	if(!window) {return;}
	var globalInstall = function(initialEvent){
		factory(window.lazySizes, initialEvent);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(module.exports){
		factory(lazysizes.exports);
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(typeof window != 'undefined' ?
	window : 0, function(window, document, lazySizes, initialEvent) {
	var cloneElementClass;
	var style = document.createElement('a').style;
	var fitSupport = 'objectFit' in style;
	var positionSupport = fitSupport && 'objectPosition' in style;
	var regCssFit = /object-fit["']*\s*:\s*["']*(contain|cover)/;
	var regCssPosition = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/;
	var blankSrc = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	var regBgUrlEscape = /\(|\)|'/;
	var positionDefaults = {
		center: 'center',
		'50% 50%': 'center',
	};

	function getObject(element){
		var css = (getComputedStyle(element, null) || {});
		var content = css.fontFamily || '';
		var objectFit = content.match(regCssFit) || '';
		var objectPosition = objectFit && content.match(regCssPosition) || '';

		if(objectPosition){
			objectPosition = objectPosition[1];
		}

		return {
			fit: objectFit && objectFit[1] || '',
			position: positionDefaults[objectPosition] || objectPosition || 'center',
		};
	}

	function generateStyleClass() {
		if (cloneElementClass) {
			return;
		}

		var styleElement = document.createElement('style');

		cloneElementClass = lazySizes.cfg.objectFitClass || 'lazysizes-display-clone';

		document.querySelector('head').appendChild(styleElement);
	}

	function removePrevClone(element) {
		var prev = element.previousElementSibling;

		if (prev && lazySizes.hC(prev, cloneElementClass)) {
			prev.parentNode.removeChild(prev);
			element.style.position = prev.getAttribute('data-position') || '';
			element.style.visibility = prev.getAttribute('data-visibility') || '';
		}
	}

	function initFix(element, config){
		var switchClassesAdded, addedSrc, styleElement, styleElementStyle;
		var lazysizesCfg = lazySizes.cfg;

		var onChange = function(){
			var src = element.currentSrc || element.src;

			if(src && addedSrc !== src){
				addedSrc = src;
				styleElementStyle.backgroundImage = 'url(' + (regBgUrlEscape.test(src) ? JSON.stringify(src) : src ) + ')';

				if(!switchClassesAdded){
					switchClassesAdded = true;
					lazySizes.rC(styleElement, lazysizesCfg.loadingClass);
					lazySizes.aC(styleElement, lazysizesCfg.loadedClass);
				}
			}
		};
		var rafedOnChange = function(){
			lazySizes.rAF(onChange);
		};

		element._lazysizesParentFit = config.fit;

		element.addEventListener('lazyloaded', rafedOnChange, true);
		element.addEventListener('load', rafedOnChange, true);

		lazySizes.rAF(function(){

			var hideElement = element;
			var container = element.parentNode;

			if(container.nodeName.toUpperCase() == 'PICTURE'){
				hideElement = container;
				container = container.parentNode;
			}

			removePrevClone(hideElement);

			if (!cloneElementClass) {
				generateStyleClass();
			}

			styleElement = element.cloneNode(false);
			styleElementStyle = styleElement.style;

			styleElement.addEventListener('load', function(){
				var curSrc = styleElement.currentSrc || styleElement.src;

				if(curSrc && curSrc != blankSrc){
					styleElement.src = blankSrc;
					styleElement.srcset = '';
				}
			});

			lazySizes.rC(styleElement, lazysizesCfg.loadedClass);
			lazySizes.rC(styleElement, lazysizesCfg.lazyClass);
			lazySizes.rC(styleElement, lazysizesCfg.autosizesClass);
			lazySizes.aC(styleElement, lazysizesCfg.loadingClass);
			lazySizes.aC(styleElement, cloneElementClass);

			['data-parent-fit', 'data-parent-container', 'data-object-fit-polyfilled',
				lazysizesCfg.srcsetAttr, lazysizesCfg.srcAttr].forEach(function(attr) {
				styleElement.removeAttribute(attr);
			});

			styleElement.src = blankSrc;
			styleElement.srcset = '';

			styleElementStyle.backgroundRepeat = 'no-repeat';
			styleElementStyle.backgroundPosition = config.position;
			styleElementStyle.backgroundSize = config.fit;

			styleElement.setAttribute('data-position', hideElement.style.position);
			styleElement.setAttribute('data-visibility', hideElement.style.visibility);

			hideElement.style.visibility = 'hidden';
			hideElement.style.position = 'absolute';

			element.setAttribute('data-parent-fit', config.fit);
			element.setAttribute('data-parent-container', 'prev');
			element.setAttribute('data-object-fit-polyfilled', '');
			element._objectFitPolyfilledDisplay = styleElement;

			container.insertBefore(styleElement, hideElement);

			if(element._lazysizesParentFit){
				delete element._lazysizesParentFit;
			}

			if(element.complete){
				onChange();
			}
		});
	}

	if(!fitSupport || !positionSupport){
		var onRead = function(e){
			if(e.detail.instance != lazySizes){return;}

			var element = e.target;
			var obj = getObject(element);

			if(obj.fit && (!fitSupport || (obj.position != 'center'))){
				initFix(element, obj);
				return true;
			}

			return false;
		};

		window.addEventListener('lazybeforesizes', function(e) {
			if(e.detail.instance != lazySizes){return;}
			var element = e.target;

			if (element.getAttribute('data-object-fit-polyfilled') != null && !element._objectFitPolyfilledDisplay) {
				if(!onRead(e)){
					lazySizes.rAF(function () {
						element.removeAttribute('data-object-fit-polyfilled');
					});
				}
			}
		});
		window.addEventListener('lazyunveilread', onRead, true);

		if(initialEvent && initialEvent.detail){
			onRead(initialEvent);
		}
	}
}));
}(ls_objectFit));

var ls_parentFit = {exports: {}};

(function (module) {
(function(window, factory) {
	if(!window) {return;}
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(module.exports){
		factory(lazysizes.exports);
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(typeof window != 'undefined' ?
	window : 0, function(window, document, lazySizes) {

	if(!window.addEventListener){return;}

	var regDescriptors = /\s+(\d+)(w|h)\s+(\d+)(w|h)/;
	var regCssFit = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/;
	var regCssObject = /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/;
	var regPicture = /^picture$/i;
	var cfg = lazySizes.cfg;

	var getCSS = function (elem){
		return (getComputedStyle(elem, null) || {});
	};

	var parentFit = {

		getParent: function(element, parentSel){
			var parent = element;
			var parentNode = element.parentNode;

			if((!parentSel || parentSel == 'prev') && parentNode && regPicture.test(parentNode.nodeName || '')){
				parentNode = parentNode.parentNode;
			}

			if(parentSel != 'self'){
				if(parentSel == 'prev'){
					parent = element.previousElementSibling;
				} else if(parentSel && (parentNode.closest || window.jQuery)){
					parent = (parentNode.closest ?
							parentNode.closest(parentSel) :
							jQuery(parentNode).closest(parentSel)[0]) ||
						parentNode
					;
				} else {
					parent = parentNode;
				}
			}

			return parent;
		},

		getFit: function(element){
			var tmpMatch, parentObj;
			var css = getCSS(element);
			var content = css.content || css.fontFamily;
			var obj = {
				fit: element._lazysizesParentFit || element.getAttribute('data-parent-fit')
			};

			if(!obj.fit && content && (tmpMatch = content.match(regCssFit))){
				obj.fit = tmpMatch[1];
			}

			if(obj.fit){
				parentObj = element._lazysizesParentContainer || element.getAttribute('data-parent-container');

				if(!parentObj && content && (tmpMatch = content.match(regCssObject))){
					parentObj = tmpMatch[1];
				}

				obj.parent = parentFit.getParent(element, parentObj);


			} else {
				obj.fit = css.objectFit;
			}

			return obj;
		},

		getImageRatio: function(element){
			var i, srcset, media, ratio, match, width, height;
			var parent = element.parentNode;
			var elements = parent && regPicture.test(parent.nodeName || '') ?
					parent.querySelectorAll('source, img') :
					[element]
				;

			for(i = 0; i < elements.length; i++){
				element = elements[i];
				srcset = element.getAttribute(cfg.srcsetAttr) || element.getAttribute('srcset') || element.getAttribute('data-pfsrcset') || element.getAttribute('data-risrcset') || '';
				media = element._lsMedia || element.getAttribute('media');
				media = cfg.customMedia[element.getAttribute('data-media') || media] || media;

				if(srcset && (!media || (window.matchMedia && matchMedia(media) || {}).matches )){
					ratio = parseFloat(element.getAttribute('data-aspectratio'));

					if (!ratio) {
						match = srcset.match(regDescriptors);

						if (match) {
							if(match[2] == 'w'){
								width = match[1];
								height = match[3];
							} else {
								width = match[3];
								height = match[1];
							}
						} else {
							width = element.getAttribute('width');
							height = element.getAttribute('height');
						}

						ratio = width / height;
					}

					break;
				}
			}

			return ratio;
		},

		calculateSize: function(element, width){
			var displayRatio, height, imageRatio, retWidth;
			var fitObj = this.getFit(element);
			var fit = fitObj.fit;
			var fitElem = fitObj.parent;

			if(fit != 'width' && ((fit != 'contain' && fit != 'cover') || !(imageRatio = this.getImageRatio(element)))){
				return width;
			}

			if(fitElem){
				width = fitElem.clientWidth;
			} else {
				fitElem = element;
			}

			retWidth = width;

			if(fit == 'width'){
				retWidth = width;
			} else {
				height = fitElem.clientHeight;

				if((displayRatio =  width / height) && ((fit == 'cover' && displayRatio < imageRatio) || (fit == 'contain' && displayRatio > imageRatio))){
					retWidth = width * (imageRatio / displayRatio);
				}
			}

			return retWidth;
		}
	};

	lazySizes.parentFit = parentFit;

	document.addEventListener('lazybeforesizes', function(e){
		if(e.defaultPrevented || e.detail.instance != lazySizes){return;}

		var element = e.target;
		e.detail.width = parentFit.calculateSize(element, e.detail.width);
	});
}));
}(ls_parentFit));

var ls_rias = {exports: {}};

(function (module) {
(function(window, factory) {
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(module.exports){
		factory(lazysizes.exports);
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(window, function(window, document, lazySizes) {

	var config, riasCfg;
	var lazySizesCfg = lazySizes.cfg;
	var replaceTypes = {string: 1, number: 1};
	var regNumber = /^\-*\+*\d+\.*\d*$/;
	var regPicture = /^picture$/i;
	var regWidth = /\s*\{\s*width\s*\}\s*/i;
	var regHeight = /\s*\{\s*height\s*\}\s*/i;
	var regPlaceholder = /\s*\{\s*([a-z0-9]+)\s*\}\s*/ig;
	var regObj = /^\[.*\]|\{.*\}$/;
	var regAllowedSizes = /^(?:auto|\d+(px)?)$/;
	var anchor = document.createElement('a');
	var img = document.createElement('img');
	var buggySizes = ('srcset' in img) && !('sizes' in img);
	var supportPicture = !!window.HTMLPictureElement && !buggySizes;

	(function(){
		var prop;
		var noop = function(){};
		var riasDefaults = {
			prefix: '',
			postfix: '',
			srcAttr: 'data-src',
			absUrl: false,
			modifyOptions: noop,
			widthmap: {},
			ratio: false,
			traditionalRatio: false,
			aspectratio: false,
		};

		config = lazySizes && lazySizes.cfg;

		if(!config.supportsType){
			config.supportsType = function(type/*, elem*/){
				return !type;
			};
		}

		if(!config.rias){
			config.rias = {};
		}
		riasCfg = config.rias;

		if(!('widths' in riasCfg)){
			riasCfg.widths = [];
			(function (widths){
				var width;
				var i = 0;
				while(!width || width < 3000){
					i += 5;
					if(i > 30){
						i += 1;
					}
					width = (36 * i);
					widths.push(width);
				}
			})(riasCfg.widths);
		}

		for(prop in riasDefaults){
			if(!(prop in riasCfg)){
				riasCfg[prop] = riasDefaults[prop];
			}
		}
	})();

	function getElementOptions(elem, src, options){
		var attr, parent, setOption, prop, opts;
		var elemStyles = window.getComputedStyle(elem);

		if (!options) {
			parent = elem.parentNode;

			options = {
				isPicture: !!(parent && regPicture.test(parent.nodeName || ''))
			};
		} else {
			opts = {};

			for (prop in options) {
				opts[prop] = options[prop];
			}

			options = opts;
		}

		setOption = function(attr, run){
			var attrVal = elem.getAttribute('data-'+ attr);

			if (!attrVal) {
				// no data- attr, get value from the CSS
				var styles = elemStyles.getPropertyValue('--ls-' + attr);
				// at least Safari 9 returns null rather than
				// an empty string for getPropertyValue causing
				// .trim() to fail
				if (styles) {
					attrVal = styles.trim();
				}
			}

			if (attrVal) {
				if(attrVal == 'true'){
					attrVal = true;
				} else if(attrVal == 'false'){
					attrVal = false;
				} else if(regNumber.test(attrVal)){
					attrVal = parseFloat(attrVal);
				} else if(typeof riasCfg[attr] == 'function'){
					attrVal = riasCfg[attr](elem, attrVal);
				} else if(regObj.test(attrVal)){
					try {
						attrVal = JSON.parse(attrVal);
					} catch(e){}
				}
				options[attr] = attrVal;
			} else if((attr in riasCfg) && typeof riasCfg[attr] != 'function' && !options[attr]){
				options[attr] = riasCfg[attr];
			} else if(run && typeof riasCfg[attr] == 'function'){
				options[attr] = riasCfg[attr](elem, attrVal);
			}
		};

		for(attr in riasCfg){
			setOption(attr);
		}
		src.replace(regPlaceholder, function(full, match){
			if(!(match in options)){
				setOption(match, true);
			}
		});

		return options;
	}

	function replaceUrlProps(url, options){
		var candidates = [];
		var replaceFn = function(full, match){
			return (replaceTypes[typeof options[match]]) ? options[match] : full;
		};
		candidates.srcset = [];

		if(options.absUrl){
			anchor.setAttribute('href', url);
			url = anchor.href;
		}

		url = ((options.prefix || '') + url + (options.postfix || '')).replace(regPlaceholder, replaceFn);

		options.widths.forEach(function(width){
			var widthAlias = options.widthmap[width] || width;
			var ratio = options.aspectratio || options.ratio;
			var traditionalRatio = !options.aspectratio && riasCfg.traditionalRatio;
			var candidate = {
				u: url.replace(regWidth, widthAlias)
						.replace(regHeight, ratio ?
							traditionalRatio ?
								Math.round(width * ratio) :
								Math.round(width / ratio)
							: ''),
				w: width
			};

			candidates.push(candidate);
			candidates.srcset.push( (candidate.c = candidate.u + ' ' + width + 'w') );
		});
		return candidates;
	}

	function setSrc(src, opts, elem){
		var elemW = 0;
		var elemH = 0;
		var sizeElement = elem;

		if(!src){return;}

		if (opts.ratio === 'container') {
			// calculate image or parent ratio
			elemW = sizeElement.scrollWidth;
			elemH = sizeElement.scrollHeight;

			while ((!elemW || !elemH) && sizeElement !== document) {
				sizeElement = sizeElement.parentNode;
				elemW = sizeElement.scrollWidth;
				elemH = sizeElement.scrollHeight;
			}
			if (elemW && elemH) {
				opts.ratio = opts.traditionalRatio ? elemH / elemW : elemW / elemH;
			}
		}

		src = replaceUrlProps(src, opts);

		src.isPicture = opts.isPicture;

		if(buggySizes && elem.nodeName.toUpperCase() == 'IMG'){
			elem.removeAttribute(config.srcsetAttr);
		} else {
			elem.setAttribute(config.srcsetAttr, src.srcset.join(', '));
		}

		Object.defineProperty(elem, '_lazyrias', {
			value: src,
			writable: true
		});
	}

	function createAttrObject(elem, src){
		var opts = getElementOptions(elem, src);

		riasCfg.modifyOptions.call(elem, {target: elem, details: opts, detail: opts});

		lazySizes.fire(elem, 'lazyriasmodifyoptions', opts);
		return opts;
	}

	function getSrc(elem){
		return elem.getAttribute( elem.getAttribute('data-srcattr') || riasCfg.srcAttr ) || elem.getAttribute(config.srcsetAttr) || elem.getAttribute(config.srcAttr) || elem.getAttribute('data-pfsrcset') || '';
	}

	addEventListener('lazybeforesizes', function(e){
		if(e.detail.instance != lazySizes){return;}

		var elem, src, elemOpts, sourceOpts, parent, sources, i, len, sourceSrc, sizes, detail, hasPlaceholder, modified, emptyList;
		elem = e.target;

		if(!e.detail.dataAttr || e.defaultPrevented || riasCfg.disabled || !((sizes = elem.getAttribute(config.sizesAttr) || elem.getAttribute('sizes')) && regAllowedSizes.test(sizes))){return;}

		src = getSrc(elem);

		elemOpts = createAttrObject(elem, src);

		hasPlaceholder = regWidth.test(elemOpts.prefix) || regWidth.test(elemOpts.postfix);

		if(elemOpts.isPicture && (parent = elem.parentNode)){
			sources = parent.getElementsByTagName('source');
			for(i = 0, len = sources.length; i < len; i++){
				if ( hasPlaceholder || regWidth.test(sourceSrc = getSrc(sources[i])) ){
					sourceOpts = getElementOptions(sources[i], sourceSrc, elemOpts);
					setSrc(sourceSrc, sourceOpts, sources[i]);
					modified = true;
				}
			}
		}

		if ( hasPlaceholder || regWidth.test(src) ){
			setSrc(src, elemOpts, elem);
			modified = true;
		} else if (modified) {
			emptyList = [];
			emptyList.srcset = [];
			emptyList.isPicture = true;
			Object.defineProperty(elem, '_lazyrias', {
				value: emptyList,
				writable: true
			});
		}

		if(modified){
			if(supportPicture){
				elem.removeAttribute(config.srcAttr);
			} else if(sizes != 'auto') {
				detail = {
					width: parseInt(sizes, 10)
				};
				polyfill({
					target: elem,
					detail: detail
				});
			}
		}
	}, true);
	// partial polyfill
	var polyfill = (function(){
		var ascendingSort = function( a, b ) {
			return a.w - b.w;
		};

		var reduceCandidate = function (srces) {
			var lowerCandidate, bonusFactor;
			var len = srces.length;
			var candidate = srces[len -1];
			var i = 0;

			for(i; i < len;i++){
				candidate = srces[i];
				candidate.d = candidate.w / srces.w;
				if(candidate.d >= srces.d){
					if(!candidate.cached && (lowerCandidate = srces[i - 1]) &&
						lowerCandidate.d > srces.d - (0.13 * Math.pow(srces.d, 2.2))){

						bonusFactor = Math.pow(lowerCandidate.d - 0.6, 1.6);

						if(lowerCandidate.cached) {
							lowerCandidate.d += 0.15 * bonusFactor;
						}

						if(lowerCandidate.d + ((candidate.d - srces.d) * bonusFactor) > srces.d){
							candidate = lowerCandidate;
						}
					}
					break;
				}
			}
			return candidate;
		};

		var getWSet = function(elem, testPicture){
			var src;
			if(!elem._lazyrias && lazySizes.pWS && (src = lazySizes.pWS(elem.getAttribute(config.srcsetAttr || ''))).length){
				Object.defineProperty(elem, '_lazyrias', {
					value: src,
					writable: true
				});
				if(testPicture && elem.parentNode){
					src.isPicture = elem.parentNode.nodeName.toUpperCase() == 'PICTURE';
				}
			}
			return elem._lazyrias;
		};

		var getX = function(elem){
			var dpr = window.devicePixelRatio || 1;
			var optimum = lazySizes.getX && lazySizes.getX(elem);
			return Math.min(optimum || dpr, 2.4, dpr);
		};

		var getCandidate = function(elem, width){
			var sources, i, len, media, srces, src;

			srces = elem._lazyrias;

			if(srces.isPicture && window.matchMedia){
				for(i = 0, sources = elem.parentNode.getElementsByTagName('source'), len = sources.length; i < len; i++){
					if(getWSet(sources[i]) && !sources[i].getAttribute('type') && ( !(media = sources[i].getAttribute('media')) || ((matchMedia(media) || {}).matches))){
						srces = sources[i]._lazyrias;
						break;
					}
				}
			}

			if(!srces.w || srces.w < width){
				srces.w = width;
				srces.d = getX(elem);
				src = reduceCandidate(srces.sort(ascendingSort));
			}

			return src;
		};

		var polyfill = function(e){
			if(e.detail.instance != lazySizes){return;}

			var candidate;
			var elem = e.target;

			if(!buggySizes && (window.respimage || window.picturefill || lazySizesCfg.pf)){
				document.removeEventListener('lazybeforesizes', polyfill);
				return;
			}

			if(!('_lazyrias' in elem) && (!e.detail.dataAttr || !getWSet(elem, true))){
				return;
			}

			candidate = getCandidate(elem, e.detail.width);

			if(candidate && candidate.u && elem._lazyrias.cur != candidate.u){
				elem._lazyrias.cur = candidate.u;
				candidate.cached = true;
				lazySizes.rAF(function(){
					elem.setAttribute(config.srcAttr, candidate.u);
					elem.setAttribute('src', candidate.u);
				});
			}
		};

		if(!supportPicture){
			addEventListener('lazybeforesizes', polyfill);
		} else {
			polyfill = function(){};
		}

		return polyfill;

	})();

}));
}(ls_rias));

var ls_bgset = {exports: {}};

(function (module) {
(function(window, factory) {
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(module.exports){
		factory(lazysizes.exports);
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(window, function(window, document, lazySizes) {
	if(!window.addEventListener){return;}

	var lazySizesCfg = lazySizes.cfg;
	var regWhite = /\s+/g;
	var regSplitSet = /\s*\|\s+|\s+\|\s*/g;
	var regSource = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/;
	var regType = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/;
	var regBgUrlEscape = /\(|\)|'/;
	var allowedBackgroundSize = {contain: 1, cover: 1};
	var proxyWidth = function(elem){
		var width = lazySizes.gW(elem, elem.parentNode);

		if(!elem._lazysizesWidth || width > elem._lazysizesWidth){
			elem._lazysizesWidth = width;
		}
		return elem._lazysizesWidth;
	};
	var getBgSize = function(elem){
		var bgSize;

		bgSize = (getComputedStyle(elem) || {getPropertyValue: function(){}}).getPropertyValue('background-size');

		if(!allowedBackgroundSize[bgSize] && allowedBackgroundSize[elem.style.backgroundSize]){
			bgSize = elem.style.backgroundSize;
		}

		return bgSize;
	};
	var setTypeOrMedia = function(source, match){
		if(match){
			var typeMatch = match.match(regType);
			if(typeMatch && typeMatch[1]){
				source.setAttribute('type', typeMatch[1]);
			} else {
				source.setAttribute('media', lazySizesCfg.customMedia[match] || match);
			}
		}
	};
	var createPicture = function(sets, elem, img){
		var picture = document.createElement('picture');
		var sizes = elem.getAttribute(lazySizesCfg.sizesAttr);
		var ratio = elem.getAttribute('data-ratio');
		var optimumx = elem.getAttribute('data-optimumx');

		if(elem._lazybgset && elem._lazybgset.parentNode == elem){
			elem.removeChild(elem._lazybgset);
		}

		Object.defineProperty(img, '_lazybgset', {
			value: elem,
			writable: true
		});
		Object.defineProperty(elem, '_lazybgset', {
			value: picture,
			writable: true
		});

		sets = sets.replace(regWhite, ' ').split(regSplitSet);

		picture.style.display = 'none';
		img.className = lazySizesCfg.lazyClass;

		if(sets.length == 1 && !sizes){
			sizes = 'auto';
		}

		sets.forEach(function(set){
			var match;
			var source = document.createElement('source');

			if(sizes && sizes != 'auto'){
				source.setAttribute('sizes', sizes);
			}

			if((match = set.match(regSource))){
				source.setAttribute(lazySizesCfg.srcsetAttr, match[1]);

				setTypeOrMedia(source, match[2]);
				setTypeOrMedia(source, match[3]);
			} else {
				source.setAttribute(lazySizesCfg.srcsetAttr, set);
			}

			picture.appendChild(source);
		});

		if(sizes){
			img.setAttribute(lazySizesCfg.sizesAttr, sizes);
			elem.removeAttribute(lazySizesCfg.sizesAttr);
			elem.removeAttribute('sizes');
		}
		if(optimumx){
			img.setAttribute('data-optimumx', optimumx);
		}
		if(ratio) {
			img.setAttribute('data-ratio', ratio);
		}

		picture.appendChild(img);

		elem.appendChild(picture);
	};

	var proxyLoad = function(e){
		if(!e.target._lazybgset){return;}

		var image = e.target;
		var elem = image._lazybgset;
		var bg = image.currentSrc || image.src;


		if(bg){
			var useSrc = regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg;
			var event = lazySizes.fire(elem, 'bgsetproxy', {
				src: bg,
				useSrc: useSrc,
				fullSrc: null,
			});

			if(!event.defaultPrevented){
				elem.style.backgroundImage = event.detail.fullSrc || 'url(' + event.detail.useSrc + ')';
			}
		}

		if(image._lazybgsetLoading){
			lazySizes.fire(elem, '_lazyloaded', {}, false, true);
			delete image._lazybgsetLoading;
		}
	};

	addEventListener('lazybeforeunveil', function(e){
		var set, image, elem;

		if(e.defaultPrevented || !(set = e.target.getAttribute('data-bgset'))){return;}

		elem = e.target;
		image = document.createElement('img');

		image.alt = '';

		image._lazybgsetLoading = true;
		e.detail.firesLoad = true;

		createPicture(set, elem, image);

		setTimeout(function(){
			lazySizes.loader.unveil(image);

			lazySizes.rAF(function(){
				lazySizes.fire(image, '_lazyloaded', {}, true, true);
				if(image.complete) {
					proxyLoad({target: image});
				}
			});
		});

	});

	document.addEventListener('load', proxyLoad, true);

	window.addEventListener('lazybeforesizes', function(e){
		if(e.detail.instance != lazySizes){return;}
		if(e.target._lazybgset && e.detail.dataAttr){
			var elem = e.target._lazybgset;
			var bgSize = getBgSize(elem);

			if(allowedBackgroundSize[bgSize]){
				e.target._lazysizesParentFit = bgSize;

				lazySizes.rAF(function(){
					e.target.setAttribute('data-parent-fit', bgSize);
					if(e.target._lazysizesParentFit){
						delete e.target._lazysizesParentFit;
					}
				});
			}
		}
	}, true);

	document.documentElement.addEventListener('lazybeforesizes', function(e){
		if(e.defaultPrevented || !e.target._lazybgset || e.detail.instance != lazySizes){return;}
		e.detail.width = proxyWidth(e.target._lazybgset);
	});
}));
}(ls_bgset));

var ls_respimg = {exports: {}};

(function (module) {
(function(window, factory) {
	if(!window) {return;}
	var globalInstall = function(){
		factory(window.lazySizes);
		window.removeEventListener('lazyunveilread', globalInstall, true);
	};

	factory = factory.bind(null, window, window.document);

	if(module.exports){
		factory(lazysizes.exports);
	} else if(window.lazySizes) {
		globalInstall();
	} else {
		window.addEventListener('lazyunveilread', globalInstall, true);
	}
}(typeof window != 'undefined' ?
	window : 0, function(window, document, lazySizes) {
	var polyfill;
	var lazySizesCfg = lazySizes.cfg;
	var img = document.createElement('img');
	var supportSrcset = ('sizes' in img) && ('srcset' in img);
	var regHDesc = /\s+\d+h/g;
	var fixEdgeHDescriptor = (function(){
		var regDescriptors = /\s+(\d+)(w|h)\s+(\d+)(w|h)/;
		var forEach = Array.prototype.forEach;

		return function(){
			var img = document.createElement('img');
			var removeHDescriptors = function(source){
				var ratio, match;
				var srcset = source.getAttribute(lazySizesCfg.srcsetAttr);
				if(srcset){
					if((match = srcset.match(regDescriptors))){
						if(match[2] == 'w'){
							ratio = match[1] / match[3];
						} else {
							ratio = match[3] / match[1];
						}

						if(ratio){
							source.setAttribute('data-aspectratio', ratio);
						}
						source.setAttribute(lazySizesCfg.srcsetAttr, srcset.replace(regHDesc, ''));
					}
				}
			};
			var handler = function(e){
				if(e.detail.instance != lazySizes){return;}
				var picture = e.target.parentNode;

				if(picture && picture.nodeName == 'PICTURE'){
					forEach.call(picture.getElementsByTagName('source'), removeHDescriptors);
				}
				removeHDescriptors(e.target);
			};

			var test = function(){
				if(!!img.currentSrc){
					document.removeEventListener('lazybeforeunveil', handler);
				}
			};

			document.addEventListener('lazybeforeunveil', handler);

			img.onload = test;
			img.onerror = test;

			img.srcset = 'data:,a 1w 1h';

			if(img.complete){
				test();
			}
		};
	})();

	if(!lazySizesCfg.supportsType){
		lazySizesCfg.supportsType = function(type/*, elem*/){
			return !type;
		};
	}

	if (window.HTMLPictureElement && supportSrcset) {
		if(!lazySizes.hasHDescriptorFix && document.msElementsFromPoint){
			lazySizes.hasHDescriptorFix = true;
			fixEdgeHDescriptor();
		}
		return;
	}

	if(window.picturefill || lazySizesCfg.pf){return;}

	lazySizesCfg.pf = function(options){
		var i, len;
		if(window.picturefill){return;}
		for(i = 0, len = options.elements.length; i < len; i++){
			polyfill(options.elements[i]);
		}
	};

	// partial polyfill
	polyfill = (function(){
		var ascendingSort = function( a, b ) {
			return a.w - b.w;
		};
		var regPxLength = /^\s*\d+\.*\d*px\s*$/;
		var reduceCandidate = function (srces) {
			var lowerCandidate, bonusFactor;
			var len = srces.length;
			var candidate = srces[len -1];
			var i = 0;

			for(i; i < len;i++){
				candidate = srces[i];
				candidate.d = candidate.w / srces.w;

				if(candidate.d >= srces.d){
					if(!candidate.cached && (lowerCandidate = srces[i - 1]) &&
						lowerCandidate.d > srces.d - (0.13 * Math.pow(srces.d, 2.2))){

						bonusFactor = Math.pow(lowerCandidate.d - 0.6, 1.6);

						if(lowerCandidate.cached) {
							lowerCandidate.d += 0.15 * bonusFactor;
						}

						if(lowerCandidate.d + ((candidate.d - srces.d) * bonusFactor) > srces.d){
							candidate = lowerCandidate;
						}
					}
					break;
				}
			}
			return candidate;
		};

		var parseWsrcset = (function(){
			var candidates;
			var regWCandidates = /(([^,\s].[^\s]+)\s+(\d+)w)/g;
			var regMultiple = /\s/;
			var addCandidate = function(match, candidate, url, wDescriptor){
				candidates.push({
					c: candidate,
					u: url,
					w: wDescriptor * 1
				});
			};

			return function(input){
				candidates = [];
				input = input.trim();
				input
					.replace(regHDesc, '')
					.replace(regWCandidates, addCandidate)
				;

				if(!candidates.length && input && !regMultiple.test(input)){
					candidates.push({
						c: input,
						u: input,
						w: 99
					});
				}

				return candidates;
			};
		})();

		var runMatchMedia = function(){
			if(runMatchMedia.init){return;}

			runMatchMedia.init = true;
			addEventListener('resize', (function(){
				var timer;
				var matchMediaElems = document.getElementsByClassName('lazymatchmedia');
				var run = function(){
					var i, len;
					for(i = 0, len = matchMediaElems.length; i < len; i++){
						polyfill(matchMediaElems[i]);
					}
				};

				return function(){
					clearTimeout(timer);
					timer = setTimeout(run, 66);
				};
			})());
		};

		var createSrcset = function(elem, isImage){
			var parsedSet;
			var srcSet = elem.getAttribute('srcset') || elem.getAttribute(lazySizesCfg.srcsetAttr);

			if(!srcSet && isImage){
				srcSet = !elem._lazypolyfill ?
					(elem.getAttribute(lazySizesCfg.srcAttr) || elem.getAttribute('src')) :
					elem._lazypolyfill._set
				;
			}

			if(!elem._lazypolyfill || elem._lazypolyfill._set != srcSet){

				parsedSet = parseWsrcset( srcSet || '' );
				if(isImage && elem.parentNode){
					parsedSet.isPicture = elem.parentNode.nodeName.toUpperCase() == 'PICTURE';

					if(parsedSet.isPicture){
						if(window.matchMedia){
							lazySizes.aC(elem, 'lazymatchmedia');
							runMatchMedia();
						}
					}
				}

				parsedSet._set = srcSet;
				Object.defineProperty(elem, '_lazypolyfill', {
					value: parsedSet,
					writable: true
				});
			}
		};

		var getX = function(elem){
			var dpr = window.devicePixelRatio || 1;
			var optimum = lazySizes.getX && lazySizes.getX(elem);
			return Math.min(optimum || dpr, 2.5, dpr);
		};

		var matchesMedia = function(media){
			if(window.matchMedia){
				matchesMedia = function(media){
					return !media || (matchMedia(media) || {}).matches;
				};
			} else {
				return !media;
			}

			return matchesMedia(media);
		};

		var getCandidate = function(elem){
			var sources, i, len, source, srces, src, width;

			source = elem;
			createSrcset(source, true);
			srces = source._lazypolyfill;

			if(srces.isPicture){
				for(i = 0, sources = elem.parentNode.getElementsByTagName('source'), len = sources.length; i < len; i++){
					if( lazySizesCfg.supportsType(sources[i].getAttribute('type'), elem) && matchesMedia( sources[i].getAttribute('media')) ){
						source = sources[i];
						createSrcset(source);
						srces = source._lazypolyfill;
						break;
					}
				}
			}

			if(srces.length > 1){
				width = source.getAttribute('sizes') || '';
				width = regPxLength.test(width) && parseInt(width, 10) || lazySizes.gW(elem, elem.parentNode);
				srces.d = getX(elem);
				if(!srces.src || !srces.w || srces.w < width){
					srces.w = width;
					src = reduceCandidate(srces.sort(ascendingSort));
					srces.src = src;
				} else {
					src = srces.src;
				}
			} else {
				src = srces[0];
			}

			return src;
		};

		var p = function(elem){
			if(supportSrcset && elem.parentNode && elem.parentNode.nodeName.toUpperCase() != 'PICTURE'){return;}
			var candidate = getCandidate(elem);

			if(candidate && candidate.u && elem._lazypolyfill.cur != candidate.u){
				elem._lazypolyfill.cur = candidate.u;
				candidate.cached = true;
				elem.setAttribute(lazySizesCfg.srcAttr, candidate.u);
				elem.setAttribute('src', candidate.u);
			}
		};

		p.parse = parseWsrcset;

		return p;
	})();

	if(lazySizesCfg.loadedClass && lazySizesCfg.loadingClass){
		(function(){
			var sels = [];
			['img[sizes$="px"][srcset].', 'picture > img:not([srcset]).'].forEach(function(sel){
				sels.push(sel + lazySizesCfg.loadedClass);
				sels.push(sel + lazySizesCfg.loadingClass);
			});
			lazySizesCfg.pf({
				elements: document.querySelectorAll(sels.join(', '))
			});
		})();

	}
}));
}(ls_respimg));

/*!
 * slide-anim
 * https://github.com/yomotsu/slide-anim
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
var global$1 = window;
var isPromiseSuppoted = typeof global$1.Promise === 'function';
var PromiseLike = isPromiseSuppoted ? global$1.Promise : (function () {
    function PromiseLike(executor) {
        var callback = function () { };
        var resolve = function () {
            callback();
        };
        executor(resolve);
        return {
            then: function (_callback) {
                callback = _callback;
            }
        };
    }
    return PromiseLike;
}());

var pool = [];
var inAnimItems = {
    add: function (el, defaultStyle, timeoutId, onCancelled) {
        var inAnimItem = { el: el, defaultStyle: defaultStyle, timeoutId: timeoutId, onCancelled: onCancelled };
        this.remove(el);
        pool.push(inAnimItem);
    },
    remove: function (el) {
        var index = inAnimItems.findIndex(el);
        if (index === -1)
            return;
        var inAnimItem = pool[index];
        clearTimeout(inAnimItem.timeoutId);
        inAnimItem.onCancelled();
        pool.splice(index, 1);
    },
    find: function (el) {
        return pool[inAnimItems.findIndex(el)];
    },
    findIndex: function (el) {
        var index = -1;
        pool.some(function (item, i) {
            if (item.el === el) {
                index = i;
                return true;
            }
            return false;
        });
        return index;
    }
};

var CSS_EASEOUT_EXPO = 'cubic-bezier( 0.19, 1, 0.22, 1 )';
function slideDown(el, options) {
    if (options === void 0) { options = {}; }
    return new PromiseLike(function (resolve) {
        if (inAnimItems.findIndex(el) !== -1)
            return;
        var _isVisible = isVisible(el);
        var hasEndHeight = typeof options.endHeight === 'number';
        var display = options.display || 'block';
        var duration = options.duration || 400;
        var onCancelled = options.onCancelled || function () { };
        var defaultStyle = el.getAttribute('style') || '';
        var style = window.getComputedStyle(el);
        var defaultStyles = getDefaultStyles(el, display);
        var isBorderBox = /border-box/.test(style.getPropertyValue('box-sizing'));
        var contentHeight = defaultStyles.height;
        var minHeight = defaultStyles.minHeight;
        var paddingTop = defaultStyles.paddingTop;
        var paddingBottom = defaultStyles.paddingBottom;
        var borderTop = defaultStyles.borderTop;
        var borderBottom = defaultStyles.borderBottom;
        var cssDuration = duration + "ms";
        var cssEasing = CSS_EASEOUT_EXPO;
        var cssTransition = [
            "height " + cssDuration + " " + cssEasing,
            "min-height " + cssDuration + " " + cssEasing,
            "padding " + cssDuration + " " + cssEasing,
            "border-width " + cssDuration + " " + cssEasing
        ].join();
        var startHeight = _isVisible ? style.height : '0px';
        var startMinHeight = _isVisible ? style.minHeight : '0px';
        var startPaddingTop = _isVisible ? style.paddingTop : '0px';
        var startPaddingBottom = _isVisible ? style.paddingBottom : '0px';
        var startBorderTopWidth = _isVisible ? style.borderTopWidth : '0px';
        var startBorderBottomWidth = _isVisible ? style.borderBottomWidth : '0px';
        var endHeight = (function () {
            if (hasEndHeight)
                return options.endHeight + "px";
            return !isBorderBox ?
                contentHeight - paddingTop - paddingBottom + "px" :
                contentHeight + borderTop + borderBottom + "px";
        })();
        var endMinHeight = minHeight + "px";
        var endPaddingTop = paddingTop + "px";
        var endPaddingBottom = paddingBottom + "px";
        var endBorderTopWidth = borderTop + "px";
        var endBorderBottomWidth = borderBottom + "px";
        if (startHeight === endHeight &&
            startPaddingTop === endPaddingTop &&
            startPaddingBottom === endPaddingBottom &&
            startBorderTopWidth === endBorderTopWidth &&
            startBorderBottomWidth === endBorderBottomWidth) {
            resolve();
            return;
        }
        requestAnimationFrame(function () {
            el.style.height = startHeight;
            el.style.minHeight = startMinHeight;
            el.style.paddingTop = startPaddingTop;
            el.style.paddingBottom = startPaddingBottom;
            el.style.borderTopWidth = startBorderTopWidth;
            el.style.borderBottomWidth = startBorderBottomWidth;
            el.style.display = display;
            el.style.overflow = 'hidden';
            el.style.visibility = 'visible';
            el.style.transition = cssTransition;
            el.style.webkitTransition = cssTransition;
            requestAnimationFrame(function () {
                el.style.height = endHeight;
                el.style.minHeight = endMinHeight;
                el.style.paddingTop = endPaddingTop;
                el.style.paddingBottom = endPaddingBottom;
                el.style.borderTopWidth = endBorderTopWidth;
                el.style.borderBottomWidth = endBorderBottomWidth;
            });
        });
        var timeoutId = setTimeout(function () {
            resetStyle(el);
            el.style.display = display;
            if (hasEndHeight) {
                el.style.height = options.endHeight + "px";
                el.style.overflow = "hidden";
            }
            inAnimItems.remove(el);
            resolve();
        }, duration);
        inAnimItems.add(el, defaultStyle, timeoutId, onCancelled);
    });
}
function slideUp(el, options) {
    if (options === void 0) { options = {}; }
    return new PromiseLike(function (resolve) {
        if (inAnimItems.findIndex(el) !== -1)
            return;
        var _isVisible = isVisible(el);
        var display = options.display || 'block';
        var duration = options.duration || 400;
        var onCancelled = options.onCancelled || function () { };
        if (!_isVisible) {
            resolve();
            return;
        }
        var defaultStyle = el.getAttribute('style') || '';
        var style = window.getComputedStyle(el);
        var isBorderBox = /border-box/.test(style.getPropertyValue('box-sizing'));
        var minHeight = pxToNumber(style.getPropertyValue('min-height'));
        var paddingTop = pxToNumber(style.getPropertyValue('padding-top'));
        var paddingBottom = pxToNumber(style.getPropertyValue('padding-bottom'));
        var borderTop = pxToNumber(style.getPropertyValue('border-top-width'));
        var borderBottom = pxToNumber(style.getPropertyValue('border-bottom-width'));
        var contentHeight = el.scrollHeight;
        var cssDuration = duration + 'ms';
        var cssEasing = CSS_EASEOUT_EXPO;
        var cssTransition = [
            "height " + cssDuration + " " + cssEasing,
            "padding " + cssDuration + " " + cssEasing,
            "border-width " + cssDuration + " " + cssEasing
        ].join();
        var startHeight = !isBorderBox ?
            contentHeight - paddingTop - paddingBottom + "px" :
            contentHeight + borderTop + borderBottom + "px";
        var startMinHeight = minHeight + "px";
        var startPaddingTop = paddingTop + "px";
        var startPaddingBottom = paddingBottom + "px";
        var startBorderTopWidth = borderTop + "px";
        var startBorderBottomWidth = borderBottom + "px";
        requestAnimationFrame(function () {
            el.style.height = startHeight;
            el.style.minHeight = startMinHeight;
            el.style.paddingTop = startPaddingTop;
            el.style.paddingBottom = startPaddingBottom;
            el.style.borderTopWidth = startBorderTopWidth;
            el.style.borderBottomWidth = startBorderBottomWidth;
            el.style.display = display;
            el.style.overflow = 'hidden';
            el.style.transition = cssTransition;
            el.style.webkitTransition = cssTransition;
            requestAnimationFrame(function () {
                el.style.height = '0';
                el.style.minHeight = '0';
                el.style.paddingTop = '0';
                el.style.paddingBottom = '0';
                el.style.borderTopWidth = '0';
                el.style.borderBottomWidth = '0';
            });
        });
        var timeoutId = setTimeout(function () {
            resetStyle(el);
            el.style.display = 'none';
            inAnimItems.remove(el);
            resolve();
        }, duration);
        inAnimItems.add(el, defaultStyle, timeoutId, onCancelled);
    });
}
function slideStop(el) {
    var elementObject = inAnimItems.find(el);
    if (!elementObject)
        return;
    var style = window.getComputedStyle(el);
    var height = style.height;
    var paddingTop = style.paddingTop;
    var paddingBottom = style.paddingBottom;
    var borderTopWidth = style.borderTopWidth;
    var borderBottomWidth = style.borderBottomWidth;
    resetStyle(el);
    el.style.height = height;
    el.style.paddingTop = paddingTop;
    el.style.paddingBottom = paddingBottom;
    el.style.borderTopWidth = borderTopWidth;
    el.style.borderBottomWidth = borderBottomWidth;
    el.style.overflow = 'hidden';
    inAnimItems.remove(el);
}
function isVisible(el) {
    return el.offsetHeight !== 0;
}
function resetStyle(el) {
    el.style.visibility = '';
    el.style.height = '';
    el.style.minHeight = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.borderTopWidth = '';
    el.style.borderBottomWidth = '';
    el.style.overflow = '';
    el.style.transition = '';
    el.style.webkitTransition = '';
}
function getDefaultStyles(el, defaultDisplay) {
    if (defaultDisplay === void 0) { defaultDisplay = 'block'; }
    var defaultStyle = el.getAttribute('style') || '';
    var style = window.getComputedStyle(el);
    el.style.visibility = 'hidden';
    el.style.display = defaultDisplay;
    var width = pxToNumber(style.getPropertyValue('width'));
    el.style.position = 'absolute';
    el.style.width = width + "px";
    el.style.height = '';
    el.style.minHeight = '';
    el.style.paddingTop = '';
    el.style.paddingBottom = '';
    el.style.borderTopWidth = '';
    el.style.borderBottomWidth = '';
    var minHeight = pxToNumber(style.getPropertyValue('min-height'));
    var paddingTop = pxToNumber(style.getPropertyValue('padding-top'));
    var paddingBottom = pxToNumber(style.getPropertyValue('padding-bottom'));
    var borderTop = pxToNumber(style.getPropertyValue('border-top-width'));
    var borderBottom = pxToNumber(style.getPropertyValue('border-bottom-width'));
    var height = el.scrollHeight;
    el.setAttribute('style', defaultStyle);
    return {
        height: height,
        minHeight: minHeight,
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        borderTop: borderTop,
        borderBottom: borderBottom
    };
}
function pxToNumber(px) {
    return +px.replace(/px/, '');
}

function Accordion(node) {
  var labels = t$3('.accordion__label', node); // Make it accessible by keyboard

  labels.forEach(label => {
    label.href = '#';
    var icon = document.createElement('div');
    icon.classList.add('icon');
    icon.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" viewBox=\"0 0 24 24\"><path d=\"M7 10L12 15L17 10H7Z\" fill=\"currentColor\"/></svg>";
    label.append(icon);
  });
  [e$3(labels, 'click', e => {
    var {
      parentNode: group,
      nextElementSibling: content
    } = e.currentTarget;
    e.preventDefault();
    slideStop(content);

    if (isVisible(content)) {
      slideUp(content);
      group.setAttribute('data-open', false);
    } else {
      slideDown(content);
      group.setAttribute('data-open', true);
    }
  })]; // Open accordions open by default

  labels.forEach(label => {
    var {
      parentNode: group,
      nextElementSibling: content
    } = label;
    var {
      open
    } = group.dataset;

    if (open === 'true') {
      slideDown(content);
      group.setAttribute('data-open', true);
    }
  });

  function destroy() {
    return () => labelClick();
  }

  return {
    destroy
  };
}

function Accordions(nodes) {
  var accordions = [];
  if (Array.isArray(nodes) && !nodes.length) return;

  if (nodes.length) {
    accordions = nodes.map(Accordion);
  } else {
    accordions.push(Accordion(nodes));
  }

  function unload() {
    accordions.forEach(accordion => accordion.destroy());
  }

  return {
    unload
  };
}

function wrapIframes () {
  var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  elements.forEach(el => {
    var wrapper = document.createElement('div');
    wrapper.classList.add('rte__iframe');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    el.src = el.src;
  });
}

function wrapTables () {
  var elements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  elements.forEach(el => {
    var wrapper = document.createElement('div');
    wrapper.classList.add('rte__table-wrapper');
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
  });
}

register('article', {
  onLoad() {
    this.accordions = Accordions(t$3('.accordion', this.container));
    focusFormStatus(this.container);
    wrapIframes(t$3('iframe', this.container));
    wrapTables(t$3('table', this.container));
  },

  onUnload() {
    this.accordions.destroy();
  }

});

var browser = {exports: {}};

(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * DOM event delegator
 *
 * The delegator will listen
 * for events that bubble up
 * to the root node.
 *
 * @constructor
 * @param {Node|string} [root] The root node or a selector string matching the root node
 */
function Delegate(root) {
  /**
   * Maintain a map of listener
   * lists, keyed by event name.
   *
   * @type Object
   */
  this.listenerMap = [{}, {}];

  if (root) {
    this.root(root);
  }
  /** @type function() */


  this.handle = Delegate.prototype.handle.bind(this); // Cache of event listeners removed during an event cycle

  this._removedListeners = [];
}
/**
 * Start listening for events
 * on the provided DOM element
 *
 * @param  {Node|string} [root] The root node or a selector string matching the root node
 * @returns {Delegate} This method is chainable
 */


Delegate.prototype.root = function (root) {
  var listenerMap = this.listenerMap;
  var eventType; // Remove master event listeners

  if (this.rootElement) {
    for (eventType in listenerMap[1]) {
      if (listenerMap[1].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, true);
      }
    }

    for (eventType in listenerMap[0]) {
      if (listenerMap[0].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, false);
      }
    }
  } // If no root or root is not
  // a dom node, then remove internal
  // root reference and exit here


  if (!root || !root.addEventListener) {
    if (this.rootElement) {
      delete this.rootElement;
    }

    return this;
  }
  /**
   * The root node at which
   * listeners are attached.
   *
   * @type Node
   */


  this.rootElement = root; // Set up master event listeners

  for (eventType in listenerMap[1]) {
    if (listenerMap[1].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, true);
    }
  }

  for (eventType in listenerMap[0]) {
    if (listenerMap[0].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, false);
    }
  }

  return this;
};
/**
 * @param {string} eventType
 * @returns boolean
 */


Delegate.prototype.captureForType = function (eventType) {
  return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
};
/**
 * Attach a handler to one
 * event for all elements
 * that match the selector,
 * now or in the future
 *
 * The handler function receives
 * three arguments: the DOM event
 * object, the node that matched
 * the selector while the event
 * was bubbling and a reference
 * to itself. Within the handler,
 * 'this' is equal to the second
 * argument.
 *
 * The node that actually received
 * the event can be accessed via
 * 'event.target'.
 *
 * @param {string} eventType Listen for these events
 * @param {string|undefined} selector Only handle events on elements matching this selector, if undefined match root element
 * @param {function()} handler Handler function - event data passed here will be in event.data
 * @param {boolean} [useCapture] see 'useCapture' in <https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener>
 * @returns {Delegate} This method is chainable
 */


Delegate.prototype.on = function (eventType, selector, handler, useCapture) {
  var root;
  var listenerMap;
  var matcher;
  var matcherParam;

  if (!eventType) {
    throw new TypeError('Invalid event type: ' + eventType);
  } // handler can be passed as
  // the second or third argument


  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  } // Fallback to sensible defaults
  // if useCapture not set


  if (useCapture === undefined) {
    useCapture = this.captureForType(eventType);
  }

  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a type of Function');
  }

  root = this.rootElement;
  listenerMap = this.listenerMap[useCapture ? 1 : 0]; // Add master handler for type if not created yet

  if (!listenerMap[eventType]) {
    if (root) {
      root.addEventListener(eventType, this.handle, useCapture);
    }

    listenerMap[eventType] = [];
  }

  if (!selector) {
    matcherParam = null; // COMPLEX - matchesRoot needs to have access to
    // this.rootElement, so bind the function to this.

    matcher = matchesRoot.bind(this); // Compile a matcher for the given selector
  } else if (/^[a-z]+$/i.test(selector)) {
    matcherParam = selector;
    matcher = matchesTag;
  } else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
    matcherParam = selector.slice(1);
    matcher = matchesId;
  } else {
    matcherParam = selector;
    matcher = Element.prototype.matches;
  } // Add to the list of listeners


  listenerMap[eventType].push({
    selector: selector,
    handler: handler,
    matcher: matcher,
    matcherParam: matcherParam
  });
  return this;
};
/**
 * Remove an event handler
 * for elements that match
 * the selector, forever
 *
 * @param {string} [eventType] Remove handlers for events matching this type, considering the other parameters
 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
 * @returns {Delegate} This method is chainable
 */


Delegate.prototype.off = function (eventType, selector, handler, useCapture) {
  var i;
  var listener;
  var listenerMap;
  var listenerList;
  var singleEventType; // Handler can be passed as
  // the second or third argument

  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  } // If useCapture not set, remove
  // all event listeners


  if (useCapture === undefined) {
    this.off(eventType, selector, handler, true);
    this.off(eventType, selector, handler, false);
    return this;
  }

  listenerMap = this.listenerMap[useCapture ? 1 : 0];

  if (!eventType) {
    for (singleEventType in listenerMap) {
      if (listenerMap.hasOwnProperty(singleEventType)) {
        this.off(singleEventType, selector, handler);
      }
    }

    return this;
  }

  listenerList = listenerMap[eventType];

  if (!listenerList || !listenerList.length) {
    return this;
  } // Remove only parameter matches
  // if specified


  for (i = listenerList.length - 1; i >= 0; i--) {
    listener = listenerList[i];

    if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
      this._removedListeners.push(listener);

      listenerList.splice(i, 1);
    }
  } // All listeners removed


  if (!listenerList.length) {
    delete listenerMap[eventType]; // Remove the main handler

    if (this.rootElement) {
      this.rootElement.removeEventListener(eventType, this.handle, useCapture);
    }
  }

  return this;
};
/**
 * Handle an arbitrary event.
 *
 * @param {Event} event
 */


Delegate.prototype.handle = function (event) {
  var i;
  var l;
  var type = event.type;
  var root;
  var phase;
  var listener;
  var returned;
  var listenerList = [];
  var target;
  var eventIgnore = 'ftLabsDelegateIgnore';

  if (event[eventIgnore] === true) {
    return;
  }

  target = event.target; // Hardcode value of Node.TEXT_NODE
  // as not defined in IE8

  if (target.nodeType === 3) {
    target = target.parentNode;
  } // Handle SVG <use> elements in IE


  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }

  root = this.rootElement;
  phase = event.eventPhase || (event.target !== event.currentTarget ? 3 : 2); // eslint-disable-next-line default-case

  switch (phase) {
    case 1:
      //Event.CAPTURING_PHASE:
      listenerList = this.listenerMap[1][type];
      break;

    case 2:
      //Event.AT_TARGET:
      if (this.listenerMap[0] && this.listenerMap[0][type]) {
        listenerList = listenerList.concat(this.listenerMap[0][type]);
      }

      if (this.listenerMap[1] && this.listenerMap[1][type]) {
        listenerList = listenerList.concat(this.listenerMap[1][type]);
      }

      break;

    case 3:
      //Event.BUBBLING_PHASE:
      listenerList = this.listenerMap[0][type];
      break;
  }

  var toFire = []; // Need to continuously check
  // that the specific list is
  // still populated in case one
  // of the callbacks actually
  // causes the list to be destroyed.

  l = listenerList.length;

  while (target && l) {
    for (i = 0; i < l; i++) {
      listener = listenerList[i]; // Bail from this loop if
      // the length changed and
      // no more listeners are
      // defined between i and l.

      if (!listener) {
        break;
      }

      if (target.tagName && ["button", "input", "select", "textarea"].indexOf(target.tagName.toLowerCase()) > -1 && target.hasAttribute("disabled")) {
        // Remove things that have previously fired
        toFire = [];
      } // Check for match and fire
      // the event if there's one
      //
      // TODO:MCG:20120117: Need a way
      // to check if event#stopImmediatePropagation
      // was called. If so, break both loops.
      else if (listener.matcher.call(target, listener.matcherParam, target)) {
          toFire.push([event, target, listener]);
        }
    } // TODO:MCG:20120117: Need a way to
    // check if event#stopPropagation
    // was called. If so, break looping
    // through the DOM. Stop if the
    // delegation root has been reached


    if (target === root) {
      break;
    }

    l = listenerList.length; // Fall back to parentNode since SVG children have no parentElement in IE

    target = target.parentElement || target.parentNode; // Do not traverse up to document root when using parentNode, though

    if (target instanceof HTMLDocument) {
      break;
    }
  }

  var ret;

  for (i = 0; i < toFire.length; i++) {
    // Has it been removed during while the event function was fired
    if (this._removedListeners.indexOf(toFire[i][2]) > -1) {
      continue;
    }

    returned = this.fire.apply(this, toFire[i]); // Stop propagation to subsequent
    // callbacks if the callback returned
    // false

    if (returned === false) {
      toFire[i][0][eventIgnore] = true;
      toFire[i][0].preventDefault();
      ret = false;
      break;
    }
  }

  return ret;
};
/**
 * Fire a listener on a target.
 *
 * @param {Event} event
 * @param {Node} target
 * @param {Object} listener
 * @returns {boolean}
 */


Delegate.prototype.fire = function (event, target, listener) {
  return listener.handler.call(target, event, target);
};
/**
 * Check whether an element
 * matches a tag selector.
 *
 * Tags are NOT case-sensitive,
 * except in XML (and XML-based
 * languages such as XHTML).
 *
 * @param {string} tagName The tag name to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */


function matchesTag(tagName, element) {
  return tagName.toLowerCase() === element.tagName.toLowerCase();
}
/**
 * Check whether an element
 * matches the root.
 *
 * @param {?String} selector In this case this is always passed through as null and not used
 * @param {Element} element The element to test with
 * @returns boolean
 */


function matchesRoot(selector, element) {
  if (this.rootElement === window) {
    return (// Match the outer document (dispatched from document)
      element === document || // The <html> element (dispatched from document.body or document.documentElement)
      element === document.documentElement || // Or the window itself (dispatched from window)
      element === window
    );
  }

  return this.rootElement === element;
}
/**
 * Check whether the ID of
 * the element in 'this'
 * matches the given ID.
 *
 * IDs are case-sensitive.
 *
 * @param {string} id The ID to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */


function matchesId(id, element) {
  return id === element.id;
}
/**
 * Short hand for off()
 * and root(), ie both
 * with no parameters
 *
 * @return void
 */


Delegate.prototype.destroy = function () {
  this.off();
  this.root();
};

var _default = Delegate;
exports.default = _default;
module.exports = exports.default;
}(browser, browser.exports));

var Delegate = /*@__PURE__*/getDefaultExportFromCjs(browser.exports);

/* @preserve
 * https://github.com/Elkfox/Ajaxinate
 * Copyright (c) 2017 Elkfox Co Pty Ltd (elkfox.com)
 * MIT License (do not remove above copyright!)
 */

/* Configurable options;
 *
 * method: scroll or click
 * container: selector of repeating content
 * pagination: selector of pagination container
 * offset: number of pixels before the bottom to start loading more on scroll
 * loadingText: 'Loading', The text shown during when appending new content
 * callback: null, callback function after new content is appended
 *
 * Usage;
 *
 * import {Ajaxinate} from 'ajaxinate';
 *
 * new Ajaxinate({
 *   offset: 5000,
 *   loadingText: 'Loading more...',
 * });
 */

/* eslint-env browser */
function Ajaxinate(config) {
  const settings = config || {};

  const defaults = {
    method: 'scroll',
    container: '#AjaxinateContainer',
    pagination: '#AjaxinatePagination',
    offset: 0,
    loadingText: 'Loading',
    callback: null,
  };

  // Merge custom configs with defaults
  this.settings = Object.assign(defaults, settings);

  // Functions
  this.addScrollListeners = this.addScrollListeners.bind(this);
  this.addClickListener = this.addClickListener.bind(this);
  this.checkIfPaginationInView = this.checkIfPaginationInView.bind(this);
  this.preventMultipleClicks = this.preventMultipleClicks.bind(this);
  this.removeClickListener = this.removeClickListener.bind(this);
  this.removeScrollListener = this.removeScrollListener.bind(this);
  this.removePaginationElement = this.removePaginationElement.bind(this);
  this.destroy = this.destroy.bind(this);

  // Selectors
  this.containerElement = document.querySelector(this.settings.container);
  this.paginationElement = document.querySelector(this.settings.pagination);
  this.initialize();
}

Ajaxinate.prototype.initialize = function initialize() {
  if (!this.containerElement) { return; }

  const initializers = {
    click: this.addClickListener,
    scroll: this.addScrollListeners,
  };

  initializers[this.settings.method]();
};

Ajaxinate.prototype.addScrollListeners = function addScrollListeners() {
  if (!this.paginationElement) { return; }

  document.addEventListener('scroll', this.checkIfPaginationInView);
  window.addEventListener('resize', this.checkIfPaginationInView);
  window.addEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.addClickListener = function addClickListener() {
  if (!this.paginationElement) { return; }

  this.nextPageLinkElement = this.paginationElement.querySelector('a');
  this.clickActive = true;

  if (typeof this.nextPageLinkElement !== 'undefined' && this.nextPageLinkElement !== null) {
    this.nextPageLinkElement.addEventListener('click', this.preventMultipleClicks);
  }
};

Ajaxinate.prototype.preventMultipleClicks = function preventMultipleClicks(event) {
  event.preventDefault();

  if (!this.clickActive) { return; }

  this.nextPageLinkElement.innerText = this.settings.loadingText;
  this.nextPageUrl = this.nextPageLinkElement.href;
  this.clickActive = false;

  this.loadMore();
};

Ajaxinate.prototype.checkIfPaginationInView = function checkIfPaginationInView() {
  const top = this.paginationElement.getBoundingClientRect().top - this.settings.offset;
  const bottom = this.paginationElement.getBoundingClientRect().bottom + this.settings.offset;

  if (top <= window.innerHeight && bottom >= 0) {
    this.nextPageLinkElement = this.paginationElement.querySelector('a');
    this.removeScrollListener();

    if (this.nextPageLinkElement) {
      this.nextPageLinkElement.innerText = this.settings.loadingText;
      this.nextPageUrl = this.nextPageLinkElement.href;

      this.loadMore();
    }
  }
};

Ajaxinate.prototype.loadMore = function loadMore() {
  this.request = new XMLHttpRequest();

  this.request.onreadystatechange = function success() {
    if (!this.request.responseXML) { return; }
    if (!this.request.readyState === 4 || !this.request.status === 200) { return; }

    const newContainer = this.request.responseXML.querySelectorAll(this.settings.container)[0];
    const newPagination = this.request.responseXML.querySelectorAll(this.settings.pagination)[0];

    this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);

    if (typeof newPagination === 'undefined') {
      this.removePaginationElement();
    } else {
      this.paginationElement.innerHTML = newPagination.innerHTML;

      if (this.settings.callback && typeof this.settings.callback === 'function') {
        this.settings.callback(this.request.responseXML);
      }

      this.initialize();
    }
  }.bind(this);

  this.request.open('GET', this.nextPageUrl);
  this.request.responseType = 'document';
  this.request.send();
};

Ajaxinate.prototype.removeClickListener = function removeClickListener() {
  this.nextPageLinkElement.removeEventListener('click', this.preventMultipleClicks);
};

Ajaxinate.prototype.removePaginationElement = function removePaginationElement() {
  this.paginationElement.innerHTML = '';
  this.destroy();
};

Ajaxinate.prototype.removeScrollListener = function removeScrollListener() {
  document.removeEventListener('scroll', this.checkIfPaginationInView);
  window.removeEventListener('resize', this.checkIfPaginationInView);
  window.removeEventListener('orientationchange', this.checkIfPaginationInView);
};

Ajaxinate.prototype.destroy = function destroy() {
  const destroyers = {
    click: this.removeClickListener,
    scroll: this.removeScrollListener,
  };

  destroyers[this.settings.method]();

  return this;
};

var priceRange = container => {
  var inputs = t$3('input', container);
  var minInput = inputs[0];
  var maxInput = inputs[1];
  var events = [e$3(inputs, 'change', onRangeChange), c('filters:range-removed', () => reset())];
  var slider = n$2('[data-range-slider]', container);
  import('./nouislider-6e48ca79.js').then(function (n) { return n.n; }).then(_ref => {
    var {
      default: noUiSlider
    } = _ref;
    noUiSlider.create(slider, {
      start: [minInput.value ? minInput.value : minInput.getAttribute('min'), maxInput.value ? maxInput.value : maxInput.getAttribute('max')],
      connect: true,
      range: {
        'min': parseInt(minInput.getAttribute('min')),
        'max': parseInt(maxInput.getAttribute('max'))
      },
      handleAttributes: [{
        'aria-label': 'lower'
      }, {
        'aria-label': 'upper'
      }]
    });
    slider.noUiSlider.on('set', e => {
      var max, min;
      [min, max] = e;
      minInput.value = Math.floor(min);
      maxInput.value = Math.floor(max);
      fireChangeEvent();
      setMinAndMaxValues();
    });
  });
  setMinAndMaxValues();

  function setMinAndMaxValues() {
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  function adjustToValidValues(input) {
    var value = Number(input.value);
    var min = Number(input.getAttribute('min'));
    var max = Number(input.getAttribute('max'));
    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }

  function fireChangeEvent() {
    minInput.dispatchEvent(new Event('change', {
      bubbles: true
    }));
    maxInput.dispatchEvent(new Event('change', {
      bubbles: true
    }));
  }

  function onRangeChange(event) {
    adjustToValidValues(event.currentTarget);
    setMinAndMaxValues();
    if (minInput.value === '' && maxInput.value === '') return;
    var currentMax, currentMin;
    [currentMin, currentMax] = slider.noUiSlider.get();
    currentMin = Math.floor(currentMin);
    currentMax = Math.floor(currentMax);
    if (currentMin !== Math.floor(minInput.value)) slider.noUiSlider.set([minInput.value, null]);
    if (currentMax !== Math.floor(maxInput.value)) slider.noUiSlider.set([null, maxInput.value]);
  }

  function validateRange() {
    inputs.forEach(input => setMinAndMaxValues());
  }

  var reset = () => {
    slider.noUiSlider.set([minInput.getAttribute('min'), maxInput.getAttribute('max')]);
    minInput.value = '';
    maxInput.value = '';
    fireChangeEvent();
    setMinAndMaxValues();
  };

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
    slider.noUiSlider.destroy();
  };

  return {
    unload,
    reset,
    validateRange
  };
};

var FILTERS_REMOVE = 'collection:filters:remove';
var RANGE_REMOVE = 'collection:range:remove';
var EVERYTHING_CLEAR = 'collection:clear';
var FILTERS_UPDATE = 'collection:filters:update';
var updateFilters = target => r$2(FILTERS_UPDATE, null, {
  target
});
var removeFilters = target => r$2(FILTERS_REMOVE, null, {
  target
});
var removeRange = () => r$2(RANGE_REMOVE);
var filtersUpdated = cb => c(FILTERS_UPDATE, cb);
var filtersRemoved = cb => c(FILTERS_REMOVE, cb);
var everythingCleared = cb => c(EVERYTHING_CLEAR, cb);
var rangeRemoved = cb => c(RANGE_REMOVE, cb);

var classes$c = {
  active: 'active',
  closed: 'closed'
};
var ls$1 = {
  getClosed: () => e$1('closed_sidebar_groups') || [],
  setClosed: val => r$1('closed_sidebar_groups', JSON.stringify(val))
};
var sel$2 = {
  heading: '[data-heading]',
  tag: '[data-tag]',
  sort: '[data-sort]',
  priceRange: '[data-price-range]',
  getGroup: group => "[data-group=\"".concat(group, "\"]")
};
var sidebar = (node => {
  if (!node) return Function();
  var sidebarForm = n$2('[data-filter-form]', node);
  var events = [e$3(node, 'click', handleClick), e$3(node, 'change', handleChange)];
  var range = null;
  var rangeContainer = n$2(sel$2.priceRange, sidebarForm);

  if (rangeContainer) {
    range = priceRange(rangeContainer);
  }

  function handleChange(evt) {
    var {
      sort,
      filter,
      rangeInput
    } = evt.target.dataset;

    if (rangeInput || sort || filter) {
      updateFilters(sidebarForm);
    }
  }

  function handleClick(evt) {
    var {
      heading
    } = evt.target.dataset;

    if (heading) {
      evt.preventDefault();
      var {
        nextElementSibling: content
      } = evt.target;
      var contentContainsSwatches = a$1(content, 'has-swatch');
      var blockType = contentContainsSwatches ? 'flex' : 'block';
      slideStop(content);
      var current = ls$1.getClosed();

      if (isVisible(content)) {
        u$2(evt.target, classes$c.closed);
        slideUp(content, {
          display: blockType
        });
        ls$1.setClosed([...current, heading]);
      } else {
        i$1(evt.target, classes$c.closed);
        slideDown(content, {
          display: blockType
        });
        ls$1.setClosed(current.filter(item => item !== heading));
      }
    }
  }

  function unload() {
    range && range.unload();
    events.forEach(unsubscribe => unsubscribe());
  }

  return () => {
    unload();
  };
});

// Ajaxinate custmoizer fix https://github.com/Elkfox/Ajaxinate/issues/26
var AjaxinateShim = lib => {
  lib.prototype.loadMore = function getTheHtmlOfTheNextPageWithAnAjaxRequest() {
    this.request = new XMLHttpRequest();

    this.request.onreadystatechange = function success() {
      if (this.request.readyState === 4 && this.request.status === 200) {
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(this.request.responseText, 'text/html');
        var newContainer = htmlDoc.querySelectorAll(this.settings.container)[0];
        var newPagination = htmlDoc.querySelectorAll(this.settings.pagination)[0];
        this.containerElement.insertAdjacentHTML('beforeend', newContainer.innerHTML);
        this.paginationElement.innerHTML = newPagination.innerHTML;

        if (this.settings.callback && typeof this.settings.callback === 'function') {
          this.settings.callback(this.request.responseXML);
        }

        this.initialize();
      }
    }.bind(this);

    this.request.open('GET', this.nextPageUrl, false);
    this.request.send();
  };
};

/**
 * Returns a product JSON object when passed a product URL
 * @param {*} url
 */

/**
 * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */
function getVariantFromSerializedArray(product, collection) {
  _validateProductStructure(product);

  // If value is an array of options
  var optionArray = _createOptionArrayFromOptionCollection(product, collection);
  return getVariantFromOptionArray(product, optionArray);
}

/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */
function getVariantFromOptionArray(product, options) {
  _validateProductStructure(product);
  _validateOptionsArray(options);

  var result = product.variants.filter(function(variant) {
    return options.every(function(option, index) {
      return variant.options[index] === option;
    });
  });

  return result[0] || null;
}

/**
 * Creates an array of selected options from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 * @param {Object} product Product JSON object
 * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
 */
function _createOptionArrayFromOptionCollection(product, collection) {
  _validateProductStructure(product);
  _validateSerializedArray(collection);

  var optionArray = [];

  collection.forEach(function(option) {
    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        optionArray[i] = option.value;
        break;
      }
    }
  });

  return optionArray;
}

/**
 * Check if the product data is a valid JS object
 * Error will be thrown if type is invalid
 * @param {object} product Product JSON object
 */
function _validateProductStructure(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(product + ' is empty.');
  }
}

/**
 * Validate the structure of the array
 * It must be formatted like jQuery's serializeArray()
 * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
 */
function _validateSerializedArray(collection) {
  if (!Array.isArray(collection)) {
    throw new TypeError(collection + ' is not an array.');
  }

  if (collection.length === 0) {
    return [];
  }

  if (collection[0].hasOwnProperty('name')) {
    if (typeof collection[0].name !== 'string') {
      throw new TypeError(
        'Invalid value type passed for name of option ' +
          collection[0].name +
          '. Value should be string.'
      );
    }
  } else {
    throw new Error(collection[0] + 'does not contain name key.');
  }
}

/**
 * Validate the structure of the array
 * It must be formatted as list of values
 * @param {Array} collection Array of object (e.g. ['36', 'Black'])
 */
function _validateOptionsArray(options) {
  if (Array.isArray(options) && typeof options[0] === 'object') {
    throw new Error(options + 'is not a valid array of options.');
  }
}

function listeners() {
  var all = [];

  var add = (element, event, func) => {
    all.push({
      element,
      event,
      func
    });
    element.addEventListener(event, func);
  };

  var removeAll = () => {
    all.forEach(listener => {
      listener.element.removeEventListener(listener.event, listener.func);
    });
    all.length = 0;
  };

  return {
    add,
    removeAll
  };
}

var selectors$t = {
  idInput: '[name="id"]',
  optionInput: '[name^="options"]',
  quantityInput: '[name="quantity"]',
  propertyInput: '[name^="properties"]'
};
var defaultOptions = {
  variantSelector: selectors$t.idInput
};
function ProductForm(form, prod) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var config = Object.assign({}, defaultOptions, opts);
  var product = validateProductObject(prod);
  var listeners$1 = listeners();

  var getOptions = () => {
    return _serializeOptionValues(optionInputs, function (item) {
      var regex = /(?:^(options\[))(.*?)(?:\])/;
      item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'

      return item;
    });
  };

  var getVariant = () => {
    return getVariantFromSerializedArray(product, getOptions());
  };

  var getProperties = () => {
    var properties = _serializePropertyValues(propertyInputs, function (propertyName) {
      var regex = /(?:^(properties\[))(.*?)(?:\])/;
      var name = regex.exec(propertyName)[2]; // Use just the value between 'properties[' and ']'

      return name;
    });

    return Object.entries(properties).length === 0 ? null : properties;
  };

  var getQuantity = () => {
    return quantityInputs[0] ? Number.parseInt(quantityInputs[0].value, 10) : 1;
  };

  var getProductFormEventData = () => ({
    options: getOptions(),
    variant: getVariant(),
    properties: getProperties(),
    quantity: getQuantity()
  });

  var onFormEvent = cb => {
    if (typeof cb === 'undefined') return;
    return event => {
      event.dataset = getProductFormEventData();
      cb(event);
    };
  };

  var setIdInputValue = value => {
    var idInputElement = form.querySelector(config.variantSelector);

    if (!idInputElement) {
      idInputElement = document.createElement('input');
      idInputElement.type = 'hidden';
      idInputElement.name = 'id';
      form.appendChild(idInputElement);
    }

    idInputElement.value = value.toString();
  };

  var onSubmit = event => {
    event.dataset = getProductFormEventData();
    setIdInputValue(event.dataset.variant.id);

    if (config.onFormSubmit) {
      config.onFormSubmit(event);
    }
  };

  var initInputs = (selector, cb) => {
    var elements = [...form.querySelectorAll(selector)];
    return elements.map(element => {
      listeners$1.add(element, 'change', onFormEvent(cb));
      return element;
    });
  };

  listeners$1.add(form, 'submit', onSubmit);
  var optionInputs = initInputs(selectors$t.optionInput, config.onOptionChange);
  var quantityInputs = initInputs(selectors$t.quantityInput, config.onQuantityChange);
  var propertyInputs = initInputs(selectors$t.propertyInput, config.onPropertyChange);

  var destroy = () => {
    listeners$1.removeAll();
  };

  return {
    getVariant,
    destroy
  };
}

function validateProductObject(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (typeof product.variants[0].options === 'undefined') {
    throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
  }

  return product;
}

function _serializeOptionValues(inputs, transform) {
  return inputs.reduce(function (options, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== 'radio' && input.type !== 'checkbox' // Or if its any other type of input
    ) {
      options.push(transform({
        name: input.name,
        value: input.value
      }));
    }

    return options;
  }, []);
}

function _serializePropertyValues(inputs, transform) {
  return inputs.reduce(function (properties, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== 'radio' && input.type !== 'checkbox' // Or if its any other type of input
    ) {
      properties[transform(input.name)] = input.value;
    }

    return properties;
  }, {});
}

var selectors$s = {
  product: {
    addButton: '[data-add-button]',
    addButtonText: '[data-add-button-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    form: '[data-product-form]',
    imageById: id => "[data-image-id='".concat(id, "']"),
    imageWrapper: '[data-product-image-wrapper]',
    optionById: id => "[value='".concat(id, "']"),
    price: '[data-product-price]',
    thumb: '[data-product-single-thumbnail]',
    thumbById: id => "[data-thumbnail-id='".concat(id, "']"),
    thumbs: '[data-product-thumbnails]',
    variantSelect: '[data-variant-select]',
    zoom: '[data-product-zoom]',
    storeAvailability: '[data-store-availability-container]'
  }
};

function dcx(t){return function(){for(var n=[],e=arguments.length;e--;)n[e]=arguments[e];n.reduce(function(t,n){return t.concat("object"==typeof n?Object.keys(n).map(function(t){return [t,n[t]]}):[[n,!0]])},[]).map(function(n){var e;(e=t.classList)[n[1]?"add":"remove"].apply(e,n[0].split(" "));});}}

var createSwatchGroup = function createSwatchGroup(container, group) {
  var {
    productOption
  } = group.dataset;
  var swatches = t$3('[data-product-swatch]', group);
  var sel = n$2("select#".concat(productOption), container);
  sel.parentElement.style.display = 'none';

  var handleClick = evt => {
    evt.preventDefault();
    var swatch = evt.target;
    var classes = [...swatch.classList];
    var {
      productSwatchOption: selected,
      label
    } = swatch.dataset;
    if (!classes.includes('product__color-swatch') || classes.includes('selected')) return; // Update swatch color label value

    var optionSelectedLabel = n$2('[data-swatch-selected]', evt.currentTarget.closest('.product__variant-select'));
    if (optionSelectedLabel) optionSelectedLabel.innerHTML = label;
    swatches.forEach(s => dcx(s)({
      selected: s.dataset.productSwatchOption === selected
    }));
    var opt = n$2("select#".concat(productOption, " [data-value-handle=\"").concat(selected, "\"]"), container);
    opt.selected = true;
    sel.dispatchEvent(new Event('change'));
  };

  group.addEventListener('click', handleClick);
  return () => group.removeEventListener('click', handleClick);
};

function createSwatchGroups (container, groupSelector) {
  var swatchGroups = t$3(groupSelector, container);
  if (swatchGroups.length < 1) return;
  var groups = [];
  swatchGroups.forEach(group => groups.push(createSwatchGroup(container, group)));
  return () => groups.forEach(g => g());
}

var getProduct = (handle => cb => fetch("".concat(window.theme.routes.products, "/").concat(handle, ".js")).then(res => res.json()).then(data => cb(data)).catch(err => console.log(err.message)));

function updateBuyButton (_ref) {
  var {
    available
  } = _ref;
  var section = this.container;
  var btn = section.querySelector(selectors$s.product.addButton);
  var text = btn.querySelector(selectors$s.product.addButtonText);
  var {
    langAvailable,
    langSoldOut
  } = btn.dataset;

  if (available) {
    btn.removeAttribute('disabled');
    text.textContent = langAvailable;
  } else {
    btn.setAttribute('disabled', 'disabled');
    text.textContent = langSoldOut;
  }
}

var {
  product: selector$4
} = selectors$s;
var classes$b = {
  activeThumb: 'active-thumbnail',
  hide: 'hide'
};

var switchImage = function switchImage(imageId, autoPlay) {
  if (!imageId) return;
  var section = this.container;
  var firstModel = this.container.querySelector('[data-first-model-id]');
  var firstModelId = firstModel && firstModel.dataset.firstModelId;
  var inYourSpaceButton = this.container.querySelector('.bttn.product__in-space-bttn');
  var newImage = section.querySelector(selector$4.imageWrapper + selector$4.imageById(imageId));
  var otherImages = section.querySelectorAll("".concat(selector$4.imageWrapper, ":not(").concat(selector$4.imageById(imageId), ")"));
  newImage.classList.remove(classes$b.hide);
  handleZoomButton.call(this, newImage);
  otherImages.forEach(image => image.classList.add(classes$b.hide));

  if (inYourSpaceButton) {
    if (newImage.dataset.type === 'model') {
      inYourSpaceButton.setAttribute('data-shopify-model3d-id', newImage.dataset.imageId);
    } else {
      inYourSpaceButton.setAttribute('data-shopify-model3d-id', firstModelId);
    }
  }
};

var setActiveThumbnail = function setActiveThumbnail(imageId) {
  var section = this.container;
  var newImageId = imageId;

  if (typeof newImageId === 'undefined') {
    newImageId = section.querySelector("".concat(selector$4.imageWrapper, ":not('.").concat(classes$b.hide, "')")).dataset.imageId;
  }

  var thumbnail = section.querySelector(selector$4.thumb + selector$4.thumbById(newImageId));
  if (!thumbnail) return;
  section.querySelectorAll(selector$4.thumb).forEach(thumb => {
    thumb.classList.remove(classes$b.activeThumb);
  });
  thumbnail.classList.add(classes$b.activeThumb);
};

var handleZoomButton = function handleZoomButton(newImage) {
  var el = this.container.querySelector(selector$4.zoom);
  if (!el) return;
  var imageLink = newImage.querySelector('a.product__image');
  var btn = dcx(el);
  btn({
    hide: !Boolean(imageLink)
  });
};

function updateMedia (id, autoPlay) {
  switchImage.call(this, id, autoPlay);
  setActiveThumbnail.call(this, id);
}

var {
  product: selector$3
} = selectors$s;
var classes$a = {
  activeThumb: 'active-thumbnail',
  hide: 'hide'
};
function updatePrices (variant) {
  var section = this.container;
  var comparePrice = section.querySelector(selector$3.comparePrice);
  var compareEls = section.querySelectorAll("".concat(selector$3.comparePrice, ", ").concat(selector$3.comparePriceText));
  var productPrices = [...section.querySelectorAll(selector$3.price)];
  productPrices.forEach(el => el.innerHTML = formatMoney(variant.price));

  if (variant.compare_at_price > variant.price) {
    comparePrice.innerHTML = formatMoney(variant.compare_at_price);
    compareEls.forEach(el => el.classList.remove(classes$a.hide));
    productPrices.forEach(el => el.classList.add('sale'));
  } else {
    comparePrice.innerHTML = '';
    compareEls.forEach(el => el.classList.add(classes$a.hide));
    productPrices.forEach(el => el.classList.remove('sale'));
  }
}

var {
  product: selector$2
} = selectors$s;

var changeImage = function changeImage(image) {
  var container = this.container;
  var currentImage = container.querySelector("".concat(selector$2.imageWrapper, " img"));
  currentImage.srcset = '';
  currentImage.src = image;
};

function updateQuickShopMedia (id) {
  changeImage.call(this, id);
}

var selectors$r = {
  productSku: '[data-product-sku]'
};
var {
  strings: {
    products: strings$1
  }
} = window.theme;
function updateSku (container, variant) {
  var skuElement = n$2(selectors$r.productSku, container);
  if (!skuElement) return;
  var {
    sku
  } = strings$1.product;

  var skuString = value => "".concat(sku, ": ").concat(value);

  if (!variant || !variant.sku) {
    skuElement.innerText = '';
    return;
  }

  skuElement.innerText = skuString(variant.sku);
}

var selectors$q = {
  counterContainer: '[data-inventory-counter]',
  inventoryMessage: '.inventory-counter__message',
  countdownBar: '.inventory-counter__bar',
  progressBar: '.inventory-counter__bar-progress'
};
var classes$9 = {
  active: 'active',
  inventoryLow: 'inventory--low'
};

var inventoryCounter = (container, config) => {
  var variantsInventories = config.variantsInventories;
  var counterContainer = n$2(selectors$q.counterContainer, container);
  var inventoryMessageElement = n$2(selectors$q.inventoryMessage, container);
  var progressBar = n$2(selectors$q.progressBar, container);
  var {
    lowInventoryThreshold,
    stockCountdownMax
  } = counterContainer.dataset; // If the threshold or countdownmax contains anything but numbers abort

  if (!lowInventoryThreshold.match(/^[0-9]+$/) || !stockCountdownMax.match(/^[0-9]+$/)) {
    return;
  }

  var threshold = parseInt(lowInventoryThreshold, 10);
  var countDownMax = parseInt(stockCountdownMax, 10);
  l(counterContainer, classes$9.active, productIventoryValid(variantsInventories[config.id]));
  checkThreshold(variantsInventories[config.id]);
  setProgressBar(variantsInventories[config.id].inventory_quantity);
  setInventoryMessage(variantsInventories[config.id].inventory_message);

  function checkThreshold(_ref) {
    var {
      inventory_policy,
      inventory_quantity,
      inventory_management
    } = _ref;
    i$1(counterContainer, classes$9.inventoryLow);

    if (inventory_management !== null && inventory_policy === 'deny') {
      if (inventory_quantity <= threshold) {
        u$2(counterContainer, classes$9.inventoryLow);
      }
    }
  }

  function setProgressBar(inventoryQuantity) {
    if (inventoryQuantity <= 0) {
      progressBar.style.width = "".concat(0, "%");
      return;
    }

    var progressValue = inventoryQuantity < countDownMax ? inventoryQuantity / countDownMax * 100 : 100;
    progressBar.style.width = "".concat(progressValue, "%");
  }

  function setInventoryMessage(message) {
    inventoryMessageElement.innerText = message;
  }

  function productIventoryValid(product) {
    return product.inventory_message && product.inventory_policy === 'deny';
  }

  var update = variant => {
    l(counterContainer, classes$9.active, variant && productIventoryValid(variantsInventories[variant.id]));
    if (!variant) return;
    checkThreshold(variantsInventories[variant.id]);
    setProgressBar(variantsInventories[variant.id].inventory_quantity);
    setInventoryMessage(variantsInventories[variant.id].inventory_message);
  };

  return {
    update
  };
};

var selectors$p = {
  sprForm: '.spr-form',
  shopifySection: '.shopify-section'
};
function reviewsHandler () {
  var sprForm = n$2(selectors$p.sprForm, document);
  var wrappingContainer = sprForm.closest(selectors$p.shopifySection); // Add wrapping section classes

  if (wrappingContainer.parentNode.classList.contains('main')) {
    u$2(wrappingContainer, 'section');
  }
}

theme;
var selectors$o = {
  unitPriceContainer: '[data-unit-price-container]',
  unitPrice: '[data-unit-price]',
  unitPriceBase: '[data-unit-base]'
};
var classes$8 = {
  available: 'unit-price--available'
};

var updateUnitPrices = (container, variant) => {
  var unitPriceContainers = t$3(selectors$o.unitPriceContainer, container);
  var unitPrices = t$3(selectors$o.unitPrice, container);
  var unitPriceBases = t$3(selectors$o.unitPriceBase, container);
  l(unitPriceContainers, classes$8.available, variant.unit_price !== undefined);
  if (!variant.unit_price) return;

  _replaceText(unitPrices, formatMoney(variant.unit_price));

  _replaceText(unitPriceBases, _getBaseUnit(variant.unit_price_measurement));
};

var _getBaseUnit = unitPriceMeasurement => {
  return unitPriceMeasurement.reference_value === 1 ? unitPriceMeasurement.reference_unit : unitPriceMeasurement.reference_value + unitPriceMeasurement.reference_unit;
};

var _replaceText = (nodeList, replacementText) => {
  nodeList.forEach(node => node.innerText = replacementText);
};

var {
  product: selector$1
} = selectors$s;
function ProductTitle(node) {
  var imageWrapper = n$2('.product-tile__image-wrapper', node);
  var quickShop = n$2('.quick-shop', node);
  var quickShopButton = n$2('.product-tile__quick-shop-button', node);
  var quantityError = n$2('[data-quantity-error]', node);
  var productFeaturedImage = null;
  var events = [];
  var callObject = {
    container: quickShop
  };

  if (imageWrapper) {
    initImageHover();
  } // A callback method that is fired whenever the user changes the value of an option input.


  function _onOptionChange(event) {
    var {
      variant
    } = event.dataset;

    if (!variant) {
      updateBuyButton.call(callObject, {
        available: false
      });
      return;
    } // We need to set the id input manually so the Dynamic Checkout Button works


    var selectedVariantOpt = n$2("".concat(selector$1.variantSelect, " ").concat(selector$1.optionById(variant.id)), quickShop);
    selectedVariantOpt.selected = true;

    if (variant.featured_media) {
      updateQuickShopMedia.call(callObject, variant.featured_image.src);
    } else {
      updateQuickShopMedia.call(callObject, productFeaturedImage);
    }

    updatePrices.call(callObject, variant);
    updateBuyButton.call(callObject, variant);
    updateUnitPrices(quickShop, variant);
  }

  function onFormSubmit(evt) {
    evt.preventDefault();
    var button = n$2(selector$1.addButton, quickShop);
    u$2(button, 'bttn--loading');
    u$2(quantityError, 'hidden');
    cart.addItem(evt.target).then(() => {
      i$1(button, 'bttn--loading');
    }).catch(() => {
      i$1(quantityError, 'hidden');
      i$1(button, 'bttn--loading');
    });
  }

  function handleOver(e) {
    var parent = e.target.closest('.product-tile');
    var first = n$2('.first', parent);
    var second = n$2('.not-first', parent);
    if (!second) return;
    u$2(first, 'hidden');
    u$2(second, 'visible');
  }

  function handleOut(e) {
    var parent = e.target.closest('.product-tile');
    var first = n$2('.first', parent);
    var second = n$2('.not-first', parent);
    if (!second) return;
    i$1(first, 'hidden');
    i$1(second, 'visible');
  }

  function handleQuickShop(e) {
    e.preventDefault();
    var formElement = n$2(selector$1.form, quickShop);
    var productForm = null;
    var {
      productHandle
    } = formElement.dataset;
    var productJSON = getProduct(productHandle);
    productJSON(data => {
      productForm = ProductForm(formElement, data, {
        onOptionChange: e => _onOptionChange(e),
        onFormSubmit: onFormSubmit
      });
      productFeaturedImage = data.featured_image;
      var variant = productForm.getVariant();

      if (variant.options.length > 1) {
        updatePrices.call(callObject, variant);
      }

      r$2('cart:toggle', state => {
        return {
          cartOpen: !state.cartOpen,
          quickShopProduct: quickShop
        };
      });
    });
  }

  function initImageHover() {
    events.push(e$3(imageWrapper, 'mouseover', handleOver));
    events.push(e$3(imageWrapper, 'mouseout', handleOut));
  }

  if (quickShopButton) {
    events.push(e$3(quickShopButton, 'click', handleQuickShop));
  }

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
}

var filtering = container => {
  var forms = t$3('[data-filter-form]', container);
  var formData, searchParams;
  setParams();

  function setParams(form) {
    form = form || forms[0];
    formData = new FormData(form);
    searchParams = new URLSearchParams(formData).toString();
  }
  /**
   * Takes the updated form element and updates all other forms with the updated values
   * @param {*} target
   */


  function syncForms(target) {
    if (!target) return;
    var targetInputs = t$3('[data-filter-item]', target);
    targetInputs.forEach(targetInput => {
      if (targetInput.type === 'checkbox' || targetInput.type === 'radio') {
        var {
          valueEscaped
        } = targetInput.dataset;
        var items = t$3("input[name='".concat(targetInput.name, "'][data-value-escaped='").concat(valueEscaped, "']"));
        items.forEach(input => {
          input.checked = targetInput.checked;
        });
      } else {
        var _items = t$3("input[name='".concat(targetInput.name, "']"));

        _items.forEach(input => {
          input.value = targetInput.value;
        });
      }
    });
  }
  /**
   * When filters are removed, set the checked attribute to false
   * for all filter inputs for that filter.
   * Can accept multiple filters
   * @param {Array} targets Array of inputs
   */


  function uncheckFilters(targets) {
    if (!targets) return;
    var selector;
    targets.forEach(target => {
      selector = !selector ? '' : ", ".concat(selector);
      var {
        name,
        valueEscaped
      } = target.dataset;
      selector = "input[name='".concat(name, "'][data-value-escaped='").concat(valueEscaped, "']").concat(selector);
    });
    var inputs = t$3(selector, container);
    inputs.forEach(input => {
      input.checked = false;
    });
  }

  function clearRangeInputs() {
    var rangeInputs = t$3('[data-range-input]', container);
    rangeInputs.forEach(input => {
      input.value = '';
    });
  }

  function resetForms() {
    forms.forEach(form => {
      form.reset();
    });
  }

  return {
    getState() {
      return {
        url: searchParams
      };
    },

    filtersUpdated(target, cb) {
      syncForms(target);
      setParams(target);
      r$2('filters:updated');
      return cb(this.getState());
    },

    removeFilters(target, cb) {
      uncheckFilters(target);
      setParams();
      r$2('filters:filter-removed');
      return cb(this.getState());
    },

    removeRange(cb) {
      clearRangeInputs();
      setParams();
      r$2('filters:range-removed');
      return cb(this.getState());
    },

    clearAll(cb) {
      searchParams = '';
      resetForms();
      return cb(this.getState());
    }

  };
};

var filterHandler = _ref => {
  var {
    container,
    partial,
    renderCB
  } = _ref;
  var subscriptions = null,
      filters = null,
      delegate = null;
  filters = filtering(container); // Set initial evx state from collection url object

  o$1(filters.getState());
  subscriptions = [filtersRemoved((_, _ref2) => {
    var {
      target
    } = _ref2;
    filters.removeFilters(target, data => {
      renderCB(data.url);
      o$1(data)();
    });
  }), rangeRemoved(() => {
    filters.removeRange(data => {
      renderCB(data.url);
      o$1(data)();
    });
  }), filtersUpdated((_, _ref3) => {
    var {
      target
    } = _ref3;
    filters.filtersUpdated(target, data => {
      renderCB(data.url);
      o$1(data)();
    });
  }), everythingCleared(() => {
    filters.clearAll(data => {
      renderCB(data.url);
      o$1(data)();
    });
  })];
  delegate = new Delegate(partial);
  delegate.on('click', '[data-remove-filter]', e => {
    e.preventDefault();
    removeFilters([e.target]);
  });
  delegate.on('click', '[data-remove-range]', e => {
    e.preventDefault();
    removeRange();
  });

  var unload = () => {
    delegate && delegate.off();
    subscriptions && subscriptions.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
};

var sel$1 = {
  filter: '[data-filter-open]',
  flyouts: '[data-filter-flyout]',
  button: '[data-button]',
  wash: '[data-filter-wash]',
  tag: '[data-tag]',
  sort: '[data-sort]',
  close: '[data-close-icon]',
  form: '[data-filter-form-flyout]',
  priceRange: '[data-price-range]'
};
var selectors$n = {
  active: 'active',
  checked: ':checked'
};
var filterFlyout = (node => {
  var flyoutForm = n$2(sel$1.form, node);
  var flyouts = t$3(sel$1.flyouts, node);
  var wash = n$2(sel$1.wash, node);
  var focusTrap = null;
  var range = null;
  var rangeContainer = n$2(sel$1.priceRange, flyoutForm);

  if (rangeContainer) {
    range = priceRange(rangeContainer);
  }

  var events = [e$3(t$3(sel$1.filter, node), 'click', clickFlyoutTrigger), e$3(wash, 'click', clickWash), e$3(t$3(sel$1.button, node), 'click', clickButton), e$3(t$3(sel$1.close, node), 'click', clickWash), e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) clickWash();
  })];

  function clickFlyoutTrigger(e) {
    e.preventDefault();
    var {
      filterOpen
    } = e.currentTarget.dataset;
    var drawer = n$2("[data-filter-flyout=\"".concat(filterOpen, "\"]"), node);

    if (drawer) {
      focusTrap = createFocusTrap(drawer, {
        allowOutsideClick: true
      });
      drawer.setAttribute('aria-hidden', 'false');
      u$2(wash, selectors$n.active);
      u$2(drawer, selectors$n.active);
      focusTrap.activate();
      disableBodyScroll(node, {
        allowTouchMove: el => {
          while (el && el !== document.body) {
            if (el.getAttribute('data-scroll-lock-ignore') !== null) {
              return true;
            }

            el = el.parentNode;
          }
        },
        reserveScrollBarGap: true
      });
    }
  }

  function clickWash(e) {
    e && e.preventDefault();
    focusTrap && focusTrap.deactivate();
    flyouts.forEach(flyout => flyout.setAttribute('aria-hidden', 'true'));
    i$1([...flyouts, wash], selectors$n.active);
    enableBodyScroll(node);
  }

  function clickButton(e) {
    e.preventDefault();
    var {
      button
    } = e.currentTarget.dataset;
    var scope = e.currentTarget.closest(sel$1.flyouts);

    if (button === 'clear') {
      var inputs = t$3('[data-filter-item]', scope);
      inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
      });
      removeRange();
    } else if (button === 'apply') {
      updateFilters(flyoutForm);
      clickWash();
    }
  }

  function removeRange() {
    range && range.reset();
  }

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
    range && range.unload();
  };

  return {
    unload
  };
});

var selectors$m = {
  infiniteScrollContainer: '.collection__infinite-container',
  infiniteScrollTrigger: '.collection__infinite-trigger',
  sidebar: '[data-sidebar]',
  partial: '[data-partial]',
  perPageContainer: '[data-collection-templates]',
  productTile: '[data-product-tile]'
};
register('collection', {
  onLoad() {
    var {
      paginationType
    } = this.container.dataset;
    this.paginationType = paginationType;
    this.sidebar = sidebar(n$2(selectors$m.sidebar, this.container));
    this.filterForm = n$2('[data-filter-form]', this.container);

    if (this.filterForm) {
      this.partial = n$2(selectors$m.partial, this.container);
      this.filterFlyout = filterFlyout(this.container);
      this.filterHandler = filterHandler({
        container: this.container,
        partial: this.partial,
        renderCB: this._renderView.bind(this)
      });
      this.stateListener = e$3(window, 'popstate', event => {
        var searchParams = event.state ? event.state.searchParams : this.searchParamsInitial;
        if (searchParams === this.searchParamsPrev) return;

        this._renderView(searchParams, false);
      });
    }

    this.productTiles = t$3(selectors$m.productTile, this.container).map(tile => ProductTitle(tile));

    this._initDelegate();

    this._initInfiniteScroll();
  },

  _initDelegate() {
    this.delegate = new Delegate(this.container);
    this.delegate.on('click', '[data-per-page]', e => {
      e.preventDefault();
      var {
        collectionTemplate
      } = e.target.dataset;
      var viewInput = n$2('[data-per-page-input]', this.filterForm);
      var allViewLinks = t$3('[data-per-page]', this.container);
      allViewLinks.forEach(link => {
        i$1(link, 'active');
      });
      u$2(e.target, 'active');
      viewInput.value = collectionTemplate;
      updateFilters(this.filterForm);
    });
  },

  _renderView(searchParams) {
    var updateHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var url = "".concat(window.location.pathname, "?section_id=").concat(this.container.dataset.sectionId, "&").concat(searchParams);
    var loading = n$2('.collection__loading', this.container);
    u$2(loading, 'is-active');
    u$2(this.container, 'is-filtered');
    fetch(url, {
      credentials: 'include'
    }).then(res => res.text()).then(res => {
      updateHash && this._updateURLHash(searchParams);
      var doc = new window.DOMParser().parseFromString(res, 'text/html');
      var contents = n$2(selectors$m.partial, doc).innerHTML;
      this.partial.innerHTML = contents;

      this._initInfiniteScroll();

      i$1(loading, 'is-active');
      r$2('collection:updated');
      this.productTiles = t$3(selectors$m.productTile, this.container).map(tile => ProductTitle(tile));
    });
  },

  _updateURLHash(searchParams) {
    history.pushState({
      searchParams
    }, '', "".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));
  },

  _onHistoryChange(event) {},

  _initInfiniteScroll() {
    var paginated = this.paginationType === 'paginated';
    var infiniteScrollTrigger = n$2(selectors$m.infiniteScrollTrigger, this.container);
    if (paginated || !infiniteScrollTrigger) return;
    var infiniteScrollOptions = {
      container: selectors$m.infiniteScrollContainer,
      pagination: selectors$m.infiniteScrollTrigger,
      loadingText: 'Loading...',
      callback: () => this.productTiles = t$3(selectors$m.productTile, this.container).map(tile => ProductTitle(tile))
    };

    if (this.paginationType === 'click') {
      infiniteScrollOptions.method = 'click';
    }

    AjaxinateShim(Ajaxinate);
    this.infiniteScroll = new Ajaxinate(infiniteScrollOptions);
  },

  onUnload() {
    this.sidebar();
    this.delegate.off();
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.productTiles.forEach(tile => tile.unload());
    this.stateListener && this.stateListener();
    this.filterFlyout && this.filterFlyout.unload();
  }

});

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var classes$7 = {
  hide: 'hidden'
};
var selectors$l = {
  update: '[data-update-cart]',
  item: '.cart-template__item',
  updateInput: '[name="updates[]"]',
  quantityError: '[data-quantity-error]',
  loadingSpinner: '.cart__update-loading',
  subTotal: '.cart__subtotal',
  lineItemPrice: '.cart-template__line-price'
};
register('cart', {
  onLoad() {
    this.items = t$3(selectors$l.item, this.container);
    this.updateButton = n$2(selectors$l.update, this.container);
    this.loadingSpinner = n$2(selectors$l.loadingSpinner, this.container);
    this.events = [e$3(this.updateButton, 'click', this.handleClick.bind(this))];
    this.subTotal = n$2(selectors$l.subTotal, this.container);
    this.cartState = {
      currentItemCount: this.getTotalItemQuantities(),
      items: {}
    }; // Keep all updates together to force an update a similar time outside of the
    // async fetches

    this.updates = [];
    this.items.forEach(item => {
      var {
        itemId
      } = item.dataset;
      var quantityInput = n$2(selectors$l.updateInput, item);
      var quantity = parseInt(quantityInput.value, 10);
      this.cartState.items[itemId] = quantity;
    });
  },

  getCurrentItemCount(state) {
    return Object.keys(state.items).reduce((prev, curr) => prev += state.items[curr], 0);
  },

  getTotalItemQuantities() {
    return Array.from(t$3('[name="updates[]"]', this.container)).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
  },

  handleClick(e) {
    e.preventDefault();
    this.toggleLoader();
    var fetches = this.items.map((item, index) => () => this.updateQuantity(item, index));
    fetches.reduce((p, fn, i) => {
      if (i === fetches.length - 1) {
        return p.then(fn).then(() => {
          this.toggleLoader();
          this.updates.forEach(update => update());
          this.updates = [];
        });
      } else {
        return p.then(fn);
      }
    }, Promise.resolve());
  },

  updateQuantity(item, iterable) {
    var {
      itemId
    } = item.dataset;
    var quantityInput = n$2(selectors$l.updateInput, item);
    var quantity = parseInt(quantityInput.value, 10);
    var quantityError = n$2(selectors$l.quantityError, item);
    var price = n$2(selectors$l.lineItemPrice, item);
    u$2(quantityError, classes$7.hide);
    var body = JSON.stringify({
      id: itemId,
      quantity
    });
    return fetch("".concat(theme.routes.cart.change), _objectSpread2({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': "application/json"
      }
    }, {
      body
    })).then(response => {
      return response.text();
    }).then(state => {
      var parsedState = JSON.parse(state); // Find line item in cart results

      var returnedLineItem = parsedState.items.find(_ref => {
        var {
          id
        } = _ref;
        return id === parseInt(itemId, 10);
      });
      var newState = JSON.parse(JSON.stringify(this.cartState));

      if (newState.items[itemId] !== quantity) {
        newState.items[itemId] = quantity;
        newState.currentItemCount = this.getCurrentItemCount(newState);

        if (newState.currentItemCount !== parsedState.item_count && newState.currentItemCount > parsedState.item_count) {
          // Failed to add new item due to quantity
          i$1(quantityError, classes$7.hide);
          quantityInput.value = returnedLineItem.quantity;
        } else {
          // Successfully updated item in cart
          this.cartState = Object.assign({}, newState);
          r$2('cart:updated', {
            cart: cart.sortCart(parsedState)
          });
        }

        this.updates.push(() => this.updatePrice(price, returnedLineItem.line_price));
      } // Update the cart on the last item


      if (iterable === this.items.length - 1) {
        console.log(parsedState);
        this.updates.push(() => this.updatePrice(this.subTotal, parsedState.total_price));
      }
    });
  },

  updatePrice(element, price) {
    element.innerHTML = formatMoney(price);
  },

  toggleLoader() {
    l([this.updateButton, this.loadingSpinner], classes$7.hide);
  },

  onUnload() {
    this.events.forEach(unsubscribe => unsubscribe());
  }

});

register('page', {
  onLoad() {
    this.accordions = Accordions(t$3('.accordion', this.container));
    wrapIframes(t$3('iframe', this.container));
    wrapTables(t$3('table', this.container));
  },

  onUnload() {
    this.accordions.destroy();
  }

});

var selectors$k = {
  trigger: '[data-trigger]',
  errors: '.errors'
};
register('password', {
  onLoad() {
    var trigger = n$2(selectors$k.trigger, this.container);
    var containsErrors = n$2(selectors$k.errors, this.container);
    this.events = [e$3(trigger, 'click', () => l(this.container, 'password--show-login'))];

    if (containsErrors) {
      u$2(this.container, 'password--show-login');
    }
  },

  onUnload() {
    this.events.forEach(unsubscribe => unsubscribe());
  }

});

var selectors$j = {
  partial: '[data-partial]',
  loader: '.search-template__loading'
};
var classes$6 = {
  active: 'is-active'
};
register('search', {
  onLoad() {
    var filterForm = n$2('[data-filter-form]', this.container);
    this.searchParamsInitial = window.location.search.slice(1);
    this.searchParamsPrev = window.location.search.slice(1);

    if (filterForm) {
      this.partial = n$2(selectors$j.partial, this.container);
      this.filterFlyout = filterFlyout(this.container);
      this.filterHandler = filterHandler({
        container: this.container,
        partial: this.partial,
        renderCB: this._renderView.bind(this)
      });
    }

    this.events = [e$3(window, 'popstate', event => {
      var searchParams = event.state ? event.state.searchParams : this.searchParamsInitial;
      if (searchParams === this.searchParamsPrev) return;

      this._renderView(searchParams, false);
    })];
  },

  _renderView(searchParams) {
    var updateHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var url = "".concat(window.location.pathname, "?section_id=").concat(this.container.dataset.sectionId, "&").concat(searchParams);
    var loading = n$2(selectors$j.loader, this.container);
    u$2(loading, classes$6.active);
    this.filterFlyout.unload();
    fetch(url).then(res => res.text()).then(res => {
      this.searchParamsPrev = searchParams;
      updateHash && this._updateURLHash(searchParams);
      var doc = new DOMParser().parseFromString(res, 'text/html');
      var contents = n$2(selectors$j.partial, doc).innerHTML;
      this.partial.innerHTML = contents;
      i$1(loading, classes$6.active);
      this.filterFlyout = filterFlyout(this.container);
    });
  },

  _updateURLHash(searchParams) {
    history.pushState({
      searchParams
    }, '', "".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));
  },

  onUnload() {
    this.filterHandler && this.filterHandler.unload();
    this.filterFlyout && this.filterFlyout.unload();
  }

});

var selectors$i = {
  addressContainer: '[data-address]',
  addressToggle: '[data-address-toggle]',
  addressCountry: '[data-address-country]',
  addressProvince: '[data-address-province]',
  addressProvinceWrapper: '[data-address-province-wrapper]',
  addressForm: '[data-address-form]',
  addressDeleteForm: '[data-address-delete-form]'
};
var hideClass = 'hide';
register('addresses', {
  onLoad() {
    var addresses = t$3(selectors$i.addressContainer, this.container);
    var countryOptions = t$3('[data-country-option]', this.container) || [];
    countryOptions.forEach(el => {
      var {
        formId
      } = el.dataset;
      var countrySelector = 'AddressCountry_' + formId;
      var provinceSelector = 'AddressProvince_' + formId;
      var containerSelector = 'AddressProvinceContainer_' + formId;
      new window.Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector
      });
    });
    addresses.forEach(addressContainer => {
      this.initializeAddressForm(addressContainer);
    });
  },

  initializeAddressForm(container) {
    var addressForm = n$2(selectors$i.addressForm, container);
    var deleteForm = n$2(selectors$i.addressDeleteForm, container);
    t$3(selectors$i.addressToggle, container).forEach(button => {
      button.addEventListener('click', () => {
        if (a$1(addressForm, hideClass)) {
          i$1(addressForm, hideClass);
          addressForm.setAttribute('aria-hidden', 'false');
        } else {
          u$2(addressForm, hideClass);
          addressForm.setAttribute('aria-hidden', 'true');
        }
      });
    });

    if (deleteForm) {
      deleteForm.addEventListener('submit', event => {
        var confirmMessage = deleteForm.getAttribute('data-confirm-message');

        if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
          event.preventDefault();
        }
      });
    }
  }

});

var classes$5 = {
  hide: 'hide'
};
var selectors$h = {
  recoverPasswordLink: '#RecoverPassword',
  hideRecoverPasswordLink: '#HideRecoverPasswordLink',
  recoverPasswordForm: '#RecoverPasswordForm',
  loginForm: '#CustomerLoginForm',
  resetSuccessMessage: '#ResetSuccess',
  formState: '.reset-password-success'
};
register('login', {
  onLoad() {
    this.recoverPasswordForm = n$2(selectors$h.recoverPasswordForm, this.container);
    this.loginForm = n$2(selectors$h.loginForm, this.container);
    var recoverPasswordLink = n$2(selectors$h.recoverPasswordLink, this.container);
    var hideRecoverPasswordLink = n$2(selectors$h.hideRecoverPasswordLink, this.container);
    this.events = [];

    if (recoverPasswordLink) {
      this.checkUrlHash();
      this.resetPasswordSuccess();
      this.events.push(e$3([recoverPasswordLink, hideRecoverPasswordLink], 'click', e => {
        e.preventDefault();
        this.toggleRecoverPasswordForm();
      }));
    }
  },

  checkUrlHash() {
    var hash = window.location.hash; // Allow deep linking to recover password form

    if (hash === '#recover') {
      this.toggleRecoverPasswordForm();
    }
  },

  /**
   *  Show/Hide recover password form
   */
  toggleRecoverPasswordForm() {
    if (a$1(this.recoverPasswordForm, classes$5.hide)) {
      i$1(this.recoverPasswordForm, classes$5.hide);
      u$2(this.loginForm, classes$5.hide);
      this.recoverPasswordForm.setAttribute('aria-hidden', 'false');
      this.loginForm.setAttribute('aria-hidden', 'true');
    } else {
      i$1(this.loginForm, classes$5.hide);
      u$2(this.recoverPasswordForm, classes$5.hide);
      this.recoverPasswordForm.setAttribute('aria-hidden', 'true');
      this.loginForm.setAttribute('aria-hidden', 'false');
    }
  },

  /**
   *  Show reset password success message
   */
  resetPasswordSuccess() {
    // check if reset password form was successfully submited.
    if (!n$2(selectors$h.formState, this.container)) {
      return;
    } // show success message


    i$1(n$2(selectors$h.resetSuccessMessage, this.container), classes$5.hide);
  },

  onUnload() {
    this.events.forEach(unsubscribe => unsubscribe());
  }

});

var selectors$g = {
  video: '.mosaic-grid__item-video'
};
register('mosaic-grid', {
  onLoad() {
    var videos = t$3(selectors$g.video, this.container);
    this.videoHandlers = [];

    if (videos.length) {
      videos.forEach(video => {
        this.videoHandlers.push(backgroundVideoHandler(video.parentNode));
      });
    }
  },

  onUnload() {
    this.videoHandlers.forEach(handler => handler());
  }

});

var selectors$f = {
  dots: '.navigation-dot'
};

var navigationDots = (container, slider) => {
  var navigationDots = t$3(selectors$f.dots, container);
  var events = [];
  navigationDots.forEach(dot => {
    events.push(e$3(dot, 'click', e => _handlePageDot(e)));
  });

  var _handlePageDot = e => {
    e.preventDefault();
    if (e.currentTarget.classList.contains('is-selected')) return;
    var {
      slideIndex
    } = e.currentTarget.dataset;
    slider.select(slideIndex);
    slider.pausePlayer();
  };

  var update = cellIndex => {
    var activeClass = 'is-selected';
    navigationDots.forEach(dot => i$1(dot, activeClass));
    u$2(navigationDots[cellIndex], activeClass);
  };

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    update,
    unload
  };
};

var selectors$e = {
  productTile: '[data-product-tile]'
};
register('featured-collection', {
  onLoad() {
    this.productTiles = [];
    var sliderContainer = n$2('[data-slider]', this.container);
    var slides = t$3('.featured-collection__item ', this.container);
    var dotNavigation = null;
    this.productTiles = t$3(selectors$e.productTile, this.container).map(tile => ProductTitle(tile));
    import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
      var {
        default: Flickity
      } = _ref;
      this.slider = new Flickity(sliderContainer, {
        adaptiveHeight: true,
        pageDots: false,
        prevNextButtons: false,
        watchCSS: true,
        wrapAround: false
      });

      if (slides.length > 1) {
        dotNavigation = navigationDots(this.container, this.slider);
        this.slider.on('select', () => {
          dotNavigation.update(this.slider.selectedIndex);
        });
      }
    });
  },

  onUnload() {
    this.slider.destroy();
    this.productTiles.forEach(tile => tile.unload());
  }

});

// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ID = "__googleMapsScriptId";
/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then((google) => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
class Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey, channel, client, id = DEFAULT_ID, libraries = [], language, region, version, mapIds, nonce, retries = 3, url = "https://maps.googleapis.com/maps/api/js", }) {
        this.CALLBACK = "__googleMapsCallback";
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.version = version;
        this.apiKey = apiKey;
        this.channel = channel;
        this.client = client;
        this.id = id || DEFAULT_ID; // Do not allow empty string
        this.libraries = libraries;
        this.language = language;
        this.region = region;
        this.mapIds = mapIds;
        this.nonce = nonce;
        this.retries = retries;
        this.url = url;
        if (Loader.instance) {
            if (!fastDeepEqual(this.options, Loader.instance.options)) {
                throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
            }
            return Loader.instance;
        }
        Loader.instance = this;
    }
    get options() {
        return {
            version: this.version,
            apiKey: this.apiKey,
            channel: this.channel,
            client: this.client,
            id: this.id,
            libraries: this.libraries,
            language: this.language,
            region: this.region,
            mapIds: this.mapIds,
            nonce: this.nonce,
            url: this.url,
        };
    }
    get failed() {
        return this.done && !this.loading && this.errors.length >= this.retries + 1;
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     */
    createUrl() {
        let url = this.url;
        url += `?callback=${this.CALLBACK}`;
        if (this.apiKey) {
            url += `&key=${this.apiKey}`;
        }
        if (this.channel) {
            url += `&channel=${this.channel}`;
        }
        if (this.client) {
            url += `&client=${this.client}`;
        }
        if (this.libraries.length > 0) {
            url += `&libraries=${this.libraries.join(",")}`;
        }
        if (this.language) {
            url += `&language=${this.language}`;
        }
        if (this.region) {
            url += `&region=${this.region}`;
        }
        if (this.version) {
            url += `&v=${this.version}`;
        }
        if (this.mapIds) {
            url += `&map_ids=${this.mapIds.join(",")}`;
        }
        return url;
    }
    deleteScript() {
        const script = document.getElementById(this.id);
        if (script) {
            script.remove();
        }
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     */
    load() {
        return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     */
    loadPromise() {
        return new Promise((resolve, reject) => {
            this.loadCallback((err) => {
                if (!err) {
                    resolve(window.google);
                }
                else {
                    reject(err.error);
                }
            });
        });
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     */
    loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
        if (document.getElementById(this.id)) {
            // TODO wrap onerror callback for cases where the script was loaded elsewhere
            this.callback();
            return;
        }
        const url = this.createUrl();
        const script = document.createElement("script");
        script.id = this.id;
        script.type = "text/javascript";
        script.src = url;
        script.onerror = this.loadErrorCallback.bind(this);
        script.defer = true;
        script.async = true;
        if (this.nonce) {
            script.nonce = this.nonce;
        }
        document.head.appendChild(script);
    }
    /**
     * Reset the loader state.
     */
    reset() {
        this.deleteScript();
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.onerrorEvent = null;
    }
    resetIfRetryingFailed() {
        if (this.failed) {
            this.reset();
        }
    }
    loadErrorCallback(e) {
        this.errors.push(e);
        if (this.errors.length <= this.retries) {
            const delay = this.errors.length * Math.pow(2, this.errors.length);
            console.log(`Failed to load Google Maps script, retrying in ${delay} ms.`);
            setTimeout(() => {
                this.deleteScript();
                this.setScript();
            }, delay);
        }
        else {
            this.onerrorEvent = e;
            this.callback();
        }
    }
    setCallback() {
        window.__googleMapsCallback = this.callback.bind(this);
    }
    callback() {
        this.done = true;
        this.loading = false;
        this.callbacks.forEach((cb) => {
            cb(this.onerrorEvent);
        });
        this.callbacks = [];
    }
    execute() {
        this.resetIfRetryingFailed();
        if (this.done) {
            this.callback();
        }
        else {
            // short circuit and warn if google.maps is already loaded
            if (window.google && window.google.maps && window.google.maps.version) {
                console.warn("Google Maps already loaded outside @googlemaps/js-api-loader." +
                    "This may result in undesirable behavior as options and script parameters may not match.");
                this.callback();
                return;
            }
            if (this.loading) ;
            else {
                this.loading = true;
                this.setCallback();
                this.setScript();
            }
        }
    }
}

var selectors$d = {
  mapContainer: '.map__container',
  map: '.map__element',
  image: '.map__image'
};
var classes$4 = {
  hidden: 'hidden'
};
register('map', {
  onLoad() {
    var map = n$2(selectors$d.mapContainer, this.container);
    if (!map) return;
    var {
      apiKey,
      address
    } = map.dataset;
    var rawData = n$2("#map-styles-".concat(this.id), this.container).innerHTML;
    var data;

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch (e) {
        data = {};
        console.error("Custom map JSON error: ".concat(e));
      }
    }

    if (!apiKey || !address) {
      return false;
    } // Handle authetication errors


    window.gm_authFailure = function () {
      var maps = t$3(selectors$d.mapContainer, document);
      var mapImages = t$3(selectors$d.image, document);
      maps.forEach(map => {
        u$2(map, classes$4.hidden);
      });
      mapImages.forEach(img => {
        i$1(img, classes$4.hidden);
      });
    };

    var loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['geocoding-api']
    });
    loader.load().then(() => {
      u$2(n$2(selectors$d.image, this.container), classes$4.hidden);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address
      }, (res, _) => {
        var {
          location
        } = res[0].geometry;
        var latLong = {
          lat: location.lat(),
          lng: location.lng()
        };
        var map = new google.maps.Map(n$2(selectors$d.map, this.container), {
          center: latLong,
          zoom: 12,
          styles: data.styles
        });
        new google.maps.Marker({
          position: latLong,
          map
        });
      });
    });
  },

  onUnload() {}

});

register('slideshow', {
  listeners: [],

  onLoad() {
    var {
      autoplay,
      parallaxScale,
      enableParallax
    } = this.container.dataset;
    var sliderEl = n$2('.js-slideshow', this.container);
    var images = t$3('.responsive-image__image', this.container);
    var dotNavigation = null;
    i$1(this.container, 'hidden');
    import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
      var {
        default: Flickity
      } = _ref;
      this.slideshow = new Flickity(sliderEl, {
        autoPlay: parseInt(autoplay, 10),
        prevNextButtons: false,
        wrapAround: true,
        pageDots: false,
        adaptiveHeight: true,
        on: {
          ready: () => {
            l(sliderEl, 'is-single', t$3('.slideshow__slide', sliderEl).length <= 1);
            this.parallaxElements && this.parallaxElements.forEach(el => el.refresh());
          }
        }
      });
      setTimeout(() => {
        this.slideshow.resize();
      }, 500);

      if (n$2('.navigation-dots', this.container)) {
        dotNavigation = navigationDots(this.container, this.slideshow);
        this.slideshow.on('select', () => {
          dotNavigation.update(this.slideshow.selectedIndex);
        });
      }
    });

    if (enableParallax === 'true') {
      import('./simpleParallax.min-74855133.js').then(function (n) { return n.s; }).then(_ref2 => {
        var {
          default: simpleParallax
        } = _ref2;
        this.parallaxElements = images.map(image => {
          return new simpleParallax(image, {
            scale: parallaxScale
          });
        });
      });
    }
  },

  handleBlockSelect(slideIndex) {
    this.slideshow.pausePlayer();
    this.slideshow.select(slideIndex);
  },

  onUnload() {
    this.slideshow && this.slideshow.destroy();
    this.parallaxElements && this.parallaxElements.forEach(element => element.destroy());
  },

  onSelect() {
    r$2('transparentSectionUpdate');
  },

  onBlockSelect(_ref3) {
    var {
      target
    } = _ref3;

    if (this.slideshow) {
      this.handleBlockSelect(target.dataset.index);
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('slideshow:initialized', () => {
        this.handleBlockSelect(target.dataset.index);
      }));
    }
  },

  onBlockDeselect() {
    if (this.slideshow) {
      this.slideshow.unpausePlayer();
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('slideshow:initialized', () => {
        this.slideshow.unpausePlayer();
      }));
    }
  }

});

register('quotes', {
  events: [],
  listeners: [],

  onLoad() {
    var {
      autoplay
    } = this.container.dataset;
    var sliderEl = n$2('.js-fq', this.container);
    var dotNavigation = null;
    import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
      var {
        default: Flickity
      } = _ref;
      this.pagination = t$3('[data-pagination]', this.container);
      this.slideshow = new Flickity(sliderEl, {
        adaptiveHeight: false,
        autoPlay: parseInt(autoplay, 10),
        pageDots: false,
        prevNextButtons: false,
        wrapAround: true,
        adaptiveHeight: true
      });
      r$2('quotes:initialized');

      this.handlePagination = _ref2 => {
        var {
          currentTarget
        } = _ref2;
        var trigger = n$2('.quotes__icon', currentTarget);
        var {
          index
        } = trigger.dataset;
        this.slideshow.pausePlayer();
        this.slideshow.select(index);
      };

      if (Boolean(this.pagination.length)) {
        this.slideshow.on('change', index => {
          this.pagination.forEach(el => {
            i$1(n$2('.quotes__icon', el), 'active');
          });
          u$2(n$2(".quotes__icon[data-index=\"".concat(index, "\"]"), this.container), 'active');
        });
        this.pagination.forEach(el => this.events.push(e$3(el, 'click', this.handlePagination)));
      }

      if (n$2('.navigation-dots', this.container)) {
        dotNavigation = navigationDots(this.container, this.slideshow);
        this.slideshow.on('select', () => {
          dotNavigation.update(this.slideshow.selectedIndex);
        });
      }
    });
  },

  handleBlockSelect(slideIndex) {
    this.slideshow.pausePlayer();
    this.slideshow.select(slideIndex);
  },

  onUnload() {
    this.slideshow.destroy();
    this.events.forEach(unsubscribe => unsubscribe());
  },

  onBlockSelect(_ref3) {
    var {
      target
    } = _ref3;

    if (this.slideshow) {
      this.handleBlockSelect(target.dataset.index);
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('quotes:initialized', () => {
        this.handleBlockSelect(target.dataset.index);
      }));
    }
  },

  onBlockDeselect() {
    if (this.slideshow) {
      this.slideshow.unpausePlayer();
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('quotes:initialized', () => {
        this.slideshow.unpausePlayer();
      }));
    }
  }

});

var selectors$c = {
  wrapper: '.video__wrapper',
  overlay: '.video__overlay',
  player: '.video__player',
  button: '[data-video-trigger]'
};
register('video', {
  onLoad() {
    import('./fluorescent-video.es-ff38dd2a.js').then(_ref => {
      var {
        default: Video
      } = _ref;
      var videoWrapper = n$2(selectors$c.wrapper, this.container);
      if (!videoWrapper) return;
      var {
        videoId,
        videoType
      } = videoWrapper.dataset;
      if (!videoId || !videoType) return;
      var overlay = n$2(selectors$c.overlay, this.container);
      var player = n$2(selectors$c.player, this.container);
      var button = n$2(selectors$c.button, this.container);
      this.video = Video(this.container, {
        id: videoId,
        type: videoType,
        playerEl: player
      });
      this.video.on('play', () => {
        i$1(overlay, 'visible');
      });
      this.playClick = e$3(button, 'click', e => {
        e.preventDefault();
        this.video.play();
      });
    });
  },

  onUnload() {
    this.video && this.video.destroy();
    this.playClick && this.playClick();
  }

});

register('full-width-image', {
  onLoad() {
    var {
      parallaxScale,
      enableParallax
    } = this.container.dataset;
    var images = t$3('.responsive-image__image', this.container);
    if (!images.length || !enableParallax) return;
    import('./simpleParallax.min-74855133.js').then(function (n) { return n.s; }).then(_ref => {
      var {
        default: simpleParallax
      } = _ref;
      this.parallaxElements = images.map(image => {
        return new simpleParallax(image, {
          scale: parallaxScale
        });
      });
    });
  },

  onSelect() {
    r$2('transparentSectionUpdate');
  },

  onUnload() {
    this.parallaxElements && this.parallaxElements.forEach(element => element.destroy());
  }

});

var selectors$b = {
  video: '.video-hero__video'
};
register('video-hero', {
  onLoad() {
    var videos = t$3(selectors$b.video, this.container);
    this.videoHandlers = [];

    if (videos.length) {
      videos.forEach(video => {
        this.videoHandlers.push(backgroundVideoHandler(video.parentNode));
      });
    }
  },

  onSelect() {
    r$2('transparentSectionUpdate');
  },

  onUnload() {
    this.videoHandlers.forEach(handler => handler());
  }

});

var slideshowOpts = {
  adaptiveHeight: false,
  fade: true,
  pageDots: false,
  prevNextButtons: false,
  wrapAround: true,
  draggable: false
};
var selectors$a = {
  announcements: '.announcement-bar__slide'
};
var modifiers = {
  active: 'is-active'
};
var rootVars = {
  announcementBar: '--announcement-height'
};
register('announcement-bar', {
  listeners: [],

  onLoad() {
    this.announcements = t$3(selectors$a.announcements, this.container);
    var {
      timing
    } = this.container.dataset;
    slideshowOpts.autoPlay = parseInt(timing);

    this._init();

    this._setRootVar(rootVars.announcementBar, this.announcements.length ? this.container.offsetHeight : 0);
  },

  _init() {
    if (this.announcements.length > 1) {
      import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
        var {
          default: Flickity
        } = _ref;
        this.slideshow = new Flickity(this.container, _objectSpread2(_objectSpread2({}, slideshowOpts), {}, {
          on: {
            // Need to add a modifier to animate after the first slide has changed
            change: index => {
              this.announcements.forEach((element, i) => {
                l(element, modifiers.active, i === index);
              });
            }
          }
        }));
        r$2('announcement-bar:initialized');
      });
    }
  },

  _setRootVar(name, value) {
    document.documentElement.style.setProperty(name, "".concat(value, "px"));
  },

  handleBlockSelect(slideIndex) {
    this.slideshow.stopPlayer();
    this.slideshow.select(slideIndex);
  },

  onSelect() {
    r$2('sticky-header:reload', () => {});
  },

  onBlockSelect(_ref2) {
    var {
      target
    } = _ref2;

    if (this.slideshow) {
      this.handleBlockSelect(target.dataset.index);
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('announcement-bar:initialized', () => {
        this.handleBlockSelect(target.dataset.index);
      }));
    }
  },

  onBlockDeselect() {
    if (this.slideshow) {
      this.slideshow.playPlayer();
    } else {
      // Listen for initalization if slideshow does not exist
      this.listeners.push(c('announcement-bar:initialized', () => {
        this.slideshow.playPlayer();
      }));
    }
  },

  onUnload() {
    this.slideshow && this.slideshow.destroy();
    this.resizeObserver.disconnect();
    this.listeners.forEach(unsubscribe => unsubscribe());
  }

});

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    xhr.send();
  });
}

var ls = {
  get: () => JSON.parse(localStorage.getItem('recentlyViewed')),
  set: val => localStorage.setItem('recentlyViewed', val)
};
var updateRecentProducts = product => {
  var recentlyViewed = [];
  var requestUrl = "".concat(theme.routes.products, "/").concat(encodeURIComponent(product.handle), "?section_id=quick-cart-recently-viewed-item"); // Create markup for quickCart through liquid template
  // We are not storing markup for the recently-viewed Section
  // because it can become stale depending on option changes

  makeRequest('GET', requestUrl).then(response => {
    var container = document.createElement('div');
    container.innerHTML = response;
    var quickCartItem = container.querySelector('[data-recently-viewed-item]').innerHTML;
    product.quickCartMarkup = quickCartItem;

    if (ls.get() !== null) {
      recentlyViewed = ls.get().filter(item => item.id !== product.id);
      recentlyViewed.unshift(product);
      ls.set(JSON.stringify(recentlyViewed.slice(0, 20)));
    } else if (ls.get() === null) {
      recentlyViewed.push(product);
      ls.set(JSON.stringify(recentlyViewed));
    }
  });
};
var resetRecentProducts = () => localStorage.removeItem('recentlyViewed');
var getRecentProducts = () => ls.get();

var selectors$9 = {
  form: '.selectors-form',
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]',
  disclosureOptions: '[data-disclosure-option]'
};
var classes$3 = {
  listVisible: 'disclosure-list--visible'
};

function has(list, selector) {
  return list.map(l => l.contains(selector)).filter(Boolean);
}

function Disclosure(node) {
  var form = n$2(selectors$9.form, document);
  var disclosureList = n$2(selectors$9.disclosureList, node);
  var disclosureToggle = n$2(selectors$9.disclosureToggle, node);
  var disclosureInput = n$2(selectors$9.disclosureInput, node);
  var disclosureOptions = t$3(selectors$9.disclosureOptions, node);
  var events = [e$3(disclosureToggle, 'click', handleToggle), e$3(disclosureToggle, 'focusout', handleToggleFocusOut), e$3(disclosureList, 'focusout', handleListFocusOut), e$3(node, 'keyup', handleKeyup), e$3(document, 'click', handleBodyClick)];
  disclosureOptions.forEach(option => events.push(e$3(option, 'click', submitForm)));

  function submitForm(evt) {
    evt.preventDefault();
    var {
      value
    } = evt.currentTarget.dataset; // Clear existing "recently viewed" since the
    // language or currency is no longer accurate

    resetRecentProducts();
    disclosureInput.value = value;
    form.submit();
  }

  function handleToggleFocusOut(evt) {
    var disclosureLostFocus = has([node], evt.relatedTarget).length === 0;

    if (disclosureLostFocus) {
      hideList();
    }
  }

  function handleListFocusOut(evt) {
    var childInFocus = has([node], evt.relatedTarget).length > 0;
    var isVisible = a$1(disclosureList, classes$3.listVisible);

    if (isVisible && !childInFocus) {
      hideList();
    }
  }

  function handleKeyup(evt) {
    if (evt.which !== 27) return;
    hideList();
    disclosureToggle.focus();
  }

  function handleToggle(evt) {
    var ariaExpanded = evt.currentTarget.getAttribute('aria-expanded') === true;
    evt.currentTarget.setAttribute('aria-expanded', !ariaExpanded);
    l(disclosureList, classes$3.listVisible);
  }

  function handleBodyClick(evt) {
    var isOption = has([node], evt.target).length > 0;
    var isVisible = a$1(disclosureList, classes$3.listVisible);

    if (isVisible && !isOption) {
      hideList();
    }
  }

  function hideList() {
    disclosureToggle.setAttribute('aria-expanded', false);
    i$1(disclosureList, classes$3.listVisible);
  }

  return () => {
    events.forEach(unsubscribe => unsubscribe());
  };
}

var selectors$8 = {
  disclosure: '[data-disclosure]'
};
register('footer', {
  crossBorder: {},

  onLoad() {
    // Wire up Cross Border disclosures
    var cbSelectors = t$3(selectors$8.disclosure, this.container);

    if (cbSelectors) {
      cbSelectors.forEach(selector => {
        var {
          disclosure: d
        } = selector.dataset;
        this.crossBorder[d] = Disclosure(selector);
      });
    }
  },

  onUnload() {
    Object.keys(this.crossBorder).forEach(t => this.crossBorder[t].unload());
  }

});

function Navigation(node) {
  if (!node) return;
  var parents = t$3('[data-parent]', node);
  if (!parents) return;
  var delegate = new Delegate(document.body);
  delegate.on('click', '*', e => handleClick(e));
  var events = [e$3(parents, 'click', e => {
    e.preventDefault();
    toggleMenu(e.currentTarget.parentNode);
  }), e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) closeAll();
  }), e$3(t$3('.header__nav > li > a', node), 'focus', e => {
    if (!userIsUsingKeyboard()) return;
    closeAll();
  }), e$3(t$3('[data-link]', node), 'focus', e => {
    e.preventDefault();
    if (!userIsUsingKeyboard()) return;
    var link = e.currentTarget;

    if (link.hasAttribute('data-parent')) {
      toggleMenu(link.parentNode);
    }

    var siblings = t$3('[data-link]', link.parentNode.parentNode);
    siblings.forEach(el => l(t$3('[data-submenu]', el.parentNode), 'visible', el === link));
  }), // Close everything when focus leaves the main menu
  e$3(t$3('[data-link]', node), 'focusout', e => {
    if (!userIsUsingKeyboard()) return;

    if (e.relatedTarget && !e.relatedTarget.hasAttribute('data-link')) {
      closeAll();
    }
  }), // Listen to horizontal scroll to offset inner menus
  e$3(node, 'scroll', () => {
    document.documentElement.style.setProperty('--navigation-menu-offet', "".concat(node.scrollLeft, "px"));
  })];

  function userIsUsingKeyboard() {
    return a$1(document.body, 'user-is-tabbing');
  }

  function toggleMenu(el) {
    var menu = n$2('[data-submenu]', el);
    var menuTrigger = n$2('[data-link]', el);

    if (!a$1(menu, 'visible')) {
      // Make sure all lvl 2 submenus are closed before opening another
      if (el.parentNode.dataset.depth === '1') {
        closeAll(el.parentNode);
      } else {
        closeAll();
      }

      menuTrigger.setAttribute('aria-expanded', true);
      menu.setAttribute('aria-hidden', false);
      u$2(menu, 'visible');
    } else {
      // If the toggle is closing the element from the parent close all internal
      if (a$1(el.parentNode, 'header__links-list')) {
        closeAll();
        return;
      }

      menuTrigger.setAttribute('aria-expanded', false);
      menu.setAttribute('aria-hidden', true);
      i$1(menu, 'visible');
    }
  } // We want to close the menu when anything is clicked that isn't a submenu


  function handleClick(e) {
    var hasSubmenuParent = e.target.closest('[data-submenu-parent]');
    var isIgnored = a$1(e.target, 'ignore-submenu-parent');

    if (!hasSubmenuParent || isIgnored) {
      closeAll();
    }
  }

  function closeAll() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : node;
    var subMenus = t$3('[data-submenu]', target);
    var parentTriggers = t$3('[data-parent]', target);
    i$1(subMenus, 'visible');
    subMenus.forEach(sub => sub.setAttribute('aria-hidden', true));
    parentTriggers.forEach(trig => trig.setAttribute('aria-expanded', false));
  }

  function destroy() {
    delegate.off();
    events.forEach(evt => evt());
  }

  return {
    destroy
  };
}

function PredictiveSearch(resultsContainer) {
  var settings = n$2('[data-search-settings]', document);
  var {
    limit,
    show_articles,
    show_pages
  } = JSON.parse(settings.innerHTML);
  var cachedResults = {}; // Broken down highlightable elements

  var headingOpeningElement = "<div class=\"quick-search__result-heading\">";
  var headingClosingElement = "</div>";
  var vendorsOpeningElement = '<span class="quick-search__result-vendor">';
  var vendorsClosingElement = '</span>'; // Build out type query string

  var types = 'product';

  if (show_articles) {
    types += ',article';
  }

  if (show_pages) {
    types += ',page';
  }

  function renderSearchResults(resultsMarkup) {
    resultsContainer.innerHTML = resultsMarkup;
  }

  function highlightQuery(searchTerm, searchResult) {
    var regexHeadings = new RegExp("".concat(headingOpeningElement, "(.*?)").concat(headingClosingElement), 'g');
    var regexVendors = new RegExp("".concat(vendorsOpeningElement, "(.*?)").concat(vendorsClosingElement), 'g');
    var highlightedResult = searchResult; // Highlight all instances of the search term in headings

    highlightedResult = highlightedResult.replaceAll(regexHeadings, match => {
      return highlightInner(searchTerm, match, {
        openingElement: headingOpeningElement,
        closingElement: headingClosingElement
      });
    }); // Highlight all instances of the search term in vendor -- specific to product results

    highlightedResult = highlightedResult.replaceAll(regexVendors, match => {
      return highlightInner(searchTerm, match, {
        openingElement: vendorsOpeningElement,
        closingElement: vendorsClosingElement
      });
    });
    return highlightedResult;
  }

  function highlightInner(searchTerm, matchedString, elements) {
    var regex = new RegExp("(".concat(searchTerm, ")"), 'gi');
    var highlightedSearch = matchedString; // Remove opening element

    highlightedSearch = highlightedSearch.replace(elements.openingElement, ''); // Remove closing element

    highlightedSearch = highlightedSearch.replace(elements.closingElement, ''); // Return all elements in proper order after adding highlight spans

    return elements.openingElement + highlightedSearch.replace(regex, '<mark class="hl">$1</mark>') + elements.closingElement;
  }

  function getSearchResults(searchTerm) {
    var queryKey = searchTerm.replace(' ', '-').toLowerCase(); // Render result if it appears within the cache

    if (cachedResults["".concat(queryKey)]) {
      renderSearchResults(cachedResults["".concat(queryKey)]);
      return;
    }

    fetch("".concat(window.theme.routes.predictive_search_url, "?q=").concat(encodeURIComponent(searchTerm), "&").concat(encodeURIComponent('resources[type]'), "=").concat(types, "&").concat(encodeURIComponent('resources[limit]'), "=").concat(limit, "&section_id=predictive-search")).then(response => {
      if (!response.ok) {
        var error = new Error(response.status);
        throw error;
      }

      return response.text();
    }).then(text => {
      var resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML; // Highlight query

      resultsMarkup = highlightQuery(searchTerm, resultsMarkup); // Cache results

      cachedResults[queryKey] = resultsMarkup;
      renderSearchResults(resultsMarkup);
    }).catch(error => {
      throw error;
    });
  }

  return {
    getSearchResults
  };
}

var selectors$7 = {
  trigger: '.quick-search__trigger',
  searchOverlay: '.search__overlay',
  searchInput: '.search__input',
  inputClear: '.search__input-clear',
  inputClose: '.search__input-close',
  results: '.search__results'
};
var classNames = {
  active: 'is-active',
  activeQuery: 'has-active-query',
  activeSuggestions: 'has-suggestions'
};
function QuickSearch(node) {
  var trigger = n$2(selectors$7.trigger, node);
  var overlay = n$2(selectors$7.searchOverlay, node);
  var searchInput = n$2(selectors$7.searchInput, node);
  var searchInputClear = n$2(selectors$7.inputClear, node);
  var searchInputClose = n$2(selectors$7.inputClose, node);
  var resultsContainer = n$2(selectors$7.results, node);
  var predictiveSearch = PredictiveSearch(resultsContainer);
  var events = [e$3(trigger, 'click', _showSearchBar), e$3(overlay, 'click', _hideSearchBar), e$3(document, 'keydown', _handleEsq), e$3(searchInput, 'input', _searchInputHandler), e$3(searchInputClose, 'click', _hideSearchBar), e$3(searchInputClear, 'click', _clearSearchInput)];
  var trap = createFocusTrap(node, {
    allowOutsideClick: true
  });

  function _showSearchBar(e) {
    e.preventDefault();
    u$2(node, classNames.active);
    trap.activate();
    searchInput.focus();
  }

  function _hideSearchBar(e) {
    e.preventDefault();
    trap.deactivate();
    i$1(node, classNames.active);
  }

  function _handleEsq(e) {
    if (a$1(node, classNames.active) && e.keyCode === 27) {
      _hideSearchBar(e);
    }
  }

  function _clearSearchInput(e) {
    e.preventDefault();
    searchInput.value = '';

    _searchInputHandler(e);

    searchInput.focus();
  }

  function _searchInputHandler(e) {
    var query = e.target.value;

    if (!query) {
      i$1(node, classNames.activeQuery, classNames.activeSuggestions);
      return;
    }

    u$2(node, classNames.activeQuery, classNames.activeSuggestions);
    predictiveSearch.getSearchResults(e.target.value);
  }

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
}

function renderRecent(products) {
  return products.length > 0 ? products.reduce((markup, product) => {
    markup += product.quickCartMarkup;
    return markup;
  }, '') : "<p class=\"quick-cart__empty-state\">".concat(general.products.no_recently_viewed, "</p>");
}

function QuickCart(node) {
  var overlay = n$2('.js-overlay', node);
  var itemsRoot = n$2('.js-items', node);
  var footer = n$2('.js-footer', node);
  var closeIcon = n$2('.js-close', node);
  var loading = itemsRoot.innerHTML;
  var tabLinkCart = n$2('.js-tab-link-cart', node);
  var tabLinkRecent = n$2('.js-tab-link-recent', node);
  var tabLinkQuickShop = n$2('.js-tab-link-quick-shop', node);
  var events = [e$3(tabLinkCart, 'click', e => e.preventDefault() || viewCart()), e$3(tabLinkRecent, 'click', e => e.preventDefault() || viewRecent(getRecentProducts())), e$3(tabLinkQuickShop, 'click', e => e.preventDefault() || viewQuickAdd()), e$3(overlay, 'click', () => close()), e$3(closeIcon, 'click', () => close()), e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) close();
  })];
  var cartTrap = createFocusTrap(node, {
    allowOutsideClick: true
  });
  var delegate = new Delegate(node);
  delegate.on('click', '.js-remove-single', (_, target) => {
    var qty = n$2('.js-single-quantity', target.closest('.cart__item')).innerHTML;
    cart.updateItem(target.closest('.cart__item').dataset.id, parseInt(qty) - 1);
  });
  delegate.on('click', '.js-add-single', (_, target) => {
    var qty = n$2('.js-single-quantity', target.closest('.cart__item')).innerHTML;
    cart.updateItem(target.closest('.cart__item').dataset.id, parseInt(qty) + 1);
  }); // Initial cart fetch

  cart.get().then(cart => {
    o$1({
      cart
    });
    render(cart);
  });

  var render = cart => {
    u$2(tabLinkCart, 'active');
    i$1(tabLinkQuickShop, 'active');
    i$1(tabLinkRecent, 'active');
    renderQuickCart(cart);
    renderFooter();
  };

  var renderQuickCart = cart => {
    var url = "".concat(theme.routes.cart.base, "?section_id=quick-cart");
    makeRequest('GET', url).then(response => {
      itemsRoot.innerHTML = '';
      var container = document.createElement('div');
      container.innerHTML = response;
      var cartItems = t$3('[data-cart-item]', container);

      if (cartItems.length) {
        renderCartItems({
          items: cartItems,
          itemsSorted: cart.sorted,
          highlightFirstProduct: cart.newProductAdded
        });
      } else {
        itemsRoot.innerHTML = n$2('[data-quick-cart-items]', container).innerHTML;
      }
    });
  };

  var renderFooter = () => {
    var footerUrl = "".concat(theme.routes.cart.base, "?section_id=quick-cart-footer");
    makeRequest('GET', footerUrl).then(response => {
      var container = document.createElement('div');
      container.innerHTML = response;
      var quickCartFooter = n$2('[data-quick-cart-footer]', container);

      if (quickCartFooter) {
        footer.innerHTML = quickCartFooter.innerHTML;
        u$2(footer, 'active');
      }
    });
  };

  var renderCartItems = options => {
    // cartItems must be an array of objcets to match the id's
    // of the sorted cart items
    var cartItems = options.items.map(item => {
      var itemsObject = {};
      var itemId = n$2('.cart__item', item).dataset.id;
      itemsObject.id = parseInt(itemId, 10);
      itemsObject.markup = item;
      return itemsObject;
    }); // Keep our cart in the correct sort order based on what
    // was most recently added

    var sortedItems = options.itemsSorted.map((map => row => cartItems[map.get(row.id)])(new Map(cartItems.map((row, i) => [row.id, i]))));
    sortedItems.forEach(item => {
      itemsRoot.insertAdjacentHTML('beforeend', item.markup.innerHTML);
    });

    if (options.highlightFirstProduct) {
      var firstProduct = n$2('.cart__item', itemsRoot);

      if (firstProduct) {
        u$2(firstProduct, 'cart__item--highlight');
        setTimeout(() => {
          i$1(firstProduct, 'cart__item--highlight');
        }, 2000);
      }
    }
  };

  var open = (cart, hasquickShopProduct) => {
    u$2(node, 'is-active');
    cartTrap.activate();
    itemsRoot.innerHTML = loading;

    if (u$1().quickShopProduct) {
      u$2(node, 'has-quick-shop-product');
    }

    setTimeout(() => {
      u$2(node, 'is-visible');

      if (hasquickShopProduct) {
        u$2(tabLinkQuickShop, 'active');
        setTimeout(viewQuickAdd(), 10);
      } else {
        u$2(tabLinkCart, 'active');
        setTimeout(render(cart), 10);
      }
    }, 50);
  };

  var close = () => {
    i$1(node, 'is-visible', 'has-quick-shop-product');
    i$1(tabLinkQuickShop, 'active');
    i$1(tabLinkRecent, 'active');
    i$1(tabLinkCart, 'active');
    setTimeout(() => {
      i$1(node, 'is-active');
      o$1({
        cartOpen: false
      });
      o$1({
        quickShopProduct: null
      });
      cartTrap.deactivate();
    }, 400);
  };

  var viewCart = () => {
    u$2(tabLinkCart, 'active');
    i$1(tabLinkRecent, 'active');
    i$1(tabLinkQuickShop, 'active');
    render(u$1().cart);
  };

  var viewRecent = products => {
    i$1(tabLinkCart, 'active');
    i$1(tabLinkQuickShop, 'active');
    u$2(tabLinkRecent, 'active');
    i$1(footer, 'active');
    itemsRoot.innerHTML = renderRecent(products);
  };

  var viewQuickAdd = () => {
    u$2(tabLinkQuickShop, 'active');
    i$1(tabLinkCart, 'active');
    i$1(tabLinkRecent, 'active');
    i$1(footer, 'active');
    itemsRoot.innerHTML = '';
    itemsRoot.appendChild(u$1().quickShopProduct);
  };

  c('cart:toggle', _ref2 => {
    var {
      cart,
      cartOpen,
      quickShopProduct
    } = _ref2;
    cartOpen ? open(cart, quickShopProduct) : close();
  });
  c('cart:updated', _ref3 => {
    var {
      cartOpen
    } = _ref3;
    i$1(node, 'has-quick-shop-product'); // Rerender the cart list only if cart is open

    if (cartOpen) {
      render(u$1().cart);
    }
  });

  var unload = () => {
    events.forEach(unsubscribe => unsubscribe());
  };

  return {
    unload
  };
}

var n,e,i,o,t,r,f,d,p,u=[];function w(n,a){return e=window.pageXOffset,o=window.pageYOffset,r=window.innerHeight,d=window.innerWidth,void 0===i&&(i=e),void 0===t&&(t=o),void 0===p&&(p=d),void 0===f&&(f=r),(a||o!==t||e!==i||r!==f||d!==p)&&(!function(n){for(var w=0;w<u.length;w++)u[w]({x:e,y:o,px:i,py:t,vh:r,pvh:f,vw:d,pvw:p},n);}(n),i=e,t=o,f=r,p=d),requestAnimationFrame(w)}function srraf(e){return u.indexOf(e)<0&&u.push(e),n=n||w(performance.now()),{update:function(){return w(performance.now(),!0),this},destroy:function(){u.splice(u.indexOf(e),1);}}}

var selectors$6 = {
  headerContainer: '.header-container',
  headerWrapper: '#header',
  announcementBar: '.announcement-bar-section',
  logoWrapper: '.header__logo-wrapper'
};
function StickyHeader(node) {
  var root = document.documentElement; // Elements can change when resizing or altering header

  var headerParent = null;
  var headerHeight = null;
  var headerWrapper = null;
  var announcementBar = null;
  var announcementBarHeight = null;
  var logo = null;
  var headerHasCustomLogoImage = null;
  var transparentEnabled = null;
  var scroller = null;
  var stickyScroller = null; // Breakpoint is equal to 60em

  var mediumBP = 960;
  var offsetRootVar = '--header-offset-height'; // get elements & element heights

  var _defineElements = () => {
    headerParent = document.querySelector(selectors$6.headerContainer);
    headerWrapper = node.querySelector(selectors$6.headerWrapper);
    announcementBar = node.querySelector(selectors$6.announcementBar);
    announcementBarHeight = announcementBar ? announcementBar.offsetHeight : 0;
    headerHeight = announcementBarHeight + headerWrapper.offsetHeight;
    logo = node.querySelector(selectors$6.logoWrapper);
    headerHasCustomLogoImage = node.querySelector('.header__logo-image img'); // True if the transparent header is enabled in the theme editor

    transparentEnabled = JSON.parse(headerWrapper.dataset.transparentHeader);
  };

  _defineElements();

  var _screenUnderMediumBP = () => {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return viewportWidth <= mediumBP;
  };

  var screenUnderMediumBP = _screenUnderMediumBP();

  scroller = srraf(_ref => {
    var {
      vw
    } = _ref;

    _setRootVar('--header-height', announcementBarHeight + headerWrapper.offsetHeight);

    var currentScreenWidthUnderMediumBP = vw <= mediumBP;

    if (currentScreenWidthUnderMediumBP !== screenUnderMediumBP) {
      screenUnderMediumBP = currentScreenWidthUnderMediumBP;

      _setupStickyHeader();
    }
  });

  var _setRootVar = (name, value) => {
    root.style.setProperty(name, "".concat(value, "px"));
  };

  var _setHeaderType = () => {
    // Remove header types incase of customizer changes
    root.classList.remove('header-transparent', 'header-sticky');
    root.classList.add(transparentEnabled ? 'header-transparent' : 'header-sticky');
  };

  var _setupStickyHeader = () => {
    //redifine elements & heights
    _defineElements(); // If the header has a logo image we calculate values after image has loaded


    if (!headerHasCustomLogoImage || headerHasCustomLogoImage && headerHasCustomLogoImage.complete) {
      _processStickyHeader();
    } else {
      headerHasCustomLogoImage.addEventListener('load', _processStickyHeader, {
        once: true
      });
    }
  };

  var _processStickyHeader = () => {
    _setRootVar(offsetRootVar, headerHeight);

    _setHeaderType();

    _initStickyHeader(_getStickyOffsets());
  }; // Returns object of offset values


  var _getStickyOffsets = () => {
    // Get the headers base padding-top string value
    var headerBaseTopPaddingPixelValue = getComputedStyle(headerWrapper).getPropertyValue('padding-top'); // Get the int value of the header base padding

    var headerBaseTopPadding = parseInt(headerBaseTopPaddingPixelValue);
    var headerDesktopStyleIsMobile = headerWrapper.classList.contains('header--always-mobile');
    var headerLogoHeight = logo.offsetHeight;
    var offsets = {};
    offsets.stickyHeaderResetPosition = 0; // Set offSets based on size and content of header

    if (screenUnderMediumBP && headerHasCustomLogoImage || headerDesktopStyleIsMobile && headerHasCustomLogoImage) {
      offsets.offsetHeight = announcementBarHeight;
      offsets.scrollYToSticky = announcementBarHeight;
    } else if (screenUnderMediumBP) {
      if (announcementBarHeight) {
        offsets.scrollYToSticky = announcementBarHeight;
      } else {
        // Need to default to 1 to not enable sticky header at all times on mobile
        offsets.scrollYToSticky = 1;
        offsets.stickyHeaderResetPosition = 1;
      }

      offsets.offsetHeight = announcementBarHeight;
    } else if (headerDesktopStyleIsMobile) {
      offsets.offsetHeight = announcementBarHeight;
      offsets.scrollYToSticky = announcementBarHeight;
    } else {
      offsets.offsetHeight = headerLogoHeight + announcementBarHeight + headerBaseTopPadding;
      offsets.scrollYToSticky = announcementBarHeight + headerLogoHeight + headerBaseTopPadding;
    }

    return offsets;
  };

  var _initStickyHeader = offsets => {
    var {
      scrollYToSticky,
      offsetHeight,
      stickyHeaderResetPosition
    } = offsets; // Destroy stickyScroller if one already exists

    if (stickyScroller) {
      stickyScroller.destroy();
    } // Init the scroller to monitor for y position to stick/unstick header


    stickyScroller = srraf(_ref2 => {
      var {
        y
      } = _ref2;

      if (y < scrollYToSticky) {
        _toggleStickyHeader(false, headerParent);

        _setElementTopPosition(headerParent, stickyHeaderResetPosition);

        _setRootVar(offsetRootVar, headerHeight - y);
      } else if (y >= scrollYToSticky) {
        _toggleStickyHeader(true, headerParent);

        _setElementTopPosition(headerParent, -offsetHeight);

        _setRootVar(offsetRootVar, headerHeight - offsetHeight);
      }
    });
    stickyScroller.update();
  };

  var _setElementTopPosition = (element, value) => {
    element.style.top = "".concat(value, "px");
  };

  var _toggleStickyHeader = (isSticky, element) => {
    if (isSticky) {
      element.classList.add('is-sticky');
      headerWrapper.classList.remove('header--transparent');
    } else {
      element.classList.remove('is-sticky');

      if (transparentEnabled) {
        headerWrapper.classList.add('header--transparent');
      }
    }
  };

  var _reload = () => {
    scroller.update();

    _setupStickyHeader(); // Let pages know the header changed


    r$2('headerChange', () => {});
  };

  c('sticky-header:reload', () => {
    _reload();
  });

  _setupStickyHeader();

  var unload = () => {
    if (scroller) {
      scroller.destroy();
    }

    if (stickyScroller) {
      stickyScroller.destroy();
    }
  };

  return {
    unload
  };
}

var selectors$5 = {
  clear: '[data-search-clear]',
  input: '[data-input]',
  results: '[data-search-results]',
  search: '[data-search-submit]'
};
function DrawerSearch(container) {
  // Elements
  var input = n$2(selectors$5.input, container);
  var resultsContainer = n$2(selectors$5.results, container);
  var clearButton = n$2(selectors$5.clear, container);
  var searchButton = n$2(selectors$5.search, container);
  var predictiveSearch = PredictiveSearch(resultsContainer); // Events

  var inputChange = e$3(input, 'input', handleInputChange);
  var clearClick = e$3(clearButton, 'click', reset);

  function handleInputChange(_ref) {
    var {
      target: {
        value
      }
    } = _ref;
    if (value === '') reset();
    l([clearButton, searchButton], 'visible', value !== '');
    l(input, 'active', value !== '');
    predictiveSearch.getSearchResults(value);
  }

  function reset(e) {
    e && e.preventDefault();
    clear();
    input.focus();
  }

  function clear() {
    input.value = '';
    i$1([resultsContainer, clearButton, searchButton], 'visible');
    i$1(input, 'active');
    resultsContainer.innerHTML = '';
  }

  function unload() {
    inputChange();
    clearClick();
  }

  return {
    unload,
    clear
  };
}

var sel = {
  overlay: '[data-overlay]',
  listItem: '[data-list-item]',
  item: '[data-item]',
  allLinks: '[data-all-links]',
  main: '[data-main]',
  primary: '[data-primary-container]',
  // Cross border
  form: '.drawer-menu__form',
  localeInput: '[data-locale-input]',
  currencyInput: '[data-currency-input]'
};
var classes$2 = {
  active: 'active',
  visible: 'visible',
  childVisible: 'child-visible'
}; // Extra space we add to the height of the inner container

var formatHeight = h => h + 8 + 'px';

var menu = node => {
  var focusTrap = createFocusTrap(node); // The individual link list the merchant selected

  var linksDepth = 0; // This is the element that holds the one we move left and right (primary)
  // We also need to assign its height initially so we get smooth transitions

  var main = n$2(sel.main, node); // Element that holds all the primary links and moves left and right

  var primary = n$2(sel.primary, node); // Cross border

  var form = n$2(sel.form, node);
  var localeInput = n$2(sel.localeInput, node);
  var currencyInput = n$2(sel.currencyInput, node);
  var search = DrawerSearch(node); // Nodes

  var overlay = n$2(sel.overlay, node);
  var parents = t$3('[data-item="parent"]', node);
  var parentBack = t$3('[data-item="back"]', node);
  var languages = t$3('[data-item="locale"]', node);
  var currencies = t$3('[data-item="currency"]', node);
  var closeButtons = t$3('[data-drawer-close]', node);
  var events = [// Click on overlay or close button
  e$3(overlay, 'click', close), e$3(closeButtons, 'click', close), // Esq pressed
  e$3(node, 'keydown', _ref => {
    var {
      keyCode
    } = _ref;
    if (keyCode === 27) close();
  }), // Element that will navigate to child navigation list
  e$3(parents, 'click', clickParent), // Element that will navigate back up the tree
  e$3(parentBack, 'click', clickBack), // // Individual language
  e$3(languages, 'click', e => handleCrossBorder(e, localeInput)), // // // Individual currency
  e$3(currencies, 'click', e => handleCrossBorder(e, currencyInput))];

  function open() {
    u$2(node, classes$2.active);
    setTimeout(() => {
      u$2(node, classes$2.visible);
      focusTrap.activate();
      disableBodyScroll(node, {
        allowTouchMove: el => {
          while (el && el !== document.body) {
            if (el.getAttribute('data-scroll-lock-ignore') !== null) {
              return true;
            }

            el = el.parentNode;
          }
        },
        reserveScrollBarGap: true
      });

      if (linksDepth === 0) {
        main.style.height = formatHeight(primary.offsetHeight);
      }
    }, 50);
  }

  function close() {
    focusTrap.deactivate();
    i$1(node, classes$2.visible);
    setTimeout(() => {
      i$1(node, classes$2.active);
      enableBodyScroll(node);
    }, 350);
  }

  function clickParent(e) {
    e.preventDefault();
    var link = e.currentTarget;
    var childMenu = link.nextElementSibling;
    var firstFocusable = n$2('.drawer-menu__link', childMenu);
    u$2(childMenu, classes$2.visible);
    u$2(link.parentNode, classes$2.childVisible);

    if (childMenu.hasAttribute('data-search-menu')) {
      u$2(node, 'search-active');
    }

    main.style.height = formatHeight(childMenu.offsetHeight);
    navigate(linksDepth += 1);
    link.setAttribute('aria-expanded', true);
    childMenu.setAttribute('aria-hidden', false);
    setTimeout(() => {
      firstFocusable.focus();
    }, 50);
  }

  function navigate(depth) {
    linksDepth = depth;
    primary.setAttribute('data-depth', depth);
  }

  function clickBack(e) {
    e.preventDefault();
    var menuBefore = e.currentTarget.closest(sel.listItem).closest('ul');
    var firstFocusable = n$2('.drawer-menu__link', menuBefore);
    var menu = e.currentTarget.closest('ul');
    var parentLink = n$2('.drawer-menu__link', menu.parentNode);
    i$1(menu, classes$2.visible);
    i$1(parentLink.parentNode, classes$2.childVisible);
    navigate(linksDepth -= 1);
    parentLink.setAttribute('aria-expanded', false);
    menu.setAttribute('aria-hidden', true);
    main.style.height = formatHeight(menuBefore.offsetHeight);

    if (menu.hasAttribute('data-search-menu')) {
      search.clear();
      i$1(node, 'search-active');
    }

    setTimeout(() => {
      firstFocusable.focus();
    }, 50);
  }

  function handleCrossBorder(e, input) {
    var {
      value
    } = e.currentTarget.dataset;
    input.value = value;
    close();
    form.submit();
  }

  function unload() {
    events.forEach(unsubscribe => unsubscribe());
    enableBodyScroll(node);
    search.unload();
  }

  return {
    close,
    unload,
    open
  };
};

var selectors$4 = {
  jsCartCount: '.js-cart-count',
  jsCartToggle: '.js-cart-drawer-toggle'
};
register('header', {
  onLoad() {
    this.menuButton = n$2('#mobile-nav', this.container);
    this.quickSearch = QuickSearch(n$2('.quick-search', this.container));
    this.quickCart = QuickCart(n$2('[data-quick-cart]', this.container));
    this.stickyHeader = StickyHeader(n$2('[data-sticky-header]', document));
    this.drawerMenu = menu(n$2('[data-drawer-menu]', this.container));
    var cartCount = n$2(selectors$4.jsCartCount, this.container);
    var cartToggles = t$3(selectors$4.jsCartToggle, this.container);
    this.desktopNav = new Navigation(this.container);
    e$3(this.menuButton, 'click', this.drawerMenu.open);
    c('cart:updated', state => {
      cartCount.innerHTML = state.cart.item_count;
    });
    cartToggles.forEach(toggle => {
      e$3(toggle, 'click', e => {
        e.preventDefault();
        r$2('cart:toggle', state => {
          return {
            cartOpen: !state.cartOpen
          };
        });
      });
    });
  },

  onSelect() {
    r$2('sticky-header:reload', () => {});
  },

  onUnload() {
    this.quickSearch.unload();
    this.stickyHeader.unload();
    this.drawerMenu.unload();
  }

});

var config = {
  dynamic: '.js-product-recommendations',
  bp: 608,
  slider: '[data-slider]',
  productTile: '[data-product-tile]'
};
register('product-recommendations', {
  dotNavigation: null,

  onLoad() {
    var {
      sectionId
    } = this.container.dataset;
    var recommendationsSection = n$2(config.dynamic, this.container);

    if (recommendationsSection === null) {
      return;
    }

    this.slider;
    this.productTiles = [];
    var {
      productId: id,
      limit
    } = recommendationsSection.dataset;
    var requestUrl = "".concat(theme.routes.productRecommendations, "?section_id=").concat(sectionId, "&limit=").concat(limit, "&product_id=").concat(id);
    var request = new XMLHttpRequest();
    request.open('GET', requestUrl, true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        var container = document.createElement('div');
        container.innerHTML = request.response;
        recommendationsSection.innerHTML = container.querySelector(config.dynamic).innerHTML;
        var sliderContainer = n$2(config.slider, recommendationsSection);
        var productTiles = t$3(config.productTile, recommendationsSection);

        if (sliderContainer) {
          import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
            var {
              default: Flickity
            } = _ref;
            this.slider = new Flickity(sliderContainer, {
              adaptiveHeight: true,
              pageDots: false,
              prevNextButtons: false,
              watchCSS: true,
              wrapAround: false
            });
            productTiles.forEach(tile => {
              this.productTiles.push(ProductTitle(tile));
            });

            if (productTiles.length > 1) {
              this.dotNavigation = navigationDots(this.container, this.slider);
              this.slider.on('select', () => {
                this.dotNavigation.update(this.slider.selectedIndex);
              });
            }
          });
        }
      }
    };

    request.send();
  },

  onUnload() {
    this.slider && this.slider.destroy();
    this.productTiles.forEach(tile => tile.unload());
  }

});

var {
  strings: {
    accessibility: strings
  }
} = window.theme;
var selectors$3 = {
  settings: '[data-settings-data]',
  slider: '[data-slider]',
  recentlyViewed: '.recently-viewed__products',
  productTile: '[data-product-tile]',
  navigation: '[data-navigation]'
};
register('recently-viewed', {
  onLoad() {
    var {
      productCount,
      imageAspectRatio
    } = this.container.dataset;
    this.productCount = parseInt(productCount, 10);
    this.imageAspectRatio = imageAspectRatio;
    this.recentProductsContainer = n$2(selectors$3.recentlyViewed, this.container);
    this.sliderNavigation = n$2(selectors$3.navigation, this.container);
    this.sliderContainer = n$2(selectors$3.slider, this.container);
    this.dotNavigation = null; // Grab products from localStorage

    var recentItems = getRecentProducts();

    if ((recentItems || []).length >= 3) {
      this._renderItems(recentItems);

      this._renderAccessibleDotNavigation(recentItems);
    }
  },

  _renderItems(items) {
    var recentItems = items.slice(0, this.productCount);
    var actions = recentItems.map(this._renderItem.bind(this));
    var results = Promise.all(actions);
    results.then(() => {
      import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
        var {
          default: Flickity
        } = _ref;
        this.slider = new Flickity(this.sliderContainer, {
          adaptiveHeight: true,
          pageDots: false,
          prevNextButtons: false,
          watchCSS: true,
          wrapAround: false
        });
        u$2(this.container, 'visible');
        this.productTiles = t$3(selectors$3.productTile, this.container).map(tile => ProductTitle(tile));
        t$3('.recently-viewed__product', this.container).forEach(item => {
          if (this.imageAspectRatio !== 'natural') {
            var classMod = 'image-aspect-ratio--' + this.imageAspectRatio;
            u$2(item, 'image-aspect-ratio', classMod);
          }
        });
        setTimeout(() => {
          this.slider.resize();
        }, 500);
        this.dotNavigation = navigationDots(this.container, this.slider);
        this.slider.on('select', () => {
          this.dotNavigation.update(this.slider.selectedIndex);
        });
      });
    });
  },

  _renderItem(item) {
    return new Promise(resolve => {
      var requestUrl = "".concat(theme.routes.products, "/").concat(encodeURIComponent(item.handle), "?section_id=recently-viewed-item");
      makeRequest('GET', requestUrl).then(response => {
        var container = document.createElement('div');
        container.innerHTML = response;
        var productTile = container.querySelector('[data-recently-viewed-item]').innerHTML;
        this.recentProductsContainer.insertAdjacentHTML('beforeend', productTile);
        resolve();
      });
    });
  },

  _renderAccessibleDotNavigation(items) {
    var html = "\n      <div class=\"navigation-dots\">\n        <div class=\"navigation-dots__inner\">\n          ".concat(items.slice(0, this.productCount).map((_, i) => {
      var visibleClass = i === 0 ? 'is-selected' : '';
      return "\n              <button\n                type=\"button\"\n                class=\"navigation-dot ".concat(visibleClass, "\"\n                data-slide-index=\"").concat(i, "\"\n                aria-label=\"").concat(strings.carousel_select_js, " ").concat(i, "\"\n              >\n                <span class=\"navigation-dot__inner\"></span>\n              </button>\n            ");
    }).join(''), "\n        </div>\n      </div>\n    ");
    this.sliderNavigation.insertAdjacentHTML('beforeend', html);
  },

  _destroy() {
    this.slider && this.slider.destroy();
    this.productTiles.forEach(tile => tile.unload());
  },

  onUnload() {
    this._destroy();
  }

});

var ei = {
  get: () => JSON.parse(localStorage.getItem('exitIntent')),
  set: val => localStorage.setItem('exitIntent', val)
};
var classes$1 = {
  visible: 'visible',
  hidden: 'hidden',
  active: 'active'
};
register('popup', {
  bodyListener: null,

  onLoad() {
    var closeBtn = n$2('[data-close-icon]', this.container);
    var mobileTimeout = parseInt(this.container.dataset.mobileLandingTimeout);
    this.closeBtnHandler = e$3(closeBtn, 'click', e => this.close(e));

    if (!ei.get() && isMobile$1()) {
      setTimeout(() => {
        this._show();
      }, mobileTimeout);
    } else if (!ei.get() && !Shopify.designMode) {
      this.bodyListener = e$3(document.body, 'mouseout', this._mouseLeave.bind(this));
    }
  },

  _mouseLeave(e) {
    if (!e.relatedTarget && !e.toElement) {
      this._show();

      this.bodyListener && this.bodyListener();
    }
  },

  close(e) {
    e.preventDefault();

    this._hide();

    ei.set(true);
  },

  _show() {
    u$2(this.container, classes$1.active);
    setTimeout(() => {
      u$2(this.container, classes$1.visible);
    }, 250);
  },

  _hide() {
    u$2(this.container, classes$1.hidden);
    i$1(this.container, classes$1.visible);
    setTimeout(() => {
      i$1(this.container, classes$1.active);
    }, 250);
  },

  onSelect() {
    this._show();
  },

  onDeselect() {
    this._hide();
  },

  onUnload() {
    this.closeBtnHandler();
  }

});

// Public Methods
// -----------------------------------------------------------------------------

/**
 * Returns a URL with a variant ID query parameter. Useful for updating window.history
 * with a new URL based on the currently select product variant.
 * @param {string} url - The URL you wish to append the variant ID to
 * @param {number} id  - The variant ID you wish to append to the URL
 * @returns {string} - The new url which includes the variant ID query parameter
 */

function getUrlWithVariant(url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, '$1' + id);
  } else if (/\?/.test(url)) {
    return url.concat('&variant=').concat(id);
  }

  return url.concat('?variant=').concat(id);
}

function Media(node) {
  var {
    Shopify,
    YT
  } = window;
  var elements = t$3('[data-interactive]', node);
  if (!elements.length) return;
  var acceptedTypes = ['video', 'model', 'external_video'];
  var activeMedia = null;
  var featuresLoaded = false;
  var instances = {};

  if (featuresLoaded) {
    elements.forEach(initElement);
  }

  window.Shopify.loadFeatures([{
    name: 'model-viewer-ui',
    version: '1.0'
  }, {
    name: 'shopify-xr',
    version: '1.0'
  }, {
    name: 'video-ui',
    version: '1.0'
  }], () => {
    featuresLoaded = true;

    if ('YT' in window && Boolean(YT.loaded)) {
      elements.forEach(initElement);
    } else {
      window.onYouTubeIframeAPIReady = function () {
        elements.forEach(initElement);
      };
    }
  });

  function initElement(el) {
    var {
      mediaId,
      mediaType
    } = el.dataset;
    if (!mediaType || !acceptedTypes.includes(mediaType)) return;
    if (Object.keys(instances).includes(mediaId)) return;
    var instance = {
      id: mediaId,
      type: mediaType,
      container: el,
      media: el.children[0]
    };

    switch (instance.type) {
      case 'video':
        instance.player = new Shopify.Plyr(instance.media, {
          loop: {
            active: el.dataset.loop == 'true'
          }
        });
        break;

      case 'external_video':
        instance.player = new YT.Player(instance.media);
        break;

      case 'model':
        instance.viewer = new Shopify.ModelViewerUI(n$2('model-viewer', el));
        e$3(n$2('.model-poster', el), 'click', e => {
          e.preventDefault();
          playModel(instance);
        });
        break;
    }

    instances[mediaId] = instance;

    if (instance.player) {
      if (instance.type === 'video') {
        instance.player.on('playing', () => {
          pauseActiveMedia(instance);
          activeMedia = instance;
        });
      } else if (instance.type === 'external_video') {
        instance.player.addEventListener('onStateChange', event => {
          if (event.data === 1) {
            pauseActiveMedia(instance);
            activeMedia = instance;
          }
        });
      }
    }
  }

  function playModel(instance) {
    pauseActiveMedia(instance);
    instance.viewer.play();
    u$2(instance.container, 'model-active');
    activeMedia = instance;
    setTimeout(() => {
      n$2('model-viewer', instance.container).focus();
    }, 300);
  }

  function pauseActiveMedia(instance) {
    if (!activeMedia || instance == activeMedia) return;

    if (activeMedia.player) {
      if (activeMedia.type === 'video') {
        activeMedia.player.pause();
      } else if (activeMedia.type === 'external_video') {
        activeMedia.player.pauseVideo();
      }

      activeMedia = null;
      return;
    }

    if (activeMedia.viewer) {
      i$1(activeMedia.container, 'model-active');
      activeMedia.viewer.pause();
      activeMedia = null;
    }
  }

  return {
    pauseActiveMedia
  };
}

var selectors$2 = {
  drawerTrigger: '[data-store-availability-drawer-trigger]',
  drawer: '[data-store-availability-drawer]',
  productTitle: '[data-store-availability-product-title]',
  storeList: '[data-store-availability-list-content]'
};

var storeAvailability = (container, product, variant) => {
  var storeList = null;
  var currentVariant = variant;
  var delegate = new Delegate(container);

  var _clickHandler = e => {
    e.preventDefault();
    r$2(globalEvents.availability.toggleDrawer, () => ({
      availabilityOpen: !u$1().availabilityOpen,
      product,
      variant: currentVariant,
      storeList
    }));
  };

  var update = variant => {
    currentVariant = variant;
    var variantSectionUrl = "".concat(container.dataset.baseUrl, "/variants/").concat(variant.id, "/?section_id=store-availability");
    container.innerHTML = '';
    fetch(variantSectionUrl).then(response => {
      return response.text();
    }).then(storeAvailabilityHTML => {
      if (storeAvailabilityHTML.trim() === '') return; // Remove section wrapper that throws nested sections error

      container.innerHTML = storeAvailabilityHTML;
      container.innerHTML = container.firstElementChild.innerHTML;
      storeList = n$2(selectors$2.storeList, container);
    });
  }; // Intialize


  update(variant);
  delegate.on('click', selectors$2.drawerTrigger, _clickHandler);

  var unload = () => {
    container.innerHTML = '';
  };

  return {
    unload,
    update
  };
};

var selectors$1 = {
  close: '[data-close]',
  slider: '[data-slider]',
  slide: '[data-slide]',
  imageById: id => "[data-id='".concat(id, "']"),
  navItem: '[data-nav-item]',
  wrapper: '.lightbox__images-wrapper',
  prevButton: '[data-prev]',
  nextButton: '[data-next]'
};
var classes = {
  visible: 'visible',
  active: 'active',
  zoom: 'zoom'
};
function Lightbox(node) {
  if (!node) return;
  var trap = createFocusTrap(node);
  var navItems = t$3(selectors$1.navItem, node);
  var wrapper = n$2(selectors$1.wrapper, node);
  var images = t$3(selectors$1.slide, node);
  var previousButton = n$2(selectors$1.prevButton, node);
  var nextButton = n$2(selectors$1.nextButton, node);
  var sliderContainer = n$2(selectors$1.slider, node);
  var events, slider;
  import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
    var {
      default: Flickity
    } = _ref;
    slider = new Flickity(sliderContainer, {
      adaptiveHeight: true,
      draggable: isMobile$1({
        tablet: true,
        featureDetect: true
      }),
      prevNextButtons: false,
      wrapAround: false,
      pageDots: false
    });

    if (images.length > 1) {
      slider.on('scroll', progress => {
        _resetZoom();

        var progressScale = progress * 100; // https://github.com/metafizzy/flickity/issues/289

        previousButton.disabled = progressScale < 1;
        nextButton.disabled = progressScale > 99;
      });
      slider.on('select', () => {
        navItems.forEach(item => i$1(item, classes.active));
        u$2(navItems[slider.selectedIndex], classes.active);
        navItems[slider.selectedIndex].scrollIntoView({
          behavior: 'smooth',
          inline: 'nearest'
        });
      });
    } else {
      u$2(previousButton, 'hidden');
      u$2(nextButton, 'hidden');
      previousButton.disabled = true;
      nextButton.disabled = true;
    }

    events = [e$3(n$2(selectors$1.close, node), 'click', e => {
      e.preventDefault();
      close();
    }), e$3(node, 'keydown', _ref2 => {
      var {
        keyCode
      } = _ref2;
      if (keyCode === 27) close();
    }), e$3(navItems, 'click', e => {
      e.preventDefault();
      var {
        index
      } = e.currentTarget.dataset;
      slider.select(index);
    }), e$3(images, 'click', e => {
      e.preventDefault();

      _handleZoom(e);
    }), e$3(previousButton, 'click', () => slider.previous()), e$3(nextButton, 'click', () => slider.next())];
  });

  function _handleZoom(event) {
    var image = event.currentTarget;
    var zoomed = image.classList.contains(classes.zoom);
    l(image, classes.zoom, !zoomed);

    if (zoomed) {
      _resetZoom(image);

      return;
    }

    var x = event.clientX;
    var y = event.clientY + wrapper.scrollTop - sliderContainer.offsetTop;
    var xDelta = (x - image.clientWidth / 2) * -1;
    var yDelta = (y - image.clientHeight / 2) * -1;
    image.style.transform = "translate3d(".concat(xDelta, "px, ").concat(yDelta, "px, 0) scale(2)");
  }

  function _resetZoom(image) {
    if (image) {
      i$1(image, classes.zoom);
      image.style.transform = "translate3d(0px, 0px, 0) scale(1)";
      return;
    }

    images.forEach(image => {
      i$1(image, classes.zoom);
      image.style.transform = "translate3d(0px, 0px, 0) scale(1)";
    });
  }

  function open(id) {
    u$2(node, classes.active);
    setTimeout(() => {
      u$2(node, classes.visible);
      disableBodyScroll(node, {
        allowTouchMove: el => {
          while (el && el !== document.body) {
            if (el.getAttribute('data-scroll-lock-ignore') !== null) {
              return true;
            }

            el = el.parentNode;
          }
        },
        reserveScrollBarGap: true
      });
      trap.activate();
      var image = n$2(selectors$1.imageById(id), node);
      var {
        slideIndex
      } = image.dataset;
      slider && slider.select(slideIndex, false, true);
    }, 50);
  }

  function close() {
    _resetZoom();

    i$1(node, classes.visible);
    setTimeout(() => {
      i$1(node, classes.active);
      enableBodyScroll(node);
      trap.deactivate();
    }, 300);
  }

  function destroy() {
    events.forEach(unsubscribe => unsubscribe());
    slider && slider.destroy();
  }

  return {
    destroy,
    open
  };
}

var selectors = {
  variantPopupTrigger: '[data-variant-popup-trigger]'
};

var variantPopup = node => {
  var delegate = new Delegate(node);

  var _variantPopupHandler = e => {
    e.preventDefault();
    var {
      modalContentId
    } = e.target.dataset;
    var moreInfoContent = n$2("#".concat(modalContentId), node);
    r$2('modal:open', null, {
      modalContent: moreInfoContent
    });
  };

  delegate.on('click', selectors.variantPopupTrigger, _variantPopupHandler);

  var unload = () => {
    delegate.destroy();
  };

  return {
    unload
  };
};

var {
  product: selector
} = selectors$s;
register('product', {
  productForm: null,
  swatchGroups: [],
  availability: null,
  events: [],
  reviewsHandler: null,

  //
  //
  //
  //
  onLoad() {
    this.media = Media(this.container);
    var {
      enableAjax
    } = this.container.dataset;
    var inYourSpaceButton = n$2('.bttn.product__in-space-bttn', this.container);

    if (isMobile$1() && Boolean(inYourSpaceButton)) {
      u$2(inYourSpaceButton, 'visible');
    }

    this.formElement = n$2(selector.form, this.container);
    this.isProductPage = !Boolean(this.container.dataset.isDynamic);
    if (!this.formElement) return;
    var {
      productHandle
    } = this.formElement.dataset;
    this.quantityError = n$2('[data-quantity-error]', this.container);
    this.storeAvailabilityContainer = n$2(selector.storeAvailability, this.formElement);
    var productJSON = getProduct(productHandle);
    productJSON(data => {
      var options = {
        variantSelector: '#variant-selector',
        onOptionChange: e => this.onOptionChange(e)
      };

      if (enableAjax) {
        options.onFormSubmit = e => this.onFormSubmit(e);
      }

      this.productForm = ProductForm(this.formElement, data, options);

      if (this.isProductPage) {
        this._storeView(data);

        this._initLightbox();
      }

      updatePrices.call(this, this.productForm.getVariant()); // Surface pickup

      var variant = this.productForm.getVariant();

      if (this.storeAvailabilityContainer && variant) {
        this.availability = storeAvailability(this.storeAvailabilityContainer, data, variant);
      }

      var productInventoryJson = n$2('[data-product-inventory-json]', this.container);

      if (productInventoryJson) {
        var jsonData = JSON.parse(productInventoryJson.innerHTML);
        var variantsInventories = jsonData.inventory;

        if (variantsInventories) {
          var config = {
            id: variant.id,
            variantsInventories
          };
          this.inventoryCounter = inventoryCounter(this.container, config);
        }
      }
    });
    this.isSlider = false;
    this._handleSwitch = this._handleSwitch.bind(this);

    this._initImageSwitching();

    this._initImageCarousel();

    updateMedia.call(this, this.container.querySelector('[data-product-initial-image]').dataset.productInitialImage, false);
    this.swatches = createSwatchGroups(this.container, '[data-product-swatches]');
    this.variantPopup = variantPopup(this.container);
    var accordions = t$3('.accordion', this.container);

    if (accordions.length) {
      this.accordions = Accordions(accordions);
    }

    window.SPRCallbacks = {};

    window.SPRCallbacks.onReviewsLoad = () => {
      if (!this.reviewsHandler) {
        this.reviewsHandler = reviewsHandler();
      }
    };

    var productDescriptionWrapper = n$2('.product__description', this.container);

    if (productDescriptionWrapper) {
      wrapIframes(t$3('iframe', productDescriptionWrapper));
      wrapTables(t$3('table', productDescriptionWrapper));
    }
  },

  //
  //
  //
  //
  onUnload() {
    this.productForm && this.productForm.destroy();
    this.swatches && this.swatches();
    this.accordions && this.accordions.unload();
    this.variantPopup && this.variantPopup.unload();

    if (this.isSlider) {
      this.thumbnailSlider && this.thumbnailSlider.destroy();
    }

    this.events.forEach(unsubsribe => unsubsribe());
  },

  //
  //
  // A callback method that is fired whenever the user changes the value of an option input.
  onOptionChange(event) {
    var {
      variant
    } = event.dataset; // Update sku

    updateSku(this.container, variant); // Update inventory counter

    this.inventoryCounter && this.inventoryCounter.update(variant);

    if (!variant) {
      updateBuyButton.call(this, {
        available: false
      });

      if (this.availability && this.storeAvailabilityContainer) {
        this.availability.unload();
      }

      return;
    } // We only want to update the URL on the product page


    if (!Boolean(this.container.dataset.isDynamic)) {
      var url = getUrlWithVariant(window.location.href, variant.id);
      window.history.replaceState({
        path: url
      }, '', url);
    } // We need to set the id input manually so the Dynamic Checkout Button works


    var selectedVariantOpt = n$2("".concat(selector.variantSelect, " ").concat(selector.optionById(variant.id)), this.container);
    selectedVariantOpt.selected = true; // We need to dispatch an event so Shopify pay knows the form has changed

    this.formElement.dispatchEvent(new Event('change'));
    variant.featured_media && updateMedia.call(this, variant.featured_media.id, true);
    updatePrices.call(this, variant);
    updateBuyButton.call(this, variant); // Update unit pricing

    updateUnitPrices(this.container, variant);
    this.availability && this.availability.update(variant);
  },

  //
  //
  //
  //
  onFormSubmit(evt) {
    evt.preventDefault();
    var buttons = t$3(selector.addButton, document);
    buttons.forEach(el => u$2(el, 'bttn--loading'));
    u$2(this.quantityError, 'hidden');
    cart.addItem(this.formElement).then(() => {
      r$2('cart:toggle', state => {
        return {
          cartOpen: !state.cartOpen
        };
      });
      buttons.forEach(el => i$1(el, 'bttn--loading'));
    }).catch(() => {
      i$1(this.quantityError, 'hidden');
      buttons.forEach(el => i$1(el, 'bttn--loading'));
    });
  },

  //
  //
  //
  //
  _initImageSwitching() {
    this.events.push(e$3(t$3(selector.thumb, this.container), 'click', this._handleSwitch));
  },

  //
  //
  //
  //
  _initLightbox() {
    this.images = t$3('.product__image', this.container);
    var lightbox = this.container.querySelector('[data-lightbox]');
    this.lightbox = Lightbox(lightbox);
    this.images.forEach(image => {
      this.events.push(e$3(image, 'click', this._handleImageClick.bind(this)));
    });
  },

  _handleImageClick(e) {
    e.preventDefault();
    this.lightbox.open(e.currentTarget.dataset.open);
  },

  //
  //
  //
  //
  _initImageCarousel() {
    var sliderEl = n$2(selector.thumbs, this.container);
    if (!sliderEl) return;
    import('./index-5374bf65.js').then(function (n) { return n.i; }).then(_ref => {
      var {
        default: Flickity
      } = _ref;
      this.thumbnailSlider = new Flickity(sliderEl, {
        adaptiveHeight: true,
        cellAlign: 'left',
        on: {
          ready: () => {
            this.isSlider = true;
          }
        },
        pageDots: false,
        prevNextButtons: false,
        watchCSS: true
      });
    });
  },

  //
  //
  //
  //
  _handleSwitch(evt) {
    evt.preventDefault();
    var {
      currentTarget: {
        dataset
      }
    } = evt;
    this.media && this.media.pauseActiveMedia();
    updateMedia.call(this, dataset.thumbnailId, true);
  },

  //
  //
  //
  //
  _storeView: updateRecentProducts,

  onBlockSelect(_ref2) {
    var {
      target
    } = _ref2;
    var label = n$2('.accordion__label', target);
    target.scrollIntoView({
      block: 'center',
      behavior: 'smooth'
    });
    if (!label) return;
    var {
      parentNode: group,
      nextElementSibling: content
    } = label;
    slideStop(content);
    slideDown(content);
    group.setAttribute('data-open', true);
    label.setAttribute('aria-expanded', true);
    content.setAttribute('aria-hidden', false);
  },

  onBlockDeselect(_ref3) {
    var {
      target
    } = _ref3;
    var label = n$2('.accordion__label', target);
    if (!label) return;
    var {
      parentNode: group,
      nextElementSibling: content
    } = label;
    slideStop(content);
    slideUp(content);
    group.setAttribute('data-open', false);
    label.setAttribute('aria-expanded', false);
    content.setAttribute('aria-hidden', true);
  }

});

document.addEventListener('DOMContentLoaded', () => {
  load('*');
});
focusHash();
bindInPageLinks(); // a11y tab handler

handleTab();

if (isMobile$1()) {
  document.documentElement.classList.add('is-mobile');
}

if (navigator.cookieEnabled) {
  document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
}

setTimeout(function () {
  document.body.classList.remove('preload');
}, 500);

if (document.body.classList.contains('template-index')) {
  HomeSectionModifiers(n$2('#main', document));
} // Product availabilty drawer


var availabilityDrawer = n$2('[data-store-availability-drawer]', document);
if (availabilityDrawer) storeAvailabilityDrawer(availabilityDrawer); // Setup modal

var modalElement = n$2('[data-modal]', document);
if (modalElement) modal(modalElement);

export { a, commonjsGlobal as c, getDefaultExportFromCjs as g, n$2 as n };
//# sourceMappingURL=theme-b714d6db.js.map
