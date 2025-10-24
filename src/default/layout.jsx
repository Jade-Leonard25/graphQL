import { Outlet } from "react-router";
import { Header } from "../components/navbar";

function OutletLayout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    )
}

export default OutletLayout