(function () {
  'use strict';

  /* ── Reduced-motion guard ─────────────────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Register plugins ─────────────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── If reduced motion: skip all transform/opacity animations ─────────── */
  if (prefersReduced) {
    return;
  }

  /* ── Hero entrance — staggered timeline ──────────────────────────────── */
  const heroTl = gsap.timeline({ delay: 0.15 });
  heroTl
    .from('.lwt-hero__overline', {
      opacity: 0,
      y: 18,
      duration: 0.5,
      ease: 'power2.out'
    })
    .from('.lwt-hero__title', {
      opacity: 0,
      y: 28,
      duration: 0.65,
      ease: 'power3.out'
    }, '-=0.28')
    .from('.lwt-hero__lead', {
      opacity: 0,
      y: 20,
      duration: 0.55,
      ease: 'power2.out',
      stagger: 0.14
    }, '-=0.32');

  /* ── Subsection reveal — each article header + body ──────────────────── */
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

  document.querySelectorAll('.lwt-sub').forEach(function (sub) {
    var header = sub.querySelector('.lwt-sub__header');
    var body   = sub.querySelector('.lwt-sub__body');

    if (isDesktop) {
      /* Desktop: header slides from left, body from right */
      gsap.from(header, {
        opacity: 0,
        x: -36,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sub,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true
        }
      });
      gsap.from(body, {
        opacity: 0,
        x: 36,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sub,
          start: 'top 78%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    } else {
      /* Mobile: unified fade + slide up */
      gsap.from([header, body], {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sub,
          start: 'top 84%',
          toggleActions: 'play none none none',
          once: true
        }
      });
    }
  });

  /* ── Logo cards stagger (if logos are present) ───────────────────────── */
  var logoCards = document.querySelectorAll('.lwt-logo-card');
  if (logoCards.length) {
    ScrollTrigger.batch('.lwt-logo-card', {
      onEnter: function (batch) {
        gsap.from(batch, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.07
        });
      },
      start: 'top 86%',
      once: true
    });
  }

  /* ── Resource card reveal ─────────────────────────────────────────────── */
  var resourceCard = document.querySelector('.lwt-resource-card');
  if (resourceCard) {
    gsap.from(resourceCard, {
      opacity: 0,
      y: 24,
      scale: 0.97,
      duration: 0.65,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: resourceCard,
        start: 'top 86%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  }
}());
