import { Routes,Route} from 'react-router-dom'
import {
    Home,
    Explore,
    Saved,
    CreatePost,
    Profile,
    EditPost,
    PostDetails,
    UpdateProfile,
    AllUsers,
  } from "./root/pages";
  import AuthLayout from "./auth/AuthLayout"
  import RootLayout from './root/RootLayout';
  import SigninForm from './auth/forms/SigninForm';
  import SignupForm from './auth/forms/SignupForm';
  import { Toaster } from "@/components/ui/toaster";
import './globals.css';
const App = () => {
  return (
    <main className="flex h-screen">
    <Routes>
      {/* public routes  are that pages which can see any person like signuppage*/}
      <Route element={<AuthLayout />}>  
      {/* <AuthLayout /> is  a functional file which handle some pages work and their routing through init like we made signup page than we have to import that file in Auth file otherwise file will not render that file onscreen because those files or pages are under this (auth) routing that file should pass from this auth file  */}
        <Route path="/sign-in" element={<SigninForm />} />
        <Route path="/sign-up" element={<SignupForm />} />
      </Route>

      {/* private routes are that pages which can see only that  person who is signin    like jaise instagram chhhahta h ki aap uske ander tabhi saaari post apni ya doosare ki jab tum signin ho to ye yaha per apna sara app ko private rakhna chhahta h isko wahi dekh sakta h jo signin ho to ye saari cheeje private route me aayegi ki iske ander ke routing pages ko sirf wahi log dekh paaye jo signin ho   */}
      <Route element={<RootLayout />}>
      {/* <RootLayout /> is  a functional file which handle some pages work and their routing which is under this file  */}
        <Route index element={<Home />} />   {/* index mean jab ham sign in karenge to direct h isi page per redirect honge mean ye hamara first pages hoga hamesa */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:id" element={<EditPost />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/profile/:id/*" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Route>
    </Routes>

    <Toaster />     {/* yaha is line ko sirf isliye likha h because apne poore project me alag alag jagah per toast ko use karne ke liye toast ko yaha bhi aise import karana jarruri h tabhi wo work karega aisa documentation me likha hua h */}
  </main>
    )
}

export default App





//npm create vite@latest
// cd foldername 
//npm install                       // for creating lockjson file which containing remaining dependenies for running this vite website
// rafce
// do make setup of tailwind 
// npm install -D tailwindcss-animate for install tailwind css animation
// ctrl + c for rereun the terminal 
// npm install react-router-dom
// shadcn/ui is a liberary which we used in our project for creating {forms cards and many more components} here are already customised form and cards components avilable we have to just use them for free and also whole code is in tilwind form so we can customise that cards and components according to our choice if we have knowledge about tailwind css      
// pnpm dlx shadcn-ui@latest init  // this code is we use after some codes of installation of shadcn/ui
// is liberary ki ak adat h ki ye kisi bhi component ko khud banati h hame bas uska code likhna h like hame koi button banana h to ham bas kya karenge ki button ka jo bhi (npx) code hoga wo site se copy karo yaha terminal me likho fhir apne aap ye ak component ki file banayega use tumhara component banaayega file banayega usme tumhara component banayega apne aap   
// npm install appwrite for appwrite features



// yadhi jis email se ham nayi id bana rahe h aur wo backend me pahle se hi kisi aur id ko banane me use ho chuki h to tum usse ak aur id nahi bana sakte ye appwrite ka rule h to is issue se related ham ak toast banayenge jo baad me jo hame message dega id is already used jo abi hamne nahi banaya h baad me banayenge 
