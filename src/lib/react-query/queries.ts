// npm install @tanstack/react-query for install query package query apne aap ak stack h react ka jisme ham bahut saari cheeje sikhnege jiase (infinite scrolling) mutation/changing any data of api mean change and update backend data like account details or more by saving whole data in chache of this query 
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import {
    useQuery,   // for fetching data 
    useMutation,  // for modifing data
    useQueryClient,
    useInfiniteQuery,
  } from "@tanstack/react-query";

  import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

import { 
  createUserAccount,
  signInAccount,
  getCurrentUser,
  signOutAccount,
  getUsers,
  createPost,
  getPostById,
  updatePost,
  getUserPosts,
  deletePost,
  likePost,
  getUserById,
  updateUser,
  getRecentPosts,
  getInfinitePosts,
  searchPosts,
  savePost,
  deleteSavedPost,
 } from "../appwrite/api";
  // ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {   // ye naam is function ka hamne khud se diya h
  return useMutation({   // ye ak query function ka code h jo uuper hamne query se import karaya h 
    mutationFn: (user: INewUser) => createUserAccount(user),  
    // (user: INewUser) mean jo data user me store h usko hamne pahle hi define kar rakha h us data se ak user ka account create karo aur us data ko query ke chache me store kar do an ab hamara data chache me store h to us data ko ham (mutate/change) kar sakte h is (usemutation function ki help se)
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>  
      signInAccount(user),  // ye function hamara appwrite se call kraya gaya h for creating a session mean signing-in  user  // yaha ye isliye call karaya h taaki signing in ke time jo bhi data as input form me bahara data jo is function se backend me data verify kiya jata raha tha us data ko query ke function is usemutaion se chache me store kara de aur fhir is query funtion ko ham apni sigup file me call kara denge for creating a session mena signin a user //but agar ham direct signin wala function jo yaha call karaya h usko agar direct (signup ) file me call kara dete to hamara user signin ho jata directly bina data ko cahache me store karaye isliye ye pahle yaha call kara kar isko function me band kiya h fhir isko signupform file me call karaya h because waha to hame bas koi aisa function call karana h isme appwrite ka signin function code likha tabhi sigin session ko create kiya ja sakta h ab ya to direct tum us function ko waha sginup file me call kara do to bhi session create ho jaayega ya yaha call kara kar function me band karke is function ko wala signup file call kara do dono se hi session create hoga bas is query waale function ko call karayenge to session bi create  hoga aur data bhi chache me store hoga      
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,  // signOutAccount ye hamara api.tsx ka function h jo hamara current account ko delete karne me use kiya ja raha h api.tsx me isne return me yahi retun kiya h ki delte current account ab is data ko ham query me save kar rahe h jisse ye cahche me stire ho jaaye taaki is data ko ham kabhi ham change kar sake      yaha files kuch iase kam karti h ki function banata h (api.tsx) < {usdata ko modification ke liye store karate h (query.tsx)me } < fhir is query function ko call karenge us file me jis file me ye appwrite ka function ko work karana h mena (perticular file ) jaise is function ko ham call karenge (topbar) file me because wahi hame is app write ke function ki jarrurat h for signout button me work karane ke liye 
  });
};

// ============================================================
// POST QUERIES
// ============================================================



export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,  //(getRecentPosts) calling this function frem api.tsx for storing that data of post which is going to render onpage 
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();    //(QueryClient) hamara query ka inbuilt function h jisko hamne uuper import kiya h aur function ka use ham apni line no.97 me kar rahe h   
  // ye function saari exixting post ki query banakar mean mutable post banakar store karega jisse ham us  query data of posts ko onscreen call kara sake    
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    // createpost is a appwrite function hamne isko api.tsx file se call karaya h aur usme jo data pass kar rahe h wo is (post)varaible me store h  
    onSuccess: () => {   // ye line hame indicate kar rahi h ki ak mutable post create ho gayi h and ready for render on homescreen
      queryClient.invalidateQueries({  // is line ka matalab h ki (queryClient) me jo recent post hamari store h wo revised hogi hamari nayi upcoming new post se jo ki hamari nayi bani h uske data ko from backend se get karenge aur isse ham har baar ak nayi post ko get kar sakt h apne home page per na ki puraani waali ko onscreen per render karate rahenge 
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS], // qurykey varaible hamari help karega anyi post ko get karne me because ye as key work karega because har baar jab nayi post banegi to uska data doosari post se alag hoga to us post ko hi ham as key use kar rahe h is function me differentitiate karne ke liye because is mutate function se bahut saari files pass kar rahi h jo onscreen per render hone waale h to ye uuper wala (queryclient) baar baar use hoga but agar usme diffrenetiate karna h ki konsa data recent h aur konsa previous to uske liye ham har post ke data ko as key use karenge 
        // [QUERY_KEYS.GET_RECENT_POSTS] mena querykey file se (GET_RECENT_POSTS)is varaible me band data ko nikalo aur yaha per use karo for private the data hamne qurykey ak alag file banali h nahi to ham isko yahi direct key likh dete 
      });   // ab hamne ye jo post craete kar li h apne backend me isko home screen per render karenge apni home.tsx file me call karke 
    },
  });
};

