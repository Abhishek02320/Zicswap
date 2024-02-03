import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  // ye question mark kah raha h ki agar is varaible ka type pooche to bata do ki ye ak boolean h nahi to mat batao
  showStats?: boolean;
};
// ye file hamari har ak page ke data ko show karne ke liye use hui h jaise ham expolrer page per gaye ya homepage per gaye to postdetils file se data pass hoke yaha is file me aayega to usme alag varaibles store honge jo alag data ko contain kiye hue honge jo is (post) varaibel me sara data pass kar denge aur onscreen data render karenge jaise jais unhe neeche call kiya gaya h aur kuch extra varaibles bhi is file me neeche call kiye gaye h but agar unme pass karne ke liye koi data nahi h because wo hamari (postdetil) file se bheja hi nahi gaya to wo onscreen render nahi hamare homepage ya explorer page per
  // aur ham saved page per gaye to saved file se sara data yaha pass hoke is file me aayega jo is (posts) varaible me pass hoga aur fhir ye varaible neeche bahut jahagh alag alag data ko render karane ke liye call kiya gaya h but aagr wo data jise ye neeche call kara raha h wo hamara saved file se is file me pass hi nahi kiya gaya h to wo onscreen saved page per render nahi hoga mean wo varaible kisi aur file ke data ko kisi aur page per render karne ke liye banaya gaya h aise ye file use hogi
const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();
  // console.log(posts)   


  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img   // ye image hamari post ki h agar isper click karenge to is post ke details per page per pahuch jaayenge jaha agar ye post hamari usi user ki jisne banayi h to hame edit aur delet buttons bhi show honge nahi to kuch baaki ki detils render hogi like caption and like and many more 
              src={post.imageUrl}
              alt="post"
              className="h-full w-full object-cover"
              />
          </Link>

          <div className="grid-post_user">
            {showUser && (  // agar isme (true return h to ye image render hogi ye image user ki profile ki h ) aur uski details otherwise nahi hogi abhi basically ye varaible me initally hamne (true pass kar diya h mean) ye always post ko render karega in detals ke saath
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.creator.imageUrl ||
                    // apni saved file me hamne (creator) naam ka ak varaible banaya h jisme currentuser varaibles se data ko extract karke is (creator)varaible ke imageUrl varaible me store kraya tha wo yaha call ho raha h
                    // ya fhir ye variable hamara postcard file se send kiye hue data mese call karaya ja raha h jo yaha ya to us user ki rpofile photo jo usne lagayi hogi wo render karega nahi to stored(svg)file ko render karega  
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;