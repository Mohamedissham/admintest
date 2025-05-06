document.addEventListener('DOMContentLoaded', function () {
    // Preloader
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }
    });

    // AOS initialization
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    menuToggle?.addEventListener('click', function () {
        this.classList.toggle('active');
        navList.classList.toggle('active');

        const bars = document.querySelectorAll('.bar');
        if (this.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '';
            });
        }
    });

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function () {
            if (navList.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navList.classList.remove('active');
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });
    });

    // Navbar and back-to-top button
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    document.querySelector('.back-to-top')?.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2 }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Counter
    const counterElements = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounters() {
        counterElements.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) observer.observe(statsSection);

    // Contact form
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        alert(`Thank you, ${name}! Your message has been received. We'll contact you at ${email} soon.`);
        this.reset();
    });

    // 3D card effect
    document.querySelectorAll('.card-3d, .image-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const angleX = (y - rect.height / 2) / 20;
            const angleY = (rect.width / 2 - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        card.addEventListener('mouseenter', () => card.style.transition = 'transform 0.1s ease');
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Footer year
    const currentYear = new Date().getFullYear();
    document.getElementById('current-year').textContent = currentYear;

    // Mobile service card toggle
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function () {
            if (window.innerWidth <= 768) this.classList.toggle('active');
        });
    });

    // Hero Section Video/Content Loop
    const video = document.getElementById('heroVideo');
    const heroContent = document.getElementById('heroContent');
    const mobileBg = document.querySelector('.mobile-hero-bg');
    let loopInterval;
    
    function initHeroLoop() {
        // First, ensure correct initial state
        if (window.innerWidth < 768) {
            // Mobile - show content immediately with animated background
            if (video) video.style.display = 'none';
            if (mobileBg) mobileBg.style.display = 'block';
            showHeroContent();
            return;
        } else {
            // Desktop - start with video
            if (mobileBg) mobileBg.style.display = 'none';
            if (video) {
                video.style.display = 'block';
                video.style.opacity = '1';
                video.currentTime = 0;
                video.play().catch(e => console.log('Video play error:', e));
            }
            hideHeroContent();
            
            // Start the loop
            startDesktopLoop();
        }
    }
    
    function showHeroContent() {
        if (!heroContent) return;
        heroContent.style.display = 'flex';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 50);
    }
    
    function hideHeroContent() {
        if (!heroContent) return;
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroContent.style.display = 'none';
        }, 1000);
    }
    
    function showVideo() {
        if (!video) return;
        video.style.display = 'block';
        video.style.opacity = '1';
        video.currentTime = 0;
        video.play().catch(e => console.log('Video play error:', e));
    }
    
    function hideVideo() {
        if (!video) return;
        video.style.opacity = '0';
        setTimeout(() => {
            video.style.display = 'none';
        }, 1000);
    }
    
    function startDesktopLoop() {
        // Clear any existing interval
        if (loopInterval) clearInterval(loopInterval);
        
        // Initial state: video is showing
        let showingVideo = true;
        
        // Function to toggle between states
        function toggleHeroState() {
            if (showingVideo) {
                // Switch to content
                hideVideo();
                setTimeout(showHeroContent, 1000);
            } else {
                // Switch to video
                hideHeroContent();
                setTimeout(showVideo, 1000);
            }
            showingVideo = !showingVideo;
        }
        
        // Start the interval (15 seconds for each state)
        loopInterval = setInterval(toggleHeroState, 15000);
        
        // Set timeout for first transition (after initial 15 seconds)
        setTimeout(toggleHeroState, 15000);
    }
    
    // Initialize on load
    initHeroLoop();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Clear any existing interval
        if (loopInterval) clearInterval(loopInterval);
        
        // Reinitialize based on new viewport size
        initHeroLoop();
    });
    
    // Handle video end (as a fallback in case the interval fails)
    if (video) {
        video.addEventListener('ended', function() {
            if (window.innerWidth >= 768 && heroContent.style.display === 'none') {
                hideVideo();
                showHeroContent();
            }
        });
    }

    // Image Slider
    initImageSlider();

    function initImageSlider() {
        const slider = document.querySelector('.image-slider');
        if (!slider) return;

        const container = slider.querySelector('.slider-container');
        const slides = slider.querySelectorAll('.slide');
        const prevArrow = slider.querySelector('.prev-arrow');
        const nextArrow = slider.querySelector('.next-arrow');
        const dotsContainer = slider.querySelector('.slider-dots');

        let currentSlide = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = slider.querySelectorAll('.slider-dot');

        prevArrow?.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextArrow?.addEventListener('click', () => goToSlide(currentSlide + 1));

        let interval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', () => {
            interval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = (index + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            container.style.transform = `translateX(-${currentSlide * 100}%)`;

            prevTranslate = -currentSlide * container.offsetWidth;
            currentTranslate = prevTranslate;
        }

        slides.forEach((slide, i) => {
            slide.addEventListener('touchstart', touchStart(i));
            slide.addEventListener('touchend', touchEnd);
            slide.addEventListener('touchmove', touchMove);

            slide.addEventListener('mousedown', touchStart(i));
            slide.addEventListener('mouseup', touchEnd);
            slide.addEventListener('mouseleave', touchEnd);
            slide.addEventListener('mousemove', touchMove);
        });

        function touchStart(index) {
            return function (e) {
                if (window.innerWidth > 768) return;
                currentSlide = index;
                startPos = getPositionX(e);
                isDragging = true;
                animationID = requestAnimationFrame(animation);
                container.classList.add('grabbing');
            };
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);
            container.classList.remove('grabbing');

            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -100 && currentSlide < slides.length - 1) goToSlide(currentSlide + 1);
            else if (movedBy > 100 && currentSlide > 0) goToSlide(currentSlide - 1);
            else goToSlide(currentSlide);
        }

        function touchMove(e) {
            if (!isDragging) return;
            const currentPosition = getPositionX(e);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }

        function getPositionX(e) {
            return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function setSliderPosition() {
            container.style.transform = `translateX(${currentTranslate}px)`;
        }

        goToSlide(0);
    }
});