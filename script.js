/* =========================================================
   Creovix Solution — main.js
   Handles: nav scroll, mobile menu, FAQ accordion,
            scroll animations, form submission
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Navigation: scroll state ----- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Active nav link ----- */
  const navLinks = document.querySelectorAll('.nav__link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----- Mobile hamburger ----- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav  = document.querySelector('.nav__mobile');
  const mobileClose= document.querySelector('.nav__mobile-close');

  const openMobile = () => {
    hamburger && hamburger.classList.add('open');
    mobileNav  && mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMobile = () => {
    hamburger && hamburger.classList.remove('open');
    mobileNav  && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger  && hamburger.addEventListener('click', openMobile);
  mobileClose && mobileClose.addEventListener('click', closeMobile);

  document.querySelectorAll('.nav__mobile-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  /* ----- FAQ Accordion ----- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer   = item.querySelector('.faq__answer');

    question && question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // close all
      document.querySelectorAll('.faq__item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const a = other.querySelector('.faq__answer');
          if (a) a.style.maxHeight = null;
        }
      });

      // toggle current
      item.classList.toggle('open', !isOpen);
      if (answer) {
        answer.style.maxHeight = isOpen ? null : answer.scrollHeight + 'px';
      }
    });
  });

  /* ----- Scroll-triggered animations ----- */
  const animEls = document.querySelectorAll('.animate-fade-up');
  if ('IntersectionObserver' in window && animEls.length > 0) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    animEls.forEach(el => io.observe(el));
  } else {
    // fallback: show everything
    animEls.forEach(el => el.classList.add('visible'));
  }

  /* ----- Contact form validation & submission (FormSubmit.co) ----- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const originalText = btn.textContent;

      // Basic client-side validation
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EF4444';
          field.addEventListener('input', () => {
            field.style.borderColor = '';
          }, { once: true });
        }
      });

      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value && !/\S+@\S+\.\S+/.test(emailField.value)) {
        valid = false;
        emailField.style.borderColor = '#EF4444';
      }

      if (!valid) return;

      btn.textContent = 'Sending Message…';
      btn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://formsubmit.co/ajax/creovixsolution@creovixsolution.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        const data = await response.json();

        if (data.success === 'true' || data.success === true) {
          if (formSuccess) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            const sTitle = formSuccess.querySelector('h3');
            const sDesc = formSuccess.querySelector('p');
            if (sTitle) sTitle.textContent = 'Message Sent!';
            if (sDesc) sDesc.textContent = "Thank you for reaching out. We've received your message and will get back to you within one business day.";
          } else {
            btn.textContent = '✓ Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
            contactForm.reset();
          }
        } else if (data.message && data.message.toLowerCase().includes('confirm')) {
          // One-time email activation required by FormSubmit
          if (formSuccess) {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            const sTitle = formSuccess.querySelector('h3');
            const sDesc = formSuccess.querySelector('p');
            if (sTitle) sTitle.textContent = 'Action Required: Activate Your Form';
            if (sDesc) sDesc.innerHTML = 'FormSubmit has sent a one-time activation link to <strong>creovixsolution@creovixsolution.com</strong>.<br><br>👉 Please open your <strong>Zoho Mail</strong> (check <strong>Inbox</strong> or <strong>Spam / Junk</strong> folder) and click <strong>"Activate Form"</strong>.<br><br>Once you click it once, all future submissions will arrive straight in your inbox!';
          }
        } else {
          // If AJAX endpoint returns another state, fallback to native submission
          contactForm.submit();
        }
      } catch (err) {
        // Fallback to standard form POST submission
        contactForm.submit();
      }
    });
  }

  /* ----- Smooth anchor scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Parallax hero glow ----- */
  const heroGlow = document.querySelector('.hero__glow');
  if (heroGlow) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }
});
