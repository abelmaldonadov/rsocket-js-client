import { useEffect, useState } from "react"
import RSocketWebSocketClient from "rsocket-websocket-client"
import { IdentitySerializer, JsonSerializer, RSocketClient } from "rsocket-core"
import { Flowable } from "rsocket-flowable"

function App() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    return () => {
      console.log("start")
      connect()
    }
  }, [])

  const connect = () => {
    const transport = new RSocketWebSocketClient({
      url: "ws://localhost:8090",
    })
    const client = new RSocketClient({
      // send/receive JSON objects instead of strings/buffers
      serializers: {
        data: JsonSerializer,
        metadata: IdentitySerializer,
      },
      setup: {
        // ms btw sending keepalive to server
        keepAlive: 60000,
        // ms timeout if no keepalive response
        lifetime: 180000,
        // format of `data`
        dataMimeType: "application/json",
        // format of `metadata`
        metadataMimeType: "message/x.rsocket.routing.v0",
      },
      transport,
    })
    client.connect().subscribe({
      onComplete: (socket) => {
        setSocket(socket)
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

  const doFireAndForget = () => {
    if (socket) {
      const message = { message: "fire and forget from JavaScript!" }
      socket.fireAndForget({
        data: message,
        metadata:
          String.fromCharCode("fire.and.forget".length) + "fire.and.forget",
      })
      console.log(message)
    } else {
      console.log("not connected...")
    }
  }

  const doRequestResponse = () => {
    if (socket) {
      const message = { message: "requestResponse from JavaScript!" }
      socket
        .requestResponse({
          data: message,
          metadata:
            String.fromCharCode("request.response".length) + "request.response",
        })
        .subscribe({
          onComplete: (data) => {
            console.log("got response with requestResponse")
            console.log(data.data)
          },
          onError: (error) => {
            console.log("got error with requestResponse")
            console.error(error)
          },
          onSubscribe: (cancel) => {
            console.log(message)
            /* call cancel() to stop onComplete/onError */
          },
        })
    } else {
      console.log("not connected...")
    }
  }

  const doRequestStream = () => {
    if (socket) {
      const message = { message: "requestStream from JavaScript!" }
      socket
        .requestStream({
          data: message,
          metadata:
            String.fromCharCode("request.stream".length) + "request.stream",
        })
        .subscribe({
          onComplete: () => {
            console.log("requestStream done")
            // this.received.push("requestStream done")
          },
          onError: (error) => {
            console.log("got error with requestStream")
            console.error(error)
          },
          onNext: (value) => {
            // console.log("got next value in requestStream..");
            console.log(value.data)
          },
          // Nothing happens until `request(n)` is called
          onSubscribe: (sub) => {
            console.log("subscribe request Stream!")
            sub.request(3)
            console.log(message)
          },
        })
    } else {
      console.log("not connected...")
    }
  }

  const doRequestChannel = () => {
    console.log("not implemented")
  }

  return (
    <div className="App">
      <button onClick={doFireAndForget}>Fire and forget</button>
      <hr />
      <button onClick={doRequestResponse}>Request response</button>
      <hr />
      <button onClick={doRequestStream}>Request response</button>
      <hr />
      <button onClick={doRequestChannel}>Request channel</button>
      <hr />
    </div>
  )
}

export default App
