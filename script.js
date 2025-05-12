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



    //mobile toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    const body = document.body;

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', function () {
            this.classList.toggle('active');
            navList.classList.toggle('active');

            if (navList.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('active');
                navList.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }
    

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });




// Counter animation - All counters finish in exactly 2 seconds
const counterElements = document.querySelectorAll('.counter');

function animateCounters() {
    const duration = 2000; // 2 seconds total duration
    const frameRate = 30; // frames per second
    const totalFrames = Math.round(duration / (1000 / frameRate)); // total frames for animation

    counterElements.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const numberElement = counter.querySelector('.number');
        const isDecimal = target % 1 !== 0;

        let frame = 0;

        const updateCounter = () => {
            frame++;
            const progress = Math.min(frame / totalFrames, 1);
            const current = target * progress;

            numberElement.innerText = isDecimal
                ? current.toFixed(1)
                : Math.floor(current);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.innerText = isDecimal
                    ? target.toFixed(1)
                    : target;

                // Show + or % if present
                const plus = counter.querySelector('.plus');
                const suffix = counter.querySelector('.suffix');
                if (plus) plus.style.display = 'inline';
                if (suffix) suffix.style.display = 'inline';
            }
        };

        updateCounter();
    });
}

// Trigger on stats section scroll into view
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
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            alert(`Thank you, ${name}! Your message has been received. We'll contact you at ${email} soon.`);
            this.reset();
        });
    }

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
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Set current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Image Slider
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

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = slider.querySelectorAll('.slider-dot');

        // Arrow navigation
        prevArrow?.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextArrow?.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Auto-rotate slides
        let interval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        slider.addEventListener('mouseenter', () => clearInterval(interval));
        slider.addEventListener('mouseleave', () => {
            interval = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });

        // Go to specific slide
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

        // Touch and mouse events for sliding
        slides.forEach((slide, i) => {
            // Touch events
            slide.addEventListener('touchstart', touchStart(i));
            slide.addEventListener('touchend', touchEnd);
            slide.addEventListener('touchmove', touchMove);

            // Mouse events
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

            if (movedBy < -100 && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (movedBy > 100 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide);
            }
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

        // Initialize first slide
        goToSlide(0);
    }

    // Initialize the slider
    initImageSlider();

    // World map animation
    am5.ready(function() {
        let root = am5.Root.new("chartdiv");
        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "none",
                panY: "none",
                wheelX: "none",
                wheelY: "none",
                projection: am5map.geoOrthographic(),
                layout: root.verticalLayout
            })
        );

        chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                exclude: ["AQ"],
                fill: am5.color(0x3b82f6),
                stroke: am5.color(0x1e40af)
            })
        );

        chart.appear(1000, 100);
        chart.animate({
            key: "rotationX",
            to: 360,
            duration: 30000,
            loops: Infinity,
            easing: am5.ease.linear
        });

        chart.logo.disabled = true;
    });
});
