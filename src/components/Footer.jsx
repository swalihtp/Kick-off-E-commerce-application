import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-white px-6 py-10">
      <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-3">

        {/* About */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">About</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="#" className="hover:text-white">About Us</Link></li>
            <li><Link to="#" className="hover:text-white">Careers</Link></li>
            <li><Link to="#" className="hover:text-white">Kick-Off Stories</Link></li>
            <li><Link to="#" className="hover:text-white">Press</Link></li>
            <li><Link to="#" className="hover:text-white">Corporate Information</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Help</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="#" className="hover:text-white">Payment</Link></li>
            <li><Link to="#" className="hover:text-white">Shipping</Link></li>
            <li><Link to="#" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        {/* Address */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Registered Office Address</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Kick-Off Sports Pvt. Ltd.<br />
            Suite 502, Orion Business Tower,<br />
            45/7 MG Road, Bangalore – 560001,<br />
            Karnataka, India<br />
            <span className="block mt-2">Phone: +91 80 1234 5678</span>
            <span>Email: contact@kickoff.com</span>
          </p>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Kick-Off Sports. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
