import PortalNavBar from "./portal-navbar";

const PortalWrapper: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen container mx-auto bg-white shadow-2xl">
      <PortalNavBar />
      {children}
    </div>
  );
};

export default PortalWrapper;
