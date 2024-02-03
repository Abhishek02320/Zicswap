import { Models } from "appwrite";

// import { useToast } from "@/components/ui/use-toast";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";

const Home = () => {
  // const { toast } = useToast();

  const {
    data: posts,
    isLoading: isPostLoading, // (isLoading)varaible hamne neche call kiye query file ke function me define kiya hua h jisko yaha rename kiya h (isPostLoading) is varaible se jisme true ya false as return pass ho raha h query file me  
    isError: isErrorPosts,
  } = useGetRecentPosts();   // ye function hamne qury file se call kiya h 
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? ( // ye condition tab chalegi jab page per koi bhi post nahi hogi and ispostloading true return kar raha hoga tab ye condition chalegi
            <Loader />   // and ye loader run karega onpage
          ) : (    // nahi to neeche waali condition run karehi
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                // posts me agar post h to un sabhi posts ko map karo mena ak saath karo aur ak ak karke post ko render karenge post ko type define karne ke liye hamne (model) ka use kiya hjo builin define h appwrite ka 
                <li key={post.$id} className="flex justify-center w-full">
                 {/* is (li) me bahut saare postcards pass honge to ye baar baar use hoga isliye isme hamne (key) introduce kar diya jisse wo har post ko differ kar paaye */}
                  <PostCard post={post} /> 
                  {/* ham postcard file me Post naam ke varaible me yaha se kuch data ko by prop pass kar rahe h jo ki (post)varaible me store h  */}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2  gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} >
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
