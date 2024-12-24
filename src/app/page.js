// "use client";
// import { useState, useEffect } from "react";
// import {
//   FaMicrophone,
//   FaStop,
//   FaVolumeUp,
//   FaRedo,
//   FaTrash,
// } from "react-icons/fa"; // Import icons

// export default function Home() {
//   const [prompt, setPrompt] = useState("");
//   const [story, setStory] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false); // Track if speech recognition is active
//   const [recognition, setRecognition] = useState(null); // To store the recognition instance
//   const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech synthesis is active
//   const [utterance, setUtterance] = useState(null); // To store the SpeechSynthesisUtterance instance

//   // Speech Recognition setup
//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Speech recognition is not supported by this browser.");
//       return;
//     }

//     const recognitionInstance = new window.webkitSpeechRecognition();
//     recognitionInstance.lang = "en-US";
//     recognitionInstance.continuous = false;
//     recognitionInstance.interimResults = false;

//     recognitionInstance.onstart = () => {
//       setIsListening(true); // Update the state when listening starts
//     };

//     recognitionInstance.onend = () => {
//       setIsListening(false); // Update the state when listening stops
//     };

//     recognitionInstance.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setPrompt(transcript);
//     };

//     recognitionInstance.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       setIsListening(false);
//     };

//     setRecognition(recognitionInstance);
//   }, []);

//   const handlePromptChange = (e) => {
//     setPrompt(e.target.value);
//   };

//   const handleGenerateStory = async () => {
//     if (!prompt) {
//       alert("Please enter a prompt.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await fetch("/api/generate-story", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data && data.story) {
//         setStory(data.story);
//         handleTextToSpeech(data.story); // Automatically start text-to-speech after generating the story
//       } else {
//         alert("Story generation failed: Invalid response.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Failed to generate story. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartListening = () => {
//     if (recognition) {
//       recognition.start();
//     }
//   };

//   const handleStopListening = () => {
//     if (recognition) {
//       recognition.stop();
//     }
//   };

//   // Text-to-Speech function
//   const handleTextToSpeech = (text) => {
//     if (!text) {
//       alert("No story generated to read aloud.");
//       return;
//     }

//     const newUtterance = new SpeechSynthesisUtterance(text);
//     newUtterance.rate = 1; // Speed of speech
//     newUtterance.pitch = 1; // Pitch of the voice
//     newUtterance.volume = 1; // Volume (0 to 1)

//     // Optional: Select a voice
//     const voices = window.speechSynthesis.getVoices();
//     newUtterance.voice =
//       voices.find((voice) => voice.name === "Google UK English Male") ||
//       voices[0]; // Choose voice

//     newUtterance.onstart = () => {
//       setIsSpeaking(true); // Set isSpeaking to true when speech starts
//     };

//     newUtterance.onend = () => {
//       setIsSpeaking(false); // Set isSpeaking to false when speech ends
//     };

//     setUtterance(newUtterance); // Save utterance instance to state

//     window.speechSynthesis.speak(newUtterance);
//   };

//   // Stop the speech synthesis
//   const handleStopSpeaking = () => {
//     if (window.speechSynthesis.speaking) {
//       window.speechSynthesis.cancel(); // Stop speech synthesis
//       setIsSpeaking(false); // Update the state
//     }
//   };

//   // Restart speech from the beginning
//   const handleRestartSpeech = () => {
//     if (utterance) {
//       window.speechSynthesis.cancel(); // Stop current speech
//       setIsSpeaking(false); // Update state
//       handleTextToSpeech(story); // Restart speech synthesis
//     }
//   };

//   // Restart the story from the beginning
//   const handleStartFromBeginning = () => {
//     handleStopSpeaking(); // Stop any ongoing speech
//     handleTextToSpeech(story); // Start speech synthesis from the beginning
//   };

//   // Clear the input field and generated story
//   const handleClear = () => {
//     setPrompt("");
//     setStory("");
//     setIsSpeaking(false);
//     window.speechSynthesis.cancel(); // Stop any ongoing speech
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-teal-100 via-teal-200 to-teal-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl w-full bg-white p-8 rounded-3xl shadow-xl space-y-8">
//         {/* Clear All Button moved to the top */}

