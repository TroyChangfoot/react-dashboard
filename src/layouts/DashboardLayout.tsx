import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        as="aside"
        w={{ base: "64", md: "64" }} // fixed width for sidebar
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        position="fixed"
        left="0"
        top="0"
        bottom="0"
        overflowY="auto"
        zIndex="100"
      >
        <Sidebar />
      </Box>

      {/* Main content */}
      <Box
        flex="1"
        ml={{ base: "64", md: "64" }} // push content to the right of sidebar
        p="6"
      >
        <Topbar />
        <Box mt="6">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
