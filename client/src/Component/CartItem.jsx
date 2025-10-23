import React from "react";
import { useDispatch } from "react-redux";
import { Action_Type } from "../Redux/Cart_Reducer/action.jsx";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
// import { useNavigate } from "react-router";
import {
  Box,
  Heading,
  Text,
  Container,
  Center,
  Flex,
  Button,
  Grid,
} from "@chakra-ui/react";
function CartItem({ item }) {
  
   const dispatch = useDispatch();

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <Box bgColor="white" p={6} rounded="lg" boxShadow="md">
       
       {/* Parent Flex*/}
      <Flex justify="space-between">
          
          <Flex gap={8}>
             {/* Image Section */}
      <Box
        w="60px"
        h="auto"
        // rounded="lg"
        overflow="hidden"
      >
        <img src={item.image} alt={item.name} w="100%" fit="contain" />
      </Box>
       
       {/* Name button section */}
      <Flex direction="column" gap={1} ml={10}>
        <Heading fontSize="md" fontWeight="semibold" mb="1">
          {item.name}
        </Heading>
        <Text fontSize="sm" fontWeight="normal" p={1} mb="2">
          $ <span>{item.price}</span> each
        </Text>

        <Flex justify="start" align="center" spaceX="2" gap={2}>
          <Button
            bgColor="white"
            rounded="3xl"
            variant="surface"
            p={1}
            h="6"
            onClick={() =>
              dispatch({
                type: Action_Type.DECREASE_QTY,
                payload: item._id,
              })
            }
          >
            <FiMinus />
          </Button>
          <span className="px-3 py-1 bg-gray-100 rounded font-medium">
            {item.quantity}
          </span>
          <Button
            onClick={() =>
              dispatch({
                type: Action_Type.INCREASE_QTY,
                payload: item._id,
              })
            }
            colorPalette="green"
            rounded="3xl"
            p={1}
            h="6"
            disabled={item.quantity >= item.stock}
          >
            <FiPlus />
          </Button>
        </Flex>
      </Flex>
          </Flex>
          
            {/* Remove section */}
      <Flex
        direction="column"
        align="center"
        justify="space-between"
      >
        <Button
          bgColor="white"
          color="red.600"
          onClick={() =>
            dispatch({
              type: Action_Type.REMOVE_FROM_CART,
              payload: item._id,
            })
          }
        >
          <FiTrash2 />
        </Button>
        <Box fontSize="lg" fontWeight="bold">
          ${subtotal}
        </Box>
      </Flex>
      </Flex>
    </Box>
  );
}

export default CartItem;