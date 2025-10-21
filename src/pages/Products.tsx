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
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async () => {
    if (!name || !price || !sku) {
      alert("Name, price, and SKU are required");
      return;
    }

    try {
      await axiosClient.post("/products/", {
        name,
        price: parseFloat(price),
        sku,
        stock,
      });
      setName("");
      setPrice("");
      setSku("");
      setStock(0);
      onClose();
      fetchProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product. Check console for details.");
    }
  };

  return (
    <Box>
      <Heading size="lg" mb="4">
        Products
      </Heading>

      <Button colorScheme="blue" mb="4" onClick={onOpen}>
        Add Product
      </Button>

      <Table variant="simple" bg="white" borderRadius="md" shadow="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>SKU</Th>
            <Th>Stock</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((p) => (
            <Tr key={p.id}>
              <Td>{p.id}</Td>
              <Td>{p.name}</Td>
              <Td>R {p.price}</Td>
              <Td>{p.sku}</Td>
              <Td>{p.stock}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for adding a new product */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4" align="stretch">
              <FormControl isRequired>
                <FormLabel>Product Name</FormLabel>
                <Input
                  placeholder="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Price</FormLabel>
                <Input
                  placeholder="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>SKU</FormLabel>
                <Input
                  placeholder="Unique SKU (e.g. SKU-1234)"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Stock</FormLabel>
                <NumberInput
                  min={0}
                  value={stock}
                  onChange={(valueString) => setStock(parseInt(valueString) || 0)}
                >
                  <NumberInputField placeholder="Stock quantity" />
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={createProduct}>
              Save
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
