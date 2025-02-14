"use client";

import { Box, Flex, Button, Text, Link as ChakraLink } from "@chakra-ui/react";
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
    <Box bg="gray.800" px={4} py={3} color="white">
      <Flex justify="space-between" align="center" maxW="container.lg" mx="auto">
        <ChakraLink as={Link} href="/" fontSize="lg" fontWeight="bold">
          JobFinder
        </ChakraLink>
        <Flex align="center" gap={4}>
          {user ? (
            <Flex align="center" gap={4}>
              <Text>{user.email}</Text>
              <Button onClick={handleLogout} colorScheme="gray" variant="solid">
                Logout
              </Button>
            </Flex>
          ) : (
            // <Button as={Link} href="/auth/login" colorScheme="blue" variant="solid">
            //   Login
            // </Button>
            <Button asChild  colorScheme="blue" variant="solid">
              <a href="/auth/login">Login</a>
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;