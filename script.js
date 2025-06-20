// Ganti 'YOUR_PUBLIC_KEY' dengan public key dari EmailJS dashboard
(function(){
  emailjs.init("ExW99nipsYpuzFi-S");
})();

// Theme Management
class ThemeManager {
  constructor() {
    this.body = document.body
    this.themeToggle = document.getElementById("themeToggle")
    this.sunIcon = this.themeToggle.querySelector(".sun-icon")
    this.moonIcon = this.themeToggle.querySelector(".moon-icon")
    this.currentTheme = localStorage.getItem("theme") || "dark"

    this.init()
  }

  init() {
    this.setTheme(this.currentTheme)
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
  }

  setTheme(theme) {
    if (theme === "light") {
      this.body.classList.remove("dark-theme")
      this.body.classList.add("light-theme")
    } else {
      this.body.classList.remove("light-theme")
      this.body.classList.add("dark-theme")
    }

    this.currentTheme = theme
    localStorage.setItem("theme", theme)
  }

  toggleTheme() {
    // Add click animation
    this.themeToggle.style.transform = "scale(0.95)"

    setTimeout(() => {
      const newTheme = this.currentTheme === "dark" ? "light" : "dark"
      this.setTheme(newTheme)

      // Reset button scale
      this.themeToggle.style.transform = "scale(1)"
    }, 100)
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navLinks = document.querySelectorAll(".nav-link")
    this.sections = document.querySelectorAll("section")
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle")
    this.navList = document.querySelector(".nav-list")

    this.init()
  }

  init() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })

    // Active navigation highlighting
    window.addEventListener("scroll", () => this.updateActiveNav())

    // Mobile menu toggle
    this.mobileMenuToggle.addEventListener("click", () => this.toggleMobileMenu())
  }
  

  updateActiveNav() {
    const scrollPosition = window.scrollY + 100

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.navLinks.forEach((link) => {
          link.classList.remove("active")
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active")
          }
        })
      }
    })
  }

  toggleMobileMenu() {
    this.navList.classList.toggle("mobile-active")
    this.mobileMenuToggle.classList.toggle("active")
  }
}

// Mobile Navigation Toggle
const hamburger = document.getElementById("mobileMenuToggle");
const navLinks = document.querySelector(".nav-list");

// Toggle menu on hamburger click
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("mobile-active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.addEventListener("click", (e) => {
  if (e.target.classList.contains("nav-link")) {
    navLinks.classList.remove("mobile-active");
    hamburger.classList.remove("active");
  }
});

// Close menu if resize to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("mobile-active");
    hamburger.classList.remove("active");
  }
});

// Resume Tabs Management
class ResumeTabsManager {
  constructor() {
    this.tabButtons = document.querySelectorAll(".tab-button")
    this.tabContents = document.querySelectorAll(".tab-content")

    this.init()
  }

  init() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab")
        this.switchTab(targetTab)
      })
    })

    // Initialize skills animation when skills tab is shown
    this.initSkillsAnimation()
  }

  switchTab(targetTab) {
    // Remove active class from all buttons and contents
    this.tabButtons.forEach((btn) => btn.classList.remove("active"))
    this.tabContents.forEach((content) => content.classList.remove("active"))

    // Add active class to clicked button and corresponding content
    const activeButton = document.querySelector(`[data-tab="${targetTab}"]`)
    const activeContent = document.getElementById(targetTab)

    if (activeButton && activeContent) {
      activeButton.classList.add("active")
      activeContent.classList.add("active")

      // Trigger skills animation if skills tab is activated
      if (targetTab === "skills") {
        this.animateSkills()
      }
    }
  }

  initSkillsAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateSkills()
        }
      })
    })

    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      observer.observe(skillsSection)
    }
  }

  animateSkills() {
    const skillBars = document.querySelectorAll(".skill-progress")

    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width")
      setTimeout(() => {
        bar.style.width = width
      }, 200)
    })
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.form = document.getElementById("contactForm")
    this.init()
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    // Basic validation
    if (this.validateForm(data)) {
      this.submitForm(data)
    }
  }

  validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!data.name.trim()) {
      this.showError("Please enter your name")
      return false
    }

    if (!emailRegex.test(data.email)) {
      this.showError("Please enter a valid email address")
      return false
    }

    if (!data.subject.trim()) {
      this.showError("Please enter a subject")
      return false
    }

    if (!data.message.trim()) {
      this.showError("Please enter your message")
      return false
    }

    return true
  }

  submitForm(data) {
    const submitButton = this.form.querySelector(".submit-button");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    emailjs.send('service_isr5wdb', 'template_59cvgut', {
      name: data.name,
      email: data.email,
      message: data.message
    })
    .then(() => {
      this.showSuccess("Pesan berhasil dikirim!");
      this.form.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, (error) => {
      this.showError("Gagal mengirim pesan. Silakan coba lagi.");
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
  }

  showError(message) {
    this.showNotification(message, "error")
  }

  showSuccess(message) {
    this.showNotification(message, "success")
  }

  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "1rem 2rem",
      borderRadius: "10px",
      color: "white",
      fontWeight: "600",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease",
      backgroundColor: type === "success" ? "#10b981" : "#ef4444",
    })

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }
}