//         <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6">
//           AI Story Generator
//         </h1>
//         <button
//           onClick={handleClear}
//           className="w-36 py-4 text-white font-semibold bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-200 transform hover:scale-105 mb-6"
//         >
//           <FaTrash className="mr-2 inline" />
//           Clear
//         </button>
//         <div className="space-y-6">
//           <div className="bg-gray-50 rounded-lg p-6 shadow-md">
//             <textarea
//               className="w-full p-6 text-xl border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 ease-in-out"
//               placeholder="Enter a story prompt..."
//               value={prompt}
//               onChange={handlePromptChange}
//             />
//           </div>

//           <div className="flex space-x-6">
//             <button
//               onClick={handleGenerateStory}
//               disabled={loading}
//               className="w-full py-4 text-white font-semibold bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-teal-400 transition duration-200 transform hover:scale-105"
//             >
//               {loading ? "Generating..." : "Generate Story"}
//             </button>
//             <button
//               onClick={handleStartListening}
//               disabled={isListening}
//               className="w-full py-4 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition duration-200 transform hover:scale-105"
//             >
//               <FaMicrophone className="mr-2 inline" />
//               {isListening ? "Listening..." : "Dictate Prompt"}
//             </button>
//           </div>

//           {isListening && (
//             <button
//               onClick={handleStopListening}
//               className="w-full py-4 text-white font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 transform hover:scale-105"
//             >
//               <FaStop className="mr-2 inline" />
//               Stop Listening
//             </button>
//           )}
//         </div>

//         {story && (
//           <div className="bg-gray-50 rounded-lg p-6 shadow-lg mt-8">
//             <h2 className="text-3xl font-semibold text-gray-800 mb-4">
//               Generated Story:
//             </h2>
//             <p className="text-gray-700 story-text fade-in">{story}</p>

//             <div className="flex space-x-6 mt-6">
//               <button
//                 onClick={isSpeaking ? handleStopSpeaking : handleRestartSpeech}
//                 className="w-full py-4 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
//               >
//                 <FaVolumeUp className="mr-2 inline" />
//                 {isSpeaking ? "Stop Listening" : "Listen to Story"}
//               </button>

