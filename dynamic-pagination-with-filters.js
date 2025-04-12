/**
 * dynamic-pagination-with-filters.js - A lightweight JavaScript library for dynamic data loading and pagination.
 *
 * @version 1.0.0
 * @author Jatin Sureliya <jatinsureliya@gmail.com>
 * @license MIT
 * @see https://github.com/jatinsureliya/dynamic-pagination-with-filters
 * @description
 * DynamicPaginationWithFilters simplifies fetching and rendering paginated data from APIs with smooth scrolling
 * and browser history management. It provides a flexible configuration for filters (including nested filters) and UI updates.
 * Supports a custom callback for handling additional 'data' property in API responses.
 *
 * @example
 * const filteredPager = new DynamicPaginationWithFilters({
 *   apiBaseUrl: 'https://api.example.com/data',
 *   dataContainerId: 'data-container',
 *   dataWrapperId: 'data-wrapper',
 *   dataCallback: (data) => {
 *     console.log('Received data:', data);
 *     document.getElementById('balance').textContent = data.balance;
 *   }
 * });
 * filteredPager.loadData({
 *   page: 1,
 *   date_filter: {
 *     start: '2023-01-01',
 *     end: '2023-12-31'
 *   }
 * });
 *
 * @copyright 2025 Jatin Sureliya
 * @repository https://github.com/jatinsureliya/dynamic-pagination-with-filters
 * @bugs https://github.com/jatinsureliya/dynamic-pagination-with-filters/issues
 * @homepage https://cdn.jsdelivr.net/gh/jatinsureliya/dynamic-pagination-with-filters@latest/dynamic-pagination-with-filters.js
 */

class DynamicPaginationWithFilters {
  constructor(config = {}) {
    this.config = {
      apiBaseUrl: "",
      dataContainerId: "data-container",
      dataWrapperId: "data-wrapper",
      paginationSectionClass: "pagination-section",
      scrollOffsetPixels: 100,
      requestFilters: {
        page: 1,
      },
      dataCallback: null,
      ...config,
    };

    this.elements = {
      container: document.getElementById(this.config.dataContainerId),
      wrapper: document.getElementById(this.config.dataWrapperId),
    };

    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.init();
  }

  init() {
    this.elements.container.addEventListener(
      "click",
      this.handlePaginationClick
    );
    //this.loadData(); // Uncomment if you want auto-loading
  }

  async loadData(filters = {}) {
    this.config.requestFilters = { ...this.config.requestFilters, ...filters };
    const url = this.buildUrl();

    try {
      this.showLoading();
      const response = await this.fetchData(url);
      this.updateUI(response);
      this.updateBrowserHistory(url);
      this.smoothScrollToContainer();
    } catch (error) {
      this.handleError(error);
    } finally {
      this.hideLoading();
    }
  }

  buildUrl() {
    const url = new URL(this.config.apiBaseUrl, window.location.origin);
    const filters = this.config.requestFilters;

    // Helper function to append nested filters to URL
    const appendQueryParams = (params, prefix = "") => {
      Object.entries(params).forEach(([key, value]) => {
        if (value == null) return; // Skip null or undefined values

        if (typeof value === "object" && !Array.isArray(value)) {
          // Handle nested objects
          appendQueryParams(value, prefix ? `${prefix}[${key}]` : key);
        } else {
          // Handle flat values
          const paramKey = prefix ? `${prefix}[${key}]` : key;
          if (value || (key === "page" && value === 1)) {
            url.searchParams.set(paramKey, value);
          }
        }
      });
    };

    appendQueryParams(filters);
    return url;
  }

  async fetchData(url) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  updateUI(response) {
    this.elements.wrapper.innerHTML = response.rows;

    const paginationSection = document.querySelector(
      `.${this.config.paginationSectionClass}`
    );
    if (response.pagination) {
      if (paginationSection) {
        paginationSection.outerHTML = response.pagination;
      } else {
        this.elements.wrapper.insertAdjacentHTML(
          "afterend",
          response.pagination
        );
      }
    } else if (paginationSection) {
      paginationSection.remove();
    }

    if (response.data && typeof this.config.dataCallback === "function") {
      this.config.dataCallback(response.data);
    }
  }

  handlePaginationClick(e) {
    const link = e.target.closest(`.${this.config.paginationSectionClass} a`);
    if (link) {
      e.preventDefault();
      const url = new URL(link.href);
      const page = url.searchParams.get("page");
      this.loadData({ page });
    }
  }

  updateBrowserHistory(url) {
    window.history.pushState(
      { page: this.config.requestFilters.page },
      document.title,
      url.toString()
    );
  }

  smoothScrollToContainer() {
    window.scrollTo({
      top: this.elements.container.offsetTop - this.config.scrollOffsetPixels,
      behavior: "smooth",
    });
  }

  showLoading() {
    this.elements.wrapper.classList.add("data-loading");
  }

  hideLoading() {
    this.elements.wrapper.classList.remove("data-loading");
  }

  handleError(error) {
    console.error("Error loading data:", error);
    alert("Error loading data. Please try again.");
  }

  setFilters(filters) {
    this.loadData(filters);
  }
}
