/**
 * Nedits Edition - Main JavaScript File
 * Contains all animations and interactive elements
 */

// Initialize AOS animation library
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true
});

// Add spinner animation (only once)
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spinner {
    animation: spin 1s linear infinite;
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  .spinner circle {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-linecap: round;
  }
`;
document.head.appendChild(style);

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // 1. Typewriter Effect
  const aboutText = document.getElementById('about-text');
  if (aboutText) {
    const fullText = aboutText.textContent;
    aboutText.textContent = '';
    
    const typewriterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let i = 0;
        function type() {
          if (i < fullText.length) {
            aboutText.textContent += fullText.charAt(i++);
            setTimeout(type, 25);
          }
        }
        type();
        typewriterObserver.disconnect();
      }
    });
    typewriterObserver.observe(aboutText);
  }

  // 2. Hero Background Slideshow
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroImages = [
      'images/hero-bg1.jpg',
      'images/hero-bg2.jpg',
      'images/hero-bg3.jpg',
      'images/hero-bg4.jpg',
      'images/hero-bg5.jpg',
      'images/hero-bg6.jpg'
    ];
    let availableImages = [...heroImages];

    function changeBackground() {
      if (availableImages.length === 0) availableImages = [...heroImages];
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const selectedImage = availableImages.splice(randomIndex, 1)[0];
      hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${selectedImage}')`;
    }

    changeBackground();
    setInterval(changeBackground, 3000);
  }

  // 3. Services Carousel
  const serviceContainers = document.querySelectorAll('.services-category');
  if (serviceContainers.length > 0) {
    serviceContainers.forEach(container => {
      const carousel = container.querySelector('.services-carousel');
      const cards = Array.from(carousel.querySelectorAll('.service-card'));
      const totalCards = cards.length;
      let currentIndex = 0;
      let carouselInterval;
      let isPaused = false;
      let isAnimating = false;

      function updateCards() {
        if (isAnimating) return;
        isAnimating = true;

        cards.forEach(card => {
          card.classList.remove('center', 'left', 'right', 'active');
          card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          card.style.opacity = '0';
          card.style.transform = 'translate(-50%, -50%) scale(0.6)';
        });

        const leftIndex = (currentIndex - 1 + totalCards) % totalCards;
        const rightIndex = (currentIndex + 1) % totalCards;

        cards[leftIndex].classList.add('left');
        cards[leftIndex].style.opacity = '0.5';
        cards[leftIndex].style.transform = 'translate(-150%, -50%) scale(0.7) rotateY(30deg)';

        cards[currentIndex].classList.add('center');
        cards[currentIndex].style.opacity = '1';
        cards[currentIndex].style.transform = 'translate(-50%, -50%) scale(1.1)';

        cards[rightIndex].classList.add('right');
        cards[rightIndex].style.opacity = '0.5';
        cards[rightIndex].style.transform = 'translate(50%, -50%) scale(0.7) rotateY(-30deg)';

        setTimeout(() => isAnimating = false, 800);
      }

      function startCarousel() {
        if (isPaused) return;
        carouselInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % totalCards;
          updateCards();
        }, 3000);
      }

      carousel.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.service-card');
        if (!clickedCard || isAnimating) return;

        clearInterval(carouselInterval);
        isPaused = true;

        if (clickedCard.classList.contains('center')) {
          clickedCard.classList.toggle('active');
        } else {
          currentIndex = cards.indexOf(clickedCard);
          updateCards();
        }

        if (!carousel.querySelector('.service-card.active')) {
          isPaused = false;
          startCarousel();
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.services-category') && isPaused) {
          const activeCard = carousel.querySelector('.service-card.active');
          if (activeCard) activeCard.classList.remove('active');
          isPaused = false;
          startCarousel();
        }
      });

      updateCards();
      startCarousel();
    });
  }

  // 4. About Section Animations
  document.querySelectorAll('#about [data-anim]').forEach(el => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add('visible');
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  });

  // 5. Section Headings Animation
  const sectionHeadings = document.querySelectorAll('.section h2');
  if (sectionHeadings.length > 0) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sectionHeadings.forEach(h2 => headingObserver.observe(h2));
  }

  // 6. Smooth Scrolling
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', e => {
      if (link.hash && document.querySelector(link.hash)) {
        e.preventDefault();
        document.querySelector(link.hash).scrollIntoView({ 
          behavior: 'smooth' 
        });
      }
    });
  });

  // 7. Counter Animations
  const achievements = document.getElementById("achievements");
  if (achievements) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter("clientsCounter", 150, 4000);
        animateCounter("projectsCounter", 300, 4000);
        animateCounter("experienceCounter", 5, 2000);
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(achievements);
  }

  // 8. Timeline Animations
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(item => timelineObserver.observe(item));
  }

  // 9. Testimonials Carousel
  initTestimonialsCarousel();

  // 10. Contact Form
  handleContactForm();

  // 11. Footer Functionality
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const submitBtn = this.querySelector('button');
      
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
        </svg>
      `;
      
      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        `;
        emailInput.value = '';
        
        const successMsg = document.createElement('p');
        successMsg.className = 'newsletter-success';
        successMsg.textContent = 'Thanks for subscribing!';
        successMsg.style.color = '#7b0091';
        successMsg.style.marginTop = '10px';
        successMsg.style.fontSize = '0.9rem';
        newsletterForm.appendChild(successMsg);
        
        setTimeout(() => {
          submitBtn.innerHTML = originalHTML;
          successMsg.remove();
        }, 3000);
      }, 1500);
    });
  }
  
  // Footer link animations
  const footerLinks = document.querySelectorAll('.footer-links a, .footer-services a');
  footerLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateX(5px)';
    });
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateX(0)';
    });
  });
});

