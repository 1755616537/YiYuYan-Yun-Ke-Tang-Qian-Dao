(function ($,window) {
    var popupStack=[];
    var backdrop = (function() {
        var element = document.createElement('div');
        element.classList.add('mui-popup-backdrop');
        element.addEventListener($.EVENT_MOVE, $.preventDefault);
        element.addEventListener('webkitTransitionEnd', function() {
            if (!this.classList.contains('mui-active')) {
                element.parentNode && element.parentNode.removeChild(element);
            }
        });
        return element;
    }());
    var loading=function (msg) {
        var html='<div class="mui-popup-inner"><div class="mui-popup-load" ></div><div class="mui-popup-text">'+msg+'</div></div>';
        var div=document.createElement('div');
        div.classList.add('mui-popup');
        div.innerHTML=html;
        var removePopupElement = function() {
            div.parentNode && div.parentNode.removeChild(div);
            div = null;
        };
        div.addEventListener($.EVENT_MOVE, $.preventDefault);
        div.addEventListener('webkitTransitionEnd', function(e) {
            if (div && e.target === div && div.classList.contains('mui-popup-out')) {
                removePopupElement();
            }
        });
        div.style.display = 'block';
        document.body.appendChild(div);
        div.classList.add('mui-popup-in');
        backdrop.style.display = 'block';
        document.body.appendChild(backdrop);
        backdrop.classList.add('mui-active');
        var popup = {
            element: div,
            close: function(index, animate) {
                if (div) {
                    if (animate !== false) {
                        div.classList.remove('mui-popup-in');
                        div.classList.add('mui-popup-out');
                    } else {
                        removePopupElement();
                    }
                    popupStack.pop();
                    //如果还有其他popup，则不remove backdrop
                    if (popupStack.length) {
                        popupStack[popupStack.length - 1]['show'](animate);
                    } else {
                        backdrop.classList.remove('mui-active');
                    }
                }
            }
        };
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['hide']();
        }
        popupStack.push({
            close: popup.close,
            show: function(animate) {
                div.style.display = 'block';
                div.offsetHeight;
                div.classList.add('mui-popup-in');
            },
            hide: function() {
                div.style.display = 'none';
                div.classList.remove('mui-popup-in');
            }
        });
       return popup;
    };
    $.loaded = function() {
        if (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
            return true;
        } else {
            return false;
        }
    };
    $.loadeds = function() {
        while (popupStack.length) {
            popupStack[popupStack.length - 1]['close']();
        }
    };
   $.loading=loading
})(mui,window);