// Project Hover Effects
class ProjectManager {
  constructor() {
    this.ProjectItems = document.querySelectorAll(".Project-item")
    this.init()
  }

  init() {
    this.ProjectItems.forEach((item) => {
      item.addEventListener("mouseenter", () => this.handleHover(item))
      item.addEventListener("mouseleave", () => this.handleLeave(item))
    })
  }

  handleHover(item) {
    const overlay = item.querySelector(".Project-overlay")
    if (overlay) {
      overlay.style.opacity = "1"
    }
  }

  handleLeave(item) {
    const overlay = item.querySelector(".Project-overlay")
    if (overlay) {
      overlay.style.opacity = "0"
    }
  }
}

// Scroll Animations
class ScrollAnimationManager {
  constructor() {
    this.animatedElements = document.querySelectorAll(".service-card, .Project-item, .timeline-item")
    this.init()
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    this.animatedElements.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(30px)"
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(element)
    })
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ThemeManager()
  new NavigationManager()
  new ResumeTabsManager()
  new ContactFormManager()
  new ProjectManager()
  new ScrollAnimationManager()

  // Add loading animation
  document.body.style.opacity = "0"
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease"
    document.body.style.opacity = "1"
  }, 100)

  const burger = document.getElementById("mobileMenuToggle");
  const navList = document.querySelector(".nav-list");

  // Toggle menu on burger click
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navList.classList.toggle("mobile-active");
  });

  // Close menu when nav-link clicked (on mobile)
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        burger.classList.remove("active");
        navList.classList.remove("mobile-active");
      }
    });
  });

  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    setTimeout(() => {
      profileImg.classList.add('visible');
    }, 400); // Delay agar animasi lebih halus
  }
});

// Close menu if resize to desktop
window.addEventListener("resize", () => {
  const navList = document.querySelector(".nav-list");
  const burger = document.getElementById("mobileMenuToggle");
  if (window.innerWidth > 768) {
    navList.classList.remove("mobile-active");
    burger.classList.remove("active");
  }
});

// Smooth scroll for CTA button
document.addEventListener("DOMContentLoaded", () => {
  const ctaButton = document.querySelector(".cta-button")
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      const resumeSection = document.getElementById("resume")
      if (resumeSection) {
        const offsetTop = resumeSection.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  }
})

// ...existing code...

// Hanya untuk gambar linkan.id.jpg saja
document.querySelectorAll('.project-hover').forEach(item => {
  const img = item.querySelector('img');
  const overlay = item.querySelector('.Project-overlay');
  if (img && overlay && img.getAttribute('src') === 'linkan.id.jpg') {
    item.addEventListener('mouseenter', () => {
      overlay.classList.add('opacity-100', 'scale-100');
      overlay.classList.remove('opacity-0', 'scale-90');
    });
    item.addEventListener('mouseleave', () => {
      overlay.classList.remove('opacity-100', 'scale-100');
      overlay.classList.add('opacity-0', 'scale-90');
    });
  }
});
// Typing and deleting effect for #typing-name
document.addEventListener("DOMContentLoaded", function () {
  const text = "Hasbillah Maulana";
  const target = document.getElementById("typing-name");
  let i = 0;
  let isDeleting = false;

  function type() {
    if (!target) return;
    if (!isDeleting) {
      target.textContent = text.slice(0, i) + "|";
      if (i < text.length) {
        i++;
        setTimeout(type, 50);
      } else {
        setTimeout(() => {
          isDeleting = true;
          type();
        }, 1200); // Pause before deleting
      }
    } else {
      target.textContent = text.slice(0, i) + "|";
      if (i > 0) {
        i--;
        setTimeout(type, 50);
      } else {
        isDeleting = false;
        setTimeout(type, 500); // Pause before typing again
      }
    }
  }
  type();
});

// Animasi transisi slide untuk logo
function animateLogoSlide() {
  const texts = ["Hasbillah M I", "Front End Dev", "UI/UX Design"];
  const target = document.getElementById("logo-typing");
  let textIndex = 0;

  function showText(next = false) {
    if (!target) return;
    // Jika next=true, lakukan animasi keluar dulu
    if (next) {
      target.classList.remove("logo-slide-in");
      target.classList.add("logo-slide-out");
      setTimeout(() => {
        textIndex = (textIndex + 1) % texts.length;
        target.textContent = texts[textIndex];
        target.classList.remove("logo-slide-out");
        target.classList.add("logo-slide-in");
        setTimeout(() => showText(true), 1800); // Tampilkan kata berikutnya setelah delay
      }, 500); // Waktu animasi keluar
    } else {
      target.textContent = texts[textIndex];
      target.classList.add("logo-slide-in");
      setTimeout(() => showText(true), 1800);
    }
  }
  showText();
}

document.addEventListener("DOMContentLoaded", function () {
  animateLogoSlide();
});

document.addEventListener("DOMContentLoaded", function() {
  // Modal Sertifikat
  const certCard = document.getElementById('mos-certificate');
  const modal = document.getElementById('certificate-modal');
  const modalImg = document.getElementById('modal-img');
  const closeModal = document.getElementById('closeModal');

  if (certCard && modal && modalImg && closeModal) {
    certCard.addEventListener('click', function() {
      modal.style.display = "block";
    });
    closeModal.addEventListener('click', function() {
      modal.style.display = "none";
    });
    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  }
});

