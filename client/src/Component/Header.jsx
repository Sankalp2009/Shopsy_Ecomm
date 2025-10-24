import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  Avatar,
  Menu,
  Portal,
  IconButton,
  Drawer,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {
  ShoppingCart,
  LogOut,
  Menu as MenuIcon,
  X,
  User,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Action_Type } from "../Redux/Auth_Reducer/action.jsx";
import { Action_Type as cart } from "../Redux/Cart_Reducer/action.jsx";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { IsAuth, user } = useSelector((state) => state.auth);
   console.log("Header",user);
  const isAdmin = user?.role === "admin";
  const nav = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const CartCount = items?.length || 0;
  const dispatch = useDispatch();

  const Links = [
    { path: "/", content: "Home" },
    { path: "/product", content: "Products" },
  ];

  const handleLogout = () => {
    dispatch({ type: cart.CLEAR_CART });
    dispatch({ type: Action_Type.LOGOUT });
    setIsMobileMenuOpen(false);
    nav("/");
  };

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      bg="white"
      boxShadow="0 2px 8px rgba(0,0,0,0.08)"
      backdropFilter="blur(10px)"
      transition="all 0.3s ease"
    >
      <Box maxW="1400px" mx="auto" px={{ base: "4", md: "6", lg: "8" }}>
        <Flex
          h={{ base: "70px", md: "80px" }}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <Flex alignItems="center" gap="2">
              <Box
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                p="2"
                borderRadius="lg"
                boxShadow="0 4px 12px rgba(102, 126, 234, 0.3)"
              >
                <ShoppingCart color="white" size={24} />
              </Box>
              <Heading
                size={{ base: "lg", md: "xl" }}
                bgGradient="to-r"
                gradientFrom="purple.600"
                gradientTo="blue.500"
                bgClip="text"
                fontWeight="800"
                letterSpacing="tight"
              >
                shopsy
              </Heading>
            </Flex>
          </Link>

          {/* Desktop Navigation */}
          <Flex
            display={{ base: "none", md: "flex" }}
            gap="8"
            alignItems="center"
            fontSize="md"
            fontWeight="500"
          >
            {Links.map((el) => (
              <Link
                key={el.path}
                to={el.path}
                style={{ textDecoration: "none" }}
              >
                <Text
                  color="gray.700"
                  _hover={{
                    color: "purple.600",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  {el.content}
                </Text>
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{ textDecoration: "none" }}>
                <Text
                  color="gray.700"
                  _hover={{
                    color: "purple.600",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  Admin
                </Text>
              </Link>
            )}
          </Flex>

          {/* Desktop Auth Actions */}
          <Flex
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            gap="4"
          >
            {!IsAuth ? (
              <>
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    colorPalette="purple"
                    size="md"
                    fontWeight="600"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    bgGradient="to-r"
                    gradientFrom="purple.500"
                    gradientTo="blue.500"
                    color="white"
                    size="md"
                    fontWeight="600"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s"
                  >
                    Register
                  </Button>
                </Link>
                <Box position="relative">
                  <ShoppingCart size={24} color="#6B7280" />
                </Box>
              </>
            ) : (
              <>
                {/* Cart Icon with Badge */}
                <Link to="/cart">
                  <Box position="relative" cursor="pointer">
                    <IconButton
                      variant="ghost"
                      colorPalette="gray"
                      size="lg"
                      _hover={{ bg: "gray.100" }}
                    >
                      <ShoppingCart size={22} />
                    </IconButton>
                    {CartCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-1"
                        right="-1"
                        colorPalette="red"
                        variant="solid"
                        borderRadius="full"
                        fontSize="xs"
                        minW="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                      >
                        {CartCount}
                      </Badge>
                    )}
                  </Box>
                </Link>

                {/* User Menu */}
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger>
                    <Avatar.Root
                      size="sm"
                      cursor="pointer"
                      borderWidth="2px"
                      borderColor="purple.500"
                      _hover={{
                        transform: "scale(1.05)",
                        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                      }}
                      transition="all 0.2s"
                    >
                      <Avatar.Fallback>
                        {user?.name?.charAt(0) || "u"}
                      </Avatar.Fallback>
                      <Avatar.Image src={user?.photo} />
                    </Avatar.Root>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content
                        minW="220px"
                        borderRadius="xl"
                        boxShadow="xl"
                        border="1px solid"
                        borderColor="gray.100"
                      >
                        <Box
                          p="4"
                          borderBottom="1px solid"
                          borderColor="gray.100"
                        >
                          <Text fontWeight="600" fontSize="md" color="gray.800">
                            {user?.name}
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            textTransform="capitalize"
                          >
                            {user?.role}
                          </Text>
                        </Box>
                        <Menu.Item value="profile" _hover={{ bg: "purple.50" }}>
                          <Link
                            to="/me"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                            }}
                          >
                            <User size={16} />
                            <span>Profile</span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item value="orders" _hover={{ bg: "purple.50" }}>
                          <Link
                            to="/order"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              width: "100%",
                            }}
                          >
                            <Package size={16} />
                            <span>Orders</span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item
                          value="logout"
                          color="red.600"
                          _hover={{ bg: "red.50" }}
                          onClick={handleLogout}
                        >
                          <Flex align="center" gap="2">
                            <LogOut size={16} />
                            <span>Logout</span>
                          </Flex>
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </>
            )}
          </Flex>

          {/* Mobile Menu Button & Cart */}
          <Flex
            display={{ base: "flex", md: "none" }}
            alignItems="center"
            gap="3"
          >
            {IsAuth && (
              <Link to="/cart">
                <Box position="relative">
                  <ShoppingCart size={24} />
                  {CartCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-8px"
                      right="-8px"
                      colorPalette="red"
                      variant="solid"
                      borderRadius="full"
                      fontSize="xs"
                      minW="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {CartCount}
                    </Badge>
                  )}
                </Box>
              </Link>
            )}
            <IconButton
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              colorPalette="gray"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </IconButton>
          </Flex>
        </Flex>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <Box
            display={{ base: "block", md: "none" }}
            pb="4"
            borderTop="1px solid"
            borderColor="gray.100"
            animation="slideDown 0.3s ease-out"
          >
            <VStack align="stretch" gap="2" mt="4">
              {Links.map((el) => (
                <Link
                  key={el.path}
                  to={el.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    p="3"
                    borderRadius="lg"
                    _hover={{ bg: "purple.50" }}
                    transition="all 0.2s"
                  >
                    <Text fontWeight="500" color="gray.700">
                      {el.content}
                    </Text>
                  </Box>
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    p="3"
                    borderRadius="lg"
                    _hover={{ bg: "purple.50" }}
                    transition="all 0.2s"
                  >
                    <Text fontWeight="500" color="gray.700">
                      Admin
                    </Text>
                  </Box>
                </Link>
              )}

              {!IsAuth ? (
                <>
                  <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      w="full"
                      variant="ghost"
                      colorPalette="purple"
                      size="lg"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      w="full"
                      bgGradient="to-r"
                      gradientFrom="purple.500"
                      gradientTo="blue.500"
                      color="white"
                      size="lg"
                    >
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Box
                    p="3"
                    borderRadius="lg"
                    bg="purple.50"
                    borderWidth="1px"
                    borderColor="purple.200"
                  >
                    <Text fontWeight="600" fontSize="sm" color="gray.800">
                      {user?.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      textTransform="capitalize"
                    >
                      {user?.role}
                    </Text>
                  </Box>
                  <Link to="/me" onClick={() => setIsMobileMenuOpen(false)}>
                    <Box
                      p="3"
                      borderRadius="lg"
                      _hover={{ bg: "purple.50" }}
                      display="flex"
                      alignItems="center"
                      gap="2"
                    >
                      <User size={18} />
                      <Text fontWeight="500">Profile</Text>
                    </Box>
                  </Link>
                  <Link to="/order" onClick={() => setIsMobileMenuOpen(false)}>
                    <Box
                      p="3"
                      borderRadius="lg"
                      _hover={{ bg: "purple.50" }}
                      display="flex"
                      alignItems="center"
                      gap="2"
                    >
                      <Package size={18} />
                      <Text fontWeight="500">Orders</Text>
                    </Box>
                  </Link>
                  <Box
                    p="3"
                    borderRadius="lg"
                    _hover={{ bg: "red.50" }}
                    cursor="pointer"
                    onClick={handleLogout}
                    display="flex"
                    alignItems="center"
                    gap="2"
                    color="red.600"
                  >
                    <LogOut size={18} />
                    <Text fontWeight="500">Logout</Text>
                  </Box>
                </>
              )}
            </VStack>
          </Box>
        )}
      </Box>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}

export default Header;
