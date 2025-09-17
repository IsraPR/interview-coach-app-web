// src/api/websocketClient.ts

class WebSocketClient {
  private socket: WebSocket | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onCloseCallback: ((event: CloseEvent) => void) | null = null;

  /**
   * Establishes a connection to the WebSocket server.
   * Returns a Promise that resolves on successful connection and rejects on error.
   * @param {string} url - The WebSocket server URL to connect to.
   */
  public connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Prevent creating a new connection if one is already open
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already connected.');
        return resolve();
      }

      // Create a new native WebSocket instance
      this.socket = new WebSocket(url);

      // Event listener for when the connection is successfully opened
      this.socket.onopen = () => {
        console.log('WebSocket connection established.');
        resolve();
      };

      // Event listener for incoming messages from the server
      this.socket.onmessage = (event) => {
        // The event.data can be a string, Blob, or ArrayBuffer.
        // We need to handle both text (JSON) and binary data.
        if (typeof event.data === 'string') {
          try {
            const parsedData = JSON.parse(event.data);
            if (this.onMessageCallback) {
              this.onMessageCallback(parsedData);
            }
          } catch (error) {
            console.error('Failed to parse incoming JSON message:', error);
          }
        } else {
          // For binary data (like audio), we pass it on directly.
          if (this.onMessageCallback) {
            this.onMessageCallback(event.data);
          }
        }
      };

      // Event listener for when the connection is closed
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        // 👇 2. When the connection closes, call our new callback
        if (this.onCloseCallback) {
          this.onCloseCallback(event);
        }
        this.socket = null;
      };

      // Event listener for any connection errors
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket connection failed.'));
      };
    });
  }

  /**
   * Registers a callback function to be executed when a message is received.
   * @param {(data: any) => void} callback - The function to handle incoming data.
   */
  public registerOnMessageHandler(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }

  /**
   * Sends data to the WebSocket server. The data object will be stringified.
   * @param {any} data - The data to send, typically a JavaScript object.
   */
  public registerOnCloseHandler(callback: (event: CloseEvent) => void) {
    this.onCloseCallback = callback;
  }
  public send(data: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('Cannot send data: WebSocket is not connected.');
      return;
    }
    this.socket.send(JSON.stringify(data));
  }

  /**
   * Closes the WebSocket connection if it is open.
   */
  public disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

// We create and export a single instance of the client (Singleton Pattern).
// This ensures that the entire application uses the same WebSocket connection.
const webSocketClient = new WebSocketClient();
export default webSocketClient;