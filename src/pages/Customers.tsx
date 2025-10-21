import {
  Box,
  Heading,
  Button,
  Input,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- Fetch customers ---
  const fetchCustomers = async () => {
    try {
      const res = await axiosClient.get("/customers/");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Create or update ---
  const saveCustomer = async () => {
    if (!firstName || !lastName || !email) {
      alert("First name, last name, and email are required");
      return;
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    };

    try {
      if (selectedCustomer) {
        await axiosClient.put(`/customers/${selectedCustomer.id}/`, payload);
      } else {
        await axiosClient.post("/customers/", payload);
      }

      resetForm();
      onClose();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer. Check console for details.");
    }
  };

  // --- Reset form fields ---
  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSelectedCustomer(null);
  };

  // --- Edit handler ---
  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setFirstName(customer.first_name || "");
    setLastName(customer.last_name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    onOpen();
  };

  // --- Delete handler ---
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    await axiosClient.delete(`/customers/${id}/`);
    fetchCustomers();
  };

  // --- Render ---
  return (
    <Box>
      <Heading size="lg" mb="4">
        Customers
      </Heading>

      <Button colorScheme="blue" mb="4" onClick={onOpen}>
        Add Customer
      </Button>

      <Table variant="simple" bg="white" borderRadius="md" shadow="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {customers.map((c) => (
            <Tr key={c.id}>
              <Td>{c.id}</Td>
              <Td>{c.first_name}</Td>
              <Td>{c.last_name}</Td>
              <Td>{c.email}</Td>
              <Td>{c.phone || "—"}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="teal"
                  mr="2"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleDelete(c.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* --- Modal --- */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCustomer ? "Edit Customer" : "Add Customer"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4" align="stretch">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveCustomer}>
              {selectedCustomer ? "Update" : "Save"}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
