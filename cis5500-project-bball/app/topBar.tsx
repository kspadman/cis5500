"use client";

    import "./globals.css";
import Image from "next/image";
import Link from "next/link";

import {useEffect, useState} from "react";



export default function TopBar() {

    const [searchQuery, setSearchQuery] = useState("");
    const [playerResults, setPlayerResults] = useState([]);


    //Search queries
    useEffect(() => {
        if (searchQuery !== "") {
            fetch((`http://localhost:3001/search_players/?name=${searchQuery}`))
            .then(res => res.json())
            .then(data => {
                if (data[0]) {
                    data.sort((obj1, obj2) => obj1.Name.localeCompare(obj2.Name))
                    setPlayerResults(data.slice(0, 10));    
                }
            });
        }
        
    }, [searchQuery]);

    //change state when typing in search box
    const handleTextQuery = (event) => {
        console.log(event.target.value);
        setSearchQuery(event.target.value);
    };

    let searchResults = playerResults.map((player, index) => (
        <div key = {index} className = "TopBar-search-result-player">
            <div className = "TopBar-search-result-player-left">
                <div className = "TopBar-search-result-player-img">
                    <Link href = {`/players/${player.PlayerID}`}>
                        {<Image src = {`https://cdn.nba.com/headshots/nba/latest/260x190/${player.PlayerID}.png`} style={{
                                    width: '100%',
                                    height: 'auto',
                        }}
                        width={50}
                        height={100} alt = "No image"></Image>}
                    </Link>
                </div>
                <div className = "TopBar-search-result-player-name">
                    <Link href = {`/players/${player.PlayerID}`}>
                        {player.Name}
                    </Link>

                </div>
            </div>
        </div>
    ));
                

    return(
    <div className = "TopBar">
        <div className = "TopBar-left">
            <Link href = "/" className = "TopBar-link">
                <div className = "TopBar-logo">
                    <div className = "TopBar-logo-img">
                        <Image src = "/pennlogo.png" style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={50}
                        height={100} alt = "Logo of University of Pennsylvania"></Image>
                    </div>
                    <div className = "TopBar-logo-name">PennBall</div>
                </div>
            </Link>
            <div className = "TopBar-search-parent">            
                <input className = "TopBar-search" type = "text" placeholder = "Search for player or team" onChange = {handleTextQuery}></input>
                <div className = "TopBar-search-results">
                {searchQuery !== "" ? searchResults : null}

                </div>
            </div>
        </div>
        <div className = "TopBar-right" >
            <div className = "TopBar-buttons">
                <div className = "TopBar-players">
                    <Link href = "/players" className = "TopBar-link">
                        Players
                    </Link>
                </div>
                <div className = "TopBar-teams">
                    <Link href = "/teams" className = "TopBar-link">
                        Teams
                    </Link>
                </div>
            </div>
        </div>
    </div>);

}