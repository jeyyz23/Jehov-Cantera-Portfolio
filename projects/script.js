// --- Global Functions (Placed outside document ready for scope) ---

/function getProjects() {
    // FIX: Use the full GitHub Pages path format with the new repo name
    $.getJSON('/Jehov-Cantera-Portfolio/projects/projects.json', function (data) {
        showProjects(data);
    }).fail(function () {
        console.error("Failed to load projects.json");
    });
}

/// Function to dynamically display project cards
function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectsHTML = '';
    
    // Filter out 'android' category and slice the first 10 projects
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        projectsHTML += `
<div class="box tilt ${project.category}">
  <img draggable="false" src="assets/images/projects/${project.image}.png" alt="project" />
  <div class="content">
    <div class="tag">
      <h3>${project.name}</h3>
    </div>
    <div class="desc">
      <p>${project.desc}</p>
      <div class="btns">
        <a href="${project.pdf_link ? '#' : project.links.view}" 
           class="btn ${project.pdf_link ? 'view-pdf-btn' : ''}" 
           data-pdf='/Jehov-Cantera-Portfolio/assets/pdf/${project.pdf_link}.pdf'
           target="${project.pdf_link ? '' : '_blank'}">
          <i class="fas fa-eye"></i> View
        </a>
        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
      </div>
    </div>
  </div>
</div>`;
    });
    // Add the HTML to the container (assuming this line is outside the forEach, but you should verify)
    projectsContainer.innerHTML = projectsHTML;
}

    // Assuming you have an element with the ID 'box-container' to hold the projects
    $('.box-container').html(projectsHTML);

    // Re-initialize Isotope filter and Vanilla Tilt after loading new content
    // You should ensure this part is present in your original code if needed.
    $('.box-container').isotope({
        itemSelector: '.box',
        layoutMode: 'fitRows'
    });
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 20,
        speed: 500,
        glare: true,
        "max-glare": 0.5,
    });

// Ensure you call getProjects to load your data when the page is ready
// getProjects(); 
// NOTE: Commented out here, as your original code structure might call this elsewhere.
// If your projects don't load, uncomment the line above inside $(document).ready.


// --- jQuery Document Ready (Main Event Listeners) ---
$(document).ready(function () {

    // Load projects on document ready if not already handled by your initial setup
    getProjects(); 

    // --- NAVBAR/SCROLL LISTENERS ---
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
    });

    // --- PDF MODAL LISTENER (Reliable Delegation) ---
    // This reliably handles clicks on dynamically loaded project cards
    $(document).on('click', '.view-pdf-btn', function(e) {
        // Prevent page reload immediately
        e.preventDefault(); 
        e.stopImmediatePropagation();
        
        // Get the PDF link from the data attribute
        const pdfLink = $(this).data('pdf');
        
        if (pdfLink) {
            // Find the iframe (ID: modalPDF) and set its source
            $('#modalPDF').attr('src', pdfLink); 
            // Find the modal (ID: projectModal) and show it
            $('#projectModal').css('display', 'block'); 
        }
    });

    // Modal Close Function
    const closePDFModal = function() {
        $('#projectModal').css('display', 'none');
        $('#modalPDF').attr('src', ''); // Clear src for security/performance
    };

    // 1. Close button (X) listener
    $('.modal-close').on('click', closePDFModal);

    // 2. Click outside modal listener
    $(window).on('click', function(event) {
        if ($(event.target).is('#projectModal')) {
            closePDFModal();
        }
    });

    // 3. Disable right-click specifically on the PDF iframe element
    $(document).on('contextmenu', '#modalPDF', function() {
        return false; 
    });
    // --- END PDF MODAL LISTENER ---

    // --- ISOTOPE FILTER LOGIC ---
    $('#filters').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $('.box-container').isotope({ filter: filterValue });
        
        // Update active class for buttons
        $('#filters button').removeClass('is-checked');
        $(this).addClass('is-checked');
    });

});
// END OF $(document).ready