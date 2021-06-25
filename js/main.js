var filterOnlyStar = false;
var filterOnlyTodo = false;

function removeByValue(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == value) {
            arr.splice(i, 1);
            break;
        }
    }
    return arr;
}

function getFullTime() {
    var curDate = new Date();
    var dateArr = [curDate.getFullYear(), 1 + curDate.getMonth(), curDate.getDate()]
    var timeArr = [curDate.getHours(), curDate.getMinutes(), curDate.getSeconds()]
    for (var i = 0; i < 3; i++) {
        if (dateArr[i] < 10) {
            dateArr[i] = '0' + dateArr[i];
        }
    }
    for (var i = 0; i < 3; i++) {
        if (timeArr[i] < 10) {
            timeArr[i] = '0' + timeArr[i];
        }
    }
    return dateArr.join('-') + " " + timeArr.join(':');
}

function filterChange() {
    filterOnlyStar = document.getElementsByName("filterStar")[0].checked;
    filterOnlyTodo = document.getElementsByName("filterFinish")[0].checked;
    fetchAll();
}

function createNewItemNode(item) {
    var node = document.createElement("li");
    var id = item.id;
    node.setAttribute("class", "item item-first");
    node.setAttribute("id", "item" + item.id);
    if (item.finish) {
        // append unfinish button
        var btnFinish = document.createElement("button");
        btnFinish.setAttribute("class", "btn-item");
        btnFinish.setAttribute("onclick", "unfinish('" + id + "')")
        var imageFinish = document.createElement("img");
        imageFinish.setAttribute("src", "img/icon/icon-right.png");
        btnFinish.appendChild(imageFinish);
        node.appendChild(btnFinish);
    } else {
        // append finish button
        var btnFinish = document.createElement("button");
        btnFinish.setAttribute("class", "btn-item");
        btnFinish.setAttribute("onclick", "finish('" + id + "')")
        var imageFinish = document.createElement("img");
        imageFinish.setAttribute("src", "img/icon/icon-circle.png");
        btnFinish.appendChild(imageFinish);
        node.appendChild(btnFinish);
    }
    if (item.star) {
        // append unstar button
        var btnStar = document.createElement("button");
        btnStar.setAttribute("class", "btn-item");
        btnStar.setAttribute("onclick", "unstar('" + id + "')")
        var imageStar = document.createElement("img");
        imageStar.setAttribute("src", "img/icon/icon-unstar.png");
        btnStar.appendChild(imageStar);
        node.appendChild(btnStar);
    } else {
        // append star button
        var btnStar = document.createElement("button");
        btnStar.setAttribute("class", "btn-item");
        btnStar.setAttribute("onclick", "star('" + id + "')")
        var imageStar = document.createElement("img");
        imageStar.setAttribute("src", "img/icon/icon-star.png");
        btnStar.appendChild(imageStar);
        node.appendChild(btnStar);
    }
    // append text and input 
    var divContent = document.createElement("div");
    divContent.setAttribute("class", "item-content");
    var spanContent = document.createElement("span");
    spanContent.innerText = item.content;
    spanContent.setAttribute("id", "text" + id);
    spanContent.setAttribute("style", "display: block");
    if (item.finish) {
        spanContent.setAttribute("class", "del-text");
    } else {
        spanContent.setAttribute("onclick", "editBegin('" + id + "')");
    }
    divContent.appendChild(spanContent);
    var inputContent = document.createElement("input");
    inputContent.setAttribute("id", "edit" + id);
    inputContent.setAttribute("type", "text");
    inputContent.setAttribute("style", "display: none");
    inputContent.setAttribute("value", "");
    inputContent.setAttribute("onBlur", "editFinish('" + id + "')");
    divContent.appendChild(inputContent);
    node.appendChild(divContent);
    // append detail button
    var btnDetail = document.createElement("button");
    btnDetail.setAttribute("class", "btn-item btn-item-right");
    // btnDetail.setAttribute("onclick", "detail('"+id+"')")
    // var imageDetail = document.createElement("img");
    // imageDetail.setAttribute("src", "img/icon/icon-detail.png");
    // btnDetail.appendChild(imageDetail);
    // node.appendChild(btnDetail);
    // append delete button
    var btnDelete = document.createElement("button");
    btnDelete.setAttribute("class", "btn-item btn-item-right");
    btnDelete.setAttribute("onclick", "deleteItem('" + id + "')")
    var imageDelete = document.createElement("img");
    imageDelete.setAttribute("src", "img/icon/icon-delete.png");
    btnDelete.appendChild(imageDelete);
    node.appendChild(btnDelete);
    // return node;
    if (item.finish) {
        document.getElementById("ulFinish").appendChild(node);
    } else {
        document.getElementById("ulTodo").appendChild(node);
    }
}

function changeAllFinishState(state) {
    var ls = window.localStorage;
    var arrStr = ls.getItem("array");
    var arr = JSON.parse(arrStr);
    for (var i = 0; i < arr.length; i++) {
        var item = JSON.parse(ls.getItem("item" + arr[i]));
        // console.log(item);
        item.finish = state;
        ls.setItem("item" + arr[i], JSON.stringify(item));
    }
    fetchAll();
}


