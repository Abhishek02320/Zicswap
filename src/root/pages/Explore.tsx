import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
// npm install react-intersection-observer                  for install this useinview
import { Input } from "@/components/ui";
import useDebounce from "@/hooks/useDebounce";      // waise hame is debounce ki alag se file banane ki koi jarrurat nahi thi npm me jaake iska code treminal me likhakar install kar lete 
import { GridPostList, Loader } from "@/components/shared";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queries";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {  // jis term ko serhc kiys ja raha h wo fetch ho raha hoga backend me ustime ye loader chalega 
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents.length > 0) {
          // jo post ko hamne serch kiya tha agar uska data backens se return me ata h mean jo post backend me exixt kar rahi h to agar wo backend me exixt kar rahi h mean uski length of doucment above (0)mena hamare pass us post se relatee kuch data h to us post ko ham render karega (gridpost) file me yaha se us post ka data us file me transfer karke because jitni bhi post hame (explorer)page me dikhti h to sabhi is (gridpost file me hi render ho rahi hoti h ) but serchterm is file se us post ka data pass hoke jata h to saari post gridpost me jo render ho rahi hoti wo hat jaati h aur ye serching post render hone lag jaati h  
    return <GridPostList posts={searchedPosts.documents} />;
  } else {  // agar hamari uuper ki doo (if)nahi chali jo kahti h ki ham post ko fetch kar rahe h backend me loader chala do ya hamne dhood li h post usko render kardo than inmese ak bhi (if) nahi chalti h than ye else chalega aur kahega aapki post backend me exixt hi nahi kar rahi h 
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState('');   // jo bhi serch baar ke input box me likha jaayega wo value ke through is usesate me aake store hoga aur agar kuch changes hote h us input box ke text me to wo setserch me aake store honge
  const debouncedSearch = useDebounce(searchValue, 500);       // yaha hamne debounce isliye pass kiya h (useserchpost)me because ye ak hamara function h npm ka jika kaam h ki ye hamare query ko backserver per turant request maarne se rokega like hamne agar apne serchbaar me sirf (h)likha fhir (r likha mean) ak ak workki request back server per ja rahi hoti h jo ki ham nahi chhahte ham ye chhate  ki ak baar poora sentance ham likh de uske baad hi us serch term ki request back server per jaaye to ye debounce hame help karta h qury ke fetching function ko kuch time rokne ke liye like hamne yaha (5)second rokne ko kaha h itne me wo user apna serchterm poora likh dega fhir uski fetching request back server per jaaye usse pahle na jaaye  
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);  
                                                            //(useSearchPosts) ye wo function jiski wajah se ham jo bhi apne serch baar me likhenge uski request back server me jaayegi us term se related post serch karke uske data ko server se fetch karne ka kaam karegi mena // is function ka sirf itna kaam h ki jo bhi trem isme pass hoga uski request back server pr turant chali jaayegi

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) // agar posts varaible me hara kisi bhi post ka data nahi h to (loader chalega )
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const shouldShowSearchResults = searchValue !== "";
                              // (searchValue) ye usestate ka varaible h isme wo data store h jo hamne serch baar ke inputbox se liya tha //
  const shouldShowPosts = !shouldShowSearchResults &&
  // bhai ye line ye kah raha h ki agar hamne serch baar me kuch serch kiya h wo nahi mili saari post ko serch karne ke baad sabhi pages ki mena hamari us type ki post me document emty h to ye wala varaible chalega is varaible ko hamne neeche call kiya h text ko render karne ke liye ki jo post ko tum dhund rahe ho wo nahi h  
    posts.pages.every((item) => item.documents.length === 0);
    // yaha jo hamne (pages) term likha ye hamara posts se hi ban raha h because hamne phle hi define kar rakha h ki k page me ham sirf (10) post ko render karenge fhir jab wo (10) post user ke through scroll ho jaayegi tabhi ham nayi (10) post ko fetch karke onscreen render karenge aur yahi (10)post hamre pages me divide ho jaati h jaise hamare backend me 100 post h to 10 per page ke hisaab se apne aap (10) pages ban jaate h vertually   
    // agar kabhi bhi (pages)no defined mena typeerror aisa error show ho to mean hamaare post varaible me koi post fetch hoke nahi aa rahi h uski wajah se ye error a raha h isi error se bachne ke liye hamne (posts) ki (if) statement bana di h ki agar koi bhi post ka data fetch hoke nahi ata h backend se to is page varaible per effect na pade uski jagah loader render jho aur backserver se post ke data kp fetch kare aur agar koi post nahi h to (text render kar de (no post)ka jo hamne apni (query file me banyi)) 
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            className="flex-none"
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search . . ."
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-4 border-dashed border-2 border-sky-500 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
          // jo post user serch kar raha h agar wo post mil gayi to ye tag chalega aur post ko render karega ye tag koi alag se file nahi ham chhahte to alag se iski file bana sakte the but hamne is file ko isi file function banakar iska kaam isi file me kara diya  
            isSearchFetching={isSearchFetching}    //(isSearchFetching) basically ye (isfetching )function h jo (serchpost)function ka use kar raha h for fetching data of serchingterm wahi serching term jiske data ko ham backserver se fetch kar rahe h usi serchterm ke text ko yaha pass karenge 
            searchedPosts={searchedPosts}            //  fetched kiya hua data from server we pass in this function of serching term

          />
        ) : shouldShowPosts ? (
          // agar post jise ham serch kar rahe h wo nahi mili to ham ye text render karenge 
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          //and finally ham apni remain baaki ki post ko render karenge 
          posts.pages.map((item, index) => (
            // saare pages ki post ke data ko ak saath karo aur is serchbaar/explore waale page per render kar do 
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (   // ye hamse ye kah raha h ki serchvalue me bhi kuch nahi likha h mena serch baar me kuch bhi serch nahi liya h and hamre nextpage varaible me more data h for rendering post tha nus data ko fetch karne se pahle ye loader rener hoga 
        <div ref={ref} className="mt-10">
          {/* ye ref hi h jo hame hamre naye pages ke posts ko render karega because ye (ref) hi h jo resposnible h hamare post jo render ho rahe h wo sarare scroll ho chuke h aur ham page ke bottom me pahuch chuke h mena page ke last post per than ye ref hit karega request that we have to fetch more data of post of nextpage to render that onscreen   */}
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;