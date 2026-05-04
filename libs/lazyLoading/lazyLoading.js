function lazyLoadImages(selector, options = { threshold: 0.5 }) {
    const placeholders = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const img = placeholder.querySelector("span:not([data-blur]) img");

                const blur = placeholder.querySelector("[data-blur]");  

       
                img.src = img.dataset.src;
                img.onload = () => {
                 
                    if (blur) {
                        blur.style.opacity = 0;

                        blur.addEventListener("transitionend", () => {
                            blur.parentNode.removeChild(blur);
                        });
                        img.removeAttribute('data-src')
                    }
                }

                observer.unobserve(placeholder);
            }
        });
    }, options);

    placeholders.forEach(placeholder => observer.observe(placeholder));
}
