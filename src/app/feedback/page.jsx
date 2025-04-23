
"use client";
import Image from "next/image";
import Logo from "../../../public/assets/logo.png";
import { SelectDemo } from "../../components/SelectDemo";
import React, { useRef } from "react";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";

// Define available issue types (unchanged)
const issueTypes = {
  delivery: {
    title: "Delivery",
    textPlaceholder: "សរសេរបញ្ហាការដឹកជញ្ជូននៅទីនេះរបស់អ្នកនៅទីនេះ...",
    hasVoice: true,
  },
  quality: {
    title: "Quality",
    textPlaceholder: "សរសេរបញ្ហាគុណភាពនៅទីនេះ...",
    hasVoice: true,
  },
  "payment settlement": {
    title: "Payment Settlement",
    textPlaceholder: "សរសេរបញ្ហាទូទាត់ប្រាក់នៅទីនេះ...",
    hasVoice: true,
  },
  salesman: {
    title: "Salesman",
    textPlaceholder: "សរសេរបញ្ហាអំពីអ្នកលក់នៅទីនេះ...",
    hasVoice: true,
  },
  competitors: {
    title: "Competitors",
    textPlaceholder: "សរសេរបញ្ហាអំពីគូប្រជែងនៅទីនេះ...",
    hasVoice: true,
  },
  merchandising: {
    title: "Merchandising",
    textPlaceholder: "សរសេរបញ្ហាអំពីការធ្វើទីផ្សារនៅទីនេះ...",
    hasVoice: true,
  },
  "resources trade tools": {
    title: "Resources Trade Tools",
    textPlaceholder: "សរសេរបញ្ហាអំពីឧបករណ៍ធនធាន/ពាណិជ្ជកម្មនៅទីនេះ...",
    hasVoice: true,
  },
};

const normalizeIssueKey = (issueKey) => {
  return issueKey.replace(/\s+/g, "_").toLowerCase();
};

