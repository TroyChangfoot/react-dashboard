import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaUsers,
  FaHourglassHalf,
  FaMoneyBillWave,
} from "react-icons/fa";
import axiosClient from "../api/axiosClient";

export default function DashboardHome() {
  const [stats, setStats] = useState<any>({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    shippedOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        axiosClient.get("/orders/"),
        axiosClient.get("/products/"),
        axiosClient.get("/customers/"),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const customers = customersRes.data || [];

      const pendingOrders = orders.filter((o: any) => o.status === "pending").length;
      const paidOrders = orders.filter((o: any) => o.status === "paid").length;
      const shippedOrders = orders.filter((o: any) => o.status === "shipped").length;
      const lowStock = products.filter((p: any) => p.stock <= 5).length;
      const totalRevenue = orders.reduce(
        (acc: number, o: any) => acc + parseFloat(o.total_amount || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        paidOrders,
        shippedOrders,
        totalProducts: products.length,
        lowStock,
        totalCustomers: customers.length,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt="10">
        <Spinner size="xl" color="teal.500" />
        <Text mt="3">Loading dashboard data...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="lg" mb="6">
        Dashboard Overview
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing="6">
        {/* Orders Summary */}
        <Card bg="gray.50" borderRadius="lg" shadow="sm">
          <CardHeader>
            <HStack spacing="3">
              <Icon as={FaShoppingCart} color="teal.500" boxSize="6" />
              <Heading size="md">Orders</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{stats.totalOrders}</StatNumber>
              <StatHelpText>Total across all statuses</StatHelpText>
            </Stat>

            <HStack justify="space-between" mt="3">
              <HStack>
                <Icon as={FaHourglassHalf} color="orange.400" />
                <Text fontSize="sm">Pending: {stats.pendingOrders}</Text>
              </HStack>
              <HStack>
                <Icon as={FaCheckCircle} color="green.500" />
                <Text fontSize="sm">Paid: {stats.paidOrders}</Text>
              </HStack>
              <HStack>
                <Icon as={FaTruck} color="blue.400" />
                <Text fontSize="sm">Shipped: {stats.shippedOrders}</Text>
              </HStack>
            </HStack>
            <HStack mt="5" spacing="3" align="center">
              <Icon as={FaMoneyBillWave} color="green.500" boxSize="5" />
              <Text fontWeight="semibold">
                Total Revenue: R {stats.totalRevenue.toFixed(2)}
              </Text>
            </HStack>
          </CardBody>
        </Card>

        {/* Products Summary */}
        <Card bg="gray.50" borderRadius="lg" shadow="sm">
          <CardHeader>
            <HStack spacing="3">
              <Icon as={FaBox} color="purple.500" boxSize="6" />
              <Heading size="md">Products</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Total Products</StatLabel>
              <StatNumber>{stats.totalProducts}</StatNumber>
              <StatHelpText>Currently listed in the store</StatHelpText>
            </Stat>
            <Text mt="3" color={stats.lowStock > 0 ? "red.500" : "gray.600"}>
              {stats.lowStock > 0
                ? `${stats.lowStock} products low in stock`
                : "All products sufficiently stocked"}
            </Text>
          </CardBody>
        </Card>

        {/* Customers Summary */}
        <Card bg="gray.50" borderRadius="lg" shadow="sm">
          <CardHeader>
            <HStack spacing="3">
              <Icon as={FaUsers} color="pink.500" boxSize="6" />
              <Heading size="md">Customers</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Total Customers</StatLabel>
              <StatNumber>{stats.totalCustomers}</StatNumber>
              <StatHelpText>Registered shoppers</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
