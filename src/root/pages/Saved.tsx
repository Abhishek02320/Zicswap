import { Models } from "appwrite";

import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save     // currentuser ko call karaya h jisme bhut sara data store h related currentuser details like (postdetails)ki saari cheeje (imageid ,caption ) and (userdetails) like (user name ,username )
  .map((savePost: Models.Document) => ({
    //savepost naam ka ak apni taraf se varaible bana liya h jisme ham apne (currentuser) varaible se (post)se related saari details ko usme store kara rahe h 
    ...savePost.post,
    creator: {    // ab yaha hamne creator naam ka varaible banaya h jisme ham (currentuser)varaible se kuch varaible ke data ko kisi aur naame ke varaible me store kara kar is varaible me band kar rahe h object ki form me
      name: currentUser.name,
      imageUrl: currentUser.imageUrl,
    },
  }))
  .reverse();
  // console.log(savePosts)   // ye jo bhi data hamne curreant varaible me se extract kiya h usko is (saveposts) varaible me store kara liya h aur ye uuper ko (craetor)varaible banaya tha wo bhi is (saveposts) varaible me store h jisko ham apne (gridpostlist) file me passs kar rahe h  

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
            ) : (
              <GridPostList posts={savePosts} showStats={false} />
              )}
        </ul>
      )}
    </div>
  );
};

export default Saved;