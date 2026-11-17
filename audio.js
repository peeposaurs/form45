// High-Immersion FNAF Audio & Radio Voice Engine for Paanch Ghantay at NA-47
(function(root) {
  'use strict';

  const SFX_MANIFEST = {
    door_slam: 'assets/sfx/door_slam.mp3',
    door_kundi: 'assets/sfx/door_kundi.mp3',
    door_open: 'assets/sfx/door_open.mp3',
    shutter_slam: 'assets/sfx/shutter_slam.mp3',
    shutter_latch: 'assets/sfx/shutter_latch.mp3',
    shutter_open: 'assets/sfx/shutter_open.mp3',
    bang_door: 'assets/sfx/bang_door.mp3?v=6',
    bang_window: 'assets/sfx/bang_window.mp3?v=6',
    khaki_door_bang: 'assets/sfx/khaki_door_bang.mp3?v=7',
    babu_door_bang: 'assets/sfx/babu_door_bang.mp3?v=7',
    window_bars: 'assets/sfx/window_bars.mp3',
    hammer_strike: 'assets/sfx/hammer_strike.mp3',
    jumpscare_khaki: 'assets/sfx/jumpscare_khaki.mp3?v=6',
    khaki_corridor_0: 'assets/sfx/khaki_corridor_0.mp3?v=5',
    khaki_corridor_1: 'assets/sfx/khaki_corridor_1.mp3?v=5',
    khaki_corridor_2: 'assets/sfx/khaki_corridor_2.mp3?v=5',
    khaki_door_arrive_0: 'assets/sfx/khaki_door_arrive_0.mp3?v=5',
    khaki_door_arrive_1: 'assets/sfx/khaki_door_arrive_1.mp3?v=5',
    khaki_door_arrive_2: 'assets/sfx/khaki_door_arrive_2.mp3?v=5',
    khaki_door_slammed: 'assets/sfx/khaki_door_slammed.mp3?v=5',
    khaki_door_walk_0: 'assets/sfx/khaki_door_walk_0.mp3?v=5',
    khaki_door_walk_1: 'assets/sfx/khaki_door_walk_1.mp3?v=5',
    khaki_door_walk_2: 'assets/sfx/khaki_door_walk_2.mp3?v=5',
    khaki_enraged_door: 'assets/sfx/khaki_enraged_door.mp3?v=5',
    khaki_enraged_scan: 'assets/sfx/khaki_enraged_scan.mp3?v=5',
    khaki_enraged_1: 'assets/sfx/khaki_enraged_1.wav?v=1',
    khaki_enraged_2: 'assets/sfx/khaki_enraged_2.wav?v=1',
    khaki_enraged_3: 'assets/sfx/khaki_enraged_3.wav?v=1',
    khaki_enraged_4: 'assets/sfx/khaki_enraged_4.wav?v=1',
    khaki_enraged_5: 'assets/sfx/khaki_enraged_5.wav?v=1',
    khaki_distant_1: 'assets/sfx/khaki_distant_1.wav?v=1',
    khaki_distant_2: 'assets/sfx/khaki_distant_2.wav?v=1',
    khaki_distant_3: 'assets/sfx/khaki_distant_3.wav?v=1',
    khaki_laugh_1: 'assets/sfx/khaki_laugh_1.mp3?v=5',
    khaki_laugh_2: 'assets/sfx/khaki_laugh_2.mp3?v=5',
    khaki_peek_stare: 'assets/sfx/khaki_peek_stare.mp3?v=5',
    khaki_retreat_door: 'assets/sfx/khaki_retreat_door.mp3?v=5',
    babu_corridor_1: 'assets/sfx/babu_corridor_1.mp3?v=5',
    babu_corridor_2: 'assets/sfx/babu_corridor_2.mp3?v=5',
    babu_corridor_3: 'assets/sfx/babu_corridor_3.mp3?v=5',
    babu_flashed: 'assets/sfx/babu_flashed.mp3?v=5',
    babu_peek_1: 'assets/sfx/babu_peek_1.mp3?v=5',
    babu_peek_2: 'assets/sfx/babu_peek_2.mp3?v=5',
    babu_peek_3: 'assets/sfx/babu_peek_3.mp3?v=5',
    babu_retreat: 'assets/sfx/babu_retreat.mp3?v=5',
    babu_warn_3: 'assets/sfx/babu_warn_3.mp3?v=5',
    babu_window_1: 'assets/sfx/babu_window_1.mp3?v=5',
    babu_window_2: 'assets/sfx/babu_window_2.mp3?v=5',
    babu_window_3: 'assets/sfx/babu_window_3.mp3?v=5',
    jumpscare_babu: 'assets/sfx/jumpscare_babu.mp3?v=6',
    babu_enraged_1: 'assets/sfx/babu_enraged_1.wav?v=2',
    babu_enraged_2: 'assets/sfx/babu_enraged_2.wav?v=2',
    babu_enraged_3: 'assets/sfx/babu_enraged_3.wav?v=2',
    babu_enraged_4: 'assets/sfx/babu_enraged_4.wav?v=2',
    babu_enraged_5: 'assets/sfx/babu_enraged_5.wav?v=2',
    babu_breath: 'assets/sfx/babu_breath.mp3?v=1',
    babu_clear_throat: 'assets/sfx/babu_clear_throat.mp3?v=1',
    babu_cough: 'assets/sfx/babu_cough.mp3?v=1',
    babu_distant_1: 'assets/sfx/babu_distant_1.wav?v=2',
    babu_distant_2: 'assets/sfx/babu_distant_2.wav?v=2',
    babu_distant_3: 'assets/sfx/babu_distant_3.wav?v=2',
    babu_humming: 'assets/sfx/babu_humming.mp3?v=1',
    babu_slam_1: 'assets/sfx/babu_slam_1.wav?v=1',
    babu_slam_2: 'assets/sfx/babu_slam_2.wav?v=1',
    babu_slam_3: 'assets/sfx/babu_slam_3.wav?v=1',
    babu_vpn_sabotage: 'assets/sfx/babu_vpn_sabotage.wav?v=2',
    babu_vpn_sabotage_2: 'assets/sfx/babu_vpn_sabotage_2.wav?v=2',
    babu_whistle: 'assets/sfx/babu_whistle.mp3?v=1',
    form_collected: 'assets/sfx/form_collected.mp3',
    phone_ringing: 'assets/sfx/phone_ringing.mp3',
    phone_pickup: 'assets/sfx/phone_pickup.mp3',
    room_ambience: 'assets/sfx/room_ambience.mp3?v=6',
    ambience_lahore: 'assets/sfx/ambience_lahore.mp3?v=1',
    ambience_karachi: 'assets/sfx/ambience_karachi.mp3?v=1',
    background_ambiance: 'assets/sfx/background_ambiance.mp3?v=6',
    fan_ambience: 'assets/sfx/fan_ambience.mp3?v=6',
    cam_1_parking: 'assets/sfx/cam_1_parking.mp3?v=6',
    cam_3_droplets: 'assets/sfx/cam_3_droplets.mp3?v=6',
    cam_4_staff: 'assets/sfx/cam_4_staff.mp3?v=1793734831439',
    cam_8_headmaster: 'assets/sfx/cam_8_headmaster.mp3?v=1793734831439',
    homescreen_menu: 'assets/sfx/homescreen_menu.mp3?v=1793735962307',
    khaki_sabotage_siren: 'assets/sfx/khaki_sabotage_siren.mp3?v=6',
    amb_creak_0: 'assets/sfx/amb_creak_0.mp3',
    amb_creak_1: 'assets/sfx/amb_creak_1.mp3',
    amb_wind_0: 'assets/sfx/amb_wind_0.mp3',
    amb_drip_0: 'assets/sfx/amb_drip_0.mp3',
    step_0: 'assets/sfx/step_0.mp3',
    step_1: 'assets/sfx/step_1.mp3',
    step_2: 'assets/sfx/step_2.mp3',
    step_3: 'assets/sfx/step_3.mp3',
    flashlight_click: 'assets/sfx/flashlight_click.mp3?v=3',
    vpn_trip: 'assets/sfx/vpn_trip.mp3?v=3',
    vpn_reconnect: 'assets/sfx/vpn_reconnect.mp3?v=3',
    cctv_switch: 'assets/sfx/cctv_switch.mp3?v=3',
        cctv_toggle: 'assets/sfx/cctv_toggle.mp3?v=3',
    kettle_boil: 'assets/sfx/kettle_boil.mp3?v=13s',
    kettle_whistle: 'assets/sfx/kettle_whistle.mp3?v=13s',
    heartbeat: 'assets/sfx/heartbeat.mp3?v=loop',
    stamp_thud: 'assets/sfx/stamp_thud.mp3',
    fajr_azan: 'assets/sfx/fajr_azan.mp3',
    distant_dog: 'assets/sfx/distant_dog.mp3',
    creepy_giggle: 'assets/sfx/creepy_giggle.mp3',
    tv_static: 'assets/sfx/tv_static.mp3',
    babu_roar: 'assets/sfx/babu_roar.mp3?v=1'
  };

  class FnafAudio {
    constructor() {
      this.ctx = null;
      this.humOsc = null;
      this.humGain = null;
      this.fanNoise = null;
      this.fanGain = null;
      this.muted = false;
      this.voiceBusyUntil = 0;
      this._pendingVoiceTimer = null;
      this.introAudioBuffer = null;
      this.introSourceNode = null;
      this.introGainNode = null;
      this.phoneAudio = null;
      this._preloadPromise = null;
      this._rawIntroArrayBuffer = null;

      // Realistic Foley audio sample cache
      this.sampleBuffers = {};
      this.sampleAudioEls = {};
      this._sfxPreloaded = false;
      this._stepCycle = 0;
      this.ambienceSrc = null;
      this.fanSrc = null;
      this._camAmbSrc = null;
      this._currentCamAmbKey = null;
      this._activeKhakiDoorBangSrc = null;
      this._activeBabuDoorBangSrc = null;

      this._activeKhakiVoiceSrc = null;
      this._activeBabuVoiceSrc = null;

      // Authentic enraged voicelines when catching player scanning Form-45
      this.khakiEnragedLines = [
        { id: 1, key: 'khaki_enraged_1', subtitle: 'Ruk ja saaley!!', subtitleEn: 'Stop right there, punk!!', dur: 1.8 },
        { id: 2, key: 'khaki_enraged_2', subtitle: 'Tera khel khattam!', subtitleEn: 'Your game is over!', dur: 2.6 },
        { id: 3, key: 'khaki_enraged_3', subtitle: 'Darwaza todh du ga!', subtitleEn: "I'll break the door down!", dur: 2.7 },
        { id: 4, key: 'khaki_enraged_4', subtitle: 'Sabar Kar abhi aya!', subtitleEn: "Just wait, I'm coming right now!", dur: 2.6 },
        { id: 5, key: 'khaki_enraged_5', subtitle: 'Zyada Hoshiyar mat ban!', subtitleEn: "Don't act too smart!", dur: 2.8 }
      ];
      this._khakiEnragedWeights = [1.0, 1.0, 1.0, 1.0, 1.0];
      this._khakiLastPlayedIdx = -1;

      // Distant eerie camera whispers for Khaki (low volume, dynamic chance, anti-repeat)
      this.khakiDistantLines = [
        { id: 1, key: 'khaki_distant_1', subtitle: 'RO sahib form agency ke hawale kardein..', subtitleEn: 'RO sir, hand over the forms to the agency..', dur: 3.4 },
        { id: 2, key: 'khaki_distant_2', subtitle: 'Bahir vigo start khadhi hai.. *giggles*', subtitleEn: 'The Vigo is idling outside.. *giggles*', dur: 2.9 },
        { id: 3, key: 'khaki_distant_3', subtitle: 'Ye mulk ki salamti ke liye hai, beta...', subtitleEn: "This is for the country's security, son...", dur: 3.4 }
      ];
      this._khakiDistantWeights = [1.0, 1.0, 1.0];
      this._khakiLastDistantIdx = -1;

      this.babuEnragedLines = [
        { id: 1, key: 'babu_enraged_1', subtitle: 'Oye scan mat kar!', subtitleEn: "Hey, don't scan!", dur: 2.2 },
        { id: 2, key: 'babu_enraged_2', subtitle: 'Form scan mat kar!', subtitleEn: "Don't scan the form!", dur: 2.1 },
        { id: 3, key: 'babu_enraged_3', subtitle: 'Oye! Form idhar la!', subtitleEn: 'Hey! Hand the form over here!', dur: 1.5 },
        { id: 4, key: 'babu_enraged_4', subtitle: 'Teri naukri gayi!', subtitleEn: 'Your job is gone!', dur: 1.8 },
        { id: 5, key: 'babu_enraged_5', subtitle: 'Abey scanner se dur reh!', subtitleEn: 'Hey, stay away from the scanner!', dur: 1.9 }
      ];
      this._babuEnragedWeights = [1.0, 1.0, 1.0, 1.0, 1.0];
      this._babuLastPlayedIdx = -1;

      // Distant eerie camera whispers for Babu (low volume, dynamic chance, anti-repeat)
      this.babuDistantLines = [
        { id: 1, key: 'babu_distant_1', subtitle: 'Scan na karna beta.. *giggles*', subtitleEn: "Don't you dare scan, son.. *giggles*", dur: 3.4 },
        { id: 2, key: 'babu_distant_2', subtitle: 'Nateeja to tabdeel hokey rahe ga... *giggles*', subtitleEn: 'The result will definitely be changed... *giggles*', dur: 4.5 },
        { id: 3, key: 'babu_distant_3', subtitle: 'Tu to gaya... *giggles*', subtitleEn: "You're finished... *giggles*", dur: 3.7 }
      ];
      this._babuDistantWeights = [1.0, 1.0, 1.0];
      this._babuLastDistantIdx = -1;

      // Babu VPN Sabotage taunts when PTCL/WiFi is cut by PTA Shark
      this.babuVpnSabotageLines = [
        { id: 1, key: 'babu_vpn_sabotage', subtitle: 'Arey, Net chala gaya?', subtitleEn: 'Oh, did the internet go out?', dur: 2.7 },
        { id: 2, key: 'babu_vpn_sabotage_2', subtitle: 'Connection ke bghair kaise upload karo ge? *giggles*', subtitleEn: 'How will you upload without a connection? *giggles*', dur: 3.8 }
      ];
      this._babuVpnSabotageWeights = [1.0, 1.0];
      this._babuLastVpnSabotageIdx = -1;
      this.sabotageSirenSrc = null;
      this.heartbeatLoopNode = null;
      this.kettleBoilNode = null;
      this.masterGain = null;
      this.masterVolume = (() => {
        try {
          const v = parseFloat(localStorage.getItem('form45_master_vol'));
          return (!isNaN(v) && v >= 0 && v <= 1) ? v : 1.0;
        } catch (_) { return 1.0; }
      })();
      try {
        if (localStorage.getItem('form45_muted') === '1') this.muted = true;
      } catch (_) {}
    }

    preloadSfx() {
      if (this._sfxPreloaded) return;
      this._sfxPreloaded = true;
      this.init();

      Object.entries(SFX_MANIFEST).forEach(([key, url]) => {
        fetch(url)
          .then(resp => {
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            return resp.arrayBuffer();
          })
          .then(buf => {
            if (this.ctx) {
              return this.ctx.decodeAudioData(buf);
            }
          })
          .then(decoded => {
            if (decoded) {
              this.sampleBuffers[key] = decoded;
            }
          })
          .catch(() => {
            try {
              const a = new Audio(url);
              a.preload = 'auto';
              this.sampleAudioEls[key] = a;
            } catch (_) {}
          });
      });
    }

    stopSound(node, fadeDuration = 0) {
      if (!node) return;
      try {
        if (node.gainNode && this.ctx && fadeDuration > 0) {
          const now = this.ctx.currentTime;
          node.gainNode.gain.cancelScheduledValues(now);
          node.gainNode.gain.setValueAtTime(Math.max(0.0001, node.gainNode.gain.value), now);
          node.gainNode.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
          setTimeout(() => {
            try { if (node.stop) node.stop(); } catch (_) {}
          }, (fadeDuration + 0.05) * 1000);
          return;
        }

        if (node.gainNode && this.ctx) {
          try {
            node.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            node.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);
          } catch (_) {}
        }
        if (typeof node.pause === 'function') {
          if (fadeDuration > 0) {
            let v = node.volume;
            const step = v / (fadeDuration * 60);
            const fadeTimer = setInterval(() => {
              v -= step;
              if (v <= 0.02) {
                clearInterval(fadeTimer);
                try { node.pause(); node.currentTime = 0; } catch (_) {}
              } else {
                try { node.volume = Math.max(0, v); } catch (_) {}
              }
            }, 16);
            return;
          } else {
            node.pause();
            node.currentTime = 0;
            return;
          }
        }
        if (typeof node.stop === 'function') {
          node.stop();
        }
      } catch (_) {}
    }

    playSample(name, pan = 0, vol = 1.0, pitchVar = 0.04, delay = 0, loop = false, fadeIn = 0, filterFreq = 0, duration = 0, offset = 0, baseDetune = 0, playbackRate = 1.0) {
      if (this.muted) return null;
      this.init();
      if (!this.ctx) return null;

      const buf = this.sampleBuffers[name];
      if (buf) {
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          src.loop = loop;

          if (playbackRate !== 1.0) {
            src.playbackRate.setValueAtTime(playbackRate, this.ctx.currentTime + delay);
          }

          // Micro pitch randomization and base detuning for organic realism
          if (baseDetune !== 0 || pitchVar > 0) {
            const randomVar = pitchVar > 0 ? (Math.random() * 2 - 1) * (pitchVar * 12) * 100 : 0;
            src.detune.setValueAtTime(baseDetune + randomVar, this.ctx.currentTime + delay);
          }

          const gain = this.ctx.createGain();
          if (fadeIn > 0) {
            gain.gain.setValueAtTime(0.0001, this.ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(Math.max(0.01, vol), this.ctx.currentTime + delay + fadeIn);
          } else {
            gain.gain.setValueAtTime(Math.max(0.01, vol), this.ctx.currentTime + delay);
          }

          let lastNode = gain;
          if (filterFreq > 0 && this.ctx.createBiquadFilter) {
            const lpFilter = this.ctx.createBiquadFilter();
            lpFilter.type = 'lowpass';
            lpFilter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime + delay);
            gain.connect(lpFilter);
            lastNode = lpFilter;
          }
          if (this.ctx.createStereoPanner && pan !== 0) {
            // For directional 3D panning, downmix stereo buffer to mono first so all audio energy is cleanly routed to the panned ear
            const monoMix = this.ctx.createGain();
            monoMix.channelCount = 1;
            monoMix.channelCountMode = 'explicit';
            monoMix.channelInterpretation = 'speakers';
            lastNode.connect(monoMix);

            const panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime + delay);
            monoMix.connect(panner);
            lastNode = panner;
          }

          src.connect(gain);
          lastNode.connect(this.getMasterNode());
          src.gainNode = gain;

          const t0 = this.ctx.currentTime + delay;
          if (duration > 0) {
            const maxOffset = Math.max(0, buf.duration - duration - 0.02);
            const safeOffset = Math.max(0, Math.min(offset, maxOffset));
            gain.gain.setValueAtTime(Math.max(0.01, vol), t0 + Math.max(0, duration - 0.025));
            gain.gain.linearRampToValueAtTime(0.0001, t0 + duration);
            src.start(t0, safeOffset, duration);
          } else {
            src.start(t0);
          }
          return src;
        } catch (e) {
          console.warn('playSample buffer error:', e);
        }
      }

      // Fallback: HTMLAudioElement
      try {
        const audio = new Audio(SFX_MANIFEST[name] || ('assets/sfx/' + name + '.mp3'));
        audio.volume = this._effectiveVol(Math.min(1.0, Math.max(0.05, vol)));
        audio.loop = loop;
        audio.gainNode = null;
        audio.play().catch(() => {});
        return audio;
      } catch (_) {}

      return null;
    }

    preloadIntroCall(levelNum = 1) {
      this.preloadSfx();
      if (!this._callPreloadPromises) this._callPreloadPromises = {};
      if (this._callPreloadPromises[levelNum]) return this._callPreloadPromises[levelNum];

      const callFile = levelNum === 2 ? 'assets/audio/calls/call_l2_full.mp3?v=1'
                     : levelNum === 3 ? 'assets/audio/calls/call_l3_full.mp3?v=2'
                     : 'assets/audio/calls/call_l1_full.mp3?v=1';

      this._callPreloadPromises[levelNum] = (async () => {
        try {
          const resp = await fetch(callFile);
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          const buf = await resp.arrayBuffer();
          if (!this._rawCallBuffers) this._rawCallBuffers = {};
          this._rawCallBuffers[levelNum] = buf;
          if (this.ctx) {
            if (!this.callAudioBuffers) this.callAudioBuffers = {};
            this.callAudioBuffers[levelNum] = await this.ctx.decodeAudioData(buf.slice(0));
            if (levelNum === 1) this.introAudioBuffer = this.callAudioBuffers[1];
          }
        } catch (e) {
          // Fallback: preload Audio element for file:/// local protocol
          if (!this.callAudios) this.callAudios = {};
          if (!this.callAudios[levelNum]) {
            this.callAudios[levelNum] = new Audio(callFile);
            this.callAudios[levelNum].preload = 'auto';
            if (levelNum === 1) this.phoneAudio = this.callAudios[1];
          }
        }
      })();
      return this._callPreloadPromises[levelNum];
    }

    isVoiceBusy() {
      if (this.introSourceNode) {
        return true;
      }
      if (this.phoneAudio && !this.phoneAudio.paused && !this.phoneAudio.ended) {
        return true;
      }
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        return true;
      }
      return performance.now() < this.voiceBusyUntil;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          try {
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
          } catch (_) {}
        }
      }
      if (this.ctx && this.ctx.state !== 'running' && !this._isPaused) {
        this.ctx.resume().catch(() => {});
      }
      if (this.ctx && !this._iosUnlocked) {
        try {
          const buf = this.ctx.createBuffer(1, 1, 22050);
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          src.connect(this.ctx.destination);
          src.start(0);
          this._iosUnlocked = true;
        } catch (_) {}
      }
      if (this.ctx && !this.masterGain) {
        try {
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        } catch (_) {}
      }
      if (this.ctx && this._rawIntroArrayBuffer && !this.introAudioBuffer) {
        this.ctx.decodeAudioData(this._rawIntroArrayBuffer.slice(0)).then(decoded => {
          this.introAudioBuffer = decoded;
        }).catch(() => {});
      }
    }

    pauseAll() {
      this._isPaused = true;
      this._pausedPhoneAudios = [];
      try {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      } catch (_) {}
      try {
        if (this.phoneAudio && !this.phoneAudio.paused) {
          this.phoneAudio.pause();
          this._pausedPhoneAudios.push(this.phoneAudio);
        }
        if (this.callAudios) {
          Object.values(this.callAudios).forEach((aud) => {
            if (aud && !aud.paused && !this._pausedPhoneAudios.includes(aud)) {
              aud.pause();
              this._pausedPhoneAudios.push(aud);
            }
          });
        }
      } catch (_) {}
      try {
        if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
        }
      } catch (_) {}
    }

    resumeAll() {
      this._isPaused = false;
      try {
        if (this.ctx && this.ctx.state !== 'running') {
          this.ctx.resume().catch(() => {});
        }
      } catch (_) {}
      try {
        if (this._pausedPhoneAudios && this._pausedPhoneAudios.length) {
          this._pausedPhoneAudios.forEach((aud) => {
            try { aud.play().catch(() => {}); } catch (_) {}
          });
        }
        this._pausedPhoneAudios = [];
      } catch (_) {}
      try {
        if ('speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (_) {}
      if (this._pendingPausedCall) {
        const pending = this._pendingPausedCall;
        this._pendingPausedCall = null;
        this._playAyeshaCallAudio(pending.text, pending.levelNum);
      }
    }

    getMasterNode() {
      if (!this.ctx) return null;
      if (!this.masterGain) {
        try {
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        } catch (_) {
          return this.ctx.destination;
        }
      }
      return this.masterGain;
    }

    _effectiveVol(base = 1.0) {
      if (this.muted) return 0;
      return Math.max(0, Math.min(1, base * this.masterVolume));
    }

    syncMediaVolumes() {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      }
      try {
        const menuEl = document.getElementById('homescreen-menu-audio');
        if (menuEl) {
          menuEl.volume = this._effectiveVol(0.75);
          menuEl.muted = !!this.muted;
        }
        if (this.phoneAudio) {
          this.phoneAudio.volume = this._effectiveVol(0.95);
          this.phoneAudio.muted = !!this.muted;
        }
        if (this.callAudios) {
          Object.values(this.callAudios).forEach((aud) => {
            if (aud) {
              aud.volume = this._effectiveVol(0.95);
              aud.muted = !!this.muted;
            }
          });
        }
        ['news-cutscene-video', 'level-complete-video', 'end-credits-video'].forEach((id) => {
          const vid = document.getElementById(id);
          if (vid) {
            vid.volume = this._effectiveVol(1.0);
            vid.muted = !!this.muted;
          }
        });
      } catch (_) {}
    }

    setVolume(vol) {
      this.masterVolume = Math.max(0, Math.min(1, vol));
      try { localStorage.setItem('form45_master_vol', String(this.masterVolume)); } catch (_) {}
      this.syncMediaVolumes();
    }

    setMuted(muted) {
      this.muted = !!muted;
      try { localStorage.setItem('form45_muted', this.muted ? '1' : '0'); } catch (_) {}
      this.syncMediaVolumes();
    }

    menuHover() {
      this.tone(1200, 1400, 0.035, 'sine', 0.04, 0);
    }

    menuSelect() {
      this.tone(480, 840, 0.07, 'square', 0.08, 0);
    }    playStaticClip(duration = 0.15, vol = 0.85, pan = 0) {
      if (this.muted) return null;
      this.init();
      if (!this.ctx) return null;

      const buf = this.sampleBuffers['tv_static'];
      if (buf) {
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = buf;

          // Subtle pitch detune (+/- 1 semitone) for organic variability
          const detune = (Math.random() * 2 - 1) * 100;
          src.detune.setValueAtTime(detune, this.ctx.currentTime);

          const gain = this.ctx.createGain();
          const t0 = this.ctx.currentTime;
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.linearRampToValueAtTime(Math.max(0.01, vol), t0 + 0.012);
          gain.gain.setValueAtTime(Math.max(0.01, vol), t0 + Math.max(0.012, duration - 0.025));
          gain.gain.linearRampToValueAtTime(0.0001, t0 + duration);

          let lastNode = gain;
          if (this.ctx.createStereoPanner && pan !== 0) {
            const panner = this.ctx.createStereoPanner();
            panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
            gain.connect(panner);
            lastNode = panner;
          }

          src.connect(gain);
          lastNode.connect(this.getMasterNode());

          // Random slice into the 8-second static audio file for natural non-repeating static!
          const maxOffset = Math.max(0, buf.duration - duration - 0.05);
          const offset = Math.random() * maxOffset;

          src.start(t0, offset, duration);
          return src;
        } catch (e) {
          console.warn('playStaticClip error:', e);
        }
      }

      // Fallback: noiseBurst if buffer not yet loaded
      return this.noiseBurst(duration, vol * 0.12, 2200, pan);
    }

    menuStaticGlitch(intensity = 1.0, isLong = false, customDuration = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const dur = customDuration > 0 ? customDuration : (isLong ? (0.18 + Math.random() * 0.12) : (0.09 + Math.random() * 0.08));
      const vol = Math.min(1.2, 0.75 * intensity);
      this.playStaticClip(dur, vol, 0);

      // Occasional secondary micro-crackle for realistic analog electrical texture
      if (Math.random() < 0.45) {
        setTimeout(() => {
          if (!this.muted && this.ctx) {
            this.playStaticClip(0.045, vol * 0.65, 0);
          }
        }, Math.floor(dur * 500) + 15);
      }
    }

    scheduleAmbienceVariation() {
      clearTimeout(this._ambienceTimer);
      if (this.muted || !this.ambienceSrc) return;

      const nextDelay = 10000 + Math.random() * 12000; // Every 10-22 seconds
      this._ambienceTimer = setTimeout(() => {
        if (this.muted || !this.ambienceSrc) return;
        const variants = ['amb_creak_0', 'amb_creak_1', 'amb_wind_0', 'amb_drip_0'];
        const chosen = variants[Math.floor(Math.random() * variants.length)];
        const pan = (Math.random() * 1.5 - 0.75); // Subtle stereo placement across school
        const vol = 0.075 + Math.random() * 0.045; // Subtle, audible atmospheric detail
        this.playSample(chosen, pan, vol, 0.08);
        this.scheduleAmbienceVariation();
      }, nextDelay);
    }

    startMenuMusic() {
      if (this.muted) return;
      try {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (_) {}

      const el = document.getElementById('homescreen-menu-audio');
      if (el) {
        el.volume = this._effectiveVol(0.75);
        el.muted = !!this.muted;
        const p = el.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    }

    stopMenuMusic(fadeDuration = 0.6) {
      const el = document.getElementById('homescreen-menu-audio');
      if (!el || el.paused) return;

      if (fadeDuration > 0) {
        let v = el.volume;
        const step = v / (fadeDuration * 60);
        const timer = setInterval(() => {
          v -= step;
          if (v <= 0.04) {
            clearInterval(timer);
            el.pause();
            el.volume = this._effectiveVol(0.75);
          } else {
            el.volume = Math.max(0, v);
          }
        }, 16);
      } else {
        el.pause();
        el.volume = this._effectiveVol(0.75);
      }
    }

    startAmbience(level = 1) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const lvl = (level === 3) ? 3 : (level === 2) ? 2 : 1;

      // If ambience is already active for a different level, stop it first so the new level track starts cleanly
      if (this.ambienceSrc && this.currentAmbienceLevel !== lvl) {
        this.stopAmbience();
      }
      this.currentAmbienceLevel = lvl;

      // 1. Level-specific Room Ambience / Background Atmosphere Music Loop
      // Level 1 (Islamabad School): room_ambience.mp3
      // Level 2 (Lahore Old Degree College): ambience_lahore.mp3 ("Lahore ambience.mp3")
      // Level 3 (Karachi RO Warehouse): ambience_karachi.mp3 ("Karachi ambience.mp3")
      const ambKey = (lvl === 3) ? 'ambience_karachi' : (lvl === 2) ? 'ambience_lahore' : 'room_ambience';
      const ambVol = (lvl === 3) ? 0.35 : (lvl === 2) ? 0.32 : 0.22;

      if (!this.ambienceSrc) {
        this.ambienceSrc = this.playSample(ambKey, 0, ambVol, 0, 0, true);
        this.scheduleAmbienceVariation();
      }
      // 2. Vintage Room Fan Background Loop
      if (!this.fanSrc) {
        this.fanSrc = this.playSample('fan_ambience', 0, 0.48, 0, 0, true);
      }

      if (this.humOsc) return;

      // 2. 50Hz Pakistani UPS Inverter Mains Hum (Warm electrical hum)
      this.humOsc = this.ctx.createOscillator();
      this.humGain = this.ctx.createGain();
      this.humOsc.type = 'sawtooth';
      this.humOsc.frequency.setValueAtTime(50, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 125;

      this.humGain.gain.setValueAtTime(0.014, this.ctx.currentTime);
      this.humOsc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(this.getMasterNode());
      this.humOsc.start();
    }

    stopAmbience() {
      clearTimeout(this._ambienceTimer);
      if (this.ambienceSrc) {
        this.stopSound(this.ambienceSrc, 0.6);
        this.ambienceSrc = null;
      }
      this.currentAmbienceLevel = null;
      if (this.fanSrc) {
        this.stopSound(this.fanSrc, 0.6);
        this.fanSrc = null;
      }
      this.stopCamAmbient(0.85);
      this.stopKhakiVoice(0.02);
      this.stopBabuVoice(0.02);
      this.stopEmergencyAlarm();
      this.stopDoorBanging('all');
      if (this.humOsc) {
        try { this.humOsc.stop(); } catch (e) {}
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      if (this.fanNoise) {
        try { this.fanNoise.stop(); } catch (e) {}
        this.fanNoise.disconnect();
        this.fanNoise = null;
      }
      this.stopPhoneGuy();
    }

    speakPhoneGuy(text, onConnected, levelNum = 1) {
      if (this.muted) return;
      this.init();
      this.stopPhoneGuy();

      const buffer = (this.callAudioBuffers && this.callAudioBuffers[levelNum]) || this.introAudioBuffer;
      const durMs = (buffer && buffer.duration) ? (buffer.duration * 1000 + 2000) : 80000;
      this.voiceBusyUntil = performance.now() + durMs;

      // Play master track directly from 0.0s (contains ring + pickup + dialogue)
      this._playAyeshaCallAudio(text, levelNum);

      // Trigger pickup / connected event at 9.0s (when speech starts)
      this._phonePickupTimer = setTimeout(() => {
        try {
          if (typeof onConnected === 'function') {
            onConnected();
          }
        } catch (e) {
          console.warn('onConnected callback error:', e);
        }
      }, 9000); // 9.0s speech start
    }

    _playAyeshaCallAudio(text, levelNum = 1) {
      if (this.muted) return;
      const targetBuffer = (this.callAudioBuffers && this.callAudioBuffers[levelNum]) || (levelNum === 1 ? this.introAudioBuffer : null);

      const playWithWebAudio = (buf) => {
        if (!this.ctx || !buf || this.muted) return false;
        if (this._isPaused) {
          this._pendingPausedCall = { text, levelNum };
          return true;
        }
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = buf;

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(1.15, this.ctx.currentTime);

          src.connect(gain);
          gain.connect(this.getMasterNode());

          src.start(this.ctx.currentTime);
          this.introSourceNode = src;
          this.introGainNode = gain;

          src.onended = () => {
            if (this.introSourceNode === src) {
              this.introSourceNode = null;
              this.voiceBusyUntil = performance.now() + 1500;
            }
          };
          return true;
        } catch (e) {
          return false;
        }
      };

      if (targetBuffer) {
        playWithWebAudio(targetBuffer);
        return;
      }

      const p = this.preloadIntroCall(levelNum);
      if (p) {
        p.then(async () => {
          let buf = this.callAudioBuffers && this.callAudioBuffers[levelNum];
          if (this.ctx && this._rawCallBuffers && this._rawCallBuffers[levelNum] && !buf) {
            try {
              buf = await this.ctx.decodeAudioData(this._rawCallBuffers[levelNum].slice(0));
              if (!this.callAudioBuffers) this.callAudioBuffers = {};
              this.callAudioBuffers[levelNum] = buf;
            } catch (e) {}
          }
          if (!buf || !playWithWebAudio(buf)) {
            this._fallbackPhoneAudio(text, levelNum);
          }
        }).catch(() => {
          this._fallbackPhoneAudio(text, levelNum);
        });
      } else {
        this._fallbackPhoneAudio(text, levelNum);
      }
    }

    _fallbackPhoneAudio(text, levelNum = 1) {
      if (!this.callAudios) this.callAudios = {};
      const callFile = levelNum === 2 ? 'assets/audio/calls/call_l2_full.mp3?v=1'
                     : levelNum === 3 ? 'assets/audio/calls/call_l3_full.mp3?v=2'
                     : 'assets/audio/calls/call_l1_full.mp3?v=1';

      if (!this.callAudios[levelNum]) {
        this.callAudios[levelNum] = new Audio(callFile);
        this.callAudios[levelNum].preload = 'auto';
        this.callAudios[levelNum].addEventListener('ended', () => {
          this.voiceBusyUntil = performance.now() + 1500;
        });
      }
      this.phoneAudio = this.callAudios[levelNum];
      this.phoneAudio.currentTime = 0;
      this.phoneAudio.volume = this._effectiveVol(0.95);
      this.phoneAudio.muted = !!this.muted;
      if (this._isPaused) {
        if (!this._pausedPhoneAudios) this._pausedPhoneAudios = [];
        if (!this._pausedPhoneAudios.includes(this.phoneAudio)) {
          this._pausedPhoneAudios.push(this.phoneAudio);
        }
        return;
      }
      const p = this.phoneAudio.play();
      if (p) {
        p.catch(() => {
          if ('speechSynthesis' in window && text) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'ur-PK';
            u.rate = 1.0;
            u.volume = this._effectiveVol(0.85);
            window.speechSynthesis.speak(u);
          }
        });
      }
    }

    stopPhoneGuy() {
      clearTimeout(this._phoneRingTimer);
      clearTimeout(this._phonePickupTimer);
      if (this._phoneRingSource) {
        this.stopSound(this._phoneRingSource);
        this._phoneRingSource = null;
      }
      if (this._phonePickupSource) {
        this.stopSound(this._phonePickupSource);
        this._phonePickupSource = null;
      }
      clearTimeout(this._phoneTimer);
      clearTimeout(this._pendingVoiceTimer);
      this.voiceBusyUntil = 0;
      if (this.introSourceNode) {
        try {
          if (this.introGainNode && this.ctx) {
            this.introGainNode.gain.setValueAtTime(this.introGainNode.gain.value, this.ctx.currentTime);
            this.introGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
          }
          this.introSourceNode.stop(this.ctx.currentTime + 0.05);
        } catch (e) {}
        this.introSourceNode = null;
      }
      if (this.phoneAudio) {
        try {
          this.phoneAudio.pause();
          this.phoneAudio.currentTime = 0;
        } catch (e) {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    noiseBurst(dur = 0.12, gainVal = 0.08, bandFreq = 1200, pan = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const bufSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = bandFreq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

      src.connect(filter);
      filter.connect(gain);

      if (this.ctx.createStereoPanner && pan !== 0) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
        gain.connect(panner);
        panner.connect(this.getMasterNode());
      } else {
        gain.connect(this.getMasterNode());
      }
      src.start();
    }

    cctvBlip(isLong = false) {
      // Analog CCTV Security Camera Channel Switch: Gentle tactile clack + dynamic CRT static click
      this.playSample('cctv_switch', 0, 0.85, 0.03);
      if (isLong) {
        // Longer analog tuning noise burst with second subtle signal crackle
        this.noiseBurst(0.18, 0.12, 1600, 0);
        setTimeout(() => {
          if (!this.muted && this.ctx) {
            this.noiseBurst(0.08, 0.06, 1200, 0);
          }
        }, 180);
      } else {
        this.noiseBurst(0.08, 0.06, 1400, 0);
      }
    }

    cctvToggle(opening = true) {
      // Analog CCTV Monitor Flip Up / Down: Monitor frame latch + CRT degauss/static surge
      this.playSample('cctv_toggle', 0, 1.5, 0.03);
    }

    doorSlam(closing = true) {
      if (closing) {
        // Real Heavy Iron Door Slam (Panned Left)
        this.playSample('door_slam', -0.85, 1.35, 0.03);
        // Heavy Iron Kundi (Bolt) sliding and clacking into bracket (KHATAK!)
        setTimeout(() => {
          this.playSample('door_kundi', -0.85, 1.45, 0.02);
        }, 110);
      } else {
        // Real Door Opening / Rusty Hinge Creak + Latch Unhook
        this.playSample('door_open', -0.85, 1.25, 0.04);
      }
    }

    shutterSlam(closing = true) {
      if (closing) {
        // Real Wooden Shutter Slam (Panned Right)
        this.playSample('shutter_slam', 0.85, 1.30, 0.03);
        // Brass Chitkani (Tower Bolt) sliding down to lock (CLICK!)
        setTimeout(() => {
          this.playSample('shutter_latch', 0.85, 1.25, 0.02);
        }, 100);
      } else {
        // Real Wooden Shutter Creaking Open
        this.playSample('shutter_open', 0.85, 1.15, 0.04);
      }
    }

    lightBuzz() {
      // Crisp organic tactile switch click + faint filament pop
      this.playSample('flashlight_click', 0, 1.1, 0.04);
      this.noiseBurst(0.04, 0.04, 1800, 0);
    }

    flashlightClick(on = true) {
      this.playSample('flashlight_click', 0, 1.25, 0.04);
    }

    click() {
      this.playSample('flashlight_click', 0, 1.1, 0.04);
    }
    kettleBoilBrew(pan = 0.65) {
      if (this.muted) return;
      this.init();
      this.startKettleBoilLoop(pan);
    }
    startKettleBoilLoop(pan = 0.65) {
      if (this.kettleBoilNode) {
        this.stopSound(this.kettleBoilNode, 0.1);
        this.kettleBoilNode = null;
      }
      if (this.muted) return;
      this.init();
      // Play full 13-second Chai sound (boiling + ending whistle) without looping
      this.kettleBoilNode = this.playSample('kettle_boil', pan, 1.15, 0, 0, false, 0.15);
    }
    stopKettleBoilLoop() {
      if (this.kettleBoilNode) {
        this.stopSound(this.kettleBoilNode, 0.25);
        this.kettleBoilNode = null;
      }
    }
    kettleReadyWhistle(pan = 0.65) {
      // Intentionally silent: Chai sound.mp3 already contains the end whistle naturally
    }

    paperRustle() {
      this.playSample('form_collected', 0, 1.1, 0.05);
    }

    formCollected() {
      // Real Crisp Paper Handling & Heavy Ballot Box Latch Thud
      this.playSample('form_collected', 0, 1.35, 0.04);
    }

    startScannerLoop() {
      if (this.scannerOsc) return;
      this.init();
      if (!this.ctx) return;
      try {
        this.scannerOsc = this.ctx.createOscillator();
        this.scannerGain = this.ctx.createGain();
        this.scannerOsc.type = 'sawtooth';
        this.scannerOsc.frequency.setValueAtTime(175, this.ctx.currentTime);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 720;
        filter.Q.value = 2.5;
        this.scannerGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.scannerGain.gain.exponentialRampToValueAtTime(0.09, this.ctx.currentTime + 0.08);
        this.scannerOsc.connect(filter);
        filter.connect(this.scannerGain);
        this.scannerGain.connect(this.getMasterNode());
        this.scannerOsc.start();
      } catch (_) {}
    }

    stopScannerLoop() {
      if (this.scannerOsc && this.scannerGain && this.ctx) {
        try {
          const osc = this.scannerOsc;
          const gain = this.scannerGain;
          const now = this.ctx.currentTime;
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
          setTimeout(() => {
            try {
              osc.stop();
              osc.disconnect();
            } catch (_) {}
          }, 60);
        } catch (_) {}
        this.scannerOsc = null;
        this.scannerGain = null;
      }
    }

    scanSuccessChime() {
      this.stopScannerLoop();
      this.tone(784, 784, 0.08, 'sine', 0.22, 0);
      this.tone(1175, 1175, 0.16, 'sine', 0.24, 0.09);
    }

    uploadPacketChime() {
      this.tone(988, 1318, 0.12, 'sine', 0.16);
    }

    doorChime() {
      this.tone(660, 880, 0.14, 'sine', 0.18, 0);
      this.tone(880, 1320, 0.22, 'sine', 0.20, 0.12);
    }

    stopKhakiVoice(fadeDuration = 0.02) {
      if (this._activeKhakiVoiceSrc) {
        this.stopSound(this._activeKhakiVoiceSrc, fadeDuration);
        this._activeKhakiVoiceSrc = null;
      }
    }

    babuEnragedRoar(pan = 0.85) {
      return this.playBabuEnragedVoice(pan);
    }

    khakiEnragedRoar(pan = -0.85) {
      return this.playKhakiEnragedVoice(pan);
    }

    playKhakiEnragedVoice(pan = -0.85) {
      if (this.muted) return null;
      this.init();

      // Ensure no overlapping / voice clipping on Khaki
      this.stopKhakiVoice(0.02);

      const lines = this.khakiEnragedLines;
      const weights = this._khakiEnragedWeights;
      const last = this._khakiLastPlayedIdx;

      // Dynamic chance selection: calculate total weight of eligible lines
      let totalW = 0;
      for (let i = 0; i < weights.length; i++) {
        if (i !== last && weights[i] > 0) totalW += weights[i];
      }
      if (totalW <= 0) {
        for (let i = 0; i < weights.length; i++) weights[i] = (i === last) ? 0.0 : 1.0;
        totalW = weights.length - 1;
      }

      const r = Math.random() * totalW;
      let cum = 0;
      let chosenIdx = -1;
      for (let i = 0; i < weights.length; i++) {
        if (i === last || weights[i] <= 0) continue;
        cum += weights[i];
        if (r <= cum) {
          chosenIdx = i;
          break;
        }
      }
      if (chosenIdx === -1) {
        chosenIdx = (last + 1) % lines.length;
      }

      // Dynamic weight update: chosen drops to 0, other lines gradually increase
      for (let j = 0; j < weights.length; j++) {
        if (j !== chosenIdx) {
          weights[j] = Math.min(1.0, weights[j] + 0.35);
        }
      }
      weights[chosenIdx] = 0.0;
      this._khakiLastPlayedIdx = chosenIdx;

      const chosenLine = lines[chosenIdx];
      // Clean speech reproduction without artificial pitch detuning
      const src = this.playSample(chosenLine.key, pan, 1.65, 0.0);
      this._activeKhakiVoiceSrc = src;

      return chosenLine;
    }

    playKhakiDistantWhisper(pan = -0.55) {
      if (this.muted) return null;
      this.init();

      // Ensure no overlapping / voice clipping on Khaki
      this.stopKhakiVoice(0.02);

      const lines = this.khakiDistantLines;
      const weights = this._khakiDistantWeights;
      const last = this._khakiLastDistantIdx;

      let totalW = 0;
      for (let i = 0; i < weights.length; i++) {
        if (i !== last && weights[i] > 0) totalW += weights[i];
      }
      if (totalW <= 0) {
        for (let i = 0; i < weights.length; i++) weights[i] = (i === last) ? 0.0 : 1.0;
        totalW = weights.length - 1;
      }

      const r = Math.random() * totalW;
      let cum = 0;
      let chosenIdx = -1;
      for (let i = 0; i < weights.length; i++) {
        if (i === last || weights[i] <= 0) continue;
        cum += weights[i];
        if (r <= cum) {
          chosenIdx = i;
          break;
        }
      }
      if (chosenIdx === -1) {
        chosenIdx = (last + 1) % lines.length;
      }

      // Dynamic weight update: chosen drops to 0, other lines gradually recover (+0.50)
      for (let j = 0; j < weights.length; j++) {
        if (j !== chosenIdx) {
          weights[j] = Math.min(1.0, weights[j] + 0.50);
        }
      }
      weights[chosenIdx] = 0.0;
      this._khakiLastDistantIdx = chosenIdx;

      const chosenLine = lines[chosenIdx];
      // Keep volume low (0.30) so it sounds like an eerie, spine-chilling whisper in the background
      const src = this.playSample(chosenLine.key, pan, 0.30, 0.0);
      this._activeKhakiVoiceSrc = src;

      return chosenLine;
    }

    playBabuEnragedVoice(pan = 0.85) {
      if (this.muted) return null;
      this.init();

      // Ensure no overlapping / voice clipping on Babu
      this.stopBabuVoice(0.02);

      const lines = this.babuEnragedLines;
      const weights = this._babuEnragedWeights;
      const last = this._babuLastPlayedIdx;

      // Dynamic chance selection: calculate total weight of eligible lines
      let totalW = 0;
      for (let i = 0; i < weights.length; i++) {
        if (i !== last && weights[i] > 0) totalW += weights[i];
      }
      if (totalW <= 0) {
        for (let i = 0; i < weights.length; i++) weights[i] = (i === last) ? 0.0 : 1.0;
        totalW = weights.length - 1;
      }

      const r = Math.random() * totalW;
      let cum = 0;
      let chosenIdx = -1;
      for (let i = 0; i < weights.length; i++) {
        if (i === last || weights[i] <= 0) continue;
        cum += weights[i];
        if (r <= cum) {
          chosenIdx = i;
          break;
        }
      }
      if (chosenIdx === -1) {
        chosenIdx = (last + 1) % lines.length;
      }

      // Dynamic weight update: chosen drops to 0, other lines gradually increase
      for (let j = 0; j < weights.length; j++) {
        if (j !== chosenIdx) {
          weights[j] = Math.min(1.0, weights[j] + 0.35);
        }
      }
      weights[chosenIdx] = 0.0;
      this._babuLastPlayedIdx = chosenIdx;

      const chosenLine = lines[chosenIdx];
      // Clean speech reproduction without artificial pitch detuning
      const src = this.playSample(chosenLine.key, pan, 1.65, 0.0);
      this._activeBabuVoiceSrc = src;

      return chosenLine;
    }

    playBabuDistantWhisper(pan = 0.35) {
      if (this.muted) return null;
      this.init();

      // Ensure no overlapping / voice clipping on Babu
      this.stopBabuVoice(0.02);

      const lines = this.babuDistantLines;
      const weights = this._babuDistantWeights;
      const last = this._babuLastDistantIdx;

      let totalW = 0;
      for (let i = 0; i < weights.length; i++) {
        if (i !== last && weights[i] > 0) totalW += weights[i];
      }
      if (totalW <= 0) {
        for (let i = 0; i < weights.length; i++) weights[i] = (i === last) ? 0.0 : 1.0;
        totalW = weights.length - 1;
      }

      const r = Math.random() * totalW;
      let cum = 0;
      let chosenIdx = -1;
      for (let i = 0; i < weights.length; i++) {
        if (i === last || weights[i] <= 0) continue;
        cum += weights[i];
        if (r <= cum) {
          chosenIdx = i;
          break;
        }
      }
      if (chosenIdx === -1) {
        chosenIdx = (last + 1) % lines.length;
      }

      // Dynamic weight update: chosen drops to 0, other lines gradually recover (+0.50)
      for (let j = 0; j < weights.length; j++) {
        if (j !== chosenIdx) {
          weights[j] = Math.min(1.0, weights[j] + 0.50);
        }
      }
      weights[chosenIdx] = 0.0;
      this._babuLastDistantIdx = chosenIdx;

      const chosenLine = lines[chosenIdx];
      // Keep volume low (0.30) so it sounds like an eerie, spine-chilling whisper in the background
      const src = this.playSample(chosenLine.key, pan, 0.30, 0.0);
      this._activeBabuVoiceSrc = src;

      return chosenLine;
    }

    playBabuVpnSabotageVoice(pan = 0.20) {
      if (this.muted) return null;
      this.init();

      this.stopBabuVoice(0.02);

      const lines = this.babuVpnSabotageLines;
      const weights = this._babuVpnSabotageWeights;
      const last = this._babuLastVpnSabotageIdx;

      let totalW = 0;
      for (let i = 0; i < weights.length; i++) {
        if (i !== last && weights[i] > 0) totalW += weights[i];
      }
      if (totalW <= 0) {
        for (let i = 0; i < weights.length; i++) weights[i] = (i === last) ? 0.0 : 1.0;
        totalW = weights.length - 1;
      }

      const r = Math.random() * totalW;
      let cum = 0;
      let chosenIdx = -1;
      for (let i = 0; i < weights.length; i++) {
        if (i === last || weights[i] <= 0) continue;
        cum += weights[i];
        if (r <= cum) {
          chosenIdx = i;
          break;
        }
      }
      if (chosenIdx === -1) {
        chosenIdx = (last + 1) % lines.length;
      }

      for (let j = 0; j < weights.length; j++) {
        if (j !== chosenIdx) {
          weights[j] = Math.min(1.0, weights[j] + 0.50);
        }
      }
      weights[chosenIdx] = 0.0;
      this._babuLastVpnSabotageIdx = chosenIdx;

      const chosenLine = lines[chosenIdx];
      const src = this.playSample(chosenLine.key, pan, 1.25, 0.0);
      this._activeBabuVoiceSrc = src;

      return chosenLine;
    }

    radioSquelchCue(pan = -0.85) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // 1. Sharp Walkie-Talkie Chirp + Static RF Squelch Burst (*krrr-chk*) on Left Ear
      const t0 = this.ctx.currentTime;
      this.tone(1580, 1920, 0.045, 'sine', 0.09, 0, pan);

      const dur = 0.24;
      const bufSize = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2600;
      filter.Q.value = 3.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, t0 + 0.03);
      gain.gain.linearRampToValueAtTime(0.14, t0 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);

      let lastNode = gain;
      if (this.ctx.createStereoPanner && pan !== 0) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
        gain.connect(panner);
        lastNode = panner;
      }
      src.connect(filter);
      filter.connect(gain);
      lastNode.connect(this.getMasterNode());
      src.start(t0 + 0.03);

      // Tail click on walkie switch
      this.tone(960, 420, 0.03, 'square', 0.07, 0.22, pan);

      // Faint tactical gravel boot crunch
      setTimeout(() => {
        this.playSample('step_0', pan, 0.75, 0.08);
      }, 320);
    }

    glassTapCue(pan = 0.85) {
      if (this.muted) return;
      this.init();
      // Rhythmic tactile window tap on Right Glass
      [0, 0.18, 0.38].forEach((delay) => {
        this.playSample('window_bars', pan, 0.65, 0.04, delay);
      });
      // Loose stiff paper folder rustle
      setTimeout(() => {
        this.playSample('form_collected', pan, 0.70, 0.10);
      }, 500);
    }

    retreatSteps(pan = 0) {
      if (this.muted) return;
      // 3 Fading footsteps receding back into the shadows
      this.playSample('step_1', pan, 0.68, 0.05, 0);
      this.playSample('step_2', pan, 0.44, 0.05, 0.38);
      this.playSample('step_3', pan, 0.22, 0.05, 0.78);
    }

    chargeRush(panStart = -0.85, panEnd = -0.35, dur = 1.35) {
      if (this.muted) return;
      this.init();
      // Rapid sprint footsteps with dynamic stereo panning along the outside wall
      const steps = 4;
      for (let i = 0; i < steps; i++) {
        const fraction = i / (steps - 1);
        const pan = panStart + (panEnd - panStart) * fraction;
        const delay = i * (dur / steps);
        this.playSample('step_1', pan, 1.35, 0.08, delay);
      }
    }

    barRattle(pan = 0) {
      if (this.muted) return;
      // Real Iron Window Bars Rattling Furiously
      this.playSample('window_bars', pan, 1.45, 0.08);
    }

    footstep(pan = 0) {
      // Real Concrete/Tile Corridor Footsteps with organic alternating cycle
      this._stepCycle = ((this._stepCycle || 0) + 1) % 4;
      this.playSample(`step_${this._stepCycle}`, pan, 1.0, 0.06);
    }

    hammerStrike(pan = 0) {
      if (this.muted) return;
      // Real Metallic Hammer Impact on Iron Hinges
      this.playSample('hammer_strike', pan, 1.45, 0.08);
    }

    doorBlockedThud(pan = -0.92) {
      if (pan < 0) {
        // Real Heavy Fist Pounding on Iron Door (Khaki on Left)
        this.playSample('bang_door', Math.min(-0.85, pan), 1.75, 0.04);
      } else {
        // Real Heavy Fist Pounding on Wooden Window (Babu on Right)
        this.playSample('bang_window', Math.max(0.85, pan), 1.75, 0.04);
      }
    }

    getSampleDuration(name, playbackRate = 1.0) {
      const buf = this.sampleBuffers && this.sampleBuffers[name];
      if (!buf || !buf.duration) return 0;
      return buf.duration / Math.max(0.25, playbackRate || 1.0);
    }

    khakiDoorBang(pan = -0.92, playbackRate = 1.0) {
      // Smoothly fade out any previous bang tail so consecutive hits flow with zero pause or click
      if (this._activeKhakiDoorBangSrc) {
        this.stopSound(this._activeKhakiDoorBangSrc, 0.18);
      }
      const src = this.playSample('khaki_door_bang', pan, 1.75, 0.03, 0, false, 0.015, 0, 0, 0, 0, playbackRate);
      if (src) {
        this._activeKhakiDoorBangSrc = src;
        src.onended = () => {
          if (this._activeKhakiDoorBangSrc === src) {
            this._activeKhakiDoorBangSrc = null;
          }
        };
      }
      return src;
    }

    babuDoorBang(pan = 0.92, playbackRate = 1.0) {
      // Smoothly fade out any previous bang tail so consecutive hits flow with zero pause or click
      if (this._activeBabuDoorBangSrc) {
        this.stopSound(this._activeBabuDoorBangSrc, 0.18);
      }
      const src = this.playSample('babu_door_bang', pan, 1.75, 0.03, 0, false, 0.015, 0, 0, 0, 0, playbackRate);
      if (src) {
        this._activeBabuDoorBangSrc = src;
        src.onended = () => {
          if (this._activeBabuDoorBangSrc === src) {
            this._activeBabuDoorBangSrc = null;
          }
        };
      }
      return src;
    }

    stopDoorBanging(target = 'all') {
      if (target === 'all' || target === 'khaki') {
        if (this._activeKhakiDoorBangSrc) {
          this.stopSound(this._activeKhakiDoorBangSrc, 0.15);
          this._activeKhakiDoorBangSrc = null;
        }
      }
      if (target === 'all' || target === 'babu') {
        if (this._activeBabuDoorBangSrc) {
          this.stopSound(this._activeBabuDoorBangSrc, 0.15);
          this._activeBabuDoorBangSrc = null;
        }
      }
    }

    stopBabuVoice(fadeDuration = 0.02) {
      if (this._activeBabuVoiceSrc) {
        this.stopSound(this._activeBabuVoiceSrc, fadeDuration);
        this._activeBabuVoiceSrc = null;
      }
    }

    denied() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      this.tone(140, 90, 0.14, 'sawtooth', 0.28, 0.01, 0);
      this.noiseBurst(0.08, 0.06, 1200, 0);
    }

    updateCamAmbient(cctvOpen, camIdx) {
      if (!cctvOpen || this.muted) {
        this.stopCamAmbient(0.85);
        return;
      }
      if (camIdx === 0) {
        // CAM 01: Outside Car Parking & Gate Atmosphere
        if (this._currentCamAmbKey !== 'cam_1_parking') {
          this.stopCamAmbient(0.85);
          this._camAmbSrc = this.playSample('cam_1_parking', 0, 0.45, 0, 0, true, 0.45);
          this._currentCamAmbKey = 'cam_1_parking';
        }
      } else if (camIdx === 2) {
        // CAM 03: Veranda Water Droplets Ambience
        if (this._currentCamAmbKey !== 'cam_3_droplets') {
          this.stopCamAmbient(0.85);
          this._camAmbSrc = this.playSample('cam_3_droplets', 0, 0.40, 0, 0, true, 0.45);
          this._currentCamAmbKey = 'cam_3_droplets';
        }
      } else if (camIdx === 3) {
        // Phase 3: CAM 04 Staff Room Rhythmic Rotating Ceiling Fan & Motor Hum
        if (this._currentCamAmbKey !== 'cam_4_staff') {
          this.stopCamAmbient(0.85);
          this._camAmbSrc = this.playSample('cam_4_staff', 0, 0.48, 0, 0, true, 0.45) || this.startStaffFanAmbience();
          this._currentCamAmbKey = 'cam_4_staff';
        }
      } else if (camIdx === 7) {
        // Phase 3: CAM 08 Headmaster Office Antique Heavy Pendulum Clock Tick-Tock
        if (this._currentCamAmbKey !== 'cam_8_headmaster') {
          this.stopCamAmbient(0.85);
          this._camAmbSrc = this.playSample('cam_8_headmaster', 0, 0.52, 0, 0, true, 0.45) || this.startHeadmasterClockAmbience();
          this._currentCamAmbKey = 'cam_8_headmaster';
        }
      } else {
        // Shifting away to any other camera: slowly fade away
        this.stopCamAmbient(0.85);
      }
    }

    stopCamAmbient(fadeDuration = 0.85) {
      if (this._camAmbSrc) {
        const oldSrc = this._camAmbSrc;
        this._camAmbSrc = null;
        this.stopSound(oldSrc, fadeDuration);
      }
      this._currentCamAmbKey = null;
    }

    speakQueuedMonsterLine({
      phrase,
      pan = -0.8,
      stage = 0,
      isBackground = true,
      delayMs = 380,
      onStart = null
    }) {
      return; // All monster voicelines and dialogue completely removed per user request
    }

    corridorTaunt(pan = -0.75, phrase = '', stage = 0, onStart = null) {
      return false; // All monster taunts disabled
    }

    knockAndYell(pan = -0.8, phrase = '', stage = 0, onStart = null) {
      if (this.muted) return;
      // 3 heavy door/window knocks (THUD! THUD! THUD!)
      this.doorBlockedThud(pan);
      // Monster voice lines completely removed
    }

    // Dynamic Khaki Audio Cue Engine with organic chance and anti-repeat weighting
    triggerKhakiDynamicCue(category, level = 1, options = {}) {
      if (category === 'distant' || category === 'camera_whisper') {
        return this.playKhakiDistantWhisper(options.pan ?? -0.55);
      }
      return null;
    }

    // Dynamic Babu Audio Cue Engine with organic chance and anti-repeat weighting
    triggerBabuDynamicCue(category, level = 1, options = {}) {
      if (category === 'vpn_sabotage') {
        return this.playBabuVpnSabotageVoice(options.pan ?? 0.20);
      }
      if (category === 'distant' || category === 'camera_whisper') {
        return this.playBabuDistantWhisper(options.pan ?? 0.35);
      }
      return null;
    }

    sharkAlert() {
      // Analog Telecom Disconnect / VPN Trip: Abrupt carrier drop + iconic ITU Special Information Tone (SIT) triple disconnect chirp (950Hz -> 1400Hz -> 1800Hz)
      this.playSample('vpn_trip', 0, 1.45, 0.03);
    }

    vpnReconnect() {
      // Analog Telecom Reconnect: Speed-dial DTMF tones (940Hz/1330Hz/1480Hz) + high modem answer carrier handshake (1650Hz->1890Hz)
      this.playSample('vpn_reconnect', 0, 1.45, 0.03);
    }

    sharkYank() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime;
      // 1. Tactile Wire Snap & Rubber Release
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(680, t0);
      snapOsc.frequency.exponentialRampToValueAtTime(180, t0 + 0.12);
      snapGain.gain.setValueAtTime(0.35, t0);
      snapGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
      snapOsc.connect(snapGain);
      snapGain.connect(this.getMasterNode());
      snapOsc.start(t0);
      snapOsc.stop(t0 + 0.13);

      // 2. High Comic Shark Squeak / Pop
      const squeakOsc = this.ctx.createOscillator();
      const squeakGain = this.ctx.createGain();
      squeakOsc.type = 'sine';
      squeakOsc.frequency.setValueAtTime(1150, t0 + 0.02);
      squeakOsc.frequency.exponentialRampToValueAtTime(840, t0 + 0.16);
      squeakGain.gain.setValueAtTime(0.001, t0 + 0.02);
      squeakGain.gain.linearRampToValueAtTime(0.22, t0 + 0.04);
      squeakGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
      squeakOsc.connect(squeakGain);
      squeakGain.connect(this.getMasterNode());
      squeakOsc.start(t0 + 0.02);
      squeakOsc.stop(t0 + 0.17);

      // 3. Electric Spark Burst
      this.noiseBurst(0.06, 0.08, 3800, 0);
    }

    sharkClear() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const tn = t0 + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, tn);
        g.gain.setValueAtTime(0.001, tn);
        g.gain.linearRampToValueAtTime(0.25, tn + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, tn + 0.22);
        osc.connect(g);
        g.connect(this.getMasterNode());
        osc.start(tn);
        osc.stop(tn + 0.23);
      });
      setTimeout(() => this.vpnReconnect(), 320);
    }

    powerDown() {
      this.stopAmbience();
      this.tone(320, 42, 1.4, 'sawtooth', 0.22, 0);
    }

    // =========================================================================
    //  ORGANIC CREEPY ATMOSPHERIC DIRECTOR & GHOSTLY LAUGHTER / GIGGLES
    // (100% Organic, Acoustic & Visceral Foley — ZERO Electronic Synths / Beeps)
    // =========================================================================

    // 1. Ghostly Child Giggling down the dark school corridor
    creepySchoolGiggle(pan = 0.0) {
      if (this.muted) return;
      this.init();
      const p = pan || (Math.random() < 0.5 ? -0.65 : 0.65);
      this.playSample('creepy_giggle', p, 0.9, 0.04);
    }

    // 2. Babu's Sinister Bureaucratic Chuckle / Snicker
    babuSinisterChuckle(pan = 0.8) {
      // Monster voicelines completely removed
      return;
    }

    // 3. Khaki's Deep Guttural Operative Laugh / Mocking Chortle
    khakiGutturalLaugh(pan = -0.8) {
      // Monster voicelines completely removed
      return;
    }

    // 4. Ghostly Hallway Whispers in the Midnight Silence
    creepyWhisperTaunt(pan = 0.0) {
      // Monster voice taunts completely removed
      return;
    }

    // 5. Heavy Furniture Drag on Concrete Floor
    creepyScrape(pan = -0.4) {
      if (this.muted) return;
      this.init();
      this.playSample('window_bars', pan, 0.85, 0.04);
    }

    // 6. Sudden Heavy Thud in Empty Classroom
    creepyThud(pan = 0.4) {
      if (this.muted) return;
      this.init();
      const stepIdx = Math.floor(Math.random() * 4);
      this.playSample('step_' + stepIdx, pan, 1.25, 0.02);
    }

    // 7. Cold Midnight Wind Gust through Veranda Corrugations
    creepyWindGust() {
      if (this.muted) return;
      this.init();
      this.playSample('amb_wind_0', -0.2, 1.05, 0.05);
    }

    // 8. Creaking Wooden Floorboards / Stairs
    creepyStairsCreak(pan = -0.5) {
      if (this.muted) return;
      this.init();
      const pick = Math.random() < 0.5 ? 'amb_creak_0' : 'amb_creak_1';
      this.playSample(pick, pan, 1.15, 0.04);
    }

    // 9. Antique Pendulum Clock Hollow Tick-Tock
    creepyClockTick() {
      if (this.muted) return;
      this.init();
      this.playSample('clock_ticking', 0.25, 1.1, 0.02);
    }

    // 10. Stray Dogs Howling Outside
    creepyDistantDog() {
      if (this.muted) return;
      this.init();
      this.playSample('distant_dog', -0.65, 0.85, 0.05);
    }

    // 11. Cold Breath / Draft Whoosh
    creepyColdBreath(pan = 0.0) {
      if (this.muted) return;
      this.init();
      this.playSample('babu_breath', pan, 1.05, 0.04);
    }

    playRandomCreepySound(intensity = 1.0) {
      if (this.muted) return;
      const choices = [
        () => this.creepyScrape((Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.5)),
        () => this.creepyThud((Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.5)),
        () => this.creepyWindGust(),
        () => this.creepyStairsCreak(-0.6),
        () => this.creepyClockTick(),
        () => this.creepyDistantDog(),
        () => this.creepyColdBreath(Math.random() * 0.6 - 0.3)
      ];
      const fn = choices[Math.floor(Math.random() * choices.length)];
      try { fn(); } catch (_) {}
    }

    // =========================================================================
    //  TACTICAL SOUND HINTS FOR MONSTER ACTIVITY (100% ACOUSTIC & PHYSICAL)
    // =========================================================================

    // --- KHAKI (AGENCY GUY / LEFT SIDE / MILITARY) ---

    khakiGateRattle() {
      if (this.muted) return;
      this.init();
      this.playSample('window_bars', -0.5, 1.25, 0.04);
    }

    khakiHeavyBoot(pan = -0.85) {
      if (this.muted) return;
      this.init();
      const stepIdx = Math.floor(Math.random() * 4);
      this.playSample('step_' + stepIdx, pan, 1.35, 0.03);
    }

    khakiLurkWarning() {
      if (this.muted) return;
      this.init();
      this.playSample('amb_creak_0', -0.85, 0.9, 0.04);
    }

    khakiDoorCreakWarning() {
      if (this.muted) return;
      this.init();
      this.playSample('door_open', -0.88, 1.15, 0.04);
    }

    khakiRetreatCues() {
      if (this.muted) return;
      this.init();
      // Monster voicelines completely removed - physical footsteps only
      this.retreatSteps(-0.85);
    }

    // --- SABOTAGE & POWER ROOM FOLEY ---
    breakerSnap(pan = -0.6) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // Heavy mechanical iron knife switch snap / fuse box clunk
      this.playSample('shutter_latch', pan, 0.9, 0.08);
      this.tone(160, 42, 0.12, 'square', 0.22, 0.02, pan);
      // Sharp blue electrical arc spark burst
      this.noiseBurst(0.08, 0.22, 3400, pan);
    }

    powerSabotageSpark(pan = -0.6) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // Staccato crackling arc sparks from pulled generator fuses
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (!this.muted && this.ctx) {
            this.noiseBurst(0.04 + Math.random() * 0.05, 0.18, 2200 + Math.random() * 1800, pan);
            this.tone(280 + Math.random() * 120, 80, 0.05, 'sawtooth', 0.12, 0, pan);
          }
        }, i * 75);
      }
    }

    // --- BABU (CIVIL SERVANT / RIGHT SIDE / BUREAUCRATIC) ---

    babuPaperShuffle(pan = 0.8) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // Fast, nervous shuffling of official Manila file folders & carbon papers in Staff Room / Lab
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!this.muted && this.ctx) {
            this.playSample('form_collected', pan, 0.75, 0.10);
            this.noiseBurst(0.08, 0.07, 1800 + i * 150, pan);
          }
        }, i * 105);
      }
    }

    babuSqueakFootsteps(pan = 0.8) {
      if (this.muted) return;
      this.init();
      this.playSample('step_1', pan, 1.25, 0.05);
      setTimeout(() => {
        if (!this.muted && this.ctx) {
          this.playSample('step_2', pan, 1.1, 0.05);
        }
      }, 175);
    }

    babuStampClick(pan = 0.75) {
      if (this.muted) return;
      this.init();
      this.playSample('stamp_thud', pan, 1.15, 0.03);
      this.playSample('form_collected', pan, 0.65, 0.08);
    }

    babuWindowTapWarning() {
      if (this.muted) return;
      this.init();
      this.glassTapCue(0.85);
      this.playSample('window_bars', 0.85, 0.85, 0.08, 0.45);
    }

    babuWindowRattleWarning() {
      if (this.muted) return;
      this.init();
      this.playSample('window_bars', 0.88, 1.6, 0.05);
    }

    babuRetreatCues() {
      if (this.muted) return;
      this.init();
      // Monster voicelines completely removed - physical footsteps only
      this.retreatSteps(0.85);
    }

    // --- DIRECTIONAL PROXIMITY LURK AUDIO (PHYSICAL ACOUSTIC ONLY - NO VOICELINES) ---
    playBabuLurkAudio(pan = 0.85) {
      if (this.muted) return;
      this.init();
      // Physical acoustic sounds only: window iron bar strain, floor creaks, or faint cold draft
      const choices = ['window_bars', 'amb_creak_1', 'step_2'];
      const pick = choices[Math.floor(Math.random() * choices.length)];
      this.playSample(pick, pan, 0.65, 0.04);
    }

    playKhakiLurkAudio(pan = -0.85) {
      if (this.muted) return;
      this.init();
      // Physical acoustic sounds only: heavy doorframe creaks or floorboard scuffs
      const choices = ['amb_creak_0', 'amb_creak_1', 'step_0', 'step_1'];
      const pick = choices[Math.floor(Math.random() * choices.length)];
      this.playSample(pick, pan, 0.65, 0.04);
    }

    // --- PROXIMITY HEARTBEAT LOOP ---
    startHeartbeatLoop(pan = 0, vol = 0.85) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      if (this.heartbeatLoopNode) {
        if (this.heartbeatLoopNode.gainNode) {
          try {
            this.heartbeatLoopNode.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
            this.heartbeatLoopNode.gainNode.gain.setValueAtTime(Math.max(0.01, vol), this.ctx.currentTime);
          } catch (_) {}
        }
        return;
      }
      this.heartbeatLoopNode = this.playSample('heartbeat', pan, vol, 0, 0, true, 0.25);
    }

    stopHeartbeatLoop(fadeDuration = 0.35) {
      if (this.heartbeatLoopNode) {
        this.stopSound(this.heartbeatLoopNode, fadeDuration);
        this.heartbeatLoopNode = null;
      }
    }

    stopHeartbeat() {
      this.stopHeartbeatLoop(0.15);
    }

    pulseHeartbeat(pan = 0, intensity = 0.5) {
      if (this.muted) return;
      this.init();
      const vol = Math.max(0.2, Math.min(1.5, intensity * 1.35));
      this.startHeartbeatLoop(pan, vol);
    }

    // =========================================================================
    //  OVERHAULED 100% ORGANIC HORROR JUMPSCARE (NO Electronic Synths or Sirens)
    // =========================================================================

    jumpscare(attacker = 'gullu') {
      this.stopAmbience();
      this.stopPhoneGuy();
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;

      const t0 = this.ctx.currentTime;
      const isWhitener = (attacker === 'whitener');
      const isVigo = (attacker === 'vigo' || attacker === 'chowkidar' || attacker === 'dala' || attacker === 'DALA');

      if (isVigo) {
        // -------------------------------------------------------------
        // VIGO (KAALA DALA) CLASSROOM SMASH JUMPSCARE AUDIO
        // 1. Roaring V8 Turbo-Diesel Engine Surge & Tire Skid Screech
        // -------------------------------------------------------------
        this.tone(48, 168, 0.36, 'sawtooth', 0.90, 0.0, 0);
        this.tone(168, 86, 1.45, 'sawtooth', 0.78, 0.34, 0);
        this.tone(96, 195, 0.85, 'triangle', 0.65, 0.08, 0);
        // Tire skid screech before and during crash
        this.tone(1380, 920, 0.38, 'sine', 0.42, 0.02, -0.35);
        this.tone(1460, 880, 0.42, 'triangle', 0.38, 0.04, 0.35);
        this.noiseBurst(0.45, 0.65, 1650, 0);

        // 2. Massive Wall, Iron Door & Glass Demolition Crash Impact
        this.noiseBurst(0.52, 1.0, 520, 0);
        this.noiseBurst(0.38, 0.92, 2600, 0);
        this.playSample('jumpscare_screech', 0, 2.2);
        [0.0, 0.14, 0.32, 0.54].forEach((delay, idx) => {
          this.tone(145 - idx * 20, 16, 0.45, 'sine', 0.95, delay, 0);
          this.playSample('bang_door', idx % 2 === 0 ? -0.4 : 0.4, 1.5, 0.04, delay);
          this.playSample('window_bars', idx % 2 === 0 ? 0.5 : -0.5, 1.45, 0.05, delay + 0.03);
        });

        // 3. Blaring Dual-Tone Vigo Truck Horn + Police Siren Wail + Horror Chord
        [0.12, 0.58].forEach((hDelay) => {
          this.tone(311.13, 308.0, 0.38, 'sawtooth', 0.58, hDelay, -0.2);
          this.tone(392.00, 388.0, 0.38, 'sawtooth', 0.58, hDelay, 0.2);
          this.tone(155.56, 154.0, 0.40, 'triangle', 0.65, hDelay, 0);
        });
        // Police siren wail sweep
        this.tone(620, 1240, 0.48, 'triangle', 0.42, 0.18, -0.5);
        this.tone(1240, 640, 0.52, 'triangle', 0.42, 0.66, 0.5);
        this.tone(640, 1180, 0.48, 'triangle', 0.36, 1.18, -0.4);


      } else {
        // -------------------------------------------------------------
        // PHASE 1: EXPLOSIVE PHYSICAL BREACH IMPACT & SUB-BASS SHOCKWAVE (t = 0.0s)
        // -------------------------------------------------------------
        // 1. Violent High-Gain Wood/Glass Fracture (Acoustic physical debris blast)
        this.noiseBurst(0.35, 0.95, isWhitener ? 2200 : 750, 0);

        // 2. Deafening Sub-Bass Chest Impact Shockwave (135Hz -> 18Hz drop with heavy power)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(135, t0);
        subOsc.frequency.exponentialRampToValueAtTime(18, t0 + 0.85);
        subGain.gain.setValueAtTime(1.0, t0);
        subGain.gain.exponentialRampToValueAtTime(0.005, t0 + 0.90);
        subOsc.connect(subGain);
        subGain.connect(this.getMasterNode());
        subOsc.start(t0);
        subOsc.stop(t0 + 0.92);

        // -------------------------------------------------------------
        // PHASE 2: VISCERAL ORGANIC ROARS, PSYCHOTIC LAUGHS & STAMP SLAMS (t = 0.05s - 1.25s)
        // -------------------------------------------------------------
        if (isWhitener) {
          // BABU: DEEPENED GUTTURAL MONSTROUS ROAR + LOW-END SUB RESONANCE (Clean, plain jumpscare)
          // Pitched down significantly (playbackRate: 0.76, baseDetune: -450 cents) for a deep, terrifying, heavy scream
          this.playSample('jumpscare_babu', 0, 2.6, 0.02, 0, false, 0, 0, 0, 0, -450, 0.76);

          // Deep guttural chest vibration layer
          this.tone(95, 48, 1.45, 'sawtooth', 0.45, 0.02, 0);
          this.noiseBurst(0.40, 0.28, 480, 0);
          // Rubber stamp sounds and whitener thuds removed per user request
        } else {
          // KHAKI: GUTTURAL OPERATIVE ROAR + HEAVY DOOR TEARING & MOCKING GROWL
          this.playSample('jumpscare_screech', 0, 2.4);



          // Heavy Iron Door Frame Breaking & Dense Physical Impacts
          [0.08, 0.32, 0.65].forEach((delay, idx) => {
            this.tone(85 - idx * 10, 22, 0.35, 'sine', 0.85, delay, 0);
            this.playSample('bang_door', -0.3, 1.4, 0.05, delay);
          });
        }
      }

      // -------------------------------------------------------------
      // PHASE 3: CONCUSSION TINNITUS, DYING HEARTBEAT & SUDDEN SILENCE (t = 1.25s - 3.10s)
      // -------------------------------------------------------------
      // 1. Natural Physiological Concussion Tinnitus Ring (pure 4180Hz sine wave)
      try {
        const tinOsc = this.ctx.createOscillator();
        const tinGain = this.ctx.createGain();
        tinOsc.type = 'sine';
        tinOsc.frequency.setValueAtTime(4180, t0 + 1.20);
        tinGain.gain.setValueAtTime(0.001, t0 + 1.20);
        tinGain.gain.linearRampToValueAtTime(0.16, t0 + 1.45);
        tinGain.gain.exponentialRampToValueAtTime(0.001, t0 + 2.85);
        tinOsc.connect(tinGain);
        tinGain.connect(this.getMasterNode());
        tinOsc.start(t0 + 1.20);
        tinOsc.stop(t0 + 2.90);
      } catch (_) {}

      // 2. Three Dying Physical Heartbeat Pulses (Slowing down in physical trauma)
      [1.35, 1.95, 2.55].forEach((beatDelay, idx) => {
        const beatGain = 0.75 - idx * 0.16;
        this.playSample('heartbeat', 0, beatGain, 0.02, beatDelay);
      });

      // 3. Faint dying breath gasp into Complete Deafening Silence at 2.85s!
      setTimeout(() => {
        if (!this.muted && this.ctx) {
          this.noiseBurst(0.25, 0.12, 600, 0);
        }
      }, 2650);
    }
    stampThud() {
      // Real recorded rubber stamp inkpad impact on official document
      this.playSample('stamp_thud', 0, 1.4, 0.02);
      this.playSample('form_collected', 0, 0.70, 0.08);
    }
    fajrDawnCutscene() {
      this.stopAmbience();
      this.stopPhoneGuy();
      // Authentic reverberant morning Fajr Azan call from masjid speaker
      this.playSample('fajr_azan', 0, 1.35, 0.02);
    }

    victoryChime() {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((f, i) => {
        this.tone(f, f * 1.002, 0.65, 'triangle', 0.18, i * 0.20);
      });
    }

    tone(f1, f2, dur, type = 'sine', gainVal = 0.12, delay = 0, pan = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f1, t0);
      if (f2 !== f1) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, f2), t0 + dur);
      }
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.linearRampToValueAtTime(gainVal, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      osc.connect(gain);
      if (this.ctx.createStereoPanner && pan !== 0) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), t0);
        gain.connect(panner);
        panner.connect(this.getMasterNode());
      } else {
        gain.connect(this.getMasterNode());
      }
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    }

    // =========================================================================
    //  10-SECOND POWER SABOTAGE EMERGENCY ALARM & WIRE PUZZLE AUDIO
    // =========================================================================
    startEmergencyAlarm() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      this.stopEmergencyAlarm();
      // Authentic recorded Khaki Sabotage Siren loop
      this.sabotageSirenSrc = this.playSample('khaki_sabotage_siren', 0, 0.65, 0, 0, true);
    }

    stopEmergencyAlarm() {
      if (this.sabotageSirenSrc) {
        const oldSiren = this.sabotageSirenSrc;
        this.sabotageSirenSrc = null;
        this.stopSound(oldSiren, 0.05);
      }
      if (this._emergencyAlarmTimer) {
        clearInterval(this._emergencyAlarmTimer);
        this._emergencyAlarmTimer = null;
      }
    }

    emergencyCountdownBeep(secondsLeft) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const isUrgent = secondsLeft <= 3.2;
      const freq = isUrgent ? 1150 : 820;
      this.tone(freq, freq * 0.98, isUrgent ? 0.08 : 0.12, 'sine', isUrgent ? 0.35 : 0.22, 0.01, 0);
      if (isUrgent) {
        setTimeout(() => {
          if (!this.muted && this.ctx) {
            this.tone(freq * 1.15, freq, 0.08, 'sine', 0.35, 0.01, 0);
          }
        }, 110);
      }
    }

    wirePickup() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      this.tone(740, 620, 0.06, 'triangle', 0.18, 0.01, 0);
    }

    wireSnap() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // High-voltage terminal snap & metallic connection click
      this.tone(1400, 480, 0.08, 'square', 0.28, 0.01, 0);
      this.noiseBurst(0.06, 0.22, 3800, 0);
      this.tone(220, 95, 0.14, 'triangle', 0.25, 0.02, 0);
    }

    wireBuzz() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // Raspy 120Hz line-frequency fault buzz
      this.tone(120, 118, 0.22, 'sawtooth', 0.32, 0.01, 0);
      this.noiseBurst(0.08, 0.15, 1200, 0);
    }

    tubeFlickerBuzz(pan = 0) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // 50Hz mains hum buzz + choke sizzle of dying Pakistani government school fluorescent tube
      try {
        this.tone(105, 55, 0.08, 'sawtooth', 0.12, 0.01, pan);
        this.noiseBurst(0.06, 0.08, 2200, pan);
      } catch (_) {}
    }

    wirePuzzleComplete() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      this.stopEmergencyAlarm();
      // 1. Heavy industrial contactor solenoid slam
      this.playSample('shutter_latch', 0, 1.0, 0.25);
      this.tone(180, 45, 0.25, 'square', 0.38, 0.02, 0);
      this.noiseBurst(0.15, 0.35, 2400, 0);
      // 2. Rising generator power-up sweep
      setTimeout(() => {
        if (!this.muted && this.ctx) {
          this.tone(90, 420, 0.95, 'sawtooth', 0.30, 0.05, 0);
          // 3. Melodic positive completion chime
          [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            setTimeout(() => {
              if (!this.muted && this.ctx) {
                this.tone(f, f, 0.35, 'sine', 0.24, 0.01, 0);
              }
            }, idx * 90);
          });
        }
      }, 150);
    }

