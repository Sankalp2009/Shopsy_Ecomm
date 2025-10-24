import React from "react";
import { useSelector } from "react-redux";
import { Action_Type } from "../../Redux/Cart_Reducer/action.jsx";
import { useNavigate, Link } from "react-router";
import {
  Box,
  Heading,
  Text,
  Container,
  Center,
  Flex,
  Button,
  Grid,
  GridItem,
  Stack,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { ShoppingBag, ArrowLeft, Package } from "lucide-react";
import CartItem from "../../Component/CartItem.jsx";

function Cart() {
  const navigate = useNavigate();
 
  const { items } = useSelector((state) => state.cart);
  
  
  const CartCount = items.length;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const subtotal = items.reduce(
    (acc, item) => acc + Math.floor(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  // Empty Cart State
  if (items.length === 0) {
    return (
      <Flex minH="80vh" justify="center" align="center" textAlign="center" px={4}>
        <Flex
          direction="column"
          justify="center"
          align="center"
          p={{ base: 6, md: 8 }}
          gap={5}
          maxW="500px"
          w="100%"
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
        >
          <Box
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            p={6}
            borderRadius="full"
            boxShadow="0 8px 20px rgba(102, 126, 234, 0.3)"
          >
            <ShoppingBag size={48} color="white" strokeWidth={1.5} />
          </Box>
          
          <Heading 
            size={{ base: "xl", md: "2xl" }} 
            bgGradient="to-r"
            gradientFrom="purple.600"
            gradientTo="blue.500"
            bgClip="text"
          >
            Your cart is empty
          </Heading>
          
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            Looks like you haven't added anything to your cart yet.
          </Text>
          
          <Button
            onClick={() => navigate("/")}
            bgGradient="to-r"
            gradientFrom="purple.500"
            gradientTo="blue.500"
            color="white"
            size={{ base: "md", md: "lg" }}
            w={{ base: "full", sm: "auto" }}
            px={8}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
            leftIcon={<ArrowLeft size={18} />}
          >
            Start Shopping
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" py={{ base: 4, md: 8 }} bg="gray.50">
      <Box 
        maxW="7xl" 
        mx="auto" 
        px={{ base: 4, sm: 6, lg: 8 }}
      >
        {/* Header Section */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={{ base: 6, md: 8 }}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              bgGradient="to-r"
              gradientFrom="purple.600"
              gradientTo="blue.500"
              bgClip="text"
            >
              Shopping Cart
            </Heading>
            <Text 
              color="gray.600" 
              mt={2} 
              fontSize={{ base: "sm", md: "md" }}
            >
              {CartCount} {CartCount === 1 ? 'item' : 'items'} in your cart
            </Text>
          </Box>
          
          <Button
            display={{ base: "flex", md: "none" }}
            variant="outline"
            colorPalette="purple"
            size="sm"
            onClick={() => navigate("/product")}
            leftIcon={<ArrowLeft size={16} />}
          >
            Continue Shopping
          </Button>
        </Flex>

        {/* Main Grid Layout */}
        <Grid
          templateColumns={{ 
            base: "1fr", 
            lg: "1fr 400px" 
          }}
          gap={{ base: 6, md: 8 }}
        >
          {/* Cart Items Section */}
          <GridItem>
            <Stack gap={4}>
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </Stack>
            
            {/* Desktop Continue Shopping Link */}
            <Flex 
              mt={6}
              display={{ base: "none", md: "flex" }}
            >
              <Link to="/product" style={{ textDecoration: "none" }}>
                <Button
                  variant="ghost"
                  colorPalette="purple"
                  leftIcon={<ArrowLeft size={18} />}
                >
                  Continue Shopping
                </Button>
              </Link>
            </Flex>
          </GridItem>

          {/* Order Summary Section */}
          <GridItem>
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={{ base: 5, md: 6 }}
              position={{ base: "relative", lg: "sticky" }}
              top={{ lg: "100px" }}
              border="1px solid"
              borderColor="gray.200"
            >
              <Heading 
                size={{ base: "lg", md: "xl" }}
                fontWeight="bold" 
                color="gray.900" 
                mb={6}
              >
                Order Summary
              </Heading>

              {/* Summary Details */}
              <Stack gap={4} mb={6}>
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: "sm", md: "md" }}>Subtotal</Text>
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                    ${subtotal.toFixed(2)}
                  </Text>
                </Flex>
                
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: "sm", md: "md" }}>Tax (10%)</Text>
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                    ${tax.toFixed(2)}
                  </Text>
                </Flex>
                
                <Flex justify="space-between" color="gray.700">
                  <Text fontSize={{ base: "sm", md: "md" }}>Shipping</Text>
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>
                    {shipping === 0 ? (
                      <Badge colorPalette="green" variant="solid" px={2}>
                        FREE
                      </Badge>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </Text>
                </Flex>

                <Separator my={2} />

                <Flex 
                  justify="space-between"
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  color="gray.900"
                >
                  <Text>Total</Text>
                  <Text 
                    bgGradient="to-r"
                    gradientFrom="green.500"
                    gradientTo="green.600"
                    bgClip="text"
                  >
                    ${total.toFixed(2)}
                  </Text>
                </Flex>
              </Stack>

              {/* Free Shipping Alert */}
              {subtotal < 50 && (
                <Box 
                  bg="blue.50" 
                  border="1px solid" 
                  borderColor="blue.200" 
                  borderRadius="lg" 
                  p={{ base: 3, md: 4 }}
                  mb={4}
                >
                  <Flex align="center" gap={2}>
                    <Package size={18} color="#2563eb" />
                    <Text fontSize="sm" color="blue.700" fontWeight="medium">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </Text>
                  </Flex>
                </Box>
              )}

              {/* Checkout Button */}
              <Button 
                w="full" 
                bgGradient="to-r"
                gradientFrom="purple.500"
                gradientTo="blue.500"
                color="white"
                size={{ base: "md", md: "lg" }}
                onClick={handleCheckout}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "xl",
                }}
                transition="all 0.2s"
                fontWeight="600"
              >
                Proceed to Checkout
              </Button>

              {/* Mobile Continue Shopping */}
              <Box mt={4} display={{ base: "block", md: "none" }}>
                <Link to="/product" style={{ textDecoration: "none" }}>
                  <Button
                    w="full"
                    variant="outline"
                    colorPalette="purple"
                    size="md"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </Box>

              {/* Security Badge */}
              <Flex 
                mt={6} 
                justify="center" 
                align="center" 
                gap={2}
                color="gray.500"
                fontSize="xs"
              >
                <Box 
                  w="16px" 
                  h="16px" 
                  bg="green.500" 
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontSize="10px">✓</Text>
                </Box>
                <Text>Secure checkout</Text>
              </Flex>
            </Box>
          </GridItem>
        </Grid>

        {/* Mobile Bottom Summary (Fixed on mobile) */}
        <Box
          display={{ base: "block", lg: "none" }}
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          p={4}
          boxShadow="0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
          zIndex="999"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="gray.600">Total Amount</Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                ${total.toFixed(2)}
              </Text>
            </Box>
            <Button
              bgGradient="to-r"
              gradientFrom="purple.500"
              gradientTo="blue.500"
              color="white"
              size="md"
              onClick={handleCheckout}
              px={8}
            >
              Checkout
            </Button>
          </Flex>
        </Box>

        {/* Add padding at bottom for mobile fixed bar */}
        <Box h={{ base: "80px", lg: "0" }} />
      </Box>
    </Box>
  );
}

export default Cart;