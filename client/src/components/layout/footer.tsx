import { Link } from "wouter";
import { Car, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Car className="text-white h-6 w-6 mr-2" />
              <span className="text-xl font-bold text-white">TripSync</span>
            </div>
            <p className="text-gray-300 text-base">
              Making student transportation affordable, safe, and sustainable, one ride at a time.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about">
                      <a className="text-base text-gray-300 hover:text-white">
                        About Us
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/team">
                      <a className="text-base text-gray-300 hover:text-white">
                        Our Team
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      <a className="text-base text-gray-300 hover:text-white">
                        Careers
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <a className="text-base text-gray-300 hover:text-white">
                        Contact
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/help">
                      <a className="text-base text-gray-300 hover:text-white">
                        Help Center
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/safety">
                      <a className="text-base text-gray-300 hover:text-white">
                        Safety Information
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cancellation">
                      <a className="text-base text-gray-300 hover:text-white">
                        Cancellation Options
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/report">
                      <a className="text-base text-gray-300 hover:text-white">
                        Report an Issue
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy">
                      <a className="text-base text-gray-300 hover:text-white">
                        Privacy Policy
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <a className="text-base text-gray-300 hover:text-white">
                        Terms of Service
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies">
                      <a className="text-base text-gray-300 hover:text-white">
                        Cookie Policy
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Join Us
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/become-driver">
                      <a className="text-base text-gray-300 hover:text-white">
                        Become a Driver
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/universities">
                      <a className="text-base text-gray-300 hover:text-white">
                        University Partners
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/ambassador">
                      <a className="text-base text-gray-300 hover:text-white">
                        Ambassador Program
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} TripSync, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
