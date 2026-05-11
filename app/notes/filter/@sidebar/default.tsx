import Link from 'next/link';
import css from './SidebarNotes.module.css'


export default async function SidebarNotes() {
    const tags = ["Todo","Work","Personal","Meeting","Shopping"];

    return ( 
        <ul className={css.menuList}>
         <li  className={css.menuItem}>
        <Link
         href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
        </li>
            {tags.map((tag) =>
      <li key={tag} className={css.menuItem}>
        <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
          {tag}
        </Link>
        </li>
     )}
    </ul>
  );
}