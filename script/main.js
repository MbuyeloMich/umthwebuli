document.addEventListener('DOMContentLoaded', () => {

    //  

    lazyLoadImages('.placeholder');

    const loading = document.querySelector("#loading");
    const imageGroup = loading.querySelector('.image-group');
    const placeholders = imageGroup.querySelectorAll('.loading-image');
    const loadingText = loading.querySelector('span');

 
    const images = imageGroup.querySelectorAll('img');
    let imagesLoaded = 0;

    images.forEach(img => {
        if (img.complete) {
            console.log(img.complete)
            imagesLoaded++;
        } else {
            img.addEventListener('load', () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) startLoadingAnimation();
            });
            img.addEventListener('error', () => {
                imagesLoaded++;
                if (imagesLoaded === images.length) startLoadingAnimation();
            });
        }
    });

    if (imagesLoaded === images.length) startLoadingAnimation();

 
    function startLoadingAnimation() {
        const tl = gsap.timeline({
            delay: 0.5,
            onComplete: () => {
                loading.remove();
            },
            defaults: { ease: "power3.out" }
        });

 
        tl.to(imageGroup, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 2.5
        });

 
        tl.to(imageGroup, {
            scaleX: 1,
            scaleY: 1,
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=1.5");

    
        tl.to(placeholders, {
            clipPath: "inset(0% 0% 0% 0%)",
            x: 0,
            duration: 1.2,
            stagger: 0.25,
            ease: "power2.out",
            onStart: () => placeholders.forEach(el => gsap.set(el, { x: -50 }))
        }, "-=2.1");

 
        tl.to(loadingText, {
            
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5");  

      
        tl.to(loading, {
            y: "-100%",
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 2,
            ease: "power2.out"
        }, "-=0.3");  
    }

    

    class OverflowPlugin extends Scrollbar.ScrollbarPlugin {
        static pluginName = "overflow";

        static defaultOptions = {
            open: false,
        };

        transformDelta(delta) {
            return this.options.open ? { x: 0, y: 0 } : delta;
        }
    }

    Scrollbar.use(OverflowPlugin);

    // 

    gsap.registerPlugin(ScrollTrigger);

    // 


    let scrollbar;
    let resizeObserver;

    let scrollRef = document.querySelector("#scroll-wrapper");

    const initScrollbar = () => {
        if (scrollRef) {
            scrollbar = Scrollbar.init(scrollRef, {
                damping: 0.06,
                alwaysShowTrack: true,
                renderByPixels: true,
                delegateTo: document,
            });

            ScrollTrigger.scrollerProxy(scrollRef, {
                scrollTop(value) {
                    if (arguments.length) {
                        scrollbar.scrollTop = value;
                    }
                    return scrollbar.scrollTop;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
            });

            scrollbar.addListener(ScrollTrigger.update);
            ScrollTrigger.defaults({ scroller: scrollRef });

            ScrollTrigger.refresh();
        }
    };

    initScrollbar();

    // 

    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;


            if (width > 0 && height > 0) {
                ScrollTrigger.refresh();
            }


            const original = activeTrigger?.querySelector("span:not([data-load])");
            const modalSpan = activeModal?.querySelector("span");

            if (!original || !modalSpan) return;

            const computed = getComputedStyle(original);

            modalSpan.style.transform = computed.transform;

        }
    });

    resizeObserver.observe(scrollRef);

    gsap.registerPlugin(ScrollTrigger);

    // 

    const mm = gsap.matchMedia();

    mm.add(
        {

            isTall: "(min-height: 530px)",
            isWide: "(min-width: 320px)",
        },
        (context) => {
            const { isTall, isWide } = context.conditions;


            if (!isTall) return;
            if (!isWide) return;

            const placeholders = document.querySelectorAll("#hero .placeholder");

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#hero",
                    start: "center center",
                    end: "+=100%",
                    pin: true,
                    scrub: 1,
                    scroller: scrollRef,
                    invalidateOnRefresh: true
                }
            });


            Array.from(placeholders)
                .reverse()
                .forEach((el, i) => {
                    tl.to(el, {
                        y: "-100vh",
                        rotate: 0,
                        duration: 0.5,
                        ease: "power2.in"
                    }, i * 0.3);
                });


            return () => {
                tl.kill();
            };
        }
    );

    // 

    mm.add(
        {

            isTall: "(min-height: 530px)",
            isWide: "(min-width: 320px)",
        },
        (context) => {
            const parallaxImages = document.querySelectorAll(".parallax-image")

            parallaxImages.forEach((el, i) => {

                const container = el
                const image = el.querySelector('span:not([data-blur])')

                gsap.to(image, {
                    y: () =>
                        image.offsetHeight - container.offsetHeight,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        scrub: 1.4,
                        pin: false,
                        invalidateOnRefresh: true
                    },
                })
            })

            // 

            const numsSection = document.querySelector('#nums')

            const nums = numsSection.querySelectorAll("h1")

            gsap.fromTo(nums,
                { y: "60%" },
                {
                    y: 0,
                    duration: 1.5,
                    ease: "power4.inOut",
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: numsSection,
                        start: "top 70%",
                        toggleActions: "play none none none",
                    }
                }
            );

            // 

            const quote = document.querySelector("#quote .container")

            const spans = quote.querySelectorAll("span")

            gsap.fromTo(
                spans,
                {
                    y: "80%",
                    rotateX: -90,
                    opacity: 0,
                    transformPerspective: 800
                },
                {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    duration: 1.4,
                    ease: "power4.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: quote,
                        start: "top 60%",
                        toggleActions: "play none none none",
                    }
                }
            );

            // 

            const footerLetters = document.querySelector('footer h2')

            const letters = footerLetters.querySelectorAll("span")

            gsap.fromTo(letters,
                { y: "70%" },
                {
                    y: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: footerLetters,
                        start: "top 95%",
                        toggleActions: "play none none none",
                    }
                }
            );

        }
    );


    // 
    const list = document.querySelectorAll('#services li');

    list.forEach(el => {

        const img = el.querySelector('.list-image');

        const xTo = gsap.quickTo(img, "x", {
            duration: 0.35,
            ease: "power3.out"
        });

        const yTo = gsap.quickTo(img, "y", {
            duration: 0.35,
            ease: "power3.out"
        });

        const rTo = gsap.quickTo(img, "rotation", {
            duration: 0.4,
            ease: "power3.out"
        });


        const resetPosition = () => {
            const rect = el.getBoundingClientRect();

            const imgW = img.offsetWidth;
            const imgH = img.offsetHeight;


            xTo(rect.width / 2 - imgW / 2);
            yTo(rect.height / 2 - imgH / 2);


            rTo(0);
        };


        resetPosition();


        el.addEventListener("mouseenter", () => {

            resetPosition();

            gsap.to(img, {
                opacity: 1,
                duration: 0.55,
                ease: "power2.inOut"
            });
        });


        el.addEventListener("mouseleave", () => {

            resetPosition();

            gsap.to(img, {
                opacity: 0,
                duration: 0.55,
                ease: "power2.inOut"
            });
        });


        el.addEventListener("mousemove", e => {

            const rect = el.getBoundingClientRect();


            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const imgW = img.offsetWidth;
            const imgH = img.offsetHeight;


            xTo(x - imgW / 2);
            yTo(y - imgH / 2);


            const centerX = rect.width / 2;
            const offsetX = x - centerX;


            rTo(offsetX / 20);
        });

    });


    // 

    const modalRoot = document.querySelector(".modal-root");
    const overlay = document.querySelector(".overlay");

    let activeModal = null;
    let activeTrigger = null;


    overlay.addEventListener("click", () => {
        if (!activeModal || !activeTrigger) return;


        overlay.style.opacity = "0";

        const rect = activeTrigger.getBoundingClientRect();

        // activeModal.scrollTop =
        //     (activeModal.scrollHeight - activeModal.clientHeight) / 2;

        // activeModal.style.height = "min(800px, 80vh)"
        // activeModal.style.maxHeight = "none";


        activeModal.getBoundingClientRect();


        activeModal.style.transition =
            "top .5s var(--transition), left .5s var(--transition), width .5s var(--transition), height .5s var(--transition), transform .5s var(--transition)";


        Object.assign(activeModal.style, {
            top: rect.top + "px",
            left: rect.left + "px",
            width: rect.width + "px",
            height: rect.height + "px",
            transform: "translate(0,0)"
        });


        activeModal.addEventListener(
            "transitionend",
            () => {
                activeModal.remove();
                activeModal = null;
                activeTrigger = null;
                overlay.style.pointerEvents = "none";

                scrollbar.updatePluginOptions("overflow", { open: false });

            },
            { once: true }
        );
    });


    document.addEventListener("click", (e) => {
        const trigger = e.target.closest(".open-modal");
        if (!trigger) return;

        activeTrigger = trigger;
        scrollbar.updatePluginOptions("overflow", { open: true });

        overlay.style.opacity = "1";
        overlay.style.pointerEvents = "all";

        const rect = trigger.getBoundingClientRect();

        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        modalContent.style.transition = "none";


        Object.assign(modalContent.style, {
            position: "fixed",
            top: rect.top + "px",
            left: rect.left + "px",
            width: rect.width + "px",
            height: rect.height + "px",
            transform: "translate(0,0)"
        });

        const computed = trigger.querySelector("span:not([data-load])")
        const styles = computed.getAttribute("style")

        const imgSrc = trigger.querySelector("img").src;
        modalContent.innerHTML = `<span${styles ? ` style="${styles}"` : ""} class=${styles ? "adjust" : "static"}><img src="${imgSrc}" /></span>`;

        modalRoot.appendChild(modalContent);
        activeModal = modalContent;


        modalContent.getBoundingClientRect();


        modalContent.style.transition =
            "top .5s var(--transition), left .5s var(--transition), width .5s var(--transition), height .5s var(--transition), transform .5s var(--transition)";


        Object.assign(modalContent.style, {
            top: "50%",
            left: "50%",
            width: "min(90vw, 800px)",
            height: "min(800px, 80vh)",
            transform: "translate(-50%, -50%)"
        });

        modalContent.addEventListener(
            "transitionend",
            () => {
                modalContent.style.transition = "none";

            },
            { once: true }
        );


        // modalContent.addEventListener('mousemove', (e) => {
        //     modalContent.style.height = "initial";
        //     modalContent.style.minHeight = "min(800px, 80vh)";

        //     modalContent.scrollTop =
        //         (modalContent.scrollHeight - modalContent.clientHeight) / 2;
        // }, {once: true})
    });


    // 

    const items = document.querySelectorAll("#portfolio li");

    let openedItem = null;

    items.forEach((item, index) => {
        const content = item.querySelector(".content");


        if (index === 0) {

            gsap.set(content, {
                height: "auto",
                opacity: 1
            });

            item.classList.add("active");
            openedItem = item;
        } else {
            gsap.set(content, {
                height: 0,
                opacity: 0
            });

            item.classList.add("inactive");
        }


        item.addEventListener("click", () => {

            if (openedItem === item) return;

            items.forEach(other => {
                const otherContent = other.querySelector(".content");

                if (other === item) {

                    other.classList.remove("inactive");
                    other.classList.add("active");

                    gsap.to(otherContent, {
                        height: "auto",
                        opacity: 1,
                        duration: 0.6,
                        ease: "power3.inOut"
                    });

                } else {

                    other.classList.remove("active");
                    other.classList.add("inactive");

                    gsap.to(otherContent, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power3.inOut"
                    });
                }

                scrollbar.update()
            });

            openedItem = item;
        });
    });

    // 

    const links = document.querySelectorAll('[data-section-to]')


    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const anchor = link.dataset.sectionTo;
            const sectionTo = document.querySelector("#" + anchor);

            const y = sectionTo.offsetTop;

            scrollbar.scrollTo(0, y, 2500);
        });
    });


});
