import { useParams } from "react-router-dom";

import { Loader } from "@/components/shared";
import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queries";

const EditPost = () => {
  const { id } = useParams();   // onsite se jis post ko edit ke liye click kiya h uski id hame us post se get karne ke liye (param) hamari help karega jisse ham exect wahi (id) ko get kar sakte h jis poat ko edit karna h taaki us id ko apne functions me pass karke us post ke uuper work perform kara sake 
  const { data: post, isPending } = useGetPostById(id);
                                       // us post ki (id ko) ham apne (query) ke is function me pass karenge taaki ham us id ke detials get kar sake backend se fhir use is (post)naam ke varaible me store kara sake 

  if (isPending)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {isPending ? <Loader /> : <PostForm action="Update" post={post} />}
                              {/* postform me jaane ke do raaste h ak home page se us time ham post create kar rahe hote h ak ye edit page se but dono time form file ak h but unke ander pass hone waale actions alag h yaha hamne action me (update pass ) kiya h aur jis post ko update karna h us post ka data bhi ham yaha se apni postform file me pass kar rahe h    */}
      </div>
    </div>
  );
};

export default EditPost;