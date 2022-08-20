import { ViewGridIcon, LogoutIcon } from "@heroicons/react/solid";
import { signOut } from "next-auth/react";

const PortalNavBar = () => {
  return (
    <nav className="w-full px-16 py-8">
      <div className="flex items-center justify-between">
        {/** LOGO */}
        <div className="flex items-center space-x-2">
          <ViewGridIcon
            className="animate-spin base-content"
            width="12"
            height="12"
          />
          <span className="font-logo text-4xl">Grid Wall</span>
        </div>
        {/** MENU */}
        <div className="flex space-x-8">
          <div
            className="flex space-x-2 items-center hover:bg-base-300 py-2 px-4 cursor-pointer rounded-full"
            onClick={() => signOut()}
          >
            <LogoutIcon width={12} height={12} />
            <span>登出</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PortalNavBar;
