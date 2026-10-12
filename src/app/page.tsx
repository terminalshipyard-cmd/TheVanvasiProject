import React from "react";
import { getProducts } from "@/lib/data";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { SmoothScroll } from "@/components/shop/SmoothScroll";
import { MapPin, Clock, Truck, ShieldCheck, ChevronDown } from "lucide-react";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-[#FBF9F5] text-[#1C241E] overflow-x-hidden">
        <Navbar />

        {/* 1. Full-screen Hero Section */}
        <section className="hero-section relative h-screen w-full flex flex-col justify-between items-center text-center px-4 overflow-hidden pt-24 pb-10">
          {/* Full-bleed Parallax Landscape */}
          <div className="hero-bg-parallax absolute inset-0 -top-[10%] -bottom-[10%] w-full h-[120%] z-0">
            <img
              src="/images/tokla-final-181-scaled.jpg"
              alt="Nepal Himalayan hills and tea garden terraces"
              className="w-full h-full object-cover object-center filter brightness-[0.92]"
            />
            {/* Frosted atmospheric blur layer directly in front of the hills (gentle 3px blur) */}
            <div className="absolute inset-0 backdrop-blur-[3px] bg-[#14261C]/25" />
            {/* Subtle gradient vignette to ensure text contrast over sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#14261C]/35 via-transparent to-[#14261C]/65" />
          </div>

          <div className="relative z-10 my-auto max-w-3xl mx-auto px-4">
            {/* Serif Headline with upright & italic mix */}
            <h1 className="headline-mask-reveal font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.06em] text-white uppercase leading-[1.08] drop-shadow-md">
              Crafted <span className="font-normal italic lowercase font-serif tracking-normal text-[#FAF6EE]">in the</span> Himalayas
            </h1>

            <p className="mt-5 text-sm sm:text-base md:text-lg text-white/90 font-sans max-w-xl mx-auto font-normal leading-relaxed drop-shadow-xs">
              Hand-churned cultured cream butter infused with wild mountain honey, smoked chillies, and roasted garlic.
            </p>

            {/* Two Action Buttons with Text-roll Hover and Squarish Theme */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#flavours"
                className="group relative w-full sm:w-auto px-8 py-3.5 bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white text-xs font-semibold uppercase tracking-[0.2em] font-sans rounded-none border border-[#1F3A2B] transition-all shadow-md overflow-hidden"
              >
                <span className="text-roll">
                  <span className="text-roll-inner">
                    <span>Shop the Butters</span>
                    <span className="text-[#E8B931]">Shop the Butters</span>
                  </span>
                </span>
              </a>

              <a
                href="#visit"
                className="group relative w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/40 text-xs font-semibold uppercase tracking-[0.2em] font-sans rounded-none transition-all overflow-hidden"
              >
                <span className="text-roll">
                  <span className="text-roll-inner">
                    <span>Visit Lazimpat</span>
                    <span className="text-[#E8B931]">Visit Lazimpat</span>
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Bottom Scroll Chip with Squarish Theme */}
          <div className="relative z-10">
            <a
              href="#flavours"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white/90 hover:text-white text-[10px] tracking-[0.25em] uppercase font-sans font-medium rounded-none transition-all"
            >
              <span>Scroll to Explore</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </a>
          </div>
        </section>

        {/* 2. Products Section */}
        <section id="flavours" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#1F3A2B]">
              The Flavour Range
            </span>
            <h2 className="headline-mask-reveal font-serif text-3xl sm:text-5xl font-bold tracking-[0.05em] text-[#1F3A2B] uppercase mt-3">
              Butter <span className="italic font-normal lowercase font-serif">the</span> Forest <span className="italic font-normal lowercase font-serif">way</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
              Every jar is produced in limited quantities. We track batch codes and best-before dates on every unit so you receive peak freshness.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Contour divider */}
        <div className="w-full h-12 contour-pattern" />

        {/* 3. Our Story Section */}
        <section id="story" className="py-24 px-6 sm:px-10 bg-[#F4EFE6] border-y border-[#E6DFD5]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#1F3A2B]">
                Origins &amp; Method
              </span>
              <h2 className="headline-mask-reveal font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.05em] text-[#1F3A2B] uppercase leading-tight">
                Honest craft <span className="italic font-normal lowercase font-serif">from the</span> valley kitchen
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
                <p>
                  The Vanvasi Project was born from a simple devotion: that butter should be more than an afterthought. We source fresh cultured dairy cream, churned patiently in small batches in Lazimpat, Kathmandu.
                </p>
                <p>
                  Our honey is wild-foraged by local beekeepers in eastern Nepal, and our garlic is slow-caramelized over low heat until rich and mellow. No artificial preservatives, stabilizers, or bulk commercial vegetable fats ever touch our kitchen.
                </p>
                <p>
                  Because we make real, unadulterated butter, each jar is perishable and dated with its specific batch code. When you open a jar of Vanvasi, you taste pure Himalayan land and dedicated craftsmanship.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-6">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#1F3A2B] block">100%</span>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-[#5E6961]">Natural Ingredients</span>
                </div>
                <div className="h-8 w-[1px] bg-[#D8D0C4]" />
                <div>
                  <span className="font-serif text-2xl font-bold text-[#1F3A2B] block">Batch-Dated</span>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-[#5E6961]">Directly Tracked</span>
                </div>
                <div className="h-8 w-[1px] bg-[#D8D0C4]" />
                <div>
                  <span className="font-serif text-2xl font-bold text-[#1F3A2B] block">Lazimpat</span>
                  <span className="text-[10px] tracking-wider uppercase font-sans text-[#5E6961]">Kathmandu Workshop</span>
                </div>
              </div>
            </div>

            {/* Story Visual / Photo */}
            <div className="lg:col-span-6 relative">
              <div className="image-clip-reveal relative rounded-xs overflow-hidden border border-[#D8D0C4] shadow-sm aspect-4/5 bg-[#203428]">
                <img
                  src="/images/kitchen-story.svg"
                  alt="Cultured butter churn and bread in Lazimpat kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Pickup and Delivery Section */}
        <section id="visit" className="py-24 px-6 sm:px-10 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold text-[#1F3A2B]">
              Fulfilment
            </span>
            <h2 className="headline-mask-reveal font-serif text-3xl sm:text-5xl font-bold tracking-[0.05em] text-[#1F3A2B] uppercase mt-3">
              Pickup <span className="italic font-normal lowercase font-serif">or</span> Kathmandu Delivery
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
              Fresh jars are ready for pickup at our Lazimpat counter or delivered straight to your door across Kathmandu Valley.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pickup Card */}
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-xs space-y-6 flex flex-col justify-between hover:border-[#1F3A2B]/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#EBF0EC] flex items-center justify-center text-[#1F3A2B]">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold uppercase text-[#1F3A2B] tracking-wider">
                  Kitchen Pickup
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
                  Visit our workshop in Lazimpat to pick up your order directly from the churn. Zero delivery fees.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#F4EFE6] text-xs font-sans text-[#1C241E]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#1F3A2B] flex-shrink-0 mt-0.5" />
                    <span>Nursery Road, Lazimpat, Kathmandu</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#1F3A2B] flex-shrink-0" />
                    <span>Pickup Hours: 10:00 AM – 6:00 PM (Sun – Fri)</span>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Lazimpat+Kathmandu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center py-3 px-6 bg-[#F4EFE6] hover:bg-[#EBF0EC] text-[#1F3A2B] text-xs font-semibold uppercase tracking-widest font-sans rounded-xs transition-colors border border-[#E6DFD5]"
              >
                Open Google Maps Location
              </a>
            </div>

            {/* Delivery Card */}
            <div className="bg-white border border-[#E6DFD5] p-8 rounded-xs space-y-6 flex flex-col justify-between hover:border-[#1F3A2B]/40 transition-colors">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#FFF8E6] flex items-center justify-center text-[#E8B931]">
                  <Truck className="w-6 h-6 text-[#9A7312]" />
                </div>
                <h3 className="font-serif text-2xl font-bold uppercase text-[#1F3A2B] tracking-wider">
                  Kathmandu Delivery
                </h3>
                <p className="text-xs sm:text-sm text-[#5E6961] font-sans leading-relaxed">
                  Carefully packed in temperature-controlled bags to keep butter firm during transport. Available across Kathmandu Valley.
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#F4EFE6] text-xs font-sans text-[#1C241E]">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#1F3A2B] flex-shrink-0" />
                    <span>Cash on Delivery (NPR Only)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#1F3A2B] flex-shrink-0" />
                    <span>Dispatched same day or next morning</span>
                  </div>
                </div>
              </div>

              <a
                href="#flavours"
                className="inline-flex items-center justify-center py-3 px-6 bg-[#1F3A2B] hover:bg-[#2A4E3B] text-white text-xs font-semibold uppercase tracking-widest font-sans rounded-xs transition-colors shadow-xs"
              >
                Choose Flavours to Deliver
              </a>
            </div>
          </div>
        </section>

        {/* 5. Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}