//               <button
//                 onClick={handleStartFromBeginning}
//                 className="w-full py-4 text-white font-semibold bg-yellow-600 rounded-lg hover:bg-yellow-700 transition duration-200 transform hover:scale-105"
//               >
//                 <FaRedo className="mr-2 inline" />
//                 Start From Beginning
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import {
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaRedo,
  FaTrash,
  FaDownload, // Add Download icon
} from "react-icons/fa"; // Import icons

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // Track if speech recognition is active
  const [recognition, setRecognition] = useState(null); // To store the recognition instance
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech synthesis is active
  const [utterance, setUtterance] = useState(null); // To store the SpeechSynthesisUtterance instance

  // Speech Recognition setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported by this browser.");
      return;
    }

    const recognitionInstance = new window.webkitSpeechRecognition();
    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      setIsListening(true); // Update the state when listening starts
    };

    recognitionInstance.onend = () => {
      setIsListening(false); // Update the state when listening stops
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerateStory = async () => {
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.story) {
        setStory(data.story);
        handleTextToSpeech(data.story); // Automatically start text-to-speech after generating the story
      } else {
        alert("Story generation failed: Invalid response.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate story. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  // Text-to-Speech function
  const handleTextToSpeech = (text) => {
    if (!text) {
      alert("No story generated to read aloud.");
      return;
    }

    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 1; // Speed of speech
    newUtterance.pitch = 1; // Pitch of the voice
    newUtterance.volume = 1; // Volume (0 to 1)

    // Optional: Select a voice
    const voices = window.speechSynthesis.getVoices();
    newUtterance.voice =
      voices.find((voice) => voice.name === "Google UK English Male") ||
      voices[0]; // Choose voice

    newUtterance.onstart = () => {
      setIsSpeaking(true); // Set isSpeaking to true when speech starts
    };

    newUtterance.onend = () => {
      setIsSpeaking(false); // Set isSpeaking to false when speech ends
    };

    setUtterance(newUtterance); // Save utterance instance to state

    window.speechSynthesis.speak(newUtterance);
  };

  // Stop the speech synthesis
  const handleStopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop speech synthesis
      setIsSpeaking(false); // Update the state
    }
  };

  // Restart speech from the beginning
  const handleRestartSpeech = () => {
    if (utterance) {
      window.speechSynthesis.cancel(); // Stop current speech
      setIsSpeaking(false); // Update state
      handleTextToSpeech(story); // Restart speech synthesis
    }
  };

  // Restart the story from the beginning
  const handleStartFromBeginning = () => {
    handleStopSpeaking(); // Stop any ongoing speech
    handleTextToSpeech(story); // Start speech synthesis from the beginning
  };

  // Clear the input field and generated story
  const handleClear = () => {
    setPrompt("");
    setStory("");
    setIsSpeaking(false);
    window.speechSynthesis.cancel(); // Stop any ongoing speech
  };

  // Download the generated story as a .txt file
  const handleDownloadText = () => {
    const blob = new Blob([story], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-story.txt"; // Name of the text file
    link.click(); // Trigger the download
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-100 via-teal-200 to-teal-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 rounded-3xl shadow-xl space-y-8">
        {/* Clear All Button moved to the top */}

        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-6">
          AI Story Generator
        </h1>
        <button
          onClick={handleClear}
          className="w-36 py-4 text-white font-semibold bg-gray-600 rounded-lg hover:bg-gray-700 transition duration-200 transform hover:scale-105 mb-6"
        >
          <FaTrash className="mr-2 inline" />
          Clear
        </button>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 shadow-md">
            <textarea
              className="w-full p-6 text-xl border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-300 ease-in-out"
              placeholder="Enter a story prompt..."
              value={prompt}
              onChange={handlePromptChange}
            />
          </div>

          <div className="flex space-x-6">
            <button
              onClick={handleGenerateStory}
              disabled={loading}
              className="w-full py-4 text-white font-semibold bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-teal-400 transition duration-200 transform hover:scale-105"
            >
              {loading ? "Generating..." : "Generate Story"}
            </button>
            <button
              onClick={handleStartListening}
              disabled={isListening}
              className="w-full py-4 text-white font-semibold bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition duration-200 transform hover:scale-105"
            >
              <FaMicrophone className="mr-2 inline" />
              {isListening ? "Listening..." : "Dictate Prompt"}
            </button>
          </div>

          {isListening && (
            <button
              onClick={handleStopListening}
              className="w-full py-4 text-white font-semibold bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 transform hover:scale-105"
            >
              <FaStop className="mr-2 inline" />
              Stop Listening
            </button>
          )}
        </div>

        {story && (
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg mt-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Your Story:
            </h2>
            <p className="text-gray-700 story-text fade-in">{story}</p>

            <div className="flex space-x-6 mt-6">
              <button
                onClick={isSpeaking ? handleStopSpeaking : handleRestartSpeech}
                className="w-full py-4 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-200 transform hover:scale-105"
              >
                <FaVolumeUp className="mr-2 inline" />
                {isSpeaking ? "Stop Listening" : "Listen to Story"}
              </button>

              <button
                onClick={handleStartFromBeginning}
                className="w-full py-4 text-white font-semibold bg-yellow-600 rounded-lg hover:bg-yellow-700 transition duration-200 transform hover:scale-105"
              >
                <FaRedo className="mr-2 inline" />
                Start From Beginning
              </button>

              {/* Download button */}
              <button
                onClick={handleDownloadText}
                className="w-full py-4 text-white font-semibold bg-purple-600 rounded-lg hover:bg-purple-700 transition duration-200 transform hover:scale-105"
              >
                <FaDownload className="mr-2 inline" />
                Download Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
