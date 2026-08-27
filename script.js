/**
 * GATO Y CRUNCHY — PITCH BIBLE INTERACTIVA
 * Motor de Diálogos Hablados con Subtitulado Dinámico en Directo en Cada Escena
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado global
  let audioEnabled = true;
  let audioCtx = null;
  const portalAudioEl = document.getElementById('portal-audio-element');

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
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  ['click', 'pointerdown', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockGlobalAudio, { passive: true, once: true });
  });

  // Reproducir audio del portal (Freesound / sintético)
  function playFreesoundPortal() {
    if (!audioEnabled) return;
    unlockGlobalAudio();
    if (portalAudioEl) {
      portalAudioEl.currentTime = 0;
      portalAudioEl.volume = 0.75;
      const playPromise = portalAudioEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          SFXEngine.play('portal-star');
        });
      }
    } else {
      SFXEngine.play('portal-star');
    }
  }

  // Interacción Dinámica con el Logotipo Oficial de Portada
  const logoContainer = document.querySelector('.logo-official-container');
  if (logoContainer) {
    logoContainer.addEventListener('click', () => {
      SFXEngine.play('portal-star');
      logoContainer.style.transform = 'scale(1.08) translateY(-12px)';
      setTimeout(() => { logoContainer.style.transform = ''; }, 350);
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

      unlockGlobalAudio();

      // Balbuceo procedural cartoon inmediato según el personaje
      SFXEngine.play(`voice-${character}`);

      // Limpiar texto de signos ortográficos para pronunciación natural
      const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/[—«»"']/g, '').trim();

      if (!('speechSynthesis' in window)) {
        if (onStartCallback) onStartCallback();
        const estTime = Math.max(cleanText.split(' ').length * 350, 2000);
        if (onEndCallback) setTimeout(onEndCallback, estTime);
        return;
      }

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {}

      const utterance = new SpeechSynthesisUtterance(cleanText);
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

      // Almacenar en variable global para que el recolector de basura de Chrome no lo destruya
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

      // Temporizador de seguridad muy holgado (solo por si el navegador crashea o silencia)
      const wordCount = cleanText.split(' ').length;
      const maxSafetyDuration = Math.max(wordCount * 900, 7000);
      activeSpeechTimeout = setTimeout(() => {
        if (!window.speechSynthesis.speaking) {
          finish();
        }
      }, maxSafetyDuration);

      // Pequeño retardo de 50ms para que el motor de voz esté listo
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('Speech speak exception:', err);
          finish();
        }
      }, 50);
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
      btnAudioToggle.classList.toggle('is-audio-on', audioEnabled);
      btnAudioToggle.classList.toggle('is-audio-off', !audioEnabled);
      const label = btnAudioToggle.querySelector('.lbl-audio');
      if (label) {
        label.textContent = audioEnabled ? 'SFX & VOCES: ON' : 'SFX & VOCES: OFF';
      }
      if (audioEnabled) {
        SFXEngine.play('triumph-chime');
      } else {
        cancelAllSequences();
      }
    });
  }

  // ========================================================
  // FUNCIÓN AUXILIAR PARA ACTUALIZAR BURBUJAS DE DIÁLOGO OFICIALES
  // ========================================================
  function setSceneSubtitle(subId, textContent, speakerType = '') {
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

    let bubbleClass = 'bubble-system';
    let avatarHtml = `<div class="bubble-avatar-slot"><img src="assets/ui/Guante.png" alt="Toca" class="bubble-avatar-img bubble-glove-img" /></div>`;

    if (speakerType.includes('gato') || cleanText.startsWith('Gato:')) {
      bubbleClass = 'bubble-gato';
      cleanText = cleanText.replace(/^Gato:\s*/i, '').replace(/^«[—\-]\s*/, '«');
      const avatarSrc = isAngry ? 'assets/dialogos/Dialogo_Gato_Enfadado.png' : 'assets/dialogos/Dialogo_Gato.png';
      avatarHtml = `<div class="bubble-avatar-slot"><img src="${avatarSrc}" alt="Gato" class="bubble-avatar-img" /></div>`;
    } else if (speakerType.includes('crunchy') || cleanText.startsWith('Crunchy:')) {
      bubbleClass = 'bubble-crunchy';
      cleanText = cleanText.replace(/^Crunchy:\s*/i, '').replace(/^«[—\-]\s*/, '«');
      const avatarSrc = isAngry ? 'assets/dialogos/Dialogo_Crunchy_Enfadada.png' : 'assets/dialogos/Dialogo_Crunchy.png';
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
        avatarSrc = 'assets/dialogos/Dialogo_Riolita_Sorprendida.png?v=2.0';
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

  function cancelAllSequences() {
    activeSequenceToken++;
    VoiceEngine.stop();
    stopGatoPortalSpeaking();
    if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
    if (portalAudioEl) portalAudioEl.pause();
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

  // Observador de pantalla para que emerja de bolita pequeña a grande al ser visible
  if (portalStarDisc) {
    if ('IntersectionObserver' in window) {
      const portalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            portalStarDisc.classList.add('is-portal-opened');
          }
        });
      }, { threshold: 0.1 });
      portalObserver.observe(portalFloatingStage || portalStarDisc);
    }
    // Asegurar emergencia si ya está en pantalla al cargar
    setTimeout(() => {
      if (portalStarDisc) portalStarDisc.classList.add('is-portal-opened');
    }, 350);
  }

  function runScene01Sequence() {
    const myToken = cancelAllSequences();
    if (portalStarDisc) portalStarDisc.classList.add('is-portal-opened');
    if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');

    stopGatoPortalSpeaking();
    playFreesoundPortal();

    if (actorGatoPortal) actorGatoPortal.classList.add('is-visible');
    setSceneSubtitle('sub-escena-01', '«¡Hola! Soy Gato. Bueno... ¡el gato soy yo y me llamo Gato! ¿Te cuento nuestra primera aventura?»', 'sub-speaker-gato');

    VoiceEngine.speak(
      '¡Hola! Soy Gato. Bueno... ¡el gato soy yo y me llamo Gato! ¿Te cuento nuestra primera aventura?',
      'gato',
      () => {
        if (myToken !== activeSequenceToken) return;
        stopGatoPortalSpeaking();
          
          // Crunchy habla desde el otro lado del portal (vibración acústica tipo membrana de altavoz)
          if (portalMembranePulse) portalMembranePulse.classList.add('is-crunchy-vibrating');
          setSceneSubtitle('sub-escena-01', '«¡Gato! ¿Dónde te has metido? ¡Oti nos está llamando!»', 'sub-speaker-crunchy');
          SFXEngine.play('whoop');

          VoiceEngine.speak('¡Gato! ¿Dónde te has metido? ¡Oti nos está llamando!', 'crunchy', () => {
            if (myToken !== activeSequenceToken) return;
            if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
            
            setSceneSubtitle('sub-escena-01', '«¡Eh! ¡Un momento, Crunchy! ¡Que le estoy presentando nuestra historia!»', 'sub-speaker-gato');
            VoiceEngine.speak('¡Eh! ¡Un momento, Crunchy! ¡Que le estoy presentando nuestra historia!', 'gato', () => {
              if (myToken !== activeSequenceToken) return;
              stopGatoPortalSpeaking();
              
              // Crunchy responde de nuevo desde el otro lado con bombeo de membrana
              if (portalMembranePulse) portalMembranePulse.classList.add('is-crunchy-vibrating');
              setSceneSubtitle('sub-escena-01', '«¡Pues date prisa, y no juegues con la pistola!»', 'sub-speaker-crunchy');
              VoiceEngine.speak('¡Pues date prisa, y no juegues con la pistola!', 'crunchy', () => {
                if (myToken !== activeSequenceToken) return;
                if (portalMembranePulse) portalMembranePulse.classList.remove('is-crunchy-vibrating');
                
                setSceneSubtitle('sub-escena-01', '«¡Vale, vale! ¡Ya voy! ¡Ponte cómodo, que la aventura empieza ahora mismo!»', 'sub-speaker-gato');
                VoiceEngine.speak('¡Vale, vale! ¡Ya voy! ¡Ponte cómodo, que la aventura empieza ahora mismo!', 'gato', () => {
                  if (myToken !== activeSequenceToken) return;
                  stopGatoPortalSpeaking();
                  SFXEngine.play('whoop');
                  playFreesoundPortal();
                  if (actorGatoPortal) actorGatoPortal.classList.remove('is-visible');
                  setSceneSubtitle('sub-escena-01', '¡Gato entró al portal! Desplaza hacia abajo para descubrir la historia...', 'destacat-cyan');
                }, () => startGatoPortalSpeaking());
              });
            }, () => startGatoPortalSpeaking());
          });
        },
        () => startGatoPortalSpeaking()
      );
  }

  if (portalFloatingStage) {
    portalFloatingStage.addEventListener('click', runScene01Sequence);
  }
  if (pillEscena01) {
    pillEscena01.addEventListener('click', (e) => {
      e.stopPropagation();
      runScene01Sequence();
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

  function runScene02Sequence() {
    const myToken = cancelAllSequences();

    SFXEngine.play('triumph-chime');
    setSceneSubtitle('sub-escena-02', '«¡Mirad! Nuestra foto favorita: Oti, Crunchy y yo juntos en la casa del árbol.»', 'sub-speaker-gato');

    VoiceEngine.speak('¡Mirad! Nuestra foto favorita: Oti, Crunchy y yo juntos en la casa del árbol.', 'gato', () => {
      if (myToken !== activeSequenceToken) return;
      SFXEngine.play('whoop');
      setSceneSubtitle('sub-escena-02', '«¡Salimos genial! Aunque Gato ya estaba tramando alguna travesura...»', 'sub-speaker-crunchy');
      VoiceEngine.speak('¡Salimos genial! Aunque Gato ya estaba tramando alguna travesura...', 'crunchy', () => {
        if (myToken !== activeSequenceToken) return;
        SFXEngine.play('banjo-sarten');
        setSceneSubtitle('sub-escena-02', '«¡Ja, ja! La familia siempre unida. ¡Ese es el verdadero tesoro de nuestro hogar!»', 'sub-speaker-oti');
        VoiceEngine.speak('¡Ja, ja! La familia siempre unida. ¡Ese es el verdadero tesoro de nuestro hogar!', 'oti', () => {
          if (myToken !== activeSequenceToken) return;
          setTimeout(() => {
            if (myToken !== activeSequenceToken) return;
            setSceneSubtitle('sub-escena-02', '¡Mueve el ratón para explorar el cuadro 3D o toca para volver a escuchar!', '');
          }, 600);
        });
      });
    });
  }

  if (cardEscena02) cardEscena02.addEventListener('click', runScene02Sequence);
  if (cuadroStageEl) cuadroStageEl.addEventListener('click', (e) => {
    e.stopPropagation();
    runScene02Sequence();
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
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

      mouseSpeedX = e.clientX - mouseLastX;
      mouseSpeedY = e.clientY - mouseLastY;
      mouseLastX = e.clientX;
      mouseLastY = e.clientY;

      const speed = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY);

      targetTiltX = Math.max(Math.min(-offsetY * 0.08, 14), -14);
      targetTiltY = Math.max(Math.min(offsetX * 0.08, 14), -14);
      targetShiftX = Math.max(Math.min(mouseSpeedX * 0.25, 10), -10);
      targetShiftY = Math.max(Math.min(mouseSpeedY * 0.25, 10), -10);

      // Movimiento suave conjunto al mover la sartén
      migasArray.forEach((m) => {
        m.vx += mouseSpeedX * 0.08;
        m.vy += mouseSpeedY * 0.08;
        m.vrot += (mouseSpeedX - mouseSpeedY) * 0.2;
      });

      const now = Date.now();
      if (speed > 14 && now - lastSoundTime > 380) {
        lastSoundTime = now;
        SFXEngine.play('banjo-sarten');
      }
    });

    activePanArea.addEventListener('click', (e) => {
      e.stopPropagation();
      // Salto sutil y suave de salteado de comida
      migasArray.forEach((m) => {
        m.vy += -5 - Math.random() * 4;
        m.vx += (Math.random() - 0.5) * 3;
        m.vrot += (Math.random() - 0.5) * 15;
      });
      runScene03Sequence();
    });
  }

  function runScene03Sequence() {
    const myToken = cancelAllSequences();

    SFXEngine.play('banjo-sarten');
    setSceneSubtitle('sub-escena-03', '«¡Mmm! ¡Estas migas van a quedar deliciosas! Pero vaya... ¡nos faltan las uvas!»', 'sub-speaker-oti');

    VoiceEngine.speak('¡Mmm! ¡Estas migas van a quedar deliciosas! Pero vaya... ¡nos faltan las uvas!', 'oti', () => {
      if (myToken !== activeSequenceToken) return;
      SFXEngine.play('banjo-sarten');
      setSceneSubtitle('sub-escena-03', '«¡Vamos a buscarlas arriba al desván antes de que se enfríen las migas!»', 'sub-speaker-crunchy');
      VoiceEngine.speak('¡Vamos a buscarlas arriba al desván antes de que se enfríen las migas!', 'crunchy', () => {
        if (myToken !== activeSequenceToken) return;
        SFXEngine.play('whoop');
        setSceneSubtitle('sub-escena-03', '«¡Tranquilos! ¡Yo subo a por ellas en un abrir y cerrar de ojos!»', 'sub-speaker-gato');
        VoiceEngine.speak('¡Tranquilos! ¡Yo subo a por ellas en un abrir y cerrar de ojos!', 'gato', () => {
          if (myToken !== activeSequenceToken) return;
          SFXEngine.play('banjo-sarten');
          setSceneSubtitle('sub-escena-03', '«¡Ten cuidado con los trastos, Gato!»', 'sub-speaker-oti');
          VoiceEngine.speak('¡Ten cuidado con los trastos, Gato!', 'oti', () => {
            if (myToken !== activeSequenceToken) return;
            setTimeout(() => {
              if (myToken !== activeSequenceToken) return;
              setSceneSubtitle('sub-escena-03', '¡Toca la sartén para saltear las migas y volver a escuchar!', '');
            }, 600);
          });
        });
      });
    });
  }

  if (cardEscena03) cardEscena03.addEventListener('click', runScene03Sequence);

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
    3: '«¡Uf, cuántos trastos viejos acumulados por aquí!»',
    2: '«¡Por aquí tampoco están las uvas! Sigamos buscando...»',
    1: '«¡Cuidado con levantar polvo! Ya casi llegamos al fondo...»',
    0: '«¡Espera! ¿Y este artefacto tan raro?»'
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
      const nextBox = remaining[0]; // Orden de capas: Caja 1 (frente) -> Caja 2 -> Caja 3 -> Caja 4 (fondo)
      const tossDir = (nextBox.id === 'item-caja-1' || nextBox.id === 'item-caja-4') ? 'is-tossed-left' : 'is-tossed-right';
      nextBox.classList.add(tossDir);
      SFXEngine.play('whoop');

      const afterCount = remaining.length - 1;
      const stepText = boxNarrativeSteps[afterCount] || '¡Apartando trastos del desván!';
      
      if (afterCount === 0) {
        allBoxesTossedAt = Date.now(); // Marca el momento exacto en que se apartó la última caja
        setSceneSubtitle('sub-escena-04', stepText, 'sub-speaker-gato');
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
    allBoxesTossedAt = 0;
    SFXEngine.play('pop');
    setSceneSubtitle('sub-escena-04', '«¡Busquemos por el desván! Haz clic para apartar las cajas y ver qué hay...»', 'sub-speaker-gato');
  }

  function runScene04Dialogue() {
    // Si aún quedan cajas visibles, NO activar la pistola, sino apartar estrictamente 1 caja
    const remaining = getRemainingBoxes();
    if (remaining.length > 0) {
      tossNextBox();
      return;
    }

    // Exigir un tiempo prudencial tras apartar la 4ª caja para evitar activaciones accidentales en el mismo clic
    const now = Date.now();
    if (allBoxesTossedAt > 0 && now - allBoxesTossedAt < 500) {
      return;
    }

    const myToken = cancelAllSequences();

    // Paso 1: Gato coge la pistola por curiosidad y el núcleo comienza a iluminarse
    if (layerPistola) {
      layerPistola.classList.remove('is-shooting', 'is-vibrating');
      layerPistola.classList.add('is-charging');
    }
    SFXEngine.play('portal-star');
    setSceneSubtitle('sub-escena-04', 'Gato cogió la extraña pistola con curiosidad... ¡y empezó a brillar con una intensa luz azul!', 'destacat-cyan');

    // Paso 1.5 (a los 900ms): Comienza a vibrar acumulando energía antes del disparo
    setTimeout(() => {
      if (myToken !== activeSequenceToken) return;
      if (layerPistola) {
        layerPistola.classList.add('is-vibrating');
      }
      SFXEngine.play('whoop');
    }, 900);

    // Paso 2 (a los 1800ms): Disparo accidental por la energía del conflicto con "pistola_dispara"
    setTimeout(() => {
      if (myToken !== activeSequenceToken) return;

      if (layerPistola) {
        layerPistola.classList.remove('is-charging', 'is-vibrating');
        layerPistola.classList.add('is-shooting');
      }
      playFreesoundPortal();

      setSceneSubtitle('sub-escena-04', '«¡DEJA DE TOCAR COSAS QUE NO SON TUYAS! ¡SIEMPRE HACES LO QUE QUIERES!»', 'sub-speaker-crunchy shout-rage');

      VoiceEngine.speak('¡Deja de tocar cosas que no son tuyas! ¡Siempre haces lo que quieres!', 'crunchy', () => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-04', '«¡SOLO TENÍA CURIOSIDAD! ¡DEJA DE DECIRME SIEMPRE LO QUE TENGO QUE HACER!»', 'sub-speaker-gato shout-rage');
        VoiceEngine.speak('¡Solo tenía curiosidad! ¡Deja de decirme siempre lo que tengo que hacer!', 'gato', () => {
          if (myToken !== activeSequenceToken) return;
          playFreesoundPortal();
          setSceneSubtitle('sub-escena-04', '¡La energía de la discusión sobrecargó la pistola abriendo una brecha dimensional! Desplaza para continuar...', 'destacat-cyan');
        });
      });
    }, 1800);
  }

  // Interacción al hacer clic directamente en una caja o en la pistola
  chestLayers.forEach((layer) => {
    layer.addEventListener('click', (e) => {
      e.stopPropagation();
      const itemType = layer.getAttribute('data-item');

      if (itemType === 'pistola') {
        const remaining = getRemainingBoxes();
        if (remaining.length > 0) {
          tossNextBox();
        } else {
          runScene04Dialogue();
        }
      } else {
        const now = Date.now();
        if (now - lastTossTimestamp < 280) return;
        lastTossTimestamp = now;

        // Apartar la caja pulsada directamente
        const boxId = layer.id;
        const tossDir = (boxId === 'item-caja-1' || boxId === 'item-caja-4') ? 'is-tossed-left' : 'is-tossed-right';
        layer.classList.add(tossDir);
        SFXEngine.play('whoop');

        const remaining = getRemainingBoxes();
        const stepText = boxNarrativeSteps[remaining.length] || '¡Apartando trastos del desván!';
        if (remaining.length === 0) {
          allBoxesTossedAt = Date.now();
          setSceneSubtitle('sub-escena-04', stepText, 'destacat-cyan');
        } else {
          setSceneSubtitle('sub-escena-04', stepText, '');
        }
      }
    });
  });

  // Clic directo en la burbuja de subtítulo inferior
  if (pillEscena04) {
    pillEscena04.addEventListener('click', (e) => {
      e.stopPropagation();
      const remaining = getRemainingBoxes();
      if (remaining.length > 0) {
        tossNextBox();
      } else {
        const now = Date.now();
        if (allBoxesTossedAt > 0 && now - allBoxesTossedAt < 500) {
          return;
        }

        if (layerPistola && !layerPistola.classList.contains('is-shooting')) {
          runScene04Dialogue();
        } else {
          resetScene04Boxes();
        }
      }
    });
  }

  // Clic en la tarjeta de la escena (solo si no fue en un hijo que ya gestionó el evento)
  if (cardEscena04) {
    cardEscena04.addEventListener('click', (e) => {
      if (e.target.closest('.chest-item-layer') || e.target.closest('#sub-escena-04')) {
        return;
      }
      const remaining = getRemainingBoxes();
      if (remaining.length > 0) {
        tossNextBox();
      } else {
        const now = Date.now();
        if (allBoxesTossedAt > 0 && now - allBoxesTossedAt < 500) {
          return;
        }

        if (layerPistola && !layerPistola.classList.contains('is-shooting')) {
          runScene04Dialogue();
        } else {
          resetScene04Boxes();
        }
      }
    });
  }

  // ========================================================
  // ESCENA 05: EL SALTO DIMENSIONAL (PORTAL GIRATORIO Y VISTA VOLCÁNICA)
  // ========================================================
  const cardEscena05 = document.getElementById('card-escena-05');
  const portalStage = document.getElementById('portal-stage');
  const portalAperture = document.getElementById('portal-aperture');
  const portalWorldImg = document.getElementById('portal-world-img');

  let isPortalHovered = false;

  // Efecto Parallax 3D sobre el círculo del portal
  if (portalAperture && portalWorldImg) {
    portalAperture.addEventListener('mousemove', (e) => {
      const rect = portalAperture.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = ((e.clientX - centerX) / (rect.width / 2)) * 12;
      const moveY = ((e.clientY - centerY) / (rect.height / 2)) * 12;
      
      portalWorldImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.08)`;
    });

    portalAperture.addEventListener('mouseenter', () => {
      SFXEngine.play('portal-star');
    });

    portalAperture.addEventListener('mouseleave', () => {
      if (portalWorldImg) {
        portalWorldImg.style.transform = 'translate(0px, 0px) scale(1)';
      }
    });
  }

  function runScene05Sequence() {
    const myToken = cancelAllSequences();

    if (cardEscena05) {
      cardEscena05.classList.add('is-transporting');
    }

    playFreesoundPortal();
    SFXEngine.play('whoop');
    setSceneSubtitle('sub-escena-05', '«¡Aaaaah! ¡Gato, nos absorbe el portal!»', 'sub-speaker-crunchy shout-rage');

    VoiceEngine.speak('¡Aaaaah! ¡Gato, nos absorbe el portal!', 'crunchy', () => {
      if (myToken !== activeSequenceToken) return;
      SFXEngine.play('whoop');
      setSceneSubtitle('sub-escena-05', '«¡Uf! ¡¿Pero por qué hace tanto calor?! ¡¿Hemos caído dentro de un horno?!»', 'sub-speaker-gato shout-rage');
      VoiceEngine.speak('¡Uf! ¡¿Pero por qué hace tanto calor?! ¡¿Hemos caído dentro de un horno?!', 'gato', () => {
        if (myToken !== activeSequenceToken) return;
        playFreesoundPortal();
        setSceneSubtitle('sub-escena-05', '¡Han caído en mitad del Mundo Volcánico! Desplaza hacia abajo para continuar...', 'destacat-orange');
        
        setTimeout(() => {
          if (cardEscena05) cardEscena05.classList.remove('is-transporting');
        }, 2200);
      });
    });
  }

  if (cardEscena05) {
    cardEscena05.addEventListener('click', (e) => {
      if (e.target.closest('#sub-escena-05')) {
        return; // No activar animación del portal al pulsar la burbuja de texto
      }
      runScene05Sequence();
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
      binocularsStage.classList.remove('is-opened');
      if (disputeRoundRock) {
        disputeRoundRock.classList.remove('is-rolling-away');
      }
      if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
      if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');
      
      // Restaurar fotos enfadadas al cerrar
      if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-3.png';
      if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-1.png';

      SFXEngine.play('pop');
      setSceneSubtitle('sub-escena-06', '¡Toca los prismáticos para observar la discusión de Riolita y Basalto!', '');
    }
  }

  function runScene06Sequence(e) {
    if (e && e.target && e.target.closest('#sub-escena-06')) {
      return; // No reiniciar si solo se hace clic en la pastilla
    }

    const isCurrentlyOpened = binocularsStage && binocularsStage.classList.contains('is-opened');

    // Si ya está abierto y se hace clic FUERA del visor de los prismáticos -> Cerrar sin reiniciar diálogo
    if (isCurrentlyOpened) {
      const clickedInsideVisor = e && e.target && e.target.closest('#binoculars-visor-elem');
      if (!clickedInsideVisor) {
        closeScene06Binoculars();
        return;
      }
    }

    const myToken = cancelAllSequences();

    // Abrir el visor de los prismáticos
    if (binocularsStage && !binocularsStage.classList.contains('is-opened')) {
      binocularsStage.classList.add('is-opened');
      SFXEngine.play('whoop');
    }

    // Resetear posición de la roca si ya había rodado y poner caras enfadadas
    if (disputeRoundRock) {
      disputeRoundRock.classList.remove('is-rolling-away');
      void disputeRoundRock.offsetWidth; // trigger reflow
    }
    if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-3.png';
    if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-1.png';

    // 1. Habla Riolita (Enfadada)
    if (speakerRiolitaCard) speakerRiolitaCard.classList.add('is-speaking');
    if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');

    SFXEngine.play('lava-bubble');
    setSceneSubtitle('sub-escena-06', '«¡Esta roca ígnea la vi yo primero para mi colección! ¡No la toques, Basalto!»', 'sub-speaker-riolita angry');
    
    VoiceEngine.speak('¡Esta roca ígnea la vi yo primero para mi colección! ¡No la toques, Basalto!', 'riolita', () => {
      if (myToken !== activeSequenceToken) return;

      // 2. Habla Basalto (Enfadado)
      if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
      if (speakerBasaltoCard) speakerBasaltoCard.classList.add('is-speaking');

      SFXEngine.play('lava-bubble');
      setSceneSubtitle('sub-escena-06', '«¡La desenterré yo picando con mi pico! ¡No pienso dártela!»', 'sub-speaker-basalto angry');

      VoiceEngine.speak('¡La desenterré yo picando con mi pico! ¡No pienso dártela!', 'basalto', () => {
        if (myToken !== activeSequenceToken) return;

        // 3. Forcejeo final: la roca cae rodando y cambian a caras de sorprendidos
        if (speakerRiolitaCard) speakerRiolitaCard.classList.add('is-speaking');
        if (speakerBasaltoCard) speakerBasaltoCard.classList.add('is-speaking');

        if (disputeRoundRock) {
          disputeRoundRock.classList.add('is-rolling-away');
        }

        // Cambiar a las imágenes de sorprendidos
        if (imgRiolitaDispute) imgRiolitaDispute.src = 'assets/personajes/riolita/Riolita-2.png';
        if (imgBasaltoDispute) imgBasaltoDispute.src = 'assets/personajes/basalto/Basalto-2.png';

        SFXEngine.play('whoop');
        SFXEngine.play('rock-rumble');
        setSceneSubtitle('sub-escena-06', '«¡Cuidado, Basalto, que se cae!»', 'sub-speaker-riolita surprised');

        VoiceEngine.speak('¡Cuidado, Basalto, que se cae!', 'riolita', () => {
          if (myToken !== activeSequenceToken) return;
          if (speakerRiolitaCard) speakerRiolitaCard.classList.remove('is-speaking');
          if (speakerBasaltoCard) speakerBasaltoCard.classList.remove('is-speaking');
          SFXEngine.play('explosion');
          setSceneSubtitle('sub-escena-06', '¡La gran roca se les escapó de las manos y cayó rodando montaña abajo directo a la cueva! Desplaza para continuar...', 'destacat-orange');
        });
      });
    });
  }

  if (cardEscena06) cardEscena06.addEventListener('click', runScene06Sequence);

  // Cerrar prismáticos si se hace clic fuera de la tarjeta de la escena 06
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
      text: '«¡Venga, pongamos todos de nuestra parte para arreglarlo!»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita',
      sfx: 'lava-bubble'
    },
    {
      handId: 'arm-hand-2',
      text: '«¡Eso es, que si colaboramos no hay nada que nos pare!»',
      speaker: 'sub-speaker-basalto',
      voiceChar: 'basalto',
      sfx: 'rock-rumble'
    },
    {
      handId: 'arm-hand-3',
      text: '«¡Seguro que entre los cuatro podemos despejar la cueva!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy',
      sfx: 'pop'
    },
    {
      handId: 'arm-hand-4',
      text: '«¡Claro que sí! ¡A la de tres: uno, dos y... ¡¡EQUIPO!!»',
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
      // Reiniciar para volver a jugar la secuencia
      currentHandsCount = 0;
      for (let i = 1; i <= maxHands; i++) {
        const hand = document.getElementById(`arm-hand-${i}`);
        if (hand) hand.classList.remove('is-in-center');
      }
      if (teamHandsBox) teamHandsBox.classList.remove('is-all-united');
      SFXEngine.play('pop');
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
      SFXEngine.play('tada');
      SFXEngine.play('triumph-chime');
      SFXEngine.play('sparkle');
    } else {
      SFXEngine.play('pop');
      if (step.sfx) SFXEngine.play(step.sfx);
    }

    setSceneSubtitle('sub-escena-07', step.text, step.speaker);
    VoiceEngine.speak(step.text.replace(/[«»¡!]/g, ''), step.voiceChar, () => {
      if (myToken !== activeSequenceToken) return;
      if (step.isFinal) {
        setSceneSubtitle('sub-escena-07', '¡Pacto sellado! Los cuatro amigos han unido sus fuerzas para resolver el problema juntos.', 'destacat-orange');
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
      return; // No avanzar golpes si solo se hace clic en la burbuja de texto
    }

    const myToken = cancelAllSequences();

    // Si ya se destruyó, permitir reiniciar
    if (rockSmashStep >= 4) {
      rockSmashStep = 0;
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-5.png';
      if (volcanicBoulder) volcanicBoulder.classList.remove('is-shattered', 'is-punch-struck');
      setSceneSubtitle('sub-escena-08', '¡Toca la roca para golpear todos juntos en equipo!', '');
      return;
    }

    rockSmashStep++;

    // Animación de impacto y temblor físico en la roca
    if (volcanicBoulder) {
      volcanicBoulder.classList.remove('is-punch-struck');
      void volcanicBoulder.offsetWidth; // trigger reflow
      volcanicBoulder.classList.add('is-punch-struck');
    }

    if (rockSmashStep === 1) {
      // 1er Clic: Riolita pide disculpas y golpea -> Fase 1 de grietas (Roca-4)
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-4.png';
      SFXEngine.play('rock-rumble');
      setSceneSubtitle('sub-escena-08', '«¡Siento haberme enfadado, Basalto! ¡Hagamos las paces!»', 'sub-speaker-riolita');
      VoiceEngine.speak('¡Siento haberme enfadado, Basalto! ¡Hagamos las paces!', 'riolita');

    } else if (rockSmashStep === 2) {
      // 2º Clic: Basalto le responde y suma sus fuerzas -> Fase 2 de grietas (Roca-3)
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-3.png';
      SFXEngine.play('explosion');
      setSceneSubtitle('sub-escena-08', '«¡Yo también lo siento, Riolita! ¡Juntos somos más fuertes!»', 'sub-speaker-basalto');
      VoiceEngine.speak('¡Yo también lo siento, Riolita! ¡Juntos somos más fuertes!', 'basalto');

    } else if (rockSmashStep === 3) {
      // 3er Clic: Crunchy anima al grupo -> Fase 3 de grietas profundas (Roca-2)
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-2.png';
      SFXEngine.play('whoop');
      setSceneSubtitle('sub-escena-08', '«¡Eso es! ¡Gato, remata tú con todas tus fuerzas!»', 'sub-speaker-crunchy');
      VoiceEngine.speak('¡Eso es! ¡Gato, remata tú con todas tus fuerzas!', 'crunchy');

    } else if (rockSmashStep === 4) {
      // 4º Clic: Golpe conjunto con Gato y Destrucción Total -> Montón de escombros (Roca-1)
      if (volcanicRockArt) volcanicRockArt.src = 'assets/objetos/roca/Roca-1.png';
      if (volcanicBoulder) volcanicBoulder.classList.add('is-shattered');

      SFXEngine.play('explosion');
      SFXEngine.play('triumph-chime');
      setSceneSubtitle('sub-escena-08', '«¡¡Por fin la hemos roto!! ¡El túnel está despejado!»', 'sub-speaker-gato');
      
      VoiceEngine.speak('¡Por fin la hemos roto! ¡El túnel está despejado!', 'gato', () => {
        if (myToken !== activeSequenceToken) return;
        setSceneSubtitle('sub-escena-08', '¡Roca destruida en equipo! ¡El camino hacia el portal ha quedado libre!', 'destacat-cyan');
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
      text: '«¡Esa está recién cosechada del cráter, bien dulce y calentita!»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita'
    },
    {
      text: '«¡Cuidado, que guardan todo el calor del reino de magma!»',
      speaker: 'sub-speaker-basalto',
      voiceChar: 'basalto'
    },
    {
      text: '«¡Mmm! ¡Qué aroma tan rico desprenden, me encantan!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy'
    },
    {
      text: '«¡Oti va a preparar un festín legendario con estas uvas!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Ya casi las tenéis todas dentro de la bolsa!»',
      speaker: 'sub-speaker-riolita',
      voiceChar: 'riolita'
    },
    {
      text: '«¡Bolsa llena y asegurada! ¡Buen viaje de regreso, amigos!»',
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

    // Posición inicial y final relativas a la capa interna z-index: 3 de la bolsa
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

    // Force browser reflow to register initial transform
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

    // 1. Si ya se han guardado las 6 uvas y se vuelve a hacer clic -> Reiniciar secuencia
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

    // 2. Si la bolsa está cerrada -> Abrirla
    if (!isBagOpen) {
      isBagOpen = true;
      if (cardEscena09) {
        cardEscena09.classList.remove('is-bag-closed');
        cardEscena09.classList.add('is-bag-open');
      }
      SFXEngine.play('pop');
      SFXEngine.play('sparkle');
      
      const openSpeech = '¡Abre bien la bolsa, que vamos a guardar todas las uvas ígneas!';
      setSceneSubtitle('sub-escena-09', '«¡Abre bien la bolsa, que vamos a guardar todas las uvas ígneas!»', 'sub-speaker-crunchy');
      VoiceEngine.speak(openSpeech, 'crunchy', () => {
        if (myToken !== activeSequenceToken) return;
        if (collectedGrapesCount === 0) {
          setSceneSubtitle('sub-escena-09', '¡Bolsa abierta! Toca las uvas flotantes para guardarlas dentro una a una.', 'destacat-orange');
        }
      });
      return;
    }

    // 3. Si la bolsa está abierta -> Guardar la siguiente uva
    const clickedSlot = e ? e.target.closest('.bolsa-grape-slot') : null;
    let targetSlot = clickedSlot;
    if (!targetSlot || targetSlot.classList.contains('is-collected')) {
      targetSlot = document.querySelector('.bolsa-floating-grapes .bolsa-grape-slot:not(.is-collected)');
    }

    if (!targetSlot) return;

    collectedGrapesCount++;
    const nextGrapeIndex = collectedGrapesCount;
    const insideDot = document.getElementById(`inside-grape-${nextGrapeIndex}`);

    SFXEngine.play('sparkle');

    animateGrapeToBag(targetSlot, insideDot, () => {
      if (myToken !== activeSequenceToken) return;

      if (insideDot) {
        insideDot.classList.add('is-filled');
      }

      const step = bolsaGrapeDialogueSteps[nextGrapeIndex - 1];

      if (step.isFinal) {
        if (bolsaGiftBox) {
          bolsaGiftBox.classList.add('is-all-collected');
        }
        SFXEngine.play('portal-star');
        SFXEngine.play('triumph-chime');
        SFXEngine.play('tada');
      } else {
        SFXEngine.play('pop');
      }

      setSceneSubtitle('sub-escena-09', step.text, step.speaker);
      VoiceEngine.speak(step.text.replace(/[«»¡!]/g, ''), step.voiceChar, () => {
        if (myToken !== activeSequenceToken) return;
        if (step.isFinal) {
          setSceneSubtitle('sub-escena-09', '¡Todas las uvas aseguradas en la bolsa! Gato y Crunchy cruzan el portal. Desplaza hacia abajo para el festín final...', 'destacat-orange');
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
      text: '«¡Oti, ya estamos aquí! ¡Y traemos las mejores uvas ígneas del universo!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Huelen delicioso! ¡Y pensar que fuisteis hasta un mundo volcánico a por ellas!»',
      speaker: 'sub-speaker-oti',
      voiceChar: 'oti'
    },
    {
      text: '«¡Y aprendimos a resolver los problemas hablando y trabajando en equipo!»',
      speaker: 'sub-speaker-crunchy',
      voiceChar: 'crunchy'
    },
    {
      text: '«¡Qué orgullo de amigos! Añadamos estas últimas uvas para coronar la gran receta...»',
      speaker: 'sub-speaker-oti',
      voiceChar: 'oti'
    },
    {
      text: '«Y a ti que nos lees... ¡muchas gracias por vivir esta gran aventura con nosotros!»',
      speaker: 'sub-speaker-gato',
      voiceChar: 'gato'
    },
    {
      text: '«¡Gato, no te enrolles hablando al lector que se enfrían las migas! ¡A comer todos juntos!»',
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
      // Si ya están todas las 6 uvas, reiniciar el plato para volver a interactuar
      currentGrapeCount = 0;
      for (let i = 1; i <= maxGrapes; i++) {
        const slot = document.getElementById(`grape-item-${i}`);
        if (slot) slot.classList.remove('is-placed');
      }
      if (migasGrapeCountElem) migasGrapeCountElem.textContent = '0';
      SFXEngine.play('pop');
      setSceneSubtitle('sub-escena-10', '¡Toca el plato para añadir las uvas ígneas a las migas!', '');
      return;
    }

    currentGrapeCount++;
    const nextGrapeIndex = currentGrapeCount;
    if (migasGrapeCountElem) migasGrapeCountElem.textContent = nextGrapeIndex;

    const slot = document.getElementById(`grape-item-${nextGrapeIndex}`);
    const grapeImg = slot ? slot.querySelector('img') : null;
    const grapeSrc = grapeImg ? grapeImg.src : `assets/objetos/migas/uva_single_${nextGrapeIndex}.png`;

    SFXEngine.play('pop');
    SFXEngine.play('lava-bubble');

    animateGrapeToPlate(slot, grapeSrc, nextGrapeIndex, () => {
      if (myToken !== activeSequenceToken) return;

      if (slot) {
        slot.classList.add('is-placed');
      }
      SFXEngine.play('sparkle');

      const stepData = grapeDialogueSteps[nextGrapeIndex - 1];
      if (stepData) {
        if (stepData.isFinal) {
          SFXEngine.play('tada');
          SFXEngine.play('triumph-chime');
        }
        setSceneSubtitle('sub-escena-10', stepData.text, stepData.speaker);
        VoiceEngine.speak(stepData.text, stepData.voiceChar);
      }
    });
  }

  if (cardEscena10) cardEscena10.addEventListener('click', placeNextGrape);

  // ========================================================
  // VINCULACIÓN DIRECTA DE TODAS LAS PASTILLAS DE SUBTÍTULOS (CLIC)
  // ========================================================
  const pill02 = document.getElementById('sub-escena-02');
  const pill03 = document.getElementById('sub-escena-03');
  const pill04 = document.getElementById('sub-escena-04');
  const pill05 = document.getElementById('sub-escena-05');
  const pill06 = document.getElementById('sub-escena-06');
  const pill07 = document.getElementById('sub-escena-07');
  const pill08 = document.getElementById('sub-escena-08');
  const pill09 = document.getElementById('sub-escena-09');
  const pill10 = document.getElementById('sub-escena-10');

  if (pill02) pill02.addEventListener('click', (e) => { e.stopPropagation(); runScene02Sequence(); });
  if (pill03) pill03.addEventListener('click', (e) => { e.stopPropagation(); runScene03Sequence(); });
  if (pill04) pill04.addEventListener('click', (e) => { e.stopPropagation(); runScene04Dialogue(); });
  if (pill05) pill05.addEventListener('click', (e) => { e.stopPropagation(); runScene05Sequence(); });
  if (pill06) pill06.addEventListener('click', (e) => { e.stopPropagation(); runScene06Sequence(); });
  if (pill07) pill07.addEventListener('click', (e) => { e.stopPropagation(); runScene07Sequence(); });
  if (pill08) pill08.addEventListener('click', (e) => { e.stopPropagation(); handleRockSmashClick(); });
  if (pill09) pill09.addEventListener('click', (e) => { e.stopPropagation(); runScene09Sequence(); });
  if (pill10) pill10.addEventListener('click', (e) => { e.stopPropagation(); placeNextGrape(); });
});
