// NA-47 Complete Game Audio & Dialogue Catalog
(function(root) {
  'use strict';

  const AUDIO_ITEMS = [
    {
      id: 'homescreen_menu',
      title: 'Homescreen Main Menu Theme (Loop)',
      category: 'atmosphere',
      speaker: 'Soundtrack',
      type: 'sfx_manifest',
      key: 'homescreen_menu',
      file: 'assets/sfx/homescreen_menu.mp3',
      urdu: 'مین مینیو اور ہوم اسکرین کا پراسرار بیک گراؤنڈ میوزک',
      desc: 'Atmospheric retro menu theme music that loops on the title homescreen.'
    },

    // ==========================================
    // 1. PHONE GUY & RADIO CALLS
    // ==========================================
    {
      id: 'intro_call',
      title: 'Opening Night Briefing (Phone Guy)',
      category: 'radio',
      speaker: 'Colleague / Phone Guy',
      type: 'sfx_file',
      file: 'intro_call.mp3',
      urdu: 'Assalam-o-Alaikum! Polling booth par aap ki night shift shuru ho gayi hai. Subah cheh bajay Fajr tak aap ne sabz Ballot Box se saaray Form-45 nikaal kar baayein taraf scanner par scan aur portal par upload karnay hain. Raat ko bahar ka mahaul thora ajeeb hota hai, is liye bas thori ehtiyat rakhna—CCTV cameras aur chhoti khirkiyon se bahar zaroor dekhtay rehna, aur jab bahar koi nazar aaye toh scan mat karna. Agar koi darwazay ya khirki ke qareeb aaye toh kundi aur shutter band kar lena, aur zaroorat paray toh deewar par tangay hathoray se unki marammat bhi kar lena. Haan, daaein taraf ketli mein chai ubaal kar cam 01 par Chacha Chowkidar ko bhejtay rehna taakay woh gate par jaagtay rahein. School ki wiring purani hai—agar bijli trip ho toh cam 09 mein taarein jor lena, aur WiFi ka masla ho toh CAM 10 mein router dekh lena.  Yaad rakhna, aapkey paas subha 6 bajey tak ka waqt hai aur UPS ki battery aur form 45 ki hifazat karna. Aur haa Apna khayal rakhna!',
      english: "Peace be upon you! Your night shift at the polling booth has started. By 6:00 AM Fajr, you need to take all Form-45 sheets from the green Ballot Box, scan them on the left scanner, and upload them to the portal. The area outside gets a bit strange late at night, so just be careful—keep checking the CCTV cameras and the small peek windows, and don't scan if you see someone outside. If anyone comes near the door or window, lock the bolt and shutter, and if needed, use the hammer hanging on the wall to repair them. Also, boil tea in the kettle on the right and keep sending it to Chacha Chowkidar on CAM 01 so he stays awake at the gate. The school's wiring is old—if the power trips, reconnect the wires on CAM 09, and if the WiFi acts up, check the router on CAM 10. Remember, keeping the doors shut lowers both WiFi signal and UPS battery. Take care of yourself!",
      context: 'Plays at 12:00 AM on the rotary telephone over vintage bandpass telephone filter as shift begins.',
      action: (audio, opt) => {
        audio.stopPhoneGuy();
        audio.speakPhoneGuy();
      },
      stopAction: (audio) => {
        audio.stopPhoneGuy();
      }
    },

    // ==========================================
    // 2. KHAKI (AGENCY OPERATIVE — LEFT DOOR)
    // ==========================================
    {
      id: 'khaki_gate_rattle',
      title: 'CAM 01 Gate Clatter & Chain Link Rattle',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: '[Bahar School Gate par zanjeer hilnay ki kharkharahat]',
      english: 'Heavy iron school gate clatter, chain rattle and low diesel engine rumble at CAM 01.',
      context: 'Spawns at CAM 01 School Gate when Khaki begins his stalk towards the polling room.',
      action: (audio) => audio.khakiGateRattle()
    },
    {
      id: 'khaki_heavy_boot',
      title: 'Heavy Military Combat Boot & Holster',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: '[Bhari Fauji Booton ki chaap aur leather holster ki awaz]',
      english: 'Deliberate heavy combat boot step on concrete with leather holster squeak.',
      context: 'Heard panning left as Khaki prowls through CAM 02 & CAM 03 corridors.',
      action: (audio) => audio.khakiHeavyBoot(-0.85)
    },
    {
      id: 'khaki_lurk',
      title: 'CAM 05 Peek Window Lurk Warning',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: '[Khirki ki salakhon par dastaano ki ragar aur dabi hui hansi]',
      english: 'Deep sub-bass vibration, leather gloves rubbing iron window bars, and mocking chortle.',
      context: 'Triggered when Khaki reaches CAM 05 Peek Window directly outside your left line of sight.',
      action: (audio) => audio.khakiLurkWarning()
    },
    {
      id: 'khaki_door_creak',
      title: 'Left Doorway Frame Stress & Handle Creak',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: '[Darwazay ke frame par shadeed dabao aur kundi hilnay ki awaz]',
      english: 'Violent door frame stress creak and heavy handle rattle.',
      context: 'Warns player that Khaki has reached the Left Doorway and is preparing to strike.',
      action: (audio) => audio.khakiDoorCreakWarning()
    },
    {
      id: 'bang_door',
      title: 'Violent Fist Pounding on Iron Door',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/bang_door.mp3',
      urdu: '*DHAM! DHAM! DHAM!*',
      english: 'Heavy fist pounding and sledgehammer impact against the closed iron door.',
      context: 'Plays whenever Khaki assaults the closed Left Door to batter down its health.',
      action: (audio) => audio.khakiDoorBang(-0.95)
    },
    {
      id: 'radio_squelch',
      title: 'Walkie-Talkie Chirp & RF Squelch Burst',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: '*krrr-chk... chk*',
      english: 'Sharp tactical walkie-talkie chirp and RF squelch burst on the left headphone.',
      context: 'Direct audio tell when Khaki activates his comms before advancing.',
      action: (audio) => audio.radioSquelchCue(-0.85)
    },
    {
      id: 'khaki_guttural_laugh',
      title: 'Khaki Deep Guttural Mocking Laugh',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'synth',
      urdu: 'Hah hah hah... kya kundi laga ke bacho ge?',
      english: 'Hah hah hah... you think locking the bolt will save you? The black Vigo is outside...',
      context: 'Plays periodically when Khaki stalks the corridors in Stage 1 & 2.',
      action: (audio) => audio.khakiGutturalLaugh(-0.8)
    },
    {
      id: 'khaki_line_stage0_1',
      title: 'Khaki Voice: "Assalam-o-Alaikum... sirf do minute"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Assalam o Alaikum bhai jaan, darna mat, kundi kholo, sirf do minute ki baat hai',
      english: 'Peace be upon you brother, don\'t be afraid, unlatch the bolt, it\'s only two minutes.',
      context: 'Stage 0 polite approach at the Left Doorway.',
      action: (audio) => audio.knockAndYell(-0.85, 'Assalam o Alaikum bhai jaan, darna mat, kundi kholo, sirf do minute ki baat hai', 0)
    },
    {
      id: 'khaki_line_stage0_2',
      title: 'Khaki Voice: "Chhotay bhai... chai peetay hain mil ke"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Chhotay bhai, darwaza kholo na, chai peetay hain mil ke',
      english: 'Little brother, open the door, let\'s drink tea together.',
      context: 'Stage 0 deceptive calm at Left Doorway.',
      action: (audio) => audio.knockAndYell(-0.85, 'Chhotay bhai, darwaza kholo na, chai peetay hain mil ke', 0)
    },
    {
      id: 'khaki_line_stage1_1',
      title: 'Khaki Voice: "Oye ustaad, upar se order hai!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Oye ustaad, mazaq band kar ab! Upar se order hai, darwaza khol!',
      english: 'Hey master, stop joking around! Orders from above, open the door!',
      context: 'Stage 1 escalating demand at Left Doorway.',
      action: (audio) => audio.knockAndYell(-0.85, 'Oye ustaad, mazaq band kar ab! Upar se order hai, darwaza khol!', 1)
    },
    {
      id: 'khaki_line_stage1_2',
      title: 'Khaki Voice: "Tu bara ziddi banda hai, kundi hata!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Yaar tu bara ziddi banda hai, kundi hata warna bad-mazgi ho jaye gi!',
      english: 'Friend, you are very stubborn, remove the bolt or things will turn sour!',
      context: 'Stage 1 tense confrontation at the door.',
      action: (audio) => audio.knockAndYell(-0.85, 'Yaar tu bara ziddi banda hai, kundi hata warna bad-mazgi ho jaye gi!', 1)
    },
    {
      id: 'khaki_line_stage2_1',
      title: 'Khaki Voice: "Main darwaza tor ke andar aa jaoon ga!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Oye main darwaza tor ke andar aa jaoon ga! Ballot box idhar la!',
      english: 'I will break down the door and come in! Hand over the ballot box!',
      context: 'Stage 2 aggressive door battering.',
      action: (audio) => audio.knockAndYell(-0.85, 'Oye main darwaza tor ke andar aa jaoon ga! Ballot box idhar la!', 2)
    },
    {
      id: 'khaki_line_stage2_2',
      title: 'Khaki Voice: "Bahar kaala dala khara hai! Software update karoon?!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Oye darwaza khol! Bahar kaala dala khara hai! Software update karoon tera?!',
      english: 'Open the door! The black Vigo is outside! Shall I update your software?!',
      context: 'Stage 2 high threat assault on the door.',
      action: (audio) => audio.knockAndYell(-0.85, 'Oye darwaza khol! Bahar kaala dala khara hai! Software update karoon tera?!', 2)
    },
    {
      id: 'khaki_line_retreat',
      title: 'Khaki Voice: "Uff! Munh par darwaza maar diya!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Kundi khol!',
      english: 'Uff! Slammed the door in my face! Open the bolt!',
      context: 'Heard when player slams the Left Door right as Khaki charges.',
      action: (audio) => audio.knockAndYell(-0.85, 'Kundi khol!', 1)
    },
    {
      id: 'khaki_distant_corridor',
      title: 'Khaki Distant Corridor Whisper',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'voice',
      urdu: 'Presiding Officer sahab... akele bethe ho andhere mein? Hum aa rahe hain...',
      english: 'Presiding Officer sir... sitting alone in the dark? We are coming...',
      context: 'Distant psychological taunt from CAM 02 or CAM 03.',
      action: (audio) => audio.corridorTaunt(-0.75, 'Presiding Officer sahab... akele bethe ho andhere mein? Hum aa rahe hain...', 1)
    },
    {
      id: 'khaki_enraged_scan_1',
      title: 'Khaki Enraged: "Ruk ja saaley!!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_enraged_1.wav',
      urdu: 'Ruk ja saaley!!',
      english: 'Stop right there, you scoundrel!!',
      context: 'Enraged reaction #1 when Khaki catches player scanning Form-45.',
      action: (audio) => audio.playSample('khaki_enraged_1', -0.85, 1.65, 0.0)
    },
    {
      id: 'khaki_enraged_scan_2',
      title: 'Khaki Enraged: "Tera khel khattam!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_enraged_2.wav',
      urdu: 'Tera khel khattam!',
      english: 'Your game is over!',
      context: 'Enraged reaction #2 when Khaki catches player scanning Form-45.',
      action: (audio) => audio.playSample('khaki_enraged_2', -0.85, 1.65, 0.0)
    },
    {
      id: 'khaki_enraged_scan_3',
      title: 'Khaki Enraged: "Darwaza todh du ga!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_enraged_3.wav',
      urdu: 'Darwaza todh du ga!',
      english: 'I will break this door down!',
      context: 'Enraged reaction #3 when Khaki catches player scanning Form-45.',
      action: (audio) => audio.playSample('khaki_enraged_3', -0.85, 1.65, 0.0)
    },
    {
      id: 'khaki_enraged_scan_4',
      title: 'Khaki Enraged: "Sabar Kar abhi aya!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_enraged_4.wav',
      urdu: 'Sabar Kar abhi aya!',
      english: 'Hold on, I am coming right in!',
      context: 'Enraged reaction #4 when Khaki catches player scanning Form-45.',
      action: (audio) => audio.playSample('khaki_enraged_4', -0.85, 1.65, 0.0)
    },
    {
      id: 'khaki_enraged_scan_5',
      title: 'Khaki Enraged: "Zyada Hoshiyar mat ban!"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_enraged_5.wav',
      urdu: 'Zyada Hoshiyar mat ban!',
      english: 'Do not try to be too clever!',
      context: 'Enraged reaction #5 when Khaki catches player scanning Form-45.',
      action: (audio) => audio.playSample('khaki_enraged_5', -0.85, 1.65, 0.0)
    },
    {
      id: 'khaki_distant_whisper_1',
      title: 'Khaki Hallway Roam Whisper 1: "RO sahib form agency ke hawale kardein.."',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_distant_1.wav',
      urdu: 'RO sahib form agency ke hawale kardein..',
      english: 'RO sahib, hand the forms over to the agency..',
      context: 'Eerie low-volume hallway whisper #1 when Khaki moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('khaki_distant_1', -0.55, 0.30, 0.0)
    },
    {
      id: 'khaki_distant_whisper_2',
      title: 'Khaki Hallway Roam Whisper 2: "Bahir vigo start khadhi hai.. *giggles*"',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_distant_2.wav',
      urdu: 'Bahir vigo start khadhi hai.. *giggles*',
      english: 'The Vigo is running and waiting outside.. *giggles*',
      context: 'Eerie low-volume hallway whisper #2 when Khaki moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('khaki_distant_2', -0.55, 0.30, 0.0)
    },
    {
      id: 'khaki_distant_whisper_3',
      title: 'Khaki Hallway Roam Whisper 3: "Ye mulk ki salamti ke liye hai, beta..."',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'sfx_file',
      file: 'assets/sfx/khaki_distant_3.wav',
      urdu: 'Ye mulk ki salamti ke liye hai, beta...',
      english: 'This is for the national security of the country, son...',
      context: 'Eerie low-volume hallway whisper #3 when Khaki moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('khaki_distant_3', -0.55, 0.30, 0.0)
    },
    {
      id: 'jumpscare_khaki',
      title: 'Khaki Full Jumpscare Execution (3 Phases)',
      category: 'khaki',
      speaker: 'Khaki (The Agency Operative)',
      type: 'jumpscare',
      urdu: 'Chal bhai, Vigo mein beth! Software update ka waqt ho gaya! Hahaha!',
      english: 'Let\'s go brother! Get into the Vigo! Hahaha! (Complete shockwave, door tear, operative roar, tinnitus & dying heartbeat)',
      context: 'Plays when Left Door breaches and Khaki catches the Presiding Officer.',
      action: (audio) => audio.jumpscare('gullu')
    },

    // ==========================================
    // 3. BABU (CIVIL SERVANT — RIGHT WINDOW)
    // ==========================================
    {
      id: 'babu_paper',
      title: 'Staff Room Manila Folder & Paper Shuffle',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: '[Staff Room mein sarkari files aur carbon paper ulat-pulat karnay ki awaz]',
      english: 'Fast, nervous shuffling of official Manila file folders & carbon papers in Staff Room (CAM 04).',
      context: 'Spawns at CAM 04 Staff Room when Babu begins his hunt for Form-45.',
      action: (audio) => audio.babuPaperShuffle(0.8)
    },
    {
      id: 'babu_shoes',
      title: 'Squeaky Polished Formal Shoes Scurry',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: '[Tiles par sarkari polished jooton ki tezi se bhagnay ki awaz]',
      english: 'Squeaky formal polished leather dress shoes scurrying across corridor tiles.',
      context: 'Heard panning right as Babu moves through CAM 07 & CAM 08 corridors.',
      action: (audio) => audio.babuSqueakFootsteps(0.8)
    },
    {
      id: 'babu_stamp',
      title: 'Official Rubber Stamp Impact & Inkpad Thud',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: '*THUP!* [Sarkari mohar laganay aur inkpad par marnay ki awaz]',
      english: 'Dense physical rubber stamp impact and inkpad thud on wooden desk.',
      context: 'Audible tell when Babu prepares official paperwork alteration.',
      action: (audio) => audio.babuStampClick(0.75)
    },
    {
      id: 'babu_tap_warning',
      title: 'CAM 06 Peek Window Glass Tap & Grill Tremor',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: '[Khirki ke sheeshay par ungliyon ki dastak aur zang-aloor grill ki kapkapahat]',
      english: 'Sharp rhythmic fingernail tap on window glass (*tik... tik... tik...*) & security grill tremor.',
      context: 'Triggered when Babu reaches CAM 06 Peek Window directly outside your right window.',
      action: (audio) => audio.babuWindowTapWarning()
    },
    {
      id: 'babu_rattle_warning',
      title: 'Right Window Shutter Tremor & Bar Shaking',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: '[Lakhri ke shutter aur lohay ki salakhon ko shadeed jhanjhorna]',
      english: 'Violent window shutter tremor and iron bar rattling as Babu assaults the window.',
      context: 'Warns player that Babu has reached the Right Window and is rattling the bars.',
      action: (audio) => audio.babuWindowRattleWarning()
    },
    {
      id: 'bang_window',
      title: 'Heavy Fist Pounding on Window Frame',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/bang_window.mp3',
      urdu: '*KHAT! KHAT! KHAT!*',
      english: 'Heavy fist pounding against the closed wooden window frame.',
      context: 'Plays whenever Babu hammers the closed Right Window shutter to force entry.',
      action: (audio) => audio.babuDoorBang(0.95)
    },
    {
      id: 'window_bars',
      title: 'Iron Security Window Grill Furiously Rattling',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/window_bars.mp3',
      urdu: '[Khirki ki salakhon ko zor zor se hilana]',
      english: 'Iron window security grill vibrating under violent force.',
      context: 'Plays during intense window rattle assaults by Babu.',
      action: (audio) => audio.barRattle(0.85)
    },
    {
      id: 'babu_sinister_chuckle',
      title: 'Babu Sinister Bureaucratic Chuckle',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'synth',
      urdu: 'Heh heh heh... form idhar laao beta, whitener to lagay ga...',
      english: 'Heh heh heh... hand over the form son, the whitener will be applied...',
      context: 'Gloating bureaucratic snicker heard when Babu is nearby on the right.',
      action: (audio) => audio.babuSinisterChuckle(0.8)
    },
    {
      id: 'babu_line_stage0_1',
      title: 'Babu Voice: "Beta bas ek chhota sa sifar barhana hai"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Beta ghabrao mat, bas ek chhota sa sifar hi toh barhana hai',
      english: 'Son don\'t worry, we just need to add a small zero to the count.',
      context: 'Stage 0 deceptively friendly dialogue at the Right Window.',
      action: (audio) => audio.knockAndYell(0.85, 'Beta ghabrao mat, bas ek chhota sa sifar hi toh barhana hai', 0)
    },
    {
      id: 'babu_line_stage0_2',
      title: 'Babu Voice: "Excuse me beta... chhoti si tashee karni hai"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Excuse me beta, khirki kholo zara, Form 45 par chhoti si tashee karni hai',
      english: 'Excuse me son, open the window, small correction needed on Form-45.',
      context: 'Stage 0 polite bureaucratic pretext at the window.',
      action: (audio) => audio.knockAndYell(0.85, 'babu_window_1', 0)
    },
    {
      id: 'babu_line_stage1_1',
      title: 'Babu Voice: "Meri ainak ka number barh raha hai!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Meri ainak ka number barh raha hai aur mera ghussa bhi! Form bahar pakrao!',
      english: 'My eyeglass number is rising and so is my anger! Hand the form outside!',
      context: 'Stage 1 irritated civil servant dialogue at Right Window.',
      action: (audio) => audio.knockAndYell(0.85, 'Meri ainak ka number barh raha hai aur mera ghussa bhi! Form bahar pakrao!', 1)
    },
    {
      id: 'babu_line_stage1_2',
      title: 'Babu Voice: "Sarkari kaam mein rukawat mat dalo!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Bhai yeh kya bad-tameezi hai? Sarkari kaam mein rukawat mat dalo, khirki kholo!',
      english: 'Brother what insolence is this? Do not obstruct official work, open up!',
      context: 'Stage 1 haughty bureaucratic threat.',
      action: (audio) => audio.knockAndYell(0.85, 'babu_window_2', 1)
    },
    {
      id: 'babu_line_stage2_1',
      title: 'Babu Voice: "Whitener sookh raha hai mera, nateeja badloon ga!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Oye darwaza khol! Whitener sookh raha hai mera, nateeja badal ke rahoon ga!',
      english: 'Open up! My correction fluid is drying up, I will alter the outcome!',
      context: 'Stage 2 unhinged shouting at the Right Window.',
      action: (audio) => audio.knockAndYell(0.85, 'babu_warn_3', 2)
    },
    {
      id: 'babu_line_stage2_2',
      title: 'Babu Voice: "Main Grade 18 ka Babu hoon! Form idhar la!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Oye khirki khol! Main Grade 18 ka Babu hoon! Form idhar la abhi!',
      english: 'Open the window! I am a Grade 18 Officer! Hand the form here right now!',
      context: 'Stage 2 furious authority assertion.',
      action: (audio) => audio.knockAndYell(0.85, 'babu_window_3', 2)
    },
    {
      id: 'babu_line_open_window',
      title: 'Babu Voice: "Arrey waah, khirki khol di! Pakro form!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Arrey waah, khirki khol di! Pakro form!',
      english: 'Oh wonderful, you opened the window! Snatch the form!',
      context: 'Shouted when Babu finds the Right Shutter open and lunges inside.',
      action: (audio) => audio.knockAndYell(0.85, 'Arrey waah, khirki khol di! Pakro form!', 2)
    },
    {
      id: 'babu_line_retreat',
      title: 'Babu Voice: "Band kar lo khirki, kab tak upload karo ge?"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Band kar lo khirki, dekhta hoon kab tak upload kartay ho form!',
      english: 'Close the window then, let\'s see how long you manage to upload the form!',
      context: 'Spoken when player slams the shutter just in time before Babu breaches.',
      action: (audio) => audio.knockAndYell(0.85, 'babu_retreat', 1)
    },
    {
      id: 'babu_hammer_taunt',
      title: 'Babu Hammer Taunt: "Hamare paas Dollar whitener hai!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'voice',
      urdu: 'Koshish bekaar hai janaab, hamare paas Dollar whitener hai!',
      english: 'Your efforts are futile sir, we have Dollar brand correction fluid!',
      context: 'Taunt triggered when player uses the claw hammer to repair the right window.',
      action: (audio) => audio.corridorTaunt(0.8, 'Koshish bekaar hai janaab, hamare paas Dollar whitener hai!', 1)
    },
    {
      id: 'babu_enraged_scan_1',
      title: 'Babu Enraged: "Oye scan mat kar!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_enraged_1.wav',
      urdu: 'Oye scan mat kar!',
      english: 'Hey, do not scan that!',
      context: 'Enraged reaction #1 when Babu catches player scanning Form-45.',
      action: (audio) => audio.playSample('babu_enraged_1', 0.85, 1.65, 0.0)
    },
    {
      id: 'babu_enraged_scan_2',
      title: 'Babu Enraged: "Form scan mat kar!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_enraged_2.wav',
      urdu: 'Form scan mat kar!',
      english: 'Do not scan the form!',
      context: 'Enraged reaction #2 when Babu catches player scanning Form-45.',
      action: (audio) => audio.playSample('babu_enraged_2', 0.85, 1.65, 0.0)
    },
    {
      id: 'babu_enraged_scan_3',
      title: 'Babu Enraged: "Oye! Form idhar la!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_enraged_3.wav',
      urdu: 'Oye! Form idhar la!',
      english: 'Hey! Hand that form over here!',
      context: 'Enraged reaction #3 when Babu catches player scanning Form-45.',
      action: (audio) => audio.playSample('babu_enraged_3', 0.85, 1.65, 0.0)
    },
    {
      id: 'babu_enraged_scan_4',
      title: 'Babu Enraged: "Teri naukri gayi!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_enraged_4.wav',
      urdu: 'Teri naukri gayi!',
      english: 'Your job is gone!',
      context: 'Enraged reaction #4 when Babu catches player scanning Form-45.',
      action: (audio) => audio.playSample('babu_enraged_4', 0.85, 1.65, 0.0)
    },
    {
      id: 'babu_enraged_scan_5',
      title: 'Babu Enraged: "Abey scanner se dur reh!"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_enraged_5.wav',
      urdu: 'Abey scanner se dur reh!',
      english: 'Hey, stay away from that scanner!',
      context: 'Enraged reaction #5 when Babu catches player scanning Form-45.',
      action: (audio) => audio.playSample('babu_enraged_5', 0.85, 1.65, 0.0)
    },
    {
      id: 'babu_distant_whisper_1',
      title: 'Babu Hallway Roam Whisper 1: "Scan na karna beta.."',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_distant_1.wav',
      urdu: 'Scan na karna beta.. *giggles*',
      english: 'Do not scan it, son.. *giggles*',
      context: 'Eerie low-volume hallway whisper #1 when Babu moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('babu_distant_1', 0.55, 0.30, 0.0)
    },
    {
      id: 'babu_distant_whisper_2',
      title: 'Babu Hallway Roam Whisper 2: "Nateeja to tabdeel hokey rahe ga..."',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_distant_2.wav',
      urdu: 'Nateeja to tabdeel hokey rahe ga... *giggles*',
      english: 'The result will be altered regardless... *giggles*',
      context: 'Eerie low-volume hallway whisper #2 when Babu moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('babu_distant_2', 0.55, 0.30, 0.0)
    },
    {
      id: 'babu_distant_whisper_3',
      title: 'Babu Hallway Roam Whisper 3: "Tu to gaya..."',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_distant_3.wav',
      urdu: 'Tu to gaya... *giggles*',
      english: 'You are a goner... *giggles*',
      context: 'Eerie low-volume hallway whisper #3 when Babu moves between rooms while player is scanning in office.',
      action: (audio) => audio.playSample('babu_distant_3', 0.55, 0.30, 0.0)
    },
    {
      id: 'babu_vpn_sabotage_1',
      title: 'Babu VPN Sabotage 1: "Arey, Net chala gaya?"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_vpn_sabotage.wav',
      urdu: 'Arey, Net chala gaya?',
      english: 'Oh, did the internet go out?',
      context: 'Taunt #1 when PTA shark severs the internet wire at CAM 10.',
      action: (audio) => audio.playSample('babu_vpn_sabotage', 0.20, 1.25, 0.0)
    },
    {
      id: 'babu_vpn_sabotage_2',
      title: 'Babu VPN Sabotage 2: "Connection ke bghair kaise upload karo ge?"',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'sfx_file',
      file: 'assets/sfx/babu_vpn_sabotage_2.wav',
      urdu: 'Connection ke bghair kaise upload karo ge? *giggles*',
      english: 'Without a connection, how will you upload? *giggles*',
      context: 'Taunt #2 when PTA shark severs the internet wire at CAM 10.',
      action: (audio) => audio.playSample('babu_vpn_sabotage_2', 0.20, 1.25, 0.0)
    },
    {
      id: 'jumpscare_babu',
      title: 'Babu Full Jumpscare Execution (3 Phases)',
      category: 'babu',
      speaker: 'Babu (Grade-18 Civil Servant)',
      type: 'jumpscare',
      urdu: 'Aaaaagh! Hahaha! Hahahaha! Form idhar laao!',
      english: 'Aaaaagh! (Complete glass fracture, deep guttural scream, concussion tinnitus & dying heartbeat)',
      context: 'Plays when Right Window breaches and Babu attacks.',
      action: (audio) => audio.jumpscare('whitener')
    },

    // ==========================================
    // 4. OFFICE & HARDWARE DEFENSE SFX
    // ==========================================
    {
      id: 'door_slam',
      title: 'Left Iron Door Slam',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/door_slam.mp3',
      urdu: '*THARRAAK!*',
      english: 'Heavy iron security door slamming shut on the left side.',
      context: 'Triggered when clicking the Left Door button or pressing Q.',
      action: (audio) => audio.doorSlam(true)
    },
    {
      id: 'door_kundi',
      title: 'Heavy Iron Sliding Bolt (Kundi Lock)',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/door_kundi.mp3',
      urdu: '*KHATAK!* [Lohay ki kundi band karna]',
      english: 'Heavy iron sliding bolt latching securely into bracket bracket bracket.',
      context: 'Plays immediately after the Left Door slams shut.',
      action: (audio) => audio.playSample('door_kundi', -0.85, 1.45)
    },
    {
      id: 'door_open',
      title: 'Left Door Rusty Hinge Creak & Unlatch',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/door_open.mp3',
      urdu: '[Zang-aloor darwaza khulnay ki awaz]',
      english: 'Rusty iron hinge groan and unhooking latch.',
      context: 'Triggered when opening the Left Door to repair hinges.',
      action: (audio) => audio.doorSlam(false)
    },
    {
      id: 'shutter_slam',
      title: 'Right Wooden Window Shutter Slam',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/shutter_slam.mp3',
      urdu: '*PATAKH!*',
      english: 'Dense solid wood window shutter slamming shut on the right.',
      context: 'Triggered when clicking the Right Shutter button or pressing E.',
      action: (audio) => audio.shutterSlam(true)
    },
    {
      id: 'shutter_latch',
      title: 'Brass Chitkani Tower Bolt Lock',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/shutter_latch.mp3',
      urdu: '*CLICK!* [Pittal ki chitkani band karna]',
      english: 'Solid brass tower bolt sliding down into socket.',
      context: 'Plays immediately after the Right Shutter slams shut.',
      action: (audio) => audio.playSample('shutter_latch', 0.85, 1.25)
    },
    {
      id: 'shutter_open',
      title: 'Right Window Shutter Creaking Open',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/shutter_open.mp3',
      urdu: '[Lakhri ki khirki kholna]',
      english: 'Wooden window shutter creaking open to allow repairs.',
      context: 'Triggered when opening Right Shutter to repair window hinges.',
      action: (audio) => audio.shutterSlam(false)
    },
    {
      id: 'flashlight_click',
      title: 'Tactical Flashlight Switch Click',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/flashlight_click.mp3',
      urdu: '*CLICK!*',
      english: 'Tactile heavy rubber flashlight switch click and subtle filament pop.',
      context: 'Plays whenever flashlight is turned on or off (F key or button).',
      action: (audio) => audio.flashlightClick(true)
    },
    {
      id: 'hammer_strike',
      title: 'Claw Hammer Strike on Metal Hinge / Nail',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/hammer_strike.mp3',
      urdu: '*THANNG!*',
      english: 'Solid metallic hammer impact driving reinforcement nails into door/window frame.',
      context: 'Plays rhythmically while holding Left Click with claw hammer equipped (H key).',
      action: (audio) => audio.hammerStrike(0)
    },
    {
      id: 'scanner_loop',
      title: 'Form-45 Optical Scanner Motor Hum',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'synth',
      urdu: '[Scanner motor ki tez awaz]',
      english: 'High-resolution document scanner optical stepper motor whine and scanning beam.',
      context: 'Loops continuously while scanning the physical Form-45 sheet.',
      action: (audio) => audio.startScannerLoop(),
      stopAction: (audio) => audio.stopScannerLoop()
    },
    {
      id: 'scan_success',
      title: 'Form-45 Scanner Digitized Success Chime',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'synth',
      urdu: '*TING-TING!* [Scanner par Form-45 scan mukammal]',
      english: 'Dual harmonic electronic chime signaling successful Form-45 capture.',
      context: 'Plays the instant scanning hits 100%.',
      action: (audio) => audio.scanSuccessChime()
    },
    {
      id: 'upload_packet',
      title: 'Form-45 Upload Packet Transmission Chime',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'synth',
      urdu: '*PI-PIRIP!*',
      english: 'High-frequency digital transmission chirp for encrypted Form-45 packet.',
      context: 'Plays periodically as Form-45 data uploads to the public election server.',
      action: (audio) => audio.uploadPacketChime()
    },
    {
      id: 'form_collected',
      title: 'Paper Handling & Ballot Box Latch Thud',
      category: 'office',
      speaker: 'Office Environment',
      type: 'sfx_file',
      file: 'assets/sfx/form_collected.mp3',
      urdu: '[Form-45 kaghazat aur ballot box ka dhakkan]',
      english: 'Crisp paper handling and heavy green ballot box latch thud.',
      context: 'Plays when picking up or placing Form-45 documents on the desk.',
      action: (audio) => audio.formCollected()
    },
    {
      id: 'cctv_toggle',
      title: 'Analog CCTV Monitor Flip Up / Down',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'sfx_file',
      file: 'assets/sfx/cctv_toggle.mp3',
      urdu: '[CCTV monitor screen kholnay / band karnay ki awaz]',
      english: 'Heavy monitor metal hinge latch click and CRT screen degauss/surge.',
      context: 'Plays when toggling the CCTV Surveillance Monitor (Space / S key).',
      action: (audio) => audio.cctvToggle(true)
    },
    {
      id: 'cctv_switch',
      title: 'CCTV Camera Channel Switch & Static Blip',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'sfx_file',
      file: 'assets/sfx/cctv_switch.mp3',
      urdu: '*KRR-CLIK!*',
      english: 'Tactile CCTV switcher button clack and quick video static burst.',
      context: 'Plays whenever switching between CAM 01 - CAM 09.',
      action: (audio) => audio.cctvBlip()
    },
    {
      id: 'vpn_trip',
      title: 'Telecom Disconnect / VPN Trip Alert (SIT Tones)',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'sfx_file',
      file: 'assets/sfx/vpn_trip.mp3',
      urdu: '[Internet katnay ki emergency warning]',
      english: 'Abrupt line drop and international Special Information Tone (SIT) triple disconnect chirp.',
      context: 'Plays when the internet router trips and internet drops to 0 kbps.',
      action: (audio) => audio.sharkAlert()
    },
    {
      id: 'vpn_reconnect',
      title: 'Telecom Reconnect / DTMF Modem Handshake',
      category: 'office',
      speaker: 'Office Hardware',
      type: 'sfx_file',
      file: 'assets/sfx/vpn_reconnect.mp3',
      urdu: '[Dial-up speed dial aur internet bahal hona]',
      english: 'Speed-dial DTMF tones and high modem carrier handshake restoring internet.',
      context: 'Plays when internet connection successfully reconnects.',
      action: (audio) => audio.vpnReconnect()
    },
    {
      id: 'heartbeat_pulse',
      title: 'Visceral "Lub-Dub" Proximity Heartbeat',
      category: 'office',
      speaker: 'Player Physical State',
      type: 'synth',
      urdu: '*Dhak... Dhak...*',
      english: 'Deep 64Hz -> 26Hz sub-bass cardiac punch indicating extreme monster proximity.',
      context: 'Pulses through headphones when Khaki or Babu is at your door or window.',
      action: (audio) => audio.pulseHeartbeat(0, 0.9)
    },
    {
      id: 'fajr_azan',
      title: '6:00 AM Fajr Dawn Azan & Morning Birds',
      category: 'office',
      speaker: 'Ambience / Victory',
      type: 'synth',
      urdu: 'Allahu Akbar... [Subah ki Azaan aur parinday]',
      english: 'Echoing reverent Fajr Azan melody across Islamabad hills, chirping sparrows, and fading Vigo engine.',
      context: 'Plays at 6:00 AM when the Presiding Officer successfully survives the night.',
      action: (audio) => audio.fajrDawnCutscene()
    },
    {
      id: 'victory_chime',
      title: '5-Note Harmonic Victory Fanfare',
      category: 'office',
      speaker: 'Ambience / Victory',
      type: 'synth',
      urdu: '[Jeet ka taraana]',
      english: 'Bright 5-note harmonic victory chime on democracy defended screen.',
      context: 'Plays on the Victory Screen.',
      action: (audio) => audio.victoryChime()
    },

    // ==========================================
    // 5. POWER SABOTAGE & WIRE REPAIR EMERGENCY
    // ==========================================
    {
      id: 'emergency_alarm',
      title: '10-Second Industrial Klaxon Emergency Alarm',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*WHEE-WOO! WHEE-WOO!* [10-Second Emergency Generator Alert]',
      english: 'Two-tone 580Hz / 440Hz industrial horn sounding during generator sabotage.',
      context: 'Loudly blares when Khaki cuts the generator wires at CAM 09.',
      action: (audio) => audio.startEmergencyAlarm(),
      stopAction: (audio) => audio.stopEmergencyAlarm()
    },
    {
      id: 'emergency_countdown',
      title: 'Sabotage Countdown Urgent Beeps',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*PIP! PIP! PIP!*',
      english: 'High-pitch urgency beeps escalating as the 10-second timer runs down.',
      context: 'Beeps every second until the wire puzzle is solved.',
      action: (audio) => audio.emergencyCountdownBeep(2.0)
    },
    {
      id: 'wire_pickup',
      title: 'Wire Terminal Lead Pickup',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '[Taar uthanay ki awaz]',
      english: 'Tactile wire connector grab tone in CAM 09 wire puzzle.',
      context: 'Triggered when clicking a wire terminal in CAM 09.',
      action: (audio) => audio.wirePickup()
    },
    {
      id: 'wire_snap',
      title: 'High-Voltage Wire Connection Snap',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*TACK!* [Taar jurrnay ki awaz]',
      english: 'High-voltage snap and metallic contact click when connecting wires correctly.',
      context: 'Plays on successful wire circuit match.',
      action: (audio) => audio.wireSnap()
    },
    {
      id: 'wire_buzz',
      title: '120Hz Line Fault Buzz',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*BZZZZZZ!* [Ghalat taar jurrnay par short circuit]',
      english: 'Raspy 120Hz electrical fault buzz on incorrect wire connection.',
      context: 'Plays if player tries to wire wrong color terminals.',
      action: (audio) => audio.wireBuzz()
    },
    {
      id: 'breaker_snap',
      title: 'Heavy Knife Switch Breaker Snap & Arc',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*CLANK! ZZZT!* [Main circuit breaker band hona]',
      english: 'Heavy iron knife switch snap and sharp blue arc spark burst.',
      context: 'Plays when generator breaker trips.',
      action: (audio) => audio.breakerSnap(-0.6)
    },
    {
      id: 'power_spark',
      title: 'Generator Fuse Arc Sparks',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*CHRR-CHRR-ZZT!* [Chingariyan]',
      english: 'Staccato crackling arc sparks from pulled generator fuses.',
      context: 'Heard while Khaki is sabotaging the wirebox.',
      action: (audio) => audio.powerSabotageSpark(-0.6)
    },
    {
      id: 'wire_puzzle_complete',
      title: 'Generator Contactor Slam & Power Restore Chime',
      category: 'sabotage',
      speaker: 'Power Room (CAM 09)',
      type: 'synth',
      urdu: '*KHADHAKK!* [Generator dobara chal gaya]',
      english: 'Industrial contactor solenoid slam, rising generator sweep, and ascending power-up chime.',
      context: 'Plays when player reconnects all 4 wire pairs in CAM 09.',
      action: (audio) => audio.wirePuzzleComplete()
    },

    // ==========================================
    // 6. CREEPY ATMOSPHERE & GHOSTLY FOLEY
    // ==========================================
    {
      id: 'room_ambience',
      title: 'Level 1: Acoustic Room Tone & Fan Hum (Islamabad)',
      category: 'atmosphere',
      speaker: 'School Room Environment',
      type: 'sfx_file',
      file: 'assets/sfx/room_ambience.mp3',
      urdu: '[Kamray ka sannata aur puranay pankhay ki awaz]',
      english: 'Natural acoustic room tone, faint wall creaks, and vintage ceiling fan motor for Level 1.',
      context: 'Continuous background bed throughout Level 1 (NA-47 Islamabad).',
      action: (audio) => audio.startAmbience(1),
      stopAction: (audio) => audio.stopAmbience()
    },
    {
      id: 'ambience_lahore',
      title: 'Level 2: Lahore Old Degree College Ambience',
      category: 'atmosphere',
      speaker: 'Lahore College Environment',
      type: 'sfx_file',
      file: 'assets/sfx/ambience_lahore.mp3',
      urdu: '[Lahore Old Degree College ka pur-asrar background music aur sannata]',
      english: 'Eerie, resonant background ambience music replacing the Level 1 theme in Level 2 (NA-128 Lahore).',
      context: 'Continuous background bed throughout Level 2 (NA-128 Lahore).',
      action: (audio) => audio.startAmbience(2),
      stopAction: (audio) => audio.stopAmbience()
    },
    {
      id: 'ambience_karachi',
      title: 'Level 3: Karachi RO Central Warehouse Ambience',
      category: 'atmosphere',
      speaker: 'Karachi Warehouse Environment',
      type: 'sfx_file',
      file: 'assets/sfx/ambience_karachi.mp3',
      urdu: '[Karachi RO Central Warehouse ki barri gunj aur port industrial ambience]',
      english: 'Deep, industrial port and vast RO warehouse ambient music for Level 3 (NA-241 Karachi).',
      context: 'Continuous background bed throughout Level 3 (NA-241 Karachi).',
      action: (audio) => audio.startAmbience(3),
      stopAction: (audio) => audio.stopAmbience()
    },
    {
      id: 'ups_hum',
      title: '50Hz Pakistani UPS Inverter Mains Hum',
      category: 'atmosphere',
      speaker: 'School Room Environment',
      type: 'synth',
      urdu: '[Desi Pakistani UPS inverter ki 50Hz gunj]',
      english: 'Warm 50Hz electrical hum filtered through lowpass transformer resonance.',
      context: 'Underlies the entire polling room soundscape.',
      action: (audio) => {
        audio.init();
        if (audio.ctx) {
          const osc = audio.ctx.createOscillator();
          const g = audio.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(50, audio.ctx.currentTime);
          const f = audio.ctx.createBiquadFilter();
          f.type = 'lowpass';
          f.frequency.value = 125;
          g.gain.setValueAtTime(0.08, audio.ctx.currentTime);
          osc.connect(f);
          f.connect(g);
          g.connect(audio.getMasterNode());
          osc.start();
          setTimeout(() => { try { osc.stop(); } catch(_) {} }, 4000);
        }
      }
    },
    {
      id: 'creepy_giggle',
      title: 'Ghostly Child Giggling in Empty Corridor',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: 'He-he-he... kon hai wahan?...',
      english: '4 staccato formant vocal giggles and eerie Urdu whisper down the dark hallway.',
      context: 'Acoustic psychological scare in the midnight silence of the school.',
      action: (audio) => audio.creepySchoolGiggle(0.0)
    },
    {
      id: 'creepy_whisper',
      title: 'Ghostly Midnight Hallway Whispers',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'voice',
      urdu: '...hum aa gaye hain... darwaza kholo... vote kahan hain?...',
      english: '...we have arrived... open the door... where are the votes?...',
      context: 'Breathy corridor exhalations between 2:00 AM and 5:00 AM.',
      action: (audio) => audio.creepyWhisperTaunt(0.0)
    },
    {
      id: 'creepy_scrape',
      title: 'Heavy Iron Bench Drag on Concrete Floor',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '[Khaali classroom mein lohay ke bench ko ghasitnay ki khaufnaak awaz]',
      english: 'Violent friction resonance of iron furniture legs dragging over unpolished concrete.',
      context: 'Echoes from distant empty classrooms.',
      action: (audio) => audio.creepyScrape(-0.4)
    },
    {
      id: 'creepy_thud',
      title: 'Sudden Heavy Register Box Drop',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '*DHAM!* [Khaali kamray mein bhari register girna]',
      english: 'Sudden dense physical register box impact on wooden floorboards followed by faint rattle.',
      context: 'Sudden scare from dark classrooms.',
      action: (audio) => audio.creepyThud(0.4)
    },
    {
      id: 'creepy_wind',
      title: 'Cold Midnight Wind Gust through Veranda',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '[Baramday mein thandi hawa ka jhonka]',
      english: 'Low-frequency winter draft rushing through corrugated iron veranda roofing.',
      context: 'Subtle atmospheric swell between monster attacks.',
      action: (audio) => audio.creepyWindGust()
    },
    {
      id: 'creepy_stairs_creak',
      title: 'Creaking Wooden Floorboards / Stairs',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '[Lakri ke farsh ya seedhiyon par dabao ki awaz]',
      english: 'Authentic wood groan stress (*creeeaaak*) on old school stairs.',
      context: 'Heard when something is ascending or pacing the veranda.',
      action: (audio) => audio.creepyStairsCreak(-0.5)
    },
    {
      id: 'creepy_clock',
      title: 'Antique Pendulum Clock Hollow Tick-Tock',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '*Tik... Tok...*',
      english: 'Hollow wooden pendulum clock tick-tock marking the dead of night.',
      context: 'Heard faintly in the quiet polling room.',
      action: (audio) => audio.creepyClockTick()
    },
    {
      id: 'creepy_dog',
      title: 'Distant Islamabad Stray Dogs Howling',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '[Dour se kuttay ke roan-nay ki awaz]',
      english: 'Melancholic distant dog howl echoing from sector streets.',
      context: 'Occurs in the early morning hours.',
      action: (audio) => audio.creepyDistantDog()
    },
    {
      id: 'creepy_breath',
      title: 'Cold Breath / Draft Whoosh',
      category: 'atmosphere',
      speaker: 'Supernatural Director',
      type: 'synth',
      urdu: '[Thandi saans ki sarsarahat]',
      english: 'Subtle exhalation whoosh brushing against the polling booth window.',
      context: 'Heard when sanity or temperature drops.',
      action: (audio) => audio.creepyColdBreath(0.0)
    }
  ];

  root.GAME_AUDIO_CATALOG = AUDIO_ITEMS;
})(typeof window !== 'undefined' ? window : this);
