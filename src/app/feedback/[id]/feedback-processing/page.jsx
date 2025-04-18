
"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useParams } from "next/navigation";

const ProcessingPage = () => {
  const params = useParams();
  const id = params?.id; // This is the UUID from the URL
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("");
  const [availableFeedbackTypes, setAvailableFeedbackTypes] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(
          // `http://10.0.8.209:8381/customer-care/api/feedback/track/${id}/`,
          `http://10.0.12.247:85/services/emp/customer-care/api/feedback/track/${id}/`,
         
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const data = await response.json();
        setFeedbackData(data);

        // Extract all feedback types from feedback_details
        const types =
          data?.feedback_details?.map((detail) => detail.feedback_type) || [];
        setAvailableFeedbackTypes(types);

        // Set the initial selected type (e.g., the first one)
        if (types.length > 0) {
          setSelectedFeedbackType(types[0]);
        } else {
          setSelectedFeedbackType("");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id]);

  // Determine the current step based on status
  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case "report":
        return 1;
      case "pending": // Map "pending" to "Review" for display
        return 2;
      case "in progress":
      case "pending": // Map "pending" to "in progress"
        return 3;
      case "done":
      case "completed": // Map "completed" to "done"
        return 4;
      default:
        return 1; // Default to "report" if status is unknown
    }
  };

  // Find the feedback detail that matches the selected feedback type
  const selectedFeedbackDetail =
    feedbackData?.feedback_details?.find(
      (detail) => detail.feedback_type === selectedFeedbackType
    ) || feedbackData?.feedback_details?.[0];

  // Use the status from the selected feedback detail
  const status = selectedFeedbackDetail?.status || "report";
  const currentStep = getStatusStep(status);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Define the feedback type mapping
  const feedbackTypeMap = {
    delivery: "Delivery",
    quality: "Quality",
    "payment settlement": "Payment Settlement",
    salesman: "Salesman",
    competitors: "Competitors",
    merchandising: "Merchandising",
    "resources trade tools": "Resource/Trade Tools",
  };

  return (
    <div className="w-full h-screen flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md lg:max-w-[600px] flex flex-col justify-center items-center text-center">
        <h1 className="text-main font-bold text-lg lg:text-xl">
          Processing of Issue
        </h1>
        <div className="flex mt-2">
          <h3 className="text-main text-base lg:text-xl mt-2 pr-3">
            Issue Type:
          </h3>
          <Select
            value={selectedFeedbackType}
            onValueChange={(value) => setSelectedFeedbackType(value)}
          >
            <SelectTrigger className="w-[140px] mt-1">
              <SelectValue placeholder="Type" />
              <svg
                width="12"
                height="8"
                viewBox="0 0 17 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.25 1.25L8.75 8.75L1.25 1.25"
                  stroke="#B4C2C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableFeedbackTypes.length > 0 ? (
                  availableFeedbackTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {feedbackTypeMap[type] || "Unknown Type"}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">
                    No feedback types available
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Processing Line Block for Laptop (Hidden on Mobile) */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-[70px] mt-20">
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V12.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 15.75H12.0075V15.7575H12V15.75Z"
                  stroke="#0D394F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-main text-sm font-medium">Report</p>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 13.125V10.5C16 8.63604 14.489 7.125 12.625 7.125H11.125C10.5037 7.125 10 6.62132 10 6V4.5C10 2.63604 8.48896 1.125 6.625 1.125H4.75M9.98116 14.6062L11.5 16.125M7 1.125H2.125C1.50368 1.125 1 1.62868 1 2.25V18.75C1 19.3713 1.50368 19.875 2.125 19.875H14.875C15.4963 19.875 16 19.3713 16 18.75V10.125C16 5.15444 11.9706 1.125 7 1.125ZM10.75 12.75C10.75 14.1997 9.57475 15.375 8.125 15.375C6.67525 15.375 5.5 14.1997 5.5 12.75C5.5 11.3003 6.67525 10.125 8.125 10.125C9.57475 10.125 10.75 11.3003 10.75 12.75Z"
                  stroke="#0D394F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-main text-sm font-medium">Review</p>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6V12H16.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#0D394F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-main text-sm font-medium">Progress</p>
            </div>
            <div className="flex items-center gap-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="#0D394F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-main text-sm font-medium">Done</p>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-5">
            {/* Step 1 */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.7417 15C2.7417 8.26903 8.06067 2.8125 14.622 2.8125C21.1832 2.8125 26.5022 8.26903 26.5022 15C26.5022 21.731 21.1832 27.1875 14.622 27.1875C8.06067 27.1875 2.7417 21.731 2.7417 15ZM19.0211 12.7324C19.3144 12.3111 19.2193 11.7256 18.8086 11.4246C18.3979 11.1237 17.8271 11.2213 17.5338 11.6426L13.5915 17.3045L11.6127 15.2746C11.2558 14.9085 10.6772 14.9085 10.3203 15.2746C9.9634 15.6407 9.9634 16.2343 10.3203 16.6004L13.0619 19.4129C13.2518 19.6078 13.5157 19.707 13.7835 19.6843C14.0512 19.6616 14.2956 19.5192 14.4517 19.2949L19.0211 12.7324Z"
                fill={currentStep >= 1 ? "#08B69B" : "#99a1af"}
              />
            </svg>
            <div className="flex-1 bg-gray-200 rounded-full h-1 dark:bg-gray-700">
              <div
                className={`h-1 rounded-full ${
                  currentStep >= 2 ? "bg-green w-full" : "bg-gray-400 w-0"
                }`}
              ></div>
            </div>
            {/* Step 2 */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.7417 15C2.7417 8.26903 8.06067 2.8125 14.622 2.8125C21.1832 2.8125 26.5022 8.26903 26.5022 15C26.5022 21.731 21.1832 27.1875 14.622 27.1875C8.06067 27.1875 2.7417 21.731 2.7417 15ZM19.0211 12.7324C19.3144 12.3111 19.2193 11.7256 18.8086 11.4246C18.3979 11.1237 17.8271 11.2213 17.5338 11.6426L13.5915 17.3045L11.6127 15.2746C11.2558 14.9085 10.6772 14.9085 10.3203 15.2746C9.9634 15.6407 9.9634 16.2343 10.3203 16.6004L13.0619 19.4129C13.2518 19.6078 13.5157 19.707 13.7835 19.6843C14.0512 19.6616 14.2956 19.5192 14.4517 19.2949L19.0211 12.7324Z"
                fill={currentStep >= 2 ? "#08B69B" : "#99a1af"}
              />
            </svg>
            <div className="flex-1 bg-gray-200 rounded-full h-1 dark:bg-gray-700">
              <div
                className={`h-1 rounded-full ${
                  currentStep >= 3 ? "bg-green w-full" : "bg-gray-400 w-0"
                }`}
              ></div>
            </div>
            {/* Step 3 */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.7417 15C2.7417 8.26903 8.06067 2.8125 14.622 2.8125C21.1832 2.8125 26.5022 8.26903 26.5022 15C26.5022 21.731 21.1832 27.1875 14.622 27.1875C8.06067 27.1875 2.7417 21.731 2.7417 15ZM19.0211 12.7324C19.3144 12.3111 19.2193 11.7256 18.8086 11.4246C18.3979 11.1237 17.8271 11.2213 17.5338 11.6426L13.5915 17.3045L11.6127 15.2746C11.2558 14.9085 10.6772 14.9085 10.3203 15.2746C9.9634 15.6407 9.9634 16.2343 10.3203 16.6004L13.0619 19.4129C13.2518 19.6078 13.5157 19.707 13.7835 19.6843C14.0512 19.6616 14.2956 19.5192 14.4517 19.2949L19.0211 12.7324Z"
                fill={currentStep >= 3 ? "#08B69B" : "#99a1af"}
              />
            </svg>
            <div className="flex-1 bg-gray-200 rounded-full h-1 dark:bg-gray-700">
              <div
                className={`h-1 rounded-full ${
                  currentStep >= 4 ? "bg-green w-full" : "bg-gray-400 w-0"
                }`}
              ></div>
            </div>
            {/* Step 4 */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.7417 15C2.7417 8.26903 8.06067 2.8125 14.622 2.8125C21.1832 2.8125 26.5022 8.26903 26.5022 15C26.5022 21.731 21.1832 27.1875 14.622 27.1875C8.06067 27.1875 2.7417 21.731 2.7417 15ZM19.0211 12.7324C19.3144 12.3111 19.2193 11.7256 18.8086 11.4246C18.3979 11.1237 17.8271 11.2213 17.5338 11.6426L13.5915 17.3045L11.6127 15.2746C11.2558 14.9085 10.6772 14.9085 10.3203 15.2746C9.9634 15.6407 9.9634 16.2343 10.3203 16.6004L13.0619 19.4129C13.2518 19.6078 13.5157 19.707 13.7835 19.6843C14.0512 19.6616 14.2956 19.5192 14.4517 19.2949L19.0211 12.7324Z"
                fill={currentStep >= 4 ? "#08B69B" : "#99a1af"}
              />
            </svg>
          </div>
        </div>

        {/* Processing Line Block for Mobile (Hidden on Laptop) */}
        <div className="block lg:hidden">
          <div className="items-center gap-1 mt-5">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center mt-1">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="15"
                    fill={currentStep >= 1 ? "#08B69B" : "#99a1af"}
                  />
                  <path
                    d="M9 15.5L13 19.5L21 11.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className={`h-16 w-1 mt-2 rounded-full ${
                    currentStep >= 2 ? "bg-[#08B69B]" : "bg-[#99a1af]"
                  }`}
                ></div>
              </div>
              <div className="flex items-center gap-1 mb-16">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 9V12.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 15.75H12.0075V15.7575H12V15.75Z"
                    stroke="#0D394F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-main text-sm font-medium">Report</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center mt-1">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="15"
                    fill={currentStep >= 2 ? "#08B69B" : "#99a1af"}
                  />
                  <path
                    d="M9 15.5L13 19.5L21 11.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className={`h-32 w-1 mt-2 rounded-full ${
                    currentStep >= 3 ? "bg-[#08B69B]" : "bg-[#99a1af]"
                  }`}
                ></div>
              </div>
              <div className="flex items-center gap-1 mb-32">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 13.125V10.5C16 8.63604 14.489 7.125 12.625 7.125H11.125C10.5037 7.125 10 6.62132 10 6V4.5C10 2.63604 8.48896 1.125 6.625 1.125H4.75M9.98116 14.6062L11.5 16.125M7 1.125H2.125C1.50368 1.125 1 1.62868 1 2.25V18.75C1 19.3713 1.50368 19.875 2.125 19.875H14.875C15.4963 19.875 16 19.3713 16 18.75V10.125C16 5.15444 11.9706 1.125 7 1.125ZM10.75 12.75C10.75 14.1997 9.57475 15.375 8.125 15.375C6.67525 15.375 5.5 14.1997 5.5 12.75C5.5 11.3003 6.67525 10.125 8.125 10.125C9.57475 10.125 10.75 11.3003 10.75 12.75Z"
                    stroke="#0D394F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-main text-sm font-medium">Review</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center mt-1">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="15"
                    fill={currentStep >= 3 ? "#08B69B" : "#99a1af"}
                  />
                  <path
                    d="M9 15.5L13 19.5L21 11.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div
                  className={`h-20 w-1 mt-2 rounded-full ${
                    currentStep >= 4 ? "bg-[#08B69B]" : "bg-[#99a1af]"
                  }`}
                ></div>
              </div>
              <div className="flex items-center gap-1 mb-20">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6V12H16.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#0D394F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-main text-sm font-medium">Progress</p>
              </div>
            </div>
            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center mt-1">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="15"
                    cy="15"
                    r="15"
                    fill={currentStep >= 4 ? "#08B69B" : "#99a1af"}
                  />
                  <path
                    d="M9 15.5L13 19.5L21 11.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="#0D394F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-main text-sm font-medium">Done</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ProcessingPage;
