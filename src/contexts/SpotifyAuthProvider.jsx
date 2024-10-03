import { createContext, useContext, useState } from "react"

export const spotifyAuthScaffold = {
    access_token: "",
    token_type: "",
    expires_in: "",
    refresh_token: "",
    scope: ""
}

export const SpotifyAuthContext = createContext(spotifyAuthScaffold);

export function useSpotifyAuthContext(){
    return useContext(SpotifyAuthContext);
}

const clientid = "7795a22ff57d4d9c90f4650ea727d6af";


export function SpotifyAuthProvider({children}){
    // Code required for spotify sign-in process, not usabnle in api requests
    let[userAuthCode, setUserAuthCode] = useState("");
    // User access tokens and refresh token - represents the current  signed-in user
    let[userAuthData, setUserAuthData] = useState(spotifyAuthScaffold);

    useEffect(() => {
        // Attempt to find any query params from our current page url
        const params = new URLSearchParams(window.location.search);
        // Retrieve the auth code from the query params
        const code = params.get("code");

        //  http://localhost:5173/spotifycallback?code=adasdasdsadqw
        // code = adasdasdsadqw

        setUserAuthCode(code);

    }, []);

    useEffect(() => {

        async function getAuthData(){
            const authData = await getAuthTokens(clientId, userAuthCode);
            setUserAuthData(authData);
            // This cleans up the URL in the browser tab
            // removing the Spotify auth data so it doesn't impact the pageload useEffect
            window.history.replace(null, "Spotify Statsboards", "/");
        }
        if (userAuthCode){
            getAuthData();
        }

        // When userauthcdoe changes or initialises, we'll try and run this useEffect
    }, [userAuthCode]);

    async function getAuthTokens(clientId, code){
        const verifier = localStorage.getItem("verifier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append ("grant_type", "authorization_code");
        params.append ("code", code);
        params.append ("redirect_uri", "http://localhost:5173/spotifycallback");
        params.append ("code-verifier", verifier);

        const result = await fetch("https://accounts.spotify.com/api/token", {
            methods: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded"}
        });
    
    }


    return(
        <SpotifyAuthContext.Provider value={{userAuthData}}>
            {children}
        </SpotifyAuthContext.Provider>
    );
}