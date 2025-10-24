import React from 'react'
import HeroSection from '../herosection'
import CategorySlider from '../designslider'
import WhyChooseUs from '../designslider/WhyChooseUs'
import TestimonialSlider from '../designslider/testimonial/TestimonialSlider'
import Stepper from '../designsteps'
import FaqPage from '../faq'
// import EstimateSection from '../estimate'
import TrustedPartnersSlider from '../designslider/partnersslider'
import HomeDesign from '../homedesign/HomeDesign'
import FourStepDesign from '../AI/FourStepDesign/FourStepDesign'
import BookingBanner from '../banner/BookingBanner '
import ServiceSection from '../services/ServiceSection'
import SecureOptionsSection from '../services/SecureOptionsSection'
import InteriorEcommerceSection from '../ecommerce/InteriorEcommerceSection'
import EcommerceBanner from '../banner/EcommerceBanner'
import AIPoweredEcosystemSection from '../AIPoweredEcosystemSection'
import StepCarousel from '../StepCarousel'
import TrendSlider from '../designslider/TrendingSlider'

import ConsultationSection from '../banner/BookingBanner '
import SawtarUnique from '../AI/SawtarUnique'
import MagazinePage from '../magazines/MagazinePage'
import MagazineSlider from '../magazines/MagazinePage'
import SocialSection from '../social/Index'
import Homevideo from '../homedesign/Homevideo'

const Home = () => {
  return (
<>
<HeroSection/>
<WhyChooseUs/>
<HomeDesign/>
{/* <FourStepDesign/> */}
<AIPoweredEcosystemSection/>
<Homevideo/>
<ConsultationSection/>
<SawtarUnique/>
<StepCarousel/> 

{/* <CompactWhyWeBest/> */}
  <ServiceSection/>

{/* <CategorySlider/> */}
{/* <InteriorEcommerceSection/> */}

{/* <EstimateSection/> */}
{/* <Stepper/> */}
{/* <TrustedPartnersSlider/> */}
{/* <FaqPage/> */}
<EcommerceBanner/>

<TrendSlider/>
<MagazineSlider/>
<SocialSection/>
<TestimonialSlider/>

</>  )
}

export default Home