// Testimonials Carousel Function
function initTestimonialsCarousel() {
  const carousel = document.querySelector('.testimonials-carousel');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!carousel || cards.length === 0 || !prevBtn || !nextBtn || !dotsContainer) return;

  let autoScrollInterval;
  let isHovering = false;

  function getVisibleCardsCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function scrollToCard(index) {
    const cardWidth = cards[0].offsetWidth + 30;
    carousel.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
    updateActiveDot(index);
  }

  function getCurrentGroupIndex() {
    const cardWidth = cards[0].offsetWidth + 30;
    const visibleCards = getVisibleCardsCount();
    return Math.round(carousel.scrollLeft / (cardWidth * visibleCards));
  }

  function updateActiveDot(index) {
    document.querySelectorAll('.carousel-dot').forEach(dot => dot.classList.remove('active'));
    const dots = document.querySelectorAll('.carousel-dot');
    const groupIndex = Math.floor(index / getVisibleCardsCount());
    if (dots[groupIndex]) {
      dots[groupIndex].classList.add('active');
    }
  }

  function generateDots() {
    dotsContainer.innerHTML = '';
    const visibleCards = getVisibleCardsCount();
    const totalGroups = Math.ceil(cards.length / visibleCards);

    for (let i = 0; i < totalGroups; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => scrollToCard(i * visibleCards));
      dotsContainer.appendChild(dot);
    }
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      if (isHovering) return;

      const visibleCards = getVisibleCardsCount();
      const currentIndex = getCurrentGroupIndex();
      const totalGroups = Math.ceil(cards.length / visibleCards);
      const nextIndex = (currentIndex + 1) % totalGroups;

      scrollToCard(nextIndex * visibleCards);
    }, 5000);
  }

  function resetAutoScroll() {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  }

  // Event Listeners
  prevBtn.addEventListener('click', () => {
    const visibleCards = getVisibleCardsCount();
    const index = getCurrentGroupIndex();
    scrollToCard(Math.max(0, index - 1) * visibleCards);
    resetAutoScroll();
  });

  nextBtn.addEventListener('click', () => {
    const visibleCards = getVisibleCardsCount();
    const index = getCurrentGroupIndex();
    const maxIndex = Math.ceil(cards.length / visibleCards) - 1;
    scrollToCard(Math.min(maxIndex, index + 1) * visibleCards);
    resetAutoScroll();
  });

  carousel.addEventListener('mouseenter', () => {
    isHovering = true;
    clearInterval(autoScrollInterval);
  });

  carousel.addEventListener('mouseleave', () => {
    isHovering = false;
    resetAutoScroll();
  });

  carousel.addEventListener('scroll', () => {
    updateActiveDot(getCurrentGroupIndex() * getVisibleCardsCount());
  });

  window.addEventListener('resize', () => {
    generateDots();
    resetAutoScroll();
  });

  generateDots();
  startAutoScroll();
}

// Contact Form Function
function handleContactForm() {
  const form = document.getElementById('neditsContactForm');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"></circle>
      </svg>
      Sending...
    `;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Message Sent!
      `;
      
      form.reset();
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 3000);
    } catch (error) {
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Error! Try Again
      `;
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
      }, 3000);
    }
  });
}

// Counter Animation Function
function animateCounter(elementId, target, duration) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let start = 0;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  requestAnimationFrame(updateCounter);
}
