window.onload = function(){
    // 初始化页面功能
    // 搜索
    search();
    // 轮播图
    banner();
    // 倒计时
    downTime();
}

var search = function(){
    // 1、页面初始化，距离顶部是0的距离时，透明度是0
    // 2、当页面滚动的时候，随着页面距离顶部的距离变大，透明度变大
    // 3、当滚动的距离超过了轮播图时，保持不变

    // 获取dom元素
    var search = document.querySelector('.jd_search');
    var banner = document.querySelector('.jd_banner');
    // 距离范围
    var height = banner.offsetHeight;

    // 监听滚动事件
    window.onscroll = function(){
        // 获取当前页面滚动的距离
        var top = document.body.scrollTop;   // 谷歌
        // var top = documnet.documentElement.scrollTop;   // ie

        var opacity = 0;
        if (top>height){
            // 3、当滚动的距离超过了轮播图时，保持不变
            opacity = 0.85;
        }else{
            // 2、当页面滚动的时候，随着页面距离顶部的距离变大，透明度变大
            opacity = 0.85*(top/height);
        }

        // 设置颜色给搜索盒子
        search.style.background = 'rgba(228, 49, 48,'+opacity+')';
    }
}

var banner = function(){
    // 1、无缝滚动 & 无缝滑动 （定时器 过渡（即滑动的效果，而不是直接跳转） 位移）
    // 2、点盒子对应改变 （改变当前样式）
    // 3、可以滑动 （touch事件 监听触摸点坐标改变距离 位移）
    // 4、当滑动距离不够的时候，吸附回去 （过渡 位移）
    // 5、当滑动超过一定距离，跳转 上一张 下一张 （判断方向 过渡 位移）

    // 获取需要操作的dom元素
    // 大容器
    var banner = document.querySelector('.jd_banner');
    // 轮播图宽度
    var width = banner.offsetWidth;
    // 图片容器 ul:first是jQuery封装的选择器 css中是无效的，而querySelector用的选择器是css中有效的选择器
    var imageBox = banner.querySelector('ul:first-child');
    // 点容器
    var pointBox = banner.querySelector('ul:last-child');
    // 所有的点
    // var points = pointBox.childNodes;
    var points = pointBox.querySelectorAll('li');

    // 提几个公用方法
    var addTransition = function(){
        // 过渡
        imageBox.style.transition = 'all 0.2s';
        imageBox.style.webkitTransition = 'all 0.2s';
    }
    var removeTransition = function(){
        // 清除过渡
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    }
    var setTransition = function(translateX){
        // 定位
        imageBox.style.transform = 'translateX('+translateX+'px)';  // 移轮播图宽度
        imageBox.style.webkitTransform = 'translateX('+translateX+'px)';
    }

    // 1、无缝滚动 & 无缝滑动
    var index = 1;  // 默认图片索引
    // setInterval() 方法可按照指定的周期（以毫秒计）来调用函数或计算表达式
    // setInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。
    // 由 setInterval() 返回的 ID 值可用作 clearInterval() 方法的参数。
    var timer = setInterval(function(){
        index ++;
        // 过渡 
        addTransition();
        // 位移
        setTransition(-index*width);
    },3000);

    // 怎么监听'过渡结束'这个时间，过渡结束事件
    imageBox.addEventListener('transitionend',function(){
        // 无缝滚动
        if(index >= 9){
            // 瞬间定位到第一张
            index = 1;
            // 清除过渡
            removeTransition();
            // 定位
            setTransition(-index*width);
        }
        // 无缝滑动
        if(index <= 0){
            index = 8;
            // 清除过渡
            removeTransition();
            // 定位
            setTransition(-index*width);
        }
        setPoint();
    });

    // 2、点盒子对应改变 （改变当前样式）
    var setPoint = function(){
        // index 1-8
        // 去除所有的now样式
        for(var i=0; i < points.length; i++ ){
            points[i].classList.remove('now');
        }
        // 给对应的点加上
        points[index-1].classList.add('now');
    }

    // 3、可以滑动 （touch事件 监听触摸点坐标改变距离 位移）
    var startX = 0;
    // 严谨判断
    var isMove = false;
    imageBox.addEventListener('touchstart',function(e){
        // 清除定时器
        clearInterval(timer);
        // 记录开始的位置
        startX = e.changedTouches[0].clientX;
    });
    imageBox.addEventListener('touchmove',function(e){
        var moveX = e.changedTouches[0].clientX;
        var distanceX = moveX - startX;
        // distanceX 大于0的时候 向右滑动
        // distanceX 小于0的时候 向左滑动

        // 这个可用来做滑动 
        // 基于当前的位置 计算定位
        var translateX = -index*width + distanceX;
        // 过渡
        addTransition();
        // 定位
        setTransition(translateX);
        isMove = true;
    });
    imageBox.addEventListener('touchend',function(e){
        // 记录结束的位置
        var endX = e.changedTouches[0].clientX;
        var lastDistanceX = endX - startX;
        if( isMove && Math.abs(lastDistanceX) > (width/3) ){
            if ( lastDistanceX > 0 ){
                index -- ;
            }else{
                index ++ ;
            }
            // 过渡
            addTransition();
            // 定位
            setTransition(-index*width);
        }

        // var startTime = Date.now();
        // 加上的定时器
        // 严谨做法，保证只加一次定时器
        clearInterval(timer);
        var timer = setInterval(function(){
            index ++;
            // console.log(index);
            // console.log(Date.now()-startTime);
            // 过渡 
            addTransition();
            // 位移
            setTransition(-index*width);
            // startTime = Date.now();
        },3000);

        // 重置参数
        startX = 0;
        isMove = false;
    });
}

var downTime = function(){
    // 1、模拟倒计时的时间，是14个小时
    // 2、利用定时器，1秒一次 重新展示时间

    var time = 60*60*24;

    var skTime = document.querySelector('.sk_time');
    var skSpans = skTime.querySelectorAll('span');

    var now_time = new Date();
    var now_h = now_time.getHours();
    var now_m = now_time.getMinutes();
    var now_s = now_time.getSeconds();

    time = time - now_h*3600 - now_m*60 - now_s;

    var timer = setInterval(function(){
        time -- ;
        // 格式化时间
        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = Math.floor(time%60);

        if(time <= 0){
            clearInterval(timer);
            // 设置时间
            skSpans[0].innerHTML = 00;
            skSpans[1].innerHTML = 00;
            skSpans[2].innerHTML = 00;
        }else{
            // 设置时间
            if(h < 10){
                skSpans[0].innerHTML = '0' + h;
            }else{
                skSpans[0].innerHTML = h;
            }
            if(m < 10){
                skSpans[1].innerHTML = '0' + m;
            }else{
                skSpans[1].innerHTML = m;
            }
            if(s < 10){
                skSpans[2].innerHTML = '0' + s;
            }else{
                skSpans[2].innerHTML = s;
            }
        }

    },1000);
}