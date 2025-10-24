import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerData = {
  company: {
    name: "SAWTAR",
    slogan: "Transforming spaces with stunning interior designs.",
    description: "We create beautiful, functional spaces tailored to your lifestyle and preferences.",
  },
  quickLinks: [
    { label: "Interior Design", path: "/services/interior-design" },
    { label: "Architecture", path: "/services/architecture" },
    { label: "Home Staging", path: "/services/home-staging" },
    { label: "Space Planning", path: "/services/space-planning" },
    { label: "3D Rendering", path: "/services/3d-rendering" },
  ],
  resources: [
    { label: "Design Magazine", path: "/magazine" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Design Blog", path: "/blog" },
    { label: "Free Consultation", path: "/consultation" },
    { label: "Hire Freelancers", path: "/freelancers" },
  ],
  ecommerce: [
    { label: "Furniture Shop", path: "/shop/furniture" },
    { label: "Lighting", path: "/shop/lighting" },
    { label: "Decor", path: "/shop/decor" },
    { label: "Materials", path: "/shop/materials" },
    { label: "Sale Items", path: "/shop/sale" },
  ],
  support: [
    { label: "Raise Issue", path: "/support/raise-issue" },
    { label: "My Issues", path: "/support/my-issues" },
    { label: "Contact Us", path: "/support/contact" },
    { label: "FAQ", path: "/support/faq" },
    { label: "Live Chat", path: "/support/chat" },
  ],
  companyLinks: [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Our Team", path: "/team" },
    { label: "Testimonials", path: "/testimonials" },
    { label: "Press", path: "/press" },
  ],
  legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Cookie Policy", path: "/cookies" },
    { label: "Shipping Policy", path: "/shipping" },
    { label: "Return Policy", path: "/returns" },
  ],
  contact: {
    email: "hello@sawtar.com",
    phone: "+1 (555) 123-4567",
    address: "123 Design Street, Creative District, NY 10001",
  },
  social: [
    { name: "Facebook", icon: <Facebook size={18} />, url: "#" },
    { name: "Instagram", icon: <Instagram size={18} />, url: "#" },
    { name: "Twitter", icon: <Twitter size={18} />, url: "#" },
    { name: "Linkedin", icon: <Linkedin size={18} />, url: "#" },
  ],
};

const Footer = () => {
  const { 
    company, 
    quickLinks, 
    resources, 
    ecommerce, 
    support, 
    companyLinks, 
    legal, 
    contact, 
    social 
  } = footerData;

  return (
    <footer className="bg-gray-100 text-gray-700 pt-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-[#C45A34]">{company.name}</h2>
            <p className="text-gray-600 mt-3">{company.slogan}</p>
            <p className="text-gray-500 mt-2 text-sm">{company.description}</p>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {social.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    aria-label={item.name}
                    className="text-gray-500 hover:text-[#C45A34] transition-colors p-2 bg-gray-50 rounded-full hover:bg-gray-100"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider text-[#C45A34]">Services</h4>
            <ul className="space-y-3">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <a href={item.path} className="text-gray-600 hover:text-[#C45A34] transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider text-[#C45A34]">Resources</h4>
            <ul className="space-y-3">
              {resources.map((item, idx) => (
                <li key={idx}>
                  <a href={item.path} className="text-gray-600 hover:text-[#C45A34] transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* E-commerce */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider text-[#C45A34]">Shop</h4>
            <ul className="space-y-3">
              {ecommerce.map((item, idx) => (
                <li key={idx}>
                  <a href={item.path} className="text-gray-600 hover:text-[#C45A34] transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider text-[#C45A34]">Support</h4>
            <ul className="space-y-3">
              {support.map((item, idx) => (
                <li key={idx}>
                  <a href={item.path} className="text-gray-600 hover:text-[#C45A34] transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

   
        {/* Bottom Section */}
        <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {legal.map((item, idx) => (
              <a 
                key={idx} 
                href={item.path} 
                className="text-gray-500 hover:text-[#C45A34] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;