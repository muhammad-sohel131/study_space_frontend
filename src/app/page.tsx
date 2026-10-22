import { HeroSlider } from '@/components/home/HeroSlider';
import { EnvironmentsGallery } from '@/components/home/EnvironmentsGallery';
import { ExperienceShowcase } from '@/components/home/ExperienceShowcase';
import { CoreOfferingsDark } from '@/components/home/CoreOfferingsDark';
import { ComparisonSection } from '@/components/home/ComparisonSection';
import { VisualHowItWorks } from '@/components/home/VisualHowItWorks';
import { TestimonialsWithAvatars } from '@/components/home/TestimonialsWithAvatars';
import { VibrantCTA } from '@/components/home/VibrantCTA';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-violet-600 selection:text-white">
            {/* 1. Hero Slider with interactive slides */}
            <HeroSlider />

            {/* 2. Photographic Study Environments Gallery (Interactive Filter Tabs) */}
            <EnvironmentsGallery />

            {/* 4. Panoramic Ambiance & Cognitive Focus Showcase */}
            <ExperienceShowcase />

            {/* 5. Sleek Luxury Dark SaaS Capabilities Section */}
            <CoreOfferingsDark />

            {/* 6. Why StudySpace Beats Home & Cafes Comparison */}
            <ComparisonSection />

            {/* 7. Photographic 3-Step Guided Reservation Flow */}
            <VisualHowItWorks />

            {/* 8. Testimonials with Authentic Student Avatars & Verified Badges */}
            <TestimonialsWithAvatars />

            {/* 9. High-Conversion Multi-layered Gradient CTA */}
            <VibrantCTA />
        </div>
    );
}
