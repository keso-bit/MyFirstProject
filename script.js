/**
 * ===================================================================
 * VELUAR — Mountain Residence Landing Page Scripts
 * ფუნქციონალი: მობილური მენიუ, სქროლ ანიმაციები, ფორმის ვალიდაცია,
 * გლუვი ნავიგაცია და Back-to-Top ღილაკი.
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM ელემენტების ინიციალიზაცია
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccessAlert = document.getElementById('formSuccessAlert');
  const resetFormBtn = document.getElementById('resetFormBtn');

  /* -----------------------------------------------------------------
     1. ჰედერისა და Back-to-Top ღილაკის მართვა სქროლისას
     ----------------------------------------------------------------- */
  const handleScrollState = () => {
    const scrollPosition = window.scrollY;

    // ჰედერის სტილის ცვლილება სქროლზე (Glassmorphism & კომპაქტური ზომა)
    if (scrollPosition > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Back to top ღილაკის გამოჩენა
    if (scrollPosition > 450) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // აქტიური ნავიგაციის ბმულის განახლება
    updateActiveNavLink(scrollPosition);
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState(); // საწყისი შემოწმება

  // Back to top დაჭერისას ასვლა ზემოთ
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* -----------------------------------------------------------------
     2. მობილური მენიუს გახსნა/დახურვა
     ----------------------------------------------------------------- */
  const openMobileMenu = () => {
    mobileNav.classList.add('is-open');
    mobileNavBackdrop.classList.add('is-open');
    menuToggle.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // ფონური სქროლის შეზღუდვა
  };

  const closeMobileMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNavBackdrop.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // სქროლის დაბრუნება
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileCloseBtn.addEventListener('click', closeMobileMenu);
  mobileNavBackdrop.addEventListener('click', closeMobileMenu);

  // Esc კლავიშზე მენიუს დახურვა
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // მობილური ბმულზე დაჭერისას მენიუს დახურვა და გლუვი გადასვლა
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });


  /* -----------------------------------------------------------------
     3. აქტიური ნავიგაციის ინდიკატორი სექციებზე სქროლისას
     ----------------------------------------------------------------- */
  function updateActiveNavLink(scrollPos) {
    const headerOffset = 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }


  /* -----------------------------------------------------------------
     4. სქროლზე რბილი ანიმაციები (IntersectionObserver)
     ----------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || 0;
            setTimeout(() => {
              entry.target.classList.add('is-revealed');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback ძველი ბრაუზერებისთვის
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }


  /* -----------------------------------------------------------------
     5. საკონტაქტო ფორმის ვალიდაცია და ინტერაქტიული გაგზავნა
     ----------------------------------------------------------------- */
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const messageInput = document.getElementById('userMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // ელფოსტის ფორმატის ვალიდაცია
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // ველის შეცდომის ჩვენება
  const showError = (input, errorEl) => {
    input.classList.add('is-invalid');
    errorEl.classList.add('show');
  };

  // ველის შეცდომის გასუფთავება
  const clearError = (input, errorEl) => {
    input.classList.remove('is-invalid');
    errorEl.classList.remove('show');
  };

  // Real-time ინფუთის მოსმენა შეცდომის მოსახსნელად
  nameInput.addEventListener('input', () => clearError(nameInput, nameError));
  emailInput.addEventListener('input', () => clearError(emailInput, emailError));
  messageInput.addEventListener('input', () => clearError(messageInput, messageError));

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // სახელის შემოწმება
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, nameError);
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // ელფოსტის შემოწმება
    if (!isValidEmail(emailInput.value)) {
      showError(emailInput, emailError);
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // შეტყობინების შემოწმება
    if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
      showError(messageInput, messageError);
      isValid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (!isValid) return;

    // მოთხოვნის გაგზავნის ანიმაცია (ვირტუალური სერვერული დაყოვნება)
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // ფორმის დამალვა და წარმატების ბარათის გამოჩენა
      contactForm.style.display = 'none';
      formSuccessAlert.classList.add('show');
    }, 1200);
  });

  // ახალი მოთხოვნის გაგზავნის ღილაკი
  resetFormBtn.addEventListener('click', () => {
    contactForm.reset();
    formSuccessAlert.classList.remove('show');
    contactForm.style.display = 'block';
    nameInput.focus();
  });
});
