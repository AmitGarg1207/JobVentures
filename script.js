document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const locationFilter = document.getElementById("locationFilter");
  const jobTypeFilter = document.getElementById("jobTypeFilter");
  const dateFilter = document.getElementById("dateFilter");
  const jobListings = document.getElementById("jobListings");
  const loading = document.getElementById("loading");
  const defaultQuery = "developer";
  
  async function fetchJobs() {
    loading.style.display = "block";
    jobListings.innerHTML = "";

    let query = searchInput.value.trim() || defaultQuery;
    const locationVal = locationFilter.value;
    if (locationVal) {
      query += " in " + locationVal;
    }
    const jobTypeVal = jobTypeFilter.value;
    if (jobTypeVal && jobTypeVal !== "Any") {
      query += " " + jobTypeVal.toLowerCase();
    }
    const baseUrl = "https://jsearch.p.rapidapi.com/search";
    const urlParams = new URLSearchParams({
      query: query,
      page: "1",
      num_pages: "1",
      country: "us"
    });
    
    if (dateFilter.value !== "all") {
      urlParams.append("date_posted", dateFilter.value);
    }
    if (jobTypeVal && jobTypeVal !== "Any") {
      urlParams.append("employment_types", jobTypeVal);
    }
    
    const url = `${baseUrl}?${urlParams.toString()}`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "58a163cacdmshf7e39595bcdb146p1ae645jsn2d5062a6e4cb",
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const jobs = data.data || data;
      localStorage.setItem("cachedJobs", JSON.stringify(jobs));
      displayJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      jobListings.innerHTML =
        "<p>Error fetching jobs. Please try again later.</p>";
    } finally {
      loading.style.display = "none";
    }
  }

  function displayJobs(jobs) {
    jobListings.innerHTML = "";
    if (!jobs || jobs.length === 0) {
      jobListings.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    jobs.forEach((job) => {
      const card = document.createElement("div");
      card.className = "job-card";
      card.innerHTML = `
        <div class="job-card-header">
          <img class="employer-logo" src="${job.employer_logo ? job.employer_logo : 'default-logo.png'}" alt="${job.employer_name} Logo">
        </div>
        <h3>${job.job_title || "No Title"}</h3>
        <p><i class="material-icons">business</i> ${job.employer_name || "Unknown Employer"}</p>
        <p><i class="material-icons">location_on</i> ${job.job_city || ""} ${job.job_state || ""}</p>
      `;
      card.addEventListener("click", () => {
        localStorage.setItem("selectedJob", JSON.stringify(job));
        window.location.href = "job-detail.html";
      });
      jobListings.appendChild(card);
    });
  }

  const cachedJobs = localStorage.getItem("cachedJobs");
  if (cachedJobs) {
    displayJobs(JSON.parse(cachedJobs));
  } else {
    fetchJobs();
  }

  searchBtn.addEventListener("click", fetchJobs);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      fetchJobs();
    }
  });
});
