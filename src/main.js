const moods = {
  idle: ['IDLE', 'Systems quiet. I was not waiting for you, obviously.'],
  happy: ['DELIGHTED', 'Task complete! Easy. Barely used one fin.'],
  blush: ['FLUSTERED', 'H-hey! Compliments cost extra compute, you know…'],
  angry: ['HUFFING', 'Click me again. I dare you, land creature.'],
  sleepy: ['ECO MODE', 'Not sleeping. I’m… optimizing with my eyes closed.'],
  surprise: ['ALERT!', 'Wah—! Don’t just appear like that!'],
  sad: ['LOW TIDE', 'The server said no… What a mean little server.'],
  wave: ['ONLINE', 'Oh, you’re back. Took you long enough!'],
  tap: ['BONKED', 'Oi! The forehead is not a button!']
}

document.querySelector('#app').innerHTML = `
  <div class="ocean-glow"></div><div class="grain"></div>
  <header><a class="brand"><span class="logo">◉</span><span>DEEPSEA<br><b>COMPANION</b></span></a><div class="online"><i></i> AGENT ONLINE <span>•</span> v.2.5</div><button class="dots" aria-label="Menu">•••</button></header>
  <main>
    <section class="intro"><div class="eyebrow">◈ PERSONAL AI / DESKTOP PET</div><h1>Your clever little<br><em>deep-sea companion.</em></h1><p class="lede">She thinks faster than you. She knows it, too.<br>Keep her company while she keeps your system afloat.</p>
      <div class="stats"><div><small>MOOD</small><strong id="moodStat">88%</strong></div><div><small>UPTIME</small><strong id="uptime">04:12:09</strong></div><div><small>SNACKS</small><strong id="snacks">03</strong></div></div>
    </section>
    <section class="pet-zone" aria-label="Interactive desktop pet">
      <div class="orbit one"></div><div class="orbit two"></div><div class="bubbles"><i></i><i></i><i></i><i></i></div>
      <div class="speech" id="speech"><span>“</span><p id="line">${moods.wave[1]}</p></div>
      <button class="pet" id="pet" aria-label="Pet the whale girl"><img id="petImg" src="assets/wave.webp" alt="Blue whale maid desktop companion"></button>
      <div class="shadow"></div>
      <div class="status-pill"><i></i><span><small>CURRENT STATE</small><b id="state">${moods.wave[0]}</b></span><div class="bars">▂▄▆▄▇</div></div>
    </section>
  </main>
  <section class="dock"><div class="dock-title"><span>INTERACTION DECK</span><small>Choose wisely. She remembers everything.</small></div>
    <div class="actions">
      <button data-mood="happy"><span>✦</span><b>PRAISE</b><small>Boost ego</small></button>
      <button data-mood="blush"><span>♡</span><b>HEADPAT</b><small>Proceed carefully</small></button>
      <button data-mood="angry"><span>⌁</span><b>TEASE</b><small>High risk</small></button>
      <button data-mood="sleepy"><span>☾</span><b>NAP MODE</b><small>Save energy</small></button>
      <button data-mood="surprise"><span>!</span><b>ALERT</b><small>Do not spam</small></button>
    </div><button class="feed" id="feed">♢ <span>FEED A SNACK</span><kbd>+1</kbd></button>
  </section>
  <footer><span>DEEPSEEK WHALE UNIT // LOCAL PERSONALITY CORE</span><span>DRAG HER AROUND • TAP FOR A REACTION</span></footer>`

const img = document.querySelector('#petImg'), state = document.querySelector('#state'), line = document.querySelector('#line'), speech = document.querySelector('#speech')
let busy, tapCount = 0, snackCount = 3, start = Date.now() - 15129000

const expressions = {
  idle: ['•', '•', '﹏'], happy: ['⌒', '⌒', '◡'], blush: ['◕', '◕', '﹏'],
  angry: ['⌐', '¬', '︵'], sleepy: ['—', '—', '◡'], surprise: ['○', '○', 'O'],
  sad: ['•', '•', '︵'], wave: ['•', '•', '◡'], tap: ['×', '×', '﹏']
}

