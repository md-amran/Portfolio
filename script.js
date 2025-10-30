// JavaScript for enhanced functionality
document.addEventListener('DOMContentLoaded', () => {
    // ---------- Mobile Optimization ----------
    (function mobileOptimization(){
        // Prevent zoom on double tap (iOS)
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Improve touch scrolling
        document.documentElement.style.setProperty('--webkit-overflow-scrolling', 'touch');
    })();

    // ---------- Viewport Height Fix for Mobile ----------
    (function viewportHeightFix(){
        function setVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    })();

    // ---------- Year ----------
    document.getElementById('year').textContent = new Date().getFullYear();

    // ---------- Canvas Background (Particles) ----------
    (function particlesBg(){
        const canvas = document.getElementById('bg-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        let w = canvas.width;
        let h = canvas.height;
        
        const particles = [];
        const count = Math.max(18, Math.floor((w*h)/90000)); // density

        function rand(min, max){ return Math.random()*(max-min)+min; }

        for(let i=0;i<count;i++){
            particles.push({
                x: rand(0,w),
                y: rand(0,h),
                r: rand(0.6,3.2),
                vx: rand(-0.2,0.6),
                vy: rand(-0.1,0.1),
                alpha: rand(0.08,0.35)
            });
        }

        function resize(){ 
            resizeCanvas();
            w = canvas.width;
            h = canvas.height;
        }
        window.addEventListener('resize', resize);

        function tick(){
            ctx.clearRect(0,0,w,h);
            // moving radial gradient overlay
            const g = ctx.createLinearGradient(0,0,w,h);
            g.addColorStop(0,'rgba(0,179,255,0.02)');
            g.addColorStop(0.5,'rgba(0,0,0,0)');
            g.addColorStop(1,'rgba(0,230,168,0.02)');
            ctx.fillStyle = g;
            ctx.fillRect(0,0,w,h);

            particles.forEach(p=>{
                p.x += p.vx;
                p.y += p.vy;
                if(p.x > w + 30) p.x = -30;
                if(p.x < -30) p.x = w + 30;
                if(p.y > h + 30) p.y = -30;
                if(p.y < -30) p.y = h + 30;

                ctx.beginPath();
                ctx.fillStyle = `rgba(0,179,255,${p.alpha})`;
                ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
                ctx.fill();
            });

            requestAnimationFrame(tick);
        }
        tick();
    })();

    // ---------- Typing Effect ----------
    (function typing(){
        const el = document.getElementById('typed');
        if (!el) return;
        
        const phrases = [
            'EEE Student',
            'AI Automation Specialist',
            'Senior Science Project Maker'
        ];
        let p = 0, i = 0, forward = true;
        
        function step(){
            const str = phrases[p];
            if(forward){
                i++;
                if(i > str.length){ 
                    forward = false; 
                    setTimeout(step, 900); 
                    return; 
                }
            } else {
                i--;
                if(i < 0){ 
                    forward = true; 
                    p = (p+1)%phrases.length; 
                    setTimeout(step, 300); 
                    return; 
                }
            }
            el.textContent = str.slice(0,i);
            setTimeout(step, forward?90:40);
        }
        step();
    })();

    // ---------- Enhanced IntersectionObserver Reveal (FIXED) ----------
    (function revealOnScroll(){
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    // Add show class with small delay for better effect
                    setTimeout(() => {
                        entry.target.classList.add('show');
                    }, 50);
                    
                    // Special handling for timeline items with staggered animation
                    if(entry.target.classList.contains('timeline-item')) {
                        const delay = entry.target.dataset.delay || '0';
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                }
            });
        }, {
            threshold: 0.08, // Lower threshold for earlier trigger
            rootMargin: '0px 0px -40px 0px' // Trigger when 40px from bottom
        });

        // Observe all elements that should animate
        const elementsToReveal = document.querySelectorAll(
            'section, .card, .skill, .project, .timeline-item, ' +
            '.about-grid, .contact-card, .stat, .interest, ' +
            '.awards-grid, .skills-container, .timeline'
        );

        elementsToReveal.forEach((el, index) => {
            el.classList.add('reveal');
            
            // Add staggered delay for timeline items
            if(el.classList.contains('timeline-item')) {
                el.dataset.delay = index * 150; // 150ms delay between each
            }
            
            io.observe(el);
        });

        // Force check for elements already in viewport on page load
        setTimeout(() => {
            elementsToReveal.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('show');
                }
            });
        }, 300);
    })();

    // ---------- Theme Toggle with Fixed Split Switch ----------
    (function theme(){
        const toggle = document.getElementById('themeToggle');
        const body = document.body;
        
        if (!toggle) return;
        
        // Check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Initialize theme based on localStorage or system preference
        function initializeTheme() {
            const saved = localStorage.getItem('smsr_theme');
            const shouldBeLight = saved === 'light' || (!saved && !systemPrefersDark);
            
            if (shouldBeLight) {
                body.classList.add('light-mode');
                toggle.classList.add('active');
            } else {
                body.classList.remove('light-mode');
                toggle.classList.remove('active');
            }
        }
        
        initializeTheme();

        toggle.addEventListener('click', ()=>{
            const isLight = body.classList.toggle('light-mode');
            toggle.classList.toggle('active');
            
            // Smooth click animation
            toggle.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggle.style.transform = '';
            }, 150);
            
            // Save preference
            localStorage.setItem('smsr_theme', isLight ? 'light' : 'dark');
        });
        
        // Keyboard accessibility
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            }
        });
    })();

    // ---------- Scroll Progress & Header Blur ----------
    (function scrollEffects(){
        const progress = document.getElementById('progress-bar');
        const header = document.getElementById('site-header');

        function onScroll(){
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = (window.scrollY / (docH || 1))*100;
            
            if (progress) {
                progress.style.width = Math.min(Math.max(pct,0),100) + '%';
            }
            
            if (header) {
                if(window.scrollY > 40) {
                    header.classList.add('scrolled'); 
                } else {
                    header.classList.remove('scrolled');
                }
            }
        }
        
        window.addEventListener('scroll', onScroll);
        onScroll();
    })();

    // ---------- Smooth Active Nav Highlight ----------
    (function navHighlight(){
        const sections = [...document.querySelectorAll('section')];
        const navlinks = [...document.querySelectorAll('.navlink')];
        
        if (sections.length === 0 || navlinks.length === 0) return;
        
        function check(){
            const y = window.scrollY + 120;
            let idx = 0;
            
            for(let i=0;i<sections.length;i++){
                if(sections[i].offsetTop <= y) idx = i;
            }
            
            navlinks.forEach(n=>n.classList.remove('active'));
            if(navlinks[idx]) navlinks[idx].classList.add('active');
        }
        
        window.addEventListener('scroll', check);
        check();
    })();

    // ---------- Contact Form with EmailJS & Sweet Alert (FIXED VERSION) ----------
