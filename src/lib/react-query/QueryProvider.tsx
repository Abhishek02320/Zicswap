import React from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// ye file hamne isliye banayi h because hamne poore project me kahi kahi rect-query ka use kiya h for (fetching data from backend ) uske liye ham is rect-query ka use karenge to ye file hame wo fetching karne me accesskarayegi agar hamne bina is file ko yaha create kiye fetching ki to ham datafetch nhi kar paayenge aur error mil jaayega 
const queryClient = new QueryClient();

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    // hamne is file ka provider bana diya h taaki ham is file ka use kar sake apne etire project ke kisi bhi file me for fetching data and for keep away or resolve every query error in the project through this file   
 
    return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};