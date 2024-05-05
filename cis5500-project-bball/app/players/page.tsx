"use client"

import "./players.css";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {

    const [players, setPlayers] = useState([{BirthDate: "Loading",
        CollegeID : "Loading", Country : "Loading", Height : "Loading", Name : "Loading",
        PlayerID : "Loading", Position : "Loading", TeamID : "Loading", Weight : "Loading",
        AverageAssistsPerGame: "Loading",        AveragePointsPerGame: "Loading",
        AverageReboundsPerGame: "Loading",

        }]);


    useEffect(() => {

        fetch(`http://localhost:3001/players`)
            .then(res => res.json())
            .then(data_1 => {
                console.log(data_1)
                setPlayers(data_1.slice(0,50));
        }).catch(error => {console.log(error)})
    }, []);

    return (
    <div className = "PlayersPage">
        <div className = "PlayersPage-top">
            NBA Players
        </div>
        <div className = "PlayersPage-content">
            <table className = "PlayersPage-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>PPG/APG/RPG</th>
                        <th>Position</th>
                        <th>Country</th>
                        <th>College</th>
                        <th>Team</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key = {index}>
                            <td className = "PlayersPage-table-name-parent">
                                <div className = "PlayersPage-table-name">
                                <Link href = {`/players/${player.PlayerID}`}>
                                    <div className = "PlayersPage-table-player-headshot">
                                        {player.Name !== "Loading" ? <Image src = {`https://cdn.nba.com/headshots/nba/latest/260x190/${player.PlayerID}.png`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                        width={100}
                                        height={100}
                                        alt = "No Image">
                                        </Image> : null}
                                    
                                    </div>
                                </Link>
                                <Link href = {`/players/${player.PlayerID}`} >
                                    <div className = "PlayersPage-table-player-name">{player.Name}</div>
                                </Link>
                                </div>

                            </td>
                            <td className = "PlayersPage-table-stats">
                                {player.AveragePointsPerGame === "Loading" ? "Loading" : 
                                (Math.round(parseFloat(player.AveragePointsPerGame) * 10) / 10).toString() + "/" + 
                                (Math.round(parseFloat(player.AverageAssistsPerGame) * 10) / 10).toString() + "/" + 
                                (Math.round(parseFloat(player.AverageReboundsPerGame) * 10) / 10)}
                                
                            </td>
                            <td className = "PlayersPage-table-position">{player.Position}</td>
                            <td className = "PlayersPage-table-country">{player.Country}</td>
                            <td className = "PlayersPage-table-college">{player.CollegeID} </td>
                            <td className = "PlayersPage-table-team">
                                <div className = "PlayersPage-table-team-logo">
                                    {player.TeamID === "Loading" ? "Loading" : <Link href = {`/teams/${player.TeamID}`}>
                                        <Image src = {`https://cdn.nba.com/logos/nba/${player.TeamID}/primary/L/logo.svg`} style={{
                                            width: '100%',
                                            height: 'auto',
                                            }}
                                            width={100}
                                            height={100}
                                            alt = "Team logo">
                                        </Image>
                                    </Link>}
        
                                </div>
                            </td>


                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    </div>);
}