function messageBox(str, displayTime) {
    var box = document.createElement("div");
    box.setAttribute("class", "message-box");
    var txt = document.createElement("span");
    txt.innerText = str;
    box.appendChild(txt);
    var cnt = document.querySelectorAll(".message-box").length;
    var top = cnt * 8 + 4;
    box.setAttribute("style", "top: " + top + "%");
    document.body.appendChild(box);
    setTimeout("clearBox()", displayTime);
}

function clearBox() {
    document.body.removeChild(document.querySelectorAll(".message-box")[0]);
    var boxList = document.querySelectorAll(".message-box");
    for (var i = 0; i < boxList.length; i++) {
        var top = i * 8 + 4;
        boxList[i].setAttribute("style", "top: " + top + "%");
    }
}
