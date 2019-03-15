window.scripts = [  
  'Config.js'
];

window.appendScripts = function (scriptsToAppend){
  scriptsToAppend
    .map(s => `js/${s}`)
    .map(s => `<script src="${s}" async="true" charset="utf-8"></script>`)
    .forEach(s => document.write(s));
}

window.onload = window.appendScripts(window.scripts);
