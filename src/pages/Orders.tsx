import {
  Box,
  Heading,
  Button,
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
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  Select,
  HStack,
  Text,
  Divider,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState<
    { product: string; quantity: number; price?: number }[]
  >([{ product: "", quantity: 1 }]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // --- Fetch data ---
  const fetchOrders = async () => {
    const res = await axiosClient.get("/orders/");
    setOrders(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axiosClient.get("/customers/");
    setCustomers(res.data);
  };

  const fetchProducts = async () => {
    const res = await axiosClient.get("/products/");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  // --- Handle item changes dynamically ---
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // --- Create or update order ---
  const saveOrder = async () => {
    if (!customerId || items.some((i) => !i.product)) {
      alert("Please select a customer and all products.");
      return;
    }

    const payload = {
      customer: customerId,
      status,
      items: items.map((i) => ({
        product: i.product,
        quantity: Number(i.quantity),
      })),
    };

    try {
      if (selectedOrder) {
        await axiosClient.put(`/orders/${selectedOrder.id}/`, payload);
      } else {
        await axiosClient.post("/orders/", payload);
      }
      closeModal();
      fetchOrders();
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Failed to save order. Check console for details.");
    }
  };

  // --- Edit existing order ---
  const handleEdit = (order: any) => {
    setSelectedOrder(order);
    setCustomerId(order.customer || "");
    setStatus(order.status || "pending");
    setItems(
      order.items?.map((i: any) => ({
        product: i.product,
        quantity: i.quantity,
      })) || [{ product: "", quantity: 1 }]
    );
    onOpen();
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setCustomerId("");
    setStatus("pending");
    setItems([{ product: "", quantity: 1 }]);
    onClose();
  };

  // --- Render ---
  return (
    <Box>
      <Heading size="lg" mb="4">
        Orders
      </Heading>

      <Button colorScheme="blue" mb="4" onClick={onOpen}>
        New Order
      </Button>

      <Table variant="simple" bg="white" borderRadius="md" shadow="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>ID</Th>
            <Th>Customer</Th>
            <Th>Status</Th>
            <Th>Total</Th>
            <Th>Items</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>{order.customer_name}</Td>
              <Td textTransform="capitalize">{order.status}</Td>
              <Td>R {parseFloat(order.total_amount).toFixed(2)}</Td>
              <Td>
                {order.items.map((i: any) => (
                  <Text key={i.id}>
                    {i.product_name} × {i.quantity} — R {i.get_line_total}
                  </Text>
                ))}
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="teal"
                  onClick={() => handleEdit(order)}
                >
                  View / Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* --- Modal for Order --- */}
      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedOrder ? `Edit Order #${selectedOrder.id}` : "New Order"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4" align="stretch">
              {/* Customer selection */}
              <Select
                placeholder="Select Customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.first_name} {c.last_name}
                  </option>
                ))}
              </Select>

              {/* Status */}
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
              </Select>

              <Divider />

              {/* Order items list */}
              <Heading size="sm">Order Items</Heading>
              {items.map((item, index) => (
                <HStack key={index} spacing="3">
                  <Select
                    placeholder="Product"
                    value={item.product}
                    onChange={(e) =>
                      handleItemChange(index, "product", e.target.value)
                    }
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>

                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                  />

                  <IconButton
                    aria-label="Remove item"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem(index)}
                  />
                </HStack>
              ))}

              <Button
                leftIcon={<AddIcon />}
                onClick={addItem}
                colorScheme="gray"
                variant="outline"
                size="sm"
              >
                Add Another Item
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={saveOrder}>
              {selectedOrder ? "Update Order" : "Create Order"}
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
