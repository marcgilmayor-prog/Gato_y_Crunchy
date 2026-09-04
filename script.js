/**
 * GATO Y CRUNCHY — PITCH BIBLE INTERACTIVA
 * Motor de Diálogos Hablados con Subtitulado Dinámico en Directo en Cada Escena
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado global
  let audioEnabled = true;
  let voiceEnabled = false; // disable character voice playback
  let audioCtx = null;
  const portalAudioEl = document.getElementById('portal-audio-element');
  const fotoAudioEl = document.getElementById('foto-audio-element');
  const sartenAudioEl = document.getElementById('sarten-audio-element');
  const fuegoAudioEl = document.getElementById('fuego-audio-element');
  const rocaRodandoAudioEl = document.getElementById('roca-rodando-audio-element');
  const rocaHit1AudioEl = document.getElementById('roca-hit1-audio-element');
  const rocaHit2AudioEl = document.getElementById('roca-hit2-audio-element');
  const rocaHit3AudioEl = document.getElementById('roca-hit3-audio-element');
  const rocaBreakAudioEl = document.getElementById('roca-break-audio-element');
  const libroAudioEl = document.getElementById('libro-audio-element');
  const libroTabClickAudioEl = document.getElementById('libro-tab-click-audio-element');
  const uiBtnClickAudioEl = document.getElementById('ui-btn-click-audio-element');
  const logoBoingAudioEl = document.getElementById('logo-boing-audio-element');
  const dialogueClickAudioEl = document.getElementById('dialogue-click-audio-element');

  // Inicialización de Web Audio API con desbloqueo robusto
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Desbloqueo universal de audio con el primer toque o interacción
  function unlockGlobalAudio() {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      if (portalAudioEl && portalAudioEl.readyState === 0) {
        portalAudioEl.load();
      }
      if (fotoAudioEl && fotoAudioEl.readyState === 0) {
        fotoAudioEl.load();
      }
      if (sartenAudioEl && sartenAudioEl.readyState === 0) {
        sartenAudioEl.load();
      }
      if (fuegoAudioEl && fuegoAudioEl.readyState === 0) {
        fuegoAudioEl.load();
      }
      if (rocaRodandoAudioEl && rocaRodandoAudioEl.readyState === 0) {
        rocaRodandoAudioEl.load();
      }
      if (rocaHit1AudioEl && rocaHit1AudioEl.readyState === 0) {
        rocaHit1AudioEl.load();
      }
      if (rocaHit2AudioEl && rocaHit2AudioEl.readyState === 0) {
        rocaHit2AudioEl.load();
      }
      if (rocaHit3AudioEl && rocaHit3AudioEl.readyState === 0) {
        rocaHit3AudioEl.load();
      }
      if (rocaBreakAudioEl && rocaBreakAudioEl.readyState === 0) {
        rocaBreakAudioEl.load();
      }
      if (libroAudioEl && libroAudioEl.readyState === 0) {
        libroAudioEl.load();
      }
      if (libroTabClickAudioEl && libroTabClickAudioEl.readyState === 0) {
        libroTabClickAudioEl.load();
      }
      if (uiBtnClickAudioEl && uiBtnClickAudioEl.readyState === 0) {
        uiBtnClickAudioEl.load();
      }
      if (logoBoingAudioEl && logoBoingAudioEl.readyState === 0) {
        logoBoingAudioEl.load();
      }
      if (dialogueClickAudioEl && dialogueClickAudioEl.readyState === 0) {
        dialogueClickAudioEl.load();
      }
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  ['click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockGlobalAudio, { passive: true, once: true });
  });

  // ========================================================
  // CONTROL DE AUDIO DEL PORTAL CON FADE-IN Y FADE-OUT SUAVE
  // ========================================================
  let portalFadeTimer = null;
  const PORTAL_TARGET_VOL = 0.6;

  function fadeInPortalAudio(duration = 1200) {
    if (!audioEnabled || !portalAudioEl) return;
    unlockGlobalAudio();

    // Si ya está sonando (en plena conversación o tras hacer clic para avanzar),
    // NO reiniciar ni interrumpir: dejar que continúe sonando de forma fluida.
    if (!portalAudioEl.paused && portalAudioEl.currentTime > 0) {
      return;
    }

    if (portalFadeTimer) {
      clearInterval(portalFadeTimer);
      portalFadeTimer = null;
    }
    try {
      portalAudioEl.currentTime = 0;
      portalAudioEl.volume = 0.05;
      const playPromise = portalAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Portal audio play exception:', e));
      }
      const steps = 25;
      const stepTime = duration / steps;
      let curStep = 0;
      portalFadeTimer = setInterval(() => {
        curStep++;
        const factor = Math.min(1, curStep / steps);
        if (portalAudioEl) {
          portalAudioEl.volume = PORTAL_TARGET_VOL * factor;
        }
        if (curStep >= steps) {
          clearInterval(portalFadeTimer);
          portalFadeTimer = null;
        }
      }, stepTime);
    } catch (e) {
      console.warn('Error en fadeInPortalAudio:', e);
    }
  }

  function fadeOutPortalAudio(duration = 1800) {
    if (!portalAudioEl || portalAudioEl.paused) return;
    if (portalFadeTimer) {
      clearInterval(portalFadeTimer);
      portalFadeTimer = null;
    }
    const steps = 30;
    const stepTime = duration / steps;
    let curStep = 0;
    const startVol = portalAudioEl.volume;
    portalFadeTimer = setInterval(() => {
      curStep++;
      const factor = Math.max(0, 1 - (curStep / steps));
      if (portalAudioEl) {
        portalAudioEl.volume = startVol * factor;
      }
      if (curStep >= steps) {
        clearInterval(portalFadeTimer);
        portalFadeTimer = null;
        if (portalAudioEl) {
          portalAudioEl.pause();
          portalAudioEl.currentTime = 0;
          portalAudioEl.volume = PORTAL_TARGET_VOL;
        }
      }
    }, stepTime);
  }

  function stopPortalAudioImmediate() {
    if (portalFadeTimer) {
      clearInterval(portalFadeTimer);
      portalFadeTimer = null;
    }
    if (portalAudioEl) {
      portalAudioEl.pause();
      portalAudioEl.currentTime = 0;
      portalAudioEl.volume = PORTAL_TARGET_VOL;
    }
  }

  function playPortalAudio(duration = 800) {
    fadeInPortalAudio(duration);
  }

  function playFreesoundPortal(duration = 800) {
    fadeInPortalAudio(duration);
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE LA FOTO (ESCENA 02)
  // ========================================================
  function playFotoAudio() {
    if (!audioEnabled || !fotoAudioEl) return;
    unlockGlobalAudio();
    try {
      fotoAudioEl.currentTime = 0;
      fotoAudioEl.volume = 0.8;
      const playPromise = fotoAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Foto audio play exception:', e));
      }
    } catch (e) {
      console.warn('Error en playFotoAudio:', e);
    }
  }

  // ========================================================
  // CONTROL DE AUDIO DE LA SARTÉN CON FADE-IN Y FADE-OUT SUAVE (ESCENA 03)
  // ========================================================
  let sartenFadeTimer = null;
  const SARTEN_TARGET_VOL = 0.7;

  function fadeInSartenAudio(duration = 1000) {
    if (!audioEnabled || !sartenAudioEl) return;
    unlockGlobalAudio();

    if (sartenFadeTimer) {
      clearInterval(sartenFadeTimer);
      sartenFadeTimer = null;
    }

    if (!sartenAudioEl.paused && sartenAudioEl.currentTime > 0) {
      sartenAudioEl.volume = SARTEN_TARGET_VOL;
      return;
    }

    try {
      sartenAudioEl.currentTime = 0;
      sartenAudioEl.volume = 0.05;
      const playPromise = sartenAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Sarten audio play exception:', e));
      }
      const steps = 20;
      const stepTime = duration / steps;
      let curStep = 0;
      sartenFadeTimer = setInterval(() => {
        curStep++;
        const factor = Math.min(1, curStep / steps);
        if (sartenAudioEl) {
          sartenAudioEl.volume = SARTEN_TARGET_VOL * factor;
        }
        if (curStep >= steps) {
          clearInterval(sartenFadeTimer);
          sartenFadeTimer = null;
        }
      }, stepTime);
    } catch (e) {
      console.warn('Error en fadeInSartenAudio:', e);
    }
  }

  function fadeOutSartenAudio(duration = 1400) {
    if (!sartenAudioEl || sartenAudioEl.paused) return;
    if (sartenFadeTimer) {
      clearInterval(sartenFadeTimer);
      sartenFadeTimer = null;
    }
    const steps = 28;
    const stepTime = Math.max(16, Math.floor(duration / steps));
    let curStep = 0;
    const startVol = sartenAudioEl.volume;
    sartenFadeTimer = setInterval(() => {
      curStep++;
      const factor = Math.max(0, 1 - (curStep / steps));
      if (sartenAudioEl) {
        sartenAudioEl.volume = Math.max(0, Math.min(1, startVol * factor));
      }
      if (curStep >= steps) {
        clearInterval(sartenFadeTimer);
        sartenFadeTimer = null;
        if (sartenAudioEl) {
          sartenAudioEl.pause();
          sartenAudioEl.currentTime = 0;
          sartenAudioEl.volume = SARTEN_TARGET_VOL;
        }
      }
    }, stepTime);
  }

  function stopSartenAudioImmediate() {
    if (sartenFadeTimer) {
      clearInterval(sartenFadeTimer);
      sartenFadeTimer = null;
    }
    if (sartenAudioEl) {
      sartenAudioEl.pause();
      sartenAudioEl.currentTime = 0;
      sartenAudioEl.volume = SARTEN_TARGET_VOL;
    }
  }

  function stopSartenAudio() {
    stopSartenAudioImmediate();
  }

  // ========================================================
  // CONTROL DE AUDIO DE FUEGO / MUNDO VOLCÁNICO (ESCENA 05) CON FADE SUAVE
  // ========================================================
  let fuegoFadeTimer = null;
  const FUEGO_TARGET_VOL = 0.65;

  function fadeInFuegoAudio(duration = 900) {
    if (!audioEnabled || !fuegoAudioEl) return;
    unlockGlobalAudio();

    if (fuegoFadeTimer) {
      clearInterval(fuegoFadeTimer);
      fuegoFadeTimer = null;
    }

    try {
      if (fuegoAudioEl.paused) {
        fuegoAudioEl.currentTime = 0;
        fuegoAudioEl.volume = 0.05;
        const playPromise = fuegoAudioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.warn('Fuego audio play exception:', e));
        }
      }
      const steps = 20;
      const stepTime = duration / steps;
      let curStep = 0;
      fuegoFadeTimer = setInterval(() => {
        curStep++;
        const factor = Math.min(1, curStep / steps);
        if (fuegoAudioEl) {
          fuegoAudioEl.volume = Math.max(0, Math.min(1, FUEGO_TARGET_VOL * factor));
        }
        if (curStep >= steps) {
          clearInterval(fuegoFadeTimer);
          fuegoFadeTimer = null;
        }
      }, stepTime);
    } catch (e) {
      console.warn('Error en fadeInFuegoAudio:', e);
    }
  }

  function fadeOutFuegoAudio(duration = 1000) {
    if (!fuegoAudioEl || fuegoAudioEl.paused) return;
    if (fuegoFadeTimer) {
      clearInterval(fuegoFadeTimer);
      fuegoFadeTimer = null;
    }
    const steps = 25;
    const stepTime = Math.max(16, Math.floor(duration / steps));
    let curStep = 0;
    const startVol = fuegoAudioEl.volume;
    fuegoFadeTimer = setInterval(() => {
      curStep++;
      const factor = Math.max(0, 1 - (curStep / steps));
      if (fuegoAudioEl) {
        fuegoAudioEl.volume = Math.max(0, Math.min(1, startVol * factor));
      }
      if (curStep >= steps) {
        clearInterval(fuegoFadeTimer);
        fuegoFadeTimer = null;
        if (fuegoAudioEl) {
          fuegoAudioEl.pause();
          fuegoAudioEl.currentTime = 0;
          fuegoAudioEl.volume = FUEGO_TARGET_VOL;
        }
      }
    }, stepTime);
  }

  function stopFuegoAudioImmediate() {
    if (fuegoFadeTimer) {
      clearInterval(fuegoFadeTimer);
      fuegoFadeTimer = null;
    }
    if (fuegoAudioEl) {
      fuegoAudioEl.pause();
      fuegoAudioEl.currentTime = 0;
      fuegoAudioEl.volume = FUEGO_TARGET_VOL;
    }
  }

  // ========================================================
  // CONTROL DE AUDIO DE ROCA RODANDO (ESCENA 06)
  // ========================================================
  let rocaRollFadeTimer = null;
  let rocaRollTimeout = null;

  function playRocaRodandoAudio(durationMs = 2800) {
    if (!audioEnabled || !rocaRodandoAudioEl) return;
    unlockGlobalAudio();
    stopRocaRodandoAudio();

    try {
      rocaRodandoAudioEl.currentTime = 0;
      rocaRodandoAudioEl.volume = 0.85;
      const playPromise = rocaRodandoAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Roca rodando audio play exception:', e));
      }

      // El sonido se desvanece y termina justo cuando la roca desaparece (a los 2.8s)
      const fadeStartTime = Math.max(0, durationMs - 700);
      rocaRollTimeout = setTimeout(() => {
        fadeOutRocaRodandoAudio(700);
      }, fadeStartTime);
    } catch (e) {
      console.warn('Error en playRocaRodandoAudio:', e);
    }
  }

  function fadeOutRocaRodandoAudio(duration = 700) {
    if (!rocaRodandoAudioEl || rocaRodandoAudioEl.paused) return;
    if (rocaRollFadeTimer) {
      clearInterval(rocaRollFadeTimer);
      rocaRollFadeTimer = null;
    }
    const steps = 18;
    const stepTime = Math.max(16, Math.floor(duration / steps));
    let curStep = 0;
    const startVol = rocaRodandoAudioEl.volume;
    rocaRollFadeTimer = setInterval(() => {
      curStep++;
      const factor = Math.max(0, 1 - (curStep / steps));
      if (rocaRodandoAudioEl) {
        rocaRodandoAudioEl.volume = Math.max(0, Math.min(1, startVol * factor));
      }
      if (curStep >= steps) {
        clearInterval(rocaRollFadeTimer);
        rocaRollFadeTimer = null;
        if (rocaRodandoAudioEl) {
          rocaRodandoAudioEl.pause();
          rocaRodandoAudioEl.currentTime = 0;
          rocaRodandoAudioEl.volume = 0.85;
        }
      }
    }, stepTime);
  }

  function stopRocaRodandoAudio() {
    if (rocaRollTimeout) {
      clearTimeout(rocaRollTimeout);
      rocaRollTimeout = null;
    }
    if (rocaRollFadeTimer) {
      clearInterval(rocaRollFadeTimer);
      rocaRollFadeTimer = null;
    }
    if (rocaRodandoAudioEl) {
      rocaRodandoAudioEl.pause();
      rocaRodandoAudioEl.currentTime = 0;
      rocaRodandoAudioEl.volume = 0.85;
    }
  }

  // ========================================================
  // CONTROL DE AUDIO DE IMPACTOS EN LA ROCA (ESCENA 08)
  // ========================================================
  function playRocaHitAudio(hitNumber) {
    if (!audioEnabled) return;
    unlockGlobalAudio();
    let targetEl = null;
    if (hitNumber === 1) targetEl = rocaHit1AudioEl;
    else if (hitNumber === 2) targetEl = rocaHit2AudioEl;
    else if (hitNumber === 3) targetEl = rocaHit3AudioEl;

    if (targetEl) {
      try {
        targetEl.currentTime = 0;
        targetEl.volume = 0.95;
        const playPromise = targetEl.play();
        if (playPromise !== undefined) {
          playPromise.catch((e) => console.warn(`Roca hit ${hitNumber} play exception:`, e));
        }
      } catch (e) {
        console.warn(`Error en playRocaHitAudio ${hitNumber}:`, e);
      }
    }
  }

  function playRocaBreakAudio() {
    if (!audioEnabled || !rocaBreakAudioEl) return;
    unlockGlobalAudio();
    try {
      rocaBreakAudioEl.currentTime = 0;
      rocaBreakAudioEl.volume = 1.0;
      const playPromise = rocaBreakAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Roca break play exception:', e));
      }
    } catch (e) {
      console.warn('Error en playRocaBreakAudio:', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE ABRIR EL LIBRO DE PERSONAJES
  // ========================================================
  function playLibroAudio() {
    if (!audioEnabled || !libroAudioEl) return;
    unlockGlobalAudio();
    try {
      libroAudioEl.currentTime = 0;
      libroAudioEl.volume = 0.9;
      const playPromise = libroAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Libro audio play exception:', e));
      }
    } catch (e) {
      console.warn('Error en playLibroAudio:', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO AL CAMBIAR DE FICHA EN EL LIBRO (PORTAPÁGINAS)
  // ========================================================
  function playLibroTabClickAudio() {
    if (!audioEnabled || !libroTabClickAudioEl) return;
    unlockGlobalAudio();
    try {
      libroTabClickAudioEl.currentTime = 0;
      libroTabClickAudioEl.volume = 0.85;
      const playPromise = libroTabClickAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Libro tab click audio exception:', e));
      }
    } catch (e) {
      console.warn('Error en playLibroTabClickAudio:', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE CLIC DE BOTONES (CRUZ Y SONIDO)
  // ========================================================
  function playUiBtnClickAudio(forcePlay = false) {
    if (!uiBtnClickAudioEl) return;
    if (!audioEnabled && !forcePlay) return;
    unlockGlobalAudio();
    try {
      uiBtnClickAudioEl.currentTime = 0;
      uiBtnClickAudioEl.volume = 0.9;
      const playPromise = uiBtnClickAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('UI button click audio exception:', e));
      }
    } catch (e) {
      console.warn('Error en playUiBtnClickAudio:', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE BOING / RESORTE DEL LOGOTIPO
  // ========================================================
  function playLogoBoingAudio() {
    if (!audioEnabled || !logoBoingAudioEl) return;
    unlockGlobalAudio();
    try {
      logoBoingAudioEl.currentTime = 0;
      logoBoingAudioEl.volume = 0.9;
      const playPromise = logoBoingAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => console.warn('Logo boing audio play exception:', e));
      }
    } catch (e) {
      console.warn('Error en playLogoBoingAudio:', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE POMPA / BURBUJA CARTOON (POP SUAVE)
  // ========================================================
  function playDialogueAudio() {
    if (!audioEnabled) return;
    unlockGlobalAudio();
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Curva de tono elástica y dulce de burbuja de cómic
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.075);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {
      console.warn('Error en playDialogueAudio (pop suave):', e);
    }
  }

  // ========================================================
  // REPRODUCCIÓN DEL SONIDO DE RECOGER OBJETO / UVA (ESCENA 09)
  // ========================================================
  function playGrapeCollectAudio() {
    if (!audioEnabled) return;
    unlockGlobalAudio();
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sonido limpio, nítido y ligero de recogida de objeto / item collect
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.08); // D6

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {
      console.warn('Error en playGrapeCollectAudio:', e);
    }
  }

  // Interacción Dinámica con el Logotipo Oficial de Portada
  const logoContainer = document.querySelector('.logo-official-container');
  if (logoContainer) {
    logoContainer.addEventListener('click', () => {
      playLogoBoingAudio();
      logoContainer.style.transform = 'scale(1.08) translateY(-12px)';
      setTimeout(() => { logoContainer.style.transform = ''; }, 350);
    });
  }

  // Interacción Táctil y Clic con Personajes de Portada (Crunchy y Gato)
  const crunchyCover = document.getElementById('portada-crunchy-interactive');
  const gatoCover = document.getElementById('portada-gato-interactive');

  if (crunchyCover) {
    crunchyCover.addEventListener('click', () => {
      playDialogueAudio();
      crunchyCover.classList.toggle('is-active-pose');
      if (gatoCover) gatoCover.classList.remove('is-active-pose');
    });
  }

  if (gatoCover) {
    gatoCover.addEventListener('click', () => {
      playDialogueAudio();
      gatoCover.classList.toggle('is-active-pose');
      if (crunchyCover) crunchyCover.classList.remove('is-active-pose');
    });
  }

  // Barra de progreso superior con punta redondeada y borde negro
  const barraProgres = document.getElementById('barra-progres');
  if (barraProgres) {
    const updateProgress = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      barraProgres.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }



  // ========================================================
  // SISTEMA DE VOCES DE PERSONAJES (SPEECH SYNTHESIS SIN CORTES)
  // ========================================================
  // Variable global para evitar que el Garbage Collector de Chrome corte el audio
  window._activeSpeechUtterance = null;
  let activeSpeechTimeout = null;

  const VoiceEngine = {
    stop() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (activeSpeechTimeout) {
        clearTimeout(activeSpeechTimeout);
        activeSpeechTimeout = null;
      }
    },

    speak(text, character = 'gato', onEndCallback = null, onStartCallback = null) {
      if (!audioEnabled) {
        if (onStartCallback) onStartCallback();
        const estTime = Math.max(text.split(' ').length * 320, 1800);
        setTimeout(() => {
          if (onEndCallback) onEndCallback();
        }, estTime);
        return;
      }

      // Unlock audio globally (if needed)
      unlockGlobalAudio();

      // Skip character voice playback if voiceEnabled is false
      if (voiceEnabled) {
        // Procedural cartoon babble for the character
        SFXEngine.play(`voice-${character}`);
      }

      // Clean text for natural pronunciation (used for speech synthesis if enabled)
      const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[—«»"']/g, '').trim();

      if (!voiceEnabled || !('speechSynthesis' in window)) {
        if (onStartCallback) onStartCallback();
        const estTime = Math.max(cleanText.split(' ').length * 350, 2000);
        if (onEndCallback) setTimeout(onEndCallback, estTime);
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) { }

      // Only create speech synthesis utterance if voiceEnabled is true
      let utterance = null;
      if (voiceEnabled) {
        utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'es-ES';
        if (character === 'gato') {
          utterance.pitch = 1.25;
          utterance.rate = 0.95;
        } else if (character === 'crunchy') {
          utterance.pitch = 1.45;
          utterance.rate = 0.98;
        } else if (character === 'riolita' || character === 'carbon') {
          utterance.pitch = 1.32;
          utterance.rate = 1.02;
        } else if (character === 'oti') {
          utterance.pitch = 0.8;
          utterance.rate = 0.95;
        } else if (character === 'basalto') {
          utterance.pitch = 0.76;
          utterance.rate = 0.95;
        }
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const spanishVoice = voices.find(v => v.lang && (v.lang.toLowerCase().startsWith('es') || v.lang.toLowerCase().includes('spa')));
          if (spanishVoice) {
            utterance.voice = spanishVoice;
          }
        }
        // Store globally to prevent GC
        window._activeSpeechUtterance = utterance;
      }

      // Store globally to prevent GC
      window._activeSpeechUtterance = utterance;

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        if (activeSpeechTimeout) {
          clearTimeout(activeSpeechTimeout);
          activeSpeechTimeout = null;
        }
        window._activeSpeechUtterance = null;

        // Pausa natural y cómoda de 600ms antes de que hable el siguiente personaje
        if (onEndCallback) {
          setTimeout(onEndCallback, 600);
        }
      };

      if (voiceEnabled && utterance) {
        utterance.onstart = () => {
          if (onStartCallback) onStartCallback();
        };

        utterance.onend = () => {
          finish();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis event error:', e);
          finish();
        };

        // Safety timeout
        const wordCount = cleanText.split(' ').length;
        const maxSafetyDuration = Math.max(wordCount * 900, 7000);
        activeSpeechTimeout = setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            finish();
          }
        }, maxSafetyDuration);

        // Small delay before speaking
        setTimeout(() => {
          try {
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            window.speechSynthesis.speak(utterance);
          } catch (err) {
            console.warn('Speech speak exception:', err);
            finish();
          }
        }, 50);
      } else {
        // If voice disabled, just call callbacks after estimated time
        if (onStartCallback) onStartCallback();
        const estTime = Math.max(cleanText.split(' ').length * 320, 1800);
        setTimeout(() => {
          if (onEndCallback) onEndCallback();
        }, estTime);
      }
    }
  };

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // ========================================================
  // SINTETIZADOR DE EFECTOS PROCEDURALES (SFX)
  // ========================================================
  const SFXEngine = {
    play(type) {
      if (!audioEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        switch (type) {
          case 'portal-star': {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(880, now);
            osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.8);

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, now);
            filter.frequency.exponentialRampToValueAtTime(2000, now + 1.2);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

            osc.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc2.start(now);
            osc.stop(now + 1.3);
            osc2.stop(now + 1.3);
            break;
          }

          case 'whoop': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(980, now + 0.32);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.32);
            break;
          }

          case 'banjo-sarten': {
            [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + i * 0.12);
              gain.gain.setValueAtTime(0.14, now + i * 0.12);
              gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + i * 0.12);
              osc.stop(now + i * 0.12 + 0.4);
            });
            break;
          }

          case 'crash-grapes':
          case 'explosion': {
            const bufferSize = ctx.sampleRate * 0.45;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 650;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);
            break;
          }

          case 'lava-bubble':
          case 'rock-rumble': {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(70, now);
            osc.frequency.linearRampToValueAtTime(40, now + 0.85);
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 190;
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.9);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.9);
            break;
          }

          case 'triumph-chime': {
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.08);
              gain.gain.setValueAtTime(0.18, now + idx * 0.08);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.08);
              osc.stop(now + idx * 0.08 + 1.2);
            });
            break;
          }

          case 'magic-grape-reward': {
            const bellNotes = [659.25, 880.00, 987.77, 1318.51, 1567.98, 1975.53];
            bellNotes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.07);
              gain.gain.setValueAtTime(0.15, now + idx * 0.07);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.4);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.07);
              osc.stop(now + idx * 0.07 + 1.4);
            });
            const glock = ctx.createOscillator();
            const glockGain = ctx.createGain();
            glock.type = 'triangle';
            glock.frequency.setValueAtTime(2637.02, now + 0.42);
            glockGain.gain.setValueAtTime(0.12, now + 0.42);
            glockGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
            glock.connect(glockGain);
            glockGain.connect(ctx.destination);
            glock.start(now + 0.42);
            glock.stop(now + 1.6);
            break;
          }

          case 'banquet-complete': {
            const chordNotes = [349.23, 440.00, 523.25, 659.25];
            chordNotes.forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + idx * 0.09);
              gain.gain.setValueAtTime(0.16, now + idx * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 1.8);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.09);
              osc.stop(now + idx * 0.09 + 1.8);
            });
            break;
          }

          case 'voice-gato': {
            [392, 523.25, 659.25, 523.25].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, now + idx * 0.07);
              gain.gain.setValueAtTime(0.12, now + idx * 0.07);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.12);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.07);
              osc.stop(now + idx * 0.07 + 0.12);
            });
            break;
          }

          case 'voice-crunchy': {
            [587.33, 783.99, 880.00, 783.99].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.06);
              gain.gain.setValueAtTime(0.14, now + idx * 0.06);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.1);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.06);
              osc.stop(now + idx * 0.06 + 0.1);
            });
            break;
          }

          case 'voice-oti': {
            [130.81, 164.81, 196.00, 146.83].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now + idx * 0.1);
              gain.gain.setValueAtTime(0.18, now + idx * 0.1);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.1);
              osc.stop(now + idx * 0.1 + 0.2);
            });
            break;
          }

          case 'voice-carbon':
          case 'voice-basalto': {
            [110.00, 146.83, 98.00].forEach((freq, idx) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, now + idx * 0.09);
              gain.gain.setValueAtTime(0.15, now + idx * 0.09);
              gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start(now + idx * 0.09);
              osc.stop(now + idx * 0.09 + 0.18);
            });
            break;
          }

          case 'pop':
          default: {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
          }
        }
      } catch (e) {
        console.warn('Audio Context Error:', e);
      }
    }
  };

  // ========================================================
  // CONTROL DE AUDIO FLOTANTE
  // ========================================================
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      playUiBtnClickAudio(true);
      btnAudioToggle.classList.toggle('is-audio-on', audioEnabled);
      btnAudioToggle.classList.toggle('is-audio-off', !audioEnabled);
      const label = btnAudioToggle.querySelector('.lbl-audio');
      if (label) {
        label.textContent = audioEnabled ? 'SFX & VOCES: ON' : 'SFX & VOCES: OFF';
      }
      if (!audioEnabled) {
        cancelAllSequences();
      }
    });
  }

  // ========================================================
  // CONTROL DEL LIBRO DE PERSONAJES
  // ========================================================
  const btnLibroToggle = document.getElementById('btn-libro-toggle');
  const libroPanel = document.getElementById('libro-panel');
  const btnLibroClose = document.getElementById('btn-libro-close');

  const personajeData = {
    gato: {
      nombre: 'Gato',
      img: 'assets/personajes/gato/Gato_CuerpoEntero.png',
      desc: 'Gato es el protagonista principal y mellizo de Crunchy. Es un gato naranja, delgado, curioso, impulsivo e ingenuo. Actúa sin pensar, provocando el caos sin mala intención. Es bondadoso, confía en los demás y siempre busca ayudar. Le encanta explorar, hacer amigos, comer y coleccionar objetos extraños. Cada aventura le ayuda a comprender mejor sus emociones y las de Crunchy.'
    },
    crunchy: {
      nombre: 'Crunchy',
      img: 'assets/personajes/crunchy/Crunchy_CuerpoEntero.png',
      desc: 'Crunchy es una pequeña cerdita rosa, racional, organizada y observadora. Melliza de Gato, suele intentar mantener el control y pensar antes de actuar, aunque se frustra cuando las cosas no salen como planea. Admira profundamente a su hermano y, pese a sus diferencias, siempre lo acompaña en sus aventuras. Es responsable, sensible y protectora, y su objetivo es ayudar a los demás y proteger a quienes quiere.'
    },
    oti: {
      nombre: 'Oti Reboti',
      img: 'assets/personajes/oti/Oti_CuerpoEntero.png',
      desc: 'Oti es un enorme oso marrón de aspecto bonachón, tranquilo, paciente y protector. Tiene una personalidad serena y siempre intenta mantener la calma ante los conflictos. Es quien cuida y guía a Gato y Crunchy, ayudándolos a afrontar sus problemas sin darles las respuestas directamente. Confía en que aprendan de sus propias experiencias y descubran sus emociones por sí mismos.'
    },
    riolita: {
      nombre: 'Riolita',
      img: 'assets/personajes/riolita/Riolita_CuerpoEntero.png',
      desc: 'Riolita es una exploradora intrépida de pelaje rosa con manchas, cuya apariencia y colores están inspirados en la piedra volcánica riolita. Curiosa y aventurera, siempre está preparada para descubrir nuevos lugares y enfrentarse a cualquier desafío. Lleva su equipo de exploración siempre listo, convirtiéndola en una compañera preparada para cualquier aventura.'
    },
    basalto: {
      nombre: 'Basalto',
      img: 'assets/personajes/basalto/Basalto_CuerpoEntero.png',
      desc: 'Basalto es un oso trabajador, resistente y de gran fortaleza, inspirado en la roca que lleva su nombre. Aunque puede parecer serio y rudo, esconde un corazón noble y siempre está dispuesto a ayudar. Conoce todos los secretos subterráneos y destaca por su experiencia y conocimiento de las profundidades.'
    }
  };

  if (btnLibroToggle && libroPanel) {
    const btnLibroMobileClose = document.getElementById('btn-libro-mobile-close');
    const mobileScrollContainer = document.getElementById('libro-mobile-scroll');

    function openLibro() {
      playLibroAudio();
      libroPanel.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Reset de scroll en móvil para empezar desde arriba
      if (mobileScrollContainer) {
        mobileScrollContainer.scrollTop = 0;
      }

      // Si no hay ninguno activo, seleccionar Gato por defecto (desktop)
      const activo = libroPanel.querySelector('.marcador.activo');
      if (!activo) {
        const primerMarcador = libroPanel.querySelector('.marcador[data-char="gato"]');
        if (primerMarcador) primerMarcador.click();
      }
    }

    function closeLibro() {
      playUiBtnClickAudio();
      libroPanel.style.display = 'none';
      document.body.style.overflow = '';
    }

    btnLibroToggle.addEventListener('click', openLibro);

    if (btnLibroClose) {
      btnLibroClose.addEventListener('click', closeLibro);
    }
    if (btnLibroMobileClose) {
      btnLibroMobileClose.addEventListener('click', closeLibro);
    }

    libroPanel.addEventListener('click', (e) => {
      if (e.target === libroPanel) {
        closeLibro();
      }
    });

    // Lógica de marcadores
    const marcadores = libroPanel.querySelectorAll('.marcador');
    const nombreEl = document.getElementById('libro-nombre');
    const descEl = document.getElementById('libro-desc');
    const charImg = document.getElementById('libro-char-img');

    marcadores.forEach(btn => {
      btn.addEventListener('click', () => {
        playLibroTabClickAudio();
        const key = btn.dataset.char;
        const data = personajeData[key];
        if (!data) return;

        // Marcar activo
        marcadores.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        // Actualizar contenido en las páginas del libro
        if (nombreEl) nombreEl.textContent = data.nombre;
        if (descEl) descEl.textContent = data.desc;
        if (charImg) {
          charImg.src = data.img;
          charImg.alt = data.nombre;
          charImg.style.display = 'block';
        }
      });
    });

    // Ocultar imagen hasta que se seleccione
    if (charImg) charImg.style.display = 'none';
  }


  // ========================================================
  // FUNCIÓN AUXILIAR PARA ACTUALIZAR BURBUJAS DE DIÁLOGO OFICIALES
  // ========================================================
  function setSceneSubtitle(subId, textContent, speakerType = '', skipAudio = false) {
    const pill = document.getElementById(subId);
    if (!pill) return;
    pill.classList.remove('is-ready-cta');

    // Limpiar emojis de cabezas y prefijos redundantes
    let cleanText = textContent
      .replace(/^[🐱🐷🐻🪨🌋✨⚡💨🍳📦🌀🤝🍇\s]+/gu, '')
      .trim();

    const isEnding = cleanText.includes('Toca de nuevo') ||
      cleanText.includes('volver a escuchar') ||
      cleanText.includes('repetir') ||
      cleanText.includes('Desplaza') ||
      cleanText.includes('seguir salteando') ||
      cleanText.includes('Aparta las capas') ||
      cleanText.includes('apartar');

    const isAngry = speakerType.includes('angry') ||
      speakerType.includes('enfadad') ||
      speakerType.includes('rage') ||
      speakerType.includes('shout') ||
      speakerType.includes('dispute');

    const isSurprised = speakerType.includes('surprised') ||
      speakerType.includes('sorprendid') ||
      speakerType.includes('shock');

    const isScared = speakerType.includes('asustad') ||
      speakerType.includes('scared') ||
      speakerType.includes('fear') ||
      speakerType.includes('panic');

    let bubbleClass = 'bubble-system';
    let avatarHtml = `<div class="bubble-avatar-slot"><img src="assets/ui/Guante.png" alt="Toca" class="bubble-avatar-img bubble-glove-img" /></div>`;

    if (speakerType.includes('gato') || cleanText.startsWith('Gato:')) {
      bubbleClass = 'bubble-gato';
      cleanText = cleanText.replace(/^Gato:\s*/i, '').replace(/^«[—\-]\s*/, '«');
      let avatarSrc = 'assets/dialogos/Dialogo_Gato.png';
      if (isScared) {
        avatarSrc = 'assets/dialogos/Dialogo_Gato_Asustado.png?v=3.0';
      } else if (isSurprised) {
        avatarSrc = 'assets/dialogos/Dialogo_Gato_Sorprendido.png?v=3.0';
      } else if (isAngry) {
        avatarSrc = 'assets/dialogos/Dialogo_Gato_Enfadado.png';
      }
      avatarHtml = `<div class="bubble-avatar-slot"><img src="${avatarSrc}" alt="Gato" class="bubble-avatar-img" /></div>`;
    } else if (speakerType.includes('crunchy') || cleanText.startsWith('Crunchy:')) {
      bubbleClass = 'bubble-crunchy';
      cleanText = cleanText.replace(/^Crunchy:\s*/i, '').replace(/^«[—\-]\s*/, '«');
      let avatarSrc = 'assets/dialogos/Dialogo_Crunchy.png';
      if (isScared) {
        avatarSrc = 'assets/dialogos/Dialogo_Crunchy_Asustada.png?v=3.0';
      } else if (isAngry) {
        avatarSrc = 'assets/dialogos/Dialogo_Crunchy_Enfadada.png';
      }
      avatarHtml = `<div class="bubble-avatar-slot"><img src="${avatarSrc}" alt="Crunchy" class="bubble-avatar-img" /></div>`;
    } else if (speakerType.includes('oti') || cleanText.startsWith('Oti') || cleanText.startsWith('Oti Reboti:')) {
      bubbleClass = 'bubble-oti';
      cleanText = cleanText.replace(/^(Oti|Oti Reboti):\s*/i, '').replace(/^«[—\-]\s*/, '«');
      avatarHtml = `<div class="bubble-avatar-slot"><img src="assets/dialogos/Dialogo_Oti.png" alt="Oti" class="bubble-avatar-img" /></div>`;
    } else if (speakerType.includes('riolita') || speakerType.includes('carbon') || cleanText.startsWith('Riolita:') || cleanText.startsWith('Carbón:')) {
      bubbleClass = 'bubble-riolita';
      cleanText = cleanText.replace(/^(Riolita|Carbón):\s*/i, '').replace(/^«[—\-]\s*/, '«');
      let avatarSrc = 'assets/dialogos/Dialogo_Riolita.png';
      if (isSurprised) {
        avatarSrc = 'assets/dialogos/Dialogo_Riolita_Sorprendida.png?v=3.0';
      } else if (isAngry) {
        avatarSrc = 'assets/dialogos/Dialogo_Riolita_Enfadada.png';
      }
      avatarHtml = `<div class="bubble-avatar-slot"><img src="${avatarSrc}" alt="Riolita" class="bubble-avatar-img" /></div>`;
    } else if (speakerType.includes('basalto') || cleanText.startsWith('Basalto:')) {
      bubbleClass = 'bubble-basalto';
      cleanText = cleanText.replace(/^Basalto:\s*/i, '').replace(/^«[—\-]\s*/, '«');
      const avatarSrc = isAngry ? 'assets/dialogos/Dialogo_Basalto_Enfadado.png' : 'assets/dialogos/Dialogo_Basalto.png';
      avatarHtml = `<div class="bubble-avatar-slot"><img src="${avatarSrc}" alt="Basalto" class="bubble-avatar-img" /></div>`;
    } else if (isEnding) {
      bubbleClass = 'bubble-replay';
      avatarHtml = `<div class="bubble-avatar-slot"><img src="assets/ui/Guante.png" alt="Toca" class="bubble-avatar-img bubble-glove-img" /></div>`;
    }

    const isShout = speakerType.includes('shout') || speakerType.includes('rage');

    // Reproducir sonido de clic/aparición de diálogo en toda la historia
    if (!skipAudio && bubbleClass.startsWith('bubble-') && bubbleClass !== 'bubble-system' && bubbleClass !== 'bubble-replay') {
      playDialogueAudio();
    }

    pill.innerHTML = `
      <div class="character-speech-bubble ${bubbleClass}">
        ${avatarHtml}
        <div class="bubble-dialogue-content ${isShout ? 'shout-rage' : ''}">
          <span class="bubble-dialogue-text">${cleanText}</span>
        </div>
      </div>
    `;
  }

  // ========================================================
  // ESCENA 01: PORTAL FLOTANTE (CLIC EXPLÍCITO)
  // ========================================================
  // GESTOR DE SECUENCIAS: SÓLO POR CLIC EXPLÍCITO Y SIN SOLAPAMIENTOS
  // ========================================================
  let activeSequenceToken = 0;

  function cancelAllSequences(keepPortalAudio = false, keepSartenAudio = false, keepFuegoAudio = false) {
    activeSequenceToken++;
    VoiceEngine.stop();
    stopGatoPortalSpeaking();
    if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
    if (!keepPortalAudio) {
      stopPortalAudioImmediate();
    }
    if (!keepSartenAudio) {
      stopSartenAudio();
    }
    if (!keepFuegoAudio) {
      stopFuegoAudioImmediate();
    }
    stopRocaRodandoAudio();
    const pistolaEl = document.getElementById('item-pistola');
    if (pistolaEl) {
      pistolaEl.classList.remove('is-charging', 'is-shooting', 'is-vibrating');
    }
    return activeSequenceToken;
  }

  // ========================================================
  // ESCENA 01: PORTAL FLOTANTE (EMERGENCIA + GATO HABLANDO CON BOCA + CRUNCHY AL OTRO LADO)
  // ========================================================
  const portalStarDisc = document.getElementById('portal-star-disc');
  const portalMembranePulse = document.getElementById('portal-membrane-pulse');
  const portalFloatingStage = document.getElementById('portal-interactive-stage');
  const pillEscena01 = document.getElementById('sub-escena-01');
  const actorGatoPortal = document.getElementById('actor-gato-portal');
  const actorGatoPortalImg = document.getElementById('actor-gato-portal-img');

  // Precarga de los 4 fotogramas de boca de Gato
  const gatoMouthFrames = [
    'assets/personajes/gato/portal/Gato_Portal-1.png',
    'assets/personajes/gato/portal/Gato_Portal-2.png',
    'assets/personajes/gato/portal/Gato_Portal-3.png',
    'assets/personajes/gato/portal/Gato_Portal-4.png'
  ];
  gatoMouthFrames.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let gatoMouthInterval = null;

  function startGatoPortalSpeaking() {
    if (gatoMouthInterval) clearInterval(gatoMouthInterval);
    // Ciclo pausado y natural de boca de 180ms por fotograma
    const pattern = [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 1];
    let pIdx = 0;
    gatoMouthInterval = setInterval(() => {
      if (!actorGatoPortalImg) return;
      pIdx = (pIdx + 1) % pattern.length;
      actorGatoPortalImg.src = gatoMouthFrames[pattern[pIdx]];
    }, 180);
  }

  function stopGatoPortalSpeaking() {
    if (gatoMouthInterval) {
      clearInterval(gatoMouthInterval);
      gatoMouthInterval = null;
    }
    if (actorGatoPortalImg) {
      actorGatoPortalImg.src = gatoMouthFrames[0]; // Boca cerrada en reposo
    }
  }

  // Observador de pantalla para que emerja el portal visualmente al llegar
  const cardEscena01 = document.getElementById('card-escena-01');
  if (portalStarDisc) {
    if ('IntersectionObserver' in window) {
      const portalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            portalStarDisc.classList.add('is-portal-opened');
          }
        });
      }, { threshold: 0.15 });
      portalObserver.observe(cardEscena01 || portalFloatingStage || portalStarDisc);
    } else {
      portalStarDisc.classList.add('is-portal-opened');
    }
  }

  // ========================================================
  // ESCENA 01: MÁQUINA DE DIÁLOGOS PASO A PASO
  // ========================================================
  let scene01CurrentStep = -1;
  let scene01Active = false;
  let scene01PortalPlayed = false;

  const scene01Steps = [
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato',
      text: '¡Hola! Soy Gato. Sí, soy un gato y me llamo Gato, ¡no se rompieron la cabeza con el nombre! ¿Listo para una gran aventura?',
      action: () => {
        if (actorGatoPortal) actorGatoPortal.classList.add('is-visible');
        if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
        startGatoPortalSpeaking();
      }
    },
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy',
      text: '¡Gatooo! ¿Dónde te has metido? ¡Oti nos está llamando y como se enfríen las migas te las comes tú!',
      action: () => {
        stopGatoPortalSpeaking();
        SFXEngine.play('whoop');
        if (portalMembranePulse) portalMembranePulse.classList.add('is-crunchy-vibrating');
      }
    },
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato',
      text: '¡Un momento, Crunchy! ¡Que estoy hablando con el lector y hay que ser educado!',
      action: () => {
        if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
        startGatoPortalSpeaking();
      }
    },
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy',
      text: '¡Pues date prisa, que ya sabes cómo se pone Oti cuando no venimos a comer!',
      action: () => {
        stopGatoPortalSpeaking();
        if (portalMembranePulse) portalMembranePulse.classList.add('is-crunchy-vibrating');
      }
    },
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato',
      text: '¡Vale, ya voy! ¡Ponte cómodo, que esto se va a poner interesante!',
      action: () => {
        if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
        startGatoPortalSpeaking();
      }
    }
  ];

  function runScene01Step(step) {
    const myToken = cancelAllSequences(true);
    if (portalStarDisc) portalStarDisc.classList.add('is-portal-opened');

    // Iniciar portal audio solo una vez al arrancar la conversación
    if (step === 0 || !scene01PortalPlayed) {
      fadeInPortalAudio(1200);
      scene01PortalPlayed = true;
    }

    if (step >= scene01Steps.length) {
      // Fin de la conversación: Gato entra en el portal
      scene01CurrentStep = -1;
      scene01Active = false;
      scene01PortalPlayed = false;
      stopGatoPortalSpeaking();
      SFXEngine.play('whoop');
      if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
      if (actorGatoPortal) actorGatoPortal.classList.remove('is-visible');
      setSceneSubtitle('sub-escena-01', '¡Gato entró al portal! Desplaza hacia abajo para descubrir la historia...', 'destacat-cyan');
      fadeOutPortalAudio(1800);
      setTimeout(() => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-01', '¡Haz clic en el portal para volver a escuchar la presentación!', '');
      }, 2500);
      return;
    }

    scene01CurrentStep = step;
    scene01Active = true;
    const stepData = scene01Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-01', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
      stopGatoPortalSpeaking();
    });
  }

  function advanceScene01() {
    if (!scene01Active || scene01CurrentStep === -1) {
      runScene01Step(0);
    } else {
      runScene01Step(scene01CurrentStep + 1);
    }
  }

  if (portalFloatingStage) {
    portalFloatingStage.addEventListener('click', advanceScene01);
  }
  if (pillEscena01) {
    pillEscena01.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceScene01();
    });
  }

  // ========================================================
  // ESCENA 02: CUADRO 3D EN PERSPECTIVA MULTI-CAPA
  // ========================================================
  const cardEscena02 = document.getElementById('card-escena-02');
  const cuadroStageEl = document.getElementById('cuadro-3d-container');
  const cuadroCardEl = document.getElementById('cuadro-3d-card-elem');
  const layerFondo = document.getElementById('cuadro-layer-fondo');
  const layerGrupo = document.getElementById('cuadro-layer-grupo');
  const layerMarco = document.getElementById('cuadro-layer-marco');
  const glassShine = document.getElementById('cuadro-glass-shine');

  let cuadroTargetTiltX = 0;
  let cuadroTargetTiltY = 0;
  let cuadroCurTiltX = 0;
  let cuadroCurTiltY = 0;

  function updateCuadroParallax() {
    cuadroCurTiltX += (cuadroTargetTiltX - cuadroCurTiltX) * 0.12;
    cuadroCurTiltY += (cuadroTargetTiltY - cuadroCurTiltY) * 0.12;

    if (cuadroCardEl) {
      cuadroCardEl.style.transform = `rotateX(${cuadroCurTiltX}deg) rotateY(${cuadroCurTiltY}deg)`;
    }

    // Desplazamiento parallax sutil y suave relativo a la inclinación
    const normX = cuadroCurTiltY / 22; // -1 a 1
    const normY = -cuadroCurTiltX / 18; // -1 a 1

    // Pasar inclinación normalizada a CSS para que los tamaños y transforms se manejen directamente desde style.css
    if (cuadroCardEl) {
      cuadroCardEl.style.setProperty('--norm-x', normX.toFixed(4));
      cuadroCardEl.style.setProperty('--norm-y', normY.toFixed(4));
    }

    if (glassShine) {
      const angle = 135 + normX * 45;
      const opacity = 0.35 + Math.abs(normX) * 0.3 + Math.abs(normY) * 0.2;
      glassShine.style.background = `linear-gradient(${angle}deg, rgba(255, 255, 255, ${opacity}) 0%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, ${opacity * 0.4}) 100%)`;
    }

    requestAnimationFrame(updateCuadroParallax);
  }

  requestAnimationFrame(updateCuadroParallax);

  if (cuadroStageEl) {
    function handleCuadroMove(clientX, clientY) {
      const rect = cuadroStageEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = Math.max(Math.min((clientX - centerX) / (rect.width / 2), 1), -1);
      const normY = Math.max(Math.min((clientY - centerY) / (rect.height / 2), 1), -1);

      // Inclinación 3D realista
      cuadroTargetTiltX = -normY * 18;
      cuadroTargetTiltY = normX * 22;
    }

    cuadroStageEl.addEventListener('mouseenter', (e) => {
      handleCuadroMove(e.clientX, e.clientY);
    });

    cuadroStageEl.addEventListener('mousemove', (e) => {
      handleCuadroMove(e.clientX, e.clientY);
    });

    cuadroStageEl.addEventListener('mouseleave', () => {
      cuadroTargetTiltX = 0;
      cuadroTargetTiltY = 0;
    });

    // Soporte táctil móvil
    cuadroStageEl.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleCuadroMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    cuadroStageEl.addEventListener('touchend', () => {
      cuadroTargetTiltX = 0;
      cuadroTargetTiltY = 0;
    });
  }

  // ========================================================
  // ESCENA 02: CUADRO 3D — DIÁLOGOS PASO A PASO Y SONIDO DE FOTO
  // ========================================================
  let scene02CurrentStep = -1;
  let scene02Active = false;

  const scene02Steps = [
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato',
      text: '¡Mirad qué fotaza familiar! Crunchy y yo con Oti en el gran árbol... ¡aunque salgo un poco bizco!',
      action: () => {
        // El sonido de foto suena solo la primera vez que se pulsa la viñeta
        playFotoAudio();
      }
    },
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy',
      text: '¡Ja, ja, ja! ¡Pero si tú siempre sales bizco en todas las fotos, Gato!',
      action: () => { }
    },
    {
      speaker: 'oti',
      subSpeaker: 'sub-speaker-oti',
      text: '¡Ja, ja, ja! La familia siempre unida. ¡Incluso con tus caras raras!',
      action: () => { }
    }
  ];

  function runScene02Step(step) {
    const myToken = cancelAllSequences();

    if (step >= scene02Steps.length) {
      scene02CurrentStep = -1;
      scene02Active = false;
      setTimeout(() => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-02', '¡Mueve el ratón para explorar el cuadro 3D o toca para volver a escuchar!', '');
      }, 600);
      return;
    }

    scene02CurrentStep = step;
    scene02Active = true;
    const stepData = scene02Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-02', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
    });
  }

  let lastScene02ClickTime = 0;
  function advanceScene02(e) {
    if (e && e.target && e.target.closest('#btn-libro-toggle')) return;
    const now = Date.now();
    if (now - lastScene02ClickTime < 300) return;
    lastScene02ClickTime = now;

    if (!scene02Active || scene02CurrentStep === -1) {
      runScene02Step(0);
    } else {
      runScene02Step(scene02CurrentStep + 1);
    }
  }

  const pillEscena02 = document.getElementById('sub-escena-02');
  if (cardEscena02) cardEscena02.addEventListener('click', advanceScene02);
  if (pillEscena02) pillEscena02.addEventListener('click', (e) => {
    e.stopPropagation();
    advanceScene02(e);
  });

  // ========================================================
  // ESCENA 03: COCINA DE OTI — FÍSICA CENITAL (SÓLO CLIC)
  // ========================================================
  const cardEscena03 = document.getElementById('card-escena-03');
  const fryingPanEl = document.getElementById('frying-pan-element');
  const migasContainer = document.getElementById('migas-physics-container');
  const panArenaEl = document.getElementById('pan-circle-arena');

  // Parámetros de simulación física con sprites reales (TODAS LAS 38 IMÁGENES)
  const NUM_MIGAS = 38;
  const migasArray = [];

  if (migasContainer) {
    migasContainer.innerHTML = '';

    // Lista de las 38 imágenes de migas reales
    const migasImagesList = [];
    for (let i = 1; i <= 38; i++) {
      migasImagesList.push(`assets/objetos/migas/Migas-${i}.png`);
    }

    for (let i = 0; i < NUM_MIGAS; i++) {
      const el = document.createElement('div');
      el.className = 'miga-particle';

      const img = document.createElement('img');
      img.src = migasImagesList[i];
      img.alt = `Miga ${i + 1}`;
      img.className = 'miga-sprite-img';
      el.appendChild(img);

      // Tamaño grande y bien visible (19px a 27px) para que quepan las 38 piezas con claridad
      const size = 19 + Math.random() * 8;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      // Posicionamiento inicial repartido por toda la superficie de la sartén
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.sqrt(Math.random()) * 54;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;

      migasContainer.appendChild(el);

      migasArray.push({
        el,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: size / 2,
        rot: Math.random() * 360,
        vrot: 0
      });
    }
  }

  let mouseLastX = 0;
  let mouseLastY = 0;
  let mouseSpeedX = 0;
  let mouseSpeedY = 0;
  let lastSoundTime = 0;

  let currentTiltX = 0;
  let currentTiltY = 0;
  let currentShiftX = 0;
  let currentShiftY = 0;

  let targetTiltX = 0;
  let targetTiltY = 0;
  let targetShiftX = 0;
  let targetShiftY = 0;

  function updateMigasPhysics() {
    mouseSpeedX *= 0.82;
    mouseSpeedY *= 0.82;

    currentTiltX += (targetTiltX - currentTiltX) * 0.14;
    currentTiltY += (targetTiltY - currentTiltY) * 0.14;
    currentShiftX += (targetShiftX - currentShiftX) * 0.14;
    currentShiftY += (targetShiftY - currentShiftY) * 0.14;

    if (fryingPanEl) {
      fryingPanEl.style.transform = `perspective(900px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) translate(${currentShiftX}px, ${currentShiftY}px)`;
    }

    const arenaW = panArenaEl ? panArenaEl.clientWidth : 160;
    const arenaH = panArenaEl ? panArenaEl.clientHeight : 160;
    const centerX = arenaW / 2;
    const centerY = arenaH / 2;
    const maxRadius = Math.min(centerX, centerY) - 2;

    // 1. Separación suave entre trozos para que no se queden pegados ni apilados unos encima de otros
    for (let i = 0; i < migasArray.length; i++) {
      for (let j = i + 1; j < migasArray.length; j++) {
        const m1 = migasArray[i];
        const m2 = migasArray[j];
        const dx = m2.x - m1.x;
        const dy = m2.y - m1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (m1.radius + m2.radius) * 0.88;

        if (dist < minDist && dist > 0.001) {
          const overlap = (minDist - dist) * 0.5;
          const nx = dx / dist;
          const ny = dy / dist;

          // Separación suave por posición (sin fuerzas elásticas para evitar rebotes)
          m1.x -= nx * overlap * 0.35;
          m1.y -= ny * overlap * 0.35;
          m2.x += nx * overlap * 0.35;
          m2.y += ny * overlap * 0.35;
        }
      }
    }

    // 2. Movimiento, fricción y confinamiento dentro de la sartén
    migasArray.forEach((m) => {
      m.vx *= 0.88;
      m.vy *= 0.88;
      m.vrot *= 0.90;

      m.vx += currentTiltY * 0.04;
      m.vy += -currentTiltX * 0.04;

      m.x += m.vx;
      m.y += m.vy;
      m.rot += m.vrot;

      const currentDist = Math.sqrt(m.x * m.x + m.y * m.y);
      const maxAllowedDist = Math.max(4, maxRadius - m.radius);

      if (currentDist > maxAllowedDist) {
        const nx = m.x / currentDist;
        const ny = m.y / currentDist;

        m.x = nx * maxAllowedDist;
        m.y = ny * maxAllowedDist;

        const dot = m.vx * nx + m.vy * ny;
        m.vx = (m.vx - 1.0 * dot * nx) * 0.25;
        m.vy = (m.vy - 1.0 * dot * ny) * 0.25;
      }

      const renderX = centerX + m.x - m.radius;
      const renderY = centerY + m.y - m.radius;
      m.el.style.transform = `translate(${renderX}px, ${renderY}px) rotate(${m.rot}deg)`;
    });

    requestAnimationFrame(updateMigasPhysics);
  }

  requestAnimationFrame(updateMigasPhysics);

  // ========================================================
  // ESCENA 03: COCINA DE OTI — DIÁLOGOS PASO A PASO (SÓLO CLIC)
  // ========================================================
  let scene03CurrentStep = -1;
  let scene03Active = false;

  const panStageEl = document.getElementById('kitchen-pan-stage');
  const activePanArea = panStageEl || fryingPanEl;

  if (activePanArea) {
    activePanArea.addEventListener('mouseenter', (e) => {
      mouseLastX = e.clientX;
      mouseLastY = e.clientY;
    });

    activePanArea.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
      targetShiftX = 0;
      targetShiftY = 0;
    });

    activePanArea.addEventListener('mousemove', (e) => {
      if (!fryingPanEl) return;
      const rect = fryingPanEl.getBoundingClientRect();
      const cX = rect.left + rect.width / 2;
      const cY = rect.top + rect.height / 2;

      const offsetX = e.clientX - cX;
      const offsetY = e.clientY - cY;

      mouseSpeedX = e.clientX - mouseLastX;
      mouseSpeedY = e.clientY - mouseLastY;
      mouseLastX = e.clientX;
      mouseLastY = e.clientY;

      const speed = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY);

      targetTiltX = Math.max(Math.min(-offsetY * 0.08, 14), -14);
      targetTiltY = Math.max(Math.min(offsetX * 0.08, 14), -14);
      targetShiftX = Math.max(Math.min(mouseSpeedX * 0.25, 10), -10);
      targetShiftY = Math.max(Math.min(mouseSpeedY * 0.25, 10), -10);

      migasArray.forEach((m) => {
        m.vx += mouseSpeedX * 0.08;
        m.vy += mouseSpeedY * 0.08;
        m.vrot += (mouseSpeedX - mouseSpeedY) * 0.2;
      });

      const now = Date.now();
      // Solo reproducir sonido al mover si la conversación está activa
      if (scene03Active && speed > 14 && now - lastSoundTime > 350) {
        lastSoundTime = now;
        fadeInSartenAudio(800);
      }
    });

    // Soporte táctil móvil para la sartén de migas
    activePanArea.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        mouseLastX = e.touches[0].clientX;
        mouseLastY = e.touches[0].clientY;
      }
    }, { passive: true });

    activePanArea.addEventListener('touchmove', (e) => {
      if (!fryingPanEl || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = fryingPanEl.getBoundingClientRect();
      const cX = rect.left + rect.width / 2;
      const cY = rect.top + rect.height / 2;

      const offsetX = touch.clientX - cX;
      const offsetY = touch.clientY - cY;

      mouseSpeedX = touch.clientX - mouseLastX;
      mouseSpeedY = touch.clientY - mouseLastY;
      mouseLastX = touch.clientX;
      mouseLastY = touch.clientY;

      const speed = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY);

      targetTiltX = Math.max(Math.min(-offsetY * 0.08, 14), -14);
      targetTiltY = Math.max(Math.min(offsetX * 0.08, 14), -14);
      targetShiftX = Math.max(Math.min(mouseSpeedX * 0.25, 10), -10);
      targetShiftY = Math.max(Math.min(mouseSpeedY * 0.25, 10), -10);

      migasArray.forEach((m) => {
        m.vx += mouseSpeedX * 0.08;
        m.vy += mouseSpeedY * 0.08;
        m.vrot += (mouseSpeedX - mouseSpeedY) * 0.2;
      });

      const now = Date.now();
      if (scene03Active && speed > 10 && now - lastSoundTime > 350) {
        lastSoundTime = now;
        fadeInSartenAudio(800);
      }
    }, { passive: true });

    activePanArea.addEventListener('touchend', () => {
      targetTiltX = 0;
      targetTiltY = 0;
      targetShiftX = 0;
      targetShiftY = 0;
    });
  }

  const scene03Steps = [
    {
      speaker: 'oti',
      subSpeaker: 'sub-speaker-oti',
      text: '¡Mmm! ¡Estas migas huelen de maravilla! Pero qué cabeza la mía... ¡se me han olvidado las uvas dulces!',
      action: () => { }
    },
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato',
      text: '¡Voy yo, voy yo! ¡A que llego al desván antes que tú, Crunchy!',
      action: () => { }
    },
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy',
      text: '¡Eso lo veremos! ¡El último en subir recoge la mesa!',
      action: () => { }
    },
    {
      speaker: 'oti',
      subSpeaker: 'sub-speaker-oti',
      text: '¡Ja, ja, ja! ¡No corráis tanto por las escaleras, cabras locas!',
      action: () => { }
    }
  ];

  function runScene03Step(step) {
    const myToken = cancelAllSequences(false, true);

    // Iniciar el sonido de fritura de las migas con fade-in suave si no está sonando
    fadeInSartenAudio(1000);

    if (step >= scene03Steps.length) {
      // Cuando se acaban todos los diálogos de la conversación, hacer fade-out suave del audio
      scene03CurrentStep = -1;
      scene03Active = false;
      fadeOutSartenAudio(1500);
      setTimeout(() => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-03', '¡Toca la sartén para saltear las migas y volver a escuchar!', '');
      }, 600);
      return;
    }

    scene03CurrentStep = step;
    scene03Active = true;
    const stepData = scene03Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-03', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
      if (step === scene03Steps.length - 1) {
        // Al terminar de hablar el último diálogo de la conversación, desvanecer audio suavemente
        fadeOutSartenAudio(1600);
      }
    });
  }

  function advanceScene03() {
    if (!scene03Active || scene03CurrentStep === -1) {
      runScene03Step(0);
    } else {
      runScene03Step(scene03CurrentStep + 1);
    }
  }

  if (activePanArea) {
    activePanArea.addEventListener('click', (e) => {
      e.stopPropagation();
      migasArray.forEach((m) => {
        m.vy += -5 - Math.random() * 4;
        m.vx += (Math.random() - 0.5) * 4;
        m.vrot += (Math.random() - 0.5) * 20;
      });
      advanceScene03();
    });
  }

  const pillEscena03 = document.getElementById('sub-escena-03');
  if (cardEscena03) cardEscena03.addEventListener('click', advanceScene03);
  if (pillEscena03) pillEscena03.addEventListener('click', (e) => {
    e.stopPropagation();
    advanceScene03();
  });

  // ========================================================
  // ESCENA 04: EL DESVÁN Y EL BAÚL DE OBJETOS SUPERPUESTOS
  // ========================================================
  const cardEscena04 = document.getElementById('card-escena-04');
  const pillEscena04 = document.getElementById('sub-escena-04');
  const chestLayers = document.querySelectorAll('.chest-item-layer');
  const layerPistola = document.getElementById('item-pistola');

  let lastTossTimestamp = 0;
  let allBoxesTossedAt = 0;

  // Diálogos narrativos al apartar cada caja
  const boxNarrativeSteps = {
    3: '«¡Aaaatchís! ¡Cuántos trastos viejos tiene Oti aquí guardados!»',
    2: '«¡Por aquí no hay nada! Solo juguetes viejos y cachivaches...»',
    1: '«¡Ya casi llego al fondo! ¿Dónde habrá metido las uvas?»',
    0: '«¡Halaaa! ¡Mira qué pasada de cacharro con luces!»'
  };

  function getRemainingBoxes() {
    const boxIds = ['item-caja-1', 'item-caja-2', 'item-caja-3', 'item-caja-4'];
    return boxIds
      .map(id => document.getElementById(id))
      .filter(box => box && !box.classList.contains('is-tossed-left') && !box.classList.contains('is-tossed-right'));
  }

  function tossNextBox() {
    const now = Date.now();
    if (now - lastTossTimestamp < 320) return false;
    lastTossTimestamp = now;

    const remaining = getRemainingBoxes();
    if (remaining.length > 0) {
      const nextBox = remaining[0];
      const tossDir = (nextBox.id === 'item-caja-1' || nextBox.id === 'item-caja-4') ? 'is-tossed-left' : 'is-tossed-right';
      nextBox.classList.add(tossDir);
      SFXEngine.play('whoop');

      const afterCount = remaining.length - 1;
      const stepText = boxNarrativeSteps[afterCount] || '¡Apartando trastos del desván!';

      if (afterCount === 0) {
        allBoxesTossedAt = Date.now();
        setSceneSubtitle('sub-escena-04', stepText, 'sub-speaker-gato sorprendido');
      } else {
        setSceneSubtitle('sub-escena-04', stepText, 'sub-speaker-gato');
      }
      return true;
    }
    return false;
  }

  function resetScene04Boxes() {
    ['item-caja-1', 'item-caja-2', 'item-caja-3', 'item-caja-4'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-tossed-left', 'is-tossed-right');
    });
    if (layerPistola) {
      layerPistola.classList.remove('is-charging', 'is-shooting', 'is-vibrating');
    }
    scene04PortalPlayed = false;
    allBoxesTossedAt = 0;
    SFXEngine.play('pop');
    setSceneSubtitle('sub-escena-04', '«¡Busquemos por el desván! Haz clic para apartar las cajas y ver qué hay...»', 'sub-speaker-gato');
  }

  let scene04CurrentStep = -1;
  let scene04Active = false;
  let scene04PortalPlayed = false;

  const scene04Steps = [
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy shout-rage',
      text: '¡Gato, no toques eso! ¡Que nos conocemos y siempre la lías!',
      action: () => {
        if (layerPistola) {
          layerPistola.classList.remove('is-shooting');
          layerPistola.classList.add('is-charging', 'is-vibrating');
        }
        SFXEngine.play('whoop');
      }
    },
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato shout-rage',
      text: '¡Que no lo iba a romper, aguafiestas! ¡No me mandes!',
      action: () => {
        if (layerPistola) {
          layerPistola.classList.remove('is-charging', 'is-vibrating');
          layerPistola.classList.add('is-shooting');
        }
        if (!scene04PortalPlayed) {
          fadeInPortalAudio(600);
          scene04PortalPlayed = true;
        }
      }
    }
  ];

  function runScene04Step(step) {
    const myToken = cancelAllSequences(true);

    if (step >= scene04Steps.length) {
      // Cuando se acaban todos los diálogos de la conversación, parar el audio con fade-out
      scene04CurrentStep = -1;
      scene04Active = false;
      scene04PortalPlayed = false;
      fadeOutPortalAudio(1500);
      setSceneSubtitle('sub-escena-04', '¡Con tanto grito la pistola se encendió y abrió un portal! Desplaza hacia abajo...', 'destacat-cyan');
      setTimeout(() => {
        if (myToken !== activeSequenceToken) return;
        stopPortalAudioImmediate();
        resetScene04Boxes();
        setSceneSubtitle('sub-escena-04', '¡Haz clic en las cajas para volver a explorar el desván!', '');
      }, 3000);
      return;
    }

    scene04CurrentStep = step;
    scene04Active = true;
    const stepData = scene04Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-04', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
    });
  }

  function advanceScene04Dialogue() {
    const remaining = getRemainingBoxes();
    if (remaining.length > 0) {
      tossNextBox();
      return;
    }
    if (!scene04Active || scene04CurrentStep === -1) {
      runScene04Step(0);
    } else {
      runScene04Step(scene04CurrentStep + 1);
    }
  }

  chestLayers.forEach((layer) => {
    layer.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemType = layer.getAttribute('data-item');

      if (itemType === 'pistola') {
        advanceScene04Dialogue();
      } else {
        const now = Date.now();
        if (now - lastTossTimestamp < 280) return;
        lastTossTimestamp = now;

        const boxId = layer.id;
        const tossDir = (boxId === 'item-caja-1' || boxId === 'item-caja-4') ? 'is-tossed-left' : 'is-tossed-right';
        layer.classList.add(tossDir);
        SFXEngine.play('whoop');

        const remaining = getRemainingBoxes();
        const stepText = boxNarrativeSteps[remaining.length] || '¡Apartando trastos del desván!';
        if (remaining.length === 0) {
          allBoxesTossedAt = Date.now();
          setSceneSubtitle('sub-escena-04', stepText, 'sub-speaker-gato sorprendido');
        } else {
          setSceneSubtitle('sub-escena-04', stepText, 'sub-speaker-gato');
        }
      }
    });
  });

  if (pillEscena04) {
    pillEscena04.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceScene04Dialogue();
    });
  }

  if (cardEscena04) {
    cardEscena04.addEventListener('click', (e) => {
      if (e.target.closest('.chest-item-layer') || e.target.closest('#sub-escena-04')) {
        return;
      }
      advanceScene04Dialogue();
    });
  }

  // ========================================================
  // ESCENA 05: EL SALTO DIMENSIONAL (VÓRTICE Y MUNDO VOLCÁNICO)
  // ========================================================
  const cardEscena05 = document.getElementById('card-escena-05');
  const portalStage = document.getElementById('portal-stage');
  const portalAperture = document.getElementById('portal-aperture');
  const portalWorldImg = document.getElementById('portal-world-img');

  const targetFireHover = portalAperture || portalStage;

  if (targetFireHover) {
    targetFireHover.addEventListener('mouseenter', () => {
      fadeInFuegoAudio(800);
    });

    targetFireHover.addEventListener('mouseleave', () => {
      fadeOutFuegoAudio(900);
      if (portalWorldImg) {
        portalWorldImg.style.transform = 'translate(0px, 0px) scale(1)';
      }
    });

    targetFireHover.addEventListener('mousemove', (e) => {
      const rect = targetFireHover.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (portalWorldImg) {
        portalWorldImg.style.transform = `translate(${nx * 14}px, ${ny * 14}px) scale(1.08)`;
      }
    });

    // Dispositivos táctiles móviles
    let fireTouchTimer = null;
    targetFireHover.addEventListener('touchstart', () => {
      if (fireTouchTimer) clearTimeout(fireTouchTimer);
      targetFireHover.classList.add('is-revealed');
      fadeInFuegoAudio(800);
    }, { passive: true });

    targetFireHover.addEventListener('touchend', () => {
      fireTouchTimer = setTimeout(() => {
        targetFireHover.classList.remove('is-revealed');
        fadeOutFuegoAudio(900);
        if (portalWorldImg) {
          portalWorldImg.style.transform = 'translate(0px, 0px) scale(1)';
        }
      }, 1200);
    }, { passive: true });
  }

  let scene05CurrentStep = -1;
  let scene05Active = false;
  let scene05FuegoPlayed = false;

  const scene05Steps = [
    {
      speaker: 'crunchy',
      subSpeaker: 'sub-speaker-crunchy asustada shout-rage',
      text: '¡Gato! ¡Nos absorbe el portal! ¡¿Ves lo que pasa por tocar?!',
      action: () => {
        if (cardEscena05) cardEscena05.classList.add('is-transporting');
        if (!scene05FuegoPlayed) {
          fadeInFuegoAudio(800);
          scene05FuegoPlayed = true;
        }
      }
    },
    {
      speaker: 'gato',
      subSpeaker: 'sub-speaker-gato asustado shout-rage',
      text: '¡Agarra mi mano y no me sueltes! ¡Aaaaah!',
      action: () => { }
    }
  ];

  function runScene05Step(step) {
    const myToken = cancelAllSequences(false, false, true);

    if (step >= scene05Steps.length) {
      scene05CurrentStep = -1;
      scene05Active = false;
      scene05FuegoPlayed = false;
      fadeOutFuegoAudio(1200);
      setSceneSubtitle('sub-escena-05', '¡Aterrizaje forzoso en un mundo de lava! Desplaza hacia abajo...', 'destacat-orange');
      setTimeout(() => {
        if (cardEscena05) cardEscena05.classList.remove('is-transporting');
        stopFuegoAudioImmediate();
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-05', '¡Toca el portal para revivir el salto dimensional!', '');
      }, 2500);
      return;
    }

    scene05CurrentStep = step;
    scene05Active = true;
    const stepData = scene05Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-05', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
    });
  }

  function advanceScene05() {
    if (!scene05Active || scene05CurrentStep === -1) {
      runScene05Step(0);
    } else {
      runScene05Step(scene05CurrentStep + 1);
    }
  }

  if (cardEscena05) {
    cardEscena05.addEventListener('click', advanceScene05);
  }
  const pillEscena05 = document.getElementById('sub-escena-05');
  if (pillEscena05) {
    pillEscena05.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceScene05();
    });
  }

  // ========================================================
  // ESCENA 06: EL MUNDO DE ROCA Y LAVA (PRISMÁTICOS)
  // ========================================================
  const cardEscena06 = document.getElementById('card-escena-06');
  const binocularsStage = document.getElementById('binoculars-stage');
  const disputeRoundRock = document.getElementById('dispute-round-rock');
  const speakerRiolitaCard = document.getElementById('speaker-carbon-card');
  const speakerBasaltoCard = document.getElementById('speaker-basalto-card');
  const imgRiolitaDispute = document.getElementById('img-riolita-dispute');
  const imgBasaltoDispute = document.getElementById('img-basalto-dispute');

  function closeScene06Binoculars() {
    if (binocularsStage && binocularsStage.classList.contains('is-opened')) {
      cancelAllSequences();
      stopRocaRodandoAudio();
      binocularsStage.classList.remove('is-opened');
      if (disputeRoundRock) {
        disputeRoundRock.classList.remove('is-rolling-away');
      }
      if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
      if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');

      if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-3.png';
      if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-1.png';

      SFXEngine.play('pop');
      setSceneSubtitle('sub-escena-06', '¡Toca los prismáticos para observar la discusión de Riolita y Basalto!', '');
    }
  }

  let scene06CurrentStep = -1;
  let scene06Active = false;

  const scene06Steps = [
    {
      speaker: 'riolita',
      subSpeaker: 'sub-speaker-riolita angry',
      text: '¡Esta roca la vi yo primero! ¡Suéltala, Basalto, que es mía!',
      action: () => {
        if (disputeRoundRock) {
          disputeRoundRock.classList.remove('is-rolling-away');
        }
        if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-3.png';
        if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-1.png';
        if (speakerRiolitaCard) speakerRiolitaCard.classList.add('is-speaking');
        if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');
      }
    },
    {
      speaker: 'basalto',
      subSpeaker: 'sub-speaker-basalto angry',
      text: '¡De eso nada, que la he picado yo! ¡Búscate otra!',
      action: () => {
        if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
        if (speakerBasaltoCard) speakerBasaltoCard.classList.add('is-speaking');
      }
    },
    {
      speaker: 'riolita',
      subSpeaker: 'sub-speaker-riolita surprised',
      text: '¡Cuidado, bruto, que se nos resbala cuesta abajo!',
      action: () => {
        if (speakerRiolitaCard) speakerRiolitaCard.classList.add('is-speaking');
        if (speakerBasaltoCard) speakerBasaltoCard.classList.add('is-speaking');
        if (disputeRoundRock) {
          disputeRoundRock.classList.add('is-rolling-away');
          playRocaRodandoAudio(2800);
        }
        if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-2.png';
        if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-2.png';
      }
    }
  ];

  function runScene06Step(step) {
    const myToken = cancelAllSequences();

    if (step >= scene06Steps.length) {
      scene06CurrentStep = -1;
      scene06Active = false;
      if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
      if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');
      SFXEngine.play('explosion');
      setSceneSubtitle('sub-escena-06', '«¡La roca rodó y taponó la entrada de la cueva! Desplaza hacia abajo...', 'destacat-orange');
      setTimeout(() => {
        if (myToken !== activeSequenceToken) return;
        closeScene06Binoculars();
        setSceneSubtitle('sub-escena-06', '¡Toca los prismáticos para volver a observar la discusión!', '');
      }, 3500);
      return;
    }

    scene06CurrentStep = step;
    scene06Active = true;
    const stepData = scene06Steps[step];
    stepData.action();
    setSceneSubtitle('sub-escena-06', `«${stepData.text}»`, stepData.subSpeaker);

    VoiceEngine.speak(stepData.text, stepData.speaker, () => {
      if (myToken !== activeSequenceToken) return;
    });
  }

  function advanceScene06(e) {
    const isCurrentlyOpened = binocularsStage && binocularsStage.classList.contains('is-opened');

    if (isCurrentlyOpened) {
      const clickedInsideVisor = e && e.target && e.target.closest('#binoculars-visor-elem');
      const clickedSubtitle = e && e.target && e.target.closest('#sub-escena-06');
      if (!clickedInsideVisor && !clickedSubtitle) {
        closeScene06Binoculars();
        return;
      }
    } else {
      if (binocularsStage) {
        binocularsStage.classList.add('is-opened');
        SFXEngine.play('whoop');
      }
      if (disputeRoundRock) {
        disputeRoundRock.classList.remove('is-rolling-away');
        void disputeRoundRock.offsetWidth;
      }
      if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-3.png';
      if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-1.png';
    }

    if (!scene06Active || scene06CurrentStep === -1) {
      runScene06Step(0);
    } else {
      runScene06Step(scene06CurrentStep + 1);
    }
  }

  if (cardEscena06) cardEscena06.addEventListener('click', advanceScene06);
  const pillEscena06 = document.getElementById('sub-escena-06');
  if (pillEscena06) {
    pillEscena06.addEventListener('click', (e) => {
      e.stopPropagation();
      advanceScene06(e);
    });
  }

  document.addEventListener('click', (e) => {
    if (binocularsStage && binocularsStage.classList.contains('is-opened')) {
      if (!e.target.closest('#card-escena-06')) {
        closeScene06Binoculars();
      }
    }
  });

  // ========================================================
  // ESCENA 07: EL PACTO DE EQUIPO Y LAS MANOS PROGRESIVAS
  // ========================================================
  const cardEscena07 = document.getElementById('card-escena-07');
  const teamHandsBox = document.getElementById('team-hands-box');
  let currentHandsCount = 0;
  const maxHands = 4;

  const handStepData = [
    {
      handId: 'arm-hand-1',
      text: '«Vaya... por pelearnos hemos tapado la cueva entera...»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita'
    },
    {
      handId: 'arm-hand-2',
      text: '«La verdad es que nos hemos pasado de cabezotas...»',
      speaker: 'sub-speaker-basalto',
      voiceChar: 'basalto'
    },
    {
      handId: 'arm-hand-3',
      text: '«¡Pues si golpeamos los cuatro a la vez, seguro que la rompemos!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy'
    },
    {
      handId: 'arm-hand-4',
      text: '«¡Venga, manos al centro! ¡A la de tres todos a una!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato',
      isFinal: true
    }
  ];

  function placeNextTeamHand(e) {
    if (e && e.target && e.target.closest('#sub-escena-07')) {
      return;
    }

    const myToken = cancelAllSequences();

    if (currentHandsCount >= maxHands) {
      currentHandsCount = 0;
      for (let i = 1; i <= maxHands; i++) {
        const hand = document.getElementById(`arm-hand-${i}`);
        if (hand) hand.classList.remove('is-in-center');
      }
      if (teamHandsBox) teamHandsBox.classList.remove('is-all-united');
      setSceneSubtitle('sub-escena-07', '¡Toca para que los cuatro amigos unan sus manos una a una!', '');
      return;
    }

    currentHandsCount++;
    const step = handStepData[currentHandsCount - 1];

    const currentHandElem = document.getElementById(step.handId);
    if (currentHandElem) {
      currentHandElem.classList.add('is-in-center');
    }

    if (step.isFinal) {
      if (teamHandsBox) teamHandsBox.classList.add('is-all-united');
      SFXEngine.play('triumph-chime');
    }

    setSceneSubtitle('sub-escena-07', step.text, step.speaker);
    VoiceEngine.speak(step.text.replace(/[«»¡!]/g, ''), step.voiceChar, () => {
      if (myToken !== activeSequenceToken) return;
      if (step.isFinal) {
        setSceneSubtitle('sub-escena-07', '¡Pacto de equipo sellado! Los cuatro amigos unen sus fuerzas para solucionar el problema.', 'destacat-orange');

        setTimeout(() => {
          if (myToken !== activeSequenceToken) return;
          currentHandsCount = 0;
          for (let i = 1; i <= maxHands; i++) {
            const hand = document.getElementById(`arm-hand-${i}`);
            if (hand) hand.classList.remove('is-in-center');
          }
          if (teamHandsBox) teamHandsBox.classList.remove('is-all-united');
          setSceneSubtitle('sub-escena-07', '¡Toca para que los cuatro amigos unan sus manos una a una!', '');
        }, 4000);
      }
    });
  }

  if (cardEscena07) cardEscena07.addEventListener('click', placeNextTeamHand);

  // ========================================================
  // ESCENA 08: DESTRUCCIÓN COOPERATIVA DE LA ROCA (4 GOLPES)
  // ========================================================
  const cardEscena08 = document.getElementById('card-escena-08');
  const volcanicBoulder = document.getElementById('volcanic-boulder');
  const volcanicRockArt = document.getElementById('volcanic-rock-art');

  let rockSmashStep = 0;

  function handleRockSmashClick(e) {
    if (e && e.target && e.target.closest('#sub-escena-08')) {
      return;
    }

    const myToken = cancelAllSequences();

    if (rockSmashStep >= 4) {
      rockSmashStep = 0;
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-5.png';
      if (volcanicBoulder) volcanicBoulder.classList.remove('is-shattered', 'is-punch-struck');
      setSceneSubtitle('sub-escena-08', '¡Toca la roca para golpear todos juntos en equipo!', '');
      return;
    }

    rockSmashStep++;

    if (volcanicBoulder) {
      volcanicBoulder.classList.remove('is-punch-struck');
      void volcanicBoulder.offsetWidth;
      volcanicBoulder.classList.add('is-punch-struck');
    }

    if (rockSmashStep === 1) {
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-4.png';
      playRocaHitAudio(1);
      setSceneSubtitle('sub-escena-08', '«¡Buen primer golpe entre todos! ¡Seguid dándole juntos!»', 'sub-speaker-riolita');
      VoiceEngine.speak('¡Buen primer golpe entre todos! ¡Seguid dándole juntos!', 'riolita');

    } else if (rockSmashStep === 2) {
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-3.png';
      playRocaHitAudio(2);
      setSceneSubtitle('sub-escena-08', '«¡Eso es! ¡Otro golpe juntos con todas nuestras fuerzas!»', 'sub-speaker-basalto');
      VoiceEngine.speak('¡Eso es! ¡Otro golpe juntos con todas nuestras fuerzas!', 'basalto');

    } else if (rockSmashStep === 3) {
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-2.png';
      playRocaHitAudio(3);
      setSceneSubtitle('sub-escena-08', '«¡Ya se está agrietando! ¡El último esfuerzo entre todos!»', 'sub-speaker-crunchy');
      VoiceEngine.speak('¡Ya se está agrietando! ¡El último esfuerzo entre todos!', 'crunchy');

    } else if (rockSmashStep === 4) {
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-1.png';
      if (volcanicBoulder) volcanicBoulder.classList.add('is-shattered');

      playRocaBreakAudio();
      setSceneSubtitle('sub-escena-08', '«¡¡TOMA YA!! ¡¡La rompimos entre todos!! ¡Camino libre!»', 'sub-speaker-gato');

      VoiceEngine.speak('¡Toma ya! ¡La rompimos entre todos! ¡Camino libre!', 'gato', () => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-08', '¡Roca rota en equipo! El camino hacia el portal vuelve a estar despejado.', 'destacat-cyan');

        setTimeout(() => {
          if (myToken !== activeSequenceToken) return;
          rockSmashStep = 0;
          if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-5.png';
          if (volcanicBoulder) volcanicBoulder.classList.remove('is-shattered', 'is-punch-struck');
          setSceneSubtitle('sub-escena-08', '¡Toca la roca para golpear todos juntos en equipo!', '');
        }, 4000);
      });
    }
  }

  if (cardEscena08) {
    cardEscena08.addEventListener('click', handleRockSmashClick);
  }

  // ========================================================
  // ESCENA 09: LA BOLSA DE CRUNCHY Y EL REGALO DE FUEGO
  // ========================================================
  const cardEscena09 = document.getElementById('card-escena-09');
  const bolsaGiftBox = document.getElementById('bolsa-gift-box');
  let isBagOpen = false;
  let collectedGrapesCount = 0;
  const maxBolsaGrapes = 6;

  const bolsaGrapeDialogueSteps = [
    {
      text: '«¡Aquí tenéis una bien calentita y dulce!»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita'
    },
    {
      text: '«¡Cuidado que queman un poco, métela rápido!»',
      speaker: 'sub-speaker-basalto',
      voiceChar: 'basalto'
    },
    {
      text: '«¡Madre mía qué ricas van a quedar con las migas!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy'
    },
    {
      text: '«¡Nos van a saber a gloria después del susto que nos hemos llevado!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Ya casi las tenéis todas dentro!»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita'
    },
    {
      text: '«¡Listo! ¡Buen viaje de vuelta a casa, amigos!»',
      speaker: 'sub-speaker-basalto',
      voiceChar: 'basalto',
      isFinal: true
    }
  ];

  function animateGrapeToBag(fromElement, toElement, onComplete) {
    const flyingLayer = document.getElementById('bag-flying-layer') || document.getElementById('crunchy-bag-box');

    if (!fromElement || !toElement || !flyingLayer) {
      if (onComplete) onComplete();
      return;
    }

    const layerRect = flyingLayer.getBoundingClientRect();
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    const startX = fromRect.left - layerRect.left;
    const startY = fromRect.top - layerRect.top;
    const endX = (toRect.left + toRect.width / 2) - layerRect.left - (fromRect.width / 2);
    const endY = (toRect.top + toRect.height / 2) - layerRect.top - (fromRect.height / 2);

    const flyingGrape = document.createElement('img');
    const sourceImg = fromElement.querySelector('img');
    flyingGrape.src = sourceImg ? sourceImg.src : 'assets/objetos/migas/uva_1.png';
    flyingGrape.className = 'grape-flying-projectile';
    flyingGrape.style.left = `${startX}px`;
    flyingGrape.style.top = `${startY}px`;
    flyingGrape.style.width = `${fromRect.width}px`;
    flyingGrape.style.height = `${fromRect.height}px`;
    flyingGrape.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    flyingLayer.appendChild(flyingGrape);

    fromElement.classList.add('is-collected');

    void flyingGrape.offsetWidth;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    flyingGrape.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1) rotate(0deg)`;

    setTimeout(() => {
      flyingGrape.remove();
      if (onComplete) onComplete();
    }, 380);
  }

  function handleBolsaInteraction(e) {
    if (e && e.target && e.target.closest('#sub-escena-09')) {
      return;
    }

    const myToken = cancelAllSequences();

    if (collectedGrapesCount >= maxBolsaGrapes) {
      isBagOpen = false;
      collectedGrapesCount = 0;
      if (cardEscena09) {
        cardEscena09.classList.remove('is-bag-open');
        cardEscena09.classList.add('is-bag-closed');
      }
      if (bolsaGiftBox) {
        bolsaGiftBox.classList.remove('is-all-collected');
      }
      const allFloatingSlots = document.querySelectorAll('.bolsa-floating-grapes .bolsa-grape-slot');
      allFloatingSlots.forEach(slot => slot.classList.remove('is-collected'));
      const allInsideDots = document.querySelectorAll('.inside-grape-dot');
      allInsideDots.forEach(dot => dot.classList.remove('is-filled'));

      SFXEngine.play('pop');
      setSceneSubtitle('sub-escena-09', '¡Toca la bolsa de Crunchy para abrirla y guardar las uvas ígneas!', '');
      return;
    }

    if (!isBagOpen) {
      isBagOpen = true;
      if (cardEscena09) {
        cardEscena09.classList.remove('is-bag-closed');
        cardEscena09.classList.add('is-bag-open');
      }

      const openSpeech = '¡Abre la bolsa, a ver esas uvas de lava!';
      setSceneSubtitle('sub-escena-09', '«¡Abre la bolsa, a ver esas uvas de lava!»', 'sub-speaker-crunchy');
      VoiceEngine.speak(openSpeech, 'crunchy', () => {
        if (myToken !== activeSequenceToken) return;
        if (collectedGrapesCount === 0) {
          setSceneSubtitle('sub-escena-09', '¡Bolsa abierta! Toca las uvas flotantes para guardarlas dentro una a una.', 'destacat-orange');
        }
      });
      return;
    }

    const clickedSlot = e ? e.target.closest('.bolsa-grape-slot') : null;
    let targetSlot = clickedSlot;
    if (!targetSlot || targetSlot.classList.contains('is-collected')) {
      targetSlot = document.querySelector('.bolsa-floating-grapes .bolsa-grape-slot:not(.is-collected)');
    }

    if (!targetSlot) return;

    collectedGrapesCount++;
    const nextGrapeIndex = collectedGrapesCount;
    const insideDot = document.getElementById(`inside-grape-${nextGrapeIndex}`);

    for (let i = 1; i < nextGrapeIndex; i++) {
      const prevDot = document.getElementById(`inside-grape-${i}`);
      if (prevDot) prevDot.classList.add('is-filled');
    }

    animateGrapeToBag(targetSlot, insideDot, () => {
      if (insideDot) {
        insideDot.classList.add('is-filled');
      }

      if (myToken !== activeSequenceToken) return;

      playGrapeCollectAudio();

      const step = bolsaGrapeDialogueSteps[nextGrapeIndex - 1];

      if (step.isFinal) {
        if (bolsaGiftBox) {
          bolsaGiftBox.classList.add('is-all-collected');
        }
      }

      setSceneSubtitle('sub-escena-09', step.text, step.speaker, true);
      VoiceEngine.speak(step.text.replace(/[«»¡!]/g, ''), step.voiceChar, () => {
        if (myToken !== activeSequenceToken) return;
        if (step.isFinal) {
          setSceneSubtitle('sub-escena-09', '¡Todas las uvas están guardadas! Cruza el portal para volver a casa...', 'destacat-orange', true);

          setTimeout(() => {
            if (myToken !== activeSequenceToken) return;
            isBagOpen = false;
            collectedGrapesCount = 0;
            if (cardEscena09) {
              cardEscena09.classList.remove('is-bag-open');
              cardEscena09.classList.add('is-bag-closed');
            }
            if (bolsaGiftBox) {
              bolsaGiftBox.classList.remove('is-all-collected');
            }
            const allFloatingSlots = document.querySelectorAll('.bolsa-floating-grapes .bolsa-grape-slot');
            allFloatingSlots.forEach(slot => slot.classList.remove('is-collected'));
            const allInsideDots = document.querySelectorAll('.inside-grape-dot');
            allInsideDots.forEach(dot => dot.classList.remove('is-filled'));
            setSceneSubtitle('sub-escena-09', '¡Toca la bolsa de Crunchy para abrirla y guardar las uvas!', '', true);
          }, 4000);
        }
      });
    });
  }

  if (cardEscena09) cardEscena09.addEventListener('click', handleBolsaInteraction);

  // ========================================================
  // ESCENA 10: EL FESTÍN Y EL PLATO DE MIGAS CON 6 UVAS
  // ========================================================
  const cardEscena10 = document.getElementById('card-escena-10');
  const migasGrapeCountElem = document.getElementById('migas-grape-count');
  let currentGrapeCount = 0;
  const maxGrapes = 6;

  const grapeDialogueSteps = [
    {
      text: '«¡Oti, ya estamos aquí! ¡Mira qué uvas más raras y ricas hemos traído!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Menudo susto me habéis dado! ¡No pensaba que ese viejo trasto del desván aún funcionaba!»',
      speaker: 'sub-speaker-oti',
      voiceChar: 'oti'
    },
    {
      text: '«¡Casi nos quedamos atrapados, pero al final hicimos amigos y todo!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy'
    },
    {
      text: '«¡Ja, ja, ja! Pues huelen de maravilla. ¡Echemos las uvas al plato!»',
      speaker: 'sub-speaker-oti',
      voiceChar: 'oti'
    },
    {
      text: '«¡Y gracias por acompañarnos en esta aventura y ayudarnos a volver!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Venga, a la mesa todos, que las migas se enfrían!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy',
      isFinal: true
    }
  ];

  const grapeRotations = {
    1: -12,
    2: 35,
    3: -22,
    4: 18,
    5: -35,
    6: 10
  };

  function animateGrapeToPlate(targetSlot, grapeSrc, grapeIndex, onComplete) {
    const dishTarget = document.getElementById('migas-dish-target');
    if (!dishTarget || !targetSlot) {
      if (onComplete) onComplete();
      return;
    }

    const dishRect = dishTarget.getBoundingClientRect();
    const rot = grapeRotations[grapeIndex] || 0;

    // Posición inicial: en el centro en primer plano (grande con su rotación propia)
    const startLeft = (dishRect.width / 2) - 17;
    const startTop = (dishRect.height / 2) - 19 - 25;

    // Posición final: dentro del slot exacto en el plato
    const endLeft = targetSlot.offsetLeft;
    const endTop = targetSlot.offsetTop;

    const flyer = document.createElement('div');
    flyer.className = 'grape-zoom-projectile is-intro';
    flyer.style.left = `${startLeft}px`;
    flyer.style.top = `${startTop}px`;
    flyer.style.transform = `translate(0, -15px) scale(0.6) rotate(${rot}deg)`;
    flyer.style.opacity = '0';

    const img = document.createElement('img');
    img.src = grapeSrc;
    img.alt = 'Uva ígnea zoom';
    flyer.appendChild(img);
    dishTarget.appendChild(flyer);

    // Forzar reflow del navegador
    void flyer.offsetWidth;

    // Fase 1: Pop in en primer plano (aparece grande con su rotación única y flota medio segundo)
    flyer.style.opacity = '1';
    flyer.style.transform = `translate(0, 0) scale(2.8) rotate(${rot}deg)`;

    // Fase 2: Tras ~480ms de exhibición, vuela fluidamente hacia el plato encogiéndose en perspectiva con su rotación
    setTimeout(() => {
      const deltaX = endLeft - startLeft;
      const deltaY = endTop - startTop;

      flyer.className = 'grape-zoom-projectile is-flying';
      flyer.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1) rotate(${rot}deg)`;

      // Al aterrizar en su posición del plato
      setTimeout(() => {
        flyer.remove();
        if (onComplete) onComplete();
      }, 530);
    }, 480);
  }

  function placeNextGrape(e) {
    if (e && e.target && e.target.closest('#sub-escena-10')) {
      return;
    }

    const myToken = cancelAllSequences();

    if (currentGrapeCount >= maxGrapes) {
      currentGrapeCount = 0;
      for (let i = 1; i <= maxGrapes; i++) {
        const slot = document.getElementById(`grape-item-${i}`);
        if (slot) slot.classList.remove('is-placed');
      }
      const allFlyers = document.querySelectorAll('.grape-zoom-projectile');
      allFlyers.forEach(f => f.remove());
      if (migasGrapeCountElem) migasGrapeCountElem.textContent = '0';
      setSceneSubtitle('sub-escena-10', '¡Toca el plato para añadir las uvas ígneas a las migas!', '', true);
      return;
    }

    currentGrapeCount++;
    const nextGrapeIndex = currentGrapeCount;
    if (migasGrapeCountElem) migasGrapeCountElem.textContent = nextGrapeIndex;

    for (let i = 1; i < nextGrapeIndex; i++) {
      const prevSlot = document.getElementById(`grape-item-${i}`);
      if (prevSlot) prevSlot.classList.add('is-placed');
    }
    const oldFlyers = document.querySelectorAll('.grape-zoom-projectile');
    oldFlyers.forEach(f => f.remove());

    const slot = document.getElementById(`grape-item-${nextGrapeIndex}`);
    const grapeImg = slot ? slot.querySelector('img') : null;
    const grapeSrc = grapeImg ? grapeImg.src : `assets/objetos/migas/uva_single_${nextGrapeIndex}.png`;

    animateGrapeToPlate(slot, grapeSrc, nextGrapeIndex, () => {
      if (slot) {
        slot.classList.add('is-placed');
      }

      if (myToken !== activeSequenceToken) return;

      playGrapeCollectAudio();

      const stepData = grapeDialogueSteps[nextGrapeIndex - 1];
      if (stepData) {
        setSceneSubtitle('sub-escena-10', stepData.text, stepData.speaker, true);
        VoiceEngine.speak(stepData.text.replace(/[«»¡!]/g, ''), stepData.voiceChar, () => {
          if (myToken !== activeSequenceToken) return;
          if (stepData.isFinal) {
            setTimeout(() => {
              if (myToken !== activeSequenceToken) return;
              currentGrapeCount = 0;
              for (let i = 1; i <= maxGrapes; i++) {
                const grapeEl = document.getElementById(`grape-item-${i}`);
                if (grapeEl) grapeEl.classList.remove('is-placed');
              }
              setSceneSubtitle('sub-escena-10', '¡Toca el plato para añadir las uvas ígneas a las migas de Oti!', '', true);
            }, 4000);
          }
        });
      }
    });
  }

  if (cardEscena10) cardEscena10.addEventListener('click', placeNextGrape);
});