// IssueSection component 
function IssueSection({
  issueKey,
  title,
  textPlaceholder,
  hasVoice,
  onDelete,
  onUpdate,
  sectionRef,
}) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioURL, setAudioURL] = React.useState(null);
  const [audioBlob, setAudioBlob] = React.useState(null);
  const [mediaRecorder, setMediaRecorder] = React.useState(null);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [showAudioOptions, setShowAudioOptions] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState([]);

  const normalizedIssueKey = normalizeIssueKey(issueKey);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(audioChunks, { type: "audio/aac" });
        if (recordedBlob.size > 0) {
          const url = URL.createObjectURL(recordedBlob);
          setAudioBlob(recordedBlob);
          setAudioURL(url);
          onUpdate(issueKey, { description, images, audioBlob: recordedBlob, audioURL: url });
        }
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      setTimeout(() => {
        if (recorder.state === "recording") {
          stopRecording();
        }
      }, 30000);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording.");
    }
  };

 

  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setImages(files);
    onUpdate(issueKey, { description, images: files, audioURL });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    onUpdate(issueKey, { description: e.target.value, images, audioURL });
  };

  const handleDeleteAudio = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setAudioBlob(null);
      setShowAudioOptions(false);
      onUpdate(issueKey, { description, images, audioBlob: null, audioURL: null });
    }
  };


  const handleDownloadAudio = () => {
    if (audioURL) {
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = `${normalizedIssueKey}-recording.aac`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
};


  const handleDeleteImage = (previewURL) => {
    setImagePreviews((prev) => {
      const updatedPreviews = prev.filter((url) => url !== previewURL);
      URL.revokeObjectURL(previewURL);
      return updatedPreviews;
    });
    const updatedImages = images.filter(
      (_, index) => imagePreviews[index] !== previewURL
    );
    setImages(updatedImages);
    onUpdate(issueKey, { description, images: updatedImages, audioURL });
  };

  return (
    <div ref={sectionRef} className="bg-gray-100 rounded-2xl p-5 relative">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-main text-xl">{title}</h2>
        <button
          type="button"
          onClick={() => onDelete(issueKey)}
          className="text-main hover:text-red-700 focus:outline-none"
          aria-label={`Remove ${title}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${normalizedIssueKey}-description`} className="block mb-2 text-sm font-medium text-main text-left">
            សរសេរជាអក្សរ
          </label>
          <Textarea
            placeholder={textPlaceholder}
            className="bg-white"
            value={description}
            onChange={handleDescriptionChange}
          />
        </div>
        {hasVoice && (
          <div>
            <label htmlFor={`${normalizedIssueKey}-voice_feedback`} className="block mb-2 text-sm font-medium text-main text-left">
              ផ្ញើជាសំឡេង
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center justify-center w-full h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl cursor-pointer hover:bg-gray-100 ${isRecording ? "bg-red-100" : ""}`}
              >
                {isRecording ? (
                  <>
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="6" width="12" height="12" fill="#EF4444" />
                    </svg>
                    <span className="ml-2">បញ្ឈប់</span>
                  </>
                ) : (
                  <>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12.5 19.3369C15.8137 19.3369 18.5 16.6506 18.5 13.3369V11.8369M12.5 19.3369C9.18629 19.3369 6.5 16.6506 6.5 13.3369V11.8369M12.5 19.3369V23.0869M8.75 23.0869H16.25M12.5 16.3369C10.8431 16.3369 9.5 14.9938 9.5 13.3369V5.08691C9.5 3.43006 10.8431 2.08691 12.5 2.08691C14.1569 2.08691 15.5 3.43006 15.5 5.08691V13.3369C15.5 14.9938 14.1569 16.3369 12.5 16.3369Z"
                        stroke="#B4C2C8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="ml-2">ថតសំឡេង</span>
                  </>
                )}
              </button>
            </div>
            {audioURL && (
              <div className="mt-2 relative">
                <div className="flex items-center space-x-2">
                  <audio controls src={audioURL} className="w-full" />
                  <button
                    type="button"
                    onClick={() => setShowAudioOptions(!showAudioOptions)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="5" r="2" fill="currentColor" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <circle cx="12" cy="19" r="2" fill="currentColor" />
                    </svg>
                  </button>
                </div>
                {showAudioOptions && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button
                      type="button"
                      onClick={handleDownloadAudio}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAudio}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div>
          <label htmlFor={`${normalizedIssueKey}-picture-upload`} className="block mb-2 text-sm font-medium text-main text-left">
            ផ្ញើជារូបភាព
          </label>
          <div className="overflow-x-auto mb-3">
            <div className="flex flex-nowrap space-x-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={preview}
                    alt={`Uploaded preview ${index + 1}`}
                    className="w-20 h-15 object-cover rounded-md border border-gray-300 hover:shadow-md transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(preview)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 focus:outline-none"
                    aria-label={`Delete image ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center w-full h-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl cursor-pointer hover:bg-gray-100">
            <div className="flex flex-col items-center">
              <label htmlFor={`${normalizedIssueKey}-picture-upload`}>
                <div className="flex flex-col items-center">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10.123 9.61C10.1084 9.59132 10.0897 9.57622 10.0684 9.56583C10.0471 9.55545 10.0237 9.55005 9.99994 9.55005C9.97623 9.55005 9.95283 9.55545 9.93151 9.56583C9.91019 9.57622 9.89151 9.59132 9.8769 9.61L7.6894 12.3776C7.67136 12.4006 7.66017 12.4282 7.65711 12.4573C7.65404 12.4864 7.65922 12.5158 7.67206 12.5421C7.6849 12.5684 7.70487 12.5905 7.72969 12.606C7.75452 12.6214 7.7832 12.6296 7.81244 12.6295H9.2558V17.3639C9.2558 17.4498 9.32612 17.5202 9.41205 17.5202H10.5839C10.6699 17.5202 10.7402 17.4498 10.7402 17.3639V12.6315H12.1874C12.3183 12.6315 12.3906 12.4811 12.3105 12.3795L10.123 9.61Z"
                      fill="black"
                    />
                    <path
                      d="M15.8477 7.80725C14.9531 5.44788 12.6738 3.77014 10.0039 3.77014C7.33398 3.77014 5.05469 5.44592 4.16016 7.8053C2.48633 8.24475 1.25 9.77014 1.25 11.5826C1.25 13.7408 2.99805 15.4889 5.1543 15.4889H5.9375C6.02344 15.4889 6.09375 15.4186 6.09375 15.3326V14.1608C6.09375 14.0748 6.02344 14.0045 5.9375 14.0045H5.1543C4.49609 14.0045 3.87695 13.7428 3.41602 13.2682C2.95703 12.7955 2.71289 12.1588 2.73438 11.4987C2.75195 10.983 2.92773 10.4987 3.24609 10.0905C3.57227 9.67444 4.0293 9.3717 4.53711 9.23694L5.27734 9.04358L5.54883 8.32874C5.7168 7.88342 5.95117 7.46741 6.24609 7.09045C6.53725 6.71684 6.88214 6.3884 7.26953 6.11584C8.07227 5.55139 9.01758 5.25256 10.0039 5.25256C10.9902 5.25256 11.9355 5.55139 12.7383 6.11584C13.127 6.38928 13.4707 6.71741 13.7617 7.09045C14.0566 7.46741 14.291 7.88538 14.459 8.32874L14.7285 9.04163L15.4668 9.23694C16.5254 9.52209 17.2656 10.485 17.2656 11.5826C17.2656 12.2291 17.0137 12.8385 16.5566 13.2955C16.3325 13.521 16.0659 13.6997 15.7722 13.8214C15.4785 13.9431 15.1636 14.0054 14.8457 14.0045H14.0625C13.9766 14.0045 13.9062 14.0748 13.9062 14.1608V15.3326C13.9062 15.4186 13.9766 15.4889 14.0625 15.4889H14.8457C17.002 15.4889 18.75 13.7408 18.75 11.5826C18.75 9.77209 17.5176 8.24866 15.8477 7.80725Z"
                      fill="black"
                    />
                  </svg>
                  <p className="text-center mt-2">អាចដាក់បានលើសពី ២ រូបភាព</p>
                </div>
              </label>
            </div>
          </div>
          <Input
            id={`${normalizedIssueKey}-picture-upload`}
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
}

export default function AssueForm() {
  const router = useRouter();
  const [selectedIssues, setSelectedIssues] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: "",
    phone_number: "",
    address: "",
    issues: {},
  });
  const [errors, setErrors] = React.useState({ phone_number: "", address: "" });

  const issueRefs = useRef({});

  const validateForm = () => {
    const newErrors = { phone_number: "", address: "" };
    let isValid = true;

    const phoneRegex = /^(?:\+855|0)[1-9]\d{7,8}$/;
    if (!formData.phone_number) {
      newErrors.phone_number = "លេខទូរសព្ទត្រូវបំពេញ";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone_number)) {
      newErrors.phone_number = "លេខទូរសព្ទមិនត្រឹមត្រូវ (ឧ. +85512345678 ឬ 0712345678)";
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = "សូមជ្រើសរើសខេត្ត";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleAddressChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
    setErrors((prev) => ({
      ...prev,
      address: "",
    }));
  };

  const handleIssueUpdate = (issueKey, issueData) => {
    setFormData((prev) => {
      const updatedIssues = {
        ...prev.issues,
        [issueKey]: {
          ...prev.issues[issueKey],
          ...issueData,
        },
      };
      return {
        ...prev,
        issues: updatedIssues,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("address", formData.address);

    const issuesArray = Object.entries(formData.issues);
    for (let [index, [issueKey, issueData]] of issuesArray.entries()) {
      const normalizedIssueKey = normalizeIssueKey(issueKey);
      formDataToSend.append(`feedback_details[${index}][feedback_type]`, issueKey);
      if (issueData.description) {
        formDataToSend.append(`feedback_details[${index}][description]`, issueData.description);
      }
      if (issueData.audioBlob) {
        formDataToSend.append(
          `feedback_details[${index}][voice_feedback]`,
          issueData.audioBlob,
          `${normalizedIssueKey}-recording.webm`
        );
      }
      if (issueData.images && issueData.images.length > 0) {
        issueData.images.forEach((image, imgIndex) => {
          formDataToSend.append(`feedback_details[${index}][photos][]`, image);
        });
      }
      
    }

    try {
      const response = await fetch(
        "http://10.0.12.247:85/services/emp/customer-care/api/feedback/submit/",
        {
          method: "POST",
          body: formDataToSend,
         
        }
      );

      const responseData = await response.json();
      const telegram_link = responseData.telegram_link;

      if (response.ok) {
        Object.values(formData.issues).forEach((issueData) => {
          if (issueData.audioURL) {
            URL.revokeObjectURL(issueData.audioURL);
          }
        });
        setFormData({ name: "", phone_number: "", address: "", issues: {} });
        setSelectedIssues([]);
        router.push(`/feedback/success-submit?telegram_link=${encodeURIComponent(telegram_link)}`);
      } else {
        console.error("Server error:", responseData);
        alert(`Failed to submit: ${responseData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Check your connection.");
    }
  };

 
  
  const handleIssueChange = (value) => {
    if (value && issueTypes[value] && !selectedIssues.includes(value)) {
      setSelectedIssues((prev) => {
        const newIssues = [...prev, value];
        // Use setTimeout to ensure the DOM updates before scrolling
        setTimeout(() => {
          const newIssueRef = issueRefs.current[value];
          if (newIssueRef && newIssueRef.current) {
            newIssueRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 0);
        return newIssues;
      });
    }
  };

  const handleDeleteIssue = (issueKey) => {
    setSelectedIssues((prev) => prev.filter((key) => key !== issueKey));
    setFormData((prev) => {
      const newIssues = { ...prev.issues };
      delete newIssues[issueKey];
      return { ...prev, issues: newIssues };
    });
  };

  return (
    <div className="lg:w-full h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-sm lg:w-[600px] w-[350px] opacity-90">
        <form className="lg:p-15 p-5 w-full" onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[50vh] overflow-y-auto">
            <div className="text-center">
              <h1 className="lg:text-xl text-lg text-main">សូមស្វាគមន៍មកកាន់</h1>
              <div className="flex justify-center mt-2">
                <Image width={100} height={100} src={Logo} alt="Background" objectFit="cover" />
              </div>
              <p className="text-main mt-3">រីករាយក្នុងការជួយដោះស្រាយបញ្ហារបស់អ្នក</p>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-main text-left">
                  ឈ្មោះ (Optional)
                </label>
                <Input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-full p-2.5"
                  placeholder="ឈ្មោះរបស់អ្នក"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-main text-left">
                  លេខទូរសព្ទ (Telegram)
                </label>
                <Input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl block w-full p-2.5"
                  placeholder="លេខទូរសព្ទ"
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.phone_number}</p>
                )}
              </div>
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 text-main text-left">
                  អាសយដ្ឋាន
                </label>
                <Select onValueChange={handleAddressChange} value={formData.address}>
                  <SelectTrigger className="bg-gray-50 border border-gray-300 text-sm rounded-xl w-full py-5 flex">
                    <SelectValue placeholder="សូមជ្រើសរើសខេត្ត" />
                    <svg width="17" height="10" viewBox="0 0 17 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.25 1.25L8.75 8.75L1.25 1.25" stroke="#B4C2C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>ខេត្ត</SelectLabel>
                      <SelectItem value="បន្ទាយមានជ័យ">បន្ទាយមានជ័យ</SelectItem>
                      <SelectItem value="បាត់ដំបង">បាត់ដំបង</SelectItem>
                      <SelectItem value="កំពង់ចាម">កំពង់ចាម</SelectItem>
                      <SelectItem value="កំពង់ឆ្នាំង">កំពង់ឆ្នាំង</SelectItem>
                      <SelectItem value="កំពង់ស្ពឺ">កំពង់ស្ពឺ</SelectItem>
                      <SelectItem value="កំពង់ធំ">កំពង់ធំ</SelectItem>
                      <SelectItem value="កណ្តាល">កណ្តាល</SelectItem>
                      <SelectItem value="កែប">កែប</SelectItem>
                      <SelectItem value="កោះកុង">កោះកុង</SelectItem>
                      <SelectItem value="ក្រចេះ">ក្រចេះ</SelectItem>
                      <SelectItem value="មណ្ឌលគិរី">មណ្ឌលគិរី</SelectItem>
                      <SelectItem value="ឧត្តរមានជ័យ">ឧត្តរមានជ័យ</SelectItem>
                      <SelectItem value="ប៉ៃលិន">ប៉ៃលិន</SelectItem>
                      <SelectItem value="ភ្នំពេញ">ភ្នំពេញ</SelectItem>
                      <SelectItem value="ព្រះសីហនុ">ព្រះសីហនុ</SelectItem>
                      <SelectItem value="ព្រះវិហារ">ព្រះវិហារ</SelectItem>
                      <SelectItem value="ព្រៃវែង">ព្រៃវែង</SelectItem>
                      <SelectItem value="រតនគិរី">រតនគិរី</SelectItem>
                      <SelectItem value="សៀមរាប">សៀមរាប</SelectItem>
                      <SelectItem value="ស្ទឹងត្រែង">ស្ទឹងត្រែង</SelectItem>
                      <SelectItem value="ស្វាយរៀង">ស្វាយរៀង</SelectItem>
                      <SelectItem value="តាកែវ">តាកែវ</SelectItem>
                      <SelectItem value="ត្បូងឃ្មុំ">ត្បូងឃ្មុំ</SelectItem>
                      <SelectItem value="កំពត">កំពត</SelectItem>
                      <SelectItem value="ពោធិ៍សាត់">ពោធិ៍សាត់</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.address}</p>
                )}
              </div>

              {selectedIssues.map((issueKey) => {
                const issue = issueTypes[issueKey];
                if (!issue) {
                  console.error(`Issue type not found: ${issueKey}`);
                  return null;
                }
                if (!issueRefs.current[issueKey]) {
                  issueRefs.current[issueKey] = React.createRef();
                }
                return (
                  <IssueSection
                    key={issueKey}
                    issueKey={issueKey}
                    title={issue.title}
                    textPlaceholder={issue.textPlaceholder}
                    hasVoice={issue.hasVoice}
                    onDelete={handleDeleteIssue}
                    onUpdate={handleIssueUpdate}
                    sectionRef={issueRefs.current[issueKey]}
                  />
                );
              })}
            </div>
          </ScrollArea>

          <div className="mt-6">
            <SelectDemo onValueChange={handleIssueChange} />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-main lg:text-base text-sm">លេខទូរសព្ទទំនាក់ទំនងមកកាន់ក្រុមហ៊ុន</h1>
            <p className="text-main text-gray-600 mb-3 lg:text-sm text-xs">+855 23 233 333</p>
            <button
              type="submit"
              className="text-white bg-main hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-4xl text-xs lg:text-sm px-10 py-3"
            >
              បញ្ជូន
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}