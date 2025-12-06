# TMSE Pizza - Mom & Pop's Pizza Ordering System

A full-featured pizza ordering application built with Next.js, React, and Electron.

## 🍕 Features

### Customer Features
- **User Authentication**: Login and registration system with customer profile management
- **Menu Browsing**: View all specialty pizzas and beverages with pricing
- **Custom Pizza Builder**: Build your own pizza with:
  - 4 distinct pizza sizes (Personal 8", Small 10", Medium 12", Large 16")
  - 3 crust options (Hand-Tossed, Thin Ninja Style, Deep Dish)
  - 8 distinct toppings (up to 4 per pizza)
- **Beverages**: 5 distinct beverages with 3 sizes each
- **Shopping Cart**: Add items, modify quantities, view totals
- **Checkout**: Support for pickup and delivery orders
- **Payment Processing**: Credit card, cash, and check options
- **Order History**: View past orders and receipts

### System Features
- **Responsive Design**: Works on desktop and mobile
- **Desktop Application**: Packaged with Electron for standalone executable
- **File-based Storage**: Customer and order data persisted in localStorage (simulating database)
- **Real-time Pricing**: Dynamic price calculation based on size, crust, and toppings

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Clone or extract the project:
```bash
cd pizza_project/app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Email**: leo@tmse.com
- **Password**: password123

## 📦 Building for Production

### Build Next.js Only
```bash
npm run build
npm start
```

### Build Desktop Application (Electron)
```bash
# Install electron-builder globally if needed
npm install -g electron-builder

# Build the executable
npm run dist
```

The executable will be created in the `dist/` folder.

### Create Project ZIP
```bash
node scripts/build-and-zip.js
```

This creates:
- Desktop executable in `dist/`
- Project archive in `output/TMSE-Pizza-Project.zip`

## 📁 Project Structure

```
app/
├── electron/           # Electron main process
│   └── main.js
├── public/             # Static assets
├── scripts/            # Build scripts
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── about/
│   │   ├── build/     # Custom pizza builder
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── menu/
│   │   ├── order-confirmation/
│   │   ├── orders/
│   │   └── register/
│   ├── components/    # Reusable React components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── context/       # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/          # Menu data
│   │   └── menu.ts
│   ├── lib/           # Utilities
│   │   └── storage.ts
│   └── types/         # TypeScript types
│       └── index.ts
├── package.json
├── server.js          # Custom Next.js server for Electron
└── README.md
```

## 📋 Requirements Compliance

### From Rubric:
- ✅ Pizza ordering system with user login
- ✅ 4 distinct pizza sizes (Personal, Small, Medium, Large)
- ✅ 8 distinct toppings (up to 4 per pizza)
- ✅ 3 crust options (Hand-Tossed, Thin Ninja, Deep Dish)
- ✅ 5 beverages with 3 sizes
- ✅ Display pricing
- ✅ Order summary screen with items, prices, and totals
- ✅ Executable file (via Electron)
- ✅ Zipped folder containing entire project

### Menu Items (Mom and Pop's Theme):

**Specialty Pizzas:**
1. Cowabunga Classic - $8.99
2. Splinter's Wisdom (Veggie) - $10.99
3. Shredder Supreme (Meat Lovers) - $12.99
4. Ninja Chicken Combo - $11.99
5. Pepperoni Party - $9.99
6. Build Your Own - $7.99

**Toppings ($1.00-$1.75 each):**
1. Pepperoni
2. Italian Sausage
3. Fresh Mushrooms
4. Onions
5. Bell Peppers
6. Black Olives
7. Crispy Bacon
8. Extra Cheese

**Beverages:**
1. Mutant Ooze (Lemon-Lime)
2. Shell Shock Cola
3. Sewer Sweet Tea
4. Ninja Water
5. Master's Lemonade

## 🔧 Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Desktop**: Electron 28
- **Build**: electron-builder

## 📄 License

This project was created for educational purposes as part of the TMSE course.

---

🐢 *"I love being a turtle!"* - Cowabunga!
