// topbar hamara sirf tabhi hame show hoga jab ye website hamaari mobile me khulegi nahi to nahi show hoga agar hamne desktop me website kholi to hame topbar sectioon nahi dikahi dega tab hame sirf (leftside, rightside, middle side dikahi degi) ye topbar aur bottobar hamara mobilewebsites ke liye h aur middle section me to hamari outlet hi chalegi fhir chhahe wo mobile website ho ya desktop website ho dono me hi hamari outlet as middle data ko change karne use kiya jaaayega    

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queries";

const Topbar = () => {   // hamari poori file is function ke under cover h 
  const navigate = useNavigate();
  const { user } = useUserContext();      //useUserContext() hammne is function ke (user) variable ko yaha call karaya h because wahi ak aisa varaible h jo ki apne ander current person ke backend ke data ka access le rakha hoga jisme bahut saare variables consist kiye hua h jisme user ka bahut sara insert kiya hua data h  
  const { mutate: signOut, isSuccess } = useSignOutAccount();   //useSignOutAccount ye function query file se call kiya h taaki ham signout function ko perform kara sake joki appwrite function ka function h jiska data hamara chache me store rahega taaki user dubara relogin karna chhahe to kar sake ini sab cheejo ko mutation bolte h like signout ya sigin function ko perfrom karana yahi wo data hota h jo mutate hota h like user login kar gaya to data change ho gaya naya data show hone laga aur signout kar gaya to doosara data show hone laga isi ko mutation bolte h     
   // yaha uuper ke code me (isSuccess) ye function apne man se banaya h aisa koi function nahi h but ye hame indication ke liye banaya h jiska use ham neeche  code me kar rahe h  
  useEffect(() => {   
    if (isSuccess) navigate(0);
  }, [isSuccess]);  // ye depend kar raha h hamra (issuccess) function per mena ye page ke data ko reload karega jab is function me kuch bhi changes honge aur is function me change is tarike ke honge like agar hamare query.tsx file se (signout) function ko call karaya gaya neeche ke signoutbutton per clik karke to is varaible me (true )pass ho jaayega than uuper ke if code me jaise hi (true) pass hoga to wo hame navigate karega (0) mena login page per aur ye page hamara reload hoga useeffect hook chalne se jo tab chalge jabhamare (issuccess) function me changes honge like jaise isme(true) pass hona 
  //hamesa yaad rakhna useeffect hook ka kaam hota h page ko reload karna aur wo page to tab reload karta h jab uski dependecies me koi channgement ho  

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">           {/* jo hamara zicswap icon hoga usper jaise hi koi touch kare to use home page per redirect kar diya jaaye  uske liye hamne yaha is link tag ka use kiya h */}
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">    {/* ye waala link hamne apne current user ke profile page me ghusne ke liye use kiya h yaha jis image ka neeche use kiya gaya h agar koi banda us image per click karega to ye link link hamara activate hoga aur chalega aur hame redirect karega (profile page per) */}
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              // {user.imageUrl }mean agar user varaible jo ki hamare person ke backend ke data access kar rakha h us varaible ke image url section me koi image h to wo yaha laga do (||) or icon file se  koi image nikal ke laga do  
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;