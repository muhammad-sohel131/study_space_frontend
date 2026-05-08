# StudySpace UI Design System

## 🎨 Color Palette

### Primary Colors
- **Indigo**: `#4f46e5` - Main brand color for buttons, links, and primary actions
- **Indigo Dark**: `#4338ca` - Hover state for primary color
- **Indigo Light**: `#6366f1` - Secondary indigo variations

### Background
- **Slate 50**: `#f8fafc` - Main background
- **White**: `#ffffff` - Card backgrounds

### Neutral Colors
- **Slate 600**: `#475569` - Secondary text
- **Slate 800**: `#1e293b` - Primary text
- **Slate 900**: `#0f172a` - Headings

### Accent Colors
- **Emerald 600**: `#059669` - Success states
- **Amber 500**: `#f59e0b` - Premium/Warning
- **Red 500**: `#ef4444` - Error states

## 📦 Components

### UI Components
1. **Button** - Primary, secondary, outline, danger, ghost variants
   - Sizes: sm, md, lg
   - Features: Loading state, disabled state, smooth hover animations

2. **Input** - Text input with label, error state, and validation
   - Error messages in red
   - Focus ring in indigo

3. **Card** - Rounded white cards with soft shadows
   - Standard padding and spacing
   - Used for data containers

4. **Badge** - Status indicators
   - Variants: default, success, warning, error, info, premium
   - Sizes: sm, md

5. **Skeleton** - Loading placeholders
   - CardSkeleton for loading cards
   - TableRowSkeleton for table data

6. **Modal** - Dialog component with header, content, footer
   - Blur background overlay
   - Sizes: sm, md, lg

7. **Tabs** - Tab navigation component
   - Smooth transitions
   - Icon support

8. **StatCard** - Dashboard statistics display
   - Variants for different data types
   - Trend indicators (up/down)

9. **SeatGrid** - Interactive seat selection
   - States: available, selected, booked, premium
   - Hover animations
   - Visual legend

10. **EmptyState** - Empty result screens
    - Icon, title, description, action button

### Card Components
1. **BookCard** - Book display with:
   - Cover image placeholder
   - Title, author, price
   - Rating and reviews
   - Favorite toggle
   - Borrow/Buy buttons

2. **BookingCard** - Booking information with:
   - Center details
   - Date/time/location info
   - Status badges
   - Action buttons (Cancel, Reschedule)

3. **CenterCard** - Study center display with:
   - Location and distance
   - Available seats
   - Rating and books count
   - Occupancy bar
   - Book Now button

### Layout Components
1. **Navbar** - Sticky header with:
   - Logo and branding
   - Navigation links
   - User profile or login/signup buttons
   - Mobile responsive menu

2. **Layout** - Main layout wrapper
   - Includes Navbar
   - Max width container
   - Proper padding

## 🎯 Design Principles

1. **Premium SaaS Look**: Clean, minimal, professional
2. **Calm & Focused**: Soft colors, good spacing
3. **Interactive**: Smooth animations, hover states
4. **Accessible**: Proper contrast, clear states
5. **Responsive**: Mobile-first design

## 💫 Animations & Effects

- **Smooth Transitions**: 200ms duration for all interactive elements
- **Hover Scale**: Slight scale increase on cards and buttons
- **Focus Ring**: 2px indigo ring on focus
- **Active Scale**: Slight scale decrease on click
- **Pulse Animation**: Subtle pulse on background elements

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Usage Guidelines

### Buttons
```tsx
<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" size="lg">Outline Button</Button>
<Button isLoading>Loading...</Button>
```

### Cards
```tsx
<div className="bg-white rounded-2xl shadow-sm p-6">
  Content here
</div>
```

### Colors in Tailwind
- Primary: `bg-indigo-600`, `text-indigo-600`
- Success: `bg-emerald-600`, `text-emerald-600`
- Error: `bg-red-500`, `text-red-500`
- Warning: `bg-amber-500`, `text-amber-500`

## 🔄 Component State Management

All components support disabled, loading, and error states with appropriate visual feedback.

## 📖 Implementation Status

- ✅ Color system updated to Indigo + Slate
- ✅ Button component redesigned
- ✅ Input component with Indigo focus ring
- ✅ Card components created (Book, Booking, Center)
- ✅ Navbar updated with Indigo branding
- ✅ Seat grid with interactive states
- ✅ Dashboard components (Stats, etc.)
- ✅ Empty states and skeletons
- ✅ Modal and Tabs components
- ✅ Home page redesigned as premium SaaS
- ⏳ Dashboard pages (in progress)
- ⏳ Book listing page (in progress)
- ⏳ Center listing page (in progress)
