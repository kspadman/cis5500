"use client"

import "./teams.css";
import {useEffect, useState} from "react";
import Image from "next/image";

export default function Page() {

    const [teams, setTeams] = useState([{Name: "Loading", Conference: "Loading", Division: "Loading"}]);

    /*let teamsHtml = 
        ([<tr key = {0}>
            <td className = "TeamsPage-table-team">Loading</td>
            <td className = "TeamsPage-table-conference">Loading</td>
            <td className = "TeamsPage-table-division">Loading</td>
        </tr>]);*/

    useEffect(() => {
        fetch(`http://localhost:3001/teams`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
                /*
                teamsHtml = data.map((team, index) => (
                    <tr key = {index}>
                        <td className = "TeamsPage-table-team">{team.Name}</td>
                        <td className = "TeamsPage-table-conference">{team.Conference}</td>
                        <td className = "TeamsPage-table-division">{team.Division}</td>
                    </tr>
                ))
                console.log(teamsHtml);
                //console.log(teams);
                */
            setTeams(data);
            console.log(teams);
        }).catch(error => {console.log(error)})}, []);

    return (
    <div className = "TeamsPage">
        <div className = "TeamsPage-top">
            NBA Teams
        </div>
        <div className = "TeamsPage-content">
            <table className = "TeamsPage-table">
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>Conference</th>
                        <th>Division</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key = {index}>
                            <td className = "TeamsPage-table-team">
                                
                                <div className = "TeamsPage-table-team-logo">
                                    {team.Name !== "Loading" ? <Image src = {`https://cdn.nba.com/logos/nba/${team.TeamID}/primary/L/logo.svg`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                    width={500}
                                    height={300}
                                    alt = "Photo of player">
                                    </Image> : null}
                                    
                                </div>
                                <div className = "TeamsPage-table-team-name">{team.Name}</div>
                                </td>
                            <td className = "TeamsPage-table-conference">{team.Conference}</td>
                            <td className = "TeamsPage-table-division">{team.Division}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    </div>);
}