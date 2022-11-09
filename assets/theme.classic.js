(function (factory) {
	typeof define === 'function' && define.amd ? define(factory) :
	factory();
})((function () { 'use strict';

	function _mergeNamespaces(n, m) {
		m.forEach(function (e) {
			e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
				if (k !== 'default' && !(k in n)) {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		});
		return Object.freeze(n);
	}

	var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

	function n$2(n,t){return void 0===t&&(t=document),t.querySelector(n)}function t$4(n,t){return void 0===t&&(t=document),[].slice.call(t.querySelectorAll(n))}function c$1(n,t){return Array.isArray(n)?n.forEach(t):t(n)}function r$3(n){return function(t,r,e){return c$1(t,function(t){return t[n+"EventListener"](r,e)})}}function e$3(n,t,c){return r$3("add")(n,t,c),function(){return r$3("remove")(n,t,c)}}function o$2(n){return function(t){var r=arguments;return c$1(t,function(t){var c;return (c=t.classList)[n].apply(c,[].slice.call(r,1))})}}function u$2(n){o$2("add").apply(void 0,[n].concat([].slice.call(arguments,1)));}function i$2(n){o$2("remove").apply(void 0,[n].concat([].slice.call(arguments,1)));}function l(n){o$2("toggle").apply(void 0,[n].concat([].slice.call(arguments,1)));}function a$1(n,t){return n.classList.contains(t)}

	var n$1=function(n){if("object"!=typeof(t=n)||Array.isArray(t))throw "state should be an object";var t;},t$3=function(n,t,e,c){return (r=n,r.reduce(function(n,t,e){return n.indexOf(t)>-1?n:n.concat(t)},[])).reduce(function(n,e){return n.concat(t[e]||[])},[]).map(function(n){return n(e,c)});var r;},e$2=a(),c=e$2.on,r$2=e$2.emit,o$1=e$2.hydrate,u$1=e$2.getState;function a(e){void 0===e&&(e={});var c={};return {getState:function(){return Object.assign({},e)},hydrate:function(r){return n$1(r),Object.assign(e,r),function(){var n=["*"].concat(Object.keys(r));t$3(n,c,e);}},on:function(n,t){return (n=[].concat(n)).map(function(n){return c[n]=(c[n]||[]).concat(t)}),function(){return n.map(function(n){return c[n].splice(c[n].indexOf(t),1)})}},emit:function(r,o,u){var a=("*"===r?[]:["*"]).concat(r);(o="function"==typeof o?o(e):o)&&(n$1(o),Object.assign(e,o),a=a.concat(Object.keys(o))),t$3(a,c,e,u);}}}

	function HomeSectionModifiers(node) {
	  // We only want to enable the transparent header in select
	  // situations on the homepage:
	  //   - First section is a slideshow
	  var handleTransparentCheck = firstSection => {
	    if (firstSection.classList.contains('slideshow') || firstSection.classList.contains('video-hero') || firstSection.classList.contains('full-width-image')) {
	      u$2(firstSection, 'transparent-section');
	    } else {
	      i$2(firstSection, 'transparent-section');
	    }
	  };

	  var handleHeaderBorder = firstSection => {
	    var header = document.getElementById('header');

	    if (firstSection.classList.contains('slideshow') || firstSection.classList.contains('video-hero') || firstSection.classList.contains('full-width-image')) {
	      u$2(header, 'header--no-border');
	    } else {
	      i$2(header, 'header--no-border');
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

	function t$2(){try{return localStorage.setItem("test","test"),localStorage.removeItem("test"),!0}catch(t){return !1}}function e$1(e){if(t$2())return JSON.parse(localStorage.getItem("neon_"+e))}function r$1(e,r){if(t$2())return localStorage.setItem("neon_"+e,r)}

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
	    i$2(node, classes$e.visible);
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
	    i$2(node, classes$d.active);
	    enableBodyScroll(modalInner);
	    setTimeout(() => {
	      i$2(node, classes$d.visible);
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
	  var labels = t$4('.accordion__label', node); // Make it accessible by keyboard

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
	    this.accordions = Accordions(t$4('.accordion', this.container));
	    focusFormStatus(this.container);
	    wrapIframes(t$4('iframe', this.container));
	    wrapTables(t$4('table', this.container));
	  },

	  onUnload() {
	    this.accordions.destroy();
	  }

	});

	var browser$1 = {exports: {}};

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
	}(browser$1, browser$1.exports));

	var Delegate = /*@__PURE__*/getDefaultExportFromCjs(browser$1.exports);

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
	  var inputs = t$4('input', container);
	  var minInput = inputs[0];
	  var maxInput = inputs[1];
	  var events = [e$3(inputs, 'change', onRangeChange), c('filters:range-removed', () => reset())];
	  var slider = n$2('[data-range-slider]', container);
	  Promise.resolve().then(function () { return nouislider$1; }).then(_ref => {
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
	        i$2(evt.target, classes$c.closed);
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
	  var swatches = t$4('[data-product-swatch]', group);
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
	  var swatchGroups = t$4(groupSelector, container);
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
	    i$2(counterContainer, classes$9.inventoryLow);

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
	  var unitPriceContainers = t$4(selectors$o.unitPriceContainer, container);
	  var unitPrices = t$4(selectors$o.unitPrice, container);
	  var unitPriceBases = t$4(selectors$o.unitPriceBase, container);
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
	      i$2(button, 'bttn--loading');
	    }).catch(() => {
	      i$2(quantityError, 'hidden');
	      i$2(button, 'bttn--loading');
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
	    i$2(first, 'hidden');
	    i$2(second, 'visible');
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
	  var forms = t$4('[data-filter-form]', container);
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
	    var targetInputs = t$4('[data-filter-item]', target);
	    targetInputs.forEach(targetInput => {
	      if (targetInput.type === 'checkbox' || targetInput.type === 'radio') {
	        var {
	          valueEscaped
	        } = targetInput.dataset;
	        var items = t$4("input[name='".concat(targetInput.name, "'][data-value-escaped='").concat(valueEscaped, "']"));
	        items.forEach(input => {
	          input.checked = targetInput.checked;
	        });
	      } else {
	        var _items = t$4("input[name='".concat(targetInput.name, "']"));

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
	    var inputs = t$4(selector, container);
	    inputs.forEach(input => {
	      input.checked = false;
	    });
	  }

	  function clearRangeInputs() {
	    var rangeInputs = t$4('[data-range-input]', container);
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
	  var flyouts = t$4(sel$1.flyouts, node);
	  var wash = n$2(sel$1.wash, node);
	  var focusTrap = null;
	  var range = null;
	  var rangeContainer = n$2(sel$1.priceRange, flyoutForm);

	  if (rangeContainer) {
	    range = priceRange(rangeContainer);
	  }

	  var events = [e$3(t$4(sel$1.filter, node), 'click', clickFlyoutTrigger), e$3(wash, 'click', clickWash), e$3(t$4(sel$1.button, node), 'click', clickButton), e$3(t$4(sel$1.close, node), 'click', clickWash), e$3(node, 'keydown', _ref => {
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
	    i$2([...flyouts, wash], selectors$n.active);
	    enableBodyScroll(node);
	  }

	  function clickButton(e) {
	    e.preventDefault();
	    var {
	      button
	    } = e.currentTarget.dataset;
	    var scope = e.currentTarget.closest(sel$1.flyouts);

	    if (button === 'clear') {
	      var inputs = t$4('[data-filter-item]', scope);
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

	    this.productTiles = t$4(selectors$m.productTile, this.container).map(tile => ProductTitle(tile));

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
	      var allViewLinks = t$4('[data-per-page]', this.container);
	      allViewLinks.forEach(link => {
	        i$2(link, 'active');
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

	      i$2(loading, 'is-active');
	      r$2('collection:updated');
	      this.productTiles = t$4(selectors$m.productTile, this.container).map(tile => ProductTitle(tile));
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
	      callback: () => this.productTiles = t$4(selectors$m.productTile, this.container).map(tile => ProductTitle(tile))
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
	    this.items = t$4(selectors$l.item, this.container);
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
	    return Array.from(t$4('[name="updates[]"]', this.container)).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
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
	          i$2(quantityError, classes$7.hide);
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
	    this.accordions = Accordions(t$4('.accordion', this.container));
	    wrapIframes(t$4('iframe', this.container));
	    wrapTables(t$4('table', this.container));
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
	      i$2(loading, classes$6.active);
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
	    var addresses = t$4(selectors$i.addressContainer, this.container);
	    var countryOptions = t$4('[data-country-option]', this.container) || [];
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
	    t$4(selectors$i.addressToggle, container).forEach(button => {
	      button.addEventListener('click', () => {
	        if (a$1(addressForm, hideClass)) {
	          i$2(addressForm, hideClass);
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
	      i$2(this.recoverPasswordForm, classes$5.hide);
	      u$2(this.loginForm, classes$5.hide);
	      this.recoverPasswordForm.setAttribute('aria-hidden', 'false');
	      this.loginForm.setAttribute('aria-hidden', 'true');
	    } else {
	      i$2(this.loginForm, classes$5.hide);
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


	    i$2(n$2(selectors$h.resetSuccessMessage, this.container), classes$5.hide);
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
	    var videos = t$4(selectors$g.video, this.container);
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
	  var navigationDots = t$4(selectors$f.dots, container);
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
	    navigationDots.forEach(dot => i$2(dot, activeClass));
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
	    var slides = t$4('.featured-collection__item ', this.container);
	    var dotNavigation = null;
	    this.productTiles = t$4(selectors$e.productTile, this.container).map(tile => ProductTitle(tile));
	    Promise.resolve().then(function () { return index; }).then(_ref => {
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
	      var maps = t$4(selectors$d.mapContainer, document);
	      var mapImages = t$4(selectors$d.image, document);
	      maps.forEach(map => {
	        u$2(map, classes$4.hidden);
	      });
	      mapImages.forEach(img => {
	        i$2(img, classes$4.hidden);
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
	    var images = t$4('.responsive-image__image', this.container);
	    var dotNavigation = null;
	    i$2(this.container, 'hidden');
	    Promise.resolve().then(function () { return index; }).then(_ref => {
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
	            l(sliderEl, 'is-single', t$4('.slideshow__slide', sliderEl).length <= 1);
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
	      Promise.resolve().then(function () { return simpleParallax_min$1; }).then(_ref2 => {
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
	    Promise.resolve().then(function () { return index; }).then(_ref => {
	      var {
	        default: Flickity
	      } = _ref;
	      this.pagination = t$4('[data-pagination]', this.container);
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
	            i$2(n$2('.quotes__icon', el), 'active');
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
	    Promise.resolve().then(function () { return fluorescentVideo_es$1; }).then(_ref => {
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
	        i$2(overlay, 'visible');
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
	    var images = t$4('.responsive-image__image', this.container);
	    if (!images.length || !enableParallax) return;
	    Promise.resolve().then(function () { return simpleParallax_min$1; }).then(_ref => {
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
	    var videos = t$4(selectors$b.video, this.container);
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
	    this.announcements = t$4(selectors$a.announcements, this.container);
	    var {
	      timing
	    } = this.container.dataset;
	    slideshowOpts.autoPlay = parseInt(timing);

	    this._init();

	    this._setRootVar(rootVars.announcementBar, this.announcements.length ? this.container.offsetHeight : 0);
	  },

	  _init() {
	    if (this.announcements.length > 1) {
	      Promise.resolve().then(function () { return index; }).then(_ref => {
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
	  var disclosureOptions = t$4(selectors$9.disclosureOptions, node);
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
	    i$2(disclosureList, classes$3.listVisible);
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
	    var cbSelectors = t$4(selectors$8.disclosure, this.container);

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
	  var parents = t$4('[data-parent]', node);
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
	  }), e$3(t$4('.header__nav > li > a', node), 'focus', e => {
	    if (!userIsUsingKeyboard()) return;
	    closeAll();
	  }), e$3(t$4('[data-link]', node), 'focus', e => {
	    e.preventDefault();
	    if (!userIsUsingKeyboard()) return;
	    var link = e.currentTarget;

	    if (link.hasAttribute('data-parent')) {
	      toggleMenu(link.parentNode);
	    }

	    var siblings = t$4('[data-link]', link.parentNode.parentNode);
	    siblings.forEach(el => l(t$4('[data-submenu]', el.parentNode), 'visible', el === link));
	  }), // Close everything when focus leaves the main menu
	  e$3(t$4('[data-link]', node), 'focusout', e => {
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
	      i$2(menu, 'visible');
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
	    var subMenus = t$4('[data-submenu]', target);
	    var parentTriggers = t$4('[data-parent]', target);
	    i$2(subMenus, 'visible');
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
	    i$2(node, classNames.active);
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
	      i$2(node, classNames.activeQuery, classNames.activeSuggestions);
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
	    i$2(tabLinkQuickShop, 'active');
	    i$2(tabLinkRecent, 'active');
	    renderQuickCart(cart);
	    renderFooter();
	  };

	  var renderQuickCart = cart => {
	    var url = "".concat(theme.routes.cart.base, "?section_id=quick-cart");
	    makeRequest('GET', url).then(response => {
	      itemsRoot.innerHTML = '';
	      var container = document.createElement('div');
	      container.innerHTML = response;
	      var cartItems = t$4('[data-cart-item]', container);

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
	          i$2(firstProduct, 'cart__item--highlight');
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
	    i$2(node, 'is-visible', 'has-quick-shop-product');
	    i$2(tabLinkQuickShop, 'active');
	    i$2(tabLinkRecent, 'active');
	    i$2(tabLinkCart, 'active');
	    setTimeout(() => {
	      i$2(node, 'is-active');
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
	    i$2(tabLinkRecent, 'active');
	    i$2(tabLinkQuickShop, 'active');
	    render(u$1().cart);
	  };

	  var viewRecent = products => {
	    i$2(tabLinkCart, 'active');
	    i$2(tabLinkQuickShop, 'active');
	    u$2(tabLinkRecent, 'active');
	    i$2(footer, 'active');
	    itemsRoot.innerHTML = renderRecent(products);
	  };

	  var viewQuickAdd = () => {
	    u$2(tabLinkQuickShop, 'active');
	    i$2(tabLinkCart, 'active');
	    i$2(tabLinkRecent, 'active');
	    i$2(footer, 'active');
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
	    i$2(node, 'has-quick-shop-product'); // Rerender the cart list only if cart is open

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

	var n,e,i$1,o,t$1,r,f,d$1,p,u=[];function w(n,a){return e=window.pageXOffset,o=window.pageYOffset,r=window.innerHeight,d$1=window.innerWidth,void 0===i$1&&(i$1=e),void 0===t$1&&(t$1=o),void 0===p&&(p=d$1),void 0===f&&(f=r),(a||o!==t$1||e!==i$1||r!==f||d$1!==p)&&(!function(n){for(var w=0;w<u.length;w++)u[w]({x:e,y:o,px:i$1,py:t$1,vh:r,pvh:f,vw:d$1,pvw:p},n);}(n),i$1=e,t$1=o,f=r,p=d$1),requestAnimationFrame(w)}function srraf(e){return u.indexOf(e)<0&&u.push(e),n=n||w(performance.now()),{update:function(){return w(performance.now(),!0),this},destroy:function(){u.splice(u.indexOf(e),1);}}}

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
	    i$2([resultsContainer, clearButton, searchButton], 'visible');
	    i$2(input, 'active');
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
	  var parents = t$4('[data-item="parent"]', node);
	  var parentBack = t$4('[data-item="back"]', node);
	  var languages = t$4('[data-item="locale"]', node);
	  var currencies = t$4('[data-item="currency"]', node);
	  var closeButtons = t$4('[data-drawer-close]', node);
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
	    i$2(node, classes$2.visible);
	    setTimeout(() => {
	      i$2(node, classes$2.active);
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
	    i$2(menu, classes$2.visible);
	    i$2(parentLink.parentNode, classes$2.childVisible);
	    navigate(linksDepth -= 1);
	    parentLink.setAttribute('aria-expanded', false);
	    menu.setAttribute('aria-hidden', true);
	    main.style.height = formatHeight(menuBefore.offsetHeight);

	    if (menu.hasAttribute('data-search-menu')) {
	      search.clear();
	      i$2(node, 'search-active');
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
	    var cartToggles = t$4(selectors$4.jsCartToggle, this.container);
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
	        var productTiles = t$4(config.productTile, recommendationsSection);

	        if (sliderContainer) {
	          Promise.resolve().then(function () { return index; }).then(_ref => {
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
	      Promise.resolve().then(function () { return index; }).then(_ref => {
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
	        this.productTiles = t$4(selectors$3.productTile, this.container).map(tile => ProductTitle(tile));
	        t$4('.recently-viewed__product', this.container).forEach(item => {
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
	    i$2(this.container, classes$1.visible);
	    setTimeout(() => {
	      i$2(this.container, classes$1.active);
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
	  var elements = t$4('[data-interactive]', node);
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
	      i$2(activeMedia.container, 'model-active');
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
	  var navItems = t$4(selectors$1.navItem, node);
	  var wrapper = n$2(selectors$1.wrapper, node);
	  var images = t$4(selectors$1.slide, node);
	  var previousButton = n$2(selectors$1.prevButton, node);
	  var nextButton = n$2(selectors$1.nextButton, node);
	  var sliderContainer = n$2(selectors$1.slider, node);
	  var events, slider;
	  Promise.resolve().then(function () { return index; }).then(_ref => {
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
	        navItems.forEach(item => i$2(item, classes.active));
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
	      i$2(image, classes.zoom);
	      image.style.transform = "translate3d(0px, 0px, 0) scale(1)";
	      return;
	    }

	    images.forEach(image => {
	      i$2(image, classes.zoom);
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

	    i$2(node, classes.visible);
	    setTimeout(() => {
	      i$2(node, classes.active);
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
	    var accordions = t$4('.accordion', this.container);

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
	      wrapIframes(t$4('iframe', productDescriptionWrapper));
	      wrapTables(t$4('table', productDescriptionWrapper));
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
	    var buttons = t$4(selector.addButton, document);
	    buttons.forEach(el => u$2(el, 'bttn--loading'));
	    u$2(this.quantityError, 'hidden');
	    cart.addItem(this.formElement).then(() => {
	      r$2('cart:toggle', state => {
	        return {
	          cartOpen: !state.cartOpen
	        };
	      });
	      buttons.forEach(el => i$2(el, 'bttn--loading'));
	    }).catch(() => {
	      i$2(this.quantityError, 'hidden');
	      buttons.forEach(el => i$2(el, 'bttn--loading'));
	    });
	  },

	  //
	  //
	  //
	  //
	  _initImageSwitching() {
	    this.events.push(e$3(t$4(selector.thumb, this.container), 'click', this._handleSwitch));
	  },

	  //
	  //
	  //
	  //
	  _initLightbox() {
	    this.images = t$4('.product__image', this.container);
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
	    Promise.resolve().then(function () { return index; }).then(_ref => {
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

	var nouislider$2 = {exports: {}};

	(function (module, exports) {
	(function (global, factory) {
	    factory(exports) ;
	}(commonjsGlobal$1, (function (exports) {
	    exports.PipsMode = void 0;
	    (function (PipsMode) {
	        PipsMode["Range"] = "range";
	        PipsMode["Steps"] = "steps";
	        PipsMode["Positions"] = "positions";
	        PipsMode["Count"] = "count";
	        PipsMode["Values"] = "values";
	    })(exports.PipsMode || (exports.PipsMode = {}));
	    exports.PipsType = void 0;
	    (function (PipsType) {
	        PipsType[PipsType["None"] = -1] = "None";
	        PipsType[PipsType["NoValue"] = 0] = "NoValue";
	        PipsType[PipsType["LargeValue"] = 1] = "LargeValue";
	        PipsType[PipsType["SmallValue"] = 2] = "SmallValue";
	    })(exports.PipsType || (exports.PipsType = {}));
	    //region Helper Methods
	    function isValidFormatter(entry) {
	        return isValidPartialFormatter(entry) && typeof entry.from === "function";
	    }
	    function isValidPartialFormatter(entry) {
	        // partial formatters only need a to function and not a from function
	        return typeof entry === "object" && typeof entry.to === "function";
	    }
	    function removeElement(el) {
	        el.parentElement.removeChild(el);
	    }
	    function isSet(value) {
	        return value !== null && value !== undefined;
	    }
	    // Bindable version
	    function preventDefault(e) {
	        e.preventDefault();
	    }
	    // Removes duplicates from an array.
	    function unique(array) {
	        return array.filter(function (a) {
	            return !this[a] ? (this[a] = true) : false;
	        }, {});
	    }
	    // Round a value to the closest 'to'.
	    function closest(value, to) {
	        return Math.round(value / to) * to;
	    }
	    // Current position of an element relative to the document.
	    function offset(elem, orientation) {
	        var rect = elem.getBoundingClientRect();
	        var doc = elem.ownerDocument;
	        var docElem = doc.documentElement;
	        var pageOffset = getPageOffset(doc);
	        // getBoundingClientRect contains left scroll in Chrome on Android.
	        // I haven't found a feature detection that proves this. Worst case
	        // scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
	        if (/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)) {
	            pageOffset.x = 0;
	        }
	        return orientation ? rect.top + pageOffset.y - docElem.clientTop : rect.left + pageOffset.x - docElem.clientLeft;
	    }
	    // Checks whether a value is numerical.
	    function isNumeric(a) {
	        return typeof a === "number" && !isNaN(a) && isFinite(a);
	    }
	    // Sets a class and removes it after [duration] ms.
	    function addClassFor(element, className, duration) {
	        if (duration > 0) {
	            addClass(element, className);
	            setTimeout(function () {
	                removeClass(element, className);
	            }, duration);
	        }
	    }
	    // Limits a value to 0 - 100
	    function limit(a) {
	        return Math.max(Math.min(a, 100), 0);
	    }
	    // Wraps a variable as an array, if it isn't one yet.
	    // Note that an input array is returned by reference!
	    function asArray(a) {
	        return Array.isArray(a) ? a : [a];
	    }
	    // Counts decimals
	    function countDecimals(numStr) {
	        numStr = String(numStr);
	        var pieces = numStr.split(".");
	        return pieces.length > 1 ? pieces[1].length : 0;
	    }
	    // http://youmightnotneedjquery.com/#add_class
	    function addClass(el, className) {
	        if (el.classList && !/\s/.test(className)) {
	            el.classList.add(className);
	        }
	        else {
	            el.className += " " + className;
	        }
	    }
	    // http://youmightnotneedjquery.com/#remove_class
	    function removeClass(el, className) {
	        if (el.classList && !/\s/.test(className)) {
	            el.classList.remove(className);
	        }
	        else {
	            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
	        }
	    }
	    // https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
	    function hasClass(el, className) {
	        return el.classList ? el.classList.contains(className) : new RegExp("\\b" + className + "\\b").test(el.className);
	    }
	    // https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
	    function getPageOffset(doc) {
	        var supportPageOffset = window.pageXOffset !== undefined;
	        var isCSS1Compat = (doc.compatMode || "") === "CSS1Compat";
	        var x = supportPageOffset
	            ? window.pageXOffset
	            : isCSS1Compat
	                ? doc.documentElement.scrollLeft
	                : doc.body.scrollLeft;
	        var y = supportPageOffset
	            ? window.pageYOffset
	            : isCSS1Compat
	                ? doc.documentElement.scrollTop
	                : doc.body.scrollTop;
	        return {
	            x: x,
	            y: y
	        };
	    }
	    // we provide a function to compute constants instead
	    // of accessing window.* as soon as the module needs it
	    // so that we do not compute anything if not needed
	    function getActions() {
	        // Determine the events to bind. IE11 implements pointerEvents without
	        // a prefix, which breaks compatibility with the IE10 implementation.
	        return window.navigator.pointerEnabled
	            ? {
	                start: "pointerdown",
	                move: "pointermove",
	                end: "pointerup"
	            }
	            : window.navigator.msPointerEnabled
	                ? {
	                    start: "MSPointerDown",
	                    move: "MSPointerMove",
	                    end: "MSPointerUp"
	                }
	                : {
	                    start: "mousedown touchstart",
	                    move: "mousemove touchmove",
	                    end: "mouseup touchend"
	                };
	    }
	    // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	    // Issue #785
	    function getSupportsPassive() {
	        var supportsPassive = false;
	        /* eslint-disable */
	        try {
	            var opts = Object.defineProperty({}, "passive", {
	                get: function () {
	                    supportsPassive = true;
	                }
	            });
	            // @ts-ignore
	            window.addEventListener("test", null, opts);
	        }
	        catch (e) { }
	        /* eslint-enable */
	        return supportsPassive;
	    }
	    function getSupportsTouchActionNone() {
	        return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
	    }
	    //endregion
	    //region Range Calculation
	    // Determine the size of a sub-range in relation to a full range.
	    function subRangeRatio(pa, pb) {
	        return 100 / (pb - pa);
	    }
	    // (percentage) How many percent is this value of this range?
	    function fromPercentage(range, value, startRange) {
	        return (value * 100) / (range[startRange + 1] - range[startRange]);
	    }
	    // (percentage) Where is this value on this range?
	    function toPercentage(range, value) {
	        return fromPercentage(range, range[0] < 0 ? value + Math.abs(range[0]) : value - range[0], 0);
	    }
	    // (value) How much is this percentage on this range?
	    function isPercentage(range, value) {
	        return (value * (range[1] - range[0])) / 100 + range[0];
	    }
	    function getJ(value, arr) {
	        var j = 1;
	        while (value >= arr[j]) {
	            j += 1;
	        }
	        return j;
	    }
	    // (percentage) Input a value, find where, on a scale of 0-100, it applies.
	    function toStepping(xVal, xPct, value) {
	        if (value >= xVal.slice(-1)[0]) {
	            return 100;
	        }
	        var j = getJ(value, xVal);
	        var va = xVal[j - 1];
	        var vb = xVal[j];
	        var pa = xPct[j - 1];
	        var pb = xPct[j];
	        return pa + toPercentage([va, vb], value) / subRangeRatio(pa, pb);
	    }
	    // (value) Input a percentage, find where it is on the specified range.
	    function fromStepping(xVal, xPct, value) {
	        // There is no range group that fits 100
	        if (value >= 100) {
	            return xVal.slice(-1)[0];
	        }
	        var j = getJ(value, xPct);
	        var va = xVal[j - 1];
	        var vb = xVal[j];
	        var pa = xPct[j - 1];
	        var pb = xPct[j];
	        return isPercentage([va, vb], (value - pa) * subRangeRatio(pa, pb));
	    }
	    // (percentage) Get the step that applies at a certain value.
	    function getStep(xPct, xSteps, snap, value) {
	        if (value === 100) {
	            return value;
	        }
	        var j = getJ(value, xPct);
	        var a = xPct[j - 1];
	        var b = xPct[j];
	        // If 'snap' is set, steps are used as fixed points on the slider.
	        if (snap) {
	            // Find the closest position, a or b.
	            if (value - a > (b - a) / 2) {
	                return b;
	            }
	            return a;
	        }
	        if (!xSteps[j - 1]) {
	            return value;
	        }
	        return xPct[j - 1] + closest(value - xPct[j - 1], xSteps[j - 1]);
	    }
	    //endregion
	    //region Spectrum
	    var Spectrum = /** @class */ (function () {
	        function Spectrum(entry, snap, singleStep) {
	            this.xPct = [];
	            this.xVal = [];
	            this.xSteps = [];
	            this.xNumSteps = [];
	            this.xHighestCompleteStep = [];
	            this.xSteps = [singleStep || false];
	            this.xNumSteps = [false];
	            this.snap = snap;
	            var index;
	            var ordered = [];
	            // Map the object keys to an array.
	            Object.keys(entry).forEach(function (index) {
	                ordered.push([asArray(entry[index]), index]);
	            });
	            // Sort all entries by value (numeric sort).
	            ordered.sort(function (a, b) {
	                return a[0][0] - b[0][0];
	            });
	            // Convert all entries to subranges.
	            for (index = 0; index < ordered.length; index++) {
	                this.handleEntryPoint(ordered[index][1], ordered[index][0]);
	            }
	            // Store the actual step values.
	            // xSteps is sorted in the same order as xPct and xVal.
	            this.xNumSteps = this.xSteps.slice(0);
	            // Convert all numeric steps to the percentage of the subrange they represent.
	            for (index = 0; index < this.xNumSteps.length; index++) {
	                this.handleStepPoint(index, this.xNumSteps[index]);
	            }
	        }
	        Spectrum.prototype.getDistance = function (value) {
	            var distances = [];
	            for (var index = 0; index < this.xNumSteps.length - 1; index++) {
	                distances[index] = fromPercentage(this.xVal, value, index);
	            }
	            return distances;
	        };
	        // Calculate the percentual distance over the whole scale of ranges.
	        // direction: 0 = backwards / 1 = forwards
	        Spectrum.prototype.getAbsoluteDistance = function (value, distances, direction) {
	            var xPct_index = 0;
	            // Calculate range where to start calculation
	            if (value < this.xPct[this.xPct.length - 1]) {
	                while (value > this.xPct[xPct_index + 1]) {
	                    xPct_index++;
	                }
	            }
	            else if (value === this.xPct[this.xPct.length - 1]) {
	                xPct_index = this.xPct.length - 2;
	            }
	            // If looking backwards and the value is exactly at a range separator then look one range further
	            if (!direction && value === this.xPct[xPct_index + 1]) {
	                xPct_index++;
	            }
	            if (distances === null) {
	                distances = [];
	            }
	            var start_factor;
	            var rest_factor = 1;
	            var rest_rel_distance = distances[xPct_index];
	            var range_pct = 0;
	            var rel_range_distance = 0;
	            var abs_distance_counter = 0;
	            var range_counter = 0;
	            // Calculate what part of the start range the value is
	            if (direction) {
	                start_factor = (value - this.xPct[xPct_index]) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
	            }
	            else {
	                start_factor = (this.xPct[xPct_index + 1] - value) / (this.xPct[xPct_index + 1] - this.xPct[xPct_index]);
	            }
	            // Do until the complete distance across ranges is calculated
	            while (rest_rel_distance > 0) {
	                // Calculate the percentage of total range
	                range_pct = this.xPct[xPct_index + 1 + range_counter] - this.xPct[xPct_index + range_counter];
	                // Detect if the margin, padding or limit is larger then the current range and calculate
	                if (distances[xPct_index + range_counter] * rest_factor + 100 - start_factor * 100 > 100) {
	                    // If larger then take the percentual distance of the whole range
	                    rel_range_distance = range_pct * start_factor;
	                    // Rest factor of relative percentual distance still to be calculated
	                    rest_factor = (rest_rel_distance - 100 * start_factor) / distances[xPct_index + range_counter];
	                    // Set start factor to 1 as for next range it does not apply.
	                    start_factor = 1;
	                }
	                else {
	                    // If smaller or equal then take the percentual distance of the calculate percentual part of that range
	                    rel_range_distance = ((distances[xPct_index + range_counter] * range_pct) / 100) * rest_factor;
	                    // No rest left as the rest fits in current range
	                    rest_factor = 0;
	                }
	                if (direction) {
	                    abs_distance_counter = abs_distance_counter - rel_range_distance;
	                    // Limit range to first range when distance becomes outside of minimum range
	                    if (this.xPct.length + range_counter >= 1) {
	                        range_counter--;
	                    }
	                }
	                else {
	                    abs_distance_counter = abs_distance_counter + rel_range_distance;
	                    // Limit range to last range when distance becomes outside of maximum range
	                    if (this.xPct.length - range_counter >= 1) {
	                        range_counter++;
	                    }
	                }
	                // Rest of relative percentual distance still to be calculated
	                rest_rel_distance = distances[xPct_index + range_counter] * rest_factor;
	            }
	            return value + abs_distance_counter;
	        };
	        Spectrum.prototype.toStepping = function (value) {
	            value = toStepping(this.xVal, this.xPct, value);
	            return value;
	        };
	        Spectrum.prototype.fromStepping = function (value) {
	            return fromStepping(this.xVal, this.xPct, value);
	        };
	        Spectrum.prototype.getStep = function (value) {
	            value = getStep(this.xPct, this.xSteps, this.snap, value);
	            return value;
	        };
	        Spectrum.prototype.getDefaultStep = function (value, isDown, size) {
	            var j = getJ(value, this.xPct);
	            // When at the top or stepping down, look at the previous sub-range
	            if (value === 100 || (isDown && value === this.xPct[j - 1])) {
	                j = Math.max(j - 1, 1);
	            }
	            return (this.xVal[j] - this.xVal[j - 1]) / size;
	        };
	        Spectrum.prototype.getNearbySteps = function (value) {
	            var j = getJ(value, this.xPct);
	            return {
	                stepBefore: {
	                    startValue: this.xVal[j - 2],
	                    step: this.xNumSteps[j - 2],
	                    highestStep: this.xHighestCompleteStep[j - 2]
	                },
	                thisStep: {
	                    startValue: this.xVal[j - 1],
	                    step: this.xNumSteps[j - 1],
	                    highestStep: this.xHighestCompleteStep[j - 1]
	                },
	                stepAfter: {
	                    startValue: this.xVal[j],
	                    step: this.xNumSteps[j],
	                    highestStep: this.xHighestCompleteStep[j]
	                }
	            };
	        };
	        Spectrum.prototype.countStepDecimals = function () {
	            var stepDecimals = this.xNumSteps.map(countDecimals);
	            return Math.max.apply(null, stepDecimals);
	        };
	        Spectrum.prototype.hasNoSize = function () {
	            return this.xVal[0] === this.xVal[this.xVal.length - 1];
	        };
	        // Outside testing
	        Spectrum.prototype.convert = function (value) {
	            return this.getStep(this.toStepping(value));
	        };
	        Spectrum.prototype.handleEntryPoint = function (index, value) {
	            var percentage;
	            // Covert min/max syntax to 0 and 100.
	            if (index === "min") {
	                percentage = 0;
	            }
	            else if (index === "max") {
	                percentage = 100;
	            }
	            else {
	                percentage = parseFloat(index);
	            }
	            // Check for correct input.
	            if (!isNumeric(percentage) || !isNumeric(value[0])) {
	                throw new Error("noUiSlider: 'range' value isn't numeric.");
	            }
	            // Store values.
	            this.xPct.push(percentage);
	            this.xVal.push(value[0]);
	            var value1 = Number(value[1]);
	            // NaN will evaluate to false too, but to keep
	            // logging clear, set step explicitly. Make sure
	            // not to override the 'step' setting with false.
	            if (!percentage) {
	                if (!isNaN(value1)) {
	                    this.xSteps[0] = value1;
	                }
	            }
	            else {
	                this.xSteps.push(isNaN(value1) ? false : value1);
	            }
	            this.xHighestCompleteStep.push(0);
	        };
	        Spectrum.prototype.handleStepPoint = function (i, n) {
	            // Ignore 'false' stepping.
	            if (!n) {
	                return;
	            }
	            // Step over zero-length ranges (#948);
	            if (this.xVal[i] === this.xVal[i + 1]) {
	                this.xSteps[i] = this.xHighestCompleteStep[i] = this.xVal[i];
	                return;
	            }
	            // Factor to range ratio
	            this.xSteps[i] =
	                fromPercentage([this.xVal[i], this.xVal[i + 1]], n, 0) / subRangeRatio(this.xPct[i], this.xPct[i + 1]);
	            var totalSteps = (this.xVal[i + 1] - this.xVal[i]) / this.xNumSteps[i];
	            var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
	            var step = this.xVal[i] + this.xNumSteps[i] * highestStep;
	            this.xHighestCompleteStep[i] = step;
	        };
	        return Spectrum;
	    }());
	    //endregion
	    //region Options
	    /*	Every input option is tested and parsed. This will prevent
	        endless validation in internal methods. These tests are
	        structured with an item for every option available. An
	        option can be marked as required by setting the 'r' flag.
	        The testing function is provided with three arguments:
	            - The provided value for the option;
	            - A reference to the options object;
	            - The name for the option;

	        The testing function returns false when an error is detected,
	        or true when everything is OK. It can also modify the option
	        object, to make sure all values can be correctly looped elsewhere. */
	    //region Defaults
	    var defaultFormatter = {
	        to: function (value) {
	            return value === undefined ? "" : value.toFixed(2);
	        },
	        from: Number
	    };
	    var cssClasses = {
	        target: "target",
	        base: "base",
	        origin: "origin",
	        handle: "handle",
	        handleLower: "handle-lower",
	        handleUpper: "handle-upper",
	        touchArea: "touch-area",
	        horizontal: "horizontal",
	        vertical: "vertical",
	        background: "background",
	        connect: "connect",
	        connects: "connects",
	        ltr: "ltr",
	        rtl: "rtl",
	        textDirectionLtr: "txt-dir-ltr",
	        textDirectionRtl: "txt-dir-rtl",
	        draggable: "draggable",
	        drag: "state-drag",
	        tap: "state-tap",
	        active: "active",
	        tooltip: "tooltip",
	        pips: "pips",
	        pipsHorizontal: "pips-horizontal",
	        pipsVertical: "pips-vertical",
	        marker: "marker",
	        markerHorizontal: "marker-horizontal",
	        markerVertical: "marker-vertical",
	        markerNormal: "marker-normal",
	        markerLarge: "marker-large",
	        markerSub: "marker-sub",
	        value: "value",
	        valueHorizontal: "value-horizontal",
	        valueVertical: "value-vertical",
	        valueNormal: "value-normal",
	        valueLarge: "value-large",
	        valueSub: "value-sub"
	    };
	    // Namespaces of internal event listeners
	    var INTERNAL_EVENT_NS = {
	        tooltips: ".__tooltips",
	        aria: ".__aria"
	    };
	    //endregion
	    function testStep(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'step' is not numeric.");
	        }
	        // The step option can still be used to set stepping
	        // for linear sliders. Overwritten if set in 'range'.
	        parsed.singleStep = entry;
	    }
	    function testKeyboardPageMultiplier(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
	        }
	        parsed.keyboardPageMultiplier = entry;
	    }
	    function testKeyboardMultiplier(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
	        }
	        parsed.keyboardMultiplier = entry;
	    }
	    function testKeyboardDefaultStep(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
	        }
	        parsed.keyboardDefaultStep = entry;
	    }
	    function testRange(parsed, entry) {
	        // Filter incorrect input.
	        if (typeof entry !== "object" || Array.isArray(entry)) {
	            throw new Error("noUiSlider: 'range' is not an object.");
	        }
	        // Catch missing start or end.
	        if (entry.min === undefined || entry.max === undefined) {
	            throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
	        }
	        parsed.spectrum = new Spectrum(entry, parsed.snap || false, parsed.singleStep);
	    }
	    function testStart(parsed, entry) {
	        entry = asArray(entry);
	        // Validate input. Values aren't tested, as the public .val method
	        // will always provide a valid location.
	        if (!Array.isArray(entry) || !entry.length) {
	            throw new Error("noUiSlider: 'start' option is incorrect.");
	        }
	        // Store the number of handles.
	        parsed.handles = entry.length;
	        // When the slider is initialized, the .val method will
	        // be called with the start options.
	        parsed.start = entry;
	    }
	    function testSnap(parsed, entry) {
	        if (typeof entry !== "boolean") {
	            throw new Error("noUiSlider: 'snap' option must be a boolean.");
	        }
	        // Enforce 100% stepping within subranges.
	        parsed.snap = entry;
	    }
	    function testAnimate(parsed, entry) {
	        if (typeof entry !== "boolean") {
	            throw new Error("noUiSlider: 'animate' option must be a boolean.");
	        }
	        // Enforce 100% stepping within subranges.
	        parsed.animate = entry;
	    }
	    function testAnimationDuration(parsed, entry) {
	        if (typeof entry !== "number") {
	            throw new Error("noUiSlider: 'animationDuration' option must be a number.");
	        }
	        parsed.animationDuration = entry;
	    }
	    function testConnect(parsed, entry) {
	        var connect = [false];
	        var i;
	        // Map legacy options
	        if (entry === "lower") {
	            entry = [true, false];
	        }
	        else if (entry === "upper") {
	            entry = [false, true];
	        }
	        // Handle boolean options
	        if (entry === true || entry === false) {
	            for (i = 1; i < parsed.handles; i++) {
	                connect.push(entry);
	            }
	            connect.push(false);
	        }
	        // Reject invalid input
	        else if (!Array.isArray(entry) || !entry.length || entry.length !== parsed.handles + 1) {
	            throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
	        }
	        else {
	            connect = entry;
	        }
	        parsed.connect = connect;
	    }
	    function testOrientation(parsed, entry) {
	        // Set orientation to an a numerical value for easy
	        // array selection.
	        switch (entry) {
	            case "horizontal":
	                parsed.ort = 0;
	                break;
	            case "vertical":
	                parsed.ort = 1;
	                break;
	            default:
	                throw new Error("noUiSlider: 'orientation' option is invalid.");
	        }
	    }
	    function testMargin(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'margin' option must be numeric.");
	        }
	        // Issue #582
	        if (entry === 0) {
	            return;
	        }
	        parsed.margin = parsed.spectrum.getDistance(entry);
	    }
	    function testLimit(parsed, entry) {
	        if (!isNumeric(entry)) {
	            throw new Error("noUiSlider: 'limit' option must be numeric.");
	        }
	        parsed.limit = parsed.spectrum.getDistance(entry);
	        if (!parsed.limit || parsed.handles < 2) {
	            throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
	        }
	    }
	    function testPadding(parsed, entry) {
	        var index;
	        if (!isNumeric(entry) && !Array.isArray(entry)) {
	            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
	        }
	        if (Array.isArray(entry) && !(entry.length === 2 || isNumeric(entry[0]) || isNumeric(entry[1]))) {
	            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
	        }
	        if (entry === 0) {
	            return;
	        }
	        if (!Array.isArray(entry)) {
	            entry = [entry, entry];
	        }
	        // 'getDistance' returns false for invalid values.
	        parsed.padding = [parsed.spectrum.getDistance(entry[0]), parsed.spectrum.getDistance(entry[1])];
	        for (index = 0; index < parsed.spectrum.xNumSteps.length - 1; index++) {
	            // last "range" can't contain step size as it is purely an endpoint.
	            if (parsed.padding[0][index] < 0 || parsed.padding[1][index] < 0) {
	                throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
	            }
	        }
	        var totalPadding = entry[0] + entry[1];
	        var firstValue = parsed.spectrum.xVal[0];
	        var lastValue = parsed.spectrum.xVal[parsed.spectrum.xVal.length - 1];
	        if (totalPadding / (lastValue - firstValue) > 1) {
	            throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
	        }
	    }
	    function testDirection(parsed, entry) {
	        // Set direction as a numerical value for easy parsing.
	        // Invert connection for RTL sliders, so that the proper
	        // handles get the connect/background classes.
	        switch (entry) {
	            case "ltr":
	                parsed.dir = 0;
	                break;
	            case "rtl":
	                parsed.dir = 1;
	                break;
	            default:
	                throw new Error("noUiSlider: 'direction' option was not recognized.");
	        }
	    }
	    function testBehaviour(parsed, entry) {
	        // Make sure the input is a string.
	        if (typeof entry !== "string") {
	            throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
	        }
	        // Check if the string contains any keywords.
	        // None are required.
	        var tap = entry.indexOf("tap") >= 0;
	        var drag = entry.indexOf("drag") >= 0;
	        var fixed = entry.indexOf("fixed") >= 0;
	        var snap = entry.indexOf("snap") >= 0;
	        var hover = entry.indexOf("hover") >= 0;
	        var unconstrained = entry.indexOf("unconstrained") >= 0;
	        var dragAll = entry.indexOf("drag-all") >= 0;
	        if (fixed) {
	            if (parsed.handles !== 2) {
	                throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
	            }
	            // Use margin to enforce fixed state
	            testMargin(parsed, parsed.start[1] - parsed.start[0]);
	        }
	        if (unconstrained && (parsed.margin || parsed.limit)) {
	            throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
	        }
	        parsed.events = {
	            tap: tap || snap,
	            drag: drag,
	            dragAll: dragAll,
	            fixed: fixed,
	            snap: snap,
	            hover: hover,
	            unconstrained: unconstrained
	        };
	    }
	    function testTooltips(parsed, entry) {
	        if (entry === false) {
	            return;
	        }
	        if (entry === true || isValidPartialFormatter(entry)) {
	            parsed.tooltips = [];
	            for (var i = 0; i < parsed.handles; i++) {
	                parsed.tooltips.push(entry);
	            }
	        }
	        else {
	            entry = asArray(entry);
	            if (entry.length !== parsed.handles) {
	                throw new Error("noUiSlider: must pass a formatter for all handles.");
	            }
	            entry.forEach(function (formatter) {
	                if (typeof formatter !== "boolean" && !isValidPartialFormatter(formatter)) {
	                    throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
	                }
	            });
	            parsed.tooltips = entry;
	        }
	    }
	    function testHandleAttributes(parsed, entry) {
	        if (entry.length !== parsed.handles) {
	            throw new Error("noUiSlider: must pass a attributes for all handles.");
	        }
	        parsed.handleAttributes = entry;
	    }
	    function testAriaFormat(parsed, entry) {
	        if (!isValidPartialFormatter(entry)) {
	            throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
	        }
	        parsed.ariaFormat = entry;
	    }
	    function testFormat(parsed, entry) {
	        if (!isValidFormatter(entry)) {
	            throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
	        }
	        parsed.format = entry;
	    }
	    function testKeyboardSupport(parsed, entry) {
	        if (typeof entry !== "boolean") {
	            throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
	        }
	        parsed.keyboardSupport = entry;
	    }
	    function testDocumentElement(parsed, entry) {
	        // This is an advanced option. Passed values are used without validation.
	        parsed.documentElement = entry;
	    }
	    function testCssPrefix(parsed, entry) {
	        if (typeof entry !== "string" && entry !== false) {
	            throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
	        }
	        parsed.cssPrefix = entry;
	    }
	    function testCssClasses(parsed, entry) {
	        if (typeof entry !== "object") {
	            throw new Error("noUiSlider: 'cssClasses' must be an object.");
	        }
	        if (typeof parsed.cssPrefix === "string") {
	            parsed.cssClasses = {};
	            Object.keys(entry).forEach(function (key) {
	                parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
	            });
	        }
	        else {
	            parsed.cssClasses = entry;
	        }
	    }
	    // Test all developer settings and parse to assumption-safe values.
	    function testOptions(options) {
	        // To prove a fix for #537, freeze options here.
	        // If the object is modified, an error will be thrown.
	        // Object.freeze(options);
	        var parsed = {
	            margin: null,
	            limit: null,
	            padding: null,
	            animate: true,
	            animationDuration: 300,
	            ariaFormat: defaultFormatter,
	            format: defaultFormatter
	        };
	        // Tests are executed in the order they are presented here.
	        var tests = {
	            step: { r: false, t: testStep },
	            keyboardPageMultiplier: { r: false, t: testKeyboardPageMultiplier },
	            keyboardMultiplier: { r: false, t: testKeyboardMultiplier },
	            keyboardDefaultStep: { r: false, t: testKeyboardDefaultStep },
	            start: { r: true, t: testStart },
	            connect: { r: true, t: testConnect },
	            direction: { r: true, t: testDirection },
	            snap: { r: false, t: testSnap },
	            animate: { r: false, t: testAnimate },
	            animationDuration: { r: false, t: testAnimationDuration },
	            range: { r: true, t: testRange },
	            orientation: { r: false, t: testOrientation },
	            margin: { r: false, t: testMargin },
	            limit: { r: false, t: testLimit },
	            padding: { r: false, t: testPadding },
	            behaviour: { r: true, t: testBehaviour },
	            ariaFormat: { r: false, t: testAriaFormat },
	            format: { r: false, t: testFormat },
	            tooltips: { r: false, t: testTooltips },
	            keyboardSupport: { r: true, t: testKeyboardSupport },
	            documentElement: { r: false, t: testDocumentElement },
	            cssPrefix: { r: true, t: testCssPrefix },
	            cssClasses: { r: true, t: testCssClasses },
	            handleAttributes: { r: false, t: testHandleAttributes }
	        };
	        var defaults = {
	            connect: false,
	            direction: "ltr",
	            behaviour: "tap",
	            orientation: "horizontal",
	            keyboardSupport: true,
	            cssPrefix: "noUi-",
	            cssClasses: cssClasses,
	            keyboardPageMultiplier: 5,
	            keyboardMultiplier: 1,
	            keyboardDefaultStep: 10
	        };
	        // AriaFormat defaults to regular format, if any.
	        if (options.format && !options.ariaFormat) {
	            options.ariaFormat = options.format;
	        }
	        // Run all options through a testing mechanism to ensure correct
	        // input. It should be noted that options might get modified to
	        // be handled properly. E.g. wrapping integers in arrays.
	        Object.keys(tests).forEach(function (name) {
	            // If the option isn't set, but it is required, throw an error.
	            if (!isSet(options[name]) && defaults[name] === undefined) {
	                if (tests[name].r) {
	                    throw new Error("noUiSlider: '" + name + "' is required.");
	                }
	                return;
	            }
	            tests[name].t(parsed, !isSet(options[name]) ? defaults[name] : options[name]);
	        });
	        // Forward pips options
	        parsed.pips = options.pips;
	        // All recent browsers accept unprefixed transform.
	        // We need -ms- for IE9 and -webkit- for older Android;
	        // Assume use of -webkit- if unprefixed and -ms- are not supported.
	        // https://caniuse.com/#feat=transforms2d
	        var d = document.createElement("div");
	        var msPrefix = d.style.msTransform !== undefined;
	        var noPrefix = d.style.transform !== undefined;
	        parsed.transformRule = noPrefix ? "transform" : msPrefix ? "msTransform" : "webkitTransform";
	        // Pips don't move, so we can place them using left/top.
	        var styles = [
	            ["left", "top"],
	            ["right", "bottom"]
	        ];
	        parsed.style = styles[parsed.dir][parsed.ort];
	        return parsed;
	    }
	    //endregion
	    function scope(target, options, originalOptions) {
	        var actions = getActions();
	        var supportsTouchActionNone = getSupportsTouchActionNone();
	        var supportsPassive = supportsTouchActionNone && getSupportsPassive();
	        // All variables local to 'scope' are prefixed with 'scope_'
	        // Slider DOM Nodes
	        var scope_Target = target;
	        var scope_Base;
	        var scope_Handles;
	        var scope_Connects;
	        var scope_Pips;
	        var scope_Tooltips;
	        // Slider state values
	        var scope_Spectrum = options.spectrum;
	        var scope_Values = [];
	        var scope_Locations = [];
	        var scope_HandleNumbers = [];
	        var scope_ActiveHandlesCount = 0;
	        var scope_Events = {};
	        // Document Nodes
	        var scope_Document = target.ownerDocument;
	        var scope_DocumentElement = options.documentElement || scope_Document.documentElement;
	        var scope_Body = scope_Document.body;
	        // For horizontal sliders in standard ltr documents,
	        // make .noUi-origin overflow to the left so the document doesn't scroll.
	        var scope_DirOffset = scope_Document.dir === "rtl" || options.ort === 1 ? 0 : 100;
	        // Creates a node, adds it to target, returns the new node.
	        function addNodeTo(addTarget, className) {
	            var div = scope_Document.createElement("div");
	            if (className) {
	                addClass(div, className);
	            }
	            addTarget.appendChild(div);
	            return div;
	        }
	        // Append a origin to the base
	        function addOrigin(base, handleNumber) {
	            var origin = addNodeTo(base, options.cssClasses.origin);
	            var handle = addNodeTo(origin, options.cssClasses.handle);
	            addNodeTo(handle, options.cssClasses.touchArea);
	            handle.setAttribute("data-handle", String(handleNumber));
	            if (options.keyboardSupport) {
	                // https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
	                // 0 = focusable and reachable
	                handle.setAttribute("tabindex", "0");
	                handle.addEventListener("keydown", function (event) {
	                    return eventKeydown(event, handleNumber);
	                });
	            }
	            if (options.handleAttributes !== undefined) {
	                var attributes_1 = options.handleAttributes[handleNumber];
	                Object.keys(attributes_1).forEach(function (attribute) {
	                    handle.setAttribute(attribute, attributes_1[attribute]);
	                });
	            }
	            handle.setAttribute("role", "slider");
	            handle.setAttribute("aria-orientation", options.ort ? "vertical" : "horizontal");
	            if (handleNumber === 0) {
	                addClass(handle, options.cssClasses.handleLower);
	            }
	            else if (handleNumber === options.handles - 1) {
	                addClass(handle, options.cssClasses.handleUpper);
	            }
	            return origin;
	        }
	        // Insert nodes for connect elements
	        function addConnect(base, add) {
	            if (!add) {
	                return false;
	            }
	            return addNodeTo(base, options.cssClasses.connect);
	        }
	        // Add handles to the slider base.
	        function addElements(connectOptions, base) {
	            var connectBase = addNodeTo(base, options.cssClasses.connects);
	            scope_Handles = [];
	            scope_Connects = [];
	            scope_Connects.push(addConnect(connectBase, connectOptions[0]));
	            // [::::O====O====O====]
	            // connectOptions = [0, 1, 1, 1]
	            for (var i = 0; i < options.handles; i++) {
	                // Keep a list of all added handles.
	                scope_Handles.push(addOrigin(base, i));
	                scope_HandleNumbers[i] = i;
	                scope_Connects.push(addConnect(connectBase, connectOptions[i + 1]));
	            }
	        }
	        // Initialize a single slider.
	        function addSlider(addTarget) {
	            // Apply classes and data to the target.
	            addClass(addTarget, options.cssClasses.target);
	            if (options.dir === 0) {
	                addClass(addTarget, options.cssClasses.ltr);
	            }
	            else {
	                addClass(addTarget, options.cssClasses.rtl);
	            }
	            if (options.ort === 0) {
	                addClass(addTarget, options.cssClasses.horizontal);
	            }
	            else {
	                addClass(addTarget, options.cssClasses.vertical);
	            }
	            var textDirection = getComputedStyle(addTarget).direction;
	            if (textDirection === "rtl") {
	                addClass(addTarget, options.cssClasses.textDirectionRtl);
	            }
	            else {
	                addClass(addTarget, options.cssClasses.textDirectionLtr);
	            }
	            return addNodeTo(addTarget, options.cssClasses.base);
	        }
	        function addTooltip(handle, handleNumber) {
	            if (!options.tooltips || !options.tooltips[handleNumber]) {
	                return false;
	            }
	            return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
	        }
	        function isSliderDisabled() {
	            return scope_Target.hasAttribute("disabled");
	        }
	        // Disable the slider dragging if any handle is disabled
	        function isHandleDisabled(handleNumber) {
	            var handleOrigin = scope_Handles[handleNumber];
	            return handleOrigin.hasAttribute("disabled");
	        }
	        function removeTooltips() {
	            if (scope_Tooltips) {
	                removeEvent("update" + INTERNAL_EVENT_NS.tooltips);
	                scope_Tooltips.forEach(function (tooltip) {
	                    if (tooltip) {
	                        removeElement(tooltip);
	                    }
	                });
	                scope_Tooltips = null;
	            }
	        }
	        // The tooltips option is a shorthand for using the 'update' event.
	        function tooltips() {
	            removeTooltips();
	            // Tooltips are added with options.tooltips in original order.
	            scope_Tooltips = scope_Handles.map(addTooltip);
	            bindEvent("update" + INTERNAL_EVENT_NS.tooltips, function (values, handleNumber, unencoded) {
	                if (!scope_Tooltips || !options.tooltips) {
	                    return;
	                }
	                if (scope_Tooltips[handleNumber] === false) {
	                    return;
	                }
	                var formattedValue = values[handleNumber];
	                if (options.tooltips[handleNumber] !== true) {
	                    formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
	                }
	                scope_Tooltips[handleNumber].innerHTML = formattedValue;
	            });
	        }
	        function aria() {
	            removeEvent("update" + INTERNAL_EVENT_NS.aria);
	            bindEvent("update" + INTERNAL_EVENT_NS.aria, function (values, handleNumber, unencoded, tap, positions) {
	                // Update Aria Values for all handles, as a change in one changes min and max values for the next.
	                scope_HandleNumbers.forEach(function (index) {
	                    var handle = scope_Handles[index];
	                    var min = checkHandlePosition(scope_Locations, index, 0, true, true, true);
	                    var max = checkHandlePosition(scope_Locations, index, 100, true, true, true);
	                    var now = positions[index];
	                    // Formatted value for display
	                    var text = String(options.ariaFormat.to(unencoded[index]));
	                    // Map to slider range values
	                    min = scope_Spectrum.fromStepping(min).toFixed(1);
	                    max = scope_Spectrum.fromStepping(max).toFixed(1);
	                    now = scope_Spectrum.fromStepping(now).toFixed(1);
	                    handle.children[0].setAttribute("aria-valuemin", min);
	                    handle.children[0].setAttribute("aria-valuemax", max);
	                    handle.children[0].setAttribute("aria-valuenow", now);
	                    handle.children[0].setAttribute("aria-valuetext", text);
	                });
	            });
	        }
	        function getGroup(pips) {
	            // Use the range.
	            if (pips.mode === exports.PipsMode.Range || pips.mode === exports.PipsMode.Steps) {
	                return scope_Spectrum.xVal;
	            }
	            if (pips.mode === exports.PipsMode.Count) {
	                if (pips.values < 2) {
	                    throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
	                }
	                // Divide 0 - 100 in 'count' parts.
	                var interval = pips.values - 1;
	                var spread = 100 / interval;
	                var values = [];
	                // List these parts and have them handled as 'positions'.
	                while (interval--) {
	                    values[interval] = interval * spread;
	                }
	                values.push(100);
	                return mapToRange(values, pips.stepped);
	            }
	            if (pips.mode === exports.PipsMode.Positions) {
	                // Map all percentages to on-range values.
	                return mapToRange(pips.values, pips.stepped);
	            }
	            if (pips.mode === exports.PipsMode.Values) {
	                // If the value must be stepped, it needs to be converted to a percentage first.
	                if (pips.stepped) {
	                    return pips.values.map(function (value) {
	                        // Convert to percentage, apply step, return to value.
	                        return scope_Spectrum.fromStepping(scope_Spectrum.getStep(scope_Spectrum.toStepping(value)));
	                    });
	                }
	                // Otherwise, we can simply use the values.
	                return pips.values;
	            }
	            return []; // pips.mode = never
	        }
	        function mapToRange(values, stepped) {
	            return values.map(function (value) {
	                return scope_Spectrum.fromStepping(stepped ? scope_Spectrum.getStep(value) : value);
	            });
	        }
	        function generateSpread(pips) {
	            function safeIncrement(value, increment) {
	                // Avoid floating point variance by dropping the smallest decimal places.
	                return Number((value + increment).toFixed(7));
	            }
	            var group = getGroup(pips);
	            var indexes = {};
	            var firstInRange = scope_Spectrum.xVal[0];
	            var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length - 1];
	            var ignoreFirst = false;
	            var ignoreLast = false;
	            var prevPct = 0;
	            // Create a copy of the group, sort it and filter away all duplicates.
	            group = unique(group.slice().sort(function (a, b) {
	                return a - b;
	            }));
	            // Make sure the range starts with the first element.
	            if (group[0] !== firstInRange) {
	                group.unshift(firstInRange);
	                ignoreFirst = true;
	            }
	            // Likewise for the last one.
	            if (group[group.length - 1] !== lastInRange) {
	                group.push(lastInRange);
	                ignoreLast = true;
	            }
	            group.forEach(function (current, index) {
	                // Get the current step and the lower + upper positions.
	                var step;
	                var i;
	                var q;
	                var low = current;
	                var high = group[index + 1];
	                var newPct;
	                var pctDifference;
	                var pctPos;
	                var type;
	                var steps;
	                var realSteps;
	                var stepSize;
	                var isSteps = pips.mode === exports.PipsMode.Steps;
	                // When using 'steps' mode, use the provided steps.
	                // Otherwise, we'll step on to the next subrange.
	                if (isSteps) {
	                    step = scope_Spectrum.xNumSteps[index];
	                }
	                // Default to a 'full' step.
	                if (!step) {
	                    step = high - low;
	                }
	                // If high is undefined we are at the last subrange. Make sure it iterates once (#1088)
	                if (high === undefined) {
	                    high = low;
	                }
	                // Make sure step isn't 0, which would cause an infinite loop (#654)
	                step = Math.max(step, 0.0000001);
	                // Find all steps in the subrange.
	                for (i = low; i <= high; i = safeIncrement(i, step)) {
	                    // Get the percentage value for the current step,
	                    // calculate the size for the subrange.
	                    newPct = scope_Spectrum.toStepping(i);
	                    pctDifference = newPct - prevPct;
	                    steps = pctDifference / (pips.density || 1);
	                    realSteps = Math.round(steps);
	                    // This ratio represents the amount of percentage-space a point indicates.
	                    // For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-divided.
	                    // Round the percentage offset to an even number, then divide by two
	                    // to spread the offset on both sides of the range.
	                    stepSize = pctDifference / realSteps;
	                    // Divide all points evenly, adding the correct number to this subrange.
	                    // Run up to <= so that 100% gets a point, event if ignoreLast is set.
	                    for (q = 1; q <= realSteps; q += 1) {
	                        // The ratio between the rounded value and the actual size might be ~1% off.
	                        // Correct the percentage offset by the number of points
	                        // per subrange. density = 1 will result in 100 points on the
	                        // full range, 2 for 50, 4 for 25, etc.
	                        pctPos = prevPct + q * stepSize;
	                        indexes[pctPos.toFixed(5)] = [scope_Spectrum.fromStepping(pctPos), 0];
	                    }
	                    // Determine the point type.
	                    type = group.indexOf(i) > -1 ? exports.PipsType.LargeValue : isSteps ? exports.PipsType.SmallValue : exports.PipsType.NoValue;
	                    // Enforce the 'ignoreFirst' option by overwriting the type for 0.
	                    if (!index && ignoreFirst && i !== high) {
	                        type = 0;
	                    }
	                    if (!(i === high && ignoreLast)) {
	                        // Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
	                        indexes[newPct.toFixed(5)] = [i, type];
	                    }
	                    // Update the percentage count.
	                    prevPct = newPct;
	                }
	            });
	            return indexes;
	        }
	        function addMarking(spread, filterFunc, formatter) {
	            var _a, _b;
	            var element = scope_Document.createElement("div");
	            var valueSizeClasses = (_a = {},
	                _a[exports.PipsType.None] = "",
	                _a[exports.PipsType.NoValue] = options.cssClasses.valueNormal,
	                _a[exports.PipsType.LargeValue] = options.cssClasses.valueLarge,
	                _a[exports.PipsType.SmallValue] = options.cssClasses.valueSub,
	                _a);
	            var markerSizeClasses = (_b = {},
	                _b[exports.PipsType.None] = "",
	                _b[exports.PipsType.NoValue] = options.cssClasses.markerNormal,
	                _b[exports.PipsType.LargeValue] = options.cssClasses.markerLarge,
	                _b[exports.PipsType.SmallValue] = options.cssClasses.markerSub,
	                _b);
	            var valueOrientationClasses = [options.cssClasses.valueHorizontal, options.cssClasses.valueVertical];
	            var markerOrientationClasses = [options.cssClasses.markerHorizontal, options.cssClasses.markerVertical];
	            addClass(element, options.cssClasses.pips);
	            addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
	            function getClasses(type, source) {
	                var a = source === options.cssClasses.value;
	                var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
	                var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
	                return source + " " + orientationClasses[options.ort] + " " + sizeClasses[type];
	            }
	            function addSpread(offset, value, type) {
	                // Apply the filter function, if it is set.
	                type = filterFunc ? filterFunc(value, type) : type;
	                if (type === exports.PipsType.None) {
	                    return;
	                }
	                // Add a marker for every point
	                var node = addNodeTo(element, false);
	                node.className = getClasses(type, options.cssClasses.marker);
	                node.style[options.style] = offset + "%";
	                // Values are only appended for points marked '1' or '2'.
	                if (type > exports.PipsType.NoValue) {
	                    node = addNodeTo(element, false);
	                    node.className = getClasses(type, options.cssClasses.value);
	                    node.setAttribute("data-value", String(value));
	                    node.style[options.style] = offset + "%";
	                    node.innerHTML = String(formatter.to(value));
	                }
	            }
	            // Append all points.
	            Object.keys(spread).forEach(function (offset) {
	                addSpread(offset, spread[offset][0], spread[offset][1]);
	            });
	            return element;
	        }
	        function removePips() {
	            if (scope_Pips) {
	                removeElement(scope_Pips);
	                scope_Pips = null;
	            }
	        }
	        function pips(pips) {
	            // Fix #669
	            removePips();
	            var spread = generateSpread(pips);
	            var filter = pips.filter;
	            var format = pips.format || {
	                to: function (value) {
	                    return String(Math.round(value));
	                }
	            };
	            scope_Pips = scope_Target.appendChild(addMarking(spread, filter, format));
	            return scope_Pips;
	        }
	        // Shorthand for base dimensions.
	        function baseSize() {
	            var rect = scope_Base.getBoundingClientRect();
	            var alt = ("offset" + ["Width", "Height"][options.ort]);
	            return options.ort === 0 ? rect.width || scope_Base[alt] : rect.height || scope_Base[alt];
	        }
	        // Handler for attaching events trough a proxy.
	        function attachEvent(events, element, callback, data) {
	            // This function can be used to 'filter' events to the slider.
	            // element is a node, not a nodeList
	            var method = function (event) {
	                var e = fixEvent(event, data.pageOffset, data.target || element);
	                // fixEvent returns false if this event has a different target
	                // when handling (multi-) touch events;
	                if (!e) {
	                    return false;
	                }
	                // doNotReject is passed by all end events to make sure released touches
	                // are not rejected, leaving the slider "stuck" to the cursor;
	                if (isSliderDisabled() && !data.doNotReject) {
	                    return false;
	                }
	                // Stop if an active 'tap' transition is taking place.
	                if (hasClass(scope_Target, options.cssClasses.tap) && !data.doNotReject) {
	                    return false;
	                }
	                // Ignore right or middle clicks on start #454
	                if (events === actions.start && e.buttons !== undefined && e.buttons > 1) {
	                    return false;
	                }
	                // Ignore right or middle clicks on start #454
	                if (data.hover && e.buttons) {
	                    return false;
	                }
	                // 'supportsPassive' is only true if a browser also supports touch-action: none in CSS.
	                // iOS safari does not, so it doesn't get to benefit from passive scrolling. iOS does support
	                // touch-action: manipulation, but that allows panning, which breaks
	                // sliders after zooming/on non-responsive pages.
	                // See: https://bugs.webkit.org/show_bug.cgi?id=133112
	                if (!supportsPassive) {
	                    e.preventDefault();
	                }
	                e.calcPoint = e.points[options.ort];
	                // Call the event handler with the event [ and additional data ].
	                callback(e, data);
	                return;
	            };
	            var methods = [];
	            // Bind a closure on the target for every event type.
	            events.split(" ").forEach(function (eventName) {
	                element.addEventListener(eventName, method, supportsPassive ? { passive: true } : false);
	                methods.push([eventName, method]);
	            });
	            return methods;
	        }
	        // Provide a clean event with standardized offset values.
	        function fixEvent(e, pageOffset, eventTarget) {
	            // Filter the event to register the type, which can be
	            // touch, mouse or pointer. Offset changes need to be
	            // made on an event specific basis.
	            var touch = e.type.indexOf("touch") === 0;
	            var mouse = e.type.indexOf("mouse") === 0;
	            var pointer = e.type.indexOf("pointer") === 0;
	            var x = 0;
	            var y = 0;
	            // IE10 implemented pointer events with a prefix;
	            if (e.type.indexOf("MSPointer") === 0) {
	                pointer = true;
	            }
	            // Erroneous events seem to be passed in occasionally on iOS/iPadOS after user finishes interacting with
	            // the slider. They appear to be of type MouseEvent, yet they don't have usual properties set. Ignore
	            // events that have no touches or buttons associated with them. (#1057, #1079, #1095)
	            if (e.type === "mousedown" && !e.buttons && !e.touches) {
	                return false;
	            }
	            // The only thing one handle should be concerned about is the touches that originated on top of it.
	            if (touch) {
	                // Returns true if a touch originated on the target.
	                var isTouchOnTarget = function (checkTouch) {
	                    var target = checkTouch.target;
	                    return (target === eventTarget ||
	                        eventTarget.contains(target) ||
	                        (e.composed && e.composedPath().shift() === eventTarget));
	                };
	                // In the case of touchstart events, we need to make sure there is still no more than one
	                // touch on the target so we look amongst all touches.
	                if (e.type === "touchstart") {
	                    var targetTouches = Array.prototype.filter.call(e.touches, isTouchOnTarget);
	                    // Do not support more than one touch per handle.
	                    if (targetTouches.length > 1) {
	                        return false;
	                    }
	                    x = targetTouches[0].pageX;
	                    y = targetTouches[0].pageY;
	                }
	                else {
	                    // In the other cases, find on changedTouches is enough.
	                    var targetTouch = Array.prototype.find.call(e.changedTouches, isTouchOnTarget);
	                    // Cancel if the target touch has not moved.
	                    if (!targetTouch) {
	                        return false;
	                    }
	                    x = targetTouch.pageX;
	                    y = targetTouch.pageY;
	                }
	            }
	            pageOffset = pageOffset || getPageOffset(scope_Document);
	            if (mouse || pointer) {
	                x = e.clientX + pageOffset.x;
	                y = e.clientY + pageOffset.y;
	            }
	            e.pageOffset = pageOffset;
	            e.points = [x, y];
	            e.cursor = mouse || pointer; // Fix #435
	            return e;
	        }
	        // Translate a coordinate in the document to a percentage on the slider
	        function calcPointToPercentage(calcPoint) {
	            var location = calcPoint - offset(scope_Base, options.ort);
	            var proposal = (location * 100) / baseSize();
	            // Clamp proposal between 0% and 100%
	            // Out-of-bound coordinates may occur when .noUi-base pseudo-elements
	            // are used (e.g. contained handles feature)
	            proposal = limit(proposal);
	            return options.dir ? 100 - proposal : proposal;
	        }
	        // Find handle closest to a certain percentage on the slider
	        function getClosestHandle(clickedPosition) {
	            var smallestDifference = 100;
	            var handleNumber = false;
	            scope_Handles.forEach(function (handle, index) {
	                // Disabled handles are ignored
	                if (isHandleDisabled(index)) {
	                    return;
	                }
	                var handlePosition = scope_Locations[index];
	                var differenceWithThisHandle = Math.abs(handlePosition - clickedPosition);
	                // Initial state
	                var clickAtEdge = differenceWithThisHandle === 100 && smallestDifference === 100;
	                // Difference with this handle is smaller than the previously checked handle
	                var isCloser = differenceWithThisHandle < smallestDifference;
	                var isCloserAfter = differenceWithThisHandle <= smallestDifference && clickedPosition > handlePosition;
	                if (isCloser || isCloserAfter || clickAtEdge) {
	                    handleNumber = index;
	                    smallestDifference = differenceWithThisHandle;
	                }
	            });
	            return handleNumber;
	        }
	        // Fire 'end' when a mouse or pen leaves the document.
	        function documentLeave(event, data) {
	            if (event.type === "mouseout" &&
	                event.target.nodeName === "HTML" &&
	                event.relatedTarget === null) {
	                eventEnd(event, data);
	            }
	        }
	        // Handle movement on document for handle and range drag.
	        function eventMove(event, data) {
	            // Fix #498
	            // Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
	            // https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
	            // IE9 has .buttons and .which zero on mousemove.
	            // Firefox breaks the spec MDN defines.
	            if (navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0) {
	                return eventEnd(event, data);
	            }
	            // Check if we are moving up or down
	            var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
	            // Convert the movement into a percentage of the slider width/height
	            var proposal = (movement * 100) / data.baseSize;
	            moveHandles(movement > 0, proposal, data.locations, data.handleNumbers, data.connect);
	        }
	        // Unbind move events on document, call callbacks.
	        function eventEnd(event, data) {
	            // The handle is no longer active, so remove the class.
	            if (data.handle) {
	                removeClass(data.handle, options.cssClasses.active);
	                scope_ActiveHandlesCount -= 1;
	            }
	            // Unbind the move and end events, which are added on 'start'.
	            data.listeners.forEach(function (c) {
	                scope_DocumentElement.removeEventListener(c[0], c[1]);
	            });
	            if (scope_ActiveHandlesCount === 0) {
	                // Remove dragging class.
	                removeClass(scope_Target, options.cssClasses.drag);
	                setZindex();
	                // Remove cursor styles and text-selection events bound to the body.
	                if (event.cursor) {
	                    scope_Body.style.cursor = "";
	                    scope_Body.removeEventListener("selectstart", preventDefault);
	                }
	            }
	            data.handleNumbers.forEach(function (handleNumber) {
	                fireEvent("change", handleNumber);
	                fireEvent("set", handleNumber);
	                fireEvent("end", handleNumber);
	            });
	        }
	        // Bind move events on document.
	        function eventStart(event, data) {
	            // Ignore event if any handle is disabled
	            if (data.handleNumbers.some(isHandleDisabled)) {
	                return;
	            }
	            var handle;
	            if (data.handleNumbers.length === 1) {
	                var handleOrigin = scope_Handles[data.handleNumbers[0]];
	                handle = handleOrigin.children[0];
	                scope_ActiveHandlesCount += 1;
	                // Mark the handle as 'active' so it can be styled.
	                addClass(handle, options.cssClasses.active);
	            }
	            // A drag should never propagate up to the 'tap' event.
	            event.stopPropagation();
	            // Record the event listeners.
	            var listeners = [];
	            // Attach the move and end events.
	            var moveEvent = attachEvent(actions.move, scope_DocumentElement, eventMove, {
	                // The event target has changed so we need to propagate the original one so that we keep
	                // relying on it to extract target touches.
	                target: event.target,
	                handle: handle,
	                connect: data.connect,
	                listeners: listeners,
	                startCalcPoint: event.calcPoint,
	                baseSize: baseSize(),
	                pageOffset: event.pageOffset,
	                handleNumbers: data.handleNumbers,
	                buttonsProperty: event.buttons,
	                locations: scope_Locations.slice()
	            });
	            var endEvent = attachEvent(actions.end, scope_DocumentElement, eventEnd, {
	                target: event.target,
	                handle: handle,
	                listeners: listeners,
	                doNotReject: true,
	                handleNumbers: data.handleNumbers
	            });
	            var outEvent = attachEvent("mouseout", scope_DocumentElement, documentLeave, {
	                target: event.target,
	                handle: handle,
	                listeners: listeners,
	                doNotReject: true,
	                handleNumbers: data.handleNumbers
	            });
	            // We want to make sure we pushed the listeners in the listener list rather than creating
	            // a new one as it has already been passed to the event handlers.
	            listeners.push.apply(listeners, moveEvent.concat(endEvent, outEvent));
	            // Text selection isn't an issue on touch devices,
	            // so adding cursor styles can be skipped.
	            if (event.cursor) {
	                // Prevent the 'I' cursor and extend the range-drag cursor.
	                scope_Body.style.cursor = getComputedStyle(event.target).cursor;
	                // Mark the target with a dragging state.
	                if (scope_Handles.length > 1) {
	                    addClass(scope_Target, options.cssClasses.drag);
	                }
	                // Prevent text selection when dragging the handles.
	                // In noUiSlider <= 9.2.0, this was handled by calling preventDefault on mouse/touch start/move,
	                // which is scroll blocking. The selectstart event is supported by FireFox starting from version 52,
	                // meaning the only holdout is iOS Safari. This doesn't matter: text selection isn't triggered there.
	                // The 'cursor' flag is false.
	                // See: http://caniuse.com/#search=selectstart
	                scope_Body.addEventListener("selectstart", preventDefault, false);
	            }
	            data.handleNumbers.forEach(function (handleNumber) {
	                fireEvent("start", handleNumber);
	            });
	        }
	        // Move closest handle to tapped location.
	        function eventTap(event) {
	            // The tap event shouldn't propagate up
	            event.stopPropagation();
	            var proposal = calcPointToPercentage(event.calcPoint);
	            var handleNumber = getClosestHandle(proposal);
	            // Tackle the case that all handles are 'disabled'.
	            if (handleNumber === false) {
	                return;
	            }
	            // Flag the slider as it is now in a transitional state.
	            // Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
	            if (!options.events.snap) {
	                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
	            }
	            setHandle(handleNumber, proposal, true, true);
	            setZindex();
	            fireEvent("slide", handleNumber, true);
	            fireEvent("update", handleNumber, true);
	            if (!options.events.snap) {
	                fireEvent("change", handleNumber, true);
	                fireEvent("set", handleNumber, true);
	            }
	            else {
	                eventStart(event, { handleNumbers: [handleNumber] });
	            }
	        }
	        // Fires a 'hover' event for a hovered mouse/pen position.
	        function eventHover(event) {
	            var proposal = calcPointToPercentage(event.calcPoint);
	            var to = scope_Spectrum.getStep(proposal);
	            var value = scope_Spectrum.fromStepping(to);
	            Object.keys(scope_Events).forEach(function (targetEvent) {
	                if ("hover" === targetEvent.split(".")[0]) {
	                    scope_Events[targetEvent].forEach(function (callback) {
	                        callback.call(scope_Self, value);
	                    });
	                }
	            });
	        }
	        // Handles keydown on focused handles
	        // Don't move the document when pressing arrow keys on focused handles
	        function eventKeydown(event, handleNumber) {
	            if (isSliderDisabled() || isHandleDisabled(handleNumber)) {
	                return false;
	            }
	            var horizontalKeys = ["Left", "Right"];
	            var verticalKeys = ["Down", "Up"];
	            var largeStepKeys = ["PageDown", "PageUp"];
	            var edgeKeys = ["Home", "End"];
	            if (options.dir && !options.ort) {
	                // On an right-to-left slider, the left and right keys act inverted
	                horizontalKeys.reverse();
	            }
	            else if (options.ort && !options.dir) {
	                // On a top-to-bottom slider, the up and down keys act inverted
	                verticalKeys.reverse();
	                largeStepKeys.reverse();
	            }
	            // Strip "Arrow" for IE compatibility. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
	            var key = event.key.replace("Arrow", "");
	            var isLargeDown = key === largeStepKeys[0];
	            var isLargeUp = key === largeStepKeys[1];
	            var isDown = key === verticalKeys[0] || key === horizontalKeys[0] || isLargeDown;
	            var isUp = key === verticalKeys[1] || key === horizontalKeys[1] || isLargeUp;
	            var isMin = key === edgeKeys[0];
	            var isMax = key === edgeKeys[1];
	            if (!isDown && !isUp && !isMin && !isMax) {
	                return true;
	            }
	            event.preventDefault();
	            var to;
	            if (isUp || isDown) {
	                var direction = isDown ? 0 : 1;
	                var steps = getNextStepsForHandle(handleNumber);
	                var step = steps[direction];
	                // At the edge of a slider, do nothing
	                if (step === null) {
	                    return false;
	                }
	                // No step set, use the default of 10% of the sub-range
	                if (step === false) {
	                    step = scope_Spectrum.getDefaultStep(scope_Locations[handleNumber], isDown, options.keyboardDefaultStep);
	                }
	                if (isLargeUp || isLargeDown) {
	                    step *= options.keyboardPageMultiplier;
	                }
	                else {
	                    step *= options.keyboardMultiplier;
	                }
	                // Step over zero-length ranges (#948);
	                step = Math.max(step, 0.0000001);
	                // Decrement for down steps
	                step = (isDown ? -1 : 1) * step;
	                to = scope_Values[handleNumber] + step;
	            }
	            else if (isMax) {
	                // End key
	                to = options.spectrum.xVal[options.spectrum.xVal.length - 1];
	            }
	            else {
	                // Home key
	                to = options.spectrum.xVal[0];
	            }
	            setHandle(handleNumber, scope_Spectrum.toStepping(to), true, true);
	            fireEvent("slide", handleNumber);
	            fireEvent("update", handleNumber);
	            fireEvent("change", handleNumber);
	            fireEvent("set", handleNumber);
	            return false;
	        }
	        // Attach events to several slider parts.
	        function bindSliderEvents(behaviour) {
	            // Attach the standard drag event to the handles.
	            if (!behaviour.fixed) {
	                scope_Handles.forEach(function (handle, index) {
	                    // These events are only bound to the visual handle
	                    // element, not the 'real' origin element.
	                    attachEvent(actions.start, handle.children[0], eventStart, {
	                        handleNumbers: [index]
	                    });
	                });
	            }
	            // Attach the tap event to the slider base.
	            if (behaviour.tap) {
	                attachEvent(actions.start, scope_Base, eventTap, {});
	            }
	            // Fire hover events
	            if (behaviour.hover) {
	                attachEvent(actions.move, scope_Base, eventHover, {
	                    hover: true
	                });
	            }
	            // Make the range draggable.
	            if (behaviour.drag) {
	                scope_Connects.forEach(function (connect, index) {
	                    if (connect === false || index === 0 || index === scope_Connects.length - 1) {
	                        return;
	                    }
	                    var handleBefore = scope_Handles[index - 1];
	                    var handleAfter = scope_Handles[index];
	                    var eventHolders = [connect];
	                    var handlesToDrag = [handleBefore, handleAfter];
	                    var handleNumbersToDrag = [index - 1, index];
	                    addClass(connect, options.cssClasses.draggable);
	                    // When the range is fixed, the entire range can
	                    // be dragged by the handles. The handle in the first
	                    // origin will propagate the start event upward,
	                    // but it needs to be bound manually on the other.
	                    if (behaviour.fixed) {
	                        eventHolders.push(handleBefore.children[0]);
	                        eventHolders.push(handleAfter.children[0]);
	                    }
	                    if (behaviour.dragAll) {
	                        handlesToDrag = scope_Handles;
	                        handleNumbersToDrag = scope_HandleNumbers;
	                    }
	                    eventHolders.forEach(function (eventHolder) {
	                        attachEvent(actions.start, eventHolder, eventStart, {
	                            handles: handlesToDrag,
	                            handleNumbers: handleNumbersToDrag,
	                            connect: connect
	                        });
	                    });
	                });
	            }
	        }
	        // Attach an event to this slider, possibly including a namespace
	        function bindEvent(namespacedEvent, callback) {
	            scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
	            scope_Events[namespacedEvent].push(callback);
	            // If the event bound is 'update,' fire it immediately for all handles.
	            if (namespacedEvent.split(".")[0] === "update") {
	                scope_Handles.forEach(function (a, index) {
	                    fireEvent("update", index);
	                });
	            }
	        }
	        function isInternalNamespace(namespace) {
	            return namespace === INTERNAL_EVENT_NS.aria || namespace === INTERNAL_EVENT_NS.tooltips;
	        }
	        // Undo attachment of event
	        function removeEvent(namespacedEvent) {
	            var event = namespacedEvent && namespacedEvent.split(".")[0];
	            var namespace = event ? namespacedEvent.substring(event.length) : namespacedEvent;
	            Object.keys(scope_Events).forEach(function (bind) {
	                var tEvent = bind.split(".")[0];
	                var tNamespace = bind.substring(tEvent.length);
	                if ((!event || event === tEvent) && (!namespace || namespace === tNamespace)) {
	                    // only delete protected internal event if intentional
	                    if (!isInternalNamespace(tNamespace) || namespace === tNamespace) {
	                        delete scope_Events[bind];
	                    }
	                }
	            });
	        }
	        // External event handling
	        function fireEvent(eventName, handleNumber, tap) {
	            Object.keys(scope_Events).forEach(function (targetEvent) {
	                var eventType = targetEvent.split(".")[0];
	                if (eventName === eventType) {
	                    scope_Events[targetEvent].forEach(function (callback) {
	                        callback.call(
	                        // Use the slider public API as the scope ('this')
	                        scope_Self, 
	                        // Return values as array, so arg_1[arg_2] is always valid.
	                        scope_Values.map(options.format.to), 
	                        // Handle index, 0 or 1
	                        handleNumber, 
	                        // Un-formatted slider values
	                        scope_Values.slice(), 
	                        // Event is fired by tap, true or false
	                        tap || false, 
	                        // Left offset of the handle, in relation to the slider
	                        scope_Locations.slice(), 
	                        // add the slider public API to an accessible parameter when this is unavailable
	                        scope_Self);
	                    });
	                }
	            });
	        }
	        // Split out the handle positioning logic so the Move event can use it, too
	        function checkHandlePosition(reference, handleNumber, to, lookBackward, lookForward, getValue) {
	            var distance;
	            // For sliders with multiple handles, limit movement to the other handle.
	            // Apply the margin option by adding it to the handle positions.
	            if (scope_Handles.length > 1 && !options.events.unconstrained) {
	                if (lookBackward && handleNumber > 0) {
	                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.margin, false);
	                    to = Math.max(to, distance);
	                }
	                if (lookForward && handleNumber < scope_Handles.length - 1) {
	                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.margin, true);
	                    to = Math.min(to, distance);
	                }
	            }
	            // The limit option has the opposite effect, limiting handles to a
	            // maximum distance from another. Limit must be > 0, as otherwise
	            // handles would be unmovable.
	            if (scope_Handles.length > 1 && options.limit) {
	                if (lookBackward && handleNumber > 0) {
	                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber - 1], options.limit, false);
	                    to = Math.min(to, distance);
	                }
	                if (lookForward && handleNumber < scope_Handles.length - 1) {
	                    distance = scope_Spectrum.getAbsoluteDistance(reference[handleNumber + 1], options.limit, true);
	                    to = Math.max(to, distance);
	                }
	            }
	            // The padding option keeps the handles a certain distance from the
	            // edges of the slider. Padding must be > 0.
	            if (options.padding) {
	                if (handleNumber === 0) {
	                    distance = scope_Spectrum.getAbsoluteDistance(0, options.padding[0], false);
	                    to = Math.max(to, distance);
	                }
	                if (handleNumber === scope_Handles.length - 1) {
	                    distance = scope_Spectrum.getAbsoluteDistance(100, options.padding[1], true);
	                    to = Math.min(to, distance);
	                }
	            }
	            to = scope_Spectrum.getStep(to);
	            // Limit percentage to the 0 - 100 range
	            to = limit(to);
	            // Return false if handle can't move
	            if (to === reference[handleNumber] && !getValue) {
	                return false;
	            }
	            return to;
	        }
	        // Uses slider orientation to create CSS rules. a = base value;
	        function inRuleOrder(v, a) {
	            var o = options.ort;
	            return (o ? a : v) + ", " + (o ? v : a);
	        }
	        // Moves handle(s) by a percentage
	        // (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
	        function moveHandles(upward, proposal, locations, handleNumbers, connect) {
	            var proposals = locations.slice();
	            // Store first handle now, so we still have it in case handleNumbers is reversed
	            var firstHandle = handleNumbers[0];
	            var b = [!upward, upward];
	            var f = [upward, !upward];
	            // Copy handleNumbers so we don't change the dataset
	            handleNumbers = handleNumbers.slice();
	            // Check to see which handle is 'leading'.
	            // If that one can't move the second can't either.
	            if (upward) {
	                handleNumbers.reverse();
	            }
	            // Step 1: get the maximum percentage that any of the handles can move
	            if (handleNumbers.length > 1) {
	                handleNumbers.forEach(function (handleNumber, o) {
	                    var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o], false);
	                    // Stop if one of the handles can't move.
	                    if (to === false) {
	                        proposal = 0;
	                    }
	                    else {
	                        proposal = to - proposals[handleNumber];
	                        proposals[handleNumber] = to;
	                    }
	                });
	            }
	            // If using one handle, check backward AND forward
	            else {
	                b = f = [true];
	            }
	            var state = false;
	            // Step 2: Try to set the handles with the found percentage
	            handleNumbers.forEach(function (handleNumber, o) {
	                state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
	            });
	            // Step 3: If a handle moved, fire events
	            if (state) {
	                handleNumbers.forEach(function (handleNumber) {
	                    fireEvent("update", handleNumber);
	                    fireEvent("slide", handleNumber);
	                });
	                // If target is a connect, then fire drag event
	                if (connect != undefined) {
	                    fireEvent("drag", firstHandle);
	                }
	            }
	        }
	        // Takes a base value and an offset. This offset is used for the connect bar size.
	        // In the initial design for this feature, the origin element was 1% wide.
	        // Unfortunately, a rounding bug in Chrome makes it impossible to implement this feature
	        // in this manner: https://bugs.chromium.org/p/chromium/issues/detail?id=798223
	        function transformDirection(a, b) {
	            return options.dir ? 100 - a - b : a;
	        }
	        // Updates scope_Locations and scope_Values, updates visual state
	        function updateHandlePosition(handleNumber, to) {
	            // Update locations.
	            scope_Locations[handleNumber] = to;
	            // Convert the value to the slider stepping/range.
	            scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
	            var translation = transformDirection(to, 0) - scope_DirOffset;
	            var translateRule = "translate(" + inRuleOrder(translation + "%", "0") + ")";
	            scope_Handles[handleNumber].style[options.transformRule] = translateRule;
	            updateConnect(handleNumber);
	            updateConnect(handleNumber + 1);
	        }
	        // Handles before the slider middle are stacked later = higher,
	        // Handles after the middle later is lower
	        // [[7] [8] .......... | .......... [5] [4]
	        function setZindex() {
	            scope_HandleNumbers.forEach(function (handleNumber) {
	                var dir = scope_Locations[handleNumber] > 50 ? -1 : 1;
	                var zIndex = 3 + (scope_Handles.length + dir * handleNumber);
	                scope_Handles[handleNumber].style.zIndex = String(zIndex);
	            });
	        }
	        // Test suggested values and apply margin, step.
	        // if exactInput is true, don't run checkHandlePosition, then the handle can be placed in between steps (#436)
	        function setHandle(handleNumber, to, lookBackward, lookForward, exactInput) {
	            if (!exactInput) {
	                to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward, false);
	            }
	            if (to === false) {
	                return false;
	            }
	            updateHandlePosition(handleNumber, to);
	            return true;
	        }
	        // Updates style attribute for connect nodes
	        function updateConnect(index) {
	            // Skip connects set to false
	            if (!scope_Connects[index]) {
	                return;
	            }
	            var l = 0;
	            var h = 100;
	            if (index !== 0) {
	                l = scope_Locations[index - 1];
	            }
	            if (index !== scope_Connects.length - 1) {
	                h = scope_Locations[index];
	            }
	            // We use two rules:
	            // 'translate' to change the left/top offset;
	            // 'scale' to change the width of the element;
	            // As the element has a width of 100%, a translation of 100% is equal to 100% of the parent (.noUi-base)
	            var connectWidth = h - l;
	            var translateRule = "translate(" + inRuleOrder(transformDirection(l, connectWidth) + "%", "0") + ")";
	            var scaleRule = "scale(" + inRuleOrder(connectWidth / 100, "1") + ")";
	            scope_Connects[index].style[options.transformRule] =
	                translateRule + " " + scaleRule;
	        }
	        // Parses value passed to .set method. Returns current value if not parse-able.
	        function resolveToValue(to, handleNumber) {
	            // Setting with null indicates an 'ignore'.
	            // Inputting 'false' is invalid.
	            if (to === null || to === false || to === undefined) {
	                return scope_Locations[handleNumber];
	            }
	            // If a formatted number was passed, attempt to decode it.
	            if (typeof to === "number") {
	                to = String(to);
	            }
	            to = options.format.from(to);
	            if (to !== false) {
	                to = scope_Spectrum.toStepping(to);
	            }
	            // If parsing the number failed, use the current value.
	            if (to === false || isNaN(to)) {
	                return scope_Locations[handleNumber];
	            }
	            return to;
	        }
	        // Set the slider value.
	        function valueSet(input, fireSetEvent, exactInput) {
	            var values = asArray(input);
	            var isInit = scope_Locations[0] === undefined;
	            // Event fires by default
	            fireSetEvent = fireSetEvent === undefined ? true : fireSetEvent;
	            // Animation is optional.
	            // Make sure the initial values were set before using animated placement.
	            if (options.animate && !isInit) {
	                addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
	            }
	            // First pass, without lookAhead but with lookBackward. Values are set from left to right.
	            scope_HandleNumbers.forEach(function (handleNumber) {
	                setHandle(handleNumber, resolveToValue(values[handleNumber], handleNumber), true, false, exactInput);
	            });
	            var i = scope_HandleNumbers.length === 1 ? 0 : 1;
	            // Spread handles evenly across the slider if the range has no size (min=max)
	            if (isInit && scope_Spectrum.hasNoSize()) {
	                exactInput = true;
	                scope_Locations[0] = 0;
	                if (scope_HandleNumbers.length > 1) {
	                    var space_1 = 100 / (scope_HandleNumbers.length - 1);
	                    scope_HandleNumbers.forEach(function (handleNumber) {
	                        scope_Locations[handleNumber] = handleNumber * space_1;
	                    });
	                }
	            }
	            // Secondary passes. Now that all base values are set, apply constraints.
	            // Iterate all handles to ensure constraints are applied for the entire slider (Issue #1009)
	            for (; i < scope_HandleNumbers.length; ++i) {
	                scope_HandleNumbers.forEach(function (handleNumber) {
	                    setHandle(handleNumber, scope_Locations[handleNumber], true, true, exactInput);
	                });
	            }
	            setZindex();
	            scope_HandleNumbers.forEach(function (handleNumber) {
	                fireEvent("update", handleNumber);
	                // Fire the event only for handles that received a new value, as per #579
	                if (values[handleNumber] !== null && fireSetEvent) {
	                    fireEvent("set", handleNumber);
	                }
	            });
	        }
	        // Reset slider to initial values
	        function valueReset(fireSetEvent) {
	            valueSet(options.start, fireSetEvent);
	        }
	        // Set value for a single handle
	        function valueSetHandle(handleNumber, value, fireSetEvent, exactInput) {
	            // Ensure numeric input
	            handleNumber = Number(handleNumber);
	            if (!(handleNumber >= 0 && handleNumber < scope_HandleNumbers.length)) {
	                throw new Error("noUiSlider: invalid handle number, got: " + handleNumber);
	            }
	            // Look both backward and forward, since we don't want this handle to "push" other handles (#960);
	            // The exactInput argument can be used to ignore slider stepping (#436)
	            setHandle(handleNumber, resolveToValue(value, handleNumber), true, true, exactInput);
	            fireEvent("update", handleNumber);
	            if (fireSetEvent) {
	                fireEvent("set", handleNumber);
	            }
	        }
	        // Get the slider value.
	        function valueGet(unencoded) {
	            if (unencoded === void 0) { unencoded = false; }
	            if (unencoded) {
	                // return a copy of the raw values
	                return scope_Values.length === 1 ? scope_Values[0] : scope_Values.slice(0);
	            }
	            var values = scope_Values.map(options.format.to);
	            // If only one handle is used, return a single value.
	            if (values.length === 1) {
	                return values[0];
	            }
	            return values;
	        }
	        // Removes classes from the root and empties it.
	        function destroy() {
	            // remove protected internal listeners
	            removeEvent(INTERNAL_EVENT_NS.aria);
	            removeEvent(INTERNAL_EVENT_NS.tooltips);
	            Object.keys(options.cssClasses).forEach(function (key) {
	                removeClass(scope_Target, options.cssClasses[key]);
	            });
	            while (scope_Target.firstChild) {
	                scope_Target.removeChild(scope_Target.firstChild);
	            }
	            delete scope_Target.noUiSlider;
	        }
	        function getNextStepsForHandle(handleNumber) {
	            var location = scope_Locations[handleNumber];
	            var nearbySteps = scope_Spectrum.getNearbySteps(location);
	            var value = scope_Values[handleNumber];
	            var increment = nearbySteps.thisStep.step;
	            var decrement = null;
	            // If snapped, directly use defined step value
	            if (options.snap) {
	                return [
	                    value - nearbySteps.stepBefore.startValue || null,
	                    nearbySteps.stepAfter.startValue - value || null
	                ];
	            }
	            // If the next value in this step moves into the next step,
	            // the increment is the start of the next step - the current value
	            if (increment !== false) {
	                if (value + increment > nearbySteps.stepAfter.startValue) {
	                    increment = nearbySteps.stepAfter.startValue - value;
	                }
	            }
	            // If the value is beyond the starting point
	            if (value > nearbySteps.thisStep.startValue) {
	                decrement = nearbySteps.thisStep.step;
	            }
	            else if (nearbySteps.stepBefore.step === false) {
	                decrement = false;
	            }
	            // If a handle is at the start of a step, it always steps back into the previous step first
	            else {
	                decrement = value - nearbySteps.stepBefore.highestStep;
	            }
	            // Now, if at the slider edges, there is no in/decrement
	            if (location === 100) {
	                increment = null;
	            }
	            else if (location === 0) {
	                decrement = null;
	            }
	            // As per #391, the comparison for the decrement step can have some rounding issues.
	            var stepDecimals = scope_Spectrum.countStepDecimals();
	            // Round per #391
	            if (increment !== null && increment !== false) {
	                increment = Number(increment.toFixed(stepDecimals));
	            }
	            if (decrement !== null && decrement !== false) {
	                decrement = Number(decrement.toFixed(stepDecimals));
	            }
	            return [decrement, increment];
	        }
	        // Get the current step size for the slider.
	        function getNextSteps() {
	            return scope_HandleNumbers.map(getNextStepsForHandle);
	        }
	        // Updatable: margin, limit, padding, step, range, animate, snap
	        function updateOptions(optionsToUpdate, fireSetEvent) {
	            // Spectrum is created using the range, snap, direction and step options.
	            // 'snap' and 'step' can be updated.
	            // If 'snap' and 'step' are not passed, they should remain unchanged.
	            var v = valueGet();
	            var updateAble = [
	                "margin",
	                "limit",
	                "padding",
	                "range",
	                "animate",
	                "snap",
	                "step",
	                "format",
	                "pips",
	                "tooltips"
	            ];
	            // Only change options that we're actually passed to update.
	            updateAble.forEach(function (name) {
	                // Check for undefined. null removes the value.
	                if (optionsToUpdate[name] !== undefined) {
	                    originalOptions[name] = optionsToUpdate[name];
	                }
	            });
	            var newOptions = testOptions(originalOptions);
	            // Load new options into the slider state
	            updateAble.forEach(function (name) {
	                if (optionsToUpdate[name] !== undefined) {
	                    options[name] = newOptions[name];
	                }
	            });
	            scope_Spectrum = newOptions.spectrum;
	            // Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
	            options.margin = newOptions.margin;
	            options.limit = newOptions.limit;
	            options.padding = newOptions.padding;
	            // Update pips, removes existing.
	            if (options.pips) {
	                pips(options.pips);
	            }
	            else {
	                removePips();
	            }
	            // Update tooltips, removes existing.
	            if (options.tooltips) {
	                tooltips();
	            }
	            else {
	                removeTooltips();
	            }
	            // Invalidate the current positioning so valueSet forces an update.
	            scope_Locations = [];
	            valueSet(isSet(optionsToUpdate.start) ? optionsToUpdate.start : v, fireSetEvent);
	        }
	        // Initialization steps
	        function setupSlider() {
	            // Create the base element, initialize HTML and set classes.
	            // Add handles and connect elements.
	            scope_Base = addSlider(scope_Target);
	            addElements(options.connect, scope_Base);
	            // Attach user events.
	            bindSliderEvents(options.events);
	            // Use the public value method to set the start values.
	            valueSet(options.start);
	            if (options.pips) {
	                pips(options.pips);
	            }
	            if (options.tooltips) {
	                tooltips();
	            }
	            aria();
	        }
	        setupSlider();
	        var scope_Self = {
	            destroy: destroy,
	            steps: getNextSteps,
	            on: bindEvent,
	            off: removeEvent,
	            get: valueGet,
	            set: valueSet,
	            setHandle: valueSetHandle,
	            reset: valueReset,
	            // Exposed for unit testing, don't use this in your application.
	            __moveHandles: function (upward, proposal, handleNumbers) {
	                moveHandles(upward, proposal, scope_Locations, handleNumbers);
	            },
	            options: originalOptions,
	            updateOptions: updateOptions,
	            target: scope_Target,
	            removePips: removePips,
	            removeTooltips: removeTooltips,
	            getPositions: function () {
	                return scope_Locations.slice();
	            },
	            getTooltips: function () {
	                return scope_Tooltips;
	            },
	            getOrigins: function () {
	                return scope_Handles;
	            },
	            pips: pips // Issue #594
	        };
	        return scope_Self;
	    }
	    // Run the standard initializer
	    function initialize(target, originalOptions) {
	        if (!target || !target.nodeName) {
	            throw new Error("noUiSlider: create requires a single element, got: " + target);
	        }
	        // Throw an error if the slider was already initialized.
	        if (target.noUiSlider) {
	            throw new Error("noUiSlider: Slider was already initialized.");
	        }
	        // Test the options and create the slider environment;
	        var options = testOptions(originalOptions);
	        var api = scope(target, options, originalOptions);
	        target.noUiSlider = api;
	        return api;
	    }
	    var nouislider = {
	        // Exposed for unit testing, don't use this in your application.
	        __spectrum: Spectrum,
	        // A reference to the default classes, allows global changes.
	        // Use the cssClasses option for changes to one slider.
	        cssClasses: cssClasses,
	        create: initialize
	    };

	    exports.create = initialize;
	    exports.cssClasses = cssClasses;
	    exports['default'] = nouislider;

	    Object.defineProperty(exports, '__esModule', { value: true });

	})));
	}(nouislider$2, nouislider$2.exports));

	var nouislider = /*@__PURE__*/getDefaultExportFromCjs(nouislider$2.exports);

	var nouislider$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		'default': nouislider
	}, [nouislider$2.exports]));

	var js$1 = {exports: {}};

	var flickity = {exports: {}};

	var evEmitter = {exports: {}};

	/**
	 * EvEmitter v1.1.0
	 * Lil' event emitter
	 * MIT License
	 */

	(function (module) {
	/* jshint unused: true, undef: true, strict: true */

	( function( global, factory ) {
	  // universal module definition
	  /* jshint strict: false */ /* globals define, module, window */
	  if ( module.exports ) {
	    // CommonJS - Browserify, Webpack
	    module.exports = factory();
	  } else {
	    // Browser globals
	    global.EvEmitter = factory();
	  }

	}( typeof window != 'undefined' ? window : commonjsGlobal$1, function() {

	function EvEmitter() {}

	var proto = EvEmitter.prototype;

	proto.on = function( eventName, listener ) {
	  if ( !eventName || !listener ) {
	    return;
	  }
	  // set events hash
	  var events = this._events = this._events || {};
	  // set listeners array
	  var listeners = events[ eventName ] = events[ eventName ] || [];
	  // only add once
	  if ( listeners.indexOf( listener ) == -1 ) {
	    listeners.push( listener );
	  }

	  return this;
	};

	proto.once = function( eventName, listener ) {
	  if ( !eventName || !listener ) {
	    return;
	  }
	  // add event
	  this.on( eventName, listener );
	  // set once flag
	  // set onceEvents hash
	  var onceEvents = this._onceEvents = this._onceEvents || {};
	  // set onceListeners object
	  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
	  // set flag
	  onceListeners[ listener ] = true;

	  return this;
	};

	proto.off = function( eventName, listener ) {
	  var listeners = this._events && this._events[ eventName ];
	  if ( !listeners || !listeners.length ) {
	    return;
	  }
	  var index = listeners.indexOf( listener );
	  if ( index != -1 ) {
	    listeners.splice( index, 1 );
	  }

	  return this;
	};

	proto.emitEvent = function( eventName, args ) {
	  var listeners = this._events && this._events[ eventName ];
	  if ( !listeners || !listeners.length ) {
	    return;
	  }
	  // copy over to avoid interference if .off() in listener
	  listeners = listeners.slice(0);
	  args = args || [];
	  // once stuff
	  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

	  for ( var i=0; i < listeners.length; i++ ) {
	    var listener = listeners[i];
	    var isOnce = onceListeners && onceListeners[ listener ];
	    if ( isOnce ) {
	      // remove listener
	      // remove before trigger to prevent recursion
	      this.off( eventName, listener );
	      // unset once flag
	      delete onceListeners[ listener ];
	    }
	    // trigger listener
	    listener.apply( this, args );
	  }

	  return this;
	};

	proto.allOff = function() {
	  delete this._events;
	  delete this._onceEvents;
	};

	return EvEmitter;

	}));
	}(evEmitter));

	var getSize = {exports: {}};

	/*!
	 * getSize v2.0.3
	 * measure size of elements
	 * MIT license
	 */

	(function (module) {
	/* jshint browser: true, strict: true, undef: true, unused: true */
	/* globals console: false */

	( function( window, factory ) {
	  /* jshint strict: false */ /* globals define, module */
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory();
	  } else {
	    // browser global
	    window.getSize = factory();
	  }

	})( window, function factory() {

	// -------------------------- helpers -------------------------- //

	// get a number from a string, not a percentage
	function getStyleSize( value ) {
	  var num = parseFloat( value );
	  // not a percent like '100%', and a number
	  var isValid = value.indexOf('%') == -1 && !isNaN( num );
	  return isValid && num;
	}

	function noop() {}

	var logError = typeof console == 'undefined' ? noop :
	  function( message ) {
	    console.error( message );
	  };

	// -------------------------- measurements -------------------------- //

	var measurements = [
	  'paddingLeft',
	  'paddingRight',
	  'paddingTop',
	  'paddingBottom',
	  'marginLeft',
	  'marginRight',
	  'marginTop',
	  'marginBottom',
	  'borderLeftWidth',
	  'borderRightWidth',
	  'borderTopWidth',
	  'borderBottomWidth'
	];

	var measurementsLength = measurements.length;

	function getZeroSize() {
	  var size = {
	    width: 0,
	    height: 0,
	    innerWidth: 0,
	    innerHeight: 0,
	    outerWidth: 0,
	    outerHeight: 0
	  };
	  for ( var i=0; i < measurementsLength; i++ ) {
	    var measurement = measurements[i];
	    size[ measurement ] = 0;
	  }
	  return size;
	}

	// -------------------------- getStyle -------------------------- //

	/**
	 * getStyle, get style of element, check for Firefox bug
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	 */
	function getStyle( elem ) {
	  var style = getComputedStyle( elem );
	  if ( !style ) {
	    logError( 'Style returned ' + style +
	      '. Are you running this code in a hidden iframe on Firefox? ' +
	      'See https://bit.ly/getsizebug1' );
	  }
	  return style;
	}

	// -------------------------- setup -------------------------- //

	var isSetup = false;

	var isBoxSizeOuter;

	/**
	 * setup
	 * check isBoxSizerOuter
	 * do on first getSize() rather than on page load for Firefox bug
	 */
	function setup() {
	  // setup once
	  if ( isSetup ) {
	    return;
	  }
	  isSetup = true;

	  // -------------------------- box sizing -------------------------- //

	  /**
	   * Chrome & Safari measure the outer-width on style.width on border-box elems
	   * IE11 & Firefox<29 measures the inner-width
	   */
	  var div = document.createElement('div');
	  div.style.width = '200px';
	  div.style.padding = '1px 2px 3px 4px';
	  div.style.borderStyle = 'solid';
	  div.style.borderWidth = '1px 2px 3px 4px';
	  div.style.boxSizing = 'border-box';

	  var body = document.body || document.documentElement;
	  body.appendChild( div );
	  var style = getStyle( div );
	  // round value for browser zoom. desandro/masonry#928
	  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
	  getSize.isBoxSizeOuter = isBoxSizeOuter;

	  body.removeChild( div );
	}

	// -------------------------- getSize -------------------------- //

	function getSize( elem ) {
	  setup();

	  // use querySeletor if elem is string
	  if ( typeof elem == 'string' ) {
	    elem = document.querySelector( elem );
	  }

	  // do not proceed on non-objects
	  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
	    return;
	  }

	  var style = getStyle( elem );

	  // if hidden, everything is 0
	  if ( style.display == 'none' ) {
	    return getZeroSize();
	  }

	  var size = {};
	  size.width = elem.offsetWidth;
	  size.height = elem.offsetHeight;

	  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

	  // get all measurements
	  for ( var i=0; i < measurementsLength; i++ ) {
	    var measurement = measurements[i];
	    var value = style[ measurement ];
	    var num = parseFloat( value );
	    // any 'auto', 'medium' value will be 0
	    size[ measurement ] = !isNaN( num ) ? num : 0;
	  }

	  var paddingWidth = size.paddingLeft + size.paddingRight;
	  var paddingHeight = size.paddingTop + size.paddingBottom;
	  var marginWidth = size.marginLeft + size.marginRight;
	  var marginHeight = size.marginTop + size.marginBottom;
	  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
	  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

	  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

	  // overwrite width and height if we can get it from style
	  var styleWidth = getStyleSize( style.width );
	  if ( styleWidth !== false ) {
	    size.width = styleWidth +
	      // add padding and border unless it's already including it
	      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
	  }

	  var styleHeight = getStyleSize( style.height );
	  if ( styleHeight !== false ) {
	    size.height = styleHeight +
	      // add padding and border unless it's already including it
	      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
	  }

	  size.innerWidth = size.width - ( paddingWidth + borderWidth );
	  size.innerHeight = size.height - ( paddingHeight + borderHeight );

	  size.outerWidth = size.width + marginWidth;
	  size.outerHeight = size.height + marginHeight;

	  return size;
	}

	return getSize;

	});
	}(getSize));

	var utils = {exports: {}};

	var matchesSelector = {exports: {}};

	/**
	 * matchesSelector v2.0.2
	 * matchesSelector( element, '.selector' )
	 * MIT license
	 */

	(function (module) {
	/*jshint browser: true, strict: true, undef: true, unused: true */

	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory();
	  } else {
	    // browser global
	    window.matchesSelector = factory();
	  }

	}( window, function factory() {

	  var matchesMethod = ( function() {
	    var ElemProto = window.Element.prototype;
	    // check for the standard method name first
	    if ( ElemProto.matches ) {
	      return 'matches';
	    }
	    // check un-prefixed
	    if ( ElemProto.matchesSelector ) {
	      return 'matchesSelector';
	    }
	    // check vendor prefixes
	    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

	    for ( var i=0; i < prefixes.length; i++ ) {
	      var prefix = prefixes[i];
	      var method = prefix + 'MatchesSelector';
	      if ( ElemProto[ method ] ) {
	        return method;
	      }
	    }
	  })();

	  return function matchesSelector( elem, selector ) {
	    return elem[ matchesMethod ]( selector );
	  };

	}));
	}(matchesSelector));

	/**
	 * Fizzy UI utils v2.0.7
	 * MIT license
	 */

	(function (module) {
	/*jshint browser: true, undef: true, unused: true, strict: true */

	( function( window, factory ) {
	  // universal module definition
	  /*jshint strict: false */ /*globals define, module, require */

	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      matchesSelector.exports
	    );
	  } else {
	    // browser global
	    window.fizzyUIUtils = factory(
	      window,
	      window.matchesSelector
	    );
	  }

	}( window, function factory( window, matchesSelector ) {

	var utils = {};

	// ----- extend ----- //

	// extends objects
	utils.extend = function( a, b ) {
	  for ( var prop in b ) {
	    a[ prop ] = b[ prop ];
	  }
	  return a;
	};

	// ----- modulo ----- //

	utils.modulo = function( num, div ) {
	  return ( ( num % div ) + div ) % div;
	};

	// ----- makeArray ----- //

	var arraySlice = Array.prototype.slice;

	// turn element or nodeList into an array
	utils.makeArray = function( obj ) {
	  if ( Array.isArray( obj ) ) {
	    // use object if already an array
	    return obj;
	  }
	  // return empty array if undefined or null. #6
	  if ( obj === null || obj === undefined ) {
	    return [];
	  }

	  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
	  if ( isArrayLike ) {
	    // convert nodeList to array
	    return arraySlice.call( obj );
	  }

	  // array of single index
	  return [ obj ];
	};

	// ----- removeFrom ----- //

	utils.removeFrom = function( ary, obj ) {
	  var index = ary.indexOf( obj );
	  if ( index != -1 ) {
	    ary.splice( index, 1 );
	  }
	};

	// ----- getParent ----- //

	utils.getParent = function( elem, selector ) {
	  while ( elem.parentNode && elem != document.body ) {
	    elem = elem.parentNode;
	    if ( matchesSelector( elem, selector ) ) {
	      return elem;
	    }
	  }
	};

	// ----- getQueryElement ----- //

	// use element as selector string
	utils.getQueryElement = function( elem ) {
	  if ( typeof elem == 'string' ) {
	    return document.querySelector( elem );
	  }
	  return elem;
	};

	// ----- handleEvent ----- //

	// enable .ontype to trigger from .addEventListener( elem, 'type' )
	utils.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	// ----- filterFindElements ----- //

	utils.filterFindElements = function( elems, selector ) {
	  // make array of elems
	  elems = utils.makeArray( elems );
	  var ffElems = [];

	  elems.forEach( function( elem ) {
	    // check that elem is an actual element
	    if ( !( elem instanceof HTMLElement ) ) {
	      return;
	    }
	    // add elem if no selector
	    if ( !selector ) {
	      ffElems.push( elem );
	      return;
	    }
	    // filter & find items if we have a selector
	    // filter
	    if ( matchesSelector( elem, selector ) ) {
	      ffElems.push( elem );
	    }
	    // find children
	    var childElems = elem.querySelectorAll( selector );
	    // concat childElems to filterFound array
	    for ( var i=0; i < childElems.length; i++ ) {
	      ffElems.push( childElems[i] );
	    }
	  });

	  return ffElems;
	};

	// ----- debounceMethod ----- //

	utils.debounceMethod = function( _class, methodName, threshold ) {
	  threshold = threshold || 100;
	  // original method
	  var method = _class.prototype[ methodName ];
	  var timeoutName = methodName + 'Timeout';

	  _class.prototype[ methodName ] = function() {
	    var timeout = this[ timeoutName ];
	    clearTimeout( timeout );

	    var args = arguments;
	    var _this = this;
	    this[ timeoutName ] = setTimeout( function() {
	      method.apply( _this, args );
	      delete _this[ timeoutName ];
	    }, threshold );
	  };
	};

	// ----- docReady ----- //

	utils.docReady = function( callback ) {
	  var readyState = document.readyState;
	  if ( readyState == 'complete' || readyState == 'interactive' ) {
	    // do async to allow for other scripts to run. metafizzy/flickity#441
	    setTimeout( callback );
	  } else {
	    document.addEventListener( 'DOMContentLoaded', callback );
	  }
	};

	// ----- htmlInit ----- //

	// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
	utils.toDashed = function( str ) {
	  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
	    return $1 + '-' + $2;
	  }).toLowerCase();
	};

	var console = window.console;
	/**
	 * allow user to initialize classes via [data-namespace] or .js-namespace class
	 * htmlInit( Widget, 'widgetName' )
	 * options are parsed from data-namespace-options
	 */
	utils.htmlInit = function( WidgetClass, namespace ) {
	  utils.docReady( function() {
	    var dashedNamespace = utils.toDashed( namespace );
	    var dataAttr = 'data-' + dashedNamespace;
	    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
	    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
	    var elems = utils.makeArray( dataAttrElems )
	      .concat( utils.makeArray( jsDashElems ) );
	    var dataOptionsAttr = dataAttr + '-options';
	    var jQuery = window.jQuery;

	    elems.forEach( function( elem ) {
	      var attr = elem.getAttribute( dataAttr ) ||
	        elem.getAttribute( dataOptionsAttr );
	      var options;
	      try {
	        options = attr && JSON.parse( attr );
	      } catch ( error ) {
	        // log error, do not initialize
	        if ( console ) {
	          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
	          ': ' + error );
	        }
	        return;
	      }
	      // initialize
	      var instance = new WidgetClass( elem, options );
	      // make available via $().data('namespace')
	      if ( jQuery ) {
	        jQuery.data( elem, namespace, instance );
	      }
	    });

	  });
	};

	// -----  ----- //

	return utils;

	}));
	}(utils));

	var cell = {exports: {}};

	(function (module) {
	// Flickity.Cell
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        getSize.exports
	    );
	  } else {
	    // browser global
	    window.Flickity = window.Flickity || {};
	    window.Flickity.Cell = factory(
	        window,
	        window.getSize
	    );
	  }

	}( window, function factory( window, getSize ) {

	function Cell( elem, parent ) {
	  this.element = elem;
	  this.parent = parent;

	  this.create();
	}

	var proto = Cell.prototype;

	proto.create = function() {
	  this.element.style.position = 'absolute';
	  this.element.setAttribute( 'aria-hidden', 'true' );
	  this.x = 0;
	  this.shift = 0;
	};

	proto.destroy = function() {
	  // reset style
	  this.unselect();
	  this.element.style.position = '';
	  var side = this.parent.originSide;
	  this.element.style[ side ] = '';
	  this.element.removeAttribute('aria-hidden');
	};

	proto.getSize = function() {
	  this.size = getSize( this.element );
	};

	proto.setPosition = function( x ) {
	  this.x = x;
	  this.updateTarget();
	  this.renderPosition( x );
	};

	// setDefaultTarget v1 method, backwards compatibility, remove in v3
	proto.updateTarget = proto.setDefaultTarget = function() {
	  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
	  this.target = this.x + this.size[ marginProperty ] +
	    this.size.width * this.parent.cellAlign;
	};

	proto.renderPosition = function( x ) {
	  // render position of cell with in slider
	  var side = this.parent.originSide;
	  this.element.style[ side ] = this.parent.getPositionValue( x );
	};

	proto.select = function() {
	  this.element.classList.add('is-selected');
	  this.element.removeAttribute('aria-hidden');
	};

	proto.unselect = function() {
	  this.element.classList.remove('is-selected');
	  this.element.setAttribute( 'aria-hidden', 'true' );
	};

	/**
	 * @param {Integer} shift - 0, 1, or -1
	 */
	proto.wrapShift = function( shift ) {
	  this.shift = shift;
	  this.renderPosition( this.x + this.parent.slideableWidth * shift );
	};

	proto.remove = function() {
	  this.element.parentNode.removeChild( this.element );
	};

	return Cell;

	} ) );
	}(cell));

	var slide = {exports: {}};

	(function (module) {
	// slide
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory();
	  } else {
	    // browser global
	    window.Flickity = window.Flickity || {};
	    window.Flickity.Slide = factory();
	  }

	}( window, function factory() {

	function Slide( parent ) {
	  this.parent = parent;
	  this.isOriginLeft = parent.originSide == 'left';
	  this.cells = [];
	  this.outerWidth = 0;
	  this.height = 0;
	}

	var proto = Slide.prototype;

	proto.addCell = function( cell ) {
	  this.cells.push( cell );
	  this.outerWidth += cell.size.outerWidth;
	  this.height = Math.max( cell.size.outerHeight, this.height );
	  // first cell stuff
	  if ( this.cells.length == 1 ) {
	    this.x = cell.x; // x comes from first cell
	    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
	    this.firstMargin = cell.size[ beginMargin ];
	  }
	};

	proto.updateTarget = function() {
	  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
	  var lastCell = this.getLastCell();
	  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
	  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
	  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
	};

	proto.getLastCell = function() {
	  return this.cells[ this.cells.length - 1 ];
	};

	proto.select = function() {
	  this.parent.checkVisibility();
	  
	  this.cells.forEach( function( cell ) {
	    cell.select();
	  } );
	};

	proto.unselect = function() {
	  this.cells.forEach( function( cell ) {
	    cell.unselect();
	  } );
	};

	proto.getCellElements = function() {
	  return this.cells.map( function( cell ) {
	    return cell.element;
	  } );
	};

	return Slide;

	} ) );
	}(slide));

	var animate = {exports: {}};

	(function (module) {
	// animate
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        utils.exports
	    );
	  } else {
	    // browser global
	    window.Flickity = window.Flickity || {};
	    window.Flickity.animatePrototype = factory(
	        window,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, utils ) {

	// -------------------------- animate -------------------------- //

	var proto = {};

	proto.startAnimation = function() {
	  if ( this.isAnimating ) {
	    return;
	  }

	  this.isAnimating = true;
	  this.restingFrames = 0;
	  this.animate();
	};

	proto.animate = function() {
	  this.applyDragForce();
	  this.applySelectedAttraction();

	  var previousX = this.x;

	  this.integratePhysics();
	  this.positionSlider();
	  this.settle( previousX );
	  // animate next frame
	  if ( this.isAnimating ) {
	    var _this = this;
	    requestAnimationFrame( function animateFrame() {
	      _this.animate();
	    } );
	  }
	};

	proto.positionSlider = function() {
	  var x = this.x;
	  // wrap position around
	  if ( this.options.wrapAround && this.cells.length > 1 ) {
	    x = utils.modulo( x, this.slideableWidth );
	    x -= this.slideableWidth;
	    this.shiftWrapCells( x );
	  }

	  this.setTranslateX( x, this.isAnimating );
	  this.dispatchScrollEvent();
	};

	proto.setTranslateX = function( x, is3d ) {
	  x += this.cursorPosition;
	  // reverse if right-to-left and using transform
	  x = this.options.rightToLeft ? -x : x;
	  var translateX = this.getPositionValue( x );
	  // use 3D transforms for hardware acceleration on iOS
	  // but use 2D when settled, for better font-rendering
	  this.slider.style.transform = is3d ?
	    'translate3d(' + translateX + ',0,0)' : 'translateX(' + translateX + ')';
	};

	proto.dispatchScrollEvent = function() {
	  var firstSlide = this.slides[0];
	  if ( !firstSlide ) {
	    return;
	  }
	  var positionX = -this.x - firstSlide.target;
	  var progress = positionX / this.slidesWidth;
	  this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
	};

	proto.positionSliderAtSelected = function() {
	  if ( !this.cells.length ) {
	    return;
	  }
	  this.x = -this.selectedSlide.target;
	  this.velocity = 0; // stop wobble
	  this.positionSlider();
	};

	proto.getPositionValue = function( position ) {
	  if ( this.options.percentPosition ) {
	    // percent position, round to 2 digits, like 12.34%
	    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 ) + '%';
	  } else {
	    // pixel positioning
	    return Math.round( position ) + 'px';
	  }
	};

	proto.settle = function( previousX ) {
	  // keep track of frames where x hasn't moved
	  var isResting = !this.isPointerDown &&
	      Math.round( this.x * 100 ) == Math.round( previousX * 100 );
	  if ( isResting ) {
	    this.restingFrames++;
	  }
	  // stop animating if resting for 3 or more frames
	  if ( this.restingFrames > 2 ) {
	    this.isAnimating = false;
	    delete this.isFreeScrolling;
	    // render position with translateX when settled
	    this.positionSlider();
	    this.dispatchEvent( 'settle', null, [ this.selectedIndex ] );
	  }

	  this.checkVisibility();
	};

	proto.shiftWrapCells = function( x ) {
	  // shift before cells
	  var beforeGap = this.cursorPosition + x;
	  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
	  // shift after cells
	  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
	  this._shiftCells( this.afterShiftCells, afterGap, 1 );
	};

	proto._shiftCells = function( cells, gap, shift ) {
	  for ( var i = 0; i < cells.length; i++ ) {
	    var cell = cells[i];
	    var cellShift = gap > 0 ? shift : 0;
	    cell.wrapShift( cellShift );
	    gap -= cell.size.outerWidth;
	  }
	};

	proto._unshiftCells = function( cells ) {
	  if ( !cells || !cells.length ) {
	    return;
	  }
	  for ( var i = 0; i < cells.length; i++ ) {
	    cells[i].wrapShift( 0 );
	  }
	};

	// -------------------------- physics -------------------------- //

	proto.integratePhysics = function() {
	  this.x += this.velocity;
	  this.velocity *= this.getFrictionFactor();
	};

	proto.applyForce = function( force ) {
	  this.velocity += force;
	};

	proto.getFrictionFactor = function() {
	  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
	};

	proto.getRestingPosition = function() {
	  // my thanks to Steven Wittens, who simplified this math greatly
	  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
	};

	proto.applyDragForce = function() {
	  if ( !this.isDraggable || !this.isPointerDown ) {
	    return;
	  }
	  // change the position to drag position by applying force
	  var dragVelocity = this.dragX - this.x;
	  var dragForce = dragVelocity - this.velocity;
	  this.applyForce( dragForce );
	};

	proto.applySelectedAttraction = function() {
	  // do not attract if pointer down or no slides
	  var dragDown = this.isDraggable && this.isPointerDown;
	  if ( dragDown || this.isFreeScrolling || !this.slides.length ) {
	    return;
	  }
	  var distance = this.selectedSlide.target * -1 - this.x;
	  var force = distance * this.options.selectedAttraction;
	  this.applyForce( force );
	};

	return proto;

	} ) );
	}(animate));

	(function (module) {
	// Flickity main
	/* eslint-disable max-params */
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        evEmitter.exports,
	        getSize.exports,
	        utils.exports,
	        cell.exports,
	        slide.exports,
	        animate.exports
	    );
	  } else {
	    // browser global
	    var _Flickity = window.Flickity;

	    window.Flickity = factory(
	        window,
	        window.EvEmitter,
	        window.getSize,
	        window.fizzyUIUtils,
	        _Flickity.Cell,
	        _Flickity.Slide,
	        _Flickity.animatePrototype
	    );
	  }

	}( window, function factory( window, EvEmitter, getSize,
	    utils, Cell, Slide, animatePrototype ) {

	// vars
	var jQuery = window.jQuery;
	var getComputedStyle = window.getComputedStyle;
	var console = window.console;

	function moveElements( elems, toElem ) {
	  elems = utils.makeArray( elems );
	  while ( elems.length ) {
	    toElem.appendChild( elems.shift() );
	  }
	}

	// -------------------------- Flickity -------------------------- //

	// globally unique identifiers
	var GUID = 0;
	// internal store of all Flickity intances
	var instances = {};

	function Flickity( element, options ) {
	  var queryElement = utils.getQueryElement( element );
	  if ( !queryElement ) {
	    if ( console ) {
	      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
	    }
	    return;
	  }
	  this.element = queryElement;
	  // do not initialize twice on same element
	  if ( this.element.flickityGUID ) {
	    var instance = instances[ this.element.flickityGUID ];
	    if ( instance ) instance.option( options );
	    return instance;
	  }

	  // add jQuery
	  if ( jQuery ) {
	    this.$element = jQuery( this.element );
	  }
	  // options
	  this.options = utils.extend( {}, this.constructor.defaults );
	  this.option( options );

	  // kick things off
	  this._create();
	}

	Flickity.defaults = {
	  accessibility: true,
	  // adaptiveHeight: false,
	  cellAlign: 'center',
	  // cellSelector: undefined,
	  // contain: false,
	  freeScrollFriction: 0.075, // friction when free-scrolling
	  friction: 0.28, // friction when selecting
	  namespaceJQueryEvents: true,
	  // initialIndex: 0,
	  percentPosition: true,
	  resize: true,
	  selectedAttraction: 0.025,
	  setGallerySize: true,
	  // watchCSS: false,
	  // wrapAround: false
	};

	// hash of methods triggered on _create()
	Flickity.createMethods = [];

	var proto = Flickity.prototype;
	// inherit EventEmitter
	utils.extend( proto, EvEmitter.prototype );

	proto._create = function() {
	  // add id for Flickity.data
	  var id = this.guid = ++GUID;
	  this.element.flickityGUID = id; // expando
	  instances[ id ] = this; // associate via id
	  // initial properties
	  this.selectedIndex = 0;
	  // how many frames slider has been in same position
	  this.restingFrames = 0;
	  // initial physics properties
	  this.x = 0;
	  this.velocity = 0;
	  this.originSide = this.options.rightToLeft ? 'right' : 'left';
	  // create viewport & slider
	  this.viewport = document.createElement('div');
	  this.viewport.className = 'flickity-viewport';
	  this._createSlider();

	  if ( this.options.resize || this.options.watchCSS ) {
	    window.addEventListener( 'resize', this );
	  }

	  // add listeners from on option
	  for ( var eventName in this.options.on ) {
	    var listener = this.options.on[ eventName ];
	    this.on( eventName, listener );
	  }

	  Flickity.createMethods.forEach( function( method ) {
	    this[ method ]();
	  }, this );

	  if ( this.options.watchCSS ) {
	    this.watchCSS();
	  } else {
	    this.activate();
	  }

	};

	/**
	 * set options
	 * @param {Object} opts - options to extend
	 */
	proto.option = function( opts ) {
	  utils.extend( this.options, opts );
	};

	proto.activate = function() {
	  if ( this.isActive ) {
	    return;
	  }
	  this.isActive = true;
	  this.element.classList.add('flickity-enabled');
	  if ( this.options.rightToLeft ) {
	    this.element.classList.add('flickity-rtl');
	  }

	  this.getSize();
	  // move initial cell elements so they can be loaded as cells
	  var cellElems = this._filterFindCellElements( this.element.children );
	  moveElements( cellElems, this.slider );
	  this.viewport.appendChild( this.slider );
	  this.element.appendChild( this.viewport );
	  // get cells from children
	  this.reloadCells();

	  if ( this.options.accessibility ) {
	    // allow element to focusable
	    this.element.tabIndex = 0;
	    // listen for key presses
	    this.element.addEventListener( 'keydown', this );
	  }

	  this.emitEvent('activate');
	  this.selectInitialIndex();
	  // flag for initial activation, for using initialIndex
	  this.isInitActivated = true;
	  // ready event. #493
	  this.dispatchEvent('ready');
	};

	// slider positions the cells
	proto._createSlider = function() {
	  // slider element does all the positioning
	  var slider = document.createElement('div');
	  slider.className = 'flickity-slider';
	  slider.style[ this.originSide ] = 0;
	  this.slider = slider;
	};

	proto._filterFindCellElements = function( elems ) {
	  return utils.filterFindElements( elems, this.options.cellSelector );
	};

	// goes through all children
	proto.reloadCells = function() {
	  // collection of item elements
	  this.cells = this._makeCells( this.slider.children );
	  this.positionCells();
	  this._getWrapShiftCells();
	  this.setGallerySize();
	};

	/**
	 * turn elements into Flickity.Cells
	 * @param {[Array, NodeList, HTMLElement]} elems - elements to make into cells
	 * @returns {Array} items - collection of new Flickity Cells
	 */
	proto._makeCells = function( elems ) {
	  var cellElems = this._filterFindCellElements( elems );

	  // create new Flickity for collection
	  var cells = cellElems.map( function( cellElem ) {
	    return new Cell( cellElem, this );
	  }, this );

	  return cells;
	};

	proto.getLastCell = function() {
	  return this.cells[ this.cells.length - 1 ];
	};

	proto.getLastSlide = function() {
	  return this.slides[ this.slides.length - 1 ];
	};

	// positions all cells
	proto.positionCells = function() {
	  // size all cells
	  this._sizeCells( this.cells );
	  // position all cells
	  this._positionCells( 0 );
	};

	/**
	 * position certain cells
	 * @param {Integer} index - which cell to start with
	 */
	proto._positionCells = function( index ) {
	  index = index || 0;
	  // also measure maxCellHeight
	  // start 0 if positioning all cells
	  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
	  var cellX = 0;
	  // get cellX
	  if ( index > 0 ) {
	    var startCell = this.cells[ index - 1 ];
	    cellX = startCell.x + startCell.size.outerWidth;
	  }
	  var len = this.cells.length;
	  for ( var i = index; i < len; i++ ) {
	    var cell = this.cells[i];
	    cell.setPosition( cellX );
	    cellX += cell.size.outerWidth;
	    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
	  }
	  // keep track of cellX for wrap-around
	  this.slideableWidth = cellX;
	  // slides
	  this.updateSlides();
	  // contain slides target
	  this._containSlides();
	  // update slidesWidth
	  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
	};

	/**
	 * cell.getSize() on multiple cells
	 * @param {Array} cells - cells to size
	 */
	proto._sizeCells = function( cells ) {
	  cells.forEach( function( cell ) {
	    cell.getSize();
	  } );
	};

	// --------------------------  -------------------------- //

	proto.updateSlides = function() {
	  this.slides = [];
	  if ( !this.cells.length ) {
	    return;
	  }

	  var slide = new Slide( this );
	  this.slides.push( slide );
	  var isOriginLeft = this.originSide == 'left';
	  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

	  var canCellFit = this._getCanCellFit();

	  this.cells.forEach( function( cell, i ) {
	    // just add cell if first cell in slide
	    if ( !slide.cells.length ) {
	      slide.addCell( cell );
	      return;
	    }

	    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
	      ( cell.size.outerWidth - cell.size[ nextMargin ] );

	    if ( canCellFit.call( this, i, slideWidth ) ) {
	      slide.addCell( cell );
	    } else {
	      // doesn't fit, new slide
	      slide.updateTarget();

	      slide = new Slide( this );
	      this.slides.push( slide );
	      slide.addCell( cell );
	    }
	  }, this );
	  // last slide
	  slide.updateTarget();
	  // update .selectedSlide
	  this.updateSelectedSlide();
	};

	proto._getCanCellFit = function() {
	  var groupCells = this.options.groupCells;
	  if ( !groupCells ) {
	    return function() {
	      return false;
	    };
	  } else if ( typeof groupCells == 'number' ) {
	    // group by number. 3 -> [0,1,2], [3,4,5], ...
	    var number = parseInt( groupCells, 10 );
	    return function( i ) {
	      return ( i % number ) !== 0;
	    };
	  }
	  // default, group by width of slide
	  // parse '75%
	  var percentMatch = typeof groupCells == 'string' &&
	    groupCells.match( /^(\d+)%$/ );
	  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
	  return function( i, slideWidth ) {
	    /* eslint-disable-next-line no-invalid-this */
	    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
	  };
	};

	// alias _init for jQuery plugin .flickity()
	proto._init =
	proto.reposition = function() {
	  this.positionCells();
	  this.positionSliderAtSelected();
	};

	proto.getSize = function() {
	  this.size = getSize( this.element );
	  this.setCellAlign();
	  this.cursorPosition = this.size.innerWidth * this.cellAlign;
	};

	var cellAlignShorthands = {
	  // cell align, then based on origin side
	  center: {
	    left: 0.5,
	    right: 0.5,
	  },
	  left: {
	    left: 0,
	    right: 1,
	  },
	  right: {
	    right: 0,
	    left: 1,
	  },
	};

	proto.setCellAlign = function() {
	  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
	  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
	};

	proto.setGallerySize = function() {
	  if ( this.options.setGallerySize ) {
	    var height = this.options.adaptiveHeight && this.selectedSlide ?
	      this.selectedSlide.height : this.maxCellHeight;
	    this.viewport.style.height = height + 'px';
	  }
	};

	proto._getWrapShiftCells = function() {
	  // only for wrap-around
	  if ( !this.options.wrapAround ) {
	    return;
	  }
	  // unshift previous cells
	  this._unshiftCells( this.beforeShiftCells );
	  this._unshiftCells( this.afterShiftCells );
	  // get before cells
	  // initial gap
	  var gapX = this.cursorPosition;
	  var cellIndex = this.cells.length - 1;
	  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
	  // get after cells
	  // ending gap between last cell and end of gallery viewport
	  gapX = this.size.innerWidth - this.cursorPosition;
	  // start cloning at first cell, working forwards
	  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
	};

	proto._getGapCells = function( gapX, cellIndex, increment ) {
	  // keep adding cells until the cover the initial gap
	  var cells = [];
	  while ( gapX > 0 ) {
	    var cell = this.cells[ cellIndex ];
	    if ( !cell ) {
	      break;
	    }
	    cells.push( cell );
	    cellIndex += increment;
	    gapX -= cell.size.outerWidth;
	  }
	  return cells;
	};

	// ----- contain ----- //

	// contain cell targets so no excess sliding
	proto._containSlides = function() {
	  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
	    return;
	  }
	  var isRightToLeft = this.options.rightToLeft;
	  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
	  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
	  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
	  // content is less than gallery size
	  var isContentSmaller = contentWidth < this.size.innerWidth;
	  // bounds
	  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
	  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
	  // contain each cell target
	  this.slides.forEach( function( slide ) {
	    if ( isContentSmaller ) {
	      // all cells fit inside gallery
	      slide.target = contentWidth * this.cellAlign;
	    } else {
	      // contain to bounds
	      slide.target = Math.max( slide.target, beginBound );
	      slide.target = Math.min( slide.target, endBound );
	    }
	  }, this );
	};

	// -----  ----- //

	/**
	 * emits events via eventEmitter and jQuery events
	 * @param {String} type - name of event
	 * @param {Event} event - original event
	 * @param {Array} args - extra arguments
	 */
	proto.dispatchEvent = function( type, event, args ) {
	  var emitArgs = event ? [ event ].concat( args ) : args;
	  this.emitEvent( type, emitArgs );

	  if ( jQuery && this.$element ) {
	    // default trigger with type if no event
	    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
	    var $event = type;
	    if ( event ) {
	      // create jQuery event
	      var jQEvent = new jQuery.Event( event );
	      jQEvent.type = type;
	      $event = jQEvent;
	    }
	    this.$element.trigger( $event, args );
	  }
	};

	// -------------------------- select -------------------------- //

	/**
	 * @param {Integer} index - index of the slide
	 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
	 * @param {Boolean} isInstant - will immediately set position at selected cell
	 */
	proto.select = function( index, isWrap, isInstant ) {
	  if ( !this.isActive ) {
	    return;
	  }
	  index = parseInt( index, 10 );
	  this._wrapSelect( index );

	  if ( this.options.wrapAround || isWrap ) {
	    index = utils.modulo( index, this.slides.length );
	  }
	  // bail if invalid index
	  if ( !this.slides[ index ] ) {
	    return;
	  }
	  var prevIndex = this.selectedIndex;
	  this.selectedIndex = index;
	  this.updateSelectedSlide();
	  if ( isInstant ) {
	    this.positionSliderAtSelected();
	  } else {
	    this.startAnimation();
	  }
	  if ( this.options.adaptiveHeight ) {
	    this.setGallerySize();
	  }
	  // events
	  this.dispatchEvent( 'select', null, [ index ] );
	  // change event if new index
	  if ( index != prevIndex ) {
	    this.dispatchEvent( 'change', null, [ index ] );
	  }
	  // old v1 event name, remove in v3
	  this.dispatchEvent('cellSelect');
	};

	// wraps position for wrapAround, to move to closest slide. #113
	proto._wrapSelect = function( index ) {
	  var len = this.slides.length;
	  var isWrapping = this.options.wrapAround && len > 1;
	  if ( !isWrapping ) {
	    return index;
	  }
	  var wrapIndex = utils.modulo( index, len );
	  // go to shortest
	  var delta = Math.abs( wrapIndex - this.selectedIndex );
	  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
	  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
	  if ( !this.isDragSelect && backWrapDelta < delta ) {
	    index += len;
	  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
	    index -= len;
	  }
	  // wrap position so slider is within normal area
	  if ( index < 0 ) {
	    this.x -= this.slideableWidth;
	  } else if ( index >= len ) {
	    this.x += this.slideableWidth;
	  }
	};

	proto.previous = function( isWrap, isInstant ) {
	  this.select( this.selectedIndex - 1, isWrap, isInstant );
	};

	proto.next = function( isWrap, isInstant ) {
	  this.select( this.selectedIndex + 1, isWrap, isInstant );
	};

	proto.updateSelectedSlide = function() {
	  var slide = this.slides[ this.selectedIndex ];
	  // selectedIndex could be outside of slides, if triggered before resize()
	  if ( !slide ) {
	    return;
	  }
	  // unselect previous selected slide
	  this.unselectSelectedSlide();
	  // update new selected slide
	  this.selectedSlide = slide;
	  slide.select();
	  this.selectedCells = slide.cells;
	  this.selectedElements = slide.getCellElements();
	  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
	  // Remove in v3?
	  this.selectedCell = slide.cells[0];
	  this.selectedElement = this.selectedElements[0];
	};

	proto.unselectSelectedSlide = function() {
	  if ( this.selectedSlide ) {
	    this.selectedSlide.unselect();
	  }
	};

	proto.selectInitialIndex = function() {
	  var initialIndex = this.options.initialIndex;
	  // already activated, select previous selectedIndex
	  if ( this.isInitActivated ) {
	    this.select( this.selectedIndex, false, true );
	    return;
	  }
	  // select with selector string
	  if ( initialIndex && typeof initialIndex == 'string' ) {
	    var cell = this.queryCell( initialIndex );
	    if ( cell ) {
	      this.selectCell( initialIndex, false, true );
	      return;
	    }
	  }

	  var index = 0;
	  // select with number
	  if ( initialIndex && this.slides[ initialIndex ] ) {
	    index = initialIndex;
	  }
	  // select instantly
	  this.select( index, false, true );
	};

	/**
	 * select slide from number or cell element
	 * @param {[Element, Number]} value - zero-based index or element to select
	 * @param {Boolean} isWrap - enables wrapping around for extra index
	 * @param {Boolean} isInstant - disables slide animation
	 */
	proto.selectCell = function( value, isWrap, isInstant ) {
	  // get cell
	  var cell = this.queryCell( value );
	  if ( !cell ) {
	    return;
	  }

	  var index = this.getCellSlideIndex( cell );
	  this.select( index, isWrap, isInstant );
	};

	proto.getCellSlideIndex = function( cell ) {
	  // get index of slides that has cell
	  for ( var i = 0; i < this.slides.length; i++ ) {
	    var slide = this.slides[i];
	    var index = slide.cells.indexOf( cell );
	    if ( index != -1 ) {
	      return i;
	    }
	  }
	};

	// -------------------------- get cells -------------------------- //

	/**
	 * get Flickity.Cell, given an Element
	 * @param {Element} elem - matching cell element
	 * @returns {Flickity.Cell} cell - matching cell
	 */
	proto.getCell = function( elem ) {
	  // loop through cells to get the one that matches
	  for ( var i = 0; i < this.cells.length; i++ ) {
	    var cell = this.cells[i];
	    if ( cell.element == elem ) {
	      return cell;
	    }
	  }
	};

	/**
	 * get collection of Flickity.Cells, given Elements
	 * @param {[Element, Array, NodeList]} elems - multiple elements
	 * @returns {Array} cells - Flickity.Cells
	 */
	proto.getCells = function( elems ) {
	  elems = utils.makeArray( elems );
	  var cells = [];
	  elems.forEach( function( elem ) {
	    var cell = this.getCell( elem );
	    if ( cell ) {
	      cells.push( cell );
	    }
	  }, this );
	  return cells;
	};

	/**
	 * get cell elements
	 * @returns {Array} cellElems
	 */
	proto.getCellElements = function() {
	  return this.cells.map( function( cell ) {
	    return cell.element;
	  } );
	};

	/**
	 * get parent cell from an element
	 * @param {Element} elem - child element
	 * @returns {Flickit.Cell} cell - parent cell
	 */
	proto.getParentCell = function( elem ) {
	  // first check if elem is cell
	  var cell = this.getCell( elem );
	  if ( cell ) {
	    return cell;
	  }
	  // try to get parent cell elem
	  elem = utils.getParent( elem, '.flickity-slider > *' );
	  return this.getCell( elem );
	};

	/**
	 * get cells adjacent to a slide
	 * @param {Integer} adjCount - number of adjacent slides
	 * @param {Integer} index - index of slide to start
	 * @returns {Array} cells - array of Flickity.Cells
	 */
	proto.getAdjacentCellElements = function( adjCount, index ) {
	  if ( !adjCount ) {
	    return this.selectedSlide.getCellElements();
	  }
	  index = index === undefined ? this.selectedIndex : index;

	  var len = this.slides.length;
	  if ( 1 + ( adjCount * 2 ) >= len ) {
	    return this.getCellElements();
	  }

	  var cellElems = [];
	  for ( var i = index - adjCount; i <= index + adjCount; i++ ) {
	    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
	    var slide = this.slides[ slideIndex ];
	    if ( slide ) {
	      cellElems = cellElems.concat( slide.getCellElements() );
	    }
	  }
	  return cellElems;
	};

	/**
	 * select slide from number or cell element
	 * @param {[Element, String, Number]} selector - element, selector string, or index
	 * @returns {Flickity.Cell} - matching cell
	 */
	proto.queryCell = function( selector ) {
	  if ( typeof selector == 'number' ) {
	    // use number as index
	    return this.cells[ selector ];
	  }
	  if ( typeof selector == 'string' ) {
	    // do not select invalid selectors from hash: #123, #/. #791
	    if ( selector.match( /^[#.]?[\d/]/ ) ) {
	      return;
	    }
	    // use string as selector, get element
	    selector = this.element.querySelector( selector );
	  }
	  // get cell from element
	  return this.getCell( selector );
	};

	proto.checkVisibility = function() {
	  var viewportX = this.viewport.getBoundingClientRect().x;
	  var viewportWidth = this.viewport.offsetWidth;

	  // Lorenza pulls content that should be out of the viewport in to
	  // force slides on either side of the viewport. We need to offset
	  // the viewport by the maximum amount it can be pulled in 4px.
	  if (this.options.wrapAround) {
	    viewportWidth = viewportWidth - 4;
	  }

	  this.cells.forEach(function (cell) {
	    var cellX = cell.element.getBoundingClientRect().x - viewportX;
	    var isVisible = (
	        (cellX > -1 && cellX < 1) ||
	        (cellX + cell.size.innerWidth > viewportX) && (cellX + cell.size.innerWidth < viewportWidth) ||
	        (cellX > viewportX) && (cellX < viewportWidth)
	    );

	    if (isVisible) {
	      cell.element.classList.add('is-visible');
	      cell.element.removeAttribute('aria-hidden');
	      const targetable =  cell.element.querySelectorAll('button, a');

	      targetable.forEach(target => target.tabIndex = 0);

	    } else {
	      cell.element.classList.remove('is-visible');
	      cell.element.setAttribute('aria-hidden', true);
	      const targetable =  cell.element.querySelectorAll('button, a');

	      targetable.forEach(target => target.tabIndex = -1);
	    }
	  });
	};

	// -------------------------- events -------------------------- //

	proto.uiChange = function() {
	  this.emitEvent('uiChange');
	};

	// keep focus on element when child UI elements are clicked
	proto.childUIPointerDown = function( event ) {
	  // HACK iOS does not allow touch events to bubble up?!
	  if ( event.type != 'touchstart' ) {
	    event.preventDefault();
	  }
	  this.focus();
	};

	// ----- resize ----- //

	proto.onresize = function() {
	  this.watchCSS();
	  this.resize();
	};

	utils.debounceMethod( Flickity, 'onresize', 150 );

	proto.resize = function() {
	  if ( !this.isActive ) {
	    return;
	  }
	  this.getSize();
	  // wrap values
	  if ( this.options.wrapAround ) {
	    this.x = utils.modulo( this.x, this.slideableWidth );
	  }
	  this.positionCells();
	  this._getWrapShiftCells();
	  this.setGallerySize();
	  this.emitEvent('resize');
	  // update selected index for group slides, instant
	  // TODO: position can be lost between groups of various numbers
	  var selectedElement = this.selectedElements && this.selectedElements[0];
	  this.selectCell( selectedElement, false, true );
	};

	// watches the :after property, activates/deactivates
	proto.watchCSS = function() {
	  var watchOption = this.options.watchCSS;
	  if ( !watchOption ) {
	    return;
	  }

	  var afterContent = getComputedStyle( this.element, ':after' ).content;
	  // activate if :after { content: 'flickity' }
	  if ( afterContent.indexOf('flickity') != -1 ) {
	    this.activate();
	  } else {
	    this.deactivate();
	  }
	};

	// ----- keydown ----- //

	// go previous/next if left/right keys pressed
	proto.onkeydown = function( event ) {
	  // only work if element is in focus
	  var isNotFocused = document.activeElement && document.activeElement != this.element;
	  if ( !this.options.accessibility || isNotFocused ) {
	    return;
	  }

	  var handler = Flickity.keyboardHandlers[ event.keyCode ];
	  if ( handler ) {
	    handler.call( this );
	  }
	};

	Flickity.keyboardHandlers = {
	  // left arrow
	  37: function() {
	    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
	    this.uiChange();
	    this[ leftMethod ]();
	  },
	  // right arrow
	  39: function() {
	    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
	    this.uiChange();
	    this[ rightMethod ]();
	  },
	};

	// ----- focus ----- //

	proto.focus = function() {
	  // TODO remove scrollTo once focus options gets more support
	  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus ...
	  //    #Browser_compatibility
	  var prevScrollY = window.pageYOffset;
	  this.element.focus({ preventScroll: true });
	  // hack to fix scroll jump after focus, #76
	  if ( window.pageYOffset != prevScrollY ) {
	    window.scrollTo( window.pageXOffset, prevScrollY );
	  }
	};

	// -------------------------- destroy -------------------------- //

	// deactivate all Flickity functionality, but keep stuff available
	proto.deactivate = function() {
	  if ( !this.isActive ) {
	    return;
	  }
	  this.element.classList.remove('flickity-enabled');
	  this.element.classList.remove('flickity-rtl');
	  this.unselectSelectedSlide();
	  // destroy cells
	  this.cells.forEach( function( cell ) {
	    cell.destroy();
	  } );
	  this.element.removeChild( this.viewport );
	  // move child elements back into element
	  moveElements( this.slider.children, this.element );
	  if ( this.options.accessibility ) {
	    this.element.removeAttribute('tabIndex');
	    this.element.removeEventListener( 'keydown', this );
	  }
	  // set flags
	  this.isActive = false;
	  this.emitEvent('deactivate');
	};

	proto.destroy = function() {
	  this.deactivate();
	  window.removeEventListener( 'resize', this );
	  this.allOff();
	  this.emitEvent('destroy');
	  if ( jQuery && this.$element ) {
	    jQuery.removeData( this.element, 'flickity' );
	  }
	  delete this.element.flickityGUID;
	  delete instances[ this.guid ];
	};

	// -------------------------- prototype -------------------------- //

	utils.extend( proto, animatePrototype );

	// -------------------------- extras -------------------------- //

	/**
	 * get Flickity instance from element
	 * @param {[Element, String]} elem - element or selector string
	 * @returns {Flickity} - Flickity instance
	 */
	Flickity.data = function( elem ) {
	  elem = utils.getQueryElement( elem );
	  var id = elem && elem.flickityGUID;
	  return id && instances[ id ];
	};

	utils.htmlInit( Flickity, 'flickity' );

	if ( jQuery && jQuery.bridget ) {
	  jQuery.bridget( 'flickity', Flickity );
	}

	// set internal jQuery, for Webpack + jQuery v3, #478
	Flickity.setJQuery = function( jq ) {
	  jQuery = jq;
	};

	Flickity.Cell = Cell;
	Flickity.Slide = Slide;

	return Flickity;

	} ) );
	}(flickity));

	var drag = {exports: {}};

	var unidragger = {exports: {}};

	var unipointer = {exports: {}};

	/*!
	 * Unipointer v2.4.0
	 * base class for doing one thing with pointer event
	 * MIT license
	 */

	(function (module) {
	/*jshint browser: true, undef: true, unused: true, strict: true */

	( function( window, factory ) {
	  // universal module definition
	  /* jshint strict: false */ /*global define, module, require */
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      evEmitter.exports
	    );
	  } else {
	    // browser global
	    window.Unipointer = factory(
	      window,
	      window.EvEmitter
	    );
	  }

	}( window, function factory( window, EvEmitter ) {

	function noop() {}

	function Unipointer() {}

	// inherit EvEmitter
	var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

	proto.bindStartEvent = function( elem ) {
	  this._bindStartEvent( elem, true );
	};

	proto.unbindStartEvent = function( elem ) {
	  this._bindStartEvent( elem, false );
	};

	/**
	 * Add or remove start event
	 * @param {Boolean} isAdd - remove if falsey
	 */
	proto._bindStartEvent = function( elem, isAdd ) {
	  // munge isAdd, default to true
	  isAdd = isAdd === undefined ? true : isAdd;
	  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

	  // default to mouse events
	  var startEvent = 'mousedown';
	  if ( 'ontouchstart' in window ) {
	    // HACK prefer Touch Events as you can preventDefault on touchstart to
	    // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
	    startEvent = 'touchstart';
	  } else if ( window.PointerEvent ) {
	    // Pointer Events
	    startEvent = 'pointerdown';
	  }
	  elem[ bindMethod ]( startEvent, this );
	};

	// trigger handler methods for events
	proto.handleEvent = function( event ) {
	  var method = 'on' + event.type;
	  if ( this[ method ] ) {
	    this[ method ]( event );
	  }
	};

	// returns the touch that we're keeping track of
	proto.getTouch = function( touches ) {
	  for ( var i=0; i < touches.length; i++ ) {
	    var touch = touches[i];
	    if ( touch.identifier == this.pointerIdentifier ) {
	      return touch;
	    }
	  }
	};

	// ----- start event ----- //

	proto.onmousedown = function( event ) {
	  // dismiss clicks from right or middle buttons
	  var button = event.button;
	  if ( button && ( button !== 0 && button !== 1 ) ) {
	    return;
	  }
	  this._pointerDown( event, event );
	};

	proto.ontouchstart = function( event ) {
	  this._pointerDown( event, event.changedTouches[0] );
	};

	proto.onpointerdown = function( event ) {
	  this._pointerDown( event, event );
	};

	/**
	 * pointer start
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto._pointerDown = function( event, pointer ) {
	  // dismiss right click and other pointers
	  // button = 0 is okay, 1-4 not
	  if ( event.button || this.isPointerDown ) {
	    return;
	  }

	  this.isPointerDown = true;
	  // save pointer identifier to match up touch events
	  this.pointerIdentifier = pointer.pointerId !== undefined ?
	    // pointerId for pointer events, touch.indentifier for touch events
	    pointer.pointerId : pointer.identifier;

	  this.pointerDown( event, pointer );
	};

	proto.pointerDown = function( event, pointer ) {
	  this._bindPostStartEvents( event );
	  this.emitEvent( 'pointerDown', [ event, pointer ] );
	};

	// hash of events to be bound after start event
	var postStartEvents = {
	  mousedown: [ 'mousemove', 'mouseup' ],
	  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
	  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
	};

	proto._bindPostStartEvents = function( event ) {
	  if ( !event ) {
	    return;
	  }
	  // get proper events to match start event
	  var events = postStartEvents[ event.type ];
	  // bind events to node
	  events.forEach( function( eventName ) {
	    window.addEventListener( eventName, this );
	  }, this );
	  // save these arguments
	  this._boundPointerEvents = events;
	};

	proto._unbindPostStartEvents = function() {
	  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
	  if ( !this._boundPointerEvents ) {
	    return;
	  }
	  this._boundPointerEvents.forEach( function( eventName ) {
	    window.removeEventListener( eventName, this );
	  }, this );

	  delete this._boundPointerEvents;
	};

	// ----- move event ----- //

	proto.onmousemove = function( event ) {
	  this._pointerMove( event, event );
	};

	proto.onpointermove = function( event ) {
	  if ( event.pointerId == this.pointerIdentifier ) {
	    this._pointerMove( event, event );
	  }
	};

	proto.ontouchmove = function( event ) {
	  var touch = this.getTouch( event.changedTouches );
	  if ( touch ) {
	    this._pointerMove( event, touch );
	  }
	};

	/**
	 * pointer move
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerMove = function( event, pointer ) {
	  this.pointerMove( event, pointer );
	};

	// public
	proto.pointerMove = function( event, pointer ) {
	  this.emitEvent( 'pointerMove', [ event, pointer ] );
	};

	// ----- end event ----- //


	proto.onmouseup = function( event ) {
	  this._pointerUp( event, event );
	};

	proto.onpointerup = function( event ) {
	  if ( event.pointerId == this.pointerIdentifier ) {
	    this._pointerUp( event, event );
	  }
	};

	proto.ontouchend = function( event ) {
	  var touch = this.getTouch( event.changedTouches );
	  if ( touch ) {
	    this._pointerUp( event, touch );
	  }
	};

	/**
	 * pointer up
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerUp = function( event, pointer ) {
	  this._pointerDone();
	  this.pointerUp( event, pointer );
	};

	// public
	proto.pointerUp = function( event, pointer ) {
	  this.emitEvent( 'pointerUp', [ event, pointer ] );
	};

	// ----- pointer done ----- //

	// triggered on pointer up & pointer cancel
	proto._pointerDone = function() {
	  this._pointerReset();
	  this._unbindPostStartEvents();
	  this.pointerDone();
	};

	proto._pointerReset = function() {
	  // reset properties
	  this.isPointerDown = false;
	  delete this.pointerIdentifier;
	};

	proto.pointerDone = noop;

	// ----- pointer cancel ----- //

	proto.onpointercancel = function( event ) {
	  if ( event.pointerId == this.pointerIdentifier ) {
	    this._pointerCancel( event, event );
	  }
	};

	proto.ontouchcancel = function( event ) {
	  var touch = this.getTouch( event.changedTouches );
	  if ( touch ) {
	    this._pointerCancel( event, touch );
	  }
	};

	/**
	 * pointer cancel
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 * @private
	 */
	proto._pointerCancel = function( event, pointer ) {
	  this._pointerDone();
	  this.pointerCancel( event, pointer );
	};

	// public
	proto.pointerCancel = function( event, pointer ) {
	  this.emitEvent( 'pointerCancel', [ event, pointer ] );
	};

	// -----  ----- //

	// utility function for getting x/y coords from event
	Unipointer.getPointerPoint = function( pointer ) {
	  return {
	    x: pointer.pageX,
	    y: pointer.pageY
	  };
	};

	// -----  ----- //

	return Unipointer;

	}));
	}(unipointer));

	/*!
	 * Unidragger v2.4.0
	 * Draggable base class
	 * MIT license
	 */

	(function (module) {
	/*jshint browser: true, unused: true, undef: true, strict: true */

	( function( window, factory ) {
	  // universal module definition
	  /*jshint strict: false */ /*globals define, module, require */

	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	      window,
	      unipointer.exports
	    );
	  } else {
	    // browser global
	    window.Unidragger = factory(
	      window,
	      window.Unipointer
	    );
	  }

	}( window, function factory( window, Unipointer ) {

	// -------------------------- Unidragger -------------------------- //

	function Unidragger() {}

	// inherit Unipointer & EvEmitter
	var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

	// ----- bind start ----- //

	proto.bindHandles = function() {
	  this._bindHandles( true );
	};

	proto.unbindHandles = function() {
	  this._bindHandles( false );
	};

	/**
	 * Add or remove start event
	 * @param {Boolean} isAdd
	 */
	proto._bindHandles = function( isAdd ) {
	  // munge isAdd, default to true
	  isAdd = isAdd === undefined ? true : isAdd;
	  // bind each handle
	  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';
	  var touchAction = isAdd ? this._touchActionValue : '';
	  for ( var i=0; i < this.handles.length; i++ ) {
	    var handle = this.handles[i];
	    this._bindStartEvent( handle, isAdd );
	    handle[ bindMethod ]( 'click', this );
	    // touch-action: none to override browser touch gestures. metafizzy/flickity#540
	    if ( window.PointerEvent ) {
	      handle.style.touchAction = touchAction;
	    }
	  }
	};

	// prototype so it can be overwriteable by Flickity
	proto._touchActionValue = 'none';

	// ----- start event ----- //

	/**
	 * pointer start
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerDown = function( event, pointer ) {
	  var isOkay = this.okayPointerDown( event );
	  if ( !isOkay ) {
	    return;
	  }
	  // track start event position
	  // Safari 9 overrides pageX and pageY. These values needs to be copied. flickity#842
	  this.pointerDownPointer = {
	    pageX: pointer.pageX,
	    pageY: pointer.pageY,
	  };

	  event.preventDefault();
	  this.pointerDownBlur();
	  // bind move and end events
	  this._bindPostStartEvents( event );
	  this.emitEvent( 'pointerDown', [ event, pointer ] );
	};

	// nodes that have text fields
	var cursorNodes = {
	  TEXTAREA: true,
	  INPUT: true,
	  SELECT: true,
	  OPTION: true,
	};

	// input types that do not have text fields
	var clickTypes = {
	  radio: true,
	  checkbox: true,
	  button: true,
	  submit: true,
	  image: true,
	  file: true,
	};

	// dismiss inputs with text fields. flickity#403, flickity#404
	proto.okayPointerDown = function( event ) {
	  var isCursorNode = cursorNodes[ event.target.nodeName ];
	  var isClickType = clickTypes[ event.target.type ];
	  var isOkay = !isCursorNode || isClickType;
	  if ( !isOkay ) {
	    this._pointerReset();
	  }
	  return isOkay;
	};

	// kludge to blur previously focused input
	proto.pointerDownBlur = function() {
	  var focused = document.activeElement;
	  // do not blur body for IE10, metafizzy/flickity#117
	  var canBlur = focused && focused.blur && focused != document.body;
	  if ( canBlur ) {
	    focused.blur();
	  }
	};

	// ----- move event ----- //

	/**
	 * drag move
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerMove = function( event, pointer ) {
	  var moveVector = this._dragPointerMove( event, pointer );
	  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
	  this._dragMove( event, pointer, moveVector );
	};

	// base pointer move logic
	proto._dragPointerMove = function( event, pointer ) {
	  var moveVector = {
	    x: pointer.pageX - this.pointerDownPointer.pageX,
	    y: pointer.pageY - this.pointerDownPointer.pageY
	  };
	  // start drag if pointer has moved far enough to start drag
	  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
	    this._dragStart( event, pointer );
	  }
	  return moveVector;
	};

	// condition if pointer has moved far enough to start drag
	proto.hasDragStarted = function( moveVector ) {
	  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
	};

	// ----- end event ----- //

	/**
	 * pointer up
	 * @param {Event} event
	 * @param {Event or Touch} pointer
	 */
	proto.pointerUp = function( event, pointer ) {
	  this.emitEvent( 'pointerUp', [ event, pointer ] );
	  this._dragPointerUp( event, pointer );
	};

	proto._dragPointerUp = function( event, pointer ) {
	  if ( this.isDragging ) {
	    this._dragEnd( event, pointer );
	  } else {
	    // pointer didn't move enough for drag to start
	    this._staticClick( event, pointer );
	  }
	};

	// -------------------------- drag -------------------------- //

	// dragStart
	proto._dragStart = function( event, pointer ) {
	  this.isDragging = true;
	  // prevent clicks
	  this.isPreventingClicks = true;
	  this.dragStart( event, pointer );
	};

	proto.dragStart = function( event, pointer ) {
	  this.emitEvent( 'dragStart', [ event, pointer ] );
	};

	// dragMove
	proto._dragMove = function( event, pointer, moveVector ) {
	  // do not drag if not dragging yet
	  if ( !this.isDragging ) {
	    return;
	  }

	  this.dragMove( event, pointer, moveVector );
	};

	proto.dragMove = function( event, pointer, moveVector ) {
	  event.preventDefault();
	  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
	};

	// dragEnd
	proto._dragEnd = function( event, pointer ) {
	  // set flags
	  this.isDragging = false;
	  // re-enable clicking async
	  setTimeout( function() {
	    delete this.isPreventingClicks;
	  }.bind( this ) );

	  this.dragEnd( event, pointer );
	};

	proto.dragEnd = function( event, pointer ) {
	  this.emitEvent( 'dragEnd', [ event, pointer ] );
	};

	// ----- onclick ----- //

	// handle all clicks and prevent clicks when dragging
	proto.onclick = function( event ) {
	  if ( this.isPreventingClicks ) {
	    event.preventDefault();
	  }
	};

	// ----- staticClick ----- //

	// triggered after pointer down & up with no/tiny movement
	proto._staticClick = function( event, pointer ) {
	  // ignore emulated mouse up clicks
	  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
	    return;
	  }

	  this.staticClick( event, pointer );

	  // set flag for emulated clicks 300ms after touchend
	  if ( event.type != 'mouseup' ) {
	    this.isIgnoringMouseUp = true;
	    // reset flag after 300ms
	    setTimeout( function() {
	      delete this.isIgnoringMouseUp;
	    }.bind( this ), 400 );
	  }
	};

	proto.staticClick = function( event, pointer ) {
	  this.emitEvent( 'staticClick', [ event, pointer ] );
	};

	// ----- utils ----- //

	Unidragger.getPointerPoint = Unipointer.getPointerPoint;

	// -----  ----- //

	return Unidragger;

	}));
	}(unidragger));

	(function (module) {
	// drag
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        flickity.exports,
	        unidragger.exports,
	        utils.exports
	    );
	  } else {
	    // browser global
	    window.Flickity = factory(
	        window,
	        window.Flickity,
	        window.Unidragger,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, Flickity, Unidragger, utils ) {

	// ----- defaults ----- //

	utils.extend( Flickity.defaults, {
	  draggable: '>1',
	  dragThreshold: 3,
	} );

	// ----- create ----- //

	Flickity.createMethods.push('_createDrag');

	// -------------------------- drag prototype -------------------------- //

	var proto = Flickity.prototype;
	utils.extend( proto, Unidragger.prototype );
	proto._touchActionValue = 'pan-y';

	// --------------------------  -------------------------- //

	var isTouch = 'createTouch' in document;
	var isTouchmoveScrollCanceled = false;

	proto._createDrag = function() {
	  this.on( 'activate', this.onActivateDrag );
	  this.on( 'uiChange', this._uiChangeDrag );
	  this.on( 'deactivate', this.onDeactivateDrag );
	  this.on( 'cellChange', this.updateDraggable );
	  // TODO updateDraggable on resize? if groupCells & slides change
	  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
	  // #457, RubaXa/Sortable#973
	  if ( isTouch && !isTouchmoveScrollCanceled ) {
	    window.addEventListener( 'touchmove', function() {} );
	    isTouchmoveScrollCanceled = true;
	  }
	};

	proto.onActivateDrag = function() {
	  this.handles = [ this.viewport ];
	  this.bindHandles();
	  this.updateDraggable();
	};

	proto.onDeactivateDrag = function() {
	  this.unbindHandles();
	  this.element.classList.remove('is-draggable');
	};

	proto.updateDraggable = function() {
	  // disable dragging if less than 2 slides. #278
	  if ( this.options.draggable == '>1' ) {
	    this.isDraggable = this.slides.length > 1;
	  } else if (this.options.draggable === 'onOverflow') {
	    this.isDraggable = this.viewport.scrollWidth > this.viewport.offsetWidth;
	  } else {
	    this.isDraggable = this.options.draggable;
	  }
	  if ( this.isDraggable ) {
	    this.element.classList.add('is-draggable');
	  } else {
	    this.element.classList.remove('is-draggable');
	  }
	};

	// backwards compatibility
	proto.bindDrag = function() {
	  this.options.draggable = true;
	  this.updateDraggable();
	};

	proto.unbindDrag = function() {
	  this.options.draggable = false;
	  this.updateDraggable();
	};

	proto._uiChangeDrag = function() {
	  delete this.isFreeScrolling;
	};

	// -------------------------- pointer events -------------------------- //

	proto.pointerDown = function( event, pointer ) {
	  if ( !this.isDraggable ) {
	    this._pointerDownDefault( event, pointer );
	    return;
	  }
	  var isOkay = this.okayPointerDown( event );
	  if ( !isOkay ) {
	    return;
	  }

	  this._pointerDownPreventDefault( event );
	  this.pointerDownFocus( event );
	  // blur
	  if ( document.activeElement != this.element ) {
	    // do not blur if already focused
	    this.pointerDownBlur();
	  }

	  // stop if it was moving
	  this.dragX = this.x;
	  this.viewport.classList.add('is-pointer-down');
	  // track scrolling
	  this.pointerDownScroll = getScrollPosition();
	  window.addEventListener( 'scroll', this );

	  this._pointerDownDefault( event, pointer );
	};

	// default pointerDown logic, used for staticClick
	proto._pointerDownDefault = function( event, pointer ) {
	  // track start event position
	  // Safari 9 overrides pageX and pageY. These values needs to be copied. #779
	  this.pointerDownPointer = {
	    pageX: pointer.pageX,
	    pageY: pointer.pageY,
	  };
	  // bind move and end events
	  this._bindPostStartEvents( event );
	  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
	};

	var focusNodes = {
	  INPUT: true,
	  TEXTAREA: true,
	  SELECT: true,
	};

	proto.pointerDownFocus = function( event ) {
	  var isFocusNode = focusNodes[ event.target.nodeName ];
	  if ( !isFocusNode ) {
	    this.focus();
	  }
	};

	proto._pointerDownPreventDefault = function( event ) {
	  var isTouchStart = event.type == 'touchstart';
	  var isTouchPointer = event.pointerType == 'touch';
	  var isFocusNode = focusNodes[ event.target.nodeName ];
	  if ( !isTouchStart && !isTouchPointer && !isFocusNode ) {
	    event.preventDefault();
	  }
	};

	// ----- move ----- //

	proto.hasDragStarted = function( moveVector ) {
	  return Math.abs( moveVector.x ) > this.options.dragThreshold;
	};

	// ----- up ----- //

	proto.pointerUp = function( event, pointer ) {
	  delete this.isTouchScrolling;
	  this.viewport.classList.remove('is-pointer-down');
	  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
	  this._dragPointerUp( event, pointer );
	};

	proto.pointerDone = function() {
	  window.removeEventListener( 'scroll', this );
	  delete this.pointerDownScroll;
	};

	// -------------------------- dragging -------------------------- //

	proto.dragStart = function( event, pointer ) {
	  if ( !this.isDraggable ) {
	    return;
	  }
	  this.dragStartPosition = this.x;
	  this.startAnimation();
	  window.removeEventListener( 'scroll', this );
	  this.dispatchEvent( 'dragStart', event, [ pointer ] );
	};

	proto.pointerMove = function( event, pointer ) {
	  var moveVector = this._dragPointerMove( event, pointer );
	  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
	  this._dragMove( event, pointer, moveVector );
	};

	proto.dragMove = function( event, pointer, moveVector ) {
	  if ( !this.isDraggable ) {
	    return;
	  }
	  event.preventDefault();

	  this.previousDragX = this.dragX;
	  // reverse if right-to-left
	  var direction = this.options.rightToLeft ? -1 : 1;
	  if ( this.options.wrapAround ) {
	    // wrap around move. #589
	    moveVector.x %= this.slideableWidth;
	  }
	  var dragX = this.dragStartPosition + moveVector.x * direction;

	  if ( !this.options.wrapAround && this.slides.length ) {
	    // slow drag
	    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
	    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
	    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
	    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
	  }

	  this.dragX = dragX;

	  this.dragMoveTime = new Date();
	  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
	};

	proto.dragEnd = function( event, pointer ) {
	  if ( !this.isDraggable ) {
	    return;
	  }
	  if ( this.options.freeScroll ) {
	    this.isFreeScrolling = true;
	  }
	  // set selectedIndex based on where flick will end up
	  var index = this.dragEndRestingSelect();

	  if ( this.options.freeScroll && !this.options.wrapAround ) {
	    // if free-scroll & not wrap around
	    // do not free-scroll if going outside of bounding slides
	    // so bounding slides can attract slider, and keep it in bounds
	    var restingX = this.getRestingPosition();
	    this.isFreeScrolling = -restingX > this.slides[0].target &&
	      -restingX < this.getLastSlide().target;
	  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
	    // boost selection if selected index has not changed
	    index += this.dragEndBoostSelect();
	  }
	  delete this.previousDragX;
	  // apply selection
	  // TODO refactor this, selecting here feels weird
	  // HACK, set flag so dragging stays in correct direction
	  this.isDragSelect = this.options.wrapAround;
	  this.select( index );
	  delete this.isDragSelect;
	  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
	};

	proto.dragEndRestingSelect = function() {
	  var restingX = this.getRestingPosition();
	  // how far away from selected slide
	  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
	  // get closet resting going up and going down
	  var positiveResting = this._getClosestResting( restingX, distance, 1 );
	  var negativeResting = this._getClosestResting( restingX, distance, -1 );
	  // use closer resting for wrap-around
	  var index = positiveResting.distance < negativeResting.distance ?
	    positiveResting.index : negativeResting.index;
	  return index;
	};

	/**
	 * given resting X and distance to selected cell
	 * get the distance and index of the closest cell
	 * @param {Number} restingX - estimated post-flick resting position
	 * @param {Number} distance - distance to selected cell
	 * @param {Integer} increment - +1 or -1, going up or down
	 * @returns {Object} - { distance: {Number}, index: {Integer} }
	 */
	proto._getClosestResting = function( restingX, distance, increment ) {
	  var index = this.selectedIndex;
	  var minDistance = Infinity;
	  var condition = this.options.contain && !this.options.wrapAround ?
	    // if contain, keep going if distance is equal to minDistance
	    function( dist, minDist ) {
	      return dist <= minDist;
	    } : function( dist, minDist ) {
	      return dist < minDist;
	    };
	  while ( condition( distance, minDistance ) ) {
	    // measure distance to next cell
	    index += increment;
	    minDistance = distance;
	    distance = this.getSlideDistance( -restingX, index );
	    if ( distance === null ) {
	      break;
	    }
	    distance = Math.abs( distance );
	  }
	  return {
	    distance: minDistance,
	    // selected was previous index
	    index: index - increment,
	  };
	};

	/**
	 * measure distance between x and a slide target
	 * @param {Number} x - horizontal position
	 * @param {Integer} index - slide index
	 * @returns {Number} - slide distance
	 */
	proto.getSlideDistance = function( x, index ) {
	  var len = this.slides.length;
	  // wrap around if at least 2 slides
	  var isWrapAround = this.options.wrapAround && len > 1;
	  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
	  var slide = this.slides[ slideIndex ];
	  if ( !slide ) {
	    return null;
	  }
	  // add distance for wrap-around slides
	  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index/len ) : 0;
	  return x - ( slide.target + wrap );
	};

	proto.dragEndBoostSelect = function() {
	  // do not boost if no previousDragX or dragMoveTime
	  if ( this.previousDragX === undefined || !this.dragMoveTime ||
	    // or if drag was held for 100 ms
	    new Date() - this.dragMoveTime > 100 ) {
	    return 0;
	  }

	  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
	  var delta = this.previousDragX - this.dragX;
	  if ( distance > 0 && delta > 0 ) {
	    // boost to next if moving towards the right, and positive velocity
	    return 1;
	  } else if ( distance < 0 && delta < 0 ) {
	    // boost to previous if moving towards the left, and negative velocity
	    return -1;
	  }
	  return 0;
	};

	// ----- staticClick ----- //

	proto.staticClick = function( event, pointer ) {
	  // get clickedCell, if cell was clicked
	  var clickedCell = this.getParentCell( event.target );
	  var cellElem = clickedCell && clickedCell.element;
	  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
	  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
	};

	// ----- scroll ----- //

	proto.onscroll = function() {
	  var scroll = getScrollPosition();
	  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
	  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
	  // cancel click/tap if scroll is too much
	  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
	    this._pointerDone();
	  }
	};

	// ----- utils ----- //

	function getScrollPosition() {
	  return {
	    x: window.pageXOffset,
	    y: window.pageYOffset,
	  };
	}

	// -----  ----- //

	return Flickity;

	} ) );
	}(drag));

	var prevNextButton = {exports: {}};

	(function (module) {
	// prev/next buttons
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        flickity.exports,
	        unipointer.exports,
	        utils.exports
	    );
	  } else {
	    // browser global
	    factory(
	        window,
	        window.Flickity,
	        window.Unipointer,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, Flickity, Unipointer, utils ) {

	var svgURI = 'http://www.w3.org/2000/svg';

	// -------------------------- PrevNextButton -------------------------- //

	function PrevNextButton( direction, parent ) {
	  this.direction = direction;
	  this.parent = parent;
	  this._create();
	}

	PrevNextButton.prototype = Object.create( Unipointer.prototype );

	PrevNextButton.prototype._create = function() {
	  // properties
	  this.isEnabled = true;
	  this.isPrevious = this.direction == -1;
	  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
	  this.isLeft = this.direction == leftDirection;

	  var element = this.element = document.createElement('button');
	  element.className = 'flickity-button flickity-prev-next-button';
	  element.className += this.isPrevious ? ' previous' : ' next';
	  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
	  element.setAttribute( 'type', 'button' );
	  // init as disabled
	  this.disable();

	  element.setAttribute( 'aria-label', this.isPrevious ? 'Previous' : 'Next' );

	  // create arrow
	  var svg = this.createSVG();
	  element.appendChild( svg );
	  // events
	  this.parent.on( 'select', this.update.bind( this ) );
	  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
	};

	PrevNextButton.prototype.activate = function() {
	  this.bindStartEvent( this.element );
	  this.element.addEventListener( 'click', this );
	  // add to DOM
	  this.parent.element.appendChild( this.element );
	};

	PrevNextButton.prototype.deactivate = function() {
	  // remove from DOM
	  this.parent.element.removeChild( this.element );
	  // click events
	  this.unbindStartEvent( this.element );
	  this.element.removeEventListener( 'click', this );
	};

	PrevNextButton.prototype.createSVG = function() {
	  var svg = document.createElementNS( svgURI, 'svg' );
	  svg.setAttribute( 'class', 'flickity-button-icon' );
	  svg.setAttribute( 'viewBox', '0 0 100 100' );
	  var path = document.createElementNS( svgURI, 'path' );
	  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
	  path.setAttribute( 'd', pathMovements );
	  path.setAttribute( 'class', 'arrow' );
	  // rotate arrow
	  if ( !this.isLeft ) {
	    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
	  }
	  svg.appendChild( path );
	  return svg;
	};

	// get SVG path movmement
	function getArrowMovements( shape ) {
	  // use shape as movement if string
	  if ( typeof shape == 'string' ) {
	    return shape;
	  }
	  // create movement string
	  return 'M ' + shape.x0 + ',50' +
	    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
	    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
	    ' L ' + shape.x3 + ',50 ' +
	    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
	    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
	    ' Z';
	}

	PrevNextButton.prototype.handleEvent = utils.handleEvent;

	PrevNextButton.prototype.onclick = function() {
	  if ( !this.isEnabled ) {
	    return;
	  }
	  this.parent.uiChange();
	  var method = this.isPrevious ? 'previous' : 'next';
	  this.parent[ method ]();
	};

	// -----  ----- //

	PrevNextButton.prototype.enable = function() {
	  if ( this.isEnabled ) {
	    return;
	  }
	  this.element.disabled = false;
	  this.isEnabled = true;
	};

	PrevNextButton.prototype.disable = function() {
	  if ( !this.isEnabled ) {
	    return;
	  }
	  this.element.disabled = true;
	  this.isEnabled = false;
	};

	PrevNextButton.prototype.update = function() {
	  // index of first or last slide, if previous or next
	  var slides = this.parent.slides;
	  // enable is wrapAround and at least 2 slides
	  if ( this.parent.options.wrapAround && slides.length > 1 ) {
	    this.enable();
	    return;
	  }
	  var lastIndex = slides.length ? slides.length - 1 : 0;
	  var boundIndex = this.isPrevious ? 0 : lastIndex;
	  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
	  this[ method ]();
	};

	PrevNextButton.prototype.destroy = function() {
	  this.deactivate();
	  this.allOff();
	};

	// -------------------------- Flickity prototype -------------------------- //

	utils.extend( Flickity.defaults, {
	  prevNextButtons: true,
	  arrowShape: {
	    x0: 10,
	    x1: 60, y1: 50,
	    x2: 70, y2: 40,
	    x3: 30,
	  },
	} );

	Flickity.createMethods.push('_createPrevNextButtons');
	var proto = Flickity.prototype;

	proto._createPrevNextButtons = function() {
	  if ( !this.options.prevNextButtons ) {
	    return;
	  }

	  this.prevButton = new PrevNextButton( -1, this );
	  this.nextButton = new PrevNextButton( 1, this );

	  this.on( 'activate', this.activatePrevNextButtons );
	};

	proto.activatePrevNextButtons = function() {
	  this.prevButton.activate();
	  this.nextButton.activate();
	  this.on( 'deactivate', this.deactivatePrevNextButtons );
	};

	proto.deactivatePrevNextButtons = function() {
	  this.prevButton.deactivate();
	  this.nextButton.deactivate();
	  this.off( 'deactivate', this.deactivatePrevNextButtons );
	};

	// --------------------------  -------------------------- //

	Flickity.PrevNextButton = PrevNextButton;

	return Flickity;

	} ) );
	}(prevNextButton));

	var pageDots = {exports: {}};

	(function (module) {
	// page dots
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        flickity.exports,
	        unipointer.exports,
	        utils.exports
	    );
	  } else {
	    // browser global
	    factory(
	        window,
	        window.Flickity,
	        window.Unipointer,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, Flickity, Unipointer, utils ) {

	function PageDots( parent ) {
	  this.parent = parent;
	  this._create();
	}

	PageDots.prototype = Object.create( Unipointer.prototype );

	PageDots.prototype._create = function() {
	  // create holder element
	  this.holder = document.createElement('ol');
	  this.holder.className = 'flickity-page-dots';
	  // create dots, array of elements
	  this.dots = [];
	  // events
	  this.handleClick = this.onClick.bind( this );
	  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
	};

	PageDots.prototype.activate = function() {
	  this.setDots();
	  this.holder.addEventListener( 'click', this.handleClick );
	  this.bindStartEvent( this.holder );
	  // add to DOM
	  this.parent.element.appendChild( this.holder );
	};

	PageDots.prototype.deactivate = function() {
	  this.holder.removeEventListener( 'click', this.handleClick );
	  this.unbindStartEvent( this.holder );
	  // remove from DOM
	  this.parent.element.removeChild( this.holder );
	};

	PageDots.prototype.setDots = function() {
	  // get difference between number of slides and number of dots
	  var delta = this.parent.slides.length - this.dots.length;
	  if ( delta > 0 ) {
	    this.addDots( delta );
	  } else if ( delta < 0 ) {
	    this.removeDots( -delta );
	  }
	};

	PageDots.prototype.addDots = function( count ) {
	  var fragment = document.createDocumentFragment();
	  var newDots = [];
	  var length = this.dots.length;
	  var max = length + count;

	  for ( var i = length; i < max; i++ ) {
	    var dot = document.createElement('li');
	    dot.className = 'dot';
	    dot.setAttribute( 'aria-label', 'Page dot ' + ( i + 1 ) );
	    fragment.appendChild( dot );
	    newDots.push( dot );
	  }

	  this.holder.appendChild( fragment );
	  this.dots = this.dots.concat( newDots );
	};

	PageDots.prototype.removeDots = function( count ) {
	  // remove from this.dots collection
	  var removeDots = this.dots.splice( this.dots.length - count, count );
	  // remove from DOM
	  removeDots.forEach( function( dot ) {
	    this.holder.removeChild( dot );
	  }, this );
	};

	PageDots.prototype.updateSelected = function() {
	  // remove selected class on previous
	  if ( this.selectedDot ) {
	    this.selectedDot.className = 'dot';
	    this.selectedDot.removeAttribute('aria-current');
	  }
	  // don't proceed if no dots
	  if ( !this.dots.length ) {
	    return;
	  }
	  this.selectedDot = this.dots[ this.parent.selectedIndex ];
	  this.selectedDot.className = 'dot is-selected';
	  this.selectedDot.setAttribute( 'aria-current', 'step' );
	};

	PageDots.prototype.onTap = // old method name, backwards-compatible
	PageDots.prototype.onClick = function( event ) {
	  var target = event.target;
	  // only care about dot clicks
	  if ( target.nodeName != 'LI' ) {
	    return;
	  }

	  this.parent.uiChange();
	  var index = this.dots.indexOf( target );
	  this.parent.select( index );
	};

	PageDots.prototype.destroy = function() {
	  this.deactivate();
	  this.allOff();
	};

	Flickity.PageDots = PageDots;

	// -------------------------- Flickity -------------------------- //

	utils.extend( Flickity.defaults, {
	  pageDots: true,
	} );

	Flickity.createMethods.push('_createPageDots');

	var proto = Flickity.prototype;

	proto._createPageDots = function() {
	  if ( !this.options.pageDots ) {
	    return;
	  }
	  this.pageDots = new PageDots( this );
	  // events
	  this.on( 'activate', this.activatePageDots );
	  this.on( 'select', this.updateSelectedPageDots );
	  this.on( 'cellChange', this.updatePageDots );
	  this.on( 'resize', this.updatePageDots );
	  this.on( 'deactivate', this.deactivatePageDots );
	};

	proto.activatePageDots = function() {
	  this.pageDots.activate();
	};

	proto.updateSelectedPageDots = function() {
	  this.pageDots.updateSelected();
	};

	proto.updatePageDots = function() {
	  this.pageDots.setDots();
	};

	proto.deactivatePageDots = function() {
	  this.pageDots.deactivate();
	};

	// -----  ----- //

	Flickity.PageDots = PageDots;

	return Flickity;

	} ) );
	}(pageDots));

	var player = {exports: {}};

	(function (module) {
	// player & autoPlay
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        evEmitter.exports,
	        utils.exports,
	        flickity.exports
	    );
	  } else {
	    // browser global
	    factory(
	        window.EvEmitter,
	        window.fizzyUIUtils,
	        window.Flickity
	    );
	  }

	}( window, function factory( EvEmitter, utils, Flickity ) {

	// -------------------------- Player -------------------------- //

	function Player( parent ) {
	  this.parent = parent;
	  this.state = 'stopped';
	  // visibility change event handler
	  this.onVisibilityChange = this.visibilityChange.bind( this );
	  this.onVisibilityPlay = this.visibilityPlay.bind( this );
	}

	Player.prototype = Object.create( EvEmitter.prototype );

	// start play
	Player.prototype.play = function() {
	  if ( this.state == 'playing' ) {
	    return;
	  }
	  // do not play if page is hidden, start playing when page is visible
	  var isPageHidden = document.hidden;
	  if ( isPageHidden ) {
	    document.addEventListener( 'visibilitychange', this.onVisibilityPlay );
	    return;
	  }

	  this.state = 'playing';
	  // listen to visibility change
	  document.addEventListener( 'visibilitychange', this.onVisibilityChange );
	  // start ticking
	  this.tick();
	};

	Player.prototype.tick = function() {
	  // do not tick if not playing
	  if ( this.state != 'playing' ) {
	    return;
	  }

	  var time = this.parent.options.autoPlay;
	  // default to 3 seconds
	  time = typeof time == 'number' ? time : 3000;
	  var _this = this;
	  // HACK: reset ticks if stopped and started within interval
	  this.clear();
	  this.timeout = setTimeout( function() {
	    _this.parent.next( true );
	    _this.tick();
	  }, time );
	};

	Player.prototype.stop = function() {
	  this.state = 'stopped';
	  this.clear();
	  // remove visibility change event
	  document.removeEventListener( 'visibilitychange', this.onVisibilityChange );
	};

	Player.prototype.clear = function() {
	  clearTimeout( this.timeout );
	};

	Player.prototype.pause = function() {
	  if ( this.state == 'playing' ) {
	    this.state = 'paused';
	    this.clear();
	  }
	};

	Player.prototype.unpause = function() {
	  // re-start play if paused
	  if ( this.state == 'paused' ) {
	    this.play();
	  }
	};

	// pause if page visibility is hidden, unpause if visible
	Player.prototype.visibilityChange = function() {
	  var isPageHidden = document.hidden;
	  this[ isPageHidden ? 'pause' : 'unpause' ]();
	};

	Player.prototype.visibilityPlay = function() {
	  this.play();
	  document.removeEventListener( 'visibilitychange', this.onVisibilityPlay );
	};

	// -------------------------- Flickity -------------------------- //

	utils.extend( Flickity.defaults, {
	  pauseAutoPlayOnHover: true,
	} );

	Flickity.createMethods.push('_createPlayer');
	var proto = Flickity.prototype;

	proto._createPlayer = function() {
	  this.player = new Player( this );

	  this.on( 'activate', this.activatePlayer );
	  this.on( 'uiChange', this.stopPlayer );
	  this.on( 'pointerDown', this.stopPlayer );
	  this.on( 'deactivate', this.deactivatePlayer );
	};

	proto.activatePlayer = function() {
	  if ( !this.options.autoPlay ) {
	    return;
	  }
	  this.player.play();
	  this.element.addEventListener( 'mouseenter', this );
	};

	// Player API, don't hate the ... thanks I know where the door is

	proto.playPlayer = function() {
	  this.player.play();
	};

	proto.stopPlayer = function() {
	  this.player.stop();
	};

	proto.pausePlayer = function() {
	  this.player.pause();
	};

	proto.unpausePlayer = function() {
	  this.player.unpause();
	};

	proto.deactivatePlayer = function() {
	  this.player.stop();
	  this.element.removeEventListener( 'mouseenter', this );
	};

	// ----- mouseenter/leave ----- //

	// pause auto-play on hover
	proto.onmouseenter = function() {
	  if ( !this.options.pauseAutoPlayOnHover ) {
	    return;
	  }
	  this.player.pause();
	  this.element.addEventListener( 'mouseleave', this );
	};

	// resume auto-play on hover off
	proto.onmouseleave = function() {
	  this.player.unpause();
	  this.element.removeEventListener( 'mouseleave', this );
	};

	// -----  ----- //

	Flickity.Player = Player;

	return Flickity;

	} ) );
	}(player));

	var addRemoveCell = {exports: {}};

	(function (module) {
	// add, remove cell
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        flickity.exports,
	        utils.exports
	    );
	  } else {
	    // browser global
	    factory(
	        window,
	        window.Flickity,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, Flickity, utils ) {

	// append cells to a document fragment
	function getCellsFragment( cells ) {
	  var fragment = document.createDocumentFragment();
	  cells.forEach( function( cell ) {
	    fragment.appendChild( cell.element );
	  } );
	  return fragment;
	}

	// -------------------------- add/remove cell prototype -------------------------- //

	var proto = Flickity.prototype;

	/**
	 * Insert, prepend, or append cells
	 * @param {[Element, Array, NodeList]} elems - Elements to insert
	 * @param {Integer} index - Zero-based number to insert
	 */
	proto.insert = function( elems, index ) {
	  var cells = this._makeCells( elems );
	  if ( !cells || !cells.length ) {
	    return;
	  }
	  var len = this.cells.length;
	  // default to append
	  index = index === undefined ? len : index;
	  // add cells with document fragment
	  var fragment = getCellsFragment( cells );
	  // append to slider
	  var isAppend = index == len;
	  if ( isAppend ) {
	    this.slider.appendChild( fragment );
	  } else {
	    var insertCellElement = this.cells[ index ].element;
	    this.slider.insertBefore( fragment, insertCellElement );
	  }
	  // add to this.cells
	  if ( index === 0 ) {
	    // prepend, add to start
	    this.cells = cells.concat( this.cells );
	  } else if ( isAppend ) {
	    // append, add to end
	    this.cells = this.cells.concat( cells );
	  } else {
	    // insert in this.cells
	    var endCells = this.cells.splice( index, len - index );
	    this.cells = this.cells.concat( cells ).concat( endCells );
	  }

	  this._sizeCells( cells );
	  this.cellChange( index, true );
	};

	proto.append = function( elems ) {
	  this.insert( elems, this.cells.length );
	};

	proto.prepend = function( elems ) {
	  this.insert( elems, 0 );
	};

	/**
	 * Remove cells
	 * @param {[Element, Array, NodeList]} elems - ELements to remove
	 */
	proto.remove = function( elems ) {
	  var cells = this.getCells( elems );
	  if ( !cells || !cells.length ) {
	    return;
	  }

	  var minCellIndex = this.cells.length - 1;
	  // remove cells from collection & DOM
	  cells.forEach( function( cell ) {
	    cell.remove();
	    var index = this.cells.indexOf( cell );
	    minCellIndex = Math.min( index, minCellIndex );
	    utils.removeFrom( this.cells, cell );
	  }, this );

	  this.cellChange( minCellIndex, true );
	};

	/**
	 * logic to be run after a cell's size changes
	 * @param {Element} elem - cell's element
	 */
	proto.cellSizeChange = function( elem ) {
	  var cell = this.getCell( elem );
	  if ( !cell ) {
	    return;
	  }
	  cell.getSize();

	  var index = this.cells.indexOf( cell );
	  this.cellChange( index );
	};

	/**
	 * logic any time a cell is changed: added, removed, or size changed
	 * @param {Integer} changedCellIndex - index of the changed cell, optional
	 * @param {Boolean} isPositioningSlider - Positions slider after selection
	 */
	proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
	  var prevSelectedElem = this.selectedElement;
	  this._positionCells( changedCellIndex );
	  this._getWrapShiftCells();
	  this.setGallerySize();
	  // update selectedIndex
	  // try to maintain position & select previous selected element
	  var cell = this.getCell( prevSelectedElem );
	  if ( cell ) {
	    this.selectedIndex = this.getCellSlideIndex( cell );
	  }
	  this.selectedIndex = Math.min( this.slides.length - 1, this.selectedIndex );

	  this.emitEvent( 'cellChange', [ changedCellIndex ] );
	  // position slider
	  this.select( this.selectedIndex );
	  // do not position slider after lazy load
	  if ( isPositioningSlider ) {
	    this.positionSliderAtSelected();
	  }
	};

	// -----  ----- //

	return Flickity;

	} ) );
	}(addRemoveCell));

	var lazyload = {exports: {}};

	(function (module) {
	// lazyload
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        window,
	        flickity.exports,
	        utils.exports
	    );
	  } else {
	    // browser global
	    factory(
	        window,
	        window.Flickity,
	        window.fizzyUIUtils
	    );
	  }

	}( window, function factory( window, Flickity, utils ) {

	Flickity.createMethods.push('_createLazyload');
	var proto = Flickity.prototype;

	proto._createLazyload = function() {
	  this.on( 'select', this.lazyLoad );
	};

	proto.lazyLoad = function() {
	  var lazyLoad = this.options.lazyLoad;
	  if ( !lazyLoad ) {
	    return;
	  }
	  // get adjacent cells, use lazyLoad option for adjacent count
	  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
	  var cellElems = this.getAdjacentCellElements( adjCount );
	  // get lazy images in those cells
	  var lazyImages = [];
	  cellElems.forEach( function( cellElem ) {
	    var lazyCellImages = getCellLazyImages( cellElem );
	    lazyImages = lazyImages.concat( lazyCellImages );
	  } );
	  // load lazy images
	  lazyImages.forEach( function( img ) {
	    new LazyLoader( img, this );
	  }, this );
	};

	function getCellLazyImages( cellElem ) {
	  // check if cell element is lazy image
	  if ( cellElem.nodeName == 'IMG' ) {
	    var lazyloadAttr = cellElem.getAttribute('data-flickity-lazyload');
	    var srcAttr = cellElem.getAttribute('data-flickity-lazyload-src');
	    var srcsetAttr = cellElem.getAttribute('data-flickity-lazyload-srcset');
	    if ( lazyloadAttr || srcAttr || srcsetAttr ) {
	      return [ cellElem ];
	    }
	  }
	  // select lazy images in cell
	  var lazySelector = 'img[data-flickity-lazyload], ' +
	    'img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]';
	  var imgs = cellElem.querySelectorAll( lazySelector );
	  return utils.makeArray( imgs );
	}

	// -------------------------- LazyLoader -------------------------- //

	/**
	 * class to handle loading images
	 * @param {Image} img - Image element
	 * @param {Flickity} flickity - Flickity instance
	 */
	function LazyLoader( img, flickity ) {
	  this.img = img;
	  this.flickity = flickity;
	  this.load();
	}

	LazyLoader.prototype.handleEvent = utils.handleEvent;

	LazyLoader.prototype.load = function() {
	  this.img.addEventListener( 'load', this );
	  this.img.addEventListener( 'error', this );
	  // get src & srcset
	  var src = this.img.getAttribute('data-flickity-lazyload') ||
	    this.img.getAttribute('data-flickity-lazyload-src');
	  var srcset = this.img.getAttribute('data-flickity-lazyload-srcset');
	  // set src & serset
	  this.img.src = src;
	  if ( srcset ) {
	    this.img.setAttribute( 'srcset', srcset );
	  }
	  // remove attr
	  this.img.removeAttribute('data-flickity-lazyload');
	  this.img.removeAttribute('data-flickity-lazyload-src');
	  this.img.removeAttribute('data-flickity-lazyload-srcset');
	};

	LazyLoader.prototype.onload = function( event ) {
	  this.complete( event, 'flickity-lazyloaded' );
	};

	LazyLoader.prototype.onerror = function( event ) {
	  this.complete( event, 'flickity-lazyerror' );
	};

	LazyLoader.prototype.complete = function( event, className ) {
	  // unbind events
	  this.img.removeEventListener( 'load', this );
	  this.img.removeEventListener( 'error', this );

	  var cell = this.flickity.getParentCell( this.img );
	  var cellElem = cell && cell.element;
	  this.flickity.cellSizeChange( cellElem );

	  this.img.classList.add( className );
	  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
	};

	// -----  ----- //

	Flickity.LazyLoader = LazyLoader;

	return Flickity;

	} ) );
	}(lazyload));

	/*!
	 * Flickity v2.2.2
	 * Touch, responsive, flickable carousels
	 *
	 * Licensed GPLv3 for open source use
	 * or Flickity Commercial License for commercial use
	 *
	 * https://flickity.metafizzy.co
	 * Copyright 2015-2021 Metafizzy
	 */

	(function (module) {
	( function( window, factory ) {
	  // universal module definition
	  if ( module.exports ) {
	    // CommonJS
	    module.exports = factory(
	        flickity.exports,
	        drag.exports,
	        prevNextButton.exports,
	        pageDots.exports,
	        player.exports,
	        addRemoveCell.exports,
	        lazyload.exports
	    );
	  }

	} )( window, function factory( Flickity ) {
	  return Flickity;
	} );
	}(js$1));

	var js = js$1.exports;

	var index = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		'default': js
	}, [js$1.exports]));

	var simpleParallax_min$2 = {exports: {}};

	/*!
	 * simpleParallax.min - simpleParallax is a simple JavaScript library that gives your website parallax animations on any images or videos, 
	 * @date: 20-08-2020 14:0:14, 
	 * @version: 5.6.2,
	 * @link: https://simpleparallax.com/
	 */

	(function (module, exports) {
	!function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i});},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){n.r(e),n.d(e,"default",(function(){return x}));var i=function(){return Element.prototype.closest&&"IntersectionObserver"in window};function r(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var s=new(function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.positions={top:0,bottom:0,height:0};}var e,n;return e=t,(n=[{key:"setViewportTop",value:function(t){return this.positions.top=t?t.scrollTop:window.pageYOffset,this.positions}},{key:"setViewportBottom",value:function(){return this.positions.bottom=this.positions.top+this.positions.height,this.positions}},{key:"setViewportAll",value:function(t){return this.positions.top=t?t.scrollTop:window.pageYOffset,this.positions.height=t?t.clientHeight:document.documentElement.clientHeight,this.positions.bottom=this.positions.top+this.positions.height,this.positions}}])&&r(e.prototype,n),t}()),o=function(t){return NodeList.prototype.isPrototypeOf(t)||HTMLCollection.prototype.isPrototypeOf(t)?Array.from(t):"string"==typeof t||t instanceof String?document.querySelectorAll(t):[t]},a=function(){for(var t,e="transform webkitTransform mozTransform oTransform msTransform".split(" "),n=0;void 0===t;)t=void 0!==document.createElement("div").style[e[n]]?e[n]:void 0,n+=1;return t}(),l=function(t){return "img"!==t.tagName.toLowerCase()&&"picture"!==t.tagName.toLowerCase()||!!t&&(!!t.complete&&(void 0===t.naturalWidth||0!==t.naturalWidth))};function u(t){return function(t){if(Array.isArray(t))return c(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return c(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function h(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var f=function(){function t(e,n){var i=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.element=e,this.elementContainer=e,this.settings=n,this.isVisible=!0,this.isInit=!1,this.oldTranslateValue=-1,this.init=this.init.bind(this),this.customWrapper=this.settings.customWrapper&&this.element.closest(this.settings.customWrapper)?this.element.closest(this.settings.customWrapper):null,l(e)?this.init():this.element.addEventListener("load",(function(){setTimeout((function(){i.init(!0);}),50);}));}var e,n;return e=t,(n=[{key:"init",value:function(t){var e=this;this.isInit||(t&&(this.rangeMax=null),this.element.closest(".simpleParallax")||(!1===this.settings.overflow&&this.wrapElement(this.element),this.setTransformCSS(),this.getElementOffset(),this.intersectionObserver(),this.getTranslateValue(),this.animate(),this.settings.delay>0?setTimeout((function(){e.setTransitionCSS(),e.elementContainer.classList.add("simple-parallax-initialized");}),10):this.elementContainer.classList.add("simple-parallax-initialized"),this.isInit=!0));}},{key:"wrapElement",value:function(){var t=this.element.closest("picture")||this.element,e=this.customWrapper||document.createElement("div");e.classList.add("simpleParallax"),e.style.overflow="hidden",this.customWrapper||(t.parentNode.insertBefore(e,t),e.appendChild(t)),this.elementContainer=e;}},{key:"unWrapElement",value:function(){var t=this.elementContainer;this.customWrapper?(t.classList.remove("simpleParallax"),t.style.overflow=""):t.replaceWith.apply(t,u(t.childNodes));}},{key:"setTransformCSS",value:function(){!1===this.settings.overflow&&(this.element.style[a]="scale(".concat(this.settings.scale,")")),this.element.style.willChange="transform";}},{key:"setTransitionCSS",value:function(){this.element.style.transition="transform ".concat(this.settings.delay,"s ").concat(this.settings.transition);}},{key:"unSetStyle",value:function(){this.element.style.willChange="",this.element.style[a]="",this.element.style.transition="";}},{key:"getElementOffset",value:function(){var t=this.elementContainer.getBoundingClientRect();if(this.elementHeight=t.height,this.elementTop=t.top+s.positions.top,this.settings.customContainer){var e=this.settings.customContainer.getBoundingClientRect();this.elementTop=t.top-e.top+s.positions.top;}this.elementBottom=this.elementHeight+this.elementTop;}},{key:"buildThresholdList",value:function(){for(var t=[],e=1;e<=this.elementHeight;e++){var n=e/this.elementHeight;t.push(n);}return t}},{key:"intersectionObserver",value:function(){var t={root:null,threshold:this.buildThresholdList()};this.observer=new IntersectionObserver(this.intersectionObserverCallback.bind(this),t),this.observer.observe(this.element);}},{key:"intersectionObserverCallback",value:function(t){var e=this;t.forEach((function(t){t.isIntersecting?e.isVisible=!0:e.isVisible=!1;}));}},{key:"checkIfVisible",value:function(){return this.elementBottom>s.positions.top&&this.elementTop<s.positions.bottom}},{key:"getRangeMax",value:function(){var t=this.element.clientHeight;this.rangeMax=t*this.settings.scale-t;}},{key:"getTranslateValue",value:function(){var t=((s.positions.bottom-this.elementTop)/((s.positions.height+this.elementHeight)/100)).toFixed(1);return t=Math.min(100,Math.max(0,t)),0!==this.settings.maxTransition&&t>this.settings.maxTransition&&(t=this.settings.maxTransition),this.oldPercentage!==t&&(this.rangeMax||this.getRangeMax(),this.translateValue=(t/100*this.rangeMax-this.rangeMax/2).toFixed(0),this.oldTranslateValue!==this.translateValue&&(this.oldPercentage=t,this.oldTranslateValue=this.translateValue,!0))}},{key:"animate",value:function(){var t,e=0,n=0;(this.settings.orientation.includes("left")||this.settings.orientation.includes("right"))&&(n="".concat(this.settings.orientation.includes("left")?-1*this.translateValue:this.translateValue,"px")),(this.settings.orientation.includes("up")||this.settings.orientation.includes("down"))&&(e="".concat(this.settings.orientation.includes("up")?-1*this.translateValue:this.translateValue,"px")),t=!1===this.settings.overflow?"translate3d(".concat(n,", ").concat(e,", 0) scale(").concat(this.settings.scale,")"):"translate3d(".concat(n,", ").concat(e,", 0)"),this.element.style[a]=t;}}])&&h(e.prototype,n),t}();function m(t){return function(t){if(Array.isArray(t))return y(t)}(t)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||d(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],i=!0,r=!1,s=void 0;try{for(var o,a=t[Symbol.iterator]();!(i=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);i=!0);}catch(t){r=!0,s=t;}finally{try{i||null==a.return||a.return();}finally{if(r)throw s}}return n}(t,e)||d(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){if(t){if("string"==typeof t)return y(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?y(t,e):void 0}}function y(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}function v(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var g,b,w=!1,T=[],x=function(){function t(e,n){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),e&&i()){if(this.elements=o(e),this.defaults={delay:0,orientation:"up",scale:1.3,overflow:!1,transition:"cubic-bezier(0,0,0,1)",customContainer:"",customWrapper:"",maxTransition:0},this.settings=Object.assign(this.defaults,n),this.settings.customContainer){var r=p(o(this.settings.customContainer),1);this.customContainer=r[0];}this.lastPosition=-1,this.resizeIsDone=this.resizeIsDone.bind(this),this.refresh=this.refresh.bind(this),this.proceedRequestAnimationFrame=this.proceedRequestAnimationFrame.bind(this),this.init();}}var e,n;return e=t,(n=[{key:"init",value:function(){var t=this;s.setViewportAll(this.customContainer),T=[].concat(m(this.elements.map((function(e){return new f(e,t.settings)}))),m(T)),w||(this.proceedRequestAnimationFrame(),window.addEventListener("resize",this.resizeIsDone),w=!0);}},{key:"resizeIsDone",value:function(){clearTimeout(b),b=setTimeout(this.refresh,200);}},{key:"proceedRequestAnimationFrame",value:function(){var t=this;s.setViewportTop(this.customContainer),this.lastPosition!==s.positions.top?(s.setViewportBottom(),T.forEach((function(e){t.proceedElement(e);})),g=window.requestAnimationFrame(this.proceedRequestAnimationFrame),this.lastPosition=s.positions.top):g=window.requestAnimationFrame(this.proceedRequestAnimationFrame);}},{key:"proceedElement",value:function(t){(this.customContainer?t.checkIfVisible():t.isVisible)&&t.getTranslateValue()&&t.animate();}},{key:"refresh",value:function(){s.setViewportAll(this.customContainer),T.forEach((function(t){t.getElementOffset(),t.getRangeMax();})),this.lastPosition=-1;}},{key:"destroy",value:function(){var t=this,e=[];T=T.filter((function(n){return t.elements.includes(n.element)?(e.push(n),!1):n})),e.forEach((function(e){e.unSetStyle(),!1===t.settings.overflow&&e.unWrapElement();})),T.length||(window.cancelAnimationFrame(g),window.removeEventListener("resize",this.refresh),w=!1);}}])&&v(e.prototype,n),t}();}]).default}));
	}(simpleParallax_min$2));

	var simpleParallax_min = /*@__PURE__*/getDefaultExportFromCjs(simpleParallax_min$2.exports);

	var simpleParallax_min$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		'default': simpleParallax_min
	}, [simpleParallax_min$2.exports]));

	var dist = {exports: {}};

	var Sister;

	/**
	* @link https://github.com/gajus/sister for the canonical source repository
	* @license https://github.com/gajus/sister/blob/master/LICENSE BSD 3-Clause
	*/
	Sister = function () {
	    var sister = {},
	        events = {};

	    /**
	     * @name handler
	     * @function
	     * @param {Object} data Event data.
	     */

	    /**
	     * @param {String} name Event name.
	     * @param {handler} handler
	     * @return {listener}
	     */
	    sister.on = function (name, handler) {
	        var listener = {name: name, handler: handler};
	        events[name] = events[name] || [];
	        events[name].unshift(listener);
	        return listener;
	    };

	    /**
	     * @param {listener}
	     */
	    sister.off = function (listener) {
	        var index = events[listener.name].indexOf(listener);

	        if (index !== -1) {
	            events[listener.name].splice(index, 1);
	        }
	    };

	    /**
	     * @param {String} name Event name.
	     * @param {Object} data Event data.
	     */
	    sister.trigger = function (name, data) {
	        var listeners = events[name],
	            i;

	        if (listeners) {
	            i = listeners.length;
	            while (i--) {
	                listeners[i].handler(data);
	            }
	        }
	    };

	    return sister;
	};

	var sister = Sister;

	var loadYouTubeIframeApi = {exports: {}};

	var loadScript = function load (src, opts, cb) {
	  var head = document.head || document.getElementsByTagName('head')[0];
	  var script = document.createElement('script');

	  if (typeof opts === 'function') {
	    cb = opts;
	    opts = {};
	  }

	  opts = opts || {};
	  cb = cb || function() {};

	  script.type = opts.type || 'text/javascript';
	  script.charset = opts.charset || 'utf8';
	  script.async = 'async' in opts ? !!opts.async : true;
	  script.src = src;

	  if (opts.attrs) {
	    setAttributes(script, opts.attrs);
	  }

	  if (opts.text) {
	    script.text = '' + opts.text;
	  }

	  var onend = 'onload' in script ? stdOnEnd : ieOnEnd;
	  onend(script, cb);

	  // some good legacy browsers (firefox) fail the 'in' detection above
	  // so as a fallback we always set onload
	  // old IE will ignore this and new IE will set onload
	  if (!script.onload) {
	    stdOnEnd(script, cb);
	  }

	  head.appendChild(script);
	};

	function setAttributes(script, attrs) {
	  for (var attr in attrs) {
	    script.setAttribute(attr, attrs[attr]);
	  }
	}

	function stdOnEnd (script, cb) {
	  script.onload = function () {
	    this.onerror = this.onload = null;
	    cb(null, script);
	  };
	  script.onerror = function () {
	    // this.onload = null here is necessary
	    // because even IE9 works not like others
	    this.onerror = this.onload = null;
	    cb(new Error('Failed to load ' + this.src), script);
	  };
	}

	function ieOnEnd (script, cb) {
	  script.onreadystatechange = function () {
	    if (this.readyState != 'complete' && this.readyState != 'loaded') return
	    this.onreadystatechange = null;
	    cb(null, script); // there is no way to catch loading errors in IE8
	  };
	}

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _loadScript = loadScript;

	var _loadScript2 = _interopRequireDefault(_loadScript);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (emitter) {
	  /**
	   * A promise that is resolved when window.onYouTubeIframeAPIReady is called.
	   * The promise is resolved with a reference to window.YT object.
	   */
	  var iframeAPIReady = new Promise(function (resolve) {
	    if (window.YT && window.YT.Player && window.YT.Player instanceof Function) {
	      resolve(window.YT);

	      return;
	    } else {
	      var protocol = window.location.protocol === 'http:' ? 'http:' : 'https:';

	      (0, _loadScript2.default)(protocol + '//www.youtube.com/iframe_api', function (error) {
	        if (error) {
	          emitter.trigger('error', error);
	        }
	      });
	    }

	    var previous = window.onYouTubeIframeAPIReady;

	    // The API will call this function when page has finished downloading
	    // the JavaScript for the player API.
	    window.onYouTubeIframeAPIReady = function () {
	      if (previous) {
	        previous();
	      }

	      resolve(window.YT);
	    };
	  });

	  return iframeAPIReady;
	};

	module.exports = exports['default'];
	}(loadYouTubeIframeApi, loadYouTubeIframeApi.exports));

	var YouTubePlayer = {exports: {}};

	var browser = {exports: {}};

	var debug = {exports: {}};

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} [options]
	 * @throws {Error} throw an error if val is not a non-empty string or a number
	 * @return {String|Number}
	 * @api public
	 */

	var ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isNaN(val) === false) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtShort(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function fmtLong(ms) {
	  return plural(ms, d, 'day') ||
	    plural(ms, h, 'hour') ||
	    plural(ms, m, 'minute') ||
	    plural(ms, s, 'second') ||
	    ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}

	(function (module, exports) {
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = ms;

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	 */

	exports.formatters = {};

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 * @param {String} namespace
	 * @return {Number}
	 * @api private
	 */

	function selectColor(namespace) {
	  var hash = 0, i;

	  for (i in namespace) {
	    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
	    hash |= 0; // Convert to 32bit integer
	  }

	  return exports.colors[Math.abs(hash) % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function createDebug(namespace) {

	  function debug() {
	    // disabled?
	    if (!debug.enabled) return;

	    var self = debug;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // turn the `arguments` into a proper Array
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %O
	      args.unshift('%O');
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    // apply env-specific formatting (colors, etc.)
	    exports.formatArgs.call(self, args);

	    var logFn = debug.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }

	  debug.namespace = namespace;
	  debug.enabled = exports.enabled(namespace);
	  debug.useColors = exports.useColors();
	  debug.color = selectColor(namespace);

	  // env-specific initialization logic for debug instances
	  if ('function' === typeof exports.init) {
	    exports.init(debug);
	  }

	  return debug;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  exports.names = [];
	  exports.skips = [];

	  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}
	}(debug, debug.exports));

	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	(function (module, exports) {
	exports = module.exports = debug.exports;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // NB: In an Electron preload script, document will be defined but not fully
	  // initialized. Since we know we're in Chrome, we'll just detect this case
	  // explicitly
	  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
	    return true;
	  }

	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
	    // double check webkit in userAgent just in case we are in a worker
	    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  try {
	    return JSON.stringify(v);
	  } catch (err) {
	    return '[UnexpectedJSONParseError]: ' + err.message;
	  }
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs(args) {
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return;

	  var c = 'color: ' + this.color;
	  args.splice(1, 0, c, 'color: inherit');

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-zA-Z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}

	  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	  if (!r && typeof process !== 'undefined' && 'env' in process) {
	    r = process.env.DEBUG;
	  }

	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage() {
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}
	}(browser, browser.exports));

	var functionNames = {exports: {}};

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});


	/**
	 * @see https://developers.google.com/youtube/iframe_api_reference#Functions
	 */
	exports.default = ['cueVideoById', 'loadVideoById', 'cueVideoByUrl', 'loadVideoByUrl', 'playVideo', 'pauseVideo', 'stopVideo', 'getVideoLoadedFraction', 'cuePlaylist', 'loadPlaylist', 'nextVideo', 'previousVideo', 'playVideoAt', 'setShuffle', 'setLoop', 'getPlaylist', 'getPlaylistIndex', 'setOption', 'mute', 'unMute', 'isMuted', 'setVolume', 'getVolume', 'seekTo', 'getPlayerState', 'getPlaybackRate', 'setPlaybackRate', 'getAvailablePlaybackRates', 'getPlaybackQuality', 'setPlaybackQuality', 'getAvailableQualityLevels', 'getCurrentTime', 'getDuration', 'removeEventListener', 'getVideoUrl', 'getVideoEmbedCode', 'getOptions', 'getOption', 'addEventListener', 'destroy', 'setSize', 'getIframe'];
	module.exports = exports['default'];
	}(functionNames, functionNames.exports));

	var eventNames = {exports: {}};

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});


	/**
	 * @see https://developers.google.com/youtube/iframe_api_reference#Events
	 * `volumeChange` is not officially supported but seems to work
	 * it emits an object: `{volume: 82.6923076923077, muted: false}`
	 */
	exports.default = ['ready', 'stateChange', 'playbackQualityChange', 'playbackRateChange', 'error', 'apiChange', 'volumeChange'];
	module.exports = exports['default'];
	}(eventNames, eventNames.exports));

	var FunctionStateMap = {exports: {}};

	var PlayerStates = {exports: {}};

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  BUFFERING: 3,
	  ENDED: 0,
	  PAUSED: 2,
	  PLAYING: 1,
	  UNSTARTED: -1,
	  VIDEO_CUED: 5
	};
	module.exports = exports["default"];
	}(PlayerStates, PlayerStates.exports));

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _PlayerStates = PlayerStates.exports;

	var _PlayerStates2 = _interopRequireDefault(_PlayerStates);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	  pauseVideo: {
	    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PAUSED],
	    stateChangeRequired: false
	  },
	  playVideo: {
	    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING],
	    stateChangeRequired: false
	  },
	  seekTo: {
	    acceptableStates: [_PlayerStates2.default.ENDED, _PlayerStates2.default.PLAYING, _PlayerStates2.default.PAUSED],
	    stateChangeRequired: true,

	    // TRICKY: `seekTo` may not cause a state change if no buffering is
	    // required.
	    timeout: 3000
	  }
	};
	module.exports = exports['default'];
	}(FunctionStateMap, FunctionStateMap.exports));

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _debug = browser.exports;

	var _debug2 = _interopRequireDefault(_debug);

	var _functionNames = functionNames.exports;

	var _functionNames2 = _interopRequireDefault(_functionNames);

	var _eventNames = eventNames.exports;

	var _eventNames2 = _interopRequireDefault(_eventNames);

	var _FunctionStateMap = FunctionStateMap.exports;

	var _FunctionStateMap2 = _interopRequireDefault(_FunctionStateMap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* eslint-disable promise/prefer-await-to-then */

	var debug = (0, _debug2.default)('youtube-player');

	var YouTubePlayer = {};

	/**
	 * Construct an object that defines an event handler for all of the YouTube
	 * player events. Proxy captured events through an event emitter.
	 *
	 * @todo Capture event parameters.
	 * @see https://developers.google.com/youtube/iframe_api_reference#Events
	 */
	YouTubePlayer.proxyEvents = function (emitter) {
	  var events = {};

	  var _loop = function _loop(eventName) {
	    var onEventName = 'on' + eventName.slice(0, 1).toUpperCase() + eventName.slice(1);

	    events[onEventName] = function (event) {
	      debug('event "%s"', onEventName, event);

	      emitter.trigger(eventName, event);
	    };
	  };

	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;

	  try {
	    for (var _iterator = _eventNames2.default[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var eventName = _step.value;

	      _loop(eventName);
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }

	  return events;
	};

	/**
	 * Delays player API method execution until player state is ready.
	 *
	 * @todo Proxy all of the methods using Object.keys.
	 * @todo See TRICKY below.
	 * @param playerAPIReady Promise that resolves when player is ready.
	 * @param strictState A flag designating whether or not to wait for
	 * an acceptable state when calling supported functions.
	 * @returns {Object}
	 */
	YouTubePlayer.promisifyPlayer = function (playerAPIReady) {
	  var strictState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  var functions = {};

	  var _loop2 = function _loop2(functionName) {
	    if (strictState && _FunctionStateMap2.default[functionName]) {
	      functions[functionName] = function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        return playerAPIReady.then(function (player) {
	          var stateInfo = _FunctionStateMap2.default[functionName];
	          var playerState = player.getPlayerState();

	          // eslint-disable-next-line no-warning-comments
	          // TODO: Just spread the args into the function once Babel is fixed:
	          // https://github.com/babel/babel/issues/4270
	          //
	          // eslint-disable-next-line prefer-spread
	          var value = player[functionName].apply(player, args);

	          // TRICKY: For functions like `seekTo`, a change in state must be
	          // triggered given that the resulting state could match the initial
	          // state.
	          if (stateInfo.stateChangeRequired ||

	          // eslint-disable-next-line no-extra-parens
	          Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerState) === -1) {
	            return new Promise(function (resolve) {
	              var onPlayerStateChange = function onPlayerStateChange() {
	                var playerStateAfterChange = player.getPlayerState();

	                var timeout = void 0;

	                if (typeof stateInfo.timeout === 'number') {
	                  timeout = setTimeout(function () {
	                    player.removeEventListener('onStateChange', onPlayerStateChange);

	                    resolve();
	                  }, stateInfo.timeout);
	                }

	                if (Array.isArray(stateInfo.acceptableStates) && stateInfo.acceptableStates.indexOf(playerStateAfterChange) !== -1) {
	                  player.removeEventListener('onStateChange', onPlayerStateChange);

	                  clearTimeout(timeout);

	                  resolve();
	                }
	              };

	              player.addEventListener('onStateChange', onPlayerStateChange);
	            }).then(function () {
	              return value;
	            });
	          }

	          return value;
	        });
	      };
	    } else {
	      functions[functionName] = function () {
	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	          args[_key2] = arguments[_key2];
	        }

	        return playerAPIReady.then(function (player) {
	          // eslint-disable-next-line no-warning-comments
	          // TODO: Just spread the args into the function once Babel is fixed:
	          // https://github.com/babel/babel/issues/4270
	          //
	          // eslint-disable-next-line prefer-spread
	          return player[functionName].apply(player, args);
	        });
	      };
	    }
	  };

	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    for (var _iterator2 = _functionNames2.default[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var functionName = _step2.value;

	      _loop2(functionName);
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  return functions;
	};

	exports.default = YouTubePlayer;
	module.exports = exports['default'];
	}(YouTubePlayer, YouTubePlayer.exports));

	(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _sister = sister;

	var _sister2 = _interopRequireDefault(_sister);

	var _loadYouTubeIframeApi = loadYouTubeIframeApi.exports;

	var _loadYouTubeIframeApi2 = _interopRequireDefault(_loadYouTubeIframeApi);

	var _YouTubePlayer = YouTubePlayer.exports;

	var _YouTubePlayer2 = _interopRequireDefault(_YouTubePlayer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @typedef YT.Player
	 * @see https://developers.google.com/youtube/iframe_api_reference
	 * */

	/**
	 * @see https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
	 */
	var youtubeIframeAPI = void 0;

	/**
	 * A factory function used to produce an instance of YT.Player and queue function calls and proxy events of the resulting object.
	 *
	 * @param maybeElementId Either An existing YT.Player instance,
	 * the DOM element or the id of the HTML element where the API will insert an <iframe>.
	 * @param options See `options` (Ignored when using an existing YT.Player instance).
	 * @param strictState A flag designating whether or not to wait for
	 * an acceptable state when calling supported functions. Default: `false`.
	 * See `FunctionStateMap.js` for supported functions and acceptable states.
	 */

	exports.default = function (maybeElementId) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var strictState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var emitter = (0, _sister2.default)();

	  if (!youtubeIframeAPI) {
	    youtubeIframeAPI = (0, _loadYouTubeIframeApi2.default)(emitter);
	  }

	  if (options.events) {
	    throw new Error('Event handlers cannot be overwritten.');
	  }

	  if (typeof maybeElementId === 'string' && !document.getElementById(maybeElementId)) {
	    throw new Error('Element "' + maybeElementId + '" does not exist.');
	  }

	  options.events = _YouTubePlayer2.default.proxyEvents(emitter);

	  var playerAPIReady = new Promise(function (resolve) {
	    if ((typeof maybeElementId === 'undefined' ? 'undefined' : _typeof(maybeElementId)) === 'object' && maybeElementId.playVideo instanceof Function) {
	      var player = maybeElementId;

	      resolve(player);
	    } else {
	      // asume maybeElementId can be rendered inside
	      // eslint-disable-next-line promise/catch-or-return
	      youtubeIframeAPI.then(function (YT) {
	        // eslint-disable-line promise/prefer-await-to-then
	        var player = new YT.Player(maybeElementId, options);

	        emitter.on('ready', function () {
	          resolve(player);
	        });

	        return null;
	      });
	    }
	  });

	  var playerApi = _YouTubePlayer2.default.promisifyPlayer(playerAPIReady, strictState);

	  playerApi.on = emitter.on;
	  playerApi.off = emitter.off;

	  return playerApi;
	};

	module.exports = exports['default'];
	}(dist, dist.exports));

	var t = /*@__PURE__*/getDefaultExportFromCjs(dist.exports);

	/*! @vimeo/player v2.16.2 | (c) 2021 Vimeo | MIT License | https://github.com/vimeo/player.js */
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	/**
	 * @module lib/functions
	 */

	/**
	 * Check to see this is a node environment.
	 * @type {Boolean}
	 */

	/* global global */
	var isNode = typeof global !== 'undefined' && {}.toString.call(global) === '[object global]';
	/**
	 * Get the name of the method for a given getter or setter.
	 *
	 * @param {string} prop The name of the property.
	 * @param {string} type Either “get” or “set”.
	 * @return {string}
	 */

	function getMethodName(prop, type) {
	  if (prop.indexOf(type.toLowerCase()) === 0) {
	    return prop;
	  }

	  return "".concat(type.toLowerCase()).concat(prop.substr(0, 1).toUpperCase()).concat(prop.substr(1));
	}
	/**
	 * Check to see if the object is a DOM Element.
	 *
	 * @param {*} element The object to check.
	 * @return {boolean}
	 */

	function isDomElement(element) {
	  return Boolean(element && element.nodeType === 1 && 'nodeName' in element && element.ownerDocument && element.ownerDocument.defaultView);
	}
	/**
	 * Check to see whether the value is a number.
	 *
	 * @see http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
	 * @param {*} value The value to check.
	 * @param {boolean} integer Check if the value is an integer.
	 * @return {boolean}
	 */

	function isInteger(value) {
	  // eslint-disable-next-line eqeqeq
	  return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value;
	}
	/**
	 * Check to see if the URL is a Vimeo url.
	 *
	 * @param {string} url The url string.
	 * @return {boolean}
	 */

	function isVimeoUrl(url) {
	  return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(url);
	}
	/**
	 * Get the Vimeo URL from an element.
	 * The element must have either a data-vimeo-id or data-vimeo-url attribute.
	 *
	 * @param {object} oEmbedParameters The oEmbed parameters.
	 * @return {string}
	 */

	function getVimeoUrl() {
	  var oEmbedParameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var id = oEmbedParameters.id;
	  var url = oEmbedParameters.url;
	  var idOrUrl = id || url;

	  if (!idOrUrl) {
	    throw new Error('An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.');
	  }

	  if (isInteger(idOrUrl)) {
	    return "https://vimeo.com/".concat(idOrUrl);
	  }

	  if (isVimeoUrl(idOrUrl)) {
	    return idOrUrl.replace('http:', 'https:');
	  }

	  if (id) {
	    throw new TypeError("\u201C".concat(id, "\u201D is not a valid video id."));
	  }

	  throw new TypeError("\u201C".concat(idOrUrl, "\u201D is not a vimeo.com url."));
	}

	var arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined';
	var postMessageSupport = typeof window !== 'undefined' && typeof window.postMessage !== 'undefined';

	if (!isNode && (!arrayIndexOfSupport || !postMessageSupport)) {
	  throw new Error('Sorry, the Vimeo Player API is not available in this browser.');
	}

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	/*!
	 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
	 * https://github.com/polygonplanet/weakmap-polyfill
	 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
	 * @license MIT
	 */
	(function (self) {

	  if (self.WeakMap) {
	    return;
	  }

	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  var hasDefine = Object.defineProperty && function () {
	    try {
	      // Avoid IE8's broken Object.defineProperty
	      return Object.defineProperty({}, 'x', {
	        value: 1
	      }).x === 1;
	    } catch (e) {}
	  }();

	  var defineProperty = function (object, name, value) {
	    if (hasDefine) {
	      Object.defineProperty(object, name, {
	        configurable: true,
	        writable: true,
	        value: value
	      });
	    } else {
	      object[name] = value;
	    }
	  };

	  self.WeakMap = function () {
	    // ECMA-262 23.3 WeakMap Objects
	    function WeakMap() {
	      if (this === void 0) {
	        throw new TypeError("Constructor WeakMap requires 'new'");
	      }

	      defineProperty(this, '_id', genId('_WeakMap')); // ECMA-262 23.3.1.1 WeakMap([iterable])

	      if (arguments.length > 0) {
	        // Currently, WeakMap `iterable` argument is not supported
	        throw new TypeError('WeakMap iterable is not supported');
	      }
	    } // ECMA-262 23.3.3.2 WeakMap.prototype.delete(key)


	    defineProperty(WeakMap.prototype, 'delete', function (key) {
	      checkInstance(this, 'delete');

	      if (!isObject(key)) {
	        return false;
	      }

	      var entry = key[this._id];

	      if (entry && entry[0] === key) {
	        delete key[this._id];
	        return true;
	      }

	      return false;
	    }); // ECMA-262 23.3.3.3 WeakMap.prototype.get(key)

	    defineProperty(WeakMap.prototype, 'get', function (key) {
	      checkInstance(this, 'get');

	      if (!isObject(key)) {
	        return void 0;
	      }

	      var entry = key[this._id];

	      if (entry && entry[0] === key) {
	        return entry[1];
	      }

	      return void 0;
	    }); // ECMA-262 23.3.3.4 WeakMap.prototype.has(key)

	    defineProperty(WeakMap.prototype, 'has', function (key) {
	      checkInstance(this, 'has');

	      if (!isObject(key)) {
	        return false;
	      }

	      var entry = key[this._id];

	      if (entry && entry[0] === key) {
	        return true;
	      }

	      return false;
	    }); // ECMA-262 23.3.3.5 WeakMap.prototype.set(key, value)

	    defineProperty(WeakMap.prototype, 'set', function (key, value) {
	      checkInstance(this, 'set');

	      if (!isObject(key)) {
	        throw new TypeError('Invalid value used as weak map key');
	      }

	      var entry = key[this._id];

	      if (entry && entry[0] === key) {
	        entry[1] = value;
	        return this;
	      }

	      defineProperty(key, this._id, [key, value]);
	      return this;
	    });

	    function checkInstance(x, methodName) {
	      if (!isObject(x) || !hasOwnProperty.call(x, '_id')) {
	        throw new TypeError(methodName + ' method called on incompatible receiver ' + typeof x);
	      }
	    }

	    function genId(prefix) {
	      return prefix + '_' + rand() + '.' + rand();
	    }

	    function rand() {
	      return Math.random().toString().substring(2);
	    }

	    defineProperty(WeakMap, '_polyfill', true);
	    return WeakMap;
	  }();

	  function isObject(x) {
	    return Object(x) === x;
	  }
	})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : commonjsGlobal);

	var npo_src = createCommonjsModule(function (module) {
	/*! Native Promise Only
	    v0.8.1 (c) Kyle Simpson
	    MIT License: http://getify.mit-license.org
	*/
	(function UMD(name, context, definition) {
	  // special form of UMD for polyfilling across evironments
	  context[name] = context[name] || definition();

	  if ( module.exports) {
	    module.exports = context[name];
	  }
	})("Promise", typeof commonjsGlobal != "undefined" ? commonjsGlobal : commonjsGlobal, function DEF() {

	  var builtInProp,
	      cycle,
	      scheduling_queue,
	      ToString = Object.prototype.toString,
	      timer = typeof setImmediate != "undefined" ? function timer(fn) {
	    return setImmediate(fn);
	  } : setTimeout; // dammit, IE8.

	  try {
	    Object.defineProperty({}, "x", {});

	    builtInProp = function builtInProp(obj, name, val, config) {
	      return Object.defineProperty(obj, name, {
	        value: val,
	        writable: true,
	        configurable: config !== false
	      });
	    };
	  } catch (err) {
	    builtInProp = function builtInProp(obj, name, val) {
	      obj[name] = val;
	      return obj;
	    };
	  } // Note: using a queue instead of array for efficiency


	  scheduling_queue = function Queue() {
	    var first, last, item;

	    function Item(fn, self) {
	      this.fn = fn;
	      this.self = self;
	      this.next = void 0;
	    }

	    return {
	      add: function add(fn, self) {
	        item = new Item(fn, self);

	        if (last) {
	          last.next = item;
	        } else {
	          first = item;
	        }

	        last = item;
	        item = void 0;
	      },
	      drain: function drain() {
	        var f = first;
	        first = last = cycle = void 0;

	        while (f) {
	          f.fn.call(f.self);
	          f = f.next;
	        }
	      }
	    };
	  }();

	  function schedule(fn, self) {
	    scheduling_queue.add(fn, self);

	    if (!cycle) {
	      cycle = timer(scheduling_queue.drain);
	    }
	  } // promise duck typing


	  function isThenable(o) {
	    var _then,
	        o_type = typeof o;

	    if (o != null && (o_type == "object" || o_type == "function")) {
	      _then = o.then;
	    }

	    return typeof _then == "function" ? _then : false;
	  }

	  function notify() {
	    for (var i = 0; i < this.chain.length; i++) {
	      notifyIsolated(this, this.state === 1 ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
	    }

	    this.chain.length = 0;
	  } // NOTE: This is a separate function to isolate
	  // the `try..catch` so that other code can be
	  // optimized better


	  function notifyIsolated(self, cb, chain) {
	    var ret, _then;

	    try {
	      if (cb === false) {
	        chain.reject(self.msg);
	      } else {
	        if (cb === true) {
	          ret = self.msg;
	        } else {
	          ret = cb.call(void 0, self.msg);
	        }

	        if (ret === chain.promise) {
	          chain.reject(TypeError("Promise-chain cycle"));
	        } else if (_then = isThenable(ret)) {
	          _then.call(ret, chain.resolve, chain.reject);
	        } else {
	          chain.resolve(ret);
	        }
	      }
	    } catch (err) {
	      chain.reject(err);
	    }
	  }

	  function resolve(msg) {
	    var _then,
	        self = this; // already triggered?


	    if (self.triggered) {
	      return;
	    }

	    self.triggered = true; // unwrap

	    if (self.def) {
	      self = self.def;
	    }

	    try {
	      if (_then = isThenable(msg)) {
	        schedule(function () {
	          var def_wrapper = new MakeDefWrapper(self);

	          try {
	            _then.call(msg, function $resolve$() {
	              resolve.apply(def_wrapper, arguments);
	            }, function $reject$() {
	              reject.apply(def_wrapper, arguments);
	            });
	          } catch (err) {
	            reject.call(def_wrapper, err);
	          }
	        });
	      } else {
	        self.msg = msg;
	        self.state = 1;

	        if (self.chain.length > 0) {
	          schedule(notify, self);
	        }
	      }
	    } catch (err) {
	      reject.call(new MakeDefWrapper(self), err);
	    }
	  }

	  function reject(msg) {
	    var self = this; // already triggered?

	    if (self.triggered) {
	      return;
	    }

	    self.triggered = true; // unwrap

	    if (self.def) {
	      self = self.def;
	    }

	    self.msg = msg;
	    self.state = 2;

	    if (self.chain.length > 0) {
	      schedule(notify, self);
	    }
	  }

	  function iteratePromises(Constructor, arr, resolver, rejecter) {
	    for (var idx = 0; idx < arr.length; idx++) {
	      (function IIFE(idx) {
	        Constructor.resolve(arr[idx]).then(function $resolver$(msg) {
	          resolver(idx, msg);
	        }, rejecter);
	      })(idx);
	    }
	  }

	  function MakeDefWrapper(self) {
	    this.def = self;
	    this.triggered = false;
	  }

	  function MakeDef(self) {
	    this.promise = self;
	    this.state = 0;
	    this.triggered = false;
	    this.chain = [];
	    this.msg = void 0;
	  }

	  function Promise(executor) {
	    if (typeof executor != "function") {
	      throw TypeError("Not a function");
	    }

	    if (this.__NPO__ !== 0) {
	      throw TypeError("Not a promise");
	    } // instance shadowing the inherited "brand"
	    // to signal an already "initialized" promise


	    this.__NPO__ = 1;
	    var def = new MakeDef(this);

	    this["then"] = function then(success, failure) {
	      var o = {
	        success: typeof success == "function" ? success : true,
	        failure: typeof failure == "function" ? failure : false
	      }; // Note: `then(..)` itself can be borrowed to be used against
	      // a different promise constructor for making the chained promise,
	      // by substituting a different `this` binding.

	      o.promise = new this.constructor(function extractChain(resolve, reject) {
	        if (typeof resolve != "function" || typeof reject != "function") {
	          throw TypeError("Not a function");
	        }

	        o.resolve = resolve;
	        o.reject = reject;
	      });
	      def.chain.push(o);

	      if (def.state !== 0) {
	        schedule(notify, def);
	      }

	      return o.promise;
	    };

	    this["catch"] = function $catch$(failure) {
	      return this.then(void 0, failure);
	    };

	    try {
	      executor.call(void 0, function publicResolve(msg) {
	        resolve.call(def, msg);
	      }, function publicReject(msg) {
	        reject.call(def, msg);
	      });
	    } catch (err) {
	      reject.call(def, err);
	    }
	  }

	  var PromisePrototype = builtInProp({}, "constructor", Promise,
	  /*configurable=*/
	  false); // Note: Android 4 cannot use `Object.defineProperty(..)` here

	  Promise.prototype = PromisePrototype; // built-in "brand" to signal an "uninitialized" promise

	  builtInProp(PromisePrototype, "__NPO__", 0,
	  /*configurable=*/
	  false);
	  builtInProp(Promise, "resolve", function Promise$resolve(msg) {
	    var Constructor = this; // spec mandated checks
	    // note: best "isPromise" check that's practical for now

	    if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
	      return msg;
	    }

	    return new Constructor(function executor(resolve, reject) {
	      if (typeof resolve != "function" || typeof reject != "function") {
	        throw TypeError("Not a function");
	      }

	      resolve(msg);
	    });
	  });
	  builtInProp(Promise, "reject", function Promise$reject(msg) {
	    return new this(function executor(resolve, reject) {
	      if (typeof resolve != "function" || typeof reject != "function") {
	        throw TypeError("Not a function");
	      }

	      reject(msg);
	    });
	  });
	  builtInProp(Promise, "all", function Promise$all(arr) {
	    var Constructor = this; // spec mandated checks

	    if (ToString.call(arr) != "[object Array]") {
	      return Constructor.reject(TypeError("Not an array"));
	    }

	    if (arr.length === 0) {
	      return Constructor.resolve([]);
	    }

	    return new Constructor(function executor(resolve, reject) {
	      if (typeof resolve != "function" || typeof reject != "function") {
	        throw TypeError("Not a function");
	      }

	      var len = arr.length,
	          msgs = Array(len),
	          count = 0;
	      iteratePromises(Constructor, arr, function resolver(idx, msg) {
	        msgs[idx] = msg;

	        if (++count === len) {
	          resolve(msgs);
	        }
	      }, reject);
	    });
	  });
	  builtInProp(Promise, "race", function Promise$race(arr) {
	    var Constructor = this; // spec mandated checks

	    if (ToString.call(arr) != "[object Array]") {
	      return Constructor.reject(TypeError("Not an array"));
	    }

	    return new Constructor(function executor(resolve, reject) {
	      if (typeof resolve != "function" || typeof reject != "function") {
	        throw TypeError("Not a function");
	      }

	      iteratePromises(Constructor, arr, function resolver(idx, msg) {
	        resolve(msg);
	      }, reject);
	    });
	  });
	  return Promise;
	});
	});

	/**
	 * @module lib/callbacks
	 */
	var callbackMap = new WeakMap();
	/**
	 * Store a callback for a method or event for a player.
	 *
	 * @param {Player} player The player object.
	 * @param {string} name The method or event name.
	 * @param {(function(this:Player, *): void|{resolve: function, reject: function})} callback
	 *        The callback to call or an object with resolve and reject functions for a promise.
	 * @return {void}
	 */

	function storeCallback(player, name, callback) {
	  var playerCallbacks = callbackMap.get(player.element) || {};

	  if (!(name in playerCallbacks)) {
	    playerCallbacks[name] = [];
	  }

	  playerCallbacks[name].push(callback);
	  callbackMap.set(player.element, playerCallbacks);
	}
	/**
	 * Get the callbacks for a player and event or method.
	 *
	 * @param {Player} player The player object.
	 * @param {string} name The method or event name
	 * @return {function[]}
	 */

	function getCallbacks(player, name) {
	  var playerCallbacks = callbackMap.get(player.element) || {};
	  return playerCallbacks[name] || [];
	}
	/**
	 * Remove a stored callback for a method or event for a player.
	 *
	 * @param {Player} player The player object.
	 * @param {string} name The method or event name
	 * @param {function} [callback] The specific callback to remove.
	 * @return {boolean} Was this the last callback?
	 */

	function removeCallback(player, name, callback) {
	  var playerCallbacks = callbackMap.get(player.element) || {};

	  if (!playerCallbacks[name]) {
	    return true;
	  } // If no callback is passed, remove all callbacks for the event


	  if (!callback) {
	    playerCallbacks[name] = [];
	    callbackMap.set(player.element, playerCallbacks);
	    return true;
	  }

	  var index = playerCallbacks[name].indexOf(callback);

	  if (index !== -1) {
	    playerCallbacks[name].splice(index, 1);
	  }

	  callbackMap.set(player.element, playerCallbacks);
	  return playerCallbacks[name] && playerCallbacks[name].length === 0;
	}
	/**
	 * Return the first stored callback for a player and event or method.
	 *
	 * @param {Player} player The player object.
	 * @param {string} name The method or event name.
	 * @return {function} The callback, or false if there were none
	 */

	function shiftCallbacks(player, name) {
	  var playerCallbacks = getCallbacks(player, name);

	  if (playerCallbacks.length < 1) {
	    return false;
	  }

	  var callback = playerCallbacks.shift();
	  removeCallback(player, name, callback);
	  return callback;
	}
	/**
	 * Move callbacks associated with an element to another element.
	 *
	 * @param {HTMLElement} oldElement The old element.
	 * @param {HTMLElement} newElement The new element.
	 * @return {void}
	 */

	function swapCallbacks(oldElement, newElement) {
	  var playerCallbacks = callbackMap.get(oldElement);
	  callbackMap.set(newElement, playerCallbacks);
	  callbackMap.delete(oldElement);
	}

	/**
	 * @module lib/embed
	 */
	var oEmbedParameters = ['autopause', 'autoplay', 'background', 'byline', 'color', 'controls', 'dnt', 'height', 'id', 'keyboard', 'loop', 'maxheight', 'maxwidth', 'muted', 'playsinline', 'portrait', 'responsive', 'speed', 'texttrack', 'title', 'transparent', 'url', 'width'];
	/**
	 * Get the 'data-vimeo'-prefixed attributes from an element as an object.
	 *
	 * @param {HTMLElement} element The element.
	 * @param {Object} [defaults={}] The default values to use.
	 * @return {Object<string, string>}
	 */

	function getOEmbedParameters(element) {
	  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  return oEmbedParameters.reduce(function (params, param) {
	    var value = element.getAttribute("data-vimeo-".concat(param));

	    if (value || value === '') {
	      params[param] = value === '' ? 1 : value;
	    }

	    return params;
	  }, defaults);
	}
	/**
	 * Create an embed from oEmbed data inside an element.
	 *
	 * @param {object} data The oEmbed data.
	 * @param {HTMLElement} element The element to put the iframe in.
	 * @return {HTMLIFrameElement} The iframe embed.
	 */

	function createEmbed(_ref, element) {
	  var html = _ref.html;

	  if (!element) {
	    throw new TypeError('An element must be provided');
	  }

	  if (element.getAttribute('data-vimeo-initialized') !== null) {
	    return element.querySelector('iframe');
	  }

	  var div = document.createElement('div');
	  div.innerHTML = html;
	  element.appendChild(div.firstChild);
	  element.setAttribute('data-vimeo-initialized', 'true');
	  return element.querySelector('iframe');
	}
	/**
	 * Make an oEmbed call for the specified URL.
	 *
	 * @param {string} videoUrl The vimeo.com url for the video.
	 * @param {Object} [params] Parameters to pass to oEmbed.
	 * @param {HTMLElement} element The element.
	 * @return {Promise}
	 */

	function getOEmbedData(videoUrl) {
	  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var element = arguments.length > 2 ? arguments[2] : undefined;
	  return new Promise(function (resolve, reject) {
	    if (!isVimeoUrl(videoUrl)) {
	      throw new TypeError("\u201C".concat(videoUrl, "\u201D is not a vimeo.com url."));
	    }

	    var url = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(videoUrl));

	    for (var param in params) {
	      if (params.hasOwnProperty(param)) {
	        url += "&".concat(param, "=").concat(encodeURIComponent(params[param]));
	      }
	    }

	    var xhr = 'XDomainRequest' in window ? new XDomainRequest() : new XMLHttpRequest();
	    xhr.open('GET', url, true);

	    xhr.onload = function () {
	      if (xhr.status === 404) {
	        reject(new Error("\u201C".concat(videoUrl, "\u201D was not found.")));
	        return;
	      }

	      if (xhr.status === 403) {
	        reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
	        return;
	      }

	      try {
	        var json = JSON.parse(xhr.responseText); // Check api response for 403 on oembed

	        if (json.domain_status_code === 403) {
	          // We still want to create the embed to give users visual feedback
	          createEmbed(json, element);
	          reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
	          return;
	        }

	        resolve(json);
	      } catch (error) {
	        reject(error);
	      }
	    };

	    xhr.onerror = function () {
	      var status = xhr.status ? " (".concat(xhr.status, ")") : '';
	      reject(new Error("There was an error fetching the embed code from Vimeo".concat(status, ".")));
	    };

	    xhr.send();
	  });
	}
	/**
	 * Initialize all embeds within a specific element
	 *
	 * @param {HTMLElement} [parent=document] The parent element.
	 * @return {void}
	 */

	function initializeEmbeds() {
	  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
	  var elements = [].slice.call(parent.querySelectorAll('[data-vimeo-id], [data-vimeo-url]'));

	  var handleError = function handleError(error) {
	    if ('console' in window && console.error) {
	      console.error("There was an error creating an embed: ".concat(error));
	    }
	  };

	  elements.forEach(function (element) {
	    try {
	      // Skip any that have data-vimeo-defer
	      if (element.getAttribute('data-vimeo-defer') !== null) {
	        return;
	      }

	      var params = getOEmbedParameters(element);
	      var url = getVimeoUrl(params);
	      getOEmbedData(url, params, element).then(function (data) {
	        return createEmbed(data, element);
	      }).catch(handleError);
	    } catch (error) {
	      handleError(error);
	    }
	  });
	}
	/**
	 * Resize embeds when messaged by the player.
	 *
	 * @param {HTMLElement} [parent=document] The parent element.
	 * @return {void}
	 */

	function resizeEmbeds() {
	  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

	  // Prevent execution if users include the player.js script multiple times.
	  if (window.VimeoPlayerResizeEmbeds_) {
	    return;
	  }

	  window.VimeoPlayerResizeEmbeds_ = true;

	  var onMessage = function onMessage(event) {
	    if (!isVimeoUrl(event.origin)) {
	      return;
	    } // 'spacechange' is fired only on embeds with cards


	    if (!event.data || event.data.event !== 'spacechange') {
	      return;
	    }

	    var iframes = parent.querySelectorAll('iframe');

	    for (var i = 0; i < iframes.length; i++) {
	      if (iframes[i].contentWindow !== event.source) {
	        continue;
	      } // Change padding-bottom of the enclosing div to accommodate
	      // card carousel without distorting aspect ratio


	      var space = iframes[i].parentElement;
	      space.style.paddingBottom = "".concat(event.data.data[0].bottom, "px");
	      break;
	    }
	  };

	  window.addEventListener('message', onMessage);
	}

	/**
	 * @module lib/postmessage
	 */
	/**
	 * Parse a message received from postMessage.
	 *
	 * @param {*} data The data received from postMessage.
	 * @return {object}
	 */

	function parseMessageData(data) {
	  if (typeof data === 'string') {
	    try {
	      data = JSON.parse(data);
	    } catch (error) {
	      // If the message cannot be parsed, throw the error as a warning
	      console.warn(error);
	      return {};
	    }
	  }

	  return data;
	}
	/**
	 * Post a message to the specified target.
	 *
	 * @param {Player} player The player object to use.
	 * @param {string} method The API method to call.
	 * @param {object} params The parameters to send to the player.
	 * @return {void}
	 */

	function postMessage(player, method, params) {
	  if (!player.element.contentWindow || !player.element.contentWindow.postMessage) {
	    return;
	  }

	  var message = {
	    method: method
	  };

	  if (params !== undefined) {
	    message.value = params;
	  } // IE 8 and 9 do not support passing messages, so stringify them


	  var ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, '$1'));

	  if (ieVersion >= 8 && ieVersion < 10) {
	    message = JSON.stringify(message);
	  }

	  player.element.contentWindow.postMessage(message, player.origin);
	}
	/**
	 * Parse the data received from a message event.
	 *
	 * @param {Player} player The player that received the message.
	 * @param {(Object|string)} data The message data. Strings will be parsed into JSON.
	 * @return {void}
	 */

	function processData(player, data) {
	  data = parseMessageData(data);
	  var callbacks = [];
	  var param;

	  if (data.event) {
	    if (data.event === 'error') {
	      var promises = getCallbacks(player, data.data.method);
	      promises.forEach(function (promise) {
	        var error = new Error(data.data.message);
	        error.name = data.data.name;
	        promise.reject(error);
	        removeCallback(player, data.data.method, promise);
	      });
	    }

	    callbacks = getCallbacks(player, "event:".concat(data.event));
	    param = data.data;
	  } else if (data.method) {
	    var callback = shiftCallbacks(player, data.method);

	    if (callback) {
	      callbacks.push(callback);
	      param = data.value;
	    }
	  }

	  callbacks.forEach(function (callback) {
	    try {
	      if (typeof callback === 'function') {
	        callback.call(player, param);
	        return;
	      }

	      callback.resolve(param);
	    } catch (e) {// empty
	    }
	  });
	}

	/* MIT License

	Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	Terms */
	function initializeScreenfull() {
	  var fn = function () {
	    var val;
	    var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], // New WebKit
	    ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], // Old WebKit
	    ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];
	    var i = 0;
	    var l = fnMap.length;
	    var ret = {};

	    for (; i < l; i++) {
	      val = fnMap[i];

	      if (val && val[1] in document) {
	        for (i = 0; i < val.length; i++) {
	          ret[fnMap[0][i]] = val[i];
	        }

	        return ret;
	      }
	    }

	    return false;
	  }();

	  var eventNameMap = {
	    fullscreenchange: fn.fullscreenchange,
	    fullscreenerror: fn.fullscreenerror
	  };
	  var screenfull = {
	    request: function request(element) {
	      return new Promise(function (resolve, reject) {
	        var onFullScreenEntered = function onFullScreenEntered() {
	          screenfull.off('fullscreenchange', onFullScreenEntered);
	          resolve();
	        };

	        screenfull.on('fullscreenchange', onFullScreenEntered);
	        element = element || document.documentElement;
	        var returnPromise = element[fn.requestFullscreen]();

	        if (returnPromise instanceof Promise) {
	          returnPromise.then(onFullScreenEntered).catch(reject);
	        }
	      });
	    },
	    exit: function exit() {
	      return new Promise(function (resolve, reject) {
	        if (!screenfull.isFullscreen) {
	          resolve();
	          return;
	        }

	        var onFullScreenExit = function onFullScreenExit() {
	          screenfull.off('fullscreenchange', onFullScreenExit);
	          resolve();
	        };

	        screenfull.on('fullscreenchange', onFullScreenExit);
	        var returnPromise = document[fn.exitFullscreen]();

	        if (returnPromise instanceof Promise) {
	          returnPromise.then(onFullScreenExit).catch(reject);
	        }
	      });
	    },
	    on: function on(event, callback) {
	      var eventName = eventNameMap[event];

	      if (eventName) {
	        document.addEventListener(eventName, callback);
	      }
	    },
	    off: function off(event, callback) {
	      var eventName = eventNameMap[event];

	      if (eventName) {
	        document.removeEventListener(eventName, callback);
	      }
	    }
	  };
	  Object.defineProperties(screenfull, {
	    isFullscreen: {
	      get: function get() {
	        return Boolean(document[fn.fullscreenElement]);
	      }
	    },
	    element: {
	      enumerable: true,
	      get: function get() {
	        return document[fn.fullscreenElement];
	      }
	    },
	    isEnabled: {
	      enumerable: true,
	      get: function get() {
	        // Coerce to boolean in case of old WebKit
	        return Boolean(document[fn.fullscreenEnabled]);
	      }
	    }
	  });
	  return screenfull;
	}

	var playerMap = new WeakMap();
	var readyMap = new WeakMap();
	var screenfull = {};

	var Player = /*#__PURE__*/function () {
	  /**
	   * Create a Player.
	   *
	   * @param {(HTMLIFrameElement|HTMLElement|string|jQuery)} element A reference to the Vimeo
	   *        player iframe, and id, or a jQuery object.
	   * @param {object} [options] oEmbed parameters to use when creating an embed in the element.
	   * @return {Player}
	   */
	  function Player(element) {
	    var _this = this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Player);

	    /* global jQuery */
	    if (window.jQuery && element instanceof jQuery) {
	      if (element.length > 1 && window.console && console.warn) {
	        console.warn('A jQuery object with multiple elements was passed, using the first element.');
	      }

	      element = element[0];
	    } // Find an element by ID


	    if (typeof document !== 'undefined' && typeof element === 'string') {
	      element = document.getElementById(element);
	    } // Not an element!


	    if (!isDomElement(element)) {
	      throw new TypeError('You must pass either a valid element or a valid id.');
	    } // Already initialized an embed in this div, so grab the iframe


	    if (element.nodeName !== 'IFRAME') {
	      var iframe = element.querySelector('iframe');

	      if (iframe) {
	        element = iframe;
	      }
	    } // iframe url is not a Vimeo url


	    if (element.nodeName === 'IFRAME' && !isVimeoUrl(element.getAttribute('src') || '')) {
	      throw new Error('The player element passed isn’t a Vimeo embed.');
	    } // If there is already a player object in the map, return that


	    if (playerMap.has(element)) {
	      return playerMap.get(element);
	    }

	    this._window = element.ownerDocument.defaultView;
	    this.element = element;
	    this.origin = '*';
	    var readyPromise = new npo_src(function (resolve, reject) {
	      _this._onMessage = function (event) {
	        if (!isVimeoUrl(event.origin) || _this.element.contentWindow !== event.source) {
	          return;
	        }

	        if (_this.origin === '*') {
	          _this.origin = event.origin;
	        }

	        var data = parseMessageData(event.data);
	        var isError = data && data.event === 'error';
	        var isReadyError = isError && data.data && data.data.method === 'ready';

	        if (isReadyError) {
	          var error = new Error(data.data.message);
	          error.name = data.data.name;
	          reject(error);
	          return;
	        }

	        var isReadyEvent = data && data.event === 'ready';
	        var isPingResponse = data && data.method === 'ping';

	        if (isReadyEvent || isPingResponse) {
	          _this.element.setAttribute('data-ready', 'true');

	          resolve();
	          return;
	        }

	        processData(_this, data);
	      };

	      _this._window.addEventListener('message', _this._onMessage);

	      if (_this.element.nodeName !== 'IFRAME') {
	        var params = getOEmbedParameters(element, options);
	        var url = getVimeoUrl(params);
	        getOEmbedData(url, params, element).then(function (data) {
	          var iframe = createEmbed(data, element); // Overwrite element with the new iframe,
	          // but store reference to the original element

	          _this.element = iframe;
	          _this._originalElement = element;
	          swapCallbacks(element, iframe);
	          playerMap.set(_this.element, _this);
	          return data;
	        }).catch(reject);
	      }
	    }); // Store a copy of this Player in the map

	    readyMap.set(this, readyPromise);
	    playerMap.set(this.element, this); // Send a ping to the iframe so the ready promise will be resolved if
	    // the player is already ready.

	    if (this.element.nodeName === 'IFRAME') {
	      postMessage(this, 'ping');
	    }

	    if (screenfull.isEnabled) {
	      var exitFullscreen = function exitFullscreen() {
	        return screenfull.exit();
	      };

	      this.fullscreenchangeHandler = function () {
	        if (screenfull.isFullscreen) {
	          storeCallback(_this, 'event:exitFullscreen', exitFullscreen);
	        } else {
	          removeCallback(_this, 'event:exitFullscreen', exitFullscreen);
	        } // eslint-disable-next-line


	        _this.ready().then(function () {
	          postMessage(_this, 'fullscreenchange', screenfull.isFullscreen);
	        });
	      };

	      screenfull.on('fullscreenchange', this.fullscreenchangeHandler);
	    }

	    return this;
	  }
	  /**
	   * Get a promise for a method.
	   *
	   * @param {string} name The API method to call.
	   * @param {Object} [args={}] Arguments to send via postMessage.
	   * @return {Promise}
	   */


	  _createClass(Player, [{
	    key: "callMethod",
	    value: function callMethod(name) {
	      var _this2 = this;

	      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      return new npo_src(function (resolve, reject) {
	        // We are storing the resolve/reject handlers to call later, so we
	        // can’t return here.
	        // eslint-disable-next-line promise/always-return
	        return _this2.ready().then(function () {
	          storeCallback(_this2, name, {
	            resolve: resolve,
	            reject: reject
	          });
	          postMessage(_this2, name, args);
	        }).catch(reject);
	      });
	    }
	    /**
	     * Get a promise for the value of a player property.
	     *
	     * @param {string} name The property name
	     * @return {Promise}
	     */

	  }, {
	    key: "get",
	    value: function get(name) {
	      var _this3 = this;

	      return new npo_src(function (resolve, reject) {
	        name = getMethodName(name, 'get'); // We are storing the resolve/reject handlers to call later, so we
	        // can’t return here.
	        // eslint-disable-next-line promise/always-return

	        return _this3.ready().then(function () {
	          storeCallback(_this3, name, {
	            resolve: resolve,
	            reject: reject
	          });
	          postMessage(_this3, name);
	        }).catch(reject);
	      });
	    }
	    /**
	     * Get a promise for setting the value of a player property.
	     *
	     * @param {string} name The API method to call.
	     * @param {mixed} value The value to set.
	     * @return {Promise}
	     */

	  }, {
	    key: "set",
	    value: function set(name, value) {
	      var _this4 = this;

	      return new npo_src(function (resolve, reject) {
	        name = getMethodName(name, 'set');

	        if (value === undefined || value === null) {
	          throw new TypeError('There must be a value to set.');
	        } // We are storing the resolve/reject handlers to call later, so we
	        // can’t return here.
	        // eslint-disable-next-line promise/always-return


	        return _this4.ready().then(function () {
	          storeCallback(_this4, name, {
	            resolve: resolve,
	            reject: reject
	          });
	          postMessage(_this4, name, value);
	        }).catch(reject);
	      });
	    }
	    /**
	     * Add an event listener for the specified event. Will call the
	     * callback with a single parameter, `data`, that contains the data for
	     * that event.
	     *
	     * @param {string} eventName The name of the event.
	     * @param {function(*)} callback The function to call when the event fires.
	     * @return {void}
	     */

	  }, {
	    key: "on",
	    value: function on(eventName, callback) {
	      if (!eventName) {
	        throw new TypeError('You must pass an event name.');
	      }

	      if (!callback) {
	        throw new TypeError('You must pass a callback function.');
	      }

	      if (typeof callback !== 'function') {
	        throw new TypeError('The callback must be a function.');
	      }

	      var callbacks = getCallbacks(this, "event:".concat(eventName));

	      if (callbacks.length === 0) {
	        this.callMethod('addEventListener', eventName).catch(function () {// Ignore the error. There will be an error event fired that
	          // will trigger the error callback if they are listening.
	        });
	      }

	      storeCallback(this, "event:".concat(eventName), callback);
	    }
	    /**
	     * Remove an event listener for the specified event. Will remove all
	     * listeners for that event if a `callback` isn’t passed, or only that
	     * specific callback if it is passed.
	     *
	     * @param {string} eventName The name of the event.
	     * @param {function} [callback] The specific callback to remove.
	     * @return {void}
	     */

	  }, {
	    key: "off",
	    value: function off(eventName, callback) {
	      if (!eventName) {
	        throw new TypeError('You must pass an event name.');
	      }

	      if (callback && typeof callback !== 'function') {
	        throw new TypeError('The callback must be a function.');
	      }

	      var lastCallback = removeCallback(this, "event:".concat(eventName), callback); // If there are no callbacks left, remove the listener

	      if (lastCallback) {
	        this.callMethod('removeEventListener', eventName).catch(function (e) {// Ignore the error. There will be an error event fired that
	          // will trigger the error callback if they are listening.
	        });
	      }
	    }
	    /**
	     * A promise to load a new video.
	     *
	     * @promise LoadVideoPromise
	     * @fulfill {number} The video with this id or url successfully loaded.
	     * @reject {TypeError} The id was not a number.
	     */

	    /**
	     * Load a new video into this embed. The promise will be resolved if
	     * the video is successfully loaded, or it will be rejected if it could
	     * not be loaded.
	     *
	     * @param {number|string|object} options The id of the video, the url of the video, or an object with embed options.
	     * @return {LoadVideoPromise}
	     */

	  }, {
	    key: "loadVideo",
	    value: function loadVideo(options) {
	      return this.callMethod('loadVideo', options);
	    }
	    /**
	     * A promise to perform an action when the Player is ready.
	     *
	     * @todo document errors
	     * @promise LoadVideoPromise
	     * @fulfill {void}
	     */

	    /**
	     * Trigger a function when the player iframe has initialized. You do not
	     * need to wait for `ready` to trigger to begin adding event listeners
	     * or calling other methods.
	     *
	     * @return {ReadyPromise}
	     */

	  }, {
	    key: "ready",
	    value: function ready() {
	      var readyPromise = readyMap.get(this) || new npo_src(function (resolve, reject) {
	        reject(new Error('Unknown player. Probably unloaded.'));
	      });
	      return npo_src.resolve(readyPromise);
	    }
	    /**
	     * A promise to add a cue point to the player.
	     *
	     * @promise AddCuePointPromise
	     * @fulfill {string} The id of the cue point to use for removeCuePoint.
	     * @reject {RangeError} the time was less than 0 or greater than the
	     *         video’s duration.
	     * @reject {UnsupportedError} Cue points are not supported with the current
	     *         player or browser.
	     */

	    /**
	     * Add a cue point to the player.
	     *
	     * @param {number} time The time for the cue point.
	     * @param {object} [data] Arbitrary data to be returned with the cue point.
	     * @return {AddCuePointPromise}
	     */

	  }, {
	    key: "addCuePoint",
	    value: function addCuePoint(time) {
	      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      return this.callMethod('addCuePoint', {
	        time: time,
	        data: data
	      });
	    }
	    /**
	     * A promise to remove a cue point from the player.
	     *
	     * @promise AddCuePointPromise
	     * @fulfill {string} The id of the cue point that was removed.
	     * @reject {InvalidCuePoint} The cue point with the specified id was not
	     *         found.
	     * @reject {UnsupportedError} Cue points are not supported with the current
	     *         player or browser.
	     */

	    /**
	     * Remove a cue point from the video.
	     *
	     * @param {string} id The id of the cue point to remove.
	     * @return {RemoveCuePointPromise}
	     */

	  }, {
	    key: "removeCuePoint",
	    value: function removeCuePoint(id) {
	      return this.callMethod('removeCuePoint', id);
	    }
	    /**
	     * A representation of a text track on a video.
	     *
	     * @typedef {Object} VimeoTextTrack
	     * @property {string} language The ISO language code.
	     * @property {string} kind The kind of track it is (captions or subtitles).
	     * @property {string} label The human‐readable label for the track.
	     */

	    /**
	     * A promise to enable a text track.
	     *
	     * @promise EnableTextTrackPromise
	     * @fulfill {VimeoTextTrack} The text track that was enabled.
	     * @reject {InvalidTrackLanguageError} No track was available with the
	     *         specified language.
	     * @reject {InvalidTrackError} No track was available with the specified
	     *         language and kind.
	     */

	    /**
	     * Enable the text track with the specified language, and optionally the
	     * specified kind (captions or subtitles).
	     *
	     * When set via the API, the track language will not change the viewer’s
	     * stored preference.
	     *
	     * @param {string} language The two‐letter language code.
	     * @param {string} [kind] The kind of track to enable (captions or subtitles).
	     * @return {EnableTextTrackPromise}
	     */

	  }, {
	    key: "enableTextTrack",
	    value: function enableTextTrack(language, kind) {
	      if (!language) {
	        throw new TypeError('You must pass a language.');
	      }

	      return this.callMethod('enableTextTrack', {
	        language: language,
	        kind: kind
	      });
	    }
	    /**
	     * A promise to disable the active text track.
	     *
	     * @promise DisableTextTrackPromise
	     * @fulfill {void} The track was disabled.
	     */

	    /**
	     * Disable the currently-active text track.
	     *
	     * @return {DisableTextTrackPromise}
	     */

	  }, {
	    key: "disableTextTrack",
	    value: function disableTextTrack() {
	      return this.callMethod('disableTextTrack');
	    }
	    /**
	     * A promise to pause the video.
	     *
	     * @promise PausePromise
	     * @fulfill {void} The video was paused.
	     */

	    /**
	     * Pause the video if it’s playing.
	     *
	     * @return {PausePromise}
	     */

	  }, {
	    key: "pause",
	    value: function pause() {
	      return this.callMethod('pause');
	    }
	    /**
	     * A promise to play the video.
	     *
	     * @promise PlayPromise
	     * @fulfill {void} The video was played.
	     */

	    /**
	     * Play the video if it’s paused. **Note:** on iOS and some other
	     * mobile devices, you cannot programmatically trigger play. Once the
	     * viewer has tapped on the play button in the player, however, you
	     * will be able to use this function.
	     *
	     * @return {PlayPromise}
	     */

	  }, {
	    key: "play",
	    value: function play() {
	      return this.callMethod('play');
	    }
	    /**
	     * Request that the player enters fullscreen.
	     * @return {Promise}
	     */

	  }, {
	    key: "requestFullscreen",
	    value: function requestFullscreen() {
	      if (screenfull.isEnabled) {
	        return screenfull.request(this.element);
	      }

	      return this.callMethod('requestFullscreen');
	    }
	    /**
	     * Request that the player exits fullscreen.
	     * @return {Promise}
	     */

	  }, {
	    key: "exitFullscreen",
	    value: function exitFullscreen() {
	      if (screenfull.isEnabled) {
	        return screenfull.exit();
	      }

	      return this.callMethod('exitFullscreen');
	    }
	    /**
	     * Returns true if the player is currently fullscreen.
	     * @return {Promise}
	     */

	  }, {
	    key: "getFullscreen",
	    value: function getFullscreen() {
	      if (screenfull.isEnabled) {
	        return npo_src.resolve(screenfull.isFullscreen);
	      }

	      return this.get('fullscreen');
	    }
	    /**
	     * Request that the player enters picture-in-picture.
	     * @return {Promise}
	     */

	  }, {
	    key: "requestPictureInPicture",
	    value: function requestPictureInPicture() {
	      return this.callMethod('requestPictureInPicture');
	    }
	    /**
	     * Request that the player exits picture-in-picture.
	     * @return {Promise}
	     */

	  }, {
	    key: "exitPictureInPicture",
	    value: function exitPictureInPicture() {
	      return this.callMethod('exitPictureInPicture');
	    }
	    /**
	     * Returns true if the player is currently picture-in-picture.
	     * @return {Promise}
	     */

	  }, {
	    key: "getPictureInPicture",
	    value: function getPictureInPicture() {
	      return this.get('pictureInPicture');
	    }
	    /**
	     * A promise to unload the video.
	     *
	     * @promise UnloadPromise
	     * @fulfill {void} The video was unloaded.
	     */

	    /**
	     * Return the player to its initial state.
	     *
	     * @return {UnloadPromise}
	     */

	  }, {
	    key: "unload",
	    value: function unload() {
	      return this.callMethod('unload');
	    }
	    /**
	     * Cleanup the player and remove it from the DOM
	     *
	     * It won't be usable and a new one should be constructed
	     *  in order to do any operations.
	     *
	     * @return {Promise}
	     */

	  }, {
	    key: "destroy",
	    value: function destroy() {
	      var _this5 = this;

	      return new npo_src(function (resolve) {
	        readyMap.delete(_this5);
	        playerMap.delete(_this5.element);

	        if (_this5._originalElement) {
	          playerMap.delete(_this5._originalElement);

	          _this5._originalElement.removeAttribute('data-vimeo-initialized');
	        }

	        if (_this5.element && _this5.element.nodeName === 'IFRAME' && _this5.element.parentNode) {
	          // If we've added an additional wrapper div, remove that from the DOM.
	          // If not, just remove the iframe element.
	          if (_this5.element.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== _this5.element.parentNode) {
	            _this5.element.parentNode.parentNode.removeChild(_this5.element.parentNode);
	          } else {
	            _this5.element.parentNode.removeChild(_this5.element);
	          }
	        } // If the clip is private there is a case where the element stays the
	        // div element. Destroy should reset the div and remove the iframe child.


	        if (_this5.element && _this5.element.nodeName === 'DIV' && _this5.element.parentNode) {
	          _this5.element.removeAttribute('data-vimeo-initialized');

	          var iframe = _this5.element.querySelector('iframe');

	          if (iframe && iframe.parentNode) {
	            // If we've added an additional wrapper div, remove that from the DOM.
	            // If not, just remove the iframe element.
	            if (iframe.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== iframe.parentNode) {
	              iframe.parentNode.parentNode.removeChild(iframe.parentNode);
	            } else {
	              iframe.parentNode.removeChild(iframe);
	            }
	          }
	        }

	        _this5._window.removeEventListener('message', _this5._onMessage);

	        if (screenfull.isEnabled) {
	          screenfull.off('fullscreenchange', _this5.fullscreenchangeHandler);
	        }

	        resolve();
	      });
	    }
	    /**
	     * A promise to get the autopause behavior of the video.
	     *
	     * @promise GetAutopausePromise
	     * @fulfill {boolean} Whether autopause is turned on or off.
	     * @reject {UnsupportedError} Autopause is not supported with the current
	     *         player or browser.
	     */

	    /**
	     * Get the autopause behavior for this player.
	     *
	     * @return {GetAutopausePromise}
	     */

	  }, {
	    key: "getAutopause",
	    value: function getAutopause() {
	      return this.get('autopause');
	    }
	    /**
	     * A promise to set the autopause behavior of the video.
	     *
	     * @promise SetAutopausePromise
	     * @fulfill {boolean} Whether autopause is turned on or off.
	     * @reject {UnsupportedError} Autopause is not supported with the current
	     *         player or browser.
	     */

	    /**
	     * Enable or disable the autopause behavior of this player.
	     *
	     * By default, when another video is played in the same browser, this
	     * player will automatically pause. Unless you have a specific reason
	     * for doing so, we recommend that you leave autopause set to the
	     * default (`true`).
	     *
	     * @param {boolean} autopause
	     * @return {SetAutopausePromise}
	     */

	  }, {
	    key: "setAutopause",
	    value: function setAutopause(autopause) {
	      return this.set('autopause', autopause);
	    }
	    /**
	     * A promise to get the buffered property of the video.
	     *
	     * @promise GetBufferedPromise
	     * @fulfill {Array} Buffered Timeranges converted to an Array.
	     */

	    /**
	     * Get the buffered property of the video.
	     *
	     * @return {GetBufferedPromise}
	     */

	  }, {
	    key: "getBuffered",
	    value: function getBuffered() {
	      return this.get('buffered');
	    }
	    /**
	     * @typedef {Object} CameraProperties
	     * @prop {number} props.yaw - Number between 0 and 360.
	     * @prop {number} props.pitch - Number between -90 and 90.
	     * @prop {number} props.roll - Number between -180 and 180.
	     * @prop {number} props.fov - The field of view in degrees.
	     */

	    /**
	     * A promise to get the camera properties of the player.
	     *
	     * @promise GetCameraPromise
	     * @fulfill {CameraProperties} The camera properties.
	     */

	    /**
	     * For 360° videos get the camera properties for this player.
	     *
	     * @return {GetCameraPromise}
	     */

	  }, {
	    key: "getCameraProps",
	    value: function getCameraProps() {
	      return this.get('cameraProps');
	    }
	    /**
	     * A promise to set the camera properties of the player.
	     *
	     * @promise SetCameraPromise
	     * @fulfill {Object} The camera was successfully set.
	     * @reject {RangeError} The range was out of bounds.
	     */

	    /**
	     * For 360° videos set the camera properties for this player.
	     *
	     * @param {CameraProperties} camera The camera properties
	     * @return {SetCameraPromise}
	     */

	  }, {
	    key: "setCameraProps",
	    value: function setCameraProps(camera) {
	      return this.set('cameraProps', camera);
	    }
	    /**
	     * A representation of a chapter.
	     *
	     * @typedef {Object} VimeoChapter
	     * @property {number} startTime The start time of the chapter.
	     * @property {object} title The title of the chapter.
	     * @property {number} index The place in the order of Chapters. Starts at 1.
	     */

	    /**
	     * A promise to get chapters for the video.
	     *
	     * @promise GetChaptersPromise
	     * @fulfill {VimeoChapter[]} The chapters for the video.
	     */

	    /**
	     * Get an array of all the chapters for the video.
	     *
	     * @return {GetChaptersPromise}
	     */

	  }, {
	    key: "getChapters",
	    value: function getChapters() {
	      return this.get('chapters');
	    }
	    /**
	     * A promise to get the currently active chapter.
	     *
	     * @promise GetCurrentChaptersPromise
	     * @fulfill {VimeoChapter|undefined} The current chapter for the video.
	     */

	    /**
	     * Get the currently active chapter for the video.
	     *
	     * @return {GetCurrentChaptersPromise}
	     */

	  }, {
	    key: "getCurrentChapter",
	    value: function getCurrentChapter() {
	      return this.get('currentChapter');
	    }
	    /**
	     * A promise to get the color of the player.
	     *
	     * @promise GetColorPromise
	     * @fulfill {string} The hex color of the player.
	     */

	    /**
	     * Get the color for this player.
	     *
	     * @return {GetColorPromise}
	     */

	  }, {
	    key: "getColor",
	    value: function getColor() {
	      return this.get('color');
	    }
	    /**
	     * A promise to set the color of the player.
	     *
	     * @promise SetColorPromise
	     * @fulfill {string} The color was successfully set.
	     * @reject {TypeError} The string was not a valid hex or rgb color.
	     * @reject {ContrastError} The color was set, but the contrast is
	     *         outside of the acceptable range.
	     * @reject {EmbedSettingsError} The owner of the player has chosen to
	     *         use a specific color.
	     */

	    /**
	     * Set the color of this player to a hex or rgb string. Setting the
	     * color may fail if the owner of the video has set their embed
	     * preferences to force a specific color.
	     *
	     * @param {string} color The hex or rgb color string to set.
	     * @return {SetColorPromise}
	     */

	  }, {
	    key: "setColor",
	    value: function setColor(color) {
	      return this.set('color', color);
	    }
	    /**
	     * A representation of a cue point.
	     *
	     * @typedef {Object} VimeoCuePoint
	     * @property {number} time The time of the cue point.
	     * @property {object} data The data passed when adding the cue point.
	     * @property {string} id The unique id for use with removeCuePoint.
	     */

	    /**
	     * A promise to get the cue points of a video.
	     *
	     * @promise GetCuePointsPromise
	     * @fulfill {VimeoCuePoint[]} The cue points added to the video.
	     * @reject {UnsupportedError} Cue points are not supported with the current
	     *         player or browser.
	     */

	    /**
	     * Get an array of the cue points added to the video.
	     *
	     * @return {GetCuePointsPromise}
	     */

	  }, {
	    key: "getCuePoints",
	    value: function getCuePoints() {
	      return this.get('cuePoints');
	    }
	    /**
	     * A promise to get the current time of the video.
	     *
	     * @promise GetCurrentTimePromise
	     * @fulfill {number} The current time in seconds.
	     */

	    /**
	     * Get the current playback position in seconds.
	     *
	     * @return {GetCurrentTimePromise}
	     */

	  }, {
	    key: "getCurrentTime",
	    value: function getCurrentTime() {
	      return this.get('currentTime');
	    }
	    /**
	     * A promise to set the current time of the video.
	     *
	     * @promise SetCurrentTimePromise
	     * @fulfill {number} The actual current time that was set.
	     * @reject {RangeError} the time was less than 0 or greater than the
	     *         video’s duration.
	     */

	    /**
	     * Set the current playback position in seconds. If the player was
	     * paused, it will remain paused. Likewise, if the player was playing,
	     * it will resume playing once the video has buffered.
	     *
	     * You can provide an accurate time and the player will attempt to seek
	     * to as close to that time as possible. The exact time will be the
	     * fulfilled value of the promise.
	     *
	     * @param {number} currentTime
	     * @return {SetCurrentTimePromise}
	     */

	  }, {
	    key: "setCurrentTime",
	    value: function setCurrentTime(currentTime) {
	      return this.set('currentTime', currentTime);
	    }
	    /**
	     * A promise to get the duration of the video.
	     *
	     * @promise GetDurationPromise
	     * @fulfill {number} The duration in seconds.
	     */

	    /**
	     * Get the duration of the video in seconds. It will be rounded to the
	     * nearest second before playback begins, and to the nearest thousandth
	     * of a second after playback begins.
	     *
	     * @return {GetDurationPromise}
	     */

	  }, {
	    key: "getDuration",
	    value: function getDuration() {
	      return this.get('duration');
	    }
	    /**
	     * A promise to get the ended state of the video.
	     *
	     * @promise GetEndedPromise
	     * @fulfill {boolean} Whether or not the video has ended.
	     */

	    /**
	     * Get the ended state of the video. The video has ended if
	     * `currentTime === duration`.
	     *
	     * @return {GetEndedPromise}
	     */

	  }, {
	    key: "getEnded",
	    value: function getEnded() {
	      return this.get('ended');
	    }
	    /**
	     * A promise to get the loop state of the player.
	     *
	     * @promise GetLoopPromise
	     * @fulfill {boolean} Whether or not the player is set to loop.
	     */

	    /**
	     * Get the loop state of the player.
	     *
	     * @return {GetLoopPromise}
	     */

	  }, {
	    key: "getLoop",
	    value: function getLoop() {
	      return this.get('loop');
	    }
	    /**
	     * A promise to set the loop state of the player.
	     *
	     * @promise SetLoopPromise
	     * @fulfill {boolean} The loop state that was set.
	     */

	    /**
	     * Set the loop state of the player. When set to `true`, the player
	     * will start over immediately once playback ends.
	     *
	     * @param {boolean} loop
	     * @return {SetLoopPromise}
	     */

	  }, {
	    key: "setLoop",
	    value: function setLoop(loop) {
	      return this.set('loop', loop);
	    }
	    /**
	     * A promise to set the muted state of the player.
	     *
	     * @promise SetMutedPromise
	     * @fulfill {boolean} The muted state that was set.
	     */

	    /**
	     * Set the muted state of the player. When set to `true`, the player
	     * volume will be muted.
	     *
	     * @param {boolean} muted
	     * @return {SetMutedPromise}
	     */

	  }, {
	    key: "setMuted",
	    value: function setMuted(muted) {
	      return this.set('muted', muted);
	    }
	    /**
	     * A promise to get the muted state of the player.
	     *
	     * @promise GetMutedPromise
	     * @fulfill {boolean} Whether or not the player is muted.
	     */

	    /**
	     * Get the muted state of the player.
	     *
	     * @return {GetMutedPromise}
	     */

	  }, {
	    key: "getMuted",
	    value: function getMuted() {
	      return this.get('muted');
	    }
	    /**
	     * A promise to get the paused state of the player.
	     *
	     * @promise GetLoopPromise
	     * @fulfill {boolean} Whether or not the video is paused.
	     */

	    /**
	     * Get the paused state of the player.
	     *
	     * @return {GetLoopPromise}
	     */

	  }, {
	    key: "getPaused",
	    value: function getPaused() {
	      return this.get('paused');
	    }
	    /**
	     * A promise to get the playback rate of the player.
	     *
	     * @promise GetPlaybackRatePromise
	     * @fulfill {number} The playback rate of the player on a scale from 0.5 to 2.
	     */

	    /**
	     * Get the playback rate of the player on a scale from `0.5` to `2`.
	     *
	     * @return {GetPlaybackRatePromise}
	     */

	  }, {
	    key: "getPlaybackRate",
	    value: function getPlaybackRate() {
	      return this.get('playbackRate');
	    }
	    /**
	     * A promise to set the playbackrate of the player.
	     *
	     * @promise SetPlaybackRatePromise
	     * @fulfill {number} The playback rate was set.
	     * @reject {RangeError} The playback rate was less than 0.5 or greater than 2.
	     */

	    /**
	     * Set the playback rate of the player on a scale from `0.5` to `2`. When set
	     * via the API, the playback rate will not be synchronized to other
	     * players or stored as the viewer's preference.
	     *
	     * @param {number} playbackRate
	     * @return {SetPlaybackRatePromise}
	     */

	  }, {
	    key: "setPlaybackRate",
	    value: function setPlaybackRate(playbackRate) {
	      return this.set('playbackRate', playbackRate);
	    }
	    /**
	     * A promise to get the played property of the video.
	     *
	     * @promise GetPlayedPromise
	     * @fulfill {Array} Played Timeranges converted to an Array.
	     */

	    /**
	     * Get the played property of the video.
	     *
	     * @return {GetPlayedPromise}
	     */

	  }, {
	    key: "getPlayed",
	    value: function getPlayed() {
	      return this.get('played');
	    }
	    /**
	     * A promise to get the qualities available of the current video.
	     *
	     * @promise GetQualitiesPromise
	     * @fulfill {Array} The qualities of the video.
	     */

	    /**
	     * Get the qualities of the current video.
	     *
	     * @return {GetQualitiesPromise}
	     */

	  }, {
	    key: "getQualities",
	    value: function getQualities() {
	      return this.get('qualities');
	    }
	    /**
	     * A promise to get the current set quality of the video.
	     *
	     * @promise GetQualityPromise
	     * @fulfill {string} The current set quality.
	     */

	    /**
	     * Get the current set quality of the video.
	     *
	     * @return {GetQualityPromise}
	     */

	  }, {
	    key: "getQuality",
	    value: function getQuality() {
	      return this.get('quality');
	    }
	    /**
	     * A promise to set the video quality.
	     *
	     * @promise SetQualityPromise
	     * @fulfill {number} The quality was set.
	     * @reject {RangeError} The quality is not available.
	     */

	    /**
	     * Set a video quality.
	     *
	     * @param {string} quality
	     * @return {SetQualityPromise}
	     */

	  }, {
	    key: "setQuality",
	    value: function setQuality(quality) {
	      return this.set('quality', quality);
	    }
	    /**
	     * A promise to get the seekable property of the video.
	     *
	     * @promise GetSeekablePromise
	     * @fulfill {Array} Seekable Timeranges converted to an Array.
	     */

	    /**
	     * Get the seekable property of the video.
	     *
	     * @return {GetSeekablePromise}
	     */

	  }, {
	    key: "getSeekable",
	    value: function getSeekable() {
	      return this.get('seekable');
	    }
	    /**
	     * A promise to get the seeking property of the player.
	     *
	     * @promise GetSeekingPromise
	     * @fulfill {boolean} Whether or not the player is currently seeking.
	     */

	    /**
	     * Get if the player is currently seeking.
	     *
	     * @return {GetSeekingPromise}
	     */

	  }, {
	    key: "getSeeking",
	    value: function getSeeking() {
	      return this.get('seeking');
	    }
	    /**
	     * A promise to get the text tracks of a video.
	     *
	     * @promise GetTextTracksPromise
	     * @fulfill {VimeoTextTrack[]} The text tracks associated with the video.
	     */

	    /**
	     * Get an array of the text tracks that exist for the video.
	     *
	     * @return {GetTextTracksPromise}
	     */

	  }, {
	    key: "getTextTracks",
	    value: function getTextTracks() {
	      return this.get('textTracks');
	    }
	    /**
	     * A promise to get the embed code for the video.
	     *
	     * @promise GetVideoEmbedCodePromise
	     * @fulfill {string} The `<iframe>` embed code for the video.
	     */

	    /**
	     * Get the `<iframe>` embed code for the video.
	     *
	     * @return {GetVideoEmbedCodePromise}
	     */

	  }, {
	    key: "getVideoEmbedCode",
	    value: function getVideoEmbedCode() {
	      return this.get('videoEmbedCode');
	    }
	    /**
	     * A promise to get the id of the video.
	     *
	     * @promise GetVideoIdPromise
	     * @fulfill {number} The id of the video.
	     */

	    /**
	     * Get the id of the video.
	     *
	     * @return {GetVideoIdPromise}
	     */

	  }, {
	    key: "getVideoId",
	    value: function getVideoId() {
	      return this.get('videoId');
	    }
	    /**
	     * A promise to get the title of the video.
	     *
	     * @promise GetVideoTitlePromise
	     * @fulfill {number} The title of the video.
	     */

	    /**
	     * Get the title of the video.
	     *
	     * @return {GetVideoTitlePromise}
	     */

	  }, {
	    key: "getVideoTitle",
	    value: function getVideoTitle() {
	      return this.get('videoTitle');
	    }
	    /**
	     * A promise to get the native width of the video.
	     *
	     * @promise GetVideoWidthPromise
	     * @fulfill {number} The native width of the video.
	     */

	    /**
	     * Get the native width of the currently‐playing video. The width of
	     * the highest‐resolution available will be used before playback begins.
	     *
	     * @return {GetVideoWidthPromise}
	     */

	  }, {
	    key: "getVideoWidth",
	    value: function getVideoWidth() {
	      return this.get('videoWidth');
	    }
	    /**
	     * A promise to get the native height of the video.
	     *
	     * @promise GetVideoHeightPromise
	     * @fulfill {number} The native height of the video.
	     */

	    /**
	     * Get the native height of the currently‐playing video. The height of
	     * the highest‐resolution available will be used before playback begins.
	     *
	     * @return {GetVideoHeightPromise}
	     */

	  }, {
	    key: "getVideoHeight",
	    value: function getVideoHeight() {
	      return this.get('videoHeight');
	    }
	    /**
	     * A promise to get the vimeo.com url for the video.
	     *
	     * @promise GetVideoUrlPromise
	     * @fulfill {number} The vimeo.com url for the video.
	     * @reject {PrivacyError} The url isn’t available because of the video’s privacy setting.
	     */

	    /**
	     * Get the vimeo.com url for the video.
	     *
	     * @return {GetVideoUrlPromise}
	     */

	  }, {
	    key: "getVideoUrl",
	    value: function getVideoUrl() {
	      return this.get('videoUrl');
	    }
	    /**
	     * A promise to get the volume level of the player.
	     *
	     * @promise GetVolumePromise
	     * @fulfill {number} The volume level of the player on a scale from 0 to 1.
	     */

	    /**
	     * Get the current volume level of the player on a scale from `0` to `1`.
	     *
	     * Most mobile devices do not support an independent volume from the
	     * system volume. In those cases, this method will always return `1`.
	     *
	     * @return {GetVolumePromise}
	     */

	  }, {
	    key: "getVolume",
	    value: function getVolume() {
	      return this.get('volume');
	    }
	    /**
	     * A promise to set the volume level of the player.
	     *
	     * @promise SetVolumePromise
	     * @fulfill {number} The volume was set.
	     * @reject {RangeError} The volume was less than 0 or greater than 1.
	     */

	    /**
	     * Set the volume of the player on a scale from `0` to `1`. When set
	     * via the API, the volume level will not be synchronized to other
	     * players or stored as the viewer’s preference.
	     *
	     * Most mobile devices do not support setting the volume. An error will
	     * *not* be triggered in that situation.
	     *
	     * @param {number} volume
	     * @return {SetVolumePromise}
	     */

	  }, {
	    key: "setVolume",
	    value: function setVolume(volume) {
	      return this.set('volume', volume);
	    }
	  }]);

	  return Player;
	}(); // Setup embed only if this is not a node environment


	if (!isNode) {
	  screenfull = initializeScreenfull();
	  initializeEmbeds();
	  resizeEmbeds();
	}

	var i = Player;

	function fluorescentVideo_es(a$1,n){void 0===n&&(n={});var u,r=n.id,d=n.playerEl,p=n.type;if(r&&p){var y=a(),f=y.on,l=y.emit;return "youtube"===p?((u=t(d)).loadVideoById({videoId:r,suggestedQuality:"large"}),u.stopVideo(),u.on("stateChange",function(e){1===e.data?l("play"):2===e.data&&l("pause");}),u.on("ready",function(){l("ready"),m();})):"vimeo"===p&&((u=new i(d,{id:r})).on("play",function(){return l("play")}),u.on("pause",function(){return l("pause")}),u.ready().then(function(){l("ready"),m();})),{destroy:function(){},on:f,pause:function(){"youtube"===p?u.pauseVideo():"vimeo"===p&&u.pause();},play:function(){"youtube"===p?u.playVideo():"vimeo"===p&&u.play();}}}function m(){var o=n$2("iframe",a$1),t=o.height/o.width*100,i=o.parentNode;o.height="100%",o.width="100%","youtube"===p?i.style.paddingTop=t+"%":"vimeo"===p&&(i.parentNode.style.paddingTop=t+"%"),l("resized");}}

	var fluorescentVideo_es$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': fluorescentVideo_es
	});

}));
