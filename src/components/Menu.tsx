import { NavLink } from "react-router-dom";
import "../styles/Menu.css";


const Menu = () => {
  return (
    <nav className="menu">
      <ul className="menu-list"> 
         <li>
          <NavLink className={ ({isActive}) => isActive ? "menu-link active":"menu-link"} to="/">Home</NavLink>
        </li>         
        <li>
          <NavLink className={ ({isActive}) => isActive ? "menu-link active":"menu-link"} to="/deposits">Deposits and WithDrawals</NavLink>
        </li>
        <li>
          <NavLink className={ ({isActive}) => isActive ? "menu-link active":"menu-link"} to="/transactions">Transactions</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;