document.addEventListener("DOMContentLoaded", () => {
    const jobDetailContainer = document.getElementById("jobDetail");
    const job = JSON.parse(localStorage.getItem("selectedJob"));
  
    if (!job) {
      jobDetailContainer.innerHTML =
        "<p>No job details available. Please go back and select a job.</p>";
    } else {
      let html = `
        <div class="job-detail-header">
          <img class="employer-logo" src="${job.employer_logo ? job.employer_logo : 'default-logo.png'}" alt="${job.employer_name} Logo">
        </div>
        <h2>${job.job_title || "No Title"}</h2>
        <p><strong>Company:</strong> ${job.employer_name || "Unknown Employer"}</p>
        <p><strong>Location:</strong> ${job.job_city || ""} ${job.job_state || ""} ${job.job_country || ""}</p>
        <p><strong>Description:</strong></p>
        <p>${job.job_description || "No description available."}</p>
      `;
  
      // If multiple apply options exist, create a dropdown
      if (job.apply_options && job.apply_options.length > 0) {
        html += `
          <div class="dropdown">
            <button class="dropdown-toggle">
              <i class="material-icons">send</i> Apply Now <i class="material-icons">arrow_drop_down</i>
            </button>
            <div class="dropdown-content">
        `;
        job.apply_options.forEach(option => {
          html += `<a href="${option.apply_link}" target="_blank">${option.publisher}</a>`;
        });
        html += `
            </div>
          </div>
        `;
      } else if (job.job_apply_link) {
        // Single apply link available
        html += `
          <a class="apply-btn" href="${job.job_apply_link}" target="_blank">
            <i class="material-icons">send</i> Apply Now
          </a>
        `;
      } else {
        html += `<p>No apply link available.</p>`;
      }
  
      html += `
        <br>
        <a class="back-btn" href="index.html">
          <i class="material-icons">arrow_back</i> Back to Search
        </a>
      `;
  
      jobDetailContainer.innerHTML = html;
  
      // Toggle dropdown display on click
      const dropdownToggle = document.querySelector('.dropdown-toggle');
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', () => {
          const dropdownContent = document.querySelector('.dropdown-content');
          dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });
      }
    }
  });
  