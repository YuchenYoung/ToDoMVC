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

// 筛选条件
function filterChange() {
    filterOnlyStar = document.getElementsByName("filterStar")[0].checked;
    filterOnlyTodo = document.getElementsByName("filterFinish")[0].checked;
    fetchAll();
}

// 创建新的活动节点
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
    // 初始时输入框为隐藏状态
    var inputContent = document.createElement("input");
    inputContent.setAttribute("id", "edit" + id);
    inputContent.setAttribute("type", "text");
    inputContent.setAttribute("style", "display: none");
    inputContent.setAttribute("value", "");
    inputContent.setAttribute("onBlur", "editFinish('" + id + "')");
    divContent.appendChild(inputContent);
    node.appendChild(divContent);
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

// 完成全部待办或取消全部完成
function changeAllFinishState(state) {
    var ls = window.localStorage;
    var arrStr = ls.getItem("array");
    var arr = JSON.parse(arrStr);
    for (var i = 0; i < arr.length; i++) {
        var item = JSON.parse(ls.getItem("item" + arr[i]));
        item.finish = state;
        ls.setItem("item" + arr[i], JSON.stringify(item));
    }
    fetchAll();
}

// 星标某个活动
function star(id) {
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.star = true;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

// 取消星标某个活动
function unstar(id) {
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.star = false;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

// 完成某个活动
function finish(id) {
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.finish = true;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

// 取消完成某个活动
function unfinish(id) {
    var ls = window.localStorage;
    var item = JSON.parse(ls.getItem("item" + id));
    item.finish = false;
    ls.setItem("item" + id, JSON.stringify(item));
    fetchAll();
}

// 删除某个活动
function deleteItem(id) {
    var ls = window.localStorage;
    ls.setItem("item" + id, JSON.stringify({}));
    var arr = JSON.parse(ls.getItem("array"));
    arr = removeByValue(arr, id);
    ls.setItem("array", JSON.stringify(arr));
    fetchAll();
}

// 开始编辑，展示输入框
function editBegin(id) {
    var textOld = document.getElementById("text" + id).innerText;
    document.getElementById("edit" + id).setAttribute("value", textOld);
    document.getElementById("text" + id).setAttribute("style", "display: none");
    document.getElementById("edit" + id).setAttribute("style", "display: block");
    document.getElementById("edit" + id).focus();
}

// 结束编辑，隐藏输入框，并修改存储
function editFinish(id) {
    var textNew = document.getElementById("edit" + id).value;
    if (textNew.trim().length > 0 && textNew.trim().length <= 12) {
        var ls = window.localStorage;
        var item = JSON.parse(ls.getItem("item" + id));
        item.content = textNew;
        ls.setItem("item" + id, JSON.stringify(item));
        document.getElementById("text" + id).innerText = textNew;
    } else if (textNew.trim().length <= 0) {
        messageBox("活动内容不能为空！", 5000);
    } else {
        messageBox("活动内容不能超过12个字符！", 5000);
    }
    document.getElementById("edit" + id).setAttribute("style", "display: none");
    document.getElementById("text" + id).setAttribute("style", "display: block");
}

// 完成全部
function finishAll() {
    changeAllFinishState(true);
}

// 取消完成全部
function undoAll() {
    changeAllFinishState(false);
}

// 删除全部
function deleteAll(finish) {
    var ulID = finish ? "ulFinish" : "ulTodo";
    var nodes = document.getElementById(ulID).getElementsByTagName("li");
    var ls = window.localStorage;
    var arr = JSON.parse(ls.getItem("array"));
    for (var i = 0; i < nodes.length; i++) {
        var curId = parseInt(nodes[i].getAttribute("id").split("m")[1]);
        arr = removeByValue(arr, curId);
    }
    ls.setItem("array", JSON.stringify(arr));
    fetchAll();
}

// 新建活动
function createNew() {
    var newContent = document.getElementById("inputNew").value;
    if (newContent.trim().length > 0 && newContent.trim().length <= 12) {
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
    } else if (newContent.trim().length <= 0) {
        messageBox("活动内容不能为空！", 5000);
    } else {
        messageBox("活动内容不能超过12个字符！", 5000);
    }
    document.getElementById("inputNew").value = "";
}

// 根据星标获取全部活动
function fetchStar(star) {
    var ls = window.localStorage;
    var arrStr = ls.getItem("array");
    if (!arrStr && typeof(arrStr)!="undefined" && arrStr!=0)
    {
        initLocalStorage();
        arrStr = ls.getItem("array");
    }
    var arr = JSON.parse(arrStr);
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

// 获取全部活动
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

// 重新调整元素位置和大小
function reformSize() {
    var navHeight = document.getElementById("navBar").clientHeight;
    var inputHeight = document.getElementById("addArea").clientHeight;
    var topHeight = navHeight + inputHeight;
    document.getElementById("formDiv").setAttribute("style", "margin-top: " + topHeight + "px")
}

// 展示新增界面
function showNew() {
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

// 隐藏新增界面
function hideNew() {
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

// 第一次执行程序初始化 localStorage
function initLocalStorage() {
    window.localStorage.setItem("number", 0);
    window.localStorage.setItem("array", JSON.stringify([]));
}

window.onload = function () {
    reformSize();
    fetchAll();
}
