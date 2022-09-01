import Vue from 'vue';

let isFullScreen = false;

const doc: any = document;

function requestFullscreen() {
  if (isFullScreen) return;
  const ele = doc.documentElement;
  if (ele.requestFullscreen) {
    ele.requestFullscreen();
  } else if (ele.mozRequestFullScreen) {
    ele.mozRequestFullScreen();
  } else if (ele.webkitRequestFullScreen) {
    ele.webkitRequestFullScreen((Element as any).ALLOW_KEYBOARD_INPUT);
  } else if (ele.msRequestFullscreen) {
    ele.msRequestFullscreen();
  }
}

function cancelFullscreen() {
  if (!isFullScreen) return;
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  } else if (doc.webkitCancelFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  }
}

window.addEventListener('keydown', (e: any) => {
  if (e.shiftKey && String.fromCharCode(e.keyCode) === 'Z') { // Shift + Z
    if (isFullScreen) {
      cancelFullscreen();
    } else {
      requestFullscreen();
    }
  } else if (e.keyCode === 27) { // ESC
    cancelFullscreen();
  }
});

window.addEventListener('fullscreenchange', (e: any) => {
  isFullScreen = !isFullScreen;
  Vue.prototype.$emitter.emit('foldMenu', isFullScreen);
});
