import { useEffect, useState } from "react"
import { RSocket } from "./RSocket"

function App() {
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    return () => {
      console.log("start")
      const socket = new RSocket("localhost", 8090)
      socket.connect()
      setSocket(socket)
    }
  }, [])

  const doFireAndForget = () => {
    socket.fireAndForget("fire.and.forget", {
      message: "fireAnForget from JavaScript!",
    })
  }

  const doRequestResponse = () => {
    socket.requestResponse(
      "request.response",
      { message: "requestResponse from JavaScript!" },
      {
        onComplete: (data) => {
          console.log("got response with requestResponse")
          console.log(data.data)
        },
        onError: (error) => {
          console.log("got error with requestResponse")
          console.error(error)
        },
        onSubscribe: (cancel) => {
          /* call cancel() to stop onComplete/onError */
        },
      }
    )
  }

  const doRequestStream = () => {
    socket.requestStream(
      "request.stream",
      { message: "requestStream from JavaScript!" },
      {
        onComplete: () => {
          console.log("requestStream done")
        },
        onError: (error) => {
          console.log("got error with requestStream")
          console.error(error)
        },
        onNext: (value) => {
          // console.log("got next value in requestStream..")
          console.log(value.data)
        },
        // Nothing happens until `request(n)` is called
        onSubscribe: (sub) => {
          console.log("subscribe request Stream!")
          sub.request(3)
        },
      }
    )
  }

  const doRequestChannel = () => {
    socket.requestChannel()
  }

  return (
    <div className="App">
      <button onClick={doFireAndForget}>Fire and forget</button>
      <hr />
      <button onClick={doRequestResponse}>Request response</button>
      <hr />
      <button onClick={doRequestStream}>Request stream</button>
      <hr />
      <button onClick={doRequestChannel}>Request channel</button>
      <hr />
    </div>
  )
}

export default App
