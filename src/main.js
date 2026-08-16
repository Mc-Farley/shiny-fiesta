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
function react(type, custom) {
  clearTimeout(busy); img.src = `assets/${type}.webp`; state.textContent = moods[type][0]; line.textContent = custom || moods[type][1]
  speech.classList.remove('pop'); void speech.offsetWidth; speech.classList.add('pop')
  document.querySelectorAll('.actions button').forEach(b => b.classList.toggle('active', b.dataset.mood === type))
  busy = setTimeout(() => { img.src='assets/idle.webp'; state.textContent=moods.idle[0]; line.textContent=moods.idle[1]; document.querySelectorAll('.active').forEach(b=>b.classList.remove('active')) }, 4200)
}
document.querySelectorAll('[data-mood]').forEach(b => b.addEventListener('click', () => react(b.dataset.mood)))
document.querySelector('#pet').addEventListener('click', () => { tapCount++; react(tapCount % 4 === 0 ? 'angry' : 'tap') })
document.querySelector('#feed').addEventListener('click', () => { snackCount++; document.querySelector('#snacks').textContent=String(snackCount).padStart(2,'0'); react('happy', snackCount > 6 ? 'More? Hmph. I suppose I can make room…' : 'A snack?! Acceptable tribute, human.') })
setInterval(()=>{ const s=Math.floor((Date.now()-start)/1000), h=Math.floor(s/3600), m=Math.floor(s/60)%60; document.querySelector('#uptime').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s%60).padStart(2,'0')}` },1000)
setTimeout(()=>react('wave'),500)
