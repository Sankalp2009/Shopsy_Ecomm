export const Order_Action_Type = {
  ORDER_CREATED:"ORDER_CREATED",
  ORDER_STATUS_UPDATED:"ORDER_STATUS_UPDATED",
}

// 🧠 Action Creator for status update
export const updateOrderStatus = (orderId, status) => ({
  type: Order_Action_Type.ORDER_STATUS_UPDATED,
  payload: { orderId, status },
});