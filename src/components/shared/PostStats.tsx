import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { checkIsLiked } from "@/lib/utils";
import {
  useLikePost,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queries";
import { Loader } from ".";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  // console.log(post)   
  const location = useLocation();
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  // is like list me hamare puraane  like count store h jo alag alag id se diye gaye h un usrs ke through

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
    // (mutate)varaible ko rename kiya hamne yaha (likePost)varaible se aur iska jo function hamne query file me banaya h usko yaha call kara rahe h because wahi to ye functioons ko perform karega (postlike) ke count ko store karne ka  
   // jsiko hamne yaha rename kiya h (likepost) is varaible ko ham neeche call karenge to iska matalab h ki ham is (query) ke is (useLikePost())functioon ko waha call kar rahe h aur is (likepost)varaible me jo bhi data pass karange wo actual me is (query) ke function me pass hoga jo ki (query) ki file me bana hua h jisme uska function likha hua h ki use kya kaamm karna h 
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();
//ispending me (true) ya false a raha h jo inke rename functions me pass ho raha h aur ye (true false depend kar raha h in quety se call functions per) jab tak wo server per request maar rahe h us data ke function ko backend me perform karne ke liye tabtak hamare in (ispending) me (true) pass hoga aur fhir request execute hone ke baad (false pass hoga )


  const { data: currentUser } = useGetCurrentUser(); 
                              // (useGetCurrentUser) is function ko hamne query file se call kiya h jo ki hame data dega jise (data)variable me store karaya h use hamne rename kiya h (currentuser)varaible se this (query function ) gives us (userid and its name fom auth context mean jis user ka account is time login h uski details and iske saath saath ye aur bhi bahut kuch batata h jaise us user ne konsi post ko save kiya h uski details jisko hamne apne (savepost handle me use kiya h )  )  

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(savedPostRecord? true: false);  // agar (savedpostrecord funtion me true return hoga to (set)pass hoga (true) nahi to false pass hoga )
  }, [currentUser]);  // ye usestate hamara is setfunction ko tab activate karega jab current user ki details me changes honge mean user change hoga  

  const handleLikePost = (  // ye function hamara post ko like aur unlike dono karne ke liye responsible h mena agar user like button per click kar raha h to sabse pahle (if)satatement poochega ki kay post pahlese hi is user ne like to nahi ki h agar ki h to ye usko inlike kara dega ye (if) function aur agar like nahi kiya h to else chalega jo us userid ke person ko us post ko like karne ke liye eligible karega  
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();      // jaisa ki hame pata h ki hamara poora post ak clickable post h mean usme har ak cheej per click karne se kuch na kuch function perform ho raha h to aisa na ho ki ham post per click kare use update karne ke liye ya us post ka userpage dekhne ke liye but usse kahi hamri post na like ho jaaye to usko prevent karne ke liye ye line h // ye line code hamri help karegi ki jab hamare cursor ko exect like waale image per laake click karoge tabhi wo like ko as like count pass me karega aur (image red heart me convert hoga ) 

    let likesArray = [...likes]; //jo like hame mila hoga neeche ke (like image) waale button se usko ham yaha is varaible me store karenge jitne bhi (likes ke image function se aa rahe h unka count isme store karenge and previous like counts ko bhi spred karenge sothat previous data lost na ho jaaye  )  

    if (likesArray.includes(userId)) {
      //(likesArray.includes(userId))mean agar user ne pahle hi like kar diya h post ko to ye (if) function chalega 
      likesArray = likesArray.filter((Id) => Id !== userId);
      //(likesArray) is varaible ko ham update kar rahe h filter laga kar 
      // jaise hamra koi user h aur uski (id) kuch aur aur us post per pahle se hi kuch likes aur a rakhe jo kisi aur bande ne apni (id) se like kiye to jab ak user jisne apni id se like kiya h to wo jab like kare post ko to (likearray)varaible update ho aur uske ander ka like count bhi update hoga jisme sirf ak hi like (badega) na ki (3-4) likes bahdega baar baar us like icon per tab karne per isliye yaha per hamne apne (likearry)varaible ko update karne ke liye yaha (filter) laga rakha h ki userid jo h wo aur kisi id se match na kar rahi ho sirf ak hi like count hoga ak bande se aur likecount badega jab hamara user like karega us post ko aur wo like update hoga is (likearry) me  
    } else {
      likesArray.push(userId); // aur agar us user ne like nahi kiya h to ham us user ki id ko append karenge jisse wo eligible ho jaayega ki wo like kar sake us post ko aur wo like count hamara is (likearary) me as count store ho paayega 
    }

    setLikes(likesArray);  // like varaible ko ham yaha set karke update kar rahe h jiska count is likearay me store h 
    likePost({ postId: post.$id, likesArray });  // aur agar uuper ka (if condition run nahi hui mena user ne like nahi kar rakha h agar like kar rakha hota to wo if wala function chalta aur user filter karta ) // agar like nahi ho rakha h post per to ye function chalega aur us post per like krega is function ko hamne call kiya h (api.ts) file se jiska kaam h post ko like karana aur us like count ko backend me store karana
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.$id === post.$id);   // ye function hamne isloye comment off kar rakha h because ye function hamne pahle se hi uuper likha hua h aur ye usesate me bhi use ho rakha h isliye yaha dubara nahi likha sakte h bas samjhne ke liye ye line ham,ne yaha dubara likh di h ye line uuper likhe h (usestate) ke just uuper
          // agar current user ne post ko save kiya h to usko find karo uske recorde me agar uske record me jo id store h wo aur post id match hui mean post save hui h  to is (savedpostrecode) me true pass kardo                             
    if (savedPostRecord) { // agar hamari post pahle se hi save h to ye if chalega save button per click karne per
      setIsSaved(false);     // aur save post ko unsve set karega
      return deleteSavePost(savedPostRecord.$id);   // aur save post ko save section se delete karega ye delete function hamne apne (api.ts) me banaya h waha se call kiya h ise
    }
     // normally is savepost-handle ke chalne per hamri post save bhi ho rahi h aur unsave bhi jaise  hi ham is save icon per click karenge to agar w post pahle se hi save hogi to uuper wala (if) function cahlega aur save post ko unsave mean mean delete karega aur agar wo post save nahi h to if wala function nahi chalega aur ye neeche ye functions cahlege jo us post ko save karayenge  
    savePost({ userId: userId, postId: post.$id });  // agar post save nahi h to ye (api.tsx) se call kiya hua save function chalega jo post ko save karayega yaha se is post ke save btton per click hone per
    setIsSaved(true);   
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
            // agar ye image per hamne click kiya hoga to ye hamre heart ke image ko change karega joki depend karega is uuper waale function per agar isme (like) pass kar gaya mena user ne is post per like kiya h ye red heart onscreen rennder hoga nahi to normal heart render hoga 
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)} // is image per click karte hi ye function chalega  
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
                                              {/*{likes.length} it shows no. of like count in like varaible rander it onscreen    */}
      </div>

      <div className="flex gap-2">
      {isSavingPost || isDeletingSaved ? <Loader/> : <img
          // in dono property me se ak bhi property chalegi like post ko save karne ya delete karenge tab tak hame us savepost icon ki iamge ki jagaha (loader render hoga us icon hi jagah post per) aur jab ye dono function band honge tab wo saved post icon hmara render hoga onscreen 
          // hame ye loader isliye lagana pad raha h because isse (2) kaam ho rahe h ak ye ki jab ham apni post ko save karte h to onscreen hamra jo icon h wo saved shoe karata h per actual me wo jaldi data render karne ke chakkar me current user ka data lena ya fetch karna bhool jata h wo fetch hi nahi karta h jisse wo save post kis user ki h ye store nahi hoti jisse jab use save icon per dubara click kiya jata h to wo icon unsave icon render nahi kar pata h because jab wo us save file ko data me dhoodta h to use koi post nahi milti h because usne save karte time user ki details nahi li thi jisse jab us user se us post ko unsave karne ko kaha usne backend me wo save post dhoodi use mili nahi to uske hisaab se file pahle se hi delete ho chuki h jiski wajah se ye us saved icon se unsaved icon me render hi nahi karayega use lagega ki koi file h hi nahi to kuch karna hi nahi h mena save icon ko change hi nahi karna h isliye hamne yaha ye dono property use ki h jo time dete h post ko user detials ke saath post ko save section me store kara paaye aur tab tak hamara ye loader icon render kar do isse hamara save icon bhi referesh rahega aur har baar naya data fetch karke use hisaab se (saved icon render karna h ya unsaved icon render karna h ye soch paaye )   
          src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="share"
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={(e) => handleSavePost(e)}
        />}
      </div>
    </div>
  );
};

export default PostStats;


// ye file hamne apne post ke neeche ke components ke data ko show karane ke liye banayi h jisme hamara (like count and save post) ke icons aur unke data ko banaya gaya h jiske data ko backend me store karaane ke liye request maarne ke liye hamne use kiya h (reactquery) ka aur us data ko cahche me hold karne ke liye use kiya h (react query) ka  