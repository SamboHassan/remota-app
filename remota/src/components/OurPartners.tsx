import { motion } from "framer-motion";
import { Box, Heading, Image, Flex } from "@chakra-ui/react";

const partners = [
  { name: "Google", logo: "/logos/google.png" },
  { name: "Microsoft", logo: "/logos/microsoft.png" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Netflix", logo: "/logos/netflix.png" },
  { name: "Meta", logo: "/logos/meta.png" },
];

export default function OurPartners() {
  return (
    <Box py={12} bg="gray.100">
      <Heading as="h2" fontSize="lg" fontWeight="bold" textAlign="center" color="gray.800" mb={6}>
        Our Partners
      </Heading>
      <Box overflow="hidden" position="relative" w="full">
        <motion.div
          style={{ display: "flex", gap: "3rem" }}
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            repeat: Infinity,
            duration: 40,
            ease: "linear",
          }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="min-w-[180px] flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                h={{ base: "20", md: "24" }}
                w="auto"
                objectFit="contain"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.1)", boxShadow: "lg" }}
              />
            </motion.div>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
}





// import { motion } from "framer-motion";

// const partners = [
//   { name: "Google", logo: "/logos/google.png" },
//   { name: "Microsoft", logo: "/logos/microsoft.png" },
//   { name: "Amazon", logo: "/logos/amazon.png" },
//   { name: "Netflix", logo: "/logos/netflix.png" },
//   { name: "Meta", logo: "/logos/meta.png" },
// ];

// export default function OurPartners() {
//   return (
//     <div className="py-12 bg-gray-100">
//       <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
//         Our Partners
//       </h2>
//       <div className="overflow-hidden relative w-full">
//         <motion.div
//           className="flex space-x-12"
//           initial={{ x: "100%" }}
//           animate={{ x: "-100%" }}
//           transition={{
//             repeat: Infinity,
//             duration: 40, // Slower speed
//             ease: "linear",
//           }}
//         >
//           {[...partners, ...partners].map((partner, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.1 }}
//               className="min-w-[180px] h-[150px] flex items-center justify-center"
//             >
//               <img
//                 src={partner.logo}
//                 alt={partner.name}
//                 className="h-24 w-auto object-contain" // Bigger logos
//               />
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }



















// import { motion } from "framer-motion";

// const partners = [
//   { name: "Google", logo: "/logos/google.png" },
//   { name: "Microsoft", logo: "/logos/microsoft.png" },
//   { name: "Amazon", logo: "/logos/amazon.png" },
//   { name: "Netflix", logo: "/logos/netflix.png" },
//   { name: "Meta", logo: "/logos/meta.png" },
// ];

// export default function OurPartners() {
//   return (
//     <div className="py-12 bg-gray-100">
//       <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
//         Our Partners
//       </h2>
//       <div className="overflow-hidden relative w-full">
//         <motion.div
//           className="flex space-x-8"
//           initial={{ x: "100%" }}
//           animate={{ x: "-100%" }}
//           transition={{
//             repeat: Infinity,
//             duration: 20,
//             ease: "linear",
//           }}
//         >
//           {[...partners, ...partners].map((partner, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.1 }}
//               className="min-w-[150px] h-[100px] flex items-center justify-center"
//             >
//               <img
//                 src={partner.logo}
//                 alt={partner.name}
//                 className="h-16 w-auto object-contain"
//               />
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// }
