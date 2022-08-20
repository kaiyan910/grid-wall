import {
  ViewGridIcon,
  PlusCircleIcon,
  TrashIcon,
  PencilAltIcon,
  XIcon,
} from "@heroicons/react/solid";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PortalGrid = () => {
  const router = useRouter();
  const query = trpc.useQuery(["obtain-image"]);
  const deleteImageMutation = trpc.useMutation(["delete-image"]);

  const onDeleteImage = (id: number) => {
    deleteImageMutation.mutate({ id });
  };

  const onEditImage = (id: number) => {
    router.push(`/portal/image/${id}`);
  };

  useEffect(() => {
    if (deleteImageMutation.status === "success") {
      query.refetch();
    }
  }, [query, deleteImageMutation.status]);

  if (query.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <ViewGridIcon className="animate-spin" width={50} height={50} />
      </div>
    );
  }

  return (
    <section className="p-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 border border-base-200 m-16">
      <div
        className="flex border border-base-200 justify-center items-center min-h-[50px] cursor-pointer"
        onClick={() => router.push("/portal/image/create")}
      >
        <PlusCircleIcon width={24} height={24} />
      </div>
      {query.data?.map((image) => (
        <div key={image.id} className="group relative min-h-[300px] bg-cover">
          <Image
            src={image.image}
            layout="fill"
            alt={image.description}
            objectFit="cover"
          />
          <div className="flex items-center justify-center space-x-4 absolute inset-0 bg-black transition bg-opacity-0 group-hover:bg-opacity-50 cursor-pointer">
            <PencilAltIcon
              width={24}
              height={24}
              fill="#FFF"
              className="hidden group-hover:block"
              onClick={() => onEditImage(image.id)}
            />
            <XIcon
              width={24}
              height={24}
              fill="#FFF"
              className="hidden group-hover:block"
              onClick={() => onDeleteImage(image.id)}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default PortalGrid;
