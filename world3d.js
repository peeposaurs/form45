// Authentic PS1 / Puppet Combo Sculpted Low-Poly Humanoids & Reference Atmosphere for Paanch Ghantay at NA-47
(function(root) {
  'use strict';

  // --- PS1 Dithered / Photo-Shaded Texture Generator ---
  function makePS1Texture(w, h, drawFn, ditherStrength = 14) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    drawFn(ctx, w, h);

    // 4x4 Ordered Bayer Matrix + 15-bit PS1 Color Quantization
    const bayer4 = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
 ];
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const b = (bayer4[y & 3][x & 3] / 15.0 - 0.5) * ditherStrength;
        const grain = ((Math.sin((x * 37 + y * 113) * 0.7) * 43758.5453) % 1 - 0.5) * (ditherStrength * 0.6);
        for (let cIdx = 0; cIdx < 3; cIdx++) {
          let v = Math.max(0, Math.min(255, d[i + cIdx] + b + grain));
          // Quantize to 5-bit per channel (PS1 15-bit color depth look)
          v = Math.round(v / 8) * 8;
          d[i + cIdx] = v;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // --- Photo-Shaded Uncanny PS1 Face Texture (Matches Reference Images 1 & 2) ---
  function createUncannyFaceTex(type) {
    // Cylinder/Sphere UV mapped: u = 0.5 is center front of face (+Z)
    // u = 0.0 and 1.0 meet at center back of head (-Z)
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (type === 'gullu') {
        // =========================================================================
        //  "KHAKI" FACE: PREDATORY VOID SOCKETS & SKULL-TAUT CLENCHED GRIMACE
        // Deep pitch-black sunken eye sockets with nocturnal retro-reflective amber glint,
        // faded jagged combat scar, emaciated cheek hollows, taut skull grimace with exposed gums.
        // =========================================================================

        // 1. Sun-scorched, weathered, ashy-olive field skin tone with planar commando shading
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#8c673d');
        skinGrad.addColorStop(0.5, '#73502d');
        skinGrad.addColorStop(1, '#3b2512');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Solid dark military hair covering back and sides
        const hairColor = '#120d09';
        ctx.fillStyle = hairColor;
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);

        // 3. Gaunt, hollow, emaciated skull contours beneath cheekbones
        const cheekGrad = ctx.createLinearGradient(28, 0, 100, 0);
        cheekGrad.addColorStop(0, 'rgba(12, 8, 4, 0.90)');
        cheekGrad.addColorStop(0.22, 'rgba(0,0,0,0)');
        cheekGrad.addColorStop(0.78, 'rgba(0,0,0,0)');
        cheekGrad.addColorStop(1, 'rgba(12, 8, 4, 0.90)');
        ctx.fillStyle = cheekGrad;
        ctx.fillRect(28, 0, 72, h);

        // Deep sunken cheek pits
        for (const cx of [39, 89]) {
          const hollow = ctx.createRadialGradient(cx, 75, 2, cx, 75, 16);
          hollow.addColorStop(0, 'rgba(8, 4, 2, 0.88)');
          hollow.addColorStop(1, 'rgba(8, 4, 2, 0)');
          ctx.fillStyle = hollow;
          ctx.beginPath();
          ctx.arc(cx, 75, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Heavy commando brow ridge casting deep pitch-black shadow over eyes
        ctx.fillStyle = '#060402';
        ctx.fillRect(34, 37, 60, 8);

        // 5. DEEP SUNKEN VOID EYE SOCKETS & NOCTURNAL EYE-SHINE
        for (const ex of [47, 81]) {
          // Deep sunken pitch-black orbital cavity
          ctx.fillStyle = '#040201';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 10, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cold, dead, glassy sclera rim barely catching light inside the pit
          ctx.fillStyle = '#524336';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 7.5, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dark void iris
          ctx.fillStyle = '#050302';
          ctx.beginPath();
          ctx.arc(ex, 51, 3.8, 0, Math.PI * 2);
          ctx.fill();

          // Piercing nocturnal predator tapetum lucidum reflection (amber-gold shine)
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(ex - 1, 50, 2.2, 2.2);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(ex, 50.5, 1, 1);

          // Eyelid shadow fold
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.fillRect(ex - 8, 45, 16, 3);
        }

        // 6. Jagged, pale faded combat scar cutting through left eyebrow and down cheekbone
        ctx.strokeStyle = '#c49e7b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(43, 33);
        ctx.lineTo(45, 43);
        ctx.lineTo(42, 54);
        ctx.lineTo(44, 66);
        ctx.stroke();
        // Scar tissue stitch marks
        ctx.strokeStyle = '#3e2316';
        ctx.lineWidth = 1;
        for (const sy of [37, 47, 58]) {
          ctx.beginPath();
          ctx.moveTo(41, sy);
          ctx.lineTo(46, sy - 1);
          ctx.stroke();
        }

        // 7. Straight, sharp aquiline military nose bridge
        const nose = ctx.createLinearGradient(59, 45, 69, 45);
        nose.addColorStop(0, 'rgba(20, 10, 5, 0.75)');
        nose.addColorStop(0.5, '#b88f5d');
        nose.addColorStop(1, 'rgba(20, 10, 5, 0.75)');
        ctx.fillStyle = nose;
        ctx.fillRect(59, 45, 10, 28);
        ctx.fillStyle = '#0a0502';
        ctx.fillRect(58, 71, 4, 3);
        ctx.fillRect(66, 71, 4, 3);

        // 8. Thick, dark Punjabi Handlebar Mustache (Mooch) curling upward
        ctx.fillStyle = '#0a0705';
        ctx.beginPath();
        ctx.moveTo(64, 73);
        ctx.quadraticCurveTo(46, 73, 34, 69);
        ctx.quadraticCurveTo(32, 65, 30, 62); // Upward razor curl tip
        ctx.quadraticCurveTo(34, 76, 48, 83);
        ctx.lineTo(64, 82);
        ctx.lineTo(80, 83);
        ctx.quadraticCurveTo(94, 76, 98, 62);
        ctx.quadraticCurveTo(96, 65, 94, 69);
        ctx.quadraticCurveTo(82, 73, 64, 73);
        ctx.closePath();
        ctx.fill();

        // 9. UNNATURALLY WIDE, TAUT PREDATORY GRIMACE WITH EXPOSED GUMS (y in [84, 98])
        // Dark gaping mouth slit stretched unnaturally wide
        ctx.fillStyle = '#020101';
        ctx.beginPath();
        ctx.moveTo(37, 88);
        ctx.lineTo(91, 88);
        ctx.lineTo(89, 97);
        ctx.lineTo(39, 97);
        ctx.closePath();
        ctx.fill();

        // Pale, bloodless grey-pink gums exposed above teeth
        ctx.fillStyle = '#7a524a';
        ctx.fillRect(40, 85, 48, 2.5);

        // Tightly clenched, razor-fine grinding teeth row
        for (let tx = 41; tx <= 87; tx += 4) {
          // Upper teeth
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(tx, 87.5, 2.8, 4);
          // Lower teeth
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(tx, 92, 2.8, 3.5);
          // Razor-thin black gaps between teeth
          ctx.fillStyle = '#000000';
          ctx.fillRect(tx + 2.8, 87.5, 1.2, 8);
        }

        // Taut cheek tension crease lines pulling grin to corners
        ctx.strokeStyle = '#180a06';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(37, 88); ctx.lineTo(32, 82);
        ctx.moveTo(91, 88); ctx.lineTo(96, 82);
        ctx.stroke();

      } else if (type === 'whitener') {
        // =========================================================================
        //  "BABU" FACE: DERANGED, BULGING, SLEEPLESS RIGGING MANIC HORROR
        // Massive purple-black eye bags (halqay), sickly jaundiced sclera with ruptured crimson veins,
        // exposed bloody waterlines, wild asymmetric pupils, crooked rictus grin with rotting teeth,
        // betel-nut/tobacco drool stain, clammy paranoia sweat sheen.
        // =========================================================================

        // 1. Clammy, sickly jaundiced bureaucrat skin tone
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#af8c5e');
        skinGrad.addColorStop(0.55, '#926c40');
        skinGrad.addColorStop(1, '#543b20');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Dark salt-and-pepper hair on back and sides
        const hairColor = '#181410';
        ctx.fillStyle = hairColor;
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);
        // Grey aging streaks
        ctx.fillStyle = 'rgba(180, 185, 195, 0.45)';
        for (let hx = 2; hx < 26; hx += 5) {
          ctx.fillRect(hx, 30 + (hx % 4) * 12, 2, 8);
          ctx.fillRect(102 + hx, 30 + (hx % 4) * 12, 2, 8);
        }

        // 3. Paranoia forehead creases & broken cheek capillaries (Rosacea)
        ctx.strokeStyle = 'rgba(30, 15, 8, 0.70)';
        ctx.lineWidth = 1.5;
        for (const wy of [27, 32, 37]) {
          ctx.beginPath();
          ctx.moveTo(40, wy);
          ctx.quadraticCurveTo(64, wy - 3, 88, wy);
          ctx.stroke();
        }

        // Mottled broken red capillaries on cheeks
        ctx.fillStyle = 'rgba(185, 28, 28, 0.32)';
        for (const cx of [35, 38, 41, 87, 90, 93]) {
          ctx.fillRect(cx, 68 + (cx % 5) * 2, 2, 3);
        }

        // 4. MASSIVE SLEEPLESS PURPLE-BLACK EYE BAGS (HALQAY)
        for (const ex of [45, 83]) {
          const bag = ctx.createRadialGradient(ex, 65, 2, ex, 65, 17);
          bag.addColorStop(0, 'rgba(25, 8, 22, 0.95)'); // bruised necrotic violet
          bag.addColorStop(0.65, 'rgba(38, 14, 14, 0.78)');
          bag.addColorStop(1, 'rgba(38, 14, 14, 0)');
          ctx.fillStyle = bag;
          ctx.beginPath();
          ctx.arc(ex, 65, 17, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. UNBLINKING, MANIC BLOODSHOT HORROR EYES (Slightly smaller, tighter proportion)
        for (const ex of [46, 82]) {
          // Socket shadow
          ctx.fillStyle = '#040201';
          ctx.beginPath();
          ctx.arc(ex, 54, 10.5, 0, Math.PI * 2);
          ctx.fill();

          // Sickly, jaundiced, yellowish-grey sclera (radius 8.5)
          ctx.fillStyle = '#ded6af';
          ctx.beginPath();
          ctx.arc(ex, 54, 8.5, 0, Math.PI * 2);
          ctx.fill();

          // Ruptured subconjunctival hemorrhage (blood pools in eye corners)
          ctx.fillStyle = 'rgba(153, 27, 27, 0.55)';
          ctx.beginPath();
          ctx.arc(ex - 5.5, 54, 3, 0, Math.PI * 2);
          ctx.arc(ex + 5.5, 54, 3, 0, Math.PI * 2);
          ctx.fill();

          // Intense ruptured red spiderweb capillaries
          ctx.strokeStyle = '#b91c1c';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ex - 8, 54); ctx.lineTo(ex - 3, 53); ctx.lineTo(ex - 1, 51);
          ctx.moveTo(ex + 8, 55); ctx.lineTo(ex + 4, 54); ctx.lineTo(ex + 2, 56);
          ctx.moveTo(ex - 5, 49); ctx.lineTo(ex - 2, 52);
          ctx.moveTo(ex + 5, 59); ctx.lineTo(ex + 2, 55);
          ctx.stroke();

          // Raw bloody exposed lower waterline (conjunctiva)
          ctx.strokeStyle = '#991b1b';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(ex, 54, 8.5, 0.25, Math.PI - 0.25);
          ctx.stroke();
        }

        // PSYCHOTIC PUPIL ASYMMETRY (Scaled for smaller horror eyes):
        // Left eye: Hyper-dilated black void staring directly forward
        ctx.fillStyle = '#030201';
        ctx.beginPath();
        ctx.arc(45.5, 54, 4.0, 0, Math.PI * 2);
        ctx.fill();
        // Tiny manic catchlight
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(44.5, 52.5, 1.2, 1.2);

        // Right eye: Constricted psychotic pinprick pupil twitching outward
        ctx.fillStyle = '#78350f'; // dirty amber-brown iris ring
        ctx.beginPath();
        ctx.arc(83.0, 53.5, 3.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#030201'; // constricted pinprick pupil
        ctx.beginPath();
        ctx.arc(83.5, 53.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(82.5, 52.5, 1.0, 1.0);

        // 6. Fleshy, bloated bulbous nose
        const bNose = ctx.createRadialGradient(64, 69, 1, 64, 69, 11);
        bNose.addColorStop(0, '#c49a68');
        bNose.addColorStop(0.7, '#8f6538');
        bNose.addColorStop(1, 'rgba(40, 20, 10, 0.85)');
        ctx.fillStyle = bNose;
        ctx.beginPath();
        ctx.ellipse(64, 69, 9, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        // Large rounded fleshy nostrils
        ctx.fillStyle = '#140803';
        ctx.beginPath();
        ctx.arc(58, 73, 2.5, 0, Math.PI * 2);
        ctx.arc(70, 73, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 7. Disheveled salt-and-pepper civil servant mustache
        ctx.fillStyle = '#1c150e';
        ctx.beginPath();
        ctx.moveTo(64, 76);
        ctx.quadraticCurveTo(46, 75, 42, 83);
        ctx.quadraticCurveTo(55, 84, 64, 80);
        ctx.quadraticCurveTo(73, 84, 86, 83);
        ctx.quadraticCurveTo(82, 75, 64, 76);
        ctx.closePath();
        ctx.fill();

        // 8. ASYMMETRICAL, TWITCHING RICTUS GRIN WITH ROTTING TEETH & BETEL-NUT DROOL
        // Grin pulls higher on his left cheek in an unhinged manic spasm
        ctx.fillStyle = '#020101';
        ctx.beginPath();
        ctx.moveTo(33, 91);
        ctx.quadraticCurveTo(64, 108, 95, 84); // Left corner pulls up high
        ctx.quadraticCurveTo(64, 80, 33, 91);
        ctx.fill();

        // Blackened necrotic gums
        ctx.fillStyle = '#261008';
        ctx.fillRect(35, 84, 58, 2.5);

        // Decayed, chipped, tobacco/paan stained teeth with MISSING TOOTH GAP
        const teeth = [
          { x: 37, w: 4.2, h: 5.5, c: '#fde68a' },
          { x: 43, w: 4.0, h: 6.5, c: '#b45309' }, // rotted dark brown
          { x: 49, w: 3.8, h: 6.5, c: '#fde68a' },
          // GAP at 53-57 (Missing front tooth void)
          { x: 58, w: 4.5, h: 7.5, c: '#78350f' }, // blackened tobacco stain
          { x: 64, w: 4.5, h: 7.0, c: '#fef3c7' },
          { x: 70, w: 4.0, h: 6.5, c: '#d97706' },
          { x: 76, w: 4.2, h: 6.0, c: '#b45309' },
          { x: 82, w: 4.0, h: 5.5, c: '#fde68a' },
          { x: 88, w: 3.5, h: 5.0, c: '#78350f' }
 ];

        for (const t of teeth) {
          // Upper tooth
          ctx.fillStyle = t.c;
          ctx.fillRect(t.x, 85, t.w, t.h);
          // Lower tooth (irregular crooked alignment)
          ctx.fillRect(t.x + 0.5, 93, t.w * 0.85, t.h * 0.7);
          // Dark cavity separation
          ctx.fillStyle = '#000000';
          ctx.fillRect(t.x + t.w, 85, 1.4, 14);
        }

        // Dark tobacco/betel-nut stain trickling from sagging mouth corner
        ctx.strokeStyle = '#3e1608';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(33, 91);
        ctx.quadraticCurveTo(32, 99, 35, 107);
        ctx.stroke();

        // 9. Drooping double chin fold & clammy paranoia sweat sheen
        ctx.strokeStyle = '#220e06';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(34, 108);
        ctx.quadraticCurveTo(64, 121, 94, 108);
        ctx.stroke();

        // Clammy sweat sheen glints across forehead & nose
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(51, 33, 2, 3);
        ctx.fillRect(75, 35, 2, 4);
        ctx.fillRect(63, 67, 3, 2); // nose shine
        ctx.fillRect(38, 73, 2, 3); // cheek sweat

      } else {
        // Chacha Chowkidar default
        ctx.fillStyle = '#8a643b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(34, 74, 60, 50);
      }
    }, 16);
  }

  // =========================================================================
  //  DETAILED MONSTER SKINS & ANIMATED TEXTURE VARIANT SYSTEM
  // Supports Default Patrol, Enraged (Animated 3-Frame Cycle), Analog Horror,
  // Midnight Ops / Stealth, and Battle-Worn / Rigging Breakdown.
  // =========================================================================

  const _textureCache = new Map();
  function getCachedTexture(key, createFn) {
    if (!_textureCache.has(key)) {
      _textureCache.set(key, createFn());
    }
    return _textureCache.get(key);
  }

  // --- 1. ENRAGED FACE TEXTURE (3 VISCERAL ANIMATION FRAMES) ---
  function createEnragedFaceTex(type, frame = 0) {
    const fIdx = frame % 3;
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (type === 'gullu') {
        // ---  KHAKI ENRAGED: ARTERIAL FLUSH, BURSTING VEINS, EXPOSED FERAL SNARL ---
        // 1. Furious, blood-engorged, ruddy flushed commando skin
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#9e3f24');
        skinGrad.addColorStop(0.5, '#7c2813');
        skinGrad.addColorStop(1, '#3b1208');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Pitch black commando hair
        ctx.fillStyle = '#0a0604';
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);

        // 3. Gaunt, taut shadow hollows
        const cheekGrad = ctx.createLinearGradient(28, 0, 100, 0);
        cheekGrad.addColorStop(0, 'rgba(10, 4, 2, 0.95)');
        cheekGrad.addColorStop(0.22, 'rgba(0,0,0,0)');
        cheekGrad.addColorStop(0.78, 'rgba(0,0,0,0)');
        cheekGrad.addColorStop(1, 'rgba(10, 4, 2, 0.95)');
        ctx.fillStyle = cheekGrad;
        ctx.fillRect(28, 0, 72, h);

        // Sunken cheek pits with angry red capillary flush
        for (const cx of [39, 89]) {
          const hollow = ctx.createRadialGradient(cx, 75, 2, cx, 75, 18);
          hollow.addColorStop(0, 'rgba(20, 4, 4, 0.92)');
          hollow.addColorStop(0.6, 'rgba(120, 20, 20, 0.45)');
          hollow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = hollow;
          ctx.beginPath();
          ctx.arc(cx, 75, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. ANIMATED THROBBING BULGING TEMPLE & FOREHEAD VEINS
        const vW = (fIdx === 0) ? 2.4 : (fIdx === 1) ? 3.6 : 2.9;
        ctx.strokeStyle = '#2b040e';
        ctx.lineWidth = vW;
        ctx.lineCap = 'round';
        // Left temple pulsing vein network
        ctx.beginPath();
        ctx.moveTo(33, 26);
        ctx.quadraticCurveTo(28 + (fIdx === 1 ? -1 : 0), 38, 32, 46);
        ctx.lineTo(26, 56);
        ctx.moveTo(31, 41);
        ctx.lineTo(24, 44);
        ctx.stroke();
        // Right temple pulsing vein network
        ctx.beginPath();
        ctx.moveTo(95, 26);
        ctx.quadraticCurveTo(100 + (fIdx === 1 ? 1 : 0), 38, 96, 46);
        ctx.lineTo(102, 56);
        ctx.moveTo(97, 41);
        ctx.lineTo(104, 44);
        ctx.stroke();
        // Center forehead anger fork (Y-vein)
        ctx.beginPath();
        ctx.moveTo(64, 25);
        ctx.lineTo(64, 34 + (fIdx === 1 ? 1 : 0));
        ctx.lineTo(58, 40);
        ctx.moveTo(64, 34 + (fIdx === 1 ? 1 : 0));
        ctx.lineTo(70, 40);
        ctx.stroke();

        // Pulsing vein highlight rim
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(34, 27); ctx.lineTo(30, 45);
        ctx.moveTo(94, 27); ctx.lineTo(98, 45);
        ctx.stroke();

        // 5. Brow ridge furrowed in feral rage
        ctx.fillStyle = '#060202';
        ctx.fillRect(32, 38, 64, 9);
        // Vertical glabellar anger creases
        ctx.strokeStyle = '#150305';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(61, 34); ctx.lineTo(61, 46);
        ctx.moveTo(67, 34); ctx.lineTo(67, 46);
        ctx.stroke();

        // 6. BLOODSHOT HORROR EYES & FIERY NOCTURNAL GLOW
        for (const ex of [47, 81]) {
          // Socket shadow
          ctx.fillStyle = '#020101';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 10.5, 8.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Ruptured crimson sclera
          ctx.fillStyle = (fIdx === 1) ? '#7f1d1d' : '#991b1b';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 8.0, 5.0, 0, 0, Math.PI * 2);
          ctx.fill();

          // Branching bright red capillary webs
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(ex - 7, 51); ctx.lineTo(ex - 2, 50);
          ctx.moveTo(ex + 7, 51); ctx.lineTo(ex + 2, 52);
          ctx.stroke();

          // Dilated predator pupil
          ctx.fillStyle = '#050101';
          ctx.beginPath();
          ctx.arc(ex, 51, 4.2, 0, Math.PI * 2);
          ctx.fill();

          // Fierce burning rage tapetum lucidum glint
          const glowColor = (fIdx === 0) ? '#f59e0b' : (fIdx === 1) ? '#ef4444' : '#f97316';
          ctx.fillStyle = glowColor;
          ctx.fillRect(ex - 1.2, 49.8, 2.6, 2.6);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(ex - 0.4, 50.4, 1.2, 1.2);
        }

        // 7. INFLAMED RUPTURED COMBAT SCAR
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(43, 32); ctx.lineTo(45, 43); ctx.lineTo(42, 54); ctx.lineTo(44, 68);
        ctx.stroke();
        // Bleeding crimson center
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(43, 34); ctx.lineTo(45, 44); ctx.lineTo(42, 55);
        ctx.stroke();
        // Blood droplet oozing down cheek
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(43, 68 + (fIdx === 1 ? 2 : 0), 2.5, 4);

        // 8. Aquiline military nose bridge
        const nose = ctx.createLinearGradient(59, 45, 69, 45);
        nose.addColorStop(0, 'rgba(25, 4, 4, 0.85)');
        nose.addColorStop(0.5, '#b4533c');
        nose.addColorStop(1, 'rgba(25, 4, 4, 0.85)');
        ctx.fillStyle = nose;
        ctx.fillRect(59, 45, 10, 28);
        ctx.fillStyle = '#0a0202';
        ctx.fillRect(58, 71, 4, 3);
        ctx.fillRect(66, 71, 4, 3);

        // 9. Bristling Punjabi handlebar mustache
        ctx.fillStyle = '#080503';
        ctx.beginPath();
        ctx.moveTo(64, 73);
        ctx.quadraticCurveTo(46, 73, 34, 69);
        ctx.quadraticCurveTo(32, 65, 30, 62);
        ctx.quadraticCurveTo(34, 76, 48, 83);
        ctx.lineTo(64, 82);
        ctx.lineTo(80, 83);
        ctx.quadraticCurveTo(94, 76, 98, 62);
        ctx.quadraticCurveTo(96, 65, 94, 69);
        ctx.quadraticCurveTo(82, 73, 64, 73);
        ctx.closePath();
        ctx.fill();

        // 10. WIDE EXPOSED FERAL COMBAT SNARL (Teeth grinding, gums exposed)
        ctx.fillStyle = '#020101';
        ctx.beginPath();
        ctx.moveTo(33, 87);
        ctx.lineTo(95, 87);
        ctx.lineTo(92, 99);
        ctx.lineTo(36, 99);
        ctx.closePath();
        ctx.fill();

        // Raw inflamed receding gums
        ctx.fillStyle = '#831843';
        ctx.fillRect(36, 84, 56, 3);

        // Sharp, clenched predatory grinding teeth with blood flecks
        for (let tx = 37; tx <= 91; tx += 4) {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(tx, 87, 2.8, 5);
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(tx, 93, 2.8, 4);
          // Dark spacing
          ctx.fillStyle = '#000000';
          ctx.fillRect(tx + 2.8, 87, 1.2, 10);
        }
        // Crimson saliva strands bridging teeth in frame 1 & 2
        if (fIdx > 0) {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(45, 89, 1.5, 6);
          ctx.fillRect(81, 89, 1.5, 6);
        }

        // Taut cheek muscle cords
        ctx.strokeStyle = '#220808';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(33, 87); ctx.lineTo(27, 80);
        ctx.moveTo(95, 87); ctx.lineTo(101, 80);
        ctx.stroke();

      } else if (type === 'whitener') {
        // ---  BABU ENRAGED: WHITE-OUT SPLATTER, PSYCHOTIC SCLERA, MANIC DROOL ---
        // 1. Sickly jaundiced, sweat-soaked skin with violent rage flush
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#ad5a2c');
        skinGrad.addColorStop(0.55, '#87401a');
        skinGrad.addColorStop(1, '#4e200a');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Disheveled salt-and-pepper hair
        ctx.fillStyle = '#140f0b';
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);

        // 3. Paranoia forehead creases with engorged purple stress veins
        ctx.strokeStyle = '#3b0d1a';
        ctx.lineWidth = (fIdx === 1) ? 3.0 : 2.2;
        ctx.beginPath();
        ctx.moveTo(42, 28);
        ctx.quadraticCurveTo(64, 24 + (fIdx === 1 ? -1 : 0), 86, 28);
        ctx.moveTo(44, 34);
        ctx.quadraticCurveTo(64, 30, 84, 34);
        ctx.stroke();

        // 4. MASSIVE ENGORGED PURPLE-BLACK EYE BAGS (HALQAY)
        for (const ex of [45, 83]) {
          const bag = ctx.createRadialGradient(ex, 65, 2, ex, 65, 19);
          bag.addColorStop(0, 'rgba(48, 8, 38, 0.98)');
          bag.addColorStop(0.7, 'rgba(80, 16, 24, 0.82)');
          bag.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = bag;
          ctx.beginPath();
          ctx.arc(ex, 65, 19, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. UNBLENDED PSYCHOTIC BULGING EYES (MASSIVE HEMORRHAGE)
        for (const ex of [46, 82]) {
          // Socket
          ctx.fillStyle = '#020101';
          ctx.beginPath();
          ctx.arc(ex, 54, 11.5, 0, Math.PI * 2);
          ctx.fill();

          // Sclera: Deep ruptured blood red with sickly yellow patches
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.arc(ex, 54, 9.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(ex, 54, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Bursting spiderweb capillaries
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(ex - 8, 54); ctx.lineTo(ex - 2, 53);
          ctx.moveTo(ex + 8, 55); ctx.lineTo(ex + 2, 54);
          ctx.stroke();
        }

        // ASYMMETRICAL TWITCHING PUPILS (Shuddering across frames)
        const pOff = (fIdx === 1) ? 1.4 : (fIdx === 2) ? -1.0 : 0;
        // Left Eye: Giant hyper-dilated black hole
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(45.5 + pOff, 54, 4.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(44.5 + pOff, 52, 1.4, 1.4);

        // Right Eye: Pinprick crazed dot
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.arc(83.0 - pOff, 53.5, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(83.5 - pOff, 53.5, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // 6. Fleshy nose
        const bNose = ctx.createRadialGradient(64, 69, 1, 64, 69, 11);
        bNose.addColorStop(0, '#c77e48');
        bNose.addColorStop(0.7, '#883a15');
        bNose.addColorStop(1, 'rgba(40, 10, 5, 0.9)');
        ctx.fillStyle = bNose;
        ctx.beginPath();
        ctx.ellipse(64, 69, 9, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. Mustache
        ctx.fillStyle = '#160d07';
        ctx.beginPath();
        ctx.moveTo(64, 76);
        ctx.quadraticCurveTo(46, 75, 42, 83);
        ctx.quadraticCurveTo(55, 84, 64, 80);
        ctx.quadraticCurveTo(73, 84, 86, 83);
        ctx.quadraticCurveTo(82, 75, 64, 76);
        ctx.closePath();
        ctx.fill();

        // 8. UNHINGED SCREAMING RICTUS SNARL
        ctx.fillStyle = '#020101';
        ctx.beginPath();
        ctx.moveTo(31, 90);
        ctx.quadraticCurveTo(64, 112, 97, 83);
        ctx.quadraticCurveTo(64, 78, 31, 90);
        ctx.fill();

        // Rotting chipped teeth with missing tooth gap
        const teeth = [
          { x: 35, w: 4.5, h: 6.0, c: '#fde68a' },
          { x: 41, w: 4.0, h: 7.0, c: '#92400e' },
          { x: 47, w: 4.0, h: 7.0, c: '#fde68a' },
          // Missing gap at 53-58
          { x: 59, w: 4.5, h: 8.0, c: '#451a03' },
          { x: 65, w: 4.5, h: 7.5, c: '#fef3c7' },
          { x: 71, w: 4.0, h: 7.0, c: '#b45309' },
          { x: 77, w: 4.2, h: 6.5, c: '#78350f' },
          { x: 83, w: 4.0, h: 6.0, c: '#fde68a' },
          { x: 89, w: 3.5, h: 5.5, c: '#451a03' }
 ];
        for (const t of teeth) {
          ctx.fillStyle = t.c;
          ctx.fillRect(t.x, 85, t.w, t.h);
          ctx.fillRect(t.x + 0.5, 94, t.w * 0.85, t.h * 0.7);
          ctx.fillStyle = '#000000';
          ctx.fillRect(t.x + t.w, 85, 1.4, 15);
        }

        // Viscous dark betel-nut / paan drool pouring down chin
        ctx.strokeStyle = '#3b0c03';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(31, 90);
        ctx.quadraticCurveTo(29, 102, 34, 115 + (fIdx === 1 ? 3 : 0));
        ctx.moveTo(96, 85);
        ctx.quadraticCurveTo(98, 98, 93, 110);
        ctx.stroke();

        // 9. VISCERAL WHITE-OUT / WHITENER FLUID SPLATTERS (Real-time animated drips!)
        ctx.fillStyle = '#ffffff';
        // Massive cheek splatter blob
        ctx.beginPath();
        ctx.arc(86, 68, 6.5, 0, Math.PI * 2);
        ctx.arc(91, 74, 5.0, 0, Math.PI * 2);
        ctx.arc(81, 71, 4.0, 0, Math.PI * 2);
        ctx.fill();
        // Droplet tail running down cheek
        ctx.fillRect(89, 74, 3.0, 14 + (fIdx === 1 ? 2 : fIdx === 2 ? 4 : 0));
        ctx.fillRect(90, 89 + (fIdx === 1 ? 2 : fIdx === 2 ? 4 : 0), 2.0, 3.5);

        // Whitener splashes across bridge of nose & lip
        ctx.fillRect(61, 62, 5, 4);
        ctx.fillRect(57, 65, 3, 3);
        ctx.fillRect(66, 64, 4, 3);
        ctx.fillRect(48, 80, 4, 3);
        ctx.fillRect(72, 81, 5, 3);

        // Opaque chalky border on whitener
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(89, 74, 3.0, 14);

        // Clammy sweat glints
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(49, 32, 2, 4);
        ctx.fillRect(78, 33, 2, 4);
        ctx.fillRect(63, 67, 3, 2);
      }
    }, 16);
  }

  // --- 2. ENRAGED TORSO / SHIRT TEXTURE ---
  function createEnragedShirtTex(type) {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      if (type === 'whitener') {
        // Charcoal Sadri splattered with White-Out correction fluid & leaking ink
        ctx.fillStyle = '#1c2024';
        ctx.fillRect(0, 0, w, h);

        // Cream collar peeking
        ctx.fillStyle = '#d4cbb3';
        ctx.fillRect(27, 0, 10, 6);

        // Placket and strained popping buttons
        ctx.fillStyle = '#111417';
        ctx.fillRect(29, 6, 6, 52);
        ctx.fillStyle = '#d4af37';
        for (const by of [12, 22, 42, 52]) {
          ctx.fillRect(31, by, 3, 3);
        }
        // POPPED CENTER BUTTON (Belly burst at y = 32)
        ctx.fillStyle = '#dc2626'; // Snapped red thread
        ctx.fillRect(31, 31, 3, 1);
        ctx.fillRect(32, 33, 1, 3);

        // LEAKING INK FROM BROKEN POCKET PENS
        ctx.fillStyle = '#1e3a8a'; // Deep blue ballpoint ink pool
        ctx.fillRect(20, 15, 8, 8);
        ctx.fillRect(22, 23, 4, 18);
        ctx.fillRect(23, 41, 3, 12);

        // VISCERAL WHITE-OUT SPLATTERS ON THE DARK VEST
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(38, 28, 4.5, 0, Math.PI * 2);
        ctx.arc(42, 32, 3.2, 0, Math.PI * 2);
        ctx.arc(17, 38, 3.5, 0, Math.PI * 2);
        ctx.arc(35, 48, 4.0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(37, 32, 2.5, 12);
        ctx.fillRect(16, 41, 2.0, 8);

      } else {
        // KHAKI: Sweat-soaked olive safari shirt with torn shoulder seam
        ctx.fillStyle = '#4a5438';
        ctx.fillRect(0, 0, w, h);

        // Dark sweat soaking under collar and chest
        const sweat = ctx.createLinearGradient(0, 0, 0, 30);
        sweat.addColorStop(0, 'rgba(15, 20, 10, 0.75)');
        sweat.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sweat;
        ctx.fillRect(16, 0, 32, 30);

        // Center placket & buttons
        ctx.fillStyle = '#3a422b';
        ctx.fillRect(28, 14, 8, 28);
        ctx.fillStyle = '#facc15';
        for (const by of [18, 26, 34]) {
          ctx.fillRect(31, by, 2.5, 2.5);
        }

        // TORN RIGHT SHOULDER SEAM (showing tactical Kevlar black underneath)
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(46, 0); ctx.lineTo(54, 8); ctx.lineTo(48, 12); ctx.lineTo(42, 0);
        ctx.fill();
        // Frayed threads
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1;
        ctx.strokeRect(46, 2, 6, 6);

        // V-Neck collarbone skin opening
        ctx.fillStyle = '#9e3f24';
        ctx.beginPath();
        ctx.moveTo(23, 0); ctx.lineTo(41, 0); ctx.lineTo(32, 16);
        ctx.fill();
      }
    }, 16);
  }

  // --- 3. ANALOG HORROR / NIGHTMARE SKIN ---
  function createHorrorFaceTex(type) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Desaturated corpse-pale ashen blue-grey
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#85929e');
      grad.addColorStop(0.5, '#626f7c');
      grad.addColorStop(1, '#2c333a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Hollow void eye sockets with weeping black tears
      for (const ex of [47, 81]) {
        ctx.fillStyle = '#010203';
        ctx.beginPath();
        ctx.ellipse(ex, 52, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Viscous black ink / tears weeping down cheeks
        ctx.fillStyle = '#020305';
        ctx.fillRect(ex - 3, 58, 6, 48);
        ctx.fillRect(ex - 1, 106, 3, 14);
      }

      // Stitched shut mouth with jagged black sutures
      ctx.strokeStyle = '#020305';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(32, 92); ctx.lineTo(96, 92);
      ctx.stroke();
      for (let sx = 36; sx <= 92; sx += 6) {
        ctx.beginPath();
        ctx.moveTo(sx, 86); ctx.lineTo(sx - 2, 98);
        ctx.stroke();
      }

      // Heavy VHS tape tracking scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 2);
      }
      // Glitch displacement bar
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillRect(0, 42, w, 6);
    }, 24);
  }

  function createHorrorShirtTex(type) {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      ctx.fillStyle = '#111417';
      ctx.fillRect(0, 0, w, h);
      // Inverted digital static bands
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 2);
      }
      // Bleached spectral placket
      ctx.fillStyle = '#222930';
      ctx.fillRect(28, 8, 8, 48);
    }, 24);
  }

  // --- 4. MIDNIGHT OPS / STEALTH SKIN ---
  function createMidnightFaceTex(type) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (type === 'gullu') {
        // Tactical urban night commando warpaint
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#59442e');
        grad.addColorStop(1, '#261b11');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Dark hair
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);

        // Black and olive night-camo stripes across cheeks & forehead
        ctx.fillStyle = '#090d0b';
        ctx.beginPath();
        ctx.moveTo(28, 38); ctx.lineTo(60, 48); ctx.lineTo(54, 56); ctx.lineTo(28, 46);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(100, 38); ctx.lineTo(68, 48); ctx.lineTo(74, 56); ctx.lineTo(100, 46);
        ctx.fill();
        ctx.fillStyle = '#1c2e1f';
        ctx.beginPath();
        ctx.moveTo(34, 64); ctx.lineTo(62, 74); ctx.lineTo(58, 80); ctx.lineTo(34, 70);
        ctx.fill();

        // Nocturnal emerald green night-vision glints
        for (const ex of [47, 81]) {
          ctx.fillStyle = '#020302';
          ctx.beginPath();
          ctx.arc(ex, 51, 8.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.fillRect(ex - 1.5, 50, 3, 3);
          ctx.fillStyle = '#6ee7b7';
          ctx.fillRect(ex, 50.5, 1.2, 1.2);
        }
        // Mustache
        ctx.fillStyle = '#090705';
        ctx.fillRect(40, 74, 48, 8);
      } else {
        // Babu: Midnight VIP bureaucrat
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#8a653d');
        grad.addColorStop(1, '#3a2714');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        // Clean parted hair
        ctx.fillStyle = '#0a0908';
        ctx.fillRect(0, 0, w, 22);
        // Subtle gold-rimmed glasses bridge
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(36, 46, 20, 14);
        ctx.strokeRect(72, 46, 20, 14);
        ctx.beginPath();
        ctx.moveTo(56, 52); ctx.lineTo(72, 52);
        ctx.stroke();
      }
    }, 16);
  }

  function createMidnightShirtTex(type) {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      if (type === 'whitener') {
        // Royal midnight-navy silk Sadri with gold thread dots
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Gold brocade jamawar dot pattern
        ctx.fillStyle = '#d4af37';
        for (let y = 6; y < h; y += 8) {
          for (let x = 4; x < w; x += 8) {
            ctx.fillRect(x, y, 1.5, 1.5);
          }
        }
        // Polished gold buttons
        ctx.fillStyle = '#facc15';
        for (const by of [14, 26, 38, 50]) {
          ctx.beginPath();
          ctx.arc(32, by, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Khaki: Urban digital tiger-stripe dark-ops camo
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#27272a';
        for (let y = 4; y < h; y += 10) {
          ctx.fillRect(0, y, w, 4);
        }
        ctx.fillStyle = '#223326';
        ctx.fillRect(18, 12, 14, 8);
        ctx.fillRect(38, 24, 16, 9);
        ctx.fillRect(8, 40, 20, 7);
      }
    }, 16);
  }

  // --- 5. BATTLE-WORN / BLOODIED / RIGGING BREAKDOWN SKIN ---
  function createBattleFaceTex(type) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (type === 'gullu') {
        // Swollen blackened eye, bleeding shrapnel lacerations
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#825934');
        skinGrad.addColorStop(1, '#3b2512');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // Swollen blackened right eye (hematoma)
        ctx.fillStyle = 'rgba(40, 10, 30, 0.92)';
        ctx.beginPath();
        ctx.ellipse(81, 52, 14, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left eye active glare
        ctx.fillStyle = '#040201';
        ctx.beginPath();
        ctx.arc(47, 51, 8.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(46, 50, 2.5, 2.5);

        // Fresh bleeding shrapnel cuts & dripping blood
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(36, 68); ctx.lineTo(58, 76);
        ctx.stroke();
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(48, 76, 2.5, 18); // Dripping blood trail
        ctx.fillRect(50, 94, 2.0, 6);

      } else {
        // Babu: Pakistan official election stamp indelible ink smeared all over face
        const skinGrad = ctx.createLinearGradient(0, 0, 0, h);
        skinGrad.addColorStop(0, '#9e7343');
        skinGrad.addColorStop(1, '#4e3319');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // Frantic indelible purple-black voting ink smears across cheek and jaw
        ctx.fillStyle = 'rgba(25, 10, 45, 0.90)';
        ctx.beginPath();
        ctx.ellipse(82, 72, 14, 10, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(40, 78, 22, 6); // Finger swipe across upper lip
        ctx.fillRect(58, 98, 18, 8); // Thumb smear on chin

        // Feverish sweating paranoia eyes
        for (const ex of [46, 82]) {
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.arc(ex, 54, 8.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(ex - 6, 53, 3, 2);
          ctx.fillStyle = '#020101';
          ctx.beginPath();
          ctx.arc(ex, 54, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }, 16);
  }

  function createBattleShirtTex(type) {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      if (type === 'whitener') {
        // Waistcoat plastered with torn Form-45 official document paper clippings & red wax seals!
        ctx.fillStyle = '#1f2429';
        ctx.fillRect(0, 0, w, h);

        // Torn Form-45 paper clippings stuck to vest
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(16, 24, 14, 10);
        ctx.fillRect(36, 36, 16, 12);
        // Red election wax seal
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(22, 28, 3.0, 0, Math.PI * 2);
        ctx.fill();
        // Blue archival tape strips
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.fillRect(15, 23, 16, 2);
        ctx.fillRect(35, 35, 18, 2);

      } else {
        // Khaki: Battle-damaged field shirt with scorch marks & blood stains
        ctx.fillStyle = '#505a3b';
        ctx.fillRect(0, 0, w, h);

        // Blast scorch marks
        ctx.fillStyle = 'rgba(10, 10, 10, 0.75)';
        ctx.beginPath();
        ctx.arc(20, 24, 8, 0, Math.PI * 2);
        ctx.fill();

        // Fresh blood splatter on placket
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(28, 20, 6, 12);
        ctx.fillRect(31, 32, 3, 8);
      }
    }, 16);
  }

  // --- 6. SHOCKED / BLINDED SKIN (SEARCHLIGHT / FLASH HORROR) ---
  function createShockedFaceTex(type) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (type === 'gullu') {
        // =========================================================================
        // KHAKI SHOCKED / BLINDED: CAUGHT IN HARSH HORROR BEAM / FLASH
        // Stark bleached flashlight hotspot, arched alarm eyebrows, wide dazzled eyes,
        // contracted blinding pinprick retinas reflecting searchlight flare, agape jaw!
        // =========================================================================

        // 1. Harsh front searchlight illumination gradient (radial glare hotspot)
        const skinGrad = ctx.createRadialGradient(64, 60, 8, 64, 64, 66);
        skinGrad.addColorStop(0, '#d8b082');
        skinGrad.addColorStop(0.45, '#996f42');
        skinGrad.addColorStop(0.85, '#5a3b1d');
        skinGrad.addColorStop(1, '#271708');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Beret: Dark military beret pulled back slightly by shock
        ctx.fillStyle = '#1c2217';
        ctx.fillRect(0, 0, w, 24);
        ctx.fillStyle = '#262f20';
        ctx.fillRect(0, 0, 96, 20);
        // Golden military crest badge
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(38, 14, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(36.5, 12.5, 3, 3);

        // 3. Eyebrows: ARCHED HIGH IN SHOCKED ALARM & DISBELIEF (y: 28-36)
        ctx.fillStyle = '#0a0705';
        ctx.beginPath();
        ctx.moveTo(34, 38); ctx.quadraticCurveTo(46, 26, 60, 36); ctx.lineTo(60, 40); ctx.quadraticCurveTo(46, 31, 34, 42); ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(94, 38); ctx.quadraticCurveTo(82, 26, 68, 36); ctx.lineTo(68, 40); ctx.quadraticCurveTo(82, 31, 94, 42); ctx.closePath(); ctx.fill();

        // Deep horizontal forehead shock creases
        ctx.strokeStyle = '#2d1808';
        ctx.lineWidth = 1.4;
        for (const fy of [30, 34, 38]) {
          ctx.beginPath();
          ctx.moveTo(40, fy);
          ctx.quadraticCurveTo(64, fy - 2, 88, fy);
          ctx.stroke();
        }

        // 4. WIDE DAZZLED HORROR EYES & CONTRACTED PINPRICK PUPILS
        for (const ex of [47, 81]) {
          // Deep socket cavity
          ctx.fillStyle = '#060302';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 12, 10.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Dazzled stark white sclera (contracted in blinding flash)
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.ellipse(ex, 51, 9.5, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Ruptured photic shock capillaries radiating outwards
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(ex - 8, 51); ctx.lineTo(ex - 3, 50);
          ctx.moveTo(ex + 8, 51); ctx.lineTo(ex + 3, 52);
          ctx.moveTo(ex - 5, 46); ctx.lineTo(ex - 2, 49);
          ctx.moveTo(ex + 5, 56); ctx.lineTo(ex + 2, 53);
          ctx.stroke();

          // Constricted pinprick pupil (staring straight into searchlight)
          ctx.fillStyle = '#020101';
          ctx.beginPath();
          ctx.arc(ex, 51, 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Blinding white searchlight reflection glint
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - 0.5, 50.5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Searchlight horizontal flare dazzle streak across pupil
          ctx.fillStyle = 'rgba(255, 246, 210, 0.45)';
          ctx.fillRect(ex - 7, 50.5, 14, 1.2);
        }

        // 5. Combat scar cutting through left eye
        ctx.strokeStyle = '#c49e7b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(43, 28); ctx.lineTo(45, 43); ctx.lineTo(42, 54); ctx.lineTo(44, 66);
        ctx.stroke();

        // 6. Nose bridge with bright center highlight
        const nose = ctx.createLinearGradient(59, 45, 69, 45);
        nose.addColorStop(0, 'rgba(30, 15, 6, 0.85)');
        nose.addColorStop(0.5, '#deb887');
        nose.addColorStop(1, 'rgba(30, 15, 6, 0.85)');
        ctx.fillStyle = nose;
        ctx.fillRect(59, 45, 10, 26);
        // Nostrils flared in startled gasp
        ctx.fillStyle = '#060201';
        ctx.beginPath();
        ctx.ellipse(60, 71, 2.5, 2.0, 0, 0, Math.PI * 2);
        ctx.ellipse(68, 71, 2.5, 2.0, 0, 0, Math.PI * 2);
        ctx.fill();

        // 7. Handlebar mustache arched in startled shock
        ctx.fillStyle = '#080503';
        ctx.beginPath();
        ctx.moveTo(64, 72);
        ctx.quadraticCurveTo(46, 70, 32, 65);
        ctx.quadraticCurveTo(30, 60, 28, 56);
        ctx.quadraticCurveTo(32, 72, 46, 78);
        ctx.lineTo(64, 77);
        ctx.lineTo(82, 78);
        ctx.quadraticCurveTo(96, 72, 100, 56);
        ctx.quadraticCurveTo(98, 60, 96, 65);
        ctx.quadraticCurveTo(82, 70, 64, 72);
        ctx.closePath();
        ctx.fill();

        // 8. AGAPE STUNNED JAW / GAPING MOUTH (y: 80-106)
        // Deep black open oral cavity - caught in the act!
        ctx.fillStyle = '#030101';
        ctx.beginPath();
        ctx.ellipse(64, 93, 24, 13, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gums & Upper teeth row
        ctx.fillStyle = '#5c3328';
        ctx.fillRect(44, 82, 40, 2.5);
        for (let tx = 45; tx <= 81; tx += 4) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(tx, 84, 2.8, 3.8);
          ctx.fillStyle = '#030101';
          ctx.fillRect(tx + 2.8, 84, 1.2, 4);
        }

        // Lower teeth row dropped down
        ctx.fillStyle = '#4a251c';
        ctx.fillRect(46, 101, 36, 2.0);
        for (let tx = 47; tx <= 79; tx += 4) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(tx, 98.5, 2.6, 3.2);
          ctx.fillStyle = '#030101';
          ctx.fillRect(tx + 2.6, 98.5, 1.4, 3.5);
        }

        // Panicked cold sweat drops running down temple
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(36, 46, 2, 4);
        ctx.fillRect(92, 48, 2, 5);
        ctx.fillRect(94, 62, 1.8, 4);

      } else if (type === 'whitener') {
        // =========================================================================
        // BABU SHOCKED / BLINDED: CAUGHT RED-HANDED IN SEARCHLIGHT HORROR
        // Massive purple halqay contrasting with harsh blinding flash, bug-eyed terror,
        // dilated panicked eyes, slack agape jaw with frozen drool string!
        // =========================================================================

        // 1. Clammy jaundiced bureaucrat skin with stark flash hotspot
        const skinGrad = ctx.createRadialGradient(64, 62, 10, 64, 64, 66);
        skinGrad.addColorStop(0, '#cfad7b');
        skinGrad.addColorStop(0.5, '#9a7547');
        skinGrad.addColorStop(0.85, '#563c1f');
        skinGrad.addColorStop(1, '#241708');
        ctx.fillStyle = skinGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. Disheveled salt-and-pepper hair
        ctx.fillStyle = '#14100c';
        ctx.fillRect(0, 0, w, 22);
        ctx.fillRect(0, 0, 28, 104);
        ctx.fillRect(100, 0, 28, 104);

        // 3. Arched terrified forehead wrinkles
        ctx.strokeStyle = '#221107';
        ctx.lineWidth = 1.6;
        for (const wy of [25, 30, 35]) {
          ctx.beginPath();
          ctx.moveTo(38, wy);
          ctx.quadraticCurveTo(64, wy - 4, 90, wy);
          ctx.stroke();
        }

        // 4. MASSIVE BRUISED VIOLET-BLACK HALQAY
        for (const ex of [45, 83]) {
          const bag = ctx.createRadialGradient(ex, 67, 2, ex, 67, 18);
          bag.addColorStop(0, 'rgba(35, 10, 32, 0.95)');
          bag.addColorStop(0.65, 'rgba(48, 16, 16, 0.75)');
          bag.addColorStop(1, 'rgba(48, 16, 16, 0)');
          ctx.fillStyle = bag;
          ctx.beginPath();
          ctx.arc(ex, 67, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. BULGING BUGGY HORROR EYES CAUGHT IN FLASH
        for (const ex of [46, 82]) {
          // Socket shadow
          ctx.fillStyle = '#040201';
          ctx.beginPath();
          ctx.arc(ex, 53, 12, 0, Math.PI * 2);
          ctx.fill();

          // Dazzled jaundiced sclera bulging outward
          ctx.fillStyle = '#fef9c3';
          ctx.beginPath();
          ctx.arc(ex, 53, 10.0, 0, Math.PI * 2);
          ctx.fill();

          // Intense ruptured red spiderweb capillaries
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(ex - 9, 53); ctx.lineTo(ex - 3, 52); ctx.lineTo(ex - 1, 50);
          ctx.moveTo(ex + 9, 54); ctx.lineTo(ex + 4, 53); ctx.lineTo(ex + 2, 55);
          ctx.moveTo(ex - 5, 47); ctx.lineTo(ex - 2, 51);
          ctx.stroke();

          // Stunned contracted pupil
          ctx.fillStyle = '#020101';
          ctx.beginPath();
          ctx.arc(ex, 53, 2.4, 0, Math.PI * 2);
          ctx.fill();

          // Piercing white flash catchlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - 0.6, 52.2, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Flash dazzle streak
          ctx.fillStyle = 'rgba(255, 250, 220, 0.5)';
          ctx.fillRect(ex - 8, 52.5, 16, 1.2);
        }

        // 6. Fleshy bulbous nose
        const bNose = ctx.createRadialGradient(64, 68, 1, 64, 68, 12);
        bNose.addColorStop(0, '#deb887');
        bNose.addColorStop(0.7, '#8f6538');
        bNose.addColorStop(1, 'rgba(40, 20, 10, 0.85)');
        ctx.fillStyle = bNose;
        ctx.beginPath();
        ctx.arc(64, 68, 10, 0, Math.PI * 2);
        ctx.fill();

        // 7. Salt-and-pepper mustache
        ctx.fillStyle = '#1c150e';
        ctx.beginPath();
        ctx.moveTo(64, 76);
        ctx.quadraticCurveTo(46, 73, 40, 81);
        ctx.quadraticCurveTo(55, 82, 64, 79);
        ctx.quadraticCurveTo(73, 82, 88, 81);
        ctx.quadraticCurveTo(82, 73, 64, 76);
        ctx.closePath();
        ctx.fill();

        // 8. SLACK-JAWED HORRIFIED GAPING MOUTH (y: 81-108)
        ctx.fillStyle = '#020101';
        ctx.beginPath();
        ctx.ellipse(64, 94, 25, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Decayed rotting teeth floating in agape jaw
        const teeth = [
          { x: 42, w: 4.0, h: 5.5, c: '#fde68a' },
          { x: 48, w: 4.0, h: 6.5, c: '#b45309' },
          // Missing tooth gap at 54
          { x: 59, w: 4.5, h: 7.5, c: '#78350f' },
          { x: 65, w: 4.5, h: 7.0, c: '#fef3c7' },
          { x: 71, w: 4.0, h: 6.5, c: '#d97706' },
          { x: 77, w: 4.2, h: 6.0, c: '#b45309' },
          { x: 83, w: 4.0, h: 5.0, c: '#fde68a' }
 ];
        for (const t of teeth) {
          ctx.fillStyle = t.c;
          ctx.fillRect(t.x, 83, t.w, t.h);
        }

        // Viscous tobacco / betel drool string caught hanging from lower lip
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(48, 97);
        ctx.quadraticCurveTo(47, 107, 49, 114);
        ctx.stroke();

        // Panicked sweat running down cheeks
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.fillRect(36, 42, 2.2, 5);
        ctx.fillRect(38, 58, 2.0, 6);
        ctx.fillRect(90, 44, 2.2, 5);
        ctx.fillRect(88, 60, 2.0, 6);
      }
    }, 16);
  }

  function createShockedShirtTex(type) {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      if (type === 'whitener') {
        const grad = ctx.createRadialGradient(32, 28, 4, 32, 32, 34);
        grad.addColorStop(0, '#424952');
        grad.addColorStop(0.5, '#25292e');
        grad.addColorStop(1, '#0e1013');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fef9c3';
        ctx.beginPath();
        ctx.moveTo(27, 0); ctx.lineTo(32, 14); ctx.lineTo(37, 0); ctx.closePath();
        ctx.fill();
      } else {
        const grad = ctx.createRadialGradient(32, 28, 4, 32, 32, 34);
        grad.addColorStop(0, '#758359');
        grad.addColorStop(0.5, '#4e573a');
        grad.addColorStop(1, '#1b1f13');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(31, 14, 2.5, 2.5);
        ctx.fillRect(31, 24, 2.5, 2.5);
        ctx.fillRect(31, 34, 2.5, 2.5);
      }
    }, 16);
  }

  // --- SKIN REGISTRY & DEFINITIONS ---
  const SKIN_DEFS = {
    gullu: {
      default: {
        label: 'Default Patrol',
        skinColor: 0x7c5934,
        kameezColor: 0x586242,
        waskatColor: 0x3d452d,
        shalwarColor: 0x485135,
        emissiveIntensity: 0.40,
        faceFn: () => createUncannyFaceTex('gullu'),
        shirtFn: () => createShirtVNeckTex('#586242', '#3d452d', '#876037', 'gullu')
      },
      enraged: {
        label: 'Enraged (Animated)',
        skinColor: 0x9e3f24,
        kameezColor: 0x4a5438,
        waskatColor: 0x333924,
        shalwarColor: 0x3d452b,
        emissiveIntensity: 0.55,
        faceFrames: [
          () => createEnragedFaceTex('gullu', 0),
          () => createEnragedFaceTex('gullu', 1),
          () => createEnragedFaceTex('gullu', 2)
 ],
        shirtFn: () => createEnragedShirtTex('gullu')
      },
      horror: {
        label: 'Analog Horror',
        skinColor: 0x788494,
        kameezColor: 0x181e22,
        waskatColor: 0x0c1012,
        shalwarColor: 0x14181c,
        emissiveIntensity: 0.35,
        faceFn: () => createHorrorFaceTex('gullu'),
        shirtFn: () => createHorrorShirtTex('gullu')
      },
      midnight: {
        label: 'Midnight Ops',
        skinColor: 0x59442e,
        kameezColor: 0x18181b,
        waskatColor: 0x111613,
        shalwarColor: 0x181c18,
        emissiveIntensity: 0.38,
        faceFn: () => createMidnightFaceTex('gullu'),
        shirtFn: () => createMidnightShirtTex('gullu')
      },
      battle: {
        label: 'Battle-Worn',
        skinColor: 0x825934,
        kameezColor: 0x505a3b,
        waskatColor: 0x363324,
        shalwarColor: 0x3e3c2c,
        emissiveIntensity: 0.45,
        faceFn: () => createBattleFaceTex('gullu'),
        shirtFn: () => createBattleShirtTex('gullu')
      },
      shocked: {
        label: 'Shocked / Blinded',
        skinColor: 0x9c7047,
        kameezColor: 0x586242,
        waskatColor: 0x3d452d,
        shalwarColor: 0x485135,
        emissiveIntensity: 0.65,
        faceFn: () => createShockedFaceTex('gullu'),
        shirtFn: () => createShockedShirtTex('gullu')
      }
    },
    whitener: {
      default: {
        label: 'Default Patrol',
        skinColor: 0x8a643b,
        kameezColor: 0xdfd7c4,
        waskatColor: 0x25292e,
        shalwarColor: 0xdfd7c4,
        emissiveIntensity: 0.40,
        faceFn: () => createUncannyFaceTex('whitener'),
        shirtFn: () => createShirtVNeckTex('#dfd7c4', '#25292e', '#876037', 'whitener')
      },
      enraged: {
        label: 'Enraged (Animated)',
        skinColor: 0xad5a2c,
        kameezColor: 0xd4cbb3,
        waskatColor: 0x1c2024,
        shalwarColor: 0xd4cbb3,
        emissiveIntensity: 0.55,
        faceFrames: [
          () => createEnragedFaceTex('whitener', 0),
          () => createEnragedFaceTex('whitener', 1),
          () => createEnragedFaceTex('whitener', 2)
 ],
        shirtFn: () => createEnragedShirtTex('whitener')
      },
      horror: {
        label: 'Analog Horror',
        skinColor: 0x788494,
        kameezColor: 0x222930,
        waskatColor: 0x111417,
        shalwarColor: 0x1a2026,
        emissiveIntensity: 0.35,
        faceFn: () => createHorrorFaceTex('whitener'),
        shirtFn: () => createHorrorShirtTex('whitener')
      },
      midnight: {
        label: 'Midnight Silk',
        skinColor: 0x8a653d,
        kameezColor: 0x1e293b,
        waskatColor: 0x0f172a,
        shalwarColor: 0x1e293b,
        emissiveIntensity: 0.40,
        faceFn: () => createMidnightFaceTex('whitener'),
        shirtFn: () => createMidnightShirtTex('whitener')
      },
      battle: {
        label: 'Rigging Breakdown',
        skinColor: 0x9e7343,
        kameezColor: 0xc9bea4,
        waskatColor: 0x1f2429,
        shalwarColor: 0xbdb298,
        emissiveIntensity: 0.45,
        faceFn: () => createBattleFaceTex('whitener'),
        shirtFn: () => createBattleShirtTex('whitener')
      },
      shocked: {
        label: 'Shocked / Blinded',
        skinColor: 0x9c7047,
        kameezColor: 0xdfd7c4,
        waskatColor: 0x25292e,
        shalwarColor: 0xdfd7c4,
        emissiveIntensity: 0.65,
        faceFn: () => createShockedFaceTex('whitener'),
        shirtFn: () => createShockedShirtTex('whitener')
      }
    }
  };

  // --- APPLY SKIN TO HUMANOID MESH ---
  function applySkin(mesh, skinName = 'default', frame = 0) {
    if (!mesh || !mesh.userData) return;
    const type = mesh.userData.type || 'gullu';
    const charDef = SKIN_DEFS[type];
    if (!charDef) return;
    const skinDef = charDef[skinName] || charDef.default;

    mesh.userData.currentSkin = skinName;
    mesh.userData.currentSkinFrame = frame;

    if (mesh.userData.head) {
      mesh.userData.head.scale.set(1.0, 1.0, 1.0);
    }
    if (skinName !== 'enraged') {
      if (mesh.userData.head) {
        mesh.userData.head.position.set(0, 2.45, 0.03);
      }
      if (mesh.userData.torso) {
        mesh.userData.torso.scale.set(1.0, 1.0, 1.0);
        mesh.userData.torso.position.set(0, 1.48, 0);
      }
    }

    // Face Texture (supports multi-frame animated sequences)
    let faceTex = null;
    if (skinDef.faceFrames && skinDef.faceFrames.length > 0) {
      const fIdx = Math.max(0, Math.min(skinDef.faceFrames.length - 1, frame % skinDef.faceFrames.length));
      faceTex = getCachedTexture(`${type}_${skinName}_face_${fIdx}`, skinDef.faceFrames[fIdx]);
    } else if (skinDef.faceFn) {
      faceTex = getCachedTexture(`${type}_${skinName}_face`, skinDef.faceFn);
    }
    if (faceTex && mesh.userData.faceMat) {
      if (mesh.userData.faceMat.map !== faceTex) {
        mesh.userData.faceMat.map = faceTex;
        mesh.userData.faceMat.needsUpdate = true;
      }
    }

    // Torso / Shirt Texture
    let shirtTex = null;
    if (skinDef.shirtFn) {
      shirtTex = getCachedTexture(`${type}_${skinName}_shirt`, skinDef.shirtFn);
    }
    if (shirtTex && mesh.userData.shirtMat) {
      if (mesh.userData.shirtMat.map !== shirtTex) {
        mesh.userData.shirtMat.map = shirtTex;
        mesh.userData.shirtMat.needsUpdate = true;
      }
    }

    // Material Colors & Emissives
    if (mesh.userData.skinMat && skinDef.skinColor !== undefined) {
      mesh.userData.skinMat.color.setHex(skinDef.skinColor);
    }
    if (mesh.userData.kameezMat && skinDef.kameezColor !== undefined) {
      mesh.userData.kameezMat.color.setHex(skinDef.kameezColor);
    }
    if (mesh.userData.shalwarMat && skinDef.shalwarColor !== undefined) {
      mesh.userData.shalwarMat.color.setHex(skinDef.shalwarColor);
    }
    if (mesh.userData.faceMat && skinDef.emissiveIntensity !== undefined) {
      mesh.userData.faceMat.emissiveIntensity = skinDef.emissiveIntensity;
    }
  }



  // --- Authentic Pakistani Kameez + Politician Waskat (Waistcoat / Sadri) Texture ---
  function createShirtVNeckTex(kameezHex, waskatHex, skinHex = '#876037', type = 'gullu') {
    // 64x64 texture mapped to Cylinder rotated by Math.PI:
    // u = 0.5 (x = 32) is center front chest (+Z)
    // u = 0.0 and 1.0 (x = 0 and x = 64) meet at center back spine (-Z)
    return makePS1Texture(64, 64, (ctx, w, h) => {
      if (type === 'whitener') {
        // --- BABU: AUTHENTIC TIGHT CHARCOAL SARKARI WAISTCOAT (WASKAT) OVER CREAM KURTA ---
        // Solid charcoal waskat fabric covers front, sides, and back of torso
        ctx.fillStyle = waskatHex; // #25292e
        ctx.fillRect(0, 0, w, h);

        // Subtle fabric grain / pinstripe weave
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        for (let x = 0; x < w; x += 3) {
          ctx.fillRect(x, 0, 1, h);
        }

        // --- FRONT CENTER CHEST & BELLY (x in [16, 48], center = 32) ---
        // 1. Crisp Cream Kameez Mandarin Collar (Ban Gala) peeking at the neck rim
        ctx.fillStyle = kameezHex; // #dfd7c4
        ctx.fillRect(27, 0, 10, 6);
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(27, 0, 10, 6);

        // Small V-slit at the throat showing sweaty throat skin
        ctx.fillStyle = skinHex;
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(34, 0);
        ctx.lineTo(32, 4);
        ctx.closePath();
        ctx.fill();

        // 2. Waistcoat Mandarin Collar band
        ctx.fillStyle = '#181b20';
        ctx.fillRect(25, 5, 14, 3);

        // 3. Center Placket with Strained Seams down the entire potbelly (x = 30 to 34)
        ctx.fillStyle = '#1c1f24';
        ctx.fillRect(30, 8, 4, 52);
        ctx.strokeStyle = 'rgba(0,0,0,0.55)';
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 8, 4, 52);

        // 4. Straining Golden Brass Buttons along the protruding belly with tension creases!
        for (const by of [12, 20, 28, 36, 44, 52]) {
          // Horizontal fabric pull/strain wrinkles radiating from each button over the belly
          ctx.strokeStyle = 'rgba(0,0,0,0.42)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(23, by);
          ctx.lineTo(29, by);
          ctx.moveTo(35, by);
          ctx.lineTo(41, by);
          ctx.stroke();

          // Button shadow
          ctx.fillStyle = '#090a0c';
          ctx.beginPath();
          ctx.arc(32.5, by + 0.5, 2.0, 0, Math.PI * 2);
          ctx.fill();

          // Brass gold button body
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(32, by, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Metallic reflection dot
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(31, by - 1, 1, 1);
        }

        // 5. Left Chest: Welted Breast Pocket with 3 Government Pens (x in [20, 27], y in [15, 23])
        ctx.fillStyle = '#14161a';
        ctx.fillRect(20, 15, 8, 8);
        ctx.fillStyle = '#0e1013';
        ctx.fillRect(19, 14, 10, 2); // pocket welt

        // Official Pakistani Sarkari Pens: Blue, Red, Green
        ctx.fillStyle = '#2563eb'; ctx.fillRect(21, 10, 2, 6); // Blue ballpoint
        ctx.fillStyle = '#dc2626'; ctx.fillRect(24, 10, 2, 6); // Red checking pen
        ctx.fillStyle = '#16a34a'; ctx.fillRect(27, 10, 2, 6); // Green signing pen
        // Gold pen clips
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(21, 12, 2, 1);
        ctx.fillRect(24, 12, 2, 1);
        ctx.fillRect(27, 12, 2, 1);

        // 6. Two Lower Welted Waist Pockets on the belly flanks
        ctx.fillStyle = '#121417';
        ctx.fillRect(18, 44, 9, 2.5);
        ctx.fillRect(37, 44, 9, 2.5);

        // 7. Green Official ECP Lanyard Ribbon & Laminated Form-45 Identification Card
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(27, 0);
        ctx.lineTo(24, 26);
        ctx.stroke();

        // Laminated ID Card badge
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(21, 26, 8, 11);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(21, 26, 8, 3); // Green header
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(22, 30, 2, 2); // Stamp/photo
        ctx.fillStyle = '#334155';
        ctx.fillRect(25, 30, 3, 1); // text line
        ctx.fillRect(22, 33, 6, 1); // signature/barcode

        // --- BACK OF TORSO (x in [0, 16] and [48, 64]) ---
        // Solid charcoal back with tailored center spine and lower cinch strap
        ctx.fillStyle = '#14171a';
        ctx.fillRect(0, 46, 8, 4);
        ctx.fillRect(56, 46, 8, 4);
        ctx.fillStyle = '#cbd5e1'; // Silver cinch buckle at center spine
        ctx.fillRect(0, 45, 3, 6);
        ctx.fillRect(61, 45, 3, 6);
        // Center spine seam
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, h);
        ctx.moveTo(63, 0); ctx.lineTo(63, h);
        ctx.stroke();
      } else {
        // --- KHAKI & CHOWKIDAR: CRISP FIELD SHIRT / KURTA ---
        // Base solid Kameez / Field shirt fabric across entire body
        ctx.fillStyle = kameezHex;
        ctx.fillRect(0, 0, w, h);

        // Front panels flanking center chest
        ctx.fillStyle = waskatHex;
        ctx.fillRect(16, 0, 7, h);  // Left front panel
        ctx.fillRect(41, 0, 7, h);  // Right front panel
        ctx.fillRect(21, 32, 22, 32); // Closed lower front over waist

        // Collar Placket (Gala Patti) down center front chest
        ctx.fillStyle = kameezHex;
        ctx.fillRect(28, 16, 8, 26);
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(28, 16, 8, 26);

        // Buttons strictly on FRONT chest
        ctx.fillStyle = '#d4af37'; // Brass/Gold buttons
        for (const by of [22, 30, 38, 48, 56]) {
          ctx.fillRect(31, by, 3, 3);
        }

        // Front Breast Pocket
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.fillRect(39, 22, 9, 10);

        if (type === 'gullu') {
          // Khaki: Safari pocket with gold button + black acoustic earpiece wire on front collar
          ctx.fillStyle = '#d4af37';
          ctx.fillRect(43, 25, 2, 2);
          ctx.strokeStyle = '#09090b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(24, 0);
          ctx.lineTo(21, 14);
          ctx.lineTo(26, 22);
          ctx.stroke();
        }

        // V-Neck collarbone skin opening at top center front
        ctx.fillStyle = skinHex;
        ctx.beginPath();
        ctx.moveTo(23, 0);
        ctx.lineTo(41, 0);
        ctx.lineTo(32, 18);
        ctx.closePath();
        ctx.fill();

        // --- BACK OF TORSO (x in [0, 16] and [48, 64]) ---
        // Clean olive-drab tactical uniform back
        ctx.fillStyle = kameezHex;
        ctx.fillRect(0, 0, 16, h);
        ctx.fillRect(48, 0, 16, h);
        // Tactical horizontal shoulder yoke stitch line across upper back
        ctx.strokeStyle = 'rgba(0,0,0,0.38)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 14);
        ctx.lineTo(16, 14);
        ctx.moveTo(48, 14);
        ctx.lineTo(64, 14);
        ctx.stroke();
        // Spine tailoring seam line at x=0 and x=64
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.moveTo(1, 0); ctx.lineTo(1, h);
        ctx.moveTo(63, 0); ctx.lineTo(63, h);
        ctx.stroke();
      }
    }, 16);
  }

  // --- SCULPTED PS1 HEAD GEOMETRY (Fit Angular for Khaki vs Fat Jowly for Babu) ---
  function createSculptedPS1HeadGeo(type = 'gullu') {
    const geo = new THREE.SphereGeometry(0.32, 16, 14);
    // Rotate sphere so +Z (front) aligns perfectly with u = 0.50 (texture center)
    // and -Z (back) aligns with u = 0.0 / 1.0 (texture edges) with native duplicate seam vertices!
    geo.rotateY(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      if (type === 'gullu') {
        // KHAKI: Fit, chiseled, hard angular skull with deeply sunken eye sockets and heavy commando brow
        y *= 1.18;
        x *= 0.88;
        if (y < 0) {
          // Strong squared jaw tapering to sharp chin
          const jawTaper = Math.max(0.58, 1.0 + y * 1.05);
          x *= jawTaper;
          z *= jawTaper;
          if (z > 0 && y < -0.16) z += 0.055;
        }

        if (z > 0.05) {
          // Heavy protruding commando brow ridge overhang at y in [0.08, 0.18]
          if (y > 0.07 && y < 0.20 && Math.abs(x) < 0.22) {
            z += 0.045;
          }
          // Deep sunken orbital cavities (recessed eye pits) at y in [-0.02, 0.07]
          if (y > -0.01 && y < 0.08 && Math.abs(x) > 0.05 && Math.abs(x) < 0.18) {
            z -= 0.045;
          }
          // Gaunt, emaciated hollow cheeks beneath prominent cheekbones
          if (y > -0.12 && y < -0.01 && Math.abs(x) > 0.08 && Math.abs(x) < 0.22) {
            z -= 0.035;
            x *= 0.94;
          }
          // Pronounced aquiline military nose bridge
          if (Math.abs(x) < 0.045 && y > -0.12 && y < 0.09) {
            z += 0.085;
          }
        }
      } else if (type === 'whitener') {
        // BABU: Fleshy pear-shaped skull with PROPTOSIS (PHYSICALLY BULGING EYEBALLS) & sagging jowls
        y *= 1.05;

        // Narrower top skull to wedge firmly under Jinnah cap
        if (y > 0.12) {
          x *= 0.94;
          z *= 0.96;
        }

        // PHYSICAL 3D PROPTOSIS: Eyeballs bulging forward out of the skull (proportional to slightly smaller eyes)
        if (z > 0.10 && y > 0.02 && y < 0.14 && Math.abs(x) > 0.06 && Math.abs(x) < 0.19) {
          z += 0.038;
        }

        // Fleshy, drooping jowls smoothly widening downwards
        if (y <= 0.08) {
          const jowlFactor = 1.0 + (0.08 - y) * 0.58;
          x *= jowlFactor;
          z *= (1.0 + (0.08 - y) * 0.28);
        }

        // Heavy, sagging double chin fold hanging under jaw
        if (y < -0.08 && z > -0.12) {
          z += 0.090;
          y -= 0.030;
        }
      } else {
        y *= 1.14;
        x *= 0.90;
        if (y < 0) { x *= Math.max(0.45, 1.0 + y * 1.3); }
      }

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // --- SCULPTED PS1 TORSO GEOMETRIES: FIT (KHAKI) vs FAT (BABU) ---
  // Fit athletic V-taper torso for "Khaki" (The Agency Guy)
  function createSculptedPS1FitTorsoGeo() {
    const geo = new THREE.CylinderGeometry(0.42, 0.26, 1.12, 8, 5);
    // Rotate cylinder so +Z (front chest) is at u = 0.50 (texture center)
    // and -Z (back spine) is at u = 0.0 and 1.0 (texture edges)
    geo.rotateY(Math.PI);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Flatten depth (front-to-back) and broaden athletic chest
      z *= 0.62;
      x *= 1.25;

      // Fit chest plate
      if (y > 0.05 && y < 0.42 && z > 0) {
        z += 0.085;
      }

      // Tight, fit waist taper at the bottom
      if (y < -0.15) {
        x *= 0.86;
        z *= 0.82;
      }

      // Sloped broad athletic shoulders
      if (y > 0.45) {
        const neckPull = Math.abs(x) > 0.22 ? -0.06 : 0.03;
        y += neckPull;
      }

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // Heavy, paunchy, rounded belly torso for "Babu" (The Corrupt Civil Servant)
  // Perfectly smooth, continuous PS1 organic geometry with ZERO tears, ZERO ledges
  function createSculptedPS1FatTorsoGeo() {
    const geo = new THREE.CylinderGeometry(0.38, 0.44, 1.08, 12, 8);
    // Rotate cylinder so +Z (front belly) is at u = 0.50 (texture center)
    // and -Z (back spine) is at u = 0.0 and 1.0 (texture edges)
    geo.rotateY(Math.PI);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Wide, heavy bureaucratic frame
      x *= 1.26;
      z *= 0.88;

      // CONTINUOUS SMOOTH SARKARI TON (POTBELLY) DEFORMATION
      // Centered at y = -0.12 (lower belly above belt line), radius = 0.44
      const uy = (y - (-0.12)) / 0.44;
      if (Math.abs(uy) < 1.0) {
        // Smooth C-1 hermite falloff that vanishes smoothly at top (y=+0.32) and bottom (y=-0.56)
        const bellyWeight = Math.pow(1.0 - uy * uy, 1.5);

        // Radial forward projection: only vertices facing forward (z > 0)
        const r = Math.sqrt(x * x + z * z);
        if (r > 0.001) {
          const forwardFactor = Math.max(0, z / r);
          // Forward belly protrusion
          z += bellyWeight * forwardFactor * 0.28;
          // Natural gravitational belly sag pulling slightly down
          y -= bellyWeight * forwardFactor * 0.05;
        }

        // Smooth lateral flank expansion over hips
        x *= (1.0 + bellyWeight * 0.16);
      }

      // Sloping, rounded bureaucratic shoulders at top
      if (y > 0.35) {
        const shoulderSlope = (Math.abs(x) / 0.50) * 0.08;
        y -= shoulderSlope;
      }

      pos.setXYZ(i, x, y, z);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // Default humanoid torso for Chowkidar
  function createSculptedPS1TorsoGeo() {
    const geo = new THREE.CylinderGeometry(0.38, 0.30, 1.08, 8, 4);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i) * 1.12;
      let y = pos.getY(i);
      let z = pos.getZ(i) * 0.64;
      if (y > 0.05 && y < 0.38 && z > 0.05) z += 0.065;
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // --- BUILD COMPLETE PAKISTANI SCULPTED PS1 HUMANOID (KHAKI, BABU, CHOWKIDAR) ---
  function createPS1Humanoid(type) {
    const group = new THREE.Group();

    const configs = {
      gullu: {
        // "KHAKI" — Fit Paramilitary / Agency Operative (Fitted Olive-Khaki Uniform)
        kameezColor: '#586242', // Crisp Olive-Khaki Field Shirt
        waskatColor: '#3a4228', // Tactical Olive Vest / Pockets
        shalwarColor: '#454e32', // Fitted Combat Trousers
        skinColor: 0x8f6a42
      },
      whitener: {
        // "BABU" — Fat, Corrupt Civil Servant (Cream Shalwar Kameez + Dark Sarkari Waskat)
        // High-contrast cream fabric so his wide body is instantly visible on CCTV!
        kameezColor: '#dfd7c4', // Light Cream/Parchment Silk Kurta
        waskatColor: '#25292e', // Tight Charcoal/Dark Navy Sarkari Waistcoat
        shalwarColor: '#d6cdb8', // Baggy Cream Shalwar
        skinColor: 0x9e7b54
      },
      chowkidar: {
        kameezColor: '#6b5b3e',
        waskatColor: '#3f3220',
        shalwarColor: '#5c4d33',
        skinColor: 0x7c5934
      }
    };
    const cfg = configs[type] || configs.gullu;

    // Rich emissive tuning so monster silhouettes are crisp and readable under surveillance lighting
    const skinMat = new THREE.MeshLambertMaterial({ 
      color: cfg.skinColor,
      emissive: 0x2b2014,
      emissiveIntensity: 0.40
    });
    const faceMat = new THREE.MeshLambertMaterial({ 
      map: createUncannyFaceTex(type),
      emissive: 0x2e2418,
      emissiveIntensity: 0.40
    });
    const shirtMat = new THREE.MeshLambertMaterial({
      map: createShirtVNeckTex(
        cfg.kameezColor,
        cfg.waskatColor,
        '#876037',
        type
      ),
      emissive: 0x262920,
      emissiveIntensity: 0.36
    });
    const kameezMat = new THREE.MeshLambertMaterial({ 
      color: cfg.kameezColor,
      emissive: 0x262920,
      emissiveIntensity: 0.36
    });
    const shalwarMat = new THREE.MeshLambertMaterial({ 
      color: cfg.shalwarColor,
      emissive: 0x20241b,
      emissiveIntensity: 0.32
    });
    const chappalMat = new THREE.MeshLambertMaterial({ 
      color: 0x14100b,
      emissive: 0x18120b,
      emissiveIntensity: 0.30
    });

    // 1. Legs + Boots/Chappals
    const baggyThighGeo = new THREE.CylinderGeometry(0.18, 0.14, 0.54, 7);
    const shalwarCalfGeo = new THREE.CylinderGeometry(0.135, 0.085, 0.48, 7);
    const chappalGeo = new THREE.ConeGeometry(0.125, 0.36, 6);
    chappalGeo.rotateX(Math.PI / 2);

    const bodyGroup = new THREE.Group();
    group.add(bodyGroup);

    let legL = null;
    let legR = null;
    // Babu has a wider, grounded heavy stance to support his paunch
    const legSpacing = (type === 'whitener') ? 0.22 : 0.175;
    for (let side of [-1, 1]) {
      const legGroup = new THREE.Group();
      legGroup.position.set(side * legSpacing, 0.96, 0);

      const thigh = new THREE.Mesh(baggyThighGeo, shalwarMat);
      const calf = new THREE.Mesh(shalwarCalfGeo, shalwarMat);
      const shoe = new THREE.Mesh(chappalGeo, chappalMat);

      if (type === 'whitener') {
        // Authentic heavy shalwar cloth volume + sturdy black sarkari shoes
        thigh.scale.set(1.30, 1.0, 1.25);
        calf.scale.set(1.25, 1.0, 1.20);
        shoe.scale.set(1.25, 1.0, 1.20);
      }

      if (type === 'chowkidar') {
        // Seated comfortably on the Charpai: thighs extend horizontally forward, calves hang down over the wooden edge
        thigh.rotation.x = -Math.PI / 2;
        thigh.position.set(0, 0, 0.22);
        calf.position.set(0, -0.22, 0.44);
        shoe.position.set(0, -0.46, 0.48);
      } else {
        thigh.position.y = -0.24;
        calf.position.y = -0.70;
        shoe.position.set(0, -0.92, 0.08);
      }

      legGroup.add(thigh, calf, shoe);
      bodyGroup.add(legGroup);
      if (side === -1) legL = legGroup;
      else legR = legGroup;
    }

    // 2. Safari Jacket / Kameez Lower Hem (Daman)
    let damanMesh;
    if (type === 'whitener') {
      // BABU: Smooth, 12-sided rounded cream kurta daman hanging seamlessly below the dark waskat
      const fatDamanGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.52, 12);
      fatDamanGeo.scale(1.16, 1.0, 0.95);
      damanMesh = new THREE.Mesh(fatDamanGeo, kameezMat);
      damanMesh.position.set(0, 0.84, 0.05);
    } else if (type === 'gullu') {
      // KHAKI: Crisp, fitted tactical safari jacket skirt
      const fitDamanGeo = new THREE.CylinderGeometry(0.26, 0.30, 0.48, 8);
      fitDamanGeo.scale(1.12, 1, 0.64);
      damanMesh = new THREE.Mesh(fitDamanGeo, kameezMat);
      damanMesh.position.set(0, 0.82, 0);
    } else {
      const damanGeo = new THREE.CylinderGeometry(0.28, 0.34, 0.52, 8);
      damanGeo.scale(1.08, 1, 0.68);
      damanMesh = new THREE.Mesh(damanGeo, kameezMat);
      damanMesh.position.set(0, 0.88, 0.12);
      damanMesh.rotation.x = -0.38;
    }
    bodyGroup.add(damanMesh);

    // 3. Sculpted Contoured Torso: Fit Athletic V-Taper (Khaki) vs Fat Belly (Babu)
    let torsoGeo;
    if (type === 'gullu') torsoGeo = createSculptedPS1FitTorsoGeo();
    else if (type === 'whitener') torsoGeo = createSculptedPS1FatTorsoGeo();
    else torsoGeo = createSculptedPS1TorsoGeo();

    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.set(0, 1.48, 0);
    bodyGroup.add(torso);

    // Tactical Utility Belt for "Khaki" (Fit waist accent)
    if (type === 'gullu') {
      const beltGroup = new THREE.Group();
      beltGroup.position.set(0, 1.05, 0);

      const dutyMat = new THREE.MeshLambertMaterial({ color: 0x18181b, emissive: 0x08080a });
      const metalMat = new THREE.MeshLambertMaterial({ color: 0x8a7238, emissive: 0x1a1508 });
      const snapMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });

      // 1. Contoured Multi-Segment Tactical Duty Belt wrapping snugly around his athletic waist
      const beltFront = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.035), dutyMat);
      beltFront.position.set(0, 0, 0.17);

      const beltBack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.035), dutyMat);
      beltBack.position.set(0, 0, -0.17);

      const beltLeft = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, 0.34), dutyMat);
      beltLeft.position.set(-0.24, 0, 0);

      const beltRight = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.08, 0.34), dutyMat);
      beltRight.position.set(0.24, 0, 0);

      // 2. Heavy-Duty Tactical Dual-Prong Roller Buckle in front center
      const buckleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.095, 0.05), metalMat);
      buckleFrame.position.set(0, 0, 0.18);
      const bucklePlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.055), new THREE.MeshBasicMaterial({ color: 0x1a1a1c }));
      bucklePlate.position.set(0, 0, 0.182);
      const prong1 = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.055, 0.06), snapMat);
      prong1.position.set(-0.02, 0, 0.185);
      const prong2 = prong1.clone();
      prong2.position.set(0.02, 0, 0.185);

      // 3. Four Leather Belt Keepers with brass snap studs
      const keeperGeo = new THREE.BoxGeometry(0.025, 0.09, 0.045);
      const kFL = new THREE.Mesh(keeperGeo, dutyMat); kFL.position.set(-0.16, 0, 0.17);
      const kFR = new THREE.Mesh(keeperGeo, dutyMat); kFR.position.set(0.16, 0, 0.17);
      const kBL = new THREE.Mesh(keeperGeo, dutyMat); kBL.position.set(-0.16, 0, -0.17);
      const kBR = new THREE.Mesh(keeperGeo, dutyMat); kBR.position.set(0.16, 0, -0.17);

      // 4. Left Hip: Tactical Double Magazine Pouch + Handcuff Case
      const magPouch = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.13, 0.065), dutyMat);
      magPouch.position.set(-0.25, -0.01, 0.05);
      const magFlap = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.04, 0.068), new THREE.MeshLambertMaterial({ color: 0x111113 }));
      magFlap.position.set(-0.25, 0.04, 0.05);
      const cuffCase = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.055), dutyMat);
      cuffCase.position.set(-0.25, -0.01, -0.07);

      // 5. Back of Belt: Tactical Horizontal Medical/IFAK Pouch across the spine
      const rearPouch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.085, 0.06), dutyMat);
      rearPouch.position.set(0, 0, -0.19);
      const rearZipper = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.015, 0.065), new THREE.MeshBasicMaterial({ color: 0x475569 }));
      rearZipper.position.set(0, 0.02, -0.192);

      // 6. Right Hip: TACTICAL SERVICE SIDEARM & KYDEX DUTY HOLSTER
      const holsterGroup = new THREE.Group();
      holsterGroup.position.set(0.265, -0.06, 0.03);
      holsterGroup.rotation.z = -0.14; // FBI tactical quick-draw cant
      holsterGroup.rotation.y = 0.10;

      // Molded Holster Body
      const holsterBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.075, 0.22, 0.10),
        new THREE.MeshLambertMaterial({ color: 0x101012, emissive: 0x050508 })
      );
      // Holster retention strap
      const retStrap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.025, 0.09), dutyMat);
      retStrap.position.set(0, 0.08, 0.01);
      const retSnap = new THREE.Mesh(new THREE.SphereGeometry(0.012, 5, 5), snapMat);
      retSnap.position.set(0.04, 0.08, 0.01);

      // Service Pistol (Pistol Grip, Slide, Hammer, Beavertail)
      const gunMat = new THREE.MeshLambertMaterial({ color: 0x1c1d22, emissive: 0x090a0f });
      // Checkered Pistol Grip
      const grip = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.12, 0.058), new THREE.MeshLambertMaterial({ color: 0x09090b }));
      grip.position.set(0.005, 0.07, -0.035);
      grip.rotation.x = 0.22;
      // Lanyard ring
      const lRing = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.004, 4, 6), metalMat);
      lRing.position.set(0.005, 0.01, -0.048);

      // Pistol Slide & Barrel protruding into holster
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.048, 0.16), gunMat);
      slide.position.set(0.005, 0.10, 0.02);
      // Slide serrations
      const serrations = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.035, 0.04), new THREE.MeshLambertMaterial({ color: 0x27272a }));
      serrations.position.set(0.005, 0.10, -0.03);
      // Hammer & Beavertail
      const hammer = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.03, 0.025), metalMat);
      hammer.position.set(0.005, 0.115, -0.06);

      holsterGroup.add(holsterBody, retStrap, retSnap, grip, lRing, slide, serrations, hammer);

      beltGroup.add(
        beltFront, beltBack, beltLeft, beltRight,
        buckleFrame, bucklePlate, prong1, prong2,
        kFL, kFR, kBL, kBR,
        magPouch, magFlap, cuffCase,
        rearPouch, rearZipper,
        holsterGroup
      );
      bodyGroup.add(beltGroup);
    } else if (type === 'whitener') {
      // Babu buttons and tension strain creases are seamlessly rendered on the waistcoat texture
    }

    // Shoulder Epaulets for "Khaki" (The Agency Guy) or Woolen Shawl for Chowkidar
    if (type === 'gullu') {
      const epMat = new THREE.MeshLambertMaterial({ color: 0x36301d });
      const brassBtnMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      for (const side of [-1, 1]) {
        const ep = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.12), epMat);
        ep.position.set(side * 0.32, 1.98, 0.0);
        ep.rotation.z = side * -0.18;
        const star = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), brassBtnMat);
        star.position.set(0, 0.02, 0);
        ep.add(star);
        bodyGroup.add(ep);
      }
    } else if (type === 'chowkidar') {
      const scarfRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.22, 0.055, 6, 8),
        new THREE.MeshLambertMaterial({ color: 0x4a3728 })
      );
      scarfRing.rotation.x = Math.PI / 2 + 0.18;
      scarfRing.scale.set(1.15, 0.85, 1);
      scarfRing.position.set(0, 1.98, 0.03);
      bodyGroup.add(scarfRing);
    }

    // 4. Tapered Cylindrical Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.145, 0.28, 8),
      skinMat
    );
    neck.position.set(0, 2.08, 0.02);
    group.add(neck);

    // 5. Sculpted Faceted PS1 Head + 3D Nose Wedge + Character Headwear & Glasses
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 2.45, 0.03);
    group.add(headGroup);

    const headMesh = new THREE.Mesh(createSculptedPS1HeadGeo(type), faceMat);
    headGroup.add(headMesh);

    // Explicit 3D Faceted Aquiline Nose Prism on the Bridge (Khaki ONLY)
    if (type === 'gullu') {
      const noseGeo = new THREE.ConeGeometry(0.068, 0.19, 4);
      noseGeo.rotateX(Math.PI / 2);
      const noseMesh = new THREE.Mesh(noseGeo, skinMat);
      noseMesh.position.set(0, -0.02, 0.31);
      headGroup.add(noseMesh);
    }

    if (type === 'gullu') {
      // "KHAKI" (The "Agency" Guy): 3D Mustache + Dark Aviator Shades + Khaki Beret with Brass Crest!
      const moonchMat = new THREE.MeshLambertMaterial({ color: 0x090705 });
      for (const side of [-1, 1]) {
        const mWing = new THREE.Mesh(
          new THREE.ConeGeometry(0.038, 0.15, 5),
          moonchMat
        );
        mWing.rotation.z = side * (Math.PI / 2 - 0.18);
        mWing.position.set(side * 0.072, -0.11, 0.29);
        headGroup.add(mWing);
      }

      // Natural PS1 head structure (no floating cartoon googly eye spheres)
      const goldMat = new THREE.MeshBasicMaterial({ color: 0x92400e });

      // Khaki Command Beret / Cap with Brass Badge
      const beretMat = new THREE.MeshLambertMaterial({ color: 0x4a4228 });
      const beretCrown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.29, 0.13, 8),
        beretMat
      );
      beretCrown.position.set(0.02, 0.29, -0.01);
      beretCrown.rotation.z = -0.12;
      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.07, 0.03), goldMat);
      badge.position.set(-0.04, 0.30, 0.27);
      headGroup.add(beretCrown, badge);

      // 3D Sculpted Military Hair Volume covering back and sides of skull
      const hairGeo = new THREE.CylinderGeometry(0.28, 0.30, 0.26, 8);
      hairGeo.scale(0.92, 1, 0.88);
      const hairMat = new THREE.MeshLambertMaterial({ color: 0x14100c });
      const hairMesh = new THREE.Mesh(hairGeo, hairMat);
      hairMesh.position.set(0, 0.12, -0.06);
      headGroup.add(hairMesh);
    } else if (type === 'whitener') {
      // "BABU" (The Civil Servant): Authentic 3D Jinnah Cap Over Wide Bulging Horror Eyes (no goofy spectacles)
      const jinnahCapGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.20, 8);
      jinnahCapGeo.scale(0.78, 1, 1.15);
      const jinnahCap = new THREE.Mesh(
        jinnahCapGeo,
        new THREE.MeshLambertMaterial({ color: 0x141210 })
      );
      jinnahCap.position.set(0, 0.31, 0.0);
      jinnahCap.rotation.x = -0.05;
      headGroup.add(jinnahCap);

      // Babu 3D hair trim covering back and sides of skull
      const babuHairGeo = new THREE.CylinderGeometry(0.27, 0.29, 0.18, 8);
      babuHairGeo.scale(0.94, 1, 0.90);
      const babuHairMat = new THREE.MeshLambertMaterial({ color: 0x1c1814 });
      const babuHair = new THREE.Mesh(babuHairGeo, babuHairMat);
      babuHair.position.set(0, 0.10, -0.05);
      headGroup.add(babuHair);

      // Natural PS1 head structure (no floating cartoon googly eye spheres)
    } else {
      // Chacha Chowkidar: Khaki Watchman Pakol / Beret
      const beret = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.28, 0.12, 8),
        new THREE.MeshLambertMaterial({ color: 0x3f3220 })
      );
      beret.position.set(0, 0.29, 0);
      headGroup.add(beret);
    }

    // 5c. Lurking Demon Eyes in the Pitch-Black (Derived from user reference image)
    let demonEyesMesh = null;
    try {
      const demonEyesTex = new THREE.TextureLoader().load('data:image/png;base64,' + DEMON_EYES_B64);
      demonEyesTex.generateMipmaps = true;
      const demonEyesGeo = new THREE.PlaneGeometry(0.44, 0.15);
      const demonEyesMat = new THREE.MeshBasicMaterial({
        map: demonEyesTex,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      demonEyesMesh = new THREE.Mesh(demonEyesGeo, demonEyesMat);
      demonEyesMesh.name = 'demonEyes';
      demonEyesMesh.position.set(0, 0.035, 0.33);
      demonEyesMesh.visible = false;
      headGroup.add(demonEyesMesh);
    } catch (e) {
      console.warn('Could not initialize demon eyes mesh:', e);
    }

    // 6. Tapered 7-Sided Sleeves, Forearms & Hands
    const upperArmGeo = new THREE.CylinderGeometry(0.12, 0.10, 0.46, 7);
    const forearmGeo = new THREE.CylinderGeometry(0.092, 0.072, 0.44, 7);
    const handGeo = new THREE.SphereGeometry(0.085, 6, 5);

    // Arm Shoulder Mounts (Wider for heavy Babu to comfortably clear his paunch)
    const shoulderX = (type === 'whitener') ? 0.49 : 0.42;
    const shoulderY = (type === 'whitener') ? 1.85 : 1.88;

    // Left Arm (Bent at elbow)
    const armL = new THREE.Group();
    armL.position.set(-shoulderX, shoulderY, 0);
    const uArmL = new THREE.Mesh(upperArmGeo, kameezMat);
    uArmL.position.set(-0.04, -0.2, 0);
    uArmL.rotation.z = 0.14;
    const fArmL = new THREE.Mesh(forearmGeo, kameezMat);
    fArmL.position.set(-0.06, -0.52, 0.16);
    fArmL.rotation.x = -0.85;
    const handL = new THREE.Mesh(handGeo, skinMat);
    handL.position.set(0, -0.24, 0);
    fArmL.add(handL);
    armL.add(uArmL, fArmL);
    bodyGroup.add(armL);

    // Right Arm (Holding prop forward at chest height)
    const armR = new THREE.Group();
    armR.position.set(shoulderX, shoulderY, 0);
    const uArmR = new THREE.Mesh(upperArmGeo, kameezMat);
    uArmR.position.set(0.04, -0.2, 0.04);
    uArmR.rotation.z = -0.14;
    uArmR.rotation.x = -0.35;
    const fArmR = new THREE.Mesh(forearmGeo, kameezMat);
    fArmR.position.set(-0.04, -0.46, 0.16);
    fArmR.rotation.x = -1.25;
    fArmR.rotation.z = 0.35;
    const handR = new THREE.Mesh(handGeo, skinMat);
    handR.position.set(0, -0.24, 0);
    fArmR.add(handR);
    armR.add(uArmR, fArmR);
    bodyGroup.add(armR);

    if (type === 'whitener') {
      // Thick cream kameez sleeves for Babu's heavy build
      uArmL.scale.set(1.22, 1.0, 1.18);
      uArmR.scale.set(1.22, 1.0, 1.18);
      fArmL.scale.set(1.18, 1.0, 1.14);
      fArmR.scale.set(1.18, 1.0, 1.14);

      // Left arm: Tense, hanging slightly bent alongside his left flank
      uArmL.rotation.set(0.16, 0, 0.20);
      fArmL.rotation.set(-0.45, 0.15, -0.10);
      fArmL.position.set(-0.02, -0.46, 0.08);

      // Right arm: Holding the official ECP Form-45 file folder forward and outward, clear of belly
      uArmR.rotation.set(-0.22, 0, -0.20);
      fArmR.rotation.set(-1.15, -0.15, 0.22);
      fArmR.position.set(0.04, -0.44, 0.30);
    }

    // Held Props: Wireless Walkie-Talkie Set for "Khaki" or Dollar Whitener + Mist Cone for "Babu"
    if (type === 'gullu') {
      const radioGroup = new THREE.Group();
      radioGroup.rotation.set(1.16, 0.46, 0.36); // Natural tactical cant angled inward toward chest & forward // Upright vertical orientation in world space
      radioGroup.position.set(0.01, -0.06, 0.04);
      const radioBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.24, 0.065),
        new THREE.MeshLambertMaterial({ color: 0x18181b, emissive: 0x08080a })
      );
      // Top Antenna pointing straight UP
      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.012, 0.26, 5),
        new THREE.MeshLambertMaterial({ color: 0x09090b })
      );
      antenna.position.set(0.03, 0.24, 0);

      // Volume / Channel knob on top
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.04, 6),
        new THREE.MeshLambertMaterial({ color: 0x27272a })
      );
      knob.position.set(-0.025, 0.14, 0);

      // Status LED at top front
      const redLed = new THREE.Mesh(
        new THREE.BoxGeometry(0.022, 0.022, 0.022),
        new THREE.MeshBasicMaterial({ color: 0xff1111 })
      );
      redLed.position.set(0.0, 0.10, 0.035);

      // Speaker grill ridges across front
      const grillGeo = new THREE.BoxGeometry(0.07, 0.012, 0.008);
      const grillMat = new THREE.MeshLambertMaterial({ color: 0x111113 });
      for (const gy of [-0.04, -0.01, 0.02, 0.05]) {
        const grill = new THREE.Mesh(grillGeo, grillMat);
        grill.position.set(0, gy, 0.034);
        radioGroup.add(grill);
      }

      radioGroup.add(radioBody, antenna, knob, redLed);
      handR.add(radioGroup);
    } else if (type === 'whitener') {
      // Classic ECP Official Government File Folder held firmly in Right Hand (Whitener removed)
      const fileFolder = new THREE.Group();
      // Natural grip orientation: folder held upright and angled forward in right hand
      fileFolder.position.set(0.02, 0.08, 0.10);
      fileFolder.rotation.set(0.95, -0.25, 0.20);
      const folderCover = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.44, 0.075),
        new THREE.MeshLambertMaterial({ color: 0x78350f }) // Traditional brown sarkari file folder
      );
      // Red ribbon binding tape
      const redTape = new THREE.Mesh(
        new THREE.BoxGeometry(0.325, 0.045, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xdc2626 })
      );
      // White official Form-45 sheets protruding from top
      const loosePapers = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.06, 0.06),
        new THREE.MeshBasicMaterial({ color: 0xf8fafc })
      );
      loosePapers.position.y = 0.23;
      fileFolder.add(folderCover, redTape, loosePapers);
      handR.add(fileFolder);
    } else if (type === 'chowkidar') {
      // Resting hands on his lap holding his warm Quetta Chai ceramic cup!
      armL.position.set(-0.30, 1.68, 0.05);
      uArmL.rotation.set(0.68, 0, 0.22);
      fArmL.rotation.set(-1.15, 0.45, -0.15);
      fArmL.position.set(-0.02, -0.38, 0.24);

      armR.position.set(0.30, 1.68, 0.05);
      uArmR.rotation.set(0.68, 0, -0.22);
      fArmR.rotation.set(-1.15, -0.45, 0.15);
      fArmR.position.set(0.02, -0.38, 0.24);

      const heldChaiCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.032, 0.10, 8),
        new THREE.MeshLambertMaterial({ color: 0x9a3412 })
      );
      heldChaiCup.position.set(0, -0.22, 0.02);
      handR.add(heldChaiCup);
    }

    group.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    group.userData = {
      head: headGroup,
      headMesh,
      demonEyes: demonEyesMesh,
      neck,
      torso,
      daman: damanMesh,
      armL,
      armR,
      uArmL,
      uArmR,
      fArmL,
      fArmR,
      legL,
      legR,
      bodyGroup,
      type,
      skinMat,
      faceMat,
      shirtMat,
      kameezMat,
      shalwarMat,
      chappalMat,
      currentSkin: 'default',
      currentSkinFrame: 0,
      setSkin: (skinName, frame = 0) => applySkin(group, skinName, frame)
    };
    return group;
  }

  // --- CREATE WALL SCONCE LAMP (Like Reference Image 1's Corridor Wall Bulb!) ---
  function createWallSconce() {
    const sconce = new THREE.Group();
    const woodPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.04, 8),
      new THREE.MeshLambertMaterial({ color: 0x6b4423 })
    );
    woodPlate.rotation.z = Math.PI / 2;
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.04, 0.04),
      new THREE.MeshLambertMaterial({ color: 0x1c1917 })
    );
    arm.position.set(0.11, -0.04, 0);
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 6, 5),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    bulb.position.set(0.2, 0.05, 0);
    sconce.add(woodPlate, arm, bulb);
    return sconce;
  }

  // --- TEXTURES FOR GRITTY 90s WALLS, FLOOR & CHALKBOARD ---
  function createSchoolWallTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Gritty muted dark olive-tan plaster (Matches 90s vintage Pakistani school room & prevents overbright neon glare!)
      ctx.fillStyle = '#4e432a';
      ctx.fillRect(0, 0, w, 78);
      for (let y = 0; y < 78; y += 8) {
        ctx.fillStyle = (y % 16 === 0) ? 'rgba(32, 24, 10, 0.45)' : 'rgba(92, 78, 48, 0.22)';
        ctx.fillRect(0, y, w, 4);
      }
      // Dark olive-green lower dado wall
      ctx.fillStyle = '#141d0e';
      ctx.fillRect(0, 78, w, 50);
      ctx.fillStyle = '#0a1006';
      ctx.fillRect(0, 76, w, 4);

      // Grime & water damage blotches
      ctx.fillStyle = 'rgba(22, 16, 7, 0.55)';
      ctx.fillRect(14, 12, 32, 24);
      ctx.fillRect(76, 30, 28, 26);
      ctx.fillRect(28, 86, 40, 30);
    }, 22);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function createFloorTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      ctx.fillStyle = '#2b261c';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 32) {
        for (let x = 0; x < w; x += 32) {
          ctx.fillStyle = ((x + y) / 32) % 2 === 0 ? '#332d21' : '#241f16';
          ctx.fillRect(x, y, 32, 32);
          ctx.strokeStyle = '#17140e';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, 32, 32);
        }
      }
    }, 24);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createCollegeWallTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Authentic Lahore colonial red brick masonry (Running bond pattern)
      // Dark aged mortar joint base
      ctx.fillStyle = '#231d1a';
      ctx.fillRect(0, 0, w, h);

      const brickColors = [
        '#782415', '#8b2b1a', '#993320', '#6b1f12',
        '#a13a25', '#5c190d', '#842817', '#912e1c'
      ];
      const brickH = 10;
      const rowStep = 12; // 10px brick + 2px mortar
      const brickW = 22;
      const colStep = 24; // 22px brick + 2px mortar

      let colorIdx = 0;
      for (let y = 0, rowIdx = 0; y < h; y += rowStep, rowIdx++) {
        const offset = (rowIdx % 2 === 1) ? 12 : 0;
        const isDampBase = (y >= 104);
        for (let x = -offset; x < w + colStep; x += colStep) {
          const bh = Math.min(brickH, h - y);
          if (bh <= 0) continue;
          let c = brickColors[(colorIdx * 7 + rowIdx * 3) % brickColors.length];
          colorIdx++;
          if (isDampBase) {
            c = (rowIdx % 2 === 0) ? '#45130a' : '#360e06';
          }
          ctx.fillStyle = c;
          ctx.fillRect(x, y, brickW, bh);

          // Subtle brick 3D bevel / mortar shadow
          if (!isDampBase && bh > 3) {
            ctx.fillStyle = '#ad432d';
            ctx.fillRect(x + 1, y, brickW - 2, 1);
            ctx.fillStyle = '#4a140a';
            ctx.fillRect(x + 1, y + bh - 1, brickW - 2, 1);
          }
        }
      }

      // Weathered kiln speckling & damp salt efflorescence
      ctx.fillStyle = '#3a130c';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 37) % w;
        const sy = (i * 53) % h;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.fillStyle = '#b85842';
      for (let i = 0; i < 25; i++) {
        const sx = (i * 47) % w;
        const sy = (i * 29) % h;
        ctx.fillRect(sx, sy, 1, 1);
      }
    }, 22);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    return tex;
  }

  function createWarehouseWallTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Industrial cold brushed steel / galvanized metallic sheet background
      ctx.fillStyle = '#27313c';
      ctx.fillRect(0, 0, w, h);

      // Metallic vertical sheen gradient
      for (let y = 0; y < h; y += 4) {
        const shine = ((y % 32) < 16) ? 'rgba(148, 163, 184, 0.08)' : 'rgba(15, 23, 42, 0.12)';
        ctx.fillStyle = shine;
        ctx.fillRect(0, y, w, 4);
      }

      // Corrugated steel container ribs (vertical ridges every 16px)
      for (let x = 0; x < w; x += 16) {
        // Shadow groove
        ctx.fillStyle = '#151b22';
        ctx.fillRect(x, 0, 2, h);
        // Rib face
        ctx.fillStyle = '#334150';
        ctx.fillRect(x + 2, 0, 11, h);
        // Specular metallic highlight edge
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x + 2, 0, 1, h);
        ctx.fillStyle = '#7c8ba1';
        ctx.fillRect(x + 3, 0, 1, h);
        // Trailing rib shadow
        ctx.fillStyle = '#222b35';
        ctx.fillRect(x + 13, 0, 2, h);
      }

      // Horizontal steel plate weld seams
      for (const wy of [42, 86]) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, wy - 1, w, 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(0, wy + 1, w, 1);
      }

      // Heavy steel rivets / hex bolts along seams & ribs
      for (let x = 8; x < w; x += 16) {
        for (const by of [12, 40, 46, 84, 90, 114]) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(x, by, 2, 2);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 1, by + 1, 1, 1);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x, by, 1, 1);
        }
      }

      // Port of Karachi maritime salt spray and oxidized rust drips
      const rustCols = ['#78350f', '#9a3412', '#b45309', '#5c2206'];
      for (const rx of [24, 56, 88, 104]) {
        for (const rstart of [14, 48, 92]) {
          for (let dy = 0; dy < 16; dy++) {
            ctx.fillStyle = rustCols[dy % rustCols.length];
            ctx.fillRect(rx + (dy % 4 === 0 ? 1 : 0), rstart + dy, 1, 1);
          }
        }
      }

      // Industrial welded heavy steel kickplate base with caution yellow stripes
      ctx.fillStyle = '#182029';
      ctx.fillRect(0, 106, w, 22);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 105, w, 1);
      for (let hx = -20; hx < w + 20; hx += 16) {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(hx, 106);
        ctx.lineTo(hx + 8, 106);
        ctx.lineTo(hx + 2, 128);
        ctx.lineTo(hx - 6, 128);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('STEEL-CONTAINER 241', 8, 36);
    }, 22);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1.5);
    return tex;
  }

  function createCollegeFloorTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Heritage terracotta herringbone / dark timber parquet
      ctx.fillStyle = '#35190c';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 32) {
        for (let x = 0; x < w; x += 32) {
          ctx.fillStyle = ((x + y) / 32) % 2 === 0 ? '#422010' : '#2a1309';
          ctx.fillRect(x, y, 32, 32);
          ctx.strokeStyle = '#1a0b05';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, 32, 32);
          ctx.fillStyle = 'rgba(0,0,0,0.2)';
          ctx.fillRect(x + 4, y + 8, 24, 2);
          ctx.fillRect(x + 4, y + 20, 24, 2);
        }
      }
    }, 24);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createWarehouseFloorTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Cold industrial poured concrete with forklift tracks & oil stains
      ctx.fillStyle = '#171c22';
      ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 64) {
        for (let x = 0; x < w; x += 64) {
          ctx.strokeStyle = '#0f1317';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, 64, 64);
        }
      }
      ctx.fillStyle = '#d97706';
      ctx.fillRect(0, 58, w, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(16, 12, 36, 14);
      ctx.fillRect(72, 38, 44, 20);
    }, 24);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createWoodTex(baseHex = '#4a2e16') {
    return makePS1Texture(64, 64, (ctx, w, h) => {
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      for (let y = 0; y < h; y += 8) {
        ctx.fillRect(0, y, w, 2);
      }
    }, 18);
  }

  function createSarkariDoorTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Heavy rusted red-oxide & peeling dark-green Sarkari school door
      ctx.fillStyle = '#4a1815';
      ctx.fillRect(0, 0, w, h);
      // Recessed door panels
      ctx.strokeStyle = '#240907';
      ctx.lineWidth = 5;
      ctx.strokeRect(8, 8, w - 16, h - 16);
      ctx.fillStyle = '#38110e';
      ctx.fillRect(18, 18, w - 36, 42);
      ctx.fillRect(18, 68, w - 36, 44);
      // Industrial steel rivets along frame
      ctx.fillStyle = '#94a3b8';
      for (let y = 12; y < h - 8; y += 18) {
        ctx.fillRect(11, y, 3, 3);
        ctx.fillRect(w - 14, y, 3, 3);
      }
      // Faded stencil marking
      ctx.fillStyle = 'rgba(254, 240, 138, 0.55)';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CLASS 8-B · NA-47', w / 2, 42);
    }, 20);
  }

  function createWindowShutterTex() {
    return makePS1Texture(64, 128, (ctx, w, h) => {
      // Weathered Sarkari teak-wood shutter leaf with horizontal louver slats
      ctx.fillStyle = '#4d2f16';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#261508';
      ctx.lineWidth = 4;
      ctx.strokeRect(3, 3, w - 6, h - 6);
      // Horizontal wooden louver slats (Jhilmil)
      for (let y = 12; y < h - 12; y += 8) {
        ctx.fillStyle = '#331d0b';
        ctx.fillRect(8, y, w - 16, 4);
        ctx.fillStyle = '#694221';
        ctx.fillRect(8, y + 4, w - 16, 2);
      }
    }, 18);
  }

  function createAsphaltRoadTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Dark weathered tarmac / asphalt road
      ctx.fillStyle = '#181b1f';
      ctx.fillRect(0, 0, w, h);

      // Fine aggregate stone & gravel texture
      for (let i = 0; i < 600; i++) {
        const x = Math.floor(Math.random() * w);
        const y = Math.floor(Math.random() * h);
        const grey = 18 + Math.floor(Math.random() * 26);
        ctx.fillStyle = `rgb(${grey},${grey + 2},${grey + 3})`;
        ctx.fillRect(x, y, 2, 2);
      }

      // Asphalt cracks & dark oil drip patches
      ctx.fillStyle = 'rgba(10, 11, 13, 0.7)';
      ctx.fillRect(12, 16, 28, 20);
      ctx.fillRect(64, 58, 36, 24);

      // White pedestrian zebra crossing stripes outside school gate
      ctx.fillStyle = 'rgba(210, 218, 226, 0.75)';
      ctx.fillRect(8, 24, 28, 80);
      ctx.fillRect(48, 24, 28, 80);
      ctx.fillRect(88, 24, 28, 80);

      // Yellow road shoulder edge stripe
      ctx.fillStyle = 'rgba(195, 155, 42, 0.85)';
      ctx.fillRect(0, 118, w, 6);
    }, 18);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createCurbHazardTex() {
    const tex = makePS1Texture(64, 64, (ctx, w, h) => {
      // Alternating Pakistani yellow and black hazard curb stones (Kerb)
      ctx.fillStyle = '#222326';
      ctx.fillRect(0, 0, w / 2, h);
      ctx.fillStyle = '#c99a2c';
      ctx.fillRect(w / 2, 0, w / 2, h);

      // Weathering & road dirt along bottom
      ctx.fillStyle = 'rgba(18, 14, 10, 0.45)';
      ctx.fillRect(0, h - 12, w, 12);
    }, 16);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 1);
    return tex;
  }

  function createSchoolSignTex() {
    return makePS1Texture(256, 64, (ctx, w, h) => {
      // Official dark green Pakistani sarkari school sign board with white border
      ctx.fillStyle = '#0f381e';
      ctx.fillRect(0, 0, w, h);

      // White double border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.strokeRect(7, 7, w - 14, h - 14);

      // Header English text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOVT. BOYS HIGH SCHOOL', w / 2, 24);

      // Subtitle Urdu / Polling station banner
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('★ POLLING STATION · NA-47 ★', w / 2, 43);

      // Small Urdu footer
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '10px sans-serif';
      ctx.fillText('حکومت پاکستان — الیکشن کمیشن', w / 2, 57);
    }, 10);
  }

  function createCollegeSignTex() {
    return makePS1Texture(256, 64, (ctx, w, h) => {
      // Historic colonial navy blue & gold British-era college signboard
      ctx.fillStyle = '#0a1e16';
      ctx.fillRect(0, 0, w, h);

      // Gold ornate double border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.strokeStyle = '#996515';
      ctx.lineWidth = 1;
      ctx.strokeRect(7, 7, w - 14, h - 14);

      // Header English text
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('GOVT. DEGREE COLLEGE, LAHORE', w / 2, 22);

      // Subtitle
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('ESTABLISHED 1928 · CANAL ROAD CAMPUS', w / 2, 38);

      // ECP Polling Station Badge
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('★ HALQA NA-128 · POLLING STATION ★', w / 2, 54);
    }, 10);
  }

  function createCanalMilestoneTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Whitewashed concrete milestone curved block
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, w, h);

      // Top curved band in highway yellow
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(w / 2, 45, 45, Math.PI, 0, false);
      ctx.fill();

      // Black stenciled milestone text
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.font = '900 16px monospace';
      ctx.fillText('N-5 / CANAL', w / 2, 38);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText('2 KM', w / 2, 75);

      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('LAHORE', w / 2, 105);

      // Weathered grime around base
      ctx.fillStyle = 'rgba(78, 60, 40, 0.45)';
      ctx.fillRect(0, 110, w, 18);
    }, 10);
  }

  function createLectureChalkboardTex() {
    return makePS1Texture(256, 128, (ctx, w, h) => {
      // Deep chalkboard slate green
      ctx.fillStyle = '#133324';
      ctx.fillRect(0, 0, w, h);

      // Wood frame border
      ctx.strokeStyle = '#5a3d28';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, w - 6, h - 6);

      // Chalk dusting
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(10, 10, w - 20, h - 20);

      // Chalk writing
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('POLITICAL SCIENCE · LECTURE 04', 16, 24);
      ctx.fillText('CONSTITUTION OF PAKISTAN 1973', 16, 40);

      ctx.fillStyle = '#fef08a';
      ctx.fillText('ART. 218(3): ECP MANDATE & DUTIES', 16, 58);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText('1. Form-45: Polling Station Count', 16, 76);
      ctx.fillText('2. Form-47: Halqa Returning Officer', 16, 92);
      ctx.fillText('3. Tamper-evident seals on boxes', 16, 108);

      // Chalk diagram box
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.strokeRect(175, 68, 65, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('BOX SEAL', 182, 94);
    }, 8);
  }

  function createCollegeNoticeTex() {
    return makePS1Texture(256, 128, (ctx, w, h) => {
      // Cork / wood bulletin board
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(0, 0, w, h);

      // Pinned notices
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(12, 12, 100, 100);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('PUNJAB UNIV.', 18, 26);
      ctx.fillText('EXAM DATES', 18, 38);
      ctx.fillStyle = '#dc2626';
      ctx.fillText('POSTPONED', 18, 52);

      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(125, 12, 115, 50);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('ELECTION 2024', 132, 28);
      ctx.fillText('POLLING STAFF ONLY', 132, 42);

      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(125, 68, 115, 44);
      ctx.fillStyle = '#0369a1';
      ctx.fillText('WAPDA LOAD SHEDDING', 130, 84);
      ctx.fillText('SCHEDULE 00:00-06:00', 130, 98);
    }, 8);
  }

  // --- LEVEL 3 (NA-241 KARACHI PORT / RO CENTRAL WAREHOUSE) TEXTURE GENERATORS ---
  function createKhiPortSignTex() {
    return makePS1Texture(256, 64, (ctx, w, h) => {
      // Weathered marine industrial navy blue plate
      ctx.fillStyle = '#0b1d33';
      ctx.fillRect(0, 0, w, h);

      // Yellow/Black diagonal safety hazard bands across top & bottom
      function drawHazardStripe(y, ht) {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(0, y, w, ht);
        ctx.fillStyle = '#0f172a';
        for (let x = -20; x < w + 20; x += 18) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 9, y);
          ctx.lineTo(x + 1, y + ht);
          ctx.lineTo(x - 8, y + ht);
          ctx.closePath();
          ctx.fill();
        }
      }
      drawHazardStripe(0, 6);
      drawHazardStripe(h - 6, 6);

      // Main English header
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PORT OF KARACHI · TERMINAL 03', w / 2, 22);

      // Halqa subtitle
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('★ HALQA NA-241 · RO CENTRAL STRONGROOM ★', w / 2, 38);

      // Restriction alert
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('STRICTLY RESTRICTED · NO ENTRY WITHOUT FORM-33', w / 2, 52);
    }, 10);
  }

  function createShippingContainerTex(baseHex, ribHex, idCode) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Base corrugated panel
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, w, h);

      // Vertical corrugated ribs with drop shadows
      for (let x = 0; x < w; x += 16) {
        ctx.fillStyle = ribHex;
        ctx.fillRect(x + 2, 0, 7, h);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(x + 9, 0, 3, h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x, 0, 2, h);
      }

      // Faded, weathered stenciled container markings (not glaring white)
      ctx.fillStyle = '#8391a3';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(idCode, 8, 20);
      ctx.font = '7px monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('MAX GR. 30,480 KG', 8, 34);
      ctx.fillText('TARE WT. 2,200 KG', 8, 44);
      ctx.fillText('ECP ARCHIVE SACKS', 8, 54);

      // Weathered Dull Hazard Diamond
      ctx.save();
      ctx.translate(96, 28);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#6b3317'; // Weathered dark rust diamond instead of neon orange
      ctx.fillRect(-10, -10, 20, 20);
      ctx.strokeStyle = '#82909e';
      ctx.lineWidth = 1;
      ctx.strokeRect(-9, -9, 18, 18);
      ctx.restore();

      // Atmospheric dark grime and grime drips
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(0, h - 28, w, 28);
      for (const gx of [18, 52, 84, 110]) {
        ctx.fillRect(gx, 0, 2, 45);
      }
    }, 12);
  }

  function createCustomsRosterTex() {
    return makePS1Texture(256, 128, (ctx, w, h) => {
      // Galvanized steel inspection roster clipboard
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      // Paper sheet pinned on board
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(10, 8, w - 20, h - 16);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ECP DISTRICT CENTRAL (KARACHI) · FORM-45 AUDIT', w / 2, 24);

      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('CONSTITUENCY: NA-241 KARACHI IX', 18, 40);

      ctx.fillStyle = '#1e293b';
      ctx.fillText('• POLLING STATIONS: 001 - 215 (ALL SACKS ACCOUNTED)', 18, 56);
      ctx.fillText('• TAMPER SEALS: SINDH ECP GREEN WIRE SEALS VERIFIED', 18, 70);
      ctx.fillText('• TABULATION STATUS: FORM-47 CONSOLIDATION IN PROGRESS', 18, 84);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('[ RO SECURITY CLEARANCE: LEVEL 3 AUTHORIZED ]', 18, 106);
    }, 8);
  }

  function createKeElectricSignTex() {
    return makePS1Texture(128, 64, (ctx, w, h) => {
      // High-voltage warning yellow plate with black border
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, w - 4, h - 4);

      // Warning lightning bolt triangle
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(22, 10);
      ctx.lineTo(38, 44);
      ctx.lineTo(6, 44);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡', 22, 38);

      // Text
      ctx.fillStyle = '#000000';
      ctx.font = '900 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('K-ELECTRIC 11,000V', 44, 24);
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('KHATRA · DANGER', 44, 38);
      ctx.font = '7.5px monospace';
      ctx.fillStyle = '#1e293b';
      ctx.fillText('DO NOT TOUCH TRANSFORMER', 44, 50);
    }, 10);
  }

  function createRoBannerTex() {
    return makePS1Texture(256, 64, (ctx, w, h) => {
      // Dark emerald green velvet banner with gold trim
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.strokeRect(3, 3, w - 6, h - 6);

      ctx.fillStyle = '#fef08a';
      ctx.font = '900 12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('ELECTION COMMISSION OF PAKISTAN', w / 2, 22);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('RETURNING OFFICER · HALQA NA-241 SINDH', w / 2, 38);

      ctx.fillStyle = '#86efac';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText('★ CENTRAL FORM-47 STRONGROOM VAULT ★', w / 2, 52);
    }, 10);
  }

  function createVaultDoorTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Heavy circular bank vault door plate with radial brushed steel
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 56, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Outer rivet circle
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const rx = w / 2 + Math.cos(angle) * 48;
        const ry = h / 2 + Math.sin(angle) * 48;
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#cbd5e1';
        ctx.fill();
      }

      // Center spoke hub
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 16, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dual Combination Dials
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(44, 44, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(84, 44, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(44, 44, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(84, 44, 8, 0, Math.PI * 2); ctx.stroke();
    }, 10);
  }

  function createGatePillarTex() {
    return makePS1Texture(64, 128, (ctx, w, h) => {
      // Terracotta brick & whitewashed plaster pillar
      ctx.fillStyle = '#5c2d1b';
      ctx.fillRect(0, 0, w, h);

      // Mortar lines
      for (let y = 0; y < h; y += 10) {
        ctx.fillStyle = '#3a1e12';
        ctx.fillRect(0, y, w, 2);
        for (let x = (y % 20 === 0 ? 0 : 16); x < w; x += 32) {
          ctx.fillRect(x, y, 2, 10);
        }
      }

      // Whitewash plaster on upper section
      ctx.fillStyle = 'rgba(180, 175, 155, 0.7)';
      ctx.fillRect(0, 0, w, 42);
      ctx.fillStyle = '#261508';
      ctx.fillRect(0, 40, w, 3);
    }, 18);
  }

  function createLahoreRedBrickPillarTex() {
    return makePS1Texture(64, 128, (ctx, w, h) => {
      // Heritage Lahore colonial red brick pillar shaft
      ctx.fillStyle = '#231d1a';
      ctx.fillRect(0, 0, w, h);
      const brickColors = ['#782415', '#8b2b1a', '#993320', '#6b1f12', '#a13a25'];
      for (let y = 0, rowIdx = 0; y < h; y += 10, rowIdx++) {
        const offset = (rowIdx % 2 === 1) ? 14 : 0;
        for (let x = -offset; x < w + 28; x += 28) {
          ctx.fillStyle = brickColors[(rowIdx * 3 + Math.floor(x / 28) * 2) % brickColors.length];
          ctx.fillRect(x, y, 26, 8);
        }
      }
      // Heritage carved stone capital on top
      ctx.fillStyle = '#4a3f33';
      ctx.fillRect(0, 0, w, 16);
      ctx.fillStyle = '#1c1712';
      ctx.fillRect(0, 15, w, 2);
    }, 18);
  }

  function createKarachiMetallicPillarTex() {
    return makePS1Texture(64, 128, (ctx, w, h) => {
      // Industrial bolted steel I-beam column
      ctx.fillStyle = '#1e2631';
      ctx.fillRect(0, 0, w, h);

      // Flange outer edges & inner web
      ctx.fillStyle = '#0f141a';
      ctx.fillRect(0, 0, 10, h);
      ctx.fillRect(w - 10, 0, 10, h);
      ctx.fillStyle = '#475569';
      ctx.fillRect(9, 0, 2, h);
      ctx.fillRect(w - 11, 0, 2, h);

      // Vertical rivet columns
      for (let y = 8; y < h; y += 14) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(4, y, 3, 3);
        ctx.fillRect(w - 7, y, 3, 3);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(5, y + 1, 1, 1);
        ctx.fillRect(w - 6, y + 1, 1, 1);
      }

      // Base hazard stripes (lower 36px)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, h - 36, w, 36);
      for (let x = -20; x < w + 20; x += 12) {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.moveTo(x, h - 36);
        ctx.lineTo(x + 6, h - 36);
        ctx.lineTo(x + 1, h);
        ctx.lineTo(x - 5, h);
        ctx.closePath();
        ctx.fill();
      }
    }, 18);
  }

  function createLahoreRedBrickOutdoorWallTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Outdoor Lahore colonial red brick boundary wall with election stencils
      ctx.fillStyle = '#231d1a';
      ctx.fillRect(0, 0, w, h);

      const brickColors = ['#782415', '#8b2b1a', '#993320', '#6b1f12', '#a13a25', '#5c190d'];
      for (let y = 0, rowIdx = 0; y < h; y += 12, rowIdx++) {
        const offset = (rowIdx % 2 === 1) ? 12 : 0;
        const isDampBase = (y >= 96);
        for (let x = -offset; x < w + 24; x += 24) {
          let c = brickColors[(rowIdx * 3 + Math.floor(x / 24) * 5) % brickColors.length];
          if (isDampBase) c = '#381008';
          ctx.fillStyle = c;
          ctx.fillRect(x, y, 22, 10);
        }
      }

      // Concrete coping stone along top edge
      ctx.fillStyle = '#574d3f';
      ctx.fillRect(0, 0, w, 8);
      ctx.fillStyle = '#2c251d';
      ctx.fillRect(0, 8, w, 2);

      // Faded election graffiti / stencils
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('NA-128', 12, 46);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('LAHORE', 68, 46);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('FORM-45', 36, 70);
    }, 20);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  function createCctvFormTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Aged Ivory / White Paper
      ctx.fillStyle = '#fdfbf2';
      ctx.fillRect(0, 0, w, h);

      // Official dark blue and green borders
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1;
      ctx.strokeRect(7, 7, w - 14, h - 14);

      // ECP Form Header
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, 10, w - 20, 16);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FORM - 45', w / 2, 22);

      // Candidate count table lines
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let y = 32; y < 100; y += 11) {
        ctx.beginPath();
        ctx.moveTo(12, y);
        ctx.lineTo(w - 12, y);
        ctx.stroke();
      }

      // Circular Official ECP Stamp in bottom-right corner
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(96, 92, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('ECP', 96, 95);
    }, 15);
  }

  function createKarachiMetallicOutdoorWallTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Industrial shipping container / metallic sheet boundary wall
      ctx.fillStyle = '#1e2630';
      ctx.fillRect(0, 0, w, h);

      // Vertical corrugated sheet panels
      for (let x = 0; x < w; x += 16) {
        ctx.fillStyle = '#11171d';
        ctx.fillRect(x, 0, 2, h);
        ctx.fillStyle = '#2a3542';
        ctx.fillRect(x + 2, 0, 11, h);
        ctx.fillStyle = '#475569';
        ctx.fillRect(x + 2, 0, 1, h);
        ctx.fillStyle = '#1a222b';
        ctx.fillRect(x + 13, 0, 2, h);
      }

      // Horizontal container tie beams
      for (const by of [28, 80]) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, by, w, 4);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, by, w, 1);
        for (let rx = 6; rx < w; rx += 16) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(rx, by + 1, 2, 2);
        }
      }

      // Rust drips
      ctx.fillStyle = '#78350f';
      for (const rx of [18, 50, 82, 114]) {
        ctx.fillRect(rx, 32, 1, 14);
        ctx.fillRect(rx, 84, 1, 18);
      }

      // Heavy industrial stenciling
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('PORT OF KARACHI', 10, 48);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('HALQA NA-241', 20, 64);
      ctx.fillStyle = '#ca8a04';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('TERMINAL-03', 30, 108);
    }, 20);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  function createCharpaiTex() {
    const tex = makePS1Texture(64, 64, (ctx, w, h) => {
      // Traditional crisscross woven jute rope pattern (Baan)
      ctx.fillStyle = '#8a6843';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#6e5132';
      for (let i = 0; i < w; i += 8) {
        ctx.fillRect(i, 0, 4, h);
        ctx.fillRect(0, i, w, 4);
      }
      ctx.fillStyle = '#50381e';
      for (let y = 0; y < h; y += 8) {
        for (let x = 0; x < w; x += 8) {
          if ((x + y) % 16 === 0) ctx.fillRect(x, y, 4, 4);
        }
      }
    }, 16);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 2);
    return tex;
  }

  function createBoundaryWallOutdoorTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Pakistani school exterior boundary wall with faded election graffiti and plaster
      ctx.fillStyle = '#6b5e47';
      ctx.fillRect(0, 0, w, h);

      // Lower damp base
      ctx.fillStyle = '#3b3222';
      ctx.fillRect(0, 88, w, 40);

      // Mortar lines / concrete block texture
      ctx.strokeStyle = '#4a3f2c';
      ctx.lineWidth = 1;
      for (let y = 0; y < 88; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Faded election stencil / posters
      ctx.fillStyle = '#991b1b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('NA-47', 12, 48);
      ctx.fillStyle = '#15803d';
      ctx.fillText('VOTE', 72, 48);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('FORM-45', 38, 72);
    }, 20);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }

  function createBrickHerringboneTex() {
    const tex = makePS1Texture(128, 128, (ctx, w, h) => {
      // Pakistani school courtyard herringbone brick pavement
      ctx.fillStyle = '#613323';
      ctx.fillRect(0, 0, w, h);

      for (let y = 0; y < h; y += 16) {
        for (let x = 0; x < w; x += 32) {
          const shift = (Math.floor(y / 16) % 2) * 16;
          const bx = (x + shift) % w;
          const shade = ((bx + y) % 64 === 0) ? '#6e3926' : '#572d1f';
          ctx.fillStyle = shade;
          ctx.fillRect(bx + 1, y + 1, 30, 14);

          ctx.strokeStyle = '#29140c';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx + 1, y + 1, 30, 14);
        }
      }

      ctx.fillStyle = 'rgba(28, 38, 20, 0.45)';
      ctx.fillRect(10, 14, 28, 22);
      ctx.fillRect(72, 60, 36, 26);
    }, 20);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
  }

  function createPakistaniFlagTex() {
    return makePS1Texture(128, 64, (ctx, w, h) => {
      // Official Pakistan national flag: 1/4 white stripe on hoist, 3/4 dark green field
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, w / 4, h);

      ctx.fillStyle = '#01411c';
      ctx.fillRect(w / 4, 0, (w * 3) / 4, h);

      // White crescent moon and 5-pointed star
      const cx = (w * 5) / 8;
      const cy = h / 2;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#01411c';
      ctx.beginPath();
      ctx.arc(cx + 6, cy - 3, 15, 0, Math.PI * 2);
      ctx.fill();

      // 5-Pointed Star
      ctx.fillStyle = '#ffffff';
      const sx = cx + 8;
      const sy = cy - 6;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const a2 = a1 + Math.PI / 5;
        const r1 = 7, r2 = 3.5;
        ctx.lineTo(sx + Math.cos(a1) * r1, sy + Math.sin(a1) * r1);
        ctx.lineTo(sx + Math.cos(a2) * r2, sy + Math.sin(a2) * r2);
      }
      ctx.closePath();
      ctx.fill();
    }, 12);
  }

  function createNoticeBoardTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Wooden frame with dark green felt pinboard
      ctx.fillStyle = '#3a2012';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#164227';
      ctx.fillRect(8, 8, w - 16, h - 16);

      // Pinned official examination & election notices
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(16, 16, 42, 50);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('DATE SHEET', 18, 28);
      ctx.fillText('ANNUAL 2024', 18, 38);
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(20, 44, 34, 3);
      ctx.fillRect(20, 52, 28, 3);

      // Polling duty circular
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(68, 18, 46, 54);
      ctx.fillStyle = '#047857';
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('ECP NOTICE', 72, 30);
      ctx.fillText('NA-47 BOOTH', 72, 40);
      ctx.fillStyle = '#dc2626';
      ctx.fillText('★ OFFICIAL ★', 72, 52);

      // Dengue alert poster
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(24, 76, 78, 40);
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('DENGUE SOPs', 28, 92);
      ctx.fillStyle = '#475569';
      ctx.font = '7px sans-serif';
      ctx.fillText('Govt. of Pakistan', 28, 104);
    }, 16);
  }

  function createPersianRugTex() {
    return makePS1Texture(256, 256, (ctx, w, h) => {
      // Traditional Victorian Lahore / Kashmiri Persian carpet pattern
      ctx.fillStyle = '#580c14'; // Deep rich ruby field
      ctx.fillRect(0, 0, w, h);

      // Ornate outer cream/gold border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, w - 14, h - 14);

      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, w - 32, h - 32);

      // Inner navy arabesque border
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(20, 20, w - 40, 16);
      ctx.fillRect(20, h - 36, w - 40, 16);
      ctx.fillRect(20, 20, 16, h - 40);
      ctx.fillRect(w - 36, 20, 16, h - 40);

      // Floral dots in borders
      ctx.fillStyle = '#fde047';
      for (let x = 28; x < w - 28; x += 18) {
        ctx.fillRect(x, 26, 6, 6);
        ctx.fillRect(x, h - 32, 6, 6);
      }
      for (let y = 28; y < h - 28; y += 18) {
        ctx.fillRect(26, y, 6, 6);
        ctx.fillRect(w - 32, y, 6, 6);
      }

      // Large central medallion
      const cx = w / 2, cy = h / 2;
      ctx.fillStyle = '#065f46'; // emerald ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, 64, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 48, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fill();

      // Fringe tassels along top and bottom
      ctx.fillStyle = '#fef3c7';
      for (let x = 0; x < w; x += 4) {
        ctx.fillRect(x, 0, 2, 6);
        ctx.fillRect(x, h - 6, 2, 6);
      }
    }, 18);
  }

  function createWaterCoolerTex() {
    return makePS1Texture(64, 128, (ctx, w, h) => {
      // Classic Pakistani stainless steel electric water cooler (Thanda Paani)
      ctx.fillStyle = '#64748b';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(4, 4, w - 8, 24);
      ctx.fillStyle = '#334155';
      ctx.fillRect(8, 10, w - 16, 14);

      // Blue enamel brand panel: "THANDA PAANI"
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(6, 34, w - 12, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WATER COOLER', w / 2, 48);
      ctx.fillText('صاف اور ٹھنڈا پانی', w / 2, 58);

      // Red and blue plastic push-taps
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(14, 70, 12, 18);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(38, 70, 12, 18);

      // Bottom grill drainage
      ctx.fillStyle = '#1e293b';
      for (let y = 96; y < h - 8; y += 6) {
        ctx.fillRect(8, y, w - 16, 3);
      }
    }, 14);
  }

  function createAlmirahTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      // Sarkari green steel filing cupboard (Almirah)
      ctx.fillStyle = '#223824';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#0d180e';
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.beginPath();
      ctx.moveTo(w / 2, 4);
      ctx.lineTo(w / 2, h - 4);
      ctx.stroke();

      ctx.fillStyle = '#d97706';
      ctx.fillRect(w / 2 - 10, 58, 6, 16);
      ctx.fillRect(w / 2 + 4, 58, 6, 16);
      ctx.fillStyle = '#090d09';
      ctx.fillRect(w / 2 - 4, 54, 8, 8);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('REGISTERS 2024', 12, 24);
      ctx.fillText('FORM-45 TALLIES', 12, 40);
    }, 18);
  }

  const QUAID_B64_COLOR = "data:image/png;base64,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";
  const DEMON_EYES_B64 = "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";

const QUAID_B64_BW = "data:image/png;base64,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";

  function createQuaidPortraitTex(variant = 'color') {
    const w = 256;
    const h = 352;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    const isColor = (variant === 'color');
    const imgSrc = isColor ? QUAID_B64_COLOR : QUAID_B64_BW;

    function drawBaseFrame() {
      // 1. Ornate dark rosewood / teak frame
      ctx.fillStyle = isColor ? '#2e180d' : '#221e1a';
      ctx.fillRect(0, 0, w, h);

      // Frame bevel & rich wood tone
      ctx.strokeStyle = isColor ? '#542d17' : '#3f3a34';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, w - 6, h - 6);

      // Inner shadow of outer frame
      ctx.strokeStyle = '#120a05';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // 2. Gold / Brass inner bevel
      ctx.strokeStyle = isColor ? '#b8860b' : '#78716c';
      ctx.lineWidth = 4;
      ctx.strokeRect(14, 14, w - 28, h - 28);

      // 3. Matting / Passepartout (Archival Off-White / Ivory)
      ctx.fillStyle = isColor ? '#ede5d4' : '#d6d3cd';
      ctx.fillRect(18, 18, w - 36, h - 36);

      // Thin inner gold fillet
      ctx.strokeStyle = isColor ? '#92400e' : '#52525b';
      ctx.lineWidth = 2;
      ctx.strokeRect(26, 26, w - 52, h - 78);

      // Inner portrait background
      ctx.fillStyle = isColor ? '#1c2419' : '#18181b';
      ctx.fillRect(28, 28, w - 56, h - 82);

      // 4. Brass engraved nameplate at bottom
      const plateX = 32;
      const plateY = h - 44;
      const plateW = w - 64;
      const plateH = 22;

      ctx.fillStyle = isColor ? '#c29339' : '#a1a1aa';
      ctx.fillRect(plateX, plateY, plateW, plateH);

      ctx.strokeStyle = isColor ? '#78350f' : '#3f3f46';
      ctx.lineWidth = 2;
      ctx.strokeRect(plateX + 1, plateY + 1, plateW - 2, plateH - 2);

      // Brass corner rivets on nameplate
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(plateX + 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.arc(plateX + plateW - 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Engraved lettering
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QUAID-E-AZAM', w / 2, plateY + 12);
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('MUHAMMAD ALI JINNAH', w / 2, plateY + 19);
    }

    function renderImageOntoCanvas(img) {
      drawBaseFrame();

      const targetX = 28;
      const targetY = 28;
      const targetW = w - 56;
      const targetH = h - 82;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, targetX, targetY, targetW, targetH);

      ctx.strokeStyle = isColor ? '#92400e' : '#52525b';
      ctx.lineWidth = 2;
      ctx.strokeRect(27, 27, targetW + 2, targetH + 2);

      // Redraw nameplate over bottom edge
      const plateX = 32;
      const plateY = h - 44;
      const plateW = w - 64;
      const plateH = 22;

      ctx.fillStyle = isColor ? '#c29339' : '#a1a1aa';
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.strokeStyle = isColor ? '#78350f' : '#3f3f46';
      ctx.lineWidth = 2;
      ctx.strokeRect(plateX + 1, plateY + 1, plateW - 2, plateH - 2);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(plateX + 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.arc(plateX + plateW - 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QUAID-E-AZAM', w / 2, plateY + 12);
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('MUHAMMAD ALI JINNAH', w / 2, plateY + 19);
    }

    drawBaseFrame();

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    // Load authentic portrait via self-contained base64 data URI
    const img = new Image();
    img.onload = () => {
      renderImageOntoCanvas(img);
      tex.needsUpdate = true;
    };
    img.src = imgSrc;

    if (img.complete && img.naturalWidth > 0) {
      renderImageOntoCanvas(img);
      tex.needsUpdate = true;
    }

    return tex;
  }

  function createCrackDecalCanvas(type = 'door') {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    let isCleared = false;
    let lastRenderKey = '';

    function render(dmgPct, flash = 0) {
      if (dmgPct <= 0.05 && flash <= 0.05) {
        if (!isCleared) {
          ctx.clearRect(0, 0, 256, 256);
          tex.needsUpdate = true;
          isCleared = true;
          lastRenderKey = 'cleared';
        }
        return;
      }
      isCleared = false;

      const qDmg = Math.round(dmgPct * 100);
      const qFlash = Math.round(flash * 20);
      const renderKey = `${qDmg}:${qFlash}`;
      if (renderKey === lastRenderKey) return;
      lastRenderKey = renderKey;

      ctx.clearRect(0, 0, 256, 256);

      const effectiveDmg = Math.min(1.0, dmgPct + flash * 0.35);

      function drawFissure(x1, y1, x2, y2, width, mainColor, highlightColor) {
        const steps = Math.max(3, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 14));
        let cx = x1, cy = y1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const tx = x1 + (x2 - x1) * t + (i < steps ? (Math.sin(i * 9.2 + effectiveDmg * 15) * 5.2) : 0);
          const ty = y1 + (y2 - y1) * t + (i < steps ? (Math.cos(i * 7.4 + effectiveDmg * 12) * 5.2) : 0);
          ctx.lineTo(tx, ty);
          cx = tx; cy = ty;
        }
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();

        if (highlightColor) {
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = Math.max(0.9, width * 0.40);
          ctx.stroke();
        }
      }

      const darkColor = type === 'door' ? '#080101' : '#140602';
      const rimColor = type === 'door'
        ? (flash > 0.25 ? '#ffffff' : '#ef4444')
        : (flash > 0.25 ? '#ffffff' : '#f59e0b');

      // Stage 1: Fine Hairline Fractures (dmgPct > 0.08)
      if (effectiveDmg > 0.08) {
        drawFissure(128, 128, 62, 75, 1.8 + effectiveDmg * 2.2, darkColor, rimColor);
        drawFissure(128, 128, 195, 85, 1.8 + effectiveDmg * 2.0, darkColor, rimColor);
        drawFissure(128, 128, 120, 215, 2.0 + effectiveDmg * 2.4, darkColor, rimColor);
        drawFissure(128, 128, 210, 180, 1.6 + effectiveDmg * 1.8, darkColor, rimColor);
      }

      // Stage 2: Heavy Branching Fissures & Spiderweb Crossbars (dmgPct > 0.35)
      if (effectiveDmg > 0.35) {
        drawFissure(62, 75, 25, 30, 2.4 + effectiveDmg * 2.0, darkColor, rimColor);
        drawFissure(62, 75, 45, 140, 2.0 + effectiveDmg * 1.8, darkColor, rimColor);
        drawFissure(195, 85, 240, 45, 2.2 + effectiveDmg * 2.0, darkColor, rimColor);
        drawFissure(120, 215, 65, 245, 2.4 + effectiveDmg * 2.2, darkColor, rimColor);
        drawFissure(120, 215, 185, 240, 2.2 + effectiveDmg * 2.0, darkColor, rimColor);
        drawFissure(85, 185, 145, 195, 1.8 + effectiveDmg * 1.6, darkColor, rimColor);
      }

      // Stage 3: Severe Buckling, Shattered Core & Gaping Holes (dmgPct > 0.65)
      if (effectiveDmg > 0.65) {
        ctx.fillStyle = type === 'door' ? '#040101' : '#0a0301';
        ctx.beginPath();
        const pts = 8;
        for (let p = 0; p < pts; p++) {
          const a = (p / pts) * Math.PI * 2;
          const r = 18 + Math.sin(p * 3.7 + effectiveDmg * 8) * 8;
          const px = 128 + Math.cos(a) * r;
          const py = 128 + Math.sin(a) * r;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = type === 'door' ? '#dc2626' : '#d97706';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        drawFissure(128, 128, 15, 120, 3.6, '#040101', '#ef4444');
        drawFissure(128, 128, 245, 135, 3.6, '#040101', '#ef4444');
        drawFissure(128, 128, 135, 15, 3.2, '#040101', '#ef4444');
      }

      tex.needsUpdate = true;
    }

    render(0, 0);
    return { canvas: c, ctx, tex, render };
  }

  function createSchoolBannerTex() {
    return makePS1Texture(128, 144, (ctx, w, h) => {
      ctx.fillStyle = '#ece8d9';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      ctx.fillStyle = '#14532d';
      ctx.fillRect(10, 10, w - 20, 28);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('حکومت پاکستان', w / 2, 28);

      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(w / 2, 64, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ece8d9';
      ctx.beginPath();
      ctx.arc(w / 2 + 5, 62, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(w / 2 + 6, 60, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#064e3b';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText('علم بڑی دولت ہے', w / 2, 102);
      ctx.font = 'bold 8px "Courier New", monospace';
      ctx.fillStyle = '#4b5563';
      ctx.fillText('GOVT BOYS HIGH SCHOOL', w / 2, 118);
      ctx.fillText('NA-47 ISLAMABAD', w / 2, 130);
    }, 18);
  }

  const IQBAL_B64_COLOR = "data:image/png;base64,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";

  function createIqbalPortraitTex() {
    const w = 256;
    const h = 352;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    function drawBaseFrame() {
      // 1. Ornate dark rosewood / teak frame matching Quaid's frame
      ctx.fillStyle = '#26140b';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#542d17';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, w - 6, h - 6);

      ctx.strokeStyle = '#120a05';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, w - 20, h - 20);

      // 2. Gold / Brass inner bevel
      ctx.strokeStyle = '#b8860b';
      ctx.lineWidth = 4;
      ctx.strokeRect(14, 14, w - 28, h - 28);

      // 3. Matting / Passepartout (Archival Off-White / Ivory)
      ctx.fillStyle = '#ede5d4';
      ctx.fillRect(18, 18, w - 36, h - 36);

      // Thin inner gold fillet
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(26, 26, w - 52, h - 78);

      // Inner portrait background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(28, 28, w - 56, h - 82);

      // 4. Brass engraved nameplate at bottom
      const plateX = 32;
      const plateY = h - 44;
      const plateW = w - 64;
      const plateH = 22;

      ctx.fillStyle = '#c29339';
      ctx.fillRect(plateX, plateY, plateW, plateH);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(plateX + 1, plateY + 1, plateW - 2, plateH - 2);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(plateX + 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.arc(plateX + plateW - 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ALLAMA DR. MUHAMMAD IQBAL', w / 2, plateY + 12);
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('MUFAKKIR-E-PAKISTAN (1877-1938)', w / 2, plateY + 19);
    }

    function renderImageOntoCanvas(img) {
      drawBaseFrame();

      const targetX = 28;
      const targetY = 28;
      const targetW = w - 56;
      const targetH = h - 82;

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, targetX, targetY, targetW, targetH);

      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(27, 27, targetW + 2, targetH + 2);

      // Redraw nameplate over bottom edge for crisp visibility
      const plateX = 32;
      const plateY = h - 44;
      const plateW = w - 64;
      const plateH = 22;

      ctx.fillStyle = '#c29339';
      ctx.fillRect(plateX, plateY, plateW, plateH);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(plateX + 1, plateY + 1, plateW - 2, plateH - 2);

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(plateX + 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.arc(plateX + plateW - 5, plateY + plateH / 2, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 9.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ALLAMA DR. MUHAMMAD IQBAL', w / 2, plateY + 12);
      ctx.font = 'bold 7px sans-serif';
      ctx.fillText('MUFAKKIR-E-PAKISTAN (1877-1938)', w / 2, plateY + 19);
    }

    drawBaseFrame();

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    const img = new Image();
    img.onload = () => {
      renderImageOntoCanvas(img);
      tex.needsUpdate = true;
    };
    img.onerror = () => {
      // Try local assets path fallback
      const fb = new Image();
      fb.onload = () => {
        renderImageOntoCanvas(fb);
        tex.needsUpdate = true;
      };
      fb.src = 'assets/textures/iqbal_pixelated.png';
    };
    img.src = IQBAL_B64_COLOR;

    if (img.complete && img.naturalWidth > 0) {
      renderImageOntoCanvas(img);
      tex.needsUpdate = true;
    }

    return tex;
  }

  function createVintageClockTex() {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      ctx.fillStyle = '#261208';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#633118';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(w / 2, 54, 46, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f5eedb';
      ctx.beginPath();
      ctx.arc(w / 2, 54, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 9px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('XII', w / 2, 22);
      ctx.fillText('III', w / 2 + 32, 54);
      ctx.fillText('VI', w / 2, 86);
      ctx.fillText('IX', w / 2 - 32, 54);

      ctx.font = 'bold 6px sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.fillText('CITIZEN', w / 2, 44);
      ctx.fillText('PAKISTAN', w / 2, 65);

      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w / 2, 54);
      ctx.lineTo(w / 2 - 16, 38);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w / 2, 54);
      ctx.lineTo(w / 2, 25);
      ctx.stroke();
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(w / 2, 54, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#100a06';
      ctx.fillRect(w / 2 - 20, 102, 40, 20);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(w / 2 - 20, 102, 40, 20);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(w / 2, 112, 6, 0, Math.PI * 2);
      ctx.fill();
    }, 18);
  }

  function createHazardSignTex() {
    return makePS1Texture(128, 144, (ctx, w, h) => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, w, h);
      for (let x = -20; x < w + 20; x += 16) {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 8, 0); ctx.lineTo(x, 10); ctx.lineTo(x - 8, 10);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x, h - 10); ctx.lineTo(x + 8, h - 10); ctx.lineTo(x, h); ctx.lineTo(x - 8, h);
        ctx.fill();
      }
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(10, 12, w - 20, h - 24);
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 14, w - 24, h - 28);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(16, 18, w - 32, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('RESTRICTED', w / 2, 33);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 9.5px "Courier New", monospace';
      ctx.fillText('ECP RO RECOUNT VAULT', w / 2, 54);
      ctx.font = 'bold 8.5px "Courier New", monospace';
      ctx.fillStyle = '#b91c1c';
      ctx.fillText('AUTHORIZED ENTRY ONLY', w / 2, 68);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('HIGH VOLTAGE 440V', w / 2, 88);
      ctx.fillText('PORT OF KARACHI', w / 2, 100);
      ctx.fillText('SEC-3 · ECP SOUTH', w / 2, 112);
    }, 18);
  }

  function createHazardTapeTex() {
    return makePS1Texture(128, 32, (ctx, w, h) => {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, w, h);
      for (let x = -32; x < w + 32; x += 16) {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 10, 0); ctx.lineTo(x + 2, h); ctx.lineTo(x - 8, h);
        ctx.fill();
      }
    }, 12);
  }

  function createChalkboardTex(lvl = 1) {
    return makePS1Texture(256, 128, (ctx, w, h) => {
      if (lvl === 3) {
        ctx.fillStyle = '#0b131e';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w - 10, h - 10);
        for (let x = 6; x < w - 6; x += 18) {
          ctx.fillStyle = '#eab308';
          ctx.fillRect(x, 6, 9, 8);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x + 9, 6, 9, 8);
        }
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PORT OF KARACHI · RO WAREHOUSE (NA-241)', w / 2, 28);
        ctx.fillStyle = '#fb923c';
        ctx.font = 'bold 12.5px "Courier New", monospace';
        ctx.fillText('CENTRAL RECOUNT VAULT · TERMINAL 3', w / 2, 49);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(22, 56, 212, 40);
        ctx.fillStyle = '#86efac';
        ctx.fillText('AWAMI HOPE: 89,450 VOTES', w / 2, 73);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('THAPPA PARTY: 9,200 VOTES', w / 2, 90);
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px "Courier New", monospace';
        ctx.fillText('WHITENER TAMPERING RISK · VERIFY ECP SEAL (E)', w / 2, 114);
      } else if (lvl === 2) {
        ctx.fillStyle = '#0a1014';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#2d180d';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w - 10, h - 10);
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, w - 20, h - 20);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GOVT. DEGREE COLLEGE LAHORE (NA-128)', w / 2, 28);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 12.5px "Courier New", monospace';
        ctx.fillText('POLITICAL SCIENCE HALL · FORM-45 AUDIT', w / 2, 49);

        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(24, 56, 208, 40);
        ctx.fillStyle = '#86efac';
        ctx.fillText('AWAMI HOPE: 68,340 VOTES', w / 2, 73);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('THAPPA PARTY: 14,200 VOTES', w / 2, 90);
        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 11px "Courier New", monospace';
        ctx.fillText('WAPDA SABOTAGE ACTIVE · MAINTAIN 28 FORMS', w / 2, 114);
      } else {
        ctx.fillStyle = '#121f14';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#4a2e16';
        ctx.lineWidth = 10;
        ctx.strokeRect(5, 5, w - 10, h - 10);

        ctx.fillStyle = '#d6d3c4';
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GOVT. BOYS HIGH SCHOOL NA-47', w / 2, 28);
        ctx.fillStyle = '#eab308';
        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.fillText('FINAL COUNT (FORM-45 VERIFIED):', w / 2, 49);

        ctx.strokeStyle = 'rgba(214,211,196,0.35)';
        ctx.lineWidth = 2;
        ctx.strokeRect(26, 56, 204, 40);
        ctx.fillStyle = '#86efac';
        ctx.fillText('AWAMI HOPE: 54,210 VOTES', w / 2, 73);
        ctx.fillStyle = '#fca5a5';
        ctx.fillText('THAPPA PARTY: 8,100 VOTES', w / 2, 90);
        ctx.fillStyle = '#a8a29e';
        ctx.font = 'bold 11px "Courier New", monospace';
        ctx.fillText('GUARD FORM-45 UNTIL 6:00 AM FAJR', w / 2, 114);
      }
    }, 14);
  }


  function createBallotBoxTex(lvl = 1) {
    return makePS1Texture(128, 128, (ctx, w, h) => {
      if (lvl === 3) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, w - 6, h - 6);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(8, 8, w - 16, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ ECP SECURE SEAL ★', 64, 17);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(16, 28, 96, 74);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillText('ECP PAKISTAN', 64, 52);
        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.fillStyle = '#b91c1c';
        ctx.fillText('HALQA NA-241', 64, 72);
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.fillStyle = '#475569';
        ctx.fillText('KARACHI SOUTH', 64, 90);
      } else if (lvl === 2) {
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#022c22';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, w - 6, h - 6);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, w - 16, h - 16);

        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(18, 28, 92, 72);
        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ECP PAKISTAN', 64, 54);
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillStyle = '#b45309';
        ctx.fillText('HALQA NA-128', 64, 74);
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.fillStyle = '#047857';
        ctx.fillText('LAHORE CENTRAL', 64, 90);
      } else {
        ctx.fillStyle = '#14532d';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#052e16';
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, w - 6, h - 6);
        ctx.fillStyle = '#e7e5e4';
        ctx.fillRect(18, 28, 92, 72);
        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 17px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ECP PAKISTAN', 64, 56);
        ctx.font = 'bold 15px "Courier New", monospace';
        ctx.fillText('HALQA NA-47', 64, 76);
      }
    }, 16);
  }

  function drawScreenWarningSign(ctx, cx, cy, size) {
    ctx.save();
    const h = size * 0.866;
    const topY = cy - h * 0.55;
    const botY = cy + h * 0.45;
    const leftX = cx - size * 0.5;
    const rightX = cx + size * 0.5;

    // 1. Red Outer Hazard Triangle
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(rightX, botY);
    ctx.lineTo(leftX, botY);
    ctx.closePath();
    ctx.fill();

    // 2. White Inner Triangle Fill
    const pad = size * 0.16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx, topY + pad * 1.35);
    ctx.lineTo(rightX - pad * 1.15, botY - pad * 0.65);
    ctx.lineTo(leftX + pad * 1.15, botY - pad * 0.65);
    ctx.closePath();
    ctx.fill();

    // 3. Bold Black Exclamation Point
    ctx.fillStyle = '#000000';
    const stemW = Math.max(2.5, size * 0.13);
    const stemTop = topY + pad * 2.0;
    const stemH = h * 0.36;
    ctx.beginPath();
    ctx.moveTo(cx - stemW * 0.7, stemTop);
    ctx.lineTo(cx + stemW * 0.7, stemTop);
    ctx.lineTo(cx + stemW * 0.45, stemTop + stemH);
    ctx.lineTo(cx - stemW * 0.45, stemTop + stemH);
    ctx.closePath();
    ctx.fill();

    const dotR = Math.max(2.0, stemW * 0.65);
    const dotY = botY - pad * 1.35;
    ctx.beginPath();
    ctx.arc(cx, dotY, dotR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function createDynamicLaptopScreen() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 192;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    let lastStateKey = '';

    function update(uploadedCount, scannedCount, currentFormPct, vpnDown, now) {
      const pulse = (Math.floor(now / 220) % 2 === 0);
      const queue = Math.max(0, scannedCount - uploadedCount);
      const fillW = queue > 0 ? Math.max(4, Math.round((currentFormPct / 100) * 192)) : 0;
      const stateKey = vpnDown ? `vpn:${pulse}` : `ok:${uploadedCount}:${queue}:${fillW}`;

      if (stateKey === lastStateKey) return;
      lastStateKey = stateKey;

      if (vpnDown) {
        ctx.fillStyle = pulse ? '#7f1d1d' : '#3b0707';
        ctx.fillRect(0, 0, 256, 192);

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 4;
        ctx.strokeRect(6, 6, 244, 180);

        // Warning Hazard Sign (Red Triangle with Exclamation Mark)
        drawScreenWarningSign(ctx, 128, 48, 50);

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('! VPN OFFLINE !', 128, 96);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('SHARK BIT FIBER CABLE', 128, 120);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('GO TO CAM 10 [LIBRARY]', 128, 150);

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('DETACH SHARKS TO RESTORE', 128, 172);
      } else {
        ctx.fillStyle = '#052e16';
        ctx.fillRect(0, 0, 256, 192);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.strokeRect(6, 6, 244, 180);

        ctx.fillStyle = '#86efac';
        ctx.font = 'bold 15px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PORTAL', 128, 36);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px monospace';
        const maxTotal = 30;
        ctx.fillText(`${uploadedCount} / ${maxTotal}`, 128, 82);

        ctx.fillStyle = queue > 0 ? '#fde047' : '#94a3b8';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(queue > 0 ? `${queue} READY` : 'IDLE', 128, 116);

        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 2;
        ctx.strokeRect(28, 136, 200, 24);
        ctx.fillStyle = queue > 0 ? '#22c55e' : '#14532d';
        ctx.fillRect(32, 140, fillW, 16);
      }
      tex.needsUpdate = true;
    }

    update(0, 0, 0, false, 0);
    return { tex, update };
  }

  function createDynamicScannerScreen() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    let lastStateKey = '';

    function update(vpnDown, isScanning, scanProgress, now, isSealMissing = false) {
      const pulseVpn = (Math.floor(now / 220) % 2 === 0);
      const pulseSeal = (Math.floor(now / 200) % 2 === 0);
      const scanPct = Math.round(scanProgress * 100);
      const scanBarW = Math.round(Math.max(4, scanProgress * 184));

      let stateKey = '';
      if (vpnDown) {
        stateKey = `vpn:${pulseVpn}`;
      } else if (isSealMissing) {
        stateKey = `seal:${pulseSeal}`;
      } else if (isScanning) {
        stateKey = `scan:${scanPct}:${scanBarW}`;
      } else {
        stateKey = 'idle';
      }

      if (stateKey === lastStateKey) return;
      lastStateKey = stateKey;

      if (vpnDown) {
        // Red Alert Screen during PTA Shark Attack
        const pulse = pulseVpn;
        ctx.fillStyle = pulse ? '#7f1d1d' : '#450a0a';
        ctx.fillRect(0, 0, 256, 384);

        // Glowing red hazard border
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5;
        ctx.strokeRect(8, 8, 240, 368);

        // Corner hazard brackets
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.strokeRect(14, 14, 228, 356);

        // Prominent Warning Hazard Sign (Red Triangle with Exclamation Mark)
        drawScreenWarningSign(ctx, 128, 110, 78);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 18px monospace';
        ctx.fillText('! SCANNER OFFLINE !', 128, 195);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('ECP CLOUD UNREACHABLE', 128, 225);

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('● PTA SHARK ATTACK DETECTED', 128, 255);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('FIBER SEVERED IN CAM 10', 128, 280);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('CLEAR ROUTER IN CAM 10', 128, 320);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('[ SURVEILLANCE -> CAM 10 ]', 128, 345);
      } else if (isSealMissing) {
        // High-Contrast Red & Amber Missing ECP Seal Warning Screen
        const pulse = pulseSeal;
        ctx.fillStyle = pulse ? '#450a0a' : '#1c1917';
        ctx.fillRect(0, 0, 256, 384);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.strokeRect(8, 8, 240, 368);

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.strokeRect(14, 14, 228, 356);

        drawScreenWarningSign(ctx, 128, 95, 68);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f87171';
        ctx.font = '900 16px monospace';
        ctx.fillText('! ECP SEAL MISSING !', 128, 175);

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('FORM-45 UNVERIFIED', 128, 205);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('AFFIX RO BRASS STAMP', 128, 240);

        ctx.fillStyle = '#c084fc';
        ctx.font = '900 13px monospace';
        ctx.fillText('PRESS [E] AT DESK', 128, 270);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('[ REJECTED BY ECP PROTOCOL ]', 128, 335);
      } else {
        // Normal Emerald / Teal Glass Scanner Platen
        ctx.fillStyle = '#022c22';
        ctx.fillRect(0, 0, 256, 384);

        // Subtle glass measurement grid lines
        ctx.strokeStyle = '#044333';
        ctx.lineWidth = 1;
        for (let gx = 24; gx < 256; gx += 24) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 384); ctx.stroke();
        }
        for (let gy = 24; gy < 384; gy += 24) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(256, gy); ctx.stroke();
        }

        // Outer glass bevel
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 3;
        ctx.strokeRect(4, 4, 248, 376);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('SCANNER', 128, 48);

        if (isScanning) {
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 15px monospace';
          ctx.fillText(`SCANNING... ${scanPct}%`, 128, 180);

          ctx.strokeStyle = '#4ade80';
          ctx.lineWidth = 3;
          ctx.strokeRect(32, 210, 192, 28);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(36, 214, scanBarW, 20);
        } else {
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 14px monospace';
          ctx.fillText('READY', 128, 175);

          ctx.fillStyle = '#a7f3d0';
          ctx.font = 'bold 12px monospace';
          ctx.fillText('HOLD TO SCAN', 128, 205);

          ctx.fillStyle = '#059669';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('CLOUD LINK: 1000 Mbps NOMINAL', 128, 235);
        }
      }
      tex.needsUpdate = true;
    }

    update(false, false, 0, 0);
    return { tex, update };
  }

  function createDynamicCrtScreen() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    let lastStateKey = '';

    function update(chaiPct, gulluNear, whitenerNear, now) {
      const near = Boolean(gulluNear || whitenerNear);
      const pulse = near ? (Math.floor(now / 220) % 2 === 0) : false;
      const chai = Math.ceil(chaiPct);
      const stateKey = `${chai}:${near}:${pulse}`;

      if (stateKey === lastStateKey) return;
      lastStateKey = stateKey;

      ctx.fillStyle = '#041a0c';
      ctx.fillRect(0, 0, 128, 96);
      ctx.strokeStyle = 'rgba(56, 255, 98, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(8, 8, 112, 80);

      ctx.fillStyle = '#38ff62';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CCTV [SPACE]', 64, 24);

      ctx.fillStyle = chaiPct < 30 ? '#ef4444' : '#fde047';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`CHAI: ${chai}%`, 64, 46);

      if (near && pulse) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('! SOMEONE AT DOOR !', 64, 70);
      } else {
        ctx.fillStyle = '#86efac';
        ctx.fillText('CLICK TO VIEW', 64, 70);
      }
      tex.needsUpdate = true;
    }

    update(100, false, false, 0);
    return { tex, update };
  }

  function createLowPolyVigo() {
    const vigo = new THREE.Group();
    const blackMat = new THREE.MeshLambertMaterial({ color: 0x0b0f16 });
    const trimMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x050b14 });
    const chromeMat = new THREE.MeshLambertMaterial({ color: 0xcbd5e1 });
    const darkSteelMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const tireMat = new THREE.MeshLambertMaterial({ color: 0x090a0c });
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const amberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const plateMat = new THREE.MeshBasicMaterial({ color: 0x16a34a });
    const redStrobe = new THREE.MeshBasicMaterial({ color: 0xff1111 });
    const blueStrobe = new THREE.MeshBasicMaterial({ color: 0x2563eb });

    // Main pickup body & hood
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.54, 0.96, 5.0), blackMat);
    chassis.position.y = 0.88;
    // Classic Vigo Intercooler Hood Scoop
    const hoodScoop = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.14, 0.95), trimMat);
    hoodScoop.position.set(0, 1.40, 1.55);
    // Wheel arch flares
    const flareGeo = new THREE.BoxGeometry(2.68, 0.32, 1.05);
    const flareF = new THREE.Mesh(flareGeo, trimMat);
    flareF.position.set(0, 0.72, 1.62);
    const flareR = new THREE.Mesh(flareGeo, trimMat);
    flareR.position.set(0, 0.72, -1.55);

    // Cabin & tinted windows
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.30, 0.88, 2.45), blackMat);
    cabin.position.set(0, 1.75, -0.15);
    const windows = new THREE.Mesh(new THREE.BoxGeometry(2.34, 0.68, 2.32), glassMat);
    windows.position.set(0, 1.75, -0.15);
    // Front windshield frame & visor
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.66, 0.08), glassMat);
    windshield.position.set(0, 1.75, 1.08);
    // Side mirrors
    const mirrorL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.14), trimMat);
    mirrorL.position.set(-1.28, 1.58, 0.88);
    const mirrorR = mirrorL.clone();
    mirrorR.position.x = 1.28;

    // Front radiator grille & chrome slats
    const grilleBase = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.44, 0.08), tireMat);
    grilleBase.position.set(0, 1.04, 2.50);
    for (let gy = 0.90; gy <= 1.18; gy += 0.13) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.04, 0.10), chromeMat);
      slat.position.set(0, gy, 2.51);
      vigo.add(slat);
    }

    // Heavy front bumper & steel bullbar (ram guard)
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.58, 0.36, 0.24), trimMat);
    bumper.position.set(0, 0.56, 2.52);
    const bullbarBottom = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.14, 0.18), darkSteelMat);
    bullbarBottom.position.set(0, 0.72, 2.64);
    const bullbarTop = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.10, 0.16), chromeMat);
    bullbarTop.position.set(0, 1.22, 2.64);
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.68, 0.18), chromeMat);
    pillarL.position.set(-0.56, 0.96, 2.65);
    const pillarR = pillarL.clone();
    pillarR.position.x = 0.56;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.16, 0.06), plateMat);
    plate.position.set(0, 0.56, 2.65);

    // High-beam headlights & amber turn signals
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.10), hlMat);
    hlL.position.set(-0.88, 1.06, 2.51);
    const hlR = hlL.clone();
    hlR.position.x = 0.88;
    const turnL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.24, 0.10), amberMat);
    turnL.position.set(-1.16, 1.06, 2.50);
    const turnR = turnL.clone();
    turnR.position.x = 1.16;

    // 4 Rugged Off-Road Tires + Alloy Rims
    const wheelGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.36, 14);
    wheelGeo.rotateZ(Math.PI / 2);
    const rimGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.38, 10);
    rimGeo.rotateZ(Math.PI / 2);
    const wheelCoords = [
      [-1.18, 0.46, 1.62],
      [1.18, 0.46, 1.62],
      [-1.18, 0.46, -1.55],
      [1.18, 0.46, -1.55]
 ];
    wheelCoords.forEach(([wx, wy, wz]) => {
      const wMesh = new THREE.Mesh(wheelGeo, tireMat);
      wMesh.position.set(wx, wy, wz);
      const rMesh = new THREE.Mesh(rimGeo, chromeMat);
      rMesh.position.set(wx, wy, wz);
      vigo.add(wMesh, rMesh);
    });

    const coneGeo = new THREE.ConeGeometry(1.2, 4.5, 8, 1, true);
    coneGeo.rotateX(-Math.PI / 2);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beamL = new THREE.Mesh(coneGeo, coneMat);
    beamL.position.set(-0.88, 0.95, 4.7);
    const beamR = beamL.clone();
    beamR.position.x = 0.88;

    // Roof police strobe lightbar
    const barMount = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.08, 0.28), darkSteelMat);
    barMount.position.set(0, 2.20, 0.20);
    const stL = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.24), redStrobe);
    stL.position.set(-0.36, 2.28, 0.20);
    const stR = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.18, 0.24), blueStrobe);
    stR.position.set(0.36, 2.28, 0.20);

    vigo.add(
      chassis, hoodScoop, flareF, flareR,
      cabin, windows, windshield, mirrorL, mirrorR,
      grilleBase, bumper, bullbarBottom, bullbarTop, pillarL, pillarR, plate,
      hlL, hlR, turnL, turnR, beamL, beamR,
      barMount, stL, stR
    );
    vigo.userData = { redStrobe, blueStrobe, hlMat };
    return vigo;
  }

  // --- BUILD POLLING STATION SCENE ---
  function buildPollingStation(scene, camera) {
    const wallTex = createSchoolWallTex();
    const floorTex = createFloorTex();
    const woodTex = createWoodTex('#4a2e16');
    const lightWoodTex = createWoodTex('#633e1e');

    const collegeWallTex = createCollegeWallTex();
    const warehouseWallTex = createWarehouseWallTex();
    const collegeFloorTex = createCollegeFloorTex();
    const warehouseFloorTex = createWarehouseFloorTex();

    const schoolWallMat = new THREE.MeshLambertMaterial({ map: wallTex });
    const collegeWallMat = new THREE.MeshLambertMaterial({ map: collegeWallTex });
    const warehouseWallMat = new THREE.MeshLambertMaterial({ map: warehouseWallTex });
    const wallMat = schoolWallMat;

    const schoolFloorMat = new THREE.MeshLambertMaterial({ map: floorTex });
    const collegeFloorMat = new THREE.MeshLambertMaterial({ map: collegeFloorTex });
    const warehouseFloorMat = new THREE.MeshLambertMaterial({ map: warehouseFloorTex });
    const floorMat = schoolFloorMat;

    const boardMatLvl1 = new THREE.MeshLambertMaterial({ map: createChalkboardTex(1) });
    const boardMatLvl2 = new THREE.MeshLambertMaterial({ map: createChalkboardTex(2) });
    const boardMatLvl3 = new THREE.MeshLambertMaterial({ map: createChalkboardTex(3) });

    const bBoxMatLvl1 = new THREE.MeshLambertMaterial({ map: createBallotBoxTex(1) });
    const bBoxMatLvl2 = new THREE.MeshLambertMaterial({ map: createBallotBoxTex(2) });
    const bBoxMatLvl3 = new THREE.MeshLambertMaterial({ map: createBallotBoxTex(3) });
    const woodMat = new THREE.MeshLambertMaterial({ map: woodTex });
    const benchMat = new THREE.MeshLambertMaterial({ map: lightWoodTex });
    const lightWoodMat = benchMat;
    const darkMetalMat = new THREE.MeshLambertMaterial({ color: 0x22201e });
    const brassMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
    const ceilingMat = new THREE.MeshLambertMaterial({ color: 0x1c1914 });

    // Official ECP Sarkari Stamp Materials (Shared across first-person handStamp & desk/table stamp)
    const stampHandleMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.35,
      metalness: 0.15
    });
    const stampBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.88,
      roughness: 0.22,
      emissive: 0x92400e,
      emissiveIntensity: 0.2
    });
    const stampDieMat = new THREE.MeshLambertMaterial({
      color: 0x4338ca,
      emissive: 0x312e81,
      emissiveIntensity: 0.4
    });

    const asphaltRoadTex = createAsphaltRoadTex();
    const curbHazardTex = createCurbHazardTex();
    const schoolSignTex = createSchoolSignTex();
    const collegeSignTex = createCollegeSignTex();
    const canalMilestoneTex = createCanalMilestoneTex();
    const persianRugTex = createPersianRugTex();
    const lectureChalkboardTex = createLectureChalkboardTex();
    const collegeNoticeTex = createCollegeNoticeTex();
    const gatePillarTex = createGatePillarTex();
    const charpaiTex = createCharpaiTex();
    const boundaryWallOutdoorTex = createBoundaryWallOutdoorTex();
    const brickHerringboneTex = createBrickHerringboneTex();
    const pakistaniFlagTex = createPakistaniFlagTex();
    const noticeBoardTex = createNoticeBoardTex();
    const waterCoolerTex = createWaterCoolerTex();
    const almirahTex = createAlmirahTex();
    const quaidPortraitColorTex = createQuaidPortraitTex('color');
    const quaidPortraitBWTex = createQuaidPortraitTex('bw');
    const quaidPortraitTex = quaidPortraitColorTex;

    // Level 3 (NA-241 Karachi Port / RO Central Warehouse) Specific Textures
    const khiPortSignTex = createKhiPortSignTex();
    // Muted, grimy, desaturated cold iron & oxidized burnt rust (atmospheric survival horror palette)
    const containerBlueTex = createShippingContainerTex('#1e2832', '#151d25', 'KHI-241-BLU');
    const containerRustTex = createShippingContainerTex('#2f1b13', '#21120c', 'KHI-241-RST');
    const customsRosterTex = createCustomsRosterTex();
    const keElectricSignTex = createKeElectricSignTex();
    const roBannerTex = createRoBannerTex();
    const vaultDoorTex = createVaultDoorTex();

    // Form-45 official document texture (with dynamic serial numbering)
    const formCanvas = document.createElement('canvas');
    formCanvas.width = 512;
    formCanvas.height = 692;
    const formCtx = formCanvas.getContext('2d');
    const formTexture = new THREE.CanvasTexture(formCanvas);
        formTexture.minFilter = THREE.LinearFilter;
    formTexture.magFilter = THREE.LinearFilter;

    let lastRenderedForm = { num: -1, total: -1, isStamped: null };
    let baseCanvasUnstamped = null;
    let baseCanvasStamped = null;

    function renderStaticBaseForm(targetCanvas, isStamped) {
      const ctx = targetCanvas.getContext('2d');
      const w = targetCanvas.width;
      const h = targetCanvas.height;

      // 1. Aged Ivory Paper Background
      ctx.fillStyle = '#fcf9ed';
      ctx.fillRect(0, 0, w, h);

      // Subtle paper grain / faint ruled lines
      ctx.fillStyle = 'rgba(215, 205, 185, 0.25)';
      for (let y = 14; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }

      // Outer & Inner Government Document Borders
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(18, 18, w - 36, h - 36);
      ctx.lineWidth = 1;
      ctx.strokeRect(23, 23, w - 46, h - 46);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';

      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillText('ELECTION COMMISSION OF PAKISTAN', w / 2, 46);

      ctx.font = 'bold 10.5px "Courier New", monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText('GENERAL ELECTIONS 2024 · CONSTITUENCY NA-47', w / 2, 64);

      // PROMINENT "FORM 45" TITLE
      ctx.fillStyle = '#000000';
      ctx.font = '900 44px "Courier New", monospace, sans-serif';
      ctx.fillText('FORM 45', w / 2, 102);

      ctx.font = 'bold 13px "Courier New", monospace';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('[ RESULT OF THE COUNT ]', w / 2, 124);

      // Double line separator
      ctx.beginPath();
      ctx.moveTo(28, 134); ctx.lineTo(w - 28, 134);
      ctx.moveTo(28, 138); ctx.lineTo(w - 28, 138);
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // SERIAL NUMBER BOX FRAME
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(35, 146, w - 70, 44);
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(35, 146, w - 70, 44);

      // Polling Booth Sub-details
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('POLLING STATION : #47-B (GOVT BOYS SECONDARY)', 36, 210);
      ctx.fillText('CONSTITUENCY    : NA-47 (ISLAMABAD-II)', 36, 226);

      // Official Table Header
      const tableTop = 240;
      const rowHeight = 24;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(32, tableTop, w - 64, 22);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText('NO', 38, tableTop + 15);
      ctx.fillText('CANDIDATE', 75, tableTop + 15);
      ctx.fillText('SYMBOL', 285, tableTop + 15);
      ctx.textAlign = 'right';
      ctx.fillText('VOTES', w - 42, tableTop + 15);

      // Candidates list (Generic anonymized candidates and symbols)
      const candidates = [
        { no: '01', name: 'CANDIDATE - 01', sym: 'SYMBOL - A', votes: '4,821' },
        { no: '02', name: 'CANDIDATE - 02', sym: 'SYMBOL - B', votes: '9,340' },
        { no: '03', name: 'CANDIDATE - 03', sym: 'SYMBOL - C', votes: '842' },
        { no: '04', name: 'CANDIDATE - 04', sym: 'SYMBOL - D', votes: '1,120' },
        { no: '05', name: 'CANDIDATE - 05', sym: 'SYMBOL - E', votes: '315' },
        { no: '06', name: 'CANDIDATE - 06', sym: 'SYMBOL - F', votes: '540' },
        { no: '07', name: 'OTHER INDEPENDENTS', sym: 'VARIOUS', votes: '218' }
      ];

      ctx.textAlign = 'left';
      candidates.forEach((cand, idx) => {
        const y = tableTop + 24 + idx * rowHeight;
        ctx.fillStyle = (idx % 2 === 0) ? 'rgba(241, 245, 249, 0.7)' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(32, y, w - 64, rowHeight);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.strokeRect(32, y, w - 64, rowHeight);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.fillText(cand.no, 38, y + 16);

        // Vertical dividers
        ctx.beginPath();
        ctx.moveTo(60, y); ctx.lineTo(60, y + rowHeight);
        ctx.moveTo(275, y); ctx.lineTo(275, y + rowHeight);
        ctx.moveTo(385, y); ctx.lineTo(385, y + rowHeight);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.fillText(cand.votes, w - 42, y + 16);
        ctx.textAlign = 'left';
      });

      // Procedural mosaic redaction over candidate names and symbols across all 7 rows
      function drawMosaicRedaction(c, x, y, bw, bh, bSize = 4) {
        const shades = ['#1e293b', '#334155', '#475569', '#64748b', '#0f172a', '#1e293b'];
        for (let py = 0; py < bh; py += bSize) {
          const hBlock = Math.min(bSize, bh - py);
          for (let px = 0; px < bw; px += bSize) {
            const wBlock = Math.min(bSize, bw - px);
            const hash = Math.abs(((px * 37 + py * 19) ^ 0x5a)) % shades.length;
            c.fillStyle = shades[hash];
            c.fillRect(x + px, y + py, wBlock, hBlock);
          }
        }
      }

      for (let i = 0; i < candidates.length; i++) {
        const rowY = tableTop + 24 + i * rowHeight;
        drawMosaicRedaction(ctx, 72, rowY + 3, 205, rowHeight - 6, 4);
        drawMosaicRedaction(ctx, 282, rowY + 3, 90, rowHeight - 6, 4);
      }

      // Vote Totals Box
      const totY = tableTop + 24 + candidates.length * rowHeight + 10;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, totY, w - 64, 58);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText('TOTAL VALID BALLOTS COUNTED :', 40, totY + 20);
      ctx.textAlign = 'right';
      ctx.fillText('17,196', w - 42, totY + 20);

      ctx.textAlign = 'left';
      ctx.font = '11px "Courier New", monospace';
      ctx.fillText('CHALLENGED / TENDERED VOTES  :', 40, totY + 36);
      ctx.textAlign = 'right';
      ctx.fillText('142', w - 42, totY + 36);

      ctx.textAlign = 'left';
      ctx.fillText('REJECTED BALLOT PAPERS       :', 40, totY + 50);
      ctx.textAlign = 'right';
      ctx.fillText('84', w - 42, totY + 50);

      if (!isStamped) {
        // Unverified Stamp Area with Red Warning Frame
        ctx.save();
        ctx.translate(130, totY + 115);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 4]);
        ctx.strokeRect(-50, -42, 100, 84);
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        ctx.fillRect(-50, -42, 100, 84);
        ctx.fillStyle = '#b91c1c';
        ctx.textAlign = 'center';
        ctx.font = '900 9.5px "Courier New", monospace';
        ctx.fillText('[ AFFIX ECP SEAL ]', 0, -20);
        ctx.font = 'bold 8.5px "Courier New", monospace';
        ctx.fillText('OFFICIAL STAMP', 0, -5);
        ctx.fillText('REQUIRED BEFORE', 0, 10);
        ctx.font = '900 8.5px "Courier New", monospace';
        ctx.fillText('SCAN & UPLOAD', 0, 25);
        ctx.restore();

        // Diagonal watermark across the sheet
        ctx.save();
        ctx.translate(w / 2, h / 2 + 10);
        ctx.rotate(-0.35);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.16)';
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.32)';
        ctx.lineWidth = 3;
        ctx.font = '900 32px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.strokeText('*** UNVERIFIED ***', 0, 0);
        ctx.fillText('*** UNVERIFIED ***', 0, 0);
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillText('OFFICIAL ECP SEAL MANDATORY', 0, 24);
        ctx.restore();
      } else {
        // Official Verified Stamp in Violet/Blue Ink
        ctx.save();
        ctx.translate(130, totY + 115);
        ctx.rotate(-0.08);
        ctx.strokeStyle = '#4338ca'; // Violet ink
        ctx.lineWidth = 2.8;
        ctx.beginPath();
        ctx.arc(0, 0, 44, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = '#4338ca';
        ctx.textAlign = 'center';
        ctx.font = '900 8.5px "Courier New", monospace';
        ctx.fillText('* ELECTION COMMISSION *', 0, -24);
        ctx.font = '900 11px "Courier New", monospace';
        ctx.fillText('PRESIDING', 0, -7);
        ctx.fillText('OFFICER', 0, 7);
        ctx.font = '900 7.5px "Courier New", monospace';
        ctx.fillText('OFFICIAL VERIFIED SEAL', 0, 20);
        ctx.font = '900 8px "Courier New", monospace';
        ctx.fillText('NA-241 / NA-47', 0, 31);

        // Faint authentic ink bleed speckles
        ctx.fillStyle = 'rgba(67, 56, 202, 0.35)';
        for (let i = 0; i < 12; i++) {
          const sa = (i / 12) * Math.PI * 2;
          const sr = 46 + Math.sin(i * 3) * 2;
          ctx.beginPath();
          ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Signature area on bottom right
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px "Courier New", monospace';
      ctx.fillText('Presiding Officer Signature:', 240, totY + 95);

      // Scribbled blue pen signature
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(244, totY + 120);
      ctx.bezierCurveTo(270, totY + 102, 290, totY + 130, 320, totY + 110);
      ctx.bezierCurveTo(340, totY + 98, 360, totY + 125, 395, totY + 114);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "Courier New", monospace';
      ctx.fillText('DATE: 08-FEB-2024 · TIME: 23:55 PKT', 240, totY + 140);
    }

    function initForm45Caches() {
      if (!baseCanvasUnstamped) {
        baseCanvasUnstamped = document.createElement('canvas');
        baseCanvasUnstamped.width = formCanvas.width;
        baseCanvasUnstamped.height = formCanvas.height;
        renderStaticBaseForm(baseCanvasUnstamped, false);
      }
      if (!baseCanvasStamped) {
        baseCanvasStamped = document.createElement('canvas');
        baseCanvasStamped.width = formCanvas.width;
        baseCanvasStamped.height = formCanvas.height;
        renderStaticBaseForm(baseCanvasStamped, true);
      }
    }

    function renderForm45(currentNum, totalNum, isStamped = true) {
      const num = currentNum || 1;
      const total = totalNum || 25;

      // Instant return if form state has not changed (prevents lag and redundant renders)
      if (lastRenderedForm.num === num && lastRenderedForm.total === total && lastRenderedForm.isStamped === isStamped) {
        return;
      }
      lastRenderedForm.num = num;
      lastRenderedForm.total = total;
      lastRenderedForm.isStamped = isStamped;

      initForm45Caches();

      const w = formCanvas.width;
      const h = formCanvas.height;
      const base = isStamped ? baseCanvasStamped : baseCanvasUnstamped;
      formCtx.drawImage(base, 0, 0);

      // Blit dynamic serial number in microseconds (zero GC, zero lag)
      formCtx.fillStyle = '#ffffff';
      formCtx.fillRect(36, 147, w - 72, 42);
      formCtx.strokeStyle = '#b91c1c';
      formCtx.lineWidth = 2.5;
      formCtx.strokeRect(35, 146, w - 70, 44);

      formCtx.fillStyle = '#b91c1c';
      formCtx.font = '900 23px "Courier New", monospace';
      formCtx.textAlign = 'center';
      const serialStr = `FORM 45 · SERIAL: ${String(num).padStart(2, '0')} / ${total}`;
      formCtx.fillText(serialStr, w / 2, 175);

      formTexture.needsUpdate = true;
    }

    renderForm45(1, 25);
    window.__updateForm45Texture = renderForm45;


    const asphaltMat = new THREE.MeshLambertMaterial({ map: asphaltRoadTex });
    const curbMat = new THREE.MeshLambertMaterial({ map: curbHazardTex });
    const schoolSignMat = new THREE.MeshBasicMaterial({ map: schoolSignTex });
    const schoolGatePillarTex = gatePillarTex;
    const lahoreGatePillarTex = createLahoreRedBrickPillarTex();
    const karachiGatePillarTex = createKarachiMetallicPillarTex();
    const schoolGatePillarMat = new THREE.MeshLambertMaterial({ map: schoolGatePillarTex });
    const lahoreGatePillarMat = new THREE.MeshLambertMaterial({ map: lahoreGatePillarTex });
    const karachiGatePillarMat = new THREE.MeshLambertMaterial({ map: karachiGatePillarTex });
    const gatePillarMat = schoolGatePillarMat;

    const charpaiMat = new THREE.MeshLambertMaterial({ map: charpaiTex });
    const schoolBoundaryWallTex = boundaryWallOutdoorTex;
    const lahoreBoundaryWallTex = createLahoreRedBrickOutdoorWallTex();
    const karachiBoundaryWallTex = createKarachiMetallicOutdoorWallTex();
    const schoolBoundaryWallMat = new THREE.MeshLambertMaterial({ map: schoolBoundaryWallTex });
    const lahoreBoundaryWallMat = new THREE.MeshLambertMaterial({ map: lahoreBoundaryWallTex });
    const karachiBoundaryWallMat = new THREE.MeshLambertMaterial({ map: karachiBoundaryWallTex });
    const boundaryWallOutdoorMat = schoolBoundaryWallMat;
    const brickHerringboneMat = new THREE.MeshLambertMaterial({ map: brickHerringboneTex });
    const pakistaniFlagMat = new THREE.MeshLambertMaterial({ map: pakistaniFlagTex, side: THREE.DoubleSide });
    const noticeBoardMat = new THREE.MeshLambertMaterial({ map: noticeBoardTex });
    const waterCoolerMat = new THREE.MeshLambertMaterial({ map: waterCoolerTex });
    const almirahMat = new THREE.MeshLambertMaterial({ map: almirahTex });
    const quaidPortraitColorMat = new THREE.MeshLambertMaterial({ map: quaidPortraitColorTex });
    const quaidPortraitBWMat = new THREE.MeshLambertMaterial({ map: quaidPortraitBWTex });
    const quaidPortraitMat = quaidPortraitColorMat;
    const whitePlasterMat = new THREE.MeshLambertMaterial({ color: 0xb5b0a3 });
    const darkSarkariGreenMat = new THREE.MeshLambertMaterial({ color: 0x133e21 });

    // Level 2 (NA-128 Old Degree College, Lahore) Specific Materials
    const collegeSignMat = new THREE.MeshBasicMaterial({ map: collegeSignTex });
    const canalMilestoneMat = new THREE.MeshLambertMaterial({ map: canalMilestoneTex });
    const lectureChalkboardMat = new THREE.MeshLambertMaterial({ map: lectureChalkboardTex });
    const collegeNoticeMat = new THREE.MeshLambertMaterial({ map: collegeNoticeTex });
    const fountainStoneMat = new THREE.MeshLambertMaterial({ color: 0x484239 });
    const fountainWaterMat = new THREE.MeshBasicMaterial({ color: 0x092626, transparent: true, opacity: 0.88 });
    const lawnGrassMat = new THREE.MeshLambertMaterial({ color: 0x1a3318 });
    const crimsonVelvetMat = new THREE.MeshLambertMaterial({ color: 0x4c0519 });
    const richMahoganyMat = new THREE.MeshLambertMaterial({ color: 0x2b150c });
    const persianRugMat = new THREE.MeshLambertMaterial({ map: persianRugTex });
    const chesterfieldLeatherMat = new THREE.MeshLambertMaterial({ color: 0x3d0c14 });
    const steelWireMeshMat = new THREE.MeshBasicMaterial({ color: 0x475569, wireframe: true });
    const transformerGreyMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const ceramicInsulatorMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const copperBusbarMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });

    // Level 3 (NA-241 Karachi Port / RO Central Warehouse) Specific Materials
    const khiPortSignMat = new THREE.MeshBasicMaterial({ map: khiPortSignTex });
    const containerBlueMat = new THREE.MeshLambertMaterial({ map: containerBlueTex });
    const containerRustMat = new THREE.MeshLambertMaterial({ map: containerRustTex });
    const customsRosterMat = new THREE.MeshLambertMaterial({ map: customsRosterTex });
    const keElectricSignMat = new THREE.MeshBasicMaterial({ map: keElectricSignTex });
    const roBannerMat = new THREE.MeshLambertMaterial({ map: roBannerTex });
    const vaultDoorMat = new THREE.MeshLambertMaterial({ map: vaultDoorTex });
    const industrialGensetGreenMat = new THREE.MeshLambertMaterial({ color: 0x14532d });
    const steelSafetyOrangeMat = new THREE.MeshLambertMaterial({ color: 0xea580c });
    const palletWoodMat = new THREE.MeshLambertMaterial({ color: 0x785331 });
    const fuelDrumRedMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c });
    const industrialScaleMat = new THREE.MeshLambertMaterial({ color: 0x475569 });

    const clickableMeshes = [];
    let cam09BreakerBox = null;
    let cam09Outline = null;
    let cam09NeonMat = null;
    let cam09GlowGroup = null;
    const cam09Clickables = [];
    let cam10RouterBox = null;
    let cam10RouterOutline = null;
    let cam10RouterNeonMat = null;
    let cam10RouterGlowGroup = null;
    let cam10RouterLosLed = null;
    const cam10Clickables = [];

    const office = new THREE.Group();
    scene.add(office);

    // Fully extended floor & ceiling spanning into the rear of the classroom so no cuts on extreme left/right!
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 14), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 1.4);
    floor.receiveShadow = true;
    office.add(floor);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(10.5, 14),
      ceilingMat
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.3, 1.4);
    office.add(ceiling);

    for (let z of [-2.0, 0.5, 2.8, 5.0]) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.24, 0.32), darkMetalMat);
      beam.position.set(0, 4.18, z);
      office.add(beam);
    }

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 4.3, 0.4), wallMat);
    frontWall.position.set(0, 2.15, -3.6);
    frontWall.receiveShadow = true;
    office.add(frontWall);

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 1.76, 0.08),
      boardMatLvl1
    );
    board.position.set(0, 2.08, -3.36);
    office.add(board);

    // Helper: Framed Quaid-e-Azam Portrait (Scaled down per user request)
    function createFramedQuaid(x, y, z, pW = 0.56, pH = 0.76) {
      const g = new THREE.Group();
      const pic = new THREE.Mesh(new THREE.BoxGeometry(pW, pH, 0.08), quaidPortraitColorMat);
      pic.position.set(x, y, z);
      const fW = pW + 0.06;
      const fH = pH + 0.06;
      const gold = new THREE.Mesh(new THREE.BoxGeometry(fW, fH, 0.04), brassMat);
      gold.position.set(x, y, z - 0.02);

      const lampY = y + pH / 2 + 0.06;
      const barLen = pW * 0.75;
      const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, barLen, 8), brassMat);
      lampBar.rotation.z = Math.PI / 2;
      lampBar.position.set(x, lampY, z + 0.14);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.14), brassMat);
      armL.position.set(x - barLen * 0.38, lampY, z + 0.07);
      const armR = armL.clone();
      armR.position.x = x + barLen * 0.38;

      const spot = new THREE.SpotLight(0xfff3d6, 1.3, 5.0, Math.PI / 3.8, 0.35, 0.8);
      spot.position.set(x, lampY + 0.02, z + 0.18);
      spot.target = pic;

      g.add(pic, gold, lampBar, armL, armR, spot);
      return g;
    }

    // Helper: Framed Allama Iqbal Portrait (Scaled down per user request)
    function createFramedIqbal(x, y, z, pW = 0.56, pH = 0.76) {
      const g = new THREE.Group();
      const iqbalMat = new THREE.MeshLambertMaterial({ map: createIqbalPortraitTex() });
      const pic = new THREE.Mesh(new THREE.BoxGeometry(pW, pH, 0.08), iqbalMat);
      pic.position.set(x, y, z);
      const fW = pW + 0.06;
      const fH = pH + 0.06;
      const gold = new THREE.Mesh(new THREE.BoxGeometry(fW, fH, 0.04), brassMat);
      gold.position.set(x, y, z - 0.02);

      const lampY = y + pH / 2 + 0.06;
      const barLen = pW * 0.75;
      const lampBar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, barLen, 8), brassMat);
      lampBar.rotation.z = Math.PI / 2;
      lampBar.position.set(x, lampY, z + 0.14);

      const armL = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.018, 0.14), brassMat);
      armL.position.set(x - barLen * 0.38, lampY, z + 0.07);
      const armR = armL.clone();
      armR.position.x = x + barLen * 0.38;

      const spot = new THREE.SpotLight(0xfef08a, 1.2, 5.0, Math.PI / 3.8, 0.35, 0.8);
      spot.position.set(x, lampY + 0.02, z + 0.18);
      spot.target = pic;

      g.add(pic, gold, lampBar, armL, armR, spot);
      return g;
    }

    // ========================================================
    // LEVEL 1 (NA-47 ISLAMABAD) OFFICE PROPS
    // ========================================================
    const lvl1OfficeProps = new THREE.Group();
    lvl1OfficeProps.userData.lvl1Only = true;

    // 1. Quaid-e-Azam Portrait (Center, smaller size)
    const quaidLvl1 = createFramedQuaid(0, 3.58, -3.36, 0.56, 0.76);
    lvl1OfficeProps.add(quaidLvl1);

    // 2. Pakistani School Primer / Election Education Banner (Front Wall, right of Quaid, smaller)
    const schoolBannerMat = new THREE.MeshLambertMaterial({ map: createSchoolBannerTex() });
    const schoolBanner = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.70, 0.04), schoolBannerMat);
    schoolBanner.position.set(1.22, 3.55, -3.36);
    schoolBanner.castShadow = true;
    lvl1OfficeProps.add(schoolBanner);

    // 3. School Electric Bell / Brass Gong (Left Wall Pillar near door)
    const schoolGongGroup = new THREE.Group();
    schoolGongGroup.position.set(-4.12, 3.1, -1.1);
    const gongBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.16), darkMetalMat);
    const gongDish = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 12), brassMat);
    gongDish.rotation.z = Math.PI / 2;
    gongDish.position.x = 0.06;
    schoolGongGroup.add(gongBox, gongDish);
    lvl1OfficeProps.add(schoolGongGroup);

    // 4. Chalk & Felt Duster Box on Desk
    const chalkBoxGroup = new THREE.Group();
    chalkBoxGroup.position.set(-0.65, 1.12, -0.22);
    const chalkTray = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.16), lightWoodMat);
    const chalk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    chalk1.rotation.x = Math.PI / 2; chalk1.position.set(-0.04, 0.025, 0);
    const chalk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    chalk2.rotation.x = Math.PI / 2; chalk2.position.set(-0.01, 0.025, 0);
    const dusterWood = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.025, 0.12), woodMat);
    dusterWood.position.set(0.06, 0.03, 0);
    const dusterFelt = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.12), new THREE.MeshLambertMaterial({ color: 0x292524 }));
    dusterFelt.position.set(0.06, 0.015, 0);
    chalkBoxGroup.add(chalkTray, chalk1, chalk2, dusterWood, dusterFelt);
    lvl1OfficeProps.add(chalkBoxGroup);

    // 5. Teacher's Wooden Pen Cup with Election Pens on Desk
    const penCupGroup = new THREE.Group();
    penCupGroup.position.set(0.52, 1.13, -0.2);
    const penCup = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.14, 8), woodMat);
    penCup.position.y = 0.07;
    const penRed = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 5), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    penRed.rotation.z = 0.15; penRed.position.set(0.02, 0.14, 0);
    const penBlue = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 5), new THREE.MeshBasicMaterial({ color: 0x3b82f6 }));
    penBlue.rotation.z = -0.18; penBlue.position.set(-0.02, 0.14, 0.01);
    penCupGroup.add(penCup, penRed, penBlue);
    lvl1OfficeProps.add(penCupGroup);

    office.add(lvl1OfficeProps);

    // ========================================================
    // LEVEL 2 (NA-128 LAHORE) OFFICE PROPS
    // Layout: Clock in Center, Quaid on Left, Iqbal on Right (all smaller)
    // ========================================================
    const lvl2OfficeProps = new THREE.Group();
    lvl2OfficeProps.userData.lvl2Only = true;

    // 1. Vintage Octagonal Heritage Wall Clock placed in CENTER
    const clockMat = new THREE.MeshLambertMaterial({ map: createVintageClockTex() });
    const wallClock = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.72, 0.06), clockMat);
    wallClock.position.set(0, 3.58, -3.36);
    lvl2OfficeProps.add(wallClock);

    // 2. Framed Quaid-e-Azam Portrait on LEFT SIDE (smaller)
    const quaidLvl2 = createFramedQuaid(-1.18, 3.58, -3.36, 0.56, 0.76);
    lvl2OfficeProps.add(quaidLvl2);

    // 3. Framed Allama Iqbal Portrait on RIGHT SIDE (smaller)
    const iqbalLvl2 = createFramedIqbal(1.18, 3.58, -3.36, 0.56, 0.76);
    lvl2OfficeProps.add(iqbalLvl2);

    // 4. Official Punjab Government Law Books & Election Registers on Desk
    const registerGroup = new THREE.Group();
    registerGroup.position.set(1.42, 1.13, 0.12);
    const regMatRed = new THREE.MeshLambertMaterial({ color: 0x7f1d1d });
    const regMatGreen = new THREE.MeshLambertMaterial({ color: 0x14532d });
    const reg1 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.045, 0.44), regMatRed);
    reg1.position.y = 0.022;
    const reg2 = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.045, 0.42), regMatGreen);
    reg2.position.set(0.01, 0.067, 0.01);
    reg2.rotation.y = 0.08;
    const reg3 = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.045, 0.40), regMatRed);
    reg3.position.set(-0.01, 0.112, -0.01);
    reg3.rotation.y = -0.05;
    const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.14, 0.45), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
    ribbon.position.set(0, 0.07, 0);
    registerGroup.add(reg1, reg2, reg3, ribbon);
    lvl2OfficeProps.add(registerGroup);

    // 5. Collegiate Polished Brass Call Bell on Desk
    const bellGroup = new THREE.Group();
    bellGroup.position.set(0.52, 1.13, -0.18);
    const bellBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.025, 12), darkMetalMat);
    bellBase.position.y = 0.012;
    const bellDome = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), brassMat);
    bellDome.position.y = 0.025;
    const bellPlunger = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.04, 6), brassMat);
    bellPlunger.position.y = 0.09;
    bellGroup.add(bellBase, bellDome, bellPlunger);
    lvl2OfficeProps.add(bellGroup);

    // 6. Heavy WAPDA Conduit running down lower left wall
    const wapdaConduit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.8, 6), darkMetalMat);
    wapdaConduit.position.set(-4.14, 1.4, -2.4);
    const wapdaBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.22), new THREE.MeshLambertMaterial({ color: 0x78350f }));
    wapdaBox.position.set(-4.14, 0.55, -2.4);
    const wapdaLed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0x4ade80 }));
    wapdaLed.position.set(-4.07, 0.62, -2.4);
    lvl2OfficeProps.add(wapdaConduit, wapdaBox, wapdaLed);

    office.add(lvl2OfficeProps);

    // ========================================================
    // LEVEL 3 (NA-241 KARACHI) OFFICE PROPS
    // ========================================================
    const lvl3OfficeProps = new THREE.Group();
    lvl3OfficeProps.userData.lvl3Only = true;

    // 1. Quaid-e-Azam Portrait (Center, smaller size per user request)
    const quaidLvl3 = createFramedQuaid(0, 3.58, -3.36, 0.56, 0.76);
    lvl3OfficeProps.add(quaidLvl3);

    // 2. Industrial Red Emergency Klaxon / Warning Beacon (Ceiling beam above Quaid)
    const klaxonGroup = new THREE.Group();
    klaxonGroup.position.set(0, 4.18, -3.22);
    const klaxonBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.08, 10), darkMetalMat);
    const klaxonDome = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.18, 10), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    klaxonDome.position.y = 0.12;
    const klaxonCage = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.20, 8, 1, true), darkMetalMat);
    klaxonCage.position.y = 0.12;
    const klaxonLight = new THREE.PointLight(0xef4444, 0.65, 4.5);
    klaxonLight.position.set(0, 0.12, 0.1);
    klaxonGroup.add(klaxonBase, klaxonDome, klaxonCage, klaxonLight);
    lvl3OfficeProps.add(klaxonGroup);

    // 3. Heavy Metal Hazard Safety Sign (Front Wall, right of Quaid, smaller)
    const hazardSignMat = new THREE.MeshLambertMaterial({ map: createHazardSignTex() });
    const hazardSign = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.70, 0.04), hazardSignMat);
    hazardSign.position.set(1.22, 3.55, -3.36);
    hazardSign.castShadow = true;
    lvl3OfficeProps.add(hazardSign);

    // 3. Industrial Steel Cargo Filing Cabinet in rear left corner
    const filingCabGroup = new THREE.Group();
    filingCabGroup.position.set(-2.85, 1.45, -3.15);
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.45, 0.65), new THREE.MeshLambertMaterial({ color: 0x334155 }));
    cabBody.castShadow = true;
    filingCabGroup.add(cabBody);
    for (let i = 0; i < 4; i++) {
      const drawerY = -0.52 + i * 0.35;
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.03), brassMat);
      handle.position.set(0, drawerY, 0.34);
      const labelCard = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.01), new THREE.MeshBasicMaterial({ color: 0xe2e8f0 }));
      labelCard.position.set(0, drawerY + 0.08, 0.33);
      filingCabGroup.add(handle, labelCard);
    }
    lvl3OfficeProps.add(filingCabGroup);

    // 4. Customs Manifest Clipboard & Blue ECP Stamp Ink Pad on Desk
    const customsClipGroup = new THREE.Group();
    customsClipGroup.position.set(-0.65, 1.12, -0.22);
    const clipBoard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.36), darkMetalMat);
    const clipPaper = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.32), new THREE.MeshLambertMaterial({ color: 0xf1f5f9 }));
    clipPaper.position.y = 0.015;
    const clipClip = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.03, 0.04), brassMat);
    clipClip.position.set(0, 0.025, -0.15);
    const inkPadBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.12), darkMetalMat);
    inkPadBody.position.set(0.24, 0.012, 0);
    const inkPadFelt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.01, 0.10), new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }));
    inkPadFelt.position.set(0.24, 0.026, 0);
    customsClipGroup.add(clipBoard, clipPaper, clipClip, inkPadBody, inkPadFelt);
    lvl3OfficeProps.add(customsClipGroup);

    // 5. Yellow / Black Hazard Caution Striping along Main Desk Front Edge
    const hazardTapeMat = new THREE.MeshBasicMaterial({ map: createHazardTapeTex() });
    const deskHazardStrip = new THREE.Mesh(new THREE.BoxGeometry(3.62, 0.04, 0.02), hazardTapeMat);
    deskHazardStrip.position.set(0, 1.05, -0.05);
    lvl3OfficeProps.add(deskHazardStrip);

    office.add(lvl3OfficeProps);


    for (let side of [-1, 1]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.72, 0.85), benchMat);
      bench.position.set(side * 2.75, 0.36, -1.9);
      bench.rotation.y = side * -0.15;
      bench.castShadow = true;
      bench.receiveShadow = true;
      office.add(bench);
    }

    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, 3.72, -0.5);
    const fanRod = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 6), darkMetalMat);
    fanRod.position.y = 0.32;
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 8), darkMetalMat);
    fanGroup.add(fanRod, fanHub);
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.24), darkMetalMat);
      blade.rotation.y = (i * Math.PI * 2) / 3;
      blade.translateX(0.8);
      blade.castShadow = true;
      fanGroup.add(blade);
    }
    office.add(fanGroup);

    // --- DESK & INTERACTIVE PROPS ---
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0, -0.78);
    office.add(deskGroup);

    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.14, 1.45), woodMat);
    deskTop.position.y = 1.05;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    const deskFront = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.98, 0.1), benchMat);
    deskFront.position.set(0, 0.5, -0.62);
    const legGeo = new THREE.BoxGeometry(0.14, 1.0, 1.3);
    const dLegL = new THREE.Mesh(legGeo, woodMat);
    dLegL.position.set(-1.65, 0.5, 0);
    const dLegR = dLegL.clone();
    dLegR.position.x = 1.65;
    deskGroup.add(deskTop, deskFront, dLegL, dLegR);

    const bBoxMat = bBoxMatLvl1;
    const ballotBox = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.82, 0.66), bBoxMat);
    ballotBox.position.set(-1.12, 1.52, 0.02);
    ballotBox.castShadow = true;
    ballotBox.userData.action = 'grab_form';
    clickableMeshes.push(ballotBox);
    const bBoxLid = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.08, 0.7),
      new THREE.MeshLambertMaterial({ color: 0xe7e5e4 })
    );
    bBoxLid.position.y = 0.44;
    bBoxLid.userData.action = 'grab_form';
    clickableMeshes.push(bBoxLid);
    ballotBox.add(bBoxLid);
    deskGroup.add(ballotBox);

    const form45Mat = [
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ map: formTexture }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 })
 ];
    const form45 = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.03, 0.48),
      form45Mat
    );
    form45.position.set(-0.52, 1.13, 0.25);
    form45.rotation.y = 0.22;
    form45.userData.action = 'grab_form';
    clickableMeshes.push(form45);
    deskGroup.add(form45);

    // ECP Official Seal Stamp forward declaration & shared materials (used by handStamp and kettle table stamp)
    let stampDeskGroup = null;
    let stampBodyGroup = null;

    // (stampHandleMat already initialized above)

    // (stampBrassMat already initialized above)

    // (stampDieMat already initialized above)

    const crtScreenHelper = createDynamicCrtScreen();
    const crtMonitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.72, 0.68),
      new THREE.MeshLambertMaterial({ color: 0x8c8273 })
    );
    crtMonitor.position.set(0.0, 1.48, -0.06);
    crtMonitor.castShadow = true;
    crtMonitor.userData.action = 'toggle_cctv';
    clickableMeshes.push(crtMonitor);

    const crtScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.52),
      new THREE.MeshBasicMaterial({ map: crtScreenHelper.tex })
    );
    crtScreen.position.set(0, 1.5, 0.29);
    crtScreen.userData.action = 'toggle_cctv';
    clickableMeshes.push(crtScreen);
    deskGroup.add(crtMonitor, crtScreen);

    const laptopScreenHelper = createDynamicLaptopScreen();
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.06, 0.48), darkMetalMat);
    laptopBase.position.set(0.92, 1.15, 0.08);
    laptopBase.rotation.y = -0.22;
    laptopBase.userData.action = 'reconnect_vpn';
    clickableMeshes.push(laptopBase);

    const laptopLid = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.46, 0.05), darkMetalMat);
    laptopLid.position.set(0, 0.24, -0.22);
    laptopLid.rotation.x = 0.18;
    const laptopDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.38),
      new THREE.MeshBasicMaterial({ map: laptopScreenHelper.tex })
    );
    laptopDisplay.position.set(0, 0, 0.03);
    laptopDisplay.userData.action = 'reconnect_vpn';
    clickableMeshes.push(laptopDisplay);
    laptopLid.add(laptopDisplay);
    laptopBase.add(laptopLid);
    deskGroup.add(laptopBase);

    const deskFan = new THREE.Group();
    deskFan.position.set(1.52, 1.12, -0.18);
    deskFan.rotation.y = -0.45;
    const dfBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.35, 8), darkMetalMat);
    dfBase.position.y = 0.17;
    const dfBlades = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.04), brassMat);
    dfBlades.position.set(0, 0.38, 0.12);
    deskFan.add(dfBase, dfBlades);
    deskGroup.add(deskFan);

    const chaiCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.08, 0.22, 8),
      new THREE.MeshLambertMaterial({ color: 0xfde047 })
    );
    chaiCup.position.set(-0.5, 1.23, -0.18);
    chaiCup.userData.action = 'drink_chai';
    clickableMeshes.push(chaiCup);
    deskGroup.add(chaiCup);

    // --- LEFT WALL WITH SMALL PEEKING WINDOW (ROSHYDAN), HINGED SARKARI IRON DOOR & KUNDI BOLT ---
    // Seamless Left Wall: from z = -3.8 (overlapping front wall) to z = -0.85 (doorway header)
    // Precision enlarged window opening from z = -3.05 to -1.45 (1.60m wide), y = 1.15 to 2.65 (1.50m tall)
    const leftWallFarBack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 0.75), wallMat);
    leftWallFarBack.position.set(-4.3, 2.15, -3.425);
    const leftWallMidPillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 0.60), wallMat);
    leftWallMidPillar.position.set(-4.3, 2.15, -1.15);
    const leftPeekWallBottom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.15, 1.60), wallMat);
    leftPeekWallBottom.position.set(-4.3, 0.575, -2.25);
    const leftPeekWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.65, 1.60), wallMat);
    leftPeekWallTop.position.set(-4.3, 3.475, -2.25);

    // --- AUTHENTIC PAKISTANI SARKARI EXTERIOR WINDOW SECURITY GRILL ---
    // Mounted strictly on the exterior face of the building wall outside the room (x = +/-4.49m)
    // Only visible when the window is illuminated (Q / E beam active)!
    function createExteriorWindowGrill(isRight) {
      const grillGroup = new THREE.Group();
      const posX = isRight ? 4.49 : -4.49;
      grillGroup.position.set(posX, 1.90, -2.25);
      grillGroup.name = isRight ? 'rightExteriorGrill' : 'leftExteriorGrill';

      const ironGrillMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1c,
        roughness: 0.84,
        metalness: 0.72,
        side: THREE.DoubleSide
      });

      // Outer perimeter mounting frame (square iron tube)
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.032, 1.64), ironGrillMat);
      topRail.position.set(0, 0.74, 0);
      const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.032, 1.64), ironGrillMat);
      bottomRail.position.set(0, -0.74, 0);
      const jambBack = new THREE.Mesh(new THREE.BoxGeometry(0.032, 1.48, 0.032), ironGrillMat);
      jambBack.position.set(0, 0, -0.80);
      const jambFront = new THREE.Mesh(new THREE.BoxGeometry(0.032, 1.48, 0.032), ironGrillMat);
      jambFront.position.set(0, 0, 0.80);
      grillGroup.add(topRail, bottomRail, jambBack, jambFront);

      // Wall mounting lugs / anchor bolts pinning into masonry
      for (const bz of [-0.82, 0.82]) {
        for (const by of [-0.45, 0.45]) {
          const lug = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.024, 0.04), ironGrillMat);
          lug.position.set(isRight ? -0.015 : 0.015, by, bz);
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.04, 6), ironGrillMat);
          bolt.rotation.z = Math.PI / 2;
          bolt.position.set(isRight ? -0.025 : 0.025, by, bz);
          grillGroup.add(lug, bolt);
        }
      }

      // Vertical solid iron security bars
      const barSpacing = [-0.60, -0.40, -0.20, 0.00, 0.20, 0.40, 0.60];
      barSpacing.forEach(pz => {
        const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 1.46, 8), ironGrillMat);
        vBar.position.set(0, 0, pz);
        grillGroup.add(vBar);
      });

      // Horizontal reinforcement cross-bars (salakh tie braces)
      for (const cy of [-0.32, 0.32]) {
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.018, 1.60), ironGrillMat);
        hBar.position.set(0, cy, 0);
        grillGroup.add(hBar);

        // Welded intersection collars / iron rings at cross-joints
        barSpacing.forEach(pz => {
          const collar = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.028, 0.032), ironGrillMat);
          collar.position.set(0, cy, pz);
          grillGroup.add(collar);
        });
      }

      // Enable on layers so camera and exterior lights interact correctly
      grillGroup.traverse(child => {
        if (child.isMesh) {
          child.layers.enable(0);
          child.layers.enable(1);
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });

      grillGroup.visible = false;
      return grillGroup;
    }

    // Enlarged Left Peeking Window Frame & Security Bars (z = -2.25, y = 1.90)
    const leftPeekFrame = new THREE.Group();
    leftPeekFrame.position.set(-4.28, 1.90, -2.25);
    const lpSill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 1.66), darkMetalMat);
    lpSill.position.set(0, -0.75, 0);
    const lpHeader = lpSill.clone();
    lpHeader.position.set(0, 0.75, 0);
    const lpJambB = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.50, 0.08), darkMetalMat);
    lpJambB.position.set(0, 0, -0.80);
    const lpJambF = lpJambB.clone();
    lpJambF.position.set(0, 0, 0.80);
    leftPeekFrame.add(lpSill, lpHeader, lpJambB, lpJambF);
    const leftPeekGrill = createExteriorWindowGrill(false);
    office.add(leftPeekGrill);

    // PITCH BLACK APERTURE VOID MESH & BACKDROP (100% Light-Proof & Fog-Proof, FrontSide only so invisible from outside)
    const peekVoidMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.FrontSide, fog: false });
    const leftPeekVoidMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 1.52), peekVoidMat);
    leftPeekVoidMesh.rotation.y = Math.PI / 2;
    leftPeekVoidMesh.position.set(-0.14, 0, 0); // Safely back at exterior boundary
    leftPeekFrame.add(leftPeekVoidMesh);

    const leftPeekBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), peekVoidMat);
    leftPeekBackdrop.rotation.y = Math.PI / 2;
    leftPeekBackdrop.position.set(-5.15, 1.90, -2.25); // Behind Khaki head
    office.add(leftPeekBackdrop);

    // Eerie cold moonlight accent above left peek window (illuminates Khaki under pale moonlight)
    const leftPeekMoonlight = new THREE.PointLight(0x94c4e8, 0, 5.5, 0.4);
    leftPeekMoonlight.position.set(-4.65, 2.35, -2.55);
    leftPeekMoonlight.layers.enable(0);
    leftPeekMoonlight.layers.enable(1);
    office.add(leftPeekMoonlight);

    // Precision Door Jamb Alignment: Starts at doorFrameFront (z = 1.04) to avoid doorway clipping!
    const leftWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 2.4), wallMat);
    leftWallFront.position.set(-4.3, 2.15, 2.24);
    const leftWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 3.6), wallMat);
    leftWallRear.position.set(-4.3, 2.15, 5.1);
    const leftWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.15, 2.05), wallMat);
    leftWallTop.position.set(-4.3, 3.72, 0.175);
    office.add(
      leftWallFarBack,
      leftWallMidPillar,
      leftPeekWallBottom,
      leftPeekWallTop,
      leftPeekFrame,
      leftWallFront,
      leftWallRear,
      leftWallTop
    );

    // Heavy Door Frame (Chaukhat) + 3 Iron Hinge Barrels (Qabzay)
    const doorFrameBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.25, 0.14), darkMetalMat);
    doorFrameBack.position.set(-4.28, 1.62, -0.92);
    const doorFrameFront = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.25, 0.14), darkMetalMat);
    doorFrameFront.position.set(-4.28, 1.62, 1.02);
    const doorFrameHeader = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 2.08), darkMetalMat);
    doorFrameHeader.position.set(-4.28, 3.20, 0.05);
    // Wall Kundi Catch Bracket on back jamb (Mirrored)
    const kundiWallCatch = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.14), brassMat);
    kundiWallCatch.position.set(-4.10, 1.48, -0.91);
    office.add(doorFrameBack, doorFrameFront, doorFrameHeader, kundiWallCatch);

    for (const hy of [0.55, 1.60, 2.65]) {
      const hingeBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 7), brassMat);
      hingeBarrel.position.set(-4.16, hy, 0.96);
      office.add(hingeBarrel);
    }

    // Wall Sconce right beside Left Doorway (Matches Reference Image 1!)
    const leftSconce = createWallSconce();
    leftSconce.position.set(-4.1, 2.35, -1.12);
    office.add(leftSconce);

    // Hinged Left Iron Door Pivot Group (Mirrored: Pivots around front hinge at x = -4.16, z = 0.96)
    const leftDoorMesh = new THREE.Group();
    leftDoorMesh.position.set(-4.16, 0, 0.96);
    leftDoorMesh.rotation.y = -1.32; // Swung open on the left side so the small window at z = -2.28 is 100% visible!
    office.add(leftDoorMesh);

    const sarkariDoorMat = new THREE.MeshLambertMaterial({ map: createSarkariDoorTex() });
    // Lower Solid Iron Door Panel (y = 0.02..2.02, z = 0..-1.84)
    const doorLowerPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.0, 1.84), sarkariDoorMat);
    doorLowerPanel.position.set(0, 1.02, -0.92);
    doorLowerPanel.castShadow = true;
    doorLowerPanel.userData.action = 'left_door';
    clickableMeshes.push(doorLowerPanel);

    // Upper Solid Header Panel (y = 2.54..3.14)
    const doorUpperPanel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.60, 1.84), sarkariDoorMat);
    doorUpperPanel.position.set(0, 2.84, -0.92);
    doorUpperPanel.castShadow = true;
    doorUpperPanel.userData.action = 'left_door';
    clickableMeshes.push(doorUpperPanel);

    // Left & Right Vertical Stiles around the Upper Barred Peep-Window (y = 2.02..2.54)
    const doorStileBack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.54, 0.32), sarkariDoorMat);
    doorStileBack.position.set(0, 2.28, -1.68);
    const doorStileFront = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.54, 0.32), sarkariDoorMat);
    doorStileFront.position.set(0, 2.28, -0.16);
    leftDoorMesh.add(doorLowerPanel, doorUpperPanel, doorStileBack, doorStileFront);

    // 5 Vertical Iron Bars in the Door's Upper Peep Grille (So you can see Khaki's eyes when locked!)
    for (let bz = -1.42; bz <= -0.44; bz += 0.24) {
      const peepBar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.54, 6), darkMetalMat);
      peepBar.position.set(0, 2.28, bz);
      leftDoorMesh.add(peepBar);
    }

    // Animated 3D Sliding Iron Kundi (Bolt + Drop Handle) on Inside of Door
    const kundiHousing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.42), darkMetalMat);
    kundiHousing.position.set(0.08, 1.48, -1.56);
    const kundiBolt = new THREE.Group();
    kundiBolt.position.set(0.10, 1.48, -1.48); // Slides in -Z to -1.78 when locked!
    const kundiRod = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.52, 7), brassMat);
    kundiRod.rotation.x = Math.PI / 2;
    const kundiHandle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.05), brassMat);
    kundiHandle.position.set(0.03, -0.09, 0.14);
    kundiHandle.userData.action = 'left_door';
    clickableMeshes.push(kundiHandle);
    kundiBolt.add(kundiRod, kundiHandle);
    leftDoorMesh.add(kundiHousing, kundiBolt);
    leftDoorMesh.userData = { kundiBolt, kundiHandle };

    // 3D Visual Cracking Damage Decal Plane on Door Panel
    const doorCrackObj = createCrackDecalCanvas('door');
    const doorCrackMat = new THREE.MeshBasicMaterial({
      map: doorCrackObj.tex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const doorCrackDecal = new THREE.Mesh(new THREE.PlaneGeometry(1.68, 1.88), doorCrackMat);
    doorCrackDecal.position.set(0.065, 1.02, -0.92);
    doorCrackDecal.rotation.y = Math.PI / 2;
    doorCrackDecal.userData = { crackObj: doorCrackObj, lastDmgTier: -1 };
    leftDoorMesh.add(doorCrackDecal);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.68, 0.38), darkMetalMat);
    leftPanel.position.set(-4.08, 1.55, -1.42);
    const leftBtnDoor3D = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.22, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    leftBtnDoor3D.position.set(0.06, 0.14, 0);
    leftBtnDoor3D.userData.action = 'left_door';
    clickableMeshes.push(leftBtnDoor3D);

    const leftBtnLight3D = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.22, 0.24),
      new THREE.MeshBasicMaterial({ color: 0x713f12 })
    );
    leftBtnLight3D.position.set(0.06, -0.14, 0);
    leftBtnLight3D.userData.action = 'left_light';
    clickableMeshes.push(leftBtnLight3D);
    leftPanel.add(leftBtnDoor3D, leftBtnLight3D);
    office.add(leftPanel);

    // --- 3D WAPDA MAIN JUNCTION / WIRE BOX (Wall at x = -4.22, y = 1.62, z = -1.25) ---
    const wireBoxGroup = new THREE.Group();
    wireBoxGroup.position.set(-4.22, 1.62, -1.25);
    office.add(wireBoxGroup);

    // Dark industrial metal cabinet
    const wireBoxHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.68, 0.48),
      new THREE.MeshLambertMaterial({ color: 0x22262a })
    );

    // Hazard yellow/black stripe texture for circuit warning plate
    const hazardCanvas = document.createElement('canvas');
    hazardCanvas.width = 128; hazardCanvas.height = 32;
    const hctx = hazardCanvas.getContext('2d');
    hctx.fillStyle = '#facc15'; hctx.fillRect(0, 0, 128, 32);
    hctx.fillStyle = '#000000';
    for (let hx = -32; hx < 160; hx += 16) {
      hctx.beginPath();
      hctx.moveTo(hx, 0); hctx.lineTo(hx + 12, 0);
      hctx.lineTo(hx - 4, 32); hctx.lineTo(hx - 16, 32);
      hctx.fill();
    }
    hctx.fillStyle = '#facc15'; hctx.fillRect(20, 6, 88, 20);
    hctx.fillStyle = '#000000'; hctx.font = 'bold 11px monospace'; hctx.textAlign = 'center';
    hctx.fillText(' 440V WIREBOX', 64, 20);
    const hazardPlate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.10),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(hazardCanvas) })
    );
    hazardPlate.rotation.y = Math.PI / 2;
    hazardPlate.position.set(0.075, 0.28, 0);

    // Open steel hinged door
    const wireBoxDoor = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.64, 0.44),
      new THREE.MeshLambertMaterial({ color: 0x33383e })
    );
    wireBoxDoor.position.set(0.12, 0, 0.22);
    wireBoxDoor.rotation.y = 0.55;

    // Exposed terminal block & cut wires inside
    const wireBusbar = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.48, 0.36),
      new THREE.MeshLambertMaterial({ color: 0x111315 })
    );
    wireBusbar.position.set(0.02, 0, 0);

    // 4 Cut Terminal Wires inside (Yellow, Blue, Red, Magenta)
    const wireColors = [0xfacc15, 0x3b82f6, 0xef4444, 0xd946ef];
    wireColors.forEach((wc, widx) => {
      const wireCurve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.18, 5),
        new THREE.MeshLambertMaterial({ color: wc })
      );
      wireCurve.position.set(0.05, 0.16 - widx * 0.10, -0.06 + (widx % 2) * 0.12);
      wireCurve.rotation.z = 0.35 * (widx % 2 === 0 ? 1 : -1);
      wireBoxGroup.add(wireCurve);
    });

    // Red emergency spinning alarm beacon on top of wire box
    const beaconBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.05, 8), darkMetalMat);
    beaconBase.position.set(0, 0.36, 0);
    const beaconDome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.10, 8),
      new THREE.MeshLambertMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.6 })
    );
    beaconDome.position.set(0, 0.43, 0);
    const wireBoxAlarmLight = new THREE.PointLight(0xff1111, 0, 6.0, 0.4);
    wireBoxAlarmLight.position.set(0.15, 0.45, 0);
    wireBoxAlarmLight.layers.enable(0);
    wireBoxGroup.add(wireBoxHousing, hazardPlate, wireBoxDoor, wireBusbar, beaconBase, beaconDome, wireBoxAlarmLight);

    // --- 3D FORM-45 SCANNING STATION (Behind Left Door on Wall at z = 1.75, x = -3.85) ---
    const scanStationGroup = new THREE.Group();
    scanStationGroup.position.set(-3.85, 0, 1.75);
    office.add(scanStationGroup);

    // Sturdy wooden side-table stand
    const scanTableTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.08, 0.88), woodMat);
    scanTableTop.position.y = 0.86;
    scanTableTop.userData.action = 'scan_station';
    clickableMeshes.push(scanTableTop);
    scanStationGroup.add(scanTableTop);
    for (const tx of [-0.28, 0.28]) {
      for (const tz of [-0.36, 0.36]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.86, 0.08), woodMat);
        leg.position.set(tx, 0.43, tz);
        scanStationGroup.add(leg);
      }
    }

    // Retro flatbed scanner unit
    const scannerMat = new THREE.MeshLambertMaterial({ color: 0x8c887b });
    const scannerBody = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.12, 0.76), scannerMat);
    scannerBody.position.y = 0.96;
    scannerBody.userData.action = 'scan_station';
    clickableMeshes.push(scannerBody);

    // Glass Platen with Dynamic Screen Texture
    const scannerScreenHelper = createDynamicScannerScreen();
    const scanGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.60),
      new THREE.MeshBasicMaterial({ map: scannerScreenHelper.tex })
    );
    scanGlass.rotation.x = -Math.PI / 2;
    scanGlass.position.set(0, 1.025, 0);
    scanGlass.userData.action = 'scan_station';
    clickableMeshes.push(scanGlass);

    // Form-45 paper on the glass (visible when holding/scanning)
    const scanPaper = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.52),
      new THREE.MeshBasicMaterial({ map: formTexture, side: THREE.DoubleSide })
    );
    scanPaper.rotation.x = -Math.PI / 2;
    scanPaper.position.set(0, 1.028, 0);
    scanPaper.visible = false;

    // Glowing red laser scan line that slides along Z across the Form-45
    const scanLaser = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.05, 0.065),
      new THREE.MeshBasicMaterial({ color: 0xff2a2a })
    );
    const scanLaserGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.48, 0.22),
      new THREE.MeshBasicMaterial({
        color: 0xff3b3b,
        transparent: true,
        opacity: 0.62,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    scanLaserGlow.rotation.x = -Math.PI / 2;
    scanLaserGlow.position.y = -0.015;
    scanLaser.add(scanLaserGlow);
    scanLaser.position.set(0, 1.052, -0.26);
    scanLaser.visible = false;

    // Scanner Lid (angled open at 28 degrees)
    const scanLidPivot = new THREE.Group();
    scanLidPivot.position.set(-0.27, 1.02, 0);
    scanLidPivot.rotation.z = -0.45;
    const scanLidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 0.76), darkMetalMat);
    scanLidMesh.position.set(0.27, 0, 0);
    scanLidPivot.add(scanLidMesh);

    // Status LED (Green idle, Red during active scan)
    const scanLed = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.035, 0.035),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    scanLed.position.set(0.22, 1.02, -0.34);

    // Scanner Local Point Light
    const scanLight = new THREE.PointLight(0x22c55e, 0.35, 3.5);
    scanLight.position.set(0, 1.15, 0);

    scanStationGroup.add(scannerBody, scanGlass, scanPaper, scanLaser, scanLidPivot, scanLed, scanLight);

    // Handheld Form-45 sheet in first-person view when player carries it
    let handForm = null;
    let handHammer = null;
    let handStamp = null;
    if (camera) {
      handForm = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 0.52),
        new THREE.MeshBasicMaterial({ map: formTexture, side: THREE.DoubleSide })
      );
      handForm.updateTexture = renderForm45;
      handForm.position.set(0.24, -0.16, -0.52);
      handForm.rotation.set(-0.25, -0.22, 0.12);
      handForm.visible = false;
      camera.add(handForm);

      // Handheld Claw Hammer in first-person view when player equips it (Bigger, heftier tool)
      handHammer = new THREE.Group();
      handHammer.position.set(0.24, -0.24, -0.48);
      handHammer.rotation.set(-0.25, -0.32, 0.16);

      const fpWoodMat = new THREE.MeshLambertMaterial({
        color: 0xd97706,
        emissive: 0x78350f,
        emissiveIntensity: 0.28
      });
      const fpMetalMat = new THREE.MeshStandardMaterial({
        color: 0xcfd8dc,
        roughness: 0.28,
        metalness: 0.82,
        emissive: 0x475569,
        emissiveIntensity: 0.22
      });

      const fpHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.46, 8), fpWoodMat);
      fpHandle.position.set(0, 0, 0);
      fpHandle.rotation.x = 0.65;

      const fpHeadGroup = new THREE.Group();
      fpHeadGroup.position.set(0, 0.19, -0.12);
      fpHeadGroup.rotation.x = 0.65;

      const fpHeadCore = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.10), fpMetalMat);
      const fpStrike = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.11, 8), fpMetalMat);
      fpStrike.rotation.x = Math.PI / 2;
      fpStrike.position.set(0, 0, -0.09);
      const fpClaw = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.052, 0.13), fpMetalMat);
      fpClaw.rotation.x = 0.35;
      fpClaw.position.set(0, -0.02, 0.09);

      fpHeadGroup.add(fpHeadCore, fpStrike, fpClaw);
      handHammer.add(fpHandle, fpHeadGroup);
      handHammer.traverse(child => {
        if (child.isMesh) {
          child.layers.enable(0);
          child.layers.enable(1);
        }
      });
      handHammer.visible = false;
      camera.add(handHammer);

      // Handheld Official ECP Brass Seal Stamp in first-person view
      handStamp = new THREE.Group();
      handStamp.position.set(0.19, 0.22, -0.38);
      handStamp.rotation.set(-0.15, -0.12, 0.08);
      handStamp.visible = false;

      const fpStampHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.038, 0.18, 12), stampHandleMat);
      fpStampHandle.position.y = 0.09;
      const fpStampKnob = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 10), stampBrassMat);
      fpStampKnob.position.y = 0.18;
      const fpStampCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.058, 0.034, 16), stampBrassMat);
      fpStampCollar.position.y = 0.015;
      const fpStampDie = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.016, 16), stampDieMat);
      fpStampDie.position.y = -0.006;
      handStamp.add(fpStampHandle, fpStampKnob, fpStampCollar, fpStampDie);
      handStamp.traverse(child => {
        if (child.isMesh) {
          child.layers.enable(0);
          child.layers.enable(1);
        }
      });
      camera.add(handStamp);
    }

    // --- LEFT SCHOOL LOBBY & PEEKING PILLAR ZONE (Visible when throwing Hall Light Q!) ---
    const leftHallFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 12), floorMat);
    leftHallFloor.rotation.x = -Math.PI / 2;
    leftHallFloor.position.set(-7.1, 0, -2.2);
    const leftHallCeiling = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 12), ceilingMat);
    leftHallCeiling.rotation.x = Math.PI / 2;
    leftHallCeiling.position.set(-7.1, 4.3, -2.2);
    const leftHallOuterWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.3, 12), wallMat);
    leftHallOuterWall.position.set(-9.2, 2.15, -2.2);
    const leftLobbyBackWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 4.3, 0.3), wallMat);
    leftLobbyBackWall.position.set(-6.8, 2.15, -4.2);

    // Sarkari Concrete Corridor Pillar in the Left Lobby
    const leftLobbyPillar = new THREE.Group();
    leftLobbyPillar.position.set(-6.65, 0, -3.45);
    const pillarShaft = new THREE.Mesh(new THREE.BoxGeometry(0.56, 4.3, 0.56), wallMat);
    pillarShaft.position.y = 2.15;
    pillarShaft.castShadow = true;
    const pillarDado = new THREE.Mesh(
      new THREE.BoxGeometry(0.60, 1.35, 0.60),
      new THREE.MeshLambertMaterial({ color: 0x1e3a29 })
    );
    pillarDado.position.y = 0.68;
    leftLobbyPillar.add(pillarShaft, pillarDado);

    // Old Sarkari Bench & Sconce in the Left Lobby
    const lobbyBench = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.55, 2.1), benchMat);
    lobbyBench.position.set(-8.4, 0.28, -1.8);
    const lobbySconce = createWallSconce();
    lobbySconce.position.set(-6.35, 2.55, -3.45);
    office.add(leftHallFloor, leftHallCeiling, leftHallOuterWall, leftLobbyBackWall, leftLobbyPillar, lobbyBench, lobbySconce);

    // --- RIGHT COURTYARD ALLEY (Visible through the Small Peeking Window & Main Window when throwing Yard Light E!) ---
    const rightYardFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 12), floorMat);
    rightYardFloor.rotation.x = -Math.PI / 2;
    rightYardFloor.position.set(7.1, 0, -2.2);
    const rightYardOuterWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 4.3, 12), wallMat);
    rightYardOuterWall.position.set(9.2, 2.15, -2.2);
    const rightYardPillar = new THREE.Group();
    rightYardPillar.position.set(6.65, 0, -3.45);
    const rPillarShaft = new THREE.Mesh(new THREE.BoxGeometry(0.54, 4.3, 0.54), wallMat);
    rPillarShaft.position.y = 2.15;
    const rPillarDado = new THREE.Mesh(
      new THREE.BoxGeometry(0.58, 1.35, 0.58),
      new THREE.MeshLambertMaterial({ color: 0x1e3a29 })
    );
    rPillarDado.position.y = 0.68;
    rightYardPillar.add(rPillarShaft, rPillarDado);
    office.add(rightYardFloor, rightYardOuterWall, rightYardPillar);

    // --- RIGHT WALL WITH SMALL PEEKING WINDOW (ROSHYDAN), IRON GRILLE WINDOW & WOODEN SHUTTERS ---
    // Seamless Right Wall: from z = -3.8 (overlapping front wall) to z = -0.85 (window frame)
    // Precision enlarged window opening from z = -3.05 to -1.45 (1.60m wide), y = 1.15 to 2.65 (1.50m tall)
    const rightWallFarBack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 0.75), wallMat);
    rightWallFarBack.position.set(4.3, 2.15, -3.425);
    const rightWallMidPillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 0.60), wallMat);
    rightWallMidPillar.position.set(4.3, 2.15, -1.15);
    const rightPeekWallBottom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.15, 1.60), wallMat);
    rightPeekWallBottom.position.set(4.3, 0.575, -2.25);
    const rightPeekWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.65, 1.60), wallMat);
    rightPeekWallTop.position.set(4.3, 3.475, -2.25);

    // Enlarged Right Peeking Window Frame & Security Bars (z = -2.25, y = 1.90)
    const rightPeekFrame = new THREE.Group();
    rightPeekFrame.position.set(4.28, 1.90, -2.25);
    const rpSill = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 1.66), darkMetalMat);
    rpSill.position.set(0, -0.75, 0);
    const rpHeader = rpSill.clone();
    rpHeader.position.set(0, 0.75, 0);
    const rpJambB = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.50, 0.08), darkMetalMat);
    rpJambB.position.set(0, 0, -0.80);
    const rpJambF = rpJambB.clone();
    rpJambF.position.set(0, 0, 0.80);
    rightPeekFrame.add(rpSill, rpHeader, rpJambB, rpJambF);
    const rightPeekGrill = createExteriorWindowGrill(true);
    office.add(rightPeekGrill);

    // PITCH BLACK APERTURE VOID MESH & BACKDROP (100% Light-Proof & Fog-Proof)
    const rightPeekVoidMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 1.52), peekVoidMat);
    rightPeekVoidMesh.rotation.y = -Math.PI / 2;
    rightPeekVoidMesh.position.set(0.14, 0, 0); // Safely back at exterior boundary
    rightPeekFrame.add(rightPeekVoidMesh);

    const rightPeekBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), peekVoidMat);
    rightPeekBackdrop.rotation.y = -Math.PI / 2;
    rightPeekBackdrop.position.set(5.15, 1.90, -2.25); // Behind Babu head
    office.add(rightPeekBackdrop);

    // Eerie cold moonlight accent above right peek window (illuminates Babu under pale moonlight)
    const rightPeekMoonlight = new THREE.PointLight(0x94c4e8, 0, 5.5, 0.4);
    rightPeekMoonlight.position.set(4.65, 2.35, -2.55);
    rightPeekMoonlight.layers.enable(0);
    rightPeekMoonlight.layers.enable(1);
    office.add(rightPeekMoonlight);

    // Precision Window Jamb Alignment: Starts at winJambR (z = 1.04) to avoid window aperture clipping!
    const rightWallFront = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 2.4), wallMat);
    rightWallFront.position.set(4.3, 2.15, 2.24);
    const rightWallRear = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.3, 3.6), wallMat);
    rightWallRear.position.set(4.3, 2.15, 5.1);
    const rightWallBottom = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 2.05), wallMat);
    rightWallBottom.position.set(4.3, 0.5, 0.175);
    const rightWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.95, 2.05), wallMat);
    rightWallTop.position.set(4.3, 3.82, 0.175);
    office.add(
      rightWallFarBack,
      rightWallMidPillar,
      rightPeekWallBottom,
      rightPeekWallTop,
      rightPeekFrame,
      rightWallFront,
      rightWallRear,
      rightWallBottom,
      rightWallTop
    );

    // Solid Classroom Rear Back Wall (Encloses the room completely so extreme views never cut off into void!)
    const rearClassroomWall = new THREE.Mesh(new THREE.BoxGeometry(8.95, 4.3, 0.35), wallMat);
    rearClassroomWall.position.set(0, 2.15, 6.55);
    rearClassroomWall.receiveShadow = true;
    office.add(rearClassroomWall);

    // Open Window Frame (No prison bars - clear open window allowing Babu to climb through!)
    const winFrameGroup = new THREE.Group();
    winFrameGroup.position.set(4.28, 2.18, 0.05);
    const winSill = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 2.06), darkMetalMat);
    winSill.position.set(0, -1.16, 0);
    const winHeader = winSill.clone();
    winHeader.position.set(0, 1.16, 0);
    const winJambL = new THREE.Mesh(new THREE.BoxGeometry(0.46, 2.20, 0.12), darkMetalMat);
    winJambL.position.set(0, 0, -0.97);
    const winJambR = winJambL.clone();
    winJambR.position.set(0, 0, 0.97);
    winFrameGroup.add(winSill, winHeader, winJambL, winJambR);
    office.add(winFrameGroup);

    const rightSconce = createWallSconce();
    rightSconce.rotation.y = Math.PI;
    rightSconce.position.set(4.1, 2.35, -1.12);
    office.add(rightSconce);

    // Twin Hinged Louvered Wooden Shutters (Do Pallay Wali Khirki)
    const rightShutterMesh = new THREE.Group();
    rightShutterMesh.position.set(4.12, 2.18, 0.05);
    office.add(rightShutterMesh);

    const shutterMat = new THREE.MeshLambertMaterial({ map: createWindowShutterTex() });

    // Left Shutter Leaf Pivot (Hinged at z = -0.92)
    const leftLeafPivot = new THREE.Group();
    leftLeafPivot.position.set(0, 0, -0.92);
    leftLeafPivot.rotation.y = -1.42; // Swings inward (-X) into the classroom!
    const leftLeafMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 2.26, 0.92), shutterMat);
    leftLeafMesh.position.set(0, 0, 0.46);
    leftLeafMesh.castShadow = true;
    leftLeafMesh.userData.action = 'right_door';
    clickableMeshes.push(leftLeafMesh);
    const leftRingHandle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 5, 8), brassMat);
    leftRingHandle.rotation.y = Math.PI / 2;
    leftRingHandle.position.set(-0.07, -0.1, 0.80);
    leftLeafPivot.add(leftLeafMesh, leftRingHandle);

    // Right Shutter Leaf Pivot (Hinged at z = +0.92)
    const rightLeafPivot = new THREE.Group();
    rightLeafPivot.position.set(0, 0, 0.92);
    rightLeafPivot.rotation.y = 1.42; // Swings inward (-X) into the classroom!
    const rightLeafMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 2.26, 0.92), shutterMat);
    rightLeafMesh.position.set(0, 0, -0.46);
    rightLeafMesh.castShadow = true;
    rightLeafMesh.userData.action = 'right_door';
    clickableMeshes.push(rightLeafMesh);
    const rightRingHandle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.015, 5, 8), brassMat);
    rightRingHandle.rotation.y = Math.PI / 2;
    rightRingHandle.position.set(-0.07, -0.1, -0.80);

    // Animated Vertical Brass Chitkani (Tower Bolt) on Right Leaf Center Edge
    const chitkaniBolt = new THREE.Group();
    chitkaniBolt.position.set(-0.07, 0.45, -0.86); // Slides up to y = 0.88 when locked into top sill!
    const chitkaniRod = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.55, 6), brassMat);
    const chitkaniKnob = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.08), brassMat);
    chitkaniKnob.position.set(-0.03, -0.18, 0);
    chitkaniBolt.add(chitkaniRod, chitkaniKnob);
    rightLeafPivot.add(rightLeafMesh, rightRingHandle, chitkaniBolt);

    // 3D Visual Cracking Damage Decal Planes on Window Leaves
    const winCrackObjL = createCrackDecalCanvas('window');
    const windowCrackMatL = new THREE.MeshBasicMaterial({
      map: winCrackObjL.tex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const windowCrackDecalL = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 2.15), windowCrackMatL);
    windowCrackDecalL.position.set(-0.055, 0, 0.46);
    windowCrackDecalL.rotation.y = -Math.PI / 2;
    windowCrackDecalL.userData = { crackObj: winCrackObjL, lastDmgTier: -1 };
    leftLeafMesh.add(windowCrackDecalL);

    const winCrackObjR = createCrackDecalCanvas('window');
    const windowCrackMatR = new THREE.MeshBasicMaterial({
      map: winCrackObjR.tex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const windowCrackDecalR = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 2.15), windowCrackMatR);
    windowCrackDecalR.position.set(-0.055, 0, -0.46);
    windowCrackDecalR.rotation.y = -Math.PI / 2;
    windowCrackDecalR.userData = { crackObj: winCrackObjR, lastDmgTier: -1 };
    rightLeafMesh.add(windowCrackDecalR);

    rightShutterMesh.add(leftLeafPivot, rightLeafPivot);
    rightShutterMesh.userData = { leftLeafPivot, rightLeafPivot, chitkaniBolt };

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.68, 0.38), darkMetalMat);
    rightPanel.position.set(4.08, 1.55, -1.42);
    const rightBtnDoor3D = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.22, 0.24),
      new THREE.MeshBasicMaterial({ color: 0xdc2626 })
    );
    rightBtnDoor3D.position.set(-0.06, 0.14, 0);
    rightBtnDoor3D.userData.action = 'right_door';
    clickableMeshes.push(rightBtnDoor3D);

    const rightBtnLight3D = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.22, 0.24),
      new THREE.MeshBasicMaterial({ color: 0x713f12 })
    );
    rightBtnLight3D.position.set(-0.06, -0.14, 0);
    rightBtnLight3D.userData.action = 'right_light';
    clickableMeshes.push(rightBtnLight3D);
    rightPanel.add(rightBtnDoor3D, rightBtnLight3D);
    office.add(rightPanel);

    const upsUnit = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.55, 0.55),
      new THREE.MeshLambertMaterial({ color: 0x7f1d1d })
    );
    upsUnit.position.set(3.4, 0.28, -2.5);
    const carBattery = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.48, 0.45),
      new THREE.MeshLambertMaterial({ color: 0x1e3a8a })
    );
    carBattery.position.set(2.55, 0.24, -2.55);
    office.add(upsUnit, carBattery);

    // --- WALL PEG & HANGING REPAIR HAMMER ON RIGHT SIDE OF WINDOW (x = 4.22, y = 1.86, z = 1.25) ---
    const hammerWoodMat = new THREE.MeshLambertMaterial({ color: 0xd97706 }); // bright amber wood handle
    const hammerMetalMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.85
    });

    const hammerPegGroup = new THREE.Group();
    hammerPegGroup.position.set(4.22, 1.86, 1.25);

    // Large Industrial Emergency Tool Backboard (Bright contrast against dark classroom wall)
    const toolBoardMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // warm golden wood
    const toolBoard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.88, 0.40), toolBoardMat);
    toolBoard.position.set(0.015, -0.15, 0);

    // Emergency Red Header Bar on Tool Board
    const toolHeaderMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    const toolHeader = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.14, 0.40), toolHeaderMat);
    toolHeader.position.set(-0.005, 0.37, 0);
    toolBoard.add(toolHeader);
    hammerPegGroup.add(toolBoard);

    // Local Accent Spotlight illuminating the Emergency Hammer station
    const hammerAccentLight = new THREE.PointLight(0xffedd5, 0.95, 4.2);
    hammerAccentLight.position.set(-0.28, 0.22, 0);
    hammerPegGroup.add(hammerAccentLight);

    // Sturdy Iron Wall Peg protruding -X into the room
    const pegMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const pegMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.24, 8), pegMat);
    pegMesh.rotation.z = Math.PI / 2;
    pegMesh.position.set(-0.12, 0, 0);
    hammerPegGroup.add(pegMesh);

    // Wall Hanging Claw Hammer (Enlarged, hefty industrial size)
    const wallHammer = new THREE.Group();
    wallHammer.position.set(-0.15, 0, 0);

    // Wooden handle hanging vertically downward (Longer & thicker)
    const hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 0.64, 8), hammerWoodMat);
    hammerHandle.position.set(0, -0.29, 0);

    // Steel hammer head hanging on the peg (Bigger head with solid strike face and claw)
    const hammerHeadGroup = new THREE.Group();
    hammerHeadGroup.position.set(0, 0.04, 0);
    const hammerHeadCore = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.10), hammerMetalMat);
    const strikeFace = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.038, 0.11, 8), hammerMetalMat);
    strikeFace.rotation.x = Math.PI / 2;
    strikeFace.position.set(0, 0, -0.10);
    const clawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.052, 0.13), hammerMetalMat);
    clawMesh.rotation.x = 0.35;
    clawMesh.position.set(0, -0.02, 0.10);
    hammerHeadGroup.add(hammerHeadCore, strikeFace, clawMesh);
    wallHammer.add(hammerHandle, hammerHeadGroup);

    // Enlarged click box so player can easily click the hammer in 3D
    const hammerClickBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.95, 0.55),
      new THREE.MeshBasicMaterial({ visible: false, wireframe: true })
    );
    hammerClickBox.position.set(0, -0.22, 0);
    hammerClickBox.userData.action = 'toggle_hammer';
    wallHammer.add(hammerClickBox);

    hammerPegGroup.add(wallHammer);
    office.add(hammerPegGroup);

    hammerPegGroup.traverse(child => {
      if (child.isMesh) child.layers.enable(1);
    });

    toolBoard.userData.action = 'toggle_hammer';
    pegMesh.userData.action = 'toggle_hammer';
    hammerHandle.userData.action = 'toggle_hammer';
    hammerHeadCore.userData.action = 'toggle_hammer';
    strikeFace.userData.action = 'toggle_hammer';
    clawMesh.userData.action = 'toggle_hammer';
    clickableMeshes.push(hammerClickBox, toolBoard, pegMesh, hammerHandle, hammerHeadCore, strikeFace, clawMesh);

    // =========================================================================
    // RETRO BLACK CHAI KETTLE ON WOODEN SIDE-TABLE (Like the Scanner Station)
    // Placed on right wall beside the Claw Hammer
    // =========================================================================
    // =========================================================================
    // ENLARGED WOODEN SIDE-TABLE: CHAI KETTLE + OFFICIAL ECP SEAL STAMP STATION
    // Placed on right wall beside the Claw Hammer, expanded across the open wall
    // =========================================================================
    const kettleStationGroup = new THREE.Group();
    kettleStationGroup.position.set(3.82, 0, 2.05);
    office.add(kettleStationGroup);

    // Sturdy, expanded wooden side-table stand (depth 0.72m, length 1.65m)
    const kettleTableTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 1.65), woodMat);
    kettleTableTop.position.y = 0.86;
    kettleStationGroup.add(kettleTableTop);

    // 6 Sturdy Wooden Legs supporting the enlarged 1.65m utility table
    for (const tx of [-0.28, 0.28]) {
      for (const tz of [-0.70, 0.0, 0.70]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.86, 0.08), woodMat);
        leg.position.set(tx, 0.43, tz);
        kettleStationGroup.add(leg);
      }
    }

    // Authentic Matte Black Enamel & Steel Materials for Kettle
    const kBlackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // sleek matte cast-iron black
      metalness: 0.32,
      roughness: 0.38
    });
    const kChromeMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // polished chrome / stainless steel rim & spout
      metalness: 0.90,
      roughness: 0.20
    });
    const kTrimMat = new THREE.MeshStandardMaterial({
      color: 0x09090b, // deep black bakelite knob & handle
      metalness: 0.15,
      roughness: 0.65
    });

    const kettlePot = new THREE.Group();
    kettlePot.position.set(0.04, 0.90, -0.40);

    // 1. Pot Base & Belly Body
    const potBaseRim = new THREE.Mesh(new THREE.CylinderGeometry(0.148, 0.142, 0.025, 12), kTrimMat);
    potBaseRim.position.y = 0.0125;
    const potBelly = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.145, 0.20, 12), kBlackMat);
    potBelly.position.y = 0.115;
    const potShoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.090, 0.115, 0.055, 12), kBlackMat);
    potShoulder.position.y = 0.235;
    const potNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.090, 0.025, 12), kChromeMat);
    potNeck.position.y = 0.272;

    // 2. Stepped Domed Lid with Bakelite Knob
    const lidDome = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.090, 0.025, 12), kBlackMat);
    lidDome.position.y = 0.292;
    const lidKnob = new THREE.Mesh(new THREE.SphereGeometry(0.020, 8, 8), kTrimMat);
    lidKnob.position.y = 0.320;

    // 3. Classic Curved Pouring Spout (Angled forward-left into room)
    const spoutGroup = new THREE.Group();
    spoutGroup.position.set(-0.09, 0.14, 0.07);
    const spoutBase = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.045, 0.12, 8), kBlackMat);
    spoutBase.rotation.set(0.48, 0.1, -0.65);
    const spoutTip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.030, 0.085, 8), kChromeMat);
    spoutTip.rotation.set(0.20, 0.05, -0.92);
    spoutTip.position.set(-0.07, 0.06, 0.04);
    spoutGroup.add(spoutBase, spoutTip);

    // 4. Sturdy Overhead Loop Handle (Standing upright above lid)
    const handleGroup = new THREE.Group();
    handleGroup.position.set(0, 0.27, 0);
    const hLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.17, 6), kChromeMat);
    hLeft.position.set(0, 0.07, -0.09);
    hLeft.rotation.x = -0.12;
    const hRight = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.17, 6), kChromeMat);
    hRight.position.set(0, 0.07, 0.09);
    hRight.rotation.x = 0.12;
    const hGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), kTrimMat);
    hGrip.rotation.x = Math.PI / 2;
    hGrip.position.set(0, 0.155, 0);

    // Hinge brackets on rim
    const hingeL = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.032, 0.018), kChromeMat);
    hingeL.position.set(0, 0, -0.092);
    const hingeR = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.032, 0.018), kChromeMat);
    hingeR.position.set(0, 0, 0.092);

    handleGroup.add(hLeft, hRight, hGrip, hingeL, hingeR);

    // 5. Classic Desi Tea Glass on small saucer beside the kettle
    const glassGroup = new THREE.Group();
    glassGroup.position.set(-0.16, 0.0, 0.18);
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.060, 0.014, 10), kChromeMat);
    saucer.position.y = 0.007;
    const teaGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.028, 0.095, 8),
      new THREE.MeshLambertMaterial({ color: 0x92400e, transparent: true, opacity: 0.85 })
    );
    teaGlass.position.y = 0.055;
    glassGroup.add(saucer, teaGlass);

    // 6. Volumetric 3D Steam Particles for Boiling Animation (Spout + Lid Seam)
    const steamGroup = new THREE.Group();
    const steamPuffs = [];
    const puffCount = 24;
    const puffGeo = new THREE.SphereGeometry(0.026, 7, 7);

    for (let i = 0; i < puffCount; i++) {
      const puffMat = new THREE.MeshBasicMaterial({
        color: 0xf1f5f9,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
      });
      const puffMesh = new THREE.Mesh(puffGeo, puffMat);
      puffMesh.layers.enable(1);
      puffMesh.visible = false;
      const isSpout = (i < 18); // 18 puffs from spout jet, 6 wisps from lid dome
      puffMesh.userData = {
        isSpout: isSpout,
        age: (i / puffCount) * 1.8, // staggered initial cycle
        lifeSpan: 1.5 + (i % 6) * 0.12,
        upSpeed: isSpout ? (0.24 + (i % 4) * 0.035) : (0.16 + (i % 3) * 0.025),
        driftSpeed: 0.045 + (i % 5) * 0.012,
        angle: (i * 0.785),
        curlSeed: i * 1.45,
        baseScale: 0.60 + (i % 4) * 0.15
      };
      steamGroup.add(puffMesh);
      steamPuffs.push(puffMesh);
    }

    kettlePot.add(potBaseRim, potBelly, potShoulder, potNeck, lidDome, lidKnob, spoutGroup, handleGroup, glassGroup, steamGroup);
    kettleStationGroup.add(kettlePot);

    // Local warm amber accent point light for the kettle section
    const kettleLight = new THREE.PointLight(0xffedd5, 0.40, 2.8);
    kettleLight.position.set(-0.1, 1.25, -0.40);
    kettleStationGroup.add(kettleLight);

    // Interactive click box for boiling / brewing chai at the kettle
    const kettleClickBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.70, 0.70),
      new THREE.MeshBasicMaterial({ visible: false, wireframe: true })
    );
    kettleClickBox.position.set(0.04, 1.15, -0.40);
    kettleClickBox.userData.action = 'brew_chai';
    kettleStationGroup.add(kettleClickBox);

    // --- OFFICIAL ECP SARKARI RUBBER STAMP & INKPAD (PLACED NEXT TO KETTLE) ---
    stampDeskGroup = new THREE.Group();
    stampDeskGroup.position.set(0.02, 0.90, 0.38);
    stampDeskGroup.scale.set(1.35, 1.35, 1.35);
    stampDeskGroup.rotation.y = -Math.PI / 2 - 0.12;
    stampDeskGroup.userData.action = 'stamp_form';

    // 1. Vintage Metal Inkpad Tin
    const inkTinMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.35
    });
    const inkPadBox = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.032, 0.14), inkTinMat);
    inkPadBox.position.set(0, 0.016, 0);
    inkPadBox.userData.action = 'stamp_form';
    clickableMeshes.push(inkPadBox);

    // Violet Ink Felt Cushion
    const inkFeltMat = new THREE.MeshLambertMaterial({
      color: 0x4338ca,
      emissive: 0x312e81,
      emissiveIntensity: 0.35
    });
    const inkFelt = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.012, 0.11), inkFeltMat);
    inkFelt.position.set(0, 0.026, 0);
    inkFelt.userData.action = 'stamp_form';
    clickableMeshes.push(inkFelt);

    // Open Hinged Tin Lid (leaning back)
    const tinLid = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.006, 0.14), inkTinMat);
    tinLid.position.set(0, 0.075, -0.072);
    tinLid.rotation.x = -1.15;
    stampDeskGroup.add(inkPadBox, inkFelt, tinLid);

    // 2. Heavy ECP Brass & Mahogany Sarkari Seal Stamp (Standing on Table)
    stampBodyGroup = new THREE.Group();
    stampBodyGroup.position.set(0.14, 0, 0.02);
    stampBodyGroup.userData.action = 'stamp_form';

    // (stampHandleMat declared at top)
    const stampHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.038, 0.15, 12), stampHandleMat);
    stampHandle.position.y = 0.095;
    stampHandle.castShadow = true;
    stampHandle.userData.action = 'stamp_form';
    clickableMeshes.push(stampHandle);

    // (stampBrassMat declared at top)
    const stampKnob = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), stampBrassMat);
    stampKnob.position.y = 0.175;
    stampKnob.userData.action = 'stamp_form';
    clickableMeshes.push(stampKnob);

    const stampCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.052, 0.03, 16), stampBrassMat);
    stampCollar.position.y = 0.025;
    stampCollar.userData.action = 'stamp_form';
    clickableMeshes.push(stampCollar);

    // (stampDieMat declared at top)
    const stampDie = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.014, 16), stampDieMat);
    stampDie.position.y = 0.007;
    stampDie.userData.action = 'stamp_form';
    clickableMeshes.push(stampDie);

    stampBodyGroup.add(stampHandle, stampKnob, stampCollar, stampDie);
    stampDeskGroup.add(stampBodyGroup);

    // Large invisible click box for easily clicking stamp on side table
    const stampClickBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.45, 0.55),
      new THREE.MeshBasicMaterial({ visible: false, wireframe: true })
    );
    stampClickBox.position.set(0.02, 0.20, 0);
    stampClickBox.userData.action = 'stamp_form';
    stampDeskGroup.add(stampClickBox);
    clickableMeshes.push(stampClickBox);

    // Dedicated violet accent point light illuminating stamp & inkpad (Level 3 Only)
    const stampLight = new THREE.PointLight(0xc084fc, 0.45, 2.2);
    stampLight.position.set(-0.1, 0.35, 0);
    stampLight.userData.lvl3Only = true;
    stampLight.visible = false;
    stampDeskGroup.add(stampLight);

    // ECP Official Seal Stamp is strictly for Level 3 (Karachi RO Warehouse - Whitener Trap & Verification)
    // Removed / hidden in Level 1 (NA-47 Islamabad) and Level 2 (NA-128 Lahore)
    stampDeskGroup.userData.lvl3Only = true;
    stampDeskGroup.visible = false;
    stampDeskGroup.traverse(child => {
      child.userData.lvl3Only = true;
      child.visible = false;
      if (child.isMesh) child.layers.enable(1);
    });

    kettleStationGroup.add(stampDeskGroup);

    potBelly.userData.action = 'brew_chai';
    potShoulder.userData.action = 'brew_chai';
    lidDome.userData.action = 'brew_chai';
    lidKnob.userData.action = 'brew_chai';
    saucer.userData.action = 'brew_chai';
    teaGlass.userData.action = 'brew_chai';
    kettleTableTop.userData.action = 'brew_chai';

    clickableMeshes.push(kettleClickBox, potBelly, potShoulder, lidDome, lidKnob, saucer, teaGlass, kettleTableTop);

    kettleStationGroup.traverse(child => {
      if (child.isMesh) child.layers.enable(1);
    });

    // --- CLASSROOM REAR EXTENSION PROPS (Extreme Left & Right Corners) ---
    // 1. BACK-LEFT: Green Steel Sarkari Almirah with Paper Parcels
    const rearAlmirahGroup = new THREE.Group();
    rearAlmirahGroup.position.set(-3.7, 0, 4.3);
    const rearAlmirahMat = new THREE.MeshLambertMaterial({ color: 0x1c3829 });
    const almirahBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.35, 1.55), rearAlmirahMat);
    almirahBody.position.y = 1.175;
    almirahBody.castShadow = true;
    almirahBody.receiveShadow = true;
    const almHandleL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.04), brassMat);
    almHandleL.position.set(0.44, 1.25, -0.06);
    const almHandleR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.04), brassMat);
    almHandleR.position.set(0.44, 1.25, 0.06);
    const almParcel = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.28, 0.95),
      new THREE.MeshLambertMaterial({ color: 0x926c48 })
    );
    almParcel.position.set(0.02, 2.50, 0);
    rearAlmirahGroup.add(almirahBody, almHandleL, almHandleR, almParcel);
    office.add(rearAlmirahGroup);

    // 2. BACK-LEFT: Official Pinboard & Ballot Box Stacks
    const rearNoticeBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 1.15, 1.65),
      new THREE.MeshLambertMaterial({ color: 0x78350f })
    );
    rearNoticeBoard.position.set(-4.1, 2.35, 3.1);
    const pinnedPaper = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.55, 0.42),
      new THREE.MeshBasicMaterial({ color: 0xfef9c3 })
    );
    pinnedPaper.position.set(-4.09, 2.35, 3.1);
    office.add(rearNoticeBoard, pinnedPaper);

    const cBoxMat = new THREE.MeshLambertMaterial({ color: 0x854d0e });
    const cBox1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.52, 0.75), cBoxMat);
    cBox1.position.set(-3.4, 0.26, 5.6);
    const cBox2 = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.72), cBoxMat);
    cBox2.position.set(-3.38, 0.76, 5.58);
    cBox2.rotation.y = 0.14;
    office.add(cBox1, cBox2);

    // 3. BACK-RIGHT: Tall Wooden Bookshelf / Election Register Rack
    const rearBookshelf = new THREE.Group();
    rearBookshelf.position.set(3.85, 0, 3.7);
    const shelfFrame = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.35, 1.65), woodMat);
    shelfFrame.position.y = 1.175;
    shelfFrame.castShadow = true;
    rearBookshelf.add(shelfFrame);

    const bookColors = [0x991b1b, 0x1e3a8a, 0x166534, 0x78350f];
    for (let bi = 0; bi < 8; bi++) {
      const bookMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.36, 0.09),
        new THREE.MeshLambertMaterial({ color: bookColors[bi % bookColors.length] })
      );
      bookMesh.position.set(-0.06, 0.55 + Math.floor(bi / 4) * 0.55, -0.55 + (bi % 4) * 0.15);
      rearBookshelf.add(bookMesh);
    }
    office.add(rearBookshelf);

    // 4. BACK-RIGHT: Stacked Student Desks & Benches
    const stackDesk1 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.72, 0.82), benchMat);
    stackDesk1.position.set(3.2, 0.36, 5.3);
    const stackDesk2 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.72, 0.82), benchMat);
    stackDesk2.position.set(3.18, 1.08, 5.28);
    stackDesk2.rotation.x = Math.PI;
    office.add(stackDesk1, stackDesk2);

    // 5. BACK-RIGHT: Sarkari Red Water Cooler on Stool
    const coolerStool = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.44, 6), darkMetalMat);
    coolerStool.position.set(2.1, 0.22, 5.8);
    const coolerDrum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.20, 0.46, 12),
      new THREE.MeshLambertMaterial({ color: 0xdc2626 })
    );
    coolerDrum.position.set(2.1, 0.67, 5.8);
    const coolerLid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.21, 0.08, 12),
      new THREE.MeshLambertMaterial({ color: 0xf8fafc })
    );
    coolerLid.position.set(2.1, 0.94, 5.8);
    const steelGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.035, 0.10, 8),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.3 })
    );
    steelGlass.position.set(1.9, 0.48, 5.65);
    office.add(coolerStool, coolerDrum, coolerLid, steelGlass);

    // 6. REAR WALL: Wall Clock & Subtle Rear Ambient Lighting
    const rearClock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 0.05, 12),
      new THREE.MeshLambertMaterial({ color: 0xf8fafc })
    );
    rearClock.rotation.x = Math.PI / 2;
    rearClock.position.set(0, 3.15, 6.35);
    office.add(rearClock);

    const rearCeilingLight = new THREE.PointLight(0xc99a3e, 0.44, 12);
    rearCeilingLight.position.set(0, 3.5, 3.8);
    office.add(rearCeilingLight);

    // --- FLOATING DUST MOTES ---
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 90;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 8;
      dustPos[i * 3 + 1] = 0.4 + Math.random() * 3.4;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustParticles = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xd4b46a, size: 0.045, transparent: true, opacity: 0.42 })
    );
    office.add(dustParticles);

    // --- REFERENCE-ACCURATE SICKLY AMBER/OLIVE LIGHTING & HANDHELD VOLUMETRIC TORCH ---
    const ambient = new THREE.AmbientLight(0x323a2f, 0.72);
    scene.add(ambient);

    // Gritty, moody low-sodium room ceiling lamp (Prevents glaring overexposure on the classroom back wall!)
    const roomLight = new THREE.PointLight(0xc99a3e, 0.90, 12);
    roomLight.position.set(0, 3.4, 0.2);
    roomLight.castShadow = true;
    roomLight.shadow.mapSize.width = 512;
    roomLight.shadow.mapSize.height = 512;
    scene.add(roomLight);

    // Ceiling Fluorescent Tube Light Fixture & Phosphor Tubes (Visible overhead!)
    const ceilingTubeGroup = new THREE.Group();
    ceilingTubeGroup.position.set(0, 3.82, 0.2);
    const tubeHousing = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.07, 0.26),
      new THREE.MeshStandardMaterial({ color: 0x1f2420, roughness: 0.85, metalness: 0.4 })
    );
    const ceilingTubeMat = new THREE.MeshBasicMaterial({ color: 0xfff3c4 });
    const tubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.0, 8);
    tubeGeo.rotateZ(Math.PI / 2);
    const tube1 = new THREE.Mesh(tubeGeo, ceilingTubeMat);
    tube1.position.set(0, -0.045, -0.06);
    const tube2 = new THREE.Mesh(tubeGeo, ceilingTubeMat);
    tube2.position.set(0, -0.045, 0.06);
    ceilingTubeGroup.add(tubeHousing, tube1, tube2);
    office.add(ceilingTubeGroup);

    // Player's Handheld Flashlight + Visible Volumetric Beam Cone (Like Reference Image 1!)
    const flashlight = new THREE.SpotLight(0xfef08a, 1.25, 15, Math.PI / 5.2, 0.48, 1.2);
    flashlight.position.set(0, 1.55, 1.8);
    flashlight.castShadow = true;
    const flashTarget = new THREE.Object3D();
    flashTarget.position.set(0, 1.6, -3);
    scene.add(flashlight, flashTarget);
    flashlight.target = flashTarget;

    // Physical 3D Handheld Torch model removed (keeping flashlight illumination)
    const handTorchGroup = new THREE.Group();
    handTorchGroup.visible = false;

    // Warm Amber Doorway & Small Peek-Window Lights positioned OUTSIDE the room walls (x = -4.95 and x = +4.95)
    // and assigned exclusively to Layer 1. The room interior remains on Layer 0, physically preventing ANY light
    // from spilling into the room or onto the desk/ballot box/back chalkboard!
    // Stark Horror Beam Doorway & Small Peek-Window Lights (#ffe6a3 warm horror spotlight)
    // Outward-directed spotlights strictly illuminating the exterior corridor & windows.
    // Because they point outward away from the classroom (along -X and +X), mathematically 0.0 light
    // ever spills into the room interior, keeping the room in pitch-dark, eerie horror ambiance!
    const leftHallSpot1 = new THREE.SpotLight(0xffe6a3, 0, 14, Math.PI / 2.3, 0.45, 0.8);
    leftHallSpot1.position.set(-4.48, 2.2, 0.2);
    const leftTarget1 = new THREE.Object3D();
    leftTarget1.position.set(-8.5, 1.2, 0.2);
    scene.add(leftTarget1);
    leftHallSpot1.target = leftTarget1;

    const leftHallSpot2 = new THREE.SpotLight(0xffe6a3, 0, 14, Math.PI / 2.3, 0.45, 0.8);
    leftHallSpot2.position.set(-4.48, 1.8, -2.56);
    const leftTarget2 = new THREE.Object3D();
    leftTarget2.position.set(-8.5, 1.0, -2.56);
    scene.add(leftTarget2);
    leftHallSpot2.target = leftTarget2;

    const leftHallLight = new THREE.Group();
    leftHallLight.add(leftHallSpot1, leftHallSpot2);
    leftHallLight.spot1 = leftHallSpot1;
    leftHallLight.spot2 = leftHallSpot2;
    leftHallLight.color = {
      setHex(hex) {
        leftHallSpot1.color.setHex(hex);
        leftHallSpot2.color.setHex(hex);
      }
    };
    Object.defineProperty(leftHallLight, 'intensity', {
      get() { return leftHallSpot1.intensity; },
      set(val) {
        leftHallSpot1.intensity = val;
        leftHallSpot2.intensity = val;
      }
    });
    scene.add(leftHallLight);

    const rightWindowSpot1 = new THREE.SpotLight(0xffe6a3, 0, 14, Math.PI / 2.3, 0.45, 0.8);
    rightWindowSpot1.position.set(4.48, 2.2, 0.2);
    const rightTarget1 = new THREE.Object3D();
    rightTarget1.position.set(8.5, 1.2, 0.2);
    scene.add(rightTarget1);
    rightWindowSpot1.target = rightTarget1;

    const rightWindowSpot2 = new THREE.SpotLight(0xffe6a3, 0, 14, Math.PI / 2.3, 0.45, 0.8);
    rightWindowSpot2.position.set(4.48, 1.8, -2.56);
    const rightTarget2 = new THREE.Object3D();
    rightTarget2.position.set(8.5, 1.0, -2.56);
    scene.add(rightTarget2);
    rightWindowSpot2.target = rightTarget2;

    const rightWindowLight = new THREE.Group();
    rightWindowLight.add(rightWindowSpot1, rightWindowSpot2);
    rightWindowLight.spot1 = rightWindowSpot1;
    rightWindowLight.spot2 = rightWindowSpot2;
    rightWindowLight.color = {
      setHex(hex) {
        rightWindowSpot1.color.setHex(hex);
        rightWindowSpot2.color.setHex(hex);
      }
    };
    Object.defineProperty(rightWindowLight, 'intensity', {
      get() { return rightWindowSpot1.intensity; },
      set(val) {
        rightWindowSpot1.intensity = val;
        rightWindowSpot2.intensity = val;
      }
    });
    scene.add(rightWindowLight);

    
    // Atmospheric Volumetric Light Cone (Matches Reference Image streetlamp haze)
    function createVolumetricBeam(height, topR, bottomR, colorHex, opacity = 0.15) {
      const geo = new THREE.CylinderGeometry(topR, bottomR, height, 18, 1, true);
      geo.translate(0, -height / 2, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = 3;
      return mesh;
    }

    // --- 10 CCTV CAMERA ZONES (Dual Perspective / Position Vectors by Halqa Level) ---
    const cctvZones = [
      {
        id: 'CAM 01',
        nameLvl1: 'GATE',
        nameLvl2: 'CANAL GATE',
        nameLvl3: 'DOCK GATE',
        name: 'GATE',
        posLvl1: new THREE.Vector3(0.5, 2.2, -36.6),
        lookLvl1: new THREE.Vector3(-1.15, 1.45, -42.5),
        intruderSpotLvl1: new THREE.Vector3(-0.35, 0, -39.4),
        posLvl2: new THREE.Vector3(-0.6, 2.3, -36.4),
        lookLvl2: new THREE.Vector3(0.8, 1.35, -42.5),
        intruderSpotLvl2: new THREE.Vector3(0.15, 0, -39.4),
        posLvl3: new THREE.Vector3(0.8, 2.3, -36.4),
        lookLvl3: new THREE.Vector3(-1.0, 1.25, -42.5),
        intruderSpotLvl3: new THREE.Vector3(-0.15, 0, -39.4),
        pos: new THREE.Vector3(0.5, 2.2, -36.6),
        look: new THREE.Vector3(-1.15, 1.45, -42.5),
        intruderSpot: new THREE.Vector3(-0.35, 0, -39.4)
      },
      {
        id: 'CAM 02',
        nameLvl1: 'COURTYARD',
        nameLvl2: 'QUADRANGLE',
        nameLvl3: 'CARGO BAY',
        name: 'COURTYARD',
        posLvl1: new THREE.Vector3(1.5, 2.3, -21.5),
        lookLvl1: new THREE.Vector3(-0.7, 1.6, -26.5),
        intruderSpotLvl1: new THREE.Vector3(0.40, 0, -24.2),
        posLvl2: new THREE.Vector3(-1.5, 2.4, -21.5),
        lookLvl2: new THREE.Vector3(0.8, 1.35, -26.5),
        intruderSpotLvl2: new THREE.Vector3(-0.55, 0, -24.2),
        posLvl3: new THREE.Vector3(1.6, 2.4, -21.5),
        lookLvl3: new THREE.Vector3(-0.8, 1.35, -26.5),
        intruderSpotLvl3: new THREE.Vector3(0.50, 0, -24.2),
        pos: new THREE.Vector3(1.5, 2.3, -21.5),
        look: new THREE.Vector3(-0.7, 1.6, -26.5),
        intruderSpot: new THREE.Vector3(0.40, 0, -24.2)
      },
      {
        id: 'CAM 03',
        nameLvl1: 'VERANDA',
        nameLvl2: 'CLOISTERS',
        nameLvl3: 'WEST AISLE',
        name: 'VERANDA',
        posLvl1: new THREE.Vector3(-13.4, 2.05, -11.2),
        lookLvl1: new THREE.Vector3(-13.4, 1.35, -17.5),
        intruderSpotLvl1: new THREE.Vector3(-13.4, 0, -14.6),
        posLvl2: new THREE.Vector3(-13.4, 2.05, -11.2),
        lookLvl2: new THREE.Vector3(-13.4, 1.35, -17.5),
        intruderSpotLvl2: new THREE.Vector3(-13.4, 0, -14.6),
        posLvl3: new THREE.Vector3(-13.4, 2.05, -11.2),
        lookLvl3: new THREE.Vector3(-13.4, 1.35, -17.5),
        intruderSpotLvl3: new THREE.Vector3(-13.4, 0, -14.6),
        pos: new THREE.Vector3(-13.4, 2.05, -11.2),
        look: new THREE.Vector3(-13.4, 1.35, -17.5),
        intruderSpot: new THREE.Vector3(-13.4, 0, -14.6)
      },
      {
        id: 'CAM 04',
        nameLvl1: 'STAFF',
        nameLvl2: 'AMPHITHEATRE',
        nameLvl3: 'CUSTOMS BAY',
        name: 'STAFF',
        posLvl1: new THREE.Vector3(15.0, 2.25, -12.2),
        lookLvl1: new THREE.Vector3(12.8, 1.25, -17.0),
        intruderSpotLvl1: new THREE.Vector3(13.6, 0, -14.8),
        posLvl2: new THREE.Vector3(15.0, 2.25, -12.2),
        lookLvl2: new THREE.Vector3(12.8, 1.25, -17.0),
        intruderSpotLvl2: new THREE.Vector3(13.6, 0, -14.8),
        posLvl3: new THREE.Vector3(15.0, 2.25, -12.2),
        lookLvl3: new THREE.Vector3(12.8, 1.25, -17.0),
        intruderSpotLvl3: new THREE.Vector3(13.6, 0, -14.8),
        pos: new THREE.Vector3(15.0, 2.25, -12.2),
        look: new THREE.Vector3(12.8, 1.25, -17.0),
        intruderSpot: new THREE.Vector3(13.6, 0, -14.8)
      },
      {
        id: 'CAM 05',
        nameLvl1: 'LEFT PEEK',
        nameLvl2: 'WEST LOGGIA',
        nameLvl3: 'WEST DOCK',
        name: 'LEFT PEEK',
        posLvl1: new THREE.Vector3(-6.2, 2.3, 0.2),
        lookLvl1: new THREE.Vector3(-4.64, 1.65, -2.28),
        intruderSpotLvl1: new THREE.Vector3(-4.88, -0.82, -2.32),
        posLvl2: new THREE.Vector3(-6.6, 2.6, 0.5),
        lookLvl2: new THREE.Vector3(-4.2, 1.4, -2.6),
        intruderSpotLvl2: new THREE.Vector3(-4.88, -0.82, -2.32),
        posLvl3: new THREE.Vector3(-6.8, 2.6, 0.6),
        lookLvl3: new THREE.Vector3(-4.4, 1.4, -2.6),
        intruderSpotLvl3: new THREE.Vector3(-4.88, -0.82, -2.32),
        pos: new THREE.Vector3(-6.2, 2.3, 0.2),
        look: new THREE.Vector3(-4.64, 1.65, -2.28),
        intruderSpot: new THREE.Vector3(-4.88, -0.82, -2.32)
      },
      {
        id: 'CAM 06',
        nameLvl1: 'RIGHT PEEK',
        nameLvl2: 'EAST LOGGIA',
        nameLvl3: 'VENTILATION',
        name: 'RIGHT PEEK',
        posLvl1: new THREE.Vector3(6.2, 2.3, 0.2),
        lookLvl1: new THREE.Vector3(4.64, 1.65, -2.28),
        intruderSpotLvl1: new THREE.Vector3(4.88, -0.82, -2.32),
        posLvl2: new THREE.Vector3(6.6, 2.6, 0.5),
        lookLvl2: new THREE.Vector3(4.2, 1.4, -2.6),
        intruderSpotLvl2: new THREE.Vector3(4.88, -0.82, -2.32),
        posLvl3: new THREE.Vector3(6.8, 2.6, 0.6),
        lookLvl3: new THREE.Vector3(4.4, 1.4, -2.6),
        intruderSpotLvl3: new THREE.Vector3(4.88, -0.82, -2.32),
        pos: new THREE.Vector3(6.2, 2.3, 0.2),
        look: new THREE.Vector3(4.64, 1.65, -2.28),
        intruderSpot: new THREE.Vector3(4.88, -0.82, -2.32)
      },
      {
        id: 'CAM 07',
        nameLvl1: 'LAB',
        nameLvl2: 'ANATOMY',
        nameLvl3: 'GENSET ROOM',
        name: 'LAB',
        posLvl1: new THREE.Vector3(-15.4, 2.15, -28.0),
        lookLvl1: new THREE.Vector3(-13.2, 1.65, -33.5),
        intruderSpotLvl1: new THREE.Vector3(-14.0, 0, -30.6),
        posLvl2: new THREE.Vector3(-15.2, 2.25, -28.0),
        lookLvl2: new THREE.Vector3(-13.2, 1.55, -33.5),
        intruderSpotLvl2: new THREE.Vector3(-14.0, 0, -30.6),
        posLvl3: new THREE.Vector3(-15.2, 2.25, -28.0),
        lookLvl3: new THREE.Vector3(-13.2, 1.55, -33.5),
        intruderSpotLvl3: new THREE.Vector3(-14.0, 0, -30.6),
        pos: new THREE.Vector3(-15.4, 2.15, -28.0),
        look: new THREE.Vector3(-13.2, 1.65, -33.5),
        intruderSpot: new THREE.Vector3(-14.0, 0, -30.6)
      },
      {
        id: 'CAM 08',
        nameLvl1: 'OFFICE',
        nameLvl2: 'PRINCIPAL',
        nameLvl3: 'RO STRONGROOM',
        name: 'OFFICE',
        posLvl1: new THREE.Vector3(14.8, 2.15, -28.0),
        lookLvl1: new THREE.Vector3(13.2, 1.65, -33.5),
        intruderSpotLvl1: new THREE.Vector3(13.8, 0, -30.6),
        posLvl2: new THREE.Vector3(14.8, 2.25, -28.0),
        lookLvl2: new THREE.Vector3(13.2, 1.55, -33.5),
        intruderSpotLvl2: new THREE.Vector3(13.8, 0, -30.6),
        posLvl3: new THREE.Vector3(14.8, 2.25, -28.0),
        lookLvl3: new THREE.Vector3(13.2, 1.55, -33.5),
        intruderSpotLvl3: new THREE.Vector3(13.8, 0, -30.6),
        pos: new THREE.Vector3(14.8, 2.15, -28.0),
        look: new THREE.Vector3(13.2, 1.65, -33.5),
        intruderSpot: new THREE.Vector3(13.8, 0, -30.6)
      },
      {
        id: 'CAM 09',
        nameLvl1: 'GENERATOR',
        nameLvl2: 'WAPDA SUBSTATION',
        nameLvl3: 'K-ELECTRIC',
        name: 'GENERATOR',
        posLvl1: new THREE.Vector3(-24.5, 2.15, -18.2),
        lookLvl1: new THREE.Vector3(-25.1, 1.35, -22.5),
        intruderSpotLvl1: new THREE.Vector3(-24.8, 0, -20.6),
        posLvl2: new THREE.Vector3(-24.5, 2.15, -18.2),
        lookLvl2: new THREE.Vector3(-25.1, 1.35, -22.5),
        intruderSpotLvl2: new THREE.Vector3(-24.8, 0, -20.6),
        posLvl3: new THREE.Vector3(-24.5, 2.15, -18.2),
        lookLvl3: new THREE.Vector3(-25.1, 1.35, -22.5),
        intruderSpotLvl3: new THREE.Vector3(-24.8, 0, -20.6),
        pos: new THREE.Vector3(-24.5, 2.15, -18.2),
        look: new THREE.Vector3(-25.1, 1.35, -22.5),
        intruderSpot: new THREE.Vector3(-24.8, 0, -20.6)
      },
      {
        id: 'CAM 10',
        nameLvl1: 'LIBRARY',
        nameLvl2: 'ARCHIVES',
        nameLvl3: 'FIBER VAULT',
        name: 'LIBRARY',
        posLvl1: new THREE.Vector3(23.5, 2.25, -14.4),
        lookLvl1: new THREE.Vector3(23.5, 0.75, -17.6),
        intruderSpotLvl1: new THREE.Vector3(23.5, 0, -16.4),
        posLvl2: new THREE.Vector3(23.5, 2.25, -14.4),
        lookLvl2: new THREE.Vector3(23.5, 0.75, -17.6),
        intruderSpotLvl2: new THREE.Vector3(23.5, 0, -16.4),
        posLvl3: new THREE.Vector3(23.5, 2.25, -14.4),
        lookLvl3: new THREE.Vector3(23.5, 0.75, -17.6),
        intruderSpotLvl3: new THREE.Vector3(23.5, 0, -16.4),
        pos: new THREE.Vector3(23.5, 2.25, -14.4),
        look: new THREE.Vector3(23.5, 0.75, -17.6),
        intruderSpot: new THREE.Vector3(23.5, 0, -16.4)
      }
    ];

    let vigoMesh = null;
    let chowkidarMesh = null;
    let policeStrobeRed = null;
    let policeStrobeBlue = null;
    const zoneLights = [];
    // 5 Scattered Form-45 props across CCTV camera rooms
    const cctvFormTex = createCctvFormTex();
    const cctvFormMat = [
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ map: cctvFormTex }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 }),
      new THREE.MeshBasicMaterial({ color: 0xede8d0 })
    ];

    function createCctvFormProp(camIdx) {
      const group = new THREE.Group();
      const paperMesh = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.04, 0.68), cctvFormMat);
      paperMesh.rotation.y = ((camIdx * 0.45) % 0.8) - 0.4;
      group.add(paperMesh);

      // Lightweight glowing beacon aura underneath Form-45 (zero dynamic lights, zero shader recompiles, 100% 60 FPS)
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const aura = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.95), auraMat);
      aura.rotation.x = -Math.PI / 2;
      aura.position.set(0, -0.015, 0);
      group.add(aura);

      const hitBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.5), new THREE.MeshBasicMaterial({ visible: false }));
      hitBox.userData.isCctvForm = true;
      hitBox.userData.camIdx = camIdx;
      paperMesh.userData.isCctvForm = true;
      paperMesh.userData.camIdx = camIdx;
      group.add(hitBox);

      group.userData.isCctvForm = true;
      group.userData.camIdx = camIdx;
      group.userData.hitBox = hitBox;
      group.userData.paperMesh = paperMesh;
      group.userData.aura = aura;
      group.visible = false;
      return group;
    }

    const cctvFormProps = [];
    // CAM 01 (Gate): on central asphalt road in wide open gate entryway
    const fProp0 = createCctvFormProp(0);
    fProp0.position.set(0.10, -1.25, 0.90);
    cctvFormProps[0] = fProp0;

    // CAM 02 (Courtyard): on podium reading top / central pedestal in plain sight
    const fProp1 = createCctvFormProp(1);
    fProp1.position.set(0.15, 0.08, 0.22);
    cctvFormProps[1] = fProp1;

    // CAM 03 (Veranda): centered right down the open veranda corridor
    const fProp2 = createCctvFormProp(2);
    fProp2.position.set(0.0, -0.65, 1.5);
    cctvFormProps[2] = fProp2;

    // CAM 04 (Staff Room): on right wing of conference table, 100% clear of all fans and chairs
    const fProp3 = createCctvFormProp(3);
    fProp3.position.set(0.85, -0.76, 0.0);
    cctvFormProps[3] = fProp3;

    // CAM 05 (Left Peek): resting on the exterior lobby ground in camera view
    const fProp4 = createCctvFormProp(4);
    fProp4.position.set(-5.15, 0.03, -1.95);
    fProp4.visible = false;
    scene.add(fProp4);
    cctvFormProps[4] = fProp4;

    // CAM 06 (Right Peek): resting on the exterior yard ground in camera view
    const fProp5 = createCctvFormProp(5);
    fProp5.position.set(5.15, 0.03, -1.95);
    fProp5.visible = false;
    scene.add(fProp5);
    cctvFormProps[5] = fProp5;

    // CAM 07 (Science Lab): on front epoxy laboratory workbench
    const fProp6 = createCctvFormProp(6);
    fProp6.position.set(-1.2, -0.78, 0.2);
    cctvFormProps[6] = fProp6;

    // CAM 08 (Headmaster Office): resting elevated on executive desk blotter
    const fProp7 = createCctvFormProp(7);
    fProp7.position.set(0.15, -0.76, -0.55);
    cctvFormProps[7] = fProp7;

    // CAM 09 (Generator): centered in front of generator platform
    const fProp8 = createCctvFormProp(8);
    fProp8.position.set(0.0, -1.20, -0.2);
    cctvFormProps[8] = fProp8;

    // CAM 10 (Library): on left wing of catalog table, 100% clear of router hitbox and chairs
    const fProp9 = createCctvFormProp(9);
    fProp9.position.set(-0.95, -0.74, 0.15);
    cctvFormProps[9] = fProp9;

    [0, 1, 2, 3, 6, 7, 8, 9].forEach((zoneIdx) => {
      const z = cctvZones[zoneIdx];
      const idx = zoneIdx;
      const zg = new THREE.Group();
      zg.position.copy(z.look);
      if (cctvFormProps[idx]) {
        zg.add(cctvFormProps[idx]);
      }

      if (idx === 0) {
        // ========================================================
        // CAM 01: OUTDOOR MAIN SCHOOL GATE & ASPHALT ROAD
        // ========================================================
        // 1. Wide Tarmac Asphalt Road (y = -1.6 is ground level)
        const road = new THREE.Mesh(new THREE.PlaneGeometry(32, 20), asphaltMat);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, -1.6, 2.0);

        // 2. Yellow & Black Hazard Kerb / Footpath Edge
        const curb = new THREE.Mesh(new THREE.BoxGeometry(32, 0.22, 0.45), curbMat);
        curb.position.set(0, -1.5, -1.8);
        const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(32, 5), floorMat);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.position.set(0, -1.48, -4.2);
        zg.add(road, curb, sidewalk);

        // 3. Two Large Brick/Concrete Gate Pillars (Sutoon)
        const pillarGeo = new THREE.BoxGeometry(0.85, 3.8, 0.85);
        const pillarL = new THREE.Mesh(pillarGeo, gatePillarMat);
        pillarL.position.set(-2.8, 0.35, -2.0);
        const pillarR = new THREE.Mesh(pillarGeo, gatePillarMat);
        pillarR.position.set(2.8, 0.35, -2.0);

        // Concrete pyramid caps and spheres on top of gate pillars
        const capGeo = new THREE.ConeGeometry(0.70, 0.40, 4);
        capGeo.rotateY(Math.PI / 4);
        const capL = new THREE.Mesh(capGeo, darkMetalMat);
        capL.position.set(0, 2.1, 0);
        pillarL.add(capL);
        const capR = capL.clone();
        pillarR.add(capR);
        zg.add(pillarL, pillarR);

        // 4. Pakistani Government School Boundary Walls (Char-Diwari) extending to sides
        const wallGeo = new THREE.BoxGeometry(14, 3.1, 0.4);
        const wallL = new THREE.Mesh(wallGeo, boundaryWallOutdoorMat);
        wallL.position.set(-10.2, 0.0, -2.0);
        const wallR = new THREE.Mesh(wallGeo, boundaryWallOutdoorMat);
        wallR.position.set(10.2, 0.0, -2.0);

        // Security Iron Spikes along top of boundary walls
        for (let sx = -16; sx <= 16; sx += 0.8) {
          if (sx > -3.2 && sx < 3.2) continue; // Leave gate opening clear!
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.32, 4), darkMetalMat);
          spike.position.set(sx, 1.7, -2.0);
          zg.add(spike);
        }
        zg.add(wallL, wallR);

        // 5. Overhead Girder & School Gate Signboard ("GOVT. BOYS HIGH SCHOOL · POLLING STATION NA-47")
        const girder = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 0.22), darkMetalMat);
        girder.position.set(0, 1.95, -2.0);
        girder.userData.lvl1Only = true;
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.95, 0.08), schoolSignMat);
        signBoard.position.set(0, 1.98, -1.94);
        signBoard.userData.lvl1Only = true;
        zg.add(girder, signBoard);

        // Level 2 (NA-128 Lahore): Colonial College Signboard & Canal Road Milestone
        const collegeGirder = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.24, 0.28), darkMetalMat);
        collegeGirder.position.set(0, 1.95, -2.0);
        collegeGirder.userData.lvl2Only = true;
        const collegeSignBoard = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.05, 0.08), collegeSignMat);
        collegeSignBoard.position.set(0, 1.98, -1.94);
        collegeSignBoard.userData.lvl2Only = true;
        zg.add(collegeGirder, collegeSignBoard);

        // Level 3 (NA-241 Karachi): Port of Karachi Terminal 3 Gantry & Signboard
        const portGirder = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.28, 0.32), darkMetalMat);
        portGirder.position.set(0, 2.05, -2.0);
        portGirder.userData.lvl3Only = true;
        const portSignBoard = new THREE.Mesh(new THREE.BoxGeometry(5.4, 1.15, 0.08), khiPortSignMat);
        portSignBoard.position.set(0, 2.08, -1.94);
        portSignBoard.userData.lvl3Only = true;
        zg.add(portGirder, portSignBoard);

        // Marine Bollard & Dock Cargo Pallets (Level 3)
        const dockProps = new THREE.Group();
        dockProps.position.set(-2.2, -1.25, -1.55);
        dockProps.userData.lvl3Only = true;
        const bollardBase = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.45, 12), darkMetalMat);
        bollardBase.position.y = 0.22;
        const bollardCap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.30, 0.18, 12), darkMetalMat);
        bollardCap.position.y = 0.48;
        const dockPallet1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 1.0), palletWoodMat);
        dockPallet1.position.set(4.4, 0.07, 0);
        const dockPallet2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.14, 1.0), palletWoodMat);
        dockPallet2.position.set(4.4, 0.21, 0);
        dockProps.add(bollardBase, bollardCap, dockPallet1, dockPallet2);
        zg.add(dockProps);

        // Canal Road 2 KM Milestone on Sidewalk
        const milestoneGroup = new THREE.Group();
        milestoneGroup.position.set(-2.2, -1.25, -1.55);
        milestoneGroup.userData.lvl2Only = true;
        const stoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.52, 0.22), canalMilestoneMat);
        stoneBody.position.y = 0.26;
        const stoneArch = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.22, 12, 1, false, 0, Math.PI), canalMilestoneMat);
        stoneArch.rotation.z = Math.PI / 2;
        stoneArch.position.set(0, 0.52, 0);
        milestoneGroup.add(stoneBody, stoneArch);
        zg.add(milestoneGroup);

        // 6. Heavy Wrought-Iron School Gate (Lohe Ka Bara Phatak)
        // Left Gate Leaf: slightly ajar into schoolyard (-0.32 rad)
        const gateLeafL = new THREE.Group();
        gateLeafL.position.set(-2.4, -0.42, -2.0);
        gateLeafL.rotation.y = -0.32;
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.25, 0.08), darkMetalMat);
        frameL.position.set(1.18, 0, 0);
        gateLeafL.add(frameL);
        for (let bx = 0.2; bx <= 2.2; bx += 0.24) {
          const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 5), darkMetalMat);
          bar.position.set(bx, 0, 0);
          const spear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), brassMat);
          spear.position.set(bx, 1.18, 0);
          gateLeafL.add(bar, spear);
        }

        // Right Gate Leaf: closed with lock
        const gateLeafR = new THREE.Group();
        gateLeafR.position.set(2.4, -0.42, -2.0);
        gateLeafR.rotation.y = 0.05;
        const frameR = new THREE.Mesh(new THREE.BoxGeometry(2.35, 2.25, 0.08), darkMetalMat);
        frameR.position.set(-1.18, 0, 0);
        gateLeafR.add(frameR);
        for (let bx = -2.2; bx <= -0.2; bx += 0.24) {
          const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 5), darkMetalMat);
          bar.position.set(bx, 0, 0);
          const spear = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.16, 4), brassMat);
          spear.position.set(bx, 1.18, 0);
          gateLeafR.add(bar, spear);
        }
        zg.add(gateLeafL, gateLeafR);

        // 7. Authentic Street Light Pole (Municipal Sodium-Vapor Streetlamp)
        const poleGroup = new THREE.Group();
        poleGroup.position.set(-3.6, -1.6, 0.8);
        const poleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 4.6, 8), darkMetalMat);
        poleBase.position.y = 2.3;
        const poleArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.6, 6), darkMetalMat);
        poleArm.rotation.z = Math.PI / 3;
        poleArm.position.set(0.65, 4.4, 0);
        const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.22, 0.35), darkMetalMat);
        lampHead.position.set(1.4, 4.7, 0);
        const lampLens = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.05, 0.28),
          new THREE.MeshBasicMaterial({ color: 0xfffde0 })
        );
        lampLens.position.set(1.4, 4.58, 0);
        poleGroup.add(poleBase, poleArm, lampHead, lampLens);
        zg.add(poleGroup);

        // Sodium Streetlight PointLight casting warm outdoor amber glow on road & gate
        const streetLight = new THREE.PointLight(0xffaa33, 1.45, 16);
        streetLight.position.set(-2.2, 3.1, 0.8);
        streetLight.layers.enable(0);
        streetLight.layers.enable(1);
        streetLight.userData.zoneIdx = idx;
        streetLight.userData.baseIntensity = 1.45;
        zg.add(streetLight);
        zoneLights.push(streetLight);

        // Phase 2: Security Concertina Razor Wire along top of boundary walls
        for (let wx of [-15.5, -13.5, -11.5, -9.5, -7.5, -5.5, -3.8, 3.8, 5.5, 7.5, 9.5, 11.5, 13.5, 15.5]) {
          const coil = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 5, 10), darkMetalMat);
          coil.rotation.y = Math.PI / 2;
          coil.rotation.z = 0.25;
          coil.position.set(wx, 1.78, -2.0);
          zg.add(coil);
          const barbLine = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.2, 3), darkMetalMat);
          barbLine.rotation.z = Math.PI / 2;
          barbLine.position.set(wx, 1.78, -2.0);
          zg.add(barbLine);
        }


        // 8. Chacha Chowkidar Sentry Thara & Traditional Woven Charpai
        const thara = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 1.6), darkMetalMat);
        thara.position.set(-1.8, -1.48, 0.8);
        zg.add(thara);

        const charpaiGroup = new THREE.Group();
        charpaiGroup.position.set(-1.8, -1.35, 0.8);
        for (const cx of [-0.65, 0.65]) {
          for (const cz of [-0.45, 0.45]) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.45, 6), benchMat);
            leg.position.set(cx, -0.05, cz);
            charpaiGroup.add(leg);
          }
        }
        const cFrameX1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.08), benchMat);
        cFrameX1.position.set(0, 0.16, -0.45);
        const cFrameX2 = cFrameX1.clone();
        cFrameX2.position.z = 0.45;
        const cFrameZ1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.98), benchMat);
        cFrameZ1.position.set(-0.65, 0.16, 0);
        const cFrameZ2 = cFrameZ1.clone();
        cFrameZ2.position.x = 0.65;
        const mattress = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.86), charpaiMat);
        mattress.rotation.x = -Math.PI / 2;
        mattress.position.y = 0.18;
        charpaiGroup.add(cFrameX1, cFrameX2, cFrameZ1, cFrameZ2, mattress);
        zg.add(charpaiGroup);

        // Chai Setup on wooden crate: Quetta Chai steel thermos & tea glass
        const chaiCrate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.42), woodMat);
        chaiCrate.position.set(-0.85, -1.41, 0.8);
        const chaiThermos = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.32, 8), darkMetalMat);
        chaiThermos.position.set(-0.85, -1.16, 0.8);
        const chaiCupMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.03, 0.1, 7),
          new THREE.MeshLambertMaterial({ color: 0x92400e })
        );
        chaiCupMesh.position.set(-0.72, -1.18, 0.8);
        zg.add(chaiCrate, chaiThermos, chaiCupMesh);

        // 9. Black Vigo (Kaala Dala) is outside down the road (Hidden directly; its presence is shown by flashing police strobes!)
        vigoMesh = createLowPolyVigo();
        vigoMesh.visible = false;
        vigoMesh.position.set(6.5, -1.6, 4.0);
        zg.add(vigoMesh);

        // Menacing Police Emergency Strobe Lights glowing outside down the road indicating the Black Vigo's lurking presence
        policeStrobeRed = new THREE.PointLight(0xff1111, 0, 36);
        policeStrobeRed.position.set(4.2, 1.6, 2.5);
        policeStrobeRed.layers.enable(0);
        policeStrobeRed.layers.enable(1);

        policeStrobeBlue = new THREE.PointLight(0x2563eb, 0, 36);
        policeStrobeBlue.position.set(4.2, 1.6, 2.5);
        policeStrobeBlue.layers.enable(0);
        policeStrobeBlue.layers.enable(1);
        zg.add(policeStrobeRed, policeStrobeBlue);

        // 10. Chacha Chowkidar SEATED comfortably on the woven Charpai holding his Quetta Chai cup
        chowkidarMesh = createPS1Humanoid('chowkidar');
        chowkidarMesh.position.set(-1.8, -2.13, 0.72);
        chowkidarMesh.rotation.y = -0.25;
        zg.add(chowkidarMesh);

        // Distant school yard trees behind the gate in the night mist
        for (let tx of [-6, -4, 4, 6]) {
          const treeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 3.2, 5), darkMetalMat);
          treeTrunk.position.set(tx, 0.0, -5.5);
          const treeFoliage = new THREE.Mesh(new THREE.DodecahedronGeometry(1.2, 1), new THREE.MeshLambertMaterial({ color: 0x0c170d }));
          treeFoliage.position.set(tx, 1.8, -5.5);
          zg.add(treeTrunk, treeFoliage);
        }

        // Dedicated zone camera fill light for CCTV
        const camLight = new THREE.PointLight(0x4a6b52, 0.10, 10);
        camLight.position.set(0.0, 2.5, 3.5);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 1) {
        // ========================================================
        // CAM 02: CENTRAL COURTYARD (Open Sky, Assembly Stage, Flag, Rostrum)
        // ========================================================
        // 1. Terracotta Herringbone Brick Courtyard Pavement (Open to night sky - no ceiling!)
        const courtFloor = new THREE.Mesh(new THREE.PlaneGeometry(28, 22), brickHerringboneMat);
        courtFloor.rotation.x = -Math.PI / 2;
        courtFloor.position.set(0, -1.6, 0.5);
        zg.add(courtFloor);

        // 2. Background School Colonnade Wall with Brick Arches (Mihrab arches)
        const colonnadeBack = new THREE.Mesh(new THREE.BoxGeometry(26, 4.4, 0.45), boundaryWallOutdoorMat);
        colonnadeBack.position.set(0, 0.6, -4.5);
        const colonnadeRecess = new THREE.Mesh(new THREE.BoxGeometry(26, 4.0, 0.8), darkMetalMat);
        colonnadeRecess.position.set(0, 0.4, -5.1);
        zg.add(colonnadeBack, colonnadeRecess);

        // 4 Brick Archway Pillars along back wall
        for (const px of [-6.5, -2.2, 2.2, 6.5]) {
          const archPillar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 4.0, 0.6), gatePillarMat);
          archPillar.position.set(px, 0.4, -4.3);
          zg.add(archPillar);
        }
        const archBeam = new THREE.Mesh(new THREE.BoxGeometry(26, 0.5, 0.65), darkMetalMat);
        archBeam.position.set(0, 2.45, -4.3);
        zg.add(archBeam);

        // Side boundary walls enclosing the courtyard
        const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 3.8, 18), boundaryWallOutdoorMat);
        sideWallL.position.set(-11, 0.3, 1.5);
        const sideWallR = sideWallL.clone();
        sideWallR.position.x = 11;
        zg.add(sideWallL, sideWallR);

        // Distant warm corridor sconce glowing in the veranda arch shadow
        const backSconce = createWallSconce();
        backSconce.position.set(-2.2, 1.2, -4.0);
        const backBulb = new THREE.PointLight(0xff7711, 0.35, 6);
        backBulb.position.set(-2.2, 1.3, -3.9);
        backBulb.userData.zoneIdx = idx;
        backBulb.userData.baseIntensity = 0.35;
        zg.add(backSconce, backBulb);
        zoneLights.push(backBulb);

        // 3. Raised Morning Assembly Stage / Chabootra (3-tiered white/green concrete platform - Level 1 Only)
        const stageT1 = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.22, 3.8), whitePlasterMat);
        stageT1.position.set(-0.5, -1.49, 0.0);
        stageT1.userData.lvl1Only = true;
        const stageT2 = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.22, 2.9), whitePlasterMat);
        stageT2.position.set(-0.5, -1.27, 0.0);
        stageT2.userData.lvl1Only = true;
        const stageT3 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 2.0), whitePlasterMat);
        stageT3.position.set(-0.5, -1.05, 0.0);
        stageT3.userData.lvl1Only = true;
        const stageTrim = new THREE.Mesh(new THREE.BoxGeometry(2.48, 0.06, 2.08), darkSarkariGreenMat);
        stageTrim.position.set(-0.5, -0.96, 0.0);
        stageTrim.userData.lvl1Only = true;
        zg.add(stageT1, stageT2, stageT3, stageTrim);

        // 4. Tall Galvanized Steel Flagpole with National Flag of Pakistan (Quaumi Parcham - Level 1 Only)
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 6.2, 8), darkMetalMat);
        pole.position.set(-0.8, 2.15, 0.0);
        pole.userData.lvl1Only = true;
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), brassMat);
        finial.position.set(-0.8, 5.25, 0.0);
        finial.userData.lvl1Only = true;
        const pakFlag = new THREE.Mesh(new THREE.PlaneGeometry(1.65, 0.95), pakistaniFlagMat);
        pakFlag.position.set(0.025, 4.65, 0.0);
        pakFlag.userData.lvl1Only = true;
        zg.add(pole, finial, pakFlag);

        // 5. Morning Assembly Wooden Rostrum / Podium (Lakri Ka Rostrum - Level 1 Only)
        const rostrumGroup = new THREE.Group();
        rostrumGroup.position.set(0.15, -0.94, 0.2);
        rostrumGroup.userData.lvl1Only = true;
        const rosBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.95, 0.5), woodMat);
        rosBody.position.set(0, 0.47, 0);
        const rosTop = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.55), woodMat);
        rosTop.rotation.x = 0.25;
        rosTop.position.set(0, 0.98, 0.02);
        const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 5), darkMetalMat);
        micStem.position.set(0, 1.15, 0.08);
        micStem.rotation.x = -0.3;
        const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), darkMetalMat);
        micHead.position.set(0, 1.28, 0.02);
        const rosEmblem = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), pakistaniFlagMat);
        rosEmblem.position.set(0, 0.55, 0.26);
        rostrumGroup.add(rosBody, rosTop, micStem, micHead, rosEmblem);
        zg.add(rostrumGroup);

        // 6. Loudspeaker Horn on Steel Pole (School P.A. System Bhonpu - Level 1 Only)
        const speakerPole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.8, 6), darkMetalMat);
        speakerPole.position.set(1.4, 0.3, 0.0);
        speakerPole.userData.lvl1Only = true;
        const speakerHorn = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 8, 1, true), darkMetalMat);
        speakerHorn.rotation.x = -Math.PI / 2 + 0.2;
        speakerHorn.position.set(1.4, 2.1, 0.28);
        speakerHorn.userData.lvl1Only = true;
        const speakerDriver = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), darkMetalMat);
        speakerDriver.position.set(1.4, 2.1, -0.05);
        speakerDriver.userData.lvl1Only = true;
        zg.add(speakerPole, speakerHorn, speakerDriver);

        // ========================================================
        // LEVEL 2 (NA-128 LAHORE): HISTORIC QUADRANGLE FOUNTAIN & LAWN
        // ========================================================
        const fountainGroup = new THREE.Group();
        fountainGroup.position.set(-0.2, -1.6, 0.0);
        fountainGroup.userData.lvl2Only = true;

        // Outer Octagonal Basin Wall
        const fBasin = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.48, 8), fountainStoneMat);
        fBasin.position.y = 0.24;
        // Water Surface
        const fWater = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.05, 0.04, 8), fountainWaterMat);
        fWater.position.y = 0.42;
        // Center Pedestal Column
        const fPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 1.15, 8), fountainStoneMat);
        fPedestal.position.y = 0.82;
        // Upper Water Tier Bowl
        const fUpperBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.10, 0.65, 0.30, 8), fountainStoneMat);
        fUpperBowl.position.y = 1.45;
        // Spire & Finial Spout
        const fSpire = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.65, 8), fountainStoneMat);
        fSpire.position.y = 1.92;
        fountainGroup.add(fBasin, fWater, fPedestal, fUpperBowl, fSpire);
        zg.add(fountainGroup);

        // Manicured Quadrangle Lawn Parterres (Level 2 Only)
        const lawnL = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.06, 5.8), lawnGrassMat);
        lawnL.position.set(-4.8, -1.57, 0.0);
        lawnL.userData.lvl2Only = true;
        const lawnR = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.06, 5.8), lawnGrassMat);
        lawnR.position.set(4.4, -1.57, 0.0);
        lawnR.userData.lvl2Only = true;
        zg.add(lawnL, lawnR);

        // College Quadrangle Noticeboard (Level 2 Only)
        const collegeBoard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 2.2), collegeNoticeMat);
        collegeBoard.position.set(-2.4, 0.45, -4.0);
        collegeBoard.userData.lvl2Only = true;
        zg.add(collegeBoard);

        // ========================================================
        // LEVEL 3 (NA-241 KARACHI): INDUSTRIAL SHIPPING CONTAINERS & PALLET STACKS
        // ========================================================
        const warehouseCargoGroup = new THREE.Group();
        warehouseCargoGroup.position.set(0, -1.6, 0);
        warehouseCargoGroup.userData.lvl3Only = true;

        // 1. Blue 20ft Intermodal Container on Left
        const containerL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 5.4), containerBlueMat);
        containerL.position.set(-3.2, 1.2, -1.0);
        const cLBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 8), darkMetalMat);
        cLBar1.position.set(-2.2, 1.2, 1.72);
        const cLBar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 8), darkMetalMat);
        cLBar2.position.set(-2.0, 1.2, 1.72);

        // 2. Rust-Orange 20ft Intermodal Container on Right
        const containerR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 5.4), containerRustMat);
        containerR.position.set(3.4, 1.2, -0.6);
        const cRBar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.3, 8), darkMetalMat);
        cRBar1.position.set(2.4, 1.2, 2.12);

        // 3. Stacks of Wooden Pallets with Karachi Ballot Archive Cartons
        const palletStack = new THREE.Group();
        palletStack.position.set(-0.2, 0, -2.4);
        for (let py = 0; py < 3; py++) {
          const pal = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.14, 1.2), palletWoodMat);
          pal.position.set(0, py * 0.44, 0);
          const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.30, 1.0), benchMat);
          box.position.set(0, py * 0.44 + 0.22, 0);
          palletStack.add(pal, box);
        }

        // 4. Yellow Industrial Hand Pallet Jack (Forklift Truck)
        const jackGroup = new THREE.Group();
        jackGroup.position.set(0.6, 0, 1.2);
        jackGroup.rotation.y = -0.4;
        const jackBody = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.65, 0.4), steelSafetyOrangeMat);
        jackBody.position.y = 0.35;
        const forkL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 1.2), steelSafetyOrangeMat);
        forkL.position.set(-0.14, 0.08, -0.6);
        const forkR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 1.2), steelSafetyOrangeMat);
        forkR.position.set(0.14, 0.08, -0.6);
        const jackHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85, 6), darkMetalMat);
        jackHandle.position.set(0, 0.8, 0.15);
        jackHandle.rotation.x = 0.35;
        jackGroup.add(jackBody, forkL, forkR, jackHandle);

        warehouseCargoGroup.add(containerL, cLBar1, cLBar2, containerR, cRBar1, palletStack, jackGroup);
        zg.add(warehouseCargoGroup);

        // 7. Traditional Wooden School Bench along the Courtyard Walkway
        const courtBench = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.72, 0.65), benchMat);
        courtBench.position.set(-2.4, -1.24, 1.2);
        courtBench.rotation.y = 0.28;
        zg.add(courtBench);

        // Phase 2: Overturned Wooden School Chairs in the courtyard
        function createOverturnedChair(x, y, z, rotX, rotY, rotZ) {
          const chairGroup = new THREE.Group();
          chairGroup.position.set(x, y, z);
          chairGroup.rotation.set(rotX, rotY, rotZ);
          const seat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.04, 0.46), benchMat);
          seat.position.y = 0.44;
          chairGroup.add(seat);
          for (let lx of [-0.2, 0.2]) {
            for (let lz of [-0.19, 0.19]) {
              const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.44, 4), darkMetalMat);
              leg.position.set(lx, 0.22, lz);
              chairGroup.add(leg);
            }
          }
          for (let bx of [-0.18, 0.18]) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.46, 4), darkMetalMat);
            post.position.set(bx, 0.67, -0.19);
            chairGroup.add(post);
          }
          const slat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.03), benchMat);
          slat.position.set(0, 0.76, -0.19);
          chairGroup.add(slat);
          return chairGroup;
        }
        const courtChair1 = createOverturnedChair(-1.6, -1.38, 0.4, 0.2, 0.45, Math.PI / 2 - 0.2);
        const courtChair2 = createOverturnedChair(1.8, -1.42, 1.2, -Math.PI / 2 + 0.35, 0.2, 0.8);
        zg.add(courtChair1, courtChair2);

        // Phase 2: Scattered Electoral Ballot Papers / Form Slips on the flagstones
        const ballotPaperGeo = new THREE.PlaneGeometry(0.26, 0.36);
        const ballotPaperMat = new THREE.MeshLambertMaterial({
          color: 0xe2e8f0,
          side: THREE.DoubleSide
        });
        for (const [px, pz, ry] of [
          [-1.1, 0.7, 0.6],
          [-0.4, 1.4, -0.4],
          [0.8, 0.9, 1.2],
          [1.4, 0.2, -0.8],
          [-2.0, 1.6, 0.25],
          [0.3, 1.8, 2.1]
        ]) {
          const paper = new THREE.Mesh(ballotPaperGeo, ballotPaperMat);
          paper.rotation.x = -Math.PI / 2;
          paper.rotation.z = ry;
          paper.position.set(px, -1.48, pz);
          zg.add(paper);
        }

        // Phase 2: Dark Colonnade Shadow Recesses (Void pockets under the veranda arches)
        for (let ax of [-8.5, -4.5, -0.5, 3.5, 7.5]) {
          const archShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(2.4, 3.8),
            new THREE.MeshBasicMaterial({ color: 0x010302 })
          );
          archShadow.position.set(ax, 0.5, -4.72);
          zg.add(archShadow);
        }

        // 8. Lighting: Municipal Sodium Lamp & Dedicated CCTV Cam Fill
        const courtLamp = new THREE.PointLight(0xff9922, 0.85, 13);
        courtLamp.position.set(-3.2, 2.5, 2.2);
        courtLamp.layers.enable(0);
        courtLamp.layers.enable(1);
        courtLamp.userData.zoneIdx = idx;
        courtLamp.userData.baseIntensity = 0.85;
        zg.add(courtLamp);
        zoneLights.push(courtLamp);

        const camLight = new THREE.PointLight(0x4a6b52, 0.10, 10);
        camLight.position.set(0, 2.4, 4.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 2) {
        // ========================================================
        // CAM 03: PILLARED VERANDA (Classroom Doors, Brick Pillars, Notice Board, Water Cooler)
        // ========================================================
        // 1. Veranda Floor & Concrete Roof Slab
        const verFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 20), floorMat);
        verFloor.rotation.x = -Math.PI / 2;
        verFloor.position.set(0, -1.65, 0);
        const verCeil = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 20), ceilingMat);
        verCeil.position.set(0, 2.45, 0);
        zg.add(verFloor, verCeil);

        // Overhead Concrete Cross-Beams
        for (const bz of [-6, -2, 2, 6]) {
          const beam = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.28, 0.35), darkMetalMat);
          beam.position.set(0, 2.22, bz);
          zg.add(beam);
        }

        // Far End Wall (z = -7.0)
        const endWall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 4.2, 0.35), wallMat);
        endWall.position.set(0, 0.45, -7.0);
        zg.add(endWall);

        // 2. Inner Classroom Wall (Right side, x = +1.1)
        const inWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 20), wallMat);
        inWall.position.set(1.1, 0.45, 0);
        zg.add(inWall);

        // Two Sarkari Classroom Doors ("CLASS 9-A", "CLASS 10-B") with Iron Frame Transoms
        const doorMat = new THREE.MeshLambertMaterial({ map: createSarkariDoorTex() });
        const door1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 1.4), doorMat);
        door1.position.set(0.95, -0.35, 1.2);
        const trans1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 1.4), darkMetalMat);
        trans1.position.set(0.95, 1.3, 1.2);

        const door2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 1.4), doorMat);
        door2.position.set(0.95, -0.35, -5.0);
        const trans2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 1.4), darkMetalMat);
        trans2.position.set(0.95, 1.3, -5.0);
        zg.add(door1, trans1, door2, trans2);

        // Pinned Wooden Notice Board ("DATE SHEET", "ECP NOTICE NA-47", "DENGUE SOPs" - Level 1)
        const noticeBoard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 2.4), noticeBoardMat);
        noticeBoard.position.set(0.95, 0.55, -0.5);
        noticeBoard.userData.lvl1Only = true;
        zg.add(noticeBoard);

        // Electric School Gong / Brass Bell (Level 1)
        const gongBell = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 10), brassMat);
        gongBell.rotation.z = Math.PI / 2;
        gongBell.position.set(0.95, 1.4, 2.8);
        gongBell.userData.lvl1Only = true;
        const gongBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.16), darkMetalMat);
        gongBox.position.set(0.95, 1.55, 2.8);
        gongBox.userData.lvl1Only = true;
        zg.add(gongBell, gongBox);

        // 3. Outer Colonnade (Left side, x = -1.6) looking out into dark courtyard
        for (const pz of [-5.0, -1.6, 1.8, 5.2]) {
          const colPillar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 4.1, 0.65), gatePillarMat);
          colPillar.position.set(-1.6, 0.4, pz);
          zg.add(colPillar);
        }

        // Low Decorative Iron Security Railing (Jangla) between pillars
        for (const rz of [-3.3, 0.1, 3.5]) {
          const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 2.2), darkMetalMat);
          rail.position.set(-1.6, -1.22, rz);
          zg.add(rail);
          for (let bz = -0.9; bz <= 0.9; bz += 0.3) {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.82, 5), darkMetalMat);
            bar.position.set(-1.6, -1.22, rz + bz);
            zg.add(bar);
          }
        }

        // 4. Stainless Steel Electric Water Cooler ("THANDA PAANI" - Level 1 Only)
        const coolerThara = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.42, 0.75), whitePlasterMat);
        coolerThara.position.set(0.85, -1.44, -3.0);
        coolerThara.userData.lvl1Only = true;
        const coolerBody = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.4, 0.52), waterCoolerMat);
        coolerBody.position.set(0.85, -0.53, -3.0);
        coolerBody.userData.lvl1Only = true;
        const coolerDrain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 6), darkMetalMat);
        coolerDrain.position.set(0.65, -1.4, -3.0);
        coolerDrain.userData.lvl1Only = true;

        // Water cooler push-tap faucet
        const coolerTap = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.16, 6), brassMat);
        coolerTap.rotation.z = Math.PI / 2;
        coolerTap.position.set(0.48, -0.50, -3.0);
        coolerTap.userData.lvl1Only = true;
        const tapNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.010, 0.08, 5), brassMat);
        tapNozzle.position.set(0.40, -0.54, -3.0);
        tapNozzle.userData.lvl1Only = true;
        zg.add(coolerThara, coolerBody, coolerDrain, coolerTap, tapNozzle);

        // Phase 2: Damp Water Stain on Veranda Floor beneath the Electric Cooler
        const waterPuddle = new THREE.Mesh(
          new THREE.CircleGeometry(0.55, 8),
          new THREE.MeshBasicMaterial({
            color: 0x040b07,
            transparent: true,
            opacity: 0.8
          })
        );
        waterPuddle.rotation.x = -Math.PI / 2;
        waterPuddle.position.set(0.48, -1.64, -3.0);
        waterPuddle.userData.lvl1Only = true;
        zg.add(waterPuddle);

        // Phase 2: Visual Water Drip Droplet & Floor Ripple Animation (No sound)
        const dripGeo = new THREE.SphereGeometry(0.024, 6, 6);
        dripGeo.scale(0.8, 1.8, 0.8);
        const coolerDrip = new THREE.Mesh(dripGeo, new THREE.MeshBasicMaterial({
          color: 0x99ffcc,
          transparent: true,
          opacity: 0.9
        }));
        coolerDrip.position.set(0.40, -0.55, -3.0);
        coolerDrip.userData.lvl1Only = true;

        const rippleGeo = new THREE.RingGeometry(0.03, 0.07, 12);
        rippleGeo.rotateX(-Math.PI / 2);
        const coolerRipple = new THREE.Mesh(rippleGeo, new THREE.MeshBasicMaterial({
          color: 0x77eeaa,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide
        }));
        coolerRipple.position.set(0.40, -1.63, -3.0);
        coolerRipple.userData.lvl1Only = true;
        zg.add(coolerDrip, coolerRipple);

        z.coolerDrip = coolerDrip;
        z.coolerRipple = coolerRipple;

        // 5. Heavy Wooden Corridor Bench (Takhta Bench) along wall
        const verBench = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.72, 2.4), benchMat);
        verBench.position.set(0.85, -1.29, 3.8);
        zg.add(verBench);

        // Elevated Polling Desk in Veranda Corridor (Houses Form-45 in plain sight)
        const verDesk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.72, 0.85), benchMat);
        verDesk.position.set(0.0, -1.05, 1.5);
        zg.add(verDesk);

        // 6. Fire Bucket Stand ("AAG" Baaltiyan - Level 1 Only)
        const fRack = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.6), darkMetalMat);
        fRack.position.set(2.22, 0.45, -5.8);
        fRack.userData.lvl1Only = true;
        zg.add(fRack);
        for (const fz of [-0.45, 0.45]) {
          const fBucket = new THREE.Mesh(
            new THREE.ConeGeometry(0.14, 0.28, 7),
            new THREE.MeshLambertMaterial({ color: 0xdc2626 })
          );
          fBucket.position.set(2.14, 0.25, -5.8 + fz);
          fBucket.userData.lvl1Only = true;
          zg.add(fBucket);
        }

        // ========================================================
        // LEVEL 2 (NA-128 LAHORE): COLONIAL CLOISTERS & COLLEGE BELL
        // ========================================================
        const bellGroup = new THREE.Group();
        bellGroup.position.set(0.2, 1.6, -1.8);
        bellGroup.userData.lvl2Only = true;

        // Heavy Cast-Iron Yoke & Crossbeam Bracket
        const bellYoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.75), darkMetalMat);
        bellYoke.position.y = 0.55;
        // Large Flared Brass College Bell
        const cBell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.38, 0.52, 12, 1, true), brassMat);
        cBell.position.y = 0.24;
        const cBellTop = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), brassMat);
        cBellTop.position.y = 0.48;
        // Hanging Pull Rope
        const bellRope = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.8, 6), whitePlasterMat);
        bellRope.position.set(0, -0.65, 0.15);
        bellGroup.add(bellYoke, cBell, cBellTop, bellRope);
        zg.add(bellGroup);

        // Colonial Arched Cloister Vault Trusses along Ceiling (Level 2)
        for (const az of [-5.2, -1.8, 1.8, 5.2]) {
          const archRib = new THREE.Mesh(
            new THREE.TorusGeometry(1.5, 0.09, 4, 12, Math.PI),
            boundaryWallOutdoorMat
          );
          archRib.rotation.y = Math.PI / 2;
          archRib.position.set(-0.25, 1.15, az);
          archRib.userData.lvl2Only = true;
          zg.add(archRib);
        }

        // Vintage Wooden Student Cubby / Pigeonhole Lockers (Level 2)
        const lockerUnit = new THREE.Mesh(new THREE.BoxGeometry(0.48, 2.4, 2.8), richMahoganyMat);
        lockerUnit.position.set(0.85, -0.45, -3.2);
        lockerUnit.userData.lvl2Only = true;
        zg.add(lockerUnit);

        // Multi-Tier Heavy Industrial Steel Pallet Racking (Level 3 Only)
        const palletRackGroup = new THREE.Group();
        palletRackGroup.position.set(0.85, -0.45, -2.5);
        palletRackGroup.userData.lvl3Only = true;
        // Orange vertical upright frames
        for (const rx of [-0.25, 0.25]) {
          for (const rz of [-1.5, 0, 1.5]) {
            const upright = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.6, 0.08), steelSafetyOrangeMat);
            upright.position.set(rx, 0.2, rz);
            palletRackGroup.add(upright);
          }
        }
        // Blue horizontal crossbeams & crates
        for (const by of [-0.6, 0.3, 1.2]) {
          const beam1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 3.1), containerBlueMat);
          beam1.position.set(0, by, 0);
          palletRackGroup.add(beam1);
          const pCarton = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.8), benchMat);
          pCarton.position.set(0, by + 0.25, 0);
          palletRackGroup.add(pCarton);
        }
        zg.add(palletRackGroup);

        // 7. Suspended Fluorescent Tube Lights & Eerie Sickly Greenish Glow
        const tubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.8, 6);
        tubeGeo.rotateZ(Math.PI / 2);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const tube1 = new THREE.Mesh(tubeGeo, tubeMat);
        tube1.position.set(0, 2.2, -1.5);
        const tube2 = tube1.clone();
        tube2.position.z = 2.5;
        zg.add(tube1, tube2);

        const flLight = new THREE.PointLight(0x6ee7b7, 0.65, 9.5);
        flLight.position.set(0, 2.0, 0.5);
        flLight.layers.enable(0);
        flLight.layers.enable(1);
        flLight.userData.zoneIdx = idx;
        flLight.userData.baseIntensity = 0.65;
        zg.add(flLight);
        zoneLights.push(flLight);

        const camLight = new THREE.PointLight(0x4a6b52, 0.10, 10);
        camLight.position.set(0, 2.2, 4.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 3) {
        // ========================================================
        // CAM 04: STAFF ROOM (Meeting Table, Quaid Portrait, Steel Almirahs, Duty Roster)
        // ========================================================
        // 1. Room Floor, Ceiling & Walls
        const staffFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 12), floorMat);
        staffFloor.rotation.x = -Math.PI / 2;
        staffFloor.position.set(0, -1.65, 0);
        const staffCeil = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 12), ceilingMat);
        staffCeil.rotation.x = Math.PI / 2;
        staffCeil.position.set(0, 2.45, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(6.8, 4.2, 0.35), wallMat);
        backWall.position.set(0, 0.45, -5.0);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        leftWall.position.set(-2.8, 0.45, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        rightWall.position.set(2.8, 0.45, 0);
        zg.add(staffFloor, staffCeil, backWall, leftWall, rightWall);

        // Phase 3: Ceiling Fan with Animated Rotating Blades
        const sfan = new THREE.Group();
        sfan.position.set(0, 2.1, -0.6);
        const srod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 6), darkMetalMat);
        srod.position.y = 0.25;
        const sfanBlades = new THREE.Group();
        const shub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8), darkMetalMat);
        sfanBlades.add(shub);
        for (let i = 0; i < 3; i++) {
          const bl = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.22), darkMetalMat);
          bl.rotation.y = (i * Math.PI * 2) / 3;
          bl.translateX(0.7);
          sfanBlades.add(bl);
        }
        sfan.add(srod, sfanBlades);
        zg.add(sfan);
        z.staffFanBlades = sfanBlades;

        // 2. Large Central Conference Table (Teachers' Meeting Desk - Level 1 Only)
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.12, 1.8), woodMat);
        tableTop.position.set(0, -0.92, -0.6);
        tableTop.userData.lvl1Only = true;
        zg.add(tableTop);
        for (const tx of [-1.35, 1.35]) {
          for (const tz of [-0.7, 0.7]) {
            const tleg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.73, 0.12), woodMat);
            tleg.position.set(tx, -1.28, -0.6 + tz);
            tleg.userData.lvl1Only = true;
            zg.add(tleg);
          }
        }

        // Green Felt Desk Blotter & Election Files (Level 1)
        const blotter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.02, 1.0), darkSarkariGreenMat);
        blotter.position.set(0, -0.85, -0.6);
        blotter.userData.lvl1Only = true;
        const file1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.09, 0.34), woodMat);
        file1.position.set(-0.6, -0.80, -0.7);
        file1.rotation.y = 0.15;
        file1.userData.lvl1Only = true;
        const file2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.46, 0.07, 0.32),
          new THREE.MeshLambertMaterial({ color: 0xb45309 })
        );
        file2.position.set(0.55, -0.81, -0.5);
        file2.rotation.y = -0.22;
        file2.userData.lvl1Only = true;
        const stampPad = new THREE.Mesh(
          new THREE.BoxGeometry(0.18, 0.03, 0.24),
          new THREE.MeshLambertMaterial({ color: 0x1e3a8a })
        );
        stampPad.position.set(0.05, -0.83, -0.7);
        stampPad.userData.lvl1Only = true;
        zg.add(blotter, file1, file2, stampPad);

        // Wooden Teacher Chairs around Table (Level 1)
        for (const cx of [-1.65, 1.65]) {
          for (const cz of [-0.4, 0.4]) {
            const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.52), benchMat);
            chairSeat.position.set(cx, -1.18, -0.6 + cz);
            chairSeat.userData.lvl1Only = true;
            const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.52), benchMat);
            chairBack.position.set(cx + (cx < 0 ? -0.22 : 0.22), -0.85, -0.6 + cz);
            chairBack.userData.lvl1Only = true;
            zg.add(chairSeat, chairBack);
          }
        }

        // 3. Back Wall: Quaid-e-Azam Portrait, NBP Calendar & Wall Clock (Level 1)
        const quaidFrame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.72, 0.08), quaidPortraitBWMat);
        quaidFrame.position.set(0, 0.95, -4.8);
        quaidFrame.userData.lvl1Only = true;
        const cal = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 1.2, 0.04),
          new THREE.MeshLambertMaterial({ color: 0xf8fafc })
        );
        cal.position.set(-1.8, 0.65, -4.8);
        cal.userData.lvl1Only = true;
        const calHead = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.35, 0.05),
          new THREE.MeshLambertMaterial({ color: 0x15803d })
        );
        calHead.position.set(-1.8, 1.08, -4.79);
        calHead.userData.lvl1Only = true;
        const clock = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 12), whitePlasterMat);
        clock.rotation.x = Math.PI / 2;
        clock.position.set(1.8, 1.25, -4.8);
        clock.userData.lvl1Only = true;
        zg.add(quaidFrame, cal, calHead, clock);

        // Phase 3: Left Wall - One Closed Steel Almirah (Level 1)
        const alm2 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.7, 1.3), almirahMat);
        alm2.position.set(-2.4, -0.3, -0.5);
        alm2.userData.lvl1Only = true;
        zg.add(alm2);

        // Open Steel Almirah with Shadowy Shelves (Level 1)
        const openAlmGroup = new THREE.Group();
        openAlmGroup.position.set(-2.4, -0.3, -2.4);
        openAlmGroup.userData.lvl1Only = true;
        const almBack = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.7, 1.3), almirahMat);
        almBack.position.set(-0.31, 0, 0);
        const almTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 1.3), almirahMat);
        almTop.position.set(0, 1.32, 0);
        const almBot = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 1.3), almirahMat);
        almBot.position.set(0, -1.32, 0);
        const almSide1 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.7, 0.05), almirahMat);
        almSide1.position.set(0, 0, -0.62);
        const almSide2 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.7, 0.05), almirahMat);
        almSide2.position.set(0, 0, 0.62);
        const almVoid = new THREE.Mesh(
          new THREE.BoxGeometry(0.58, 2.6, 1.2),
          new THREE.MeshBasicMaterial({ color: 0x020503 })
        );
        almVoid.position.set(-0.02, 0, 0);
        for (const sy of [-0.65, 0.0, 0.65]) {
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.03, 1.2), darkMetalMat);
          shelf.position.set(0, sy, 0);
          openAlmGroup.add(shelf);
        }
        for (const [bx, bz, bcol] of [[-0.05, -0.35, 0xb45309], [-0.05, -0.05, 0x1e3a8a], [-0.05, 0.25, 0x15803d]]) {
          const bundle = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.28, 0.24),
            new THREE.MeshLambertMaterial({ color: bcol })
          );
          bundle.position.set(bx, 0.16, bz);
          const ribbon = new THREE.Mesh(
            new THREE.BoxGeometry(0.44, 0.04, 0.26),
            new THREE.MeshBasicMaterial({ color: 0xdc2626 })
          );
          ribbon.position.set(bx, 0.16, bz);
          openAlmGroup.add(bundle, ribbon);
        }
        const openDoor = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.6, 0.62), almirahMat);
        openDoor.position.set(0.32, 0, 0.35);
        openDoor.rotation.y = 0.55;
        openAlmGroup.add(almBack, almTop, almBot, almSide1, almSide2, almVoid, openDoor);
        zg.add(openAlmGroup);

        // Phase 3: Stacked Government Steel Ballot Boxes (Level 1)
        for (let i = 0; i < 2; i++) {
          const boxGroup = new THREE.Group();
          boxGroup.position.set(-2.0, -1.35 + i * 0.44, -4.3);
          boxGroup.rotation.y = (i === 1) ? 0.18 : -0.05;
          boxGroup.userData.lvl1Only = true;
          const boxBody = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.40, 0.55), darkSarkariGreenMat);
          const boxLid = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.59), darkMetalMat);
          boxLid.position.y = 0.22;
          const boxLatch = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.10, 0.03), brassMat);
          boxLatch.position.set(0, 0.16, 0.29);
          boxGroup.add(boxBody, boxLid, boxLatch);
          zg.add(boxGroup);
        }

        // ========================================================
        // LEVEL 2 (NA-128 LAHORE): TIERED LECTURE AMPHITHEATER
        // ========================================================
        const amphGroup = new THREE.Group();
        amphGroup.userData.lvl2Only = true;

        // 3 Descending Tiered Seating Platforms with Oak Desks & Benches
        for (let t = 0; t < 3; t++) {
          const tierY = -1.50 + t * 0.35;
          const tierZ = 2.5 - t * 1.8;
          // Tier Platform Step
          const stepRiser = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 1.8), floorMat);
          stepRiser.position.set(0, tierY - 0.175, tierZ);
          // Long Curved Oak Lecture Desk
          const deskR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.08, 0.42), benchMat);
          deskR.position.set(0, tierY + 0.32, tierZ - 0.35);
          // Student Bench
          const seatR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.06, 0.32), benchMat);
          seatR.position.set(0, tierY + 0.12, tierZ + 0.30);
          amphGroup.add(stepRiser, deskR, seatR);
        }

        // Professor's Elevated Lecture Rostrum at Front
        const profRostrum = new THREE.Group();
        profRostrum.position.set(0.6, -1.65, -3.2);
        const pRBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.15, 0.65), richMahoganyMat);
        pRBody.position.y = 0.58;
        const pRTop = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.06, 0.72), richMahoganyMat);
        pRTop.rotation.x = 0.22;
        pRTop.position.set(0, 1.18, 0.02);
        // Brass Gooseneck Lamp
        const rLampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 6), brassMat);
        rLampStem.position.set(0.28, 1.32, 0);
        const rLampHood = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.08), brassMat);
        rLampHood.position.set(0.28, 1.48, 0);
        profRostrum.add(pRBody, pRTop, rLampStem, rLampHood);
        amphGroup.add(profRostrum);

        // Giant Lecture Hall Green Chalkboard (1973 Constitution)
        const amphBoard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 1.95, 0.08), lectureChalkboardMat);
        amphBoard.position.set(0, 0.85, -4.85);
        amphGroup.add(amphBoard);

        // Free-Standing Pakistan Silk Flag on Brass Pole
        const amphFlagGroup = new THREE.Group();
        amphFlagGroup.position.set(-1.8, -1.65, -3.5);
        const aFlagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 3.2, 6), brassMat);
        aFlagPole.position.y = 1.6;
        const aFinial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), brassMat);
        aFinial.position.y = 3.22;
        const aFlagCloth = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), pakistaniFlagMat);
        aFlagCloth.position.set(0.62, 2.75, 0);
        amphFlagGroup.add(aFlagPole, aFinial, aFlagCloth);
        amphGroup.add(amphFlagGroup);

        zg.add(amphGroup);

        // Level 3 (NA-241 Karachi): Customs Clearance Bay & Platform Scale
        const customsBayGroup = new THREE.Group();
        customsBayGroup.position.set(0, -1.65, -2.5);
        customsBayGroup.userData.lvl3Only = true;

        // Heavy Floor Platform Scale for Weighing Ballot Sacks
        const scaleBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.4), industrialScaleMat);
        scaleBase.position.set(-1.8, 0.06, 0);
        const scalePillar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 8), darkMetalMat);
        scalePillar.position.set(-2.4, 0.65, -0.6);
        const scaleDial = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.12), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
        scaleDial.position.set(-2.4, 1.35, -0.6);
        customsBayGroup.add(scaleBase, scalePillar, scaleDial);

        // Inspection Workbench with Customs Roster Board & Burlap Sacks
        const cDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 1.0), darkMetalMat);
        cDesk.position.set(0.8, 0.42, 0);
        const cRoster = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.2, 1.8), customsRosterMat);
        cRoster.position.set(2.45, 1.5, 0);
        customsBayGroup.add(cDesk, cRoster);

        // Burlap Ballot Sacks on Platform Scale
        for (let si = 0; si < 3; si++) {
          const sack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.65), lightWoodMat);
          sack.position.set(-1.8 + (si % 2) * 0.4 - 0.2, 0.25 + Math.floor(si / 2) * 0.32, (si % 2) * 0.2);
          customsBayGroup.add(sack);
        }
        zg.add(customsBayGroup);

        // 5. Right Wall: Babu's Corner Stationery Desk & Telephone + Duty Roster Board
        const bDesk = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.82, 0.75), woodMat);
        bDesk.position.set(2.0, -1.24, -2.2);
        const bPhone = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.22), darkMetalMat);
        bPhone.position.set(2.0, -0.75, -2.2);
        const bTeaCup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.03, 0.09, 6),
          new THREE.MeshLambertMaterial({ color: 0xfef08a })
        );
        bTeaCup.position.set(1.7, -0.77, -2.1);
        const roster = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.3, 1.8), darkSarkariGreenMat);
        roster.position.set(2.65, 0.5, 0.6);
        zg.add(bDesk, bPhone, bTeaCup, roster);

        // 6. Lighting: Table Overhead Light (Cone removed so ceiling fan is unobstructed) & Dedicated CCTV Cam Fill
        const tableBulbMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.065, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xfff0aa })
        );
        tableBulbMesh.position.set(0, 2.2, -0.6);
        const tableBulb = new THREE.PointLight(0xffa834, 0.85, 7.5);
        tableBulb.position.set(0, 2.1, -0.6);
        tableBulb.layers.enable(0);
        tableBulb.layers.enable(1);
        tableBulb.userData.zoneIdx = idx;
        tableBulb.userData.baseIntensity = 0.85;
        zg.add(tableBulbMesh, tableBulb);
        zoneLights.push(tableBulb);

        const camLight = new THREE.PointLight(0x4a6b52, 0.10, 10);
        camLight.position.set(0, 2.2, 4.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 6) {
        // ========================================================
        // CAM 07: SCIENCE LAB (Biology Benches, Glassware, Anatomy Chart, Chemical Flasks)
        // ========================================================
        // 1. Room Shell (Floor, Ceiling, Walls)
        const labFloor = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), floorMat);
        labFloor.rotation.x = -Math.PI / 2;
        labFloor.position.set(0, -1.65, 0);
        const labCeil = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), ceilingMat);
        labCeil.rotation.x = Math.PI / 2;
        labCeil.position.set(0, 2.45, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 0.35), wallMat);
        backWall.position.set(0, 0.45, -5.0);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        leftWall.position.set(-3.0, 0.45, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        rightWall.position.set(3.0, 0.45, 0);
        zg.add(labFloor, labCeil, backWall, leftWall, rightWall);

        // 2. Science Lab Workbenches with Black Epoxy Tops & Sinks
        for (const bx of [-1.2, 1.2]) {
          const bTop = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.12, 3.8),
            new THREE.MeshLambertMaterial({ color: 0x0f172a })
          );
          bTop.position.set(bx, -0.92, -0.6);
          const bBase = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.68, 3.6), woodMat);
          bBase.position.set(bx, -1.32, -0.6);
          zg.add(bTop, bBase);

          // Lab Sink & Gooseneck Faucet on bench
          const sink = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.14, 0.52), darkMetalMat);
          sink.position.set(bx, -0.88, -1.8);
          const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 6), darkMetalMat);
          faucet.position.set(bx, -0.68, -1.95);
          zg.add(sink, faucet);

          // Test Tube Racks with colorful reagent tubes
          for (let ti = -0.5; ti <= 0.5; ti += 0.5) {
            const rack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.35), woodMat);
            rack.position.set(bx + 0.3, -0.80, ti);
            zg.add(rack);
            for (let tj = -0.12; tj <= 0.12; tj += 0.08) {
              const tubeMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(0.014, 0.014, 0.16, 6),
                new THREE.MeshBasicMaterial({ color: Math.random() < 0.5 ? 0x06b6d4 : 0x10b981 })
              );
              tubeMesh.position.set(bx + 0.3, -0.73, ti + tj);
              zg.add(tubeMesh);
            }
          }

          // Glass Flasks & Beakers with chemical solutions
          const flask1 = new THREE.Mesh(
            new THREE.ConeGeometry(0.10, 0.22, 7),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
          );
          flask1.position.set(bx - 0.35, -0.78, 0.6);
          const flask2 = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.18, 7),
            new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 })
          );
          flask2.position.set(bx - 0.35, -0.79, 1.1);
          zg.add(flask1, flask2);

          // Round Wooden Lab Stools
          for (const sz of [-1.0, 0.6]) {
            const stoolSeat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 8), benchMat);
            stoolSeat.position.set(bx + (bx < 0 ? -0.85 : 0.85), -1.22, sz);
            const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.42, 6), darkMetalMat);
            stoolLeg.position.set(bx + (bx < 0 ? -0.85 : 0.85), -1.43, sz);
            zg.add(stoolSeat, stoolLeg);
          }
        }

        // Phase 4: Bunsen Burner with Living Cyan Gas Flame on Front Workbench
        const bunsenBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.02, 8), darkMetalMat);
        bunsenBase.position.set(-1.0, -0.85, 0.2);
        const bunsenTube = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.18, 6), brassMat);
        bunsenTube.position.set(-1.0, -0.75, 0.2);
        const bunsenFlame = new THREE.Mesh(
          new THREE.ConeGeometry(0.035, 0.14, 6),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.88 })
        );
        bunsenFlame.position.set(-1.0, -0.60, 0.2);
        const bunsenLight = new THREE.PointLight(0x06b6d4, 0.45, 4.5);
        bunsenLight.position.set(-1.0, -0.55, 0.2);
        bunsenLight.layers.enable(0);
        bunsenLight.layers.enable(1);
        zg.add(bunsenBase, bunsenTube, bunsenFlame, bunsenLight);
        z.bunsenFlame = bunsenFlame;
        z.bunsenLight = bunsenLight;

        // Phase 4: Spilled Corrosive Chemical Stain & Tipped Broken Flask on Bench
        const chemPuddle = new THREE.Mesh(
          new THREE.CircleGeometry(0.28, 8),
          new THREE.MeshBasicMaterial({ color: 0x042f2e, transparent: true, opacity: 0.85 })
        );
        chemPuddle.rotation.x = -Math.PI / 2;
        chemPuddle.position.set(-0.7, -0.855, 0.6);
        const brokenFlask = new THREE.Mesh(
          new THREE.ConeGeometry(0.09, 0.18, 6),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
        );
        brokenFlask.rotation.z = Math.PI / 2.2;
        brokenFlask.position.set(-0.7, -0.82, 0.6);
        zg.add(chemPuddle, brokenFlask);

        // 3. Back Wall: Green Science Chalkboard with Chemical Formulas & Biology Diagrams
        const chalkCanvas = document.createElement('canvas');
        chalkCanvas.width = 512;
        chalkCanvas.height = 256;
        const cctx = chalkCanvas.getContext('2d');
        cctx.fillStyle = '#062817';
        cctx.fillRect(0, 0, 512, 256);
        cctx.strokeStyle = 'rgba(230, 245, 235, 0.72)';
        cctx.lineWidth = 3;
        // Benzene ring
        cctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const x = 110 + 42 * Math.cos(ang);
          const y = 90 + 42 * Math.sin(ang);
          if (i === 0) cctx.moveTo(x, y); else cctx.lineTo(x, y);
        }
        cctx.closePath();
        cctx.stroke();
        cctx.beginPath();
        cctx.arc(110, 90, 24, 0, Math.PI * 2);
        cctx.stroke();
        // Equations & Text
        cctx.fillStyle = 'rgba(230, 245, 235, 0.82)';
        cctx.font = 'bold 24px monospace';
        cctx.fillText('2NaCl + H₂SO₄ → Na₂SO₄ + 2HCl', 40, 185);
        cctx.font = 'bold 22px monospace';
        cctx.fillText('C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O', 40, 225);
        cctx.font = 'bold 26px sans-serif';
        cctx.fillText('GOVT BOYS SEC. SCIENCE LAB', 180, 50);
        const chalkTex = new THREE.CanvasTexture(chalkCanvas);

        const labBoard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 0.08), new THREE.MeshLambertMaterial({ map: chalkTex }));
        labBoard.position.set(0, 0.72, -4.8);
        labBoard.userData.lvl1Only = true;
        const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(3.72, 1.62, 0.04), woodMat);
        boardFrame.position.set(0, 0.72, -4.83);
        boardFrame.userData.lvl1Only = true;
        zg.add(labBoard, boardFrame);

        // Level 2 (NA-128 Lahore): Victorian Chemical Pathology & Anatomy Board
        const pathCanvas = document.createElement('canvas');
        pathCanvas.width = 512;
        pathCanvas.height = 256;
        const pctx = pathCanvas.getContext('2d');
        pctx.fillStyle = '#062013';
        pctx.fillRect(0, 0, 512, 256);
        pctx.strokeStyle = '#e2e8f0';
        pctx.lineWidth = 2.5;

        // Header banner
        pctx.fillStyle = '#fde047';
        pctx.font = 'bold 20px serif';
        pctx.fillText('GOVT DEGREE COLLEGE LAHORE · EST. 1864', 32, 34);
        pctx.fillStyle = '#6ee7b7';
        pctx.font = 'bold 15px monospace';
        pctx.fillText('DEPT. OF CHEMICAL PATHOLOGY & HUMAN ANATOMY', 32, 58);

        // Aromatic benzene rings & formulas
        pctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (i * Math.PI) / 3;
          const x = 90 + 30 * Math.cos(ang);
          const y = 135 + 30 * Math.sin(ang);
          if (i === 0) pctx.moveTo(x, y); else pctx.lineTo(x, y);
        }
        pctx.closePath();
        pctx.stroke();
        pctx.beginPath();
        pctx.arc(90, 135, 16, 0, Math.PI * 2);
        pctx.stroke();
        pctx.fillStyle = '#f8fafc';
        pctx.font = 'bold 12px monospace';
        pctx.fillText('—OH (PHENOL)', 130, 132);
        pctx.fillText('—NH₂ (ANILINE)', 130, 150);

        // Pathology Toxicology Notes
        pctx.fillStyle = '#fca5a5';
        pctx.font = 'bold 13px monospace';
        pctx.fillText('DISSECTION CASE #128-LHR · POST-MORTEM TALLIES', 32, 195);
        pctx.fillStyle = '#94a3b8';
        pctx.font = '12px monospace';
        pctx.fillText('C₁₀H₁₄N₂ + C₈H₁₀N₄O₂ · ALKALOID PURIFICATION VERIFIED', 32, 218);
        pctx.fillStyle = '#fef08a';
        pctx.font = '11px monospace';
        pctx.fillText('ECP FORENSIC EVIDENCE · DO NOT DISTURB BENCH REAGENTS', 32, 240);

        const pathTex = new THREE.CanvasTexture(pathCanvas);
        const pathBoard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 0.08), new THREE.MeshLambertMaterial({ map: pathTex }));
        pathBoard.position.set(0, 0.72, -4.8);
        pathBoard.userData.lvl2Only = true;
        const pathFrame = new THREE.Mesh(new THREE.BoxGeometry(3.72, 1.62, 0.04), brassMat);
        pathFrame.position.set(0, 0.72, -4.83);
        pathFrame.userData.lvl2Only = true;
        zg.add(pathBoard, pathFrame);

        // 4. Side Wall: Biology Chart ("ANATOMY & VERTEBRATES") (Level 1)
        const bioChart = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 1.4, 1.1),
          new THREE.MeshLambertMaterial({ color: 0xfef08a })
        );
        bioChart.position.set(-2.85, 0.85, -2.2);
        bioChart.userData.lvl1Only = true;
        const chartHeader = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.22, 1.1),
          new THREE.MeshLambertMaterial({ color: 0x991b1b })
        );
        chartHeader.position.set(-2.84, 1.45, -2.2);
        chartHeader.userData.lvl1Only = true;
        zg.add(bioChart, chartHeader);

        // Side Wall: Anatomical Muscular System Hanging Scroll (Level 2)
        const scrollCanvas = document.createElement('canvas');
        scrollCanvas.width = 256;
        scrollCanvas.height = 384;
        const sctx = scrollCanvas.getContext('2d');
        sctx.fillStyle = '#fef3c7'; // parchment
        sctx.fillRect(0, 0, 256, 384);
        sctx.fillStyle = '#881337';
        sctx.font = 'bold 13px serif';
        sctx.textAlign = 'center';
        sctx.fillText('HUMAN MUSCULATURE', 128, 28);
        sctx.font = '9px monospace';
        sctx.fillText('LAHORE MEDICAL FACULTY 1886', 128, 44);
        sctx.fillStyle = '#b91c1c';
        sctx.fillRect(108, 60, 40, 110); // torso
        sctx.fillRect(88, 75, 18, 90);   // arm L
        sctx.fillRect(150, 75, 18, 90);  // arm R
        sctx.fillRect(98, 175, 26, 120); // leg L
        sctx.fillRect(132, 175, 26, 120);// leg R
        sctx.fillStyle = '#fde68a';
        sctx.beginPath(); sctx.arc(128, 75, 16, 0, Math.PI * 2); sctx.fill(); // skull
        const scrollTex = new THREE.CanvasTexture(scrollCanvas);
        const l2AnatChart = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 1.6, 1.1),
          new THREE.MeshLambertMaterial({ map: scrollTex })
        );
        l2AnatChart.position.set(-2.85, 0.85, -2.2);
        l2AnatChart.userData.lvl2Only = true;
        const l2ScrollRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.18, 8), brassMat);
        l2ScrollRod.rotation.x = Math.PI / 2;
        l2ScrollRod.position.set(-2.83, 1.68, -2.2);
        l2ScrollRod.userData.lvl2Only = true;
        zg.add(l2AnatChart, l2ScrollRod);

        // 5. Sealed Steel Chemical Cupboard with Padlock
        const labCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.68, 2.6, 1.4), almirahMat);
        labCabinet.position.set(2.55, -0.35, -2.4);
        const padlock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), brassMat);
        padlock.position.set(2.15, -0.35, -2.4);
        zg.add(labCabinet, padlock);

        // ========================================================
        // Phase 4: CREEPY ANATOMICAL HORROR SKELETON (LOOMING & UNSETTLING)
        // ========================================================
        const skelGroup = new THREE.Group();
        // Positioned in the foreground close to the camera lens, towering & looming
        skelGroup.position.set(-1.32, -1.65, 3.52);
        skelGroup.rotation.y = -0.36;

        // Aged weathered bone texture with cracks & grimy fissures
        const boneCanvas = document.createElement('canvas');
        boneCanvas.width = 128;
        boneCanvas.height = 128;
        const bctx = boneCanvas.getContext('2d');
        bctx.fillStyle = '#b8af9a';
        bctx.fillRect(0, 0, 128, 128);
        bctx.strokeStyle = '#473d31';
        bctx.lineWidth = 1.5;
        bctx.beginPath();
        bctx.moveTo(30, 10); bctx.lineTo(45, 50); bctx.lineTo(40, 85);
        bctx.moveTo(85, 35); bctx.lineTo(92, 75); bctx.lineTo(80, 115);
        bctx.moveTo(20, 90); bctx.lineTo(60, 105);
        bctx.stroke();
        bctx.fillStyle = 'rgba(50, 42, 32, 0.45)';
        bctx.beginPath(); bctx.arc(35, 40, 14, 0, Math.PI * 2); bctx.fill();
        bctx.beginPath(); bctx.arc(90, 80, 18, 0, Math.PI * 2); bctx.fill();
        const boneTex = new THREE.CanvasTexture(boneCanvas);

        const boneMat = new THREE.MeshLambertMaterial({ map: boneTex });
        const boneSolidMat = new THREE.MeshLambertMaterial({ color: 0x9e937d }); // darker joint bone
        const boneDarkMat = new THREE.MeshLambertMaterial({ color: 0x2e271f }); // necrotic decay / joints
        const eyeVoidMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 }); // chilling red pinprick pupil

        // 1. Weathered Cast-Iron Mobile Stand
        const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.04, 10), darkMetalMat);
        standBase.position.y = 0.02;
        const cLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.05), darkMetalMat);
        cLeg1.position.y = 0.02;
        const cLeg2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.55), darkMetalMat);
        cLeg2.position.y = 0.02;
        const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.22, 6), darkMetalMat);
        standPole.position.set(0.08, 1.11, -0.09);
        const skullCaliper = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.012, 4, 8, Math.PI), darkMetalMat);
        skullCaliper.rotation.x = Math.PI / 2;
        skullCaliper.position.set(0.08, 2.12, 0.02);
        const clampScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 6), brassMat);
        clampScrew.position.set(0.08, 2.15, -0.08);
        skelGroup.add(standBase, cLeg1, cLeg2, standPole, skullCaliper, clampScrew);

        // 2. Crooked, Uneven Lower Limbs (Feet & Legs)
        const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.03, 0.19), boneMat);
        lFoot.position.set(-0.11, 0.02, 0.08);
        lFoot.rotation.y = -0.22;
        for (let t = 0; t < 4; t++) {
          const toe = new THREE.Mesh(new THREE.BoxGeometry(0.011, 0.018, 0.05), boneMat);
          toe.position.set(-0.022 + t * 0.015, -0.005, 0.10);
          lFoot.add(toe);
        }
        const lTibia = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.44, 6), boneMat);
        lTibia.position.set(-0.11, 0.24, 0.02);
        lTibia.rotation.x = 0.10;
        const lFibula = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.005, 0.43, 4), boneSolidMat);
        lFibula.position.set(-0.13, 0.24, 0.01);
        lFibula.rotation.x = 0.10;
        const lPatella = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), boneDarkMat);
        lPatella.position.set(-0.11, 0.46, 0.045);
        const lFemur = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.46, 6), boneMat);
        lFemur.position.set(-0.10, 0.69, 0.015);
        lFemur.rotation.x = -0.08;

        const rFoot = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.03, 0.19), boneMat);
        rFoot.position.set(0.12, 0.02, -0.04);
        rFoot.rotation.y = 0.30;
        const rTibia = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.44, 6), boneMat);
        rTibia.position.set(0.11, 0.24, -0.03);
        const rFibula = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.005, 0.43, 4), boneSolidMat);
        rFibula.position.set(0.13, 0.24, -0.04);
        const rPatella = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), boneDarkMat);
        rPatella.position.set(0.11, 0.46, -0.01);
        const rFemur = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.46, 6), boneMat);
        rFemur.position.set(0.09, 0.69, -0.02);
        skelGroup.add(lFoot, lTibia, lFibula, lPatella, lFemur, rFoot, rTibia, rFibula, rPatella, rFemur);

        // 3. Anatomical Pelvic Girdle (Flared Iliac Blades & Hollow Pelvic Cavity)
        const pelvisGroup = new THREE.Group();
        pelvisGroup.position.set(0, 0.95, 0);
        pelvisGroup.rotation.z = 0.08;
        const sacrum = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.16, 0.06), boneDarkMat);
        sacrum.position.set(0, -0.02, -0.06);
        pelvisGroup.add(sacrum);
        const iliumL = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.15, 6, 1, true, 0, Math.PI * 0.7), boneMat);
        iliumL.position.set(-0.07, 0.02, 0.01);
        iliumL.rotation.y = -Math.PI / 4;
        const iliumR = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.15, 6, 1, true, Math.PI * 0.3, Math.PI * 0.7), boneMat);
        iliumR.position.set(0.07, 0.02, 0.01);
        iliumR.rotation.y = Math.PI / 4;
        const pubicArch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.08), boneMat);
        pubicArch.position.set(0, -0.08, 0.05);
        pelvisGroup.add(iliumL, iliumR, pubicArch);
        skelGroup.add(pelvisGroup);

        // 4. Hunched Kyphotic Spine (Twisted Bony Vertebral Column)
        const spineGroup = new THREE.Group();
        spineGroup.position.set(0, 1.02, 0);
        spineGroup.rotation.x = 0.18; // deep slouch forward
        spineGroup.rotation.z = -0.08; // crooked side-tilt

        for (let vi = 0; vi < 8; vi++) {
          const vert = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.022, 0.042, 6), boneDarkMat);
          const spinousProcess = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.020, 0.035), boneMat);
          spinousProcess.position.set(0, 0, -0.03);
          vert.add(spinousProcess);
          vert.position.set(
            Math.sin(vi * 0.4) * 0.015,
            vi * 0.062,
            -0.01 - Math.sin(vi * 0.35) * 0.03
          );
          spineGroup.add(vert);
        }

        // 5. TRUE 3D CURVED RIBCAGE & HOLLOW THORACIC CAVITY
        const thoraxGroup = new THREE.Group();
        thoraxGroup.position.set(0, 0.30, 0);

        const sternum = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.32, 0.016), boneMat);
        sternum.position.set(0, 0.02, 0.14);
        const xiphoid = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 4), boneDarkMat);
        xiphoid.position.set(0, -0.16, 0.14);
        xiphoid.rotation.x = Math.PI;
        thoraxGroup.add(sternum, xiphoid);

        const chestVoid = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.08, 0.34, 8),
          new THREE.MeshBasicMaterial({ color: 0x050505 })
        );
        chestVoid.position.set(0, 0.02, 0.02);
        thoraxGroup.add(chestVoid);

        for (let ri = 0; ri < 7; ri++) {
          const ry = -0.13 + ri * 0.052;
          const rRadius = 0.135 - Math.abs(ri - 3) * 0.012;
          const ribGeoL = new THREE.TorusGeometry(rRadius, 0.009, 4, 8, Math.PI * 0.72);
          const ribL = new THREE.Mesh(ribGeoL, boneMat);
          ribL.rotation.x = Math.PI / 2;
          ribL.rotation.z = 0.18 + ri * 0.02;
          ribL.position.set(-0.01, ry, 0.01);
          const ribGeoR = new THREE.TorusGeometry(rRadius, 0.009, 4, 8, Math.PI * 0.72);
          const ribR = new THREE.Mesh(ribGeoR, boneMat);
          ribR.rotation.x = -Math.PI / 2;
          ribR.rotation.z = -0.18 - ri * 0.02;
          ribR.position.set(0.01, ry, 0.01);
          thoraxGroup.add(ribL, ribR);
        }
        spineGroup.add(thoraxGroup);

        // 6. Asymmetrical Collarbones & Specimen Tag
        const clavL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.024, 0.04), boneMat);
        clavL.position.set(-0.13, 0.52, 0.04);
        clavL.rotation.z = 0.20;
        const clavR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.024, 0.04), boneMat);
        clavR.position.set(0.13, 0.47, 0.03);
        clavR.rotation.z = 0.02;
        spineGroup.add(clavL, clavR);

        const tagGroup = new THREE.Group();
        tagGroup.position.set(0.12, 0.38, 0.12);
        const tagWire = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.09, 4), darkMetalMat);
        tagWire.position.y = 0.04;
        const tagCanvas = document.createElement('canvas');
        tagCanvas.width = 128; tagCanvas.height = 64;
        const tctx = tagCanvas.getContext('2d');
        tctx.fillStyle = '#d4b996'; tctx.fillRect(0, 0, 128, 64);
        tctx.fillStyle = '#1c1917'; tctx.font = 'bold 16px monospace';
        tctx.fillText('GOVT LAB', 14, 24);
        tctx.font = 'bold 13px monospace';
        tctx.fillText('SPECIMEN #07', 8, 44);
        const tagCard = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.045, 0.004),
          new THREE.MeshLambertMaterial({ map: new THREE.CanvasTexture(tagCanvas) })
        );
        tagGroup.add(tagWire, tagCard);
        tagGroup.rotation.z = 0.25;
        spineGroup.add(tagGroup);

        // 7. TERRIFYING HORROR ARMS
        // LEFT ARM: THRUSTING FORWARD TOWARD THE CCTV CAMERA LENS!
        const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), boneDarkMat);
        lShoulder.position.set(-0.24, 0.52, 0.02);
        const lHumerus = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.38, 6), boneMat);
        lHumerus.position.set(-0.28, 0.36, 0.16);
        lHumerus.rotation.x = -0.75;
        lHumerus.rotation.z = 0.22;
        const lElbow = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), boneDarkMat);
        lElbow.position.set(-0.31, 0.21, 0.30);

        const lForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.38, 6), boneMat);
        lForearm.position.set(-0.30, 0.12, 0.48);
        lForearm.rotation.x = -1.15; // pointed straight at camera lens!

        // ARTICULATED CLAW HAND (Spindly Knobby Fingers Splayed Wide)
        const lHand = new THREE.Group();
        lHand.position.set(-0.29, 0.02, 0.68); // ultra close to lens!
        const carpus = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 0.02), boneMat);
        lHand.add(carpus);

        const fingerAngles = [-0.45, -0.20, 0.05, 0.28, 0.55];
        for (let f = 0; f < 5; f++) {
          const fGroup = new THREE.Group();
          fGroup.position.set(-0.024 + f * 0.012, -0.018, 0.01);
          fGroup.rotation.z = fingerAngles[f];

          const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.0035, 0.04, 4), boneMat);
          p1.position.y = -0.02;
          p1.rotation.x = -0.35;
          const k1 = new THREE.Mesh(new THREE.SphereGeometry(0.005, 4, 4), boneDarkMat);
          k1.position.set(0, -0.04, 0.01);
          const p2 = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.035, 4), boneMat);
          p2.position.set(0, -0.055, 0.02);
          p2.rotation.x = -0.70;
          fGroup.add(p1, k1, p2);
          lHand.add(fGroup);
        }
        spineGroup.add(lShoulder, lHumerus, lElbow, lForearm, lHand);

        // RIGHT ARM: Dangling limply, snapped at elbow
        const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.026, 6, 6), boneDarkMat);
        rShoulder.position.set(0.24, 0.46, 0.01);
        const rHumerus = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.013, 0.38, 6), boneMat);
        rHumerus.position.set(0.26, 0.28, -0.02);
        rHumerus.rotation.z = -0.06;
        rHumerus.rotation.x = 0.15;
        const rElbow = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 6), boneDarkMat);
        rElbow.position.set(0.28, 0.10, -0.04);
        const rForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.010, 0.34, 6), boneMat);
        rForearm.position.set(0.29, -0.06, -0.02);
        rForearm.rotation.x = 0.25;
        const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.09, 0.015), boneMat);
        rHand.position.set(0.30, -0.22, 0.02);
        spineGroup.add(rShoulder, rHumerus, rElbow, rForearm, rHand);

        skelGroup.add(spineGroup);

        // 8. THE SCULPTED ANATOMICAL HORROR SKULL (Broken Neck, Tilted, Screaming)
        const skullGroup = new THREE.Group();
        skullGroup.position.set(0, 1.76, 0.05);

        // BROKEN NECK ORIENTATION:
        // Snapped sideways 38°, pitched down 26°, turned to lock eyes with the camera lens
        skullGroup.rotation.z = 0.38;  // severe sideways neck break
        skullGroup.rotation.y = -0.48; // faces CCTV lens directly
        skullGroup.rotation.x = 0.26;  // tilted down to glare at viewer

        // A. Smooth, curved anatomical cranial dome (Vault of the skull)
        const craniumGeo = new THREE.SphereGeometry(0.125, 14, 12);
        craniumGeo.scale(0.92, 1.05, 1.25);
        const cranium = new THREE.Mesh(craniumGeo, boneMat);
        cranium.position.set(0, 0.07, -0.01);

        const sutureLine = new THREE.Mesh(
          new THREE.TorusGeometry(0.115, 0.005, 4, 12, Math.PI),
          boneDarkMat
        );
        sutureLine.rotation.x = Math.PI / 2.3;
        sutureLine.position.set(0, 0.12, -0.02);
        skullGroup.add(cranium, sutureLine);

        // B. Heavy Angular Supraorbital Brow Ridge (Angry / Menacing Scowl)
        const browL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.032, 0.06), boneMat);
        browL.position.set(-0.055, 0.04, 0.11);
        browL.rotation.z = -0.15;
        browL.rotation.y = 0.15;
        const browR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.032, 0.06), boneMat);
        browR.position.set(0.055, 0.04, 0.11);
        browR.rotation.z = 0.15;
        browR.rotation.y = -0.15;
        skullGroup.add(browL, browR);

        // C. Sharp Flaring Zygomatic Arches (Cheekbones)
        const cheekArchL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, 0.09), boneMat);
        cheekArchL.position.set(-0.105, -0.02, 0.08);
        cheekArchL.rotation.y = -0.35;
        const cheekArchR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.055, 0.09), boneMat);
        cheekArchR.position.set(0.105, -0.02, 0.08);
        cheekArchR.rotation.y = 0.35;
        skullGroup.add(cheekArchL, cheekArchR);

        // D. Sunken, Slanted Deep Eye Orbits (Terrifying Hollow Voids)
        const orbitL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.060, 0.05), eyeVoidMat);
        orbitL.position.set(-0.050, 0.015, 0.105);
        orbitL.rotation.z = 0.16;
        const orbitR = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.060, 0.05), eyeVoidMat);
        orbitR.position.set(0.050, 0.015, 0.105);
        orbitR.rotation.z = -0.16;

        const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 6, 6), eyeGlowMat);
        pupilL.position.set(-0.050, 0.015, 0.125);
        const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.0075, 6, 6), eyeGlowMat);
        pupilR.position.set(0.050, 0.015, 0.125);
        skullGroup.add(orbitL, orbitR, pupilL, pupilR);

        // E. Piriform Aperture (Deep Hollow Triangular Nasal Cavity)
        const nasalCavity = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.045, 3), eyeVoidMat);
        nasalCavity.position.set(0, -0.025, 0.118);
        nasalCavity.rotation.x = Math.PI;
        skullGroup.add(nasalCavity);

        // F. Maxilla (Upper Jaw) with INDIVIDUAL JAGGED UPPER TEETH
        const maxilla = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.042, 0.10), boneMat);
        maxilla.position.set(0, -0.06, 0.08);
        skullGroup.add(maxilla);

        const teethMat = new THREE.MeshLambertMaterial({ color: 0xddd5c4 });
        for (let ti = 0; ti < 6; ti++) {
          const tx = -0.038 + ti * 0.015;
          const isCanine = (ti === 1 || ti === 4);
          const tH = isCanine ? 0.024 : 0.017;
          const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.010, tH, 0.011), teethMat);
          tooth.position.set(tx, -0.082 - (isCanine ? 0.003 : 0), 0.128 - Math.abs(ti - 2.5) * 0.004);
          skullGroup.add(tooth);
        }

        // G. UNHINGED SCREAMING LOWER JAW (Mandible Dislocated & Dropped Wide Open)
        const mandibleGroup = new THREE.Group();
        mandibleGroup.position.set(0, -0.075, 0.04);
        mandibleGroup.rotation.x = 0.52;
        mandibleGroup.rotation.z = -0.10;

        const throatVoid = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.09), eyeVoidMat);
        throatVoid.position.set(0, 0.02, 0.03);

        const jawBone = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.04, 0.13), boneMat);
        jawBone.position.set(0, -0.035, 0.05);
        const chin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.035, 0.04), boneMat);
        chin.position.set(0, -0.045, 0.11);
        mandibleGroup.add(throatVoid, jawBone, chin);

        for (let li = 0; li < 6; li++) {
          const lx = -0.035 + li * 0.014;
          const lTooth = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.016, 0.010), teethMat);
          lTooth.position.set(lx, -0.015, 0.105 - Math.abs(li - 2.5) * 0.003);
          mandibleGroup.add(lTooth);
        }
        skullGroup.add(mandibleGroup);

        skelGroup.add(skullGroup);
        zg.add(skelGroup);

        z.creepySkull = skullGroup;
        z.creepyMandible = mandibleGroup;
        z.creepyArm = lHand;

        // Level 2 (NA-128 Lahore): Pre-Med Specimen Museum Jars & Dissection Balance
        const specimenGroup = new THREE.Group();
        specimenGroup.position.set(-1.8, -0.65, -1.8);
        specimenGroup.userData.lvl2Only = true;
        const jarMat = new THREE.MeshBasicMaterial({ color: 0xca8a04, transparent: true, opacity: 0.70 });
        for (let j = 0; j < 4; j++) {
          const sJar = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.10, 0.32, 10), jarMat);
          sJar.position.set(j * 0.28, 0, 0);
          const sCap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 10), darkMetalMat);
          sCap.position.set(j * 0.28, 0.18, 0);
          specimenGroup.add(sJar, sCap);
        }
        // Brass Dissection Pan
        const dissectPan = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.04, 0.42), brassMat);
        dissectPan.position.set(0.42, 0.02, 0.45);
        specimenGroup.add(dissectPan);

        // Victorian Mahogany Apothecary Bottle Rack on Wall (Amber, Cobalt, Emerald glass)
        const apothShelf = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.8, 1.6), richMahoganyMat);
        apothShelf.position.set(2.8, 0.5, 0.5);
        specimenGroup.add(apothShelf);

        const bottleColors = [0xd97706, 0x1d4ed8, 0x059669, 0xb91c1c];
        for (let row = 0; row < 2; row++) {
          const by = 0.0 + row * 0.65;
          for (let bi = 0; bi < 3; bi++) {
            const bCol = bottleColors[(row * 3 + bi) % bottleColors.length];
            const botMat = new THREE.MeshBasicMaterial({ color: bCol, transparent: true, opacity: 0.75 });
            const botBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.24, 8), botMat);
            botBody.position.set(2.62, by, -0.45 + bi * 0.42);
            const botNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.08, 8), botMat);
            botNeck.position.set(2.62, by + 0.16, -0.45 + bi * 0.42);
            const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.024, 0.04, 6), brassMat);
            cork.position.set(2.62, by + 0.22, -0.45 + bi * 0.42);
            specimenGroup.add(botBody, botNeck, cork);
          }
        }

        // Dual-Pan Brass Analytical Balance (Victorian Chemical Scale) on Lab Bench
        const balanceGroup = new THREE.Group();
        balanceGroup.position.set(1.2, -0.78, 0.2);
        const balBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.28), richMahoganyMat);
        const balPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.38, 6), brassMat);
        balPillar.position.y = 0.20;
        const balBeam = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.015, 0.015), brassMat);
        balBeam.position.y = 0.38;
        balBeam.rotation.z = 0.06; // slight realistic tilt
        // Left Pan
        const panL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.015, 8), brassMat);
        panL.position.set(-0.16, 0.22, 0);
        const cordL = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.15, 4), darkMetalMat);
        cordL.position.set(-0.16, 0.30, 0);
        // Right Pan
        const panR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.015, 8), brassMat);
        panR.position.set(0.16, 0.24, 0);
        const cordR = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.13, 4), darkMetalMat);
        cordR.position.set(0.16, 0.31, 0);
        balanceGroup.add(balBase, balPillar, balBeam, panL, cordL, panR, cordR);
        specimenGroup.add(balanceGroup);

        zg.add(specimenGroup);

        // Level 3 (NA-241 Karachi): K-Electric Standby Diesel Genset & Fuel Storage
        const gensetRoomGroup = new THREE.Group();
        gensetRoomGroup.position.set(0, -1.65, -0.6);
        gensetRoomGroup.userData.lvl3Only = true;

        // Heavy Cummins-Style Green Industrial Diesel Generator
        const cGenset = new THREE.Group();
        cGenset.position.set(-0.8, 0, 0);
        const cSkid = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.25, 1.6), darkMetalMat);
        cSkid.position.y = 0.12;
        const cEngineBlock = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.35, 1.4), industrialGensetGreenMat);
        cEngineBlock.position.set(-0.2, 0.9, 0);
        const cAlternator = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.9, 12), darkMetalMat);
        cAlternator.rotation.z = Math.PI / 2;
        cAlternator.position.set(0.9, 0.8, 0);
        const cExhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 8), darkMetalMat);
        cExhaust.position.set(-0.6, 2.3, -0.4);
        cGenset.add(cSkid, cEngineBlock, cAlternator, cExhaust);

        // Red 200L Diesel Fuel Drums on Spill Containment Pallet
        const drumPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.4), steelSafetyOrangeMat);
        drumPallet.position.set(1.6, 0.08, 0);
        const drum1 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 12), fuelDrumRedMat);
        drum1.position.set(1.35, 0.58, -0.28);
        const drum2 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.88, 12), fuelDrumRedMat);
        drum2.position.set(1.75, 0.58, 0.28);
        gensetRoomGroup.add(cGenset, drumPallet, drum1, drum2);

        // K-Electric 400V 3-Phase Hazard Sign on Back Wall
        const kePlate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 0.04), keElectricSignMat);
        kePlate.position.set(0, 1.8, -2.4);
        gensetRoomGroup.add(kePlate);

        zg.add(gensetRoomGroup);

        // 6. Suspended Cold Cyan/Green Fluorescent Lab Lights
        const labTubeGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6);
        labTubeGeo.rotateZ(Math.PI / 2);
        const labTube = new THREE.Mesh(labTubeGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        labTube.position.set(0, 2.2, -0.6);
        const labLight = new THREE.PointLight(0x38bdf8, 1.20, 16);
        labLight.position.set(0, 2.0, -0.6);
        labLight.layers.enable(0);
        labLight.layers.enable(1);
        labLight.userData.zoneIdx = idx;
        labLight.userData.baseIntensity = 1.20;
        zg.add(labTube, labLight);
        zoneLights.push(labLight);

        const camLight = new THREE.PointLight(0x34d399, 0.75, 14);
        camLight.position.set(0, 2.2, 2.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        camLight.userData.baseIntensity = 0.75;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 7) {
        // ========================================================
        // CAM 08: HEADMASTER OFFICE (Executive Desk, Quaid Portrait, Flag, Trophy Cabinet)
        // ========================================================
        // 1. Room Shell with Rich Dark Wood Wainscotting & Ceiling
        const hmFloor = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), floorMat);
        hmFloor.rotation.x = -Math.PI / 2;
        hmFloor.position.set(0, -1.65, 0);
        const hmCeil = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), ceilingMat);
        hmCeil.rotation.x = Math.PI / 2;
        hmCeil.position.set(0, 2.45, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 0.35), wallMat);
        backWall.position.set(0, 0.45, -5.0);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        leftWall.position.set(-3.0, 0.45, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        rightWall.position.set(3.0, 0.45, 0);
        zg.add(hmFloor, hmCeil, backWall, leftWall, rightWall);

        // 2. Large Heavy Mahogany Executive Desk with Green Leather Pad (Level 1)
        const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.14, 1.6), woodMat);
        deskTop.position.set(0, -0.92, -0.8);
        deskTop.userData.lvl1Only = true;
        const deskBlotter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 1.0), darkSarkariGreenMat);
        deskBlotter.position.set(0, -0.84, -0.8);
        deskBlotter.userData.lvl1Only = true;
        const deskBaseL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 1.4), woodMat);
        deskBaseL.position.set(-0.95, -1.31, -0.8);
        deskBaseL.userData.lvl1Only = true;
        const deskBaseR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 1.4), woodMat);
        deskBaseR.position.set(0.95, -1.31, -0.8);
        deskBaseR.userData.lvl1Only = true;
        zg.add(deskTop, deskBlotter, deskBaseL, deskBaseR);

        // Desk Accessories: Miniature Pakistan Flag, Brass Call Bell, Rotary Dial Phone (Level 1)
        const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.55, 6), brassMat);
        flagPole.position.set(-0.85, -0.58, -0.8);
        flagPole.userData.lvl1Only = true;
        const miniFlag = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.22), pakistaniFlagMat);
        miniFlag.rotation.y = Math.PI;
        miniFlag.position.set(-1.01, -0.48, -0.8);
        miniFlag.userData.lvl1Only = true;
        const deskBell = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.05, 8), brassMat);
        deskBell.position.set(0.65, -0.82, -0.7);
        deskBell.userData.lvl1Only = true;
        const hmPhone = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.22), darkMetalMat);
        hmPhone.position.set(0.85, -0.80, -1.1);
        hmPhone.userData.lvl1Only = true;
        zg.add(flagPole, miniFlag, deskBell, hmPhone);

        // Phase 3: Authentic Banker's Emerald Green & Brass Executive Desk Lamp (Level 1)
        const lampGroup = new THREE.Group();
        lampGroup.position.set(-0.55, -0.84, -0.6);
        lampGroup.userData.lvl1Only = true;
        const bBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.04, 8), brassMat);
        const bStem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 6), brassMat);
        bStem.position.set(0, 0.19, 0);
        const bShadeHood = new THREE.Mesh(
          new THREE.CylinderGeometry(0.10, 0.10, 0.24, 8, 1, false, 0, Math.PI),
          new THREE.MeshLambertMaterial({ color: 0x064e3b, roughness: 0.2 })
        );
        bShadeHood.rotation.z = Math.PI / 2;
        bShadeHood.position.set(0, 0.38, 0);
        lampGroup.add(bBase, bStem, bShadeHood);
        zg.add(lampGroup);

        const bankerLight = new THREE.PointLight(0xffdd77, 1.15, 4.2);
        bankerLight.position.set(-0.55, -0.52, -0.6);
        bankerLight.layers.enable(0);
        bankerLight.layers.enable(1);
        bankerLight.userData.zoneIdx = idx;
        bankerLight.userData.baseIntensity = 1.15;
        zg.add(bankerLight);
        zoneLights.push(bankerLight);

        // High-back Executive Headmaster Swivel Chair (Level 1)
        const hmSeat = new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 0.12, 0.68),
          new THREE.MeshLambertMaterial({ color: 0x7f1d1d })
        );
        hmSeat.position.set(0, -1.15, -1.75);
        hmSeat.userData.lvl1Only = true;
        const hmBack = new THREE.Mesh(
          new THREE.BoxGeometry(0.72, 0.95, 0.12),
          new THREE.MeshLambertMaterial({ color: 0x7f1d1d })
        );
        hmBack.position.set(0, -0.68, -2.05);
        hmBack.userData.lvl1Only = true;
        zg.add(hmSeat, hmBack);

        // 2 Visitor Armchairs (Wood & Red Cushion) in front of desk (Level 1)
        for (const vx of [-0.75, 0.75]) {
          const vSeat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.55), benchMat);
          vSeat.position.set(vx, -1.22, 0.4);
          vSeat.userData.lvl1Only = true;
          const vBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.62, 0.08), benchMat);
          vBack.position.set(vx, -0.88, 0.65);
          vBack.userData.lvl1Only = true;
          zg.add(vSeat, vBack);
        }

        // ========================================================
        // LEVEL 2 (NA-128 LAHORE): PRINCIPAL'S EXECUTIVE MAHOGANY CHAMBER
        // ========================================================
        const principalGroup = new THREE.Group();
        principalGroup.userData.lvl2Only = true;

        // Rich Persian Medallion Rug Under Executive Desk
        const pRugMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.4), persianRugMat);
        pRugMesh.rotation.x = -Math.PI / 2;
        pRugMesh.position.set(0, -1.64, -1.0);
        principalGroup.add(pRugMesh);

        // Massive Victorian Carved Dark Mahogany Executive Desk
        const pDeskTop = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 1.8), richMahoganyMat);
        pDeskTop.position.set(0, -0.90, -0.8);
        const pLeatherPad = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.02, 1.1), darkSarkariGreenMat);
        pLeatherPad.position.set(0, -0.81, -0.8);
        const pPlinthL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.70, 1.6), richMahoganyMat);
        pPlinthL.position.set(-1.05, -1.29, -0.8);
        const pPlinthR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.70, 1.6), richMahoganyMat);
        pPlinthR.position.set(1.05, -1.29, -0.8);
        // Brass Lion-Claw Feet on Desk Base
        for (const fx of [-1.35, -0.75, 0.75, 1.35]) {
          for (const fz of [-1.50, -0.10]) {
            const foot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), brassMat);
            foot.position.set(fx, -1.62, fz);
            principalGroup.add(foot);
          }
        }
        principalGroup.add(pDeskTop, pLeatherPad, pPlinthL, pPlinthR);

        // High-Back Chesterfield Deep Wine Leather Wingchair
        const cChairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.16, 0.78), chesterfieldLeatherMat);
        cChairSeat.position.set(0, -1.12, -1.8);
        const cChairBack = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.18, 0.18), chesterfieldLeatherMat);
        cChairBack.position.set(0, -0.56, -2.15);
        const cChairWingL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.82, 0.32), chesterfieldLeatherMat);
        cChairWingL.position.set(-0.38, -0.56, -1.98);
        const cChairWingR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.82, 0.32), chesterfieldLeatherMat);
        cChairWingR.position.set(0.38, -0.56, -1.98);
        principalGroup.add(cChairSeat, cChairBack, cChairWingL, cChairWingR);

        // 2 Victorian Deep Wine Visitor Armchairs in Front of Desk
        for (const vx of [-0.95, 0.95]) {
          const vArmSeat = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.65), chesterfieldLeatherMat);
          vArmSeat.position.set(vx, -1.16, 0.45);
          const vArmBack = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.75, 0.14), chesterfieldLeatherMat);
          vArmBack.position.set(vx, -0.78, 0.74);
          const vArmL = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.28, 0.55), richMahoganyMat);
          vArmL.position.set(vx - 0.32, -0.98, 0.45);
          const vArmR = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.28, 0.55), richMahoganyMat);
          vArmR.position.set(vx + 0.32, -0.98, 0.45);
          principalGroup.add(vArmSeat, vArmBack, vArmL, vArmR);
        }

        // Tall Victorian Grandfather Clock (Standing in Left Corner)
        const gfClockGroup = new THREE.Group();
        gfClockGroup.position.set(-2.2, -1.65, -4.3);
        const gfPlinth = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.45, 0.45), richMahoganyMat);
        gfPlinth.position.y = 0.225;
        const gfTrunk = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.85, 0.38), richMahoganyMat);
        gfTrunk.position.y = 1.375;
        // Glass door viewing pendulum
        const gfGlass = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 1.25, 0.04),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
        );
        gfGlass.position.set(0, 1.45, 0.18);
        const gfPendulum = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.85, 6), brassMat);
        gfPendulum.position.set(0, 1.55, 0.05);
        const gfBob = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), brassMat);
        gfBob.rotation.x = Math.PI / 2;
        gfBob.position.set(0, 1.15, 0.05);
        // Clock Hood & Dial
        const gfHood = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.65, 0.46), richMahoganyMat);
        gfHood.position.y = 2.58;
        const gfDial = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.03, 16), brassMat);
        gfDial.rotation.x = Math.PI / 2;
        gfDial.position.set(0, 2.58, 0.24);
        const gfFace = new THREE.Mesh(new THREE.CircleGeometry(0.16, 16), new THREE.MeshBasicMaterial({ color: 0xfef9c3 }));
        gfFace.position.set(0, 2.58, 0.26);
        // Brass finial on top of hood
        const gfFinial = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 8), brassMat);
        gfFinial.position.set(0, 3.0, 0);
        gfClockGroup.add(gfPlinth, gfTrunk, gfGlass, gfPendulum, gfBob, gfHood, gfDial, gfFace, gfFinial);
        principalGroup.add(gfClockGroup);

        // Crimson Velvet Drapery Curtains Flanking Walls
        const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.85), crimsonVelvetMat);
        curtainL.position.set(-2.88, 0.5, -3.8);
        const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.4, 0.85), crimsonVelvetMat);
        curtainR.position.set(2.88, 0.5, -3.8);
        principalGroup.add(curtainL, curtainR);

        // Antique Brass Desk Accessories: Lamp, Carriage Clock, Rotary Phone
        const cClock = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.28, 0.14), brassMat);
        cClock.position.set(0.95, -0.72, -0.9);
        const pDeskLamp = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 6), brassMat);
        pDeskLamp.position.set(-0.75, -0.65, -0.7);
        const pLampHood = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.24, 8, 1, false, 0, Math.PI), new THREE.MeshLambertMaterial({ color: 0x064e3b }));
        pLampHood.rotation.z = Math.PI / 2;
        pLampHood.position.set(-0.75, -0.45, -0.7);
        principalGroup.add(cClock, pDeskLamp, pLampHood);

        // Level 2 Principal's Roll of Honour (Teakwood & Gold Leaf Lettering)
        const l2RollCanvas = document.createElement('canvas');
        l2RollCanvas.width = 384;
        l2RollCanvas.height = 256;
        const rctx2 = l2RollCanvas.getContext('2d');
        rctx2.fillStyle = '#20120b'; // dark polished teak
        rctx2.fillRect(0, 0, 384, 256);
        rctx2.strokeStyle = '#eab308';
        rctx2.lineWidth = 4;
        rctx2.strokeRect(6, 6, 372, 244);
        rctx2.fillStyle = '#fde047';
        rctx2.font = 'bold 15px serif';
        rctx2.textAlign = 'center';
        rctx2.fillText('GOVT DEGREE COLLEGE LAHORE', 192, 32);
        rctx2.font = 'bold 12px serif';
        rctx2.fillText('PRINCIPALS ROLL OF HONOUR · EST. 1864', 192, 54);
        rctx2.fillStyle = '#cbd5e1';
        rctx2.font = '10px monospace';
        rctx2.fillText('1864 - 1882 : DR. G. W. LEITNER', 192, 84);
        rctx2.fillText('1882 - 1898 : T. C. LEWIS, M.A.', 192, 108);
        rctx2.fillText('1898 - 1912 : A. S. HEMMY, B.A.', 192, 132);
        rctx2.fillText('1984 - 2002 : PROF. K. S. MALIK', 192, 156);
        rctx2.fillText('2018 - 2024 : PROF. M. H. BHATTI', 192, 180);
        rctx2.fillStyle = '#fde047';
        rctx2.font = 'bold 11px monospace';
        rctx2.fillText('★ HALQA NA-128 LAHORE ARCHIVES ★', 192, 222);

        const l2RollTex = new THREE.CanvasTexture(l2RollCanvas);
        const l2HonourBoard = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.2, 0.06), new THREE.MeshLambertMaterial({ map: l2RollTex }));
        l2HonourBoard.position.set(1.8, 0.85, -4.8);
        const l2HonourTrim = new THREE.Mesh(new THREE.BoxGeometry(1.78, 1.28, 0.02), brassMat);
        l2HonourTrim.position.set(1.8, 0.85, -4.83);
        principalGroup.add(l2HonourBoard, l2HonourTrim);

        // Ornate Brass Plaque / College Seal under Quaid Portrait
        const sealCanvas = document.createElement('canvas');
        sealCanvas.width = 256; sealCanvas.height = 128;
        const sealCtx = sealCanvas.getContext('2d');
        sealCtx.fillStyle = '#78350f'; sealCtx.fillRect(0, 0, 256, 128);
        sealCtx.strokeStyle = '#fde047'; sealCtx.lineWidth = 3; sealCtx.strokeRect(4, 4, 248, 120);
        sealCtx.fillStyle = '#fde047'; sealCtx.font = 'bold 13px serif'; sealCtx.textAlign = 'center';
        sealCtx.fillText('GOVERNMENT DEGREE COLLEGE', 128, 42);
        sealCtx.fillText('COURAGE TO KNOW · EST. 1864', 128, 66);
        sealCtx.font = '10px monospace';
        sealCtx.fillText('CONSTITUENCY NA-128 LAHORE', 128, 92);
        const sealTex = new THREE.CanvasTexture(sealCanvas);
        const sealPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.55, 0.04), new THREE.MeshLambertMaterial({ map: sealTex }));
        sealPlate.position.set(0, -0.32, -4.8);
        principalGroup.add(sealPlate);

        zg.add(principalGroup);

        // Level 3 (NA-241 Karachi): RO Strongroom Bank Vault Door & Sindh Banner
        const roStrongroomGroup = new THREE.Group();
        roStrongroomGroup.position.set(0, -1.65, 0);
        roStrongroomGroup.userData.lvl3Only = true;

        // Heavy Bank Vault Door Frame and Circular Door Slab
        const vaultFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.8, 0.45), darkMetalMat);
        vaultFrame.position.set(0, 1.4, -4.6);
        const vaultDoorSlab = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.15), vaultDoorMat);
        vaultDoorSlab.position.set(0, 1.4, -4.35);
        roStrongroomGroup.add(vaultFrame, vaultDoorSlab);

        // Gold-Trimmed ECP Sindh Provincial Strongroom Banner above Vault
        const roBannerMesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 0.06), roBannerMat);
        roBannerMesh.position.set(0, 3.1, -4.55);
        roStrongroomGroup.add(roBannerMesh);

        // Returning Officer Executive Steel Desk & Form-47 Register
        const roDesk = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 1.2), darkMetalMat);
        roDesk.position.set(0, 0.42, -1.8);
        const roBlotter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.8), darkSarkariGreenMat);
        roBlotter.position.set(0, 0.86, -1.8);
        const roBook = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.35), new THREE.MeshLambertMaterial({ color: 0x991b1b }));
        roBook.position.set(-0.5, 0.9, -1.8);
        roStrongroomGroup.add(roDesk, roBlotter, roBook);

        zg.add(roStrongroomGroup);

        // 3. Back Wall: Gold-Framed Quaid-e-Azam Portrait
        const quaidPortrait = new THREE.Mesh(new THREE.BoxGeometry(1.35, 1.86, 0.08), quaidPortraitColorMat);
        quaidPortrait.position.set(0, 0.95, -4.8);
        const goldFrame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 1.98, 0.04), brassMat);
        goldFrame.position.set(0, 0.95, -4.83);
        zg.add(quaidPortrait, goldFrame);

        // 4. Left Wall: Glass-Fronted Teakwood Trophy & Shield Showcase (Level 1)
        const showcase = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.5, 2.2), woodMat);
        showcase.position.set(-2.6, -0.4, -2.0);
        showcase.userData.lvl1Only = true;
        zg.add(showcase);
        // Golden & Silver Brass Cups on shelves (Level 1)
        for (const ty of [-0.8, -0.2, 0.4]) {
          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.06, 0.28, 8), brassMat);
          cup.position.set(-2.28, ty, -2.0);
          cup.userData.lvl1Only = true;
          zg.add(cup);
        }

        // 5. Right Wall: Two-Seater Rexine Sofa for Visiting Officials (Level 1)
        const sofa = new THREE.Mesh(
          new THREE.BoxGeometry(0.75, 0.75, 2.0),
          new THREE.MeshLambertMaterial({ color: 0x451a03 })
        );
        sofa.position.set(2.55, -1.22, -1.5);
        sofa.userData.lvl1Only = true;

        // Level 1: Antique Carved Teakwood Pendulum Wall Clock
        const clockGroup = new THREE.Group();
        clockGroup.position.set(-1.65, 1.15, -4.8);
        clockGroup.userData.lvl1Only = true;
        const cCase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.25, 0.16), woodMat);
        const cFace = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.02, 12),
          new THREE.MeshBasicMaterial({ color: 0xfef9c3 })
        );
        cFace.rotation.x = Math.PI / 2;
        cFace.position.set(0, 0.30, 0.09);
        const handH = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.11, 0.01), darkMetalMat);
        handH.position.set(-0.01, 0.33, 0.10);
        handH.rotation.z = 0.15;
        const handM = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.15, 0.01), darkMetalMat);
        handM.position.set(-0.02, 0.35, 0.10);
        handM.rotation.z = -0.22;
        const pendRod = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.42, 4), brassMat);
        pendRod.position.set(0, -0.20, 0.06);
        const pendBob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 8), brassMat);
        pendBob.rotation.x = Math.PI / 2;
        pendBob.position.set(0, -0.38, 0.06);
        clockGroup.add(cCase, cFace, handH, handM, pendRod, pendBob);

        // Level 1: Carved Teakwood "HEADMASTERS ROLL OF HONOUR" Board
        const honourBoard = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.06), woodMat);
        honourBoard.position.set(1.8, 0.85, -4.8);
        honourBoard.userData.lvl1Only = true;
        const honourTrim = new THREE.Mesh(new THREE.BoxGeometry(1.68, 1.18, 0.02), brassMat);
        honourTrim.position.set(1.8, 0.85, -4.83);
        honourTrim.userData.lvl1Only = true;

        // Level 1: Heavy Dark Green Velvet Drapes with Ominous Fold Shadows
        for (const dz of [-3.2, 0.2]) {
          const drape = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 3.2, 0.65),
            new THREE.MeshLambertMaterial({ color: 0x0f2918 })
          );
          drape.position.set(2.85, 0.25, dz);
          drape.userData.lvl1Only = true;
          zg.add(drape);
        }
        const drapeRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 4.2, 6), brassMat);
        drapeRod.position.set(2.85, 1.9, -1.5);
        drapeRod.userData.lvl1Only = true;
        zg.add(drapeRod, sofa, clockGroup, honourBoard, honourTrim);

        // 6. Ceiling Ambient Fill & Executive Illumination
        const hmBulb = new THREE.PointLight(0xc4a362, 1.15, 15);
        hmBulb.position.set(0, 2.25, -0.8);
        hmBulb.layers.enable(0);
        hmBulb.layers.enable(1);
        hmBulb.userData.zoneIdx = idx;
        hmBulb.userData.baseIntensity = 1.25;
        zg.add(hmBulb);
        zoneLights.push(hmBulb);

        const camLight = new THREE.PointLight(0xfbbf24, 0.75, 14);
        camLight.position.set(0, 2.2, 2.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        camLight.userData.baseIntensity = 0.75;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 8) {
        // ========================================================
        // CAM 09: POWER & GENERATOR ROOM (مین جنریٹر روم)
        // ========================================================
        const pwrFloor = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), floorMat);
        pwrFloor.rotation.x = -Math.PI / 2;
        pwrFloor.position.set(0, -1.65, 0);
        const pwrCeil = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), ceilingMat);
        pwrCeil.rotation.x = Math.PI / 2;
        pwrCeil.position.set(0, 2.45, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 0.35), wallMat);
        backWall.position.set(0, 0.45, -2.8);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        leftWall.position.set(-3.0, 0.45, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        rightWall.position.set(3.0, 0.45, 0);
        zg.add(pwrFloor, pwrCeil, backWall, leftWall, rightWall);

        // Heavy Backup Diesel Generator Unit
        const genGroup = new THREE.Group();
        genGroup.position.set(1.6, -1.65, -0.6);
        const skid = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 1.5), darkMetalMat);
        skid.position.set(0, 0.11, 0);
        const engine = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 1.2), darkSarkariGreenMat);
        engine.position.set(-0.35, 0.75, 0);
        const alternator = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.85, 12), darkMetalMat);
        alternator.rotation.z = Math.PI / 2;
        alternator.position.set(0.72, 0.68, 0);
        const radiator = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.15, 1.15), darkMetalMat);
        radiator.position.set(-1.12, 0.78, 0);
        const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 8), darkMetalMat);
        exhaustPipe.position.set(-0.25, 2.3, -0.35);
        const fuelTank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 0.85), darkMetalMat);
        fuelTank.position.set(-0.35, 1.45, 0);
        genGroup.add(skid, engine, alternator, radiator, exhaustPipe, fuelTank);
        zg.add(genGroup);

        // Level 2 (NA-128 Lahore): WAPDA High-Voltage Transformer Bushings & Oil Spill Slick
        const wapdaGroup = new THREE.Group();
        wapdaGroup.position.set(1.6, -1.65, -0.6);
        wapdaGroup.userData.lvl2Only = true;

        // 3 High-Voltage Ceramic Insulators (Ribbed Brown Porcelain Bushings)
        for (let ins = -0.45; ins <= 0.45; ins += 0.45) {
          const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.55, 8), ceramicInsulatorMat);
          bushing.position.set(ins, 1.85, 0);
          const terminal = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), copperBusbarMat);
          terminal.position.set(ins, 2.15, 0);
          const busbar = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2, 6), copperBusbarMat);
          busbar.rotation.x = Math.PI / 4;
          busbar.position.set(ins, 2.45, -0.4);
          wapdaGroup.add(bushing, terminal, busbar);
        }

        // Industrial Oil Spill Puddle on Concrete Floor
        const oilSlick = new THREE.Mesh(
          new THREE.CircleGeometry(1.35, 12),
          new THREE.MeshBasicMaterial({ color: 0x05070a, transparent: true, opacity: 0.88 })
        );
        oilSlick.rotation.x = -Math.PI / 2;
        oilSlick.position.set(0.2, 0.02, 0.3);
        wapdaGroup.add(oilSlick);

        // Heavy Cooling Radiator Steel Fins
        for (let rf = -0.6; rf <= 0.6; rf += 0.2) {
          const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.95, 1.3), transformerGreyMat);
          fin.position.set(-1.18, 0.75, rf);
          wapdaGroup.add(fin);
        }
        zg.add(wapdaGroup);

        // Level 3 (NA-241 Karachi): K-Electric High-Voltage Substation Plaque
        const keSubstationPlate = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.04), keElectricSignMat);
        keSubstationPlate.position.set(0, 1.85, -2.75);
        keSubstationPlate.userData.lvl3Only = true;
        zg.add(keSubstationPlate);

        // 200L Diesel Oil Drum
        const oilDrum = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.98, 10),
          new THREE.MeshLambertMaterial({ color: 0x7f1d1d })
        );
        oilDrum.position.set(2.4, -1.16, 0.5);
        zg.add(oilDrum);

        // ========================================================
        // Main Electrical Breaker & Fuse Distribution Board (خطرہ 440 وولٹ)
        // Mounted Front-and-Center with High Visibility & Direct Lighting
        // ========================================================
        const breakerBox = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.3, 0.38), darkMetalMat);
        breakerBox.position.set(0.0, 0.35, -2.6);
        breakerBox.userData.action = 'open_wire_puzzle';
        breakerBox.userData.label = 'WAPDA MAIN BREAKER';

        // High Voltage Warning Plate
        const dangerSign = new THREE.Mesh(
          new THREE.PlaneGeometry(1.4, 0.48),
          new THREE.MeshBasicMaterial({ color: 0xca8a04 })
        );
        dangerSign.position.set(0.0, 0.95, -2.40);
        dangerSign.userData.action = 'open_wire_puzzle';

        // Industrial Switch Lever on Right Edge
        const leverGroup = new THREE.Group();
        leverGroup.position.set(0.0, 0.35, -2.39);
        const leverHandle = new THREE.Mesh(
          new THREE.BoxGeometry(0.10, 0.48, 0.14),
          new THREE.MeshLambertMaterial({ color: 0xb91c1c })
        );
        leverHandle.position.set(0.85, 0.0, 0.0);
        leverHandle.rotation.z = -0.3;
        leverHandle.userData.action = 'open_wire_puzzle';
        leverGroup.add(leverHandle);

        const fuseRed = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        fuseRed.position.set(-0.5, 0.65, 0.05);
        fuseRed.userData.action = 'open_wire_puzzle';
        const fuseAmber = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
        fuseAmber.position.set(0.5, 0.65, 0.05);
        fuseAmber.userData.action = 'open_wire_puzzle';
        leverGroup.add(fuseRed, fuseAmber);

        for (let cx = -0.55; cx <= 0.55; cx += 0.35) {
          const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), darkMetalMat);
          conduit.position.set(cx, 1.75, -2.55);
          zg.add(conduit);
        }

        // Glowing outline indicating it is clickable (3D Edges Geometry)
        const outlineGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.06, 2.36, 0.42));
        const outlineMat = new THREE.LineBasicMaterial({
          color: 0x38ff62,
          transparent: true,
          opacity: 0.85,
          linewidth: 2
        });
        const breakerOutline = new THREE.LineSegments(outlineGeo, outlineMat);
        breakerOutline.position.set(0.0, 0.35, -2.6);

        // Neon border frame strip around the front perimeter for a crisp high-visibility glowing outline
        const glowGroup = new THREE.Group();
        glowGroup.position.set(0.0, 0.35, -2.40);
        const neonMat = new THREE.MeshBasicMaterial({
          color: 0x38ff62,
          transparent: true,
          opacity: 0.85
        });

        // 4 glowing border edges
        const topStrip = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.045, 0.015), neonMat);
        topStrip.position.set(0, 1.16, 0);
        const botStrip = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.045, 0.015), neonMat);
        botStrip.position.set(0, -1.16, 0);
        const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.36, 0.015), neonMat);
        leftStrip.position.set(-1.01, 0, 0);
        const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 2.36, 0.015), neonMat);
        rightStrip.position.set(1.01, 0, 0);
        glowGroup.add(topStrip, botStrip, leftStrip, rightStrip);

        // High-visibility interactive pulse badge "⚡ WAPDA 440V BREAKER [CLICK]"
        const badgeCanvas = document.createElement('canvas');
        badgeCanvas.width = 440;
        badgeCanvas.height = 90;
        const bctx = badgeCanvas.getContext('2d');
        bctx.fillStyle = '#06130b';
        bctx.fillRect(0, 0, 440, 90);
        bctx.strokeStyle = '#38ff62';
        bctx.lineWidth = 4;
        bctx.strokeRect(3, 3, 434, 84);
        bctx.fillStyle = '#facc15';
        bctx.font = 'bold 24px monospace';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.fillText('⚡ WAPDA 440V BREAKER [CLICK]', 220, 45);
        const badgeTex = new THREE.CanvasTexture(badgeCanvas);
        const badgeMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1.85, 0.42),
          new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true, opacity: 0.95 })
        );
        badgeMesh.position.set(0.0, -0.55, -2.38);
        badgeMesh.userData.action = 'open_wire_puzzle';

        // Generous invisible 3D click hit-box so clicks anywhere near box register reliably
        const cam09HitBox = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 3.2, 1.6),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        cam09HitBox.position.set(0.0, 0.35, -2.5);
        cam09HitBox.userData.action = 'open_wire_puzzle';
        zg.add(cam09HitBox);
        cam09Clickables.push(cam09HitBox);

        // Dedicated High-Intensity Inspection Spotlight for WAPDA Breaker Box
        const breakerInspectionLight = new THREE.SpotLight(0xfff8db, 2.8, 9.0, Math.PI / 3.0, 0.3, 1.0);
        breakerInspectionLight.position.set(0.0, 2.3, -1.0);
        const bLookObj = new THREE.Object3D();
        bLookObj.position.set(0.0, 0.35, -2.6);
        zg.add(bLookObj);
        breakerInspectionLight.target = bLookObj;
        breakerInspectionLight.layers.enable(0);
        breakerInspectionLight.layers.enable(1);
        breakerInspectionLight.userData.zoneIdx = idx;
        breakerInspectionLight.userData.baseIntensity = 2.8;
        zg.add(breakerInspectionLight);
        zoneLights.push(breakerInspectionLight);

        const breakerFillLight = new THREE.PointLight(0xfef08a, 1.8, 7.0);
        breakerFillLight.position.set(0.0, 1.2, -1.6);
        breakerFillLight.layers.enable(0);
        breakerFillLight.layers.enable(1);
        breakerFillLight.userData.zoneIdx = idx;
        breakerFillLight.userData.baseIntensity = 1.8;
        zg.add(breakerFillLight);
        zoneLights.push(breakerFillLight);

        zg.add(breakerBox, dangerSign, leverGroup, breakerOutline, glowGroup, badgeMesh);

        cam09BreakerBox = breakerBox;
        cam09Outline = breakerOutline;
        cam09NeonMat = neonMat;
        cam09GlowGroup = glowGroup;
        cam09Clickables.push(breakerBox, dangerSign, leverHandle, badgeMesh, topStrip, botStrip, leftStrip, rightStrip);
        clickableMeshes.push(breakerBox, dangerSign, leverHandle, badgeMesh);

        // Lead-Acid Battery Bank Rack on Left Wall
        const rack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.4, 2.2), darkMetalMat);
        rack.position.set(-2.2, -0.95, -0.8);
        zg.add(rack);
        for (let bz = -0.7; bz <= 0.7; bz += 0.7) {
          const batt = new THREE.Mesh(
            new THREE.BoxGeometry(0.42, 0.32, 0.55),
            new THREE.MeshLambertMaterial({ color: 0x18181b })
          );
          batt.position.set(-2.2, -0.65, -0.8 + bz);
          zg.add(batt);
        }

        // Industrial Caged Amber Bulkhead Lamp on Back Wall
        const bulkLamp = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.16), darkMetalMat);
        bulkLamp.position.set(0.0, 1.85, -2.65);
        
        // Tangled Hanging Overhead Severed Cables & Industrial Conduits
        const cableGeo = new THREE.CylinderGeometry(0.016, 0.016, 2.6, 6);
        const cableMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
        for (let ci = 0; ci < 3; ci++) {
          const hangingCable = new THREE.Mesh(cableGeo, cableMat);
          hangingCable.position.set(-1.2 + ci * 0.9, 1.45, -1.0 - ci * 0.4);
          hangingCable.rotation.z = (ci - 1) * 0.22;
          hangingCable.rotation.x = 0.15;
          zg.add(hangingCable);
        }
        const severedCable = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.5, 6), cableMat);
        severedCable.position.set(0.3, 1.85, -1.8);
        severedCable.rotation.z = -0.3;
        const copperTip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.08, 6), brassMat);
        copperTip.position.set(0.55, 1.15, -1.8);
        zg.add(severedCable, copperTip);

        // Generator Engine Oil Slick Pool on Concrete Floor
        const oilPuddle = new THREE.Mesh(
          new THREE.CircleGeometry(1.15, 12),
          new THREE.MeshBasicMaterial({ color: 0x050706, transparent: true, opacity: 0.88 })
        );
        oilPuddle.rotation.x = -Math.PI / 2;
        oilPuddle.position.set(1.6, -1.64, -0.4);
        zg.add(oilPuddle);
  
        const bulkLight = new THREE.PointLight(0xf97316, 1.1, 8.5);
        z.amberBeacon = bulkLight;
        bulkLight.position.set(0.0, 1.70, -2.40);
        bulkLight.layers.enable(0);
        bulkLight.layers.enable(1);
        bulkLight.userData.zoneIdx = idx;
        bulkLight.userData.baseIntensity = 1.1;
        zg.add(bulkLamp, bulkLight);
        zoneLights.push(bulkLight);

        const camLight = new THREE.PointLight(0x4a6b52, 0.15, 10);
        camLight.position.set(0, 2.2, 3.0);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      } else if (idx === 9) {
        // ========================================================
        // CAM 10: OLD LIBRARY & RECORDS ROOM (پرانا کتب خانہ اور ریکارڈ روم)
        // ========================================================
        const libFloor = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), floorMat);
        libFloor.rotation.x = -Math.PI / 2;
        libFloor.position.set(0, -1.65, 0);
        const libCeil = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 12), ceilingMat);
        libCeil.rotation.x = Math.PI / 2;
        libCeil.position.set(0, 2.45, 0);
        const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 0.35), wallMat);
        backWall.position.set(0, 0.45, -4.2);
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        leftWall.position.set(-3.0, 0.45, 0);
        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 4.2, 12), wallMat);
        rightWall.position.set(3.0, 0.45, 0);
        zg.add(libFloor, libCeil, backWall, leftWall, rightWall);

        // Tall Teakwood School Bookshelves (Almari) on Left Wall
        const shelfL = new THREE.Mesh(new THREE.BoxGeometry(0.65, 3.4, 3.8), woodMat);
        shelfL.position.set(-2.6, 0.05, -1.5);
        zg.add(shelfL);
        const bookColors = [0x7f1d1d, 0x1e3a8a, 0x14532d, 0x78350f, 0x312e81];
        for (let row = -1.0; row <= 1.2; row += 0.72) {
          for (let col = -1.4; col <= 1.4; col += 0.45) {
            const bMat = new THREE.MeshLambertMaterial({ color: bookColors[Math.floor(Math.random() * bookColors.length)] });
            const bookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.38), bMat);
            bookBlock.position.set(-2.25, row, -1.5 + col);
            zg.add(bookBlock);
          }
        }

        // Heavy Green Steel Government Record Filing Cabinet (Sarkari Almirah) on Right Wall
        const sarkariAlmirah = new THREE.Mesh(new THREE.BoxGeometry(0.72, 3.0, 1.6), almirahMat);
        sarkariAlmirah.position.set(2.55, -0.15, -1.5);
        const fileDrawerLines = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.8, 1.45), darkMetalMat);
        fileDrawerLines.position.set(2.18, -0.15, -1.5);
        zg.add(sarkariAlmirah, fileDrawerLines);

        // Central Wooden Study & Cataloging Table with Archive Bundles
        const table = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 1.5), woodMat);
        table.position.set(0, -0.92, -0.1);
        const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.72, 0.1), darkMetalMat);
        leg1.position.set(-1.15, -1.28, 0.5);
        const leg2 = leg1.clone(); leg2.position.set(1.15, -1.28, 0.5);
        const leg3 = leg1.clone(); leg3.position.set(-1.15, -1.28, -0.7);
        const leg4 = leg1.clone(); leg4.position.set(1.15, -1.28, -0.7);
        zg.add(table, leg1, leg2, leg3, leg4);

        // Bundles of official ballot records & archives tied with sarkari string
        for (const bx of [-0.85, 0.85]) {
          const recordBundle = new THREE.Mesh(
            new THREE.BoxGeometry(0.44, 0.22, 0.32),
            new THREE.MeshLambertMaterial({ color: 0xd6d3d1 })
          );
          recordBundle.position.set(bx, -0.75, -0.2);
          const ribbon = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.23, 0.33),
            new THREE.MeshLambertMaterial({ color: 0x15803d })
          );
          ribbon.position.set(bx, -0.75, -0.2);
          zg.add(recordBundle, ribbon);
        }

        // ========================================================
        // LEVEL 2 (NA-128 LAHORE): HIGH-SECURITY EXAMINATION ARCHIVES
        // (Positioned in the back corner so it NEVER blocks camera line of sight to the router!)
        // ========================================================
        const archiveCageGroup = new THREE.Group();
        archiveCageGroup.userData.lvl2Only = true;

        // Heavy Steel Security Cage Partition at back
        const cageFence = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.8, 0.05), steelWireMeshMat);
        cageFence.position.set(-1.2, 0.25, -2.8);
        const cageFrame = new THREE.Mesh(new THREE.BoxGeometry(0.10, 3.8, 0.10), darkMetalMat);
        cageFrame.position.set(0.4, 0.25, -2.8);
        archiveCageGroup.add(cageFence, cageFrame);

        // Heavy Padlock & Chain on Cage
        const cageLock = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.08), brassMat);
        cageLock.position.set(0.35, 0.0, -2.75);
        archiveCageGroup.add(cageLock);

        // Stacked Galvanized Steel Form-45 Ballot Record Trunks on Pallet
        const trunkPallet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.9), woodMat);
        trunkPallet.position.set(-1.8, -1.59, -3.4);
        archiveCageGroup.add(trunkPallet);

        for (let tr = 0; tr < 3; tr++) {
          const trunkMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.42, 0.65), darkMetalMat);
          trunkMesh.position.set(-1.8, -1.32 + tr * 0.45, -3.4 + (tr === 2 ? 0.05 : 0));
          if (tr === 2) trunkMesh.rotation.y = 0.12;
          // Green ECP Election Seal Tape
          const sealTape = new THREE.Mesh(
            new THREE.BoxGeometry(0.97, 0.06, 0.67),
            new THREE.MeshBasicMaterial({ color: 0x16a34a })
          );
          trunkMesh.add(sealTape);
          archiveCageGroup.add(trunkMesh);
        }

        // Vintage Archival Card Catalogue Index Cabinet (18 Drawers)
        const catalogCabinet = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.2, 1.6), richMahoganyMat);
        catalogCabinet.position.set(2.5, -0.55, -2.8);
        archiveCageGroup.add(catalogCabinet);

        zg.add(archiveCageGroup);

        // Level 3 (NA-241 Karachi): 19-inch Telecom Server Rack Cabinet
        const serverCabinet = new THREE.Group();
        serverCabinet.position.set(0, -1.65, -3.2);
        serverCabinet.userData.lvl3Only = true;
        const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 0.9), darkMetalMat);
        rackFrame.position.y = 1.3;
        const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, 0.04), new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.35 }));
        glassDoor.position.set(0, 1.3, 0.46);
        for (let py = 0.4; py <= 2.2; py += 0.32) {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.18, 0.8), darkMetalMat);
          panel.position.set(0, py, 0);
          const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: py > 1.2 ? 0x22c55e : 0xfacc15 }));
          ledStrip.position.set(0, py, 0.42);
          serverCabinet.add(panel, ledStrip);
        }
        serverCabinet.add(rackFrame, glassDoor);
        zg.add(serverCabinet);

        // ========================================================
        // 8. PTCL Fiber / GPON ONT Router Front-and-Center on Table
        // ========================================================
        const routerGroup = new THREE.Group();
        routerGroup.position.set(0.0, -0.80, 0.0);

        const routerBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.56, 0.08, 0.38),
          new THREE.MeshLambertMaterial({ color: 0x1e293b })
        );
        routerBody.userData.action = 'open_shark_puzzle';

        const routerTopPlate = new THREE.Mesh(
          new THREE.BoxGeometry(0.50, 0.02, 0.32),
          new THREE.MeshLambertMaterial({ color: 0x0f172a })
        );
        routerTopPlate.position.set(0, 0.04, 0);

        // Twin External Dual-Band Antennas (Angled back and outward)
        const antGeo = new THREE.CylinderGeometry(0.010, 0.010, 0.42, 6);
        const antL = new THREE.Mesh(antGeo, darkMetalMat);
        antL.position.set(-0.22, 0.18, -0.16);
        antL.rotation.x = -0.32;
        antL.rotation.z = -0.22;
        const antR = new THREE.Mesh(antGeo, darkMetalMat);
        antR.position.set(0.22, 0.18, -0.16);
        antR.rotation.x = -0.32;
        antR.rotation.z = 0.22;

        // Status LEDs array (Power, PON, LOS, LAN, WLAN)
        const ledGeo = new THREE.BoxGeometry(0.022, 0.018, 0.012);
        const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
        const losLedMat = new THREE.MeshBasicMaterial({ color: 0x15803d });
        const ledPower = new THREE.Mesh(ledGeo, greenLedMat);
        ledPower.position.set(-0.16, 0.02, 0.192);
        const ledPon = new THREE.Mesh(ledGeo, greenLedMat);
        ledPon.position.set(-0.08, 0.02, 0.192);
        const ledLos = new THREE.Mesh(ledGeo, losLedMat);
        ledLos.position.set(0.0, 0.02, 0.192);
        const ledLan = new THREE.Mesh(ledGeo, greenLedMat);
        ledLan.position.set(0.08, 0.02, 0.192);
        const ledWlan = new THREE.Mesh(ledGeo, greenLedMat);
        ledWlan.position.set(0.16, 0.02, 0.192);
        cam10RouterLosLed = ledLos;

        // Fiber-Optic Cable Jacket (Dangling from router over table edge)
        const cableGeo = new THREE.CylinderGeometry(0.010, 0.010, 0.55, 6);
        const yellowFiberMat = new THREE.MeshLambertMaterial({ color: 0xfacc15 });
        const fiberCable = new THREE.Mesh(cableGeo, yellowFiberMat);
        fiberCable.rotation.x = Math.PI / 2.2;
        fiberCable.position.set(0.10, -0.08, 0.28);

        // Alert Glowing Outline for Router (Pulses bright cyan when sharks attack!)
        const routerGlowGroup = new THREE.Group();
        const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
        const routerOutline = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.12, 0.42), neonCyanMat);
        routerOutline.position.set(0, 0.01, 0);
        routerGlowGroup.add(routerOutline);
        routerGlowGroup.visible = false;
        cam10RouterOutline = routerOutline;
        cam10RouterNeonMat = neonCyanMat;
        cam10RouterGlowGroup = routerGlowGroup;

        // Invisible Click HitBox for easy selection
        const routerHitBox = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.2), new THREE.MeshBasicMaterial({ visible: false }));
        routerHitBox.userData.action = 'open_shark_puzzle';
        routerHitBox.position.set(0, 0.15, 0);
        routerTopPlate.userData.action = 'open_shark_puzzle';

        routerGroup.add(routerBody, routerTopPlate, antL, antR, ledPower, ledPon, ledLos, ledLan, ledWlan, fiberCable, routerGlowGroup, routerHitBox);
        zg.add(routerGroup);

        cam10RouterBox = routerBody;
        cam10Clickables.push(routerHitBox, routerBody, routerTopPlate, routerOutline);

        // 2 Wooden School Chairs pulled up to table
        for (const cx of [-0.65, 0.65]) {
          const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.48), benchMat);
          chairSeat.position.set(cx, -1.24, 0.85);
          const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.55, 0.06), benchMat);
          chairBack.position.set(cx, -0.95, 1.08);
          zg.add(chairSeat, chairBack);
        }

        // Dedicated High-Intensity Overhead Enamel Pendant Lamp + Direct Spotlight on Router
        const pendantCord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.5, 6), darkMetalMat);
        pendantCord.position.set(0, 1.7, 0);
        const libShade = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.28, 12, 1, true), new THREE.MeshLambertMaterial({ color: 0x064e3b }));
        libShade.position.set(0, 0.95, 0);
        libShade.rotation.x = Math.PI;
        zg.add(pendantCord, libShade);

        const routerSpotlight = new THREE.SpotLight(0xffffff, 2.8, 7.5, Math.PI / 3.0, 0.25, 1.0);
        routerSpotlight.position.set(0, 1.0, 0);
        const rLookObj = new THREE.Object3D();
        rLookObj.position.set(0, -0.80, 0);
        zg.add(rLookObj);
        routerSpotlight.target = rLookObj;
        routerSpotlight.layers.enable(0);
        routerSpotlight.layers.enable(1);
        routerSpotlight.userData.zoneIdx = idx;
        routerSpotlight.userData.baseIntensity = 2.8;
        zg.add(routerSpotlight);
        zoneLights.push(routerSpotlight);

        const routerFillLight = new THREE.PointLight(0x93c5fd, 1.5, 6.0);
        routerFillLight.position.set(0, 0.5, 0);
        routerFillLight.layers.enable(0);
        routerFillLight.layers.enable(1);
        routerFillLight.userData.zoneIdx = idx;
        routerFillLight.userData.baseIntensity = 1.5;
        zg.add(routerFillLight);
        zoneLights.push(routerFillLight);

        const camLight = new THREE.PointLight(0x4a6b52, 0.15, 10);
        camLight.position.set(0, 2.2, 3.2);
        camLight.layers.enable(0);
        camLight.layers.enable(1);
        camLight.userData.zoneIdx = idx;
        zg.add(camLight);
        zoneLights.push(camLight);
      }
      
        // Phase 4: Overturned Election Basta (Canvas Bag) & Scattered Form-45 Sheets on Floor
        const bastaGroup = new THREE.Group();
        bastaGroup.position.set(0.4, -1.58, 0.8);
        const bastaBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 0.22, 0.38),
          new THREE.MeshLambertMaterial({ color: 0x14532d })
        );
        bastaBody.rotation.y = 0.35;
        const bastaTag = new THREE.Mesh(
          new THREE.PlaneGeometry(0.18, 0.10),
          new THREE.MeshBasicMaterial({ color: 0xfef08a })
        );
        bastaTag.position.set(0, 0.12, 0.20);
        bastaGroup.add(bastaBody, bastaTag);
        zg.add(bastaGroup);

        // Scattered official Form-45 sheets spilled across the dusty floor
        const paperMat = new THREE.MeshBasicMaterial({ color: 0xf3f4f6 });
        const paperGeo = new THREE.PlaneGeometry(0.24, 0.34);
        paperGeo.rotateX(-Math.PI / 2);
        const paperCoords = [
          [-0.3, 0.9, 0.25],
          [0.1, 1.2, -0.45],
          [0.7, 0.7, 0.65],
          [-0.6, 1.4, -0.15],
          [0.35, 1.5, 0.10],
          [-0.15, 0.5, 0.85]
        ];
        paperCoords.forEach(([px, pz, pang]) => {
          const paper = new THREE.Mesh(paperGeo, paperMat);
          paper.position.set(px, -1.645, pz);
          paper.rotation.y = pang;
          zg.add(paper);
        });
  
        z.group = zg;
      scene.add(zg);
    });

    // Subtle dim glow so the Lobby & Yard stay visible and creepy
        // CAM 05 & CAM 06: Exterior veranda bracket sconces illuminating the doorway/window
    const cam5Light = new THREE.SpotLight(0xffdf88, 4.2, 11, Math.PI / 2.8, 0.45, 1.8);
    cam5Light.position.set(-5.4, 2.4, 0.5);
    const cam5Target = new THREE.Object3D();
    cam5Target.position.set(-4.6, -0.8, -2.2);
    scene.add(cam5Target);
    cam5Light.target = cam5Target;
    cam5Light.layers.enable(0);
    cam5Light.layers.enable(1);

    const cam6Light = new THREE.SpotLight(0xffdf88, 4.2, 11, Math.PI / 2.8, 0.45, 1.8);
    cam6Light.position.set(5.4, 2.4, 0.5);
    const cam6Target = new THREE.Object3D();
    cam6Target.position.set(4.6, -0.8, -2.2);
    scene.add(cam6Target);
    cam6Light.target = cam6Target;
    cam6Light.layers.enable(0);
    cam6Light.layers.enable(1);
    scene.add(cam5Light, cam6Light);

    // Dedicated CCTV Camera Night-Vision Flashlight / Spotlight mounted on the security camera lens
    const cctvCamTarget = new THREE.Object3D();
    cctvCamTarget.position.set(0, 0, -10);
    scene.add(cctvCamTarget);

    // Dedicated CCTV Camera Night-Vision Spotlight (#66ffaa phosphor green matching Image 1)
    const cctvCamLight = new THREE.SpotLight(0x66ffaa, 3.5, 85, Math.PI / 3.8, 0.35, 0.12);
    cctvCamLight.target = cctvCamTarget;
    cctvCamLight.layers.enable(0);
    cctvCamLight.layers.enable(1);
    scene.add(cctvCamLight);

    // Dedicated Room Fill Floodlight for CCTV camera viewing (deep surveillance green)
    const cctvRoomFillLight = new THREE.PointLight(0x133827, 1.25, 42, 0.35);
    cctvRoomFillLight.layers.enable(0);
    cctvRoomFillLight.layers.enable(1);
    scene.add(cctvRoomFillLight);

    // Dedicated Monster Key Spotlight (CCTV Night Vision / Horror Beam)
    const cctvMonsterTarget = new THREE.Object3D();
    scene.add(cctvMonsterTarget);
    const cctvMonsterLight = new THREE.SpotLight(0xffe6a3, 0, 45, Math.PI / 2.8, 0.25, 0.4);
    cctvMonsterLight.target = cctvMonsterTarget;
    cctvMonsterLight.layers.enable(0);
    cctvMonsterLight.layers.enable(1);
    scene.add(cctvMonsterLight);

    // Spawn Sculpted PS1 Intruders
    const gulluMesh = createPS1Humanoid('gullu');
    gulluMesh.traverse(child => {
      if (child.isMesh) child.layers.enable(1);
    });
    scene.add(gulluMesh);

    const whitenerMesh = createPS1Humanoid('whitener');
    whitenerMesh.traverse(child => {
      if (child.isMesh) child.layers.enable(1);
    });
    scene.add(whitenerMesh);

    // Enable Layer 1 on the corridor / exterior wall / small window frame meshes
    // so leftHallLight and rightWindowLight illuminate the intruders and outside corridor,
    // while NEVER spilling onto the room interior walls, floor, blackboard or ballot box!
    const exteriorMeshes = [
      leftPeekFrame, rightPeekFrame,
      leftHallFloor, leftHallCeiling, leftHallOuterWall, leftLobbyBackWall, leftLobbyPillar, lobbyBench, lobbySconce,
      rightYardFloor, rightYardOuterWall, rightYardPillar,
      doorFrameBack, doorFrameFront, doorFrameHeader,
      winFrameGroup,
      leftDoorMesh, rightShutterMesh
 ];
    for (const em of exteriorMeshes) {
      if (em) {
        em.traverse(child => {
          if (child.isMesh) child.layers.enable(1);
        });
      }
    }

    // ---  APERTURE LURKING DEMON EYES IN PITCH-BLACK VOID (SMALL ROSHYDAN WINDOWS) ---
    const demonEyesApertureMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('data:image/png;base64,' + DEMON_EYES_B64),
      transparent: true,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
      side: THREE.DoubleSide
    });

    // Small Left Peeking Window (Demon eyes perfectly aligned with window opening void, never clipped by wall/frame)
    const leftPeekEyes = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.15), demonEyesApertureMat.clone());
    leftPeekEyes.position.set(-4.25, 1.95, -2.25);
    leftPeekEyes.rotation.set(0, Math.PI / 2, 0);
    leftPeekEyes.renderOrder = 15;
    leftPeekEyes.visible = false;
    office.add(leftPeekEyes);

    // Small Right Peeking Window (Demon eyes perfectly aligned with window opening void, never clipped by wall/frame)
    const rightPeekEyes = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.15), demonEyesApertureMat.clone());
    rightPeekEyes.position.set(4.25, 1.95, -2.25);
    rightPeekEyes.rotation.set(0, -Math.PI / 2, 0);
    rightPeekEyes.renderOrder = 15;
    rightPeekEyes.visible = false;
    office.add(rightPeekEyes);

    const lurkingEyes = {
      leftPeek: leftPeekEyes,
      rightPeek: rightPeekEyes
    };

    function applyLevel3DTheme(lvlNum) {
      const lvl = (lvlNum >= 3) ? 3 : (lvlNum === 2) ? 2 : 1;
      // 1. Toggle visibility of lvl1Only, lvl2Only, and lvl3Only objects across entire scene
      scene.traverse(obj => {
        if (obj && obj.userData) {
          if (obj.userData.lvl1Only) obj.visible = (lvl === 1);
          if (obj.userData.lvl2Only) obj.visible = (lvl === 2);
          if (obj.userData.lvl3Only) obj.visible = (lvl === 3);
        }
      });

      // 2. Dynamic Wall, Floor, Outdoor Wall & Pillar Material Updates across ENTIRE scene (RO Office + ALL CCTV Rooms + Corridors)
      const targetWallMat = (lvl === 3) ? warehouseWallMat : (lvl === 2) ? collegeWallMat : schoolWallMat;
      const targetFloorMat = (lvl === 3) ? warehouseFloorMat : (lvl === 2) ? collegeFloorMat : schoolFloorMat;
      const targetOutdoorWallMat = (lvl === 3) ? karachiBoundaryWallMat : (lvl === 2) ? lahoreBoundaryWallMat : schoolBoundaryWallMat;
      const targetPillarMat = (lvl === 3) ? karachiGatePillarMat : (lvl === 2) ? lahoreGatePillarMat : schoolGatePillarMat;

      const indoorWallMats = [schoolWallMat, collegeWallMat, warehouseWallMat];
      const floorMats = [schoolFloorMat, collegeFloorMat, warehouseFloorMat];
      const outdoorWallMats = [schoolBoundaryWallMat, lahoreBoundaryWallMat, karachiBoundaryWallMat];
      const pillarMats = [schoolGatePillarMat, lahoreGatePillarMat, karachiGatePillarMat];

      scene.traverse(child => {
        if (child && child.isMesh && child.material) {
          if (indoorWallMats.includes(child.material)) {
            child.material = targetWallMat;
          } else if (floorMats.includes(child.material)) {
            child.material = targetFloorMat;
          } else if (outdoorWallMats.includes(child.material)) {
            child.material = targetOutdoorWallMat;
          } else if (pillarMats.includes(child.material)) {
            child.material = targetPillarMat;
          }
        }
      });

      // 3. Dynamic Blackboard & Ballot Box Texture Updates
      if (typeof board !== 'undefined' && board) {
        board.material = (lvl === 3) ? boardMatLvl3 : (lvl === 2) ? boardMatLvl2 : boardMatLvl1;
      }
      if (typeof ballotBox !== 'undefined' && ballotBox) {
        ballotBox.material = (lvl === 3) ? bBoxMatLvl3 : (lvl === 2) ? bBoxMatLvl2 : bBoxMatLvl1;
      }

      // 4. Atmospheric Tint & Fog Updates (Muted, ominous survival horror tones)
      if (lvl === 3) {
        if (typeof roomLight !== 'undefined' && roomLight) roomLight.color.setHex(0x6e8399); // Desaturated cold moonlight/gunmetal
        if (typeof ambient !== 'undefined' && ambient) ambient.color.setHex(0x06090e);
        if (scene.fog) scene.fog.color.setHex(0x030508);
      } else if (lvl === 2) {
        if (typeof roomLight !== 'undefined' && roomLight) roomLight.color.setHex(0xc4a362); // Muted aged sepia-amber incandescent
        if (typeof ambient !== 'undefined' && ambient) ambient.color.setHex(0x0d0b07);
        if (scene.fog) scene.fog.color.setHex(0x0a0805);
      } else {
        if (typeof roomLight !== 'undefined' && roomLight) roomLight.color.setHex(0xd9f99d);
        if (typeof ambient !== 'undefined' && ambient) ambient.color.setHex(0x061c0d);
        if (scene.fog) scene.fog.color.setHex(0x040705);
      }

      // 2. Switch CCTV camera position, lookAt, and intruder spots
      cctvZones.forEach(z => {
        if (lvl === 3) {
          if (z.nameLvl3) z.name = z.nameLvl3;
          if (z.posLvl3) z.pos.copy(z.posLvl3);
          if (z.lookLvl3) z.look.copy(z.lookLvl3);
          if (z.intruderSpotLvl3) z.intruderSpot.copy(z.intruderSpotLvl3);
        } else if (lvl === 2) {
          if (z.nameLvl2) z.name = z.nameLvl2;
          if (z.posLvl2) z.pos.copy(z.posLvl2);
          if (z.lookLvl2) z.look.copy(z.lookLvl2);
          if (z.intruderSpotLvl2) z.intruderSpot.copy(z.intruderSpotLvl2);
        } else {
          if (z.nameLvl1) z.name = z.nameLvl1;
          if (z.posLvl1) z.pos.copy(z.posLvl1);
          if (z.lookLvl1) z.look.copy(z.lookLvl1);
          if (z.intruderSpotLvl1) z.intruderSpot.copy(z.intruderSpotLvl1);
        }
      });
    }

    root.__world3dApplyLevelTheme = applyLevel3DTheme;
    applyLevel3DTheme(1);

    // Freeze transformation matrices on purely static scene objects
    // Eliminates per-frame scene graph matrix recalculations
    const dynamicObjects = new Set([
      fanGroup, dfBlades, leftDoorMesh, rightShutterMesh, doorCrackDecal,
      windowCrackDecalL, windowCrackDecalR, leftBtnDoor3D, leftBtnLight3D,
      rightBtnDoor3D, rightBtnLight3D, vigoMesh, chowkidarMesh,
      flashlight, flashTarget, handTorchGroup, dustParticles, ceilingTubeGroup,
      handForm, handHammer, handStamp, scanLaser, scanLight, ballotBox,
      kettlePot, lidDome, teaGlass, steamGroup, chaiCup
    ]);

    scene.traverse(obj => {
      if (obj && obj.isMesh) {
        let isDyn = false;
        let curr = obj;
        while (curr) {
          if (dynamicObjects.has(curr) || (curr.userData && curr.userData.dynamic)) {
            isDyn = true;
            break;
          }
          curr = curr.parent;
        }
        if (!isDyn) {
          obj.updateMatrix();
          obj.matrixAutoUpdate = false;
        }
      }
    });

    return {
      officeGroup: office,
      leftPeekGrill,
      rightPeekGrill,
      lurkingEyes,
      ambient,
      fanGroup,
      deskFanBlades: dfBlades,
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
      crtScreenHelper,
      cctvZones,
      vigoMesh,
      chowkidarMesh,
      policeStrobeRed,
      policeStrobeBlue,
      gulluMesh,
      whitenerMesh,
      scannerScreenHelper,
      kettleStation: {
        group: kettleStationGroup,
        pot: kettlePot,
        lidDome: lidDome,
        lidKnob: lidKnob,
        light: kettleLight,
        teaGlass: teaGlass,
        steamGroup: steamGroup,
        steamPuffs: steamPuffs
      },
      scanStation: {
        group: scanStationGroup,
        paper: scanPaper,
        laser: scanLaser,
        led: scanLed,
        light: scanLight,
        lid: scanLidPivot,
        glass: scanGlass,
        screenHelper: scannerScreenHelper
      },
      handForm,
      handStamp,
      stampDesk: stampDeskGroup,
      stampBody: stampBodyGroup,
      updateFormTexture: renderForm45,
      wallHammer,
      handHammer,
      ballotBoxMesh: ballotBox,
      wireBox: {
        group: wireBoxGroup,
        alarmLight: wireBoxAlarmLight,
        beaconDome
      },
      cam09WireBox: {
        breakerBox: cam09BreakerBox,
        outline: cam09Outline,
        neonMat: cam09NeonMat,
        glowGroup: cam09GlowGroup,
        clickables: cam09Clickables
      },
      cam10Router: {
        routerBox: cam10RouterBox,
        outline: cam10RouterOutline,
        neonMat: cam10RouterNeonMat,
        glowGroup: cam10RouterGlowGroup,
        losLed: cam10RouterLosLed,
        clickables: cam10Clickables
      },
      clickableMeshes,
      leftPeekVoidMesh,
      leftPeekBackdrop,
      leftPeekMoonlight,
      rightPeekVoidMesh,
      rightPeekBackdrop,
      rightPeekMoonlight,
      applyLevel3DTheme
    };
  }

  function applyLevel3DTheme(lvlNum) {
    if (root.__world3dApplyLevelTheme) {
      root.__world3dApplyLevelTheme(lvlNum);
    }
  }

  root.World3D = {
    buildPollingStation,
    applyLevel3DTheme,
    createPS1Humanoid,
    applySkin,
    SKIN_DEFS,
    createEnragedFaceTex,
    createUncannyFaceTex
  };
})(window);
