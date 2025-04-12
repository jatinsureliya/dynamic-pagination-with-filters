# DynamicPaginationWithFilters

A lightweight JavaScript utility for handling paginated data requests and UI updates with minimal configuration.

## Features

- Handles AJAX data loading with pagination
- Updates browser history for proper back/forward navigation
- Smooth scrolling to the data container after updates
- Customizable loading states
- Filter support for content types, sorting, and search queries
- Error handling with user feedback

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/jatinsureliya/dynamic-pagination-with-filters@latest/dynamic-pagination-with-filters.js"></script>
```

### npm

```bash
# Coming soon
```

## Usage

### Basic Setup

1. Include the script in your HTML
2. Set up your HTML container structure
3. Initialize DynamicPaginationWithFilters with your configuration

```html
<div id="data-container">
  <div id="data-wrapper">
    <!-- Your data rows will be inserted here -->
  </div>
  <!-- Pagination will be inserted after the wrapper -->
</div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const filteredPager = new DynamicPaginationWithFilters({
      apiBaseUrl: "/api/your-endpoint",
      // Additional configuration options as needed
    });

    // Trigger initial data load
    filteredPager.loadData();
  });
</script>
```

### Configuration Options

```javascript
const filteredPager = new DynamicPaginationWithFilters({
  // Required
  apiBaseUrl: "/api/your-endpoint",

  // Optional with defaults
  dataContainerId: "data-container",
  dataWrapperId: "data-wrapper",
  paginationSectionClass: "pagination-section",
  scrollOffsetPixels: 100,
  requestFilters: {
    page: 1,
    contentType: "",
    sortOrder: "",
    searchQuery: "",
  },
});
```

### API Response Format

DynamicPaginationWithFilters expects the API to return a JSON object with the following structure:

```json
{
  "rows": "<HTML for the data rows>",
  "pagination": "<HTML for the pagination controls>"
}
```

### Applying Filters

You can update the data based on filters:

```javascript
// Apply a single filter
filteredPager.loadData({ page: 2 });

// Apply multiple filters
filteredPager.loadData({
  contentType: "articles",
  sortOrder: "newest",
  searchQuery: "javascript",
});

// Alternative method
filteredPager.setFilters({
  contentType: "articles",
  sortOrder: "newest",
});
```

### Implementing Filter Controls

Example with form controls:

```html
<select id="content-type">
  <option value="">All Types</option>
  <option value="articles">Articles</option>
  <option value="videos">Videos</option>
</select>

<select id="sort-order">
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
</select>

<input type="text" id="search" placeholder="Search..." />
<button id="search-button">Search</button>

<script>
  document
    .getElementById("content-type")
    .addEventListener("change", function () {
      filteredPager.loadData({ contentType: this.value, page: 1 });
    });

  document.getElementById("sort-order").addEventListener("change", function () {
    filteredPager.loadData({ sortOrder: this.value, page: 1 });
  });

  document
    .getElementById("search-button")
    .addEventListener("click", function () {
      const searchQuery = document.getElementById("search").value;
      filteredPager.loadData({ searchQuery: searchQuery, page: 1 });
    });
</script>
```

### CSS for Loading State

```css
.data-loading {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}

.data-loading::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

## Methods

| Method                      | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `loadData(filters)`         | Fetch data with optional filters                  |
| `setFilters(filters)`       | Alternative method to set filters and load data   |
| `init()`                    | Initialize event listeners (called automatically) |
| `buildUrl()`                | Constructs the API URL with current filters       |
| `updateUI(response)`        | Updates the DOM with the API response             |
| `smoothScrollToContainer()` | Scrolls to the data container                     |
| `showLoading()`             | Displays loading state                            |
| `hideLoading()`             | Removes loading state                             |

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 10.1+
- Edge 16+

## License

MIT

## Author

Jatin Sureliya
