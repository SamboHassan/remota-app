"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">Remota</Link>

      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <Link href="/auth/signup" className="hover:text-gray-300">Signup</Link>
          </li>
          <li>
            <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          </li>
          <li>
            <Link href="/checkout" className="hover:text-gray-300">Check Out</Link>
          </li>
        </ul>
      </div>

      <div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span>{user.email}</span>
            <button 
              onClick={handleLogout} 
              className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link href="/auth/login">
            <button 
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
            >Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;





// "use client";

// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// const Navbar = () => {
//   const { user, logoutUser } = useAuth();
//   const router = useRouter();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   console.log("the user is", user);
//   const handleLogout = () => {
//     logoutUser();
//     router.push("/auth/login");
//   };

//   return (
//     <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
//       <Link href="/" className="text-lg font-bold">MyApp</Link>

//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <ul className="flex space-x-4">
//           <li>
//             <Link href="/auth/signup" 
//             className="text-white-700 hover:text-black">Signup</Link>
//           </li>
//           <li>
//             <Link href="/cart" 
//             className="text-white-700 hover:text-black">Cart</Link>
//           </li>
//           <li>
//             <Link href="/checkout" 
//             className="text-white-700 hover:text-black">Check Out</Link>
//           </li>
//         </ul>
//       </div>

//       <div className="relative">
//         {user ? (
//           <div className="relative">
//             <button 
//               onClick={() => setDropdownOpen(!dropdownOpen)} 
//               className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
//             >
//               {user.username} ▼
//             </button>
//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
//                 <Link href="/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
//                 <button 
//                   onClick={handleLogout} 
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <Link href="/auth/login">
//             <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
//               Login
//             </button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





// "use client";

// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const { user, logoutUser } = useAuth();
//   const router = useRouter();

//   const handleLogout = () => {
//     logoutUser();
//     router.push("/auth/login");
//   };

//   return (
//     <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
//       <Link href="/" className="text-lg font-bold">MyApp</Link>
//       <div>
//         {user ? (
//           <button 
//             onClick={handleLogout} 
//             className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link href="/auth/login">
//             <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
//               Login
//             </button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// "use client";

// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";

// const Navbar = () => {
//   const { user, logoutUser } = useAuth();
//   const router = useRouter();

//   const handleLogout = () => {
//     logoutUser();
//     router.push("/auth/login");
//   };

//   return (
//     <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
//       <Link href="/" className="text-lg font-bold">MyApp</Link>
//       <div>
//         {user ? (
//           <button 
//             onClick={handleLogout} 
//             className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
//           >
//             Logout
//           </button>
//         ) : (
//           <Link href="/auth/login">
//             <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
//               Login
//             </button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





// import { useAuth } from "@/context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav>
//       <a href="/">Home</a>
//       {user ? (
//         <>
//           <a href="/profile">Profile</a>
//           {user.role === "admin" && <a href="/admin">Admin</a>}
//           <button onClick={logout}>Logout</button>
//         </>
//       ) : (
//         <a href="/login">Login</a>
//       )}
//     </nav>
//   );
// };

// export default Navbar;





// improve navBar with Chakra UI

// import { useAuth } from "@/context/AuthContext";
// import { Box, Flex, Link, Button } from "@chakra-ui/react";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <Box bg="gray.800" px={6} py={4} color="white">
//       <Flex justify="space-between" align="center">
//         <Flex gap={4}>
//           <Link href="/" _hover={{ textDecoration: "none" }}>Home</Link>
//           {user && <Link href="/profile" _hover={{ textDecoration: "none" }}>Profile</Link>}
//           {user?.role === "admin" && (
//             <Link href="/admin" fontWeight="bold" color="yellow.300">
//               Admin Dashboard
//             </Link>
//           )}
//         </Flex>
//         {user ? (
//           <Button onClick={logout} colorScheme="red">Logout</Button>
//         ) : (
//           <Link href="/login">Login</Link>
//         )}
//       </Flex>
//     </Box>
//   );
// };

// export default Navbar;
