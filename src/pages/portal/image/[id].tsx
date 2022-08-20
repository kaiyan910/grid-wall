import PortalWrapper from "@/components/portal-wrapper";
import { trpc } from "@/utils/trpc";
import { ViewGridIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import PortalCreatePage from "./create";

const PortalDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const imageId = parseInt(id as string);
  const query = trpc.useQuery(["obtain-image-by-id", { id: imageId }]);

  if (query.isLoading) {
    return (
      <PortalWrapper>
        <div className="flex-1 flex items-center justify-center w-full h-full">
          <ViewGridIcon className="animate-spin" width={50} height={50} />
        </div>
      </PortalWrapper>
    );
  }

  return <PortalCreatePage image={query.data} />;
};

export default PortalDetailsPage;
