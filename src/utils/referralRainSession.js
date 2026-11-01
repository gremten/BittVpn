import rainVideoSrc from '../assets/animations/bitmap_matrix_rain_600x440_wave_slow.mp4';

let sessionVideo = null;
let readinessPromise = null;

function configureVideo(video) {
  video.className = 'referral-rain-video';
  video.muted = true;
  video.loop = true;
  video.autoplay = false;
  video.preload = 'auto';
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('muted', '');
  video.setAttribute('aria-hidden', 'true');
  video.disablePictureInPicture = true;

  // Set src exactly once for the page session. Re-entering Referral reuses the
  // same HTMLVideoElement, buffered bytes and current playback position.
  video.src = rainVideoSrc;
}

export function getReferralRainSessionVideo() {
  if (sessionVideo || typeof document === 'undefined') return sessionVideo;

  sessionVideo = document.createElement('video');
  configureVideo(sessionVideo);
  return sessionVideo;
}

export function preloadReferralRainMedia() {
  const video = getReferralRainSessionVideo();
  if (!video) return Promise.resolve();

  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }

  if (!readinessPromise) {
    readinessPromise = new Promise((resolve) => {
      const finish = () => {
        video.removeEventListener('loadeddata', finish);
        video.removeEventListener('canplay', finish);
        video.removeEventListener('error', finish);
        resolve();
      };

      video.addEventListener('loadeddata', finish, { once: true });
      video.addEventListener('canplay', finish, { once: true });
      video.addEventListener('error', finish, { once: true });
      video.load();
    });
  }

  return readinessPromise;
}