export const useGetPostById = (postId?: string) => {
  // console.log(postId)
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,// ye line bahut imapotant h ye line hame helpful hogi data ko fast reget karwaane me jaise hame koi post ko upadet kiya to us time hamne uski details ko backend serevr se mangaya mean get kiya to us time query kis wajah sewo data hmara cahche me kuch der ke liye store ho gaya   but fhir hua ye ki turant hi hame post me fhirse kuch edit karna tha to ye line hamari is function ko re-enable karegi with same data jo ki hamara chache me store h is line ki wajah se ham apne same post ko instant edit kar sakte h just because ye line hamari active hogi is function ko same data ke saath reedit karwa degi hamari post ko agar ham is line ka use nahi karte to wo backend se get kiya hua data hmara cahche me to store hota but is get function ke dubara se call hone per cahche se data na manga kar wo server per requst maar deta use lagta ki koi doosari post h jo ki edit ho rahi h to iske data ko get karne ke liye back server per requst maaro aur data get karo 
    // (!!userid) mean jaise hi userid activate hui to (userid) me true pass hua phir (!)iski wajah se false hua fhirse (!)iski wajah se (true hua) aur ye (enable) me (true) pass hua mean same function ko same data se run karo aur post ko editkaro 
  });
};



export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};



// basically ye query ke functions kis tarike se work kar rahe h wo ham samajhte h aur ye hame tab samaj me aya jab ham (query-advanced) ki video dekh ke aaye 
export const useSavePost = () => {    /// ye hamne apni marji ka ak function bana kiya h jiska hamne kuch bhi nam de diya h  
  const queryClient = useQueryClient();
  // basically ham bina is line ke ham kisi bhi query ke functio  ko perform nahi kara sakte h isliye is line ko likhna jarruri h jaha bhi ham query function ko use karte h 
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
    // is function me hamne (2varaible) pass kiye h aur unke type kya h wo define kiya h iske ander    
    savePost(userId, postId),    // ye wo function h jiski request hame apne backend server per maarni h usoi ke liye hamne is (mutation)fu ction ka use kiya h aur ye jo function h (savepost) ye hamara appwrite ka function h jo ki hamne (api.tsx) me bana rakha h jiska kaam hamne us file me likh rakha h bas hame is function ko perform karne ke liye ak aisa function chhahiye tha jo backend/server per request maar sake is function ki wo kaam ye query function kar raha h backend per request maar kar aur iska work perform kara kar backend per
    // but jab tak ye qury ka function hamre (savePost) function ki request backend server maarta h aur wo backend me execute hoti h tab tak iske ander pass kiye hue data ko hold bhi karke rakhna hoga nahi to backend per wo data kaise pass kar paayenge uske (savepost) function ko kaise perform kar paayenge to ye query us data ko (cahche) me store karke rakhega tab tak wo data jo ki jis function  me pass kiya ja raha h jiski request backend per maari jaa rahi h  
      onSuccess: () => {  
        //uuper wala mutaion function hamara sirf data ko post kar sakta h api/backend me sirf but wo us data ko onscreen render nahi kar sakta like uuper hmara ak fetch function chal raha h jiska kaam h ki jo data backend me store h us data ko fetch karke onscreen render karna lekin wo function sirf tab hit hoga jab aap page ko relaod karoge ya initially apne webpage per jaaoge because fetch karke data ko onscren render karne ki request bas ak baar jaayegi jab ham page ko initially open karte h but like tumne onsite se koi data backend me bheja h update karke to wo data hame render nahi hoga onscren because fetch request hit nahi hogi wo initially hit ho chuki h data ko render karne ke liye isliye har ak mutation ke baad hame ye (onsuccess) function lagan jarruri hota h like issse ham baaki ka kaam kara sakate h jaise hi hamara mutation function successfully execute ho jata h to because ye function chalne ka matalab hi ye hota h ki mutation function successfuly run ho gaya but ab ham ye chhahte h ki jo data hamne server per send kiya h usko fetch karke render karo to ham yaha ye (invalidatequery)function ka use karenge jo ki hame hamare liye hamare koi bhi function ko chala sakta h bus hame us function ki details is function me pass karne h like ham chhahte h ki jis function ka (querykey --anything---) h uske data ko onscren render karo jo upadted h mena refetch karo backend me aur fhir jo data mile iska wo onscreen render karo 
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],  // jis data ko ham apne chache se hata rahe hote h uska key kya h jisme wo store hua tha wo yaha (dena) jarruri hota h  
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    //call updatepost function from(api.ts) and usme data pass kara rahe h post varaible ke through
    onSuccess: (data) => {
      //uuper wala mutaion function hamara sirf data ko post kar sakta h api/backend me sirf but wo us data ko onscreen render nahi kar sakta like uuper hmara ak fetch function chal raha h jiska kaam h ki jo data backend me store h us data ko fetch karke onscreen render karna lekin wo function sirf tab hit hoga jab aap page ko relaod karoge ya initially apne webpage per jaaoge because fetch karke data ko onscren render karne ki request bas ak baar jaayegi jab ham page ko initially open karte h but like tumne onsite se koi data backend me bheja h update karke to wo data hame render nahi hoga onscren because fetch request hit nahi hogi wo initially hit ho chuki h data ko render karne ke liye isliye har ak mutation ke baad hame ye (onsuccess) function lagan jarruri hota h like issse ham baaki ka kaam kara sakate h jaise hi hamara mutation function successfully execute ho jata h to because ye function chalne ka matalab hi ye hota h ki mutation function successfuly run ho gaya but ab ham ye chhahte h ki jo data hamne server per send kiya h usko fetch karke render karo to ham yaha ye (invalidatequery)function ka use karenge jo ki hame hamare liye hamare koi bhi function ko chala sakta h bus hame us function ki details is function me pass karne h like ham chhahte h ki jis function ka (querykey --anything---) h uske data ko onscren render karo jo upadted h mena refetch karo backend me aur fhir jo data mile iska wo onscreen render karo
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],     // yaha hamne query key me us post ki id bhi pass kar di h jis post ke data ko hame backend se refetch karke onscreen render karana h
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
    deletePost(postId, imageId),  // function calling from (api.ts)
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],  // ye line hamne isliye likhi h kis agar kisi post ko hamne delete kar diya h to wo backend se bhi delete ho gayi hogi to ab backend se dubara saari post ko fetch karo jo bachi h because jo post delete ho rahi h wo onscreen se tabhi gayab hogi jab post fetch karke re-render karne ki reuest server per jaayegi mena jitni backend me bachi hui post h unko render ko aur jo delete hogi h backend se wo post ko ab render ho nahi paayegi onscreen per because wo backend me h hi nahi  
      });
    },
  });
};


