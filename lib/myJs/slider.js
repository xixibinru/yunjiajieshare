function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else {
        return window.getComputedStyle(obj,null)[attr];
    }
}
function animate(obj,json,fn){
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var flag = true;
        for(var attr in json){
            var current = 0 , step = 0 ;
            if(attr == "opacity"){
                current = parseFloat(getStyle(obj,attr))*100;
                step = (json[attr]*100 - current) / 10;
            }else{
                current = parseFloat(getStyle(obj,attr));
                step = (json[attr] - current)/10;
            }
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            if(attr == "opacity"){
                if("opacity" in obj.style){
                    current = current / 100;
                    obj.style.opacity = current + step / 100;
                }else{
                    obj.style.filter = "alpha(opacity = " + (current + step) + ")";
                }
            }else if(attr == "zIndex"){
                obj.style[attr] = json[attr];
            }else{
                obj.style[attr] = current + step + "px";
            }
            if(json[attr] != current){
                flag = false;
            }
        }
        if(flag){
            clearInterval(obj.timer);
            if(fn) {fn()};
        }
    },10)
}


//src:传入存放图片的父节点（例如 ul） ul中的样式自己写 涉及到seo 不写在js中 ctrl_1 ctrl_2的css需要复制
//time: 设定轮播图播放间隔
function slider_(src, time) {
    var slider = src.parentNode; //最大的父节点
    var srcList = src.children;
    var len = srcList.length;
    var width = srcList[0].offsetWidth; //得到一张轮播图的宽度

    //给轮播图添加左右控制按钮
    var ctrl_1 = document.createElement('div');
    ctrl_1.setAttribute('class', 'ctrl-1');
    var str = '';
    str += '<span class="prev">&lt</span>'
    str += '<span class="next">&gt</span>'
    ctrl_1.innerHTML = str;
    slider.appendChild(ctrl_1);
    //给轮播图添加小圆点
    var ctrl_2 = document.createElement('ol');
    ctrl_2.setAttribute('class', 'ctrl-2');
    var str = '';
    var i = 0;
    for (; i < len; i++) {
        str += '<li data-index="' + i + '"></li>';
    }
    ctrl_2.innerHTML = str;
    slider.appendChild(ctrl_2);
    var num = 0; //  用num来控制播放 打乱顺序后按num继续播放
    //向左播放一次
    function playNext() {
        animate(srcList[num], {left: -width});
        num++;
        num = num >= len ? 0 : num;
        srcList[num].style.left = width + 'px';
        animate(srcList[num], {left: 0});
        setsquare(num);
    }

    //向右播放一次
    function playPrev() {
        animate(srcList[num], {left: width});
        num--;
        num = num < 0 ? len - 1 : num;
        srcList[num].style.left = -width + 'px';
        animate(srcList[num], {left: 0});
        setsquare(num);
    }

    var prev = ctrl_1.children[0];
    var next = ctrl_1.children[1];
    //点击左按钮轮播图向右播放
    prev.addEventListener('click', playPrev);
    //点击右按钮轮播图向左播放
    next.addEventListener('click', playNext);
    //使小圆点样式和轮播图一致
    function setsquare(num) {
        var i = 0;
        for (; i < len; i++) {
            circleList[i].className = '';
        }
        circleList[num].className = 'current';
    }

    //给小圆点添加播放控制和点击样式
    var circleList = ctrl_2.children;
    circleList[0].className = 'current';
    var i = 0;
    for (; i < len; i++) {
        circleList[i].addEventListener('click', function () {
            var clicked = +this.dataset.index; //将data数据转为number类型
            if (clicked > num) { //从右往左播放
                animate(srcList[num], {left: -width});
                srcList[clicked].style.left = width + 'px';
            } else if (clicked < num) { //从左往右播放
                animate(srcList[num], {left: width});
                srcList[clicked].style.left = -width + 'px';
            }
            animate(srcList[clicked], {left: 0});
            num = clicked;
            setsquare(num);
        });
    }
    var timer = null;
    //设定一个自动向左播放的定时器
    timer = setInterval(playNext, time);

    slider.addEventListener('mouseenter', function () {
        clearInterval(timer);
    });
    slider.addEventListener('mouseleave', function () {
        clearInterval(timer);
        timer = setInterval(playNext, time);
    });
    //窗口发生改变 重置宽度 将不是当前张全部定位到右侧
    window.onresize = function () {
        clearInterval(timer);
        width = srcList[0].offsetWidth;
        srcList[num].style.left = 0;
        var i = 0;
        for (; i < len; i++) {
            if (i !== num) {
                srcList[i].style.left = width + 'px';
            }
        }
        clearTimeout(R_timer);
        var R_timer = setTimeout(function () {
            clearInterval(timer);
            timer = setInterval(playNext, time);
        }, time);
    }
}

