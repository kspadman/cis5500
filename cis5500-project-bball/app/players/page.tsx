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
        AverageReboundsPerGame: "Loading", Variance: "Loading", CombinedPerformance: "Loading",
        Player1Name: "Loading", Player2Name: "Loading"
        }]);

    const [varianceState, setVarianceState] = useState(0);


    useEffect(() => {
        if (varianceState === 0) {
            fetch(`http://localhost:3001/players`)
                .then(res => res.json())
                .then(data_1 => {
                    console.log(data_1)
                    setPlayers(data_1.slice(0,50));
            }).catch(error => {console.log(error)})
        } else if (varianceState === 1) {
            fetch(`http://localhost:3001/top_players_variance`)
                .then(res => res.json())
                .then(data_1 => {
                    console.log(data_1)
                    setPlayers(data_1);
            }).catch(error => {console.log(error)})
        } else if (varianceState === 2) {
            fetch(`http://localhost:3001/top_player_pairs`)
                .then(res => res.json())
                .then(data_1 => {
                    console.log(data_1)
                    setPlayers(data_1);
            }).catch(error => {console.log(error)})
        }
    }, [varianceState]);

    const toggleVariance = () => {
        setPlayers([{BirthDate: "Loading",
        CollegeID : "Loading", Country : "Loading", Height : "Loading", Name : "Loading",
        PlayerID : "Loading", Position : "Loading", TeamID : "Loading", Weight : "Loading",
        AverageAssistsPerGame: "Loading",        AveragePointsPerGame: "Loading",
        AverageReboundsPerGame: "Loading", Variance: "Loading", CombinedPerformance: "Loading",
        Player1Name: "Loading", Player2Name: "Loading"
        }]);
        setVarianceState((varianceState + 1) % 3);
    }

    let table = <table className = "PlayersPage-table">
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

    if (varianceState === 1) {
        table = <table className = "PlayersPage-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Variance Score</th>
            </tr>
        </thead>
        <tbody>
            {players.map((player, index) => (
                <tr key = {index}>
                    <td className = "PlayersPage-table-name-parent">
                        <div className = "PlayersPage-table-name">
                            <div className = "PlayersPage-table-player-name">{player.Name}</div>
                        </div>
    
                    </td>
                    <td className = "PlayersPage-table-stats">
                        {player.Variance === "Loading" ? "Loading" : 
                        (Math.round(parseFloat(player.Variance) * 10) / 10).toString()}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    } else if (varianceState === 2) {
        table = <table className = "PlayersPage-table">
        <thead>
            <tr>
                <th>Player 1 Name</th>
                <th>Player 2 Name</th>
                <th>Combined Score</th>
            </tr>
        </thead>
        <tbody>
            {players.map((player, index) => (
                <tr key = {index}>
                    <td className = "PlayersPage-table-name-parent">
                        <div className = "PlayersPage-table-name">
                            <div className = "PlayersPage-table-player-name">{player.Player1Name}</div>
                        </div>
    
                    </td>
                    <td className = "PlayersPage-table-name-parent">
                        <div className = "PlayersPage-table-name">
                            <div className = "PlayersPage-table-player-name">{player.Player2Name}</div>
                        </div>
    
                    </td>

                    <td className = "PlayersPage-table-stats">
                        {player.CombinedPerformance === "Loading" ? "Loading" : 
                        player.CombinedPerformance}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    }


    return (
    <div className = "PlayersPage">
        <div className = "PlayersPage-top">
            <div className = "PlayersPage-top-title">NBA Players</div>
            <div className = "PlayersPage-top-toggle" onClick = {toggleVariance}>{varianceState === 2 ? "Rank by Average PPG" : (varianceState === 0 ? "Rank by Variance" : "Rank Top Pairs")}</div>
        </div>
        <div className = "PlayersPage-content">
            {table}
        </div>

    </div>);
}