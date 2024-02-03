import * as z from "zod";     
import { zodResolver } from "@hookform/resolvers/zod";
  // this is imp to import this above code from that (shadcn)website  for (validation)function of form component in this file 

import { useForm } from "react-hook-form";
// above code for form manegement in this file which form component already made in component folder by (shadcn)code
import { Link, useNavigate } from "react-router-dom";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useToast } from "@/components/ui/use-toast";    // toast ko is file me use karne ke liye is usetost ke code ko import karana jarruri h

import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import { SignupValidation } from "@/lib/validation"; 
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();    // useUserContext() ak function h jisme (isloading,checkAuthUser pahle se defined h jo initiaaly true ya false store kiye hue h) jo hame value return karega (true ya false me ) jisse inke  ye functions chalenge jo neeche bane h   
                                                // useusercontext hamara ak function h line no. (94) of authcontext file me waha se hame is file ke liye (true/false mil raha h )
  const form = useForm<z.infer<typeof SignupValidation>>({
       // is line ko likhne se hamara signupvalidation code apne aap yaha import ho jaayega is file me aur hame us code ko call karane ke liye is line ke alawa aur khuch likhne ki jarrurat nahi padegi
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",    // yaha chhhe to default values bhi daal sakte h jo hame signupform me show hongi initially
      username: "",
      email: "",
      password: "",
    },
  });

  // Queries me jo bhi function hamne banaye h unko ham yaha call kara rahe h 
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount(); // ye query file me ak function h for create useraccount 
  // (mutateAsync) ye hamara function h queries file ka jisko hamne rename kiya h (createUserAccount) se taaki ye jyada acche samaj aaye ki ye function kya kaam kar raha h yaha per is file me actual me ye (user ka account create kar raha h jo hamne apne (api.ts)file me  ke code se create karaya h jo appwrite ka function h for creating account ) wahi ye bhi kar raha bas isme usme itna farak h ki jo function aapwtite ka account ko create karne me use kiya gaya h usi function ko hamne (query file ) me call kara kar (api.ts file se) uske data ko query chache me store kara liya h taaki us data ko kabhi bhi chnage kar sake aur us apprite ke use (createuseraccount)function ko hame (query) file me call kara kar ak function me band kar diya jaha wo create account ka sara data jo usne sihnup form se liya tha for creating account wo apne cahche me store kar raha h aur fhir yaha us query function ko call kara diya h jisne is appwrite ko cover kar rakha h apne ander taaki wo sara sata cahche me store karane ke baad user ka account create kar de because wahi function responsible h for creating user account agar (query) ke us function ko is file me call nahi karayenge to new account create hi nahi hoga to uske liye fhir apne appwrite ke createuser code ko api.ts file se yaha import kara hoga call kara kar agar user ka account create karan  chhate ho to per agar us function ko yaha create kara diya aur is query function ko bhi call kara diya to user ko account create ho jaayege ak jo cahche me data store karne ke baad craete hua h account aur doosara jo appwrite ke function ko yaha direct call karane per create hua h ye account kuch aise create hoga data aise move karega (signuppage<api.ts<query<signupform.ts<)than account get create in appwrite backend     
  // (isPending: ) ye ak function h jiko rename kiya h (isCreatingAccount) se mean isme hamara (true or false) return hoga mean kya loader signup button ka on chlata rahega ya ruk jaayega signup button per click karte hi  ye (true false per )depend hoga jo isme pass kiya ja raha aur is (isCreatingAccount) ko neeche submitbutton me call kiya ja raha h jo yaha se (true ya false haone per waha button me loader ko activate ya deactivate karega ) 
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();   // ye hamara function h jo signing-in/session function of appwrite ke code ke liye responsible h jo user ko signin karayega iska work flow is like (signinform<api.ts<query.ts<signupform.tsx)  

  // Handler
  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {      // ye hamaare submit button ka function h  jo tab activate hoga jab user detail daalkar signup button dabaayega // jo detials usne input box me daali h unko hamne (user)naam ke variable me store karaya h unper hamne yaha ye validations lagakar check kiya ki wo valid h ya nhi ye validations hamari index file me likhi hui h jo ki (shadcn) se copy ki gayi h jab hamne apna form banaya tha 
    try {
      const newUser = await createUserAccount(user);     // creteuser function hamara appwrite wala function h jo new user ko create karta h appwrite me is function me hamne (inputbox ki details jo ki (user) variable me store h )wo pass kar di jisse wo naya user create kar sake apne backend me details ko save karke  //ye  function hamara submit button function ke under ata h jo tab chalega jab submit button per click karnge for creating user account from above code  

      if (!newUser) {      // jsie hi hamara naya user id create ho jaayega account ke create hote hi to ye code ask karega ki newuser return hua ki nahi agar nahi hua to to ye (if) statement chalegi jisme hamne ak popup code daal rakha h (toast) ye (shadcn) ka popup function h jo apne msg ke saath popup show karega  
        // toast import karne ke liye ye code terminal me likho :- (pnpm dlx shadcn-ui@latest add toast)
        toast({ title: "Sign up failed. Please try again.", });
        
        return;  // agar newuser nahi bana to ye popup show hoga aur retun me khuch bhi return nahi hoga because hmne return me khuch bhi nhi diya h is line me mena user signup ke page per hi rah jaayega kahi aur jump nahi karega
      }

      const session = await signInAccount({     // ye function hamara submit button ke under ata h mean jab ham submit/sigin button per click karenge tab ye function hamara chalega aur jo is function ka kaam h jo uuper ke code me define h wo mena signin user wo perform hoga  
        email: user.email,
        password: user.password,  // yaha jo ham ye user variable use kar rahe ye already defined h hamara (authcontext) file me jo input intake karne ke liye banaya gaya h from input boxes of forms and store karayega is password varaible of signinAccount function me jo ki appwrite ka function h for siging in
      });

      if (!session) {  // agar data verify nahi hue session function of appwrite chalne se backend ke data se mena jo user ne details daali h wo mismatch hui to ye (toast chalega aur alert dega ) aur fhir se hame same sigin page per navigate kar dega 
        toast({ title: "Something went wrong. Please login your new account", });
        
        navigate("/sign-in");
        
        return;
      }

      const isLoggedIn = await checkAuthUser();   // ye (checkAuthUser()) hame true/false return karega // ye functionn hamara (authcontext) file me bana hua h jo initially (true/false)values store kiye hue h jo yaha pass karega is varaible me fhir ye varaible (if)statement me check hoga

      if (isLoggedIn) {  // agar if me passing element true hua to ye statements run hogi nahi to nahi runn hogi
        form.reset();  // ye signin form ko reset kar dega mean input boxes ko empty kar dega 

        navigate("/");  // aur fhir hame yaani user ko home page per redirect kar dega 
      } else {
        toast({ title: "Login failed. Please try again.", });
        
        return;
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    // is return me jitna bhi code likha hua wo copy paste kiya hua h (shadcn) website se form component se hamne is neeche ke code me koi bhi line khud se nahi likhi h  
    // ye neeche ka code hamne form component ka jo (build your form) likha h waha se copy paste ki h aur us section me jitna bhi code likha h wo sabhi imp h aur yaha hamne apni is file me us poore code paste kiya h yaha uuper ki bhi lino me wahi se paste kiya h 
    <Form {...form}>
  {/*  yaha se  */}
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Zicswap, Please enter your details
        </p>
  {/* yaha tak ka code khud likha h baki ka code neeche wala copy kiya h site se  */}
        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="flex flex-col gap-5 w-full mt-4">   
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
{/* yaha tak ka sara code (shadcn) ke form component se copy paste kiya h ak bhi line khuse nahi likhi */}
          <Button type="submit" className="shad-button_primary">
            {isCreatingAccount || isSigningInUser || isUserLoading ? (   // agar loading chal rahi hogi(mena inse ak bhi statement ka true store hoga is function me ) to button per loading likha aayega nahi to signup likha aayega mena abhi user ne details daalkar signin ka button nahi dabaaya h 
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;





// sabse pahle to ye jaan lo ki ak form ko handle katna bahut complex h to ye (shadcn) form component ke liye 2 cheejo ka use karta h (Zod - for form validations ) and (React Hook Form) for from manegement or form building
// doc < components< forms < pnp form code paste in terminal than form component get generated in components folder automatically 
