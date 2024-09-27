"use client"; // Add this line to convert to a Client Component

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react"; // Import useCallback and useMemo
import { generatePost } from "./actions"; // Import the Server Action

export default function Home() {
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [loading, setLoading] = useState(false); // Add loading state

  // Define isButtonActive based on whether all answers are filled
  const isAllAnswersFilled = Object.values(answers).every(
    (answer) => answer !== ""
  );

  const questions = useMemo(
    () => [
      // Wrap in useMemo
      {
        question: "Is this your first time in IT Sales Community?",
        name: "q1",
        options: ["yes", "no"],
      },
      {
        question: "Why did you joined the IT Sales Community Indore?",
        name: "q2",
        options: ["networking", "learning", "opportunities"],
      },
      {
        question: "Are you excited about today's talks with Arpit Jaiswal and Meetesh Shah?",
        name: "q3",
        options: ["yes", "no"],
      },
    ],
    []
  ); // Add empty dependency array

  const handleChange = (question, value) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const [content, setContent] = useState("");
  const generateContent = useCallback(async () => {
    // Wrap in useCallback
    setLoading(true); // Set loading to true
    try {
      // Create an array of question objects with answers
      const postContent = await generatePost(
        JSON.stringify(
          questions.map((q) => ({
            question: q.question,
            answer: answers[q.name],
          }))
        )
      );
      setContent(postContent);
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  }, [answers, questions]); // Add dependencies

  useEffect(() => {
    if (isAllAnswersFilled) {
      // Check if all answers are filled
      generateContent();
    }
  }, [isAllAnswersFilled, generateContent]);

  // function shareOnLinkedIn() {
  //   console.log(content, "kkk");
  //   window.open(
  //     `linkedin://share?shareActive=true&text=${encodeURIComponent(content)}`,
  //     "_blank"
  //   );
  // }

  function shareOnLinkedIn() {
    const feed = content
    const linkedInAppUrl = `linkedin://share?shareActive=true&text=${encodeURIComponent(feed)}`
    const linkedInWebUrl = `https://www.linkedin.com/shareArticle?mini=true&text=${encodeURIComponent(feed)}`;

    function isMobile() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      // iOS detection
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
      }
      // Android detection
      if (/android/i.test(userAgent)) {
        return "Android";
      }
      // Other cases are considered desktop
      return "Desktop";
    }

    const deviceType = isMobile();
    if (deviceType === "iOS") {
      window.location.href = linkedInAppUrl;
    } else {
      window.open(linkedInWebUrl, "_blank");
    }
  }


  return (
    <div className="p-2">
      <main className="flex justify-center items-center mt-4">
        {/* Questions with radio buttons */}
        <div className="">
          <div className="flex justify-center items-center">
            <img src="/images/logo.jpg" alt="IT Sales Community" />
          </div>
          {questions.map((q, index) => (
            <div
              key={index}
              className="py-2 px-3 my-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>
              {q.options.map((option) => (
                <div className="flex space-x-4 mt-2" key={option}>
                  <label className="flex items-center cursor-pointer py-2">
                    <input
                      type="radio"
                      name={q.name}
                      value={option}
                      onChange={() => handleChange(q.name, option)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          ))}
          {/* Add button to open LinkedIn */}
          <Button
            className="mt-5 w-full"
            onClick={shareOnLinkedIn}
            disabled={!isAllAnswersFilled || loading} // Disable if loading
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Share on LinkedIn"
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
