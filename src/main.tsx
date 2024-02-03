import ReactDOM from 'react-dom/client';
import{BrowserRouter} from 'react-router-dom'
import App from "./App";
import { AuthProvider } from './context/AuthContext';
import { QueryProvider } from './lib/react-query/QueryProvider';
ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
    {/*  createRoot is not a product of react-dom so we use react-dom/client */}
    <QueryProvider>
    <AuthProvider>
        {/* hamne authprovider ko yaha set kar diya h mean ab is tag ke ander jitne bhi files pass karegi un sabhi file me is provider funtion me bane hue function ko access kar sakte h */}
    <App/>
    {/* duble click or select  App +  ctrl + space = import path of <App/>tag */}
    </AuthProvider>
    </QueryProvider>
    </BrowserRouter>    // this is responsible for routing pages in react
)


// jab ham apni is website ko deploy karenge to hamara jo appwrite h wo koi bhi request maarne se block kar dega isi ko hi (CORS)error kahte h mean hamara appwrite nahi chhahta h ki wo apna stored data kisi aur server per send kare like jis server per hamne apni site ko deploy kiya h wo appwrite ke backend se access maangega ki aap jo bhi data render karna chhhat h usko hamare through render karo mean hamare server per send karo but appwrite mana kar dega ham apne deta kok kisi rendom server per send nahi kar sakte wo saari request block kar dega mena na to ham signin kar paayenge na signup because jis server per hamne apni site ko deploy mena render kiya h us server per appwrite data ko send karne se mana kar deta h wo kahta h ki ham kisi anonynmous server per apna data send nahi karenge aur na pane data ka access denge is server to is error ko resolve karne ke liye hame kuch kaam karna hoga jisse appwrite us server ko access de hamare backend ke data ko render karne ka uske server per jisse wo onscreen render ho sake 
//appwrite per jaao   addplatform (web)  name of project and jis server per tumne apne website ko deploy kiya h uska link that is (vercel.app) tahn aisa karne se hamare us host jis server per ham apnedata ko render kar rahe h aur appwrite ke beech me connection built ho jaayega jisse ab wo server and only that server hamare appwrite ke data ka access le sakega data ko onscreen render karane ke liye apne server per aur koi aise access nahi le sakta jab tak appwrite se uska connection built nahi kart h ham  