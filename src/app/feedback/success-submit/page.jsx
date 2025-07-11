"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// Component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const [telegramLink, setTelegramLink] = useState(null);

  // Extract telegram_link from query parameters
  useEffect(() => {
    const telegram_link = searchParams.get("telegram_link");
    setTelegramLink(telegram_link);
  }, [searchParams]);

  // Handle Telegram button click
  const handleTelegramClick = () => {
    if (telegramLink) {
      window.location.href = telegramLink;
    } else {
      console.log("No Telegram link available");
    }
  };

  return (
    <div className="lg:mb-56 w-full h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-80 lg:w-[600px] lg:h-[400px] flex flex-col justify-center items-center text-center w-full bg-cover bg-center">
        {/* Image */}
        <div className="lg:mb-6 mt-2">
          <svg
            className="lg:w-28 lg:h-28 w-20 h-20"
            viewBox="0 0 122 122"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.0625 61C0.0625 27.3451 27.3451 0.0625 61 0.0625C94.6548 0.0625 121.938 27.3451 121.938 61C121.938 94.6548 94.6548 121.938 61 121.938C27.3451 121.938 0.0625 94.6548 0.0625 61ZM83.5644 49.6621C85.0691 47.5554 84.5812 44.6279 82.4746 43.1231C80.3679 41.6184 77.4403 42.1063 75.9356 44.2129L55.7143 72.5227L45.5646 62.3729C43.734 60.5424 40.766 60.5424 38.9354 62.3729C37.1049 64.2035 37.1049 67.1715 38.9354 69.0021L52.9979 83.0646C53.9723 84.0389 55.3259 84.5352 56.6991 84.4215C58.0723 84.3079 59.326 83.5958 60.1269 82.4746L83.5644 49.6621Z"
              fill="#08B69B"
            />
          </svg>
        </div>
        <p className="text-main mt-5 text-lg lg:text-xl">
          ចុចចំណលីងដើម្បីតាមដានដំណើរការ
        </p>
        <p className="text-main text-lg lg:text-xl">ការដោះស្រាយ</p>
        <button
          type="button"
          onClick={handleTelegramClick}
          className="text-white mt-5 bg-main hover:bg-blue-800 focus:ring-4 flex focus:ring-blue-300 font-medium rounded-xl text-xs lg:text-sm px-10 py-3 me-2"
          disabled={!telegramLink}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <g clipPath="url(#clip0_318_61)">
              <path
                d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
                fill="url(#paint0_linear_318_61)"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8638 23.7466C17.8603 20.6984 22.5257 18.6888 24.8601 17.7179C31.5251 14.9456 32.91 14.4641 33.8127 14.4482C34.0113 14.4447 34.4552 14.4939 34.7427 14.7272C34.9855 14.9242 35.0523 15.1904 35.0843 15.3771C35.1163 15.5639 35.1561 15.9895 35.1244 16.3219C34.7633 20.1169 33.2004 29.3263 32.4053 33.5767C32.0689 35.3752 31.4065 35.9783 30.7652 36.0373C29.3714 36.1655 28.3131 35.1162 26.9632 34.2313C24.8509 32.8467 23.6576 31.9847 21.6072 30.6336C19.2377 29.0721 20.7738 28.2139 22.1242 26.8113C22.4776 26.4442 28.6183 20.8587 28.7372 20.352C28.7521 20.2886 28.7659 20.0524 28.6255 19.9277C28.4852 19.803 28.2781 19.8456 28.1286 19.8795C27.9168 19.9276 24.5423 22.158 18.0053 26.5707C17.0475 27.2284 16.1799 27.5489 15.4026 27.5321C14.5457 27.5135 12.8973 27.0475 11.6719 26.6492C10.1689 26.1606 8.97432 25.9023 9.07834 25.0726C9.13252 24.6404 9.72767 24.1984 10.8638 23.7466Z"
                fill="white"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_318_61"
                x1="24"
                y1="0"
                x2="24"
                y2="47.644"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#2AABEE" />
                <stop offset="1" stopColor="#229ED9" />
              </linearGradient>
              <clipPath id="clip0_318_61">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Telegram
        </button>
      </div>
    </div>
  );
}

// Page component with Suspense boundary
const SuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;