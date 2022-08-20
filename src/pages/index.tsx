import { trpc } from "@/utils/trpc";
import { ViewGridIcon } from "@heroicons/react/solid";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const query = trpc.useQuery(["obtain-image"]);

  if (query.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center w-full">
        <ViewGridIcon className="animate-spin" width={50} height={50} />
      </div>
    );
  }

  if (query.data && query.data.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center w-full space-y-8">
        <div className="flex items-center space-x-2">
          <ViewGridIcon
            className="animate-spin base-content"
            width="12"
            height="12"
          />
          <span className="font-logo text-4xl">Grid Wall</span>
        </div>
        <p>未有圖片</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 md:grid-cols-6">
        {query.data?.map((image) => (
          <div
            key={image.id}
            className="group min-h-[calc(100vh_/_4)] relative bg-cover hover:shadow-lg hover:z-50 hover:cursor-pointer"
            onClick={() => router.push(`/image/${image.id}`)}
          >
            <Image
              src={image.thumbnail}
              layout="fill"
              alt={image.description}
              objectFit="cover"
            />

            <div className="absolute inset-0 bg-black transition bg-opacity-30 group-hover:bg-opacity-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
