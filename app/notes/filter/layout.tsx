import css from './layout.module.css'
type Props = {
      children: React.ReactNode,
  sidebar : React.ReactNode,
}

export default function NoteLayout({
  children,
  sidebar,
}: Props) {
    return (
        <section className={css.container}>
            <aside className={css.sidebar}> {sidebar}</aside>
            <div className={css.notesWrapper}> { children}</div>
      </section>
  );
};
