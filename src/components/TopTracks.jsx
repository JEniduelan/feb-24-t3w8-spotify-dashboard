import { useSpotifyProfileData } from "../contexts/SpotifyProfileProvider";


export function TopTracks(){
	let {topTracks} = useSpotifyProfileData();

	if (topTracks.items && topTracks.items.length > 0){
		return (
			<div id="topTracksContainer">
				{topTracks.items.map((track) => {
					return <div className="trackCard">
							
						</div>
				})}
			</div>
		)
	} else {
		return (
			<div id="topTracksContainer">
				<p>Please log in to see your top tracks.</p>
			</div>
		)
	}
}