export const useGetPosts = () => {
  return useInfiniteQuery({     // this is a built in react query feature
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,  // calling this from (api.ts)
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {    // next page ham param ke through get karte h mena jitne page ki post onscreen render ho chuki h wo information hame ye param dega and ham next page jo get kar rahe h with (10) post of fetching data from backend aur agar wo page last h jiski posts render ho raha scrolling me than wo page ham yaha render kar rahe h mena page no. pass kar rahe h   
      // If there's no data, there are no more pagesthan this (if)statement activate
      if (lastPage && lastPage.documents.length === 0) {
        return null;   // and render nothing on downscrolling
      }
      
      // now we find the lastpage through the $id of the last document and the cursor/loader stop loading data  .
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};


export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],   // qury ki me har ak wo cheej likhni padti h jise ham apne sever se fetch kar rahe h like ham yaha (2)cheeje fetch kar rahe (theterm) jiski post backend me store h and (get the posts of serched earler )
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm,    // ye line hamari help karegi is function ko dubara chalane ke liye jaise hi koi naya term pass kiya jaaye serchbaar me serch karne ke liye  // like jaise hamne koi post ko serch kiya kuch likhke serch baar me fhir hamne us term ko hatake doosara term likh diya us baar me than ye line hamare is function ko turant reactivate karegi aur naye term ki request hit karegi aisa nahi h ki ak baar ht kar diya ab dubara page refersh karo tabhi naya term likha paayenge is line ki wajah se ham bina page ko reload kiye apne naye term ki serch ki request back server per dubara turant maar paayenge yahi fayada h is line ka  
      });
    };
// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    // ye function (current)login user ki details ko (auth)section se get kar raha h uski (api.tsx) ke (getCurrentuser)function ko call karakar  aur is detail  ko (poststat) file me bej raha h jaha ak function me details required h jisse ham us user ke save section ko dekh sake usme kitni post save h
  });
};

export const useGetUsers = (limit?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: () => getUsers(limit),
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};







      


//  basicaaly Query ka bas itna kaam hota h ki ye hamare function ki (request) maarti h backend server per jo hamne (appwrite ke function bana rakhe h unki ya jo bhi function banake is qury function me request maarne ke liye likhe h ) aur us function me pass ho jaane data ko apne chache me store karke rakhti apne ander for small peroid of time jba tak wo data ka request server/backend me na chala jaaye aur uske saath jo bhi work perform karana h wo perform na ho jaaye jaise hi us data ka work perform ho jata h backend ke saath waise hi hamara wo chache data vanish ho jata h cheche se       