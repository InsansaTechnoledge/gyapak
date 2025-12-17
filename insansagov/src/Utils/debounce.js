export function debounce(fn, delay = 300) {
    let timerId;
  
    function debounced(...args) {
      if (timerId) clearTimeout(timerId);
  
      timerId = setTimeout(() => {
        fn(...args);
      }, delay);
    }
  
    debounced.cancel = () => {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    };
  
    return debounced;
  }
  