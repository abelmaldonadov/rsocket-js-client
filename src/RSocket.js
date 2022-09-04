import RSocketWebSocketClient from "rsocket-websocket-client"
import { IdentitySerializer, JsonSerializer, RSocketClient } from "rsocket-core"

export class RSocket {
  constructor(host, port) {
    // Transport
    this.host = host
    this.port = port

    // Client
    this.keepAlive = 60000
    this.lifetime = 180000
    this.dataMimeType = "application/json"
    this.metadataMimeType = "message/x.rsocket.routing.v0"

    // Connection
    this.socket = null
  }

  connect() {
    const transport = new RSocketWebSocketClient({
      url: `ws://${this.host}:${this.port}`,
    })
    const client = new RSocketClient({
      // send/receive JSON objects instead of strings/buffers
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      setup: {
        // ms btw sending keepalive to server
        keepAlive: this.keepAlive,
        // ms timeout if no keepalive response
        lifetime: this.lifetime,
        // format of `data`
        dataMimeType: this.dataMimeType,
        // format of `metadata`
        metadataMimeType: this.metadataMimeType,
      },
      transport,
    })
    client.connect().subscribe({
      onComplete: (socket) => {
        this.socket = socket
      },
      onError: (error) => {
        console.log("got connection error")
        console.error(error)
      },
      onSubscribe: (cancel) => {
        /* call cancel() to abort */
      },
    })
  }

  fireAndForget = (route, message) => {
    if (this.socket) {
      this.socket.fireAndForget({
        data: message,
        metadata: this.encrypt(route),
      })
    } else {
      console.log("not connected...")
    }
  }

  requestResponse(route, message, subscribe) {
    if (this.socket) {
      this.socket
        .requestResponse({
          data: message,
          metadata: this.encrypt(route),
        })
        .subscribe(subscribe)
    } else {
      console.log("not connected...")
    }
  }

  requestStream(route, message, subscribe) {
    if (this.socket) {
      this.socket
        .requestStream({
          data: message,
          metadata: this.encrypt(route),
        })
        .subscribe(subscribe)
    } else {
      console.log("not connected...")
    }
  }

  requestChannel() {
    console.log("not implemented")
  }

  encrypt(route) {
    return String.fromCharCode(route.length) + String(route)
  }
}
