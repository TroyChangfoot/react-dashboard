import { Flex, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { logoutUser } from "../utils/logout";

export default function Topbar() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  return (
    <Flex
      bg="gray.50"
      p="4"
      borderBottom="1px solid"
      borderColor="gray.200"
      justify="space-between"
      align="center"
    >
      <Text fontSize="lg" fontWeight="semibold">
        Dashboard
      </Text>

      {loggedIn ? (
        <Button colorScheme="red" size="sm" onClick={logoutUser}>
          Logout
        </Button>
      ) : (
        <Button colorScheme="teal" size="sm" onClick={() => navigate("/login")}>
          Login
        </Button>
      )}
    </Flex>
  );
}
