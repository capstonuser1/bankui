// ...existing code...
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/Menu.css";

type UserLike = { roles?: unknown; role?: unknown };
const menuConfig = [
  { to: "/", label: "Account Information", roles: ["teller", "account_holder"] }, // public / all authenticated users v"teller", "admin", "account_holder"
  { to: "/deposits", label: "Deposits and WithDrawals", roles: ["teller"] },
  { to: "/transactions", label: "Transactions", roles: ["account_holder"] },
  { to: "/audits", label: "Auditor", roles: ["teller"] }
];

const Menu = () => {
  const { user } = useAuth();
  const userRoles = (() => {
    if (!user) return [];
    const u = user as UserLike;
    if (Array.isArray(u.roles) && u.roles.every((r) => typeof r === "string")) {
      return u.roles as string[];
    }
    if (Array.isArray(u.role) && u.role.every((r) => typeof r === "string")) {
      return u.role as string[];
    }
    if (typeof u.role === "string") {
      return [u.role];
    }
    return [];
  })();

  const hasAccess = (roles: string[]) =>
    roles.length === 0 || roles.some((r) => userRoles.includes(r));

  return (
    <nav className="menu">
      <ul className="menu-list">
        {menuConfig
          .filter((item) => hasAccess(item.roles))
          .map((item) => (
            <li key={item.to}>
              <NavLink className={({ isActive }) => (isActive ? "menu-link active" : "menu-link")} to={item.to}>
                {item.label}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Menu;