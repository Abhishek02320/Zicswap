import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types";
import { getCurrentUser } from "@/lib/appwrite/api";

export const INITIAL_USER = {    // input taking varaibles defined here
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = { // bollens values of whole project is defined here that what they have initially stored 
  user: INITIAL_USER,  // user varaible defined here what varaibles it store in it that is coming from above code 
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {   // ye type hamne yahi is file me hi defined kar diya h jisko ham neech ke code me use kar rahe h isko yaha define na karke apne (type folder ki index file me bhi define kar sakte the aur yaha call kara lete ) 
  user: IUser;  // user varaible me jo bhi varaibles stored h unko (type folder ki index file me define kar rakha h )
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);   // hamne ak context create kiya h aur usko authcontext me store kara diya h is context me kya kya h wo aur unme initially kya store h wo hame ((INITIAL_STATE)) function batayega aur isme function me jo bhi varaibles use kiye gaye h jo initially value stote kiye hue h wo define karne ke liye hamne (<IContextType>) ka use kiya h jo har varaible ko define kar raha h // isse ab hamara har varaible define h aur wo initially kya store kiya hua h wo data hamne (createcontext)se create karke is authcontext varaible me store kar diya h   

export function AuthProvider({ children }: { children: React.ReactNode }) {     //kisi bhi varaible me agar provider word laga dete ho to wo aisa function ban jata h ki poore project ki files ban jaati h uske liye childrens jo ki kisi bhi kone se is file ke provider function me banaye hue har ak varaible/function ke data ka access le sake  poore app me kisi bhi file se bas waha is file ko import karna hota h aur bas is function  (authcontext())ko call karo aur isme jo function store karaya tha usko call karo aur uske values ka access lelo  ki usme initially kya store h 
                                           // (children: React.ReactNode) ye hamne childrens ko define kar diya h       
    const navigate = useNavigate();    // usenavigate function ko ab ham sirf navigate kah kar kahi bulaayenge is entire file me to wo usenavigte function ka work perform karega sirf is file ke liye because ye varaible sirf is file ke liye define h
  const [user, setUser] = useState<IUser>(INITIAL_USER);  // initallly is user varaible me  ((INITIAL_USER)) is function ke varaibles store honge but jab usko setuser ko call kara kar naye data ko import ya add kiya jaayega is varaible me to data update jo jaayega user varible me  ((INITIAL_USER))function ke andr jo vraibles store h usko (<IUser>) ye varible define kar raha h  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading ] = useState(false);
  
  const checkAuthUser = async () => {  // ye function tab chalega jab user login kar raha hoga 
    setIsLoading(true);
    //************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************* */
    try {
      const currentAccount = await getCurrentUser();  //(getCurrentUser())ye hamara api.ts file ka function h jise call karane per hame as return exixt account ka userid milega jo ki verified hoga ki jo signin ke time user ne data dala tha wo backend me exixt account se match kar gaya h mena is tarike ka account exixt karta h aur databse me us user ki userid exixt kar rahi h wo hame return me milegi jab ham is(getCurrentUser) function ko call kaarayenge jisme (user ki details hogi like (username,bio,image) usko is (currentAccount) me store karayenge   //  (getCurrentUser()) actual me ak api.tsx file me bana hua function h appwrite ka
      if (currentAccount) {    // jaise hi isme data aayega  to neeche ka ye (setuser) hook chalega jo hamara user varaible ke ander store data ko update karega is naye data se    //ab ham soch rahenge ki ham is data ko update kyu kar rahe h to wo isliye bhai because
        // (checkAuthUser) ye hamara ak get account function h jika kaam h ki like jaise ak user h jo apne ak account se signin kiya apne account me ab koi doosara user aya usne naye (auth)details ke saath signin kiya to us time per hamare oncreen per jo sectioons bane hue h like (username ,name,bio) section ye sabhi section dono alag alag user ke unke auth details ke hisaab se lag alag h agar ye varaible shamare har page reload per update nahi honge to dikkat ho jaaayegi like ak user ne kisi account me signin kiya ab wo fhirse naye data se signin kar raha h per uska onscreen varaibles update nahi hue to use liye to uska purana account hi khula rahega jabki usne to apna naya account me signin kiya to us account ki details ke hisaab se backend se us data ko fincd karke uske ander jo data pahle se hi stored h wo ab in onscreen varaibles me pass kiya jaaye taaki us user ke signin details ke hisaab se uska account khul jaaye jo wo chhahta h isliye yaha hamne (setuser) ka use kiya h ye hamara us getuer function se backend se fetch kiya hua data ko in varaibles me pass kar de taaki ye varaibles jo onscreen hamare user ke data ko render kar rahe h wo backend ke us data ke according change ho jaaye isliye ham yaha ye (setuser) ka use kar rahe h   
        // like ham apne account me sign in  kar gaye mena apni id me to waha ham kisi data ko update karana chhhate (getCurrentUser) is function se sirf ham apni id ko dhundh pa rahe h database me mena backend me ab jo id hamne dhundi h waha us id ke varaibles mean backend me pahle se hi kuch data un varaibles me store hoga user ka jab usne pahli baar id banayi hogi like uski (bio,photo,username) ab uska man h ki wo us data ko update karna chhahta h mean apni bio me kuch aur daalna chhata h to ham is code us data ko update kar sakte h mena user varaible me pahle se hi khuch store tha us id ke varaibles me but us data ko update karenge to ham uske liye is (setuser) hook ka use karke us data ko update karenge    
        setUser({
          id: currentAccount.$id,  
          name: currentAccount.name,  // setuser varaible me name naam ke varaible me wo data store karaye jo wo yaha se (currentaccount)naam ke function ke (name varaible) me store hua hoga mena databse me backend me store hua hoga aur name naam ke varaible ko update karega mean jo isme data store h usko update karega puraane data se jisse oncreen hame wo data mile jo ham apne perticular acccount me signin karke mile 
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
     return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {   // finaaaly user apne account me enter kar jaayega tab ye chalega 
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback");   // ye h hamara cookies section jo ki hamare local stoprage me cokkies stote karega we can see all cookies of that page in  inspect<Applicationn <localstorage 
    //jaise kisi user ne agar ak baar signin kar liya h to uska accountid store ho jata h browser ke localstorage ke sectoion me taaki ham baad me kabhi is page per visit karenge to ye hame alredy signin man kar direct home page per redirect kar dega bina signin ki details maange  
    if (
      cookieFallback === "[]" ||   // jo accountis user ka store hoga browser ke localstorage me to us data ko is line ke code ki help se array ke form me store kara lenge aur ye line ka code lovalstorage section me ak ( cookieFallback )is naam ka varaible create kar dega jo jisme user ke browser me jaha uska ye data (array) ke form me store rahega aur jab bhi wo page per dubara visit kare to uske authntication na dena pade aur directly redirect ho jaaye home page per  
      cookieFallback === null ||   // agar us user ke browser me is vriable ke naam ke storage me koi bhi data nahi h mean wo null h ya uuper ki line like ([]empty) ya neeche ki line undefined h to user ko redirect kardo (siginn) ke page per ye is (if)condition ka matalab 
      cookieFallback === undefined
    ) {  
      navigate("/sign-in");
    }

    checkAuthUser();  // ye function h hamara jo uuper defined h aur ye every page reload per call hoga onpage aur apna function perform karega 
  }, []);  // [] dependency empty ho iska matalab ye hota h ki jab bhi hamara page load hoga mena each reloading per hamare  useeffect hook me pass kiye hue functions call honge  

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;   // ye h hamara provider jisme hamara poora app ke saare files iske under as children aate h value me hamne jo bhi varaibles/function ko pass kiye h unko ham apne project ke kisi bhi function me call kara kar uske ander ki store value ka access le sakte h yahi hota h provider ka power 
                                                                                   // jaha bhi hame is provider function ke kisi bhi (variable/function) ko call karana ho to sirf call karna (authcontext) because provider iska naam nahi h provider to ak code h jisko kisi bhi varaivle me lagakar uske ander ke stored data ko poore project me kahi bhi access le sakte h 
}

export const useUserContext = () => useContext(AuthContext);    // usecontext ko ham as hook ki tarah use karte h jisme initially hamne jo data store karaya h wo h wo jo ki (authcontext) function yaani is uuper ke code me store h mean ab jaha bhi ham (useUserContext())function ko call karenge jis bhi file me to waha per iske ander ke store function ya variable wo waha call karayenge to unme initially yahi value store hoga jo is file me karaye h aur kyuki ye hook h to iske ander ke vraible/function me store value hamara update hota rahega us file ke according 
 // (useUserContext()) ak aisa function h jisme jo data hamne pass kiya h wo ak provider function ka data h mena us data ko ham kahi bhi poore project me access kar sakte h sirf is function (useUserContext()) ko call karke pahle ham (authcontext()) ko call karke us data ko access kar sakte the but usko thoda meaningfull and mutable/changable data according to perticular file usko hamne hook me call kara kar is(useUserContext()) function me band kar diya isse kya hoga ki hamari data ka access poore project me kahi bhi lelo aur according to that file us data ko update bhi karate raho sirf usperticular file ke liye not for this main data mena sirf us perticular file ke liye data update hoga fhir doosari file ke liye wo data fhirse waisa hi ho jaayega jaise ye abhi yaha h ye change nahi hoga  