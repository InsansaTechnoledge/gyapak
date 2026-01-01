const vectorEmbeddingjobs = async () => {
  try {
    console.log("vector embedding job started");
    const response = await fetch(
      "https://gyapak-chatbot.insansa.com/embeddings/batch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 100,
        }),
      }
    );
    const data = await response.json();
    console.log("message:", data);
  } catch (err) {
    console.log("❌ Something went wrong in the embedding API", err);
  }
};

export default vectorEmbeddingjobs;
