import NavLinks from "./nav-link";
export default function Nav() {
  return (
    <nav className='flex space-x-1 bg-card rounded-lg p-1 shadow-soft mb-8'>
      <NavLinks />
    </nav>
  );
}
