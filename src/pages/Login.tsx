import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Please check your credentials.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        rounded="xl"
        shadow="lg"
        w="full"
        maxW="md"
        as="form"
        onSubmit={handleSubmit}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="teal.600">
            Dashboard Login
          </Heading>

          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              focusBorderColor="teal.500"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              focusBorderColor="teal.500"
            />
          </FormControl>

          <Button
            colorScheme="teal"
            size="lg"
            type="submit"
            disabled={loading}
            w="full"
          >
            {loading ? <Spinner size="sm" /> : "Sign In"}
          </Button>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Forgot password? Contact admin.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
