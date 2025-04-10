import Image from 'next/image';
import ImageNotFound from '../../public/assets/not-page.webp'; 

export default function Not_found() {
  return (
    <div className="lg:mb-56 w-full h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 lg:w-[600px] lg:h-[400px] flex flex-col justify-center items-center text-center w-11/12">
        <Image
          src={ImageNotFound}
          alt="Not Found"
          width={300}
          height={300}
          style={{ objectFit: 'contain' }}
          className=""
        />
        <div>
          <p className="text-main font-bold text-lg">មិនមានទិន្នន័យ</p>
        </div>
      </div>
    </div>
  );
}