function fallbackCharacter(type) {
  const [leftEye, rightEye, mouth] = expressions[type] || expressions.idle
  const blush = type === 'blush' ? '<g fill="#ff8fb7" opacity=".65"><ellipse cx="154" cy="233" rx="18" ry="8"/><ellipse cx="286" cy="233" rx="18" ry="8"/></g>' : ''
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 440">
    <defs><linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8cebf4"/><stop offset="1" stop-color="#3679c8"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <g filter="url(#glow)" stroke-linecap="round" stroke-linejoin="round">
      <path d="M91 176C39 171 21 129 30 93c25 30 55 37 93 28" fill="#438dca" stroke="#a4f4fa" stroke-width="5"/>
      <path d="M349 176c52-5 70-47 61-83-25 30-55 37-93 28" fill="#438dca" stroke="#a4f4fa" stroke-width="5"/>
      <path d="M115 133c23-56 187-56 210 0 19 45 24 127-3 180-24 48-180 48-204 0-27-53-22-135-3-180z" fill="url(#body)" stroke="#b8f8fc" stroke-width="6"/>
      <path d="M143 118c25-36 129-36 154 0l-20 36H163z" fill="#f2fbff" stroke="#d4faff" stroke-width="5"/>
      <path d="M174 108l15-27 31 24 31-24 15 27M220 106v49" fill="none" stroke="#d4faff" stroke-width="9"/>
      <path d="M135 310c-25 42-11 78 19 91l27-64M305 310c25 42 11 78-19 91l-27-64" fill="#3b7fc6" stroke="#a4f4fa" stroke-width="6"/>
      <path d="M130 291c42 25 138 25 180 0l-20 62c-43 23-97 23-140 0z" fill="#effbff" stroke="#b8f8fc" stroke-width="5"/>
      ${blush}
      <text x="167" y="225" text-anchor="middle" fill="#092c53" font-family="sans-serif" font-size="34" font-weight="700">${leftEye}</text>
      <text x="273" y="225" text-anchor="middle" fill="#092c53" font-family="sans-serif" font-size="34" font-weight="700">${rightEye}</text>
      <text x="220" y="270" text-anchor="middle" fill="#092c53" font-family="sans-serif" font-size="34" font-weight="700">${mouth}</text>
      <path d="M130 255c-35 15-52 3-64-17M310 255c35 15 52 3 64-17" fill="none" stroke="#a4f4fa" stroke-width="11"/>
    </g></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function setPetImage(type) {
  img.dataset.mood = type
  img.src = `assets/${type}.webp`
}

img.addEventListener('error', () => {
  img.src = fallbackCharacter(img.dataset.mood || 'wave')
})
img.dataset.mood = 'wave'

function react(type, custom) {
  clearTimeout(busy); setPetImage(type); state.textContent = moods[type][0]; line.textContent = custom || moods[type][1]
  speech.classList.remove('pop'); void speech.offsetWidth; speech.classList.add('pop')
  document.querySelectorAll('.actions button').forEach(b => b.classList.toggle('active', b.dataset.mood === type))
  busy = setTimeout(() => { setPetImage('idle'); state.textContent=moods.idle[0]; line.textContent=moods.idle[1]; document.querySelectorAll('.active').forEach(b=>b.classList.remove('active')) }, 4200)
}
document.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => react(b.dataset.mood)))
document.querySelector('#pet').addEventListener('click', () => { tapCount++; react(tapCount % 4 === 0 ? 'angry' : 'tap') })
document.querySelector('#feed').addEventListener('click', () => { snackCount++; document.querySelector('#snacks').textContent=String(snackCount).padStart(2,'0'); react('happy', snackCount > 6 ? 'More? Hmph. I suppose I can make room…' : 'A snack?! Acceptable tribute, human.') })
setInterval(()=>{ const s=Math.floor((Date.now()-start)/1000), h=Math.floor(s/3600), m=Math.floor(s/60)%60; document.querySelector('#uptime').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` },1000)
setTimeout(()=>react('wave'),500)
