import React from "react";
import { Heading, Box, Flex, Button, Text, Container, Grid, Stack, Image } from "@chakra-ui/react";
import { Link } from "react-router";
import { 
  ShoppingBag, 
  Zap, 
  Shield, 
  TrendingUp, 
  Star,
  Package,
  Truck,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Users,
  Heart
} from "lucide-react";

import {useSelector} from "react-redux";

function Home() {
  const features = [
    {
      icon: ShoppingBag,
      title: "Wide Selection",
      description: "Thousands of products across multiple categories",
      color: "purple"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your orders delivered within 2-3 business days",
      color: "blue"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions with encrypted checkout",
      color: "green"
    },
    {
      icon: CreditCard,
      title: "Easy Returns",
      description: "Hassle-free returns within 30 days of purchase",
      color: "orange"
    }
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Package, value: "100K+", label: "Products Sold" },
    { icon: Star, value: "4.9/5", label: "Customer Rating" },
    { icon: TrendingUp, value: "99%", label: "Satisfaction Rate" }
  ];
  
  const { IsAuth } = useSelector(state => state.auth);
  console.log(IsAuth);

  return (
    <Box minH="100vh" bg="linear-gradient(to bottom, #f8fafc, #e2e8f0)" overflow="hidden">
      {/* Hero Section */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 12, md: 20 }}>
        <Grid 
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
          gap={{ base: 8, lg: 16 }}
          alignItems="center"
        >
          {/* Left Content */}
          <Stack gap={{ base: 6, md: 8 }} textAlign={{ base: "center", lg: "left" }}>
            {/* Badge */}
            <Flex 
              justify={{ base: "center", lg: "flex-start" }}
              css={{
                animation: "fadeInUp 0.6s ease-out"
              }}
            >
              <Box
                bg="purple.100"
                color="purple.700"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="medium"
                display="inline-flex"
                alignItems="center"
                gap={2}
              >
                <Zap size={16} />
                New Arrivals Every Week
              </Box>
            </Flex>

            {/* Main Heading */}
            <Box
              css={{
                animation: "fadeInUp 0.8s ease-out"
              }}
            >
              <Heading 
                size={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="extrabold"
                lineHeight="1.2"
                mb={4}
              >
                Shop Smart,
                <br />
                <Text 
                  as="span" 
                  bgGradient="to-r" 
                  gradientFrom="purple.600" 
                  gradientTo="pink.500"
                  bgClip="text"
                >
                  Live Better
                </Text>
              </Heading>
              <Text 
                fontSize={{ base: "md", md: "lg", lg: "xl" }}
                color="gray.600"
                maxW="600px"
                mx={{ base: "auto", lg: 0 }}
              >
                Discover amazing products at unbeatable prices. Join thousands of satisfied customers and start your shopping journey today.
              </Text>
            </Box>

            {/* CTA Buttons */}

            {IsAuth ? (
                <Flex 
              gap={4} 
              justify={{ base: "center", lg: "flex-start" }}
              flexWrap="wrap"
              css={{
                animation: "fadeInUp 1s ease-out"
              }}
            >
              <Link to="/product">
                <Button
                  size={{ base: "md", md: "lg" }}
                  variant="outline"
                  colorPalette="purple"
                  px={8}
                  py={6}
                  borderRadius="full"
                  _hover={{ bg: "purple.50", transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  Browse Products
                </Button>
              </Link>
            </Flex>
            ) : (
                <Flex 
              gap={4} 
              justify={{ base: "center", lg: "flex-start" }}
              flexWrap="wrap"
              css={{
                animation: "fadeInUp 1s ease-out"
              }}
            >
              <Link to="/signup">
                <Button
                  size={{ base: "md", md: "lg" }}
                  bg="purple.600"
                  color="white"
                  _hover={{ bg: "purple.700", transform: "translateY(-2px)" }}
                  px={8}
                  py={6}
                  borderRadius="full"
                  boxShadow="lg"
                  transition="all 0.3s"
                  rightIcon={<ArrowRight size={20} />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/product">
                <Button
                  size={{ base: "md", md: "lg" }}
                  variant="outline"
                  colorPalette="purple"
                  px={8}
                  py={6}
                  borderRadius="full"
                  _hover={{ bg: "purple.50", transform: "translateY(-2px)" }}
                  transition="all 0.3s"
                >
                  Browse Products
                </Button>
              </Link>
            </Flex>
            )}

            {/* Trust Indicators */}
            <Flex 
              gap={4} 
              align="center" 
              justify={{ base: "center", lg: "flex-start" }}
              flexWrap="wrap"
            >
              <Flex align="center" gap={1}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} fill="#FCD34D" color="#FCD34D" />
                ))}
              </Flex>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                Rated 4.9/5 by 10,000+ customers
              </Text>
            </Flex>
          </Stack>

          {/* Right Content - Floating Card */}
          <Box 
            display={{ base: "none", lg: "block" }}
            position="relative"
            css={{
              animation: "float 6s ease-in-out infinite"
            }}
          >
            <Box
              bg="white"
              p={8}
              borderRadius="3xl"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.15)"
              position="relative"
              _before={{
                content: '""',
                position: "absolute",
                top: "-10px",
                right: "-10px",
                width: "100px",
                height: "100px",
                bg: "purple.100",
                borderRadius: "full",
                opacity: 0.5,
                zIndex: -1
              }}
              _after={{
                content: '""',
                position: "absolute",
                bottom: "-20px",
                left: "-20px",
                width: "150px",
                height: "150px",
                bg: "pink.100",
                borderRadius: "full",
                opacity: 0.3,
                zIndex: -1
              }}
            >
              <Stack gap={6}>
                <Flex align="center" gap={3}>
                  <Box bg="purple.100" p={3} borderRadius="xl">
                    <ShoppingBag size={32} color="#9333ea" />
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">Special Offer</Text>
                    <Heading size="lg">50% OFF</Heading>
                  </Box>
                </Flex>
                
                <Box 
                  h="200px" 
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  overflow="hidden"
                >
                  <Image src="https://media.istockphoto.com/id/1411757433/vector/3d-vector-delivery-van-with-box-cargo-delivery-and-online-shopping-concept.jpg?s=612x612&w=0&k=20&c=ZWmugzSvVn5OrCKdjA6HKnJt_HFIYAtGH2885V0xTlc="  alt="Naruto vs Sasuke" aspectRatio={4 / 3}/>
                  <Box
                    position="absolute"
                    top="15%"
                    left="25%"
                    transform="translate(-50%, -50%)"
                    textAlign="center"
                  >
                    <Text fontSize="4xl" fontWeight="bold" color="#f9fafc">
                      Limited Time
                    </Text>
                  </Box>
                </Box>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box textAlign="center" p={4} bg="gray.50" borderRadius="xl">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">2K+</Text>
                    <Text fontSize="sm" color="gray.600">Products</Text>
                  </Box>
                  <Box textAlign="center" p={4} bg="gray.50" borderRadius="xl">
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">24/7</Text>
                    <Text fontSize="sm" color="gray.600">Support</Text>
                  </Box>
                </Grid>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box bg="white" py={{ base: 12, md: 16 }} position="relative">
        <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }}>
          <Grid 
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} 
            gap={{ base: 6, md: 8 }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                textAlign="center"
                p={{ base: 4, md: 6 }}
                borderRadius="2xl"
                transition="all 0.3s"
                _hover={{ 
                  transform: "translateY(-8px)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                }}
              >
                <Flex justify="center" mb={3}>
                  <Box 
                    bg="purple.100" 
                    p={3} 
                    borderRadius="xl"
                    display="inline-flex"
                  >
                    <stat.icon size={28} color="#9333ea" />
                  </Box>
                </Flex>
                <Heading size={{ base: "xl", md: "2xl" }} mb={2} color="gray.800">
                  {stat.value}
                </Heading>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
                  {stat.label}
                </Text>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 12, md: 20 }}>
        <Box textAlign="center" mb={{ base: 10, md: 16 }}>
          <Text 
            fontSize="sm" 
            fontWeight="bold" 
            color="purple.600" 
            mb={3}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            Why Choose Us
          </Text>
          <Heading 
            size={{ base: "xl", md: "2xl", lg: "3xl" }}
            mb={4}
          >
            Everything You Need for a
            <br />
            Perfect Shopping Experience
          </Heading>
          <Text 
            fontSize={{ base: "md", md: "lg" }}
            color="gray.600"
            maxW="2xl"
            mx="auto"
          >
            We're committed to providing the best online shopping experience with quality products and exceptional service.
          </Text>
        </Box>

        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} 
          gap={{ base: 6, md: 8 }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              bg="white"
              p={{ base: 6, md: 8 }}
              borderRadius="2xl"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.05)"
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: "translateY(-12px)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                bg: `${feature.color}.500`,
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.3s"
              }}
              _hover_before={{
                transform: "scaleX(1)"
              }}
            >
              <Box
                bg={`${feature.color}.100`}
                p={4}
                borderRadius="xl"
                display="inline-flex"
                mb={4}
              >
                <feature.icon size={32} color={`var(--chakra-colors-${feature.color}-600)`} />
              </Box>
              <Heading size={{ base: "sm", md: "md" }} mb={3} color="gray.800">
                {feature.title}
              </Heading>
              <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" lineHeight="1.7">
                {feature.description}
              </Text>
            </Box>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box 
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          width="300px"
          height="300px"
          bg="whiteAlpha.100"
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-100px"
          left="-100px"
          width="400px"
          height="400px"
          bg="whiteAlpha.100"
          borderRadius="full"
        />

        <Container maxW="4xl" px={{ base: 4, sm: 6, lg: 8 }} position="relative">
          <Stack gap={8} align="center" textAlign="center">
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              color="white"
              maxW="3xl"
            >
              Ready to Start Your Shopping Journey?
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }}
              color="whiteAlpha.900"
              maxW="2xl"
            >
              Join our community of happy shoppers and get access to exclusive deals, early product launches, and personalized recommendations.
            </Text>
            
            <Flex gap={4} flexWrap="wrap" justify="center">
              <Link to="/signup">
                <Button
                  size={{ base: "md", md: "lg" }}
                  bg="white"
                  color="purple.600"
                  _hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
                  px={8}
                  py={6}
                  borderRadius="full"
                  boxShadow="xl"
                  transition="all 0.3s"
                  rightIcon={<ArrowRight size={20} />}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="bold"
                >
                  Create Free Account
                </Button>
              </Link>
            </Flex>

            <Flex 
              gap={{ base: 4, md: 8 }} 
              align="center" 
              color="whiteAlpha.900"
              flexWrap="wrap"
              justify="center"
              fontSize={{ base: "sm", md: "md" }}
            >
              <Flex align="center" gap={2}>
                <CheckCircle size={20} />
                <Text>No credit card required</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <CheckCircle size={20} />
                <Text>Cancel anytime</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Heart size={20} />
                <Text>Loved by 50K+ users</Text>
              </Flex>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Add floating animation keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </Box>
  );
}

export default Home;