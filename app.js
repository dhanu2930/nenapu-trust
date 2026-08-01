/* ============================================
   Nenapu Trust — app.js
   Interactive features & animations (Multi-page Edition)
   ============================================ */

(function () {
  'use strict';

  // ─── Theme Management ──────────────────────────
  document.documentElement.setAttribute('data-theme', 'light');

  // ─── Preloader & Page Transitions ──────────────
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    const showPage = () => {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
    };

    // Fade out preloader on page load completion
    window.addEventListener('load', () => {
      setTimeout(showPage, 300); // 300ms visual buffer for smooth load transition
    });

    // Handle back/forward cache (bfcache) page restores
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        showPage();
      }
    });

    // Intercept internal page links to trigger fade-in before loading new page
    document.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      if (
        href &&
        href.endsWith('.html') &&
        !href.startsWith('#') &&
        target !== '_blank'
      ) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          document.body.classList.remove('loaded');
          preloader.classList.remove('fade-out');
          setTimeout(() => {
            window.location.href = href;
          }, 400); // Match CSS fade duration (400ms)
        });
      }
    });
  }

  // ─── Navbar Active Link & Sticky Scroll ────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  function highlightActiveLink() {
    const path = window.location.pathname;
    const page = path.split('/').pop();

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      // Home page is represented by index.html, /, or empty string
      const isHome = href === 'index.html' || href === '/' || href === '';
      const isCurrentHome = page === '' || page === 'index.html' || page === '/';

      if (href && (href === page || (isHome && isCurrentHome))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  highlightActiveLink();

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  });

  // ─── Mobile Hamburger ─────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // ─── Scroll Reveal (Intersection Observer) ────
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ─── Stat Counter Animation ───────────────────
  const statNumbers = document.querySelectorAll('.stat-number span[data-target]');
  const statsSection = document.querySelector('.stats-section');
  let statsAnimated = false;

  function animateCounters() {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        counter.textContent = current.toLocaleString('en-IN');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString('en-IN');
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
          statsObserver.unobserve(statsSection);
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // ─── Program Filter ───────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  if (filterBtns.length > 0 && programCards.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        programCards.forEach((card) => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            card.offsetHeight; // trigger reflow
            card.style.animation = '';
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ─── Program Detail Modals ────────────────────
  const programDetails = {
    'program-1': {
      title: 'Saraswati Vidyadhan Scholarship',
      body: `<p>Launched in 2019, the Saraswati Vidyadhan Scholarship program identifies meritorious students from economically weaker sections across 12 districts of Karnataka.</p>
             <p><strong>What we cover:</strong></p>
             <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
               <li>Full tuition fees for primary through higher-secondary education</li>
               <li>Annual supply of textbooks, notebooks, and stationery</li>
               <li>Two sets of school uniforms per academic year</li>
               <li>Quarterly mentorship sessions with professionals</li>
             </ul>
             <p><strong>Impact so far:</strong> 1,200+ students sponsored; 94% progression rate to higher education.</p>`
    },
    'program-2': {
      title: 'Janapada Loka Folk Arts Festival',
      body: `<p>Our flagship annual cultural event brings together folk artists, musicians, dancers, and craftspeople from every corner of Karnataka for a three-day immersive celebration.</p>
             <p><strong>Highlights:</strong></p>
             <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
               <li>Yakshagana, Dollu Kunitha, and Bayalata live performances</li>
               <li>Traditional craft exhibitions and artisan marketplaces</li>
               <li>Workshops on Gamaka, Harikatha, and folk instrument making</li>
               <li>Awards for lifetime contribution to folk arts</li>
             </ul>
             <p><strong>Impact:</strong> 15 festivals completed; 500+ performing artists featured.</p>`
    },
    'program-4': {
      title: 'Mobile Science Lab Initiative',
      body: `<p>Two specially equipped mobile lab vans bring hands-on STEM education to government schools that lack laboratory infrastructure.</p>
             <p><strong>Equipment on board:</strong></p>
             <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
               <li>Compound microscopes, magnifying lenses, and dissection kits</li>
               <li>Chemistry reagents and glassware for 30+ experiments</li>
               <li>Laptops with educational software (science simulations)</li>
               <li>Robotics and basic coding kits for classes 6–10</li>
             </ul>
             <p><strong>Coverage:</strong> 50+ schools visited weekly across 8 talukas.</p>`
    },
    'program-5': {
      title: 'Heritage Documentation Project',
      body: `<p>A digital preservation initiative to record and archive Karnataka's disappearing folk traditions before they are lost forever.</p>
             <p><strong>Scope:</strong></p>
             <ul style="margin:12px 0;padding-left:20px;list-style:disc;">
               <li>Video recording of folk performances and oral histories</li>
               <li>Audio documentation of vanishing folk songs and lullabies</li>
               <li>Photography of traditional crafts, tools, and architectural heritage</li>
               <li>Open-access online archive with search and transcription</li>
             </ul>
             <p><strong>Archived so far:</strong> 800+ hours of audio/video; 5,000+ photographs.</p>`
    }
  };

  const learnMoreLinks = document.querySelectorAll('.learn-more');
  if (learnMoreLinks.length > 0) {
    learnMoreLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const key = link.getAttribute('data-modal');
        const data = programDetails[key];
        if (data) {
          openModal(`<h3>${data.title}</h3>${data.body}`);
        }
      });
    });
  }

  // ─── Modal System ─────────────────────────────
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(htmlContent) {
    if (!modalOverlay || !modalBody) return;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ─── Gallery Lightbox ─────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = item.getAttribute('data-caption') || '';
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) {
        lightbox.classList.remove('open');
      }
      document.body.style.overflow = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── Contact Form Validation ──────────────────
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Name
      const name = document.getElementById('contactName');
      if (name) {
        if (!name.value.trim()) {
          name.closest('.form-group').classList.add('has-error');
          valid = false;
        } else {
          name.closest('.form-group').classList.remove('has-error');
        }
      }

      // Email
      const email = document.getElementById('contactEmail');
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.closest('.form-group').classList.add('has-error');
          valid = false;
        } else {
          email.closest('.form-group').classList.remove('has-error');
        }
      }

      // Message
      const message = document.getElementById('contactMessage');
      if (message) {
        if (!message.value.trim()) {
          message.closest('.form-group').classList.add('has-error');
          valid = false;
        } else {
          message.closest('.form-group').classList.remove('has-error');
        }
      }

      if (valid) {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        field.closest('.form-group').classList.remove('has-error');
      });
    });
  }

  // ─── Newsletter ───────────────────────────────
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        showToast('Subscribed! Thank you for staying connected.', 'success');
        input.value = '';
      }
    });
  }

  // ─── Toast Notifications ──────────────────────
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message, type = 'success') {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.className = 'toast ' + type;
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ─── Escape key handlers ──────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      if (lightbox) {
        lightbox.classList.remove('open');
      }
      document.body.style.overflow = '';
    }
  });

  // ─── Smooth scroll for internal links ─────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
