import "./globals.css";
import Image from "next/image";
import Link from "next/link";



export default function TopBar() {
    return(
    <div className = "TopBar">
        <div className = "TopBar-left">
            <Link href = "/" className = "TopBar-logo-link">
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
                    Players
                </div>
                <div className = "TopBar-teams">
                    Teams
                </div>
            </div>
        </div>
    </div>);

}