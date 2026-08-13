/**
 * Header component.
 *
 * Renders the application's title bar at the top of every page. This
 * component receives no props in Lab A. In a later lab it will receive
 * a logged-in user object and display the user's name plus a logout
 * button.
 */

import { useAuth } from '../auth/AuthContext';

type HeaderProps = {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
};

export function Header({ onToggleSidebar, sidebarOpen = true }: HeaderProps) {
  const { user } = useAuth();

  async function handleLogout() {
    window.location.href = '/logout';
  }

  return (
    <header className="header">
      <div className="header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            aria-pressed={!sidebarOpen}
            aria-label="Toggle sidebar"
            className="sidebar-toggle btn ghost"
            onClick={onToggleSidebar}
          >
            ☰
          </button>
          <div className="brand">
            <img src="/logo-bank.png" alt="Bank logo" className="bank-logo" />
            <div>
              <h1>MD282 Bank</h1>
              <p className="tagline">Online Banking</p>
            </div>
          </div>
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
