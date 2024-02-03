import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// ye poori file hamari left me render karegi in all pages as constantly iske saare icons images jo is file me define h wo sabhi hamaree leftside me render karenge 
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const LeftSidebar = () => {   // poori file is function me enclosed h 
  const navigate = useNavigate();
  const { pathname } = useLocation();   //useLocation() ye hamara rect hook h jiska kaam h kisi perticular page per tum ho ya route kar rahe ho uski location batana // basically ham is hook ka use ye jaane ke liye karte h ki ham kis page me route kar rahe h us page ke button me active property lagane ke liye taaki wo baaki buttons se alag hi chamke  //is hook ko hamne is (pathname)varaible ke naam se apne file me call kiya h 
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();

  const { mutate: signOut } = useSignOutAccount();
  // *++++++*********************************(ye uuperwala section as it is work karega jaisa ki topbar file me work kar raha h hamne ise waha define kar rakha h )***************************************************************************************

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        {/* uuper section is for your zicswap icon functioning */}

        {isLoading || !user.email ? (
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>             {/*  this line is for rendering user name onscreen from geeting its backend */}
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}
       {/* ye hamara uuper ka section same as it is work karega jaisa topbar me profle icon work kar raha h ki icon per click karke ham apne profile section me enter kar sake   */}
        
{/* // yaha tak hamara ak section complete ho gaya leftbar ka jo uuper side section ko covr kar raha h left bar me  aur neeche ka (return) hamara middle side of leftbar ke functions perform kar raha h like jitni bhi links ham render kara rahe h wo sabhi is middle section me cover honge aur logout button hamara wahi uuperside ke return me hi cover hoga becuse uuperside wala return hamara whole leftbar ke section ko cover kar raha h   */}
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => { // (sidebarLinks)file ki saari links ko aksaath karo mean (map) karo aur us file ke varaibles(image,label) ko hamne is (link) naam ke varaible me store kara liya h aur ye (INavLink)file hame un varaibles ko define kar rahi h 
            const isActive = pathname === link.route;    // is line ka yahi matalb h ki agar kisi link ke page per ham route kar gaye h mena us link ke page per pahuch gaye h to uska pathname me true store ho jaaye mean us link ke isActive variable me true store ho jaaye aur phir is varaible ko jaha jaha call karaya h waha waha iske active hone per kuch extra properties di gayi h wo us perticular icon me lagne lage  
            return (
              <li   // neeche ka navtag hamari saari links ko onscreen render karane ke liye baar-baar use kiya jaayega aur unsbahi links ko align karne ke liye ye (li)tag baar baar use karemge isliye unme diiffre karne ke liye isme hamne (key value)un sbhi link ke label dev diye h because har link ka alag alag naam hoga wo common to ho hi nahi sakta 2 link ka ak jaisa like kisi ka (home h to kisi ka explore) 
                key={link.label}   // yaha ham jis perticular link ko call kara rahe h uska label se key ko define kar diya h ab is poore (li) tag me jo bhi varaibles call kiye jaayege wo usi sigle link ke varaibles ka data pass karenge is poore (li) tag me jo ki yaha pahle hi bata diya h is key me pass karke like yaha (home ) waale link ke saare varaible sko use karne waale h to hamne yaha key me define kar diya h ki ham sirf (home) link ke varaibles ko call karenge is poore (li)tag me na ki kisi aur link ke because sabhi links ke variables same h but unke ander stored data alag h isliye jo yaha key me pass kar diya ki is linkke variables ko call kar rahe h to sirf usi link ke varaibles ke data ko call kar rahe h aisa nahi h ki home ke imgurl ko neeche call kar rahe h aur a explorer link ke data like (label me naam expoler daal diya img home ki laga di aur link kisi aur ki laga di) but aisa nahi hota unme difference karne ke liye hi to hamne yaha (label) ko as key pass kar diya h taaki jis perticular link ke varaibles ko call kar rahe h wahi aaye na ki koi aur aajaye islioye yaha ye (key) pahle hi define kar deta h ki ham kis link ke varaibles ko is neeche call kara rahe h  )   
                className={`leftsidebar-link group ${ //yaha jo hamne (group) varaible ka use kiya h uska kaam h ki jo ye property ham yaha use kar rahe h active hone per wo properties hamari saari links per lag sake because group word ka use nahi kiya to jo (isActive) hone per jo peroperty hamne yaha define ki h wo hamari saari links per lage nahi to nahi lagegi sirf (home) link per lagkar rah jaayegi
                  isActive && "bg-red-600"    // yaha ye hamne class me hamne (isactive) isliye likha h taaki jis bhi page per ham us time render kar rahe ho to us link ka button active hoga aur ye class sirf usi me lagegi taaki wo baaki sabhi links se alag hi chamke  
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center  p-4">
                  <img
                    src={link.imgURL}   // jis perticualr link ke (imgurl)varaible ko call kar rahe h yaha wo hamne uuper key me define kar rakha h 
                    alt={link.label}
                    className={`group-hover:invert-white ${  // yaha bhi hamne (group) word ka use kiya h infact jaha bhi ham isActive word ka use karenge waha ham har us jagah per is (group) word ka use karenge taaki ham isActive ke active hone pr di hui extra properties ko use kar sake 
                      isActive && "invert-white"    // agar isActive me true return ho jaaye to ye extra me jo property likhi hui h wo is image me lagne lagegi  
                    }`}
                  />      {/* uuper wala navlink tag me store hogi hamari saari links aur har ak perticular page ki image bhi taaki unimages per bhi kisi ne click kiya to unpages per route kar jaaye   */}
                  {link.label}   
                  {/*  ye saari links hamare is ak (li) tag ke ander enclosed h mena baar baar isi li tag ko call karakar usme jo link h usko navtag me aur jo us link ki perticualr image h wo aur image tag me aur unka jo label h usko yaha call kararhe h  */}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost "
        onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;