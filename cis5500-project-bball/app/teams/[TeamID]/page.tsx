"use client";
import "./teampage.css";
import Image from "next/image";
import {useState, useEffect} from "react"
import Link from "next/link";


export default function Page({params} : {params: {TeamID: string}}) {

    const [team, setTeam] = useState([{TeamName: "Loading", TeamID: params.TeamID, TeamConference: "Loading", TeamDivision: "Loading", AveragePointsPerGame: "Loading",
    PlayerID: "Loading", Name: "Loading", AverageAssistsPerGame: "Loading", AverageReboundsPerGame: "Loading", Position: "Loading", Country: "Loading", CollegeID: "Loading"
    }]);

    useEffect(() => {
        fetch(`http://localhost:3001/teams/${params.TeamID}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setTeam(data)
            console.log(team)
        })
    }, []);

    let table = <table className = "TeamPage-table">
    <thead>
        <tr>
            <th>Name</th>
            <th>PPG/APG/RPG</th>
            <th>Position</th>
            <th>Country</th>
            <th>College</th>
        </tr>
    </thead>
    <tbody>
        {team.map((player, index) => (
            <tr key = {index}>
                <td className = "TeamPage-table-name-parent">
                    <div className = "TeamPage-table-name">
                    <Link href = {`/players/${player.PlayerID}`}>
                        <div className = "TeamPage-table-player-headshot">
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
                        <div className = "TeamPage-table-player-name">{player.Name}</div>
                    </Link>
                    </div>

                </td>
                <td className = "TeamPage-table-stats">
                    {player.AveragePointsPerGame === "Loading" ? "Loading" : 
                    (Math.round(parseFloat(player.AveragePointsPerGame) * 10) / 10).toString() + "/" + 
                    (Math.round(parseFloat(player.AverageAssistsPerGame) * 10) / 10).toString() + "/" + 
                    (Math.round(parseFloat(player.AverageReboundsPerGame) * 10) / 10)}
                    
                </td>
                <td className = "TeamPage-table-position">{player.Position}</td>
                <td className = "TeamPage-table-country">{player.Country}</td>
                <td className = "TeamPage-table-college">{player.CollegeID} </td>
                


            </tr>
        ))}
        </tbody>
    </table>

    return (<div className = "TeamPage">

        <div className = "TeamPage-top">
            <div className = "TeamPage-top-img">
                <Image src = {`https://cdn.nba.com/logos/nba/${team[0].TeamID}/primary/L/logo.svg`} style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={400}
                        height={500}
                    alt = "Team logo">

                </Image>
            </div>
            <div className = "TeamPage-top-description">
                <div className = "TeamPage-top-name">{team[0].TeamName}</div>
                <div className = "TeamPage-top-info">{team[0].TeamConference} Conference | {team[0].TeamDivision} Division </div>
                <div className = "TeamPage-top-stat-summary">
                    <div className = "TeamPage-top-stat-division"></div>
                            
                </div>
            </div>
        </div>
        <div className = "TeamPage-body">
            <div className = "TeamPage-body-section">
                <div className = "TeamPage-body-section-title">
                    Players
                </div>
                <div className= "TeamPage-body-section-body">
                    {table}
                </div>
            </div>

        </div>

    </div>)
}