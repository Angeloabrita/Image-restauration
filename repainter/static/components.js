var modal = document.getElementById("dModal");
const donwloadBtn = document.getElementById("donwload");
const spanClose = document.getElementsByClassName("close")[0];

donwloadBtn.onclick = ()=>{
 modal.style.display = 'block';
}

spanClose.onclick = ()=>{
    modal.style.display="none";
}

window.onclick = function (evn) {
    if(evn.target==modal){
        modal.style.display="none";
    }
}
