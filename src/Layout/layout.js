import { NavLink, Outlet } from 'react-router-dom';
import './layout.module.css';

export default function Layout() {
  return (
    <div className='layout'>
      <nav>
        <ul>
          <li>
            <NavLink to='/bdrs-generator'>BORDER_RADIUS GENERATOR</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

// className={({ isActive }) =>
// isActive ? styles.active : styles.inactive
// }
