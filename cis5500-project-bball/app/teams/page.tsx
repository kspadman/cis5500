"use client"

import "./teams.css";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {

    const [teams, setTeams] = useState([{Name: "Loading", Conference: "Loading", 
    Division: "Loading", TeamID: "Loading", WorstOpponentTeam: "Loading", 
    WorstOpponentPpg: "Loading", WorstOpponentPlayer: "Loading"}]);


    useEffect(() => {

        fetch(`http://localhost:3001/teams`)
            .then(res => res.json())
            .then(data_1 => {

            fetch(`http://localhost:3001/top_scorers`)
                .then(res => res.json())
                .then(data_2 => {

                for (let i = 0; i < data_2.length; i++) {
                    data_1[i]["WorstOpponentTeam"] = data_2[i].TeamName;
                    data_1[i]["WorstOpponentPlayer"] = data_2[i].Name;
                    data_1[i]["WorstOpponentPpg"] = Math.round(data_2[i].MaxPPG * 10) / 10;
                }

                setTeams(data_1);

            }).catch(error => {console.log(error)});
        }).catch(error => {console.log(error)})
    }, []);

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
                        <th>Toughest Opposing Player (ppg)</th>
                        <th>Toughest Opposing Team</th>

                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key = {index}>
                                <td className = "TeamsPage-table-team">
                                <Link href = {`/teams/${team.TeamID}`}>
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
                                </Link>
                                <Link href = {`/teams/${team.TeamID}`} >
                                    <div className = "TeamsPage-table-team-name">{team.Name}</div>
                                </Link>

                                </td>
                            <td className = "TeamsPage-table-conference">{team.Conference}</td>
                            <td className = "TeamsPage-table-division">{team.Division}</td>
                            <td className = "TeamsPage-table-opponent-player">{team.WorstOpponentPlayer} ({team.WorstOpponentPpg}) </td>
                            <td className = "TeamsPage-table-opponent-team">{team.WorstOpponentTeam}</td>


                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    </div>);
}