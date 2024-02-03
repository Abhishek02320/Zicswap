import { Outlet } from "react-router-dom";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      {/* jaisa ki hame pata h ki jaise hi banda signin kar jaayega to hamara router change ho jaayega hamara rootrouter start ho jaayega chalna ab is roueter me bahut saate pages h jo ki render honge (outlet) ki help se mena is poore page me bus jis section me outlet likha bas wahi section change hoga according to page baaki poora page per jo section h wo as it is rahenge like (top,left,bottom) page per aur sirf outlet waale section ka data according to page change hoga   */}
      <LeftSidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
