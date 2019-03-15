window.scripts = [
  'Pecas.js',
  'Config.js'
];

window.appendScripts = function (scriptsToAppend){
  scriptsToAppend
    .map(s => `js/${s}`)
    .map(s => `<script src="${s}" charset="utf-8"></script>`)
    .forEach(s => document.write(s));
}

window.onload = window.appendScripts(window.scripts);
