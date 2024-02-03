import { Link, useLocation } from "react-router-dom";
// bottombar file me hamara jo kuch bhi likha hua h wo pahle hi hamne smaj liya h apni (leftsidebar)file me because ye bottonbar file hamari sirf mobile website me hi show hogi aur isme jo bhi functions defined h wahi exect functions  hamne leftsidebar me smaj liye h because leftside bar file hamari desktop website me dikahi degi   
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();

  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        // is file me hamne thode changes kar rahe h like yaha hamne (li) tag ka use nahi kiya h because ham apne pages ke icons ki line me align nahi kar rahe h neeche bottom me settle kar rahe h isliye yaha hamne link tag me hi (key) laga kar data pass kar diya matalab link tag ko hi hamne ak reuse tag bana loiya jaise li waha hamne (li) tag ko reuse tag bana liya tha  
        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`${   // yaha class me bhi changes kar diye h 
              isActive && "rounded-[10px] bg-primary-500 "
            } flex-center flex-col gap-1 p-2 transition`}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={`${isActive && "invert-white"}`}
            />

            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;