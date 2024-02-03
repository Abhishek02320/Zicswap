import * as z from "zod";
import { Models } from "appwrite";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
  // ye saari files hame download karni hogi from shadcn website from this code (pnpm dlx shadcn-ui@latest add components) (components ko yaha se dekho aur jinki jarrurat h unka naam likhenge coompoenets ki jagah us component ka naam is code me components ki jagah 
} from "@/components/ui";
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { FileUploader, Loader } from "@/components/shared";
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
  // action me hamara (create) home file se pass hoke a raha h jisse ham apni nayi post ko create kar sakte h
  // aur agar action me Update pass hoke a raha h mean ham apni post ko upsate karna chhahte h yahi same form ka use karke onscreen render kara kar
 };

const PostForm = ({ post, action }: PostFormProps) => {
  // ye post form hamara (post) ke data ko accept karega jo unfiles se beja ja raha h jaise hamari (edit)file se us post ka data yaha pass kiya ja raha h post varaible me jis post ko hame update karna h aur (home) file se us post ka data pass kiya ja raha h is post varaible me jis post ko ham create kar rahe h  and action me unka action pass kiya ja raha h (home/edit)file se // aaur yaha indono varaibles ka type uuper ke function me define h 
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({      // ye form function ko hamne likha h from (shadcn)site from form section code aur isko apne hisaab se modify kiya h 
    resolver: zodResolver(PostValidation), 
    defaultValues: {    // is default values ke ander likhe hue varaibles postvalidation file me defined h  
      caption: post ? post?.caption : "",   // caption input section me caption likha jaayega agar post alredy exit kar rahi h and postcaption exixt kar rahi to wo caption section me render hoga because yahi same form hamara post edit ke liye bhi use ho raha h aur agar hamara caption pahle se is us id ka exists nahi kar raha h jis id ke data ko is form ke varaibles me pass kiya ja raha h to wo section empty showw honge mean us time hame ak nayi post craete karni hogi jisme ye form ke saare sections emty honge aur empty form render hoga  
      file: [],    // file ko array me store karenge 
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",   
                    // 2 tags seperate karenge by (,) 
    },
  });

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost();

  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === "Update") {    // agara post varaible me data h mean post h aur uske action me update pass h to ye if cahlega submit button per click karne per because hamara same form craete and update poat ke liye use ho raha aur uska submit button kahi hamare update post ko create post samaj kar us data ko backnend me naye section me na store kara de aur us upadte post ko nayi post banakar render n kar de weather update previous post is liye submit button me hame ye section banaye h jo submit button ke function ko run karenge according to un post me pass hue action se ki hame is submit per click karaane se hame puraane post ke data ko update karna h ya nayi post ko create karna h  
      const updatedPost = await updatePost({  // ye function hamne uuper define kar rkha h query me
        ...value,        // jo bhi is value varaible me store h previous post ka data like(caption,tags) usko is function me spread karke le rahe h taaki wo usi puraane post ke varaibles me update ho sake jo pahle se hi is previous post ke data ko contain kiye hue the 
        postId: post.$id,  
        imageId: post.imageId, // yaha ham apne previos post ke data naye edit data se replace kar rahe h backend me jo ki hamare form me naye data pass kiya h apne form me 
        imageUrl: post.imageUrl,
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
           // jo bhi action ham uuper kar rahe the wo specific action fail ho gaya like update  action fail 
        });
      }
      return navigate(`/posts/${post.$id}`);
    }

    // ACTION = CREATE
    const newPost = await createPost({   // craete post functionn hamara query file me define h jisme hamne appwrite ke function ko use kiya h post ko create karne ke liye 
      ...value,   // jo bhi is value varaible me store h new post ka data like(caption,tags) usko is function me spread karke le rahe h 
      userId: user.id,   // us data me ak stored id ko lagakar of a already exixt user  // newpost me store kara denge  value ka data 
       // yaha jo ham (userId) me is (user.id) ki id ko store kara rahe h us id ko ham access kar rahe h apne line-34 se mean usercontext ke user se taaki user ke backened data se ye create post ki post lnk rahe kisi perticualr user ki id me hi uski post store ho jisne ye post banayi h  
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
    // itna karne ke baad agar error aisa aaye ki not authorised to perform request than jaha tum apne data ko store karana chhahte ho waha tumne uska column hi nahi banaya h like mai post create kar raha hu to ye data hamara storage section me store hoga appwrite ke to us section me jaakar settting me jakara ak naya section banana hoga permision deke like (create,read,update) ab is secttion me hamare saarae photos aake store honge storage section me permition dete hi
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader       // ye hamari ak file h jisko hamne yaha is form me import kiya h for including dragdrop upload section in our postform
                  fieldChange={field.onChange}     // ye field change hamara ak prop varaible h jisko ham pass kar rahe h apni (fieldUploader)file me  jisme ham pass kar rahe h is file ke field varaible ko jisme sara data store h ya store hoga jo bhi user onpage postcraete karte time is post ke form me data fill karega  
                       // field varaible ke onchange function ko ham is file se file uploader file me pass kar rahe h fieldchange varaible ki form me 
                  mediaUrl={post?.imageUrl}  // agar post alredy exixt kar rahi h to to uska imageurl pass kar do is mediaurl varaible me jisse wo hamare form me image section me wo image render hogi agar is post varaible me wo post ki image store h tabhi uska data is varaible se fetch hoke uski post render hogi hame hamare iamge section me of form page 
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"    // placeholder is for inputbox me ye sab kuch pahle se hi likha aayega aur jaise hi ham us inputbox me kuch likhenge ye ye text gayab ho jaayega 
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}>
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {/* jab in dono mese ak bhi property active hogi to hamare button nme hame loader chalta hua dikahi dega // hame yaha loader ko chalana jarruri h because agar ham yaha ye (isloading)jo ki ispending ki property ka rename naam h ye nahi cahalyengeto hamare backend me data thik se store nahi hoga because wo data hamara jaldi me (userid) fetch karna bhool jaayega aur fhir wo ak trash data banke store hoga jo ham nahi chhhate isliye ye propry use karte h taaki data arama se srore ho poori details ke saath kuch bhi trsh an store ho   */}
            {action} Post 
             {/* button iccon per hame ye likha dikahi de jab loader na chal raha ho aur jo (action)varaible me store h wo bhi yaha render hoga is button me isse hame ye pata chalega ki ye button )post ko update kar raha h ya create kar raha h ye button action ke hisaab se apne submit button ka function chaayega aur yaha action varaible se hi us action ko get karke yaha action kya h wo butto me render hoga  */}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;