import { Box, Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In production, you might want to send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          bg="gray.50"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Container maxW="2xl">
            <Stack
              gap={6}
              textAlign="center"
              p={8}
              bg="white"
              borderRadius="2xl"
              boxShadow="xl"
            >
              <Box display="flex" justifyContent="center">
                <Box
                  bg="red.100"
                  p={4}
                  borderRadius="full"
                  display="inline-flex"
                >
                  <AlertTriangle size={48} color="#dc2626" />
                </Box>
              </Box>

              <Heading size="2xl" color="gray.800">
                Oops! Something went wrong
              </Heading>

              <Text fontSize="lg" color="gray.600">
                We're sorry for the inconvenience. The application encountered
                an unexpected error.
              </Text>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <Box
                  bg="red.50"
                  p={4}
                  borderRadius="lg"
                  textAlign="left"
                  maxH="200px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="red.200"
                >
                  <Text
                    fontSize="sm"
                    fontFamily="mono"
                    color="red.800"
                    fontWeight="600"
                  >
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text
                      fontSize="xs"
                      fontFamily="mono"
                      color="red.700"
                      mt={2}
                    >
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </Box>
              )}

              <Stack
                direction={{ base: "column", sm: "row" }}
                gap={4}
                justify="center"
                mt={4}
              >
                <Button
                  size="lg"
                  colorPalette="blue"
                  onClick={this.handleReset}
                  leftIcon={<RefreshCw size={20} />}
                >
                  Reload Page
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "/")}
                >
                  Go to Home
                </Button>
              </Stack>

              <Text fontSize="sm" color="gray.500" mt={4}>
                If the problem persists, please contact support.
              </Text>
            </Stack>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
