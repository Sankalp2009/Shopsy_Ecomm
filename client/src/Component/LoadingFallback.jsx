import { Box, Container, Spinner, Stack, Text } from "@chakra-ui/react";
import { Sparkles } from "lucide-react";

const LoadingFallback = ({ message = "Loading..." }) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #334155 100%)"
    >
      <Container maxW="md">
        <Stack gap={6} align="center" textAlign="center">
          {/* Animated Logo/Icon */}
          <Box
            bg="rgba(250, 204, 21, 0.15)"
            border="2px solid"
            borderColor="rgba(250, 204, 21, 0.3)"
            p={6}
            borderRadius="full"
            boxShadow="0 20px 60px rgba(250, 204, 21, 0.3)"
            css={{
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            <Sparkles size={48} color="#facc15" />
          </Box>

          {/* Spinner */}
          <Spinner size="xl" color="#facc15" thickness="4px" speed="0.8s" />

          {/* Loading Text */}
          <Stack gap={2}>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color="white"
              letterSpacing="tight"
            >
              {message}
            </Text>
            <Text fontSize="sm" color="gray.400">
              Please wait a moment...
            </Text>
          </Stack>
        </Stack>
      </Container>

      {/* Global animation styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingFallback;