// Phase 3 Procedural Fallback: CAM 04 Staff Room Ceiling Fan Ambience
    startStaffFanAmbience() {
      if (this.muted) return null;
      this.init();
      const node = this.playSample('fan_ambience', 0, 0.40, 0, 0, true, 0.6);
      return {
        gainNode: node && node.gainNode ? node.gainNode : null,
        stop: () => {
          if (node) this.stopSound(node, 0.5);
        }
      };
    }

    // Phase 3 Procedural Fallback: CAM 08 Headmaster Antique Clock Tick-Tock
    startHeadmasterClockAmbience() {
      if (this.muted || !this.ctx) return null;
      try {
        let tickState = 0;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.connect(this.getMasterNode());
        
        const timerId = setInterval(() => {
          if (this.muted || !this.ctx || this._currentCamAmbKey !== 'cam_8_headmaster') {
            clearInterval(timerId);
            return;
          }
          try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const clickGain = this.ctx.createGain();
            const isTick = (tickState++ % 2 === 0);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(isTick ? 1420 : 980, now);
            osc.frequency.exponentialRampToValueAtTime(isTick ? 340 : 260, now + 0.08);
            
            clickGain.gain.setValueAtTime(0.45, now);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
            
            osc.connect(clickGain);
            clickGain.connect(gain);
            osc.start(now);
            osc.stop(now + 0.095);
          } catch (_) {}
        }, 1000);
        
        return {
          gainNode: gain,
          stop: () => {
            clearInterval(timerId);
            try {
              gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
            } catch (_) {}
          }
        };
      } catch (_) { return null; }
    }
  }

  root.GameAudio = new FnafAudio();
  try {
    root.GameAudio.preloadIntroCall();
  } catch (e) {}

    })(window);