(function contactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    
    // Initialize EmailJS with your public key
    (function(){
        emailjs.init("OiIkJZ8IDTR5H362D");
    })();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Get form data with CORRECT field names
            const formData = {
                from_name: form.from_name.value,        // এইটা ঠিক করেছি
                from_email: form.from_email.value,      // এইটা ঠিক করেছি  
                message: form.message.value,            // এইটা ঠিক করেছি
                to_name: "Md. Amran",
                reply_to: form.from_email.value, // Important for reply
                subject: `New Message from ${form.from_name.value}`,
                date: new Date().toLocaleDateString('en-BD'),
                time: new Date().toLocaleTimeString('en-BD')
            };

            console.log('Sending data:', formData); // Debug log

            // Validate form - FIXED validation
            if (!formData.from_name || !formData.from_email || !formData.message) {
                throw new Error('Please fill in all fields');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.from_email)) {
                throw new Error('Please enter a valid email address');
            }

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_cj3iqso',
                'template_ebl2p7d',
                formData
            );

            if (response.status === 200) {
                console.log('Email sent successfully:', response);
                
                // Success Sweet Alert
                Swal.fire({
                    title: 'Success! 🎉',
                    text: 'Your message has been sent successfully! I will get back to you soon.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#00e6a8',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'swal-confirm-btn'
                    },
                    buttonsStyling: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.reset();
                    }
                });
                
            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Error Sweet Alert with specific messages
            let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
            
            if (error.message.includes('fill in all fields')) {
                errorMessage = 'Please fill in all required fields.';
            } else if (error.message.includes('valid email')) {
                errorMessage = 'Please enter a valid email address.';
            }
            
            Swal.fire({
                title: 'Oops! 😔',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Try Again',
                confirmButtonColor: '#ff4444',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'swal-confirm-btn'
                },
                buttonsStyling: false
            });

        } finally {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    // Form validation styling
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = 'var(--accent-color)';
            } else {
                this.style.borderColor = '';
            }
        });
    });
})();

    // ---------- Smooth Scroll for Anchor Links ----------
    (function smoothScroll(){
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Check if href is not just "#"
                if(this.getAttribute('href') === '#') {
                    return; // Skip if it's just "#"
                }
                
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    })();
});
// ---------- Resume Download Tracking ----------
(function resumeDownload() {
    const downloadBtn = document.querySelector('a[download="Resume_Md_Amran.pdf"]');
    
    if (!downloadBtn) return;
    
    downloadBtn.addEventListener('click', function(e) {
        // Track download event
        console.log('Resume download initiated');
        
        // You can add analytics here later
        // Example: Google Analytics event tracking
        // gtag('event', 'download', {
        //     'event_category': 'Resume',
        //     'event_label': 'Resume_Md_Amran.pdf'
        // });
        
        // Optional: Show confirmation message
        setTimeout(() => {
            Swal.fire({
                title: 'Download Started! 📄',
                text: 'Thank you for downloading my resume.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#00e6a8',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'swal-confirm-btn'
                },
                buttonsStyling: false,
                timer: 3000,
                timerProgressBar: true
            });
        }, 1000);
    });
})();