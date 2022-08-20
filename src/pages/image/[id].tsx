import { prisma } from "@/utils/prisma";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import Image from "next/image";
import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import Head from "next/head";

type ImageDetail = {
  id: number;
  location: string;
  description: string;
  source: string;
  image: string;
  tags: string[];
};

type Props = {
  image: ImageDetail;
};

const ImageDetailPage: NextPage<Props> = ({ image }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Head>
        <meta name="description" content={image.description} />
      </Head>
      <div className="flex-1 relative bg-black">
        <Image
          src={image.image}
          layout="fill"
          alt={image.description}
          objectFit="contain"
        />
      </div>
      <div className="w-full md:w-96 flex flex-col justify-center p-16 shadow-xl z-10">
        <p className="text-xl">{image.description}</p>
        <div className="flex flex-col mt-4">
          <div className="font-caption flex items-center space-x-1">
            <LocationMarkerIcon
              width={15}
              height={15}
              className="animate-bounce"
            />
            <span>{image.location}</span>
          </div>
        </div>
        <div className="flex mt-8 flex-wrap gap-2">
          {image.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-base-200 text-xs rounded-full px-4 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm mt-4">@{image.source}</div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  if (!id) {
    return {
      notFound: true
    };
  }

  const image = await prisma.image.findUnique({
    where: { id: parseInt(id as string) },
    include: {
      tags: true,
    },
  });

  if (!image) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      image: {
        id: image.id,
        location: image.location,
        description: image.description,
        source: image.source,
        image: image.image,
        tags: image.tags.map((tag) => tag.name),
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default ImageDetailPage;
