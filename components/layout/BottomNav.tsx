export function BottomNav() {
  return (
    <nav
      className="
        h-14
        w-full
        border-t
        border-neutral-200
        bg-white
        flex
        items-center
        justify-around
        text-xs
        text-neutral-600
        shrink-0
      "
    >
      <div>Home</div>
      <div>Scan</div>
      <div>Pantry</div>
      <div>List</div>
    </nav>
  );
}
