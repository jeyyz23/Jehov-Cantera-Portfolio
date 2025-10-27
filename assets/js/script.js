$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("41EyusFfyjRe4bzgj");

       // NEW CODE: Pass the actual form element reference instead of a selector
       var form = document.getElementById('contact-form');
       emailjs.sendForm('service_jehov12', 'template_jehov12', form)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->
    // ... (code up to emailjs closing bracket) ...
// // --- CRITICAL PDF MODAL CLICK LISTENER (DELEGATED) ---
    // This reliably attaches the click event to buttons loaded dynamically by showProjects.
    $(document).on('click', '.view-pdf-btn', function(e) {
        e.preventDefault(); 
        e.stopImmediatePropagation(); // Prevents multiple event firings
        
        const pdfLink = $(this).data('pdf');
        
        if (pdfLink) {
            // NOTE: You must have an element with ID 'projectModal' and an iframe with ID 'modalPDF' in your index.html
            $('#modalPDF').attr('src', pdfLink); 
            $('#projectModal').addClass('active'); // Use active class for display (assuming your CSS uses this)
        }
    });

    // --- MODAL CLOSE LOGIC ---
    // This is needed to close the modal when clicking the 'X' or outside
    const closePDFModal = function() {
        $('#projectModal').removeClass('active'); 
        $('#modalPDF').attr('src', ''); // Clear src
    };

    // If you have a close button with class 'modal-close'
    $('.modal-close').on('click', closePDFModal);

    // If you want to close it by clicking anywhere outside the content
    $(window).on('click', function(event) {
        if ($(event.target).is('#projectModal')) {
            closePDFModal();
        }
    });
    // --------------------------------------------------------

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Jehov Cantera";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Bookkeeper", "Data Entry Specialist", "General Virtual Assistant", "Virtual Assistant", "Admin Support"],
    loop: true,
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json") 
        :
        // *** FINAL PATH FOR LIVE SERVER/LOCAL TESTING ***
        response = await fetch("./projects/projects.json") 
        
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";

    // --- DYNAMIC PATH DEFINITION ---
    // This logic ensures PDFs work both locally and on GitHub Pages.
    const REPO_NAME = "Jehov-Cantera-Portfolio"; 
    
    // Checks if the full URL contains the repository name (indicating GitHub Pages deployment)
    const pathPrefix = window.location.href.includes(REPO_NAME) 
                       ? `/${REPO_NAME}/assets/pdf/` 
                       : './assets/pdf/';
    // --------------------------------

    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        
        // Generate the PDF link using the determined path prefix
        const pdfLink = project.pdf_link ? `${pathPrefix}${project.pdf_link}.pdf` : null;

        // Determine link behavior
        const linkHref = project.pdf_link ? '#' : project.links.view;
        const linkClass = project.pdf_link ? 'view-pdf-btn' : '';
        const linkTarget = project.pdf_link ? '' : '_blank';
        const dataPdf = project.pdf_link ? `data-pdf='${pdfLink}'` : '';
        
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" src="./assets/images/projects/${project.image}.png" alt="project" />
            <div class="content">
                <div class="tag">
                <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${linkHref}" class="btn ${linkClass}" ${dataPdf} target="${linkTarget}"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>`; // <--- The HTML template MUST close correctly here!
    });

    projectsContainer.innerHTML = projectHTML; // <--- CRITICAL LINE TO DISPLAY PROJECTS

    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    /* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });
}
fetchData("projects").then(data => {
    showProjects(data);
});

// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// // Start of Tawk.to Live Chat
// var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
// (function () {
//     var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
//     s1.async = true;
//     s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
//     s1.charset = 'UTF-8';
//     s1.setAttribute('crossorigin', '*');
//     s0.parentNode.insertBefore(s1, s0);
// })();
// // End of Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });


/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });
// --- ADD THIS BLOCK ---
fetchData("projects").then(data => {
    showProjects(data);
});
/* SCROLL SKILLS & TOOLS */

// 1. Reveal the individual Skill Cards
srtop.reveal('.skills-grid .skill-card', { interval: 75 }); 

// 2. Reveal the entire Suite/Tools Card (Google/Office/QuickBooks, etc.)
srtop.reveal('.skills .suite-card', { delay: 400 });

// 3. Reveal the individual Tool Pills (Optional, if you want them to fade in separately)
srtop.reveal('.tool-row .tool-pill', { interval: 50 });