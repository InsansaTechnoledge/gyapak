function i(n,u=300){let e;function t(...c){e&&clearTimeout(e),e=setTimeout(()=>{n(...c)},u)}return t.cancel=()=>{e&&(clearTimeout(e),e=null)},t}export{i as d};
