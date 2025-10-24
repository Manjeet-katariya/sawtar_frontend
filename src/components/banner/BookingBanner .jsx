import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

const platformOptions = {
  "User Consultation": [
    { icon: "https://img.icons8.com/color/48/whatsapp.png", label: "WhatsApp" },
    { icon: "https://img.icons8.com/color/48/google-meet.png", label: "Google Meet" },
  ],
  "Customer Support": [
    { icon: "https://img.icons8.com/color/48/zoom.png", label: "Zoom Video" },
    { icon: "https://img.icons8.com/color/48/whatsapp.png", label: "WhatsApp" },
  ],
  "B2B Business": [
    { icon: "https://img.icons8.com/color/48/zoom.png", label: "Zoom Video" },
    { icon: "https://img.icons8.com/fluency/48/planner.png", label: "Schedule" },
  ],
  "B2C Product Help": [
    { icon: "https://img.icons8.com/color/48/google-meet.png", label: "Google Meet" },
    { icon: "https://img.icons8.com/color/48/whatsapp.png", label: "WhatsApp" },
  ],
  "Interior Design": [
    { icon: "https://img.icons8.com/fluency/48/design.png", label: "Design Chat" },
    { icon: "https://img.icons8.com/color/48/google-meet.png", label: "Google Meet" },
  ],
};

const ConsultationSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceType, setServiceType] = useState("User Consultation");

  return (
    <section className="px-4 py-25 bg-gradient-to-b from-white to-orange-50 text-gray-800">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <h2 className="text-center text-4xl uppercase mb-4 tracking-wide pb-10 text-gray-800">Consultation Services</h2>
        <p className="text-base text-gray-600 max-w-xl mx-auto">
          Explore our expert consultation services for users, customers, businesses (B2B/B2C).
          Get professional guidance tailored to your needs, including live interior design support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Book a Consultation Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-xl p-4 transition-all border border-orange-200 flex flex-col h-full"
        >
          <div className="flex flex-col items-center text-center mb-4">
            <img
              src="https://img.icons8.com/fluency/96/consultation.png"
              alt="Consultation"
              className="w-16 h-16 object-contain mb-3"
            />
            <h3 className="text-xl font-semibold mb-2 text-[#BA5933]">Book a Consultation</h3>
            <p className="text-sm text-gray-600 mb-4">Schedule a one-on-one session for users, customers, B2B or B2C support.</p>
          </div>
          <button
            onClick={() => {
              setServiceType("User Consultation");
              setIsOpen(true);
            }}
            className="mt-auto bg-[#D26C44] hover:bg-[#ba5933] text-white px-4 py-2 rounded-full font-medium text-sm shadow mx-auto"
          >
            Book Now
          </button>
        </motion.div>

        {/* Live Interior Design Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-xl p-4 transition-all border border-orange-200 flex flex-col h-full"
        >
          <div className="flex flex-col items-center text-center mb-4">
            <img
              src="https://img.icons8.com/fluency/96/interior.png"
              alt="Interior Design"
              className="w-16 h-16 object-contain mb-3"
            />
            <h3 className="text-xl font-semibold mb-2 text-[#BA5933]">Live Interior Design</h3>
            <p className="text-sm text-gray-600 mb-4">Connect with an expert interior designer in real-time and transform your space.</p>
          </div>
          <button
            onClick={() => {
              setServiceType("Interior Design");
              setIsOpen(true);
            }}
            className="mt-auto bg-[#D26C44] hover:bg-[#ba5933] text-white px-4 py-2 rounded-full font-medium text-sm shadow mx-auto"
          >
            Start Live Consultation
          </button>
        </motion.div>

        {/* B2B & B2C Product Help Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white shadow-lg rounded-xl p-4 transition-all border border-orange-200 flex flex-col h-full"
        >
          <div className="flex flex-col items-center text-center mb-4">
            <img
              src="https://img.icons8.com/color/96/technical-support.png"
              alt="Product Help"
              className="w-16 h-16 object-contain mb-3"
            />
            <h3 className="text-xl font-semibold mb-2 text-[#BA5933]">B2B & B2C Product Help</h3>
            <p className="text-sm text-gray-600 mb-4">Get real-time product support and service for your business or consumer needs.</p>
          </div>
          <button
            onClick={() => {
              setServiceType("B2C Product Help");
              setIsOpen(true);
            }}
            className="mt-auto bg-[#D26C44] hover:bg-[#ba5933] text-white px-4 py-2 rounded-full font-medium text-sm shadow mx-auto"
          >
            Get Help Now
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <Dialog.Title className="text-xl font-bold mb-4 text-[#BA5933]">
              Book Your Consultation
            </Dialog.Title>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Booking submitted!");
                setIsOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-orange-400 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-orange-400 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-orange-400 focus:outline-none"
                >
                  {Object.keys(platformOptions).map((service) => (
                    <option key={service}>{service}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Platforms</label>
                <div className="flex gap-3 flex-wrap">
                  {platformOptions[serviceType].map(({ icon, label }, i) => (
                    <button
                      key={i}
                      type="button"
                      className="flex flex-col items-center justify-center border rounded-lg p-2 w-20 h-20 shadow-sm hover:shadow-md transition-all"
                      title={label}
                    >
                      <img src={icon} alt={label} className="w-8 h-8 mb-1" />
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D26C44] hover:bg-[#ba5933] text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Submit Booking
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default ConsultationSection;