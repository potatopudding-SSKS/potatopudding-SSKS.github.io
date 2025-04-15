document.addEventListener('DOMContentLoaded', () => {
  console.log('User activity tracker initialized');
  
  // Log page view on load
  logEvent('view', document.body, 'page');
  
  // Track click events
  document.addEventListener('click', (event) => {
    const target = event.target;
    logEvent('click', target, getElementType(target));
  });
  
  // Track element views with Intersection Observer
  setupViewTracking();
  
  /**
   * Helper function to determine element content type
   */
  function getElementType(element) {
    const elementType = element.tagName.toLowerCase();
    
    // Identify common content types
    if (elementType === 'img') {
      return 'image';
    } else if (elementType === 'video') {
      return 'video';
    } else if (elementType === 'audio') {
      return 'audio';
    } else if (elementType === 'a') {
      return 'link';
    } else if (['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'label', 'li'].includes(elementType)) {
      return 'text';
    } else if (elementType === 'button') {
      return 'button';
    } else if (['input', 'textarea', 'select'].includes(elementType)) {
      if (elementType === 'input') {
        // Properly format the template literal with backticks
        return `form-${element.type || 'text'}`;
      }
      return 'form-control';
    } else if (['table', 'tr', 'td', 'th'].includes(elementType)) {
      return 'table-element';
    } else if (['svg', 'path', 'rect', 'circle'].includes(elementType)) {
      return 'svg-graphics';
    } else if (elementType === 'canvas') {
      return 'canvas-graphics';
    } else if (elementType === 'iframe') {
      return 'embedded-content';
    } else if (['ul', 'ol', 'dl'].includes(elementType)) {
      return 'list';
    } else if (elementType === 'select' || element.classList.contains('dropdown')) {
      return 'drop-down';
    }
    
    // Check if the element or its parent contains specific media
    if (element.querySelector('img') || element.closest('figure')) {
      return 'image-container';
    }
    if (element.querySelector('video')) {
      return 'video-container';
    }
    
    return 'unknown';
  }
  
  /**
   * Log event information in the required format
   */
  function logEvent(eventType, element, objectType) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const elementId = element.id || 'none';
    const elementClass = typeof element.className === 'string' ? element.className : 'none';
    const elementText = element.textContent?.trim().substring(0, 50) || 'none';
    
    // Log in specified format: Timestamp, event type, object type
    console.log(`${timestamp}, ${eventType}, ${objectType}`);
    
    // Additional detailed logging for debugging
    console.log({
      timestamp,
      eventType,
      objectType,
      element: {
        tag: element.tagName?.toLowerCase(),
        id: elementId,
        class: elementClass,
        text: elementText
      }
    });
  }
  
  /**
   * Setup intersection observers to track element views
   */
  function setupViewTracking() {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.5 // element is considered viewed when 50% visible
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Only log the first time an element comes into view
          logEvent('view', entry.target, getElementType(entry.target));
          observer.unobserve(entry.target); // Stop observing after first view
        }
      });
    }, options);
    
    // Observe important elements (headers, images, links, etc.)
    const elementsToTrack = document.querySelectorAll('h1, h2, h3, img, video, .slideshow-container, section');
    elementsToTrack.forEach(element => {
      observer.observe(element);
    });
  }
});