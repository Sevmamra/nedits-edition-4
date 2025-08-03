// Init AOS
AOS.init();

// About typewriter with optional looping
document.addEventListener('DOMContentLoaded', () => {
  const about = document.getElementById('about-text');
  if (about) {
    const full = about.textContent;
    about.textContent = '';
    let i = 0;
    function type() {
      if (i < full.length) about.textContent += full.charAt(i++);
      if (i < full.length) setTimeout(type, 25);
    }
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        type();
        obs.disconnect();
      }
    });
    obs.observe(about);
  }

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark')
    document.body.classList.add('dark-mode');
});

// Hero background slideshow
(function(){
  const hero = document.querySelector('.hero');
  const imgs = ['images/hero-bg1.jpg','images/hero-bg2.jpg','images/hero-bg3.jpg','images/hero-bg4.jpg','images/hero-bg5.jpg'];
  let pool = [...imgs];
  function nextBg(){
    if (!hero) return;
    if (!pool.length) pool = [...imgs];
    const idx = Math.floor(Math.random()*pool.length);
    const sel = pool.splice(idx,1)[0];
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url('${sel}')`;
  }
  nextBg(); setInterval(nextBg,3000);
})();

// Services carousel
(function(){
  const containers = document.querySelectorAll('.services-category');
  containers.forEach(container => {
    const carousel = container.querySelector('.services-carousel');
    const cards = Array.from(carousel.children);
    let current = 0, paused=false, animating=false;
    function update(){
      if(animating) return;
      animating=true;
      cards.forEach(c=>{
        c.classList.remove('left','center','right','active');
        c.style.transition='all 0.8s cubic-bezier(0.25,0.46,0.45,0.94)';
      });
      const total = cards.length;
      const left = (current -1 + total)%total;
      const right = (current+1)%total;
      cards[left].classList.add('left');
      cards[current].classList.add('center');
      cards[right].classList.add('right');
      setTimeout(()=> animating=false,800);
    }
    update();
    let id = setInterval(()=>{
      if(!paused){
        current=(current+1)%cards.length;
        update();
      }
    },3000);
    carousel.addEventListener('click', e=>{
      const clicked = e.target.closest('.service-card');
      if(clicked && !animating){
        clearInterval(id); paused=true;
        const idx = cards.indexOf(clicked);
        if(clicked.classList.contains('center')){
          clicked.classList.toggle('active');
        } else if(idx>=0){
          current=idx; update();
        }
        if(!carousel.querySelector('.active')){
          paused=false;
          id = setInterval(()=>{
            current=(current+1)%cards.length;
            update();
          },3000);
        }
      }
    });
    document.addEventListener('click', e=>{
      if(!e.target.closest('.services-category') && paused){
        const a = carousel.querySelector('.active');
        if(a) a.classList.remove('active');
        paused=false;
        id = setInterval(()=>{
          current=(current+1)%cards.length;
          update();
        },3000);
      }
    });
  });
})();

// Scroll-trigger animations for testimonials
(function(){
  const tests = document.querySelectorAll('.testimonial');
  window.addEventListener('scroll', ()=>{
    tests.forEach((t,i)=>{
      if(t.getBoundingClientRect().top < window.innerHeight - 50 && !t.classList.contains('shown')){
        t.classList.add('shown');
        t.style.transform = i%2===0 ? 'translateX(-100px)' : 'translateX(100px)';
        setTimeout(()=>{
          t.style.transition='all 0.6s';
          t.style.transform='translateX(0)';
          t.style.opacity=1;
        },50);
      }
    });
  });
})();

// Smooth scroll & ScrollSpy
(function(){
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', ()=>{
    let cur='';
    sections.forEach(s=>{
      const top = s.offsetTop - 100;
      if(scrollY >= top) cur = s.getAttribute('id');
    });
    links.forEach(a=>{
      a.classList.remove('active');
      if(a.getAttribute('href').includes(cur)) a.classList.add('active');
    });
  });
  links.forEach(a=>{
    a.addEventListener('click', e=>{
      if(a.hash && document.querySelector(a.hash)){
        e.preventDefault();
        document.querySelector(a.hash).scrollIntoView({ behavior:'smooth' });
      }
    });
  });
})();

// Dark mode toggle
document.getElementById('toggle-theme').addEventListener('click', ()=>{
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme',
    document.body.classList.contains('dark-mode') ? 'dark':'light'
  );
});
