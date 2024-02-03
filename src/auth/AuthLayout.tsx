import { Outlet, Navigate } from "react-router-dom";
// (Outlet) mean jo bhi routing files(sigup/signin) is routing file ke ander pass ki gayi h appfile me line-25 to un (signup/sigin) file me redirect karne ke liye iska use karte h  // agar kisi router ke ander ke routing page me redirect karna ho to (outlet) ka use karo aur gar direct kisi bhi page me redirect karna ho to (navigate) ka use karo 

import { useUserContext } from "@/context/AuthContext";

export default function AuthLayout() {
  const { isAuthenticated } = useUserContext();  // useUserContext() hame value return karega (true ya false me) jo hame ye batayega ki user authenticatde h ya nahi mena usne sign in kar liya h ya nahi agar ye true return karega to neeche  waale function me (true) store hoga aur hame home page per redirect karega aur false hua to sigin ke page per redirect karega (outlet) ke through (outlet mena jo page is file ke routing ke under a raha h us page me redirect kardo ) 

  return (
    <>
      {isAuthenticated ? (   // agar user authenticated h mena usne signin kar liya h to usko redirect kardo (home page per)
        <Navigate to="/" />
      ) 
      : (   
        //  if  isAuthentication condition get false than ye neeche wala code chalega  aur signup wala page per redirect karega
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      )}
    </>
  );
}
//  public route ki saari files aur uski authentication hamne isi ak auth folder me rakh li h 
