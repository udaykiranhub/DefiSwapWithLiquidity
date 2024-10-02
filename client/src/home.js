
import Connect from "./connect"
import { Outlet,Link } from "react-router-dom"
import Defi from "./swap";
function Home(){
    return(
    <div className="home">
{/* <Link to="/connect" >Connect</Link> */}

    
        <Connect/>
        <Defi/>

    </div>)
}

export default Home;