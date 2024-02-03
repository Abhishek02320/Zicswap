import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
    // is poori file me ham kahi bhi post varaible ko call kara sakte h because is varaible ko hamne define kar diya h aur pass kar diya h is file ke function me mena ab is varaible ke nader ke data ka access ham le sakte h  
  const { user } = useUserContext();   // is user varaible ka ham use kar rahe h apne user ki id get karne ke liye ki jis user ne post ko craete kiya h us id ka user aur jis id se home screen chal rahi h mena kisi person ki id khuli h onscreen wo dono id ak hi h mena banda ak hi h to uske liye edit icon show kardo post per onscreen on home page to signin user ki id get karne ke liye ham is (user) term ko yaha se get kar rahe h 
  // console.log(post)   

  if (!post.creator) return;
  // agar jo post onscreen render ho rahi h home page per wo us creator ki nahi h jiski homescreen per post show ho rahi h to ye neeche wala code as it is run karega aur post onscreen render hogi per agar jo post onscreen render ho rahi h wo usi user ki h jis user jisne usko craete kiya h to line no. 55 per hamne ak code likha h edit icon ko hide karne ka jo ki baaki sabhi users ke liye us post per hide rahega bus jiski post h us user ke liye wo unhide rahega aur wo icon ak link tag h jo hame redirect karega updatepsge per for edit that post

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}> 
          {/* jo post hogi homepage per to agar koi us post ke profileimg ko click karega to ye link tag activate hoga aur us user ko redirect karega us post ke user-profile per */}
            <img
              src={
                post.creator?.imageUrl ||                   //agar backend me post section ke creator section me imageurl hoga to wo isme pass hoga aur image render hogi user ki nahi to uske naam ke alfabet ka svg onscreen render hoga uski profile photo me 
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}    
              {/* ham sara data backend se post section ke creator varaible me store varaibles se access kar rahe h  */}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
                {/* (multiFormatDateString)this is a function jo (util) file me define h for convrting time from complex timezone to (day and date) time zone */}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
{/* uuper ka section ak post ka profile section time aur location ko dikhaane ke liye h aur ye neeche ka section us user ki create ki hui post ko show karne ke liye  */}

        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
            {/*  ye link tag tabi as edit icon tabbi show hoga user ko jab userid mean jis id se signin kiya h user aur creator id mean jis user ne post creat ki h uski id mena postcreator user and signin account user dono ak h to edit icon show hoga nahi to nahi hoga aur ye sab ak link tag me band h mena is edit icon per touch karte hi ye link tag activate hoga aur hame updatesection me leke jaayega jaha ham apni post ko edit kar sakte h  */}
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        {/*  ye link me ham apni post ko show karenge  */}
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img      // ye image hamari post ki hogi jo user ne create ki h is image ko ham post varaible ke imsgeurl se get karenge 
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
          />
      </Link>

      <PostStats post={post} userId={user.id} />
      {/* <Saved posts = {}/>  ye ak page h jo doosare folder me bana h aur postcard ak file h jo is folder ne bani to yaha ham prop ke trough pass nahi kar sakte data isliye isme universal passing data wala method lagana hoga jisse kisi bhi kone me apne data ko pass kar sake without prop  */}
    </div>
  );
};

// agar ham ye dekhna chhahte h ki hamara post varaible kya kya varaibles ko contain kiya h ya kya kya input apne ander contain kiya hua h to ham console.log(post) karke check kar sakte h  
export default PostCard;