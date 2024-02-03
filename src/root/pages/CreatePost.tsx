import PostForm from "@/components/forms/PostForm";
// this is a create post page 
const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img     // ye img hamne at the top per laga di h jo ye dikha rahi h ki ham is section me post ko create karenge 
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>

        <PostForm action="Create" />    
        {/* is file me kuch bhi nahi h jo h is postform file me h basically hamne is postform file me ak form banaya h jo ki post create karne ke liye jo jo ham as input lenge wo is form me sections banayenge aur baaki jo h bas is postform file me hi h is craete file me khuch bhi nahi h    */}
      </div>
    </div>
  );
};

export default CreatePost;