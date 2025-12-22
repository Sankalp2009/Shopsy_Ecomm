import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { Action_Type } from "../Redux/Cart_Reducer/action.jsx";
import { toaster } from "../components/ui/toaster.jsx";

const ProductCard = memo(function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const handleCart = (product) => {
    const existingItem = items.find((item) => item._id === product._id);

    if (existingItem) {
      // ✅ If item exists → update quantity (increase by 1)
      const updatedQuantity = existingItem.quantity + 1;

      dispatch({
        type: Action_Type.UPDATE_CART_ITEM,
        payload: {
          id: product._id,
          updates: { quantity: updatedQuantity },
        },
      });

      toaster.success({
        title: "Cart updated!",
        description: `You have this item in your bag and we have increase the quantity of "${product.name}" to ${updatedQuantity}.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      // ✅ If item doesn't exist → add new item with quantity = 1
      dispatch({
        type: Action_Type.ADD_TO_CART,
        payload: { ...product, quantity: 1 },
      });

      toaster.success({
        title: "Item added successfully!",
        description: `${product.name} added to your cart.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Card.Root
        borderRadius="xl"
        boxShadow="md"
        _hover={{
          transform: "scale(1.04)",
          boxShadow: "xl",
          transition: "all 0.3s ease",
        }}
        cursor="pointer"
        overflow="hidden"
        bg="white"
      >
        <Link to={`/product/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            objectFit="contain"
            w="full"
            h="250px"
            transition="0.3s"
            loading="lazy"
          />
        </Link>
        <Card.Body>
          <Heading size="sm" lineClamp="2">
            {product.name}
          </Heading>
          <Text fontSize="sm" colorPalette="gray" lineClamp="2" mt={1}>
            {product.description}
          </Text>

          <Flex justify="space-between" align="center" mt={3}>
            <Text fontWeight="bold" colorPalette="teal">
              ₹{Math.floor(product.price)}
            </Text>
            <Text
              fontSize="sm"
              colorPalette={product.stock > 0 ? "green.500" : "red.500"}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </Text>
          </Flex>

          <Button
            onClick={() => handleCart(product)}
            mt={4}
            colorPalette="teal"
            w="full"
            size="sm"
          >
            Add to Cart
          </Button>
          <Text
            fontSize="xs"
            colorPalette="gray.500"
            textAlign="right"
            mt={2}
            fontStyle="italic"
          >
            {product.category}
          </Text>
        </Card.Body>
      </Card.Root>
    </Box>
  );
});

export default ProductCard;
