import { Box, VStack, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const baseStyle = {
    display: "block",
    width: "100%",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
  };

  const getActiveStyle = ({ isActive }: { isActive: boolean }) => ({
    ...baseStyle,
    background: isActive ? "#0d9488" : "transparent",
    color: isActive ? "white" : "#e5e7eb",
  });

  return (
    <Box
      bg="gray.800"
      color="white"
      w="64"
      h="100vh"
      position="fixed"
      top="0"
      left="0"
      px="6"
      py="8"
    >
      <Text fontSize="xl" fontWeight="bold" mb="8" color="brand.100">
        🧭 Dashboard
      </Text>

      <VStack align="start" gap="2" w="full">
        <NavLink to="/" style={getActiveStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/products" style={getActiveStyle}>
          Products
        </NavLink>
        <NavLink to="/customers" style={getActiveStyle}>
          Customers
        </NavLink>
        <NavLink to="/orders" style={getActiveStyle}>
          Orders
        </NavLink>
      </VStack>
    </Box>
  );
}
