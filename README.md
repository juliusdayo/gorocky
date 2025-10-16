# GoRocky - Motorcycle E-commerce Marketplace

A comprehensive motorcycle e-commerce marketplace with advanced admin management, bidding system, and multi-user support. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### 🏍️ **Motorcycle Management**

- Complete CRUD operations for motorcycle listings
- Advanced filtering by brand, year range, and price range
- Professional image handling and gallery support
- Status management (available, sold, pending)
- Detailed specifications and upgrade tracking

### 👥 **User Management System**

- **Buyers** - Potential customers who can place bids
- **Sellers** - Motorcycle dealers and individual sellers
- Comprehensive profile management with verification status
- Contact information and location tracking

### 💰 **Bidding & Marketplace**

- Multi-bidder system with competitive bidding
- Real-time bid tracking and status management
- Bid expiration and withdrawal functionality
- Detailed bid history and analytics

### �️ **Admin Dashboard**

- **Motorcycle Management** - Full admin control over all listings
- **Buyer Management** - View all buyers and their bidding activity
- **Seller Management** - Track seller performance and verification
- Professional filtering, search, and sorting capabilities
- Comprehensive relationship tracking between all entities

### 🔐 **Authentication & Security**

- Secure user authentication with Supabase
- Row Level Security (RLS) policies
- Admin role management
- Audit trails for all data modifications

### 🎨 **Professional UI/UX**

- Modern, responsive design with dark mode support
- Custom toast notification system
- Professional confirmation modals
- Clean admin interface with organized navigation
- Real-time loading states and error handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with multi-role support
- **Real-time**: Supabase Realtime subscriptions
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/juliusdayo/gorocky.git
cd gorocky
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Supabase**

   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Go to Settings > API and copy your keys
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials

4. **Set up the database**

   - Go to your Supabase project's SQL Editor
   - Run the database schema: `src/lib/database-schema.sql`
   - Optional: Run sample data: `src/lib/seed-data.sql`

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/              # Admin route group
│   │   ├── dashboard/        # Admin dashboard
│   │   ├── motorcycles/      # Motorcycle management
│   │   └── buyers/           # Buyer management
│   │       └── [id]/         # Individual buyer details
│   ├── api/
│   │   └── motorcycles/      # API endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              # Landing page
├── components/
│   ├── admin/                # Admin-specific components
│   │   ├── motorcycle/       # Motorcycle components
│   │   │   ├── MotorcycleList.tsx
│   │   │   ├── MotorcycleForm.tsx
│   │   │   ├── MotorcycleCard.tsx
│   │   │   └── MotorcycleFilter.tsx
│   │   ├── Toast.tsx         # Notification system
│   │   ├── ConfirmationModal.tsx
│   │   ├── AdminLayout.tsx
│   │   └── Sidebar.tsx
│   └── public/               # Public-facing components
└── lib/
    ├── supabase/            # Supabase client configuration
    │   ├── client.ts        # Client-side Supabase
    │   ├── server.ts        # Server-side Supabase
    │   └── middleware.ts    # Auth middleware
    ├── database-schema.sql   # Complete database schema
    └── seed-data.sql        # Sample data for development
```

## 🔌 API Endpoints

### Motorcycles

- `GET /api/motorcycles` - List motorcycles with filtering and pagination
- `POST /api/motorcycles` - Create new motorcycle listing (requires auth)
- `GET /api/motorcycles/[id]` - Get specific motorcycle
- `PUT /api/motorcycles/[id]` - Update motorcycle (requires auth & ownership)
- `DELETE /api/motorcycles/[id]` - Delete motorcycle (requires auth & ownership)

### Admin Functions

- Comprehensive CRUD operations for all entities
- Relationship management between buyers, sellers, and motorcycles
- Advanced filtering and search capabilities

### Query Parameters (GET /api/motorcycles)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `brand` - Filter by brand name
- `minYear` - Minimum year
- `maxYear` - Maximum year
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

## 🔐 Authentication & Security

The app uses Supabase Authentication with comprehensive Row Level Security (RLS):

### **Access Control**

- **Public Access**: View available motorcycles and marketplace data
- **Admin Access**: Full CRUD operations on all entities
- **User Ownership**: Users can only modify their own data

### **RLS Policies**

- Motorcycles: Users can only edit/delete their own listings
- Buyers: Users can manage their own buyer profiles and bids
- Sellers: Users can manage their own seller profiles
- Audit Trails: All modifications tracked by admin user

## 🗄️ Database Schema

The app uses a comprehensive PostgreSQL database with the following tables:

### **motorcycles**

- Complete motorcycle listing information
- Brand, model, year, pricing, and specifications
- Upgrade tracking and status management
- Owner and seller relationship tracking

### **buyers**

- Buyer profile information and verification status
- Contact details and location data
- Audit tracking of which admin added the buyer

### **sellers**

- Seller/dealer profile information
- Business details and performance ratings
- Verification status and sales tracking

### **bids**

- Comprehensive bidding system
- Bid amounts, status, and expiration tracking
- Relationship between buyers and motorcycles
- Message/notes support for negotiations

### **Key Relationships**

- `motorcycles` ↔ `sellers` (one-to-many)
- `buyers` ↔ `bids` ↔ `motorcycles` (many-to-many through bids)
- All entities track the admin user who created them

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

## 🧪 Development & Testing

### Sample Data

The project includes comprehensive sample data in `src/lib/seed-data.sql`:

- 5 motorcycle sellers with ratings and verification status
- 5 potential buyers from different locations
- 5 high-end motorcycle listings
- 14 competitive bids showing marketplace activity

### Admin Panel Access

1. Sign up/in to create an admin account
2. Navigate to `/dashboard` for the admin panel
3. Use the sidebar to access different management sections

## 🔧 Key Features Demonstrated

### **Marketplace Dynamics**

- Multiple bidders competing on popular motorcycles
- Price ranges from $19,800 to $28,500
- Geographic diversity across major US markets
- Mix of verified and unverified participants

### **Admin Capabilities**

- **Motorcycle Management**: Full CRUD with professional filtering
- **Buyer Analytics**: Track all buyers and their bidding patterns
- **Seller Management**: Monitor dealer performance and verification
- **Relationship Tracking**: See connections between all entities

### **Professional UI Components**

- Custom toast notification system
- Confirmation modals for destructive actions
- Responsive design with dark mode support
- Advanced filtering and search functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and Auth by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
