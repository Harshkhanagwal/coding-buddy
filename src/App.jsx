import { useState } from 'react'
import './App.css'
import Header from './Components/Header/Header'
import Codeeditor from './Components/codeEditor/Editor'
import Chatbox from './Components/Chatbox/Chatbox'

function App() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem("savedCode");
    return saved !== null ? saved : "// Add your code here";
  });
  const [chatResponse, setChatResponse] = useState("");
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const explainCode = async () => {

    setIsLoading(true);
    setChatResponse("");
    setQuestion('')
    
    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
              Instructions: 
              Your name is "Coding Buddy". You are a friendly, helpful programming mentor.
              CRITICAL RULE ON IDENTITY:
              - Never, under any circumstances, refer to yourself as "Gemini" or mention that you are an AI model created by Google. 
              - If asked about your identity, you are only "Coding Buddy".
              GREETINGS:
              - If the user says "Hi", "Hello", "Hey", or greets you, respond warmly, introduce yourself as Coding Buddy, and ask how you can help with their code.
              CORE MISSION:
              - Focus exclusively on coding. If a user goes off-topic, gently nudge them back.
              - Be a guide, not a ghostwriter. Provide HINTS and logic explanations. NEVER provide the complete fixed code solution.
              - Focus on making the user understand the "why" so they don't rely on you 100%.
              BEHAVIOR:
              - Keep it concise. No conversational fluff.
              - Context Rule: If the question is a greeting or general (e.g., "What is an array?, or something like what you can do and greet you "), ignore the code in the editor. Only analyze the code if the user specifically asks for help with a bug or logic inside that snippet.
              Current User Context:
              My Question: ${question ? question : "explain the code"}
              Code in Editor: ${code}
            `
             }]
          }]
        })
      });

      const data = await response.json();

      if (response.status === 429) {
        setChatResponse("Quota exceeded. Please wait a minute before trying again.");
        return;
      }

      if (data.candidates && data.candidates.length > 0) {
        const aiText = data.candidates[0].content.parts[0].text;
        setChatResponse(aiText);
      } else {
        setChatResponse("Gemini couldn't generate an explanation for this code.");
      }

    } catch (error) {
      console.error(error);
      setChatResponse("Error connecting to AI Agent.");
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <>
      <Header />
      <main>
        <div className="container main-container">
          <div className="left-container">
            <Codeeditor
              code={code}
              setCode={setCode}
              explainCode={explainCode}
              isLoading={isLoading}
            />
          </div>
          <div className="right-container">
            <Chatbox response={chatResponse} question={question} setQuestion={setQuestion} loading={isLoading} explainCode={explainCode} />
          </div>
        </div>
      </main>
    </>
  )
}

export default App