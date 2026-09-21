# Rupkotha Mart

Rupkotha Mart is a modern, responsive e-commerce storefront built with vanilla HTML, CSS, and JavaScript. It showcases lifestyle products across home, fashion, tech, and beauty categories.

## Features

- Responsive e-commerce storefront UI
- Product listing loaded from JSON data
- Product filtering by category
- See-more pagination for product results
- Add products to a shopping cart
- Cart item removal and subtotal calculation
- Checkout form with customer and delivery details
- Payment method selection: Cash on Delivery, Card, bKash, and Nagad
- Dynamic shipping and order total calculation
- Recent order updates section
- Toast notifications for cart and order actions
- Fallback product data source when the API path is unavailable

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- JSON
- Unsplash and Picsum image URLs

## Project Structure

```text
.
├── index.html          # Main storefront page
├── styles.css          # Layout, responsive styles, and theme
├── script.js           # Product, cart, filter, and checkout logic
├── products.json       # Fallback product data
└── api/
    └── products.json   # Primary product data source
```

## Run Locally

Because the app loads product data with `fetch()`, run it through a local web server instead of opening `index.html` directly.

### Option 1: VS Code Live Server

1. Install the **Live Server** extension in VS Code.
2. Open `index.html`.
3. Right-click the file and select **Open with Live Server**.

### Option 2: Python server

If Python is installed, run this command from the project folder:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Product Data

Update `api/products.json` to change the primary product catalog. Keep `products.json` in sync if you want the fallback catalog to contain the same products.

Each product uses this structure:

```json
{
  "id": 1,
  "name": "Product name",
  "category": "home",
  "tag": "New",
  "price": 25,
  "oldPrice": 40,
  "rating": 4.8,
  "color": "#d8b59f",
  "description": "Short product description.",
  "image": "https://example.com/product-image.jpg"
}
```

## GitHub Pages

This project can be published as a static website with GitHub Pages:

1. Push the project to a GitHub repository.
2. Open the repository's **Settings** tab.
3. Go to **Pages** under **Code and automation**.
4. Select **Deploy from a branch**.
5. Choose the main branch and the root folder, then click **Save**.

## Current Demo Scope

The cart, checkout, and recent orders are handled in browser memory only. Refreshing the page clears the cart and newly placed orders. No real payment gateway, authentication system, or server-side order processing is connected yet.

## License

This project is for learning and demonstration purposes.