function star(id) {
    // console.log("star" + id);
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.star = true;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

function unstar(id) {
    // console.log("unstar" + id);
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.star = false;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

function finish(id) {
    // console.log("finish" + id);
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.finish = true;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

function unfinish(id) {
    // console.log("unfinish" + id);
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.finish = false;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

function deleteItem(id) {
    // console.log("delete" + id);
    var ls = window.localStorage;
    ls.setItem("item" + id, JSON.stringify({}));
    var arr = JSON.parse(ls.getItem("array"));
    arr = removeByValue(arr, id);
    // console.log(arr);
    ls.setItem("array", JSON.stringify(arr));
    fetchAll();
}

function editBegin(id) {
    // console.log("edit" + id);
    var textOld = document.getElementById("text" + id).innerText;
    document.getElementById("edit" + id).setAttribute("value", textOld);
    document.getElementById("text" + id).setAttribute("style", "display: none");
    document.getElementById("edit" + id).setAttribute("style", "display: block");
    document.getElementById("edit" + id).focus();
}

function editFinish(id) {
    // console.log("finEdit" + id);
    var textNew = document.getElementById("edit" + id).value;
    if (textNew.trim().length > 0) {
        var ls = window.localStorage;
        var item = JSON.parse(ls.getItem("item" + id));
        item.content = textNew;
        ls.setItem("item" + id, JSON.stringify(item));
        document.getElementById("text" + id).innerText = textNew;
    }
    document.getElementById("edit" + id).setAttribute("style", "display: none");
    document.getElementById("text" + id).setAttribute("style", "display: block");
}

function finishAll() {
    // console.log("all finish");
    changeAllFinishState(true);
}

function undoAll() {
    // console.log("all undo");
    changeAllFinishState(false);
}

function deleteAll(finish) {
    // console.log("all delete " + finish);
    var ulID = finish ? "ulFinish" : "ulTodo";
    var nodes = document.getElementById(ulID).getElementsByTagName("li");
    // console.log(nodes);
    var ls = window.localStorage;
    var arr = JSON.parse(ls.getItem("array"));
    for (var i = 0; i < nodes.length; i++) {
        var curId = parseInt(nodes[i].getAttribute("id").split("m")[1]);
        arr = removeByValue(arr, curId);
    }
    ls.setItem("array", JSON.stringify(arr));
    fetchAll();
}

function createNew() {
    var newContent = document.getElementById("inputNew").value;
    if (newContent.trim().length > 0) {
        var ls = window.localStorage;
        var curNumber = ls.getItem("number");
        curNumber = 1 + parseInt(curNumber)
        var arrStr = ls.getItem("array");
        var arr = JSON.parse(arrStr);
        arr.push(curNumber);
        var item = {
            id: curNumber,
            content: newContent,
            finish: false,
            star: false,
            createTime: getFullTime()
        }
        ls.setItem("number", curNumber);
        ls.setItem("array", JSON.stringify(arr));
        ls.setItem("item" + curNumber, JSON.stringify(item));
        fetchAll();
    }
    document.getElementById("inputNew").value = "";
}

function fetchStar(star) {
    var ls = window.localStorage;
    var arrStr = ls.getItem("array") | forceInit();
    var arr = JSON.parse(arrStr);
    // console.log(arr);
    for (var i = arr.length - 1; i >= 0; i--) {
        var it = arr[i];
        var itemStr = ls.getItem("item" + it);
        var item = JSON.parse(itemStr);
        if (item.star !== star) {
            continue;
        }
        if (!filterOnlyTodo || !item.finish) {
            createNewItemNode(item);
        }
    }
}

function fetchAll() {
    document.getElementById("ulFinish").innerHTML = "";
    document.getElementById("ulTodo").innerHTML = "";
    if (filterOnlyTodo) {
        document.getElementById("finishArea").setAttribute("style", "display: none");
    } else {
        document.getElementById("finishArea").setAttribute("style", "display: block");
    }
    fetchStar(true);
    if (!filterOnlyStar) {
        fetchStar(false);
    }
}

function reformSize() {
    var navHeight = document.getElementById("navBar").clientHeight;
    var inputHeight = document.getElementById("addArea").clientHeight;
    var topHeight = navHeight + inputHeight;
    document.getElementById("formDiv").setAttribute("style", "margin-top: " + topHeight + "px")
}

function showNew() {
    // console.log("show");
    document.getElementById("iconAdd").setAttribute("style", "display: none");
    document.getElementById("iconMinus").setAttribute("style", "display: block");
    document.getElementById("addArea").setAttribute("class", "ani-block ani-block-transition");
    let cnt = 0;
    let tmr = setInterval(function () {
        reformSize();
        cnt += 1;
        if (cnt > 25) {
            clearInterval(tmr);
        }
    }, 20);
}

function hideNew() {
    // console.log("hide");
    document.getElementById("iconAdd").setAttribute("style", "display: block");
    document.getElementById("iconMinus").setAttribute("style", "display: none");
    document.getElementById("addArea").setAttribute("class", "ani-block");
    let cnt = 0;
    let tmr = setInterval(function () {
        reformSize();
        cnt += 1;
        if (cnt > 25) {
            clearInterval(tmr);
        }
    }, 20);
}

function forceInit() {
    window.localStorage.setItem("number", 0);
    window.localStorage.setItem("array", JSON.stringify([]));
    return "";
}

window.onload = function () {
    // forceInit();
    reformSize();
    fetchAll();
}
