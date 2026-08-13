/**
 * Header component.
 *
 * Renders the application's title bar at the top of every page. This
 * component receives no props in Lab A. In a later lab it will receive
 * a logged-in user object and display the user's name plus a logout
 * button.
 */

import { useAuth } from '../auth/AuthContext';

export function Header() {
  const { user } = useAuth();

  async function handleLogout() {
    window.location.href = '/logout';
  }

  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>MD282 Bank</h1>
          <p className="tagline">Online Banking</p>
        </div>
        {user && (
          <div className="header-user">
            <span className="user-name">Welcome, {user.preferredUsername}</span>
            <button type="button" className="sign-out-button btn ghost" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
