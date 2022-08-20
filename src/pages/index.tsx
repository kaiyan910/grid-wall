import { trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  const query = trpc.useQuery(["obtain-image"]);

  return (
    <div className="h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8">
        {query.data?.map((image) => (
          <div
            key={image.id}
            className="group min-h-[calc(100vh_/_4)] relative bg-cover hover:shadow-lg hover:z-50 hover:cursor-pointer"
            onClick={() => router.push(`/image/${image.id}`)}
          >
            <Image
              src={image.image}
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
