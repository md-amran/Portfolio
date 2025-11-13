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
            'Senior Science Project Maker',
            'PCB Designer',
            'PC Enthusiast',
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
            const shouldBeLight = saved === 'lite' || (!saved && !systemPrefersDark);
            
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

    // ---------- Contact Form with EmailJS ----------
(function contactForm(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    
    (function(){
        emailjs.init("OiIkJZ8IDTR5H362D");
    })();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = 'var(--accent-color)';
            }
        });
    });

    function validateField(field) {
        if (!field.value.trim() && field.hasAttribute('required')) {
            field.style.borderColor = '#ff4444';
            field.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.1)';
        } else {
            field.style.borderColor = 'var(--accent-color)';
            field.style.boxShadow = 'none';
        }
    }

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        
        // Validate all fields before submit
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                validateField(input);
                isValid = false;
            }
        });

        if (!isValid) {
            Swal.fire({
                title: 'Missing Information!',
                text: 'Please fill in all required fields.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ffa500',
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                customClass: {
                    popup: 'custom-swal-popup',
                    confirmButton: 'swal-confirm-btn'
                },
                buttonsStyling: false
            });
            return;
        }

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            const formData = {
                from_name: form.from_name.value,
                from_email: form.from_email.value,
                location: form.location.value || 'Not provided',
                message: form.message.value,
                to_name: "Md. Amran",
                reply_to: form.from_email.value,
                subject: `New Message from ${form.from_name.value}`,
                date: new Date().toLocaleDateString('en-BD'),
                time: new Date().toLocaleTimeString('en-BD')
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.from_email)) {
                throw new Error('Please enter a valid email address');
            }

            const response = await emailjs.send(
                'service_cj3iqso',
                'template_ebl2p7d',
                formData
            );

            if (response.status === 200) {
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
                        // Reset border colors
                        inputs.forEach(input => {
                            input.style.borderColor = '';
                            input.style.boxShadow = 'none';
                        });
                    }
                });
                
            } else {
                throw new Error('Failed to send message');
            }

        } catch (error) {
            let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
            
            if (error.message.includes('valid email')) {
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
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
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
// ---------- LIVE MAP WITH SMOOTH SCROLL FIX ----------
(function liveMapWithSmoothScroll() {
    const mapContainer = document.getElementById('liveMap');
    if (!mapContainer) return;
    
    let map = null;
    let mapInitialized = false;

    function initializeMap() {
        if (mapInitialized || mapContainer._leaflet_id) {
            return;
        }

        try {
            // Exact location coordinates
            const exactLocation = [23.8695, 91.0078];
            
            // Create map with exact location
            map = L.map('liveMap', {
                scrollWheelZoom: false, // Disable scroll zoom to prevent conflicts
                dragging: true,
                tap: false // Prevent tap conflicts on mobile
            }).setView(exactLocation, 16);
            
            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
                minZoom: 10
            }).addTo(map);

            // Custom marker icon
            const customIcon = L.divIcon({
                className: 'custom-map-marker',
                html: '<i class="fas fa-map-marker-alt" style="color: #00e6a8; font-size: 28px; text-shadow: 0 2px 10px rgba(0,0,0,0.3);"></i>',
                iconSize: [28, 28],
                iconAnchor: [14, 28]
            });

            // Add marker with exact location
            const marker = L.marker(exactLocation, { 
                icon: customIcon,
                title: "Akhaura Debgram Govt Primary High School"
            }).addTo(map);

            // Custom popup
            marker.bindPopup(`
                <div style="text-align: center; padding: 10px; min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; color: #00e6a8; font-size: 16px; font-weight: 700;">Md. Amran</h4>
                    <p style="margin: 0 0 6px 0; color: #333; font-size: 13px; font-weight: 600;">EEE Student & AI Specialist</p>
                    <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
                        <i class="fas fa-school" style="color: #00b3ff;"></i> 
                        Akhaura Debgram Govt Primary High School
                    </p>
                    <p style="margin: 0; color: #888; font-size: 11px;">
                        <i class="fas fa-location-dot" style="color: #ff6b6b;"></i> 
                        Akhaura, Brahmanbaria
                    </p>
                </div>
            `).openPopup();

            // Enable zoom controls but keep scroll wheel disabled
            L.control.zoom({
                position: 'topright'
            }).addTo(map);

            // Smooth zoom animation on load
            setTimeout(() => {
                map.setView(exactLocation, 16, {
                    animate: true,
                    duration: 1.5
                });
            }, 500);

            // Handle map resize properly
            const resizeObserver = new ResizeObserver(() => {
                setTimeout(() => {
                    if (map && !map._size) {
                        map.invalidateSize();
                    }
                }, 100);
            });

            resizeObserver.observe(mapContainer);

            // Mark as initialized
            mapInitialized = true;

        } catch (error) {
            console.log('Map loaded successfully');
        }
    }

    // Initialize map when it comes into viewport
    const mapObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !mapInitialized) {
                if (typeof L !== 'undefined') {
                    initializeMap();
                    mapObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    mapObserver.observe(mapContainer);
})();
// script.js তে যোগ করুন
document.addEventListener('DOMContentLoaded', function() {
    const mapIframe = document.querySelector('#location iframe');
    
    if (mapIframe) {
        mapIframe.onload = function() {
            console.log('Map loaded successfully');
        };
        
        mapIframe.onerror = function() {
            console.log('Map failed to load, showing alternative');
            // Alternative content show করতে পারেন
            mapIframe.style.display = 'none';
            const container = document.querySelector('.map-container');
            container.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <i class="fas fa-map-marker-alt" style="font-size:48px; color:#666; margin-bottom:20px;"></i>
                    <h3>Akhaura, Brahmanbaria, Bangladesh</h3>
                    <p style="margin:20px 0;">Map could not be loaded</p>
                    <a href="https://goo.gl/maps/example" target="_blank" class="btn">View on Google Maps</a>
                </div>
            `;
        };
    }
});






// ========== PROJECT MODAL FUNCTIONALITY ==========
(function projectModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal) return;
    
    // Complete project data with ALL your projects - EXACT TITLES
    const projectsData = {
        'cold-email-automation': {
            title: 'Cold Email Automation with N8N',
            subtitle: 'AI-Powered Email Marketing System',
            description: 'Built an intelligent cold email automation system using N8N that reads emails from Google Sheets, uses AI agent to rewrite emails in different styles, sends personalized cold emails, and tracks sending status with timestamps. Features include email template variation, send scheduling, and performance analytics.',
            features: [
                'AI-powered email rewriting in different styles',
                'Google Sheets integration for data management',
                'Personalized email template system',
                'Intelligent send scheduling & tracking',
                'Real-time performance analytics dashboard',
                'Automated follow-up system'
            ],
            technologies: ['N8N', 'Google Sheets API', 'Python', 'AI Agents', 'Email API', 'JavaScript'],
            images: ['Cold mail send.jpg'],
            liveLink: '#n8n-demo',
            githubLink: 'https://github.com/md-amran/n8n-cold-email-automation',
            hasLiveDemo: true,
            n8nTemplate: 'cold-email-automation.json'
        },
        'facebook-automation': {
            title: 'N8N Facebook Business Messenger Automation',
            subtitle: 'Automated Customer Service Solution',
            description: 'Developed an automated Facebook Business Messenger system using N8N workflow automation. Features include auto-reply, customer query handling, lead generation, and integration with CRM systems. Reduced response time by 85% and improved customer engagement significantly.',
            features: [
                'Smart auto-reply to customer messages',
                'Lead generation & qualification system',
                'CRM integration capabilities',
                '24/7 automated customer support',
                'Multi-language message handling',
                'Conversation analytics & reporting'
            ],
            technologies: ['N8N', 'Facebook Graph API', 'Node.js', 'Webhooks', 'CRM Integration', 'MySQL'],
            images: ['facebook automation.jpg'],
            liveLink: '#n8n-demo',
            githubLink: 'https://github.com/md-amran/n8n-facebook-automation',
            hasLiveDemo: true,
            n8nTemplate: 'facebook-messenger-automation.json'
        },
        'smart-power-monitor': {
            title: 'Smart Power Monitor',
            subtitle: 'IoT-Based Energy Monitoring System',
            description: 'Developed a real-time power usage monitoring system using IoT sensors and ML-based anomaly detection. Integrated with an embedded dashboard for data visualization and alerts. Provides detailed energy consumption analytics and predictive maintenance alerts.',
            features: [
                'Real-time power consumption monitoring',
                'ML-based anomaly detection system',
                'IoT sensor integration & data collection',
                'Interactive web dashboard',
                'Predictive maintenance alerts',
                'Energy usage analytics & reports'
            ],
            technologies: ['Arduino', 'Python', 'TensorFlow Lite', 'IoT Sensors', 'React.js', 'MQTT'],
            images: ['powerplant.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/smart-power-monitor',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'ai-automation': {
            title: 'Automatic Mail Responce',
            subtitle: 'AI Automation Suite',
            description: 'Created an Automation that is Automatic Mail Responce means Email Automation, It will send mail Immediately and perfact data combinetion. Using to Create this Automation, N8N Workflow, gmail Credential & Gemini API.',
            features: [
                'Automatic instante email responce',
                'AI-powered Message send with Google Gemini2.0',
                'Automated read message from gmail',
                'Multi Channel communication support',
                'Custom workflow configurations'
            ],
            technologies: ['N8N', 'Google Gemini2.0', 'JavaScript', 'AI Agent', 'Gmail API', 'Cloud Functions'],
            images: ['Automation.jpg'],
            liveLink: '#n8n-demo',
            githubLink: 'https://github.com/md-amran/ai-automation-suite',
            hasLiveDemo: true,
            n8nTemplate: 'ai-automation-suite.json'
        },
        'robotic-line-follower': {
            title: 'Robotic Line Follower',
            subtitle: 'PID-Controlled Autonomous Robot',
            description: 'Built a high-speed line follower robot with PID control, infrared sensor fusion, and obstacle avoidance capabilities for robotic competitions. Achieved smooth navigation on complex tracks with precision control and adaptive speed management.',
            features: [
                'Advanced PID control algorithm',
                'Infrared sensor fusion technology',
                'Obstacle detection & avoidance',
                'High-speed precision navigation',
                'Adaptive speed control system',
                'Competition-ready performance'
            ],
            technologies: ['Arduino', 'PID Control', 'IR Sensors', 'Motor Drivers', 'C++', 'Embedded Systems'],
            images: ['pid line.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/robotic-line-follower',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'pcb-design': {
            title: 'Rail Track Security system',
            subtitle: 'Professional Circuit Board Design',
            description: 'A multi-layer PCB for a Rail Track Security System was designed and fabricated, including schematic capture in Proteus. This system incorporates power regulation, signal transmission to the control room using a GSM Module, and an instant alarm system.',
            features: [
                'Multi-layer PCB design & optimization',
                'Schematic capture & circuit design',
                'Power regulation systems',
                'Signal send using GSM Module',
                'Instant alarm system integration',
                'comprehensive testing & validation'
            ],
            technologies: ['Proteus', 'Buzzer', 'PCB Design', 'Circuit Simulation', 'GSM Module', 'Power Systems'],
            images: ['circuit design.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/pcb-design-projects',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'schematic-circuit': {
            title: 'BMS Circuit & Load Analyzer',
            subtitle: 'BMS Circuit And Load Analyzer Design',
            description: 'Developed a BMS circuit this circuit are capable of operating a battery within a safe and efficient range, protecting it from harmful conditions such as over-charging and deep-discharging. This is helpful in ensuring uninterrupted power supply for critical applications such as track security systems.',
            features: [
                'Professional schematic design',
                'Multi-layer PCB architecture',
                'Advanced power regulation',
                'Auti-cutdown feature for safety',
                'Calculate load demand',
                'Over voltage protection from both sides Load & Supply'
            ],
            technologies: ['ProtoLab', 'LM324N IC', 'Circuit Design', 'Power Systems', 'Simulation Tools'],
            images: ['Autocut circuit.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/schematic-designs',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        // নতুন ৫টি প্রজেক্ট যোগ করা হলো
        'water-level-checker': {
            title: 'Water Level Checker',
            subtitle: 'IoT-Based Water Management System',
            description: 'Developed an automated water level monitoring system using Soil moisture sensor and IoT technology. Features real-time water level tracking, Buzzer Alart, and automated pump control to prevent overflow and water wastage. And detecting water resistance level.',
            features: [
                'Real-time water level monitoring',
                'Soil moisture sensor integration',
                'Buzzer notifications',
                'Automated pump control',
                'Overflow prevention system',
                'detecting water resistance level.'
            ],
            technologies: ['Buzzer', 'Soil moisture sensor', 'IoT',  'Python', 'Cloud Database'],
            images: ['water level checker.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/water-level-checker',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'voltage-limiter': {
            title: 'Voltage Limiter',
            subtitle: 'Smart Power Protection System',
            description: 'Designed a smart voltage protection system that automatically cuts off power during voltage fluctuations. Protects electronic devices from over-voltage and under-voltage conditions with fast response time and visual indicators.',
            features: [
                'Over-voltage protection',
                
                'Fast response time (<100ms)',
                'Visual status indicators',
                'Auto-reset functionality',
                'Multi-device compatibility'
            ],
            technologies: ['Circuit Design', 'LM324N IC', 'Relay Control', 'PCB Design', 'Embedded C', 'Protection Circuits'],
            images: ['Voltage Limiter.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/voltage-limiter',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'rfid-attendance': {
            title: 'RFID Attendance System',
            subtitle: 'Automated Attendance Tracking Solution',
            description: 'Built a secure RFID-based attendance tracking system with database integration. Features real-time attendance logging, user authentication, and automated report generation with Excel export capabilities.',
            features: [
                'RFID card authentication',
                'Real-time attendance logging',
                'Database integration',
                'Excel report generation',
                'Multi-user support',
                'Admin dashboard'
            ],
            technologies: ['RFID Technology', 'MySQL', 'PHP', 'Web Interface', 'Arduino', 'Data Export'],
            images: ['RFID Attendence System.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/rfid-attendance-system',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'ac-gadget-controller': {
            title: 'Remote Control AC Gadget Controller',
            subtitle: 'Smart Home Automation System',
            description: 'Created a smart AC appliance controller with remote operation via remote & mobile IR Bluster. Supports scheduling, Multi device connection, and energy consumption tracking with IoT integration for smart home automation.',
            features: [
                'Mobile IR Bluster & Remote control',
                'Scheduling & timers',
                'Multiple device connection',
                'Energy consumption tracking',
                'IOT integration',
                'Smart home automation',
            ],
            technologies: ['IoT', 'Mobile IR Bluster', 'AC Circuit Design', 'Cloud Integration', 'WiFi Module', 'Smart Home','Remote Control'],
            images: ['Remote Control AC gadget controller.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/ac-gadget-controller',
            hasLiveDemo: false,
            n8nTemplate: null
        },
        'ac-dc-amplifier': {
            title: 'AC DC Auto Switching Amplifier',
            subtitle: 'Hybrid Power Audio Amplifier',
            description: 'Designed a hybrid amplifier system that automatically switches between AC and DC power sources. Ensures uninterrupted audio output with efficient power management and built-in battery backup system.',
            features: [
                'Automatic AC/DC switching',
                'Uninterrupted audio output',
                'Battery backup system',
                'Efficient power management',
                'High-quality audio amplification',
                'Portable operation capability'
            ],
            technologies: ['Audio Amplification', 'Power Electronics', 'Battery Management', 'Circuit Design', 'PCB Layout', 'Signal Processing'],
            images: ['AC DC Auto switching Amplifire.jpg'],
            liveLink: '#',
            githubLink: 'https://github.com/md-amran/ac-dc-amplifier',
            hasLiveDemo: false,
            n8nTemplate: null
        }
    };

    // Modal close functionality - UPDATED FOR SMOOTH SCROLL
    function closeModal() {
        modal.style.display = 'none';
        document.body.classList.remove('body-scroll-lock');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Click handler for ONLY "View Workflow" buttons - FIXED VERSION
    document.addEventListener('click', (e) => {
        // Check if clicked on "View Workflow" button ONLY
        if (e.target.classList.contains('btn') && e.target.textContent.includes('View Workflow')) {
            handleProjectClick(e.target);
        }
        
        // REMOVED: Project card click functionality
        // Now modal will ONLY open when clicking "View Workflow" button
    });
    
    // Unified click handler function
    function handleProjectClick(clickedElement) {
        const projectCard = clickedElement.closest('.project');
        if (!projectCard) return;
        
        const projectTitle = projectCard.querySelector('h3').textContent.trim();
        console.log('Clicked project:', projectTitle);
        
        // Case insensitive search for exact matching
        const projectKey = Object.keys(projectsData).find(key => {
            const dataTitle = projectsData[key].title.trim();
            return dataTitle.toLowerCase() === projectTitle.toLowerCase();
        });
        
        if (projectKey) {
            console.log('Project found:', projectKey);
            openProjectModal(projectsData[projectKey]);
        } else {
            console.log('Project NOT found in data:', projectTitle);
            showFallbackModal(projectTitle);
        }
    }
    
    // Modal open function - UPDATED FOR SMOOTH SCROLL
    function openProjectModal(project) {
        console.log('Opening modal for:', project.title);
        
        // Prevent background scroll without layout shift - UPDATED
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.classList.add('body-scroll-lock');
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }
        
        // Set modal content
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalSubtitle').textContent = project.subtitle || '';
        document.getElementById('modalDescription').textContent = project.description;
        
        // Set image with error handling
        const modalImage = document.getElementById('modalImage');
        modalImage.src = project.images[0];
        modalImage.alt = project.title;
        modalImage.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzIyMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
        };
        
        // Set features
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        // Set technologies
        const techContainer = document.getElementById('modalTech');
        techContainer.innerHTML = '';
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.textContent = tech;
            techContainer.appendChild(span);
        });
        
        // Set links with conditional display
        const liveLink = document.getElementById('modalLiveLink');
        const githubLink = document.getElementById('modalGithubLink');
        const caseStudyLink = document.getElementById('modalCaseStudy');
        
        // Live Demo button - show only for N8N projects
        if (project.hasLiveDemo) {
            liveLink.style.display = 'inline-block';
            liveLink.href = project.liveLink;
            liveLink.innerHTML = '<i class="fas fa-play-circle"></i> Live N8N Demo';
            liveLink.onclick = function(e) {
                e.preventDefault();
                showN8NDemo(project);
            };
        } else {
            liveLink.style.display = 'none';
        }
        
        // GitHub button
        githubLink.href = project.githubLink;
        githubLink.innerHTML = '<i class="fab fa-github"></i> Source Code';
        githubLink.target = '_blank';
        githubLink.style.display = 'inline-block';
        
        // Remove Case Study button completely
        caseStudyLink.style.display = 'none';
        
        // Apply light mode fixes if needed
        applyLightModeFixes();
        
        // Show modal with slight delay for smooth animation
        setTimeout(() => {
            modal.style.display = 'block';
        }, 10);
        
        console.log('Modal opened successfully');
    }
    
    // Apply light mode text color fixes - Dark mode unchanged
function applyLightModeFixes() {
    if (document.body.classList.contains('light-mode')) {
        // Force dark text colors for light mode ONLY
        const modalElements = [
            document.getElementById('modalTitle'),
            document.getElementById('modalSubtitle'), 
            document.getElementById('modalDescription'),
            ...document.querySelectorAll('.modal-details h4'),
            ...document.querySelectorAll('.modal-details p'),
            ...document.querySelectorAll('#modalFeatures li')
        ];
        
        modalElements.forEach(element => {
            if (element) {
                if (element.id === 'modalTitle') {
                    element.style.color = '#1a365d';
                } else if (element.id === 'modalSubtitle') {
                    element.style.color = '#4a5568';
                } else if (element.tagName === 'H4') {
                    element.style.color = '#2d3748';
                } else {
                    element.style.color = '#4a5568';
                }
            }
        });
        
        // Style tech tags for light mode ONLY
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.style.background = 'rgba(0, 230, 168, 0.1)';
            tag.style.color = '#2d3748';
            tag.style.border = '1px solid rgba(0, 230, 168, 0.3)';
        });
    } else {
        // Dark mode - reset to original CSS styles
        const modalElements = [
            document.getElementById('modalTitle'),
            document.getElementById('modalSubtitle'), 
            document.getElementById('modalDescription'),
            ...document.querySelectorAll('.modal-details h4'),
            ...document.querySelectorAll('.modal-details p'),
            ...document.querySelectorAll('#modalFeatures li')
        ];
        
        modalElements.forEach(element => {
            if (element) {
                element.style.color = ''; // Reset to CSS default
            }
        });
        
        // Reset tech tags for dark mode
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.style.background = '';
            tag.style.color = '';
            tag.style.border = '';
        });
    }
}
    
    // N8N Demo functionality - FIXED CANCEL BUTTON STYLING
function showN8NDemo(project) {
    Swal.fire({
        title: `🚀 ${project.title}`,
        html: `
            <div style="text-align: left;">
                <p><strong>N8N Workflow Demo Options:</strong></p>
                <div style="background: var(--card-bg); padding: 15px; border-radius: 10px; margin: 15px 0;">
                    <p style="margin: 10px 0;"><i class="fas fa-download"></i> <strong>Download JSON:</strong> Import this workflow into your N8N instance</p>
                    <p style="margin: 10px 0;"><i class="fas fa-cloud"></i> <strong>Live Demo:</strong> Test the workflow with sample data</p>
                    <p style="margin: 10px 0;"><i class="fas fa-video"></i> <strong>Video Tutorial:</strong> Step-by-step setup guide</p>
                </div>
                <p><small>You'll need N8N installed locally or use n8n.cloud</small></p>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-download"></i> Download JSON',
        
        background: 'var(--card-bg)',
        color: 'var(--text-primary)',
        customClass: {
            popup: 'custom-swal-popup',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-confirm-btn', // Cancel button same style as confirm
            denyButton: 'swal-confirm-btn'    // Deny button same style as confirm
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
            downloadN8NTemplate(project.n8nTemplate, project.title);
        } else if (result.isDismissed && result.dismiss === 'cancel') {
            showLiveDemoInstructions(project);
        } else if (result.isDenied) {
            window.open(project.githubLink, '_blank');
        }
    });
}
    
    function downloadN8NTemplate(templateName, projectTitle) {
        Swal.fire({
            title: '📥 Download Ready!',
            html: `
                <p>The <strong>${templateName}</strong> file is available in the GitHub repository.</p>
                <p>Visit the GitHub repo to download the complete N8N workflow JSON file.</p>
            `,
            icon: 'success',
            confirmButtonText: '<i class="fab fa-github"></i> Go to GitHub',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'swal-confirm-btn'
            },
            buttonsStyling: false
        }).then(() => {
            const repoName = projectTitle.toLowerCase().replace(/\s+/g, '-');
            window.open(`https://github.com/md-amran/${repoName}`, '_blank');
        });
    }
    
    function showLiveDemoInstructions(project) {
        Swal.fire({
            title: '🔧 Live Demo Setup',
            html: `
                <div style="text-align: left;">
                    <p><strong>To run this N8N workflow:</strong></p>
                    <ol style="text-align: left; margin-left: 20px;">
                        <li>Install N8N locally or use n8n.cloud</li>
                        <li>Download the JSON file from GitHub</li>
                        <li>Import the JSON into N8N</li>
                        <li>Configure your API keys</li>
                        <li>Activate the workflow</li>
                    </ol>
                    <div style="background: var(--secondary-bg); padding: 10px; border-radius: 8px; margin: 10px 0;">
                        <p style="margin: 5px 0;"><i class="fas fa-terminal"></i> <strong>Quick Local Setup:</strong></p>
                        <code style="background: rgba(0,0,0,0.3); padding: 5px 10px; border-radius: 5px; display: block; margin: 5px 0;">
                            npx n8n
                        </code>
                    </div>
                </div>
            `,
            icon: 'info',
            confirmButtonText: 'Got it!',
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            customClass: {
                popup: 'custom-swal-popup',
                confirmButton: 'swal-confirm-btn'
            },
            buttonsStyling: false
        });
    }
    
    // Fallback modal for projects not found in data
    function showFallbackModal(title) {
        Swal.fire({
            title: title,
            html: `
                <div style="text-align: center;">
                    <p>🚧 Project details are being updated...</p>
                    <p>Please check back later for complete information.</p>
                    <div style="margin-top: 20px;">
                        <a href="#contact" class="btn" onclick="Swal.close()">Contact for Details</a>
                    </div>
                </div>
            `,
            icon: 'info',
            showConfirmButton: false,
            background: 'var(--card-bg)',
            color: 'var(--text-primary)',
            customClass: {
                popup: 'custom-swal-popup'
            },
            buttonsStyling: false
        });
    }
    
    // Initialize modal close button styling
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.transition = 'all 0.3s ease';
    
    console.log('Project Modal Functionality Loaded Successfully');
})();

