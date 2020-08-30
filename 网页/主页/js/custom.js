/** 点击爱心JS */
! function(e, t, a) {
	function r() {
		for (var e = 0; e < s.length; e++) s[e].alpha <= 0 ? (t.body.removeChild(s[e].el), s.splice(e, 1)) : (s[e].y--, s[e].scale +=
			.004, s[e].alpha -= .013, s[e].el.style.cssText = "left:" + s[e].x + "px;top:" + s[e].y + "px;opacity:" + s[e].alpha +
			";transform:scale(" + s[e].scale + "," + s[e].scale + ") rotate(45deg);background:" + s[e].color + ";z-index:99999"
		);
		requestAnimationFrame(r)
	}

	function n() {
		var t = "function" == typeof e.onclick && e.onclick;
		e.onclick = function(e) {
			t && t(), o(e)
		}
	}

	function o(e) {
		var a = t.createElement("div");
		a.className = "heart", s.push({
			el: a,
			x: e.clientX - 5,
			y: e.clientY - 5,
			scale: 1,
			alpha: 1,
			color: c()
		}), t.body.appendChild(a)
	}

	function i(e) {
		var a = t.createElement("style");
		a.type = "text/css";
		try {
			a.appendChild(t.createTextNode(e))
		} catch (t) {
			a.styleSheet.cssText = e
		}
		t.getElementsByTagName("head")[0].appendChild(a)
	}

	function c() {
		return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
	}
	var s = [];
	e.requestAnimationFrame = e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame ||
		e.msRequestAnimationFrame || function(e) {
			setTimeout(e, 1e3 / 60)
		}, i(
			".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"
		), n(), r()
}(window, document);

/** 工作台JS */
! function(e) {
	function o(s) {
		if (t[s]) return t[s].exports;
		var n = t[s] = {
			exports: {},
			id: s,
			loaded: !1
		};
		return e[s].call(n.exports, n, n.exports, o), n.loaded = !0, n.exports
	}
	var t = {};
	return o.m = e, o.c = t, o.p = "", o(0)
}([function(e, o, t) {
	e.exports = t(1)
}, function(e, o) {
	! function() {
		var e;
		if (window.console && "undefined" != typeof console.log) {
			try {
				(window.parent.__has_console_security_message || window.top.__has_console_security_message) && (e = !0)
			} catch (o) {
				e = !0
			}
			if (window.__has_console_security_message || e) return;
			var t = "温馨提示：请不要在这里粘贴执行任何内容，这可能导致您的电脑受到攻击，给您带来损失！^_^",
				s = "XXXX，最专业的网络资源分享发布平台。",
				n = "https://www.XXXX.com",
				i = [s, " ", n].join("");
			/msie/gi.test(navigator.userAgent) ? (console.log(t), console.log(i)) : (console.log(
					"%c XXXX %c Copyright \xa9 2017-%s",
					'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;',
					"font-size:12px;color:#999999;", (new Date).getFullYear()), console.log("%c " + t, "color:#333;font-size:16px;"),
				console.log("\n " + i)), window.__has_console_security_message = !0
		}
	}()
}]);

/** 失去焦点浏览器动态标题JS */
jQuery(document).ready(function() {
	function c() {
		document.title = document[a] ? "(=・ω・=) 我藏起来了哦→《" + d + "》" : d
	}
	var a, b, d = document.title;
	"undefined" != typeof document.hidden ? (a = "hidden", b = "visibilitychange") : "undefined" != typeof document.mozHidden ?
		(a = "mozHidden", b = "mozvisibilitychange") : "undefined" != typeof document.webkitHidden && (a = "webkitHidden",
			b = "webkitvisibilitychange");
	"undefined" == typeof document.addEventListener && "undefined" == typeof document[a] || document.addEventListener(b,
		c, !1)
});
