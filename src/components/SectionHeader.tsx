export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="overflow-hidden pb-[0.1em]">
      <h2 data-entrance="title" className="text-h1 text-balance">
        {title}
      </h2>
    </div>
  )
}
