import "./globals.css";
import Image from "next/image";
import Link from "next/link";



export default function TopBar() {
    return(
    <div className = "TopBar">
        <div className = "TopBar-left">
            <Link href = "/" className = "TopBar-link">
                <div className = "TopBar-logo">
                    <div className = "TopBar-logo-img">
                        <Image src = "/pennlogo.png" width = {50} height = {30} alt = "Logo of University of Pennsylvania"></Image>
                    </div>
                    <div className = "TopBar-logo-name">PennBall</div>
                </div>
            </Link>
            <input className = "TopBar-search" type = "text" placeholder = "Search for player or team"></input>
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