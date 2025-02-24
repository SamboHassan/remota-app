export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 py-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Left Section - Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">JobFinder</h2>
            <p className="text-gray-600 mt-2 max-w-sm">
              Your gateway to the best job opportunities. Connecting talent with top companies.
            </p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-gray-900 transition">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-gray-900 transition">Post a Job</a></li>
              <li><a href="#" className="hover:text-gray-900 transition">About Us</a></li>
              <li><a href="#" className="hover:text-gray-900 transition">Contact</a></li>
            </ul>
          </div>

          {/* Right Section - Social Media */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-semibold text-gray-900">Follow Us</h3>
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-blue-500 transition">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11 9.95V14h-3v-2h3V9.5c0-2.9 1.7-4.5 4.3-4.5 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12h3l-.5 2h-2.5v7.95A10 10 0 0022 12z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.4-3.5-1.4-.4-1-1-1.2-1-1.2-.8-.5.1-.5.1-.5 1 0 1.5 1 1.5 1 .9 1.5 2.5 1.1 3 .9 0-.7.3-1.1.6-1.3-2.3-.3-4.7-1.2-4.7-5a4 4 0 011-2.8 3.6 3.6 0 01.1-2.7s.9-.3 2.8 1a9.5 9.5 0 015 0c2-1.3 2.8-1 2.8-1 .6 1.8.2 3.1.1 3.4a4 4 0 011 2.7c0 3.8-2.4 4.7-4.7 5a1.9 1.9 0 01.6 1.4v2.1c0 .3.2.6.7.5A10 10 0 0012 2z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-blue-500 transition">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M21 7.5a9 9 0 01-2.6.7A4.5 4.5 0 0020.5 5a9 9 0 01-2.9 1.1A4.5 4.5 0 0012 9.5a12.8 12.8 0 01-9.3-4.7 4.5 4.5 0 001.4 6A4.5 4.5 0 012 10v.1a4.5 4.5 0 003.6 4.4 4.5 4.5 0 01-2 .1 4.5 4.5 0 004.2 3A9 9 0 013 18.5 12.8 12.8 0 0011 21c7.5 0 11.6-6.2 11.6-11.6 0-.2 0-.4-.1-.6A8.3 8.3 0 0021 7.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} JobFinder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}





// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 text-white py-8">
//       <div className="container mx-auto px-6 md:px-12">
//         <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
//           {/* Left Section - Logo & About */}
//           <div>
//             <h2 className="text-2xl font-bold">JobFinder</h2>
//             <p className="text-gray-400 mt-2 max-w-sm">
//               Your gateway to the best job opportunities. Connecting talent with top companies.
//             </p>
//           </div>

//           {/* Middle Section - Quick Links */}
//           <div className="mt-6 md:mt-0">
//             <h3 className="text-lg font-semibold">Quick Links</h3>
//             <ul className="mt-2 space-y-2 text-gray-400">
//               <li><a href="#" className="hover:text-white transition">Browse Jobs</a></li>
//               <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
//               <li><a href="#" className="hover:text-white transition">About Us</a></li>
//               <li><a href="#" className="hover:text-white transition">Contact</a></li>
//             </ul>
//           </div>

//           {/* Right Section - Social Media */}
//           <div className="mt-6 md:mt-0">
//             <h3 className="text-lg font-semibold">Follow Us</h3>
//             <div className="flex gap-4 mt-2">
//               <a href="#" className="hover:text-blue-400 transition">
//                 <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
//                   <path d="M22 12a10 10 0 10-11 9.95V14h-3v-2h3V9.5c0-2.9 1.7-4.5 4.3-4.5 1.2 0 2.4.2 2.4.2v2.6h-1.3c-1.3 0-1.7.8-1.7 1.6V12h3l-.5 2h-2.5v7.95A10 10 0 0022 12z"/>
//                 </svg>
//               </a>
//               <a href="#" className="hover:text-blue-400 transition">
//                 <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
//                   <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-2c-2.9.6-3.5-1.4-3.5-1.4-.4-1-1-1.2-1-1.2-.8-.5.1-.5.1-.5 1 0 1.5 1 1.5 1 .9 1.5 2.5 1.1 3 .9 0-.7.3-1.1.6-1.3-2.3-.3-4.7-1.2-4.7-5a4 4 0 011-2.8 3.6 3.6 0 01.1-2.7s.9-.3 2.8 1a9.5 9.5 0 015 0c2-1.3 2.8-1 2.8-1 .6 1.8.2 3.1.1 3.4a4 4 0 011 2.7c0 3.8-2.4 4.7-4.7 5a1.9 1.9 0 01.6 1.4v2.1c0 .3.2.6.7.5A10 10 0 0012 2z"/>
//                 </svg>
//               </a>
//               <a href="#" className="hover:text-blue-400 transition">
//                 <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
//                   <path d="M21 7.5a9 9 0 01-2.6.7A4.5 4.5 0 0020.5 5a9 9 0 01-2.9 1.1A4.5 4.5 0 0012 9.5a12.8 12.8 0 01-9.3-4.7 4.5 4.5 0 001.4 6A4.5 4.5 0 012 10v.1a4.5 4.5 0 003.6 4.4 4.5 4.5 0 01-2 .1 4.5 4.5 0 004.2 3A9 9 0 013 18.5 12.8 12.8 0 0011 21c7.5 0 11.6-6.2 11.6-11.6 0-.2 0-.4-.1-.6A8.3 8.3 0 0021 7.5z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Section - Copyright */}
//         <div className="text-center text-gray-500 text-sm mt-8">
//           © {new Date().getFullYear()} JobFinder. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }
