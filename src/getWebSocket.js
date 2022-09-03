export const getWebSocket = () => {
  const ws = new WebSocket(`ws://localhost:8080/chat`)

  ws.onmessage = (e) => {
    ws.send(
      `{"id":"631020cc45ecf500c4a0b917","sender":"630a8f89bf68a2c0daae","content":"hola MIRAME","receptor":"630a8f89bf68a2c0daae1486","insertionDate":"2022-08-28T01:44:26.361"}`
    )
    console.log(e.data)
  }
}
