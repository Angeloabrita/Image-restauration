//https://konvajs.org/docs/sandbox/Free_Drawing.html
//https://stackoverflow.com/questions/66724722/how-to-keep-konva-image-aspect-ratio

var width = window.innerWidth;
var height = window.innerHeight;

var btnDonwload = document.getElementById("donwload");
var containerDonwload = document.getElementById("donwloadContainer");


//base64 data image background
var bgSubUrl = '';

// first we need Konva core things: stage and layer
var stage = new Konva.Stage({
  container: 'konva',
  width: window.width/2 ,
  height: window.height/2 ,
  
});

var layer = new Konva.Layer();
stage.add(layer);

//**change mouse cursor in layer */
stage.on('mouseenter',()=>{
  stage.container().style.cursor = "crosshair";
})

stage.on('mouseleave',()=>{
  stage.container().style.cursor = "default";
})
//**crete the mask group without bg image */
var group1 = new Konva.Group({
});

layer.add(group1);


//**this function dawLineMask for painting manual the worns the picture */
function drawLineMask() {

  let isPaint = false;
  let mode = 'brush';
  let size_stroke = 5;
  let lastLine;
  

  stage.on('mousedown touchstart', function (e) {
    isPaint = true;
    let pos = stage.getPointerPosition();

    lastLine = new Konva.Line({
      stroke: '#df4b26',
      name:'line',
      strokeWidth: size_stroke,
      globalCompositeOperation:
        mode === 'brush' ? 'source-over' : 'destination-out',
      // round cap for smoother lines
      lineCap: 'round',
      // add point twice, so we have some drawings even on a simple click
      points: [pos.x, pos.y, pos.x, pos.y],
    });
    layer.add(lastLine);
  
 
  //group1.add(lastLine);
  
});

stage.on('mouseup touchend', function () {
  isPaint = false;
});

// and core function - drawing
stage.on('mousemove touchmove', function (e) {
  if (!isPaint) {
    return;
  }

  // prevent scrolling on touch devices
  e.evt.preventDefault();

  const pos = stage.getPointerPosition();
  var newPoints = lastLine.points().concat([pos.x, pos.y]);
  lastLine.points(newPoints);
});

var select = document.getElementById('range');

select.addEventListener('change', function () {
  //mode = select.value;
  size_stroke = select.value;
});
  
};
//call it
drawLineMask();

//black mask to bg
var maskBg = new Konva.Rect({

  x:0,
  y:0,
  width:stage.width(),
  height:stage.height(),
  fill:'black',
  id:"mask"

});

// push image to background
function bg() {

  var imageObj = new Image();

  imageObj.onload = function () {

    var scale = Math.min(stage.width() / imageObj.width, stage.height() / imageObj.height);
    
    var bg = new Konva.Image({
      x: 0, //stage.width()/2,
      y: 0, // stage.height/2,
      image: imageObj,
      width:  imageObj.width * scale,
      height:  imageObj.height * scale,
     
      visible: true,
      id: 'bg'
    });

    //set the stage with same image ration 
    stage.setAttr("width",`${imageObj.width * scale}`)
    stage.setAttr("height",`${imageObj.height * scale}`)

    //add image to background in konva and batch it
    group1.add(bg);

    layer.batchDraw();

    
   
    //add dataString the image for push together mask data
    bgSubUrl = stage.toDataURL({ pixelRatio: 3 });
    
  };


  return imageObj;
}




//get file input element
const fileSelector = document.getElementById('fileInput');

//load image input event
fileSelector.addEventListener('change', (event) => {

  var file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
   
    bg().src = event.target.result;
    
  };
 
  reader.readAsDataURL(file);

});

//clear line in stage layer
document.getElementById('btnClear').addEventListener('click', ()=>{

  let linesMask = stage.find(".line");
  linesMask.forEach(element => {
    element.remove();
  });

});


function displayLoading() {
  //get the loading and konva elements
  let loader = document.getElementById('loading');
  let konva = document.getElementById("konva");
  konva.style.display = "none";
  loader.classList.add("display");
  console.log("displeyLoading");
}


function hideLoading() {
  let loader = document.getElementById('loading');
  let konva = document.getElementById("konva");

  loader.classList.remove("display");
  konva.style.display = "block";

  console.log("no hide");
}


// fetch post base64 and waiting response
function apiRes(sImg, mask, tk) {

  var entry = {
    sImg: sImg,
    mask: mask
  };
  
 fetch(`${window.origin}/`,{
   method: "POST",
   credentials: "include",
   body: JSON.stringify(entry),
   cache: "no-cache",
   headers: new Headers({
     "content-type": "application/json",
     'X-CSRFToken': tk
   })
 }).then(
   function (res) {
     if(res.status !==200){

      let error = document.getElementById('error');

      hideLoading();
      error.innerHTML = "Error: " + res.status + " Error response time out! I'm working on a solution. For now try to fix small parts of the image at a time " ;

      
       return;
     }
     res.json().then(function(data){
       console.log(data);

      //  let sImg = document.getElementById('resultImg');
      //   sImg.src = `data:image/png;base64,${data['result']}`;
        restauredImg(`data:image/png;base64,${data['result']}`);
         //hide loading component and show the image result
        hideLoading();
        containerDonwload.style.display = "block";


     });
   }
 ).catch(function(error){
    console.log("fetch erro " + error);
    
 })

};

//dowload URI base64 to browser
function downloadURI(uri, name) {
  //create a hrf link element
  var link = document.createElement('a');

  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


//
function restauredImg(img) {

  //add restaured image to bag stage
  stage.find("#bg")[0].show();
  bg().src = img;
  
  //hide the blackMask
  stage.find("#mask")[0].hide();

  //remove lines and blackmask
  let line = stage.find(".line");
  line.forEach(element =>{
    element.hide();
  })

  stage.draw();
  hideLoading();

}

//event remove bg converter stronke in white and add black to background
document.getElementById('btn').addEventListener('click',()=>{

  // remove the background for create a mask black and white
  stage.find("#bg")[0].hide();

  //change the stroke color to white for make a real mask of img
  let linesMask = stage.find(".line");
  
  linesMask.forEach(element => {
    element.setAttr("stroke","white");
  });
  
  group1.add(maskBg);
  stage.draw();

  let tk = document.getElementById('tk').value;
  console.log(tk);
  //call fetch API
  apiRes(bgSubUrl, stage.toDataURL({pixelRatio: 3}), tk);
  
   //display load bar
   displayLoading();
 
});


//donload event
btnDonwload.addEventListener('click',()=>{
  downloadURI(stage.toDataURL({pixelRatio: 3}), "result.png");
});