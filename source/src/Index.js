import $ from 'jquery';
let TIMER_COUNT = 3;
let GAME_TIME = 60;
let score = 0;
let chillLifetime = 1200;
$(document).ready(function () { // change to deviceready after cordova integration
	$('#playNow').click(startGame);
	$('.home').click(showHome);
	$('#share').click(shareGame);
	$('#credits').click(showCredits);
	$('#shareScore').click(shareScore);
});

function showCredits() {
	$('.screen.active').removeClass('active');
	$('#creditsWrp').addClass('active');
}

function shareScore() {
	$('#gameOverMenu').css('display','none');
	html2canvas(document.body, {
	    onrendered: function(canvas) {
			$('#gameOverMenu').css('display','block');
	        window.plugins.socialsharing.share('ChillMaaroo: Checkout my highscore', null, canvas.toDataURL(), 'http://ow.ly/W7bh7');
	    }
	});
}

function shareGame() {
	window.plugins.socialsharing.share('Always stay chill with this ChillMaaroo App:', null, 'https://raw.githubusercontent.com/abhas9/chillmaaroo/master/res/icon.png', 'http://ow.ly/W7bh7');
}

function startGame() {
	showCounter(TIMER_COUNT).done(initGameScreen);
}

function showCounter(total) {
	$('.screen.active').removeClass('active');
	$('#counter').addClass('active');
	let defer = $.Deferred(), i = total;
	$('#counter #count').html(`[${i}]`);
	let interval = setInterval(() => {
		i--;
		if (i > 0) {
			$('#counter #count').html(`[${i}]`);
		} else if (i === 0) {
			$('#counter #count').html('[CHILL]');
		} else if (i < 0) {
			defer.resolve();
			clearInterval(interval)
		} 
	},1000);
	return defer;
}
function initGameTimer() {
	let timeRemaining = GAME_TIME
	$('#timer').html(`[${timeRemaining}]`);
	let defer = $.Deferred();
	let interval = setInterval(() => {
		timeRemaining--;
		$('#timer').html(`[${timeRemaining}]`);
		if (timeRemaining === 0) {
			defer.resolve();
			clearInterval(interval);
		}
	}, 1000)
	return defer;
}
function showFinalScore() {
	$('.screen.active').removeClass('active');
	$('#finalScore').html(`[${score}]`);
	$('#finalChillmeter .inner').css('marginTop', -score);
	$('#gameOver').addClass('active');
}
function initGameScreen() {
	renderScore();
	$('.screen.active').removeClass('active');
	$('#game').addClass('active');
	let chillCount = 7;
	let chillArr = [];
	let renderChill = function() {
		let c = new Chill();
		c.render();
		chillArr.push(c);
	};
	for (let i = 0; i < chillCount; i++) {
		setTimeout(renderChill, i * 450);
	}
	initGameTimer().then(() => {
		showFinalScore();
		for (let i = 0; i < chillCount; i++) {
			chillArr[i].destroy();
		}
	});
}
function showHome() {
	score = 0;
	$('.screen.active').removeClass('active');
	$('#welcome').addClass('active');
}
function renderScore() {
	$('#score').html(`[${score}]`);
	$('#inner').css('marginTop', -score);
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Chill {
	getRandomProps() {
		this.width = getRandomInt(10,70);
		this.height = this.width;
		this.top = getRandomInt(0, $('#playground').height() - this.height);
		this.left = getRandomInt(0, $('#playground').width() - this.width);
	}
	rerender() {
		this.destroy();
		this.render();
	}
	render() {
		this.id = guid();
		this.getRandomProps();
		let node = $('<img>', {
			id: this.id,
			src: 'dist/images/chill.png',
			css: {
				position: 'absolute',
				top: this.top,
				left: this.left,
				width: this.width
			},
			click: (event) => {
				$(event.target).remove();
				score += Math.round(this.width/10);
				clearInterval(this.interval);
				this.render();
				renderScore();
			}
		});
		this.interval = setInterval(this.rerender.bind(this), chillLifetime);
		$(playground).append(node);
	}
	destroy() {
		$('#' + this.id).remove();
		clearInterval(this.interval);
	}
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}