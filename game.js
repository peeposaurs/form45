// Ultimate FNAF Gameplay Engine for Paanch Ghantay at NA-47
(function() {
  'use strict';

  const canvas = document.getElementById('game-canvas');
  const hud = document.getElementById('hud');
  const cctvFilter = document.getElementById('cctv-filter');
  const cctvTimestamp = document.getElementById('cctv-timestamp');
  const cctvStatic = document.getElementById('cctv-static');
  const staticNoiseCanvas = document.getElementById('cctv-noise-canvas');
  let staticNoiseCtx = null;
  const staticNoiseFrames = [];
  const fullStaticFrames = [];
  let staticNoiseFrameIdx = 0;
  let staticNoiseTimer = 0;
  let cctvFullStaticTimer = 0;
  let cctvFullStaticDuration = 0;
  let cctvFullStaticFade = 0.10;
  let cctvFullStaticPeakOp = 0.80;

  if (staticNoiseCanvas) {
    staticNoiseCtx = staticNoiseCanvas.getContext('2d');
    const nw = staticNoiseCanvas.width;
    const nh = staticNoiseCanvas.height;

    // 1. Normal ambient camera static frames (subtle transparent phosphor noise)
    for (let f = 0; f < 8; f++) {
      const imgData = staticNoiseCtx.createImageData(nw, nh);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.random();
        if (r > 0.78) {
          const v = 180 + ((Math.random() * 75) | 0);
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = (Math.random() * 150 + 60) | 0;
        } else if (r < 0.22) {
          d[i] = 0;
          d[i + 1] = 0;
          d[i + 2] = 0;
          d[i + 3] = (Math.random() * 170 + 70) | 0;
        } else {
          const v = (Math.random() * 100 + 15) | 0;
          d[i] = v;
          d[i + 1] = (v * 1.08) | 0;
          d[i + 2] = v;
          d[i + 3] = (Math.random() * 70 + 20) | 0;
        }
      }
      staticNoiseFrames.push(imgData);
    }

    // 2. FULL STATIC FRAMES: 100% Solid Opaque Blizzard Snow (Authentic FNAF Camera Switch Static)
    for (let f = 0; f < 12; f++) {
      const imgData = staticNoiseCtx.createImageData(nw, nh);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = Math.random();
        let v;
        if (r > 0.65) {
          v = 200 + ((Math.random() * 55) | 0); // bright white
        } else if (r < 0.28) {
          v = (Math.random() * 40) | 0; // pitch black
        } else {
          v = 60 + ((Math.random() * 120) | 0); // mid grey
        }
        d[i] = v;
        d[i + 1] = (v * 1.02) | 0;
        d[i + 2] = v;
        d[i + 3] = 255; // 100% SOLID OPAQUE PIXELS
      }

      // Add horizontal sync tracking glitch tears across the full static frame
      const barCount = (Math.random() * 4 + 3) | 0;
      for (let b = 0; b < barCount; b++) {
        const startY = (Math.random() * (nh - 8)) | 0;
        const barH = (Math.random() * 6 + 2) | 0;
        const barColor = Math.random() < 0.5 ? 255 : 0;
        for (let y = startY; y < startY + barH && y < nh; y++) {
          for (let x = 0; x < nw; x++) {
            const idx = (y * nw + x) * 4;
            d[idx] = barColor;
            d[idx + 1] = barColor;
            d[idx + 2] = barColor;
            d[idx + 3] = 255;
          }
        }
      }
      fullStaticFrames.push(imgData);
    }
  }

  function calculateDynamicCamLoad(targetCamIdx) {
    const gLoc = (typeof khakiActive !== 'undefined' && khakiActive && typeof GULLU_PATH !== 'undefined' && typeof gulluStep !== 'undefined') ? GULLU_PATH[gulluStep] : -1;
    const wLoc = (typeof babuActive !== 'undefined' && babuActive && typeof WHITENER_PATH !== 'undefined' && typeof whitenerStep !== 'undefined') ? WHITENER_PATH[whitenerStep] : -1;
    const isMonsterHere = (targetCamIdx === gLoc || targetCamIdx === wLoc ||
      (targetCamIdx === 4 && (gLoc === ZONE_KHAKI_PEEK || gLoc === ZONE_KHAKI_DOOR)) ||
      (targetCamIdx === 5 && (wLoc === ZONE_BABU_PEEK || wLoc === ZONE_BABU_WINDOW)));

    const r = Math.random();
    let duration = 0.28;
    let fadeTime = 0.10;
    let opacity = 0.75;

    // 1. Organic distribution (sometimes fast & light, sometimes standard, sometimes longer & heavier):
    if (r < 0.30) {
      // Fast snappy lock: shorter duration (0.10s - 0.18s) and lighter, clear static (0.48 - 0.64)
      duration = 0.10 + Math.random() * 0.08;
      fadeTime = 0.06 + Math.random() * 0.03;
      opacity = 0.48 + Math.random() * 0.16;
    } else if (r < 0.72) {
      // Standard analog channel sync: medium duration (0.22s - 0.34s) and standard static (0.68 - 0.82)
      duration = 0.22 + Math.random() * 0.12;
      fadeTime = 0.08 + Math.random() * 0.04;
      opacity = 0.68 + Math.random() * 0.14;
    } else {
      // Stubborn signal tuning: longer duration (0.44s - 0.68s) and thick heavy blizzard static (0.82 - 0.94)
      duration = 0.44 + Math.random() * 0.24;
      fadeTime = 0.12 + Math.random() * 0.06;
      opacity = 0.82 + Math.random() * 0.12;
    }

    // 2. Physical cable length / environmental interference:
    // Outer perimeter cameras (CAM 01 Gate & Parking, CAM 07 Boundary)
    if (targetCamIdx === 0 || targetCamIdx === 6) {
      if (Math.random() < 0.45) {
        duration += 0.10 + Math.random() * 0.16;
        opacity = Math.min(0.94, opacity + 0.08 + Math.random() * 0.06);
      }
    }

    // Generator power cut or shark network attack interference:
    if (targetCamIdx === 9 && typeof isSharkAttackActive !== 'undefined' && isSharkAttackActive) {
      duration += 0.16 + Math.random() * 0.20;
      opacity = Math.min(0.95, opacity + 0.12);
    }
    if (targetCamIdx === 8 && typeof isPowerSabotaged !== 'undefined' && isPowerSabotaged) {
      duration += 0.18 + Math.random() * 0.22;
      opacity = Math.min(0.95, opacity + 0.12);
    }

    // 3. Intruder Lurking Interference (FNAF atmospheric radio static):
    if (isMonsterHere) {
      duration += 0.14 + Math.random() * 0.18;
      opacity = Math.min(0.95, opacity + 0.10 + Math.random() * 0.08);
    }

    opacity = Math.max(0.45, Math.min(0.95, opacity));

    return { duration, fadeTime, opacity, isLong: duration > 0.38, isMonsterHere };
  }

  function triggerFullStatic(duration = 0.28, fadeTime = 0.10, peakOp = 0.80) {
    cctvFullStaticTimer = duration + fadeTime;
    cctvFullStaticDuration = duration;
    cctvFullStaticFade = fadeTime;
    cctvFullStaticPeakOp = peakOp;
    if (staticNoiseCanvas) {
      staticNoiseCanvas.classList.add('full-static');
      staticNoiseCanvas.style.opacity = peakOp.toFixed(3);
    }
    if (cctvStatic) {
      cctvStatic.classList.add('full-static');
      cctvStatic.style.opacity = (peakOp * 0.65).toFixed(3);
    }
  }

  function updateCctvStaticEffect(dt, monsterNearby) {
    if (!staticNoiseCtx || !cctvOpen) {
      if (staticNoiseCanvas && staticNoiseCanvas.style.opacity !== '0') {
        staticNoiseCanvas.classList.remove('full-static');
        staticNoiseCanvas.style.opacity = '0';
      }
      if (cctvStatic && cctvStatic.style.opacity !== '0') {
        cctvStatic.classList.remove('full-static');
        cctvStatic.style.opacity = '0';
      }
      cctvFullStaticTimer = 0;
      return;
    }

    staticNoiseTimer += dt;
    const isFullStatic = (cctvFullStaticTimer > 0);

    // Faster frame updates during full static burst (~45 FPS) for extreme jitter
    const frameInterval = isFullStatic ? 0.022 : 0.040;
    if (staticNoiseTimer > frameInterval) {
      staticNoiseTimer = 0;
      if (isFullStatic && fullStaticFrames.length > 0) {
        staticNoiseFrameIdx = (staticNoiseFrameIdx + 1) % fullStaticFrames.length;
        staticNoiseCtx.putImageData(fullStaticFrames[staticNoiseFrameIdx], 0, 0);

        // Dynamic random scanline tears during full switch burst
        if (Math.random() < 0.70) {
          const tearY = (Math.random() * 155) | 0;
          const tearH = (Math.random() * 8 + 2) | 0;
          staticNoiseCtx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#000000';
          staticNoiseCtx.fillRect(0, tearY, 256, tearH);
        }
      } else {
        staticNoiseFrameIdx = (staticNoiseFrameIdx + 1) % staticNoiseFrames.length;
        staticNoiseCtx.putImageData(staticNoiseFrames[staticNoiseFrameIdx], 0, 0);

        // Analog horizontal tracking noise lines during normal camera view
        if (Math.random() < (monsterNearby ? 0.38 : 0.18)) {
          const barY = (Math.random() * 155) | 0;
          const barH = (Math.random() * (monsterNearby ? 7 : 4) + 2) | 0;
          staticNoiseCtx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.18)';
          staticNoiseCtx.fillRect(0, barY, 256, barH);
        }
      }
    }

    if (staticNoiseCanvas) {
      const baseOp = monsterNearby ? 0.25 + (Math.random() - 0.5) * 0.02 : 0.20;
      if (isFullStatic) {
        cctvFullStaticTimer -= dt;
        const peakOp = cctvFullStaticPeakOp || 0.80;
        if (cctvFullStaticTimer > cctvFullStaticFade) {
          // Dynamic hunting / flutter when static lingers
          const opJitter = (cctvFullStaticDuration > 0.38) ? (Math.random() * 0.06 - 0.03) : 0;
          const liveOp = Math.max(0.35, Math.min(0.96, peakOp + opJitter));
          staticNoiseCanvas.classList.add('full-static');
          staticNoiseCanvas.style.opacity = liveOp.toFixed(3);
          if (cctvStatic) {
            cctvStatic.classList.add('full-static');
            cctvStatic.style.opacity = (liveOp * 0.65).toFixed(3);
          }
        } else if (cctvFullStaticTimer > 0) {
          // Smooth decay down to ambient camera view
          const fProg = cctvFullStaticTimer / cctvFullStaticFade; // 1.0 -> 0.0
          const curOp = baseOp + (peakOp - baseOp) * fProg;
          staticNoiseCanvas.classList.add('full-static');
          staticNoiseCanvas.style.opacity = curOp.toFixed(3);
          if (cctvStatic) {
            cctvStatic.classList.add('full-static');
            cctvStatic.style.opacity = (0.10 + (peakOp * 0.65 - 0.10) * fProg).toFixed(3);
          }
        } else {
          // Finished static transition
          cctvFullStaticTimer = 0;
          cctvFullStaticDuration = 0;
          staticNoiseCanvas.classList.remove('full-static');
          staticNoiseCanvas.style.opacity = String(baseOp);
          if (cctvStatic) {
            cctvStatic.classList.remove('full-static');
            cctvStatic.style.opacity = '0.10';
          }
        }
      } else {
        staticNoiseCanvas.classList.remove('full-static');
        staticNoiseCanvas.style.opacity = String(baseOp);
        if (cctvStatic) {
          cctvStatic.classList.remove('full-static');
          cctvStatic.style.opacity = '0.10';
        }
      }
    }
  }
  const cctvUi = document.getElementById('cctv-ui');
  const camTitleEl = document.getElementById('cam-title');
  const camDescEl = document.getElementById('cam-desc');

  const upsPctEl = document.getElementById('ups-pct');
  const cctvBatteryPctEl = document.getElementById('cctv-battery-pct');
  const cctvLoadBlocksEl = document.getElementById('cctv-load-blocks');
  const upPctEl = document.getElementById('up-pct');
  const upBarFill = document.getElementById('up-bar-fill');
  const vpnBtn = document.getElementById('vpn-btn');
  const clockTimeEl = document.getElementById('clock-time');
  const hudNightLbl = document.getElementById('hud-night-lbl');
  const btnGfx = document.getElementById('btn-gfx');
  const phoneBox = document.getElementById('phone-box');
  const phoneText = document.getElementById('phone-text');
  let ayeshaCallConnected = false;
  let ayeshaCallStartTime = 0;

  const AYESHA_CALL_CUES = {
    1: [
      {
        t: 0.0,
        text: 'Assalam-o-Alaikum! Halqa NA-47 par aap ki night shift shuru ho gayi hai.',
        textEn: 'Assalam-o-Alaikum! Your night shift at Constituency NA-47 has begun.'
      },
      {
        t: 5.6,
        text: 'Subah cheh bajay Fajr tak aap ne saaray Form-45 nikaal kar baayein taraf scanner par scan aur portal par upload karnay hain.',
        textEn: 'By 6:00 AM Fajr, you must take out all Form-45s, scan them on the left scanner, and upload them to the portal.'
      },
      {
        t: 13.9,
        text: 'Aur haan... aakhri serial number ke Form kahin kho gaye hain, to un ko CCTV ki madad se dhoond lena...',
        textEn: 'And yes... the final serial-number Forms are lost somewhere, so find them with the help of CCTV...'
      },
      {
        t: 21.9,
        text: '...lekin ehtiyat rakhna ke aakhri Form uthatay huay koi dekh na le...',
        textEn: '...but be careful that nobody sees you picking up the final Forms...'
      },
      {
        t: 26.4,
        text: '...agar wahan koi mojood ho to uske jaanay ka intezaar karna aur phir Form uthana.',
        textEn: '...if someone is there, wait for them to leave and then pick up the Forms.'
      },
      {
        t: 33.6,
        text: 'Raat ko bahar ka mahaul thora ajeeb hota hai, is liye ehtiyat laazmi rakhna...',
        textEn: 'The atmosphere outside gets a bit strange at night, so stay cautious...'
      },
      {
        t: 40.3,
        text: '...CCTV cameras aur chhoti khirkiyon se bahar zaroor dekhtay rehna, aur jab bahar koi nazar aaye toh scan mat karna.',
        textEn: '...keep checking outside through the CCTV cameras and small windows, and do not scan when someone is spotted outside.'
      },
      {
        t: 48.2,
        text: 'Agar koi darwazay ya khirki ke qareeb aaye toh kundi aur shutter band kar lena...',
        textEn: 'If someone comes near the door or window, lock the latch and close the shutter...'
      },
      {
        t: 53.6,
        text: '...aur zaroorat paray toh deewar par tangay hathoray se unki marammat bhi kar lena.',
        textEn: '...and if needed, repair them using the hammer hanging on the wall.'
      },
      {
        t: 59.1,
        text: 'Haan, daaein taraf ketli mein chai ubaal kar CAM 01 par Chacha Chowkidar ko bhejtay rehna taakay woh gate par jaagtay rahein...',
        textEn: 'Also, boil tea in the kettle on the right and keep sending it to Chacha Watchman at CAM 01 so he stays awake at the gate...'
      },
      {
        t: 64.9,
        text: '...aur WiFi ka masla ho toh CAM 10 mein router dekh lena.',
        textEn: '...and if there is a WiFi issue, check the router on CAM 10.'
      },
      {
        t: 68.5,
        text: 'Yaad rakhna, aap ke paas subha 6 bajay tak ka waqt hai aur UPS ki battery aur Form-45 ki hifazat karna.',
        textEn: 'Remember, you have until 6:00 AM, so protect both the UPS battery and the Form-45s.'
      },
      {
        t: 73.5,
        text: 'Aur haan... Apna khayal rakhna!',
        textEn: 'And yes... take care of yourself!'
      }
    ],
    2: [
      {
        t: 0.0,
        text: 'Assalam-o-Alaikum! Returning Afsar sahib!',
        textEn: 'Assalam-o-Alaikum! Returning Officer sir!'
      },
      {
        t: 3.0,
        text: 'Aap ki NA-128 Lahore ki shift raat 10 se subha 6 bajay tak hai.',
        textEn: 'Your NA-128 Lahore shift is from 10 PM until 6 AM.'
      },
      {
        t: 9.3,
        text: 'Is imaarat ki wiring zara purani hai, to agar koi wiring ka issue ho to CAM 09 par taarein dekh lena.',
        textEn: "This building's wiring is a bit old, so if there's any wiring issue, check the wires on CAM 09."
      },
      {
        t: 18.0,
        text: 'Aur baaqi haalat ka to aap ko andaza hoga... to us ka saath dhiyaan rakhna.',
        textEn: 'And you probably know how the rest of the situation is... so watch out for that too.'
      },
      {
        t: 22.5,
        text: 'Allah Hafiz.',
        textEn: 'Allah Hafiz (Goodbye).'
      }
    ],
    3: [
      {
        t: 0.0,
        text: 'Assalam-o-Alaikum! RO sahib, aap ki 10 se subha 6 bajay ki shift hai!',
        textEn: 'Assalam-o-Alaikum! RO sir, your shift is from 10 PM to 6 AM!'
      },
      {
        t: 5.4,
        text: 'Aur haalat mazeed bigartay jaa rahey hain...',
        textEn: 'And the situation is getting even worse...'
      },
      {
        t: 8.2,
        text: 'Is halqay se Form-45 ki tampering reports aa rahi hain.',
        textEn: 'Reports of Form-45 tampering are coming in from this constituency.'
      },
      {
        t: 12.2,
        text: 'To scan karnay se pehle har Form ko daayein taraf rakhi hui stamp se seal kar lena.',
        textEn: 'So before scanning, make sure to seal every Form with the stamp placed on the right side.'
      },
      {
        t: 18.0,
        text: 'Baaqi aap apna khayal rakhna... Allah Hafiz!',
        textEn: 'Take care of yourself... Allah Hafiz!'
      }
    ]
  };
  const alertToast = document.getElementById('alert-toast');
  const rageVignette = document.getElementById('rage-vignette');
  const tutorialBanner = document.getElementById('tutorial-banner');
  const tutStepLbl = document.getElementById('tut-step-lbl');
  const tutStepText = document.getElementById('tut-step-text');
  const ps1Subtitle = document.getElementById('ps1-subtitle');

  const chaiPctEl = document.getElementById('chai-pct');
  const chaiBarFill = document.getElementById('chai-bar-fill');
  const btnBrewChai = document.getElementById('btn-brew-chai');

  const leftControls = document.getElementById('left-controls');
  const rightControls = document.getElementById('right-controls');
  const btnLeftDoor = document.getElementById('btn-left-door');
  const btnLeftLight = document.getElementById('btn-left-light');
  const doorHealthPctEl = document.getElementById('door-health-pct');
  const doorHealthFillEl = document.getElementById('door-health-fill');
  const btnRightDoor = document.getElementById('btn-right-door');
  const btnRightLight = document.getElementById('btn-right-light');
  const windowHealthPctEl = document.getElementById('window-health-pct');
  const windowHealthFillEl = document.getElementById('window-health-fill');
  const damageCrackFx = document.getElementById('damage-crack-fx');
  const cornerCrackLeft = document.getElementById('corner-crack-left');
  const cornerCrackRight = document.getElementById('corner-crack-right');
  const impactFlashFx = document.getElementById('impact-flash-fx');
  const btnCctv = document.getElementById('btn-cctv');

  // Form-45 Scanning & Upload HUD Elements
  const scannedCountEl = document.getElementById('scanned-count');
  const uploadedCountEl = document.getElementById('uploaded-count');
  const holdingFormBanner = document.getElementById('holding-form-banner');
  const scanStatusLbl = document.getElementById('scan-status-lbl');
  const btnScanHold = document.getElementById('btn-scan-hold');
  const btnStampForm = document.getElementById('btn-stamp-form');
  const scanHoldHud = document.getElementById('scan-hold-hud');
  const scanHoldBar = document.getElementById('scan-hold-bar');
  const stampHoldHud = document.getElementById('stamp-hold-hud');
  const stampHoldBar = document.getElementById('stamp-hold-bar');
  const stampHoldPct = document.getElementById('stamp-hold-pct');
  const stampBtnProgressWrap = document.getElementById('stamp-btn-progress-wrap');
  const stampBtnProgressBar = document.getElementById('stamp-btn-progress-bar');
  const formPickupFx = document.getElementById('form-pickup-fx');
  const formPickupFloat = null;

  // Minecraft Hotbar Inventory & Repair HUD
  const inventoryHud = document.getElementById('inventory-hud');
  const invSlotBtn = document.getElementById('inv-slot-btn');
  const inventoryIcon = document.getElementById('inventory-icon');
  const inventoryName = document.getElementById('inventory-name');
  const inventoryHint = document.getElementById('inventory-hint');
  const btnLeftRepair = document.getElementById('btn-left-repair');
  const btnRightRepair = document.getElementById('btn-right-repair');
  const repairHoldHud = document.getElementById('repair-hold-hud');
  const repairHoldTitle = document.getElementById('repair-hold-title');
  const repairHoldBar = document.getElementById('repair-hold-bar');
  const monsterTauntSub = document.getElementById('monster-taunt-sub');
  const tauntSpeaker = document.getElementById('taunt-speaker');
  const tauntText = document.getElementById('taunt-text');

  function triggerImpactSlam(type, severity) {
    if (!impactFlashFx) return;
    const cls = `${type}-${severity}`; // e.g. 'door-heavy', 'win-medium'
    impactFlashFx.className = 'impact-flash ' + cls;
    setTimeout(() => {
      if (impactFlashFx && impactFlashFx.className.includes(cls)) {
        impactFlashFx.className = 'impact-flash';
      }
    }, severity === 'heavy' ? 580 : severity === 'medium' ? 450 : 320);
  }

  const menuModal = document.getElementById('menu-modal');
  const howToPlayModal = document.getElementById('how-to-play-modal');
  const optionsModal = document.getElementById('options-modal');
  const gameoverModal = document.getElementById('gameover-modal');
  const deathScreen = document.getElementById('death-screen');
  const deathBadge = document.getElementById('death-badge');
  const deathTitle = document.getElementById('death-title');
  const deathSub = document.getElementById('death-sub');
  const goTitle = document.getElementById('go-title');
  const goSub = document.getElementById('go-sub');
  const goApology = document.getElementById('go-apology');
  const btnPlay = document.getElementById('btn-play');

  const jumpscareFx = document.getElementById('jumpscare-fx');
  const khakiOverrideHud = document.getElementById('khaki-override-hud');
  const babuWhitenerFx = document.getElementById('babu-whitener-fx');
  const ws1 = document.getElementById('ws-1');
  const ws2 = document.getElementById('ws-2');
  const ws3 = document.getElementById('ws-3');
  const sarkariStamp = document.getElementById('sarkari-stamp');
  const dawnCutsceneUi = document.getElementById('dawn-cutscene-ui');
  const btnSkipCutscene = document.getElementById('btn-skip-cutscene');
  const endCreditsCutsceneEl = document.getElementById('end-credits-cutscene');
  const endCreditsVideo = document.getElementById('end-credits-video');
  const btnSkipEndCredits = document.getElementById('btn-skip-end-credits');
  const btnCredits = document.getElementById('btn-credits');

  // Reflection Overlay elements (Level 3 victory sequence - 8-part progression)
  const endingReflectionOverlay = document.getElementById('ending-reflection-overlay');
  const endingBlocks = {
    1: document.getElementById('ending-block-1'),
    2: document.getElementById('ending-block-2'),
    3: document.getElementById('ending-block-3'),
    4: document.getElementById('ending-block-4'),
    5: document.getElementById('ending-block-5'),
    7: document.getElementById('ending-block-7'),
    8: document.getElementById('ending-block-8'),
  };
  const refStatPlaytime = document.getElementById('ref-stat-playtime');
  const refStatRetries = document.getElementById('ref-stat-retries');
  const refStatForms = document.getElementById('ref-stat-forms');

  // --- CAMPAIGN LIFETIME STATS TRACKER (ACROSS ALL 3 HALQAS) ---
  let campaignPlaytimeSec = 0;
  let campaignRetries = 0;
  try {
    const savedTime = parseFloat(localStorage.getItem('form45_campaign_playtime_sec') || '0');
    if (!isNaN(savedTime) && savedTime > 0) campaignPlaytimeSec = savedTime;
    const savedRetries = parseInt(localStorage.getItem('form45_campaign_retries') || '0', 10);
    if (!isNaN(savedRetries) && savedRetries >= 0) campaignRetries = savedRetries;
  } catch (_) {}

  function saveCampaignStats() {
    try {
      localStorage.setItem('form45_campaign_playtime_sec', campaignPlaytimeSec.toString());
      localStorage.setItem('form45_campaign_retries', campaignRetries.toString());
    } catch (_) {}
  }

  function resetCampaignStats() {
    campaignPlaytimeSec = 0;
    campaignRetries = 0;
    saveCampaignStats();
  }

  function isIOSDevice() {
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function isMobileTouchDevice() {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return isIOSDevice() || coarse || ('ontouchstart' in window && Math.min(window.innerWidth, window.innerHeight) <= 950);
  }

  // --- THREE.JS RENDERER WITH REAL SHADOWS & 90s PIXEL TOGGLE ---
  let retroPixelMode = false;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  const glCtx = renderer.getContext();
  const maxFragUniforms = glCtx ? (glCtx.getParameter(glCtx.MAX_FRAGMENT_UNIFORM_VECTORS) || 256) : 256;
  const lowUniformGpu = isMobileTouchDevice() || maxFragUniforms < 512;
  renderer.shadowMap.enabled = !lowUniformGpu;
  renderer.shadowMap.type = THREE.BasicShadowMap; // Crisp 90s hard shadows

  let isPortraitLocked = false;
  const rotateOverlayEl = document.getElementById('rotate-landscape-overlay');
  function syncMobileOrientationLock() {
    const mobile = isMobileTouchDevice();
    const portrait = mobile && window.innerHeight > window.innerWidth;
    const wasLocked = isPortraitLocked;
    isPortraitLocked = portrait;
    if (rotateOverlayEl) {
      rotateOverlayEl.style.display = portrait ? 'flex' : 'none';
    }
    const nv = document.getElementById('news-cutscene-video');
    const inCutscene = document.getElementById('intro-news-cutscene')?.classList.contains('active');
    if (nv && inCutscene) {
      if (portrait && !nv.paused) {
        try { nv.pause(); } catch (_) {}
      } else if (!portrait && wasLocked && nv.paused && !nv.ended) {
        try { nv.play().catch(() => {}); } catch (_) {}
      }
    }
  }

  function tryLockLandscape() {
    if (!isMobileTouchDevice()) return;
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (_) {}
  }

  let shownIosFullscreenHint = false;
  function tryEnterMobileFullscreen() {
    if (!isMobileTouchDevice()) return;
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl) {
      tryLockLandscape();
      return;
    }
    const rootEl = document.documentElement;
    try {
      if (rootEl.requestFullscreen) {
        const p = rootEl.requestFullscreen({ navigationUI: 'hide' });
        if (p && p.then) {
          p.then(() => { tryLockLandscape(); }).catch(() => { tryLockLandscape(); });
        }
      } else if (rootEl.webkitRequestFullscreen) {
        rootEl.webkitRequestFullscreen();
        tryLockLandscape();
      } else {
        if (isIOSDevice() && !window.navigator.standalone && !shownIosFullscreenHint) {
          shownIosFullscreenHint = true;
          if (typeof showToast === 'function') {
            showToast('IPHONE: SHARE -> ADD TO HOME SCREEN FOR FULLSCREEN');
          }
        }
        tryLockLandscape();
      }
    } catch (_) {
      tryLockLandscape();
    }
  }

  function updateRendererSize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    const useRetro = retroPixelMode && !cctvOpen;
    const maxDpr = isMobileTouchDevice() ? 1.15 : 1.5;
    renderer.setPixelRatio(useRetro ? 0.44 : Math.min(window.devicePixelRatio || 1, maxDpr));
    canvas.style.imageRendering = useRetro ? 'pixelated' : 'auto';
    if (window.__camera) {
      window.__camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      window.__camera.updateProjectionMatrix();
    }
    syncMobileOrientationLock();
  }
  updateRendererSize();
  window.addEventListener('orientationchange', () => setTimeout(updateRendererSize, 120));
  window.addEventListener('fullscreenchange', () => setTimeout(updateRendererSize, 80));
  window.addEventListener('webkitfullscreenchange', () => setTimeout(updateRendererSize, 80));
  window.addEventListener('pageshow', () => {
    setTimeout(updateRendererSize, 80);
    if (typeof GameAudio !== 'undefined' && GameAudio.init) GameAudio.init();
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => setTimeout(updateRendererSize, 60));
  }
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((evt) => {
    document.addEventListener(evt, (e) => { e.preventDefault(); }, { passive: false });
  });
  window.addEventListener('touchend', () => {
    if (typeof GameAudio !== 'undefined' && GameAudio.init) GameAudio.init();
  }, { passive: true });

  if (btnGfx) {
    btnGfx.addEventListener('click', () => {
      retroPixelMode = !retroPixelMode;
      btnGfx.innerHTML = (typeof GAME_ICONS !== 'undefined' ? GAME_ICONS.monitor + ' ' : '') + (retroPixelMode ? 'Shader: 90s Pixel' : 'Shader: Crisp HD');
      updateRendererSize();
    });
  }

  const scene = new THREE.Scene();
  window.__scene = scene;
  scene.background = new THREE.Color(0x040705);
  scene.fog = new THREE.FogExp2(0x040705, 0.068);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 90);
  window.__camera = camera;
  // Enable Layer 1 on the player camera so the player sees both Layer 0 (the classroom)
  // and Layer 1 (the intruders and corridor illuminated by Q/E lights without room spill)
  camera.layers.enable(1);
  scene.add(camera);

  // Build World
  const world = window.World3D.buildPollingStation(scene, camera);
  const {
    officeGroup,
    ambient,
    fanGroup,
    deskFanBlades,
    chaiCup,
    dustParticles,
    leftDoorMesh,
    doorCrackDecal,
    rightShutterMesh,
    windowCrackDecalL,
    windowCrackDecalR,
    leftBtnDoor3D,
    leftBtnLight3D,
    rightBtnDoor3D,
    rightBtnLight3D,
    roomLight,
    ceilingTubeGroup,
    ceilingTubeMat,
    flashlight,
    flashTarget,
    handTorchGroup,
    leftHallLight,
    rightWindowLight,
    cam5Light,
    cam6Light,
    zoneLights,
    cctvCamLight,
    cctvCamTarget,
    cctvRoomFillLight,
    cctvMonsterLight,
    cctvMonsterTarget,
    cctvFormProps,
    laptopScreenHelper,
    scannerScreenHelper,
    crtScreenHelper,
    cctvZones,
    vigoMesh,
    chowkidarMesh,
    policeStrobeRed,
    policeStrobeBlue,
    gulluMesh,
    whitenerMesh,
    lurkingEyes,
    scanStation,
    kettleStation,
    handForm,
    handStamp,
    stampDesk,
    stampBody,
    updateFormTexture,
    wallHammer,
    handHammer,
    ballotBoxMesh,
    clickableMeshes,
    leftPeekVoidMesh,
    leftPeekBackdrop,
    leftPeekMoonlight,
    leftPeekGrill,
    rightPeekVoidMesh,
    rightPeekBackdrop,
    rightPeekMoonlight,
    rightPeekGrill,
    wireBox,
    cam09WireBox,
    cam10Router
  } = world;
  window.__stampDesk = stampDesk;
  window.__clickableMeshes = clickableMeshes;
  window.__cctvFormProps = cctvFormProps;
  window.__cctvZones = cctvZones;

  // Dedicated Title Screen Menacing Horror Lights for Babu (Left) & Khaki (Right)
  // Dramatic Side-Key Lights: casting heavy, ominous shadows across the inner faces
  const babuMenuLight = new THREE.PointLight(0x4ade80, 2.6, 5.5, 1.1);
  babuMenuLight.position.set(-1.65, 1.82, 1.25);
  babuMenuLight.layers.enable(1);
  scene.add(babuMenuLight);

  const khakiMenuLight = new THREE.PointLight(0x4ade80, 2.6, 5.5, 1.1);
  khakiMenuLight.position.set(1.65, 1.82, 1.25);
  khakiMenuLight.layers.enable(1);
  scene.add(khakiMenuLight);

  // High Rim Contour Lights: catching cap peaks and outer cheek edge
  const babuRimLight = new THREE.PointLight(0x16a34a, 2.8, 4.5, 1.0);
  babuRimLight.position.set(-1.75, 2.05, 0.4);
  babuRimLight.layers.enable(1);
  scene.add(babuRimLight);

  const khakiRimLight = new THREE.PointLight(0x16a34a, 2.8, 4.5, 1.0);
  khakiRimLight.position.set(1.75, 2.05, 0.4);
  khakiRimLight.layers.enable(1);
  scene.add(khakiRimLight);

  const menuBackdropLight = new THREE.DirectionalLight(0x051a0d, 0.4);
  menuBackdropLight.position.set(0, 3, -2);
  scene.add(menuBackdropLight);

  let menuTwitchTimer = 2.5;
  let isMenuTwitching = false;
  let menuTwitchDuration = 0;
  let menuTwitchType = 'snap';
  let menuTwitchTarget = 'babu';
  let menuTwitchParams = { rotX: 0, rotY: 0, rotZ: 0, lungeZ: 0 };

  const cam09Clickables = (cam09WireBox && cam09WireBox.clickables) || [];
  let isHoveringCam09WireBox = false;

  const cam10Clickables = (cam10Router && cam10Router.clickables) || [];
  let isHoveringCam10Router = false;


  // =========================================================================
  //  20-SECOND POWER SABOTAGE EMERGENCY ALARM & WIRE PUZZLE SYSTEM
  // =========================================================================
  const emergencyStrobe = document.getElementById('emergency-strobe');
  const emergencySabotageHud = document.getElementById('emergency-sabotage-hud');
  const cam09Prompt = document.getElementById('cctv-cam09-prompt');
  const cam09PromptTitle = document.getElementById('cam09-prompt-title');
  const cam09PromptSub = document.getElementById('cam09-prompt-sub');
  const btnCamOpenWire = document.getElementById('btn-cam-open-wire');
  if (btnCamOpenWire) btnCamOpenWire.addEventListener('click', openWirePuzzle);
  const sabotageCountdownVal = document.getElementById('sabotage-countdown-val');
  const btnFixWires = document.getElementById('btn-fix-wires');
  const wirePuzzleModal = document.getElementById('wire-puzzle-modal');
  const wirePuzzleCountdown = document.getElementById('wire-puzzle-countdown');
  const wireCanvas = document.getElementById('wire-canvas');
  const wireCanvasCtx = wireCanvas ? wireCanvas.getContext('2d') : null;
  const wirePuzzleStatus = document.getElementById('wire-puzzle-status');
  const btnCloseWires = document.getElementById('btn-close-wires');

  const WIRE_SPECS = [
    { id: 'yellow', name: 'YELLOW', hex: '#facc15', borderHex: '#ca8a04', symbol: '◯' },
    { id: 'blue',   name: 'BLUE',   hex: '#3b82f6', borderHex: '#1d4ed8', symbol: '✕' },
    { id: 'red',    name: 'RED',    hex: '#ef4444', borderHex: '#b91c1c', symbol: '△' },
    { id: 'magenta',name: 'MAGENTA',hex: '#ec4899', borderHex: '#be185d', symbol: '☆' }
 ];

  const TERMINAL_Y = [75, 175, 275, 375];

  let leftWireSlots = [];
  let rightWireSlots = [];
  let connectedWires = {}; // { [colorId]: { leftY, rightY, rightIdx } }
  let draggingWire = null;
  let wireSparkParticles = [];
  let isWirePuzzleOpen = false;
  let powerSabotageTimer = 0; // 20.0 seconds
  let powerSabotageCooldown = 0; // 60s cooldown after sabotage resolved/repelled
  let lastCountdownBeepSec = -1;

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let wireNoisePattern = null;

  function initWirePuzzle(isSabotage = false) {
    draggingWire = null;
    wireSparkParticles = [];

    if (isSabotage) {
      //  POWER SABOTAGE: Khaki cut the wires! Wires severed & scrambled!
      leftWireSlots = shuffleArray(WIRE_SPECS);
      rightWireSlots = shuffleArray(WIRE_SPECS);
      connectedWires = {};
      if (wirePuzzleStatus) {
        wirePuzzleStatus.textContent = ' WIRES SEVERED! RECONNECT MATCHING TERMINALS!';
        wirePuzzleStatus.className = 'wire-puzzle-status alert';
      }
      if (wirePuzzleCountdown) {
        wirePuzzleCountdown.textContent = `TRIP IN: ${powerSabotageTimer.toFixed(1)}s`;
        wirePuzzleCountdown.className = 'wire-puzzle-timer alert';
      }
      for (let j = 0; j < 4; j++) {
        spawnWireSparks(96, TERMINAL_Y[j], true);
      }
    } else {
      //  NORMAL STATE: Solved from the start! All 4 circuits secured!
      leftWireSlots = WIRE_SPECS.slice();
      rightWireSlots = WIRE_SPECS.slice();
      connectedWires = {};
      for (let i = 0; i < 4; i++) {
        const spec = WIRE_SPECS[i];
        connectedWires[spec.id] = {
          leftY: TERMINAL_Y[i],
          rightY: TERMINAL_Y[i],
          rightIdx: i
        };
      }
      if (wirePuzzleStatus) {
        wirePuzzleStatus.textContent = ' ALL CIRCUITS CONNECTED · 440V 3-PHASE GRID NOMINAL';
        wirePuzzleStatus.className = 'wire-puzzle-status success';
      }
      if (wirePuzzleCountdown) {
        wirePuzzleCountdown.textContent = 'GRID OK · 230V';
        wirePuzzleCountdown.className = 'wire-puzzle-timer';
      }
    }
    renderWireCanvas();
  }

  function openWirePuzzle() {
    if (state !== 'PLAYING' || !cctvOpen || activeCamIdx !== 8) return;
    isWirePuzzleOpen = true;
    updateCam09Prompt();
    if (!leftWireSlots || leftWireSlots.length === 0) {
      initWirePuzzle(isPowerSabotaged);
    }
    // Sync header status on open
    if (wirePuzzleCountdown) {
      if (isPowerSabotaged) {
        wirePuzzleCountdown.textContent = `TRIP IN: ${powerSabotageTimer.toFixed(1)}s`;
        wirePuzzleCountdown.className = 'wire-puzzle-timer alert';
      } else {
        wirePuzzleCountdown.textContent = 'GRID OK · 230V';
        wirePuzzleCountdown.className = 'wire-puzzle-timer';
      }
    }
    if (wirePuzzleModal) wirePuzzleModal.classList.remove('hide');
    renderWireCanvas();
  }

  function closeWirePuzzle() {
    isWirePuzzleOpen = false;
    draggingWire = null;
    if (wirePuzzleModal) wirePuzzleModal.classList.add('hide');
    updateCam09Prompt();
  }

  function drawSymbol(ctx, symbol, cx, cy) {
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (symbol === '◯') {
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.stroke();
    } else if (symbol === '✕') {
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6); ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6); ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
    } else if (symbol === '△') {
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7.5);
      ctx.lineTo(cx + 7.5, cy + 6.5);
      ctx.lineTo(cx - 7.5, cy + 6.5);
      ctx.closePath();
      ctx.stroke();
    } else if (symbol === '☆') {
      ctx.beginPath();
      const spikes = 5;
      const outerR = 8.5, innerR = 4.2;
      let rot = Math.PI / 2 * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerR;
        let y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  

  function renderWireCanvas() {
    if (!wireCanvasCtx) return;
    const ctx = wireCanvasCtx;
    const w = 500, h = 480;

    // 1. Dark weathered steel industrial backplate
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#1c2027');
    bgGrad.addColorStop(0.5, '#121419');
    bgGrad.addColorStop(1, '#0a0c0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Fine industrial metal dither noise pattern
    if (!wireNoisePattern) {
      const nCanvas = document.createElement('canvas');
      nCanvas.width = 64; nCanvas.height = 64;
      const nctx = nCanvas.getContext('2d');
      const img = nctx.createImageData(64, 64);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() < 0.5 ? 255 : 0;
        img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v;
        img.data[i+3] = Math.random() * 16 + 4;
      }
      nctx.putImageData(img, 0, 0);
      wireNoisePattern = ctx.createPattern(nCanvas, 'repeat');
    }
    if (wireNoisePattern) {
      ctx.fillStyle = wireNoisePattern;
      ctx.fillRect(0, 0, w, h);
    }

    // Heavy industrial steel enclosure rim with beveled border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // 4 Hex head corner bolts ( PS2 mechanical detail)
    const bolts = [{x: 16, y: 16}, {x: w - 16, y: 16}, {x: 16, y: h - 16}, {x: w - 16, y: h - 16}];
    bolts.forEach(b => {
      ctx.fillStyle = '#090d14';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI / 3) + Math.PI / 6;
        const hx = b.x + Math.cos(ang) * 5.2;
        const hy = b.y + Math.sin(ang) * 5.2;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x - 3, b.y);
      ctx.lineTo(b.x + 3, b.y);
      ctx.stroke();
    });

    // Top & Bottom Industrial Yellow/Black Hazard Stripes (خطرہ)
    function drawHazardStripe(y, hgt) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(8, y, w - 16, hgt);
      ctx.clip();
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(8, y, w - 16, hgt);
      ctx.fillStyle = '#0f172a';
      for (let sx = -hgt * 2; sx < w + hgt * 2; sx += 18) {
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(sx + 10, y);
        ctx.lineTo(sx + 10 - hgt, y + hgt);
        ctx.lineTo(sx - hgt, y + hgt);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, y, w - 16, hgt);
      ctx.restore();
    }
    drawHazardStripe(9, 8);
    drawHazardStripe(h - 17, 8);

    // Weathered Stenciled Identification Plate (PS2 industrial texture)
    ctx.save();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.font = 'bold 9px monospace';
    ctx.letterSpacing = '1px';
    ctx.fillText('WAPDA // IESCO ISLAMABAD - 440V MAIN FEEDER', 24, 28);
    ctx.fillText('خطرہ 440 وولٹ • ماڈل: NA47-P94', 330, 28);
    ctx.restore();

    // Central Vertical Trunking Raceway (Conduit Trench in background)
    const racewayGrad = ctx.createLinearGradient(185, 0, 315, 0);
    racewayGrad.addColorStop(0, '#090a0d');
    racewayGrad.addColorStop(0.15, '#16191f');
    racewayGrad.addColorStop(0.5, '#20242c');
    racewayGrad.addColorStop(0.85, '#16191f');
    racewayGrad.addColorStop(1, '#090a0d');
    ctx.fillStyle = racewayGrad;
    ctx.fillRect(185, 18, 130, h - 36);

    // Background Main Feeder Cables (Inside Trunking)
    const trunkCables = [
      { color: '#991b1b', x: 215, w: 9 },  // Red Phase
      { color: '#ca8a04', x: 232, w: 8 },  // Yellow Phase
      { color: '#1d4ed8', x: 250, w: 9 },  // Blue Phase
      { color: '#15803d', x: 268, w: 7 },  // Earth Ground
      { color: '#334155', x: 285, w: 8 }   // Neutral
 ];
    trunkCables.forEach(c => {
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = c.w + 4;
      ctx.beginPath(); ctx.moveTo(c.x + 2, 20); ctx.lineTo(c.x + 2, h - 20); ctx.stroke();
      ctx.strokeStyle = c.color;
      ctx.lineWidth = c.w;
      ctx.beginPath(); ctx.moveTo(c.x, 20); ctx.lineTo(c.x, h - 20); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(c.x - 1, 20); ctx.lineTo(c.x - 1, h - 20); ctx.stroke();
    });

    // Heavy Stamped Steel Conduit Brackets (Holding trunk cables)
    [85, 240, 395].forEach(by => {
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.fillRect(180, by - 6, 140, 12);
      ctx.strokeRect(180, by - 6, 140, 12);
      [188, 312].forEach(sx => {
        ctx.fillStyle = '#64748b';
        ctx.beginPath(); ctx.arc(sx, by, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sx - 2, by); ctx.lineTo(sx + 2, by); ctx.stroke();
      });
    });

    // 2. Render Left Terminals (Heavy Bakelite Blocks with Brass Screws)
    leftWireSlots.forEach((spec, idx) => {
      const ty = TERMINAL_Y[idx];

      // Bakelite block drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(8, ty - 22, 82, 44);

      // Bakelite main body with 3D beveled shading
      const bGrad = ctx.createLinearGradient(6, ty - 24, 6, ty + 20);
      bGrad.addColorStop(0, '#2d333d');
      bGrad.addColorStop(0.5, '#1e2229');
      bGrad.addColorStop(1, '#111317');
      ctx.fillStyle = bGrad;
      ctx.fillRect(6, ty - 24, 80, 44);

      // Bevel borders
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(6, ty - 24, 80, 44);

      // Weathered Brass Screw Terminal Binding Post
      const screwX = 18, screwY = ty;
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath(); ctx.arc(screwX, screwY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(screwX - 4, screwY - 2); ctx.lineTo(screwX + 4, screwY + 2); ctx.stroke();

      // Color Badge / Identification Tag
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(32, ty - 18, 48, 36);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(32, ty - 18, 48, 36);

      // Color fill with beveled gloss
      const cGrad = ctx.createLinearGradient(34, ty - 16, 34, ty + 16);
      cGrad.addColorStop(0, spec.hex);
      cGrad.addColorStop(0.85, spec.borderHex);
      cGrad.addColorStop(1, '#000000');
      ctx.fillStyle = cGrad;
      ctx.fillRect(34, ty - 16, 44, 32);

      // Stamped symbol
      drawSymbol(ctx, spec.symbol, 56, ty);

      // Heavy Crimp Ferrule / Brass Wire Lug (where wire exits)
      const ferruleGrad = ctx.createLinearGradient(84, ty - 7, 102, ty + 7);
      ferruleGrad.addColorStop(0, '#b45309');
      ferruleGrad.addColorStop(0.4, '#f59e0b');
      ferruleGrad.addColorStop(0.8, '#d97706');
      ferruleGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = ferruleGrad;
      ctx.fillRect(84, ty - 8, 16, 16);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(84, ty - 8, 16, 16);
      ctx.strokeStyle = '#78350f';
      ctx.beginPath(); ctx.moveTo(92, ty - 8); ctx.lineTo(92, ty + 8); ctx.stroke();
    });

    // 3. Render Right Terminals (Heavy Bakelite Blocks with Pilot Light LEDs)
    rightWireSlots.forEach((spec, idx) => {
      const ty = TERMINAL_Y[idx];
      const isConnected = !!Object.values(connectedWires).find(c => c.rightIdx === idx);

      // Bakelite block drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(410, ty - 22, 82, 44);

      // Bakelite main body with 3D beveled shading
      const bGrad = ctx.createLinearGradient(412, ty - 24, 412, ty + 20);
      bGrad.addColorStop(0, '#2d333d');
      bGrad.addColorStop(0.5, '#1e2229');
      bGrad.addColorStop(1, '#111317');
      ctx.fillStyle = bGrad;
      ctx.fillRect(412, ty - 24, 80, 44);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(412, ty - 24, 80, 44);

      // Heavy Crimp Ferrule / Brass Wire Lug (where wire enters)
      const ferruleGrad = ctx.createLinearGradient(398, ty - 7, 414, ty + 7);
      ferruleGrad.addColorStop(0, '#78350f');
      ferruleGrad.addColorStop(0.4, '#d97706');
      ferruleGrad.addColorStop(0.8, '#f59e0b');
      ferruleGrad.addColorStop(1, '#b45309');
      ctx.fillStyle = ferruleGrad;
      ctx.fillRect(398, ty - 8, 16, 16);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(398, ty - 8, 16, 16);
      ctx.strokeStyle = '#78350f';
      ctx.beginPath(); ctx.moveTo(406, ty - 8); ctx.lineTo(406, ty + 8); ctx.stroke();

      // Color Badge / Identification Tag
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(418, ty - 18, 48, 36);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(418, ty - 18, 48, 36);

      const cGrad = ctx.createLinearGradient(420, ty - 16, 420, ty + 16);
      cGrad.addColorStop(0, spec.hex);
      cGrad.addColorStop(0.85, spec.borderHex);
      cGrad.addColorStop(1, '#000000');
      ctx.fillStyle = cGrad;
      ctx.fillRect(420, ty - 16, 44, 32);

      drawSymbol(ctx, spec.symbol, 442, ty);

      // Weathered Brass Binding Screw on far right
      const screwX = 480, screwY = ty;
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath(); ctx.arc(screwX, screwY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = '#451a03'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(screwX - 4, screwY + 2); ctx.lineTo(screwX + 4, screwY - 2); ctx.stroke();

      // Pilot Lamp LED Indicator (Above each right terminal)
      const ledX = 405, ledY = ty - 26;
      ctx.fillStyle = '#64748b';
      ctx.beginPath(); ctx.arc(ledX, ledY, 6.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.save();
      if (isConnected) {
        // Glowing Green Neon Pilot Lamp
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(ledX, ledY, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#dcfce7';
        ctx.beginPath(); ctx.arc(ledX - 1, ledY - 1, 1.8, 0, Math.PI * 2); ctx.fill();
      } else {
        // Dark Unlit / Error Pilot Lamp
        ctx.fillStyle = isPowerSabotaged ? '#dc2626' : '#27272a';
        ctx.shadowColor = isPowerSabotaged ? '#ef4444' : 'transparent';
        ctx.shadowBlur = isPowerSabotaged ? 6 : 0;
        ctx.beginPath(); ctx.arc(ledX, ledY, 4.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath(); ctx.arc(ledX - 1, ledY - 1, 1.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    });

    // 4. Draw Connected Wires (Chunky PS2 Cable Shading)
    Object.keys(connectedWires).forEach(colorId => {
      const conn = connectedWires[colorId];
      const spec = WIRE_SPECS.find(s => s.id === colorId);
      if (!spec) return;
      drawWire(ctx, 96, conn.leftY, 404, conn.rightY, spec.hex, spec.borderHex);
    });

    // 5. Draw Actively Dragging Wire
    if (draggingWire) {
      drawWire(ctx, 96, draggingWire.startY, draggingWire.curX, draggingWire.curY, draggingWire.hex, draggingWire.borderHex);
      // Sparking tip while dragging
      const tipGrad = ctx.createRadialGradient(draggingWire.curX, draggingWire.curY, 2, draggingWire.curX, draggingWire.curY, 14);
      tipGrad.addColorStop(0, '#fef08a');
      tipGrad.addColorStop(0.5, '#f59e0b');
      tipGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = tipGrad;
      ctx.beginPath(); ctx.arc(draggingWire.curX, draggingWire.curY, 14, 0, Math.PI * 2); ctx.fill();
    }

    // 6. Draw Spark Particles
    if (wireSparkParticles.length > 0) {
      for (let i = wireSparkParticles.length - 1; i >= 0; i--) {
        const p = wireSparkParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.055;
        if (p.alpha <= 0) {
          wireSparkParticles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. Retro PS2 CRT Scanline Overlay across entire canvas
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    for (let y = 0; y < h; y += 3) {
      ctx.fillRect(0, y, w, 1);
    }
    // Subtle CRT phosphor shadow vignette
    const vig = ctx.createRadialGradient(w / 2, h / 2, 140, w / 2, h / 2, 280);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawWire(ctx, x1, y1, x2, y2, hexColor, borderColor) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const sag = Math.max(18, Math.abs(dy) * 0.16 + 22);
    const cp1x = x1 + Math.max(28, dx * 0.42);
    const cp1y = y1 + sag;
    const cp2x = x2 - Math.max(28, dx * 0.42);
    const cp2y = y2 + sag;

    ctx.save();

    // 1. Heavy Industrial Drop Shadow onto Steel Backplate
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.62)';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1 + 7);
    ctx.bezierCurveTo(cp1x, cp1y + 8, cp2x, cp2y + 8, x2, y2 + 7);
    ctx.stroke();

    // 2. Dark Heavy Rubber Outer Jacket (Gouraud base)
    ctx.strokeStyle = '#0a0a0d';
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    ctx.stroke();

    // 3. Main Cable Color Core
    ctx.strokeStyle = hexColor;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
    ctx.stroke();

    // 4. Stepped PS2 Specular Highlight Ridge (Sharp upper gloss)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(x1 + 2, y1 - 2.5);
    ctx.bezierCurveTo(cp1x, cp1y - 3.5, cp2x, cp2y - 3.5, x2 - 2, y2 - 2.5);
    ctx.stroke();

    // 5. Cable Catenary Ribbing / Segment Rings (Heavy Industrial Conduit feel)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.lineWidth = 2.0;
    const samples = 14;
    for (let i = 1; i < samples; i++) {
      const t = i / samples;
      const bx = Math.pow(1 - t, 3) * x1 + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * x2;
      const by = Math.pow(1 - t, 3) * y1 + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * y2;
      ctx.beginPath();
      ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function spawnWireSparks(x, y, isError = false) {
    const count = isError ? 12 : 22;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.2;
      wireSparkParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1.2,
        color: isError ? '#ef4444' : (Math.random() < 0.4 ? '#ffffff' : Math.random() < 0.7 ? '#fbbf24' : '#60a5fa'),
        alpha: 1.0
      });
    }
  }

  function getCanvasCoords(e) {
    if (!wireCanvas) return { x: 0, y: 0 };
    const rect = wireCanvas.getBoundingClientRect();
    const scaleX = 500 / Math.max(1, rect.width);
    const scaleY = 480 / Math.max(1, rect.height);
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || null;
    const clientX = e.clientX !== undefined ? e.clientX : (t ? t.clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (t ? t.clientY : 0);
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  if (wireCanvas) {
    const handleStart = (e) => {
      if (e.cancelable) e.preventDefault();
      if (e.pointerId !== undefined && wireCanvas.setPointerCapture) {
        try { wireCanvas.setPointerCapture(e.pointerId); } catch (_) {}
      }
      const pos = getCanvasCoords(e);
      if (pos.x >= 0 && pos.x <= 155) {
        for (let i = 0; i < 4; i++) {
          const ty = TERMINAL_Y[i];
          if (Math.abs(pos.y - ty) <= 38) {
            const spec = leftWireSlots[i];
            if (spec && !connectedWires[spec.id]) {
              draggingWire = {
                id: spec.id,
                hex: spec.hex,
                borderHex: spec.borderHex,
                leftIdx: i,
                startY: ty,
                curX: pos.x,
                curY: pos.y
              };
              if (GameAudio.wirePickup) GameAudio.wirePickup();
              renderWireCanvas();
              break;
            }
          }
        }
      }
    };

    const handleMove = (e) => {
      if (!draggingWire) return;
      e.preventDefault();
      const pos = getCanvasCoords(e);
      draggingWire.curX = Math.max(90, Math.min(410, pos.x));
      draggingWire.curY = Math.max(30, Math.min(450, pos.y));
      renderWireCanvas();
    };

    const handleEnd = (e) => {
      if (!draggingWire) return;
      e.preventDefault();
      const pos = getCanvasCoords(e);
      let matched = false;

      if (pos.x >= 340 && pos.x <= 500) {
        for (let j = 0; j < 4; j++) {
          const ty = TERMINAL_Y[j];
          if (Math.abs(pos.y - ty) <= 42) {
            const targetSpec = rightWireSlots[j];
            if (targetSpec.id === draggingWire.id) {
              connectedWires[draggingWire.id] = {
                leftY: draggingWire.startY,
                rightY: ty,
                rightIdx: j
              };
              matched = true;
              if (GameAudio.wireSnap) GameAudio.wireSnap();
              spawnWireSparks(404, ty, false);

              if (Object.keys(connectedWires).length === 4) {
                if (wirePuzzleStatus) {
                  wirePuzzleStatus.textContent = ' ALL CIRCUITS RESTORED! POWER ONLINE!';
                  wirePuzzleStatus.className = 'wire-puzzle-status success';
                }
                if (GameAudio.wirePuzzleComplete) GameAudio.wirePuzzleComplete();
                resolvePowerSabotage(true);
                setTimeout(() => {
                  closeWirePuzzle();
                }, 650);
              }
            } else {
              if (GameAudio.wireBuzz) GameAudio.wireBuzz();
              spawnWireSparks(404, ty, true);
            }
            break;
          }
        }
      }

      if (!matched && !Object.keys(connectedWires).includes(draggingWire.id)) {
        if (GameAudio.wireBuzz && pos.x > 350) GameAudio.wireBuzz();
      }

      draggingWire = null;
      renderWireCanvas();
    };

    wireCanvas.addEventListener('pointerdown', handleStart, { passive: false });
    wireCanvas.addEventListener('pointermove', handleMove, { passive: false });
    wireCanvas.addEventListener('pointerup', handleEnd, { passive: false });
    wireCanvas.addEventListener('pointercancel', handleEnd, { passive: false });
    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleEnd, { passive: false });
    wireCanvas.addEventListener('touchstart', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
    wireCanvas.addEventListener('touchmove', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
  }


  function triggerCctvFormsScatter() {
    if (cctvFormsScattered) return;
    cctvFormsScattered = true;
    TOTAL_FORMS = 30;
    if (typeof root !== 'undefined') root.__cctvFormsScattered = true;
    if (window) window.__cctvFormsScattered = true;

    const scannedTotEl = document.getElementById('scanned-total');
    if (scannedTotEl) scannedTotEl.textContent = '30';
    const uploadedTotEl = document.getElementById('uploaded-total');
    if (uploadedTotEl) uploadedTotEl.textContent = '30';

    // Pick 5 unique random cameras out of active cameras (exclude CAM 09 in Level 1 where power sabotage is inactive)
    const cfg = (typeof getCurrentLevelConfig === 'function') ? getCurrentLevelConfig() : null;
    let allCams = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (cfg && !cfg.hasPowerSabotage) {
      allCams = allCams.filter(c => c !== 8);
    }
    for (let i = allCams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCams[i], allCams[j]] = [allCams[j], allCams[i]];
    }
    const chosenCams = allCams.slice(0, 5);
    cctvActiveFormCams = new Set(chosenCams);

    if (cctvFormProps) {
      cctvFormProps.forEach((prop, idx) => {
        if (prop) prop.visible = cctvActiveFormCams.has(idx);
      });
    }

    // EXACT USER-REQUESTED TOAST MESSAGE
    showToast('Find remaining Form 45 from the camera');
    try {
      if (GameAudio && GameAudio.emergencyAlarm) GameAudio.emergencyAlarm();
      navigator.vibrate?.([60, 40, 60]);
    } catch (_) {}
    syncControlsUI();
  }

  function handleCctvFormCollect(camIdx) {
    if (state !== 'PLAYING' || !cctvOpen) return;

    // 1. Already holding check
    if (holdingForm) {
      showToast('SCAN HELD FORM FIRST (A)');
      try { navigator.vibrate?.(25); } catch (_) {}
      return;
    }

    // 2. Collect from CCTV camera room (zero lag, instant collection)
    cctvActiveFormCams.delete(camIdx);
    if (cctvFormProps && cctvFormProps[camIdx]) {
      cctvFormProps[camIdx].visible = false;
    }

    holdingForm = true;
    equippedItem = 'FORM';
    isFormStamped = true; // CCTV-recovered forms are already verified

    if (GameAudio && GameAudio.formCollected) GameAudio.formCollected();
    else if (GameAudio && GameAudio.click) GameAudio.click();

    showToast('FORM RETRIEVED · SCAN (A)');
    try { navigator.vibrate?.(45); } catch (_) {}
    updateCctvMonsterWarning();
    syncActiveSceneLights();
    syncControlsUI();
  }

  function handleRepairWiresAction() {
    if (state !== 'PLAYING') return;
    if (isWirePuzzleOpen) {
      closeWirePuzzle();
    } else if (cctvOpen && activeCamIdx === 8) {
      openWirePuzzle();
    } else {
      showToast('POWER CUT · GO TO CAM 09');
    }
  }
  if (btnFixWires) btnFixWires.addEventListener('click', handleRepairWiresAction);
  if (btnCloseWires) btnCloseWires.addEventListener('click', closeWirePuzzle);

  function triggerPowerSabotage() {
    if (typeof getCurrentLevelConfig === 'function' && !getCurrentLevelConfig().hasPowerSabotage) return;
    if (isPowerSabotaged || state !== 'PLAYING' || powerSabotageCountThisShift >= MAX_POWER_SABOTAGES_PER_SHIFT) return;
    isPowerSabotaged = true;
    powerSabotageCountThisShift++;
    powerSabotageTimer = 20.0;
    lastCountdownBeepSec = 20;

    if (emergencyStrobe) emergencyStrobe.classList.add('active');
    if (emergencySabotageHud) emergencySabotageHud.classList.add('active');
    if (sabotageCountdownVal) sabotageCountdownVal.textContent = '20.0s';
    if (wirePuzzleCountdown) wirePuzzleCountdown.textContent = 'TRIP IN: 20.0s';

    if (GameAudio.breakerSnap) GameAudio.breakerSnap(-0.6);
    if (GameAudio.powerSabotageSpark) GameAudio.powerSabotageSpark(-0.6);
    if (GameAudio.startEmergencyAlarm) GameAudio.startEmergencyAlarm();

    initWirePuzzle(true);

    showToast('POWER CUT · GO TO CAM 09');
  }

  function resolvePowerSabotage(byPuzzle = true, reason = null) {
    if (!isPowerSabotaged) return;
    isPowerSabotaged = false;
    powerSabotageTimer = 0;
    powerSabotageCooldown = 0;
    powerSabotageCooldown = 60.0; // 60s cooldown before Khaki can attempt sabotage again

    if (emergencyStrobe) emergencyStrobe.classList.remove('active');
    if (emergencySabotageHud) emergencySabotageHud.classList.remove('active');
    if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();

    if (world.wireBox && world.wireBox.alarmLight) {
      world.wireBox.alarmLight.intensity = 0;
    }

    // Repel Khaki back to School Gate
    GULLU_PATH[gulluStep] = 0;
    gulluSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[0]?.length || 1));
    updateIntruderPositions();

    if (byPuzzle) {
      showToast('POWER RESTORED');
    } else if (reason) {
      showToast('POWER RESTORED');
    }
  }

  function failPowerSabotage() {
    isPowerSabotaged = false;
    powerSabotageTimer = 0;

    if (emergencyStrobe) emergencyStrobe.classList.remove('active');
    if (emergencySabotageHud) emergencySabotageHud.classList.remove('active');
    if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();
    if (GameAudio.stopDoorBanging) GameAudio.stopDoorBanging('all');
    closeWirePuzzle();

    startPowerOutSequence();
    triggerJumpscare('gullu', 'Power failed after generator sabotage.');
  }

  // =========================================================================
  //  PTA SHARK ROUTER MINIGAME (CAM 10 LIBRARY FIBER OPTIC RESTORATION)
  // =========================================================================
  const cam10Prompt = document.getElementById('cctv-cam10-prompt');
  const cam10PromptTitle = document.getElementById('cam10-prompt-title');
  const cam10PromptSub = document.getElementById('cam10-prompt-sub');
  const btnCamOpenShark = document.getElementById('btn-cam-open-shark');
  if (btnCamOpenShark) btnCamOpenShark.addEventListener('click', openSharkPuzzle);

  const sharkPuzzleModal = document.getElementById('shark-puzzle-modal');
  const sharkPuzzleCounter = document.getElementById('shark-puzzle-counter');
  const sharkCanvas = document.getElementById('shark-canvas');
  const sharkCanvasCtx = sharkCanvas ? sharkCanvas.getContext('2d') : null;
  const sharkPuzzleStatus = document.getElementById('shark-puzzle-status');
  const btnCloseSharks = document.getElementById('btn-close-sharks');
  if (btnCloseSharks) btnCloseSharks.addEventListener('click', closeSharkPuzzle);

  const FIBER_WIRES = [
    { id: 'cyan',   y: 95,  hex: '#06b6d4', glowHex: '#22d3ee', darkHex: '#083344', label: 'CH-1 · OPTICAL WAN GATEWAY [HIGH-SPEED]' },
    { id: 'green',  y: 180, hex: '#16a34a', glowHex: '#4ade80', darkHex: '#052e16', label: 'CH-2 · ECP CLOUD SERVER [ENCRYPTED]' },
    { id: 'amber',  y: 265, hex: '#d97706', glowHex: '#facc15', darkHex: '#451a03', label: 'CH-3 · RTS PACKET BUS [LIVE STREAM]' },
    { id: 'purple', y: 350, hex: '#9333ea', glowHex: '#c084fc', darkHex: '#3b0764', label: 'CH-4 · BACKHAUL TRANSIT [BACKBONE]' }
 ];

  let isSharkPuzzleOpen = false;
  let sharksList = [];
  let sharkSparkParticles = [];
  let sharkDataPackets = [];
  let sharkAnimReq = null;
  let lastSharkFrameTime = performance.now();

  function initSharkPuzzle(forceNew = false) {
    sharkSparkParticles = [];
    sharkDataPackets = [];

    if (vpnDisconnected) {
      sharksList = [];

      // Random shark count: 3 to 5 sharks (default 4)
      const roll = Math.random();
      const numSharks = roll < 0.20 ? 3 : (roll < 0.75 ? 4 : 5);

      // Shuffled wires so sharks appear on different wires every game
      const wireIndices = [0, 1, 2, 3];
      for (let i = wireIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [wireIndices[i], wireIndices[j]] = [wireIndices[j], wireIndices[i]];
      }

      const assignedWires = [];
      if (numSharks === 4) {
        // 60% of the time, 1 per wire in shuffled order; 40% of the time, one wire has 2 sharks and another is clear!
        if (Math.random() < 0.60) {
          assignedWires.push(...wireIndices);
        } else {
          assignedWires.push(wireIndices[0], wireIndices[0], wireIndices[1], wireIndices[2]);
        }
      } else if (numSharks === 3) {
        assignedWires.push(wireIndices[0], wireIndices[1], wireIndices[2]);
      } else { // 5 sharks
        assignedWires.push(wireIndices[0], wireIndices[0], wireIndices[1], wireIndices[2], wireIndices[3]);
      }

      // Shuffled horizontal zones across the cables to break any diagonal patterns
      const horizontalZones = [
        { min: 95,  max: 165 }, // Zone 1: Far Left
        { min: 175, max: 245 }, // Zone 2: Mid Left
        { min: 255, max: 325 }, // Zone 3: Mid Right
        { min: 335, max: 415 }  // Zone 4: Far Right
 ];
      for (let i = horizontalZones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [horizontalZones[i], horizontalZones[j]] = [horizontalZones[j], horizontalZones[i]];
      }

      assignedWires.forEach((wIdx, sIdx) => {
        const wire = FIBER_WIRES[wIdx];
        const onSameWire = sharksList.filter(s => s.wireIdx === wIdx);

        let chosenX;
        if (onSameWire.length === 0) {
          const zone = horizontalZones[sIdx % horizontalZones.length];
          chosenX = Math.round(zone.min + Math.random() * (zone.max - zone.min));
        } else {
          // Second shark on same cable: keep at least 115px away so both are distinct
          const existingX = onSameWire[0].x;
          if (existingX > 255) {
            chosenX = Math.round(95 + Math.random() * Math.max(15, (existingX - 115 - 95)));
          } else {
            chosenX = Math.round((existingX + 115) + Math.random() * Math.max(15, (415 - (existingX + 115))));
          }
        }
        chosenX = Math.max(95, Math.min(415, chosenX));

        sharksList.push({
          id: sIdx,
          wireIdx: wIdx,
          x: chosenX,
          y: wire.y,
          yOffset: (Math.random() - 0.5) * 4,
          state: 'biting', // 'biting' | 'fleeing'
          fleeVx: 0,
          fleeVy: 0,
          rot: (Math.random() - 0.5) * 0.24, // Organic bite tilt (-7° to +7°)
          rotSpeed: 0,
          scale: 0.88 + Math.random() * 0.22, // Size variation (0.88x to 1.10x)
          wiggleOffset: Math.random() * 50
        });
      });

      if (sharkPuzzleCounter) {
        sharkPuzzleCounter.textContent = `SHARKS REMAINING: ${sharksList.length}`;
        sharkPuzzleCounter.className = 'shark-puzzle-counter alert';
      }
      if (sharkPuzzleStatus) {
        sharkPuzzleStatus.textContent = ` ${sharksList.length} SHARKS CLAMPED ONTO DATA CABLES! CLICK OR DRAG TO YANK THEM OFF!`;
        sharkPuzzleStatus.className = 'shark-puzzle-status alert';
      }
    } else {
      if (sharkPuzzleCounter) {
        sharkPuzzleCounter.textContent = 'ONLINE · 1000 Mbps';
        sharkPuzzleCounter.className = 'shark-puzzle-counter';
      }
      if (sharkPuzzleStatus) {
        sharkPuzzleStatus.textContent = ' ALL FIBER WIRES SECURED · NO SHARK INTERFERENCE';
        sharkPuzzleStatus.className = 'shark-puzzle-status success';
      }
    }

    lastSharkFrameTime = performance.now();
    startSharkLoop();
  }

  function openSharkPuzzle() {
    if (state !== 'PLAYING' || !cctvOpen || activeCamIdx !== 9) return;
    isSharkPuzzleOpen = true;
    updateCam10Prompt();
    if (sharkPuzzleModal) sharkPuzzleModal.classList.remove('hide');
    const hasActiveSharks = sharksList && sharksList.some(s => s.state === 'biting');
    if (!hasActiveSharks) {
      initSharkPuzzle();
    } else {
      lastSharkFrameTime = performance.now();
      startSharkLoop();
    }
  }

  function closeSharkPuzzle() {
    isSharkPuzzleOpen = false;
    if (sharkAnimReq) {
      cancelAnimationFrame(sharkAnimReq);
      sharkAnimReq = null;
    }
    if (sharkPuzzleModal) sharkPuzzleModal.classList.add('hide');
    updateCam10Prompt();
  }

  function startSharkLoop() {
    if (sharkAnimReq) cancelAnimationFrame(sharkAnimReq);
    function loop(t) {
      if (!isSharkPuzzleOpen) return;
      const dt = Math.min(0.05, (t - lastSharkFrameTime) / 1000);
      lastSharkFrameTime = t;
      updateSharkPuzzle(dt, t);
      renderSharkCanvas(t);
      sharkAnimReq = requestAnimationFrame(loop);
    }
    sharkAnimReq = requestAnimationFrame(loop);
  }

  function spawnSharkSparks(x, y, count = 8, isWater = false) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isWater ? (40 + Math.random() * 100) : (70 + Math.random() * 160);
      sharkSparkParticles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isWater ? 35 : 0),
        life: 0.35 + Math.random() * 0.40,
        maxLife: 0.75,
        color: isWater ? '#38bdf8' : (Math.random() > 0.4 ? '#facc15' : (Math.random() > 0.5 ? '#f97316' : '#ffffff')),
        size: isWater ? (3 + Math.random() * 3) : (2 + Math.random() * 2),
        isDiamond: Math.random() > 0.5
      });
    }
  }

  function updateSharkPuzzle(dt, now) {
    // 1. Update Sharks
    let bitingCount = 0;
    sharksList.forEach(s => {
      if (s.state === 'fleeing') {
        s.x += s.fleeVx * dt;
        s.y += s.fleeVy * dt;
        s.rot += s.rotSpeed * dt;
        s.scale = Math.max(0.1, s.scale - dt * 0.45);
      } else if (s.state === 'biting') {
        bitingCount++;
        if (Math.random() < 0.28) {
          spawnSharkSparks(s.x - 26, s.y, 2, false);
        }
      }
    });

    // 2. Data Packet stream when wires are clear
    if (bitingCount === 0 && Math.random() < 0.35) {
      const wIdx = Math.floor(Math.random() * FIBER_WIRES.length);
      sharkDataPackets.push({
        wireIdx: wIdx,
        x: 42,
        y: FIBER_WIRES[wIdx].y,
        speed: 380 + Math.random() * 180,
        color: FIBER_WIRES[wIdx].glowHex,
        size: 8 + Math.random() * 6
      });
    }

    // Update data packets
    for (let p = sharkDataPackets.length - 1; p >= 0; p--) {
      const dp = sharkDataPackets[p];
      dp.x += dp.speed * dt;
      if (dp.x > 480) sharkDataPackets.splice(p, 1);
    }

    // 3. Update Particles
    for (let i = sharkSparkParticles.length - 1; i >= 0; i--) {
      const p = sharkSparkParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) sharkSparkParticles.splice(i, 1);
    }
  }

  let sharkNoisePattern = null;

  function drawRibbedConduit(ctx, x1, y, x2, mainColor, darkColor, isDead = false) {
    if (x2 <= x1) return;
    const len = x2 - x1;

    // Dark under-sleeve (thick rubber/metal conduit jacket)
    ctx.fillStyle = darkColor;
    ctx.fillRect(x1, y - 6, len, 12);

    // Colored cable core
    ctx.fillStyle = isDead ? '#334155' : mainColor;
    ctx.fillRect(x1, y - 3, len, 6);

    // Ribbed rings every 6px (industrial ribbed conduit look!)
    ctx.fillStyle = '#0f172a';
    for (let rx = x1 + 4; rx < x2 - 2; rx += 7) {
      ctx.fillRect(rx, y - 6, 2, 12);
    }
    // Specular highlight line along top edge
    ctx.fillStyle = isDead ? '#475569' : 'rgba(255,255,255,0.45)';
    ctx.fillRect(x1, y - 5, len, 1.5);
  }

  function drawElectricArc(ctx, x1, y1, x2, y2, now) {
    ctx.save();
    ctx.strokeStyle = Math.random() > 0.3 ? '#facc15' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 8;
    const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 14;
    ctx.lineTo(midX, midY);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Secondary fork
    if (Math.random() < 0.6) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX + (Math.random() - 0.5) * 12, midY + (Math.random() - 0.5) * 14);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSharkCanvas(now) {
    if (!sharkCanvasCtx) return;
    const ctx = sharkCanvasCtx;
    const w = 520, h = 460;

    // 1. Dark weathered steel industrial backplate
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#161a22');
    bgGrad.addColorStop(0.5, '#0e1117');
    bgGrad.addColorStop(1, '#080a0f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Fine industrial metal/phosphor dither noise pattern
    if (!sharkNoisePattern) {
      const nCanvas = document.createElement('canvas');
      nCanvas.width = 64; nCanvas.height = 64;
      const nctx = nCanvas.getContext('2d');
      const img = nctx.createImageData(64, 64);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() < 0.5 ? 255 : 0;
        img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v;
        img.data[i+3] = Math.random() * 16 + 4;
      }
      nctx.putImageData(img, 0, 0);
      sharkNoisePattern = ctx.createPattern(nCanvas, 'repeat');
    }
    if (sharkNoisePattern) {
      ctx.fillStyle = sharkNoisePattern;
      ctx.fillRect(0, 0, w, h);
    }

    // Heavy industrial steel enclosure rim with beveled border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // 4 Hex head corner bolts (PS2 mechanical detail)
    const bolts = [{x: 16, y: 16}, {x: w - 16, y: 16}, {x: 16, y: h - 16}, {x: w - 16, y: h - 16}];
    bolts.forEach(b => {
      ctx.fillStyle = '#090d14';
      ctx.beginPath();
      ctx.arc(b.x, b.y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI / 3) + Math.PI / 6;
        const hx = b.x + Math.cos(ang) * 5.2;
        const hy = b.y + Math.sin(ang) * 5.2;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x - 3, b.y);
      ctx.lineTo(b.x + 3, b.y);
      ctx.stroke();
    });

    // Top Industrial Hazard Warning Stripe Bar
    function drawHazardBar(y, hgt) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(8, y, w - 16, hgt);
      ctx.clip();
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(8, y, w - 16, hgt);
      ctx.fillStyle = '#0f172a';
      for (let sx = -hgt * 2; sx < w + hgt * 2; sx += 18) {
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(sx + 10, y);
        ctx.lineTo(sx + 10 - hgt, y + hgt);
        ctx.lineTo(sx - hgt, y + hgt);
        ctx.closePath();
        ctx.fill();
      }
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, y, w - 16, hgt);
      ctx.restore();
    }
    drawHazardBar(9, 7);

    // CRT Screen Inner Bezel
    ctx.fillStyle = '#05080c';
    ctx.fillRect(14, 20, w - 28, 50);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 20, w - 28, 50);

    // Subtle phosphor radar grid lines
    ctx.strokeStyle = '#0e1822';
    ctx.lineWidth = 1;
    for (let gx = 30; gx < w - 30; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 74); ctx.lineTo(gx, h - 18); ctx.stroke();
    }
    for (let gy = 80; gy < h - 20; gy += 40) {
      ctx.beginPath(); ctx.moveTo(20, gy); ctx.lineTo(w - 20, gy); ctx.stroke();
    }

    // Diagnostic Header Readout
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('PTCL OPTICAL FIBER NETWORK TERMINAL // MODEL HG8245Q · PS2 BIOS v2.04', 24, 38);

    const activeSharks = sharksList.filter(s => s.state === 'biting').length;
    if (activeSharks > 0) {
      const blink = (Math.floor(now / 220) % 2 === 0);
      ctx.fillStyle = blink ? '#ef4444' : '#7f1d1d';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`● LOS ALARM: ${activeSharks} SHARK(S) CLAMPED ON OPTICAL BACKBONE ■`, 24, 56);
    } else {
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('● FIBER BACKBONE SYNCHRONIZED · 1000 Mbps · ALL CHANNELS NOMINAL', 24, 56);
    }

    // 2. Render 4 Ribbed Industrial Fiber Optic Conduits
    FIBER_WIRES.forEach((wire, idx) => {
      const wireSharks = sharksList.filter(s => s.wireIdx === idx && s.state === 'biting');
      const isDamaged = wireSharks.length > 0;
      const y = wire.y;

      // Heavy die-cast metal left terminal block
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(16, y - 16, 26, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(18, y - 14, 22, 28);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(36, y - 8, 8, 16);
      ctx.fillStyle = wire.hex;
      ctx.fillRect(38, y - 6, 6, 12);
      // Brass screw head
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath(); ctx.arc(26, y, 3, 0, Math.PI * 2); ctx.fill();

      // Heavy die-cast metal right terminal block
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(w - 42, y - 16, 26, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(w - 40, y - 14, 22, 28);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w - 44, y - 8, 8, 16);
      ctx.fillStyle = wire.hex;
      ctx.fillRect(w - 44, y - 6, 6, 12);
      // Brass screw head
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath(); ctx.arc(w - 26, y, 3, 0, Math.PI * 2); ctx.fill();

      // Industrial Stamped Wire Label above conduit
      ctx.fillStyle = isDamaged ? '#f87171' : '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(wire.label, 48, y - 16);

      if (isDamaged) {
        // Sort biting sharks from left to right along this wire
        wireSharks.sort((a, b) => a.x - b.x);

        let curX = 42;
        wireSharks.forEach((s, sIdx) => {
          const biteX = s.x - 26;

          // Conduit leading up to this shark's bite point
          // First segment is intact; subsequent segments after first bite are severed
          if (biteX > curX) {
            const isDeadSeg = (sIdx > 0);
            drawRibbedConduit(
              ctx,
              curX,
              y,
              biteX,
              isDeadSeg ? '#475569' : wire.hex,
              isDeadSeg ? '#1e293b' : (wire.darkHex || '#0f172a'),
              isDeadSeg
            );
          }

          // Shredded broken fiber gap with scorch marks
          ctx.fillStyle = '#450a0a';
          ctx.fillRect(biteX, y - 8, 12, 16);

          // High-voltage electrical arcs across the bitten gap
          drawElectricArc(ctx, biteX - 2, y, biteX + 10, y, now);

          curX = biteX + 10;
        });

        // Remainder of wire from last shark to right terminal is dead/severed
        if (curX < w - 44) {
          drawRibbedConduit(ctx, curX, y, w - 44, '#475569', '#1e293b', true);
        }
      } else {
        // Healthy Wire: full ribbed conduit with pulsating glowing optical core
        drawRibbedConduit(ctx, 42, y, w - 44, wire.hex, wire.darkHex || '#0f172a');

        // Glowing internal fiber optical core
        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.85 + Math.sin(now * 0.008 + idx) * 0.15;
        ctx.beginPath();
        ctx.moveTo(42, y);
        ctx.lineTo(w - 44, y);
        ctx.stroke();
        ctx.restore();
      }
    });

    // 3. Render High-speed Data Packets when wires clear
    sharkDataPackets.forEach(dp => {
      ctx.save();
      ctx.fillStyle = dp.color;
      ctx.shadowColor = dp.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(Math.round(dp.x), Math.round(dp.y - 3), Math.round(dp.size), 6);
      ctx.restore();
    });

    // 4. Render Sharks (PS2 Low-Poly Faceted / Pixel Art)
    sharksList.forEach(s => {
      drawSingleShark(ctx, s, now);
    });

    // 5. Render Pixel Sparks & Smoke Blocks
    sharkSparkParticles.forEach(p => {
      ctx.save();
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      const px = Math.round(p.x);
      const py = Math.round(p.y);
      const sz = Math.max(2, Math.round(p.size));
      if (p.isDiamond) {
        ctx.fillRect(px - sz, py, sz * 2, sz);
        ctx.fillRect(px, py - sz, sz, sz * 2);
      } else {
        ctx.fillRect(px, py, sz, sz);
      }
      ctx.restore();
    });

    // 6. Authentic CRT Horizontal Scanlines Overlay
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    for (let sl = 0; sl < h; sl += 2) {
      ctx.fillRect(0, sl, w, 1);
    }

    // CRT Vignette / Curved Screen Edge Shadow
    const crtVig = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, w * 0.72);
    crtVig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    crtVig.addColorStop(0.8, 'rgba(0, 0, 0, 0.35)');
    crtVig.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
    ctx.fillStyle = crtVig;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawSingleShark(ctx, shark, now) {
    ctx.save();
    ctx.translate(Math.round(shark.x), Math.round(shark.y + (shark.yOffset || 0)));
    ctx.rotate(shark.rot);
    ctx.scale(shark.scale, shark.scale);

    // Discrete 4-frame stepped animation (15-20fps console sprite feel!)
    const step = Math.floor(now * 0.009 + shark.wiggleOffset) % 4;
    const tailAngles = [0.18, 0.06, -0.18, -0.06];
    const tailWiggle = (shark.state === 'biting') ? tailAngles[step] : 0;
    const jawChomp = (shark.state === 'biting') ? (step % 2 === 0 ? 0 : 2) : 0;

    // --- 1. DORSAL BODY: Faceted Low-Poly / Pixel-Art Shading ---
    // Upper dorsal faceted polygon (highlight slate #334a6d)
    ctx.fillStyle = '#334a6d';
    ctx.beginPath();
    ctx.moveTo(-38, 0 - jawChomp);
    ctx.lineTo(-24, -14);
    ctx.lineTo(2, -22);
    ctx.lineTo(28, -14);
    ctx.lineTo(58, -3);
    ctx.lineTo(58, 2);
    ctx.lineTo(28, -4);
    ctx.lineTo(0, -8);
    ctx.lineTo(-24, -4);
    ctx.closePath();
    ctx.fill();

    // Mid-flank dorsal polygon (naval blue #1e293b)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-38, 0 - jawChomp);
    ctx.lineTo(-24, -4);
    ctx.lineTo(0, -8);
    ctx.lineTo(28, -4);
    ctx.lineTo(58, 2);
    ctx.lineTo(58, 6);
    ctx.lineTo(34, 10);
    ctx.lineTo(4, 10);
    ctx.lineTo(-18, 6);
    ctx.lineTo(-38, 0 - jawChomp);
    ctx.closePath();
    ctx.fill();

    // Pixelated crisp polygon edges
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // --- 2. RETRO PIXEL UNDERBELLY (Ivory #cbd5e1 with sawtooth contour) ---
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(-34, 4 + jawChomp);
    ctx.lineTo(-18, 12);
    ctx.lineTo(6, 14);
    ctx.lineTo(32, 10);
    ctx.lineTo(56, 4);
    ctx.lineTo(36, 6);
    ctx.lineTo(10, 8);
    ctx.lineTo(-14, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Underbelly shadow band (#94a3b8)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-28, 6 + jawChomp);
    ctx.lineTo(-12, 12);
    ctx.lineTo(12, 13);
    ctx.lineTo(34, 9);
    ctx.lineTo(12, 9);
    ctx.lineTo(-14, 8);
    ctx.closePath();
    ctx.fill();

    // --- 3. ANGULAR DORSAL FIN WITH "PTA" PIXEL STENCIL ---
    // Left facet (#283e5c)
    ctx.fillStyle = '#283e5c';
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.lineTo(8, -38);
    ctx.lineTo(10, -38);
    ctx.lineTo(4, -18);
    ctx.closePath();
    ctx.fill();

    // Right facet (#15202e)
    ctx.fillStyle = '#15202e';
    ctx.beginPath();
    ctx.moveTo(8, -38);
    ctx.lineTo(22, -14);
    ctx.lineTo(4, -18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0a0f18';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Chunky Yellow "PTA" Pixel Stencil Text on fin
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('PTA', 4, -22); // shadow
    ctx.fillStyle = '#facc15';
    ctx.fillText('PTA', 3, -23); // bright yellow
    ctx.restore();

    // --- 4. CAUDAL (TAIL) FIN WITH STEPPED WIGGLE ---
    ctx.save();
    ctx.translate(58, 2);
    ctx.rotate(tailWiggle);
    // Upper fin lobe (faceted)
    ctx.fillStyle = '#283e5c';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(18, -20);
    ctx.lineTo(13, -2);
    ctx.closePath();
    ctx.fill();
    // Lower fin lobe
    ctx.fillStyle = '#182436';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(13, -2);
    ctx.lineTo(16, 18);
    ctx.lineTo(4, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // --- 5. PECTORAL FIN ---
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(6, 24);
    ctx.lineTo(18, 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Highlight ridge on pectoral fin
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-4, 6);
    ctx.lineTo(5, 22);
    ctx.stroke();

    // --- 6. 3 GILL SLITS ---
    ctx.fillStyle = '#090d14';
    for (let g = 0; g < 3; g++) {
      ctx.fillRect(-12 + g * 5, -3, 2, 9);
    }

    // --- 7. MENACING GLOWING RED PIXEL EYE ---
    // Dark eye socket
    ctx.fillStyle = '#090d14';
    ctx.fillRect(-26, -9, 7, 7);
    // Red glowing pixel
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-25, -8, 5, 5);
    // White/yellow hot specular center glint
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-24, -7, 2, 2);

    // --- 8. SHARP JAGGED PIXEL TEETH CLAMPED ON CABLE ---
    // Mouth cavity
    ctx.fillStyle = '#1c0a0a';
    ctx.fillRect(-36, -3, 24, 7);

    // Upper Teeth (biting DOWN)
    ctx.fillStyle = '#ffffff';
    for (let tx = -34; tx <= -14; tx += 4) {
      ctx.beginPath();
      ctx.moveTo(tx, -4 - jawChomp);
      ctx.lineTo(tx + 2, 1);
      ctx.lineTo(tx + 4, -4 - jawChomp);
      ctx.closePath();
      ctx.fill();
    }

    // Lower Teeth (biting UP)
    for (let tx = -32; tx <= -12; tx += 4) {
      ctx.beginPath();
      ctx.moveTo(tx, 4 + jawChomp);
      ctx.lineTo(tx + 2, -1);
      ctx.lineTo(tx + 4, 4 + jawChomp);
      ctx.closePath();
      ctx.fill();
    }

    // Shading on teeth
    ctx.fillStyle = '#94a3b8';
    for (let tx = -34; tx <= -14; tx += 4) {
      ctx.fillRect(tx + 1, -4 - jawChomp, 1, 2);
    }

    // --- 9. ELECTRIC BITE SPARKS (If biting) ---
    if (shark.state === 'biting') {
      const sx = -22 + (Math.random() - 0.5) * 8;
      const sy = (Math.random() - 0.5) * 6;
      ctx.fillStyle = Math.random() > 0.4 ? '#facc15' : '#ffffff';
      ctx.fillRect(sx, sy, 3, 3);
    }

    ctx.restore();
  }

  function handleSharkCanvasClick(e) {
    if (!isSharkPuzzleOpen || !sharkCanvas) return;
    const rect = sharkCanvas.getBoundingClientRect();
    const scaleX = sharkCanvas.width / rect.width;
    const scaleY = sharkCanvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;

    // Check hit on any biting shark
    for (let i = 0; i < sharksList.length; i++) {
      const s = sharksList[i];
      if (s.state !== 'biting') continue;
      // Bounding box around shark
      const sc = s.scale || 1.0;
      const sy = s.y + (s.yOffset || 0);
      const hitBox = {
        minX: s.x - 45 * sc,
        maxX: s.x + 75 * sc,
        minY: sy - 32 * sc,
        maxY: sy + 26 * sc
      };

      if (cx >= hitBox.minX && cx <= hitBox.maxX && cy >= hitBox.minY && cy <= hitBox.maxY) {
        // HIT! Detach shark!
        s.state = 'fleeing';
        s.fleeVx = (Math.random() > 0.5 ? 1 : -1) * (260 + Math.random() * 200);
        s.fleeVy = -260 - Math.random() * 180;
        s.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * 9;

        spawnSharkSparks(s.x, s.y, 22, true);
        if (GameAudio.sharkYank) GameAudio.sharkYank();

        const remaining = sharksList.filter(sh => sh.state === 'biting').length;
        if (remaining > 0) {
          if (sharkPuzzleCounter) sharkPuzzleCounter.textContent = `SHARKS REMAINING: ${remaining}`;
          if (sharkPuzzleStatus) {
            sharkPuzzleStatus.textContent = `YANKED OFF! ${remaining} SHARKS STILL BITING!`;
            sharkPuzzleStatus.className = 'shark-puzzle-status alert';
          }
        } else {
          // ALL SHARKS REMOVED!
          if (sharkPuzzleCounter) {
            sharkPuzzleCounter.textContent = 'ONLINE · 1000 Mbps';
            sharkPuzzleCounter.className = 'shark-puzzle-counter';
          }
          if (sharkPuzzleStatus) {
            sharkPuzzleStatus.textContent = ' ALL SHARKS DETACHED! FIBER LINK 100% ONLINE!';
            sharkPuzzleStatus.className = 'shark-puzzle-status success';
          }
          if (GameAudio.sharkClear) GameAudio.sharkClear();
          else if (GameAudio.vpnReconnect) GameAudio.vpnReconnect();

          reconnectVpn();
          setTimeout(() => {
            closeSharkPuzzle();
          }, 650);
        }
        break;
      }
    }
  }

  if (sharkCanvas) {
    sharkCanvas.addEventListener('mousedown', handleSharkCanvasClick);
    sharkCanvas.addEventListener('touchstart', e => {
      if (e.touches && e.touches[0]) {
        handleSharkCanvasClick(e.touches[0]);
      }
    });
  }

  function updateCam10Prompt() {
    if (!cam10Prompt) return;
    cam10Prompt.classList.add('hide');
  }

  window.__openSharkPuzzle = openSharkPuzzle;
  window.__closeSharkPuzzle = closeSharkPuzzle;
  window.__getSharkPuzzleState = () => ({
    isOpen: isSharkPuzzleOpen,
    isTripped: vpnDisconnected,
    remainingSharks: sharksList.filter(s => s.state === 'biting').length,
    sharks: sharksList.map(s => ({ x: s.x, y: s.y, state: s.state, wireIdx: s.wireIdx }))
  });
  window.__detachAllSharks = () => {
    if (!sharkCanvas) return;
    const rect = sharkCanvas.getBoundingClientRect();
    const scaleX = sharkCanvas.width / rect.width;
    const scaleY = sharkCanvas.height / rect.height;
    sharksList.forEach(s => {
      if (s.state === 'biting') {
        const sy = s.y + (s.yOffset || 0);
        handleSharkCanvasClick({
          clientX: rect.left + s.x / scaleX,
          clientY: rect.top + sy / scaleY
        });
      }
    });
  };

  // --- ANGRY RED AURA LIGHTS FOR INTRUDERS ---
  let gulluAngryLight = null;
  let whitenerAngryLight = null;
  if (gulluMesh) {
    gulluAngryLight = new THREE.PointLight(0xff1111, 0, 5.0);
    gulluAngryLight.position.set(0, 2.35, 0.35);
    gulluAngryLight.layers.enable(0);
    gulluAngryLight.layers.enable(1);
    gulluMesh.add(gulluAngryLight);
    gulluMesh.userData.angryLight = gulluAngryLight;
  }
  if (whitenerMesh) {
    whitenerAngryLight = new THREE.PointLight(0xff1111, 0, 5.0);
    whitenerAngryLight.position.set(0, 2.35, 0.35);
    whitenerAngryLight.layers.enable(0);
    whitenerAngryLight.layers.enable(1);
    whitenerMesh.add(whitenerAngryLight);
    whitenerMesh.userData.angryLight = whitenerAngryLight;
  }

  // --- DYNAMIC SCENE LIGHT CULLER (PREVENTS WEBGL UNIFORM OVERFLOW ON MOBILE GPUS) ---
  const managedLights = [];
  let ambientLightObj = null;
  let ambientBaseColorHex = 0x323a2f;
  let ambientBaseIntensity = 0.72;
  const deadlineMoonlight = new THREE.DirectionalLight(0x8ec5fc, 1.05);
  deadlineMoonlight.position.set(4.5, 6.0, -3.5);
  deadlineMoonlight.layers.enable(0);
  deadlineMoonlight.layers.enable(1);
  function restoreAmbientLight() {
    if (!ambientLightObj) return;
    ambientLightObj.color.setHex(ambientBaseColorHex);
    ambientLightObj.intensity = ambientBaseIntensity;
  }
  (function initSceneLightManager() {
    scene.updateMatrixWorld(true);
    const menuLightSet = new Set([babuMenuLight, khakiMenuLight, babuRimLight, khakiRimLight, menuBackdropLight].filter(Boolean));
    const coreOfficeSet = new Set([
      typeof roomLight !== 'undefined' ? roomLight : null,
      typeof flashlight !== 'undefined' ? flashlight : null,
      (typeof leftHallLight !== 'undefined' && leftHallLight) ? leftHallLight.spot1 : null,
      (typeof leftHallLight !== 'undefined' && leftHallLight) ? leftHallLight.spot2 : null,
      (typeof rightWindowLight !== 'undefined' && rightWindowLight) ? rightWindowLight.spot1 : null,
      (typeof rightWindowLight !== 'undefined' && rightWindowLight) ? rightWindowLight.spot2 : null
    ].filter(Boolean));
    const cctvDynamicSet = new Set([
      typeof cctvCamLight !== 'undefined' ? cctvCamLight : null,
      typeof cctvRoomFillLight !== 'undefined' ? cctvRoomFillLight : null,
      typeof cctvMonsterLight !== 'undefined' ? cctvMonsterLight : null,
      typeof cam5Light !== 'undefined' ? cam5Light : null,
      typeof cam6Light !== 'undefined' ? cam6Light : null
    ].filter(Boolean));

    const tmpPos = new THREE.Vector3();
    scene.traverse((obj) => {
      if (obj && obj.isAmbientLight && !ambientLightObj) {
        ambientLightObj = obj;
        ambientBaseColorHex = obj.color ? obj.color.getHex() : 0x323a2f;
        ambientBaseIntensity = typeof obj.intensity === 'number' ? obj.intensity : 0.72;
        return;
      }
      if (!obj || (!obj.isPointLight && !obj.isSpotLight && !obj.isDirectionalLight)) return;
      if (lowUniformGpu && obj.castShadow) obj.castShadow = false;
      obj.getWorldPosition(tmpPos);
      const isMenu = menuLightSet.has(obj);
      const isCoreOffice = coreOfficeSet.has(obj);
      const isCctvDyn = cctvDynamicSet.has(obj);
      const isOfficeZone = !isMenu && !isCctvDyn && Math.abs(tmpPos.x) <= 7.5 && Math.abs(tmpPos.z) <= 8.0 && tmpPos.y <= 5.0;
      managedLights.push({
        light: obj,
        parent: obj.parent,
        worldPos: tmpPos.clone(),
        baseIntensity: obj.intensity || 0,
        isMenu,
        isCoreOffice,
        isOfficeZone,
        isCctvDyn
      });
    });
  })();

  function setLightAttached(entry, attach) {
    if (!entry || !entry.parent || !entry.light) return;
    const isAttached = entry.light.parent === entry.parent;
    if (attach && !isAttached) {
      entry.parent.add(entry.light);
    } else if (!attach && isAttached) {
      entry.parent.remove(entry.light);
    }
  }

  function syncActiveSceneLights() {
    if (managedLights.length === 0) return;
    let curState = 'MENU';
    try { curState = state; } catch (_) { curState = document.body.classList.contains('menu-active') ? 'MENU' : 'PLAYING'; }
    let isCctv = false;
    try { isCctv = Boolean(cctvOpen); } catch (_) {}
    let camIdx = 0;
    try { camIdx = activeCamIdx; } catch (_) {}

    if (curState === 'POWEROUT' && typeof powerOutMode !== 'undefined' && powerOutMode === 'deadline') {
      if (deadlineMoonlight.parent !== scene) scene.add(deadlineMoonlight);
      for (const entry of managedLights) {
        const isMoon = (typeof leftPeekMoonlight !== 'undefined' && entry.light === leftPeekMoonlight) ||
                       (typeof rightPeekMoonlight !== 'undefined' && entry.light === rightPeekMoonlight);
        setLightAttached(entry, isMoon);
      }
      return;
    }
    if (deadlineMoonlight.parent === scene) scene.remove(deadlineMoonlight);

    if (curState === 'MENU') {
      for (const entry of managedLights) {
        setLightAttached(entry, entry.isMenu);
      }
      return;
    }

    if (!isCctv) {
      const officeCandidates = [];
      for (const entry of managedLights) {
        if (entry.isCoreOffice || entry.isOfficeZone) {
          officeCandidates.push(entry);
        } else {
          setLightAttached(entry, false);
        }
      }
      officeCandidates.sort((a, b) => {
        if (a.isCoreOffice !== b.isCoreOffice) return a.isCoreOffice ? -1 : 1;
        return (b.baseIntensity || 0) - (a.baseIntensity || 0);
      });
      const maxOfficeLights = lowUniformGpu ? 10 : officeCandidates.length;
      officeCandidates.forEach((entry, idx) => {
        setLightAttached(entry, idx < maxOfficeLights);
      });
      return;
    }

    // CCTV active: attach dynamic CCTV rig lights + nearest room lights for active camera
    const zoneDef = (typeof cctvZones !== 'undefined' && cctvZones && cctvZones[camIdx]) ? cctvZones[camIdx] : null;
    const zPos = zoneDef ? (zoneDef.camPos || zoneDef.pos || null) : null;
    const camVec = Array.isArray(zPos)
      ? new THREE.Vector3(zPos[0], zPos[1], zPos[2])
      : (zPos && typeof zPos.x === 'number' ? new THREE.Vector3(zPos.x, zPos.y, zPos.z) : camera.position.clone());

    const cctvCandidates = [];
    for (const entry of managedLights) {
      if (entry.isCctvDyn) {
        if (typeof cam5Light !== 'undefined' && entry.light === cam5Light) setLightAttached(entry, camIdx === 4);
        else if (typeof cam6Light !== 'undefined' && entry.light === cam6Light) setLightAttached(entry, camIdx === 5);
        else setLightAttached(entry, true);
      } else if (!entry.isMenu && !entry.isOfficeZone && !entry.isCoreOffice) {
        const dist = camVec ? entry.worldPos.distanceTo(camVec) : 999;
        cctvCandidates.push({ entry, dist });
        setLightAttached(entry, false);
      } else {
        setLightAttached(entry, false);
      }
    }
    cctvCandidates.sort((a, b) => a.dist - b.dist);
    const maxCctvRoomLights = lowUniformGpu ? 4 : 8;
    let count = 0;
    for (const item of cctvCandidates) {
      if (count >= maxCctvRoomLights || item.dist > 26) break;
      setLightAttached(item.entry, true);
      count++;
    }
  }
  syncActiveSceneLights();

  function setHumanoidPeekMode(mesh, isPeeking) {
    if (!mesh || !mesh.userData) return;
    const ud = mesh.userData;
    // Always keep complete body visible: torso, daman, arms, legs, neck (no floating heads!)
    if (ud.bodyGroup) ud.bodyGroup.visible = true;
    if (ud.neck) {
      ud.neck.visible = true;
      ud.neck.scale.set(1, 1, 1);
    }
    if (ud.torso) ud.torso.visible = true;
    if (ud.daman) ud.daman.visible = true;
    if (ud.armL) ud.armL.visible = true;
    if (ud.armR) ud.armR.visible = true;
    if (ud.legL) {
      ud.legL.rotation.set(0, 0, 0);
      ud.legL.visible = true;
    }
    if (ud.legR) {
      ud.legR.rotation.set(0, 0, 0);
      ud.legR.visible = true;
    }
    // Tuck forearms and hands tight against the chest in peek mode so walkie-talkie and hands NEVER reach forward into the window!
    if (ud.fArmL) {
      if (isPeeking) {
        ud.fArmL.rotation.set(-0.25, 0.05, 0);
      } else {
        if (ud.type === 'whitener') ud.fArmL.rotation.set(-0.45, 0.15, -0.10);
        else ud.fArmL.rotation.set(-0.85, 0, 0);
      }
    }
    if (ud.fArmR) {
      if (isPeeking) {
        ud.fArmR.rotation.set(-0.28, -0.05, 0.10);
      } else {
        if (ud.type === 'whitener') ud.fArmR.rotation.set(-1.15, -0.15, 0.22);
        else ud.fArmR.rotation.set(-1.25, 0, 0.35);
      }
    }
  }

  // =========================================================================
  //  CCTV NIGHT VISION & HORROR BEAM LIGHTING SHADERS (MATCHES USER IMAGES 1 & 2)
  // Supports:
  // - 'cctv': Infrared phosphor green surveillance tint (#0f2a1b / #66ffaa, Image 1)
  // - 'flashed': Stark Horror Beam searchlight glare (#ffe6a3, 6.0, Image 2)
  // - 'moonlight': Cold faint moonlight rim in dark corridors
  // =========================================================================
  function applyMonsterLighting(mesh, mode) {
    if (!mesh) return;
    mesh.traverse(child => {
      if (child.name === 'demonEyes') return; // Preserve demon eyes material!
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(mat => {
          if (!mat.userData) mat.userData = {};
          if (!mat.userData.origMatProps) {
            mat.userData.origMatProps = {
              color: mat.color ? mat.color.clone() : null,
              emissive: mat.emissive ? mat.emissive.clone() : null,
              emissiveIntensity: mat.emissiveIntensity !== undefined ? mat.emissiveIntensity : 0.40
            };
          }
          if (mode === 'cctv_shadow') {
            if (mat.color) mat.color.setHex(0x070b08);
            if (mat.emissive) {
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0.0;
            }
          } else {
            if (mat.color && mat.userData.origMatProps && mat.userData.origMatProps.color) {
              mat.color.copy(mat.userData.origMatProps.color);
            }
            if (mat.emissive) {
              if (mode === 'dark_lurking') {
                mat.emissive.setHex(0x000000);
                mat.emissiveIntensity = 0.0;
              } else if (mat.userData.origMatProps && mat.userData.origMatProps.emissive) {
                mat.emissive.copy(mat.userData.origMatProps.emissive);
                mat.emissiveIntensity = mat.userData.origMatProps.emissiveIntensity;
              }
            }
          }
        });
      }
    });
  }

  function applyMonsterMoonlight(mesh, isLit) {
    applyMonsterLighting(mesh, isLit ? 'flashed' : 'dark_lurking');
  }

  function setHumanoidPeekLit(mesh, isLit) {
    if (!mesh) return;
    mesh.visible = isLit;
    applyMonsterLighting(mesh, isLit ? 'flashed' : 'dark_lurking');
  }

  function setHumanoidLurkingVoid(mesh, isLurking) {
    if (!mesh || !mesh.userData) return;
    const ud = mesh.userData;
    if (ud.demonEyes) ud.demonEyes.visible = isLurking;
    if (ud.bodyGroup) ud.bodyGroup.visible = !isLurking;
    if (ud.headMesh) ud.headMesh.visible = !isLurking;
    if (ud.neck) ud.neck.visible = !isLurking;
    if (ud.head) {
      ud.head.children.forEach(c => {
        if (c !== ud.demonEyes) {
          c.visible = !isLurking;
        }
      });
    }
  }

  function setHumanoidEnraged(mesh, enraged) {
    if (!mesh) return;
    mesh.userData.isEnraged = enraged;
    if (mesh.userData && mesh.userData.setSkin) {
      mesh.userData.setSkin(enraged ? 'enraged' : 'default', 0);
    }
    if (!enraged && mesh.userData) {
      if (mesh.userData.head) {
        mesh.userData.head.scale.set(1.0, 1.0, 1.0);
        mesh.userData.head.position.set(0, 2.45, 0.03);
      }
      if (mesh.userData.torso) {
        mesh.userData.torso.scale.set(1.0, 1.0, 1.0);
        mesh.userData.torso.position.set(0, 1.48, 0);
      }
    }
    if (mesh.userData && mesh.userData.angryLight) {
      mesh.userData.angryLight.intensity = enraged ? 3.5 : 0;
    }
  }

  // --- 3D IMPACT DEBRIS PARTICLE SYSTEM (RUST FLAKES, SPLINTERS, SPARKS & DUST) ---
  const debrisGroup = new THREE.Group();
  scene.add(debrisGroup);

  const activeDebris = [];
  const debrisBoxGeo = new THREE.BoxGeometry(0.042, 0.042, 0.042);
  const debrisSplinterGeo = new THREE.BoxGeometry(0.018, 0.11, 0.018);

  const debrisMaterials = {
    rust: new THREE.MeshBasicMaterial({ color: 0x852414 }),
    spark: new THREE.MeshBasicMaterial({ color: 0xffdd44 }),
    plaster: new THREE.MeshBasicMaterial({ color: 0xbdb7ab }),
    woodDark: new THREE.MeshBasicMaterial({ color: 0x4a2810 }),
    woodLight: new THREE.MeshBasicMaterial({ color: 0xc28236 })
  };

  function spawnDebrisBurst(type, severity, origin) {
    const count = severity === 'heavy' ? 24 : severity === 'medium' ? 14 : 7;
    const isDoor = type === 'door';

    for (let i = 0; i < count; i++) {
      const isSplinter = !isDoor && Math.random() < 0.65;
      const geo = isSplinter ? debrisSplinterGeo : debrisBoxGeo;
      
      let mat;
      if (isDoor) {
        const r = Math.random();
        mat = r < 0.45 ? debrisMaterials.rust : r < 0.75 ? debrisMaterials.plaster : debrisMaterials.spark;
      } else {
        const r = Math.random();
        mat = r < 0.50 ? debrisMaterials.woodDark : r < 0.85 ? debrisMaterials.woodLight : debrisMaterials.plaster;
      }

      const pMesh = new THREE.Mesh(geo, mat);
      pMesh.position.set(
        origin.x + (isDoor ? 0.08 : -0.08),
        origin.y + (Math.random() - 0.5) * 0.8,
        origin.z + (Math.random() - 0.5) * 0.9
      );
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      
      const speed = (severity === 'heavy' ? 2.8 : 1.9) * (0.6 + Math.random() * 0.8);
      const vx = isDoor ? (speed * 0.85) : (-speed * 0.85);
      const vy = (Math.random() - 0.15) * 2.2;
      const vz = (Math.random() - 0.5) * 2.0;

      debrisGroup.add(pMesh);
      activeDebris.push({
        mesh: pMesh,
        vx, vy, vz,
        rx: (Math.random() - 0.5) * 12,
        ry: (Math.random() - 0.5) * 12,
        rz: (Math.random() - 0.5) * 12,
        life: 0.65 + Math.random() * 0.35,
        maxLife: 1.0
      });
    }
  }

  function updateDebris(dt) {
    for (let i = activeDebris.length - 1; i >= 0; i--) {
      const d = activeDebris[i];
      d.life -= dt;
      if (d.life <= 0) {
        debrisGroup.remove(d.mesh);
        activeDebris.splice(i, 1);
        continue;
      }
      d.vy -= dt * 8.2;
      d.mesh.position.x += d.vx * dt;
      d.mesh.position.y += d.vy * dt;
      d.mesh.position.z += d.vz * dt;
      d.mesh.rotation.x += d.rx * dt;
      d.mesh.rotation.y += d.ry * dt;
      d.mesh.rotation.z += d.rz * dt;
      const s = Math.max(0.01, d.life / d.maxLife);
      d.mesh.scale.set(s, s, s);
    }
  }

  // Bind Blueprint Camera Node Buttons
  const camButtons = Array.from(document.querySelectorAll('.cam-node'));
  camButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.cam, 10);
      selectCam(idx);
    });
  });

  // Progressive 3-Halqa Campaign Progression
  // Level 1: NA-47 Islamabad (Govt Boys High School) - Basic Stalker AI + Chai + PTCL (NO Generator/Power Sabotage)
  // Level 2: NA-128 Lahore (Old Degree College) - Introduces WAPDA Generator Sabotage + Wire Puzzle
  // Level 3: NA-241 Karachi (RO Central Warehouse) - Introduces Official ECP Seal Verification (Form-47 Whitener Trap)
  const HALQA_CONFIGS = {
    1: {
      halqaId: 'NA-47',
      levelNum: 1,
      city: 'Islamabad',
      locationName: 'Govt Boys High School',
      label: 'NA-47 · LEVEL 1',
      badge: 'NA-47 (ISLAMABAD)',
      hudBadge: 'HALQA NA-47 · LEVEL 1',
      hudColor: '#4ade80',
      targetForms: 20,
      nightDuration: 720,
      babuSpawnSec: 50,
      khakiSpawnSec: 100,
      hasPowerSabotage: false, // NO GENERATOR / NO WAPDA SABOTAGE IN LEVEL 1
      hasChai: true,
      hasPtclTrip: true,
      desc: 'Halqa NA-47 Islamabad · Basic Surveillance, Left Door & Window Defense, Chacha Chai & PTCL Wi-Fi. (No Power Sabotage)',
      baseGWait: 26.0,
      baseWWait: 22.0,
      peekGWait: 8.5,
      peekWWait: 5.0,
      peekAttackChance: 0.12,
      rushDur: 1.65,
      rushCollisionDmg: 12,
      baseDrain: 0.06,
      loadMultiplier: 0.10,
      flashExtraDrain: 0.45,
      chaiDrainRate: 0.30,
      sharkTimerMin: 115,
      sharkTimerMax: 155,
      stunChance: 0.25,
      deskChaiBoost: 35
    },
    2: {
      halqaId: 'NA-128',
      levelNum: 2,
      city: 'Lahore',
      locationName: 'Old Degree College',
      label: 'NA-128 · LEVEL 2',
      badge: 'NA-128 (LAHORE)',
      hudBadge: 'HALQA NA-128 · LEVEL 2',
      hudColor: '#facc15',
      targetForms: 28,
      nightDuration: 720,
      babuSpawnSec: 50, // 30 in-game minutes
      khakiSpawnSec: 100, // 1 in-game hour
      hasPowerSabotage: true, // WAPDA GENERATOR WIRE SABOTAGE ACTIVE
      hasChai: true,
      hasPtclTrip: true,
      desc: 'Halqa NA-128 Lahore · WAPDA Generator Sabotage Active! Khaki attacks CAM 09 junction box. Fix the 4 colored breaker wires within 20s.',
      baseGWait: 20.0,
      baseWWait: 16.5,
      peekGWait: 6.5,
      peekWWait: 4.0,
      peekAttackChance: 0.18,
      rushDur: 1.35,
      rushCollisionDmg: 18,
      baseDrain: 0.08,
      loadMultiplier: 0.14,
      flashExtraDrain: 0.55,
      chaiDrainRate: 0.36,
      sharkTimerMin: 90,
      sharkTimerMax: 125,
      stunChance: 0.15,
      deskChaiBoost: 30
    },
    3: {
      halqaId: 'NA-241',
      levelNum: 3,
      city: 'Karachi',
      locationName: 'Central RO Warehouse',
      label: 'NA-241 · LEVEL 3',
      badge: 'NA-241 (KARACHI)',
      hudBadge: 'HALQA NA-241 · LEVEL 3',
      hudColor: '#f87171',
      targetForms: 35,
      nightDuration: 720,
      babuSpawnSec: 50,
      khakiSpawnSec: 100,
      hasPowerSabotage: true,
      hasChai: true,
      hasPtclTrip: true,
      hasSealVerification: true,
      desc: 'Halqa NA-241 Karachi · RO Warehouse. Full Power Sabotage + Form-47 Whitener Trap & ECP Seal Verification!',
      baseGWait: 14.0,
      baseWWait: 12.0,
      peekGWait: 5.0,
      peekWWait: 3.2,
      peekAttackChance: 0.25,
      rushDur: 1.15,
      rushCollisionDmg: 22,
      baseDrain: 0.11,
      loadMultiplier: 0.20,
      flashExtraDrain: 0.75,
      chaiDrainRate: 0.45,
      sharkTimerMin: 70,
      sharkTimerMax: 105,
      stunChance: 0.12,
      deskChaiBoost: 25
    }
  };
  const CAMPAIGN_LEVELS = [1, 2, 3];
  let currentHalqaLevel = 1;

  function getCurrentLevelConfig() {
    return HALQA_CONFIGS[currentHalqaLevel] || HALQA_CONFIGS[1];
  }

  const CAM_POSITIONS_BY_LEVEL = {
    1: {
      0: { left: '142px', top: '14px', right: 'auto' },  // CAM 01
      1: { left: '142px', top: '76px', right: 'auto' },  // CAM 02
      8: { left: '10px',  top: '66px', right: 'auto' },  // CAM 09 (hidden in Level 1)
      9: { right: '10px', top: '66px', left: 'auto' },   // CAM 10
      2: { left: '92px',  top: '136px', right: 'auto' }, // CAM 03
      6: { left: '10px',  top: '138px', right: 'auto' }, // CAM 07
      4: { left: '92px',  top: '196px', right: 'auto' }, // CAM 05
      3: { left: '200px', top: '136px', right: 'auto' }, // CAM 04
      7: { right: '10px', top: '138px', left: 'auto' },  // CAM 08
      5: { left: '200px', top: '196px', right: 'auto' }  // CAM 06
    },
    2: {
      0: { left: '144px', top: '12px', right: 'auto', borderColor: '#4ade80' },  // CAM 01 College Gate
      8: { left: '12px',  top: '18px', right: 'auto', borderColor: '#eab308' },  // CAM 09 WAPDA 440V Substation (Top-Left)
      9: { right: '12px', top: '18px', left: 'auto',  borderColor: '#38bdf8' },  // CAM 10 Examination Archives (Top-Right)
      1: { left: '142px', top: '78px', right: 'auto', borderColor: '#22c55e' },  // CAM 02 Quadrangle Lawn
      6: { left: '12px',  top: '92px', right: 'auto', borderColor: '#14b8a6' },  // CAM 07 Chemistry Wing & Specimens
      7: { right: '12px', top: '92px', left: 'auto',  borderColor: '#c084fc' },  // CAM 08 Principal's Chamber
      2: { left: '86px',  top: '148px', right: 'auto', borderColor: '#22c55e' },  // CAM 03 West Cloister Veranda
      3: { left: '202px', top: '148px', right: 'auto', borderColor: '#60a5fa' },  // CAM 04 Grand Amphitheatre
      4: { left: '86px',  top: '206px', right: 'auto', borderColor: '#4ade80' },  // CAM 05 West Entry (Left Door)
      5: { left: '202px', top: '206px', right: 'auto', borderColor: '#4ade80' }   // CAM 06 Botany Alley (Right Shutter)
    },
    3: {
      0: { left: '144px', top: '12px', right: 'auto', borderColor: '#f97316' },  // CAM 01 Dock Gate
      8: { left: '12px',  top: '18px', right: 'auto', borderColor: '#eab308' },  // CAM 09 K-Electric Substation
      9: { right: '12px', top: '18px', left: 'auto',  borderColor: '#06b6d4' },  // CAM 10 Fiber Vault
      1: { left: '142px', top: '78px', right: 'auto', borderColor: '#3b82f6' },  // CAM 02 Cargo Bay
      6: { left: '12px',  top: '92px', right: 'auto', borderColor: '#ef4444' },  // CAM 07 Diesel Genset
      7: { right: '12px', top: '92px', left: 'auto',  borderColor: '#a855f7' },  // CAM 08 RO Strongroom
      2: { left: '86px',  top: '148px', right: 'auto', borderColor: '#f59e0b' },  // CAM 03 West Aisle
      3: { left: '202px', top: '148px', right: 'auto', borderColor: '#10b981' },  // CAM 04 Customs Bay
      4: { left: '86px',  top: '206px', right: 'auto', borderColor: '#f97316' },  // CAM 05 West Dock
      5: { left: '202px', top: '206px', right: 'auto', borderColor: '#f97316' }   // CAM 06 Ventilation
    }
  };

  function setCamButtonPositions(lvl) {
    const coords = CAM_POSITIONS_BY_LEVEL[lvl] || CAM_POSITIONS_BY_LEVEL[1];
    Object.keys(coords).forEach(camIdx => {
      const btn = document.querySelector(`.cam-node[data-cam="${camIdx}"]`);
      if (btn) {
        const c = coords[camIdx];
        if (c.left !== undefined) btn.style.left = c.left;
        if (c.top !== undefined) btn.style.top = c.top;
        if (c.right !== undefined) btn.style.right = c.right;
        if (c.borderColor) {
          btn.style.borderColor = c.borderColor;
        } else if (lvl === 1) {
          if (camIdx === '8') btn.style.borderColor = '#f59e0b';
          else if (camIdx === '9') btn.style.borderColor = '#38bdf8';
          else btn.style.borderColor = '#22c55e';
        }
      }
    });
  }

  function applyHalqaLevel(lvlNum) {
    currentHalqaLevel = lvlNum;

    window.currentHalqaLevel = lvlNum;

    if (lvlNum === 3 && endCreditsVideo) {
      try { endCreditsVideo.load(); } catch (_) {}
    }

    window.applyHalqaLevel = applyHalqaLevel;
    const cfg = getCurrentLevelConfig();
    TOTAL_FORMS = 30;
    formsInBox = 25;
    cctvFormsScattered = false;
    cctvActiveFormCams = new Set();
    if (typeof root !== 'undefined') root.__cctvFormsScattered = false;
    if (window) window.__cctvFormsScattered = false;
    const scannedTotEl = document.getElementById('scanned-total');
    if (scannedTotEl) scannedTotEl.textContent = '30';
    const uploadedTotEl = document.getElementById('uploaded-total');
    if (uploadedTotEl) uploadedTotEl.textContent = '30';
    if (cctvFormProps) {
      cctvFormProps.forEach(p => { if (p) p.visible = false; });
    }
    isFormStamped = !cfg.hasSealVerification;
    if (window.__updateForm45Texture) window.__updateForm45Texture(1, 25, isFormStamped);
    if (state === 'PLAYING' && window.GameAudio && typeof window.GameAudio.startAmbience === 'function') {
      window.GameAudio.startAmbience(lvlNum);
    }

    // Switch between Level 1 (School), Level 2 (Old Degree College), and Level 3 (RO Warehouse) CCTV Blueprints
    const bpLvl1 = document.getElementById('bp-svg-lvl1');
    const bpLvl2 = document.getElementById('bp-svg-lvl2');
    const bpLvl3 = document.getElementById('bp-svg-lvl3');
    const bpTitle = document.getElementById('bp-map-title');
    const bpCamCount = document.getElementById('bp-map-camcount');

    if (cfg.levelNum === 3) {
      if (bpLvl1) bpLvl1.style.display = 'none';
      if (bpLvl2) bpLvl2.style.display = 'none';
      if (bpLvl3) bpLvl3.style.display = 'block';
      if (bpTitle) {
        bpTitle.textContent = 'NA-241: RO CENTRAL WAREHOUSE (KARACHI)';
        bpTitle.style.color = '#f87171';
      }
      if (bpCamCount) {
        bpCamCount.textContent = '10 CAMS · K-ELECTRIC ON';
        bpCamCount.style.color = '#fca5a5';
        bpCamCount.style.background = '#450a0a';
        bpCamCount.style.borderColor = '#b91c1c';
      }
      setCamButtonPositions(3);
    } else if (cfg.levelNum === 2) {
      if (bpLvl1) bpLvl1.style.display = 'none';
      if (bpLvl2) bpLvl2.style.display = 'block';
      if (bpLvl3) bpLvl3.style.display = 'none';
      if (bpTitle) {
        bpTitle.textContent = 'NA-128: OLD DEGREE COLLEGE (LAHORE)';
        bpTitle.style.color = '#facc15';
      }
      if (bpCamCount) {
        bpCamCount.textContent = '10 CAMS · WAPDA ON';
        bpCamCount.style.color = '#fde047';
        bpCamCount.style.background = '#451a03';
        bpCamCount.style.borderColor = '#d97706';
      }
      setCamButtonPositions(2);
    } else {
      if (bpLvl1) bpLvl1.style.display = 'block';
      if (bpLvl2) bpLvl2.style.display = 'none';
      if (bpLvl3) bpLvl3.style.display = 'none';
      if (bpTitle) {
        bpTitle.textContent = 'NA-47: GOVT BOYS HIGH SCHOOL';
        bpTitle.style.color = '#4ade80';
      }
      if (bpCamCount) {
        bpCamCount.textContent = '9 CAMS · GEN OFF';
        bpCamCount.style.color = '#86efac';
        bpCamCount.style.background = '#052e16';
        bpCamCount.style.borderColor = '#166534';
      }
      setCamButtonPositions(1);
    }

    // Power generator visibility: hidden in Level 1 (NA-47), fully active in Level 2 (NA-128)
    const cam09Btn = document.getElementById('cam-btn-8') || document.querySelector('[data-cam="8"]');
    const cam09Bp = document.getElementById('bp-group-cam09');
    if (cam09Btn) {
      cam09Btn.style.display = cfg.hasPowerSabotage ? '' : 'none';
    }
    if (cam09Bp) {
      cam09Bp.style.display = cfg.hasPowerSabotage ? '' : 'none';
    }
    if (!cfg.hasPowerSabotage) {
      if (typeof activeCamIdx !== 'undefined' && activeCamIdx === 8 && typeof selectCam === 'function') selectCam(0);
      const cam09P = document.getElementById('cctv-cam09-prompt');
      if (cam09P) cam09P.classList.add('hide');
    }
    if (typeof hudNightLbl !== 'undefined' && hudNightLbl) {
      hudNightLbl.textContent = cfg.hudBadge;
      hudNightLbl.style.color = cfg.hudColor;
    }
    const hudBoxVal = document.getElementById('hud-forms-box-val');
    if (hudBoxVal && typeof formsInBox !== 'undefined') hudBoxVal.textContent = formsInBox;

    const diffValSpan = document.getElementById('fnaf-diff-val');
    if (diffValSpan) {
      diffValSpan.textContent = `< ${cfg.label} >`;
      diffValSpan.style.color = cfg.hudColor;
    }

    // Switch 3D World Props and CCTV Camera Angles for Current Halqa Level
    if (window.World3D && window.World3D.applyLevel3DTheme) {
      window.World3D.applyLevel3DTheme(cfg.levelNum);
    } else if (window.__world3dApplyLevelTheme) {
      window.__world3dApplyLevelTheme(cfg.levelNum);
    }
    if (typeof cctvOpen !== 'undefined' && cctvOpen && typeof cctvZones !== 'undefined' && cctvZones && typeof activeCamIdx !== 'undefined' && cctvZones[activeCamIdx]) {
      const z = cctvZones[activeCamIdx];
      if (typeof camTitleEl !== 'undefined' && camTitleEl) camTitleEl.textContent = `${z.id} · ${z.name}`;
    }
  }

  // Progressive 4-Level NA-47 Campaign (EASY -> MEDIUM -> HARD -> IMPOSSIBLE)
  const LEVEL_ORDER = ['EASY', 'MEDIUM', 'HARD', 'IMPOSSIBLE'];
  let unlockedLevelIdx = 0; // 0=EASY, 1=MEDIUM, 2=HARD, 3=IMPOSSIBLE
  let selectedDifficulty = 'EASY';
  const currentNight = 1; // Kept for legacy compatibility

  const DIFFICULTY_SETTINGS = {
    EASY: {
      label: 'EASY (آسان)',
      nightDuration: 720, // 12 Minutes (1.5s = 1 in-game minute: 10:00 PM to 06:00 AM)
      hudBadge: 'EASY',
      hudColor: '#4ade80',
      desc: 'Khaki moves slowly with heavy strikes; Babu moves quickly with light taps.',
      baseGWait: 26.0,  // Khaki: slow stalker
      baseWWait: 22.0,  // Babu: reduced visit frequency
      peekGWait: 8.5,   // Khaki lingers at peek window
      peekWWait: 5.0,   // Babu checks peek window
      peekAttackChance: 0.12, // 88% chance to retreat if player waits out peek without scanning
      rushDur: 1.65,
      rushCollisionDmg: 12,
      baseDrain: 0.06,
      loadMultiplier: 0.10,
      flashExtraDrain: 0.45,
      chaiDrainRate: 0.30,
      sharkTimerMin: 115,
      sharkTimerMax: 155,
      stunChance: 0.25,
      deskChaiBoost: 35
    },
    MEDIUM: {
      label: 'MEDIUM (معمولی)',
      nightDuration: 720, // 12 Minutes (1.5s = 1 in-game minute: 10:00 PM to 06:00 AM)
      hudBadge: 'MEDIUM',
      hudColor: '#facc15',
      desc: 'Authentic NA-47 pacing: Khaki strikes with crushing power, Babu scuttles with high speed.',
      baseGWait: 20.0,  // Khaki: slow, heavy stalker
      baseWWait: 16.5,  // Babu: balanced visit frequency
      peekGWait: 6.5,
      peekWWait: 4.0,
      peekAttackChance: 0.18, // 82% chance to retreat if player waits out peek without scanning
      rushDur: 1.35,
      rushCollisionDmg: 18,
      baseDrain: 0.08,
      loadMultiplier: 0.14,
      flashExtraDrain: 0.55,
      chaiDrainRate: 0.36,
      sharkTimerMin: 90,
      sharkTimerMax: 125,
      stunChance: 0.15,
      deskChaiBoost: 30
    },
    HARD: {
      label: 'HARD (مشکل)',
      nightDuration: 720, // 12 Minutes (1.5s = 1 in-game minute: 10:00 PM to 06:00 AM)
      hudBadge: 'HARD',
      hudColor: '#fb923c',
      desc: 'Khaki pulverizes the iron door, Babu attacks relentlessly with rapid speed.',
      baseGWait: 14.0,  // Khaki
      baseWWait: 12.0,  // Babu
      peekGWait: 5.0,
      peekWWait: 3.2,
      peekAttackChance: 0.25, // 75% chance to retreat if player waits out peek without scanning
      rushDur: 1.15,
      rushCollisionDmg: 22,
      baseDrain: 0.11,
      loadMultiplier: 0.20,
      flashExtraDrain: 0.75,
      chaiDrainRate: 0.45,
      sharkTimerMin: 85,
      sharkTimerMax: 115,
      stunChance: 0.10,
      deskChaiBoost: 25
    },
    IMPOSSIBLE: {
      label: 'IMPOSSIBLE (ناممکن)',
      nightDuration: 720, // 12 Minutes (1.5s = 1 in-game minute: 10:00 PM to 06:00 AM)
      hudBadge: ' IMPOSSIBLE',
      hudColor: '#ef4444',
      desc: 'NIGHTMARE! Khaki shatters the door in two crushing hits, Babu darts with blinding speed!',
      baseGWait: 9.0,
      baseWWait: 8.5,
      peekGWait: 3.6,
      peekWWait: 2.4,
      peekAttackChance: 0.32, // 68% chance to retreat if player waits out peek without scanning
      rushDur: 0.95,
      rushCollisionDmg: 26,
      baseDrain: 0.14,
      loadMultiplier: 0.26,
      flashExtraDrain: 1.00,
      chaiDrainRate: 0.50,
      sharkTimerMin: 60,
      sharkTimerMax: 85,
      stunChance: 0.05,
      deskChaiBoost: 20
    }
  };
  let tutTestedLight = false;
  let tutTestedCctv = false;
  let tutDefendedOnce = false;

  // --- GAME STATE ---
  let state = 'MENU'; // 'MENU' | 'PLAYING' | 'POWEROUT' | 'JUMPSCARE' | 'GAMEOVER' | 'WIN_CUTSCENE' | 'WIN'
  let isPowerSabotaged = false;
  let powerSabotageCountThisShift = 0;
  const MAX_POWER_SABOTAGES_PER_SHIFT = 4;
  let upsBattery = 100;
  let uploadProgress = 0;
  let nightSeconds = 0;
  const NIGHT_DURATION = 720;

  // --- FORM-45 SCANNING & TRANSMISSION STATE ---
  let TOTAL_FORMS = 20;
  let formsInBox = 20;
  let holdingForm = false;
  let isFormStamped = true; // Level 3 ECP official seal verification state
  let isHoldingStamp = false; // Hold-to-stamp state
  let stampProgress = 0; // 0.0 to 1.0 (reaches 1.0 at STAMP_HOLD_DURATION)
  const STAMP_HOLD_DURATION = 0.60; // Short tactile hold (~600ms) to stamp Form-45
  let handStampAnimTimer = 0; // Handheld ECP brass stamp slam animation
  let deskStampBounce = 0; // Tactile desk stamp press bounce
  let formsScanned = 0;
  let formsUploaded = 0;
  let currentUploadPct = 0; // 0 to 100% progress for current form uploading
  let isHoldingScan = false;
  let scanProgress = 0; // 0.0 to 1.0 (reaches 1.0 at SCAN_DURATION)
  const SCAN_DURATION = 3.0; // 3.0 seconds to scan each sheet
  const UPLOAD_TIME_PER_FORM = 4.2; // 4.2s per form when 4G signal is clear
  let ballotBoxBounce = 0; // Quick 3D bounce on pickup
  let handFormAnimTimer = 0; // Smooth draw-in animation when lifting form into view
  let handFormBreathTimer = 0; // Continuous breathing & hand sway when holding Form-45

  let chowkidarChai = 100;
  let kettleChaiReady = false;
  let kettleBrewing = false;
  let kettleBrewTimer = 0;
  const KETTLE_BREW_DURATION = 10.0;
  let deskChaiUsed = false;
  let deskChaiRefilled = false;
  let powerOutTimer = 0;
  let powerOutMode = 'vigo';
  let dawnCutsceneTimer = 0;

  let lookDir = 0;
  let targetYaw = 0;
  let currentYaw = 0;
  let mouseNormX = 0;
  let mouseNormY = 0;
  let useMousePan = false;
  let mouseDragStartX = 0;
  let mouseDragStartYaw = 0;
  let isMouseDragging = false;
  let isPointerDownOnEmpty = false;

  let cctvOpen = false;
  let activeCamIdx = 0;
  let cctvFlashlightOn = false;
  let cctvFormsScattered = false;
  let cctvActiveFormCams = new Set();
  let isHoveringCctvForm = false;

  let leftDoorClosed = false;
  let leftLightOn = false;
  let doorHealth = 100;
  let rightShutterClosed = false;
  let rightLightOn = false;

  // Old Government School Fluorescent Tube Flicker & Brownout State (Q & E)
  let leftFlickerNext = 1.8 + Math.random() * 2.2;
  let leftFlickerDropTimer = 0;
  let isLeftLightDarkNow = false;

  let rightFlickerNext = 1.8 + Math.random() * 2.2;
  let rightFlickerDropTimer = 0;
  let isRightLightDarkNow = false;
  let windowHealth = 100;
  let vpnDisconnected = false;
  let sharkTimer = 15;
  let deathReasonOverride = null;
  let babuWhisperCooldown = 15.0; // Initial grace period before Babu can whisper on CCTV
  let babuWhisperPendingTimeout = null;
  let khakiWhisperCooldown = 15.0; // Initial grace period before Khaki can whisper
  let khakiWhisperPendingTimeout = null;

  // --- MINECRAFT INVENTORY & SLOW HAMMER REPAIR STATE ---
  let equippedItem = 'NONE'; // 'NONE' | 'FORM' | 'HAMMER'
  let isHoldingRepair = false;
  let repairTarget = null; // 'door' | 'window'
  let repairTimer = 0;
  let repairTauntCooldown = 2.5;
  let handHammerSwingAnim = 0;
  let tauntSubTimeout = null;
  const REPAIR_RATE = 7.5; // ~7.5% health restored per second (fast, responsive repair)

  const KHAKI_HAMMER_TAUNTS = [
    { text: '"Jitni marzi kundi thok lo... software to update ho kar rahega."', voice: 'Jitni marzi kundi thok lo, software to update ho kar rahega.' },
    { text: '"Awaaz sun li hai hum ne... thori der mein darwaza kholo ge tum."', voice: 'Awaaz sun li hai hum ne, thori der mein darwaza kholo ge tum.' },
    { text: '"Thokte raho bache... Vigo bahir tayyar khari hai."', voice: 'Thokte raho bache, Vigo bahir tayyar khari hai.' },
    { text: '"Darwaza khol kar repairing? Shabash, apna kaam asaan kar diya!"', voice: 'Darwaza khol kar repairing? Shabash, apna kaam asaan kar diya!' },
    { text: '"Hathora chalane se protocol nahi badalta... abhi aatay hain."', voice: 'Hathora chalane se protocol nahi badalta, abhi aatay hain.' }
 ];

  const BABU_HAMMER_TAUNTS = [
    { text: '"Koshish bekaar hai janaab... hamare paas Dollar whitener hai!"', voice: 'Koshish bekaar hai janaab, hamare paas Dollar whitener hai!' },
    { text: '"Kitnay bhee keel thok lo, Form-47 hamare qalam se hi banega."', voice: 'Kitnay bhee keel thok lo, Form-47 hamare qalam se hi banega.' },
    { text: '"Hathora chalane se result nahi badlega... file hamare hath mein hai!"', voice: 'Hathora chalane se result nahi badlega, file hamare hath mein hai!' },
    { text: '"Khirki kholi rakhi hai? Buhat shukriya, abhi andar aatay hain!"', voice: 'Khirki kholi rakhi hai? Buhat shukriya, abhi andar aatay hain!' },
    { text: '"Patwari sahab ko bolo mazeed keel bhejain... yeh shutter girnay wala hai!"', voice: 'Patwari sahab ko bolo mazeed keel bhejain, yeh shutter girnay wala hai!' }
 ];

  function syncInventoryUI() {
    if (inventoryIcon && inventoryName && inventoryHint) {
      if (equippedItem === 'HAMMER') {
        inventoryIcon.textContent = '';
        inventoryName.textContent = '[ REPAIR HAMMER ]';
        inventoryHint.textContent = '[H] / Click Wall to Put Back';
      } else if (equippedItem === 'FORM' || holdingForm) {
        inventoryIcon.textContent = '';
        const curCfg = getCurrentLevelConfig();
        const curNum = formsScanned + 1;
        if (curCfg.hasSealVerification && !isFormStamped) {
          inventoryName.textContent = `[ FORM-45 #${curNum} · UNSTAMPED ]`;
          inventoryHint.textContent = 'Hold [E] or Desk Stamp to Affix Official ECP Seal';
        } else {
          inventoryName.textContent = `[ FORM-45 SHEET #${curNum} · SEALED ]`;
          inventoryHint.textContent = 'Carry to Scanner at Left Door (A)';
        }
      } else {
        inventoryIcon.textContent = '';
        inventoryName.textContent = '[ FREE HANDS ]';
        inventoryHint.textContent = '[H] / Click Wall to Equip Hammer';
      }
    }
    if (wallHammer) {
      wallHammer.visible = (equippedItem !== 'HAMMER');
    }
    if (handHammer) {
      handHammer.visible = (!cctvOpen && equippedItem === 'HAMMER');
    }
    if (handForm) {
      handForm.visible = (!cctvOpen && (equippedItem === 'FORM' || holdingForm));
      if (handForm.visible) {
        const curNum = formsScanned + 1;
        const formTotal = formsScanned < 25 ? 25 : 30;
        if (handForm.updateTexture) handForm.updateTexture(curNum, formTotal, isFormStamped);
        else if (window.__updateForm45Texture) window.__updateForm45Texture(curNum, formTotal, isFormStamped);
      }
    }
  }

  function toggleHammerEquip() {
    if (state !== 'PLAYING') return;
    if (holdingForm || equippedItem === 'FORM') {
      // User has a form and clicked hammer: put form back in box and pick up hammer!
      if (isHoldingScan) stopHoldScan(false);
    if (isHoldingStamp) stopHoldStamp(false);
      holdingForm = false;
      formsInBox++;
      if (handForm) {
        handForm.visible = false;
        handFormAnimTimer = 0;
      }
      ballotBoxBounce = 0.28;
      GameAudio.formCollected();
      equippedItem = 'HAMMER';
      syncInventoryUI();
      syncControlsUI();
      GameAudio.click();
      return;
    }
    if (isHoldingScan) return;
    if (isHoldingRepair) stopHoldRepair();

    if (equippedItem === 'HAMMER') {
      equippedItem = 'NONE';
      // toast suppressed for clean screen
      GameAudio.click();
    } else {
      equippedItem = 'HAMMER';
      // toast suppressed for clean screen
      GameAudio.click();
    }
    syncInventoryUI();
    syncControlsUI();
  }

  function triggerHammerTaunt(target) {
    return; // No recorded hammer taunts for Khaki or Babu
    if (state !== 'PLAYING') return;
    const isDoor = (target === 'door');
    const taunts = isDoor ? KHAKI_HAMMER_TAUNTS : BABU_HAMMER_TAUNTS;
    const item = taunts[Math.floor(Math.random() * taunts.length)];
    const speaker = isDoor ? ' KHAKI (FROM HALLWAY)' : ' BABU (OUTSIDE WINDOW)';
    const pan = isDoor ? -0.8 : 0.8;

    if (monsterTauntSub && tauntSpeaker && tauntText) {
      tauntSpeaker.textContent = speaker;
      tauntText.textContent = item.text;
      monsterTauntSub.style.display = 'block';
      monsterTauntSub.style.opacity = '1';
      clearTimeout(tauntSubTimeout);
      tauntSubTimeout = setTimeout(() => {
        if (monsterTauntSub) {
          monsterTauntSub.style.opacity = '0';
          setTimeout(() => { if (monsterTauntSub) monsterTauntSub.style.display = 'none'; }, 300);
        }
      }, 4500);
    }

    GameAudio.corridorTaunt(pan, item.voice, 1);
  }

  function startHoldRepair(target = null) {
    if (state !== 'PLAYING' || cctvOpen) return;
    if (equippedItem !== 'HAMMER') {
      if (holdingForm || equippedItem === 'FORM') {
        if (isHoldingScan) stopHoldScan(false);
    if (isHoldingStamp) stopHoldStamp(false);
        holdingForm = false;
        formsInBox++;
        if (handForm) {
          handForm.visible = false;
          handFormAnimTimer = 0;
        }
        ballotBoxBounce = 0.28;
        GameAudio.formCollected();
      }
      equippedItem = 'HAMMER';
      syncInventoryUI();
      syncControlsUI();
      GameAudio.click();
    }
    if (target === null) {
      if (lookDir === -1) target = 'door';
      else if (lookDir === 1) target = 'window';
      else {
        showToast('FACE DOOR (A) OR WINDOW (D)');
        return;
      }
    }

    if (target === 'door') {
      if (doorHealth >= 100) {
        if (!leftDoorClosed) {
          // Option B: Smart Lock - slam 100% healthy door shut and lock it into place!
          toggleLeftDoor();
          GameAudio.hammerStrike(-0.8);
          // toast suppressed for clean screen
        } else {
          // Closed at 100% health: normal click opens the door
          toggleLeftDoor();
        }
        return;
      }

      // Door is damaged (< 100%): auto-open if locked, then proceed to repair
      if (leftDoorClosed) {
        toggleLeftDoor();
        // toast suppressed for clean screen
      }
    } else if (target === 'window') {
      if (windowHealth >= 100) {
        if (!rightShutterClosed) {
          // Option B: Smart Lock - slam 100% healthy shutters shut and lock into place!
          toggleRightShutter();
          GameAudio.hammerStrike(0.8);
          // toast suppressed for clean screen
        } else {
          // Closed at 100% health: normal click opens the window
          toggleRightShutter();
        }
        return;
      }

      // Window is damaged (< 100%): auto-open if closed, then proceed to repair
      if (rightShutterClosed) {
        toggleRightShutter();
        // toast suppressed for clean screen
      }
    }

    isHoldingRepair = true;
    repairTarget = target;
    repairTimer = 0.05; // Immediate initial hammer strike

    const curH = Math.ceil(target === 'door' ? doorHealth : windowHealth);
    if (repairHoldHud) repairHoldHud.style.display = 'block';
    if (repairHoldTitle) {
      repairHoldTitle.textContent = ` REPAIRING ${target === 'door' ? 'DOOR' : 'WINDOW'} HINGES (HOLD)... [ ${curH}% ]`;
    }
    if (repairHoldBar) repairHoldBar.style.width = `${curH}%`;
  }

  function stopHoldRepair(completed = false) {
    if (!isHoldingRepair) return;
    isHoldingRepair = false;
    repairTarget = null;
    if (repairHoldHud) repairHoldHud.style.display = 'none';
    if (handHammer) {
      handHammer.rotation.set(-0.25, -0.32, 0.16);
      handHammer.position.set(0.24, -0.24, -0.48);
    }
  }

  // --- RANDOMIZED INTRUDER PATHS & LURK SPOTS (FNAF-STYLE CLOSE-UP & CREEPY ANGLES) ---
  const ZONE_SPOTS = {
    0: [ // CAM 01: School Gate & Road (Close-up flanking lens like Bonnie CAM 2B)
      new THREE.Vector3(-0.35, 0, -39.4), // Spot 0: Towering Left Flank Close-Up (2.8m from lens)
      new THREE.Vector3(0.45, 0, -39.5),  // Spot 1: Right Flank Close-Up Staredown
      new THREE.Vector3(-0.75, 0, -40.6), // Spot 2: Menacing Mid-Close Loom
    ],
    1: [ // CAM 02: Central Courtyard / Cargo Bay
      new THREE.Vector3(0.40, 0, -24.2),  // Spot 0: Left Flank Extreme Close-Up (2.7m from lens)
      new THREE.Vector3(1.10, 0, -24.4),  // Spot 1: Right Flank Looming Staredown
      new THREE.Vector3(-0.15, 0, -25.2), // Spot 2: Mid-Close Stage Loom
    ],
    2: [ // CAM 03: Pillared Veranda / West Aisle
      new THREE.Vector3(-14.1, 0, -13.6), // Spot 0: Right Flank Close-Up under tube light (2.6m)
      new THREE.Vector3(-13.7, 0, -14.2), // Spot 1: Center Walkway Looming Stare
      new THREE.Vector3(-13.2, 0, -15.0), // Spot 2: Pillar Shadow Loom
    ],
    3: [ // CAM 04: Staff Room / Customs Bay
      new THREE.Vector3(13.6, 0, -14.8),  // Spot 0: Left Flank Close-Up inside room (2.6m)
      new THREE.Vector3(14.2, 0, -15.0),  // Spot 1: Right Flank Close-Up Staredown
      new THREE.Vector3(13.0, 0, -16.0),  // Spot 2: Conference Table / Customs Bay Loom
    ],
    4: [ // CAM 05: Left Door Peek Window
      new THREE.Vector3(-4.95, -0.74, -2.56),
    ],
    5: [ // CAM 06: Right Window Peek Window
      new THREE.Vector3(4.95, -0.74, -2.56),
    ],
    6: [ // CAM 07: Science Lab / Genset
      new THREE.Vector3(-14.0, 0, -30.6), // Spot 0: Right Flank Close-Up Workbench (2.6m)
      new THREE.Vector3(-13.5, 0, -31.4), // Spot 1: Center Lab Looming Staredown
      new THREE.Vector3(-13.0, 0, -32.2), // Spot 2: Chemical Cupboard Loom
    ],
    7: [ // CAM 08: Headmaster Office / RO Strongroom
      new THREE.Vector3(13.8, 0, -30.6),  // Spot 0: Left Flank Close-Up (2.6m)
      new THREE.Vector3(13.3, 0, -31.5),  // Spot 1: Center Office Looming Stare
      new THREE.Vector3(12.8, 0, -32.5),  // Spot 2: Mahogany Desk Loom
    ],
    8: [ // CAM 09: Power & Generator Room (K-Electric Sabotage Zone)
      new THREE.Vector3(-24.8, 0, -20.6), // Spot 0: Extreme Close-Up right in front of lens (2.4m)
      new THREE.Vector3(-24.2, 0, -21.2), // Spot 1: Beside Breaker Fuse Cabinet Loom
      new THREE.Vector3(-23.6, 0, -22.0), // Spot 2: Diesel Generator Skid Loom
    ],
    9: [ // CAM 10: Old Library & Records Room (Fiber Vault)
      new THREE.Vector3(23.5, 0, -16.4),  // Spot 0: Extreme Close-Up Bookshelf Lens Stare (2.0m)
      new THREE.Vector3(23.0, 0, -16.8),  // Spot 1: Archives Bookshelf Loom
      new THREE.Vector3(23.9, 0, -17.2),  // Spot 2: Old Record Reading Table Loom
    ]
  };

    let gulluSpotIdx = 0;
  let whitenerSpotIdx = 0;
  let gulluAssault = null;
  let whitenerAssault = null;

  function initAssaultProfile(startHealth, isGullu, isEnraged = false) {
    if (isGullu) {
      // ========================================================
      // KHAKI: SLOWER STRIKES, BUT DEVASTATING RAW POWER!
      // Crushing damage on the Left Iron Door with sledgehammer blows / lathi slams.
      // Deliberate, booming impacts (0.95s - 1.35s between hits).
      // ========================================================
      if (isEnraged) {
        const rate = 1.12;
        const bufDur = (GameAudio && GameAudio.getSampleDuration) ? GameAudio.getSampleDuration('khaki_door_bang', rate) : 0;
        const hits = 5;
        const minDmg = 14;
        const maxDmg = 19;
        const interval = bufDur > 0.4 ? Math.min(0.85, Math.max(0.55, bufDur * 0.72)) : 0.72;
        const maxVisitDmg = startHealth > 20
          ? Math.min(startHealth - 8, 65)
          : startHealth;
        return {
          type: 'heavy',
          maxHits: hits,
          hitCount: 0,
          minDmg,
          maxDmg,
          interval,
          nextHitTime: 0.05,
          maxVisitDmg,
          dealtDmg: 0,
          isEnraged: true,
          playbackRate: rate
        };
      }

      const roll = Math.random();
      const bufDur = (GameAudio && GameAudio.getSampleDuration) ? GameAudio.getSampleDuration('khaki_door_bang', 1.0) : 0;
      let type = 'standard';
      let hits = 3;
      let minDmg = 15;
      let maxDmg = 21;
      let interval = bufDur > 0.4 ? Math.min(1.05, Math.max(0.65, bufDur * 0.78)) : 0.88;

      if (roll < 0.25) {
        type = 'light';
        hits = 3;
        minDmg = 10;
        maxDmg = 14;
      } else if (roll < 0.75) {
        type = 'standard';
        hits = 3;
        minDmg = 14;
        maxDmg = 20;
      } else {
        type = 'heavy';
        hits = 6; // Two full 3-bang passes for heavy siege
        minDmg = 10;
        maxDmg = 14;
      }

      const maxVisitDmg = startHealth > 25
        ? Math.min(startHealth - 10, 56)
        : startHealth;

      return {
        type,
        maxHits: hits,
        hitCount: 0,
        minDmg,
        maxDmg,
        interval,
        nextHitTime: (type === 'light' ? 0.55 : type === 'heavy' ? 0.75 : 0.65) + Math.random() * 0.20,
        maxVisitDmg,
        dealtDmg: 0,
        playbackRate: 1.0
      };
    } else {
      // ========================================================
      // BABU: HIGH SPEED, RAPID TAPS, BUT LOW PHYSICAL DAMAGE!
      // Frantic rattling and tapping on the Right Window shutters.
      // ========================================================
      if (isEnraged) {
        const rate = 1.12;
        const bufDur = (GameAudio && GameAudio.getSampleDuration) ? GameAudio.getSampleDuration('babu_door_bang', rate) : 0;
        const hits = 6;
        const minDmg = 5;
        const maxDmg = 8;
        const interval = bufDur > 0.4 ? Math.min(0.55, Math.max(0.36, bufDur * 0.55)) : 0.40;
        const maxVisitDmg = startHealth > 15
          ? Math.min(startHealth - 8, 30)
          : startHealth;
        return {
          type: 'light',
          maxHits: hits,
          hitCount: 0,
          minDmg,
          maxDmg,
          interval,
          nextHitTime: 0.05,
          maxVisitDmg,
          dealtDmg: 0,
          isEnraged: true,
          playbackRate: rate
        };
      }

      const roll = Math.random();
      const bufDur = (GameAudio && GameAudio.getSampleDuration) ? GameAudio.getSampleDuration('babu_door_bang', 1.0) : 0;
      let type = 'light';
      let hits = 4;
      let minDmg = 4;
      let maxDmg = 7;
      let interval = bufDur > 0.4 ? Math.min(0.68, Math.max(0.44, bufDur * 0.65)) : 0.52;

      if (roll < 0.40) {
        type = 'light';
        hits = 4;
        minDmg = 3;
        maxDmg = 6;
      } else if (roll < 0.80) {
        type = 'standard';
        hits = 4;
        minDmg = 4;
        maxDmg = 7;
      } else {
        type = 'heavy';
        hits = 8; // Two full 4-bang passes for heavy siege
        minDmg = 3;
        maxDmg = 5;
      }

      const maxVisitDmg = startHealth > 15
        ? Math.min(startHealth - 10, 24) // Much lower visit cap!
        : startHealth;

      return {
        type,
        maxHits: hits,
        hitCount: 0,
        minDmg,
        maxDmg,
        interval,
        nextHitTime: 0.30 + Math.random() * 0.18,
        maxVisitDmg,
        dealtDmg: 0,
        playbackRate: 1.0
      };
    }
  }

  function getIntruderSpot(zone, isGullu) {
    const spots = ZONE_SPOTS[zone];
    if (!spots || spots.length === 0) return cctvZones[zone]?.intruderSpot || new THREE.Vector3();
    let idx = isGullu ? gulluSpotIdx : whitenerSpotIdx;
    // When both monsters occupy the same camera, space them across different spots so they don't clip
    const gLoc = (typeof GULLU_PATH !== 'undefined' && typeof gulluStep !== 'undefined') ? GULLU_PATH[gulluStep] : -1;
    const wLoc = (typeof WHITENER_PATH !== 'undefined' && typeof whitenerStep !== 'undefined') ? WHITENER_PATH[whitenerStep] : -1;
    if (gLoc === wLoc && !isGullu && spots.length > 1) {
      if ((idx % spots.length) === (gulluSpotIdx % spots.length)) {
        idx = (idx + 1) % spots.length;
      }
    }
    return spots[idx % spots.length];
  }

  function getScanAggressionProg() {
    const total = (typeof TOTAL_FORMS === 'number' && TOTAL_FORMS > 0) ? TOTAL_FORMS : 30;
    const scanned = (typeof formsScanned === 'number' && formsScanned > 0) ? formsScanned : 0;
    return Math.min(1.0, scanned / total);
  }

  function pickNextGulluZone(curZone, hourProg) {
    // KHAKI PATHING: STRICTLY LEFT WING & POWER ROOM ONLY!
    // CAM 01 (Gate) -> CAM 02 (Courtyard)
    // From Courtyard: CAM 09 (Power Shed, after 2 AM), CAM 03 (Veranda), CAM 07 (Science Lab), CAM 01 (Gate)
    // From CAM 03 (Veranda): CAM 05 (Left Peek Window), CAM 07 (Science Lab), CAM 02 (Courtyard)
    // From CAM 07 (Science Lab): CAM 05 (Left Peek Window), CAM 03 (Veranda), CAM 02 (Courtyard)
    // From CAM 09 (Power Shed): CAM 02 (Courtyard) or CAM 03 (Veranda)
    // From CAM 05 (Left Peek Window): ZONE_KHAKI_DOOR (40) or retreat to CAM 03 / CAM 07
    // KHAKI ONLY COMES TO CAM 05 IF HE IS PEEKING AT THE DOOR/WINDOW!
    const hourFloat = (nightSeconds / NIGHT_DURATION) * 6;

    if (curZone === 0) { // CAM 01 (Gate)
      return 1; // Advance into Central Courtyard
    }

    if (curZone === 1) { // CAM 02 (Courtyard - Central Hub)
      const r = Math.random();
      const curLvlCfg = getCurrentLevelConfig();
      const minSabHour = 1.2;
      const sabChance = 0.55;
      const forceFirstSabotage = (powerSabotageCountThisShift === 0 && hourFloat >= 2.0);
      if (curLvlCfg.hasPowerSabotage && powerSabotageCountThisShift < MAX_POWER_SABOTAGES_PER_SHIFT && hourFloat >= minSabHour && !isPowerSabotaged && powerSabotageCooldown <= 0 && (forceFirstSabotage || r < sabChance)) {
        return 8; // DEAD-END POWER SHED (CAM 09)!
      }
      if (r < 0.50) return 2; // 50% Veranda (CAM 03)
      if (r < 0.80) return 6; // 30% Science Lab (CAM 07)
      return 0; // 20% Backtrack to Gate (CAM 01)
    }

    if (curZone === 8) { // CAM 09 (Power Shed - Dead End)
      return Math.random() < 0.55 ? 1 : 2;
    }

    // Left Hallway Upper: CAM 03 (Veranda)
    if (curZone === 2) {
      const r = Math.random();
      if (r < 0.55 + hourProg * 0.15 + getScanAggressionProg() * 0.06) return ZONE_KHAKI_PEEK; // Advance to Left Peek Window (CAM 05)
      if (r < 0.80) return 6; // 25% Detour into Science Lab (CAM 07)
      return 1; // 20% Backtrack to Courtyard (CAM 02)
    }

    // Left Hallway Alcove: CAM 07 (Science Lab)
    if (curZone === 6) {
      const r = Math.random();
      if (r < 0.55 + hourProg * 0.15 + getScanAggressionProg() * 0.06) return ZONE_KHAKI_PEEK; // Advance to Left Peek Window (CAM 05)
      if (r < 0.80) return 2; // 25% Backtrack to Veranda (CAM 03)
      return 1; // 20% Return to Courtyard (CAM 02)
    }

    // CAM 05: Left Door Peek Window (STAGE 1 PEEK)
    // 100% attack if door is left open; low attack chance (mostly retreats) if door is closed & player waits him out!
    if (curZone === ZONE_KHAKI_PEEK) {
      if (!leftDoorClosed) return ZONE_KHAKI_DOOR;
      const cfgPeekG = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
      const attackChanceG = (cfgPeekG.peekAttackChance ?? 0.18) + hourProg * 0.08 + getScanAggressionProg() * 0.07;
      if (Math.random() < attackChanceG) return ZONE_KHAKI_DOOR;
      return Math.random() < 0.60 ? 2 : 6; // Retreat back to Veranda (CAM 03) or Science Lab (CAM 07)
    }

    // Left Door Threshold Assault (Zone 40)
    if (curZone === ZONE_KHAKI_DOOR) {
      if (!leftDoorClosed) return ZONE_KHAKI_DOOR; // Maintain attack
      return Math.random() < 0.60 ? 2 : 6;
    }

    return 1;
  }

  function pickNextWhitenerZone(curZone, hourProg) {
    // BABU PATHING: STRICTLY RIGHT WING & ARCHIVES ONLY!
    if (curZone === 0) { // CAM 01 (Gate)
      return 1; // Advance to Courtyard
    }

    if (curZone === 1) { // CAM 02 (Courtyard - Central Hub)
      const r = Math.random();
      if (r < 0.45) return 9; // 45% Old Library archives (CAM 10)
      if (r < 0.85) return 3; // 40% Staff Room (CAM 04)
      return 0; // 15% Wander back to Gate (CAM 01)
    }

    if (curZone === 9) { // CAM 10 (Old Library - Archives)
      const r = Math.random();
      if (r < 0.25 + hourProg * 0.10 + getScanAggressionProg() * 0.06) return ZONE_BABU_PEEK; // Advance to Right Peek Window (CAM 06)
      if (r < 0.65) return 3; // 40% Staff Room (CAM 04)
      return 7; // 35% Headmaster Office (CAM 08)
    }

    // Right Hallway Upper: CAM 04 (Staff Room - Base)
    if (curZone === 3) {
      const r = Math.random();
      if (r < 0.35 + hourProg * 0.10 + getScanAggressionProg() * 0.06) return ZONE_BABU_PEEK; // Advance to Right Peek Window (CAM 06)
      if (r < 0.65) return 7; // 30% Search Headmaster office (CAM 08)
      if (r < 0.88) return 9; // 23% Sneak into Old Library (CAM 10)
      return 1; // 12% Backtrack to Courtyard (CAM 02)
    }

    // Headmaster Alcove: CAM 08 (Headmaster Office)
    if (curZone === 7) {
      const r = Math.random();
      if (r < 0.35 + hourProg * 0.10 + getScanAggressionProg() * 0.06) return ZONE_BABU_PEEK; // Advance to Right Peek Window (CAM 06)
      if (r < 0.68) return 3; // 33% Backtrack to Staff Room (CAM 04)
      return 9; // 32% Return to Old Library (CAM 10)
    }

    // CAM 06: Right Shutter Peek Window (STAGE 1 PEEK)
    // 100% attack if shutter is left open; low attack chance (mostly retreats) if shutter is closed & player waits him out!
    if (curZone === ZONE_BABU_PEEK) {
      if (!rightShutterClosed) return ZONE_BABU_WINDOW;
      const cfgPeekW = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
      const attackChanceW = (cfgPeekW.peekAttackChance ?? 0.18) + hourProg * 0.08 + getScanAggressionProg() * 0.07;
      if (Math.random() < attackChanceW) return ZONE_BABU_WINDOW;
      return Math.random() < 0.50 ? 3 : (Math.random() < 0.50 ? 7 : 9); // Retreat to Staff Room, Headmaster, or Library
    }

    // Right Window Threshold Assault (Zone 41)
    if (curZone === ZONE_BABU_WINDOW) {
      if (!rightShutterClosed) return ZONE_BABU_WINDOW; // Maintain attack
      return Math.random() < 0.50 ? 3 : (Math.random() < 0.50 ? 7 : 9);
    }

    return 1;
  }

  const ZONE_KHAKI_PEEK = 4;
  const ZONE_BABU_PEEK = 5;
  const ZONE_KHAKI_DOOR = 40;
  const ZONE_BABU_WINDOW = 41;

  const GULLU_PATH = [0, 1, 2, ZONE_KHAKI_PEEK, ZONE_KHAKI_DOOR];
  let gulluStep = 0;
  let babuActive = false;
  let khakiActive = false;
  let gulluWait = 0;
  let gulluAtDoorTime = 0;
  let gulluSpottedSting = false;
  let gulluWalkAnim = null;
  let gulluDuckTimer = 0;
  let gulluEnraged = false;
  let gulluRageTimer = 0; // Phase 1: Window anger freakout duration (0.85s)
  let gulluRushCharge = null; // { timer: 1.35, dur: 1.35, origin: 'peek' | 'arrival' }

  const WHITENER_PATH = [3, ZONE_BABU_PEEK, ZONE_BABU_WINDOW];
  let whitenerStep = 0;
  let whitenerWait = 0;
  let whitenerAtWindowTime = 0;
  let whitenerSpottedSting = false;
  let whitenerWalkAnim = null;
  let whitenerDuckTimer = 0;
  let whitenerEnraged = false;
  let whitenerRageTimer = 0; // Phase 1: Window anger freakout duration (0.85s)
  let whitenerRushCharge = null; // { timer: 1.35, dur: 1.35, origin: 'peek' | 'arrival' }

  function triggerEnragedKhaki() {
    if (gulluEnraged || state !== 'PLAYING') return;
    gulluEnraged = true;
    gulluRageTimer = 0.85; // Visceral 0.85s window freakout & bar rattling!
    setHumanoidEnraged(gulluMesh, true);

    stopHoldScan(false);

    if (rageVignette) rageVignette.classList.add('on');
    if (GameAudio.barRattle) GameAudio.barRattle(-0.85);

    // Stop active Khaki voice to prevent clipping/overlay
    if (GameAudio.stopKhakiVoice) GameAudio.stopKhakiVoice(0.02);

    // Play dynamic enraged voiceline (chance of played audio becomes 0 on next encounter)
    let enragedLineK = null;
    if (GameAudio.playKhakiEnragedVoice) {
      enragedLineK = GameAudio.playKhakiEnragedVoice(-0.85);
    } else if (GameAudio.khakiEnragedRoar) {
      enragedLineK = GameAudio.khakiEnragedRoar(-0.85);
    }
    const subTextK = enragedLineK
      ? `Khaki: "${getLineSubtitle(enragedLineK)}"`
      : (subtitleLang === 'ENGLISH' ? 'Khaki: "Stop right there, punk!!"' : 'Khaki: "Ruk ja saaley!!"');
    showPS1Subtitle(subTextK, 3200);

    animate._leftShake = 1.60;
    animate._doorCrackFlash = 1.0;

    const gCur = GULLU_PATH[gulluStep];
    const viaMsg = (gCur === 4) ? 'THROUGH THE OPEN DOORWAY!' : (gCur === ZONE_KHAKI_DOOR) ? 'RIGHT AT THE DOOR!' : 'THROUGH THE SPY PEEK WINDOW!';

    // If Khaki was in CAM 05 (Left Lobby), immediately advance to peek stage so his rage rushes door!
    if (gCur === 4) {
      gulluStep++;
      GULLU_PATH[gulluStep] = ZONE_KHAKI_PEEK;
    }

    // Face squarely centered behind the left spy window grill
    setHumanoidPeekMode(gulluMesh, true);
    gulluMesh.position.set(-4.95, -0.74, -2.56);
    gulluMesh.scale.set(1.15, 1.15, 1.15);
    gulluMesh.rotation.set(0, cctvOpen ? Math.PI / 2 : 1.09, 0);
    if (gulluMesh.userData && gulluMesh.userData.head) {
      gulluMesh.userData.head.rotation.set(0, 0, 0);
    }

    updateIntruderPositions();
  }

  function triggerEnragedBabu() {
    if (whitenerEnraged || state !== 'PLAYING') return;
    whitenerEnraged = true;
    whitenerRageTimer = 0.85; // Visceral 0.85s window freakout & bottle brandishing!
    setHumanoidEnraged(whitenerMesh, true);

    stopHoldScan(false);

    if (rageVignette) rageVignette.classList.add('on');
    animate._rightShake = 1.60;
    animate._winCrackFlash = 1.0;

    const wCur = WHITENER_PATH[whitenerStep];
    const viaMsg = (wCur === 5) ? 'THROUGH THE RIGHT WINDOW!' : (wCur === ZONE_BABU_WINDOW) ? 'RIGHT AT THE WINDOW!' : 'THROUGH THE SPY PEEK WINDOW!';

    // Stop any active Babu vocalization so there is zero overlap or clipping
    if (GameAudio.stopBabuVoice) GameAudio.stopBabuVoice(0.02);

    if (GameAudio.barRattle) GameAudio.barRattle(0.85);

    // Play dynamic enraged voiceline (chance of played audio becomes 0 on next encounter)
    let enragedLineB = null;
    if (GameAudio.playBabuEnragedVoice) {
      enragedLineB = GameAudio.playBabuEnragedVoice(0.85);
    } else if (GameAudio.babuEnragedRoar) {
      enragedLineB = GameAudio.babuEnragedRoar(0.85);
    }
    const subTextB = enragedLineB
      ? `Babu: "${getLineSubtitle(enragedLineB)}"`
      : (subtitleLang === 'ENGLISH' ? 'Babu: "Hey, don\'t scan!"' : 'Babu: "Oye scan mat kar!"');
    showPS1Subtitle(subTextB, 3000);

    // If Babu was in CAM 06 (Right Alley), immediately advance to peek stage so his rage rushes window!
    if (wCur === 5) {
      whitenerStep++;
      WHITENER_PATH[whitenerStep] = ZONE_BABU_PEEK;
    }

    // Face squarely centered behind the right spy window grill, looking straight into the camera
    setHumanoidPeekMode(whitenerMesh, true);
    whitenerMesh.position.set(4.95, -0.74, -2.56);
    whitenerMesh.scale.set(1.15, 1.15, 1.15);
    whitenerMesh.rotation.set(0, cctvOpen ? -Math.PI / 2 : -1.09, 0);
    if (whitenerMesh.userData && whitenerMesh.userData.head) {
      whitenerMesh.userData.head.rotation.set(0, 0, 0);
    }

    updateIntruderPositions();
  }

  let jumpscareTimer = 0;
  let jumpscareAttacker = 'gullu';
  let ambientCreepTimer = 14.0;
  let heartbeatTimer = 0.5;
  let babuLurkSoundCooldown = 6.0 + Math.random() * 6.0;
  let khakiLurkSoundCooldown = 7.0 + Math.random() * 7.0;
  let officeTubeBrownoutCooldown = 22.0 + Math.random() * 18.0;
  let officeTubeBrownoutDuration = 0;
  let officeTubeBurstCount = 0;
  let officeTubeGapTimer = 0;

  function clearCinematicOverlays() {
    if (jumpscareFx) jumpscareFx.classList.remove('on');
    if (khakiOverrideHud) khakiOverrideHud.classList.remove('on');
    if (babuWhitenerFx) babuWhitenerFx.classList.remove('on');
    if (ws1) ws1.classList.remove('splat');
    if (ws2) ws2.classList.remove('splat');
    if (ws3) ws3.classList.remove('splat');
    if (sarkariStamp) sarkariStamp.classList.remove('slammed');
    if (dawnCutsceneUi) dawnCutsceneUi.classList.remove('on');
    if (rageVignette) rageVignette.classList.remove('on');
  }

  function showToast(msg) {
    alertToast.textContent = msg;
    alertToast.style.setProperty('background', 'transparent', 'important');
    alertToast.style.setProperty('border', 'none', 'important');
    alertToast.style.setProperty('box-shadow', 'none', 'important');
    alertToast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => alertToast.classList.remove('show'), 2300);
  }

  function getLineSubtitle(line) {
    if (!line) return '';
    return (subtitleLang === 'ENGLISH' && line.subtitleEn) ? line.subtitleEn : (line.subtitle || '');
  }

  function showPS1Subtitle(line, ms = 3600) {
    if (!ps1Subtitle) return;
    ps1Subtitle.textContent = line;
    ps1Subtitle.classList.add('show');
    clearTimeout(showPS1Subtitle._t);
    showPS1Subtitle._t = setTimeout(() => ps1Subtitle.classList.remove('show'), ms);
  }
  window.__showPS1Subtitle = showPS1Subtitle;

  function flashStatic(strength = 1.0, ms = 280) {
    const durSec = Math.max(0.18, ms / 1000);
    triggerFullStatic(durSec, 0.10);
  }

  function hasHeardAyeshaCall() {
    try { return localStorage.getItem('form45_heard_ayesha_call') === '1'; } catch (_) { return false; }
  }

  // --- START NIGHT SHIFT ---
  let isGamePaused = false;
  const pauseModalEl = document.getElementById('pause-modal');
  const btnPauseEl = document.getElementById('btn-pause');
  const btnResumeGameEl = document.getElementById('btn-resume-game');
  const btnRestartGameEl = document.getElementById('btn-restart-game');
  const btnPauseMainMenuEl = document.getElementById('btn-pause-main-menu');

  function pauseGame() {
    if (state !== 'PLAYING' || isGamePaused) return;
    isGamePaused = true;
    if (typeof stopHoldScan === 'function' && isHoldingScan) stopHoldScan(false);
    if (typeof stopHoldStamp === 'function' && isHoldingStamp) stopHoldStamp(false);
    if (typeof stopHoldRepair === 'function' && isHoldingRepair) stopHoldRepair(false);
    try {
      if (GameAudio && GameAudio.pauseAll) {
        GameAudio.pauseAll();
      } else if (GameAudio && GameAudio.ctx && GameAudio.ctx.state === 'running') {
        GameAudio.ctx.suspend().catch(() => {});
      }
    } catch (_) {}
    if (pauseModalEl) pauseModalEl.classList.remove('hide');
  }

  function resumeGame() {
    if (!isGamePaused) return;
    isGamePaused = false;
    lastTime = performance.now();
    if (pauseModalEl) pauseModalEl.classList.add('hide');
    try {
      if (GameAudio && GameAudio.resumeAll) {
        GameAudio.resumeAll();
      } else if (GameAudio && GameAudio.ctx && GameAudio.ctx.state !== 'running') {
        GameAudio.ctx.resume().catch(() => {});
      }
    } catch (_) {}
  }

  function togglePause() {
    if (isGamePaused) resumeGame();
    else pauseGame();
  }

  function startShift() {
    isGamePaused = false;
    if (pauseModalEl) pauseModalEl.classList.add('hide');
    try {
      if (GameAudio && GameAudio.ctx && GameAudio.ctx.state !== 'running') {
        GameAudio.ctx.resume().catch(() => {});
      }
    } catch (_) {}
    try { if (window.GameAudio && window.GameAudio.stopMenuMusic) window.GameAudio.stopMenuMusic(0.6); } catch (_) {}
    try {
      localStorage.setItem('form45_has_save', '1');
      localStorage.setItem('na47_halqa_level', String(currentHalqaLevel));
    } catch (_) {}
    applyHalqaLevel(currentHalqaLevel);
    initWirePuzzle(false);
    clearCinematicOverlays();
    document.body.classList.remove('cctv-active');
    if (cctvCamLight) cctvCamLight.intensity = 0;
    GameAudio.init();
    GameAudio.startAmbience(currentHalqaLevel);
    GameAudio.cctvBlip();
    ayeshaCallConnected = false;
    ayeshaCallStartTime = 0;
    const btnMuteCallEl = document.getElementById('btn-mute-call');
    if (btnMuteCallEl) {
      btnMuteCallEl.style.display = hasHeardAyeshaCall() ? '' : 'none';
    }
    const curCfg = getCurrentLevelConfig();
    let phoneSpeech = '';
    let phoneSubtitle = '';
    if (curCfg.levelNum === 2) {
      phoneSpeech = 'Assalam Alikum! returning affsar sahai! Aapki NA 128 Lahore ki shift raat 10 se subha 6 bajey tak hai. Is imaraat ki wiring zara purani hai to agar koi wiring ka issue ho tu CAM 9 pe taarein dekh lena. Aur baqi haalat ka to aapko andaza hoga to us ka saath dihaan rakhna, Allah Hafiz.';
      phoneSubtitle = subtitleLang === 'ENGLISH'
        ? '<b>Ayesha:</b> "Assalam-o-Alaikum! Returning Officer sir... NA-128 Lahore shift is from 10 PM to 6 AM."'
        : '<b>Ayesha:</b> "Assalam-o-Alaikum! Returning Afsar sahib... NA-128 Lahore shift raat 10 se subha 6 bajay tak hai."';
    } else if (curCfg.levelNum === 3) {
      phoneSpeech = 'Assalam-o-Alaikum! RO sahib, aap ki das se subha cheh bajay ki shift hai! Aur haalat mazeed bigartay jaa rahey hain... Is halqay se Form-45 ki tampering reports aa rahi hain, to scan karnay se pehle har Form ko daayein taraf rakhi hui stamp se seal kar lena. Baaqi aap apna khayal rakhna... Allah Hafiz!';
      phoneSubtitle = subtitleLang === 'ENGLISH'
        ? '<b>Ayesha:</b> "Assalam-o-Alaikum! RO sir... Reports of Form 45 tampering are coming in from this constituency."'
        : '<b>Ayesha:</b> "Assalam-o-Alaikum! RO sahib... Is halqay se Form 45 ki tampering reports aa rahi hain."';
    } else {
      phoneSpeech = 'Assalam-o-Alaikum! Halqa NA-47 par aap ki night shift shuru ho gayi hai. Subah cheh bajay Fajr tak aap ne saaray Form-45 nikaal kar baayein taraf scanner par scan aur portal par upload karnay hain. Aur haa akhri siral number ke Form kahien kho gaye hai, to un ko CCTV ki madad se dhund lena, lekin ahtiyat rakhna ke akhri Form uthatey hue koi dekh na lein, agar koi mojood ho to uskey janey ka intezaar karna aur phir Form uthana. Raat ko bahar ka mahaul thora ajeeb hota hai, is liye ehtiyat lazimi rakhna—CCTV cameras aur chhoti khirkiyon se bahar zaroor dekhtay rehna, aur jab bahar koi nazar aaye toh scan mat karna. Agar koi darwazay ya khirki ke qareeb aaye toh kundi aur shutter band kar lena, aur zaroorat paray toh deewar par tangay hathoray se unki marammat bhi kar lena. Haan, daaein taraf ketli mein chai ubaal kar CAM 01 par Chacha Chowkidar ko bhejtay rehna taakay woh gate par jaagtay rahein., aur WiFi ka masla ho toh CAM 10 mein router dekh lena. Yaad rakhna, aapkey paas subha 6 bajey tak ka waqt hai aur UPS ki battery aur Form 45 ki hifazat karna. Aur haan... Apna khayal rakhna!';
      phoneSubtitle = subtitleLang === 'ENGLISH'
        ? '<b>Ayesha:</b> "Assalam-o-Alaikum! Your night shift at Constituency NA-47 has begun."'
        : '<b>Ayesha:</b> "Assalam-o-Alaikum! Halqa NA-47 par aap ki night shift shuru ho gayi hai."';
    }

    GameAudio.speakPhoneGuy(
      phoneSpeech,
      () => {
        ayeshaCallConnected = true;
        ayeshaCallStartTime = nightSeconds;
        if (phoneText) {
          phoneText.innerHTML = (typeof GAME_ICONS !== 'undefined' ? GAME_ICONS.phone + ' ' : '') + phoneSubtitle;
        }
      },
      curCfg.levelNum
    );

    state = 'PLAYING';
    if (vigoMesh) vigoMesh.visible = false;
    if (leftPeekGrill) leftPeekGrill.visible = false;
    if (rightPeekGrill) rightPeekGrill.visible = false;
    jumpscareTimer = 0;
    ambientCreepTimer = 12.0 + Math.random() * 8.0;
    heartbeatTimer = 0.5;
    babuLurkSoundCooldown = 6.0 + Math.random() * 6.0;
    khakiLurkSoundCooldown = 7.0 + Math.random() * 7.0;
    officeTubeBrownoutCooldown = 22.0 + Math.random() * 18.0;
    officeTubeBrownoutDuration = 0;
    officeTubeBurstCount = 0;
    officeTubeGapTimer = 0;
    document.body.classList.remove('jumpscare-shaking');
    isPowerSabotaged = false;
    powerSabotageCountThisShift = 0;
    powerSabotageTimer = 0;
    if (emergencyStrobe) emergencyStrobe.classList.remove('active');
    if (emergencySabotageHud) emergencySabotageHud.classList.remove('active');
    if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();
    closeWirePuzzle();
    const sabAlertInit = document.getElementById('cctv-sabotage-alert');
    if (sabAlertInit) sabAlertInit.style.display = 'none';
    upsBattery = 100;
    if (upsPctEl) {
      upsPctEl.textContent = '100%';
      upsPctEl.style.color = '#38ff62';
    }
    if (cctvBatteryPctEl) {
      cctvBatteryPctEl.textContent = '100%';
      cctvBatteryPctEl.style.color = '#38ff62';
    }
    if (cctvLoadBlocksEl) {
      cctvLoadBlocksEl.textContent = '■□□□';
      cctvLoadBlocksEl.style.color = '#38ff62';
    }
    uploadProgress = 0;
    nightSeconds = 0;
    chowkidarChai = 100;
    kettleChaiReady = false;
    kettleBrewing = false;
    kettleBrewTimer = 0;
    if (GameAudio.stopKettleBoilLoop) GameAudio.stopKettleBoilLoop();
    if (GameAudio.stopHeartbeatLoop) GameAudio.stopHeartbeatLoop(0.05);
    if (GameAudio.stopKhakiVoice) GameAudio.stopKhakiVoice(0.02);
    if (GameAudio.stopBabuVoice) GameAudio.stopBabuVoice(0.02);
    deskChaiUsed = false;
    deskChaiRefilled = false;
    chaiCup.visible = true;

    // Reset Form-45 scanning & uploading state
    TOTAL_FORMS = 30;
    formsInBox = 25;
    cctvFormsScattered = false;
    cctvActiveFormCams = new Set();
    if (typeof root !== 'undefined') root.__cctvFormsScattered = false;
    if (window) window.__cctvFormsScattered = false;
    const scannedTotEl_s = document.getElementById('scanned-total');
    if (scannedTotEl_s) scannedTotEl_s.textContent = '30';
    const uploadedTotEl_s = document.getElementById('uploaded-total');
    if (uploadedTotEl_s) uploadedTotEl_s.textContent = '30';
    if (cctvFormProps) {
      cctvFormProps.forEach(p => { if (p) p.visible = false; });
    }
    holdingForm = false;
    isFormStamped = !curCfg.hasSealVerification;
    if (window.__updateForm45Texture) window.__updateForm45Texture(1, 25, isFormStamped);
    formsScanned = 0;
    formsUploaded = 0;
    currentUploadPct = 0;
    isHoldingScan = false;
    scanProgress = 0;
    isHoldingStamp = false;
    stampProgress = 0;
    if (stampHoldHud) stampHoldHud.style.display = 'none';
    if (stampHoldBar) stampHoldBar.style.width = '0%';
    if (stampHoldPct) stampHoldPct.textContent = '0%';
    if (stampBtnProgressWrap) stampBtnProgressWrap.style.display = 'none';
    if (stampBtnProgressBar) stampBtnProgressBar.style.width = '0%';
    if (handForm) handForm.visible = false;
    if (scanStation) {
      if (scanStation.led) scanStation.led.material.color.setHex(0x166534);
      if (scanStation.paper) scanStation.paper.visible = false;
      if (scanStation.laser) {
        scanStation.laser.visible = false;
        scanStation.laser.position.set(0, 1.052, -0.26);
      }
      if (scanStation.light) {
        scanStation.light.intensity = 0.2;
        scanStation.light.position.set(0, 1.15, 0);
      }
    }
    if (scanHoldHud) scanHoldHud.style.display = 'none';
    GameAudio.stopScannerLoop();
    ballotBoxBounce = 0;
    if (ballotBoxMesh) {
      ballotBoxMesh.position.set(-1.12, 1.52, 0.02);
      ballotBoxMesh.scale.set(1, 1, 1);
    }

    // Reset Inventory & Hammer State
    equippedItem = 'NONE';
    isHoldingRepair = false;
    repairTarget = null;
    if (repairHoldHud) repairHoldHud.style.display = 'none';
    if (monsterTauntSub) monsterTauntSub.style.display = 'none';
    syncInventoryUI();

    lookDir = 0;
    targetYaw = 0;
    currentYaw = 0;
    deathReasonOverride = null;
    cctvOpen = false;
    powerOutMode = 'vigo';
    restoreAmbientLight();
    if (typeof roomLight !== 'undefined' && roomLight) roomLight.castShadow = renderer.shadowMap.enabled;
    if (typeof flashlight !== 'undefined' && flashlight) flashlight.castShadow = renderer.shadowMap.enabled;
    activeCamIdx = 0;
    syncActiveSceneLights();
    cctvFlashlightOn = false;
    cctvShock = { active: false, monster: null, camIdx: -1, timer: 0, retreatZone: 0, retreatSpotIdx: 0, toastMsg: '', subMsg: '', subTime: 3500 };

    leftDoorClosed = false;
    doorHealth = 100;
    if (typeof animate !== 'undefined') {
      animate._doorAngle = -1.32;
      animate._doorVel = 0;
      animate._kundiProgress = 0;
    }
    leftLightOn = false;
    rightShutterClosed = false;
    windowHealth = 100;
    rightLightOn = false;
    vpnDisconnected = false;
    babuWhisperCooldown = 15.0;
    if (babuWhisperPendingTimeout) {
      clearTimeout(babuWhisperPendingTimeout);
      babuWhisperPendingTimeout = null;
    }
    khakiWhisperCooldown = 15.0;
    if (khakiWhisperPendingTimeout) {
      clearTimeout(khakiWhisperPendingTimeout);
      khakiWhisperPendingTimeout = null;
    }
    if (GameAudio && GameAudio.stopBabuVoice) GameAudio.stopBabuVoice(0.01);
    if (GameAudio && GameAudio.stopKhakiVoice) GameAudio.stopKhakiVoice(0.01);
    // Dynamic Halqa Campaign pacing: NA-47 (Level 1), NA-128 (Level 2), NA-241 (Level 3)
    const cfg = getCurrentLevelConfig();
    sharkTimer = cfg.sharkTimerMin + Math.random() * (cfg.sharkTimerMax - cfg.sharkTimerMin);
    const hudNightEl = document.getElementById('hud-night-lbl');
    if (hudNightEl) {
      hudNightEl.textContent = cfg.hudBadge;
      hudNightEl.style.color = cfg.hudColor;
    }

    tutTestedLight = false;
    tutTestedCctv = false;
    tutDefendedOnce = false;

    // Stalker start randomized & scaled by Halqa level (delayed staggered spawn per level)
    babuActive = false;
    khakiActive = false;
    gulluStep = 0;
    GULLU_PATH[0] = 0; // Gate (spawns outside at main gate)
    gulluSpotIdx = Math.floor(Math.random() * 3);
    gulluWait = (cfg.baseGWait || 24.0) + Math.random() * 8.0;
    gulluAtDoorTime = 0;
    gulluSpottedSting = false;
    gulluWalkAnim = null;
    gulluDuckTimer = 0;
    gulluAssault = null;
    gulluEnraged = false;
    gulluRageTimer = 0;
    gulluRushCharge = null;

    whitenerStep = 0;
    WHITENER_PATH[0] = 3; // Staff Room (spawns directly inside Staff Room CAM 04!)
    whitenerSpotIdx = Math.floor(Math.random() * 3);
    whitenerWait = (Math.min(10.0, cfg.baseWWait || 10.0)) + Math.random() * 4.0;
    whitenerAtWindowTime = 0;
    whitenerSpottedSting = false;
    whitenerWalkAnim = null;
    whitenerDuckTimer = 0;
    whitenerAssault = null;
    whitenerEnraged = false;
    whitenerRageTimer = 0;
    whitenerRushCharge = null;

    if (gulluMesh) setHumanoidEnraged(gulluMesh, false);
    if (whitenerMesh) setHumanoidEnraged(whitenerMesh, false);

    if (chowkidarMesh) {
      chowkidarMesh.rotation.z = 0;
      chowkidarMesh.position.set(-1.8, -2.13, 0.72);
    }
    if (vigoMesh) {
      vigoMesh.visible = false;
      vigoMesh.position.set(6.5, -1.6, 4.0);
    }
    if (policeStrobeRed) policeStrobeRed.position.set(4.2, 1.6, 2.5);
    if (policeStrobeBlue) policeStrobeBlue.position.set(4.2, 1.6, 2.5);
    if (gulluMesh) {
      gulluMesh.visible = false;
      setHumanoidPeekMode(gulluMesh, false);
      gulluMesh.scale.set(1.08, 1.08, 1.08);
      if (gulluMesh.userData) {
        if (gulluMesh.userData.armL) gulluMesh.userData.armL.rotation.set(0, 0, 0);
        if (gulluMesh.userData.armR) gulluMesh.userData.armR.rotation.set(0, 0, 0);
        if (gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(0, 0, 0);
      }
    }
    if (whitenerMesh) {
      whitenerMesh.visible = false;
      setHumanoidPeekMode(whitenerMesh, false);
      whitenerMesh.scale.set(1.08, 1.08, 1.08);
      if (whitenerMesh.userData) {
        if (whitenerMesh.userData.armL) whitenerMesh.userData.armL.rotation.set(0, 0, 0);
        if (whitenerMesh.userData.armR) whitenerMesh.userData.armR.rotation.set(0, 0, 0);
        if (whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(0, 0, 0);
      }
    }
    const curLevelNum = (curCfg && curCfg.levelNum) ? curCfg.levelNum : 1;
    const bgFogHex = (curLevelNum === 3) ? 0x03070c : (curLevelNum === 2) ? 0x0f0b06 : 0x040705;
    const roomHex = (curLevelNum === 3) ? 0x6e8399 : (curLevelNum === 2) ? 0xc4a362 : 0xd9f99d;
    const rightWinHex = (curLevelNum === 3) ? 0x40556b : (curLevelNum === 2) ? 0x8a632e : 0xffcf54;
    const leftHallHex = (curLevelNum === 3) ? 0x4a6078 : 0x9e7a3b;

    scene.background.setHex(bgFogHex);
    scene.fog.color.setHex(bgFogHex);
    scene.fog.density = 0.068;
    roomLight.color.setHex(roomHex);
    leftHallLight.color.setHex(leftHallHex);
    rightWindowLight.color.setHex(rightWinHex);
    hudNightLbl.textContent = `FORM-45 · [ ${cfg.hudBadge} ]`;
    try {
      if (typeof babuMenuLight !== 'undefined') babuMenuLight.intensity = 0;
      if (typeof khakiMenuLight !== 'undefined') khakiMenuLight.intensity = 0;
      if (typeof babuRimLight !== 'undefined') babuRimLight.intensity = 0;
      if (typeof khakiRimLight !== 'undefined') khakiRimLight.intensity = 0;
      if (typeof menuBackdropLight !== 'undefined') menuBackdropLight.intensity = 0;
      scene.children.forEach(c => {
        if (c.userData && c.userData.isCctvForm) {
          c.visible = false;
          return;
        }
        if (typeof vigoMesh !== 'undefined' && c === vigoMesh) {
          c.visible = false;
          return;
        }
        c.visible = true;
      });
      if (cctvFormProps) {
        cctvFormProps.forEach((prop, idx) => {
          if (prop) prop.visible = !!(cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(idx));
        });
      }
      if (gulluMesh && gulluMesh.userData && gulluMesh.userData.demonEyes) {
        gulluMesh.userData.demonEyes.visible = false;
      }
      if (ambient) ambient.intensity = 0.45;
      if (roomLight) roomLight.intensity = 0.85;
      document.body.classList.remove('menu-active');
      if (whitenerMesh) whitenerMesh.visible = babuActive;
      if (gulluMesh) gulluMesh.visible = khakiActive;
      if (gulluMesh && gulluMesh.userData && gulluMesh.userData.head) {
        gulluMesh.userData.head.rotation.set(0, 0, 0);
      }
    } catch (_) {}
    hudNightLbl.style.color = cfg.hudColor;
    phoneBox.classList.remove('hide');
    if (phoneText) {
      phoneText.innerHTML = (typeof GAME_ICONS !== 'undefined' ? GAME_ICONS.phone + ' ' : '') + '<span style="color:#fbbf24;font-weight:bold;">INCOMING CALL · RO HQ (RINGING...)</span>';
    }
    menuModal.classList.add('hide');
    if (howToPlayModal) howToPlayModal.classList.add('hide');
    if (optionsModal) optionsModal.classList.add('hide');
    gameoverModal.classList.add('hide');
    gameoverModal.style.display = 'none';
    if (deathScreen) deathScreen.classList.add('hide');
    hud.style.display = '';
    hud.classList.add('on');
    document.body.classList.remove('jumpscare-shaking');
    camera.fov = 75;
    camera.updateProjectionMatrix();
    camera.position.set(0, 1.75, 1.85);
    camera.rotation.set(0, 0, 0);

    syncControlsUI();
    updateIntruderPositions();
  }

  // --- CONTROLS & GADGETS ---
  function setLookDir(dir) {
    if (state !== 'PLAYING') return;
    if (cctvOpen) toggleCctv(false);
    useMousePan = false;
    lookDir = dir;
    targetYaw = dir === -1 ? 1.25 : dir === 1 ? -1.25 : 0;
    document.body.classList.toggle('look-left', dir === -1);
    document.body.classList.toggle('look-center', dir === 0);
    document.body.classList.toggle('look-right', dir === 1);
    try { navigator.vibrate?.(12); } catch (_) {}
    syncControlsUI();
  }

  let cctvFlashStallCooldown = 0;
  let cctvShock = {
    active: false,
    monster: null, // 'gullu' | 'whitener'
    camIdx: -1,
    timer: 0,
    retreatZone: 0,
    retreatSpotIdx: 0,
    toastMsg: '',
    subMsg: '',
    subTime: 3500
  };

  function triggerCctvFlashStall() {
    if (!cctvOpen || upsBattery <= 0) return;
    if (cctvShock.active) return;
    if (cctvFlashStallCooldown > 0) return;

    const gLoc = GULLU_PATH[gulluStep];
    const wLoc = WHITENER_PATH[whitenerStep];

    // Power Room (CAM 09) Sabotage Repel & Fuse Reset
    if (activeCamIdx === 8) {
      cctvFlashStallCooldown = 5.0;
      flashStatic(0.9, 300);
      powerSabotageCooldown = 60.0;
      if (isPowerSabotaged) {
        resolvePowerSabotage(false, 'Khaki blinded by camera flash at generator!');
      }
      if (gLoc === 8) {
        gulluWait += 16.0;
        // Monster stays in camera view for 1.1s under the Horror Beam with Shocked face texture!
        cctvShock = {
          active: true,
          monster: 'gullu',
          camIdx: 8,
          timer: 1.15,
          retreatZone: 0, // Flees all the way back to the gate after 1.1s!
          retreatSpotIdx: Math.floor(Math.random() * (ZONE_SPOTS[0]?.length || 1)),
          toastMsg: ' KHAKI FLASHED · POWER RESTORED',
          subMsg: '',
          subTime: 4200
        };
        if (gulluMesh && gulluMesh.userData && gulluMesh.userData.setSkin) {
          gulluMesh.userData.setSkin('shocked');
        }
      } else {
        showToast('POWER RESTORED');
      }
      syncControlsUI();
      return;
    }

    const khakiHere = (activeCamIdx === gLoc && gLoc !== ZONE_KHAKI_DOOR && gLoc !== ZONE_KHAKI_PEEK);
    const babuHere = (activeCamIdx === wLoc && wLoc !== ZONE_BABU_WINDOW && wLoc !== ZONE_BABU_PEEK);

    // Both monsters caught simultaneously in camera flash!
    if (khakiHere && babuHere) {
      cctvFlashStallCooldown = 5.0;
      gulluWait += 14.0;
      whitenerWait += 14.0;
      flashStatic(0.95, 340);

      let retreatZG = (gLoc === 1 ? 0 : 1);
      let retreatZW = (wLoc === 1 ? 0 : 1);
      cctvShock = {
        active: true,
        monster: 'both',
        camIdx: activeCamIdx,
        timer: 1.15,
        retreatZoneG: retreatZG,
        retreatZoneW: retreatZW,
        retreatSpotIdxG: Math.floor(Math.random() * (ZONE_SPOTS[retreatZG]?.length || 1)),
        retreatSpotIdxW: Math.floor(Math.random() * (ZONE_SPOTS[retreatZW]?.length || 1)),
        toastMsg: ' BOTH FLASHED · RETREATED',
        subMsg: '',
        subTime: 3800
      };
      if (gulluMesh && gulluMesh.userData && gulluMesh.userData.setSkin) gulluMesh.userData.setSkin('shocked');
      if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.setSkin) whitenerMesh.userData.setSkin('shocked');
      return;
    }

    // Khaki caught in the camera flashlight / horror beam!
    if (khakiHere) {
      cctvFlashStallCooldown = 5.0;
      gulluWait += 14.0; // Stalls advance by ~14 seconds!
      flashStatic(0.9, 320);

      let retreatZ = gLoc;
      let toast = '';
      let sub = '';
      if (gLoc === 4) {
        retreatZ = 2; // Retreat from CAM 05 to CAM 03
        toast = ' KHAKI FLASHED · RETREATED';
        sub = '';
      } else if (gLoc === 6 || gLoc === 2) {
        retreatZ = 1; // Retreat to Courtyard
        toast = ' KHAKI FLASHED · RETREATED';
        sub = '';
      } else if (gLoc === 1) {
        retreatZ = 0; // Retreat to Gate
        toast = ' KHAKI FLASHED · RETREATED';
        sub = '';
      } else {
        toast = ' KHAKI FLASHED';
        sub = '';
      }

      // Monster stays in camera view for 1.15s under the Horror Beam with Shocked texture!
      cctvShock = {
        active: true,
        monster: 'gullu',
        camIdx: activeCamIdx,
        timer: 1.15,
        retreatZone: retreatZ,
        retreatSpotIdx: Math.floor(Math.random() * (ZONE_SPOTS[retreatZ]?.length || 1)),
        toastMsg: toast,
        subMsg: sub,
        subTime: 3600
      };
      if (gulluMesh && gulluMesh.userData && gulluMesh.userData.setSkin) {
        gulluMesh.userData.setSkin('shocked');
      }
      return;
    }

    // Babu caught in the camera flashlight / horror beam!
    if (activeCamIdx === wLoc && wLoc !== ZONE_BABU_WINDOW && wLoc !== ZONE_BABU_PEEK) {
      cctvFlashStallCooldown = 5.0;
      whitenerWait += 14.0; // Stalls advance by ~14 seconds!
      flashStatic(0.9, 320);

      let retreatZ = wLoc;
      let toast = '';
      let sub = '';
      if (wLoc === ZONE_BABU_PEEK) {
        retreatZ = 3; // Retreat from CAM 06 Peek Window to Staff Room (CAM 04)
        toast = ' BABU FLASHED · RETREATED';
        sub = '';
      } else if (wLoc === 9) {
        retreatZ = 3; // Retreat from Library to Staff Room
        toast = ' BABU FLASHED · RETREATED';
        sub = '';
      } else if (wLoc === 7 || wLoc === 3) {
        retreatZ = 1; // Retreat to Courtyard
        toast = ' BABU FLASHED · RETREATED';
        sub = '';
      } else if (wLoc === 1) {
        retreatZ = 0; // Retreat to Gate
        toast = ' BABU FLASHED · RETREATED';
        sub = '';
      } else {
        toast = ' BABU FLASHED';
        sub = '';
      }

      // Monster stays in camera view for 1.15s under the Horror Beam with Shocked texture!
      cctvShock = {
        active: true,
        monster: 'whitener',
        camIdx: activeCamIdx,
        timer: 1.15,
        retreatZone: retreatZ,
        retreatSpotIdx: Math.floor(Math.random() * (ZONE_SPOTS[retreatZ]?.length || 1)),
        toastMsg: toast,
        subMsg: sub,
        subTime: 3600
      };
      if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.setSkin) {
        whitenerMesh.userData.setSkin('shocked');
      }
      return;
    }
  }

  function setCctvFlashlight(on) {
    // Flash mechanism removed entirely per user request
    cctvFlashlightOn = false;
  }

  function toggleCctvFlashlight() {
    // Flash mechanism removed entirely per user request
    cctvFlashlightOn = false;
  }

  function toggleCctv(forceState) {
    if (state !== 'PLAYING' || upsBattery <= 0) return;
    cctvOpen = typeof forceState === 'boolean' ? forceState : !cctvOpen;
    updateCam09Prompt();
    updateCam10Prompt();
    if (!cctvOpen && isWirePuzzleOpen) {
      closeWirePuzzle();
    }
    if (!cctvOpen && isSharkPuzzleOpen) {
      closeSharkPuzzle();
    }
    if (cctvOpen) {
      if (typeof roomLight !== 'undefined' && roomLight) roomLight.castShadow = false;
      if (typeof flashlight !== 'undefined' && flashlight) flashlight.castShadow = false;
      tutTestedCctv = true;
      leftLightOn = false;
      rightLightOn = false;
      cctvFlashlightOn = false;
      document.body.classList.add('cctv-active');
      if (isHoldingScan) stopHoldScan(false);
    if (isHoldingStamp) stopHoldStamp(false);
      if (isHoldingRepair) stopHoldRepair(false);
      if (handHammer) handHammer.visible = false;
      if (handForm) handForm.visible = false;
      if (handTorchGroup) handTorchGroup.visible = false;
    } else {
      if (typeof roomLight !== 'undefined' && roomLight) roomLight.castShadow = renderer.shadowMap.enabled;
      if (typeof flashlight !== 'undefined' && flashlight) flashlight.castShadow = renderer.shadowMap.enabled;
      document.body.classList.remove('cctv-active');
      setCctvFlashlight(false);
      const cam01Panel = document.getElementById('cam01-chai-panel');
      if (cam01Panel) cam01Panel.style.display = 'none';
      if (cctvCamLight) cctvCamLight.intensity = 0;
      if (cam5Light) cam5Light.intensity = 0.15;
      if (cam6Light) cam6Light.intensity = 0.15;
      if (handHammer) handHammer.visible = (equippedItem === 'HAMMER');
      if (handForm) handForm.visible = (equippedItem === 'FORM' || holdingForm);
    }
    GameAudio.cctvToggle(cctvOpen);
    if (GameAudio.updateCamAmbient) GameAudio.updateCamAmbient(cctvOpen, activeCamIdx);
    if (cctvOpen) {
      const flipLoad = 0.16 + Math.random() * (Math.random() < 0.30 ? 0.28 : 0.12);
      triggerFullStatic(flipLoad, 0.10); // Dynamic monitor flip up static
    }
    updateCctvMonsterWarning();
    syncActiveSceneLights();
    syncControlsUI();
  }

  function checkBabuRoamWhisper(fromZone, toZone) {
    if (state !== 'PLAYING') return;
    // User requested: strictly when player is in office (not when looking at CCTV monitor)
    if (cctvOpen) return;
    if (typeof whitenerEnraged !== 'undefined' && whitenerEnraged) return;
    if (typeof whitenerRageTimer !== 'undefined' && whitenerRageTimer > 0) return;

    if (babuWhisperCooldown > 0) return;

    // Organic chance check: 40% chance when Babu moves between rooms
    if (Math.random() > 0.40) {
      // Soft cooldown on miss: 12-18s before next room-shift roll
      babuWhisperCooldown = 12.0 + Math.random() * 6.0;
      return;
    }

    // Set full cooldown immediately (28 - 42 seconds) so Babu doesn't become too chatty
    babuWhisperCooldown = 28.0 + Math.random() * 14.0;

    // Slight delay (250ms) as Babu begins shifting rooms
    babuWhisperPendingTimeout = setTimeout(() => {
      babuWhisperPendingTimeout = null;
      if (state !== 'PLAYING' || cctvOpen) return;
      if (typeof whitenerEnraged !== 'undefined' && whitenerEnraged) return;
      if (typeof whitenerRageTimer !== 'undefined' && whitenerRageTimer > 0) return;

      if (GameAudio && GameAudio.playBabuDistantWhisper) {
        // Panned +0.55 to right wing (where Babu roams outside the office)
        const line = GameAudio.playBabuDistantWhisper(0.55);
        if (line && line.subtitle) {
          showPS1Subtitle(`Babu: "${getLineSubtitle(line)}"`, Math.round((line.dur || 3.5) * 1000) + 600);
        }
      }
    }, 250);
  }

  function checkKhakiRoamWhisper(fromZone, toZone) {
    if (state !== 'PLAYING') return;
    // Strictly when player is in office (not when looking at CCTV monitor)
    if (cctvOpen) return;
    if (typeof gulluEnraged !== 'undefined' && gulluEnraged) return;
    if (typeof gulluRageTimer !== 'undefined' && gulluRageTimer > 0) return;

    if (khakiWhisperCooldown > 0) return;

    // Organic chance check: 40% chance when Khaki moves between rooms
    if (Math.random() > 0.40) {
      // Soft cooldown on miss: 12-18s before next room-shift roll
      khakiWhisperCooldown = 12.0 + Math.random() * 6.0;
      return;
    }

    // Set full cooldown immediately (28 - 42 seconds) so Khaki doesn't become too chatty
    khakiWhisperCooldown = 28.0 + Math.random() * 14.0;

    // Slight delay (250ms) as Khaki begins shifting rooms
    khakiWhisperPendingTimeout = setTimeout(() => {
      khakiWhisperPendingTimeout = null;
      if (state !== 'PLAYING' || cctvOpen) return;
      if (typeof gulluEnraged !== 'undefined' && gulluEnraged) return;
      if (typeof gulluRageTimer !== 'undefined' && gulluRageTimer > 0) return;

      if (GameAudio && GameAudio.playKhakiDistantWhisper) {
        // Panned -0.55 to left wing (where Khaki roams outside the office)
        const line = GameAudio.playKhakiDistantWhisper(-0.55);
        if (line && line.subtitle) {
          showPS1Subtitle(`Khaki: "${getLineSubtitle(line)}"`, Math.round((line.dur || 3.5) * 1000) + 600);
        }
      }
    }, 250);
  }

  function updateCctvMonsterWarning() {
    const warnPrompt = document.getElementById('cctv-monster-warning-prompt');
    if (warnPrompt) warnPrompt.classList.add('hide');
  }

  function updateCam09Prompt() {
    if (!cam09Prompt) return;
    if (typeof getCurrentLevelConfig === 'function' && !getCurrentLevelConfig().hasPowerSabotage) {
      cam09Prompt.classList.add('hide');
      return;
    }
    cam09Prompt.classList.add('hide');
  }

  function selectCam(idx) {
    if (state !== 'PLAYING') return;
    if (idx === 8 && typeof getCurrentLevelConfig === 'function' && !getCurrentLevelConfig().hasPowerSabotage) return;
    activeCamIdx = idx;
    updateCam09Prompt();
    updateCam10Prompt();
    updateCctvMonsterWarning();
    syncActiveSceneLights();
    if (isWirePuzzleOpen && activeCamIdx !== 8) {
      closeWirePuzzle();
    }
    if (isSharkPuzzleOpen && activeCamIdx !== 9) {
      closeSharkPuzzle();
    }
    // Dynamic camera load: sometimes fast snap, sometimes standard sync, sometimes longer stubborn static
    const camLoad = calculateDynamicCamLoad(idx);
    GameAudio.cctvBlip(camLoad.isLong);
    if ((camLoad.isLong || camLoad.isMonsterHere) && GameAudio.playStaticClip) {
      GameAudio.playStaticClip(camLoad.duration, 0.32);
    }
    if (GameAudio.updateCamAmbient) GameAudio.updateCamAmbient(true, idx);
    triggerFullStatic(camLoad.duration, camLoad.fadeTime, camLoad.opacity);
    camButtons.forEach(b => b.classList.toggle('sel', parseInt(b.dataset.cam, 10) === idx));
    syncActiveSceneLights();

    syncControlsUI();
  }

  function toggleLeftDoor() {
    if (state !== 'PLAYING') return;
    // INSTANT BREACH: Opening the closed door while Khaki is waiting/pounding outside triggers an immediate breach!
    if (leftDoorClosed && GULLU_PATH[gulluStep] === ZONE_KHAKI_DOOR) {
      leftDoorClosed = false;
      animate._doorVel = -38;
      triggerImpactSlam('door', 'heavy');
      triggerJumpscare('gullu', 'You opened the left door while Khaki was outside.');
      return;
    }

    // MID-PEEK OPENING: Opening the door while Khaki is peeking outside at the window!
    const gLocCur = GULLU_PATH[gulluStep];
    const moodStg = getMoodStage();
    if (leftDoorClosed && gLocCur === ZONE_KHAKI_PEEK) {
      leftDoorClosed = false;
      syncControlsUI();
      GameAudio.doorSlam(false);
      animate._camImpact = 0.15;

      gulluStep++;
      GULLU_PATH[gulluStep] = ZONE_KHAKI_DOOR;
      setHumanoidPeekMode(gulluMesh, false);
      const cfgMidG = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
      gulluWalkAnim = { fromX: -4.80, fromY: -0.74, fromZ: -2.55, toX: -4.55, toY: -0.06, toZ: 0.05, t: 0, dur: cfgMidG.rushDur, yaw: Math.PI / 2 };
      gulluRushCharge = { timer: cfgMidG.rushDur, dur: cfgMidG.rushDur, origin: 'peek' };

      GameAudio.chargeRush(-0.85, -0.35, cfgMidG.rushDur);
      showToast('KHAKI CHARGING · CLOSE DOOR (1)');
      return;
    }

    leftDoorClosed = !leftDoorClosed;
    animate._camImpact = leftDoorClosed ? 0.22 : 0.08;
    GameAudio.doorSlam(leftDoorClosed);
    syncControlsUI();
    updateIntruderPositions();
  }

  function getHourProg() {
    const hourFloat = (nightSeconds / NIGHT_DURATION) * 6;
    return Math.min(1.0, hourFloat / 5.0);
  }

  function getMoodStage() {
    const hourFloat = (nightSeconds / NIGHT_DURATION) * 6;
    if (selectedDifficulty === 'IMPOSSIBLE' || hourFloat >= 3.8) return 2; // Stage 3: Furious & Aggressive
    if (selectedDifficulty === 'HARD' || hourFloat >= 1.8) return 1; // Stage 2: Annoyed & Impatient
    return 0; // Stage 1: Easy-Going & Polite
  }

  function setLeftLight(on) {
    if (state !== 'PLAYING') {
      leftLightOn = false;
      syncControlsUI();
      return;
    }
    if (on && upsBattery <= 0) return;
    if (leftLightOn === on) return;
    leftLightOn = on;
    if (leftLightOn) {
      tutTestedLight = true;
      setRightLight(false);
      leftFlickerNext = 0.16 + Math.random() * 0.16;
      leftFlickerDropTimer = 0;
      isLeftLightDarkNow = false;
      GameAudio.lightBuzz();
      const gLoc = GULLU_PATH[gulluStep];
      if (khakiActive && gLoc === ZONE_KHAKI_PEEK) {
        if (!gulluSpottedSting) {
          gulluSpottedSting = true;
          const stg = getMoodStage();

          // Difficulty-scaled BLINDING FLUKE:
          const cfgStunL = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
          const rollStun = Math.random() < cfgStunL.stunChance;
          if (rollStun) {
            gulluDuckTimer = 0.90; // Only flinch back on rare stun!
            GameAudio.khakiRetreatCues();
            gulluStep = 0;
            GULLU_PATH[0] = Math.random() < 0.5 ? 0 : 1;
            gulluSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[GULLU_PATH[0]]?.length || 1));
            gulluWait = (24.0 - getHourProg() * 6.0) * (0.85 + Math.random() * 0.45);
            gulluWalkAnim = null;
            setHumanoidPeekMode(gulluMesh, false);
            updateIntruderPositions();
          }
        }
      }
    } else {
      leftFlickerDropTimer = 0;
      isLeftLightDarkNow = false;
      leftFlickerNext = 0.16 + Math.random() * 0.16;
    }
    syncControlsUI();
  }

  function toggleLeftLight() {
    setLeftLight(!leftLightOn);
  }

  function toggleRightShutter() {
    if (state !== 'PLAYING') return;
    // INSTANT BREACH: Opening the shutter while Babu is waiting/pounding outside triggers an immediate breach!
    if (rightShutterClosed && WHITENER_PATH[whitenerStep] === ZONE_BABU_WINDOW) {
      rightShutterClosed = false;
      animate._shutterVelL = 34;
      animate._shutterVelR = 34;
      triggerImpactSlam('win', 'heavy');
      triggerJumpscare('whitener', 'You opened the right window while Babu was outside.');
      return;
    }

    // MID-PEEK OPENING: Opening the shutter while Babu is peeking outside at the window!
    const wLocCur = WHITENER_PATH[whitenerStep];
    const moodStgW = getMoodStage();
    if (rightShutterClosed && wLocCur === ZONE_BABU_PEEK) {
      rightShutterClosed = false;
      syncControlsUI();
      GameAudio.shutterSlam(false);
      animate._camImpact = 0.15;

      whitenerStep++;
      WHITENER_PATH[whitenerStep] = ZONE_BABU_WINDOW;
      setHumanoidPeekMode(whitenerMesh, false);
      const cfgMidW = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
      whitenerWalkAnim = { fromX: 4.80, fromY: -0.74, fromZ: -2.55, toX: 4.60, toY: 0.06, toZ: 0.05, t: 0, dur: cfgMidW.rushDur, yaw: -Math.PI / 2 };
      whitenerRushCharge = { timer: cfgMidW.rushDur, dur: cfgMidW.rushDur, origin: 'peek' };

      GameAudio.chargeRush(0.85, 0.35, cfgMidW.rushDur);
      GameAudio.doorBlockedThud(0.85);
      showToast('BABU CHARGING · CLOSE SHUTTER (2)');
      return;
    }

    rightShutterClosed = !rightShutterClosed;
    animate._camImpact = rightShutterClosed ? 0.16 : 0.06;
    GameAudio.shutterSlam(rightShutterClosed);
    syncControlsUI();
    updateIntruderPositions();
  }

  function setRightLight(on) {
    if (state !== 'PLAYING') {
      rightLightOn = false;
      syncControlsUI();
      return;
    }
    if (on && upsBattery <= 0) return;
    if (rightLightOn === on) return;
    rightLightOn = on;
    if (rightLightOn) {
      tutTestedLight = true;
      setLeftLight(false);
      rightFlickerNext = 0.16 + Math.random() * 0.16;
      rightFlickerDropTimer = 0;
      isRightLightDarkNow = false;
      GameAudio.lightBuzz();
      const wLoc = WHITENER_PATH[whitenerStep];
      if (babuActive && wLoc === ZONE_BABU_PEEK) {
        if (!whitenerSpottedSting) {
          whitenerSpottedSting = true;
          const stg = getMoodStage();

          // Difficulty-scaled BLINDING FLUKE:
          const cfgStunR = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
          const rollStun = Math.random() < cfgStunR.stunChance;
          if (rollStun) {
            whitenerDuckTimer = 0.90; // Only flinch back on rare stun!
            GameAudio.babuRetreatCues();
            whitenerStep = 0;
            WHITENER_PATH[0] = Math.random() < 0.5 ? 3 : 1;
            whitenerSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[WHITENER_PATH[0]]?.length || 1));
            whitenerWait = (11.0 - getHourProg() * 4.0) * (0.85 + Math.random() * 0.40);
            whitenerWalkAnim = null;
            setHumanoidPeekMode(whitenerMesh, false);
            updateIntruderPositions();
          }
        }
      }
    } else {
      rightFlickerDropTimer = 0;
      isRightLightDarkNow = false;
      rightFlickerNext = 0.16 + Math.random() * 0.16;
    }
    syncControlsUI();
  }

  function toggleRightLight() {
    setRightLight(!rightLightOn);
  }

  function reconnectVpn() {
    if (state !== 'PLAYING') return;
    if (vpnDisconnected) {
      vpnDisconnected = false;
      const cfgVPN = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
      sharkTimer = cfgVPN.sharkTimerMin + Math.random() * (cfgVPN.sharkTimerMax - cfgVPN.sharkTimerMin);
      GameAudio.vpnReconnect();
      showToast('WIFI RESTORED');
      syncControlsUI();
    }
  }

  function sendGateChai() {
    if (state !== 'PLAYING') return;
    if (kettleBrewing) {
      const rem = Math.max(1, Math.ceil(KETTLE_BREW_DURATION - kettleBrewTimer));
      showToast(`BOILING CHAI (${rem}s)`);
      if (GameAudio.cctvBlip) GameAudio.cctvBlip();
      return;
    }
    if (!kettleChaiReady) {
      showToast('BOIL CHAI AT KETTLE (D)');
      if (GameAudio.cctvBlip) GameAudio.cctvBlip();
      return;
    }
    kettleChaiReady = false;
    chowkidarChai = Math.min(100, chowkidarChai + 50);
    if (chowkidarMesh) {
      chowkidarMesh.rotation.z = 0;
      chowkidarMesh.position.y = -2.13;
    }
    if (kettleStation && kettleStation.teaGlass && kettleStation.teaGlass.material) {
      kettleStation.teaGlass.material.opacity = 0.35;
    }
    GameAudio.cctvBlip();
    showToast('CHAI SENT TO CHACHA');
    syncControlsUI();
  }

  function handleBrewKettleAction() {
    if (state !== 'PLAYING' || cctvOpen) return;
    if (kettleBrewing) {
      const rem = Math.max(1, Math.ceil(KETTLE_BREW_DURATION - kettleBrewTimer));
      showToast(`BOILING CHAI (${rem}s)`);
      return;
    }
    if (kettleChaiReady) {
      showToast('CHAI READY · SEND AT CAM 01 (C)');
      return;
    }
    kettleBrewing = true;
    kettleBrewTimer = 0;
    if (GameAudio.startKettleBoilLoop) {
      GameAudio.startKettleBoilLoop(0.65);
    } else if (GameAudio.kettleBoilBrew) {
      GameAudio.kettleBoilBrew(0.65);
    }
    showToast('BOILING CHAI (10s)');
    syncControlsUI();
  }

  function updateKettleSteamAndBrewing(dt, now) {
    if (state === 'PLAYING' && kettleBrewing) {
      kettleBrewTimer += dt;
      const progress = Math.min(1.0, kettleBrewTimer / KETTLE_BREW_DURATION);

      // Realtime countdown sync for CCTV UI if CCTV is open
      if (cctvOpen) {
        const chaiStatEl = document.getElementById('cctv-chai-status');
        const rem = Math.max(1, Math.ceil(KETTLE_BREW_DURATION - kettleBrewTimer));
        if (chaiStatEl) {
          chaiStatEl.textContent = ` BOILING (${rem}s)`;
          chaiStatEl.style.color = '#f59e0b';
        }
        if (btnBrewChai) {
          btnBrewChai.textContent = `BOILING (${rem}s)`;
          btnBrewChai.style.opacity = '0.70';
          btnBrewChai.style.cursor = 'wait';
          btnBrewChai.style.borderColor = '#f59e0b';
          btnBrewChai.style.background = 'linear-gradient(180deg, #78350f, #292524)';
        }
      }

      // Animate active 3D steam puffs rising from spout and lid
      if (kettleStation && kettleStation.steamPuffs) {
        const puffs = kettleStation.steamPuffs;
        for (let i = 0; i < puffs.length; i++) {
          const p = puffs[i];
          p.userData.age += dt;
          const normAge = (p.userData.age % p.userData.lifeSpan) / p.userData.lifeSpan;

          // Origin coordinates relative to kettlePot:
          // Spout tip: (-0.16, 0.205, 0.11), Lid dome seam: (0.0, 0.305, 0.0)
          const ox = p.userData.isSpout ? -0.16 : 0.0;
          const oy = p.userData.isSpout ? 0.205 : 0.305;
          const oz = p.userData.isSpout ? 0.11 : 0.0;

          const t = normAge * p.userData.lifeSpan;
          const rise = t * p.userData.upSpeed;
          // Drifts slightly outward into the room (+Z, -X) with curling turbulence
          const driftX = (p.userData.isSpout ? -0.06 : 0.0) + Math.cos(p.userData.angle) * (t * p.userData.driftSpeed);
          const driftZ = (p.userData.isSpout ? 0.05 : 0.0) + Math.sin(p.userData.angle) * (t * p.userData.driftSpeed);
          const curl = Math.sin(now * 0.005 + p.userData.curlSeed) * 0.02 * normAge;

          p.position.set(ox + driftX + curl, oy + rise, oz + driftZ + curl);

          // Billowing expansion as steam ascends
          const currentScale = p.userData.baseScale * (1.0 + normAge * 3.6);
          p.scale.set(currentScale, currentScale * 1.15, currentScale);

          // Opacity curve: quick swell, billowing density, smooth fade-out
          let op = 0;
          if (normAge < 0.18) {
            op = (normAge / 0.18) * 0.44;
          } else if (normAge < 0.60) {
            op = 0.44 - (normAge - 0.18) * 0.15;
          } else {
            op = 0.30 * (1.0 - (normAge - 0.60) / 0.40);
          }
          p.material.opacity = Math.max(0, Math.min(0.50, op));
          p.visible = true;
        }
      }

      // Lid jitter & vibration from internal boiling steam pressure
      if (kettleStation && kettleStation.lidDome && kettleStation.lidKnob) {
        const rattle = Math.sin(now * 0.052) * 0.0024;
        kettleStation.lidDome.position.y = 0.292 + rattle;
        kettleStation.lidKnob.position.y = 0.320 + rattle;
      }

      // Warm amber simmer glow under kettle
      if (kettleStation && kettleStation.light) {
        kettleStation.light.intensity = 0.40 + Math.sin(now * 0.012) * 0.22;
      }

      // Tea glass gradual color fill as brewing reaches the finish line
      if (kettleStation && kettleStation.teaGlass && kettleStation.teaGlass.material) {
        if (progress > 0.50) {
          const fillRatio = (progress - 0.50) / 0.50;
          kettleStation.teaGlass.material.opacity = 0.35 + fillRatio * 0.60;
          kettleStation.teaGlass.material.color.setHex(0xb45309);
        }
      }

      // Finished boiling after 10 seconds! (Chai is ready while the 13s audio plays through its transition whistle)
      if (kettleBrewTimer >= KETTLE_BREW_DURATION) {
        kettleBrewing = false;
        kettleChaiReady = true;
        kettleBrewTimer = 0;
        if (kettleStation && kettleStation.teaGlass && kettleStation.teaGlass.material) {
          kettleStation.teaGlass.material.opacity = 0.95;
          kettleStation.teaGlass.material.color.setHex(0xb45309);
        }
        showToast('CHAI READY · CAM 01 (C)');
        syncControlsUI();
      }
    } else {
      // When not actively boiling: smoothly dissipate lingering steam puffs
      if (kettleStation && kettleStation.steamPuffs) {
        kettleStation.steamPuffs.forEach(p => {
          if (p.material.opacity > 0.005) {
            p.material.opacity = Math.max(0, p.material.opacity - dt * 1.5);
            p.position.y += dt * 0.12;
          } else {
            p.visible = false;
          }
        });
      }
      if (kettleStation && kettleStation.lidDome && kettleStation.lidKnob) {
        kettleStation.lidDome.position.y = 0.292;
        kettleStation.lidKnob.position.y = 0.320;
      }
      if (kettleStation && kettleStation.light) {
        kettleStation.light.intensity = 0.40;
      }
    }
  }

  function drinkDeskChai() {
    if (state !== 'PLAYING' || deskChaiUsed) return;
    const cfgChai = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
    deskChaiUsed = true;
    chaiCup.visible = false;
    upsBattery = Math.min(100, upsBattery + cfgChai.deskChaiBoost);
    currentUploadPct = Math.min(99, currentUploadPct + 50);
    GameAudio.victoryChime();
    showToast(`+${cfgChai.deskChaiBoost}% BATTERY`);
    syncControlsUI();
  }

  function startHoldStamp() {
    if (state !== 'PLAYING' || cctvOpen) return;
    if (!getCurrentLevelConfig().hasSealVerification) return;
    if (!holdingForm) {
      showToast('GRAB FORM FIRST (S)');
      return;
    }
    if (isFormStamped) {
      if (GameAudio.click) GameAudio.click();
      return;
    }
    if (isHoldingStamp) return;
    isHoldingStamp = true;
    stampProgress = 0;
    if (stampHoldHud) stampHoldHud.style.display = 'block';
    if (stampHoldBar) stampHoldBar.style.width = '0%';
    if (stampHoldPct) stampHoldPct.textContent = '0%';
    if (stampBtnProgressWrap) stampBtnProgressWrap.style.display = 'block';
    if (stampBtnProgressBar) stampBtnProgressBar.style.width = '0%';
    handStampAnimTimer = 0.45;
    deskStampBounce = 0.35;
    if (GameAudio.click) GameAudio.click();
  }

  function stopHoldStamp(completed = false) {
    if (!isHoldingStamp) return;
    isHoldingStamp = false;
    stampProgress = 0;
    if (stampHoldHud) stampHoldHud.style.display = 'none';
    if (stampHoldBar) stampHoldBar.style.width = '0%';
    if (stampHoldPct) stampHoldPct.textContent = '0%';
    if (stampBtnProgressWrap) stampBtnProgressWrap.style.display = 'none';
    if (stampBtnProgressBar) stampBtnProgressBar.style.width = '0%';
    if (!completed) {
      handStampAnimTimer = 0;
    }
  }

  function stampHeldForm() {
    if (state !== 'PLAYING' || cctvOpen) return;
    if (!holdingForm) {
      showToast('GRAB FORM FIRST (S)');
      return;
    }
    if (isFormStamped) {
      if (GameAudio.click) GameAudio.click();
      return;
    }

    isFormStamped = true;
    handStampAnimTimer = 0.35;
    deskStampBounce = 1.0;
    ballotBoxBounce = 0.22;

    if (GameAudio.stampThud) GameAudio.stampThud();
    else if (GameAudio.formCollected) GameAudio.formCollected();

    const curNum = formsScanned + 1;
    const formTotal = formsScanned < 25 ? 25 : 30;
    if (handForm && handForm.updateTexture) {
      handForm.updateTexture(curNum, formTotal, true);
    } else if (window.__updateForm45Texture) {
      window.__updateForm45Texture(curNum, formTotal, true);
    }

    try { navigator.vibrate?.(35); } catch (_) {}

    stopHoldStamp(true);
    syncInventoryUI();
    syncControlsUI();
  }

  function grabFormFromBox() {
    if (state !== 'PLAYING') return;
    if (holdingForm) {
      if (isHoldingScan) {
        stopHoldScan(false);
      }
      if (isHoldingStamp) {
        stopHoldStamp(false);
      }
      holdingForm = false;
      equippedItem = 'NONE';
      formsInBox++;
      if (handForm) {
        handForm.visible = false;
        handFormAnimTimer = 0;
      }
      ballotBoxBounce = 0.32;
      GameAudio.formCollected();
      syncInventoryUI();
      syncControlsUI();
      return;
    }
    if (formsInBox <= 0) {
      if (cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.size > 0) {
        showToast('Find remaining Form 45 from the camera');
      }
      return;
    }

    // Auto-holster hammer: if holding hammer, place it back on the wall first
    if (equippedItem === 'HAMMER') {
      if (isHoldingRepair) stopHoldRepair();
      equippedItem = 'NONE';
      GameAudio.click();
    }

    holdingForm = true;
    equippedItem = 'FORM';
    formsInBox--;

    const curLvlCfg = getCurrentLevelConfig();
    const needsSeal = !!curLvlCfg.hasSealVerification;
    isFormStamped = !needsSeal;

    syncInventoryUI();

    const curNum = formsScanned + 1;
    const formTotal = formsScanned < 25 ? 25 : 30;

    // 1. 3D Handheld Form draw-in animation (slides up into view from desk)
    if (handForm) {
      handForm.visible = true;
      if (handForm.updateTexture) handForm.updateTexture(curNum, formTotal, isFormStamped);
      else if (window.__updateForm45Texture) window.__updateForm45Texture(curNum, formTotal, isFormStamped);
      handFormAnimTimer = 0.35;
      handForm.position.set(0.24, -0.58, -0.52);
    }

    // 2. 3D Ballot Box lid movement
    ballotBoxBounce = 0.28;

    // 3. Audio: Realistic, gritty paper rustle & wooden box latch clack
    GameAudio.formCollected();

    // 4. Subtle green civic pulse & status text
    if (formPickupFx) {
      formPickupFx.classList.add('active');
      setTimeout(() => formPickupFx.classList.remove('active'), 200);
    }

    syncControlsUI();
  }

  function startHoldScan() {
    if (state !== 'PLAYING' || cctvOpen) return;
    if (vpnDisconnected) {
      showToast('WIFI DOWN · CHECK CAM 10');
      if (GameAudio.sharkAlert) GameAudio.sharkAlert();
      return;
    }
    if (!holdingForm) {
      showToast('GRAB FORM AT DESK (S)');
      return;
    }
    const curLvlCfg = getCurrentLevelConfig();
    if (curLvlCfg.hasSealVerification && !isFormStamped) {
      showToast('STAMP SEAL FIRST (E)');
      if (GameAudio.wireBuzz) GameAudio.wireBuzz();
      if (scanStation && scanStation.led) scanStation.led.material.color.setHex(0xef4444);
      return;
    }
    if (isHoldingScan) return;
    isHoldingScan = true;
    scanProgress = 0;
    if (scanHoldHud) scanHoldHud.style.display = 'block';
    if (scanHoldBar) scanHoldBar.style.width = '0%';
    if (scanStation && scanStation.led) scanStation.led.material.color.setHex(0xef4444);
    if (scanStation && scanStation.light) scanStation.light.intensity = 1.6;
    if (scanStation && scanStation.paper) scanStation.paper.visible = true;
    if (scanStation && scanStation.laser) {
      scanStation.laser.visible = true;
      scanStation.laser.position.set(0, 1.052, -0.26);
    }
    GameAudio.startScannerLoop();

    // INTRUDERS OUTSIDE WINDOW OR DOOR CATCH YOU SCANNING FORM-45!
    const gCurStart = GULLU_PATH[gulluStep];
    const canKhakiSee = (gCurStart === ZONE_KHAKI_PEEK) || (!leftDoorClosed && (gCurStart === 4 || gCurStart === ZONE_KHAKI_DOOR));
    if (canKhakiSee && !gulluEnraged) {
      triggerEnragedKhaki();
    }
    const wCurStart = WHITENER_PATH[whitenerStep];
    const canBabuSee = (wCurStart === ZONE_BABU_PEEK) || (!rightShutterClosed && (wCurStart === 5 || wCurStart === ZONE_BABU_WINDOW));
    if (canBabuSee && !whitenerEnraged) {
      triggerEnragedBabu();
    }
  }

  function stopHoldScan(completed = false) {
    if (!isHoldingScan) return;
    isHoldingScan = false;
    GameAudio.stopScannerLoop();
    if (scanHoldHud) scanHoldHud.style.display = 'none';
    if (scanStation && scanStation.light) {
      scanStation.light.intensity = 0.2;
      scanStation.light.position.set(0, 1.15, 0);
    }
    if (scanStation && scanStation.laser) scanStation.laser.visible = false;
    if (scanStation && scanStation.paper) scanStation.paper.visible = false;
    scanProgress = 0;
    if (scanHoldBar) scanHoldBar.style.width = '0%';
    if (!completed) {
      if (scanStation && scanStation.led) scanStation.led.material.color.setHex(0xfacc15);
    }
  }

  function updateWifiHud() {
    const wifiLbl = document.getElementById('ups-wifi-lbl');
    let activeBars = 4;
    let barColor = 'g';
    let statusText = '100% OPTIMAL';
    let lblClass = 'wifi-status-lbl';

    if (vpnDisconnected) {
      activeBars = 0;
      barColor = 'cut';
      statusText = '0% SHARK CUT';
      lblClass = 'wifi-status-lbl cut';
    } else if (leftDoorClosed && rightShutterClosed) {
      activeBars = 1;
      barColor = 'r';
      statusText = '25% (2 SHUT)';
      lblClass = 'wifi-status-lbl low';
    } else if (leftDoorClosed || rightShutterClosed) {
      activeBars = 2;
      barColor = 'y';
      statusText = '55% (1 SHUT)';
      lblClass = 'wifi-status-lbl warn';
    }

    for (let i = 1; i <= 4; i++) {
      const wbar = document.getElementById(`wb${i}`);
      if (!wbar) continue;
      const dotCls = (i === 1) ? ' wb-dot' : '';
      if (vpnDisconnected) {
        wbar.setAttribute('class', `wbar w${i}${dotCls} cut`);
      } else {
        wbar.setAttribute('class', `wbar w${i}${dotCls}` + (i <= activeBars ? ` on ${barColor}` : ''));
      }
    }
    if (wifiLbl) {
      wifiLbl.textContent = statusText;
      wifiLbl.className = lblClass;
    }
  }

  function syncControlsUI(dt = 0.016) {
    // Sync Form-45 scanning & upload HUD
    const chaiStatEl = document.getElementById('cctv-chai-status');
    if (chaiStatEl) {
      if (kettleBrewing) {
        const remaining = Math.max(1, Math.ceil(KETTLE_BREW_DURATION - kettleBrewTimer));
        chaiStatEl.textContent = ` BOILING (${remaining}s)`;
        chaiStatEl.style.color = '#f59e0b';
      } else if (kettleChaiReady) {
        chaiStatEl.textContent = ' READY';
        chaiStatEl.style.color = '#4ade80';
      } else {
        chaiStatEl.textContent = ' EMPTY';
        chaiStatEl.style.color = '#f87171';
      }
    }
    if (btnBrewChai) {
      if (kettleBrewing) {
        const remaining = Math.max(1, Math.ceil(KETTLE_BREW_DURATION - kettleBrewTimer));
        btnBrewChai.textContent = `BOILING (${remaining}s)`;
        btnBrewChai.style.opacity = '0.70';
        btnBrewChai.style.cursor = 'wait';
        btnBrewChai.style.borderColor = '#f59e0b';
        btnBrewChai.style.background = 'linear-gradient(180deg, #78350f, #292524)';
      } else if (kettleChaiReady) {
        btnBrewChai.textContent = ' SERVE (C)';
        btnBrewChai.style.opacity = '1.0';
        btnBrewChai.style.cursor = 'pointer';
        btnBrewChai.style.borderColor = '#86efac';
        btnBrewChai.style.background = 'linear-gradient(180deg, #15803d, #052e16)';
      } else {
        btnBrewChai.textContent = 'EMPTY (C)';
        btnBrewChai.style.opacity = '0.55';
        btnBrewChai.style.cursor = 'not-allowed';
        btnBrewChai.style.borderColor = '#71717a';
        btnBrewChai.style.background = 'linear-gradient(180deg, #3f3f46, #18181b)';
      }
    }
    if (scannedCountEl) scannedCountEl.textContent = formsScanned;
    if (uploadedCountEl) uploadedCountEl.textContent = formsUploaded;

    const curLvlCfg = getCurrentLevelConfig();
    const needsSeal = curLvlCfg.hasSealVerification && holdingForm && !isFormStamped;

    if (holdingFormBanner) {
      holdingFormBanner.style.display = holdingForm ? 'block' : 'none';
      if (holdingForm) {
        if (needsSeal) {
          holdingFormBanner.textContent = '⚠️ UNVERIFIED FORM · STAMP ECP SEAL (E)';
          holdingFormBanner.style.color = '#f87171';
        } else {
          holdingFormBanner.textContent = '✅ ECP SEAL VERIFIED · SCAN LEFT (A)';
          holdingFormBanner.style.color = '#86efac';
        }
      }
    }
    if (btnStampForm) {
      btnStampForm.style.display = (needsSeal && !cctvOpen) ? 'block' : 'none';
    }
    if (btnScanHold) {
      btnScanHold.style.display = (holdingForm && formsScanned < TOTAL_FORMS && !needsSeal) ? 'block' : 'none';
    }
    if (scanStatusLbl) {
      if (formsScanned >= TOTAL_FORMS) {
        scanStatusLbl.textContent = 'ALL SCANNED';
        scanStatusLbl.style.color = '#4ade80';
      } else if (needsSeal) {
        scanStatusLbl.textContent = 'SEAL REQUIRED (E)';
        scanStatusLbl.style.color = '#f87171';
      } else if (holdingForm) {
        scanStatusLbl.textContent = 'READY TO SCAN';
        scanStatusLbl.style.color = '#86efac';
      } else {
        scanStatusLbl.textContent = `${formsInBox} IN BOX`;
        scanStatusLbl.style.color = '#fde047';
      }
    }

    const doorDmg = Math.max(0, (100 - doorHealth) / 100);
    const winDmg = Math.max(0, (100 - windowHealth) / 100);
    cctvFilter.classList.toggle('on', cctvOpen);
    cctvUi.classList.toggle('on', cctvOpen);
    cctvStatic.style.opacity = cctvOpen ? '0.10' : '0';
    if (staticNoiseCanvas) staticNoiseCanvas.style.opacity = cctvOpen ? '0.20' : '0';

    // Show CAM 01 Exclusive Action Panel (Chai) only when on CAM 01 (Gate)
    const cam01ChaiPanel = document.getElementById('cam01-chai-panel');
    const cctvGadgetsRow = document.getElementById('cctv-gadgets-row');
    const isCam01Open = cctvOpen && activeCamIdx === 0;
    if (cam01ChaiPanel) {
      cam01ChaiPanel.style.display = isCam01Open ? 'block' : 'none';
    }
    if (cctvGadgetsRow) {
      cctvGadgetsRow.style.display = isCam01Open ? 'flex' : 'none';
    }

    btnCctv.innerHTML = cctvOpen
      ? '<span class="btn-full">▼ EXIT CCTV (SPACE)</span><span class="btn-short">▼ EXIT</span>'
      : '<span class="btn-full">▲ CCTV (SPACE)</span><span class="btn-short">▲ CCTV</span>';

    leftControls.classList.toggle('hide', cctvOpen);
    rightControls.classList.toggle('hide', cctvOpen);

    btnLeftDoor.classList.toggle('active', leftDoorClosed);
    btnLeftDoor.textContent = leftDoorClosed ? '■ DOOR (1)' : 'DOOR (1)';
    leftBtnDoor3D.material.color.setHex(leftDoorClosed ? 0x22c55e : 0xdc2626);

    if (doorHealthPctEl && doorHealthFillEl) {
      const dH = Math.ceil(doorHealth);
      doorHealthPctEl.textContent = `${dH}%`;
      doorHealthPctEl.style.color = dH < 30 ? '#ef4444' : dH < 60 ? '#f59e0b' : '#22c55e';
      doorHealthFillEl.style.width = `${dH}%`;
      doorHealthFillEl.className = 'health-bar-fill' + (dH < 30 ? ' crit' : dH < 60 ? ' warn' : '');
    }

    btnLeftLight.classList.toggle('active', leftLightOn);
    btnLeftLight.textContent = leftLightOn ? ' LIGHT (Q)' : 'LIGHT (Q)';
    leftBtnLight3D.material.color.setHex(leftLightOn ? 0xfef08a : 0x713f12);

    btnRightDoor.classList.toggle('active', rightShutterClosed);
    btnRightDoor.textContent = rightShutterClosed ? '■ SHUTTER (2)' : 'SHUTTER (2)';
    rightBtnDoor3D.material.color.setHex(rightShutterClosed ? 0x22c55e : 0xdc2626);

    if (windowHealthPctEl && windowHealthFillEl) {
      const wH = Math.ceil(windowHealth);
      windowHealthPctEl.textContent = `${wH}%`;
      windowHealthPctEl.style.color = wH < 30 ? '#ef4444' : wH < 60 ? '#f59e0b' : '#22c55e';
      windowHealthFillEl.style.width = `${wH}%`;
      windowHealthFillEl.className = 'health-bar-fill' + (wH < 30 ? ' crit' : wH < 60 ? ' warn' : '');
    }

    // Dynamic 3D Cracking Decal Opacity & Impact Fracture Animation
    if (doorCrackDecal && doorCrackDecal.material) {
      if (typeof animate._doorCrackFlash !== 'number') animate._doorCrackFlash = 0;
      if (animate._doorCrackFlash > 0) animate._doorCrackFlash = Math.max(0, animate._doorCrackFlash - dt * 3.2);

      const doorTier = Math.floor(doorDmg * 24);
      const isFlashing = animate._doorCrackFlash > 0.1;
      if (doorCrackDecal.userData && doorCrackDecal.userData.crackObj) {
        if (doorCrackDecal.userData.lastDmgTier !== doorTier || isFlashing) {
          doorCrackDecal.userData.lastDmgTier = doorTier;
          doorCrackDecal.userData.crackObj.render(doorDmg, animate._doorCrackFlash);
        }
      }

      doorCrackDecal.material.opacity = Math.min(1.0, (doorDmg > 0.05 ? 0.35 + doorDmg * 0.65 : 0) + animate._doorCrackFlash * 0.7);
      const dScale = 1.0 + doorDmg * 0.15;
      doorCrackDecal.scale.set(dScale, dScale, 1);
      if (animate._doorCrackFlash > 0.05) {
        doorCrackDecal.position.x = 0.065 + (Math.random() - 0.5) * 0.015;
      } else {
        doorCrackDecal.position.x = 0.065;
      }
    }

    if (windowCrackDecalL && windowCrackDecalL.material && windowCrackDecalR && windowCrackDecalR.material) {
      if (typeof animate._winCrackFlash !== 'number') animate._winCrackFlash = 0;
      if (animate._winCrackFlash > 0) animate._winCrackFlash = Math.max(0, animate._winCrackFlash - dt * 3.2);

      const winTier = Math.floor(winDmg * 24);
      const isWinFlashing = animate._winCrackFlash > 0.1;
      if (windowCrackDecalL.userData && windowCrackDecalL.userData.crackObj) {
        if (windowCrackDecalL.userData.lastDmgTier !== winTier || isWinFlashing) {
          windowCrackDecalL.userData.lastDmgTier = winTier;
          windowCrackDecalL.userData.crackObj.render(winDmg, animate._winCrackFlash);
        }
      }
      if (windowCrackDecalR.userData && windowCrackDecalR.userData.crackObj) {
        if (windowCrackDecalR.userData.lastDmgTier !== winTier || isWinFlashing) {
          windowCrackDecalR.userData.lastDmgTier = winTier;
          windowCrackDecalR.userData.crackObj.render(winDmg, animate._winCrackFlash);
        }
      }

      const op = Math.min(1.0, (winDmg > 0.05 ? 0.35 + winDmg * 0.65 : 0) + animate._winCrackFlash * 0.7);
      windowCrackDecalL.material.opacity = op;
      windowCrackDecalR.material.opacity = op;
      const wScale = 1.0 + winDmg * 0.15;
      windowCrackDecalL.scale.set(wScale, wScale, 1);
      windowCrackDecalR.scale.set(wScale, wScale, 1);
    }

    // Update Persistent Screen-Space Fracture Corner HUD Decals
    if (cornerCrackLeft) {
      const cLeftOp = doorDmg > 0.22 ? Math.min(0.85, (doorDmg - 0.22) * 1.35) : 0;
      cornerCrackLeft.style.opacity = cLeftOp.toFixed(3);
    }
    if (cornerCrackRight) {
      const cRightOp = winDmg > 0.22 ? Math.min(0.85, (winDmg - 0.22) * 1.35) : 0;
      cornerCrackRight.style.opacity = cRightOp.toFixed(3);
    }

    btnRightLight.classList.toggle('active', rightLightOn);
    btnRightLight.textContent = rightLightOn ? ' LIGHT (E)' : 'LIGHT (E)';
    rightBtnLight3D.material.color.setHex(rightLightOn ? 0xfef08a : 0x713f12);

    // Repair Button Status Indicators: only shown when health < 100%
    if (btnLeftRepair) {
      if (doorHealth >= 100) {
        btnLeftRepair.style.display = 'none';
      } else {
        btnLeftRepair.style.display = 'block';
        if (leftDoorClosed) {
          btnLeftRepair.textContent = '! OPEN TO REPAIR';
          btnLeftRepair.style.opacity = '1.0';
        } else {
          btnLeftRepair.textContent = ' REPAIR';
          btnLeftRepair.style.opacity = '1.0';
        }
      }
    }
    if (btnRightRepair) {
      if (windowHealth >= 100) {
        btnRightRepair.style.display = 'none';
      } else {
        btnRightRepair.style.display = 'block';
        if (rightShutterClosed) {
          btnRightRepair.textContent = '! OPEN TO REPAIR';
          btnRightRepair.style.opacity = '1.0';
        } else {
          btnRightRepair.textContent = ' REPAIR';
          btnRightRepair.style.opacity = '1.0';
        }
      }
    }
    syncInventoryUI();

    vpnBtn.classList.toggle('show', vpnDisconnected);
    updateWifiHud();

    if (cctvOpen) {
      const z = cctvZones[activeCamIdx];
      camTitleEl.textContent = `${z.id} · ${z.name}`;
      const sightings = [];
      if (activeCamIdx === 0) {
        sightings.push(` Black Vigo outside gate · Chowkidar Chai: ${Math.ceil(chowkidarChai)}%`);
      }
      if (activeCamIdx === 8 && isPowerSabotaged) {
        sightings.push(' FUSES PULLED! FLASH [F] TO RESET BREAKER!');
      }
      // Pure visual horror: No giveaway text alerts; player must visually inspect the feed!
      camDescEl.textContent = sightings.length ? sightings.join(' ') : '';
    }

    const sabAlert = document.getElementById('cctv-sabotage-alert');
    if (sabAlert) {
      sabAlert.style.display = isPowerSabotaged ? 'block' : 'none';
    }
  }

  // --- MOUSE FLASHLIGHT & 3D RAYCAST CLICKING ---
  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2();
  let lastHoverRaycastTime = 0;
  let lastTouchInputAt = 0;
  window.addEventListener('touchstart', () => { lastTouchInputAt = performance.now(); }, { passive: true, capture: true });
  window.addEventListener('touchend', () => { lastTouchInputAt = performance.now(); }, { passive: true, capture: true });

  window.addEventListener('mousemove', e => {
    // Ignore synthetic mousemove events fired after mobile/touch taps so tapping side buttons never pans the camera
    if (isMobileTouchDevice() || (performance.now() - lastTouchInputAt < 800)) return;
    if (e.target && e.target.closest && e.target.closest('.side-controls, .hud-bottom, button')) return;

    const rawX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNormX = Math.max(-1.4, Math.min(1.4, rawX * mouseSensMultiplier));
    mouseNormY = -(e.clientY / window.innerHeight) * 2 + 1;

    if (state === 'PLAYING') {
      const nowTime = performance.now();
      if (nowTime - lastHoverRaycastTime < 24) return; // Throttled hover raycasting (~40 FPS, zero stutter)
      lastHoverRaycastTime = nowTime;

      if (cctvOpen) {
        if (cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(activeCamIdx)) {
          const prop = cctvFormProps && cctvFormProps[activeCamIdx];
          if (prop && prop.visible) {
            mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVec, camera);
            const targetHit = (prop.userData && prop.userData.hitBox) ? prop.userData.hitBox : prop;
            const formHits = raycaster.intersectObject(targetHit, false);
            if (formHits.length > 0) {
              const gLoc = (typeof GULLU_PATH !== 'undefined' && typeof gulluStep !== 'undefined') ? GULLU_PATH[gulluStep] : -1;
              const wLoc = (typeof WHITENER_PATH !== 'undefined' && typeof whitenerStep !== 'undefined') ? WHITENER_PATH[whitenerStep] : -1;
              const isKhakiHere = (activeCamIdx === gLoc || (activeCamIdx === 4 && (gLoc === ZONE_KHAKI_PEEK || gLoc === ZONE_KHAKI_DOOR)));
              const isBabuHere = (activeCamIdx === wLoc || (activeCamIdx === 5 && (wLoc === ZONE_BABU_PEEK || wLoc === ZONE_BABU_WINDOW)));
              setCanvasCursor((isKhakiHere || isBabuHere) ? 'not-allowed' : 'pointer');
              isHoveringCctvForm = true;
              return;
            } else {
              isHoveringCctvForm = false;
            }
          }
        }
        if (activeCamIdx === 8 && cam09Clickables.length > 0) {
          mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouseVec, camera);
          const camHits = raycaster.intersectObjects(cam09Clickables, false);
          if (camHits.length > 0) {
            setCanvasCursor('pointer');
            isHoveringCam09WireBox = true;
          } else {
            setCanvasCursor('default');
            isHoveringCam09WireBox = false;
          }
        } else if (activeCamIdx === 9 && cam10Clickables.length > 0) {
          mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouseVec, camera);
          const camHits = raycaster.intersectObjects(cam10Clickables, false);
          if (camHits.length > 0) {
            setCanvasCursor('pointer');
            isHoveringCam10Router = true;
          } else {
            setCanvasCursor('default');
            isHoveringCam10Router = false;
          }
        } else {
          setCanvasCursor('default');
          isHoveringCam09WireBox = false;
        }
        return;
      }

      // Smooth continuous mouse look: camera looks where the mouse is
      const MAX_PAN_YAW = 1.18; // ~68 degrees continuous panorama (Left Door to Right Window)
      targetYaw = -rawX * MAX_PAN_YAW;
      useMousePan = true;
      const dir = currentYaw < -0.45 ? 1 : currentYaw > 0.45 ? -1 : 0;
      lookDir = dir;
      const pl = document.getElementById('pan-left');
      const pc = document.getElementById('pan-center');
      const pr = document.getElementById('pan-right');
      if (pl && pc && pr) {
        pl.classList.toggle('sel', dir === -1);
        pc.classList.toggle('sel', dir === 0);
        pr.classList.toggle('sel', dir === 1);
      }
      document.body.classList.toggle('look-left', dir === -1);
      document.body.classList.toggle('look-center', dir === 0);
      document.body.classList.toggle('look-right', dir === 1);

      // 3D Raycast Hover Cursor
      mouseVec.x = rawX;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      const hoverHits = raycaster.intersectObjects(clickableMeshes, false);
      setCanvasCursor(hoverHits.length > 0 ? 'pointer' : 'default');
    } else {
      setCanvasCursor('default');
    }
  });

  function setCanvasCursor(mode) {
    canvas.classList.toggle('cursor-hover', mode === 'pointer');
    canvas.classList.toggle('cursor-blocked', mode === 'not-allowed');
  }

  let cursorPressTimer = null;
  let cursorPressDownAt = 0;
  function releaseCursorPress() {
    if (cursorPressTimer) { clearTimeout(cursorPressTimer); cursorPressTimer = null; }
    const elapsed = performance.now() - cursorPressDownAt;
    const minHoldMs = 110;
    if (elapsed < minHoldMs) {
      cursorPressTimer = setTimeout(() => {
        document.body.classList.remove('cursor-pressed');
        cursorPressTimer = null;
      }, minHoldMs - elapsed);
    } else {
      document.body.classList.remove('cursor-pressed');
    }
  }
  window.addEventListener('pointerdown', () => {
    if (cursorPressTimer) { clearTimeout(cursorPressTimer); cursorPressTimer = null; }
    cursorPressDownAt = performance.now();
    document.body.classList.add('cursor-pressed');
  });
  window.addEventListener('pointerup', releaseCursorPress);
  window.addEventListener('pointercancel', releaseCursorPress);
  window.addEventListener('blur', () => {
    if (cursorPressTimer) { clearTimeout(cursorPressTimer); cursorPressTimer = null; }
    document.body.classList.remove('cursor-pressed');
  });

  canvas.addEventListener('contextmenu', e => e.preventDefault());

  function checkCam09WireBoxClick(e) {
    if (state !== 'PLAYING' || !cctvOpen || activeCamIdx !== 8 || cam09Clickables.length === 0) return false;
    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);
    const camHits = raycaster.intersectObjects(cam09Clickables, true);
    if (camHits.length > 0) {
      if (GameAudio.click) GameAudio.click();
      openWirePuzzle();
      return true;
    }
    return false;
  }

  // Mobile Swipe Panning & Touch Raycast Tap Support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartYaw = 0;
  let touchMoved = false;
  let lastTouchTapAt = 0;

  function handleCanvasObjectAction(act) {
    if (act === 'toggle_hammer') {
      toggleHammerEquip();
    } else if (act === 'left_door' || act === 'toggle_left_door') {
      if (equippedItem === 'HAMMER') {
        startHoldRepair('door');
      } else {
        toggleLeftDoor();
      }
    } else if (act === 'right_door' || act === 'toggle_right_door') {
      if (equippedItem === 'HAMMER') {
        startHoldRepair('window');
      } else {
        toggleRightShutter();
      }
    } else if (act === 'left_light' || act === 'toggle_left_light') {
      toggleLeftLight();
    } else if (act === 'right_light' || act === 'toggle_right_light') {
      toggleRightLight();
    } else if (act === 'toggle_cctv') {
      toggleCctv();
    } else if (act === 'reconnect_vpn') {
      if (vpnDisconnected) {
        showToast('SHARK CUT · GO TO CAM 10');
        if (GameAudio.sharkAlert) GameAudio.sharkAlert();
      } else {
        showToast('WIFI ONLINE');
      }
    } else if (act === 'brew_chai') {
      handleBrewKettleAction();
    } else if (act === 'drink_chai') {
      drinkDeskChai();
    } else if (act === 'grab_form') {
      grabFormFromBox();
    } else if (act === 'stamp_form') {
      startHoldStamp();
    } else if (act === 'scan_station') {
      startHoldScan();
    }
  }

  canvas.addEventListener('touchstart', e => {
    if (isPortraitLocked) return;
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartYaw = currentYaw;
      touchMoved = false;
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (state !== 'PLAYING' || cctvOpen || isPortraitLocked) return;
    if (e.touches && e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > 14 || Math.abs(dy) > 14) {
        touchMoved = true;
      }
      if (!touchMoved) return;
      // Swipe horizontally to look around office
      const normDelta = (dx / window.innerWidth) * 2.8;
      targetYaw = Math.max(-1.32, Math.min(1.32, touchStartYaw - normDelta));
      currentYaw = targetYaw;
      useMousePan = true;
      const dir = currentYaw < -0.45 ? 1 : currentYaw > 0.45 ? -1 : 0;
      lookDir = dir;
      const pl = document.getElementById('pan-left');
      const pc = document.getElementById('pan-center');
      const pr = document.getElementById('pan-right');
      if (pl && pc && pr) {
        pl.classList.toggle('sel', dir === -1);
        pc.classList.toggle('sel', dir === 0);
        pr.classList.toggle('sel', dir === 1);
      }
      document.body.classList.toggle('look-left', dir === -1);
      document.body.classList.toggle('look-center', dir === 0);
      document.body.classList.toggle('look-right', dir === 1);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (state !== 'PLAYING' || isPortraitLocked) return;
    if (!touchMoved) {
      lastTouchTapAt = performance.now();
      e.preventDefault();
      // Tap on mobile: raycast immediately
      const t = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0] : null;
      if (t) {
        mouseVec.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(t.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);

        if (cctvOpen) {
          if (cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(activeCamIdx)) {
            const prop = cctvFormProps && cctvFormProps[activeCamIdx];
            if (prop && prop.visible) {
              const targetHit = (prop.userData && prop.userData.hitBox) ? prop.userData.hitBox : prop;
              const formHits = raycaster.intersectObject(targetHit, false);
              if (formHits.length > 0) {
                handleCctvFormCollect(activeCamIdx);
                return;
              }
            }
          }
          if (activeCamIdx === 8 && cam09Clickables.length > 0) {
            const camHits = raycaster.intersectObjects(cam09Clickables, false);
            if (camHits.length > 0) {
              if (GameAudio.click) GameAudio.click();
              openWirePuzzle();
              return;
            }
          } else if (activeCamIdx === 9 && cam10Clickables.length > 0) {
            const camHits = raycaster.intersectObjects(cam10Clickables, false);
            if (camHits.length > 0) {
              if (GameAudio.click) GameAudio.click();
              openSharkPuzzle();
              return;
            }
          }
        } else {
          const hits = raycaster.intersectObjects(clickableMeshes, false);
          if (hits.length > 0) {
            handleCanvasObjectAction(hits[0].object.userData.action);
            try { navigator.vibrate?.(15); } catch (_) {}
          }
        }
      }
    }
  });

  canvas.addEventListener('pointerdown', e => {
    tryEnterMobileFullscreen();
    if (checkCam09WireBoxClick(e)) e.preventDefault();
  });

  canvas.addEventListener('mousedown', e => {
    if (state !== 'PLAYING' || isPortraitLocked) return;
    if (performance.now() - lastTouchTapAt < 500) return;

    if (cctvOpen) {
      if (cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(activeCamIdx)) {
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);
        const prop = cctvFormProps && cctvFormProps[activeCamIdx];
        if (prop && prop.visible) {
          const targetHit = (prop.userData && prop.userData.hitBox) ? prop.userData.hitBox : prop;
          const formHits = raycaster.intersectObject(targetHit, false);
          if (formHits.length > 0) {
            handleCctvFormCollect(activeCamIdx);
            return;
          }
        }
      }
      if (activeCamIdx === 8 && cam09Clickables.length > 0) {
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);
        const camHits = raycaster.intersectObjects(cam09Clickables, false);
        if (camHits.length > 0) {
          if (GameAudio.click) GameAudio.click();
          openWirePuzzle();
          return;
        }
      } else if (activeCamIdx === 9 && cam10Clickables.length > 0) {
        mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouseVec, camera);
        const camHits = raycaster.intersectObjects(cam10Clickables, false);
        if (camHits.length > 0) {
          if (GameAudio.click) GameAudio.click();
          openSharkPuzzle();
          return;
        }
      }
      return;
    }

    mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVec, camera);
    const hits = raycaster.intersectObjects(clickableMeshes, false);
    if (hits.length > 0) {
      isPointerDownOnEmpty = false;
      isMouseDragging = false;
      handleCanvasObjectAction(hits[0].object.userData.action);
    } else {
      // Clicked on empty space: enable smooth drag to look around anywhere
      isPointerDownOnEmpty = true;
      mouseDragStartX = e.clientX;
      mouseDragStartYaw = currentYaw;
      isMouseDragging = false;
    }
  });

  if (btnStampForm) {
    btnStampForm.addEventListener('pointerdown', e => {
      e.preventDefault();
      startHoldStamp();
    });
    btnStampForm.addEventListener('pointerup', () => stopHoldStamp(false));
    btnStampForm.addEventListener('pointerleave', () => stopHoldStamp(false));
    btnStampForm.addEventListener('pointercancel', () => stopHoldStamp(false));
  }

  if (btnScanHold) {
    btnScanHold.addEventListener('pointerdown', e => {
      e.preventDefault();
      startHoldScan();
    });
    btnScanHold.addEventListener('pointerup', () => stopHoldScan(false));
    btnScanHold.addEventListener('pointerleave', () => stopHoldScan(false));
    btnScanHold.addEventListener('pointercancel', () => stopHoldScan(false));
  }

  if (btnLeftRepair) {
    btnLeftRepair.addEventListener('pointerdown', e => {
      e.preventDefault();
      startHoldRepair('door');
    });
    btnLeftRepair.addEventListener('pointerup', () => stopHoldRepair(false));
    btnLeftRepair.addEventListener('pointerleave', () => stopHoldRepair(false));
    btnLeftRepair.addEventListener('pointercancel', () => stopHoldRepair(false));
  }

  if (btnRightRepair) {
    btnRightRepair.addEventListener('pointerdown', e => {
      e.preventDefault();
      startHoldRepair('window');
    });
    btnRightRepair.addEventListener('pointerup', () => stopHoldRepair(false));
    btnRightRepair.addEventListener('pointerleave', () => stopHoldRepair(false));
    btnRightRepair.addEventListener('pointercancel', () => stopHoldRepair(false));
  }

  if (invSlotBtn) {
    invSlotBtn.addEventListener('click', e => {
      e.preventDefault();
      toggleHammerEquip();
    });
  }

  window.addEventListener('pointerup', () => {
    if (isHoldingScan) stopHoldScan(false);
    if (isHoldingStamp) stopHoldStamp(false);
    if (isHoldingRepair) stopHoldRepair(false);
  });

  window.addEventListener('mouseup', () => {
    isPointerDownOnEmpty = false;
    setTimeout(() => { isMouseDragging = false; }, 50);
    if (isHoldingScan) stopHoldScan(false);
    if (isHoldingStamp) stopHoldStamp(false);
    if (isHoldingRepair) stopHoldRepair(false);
  });

  window.addEventListener('blur', () => {
  });

  // --- UPDATE INTRUDER 3D POSES ---
  function updateIntruderPositions() {
    if (!khakiActive && gulluMesh) {
      gulluMesh.visible = false;
    }
    const gZoneIdx = GULLU_PATH[gulluStep];
    if (gulluWalkAnim) {
      gulluMesh.position.set(gulluWalkAnim.fromX, gulluWalkAnim.fromY ?? -0.05, gulluWalkAnim.fromZ);
      gulluMesh.scale.set(gZoneIdx === ZONE_KHAKI_DOOR ? 1.12 : 1.08, gZoneIdx === ZONE_KHAKI_DOOR ? 1.12 : 1.08, gZoneIdx === ZONE_KHAKI_DOOR ? 1.12 : 1.08);
    } else if (gZoneIdx === ZONE_KHAKI_DOOR) {
      // Stage 2: Outside Main Left Iron Doorway (z = 0.05)!
      // When open: stands directly in doorway threshold (-4.12) facing room. When closed: waits outside (-4.80) behind peep-bars.
      const doorX = leftDoorClosed ? -4.80 : -4.12;
      const doorY = leftDoorClosed ? -0.18 : 0.0;
      gulluMesh.position.set(doorX, doorY, 0.05);
      gulluMesh.scale.set(1.18, 1.18, 1.18);
      gulluMesh.rotation.set(0, Math.PI / 2, 0);
      setLimbPose(gulluMesh, 0, 0, 0, 0, 0, 0, 0);
    } else if (gZoneIdx === ZONE_KHAKI_PEEK) {
      // Khaki at Left Peek Window
      setHumanoidPeekMode(gulluMesh, true);
      gulluMesh.position.set(-4.95, -0.74, -2.56);
      gulluMesh.scale.set(1.15, 1.15, 1.15);
      gulluMesh.rotation.set(0, cctvOpen ? Math.PI / 2 : 1.09, 0);
      if (gulluMesh.userData && gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(0, 0, 0);
    } else {
      setHumanoidPeekMode(gulluMesh, false);
      const spot = getIntruderSpot(gZoneIdx, true);
      gulluMesh.position.copy(spot);
      gulluMesh.scale.set(1, 1, 1);
      gulluMesh.rotation.set(
        0,
        Math.atan2(cctvZones[gZoneIdx].pos.x - spot.x, cctvZones[gZoneIdx].pos.z - spot.z),
        0
      );
    }

    if (!babuActive && whitenerMesh) {
      whitenerMesh.visible = false;
    }
    const wZoneIdx = WHITENER_PATH[whitenerStep];
    if (whitenerWalkAnim) {
      whitenerMesh.position.set(whitenerWalkAnim.fromX, whitenerWalkAnim.fromY ?? 0.04, whitenerWalkAnim.fromZ);
      whitenerMesh.scale.set(wZoneIdx === ZONE_BABU_WINDOW ? 1.12 : 1.08, wZoneIdx === ZONE_BABU_WINDOW ? 1.12 : 1.08, wZoneIdx === ZONE_BABU_WINDOW ? 1.12 : 1.08);
    } else if (wZoneIdx === ZONE_BABU_WINDOW) {
      // Stage 2: Outside Main Right Window in Courtyard (z = 0.05)!
      // When open: peers directly in window opening (4.12) facing room. When closed: waits outside (4.88) behind shutter.
      const winX = rightShutterClosed ? 4.88 : 4.12;
      const winY = rightShutterClosed ? 0.02 : 0.02;
      whitenerMesh.position.set(winX, winY, 0.05);
      whitenerMesh.scale.set(1.18, 1.18, 1.18);
      whitenerMesh.rotation.set(0, -Math.PI / 2, 0);
      setLimbPose(whitenerMesh, 0, 0, 0, 0, 0, 0, 0);
    } else if (wZoneIdx === ZONE_BABU_PEEK) {
      // Babu at Right Peek Window
      setHumanoidPeekMode(whitenerMesh, true);
      whitenerMesh.position.set(4.95, -0.74, -2.56);
      whitenerMesh.scale.set(1.15, 1.15, 1.15);
      whitenerMesh.rotation.set(0, cctvOpen ? -Math.PI / 2 : -1.09, 0);
      if (whitenerMesh.userData && whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(0, 0, 0);
    } else {
      setHumanoidPeekMode(whitenerMesh, false);
      const spot = getIntruderSpot(wZoneIdx, false);
      whitenerMesh.position.copy(spot);
      whitenerMesh.scale.set(1, 1, 1);
      whitenerMesh.rotation.set(
        0,
        Math.atan2(cctvZones[wZoneIdx].pos.x - spot.x, cctvZones[wZoneIdx].pos.z - spot.z),
        0
      );
    }

    cctvZones.forEach((_, idx) => {
      const warnEl = document.getElementById(`warn-${idx}`);
      if (!warnEl) return;
      // No exclamation marks on cameras so player has to check camera feeds to find intruders!
      const isSab = (idx === 8 && isPowerSabotaged);
      warnEl.textContent = isSab ? '' : '';
    });

    if (cctvOpen) syncControlsUI();
  }

  function startPowerOutSequence() {
    state = 'POWEROUT';
    powerOutMode = 'vigo';
    cctvOpen = false;
    document.body.classList.remove('cctv-active');
    leftDoorClosed = false;
    rightShutterClosed = false;
    leftLightOn = false;
    rightLightOn = false;
    syncControlsUI();
    hud.classList.remove('on');
    if (tutorialBanner) tutorialBanner.classList.add('hide');

    roomLight.intensity = 0;
    flashlight.intensity = 0;
    powerOutTimer = 4.8; // 4.8 seconds of eerie Vigo strobe flashes in the dark doorway before jumpscare!
    gulluMesh.position.set(-4.5, 0, 0);
    gulluMesh.rotation.y = Math.PI / 2;
    if (GameAudio.stopHeartbeatLoop) GameAudio.stopHeartbeatLoop(0.05);
    if (GameAudio.stopKettleBoilLoop) GameAudio.stopKettleBoilLoop();
    GameAudio.powerDown();
  }

  function startDeadlineBlackoutSequence() {
    state = 'POWEROUT';
    powerOutMode = 'deadline';
    cctvOpen = false;
    document.body.classList.remove('cctv-active');
    if (typeof isWirePuzzleOpen !== 'undefined' && isWirePuzzleOpen) closeWirePuzzle();
    if (typeof isSharkPuzzleOpen !== 'undefined' && isSharkPuzzleOpen) closeSharkPuzzle();
    if (typeof isHoldingScan !== 'undefined' && isHoldingScan) stopHoldScan(false);
    if (typeof isHoldingStamp !== 'undefined' && isHoldingStamp) stopHoldStamp(false);
    if (typeof isHoldingRepair !== 'undefined' && isHoldingRepair) stopHoldRepair(false);

    leftDoorClosed = false;
    rightShutterClosed = false;
    leftLightOn = false;
    rightLightOn = false;
    syncControlsUI();

    hud.classList.remove('on');
    hud.style.display = 'none';
    if (tutorialBanner) tutorialBanner.classList.add('hide');
    if (phoneBox) phoneBox.classList.add('hide');

    if (roomLight) roomLight.intensity = 0;
    if (flashlight) flashlight.intensity = 0;
    if (handTorchGroup) handTorchGroup.visible = false;
    if (handHammer) handHammer.visible = false;
    if (handForm) handForm.visible = false;
    if (handStamp) handStamp.visible = false;

    if (ambientLightObj) {
      ambientLightObj.color.setHex(0x1e3a5f);
      ambientLightObj.intensity = 0.52;
    }
    if (typeof leftPeekMoonlight !== 'undefined' && leftPeekMoonlight) leftPeekMoonlight.intensity = 1.65;
    if (typeof rightPeekMoonlight !== 'undefined' && rightPeekMoonlight) rightPeekMoonlight.intensity = 1.65;
    syncActiveSceneLights();

    powerOutTimer = 3.8;
    if (GameAudio.stopHeartbeatLoop) GameAudio.stopHeartbeatLoop(0.05);
    if (GameAudio.stopKettleBoilLoop) GameAudio.stopKettleBoilLoop();
    if (GameAudio.stopDoorBanging) GameAudio.stopDoorBanging('all');
    if (GameAudio.stopScannerLoop) GameAudio.stopScannerLoop();
    if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();
    GameAudio.powerDown();
  }

  function triggerJumpscare(attacker, reason = null) {
    if (GameAudio.stopHeartbeatLoop) GameAudio.stopHeartbeatLoop(0.05);
    if (GameAudio.stopKettleBoilLoop) GameAudio.stopKettleBoilLoop();
    if (GameAudio.stopDoorBanging) GameAudio.stopDoorBanging('all');
    if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();
    deathReasonOverride = reason;
    state = 'JUMPSCARE';
    cctvOpen = false;
    document.body.classList.remove('cctv-active');
    lookDir = 0;
    currentYaw = 0;
    targetYaw = 0;
    leftLightOn = false;
    rightLightOn = false;
    leftDoorClosed = false;
    rightShutterClosed = false;
    gulluEnraged = false;
    gulluRageTimer = 0;
    gulluRushCharge = null;
    whitenerEnraged = false;
    whitenerRageTimer = 0;
    whitenerRushCharge = null;
    if (gulluMesh) setHumanoidEnraged(gulluMesh, false);
    if (whitenerMesh) setHumanoidEnraged(whitenerMesh, false);
    syncControlsUI();

    // HIDE ALL INTERRUPTING HUD & BANNER ELEMENTS SO ANIMATION IS 100% UNOBSTRUCTED
    hud.classList.remove('on');
    hud.style.display = 'none';
    if (tutorialBanner) {
      tutorialBanner.classList.add('hide');
      tutorialBanner.style.display = 'none';
    }
    phoneBox.classList.add('hide');
    if (gameoverModal) {
      gameoverModal.classList.add('hide');
      gameoverModal.style.display = 'none';
    }
    if (deathScreen) {
      deathScreen.classList.add('hide');
    }

    jumpscareAttacker = attacker;
    jumpscareTimer = 3.2; // Full sustained 3.2-second terrifying animation & scream

    clearCinematicOverlays();
    if (jumpscareFx) jumpscareFx.classList.add('on');
    document.body.classList.add('jumpscare-shaking'); // High-frequency 60Hz viewport shudder

    if (attacker === 'whitener') {
      // Babu jumpscare: clean, plain terrifying face lunging directly at the camera (no whitener lines or rubber stamp)
      if (vigoMesh) vigoMesh.visible = false;
      roomLight.intensity = 4.2;
      roomLight.color.setHex(0xfef08a);
      GameAudio.triggerBabuDynamicCue('jumpscare', currentHalqaLevel, { pan: 0.0, vol: 1.40, force: true });
    } else if (attacker === 'vigo' || attacker === 'chowkidar' || attacker === 'dala' || attacker === 'DALA') {
      // Black Vigo (Kaala Dala) Smashes Straight Into The Classroom!
      if (vigoMesh) {
        if (vigoMesh.parent !== scene) scene.add(vigoMesh);
        vigoMesh.visible = true;
        vigoMesh.position.set(0, -0.35, -5.2);
        vigoMesh.rotation.set(0, 0, 0);
        vigoMesh.scale.set(1.12, 1.12, 1.12);
      }
      triggerImpactSlam('door', 'heavy');
      spawnDebrisBurst('door', 'heavy', { x: -1.1, y: 1.5, z: -1.6 });
      spawnDebrisBurst('window', 'heavy', { x: 1.1, y: 1.5, z: -1.6 });
      setTimeout(() => {
        if (state === 'JUMPSCARE') {
          triggerImpactSlam('win', 'heavy');
          spawnDebrisBurst('door', 'heavy', { x: -0.6, y: 1.3, z: -0.4 });
          spawnDebrisBurst('window', 'heavy', { x: 0.6, y: 1.3, z: -0.4 });
        }
      }, 160);
      roomLight.intensity = 6.0;
      roomLight.color.setHex(0xfef08a);
      if (khakiOverrideHud) khakiOverrideHud.classList.add('on');
    } else {
      // Khaki's Black Vigo Red/Blue Police Strobe!
      if (vigoMesh) vigoMesh.visible = false;
      roomLight.intensity = 4.8;
      roomLight.color.setHex(0xef4444);
      if (khakiOverrideHud) khakiOverrideHud.classList.add('on');

    }

    GameAudio.jumpscare(attacker);
  }
  window.__toggleLeftDoor = toggleLeftDoor;
  window.__toggleRightShutter = toggleRightShutter;
  window.__setLeftLight = setLeftLight;
  window.__setRightLight = setRightLight;
  window.__toggleLeftLight = toggleLeftLight;
  window.__toggleRightLight = toggleRightLight;
  window.__triggerLeftFlicker = (dur = 0.12) => { isLeftLightDarkNow = true; leftFlickerDropTimer = dur; };
  window.__triggerRightFlicker = (dur = 0.12) => { isRightLightDarkNow = true; rightFlickerDropTimer = dur; };
  window.__getFlickerState = () => ({ isLeftLightDarkNow, isRightLightDarkNow });
  window.__isLeftLightOn = () => leftLightOn;
  window.__isRightLightOn = () => rightLightOn;
  window.__isLeftFlickerDark = () => isLeftLightDarkNow;
  window.__isRightFlickerDark = () => isRightLightDarkNow;
  window.__triggerJumpscare = triggerJumpscare;
  window.__getGameState = () => ({
    state,
    jumpscareTimer,
    leftDoorClosed,
    rightShutterClosed,
    doorHealth,
    windowHealth,
    holdingForm,
    formsInBox,
    equippedItem,
    handFormVisible: handForm ? handForm.visible : false,
    handFormPos: handForm ? { x: handForm.position.x, y: handForm.position.y, z: handForm.position.z } : null,
    handFormRot: handForm ? { x: handForm.rotation.x, y: handForm.rotation.y, z: handForm.rotation.z } : null,
    scanProgress,
    isHoldingScan,
    laserZ: scanStation && scanStation.laser ? scanStation.laser.position.z : null,
    laserVis: scanStation && scanStation.laser ? scanStation.laser.visible : null
  });
  window.__setMonsterZone = (monster, zoneIdx, wait = null) => {
    if (monster === 'gullu') {
      GULLU_PATH[0] = zoneIdx;
      gulluStep = 0;
      gulluWalkAnim = null;
      gulluAtDoorTime = 0;
      gulluAssault = null;
      if (wait !== null) gulluWait = wait;
    } else {
      WHITENER_PATH[0] = zoneIdx;
      whitenerStep = 0;
      whitenerWalkAnim = null;
      whitenerAtWindowTime = 0;
      whitenerAssault = null;
      if (wait !== null) whitenerWait = wait;
    }
    updateIntruderPositions();
  };
  window.__getMonsterPos = () => ({
    gullu: { x: gulluMesh.position.x, y: gulluMesh.position.y, z: gulluMesh.position.z },
    whitener: { x: whitenerMesh.position.x, y: whitenerMesh.position.y, z: whitenerMesh.position.z },
    leftDoorClosed,
    rightShutterClosed
  });
  window.__gulluMesh = gulluMesh;
  window.__whitenerMesh = whitenerMesh;
  window.__lurkingEyes = lurkingEyes;
  window.__leftPeekGrill = leftPeekGrill;
  window.__rightPeekGrill = rightPeekGrill;
  window.__setMouse = (x, y) => {
    mouseNormX = x;
    mouseNormY = y;
    useMousePan = true;
    targetYaw = -x * 1.28;
  };
  window.__getYaw = () => ({ targetYaw, currentYaw, lookDir });
  window.__lookAt = (yaw) => {
    useMousePan = true;
    mouseNormX = -yaw / 1.28;
    currentYaw = yaw;
    targetYaw = yaw;
    lookDir = (yaw < -0.5) ? 1 : (yaw > 0.5) ? -1 : 0;
    const pl = document.getElementById('pan-left');
    const pc = document.getElementById('pan-center');
    const pr = document.getElementById('pan-right');
    if (pl && pc && pr) {
      pl.classList.toggle('sel', lookDir === -1);
      pc.classList.toggle('sel', lookDir === 0);
      pr.classList.toggle('sel', lookDir === 1);
    }
    document.body.classList.toggle('look-left', lookDir === -1);
    document.body.classList.toggle('look-center', lookDir === 0);
    document.body.classList.toggle('look-right', lookDir === 1);
  };
  window.__triggerFullStatic = triggerFullStatic;
  window.__calculateDynamicCamLoad = calculateDynamicCamLoad;
  window.__selectCam = selectCam;
  window.__toggleCctv = toggleCctv;
  window.__setCctvFlashlight = setCctvFlashlight;
  window.__openWirePuzzle = openWirePuzzle;
  window.__closeWirePuzzle = closeWirePuzzle;
  window.__triggerPowerSabotage = triggerPowerSabotage;
  window.__resolvePowerSabotage = resolvePowerSabotage;
  window.__connectWire = (leftIdx, rightIdx) => {
    if (!leftWireSlots || !rightWireSlots) return false;
    const leftSpec = leftWireSlots[leftIdx];
    const rightSpec = rightWireSlots[rightIdx];
    if (!leftSpec || !rightSpec) return false;
    if (leftSpec.id === rightSpec.id) {
      connectedWires[leftSpec.id] = {
        leftY: TERMINAL_Y[leftIdx],
        rightY: TERMINAL_Y[rightIdx],
        rightIdx: rightIdx
      };
      if (GameAudio.wireSnap) GameAudio.wireSnap();
      spawnWireSparks(404, TERMINAL_Y[rightIdx], false);
      if (Object.keys(connectedWires).length === 4) {
        if (wirePuzzleStatus) {
          wirePuzzleStatus.textContent = ' ALL CIRCUITS RESTORED! POWER ONLINE!';
          wirePuzzleStatus.className = 'wire-puzzle-status success';
        }
        if (GameAudio.wirePuzzleComplete) GameAudio.wirePuzzleComplete();
        resolvePowerSabotage(true);
      }
      renderWireCanvas();
      return true;
    } else {
      if (GameAudio.wireBuzz) GameAudio.wireBuzz();
      spawnWireSparks(404, TERMINAL_Y[rightIdx], true);
      renderWireCanvas();
      return false;
    }
  };
  window.__getWirePuzzleState = () => ({
    isOpen: isWirePuzzleOpen,
    isSabotaged: isPowerSabotaged,
    timer: powerSabotageTimer,
    connected: Object.keys(connectedWires),
    leftSlots: leftWireSlots.map(s => s.id),
    rightSlots: rightWireSlots.map(s => s.id)
  });
  window.__isCctvOpen = () => cctvOpen;
  window.__getEquippedItem = () => equippedItem;
  window.__getHandItemsVisible = () => ({
    hammer: handHammer ? handHammer.visible : false,
    form: handForm ? handForm.visible : false,
    torch: handTorchGroup ? handTorchGroup.visible : false,
    cctvOpen: cctvOpen,
    equippedItem: equippedItem,
    holdingForm: holdingForm
  });
  window.__toggleHammer = toggleHammerEquip;
  window.__setDoorHealth = (h) => { doorHealth = h; syncControlsUI(); };
  window.__scene = scene;
  window.__getDoorHealth = () => doorHealth;
  window.__toggleLeftDoor = toggleLeftDoor;
  window.__isLeftDoorClosed = () => leftDoorClosed;
  window.__setMonsterZones = (gZone, wZone) => {
    if (typeof gZone === 'number') {
      GULLU_PATH[gulluStep] = gZone;
      gulluWait = 99999;
      gulluWalkAnim = null;
    }
    if (typeof wZone === 'number') {
      WHITENER_PATH[whitenerStep] = wZone;
      whitenerWait = 99999;
      whitenerWalkAnim = null;
    }
    updateIntruderPositions();
  };
  window.__setCctv = (open) => {
    if (cctvOpen !== open) toggleCctv();
  };
  window.__setCctvFlashlight = setCctvFlashlight;
  window.__getActiveCam = () => activeCamIdx;
  window.__selectCam = selectCam;
  window.selectCam = selectCam;
  window.__getMonsterZones = () => ({ gullu: GULLU_PATH[gulluStep], whitener: WHITENER_PATH[whitenerStep] });
  window.__grabForm = grabFormFromBox;
  window.__startHoldScan = startHoldScan;
  window.__stopHoldScan = stopHoldScan;
  window.__triggerCctvFormsScatter = triggerCctvFormsScatter;
  window.__handleCctvFormCollect = handleCctvFormCollect;
  window.__setFormsScanned = (n) => { formsScanned = n; };
  window.__getScanState = () => ({
    formsInBox,
    holdingForm,
    formsScanned,
    formsUploaded,
    currentUploadPct,
    scanProgress,
    isHoldingScan,
    paperVisible: Boolean(scanStation && scanStation.paper && scanStation.paper.visible)
  });
  window.__applyHalqaLevel = applyHalqaLevel;
  window.__startShift = startShift;
  window.__toggleHammerEquip = toggleHammerEquip;
  window.__startHoldRepair = startHoldRepair;
  window.__stopHoldRepair = stopHoldRepair;
  window.__getRepairState = () => ({
    equippedItem,
    isHoldingRepair,
    repairTarget,
    doorHealth,
    windowHealth,
    leftDoorClosed,
    rightShutterClosed,
    lastToast: alertToast ? alertToast.textContent : ''
  });
  window.__setRepairHealth = (doorH, winH) => {
    if (typeof doorH === 'number') doorHealth = doorH;
    if (typeof winH === 'number') windowHealth = winH;
    syncControlsUI();
  };
  window.__triggerEnragedKhaki = triggerEnragedKhaki;
  window.__triggerEnragedBabu = triggerEnragedBabu;
  window.__getEnragedState = () => ({ gulluEnraged, gulluRageTimer, whitenerEnraged, whitenerRageTimer });
  window.__getRushState = () => ({ gulluRushCharge, whitenerRushCharge });
  window.__getDifficulty = () => selectedDifficulty;
  window.__setDifficulty = (d) => {
    if (DIFFICULTY_SETTINGS[d]) {
      selectedDifficulty = d;
      updateDifficultyUI();
    }
  };
  window.__resetCctvShock = () => {
    if (cctvShock) cctvShock.active = false;
    cctvFlashStallCooldown = 0;
  };
  window.__pickNextGulluZone = pickNextGulluZone;
  window.__pickNextWhitenerZone = pickNextWhitenerZone;
  window.__getHourProg = getHourProg;
  window.__setNightSeconds = (s) => { nightSeconds = s; };
  window.__getMonsterActive = () => ({ babuActive, khakiActive });
  window.__setPowerSabotageCooldown = (cd) => { powerSabotageCooldown = cd; };
  window.__getPowerSabotageCooldown = () => powerSabotageCooldown;
  window.__getCctvShock = () => ({
    active: cctvShock.active,
    powerSabotageCooldown: powerSabotageCooldown,
    isPowerSabotaged: isPowerSabotaged,
    monster: cctvShock.monster,
    timer: cctvShock.timer,
    retreatZone: cctvShock.retreatZone,
    cooldown: cctvFlashStallCooldown,
    cam: activeCamIdx,
    gLoc: GULLU_PATH[gulluStep],
    wLoc: WHITENER_PATH[whitenerStep]
  });
  window.__setHumanoidEnraged = setHumanoidEnraged;
  window.__triggerWifiTrip = () => {
    vpnDisconnected = true;
    if (isHoldingScan) stopHoldScan();
    const vpnLine = GameAudio.triggerBabuDynamicCue('vpn_sabotage', currentHalqaLevel, { pan: 0.20, vol: 1.05 });
    if (vpnLine && vpnLine.subtitle) {
      showPS1Subtitle(`Babu: "${getLineSubtitle(vpnLine)}"`, Math.round((vpnLine.dur || 3.0) * 1000) + 600);
    }
    updateCam10Prompt();
    syncControlsUI();
  };
  window.__triggerBabuWhisper = () => {
    if (GameAudio && GameAudio.playBabuDistantWhisper) {
      const line = GameAudio.playBabuDistantWhisper(0.35);
      if (line && line.subtitle) {
        showPS1Subtitle(`Babu: "${getLineSubtitle(line)}"`, Math.round((line.dur || 3.5) * 1000) + 600);
      }
      return line;
    }
    return null;
  };
  window.__getBabuWhisperCooldown = () => babuWhisperCooldown;
  window.__setBabuWhisperCooldown = (cd) => { babuWhisperCooldown = cd; };
  window.__checkBabuRoamWhisper = checkBabuRoamWhisper;

  window.__triggerKhakiWhisper = () => {
    if (GameAudio && GameAudio.playKhakiDistantWhisper) {
      const line = GameAudio.playKhakiDistantWhisper(-0.35);
      if (line && line.subtitle) {
        showPS1Subtitle(`Khaki: "${getLineSubtitle(line)}"`, Math.round((line.dur || 3.5) * 1000) + 600);
      }
      return line;
    }
    return null;
  };
  window.__getKhakiWhisperCooldown = () => khakiWhisperCooldown;
  window.__setKhakiWhisperCooldown = (cd) => { khakiWhisperCooldown = cd; };
  window.__checkKhakiRoamWhisper = checkKhakiRoamWhisper;
  window.__getCctvActiveFormCams = () => cctvActiveFormCams;
  window.__setCctvActiveFormCams = (s) => { cctvActiveFormCams = s; };
  window.__triggerCctvFormsScatter = triggerCctvFormsScatter;
  window.__isWifiTripped = () => vpnDisconnected;
  window.__getKettleChaiReady = () => kettleChaiReady;
  window.__getKettleBrewing = () => kettleBrewing;
  window.__getKettleBrewTimer = () => kettleBrewTimer;
  window.__setKettleBrewTimer = (t) => { kettleBrewTimer = t; };
  window.__brewKettleChai = handleBrewKettleAction;
  window.__sendGateChai = sendGateChai;
  window.__getChowkidarChai = () => chowkidarChai;
  window.__getSharkTimer = () => sharkTimer;
  window.__setSharkTimer = (t) => { sharkTimer = t; };
  window.__getAssaultState = () => ({
    gulluAssault: gulluAssault ? { hitCount: gulluAssault.hitCount, nextHitTime: gulluAssault.nextHitTime, atDoorTime: gulluAtDoorTime } : null,
    whitenerAssault: whitenerAssault ? { hitCount: whitenerAssault.hitCount, nextHitTime: whitenerAssault.nextHitTime, atWindowTime: whitenerAtWindowTime } : null
  });

  window.__stampHeldForm = stampHeldForm;
  window.__startHoldStamp = startHoldStamp;
  window.__stopHoldStamp = stopHoldStamp;
  window.__getSealState = () => ({ isFormStamped, holdingForm, formsScanned });
  window.__grabFormFromBox = grabFormFromBox;
  window.__startHoldScan = startHoldScan;
  window.__stopHoldScan = stopHoldScan;

  function finishGameOver() {
    state = 'GAMEOVER';
    campaignRetries++;
    saveCampaignStats();
    document.body.classList.remove('jumpscare-shaking');
    camera.fov = 75;
    camera.updateProjectionMatrix();
    if (gulluMesh) gulluMesh.visible = false;
    if (whitenerMesh) whitenerMesh.visible = false;
    if (vigoMesh) vigoMesh.visible = false;
    clearCinematicOverlays();

    const hour = Math.min(5, Math.floor((nightSeconds / NIGHT_DURATION) * 6));
    const timeStr = hour === 0 ? '12:00 AM' : `0${hour}:00 AM`;

    if (deathBadge && deathTitle && deathSub) {
      if (jumpscareAttacker === 'gullu') {
        deathBadge.textContent = 'FORM-45 COMPROMISED';
        deathTitle.textContent = 'KHAKI BREACHED';
        deathSub.textContent = `Khaki entered through the left door at ${timeStr}.`;
      } else if (jumpscareAttacker === 'whitener') {
        deathBadge.textContent = 'FORM-47 FORGED';
        deathTitle.textContent = 'BABU BREACHED';
        deathSub.textContent = `Babu entered through the right window at ${timeStr}.`;
      } else if (jumpscareAttacker === 'deadline') {
        deathBadge.textContent = '06:00 AM DEADLINE EXPIRED';
        deathTitle.textContent = 'TIME UP · 6:00 AM';
        deathSub.textContent = 'All 30 Form-45s were not uploaded in time.';
      } else if (jumpscareAttacker === 'chowkidar') {
        deathBadge.textContent = 'CHOWKIDAR ASLEEP';
        deathTitle.textContent = 'GATE OVERRUN';
        deathSub.textContent = `Chacha fell asleep without chai at ${timeStr}.`;
      } else {
        deathBadge.textContent = 'UPS BATTERY DEAD';
        deathTitle.textContent = 'POWER OUT';
        deathSub.textContent = `The UPS battery ran out at ${timeStr}.`;
      }
      if (deathReasonOverride) {
        deathSub.textContent = deathReasonOverride;
      }
    }

    if (deathScreen) deathScreen.classList.remove('hide');
    if (gameoverModal) {
      gameoverModal.classList.add('hide');
      gameoverModal.style.display = 'none';
    }
  }

  function triggerWin() {
    if (state === 'WIN_CUTSCENE' || state === 'WIN' || state === 'LEVEL_TRANSITION') return;

    uploadProgress = 100;
    formsUploaded = TOTAL_FORMS;
    isHoldingScan = false;
    GameAudio.stopScannerLoop();
    if (scanHoldHud) scanHoldHud.style.display = 'none';
    if (handForm) handForm.visible = false;
    vpnDisconnected = false;
    cctvOpen = false;
    leftDoorClosed = false;
    rightShutterClosed = false;
    leftLightOn = false;
    rightLightOn = false;
    syncControlsUI();
    hud.classList.remove('on');
    if (tutorialBanner) tutorialBanner.classList.add('hide');
    phoneBox.classList.add('hide');

    clearCinematicOverlays();

    // Check Level Progression:
    // Level 1 -> Intermission Video (Level 1 complete.mp4) -> Auto-Advance to Level 2 (Lahore)
    // Level 2 -> Intermission Video (Level 2 Completed.mp4) -> Auto-Advance to Level 3 (Karachi)
    // Level 3 -> Final Game End 3D Fajr Dawn Cutscene -> Grand Campaign Victory Screen!
    if (currentHalqaLevel === 1) {
      state = 'LEVEL_TRANSITION';
      try {
        localStorage.setItem('na47_unlocked_halqa', '2');
      } catch (e) {}
      playLevelCompleteCutscene(1, () => {
        applyHalqaLevel(2);
        startShift();
      });
      return;
    }

    if (currentHalqaLevel === 2) {
      state = 'LEVEL_TRANSITION';
      try {
        localStorage.setItem('na47_unlocked_halqa', '3');
      } catch (e) {}
      playLevelCompleteCutscene(2, () => {
        applyHalqaLevel(3);
        startShift();
      });
      return;
    }

    // LEVEL 3 GRAND FINALE: Start the smooth blank & narrative reflection sequence
    // which then flows seamlessly into the End Credits Video cutscene!
    playEndingSequence();
  }

  function finishWinModal() {
    playEndingSequence();
  }

  // --- LEVEL COMPLETE INTERMISSION CUTSCENE (LEVEL 1 & LEVEL 2) ---
  const levelCompleteCutsceneEl = document.getElementById('level-complete-cutscene');
  const levelCompleteVideo = document.getElementById('level-complete-video');
  const btnSkipLevelComplete = document.getElementById('btn-skip-level-complete');
  const levelCompleteTag = document.getElementById('level-complete-tag');

  function playLevelCompleteCutscene(levelNum, onComplete) {
    if (!levelCompleteCutsceneEl || !levelCompleteVideo) {
      if (onComplete) onComplete();
      return;
    }

    try { if (GameAudio && GameAudio.stopAmbience) GameAudio.stopAmbience(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopHeartbeat) GameAudio.stopHeartbeat(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopScannerLoop) GameAudio.stopScannerLoop(); } catch (_) {}

    const videoSrc = (levelNum === 1) ? 'assets/level1_complete.mp4' : 'assets/level2_complete.mp4';
    const tagText = (levelNum === 1) 
      ? 'HALQA NA-47 CLEARED · ADVANCING TO NA-128 LAHORE'
      : 'HALQA NA-128 CLEARED · ADVANCING TO NA-241 KARACHI';
    
    if (levelCompleteTag) {
      levelCompleteTag.textContent = tagText;
      levelCompleteTag.style.color = (levelNum === 1) ? '#86efac' : '#fde047';
    }

    let finished = false;
    function endLevelCutscene(isSkip = false) {
      if (finished) return;
      finished = true;
      window.removeEventListener('keydown', handleKeySkip);
      if (levelCompleteVideo) {
        levelCompleteVideo.pause();
        levelCompleteVideo.onended = null;
        levelCompleteVideo.onerror = null;
      }
      try {
        if (GameAudio && GameAudio.cctvBlip) GameAudio.cctvBlip();
        if (GameAudio && GameAudio.staticBurst) GameAudio.staticBurst();
      } catch (_) {}

      if (isSkip) {
        levelCompleteCutsceneEl.style.transition = 'none';
        levelCompleteCutsceneEl.classList.remove('active', 'fading-out');
        levelCompleteCutsceneEl.style.display = 'none';
        if (onComplete) onComplete();
        requestAnimationFrame(() => {
          levelCompleteCutsceneEl.style.transition = '';
          levelCompleteCutsceneEl.style.display = '';
        });
      } else {
        levelCompleteCutsceneEl.classList.add('fading-out');
        setTimeout(() => {
          levelCompleteCutsceneEl.classList.remove('active', 'fading-out');
          levelCompleteCutsceneEl.style.display = 'none';
          if (onComplete) onComplete();
        }, 850);
      }
    }

    function handleKeySkip(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        endLevelCutscene(true);
      }
    }

    if (btnSkipLevelComplete) {
      btnSkipLevelComplete.onclick = (e) => {
        e.stopPropagation();
        endLevelCutscene(true);
      };
    }

    window.addEventListener('keydown', handleKeySkip);
    levelCompleteVideo.onended = () => endLevelCutscene(false);
    levelCompleteVideo.onerror = () => {
      console.warn('Level complete video error, advancing to next level');
      endLevelCutscene(true);
    };

    levelCompleteVideo.src = videoSrc;
    levelCompleteVideo.currentTime = 0;

    // Smooth fade in transition
    levelCompleteCutsceneEl.style.display = 'flex';
    levelCompleteCutsceneEl.classList.remove('fading-out');
    void levelCompleteCutsceneEl.offsetWidth; // Force reflow
    levelCompleteCutsceneEl.classList.add('active');

    const playPromise = levelCompleteVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('Level complete video play caught:', err);
      });
    }
  }

  // --- FINAL END CREDITS CUTSCENE (LEVEL 3 CAMPAIGN FINALE) ---
  function returnToMainMenu() {
    isGamePaused = false;
    if (pauseModalEl) pauseModalEl.classList.add('hide');
    try {
      if (GameAudio && GameAudio.ctx && GameAudio.ctx.state !== 'running') {
        GameAudio.ctx.resume().catch(() => {});
      }
    } catch (_) {}
    state = 'MENU';
    powerOutMode = 'vigo';
    restoreAmbientLight();
    syncActiveSceneLights();
    if (typeof syncMenuUnlockState === 'function') syncMenuUnlockState();
    clearEndingSequenceTimers();
    clearCinematicOverlays();
    if (endingReflectionOverlay) {
      endingReflectionOverlay.classList.remove('active', 'fading-out');
      endingReflectionOverlay.style.display = 'none';
    }
    if (dawnCutsceneUi) dawnCutsceneUi.classList.remove('on');
    if (gameoverModal) {
      gameoverModal.classList.add('hide');
      gameoverModal.style.display = 'none';
    }
    if (deathScreen) deathScreen.classList.add('hide');
    if (howToPlayModal) howToPlayModal.classList.add('hide');
    if (optionsModal) optionsModal.classList.add('hide');
    if (audioVaultModal) audioVaultModal.classList.add('hide');

    if (hud) {
      hud.classList.remove('on');
      hud.style.display = 'none';
    }

    document.body.classList.add('menu-active');
    if (menuModal) menuModal.classList.remove('hide');

    try {
      updateDifficultyUI();
    } catch (_) {}

    tryStartMenuMusic();
  }

  // --- POST-GAME REFLECTION & ENDING CUTSCENE ORCHESTRATOR ---
  let endingSequenceTimers = [];
  let creditsFadeVolTimer = null;
  let creditsVideoShowTimer = null;

  function clearEndingSequenceTimers() {
    endingSequenceTimers.forEach(t => clearTimeout(t));
    endingSequenceTimers = [];
    if (creditsFadeVolTimer) {
      clearInterval(creditsFadeVolTimer);
      creditsFadeVolTimer = null;
    }
    if (creditsVideoShowTimer) {
      clearTimeout(creditsVideoShowTimer);
      creditsVideoShowTimer = null;
    }
  }

  function preheatAndStartCreditsAudio() {
    if (!endCreditsVideo) return;
    const targetSrc = 'assets/end_credits.mp4';
    if (!endCreditsVideo.src || !endCreditsVideo.src.includes('assets/end_credits.mp4')) {
      endCreditsVideo.src = targetSrc;
    }
    endCreditsVideo.currentTime = 0;
    endCreditsVideo.volume = 0;

    // Start video playback invisibly in background (overlay is still on top with opacity 1)
    const p = endCreditsVideo.play();
    if (p !== undefined) {
      p.catch(err => {
        console.warn('Credits audio preheat error/autoplay restriction:', err);
      });
    }

    // Softly ramp up credits audio from 0 to 0.75 over 2.5s while Block 8 text is active
    let v = 0;
    if (creditsFadeVolTimer) clearInterval(creditsFadeVolTimer);
    creditsFadeVolTimer = setInterval(() => {
      if (!endCreditsVideo) return;
      v = Math.min(0.85, v + 0.03);
      endCreditsVideo.volume = v;
      if (v >= 0.85) {
        clearInterval(creditsFadeVolTimer);
        creditsFadeVolTimer = null;
      }
    }, 85);
  }

  function formatPlaytimeString(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m ${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  function playEndingSequence() {
    if (!endingReflectionOverlay) {
      playEndCreditsCutscene();
      return;
    }

    state = 'ENDING_REFLECTION';
    clearEndingSequenceTimers();

    // 1. Immediately kill all gameplay sounds, hums, and UI for the eerie blank pause
    try { if (GameAudio && GameAudio.stopAmbience) GameAudio.stopAmbience(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopHeartbeat) GameAudio.stopHeartbeat(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopScannerLoop) GameAudio.stopScannerLoop(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopPhoneGuy) GameAudio.stopPhoneGuy(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopMenuMusic) GameAudio.stopMenuMusic(0.3); } catch (_) {}
    clearCinematicOverlays();

    if (dawnCutsceneUi) dawnCutsceneUi.classList.remove('on');
    if (hud) {
      hud.classList.remove('on');
      hud.style.display = 'none';
    }

    // Save campaign stats & unlock record
    saveCampaignStats();
    try {
      localStorage.setItem('na47_unlocked_halqa', '3');
      localStorage.setItem('na47_unlocked_level', '3');
      localStorage.setItem('form45_campaign_completed', 'true');
    } catch (_) {}

    // Populate reflection stats cards with 3-level campaign stats
    if (refStatPlaytime) {
      refStatPlaytime.textContent = formatPlaytimeString(campaignPlaytimeSec);
    }
    if (refStatRetries) {
      refStatRetries.textContent = campaignRetries.toString();
    }
    if (refStatForms) {
      refStatForms.textContent = '90 / 90';
    }

    // Prepare clean overlay state (total blackness)
    endingReflectionOverlay.style.display = 'flex';
    endingReflectionOverlay.classList.remove('fading-out', 'active');
    Object.values(endingBlocks).forEach(b => {
      if (b) {
        b.classList.remove('show', 'fading');
        b.style.display = 'none';
      }
    });

    void endingReflectionOverlay.offsetWidth;
    endingReflectionOverlay.classList.add('active');

    let skipped = false;
    function handleReflectionSkip(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        skipToCredits();
      }
    }

    function skipToCredits() {
      if (skipped) return;
      skipped = true;
      window.removeEventListener('keydown', handleReflectionSkip);
      clearEndingSequenceTimers();

      // Fade out visible reflection blocks to pure black while keeping the black backdrop opaque
      // so the 3D office is never revealed before the end credits video fades in.
      Object.values(endingBlocks).forEach(b => {
        if (b && b.style.display !== 'none') {
          b.classList.add('fading');
        }
      });
      playEndCreditsCutscene();
    }

    window.addEventListener('keydown', handleReflectionSkip);

    function showBlock(num, holdMs) {
      return new Promise(resolve => {
        if (skipped) return resolve();
        const block = endingBlocks[num];
        if (!block) return resolve();

        // Fade in
        block.style.display = 'block';
        void block.offsetWidth;
        block.classList.remove('fading');
        block.classList.add('show');

        // Hold
        const holdTimer = setTimeout(() => {
          if (skipped) return resolve();
          // Fade out
          block.classList.add('fading');
          const fadeTimer = setTimeout(() => {
            block.classList.remove('show', 'fading');
            block.style.display = 'none';
            resolve();
          }, 650);
          endingSequenceTimers.push(fadeTimer);
        }, holdMs);
        endingSequenceTimers.push(holdTimer);
      });
    }

    function waitBlank(ms) {
      return new Promise(resolve => {
        if (skipped) return resolve();
        const t = setTimeout(resolve, ms);
        endingSequenceTimers.push(t);
      });
    }

    // --- SEQUENTIAL 8-STAGE TIMELINE ---
    (async () => {
      // Stage 0: Initial chilling silence & total black void
      await waitBlank(1800);
      if (skipped) return;

      // *Block 1*: "THANK YOU FOR PLAYING"
      await showBlock(1, 3200);
      await waitBlank(800);
      if (skipped) return;

      // *Block 2*: Campaign Stats Record (all 3 Halqas)
      await showBlock(2, 5400);
      await waitBlank(900);
      if (skipped) return;

      // *Block 3*: "In the game, you defended the forms."
      await showBlock(3, 2600);
      await waitBlank(700);
      if (skipped) return;

      // *Block 4*: "You protected the mandate."
      await showBlock(4, 2600);
      await waitBlank(700);
      if (skipped) return;

      // *Block 5*: "You saved the election."
      await showBlock(5, 2900);
      if (skipped) return;

      // *Block 6*: Dramatic blank pause in absolute darkness
      await waitBlank(2400);
      if (skipped) return;

      // *Block 7*: "...But what about reality?"
      await showBlock(7, 3400);
      await waitBlank(1000);
      if (skipped) return;

      // *Block 8*: "February 8, 2024 · Form 47" (Glitching red Form 47)
      // AUDIO J-CUT / PRE-LAP:
      // While Block 8 is on screen, start end credits video audio quietly in background!
      const block8Promise = showBlock(8, 4800);
      const preheatAudioTimer = setTimeout(() => {
        if (!skipped) preheatAndStartCreditsAudio();
      }, 1400); // 1.4s after Block 8 appears, audio starts bleeding in softly
      endingSequenceTimers.push(preheatAudioTimer);

      await block8Promise;
      if (skipped) return;

      // Dissolve into End Credits Cutscene over pure black (no office still in between!)
      window.removeEventListener('keydown', handleReflectionSkip);
      playEndCreditsCutscene({ audioAlreadyStarted: true });
    })();
  }

  window.playEndingSequence = playEndingSequence;

  function playEndCreditsCutscene(opts = {}) {
    if (!endCreditsCutsceneEl || !endCreditsVideo) {
      returnToMainMenu();
      return;
    }

    const audioAlreadyStarted = opts && opts.audioAlreadyStarted;
    state = 'END_CREDITS';

    // Stop all gameplay audio
    try { if (GameAudio && GameAudio.stopAmbience) GameAudio.stopAmbience(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopHeartbeat) GameAudio.stopHeartbeat(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopScannerLoop) GameAudio.stopScannerLoop(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopPhoneGuy) GameAudio.stopPhoneGuy(); } catch (_) {}
    try { if (GameAudio && GameAudio.stopMenuMusic) GameAudio.stopMenuMusic(0.5); } catch (_) {}
    clearCinematicOverlays();

    if (dawnCutsceneUi) dawnCutsceneUi.classList.remove('on');
    if (hud) {
      hud.classList.remove('on');
      hud.style.display = 'none';
    }

    // Save full campaign completion in localStorage
    try {
      localStorage.setItem('na47_unlocked_halqa', '3');
      localStorage.setItem('na47_unlocked_level', '3');
      localStorage.setItem('form45_campaign_completed', 'true');
    } catch (_) {}

    let finished = false;
    let fadeVolTimer = null;
    let videoShowTimer = null;

    function endCreditsSequence(isSkip = false) {
      if (finished) return;
      finished = true;
      if (fadeVolTimer) clearInterval(fadeVolTimer);
      if (videoShowTimer) clearTimeout(videoShowTimer);
      window.removeEventListener('keydown', handleCreditsKeySkip);

      if (endCreditsVideo) {
        endCreditsVideo.pause();
        endCreditsVideo.onended = null;
        endCreditsVideo.onerror = null;
      }

      try {
        if (GameAudio && GameAudio.cctvBlip) GameAudio.cctvBlip();
      } catch (_) {}

      // Smooth fade-out transition to main menu
      if (endingReflectionOverlay) {
        endingReflectionOverlay.classList.remove('active', 'fading-out');
        endingReflectionOverlay.style.display = 'none';
      }
      endCreditsCutsceneEl.classList.add('fading-out');
      setTimeout(() => {
        endCreditsCutsceneEl.classList.remove('active', 'fading-out');
        if (endCreditsVideo) endCreditsVideo.classList.remove('visible');
        endCreditsCutsceneEl.style.display = 'none';
        returnToMainMenu();
      }, 1000);
    }

    function handleCreditsKeySkip(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        endCreditsSequence(true);
      }
    }

    if (btnSkipEndCredits) {
      btnSkipEndCredits.onclick = (e) => {
        e.stopPropagation();
        endCreditsSequence(true);
      };
    }

    window.addEventListener('keydown', handleCreditsKeySkip);
    endCreditsVideo.onended = () => endCreditsSequence(false);
    endCreditsVideo.onerror = (e) => {
      console.warn('End credits video error event:', e, endCreditsVideo.error);
      if (endCreditsVideo.error && endCreditsVideo.error.code === 4) {
        endCreditsSequence(true);
      }
    };

    const targetSrc = 'assets/end_credits.mp4';
    if (!endCreditsVideo.src || !endCreditsVideo.src.includes('assets/end_credits.mp4')) {
      endCreditsVideo.src = targetSrc;
    }
    if (!audioAlreadyStarted) {
      endCreditsVideo.currentTime = 0;
      endCreditsVideo.volume = 0;
    }

    // Ensure initial opacity: 0 frame is committed before triggering CSS fade-in transition
    endCreditsCutsceneEl.classList.remove('active', 'fading-out');
    endCreditsVideo.classList.remove('visible');
    endCreditsCutsceneEl.style.display = 'flex';
    void endCreditsCutsceneEl.offsetWidth;

    requestAnimationFrame(() => {
      if (finished) return;
      requestAnimationFrame(() => {
        if (finished) return;
        endCreditsCutsceneEl.classList.add('active');
        setTimeout(() => {
          if (endingReflectionOverlay) {
            endingReflectionOverlay.classList.remove('active', 'fading-out');
            endingReflectionOverlay.style.display = 'none';
          }
          Object.values(endingBlocks).forEach(b => {
            if (b) {
              b.classList.remove('show', 'fading');
              b.style.display = 'none';
            }
          });
        }, 1600);

        if (!audioAlreadyStarted) {
          const playPromise = endCreditsVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(err => {
              console.warn('End credits video play error/autoplay restriction:', err);
              endCreditsVideo.muted = true;
              endCreditsVideo.play().then(() => {
                const unmuteOnInteraction = () => {
                  endCreditsVideo.muted = false;
                  window.removeEventListener('pointerdown', unmuteOnInteraction);
                  window.removeEventListener('keydown', unmuteOnInteraction);
                };
                window.addEventListener('pointerdown', unmuteOnInteraction, { once: true });
                window.addEventListener('keydown', unmuteOnInteraction, { once: true });
              }).catch(() => {});
            });
          }
        }

        // Smoothly fade in video frame
        videoShowTimer = setTimeout(() => {
          if (!finished) {
            endCreditsVideo.classList.add('visible');
          }
        }, 120);

        let vol = audioAlreadyStarted ? endCreditsVideo.volume : 0;
        fadeVolTimer = setInterval(() => {
          if (finished || !endCreditsVideo) {
            clearInterval(fadeVolTimer);
            return;
          }
          vol = Math.min(1.0, vol + 0.05);
          endCreditsVideo.volume = vol;
          if (vol >= 1.0) clearInterval(fadeVolTimer);
        }, 65);
      });
    });
  }

  window.playEndCreditsCutscene = playEndCreditsCutscene;
  window.returnToMainMenu = returnToMainMenu;

  window.playLevelCompleteCutscene = playLevelCompleteCutscene;
  window.triggerWin = triggerWin;
  window.startShift = startShift;
  window.toggleCctv = toggleCctv;
  window.selectCam = selectCam;
  window.triggerCctvFormsScatter = triggerCctvFormsScatter;
  window.handleCctvFormCollect = handleCctvFormCollect;
  window.__getCctvActiveFormCams = () => Array.from(cctvActiveFormCams);
  window.__setMonsterZoneForTest = (gZone, wZone) => { if (typeof GULLU_PATH !== 'undefined') GULLU_PATH[gulluStep] = gZone; if (typeof WHITENER_PATH !== 'undefined') WHITENER_PATH[whitenerStep] = wZone; };
  window.__getDeathReason = () => deathReasonOverride;

  // --- INTRO NEWS BROADCAST CUTSCENE (FORM-45 ELECTION TRANSMISSION) ---
  const introCutsceneEl = document.getElementById('intro-news-cutscene');
  const newsVideo = document.getElementById('news-cutscene-video');
  const newsSubtitlesEl = document.getElementById('news-cutscene-subtitles');
  const btnSkipNews = document.getElementById('btn-skip-news-cutscene');

  const NEWS_CUTSCENE_CUES = [
    {
      start: 1.5,
      end: 5.2,
      text: 'Khawateen-o-hazraat, waqt hua hai raat ke das bajay ka.',
      textEn: "Ladies and gentlemen, the time is 10 o'clock at night."
    },
    {
      start: 5.4,
      end: 9.6,
      text: 'Mulk bhar mein polling ka waqt khatam aur ginti ka aaghaz ho chuka hai.',
      textEn: 'Polling has ended across the country and counting has begun.'
    },
    {
      start: 9.8,
      end: 16.2,
      text: 'Jee bilkul Tariq, tamaam halqon se ballot boxes seal kar ke ginti ka amal baqaida shuru kiya ja chuka hai.',
      textEn: 'Yes indeed Tariq, ballot boxes from all constituencies have been sealed and the counting process has officially begun.'
    },
    {
      start: 16.5,
      end: 21.5,
      text: 'Election Commission ke mutabiq subah theek chhay bajay hatmi nataij ka ailaan kiya jayega.',
      textEn: 'According to the Election Commission, the final results will be announced at 6 AM sharp.'
    },
    {
      start: 21.8,
      end: 26.6,
      text: 'Subah chhay bajay tak nataij ki pal pal surat-e-haal ke liye hamaray saath rahiye.',
      textEn: 'Stay with us until 6 AM for moment-by-moment updates on the results.'
    }
  ];

  function updateNewsCutsceneSubtitle(t) {
    if (!newsSubtitlesEl) return;
    if (!subtitlesEnabled) {
      newsSubtitlesEl.style.display = 'none';
      return;
    }
    const cue = NEWS_CUTSCENE_CUES.find(c => t >= c.start && t <= c.end);
    if (!cue) {
      newsSubtitlesEl.style.display = 'none';
      return;
    }
    const line = subtitleLang === 'ENGLISH' ? cue.textEn : cue.text;
    if (newsSubtitlesEl.textContent !== line) {
      newsSubtitlesEl.textContent = line;
    }
    newsSubtitlesEl.style.display = 'block';
  }

  function playIntroNewsCutscene(onComplete) {
    if (!introCutsceneEl || !newsVideo) {
      if (onComplete) onComplete();
      return;
    }

    // First playthrough is strictly unskippable
    let hasSeenCutscene = false;
    try {
      hasSeenCutscene = localStorage.getItem('form45_seen_intro_cutscene') === '1';
    } catch (_) {}

    if (btnSkipNews) {
      btnSkipNews.style.display = hasSeenCutscene ? 'block' : 'none';
    }

    let finished = false;
    function endCutscene(isSkip = false) {
      if (finished) return;
      finished = true;
      try {
        localStorage.setItem('form45_seen_intro_cutscene', '1');
      } catch (_) {}
      window.removeEventListener('keydown', handleKeySkip);
      if (newsVideo) {
        newsVideo.pause();
        newsVideo.onended = null;
        newsVideo.onerror = null;
        newsVideo.ontimeupdate = null;
      }
      if (newsSubtitlesEl) {
        newsSubtitlesEl.style.display = 'none';
        newsSubtitlesEl.textContent = '';
      }
      try {
        if (GameAudio && GameAudio.cctvBlip) GameAudio.cctvBlip();
        if (GameAudio && GameAudio.staticBurst) GameAudio.staticBurst();
      } catch (_) {}

      if (isSkip) {
        // Player skipped: instantly reveal game with NO fadeout
        introCutsceneEl.style.transition = 'none';
        introCutsceneEl.classList.remove('active', 'fading-out');
        introCutsceneEl.style.display = 'none';
        if (onComplete) onComplete();
        requestAnimationFrame(() => {
          introCutsceneEl.style.transition = '';
          introCutsceneEl.style.display = '';
        });
      } else {
        // Video finished naturally: start main game shift behind overlay and fade smoothly
        if (onComplete) onComplete();
        introCutsceneEl.classList.add('fading-out');
        setTimeout(() => {
          introCutsceneEl.classList.remove('active', 'fading-out');
        }, 1250);
      }
    }

    function handleKeySkip(e) {
      if (!hasSeenCutscene) return; // Disallow skipping during first watch
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        endCutscene(true);
      }
    }

    if (btnSkipNews) {
      btnSkipNews.onclick = (e) => {
        e.stopPropagation();
        if (hasSeenCutscene) {
          endCutscene(true);
        }
      };
    }

    window.addEventListener('keydown', handleKeySkip);
    newsVideo.onended = () => endCutscene(false);
    newsVideo.onerror = () => endCutscene(true);
    newsVideo.ontimeupdate = () => updateNewsCutsceneSubtitle(newsVideo.currentTime || 0);

    if (newsSubtitlesEl) {
      newsSubtitlesEl.style.display = 'none';
      newsSubtitlesEl.textContent = '';
    }
    introCutsceneEl.classList.add('active');
    newsVideo.currentTime = 0;
    const playPromise = newsVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('News cutscene autoplay handled:', err);
      });
    }
  }

  function getUnlockedHalqaLevel() {
    try {
      const val = parseInt(localStorage.getItem('na47_unlocked_halqa') || '1', 10);
      if (!isNaN(val)) return Math.max(1, Math.min(3, val));
    } catch (_) {}
    return 1;
  }

  function hasSavedGame() {
    try {
      if (localStorage.getItem('form45_has_save') === '1') return true;
      if (getUnlockedHalqaLevel() > 1) return true;
      if (localStorage.getItem('form45_campaign_completed') === 'true') return true;
    } catch (_) {}
    return false;
  }

  function isCampaignCompleted() {
    try {
      return localStorage.getItem('form45_campaign_completed') === 'true';
    } catch (_) {}
    return false;
  }

  function syncMenuUnlockState() {
    const maxHalqa = getUnlockedHalqaLevel();
    if (currentHalqaLevel > maxHalqa) {
      currentHalqaLevel = maxHalqa;
      try { localStorage.setItem('na47_halqa_level', String(currentHalqaLevel)); } catch (_) {}
      applyHalqaLevel(currentHalqaLevel);
    }
    const saved = hasSavedGame();
    const contBtn = document.getElementById('btn-continue');
    const contLbl = document.getElementById('btn-continue-lbl');
    if (contBtn) {
      contBtn.classList.toggle('locked', !saved);
      contBtn.setAttribute('aria-disabled', saved ? 'false' : 'true');
    }
    if (contLbl) {
      contLbl.textContent = 'CONTINUE';
    }
    if (btnCredits) {
      btnCredits.style.display = isCampaignCompleted() ? '' : 'none';
    }
    if (typeof updateDifficultyUI === 'function') updateDifficultyUI();
  }

  function startNewGameWithCutscene() {
    try { if (window.GameAudio && window.GameAudio.stopMenuMusic) window.GameAudio.stopMenuMusic(0.8); } catch (_) {}
    resetCampaignStats();
    currentHalqaLevel = 1;
    applyHalqaLevel(1);
    document.body.classList.remove('menu-active');
    menuModal.classList.add('hide');
    state = 'CUTSCENE';
    playIntroNewsCutscene(() => {
      startShift();
    });
  }

  
  // --- HOMESCREEN MENU BACKGROUND MUSIC ENGINE ---
  function tryStartMenuMusic() {
    if (state === 'MENU' && document.body.classList.contains('menu-active') && menuModal && !menuModal.classList.contains('hide')) {
      try {
        if (window.GameAudio && window.GameAudio.startMenuMusic) {
          window.GameAudio.startMenuMusic();
        }
      } catch (_) {}
    }
  }

  // Immediate attempt on load
  tryStartMenuMusic();

  // User gesture listeners (silently unlock Web Audio & menu music if browser deferred autoplay)
  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => {
      try { if (window.GameAudio && window.GameAudio.init) window.GameAudio.init(); } catch (_) {}
      tryStartMenuMusic();
    }, { passive: true });
  });

  // --- UI & KEYBOARD BINDINGS ---
  btnPlay.addEventListener('click', () => {
    tryEnterMobileFullscreen();
    startNewGameWithCutscene();
  });
  const btnContinue = document.getElementById('btn-continue');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      if (!hasSavedGame() || currentHalqaLevel > getUnlockedHalqaLevel()) {
        try { GameAudio.tone(150, 110, 0.14, 'sawtooth', 0.14, 0); } catch (_) {}
        return;
      }
      tryEnterMobileFullscreen();
      if (!selectedDifficulty || !DIFFICULTY_SETTINGS[selectedDifficulty]) {
        selectedDifficulty = LEVEL_ORDER[unlockedLevelIdx] || 'EASY';
      }
      updateDifficultyUI();
      startShift();
    });
  }

  // --- PROGRESSIVE LEVEL UNLOCK & DIFFICULTY SELECTOR ENGINE ---
  try {
    const savedUnlock = parseInt(localStorage.getItem('na47_unlocked_level') || '0', 10);
    unlockedLevelIdx = isNaN(savedUnlock) ? 0 : Math.max(0, Math.min(3, savedUnlock));
    const savedDiff = localStorage.getItem('na47_difficulty');
    if (savedDiff && DIFFICULTY_SETTINGS[savedDiff]) {
      selectedDifficulty = savedDiff;
    } else {
      selectedDifficulty = 'EASY';
    }
  } catch (e) {}

  function updateDifficultyUI() {
    const diffButtons = document.querySelectorAll('#diff-picker .diff-btn');
    const descEl = document.getElementById('diff-desc-text');
    const contLbl = document.getElementById('btn-continue-lbl');
    diffButtons.forEach(btn => {
      const d = btn.getAttribute('data-diff');
      const idx = LEVEL_ORDER.indexOf(d);
      const isLocked = idx > unlockedLevelIdx;
      const nameEl = btn.querySelector('.lvl-name');
      btn.classList.toggle('locked', isLocked);
      btn.classList.toggle('sel', d === selectedDifficulty && !isLocked);
      if (nameEl && d) {
        nameEl.textContent = isLocked ? ` ${d}` : d;
      }
    });
    if (contLbl) {
      contLbl.textContent = 'CONTINUE';
    }
    if (descEl) {
      descEl.textContent = '';
      descEl.style.display = 'none';
    }
    const diffValSpan = document.getElementById('fnaf-diff-val');
    const diffToggleBtn = document.getElementById('btn-difficulty-toggle');
    const isHalqaLocked = currentHalqaLevel > getUnlockedHalqaLevel();
    if (diffValSpan) {
      const curCfg = HALQA_CONFIGS[currentHalqaLevel] || HALQA_CONFIGS[1];
      diffValSpan.textContent = `< ${curCfg.label} >`;
      diffValSpan.style.color = isHalqaLocked ? '#64748b' : curCfg.hudColor;
      diffValSpan.style.textShadow = isHalqaLocked ? 'none' : '';
    }
    if (diffToggleBtn) {
      diffToggleBtn.classList.toggle('locked', isHalqaLocked);
    }
  }

  document.querySelectorAll('#diff-picker .diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.getAttribute('data-diff');
      const idx = LEVEL_ORDER.indexOf(d);
      if (idx > unlockedLevelIdx) {
        try { GameAudio.tone(150, 110, 0.14, 'sawtooth', 0.14, 0); } catch (_) {}
        return;
      }
      if (d && DIFFICULTY_SETTINGS[d]) {
        selectedDifficulty = d;
        try { localStorage.setItem('na47_difficulty', d); } catch (e) {}
        updateDifficultyUI();
        GameAudio.cctvBlip();
      }
    });
  });

  try {
    const maxHalqa = getUnlockedHalqaLevel();
    const savedLvl = parseInt(localStorage.getItem('na47_halqa_level'), 10);
    if (savedLvl >= 1 && savedLvl <= maxHalqa) currentHalqaLevel = savedLvl;
    else currentHalqaLevel = 1;
  } catch (_) {}
  applyHalqaLevel(currentHalqaLevel);
  syncMenuUnlockState();

  // --- HOMESCREEN 3-OPTION NAVIGATION & SETTINGS ENGINE ---
  // --- FNAF 1 MINIMAL MENU NAVIGATION & INTERACTION ---
  const btnDiffToggle = document.getElementById('btn-difficulty-toggle');
  if (btnDiffToggle) {
    btnDiffToggle.addEventListener('click', () => {
      currentHalqaLevel = (currentHalqaLevel % 3) + 1;
      const isHalqaLocked = currentHalqaLevel > getUnlockedHalqaLevel();
      if (!isHalqaLocked) {
        try { localStorage.setItem('na47_halqa_level', currentHalqaLevel); } catch (e) {}
      }
      applyHalqaLevel(currentHalqaLevel);
      updateDifficultyUI();
      try {
        if (isHalqaLocked) GameAudio.tone(150, 110, 0.14, 'sawtooth', 0.14, 0);
        else GameAudio.cctvBlip();
      } catch (_) {}
    });
  }

  const fnafMenuItems = document.querySelectorAll('.form45-menu-item, .fnaf-menu-item');
  fnafMenuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      fnafMenuItems.forEach(m => m.classList.remove('active'));
      item.classList.add('active');
      try { if (GameAudio && GameAudio.menuHover) GameAudio.menuHover(); } catch (_) {}
    });
  });

  window.addEventListener('keydown', (e) => {
    if (state !== 'MENU') return;
    const items = Array.from(document.querySelectorAll('.form45-menu-item, .fnaf-menu-item'))
      .filter(el => el.style.display !== 'none' && el.offsetParent !== null);
    if (!items.length) return;
    let activeIdx = items.findIndex(el => el.classList.contains('active'));
    if (activeIdx < 0) activeIdx = 0;

    if (e.key === 'ArrowDown') {
      activeIdx = (activeIdx + 1) % items.length;
      items.forEach((m, idx) => m.classList.toggle('active', idx === activeIdx));
      try { if (GameAudio && GameAudio.menuHover) GameAudio.menuHover(); } catch (_) {}
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      activeIdx = (activeIdx - 1 + items.length) % items.length;
      items.forEach((m, idx) => m.classList.toggle('active', idx === activeIdx));
      try { if (GameAudio && GameAudio.menuHover) GameAudio.menuHover(); } catch (_) {}
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (items[activeIdx]) {
        items[activeIdx].click();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      if (items[activeIdx] && items[activeIdx].id === 'btn-difficulty-toggle') {
        const step = e.key === 'ArrowRight' ? 1 : -1;
        currentHalqaLevel = currentHalqaLevel + step;
        if (currentHalqaLevel < 1) currentHalqaLevel = 3;
        if (currentHalqaLevel > 3) currentHalqaLevel = 1;
        const isHalqaLocked = currentHalqaLevel > getUnlockedHalqaLevel();
        if (!isHalqaLocked) {
          try { localStorage.setItem('na47_halqa_level', currentHalqaLevel); } catch (e) {}
        }
        applyHalqaLevel(currentHalqaLevel);
        updateDifficultyUI();
        try {
          if (isHalqaLocked) GameAudio.tone(150, 110, 0.14, 'sawtooth', 0.14, 0);
          else GameAudio.cctvBlip();
        } catch (_) {}
        e.preventDefault();
      }
    }
  });

const btnHowToPlay = document.getElementById('btn-how-to-play');
  const btnOptions = document.getElementById('btn-options');
  const btnBackFromHow = document.getElementById('btn-back-from-how');
  const btnPlayFromHow = document.getElementById('btn-play-from-how');
  const btnBackFromOptions = document.getElementById('btn-back-from-options');
  const btnResetOptions = document.getElementById('btn-reset-options');

  let mouseSensMultiplier = 1.0;
  let shakeMultiplier = 1.0;
  let subtitlesEnabled = true;
  let subtitleLang = (() => {
    try { return localStorage.getItem('form45_sub_lang') === 'ENGLISH' ? 'ENGLISH' : 'URDU'; } catch (_) { return 'URDU'; }
  })();
  let crtEnabled = true;
  let shakeSetting = 0; // 0: FULL, 1: REDUCED, 2: OFF
  const shakeLabels = ['FULL', 'REDUCED', 'OFF'];
  const shakeMults = [1.0, 0.4, 0.0];

  // Navigation handlers
  if (btnHowToPlay) {
    btnHowToPlay.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      menuModal.classList.add('hide');
      if (howToPlayModal) howToPlayModal.classList.remove('hide');
    });
  }

  if (btnOptions) {
    btnOptions.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      menuModal.classList.add('hide');
      if (optionsModal) optionsModal.classList.remove('hide');
    });
  }

  if (btnBackFromHow) {
    btnBackFromHow.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      if (howToPlayModal) howToPlayModal.classList.add('hide');
      document.body.classList.add('menu-active');
      menuModal.classList.remove('hide');
    });
  }

  if (btnPlayFromHow) {
    btnPlayFromHow.addEventListener('click', () => {
      if (howToPlayModal) howToPlayModal.classList.add('hide');
      startNewGameWithCutscene();
    });
  }

  if (btnBackFromOptions) {
    btnBackFromOptions.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      if (optionsModal) optionsModal.classList.add('hide');
      document.body.classList.add('menu-active');
      menuModal.classList.remove('hide');
    });
  }

  if (btnCredits) {
    btnCredits.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      menuModal.classList.add('hide');
      document.body.classList.remove('menu-active');
      playEndCreditsCutscene();
    });
  }

  // --- AUDIO VAULT SOUNDBOARD MODAL ENGINE ---
  const btnAudioVault = document.getElementById('btn-audio-vault');
  const audioVaultModal = document.getElementById('audio-vault-modal');
  const btnBackFromAudio = document.getElementById('btn-back-from-audio');
  const modalAudioSearch = document.getElementById('modal-audio-search');
  const modalAudioGrid = document.getElementById('modal-audio-grid');
  const modalStopAll = document.getElementById('modal-stop-all');
  const modalCatPills = document.querySelectorAll('#modal-cat-pills .modal-pill');

  let modalActiveCat = 'all';
  let modalActiveLoops = {};
  let modalActiveSources = {};

  function stopAllModalAudio() {
    try {
      if (window.GameAudio) {
        window.GameAudio.stopAmbience();
        window.GameAudio.stopPhoneGuy();
        window.GameAudio.stopScannerLoop();
        window.GameAudio.stopEmergencyAlarm();
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      Object.keys(modalActiveLoops).forEach(k => {
        clearInterval(modalActiveLoops[k]);
        delete modalActiveLoops[k];
      });
      Object.keys(modalActiveSources).forEach(k => {
        try {
          if (modalActiveSources[k].stop) modalActiveSources[k].stop();
          if (modalActiveSources[k].pause) modalActiveSources[k].pause();
        } catch (_) {}
        delete modalActiveSources[k];
      });
      document.querySelectorAll('.modal-audio-item').forEach(it => {
        it.classList.remove('playing');
        const b = it.querySelector('.btn-modal-play');
        if (b) b.textContent = '▶ PLAY';
      });
    } catch (_) {}
  }

  function renderModalAudioItems() {
    if (!modalAudioGrid || !window.GAME_AUDIO_CATALOG) return;
    const q = (modalAudioSearch ? modalAudioSearch.value : '').toLowerCase().trim();
    const catalog = window.GAME_AUDIO_CATALOG;

    const filtered = catalog.filter(item => {
      if (modalActiveCat !== 'all' && item.category !== modalActiveCat) return false;
      if (!q) return true;
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.urdu && item.urdu.toLowerCase().includes(q)) ||
        (item.english && item.english.toLowerCase().includes(q)) ||
        (item.speaker && item.speaker.toLowerCase().includes(q)) ||
        (item.context && item.context.toLowerCase().includes(q))
      );
    });

    modalAudioGrid.innerHTML = '';
    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'modal-audio-item';
      card.id = 'modal-item-' + item.id;

      const speakerColor = item.category === 'khaki' ? '#f59e0b' : item.category === 'babu' ? '#38bdf8' : item.category === 'radio' ? '#c084fc' : item.category === 'sabotage' ? '#f87171' : '#4ade80';

      card.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px">
          <b style="font-size:12.5px;color:#fff">${item.title}</b>
          <span style="font-size:9.5px;padding:2px 5px;border-radius:2px;background:rgba(255,255,255,0.06);color:${speakerColor}">${item.speaker}</span>
        </div>
        ${item.urdu ? `<div style="font-size:11.5px;color:#fef08a;line-height:1.3">${item.urdu}</div>` : ''}
        ${item.english ? `<div style="font-size:10.5px;color:#94a3b8;font-style:italic;line-height:1.25">${item.english}</div>` : ''}
        <div style="font-size:9.5px;color:#6ee7b7;opacity:0.8"> ${item.context}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;margin-top:auto;border-top:1px solid #14281f;padding-top:6px">
          <button class="btn-modal-play" type="button" style="flex:1;background:#143022;border:1px solid #22c55e;color:#fff;font-family:inherit;font-size:11px;padding:5px 8px;border-radius:3px;cursor:pointer">
            ▶ PLAY
          </button>
          <button class="btn-modal-stop" type="button" style="background:#1b1c1e;border:1px solid #334155;color:#94a3b8;font-family:inherit;font-size:11px;padding:5px 8px;border-radius:3px;cursor:pointer">
            
          </button>
        </div>
      `;

      const btnPlay = card.querySelector('.btn-modal-play');
      const btnStop = card.querySelector('.btn-modal-stop');

      btnPlay.addEventListener('click', () => {
        try {
          if (window.GameAudio) window.GameAudio.init();
          card.classList.add('playing');
          btnPlay.textContent = ' PLAYING...';
          const defaultPan = (item.category === 'khaki') ? -0.85 : (item.category === 'babu') ? 0.85 : 0;
          if (typeof item.action === 'function') {
            const res = item.action(window.GameAudio, { pan: defaultPan, vol: 1.0 });
            if (res) modalActiveSources[item.id] = res;
          }
          setTimeout(() => {
            card.classList.remove('playing');
            btnPlay.textContent = '▶ PLAY';
          }, 3200);
        } catch (e) {
          console.error(e);
        }
      });

      btnStop.addEventListener('click', () => {
        if (typeof item.stopAction === 'function') {
          item.stopAction(window.GameAudio);
        }
        if (modalActiveSources[item.id]) {
          try {
            if (modalActiveSources[item.id].stop) modalActiveSources[item.id].stop();
            if (modalActiveSources[item.id].pause) modalActiveSources[item.id].pause();
          } catch (_) {}
          delete modalActiveSources[item.id];
        }
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        card.classList.remove('playing');
        btnPlay.textContent = '▶ PLAY';
      });

      modalAudioGrid.appendChild(card);
    });
  }

  function initModalAudioVault() {
    renderModalAudioItems();
  }

  if (btnAudioVault) {
    btnAudioVault.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      menuModal.classList.add('hide');
      if (audioVaultModal) {
        audioVaultModal.classList.remove('hide');
        initModalAudioVault();
      }
    });
  }

  if (btnBackFromAudio) {
    btnBackFromAudio.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      if (audioVaultModal) audioVaultModal.classList.add('hide');
      menuModal.classList.remove('hide');
      stopAllModalAudio();
    });
  }

  if (modalAudioSearch) {
    modalAudioSearch.addEventListener('input', () => {
      renderModalAudioItems();
    });
  }

  if (modalCatPills) {
    modalCatPills.forEach(pill => {
      pill.addEventListener('click', () => {
        modalCatPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        modalActiveCat = pill.getAttribute('data-cat');
        renderModalAudioItems();
      });
    });
  }

  if (modalStopAll) {
    modalStopAll.addEventListener('click', () => {
      stopAllModalAudio();
    });
  }

  // Audio hover feedback on menu cards & buttons
  document.querySelectorAll('.ps2-spine-btn, .ps2-lvl-btn, .menu-option-card, .btn-menu-back, .retro-toggle-btn, .btn-start').forEach(el => {
    el.addEventListener('mouseenter', () => {
      try { if (GameAudio && GameAudio.menuHover) GameAudio.menuHover(); } catch (_) {}
    });
  });

  // --- OPTIONS CONTROLS & SETTINGS ---
  const optMasterVol = document.getElementById('opt-master-vol');
  const optMasterVolVal = document.getElementById('opt-master-vol-val');
  if (optMasterVol) {
    const initVolPct = Math.round((GameAudio && typeof GameAudio.masterVolume === 'number' ? GameAudio.masterVolume : 1) * 100);
    optMasterVol.value = initVolPct;
    if (optMasterVolVal) optMasterVolVal.textContent = initVolPct + '%';
    if (GameAudio && GameAudio.syncMediaVolumes) GameAudio.syncMediaVolumes();
    optMasterVol.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      if (optMasterVolVal) optMasterVolVal.textContent = v + '%';
      if (GameAudio && GameAudio.setVolume) GameAudio.setVolume(v / 100);
    });
  }

  const optMuteBtn = document.getElementById('opt-mute-btn');
  if (optMuteBtn) {
    const initMuted = !!(GameAudio && GameAudio.muted);
    optMuteBtn.textContent = initMuted ? 'MUTED' : 'ON';
    optMuteBtn.classList.toggle('btn-off', initMuted);
    optMuteBtn.addEventListener('click', () => {
      const newMuted = !(GameAudio && GameAudio.muted);
      if (GameAudio && GameAudio.setMuted) GameAudio.setMuted(newMuted);
      optMuteBtn.textContent = newMuted ? 'MUTED' : 'ON';
      optMuteBtn.classList.toggle('btn-off', newMuted);
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  const optShaderBtn = document.getElementById('opt-shader-btn');
  function syncShaderUi() {
    if (optShaderBtn) optShaderBtn.textContent = retroPixelMode ? '90S PIXEL' : 'CRISP HD';
    if (btnGfx) btnGfx.innerHTML = (typeof GAME_ICONS !== 'undefined' ? GAME_ICONS.monitor + ' ' : '') + (retroPixelMode ? 'Shader: 90s Pixel' : 'Shader: Crisp HD');
  }
  syncShaderUi();
  if (optShaderBtn) {
    optShaderBtn.addEventListener('click', () => {
      retroPixelMode = !retroPixelMode;
      syncShaderUi();
      updateRendererSize();
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  const optCrtBtn = document.getElementById('opt-crt-btn');
  const crtOverlayEl = document.getElementById('crt-overlay');
  if (optCrtBtn) {
    optCrtBtn.addEventListener('click', () => {
      crtEnabled = !crtEnabled;
      optCrtBtn.textContent = crtEnabled ? 'ON' : 'OFF';
      optCrtBtn.classList.toggle('btn-off', !crtEnabled);
      if (crtOverlayEl) crtOverlayEl.style.display = crtEnabled ? '' : 'none';
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  const optShakeBtn = document.getElementById('opt-shake-btn');
  if (optShakeBtn) {
    optShakeBtn.addEventListener('click', () => {
      shakeSetting = (shakeSetting + 1) % 3;
      optShakeBtn.textContent = shakeLabels[shakeSetting];
      shakeMultiplier = shakeMults[shakeSetting];
      optShakeBtn.classList.toggle('btn-off', shakeSetting === 2);
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  const optMouseSens = document.getElementById('opt-mouse-sens');
  const optMouseSensVal = document.getElementById('opt-mouse-sens-val');
  if (optMouseSens) {
    optMouseSens.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      mouseSensMultiplier = v / 100;
      if (optMouseSensVal) optMouseSensVal.textContent = (v / 100).toFixed(1) + 'x';
    });
  }

  const optBrightness = document.getElementById('opt-brightness');
  const optBrightnessVal = document.getElementById('opt-brightness-val');
  let brightnessPct = (() => {
    try {
      const saved = parseInt(localStorage.getItem('form45_brightness') || '100', 10);
      return isNaN(saved) ? 100 : Math.max(85, Math.min(135, saved));
    } catch (_) {
      return 100;
    }
  })();

  function applyCanvasBrightness() {
    if (!canvas) return;
    const base = isMobileTouchDevice() ? 1.06 : 0.88;
    const val = (base * (brightnessPct / 100)).toFixed(3);
    canvas.style.filter = `brightness(${val})`;
    if (optBrightness) optBrightness.value = brightnessPct;
    if (optBrightnessVal) optBrightnessVal.textContent = `${brightnessPct}%`;
  }
  applyCanvasBrightness();

  if (optBrightness) {
    optBrightness.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      brightnessPct = isNaN(v) ? 100 : Math.max(85, Math.min(135, v));
      applyCanvasBrightness();
      try { localStorage.setItem('form45_brightness', String(brightnessPct)); } catch (_) {}
    });
  }

  const optSubsBtn = document.getElementById('opt-subs-btn');
  if (optSubsBtn) {
    optSubsBtn.addEventListener('click', () => {
      subtitlesEnabled = !subtitlesEnabled;
      optSubsBtn.textContent = subtitlesEnabled ? 'ON' : 'OFF';
      optSubsBtn.classList.toggle('btn-off', !subtitlesEnabled);
      if (!subtitlesEnabled) {
        if (ps1Subtitle) ps1Subtitle.style.display = 'none';
        if (monsterTauntSub) monsterTauntSub.style.display = 'none';
      }
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  const optSubLangBtn = document.getElementById('opt-sub-lang-btn');
  if (optSubLangBtn) {
    optSubLangBtn.textContent = subtitleLang;
    optSubLangBtn.addEventListener('click', () => {
      subtitleLang = subtitleLang === 'URDU' ? 'ENGLISH' : 'URDU';
      optSubLangBtn.textContent = subtitleLang;
      try { localStorage.setItem('form45_sub_lang', subtitleLang); } catch (_) {}
      try { GameAudio.menuSelect(); } catch (_) {}
    });
  }

  // --- IN-GAME HUD VISIBILITY TOGGLE ---
  const optHudBtn = document.getElementById('opt-hud-btn');
  let ingameHudVisible = true;
  try {
    const savedHud = localStorage.getItem('form45_hud_visible');
    if (savedHud === '0') ingameHudVisible = false;
  } catch (_) {}

  function syncHudVisibilityUi() {
    document.body.classList.toggle('hide-hud', !ingameHudVisible);
    if (optHudBtn) {
      optHudBtn.textContent = ingameHudVisible ? 'ON' : 'OFF';
      optHudBtn.classList.toggle('btn-off', !ingameHudVisible);
    }
  }
  syncHudVisibilityUi();

  function toggleIngameHud() {
    ingameHudVisible = !ingameHudVisible;
    syncHudVisibilityUi();
    try { localStorage.setItem('form45_hud_visible', ingameHudVisible ? '1' : '0'); } catch (_) {}
  }

  if (optHudBtn) {
    optHudBtn.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      toggleIngameHud();
    });
  }

  // --- SCREEN RECORDING CLIP TOGGLE ---
  const optRecordBtn = document.getElementById('opt-record-btn');
  const recIndicatorBtn = document.getElementById('rec-indicator-btn');
  let screenRecorder = null;
  let screenRecStream = null;
  let screenRecChunks = [];

  function syncRecordUi(isRec) {
    if (optRecordBtn) {
      optRecordBtn.textContent = isRec ? 'REC' : 'OFF';
      optRecordBtn.classList.toggle('btn-off', !isRec);
      optRecordBtn.style.color = isRec ? '#f87171' : '';
      optRecordBtn.style.textShadow = isRec ? '0 0 10px rgba(248,113,113,0.75)' : '';
    }
    if (recIndicatorBtn) {
      recIndicatorBtn.style.display = isRec ? 'block' : 'none';
    }
  }

  function stopScreenRecording() {
    if (screenRecorder && screenRecorder.state !== 'inactive') {
      try { screenRecorder.stop(); } catch (_) {}
    } else if (screenRecStream) {
      screenRecStream.getTracks().forEach(t => t.stop());
      screenRecStream = null;
      syncRecordUi(false);
    }
  }

  async function startScreenRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia || typeof MediaRecorder === 'undefined') {
      showToast('SCREEN RECORD NOT SUPPORTED');
      syncRecordUi(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 60, max: 60 } },
        audio: true,
        preferCurrentTab: true
      });
      screenRecStream = stream;
      screenRecChunks = [];

      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      const chosenMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime }) : new MediaRecorder(stream);
      screenRecorder = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) screenRecChunks.push(ev.data);
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || 'video/webm';
        const ext = type.includes('mp4') ? 'mp4' : 'webm';
        if (screenRecChunks.length > 0) {
          const blob = new Blob(screenRecChunks, { type });
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          a.href = blobUrl;
          a.download = `form45_clip_${stamp}.${ext}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          showToast('CLIP SAVED');
        }
        screenRecChunks = [];
        if (screenRecStream) {
          screenRecStream.getTracks().forEach(t => t.stop());
          screenRecStream = null;
        }
        screenRecorder = null;
        syncRecordUi(false);
      };

      const vTrack = stream.getVideoTracks()[0];
      if (vTrack) {
        vTrack.onended = () => stopScreenRecording();
      }

      recorder.start(250);
      syncRecordUi(true);
      showToast('RECORDING STARTED · F9 TO STOP');
    } catch (err) {
      // User cancelled share prompt or permission denied
      syncRecordUi(false);
    }
  }

  function toggleScreenRecording() {
    if (screenRecorder && screenRecorder.state !== 'inactive') {
      stopScreenRecording();
    } else {
      startScreenRecording();
    }
  }

  if (optRecordBtn) {
    optRecordBtn.addEventListener('click', () => {
      try { GameAudio.menuSelect(); } catch (_) {}
      toggleScreenRecording();
    });
  }
  if (recIndicatorBtn) {
    recIndicatorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      stopScreenRecording();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'F9') {
      e.preventDefault();
      toggleScreenRecording();
    } else if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.altKey && !e.metaKey && !e.repeat) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
        toggleIngameHud();
      }
    }
  });

  if (btnResetOptions) {
    btnResetOptions.addEventListener('click', () => {
      if (GameAudio) {
        if (GameAudio.setVolume) GameAudio.setVolume(1.0);
        if (GameAudio.setMuted) GameAudio.setMuted(false);
      }
      if (optMasterVol) optMasterVol.value = 100;
      if (optMasterVolVal) optMasterVolVal.textContent = '100%';
      if (optMuteBtn) {
        optMuteBtn.textContent = 'ON';
        optMuteBtn.classList.remove('btn-off');
      }

      retroPixelMode = false;
      syncShaderUi();
      updateRendererSize();

      crtEnabled = true;
      if (optCrtBtn) {
        optCrtBtn.textContent = 'ON';
        optCrtBtn.classList.remove('btn-off');
      }
      if (crtOverlayEl) crtOverlayEl.style.display = '';

      shakeSetting = 0;
      shakeMultiplier = 1.0;
      if (optShakeBtn) {
        optShakeBtn.textContent = shakeLabels[0];
        optShakeBtn.classList.remove('btn-off');
      }

      mouseSensMultiplier = 1.0;
      if (optMouseSens) optMouseSens.value = 100;
      if (optMouseSensVal) optMouseSensVal.textContent = '1.0x';

      brightnessPct = 100;
      applyCanvasBrightness();
      try { localStorage.setItem('form45_brightness', '100'); } catch (_) {}

      subtitlesEnabled = true;
      if (optSubsBtn) {
        optSubsBtn.textContent = 'ON';
        optSubsBtn.classList.remove('btn-off');
      }

      subtitleLang = 'URDU';
      if (optSubLangBtn) optSubLangBtn.textContent = 'URDU';
      try { localStorage.setItem('form45_sub_lang', 'URDU'); } catch (_) {}

      ingameHudVisible = true;
      syncHudVisibilityUi();
      try { localStorage.setItem('form45_hud_visible', '1'); } catch (_) {}

      stopScreenRecording();

      try { GameAudio.tone(440, 660, 0.15, 'sine', 0.15, 0); } catch (_) {}
    });
  }
  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) retryBtn.addEventListener('click', startShift);
  if (deathScreen) {
    deathScreen.addEventListener('click', () => {
      if (state === 'GAMEOVER') startShift();
    });
  }
  if (btnSkipCutscene) {
    btnSkipCutscene.addEventListener('click', finishWinModal);
  }
  document.getElementById('btn-mute-call').addEventListener('click', () => {
    if (!hasHeardAyeshaCall()) return;
    GameAudio.stopPhoneGuy();
    phoneBox.classList.add('hide');
  });

  btnCctv.addEventListener('click', () => toggleCctv());

  btnLeftDoor.addEventListener('click', toggleLeftDoor);
  btnRightDoor.addEventListener('click', toggleRightShutter);

  btnLeftLight.addEventListener('click', toggleLeftLight);
  btnRightLight.addEventListener('click', toggleRightLight);
  vpnBtn.addEventListener('click', () => {
    if (state !== 'PLAYING') return;
    if (vpnDisconnected) {
      showToast('SHARK CUT · GO TO CAM 10');
      if (GameAudio.sharkAlert) GameAudio.sharkAlert();
      else if (GameAudio.cctvBlip) GameAudio.cctvBlip();
    }
  });
  btnBrewChai.addEventListener('click', sendGateChai);

  const btnCctvFlash = document.getElementById('btn-cctv-flash');
  if (btnCctvFlash) {
    btnCctvFlash.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cctvOpen) toggleCctvFlashlight();
    });
  }

  if (btnPauseEl) btnPauseEl.addEventListener('click', () => pauseGame());
  if (btnResumeGameEl) btnResumeGameEl.addEventListener('click', () => resumeGame());
  if (btnRestartGameEl) {
    btnRestartGameEl.addEventListener('click', () => {
      resumeGame();
      startShift();
    });
  }
  if (btnPauseMainMenuEl) {
    btnPauseMainMenuEl.addEventListener('click', () => {
      resumeGame();
      try {
        if (GameAudio.stopAmbience) GameAudio.stopAmbience();
        if (GameAudio.stopPhoneGuy) GameAudio.stopPhoneGuy();
        if (GameAudio.stopScannerLoop) GameAudio.stopScannerLoop();
        if (GameAudio.stopHeartbeatLoop) GameAudio.stopHeartbeatLoop(0.05);
        if (GameAudio.stopKettleBoilLoop) GameAudio.stopKettleBoilLoop();
        if (GameAudio.stopDoorBanging) GameAudio.stopDoorBanging('all');
        if (GameAudio.stopEmergencyAlarm) GameAudio.stopEmergencyAlarm();
      } catch (_) {}
      returnToMainMenu();
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'PLAYING' && !isGamePaused) {
      pauseGame();
    }
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (isGamePaused) {
        resumeGame();
        return;
      }
      if (state === 'WIN_CUTSCENE') {
        finishWinModal();
        return;
      }
      if (isWirePuzzleOpen) {
        closeWirePuzzle();
        return;
      }
      if (isSharkPuzzleOpen) {
        closeSharkPuzzle();
        return;
      }
      if (state === 'PLAYING') {
        pauseGame();
        return;
      }
      if (howToPlayModal && !howToPlayModal.classList.contains('hide')) {
        howToPlayModal.classList.add('hide');
        menuModal.classList.remove('hide');
        try { GameAudio.menuSelect(); } catch (_) {}
        return;
      }
      if (optionsModal && !optionsModal.classList.contains('hide')) {
        optionsModal.classList.add('hide');
        menuModal.classList.remove('hide');
        try { GameAudio.menuSelect(); } catch (_) {}
        return;
      }
    }
    if (e.key === 'p' || e.key === 'P') {
      if (state === 'PLAYING' && !isWirePuzzleOpen && !isSharkPuzzleOpen) {
        e.preventDefault();
        togglePause();
        return;
      }
    }
    if (isGamePaused) return;
    if (state === 'GAMEOVER') {
      if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'r') {
        e.preventDefault();
        startShift();
        return;
      }
    }
    if (state !== 'PLAYING') return;
    switch (e.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        setLookDir(Math.max(-1, lookDir - 1));
        break;
      case 's':
      case 'arrowdown':
        if (lookDir === 0 && !cctvOpen && (holdingForm || formsInBox > 0)) {
          grabFormFromBox();
        } else {
          setLookDir(0);
        }
        break;
      case 'w':
        if (isPowerSabotaged || isWirePuzzleOpen) {
          handleRepairWiresAction();
          break;
        }
        if (lookDir === -1 && holdingForm && !isHoldingScan) {
          startHoldScan();
        }
        break;
      case 'x':
        if (lookDir === -1 && holdingForm && !isHoldingScan) {
          startHoldScan();
        }
        break;
      case 'd':
      case 'arrowright':
        setLookDir(Math.min(1, lookDir + 1));
        break;
      case ' ':
        e.preventDefault();
        toggleCctv();
        break;
      case 'f':
        // Flash mechanism removed entirely
        break;
      case 'control':
        // Flash mechanism removed entirely
        break;
      case '1':
        toggleLeftDoor();
        break;
      case '2':
        toggleRightShutter();
        break;
      case 'q':
        if (!e.repeat) toggleLeftLight();
        break;
      case 'e':
        if (cctvOpen && activeCamIdx === 9) {
          openSharkPuzzle();
          break;
        }
        if (cctvOpen && cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(activeCamIdx)) {
          handleCctvFormCollect(activeCamIdx);
          break;
        }
        if (!cctvOpen && lookDir === 0 && holdingForm && !isFormStamped && getCurrentLevelConfig().hasSealVerification) {
          if (!e.repeat && !isHoldingStamp) startHoldStamp();
          break;
        }
        if (!e.repeat) toggleRightLight();
        break;
      case 'z':
        if (!cctvOpen && holdingForm && !isFormStamped && getCurrentLevelConfig().hasSealVerification) {
          if (!e.repeat && !isHoldingStamp) startHoldStamp();
          break;
        }
        break;
      case 'r':
        if (cctvOpen && activeCamIdx === 9) {
          openSharkPuzzle();
        } else if (vpnDisconnected) {
          showToast('SHARK CUT · GO TO CAM 10');
          if (GameAudio.sharkAlert) GameAudio.sharkAlert();
        } else {
          showToast('WIFI ONLINE');
        }
        break;
      case 'c':
        if (cctvOpen) {
          if (activeCamIdx === 0) sendGateChai();
        } else if (lookDir === 1) {
          handleBrewKettleAction();
        }
        break;
      case 'h':
        if (equippedItem === 'HAMMER' && (lookDir === -1 || lookDir === 1)) {
          startHoldRepair(lookDir === -1 ? 'door' : 'window');
        } else {
          toggleHammerEquip();
        }
        break;
    }
  });

  window.addEventListener('keyup', e => {
    if (state !== 'PLAYING') return;
    const k = e.key.toLowerCase();
    if (k === 'control') {
      if (cctvOpen) {
        setCctvFlashlight(false);
      }
    } else if (k === 'w' || k === 'x') {
      if (isHoldingScan) {
        stopHoldScan(false);
      }
      if (isHoldingStamp) {
        stopHoldStamp(false);
      }
    } else if (k === 'h') {
      if (isHoldingRepair) {
        stopHoldRepair(false);
      }
    }
  });

  // --- MAIN ANIMATION & AI LOOP ---
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    if (isPortraitLocked || isGamePaused) {
      lastTime = now;
      return;
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const cctvFlashActiveNow = false;
    const gLocNow = GULLU_PATH[gulluStep];
    const wLocNow = WHITENER_PATH[whitenerStep];
    const isKhakiInCamNow = cctvOpen && (activeCamIdx === gLocNow || (activeCamIdx === 4 && (gLocNow === ZONE_KHAKI_PEEK || gLocNow === ZONE_KHAKI_DOOR)));
    const isBabuInCamNow = cctvOpen && (activeCamIdx === wLocNow || (activeCamIdx === 5 && (wLocNow === ZONE_BABU_PEEK || wLocNow === ZONE_BABU_WINDOW)));

    // Full-body rage animation: Natural chest & torso respiration heave, stable natural head scale
    if (gulluMesh && gulluMesh.userData) {
      const isKhakiShocked = (cctvShock.active && (cctvShock.monster === 'gullu' || cctvShock.monster === 'both')) || (cctvFlashActiveNow && isKhakiInCamNow);
      if (isKhakiShocked) {
        if (gulluMesh.userData.setSkin && gulluMesh.userData.currentSkin !== 'shocked') {
          gulluMesh.userData.setSkin('shocked');
        }
      } else if (gulluEnraged) {
        if (gulluMesh.userData.setSkin) {
          const rageFrame = Math.floor(now * 0.0035) % 3;
          gulluMesh.userData.setSkin('enraged', rageFrame);
        }
        const gPulseCycle = (now * 0.0068) % (Math.PI * 2);
        const gPulse = Math.pow(Math.sin(gPulseCycle), 2.0) * 0.18 + Math.sin(now * 0.0136) * 0.03;
        if (gulluMesh.userData.head) {
          // Stable natural head scale (no popping), rides the torso breathing height
          gulluMesh.userData.head.scale.set(1.0, 1.0, 1.0);
          gulluMesh.userData.head.position.y = 2.45 + gPulse * 0.025;
        }
        if (gulluMesh.userData.torso) {
          // Broad commando chest heaves outward naturally along Z and X
          gulluMesh.userData.torso.scale.set(1.0 + gPulse * 0.12, 1.0 + gPulse * 0.05, 1.0 + gPulse * 0.16);
          gulluMesh.userData.torso.position.y = 1.48 + gPulse * 0.028;
        }
      } else {
        if (gulluMesh.userData.setSkin && gulluMesh.userData.currentSkin === 'shocked') {
          gulluMesh.userData.setSkin('default');
        }
        if (gulluMesh.userData.head && gulluMesh.userData.head.position.y !== 2.45) {
          gulluMesh.userData.head.scale.set(1.0, 1.0, 1.0);
          gulluMesh.userData.head.position.set(0, 2.45, 0.03);
          if (gulluMesh.userData.torso) {
            gulluMesh.userData.torso.scale.set(1.0, 1.0, 1.0);
            gulluMesh.userData.torso.position.set(0, 1.48, 0);
          }
        }
      }
    }
    if (whitenerMesh && whitenerMesh.userData) {
      const isBabuShocked = (cctvShock.active && (cctvShock.monster === 'whitener' || cctvShock.monster === 'both')) || (cctvFlashActiveNow && isBabuInCamNow);
      if (isBabuShocked) {
        if (whitenerMesh.userData.setSkin && whitenerMesh.userData.currentSkin !== 'shocked') {
          whitenerMesh.userData.setSkin('shocked');
        }
      } else if (whitenerEnraged) {
        if (whitenerMesh.userData.setSkin) {
          const rageFrame = Math.floor(now * 0.0035) % 3;
          whitenerMesh.userData.setSkin('enraged', rageFrame);
        }
        const wPulseCycle = (now * 0.0075) % (Math.PI * 2);
        const wPulse = Math.pow(Math.sin(wPulseCycle), 2.0) * 0.20 + Math.cos(now * 0.015) * 0.04;
        if (whitenerMesh.userData.head) {
          // Stable natural head scale (no popping), rides the torso breathing height
          whitenerMesh.userData.head.scale.set(1.0, 1.0, 1.0);
          whitenerMesh.userData.head.position.y = 2.45 + wPulse * 0.022;
        }
        if (whitenerMesh.userData.torso) {
          // Babu's government belly heaves naturally along Z and X
          whitenerMesh.userData.torso.scale.set(1.0 + wPulse * 0.14, 1.0 + wPulse * 0.04, 1.0 + wPulse * 0.18);
          whitenerMesh.userData.torso.position.y = 1.48 + wPulse * 0.025;
        }
      } else {
        if (whitenerMesh.userData.setSkin && whitenerMesh.userData.currentSkin === 'shocked') {
          whitenerMesh.userData.setSkin('default');
        }
        if (whitenerMesh.userData.head && whitenerMesh.userData.head.position.y !== 2.45) {
          whitenerMesh.userData.head.scale.set(1.0, 1.0, 1.0);
          whitenerMesh.userData.head.position.set(0, 2.45, 0.03);
          if (whitenerMesh.userData.torso) {
            whitenerMesh.userData.torso.scale.set(1.0, 1.0, 1.0);
            whitenerMesh.userData.torso.position.set(0, 1.48, 0);
          }
        }
      }
    }

    if (cctvFlashStallCooldown > 0) cctvFlashStallCooldown = Math.max(0, cctvFlashStallCooldown - dt);
    if (cctvOpen && cctvFlashlightOn && upsBattery > 0 && cctvFlashStallCooldown <= 0) {
      triggerCctvFlashStall();
    }

    // --- CCTV FLASH SHOCKED STUN & HORROR BEAM RETREAT SEQUENCING ---
    if (cctvShock && cctvShock.active) {
      cctvShock.timer -= dt;

      // Subtle high-frequency shudder/tremble while frozen stunned in front of camera
      const shiverX = (Math.random() - 0.5) * 0.035;
      const shiverZ = (Math.random() - 0.5) * 0.035;
      if ((cctvShock.monster === 'gullu' || cctvShock.monster === 'both') && gulluMesh) {
        gulluMesh.position.x += shiverX;
        gulluMesh.position.z += shiverZ;
      }
      if ((cctvShock.monster === 'whitener' || cctvShock.monster === 'both') && whitenerMesh) {
        whitenerMesh.position.x += shiverX;
        whitenerMesh.position.z += shiverZ;
      }

      // After 1.15 seconds of stunned freeze under the horror beam, monster retreats!
      if (cctvShock.timer <= 0) {
        cctvShock.active = false;
        if (cctvShock.monster === 'both') {
          GULLU_PATH[gulluStep] = cctvShock.retreatZoneG;
          gulluSpotIdx = cctvShock.retreatSpotIdxG;
          if (gulluMesh && gulluMesh.userData && gulluMesh.userData.setSkin) {
            gulluMesh.userData.setSkin(gulluEnraged ? 'enraged' : 'default');
          }
          WHITENER_PATH[whitenerStep] = cctvShock.retreatZoneW;
          whitenerSpotIdx = cctvShock.retreatSpotIdxW;
          if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.setSkin) {
            whitenerMesh.userData.setSkin(whitenerEnraged ? 'enraged' : 'default');
          }
        } else if (cctvShock.monster === 'gullu') {
          GULLU_PATH[gulluStep] = cctvShock.retreatZone;
          gulluSpotIdx = cctvShock.retreatSpotIdx;
          if (gulluMesh && gulluMesh.userData && gulluMesh.userData.setSkin) {
            gulluMesh.userData.setSkin(gulluEnraged ? 'enraged' : 'default');
          }
        } else if (cctvShock.monster === 'whitener') {
          WHITENER_PATH[whitenerStep] = cctvShock.retreatZone;
          whitenerSpotIdx = cctvShock.retreatSpotIdx;
          if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.setSkin) {
            whitenerMesh.userData.setSkin(whitenerEnraged ? 'enraged' : 'default');
          }
        }
        updateIntruderPositions();
        flashStatic(0.65, 220);
        GameAudio.whoosh();
        if (cctvShock.toastMsg) showToast(cctvShock.toastMsg);
        if (cctvShock.subMsg) showPS1Subtitle(cctvShock.subMsg, cctvShock.subTime || 3600);
      }
    }

    // Spin Ceiling Fan, Desk Fan & Drift Dust Motes
    fanGroup.rotation.y += dt * (upsBattery > 0 && state === 'PLAYING' ? 5.5 : 0.4);
    deskFanBlades.rotation.z += dt * (upsBattery > 0 && state === 'PLAYING' ? 22 : 0);
    dustParticles.rotation.y += dt * 0.04;

    // Form-45 Pick-up 3D Feedback Animations
    if (ballotBoxBounce > 0) {
      ballotBoxBounce = Math.max(0, ballotBoxBounce - dt * 3.2);
      if (ballotBoxMesh) {
        const bump = Math.sin(ballotBoxBounce * Math.PI) * 0.035;
        ballotBoxMesh.position.y = 1.52 + bump;
        ballotBoxMesh.scale.set(1 + bump * 0.2, 1 + bump * 0.3, 1 + bump * 0.2);
      }
    } else if (ballotBoxMesh && ballotBoxMesh.position.y !== 1.52) {
      ballotBoxMesh.position.y = 1.52;
      ballotBoxMesh.scale.set(1, 1, 1);
    }
    if (cctvOpen) {
      if (handForm) handForm.visible = false;
      if (handHammer) handHammer.visible = false;
      handFormBreathTimer = 0;
    } else {
      if (handHammer && !isHoldingRepair) {
        handHammer.visible = (equippedItem === 'HAMMER');
      }
      if (handForm) {
        handForm.visible = (equippedItem === 'FORM' || holdingForm);
      }
    }
    // Immersive Breathing & Natural Hand Sway Animation when holding Form-45 sheet
    if (!cctvOpen && handForm && handForm.visible) {
      handFormBreathTimer += dt;
      // Faster, tense breathing if monster is assault-banging or enraged
      const isTense = (gulluEnraged || whitenerEnraged || (typeof gulluAssault !== 'undefined' && gulluAssault && gulluAssault.active) || (typeof whitenerAssault !== 'undefined' && whitenerAssault && whitenerAssault.active));
      const breathSpeed = isTense ? 3.0 : 1.7;
      const breathAmp = isTense ? 1.35 : 1.0;

      // Multi-harmonic organic breathing rise/fall (inhale/exhale)
      const phase = handFormBreathTimer * breathSpeed;
      const breathWave = Math.sin(phase) + 0.18 * Math.sin(phase * 2.0 + 0.4);
      const breathY = breathWave * 0.015 * breathAmp;
      const breathZ = Math.cos(phase) * 0.008 * breathAmp;
      // Gentle figure-8 lateral wrist sway
      const swayX = Math.sin(phase * 0.55) * 0.007 * breathAmp;

      // Subtle rotational breathing rocking (pitch, roll, yaw)
      const rotX = Math.sin(phase - 0.25) * 0.028 * breathAmp;
      const rotZ = Math.cos(phase * 0.55) * 0.018 * breathAmp;
      const rotY = Math.sin(phase * 0.55 + 0.6) * 0.012 * breathAmp;

      // Dynamic head-turn inertia so the paper lags & tilts naturally instead of feeling glued
      const panVel = (targetYaw - currentYaw);
      const lagX = Math.max(-0.08, Math.min(0.08, panVel * 0.09));
      const lagRoll = Math.max(-0.14, Math.min(0.14, -panVel * 0.16));

      // Form-45 held in player's right hand with natural head-pan clearance
      const formPanOffsetX = currentYaw * 0.38;
      const formPanOffsetY = Math.abs(currentYaw) * 0.03;

      if (handFormAnimTimer > 0) {
        handFormAnimTimer = Math.max(0, handFormAnimTimer - dt);
        const p = 1 - (handFormAnimTimer / 0.35); // 0 -> 1
        const ease = Math.sin(p * Math.PI / 2);
        handForm.position.set(
          (0.24 + formPanOffsetX) + (swayX + lagX) * ease,
          -0.58 + ease * (0.42 + breathY - formPanOffsetY),
          -0.52 + breathZ * ease
        );
        handForm.rotation.set(
          -0.5 + ease * (0.25 + rotX),
          -0.22 - currentYaw * 0.25 + rotY * ease,
          0.12 + (1 - ease) * 0.25 + (rotZ + lagRoll) * ease
        );
      } else {
        // Continuous organic breathing idle in right hand with side-table clearance
        handForm.position.set(
          0.24 + swayX + lagX + formPanOffsetX,
          -0.16 + breathY - formPanOffsetY,
          -0.52 + breathZ
        );
        handForm.rotation.set(
          -0.25 + rotX,
          -0.22 - currentYaw * 0.25 + rotY,
          0.12 + rotZ + lagRoll
        );
      }
    } else {
      handFormBreathTimer = 0;
    }

    // First-person ECP Brass Stamp slam & rebound animation
    if (handStampAnimTimer > 0) {
      handStampAnimTimer = Math.max(0, handStampAnimTimer - dt);
      const totalDur = 0.35;
      const progress = 1.0 - (handStampAnimTimer / totalDur); // 0.0 -> 1.0
      if (handStamp) {
        handStamp.visible = !cctvOpen;
        let slamY = 0;
        let slamZ = 0;
        if (progress < 0.45) {
          const p = progress / 0.45;
          slamY = 0.22 - p * 0.32;
          slamZ = -0.38 - p * 0.10;
        } else {
          const p = (progress - 0.45) / 0.55;
          slamY = -0.10 + p * 0.32;
          slamZ = -0.48 + p * 0.10;
        }
        // First-person ECP Brass Stamp slam down onto right-held Form-45
        const stampPanX = currentYaw * 0.38;
        const stampPanY = Math.abs(currentYaw) * 0.03;
        handStamp.position.set(0.19 + stampPanX, slamY - stampPanY, slamZ);
        handStamp.rotation.set(-0.15, -0.12 - currentYaw * 0.25, 0.08);
      }
    } else {
      if (handStamp) handStamp.visible = false;
    }

    // Desk Stamp tactile spring press
    if (deskStampBounce > 0) {
      deskStampBounce = Math.max(0, deskStampBounce - dt * 5.0);
      if (stampBody) {
        stampBody.position.y = -Math.sin(deskStampBounce * Math.PI) * 0.035;
      }
    }

    if (vigoMesh) {
      const strobePhase = Math.floor(now / 130) % 2 === 0;
      vigoMesh.userData.redStrobe.color.setHex(strobePhase ? 0xff1111 : 0x3b0707);
      vigoMesh.userData.blueStrobe.color.setHex(strobePhase ? 0x1e3a8a : 0x3b82f6);
    }

    // Pulse angry red lights on enraged intruders
    if (gulluEnraged && gulluMesh && gulluMesh.userData && gulluMesh.userData.angryLight) {
      gulluMesh.userData.angryLight.intensity = 4.2 + Math.sin(now * 0.035) * 1.8;
    }
    if (whitenerEnraged && whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.angryLight) {
      whitenerMesh.userData.angryLight.intensity = 4.2 + Math.cos(now * 0.035) * 1.8;
    }

    // Menacing Police Lights glowing outside down the road indicating the Black Vigo's lurking presence
    if (policeStrobeRed && policeStrobeBlue) {
      const cycle = (now * 0.0075) % (Math.PI * 2);
      const isRed = Math.sin(cycle) > 0.12;
      const isBlue = Math.sin(cycle) < -0.12;
      const flutter = (Math.sin(now * 0.048) > 0.1) ? 1.0 : 0.22;

      policeStrobeRed.intensity = isRed ? (4.2 * flutter) : 0;
      policeStrobeBlue.intensity = isBlue ? (4.2 * flutter) : 0;
    }

    // --- SPRING-PHYSICS HINGED LEFT IRON DOOR + MULTI-STAGE KUNDI BOLT LATCH (Mirrored on Left Jamb) ---
    if (typeof animate._doorAngle !== 'number') {
      animate._doorAngle = -1.32;
      animate._doorVel = 0;
      animate._kundiProgress = 0; // 0 = unbolted, 1 = bolted
    }
    const targetDoorAngle = leftDoorClosed ? 0.0 : -1.32;
    // If opening, wait briefly for Kundi bolt to unlatch before swinging door
    const canSwingDoor = leftDoorClosed || animate._kundiProgress < 0.35;
    if (canSwingDoor) {
      const stiffness = leftDoorClosed ? 190 : 95;
      const damping = leftDoorClosed ? 16 : 12;
      const force = (targetDoorAngle - animate._doorAngle) * stiffness;
      animate._doorVel += force * dt;
      animate._doorVel *= Math.exp(-damping * dt);
      animate._doorAngle += animate._doorVel * dt;

      // Hard doorframe stop with metallic rebound bounce when slamming shut!
      if (animate._doorAngle > 0) {
        animate._doorAngle = 0;
        animate._doorVel = -animate._doorVel * 0.32;
      } else if (animate._doorAngle < -1.38) {
        animate._doorAngle = -1.38;
        animate._doorVel = -animate._doorVel * 0.25;
      }
    }

    // Slide the 3D Iron Kundi Bolt & Drop Handle once door is shut (or retract first when opening)
    const targetKundi = (leftDoorClosed && Math.abs(animate._doorAngle) < 0.14) ? 1.0 : 0.0;
    animate._kundiProgress += (targetKundi - animate._kundiProgress) * Math.min(1, dt * 22);

    const doorDmg = Math.max(0, (100 - doorHealth) / 100);
    const winDmg = Math.max(0, (100 - windowHealth) / 100);

    let doorRattle = 0;
    if (animate._leftShake > 0) {
      animate._leftShake = Math.max(0, animate._leftShake - dt);
      // Violent inward hinge rattle against the Kundi latch when Gullu pounds!
      const shakeAmp = 0.085 * (1.0 + doorDmg * 1.6);
      doorRattle = -(Math.abs(Math.sin(now * 0.095)) * shakeAmp + Math.sin(now * 0.16) * 0.025);
    }
    // Structural stress deformation: hinges sag down & panel bulges inward as health drops
    const stressTremor = (leftDoorClosed && doorDmg > 0.45) ? Math.sin(now * 0.015) * (doorDmg - 0.45) * 0.012 : 0;
    leftDoorMesh.rotation.y = animate._doorAngle + doorRattle + stressTremor;
    leftDoorMesh.position.y = leftDoorClosed ? (-doorDmg * 0.018) : 0; // Natural vertical hinge droop
    leftDoorMesh.rotation.z = 0; // Locked in planar door frame to prevent wall clipping
    leftDoorMesh.rotation.x = 0;

    if (leftDoorMesh.userData && leftDoorMesh.userData.kundiBolt) {
      const { kundiBolt, kundiHandle } = leftDoorMesh.userData;
      const boltJitter = (animate._leftShake > 0 ? Math.sin(now * 0.2) * 0.035 : 0) + (doorDmg > 0.4 ? Math.sin(now * 0.05) * 0.008 : 0);
      kundiBolt.position.z = -1.46 - animate._kundiProgress * 0.30 - boltJitter;
      kundiBolt.rotation.x = doorDmg * 0.16;
      kundiBolt.rotation.y = doorDmg * 0.08;
      // Rotate handle up when sliding, drop down vertically when locked
      kundiHandle.rotation.z = (1 - animate._kundiProgress) * 1.15;
    }

    // --- SPRING-PHYSICS TWIN HINGED WOODEN WINDOW SHUTTERS + CHITKANI TOWER BOLT ---
    if (typeof animate._shutterL !== 'number') {
      animate._shutterL = 1.42;
      animate._shutterR = 1.42;
      animate._shutterVelL = 0;
      animate._shutterVelR = 0;
      animate._chitkaniProgress = 0;
    }
    const targetShutter = rightShutterClosed ? 0.0 : 1.42;
    const canSwingShutter = rightShutterClosed || animate._chitkaniProgress < 0.35;
    if (canSwingShutter) {
      // Left leaf swings slightly faster than right leaf for authentic two-leaf clack!
      const stiffL = rightShutterClosed ? 210 : 105;
      const stiffR = rightShutterClosed ? 175 : 92;
      const damp = rightShutterClosed ? 15 : 11;

      animate._shutterVelL += (targetShutter - animate._shutterL) * stiffL * dt;
      animate._shutterVelL *= Math.exp(-damp * dt);
      animate._shutterL += animate._shutterVelL * dt;
      if (animate._shutterL < 0) {
        animate._shutterL = 0;
        animate._shutterVelL = -animate._shutterVelL * 0.34;
      }

      animate._shutterVelR += (targetShutter - animate._shutterR) * stiffR * dt;
      animate._shutterVelR *= Math.exp(-damp * dt);
      animate._shutterR += animate._shutterVelR * dt;
      if (animate._shutterR < 0) {
        animate._shutterR = 0;
        animate._shutterVelR = -animate._shutterVelR * 0.34;
      }
    }

    const targetChitkani = (rightShutterClosed && animate._shutterL < 0.12 && animate._shutterR < 0.12) ? 1.0 : 0.0;
    animate._chitkaniProgress += (targetChitkani - animate._chitkaniProgress) * Math.min(1, dt * 24);

    let shutterRattle = 0;
    if (animate._rightShake > 0) {
      animate._rightShake = Math.max(0, animate._rightShake - dt);
      const shakeAmp = 0.09 * (1.0 + winDmg * 1.6);
      shutterRattle = Math.abs(Math.sin(now * 0.095)) * shakeAmp + Math.cos(now * 0.15) * 0.03;
    }

    if (rightShutterMesh.userData && rightShutterMesh.userData.leftLeafPivot) {
      const { leftLeafPivot, rightLeafPivot, chitkaniBolt } = rightShutterMesh.userData;
      // Leaves buckle apart at center seam when damaged, revealing outside darkness!
      const seamGap = rightShutterClosed ? (winDmg * 0.085) : 0;
      const leafSag = rightShutterClosed ? (winDmg * 0.055) : 0;
      leftLeafPivot.rotation.y = -(animate._shutterL + shutterRattle + seamGap);
      leftLeafPivot.rotation.x = rightShutterClosed ? (winDmg * 0.025) : 0;
      rightLeafPivot.rotation.y = animate._shutterR + shutterRattle * 0.9 + seamGap;
      rightLeafPivot.rotation.z = -leafSag;
      chitkaniBolt.position.y = 0.42 + animate._chitkaniProgress * 0.46;
      chitkaniBolt.rotation.z = rightShutterClosed ? (winDmg * 0.18) : 0;
    }

    updateDebris(dt);

    // Old Government School Fluorescent Tube Flicker & Brownout Engine (Q & E)
    // Left Light (Q):
    if (leftLightOn && !cctvOpen && upsBattery > 0) {
      if (leftFlickerDropTimer > 0) {
        leftFlickerDropTimer -= dt;
        if (leftFlickerDropTimer <= 0) {
          isLeftLightDarkNow = false;
          // 35% chance of rapid double-blink stutter (0.06s-0.10s interval), otherwise next stutter in 0.35s - 0.85s
          const isDouble = Math.random() < 0.35;
          leftFlickerNext = isDouble ? (0.06 + Math.random() * 0.06) : (0.35 + Math.random() * 0.50);
          if (GameAudio && GameAudio.tubeFlickerBuzz) GameAudio.tubeFlickerBuzz(-0.65);
        }
      } else {
        leftFlickerNext -= dt;
        if (leftFlickerNext <= 0) {
          // Dramatic, clearly visible blackout drop (0.14s to 0.28s)
          leftFlickerDropTimer = 0.14 + Math.random() * 0.14;
          isLeftLightDarkNow = true;
          if (GameAudio && GameAudio.tubeFlickerBuzz) GameAudio.tubeFlickerBuzz(-0.65);
        }
      }
    } else {
      leftFlickerDropTimer = 0;
      isLeftLightDarkNow = false;
      leftFlickerNext = 0.16 + Math.random() * 0.16;
    }

    // Right Light (E):
    if (rightLightOn && !cctvOpen && upsBattery > 0) {
      if (rightFlickerDropTimer > 0) {
        rightFlickerDropTimer -= dt;
        if (rightFlickerDropTimer <= 0) {
          isRightLightDarkNow = false;
          const isDouble = Math.random() < 0.35;
          rightFlickerNext = isDouble ? (0.06 + Math.random() * 0.06) : (0.35 + Math.random() * 0.50);
          if (GameAudio && GameAudio.tubeFlickerBuzz) GameAudio.tubeFlickerBuzz(0.65);
        }
      } else {
        rightFlickerNext -= dt;
        if (rightFlickerNext <= 0) {
          rightFlickerDropTimer = 0.14 + Math.random() * 0.14;
          isRightLightDarkNow = true;
          if (GameAudio && GameAudio.tubeFlickerBuzz) GameAudio.tubeFlickerBuzz(0.65);
        }
      }
    } else {
      rightFlickerDropTimer = 0;
      isRightLightDarkNow = false;
      rightFlickerNext = 0.16 + Math.random() * 0.16;
    }

    // Realistic continuous fluorescent mains buzz and light fluctuation (jitter)
    const leftFlickerJitter = (0.86 + Math.sin(now * 0.055) * 0.08 + (Math.random() - 0.5) * 0.22);
    const rightFlickerJitter = (0.86 + Math.cos(now * 0.055) * 0.08 + (Math.random() - 0.5) * 0.22);
    leftHallLight.intensity = (leftLightOn && !isLeftLightDarkNow && !cctvOpen && upsBattery > 0) ? (4.5 * leftFlickerJitter) : 0;
    rightWindowLight.intensity = (rightLightOn && !isRightLightDarkNow && !cctvOpen && upsBattery > 0) ? (4.5 * rightFlickerJitter) : 0;

    // --- 3D HUMANOID WALKING, LOBBY PILLAR STEP-OUT PEEKING & CCTV PATROL ANIMATIONS ---
    function setLimbPose(mesh, walkPhase, strideAmt, sideStepL = 0, sideStepR = 0, armRaiseR = -0.82, armRaiseL = -0.18, torsoLeanX = 0) {
      if (!mesh || !mesh.userData) return;
      const { legL, legR, armL, armR, torso, daman, head } = mesh.userData;
      const isWalking = (strideAmt > 0.001);
      const s = isWalking ? Math.sin(walkPhase) : 0;
      const c = isWalking ? Math.cos(walkPhase) : 1;

      if (legL) {
        legL.rotation.x = s * strideAmt;
        legL.rotation.z = sideStepL + (isWalking ? Math.abs(c) * 0.04 : 0);
      }
      if (legR) {
        legR.rotation.x = -s * strideAmt;
        legR.rotation.z = sideStepR - (isWalking ? Math.abs(c) * 0.04 : 0);
      }
      if (armL) {
        armL.rotation.x = armRaiseL - (isWalking ? s * (strideAmt * 0.85) : 0);
        armL.rotation.z = isWalking ? Math.abs(s) * 0.08 : 0.02;
      }
      if (armR) {
        armR.rotation.x = armRaiseR + (isWalking ? s * (strideAmt * 0.65) : 0);
        armR.rotation.z = isWalking ? -Math.abs(s) * 0.08 : -0.02;
      }
      if (torso) {
        torso.rotation.set(torsoLeanX, isWalking ? -s * 0.04 : 0, 0);
      }
      if (daman) {
        daman.rotation.set(isWalking ? Math.abs(s) * 0.06 : 0, 0, isWalking ? -s * 0.03 : 0);
      }
    }

    if (state === 'PLAYING') {
      const gLoc = GULLU_PATH[gulluStep];
      const wLoc = WHITENER_PATH[whitenerStep];

      // PEEK WINDOW CREEPY FAINT MOONLIGHT & VOID BLACKNESS:
      // 1. When Khaki or Babu is ABSENT, the window aperture is a 100% PITCH-BLACK VOID (no background wall, light or bleed).
      // 2. When they ARE peeking, the aperture void drops, revealing their creepy faint silhouette and face staring
      //    directly through the bars under cold, eerie pale moonlight (even with lights OFF)!
      // 3. When Hall Light (Q) / Yard Light (E) is pulsed, full bright sodium beam confirms the suspicion and rolls stun!
      const isKhakiPeeking = (gLoc === ZONE_KHAKI_PEEK || gulluRageTimer > 0);
      const isLeftBeamActive = (leftLightOn && !isLeftLightDarkNow && !cctvOpen && upsBattery > 0);
      if (leftHallLight) {
        leftHallLight.color.setHex(0xffe6a3);
        leftHallLight.intensity = isLeftBeamActive ? (6.0 * leftFlickerJitter) : 0;
      }
      if (leftPeekVoidMesh) {
        leftPeekVoidMesh.visible = !isLeftBeamActive;
      }
      if (leftPeekBackdrop) {
        leftPeekBackdrop.visible = (!cctvOpen && isKhakiPeeking && !isLeftBeamActive);
      }
      if (leftPeekMoonlight) {
        leftPeekMoonlight.intensity = 0;
      }
      if (leftPeekGrill) {
        leftPeekGrill.visible = isLeftBeamActive || (cctvOpen && activeCamIdx === 4);
      }
      if (isKhakiPeeking) {
        applyMonsterLighting(gulluMesh, isLeftBeamActive ? 'flashed' : 'dark_lurking');
      }

      const isBabuPeeking = (wLoc === ZONE_BABU_PEEK || whitenerRageTimer > 0);
      const isRightBeamActive = (rightLightOn && !isRightLightDarkNow && !cctvOpen && upsBattery > 0);
      if (rightWindowLight) {
        rightWindowLight.color.setHex(0xffe6a3);
        rightWindowLight.intensity = isRightBeamActive ? (6.0 * rightFlickerJitter) : 0;
      }
      if (rightPeekVoidMesh) {
        rightPeekVoidMesh.visible = !isRightBeamActive;
      }
      if (rightPeekBackdrop) {
        rightPeekBackdrop.visible = (!cctvOpen && isBabuPeeking && !isRightBeamActive);
      }
      if (rightPeekMoonlight) {
        rightPeekMoonlight.intensity = 0;
      }
      if (rightPeekGrill) {
        rightPeekGrill.visible = isRightBeamActive || (cctvOpen && activeCamIdx === 5);
      }
      if (isBabuPeeking) {
        applyMonsterLighting(whitenerMesh, isRightBeamActive ? 'flashed' : 'dark_lurking');
      }

      if (!khakiActive) {
        if (gulluMesh) gulluMesh.visible = false;
      } else {
      if (gulluDuckTimer > 0) gulluDuckTimer = Math.max(0, gulluDuckTimer - dt);

      if (gulluRageTimer > 0) {
        gulluRageTimer = Math.max(0, gulluRageTimer - dt);
        setHumanoidPeekMode(gulluMesh, true);
        gulluMesh.position.set(-4.95, -0.74, -2.56);
        gulluMesh.scale.set(1.15, 1.15, 1.15);
        gulluMesh.rotation.set(0, cctvOpen ? Math.PI / 2 : 1.09, 0);

        // Head convulses with analog-horror rage spasms right in front of player
        if (gulluMesh.userData.head) {
          const jitterH = (Math.random() - 0.5) * 0.18;
          gulluMesh.userData.head.rotation.set(0.12 + Math.sin(now * 0.09) * 0.14, Math.cos(now * 0.08) * 0.12, jitterH);
        }

        // Violent high-speed 20Hz red strobe
        if (gulluMesh.userData.angryLight) {
          gulluMesh.userData.angryLight.intensity = (Math.floor(now / 50) % 2 === 0) ? 6.8 : 1.4;
        }
        animate._leftShake = Math.max(animate._leftShake, 0.70);

        if (gulluRageTimer <= 0) {
          setHumanoidPeekMode(gulluMesh, false);
          // Launch into the furious heavy sprint towards Left Door!
          gulluWait = 0;
          gulluStep++;
          GULLU_PATH[gulluStep] = ZONE_KHAKI_DOOR;
          gulluSpotIdx = 0;
          gulluAtDoorTime = 0;

          const gDestX = leftDoorClosed ? -4.80 : -4.55;
          const gDestY = leftDoorClosed ? -0.18 : -0.06;
          gulluWalkAnim = {
            fromX: -4.56,
            fromY: -0.80,
            fromZ: -2.46,
            toX: gDestX,
            toY: gDestY,
            toZ: 0.05,
            t: 0,
            dur: 0.55, // Heavy 0.55s sprint!
            yaw: Math.PI / 2,
            isSprint: true
          };

          GameAudio.footstep(-0.85);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(-0.88); }, 110);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(-0.90); }, 220);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(-0.92); }, 330);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(-0.94); }, 440);

          gulluAssault = initAssaultProfile(doorHealth, true, true);
          setTimeout(() => { if (rageVignette) rageVignette.classList.remove('on'); }, 700);
          updateIntruderPositions();
        }
      } else if (gulluWalkAnim) {
        // Active 3D Walking Transition (Walking to Small Peek Window OR Sprinting to Main Left Door!)
        setHumanoidPeekMode(gulluMesh, gLoc === ZONE_KHAKI_PEEK);
        setHumanoidLurkingVoid(gulluMesh, false);
        gulluMesh.visible = true;
        gulluWalkAnim.t += dt;
        const p = Math.min(1, gulluWalkAnim.t / gulluWalkAnim.dur);
        const isSprint = !!gulluWalkAnim.isSprint;
        const walkPhase = now * (isSprint ? 0.038 : 0.017);
        const fromY = gulluWalkAnim.fromY ?? -0.05;
        const toY = gulluWalkAnim.toY ?? -0.05;
        gulluMesh.position.x = gulluWalkAnim.fromX + (gulluWalkAnim.toX - gulluWalkAnim.fromX) * p;
        gulluMesh.position.z = gulluWalkAnim.fromZ + (gulluWalkAnim.toZ - gulluWalkAnim.fromZ) * p;
        gulluMesh.position.y = fromY + (toY - fromY) * p + Math.abs(Math.sin(walkPhase)) * (isSprint ? 0.10 : 0.07);
        gulluMesh.rotation.set(0, gulluWalkAnim.yaw, Math.sin(walkPhase) * (isSprint ? 0.08 : 0.04));

        if (isSprint) {
          // Violent, aggressive military sprint! High knees, aggressive forward lean, pumping arms
          setLimbPose(gulluMesh, walkPhase, 1.25, 0.05, -0.05, -1.55, -1.45, 0.42);
          animate._leftShake = Math.max(animate._leftShake, 0.95);
          if (gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.set(0.18 + Math.sin(walkPhase * 2) * 0.08, (Math.random() - 0.5) * 0.08, 0);
          }
        } else {
          // Deliberate, tactical stalking walk
          setLimbPose(gulluMesh, walkPhase, 0.65, 0.02, -0.02, -0.85, -0.35, 0.12);
          if (gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.set(0.06 + Math.sin(now * 0.003) * 0.04, Math.sin(now * 0.002) * 0.12, 0);
          }
        }

        if (p >= 1) {
          gulluWalkAnim = null;
          setLimbPose(gulluMesh, 0, 0, 0, 0, 0, 0, 0);
          if (isSprint) {
            // Massive physical collision into the door on arrival!
            animate._leftShake = 1.45;
            triggerImpactSlam('door', 'heavy');
            spawnDebrisBurst('door', 'heavy', { x: -4.16, y: 1.5, z: 0.0 });
            // Organic footstep / rustle arrival (door bang plays strictly during assault strikes!)
            GameAudio.footstep(-0.85);
          }
          updateIntruderPositions();
        }
      } else if (gLoc === ZONE_KHAKI_PEEK) {
        // STAGE 1 SMALL LEFT PEEK WINDOW: Full body standing naturally and strictly behind exterior security bars!
        setHumanoidPeekMode(gulluMesh, true);
        const isKhakiLit = (cctvOpen && activeCamIdx === 4) || (leftLightOn && !isLeftLightDarkNow && !cctvOpen && upsBattery > 0);
        gulluMesh.visible = isKhakiLit;
        setHumanoidPeekLit(gulluMesh, isKhakiLit);

        const duckFactor = gulluDuckTimer > 0 ? Math.sin((gulluDuckTimer / 0.90) * Math.PI) : 0;
        const breatheK = Math.sin(now * 0.0026);
        const swayK = Math.sin(now * 0.0016);
        // Strictly set to -4.95m and z = -2.56m so entire body and walkie-talkie stay safely +22cm behind the grill (-4.49m)
        const targetX = -4.95 - duckFactor * 0.50;
        const targetY = (-0.74 + breatheK * 0.02) * (1 - duckFactor) + (-1.10 * duckFactor);
        const targetZ = -2.56 + swayK * 0.03;
        gulluMesh.position.set(targetX, targetY, targetZ);
        gulluMesh.scale.set(1.15, 1.15, 1.15);
        gulluMesh.rotation.set(0, cctvOpen ? Math.PI / 2 : 1.09, 0);

        if (gulluMesh.userData) {
          const { armL, armR, torso, head, daman, legL, legR } = gulluMesh.userData;
          if (legL) legL.rotation.set(0, 0, 0);
          if (legR) legR.rotation.set(0, 0, 0);
          if (armL) {
            // Upper arm angled slightly back (+0.12) keeping hand safely behind bars
            armL.rotation.set(0.12, 0.04, 0.06);
          }
          if (armR) {
            // Upper arm angled slightly back (+0.12) holding walkie-talkie firmly against chest
            armR.rotation.set(0.12, -0.04, -0.06);
          }
          if (torso) {
            torso.rotation.set(0.04 + breatheK * 0.02, 0, 0);
          }
          if (daman) {
            daman.rotation.set(0.02, 0, 0);
          }
          if (head) {
            const snapCycle = Math.sin(now * 0.0022);
            const isSnap = snapCycle > 0.85;
            const twitch = (Math.sin(now * 0.037) > 0.93) ? (Math.random() - 0.5) * 0.16 : 0;
            const headTilt = isSnap ? -0.28 : -0.10;
            head.rotation.set(
              -0.04 + breatheK * 0.02,
              twitch,
              headTilt + twitch * 0.5
            );
          }
        }
      } else if (gLoc === ZONE_KHAKI_DOOR) {
        setHumanoidPeekMode(gulluMesh, false);
        setHumanoidLurkingVoid(gulluMesh, false);
        const isKhakiDoorLit = (cctvOpen && activeCamIdx === 4) || (leftLightOn && !isLeftLightDarkNow && !cctvOpen && upsBattery > 0);
        gulluMesh.visible = true;
        applyMonsterLighting(gulluMesh, isKhakiDoorLit ? 'flashed' : 'default');
        const targetDoorX = leftDoorClosed ? -4.80 : -4.12;
        const targetDoorY = leftDoorClosed ? -0.18 : 0.0;
        gulluMesh.position.x += (targetDoorX - gulluMesh.position.x) * Math.min(1, dt * 10);
        gulluMesh.position.y += (targetDoorY - gulluMesh.position.y) * Math.min(1, dt * 10);
        gulluMesh.position.z = 0.05;
        gulluMesh.scale.set(1.18, 1.18, 1.18);
        gulluMesh.rotation.set(0, Math.PI / 2, 0);

        if (leftDoorClosed) {
          if (gulluEnraged) {
            // Enraged sledgehammer door pounding! Full-body windup and violent slams
            const slamPhase = now * 0.034;
            const windup = Math.sin(slamPhase);
            if (gulluMesh.userData.armL) gulluMesh.userData.armL.rotation.set(-1.65 + windup * 0.95, 0.25, 0.18);
            if (gulluMesh.userData.armR) gulluMesh.userData.armR.rotation.set(-1.65 - windup * 0.95, -0.25, -0.18);
            if (gulluMesh.userData.torso) gulluMesh.userData.torso.rotation.set(0.24 + windup * 0.18, windup * 0.12, 0);
            if (gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(0.18 - windup * 0.22 + (Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14, 0);
          } else {
            // Closed door assault & kundi handle rattle:
            const isStriking = animate._leftShake > 0.1;
            if (isStriking) {
              const strikePound = Math.sin(now * 0.038) * 0.65;
              setLimbPose(gulluMesh, 0, 0, 0.02, -0.02, -1.25 - strikePound, -1.20 - strikePound, 0.22);
              if (gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(-0.15, 0.08, -0.08);
            } else {
              // Between hits: Jiggling the iron kundi latch at 16Hz!
              const jiggle = Math.sin(now * 0.048) * 0.16;
              const breatheD = Math.sin(now * 0.003) * 0.04;
              if (gulluMesh.userData.armL) gulluMesh.userData.armL.rotation.set(-1.15 + jiggle, 0.18, 0.10);
              if (gulluMesh.userData.armR) gulluMesh.userData.armR.rotation.set(-1.20 - jiggle, -0.18, -0.10);
              if (gulluMesh.userData.torso) gulluMesh.userData.torso.rotation.set(0.14 + breatheD, 0.05, 0);
              if (gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(0.04, 0.12, -0.06);
            }
          }
        } else {
          if (gulluEnraged) {
            // Enraged open doorway lunge! Arms reaching into room with clawing motions
            const lungeWave = Math.sin(now * 0.008);
            if (gulluMesh.userData.armL) gulluMesh.userData.armL.rotation.set(-1.65 + Math.sin(now * 0.05) * 0.35, 0.45, 0.25);
            if (gulluMesh.userData.armR) gulluMesh.userData.armR.rotation.set(-1.65 - Math.cos(now * 0.05) * 0.35, -0.45, -0.25);
            if (gulluMesh.userData.torso) gulluMesh.userData.torso.rotation.set(0.36 + lungeWave * 0.08, 0.15, 0);
            if (gulluMesh.userData.head) gulluMesh.userData.head.rotation.set(0.14 + Math.sin(now * 0.04) * 0.20, (Math.random() - 0.5) * 0.18, 0);
          } else {
            // Open door: predatory looming posture leaning into the room, arms raised menacingly
            const loomBreathe = Math.sin(now * 0.0035);
            setLimbPose(gulluMesh, 0, 0, 0.04, -0.04, -0.95 + Math.sin(now * 0.006) * 0.15, -0.90 + Math.cos(now * 0.006) * 0.15, 0.24);
            if (gulluMesh.userData.head) {
              gulluMesh.userData.head.rotation.set(0.08 + loomBreathe * 0.04, 0.18, -0.14);
            }
          }
        }
      } else {
        setHumanoidPeekMode(gulluMesh, false);
        // CCTV CAMERA ZONES (CAM 01, 02, 03, etc.):
        const spot = getIntruderSpot(gLoc, true);
        const isBeingWatched = (cctvOpen && (activeCamIdx === gLoc)) || (cctvShock && cctvShock.active && (cctvShock.monster === 'gullu' || cctvShock.monster === 'both'));
        const camTarget = cctvOpen ? camera.position : cctvZones[gLoc].pos;

        const dx = camTarget.x - spot.x;
        const dz = camTarget.z - spot.z;
        const distToCam = Math.hypot(dx, dz);

        if (isBeingWatched) {
          // FNAF Bonnie-style Staredown: towering uncomfortably close to lens, creepy tilted head staring right into lens
          const breathe = Math.sin(now * 0.0028);
          gulluMesh.position.set(spot.x, spot.y + Math.abs(breathe) * 0.015, spot.z);
          // Scale dynamically: massive towering scale (1.46 - 1.50) when close, filling 45% of camera frame!
          const loomScale = distToCam < 2.6 ? 1.48 : 1.34;
          gulluMesh.scale.set(loomScale, loomScale, loomScale);
          gulluMesh.visible = true;
          // Predatory looming hunch on torso and tension in arms
          if (gulluMesh.userData.torso) gulluMesh.userData.torso.rotation.set(0.12, 0.08, 0);
          if (gulluMesh.userData.armL) gulluMesh.userData.armL.rotation.set(-0.35, 0.20, -0.15);
          if (gulluMesh.userData.armR) gulluMesh.userData.armR.rotation.set(-0.15, -0.10, 0.12);

          // Head Angle: pitch up directly toward high-mounted camera lens + signature FNAF creepy neck cock
          const dyHead = camTarget.y - (spot.y + 1.85);
          const pitch = Math.atan2(dyHead, distToCam) * 0.85;
          const headRoll = (gLoc % 2 === 0 ? 0.32 : -0.32); // Eerie ~18° neck tilt like Bonnie in CAM 2B
          const headJitter = Math.sin(now * 0.003) * 0.03;
          if (gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.set(-pitch, 0.10, headRoll + headJitter);
          }
          // Turn body toward camera with dramatic 3/4 depth angle
          gulluMesh.rotation.set(0, Math.atan2(dx, dz) + 0.15, 0);
        } else {
          // Fluid bipedal patrol cycle with hip sway and head scanning
          const patrolPhase = now * 0.0042;
          gulluMesh.position.x = spot.x + Math.sin(now * 0.0011) * 0.38;
          gulluMesh.position.y = spot.y + Math.abs(Math.sin(patrolPhase * 2)) * 0.045;
          gulluMesh.position.z = spot.z;
          gulluMesh.scale.set(1.25, 1.25, 1.25);
          setLimbPose(gulluMesh, patrolPhase, 0.45, 0.02, -0.02, -0.75, -0.25, 0.08);
          if (gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.set(0, Math.sin(now * 0.0018) * 0.32, 0);
          }
          gulluMesh.rotation.set(0, Math.atan2(dx, dz), 0);
        }
      }
      }

      // BABU (Right Small Peek Window -> Main Right Window)
      if (!babuActive) {
        if (whitenerMesh) whitenerMesh.visible = false;
      } else {
      if (whitenerDuckTimer > 0) whitenerDuckTimer = Math.max(0, whitenerDuckTimer - dt);

      if (whitenerRageTimer > 0) {
        whitenerRageTimer = Math.max(0, whitenerRageTimer - dt);
        setHumanoidPeekMode(whitenerMesh, true);
        whitenerMesh.position.set(4.95, -0.74, -2.56);
        whitenerMesh.scale.set(1.15, 1.15, 1.15);
        whitenerMesh.rotation.set(0, cctvOpen ? -Math.PI / 2 : -1.09, 0);

        // Head convulses with wide bug-eyed rage tremors right in front of player
        if (whitenerMesh.userData.head) {
          const jitterW = (Math.random() - 0.5) * 0.18;
          whitenerMesh.userData.head.rotation.set(0.12 + Math.sin(now * 0.09) * 0.14, Math.cos(now * 0.08) * 0.12, jitterW);
        }

        // High-speed 20Hz red strobe
        if (whitenerMesh.userData.angryLight) {
          whitenerMesh.userData.angryLight.intensity = (Math.floor(now / 50) % 2 === 0) ? 6.8 : 1.4;
        }
        animate._rightShake = Math.max(animate._rightShake, 0.70);

        if (whitenerRageTimer <= 0) {
          setHumanoidPeekMode(whitenerMesh, false);
          // Launch into furious heavy sprint towards Right Window!
          whitenerWait = 0;
          whitenerStep++;
          WHITENER_PATH[whitenerStep] = ZONE_BABU_WINDOW;
          whitenerSpotIdx = 0;
          whitenerAtWindowTime = 0;

          const wDestX = rightShutterClosed ? 4.88 : 4.60;
          const wDestY = rightShutterClosed ? 0.02 : 0.06;
          whitenerWalkAnim = {
            fromX: 4.56,
            fromY: -0.80,
            fromZ: -2.46,
            toX: wDestX,
            toY: wDestY,
            toZ: 0.05,
            t: 0,
            dur: 0.55, // Heavy 0.55s sprint!
            yaw: -Math.PI / 2,
            isSprint: true
          };

          GameAudio.footstep(0.85);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(0.88); }, 110);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(0.90); }, 220);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(0.92); }, 330);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(0.94); }, 440);

          whitenerAssault = initAssaultProfile(windowHealth, false, true);
          setTimeout(() => { if (rageVignette) rageVignette.classList.remove('on'); }, 700);
          updateIntruderPositions();
        }
      } else if (whitenerWalkAnim) {
        setHumanoidPeekMode(whitenerMesh, wLoc === ZONE_BABU_PEEK);
        setHumanoidLurkingVoid(whitenerMesh, false);
        whitenerMesh.visible = true;
        whitenerWalkAnim.t += dt;
        const p = Math.min(1, whitenerWalkAnim.t / whitenerWalkAnim.dur);
        const isSprint = !!whitenerWalkAnim.isSprint;
        const walkPhase = now * (isSprint ? 0.038 : 0.017);
        const fromY = whitenerWalkAnim.fromY ?? 0.04;
        const toY = whitenerWalkAnim.toY ?? 0.08;
        whitenerMesh.position.x = whitenerWalkAnim.fromX + (whitenerWalkAnim.toX - whitenerWalkAnim.fromX) * p;
        whitenerMesh.position.z = whitenerWalkAnim.fromZ + (whitenerWalkAnim.toZ - whitenerWalkAnim.fromZ) * p;
        whitenerMesh.position.y = fromY + (toY - fromY) * p + Math.abs(Math.sin(walkPhase)) * (isSprint ? 0.09 : 0.06);
        whitenerMesh.rotation.set(0, whitenerWalkAnim.yaw, Math.sin(walkPhase) * (isSprint ? 0.08 : 0.04));

        if (isSprint) {
          // Heavy corrupt bureaucrat charging with furious pace! Wide gait, belly forward
          setLimbPose(whitenerMesh, walkPhase, 1.20, 0.08, -0.08, -1.50, -1.40, 0.38);
          animate._rightShake = Math.max(animate._rightShake, 0.95);
          if (whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.set(0.16 + Math.cos(walkPhase * 2) * 0.08, (Math.random() - 0.5) * 0.08, 0);
          }
        } else {
          // Pompous waddling patrol walk
          setLimbPose(whitenerMesh, walkPhase, 0.60, 0.05, -0.05, -0.80, -0.30, 0.10);
          if (whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.set(0.06 + Math.cos(now * 0.003) * 0.04, Math.cos(now * 0.002) * 0.12, 0);
          }
        }

        if (p >= 1) {
          whitenerWalkAnim = null;
          setLimbPose(whitenerMesh, 0, 0, 0, 0, 0, 0, 0);
          if (isSprint) {
            // Massive physical collision into the window on arrival!
            animate._rightShake = 1.45;
            triggerImpactSlam('win', 'heavy');
            spawnDebrisBurst('window', 'heavy', { x: 4.12, y: 2.18, z: 0.05 });
            // Organic footstep / rustle arrival (window bang plays strictly during assault strikes!)
            GameAudio.footstep(0.85);
          }
          updateIntruderPositions();
        }
      } else if (wLoc === ZONE_BABU_PEEK) {
        // STAGE 1 SMALL RIGHT PEEK WINDOW: Full body standing naturally and strictly behind exterior security bars!
        setHumanoidPeekMode(whitenerMesh, true);
        const isBabuLit = (cctvOpen && activeCamIdx === 5) || (rightLightOn && !isRightLightDarkNow && !cctvOpen && upsBattery > 0);
        whitenerMesh.visible = isBabuLit;
        setHumanoidPeekLit(whitenerMesh, isBabuLit);

        const duckFactor = whitenerDuckTimer > 0 ? Math.sin((whitenerDuckTimer / 0.90) * Math.PI) : 0;
        const breatheW = Math.cos(now * 0.0026);
        const swayW = Math.cos(now * 0.0016);
        // Strictly set to 4.95m and z = -2.56m so entire body and files stay safely +22cm behind the grill (4.49m)
        const targetX = 4.95 + duckFactor * 0.50;
        const targetY = (-0.74 + breatheW * 0.02) * (1 - duckFactor) + (-1.10 * duckFactor);
        const targetZ = -2.56 - swayW * 0.03;
        whitenerMesh.position.set(targetX, targetY, targetZ);
        whitenerMesh.scale.set(1.15, 1.15, 1.15);
        whitenerMesh.rotation.set(0, cctvOpen ? -Math.PI / 2 : -1.09, 0);

        if (whitenerMesh.userData) {
          const { armL, armR, torso, head, daman, legL, legR } = whitenerMesh.userData;
          if (legL) legL.rotation.set(0, 0, 0);
          if (legR) legR.rotation.set(0, 0, 0);
          if (armL) {
            // Upper arm angled slightly back (+0.12) keeping hand safely behind bars
            armL.rotation.set(0.12, 0.04, -0.06);
          }
          if (armR) {
            // Upper arm angled slightly back (+0.12) clutching Form-45 file firmly against gut
            armR.rotation.set(0.12, -0.04, 0.06);
          }
          if (torso) {
            torso.rotation.set(0.04 + breatheW * 0.02, 0, 0);
          }
          if (daman) {
            daman.rotation.set(0.02, 0, 0);
          }
          if (head) {
            const snapCycleW = Math.cos(now * 0.0022);
            const isSnapW = snapCycleW > 0.85;
            const twitchW = (Math.cos(now * 0.039) > 0.93) ? (Math.random() - 0.5) * 0.16 : 0;
            const headTiltW = isSnapW ? 0.28 : 0.10;
            head.rotation.set(
              -0.04 + breatheW * 0.02,
              twitchW,
              headTiltW + twitchW * 0.5
            );
          }
        }
      } else if (wLoc === ZONE_BABU_WINDOW) {
        setHumanoidPeekMode(whitenerMesh, false);
        setHumanoidLurkingVoid(whitenerMesh, false);
        const isBabuWinLit = (cctvOpen && activeCamIdx === 5) || (rightLightOn && !isRightLightDarkNow && !cctvOpen && upsBattery > 0);
        whitenerMesh.visible = true;
        applyMonsterLighting(whitenerMesh, isBabuWinLit ? 'flashed' : 'default');
        const targetWinX = rightShutterClosed ? 4.88 : 4.12;
        const targetWinY = rightShutterClosed ? 0.02 : 0.02;
        whitenerMesh.position.x += (targetWinX - whitenerMesh.position.x) * Math.min(1, dt * 10);
        whitenerMesh.position.y += (targetWinY - whitenerMesh.position.y) * Math.min(1, dt * 10);
        whitenerMesh.position.z = 0.05;
        whitenerMesh.scale.set(1.18, 1.18, 1.18);
        whitenerMesh.rotation.set(0, -Math.PI / 2, 0);

        if (rightShutterClosed) {
          if (whitenerEnraged) {
            // Enraged shutter beating with bottle and fist!
            const slamPhaseW = now * 0.034;
            const windupW = Math.sin(slamPhaseW);
            if (whitenerMesh.userData.armR) whitenerMesh.userData.armR.rotation.set(-1.65 + windupW * 0.95, 0.30, -0.15);
            if (whitenerMesh.userData.armL) whitenerMesh.userData.armL.rotation.set(-1.50 - windupW * 0.85, -0.25, 0.12);
            if (whitenerMesh.userData.torso) whitenerMesh.userData.torso.rotation.set(0.24 + windupW * 0.18, -windupW * 0.12, 0);
            if (whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(0.18 - windupW * 0.20 + (Math.random() - 0.5) * 0.14, (Math.random() - 0.5) * 0.14, 0);
          } else {
            // Closed shutter assault & louver rattling:
            const isStrikingW = animate._rightShake > 0.1;
            if (isStrikingW) {
              const strikePoundW = Math.sin(now * 0.038) * 0.65;
              setLimbPose(whitenerMesh, 0, 0, 0.02, -0.02, -1.25 - strikePoundW, -1.20 - strikePoundW, 0.20);
              if (whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(-0.15, -0.08, 0.08);
            } else {
              // Prying at shutter slats with fingers
              const pry = Math.sin(now * 0.048) * 0.16;
              const breatheW2 = Math.cos(now * 0.003) * 0.04;
              if (whitenerMesh.userData.armR) whitenerMesh.userData.armR.rotation.set(-1.15 + pry, -0.20, 0.12);
              if (whitenerMesh.userData.armL) whitenerMesh.userData.armL.rotation.set(-1.20 - pry, 0.20, -0.12);
              if (whitenerMesh.userData.torso) whitenerMesh.userData.torso.rotation.set(0.14 + breatheW2, -0.05, 0);
              if (whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(0.04, -0.12, 0.06);
            }
          }
        } else {
          if (whitenerEnraged) {
            // Enraged open window lunge! Brandishing bottle and reaching inward
            const lungeWaveW = Math.sin(now * 0.008);
            if (whitenerMesh.userData.armR) whitenerMesh.userData.armR.rotation.set(-1.65 + Math.sin(now * 0.05) * 0.40, 0.40, -0.20);
            if (whitenerMesh.userData.armL) whitenerMesh.userData.armL.rotation.set(-1.55 - Math.cos(now * 0.05) * 0.35, -0.40, 0.20);
            if (whitenerMesh.userData.torso) whitenerMesh.userData.torso.rotation.set(0.34 + lungeWaveW * 0.08, -0.15, 0);
            if (whitenerMesh.userData.head) whitenerMesh.userData.head.rotation.set(0.14 + Math.sin(now * 0.04) * 0.20, (Math.random() - 0.5) * 0.18, 0);
          } else {
            // Open shutter: peering through the iron grille holding Whitener bottle
            const loomBreatheW = Math.cos(now * 0.0035);
            setLimbPose(whitenerMesh, 0, 0, 0.04, -0.04, -1.05 + Math.cos(now * 0.006) * 0.15, -0.95 + Math.sin(now * 0.006) * 0.15, 0.22);
            if (whitenerMesh.userData.head) {
              whitenerMesh.userData.head.rotation.set(0.08 + loomBreatheW * 0.04, -0.18, 0.14);
            }
          }
        }
      } else {
        setHumanoidPeekMode(whitenerMesh, false);
        // CCTV CAMERA ZONES (CAM 01, 02, 03, 04, etc.):
        const spot = getIntruderSpot(wLoc, false);
        const isBeingWatchedW = (cctvOpen && (activeCamIdx === wLoc)) || (cctvShock && cctvShock.active && (cctvShock.monster === 'whitener' || cctvShock.monster === 'both'));
        const camTargetW = cctvOpen ? camera.position : cctvZones[wLoc].pos;

        const wdx = camTargetW.x - spot.x;
        const wdz = camTargetW.z - spot.z;
        const distToCamW = Math.hypot(wdx, wdz);

        if (isBeingWatchedW) {
          // FNAF Chica-style Staredown: stands uncomfortably close to lens, cocked head and wide unblinking stare
          const breatheW = Math.cos(now * 0.0028);
          whitenerMesh.position.set(spot.x, spot.y + Math.abs(breatheW) * 0.015, spot.z);
          // Scale dynamically: massive towering scale (1.46 - 1.50) when close, filling camera view
          const loomScaleW = distToCamW < 2.6 ? 1.48 : 1.34;
          whitenerMesh.scale.set(loomScaleW, loomScaleW, loomScaleW);
          whitenerMesh.visible = true;
          // Predatory hunch with Form-45 file and whitener bottle clutched
          if (whitenerMesh.userData.torso) whitenerMesh.userData.torso.rotation.set(0.14, -0.06, 0);
          if (whitenerMesh.userData.armL) whitenerMesh.userData.armL.rotation.set(-0.45, 0.30, -0.18);
          if (whitenerMesh.userData.armR) whitenerMesh.userData.armR.rotation.set(-0.30, -0.20, 0.15);

          // Head Angle: pitch up directly toward high-mounted camera lens + signature FNAF creepy neck cock
          const dyHeadW = camTargetW.y - (spot.y + 1.80);
          const pitchW = Math.atan2(dyHeadW, distToCamW) * 0.85;
          const headRollW = (wLoc % 2 === 0 ? -0.30 : 0.34); // Eerie ~18° neck tilt like Chica in CAM 7
          const headJitterW = Math.cos(now * 0.003) * 0.03;
          if (whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.set(-pitchW, -0.08, headRollW + headJitterW);
          }
          // Turn body toward camera with dramatic 3/4 depth angle
          whitenerMesh.rotation.set(0, Math.atan2(wdx, wdz) - 0.12, 0);
        } else {
          // Heavy, waddling bipedal patrol cycle with hip sway and paunch bounce
          const patrolPhaseW = now * 0.0042;
          whitenerMesh.position.x = spot.x + Math.cos(now * 0.0011) * 0.38;
          whitenerMesh.position.y = spot.y + Math.abs(Math.sin(patrolPhaseW * 2)) * 0.045;
          whitenerMesh.position.z = spot.z;
          whitenerMesh.scale.set(1.25, 1.25, 1.25);
          setLimbPose(whitenerMesh, patrolPhaseW, 0.45, 0.03, -0.03, -0.80, -0.28, 0.08);
          if (whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.set(0, Math.cos(now * 0.0018) * 0.32, 0);
          }
          whitenerMesh.rotation.set(0, Math.atan2(wdx, wdz), 0);
        }
      }
      }
    }

    // ---  LURKING DEMON EYES IN PITCH-BLACK VOID (USER REFERENCE IMAGE) ---
    // When Khaki is at Left Door/Peek or Babu is at Right Window/Peek and hallway light is OFF,
    // the monster's body is dark and two staring demon eyes glow in the black void!
    // Turning light ON (Q / E) illuminates full 3D PS1 model and hides the demon eyes.
    const gCurLurk = (typeof GULLU_PATH !== 'undefined' && typeof gulluStep !== 'undefined') ? GULLU_PATH[gulluStep] : null;
    const wCurLurk = (typeof WHITENER_PATH !== 'undefined' && typeof whitenerStep !== 'undefined') ? WHITENER_PATH[whitenerStep] : null;
    const isKhakiLurking = khakiActive && (gCurLurk === ZONE_KHAKI_DOOR || gCurLurk === ZONE_KHAKI_PEEK) &&
                          !leftLightOn && !cctvOpen && (upsBattery > 0 || state === 'PLAYING') &&
                          state === 'PLAYING';
    const isBabuLurking = babuActive && (wCurLurk === ZONE_BABU_WINDOW || wCurLurk === ZONE_BABU_PEEK) &&
                         !rightLightOn && !cctvOpen && (upsBattery > 0 || state === 'PLAYING') &&
                         state === 'PLAYING';

    // ---  APERTURE LURKING DEMON EYES IN PITCH-BLACK VOID (SMALL ROSHYDAN WINDOWS ONLY) ---
    // When Babu lurks outside on the right (peek or approaching window), eyes stare through the small right peek window!
    // When Khaki lurks outside on the left (peek or approaching door), eyes stare through the small left peek window!
    // Turning lights ON (Q / E) flashes the corridor and hides the demon eyes.
    // Eyes ONLY appear in the small peek window when the monster is ACTUALLY at the peek window!
    // When they move to attack the door (ZONE_KHAKI_DOOR) or window (ZONE_BABU_WINDOW),
    // they have left the peek window, so the demon eyes immediately disappear.
    // Eyes ONLY appear in the small peek window when the monster is ACTUALLY at the peek window!
    // When the light flickers (goes dark during brownout stutter), the demon eyes immediately appear again!
    // When the light is lit, the monster face is shown behind the bars, creating chilling alternating horror!
    // Demon eyes ONLY appear in the small peek window when peeking in the dark (lights OFF)!
    // When holding the light (leftLightOn), if it flickers (brownouts), do NOT show demon eyes during the flicker.
    // Demon eyes only appear continuously when peeking with lights OFF.
    const isKhakiAtPeek = (gCurLurk === ZONE_KHAKI_PEEK || gulluRageTimer > 0);
    const isBabuAtPeek = (wCurLurk === ZONE_BABU_PEEK || whitenerRageTimer > 0);

    const isKhakiLurkSmallPeek = isKhakiAtPeek && !leftLightOn && !cctvOpen && state === 'PLAYING';
    const isBabuLurkSmallPeek = isBabuAtPeek && !rightLightOn && !cctvOpen && state === 'PLAYING';

    if (gulluMesh && gulluMesh.userData) {
      setHumanoidLurkingVoid(gulluMesh, isKhakiLurkSmallPeek);
      if (gulluMesh.userData.demonEyes) gulluMesh.userData.demonEyes.visible = false;
    }

    if (whitenerMesh && whitenerMesh.userData) {
      setHumanoidLurkingVoid(whitenerMesh, isBabuLurkSmallPeek);
      if (whitenerMesh.userData.demonEyes) whitenerMesh.userData.demonEyes.visible = false;
    }

    const apertureEyePulse = 0.94 + Math.sin(now * 0.005) * 0.06;

    if (lurkingEyes) {
      if (lurkingEyes.leftPeek) {
        lurkingEyes.leftPeek.visible = isKhakiLurkSmallPeek;
        if (isKhakiLurkSmallPeek) lurkingEyes.leftPeek.material.opacity = apertureEyePulse;
      }
      if (lurkingEyes.rightPeek) {
        lurkingEyes.rightPeek.visible = isBabuLurkSmallPeek;
        if (isBabuLurkSmallPeek) lurkingEyes.rightPeek.material.opacity = apertureEyePulse;
      }
      if (lurkingEyes.rightWindow) {
        lurkingEyes.rightWindow.visible = false;
      }
      if (lurkingEyes.leftDoor) {
        lurkingEyes.leftDoor.visible = false;
      }
    }

    // Update Dynamic 3D Laptop, Scanner Bed & CRT Radar Screens on Desk
    laptopScreenHelper.update(formsUploaded, formsScanned, currentUploadPct, vpnDisconnected, now);
    if (scannerScreenHelper) {
      const curCfg = getCurrentLevelConfig();
      const needsSeal = curCfg.hasSealVerification && holdingForm && !isFormStamped;
      scannerScreenHelper.update(vpnDisconnected, isHoldingScan, scanProgress, now, needsSeal);
    }
    crtScreenHelper.update(
      chowkidarChai,
      GULLU_PATH[gulluStep] === ZONE_KHAKI_DOOR || GULLU_PATH[gulluStep] === ZONE_KHAKI_PEEK,
      WHITENER_PATH[whitenerStep] === ZONE_BABU_WINDOW || WHITENER_PATH[whitenerStep] === ZONE_BABU_PEEK,
      now
    );

    // Handle FNAF 1 Style 0% Power-Out Sequence & 6:00 AM Deadline Moonlight Blackout
    if (state === 'POWEROUT') {
      if (handTorchGroup) handTorchGroup.visible = false;
      if (handHammer) handHammer.visible = false;
      if (handForm) handForm.visible = false;
      if (handStamp) handStamp.visible = false;
      powerOutTimer -= dt;

      if (powerOutMode === 'deadline') {
        scene.fog.density = 0.052;
        camera.position.set(0, 1.72, 1.85);
        camera.lookAt(Math.sin(now * 0.0008) * 0.35, 1.60, -2.5);
        if (typeof leftPeekMoonlight !== 'undefined' && leftPeekMoonlight) leftPeekMoonlight.intensity = 1.65;
        if (typeof rightPeekMoonlight !== 'undefined' && rightPeekMoonlight) rightPeekMoonlight.intensity = 1.65;

        if (powerOutTimer <= 0) {
          powerOutMode = 'vigo';
          restoreAmbientLight();
          if (typeof leftPeekMoonlight !== 'undefined' && leftPeekMoonlight) leftPeekMoonlight.intensity = 0;
          if (typeof rightPeekMoonlight !== 'undefined' && rightPeekMoonlight) rightPeekMoonlight.intensity = 0;
          syncActiveSceneLights();
          triggerJumpscare('deadline');
        }
        renderer.render(scene, camera);
        return;
      }

      camera.position.set(0, 1.72, 1.85);
      camera.lookAt(-3.5, 1.65, 0.2);
      const flash = Math.floor(now / 150) % 2 === 0;
      leftHallLight.color.setHex(flash ? 0xef4444 : 0x2563eb);
      leftHallLight.intensity = Math.random() < 0.7 ? 1.8 : 0.1;

      if (powerOutTimer <= 0) {
        leftHallLight.color.setHex(0xfef08a);
        triggerJumpscare('vigo');
      }
      renderer.render(scene, camera);
      return;
    }

    if (state === 'JUMPSCARE') {
      if (handTorchGroup) handTorchGroup.visible = false;
      jumpscareTimer -= dt;
      const elapsed = 3.2 - jumpscareTimer;

      // Aggressive snap-punch lunge: monster lunges into your face from z = 0.08 to z = 0.98 in 0.14s!
      const lungeProgress = Math.min(1, elapsed / 0.14);
      const lungeEase = 1 - Math.pow(1 - lungeProgress, 5); // ferocious snap
      // Continuous violent forward/backward biting thrash (lunging back and forth directly in your face)
      const lungeThrash = elapsed > 0.14 ? Math.sin(now * 0.048) * 0.12 : 0;
      const targetZ = (0.08 + lungeEase * 0.90) + lungeThrash; // snaps to 0.98, thrashes 0.86 - 1.10!

      const isVigoAttack = (jumpscareAttacker === 'vigo' || jumpscareAttacker === 'chowkidar' || jumpscareAttacker === 'dala' || jumpscareAttacker === 'DALA');

      // Violent high-magnitude camera quake & rotational shudder
      const camJitterX = (Math.random() - 0.5) * 0.44;
      const camJitterY = (Math.random() - 0.5) * 0.38;
      const camJitterZ = (Math.random() - 0.5) * 0.18;
      camera.position.set(camJitterX, 1.75 + camJitterY, (isVigoAttack ? 2.38 : 1.80) + camJitterZ);
      camera.rotation.set(
        (Math.random() - 0.5) * (isVigoAttack ? 0.10 : 0.18),
        (Math.random() - 0.5) * (isVigoAttack ? 0.10 : 0.18),
        (Math.random() - 0.5) * (isVigoAttack ? 0.14 : 0.24)
      );

      // Horror vertigo FOV trembling
      camera.fov = 75 + (Math.random() - 0.5) * 16;
      camera.updateProjectionMatrix();

      if (isVigoAttack) {
        if (gulluMesh) gulluMesh.visible = false;
        if (whitenerMesh) whitenerMesh.visible = false;
        if (vigoMesh) {
          if (vigoMesh.parent !== scene) scene.add(vigoMesh);
          vigoMesh.visible = true;
          vigoMesh.scale.set(1.05, 1.05, 1.05);
          // Vigo smashes from z = -4.8 into z = -1.62 (front bullbar & headlights at z = +1.16, completely in front of desk & framed by camera at z = 2.38!)
          const crashProg = Math.min(1, elapsed / 0.22);
          const crashEase = 1 - Math.pow(1 - crashProg, 4);
          const revSurge = elapsed > 0.22 ? Math.sin(now * 0.065) * 0.10 : 0;
          const vigoZ = (-4.8 + crashEase * 3.18) + revSurge;
          const bounceY = 0.20 + (elapsed < 0.35 ? Math.sin(elapsed * 45) * 0.10 : Math.sin(now * 0.08) * 0.04);
          const swayX = (Math.random() - 0.5) * 0.10;
          vigoMesh.position.set(swayX, bounceY, vigoZ);
          vigoMesh.rotation.set(
            0.03 + (elapsed < 0.28 ? -0.05 * Math.sin(elapsed * 25) : (Math.random() - 0.5) * 0.025),
            (Math.random() - 0.5) * 0.05,
            Math.sin(now * 0.055) * 0.035
          );
        }
        scene.fog.density = 0.006;
        if (flashlight) {
          flashlight.position.copy(camera.position);
          flashlight.intensity = 6.2;
          if (flashTarget) flashTarget.position.set(0, 1.15, -0.5);
        }
        const vigoStrobe = Math.floor(now / 40) % 3;
        roomLight.color.setHex(vigoStrobe === 0 ? 0xfef08a : vigoStrobe === 1 ? 0xff1111 : 0x1d4ed8);
        roomLight.intensity = 6.4;
        roomLight.position.set(0, 2.5, 1.2);
        leftHallLight.color.setHex(vigoStrobe === 1 ? 0x1d4ed8 : 0xff1111);
        leftHallLight.intensity = 5.8;
        rightWindowLight.color.setHex(0xfef08a);
        rightWindowLight.intensity = 4.8;
      } else {
        if (vigoMesh) vigoMesh.visible = false;
        const attackerMesh = jumpscareAttacker === 'whitener' ? whitenerMesh : gulluMesh;
        const otherMesh = jumpscareAttacker === 'whitener' ? gulluMesh : whitenerMesh;
        otherMesh.position.set(0, -15, -25);
        otherMesh.visible = false;

        attackerMesh.visible = true;
        attackerMesh.scale.set(1.22, 1.22, 1.22);

        // Tremors and lunging position
        const tremorX = (Math.random() - 0.5) * 0.22;
        const tremorY = (Math.random() - 0.5) * 0.15;
        attackerMesh.position.set(tremorX, -1.16 + tremorY, targetZ);
        attackerMesh.rotation.set(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.25,
          (Math.random() - 0.5) * 0.18
        );

        // Clear fog so monster's face and eyes are razor-sharp
        scene.fog.density = 0.008;

        // Spotlight torch pointing right at the attacker's face
        if (flashlight) {
          flashlight.position.copy(camera.position);
          flashlight.intensity = 5.2;
          if (flashTarget) flashTarget.position.set(0, 1.73, 1.0);
        }

        if (jumpscareAttacker === 'whitener') {
          // Babu slashes his Dollar Whitener brush across your screen with bugging eyes!
          if (whitenerMesh.userData) {
            const { armR, armL, head, torso } = whitenerMesh.userData;
            if (armR) {
              armR.rotation.x = -1.45 + Math.sin(now * 0.065) * 0.65;
              armR.rotation.z = Math.cos(now * 0.052) * 0.45;
            }
            if (armL) armL.rotation.set(-1.60 + Math.sin(now * 0.048) * 0.35, 0.42, 0.22);
            if (head) {
              const hPitch = Math.sin(now * 0.062) * 0.42 + (Math.random() - 0.5) * 0.32;
              const hYaw = Math.cos(now * 0.054) * 0.45 + (Math.random() - 0.5) * 0.28;
              const hRoll = Math.sin(now * 0.071) * 0.38 + (Math.random() - 0.5) * 0.25;
              head.rotation.set(hPitch, hYaw, hRoll);
              head.scale.set(1.18 + Math.sin(now * 0.05) * 0.12, 1.18 + Math.cos(now * 0.05) * 0.12, 1.18);
            }
            if (torso) {
              torso.rotation.z = Math.sin(now * 0.045) * 0.15;
            }
          }
          const whiteFlash = Math.floor(now / 50) % 2 === 0;
          rightWindowLight.color.setHex(whiteFlash ? 0xffffff : 0xef4444);
          rightWindowLight.intensity = 4.8;
          roomLight.color.setHex(whiteFlash ? 0xfef08a : 0xffffff);
          roomLight.intensity = 4.2;
        } else {
          // Khaki's Vigo Red/Blue Police Strobe at 25Hz + snapping jaw + reaching grabbing arms!
          const vigoFlash = Math.floor(now / 45) % 2 === 0;
          roomLight.color.setHex(vigoFlash ? 0xff1111 : 0x1d4ed8);
          roomLight.intensity = 5.2;
          roomLight.position.set(0, 2.4, 1.2);
          leftHallLight.color.setHex(vigoFlash ? 0x1d4ed8 : 0xff1111);
          leftHallLight.intensity = 5.2;

          if (gulluMesh.userData) {
            const { armL, armR, head, torso } = gulluMesh.userData;
            // Both arms violently lunge forward clawing for player's throat!
            if (armL) armL.rotation.set(-1.68 + Math.sin(now * 0.058) * 0.45, 0.48 + Math.cos(now * 0.042) * 0.25, 0.30);
            if (armR) armR.rotation.set(-1.68 - Math.sin(now * 0.058) * 0.45, -0.48 - Math.cos(now * 0.042) * 0.25, -0.30);
            if (head) {
              // Rapid terrifying 60fps head thrashing / snarling jaw twitch!
              const hPitch = Math.sin(now * 0.065) * 0.42 + (Math.random() - 0.5) * 0.35;
              const hYaw = Math.cos(now * 0.052) * 0.48 + (Math.random() - 0.5) * 0.30;
              const hRoll = Math.sin(now * 0.072) * 0.40 + (Math.random() - 0.5) * 0.25;
              head.rotation.set(hPitch, hYaw, hRoll);
              head.scale.set(1.20 + Math.sin(now * 0.048) * 0.15, 1.20 + Math.cos(now * 0.048) * 0.15, 1.20);
            }
            if (torso) {
              torso.rotation.z = Math.sin(now * 0.048) * 0.18;
            }
          }
        }
      }

      if (jumpscareTimer <= 0) {
        finishGameOver();
      }
      renderer.render(scene, camera);
      return;
    }

    if (state === 'WIN_CUTSCENE') {
      playEndingSequence();
      return;
    }

    if (state === 'ENDING_REFLECTION' || state === 'END_CREDITS') {
      // Pause 3D scene rendering to ensure 100% CPU/GPU focus and pure black stillness
      return;
    }

    if (state === 'MENU') {
      if (handTorchGroup) handTorchGroup.visible = false;
      // Isolate only Babu (Left), Khaki (Right), camera, and menu spotlights in pitch black void
      scene.children.forEach(c => {
        if (c === gulluMesh || c === whitenerMesh ||
            c === babuMenuLight || c === babuMenuLight.target ||
            c === khakiMenuLight || c === khakiMenuLight.target ||
            c === menuBackdropLight || c === camera) {
          c.visible = true;
        } else {
          c.visible = false;
        }
      });
      ambient.intensity = 0.04;
      ambient.color.setHex(0x061c0d);
      roomLight.intensity = 0.0;
      leftHallLight.intensity = 0;
      rightWindowLight.intensity = 0;

      // Position camera facing void
      camera.position.set(0, 1.68, 2.15);
      camera.lookAt(0, 1.62, 0);

      // NO DEMON EYES - use sculpted horror face textures with deep rim lighting & shadows!
      if (gulluMesh && gulluMesh.userData && gulluMesh.userData.demonEyes) {
        gulluMesh.userData.demonEyes.visible = false;
      }
      if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.demonEyes) {
        whitenerMesh.userData.demonEyes.visible = false;
      }

      // BABU on LEFT flank (deep shadows, crazed psycho eye glint, tilted predatory lean)
      if (whitenerMesh) {
        whitenerMesh.visible = true;
        whitenerMesh.position.set(-1.22, -0.66, 1.15);
        whitenerMesh.rotation.set(0.06, 0.46, -0.05);
        if (whitenerMesh.userData && whitenerMesh.userData.armR) {
          whitenerMesh.userData.armR.position.y = -0.35;
        }
        babuMenuLight.intensity = 2.8 + Math.sin(now * 0.007) * 0.25;
        babuRimLight.intensity = 2.6 + Math.sin(now * 0.009) * 0.20;
      }

      // KHAKI on RIGHT flank (deep shadows, sunken hollow eye glint, disciplined grim operative stance)
      if (gulluMesh) {
        gulluMesh.visible = true;
        gulluMesh.position.set(1.22, -0.66, 1.15);
        gulluMesh.rotation.set(0.06, -0.46, 0.05);
        if (gulluMesh.userData && gulluMesh.userData.armR) {
          gulluMesh.userData.armR.position.y = -0.35;
        }
        khakiMenuLight.intensity = 2.8 + Math.sin(now * 0.009 + 1.0) * 0.25;
        khakiRimLight.intensity = 2.6 + Math.sin(now * 0.007 + 1.5) * 0.20;
      }
      // Authentic Creepy FNAF Micro-Twitch Engine: Sometimes ONE twitches, sometimes BOTH!
      menuTwitchTimer -= dt;
      if (menuTwitchTimer <= 0) {
        isMenuTwitching = true;
        const roll = Math.random();
        
        // Target selection: 40% Solo Babu, 40% Solo Khaki, 20% Both together
        if (roll < 0.40) {
          menuTwitchTarget = 'babu';
        } else if (roll < 0.80) {
          menuTwitchTarget = 'khaki';
        } else {
          menuTwitchTarget = 'both';
        }

        // Behavioral type variation
        const typeRoll = Math.random();
        if (menuTwitchTarget === 'both') {
          menuTwitchType = 'dual_spasm';
          menuTwitchDuration = 0.16 + Math.random() * 0.18;
        } else if (typeRoll < 0.28) {
          // Sharp cocked neck snap
          menuTwitchType = 'snap';
          menuTwitchDuration = 0.10 + Math.random() * 0.14;
        } else if (typeRoll < 0.54) {
          // Aggressive forward lunge towards camera
          menuTwitchType = 'lunge';
          menuTwitchDuration = 0.14 + Math.random() * 0.16;
        } else if (typeRoll < 0.78) {
          // Rapid high-frequency shivering seizure/spasm
          menuTwitchType = 'jitter';
          menuTwitchDuration = 0.18 + Math.random() * 0.18;
        } else {
          // Unsettling direct 4th-wall stare into the player's eyes
          menuTwitchType = 'direct_stare';
          menuTwitchDuration = 0.14 + Math.random() * 0.18;
        }

        // Staggered organic timer for next twitch (sometimes quick double-glitch)
        if (Math.random() < 0.25) {
          menuTwitchTimer = 0.45 + Math.random() * 0.65; // Quick double-twitch
        } else {
          menuTwitchTimer = 2.0 + Math.random() * 3.4; // Suspenseful gap
        }

        // Precompute random tweak parameters
        menuTwitchParams = {
          rotX: (Math.random() - 0.5) * 0.35,
          rotY: (menuTwitchTarget === 'babu' ? 0.35 : -0.35) + (Math.random() - 0.5) * 0.40,
          rotZ: (Math.random() - 0.5) * 0.38,
          lungeZ: 0.28 + Math.random() * 0.16
        };

        // Sound: Authentic TV static clipped to the exact tweak duration!
        const isLong = (menuTwitchDuration > 0.22 || menuTwitchTarget === 'both');
        const intensity = (menuTwitchTarget === 'both' || menuTwitchType === 'lunge') ? 1.4 : 1.0;
        try {
          if (window.GameAudio && window.GameAudio.menuStaticGlitch) {
            window.GameAudio.menuStaticGlitch(intensity, isLong, menuTwitchDuration);
          } else if (window.GameAudio && window.GameAudio.playStaticClip) {
            window.GameAudio.playStaticClip(menuTwitchDuration, 0.85 * intensity, 0);
          }
        } catch (_) {}

        // Visual static canvas glitch flare
        if (staticNoiseCanvas) {
          const baseOp = menuTwitchTarget === 'both' ? 0.48 : 0.35;
          staticNoiseCanvas.style.opacity = (baseOp + Math.random() * 0.25).toFixed(2);
        }
      }

      if (isMenuTwitching) {
        menuTwitchDuration -= dt;

        // Apply active twitch variation poses with visible framing
        const applyTwitch = (mesh, isBabu) => {
          if (!mesh || !mesh.userData || !mesh.userData.head) return;
          const head = mesh.userData.head;
          const sideSign = isBabu ? -1 : 1;

          if (menuTwitchType === 'jitter') {
            // High-frequency 60fps head & neck tremor
            const jX = Math.sin(now * 0.08) * 0.16;
            const jY = Math.cos(now * 0.10) * 0.22;
            const jZ = Math.sin(now * 0.12) * 0.18;
            head.rotation.set(jX, (isBabu ? 0.35 : -0.35) + jY, jZ);
            mesh.position.x += (Math.random() - 0.5) * 0.04;
          } else if (menuTwitchType === 'lunge') {
            // Looming forward lunge: monster snaps closer and leans inward towards camera!
            mesh.position.z += menuTwitchParams.lungeZ;
            mesh.position.x += sideSign * -0.25; // moves inward into light
            head.position.z = 0.03 + 0.14;
            head.position.y = 2.45 - 0.08;
            head.rotation.set(0.24, isBabu ? 0.15 : -0.15, (Math.random() - 0.5) * 0.18);
          } else if (menuTwitchType === 'direct_stare') {
            // Monster steps slightly inward and glares directly into the camera
            mesh.position.x += sideSign * -0.20;
            mesh.position.z += 0.22;
            head.rotation.set(0.10, isBabu ? 0.04 : -0.04, sideSign * -0.08);
            head.position.y = 2.45;
          } else if (menuTwitchType === 'snap') {
            // Unnatural violent head tilt/snap
            mesh.position.x += sideSign * -0.16;
            head.rotation.set(menuTwitchParams.rotX, menuTwitchParams.rotY, menuTwitchParams.rotZ);
          } else if (menuTwitchType === 'dual_spasm') {
            // Mirrored jarring distortion on both monsters
            mesh.position.x += sideSign * -0.22;
            mesh.position.z += 0.26;
            head.rotation.set(
              Math.sin(now * 0.06) * 0.22,
              sideSign * (0.28 + Math.sin(now * 0.09) * 0.25),
              sideSign * 0.32
            );
          }
        };

        if (menuTwitchTarget === 'babu') {
          // ONLY Babu twitches on left flank
          applyTwitch(whitenerMesh, true);
          if (babuMenuLight) babuMenuLight.intensity = 4.2 + Math.sin(now * 0.05) * 1.0;

          // Khaki remains calm & steady on the right (NO twitch!)
          if (gulluMesh && gulluMesh.userData && gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.y = Math.sin(now * 0.0011 + 1.2) * 0.025;
            gulluMesh.userData.head.rotation.x = Math.sin(now * 0.0014 + 0.8) * 0.015;
          }
        } else if (menuTwitchTarget === 'khaki') {
          // ONLY Khaki twitches on right flank
          applyTwitch(gulluMesh, false);
          if (khakiMenuLight) khakiMenuLight.intensity = 4.2 + Math.sin(now * 0.05) * 1.0;

          // Babu remains calm & steady on the left (NO twitch!)
          if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.y = Math.sin(now * 0.0009) * 0.025;
            whitenerMesh.userData.head.rotation.x = Math.sin(now * 0.0012) * 0.015;
          }
        } else if (menuTwitchTarget === 'both') {
          // BOTH monsters twitch simultaneously!
          applyTwitch(whitenerMesh, true);
          applyTwitch(gulluMesh, false);
          if (babuMenuLight) babuMenuLight.intensity = 4.4 + Math.sin(now * 0.05) * 1.2;
          if (khakiMenuLight) khakiMenuLight.intensity = 4.4 + Math.cos(now * 0.05) * 1.2;

          // Dual camera shudder only on synchronized dual-glitch
          camera.position.x += (Math.random() - 0.5) * 0.035;
          camera.position.y += (Math.random() - 0.5) * 0.020;
        }

        if (menuTwitchDuration <= 0) {
          isMenuTwitching = false;
          if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.head) {
            whitenerMesh.userData.head.rotation.set(0, 0, 0);
            whitenerMesh.userData.head.position.set(0, 2.45, 0.03);
          }
          if (gulluMesh && gulluMesh.userData && gulluMesh.userData.head) {
            gulluMesh.userData.head.rotation.set(0, 0, 0);
            gulluMesh.userData.head.position.set(0, 2.45, 0.03);
          }
          if (staticNoiseCanvas) staticNoiseCanvas.style.opacity = '0.20';
        }
      } else {
        // Eerie breathing drift for both monsters when not twitching
        if (whitenerMesh && whitenerMesh.userData && whitenerMesh.userData.head) {
          whitenerMesh.userData.head.rotation.y = Math.sin(now * 0.0009) * 0.025;
          whitenerMesh.userData.head.rotation.x = Math.sin(now * 0.0012) * 0.015;
        }
        if (gulluMesh && gulluMesh.userData && gulluMesh.userData.head) {
          gulluMesh.userData.head.rotation.y = Math.sin(now * 0.0011 + 1.2) * 0.025;
          gulluMesh.userData.head.rotation.x = Math.sin(now * 0.0014 + 0.8) * 0.015;
        }
      }

      renderer.render(scene, camera);
      return;
    }

    if (state !== 'PLAYING') {
      if (handTorchGroup) handTorchGroup.visible = false;
      camera.position.set(0, 1.75, 1.85);
      camera.lookAt(Math.sin(now * 0.0005) * 1.6, 1.6, -2.5);
      renderer.render(scene, camera);
      return;
    }

    // --- RUSH CHARGE RESOLUTION (Direct barge-in or mid-peek rush) ---
    if (gulluRushCharge) {
      gulluRushCharge.timer -= dt;
      if (leftDoorClosed) {
        // Slammed kundi just in time! Violent door collision!
        gulluRushCharge = null;
        animate._leftShake = 2.2;
        triggerImpactSlam('door', 'heavy');
        spawnDebrisBurst('door', 'heavy', { x: -4.16, y: 1.5, z: 0.0 });
        GameAudio.doorSlam(true);
        const cfgCollG = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
        doorHealth = Math.max(0, doorHealth - cfgCollG.rushCollisionDmg);
        syncControlsUI();
        showToast(`DOOR HIT (-${cfgCollG.rushCollisionDmg}%)`);
        gulluAtDoorTime = 0.05;
        gulluWait = 14.0;
      } else if (gulluRushCharge.timer <= 0) {
        // Failed to close door in time: Jumpscare breach!
        gulluRushCharge = null;
        animate._doorVel = -38;
        triggerImpactSlam('door', 'heavy');
        triggerJumpscare('gullu', 'The left door was left open when Khaki arrived.');
        return;
      }
    }

    if (whitenerRushCharge) {
      whitenerRushCharge.timer -= dt;
      if (rightShutterClosed) {
        // Slammed shutter just in time! Violent window collision!
        whitenerRushCharge = null;
        animate._rightShake = 2.2;
        triggerImpactSlam('win', 'heavy');
        spawnDebrisBurst('window', 'heavy', { x: 4.12, y: 2.18, z: 0.05 });
        GameAudio.shutterSlam(true);
        const cfgCollW = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
        windowHealth = Math.max(0, windowHealth - cfgCollW.rushCollisionDmg);
        syncControlsUI();
        showToast(`WINDOW HIT (-${cfgCollW.rushCollisionDmg}%)`);
        whitenerAtWindowTime = 0.05;
        whitenerWait = 14.0;
      } else if (whitenerRushCharge.timer <= 0) {
        // Failed to close shutters in time: Jumpscare breach!
        whitenerRushCharge = null;
        animate._shutterVelL = -34;
        animate._shutterVelR = 34;
        triggerImpactSlam('win', 'heavy');
        triggerJumpscare('whitener', 'The right window was left open when Babu arrived.');
        return;
      }
    }

    // 1b. Hold-to-stamp progress (ECP Official Seal Verification - Short tactile hold)
    if (isHoldingStamp && holdingForm && !isFormStamped) {
      stampProgress += dt / STAMP_HOLD_DURATION;
      const pctNum = Math.min(100, Math.round(stampProgress * 100));
      if (stampHoldBar) {
        stampHoldBar.style.width = `${pctNum}%`;
      }
      if (stampHoldPct) {
        stampHoldPct.textContent = `${pctNum}%`;
      }
      if (stampBtnProgressBar) {
        stampBtnProgressBar.style.width = `${pctNum}%`;
      }
      deskStampBounce = Math.min(0.4, deskStampBounce + dt * 2.0);
      handStampAnimTimer = 0.45;

      if (stampProgress >= 1.0) {
        isFormStamped = true;
        handStampAnimTimer = 0.35;
        deskStampBounce = 1.0;
        ballotBoxBounce = 0.22;
        if (GameAudio.stampThud) GameAudio.stampThud();
        else if (GameAudio.formCollected) GameAudio.formCollected();

        const curNum = formsScanned + 1;
        const formTotal = formsScanned < 25 ? 25 : 30;
        if (handForm && handForm.updateTexture) {
          handForm.updateTexture(curNum, formTotal, true);
        } else if (window.__updateForm45Texture) {
          window.__updateForm45Texture(curNum, formTotal, true);
        }

        showToast('+ ECP OFFICIAL SEAL AFFIXED! PROCEED TO SCAN (A)');
        try { navigator.vibrate?.(40); } catch (_) {}

        stopHoldStamp(true);
        syncInventoryUI();
        syncControlsUI();
      }
    }

    // 1. Hold-to-scan progress (scanning Form-45 sheet)
    if (isHoldingScan && holdingForm) {
      const scanDoorPenalty = (leftDoorClosed && rightShutterClosed) ? 0.45 : (leftDoorClosed || rightShutterClosed) ? 0.70 : 1.0;
      if (!animate._scanRateEl) animate._scanRateEl = document.getElementById('scan-hold-rate');
      const scanRateEl = animate._scanRateEl;
      if (scanRateEl) {
        if (scanDoorPenalty === 1.0) {
          scanRateEl.textContent = '[ SCAN SPEED: 100% (OPTIMAL - DOORS OPEN) ]';
          scanRateEl.style.color = '#4ade80';
        } else if (scanDoorPenalty >= 0.70) {
          scanRateEl.textContent = '[ SCAN SPEED: 70% (THROTTLED - 1 BARRIER CLOSED) ]';
          scanRateEl.style.color = '#facc15';
        } else {
          scanRateEl.textContent = '[ SCAN SPEED: 45% (FARADAY SHIELD - BOTH CLOSED) ]';
          scanRateEl.style.color = '#ef4444';
        }
      }
      const gZoneNow = GULLU_PATH[gulluStep];
      const canKhakiSeeNow = khakiActive && ((gZoneNow === ZONE_KHAKI_PEEK) || (!leftDoorClosed && (gZoneNow === 4 || gZoneNow === ZONE_KHAKI_DOOR)));
      if (canKhakiSeeNow && !gulluEnraged) {
        triggerEnragedKhaki();
      }
      const wZoneNow = WHITENER_PATH[whitenerStep];
      const canBabuSeeNow = babuActive && ((wZoneNow === ZONE_BABU_PEEK) || (!rightShutterClosed && (wZoneNow === 5 || wZoneNow === ZONE_BABU_WINDOW)));
      if (canBabuSeeNow && !whitenerEnraged) {
        triggerEnragedBabu();
      }

      // SOUND-REACTIVE HUNTING: Whining scanner motor attracts nearby wanderers!
      const gZone = GULLU_PATH[gulluStep];
      if (khakiActive && (gZone === 2 || gZone === 6)) {
        gulluWait -= dt * 0.45;
      }
      const wZone = WHITENER_PATH[whitenerStep];
      if (babuActive && (wZone === 3 || wZone === 7)) {
        whitenerWait -= dt * 0.45;
      }

      scanProgress += (dt / SCAN_DURATION) * scanDoorPenalty;
      if (scanHoldBar) scanHoldBar.style.width = `${Math.min(100, scanProgress * 100)}%`;

      if (scanStation) {
        // Single-pass linear sweep aligned 1:1 with scanProgress (0% -> 100%)
        const laserZ = -0.26 + (Math.min(1, Math.max(0, scanProgress)) * 0.52);
        if (scanStation.laser) {
          scanStation.laser.visible = true;
          scanStation.laser.position.set(0, 1.052, laserZ);
        }
        if (scanStation.light) {
          scanStation.light.position.set(0, 1.18, laserZ);
        }
        if (scanStation.led) {
          scanStation.led.material.color.setHex((Math.floor(now / 150) % 2 === 0) ? 0xef4444 : 0x7f1d1d);
        }
        if (scanStation.paper) scanStation.paper.visible = true;
      }

      if (scanProgress >= 1.0) {
        formsScanned++;
        holdingForm = false;
        equippedItem = 'NONE';
        if (handForm) handForm.visible = false;
        stopHoldScan(true);
        if (scanStation && scanStation.paper) scanStation.paper.visible = false;
        GameAudio.scanSuccessChime();

        if (formsScanned === 25 && !cctvFormsScattered) {
          triggerCctvFormsScatter();
        } else if (formsScanned > 25 && formsScanned < TOTAL_FORMS) {
          const remainingForms = TOTAL_FORMS - formsScanned;
          showToast(`+ FORM SCANNED! ${remainingForms} REMAINING IN CCTV`);
        } else if (formsScanned >= TOTAL_FORMS) {
          showToast('ALL 30 FORM-45s SCANNED! TRANSMITTING TO ECP...');
        }
        if (scanStation && scanStation.led) scanStation.led.material.color.setHex(0x22c55e);
        const pulse = Math.floor(now / 350) % 2 === 0;
        scanStation.led.material.color.setHex(pulse ? 0xfacc15 : 0x854d0e);
      } else if (formsScanned >= TOTAL_FORMS) {
        scanStation.led.material.color.setHex(0x22c55e);
      } else {
        scanStation.led.material.color.setHex(0x166534);
      }
    }

    // 2. Form-45 Upload Queue transmission on Laptop
    const queueCount = formsScanned - formsUploaded;
    const signalPenalty = (leftDoorClosed && rightShutterClosed) ? 0.25 : (leftDoorClosed || rightShutterClosed) ? 0.55 : 1.0;

    if (queueCount > 0 && !vpnDisconnected && upsBattery > 0) {
      currentUploadPct += (dt / UPLOAD_TIME_PER_FORM) * 100 * signalPenalty;
      if (currentUploadPct >= 100) {
        currentUploadPct = 0;
        formsUploaded++;
        GameAudio.uploadPacketChime();
        if (formsUploaded >= TOTAL_FORMS) {
          triggerWin();
          return;
        }
      }
    }

    if (upPctEl) {
      if (queueCount > 0) {
        const sigText = signalPenalty === 1.0 ? '4G: 100%' : signalPenalty >= 0.55 ? '4G: 55%' : '4G: 25%';
        upPctEl.textContent = `QUEUE: ${queueCount} PENDING (${Math.round(currentUploadPct)}% · ${sigText})`;
      } else {
        upPctEl.textContent = 'QUEUE: CLEAR';
      }
    }

    // Overall Progress calculation for UI & clock
    uploadProgress = Math.min(100, (formsUploaded / TOTAL_FORMS) * 100 + (queueCount > 0 ? (currentUploadPct / TOTAL_FORMS) : 0));

    // Night Clock & elapsed tracking (Game ends only when all 25 forms are uploaded!)
    nightSeconds += dt;
    campaignPlaytimeSec += dt;

    // Staggered monster spawn per level: Babu arrives first, Khaki joins later
    const lvlSpawnCfg = getCurrentLevelConfig();
    if (!babuActive && nightSeconds >= (lvlSpawnCfg.babuSpawnSec ?? 100)) {
      babuActive = true;
      whitenerStep = 0;
      WHITENER_PATH[0] = 3; // Staff Room (CAM 04)
      whitenerSpotIdx = Math.floor(Math.random() * 3);
      whitenerWait = (Math.min(10.0, lvlSpawnCfg.baseWWait || 10.0)) + Math.random() * 4.0;
      updateIntruderPositions();
      if (cctvOpen) flashStatic(0.75, 220);
    }
    if (!khakiActive && nightSeconds >= (lvlSpawnCfg.khakiSpawnSec ?? 200)) {
      khakiActive = true;
      gulluStep = 0;
      GULLU_PATH[0] = 0; // Main Gate (CAM 01)
      gulluSpotIdx = Math.floor(Math.random() * 3);
      gulluWait = (lvlSpawnCfg.baseGWait || 24.0) + Math.random() * 8.0;
      updateIntruderPositions();
      if (cctvOpen) flashStatic(0.75, 220);
    }

    // Dynamic Ayesha Call Subtitles in Paced Parts per Level
    const currentCues = AYESHA_CALL_CUES[currentHalqaLevel] || AYESHA_CALL_CUES[1];
    const callEndDuration = currentHalqaLevel === 2 ? 34.0 : currentHalqaLevel === 3 ? 31.0 : 84.5;
    if (!phoneBox.classList.contains('hide') && phoneText) {
      if (nightSeconds < 9.0) {
        const dotCount = Math.floor((nightSeconds * 2.5) % 4);
        const dots = '.'.repeat(dotCount);
        const ringHtml = `[CALL] <span style="color:#fbbf24;font-weight:bold;">INCOMING CALL · RO HQ (RINGING${dots})</span>`;
        if (phoneText.innerHTML !== ringHtml) {
          phoneText.innerHTML = ringHtml;
        }
      } else {
        const callElapsed = Math.max(0, nightSeconds - 9.0);
        let activeCue = currentCues[0];
        for (let i = 0; i < currentCues.length; i++) {
          if (callElapsed >= currentCues[i].t) {
            activeCue = currentCues[i];
          } else {
            break;
          }
        }
        const cueText = (subtitleLang === 'ENGLISH' && activeCue.textEn) ? activeCue.textEn : activeCue.text;
        const expectedHtml = `[CALL] <b>Ayesha:</b> "${cueText}"`;
        if (phoneText.innerHTML !== expectedHtml) {
          phoneText.innerHTML = expectedHtml;
        }
      }
    }
    if (nightSeconds > callEndDuration && !phoneBox.classList.contains('hide')) {
      phoneBox.classList.add('hide');
      try { localStorage.setItem('form45_heard_ayesha_call', '1'); } catch (_) {}
      const btnMuteCallEl = document.getElementById('btn-mute-call');
      if (btnMuteCallEl) btnMuteCallEl.style.display = '';
    }

    // Procedural Creepy Ambient Director (Random school echoes, distant dogs, scraping desks, cold drafts)
    ambientCreepTimer -= dt;
    if (ambientCreepTimer <= 0) {
      if (typeof GameAudio !== 'undefined' && !cctvOpen && state === 'PLAYING') {
        const isSpookyNight = selectedDifficulty === 'HARD' || selectedDifficulty === 'IMPOSSIBLE';
        GameAudio.playRandomCreepySound(isSpookyNight ? 1.25 : 1.0);
      }
      const minInterval = (selectedDifficulty === 'HARD' || selectedDifficulty === 'IMPOSSIBLE') ? 8.0 : 14.0;
      const maxInterval = (selectedDifficulty === 'HARD' || selectedDifficulty === 'IMPOSSIBLE') ? 16.0 : 26.0;
      ambientCreepTimer = minInterval + Math.random() * (maxInterval - minInterval);
    }

    // Proximity Terror Heartbeat Loop (When Khaki or Babu are right outside peek windows or doors!)
    const gZoneCur = GULLU_PATH[gulluStep];
    const wZoneCur = WHITENER_PATH[whitenerStep];
    const isKhakiClose = (gZoneCur === ZONE_KHAKI_PEEK || gZoneCur === ZONE_KHAKI_DOOR);
    const isBabuClose = (wZoneCur === ZONE_BABU_PEEK || wZoneCur === ZONE_BABU_WINDOW);

    if ((isKhakiClose || isBabuClose) && state === 'PLAYING') {
      if (typeof GameAudio !== 'undefined') {
        const isAtBreachPoint = (gZoneCur === ZONE_KHAKI_DOOR || wZoneCur === ZONE_BABU_WINDOW || doorHealth < 50 || windowHealth < 50 || gulluEnraged || whitenerEnraged);
        const hbVol = isAtBreachPoint ? 1.25 : 0.85;
        const hbPan = (isKhakiClose && !isBabuClose) ? -0.45 : (isBabuClose && !isKhakiClose) ? 0.45 : 0;
        if (GameAudio.startHeartbeatLoop) {
          GameAudio.startHeartbeatLoop(hbPan, hbVol);
        } else if (GameAudio.pulseHeartbeat) {
          GameAudio.pulseHeartbeat(hbPan, hbVol);
        }
      }
    } else {
      if (typeof GameAudio !== 'undefined' && GameAudio.stopHeartbeatLoop) {
        GameAudio.stopHeartbeatLoop(0.35);
      }
    }

    // Directional Babu Lurk Audio (Ragged breathing / eerie whistle / uncanny humming outside right window)
    if (isBabuClose && state === 'PLAYING') {
      babuLurkSoundCooldown -= dt;
      if (babuLurkSoundCooldown <= 0) {
        if (typeof GameAudio !== 'undefined' && GameAudio.playBabuLurkAudio) {
          GameAudio.playBabuLurkAudio(0.85);
        }
        babuLurkSoundCooldown = 10.0 + Math.random() * 12.0;
      }
    } else {
      babuLurkSoundCooldown = 4.5 + Math.random() * 4.0;
    }

    // Directional Khaki Lurk Audio (Menacing stare breathing / mocking chortle outside left door)
    if (isKhakiClose && state === 'PLAYING') {
      khakiLurkSoundCooldown -= dt;
      if (khakiLurkSoundCooldown <= 0) {
        if (typeof GameAudio !== 'undefined' && GameAudio.playKhakiLurkAudio) {
          GameAudio.playKhakiLurkAudio(-0.85);
        }
        khakiLurkSoundCooldown = 12.0 + Math.random() * 14.0;
      }
    } else {
      khakiLurkSoundCooldown = 5.0 + Math.random() * 5.0;
    }

    const cfgClock = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
    const curNightDur = cfgClock.nightDuration || 720;
    const shiftProgress = Math.min(1.0, nightSeconds / curNightDur);
    const hourFloat = shiftProgress * 6;

    // Shift runs 8 hours from 10:00 PM (22:00) to 06:00 AM (06:00) = 480 in-game minutes
    // Dynamically synced to curNightDur (720s = 1.5s per in-game minute = 12 real minutes)
    const secPerInGameMin = curNightDur / 480;
    const elapsedMinutes = Math.floor(nightSeconds / secPerInGameMin);
    const curTotalMinutes = (22 * 60 + elapsedMinutes) % (24 * 60);
    const curHours24 = Math.floor(curTotalMinutes / 60);
    const curMins = curTotalMinutes % 60;
    const curAmpm = (curHours24 >= 12 && curHours24 < 24) ? 'PM' : 'AM';
    let curHours12 = curHours24 % 12;
    if (curHours12 === 0) curHours12 = 12;
    const hStr = curHours12 < 10 ? `0${curHours12}` : `${curHours12}`;
    const mStr = curMins < 10 ? `0${curMins}` : `${curMins}`;

    clockTimeEl.textContent = `${hStr}:${mStr} ${curAmpm}`;
    const inGameSec = Math.floor(((nightSeconds % secPerInGameMin) / secPerInGameMin) * 60);
    const sStr = inGameSec < 10 ? `0${inGameSec}` : `${inGameSec}`;
    cctvTimestamp.textContent = `2026-02-08 ${hStr}:${mStr}:${sStr} ${curAmpm}`;

    // Guarantee 2-4 power sabotages in Level 2 & Level 3 (1st by mid-shift, 2nd later if needed, capped at 4)
    const curSabCfg = getCurrentLevelConfig();
    if (curSabCfg.hasPowerSabotage && powerSabotageCountThisShift < MAX_POWER_SABOTAGES_PER_SHIFT && !isPowerSabotaged && powerSabotageCooldown <= 0) {
      const needFirst = (powerSabotageCountThisShift === 0 && hourFloat >= 2.8);
      const needSecond = (powerSabotageCountThisShift === 1 && hourFloat >= 4.2);
      if (needFirst || needSecond) {
        const gCurNow = GULLU_PATH[gulluStep];
        if (gCurNow !== ZONE_KHAKI_DOOR && gCurNow !== ZONE_KHAKI_PEEK) {
          GULLU_PATH[gulluStep] = 8;
          gulluWait = 12.0;
          triggerPowerSabotage();
        }
      }
    }

    // Deadline check at 06:00 AM (shiftProgress >= 1.0)
    if (shiftProgress >= 1.0) {
      if (formsUploaded >= TOTAL_FORMS) {
        triggerWin();
      } else {
        startDeadlineBlackoutSequence();
      }
      return;
    }

    updateKettleSteamAndBrewing(dt, now);

    // 2. Chacha Chowkidar Chai Meter (CAM 01 Music Box Mechanic)
    const cfgLoop = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
    const chaiDrain = cfgLoop.chaiDrainRate * dt;
    chowkidarChai = Math.max(0, chowkidarChai - chaiDrain);
    chaiPctEl.textContent = `${Math.ceil(chowkidarChai)}%`;
    chaiBarFill.style.width = `${chowkidarChai}%`;
    chaiBarFill.style.background = chowkidarChai < 25 ? '#ef4444' : '#fbbf24';

    if (chowkidarChai <= 0) {
      if (chowkidarMesh) {
        chowkidarMesh.rotation.z = 0.85; // Chacha slumps asleep on the charpai!
        chowkidarMesh.position.y = -2.25;
      }
      triggerJumpscare('chowkidar');
      return;
    }

    // 3. Active Hammer Repair of Door & Window Hinges/Frame (Requires Hammer + Open Doors!)
    if (isHoldingRepair) {
      // Safety check: interrupt repair if door/shutter is locked/closed!
      if (repairTarget === 'door' && leftDoorClosed) {
        stopHoldRepair();
        showToast('KEEP DOOR OPEN TO REPAIR');
      } else if (repairTarget === 'window' && rightShutterClosed) {
        stopHoldRepair();
        showToast('KEEP WINDOW OPEN TO REPAIR');
      } else {
        // Animate first-person handheld hammer swing
        handHammerSwingAnim += dt * 9.5;
        if (handHammer) {
          const swingPhase = Math.sin(handHammerSwingAnim);
          handHammer.rotation.set(-0.25 + swingPhase * 0.42, -0.32, 0.16 - swingPhase * 0.16);
          handHammer.position.set(0.24 - swingPhase * 0.03, -0.24 - Math.abs(swingPhase) * 0.06, -0.48 - swingPhase * 0.05);
        }

        // Hammer strike beat (every ~0.45s)
        repairTimer -= dt;
        if (repairTimer <= 0) {
          repairTimer = 0.45;
          const pan = repairTarget === 'door' ? -0.8 : 0.8;
          GameAudio.hammerStrike(pan);

          // Subtle structural impact shake on camera
          camera.position.y += (Math.random() - 0.5) * 0.015;

          // SOUND-REACTIVE HUNTING: Hammer pounding echoes down hollow corridors!
          // Intruders in nearby zones hear the clanging nails and accelerate toward the room!
          if (repairTarget === 'door') {
            const gCur = GULLU_PATH[gulluStep];
            if (gCur === 0 || gCur === 1 || gCur === 2 || gCur === 6 || gCur === 30) {
              gulluWait = Math.max(0.6, gulluWait - 1.35);
            }
          } else if (repairTarget === 'window') {
            const wCur = WHITENER_PATH[whitenerStep];
            if (wCur === 0 || wCur === 1 || wCur === 3 || wCur === 7 || wCur === 31) {
              whitenerWait = Math.max(0.6, whitenerWait - 1.35);
            }
          }

          // Intruders hear hammering noise -> randomly taunt!
          repairTauntCooldown -= 0.65;
          if (repairTauntCooldown <= 0) {
            repairTauntCooldown = 6.0;
            if (Math.random() < 0.45) {
              triggerHammerTaunt(repairTarget);
            }
          }
        }

        // Slow progressive repair (~3.8% / sec)
        if (repairTarget === 'door') {
          doorHealth = Math.min(100, doorHealth + dt * REPAIR_RATE);
          if (doorHealth >= 100) {
            doorHealth = 100;
            stopHoldRepair(true);
            GameAudio.doorChime();
          }
        } else if (repairTarget === 'window') {
          windowHealth = Math.min(100, windowHealth + dt * REPAIR_RATE);
          if (windowHealth >= 100) {
            windowHealth = 100;
            stopHoldRepair(true);
            GameAudio.doorChime();
          }
        }

        // Update Repair HUD
        if (repairHoldHud && repairHoldHud.style.display !== 'none') {
          const curH = Math.ceil(repairTarget === 'door' ? doorHealth : windowHealth);
          if (repairHoldTitle) {
            repairHoldTitle.textContent = ` REPAIRING ${repairTarget === 'door' ? 'DOOR' : 'WINDOW'} HINGES (HOLD)... [ ${curH}% ]`;
          }
          if (repairHoldBar) repairHoldBar.style.width = `${curH}%`;
        }
      }
    } else if (!cctvOpen && handHammer && equippedItem === 'HAMMER') {
      // Idle breathing sway on hand hammer
      const idleSway = Math.sin(now * 0.002) * 0.02;
      handHammer.rotation.set(-0.25 + idleSway, -0.32, 0.16);
      handHammer.position.set(0.24, -0.24 + idleSway * 0.35, -0.48);
    }
    if (doorHealthPctEl && doorHealthFillEl) {
      const dH = Math.ceil(doorHealth);
      doorHealthPctEl.textContent = `${dH}%`;
      doorHealthPctEl.style.color = dH < 30 ? '#ef4444' : dH < 60 ? '#f59e0b' : '#22c55e';
      doorHealthFillEl.style.width = `${dH}%`;
      doorHealthFillEl.className = 'health-bar-fill' + (dH < 30 ? ' crit' : dH < 60 ? ' warn' : '');
    }
    if (windowHealthPctEl && windowHealthFillEl) {
      const wH = Math.ceil(windowHealth);
      windowHealthPctEl.textContent = `${wH}%`;
      windowHealthPctEl.style.color = wH < 30 ? '#ef4444' : wH < 60 ? '#f59e0b' : '#22c55e';
      windowHealthFillEl.style.width = `${wH}%`;
      windowHealthFillEl.className = 'health-bar-fill' + (wH < 30 ? ' crit' : wH < 60 ? ' warn' : '');
    }

    // Dynamic 3D Cracking Decal Opacity & Impact Fracture Animation
    if (doorCrackDecal && doorCrackDecal.material) {
      if (typeof animate._doorCrackFlash !== 'number') animate._doorCrackFlash = 0;
      if (animate._doorCrackFlash > 0) animate._doorCrackFlash = Math.max(0, animate._doorCrackFlash - dt * 3.2);

      const doorTier = Math.floor(doorDmg * 24);
      const isFlashing = animate._doorCrackFlash > 0.1;
      if (doorCrackDecal.userData && doorCrackDecal.userData.crackObj) {
        if (doorCrackDecal.userData.lastDmgTier !== doorTier || isFlashing) {
          doorCrackDecal.userData.lastDmgTier = doorTier;
          doorCrackDecal.userData.crackObj.render(doorDmg, animate._doorCrackFlash);
        }
      }

      doorCrackDecal.material.opacity = Math.min(1.0, (doorDmg > 0.05 ? 0.35 + doorDmg * 0.65 : 0) + animate._doorCrackFlash * 0.7);
      const dScale = 1.0 + doorDmg * 0.15;
      doorCrackDecal.scale.set(dScale, dScale, 1);
      if (animate._doorCrackFlash > 0.05) {
        doorCrackDecal.position.x = 0.065 + (Math.random() - 0.5) * 0.015;
      } else {
        doorCrackDecal.position.x = 0.065;
      }
    }

    if (windowCrackDecalL && windowCrackDecalL.material && windowCrackDecalR && windowCrackDecalR.material) {
      if (typeof animate._winCrackFlash !== 'number') animate._winCrackFlash = 0;
      if (animate._winCrackFlash > 0) animate._winCrackFlash = Math.max(0, animate._winCrackFlash - dt * 3.2);

      const winTier = Math.floor(winDmg * 24);
      const isWinFlashing = animate._winCrackFlash > 0.1;
      if (windowCrackDecalL.userData && windowCrackDecalL.userData.crackObj) {
        if (windowCrackDecalL.userData.lastDmgTier !== winTier || isWinFlashing) {
          windowCrackDecalL.userData.lastDmgTier = winTier;
          windowCrackDecalL.userData.crackObj.render(winDmg, animate._winCrackFlash);
        }
      }
      if (windowCrackDecalR.userData && windowCrackDecalR.userData.crackObj) {
        if (windowCrackDecalR.userData.lastDmgTier !== winTier || isWinFlashing) {
          windowCrackDecalR.userData.lastDmgTier = winTier;
          windowCrackDecalR.userData.crackObj.render(winDmg, animate._winCrackFlash);
        }
      }

      const op = Math.min(1.0, (winDmg > 0.05 ? 0.35 + winDmg * 0.65 : 0) + animate._winCrackFlash * 0.7);
      windowCrackDecalL.material.opacity = op;
      windowCrackDecalR.material.opacity = op;
      const wScale = 1.0 + winDmg * 0.15;
      windowCrackDecalL.scale.set(wScale, wScale, 1);
      windowCrackDecalR.scale.set(wScale, wScale, 1);
    }

    // Update Persistent Screen-Space Fracture Corner HUD Decals
    if (cornerCrackLeft) {
      const cLeftOp = doorDmg > 0.22 ? Math.min(0.85, (doorDmg - 0.22) * 1.35) : 0;
      cornerCrackLeft.style.opacity = cLeftOp.toFixed(3);
    }
    if (cornerCrackRight) {
      const cRightOp = winDmg > 0.22 ? Math.min(0.85, (winDmg - 0.22) * 1.35) : 0;
      cornerCrackRight.style.opacity = cRightOp.toFixed(3);
    }

    // 4. UPS Load & Battery Drain (Powers CCTV, Flashlight, Hall Lights & 4G Router Laptop!)
    let load = 1;
    if (cctvOpen) load += 1;
    if (leftLightOn) load += 1;
    if (rightLightOn) load += 1;
    // Flash mechanism removed: no spotlight power draw
    const clampedLoad = Math.min(4, load);

    if (!animate._ubarEls) {
      animate._ubarEls = [1, 2, 3, 4].map(i => document.getElementById(`ub${i}`));
      animate._lastClampedLoad = -1;
    }
    if (animate._lastClampedLoad !== clampedLoad) {
      animate._lastClampedLoad = clampedLoad;
      for (let i = 0; i < 4; i++) {
        const bar = animate._ubarEls[i];
        if (!bar) continue;
        const c = i < 2 ? 'g' : i === 2 ? 'y' : 'r';
        bar.className = 'ubar' + (i < clampedLoad ? ` on ${c}` : '');
      }
    }
    updateWifiHud();

    // Difficulty-tuned battery drain:
    const baseDrain = cfgLoop.baseDrain;
    const loadMultiplier = cfgLoop.loadMultiplier;
    const sabotageMultiplier = 1.0; // Sabotage triggers 20s shutdown countdown instead of drain rate
    const drainRate = (baseDrain + (clampedLoad - 1) * loadMultiplier) * sabotageMultiplier;
    const flashExtraDrain = 0;

    // 3:00 AM Mid-Shift Chai Refill from Chacha (+35% extra battery buffer)
    if (nightSeconds >= NIGHT_DURATION * 0.5 && deskChaiUsed && !deskChaiRefilled) {
      deskChaiUsed = false;
      deskChaiRefilled = true;
      if (chaiCup) chaiCup.visible = true;
      showToast('DESK CHAI REFILLED');
      GameAudio.phoneChirp();
    }

    upsBattery = Math.max(0, upsBattery - (drainRate + flashExtraDrain) * dt);
    const bColor = upsBattery < 20 ? '#ef4444' : upsBattery < 45 ? '#f59e0b' : '#38ff62';
    const bText = `${Math.ceil(upsBattery)}%`;
    upsPctEl.textContent = bText;
    upsPctEl.style.color = bColor;
    if (cctvBatteryPctEl) {
      cctvBatteryPctEl.textContent = bText;
      cctvBatteryPctEl.style.color = bColor;
    }
    if (cctvLoadBlocksEl) {
      cctvLoadBlocksEl.textContent = '■'.repeat(clampedLoad) + '□'.repeat(4 - clampedLoad);
      cctvLoadBlocksEl.style.color = clampedLoad <= 2 ? '#38ff62' : clampedLoad === 3 ? '#facc15' : '#ef4444';
    }

    if (upsBattery <= 0) {
      cctvFlashlightOn = false;
      startPowerOutSequence();
      return;
    } else {
      if (isPowerSabotaged) {
        powerSabotageTimer = Math.max(0, powerSabotageTimer - dt);
        const ceilSec = Math.ceil(powerSabotageTimer);

        if (sabotageCountdownVal) sabotageCountdownVal.textContent = `${powerSabotageTimer.toFixed(1)}s`;
        if (emergencySabotageHud) emergencySabotageHud.style.display = isWirePuzzleOpen ? 'none' : '';
        updateCam09Prompt();
        if (wirePuzzleCountdown) wirePuzzleCountdown.textContent = `TRIP IN: ${powerSabotageTimer.toFixed(1)}s`;

        // Audio countdown beeping
        if (ceilSec !== lastCountdownBeepSec) {
          lastCountdownBeepSec = ceilSec;
          if (GameAudio.emergencyCountdownBeep) GameAudio.emergencyCountdownBeep(powerSabotageTimer);
        }

        // Emergency Red Warning Strobe Lights filling school
        const strobeOn = (Math.floor(now / 130) % 2 === 0);
        roomLight.color.setHex(strobeOn ? 0xff2222 : 0x330000);
        roomLight.intensity = strobeOn ? 1.15 : 0.12;

        if (world.wireBox && world.wireBox.alarmLight) {
          world.wireBox.alarmLight.intensity = (Math.floor(now / 100) % 2 === 0) ? 5.8 : 0.6;
        }

        // Animate CAM 09 Wire Box Glowing Outline
        if (cam09WireBox && cam09WireBox.outline && cam09WireBox.neonMat) {
          const pulse = 0.55 + Math.sin(now * 0.009) * 0.40;
          cam09WireBox.outline.material.color.setHex(0xfacc15); // warning gold
          cam09WireBox.neonMat.color.setHex(0xfacc15);
          cam09WireBox.outline.material.opacity = pulse;
          cam09WireBox.neonMat.opacity = pulse * 0.95;
        }

        // Timer Expired: Catastrophic Power Failure!
        if (powerSabotageTimer <= 0) {
          failPowerSabotage();
          return;
        }
      } else {
        const curLvlCfg = (typeof getCurrentLevelConfig === 'function') ? getCurrentLevelConfig() : { levelNum: 1 };
        const baseColor = (curLvlCfg.levelNum === 3) ? 0x6e8399 : (curLvlCfg.levelNum === 2) ? 0xc4a362 : 0xd9f99d;
        roomLight.color.setHex(baseColor);

        // Overhead Fluorescent Tube Multi-Flicker & Brownout Engine (Rapid multi-stutter bursts!)
        if (!cctvOpen && state === 'PLAYING') {
          if (officeTubeBrownoutDuration > 0) {
            // Currently in a blackout dip
            officeTubeBrownoutDuration -= dt;
            roomLight.intensity = 0.04;
            if (typeof ceilingTubeMat !== 'undefined' && ceilingTubeMat) {
              ceilingTubeMat.color.setHex(0x181818);
            }
            if (officeTubeBrownoutDuration <= 0) {
              // Blackout dip ended! Check if more flickers remain in this multi-stutter burst sequence
              if (officeTubeBurstCount > 0) {
                officeTubeBurstCount--;
                // Brief restrike gap (40ms - 85ms) before the next rapid flicker
                officeTubeGapTimer = 0.04 + Math.random() * 0.045;
              } else {
                // Multi-burst sequence finished, schedule next cooldown
                const isIntruderNearby = (GULLU_PATH[gulluStep] === ZONE_KHAKI_PEEK || GULLU_PATH[gulluStep] === ZONE_KHAKI_DOOR || WHITENER_PATH[whitenerStep] === ZONE_BABU_PEEK || WHITENER_PATH[whitenerStep] === ZONE_BABU_WINDOW);
                officeTubeBrownoutCooldown = isIntruderNearby ? (10.0 + Math.random() * 12.0) : (20.0 + Math.random() * 22.0);
              }
            }
          } else if (officeTubeGapTimer > 0) {
            // Brief phosphor restrike flash between multi-flickers
            officeTubeGapTimer -= dt;
            roomLight.intensity = 0.98;
            if (typeof ceilingTubeMat !== 'undefined' && ceilingTubeMat) {
              ceilingTubeMat.color.copy(roomLight.color).multiplyScalar(1.45);
            }
            if (officeTubeGapTimer <= 0) {
              // Trigger next rapid flicker in the burst!
              officeTubeBrownoutDuration = 0.045 + Math.random() * 0.045;
              if (typeof GameAudio !== 'undefined' && GameAudio.tubeFlickerBuzz) {
                GameAudio.tubeFlickerBuzz(0);
              }
            }
          } else {
            officeTubeBrownoutCooldown -= dt;
            if (officeTubeBrownoutCooldown <= 0) {
              // 50% chance of multi-flicker stutter (2 to 4 rapid successive flickers), 70% if monster is outside!
              const isIntruderNearby = (GULLU_PATH[gulluStep] === ZONE_KHAKI_PEEK || GULLU_PATH[gulluStep] === ZONE_KHAKI_DOOR || WHITENER_PATH[whitenerStep] === ZONE_BABU_PEEK || WHITENER_PATH[whitenerStep] === ZONE_BABU_WINDOW);
              const isMulti = Math.random() < (isIntruderNearby ? 0.70 : 0.50);
              officeTubeBurstCount = isMulti ? (1 + Math.floor(Math.random() * 3)) : 0;
              officeTubeBrownoutDuration = 0.06 + Math.random() * 0.05;
              if (typeof GameAudio !== 'undefined' && GameAudio.tubeFlickerBuzz) {
                GameAudio.tubeFlickerBuzz(0);
              }
            }
          }
        } else {
          officeTubeBrownoutDuration = 0;
          officeTubeGapTimer = 0;
          officeTubeBurstCount = 0;
        }

        if (officeTubeBrownoutDuration <= 0 && officeTubeGapTimer <= 0) {
          // Continuous Organic Variable Brightness of Overhead Fluorescent Fixture:
          // 1. Slow undulating voltage drift (period ~3.8s)
          const waveSlow = Math.sin(now * 0.0016) * 0.075;
          // 2. Medium harmonic swell (period ~1.6s)
          const waveMed = Math.cos(now * 0.0039) * 0.045;
          // 3. High-frequency 50Hz mains ballast flutter
          const ballastHum = Math.sin(now * 0.050) * 0.022 + Math.cos(now * 0.027) * 0.014;
          // 4. Subtle ballast breathing swell
          const ballastSwell = Math.sin(now * 0.0006) * 0.040;

          // Intruders lurking right outside drains power and destabilizes the tube light
          const gCur = GULLU_PATH[gulluStep];
          const wCur = WHITENER_PATH[whitenerStep];
          const isIntruderClose = (gCur === ZONE_KHAKI_PEEK || gCur === ZONE_KHAKI_DOOR || wCur === ZONE_BABU_PEEK || wCur === ZONE_BABU_WINDOW);
          const dreadDim = isIntruderClose ? 0.18 : 0.0;
          const dreadJitter = isIntruderClose ? (Math.sin(now * 0.088) * 0.065 + (Math.random() - 0.5) * 0.05) : 0;
          
          // Low UPS battery (< 25%) causes faint struggle
          const upsStrain = (upsBattery < 25) ? 0.10 : 0;

          // Subtle organic phosphor micro-flicker
          const microJitter = (Math.random() < 0.035) ? -0.16 : (Math.random() < 0.015 ? 0.07 : 0);

          // Increased base intensity: boosted to 0.76 for vivid, readable office atmosphere
          const baseIntensity = 0.76;
          const variableBrightness = waveSlow + waveMed + ballastHum + ballastSwell;
          const finalIntensity = Math.max(0.16, baseIntensity + variableBrightness - dreadDim - upsStrain + dreadJitter + microJitter);
          roomLight.intensity = finalIntensity;

          // Synchronize the physical ceiling fluorescent tube's emissive phosphor glow
          if (typeof ceilingTubeMat !== 'undefined' && ceilingTubeMat) {
            const tubeLuminance = Math.max(0.25, Math.min(1.45, finalIntensity / 0.76));
            ceilingTubeMat.color.copy(roomLight.color).multiplyScalar(tubeLuminance);
          }
        } else {
          // During micro-brownout blackout, ceiling tube goes nearly unlit
          if (typeof ceilingTubeMat !== 'undefined' && ceilingTubeMat) {
            ceilingTubeMat.color.setHex(0x181818);
          }
        }

        if (world.wireBox && world.wireBox.alarmLight) {
          world.wireBox.alarmLight.intensity = 0;
        }

        // Calm mode: Slight glowing outline indicating CAM 09 wire box is clickable
        if (cam09WireBox && cam09WireBox.outline && cam09WireBox.neonMat) {
          if (isHoveringCam09WireBox) {
            cam09WireBox.outline.material.color.setHex(0x6ee7b7);
            cam09WireBox.neonMat.color.setHex(0x6ee7b7);
            cam09WireBox.outline.material.opacity = 1.0;
            cam09WireBox.neonMat.opacity = 1.0;
          } else {
            const pulse = 0.45 + Math.sin(now * 0.003) * 0.28;
            cam09WireBox.outline.material.color.setHex(0x38ff62);
            cam09WireBox.neonMat.color.setHex(0x38ff62);
            cam09WireBox.outline.material.opacity = pulse;
            cam09WireBox.neonMat.opacity = pulse * 0.80;
          }
        }
      }
      flashlight.intensity = cctvOpen ? 0 : 1.28;
    }

    const isWeak = signalPenalty < 1;
    let statText = '';
    if (vpnDisconnected) statText = ' LINK SEVERED [SHARK CUT]';
    else if (queueCount > 0) statText = `QUEUE: ${queueCount} PENDING${isWeak ? ' · WEAK 4G' : ''}`;
    else statText = 'QUEUE: CLEAR';
    if (upPctEl) upPctEl.textContent = statText;
    if (upBarFill) {
      upBarFill.style.width = `${uploadProgress}%`;
      upBarFill.style.background = isWeak ? 'linear-gradient(90deg, #ca8a04, #facc15)' : 'linear-gradient(90deg, #16a34a, #4ade80)';
    }

    // 4. PTA Shark VPN Attack & Babu / Khaki Roam Whisper Cooldown
    if (babuWhisperCooldown > 0) {
      babuWhisperCooldown -= dt;
    }
    if (khakiWhisperCooldown > 0) {
      khakiWhisperCooldown -= dt;
    }

    if (babuActive && !vpnDisconnected) {
      sharkTimer -= dt;
      if (sharkTimer <= 0) {
        vpnDisconnected = true;
        if (isHoldingScan) {
          stopHoldScan();
        }
        GameAudio.sharkAlert();
        const vpnLine = GameAudio.triggerBabuDynamicCue('vpn_sabotage', currentHalqaLevel, { pan: 0.20, vol: 1.05 });
        if (vpnLine && vpnLine.subtitle) {
          showPS1Subtitle(`Babu: "${getLineSubtitle(vpnLine)}"`, Math.round((vpnLine.dur || 3.0) * 1000) + 600);
        }
        showToast('SHARK CUT · GO TO CAM 10');
        syncControlsUI();
        updateCam10Prompt();
      }
    }

    // Animate CAM 10 WiFi Router Alert Glow & LOS LED
    // Animate Scanner Bed, LEDs & Light during WiFi trip
    if (scanStation) {
      if (vpnDisconnected) {
        const pulse = (Math.floor(now / 220) % 2 === 0);
        if (scanStation.led) scanStation.led.material.color.setHex(pulse ? 0xef4444 : 0x7f1d1d);
        if (scanStation.light) {
          scanStation.light.color.setHex(0xef4444);
          scanStation.light.intensity = pulse ? 0.75 : 0.25;
        }
      } else if (!isHoldingScan) {
        if (scanStation.light) {
          scanStation.light.color.setHex(0x22c55e);
          scanStation.light.intensity = 0.2;
        }
      }
    }

    if (cam10Router) {
      if (vpnDisconnected) {
        if (cam10Router.glowGroup) cam10Router.glowGroup.visible = true;
        if (cam10Router.neonMat) {
          const pulse = 0.55 + Math.sin(now * 0.009) * 0.40;
          cam10Router.neonMat.color.setHex((Math.floor(now / 200) % 2 === 0) ? 0xef4444 : 0x06b6d4);
        }
        if (cam10Router.losLed) {
          cam10Router.losLed.material.color.setHex((Math.floor(now / 150) % 2 === 0) ? 0xef4444 : 0x450a0a);
        }
      } else {
        if (cam10Router.glowGroup) {
          cam10Router.glowGroup.visible = isHoveringCam10Router;
          if (cam10Router.neonMat) {
            cam10Router.neonMat.color.setHex(0x06b6d4);
          }
        }
        if (cam10Router.losLed) {
          cam10Router.losLed.material.color.setHex(0x15803d);
        }
      }
    }

    // 5. "Khaki" (The "Agency" Guy) 2-Stage AI — Stage 1: Left Lobby Peek (30) -> Stage 2: Left Iron Door (4)
    // Level 1 (NA-47) Pacing: Calm & infrequent during start hours (12 AM - 2 AM), scaling up towards 5 AM
    const hourProg = Math.min(1.0, hourFloat / 5.0); // 0.0 at 12 AM -> 0.4 at 2 AM -> 1.0 at 5 AM
    const scanProg = getScanAggressionProg();
    const speedMult = 0.68 + hourProg * 0.44 + scanProg * 0.16 + (vpnDisconnected ? 0.20 : 0);
    const moodStg = getMoodStage();

    // Early night safety buffer (12 AM - 2 AM): prevent simultaneous peek/breach attacks on Level 1
    const babuBusyAtWindow = hourFloat < 2.5 && (WHITENER_PATH[whitenerStep] === ZONE_BABU_PEEK || WHITENER_PATH[whitenerStep] === ZONE_BABU_WINDOW);

    if (khakiActive) {
    if (GULLU_PATH[gulluStep] !== ZONE_KHAKI_DOOR) {
      if (!(babuBusyAtWindow && gulluStep >= 2)) {
        gulluWait -= dt * speedMult;
      }
      if (gulluWait <= 0) {
        const curZone = GULLU_PATH[gulluStep];
        const newZone = pickNextGulluZone(curZone, hourProg);
        gulluStep++;
        GULLU_PATH[gulluStep] = newZone;
        gulluSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[newZone]?.length || 1));

        // Randomized pacing with organic jitter
        const cfgPaceG = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
        const baseGWait = newZone === ZONE_KHAKI_PEEK
          ? Math.max(2.2, cfgPaceG.peekGWait - hourProg * 1.8 - scanProg * 0.4)
          : Math.max(4.0, cfgPaceG.baseGWait - hourProg * 4.5 - scanProg * 1.5);
        gulluWait = baseGWait * (0.85 + Math.random() * 0.35);
        gulluAtDoorTime = 0;
        gulluSpottedSting = false;
        gulluAssault = null;
        if (cctvOpen) flashStatic(0.72, 160);

        // When Khaki moves between rooms and player is in office scanning/working, trigger eerie whisper!
        checkKhakiRoamWhisper(curZone, newZone);

        // Check if Khaki just departed from Left Peek Window (Zone 30)
        if (curZone === ZONE_KHAKI_PEEK && newZone !== ZONE_KHAKI_DOOR) {
          setHumanoidPeekMode(gulluMesh, false);
          GameAudio.khakiRetreatCues();
        }

        // Tactical Audio Hints for Khaki's Location (100% Organic Foley & Laughs)
        if (newZone === 0) {
          GameAudio.khakiGateRattle();
        } else if (newZone === 1 || newZone === 2) {
          GameAudio.khakiHeavyBoot(-0.85);
          // Khaki voice/laugh removed - purely heavy combat boot steps
        } else if (newZone === 8) {
          // CAM 09 Dead-End Power Shed 10-Second Sabotage Trigger!
          triggerPowerSabotage();
        }

        if (newZone === 4 && !leftDoorClosed && isHoldingScan && holdingForm) {
          triggerEnragedKhaki();
        } else if (newZone === ZONE_KHAKI_PEEK) {
          if (isHoldingScan && holdingForm) {
            triggerEnragedKhaki();
          } else {
            // Stage 1: Always peek at Left Spy Window first so player sees monster lurking!
            setHumanoidPeekMode(gulluMesh, true);
            gulluWalkAnim = { fromX: -6.15, fromY: -0.82, fromZ: -3.45, toX: -4.80, toY: -0.74, toZ: -2.55, t: 0, dur: 1.25, yaw: 0.82 };
            GameAudio.khakiLurkWarning();
            GameAudio.radioSquelchCue(-0.85);
          }
        } else if (newZone === ZONE_KHAKI_DOOR) {
          setHumanoidPeekMode(gulluMesh, false);
          GameAudio.khakiDoorCreakWarning();
          // STAGE 2: Khaki walks from the Left Small Peek Window (z = -2.28) forward to the Main Left Iron Door (z = 0.05)!
          const gDestX = leftDoorClosed ? -4.80 : -4.12;
          const gDestY = leftDoorClosed ? -0.18 : 0.0;
          gulluWalkAnim = { fromX: -4.80, fromY: -0.74, fromZ: -2.55, toX: gDestX, toY: gDestY, toZ: 0.05, t: 0, dur: 1.15, yaw: Math.PI / 2 };
          GameAudio.footstep(-0.88);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(-0.88); }, 320);
          animate._leftShake = 0.65;
        } else if (newZone === 2) {
          GameAudio.footstep(-0.75);
        } else {
          GameAudio.footstep(-0.75);
        }
        updateIntruderPositions();
      }
    } else {
      // Stage 2: Khaki is at the Main Left Door!
      // If walk animation is still running, do not start attack timer yet!
      if (gulluWalkAnim) {
        gulluAtDoorTime = 0;
      } else {
        const prevTime = gulluAtDoorTime;
        gulluAtDoorTime += dt;

        if (!gulluAssault) {
          gulluAssault = initAssaultProfile(doorHealth, true, gulluEnraged);
        }

        // Arrival notice
        if (prevTime < 0.1 && gulluAtDoorTime >= 0.1) {
          animate._leftShake = gulluEnraged ? 1.4 : 0.85;
          GameAudio.doorSlam(false);
        }

        if (!leftDoorClosed) {
          // DOOR IS OPEN: Arrives at open doorway with 1.25s reaction grace period!
          if (typeof gulluAssault.openDoorBreachTimer !== 'number') {
            gulluAssault.openDoorBreachTimer = 1.25; // 1.25s grace period to slam kundi [1]!
            animate._leftShake = 1.15;
            GameAudio.doorSlam(false);
            showToast('SLAM LEFT DOOR (1) NOW!');
          }
          gulluAssault.openDoorBreachTimer -= dt;
          if (gulluAssault.openDoorBreachTimer <= 0) {
            animate._doorVel = -38;
            triggerImpactSlam('door', 'heavy');
            triggerJumpscare('gullu', 'Khaki rushed through the open left door.');
            return;
          }
        } else {
          // Reset open door breach timer if closed
          if (gulluAssault.openDoorBreachTimer !== undefined) delete gulluAssault.openDoorBreachTimer;
          // DOOR IS SAFELY LOCKED: Khaki strikes the locked iron door

          // Periodic door pounding according to randomized assault profile
          if (gulluAtDoorTime >= gulluAssault.nextHitTime && gulluAssault.hitCount < gulluAssault.maxHits) {
            gulluAssault.hitCount++;
            
            let rawDmg = Math.floor(gulluAssault.minDmg + Math.random() * (gulluAssault.maxDmg - gulluAssault.minDmg + 1));
            
            // Safety guarantee: cap damage so door cannot break in one go from a healthy/moderate state
            const allowedDmg = Math.max(0, gulluAssault.maxVisitDmg - gulluAssault.dealtDmg);
            const actualDmg = Math.min(rawDmg, allowedDmg);
            
            doorHealth = Math.max(0, doorHealth - actualDmg);
            gulluAssault.dealtDmg += actualDmg;

            const isHeavy = gulluAssault.type === 'heavy';
            const isLight = gulluAssault.type === 'light';

            animate._leftShake = isHeavy ? (0.95 + Math.random() * 0.35) : isLight ? 0.55 : (0.80 + Math.random() * 0.25);
            animate._doorCrackFlash = isHeavy ? 1.0 : isLight ? 0.5 : 0.85;

            const severity = isHeavy ? 'heavy' : isLight ? 'light' : 'medium';
            triggerImpactSlam('door', severity);
            spawnDebrisBurst('door', severity, { x: -4.16, y: 1.5, z: 0.0 });
            if (GameAudio.khakiDoorBang) GameAudio.khakiDoorBang(-0.95, gulluAssault.playbackRate || 1.0); else GameAudio.doorSlam(true);

            // Steady pacing synced to the 3-bang clip cadence
            gulluAssault.nextHitTime += gulluAssault.interval;

            if (doorHealth <= 0) {
              leftDoorClosed = false;
              // Explosive breaking door animation: Kundi snaps & door violently flies open!
              spawnDebrisBurst('door', 'heavy', { x: -4.16, y: 1.5, z: 0.0 });
              spawnDebrisBurst('door', 'heavy', { x: -4.16, y: 2.2, z: -0.5 });
              animate._doorVel = -36;
              triggerImpactSlam('door', 'heavy');
              triggerJumpscare('gullu');
              return;
            }
          } else if (gulluAssault.hitCount >= gulluAssault.maxHits && gulluAtDoorTime >= gulluAssault.nextHitTime) {
            tutDefendedOnce = true;
            gulluEnraged = false;
            setHumanoidEnraged(gulluMesh, false);
            animate._leftShake = 0.7;
            
            // Randomized retreat location:
            const rRet = Math.random();
            const retreatZ = rRet < 0.55 ? 0 : rRet < 0.85 ? 1 : 2;
            GULLU_PATH[0] = retreatZ;
            gulluStep = 0;
            gulluSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[retreatZ]?.length || 1));
            
            // Guaranteed recovery window: generous wait so player has ample time to repair!
            gulluWait = ((32.0 - hourProg * 10.0) * (0.85 + Math.random() * 0.50));
            gulluAtDoorTime = 0;
            gulluAssault = null;
            gulluWalkAnim = null;
            updateIntruderPositions();
          }
        }
      }
    }
    }

    // 6. "Babu" (The Civil Servant) 2-Stage AI — Stage 1: Right Windowsill Peek (31) -> Stage 2: Right Window (41)
    const khakiBusyAtDoor = hourFloat < 2.5 && (GULLU_PATH[gulluStep] === ZONE_KHAKI_PEEK || GULLU_PATH[gulluStep] === ZONE_KHAKI_DOOR);

    if (babuActive) {
    if (WHITENER_PATH[whitenerStep] !== ZONE_BABU_WINDOW) {
      if (!(khakiBusyAtDoor && whitenerStep >= 1)) {
        whitenerWait -= dt * speedMult;
      }
      if (whitenerWait <= 0) {
        const curWZone = WHITENER_PATH[whitenerStep];
        const newWZone = pickNextWhitenerZone(curWZone, hourProg);
        whitenerStep++;
        WHITENER_PATH[whitenerStep] = newWZone;
        whitenerSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[newWZone]?.length || 1));

        // Randomized pacing with organic jitter
        const cfgPaceW = DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.MEDIUM;
        const baseWWait = newWZone === ZONE_BABU_PEEK
          ? Math.max(1.8, cfgPaceW.peekWWait - hourProg * 1.2 - scanProg * 0.3)
          : Math.max(4.2, cfgPaceW.baseWWait - hourProg * 4.5 - scanProg * 1.2);
        whitenerWait = baseWWait * (0.85 + Math.random() * 0.35);
        whitenerAtWindowTime = 0;
        whitenerSpottedSting = false;
        whitenerAssault = null;
        if (cctvOpen) {
          flashStatic(0.7, 170);
        }

        // When Babu moves between rooms and player is in office scanning/working, trigger eerie whisper!
        checkBabuRoamWhisper(curWZone, newWZone);

        // Check if Babu just departed from Right Peek Window (Zone 31)
        if (curWZone === ZONE_BABU_PEEK && newWZone !== ZONE_BABU_WINDOW) {
          setHumanoidPeekMode(whitenerMesh, false);
          GameAudio.babuRetreatCues();
        }

        // Moving between cameras / zones: 50% chance of distant audio cue with analog CCTV static (never when peeking)
        if (newWZone !== ZONE_BABU_PEEK && newWZone !== ZONE_BABU_WINDOW) {
          if (newWZone === 3 || newWZone === 7 || newWZone === 6 || newWZone === 9) {
            GameAudio.babuPaperShuffle(0.8);
          } else if (newWZone === 1) {
            GameAudio.babuSqueakFootsteps(0.8);
          }
          GameAudio.triggerBabuDynamicCue('distant_lurk', currentHalqaLevel, {
            pan: (newWZone === 1) ? 0.70 : 0.50,
            vol: 1.45,
            chance: 0.50,
            isDistant: true,
            addStatic: true
          });
        }

        if (newWZone === 5 && !rightShutterClosed && isHoldingScan && holdingForm) {
          triggerEnragedBabu();
        } else if (newWZone === ZONE_BABU_PEEK) {
          if (isHoldingScan && holdingForm) {
            triggerEnragedBabu();
          } else {
            // Stage 1: Always peek at Right Windowsill first so player sees monster lurking!
            setHumanoidPeekMode(whitenerMesh, true);
            whitenerWalkAnim = { fromX: 6.15, fromY: -0.82, fromZ: -3.45, toX: 4.80, toY: -0.74, toZ: -2.55, t: 0, dur: 0.65, yaw: -0.82 };
            GameAudio.babuWindowTapWarning();
          }
        } else if (newWZone === ZONE_BABU_WINDOW) {
          setHumanoidPeekMode(whitenerMesh, false);
          GameAudio.babuWindowRattleWarning();
          // STAGE 2: Babu walks from the Right Small Peek Window (z = -2.28) forward to the Main Right Window (z = 0.05)!
          const wDestX = rightShutterClosed ? 4.88 : 4.12;
          const wDestY = rightShutterClosed ? 0.02 : 0.02;
          whitenerWalkAnim = { fromX: 4.80, fromY: -0.74, fromZ: -2.55, toX: wDestX, toY: wDestY, toZ: 0.05, t: 0, dur: 0.55, yaw: -Math.PI / 2 };
          GameAudio.footstep(0.88);
          setTimeout(() => { if (state === 'PLAYING') GameAudio.footstep(0.88); }, 320);
          animate._rightShake = 0.65;
        } else if (newWZone === 1) {
          GameAudio.footstep(0.75);
        } else {
          GameAudio.footstep(0.75);
        }
        updateIntruderPositions();
      }
    } else {
      // Stage 2: Babu is at the Main Right Window!
      if (whitenerWalkAnim) {
        whitenerAtWindowTime = 0;
      } else {
        const prevWTime = whitenerAtWindowTime;
        whitenerAtWindowTime += dt;

        if (!whitenerAssault) {
          whitenerAssault = initAssaultProfile(windowHealth, false, whitenerEnraged);
        }

        // Arrival notice
        if (prevWTime < 0.1 && whitenerAtWindowTime >= 0.1) {
          animate._rightShake = whitenerEnraged ? 1.4 : 0.85;
          if (!whitenerEnraged) {
            GameAudio.shutterSlam(false);
          }
        }

        if (!rightShutterClosed) {
          // WINDOW IS OPEN: Arrives at open frame with 1.25s reaction grace period!
          if (typeof whitenerAssault.openWindowBreachTimer !== 'number') {
            whitenerAssault.openWindowBreachTimer = 1.25; // 1.25s grace period to slam shutter [2]!
            animate._rightShake = 1.15;
            if (!whitenerEnraged) {
              GameAudio.shutterSlam(false);
              GameAudio.triggerBabuDynamicCue('window_breach', currentHalqaLevel, { pan: 0.85, vol: 1.30, force: true });
            }
            showToast('SLAM RIGHT SHUTTER (2) NOW!');
          }
          whitenerAssault.openWindowBreachTimer -= dt;
          if (whitenerAssault.openWindowBreachTimer <= 0) {
            animate._shutterVelL = 34;
            animate._shutterVelR = 34;
            triggerImpactSlam('win', 'heavy');
            triggerJumpscare('whitener', 'Babu rushed through the open right window.');
            return;
          }
        } else {
          // Reset open window breach timer if closed
          if (whitenerAssault.openWindowBreachTimer !== undefined) delete whitenerAssault.openWindowBreachTimer;
          // SHUTTER IS SAFELY CLOSED: Babu strikes the closed window shutters

          // Periodic window pounding according to randomized assault profile
          if (whitenerAtWindowTime >= whitenerAssault.nextHitTime && whitenerAssault.hitCount < whitenerAssault.maxHits) {
            whitenerAssault.hitCount++;
            
            let rawDmg = Math.floor(whitenerAssault.minDmg + Math.random() * (whitenerAssault.maxDmg - whitenerAssault.minDmg + 1));
            
            // Safety guarantee: cap damage so window cannot break in one go from a healthy/moderate state
            const allowedDmg = Math.max(0, whitenerAssault.maxVisitDmg - whitenerAssault.dealtDmg);
            const actualDmg = Math.min(rawDmg, allowedDmg);
            
            windowHealth = Math.max(0, windowHealth - actualDmg);
            whitenerAssault.dealtDmg += actualDmg;

            const isHeavy = whitenerAssault.type === 'heavy';
            const isLight = whitenerAssault.type === 'light';

            animate._rightShake = isHeavy ? (0.95 + Math.random() * 0.35) : isLight ? 0.55 : (0.80 + Math.random() * 0.25);
            animate._winCrackFlash = isHeavy ? 1.0 : isLight ? 0.5 : 0.85;

            const severity = isHeavy ? 'heavy' : isLight ? 'light' : 'medium';
            triggerImpactSlam('win', severity);
            spawnDebrisBurst('window', severity, { x: 4.12, y: 2.18, z: 0.05 });
            if (GameAudio.babuDoorBang) GameAudio.babuDoorBang(0.95, whitenerAssault.playbackRate || 1.0); else GameAudio.shutterSlam(true);
            GameAudio.triggerBabuDynamicCue('window_slam', currentHalqaLevel, { pan: 0.95, vol: 1.15, chance: 0.50 });

            // Steady pacing synced to the 4-bang clip cadence
            whitenerAssault.nextHitTime += whitenerAssault.interval;

            if (windowHealth <= 0) {
              rightShutterClosed = false;
              // Explosive breaking window animation: Shutter leaves violently blow inward!
              spawnDebrisBurst('window', 'heavy', { x: 4.12, y: 2.18, z: 0.05 });
              spawnDebrisBurst('window', 'heavy', { x: 4.12, y: 2.18, z: -0.5 });
              animate._shutterVelL = 34;
              animate._shutterVelR = 34;
              triggerImpactSlam('win', 'heavy');
              triggerJumpscare('whitener');
              return;
            }
          } else if (whitenerAssault.hitCount >= whitenerAssault.maxHits && whitenerAtWindowTime >= whitenerAssault.nextHitTime) {
            tutDefendedOnce = true;
            whitenerEnraged = false;
            setHumanoidEnraged(whitenerMesh, false);
            animate._rightShake = 0.7;
            
            // Randomized retreat location (Right Wing only!):
            const rRet = Math.random();
            const retreatZ = rRet < 0.50 ? 3 : rRet < 0.80 ? 9 : 7; // 50% Staff Room (CAM 04), 30% Old Library (CAM 10), 20% Headmaster (CAM 08)
            WHITENER_PATH[0] = retreatZ;
            whitenerStep = 0;
            whitenerSpotIdx = Math.floor(Math.random() * (ZONE_SPOTS[retreatZ]?.length || 1));

            // Guaranteed recovery window: generous cooldown before returning
            whitenerWait = ((24.0 - hourProg * 6.0) * (0.90 + Math.random() * 0.40));
            whitenerAtWindowTime = 0;
            whitenerAssault = null;
            whitenerWalkAnim = null;
            updateIntruderPositions();
          }
        }
      }
    }
    }

    // Maintain strict visibility invariant on CCTV Form-45 props:
    // Only the current active camera's Form-45 is rendered when in CCTV, zero overhead on other cameras
    if (cctvFormProps) {
      cctvFormProps.forEach((prop, idx) => {
        if (prop) {
          const shouldBeVisible = !!(cctvOpen && cctvFormsScattered && cctvActiveFormCams && cctvActiveFormCams.has(idx) && idx === activeCamIdx);
          if (prop.visible !== shouldBeVisible) {
            prop.visible = shouldBeVisible;
          }
          if (shouldBeVisible && prop.userData && prop.userData.aura) {
            prop.userData.aura.material.opacity = 0.40 + Math.sin(now * 0.006) * 0.25;
          }
        }
      });
    }

    if (cctvOpen) {
      updateCctvMonsterWarning();
    }

    // 7. Camera & 3D Handheld Flashlight Positioning (Matching Reference Image 1)
    if (cctvOpen) {
      if (handTorchGroup) handTorchGroup.visible = false;
      if (handHammer) handHammer.visible = false;
      if (handForm) handForm.visible = false;
      const z = cctvZones[activeCamIdx];
      camera.position.copy(z.pos);
      const sweep = Math.sin(now * 0.0011) * 0.85;
      const lookX = z.look.x + sweep;
      const lookY = z.look.y;
      const lookZ = z.look.z;
      camera.lookAt(lookX, lookY, lookZ);

      // Dedicated Monster Identification & Spatial Tracking:
      const gLoc = GULLU_PATH[gulluStep];
      const wLoc = WHITENER_PATH[whitenerStep];
      const isKhakiHere = (activeCamIdx === gLoc || (activeCamIdx === 4 && (gLoc === ZONE_KHAKI_PEEK || gLoc === ZONE_KHAKI_DOOR)));
      const isBabuHere = (activeCamIdx === wLoc || (activeCamIdx === 5 && (wLoc === ZONE_BABU_PEEK || wLoc === ZONE_BABU_WINDOW)));

      // Night-Vision Camera Flashlight / Spotlight beam ONLY lights up if player actively presses/holds flashlight & has battery!
      const flashActive = false; // Flash mechanism removed
      const isCam5or6 = (activeCamIdx === 4 || activeCamIdx === 5);

      // Dynamically target the camera beam and horror spotlight directly at monster(s):
      let targetX = lookX, targetY = lookY, targetZ = lookZ;
      if (isKhakiHere && isBabuHere) {
        targetX = (gulluMesh.position.x + whitenerMesh.position.x) / 2;
        targetY = (gulluMesh.position.y + whitenerMesh.position.y) / 2 + 1.25;
        targetZ = (gulluMesh.position.z + whitenerMesh.position.z) / 2;
      } else if (isKhakiHere) {
        targetX = gulluMesh.position.x;
        targetY = gulluMesh.position.y + 1.25;
        targetZ = gulluMesh.position.z;
      } else if (isBabuHere) {
        targetX = whitenerMesh.position.x;
        targetY = whitenerMesh.position.y + 1.25;
        targetZ = whitenerMesh.position.z;
      }

      if (flashActive) {
        // =========================================================================
        //  HORROR BEAM RIG: High-intensity tactical beam piercing deep darkness
        // =========================================================================
        if (ambient) {
          ambient.color.setHex(0x2a2014);
          ambient.intensity = 0.35;
          ambient.layers.enable(0);
          ambient.layers.enable(1);
        }
        if (ambient) {
          ambient.color.setHex(0x2a2014);
          ambient.intensity = isCam5or6 ? 0.18 : 0.35;
          ambient.layers.enable(0);
          ambient.layers.enable(1);
        }
        if (cctvCamLight) {
          cctvCamLight.position.copy(camera.position);
          if (cctvCamTarget) {
            cctvCamTarget.position.set(targetX, targetY, targetZ);
            cctvCamTarget.updateMatrixWorld();
          }
          cctvCamLight.color.setHex(0xffe6a3);
          cctvCamLight.intensity = (isKhakiHere || isBabuHere) ? 7.5 : 5.5;
          cctvCamLight.angle = Math.PI / 3.4;
          cctvCamLight.penumbra = 0.35;
          cctvCamLight.distance = isCam5or6 ? 9.5 : 36;
        }
        if (cctvRoomFillLight) {
          cctvRoomFillLight.position.set(z.look.x, z.look.y + 1.2, z.look.z);
          cctvRoomFillLight.color.setHex(0x1a140d);
          cctvRoomFillLight.intensity = isCam5or6 ? 0.12 : 0.20;
        }
        scene.fog.color.setHex(isCam5or6 ? 0x010201 : 0x050403);
        scene.fog.density = isCam5or6 ? 0.022 : 0.005;
        scene.background.setHex(isCam5or6 ? 0x000201 : 0x050403);
      } else {
        // =========================================================================
        //  CCTV NIGHT VISION RIG: OPPRESSIVE, DARK, DEEP BLIND SPOTS
        // Low ambient, focused IR camera cone, pitch-black unlit corners & recesses
        // =========================================================================
        if (ambient) {
          ambient.color.setHex(0x1a3326);
          ambient.intensity = isCam5or6 ? 0.12 : 0.52; // Keep CAM 05 & CAM 06 courtyard dark, other rooms visible
          ambient.layers.enable(0);
          ambient.layers.enable(1);
        }
        if (cctvCamLight) {
          cctvCamLight.position.copy(camera.position);
          if (cctvCamTarget) {
            cctvCamTarget.position.set(lookX, lookY, lookZ);
            cctvCamTarget.updateMatrixWorld();
          }
          cctvCamLight.color.setHex(0x55ee99);
          cctvCamLight.intensity = isCam5or6 ? 2.4 : 2.6; // Clear CCTV IR camera beam covering the scene
          cctvCamLight.angle = isCam5or6 ? (Math.PI / 3.4) : (Math.PI / 2.7); // Focused on window/peek area for CAM 05/06
          cctvCamLight.penumbra = 0.45;
          cctvCamLight.distance = isCam5or6 ? 8.5 : 45; // Do NOT illuminate distant courtyard wall in CAM 05/06!
        }
        if (cctvRoomFillLight) {
          cctvRoomFillLight.position.set(z.look.x, z.look.y + 1.2, z.look.z);
          cctvRoomFillLight.color.setHex(0x14281e);
          cctvRoomFillLight.intensity = isCam5or6 ? 0.20 : 0.45; // Gentle ambient fill so room geometry is visible
        }
        scene.fog.color.setHex(isCam5or6 ? 0x010201 : 0x030805);
        scene.fog.density = isCam5or6 ? 0.026 : 0.0035; // Deep darkness for distant courtyard in CAM 05/06
        scene.background.setHex(isCam5or6 ? 0x000201 : 0x010502);
      }

      // Zone ambient lights across all CAM 01 - CAM 10 zones
      if (zoneLights && zoneLights.length > 0) {
        zoneLights.forEach(zl => {
          const zTarget = typeof zl.userData?.zoneIdx === 'number' ? zl.userData.zoneIdx : -1;
          if (zTarget === activeCamIdx) {
            let base = typeof zl.userData?.baseIntensity === 'number' ? zl.userData.baseIntensity : 0.65;
            // Phase 2: Sickly fluorescent micro-flicker on CAM 03 tube
            if (activeCamIdx === 2 && zl.color && zl.color.getHex() === 0x6ee7b7) {
              const flicker = Math.sin(now * 0.045) * 0.06 + (Math.random() < 0.018 ? -0.22 : 0);
              base = Math.max(0.18, base + flicker);
            }
            zl.intensity = flashActive ? (base * 3.0) : base;
          } else {
            zl.intensity = 0.0;
          }
        });
      }

      // CAM 05 & CAM 06 Corridor lights
      if (cam5Light) cam5Light.intensity = (activeCamIdx === 4) ? (flashActive ? 6.5 : 4.5) : 0.0;
      if (cam6Light) cam6Light.intensity = (activeCamIdx === 5) ? (flashActive ? 6.5 : 4.5) : 0.0;

      // Render monsters as eerie dark shadow silhouettes on CCTV unless flashed
      const monsterMode = flashActive ? 'flashed' : 'cctv_shadow';
      if (isKhakiHere && gulluMesh) {
        applyMonsterLighting(gulluMesh, monsterMode);
      }
      if (isBabuHere && whitenerMesh) {
        applyMonsterLighting(whitenerMesh, monsterMode);
      }

      // Dedicated Direct Key Spotlight only when camera flash is active:
      if (cctvMonsterLight) {
        if (flashActive && (isKhakiHere || isBabuHere)) {
          const cPos = camera.position;
          cctvMonsterLight.position.copy(cPos);
          if (cctvMonsterTarget) {
            cctvMonsterTarget.position.set(targetX, targetY, targetZ);
            cctvMonsterTarget.updateMatrixWorld();
          }
          cctvMonsterLight.color.setHex(0xffe6a3);
          cctvMonsterLight.intensity = 9.5;
          cctvMonsterLight.angle = (isKhakiHere && isBabuHere) ? Math.PI / 2.5 : Math.PI / 2.8;
          cctvMonsterLight.penumbra = 0.25;
        } else {
          cctvMonsterLight.intensity = 0;
        }
      }

      // Phase 2: CAM 03 Visual Water Dripping & Expanding Ripple Animation (No sound)
      const cam03Zone = cctvZones && cctvZones[2];
      if (cam03Zone && cam03Zone.coolerDrip && cam03Zone.coolerRipple) {
        const dripPeriod = 1.6; // Drips once every 1.6 seconds
        const cycle = ((now * 0.001) % dripPeriod) / dripPeriod;
        const startY = -0.55;
        const endY = -1.63;
        if (cycle < 0.52) {
          const tFall = cycle / 0.52;
          cam03Zone.coolerDrip.visible = true;
          cam03Zone.coolerDrip.position.y = startY + (endY - startY) * (tFall * tFall);
          cam03Zone.coolerDrip.scale.set(0.85, 1.2 + tFall * 0.9, 0.85);
          cam03Zone.coolerRipple.material.opacity = 0.0;
        } else {
          cam03Zone.coolerDrip.visible = false;
          const tRip = (cycle - 0.52) / 0.48;
          const scale = 1.0 + tRip * 4.2;
          cam03Zone.coolerRipple.scale.set(scale, scale, scale);
          cam03Zone.coolerRipple.material.opacity = Math.max(0, (1.0 - tRip) * 0.85);
        }
      }

      // Phase 3: CAM 04 Staff Room Rotating Ceiling Fan Blades (No sound)
      const cam04Zone = cctvZones && cctvZones[3];
      if (cam04Zone && cam04Zone.staffFanBlades) {
        cam04Zone.staffFanBlades.rotation.y += dt * 1.8;
      }

      // Phase 4: CAM 07 Bunsen Burner living flame micro-flicker
      const cam07Zone = cctvZones && cctvZones[6];
      if (cam07Zone && cam07Zone.bunsenFlame) {
        const bFlicker = 0.90 + Math.sin(now * 0.02) * 0.10 + (Math.random() - 0.5) * 0.08;
        cam07Zone.bunsenFlame.scale.set(bFlicker, bFlicker * (0.92 + Math.random() * 0.16), bFlicker);
        if (cam07Zone.bunsenLight) {
          cam07Zone.bunsenLight.intensity = 0.45 * bFlicker;
        }
      }

      // Phase 4: CAM 07 Creepy Skeleton Micro-Twitch & Screaming Jaw Shiver
      if (cam07Zone && cam07Zone.creepySkull) {
        const twitchCycle = (now * 0.001) % 5.5;
        if (twitchCycle < 0.12) {
          const jitter = Math.sin(now * 0.08) * 0.05;
          cam07Zone.creepySkull.rotation.z = 0.38 + jitter;
          cam07Zone.creepySkull.rotation.y = -0.48 + jitter * 0.4;
          if (cam07Zone.creepyMandible) {
            cam07Zone.creepyMandible.rotation.x = 0.52 + jitter * 0.35;
          }
        } else {
          cam07Zone.creepySkull.rotation.z = 0.38;
          cam07Zone.creepySkull.rotation.y = -0.48;
          if (cam07Zone.creepyMandible) {
            cam07Zone.creepyMandible.rotation.x = 0.52;
          }
        }
      }

      // Phase 4: CAM 09 Generator Shed Amber Safety Beacon slow pulse
      const cam09Zone = cctvZones && cctvZones[8];
      if (cam09Zone && cam09Zone.amberBeacon) {
        const pulse = 0.5 + 0.5 * Math.sin(now * 0.0035);
        cam09Zone.amberBeacon.intensity = 0.40 + pulse * 0.50;
      }

      // 6. Security Camera Atmospheric Fog: Low fog so room architecture and monsters are crisp
      if (!isCam5or6) {
        scene.fog.density = flashActive ? 0.003 : 0.008;
      }

      // 7. Real-time procedural CRT / CCTV analog static noise effect
      updateCctvStaticEffect(dt, isKhakiHere || isBabuHere);
    } else {
      if (ambient) {
        ambient.color.setHex(0x2d271c); ambient.intensity = 0.58; ambient.layers.enable(0); ambient.layers.disable(1);
      }
      if (cctvCamLight) cctvCamLight.intensity = 0;
      if (cctvRoomFillLight) cctvRoomFillLight.intensity = 0;
      if (cctvMonsterLight) cctvMonsterLight.intensity = 0;
      if (zoneLights && zoneLights.length > 0) {
        zoneLights.forEach(zl => {
          if (zl.userData?.zoneIdx === 0 || zl.userData?.zoneIdx === 1) {
            zl.intensity = 0.0; // Outdoor courtyard & gate dark through office window at night
          } else {
            zl.intensity = 0.25;
          }
        });
      }
      if (cam5Light) cam5Light.intensity = 0.0;
      if (cam6Light) cam6Light.intensity = 0.0;
      scene.fog.density = 0.068;
      updateCctvStaticEffect(dt, false);
      let joltY = 0;
      let joltX = 0;
      if (animate._camImpact > 0) {
        animate._camImpact = Math.max(0, animate._camImpact - dt);
        joltY = Math.sin(now * 0.14) * animate._camImpact * 0.18;
        joltX = Math.cos(now * 0.12) * animate._camImpact * 0.12;
      }
      if (animate._leftShake > 0 || animate._rightShake > 0) {
        joltY += Math.sin(now * 0.12) * (0.022 * shakeMultiplier);
      }
      camera.position.set(joltX, 1.72 + joltY, 1.85);
      currentYaw += (targetYaw - currentYaw) * Math.min(1, dt * 14);
      const animDir = (currentYaw < -0.45) ? 1 : (currentYaw > 0.45) ? -1 : 0;
      document.body.classList.toggle('look-left', animDir === -1);
      document.body.classList.toggle('look-center', animDir === 0);
      document.body.classList.toggle('look-right', animDir === 1);
      const lookX = -Math.sin(currentYaw) * 5;
      const lookZ = 1.85 - Math.cos(currentYaw) * 5;
      const lookY = 1.62 + mouseNormY * 0.35 + joltY * 0.8;
      camera.lookAt(lookX, lookY, lookZ);

      if (flashlight) flashlight.position.copy(camera.position);
      flashTarget.position.set(
        lookX + mouseNormX * 1.4,
        1.4 + mouseNormY * 1.5,
        lookZ
      );

      if (handTorchGroup) {
        handTorchGroup.visible = false;
      }
      if (!cctvOpen) {
        if (handHammer && !isHoldingRepair) {
          handHammer.visible = (equippedItem === 'HAMMER');
        }
        if (handForm) {
          handForm.visible = (equippedItem === 'FORM' || holdingForm);
        }
      }
    }

    // Bulletproof safety lock: Held items (Hammer, Form-45, Torch) must NEVER be visible during CCTV camera view
    if (cctvOpen) {
      if (handHammer) handHammer.visible = false;
      if (handForm) handForm.visible = false;
      if (handStamp) handStamp.visible = false;
      if (handTorchGroup) handTorchGroup.visible = false;
    }

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    updateRendererSize();
  });

  requestAnimationFrame(animate);
})();
