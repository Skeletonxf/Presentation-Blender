// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

remote = require('electron').remote,
dialog = remote.dialog

document.getElementById("fileChooser").onclick = function() {
  paths = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})
  for (let path of paths) {
    console.log(path)
    add(path)
  }
}

//document.addEventListener('drop', function (e) {
//  e.preventDefault()
//  e.stopPropagation()
//    
//  for (let f of e.dataTransfer.files) {
//    console.log(f.path)
//    add(f.path)
//  }
//})

// create sortable list inside ul
list = sortable('.sortable')

add = function(filepath) {
  // add a draggable widget thingy that reordering adjusts
  // the order of the presentations array
  li = document.createElement("li")
  label = document.createTextNode(filepath)
  li.appendChild(label)
  li.setAttribute('class', 'widget')
  li.setAttribute('draggable', 'true')
  start = document.createElement("input")
  start.setAttribute('type', 'text')
  li.appendChild(document.createElement("br"))
  li.appendChild(document.createTextNode("Start slide: "))
  li.appendChild(start)
  end = document.createElement("input")
  end.setAttribute('type', 'text')
  li.appendChild(document.createElement("br"))
  li.appendChild(document.createTextNode("End slide: "))
  li.appendChild(end)
  document.getElementById("list").appendChild(li)
  sortable('.sortable'); // reload
}

//document.addEventListener('dragover', function (e) {
//  e.preventDefault()
//  e.stopPropagation()
//})

let exec = require('child_process').exec

function execute(command, callback){
  exec(command, function(error, stdout, stderr) {
    callback(stdout)
  })
}

document.getElementById("runSlideshow").onclick = function() {
  files = ""
  json = {
    input : []
  }
  for (let child of document.getElementById("list").children) {
    // get first child text label of children li elements
    // and retrieve the node value of the labels
    // add left to right so they open in correct order
    files = (child.childNodes[0].nodeValue) + " " + files
    start = child.childNodes[3].value
    end = child.childNodes[6].value
    // defaults when blank
    if (start === "") {
      start = 1
    }
    if (end === "") {
      end = 0
    }
    json.input.push({
      fp : child.childNodes[0].nodeValue,
      s : start,
      e : end 
    })
  }
  format = JSON.stringify(json)
  // call the python script
  console.log("running script")
  console.log(format)
  execute("python Slicer.py '" + format + "'", function(output) {
    console.log(output)
  })
}

// runs repeatedly every 500 ms
window.setInterval(function() {
  if (document.getElementById("list").hasChildNodes()) {
    document.getElementById("runSlideshow").disabled = false
  } else {
    document.getElementById("runSlideshow").disabled = true
  }
}, 500);

