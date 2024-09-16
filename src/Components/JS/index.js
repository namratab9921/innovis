document.addEventListener('DOMContentLoaded', () => {
  const siteListElement = document.getElementById('site-list');
  const siteInfoElement = document.getElementById('site-info');
  const defectInfoElement = document.getElementById('defect-info');
  const inventoryInfoElement = document.getElementById('inventory-info');
  const towerMeasurementArea = document.getElementById('tower-measurement');

  const searchInput = document.querySelector('input[type="text"]');
  const categorySelect = document.querySelector('select:nth-of-type(2)');
  const siteTypeSelect = document.querySelector('select#site-type');
  const maintStatusSelect = document.querySelector('#maint-status');

  let sitesData = [];
  let towersData = [];
  let maintenancesData = [];

  async function fetchData(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }

  async function fetchSites() {
    try {
      sitesData = await fetchData('http://127.0.0.1:8000/api/sites/');
      towersData = await fetchData('http://127.0.0.1:8000/api/towers/');
      maintenancesData = await fetchData('http://127.0.0.1:8000/api/maintenances/');
      populateSiteList(sitesData);

      if (sitesData.length > 0) {
        // Automatically display the first site by default
        await fetchAndDisplaySiteInfo(sitesData[0].site_id);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  }

  function populateSiteList(sites) {
    if (!siteListElement) {
      console.error('Element with ID "site-list" not found');
      return;
    }

    siteListElement.innerHTML = sites.map(site => `
          <li><a href="#" data-site-id="${site.site_id}">${site.site_name} (${site.site_id})</a></li>
      `).join('');

    // Attach click event to each link
    siteListElement.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', async (event) => {
        event.preventDefault();
        const siteId = event.target.dataset.siteId;

        // Remove 'selected' class from all links
        siteListElement.querySelectorAll('a').forEach(link => link.classList.remove('selected'));

        // Add 'selected' class to the clicked link
        event.target.classList.add('selected');

        await fetchAndDisplaySiteInfo(siteId);
      });
    });
  }

  async function fetchAndDisplaySiteInfo(siteId) {
    try {
      const [defectsData, inventoryData, maintenancesData] = await Promise.all([
        fetchData('http://127.0.0.1:8000/api/defects/'),
        fetchData('http://127.0.0.1:8000/api/inventories/'),
        fetchData('http://127.0.0.1:8000/api/maintenances/')
      ]);

      const site = sitesData.find(site => site.site_id === parseInt(siteId));
      const defects = defectsData.filter(defect => defect.site === parseInt(siteId));
      const inventory = inventoryData.filter(item => item.site_id === parseInt(siteId));
      const towers = towersData.filter(tower => tower.site === parseInt(siteId));
      const maintenances = maintenancesData.filter(maintenance => maintenance.site_id === parseInt(siteId));

      if (site) {
        siteInfoElement.innerHTML = `
                  <h2>Site Information</h2>
                  <p><b>Site ID:</b> ${site.site_id || 'N/A'}</p>
                  <p><b>Site Secondary ID:</b> ${site.site_secondary_id || 'N/A'}</p>
                  <p><b>Site Name:</b> ${site.site_name || 'N/A'}</p>
                  <p><b>Address:</b> ${site.address || 'N/A'}</p>
                  <p><b>Latitude:</b> ${site.latitude || 'N/A'}</p>
                  <p><b>Longitude:</b> ${site.longitude || 'N/A'}</p>
                  <p><b>Construction Date:</b> ${site.construction_date || 'N/A'}</p>
                  <p><b>Power Status:</b> ${site.power_status === 1 ? 'Yes' : 'No'}</p>
                  <p><b>EPC:</b> ${site.epc === 1 ? 'Yes' : 'No'}</p>
                  <p><b>DG:</b> ${site.dg === 1 ? 'Yes' : 'No'}</p>
                  <p><b>DG Run Restrictions:</b> ${site.dg_run_restrictions || 'N/A'}</p>
                  <p><b>Owner:</b> ${site.owner || 'N/A'}</p>
                  <p><b>Access Restrictions:</b> ${site.access_timings || 'N/A'}</p>
                  <p><b>Battery Capacity:</b> ${site.battery_capacity || 'N/A'} kWh</p>
                  <p><b>Battery Backup Time:</b> ${site.battery_backup_time || 'N/A'} hours</p>
                  <p><b>Last Visit Date:</b> ${site.last_visit_date || 'N/A'}</p>
                  <p><b>Last Maintenance Date:</b> ${site.last_maintenance_date || 'N/A'}</p>
                  <p><b>Latest Survey Date:</b> ${site.latest_survey_date || 'N/A'}</p>
                  <p><b>Safety Platform:</b> ${site.safety_platform || 'N/A'}</p>
                  <p><b>Vertical Fall Arrest Lifeline:</b> ${site.vertical_fall_arrest_lifeline || 'N/A'}</p>
              `;
      } else {
        siteInfoElement.innerHTML = '<p>Site not found.</p>';
      }

      updateDefects(defects);
      updateInventory(inventory);
      updateTowers(towers);
      updateMaintenances(maintenances);
    } catch (error) {
      console.error('Error fetching site details:', error);
    }
  }

  function updateDefects(defects) {
    if (!defectInfoElement) {
      console.error('Element with ID "defect-info" not found');
      return;
    }

    defectInfoElement.innerHTML = `
          <h2>Tower Health</h2>
          <h3>Defects</h3>
          ${defects.length ? defects.map(defect => `
              <p><b>Defect ID:</b> ${defect.defect_id || 'N/A'}</p>
              <p><b>Detected Date:</b> ${defect.detected_date || 'N/A'}</p>
              <p><b>Description:</b> ${defect.description || 'N/A'}</p>
              <p><b>Status:</b> ${defect.status || 'N/A'}</p>
              <p><b>Severity:</b> ${defect.severity || 'N/A'}</p>
              <p><b>Closed Date:</b> ${defect.closed_date || 'N/A'}</p>
              <p><b>Defect Photo:</b> ${defect.defect_photo || 'N/A'}</p>
              <p><b>Resolution:</b> ${defect.resolution || 'N/A'}</p>
              <p><b>Reported By:</b> ${defect.reported_by || 'N/A'}</p>
              <br>
          `).join('') : '<p>No defects found.</p>'}
      `;
  }

  function updateInventory(inventory) {
    if (!inventoryInfoElement) {
      console.error('Element with ID "inventory-info" not found');
      return;
    }

    inventoryInfoElement.innerHTML = `
          <h2>Inventory</h2>
          ${inventory.length ? inventory.map(item => `
              <p><b>Inventory No:</b> ${item.inventory_no || 'N/A'}</p>
              <p><b>Status:</b> ${item.status || 'N/A'}</p>
              <p><b>Type of Equipment:</b> ${item.type_of_equipment || 'N/A'}</p>
              <p><b>Manufacturer:</b> ${item.manufacturer || 'N/A'}</p>
              <p><b>Model No:</b> ${item.model_no || 'N/A'}</p>
              <p><b>Serial Number:</b> ${item.serial_number || 'N/A'}</p>
              <p><b>Asset Owner:</b> ${item.asset_owner || 'N/A'}</p>
              <p><b>Asset Number:</b> ${item.asset_number || 'N/A'}</p>
              <p><b>Date on Site:</b> ${item.date_on_site || 'N/A'}</p>
              <p><b>Dimensions:</b> ${item.dimensions || 'N/A'}</p>
              <p><b>Weight:</b> ${item.weight || 'N/A'} kg</p>
              <p><b>Condition:</b> ${item.condition || 'N/A'}</p>
          `).join('') : '<p>No inventory items found.</p>'}
      `;
  }

  function updateTowers(towers) {
    if (!towerMeasurementArea) {
      console.error('Element with ID "tower-measurement" not found');
      return;
    }

    towerMeasurementArea.innerHTML = `
          <h2>Towers</h2>
          ${towers.length ? towers.map(tower => `
              <p><b>Tower ID:</b> ${tower.tower_id || 'N/A'}</p>
              <p><b>Tower Name:</b> ${tower.tower_name || 'N/A'}</p>
              <p><b>Tower Height:</b> ${tower.tower_height || 'N/A'} meters</p>
              <p><b>Tower Type:</b> ${tower.tower_type || 'N/A'}</p>
              <p><b>Shelter Length:</b> ${tower.shelter_length || 'N/A'} meters</p>
              <p><b>Shelter Width:</b> ${tower.shelter_width || 'N/A'} meters</p>
              <p><b>Shelter Height:</b> ${tower.shelter_height || 'N/A'} meters</p>
              <p><b>Number of RF Antennas:</b> ${tower.num_rf_antennas || 'N/A'}</p>
              <p><b>Number of Microwave Antennas:</b> ${tower.num_microwave_antennas || 'N/A'}</p>
              <p><b>Other Antennas:</b> ${tower.other_antennas || 'N/A'}</p>
              <p><b>Number of Tower Electronics:</b> ${tower.num_tower_electronics || 'N/A'}</p>
              <p><b>Tower Loading Actual:</b> ${tower.tower_loading_actual || 'N/A'} kg</p>
              <p><b>Weight Distribution:</b> ${tower.weight_distribution || 'N/A'}</p>
              <p><b>Expansion Space Available:</b> ${tower.expansion_space_available || 'N/A'} meters</p>
          `).join('') : '<p>No towers found.</p>'}
      `;
  }

  function updateMaintenances(maintenances) {
    if (!defectInfoElement) {
      console.error('Element with ID "defect-info" not found');
      return;
    }

    defectInfoElement.innerHTML += `
          <h3>Maintenance Records</h3>
          ${maintenances.length ? maintenances.map(maintenance => `
              <p><b>Record ID:</b> ${maintenance.record_id || 'N/A'}</p>
              <p><b>Date:</b> ${maintenance.date || 'N/A'}</p>
              <p><b>Performed By:</b> ${maintenance.performed_by || 'N/A'}</p>
              <p><b>Maintenance Type:</b> ${maintenance.maintenance_type || 'N/A'}</p>
              <p><b>Maintenance Report:</b> ${maintenance.maintenance_report || 'N/A'}</p>
              <p><b>Notes:</b> ${maintenance.notes || 'N/A'}</p>
          `).join('') : '<p>No maintenance records found.</p>'}
      `;
  }


  function filterSites() {
    const query = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const selectedSiteType = siteTypeSelect.value;
    const selectedMaintStatus = maintStatusSelect.value;

    console.log('Filtering sites with query:', query, 'category:', selectedCategory, 'site type:', selectedSiteType, 'maintenance status:', selectedMaintStatus);

    // Filter based on maintenance status
    let filteredMaintenances;
    const now = new Date();
    if (selectedMaintStatus === 'completed_last_month') {
      filteredMaintenances = maintenancesData.filter(maintenance => {
        const maintenanceDate = new Date(maintenance.date);
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        return maintenanceDate >= oneMonthAgo && maintenanceDate <= new Date();
      });
    } else if (selectedMaintStatus === 'completed_last_year') {
      filteredMaintenances = maintenancesData.filter(maintenance => {
        const maintenanceDate = new Date(maintenance.date);
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        return maintenanceDate >= oneYearAgo && maintenanceDate <= new Date();
      });
    } else {
      filteredMaintenances = maintenancesData;
    }

    // Filter sites based on the filtered maintenance records
    const filteredSiteIds = new Set(filteredMaintenances.map(maintenance => maintenance.site_id));

    const filteredSites = sitesData.filter(site => {
      const matchesQuery = site.site_name.toLowerCase().includes(query) ||
        site.address.toLowerCase().includes(query) ||
        (site.customer_specific_field_1 && site.customer_specific_field_1.toLowerCase().includes(query)) ||
        (site.customer_specific_field_2 && site.customer_specific_field_2.toLowerCase().includes(query)) ||
        (site.customer_specific_field_3 && site.customer_specific_field_3.toLowerCase().includes(query)) ||
        (site.customer_specific_field_4 && site.customer_specific_field_4.toLowerCase().includes(query)) ||
        (site.customer_specific_field_5 && site.customer_specific_field_5.toLowerCase().includes(query));
      const matchesCategory = selectedCategory ? site.customer_specific_field_1 === selectedCategory : true;

      // Check if the site has any tower that matches the selected site type
      const siteTowers = towersData.filter(tower => tower.site === site.site_id);
      const matchesSiteType = selectedSiteType ? siteTowers.some(tower => tower.tower_type === selectedSiteType) : true;

      return matchesQuery && matchesCategory && matchesSiteType && filteredSiteIds.has(site.site_id);
    });

    console.log('Filtered sites:', filteredSites);

    populateSiteList(filteredSites);
  }

  searchInput.addEventListener('input', filterSites);
  categorySelect.addEventListener('change', filterSites);
  siteTypeSelect.addEventListener('change', filterSites);
  maintStatusSelect.addEventListener('change', filterSites);

  // Initial fetch of site and tower data
  fetchSites();
});
