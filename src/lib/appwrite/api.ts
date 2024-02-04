import { ID, Query } from "appwrite";
// notepoint ye h ki jab ki appwrite ke backend me koi attribute ya varaible banao data store karne ke liye to wo jaisa banao like capital me ya small letter me exect waisa hi apne code me use define karna nahi to wo backend ke us varaible se match nahi kiya apka code ka varaible to error show kar dega  
import { appwriteConfig, account, databases, avatars, storage } from "./config";   // isme jo define h jo import karaye gaye h yaha  wo sabhi function responsible h kisi bhi appwrite ke function ko perform karaane ke liye like (account creation ke liye (account) varaible) ko yaha import karana jarruri h jo ki define h config file me ak account ko create karne ke liye 
// 
import {INewUser, INewPost, IUpdatePost, IUpdateUser} from "@/types";      // ye sabhi functions type define karne liye import kiye gaye h taaki hame yaha un varaibles ke type is file me define na karne pade direct unko is function se refere kara de     

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) { //(user: INewUser) user me hamara inputbox ka sara details store h usko ham (INewUser)se refere kara rahe h ki (user)varaible me jo details store h like (email,password) to unka type hame yaha define karne ki jarrurat nahi h usko hamne is (INewUser) functon me pahle hi define kar diya h isko yaha is file me import bhi kar diya h  
  try {
    const newAccount = await account.create(   // ye code se hamara ak naya user create hoga appwrite ke backened me aur waha ham neeche di hui details ko appwrite me store karayenge tabhi ak user create hoga
      ID.unique(), // ye hame per new user ke create hone per ak nayi id generate karke dega aur usko appwrite ke id section me store karayega aur neeche di hui user me stored details ko appwrite ke newuser create section ke form me fill karayenge neeche un details ko call kara kar 
      user.email,    // like ye line mean (user)varaible se email nikalo aur usko appwrite ke create new user ke form me jo email section h usme store kara do 
      user.password,
      user.name
    );
// create account karke ham bas authentication create kar paate h mena ki ab hamara user hamare app me ghus sakta h but aur khuch nahi kar sakta like(postcreate aur like)  isse sirf authentication create hota h but isse hamara koi (user) nahi banta h like instagram me har account ka user h jiska link baaki cheejo se h jaise ki post create karna save karna ye sabhi kaam ak userid karti h aur usi me hamari post save hoti h to ye user hame create karna hoga apna wo hamne neeche create kiya h Newuser karke
    if (!newAccount) throw Error;   // agar account bana hua nahi h to error show karega

    const avatarUrl = avatars.getInitials(user.name);  // ye ak appwrite ka function h jo ki hamara url banane ke liye use hota h ye hamare liye user ki id ka userl banayega jisme hamne (user varaible me store name ) ko url generation me pass kar diya h for generating perticular id url

    const newUser = await saveUserToDB({  // ab ham jo naya user create kar rahe h  wo hamara link hoga hamaare authnticated user se jisne apna naya account banaya h us account ki ak nahi id/userid banayi ja rahi h is code se aur wo userid details hamaari database section me store hogi
      accountId: newAccount.$id, // yaha ham jo user ki id jo generate kar rahe h usko apne authenticated person mean jis person ne account banaya h auth section me detils bahr kar usse is new generate ki hui id ko link karane ke loye hamne is code ko aise likha h ki newAccount naam ka jo varaible jo uuper defined h jisme us people ki detils stored h jisne apna account banaya h waha se same details ko ham nikaal rahe h aur yaha is userid ko create karne ke liye wahi details ko use kar rahe h isse ham account ko new generating userid se link kar rahe h like yaha ham jo jo details as input me le rahe h wo hamare (databse me users naam ke section ke attributes me store hongi)
      name: newAccount.name,    // name naam ki detail newaccount ke varaible mese name naam ke section se nikaalo aur yaha per is name naam ke attribute me store karo 
      email: newAccount.email,
      username: user.username,   // username section hamare signup form me h per uuper ke code me ham use store karana bhool gaye isliye ham is detail ko direct signup from se get kar lenge becuase jo bhi details us form me bhari ja rahi h wo sabhi as value is user variable me store ho rahi h 
      imageUrl: avatarUrl,
    });

    return newUser;   // jab hamara auth/account create hoga user ke signup form ko bharte hi to usse linked ye uuper userid/account bhi apne aap create ho jaayega tabhi to yaha return me (newuser h na ki newaccount) becuase newaccount create hote hi apne aap newid bhi us user ki create ho jaayegi automaticaaly aur wo as return me hame milge jab user new account ko create karega   
  } catch (error) {
    console.log(error , " error in api.ts file createNewUser section");
    return error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {    // jo uuper hamne function banaya h uske ander ki details ko hamne yaha define kiya h 
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(    // ab jo bhi data hamne (newuser)varaible me uuper ke code me user ki id ko generate karne ke liye usko databse me store karayenge appwrite ke is code se 
      appwriteConfig.databaseId,   
      appwriteConfig.userCollectionId,
      ID.unique(),
      user  // user yaha ak object ki tarah work kar raha h jo ki apne ander signup form ke saare data ko contian kiye hue h wo ham is databse function me pass kar rahe h taaki use store kara sake 
    );

    return newUser;    // ye function hame return me is varaible ke ander ka store data as output dega jaha bhi is function ko ham call karenge 
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {  // ye hamne ak function khud ka banaliya h jime hamne user ko define yahi kar diya uuper signup ke code ki tarah kisi aur file me (user) variables ko define nahi kiya h yahi define kar dioya h because thode ji varaibles the 
  try {
    const session = await account.createEmailSession(user.email, user.password);  //(createEmailSession) ye ak appwrite ka function h for creating a session function jisme hamne (user) varaibele se in dono varaibels ka data nikal kar is function me pass kar diya h  (user ak varaible h jo onpageform )se sara data apne ander store karata h aur fhir us data ko ham kahi bhi call kar lete h 
// (createEmailSession) basicaaly ye apprite ka ak function ho rechecke karta h details ko verify karta jo isme pass ki gayi h kya wo backend data jo appwrite ke auth me store h usse match kar rahhi h ki nahi agar match kar jaaye to hame account me in kar jaane de usi ko session bolte h  
    return session;     // retrn me hame jo passing data mila h usi ko return kar dega // return wo function agar apne hi varaible ko return kar de to iska matalab hota h ki jab us function ko kahi bhi call karaoge to wo waha as input is function ka stored data dega becuase ye function apne retun me wo varaible return kar raha h jo sara data ko store kar raha h to is function ko call karane per return me hame wo data mil jaayega jo is function me store hooga 
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT        // mean finding that account in auth section of backend using signin details
export async function getAccount() {
  try {
    const currentAccount = await account.get();  //(account.get()) ak appwrite function h for get the stored data of user already given

    return currentAccount;   // return me wahi (get) function ka stored data as output dega ye varaible jaha bhi is  (getAccount()) function ko call karayenge because ye functionn return me (currentAccount)varaible return kar raha h jo ki apne ander (get)function se backend ka stored data of user ko contain kiya hua h 
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER            // if account get findout from above code than us same account ko hamne apne databse section me bhi store karaya h savetodb karke taaaki signin hone ke baad apne aap us user ki userid mean uska instagram account create ho jaaye to ab us userid ko ham apne backend ke databse section me dhoondenge jaha us user ne jab id banayi hogi to kuch cheeje as input di hongi like (usename,name,bio) aur agar us usner ne userid nahi banayi h to wo apne aap bangayi hogi jab us user ne signup kiya hoga tab aur waha jo jo cheeje mangi hongi isrf wahi cheeje only us automatic created userid ke varaibles me store hogyi hogi jise wo baad me edit kar sakta h apne profileedit section me jaake jo update ho jaayenge by setuser function in (authcontext file )    
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();  //(getAccount()) ye function uuper define h ye user ka stored auth data ko as return dega agar data hoga backend me to dega nahi to nahi dega aur usko store karayega is saamne waale varaible me  

    if (!currentAccount) throw Error;   // agar is varibale me data aya to thik h aur nahi aya mena ye error throw karega is code se

    const currentUser = await databases.listDocuments(   // agar as input hame currentAccount me kuch data milta thriugh (get) function of appwrite than mean hamara account exixt kar raha to us account ko ham retrive/get/fetch karenge  from database jaha bhi wo data store hoga mean us authuser ki jo userid stored h in database   
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      // uuper ki line se ham position de rahe h ki us data mean user ka account data exixt kar raha h ki nahi to us data ko ham is postion waali id me dhoodhenge 
      [Query.equal("accountId", currentAccount.$id)] // ham jo data dhoondh rahe h user ka ki uska userid h ya nahi wo data ko ham fectch/(dhoondo aur copy karo) karenge from backend databse se  aur arry ki form me store karayenge isliye ([]ye bracket use karenge) yaha jo hamne (query) ka use kiya h wo appwrite ka code h na ki (query ka )  // ye query hamara data ko backend se fetch karenge agar wo data exixt kar rah h to aur usko array ki form me store karega fhir is (currentUser) me store karayenge query us data ko backend me (id) se serrch karegi aur wo id lega from  function (currentAccount) varaible se jo store kiya hua h us id ko match karega poore backend ke data se jisse match ho jaayega us data ko data ko waha se retrive karke is (currentuser) me store kara dega ye function    
     );

    if (!currentUser) throw Error;  // agar is varaible me data retrive hoke store hua to thik aur agar nahi hua to error show kardo

    return currentUser.documents[0];  // jab hame wo data backend se mil jaayega mena hamara userid backend me exixt kar raha h to ye jo poora function hamne banaya h agar is (getCurrentUser()) function ham kahi bhi call karayenge to waha hame (currentUser) is varaible me store data mean retrive kiya hua data of exixt userid(jisme us user ka each data like stored bio,username,name) as output milega  jise ham aage use kar rahe h apni authcontext.tsx file  me  
  } catch (error) {
    console.log(error);
    return null;
  }
}

// // ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// // ============================================================
// // POSTS
// // ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
   // uploadfile is a function jo ki hamne neeche line (167) me define kiya h for uploadfile and is function me ham pass kar rahe h apne (appwrite ke databse ke post )section ke (0)th mean sabse uuper waali file ka data is data ko is (uploadedFile)varaible me store kara liya h 
  //  console.log(post) 
   if (!uploadedFile) throw Error;   // agar is varaible me koi bhi data store na ho to error show kare 

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    //(getFilePreview) is function ko line no. (183) me define kar rakha h jisme ham pass kar arhe h (id) jis image ko hamne upload kiya h usi taaki ham apni image ka preview karke dekh sake ki jo file hamne upload ki h wo wahi h ya koi aur upload ho gayi 
    if (!fileUrl) {   // agar file url me koi bhi data nahi ata h previw karne ke liye to mean us file ka data corrupted h mean us file ko backend se delete kar do 
      await deleteFile(uploadedFile.$id);      
       // deleteFile is function ko line no. (204) me define kar rakha h for deleting image jisme hamne id pass ki h jis image ko delete karna h us image ki
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
                 // kisi post me pahle se hi tags h aur un tags ke beech me agar space h to us space ko negelect karo (g)mena globaly and tags ko seperate karo (,) se aur un tags ko backend me store karo as an array form 

                 // Create post
                 const newPost = await databases.createDocument(
                   // ye uuper waali line hamara sara data ko database ke section me store kaarane ka kaam karta h  
                   appwriteConfig.databaseId,
                   appwriteConfig.postCollectionId,    // yaha hamne apne database section ki post section ki id di h because wahi ham is data ko store kra rahe h 
                   ID.unique(),
                   {
                     creator: post.userId,     // post section  me ham creator varaible me post varaible ke userid ki id ko store kara rahe h 
                     caption: post.caption,
                     imageUrl: fileUrl,  // file url hamara uuper define h jisme hamne url banaya h apne image ka usko is iamgeurl varaible me store kara rahe h 
                     imageid: uploadedFile.$id,
                     location: post.location,
                     tags: tags,
                    }
                    );

                    if (!newPost) {   // agar hamare is newpost varaible me data aata h store hone ke liye jo hamne uuper diya h to wo backend me store ho jaayega mean ahamra post craete ho jayegi but agar is varaible me koi naya data na aye mena hamara data kahi corrupt ho gaya h to ham us poore data ko hi delete kar denge is neeche ke delete function se taaki koin error filr hamare backend me store na ho
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// // ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      //storage.createFile ye function hamara responsible h for create aur upload file in storage section of appwrite 
      appwriteConfig.storageId,   //jaisa ki hame pata h koi bhi appwrite ka koi function use karte h to (3)tarah ki id deni hoti h to ye h storage ki id 
      ID.unique(),    // ye h us storage me data store karenge to us perticular image/data ki random generated id
      file     // and jis file ko store kar rahe h wo file mena (image)
      );
      
      // console.log(uploadedFile.$id)
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }
  
// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  // jis bhi post ko hamne banaya h use ak file banakar rakh rahe h taaki use ak baar me delete kar sake uska (fileId) as input is funtion me liya h 
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,  // width of image
      2000,   // height
      "top",  // postion at which you want to see image as preview on page 
      100    // quality in which you want to see image in preview that is 100 mena (top quality)
    );
    // console.log(fileId)
    if (!fileUrl) throw Error;

    return fileUrl;    // ye sab data jo isme store h as output ham return ar rahe h ab jaha bhi is varaible ko call karenge waha iske ander ke data ka access le sakte h 
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  // console.log(fileId)
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)] // Query.limit(20)mean onpage per sirf 20 post show hongi
       // (Query.orderDesc) mena decending order me post onscreen show hongi mena jo post at last create hogi wo onscreen sabse uuper hogi baaki sab uske just neeche hogi 
      );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  // likepost hamne ak function banaya h jisme 2 naye terms banaye h postid and likesarry dono ke type define kar diye h aur is function me pass kar diya h jisse ham in terms ko use kar sakte h apne function me kabhi bhi
  try {
    const updatedPost = await databases.updateDocument(  
      //(updateDocument) is a appwrite inbuilt function jiska use ham databses section me use kar rahe h for update post
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,  // jis post ko edit kar rahe h uski id 
      {   // ye bracket me ham ye batate h ki ye kis data ko update kara rahe h har function me id's dene ke baad data allot karna bhi jarruri hota h ki kis data ke baare me baat kar rahe h  hamare database me postcollection naam ka section hoga jaha per hamara ye varaivle waha store hoga (object form me aur usme ye likecount array ki form me store hoga jo ki usdate hoga is function ki help se ) 
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  } 
}
// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  // jo post ham save kar rahe h usko 2 cheeje chahiye hogi as input konsipost save ho rahi h to postid and kis user ki post save ho rahi h to uski userid 
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),    // unique id deke ham us post ko save kar rahe h jis location ko hamne uuper alocate kiya h 
      {
        user: userId,    // kis userid ke account me post save ho rahi h wo (id ) hamare backend me aise hi (object me band hoke store hogi ) database ke savecollection section me  
        post: postId,     // kis postid/post ko save kiya ja raha h uski id is varible me save hogi
      }  
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      // get data form backned server of post
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}
// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;   // ye line se ham ye bata rahe h ki update karne ke liye jo data hamne pass kya h onscreen se (post)varaible me pass kiye h wo (0)se jayada caharacters h than ye function chalega aisa nahi h ki hamne kuch update hi nahi kiya sirf edit per click karke ham form per pahuche per hamne kuch edit nahi kiya to hamara ye fucntion faaltu me na chale aur backend per koi update ki request na maare because jaise hi ham submit button per click karenge to backend per request hit hogi update ki but is backend me kuch bhi update nahi hoga because agar ye function nahi chalega appwrite ka to ye function hamara tab nahi cahelga jab post varaible me (0)caharacyer pass kiye jaayegenge update ke liye 
// console.log(post)
try {
  let image = {
    imageUrl: post.imageUrl,
    imageid: post.imageid,
  };
  
  if (hasFileToUpdate) {
    // Upload new file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;
    
    // console.log(uploadedFile.$id)
      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageid: uploadedFile.$id };
     // image ko update karna h to us image ko spread karenge aur uske data ko bhi get karenge differnt varaibles se aur unko store karayenge in varaibles me jo backend me bane hue h aur wo sara data ko object me band karke (image)varaible me store karayenge 
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,   // image varaible me jo data store h uuper waha se ham uske data ko get karke apne backend me store kara rahe h  
        imageid: image.imageid,
        location: post.location,
        tags: tags,
      }
    );

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageid);    // agar update karate time kuch kisi glitch ki wajah se hambackend me data ko store karane me fail jo jaate h to wo trash file hamare backend me store na ho uske liye ham ne ye likha h jisse ow data backend se delete ho jaayega agar wo successfully store nahi hua backend me to wo delete ho jaaye apne aap backend se is function se   
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageid);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return; 
// console.log(postId)
// console.log(imageId)

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,  
      postId
    );

    if (!statusCode) throw Error;  // ham apne backend me us post ko dhoodege ki uski post id se agar wo exixt kar raha hoga to delete function chalakar post ko delete kar denge jo neeche likha h aur agar backend me wo post exixt nahi kar rahi h like us post ki postid backend me store nahi h ya imageid nahi mena wo post backend me nahi h to (error) throug kar denge 

    await deleteFile(imageId); // ye delete function chalega passing imageid ke post ko backend se delete karega  
    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}
// // ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]  // yaha hamne (2 parameter) pass kiya h query me for fething data for post what we serch in serchbar by post name that is its caption name here we deine the serch term which we serching in baar that is caption mean query serch in (caption) section that serching term caption in backend and fetch that caption related all data from backend of post and then render onscreen  
      // yaha qury function fetch karega us post ke data ko server se jiko serch kiya ja raha h serchbaar me waha se serchTerm ko pass karenge is function me and fhir ye query feth karegi us serchTerm ka data in backend and render onscreen 
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];  // yaha hamne limit laga rakhi h ki  jo post ham fetch hamari fetch hoke onscreen render ho rahi wo onscreen ak baar me (10) hi render ho uske baad neeche ki (if)statement chalegi 
  // ( queries) ka type h (any) mean isme koi bhi cheej/post pass hoke aarahi hogi ko ki fetch hoke onscreen render hogi yaha hamne ak filter bhi laga diya h ki jo post hamari upadted/newcreated hogi wo sabse uuper render hogi 

  if (pageParam) { //ye kahegi ki agar user ne page per un already (10) rendering post ko dekh liya h aur wo scroll down kar rah to ak (cursor/loader)ghumega aur utne me server se 10 aur nayi post fetch hoke onscreen render hone ke liye a jaayegi
    // yaha ye page param hame onpage ki information de raha like 10 post jinko ham render kara rahe h usko ak tarike se page (1) denote kar diya h agar ak page ki post completly scroll ho jaaye down scrolling me to next page ki post ko render karo onscreen aur ye hame baatayega ki (pageparam)ki ak page ki post scroll down ho chuki h 
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries    // ye qury yaha wo saari queries ko indicate kar rahi h jo ki hamne banayi thi (queries) file me for fetching data from backend and render onscreen this line activate all that query for fetching data from server and render onscreen
    );

    if (!posts) throw Error;   // agar server se fetch karke hamare post me koi bhi data nahi ata h to error show karo 

    return posts;
  } catch (error) {
    console.log(error);
  }
}






// // ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}


// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageid: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageid: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageid: image.imageid,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageid);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}