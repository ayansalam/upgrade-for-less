# Animated UI Components

A collection of beautifully animated React components built with Framer Motion, Tailwind CSS, and shadcn/ui.

## Features

- 🎨 Beautiful, smooth animations
- ♿ Accessibility-first design
- 🔄 Route transitions with loading states
- 📱 Responsive and mobile-friendly
- 🎯 Performance optimized
- 🌙 Dark mode support
- 🔧 Highly customizable
- 📦 Easy to integrate

## Installation

1. Install dependencies:
```bash
npm install framer-motion @radix-ui/react-* tailwindcss
```

2. Copy the `animated` directory to your project:
```bash
cp -r src/components/ui/animated your-project/src/components/ui/
```

3. Import styles:
```bash
cp src/styles/animations.css your-project/src/styles/
```

4. Add to your Tailwind config:
```js
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        glow: {
          "0%, 100%": { opacity: 0.5, backgroundPosition: "0% 50%" },
          "50%": { opacity: 0.8, backgroundPosition: "100% 50%" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        glow: "glow 2s ease-in-out infinite",
        gradient: "gradient 3s ease infinite",
      },
    },
  },
  plugins: [],
};
```

## Usage

### Basic Setup

Wrap your app with the `AnimationProvider`:

```tsx
import { AnimationProvider } from "@/components/ui/animated";

function App() {
  return (
    <AnimationProvider>
      <YourApp />
    </AnimationProvider>
  );
}
```

### Page Transitions

```tsx
import { PageTransitionWrapper } from "@/components/ui/animated";

function Layout({ children }) {
  return (
    <PageTransitionWrapper
      variant="pageTransitionFade"
      withOverlay
      overlayStyle="blur"
      showLoadingIndicator="spinner"
    >
      {children}
    </PageTransitionWrapper>
  );
}
```

### Interactive Components

```tsx
import {
  AnimatedButton,
  AnimatedCard,
  AnimatedDropdown,
  AnimatedToast,
} from "@/components/ui/animated";

function MyComponent() {
  return (
    <div>
      <AnimatedButton>Click Me</AnimatedButton>
      
      <AnimatedCard>
        <h2>Card Content</h2>
      </AnimatedCard>
      
      <AnimatedDropdown>
        <DropdownTrigger>Open Menu</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Item 1</DropdownItem>
          <DropdownItem>Item 2</DropdownItem>
        </DropdownContent>
      </AnimatedDropdown>
      
      <AnimatedToast
        title="Success!"
        description="Operation completed"
      />
    </div>
  );
}
```

### Reduced Motion

The system automatically respects the user's reduced motion preferences. You can also manually check this:

```tsx
import { prefersReducedMotion } from "@/components/ui/animated";

function MyComponent() {
  if (prefersReducedMotion) {
    // Use simpler animations or none at all
  }
  return <div>...</div>;
}
```

## Components

- `PageTransitionWrapper`: Smooth page transitions with loading states
- `AnimatedButton`: Interactive button animations
- `AnimatedCard`: Card component with hover effects
- `AnimatedInput`: Form input with focus animations
- `AnimatedTabs`: Smooth tab switching
- `AnimatedAccordion`: Expandable content
- `AnimatedTooltip`: Spring-animated tooltips
- `AnimatedModal`: Modal dialogs with transitions
- `AnimatedDropdown`: Dropdown menus
- `AnimatedToast`: Toast notifications
- `AnimatedList`: List with item animations

## Configuration

Global animation settings can be customized in `motion.config.ts`:

- Springs
- Durations
- Easing curves
- Default configurations

## Examples

### Marketing Landing Page

```tsx
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedList,
} from "@/components/ui/animated";

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <AnimatedCard variant="heroTitle">
        <h1>Welcome to Our Product</h1>
      </AnimatedCard>
      
      {/* Features */}
      <AnimatedList variant="staggered">
        {features.map(feature => (
          <AnimatedCard key={feature.id}>
            {feature.content}
          </AnimatedCard>
        ))}
      </AnimatedList>
      
      {/* CTA */}
      <AnimatedButton variant="cta">
        Get Started
      </AnimatedButton>
    </div>
  );
}
```

### Dashboard

```tsx
import {
  AnimatedTabs,
  AnimatedCard,
  AnimatedToast,
} from "@/components/ui/animated";

function Dashboard() {
  return (
    <div>
      <AnimatedTabs>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AnimatedCard>
            <DashboardOverview />
          </AnimatedCard>
        </TabsContent>
        <TabsContent value="analytics">
          <AnimatedCard>
            <DashboardAnalytics />
          </AnimatedCard>
        </TabsContent>
      </AnimatedTabs>
      
      <AnimatedToast
        title="Welcome back!"
        description="Here's what's new..."
      />
    </div>
  );
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT 