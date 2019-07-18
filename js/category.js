window.onload = function(){
    // 左侧 上下滑动
    upDownSwipe('.cate_left');
    // 右侧 上下滑动弄
    upDownSwipe('.cate_right');
    // 也可以使用iScroll插件实现
    // iscrollLeft();
    // 右侧  左右滑动   
    // iscroll不知道为啥，无法实现上下滑动，猜测可能是盒子的css的问题，或者我下的iscroll.js有问题
    // rightSwipe();
    
}

var upDownSwipe = function(boxName){
    // 1、上下滑动（touch事件 位移）
    var parentBar = document.querySelector(boxName);

    var childBox = parentBar.querySelector('div');

    var startY = 0;
    var distanceY = 0;
    var ismove = false;
    // 计算ul盒子距离手机屏幕顶端的距离   childBox.getBoundingClientRect().top
    // 计算ul盒子的高度                  childBox.scrollHeight
    // 计算屏幕的高度                    window.innerHeight
    var bottomY = childBox.scrollHeight - window.innerHeight + childBox.getBoundingClientRect().top;

    // 程序核心点，记录当前位置
    var currentY = 0;

    childBox.addEventListener('touchstart',function(e){
        startY = e.changedTouches[0].clientY;
    });
    childBox.addEventListener('touchmove',function(e){
        var moveY = e.changedTouches[0].clientY;
        distanceY = moveY - startY;
        // 将要去做定位的位置: 当前位置 + 移动的位置
        var translateY = currentY + distanceY;
        childBox.style.transform = 'translateY('+translateY+'px)';
        childBox.style.webkitTransform = 'translateY('+translateY+'px)';
        ismove = true;
    });
    childBox.addEventListener('touchend',function(e){
        var endY = e.changedTouches[0].clientY;
        distanceY = endY - startY;
        currentY = currentY + distanceY;
        // 超过第一个li就吸附回来
        if(currentY >= 0 && distanceY > 0){
            currentY = 0;
            childBox.style.transform = 'translateY('+currentY+'px)';
            childBox.style.webkitTransform = 'translateY('+currentY+'px)';
        }
        // 到达最底下一个也吸附回来
        if(currentY <= -bottomY){
            currentY = -bottomY;
            childBox.style.transform = 'translateY('+currentY+'px)';
            childBox.style.webkitTransform = 'translateY('+currentY+'px)';
        }
        ismove = true;
    });

}

var iscrollLeft = function(){
    // 上下滑动，这个无法使用
    // var leftScroll = new IScroll(".cate_left", {
    //     scrollbars: true,
    //     bounce: false,
    //     mouseWheel:true,
    //     click:true
    // });

    new IScroll(document.querySelector('.cate_left'),{
        scrollX: true,
        scrollY: true
    });
}

var rightSwipe = function(){
    // 左右滑动，这个也无法实现上下滑动
    new IScroll(document.querySelector('.cate_right'),{
        scrollX: true
    });
}